import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Building2, Check, CircleCheck, Clock, Eye, FileText, IdCard, Lock, LogIn, Mail, Phone, ShieldCheck, Upload, Users } from 'lucide-react'
import { AuthCard } from '@/app/layouts/AuthLayout'
import { Badge } from '@/shared/components/ui/Badge'
import { Img } from '@/shared/components/ui/Img'
import { Select } from '@/shared/components/forms/Fields'
import { useSession } from '@/features/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { useComptes, useQuartiers, useRegions, useVilles } from '@/data/hooks'
import { data } from '@/data'
import type { Compte } from '@/shared/types'
import { normaliserIdentifiant, protegerMotDePasse } from '@/shared/utils/motDePasse'
import { compterDansLAnnuaire } from '@/shared/utils/compteurs'

type Profil = 'ecole' | 'consultant' | 'entreprise' | 'personne'

/** Titre et description de chaque profil : auth.json, inscription.profiles.<profil>. */
const profils: { value: Profil; visuel: ReactNode }[] = [
  { value: 'ecole', visuel: <Img src="/images/maquette/auth-ecole.jpg" alt="" className="size-14 rounded-lg" /> },
  { value: 'consultant', visuel: <Img src="/images/maquette/auth-consultant.jpg" alt="" className="size-14 rounded-full" /> },
  { value: 'entreprise', visuel: <span className="grid size-14 place-items-center text-brand-600"><Building2 className="size-11" /></span> },
  { value: 'personne', visuel: <span className="grid size-14 place-items-center rounded-full bg-[#e3ebfb] text-brand-600"><Users className="size-8 fill-brand-600" /></span> },
]

type Infos = {
  nom: string
  telephone: string
  email: string
  region: string
  ville: string
  quartier: string
  motDePasse: string
  confirmation: string
}

const input = 'h-11 w-full rounded-lg border border-[#c9d4ea] bg-white pl-10 pr-3 text-[14.5px] text-ink outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100'

const stepKeys = ['profil', 'infos', 'verification', 'done'] as const

function Steps({ current }: { current: number }) {
  const { t } = useTranslation('auth')
  const labels = stepKeys.map((k) => t(`inscription.steps.${k}`))
  return (
    <ol className="mt-5 flex items-start">
      {labels.map((l, i) => (
        <Fragment key={l}>
          <li className="flex w-20 flex-col items-center gap-1">
            <span className={cn('grid size-8 place-items-center rounded-full text-[15px] font-bold', i < current ? 'bg-emerald-500 text-white' : i === current ? 'bg-brand-600 text-white' : 'border border-[#c9d4ea] bg-white text-navy-900')}>
              {i < current ? <Check className="size-4" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('text-[13.5px] text-navy-900', i === current && 'font-bold text-brand-600')}>{l}</span>
          </li>
          {i < labels.length - 1 && <li aria-hidden className={cn('mt-4 h-px flex-1', i < current ? 'bg-brand-600' : 'bg-[#c9d4ea]')} />}
        </Fragment>
      ))}
    </ol>
  )
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[14px] font-bold text-navy-900">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  )
}

