import { Fragment, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Trans, useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CalendarDays,
  Camera,
  Car,
  Check,
  CircleArrowDown,
  CircleCheck,
  CloudUpload,
  Coins,
  FileText,
  GraduationCap,
  IdCard,
  Info,
  Mail,
  MapPin,
  PencilLine,
  Send,
  ShieldCheck,
  ThumbsUp,
  Timer,
  BriefcaseMedical,
  UserRound,
  Upload,
} from 'lucide-react'
import { AEHeader } from '@/modules/ecole/auto-ecoles/components/AutoEcoleBlocks'
import { Select } from '@/shared/forms/Fields'
import { piecesAE, type PieceKey } from '@/modules/ecole/auto-ecoles/autoEcoleRules'
import { useInscriptionDraft } from '@/modules/ecole/auto-ecoles/hooks/useInscriptionDraft'
import { data } from '@/data'
import { useAutoEcole, useDecoupage, usePermisCatalogue, useSessions } from '@/data/hooks'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { demoDate, fcfa, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { notifier } from '@/shared/utils/notifications'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { joindrePiece } from '@/modules/ecole/auto-ecoles/piecesJointes'
import { SelectionGeographique } from '@/shared/forms/SelectionGeographique'
import { lieuDe, villeDuLieu } from '@/shared/utils/geographie'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const field = 'h-10 w-full rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[14px] text-ink outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100'
const pieceIcon: Record<PieceKey, ReactNode> = { cni: <IdCard />, photos: <Camera />, medical: <BriefcaseMedical /> }
/** Valeurs enregistrées dans le brouillon (inchangées), avec la clé de leur libellé. */
const sexes = [
  { value: 'Masculin', key: 'male' },
  { value: 'Féminin', key: 'female' },
] as const
const birthFormat: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' }

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1 block text-[14px] font-bold text-navy-900">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </span>
  )
}

function Heading({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return <h2 className={cn('flex items-center gap-2.5 text-[20px] font-bold text-navy-900 [&_svg]:size-7 [&_svg]:text-brand-600', className)}>{icon}{children}</h2>
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[14.5px] text-navy-900">
          <CircleCheck className="mt-0.5 size-5 shrink-0 fill-emerald-600 text-white" />
          {t}
        </li>
      ))}
    </ul>
  )
}

function Steps({ step }: { step: number }) {
  const { t } = useTranslation('driving-schools', { keyPrefix: 'enrollment' })
  const labels = [t('inscription.steps.infos'), t('inscription.steps.pieces'), t('inscription.steps.validation')]
  const allGreen = step === 2
  return (
    <ol className="flex items-start border-b border-line pb-3 sm:px-6">
      {labels.map((l, i) => (
        <Fragment key={l}>
          <li className="flex min-w-0 flex-col items-center gap-1.5 text-center sm:min-w-[150px]">
            <span
              className={cn(
                'grid size-9 place-items-center rounded-full border-2 text-[17px] font-bold',
                allGreen && i < 2 ? 'border-emerald-600 bg-emerald-600 text-white' : i === step ? 'border-brand-600 bg-brand-600 text-white' : 'border-navy-800 bg-white text-navy-900',
              )}
            >
              {allGreen && i < 2 ? <Check className="size-5" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('flex items-center gap-1.5 text-[13px] text-navy-900 sm:text-[14.5px]', i === step && 'font-bold')}>
              {l}
              {!allGreen && i < step && <CircleCheck className="size-4 fill-emerald-600 text-white" />}
            </span>
          </li>
          {i < labels.length - 1 && <li aria-hidden className={cn('mt-[18px] h-0.5 flex-1', allGreen ? (i === 0 ? 'bg-emerald-600' : 'bg-brand-600') : i < step ? 'bg-brand-600' : i === step ? 'bg-[linear-gradient(90deg,#1f55e6_50%,#c9d4ea_50%)]' : 'bg-[#c9d4ea]')} />}
        </Fragment>
      ))}
    </ol>
  )
}

