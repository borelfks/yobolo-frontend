import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Building2, Check, CircleCheck, FileText, Mail, ShieldCheck, Upload, Users } from 'lucide-react'
import { AuthCard } from '@/app/layouts/AuthLayout'
import { Badge } from '@/shared/components/ui/Badge'
import { Img } from '@/shared/components/ui/Img'
import { Checkbox, Field, Input, PhoneInput, Radio, Select } from '@/shared/components/forms/Fields'
import { SelectionGeographique } from '@/shared/components/forms/SelectionGeographique'
import { useSession } from '@/features/auth/hooks/useSession'
import { VerificationCode } from '@/features/auth/components/VerificationCode'
import { chiffresDuNumero, formaterNumero, numeroValide } from '@/features/auth/authOtp'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { useComptes, useDecoupage } from '@/data/hooks'
import { data } from '@/data'
import type { Compte, Lieu } from '@/shared/types'
import { normaliserIdentifiant, protegerMotDePasse } from '@/shared/utils/motDePasse'
import { villeDuLieu } from '@/shared/utils/geographie'
import { CIVILITES, NATIONALITES } from '@/shared/utils/personne'
import { ChampMotDePasse, JaugeMotDePasse } from '@/shared/components/forms/MotDePasse'
import { ListeAccords } from '@/shared/components/forms/ListeAccords'
import { accordVide, enregistrerAccord, erreursAccord, NATURES, schemaAccord, type AccordSaisi } from '@/shared/utils/accords'
import { lireFichier, tailleFichier, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'

type Profil = 'ecole' | 'consultant' | 'entreprise' | 'personne'

/** Titre et description de chaque profil : auth.json, inscription.profiles.<profil>. */
const profils: { value: Profil; visuel: ReactNode }[] = [
  { value: 'ecole', visuel: <Img src="/images/maquette/auth-ecole.jpg" alt="" className="size-14 rounded-lg" /> },
  { value: 'consultant', visuel: <Img src="/images/maquette/auth-consultant.jpg" alt="" className="size-14 rounded-full" /> },
  { value: 'entreprise', visuel: <span className="grid size-14 place-items-center text-brand-600"><Building2 className="size-11" /></span> },
  { value: 'personne', visuel: <span className="grid size-14 place-items-center rounded-full bg-[#e3ebfb] text-brand-600"><Users className="size-8 fill-brand-600" /></span> },
]

/** Les étapes : celles de yibolo-client pour la personne physique ; celles de la maquette, plus le code, pour l'école. */
type Etape = 'profil' | 'vous' | 'acces' | 'infos' | 'code' | 'verification'
const ETAPES: Record<'personne' | 'ecole', Etape[]> = {
  personne: ['profil', 'vous', 'acces', 'code'],
  ecole: ['profil', 'infos', 'code', 'verification'],
}

function Steps({ etapes, current }: { etapes: Etape[]; current: number }) {
  const { t } = useTranslation('auth')
  return (
    <ol className="mt-5 flex items-start">
      {etapes.map((e, i) => (
        <Fragment key={e}>
          <li className="flex w-16 shrink-0 flex-col items-center gap-1 sm:w-20">
            <span className={cn('grid size-8 place-items-center rounded-full text-[15px] font-bold', i < current ? 'bg-emerald-500 text-white' : i === current ? 'bg-brand-600 text-white' : 'border border-[#c9d4ea] bg-white text-navy-900')}>
              {i < current ? <Check className="size-4" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('text-center text-[13.5px] text-navy-900', i === current && 'font-bold text-brand-600')}>{t(`inscription.steps.${e}`)}</span>
          </li>
          {i < etapes.length - 1 && <li aria-hidden className={cn('mt-4 h-px flex-1', i < current ? 'bg-brand-600' : 'bg-[#c9d4ea]')} />}
        </Fragment>
      ))}
    </ol>
  )
}

const primaire = 'inline-flex min-h-11 py-2 leading-tight text-center items-center justify-center gap-2 rounded-full bg-brand-600 text-[16px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60'
const secondaire = 'inline-flex min-h-11 py-2 leading-tight items-center justify-center gap-2 rounded-full border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50'

function Navigation({ onRetour, suivant, onSuivant, type = 'button' }: { onRetour: () => void; suivant: string; onSuivant?: () => void; type?: 'button' | 'submit' }) {
  const { t } = useTranslation('auth')
  return (
    <div className="grid grid-cols-[1fr_1.4fr] gap-4 pt-2">
      <button type="button" onClick={onRetour} className={secondaire}>
        <ArrowLeft className="size-5" /> {t('inscription.back')}
      </button>
      <button type={type} onClick={onSuivant} className={primaire}>
        {suivant} <ArrowRight className="size-5" />
      </button>
    </div>
  )
}

export function Inscription() {
  const { t } = useTranslation('auth')
  const { t: tc } = useTranslation('common')
  const comptes = useComptes()
  // Une école dont le numéro vient d'être confirmé à la connexion reprend ici, à l'étape des pièces.
  const reprise = (useLocation().state as { reprise?: string } | null)?.reprise
  const [brouillon, setBrouillon] = useState<Compte | null>(() => comptes.find((c) => c.id === reprise) ?? null)
  const [profil, setProfil] = useState<Profil>('ecole')
  const [etape, setEtape] = useState<Etape>(brouillon ? 'verification' : 'profil')
  const { signIn } = useSession()
  const navigate = useNavigate()
  const { arrondissements } = useDecoupage()
  const [envoi, setEnvoi] = useState(false)
  const etapes = ETAPES[profil === 'personne' ? 'personne' : 'ecole']
  // Le compte en cours de création (le sien) ne compte pas comme « déjà utilisé ».
  const autres = comptes.filter((c) => c.id !== brouillon?.id)
  const numeroPris = (tel: string) => autres.some((c) => chiffresDuNumero(c.telephone) === chiffresDuNumero(tel))
  const emailPris = (email: string) => !!email && autres.some((c) => normaliserIdentifiant(c.identifiant) === normaliserIdentifiant(email))

  /**
   * Le compte est enregistré dès l'envoi du code, numéro pas encore confirmé :
   * si la personne part sans saisir le code, la connexion le lui redemande.
   * Un retour à l'étape précédente met à jour ce même compte.
   */
  const enregistrerBrouillon = async (champs: Omit<Compte, 'id'>) => {
    const enregistre = brouillon ? await data.update('comptes', brouillon.id, champs) : await data.create('comptes', champs, 'compte')
    if (enregistre) setBrouillon(enregistre)
    return enregistre
  }

  /* --- Formulaire de la personne physique (champs de yibolo-client) --- */
  const schemaPersonne = useMemo(
    () =>
      z
        .object({
          prenom: z.string().trim().min(1, t('inscription.errors.prenom')),
          nom: z.string().trim().min(1, t('inscription.errors.nom')),
          civilite: z.enum(CIVILITES),
          nationalite: z.string().min(1, t('inscription.errors.nationalite')),
          region: z.string().min(1, tc('geographie.erreurs.region')),
          departement: z.string().min(1, tc('geographie.erreurs.departement')),
          arrondissement: z.string().min(1, tc('geographie.erreurs.arrondissement')),
          quartier: z.string().trim().min(1, tc('geographie.erreurs.quartier')),
          telephone: z.string().refine(numeroValide, t('inscription.errors.phoneFormat')),
          whatsapp: z.boolean(),
          email: z.string().trim().refine((v) => v === '' || z.email().safeParse(v).success, t('inscription.errors.email')),
          motDePasse: z.string().min(8, t('inscription.errors.passwordLength')),
          confirmation: z.string(),
        })
        .refine((v) => v.motDePasse === v.confirmation, { path: ['confirmation'], message: t('inscription.errors.passwordMatch') }),
    [t, tc],
  )
  const { register: registerP, watch: watchP, getValues: getP, setError: errorP, trigger: triggerP, formState: etatP, setValue: setP } = useForm({
    resolver: zodResolver(schemaPersonne),
    // Revalidé à chaque saisie une fois le champ quitté : un message disparaît dès que le champ est corrigé.
    mode: 'onTouched',
    defaultValues: { prenom: '', nom: '', civilite: 'Monsieur' as const, nationalite: '', region: '', departement: '', arrondissement: '', quartier: '', telephone: '', whatsapp: false, email: '', motDePasse: '', confirmation: '' },
  })

  /* --- Formulaire de l'école (maquette), avec la sélection géographique --- */
  const schemaEcole = useMemo(
    () =>
      z
        .object({
          nom: z.string().trim().min(2, t('inscription.errors.required')),
          telephone: z.string().refine(numeroValide, t('inscription.errors.phoneFormat')),
          email: z.email(t('inscription.errors.email')),
          region: z.string().min(1, tc('geographie.erreurs.region')),
          departement: z.string().min(1, tc('geographie.erreurs.departement')),
          arrondissement: z.string().min(1, tc('geographie.erreurs.arrondissement')),
          quartier: z.string().trim().min(1, tc('geographie.erreurs.quartier')),
          motDePasse: z.string().min(8, t('inscription.errors.passwordLength')),
          confirmation: z.string(),
        })
        .refine((v) => v.motDePasse === v.confirmation, { path: ['confirmation'], message: t('inscription.errors.passwordMatch') }),
    [t, tc],
  )
  const { register: registerE, watch: watchE, getValues: getE, setError: errorE, handleSubmit: handleSubmitE, formState: etatE, setValue: setE } = useForm({
    resolver: zodResolver(schemaEcole),
    mode: 'onTouched',
    // Une reprise après la connexion repart des informations déjà enregistrées (sauf le mot de passe).
    defaultValues: {
      nom: brouillon?.name ?? '',
      telephone: brouillon ? chiffresDuNumero(brouillon.telephone).slice(-9) : '',
      email: brouillon?.identifiant ?? '',
      region: brouillon?.region ?? '',
      departement: brouillon?.departement ?? '',
      arrondissement: brouillon?.arrondissement ?? '',
      quartier: brouillon?.quartier ?? '',
      motDePasse: '',
      confirmation: '',
    },
  })

  /* --- École, étape « Documents » : accords de création et d'ouverture (au moins un de chaque, chacun avec son document), NIU et son certificat --- */
  const schemaDocuments = useMemo(
    () =>
      z.object({
        creation: z.array(schemaAccord(tc)).min(1),
        ouverture: z.array(schemaAccord(tc)).min(1),
        niu: z.string().trim().min(1, t('inscription.verification.errors.niu')),
        certificat: z
          .custom<File | null>((v) => v instanceof File, t('inscription.verification.errors.certificat'))
          .refine((f) => !f || f.size <= TAILLE_MAX_DOCUMENT, tc('accords.erreurs.tropLourd')),
      }),
    [t, tc],
  )
  const { register: registerD, watch: watchD, setValue: setD, handleSubmit: handleSubmitD, formState: etatD } = useForm({
    resolver: zodResolver(schemaDocuments),
    defaultValues: { creation: [accordVide()], ouverture: [accordVide()], niu: '', certificat: null as File | null },
  })
  const accordsSaisis = { creation: watchD('creation'), ouverture: watchD('ouverture') }
  const certificat = watchD('certificat')

  // La sélection géographique (contrôlée) écrit dans le formulaire du profil choisi.
  const lieuPersonne: Lieu = { region: watchP('region'), departement: watchP('departement'), arrondissement: watchP('arrondissement'), quartier: watchP('quartier') }
  const lieuEcole: Lieu = { region: watchE('region'), departement: watchE('departement'), arrondissement: watchE('arrondissement'), quartier: watchE('quartier') }
  const changerLieu = (f: 'personne' | 'ecole', l: Lieu) => {
    const etat = f === 'personne' ? etatP : etatE
    const valider = etat.isSubmitted || Object.keys(etat.errors).length > 0
    // Les deux formulaires ont les mêmes quatre champs de lieu.
    const fixer = (f === 'personne' ? setP : setE) as (nom: keyof Lieu, valeur: string, options: { shouldValidate: boolean }) => void
    for (const cle of ['region', 'departement', 'arrondissement', 'quartier'] as const) fixer(cle, l[cle], { shouldValidate: valider })
  }
  const erreursLieu = (e: Partial<Record<keyof Lieu, { message?: string }>>) => ({ region: e.region?.message, departement: e.departement?.message, arrondissement: e.arrondissement?.message, quartier: e.quartier?.message })

  /** Personne physique, « Continuer » de « Votre accès » : le compte est enregistré, numéro à confirmer. */
  const enregistrerPersonne = async () => {
    const v = getP()
    setEnvoi(true)
    try {
      const telephone = formaterNumero(v.telephone)
      await enregistrerBrouillon({
        identifiant: v.email.trim() || telephone,
        telephone,
        role: 'utilisateur',
        name: `${v.prenom.trim()} ${v.nom.trim()}`,
        subtitle: 'Utilisateur',
        avatar: '',
        home: ROUTES.accueil,
        statut: 'Validé',
        prenom: v.prenom.trim(),
        nom: v.nom.trim(),
        civilite: v.civilite,
        nationalite: v.nationalite,
        region: v.region,
        departement: v.departement,
        arrondissement: v.arrondissement,
        ville: villeDuLieu(v, arrondissements),
        quartier: v.quartier.trim(),
        whatsapp: v.whatsapp,
        telephoneVerifie: false,
        motDePasse: await protegerMotDePasse(v.motDePasse),
      })
      setEtape('code')
    } catch {
      toast.error(t('inscription.errors.saveFailed'))
    } finally {
      setEnvoi(false)
    }
  }

  /** École, « Continuer » de « Infos » : le compte est enregistré (en vérification), numéro à confirmer. */
  const enregistrerEcole = async () => {
    const v = getE()
    setEnvoi(true)
    try {
      await enregistrerBrouillon({
        identifiant: v.email.trim(),
        telephone: formaterNumero(v.telephone),
        role: 'ipes',
        name: v.nom.trim(),
        subtitle: 'Administrateur',
        avatar: '',
        home: ROUTES.pro.root,
        region: v.region,
        departement: v.departement,
        arrondissement: v.arrondissement,
        ville: villeDuLieu(v, arrondissements),
        quartier: v.quartier.trim(),
        telephoneVerifie: false,
        statut: 'Validé',
        motDePasse: await protegerMotDePasse(v.motDePasse),
      })
      setEtape('code')
    } catch {
      toast.error(t('inscription.errors.saveFailed'))
    } finally {
      setEnvoi(false)
    }
  }

  /** Le bon code est saisi : le numéro est confirmé ; la personne est connectée, l'école passe aux pièces. */
  const numeroConfirme = async () => {
    if (!brouillon) return
    const confirme = await data.update('comptes', brouillon.id, { telephoneVerifie: true })
    if (!confirme) {
      toast.error(t('inscription.errors.saveFailed'))
      return
    }
    setBrouillon(confirme)
    if (confirme.role !== 'utilisateur') {
      setEtape('verification')
      return
    }
    signIn(confirme)
    toast.success(t('inscription.bienvenue', { name: confirme.prenom ?? confirme.name }))
    navigate(ROUTES.accueil)
  }

  /**
   * École, « Créer mon compte » : l'établissement est enregistré et rattaché au
   * compte, et l'école entre directement dans son espace professionnel (pas de
   * validation par YIBOLO, décision du 2026-11-27).
   */
  const soumettreEcole = async (documents: { creation: AccordSaisi[]; ouverture: AccordSaisi[]; niu: string; certificat: File | null }) => {
    if (!brouillon) return
    setEnvoi(true)
    try {
      const etablissement = await data.create(
        'etablissements',
        {
          nom: brouillon.name,
          sigle: '',
          type: 'IPES',
          region: brouillon.region ?? '',
          departement: brouillon.departement,
          arrondissement: brouillon.arrondissement,
          ville: brouillon.ville ?? '',
          quartier: brouillon.quartier ?? '',
          note: 0,
          avis: 0,
          image: '/images/maquette/ecoles-hero.jpg',
          filieres: [],
          formations: 0,
          description: '',
          telephone: brouillon.telephone,
          email: brouillon.identifiant,
          rentree: '',
          niu: documents.niu.trim(),
        },
        'etablissement',
      )
      for (const nature of NATURES) for (const accord of documents[nature]) await enregistrerAccord(etablissement.id, nature, accord)
      const c = documents.certificat
      if (c) {
        const fichier = await data.create('fichiers', { nom: c.name, type: c.type, taille: c.size, dataUrl: await lireFichier(c) }, 'fichier')
        await data.create('piecesEtablissement', { etablissementId: etablissement.id, cle: 'niu', nom: c.name, taille: tailleFichier(c.size), statut: 'Validé', fichierId: fichier.id }, 'piece')
      }
      const rattache = (await data.update('comptes', brouillon.id, { ecoleId: etablissement.id })) ?? { ...brouillon, ecoleId: etablissement.id }
      signIn(rattache)
      toast.success(t('connexion.welcome', { name: rattache.name }))
      navigate(ROUTES.accueil)
    } catch {
      toast.error(t('inscription.errors.saveFailed'))
    } finally {
      setEnvoi(false)
    }
  }

  const ep = etatP.errors
  const ee = etatE.errors
  const titreEtape = (titre: string, texte: string) => (
    <div>
      <h2 className="text-[22px] font-bold text-navy-900">{titre}</h2>
      <p className="text-[14.5px] text-navy-900">{texte}</p>
    </div>
  )

  return (
    <AuthCard title={t('inscription.title')}>
      <Steps etapes={etapes} current={etapes.indexOf(etape)} />

      {etape === 'profil' && (
        <div className="mt-6">
          {titreEtape(t('inscription.choose.title'), t('inscription.choose.text'))}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profils.map((p) => {
              // Profils ouverts : École et Personne physique (décisions du 2026-11-24).
              const bientot = p.value !== 'ecole' && p.value !== 'personne'
              return (
                <button
                  key={p.value}
                  type="button"
                  disabled={bientot}
                  onClick={() => setProfil(p.value)}
                  className={cn(
                    'relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors',
                    bientot ? 'cursor-not-allowed border-line opacity-60' : profil === p.value ? 'border-brand-600 bg-[#f3f6fe] ring-2 ring-brand-600/40' : 'border-line hover:bg-slate-50',
                  )}
                >
                  {profil === p.value && <CircleCheck className="absolute top-3 right-3 size-6 fill-brand-600 text-white" />}
                  {p.visuel}
                  <span>
                    <span className="flex flex-wrap items-center gap-2 text-[16px] font-bold text-navy-900">
                      {t(`inscription.profiles.${p.value}.title`)}
                      {bientot && <Badge tone="gray">{t('inscription.comingSoon')}</Badge>}
                    </span>
                    {[t(`inscription.profiles.${p.value}.line1`), t(`inscription.profiles.${p.value}.line2`)].map((line) => (
                      <span key={line} className="block text-[13px] text-navy-900">{line}</span>
                    ))}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={() => setEtape(etapes[1]!)} className={cn(primaire, 'h-12 w-80 text-[17px]')}>
              {t('inscription.continue')} <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* --- Personne physique : « Vous » --- */}
      {etape === 'vous' && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            void triggerP(['prenom', 'nom', 'civilite', 'nationalite', 'region', 'departement', 'arrondissement', 'quartier']).then((ok) => ok && setEtape('acces'))
          }}
          className="mt-6 space-y-4"
        >
          {titreEtape(t('inscription.vous.title'), t('inscription.vous.text'))}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('inscription.champs.prenom')} required error={ep.prenom?.message}>
              <Input autoComplete="given-name" placeholder={t('inscription.exemples.prenom')} {...registerP('prenom')} />
            </Field>
            <Field label={t('inscription.champs.nom')} required error={ep.nom?.message}>
              <Input autoComplete="family-name" placeholder={t('inscription.exemples.nom')} {...registerP('nom')} />
            </Field>
          </div>
          <fieldset>
            <legend className="mb-1.5 text-sm font-bold text-navy-900">{t('inscription.champs.civilite')}</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {CIVILITES.map((c) => (
                <Radio key={c} value={c} label={tc(`personne.civilites.${c}`)} {...registerP('civilite')} />
              ))}
            </div>
          </fieldset>
          <Field label={t('inscription.champs.nationalite')} required error={ep.nationalite?.message}>
            <Select options={NATIONALITES.map((n) => ({ value: n, label: tc(`personne.nationalites.${n}`) }))} placeholder={t('inscription.champs.choisirNationalite')} {...registerP('nationalite')} />
          </Field>
          <fieldset className="space-y-1">
            <legend className="text-sm font-bold text-navy-900">{t('inscription.champs.residence')}</legend>
            <p className="pb-1 text-xs text-muted">{t('inscription.champs.residenceAide')}</p>
            <SelectionGeographique valeur={lieuPersonne} onChange={(l) => changerLieu('personne', l)} erreurs={erreursLieu(ep)} />
          </fieldset>
          <Navigation onRetour={() => setEtape('profil')} suivant={t('inscription.continue')} type="submit" />
        </form>
      )}

      {/* --- Personne physique : « Votre accès » --- */}
      {etape === 'acces' && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            void triggerP().then((ok) => {
              if (!ok) return
              const v = getP()
              if (numeroPris(v.telephone)) return errorP('telephone', { message: t('inscription.errors.phoneTaken') })
              if (emailPris(v.email)) return errorP('email', { message: t('inscription.errors.emailTaken') })
              void enregistrerPersonne()
            })
          }}
          className="mt-6 space-y-4"
        >
          {titreEtape(t('inscription.acces.title'), t('inscription.acces.text'))}
          <Field label={t('inscription.champs.telephone')} required error={ep.telephone?.message}>
            <PhoneInput autoComplete="tel" {...registerP('telephone')} />
          </Field>
          <Checkbox label={t('inscription.champs.whatsapp')} {...registerP('whatsapp')} />
          <Field label={t('inscription.champs.emailFacultatif')} error={ep.email?.message}>
            <Input type="email" autoComplete="email" placeholder={t('inscription.exemples.email')} {...registerP('email')} />
          </Field>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <Field label={t('inscription.champs.motDePasse')} required error={ep.motDePasse?.message}>
              <ChampMotDePasse autoComplete="new-password" {...registerP('motDePasse')} />
              <JaugeMotDePasse motDePasse={watchP('motDePasse')} aide={t('inscription.champs.motDePasseAide')} />
            </Field>
            <Field label={t('inscription.champs.confirmation')} required error={ep.confirmation?.message}>
              <ChampMotDePasse autoComplete="new-password" {...registerP('confirmation')} />
            </Field>
          </div>
          <p className="text-[13px] text-muted">
            <Trans t={t} i18nKey="inscription.cgu" components={{ lien: <Link to={ROUTES.terms} className="font-semibold text-brand-600 hover:underline" /> }} />
          </p>
          <Navigation onRetour={() => setEtape('vous')} suivant={t('inscription.continue')} type="submit" />
        </form>
      )}

      {/* --- École : « Infos » (maquette), lieu avec la sélection géographique --- */}
      {etape === 'infos' && (
        <form
          noValidate
          onSubmit={handleSubmitE((v) => {
            if (numeroPris(v.telephone)) return errorE('telephone', { message: t('inscription.errors.phoneTaken') })
            if (emailPris(v.email)) return errorE('email', { message: t('inscription.errors.emailTaken') })
            void enregistrerEcole()
          })}
          className="mt-6 space-y-4"
        >
          {titreEtape(t('inscription.infos.title'), t('inscription.infos.text'))}
          <Field label={t('inscription.infos.fields.nom')} required error={ee.nom?.message}>
            <Input icon={<Building2 />} {...registerE('nom')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('inscription.infos.fields.telephone')} required error={ee.telephone?.message}>
              <PhoneInput autoComplete="tel" {...registerE('telephone')} />
            </Field>
            <Field label={t('inscription.infos.fields.email')} required error={ee.email?.message}>
              <Input type="email" icon={<Mail />} autoComplete="email" {...registerE('email')} />
            </Field>
          </div>
          <fieldset className="space-y-1">
            <legend className="pb-1 text-sm font-bold text-navy-900">{t('inscription.champs.lieu')}</legend>
            <SelectionGeographique valeur={lieuEcole} onChange={(l) => changerLieu('ecole', l)} erreurs={erreursLieu(ee)} />
          </fieldset>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <Field label={t('inscription.infos.fields.motDePasse')} required error={ee.motDePasse?.message}>
              <ChampMotDePasse autoComplete="new-password" {...registerE('motDePasse')} />
              <JaugeMotDePasse motDePasse={watchE('motDePasse')} aide={t('inscription.champs.motDePasseAide')} />
            </Field>
            <Field label={t('inscription.infos.fields.confirmation')} required error={ee.confirmation?.message}>
              <ChampMotDePasse autoComplete="new-password" {...registerE('confirmation')} />
            </Field>
          </div>
          <Navigation onRetour={() => setEtape('profil')} suivant={t('inscription.continue')} type="submit" />
        </form>
      )}

      {/* --- Code reçu sur le téléphone (OTP) --- */}
      {etape === 'code' && (
        <div className="mt-6 space-y-4">
          {titreEtape(t('inscription.code.title'), t('inscription.code.text'))}
          {profil === 'personne' ? (
            <VerificationCode telephone={formaterNumero(getP('telephone'))} libelleBouton={t('inscription.creer')} onVerifie={numeroConfirme} />
          ) : (
            <VerificationCode telephone={formaterNumero(getE('telephone'))} onVerifie={numeroConfirme} />
          )}
          <button type="button" onClick={() => setEtape(profil === 'personne' ? 'acces' : 'infos')} className={cn(secondaire, 'w-full')}>
            <ArrowLeft className="size-5" /> {t('inscription.back')}
          </button>
        </div>
      )}

      {/* --- École : documents (accords de création et d'ouverture, NIU) --- */}
      {etape === 'verification' && (
        <form noValidate onSubmit={(ev) => void handleSubmitD(soumettreEcole)(ev)} className="mt-6 space-y-4">
          {titreEtape(t('inscription.verification.title', { profile: t('inscription.profiles.ecole.title') }), t('inscription.verification.text'))}
          {NATURES.map((n, k) => (
            <div key={n} className={k ? 'border-t border-line pt-4' : undefined}>
              <ListeAccords nature={n} saisis={accordsSaisis[n]} onChange={(liste) => setD(n, liste, { shouldValidate: etatD.isSubmitted })} erreurs={(i) => erreursAccord(etatD.errors[n]?.[i])} />
            </div>
          ))}
          <section className="space-y-3 border-t border-line pt-4" aria-labelledby="titre-niu">
            <h3 id="titre-niu" className="text-[16px] font-bold text-navy-900">{t('inscription.verification.niuTitle')}</h3>
            <Field label={t('inscription.verification.niu')} required error={etatD.errors.niu?.message}>
              <Input {...registerD('niu')} placeholder={t('inscription.verification.niuExample')} aria-invalid={!!etatD.errors.niu} />
            </Field>
            <div>
              <div className={cn('flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2.5', etatD.errors.certificat ? 'border-rose-300 bg-rose-50/40' : 'border-line bg-slate-50')}>
                <FileText className="size-6 shrink-0 text-brand-600" aria-hidden />
                <span className="min-w-[150px] flex-1">
                  <b className="block text-sm text-navy-900">{t('inscription.verification.certificat')} <span className="text-rose-500">*</span></b>
                  <span className="block truncate text-xs text-muted">{certificat ? `${certificat.name} · ${tailleFichier(certificat.size)}` : tc('accords.champs.formats')}</span>
                </span>
                <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-brand-200 bg-white px-4 text-sm font-semibold text-brand-700 hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-500">
                  <Upload className="size-4" aria-hidden />
                  {certificat ? tc('accords.champs.remplacer') : tc('accords.champs.importer')}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => { const f = e.target.files?.[0] ?? null; e.target.value = ''; if (f) setD('certificat', f, { shouldValidate: etatD.isSubmitted }) }} />
                </label>
              </div>
              {etatD.errors.certificat && <p className="mt-1 text-xs font-medium text-rose-600">{etatD.errors.certificat.message}</p>}
            </div>
          </section>
          <p className="flex items-center gap-4 rounded-xl border border-dashed border-[#9fb4e3] bg-[#f3f7fe] px-4 py-3 text-[14px] text-navy-900">
            <ShieldCheck className="size-8 shrink-0 text-brand-600" aria-hidden />
            {t('inscription.verification.confidential')}
          </p>
          <div className="grid grid-cols-[1fr_1.4fr] gap-4 pt-2">
            <button type="button" onClick={() => setEtape('infos')} className={secondaire}>
              <ArrowLeft className="size-5" /> {t('inscription.back')}
            </button>
            <button type="submit" disabled={envoi} className={primaire}>
              <Check className="size-5" strokeWidth={3} /> {t('inscription.verification.submit')}
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  )
}
