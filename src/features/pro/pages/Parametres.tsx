import { useState } from 'react'
import { NavLink, useParams, Link } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Briefcase,
  CalendarClock,
  Camera,
  ChartNoAxesColumnIncreasing,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Gem,
  GraduationCap,
  Headphones,
  Info,
  KeyRound,
  Languages,
  Laptop,
  Layers,
  Lightbulb,
  Lock,
  LockKeyhole,
  LogIn,
  Mail,
  Megaphone,
  Monitor,
  Moon,
  Palette,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Star,
  Sun,
  Target,
  Trash2,
  UserCheck,
  UserCog,
  UserRound,
  UserX,
  Users,
} from 'lucide-react'
import { LANGUES, langueActive } from '@/i18n'
import { Badge, StatusBadge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Img } from '@/shared/components/ui/Img'
import { LogoMark } from '@/shared/components/ui/Logo'
import { Pagination } from '@/shared/components/ui/Pagination'
import { ProHeader } from '@/features/pro/components/ProBlocks'
import { Field, Select } from '@/shared/components/forms/Fields'
import { IconTile, Tip } from '@/shared/components/ui/Blocks'
import { cn } from '@/shared/utils/cn'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { useActiviteSecurite, useNotifications, useParametres, useRoles, useUtilisateurs } from '@/data/hooks'
import { useMonEcole, useSession } from '@/features/auth/hooks/useSession'
import type { UtilisateurPro } from '@/shared/types'
import { POUR_TOUS, data } from '@/data'
import { MenuActions } from '@/shared/components/ui/MenuActions'
import { AssistanceModal } from '@/shared/components/ui/AssistanceModal'
import { protegerMotDePasse, verifierMotDePasse } from '@/shared/utils/motDePasse'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import { oui, prefixer, sousCles, texte, type Valeurs, dateDuJour } from '@/features/pro/proData'
import { decrireAppareil } from '@/shared/utils/appareil'
import { ChampMotDePasse } from '@/shared/components/forms/MotDePasse'

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
  { key: 'preferences', labelKey: 'preferences', icon: SlidersHorizontal },
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

/** L'en-tête de chaque section (img18 à img24) : son icône, son titre et sa phrase. */
const ENTETES: Record<string, { icon: React.ReactNode; cle?: 'security' | 'notifications' | 'preferences' | 'users' | 'about' }> = {
  '': { icon: <Settings /> },
  securite: { icon: <ShieldCheck />, cle: 'security' },
  notifications: { icon: <Bell />, cle: 'notifications' },
  preferences: { icon: <SlidersHorizontal />, cle: 'preferences' },
  utilisateurs: { icon: <Users />, cle: 'users' },
  'a-propos': { icon: <Info />, cle: 'about' },
}