export function Inscription() {
  const regions = useRegions()
  const villes = useVilles()
  const quartiers = useQuartiers().map((q) => q.nom)
  const { t } = useTranslation('auth')
  const [step, setStep] = useState(0)
  const [profil, setProfil] = useState<Profil>('ecole')
  const [done, setDone] = useState<'attente' | 'valide' | null>(null)
  const [pieces, setPieces] = useState<Record<string, string>>({})
  const { signIn } = useSession()
  const navigate = useNavigate()
  const comptes = useComptes()
  // Le compte créé à l'étape « Vérification » (enregistré dans la base).
  const [compte, setCompte] = useState<Compte | null>(null)
  const [envoi, setEnvoi] = useState(false)
  // Construit dans le composant (comme yibolo-client) : les messages suivent la langue.
  const infos = useMemo(
    () =>
      z
        .object({
          nom: z.string().min(2, t('inscription.errors.required')),
          telephone: z.string().min(9, t('inscription.errors.phone')),
          email: z.email(t('inscription.errors.email')),
          region: z.string().min(1, t('inscription.errors.region')),
          ville: z.string().min(1, t('inscription.errors.city')),
          quartier: z.string().min(1, t('inscription.errors.district')),
          motDePasse: z.string().min(8, t('inscription.errors.passwordLength')),
          confirmation: z.string(),
        })
        .refine((v) => v.motDePasse === v.confirmation, { path: ['confirmation'], message: t('inscription.errors.passwordMatch') }),
    [t],
  )
  const form = useForm<Infos>({
    resolver: zodResolver(infos),
    defaultValues: { nom: '', telephone: '', email: '', region: '', ville: '', quartier: '', motDePasse: '', confirmation: '' },
  })
  const { register, formState } = form
  const err = formState.errors
  const titre = t(`inscription.profiles.${profil}.title`)

  /**
   * « Soumettre pour vérification » : enregistre le compte dans la base, en
   * attente de validation par YIBOLO. Un compte École reçoit aussi son
   * établissement (il le complétera depuis son espace professionnel).
   */
  const soumettre = async () => {
    const v = form.getValues()
    if (comptes.some((c) => normaliserIdentifiant(c.identifiant) === normaliserIdentifiant(v.email))) {
      toast.error(t('inscription.errors.emailTaken'))
      setStep(1)
      return
    }
    setEnvoi(true)
    try {
      const ecole = profil === 'ecole'
      const etablissement = ecole
        ? await data.create(
            'etablissements',
            {
              nom: v.nom,
              sigle: '',
              type: 'IPES',
              region: v.region,
              ville: v.ville,
              quartier: v.quartier,
              note: 0,
              avis: 0,
              image: '/images/maquette/ecoles-hero.jpg',
              filieres: [],
              formations: 0,
              description: '',
              telephone: v.telephone,
              email: v.email,
              rentree: '',
              enVerification: true,
            },
            'etablissement',
          )
        : undefined
      const cree = await data.create(
        'comptes',
        {
          identifiant: v.email.trim(),
          telephone: v.telephone,
          role: ecole ? 'ipes' : 'utilisateur',
          name: v.nom,
          subtitle: ecole ? 'Administrateur' : 'Utilisateur',
          avatar: '',
          home: ecole ? ROUTES.pro.root : ROUTES.accueil,
          ecoleId: etablissement?.id,
          statut: 'En vérification',
          motDePasse: await protegerMotDePasse(v.motDePasse),
        },
        'compte',
      )
      setCompte(cree)
      toast.success(t('inscription.verification.sent'))
      setDone('attente')
    } catch {
      toast.error(t('inscription.errors.saveFailed'))
    } finally {
      setEnvoi(false)
    }
  }

  if (done === 'attente') {
    return (
      <AuthCard>
        <div className="py-4 text-center">
          <Img src="/images/maquette/auth-verification.jpg" alt="" className="mx-auto h-[150px] w-[255px]" />
          <h1 className="mt-4 text-[24px] font-bold text-navy-900">{t('inscription.pending.title')}</h1>
          <p className="mt-2 text-[15.5px] text-navy-900">
            {t('inscription.pending.text1')}
            <br />
            {t('inscription.pending.text2')}
          </p>
          <div className="mx-auto mt-5 grid max-w-md grid-cols-2 divide-x divide-line rounded-xl bg-[#eef3fc] py-3 text-left">
            <p className="flex items-center gap-3 px-5 text-[13.5px] text-navy-900"><Clock className="size-7 text-brand-600" /><span>{t('inscription.pending.delay')}<b className="block text-[15px]">{t('inscription.pending.delayValue')}</b></span></p>
            <p className="flex items-center gap-3 px-5 text-[13.5px] text-navy-900"><Mail className="size-7 text-brand-600" /><span>{t('inscription.pending.notification')}<b className="block text-[15px]">{t('inscription.pending.notificationValue')}</b></span></p>
          </div>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link to={ROUTES.signIn} className="inline-flex h-11 w-72 items-center justify-center rounded-full border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">{t('inscription.pending.back')}</Link>
            <button
              type="button"
              onClick={async () => {
                // Démo : YIBOLO valide le compte (dans la base).
                if (compte) setCompte((await data.update('comptes', compte.id, { statut: 'Validé' })) ?? compte)
                // L'établissement devient visible et entre dans les chiffres de l'annuaire.
                const ecole = compte?.ecoleId ? (await data.list('etablissements')).find((x) => x.id === compte.ecoleId) : undefined
                if (ecole?.enVerification) {
                  await data.update('etablissements', ecole.id, { enVerification: false })
                  await compterDansLAnnuaire(ecole, 1)
                }
                setDone('valide')
              }}
              className="text-[13px] font-semibold text-brand-600 hover:underline"
            >{t('inscription.pending.simulate')}</button>
          </div>
        </div>
      </AuthCard>
    )
  }

  if (done === 'valide') {
    return (
      <AuthCard>
        <div className="py-4 text-center">
          <Img src="/images/maquette/auth-valide.jpg" alt="" className="mx-auto h-[120px] w-[296px]" />
          <h1 className="mt-4 text-[30px] font-extrabold text-navy-900">{t('inscription.validated.title')}</h1>
          <p className="mt-2 text-[16px] text-navy-900">
            {t('inscription.validated.text1')}
            <br />
            {t('inscription.validated.text2')}
          </p>
          <button
            type="button"
            onClick={() => {
              if (!compte) return navigate(ROUTES.signIn)
              signIn(compte)
              navigate(compte.home)
            }}
            className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-brand-600 px-14 text-[17px] font-semibold text-white hover:bg-brand-700"
          >
            <LogIn className="size-5" />
            {t('inscription.validated.signIn')}
          </button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title={t('inscription.title')}>
      <Steps current={step} />

      {step === 0 && (
        <div className="mt-6">
          <h2 className="text-[22px] font-bold text-navy-900">{t('inscription.choose.title')}</h2>
          <p className="text-[14.5px] text-navy-900">{t('inscription.choose.text')}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profils.map((p) => {
              // Seul le profil École est ouvert pour l'instant (décision du 2026-11-24).
              const bientot = p.value !== 'ecole'
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
                  {([t(`inscription.profiles.${p.value}.line1`), t(`inscription.profiles.${p.value}.line2`)]).map((line) => (
                    <span key={line} className="block text-[13px] text-navy-900">{line}</span>
                  ))}
                </span>
              </button>
              )
            })}
          </div>
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={() => setStep(1)} className="inline-flex h-12 w-80 items-center justify-center gap-2.5 rounded-full bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700">
              {t('inscription.continue')} <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <form noValidate onSubmit={form.handleSubmit(() => setStep(2))} className="mt-6 space-y-3.5">
          <div>
            <h2 className="text-[22px] font-bold text-navy-900">{t('inscription.infos.title')}</h2>
            <p className="text-[14.5px] text-navy-900">{t('inscription.infos.text')}</p>
          </div>
          <Field label={t('inscription.infos.fields.nom')} required error={err.nom?.message}>
            <span className="relative block"><Building2 className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input className={input} {...register('nom')} /></span>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('inscription.infos.fields.telephone')} required error={err.telephone?.message}>
              <span className="relative block"><Phone className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input className={input} {...register('telephone')} /></span>
            </Field>
            <Field label={t('inscription.infos.fields.email')} required error={err.email?.message}>
              <span className="relative block"><Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input type="email" className={input} {...register('email')} /></span>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t('inscription.infos.fields.region')} required error={err.region?.message}><Select options={regions.map((r) => r.nom)} placeholder={t('inscription.infos.choose')} className="h-11 rounded-lg border-[#c9d4ea]" {...register('region')} /></Field>
            <Field label={t('inscription.infos.fields.ville')} required error={err.ville?.message}><Select options={villes.map((v) => v.nom)} placeholder={t('inscription.infos.choose')} className="h-11 rounded-lg border-[#c9d4ea]" {...register('ville')} /></Field>
            <Field label={t('inscription.infos.fields.quartier')} required error={err.quartier?.message}><Select options={quartiers} placeholder={t('inscription.infos.choose')} className="h-11 rounded-lg border-[#c9d4ea]" {...register('quartier')} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('inscription.infos.fields.motDePasse')} required error={err.motDePasse?.message}>
              <span className="relative block"><Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input type="password" className={input} {...register('motDePasse')} /><Eye className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" /></span>
            </Field>
            <Field label={t('inscription.infos.fields.confirmation')} required error={err.confirmation?.message}>
              <span className="relative block"><Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input type="password" className={input} {...register('confirmation')} /><Eye className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" /></span>
            </Field>
          </div>
          <div className="grid grid-cols-[1fr_1.4fr] gap-4 pt-2">
            <button type="button" onClick={() => setStep(0)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
              <ArrowLeft className="size-5" /> {t('inscription.back')}
            </button>
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700">
              {t('inscription.continue')} <ArrowRight className="size-5" />
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-3">
          <div>
            <h2 className="text-[22px] font-bold text-navy-900">{t('inscription.verification.title', { profile: titre })}</h2>
            <p className="text-[14.5px] text-navy-900">{t('inscription.verification.text')}</p>
          </div>
          {(profil === 'personne'
            ? [{ key: 'cni', label: t('inscription.verification.docs.cni'), icon: <IdCard /> }]
            : [
                { key: 'autorisation', label: profil === 'ecole' ? t('inscription.verification.docs.autorisation') : t('inscription.verification.docs.justificatif'), icon: <FileText /> },
                { key: 'niu', label: t('inscription.verification.docs.niu'), icon: <IdCard /> },
              ]
          ).map((d) => (
            <div key={d.key} className="flex items-center gap-4 rounded-xl border border-line px-4 py-3">
              <span className="text-brand-600 [&_svg]:size-7">{d.icon}</span>
              <span className="flex-1">
                <b className="block text-[15px] text-navy-900">{d.label} <span className="text-rose-500">*</span></b>
                <span className="text-[13px] text-navy-900">{pieces[d.key] ? `✓ ${pieces[d.key]}` : t('inscription.verification.formats')}</span>
              </span>
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border-2 border-brand-600/60 px-4 text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                <Upload className="size-4" />
                {t('inscription.verification.import')}
                <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && setPieces({ ...pieces, [d.key]: e.target.files[0].name })} />
              </label>
            </div>
          ))}
          <p className="flex items-center gap-4 rounded-xl border border-dashed border-[#9fb4e3] bg-[#f3f7fe] px-4 py-3 text-[14px] text-navy-900">
            <ShieldCheck className="size-8 shrink-0 text-brand-600" />
            {t('inscription.verification.confidential')}
          </p>
          <div className="grid grid-cols-[1fr_1.4fr] gap-4 pt-2">
            <button type="button" onClick={() => setStep(1)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
              <ArrowLeft className="size-5" /> {t('inscription.back')}
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={() => void soumettre()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-[16px] font-semibold text-white hover:bg-brand-700"
            >
              <Check className="size-5" strokeWidth={3} /> {t('inscription.verification.submit')}
            </button>
          </div>
        </div>
      )}
    </AuthCard>
  )
}