export function InscriptionAutoEcole() {
  const { account } = useSession()
  const sessions = useSessions()
  const permisCatalogue = usePermisCatalogue()
  const { arrondissements } = useDecoupage()
  const { t } = useTranslation('driving-schools', { keyPrefix: 'enrollment' })
  const { id, code = 'B' } = useParams()
  const a = useAutoEcole(id)
  const p = permisCatalogue[code as PermisCode] ?? permisCatalogue.B
  const [d, update] = useInscriptionDraft(a.id, p.code)
  const ajouterPiece = async (cle: string, fichier: File, message: string) => {
    const id = await joindrePiece(fichier)
    if (!id) return void toast.error(t('toast.fileTooBig'))
    update({ pieces: { ...d.pieces, [cle]: true }, fichiers: { ...d.fichiers, [cle]: id } })
    toast.success(message)
  }
  const [step, setStep] = useState(0)
  const [certif, setCertif] = useState(true)
  const [sent, setSent] = useState(false)
  // Le dossier envoyé par un compte connecté : « Voir mon dossier » dans Mon espace.
  const [dossier, setDossier] = useState<string | null>(null)
  const navigate = useNavigate()
  const permisNom = t('permisName', { code: p.code, name: t(`permis.${p.code}.name`) })
  const lieu = `${a.ville} – ${a.quartier}`

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className={cn(card, 'p-8 text-center')}>
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CircleCheck className="size-10" /></span>
          <h1 className="mt-5 text-2xl font-bold text-navy-900">{t('inscription.sent.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('inscription.sent.text', { permis: permisNom, school: a.nom })}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={ROUTES.drivingSchool(a.id)} className="inline-flex h-11 flex-1 items-center justify-center rounded-full border-2 border-brand-600/60 font-semibold text-navy-800">{t('inscription.sent.backToSchool')}</Link>
            <Link to={ROUTES.drivingSchools} className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-brand-600 font-semibold text-white">{t('inscription.sent.otherSchools')}</Link>
          </div>
          {dossier && (
            <Link to={ROUTES.espaceInscription(dossier)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full font-semibold text-brand-700 hover:underline mt-3">
              {t('inscription.sent.voirDossier')}
            </Link>
          )}
        </div>
      </div>
    )
  }

  const v = (x: string, fallback: string) => x || fallback
  // Date de démonstration quand le champ est vide : « 15 mars 2001 » en français.
  const naissance = shortDate(d.naissance || new Date(2001, 2, 15), birthFormat)

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <AEHeader
        id={a.id}
        crumbs={[{ label: t('crumbs.school'), to: ROUTES.schools }, { label: t('crumbs.drivingSchools'), to: ROUTES.drivingSchools }, { label: a.nom, to: ROUTES.drivingSchool(a.id) }, { label: t('permisShort', { code: p.code }), to: ROUTES.license(a.id, p.code) }, { label: t('crumbs.enrollment') }]}
        title={
          step === 2 ? (
            t('inscription.header.validationTitle')
          ) : (
            <>
              {t('inscription.header.title')}
              <span className="block">{permisNom}</span>
            </>
          )
        }
        subtitle={step === 2 ? t('inscription.header.validationSubtitle') : undefined}
        image="/images/maquette/ae-hero-formations.jpg"
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_386px]">
        <div className={cn(card, 'min-w-0 px-4 pt-3 pb-5 sm:px-5')}>
          <Steps step={step} />

          {step === 0 && (
            <div className="space-y-4 pt-4">
              <Heading icon={<UserRound />}>{t('inscription.infos.heading')}</Heading>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><Label required>{t('form.lastName')}</Label><input className={field} placeholder={t('form.lastNamePlaceholder')} value={d.nom} onChange={(e) => update({ nom: e.target.value })} /></label>
                <label><Label required>{t('form.firstName')}</Label><input className={field} placeholder={t('form.firstNamePlaceholder')} value={d.prenom} onChange={(e) => update({ prenom: e.target.value })} /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_0.95fr_1.1fr]">
                <label>
                  <Label required>{t('form.birthDate')}</Label>
                  <span className="relative block">
                    <input className={field} placeholder={t('form.birthDatePlaceholder')} value={d.naissance} onChange={(e) => update({ naissance: e.target.value })} />
                    <Calendar className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" />
                  </span>
                </label>
                <label><Label required>{t('form.sex')}</Label><Select options={sexes.map((x) => ({ value: x.value, label: t(`sex.${x.key}`) }))} placeholder={t('form.select')} value={d.sexe} onChange={(e) => update({ sexe: e.target.value })} className="h-10 rounded-lg border-[#c9d4ea]" /></label>
                <label>
                  <Label required>{t('form.phone')}</Label>
                  <span className="flex h-10 overflow-hidden rounded-lg border border-[#c9d4ea] bg-white">
                    <span className="flex items-center gap-1.5 border-r border-[#c9d4ea] px-2.5 text-[14px] font-semibold text-navy-900">
                      <span aria-hidden className="flex h-3.5 w-5 overflow-hidden rounded-[2px]"><span className="w-1/3 bg-emerald-600" /><span className="w-1/3 bg-rose-600" /><span className="w-1/3 bg-sun-400" /></span>
                      +237 <span className="text-xs">▾</span>
                    </span>
                    <input className="min-w-0 flex-1 px-3 text-[14px] outline-none" placeholder="670 12 34 56" value={d.telephone} onChange={(e) => update({ telephone: e.target.value })} />
                  </span>
                </label>
              </div>
              <div className="grid gap-4">
                <label>
                  <Label>{t('form.emailOptional')}</Label>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" />
                    <input type="email" className={cn(field, 'pl-10')} placeholder={t('form.emailPlaceholder')} value={d.email} onChange={(e) => update({ email: e.target.value })} />
                  </span>
                </label>
                {/* Résidence : région → département → arrondissement (la ville s'en déduit), quartier. */}
                <SelectionGeographique valeur={lieuDe(d)} onChange={(l) => update({ ...l, ville: villeDuLieu(l, arrondissements) })} />
              </div>
              <div className="border-t border-line pt-4">
                <Heading icon={<Car />} className="text-[19px]">{t('inscription.infos.chosenTraining')}</Heading>
                <div className="mt-3 flex items-center gap-4 rounded-xl bg-[#eef3fc] p-3">
                  <span className="grid size-14 place-items-center rounded-xl bg-white text-navy-800"><Car className="size-8 fill-navy-800" /></span>
                  <div className="flex-1">
                    <p className="text-[16px] font-bold text-navy-900">{permisNom}</p>
                    <p className="text-[14px] text-navy-900">{t('inscription.infos.schoolLocation', { school: a.nom, city: a.ville, neighbourhood: a.quartier })}</p>
                  </div>
                  <Link to={ROUTES.editEnrollment(a.id, p.code, 'formation')} className="inline-flex h-9 items-center gap-1.5 rounded-lg border-2 border-brand-600/60 bg-white px-4 text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                    <PencilLine className="size-4" />
                    {t('actions.edit')}
                  </Link>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 pt-4">
              <div>
                <Heading icon={<FileText />}>{t('inscription.pieces.heading')}</Heading>
                <p className="mt-1 text-[14.5px] text-navy-900">{t('inscription.pieces.intro')}</p>
              </div>
              <div className="space-y-2.5">
                {piecesAE.map((pc) => {
                  const ok = d.pieces[pc.key]
                  return (
                    <div key={pc.key} className="flex flex-wrap items-center gap-4 border-b border-line pb-2.5 last:border-0">
                      <span className="grid h-11 w-14 place-items-center rounded-lg bg-[#eef3fc] text-brand-600 [&_svg]:size-7">{pieceIcon[pc.key]}</span>
                      <div className="min-w-[220px] flex-1">
                        <p className="text-[15px] font-bold text-navy-900">{t(`pieces.${pc.key}.label`)}</p>
                        <p className="text-[12.5px] text-navy-900">{t(`pieces.${pc.key}.hint`)}</p>
                      </div>
                      {ok ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{t(`pieces.${pc.key}.state`)}</span>
                      ) : (
                        <span className="rounded-lg bg-rose-100 px-3 py-1 text-[13px] font-semibold text-rose-600">{t('inscription.pieces.required')}</span>
                      )}
                      <span className="hidden h-10 w-px bg-line sm:block" />
                      <label className="inline-flex h-10 w-50 cursor-pointer items-center justify-center gap-2.5 rounded-lg border-2 border-[#9fb4e3] bg-white text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                        <Upload className="size-5" />
                        {ok ? t('actions.replace') : t(`pieces.${pc.key}.button`)}
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void ajouterPiece(pc.key, f, t('toast.pieceAdded', { piece: t(`pieces.${pc.key}.short`) })) }} />
                      </label>
                    </div>
                  )
                })}
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#9fb4e3] bg-[#f3f7fe] py-5 text-center">
                <CloudUpload className="size-8 text-brand-600" />
                <span className="text-[15px] font-bold text-navy-900">{t('inscription.pieces.dropTitle')}</span>
                <span className="text-[13px] text-navy-900">{t('inscription.pieces.dropText')}</span>
                <input
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    e.target.value = ''
                    if (!f) return
                    // Le fichier déposé complète la première pièce manquante (sinon : pièce supplémentaire).
                    const cle = piecesAE.find((pc) => !d.pieces[pc.key])?.key ?? `autre-${Object.keys(d.pieces).length + 1}`
                    void ajouterPiece(cle, f, t('toast.fileAdded', { name: f.name }))
                  }}
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 pt-4">
              <Heading icon={<FileText />} className="text-[22px]">{t('inscription.recap.heading')}</Heading>
              <div className="grid gap-4 md:grid-cols-2">
                <RecapCard icon={<UserRound />} title={t('inscription.recap.personal')} edit={ROUTES.editEnrollment(a.id, p.code, 'infos')}>
                  <Row k={t('inscription.recap.fullName')} v={`${v(d.nom.toUpperCase(), 'MBOG')} ${v(d.prenom, 'Pauline Aline')}`} />
                  <Row k={t('inscription.recap.birthDate')} v={naissance} />
                  <Row k={t('inscription.recap.phone')} v={`+237 ${v(d.telephone, '670 12 34 56')}`} />
                  <Row k={t('inscription.recap.email')} v={v(d.email, 'pauline.mbog@gmail.com')} />
                  <Row k={t('inscription.recap.location')} v={`${v(d.ville, 'Yaoundé')} – ${v(d.quartier, 'Bastos')}`} />
                </RecapCard>
                <RecapCard icon={<GraduationCap />} title={t('inscription.recap.training')} edit={ROUTES.editEnrollment(a.id, p.code, 'formation')}>
                  <Row k={t('inscription.recap.licence')} v={permisNom} />
                  <Row k={t('inscription.recap.drivingSchool')} v={a.nom} />
                  <Row k={t('inscription.recap.place')} v={lieu} />
                  <Row k={t('inscription.recap.price')} v={fcfa(p.prix)} />
                  <Row k={t('inscription.recap.session')} v={demoDate(d.session)} />
                  <Row k={t('inscription.recap.duration')} v={t(`permis.${p.code}.duration`)} />
                </RecapCard>
              </div>
              <div className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between">
                  <Heading icon={<FileText />} className="text-[18px] [&_svg]:size-6">{t('inscription.recap.piecesProvided')}</Heading>
                  <Link to={ROUTES.editEnrollment(a.id, p.code, 'pieces')} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#c9d4ea] px-3 text-[13px] font-semibold text-navy-800"><PencilLine className="size-4" />{t('actions.edit')}</Link>
                </div>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {piecesAE.map((pc) => (
                    <div key={pc.key} className="flex items-center gap-3 rounded-xl bg-[#eef3fc] px-3 py-2">
                      <span className="text-brand-600 [&_svg]:size-7">{pieceIcon[pc.key]}</span>
                      <span className="flex-1 leading-tight">
                        <b className="block text-[15px] text-navy-900">{t(`pieces.${pc.key}.short`)}</b>
                        <span className="text-[13px] text-navy-900">{t(`pieces.${pc.key}.state`)}</span>
                      </span>
                      <CircleCheck className="size-6 fill-emerald-600 text-white" />
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 border-t border-line pt-3 text-[14.5px] text-navy-900">
                <input type="checkbox" checked={certif} onChange={(e) => setCertif(e.target.checked)} className="mt-0.5 size-6 accent-brand-600" />
                <span>
                  <Trans
                    t={t}
                    i18nKey="inscription.recap.certify"
                    components={{
                      conditions: <Link to={ROUTES.terms} className="text-brand-600 underline" />,
                      privacy: <Link to={ROUTES.terms} className="text-brand-600 underline" />,
                    }}
                  />
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <button type="button" onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))} className="inline-flex h-11 w-36 items-center justify-center gap-2.5 rounded-xl border-2 border-[#c9d4ea] bg-white text-[16px] font-semibold text-navy-900 hover:bg-slate-50">
              <ArrowLeft className="size-5" />
              {step === 0 ? t('actions.back') : t('actions.previous')}
            </button>
            {step < 2 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="inline-flex h-11 w-52 items-center justify-center gap-2.5 rounded-xl bg-brand-600 text-[16px] font-semibold text-white hover:bg-brand-700">
                {t('actions.next')} <ArrowRight className="size-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  if (!certif) return toast.error(t('toast.certifyRequired'))
                  const cree = await data.create('inscriptionsAutoEcole', { compteId: account?.id, autoEcoleId: a.id, permis: p.code, envoyeeLe: new Date().toISOString(), statut: 'Envoyée', donnees: d }, 'inscription')
                  if (account?.role === 'utilisateur') setDossier(cree.id)
                  // La session choisie compte une place de moins.
                  const session = sessions.find((s) => s.permis === p.code && s.debut === d.session)
                  if (session) await data.update('sessions', session.id, { places: Math.max(0, session.places - 1) })
                  if (account) await notifier(account.id, { type: 'session', titre: t('notificationCandidat.titre'), texte: t('notificationCandidat.texte', { licence: p.code, school: a.nom }), quand: t('notificationCandidat.quand'), vers: ROUTES.espace('auto-ecole') })
                  toast.success(t('toast.sent'))
                  setSent(true)
                }}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 px-12 text-[18px] font-semibold text-white hover:bg-brand-700"
              >
                <Send className="size-6" />
                {t('actions.send')}
              </button>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          {step === 0 && (
            <>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<FileText />}>{t('inscription.aside.summary')}</Heading>
                <dl className="mt-2 divide-y divide-line text-[13.5px] text-navy-900">
                  {[
                    { icon: <Building2 />, k: t('inscription.aside.drivingSchool'), v: a.nom },
                    { icon: <GraduationCap />, k: t('inscription.aside.training'), v: permisNom },
                    { icon: <MapPin className="fill-brand-600 text-white" />, k: t('inscription.aside.place'), v: lieu },
                    { icon: <Coins />, k: t('inscription.aside.price'), v: <b className="text-[18px] text-brand-700">{fcfa(p.prix)}</b> },
                  ].map((r) => (
                    <div key={r.k} className="grid grid-cols-[24px_1fr_auto] items-center gap-2.5 py-2 [&>svg]:size-5 [&>svg]:text-brand-600">
                      {r.icon}
                      <dt className="font-semibold">{r.k}</dt>
                      <dd>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-2xl border border-line bg-[#eef3fc] p-4">
                <Heading icon={<CalendarDays />}>{t('inscription.aside.nextSessions')}</Heading>
                <ul className="mt-2 space-y-1.5 text-[15px] text-navy-900">
                  <li className="flex items-center gap-2.5"><CalendarDays className="size-5 text-brand-600" /><b>{t('inscription.aside.start')}</b> {demoDate('15 novembre 2026')}</li>
                  <li className="flex items-center gap-2.5"><Timer className="size-5 text-brand-600" /><b>{t('inscription.aside.duration')}</b> {t(`permis.${p.code}.duration`)}</li>
                </ul>
                <span className="mx-auto mt-2 block w-fit rounded-full bg-emerald-600 px-4 py-1 text-[14px] font-semibold text-white">{t('inscription.aside.placesAvailable')}</span>
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<ThumbsUp />}>{t('inscription.aside.benefits')}</Heading>
                <Checks items={[t('inscription.aside.benefit1'), t('inscription.aside.benefit2'), t('inscription.aside.benefit3')]} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<GraduationCap />}>{t('inscription.aside.yourTraining')}</Heading>
                <dl className="mt-2 divide-y divide-line text-[14px] text-navy-900">
                  {[
                    { icon: <Car />, k: t('inscription.aside.chosenLicence'), v: permisNom },
                    { icon: <Building2 />, k: t('inscription.aside.drivingSchoolLower'), v: a.nom },
                    { icon: <MapPin className="fill-brand-600 text-white" />, k: t('inscription.aside.place'), v: lieu },
                  ].map((r) => (
                    <div key={r.k} className="grid grid-cols-[24px_110px_1fr] items-center gap-2.5 py-2.5 [&>svg]:size-5 [&>svg]:text-brand-600">
                      {r.icon}
                      <dt className="font-semibold">{r.k}</dt>
                      <dd>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<Info />}>{t('inscription.aside.tips')}</Heading>
                <Checks items={[t('inscription.aside.tip1'), t('inscription.aside.tip2'), t('inscription.aside.tip3'), t('inscription.aside.tip4')]} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-[#e7f7ec] p-4">
                <ShieldCheck className="size-10 shrink-0 fill-emerald-600 text-white" />
                <div>
                  <p className="text-[17px] leading-snug font-bold text-navy-900">{t('inscription.aside.willBeSent', { school: a.nom })}</p>
                  <p className="mt-1 text-[14px] text-navy-900">{t('inscription.aside.notification')}</p>
                </div>
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<CircleArrowDown />}>{t('inscription.aside.nextSteps')}</Heading>
                <ol className="mt-3 space-y-3">
                  {[
                    [t('inscription.aside.step1Title'), t('inscription.aside.step1Text')],
                    [t('inscription.aside.step2Title'), t('inscription.aside.step2Text')],
                    [t('inscription.aside.step3Title'), t('inscription.aside.step3Text')],
                  ].map(([title, s], i) => (
                    <li key={title} className="flex gap-3 border-b border-line pb-2.5 last:border-0">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-[15px] font-bold text-white">{i + 1}</span>
                      <span>
                        <b className="block text-[15px] text-navy-900">{title}</b>
                        <span className="text-[13.5px] text-navy-900">{s}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<Info />}>{t('inscription.aside.goodToKnow')}</Heading>
                <Checks items={[t('inscription.aside.know1'), t('inscription.aside.know2'), t('inscription.aside.know3')]} />
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

function RecapCard({ icon, title, edit, children }: { icon: ReactNode; title: string; edit: string; children: ReactNode }) {
  const { t } = useTranslation('driving-schools', { keyPrefix: 'enrollment' })
  return (
    <div className="rounded-xl border border-line p-3">
      <div className="flex items-center justify-between">
        <Heading icon={icon} className="text-[17px] [&_svg]:size-6">{title}</Heading>
        <Link to={edit} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#c9d4ea] px-3 text-[13px] font-semibold text-navy-800 hover:bg-brand-50">
          <PencilLine className="size-4" />
          {t('actions.edit')}
        </Link>
      </div>
      <dl className="mt-2 divide-y divide-line">{children}</dl>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  const { t } = useTranslation('driving-schools', { keyPrefix: 'enrollment' })
  return (
    <div className="grid grid-cols-[150px_1fr] gap-2 py-1.5 text-[14px] text-navy-900">
      <dt className="font-bold">{t('inscription.recap.rowLabel', { label: k })}</dt>
      <dd>{v}</dd>
    </div>
  )
}
