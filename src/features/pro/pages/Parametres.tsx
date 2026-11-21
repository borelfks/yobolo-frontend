import { useState } from 'react'
import { NavLink, useParams } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  SlidersHorizontal,
  Phone,
  Mail,
  Check,
  Bell,
  BookOpen,
  CalendarClock,
  Camera,
  CheckCircle2,
  ChevronRight,
  Download,
  FileCheck2,
  FileText,
  Headphones,
  Info,
  Laptop,
  Lightbulb,
  Lock,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Star,
  Sun,
  UserCog,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react'
import { LANGUES, langueActive } from '@/i18n'
import { Badge, StatusBadge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Card, Section } from '@/shared/components/ui/Card'
import { Avatar } from '@/shared/components/ui/Avatar'
import { ProHeader } from '@/features/pro/components/ProBlocks'
import { ChoiceCard, Field, Input, Radio, Select, Switch } from '@/shared/components/forms/Fields'
import { Tabs } from '@/shared/components/ui/Tabs'
import { FormFooter, IconBtn, IconTile, Kpi, KpiGrid, Tip } from '@/shared/components/ui/Blocks'
import { cn } from '@/shared/utils/cn'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { activiteSecurite, notificationsPro, roles, sessionsActives, utilisateurs } from '@/mocks/pro'

const sections = [
  { key: '', labelKey: 'account', icon: UserRound },
  { key: 'securite', labelKey: 'security', icon: ShieldCheck },
  { key: 'notifications', labelKey: 'notifications', icon: Bell },
  { key: 'preferences', labelKey: 'preferences', icon: Settings },
  { key: 'utilisateurs', labelKey: 'users', icon: Users },
  { key: 'a-propos', labelKey: 'about', icon: Info },
] as const

/** Rôles des données de démo → clé de traduction. */
const ROLE_KEYS: Record<string, 'admin' | 'academicLead' | 'communication' | 'secretariat' | 'readOnly' | undefined> = {
  Administrateur: 'admin',
  'Responsable pédagogique': 'academicLead',
  Communication: 'communication',
  Secrétariat: 'secretariat',
  Consultation: 'readOnly',
}

/** Nom du rôle dans la langue choisie (rôle inconnu : tel quel). */
function useRoleName() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  return (r: string) => {
    const key = ROLE_KEYS[r]
    return key ? t(`roles.${key}.name`) : r
  }
}

export function Parametres() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { section = '' } = useParams()
  const current = sections.find((x) => x.key === section) ?? sections[0]
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('settings.crumbs.profile'), to: ROUTES.pro.profile() }, { label: t('settings.crumbs.settings'), to: ROUTES.pro.settings() }, ...(section ? [{ label: t(`settings.sections.${current.labelKey}`) }] : [])]}
        icon={<Settings />}
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        actions={<span />}
      />
      <div className="grid gap-4 lg:grid-cols-[214px_1fr]">
        <nav className="h-fit space-y-2 rounded-2xl border border-line bg-white p-2 shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
          {sections.map((x) => (
            <NavLink
              key={x.key}
              to={ROUTES.pro.settings(x.key)}
              end
              className={({ isActive }) => cn('flex h-12 items-center gap-3 rounded-xl px-4 text-[16px] font-semibold', isActive ? 'bg-brand-600 text-white' : 'bg-[#f3f6fc] text-navy-900 hover:bg-brand-50')}
            >
              <x.icon className="size-6" />
              {t(`settings.sections.${x.labelKey}`)}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0">
          {section === '' && <Compte />}
          {section === 'securite' && <Securite />}
          {section === 'notifications' && <Notifications />}
          {section === 'preferences' && <Preferences />}
          {section === 'utilisateurs' && <Utilisateurs />}
          {section === 'a-propos' && <APropos />}
        </div>
      </div>
    </div>
  )
}

function SaveFooter() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  return (
    <FormFooter className="mt-6">
      <Button variant="neutral" onClick={() => toast(t('settings.cancelled'))}>{t('settings.cancel')}</Button>
      <Button onClick={() => toast.success(t('settings.saved'))}>{t('settings.save')}</Button>
    </FormFooter>
  )
}

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => setOn(!on)} className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-brand-600' : 'bg-slate-300')}>
      <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}

