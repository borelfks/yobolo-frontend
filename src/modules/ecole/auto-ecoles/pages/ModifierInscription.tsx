import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { LienActif } from '@/shared/ui/LienActif'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseMedical,
  Building2,
  Calendar,
  CalendarDays,
  Camera,
  Car,
  Check,
  ChevronDown,
  CircleCheck,
  Clock,
  CloudUpload,
  Coins,
  Eye,
  FileText,
  GraduationCap,
  IdCard,
  Info,
  MapPin,
  Plus,
  RefreshCw,
  UserRound,
} from 'lucide-react'
import { AEHeader } from '@/modules/ecole/auto-ecoles/components/AutoEcoleBlocks'
import { piecesAE, type PieceKey } from '@/modules/ecole/auto-ecoles/autoEcoleRules'
import { useInscriptionDraft } from '@/modules/ecole/auto-ecoles/hooks/useInscriptionDraft'
import { useAutoEcoles, useDecoupage, useFichiers, usePermisCatalogue, useSessions } from '@/data/hooks'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { demoDate, fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { joindrePiece } from '@/modules/ecole/auto-ecoles/piecesJointes'
import { telecharger } from '@/shared/utils/fichiers'
import { SelectionGeographique } from '@/shared/forms/SelectionGeographique'
import { lieuDe, villeDuLieu } from '@/shared/utils/geographie'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const field = 'h-11 w-full rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[15px] text-ink outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100'
const pieceIcon: Record<PieceKey, ReactNode> = { cni: <IdCard />, photos: <Camera />, medical: <BriefcaseMedical /> }
/** Valeurs enregistrées dans le brouillon (inchangées), avec la clé de leur libellé. */
const sexes = [
  { value: 'Féminin', key: 'female' },
  { value: 'Masculin', key: 'male' },
] as const
/** Sections modifiables (segment final de l'adresse). */
const sections = ['infos', 'formation', 'pieces'] as const
type Section = (typeof sections)[number]
const isSection = (s: string): s is Section => (sections as readonly string[]).includes(s)

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1 block text-[15px] font-bold text-navy-900">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </span>
  )
}

function Heading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900 [&_svg]:size-8 [&_svg]:text-brand-600">{icon}{children}</h2>
}

function IconSelect({ icon, value, options, onChange }: { icon: ReactNode; value: string; options: { value: string; label: string }[]; onChange?: (v: string) => void }) {
  return (
    <label className="relative flex h-11 items-center gap-3 rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[15px] text-navy-900">
      <span className="text-brand-600 [&_svg]:size-5">{icon}</span>
      <span className="flex-1 truncate">{options.find((o) => o.value === value)?.label ?? value}</span>
      <ChevronDown className="size-5" />
      <select value={value} onChange={(e) => onChange?.(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-3">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-[15px] text-navy-900">
          <CircleCheck className="mt-0.5 size-6 shrink-0 fill-emerald-600 text-white" />
          {t}
        </li>
      ))}
    </ul>
  )
}

