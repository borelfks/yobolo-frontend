import { Fragment, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Building2, Check, CircleCheck, Clock, Eye, FileText, IdCard, Lock, LogIn, Mail, Phone, ShieldCheck, Upload, Users } from 'lucide-react'
import { AuthCard } from '@/pages/auth/AuthShell'
import { Img } from '@/components/ui/Feedback'
import { Select } from '@/components/ui/Form'
import { useSession } from '@/hooks/useSession'
import { quartiers, regions, villes } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

type Profil = 'ecole' | 'consultant' | 'entreprise' | 'personne'

const profils: { value: Profil; title: string; text: string[]; visuel: ReactNode }[] = [
  { value: 'ecole', title: 'École / IPES', text: ['Institut de formation,', 'centre, auto-école, etc.'], visuel: <Img src="/maquette/auth-ecole.jpg" alt="" className="size-14 rounded-lg" /> },
  { value: 'consultant', title: 'Consultant', text: ['Expert, formateur,', 'conseiller, etc.'], visuel: <Img src="/maquette/auth-consultant.jpg" alt="" className="size-14 rounded-full" /> },
  { value: 'entreprise', title: 'Entreprise', text: ['Société, organisation,', 'employeur, etc.'], visuel: <span className="grid size-14 place-items-center text-brand-600"><Building2 className="size-11" /></span> },
  { value: 'personne', title: 'Personne physique', text: ['Candidat, étudiant,', 'demandeur d’emploi, etc.'], visuel: <span className="grid size-14 place-items-center rounded-full bg-[#e3ebfb] text-brand-600"><Users className="size-8 fill-brand-600" /></span> },
]

const infos = z
  .object({
    nom: z.string().min(2, 'Ce champ est obligatoire.'),
    telephone: z.string().min(9, 'Numéro de téléphone incomplet.'),
    email: z.email('Adresse e-mail invalide.'),
    region: z.string().min(1, 'Choisissez une région.'),
    ville: z.string().min(1, 'Choisissez une ville.'),
    quartier: z.string().min(1, 'Choisissez un quartier.'),
    motDePasse: z.string().min(8, 'Au moins 8 caractères.'),
    confirmation: z.string(),
  })
  .refine((v) => v.motDePasse === v.confirmation, { path: ['confirmation'], message: 'Les mots de passe ne correspondent pas.' })

type Infos = z.infer<typeof infos>

const input = 'h-11 w-full rounded-lg border border-[#c9d4ea] bg-white pl-10 pr-3 text-[14.5px] text-ink outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100'

