import { useImperativeHandle, useMemo, useState, type ReactNode, type Ref } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CircleCheck, Eye, IdCard, ShieldCheck, TriangleAlert, Upload } from 'lucide-react'
import { ProCard } from '@/modules/ecole/espace-pro/components/ProBlocks'
import { proInput } from '@/modules/ecole/espace-pro/proStyles'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useAccords, useFichiers, usePiecesEtablissement } from '@/data/hooks'
import { Badge } from '@/shared/ui/Badge'
import { ListeAccords } from '@/shared/forms/Accords'
import { accordEnSaisie, accordVide, accordVierge, enregistrerAccord, erreursAccord, etatAccord, NATURES, schemaAccord, supprimerAccord, type AccordSaisi } from '@/shared/utils/accords'
import { lireFichier, tailleFichier, telecharger, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'
import type { AccordEtablissement, NatureAccord, PieceEtablissement } from '@/shared/types'

const TON_ETAT = { enCours: 'green', bientot: 'amber', expire: 'red' } as const

/** Ce que la page Profil demande à l'onglet : enregistrer les accords (faux s'il reste des erreurs), annuler la saisie. */
export type ControleAccords = { enregistrer: () => Promise<boolean>; annuler: () => void }

/** Bouton « Importer / Remplacer » : un champ fichier caché. */
function ChoisirFichier({ libelle, onFichier }: { libelle: string; onFichier: (f: File) => void }) {
  return (
    <label className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3.5 text-[13.5px] font-semibold text-brand-700 hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-500">
      <Upload className="size-4" aria-hidden />
      {libelle}
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFichier(f) }} />
    </label>
  )
}

/** Une ligne de document : vignette, nom, taille, actions. */
function LigneDocument({ nom, detail, manquant, children }: { nom: string; detail: string; manquant?: boolean; children: ReactNode }) {
  return (
    <div className={manquant ? 'flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2' : 'flex flex-wrap items-center gap-3 rounded-xl bg-[#f3f6fc] px-3 py-2'}>
      {manquant ? <TriangleAlert className="size-6 shrink-0 text-amber-600" aria-hidden /> : <span className="grid h-10 w-9 shrink-0 place-items-center rounded-md bg-rose-600 text-[10px] font-extrabold text-white">{(nom.split('.').pop() || 'PDF').toUpperCase().slice(0, 4).replace(/^(?!PDF|JPG|JPEG|PNG).*/, 'PDF')}</span>}
      <span className="min-w-[160px] flex-1 leading-tight">
        <b className="line-clamp-2 block text-[14.5px] leading-snug break-words text-navy-900">{nom}</b>
        <span className="text-[13px] text-navy-900">{detail}</span>
      </span>
      <span className="flex items-center gap-2">{children}</span>
    </div>
  )
}

/**
 * Profil › Agrément & documents. Les accords de création et d'ouverture se remplissent sur la page
 * (un bloc par accord, « Ajouter un autre accord… ») et s'enregistrent avec
 * les boutons du bas, comme le reste du profil. Puis le NIU et son certificat.
 */
export function AgrementEtDocuments({ niu, changerNiu, ref }: { niu: string; changerNiu: (v: string) => void; ref?: Ref<ControleAccords> }) {
  const { t } = useTranslation('pro', { keyPrefix: 'profil' })
  const { t: tc } = useTranslation('common')
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
        toast.error(t('accreditation.fixErrors'))
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
    else toast(t('documents.noFile'))
  }
  const tropLourd = (f: File) => {
    if (f.size <= TAILLE_MAX_DOCUMENT) return false
    toast.error(t('documents.tooBig'))
    return true
  }
  const nouveauFichier = async (f: File) => data.create('fichiers', { nom: f.name, type: f.type, taille: f.size, dataUrl: await lireFichier(f) }, 'fichier')
  // Certificat du NIU : remplacé s'il existe
  const documentNiu = async (f: File) => {
    if (tropLourd(f)) return
    const fichier = await nouveauFichier(f)
    const champs = { nom: f.name, taille: tailleFichier(f.size), fichierId: fichier.id }
    if (certificat) {
      await data.update('piecesEtablissement', certificat.id, champs)
      if (certificat.fichierId) await data.remove('fichiers', certificat.fichierId)
    } else await data.create('piecesEtablissement', { etablissementId: ecole.id, cle: 'niu', statut: 'Validé', ...champs }, 'piece')
    toast.success(t('documents.sent', { name: f.name }))
  }
  const nomPiece = (p: PieceEtablissement) => p.nom || (p.cle ? t(`documents.items.${p.cle}`) : '')

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_400px]">
      <ProCard title={t('accreditation.title')} icon={<ShieldCheck />} subtitle={t('accreditation.intro')}>
        <div className="space-y-5">
          {NATURES.map((n, k) => (
            <div key={n} className={k ? 'border-t border-line pt-5' : undefined}>
              <ListeAccords
                nature={n}
                saisis={saisis[n]}
                onChange={(liste) => setValue(n, liste, { shouldValidate: essaye })}
                erreurs={(i) => erreursAccord(formState.errors[n]?.[i])}
                etat={(a) => {
                  const enregistre = accords.find((x) => x.id === a.id)
                  if (!enregistre) return null
                  const etat = etatAccord(enregistre)
                  return <Badge tone={TON_ETAT[etat]}>{tc(`accords.etats.${etat}`)}</Badge>
                }}
                onVoir={(a) => {
                  const enregistre = accords.find((x) => x.id === a.id)
                  return enregistre && (enregistre.fichierId || enregistre.taille) ? () => voir(enregistre.fichierId) : undefined
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-[#e5f7ea] px-4 py-3">
          <CircleCheck className="size-8 fill-emerald-600 text-white" aria-hidden />
          <div className="min-w-[180px] flex-1">
            <p className="text-[17px] font-bold text-emerald-700">{t('accreditation.verified')}</p>
            <p className="text-[14px] text-navy-900">{t('accreditation.verifiedText')}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-600 bg-white px-4 py-1 text-[15px] font-semibold text-emerald-700">{t('accreditation.compliant')}</span>
        </div>
      </ProCard>

      <div className="space-y-4">
        <ProCard title={t('accreditation.niuTitle')} icon={<IdCard />}>
          <label className="block">
            <span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('accreditation.taxNumber')} <span className="text-rose-500">*</span></span>
            <input className={proInput} value={niu} onChange={(e) => changerNiu(e.target.value)} placeholder={t('accreditation.niuExample')} />
          </label>
          <div className="mt-3">
            {certificat && (certificat.fichierId || certificat.taille) ? (
              <LigneDocument nom={nomPiece(certificat)} detail={t('documents.fileSize', { size: certificat.taille })}>
                <button type="button" aria-label={t('documents.view')} onClick={() => voir(certificat.fichierId)} className="grid size-9 place-items-center rounded-full text-brand-600 hover:bg-white"><Eye className="size-5" /></button>
                <ChoisirFichier libelle={tc('accords.champs.remplacer')} onFichier={(f) => void documentNiu(f)} />
              </LigneDocument>
            ) : (
              <LigneDocument manquant nom={t('accreditation.niuMissing')} detail={tc('accords.champs.formats')}>
                <ChoisirFichier libelle={tc('accords.champs.importer')} onFichier={(f) => void documentNiu(f)} />
              </LigneDocument>
            )}
          </div>
        </ProCard>
      </div>
    </div>
  )
}
