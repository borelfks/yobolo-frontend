import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CircleCheck,
  ClipboardPen,
  Clock,
  Coins,
  Eye,
  FileText,
  GraduationCap,
  Headphones,
  Info,
  Landmark,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Sun,
  Upload,
  UserRound,
} from 'lucide-react'
import { Hero } from '@/shared/components/ui/Hero'
import { Img } from '@/shared/components/ui/Img'
import { Select } from '@/shared/components/forms/Fields'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import { modeKey } from '@/features/schools/components/training/trainingShared'
import { etablissementById, formationById } from '@/mocks/schools'
import { cn } from '@/shared/utils/cn'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const field = 'h-11 w-full rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[14px] text-ink outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100'
const steps = [
  ['info1', 'info2'],
  ['parcours1', 'parcours2'],
  ['pieces1', 'pieces2'],
  ['validation'],
] as const
const pieces = ['cni', 'diplome', 'releve', 'photo'] as const
const sexes = ['masculin', 'feminin'] as const
const nationalites = ['camerounaise', 'tchadienne', 'gabonaise', 'centrafricaine', 'congolaise', 'autre'] as const
const diplomas = ['baccalaureat', 'probatoire', 'bts', 'licence', 'gceALevel'] as const
type Diploma = (typeof diplomas)[number]

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-[14px] font-bold text-navy-900">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </span>
  )
}

