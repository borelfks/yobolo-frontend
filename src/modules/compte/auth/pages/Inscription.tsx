import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { CadreAuth, CarteAuth } from '@/app/layouts/AuthLayout'
import { data } from '@/data'
import { useComptes, useDecoupage } from '@/data/hooks'
import { ETAPES, FONCTIONS, PAR_TYPE, typeDuCompte, type Etape, type Profil, type TypeEtablissement } from '@/modules/compte/auth/authInscription'
import { chiffresDuNumero, formaterNumero, numeroValide } from '@/modules/compte/auth/authOtp'
import { ChoixProfil, ChoixTypeEtablissement, NavigationEtapes } from '@/modules/compte/auth/components/ChoixInscription'
import { TitreAuth } from '@/modules/compte/auth/components/TitreAuth'
import { VerificationCode } from '@/modules/compte/auth/components/VerificationCode'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { BarreEtapes, CaseACocher, Champ, ChampMotDePasse, ChampTelephone, ChampTexte, Encadre, JaugeMotDePasse, ListeDeroulante, PieceAJoindre } from '@/shared/blocs/Formulaire'
import { ListeAccords } from '@/shared/forms/Accords'
import { ChampsLieu } from '@/shared/forms/ChampsLieu'
import { Button } from '@/shared/shadcn/button'
import { RadioGroup, RadioGroupOption } from '@/shared/shadcn/radio-group'
import { Lien } from '@/shared/ui/Lien'
import type { Compte, Lieu } from '@/shared/types'
import { accordVide, enregistrerAccord, erreursAccord, NATURES, schemaAccord, type AccordSaisi } from '@/shared/utils/accords'
import { lireFichier, tailleFichier, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'
import { villeDuLieu } from '@/shared/utils/geographie'
import { normaliserIdentifiant, protegerMotDePasse } from '@/shared/utils/motDePasse'
import { CIVILITES, NATIONALITES } from '@/shared/utils/personne'
import { ROUTES } from '@/shared/utils/routes'

const LIEU = ['region', 'departement', 'arrondissement', 'quartier'] as const

/**
 * Créer un compte (planches « Personne physique » 1 à 4 et « École » 2 à 4) :
 * Profil → Vous → Votre accès → Code, ou Profil → Infos → Code → Documents.
 * Le compte est enregistré dès l'envoi du code (numéro à confirmer) ; l'école
 * entre ensuite dans son espace sans validation par YIBOLO.
 */
export function Inscription() {
  const { t } = useTranslation('auth')
  const { t: tc } = useTranslation('common')
  const { t: tl } = useTranslation('layout')
  const comptes = useComptes()
  // Une école dont le numéro vient d'être confirmé à la connexion reprend ici, à l'étape des pièces.
  const reprise = (useLocation().state as { reprise?: string } | null)?.reprise
  const [brouillon, setBrouillon] = useState<Compte | null>(() => comptes.find((c) => c.id === reprise) ?? null)
  const [profil, setProfil] = useState<Profil>(brouillon ? 'ecole' : 'personne')
  const [typeEtab, setTypeEtab] = useState<TypeEtablissement>(typeDuCompte(brouillon?.typeEtablissement))
  const [etape, setEtape] = useState<Etape>(brouillon ? 'verification' : 'profil')
  const { signIn } = useSession()
  const navigate = useNavigate()
  const { arrondissements } = useDecoupage()
  const [envoi, setEnvoi] = useState(false)
  const etapes = ETAPES[profil === 'personne' ? 'personne' : 'ecole']
  const rang = etapes.indexOf(etape)
  const reglesType = PAR_TYPE[typeEtab]
  // Le compte en cours de création (le sien) ne compte pas comme « déjà utilisé ».
  const autres = comptes.filter((c) => c.id !== brouillon?.id)
  const numeroPris = (tel: string) => autres.some((c) => chiffresDuNumero(c.telephone) === chiffresDuNumero(tel))
  const emailPris = (email: string) => !!email && autres.some((c) => normaliserIdentifiant(c.identifiant) === normaliserIdentifiant(email))

  /** Le compte est enregistré dès l'envoi du code ; un retour à l'étape précédente met à jour ce même compte. */
  const enregistrerBrouillon = async (champs: Omit<Compte, 'id'>) => {
    const enregistre = brouillon ? await data.update('comptes', brouillon.id, champs) : await data.create('comptes', champs, 'compte')
    if (enregistre) setBrouillon(enregistre)
    return enregistre
  }

  /* --- Personne physique --- */
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
    defaultValues: { prenom: '', nom: '', civilite: 'Monsieur' as const, nationalite: '', region: '', departement: '', arrondissement: '', quartier: '', telephone: '', whatsapp: true, email: '', motDePasse: '', confirmation: '' },
  })

  /* --- École : « Infos » --- */
  const schemaEcole = useMemo(
    () =>
      z
        .object({
          nom: z.string().trim().min(2, t('inscription.errors.required')),
          sigle: z.string().trim(),
          responsable: z.string().trim(),
          fonction: z.string(),
          telephone: z.string().refine(numeroValide, t('inscription.errors.phoneFormat')),
          whatsapp: z.boolean(),
          email: z.email(t('inscription.errors.email')),
          region: z.string().min(1, tc('geographie.erreurs.region')),
          departement: z.string().min(1, tc('geographie.erreurs.departement')),
          arrondissement: z.string().min(1, tc('geographie.erreurs.arrondissement')),
          quartier: z.string().trim().min(1, tc('geographie.erreurs.quartier')),
          adresse: z.string().trim(),
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
      sigle: brouillon?.sigle ?? '',
      responsable: brouillon?.responsable ?? '',
      fonction: brouillon?.fonction ?? '',
      telephone: brouillon ? chiffresDuNumero(brouillon.telephone).slice(-9) : '',
      whatsapp: brouillon?.whatsapp ?? true,
      email: brouillon?.identifiant ?? '',
      region: brouillon?.region ?? '',
      departement: brouillon?.departement ?? '',
      arrondissement: brouillon?.arrondissement ?? '',
      quartier: brouillon?.quartier ?? '',
      adresse: brouillon?.adresse ?? '',
      motDePasse: '',
      confirmation: '',
    },
  })

  /* --- École : « Documents » (au moins un accord de création et un d'ouverture, NIU et son certificat) --- */
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
    defaultValues: { creation: [accordVide(reglesType.autorite)], ouverture: [accordVide(reglesType.autorite)], niu: '', certificat: null as File | null },
  })
  const accordsSaisis = { creation: watchD('creation'), ouverture: watchD('ouverture') }
  const certificat = watchD('certificat')

  // Le lieu (contrôlé) écrit dans le formulaire du profil choisi.
  const lieuPersonne: Lieu = { region: watchP('region'), departement: watchP('departement'), arrondissement: watchP('arrondissement'), quartier: watchP('quartier') }
  const lieuEcole: Lieu = { region: watchE('region'), departement: watchE('departement'), arrondissement: watchE('arrondissement'), quartier: watchE('quartier') }
  const changerLieu = (f: 'personne' | 'ecole', l: Lieu) => {
    const etat = f === 'personne' ? etatP : etatE
    const valider = etat.isSubmitted || Object.keys(etat.errors).length > 0
    const fixer = (f === 'personne' ? setP : setE) as (nom: keyof Lieu, valeur: string, options: { shouldValidate: boolean }) => void
    for (const cle of LIEU) fixer(cle, l[cle], { shouldValidate: valider })
  }
  const erreursLieu = (e: Partial<Record<keyof Lieu, { message?: string }>>) => ({ region: e.region?.message, departement: e.departement?.message, arrondissement: e.arrondissement?.message, quartier: e.quartier?.message })

  /** Personne physique, « Recevoir le code » : le compte est enregistré, numéro à confirmer. */
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

  /** École, « Recevoir le code » : le compte est enregistré, numéro à confirmer. */
  const enregistrerEcole = async () => {
    const v = getE()
    setEnvoi(true)
    try {
      await enregistrerBrouillon({
        identifiant: v.email.trim(),
        telephone: formaterNumero(v.telephone),
        role: reglesType.role,
        name: v.nom.trim(),
        subtitle: 'Administrateur',
        avatar: '',
        home: ROUTES.pro.root,
        typeEtablissement: reglesType.type,
        sigle: v.sigle,
        responsable: v.responsable,
        fonction: v.fonction,
        adresse: v.adresse,
        whatsapp: v.whatsapp,
        region: v.region,
        departement: v.departement,
        arrondissement: v.arrondissement,
        ville: villeDuLieu(v, arrondissements),
        quartier: v.quartier.trim(),
        telephoneVerifie: false,
        statut: 'Validé',
        motDePasse: await protegerMotDePasse(v.motDePasse),
      })
      // Les accords encore vides proposent l'autorité du type choisi.
      for (const n of NATURES) setD(n, watchD(n).map((a) => (a.numero || a.fichier ? a : accordVide(reglesType.autorite))))
      setEtape('code')
    } catch {
      toast.error(t('inscription.errors.saveFailed'))
    } finally {
      setEnvoi(false)
    }
  }

  /** Le bon code est saisi : le numéro est confirmé ; la personne est connectée, l'école passe aux documents. */
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
    navigate({ href: ROUTES.accueil })
  }

  /** École, « Créer mon compte » : l'établissement est enregistré et rattaché ; l'école entre dans son espace (pas de validation). */
  const soumettreEcole = async (documents: { creation: AccordSaisi[]; ouverture: AccordSaisi[]; niu: string; certificat: File | null }) => {
    if (!brouillon) return
    setEnvoi(true)
    try {
      const etablissement = await data.create(
        'etablissements',
        {
          nom: brouillon.name,
          sigle: brouillon.sigle ?? '',
          type: brouillon.typeEtablissement ?? 'IPES',
          region: brouillon.region ?? '',
          departement: brouillon.departement,
          arrondissement: brouillon.arrondissement,
          ville: brouillon.ville ?? '',
          quartier: brouillon.quartier ?? '',
          adresse: brouillon.adresse || undefined,
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
      navigate({ href: ROUTES.accueil })
    } catch {
      toast.error(t('inscription.errors.saveFailed'))
    } finally {
      setEnvoi(false)
    }
  }

  const ep = etatP.errors
  const ee = etatE.errors
  const precedente = rang > 0 ? () => setEtape(etapes[rang - 1]!) : undefined
  const textes = etape === 'verification' ? { titre: t('inscription.verification.title', { profile: t(`inscription.types.${typeEtab}.nom`) }), texte: t('inscription.verification.text') } : { titre: t(`inscription.titres.${etape}.titre`), texte: t(`inscription.titres.${etape}.texte`) }

  return (
    <CadreAuth texte={tl('authLayout.dejaCompte')}>
      <CarteAuth largeur={etape === 'code' ? 'code' : 'large'} centree={etape === 'code'}>
        {etape === 'code' && (
          <Button variant="link-muted" className="self-start" onClick={precedente}>
            <ArrowLeft aria-hidden />
            {t('inscription.back')}
          </Button>
        )}
        <BarreEtapes nombre={etapes.length} courante={rang} noms={etapes.map((e) => t(`inscription.steps.${e}`))} />
        <TitreAuth taille="inscription" titre={textes.titre} texte={textes.texte} />

        {etape === 'profil' && (
          <>
            <ChoixProfil valeur={profil} onChange={setProfil} />
            <NavigationEtapes suivant={t('inscription.continue')} onSuivant={() => setEtape(etapes[1]!)} />
          </>
        )}

        {/* --- Personne physique : « Vous » --- */}
        {etape === 'vous' && (
          <form
            noValidate
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              void triggerP(['prenom', 'nom', 'civilite', 'nationalite', ...LIEU]).then((ok) => ok && setEtape('acces'))
            }}
          >
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Champ id="insc-prenom" label={t('inscription.champs.prenom')} erreur={ep.prenom?.message}>
                <ChampTexte id="insc-prenom" autoComplete="given-name" placeholder={t('inscription.exemples.prenom')} aria-invalid={!!ep.prenom || undefined} {...registerP('prenom')} />
              </Champ>
              <Champ id="insc-nom" label={t('inscription.champs.nom')} erreur={ep.nom?.message}>
                <ChampTexte id="insc-nom" autoComplete="family-name" placeholder={t('inscription.exemples.nom')} aria-invalid={!!ep.nom || undefined} {...registerP('nom')} />
              </Champ>
            </div>
            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-bold text-foreground">{t('inscription.champs.civilite')}</legend>
              <RadioGroup value={watchP('civilite')} onValueChange={(v) => setP('civilite', v as (typeof CIVILITES)[number])} aria-label={t('inscription.champs.civilite')} className="flex flex-wrap gap-2.5">
                {CIVILITES.map((c) => (
                  <RadioGroupOption key={c} value={c}>
                    {tc(`personne.civilites.${c}`)}
                  </RadioGroupOption>
                ))}
              </RadioGroup>
            </fieldset>
            <Champ id="insc-nationalite" label={t('inscription.champs.nationalite')} erreur={ep.nationalite?.message}>
              <ListeDeroulante
                id="insc-nationalite"
                grand
                valeur={watchP('nationalite')}
                onChange={(v) => setP('nationalite', v, { shouldValidate: etatP.isSubmitted || !!ep.nationalite })}
                placeholder={t('inscription.champs.choisirNationalite')}
                invalide={!!ep.nationalite}
                options={NATIONALITES.map((n) => ({ value: n, label: tc(`personne.nationalites.${n}`) }))}
              />
            </Champ>
            <ChampsLieu grand titre={t('inscription.champs.residence')} aide={t('inscription.champs.residenceAide')} valeur={lieuPersonne} onChange={(l) => changerLieu('personne', l)} erreurs={erreursLieu(ep)} />
            <NavigationEtapes onRetour={precedente} suivant={t('inscription.continue')} />
          </form>
        )}

        {/* --- Personne physique : « Votre accès » --- */}
        {etape === 'acces' && (
          <form
            noValidate
            className="flex flex-col gap-5"
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
          >
            <Champ id="insc-tel" label={t('inscription.champs.telephone')} erreur={ep.telephone?.message}>
              <ChampTelephone id="insc-tel" autoComplete="tel" aria-invalid={!!ep.telephone || undefined} {...registerP('telephone')} />
              <CaseACocher className="mt-1" label={t('inscription.champs.whatsapp')} checked={watchP('whatsapp')} onCheckedChange={(v) => setP('whatsapp', v === true)} />
            </Champ>
            <Champ id="insc-email" label={t('inscription.champs.emailFacultatif')} erreur={ep.email?.message}>
              <ChampTexte id="insc-email" type="email" autoComplete="email" placeholder={t('inscription.exemples.email')} aria-invalid={!!ep.email || undefined} {...registerP('email')} />
            </Champ>
            <div className="grid items-start gap-3.5 sm:grid-cols-2">
              <Champ id="insc-mdp" label={t('inscription.champs.motDePasse')} erreur={ep.motDePasse?.message}>
                <ChampMotDePasse id="insc-mdp" autoComplete="new-password" aria-invalid={!!ep.motDePasse || undefined} {...registerP('motDePasse')} />
                <JaugeMotDePasse motDePasse={watchP('motDePasse')} aide={t('inscription.champs.motDePasseAide')} />
              </Champ>
              <Champ id="insc-confirmation" label={t('inscription.champs.confirmation')} erreur={ep.confirmation?.message}>
                <ChampMotDePasse id="insc-confirmation" autoComplete="new-password" aria-invalid={!!ep.confirmation || undefined} {...registerP('confirmation')} />
              </Champ>
            </div>
            <p className="text-meta text-muted-foreground">
              <Trans t={t} i18nKey="inscription.cgu" components={{ lien: <Lien to={ROUTES.terms} className="font-bold text-primary" /> }} />
            </p>
            <NavigationEtapes onRetour={precedente} suivant={t('inscription.recevoirCode')} envoi={envoi} />
          </form>
        )}

        {/* --- École : « Infos » --- */}
        {etape === 'infos' && (
          <form
            noValidate
            className="flex flex-col gap-5"
            onSubmit={handleSubmitE((v) => {
              if (numeroPris(v.telephone)) return errorE('telephone', { message: t('inscription.errors.phoneTaken') })
              if (emailPris(v.email)) return errorE('email', { message: t('inscription.errors.emailTaken') })
              void enregistrerEcole()
            })}
          >
            <ChoixTypeEtablissement valeur={typeEtab} onChange={setTypeEtab} />
            <div className="grid gap-3.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Champ id="insc-etab" label={t('inscription.infos.fields.nom')} erreur={ee.nom?.message}>
                <ChampTexte id="insc-etab" placeholder={t(typeEtab === 'auto' ? 'inscription.infos.exemples.nomAuto' : 'inscription.infos.exemples.nom')} aria-invalid={!!ee.nom || undefined} {...registerE('nom')} />
              </Champ>
              <Champ id="insc-sigle" label={t('inscription.infos.fields.sigle')}>
                <ChampTexte id="insc-sigle" placeholder={t('inscription.infos.exemples.sigle')} {...registerE('sigle')} />
              </Champ>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Champ id="insc-responsable" label={t('inscription.infos.fields.responsable')}>
                <ChampTexte id="insc-responsable" placeholder={t('inscription.infos.exemples.responsable')} {...registerE('responsable')} />
              </Champ>
              <Champ id="insc-fonction" label={t('inscription.infos.fields.fonction')}>
                <ListeDeroulante
                  id="insc-fonction"
                  grand
                  valeur={watchE('fonction')}
                  onChange={(v) => setE('fonction', v)}
                  placeholder={t('inscription.infos.choisirFonction')}
                  options={FONCTIONS.map((f) => ({ value: f, label: t(`inscription.fonctions.${f}`) }))}
                />
              </Champ>
            </div>
            <div className="grid items-start gap-3.5 sm:grid-cols-2">
              <Champ id="insc-etab-tel" label={t('inscription.infos.fields.telephone')} erreur={ee.telephone?.message}>
                <ChampTelephone id="insc-etab-tel" autoComplete="tel" aria-invalid={!!ee.telephone || undefined} {...registerE('telephone')} />
                <CaseACocher className="mt-1" label={t('inscription.champs.whatsapp')} checked={watchE('whatsapp')} onCheckedChange={(v) => setE('whatsapp', v === true)} />
              </Champ>
              <Champ id="insc-etab-email" label={t('inscription.infos.fields.email')} erreur={ee.email?.message}>
                <ChampTexte id="insc-etab-email" type="email" autoComplete="email" placeholder={t('inscription.infos.exemples.email')} aria-invalid={!!ee.email || undefined} {...registerE('email')} />
              </Champ>
            </div>
            <div className="flex flex-col gap-2.5">
              <ChampsLieu grand titre={t('inscription.champs.lieu')} valeur={lieuEcole} onChange={(l) => changerLieu('ecole', l)} erreurs={erreursLieu(ee)} />
              <Champ id="insc-adresse" label={t('inscription.infos.fields.adresse')}>
                <ChampTexte id="insc-adresse" placeholder={t('inscription.infos.exemples.adresse')} {...registerE('adresse')} />
              </Champ>
            </div>
            <div className="grid items-start gap-3.5 sm:grid-cols-2">
              <Champ id="insc-etab-mdp" label={t('inscription.infos.fields.motDePasse')} erreur={ee.motDePasse?.message}>
                <ChampMotDePasse id="insc-etab-mdp" autoComplete="new-password" aria-invalid={!!ee.motDePasse || undefined} {...registerE('motDePasse')} />
                <JaugeMotDePasse motDePasse={watchE('motDePasse')} aide={t('inscription.champs.motDePasseAide')} />
              </Champ>
              <Champ id="insc-etab-confirmation" label={t('inscription.infos.fields.confirmation')} erreur={ee.confirmation?.message}>
                <ChampMotDePasse id="insc-etab-confirmation" autoComplete="new-password" aria-invalid={!!ee.confirmation || undefined} {...registerE('confirmation')} />
              </Champ>
            </div>
            <NavigationEtapes onRetour={precedente} suivant={t('inscription.recevoirCode')} envoi={envoi} />
          </form>
        )}

        {/* --- Code reçu sur le téléphone (OTP) --- */}
        {etape === 'code' && <VerificationCode telephone={formaterNumero(profil === 'personne' ? getP('telephone') : getE('telephone'))} onVerifie={numeroConfirme} />}

        {/* --- École : « Documents » --- */}
        {etape === 'verification' && (
          <form noValidate onSubmit={(ev) => void handleSubmitD(soumettreEcole)(ev)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-3.5">
              {NATURES.map((n, k) => (
                <ListeAccords
                  key={n}
                  nature={n}
                  grand
                  className={k ? 'border-t border-border pt-3.5' : undefined}
                  autoriteParDefaut={reglesType.autorite}
                  exempleNumero={t(`inscription.verification.exemples.${reglesType.exemple}`)}
                  saisis={accordsSaisis[n]}
                  onChange={(liste) => setD(n, liste, { shouldValidate: etatD.isSubmitted })}
                  erreurs={(i) => erreursAccord(etatD.errors[n]?.[i])}
                />
              ))}
              <section className="flex flex-col gap-2.5 border-t border-border pt-3.5" aria-labelledby="titre-niu">
                <h3 id="titre-niu" className="text-base font-bold text-foreground">
                  {t('inscription.verification.niuTitle')}
                </h3>
                <Champ id="insc-niu" label={t('inscription.verification.niu')} requis erreur={etatD.errors.niu?.message}>
                  <ChampTexte id="insc-niu" placeholder={t('inscription.verification.niuExample')} aria-invalid={!!etatD.errors.niu || undefined} {...registerD('niu')} />
                </Champ>
                <PieceAJoindre
                  titre={t('inscription.verification.certificat')}
                  aide={tc('accords.champs.formats')}
                  nomFichier={certificat ? `${certificat.name} · ${tailleFichier(certificat.size)}` : undefined}
                  erreur={etatD.errors.certificat?.message}
                  onFichier={(f) => setD('certificat', f, { shouldValidate: etatD.isSubmitted })}
                />
              </section>
              <Encadre ton="succes" icone={ShieldCheck}>
                {t('inscription.verification.confidential')}
              </Encadre>
            </div>
            <NavigationEtapes onRetour={() => setEtape('infos')} suivant={t('inscription.verification.submit')} fleche={false} envoi={envoi} />
          </form>
        )}
      </CarteAuth>
    </CadreAuth>
  )
}