export function Parametres() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { section = '' } = useParams()
  const current = sections.find((x) => x.key === section) ?? sections[0]
  const entete = ENTETES[section] ?? ENTETES['']!
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('settings.crumbs.profile'), to: ROUTES.pro.profile() }, { label: t('settings.crumbs.settings'), to: ROUTES.pro.settings() }, ...(section ? [{ label: t(`settings.sections.${current.labelKey}`) }] : [])]}
        icon={entete.icon}
        title={entete.cle ? t(`settings.headers.${entete.cle}.title`) : t('settings.title')}
        subtitle={entete.cle ? t(`settings.headers.${entete.cle}.subtitle`) : t('settings.subtitle')}
        actions={<span />}
      />
      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        <nav className="h-fit space-y-2 rounded-2xl border border-line bg-white p-2 shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
          {sections.map((x) => (
            <NavLink
              key={x.key}
              to={ROUTES.pro.settings(x.key)}
              end
              className={({ isActive }) => cn('flex h-12 items-center gap-2.5 rounded-xl px-3 text-[15px] font-semibold whitespace-nowrap', isActive ? 'bg-brand-600 text-white' : 'bg-[#f3f6fc] text-navy-900 hover:bg-brand-50')}
            >
              <x.icon className="size-6 shrink-0" />
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
          <label className="inline-flex h-9 cursor-pointer items-center whitespace-nowrap rounded-full border-2 border-brand-600/60 bg-white px-4 text-[14px] font-semibold text-navy-800">
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
              className="inline-flex h-11 items-center gap-2.5 rounded-full bg-brand-600 px-6 text-[16px] font-semibold whitespace-nowrap text-white"
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

/** Carte des sections des paramètres (img19 à img24). */
const carte = 'rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]'

/** Titre d'une carte : grande icône bleue, titre, phrase d'aide (img19 à img24). */
function EnTete({ icon, titre, sousTitre, action }: { icon: React.ReactNode; titre: string; sousTitre?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-brand-600 [&_svg]:size-8">{icon}</span>
      <div className="min-w-0 flex-1">
        <h2 className="text-[19px] leading-tight font-bold text-navy-900">{titre}</h2>
        {sousTitre && <p className="text-[14px] text-navy-900">{sousTitre}</p>}
      </div>
      {action}
    </div>
  )
}

/** Appareil (« Windows · Chrome ») → icône d'ordinateur ou de téléphone. */
const iconeAppareil = (appareil: string) => (/android|iphone|ipad|mobile/i.test(appareil) ? <Smartphone /> : <Laptop />)

function Securite() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { account } = useSession()
  // L'activité réelle du compte (connexions, tentatives échouées, mots de passe changés).
  const activiteSecurite = useActiviteSecurite(account?.id)
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
  const score = rules.filter((x) => x.ok).length
  const deuxFacteurs = r.oui('deuxFacteurs', true)
  const appareil = decrireAppareil()
  const mettreAJour = async () => {
    if (!account) return
    if (!(await verifierMotDePasse(account.motDePasse, actuel))) return void toast.error(t('settings.security.wrongCurrent'))
    if (score < 4) return void toast.error(t('settings.security.invalidPassword'))
    if (pwd !== confirmation) return void toast.error(t('settings.security.mismatch'))
    await data.update('comptes', account.id, { motDePasse: await protegerMotDePasse(pwd) })
    await data.create('activiteSecurite', { compteId: account.id, evenement: 'motDePasse', le: new Date().toISOString(), appareil: decrireAppareil(), ok: true }, 'activite')
    setActuel('')
    setPwd('')
    setConfirmation('')
    toast.success(t('settings.security.passwordUpdated'))
  }
  return (
    <div className="space-y-4">
      <div className={carte}>
        <EnTete icon={<Lock />} titre={t('settings.security.changePassword')} sousTitre={t('settings.security.changePasswordHint')} />
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <Field label={t('settings.security.currentPassword')} required><ChampMotDePasse autoComplete="current-password" value={actuel} onChange={(e) => setActuel(e.target.value)} /></Field>
          <Field label={t('settings.security.newPassword')} required><ChampMotDePasse autoComplete="new-password" value={pwd} onChange={(e) => setPwd(e.target.value)} /></Field>
          <Field label={t('settings.security.confirmPassword')} required><ChampMotDePasse autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></Field>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          {rules.map((x) => (
            <span key={x.label} className={cn('inline-flex items-center gap-1.5 text-[13.5px]', x.ok ? 'text-navy-900' : 'text-muted')}>
              <CheckCircle2 className={cn('size-5', x.ok ? 'fill-emerald-500 text-white' : 'text-slate-300')} aria-hidden="true" />
              {x.label}
            </span>
          ))}
          <Button className="ml-auto rounded-full px-6" onClick={() => void mettreAJour()}>
            <Check strokeWidth={3} />
            {t('settings.security.update')}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className={carte}>
          <EnTete icon={<ShieldCheck />} titre={t('settings.security.twoFactorTitle')} sousTitre={t('settings.security.twoFactorHint')} />
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f3f6fc] p-3">
            <IconTile icon={<Smartphone />} tone="blue" />
            <p className="flex-1 text-[14px] text-navy-900">
              {t('settings.security.twoFactorText')}
              <span className="block text-[13px] text-muted">{masquer(account?.telephone ?? '')}</span>
            </p>
            <div className="flex flex-col items-end gap-2">
              <Toggle
                on={deuxFacteurs}
                onChange={async (actif) => {
                  await r.enregistrer({ deuxFacteurs: actif })
                  toast.success(t(actif ? 'settings.security.twoFactorOn' : 'settings.security.twoFactorOff'))
                }}
              />
              <Badge tone={deuxFacteurs ? 'green' : 'gray'}>{t(deuxFacteurs ? 'settings.security.enabled' : 'settings.security.disabled')}</Badge>
            </div>
          </div>
        </div>
        <div className={carte}>
          <EnTete icon={<Laptop />} titre={t('settings.security.sessionsTitle')} sousTitre={t('settings.security.sessionsHint')} />
          {/* La session réelle : cet appareil et ce navigateur (une seule, sans serveur). */}
          <div className="mt-3 flex items-center gap-3 border-b border-line py-2.5 text-[14.5px] text-navy-900 last:border-0">
            <span className="text-navy-800 [&_svg]:size-6">{iconeAppareil(appareil)}</span>
            <b className="flex-1">{appareil}</b>
            <Badge tone="blue">{t('settings.security.currentSession')}</Badge>
          </div>
        </div>
      </div>
      <div className={carte}>
        <EnTete icon={<Clock />} titre={t('settings.security.activityTitle')} />
        {activiteSecurite.length === 0 ? (
          <p className="mt-3 rounded-xl bg-page px-4 py-3 text-sm text-muted">{t('settings.security.noActivity')}</p>
        ) : (
          <div className="mt-2 divide-y divide-line">
            {activiteSecurite.slice(0, 10).map((a) => (
              <div key={a.id} className="grid grid-cols-[28px_1fr] items-center gap-x-3 gap-y-0.5 py-2.5 text-[14.5px] text-navy-900 sm:grid-cols-[28px_1.3fr_1fr_auto]">
                <span className={cn('[&_svg]:size-5', !a.ok ? 'text-rose-500' : 'text-emerald-600')}>{!a.ok ? <LockKeyhole /> : a.evenement === 'motDePasse' ? <KeyRound /> : <LogIn />}</span>
                <b>{t(`settings.security.events.${a.evenement}`)}</b>
                <span className="col-start-2 text-muted sm:col-start-auto">{a.appareil}</span>
                <span className="col-start-2 text-[13.5px] text-muted sm:col-start-auto sm:text-right">{shortDate(a.le, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const notifIcon: Record<string, { icon: React.ReactNode; tone: 'green' | 'violet' | 'amber' | 'blue' | 'sky' }> = {
  candidature: { icon: <UserRound />, tone: 'green' },
  document: { icon: <Download />, tone: 'violet' },
  avis: { icon: <Star />, tone: 'amber' },
  rappel: { icon: <CalendarClock />, tone: 'sky' },
  validation: { icon: <FileCheck2 />, tone: 'green' },
}

/** Types de notifications des données de démo (clés de traduction). */
const NOTIF_TYPES = ['candidature', 'document', 'avis', 'rappel', 'validation'] as const
type NotifType = (typeof NOTIF_TYPES)[number]
const isNotifType = (type: string): type is NotifType => (NOTIF_TYPES as readonly string[]).includes(type)

/** Les interrupteurs de « Paramètres de notifications » (img20) et leur icône. */
const ALERTES = [
  { cle: 'applications', icon: <FileText />, defaut: true },
  { cle: 'downloads', icon: <Download />, defaut: true },
  { cle: 'reviews', icon: <Star />, defaut: true },
  { cle: 'reminders', icon: <CalendarClock />, defaut: true },
  { cle: 'news', icon: <Megaphone />, defaut: false },
] as const

const NOTIFS_PAR_PAGE = 5

function Notifications() {
  const notificationsPro = useNotifications()
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const [tab, setTab] = useState<'toutes' | 'non-lues' | 'lues'>('toutes')
  const [page, setPage] = useState(1)
  // « Lue » et les interrupteurs sont enregistrés tout de suite.
  const r = useReglages('notifications')
  const { ecole } = useMonEcole()
  const items = notificationsPro.filter((n) => !n.etablissementId || n.etablissementId === ecole.id)
  const marquer = (ns: typeof items) => Promise.all(ns.map((n) => data.update('notifications', n.id, { lu: true })))
  const list = items.filter((n) => tab === 'toutes' || (tab === 'non-lues' ? !n.lu : n.lu))
  const pages = Math.max(1, Math.ceil(list.length / NOTIFS_PAR_PAGE))
  const visibles = list.slice((page - 1) * NOTIFS_PAR_PAGE, page * NOTIFS_PAR_PAGE)
  const onglets = [
    { value: 'toutes' as const, label: t('settings.notifications.tabs.allCount', { count: items.length }) },
    { value: 'non-lues' as const, label: t('settings.notifications.tabs.unreadCount', { count: items.filter((n) => !n.lu).length }) },
    { value: 'lues' as const, label: t('settings.notifications.tabs.read') },
  ]
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_330px]">
      <div className={carte}>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-wrap gap-2" role="tablist">
            {onglets.map((o) => (
              <button
                key={o.value}
                type="button"
                role="tab"
                aria-selected={tab === o.value}
                onClick={() => {
                  setTab(o.value)
                  setPage(1)
                }}
                className={cn('h-9 rounded-full px-4 text-[14px] font-semibold', tab === o.value ? 'bg-brand-600 text-white' : 'bg-[#eef3fc] text-navy-900 hover:bg-brand-100')}
              >
                {o.label}
              </button>
            ))}
          </div>
          <MenuActions
            label={t('settings.notifications.more')}
            actions={[{ label: t('settings.notifications.markAllRead'), icon: <CheckCircle2 />, onClick: async () => { await marquer(items); toast.success(t('settings.notifications.allMarkedRead')) } }]}
          />
        </div>
        {visibles.length === 0 ? (
          <p className="mt-3 rounded-xl bg-page px-4 py-3 text-sm text-muted">{t('settings.notifications.empty')}</p>
        ) : (
          <div className="mt-3 space-y-2">
            {visibles.map((n) => {
              const s = notifIcon[n.type] ?? notifIcon.validation!
              // Les notifications de départ (notification-1 à 5) ont leur traduction ; une nouvelle s'affiche telle quelle.
              const type = /^notification-[1-5]$/.test(n.id) && isNotifType(n.type) ? n.type : null
              return (
                <button key={n.id} type="button" onClick={() => void marquer([n])} className={cn('flex w-full items-center gap-3 rounded-xl p-3 text-left', n.lu ? 'bg-white' : 'bg-[#f3f6fc]')}>
                  <IconTile icon={s.icon} tone={s.tone} />
                  <div className="min-w-0 flex-1 text-[14px]">
                    <p className="font-bold text-navy-900">{type ? t(`settings.notifications.items.${type}.title`) : n.titre}</p>
                    <p className="text-navy-900">{type ? t(`settings.notifications.items.${type}.text`) : n.texte}</p>
                  </div>
                  <span className="self-start text-[13px] whitespace-nowrap text-navy-900">{type ? t(`settings.notifications.items.${type}.date`) : n.date}</span>
                  {!n.lu && <span className="size-2.5 shrink-0 rounded-full bg-brand-600" aria-label={t('settings.notifications.unread')} />}
                </button>
              )
            })}
          </div>
        )}
        <Pagination
          label={list.length === 0 ? '' : t('settings.notifications.range', { from: (page - 1) * NOTIFS_PAR_PAGE + 1, to: (page - 1) * NOTIFS_PAR_PAGE + visibles.length, count: list.length })}
          pages={pages}
          page={page}
          onChange={setPage}
        />
      </div>
      <div className="space-y-4">
        <div className={carte}>
          <EnTete icon={<Settings />} titre={t('settings.notifications.settingsTitle')} sousTitre={t('settings.notifications.settingsHint')} />
          <div className="mt-2 divide-y divide-line">
            {ALERTES.map((a) => (
              <div key={a.cle} className="flex items-center gap-3 py-2.5 text-[14.5px] text-navy-900 [&>svg]:size-5 [&>svg]:text-navy-800">
                {a.icon}
                <span className="flex-1">{t(`settings.notifications.switches.${a.cle}`)}</span>
                <Toggle on={r.oui(`alertes.${a.cle}`, a.defaut)} onChange={(v) => void r.enregistrer({ [`alertes.${a.cle}`]: v })} />
              </div>
            ))}
          </div>
        </div>
        <Tip title={t('settings.tipTitle')} icon={<Lightbulb />} tone="green">{t('settings.notifications.tipText')}</Tip>
      </div>
    </div>
  )
}

function Preferences() {
  const { t, i18n } = useTranslation('pro', { keyPrefix: 'content' })
  const { t: tc } = useTranslation('common')
  const r = useReglages('preferences')
  const theme = r.texte('theme', 'clair')
  const publication = r.texte('publication', 'automatique')
  const visibilite = [
    { cle: 'contacts', titre: t('settings.preferences.showContacts'), sous: t('settings.preferences.showContactsSub'), defaut: true },
    { cle: 'adresse', titre: t('settings.preferences.showAddress'), sous: t('settings.preferences.showAddressSub'), defaut: true },
    { cle: 'avis', titre: t('settings.preferences.showReviews'), sous: t('settings.preferences.showReviewsSub'), defaut: true },
    { cle: 'masquerFrais', titre: t('settings.preferences.hideFees'), sous: t('settings.preferences.hideFeesSub'), defaut: false },
  ]
  const modes = [
    { v: 'automatique', titre: t('settings.preferences.autoPublish'), sous: t('settings.preferences.autoPublishHint') },
    { v: 'manuelle', titre: t('settings.preferences.manualPublish'), sous: t('settings.preferences.manualPublishHint') },
  ]
  const themes = [
    { v: 'clair', icon: <Sun /> },
    { v: 'sombre', icon: <Moon /> },
    { v: 'systeme', icon: <Monitor /> },
  ] as const
  return (
    <div className="space-y-4">
      <div className={carte}>
        <EnTete icon={<Send />} titre={t('settings.preferences.publishingTitle')} sousTitre={t('settings.preferences.publishingHint')} />
        <div className="mt-3 grid gap-3 md:grid-cols-2" role="radiogroup" aria-label={t('settings.preferences.publishingTitle')}>
          {modes.map((m) => (
            <button
              key={m.v}
              type="button"
              role="radio"
              aria-checked={publication === m.v}
              onClick={() => r.changer('publication', m.v)}
              className={cn('flex items-center gap-3 rounded-xl border p-3 text-left', publication === m.v ? 'border-brand-200 bg-[#f3f6fc]' : 'border-line bg-white hover:bg-slate-50')}
            >
              <span className={cn('size-5 shrink-0 rounded-full border', publication === m.v ? 'border-[6px] border-brand-600' : 'border-slate-300')} aria-hidden="true" />
              <span>
                <b className="block text-[15px] text-navy-900">{m.titre}</b>
                <span className="text-[13px] text-navy-900">{m.sous}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className={carte}>
        <EnTete icon={<Eye />} titre={t('settings.preferences.visibilityTitle')} sousTitre={t('settings.preferences.visibilityHint')} />
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibilite.map((v) => (
            <div key={v.cle} className="flex items-center gap-3">
              <Toggle on={r.oui(`visibilite.${v.cle}`, v.defaut)} onChange={(x) => r.changer(`visibilite.${v.cle}`, x)} />
              <span className="text-[13.5px] leading-tight text-navy-900">
                <b className="block">{v.titre}</b>
                {v.sous}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={carte}>
          <EnTete icon={<Languages />} titre={t('settings.preferences.languageTitle')} sousTitre={t('settings.preferences.languageHint')} />
          <Select
            className="mt-3"
            aria-label={t('settings.preferences.languageTitle')}
            options={LANGUES.map((l) => ({ value: l.code, label: tc(l.libelleCle) }))}
            value={langueActive(i18n.language)}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
          />
        </div>
        <div className={carte}>
          <EnTete icon={<Palette />} titre={t('settings.preferences.themeTitle')} sousTitre={t('settings.preferences.themeHint')} />
          <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label={t('settings.preferences.themeTitle')}>
            {themes.map((th) => (
              <button
                key={th.v}
                type="button"
                role="radio"
                aria-checked={theme === th.v}
                onClick={() => {
                  r.changer('theme', th.v)
                  if (th.v !== 'clair') toast(t('settings.preferences.darkSoon'))
                }}
                className={cn('flex h-11 items-center justify-center gap-2 rounded-xl border text-[14px] font-semibold text-navy-900 [&>svg]:size-5', theme === th.v ? 'border-brand-600 bg-[#f3f6fc] ring-1 ring-brand-600' : 'border-line bg-white hover:bg-slate-50')}
              >
                {th.icon}
                {t(`settings.preferences.themes.${th.v}`)}
                {theme === th.v && <CheckCircle2 className="fill-brand-600 text-white" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={() => { r.annuler(); toast(t('settings.cancelled')) }} className="h-11 w-36 rounded-full border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800">{t('settings.cancel')}</button>
        <button type="button" onClick={async () => { await r.enregistrer(); toast.success(t('settings.saved')) }} className="inline-flex h-11 items-center gap-2.5 rounded-full bg-brand-600 px-7 text-[16px] font-semibold whitespace-nowrap text-white hover:bg-brand-700">
          <Check className="size-5" strokeWidth={3} />
          {t('settings.preferences.save')}
        </button>
      </div>
    </div>
  )
}

/** L'icône et la couleur de chaque rôle (img22, img23). */
const ROLE_STYLE: Record<string, { icon: React.ReactNode; chip: string }> = {
  Administrateur: { icon: <Crown />, chip: 'bg-brand-50 text-brand-700' },
  'Responsable pédagogique': { icon: <GraduationCap />, chip: 'bg-violet-50 text-violet-700' },
  Communication: { icon: <Megaphone />, chip: 'bg-sky-50 text-sky-700' },
  Secrétariat: { icon: <Briefcase />, chip: 'bg-orange-50 text-orange-700' },
  Consultation: { icon: <Users />, chip: 'bg-slate-100 text-slate-700' },
}

function Utilisateurs() {
  const roles = useRoles()
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const roleName = useRoleName()
  const [q, setQ] = useState('')
  const { ecole } = useMonEcole()
  const { account } = useSession()
  const enregistres = useUtilisateurs(ecole.id)
  const derniere = useActiviteSecurite(account?.id).find((a) => a.evenement === 'connexion' && a.ok)
  // Le compte connecté fait partie de l'équipe (« Vous »), sans être enregistré dans la table.
  const moi: UtilisateurPro[] = account && !enregistres.some((u) => u.vous)
    ? [{ id: 'vous', etablissementId: ecole.id, nom: account.name, role: 'Administrateur', telephone: account.telephone, email: account.identifiant, statut: 'Actif', connexion: derniere ? shortDate(derniere.le, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—', avatar: account.avatar, vous: true }]
    : []
  const utilisateurs = [...moi, ...enregistres]
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
  const kpis = [
    { n: utilisateurs.length, l: t('settings.users.kpis.users'), icon: <Users />, c: 'bg-[#e8f0ff]', ic: 'text-brand-600' },
    { n: utilisateurs.filter((u) => u.statut === 'Actif').length, l: t('settings.users.kpis.active'), icon: <CheckCircle2 />, c: 'bg-[#e5f7ea]', ic: 'text-emerald-600' },
    { n: utilisateurs.filter((u) => u.statut !== 'Actif').length, l: t('settings.users.kpis.inactive'), icon: <UserRound />, c: 'bg-[#fff4dd]', ic: 'text-amber-600' },
  ]
  const statut = (s: string) =>
    s === 'Actif' ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-emerald-700"><CheckCircle2 className="size-3.5 fill-emerald-600 text-white" />{t('settings.users.statuses.active')}</span>
    ) : (
      <StatusBadge status={s} />
    )
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {kpis.map((k) => (
          <div key={k.l} className={cn('flex min-w-40 flex-1 items-center gap-3 rounded-2xl px-4 py-3 shadow-sm', k.c)}>
            <span className={cn('[&_svg]:size-9', k.ic)}>{k.icon}</span>
            <p className="leading-tight">
              <b className="block text-[24px] text-navy-900">{k.n}</b>
              <span className="text-[14px] text-navy-900">{k.l}</span>
            </p>
          </div>
        ))}
        <Link to={ROUTES.pro.inviteUser} className="inline-flex h-12 items-center gap-2.5 rounded-full bg-brand-600 px-7 text-[16px] font-semibold whitespace-nowrap text-white hover:bg-brand-700">
          <Plus className="size-5" />
          {t('settings.users.invite')}
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('settings.users.searchPlaceholder')} aria-label={t('settings.users.searchPlaceholder')} className="h-11 w-full rounded-full border border-[#c9d4ea] bg-white pr-4 pl-11 text-[14.5px] focus:ring-3 focus:ring-brand-100" />
        </label>
        <Select aria-label={t('settings.users.roleAria')} value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)} className="h-11 rounded-full" options={[{ value: '', label: t('settings.users.allRoles') }, ...roles.map((x) => ({ value: x.nom, label: roleName(x.nom) }))]} />
        <Select aria-label={t('settings.users.statusAria')} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className="h-11 rounded-full" options={[{ value: '', label: t('settings.users.allStatuses') }, { value: 'Actif', label: t('settings.users.statuses.active') }, { value: 'Inactif', label: t('settings.users.statuses.inactive') }]} />
      </div>
      <div className={cn(carte, 'overflow-hidden p-0')}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-[14px] text-navy-900">
            <thead>
              <tr className="bg-[#eef3fc] text-left text-[14px] font-bold">
                <th className="w-12 py-3 pl-4"><input type="checkbox" aria-label={t('settings.users.selectAll')} className="size-4 accent-brand-600" /></th>
                <th>{t('settings.users.table.user')}</th>
                <th>{t('settings.users.table.role')}</th>
                <th>{t('settings.users.table.contact')}</th>
                <th>{t('settings.users.table.status')}</th>
                <th>{t('settings.users.table.lastLogin')}</th>
                <th className="pr-4 text-right">{t('settings.users.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => {
                const style = ROLE_STYLE[u.role]
                return (
                  <tr key={u.id} className="border-t border-line">
                    <td className="py-2.5 pl-4"><input type="checkbox" aria-label={u.nom} className="size-4 accent-brand-600" /></td>
                    <td>
                      <span className="flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.nom} size={36} />
                        <span className="leading-tight">
                          <b className="block">{u.nom}</b>
                          {u.vous && <span className="mt-0.5 inline-block rounded-md bg-brand-50 px-1.5 text-[12px] font-semibold text-brand-700">{t('settings.users.you')}</span>}
                        </span>
                      </span>
                    </td>
                    <td><span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold whitespace-nowrap [&_svg]:size-3.5', style?.chip ?? 'bg-slate-100 text-slate-700')}>{style?.icon}{roleName(u.role)}</span></td>
                    <td className="text-[13px]">
                      {u.telephone && <p className="flex items-center gap-1.5"><Phone className="size-3.5 text-brand-600" aria-hidden="true" />{u.telephone}</p>}
                      {u.email && <p className="flex items-center gap-1.5"><Mail className="size-3.5 text-brand-600" aria-hidden="true" />{u.email}</p>}
                    </td>
                    <td>{statut(u.statut)}</td>
                    <td className="text-[13.5px]">{indexMaquette(u) >= 0 ? t(`settings.users.lastLogins.${indexMaquette(u) as 0 | 1 | 2 | 3 | 4}`, { defaultValue: u.connexion }) : u.connexion}</td>
                    <td className="pr-4 text-right">
                      {!u.vous && (
                        <MenuActions
                          label={t('settings.users.actions')}
                          className="ml-auto"
                          actions={[
                            ...roles
                              .filter((x) => x.nom !== u.role)
                              .map((x) => ({ label: t('settings.users.menu.setRole', { role: roleName(x.nom) }), icon: <UserCog />, onClick: () => modifier(u, { role: x.nom }, t('settings.users.menu.roleChanged', { name: u.nom, role: roleName(x.nom) })) })),
                            u.statut === 'Actif'
                              ? { label: t('settings.users.menu.deactivate'), icon: <UserX />, onClick: () => modifier(u, { statut: 'Inactif' }, t('settings.users.menu.deactivated', { name: u.nom })) }
                              : { label: t('settings.users.menu.activate'), icon: <UserCheck />, onClick: () => modifier(u, { statut: 'Actif' }, t('settings.users.menu.activated', { name: u.nom })) },
                            { label: t('settings.users.menu.resend'), icon: <Send />, hidden: u.statut !== 'En attente', onClick: () => modifier(u, { connexion: t('settings.users.menu.invitedOn', { date: dateDuJour() }) }, t('settings.users.menu.resent', { email: u.email })) },
                            { label: t('settings.users.menu.remove'), icon: <Trash2 />, danger: true, onClick: async () => { await data.remove('utilisateurs', u.id); toast.success(t('settings.users.menu.removed', { name: u.nom })) } },
                          ]}
                        />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="border-t border-line px-4 py-3 text-[14px] text-navy-900">{t('settings.users.range', { from: list.length ? 1 : 0, to: list.length, count: list.length })}</p>
      </div>
    </div>
  )
}

const VALUES = ['professionalism', 'reliability', 'inclusion', 'innovation'] as const
const ESPACE = ['trainings', 'documents', 'applications', 'performance'] as const
const USEFUL_DOCUMENTS = [
  { cle: 'terms', icon: <ShieldCheck /> },
  { cle: 'sales', icon: <FileText /> },
  { cle: 'privacy', icon: <Lock /> },
] as const

function APropos() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { account } = useSession()
  const [assistance, setAssistance] = useState(false)
  const coche = (texte: string) => (
    <li key={texte} className="flex items-center gap-2 text-[14px] text-navy-900">
      <Check className="size-4 text-emerald-600" strokeWidth={3} aria-hidden="true" />
      {texte}
    </li>
  )
  return (
    <div className="space-y-4">
      <div className={cn(carte, 'flex items-stretch overflow-hidden bg-[linear-gradient(100deg,#ffffff_0%,#eef3fc_100%)] p-0')}>
        <div className="flex items-center gap-5 px-6 py-5">
          <span className="flex flex-col items-center gap-1 pr-5 sm:border-r sm:border-brand-200">
            <LogoMark className="size-14" />
            <span className="text-[26px] leading-none font-extrabold tracking-wide text-brand-700">YIBOLO</span>
          </span>
          <div>
            <p className="text-[19px] leading-snug font-bold text-navy-900">{t('settings.about.tagline')}</p>
            <p className="mt-2 text-[14px] text-navy-900">{t('settings.about.pillars')}</p>
          </div>
        </div>
        <Img src="/images/maquette/pro-apropos-batiment.jpg" alt="" className="ml-auto hidden w-[300px] shrink-0 lg:block" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={carte}>
          <EnTete icon={<Target />} titre={t('settings.about.missionTitle')} />
          <p className="mt-2 text-[14px] text-navy-900">{t('settings.about.missionText')}</p>
        </div>
        <div className={carte}>
          <EnTete icon={<Gem />} titre={t('settings.about.valuesTitle')} />
          <ul className="mt-2 space-y-1">{VALUES.map((v) => coche(t(`settings.about.values.${v}`)))}</ul>
        </div>
        <div className={carte}>
          <EnTete icon={<ChartNoAxesColumnIncreasing />} titre={t('settings.about.spaceTitle')} />
          <ul className="mt-2 space-y-1">{ESPACE.map((v) => coche(t(`settings.about.space.${v}`)))}</ul>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={carte}>
          <EnTete icon={<Headphones />} titre={t('settings.about.supportTitle')} />
          <p className="mt-2 text-[14px] text-navy-900">{t('settings.about.supportText')}</p>
          <div className="mt-3 space-y-2">
            <Button className="w-full rounded-full" onClick={() => setAssistance(true)}><Headphones /> {t('settings.about.contactSupport')}</Button>
            <Button variant="outline" className="w-full rounded-full" to={ROUTES.help}><BookOpen /> {t('settings.about.helpCenter')}</Button>
          </div>
        </div>
        <div className={carte}>
          <EnTete icon={<FileText />} titre={t('settings.about.documentsTitle')} />
          <ul className="mt-2 divide-y divide-line text-[14px]">
            {USEFUL_DOCUMENTS.map((d) => (
              <li key={d.cle}>
                <Link to={ROUTES.terms} className="flex w-full items-center gap-2.5 py-2 text-navy-900 hover:text-brand-600 [&>svg:first-child]:size-4 [&>svg:first-child]:text-brand-600">
                  {d.icon}
                  <span className="flex-1">{t(`settings.about.documents.${d.cle}`)}</span>
                  <ArrowUpRight className="size-4 text-brand-600" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={carte}>
          <EnTete icon={<Layers />} titre={t('settings.about.versionTitle')} />
          <p className="mt-2 text-[14px] font-bold text-navy-900">{t('settings.about.product')}</p>
          <p className="mt-1 flex items-center justify-between text-[14px] text-navy-900">
            <span>
              <Trans t={t} i18nKey="settings.about.version" values={{ version: '2.4.0' }} components={{ b: <span /> }} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-emerald-700"><CheckCircle2 className="size-3.5 fill-emerald-600 text-white" />{t('settings.about.upToDate')}</span>
          </p>
          <p className="mt-3 flex items-center gap-2 text-[14px] text-navy-900">
            <RefreshCw className="size-4 text-brand-600" aria-hidden="true" />
            {t('settings.about.lastUpdate', { date: shortDate(new Date(2026, 10, 5), { day: '2-digit', month: 'short', year: 'numeric' }) })}
          </p>
        </div>
      </div>
      {account && <AssistanceModal open={assistance} onClose={() => setAssistance(false)} compteId={account.id} />}
    </div>
  )
}