export function Preinscription() {
  const { t } = useTranslation('schools')
  const { id } = useParams()
  const f = formationById(id)
  const e = etablissementById(f.etablissementId)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [files, setFiles] = useState<Record<string, string>>({})
  const [info, setInfo] = useState({ nom: '', prenom: '', sexe: '', naissance: '', nationalite: 'camerounaise', telephone: '', email: '' })
  const [parcours, setParcours] = useState<{ diplome: Diploma; serie: string; annee: string; etablissement: string; autre: boolean }>({ diplome: 'baccalaureat', serie: '', annee: '', etablissement: '', autre: false })

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className={cn(card, 'p-8 text-center')}>
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <CircleCheck className="size-10" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-navy-900">{t('preinscription.sent.title')}</h1>
          <p className="mt-2 text-muted">
            <Trans t={t} i18nKey="preinscription.sent.text" values={{ school: e.nom, training: f.nom }} components={{ b: <b /> }} />
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate(ecoleUrl(e))} className="h-11 flex-1 rounded-full border-2 border-brand-600/60 font-semibold text-navy-800">
              {t('preinscription.sent.back')}
            </button>
            <button type="button" onClick={() => navigate(ROUTES.schools)} className="h-11 flex-1 rounded-full bg-brand-600 font-semibold text-white">
              {t('preinscription.sent.explore')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const nomComplet = `${info.nom.toUpperCase()} ${info.prenom}`.trim() || 'NDJON MBOG Thierry'

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Hero
        crumbs={[
          { label: t('shared.school'), to: ROUTES.schools },
          { label: t('shared.types.ipes'), to: ROUTES.schoolType('ipes') },
          { label: e.nom, to: ecoleUrl(e) },
          ...(step < 3 ? [{ label: f.nom, to: ROUTES.training(f.id) }] : []),
          { label: t('preinscription.crumb') },
        ]}
        icon={<ClipboardPen />}
        image="/images/maquette/preinscription-hero.jpg"
        title={t('preinscription.heroTitle')}
        subtitle={step === 3 ? t('preinscription.subtitleRecap') : t('preinscription.subtitle')}
      />
      <div className="grid gap-5 lg:grid-cols-[328px_1fr]">
        <aside className="space-y-4">
          <div className={cn(card, 'overflow-hidden p-1.5')}>
            <Img src={e.id === 'ipc' ? '/images/maquette/preinscription-ipc.jpg' : e.image} alt={e.nom} className="h-[112px] w-full rounded-xl" />
            <div className="space-y-1 px-3 pt-3 pb-3">
              <p className="text-[20px] font-bold text-navy-900">{f.nom}</p>
              <p className="flex items-center gap-2 text-[14.5px] text-navy-900"><Landmark className="size-5" />{e.nom}</p>
              <p className="flex items-center gap-2 border-b border-line pb-3 text-[14.5px] text-navy-900"><MapPin className="size-5" />{e.ville} – {e.quartier}</p>
              <ul className="space-y-2 pt-2 text-[15px] text-navy-900 [&_svg]:size-6 [&_svg]:text-navy-800">
                <li className="flex items-center gap-3"><GraduationCap /><b>{t('preinscription.aside.diplome')}</b> : {f.diplome}</li>
                <li className="flex items-center gap-3"><Clock /><b>{t('preinscription.aside.duree')}</b> : {t('shared.months', { count: f.dureeMois })}</li>
                <li className="flex items-center gap-3"><Sun className="fill-amber-300 !text-amber-500" /><b>{t('preinscription.aside.cours')}</b> : {t(`shared.modes.${modeKey[f.mode]}`)}</li>
                <li className="flex items-start gap-3">
                  <Coins />
                  <span>
                    <b>{t('preinscription.aside.fees')}</b>
                    <span className="block text-[18px] font-bold text-brand-600">{fcfa(f.fraisAn)} {t('shared.perYear')}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className={cn(card, 'flex items-center gap-3 p-3')}>
            <span className="grid size-12 place-items-center rounded-xl bg-[#eef3fc] text-brand-600"><Headphones className="size-7" /></span>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-navy-900">{t('preinscription.aside.question')}</p>
              <p className="flex items-center gap-1.5 text-[16px] font-bold text-navy-900"><Phone className="size-4" />{e.telephone}</p>
            </div>
            <button type="button" aria-label={t('preinscription.aside.whatsappAria')} onClick={() => toast(t('preinscription.aside.whatsappToast'))} className="grid size-12 place-items-center rounded-xl bg-[#dcf7e5]">
              <svg viewBox="0 0 24 24" className="size-8" aria-hidden>
                <circle cx="12" cy="12" r="11" fill="#25D366" />
                <path fill="#fff" d="M16.7 13.9c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3c.2-.6.2-1 .1-1.1l-.3-.3Z" />
              </svg>
            </button>
          </div>
        </aside>

        <div className="space-y-4">
          <ol className="flex items-center gap-2 rounded-2xl border border-line bg-[#f3f6fc] p-1.5 shadow-sm">
            {steps.map((s, i) => (
              <li key={s[0]} className={cn('flex items-center gap-3', i < steps.length - 1 && 'flex-1')}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => setStep(i)}
                  className={cn('flex items-center gap-3 rounded-full px-3 py-1.5 text-left text-[15px] leading-tight', i <= step && i < 3 && 'bg-[#e3ebfb]', i === step && 'font-semibold text-navy-900')}
                >
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-full text-[18px] font-bold text-white', i < step ? 'bg-brand-600' : i === step ? 'bg-brand-600' : 'bg-[#a7b3c9]')}>
                    {i < step ? <Check className="size-5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={cn('text-navy-900', i === 3 && i === step && 'text-[20px] font-bold')}>
                    {t(`preinscription.steps.${s[0]}`)}
                    {s[1] && <span className="block">{t(`preinscription.steps.${s[1]}`)}</span>}
                  </span>
                </button>
                {i < steps.length - 1 && <span className="h-px flex-1 bg-[#b9c4d8]" />}
              </li>
            ))}
          </ol>

          <div className={cn(card, 'p-5')}>
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900"><UserRound className="size-7 fill-brand-600 text-brand-600" />{t('preinscription.step1.title')}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><Label required>{t('preinscription.step1.nom')}</Label><input className={field} placeholder={t('preinscription.step1.nomPlaceholder')} value={info.nom} onChange={(ev) => setInfo({ ...info, nom: ev.target.value })} /></label>
                  <label><Label required>{t('preinscription.step1.prenom')}</Label><input className={field} placeholder={t('preinscription.step1.prenomPlaceholder')} value={info.prenom} onChange={(ev) => setInfo({ ...info, prenom: ev.target.value })} /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1.1fr]">
                  <label><Label required>{t('preinscription.step1.sexe')}</Label><Select options={sexes.map((x) => ({ value: x, label: t(`preinscription.step1.sexes.${x}`) }))} placeholder={t('preinscription.step1.select')} value={info.sexe} onChange={(ev) => setInfo({ ...info, sexe: ev.target.value })} className="rounded-lg border-[#c9d4ea]" /></label>
                  <label>
                    <Label required>{t('preinscription.step1.naissance')}</Label>
                    <span className="relative block">
                      <input className={field} placeholder={t('preinscription.step1.naissancePlaceholder')} value={info.naissance} onChange={(ev) => setInfo({ ...info, naissance: ev.target.value })} />
                      <Calendar className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" />
                    </span>
                  </label>
                  <label><Label required>{t('preinscription.step1.nationalite')}</Label><Select options={nationalites.map((x) => ({ value: x, label: t(`preinscription.step1.nationalites.${x}`) }))} value={info.nationalite} onChange={(ev) => setInfo({ ...info, nationalite: ev.target.value })} className="rounded-lg border-[#c9d4ea]" /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <Label required>{t('preinscription.step1.telephone')}</Label>
                    <span className="flex h-11 overflow-hidden rounded-lg border border-[#c9d4ea] bg-white">
                      <span className="flex items-center gap-2 border-r border-[#c9d4ea] px-3 text-[15px] font-semibold text-navy-900">
                        <span aria-hidden className="flex h-4 w-6 overflow-hidden rounded-[2px]"><span className="w-1/3 bg-emerald-600" /><span className="w-1/3 bg-rose-600" /><span className="w-1/3 bg-sun-400" /></span>
                        +237 <span className="text-xs">▾</span>
                      </span>
                      <input className="min-w-0 flex-1 px-3.5 text-[14px] outline-none" placeholder={t('preinscription.step1.telephonePlaceholder')} value={info.telephone} onChange={(ev) => setInfo({ ...info, telephone: ev.target.value })} />
                    </span>
                  </label>
                  <label>
                    <Label>{t('preinscription.step1.email')}</Label>
                    <span className="relative block">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" />
                      <input type="email" className={cn(field, 'pl-11')} placeholder={t('preinscription.step1.emailPlaceholder')} value={info.email} onChange={(ev) => setInfo({ ...info, email: ev.target.value })} />
                    </span>
                  </label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900"><GraduationCap className="size-7 text-brand-600" />{t('preinscription.step2.title')}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><Label required>{t('preinscription.step2.diplome')}</Label><Select options={diplomas.map((x) => ({ value: x, label: t(`preinscription.step2.diplomas.${x}`) }))} value={parcours.diplome} onChange={(ev) => setParcours({ ...parcours, diplome: ev.target.value as Diploma })} className="rounded-lg border-[#c9d4ea]" /></label>
                  <label><Label required>{t('preinscription.step2.serie')}</Label><input className={field} placeholder={t('preinscription.step2.seriePlaceholder')} value={parcours.serie} onChange={(ev) => setParcours({ ...parcours, serie: ev.target.value })} /></label>
                  <label><Label required>{t('preinscription.step2.annee')}</Label><Select options={['2026', '2025', '2024', '2023', '2022']} placeholder={t('preinscription.step2.select')} value={parcours.annee} onChange={(ev) => setParcours({ ...parcours, annee: ev.target.value })} className="rounded-lg border-[#c9d4ea]" /></label>
                  <label><Label required>{t('preinscription.step2.etablissement')}</Label><input className={field} placeholder={t('preinscription.step2.etablissementPlaceholder')} value={parcours.etablissement} onChange={(ev) => setParcours({ ...parcours, etablissement: ev.target.value })} /></label>
                </div>
                <label className="flex items-center gap-2.5 text-[14px] text-navy-900">
                  <input type="checkbox" checked={parcours.autre} onChange={(ev) => setParcours({ ...parcours, autre: ev.target.checked })} className="size-[18px] accent-brand-600" />
                  {t('preinscription.step2.autre')}
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900"><FileText className="size-7 text-brand-600" />{t('preinscription.step3.title')}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pieces.map((p) => (
                    <div key={p}>
                      <Label required>{t(`preinscription.step3.pieces.${p}`)}</Label>
                      <label className="flex h-14 cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-[#b9c8e6] bg-[#f7f9fe] px-4 text-[14px] text-navy-900 hover:bg-brand-50">
                        <Upload className="size-5 text-brand-600" />
                        <span className="flex-1 truncate">{files[p] ?? t('preinscription.step3.chooseFile')}</span>
                        {files[p] ? <CircleCheck className="size-5 fill-emerald-500 text-white" /> : <Info className="size-5 text-navy-800" />}
                        <input type="file" className="sr-only" onChange={(ev) => ev.target.files?.[0] && setFiles({ ...files, [p]: ev.target.files[0].name })} />
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-[13.5px] text-muted">{t('preinscription.step3.formats')}</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-full bg-brand-600 text-white"><Check className="size-8" strokeWidth={3} /></span>
                  <div>
                    <h2 className="text-[22px] font-bold text-navy-900">{t('preinscription.recap.title')}</h2>
                    <p className="text-[13.5px] text-navy-900">{t('preinscription.recap.intro')}</p>
                  </div>
                </div>
                <RecapBlock icon={<UserRound className="fill-brand-600" />} title={t('preinscription.recap.personal')} onEdit={() => setStep(0)}>
                  <span><b>{t('preinscription.recap.nom')}</b> {nomComplet}</span>
                  <span><b>{t('preinscription.recap.telephone')}</b> +237 {info.telephone || '6 90 12 34 56'}</span>
                  <span><b>{t('preinscription.recap.email')}</b> {info.email || 'thierry.ndjon@gmail.com'}</span>
                </RecapBlock>
                <RecapBlock icon={<GraduationCap />} title={t('preinscription.recap.parcours')} onEdit={() => setStep(1)}>
                  <span><b>{t('preinscription.recap.diplome')}</b> {t(`preinscription.step2.diplomas.${parcours.diplome}`)}</span>
                  <span><b>{t('preinscription.recap.serie')}</b> {parcours.serie || 'G2'}</span>
                  <span><b>{t('preinscription.recap.annee')}</b> {parcours.annee || '2023'}</span>
                  <span><b>{t('preinscription.recap.etablissement')}</b> {parcours.etablissement || 'Lycée Moderne de Yaoundé'}</span>
                </RecapBlock>
                <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[#eef3fc] px-4 py-2.5">
                  <FileText className="size-6 text-navy-800" />
                  <span className="text-[16px] font-bold text-navy-900">{t('preinscription.recap.attachments')}</span>
                  <span className="flex flex-1 items-center gap-1.5 text-[13px] text-navy-900">
                    <CircleCheck className="size-5 fill-emerald-600 text-white" />
                    {t('preinscription.recap.allUploaded')}
                  </span>
                  <button type="button" onClick={() => setStep(2)} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#c9d4ea] bg-white px-3 text-[13px] font-semibold text-navy-800">
                    <Eye className="size-4" />
                    {t('preinscription.recap.seePieces')}
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#e5f7ea] px-4 py-2.5">
                  <ShieldCheck className="size-7 fill-emerald-600 text-white" />
                  <div className="text-[13px] text-navy-900">
                    <p className="text-[14px] font-bold text-emerald-700">{t('preinscription.recap.secureTitle')}</p>
                    {t('preinscription.recap.secureText')}
                  </div>
                </div>
              </div>
            )}

            <div className={cn('mt-5 flex items-center gap-4 pt-4', step < 3 ? 'justify-end border-t border-line' : 'justify-between')}>
              <button
                type="button"
                onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}
                className={cn('inline-flex h-11 items-center justify-center gap-2.5 rounded-full text-[16px] font-semibold text-navy-800', step < 3 ? 'w-44 border border-[#c9d4ea] bg-[#eef3fc]' : 'w-50 border-2 border-brand-600/60 bg-white')}
              >
                <ArrowLeft className="size-5" />
                {t('preinscription.nav.back')}
              </button>
              {step < 3 ? (
                <button type="button" onClick={() => setStep(step + 1)} className="inline-flex h-11 w-48 items-center justify-center gap-2.5 rounded-full bg-brand-600 text-[16px] font-semibold text-white hover:bg-brand-700">
                  {t('preinscription.nav.next')}
                  <ArrowRight className="size-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    toast.success(t('preinscription.toastValidated'))
                    setSent(true)
                  }}
                  className="inline-flex h-11 items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-10 text-[16px] font-semibold text-white hover:bg-emerald-700"
                >
                  <Check className="size-5" strokeWidth={3} />
                  {t('preinscription.nav.submit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RecapBlock({ icon, title, onEdit, children }: { icon: ReactNode; title: string; onEdit: () => void; children: ReactNode }) {
  const { t } = useTranslation('schools')
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex items-center gap-3 bg-[#eef3fc] px-4 py-2">
        <span className="text-brand-600 [&_svg]:size-6">{icon}</span>
        <span className="flex-1 text-[16px] font-bold text-navy-900">{title}</span>
        <button type="button" onClick={onEdit} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#c9d4ea] bg-white px-3 text-[13px] font-semibold text-navy-800">
          <PencilLine className="size-4" />
          {t('preinscription.recap.edit')}
        </button>
      </div>
      <div className="flex flex-wrap gap-y-1 px-3 py-2.5 text-[13.5px] text-navy-900 [&>span]:border-line [&>span]:px-3 [&>span:not(:first-child)]:border-l">{children}</div>
    </div>
  )
}