function Steps({ current }: { current: number }) {
  const labels = ['Profil', 'Infos', 'Vérification', 'Terminé']
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

export default function Inscription() {
  const [step, setStep] = useState(0)
  const [profil, setProfil] = useState<Profil>('ecole')
  const [done, setDone] = useState<'attente' | 'valide' | null>(null)
  const [pieces, setPieces] = useState<Record<string, string>>({})
  const { signIn } = useSession()
  const navigate = useNavigate()
  const form = useForm<Infos>({
    resolver: zodResolver(infos),
    defaultValues: { nom: 'Institut Professionnel du Centre (IPC)', telephone: '+237 6 70 12 34 56', email: 'contact@ipc-yaounde.cm', region: 'Centre', ville: 'Yaoundé', quartier: 'Bastos', motDePasse: 'Yibolo2026', confirmation: 'Yibolo2026' },
  })
  const { register, formState } = form
  const err = formState.errors
  const titre = profils.find((p) => p.value === profil)?.title

  if (done === 'attente') {
    return (
      <AuthCard>
        <div className="py-4 text-center">
          <Img src="/maquette/auth-verification.jpg" alt="" className="mx-auto h-[150px] w-[255px]" />
          <h1 className="mt-4 text-[24px] font-bold text-navy-900">Votre compte est en cours de vérification</h1>
          <p className="mt-2 text-[15.5px] text-navy-900">
            Nous examinons vos informations et documents.
            <br />
            Vous recevrez une notification par email et SMS dès la validation.
          </p>
          <div className="mx-auto mt-5 grid max-w-md grid-cols-2 divide-x divide-line rounded-xl bg-[#eef3fc] py-3 text-left">
            <p className="flex items-center gap-3 px-5 text-[13.5px] text-navy-900"><Clock className="size-7 text-brand-600" /><span>Délai de traitement<b className="block text-[15px]">24 à 48 heures</b></span></p>
            <p className="flex items-center gap-3 px-5 text-[13.5px] text-navy-900"><Mail className="size-7 text-brand-600" /><span>Notification<b className="block text-[15px]">Email et SMS</b></span></p>
          </div>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link to="/connexion" className="inline-flex h-11 w-72 items-center justify-center rounded-full border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">Retour à la connexion</Link>
            <button type="button" onClick={() => setDone('valide')} className="text-[13px] font-semibold text-brand-600 hover:underline">Simuler la validation par YIBOLO</button>
          </div>
        </div>
      </AuthCard>
    )
  }

  if (done === 'valide') {
    return (
      <AuthCard>
        <div className="py-4 text-center">
          <Img src="/maquette/auth-valide.jpg" alt="" className="mx-auto h-[120px] w-[296px]" />
          <h1 className="mt-4 text-[30px] font-extrabold text-navy-900">Compte validé !</h1>
          <p className="mt-2 text-[16px] text-navy-900">
            Votre compte a été vérifié avec succès.
            <br />
            Vous pouvez maintenant vous connecter et accéder à votre espace YIBOLO.
          </p>
          <button
            type="button"
            onClick={() => {
              const a = signIn(profil === 'ecole' ? 'ipes' : 'utilisateur')
              navigate(a.home)
            }}
            className="mt-6 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-brand-600 px-14 text-[17px] font-semibold text-white hover:bg-brand-700"
          >
            <LogIn className="size-5" />
            Se connecter à mon espace
          </button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Créer un compte">
      <Steps current={step} />

      {step === 0 && (
        <div className="mt-6">
          <h2 className="text-[22px] font-bold text-navy-900">Choisissez votre profil</h2>
          <p className="text-[14.5px] text-navy-900">Sélectionnez le type de compte qui vous correspond.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profils.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setProfil(p.value)}
                className={cn('relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors', profil === p.value ? 'border-brand-600 bg-[#f3f6fe] ring-2 ring-brand-600/40' : 'border-line hover:bg-slate-50')}
              >
                {profil === p.value && <CircleCheck className="absolute top-3 right-3 size-6 fill-brand-600 text-white" />}
                {p.visuel}
                <span>
                  <span className="block text-[16px] font-bold text-navy-900">{p.title}</span>
                  {p.text.map((t) => (
                    <span key={t} className="block text-[13px] text-navy-900">{t}</span>
                  ))}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={() => setStep(1)} className="inline-flex h-12 w-80 items-center justify-center gap-2.5 rounded-full bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700">
              Continuer <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <form noValidate onSubmit={form.handleSubmit(() => setStep(2))} className="mt-6 space-y-3.5">
          <div>
            <h2 className="text-[22px] font-bold text-navy-900">Informations générales</h2>
            <p className="text-[14.5px] text-navy-900">Renseignez les informations de base de votre compte.</p>
          </div>
          <Field label="Raison sociale / Nom et prénoms" required error={err.nom?.message}>
            <span className="relative block"><Building2 className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input className={input} {...register('nom')} /></span>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Téléphone" required error={err.telephone?.message}>
              <span className="relative block"><Phone className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input className={input} {...register('telephone')} /></span>
            </Field>
            <Field label="Email" required error={err.email?.message}>
              <span className="relative block"><Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input type="email" className={input} {...register('email')} /></span>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Région" required error={err.region?.message}><Select options={regions.map((r) => r.nom)} placeholder="Choisir" className="h-11 rounded-lg border-[#c9d4ea]" {...register('region')} /></Field>
            <Field label="Ville" required error={err.ville?.message}><Select options={villes.map((v) => v.nom)} placeholder="Choisir" className="h-11 rounded-lg border-[#c9d4ea]" {...register('ville')} /></Field>
            <Field label="Quartier" required error={err.quartier?.message}><Select options={quartiers} placeholder="Choisir" className="h-11 rounded-lg border-[#c9d4ea]" {...register('quartier')} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mot de passe" required error={err.motDePasse?.message}>
              <span className="relative block"><Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input type="password" className={input} {...register('motDePasse')} /><Eye className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" /></span>
            </Field>
            <Field label="Confirmer le mot de passe" required error={err.confirmation?.message}>
              <span className="relative block"><Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" /><input type="password" className={input} {...register('confirmation')} /><Eye className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" /></span>
            </Field>
          </div>
          <div className="grid grid-cols-[1fr_1.4fr] gap-4 pt-2">
            <button type="button" onClick={() => setStep(0)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
              <ArrowLeft className="size-5" /> Retour
            </button>
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700">
              Continuer <ArrowRight className="size-5" />
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-3">
          <div>
            <h2 className="text-[22px] font-bold text-navy-900">Vérification de votre profil – {titre}</h2>
            <p className="text-[14.5px] text-navy-900">Joignez les documents requis pour valider votre compte.</p>
          </div>
          {(profil === 'personne'
            ? [{ key: 'cni', label: 'Pièce d’identité (CNI ou passeport)', icon: <IdCard /> }]
            : [
                { key: 'autorisation', label: profil === 'ecole' ? 'Autorisation d’ouverture' : 'Justificatif d’activité', icon: <FileText /> },
                { key: 'niu', label: 'NIU (Numéro d’Identification Unique)', icon: <IdCard /> },
              ]
          ).map((d) => (
            <div key={d.key} className="flex items-center gap-4 rounded-xl border border-line px-4 py-3">
              <span className="text-brand-600 [&_svg]:size-7">{d.icon}</span>
              <span className="flex-1">
                <b className="block text-[15px] text-navy-900">{d.label} <span className="text-rose-500">*</span></b>
                <span className="text-[13px] text-navy-900">{pieces[d.key] ? `✓ ${pieces[d.key]}` : 'PDF, JPG ou PNG (max. 5 Mo)'}</span>
              </span>
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border-2 border-brand-600/60 px-4 text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                <Upload className="size-4" />
                Importer
                <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && setPieces({ ...pieces, [d.key]: e.target.files[0].name })} />
              </label>
            </div>
          ))}
          <p className="flex items-center gap-4 rounded-xl border border-dashed border-[#9fb4e3] bg-[#f3f7fe] px-4 py-3 text-[14px] text-navy-900">
            <ShieldCheck className="size-8 shrink-0 text-brand-600" />
            Vos documents sont confidentiels et seront vérifiés par l’équipe YIBOLO avant l’activation de votre compte.
          </p>
          <div className="grid grid-cols-[1fr_1.4fr] gap-4 pt-2">
            <button type="button" onClick={() => setStep(1)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-brand-600/60 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
              <ArrowLeft className="size-5" /> Retour
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success('Dossier envoyé pour vérification')
                setDone('attente')
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-[16px] font-semibold text-white hover:bg-brand-700"
            >
              <Check className="size-5" strokeWidth={3} /> Soumettre pour vérification
            </button>
          </div>
        </div>
      )}
    </AuthCard>
  )
}