export function ModifierInscription() {
  const permisCatalogue = usePermisCatalogue()
  const { arrondissements } = useDecoupage()
  const { t } = useTranslation('driving-schools', { keyPrefix: 'enrollment' })
  const { id, code = 'B', section = 'infos' } = useParams({ strict: false })
  const autoEcoles = useAutoEcoles()
  const sessions = useSessions()
  /** Comme avant : un identifiant inconnu donne la première auto-école. */
  const trouverAutoEcole = (x?: string) => autoEcoles.find((e) => e.id === x) ?? autoEcoles[0]!
  const a = trouverAutoEcole(id)
  const p = permisCatalogue[code as PermisCode] ?? permisCatalogue.B
  const [d, update] = useInscriptionDraft(a.id, p.code)
  const fichiers = useFichiers()
  const voir = (cle: string) => {
    const f = fichiers.find((x) => x.id === d.fichiers?.[cle])
    if (f) telecharger(f.dataUrl, f.nom)
    else toast(t('toast.noFile'))
  }
  const ajouterPiece = async (cle: string, fichier: File, message: string) => {
    const id = await joindrePiece(fichier)
    if (!id) return void toast.error(t('toast.fileTooBig'))
    update({ pieces: { ...d.pieces, [cle]: true }, fichiers: { ...d.fichiers, [cle]: id } })
    toast.success(message)
  }
  const navigate = useNavigate()
  const base = ROUTES.enrollment(a.id, p.code)
  const [form, setForm] = useState(d)
  const [newAe, setNewAe] = useState(a.id)
  const [newPermis, setNewPermis] = useState<PermisCode>(p.code)
  const [session, setSession] = useState(d.session)
  const target = permisCatalogue[newPermis]
  const permisName = (c: PermisCode) => t('permisName', { code: c, name: t(`permis.${c}.name`) })
  const current: Section = isSection(section) ? section : 'infos'
  const title = t(`edit.sections.${current}.title`)
  const subtitle = t(`edit.sections.${current}.subtitle`)
  const crumb = t(`edit.sections.${current}.crumb`)
  const menu = [
    { key: 'infos', label: [t('edit.menu.infos1'), t('edit.menu.infos2')], icon: UserRound },
    { key: 'formation', label: [t('edit.menu.formation')], icon: GraduationCap },
    { key: 'pieces', label: [t('edit.menu.pieces')], icon: FileText },
  ]

  const save = () => {
    if (section === 'infos') update(form)
    if (section === 'formation') {
      update({ session })
      toast.success(t('toast.trainingUpdated'))
      return navigate({ href: ROUTES.enrollment(newAe, newPermis) })
    }
    toast.success(t('toast.changesSaved'))
    navigate({ href: base })
  }

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <AEHeader
        id={a.id}
        crumbs={[
          { label: t('crumbs.school'), to: ROUTES.schools },
          { label: t('crumbs.drivingSchools'), to: ROUTES.drivingSchools },
          { label: a.nom, to: ROUTES.drivingSchool(a.id) },
          { label: t('permisShort', { code: p.code }), to: ROUTES.license(a.id, p.code) },
          { label: t('crumbs.enrollment'), to: base },
          { label: crumb },
        ]}
        title={title}
        subtitle={subtitle}
        image="/images/maquette/ae-hero-formations.jpg"
      />
      <div className="grid gap-4 lg:grid-cols-[214px_1fr_382px]">
        <nav className="space-y-3">
          {menu.map((m) => (
            <LienActif
              key={m.key}
              to={ROUTES.editEnrollment(a.id, p.code, m.key)}
              className={({ isActive }) => cn('flex min-h-[64px] items-center gap-3 rounded-xl px-4 text-[15.5px] leading-tight font-semibold shadow-sm', isActive ? 'bg-brand-600 text-white' : 'bg-[#eaf0fb] text-navy-900 hover:bg-brand-100')}
            >
              <m.icon className="size-7 shrink-0" />
              <span>
                {m.label.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </span>
            </LienActif>
          ))}
        </nav>

        <div className="space-y-4">
          <div className={cn(card, 'p-5')}>
            {section === 'formation' && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3"><Heading icon={<GraduationCap />}>{t('edit.formation.heading')}</Heading></div>
                <label className="block">
                  <Label required>{t('edit.formation.drivingSchool')}</Label>
                  <IconSelect
                    icon={<Building2 />}
                    value={newAe}
                    options={autoEcoles.map((x) => ({ value: x.id, label: x.nom }))}
                    onChange={(v) => {
                      setNewAe(v)
                      const next = trouverAutoEcole(v)
                      if (!next.permis.includes(newPermis)) setNewPermis(next.permis[0])
                    }}
                  />
                </label>
                <label className="block">
                  <Label required>{t('edit.formation.licence')}</Label>
                  <IconSelect icon={<Car />} value={newPermis} options={trouverAutoEcole(newAe).permis.map((c) => ({ value: c, label: permisName(c) }))} onChange={(v) => setNewPermis(v as PermisCode)} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <Label required>{t('edit.formation.place')}</Label>
                    <IconSelect icon={<MapPin />} value="lieu" options={[{ value: 'lieu', label: `${trouverAutoEcole(newAe).ville} – ${trouverAutoEcole(newAe).quartier}` }]} />
                  </label>
                  <label className="block">
                    <Label required>{t('edit.formation.session')}</Label>
                    <IconSelect
                      icon={<CalendarDays />}
                      value={session}
                      options={[{ value: '15 novembre 2026', label: demoDate('15 novembre 2026') }, ...sessions.filter((s) => s.permis === newPermis).map((s) => ({ value: s.debut, label: demoDate(s.debut) })), { value: '01 décembre 2026', label: demoDate('01 décembre 2026') }].filter((o, i, arr) => arr.findIndex((x) => x.value === o.value) === i)}
                      onChange={setSession}
                    />
                  </label>
                  <div>
                    <Label>{t('edit.formation.duration')}</Label>
                    <p className="flex h-11 items-center gap-3 rounded-lg bg-[#eef3fc] px-4 text-[16px] text-navy-900"><Clock className="size-5 text-brand-600" />{t(`permis.${target.code}.duration`)}</p>
                  </div>
                  <div>
                    <Label>{t('edit.formation.price')}</Label>
                    <p className="flex h-11 items-center gap-3 rounded-lg bg-[#dfe8fb] px-4 text-[21px] font-extrabold text-brand-700"><Coins className="size-6 text-brand-600" />{fcfa(target.prix)}</p>
                  </div>
                </div>
                <p className="flex items-start gap-3 rounded-xl bg-[#eef3fc] px-4 py-3 text-[14.5px] text-navy-900">
                  <Info className="mt-0.5 size-6 shrink-0 text-brand-600" />
                  {t('edit.formation.notice')}
                </p>
              </div>
            )}

            {section === 'infos' && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3"><Heading icon={<UserRound />}>{t('edit.infos.heading')}</Heading></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><Label required>{t('form.lastName')}</Label><input className={field} placeholder={t('form.lastNamePlaceholder')} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></label>
                  <label><Label required>{t('form.firstName')}</Label><input className={field} placeholder={t('form.firstNamePlaceholder')} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></label>
                  <label>
                    <Label required>{t('form.birthDate')}</Label>
                    <span className="relative block">
                      <input className={field} placeholder={t('form.birthDatePlaceholder')} value={form.naissance} onChange={(e) => setForm({ ...form, naissance: e.target.value })} />
                      <Calendar className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" />
                    </span>
                  </label>
                  <label><Label required>{t('form.sex')}</Label><IconSelect icon={<UserRound />} value={form.sexe || 'Féminin'} options={sexes.map((x) => ({ value: x.value, label: t(`sex.${x.key}`) }))} onChange={(v) => setForm({ ...form, sexe: v })} /></label>
                  <label><Label required>{t('form.phone')}</Label><input className={field} placeholder="670 12 34 56" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></label>
                  <label><Label>{t('form.email')}</Label><input className={field} placeholder={t('form.emailPlaceholder')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                  <SelectionGeographique valeur={lieuDe(form)} onChange={(l) => setForm({ ...form, ...l, ville: villeDuLieu(l, arrondissements) })} className="sm:col-span-2" />
                </div>
              </div>
            )}

            {section === 'pieces' && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3"><Heading icon={<FileText />}>{t('edit.pieces.heading')}</Heading></div>
                {piecesAE.map((pc) => (
                  <div key={pc.key} className="flex flex-wrap items-center gap-4 border-b border-line pb-3">
                    <span className="grid h-11 w-14 place-items-center rounded-lg bg-[#eef3fc] text-brand-600 [&_svg]:size-7">{pieceIcon[pc.key]}</span>
                    <div className="min-w-[200px] flex-1">
                      <p className="text-[15px] font-bold text-navy-900">{t(`pieces.${pc.key}.label`)} <span className="text-rose-500">*</span></p>
                      <p className="text-[12.5px] text-navy-900">{t(`pieces.${pc.key}.hint`)}</p>
                    </div>
                    {d.pieces[pc.key] ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{t(`pieces.${pc.key}.state`)}</span>
                    ) : (
                      <span className="rounded-lg bg-rose-100 px-3 py-1 text-[13px] font-semibold text-rose-600">{t('inscription.pieces.required')}</span>
                    )}
                    <button type="button" aria-label={t('actions.view')} onClick={() => voir(pc.key)} className="grid size-9 place-items-center rounded-lg text-navy-800 hover:bg-slate-100"><Eye className="size-5" /></button>
                    <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border-2 border-[#9fb4e3] px-3 text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                      <RefreshCw className="size-4" />
                      {d.pieces[pc.key] ? t('actions.replace') : t(`pieces.${pc.key}.button`)}
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void ajouterPiece(pc.key, f, t('toast.fileReplaced')) }} />
                    </label>
                  </div>
                ))}
                {(p.code === 'C' || p.code === 'D' || p.code === 'E') && (
                  <div className="flex flex-wrap items-center gap-4 border-b border-line pb-3">
                    <span className="grid h-11 w-14 place-items-center rounded-lg bg-[#eef3fc] text-brand-600"><Car className="size-7" /></span>
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-navy-900">{t('edit.pieces.prior')}</p>
                      <p className="text-[12.5px] text-navy-900">{t('edit.pieces.priorHint')}</p>
                    </div>
                    {d.pieces.permisB ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{t('edit.pieces.provided')}</span>
                    ) : (
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-[13px] font-semibold text-slate-600">{t('edit.pieces.notProvided')}</span>
                    )}
                    <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-brand-600 px-3 text-[14px] font-semibold text-white"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void ajouterPiece('permisB', f, t('toast.licenceBAdded')) }} /><Plus className="size-4" />{t('actions.add')}</label>
                  </div>
                )}
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#9fb4e3] bg-[#f3f7fe] py-5 text-center">
                  <CloudUpload className="size-8 text-brand-600" />
                  <span className="text-[15px] font-bold text-navy-900">{t('edit.pieces.addOther')}</span>
                  <span className="text-[13px] text-navy-900">{t('edit.pieces.addOtherHint')}</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void ajouterPiece(`autre-${Object.keys(d.pieces).length + 1}`, f, t('toast.fileAdded', { name: f.name })) }} />
                </label>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => navigate({ href: base })} className="inline-flex h-12 w-40 items-center justify-center gap-2.5 rounded-xl border-2 border-[#c9d4ea] bg-white text-[17px] font-semibold text-navy-900 hover:bg-slate-50">
              <ArrowLeft className="size-5" />
              {t('actions.cancel')}
            </button>
            <button type="button" onClick={save} className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 px-10 text-[17px] font-semibold text-white hover:bg-brand-700">
              <Check className="size-6" strokeWidth={3} />
              {t('actions.save')}
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className={cn(card, 'p-4')}>
            <Heading icon={section === 'infos' ? <FileText /> : <RefreshCw />}>{section === 'formation' ? t('edit.aside.currentTraining') : section === 'infos' ? t('edit.aside.myEnrollment') : t('edit.aside.trainingReminder')}</Heading>
            <dl className="mt-2 divide-y divide-line text-[15px] text-navy-900">
              {[
                { icon: <Building2 />, k: t('edit.aside.drivingSchool'), v: a.nom },
                { icon: <Car />, k: t('edit.aside.licence'), v: permisName(p.code) },
                { icon: <CalendarDays />, k: t('edit.aside.session'), v: demoDate(d.session) },
                { icon: <Coins />, k: t('edit.aside.price'), v: <b className="text-[20px] text-brand-700">{fcfa(p.prix)}</b> },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-[26px_92px_1fr] items-center gap-2 py-2.5 [&>svg]:size-6 [&>svg]:text-brand-600">
                  {r.icon}
                  <dt className="font-bold">{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={cn(card, 'overflow-hidden')}>
            <div className="bg-[#eef3fc] px-4 py-3"><Heading icon={<BadgeCheck />}>{section === 'formation' ? t('edit.aside.benefits') : section === 'infos' ? t('edit.aside.note') : t('edit.aside.goodToKnow')}</Heading></div>
            <div className="px-4 pb-4">
              <Checks
                items={
                  section === 'formation'
                    ? [t('edit.aside.formation1'), t('edit.aside.formation2'), t('edit.aside.formation3')]
                    : section === 'infos'
                      ? [t('edit.aside.infos1'), t('edit.aside.infos2'), t('edit.aside.infos3')]
                      : [t('edit.aside.pieces1'), t('edit.aside.pieces2'), t('edit.aside.pieces3')]
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
