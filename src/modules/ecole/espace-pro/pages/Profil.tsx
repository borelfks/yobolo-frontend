import { useRef, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useMonEcole, useSession } from '@/modules/compte/auth/hooks/useSession'
import { numeroPropre, numeroValide } from '@/modules/compte/auth/authOtp'
import { ecoleUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { data, useCollection } from '@/data'
import { useParametres } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'
import { EntetePro, PiedFormulaire, SquelettePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { Agrement, type ControleAccords } from '@/modules/ecole/espace-pro/components/profil/Agrement'
import { BanniereProfil } from '@/modules/ecole/espace-pro/components/profil/BanniereProfil'
import { Coordonnees } from '@/modules/ecole/espace-pro/components/profil/Coordonnees'
import { InfosGenerales } from '@/modules/ecole/espace-pro/components/profil/InfosGenerales'
import { Medias } from '@/modules/ecole/espace-pro/components/profil/Medias'
import { ModaleSiteWeb } from '@/modules/ecole/espace-pro/components/profil/ModaleSiteWeb'
import { useFormationsEcole } from '@/modules/ecole/espace-pro/hooks/useFormationsEcole'
import { patchEtablissement, prefixer, sousCles, type ProfilForm, type Valeurs } from '@/modules/ecole/espace-pro/proData'

const ONGLETS = ['', 'coordonnees', 'agrement', 'medias'] as const
type Onglet = (typeof ONGLETS)[number]
const CLES_ONGLETS = { '': 'general', coordonnees: 'coordonnees', agrement: 'agrement', medias: 'medias' } as const
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Profil de l'établissement (canevas 3.1 à 3.4) : en-tête avec bannière, quatre onglets, « Enregistrer les modifications ». */
export function Profil() {
  return (
    <ChargementDonnees fallback={<SquelettePro cartes={3} onglets />}>
      <ProfilEcole />
    </ChargementDonnees>
  )
}

function ProfilEcole() {
  const { t } = useTranslation('pro', { keyPrefix: 'profil' })
  const { t: tp } = useTranslation('pro')
  const { tab = '' } = useParams({ strict: false })
  const onglet: Onglet = ONGLETS.find((o) => o === tab) ?? ''
  const { ecole } = useMonEcole()
  const { account } = useSession()
  const { lignes } = useFormationsEcole()
  const reglages = useParametres(ecole.id)
  const demandes = useCollection('demandesAssistance')
  const enregistres = sousCles('profil', reglages)
  const [saisie, setSaisie] = useState<Valeurs>({})
  const [erreurs, setErreurs] = useState<Record<string, string>>({})
  const [proposerSite, setProposerSite] = useState(false)
  const [sitePropose, setSitePropose] = useState(false)
  const [enCours, setEnCours] = useState(false)
  const accordsRef = useRef<ControleAccords>(null)

  const lire = (cle: string) => saisie[cle] ?? enregistres[cle]
  const form: ProfilForm = {
    texte: (cle, defaut) => {
      const v = lire(cle)
      return typeof v === 'string' ? v : defaut
    },
    oui: (cle, defaut) => {
      const v = lire(cle)
      return typeof v === 'boolean' ? v : defaut
    },
    changer: (cle, v) => setSaisie((s) => ({ ...s, [cle]: v })),
    enregistre: (cle, defaut) => {
      const v = enregistres[cle]
      return typeof v === 'string' ? v : defaut
    },
    erreur: (cle) => erreurs[cle],
  }

  /** Les champs obligatoires du profil ; les messages disent comment corriger. */
  const verifier = () => {
    const e: Record<string, string> = {}
    // Un champ se vérifie sur son onglet, ou dès qu'il a été modifié.
    const aVerifier = (champ: string, sur: Onglet) => onglet === sur || champ in saisie
    if (aVerifier('nom', '') && !form.texte('nom', ecole.nom).trim()) e.nom = t('erreurs.nom')
    if (aVerifier('telephone', 'coordonnees') && !numeroValide(form.texte('telephone', ecole.telephone))) e.telephone = t('erreurs.telephone')
    if (aVerifier('email', 'coordonnees') && !EMAIL.test(form.texte('email', ecole.email).trim())) e.email = t('erreurs.email')
    if (aVerifier('niu', 'agrement') && !form.texte('niu', ecole.niu ?? '').trim()) e.niu = t('erreurs.niu')
    setErreurs(e)
    return e
  }

  // Enregistrer : réglages `profil.*` et fiche publique (champs du type Etablissement), puis les accords de l'onglet Agrément.
  const enregistrer = async () => {
    const e = verifier()
    if (Object.keys(e).length > 0) return void toast.error(t('erreurs.corriger'))
    setEnCours(true)
    try {
      if (accordsRef.current && !(await accordsRef.current.enregistrer())) return
      const valeurs: Valeurs = { ...enregistres, ...saisie }
      for (const cle of ['telephone', 'telephone2'] as const) if (typeof valeurs[cle] === 'string' && valeurs[cle]) valeurs[cle] = numeroPropre(valeurs[cle] as string)
      await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, ...prefixer('profil', valeurs) } })
      const patch = patchEtablissement(valeurs)
      if (Object.keys(patch).length > 0) await data.update('etablissements', ecole.id, patch)
      setSaisie({})
      toast.success(tp('commun.enregistre'))
      // Sans site web : « Vous n’avez pas encore de site web ? », une fois par visite, jamais après une demande.
      const site = typeof valeurs.siteWeb === 'string' ? valeurs.siteWeb : (ecole.siteWeb ?? '')
      const dejaDemande = !!account && demandes.some((d) => d.compteId === account.id && d.sujet === t('siteWeb.sujet', { lng: 'fr' }))
      if (!site.trim() && !dejaDemande && !sitePropose) {
        setProposerSite(true)
        setSitePropose(true)
      }
    } finally {
      setEnCours(false)
    }
  }
  const annuler = () => {
    setSaisie({})
    setErreurs({})
    accordsRef.current?.annuler()
    toast(tp('commun.annule'))
  }

  const cle = CLES_ONGLETS[onglet]
  return (
    <div className="flex flex-col gap-2">
      <EntetePro
        haut={<BanniereProfil ecole={ecole} />}
        miettes={[{ label: t('titre'), to: ROUTES.pro.profile() }, ...(onglet ? [{ label: t(`onglets.${cle}`) }] : [])]}
        titre={t('titre')}
        sousTitre={t('sousTitre')}
        actions={
          <Button asChild variant="secondary">
            <Lien to={ecoleUrl(ecole)}>{tp('commun.voirPagePublique')}</Lien>
          </Button>
        }
        onglets={ONGLETS.map((o) => ({ label: t(`onglets.${CLES_ONGLETS[o]}`), to: ROUTES.pro.profile(o || undefined) }))}
      />
      {onglet === '' && <InfosGenerales form={form} ecole={ecole} nbFormations={lignes.length} />}
      {onglet === 'coordonnees' && <Coordonnees form={form} ecole={ecole} />}
      {onglet === 'agrement' && <Agrement ref={accordsRef} niu={form.texte('niu', ecole.niu ?? '')} changerNiu={(v) => form.changer('niu', v)} erreurNiu={form.erreur('niu')} />}
      {onglet === 'medias' && <Medias ecole={ecole} />}
      {onglet !== 'medias' && (
        <PiedFormulaire>
          <Button variant="outline" onClick={annuler}>
            {tp('commun.annuler')}
          </Button>
          <Button loading={enCours} onClick={() => void enregistrer()}>
            {tp('commun.enregistrerModifications')}
          </Button>
        </PiedFormulaire>
      )}
      <ModaleSiteWeb open={proposerSite} onClose={() => setProposerSite(false)} />
    </div>
  )
}
