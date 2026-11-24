import { useState } from 'react'
import { NavLink, useParams, Link } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Bell,
  BookOpen,
  CalendarClock,
  Camera,
  Check,
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
  LogOut,
  Mail,
  Moon,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Star,
  Sun,
  Trash2,
  UserCheck,
  UserCog,
  UserRound,
  UserX,
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
import { useActiviteSecurite, useNotifications, useParametres, useRoles, useSessionsActives, useUtilisateurs } from '@/data/hooks'
import { useMonEcole, useSession } from '@/features/auth/hooks/useSession'
import { POUR_TOUS, data } from '@/data'
import { MenuActions } from '@/shared/components/ui/MenuActions'
import { AssistanceModal } from '@/shared/components/ui/AssistanceModal'
import { protegerMotDePasse, verifierMotDePasse } from '@/shared/utils/motDePasse'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import { oui, prefixer, sousCles, texte, type Valeurs, dateDuJour } from '@/features/pro/proData'

/**
 * Réglages d'une rubrique (`compte`, `preferences`, `notifications`) : valeurs
 * saisies, relues depuis la base, et enregistrement.
 */
function useReglages(rubrique: string) {
  const { ecole } = useMonEcole()
  const reglages = useParametres(ecole.id)
  const enregistres = sousCles(rubrique, reglages)
  const [saisie, setSaisie] = useState<Valeurs>({})
  const valeurs = { ...enregistres, ...saisie }
  return {
    texte: (cle: string, defaut: string) => texte(valeurs, cle, defaut),
    oui: (cle: string, defaut: boolean) => oui(valeurs, cle, defaut),
    changer: (cle: string, v: string | boolean) => setSaisie((s) => ({ ...s, [cle]: v })),
    annuler: () => setSaisie({}),
    /** Enregistre les valeurs saisies (et, si donné, un changement immédiat). */
    enregistrer: async (immediat: Valeurs = {}) => {
      await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, ...prefixer(rubrique, { ...valeurs, ...immediat }) } })
      setSaisie({})
    },
  }
}

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