function Compte() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const roleName = useRoleName()
  const card = 'rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
  const input = 'h-10 w-full rounded-lg border border-[#c9d4ea] bg-white pl-11 pr-3 text-[15px] outline-none focus:border-brand-500'
  const title = (icon: React.ReactNode, text: string, sub?: string) => (
    <div className="flex items-start gap-3">
      <span className="text-brand-600 [&_svg]:size-8">{icon}</span>
      <div>
        <h2 className="text-[20px] font-bold text-navy-900">{text}</h2>
        {sub && <p className="text-[14px] text-navy-900">{sub}</p>}
      </div>
    </div>
  )
  return (
    <div className="space-y-4">
      <div className={cn(card, 'grid gap-4 md:grid-cols-[1fr_174px]')}>
        <div>
          {title(<UserRound />, t('settings.account.title'), t('settings.account.subtitle'))}
          <div className="mt-3 grid gap-x-5 gap-y-3 md:grid-cols-2">
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('settings.account.name')} <span className="text-rose-500">*</span></span><input className={cn(input, 'pl-3.5')} defaultValue="IPC Yaoundé – Administrateur" /></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('settings.account.phone')} <span className="text-rose-500">*</span></span><span className="relative block"><Phone className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><input className={input} defaultValue="+237 6 90 12 34 56" /></span></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('settings.account.email')} <span className="text-rose-500">*</span></span><span className="relative block"><Mail className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><input className={input} defaultValue="contact@ipc.cm" /></span></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('settings.account.role')}</span><span className="relative block"><Users className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><select className={cn(input, 'appearance-none')} defaultValue="Administrateur">{roles.map((r) => <option key={r.nom} value={r.nom}>{roleName(r.nom)}</option>)}</select></span></label>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#eef3fc] p-4">
          <span className="relative">
            <Avatar src="/images/maquette/avatar-ipc.jpg" name="IPC Yaoundé" size={92} />
            <span className="absolute right-0 bottom-0 grid size-8 place-items-center rounded-full border-2 border-white bg-brand-600 text-white"><Camera className="size-4" /></span>
          </span>
          <button type="button" onClick={() => toast(t('settings.account.changePhotoToast'))} className="h-9 rounded-full border-2 border-brand-600/60 bg-white px-4 text-[14px] font-semibold text-navy-800">{t('settings.account.changePhoto')}</button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <div className={card}>
            {title(<ShieldCheck />, t('settings.account.securityTitle'))}
            <div className="mt-2 divide-y divide-line">
              <NavLink to={ROUTES.pro.settings('securite')} className="flex items-center gap-3 py-2.5">
                <Lock className="size-6 text-navy-800" />
                <span className="flex-1"><b className="block text-[15px] text-navy-900">{t('settings.account.changePassword')}</b><span className="text-[13px] text-navy-900">{t('settings.account.changePasswordHint')}</span></span>
                <ChevronRight className="size-5" />
              </NavLink>
              <div className="flex items-center gap-3 py-2.5">
                <ShieldCheck className="size-6 text-navy-800" />
                <span className="flex-1"><b className="block text-[15px] text-navy-900">{t('settings.account.twoFactor')}</b><span className="text-[13px] text-navy-900">{t('settings.account.twoFactorHint')}</span></span>
                <Toggle />
              </div>
            </div>
          </div>
          <div className={card}>
            {title(<SlidersHorizontal />, t('settings.account.publishingTitle'))}
            <div className="mt-2 flex items-center gap-3 border-t border-line pt-3">
              <span className="flex-1"><b className="block text-[15px] text-navy-900">{t('settings.account.autoPublish')}</b><span className="text-[13px] text-navy-900">{t('settings.account.autoPublishHint')}</span></span>
              <Toggle />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className={card}>
            {title(<Bell />, t('settings.account.notificationsTitle'), t('settings.account.notificationsSubtitle'))}
            <div className="mt-2 divide-y divide-line">
              {(['applications', 'reviews', 'reminders'] as const).map((k) => (
                <div key={k} className="flex items-center justify-between gap-3 py-2.5 text-[15px] text-navy-900">{t(`settings.account.alerts.${k}`)}<Toggle /></div>
              ))}
            </div>
          </div>
          <div className="mt-auto flex justify-end gap-3">
            <button type="button" onClick={() => toast(t('settings.cancelled'))} className="h-11 w-36 rounded-full border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800">{t('settings.cancel')}</button>
            <button type="button" onClick={() => toast.success(t('settings.saved'))} className="inline-flex h-11 items-center gap-2.5 rounded-full bg-brand-600 px-6 text-[16px] font-semibold text-white"><Check className="size-5" strokeWidth={3} />{t('settings.save')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Securite() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const [pwd, setPwd] = useState('')
  const rules = [
    { label: t('settings.security.rules.length'), ok: pwd.length >= 8 },
    { label: t('settings.security.rules.uppercase'), ok: /[A-Z]/.test(pwd) },
    { label: t('settings.security.rules.digit'), ok: /\d/.test(pwd) },
    { label: t('settings.security.rules.special'), ok: /[^A-Za-z0-9]/.test(pwd) },
  ]
  const score = rules.filter((r) => r.ok).length
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <Section title={t('settings.security.changePassword')} icon={<Lock />}>
          <div className="space-y-4">
            <Field label={t('settings.security.currentPassword')} required><Input type="password" defaultValue="demo2026" /></Field>
            <Field label={t('settings.security.newPassword')} required><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} /></Field>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < score ? (score < 3 ? 'bg-orange-400' : 'bg-emerald-500') : 'bg-slate-200')} />)}
            </div>
            <ul className="grid grid-cols-2 gap-1.5 text-xs">
              {rules.map((r) => (
                <li key={r.label} className={cn('flex items-center gap-1.5', r.ok ? 'text-emerald-600' : 'text-muted')}>
                  <CheckCircle2 className="size-3.5" />{r.label}
                </li>
              ))}
            </ul>
            <Field label={t('settings.security.confirmPassword')} required><Input type="password" /></Field>
            <Button onClick={() => (score < 4 ? toast.error(t('settings.security.invalidPassword')) : toast.success(t('settings.security.passwordUpdated')))}>{t('settings.security.update')}</Button>
          </div>
        </Section>
        <div className="space-y-5">
          <Section title={t('settings.security.twoFactorTitle')} icon={<Smartphone />}>
            <Switch label={t('settings.security.phoneCode')} description="+237 6 77 •• •• 56" defaultChecked />
            <Badge tone="green" className="mt-3">{t('settings.security.enabled')}</Badge>
          </Section>
          <Section title={t('settings.security.sessionsTitle')} icon={<Laptop />}>
            <div className="space-y-2.5">
              {sessionsActives.map((s, i) => (
                <div key={s.appareil} className="flex items-center gap-3 rounded-xl border border-line p-3 text-sm">
                  <IconTile icon={s.actuelle ? <Laptop /> : <Smartphone />} tone="blue" size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold">{t(`settings.security.sessions.${i as 0 | 1}.device`, { defaultValue: s.appareil })} – {s.lieu}</p>
                    <p className="text-xs text-muted">{t(`settings.security.sessions.${i as 0 | 1}.date`, { defaultValue: s.date })}</p>
                  </div>
                  {s.actuelle ? <Badge tone="green">{t('settings.security.currentSession')}</Badge> : <IconBtn label={t('settings.security.signOut')} onClick={() => toast.success(t('settings.security.sessionClosed'))}><MoreHorizontal /></IconBtn>}
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
      <Section title={t('settings.security.activityTitle')} icon={<ShieldCheck />}>
        <div className="divide-y divide-line">
          {activiteSecurite.map((a, i) => (
            <div key={a.date} className="flex items-center gap-3 py-3 text-sm">
              {a.ok ? <CheckCircle2 className="size-5 text-emerald-500" /> : <XCircle className="size-5 text-rose-500" />}
              <span className="flex-1 font-semibold">{t(`settings.security.activity.${i as 0 | 1 | 2}.event`, { defaultValue: a.evenement })}</span>
              <span className="text-muted">{a.lieu}</span>
              <span className="w-40 text-right text-muted">{t(`settings.security.activity.${i as 0 | 1 | 2}.date`, { defaultValue: a.date })}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

const notifIcon: Record<string, { icon: React.ReactNode; tone: 'green' | 'violet' | 'amber' | 'blue' | 'sky' }> = {
  candidature: { icon: <UserRound />, tone: 'green' },
  document: { icon: <Download />, tone: 'violet' },
  avis: { icon: <Star />, tone: 'amber' },
  rappel: { icon: <CalendarClock />, tone: 'sky' },
  validation: { icon: <FileCheck2 />, tone: 'blue' },
}

/** Types de notifications des données de démo (clés de traduction). */
const NOTIF_TYPES = ['candidature', 'document', 'avis', 'rappel', 'validation'] as const
type NotifType = (typeof NOTIF_TYPES)[number]
const isNotifType = (type: string): type is NotifType => (NOTIF_TYPES as readonly string[]).includes(type)

function Notifications() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const [tab, setTab] = useState('toutes')
  const [items, setItems] = useState(notificationsPro)
  const list = items.filter((n) => tab === 'toutes' || (tab === 'non-lues' ? !n.lu : n.lu))
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <Section
        title={t('settings.notifications.title')}
        icon={<Bell />}
        action={<Button variant="ghost" size="sm" onClick={() => { setItems(items.map((n) => ({ ...n, lu: true }))); toast.success(t('settings.notifications.allMarkedRead')) }}>{t('settings.notifications.markAllRead')}</Button>}
      >
        <Tabs
          variant="underline"
          value={tab}
          onChange={setTab}
          items={[
            { value: 'toutes', label: t('settings.notifications.tabs.all'), count: items.length },
            { value: 'non-lues', label: t('settings.notifications.tabs.unread'), count: items.filter((n) => !n.lu).length },
            { value: 'lues', label: t('settings.notifications.tabs.read') },
          ]}
        />
        <div className="mt-3 divide-y divide-line">
          {list.map((n) => {
            const s = notifIcon[n.type]
            const type = isNotifType(n.type) ? n.type : null
            return (
              <button key={n.titre} type="button" onClick={() => setItems(items.map((x) => (x === n ? { ...x, lu: true } : x)))} className="flex w-full items-start gap-3 py-3 text-left">
                <IconTile icon={s.icon} tone={s.tone} size="sm" />
                <div className="flex-1 text-sm">
                  <p className="font-bold text-navy-900">{type ? t(`settings.notifications.items.${type}.title`) : n.titre}</p>
                  <p className="text-muted">{type ? t(`settings.notifications.items.${type}.text`) : n.texte}</p>
                </div>
                <span className="text-xs whitespace-nowrap text-muted">{type ? t(`settings.notifications.items.${type}.date`) : n.date}</span>
                {!n.lu && <span className="mt-1.5 size-2.5 rounded-full bg-brand-600" aria-label={t('settings.notifications.unread')} />}
              </button>
            )
          })}
        </div>
      </Section>
      <div className="space-y-5">
        <Section title={t('settings.notifications.settingsTitle')}>
          <div className="space-y-3">
            <Switch label={t('settings.notifications.switches.applications')} defaultChecked />
            <Switch label={t('settings.notifications.switches.downloads')} defaultChecked />
            <Switch label={t('settings.notifications.switches.reviews')} defaultChecked />
            <Switch label={t('settings.notifications.switches.reminders')} defaultChecked />
            <Switch label={t('settings.notifications.switches.news')} />
          </div>
        </Section>
        <Tip title={t('settings.tipTitle')} icon={<Lightbulb />} tone="amber">{t('settings.notifications.tipText')}</Tip>
      </div>
    </div>
  )
}

function Preferences() {
  const { t, i18n } = useTranslation('pro', { keyPrefix: 'content' })
  const { t: tc } = useTranslation('common')
  const [theme, setTheme] = useState('clair')
  return (
    <div className="space-y-5">
      <Section title={t('settings.preferences.publishingTitle')}>
        <div className="space-y-3">
          <Radio name="pub" label={t('settings.preferences.autoPublish')} description={t('settings.preferences.autoPublishHint')} defaultChecked />
          <Radio name="pub" label={t('settings.preferences.manualPublish')} description={t('settings.preferences.manualPublishHint')} />
        </div>
      </Section>
      <Section title={t('settings.preferences.visibilityTitle')}>
        <div className="space-y-3">
          <Switch label={t('settings.preferences.showContacts')} defaultChecked />
          <Switch label={t('settings.preferences.showAddress')} defaultChecked />
          <Switch label={t('settings.preferences.showReviews')} defaultChecked />
          <Switch label={t('settings.preferences.hideFees')} />
        </div>
      </Section>
      <div className="grid gap-5 md:grid-cols-2">
        <Section title={t('settings.preferences.languageTitle')}>
          <Select
            aria-label={t('settings.preferences.languageTitle')}
            options={LANGUES.map((l) => ({ value: l.code, label: tc(l.libelleCle) }))}
            value={langueActive(i18n.language)}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
          />
        </Section>
        <Section title={t('settings.preferences.themeTitle')}>
          <div className="grid grid-cols-3 gap-2">
            {([
              { v: 'clair', icon: <Sun className="size-5 text-amber-500" /> },
              { v: 'sombre', icon: <Moon className="size-5 text-navy-800" /> },
              { v: 'systeme', icon: <Laptop className="size-5 text-brand-600" /> },
            ] as const).map((th) => (
              <ChoiceCard key={th.v} selected={theme === th.v} onClick={() => { setTheme(th.v); if (th.v !== 'clair') toast(t('settings.preferences.darkSoon')) }} icon={th.icon} title={t(`settings.preferences.themes.${th.v}`)} className="items-center p-3" />
            ))}
          </div>
        </Section>
      </div>
      <SaveFooter />
    </div>
  )
}

function Utilisateurs() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const roleName = useRoleName()
  const [q, setQ] = useState('')
  const list = utilisateurs.filter((u) => u.nom.toLowerCase().includes(q.toLowerCase()))
  const roleTone: Record<string, 'blue' | 'violet' | 'orange' | 'green' | 'gray'> = { Administrateur: 'blue', 'Responsable pédagogique': 'violet', Communication: 'orange', Secrétariat: 'green', Consultation: 'gray' }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <KpiGrid cols={3}>
          <Kpi icon={<Users />} label={t('settings.users.kpis.users')} value={utilisateurs.length} tone="blue" />
          <Kpi icon={<CheckCircle2 />} label={t('settings.users.kpis.active')} value={utilisateurs.filter((u) => u.statut === 'Actif').length} tone="green" />
          <Kpi icon={<UserCog />} label={t('settings.users.kpis.inactive')} value={utilisateurs.filter((u) => u.statut !== 'Actif').length} tone="orange" />
        </KpiGrid>
        <Button to={ROUTES.pro.inviteUser} size="lg"><Plus /> {t('settings.users.invite')}</Button>
      </div>
      <Card className="overflow-x-auto p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <Input icon={<Search />} placeholder={t('settings.users.searchPlaceholder')} value={q} onChange={(e) => setQ(e.target.value)} />
          <Select aria-label={t('settings.users.roleAria')} options={[t('settings.users.allRoles'), ...roles.map((r) => roleName(r.nom))]} />
          <Select aria-label={t('settings.users.statusAria')} options={[t('settings.users.allStatuses'), t('settings.users.statuses.active'), t('settings.users.statuses.inactive')]} />
        </div>
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted uppercase">
              <th className="py-3">{t('settings.users.table.user')}</th>
              <th>{t('settings.users.table.role')}</th>
              <th>{t('settings.users.table.contact')}</th>
              <th>{t('settings.users.table.status')}</th>
              <th>{t('settings.users.table.lastLogin')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.email} className="border-b border-line last:border-0">
                <td className="py-3">
                  <span className="flex items-center gap-3">
                    <Avatar src={u.avatar} name={u.nom} size={36} />
                    <b className="text-navy-900">{u.nom}</b>
                    {u.vous && <Badge tone="blue">{t('settings.users.you')}</Badge>}
                  </span>
                </td>
                <td><Badge tone={roleTone[u.role]}>{roleName(u.role)}</Badge></td>
                <td className="text-xs"><p>{u.telephone}</p><p className="text-muted">{u.email}</p></td>
                <td><StatusBadge status={u.statut} /></td>
                <td className="text-muted">{t(`settings.users.lastLogins.${utilisateurs.indexOf(u) as 0 | 1 | 2 | 3 | 4}`, { defaultValue: u.connexion })}</td>
                <td className="text-right"><IconBtn label={t('settings.users.actions')} onClick={() => toast(t('settings.users.actionsToast'))}><MoreHorizontal /></IconBtn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

const VALUES = ['professionalism', 'reliability', 'inclusion', 'innovation'] as const
const USEFUL_DOCUMENTS = ['terms', 'sales', 'privacy'] as const

function APropos() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  return (
    <div className="space-y-5">
      <Card className="bg-navy-gradient p-6 text-white">
        <p className="text-xl font-bold">{t('settings.about.tagline')}</p>
        <p className="mt-2 text-white/80">{t('settings.about.pillars')}</p>
      </Card>
      <div className="grid gap-5 md:grid-cols-2">
        <Section title={t('settings.about.missionTitle')} icon={<BookOpen />}>
          <p className="text-sm text-ink/80">{t('settings.about.missionText')}</p>
        </Section>
        <Section title={t('settings.about.valuesTitle')} icon={<Star />}>
          <div className="flex flex-wrap gap-2">{VALUES.map((v) => <Badge key={v} tone="blue">{t(`settings.about.values.${v}`)}</Badge>)}</div>
        </Section>
        <Section title={t('settings.about.supportTitle')} icon={<Headphones />}>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => toast(t('settings.about.contactSupportToast'))}><Headphones /> {t('settings.about.contactSupport')}</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast(t('settings.about.helpCenterToast'))}><Info /> {t('settings.about.helpCenter')}</Button>
          </div>
        </Section>
        <Section title={t('settings.about.documentsTitle')} icon={<FileText />}>
          <ul className="space-y-2 text-sm">
            {USEFUL_DOCUMENTS.map((d) => (
              <li key={d}><button type="button" onClick={() => toast(t('settings.about.demoToast', { name: t(`settings.about.documents.${d}`) }))} className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-brand-50">{t(`settings.about.documents.${d}`)}<ChevronRight className="size-4" /></button></li>
            ))}
          </ul>
        </Section>
      </div>
      <Card className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm">
        <span><Trans t={t} i18nKey="settings.about.version" values={{ version: '2.4.0' }} components={{ b: <b /> }} /> <Badge tone="green">{t('settings.about.upToDate')}</Badge></span>
        <span className="text-muted">{t('settings.about.lastUpdate', { date: shortDate(new Date(2026, 10, 5), { day: '2-digit', month: 'short', year: 'numeric' }) })}</span>
      </Card>
    </div>
  )
}
