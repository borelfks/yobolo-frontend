import { useId, useImperativeHandle, useMemo, useState, type Ref } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ShieldCheck } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useAccords, useFichiers, usePiecesEtablissement } from '@/data/hooks'
import { Badge } from '@/shared/shadcn/badge'
import { Input } from '@/shared/shadcn/input'
import { Champ, PieceAJoindre } from '@/shared/blocs/Formulaire'
import { ListeAccords } from '@/shared/forms/Accords'
import { accordEnSaisie, accordVide, accordVierge, enregistrerAccord, erreursAccord, etatAccord, NATURES, schemaAccord, supprimerAccord, type AccordSaisi } from '@/shared/utils/accords'
import { lireFichier, tailleFichier, telecharger, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'
import type { AccordEtablissement, NatureAccord } from '@/shared/types'
import { CartePro } from '@/modules/ecole/espace-pro/components/BlocsPro'

const TON_ETAT = { enCours: 'green', bientot: 'amber', expire: 'red' } as const

/** Ce que la page Profil demande à l'onglet : enregistrer les accords (faux s'il reste des erreurs), annuler la saisie. */
export type ControleAccords = { enregistrer: () => Promise<boolean>; annuler: () => void }

/**
 * Profil › Agrément & documents : les accords de création et d'ouverture
 * (un bloc par accord, avec son document), enregistrés avec le bouton du bas
 * comme le reste du profil ; puis le NIU et son certificat.
 */
export function Agrement({ niu, changerNiu, erreurNiu, ref }: { niu: string; changerNiu: (v: string) => void; erreurNiu?: string; ref?: Ref<ControleAccords> }) {
  const { t } = useTranslation('pro', { keyPrefix: 'profil.agrement' })
  const { t: tc } = useTranslation('common')
  const id = useId()
  const { ecole } = useMonEcole()
  const accords = useAccords(ecole.id)
  const pieces = usePiecesEtablissement(ecole.id)
  const fichiers = useFichiers()
  const certificat = pieces.find((p) => p.cle === 'niu')

  // Les accords en saisie, par nature : ceux de la base, ou un bloc vide s'il n'y en a pas encore.
  const depart = (n: NatureAccord, liste: AccordEtablissement[] = accords): AccordSaisi[] => {
    const deCetteNature = liste.filter((a) => a.nature === n)
    return deCetteNature.length ? deCetteNature.map(accordEnSaisie) : [accordVide()]
  }
  const schema = useMemo(() => z.object({ creation: z.array(schemaAccord(tc)), ouverture: z.array(schemaAccord(tc)) }), [tc])
  const { watch, setValue, reset, trigger, getValues, formState } = useForm({ resolver: zodResolver(schema), defaultValues: { creation: depart('creation'), ouverture: depart('ouverture') } })
  const saisis = { creation: watch('creation'), ouverture: watch('ouverture') }
  // Après un premier essai d'enregistrement, les messages suivent la saisie.
  const [essaye, setEssaye] = useState(false)

  useImperativeHandle(ref, () => ({
    enregistrer: async () => {
      setEssaye(true)
      // Un bloc laissé vide est ignoré ; les autres doivent être complets.
      for (const n of NATURES) setValue(n, getValues(n).filter((a) => !accordVierge(a)))
      if (!(await trigger())) {
        toast.error(t('erreurs'))
        return false
      }
      const enregistres: AccordEtablissement[] = []
      for (const n of NATURES) {
        const liste = getValues(n)
        const gardes = new Set(liste.map((a) => a.id).filter(Boolean))
        for (const a of accords) if (a.nature === n && !gardes.has(a.id)) await supprimerAccord(a)
        for (const a of liste) {
          const r = await enregistrerAccord(ecole.id, n, a, accords.find((x) => x.id === a.id))
          if (r) enregistres.push(r)
        }
      }
      reset({ creation: depart('creation', enregistres), ouverture: depart('ouverture', enregistres) })
      setEssaye(false)
      return true
    },
    annuler: () => {
      reset({ creation: depart('creation'), ouverture: depart('ouverture') })
      setEssaye(false)
    },
  }))

  const voir = (fichierId?: string) => {
    const f = fichiers.find((x) => x.id === fichierId)
    if (f) telecharger(f.dataUrl, f.nom)
    else toast(t('pasDeFichier'))
  }
  // Certificat du NIU : enregistré tout de suite, il remplace le précédent.
  const documentNiu = async (f: File) => {
    if (f.size > TAILLE_MAX_DOCUMENT) return void toast.error(t('tropLourd'))
    const fichier = await data.create('fichiers', { nom: f.name, type: f.type, taille: f.size, dataUrl: await lireFichier(f) }, 'fichier')
    const champs = { nom: f.name, taille: tailleFichier(f.size), fichierId: fichier.id }
    if (certificat) {
      await data.update('piecesEtablissement', certificat.id, champs)
      if (certificat.fichierId) await data.remove('fichiers', certificat.fichierId)
    } else await data.create('piecesEtablissement', { etablissementId: ecole.id, cle: 'niu', statut: 'Validé', ...champs }, 'piece')
    toast.success(t('certificatEnvoye', { name: f.name }))
  }
  const aCertificat = !!certificat && !!(certificat.fichierId || certificat.taille)

  return (
    <>
      <CartePro titre={t('titre')} description={t('intro')}>
        {NATURES.map((n) => (
          <ListeAccords
            key={n}
            nature={n}
            className="border-t border-border pt-3.5"
            saisis={saisis[n]}
            onChange={(liste) => setValue(n, liste, { shouldValidate: essaye })}
            erreurs={(i) => erreursAccord(formState.errors[n]?.[i])}
            etat={(a) => {
              const enregistre = accords.find((x) => x.id === a.id)
              if (!enregistre) return null
              const etat = etatAccord(enregistre)
              return <Badge variant={TON_ETAT[etat]}>{tc(`accords.etats.${etat}`)}</Badge>
            }}
            onVoir={(a) => {
              const enregistre = accords.find((x) => x.id === a.id)
              return enregistre && (enregistre.fichierId || enregistre.taille) ? () => voir(enregistre.fichierId) : undefined
            }}
          />
        ))}
        <div className="flex flex-wrap items-center gap-3 rounded-md bg-success-soft px-3.5 py-3">
          <ShieldCheck className="size-6 shrink-0 text-success" aria-hidden />
          <span className="flex flex-[1_1_220px] flex-col gap-0.5">
            <b className="text-ui text-success">{t('verifie')}</b>
            <span className="text-meta text-foreground">{t('verifieTexte')}</span>
          </span>
          <Badge variant="green" className="bg-card">
            {t('conforme')}
          </Badge>
        </div>
      </CartePro>
      <CartePro titre={t('niu.titre')}>
        <Champ id={`${id}-niu`} label={t('niu.numero')} requis erreur={erreurNiu}>
          <Input id={`${id}-niu`} value={niu} onChange={(e) => changerNiu(e.target.value)} placeholder={t('niu.exemple')} aria-invalid={!!erreurNiu || undefined} />
        </Champ>
        <PieceAJoindre
          titre={t('niu.certificat')}
          aide={tc('accords.champs.formats')}
          nomFichier={aCertificat ? `${certificat.nom} · ${certificat.taille}` : undefined}
          onFichier={(f) => void documentNiu(f)}
          onVoir={aCertificat ? () => voir(certificat.fichierId) : undefined}
        />
      </CartePro>
    </>
  )
}