function SaveFooter({ onCancel, onSave }: { onCancel: () => void; onSave: () => Promise<void> }) {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  return (
    <FormFooter className="mt-6">
      <Button variant="neutral" onClick={() => { onCancel(); toast(t('settings.cancelled')) }}>{t('settings.cancel')}</Button>
      <Button onClick={async () => { await onSave(); toast.success(t('settings.saved')) }}>{t('settings.save')}</Button>
    </FormFooter>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-brand-600' : 'bg-slate-300')}>
      <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}

function Compte() {
  const { account } = useSession()
  const { ecole } = useMonEcole()
  const roles = useRoles()
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const roleName = useRoleName()
  const r = useReglages('compte')
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
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('settings.account.name')} <span className="text-rose-500">*</span></span><input className={cn(input, 'pl-3.5')} value={r.texte('nom', account?.name ?? ecole.nom)} onChange={(e) => r.changer('nom', e.target.value)} /></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('settings.account.phone')} <span className="text-rose-500">*</span></span><span className="relative block"><Phone className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><input className={input} value={r.texte('telephone', account?.telephone ?? ecole.telephone)} onChange={(e) => r.changer('telephone', e.target.value)} /></span></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('settings.account.email')} <span className="text-rose-500">*</span></span><span className="relative block"><Mail className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><input className={input} value={r.texte('email', account?.identifiant ?? ecole.email)} onChange={(e) => r.changer('email', e.target.value)} /></span></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('settings.account.role')}</span><span className="relative block"><Users className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><select className={cn(input, 'appearance-none')} value={r.texte('role', account?.subtitle ?? '')} onChange={(e) => r.changer('role', e.target.value)}>{roles.map((r) => <option key={r.nom} value={r.nom}>{roleName(r.nom)}</option>)}</select></span></label>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#eef3fc] p-4">
          <span className="relative">
            <Avatar src={account?.avatar} name={account?.name ?? ecole.nom} size={92} />
            <span className="absolute right-0 bottom-0 grid size-8 place-items-center rounded-full border-2 border-white bg-brand-600 text-white"><Camera className="size-4" /></span>
          </span>
          <label className="inline-flex h-9 cursor-pointer items-center rounded-full border-2 border-brand-600/60 bg-white px-4 text-[14px] font-semibold text-navy-800">
            {t('settings.account.changePhoto')}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const fichier = e.target.files?.[0]
                e.target.value = ''
                if (!fichier || !account) return
                if (fichier.size > TAILLE_MAX_PHOTO) return void toast.error(t('settings.account.photoTooBig'))
                await data.update('comptes', account.id, { avatar: await lireImage(fichier) })
                toast.success(t('settings.account.photoUpdated'))
              }}
            />
          </label>
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
                <Toggle on={r.oui('doubleAuthentification', true)} onChange={(v) => r.changer('doubleAuthentification', v)} />
              </div>
            </div>
          </div>
          <div className={card}>
            {title(<SlidersHorizontal />, t('settings.account.publishingTitle'))}
            <div className="mt-2 flex items-center gap-3 border-t border-line pt-3">
              <span className="flex-1"><b className="block text-[15px] text-navy-900">{t('settings.account.autoPublish')}</b><span className="text-[13px] text-navy-900">{t('settings.account.autoPublishHint')}</span></span>
              <Toggle on={r.oui('publicationAutomatique', true)} onChange={(v) => r.changer('publicationAutomatique', v)} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className={card}>
            {title(<Bell />, t('settings.account.notificationsTitle'), t('settings.account.notificationsSubtitle'))}
            <div className="mt-2 divide-y divide-line">
              {(['applications', 'reviews', 'reminders'] as const).map((k) => (
                <div key={k} className="flex items-center justify-between gap-3 py-2.5 text-[15px] text-navy-900">{t(`settings.account.alerts.${k}`)}<Toggle on={r.oui(`alertes.${k}`, true)} onChange={(v) => r.changer(`alertes.${k}`, v)} /></div>
              ))}
            </div>
          </div>
          <div className="mt-auto flex justify-end gap-3">
            <button type="button" onClick={() => { r.annuler(); toast(t('settings.cancelled')) }} className="h-11 w-36 rounded-full border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800">{t('settings.cancel')}</button>
            <button
              type="button"
              onClick={async () => {
                // Le nom, le téléphone et l'e-mail sont ceux du compte (table comptes) ; le reste, des réglages.
                if (account) await data.update('comptes', account.id, { name: r.texte('nom', account.name).trim() || account.name, telephone: r.texte('telephone', account.telephone), identifiant: r.texte('email', account.identifiant).trim() || account.identifiant })
                await r.enregistrer()
                toast.success(t('settings.saved'))
              }}
              className="inline-flex h-11 items-center gap-2.5 rounded-full bg-brand-600 px-6 text-[16px] font-semibold text-white"
            >
              <Check className="size-5" strokeWidth={3} />
              {t('settings.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** « +237 6 77 12 34 56 » → « +237 6 77 •• •• 56 ». */
const masquer = (tel: string) => tel.replace(/(\d{2}) (\d{2})( \d{2})$/, '•• ••$3')

function Securite() {
  const sessionsActives = useSessionsActives()
  const activiteSecurite = useActiviteSecurite()
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { account } = useSession()
  const r = useReglages('securite')
  const [actuel, setActuel] = useState('')
  const [pwd, setPwd] = useState('')
  const [confirmation, setConfirmation] = useState('')
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
            <Field label={t('settings.security.currentPassword')} required><Input type="password" autoComplete="current-password" value={actuel} onChange={(e) => setActuel(e.target.value)} /></Field>
            <Field label={t('settings.security.newPassword')} required><Input type="password" autoComplete="new-password" value={pwd} onChange={(e) => setPwd(e.target.value)} /></Field>
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
            <Field label={t('settings.security.confirmPassword')} required><Input type="password" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></Field>
            <Button
              onClick={async () => {
                if (!account) return
                if (!(await verifierMotDePasse(account.motDePasse, actuel))) return void toast.error(t('settings.security.wrongCurrent'))
                if (score < 4) return void toast.error(t('settings.security.invalidPassword'))
                if (pwd !== confirmation) return void toast.error(t('settings.security.mismatch'))
                await data.update('comptes', account.id, { motDePasse: await protegerMotDePasse(pwd) })
                await data.create('activiteSecurite', { evenement: 'Mot de passe modifié', lieu: '—', date: dateDuJour(), ok: true }, 'activite')
                setActuel('')
                setPwd('')
                setConfirmation('')
                toast.success(t('settings.security.passwordUpdated'))
              }}
            >
              {t('settings.security.update')}
            </Button>
          </div>
        </Section>
        <div className="space-y-5">
          <Section title={t('settings.security.twoFactorTitle')} icon={<Smartphone />}>
            <Switch
              label={t('settings.security.phoneCode')}
              description={masquer(account?.telephone ?? '')}
              checked={r.oui('deuxFacteurs', true)}
              onChange={async (actif) => {
                await r.enregistrer({ deuxFacteurs: actif })
                toast.success(t(actif ? 'settings.security.twoFactorOn' : 'settings.security.twoFactorOff'))
              }}
            />
            <Badge tone={r.oui('deuxFacteurs', true) ? 'green' : 'gray'} className="mt-3">{t(r.oui('deuxFacteurs', true) ? 'settings.security.enabled' : 'settings.security.disabled')}</Badge>
          </Section>
          <Section title={t('settings.security.sessionsTitle')} icon={<Laptop />}>
            <div className="space-y-2.5">
              {sessionsActives.map((s) => {
                // Sessions de départ (session-active-1 et 2) : traduites ; une autre s'affiche telle quelle.
                const n = /^session-active-([12])$/.exec(s.id)?.[1]
                const i = n ? (Number(n) - 1) as 0 | 1 : null
                return (
                <div key={s.id} className="flex items-center gap-3 rounded-xl border border-line p-3 text-sm">
                  <IconTile icon={s.actuelle ? <Laptop /> : <Smartphone />} tone="blue" size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold">{i !== null ? t(`settings.security.sessions.${i}.device`) : s.appareil} – {s.lieu}</p>
                    <p className="text-xs text-muted">{i !== null ? t(`settings.security.sessions.${i}.date`) : s.date}</p>
                  </div>
                  {s.actuelle ? <Badge tone="green">{t('settings.security.currentSession')}</Badge> : <IconBtn label={t('settings.security.signOut')} onClick={async () => { await data.remove('sessionsActives', s.id); toast.success(t('settings.security.sessionClosed')) }}><LogOut /></IconBtn>}
                </div>
                )
              })}
            </div>
          </Section>
        </div>
      </div>
      <Section title={t('settings.security.activityTitle')} icon={<ShieldCheck />}>
        <div className="divide-y divide-line">
          {activiteSecurite.map((a) => {
            // Les lignes de départ (activite-1 à 3) ont leur traduction ; une ligne ajoutée s'affiche telle quelle.
            const n = /^activite-([1-3])$/.exec(a.id)?.[1]
            const cle = n ? (String(Number(n) - 1) as '0' | '1' | '2') : null
            return (
              <div key={a.id} className="flex items-center gap-3 py-3 text-sm">
                {a.ok ? <CheckCircle2 className="size-5 text-emerald-500" /> : <XCircle className="size-5 text-rose-500" />}
                <span className="flex-1 font-semibold">{cle ? t(`settings.security.activity.${cle}.event`) : a.evenement}</span>
                <span className="text-muted">{a.lieu}</span>
                <span className="w-40 text-right text-muted">{cle ? t(`settings.security.activity.${cle}.date`) : a.date}</span>
              </div>
            )
          })}
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
  const notificationsPro = useNotifications()
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const [tab, setTab] = useState('toutes')
  // Notifications de la maquette (référence) ; « lue » et les interrupteurs sont enregistrés tout de suite.
  const r = useReglages('notifications')
  const { ecole } = useMonEcole()
  const items = notificationsPro.filter((n) => !n.etablissementId || n.etablissementId === ecole.id)
  const marquer = (ns: typeof items) => Promise.all(ns.map((n) => data.update('notifications', n.id, { lu: true })))
  const alerte = (cle: string, defaut: boolean) => ({ checked: r.oui(`alertes.${cle}`, defaut), onChange: (v: boolean) => void r.enregistrer({ [`alertes.${cle}`]: v }) })
  const list = items.filter((n) => tab === 'toutes' || (tab === 'non-lues' ? !n.lu : n.lu))
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <Section
        title={t('settings.notifications.title')}
        icon={<Bell />}
        action={<Button variant="ghost" size="sm" onClick={async () => { await marquer(items); toast.success(t('settings.notifications.allMarkedRead')) }}>{t('settings.notifications.markAllRead')}</Button>}
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
            // Les notifications de départ (notification-1 à 5) ont leur traduction ; une nouvelle s'affiche telle quelle.
            const type = /^notification-[1-5]$/.test(n.id) && isNotifType(n.type) ? n.type : null
            return (
              <button key={n.id} type="button" onClick={() => void marquer([n])} className="flex w-full items-start gap-3 py-3 text-left">
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
            <Switch label={t('settings.notifications.switches.applications')} {...alerte('applications', true)} />
            <Switch label={t('settings.notifications.switches.downloads')} {...alerte('downloads', true)} />
            <Switch label={t('settings.notifications.switches.reviews')} {...alerte('reviews', true)} />
            <Switch label={t('settings.notifications.switches.reminders')} {...alerte('reminders', true)} />
            <Switch label={t('settings.notifications.switches.news')} {...alerte('news', false)} />
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
  const r = useReglages('preferences')
  const theme = r.texte('theme', 'clair')
  const setTheme = (v: string) => r.changer('theme', v)
  const publication = r.texte('publication', 'automatique')
  const visibilite = (cle: string, defaut: boolean) => ({ checked: r.oui(`visibilite.${cle}`, defaut), onChange: (v: boolean) => r.changer(`visibilite.${cle}`, v) })
  return (
    <div className="space-y-5">
      <Section title={t('settings.preferences.publishingTitle')}>
        <div className="space-y-3">
          <Radio name="pub" label={t('settings.preferences.autoPublish')} description={t('settings.preferences.autoPublishHint')} checked={publication === 'automatique'} onChange={() => r.changer('publication', 'automatique')} />
          <Radio name="pub" label={t('settings.preferences.manualPublish')} description={t('settings.preferences.manualPublishHint')} checked={publication === 'manuelle'} onChange={() => r.changer('publication', 'manuelle')} />
        </div>
      </Section>
      <Section title={t('settings.preferences.visibilityTitle')}>
        <div className="space-y-3">
          <Switch label={t('settings.preferences.showContacts')} {...visibilite('contacts', true)} />
          <Switch label={t('settings.preferences.showAddress')} {...visibilite('adresse', true)} />
          <Switch label={t('settings.preferences.showReviews')} {...visibilite('avis', true)} />
          <Switch label={t('settings.preferences.hideFees')} {...visibilite('masquerFrais', false)} />
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
      <SaveFooter onCancel={r.annuler} onSave={() => r.enregistrer()} />
    </div>
  )
}

function Utilisateurs() {
  const roles = useRoles()
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const roleName = useRoleName()
  const [q, setQ] = useState('')
  const { ecole } = useMonEcole()
  const utilisateurs = useUtilisateurs(ecole.id)
  // Dernière connexion traduite pour les 5 personnes de la maquette (« utilisateur-1 » à « utilisateur-5 »).
  const indexMaquette = (u: (typeof utilisateurs)[number]) => (u.etablissementId === POUR_TOUS ? Number(/^utilisateur-([1-5])$/.exec(u.id)?.[1] ?? 0) - 1 : -1)
  const [filtreRole, setFiltreRole] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('')
  const list = utilisateurs.filter(
    (u) =>
      u.nom.toLowerCase().includes(q.toLowerCase()) &&
      (!filtreRole || u.role === filtreRole) &&
      (!filtreStatut || (filtreStatut === 'Actif' ? u.statut === 'Actif' : u.statut !== 'Actif')),
  )
  const modifier = async (u: (typeof utilisateurs)[number], patch: Partial<(typeof utilisateurs)[number]>, message: string) => {
    await data.update('utilisateurs', u.id, patch)
    toast.success(message)
  }
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
          <Select aria-label={t('settings.users.roleAria')} value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)} options={[{ value: '', label: t('settings.users.allRoles') }, ...roles.map((r) => ({ value: r.nom, label: roleName(r.nom) }))]} />
          <Select aria-label={t('settings.users.statusAria')} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} options={[{ value: '', label: t('settings.users.allStatuses') }, { value: 'Actif', label: t('settings.users.statuses.active') }, { value: 'Inactif', label: t('settings.users.statuses.inactive') }]} />
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
              <tr key={u.id} className="border-b border-line last:border-0">
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
                <td className="text-muted">{indexMaquette(u) >= 0 ? t(`settings.users.lastLogins.${indexMaquette(u) as 0 | 1 | 2 | 3 | 4}`, { defaultValue: u.connexion }) : u.connexion}</td>
                <td className="text-right">
                  <MenuActions
                    label={t('settings.users.actions')}
                    className="ml-auto"
                    actions={[
                      ...roles
                        .filter((r) => r.nom !== u.role)
                        .map((r) => ({ label: t('settings.users.menu.setRole', { role: roleName(r.nom) }), icon: <UserCog />, onClick: () => modifier(u, { role: r.nom }, t('settings.users.menu.roleChanged', { name: u.nom, role: roleName(r.nom) })) })),
                      u.statut === 'Actif'
                        ? { label: t('settings.users.menu.deactivate'), icon: <UserX />, hidden: u.vous, onClick: () => modifier(u, { statut: 'Inactif' }, t('settings.users.menu.deactivated', { name: u.nom })) }
                        : { label: t('settings.users.menu.activate'), icon: <UserCheck />, onClick: () => modifier(u, { statut: 'Actif' }, t('settings.users.menu.activated', { name: u.nom })) },
                      { label: t('settings.users.menu.resend'), icon: <Send />, hidden: u.statut !== 'En attente', onClick: () => modifier(u, { connexion: t('settings.users.menu.invitedOn', { date: dateDuJour() }) }, t('settings.users.menu.resent', { email: u.email })) },
                      { label: t('settings.users.menu.remove'), icon: <Trash2 />, danger: true, hidden: u.vous, onClick: async () => { await data.remove('utilisateurs', u.id); toast.success(t('settings.users.menu.removed', { name: u.nom })) } },
                    ]}
                  />
                </td>
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
  const { account } = useSession()
  const [assistance, setAssistance] = useState(false)
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
            <Button variant="outline" className="w-full justify-start" onClick={() => setAssistance(true)}><Headphones /> {t('settings.about.contactSupport')}</Button>
            <Button variant="outline" className="w-full justify-start" to={ROUTES.help}><Info /> {t('settings.about.helpCenter')}</Button>
          </div>
        </Section>
        <Section title={t('settings.about.documentsTitle')} icon={<FileText />}>
          <ul className="space-y-2 text-sm">
            {USEFUL_DOCUMENTS.map((d) => (
              <li key={d}><Link to={ROUTES.terms} className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-brand-50">{t(`settings.about.documents.${d}`)}<ChevronRight className="size-4" /></Link></li>
            ))}
          </ul>
        </Section>
      </div>
      <Card className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm">
        <span><Trans t={t} i18nKey="settings.about.version" values={{ version: '2.4.0' }} components={{ b: <b /> }} /> <Badge tone="green">{t('settings.about.upToDate')}</Badge></span>
        <span className="text-muted">{t('settings.about.lastUpdate', { date: shortDate(new Date(2026, 10, 5), { day: '2-digit', month: 'short', year: 'numeric' }) })}</span>
      </Card>
      {account && <AssistanceModal open={assistance} onClose={() => setAssistance(false)} compteId={account.id} />}
    </div>
  )
}
