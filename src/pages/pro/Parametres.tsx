import { useState } from 'react'
import { NavLink, useParams } from 'react-router'
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
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, Section } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Feedback'
import { ProHeader } from '@/components/domain/pro'
import { ChoiceCard, Field, Input, Radio, Select, Switch } from '@/components/ui/Form'
import { Tabs } from '@/components/ui/Tabs'
import { FormFooter, IconBtn, IconTile, Kpi, KpiGrid, Tip } from '@/components/shared/Blocks'
import { activiteSecurite, notificationsPro, roles, sessionsActives, utilisateurs } from '@/mocks/pro'
import { cn } from '@/lib/utils'

const sections = [
  { key: '', label: 'Compte et accès', icon: UserRound },
  { key: 'securite', label: 'Sécurité', icon: ShieldCheck },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'preferences', label: 'Préférences', icon: Settings },
  { key: 'utilisateurs', label: 'Utilisateurs', icon: Users },
  { key: 'a-propos', label: 'À propos', icon: Info },
]

export default function Parametres() {
  const { section = '' } = useParams()
  const current = sections.find((x) => x.key === section) ?? sections[0]
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: 'Profil de l’établissement', to: '/pro/ecole/profil' }, { label: 'Paramètres', to: '/pro/ecole/parametres' }, ...(section ? [{ label: current.label }] : [])]}
        icon={<Settings />}
        title="Paramètres"
        subtitle="Gérez votre compte, la sécurité et les préférences de publication."
        actions={<span />}
      />
      <div className="grid gap-4 lg:grid-cols-[214px_1fr]">
        <nav className="h-fit space-y-2 rounded-2xl border border-line bg-white p-2 shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
          {sections.map((x) => (
            <NavLink
              key={x.key}
              to={x.key ? `/pro/ecole/parametres/${x.key}` : '/pro/ecole/parametres'}
              end
              className={({ isActive }) => cn('flex h-12 items-center gap-3 rounded-xl px-4 text-[16px] font-semibold', isActive ? 'bg-brand-600 text-white' : 'bg-[#f3f6fc] text-navy-900 hover:bg-brand-50')}
            >
              <x.icon className="size-6" />
              {x.label}
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

const saveFooter = (
  <FormFooter className="mt-6">
    <Button variant="neutral" onClick={() => toast('Modifications annulées')}>Annuler</Button>
    <Button onClick={() => toast.success('Modifications enregistrées')}>Enregistrer les modifications</Button>
  </FormFooter>
)

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => setOn(!on)} className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-brand-600' : 'bg-slate-300')}>
      <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}

function Compte() {
  const card = 'rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
  const input = 'h-10 w-full rounded-lg border border-[#c9d4ea] bg-white pl-11 pr-3 text-[15px] outline-none focus:border-brand-500'
  const title = (icon: React.ReactNode, t: string, sub?: string) => (
    <div className="flex items-start gap-3">
      <span className="text-brand-600 [&_svg]:size-8">{icon}</span>
      <div>
        <h2 className="text-[20px] font-bold text-navy-900">{t}</h2>
        {sub && <p className="text-[14px] text-navy-900">{sub}</p>}
      </div>
    </div>
  )
  return (
    <div className="space-y-4">
      <div className={cn(card, 'grid gap-4 md:grid-cols-[1fr_174px]')}>
        <div>
          {title(<UserRound />, 'Compte et accès', 'Informations de connexion et gestion de votre compte.')}
          <div className="mt-3 grid gap-x-5 gap-y-3 md:grid-cols-2">
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">Nom et prénom <span className="text-rose-500">*</span></span><input className={cn(input, 'pl-3.5')} defaultValue="IPC Yaoundé – Administrateur" /></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">Téléphone <span className="text-rose-500">*</span></span><span className="relative block"><Phone className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><input className={input} defaultValue="+237 6 90 12 34 56" /></span></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">E-mail <span className="text-rose-500">*</span></span><span className="relative block"><Mail className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><input className={input} defaultValue="contact@ipc.cm" /></span></label>
            <label><span className="mb-1 block text-[14.5px] font-bold text-navy-900">Rôle</span><span className="relative block"><Users className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-800" /><select className={cn(input, 'appearance-none')} defaultValue="Administrateur">{roles.map((r) => <option key={r.nom}>{r.nom}</option>)}</select></span></label>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#eef3fc] p-4">
          <span className="relative">
            <Avatar src="/maquette/avatar-ipc.jpg" name="IPC Yaoundé" size={92} />
            <span className="absolute right-0 bottom-0 grid size-8 place-items-center rounded-full border-2 border-white bg-brand-600 text-white"><Camera className="size-4" /></span>
          </span>
          <button type="button" onClick={() => toast('Choisir une photo (démo)')} className="h-9 rounded-full border-2 border-brand-600/60 bg-white px-4 text-[14px] font-semibold text-navy-800">Changer la photo</button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <div className={card}>
            {title(<ShieldCheck />, 'Sécurité du compte')}
            <div className="mt-2 divide-y divide-line">
              <NavLink to="/pro/ecole/parametres/securite" className="flex items-center gap-3 py-2.5">
                <Lock className="size-6 text-navy-800" />
                <span className="flex-1"><b className="block text-[15px] text-navy-900">Modifier le mot de passe</b><span className="text-[13px] text-navy-900">Mettez à jour votre mot de passe régulièrement.</span></span>
                <ChevronRight className="size-5" />
              </NavLink>
              <div className="flex items-center gap-3 py-2.5">
                <ShieldCheck className="size-6 text-navy-800" />
                <span className="flex-1"><b className="block text-[15px] text-navy-900">Authentification à deux facteurs (2FA)</b><span className="text-[13px] text-navy-900">Renforcez la sécurité de votre compte.</span></span>
                <Toggle />
              </div>
            </div>
          </div>
          <div className={card}>
            {title(<SlidersHorizontal />, 'Préférences de publication')}
            <div className="mt-2 flex items-center gap-3 border-t border-line pt-3">
              <span className="flex-1"><b className="block text-[15px] text-navy-900">Publication automatique des contenus validés</b><span className="text-[13px] text-navy-900">Publier mes actualités et documents sur YIBOLO dès validation.</span></span>
              <Toggle />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className={card}>
            {title(<Bell />, 'Notifications', 'Choisissez les alertes que vous souhaitez recevoir.')}
            <div className="mt-2 divide-y divide-line">
              {['Nouvelles candidatures / préinscriptions', 'Commentaires et avis', 'Rappels (rentrée, expirations, documents)'].map((t) => (
                <div key={t} className="flex items-center justify-between gap-3 py-2.5 text-[15px] text-navy-900">{t}<Toggle /></div>
              ))}
            </div>
          </div>
          <div className="mt-auto flex justify-end gap-3">
            <button type="button" onClick={() => toast('Modifications annulées')} className="h-11 w-36 rounded-full border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800">Annuler</button>
            <button type="button" onClick={() => toast.success('Modifications enregistrées')} className="inline-flex h-11 items-center gap-2.5 rounded-full bg-brand-600 px-6 text-[16px] font-semibold text-white"><Check className="size-5" strokeWidth={3} />Enregistrer les modifications</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Securite() {
  const [pwd, setPwd] = useState('')
  const rules = [
    { label: '8 caractères minimum', ok: pwd.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(pwd) },
    { label: 'Un chiffre', ok: /\d/.test(pwd) },
    { label: 'Un caractère spécial', ok: /[^A-Za-z0-9]/.test(pwd) },
  ]
  const score = rules.filter((r) => r.ok).length
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Modifier le mot de passe" icon={<Lock />}>
          <div className="space-y-4">
            <Field label="Mot de passe actuel" required><Input type="password" defaultValue="demo2026" /></Field>
            <Field label="Nouveau mot de passe" required><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} /></Field>
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
            <Field label="Confirmer le mot de passe" required><Input type="password" /></Field>
            <Button onClick={() => (score < 4 ? toast.error('Le mot de passe ne respecte pas tous les critères.') : toast.success('Mot de passe mis à jour'))}>Mettre à jour</Button>
          </div>
        </Section>
        <div className="space-y-5">
          <Section title="Double authentification (2FA)" icon={<Smartphone />}>
            <Switch label="Code par téléphone" description="+237 6 77 •• •• 56" defaultChecked />
            <Badge tone="green" className="mt-3">Activée</Badge>
          </Section>
          <Section title="Sessions actives" icon={<Laptop />}>
            <div className="space-y-2.5">
              {sessionsActives.map((s) => (
                <div key={s.appareil} className="flex items-center gap-3 rounded-xl border border-line p-3 text-sm">
                  <IconTile icon={s.actuelle ? <Laptop /> : <Smartphone />} tone="blue" size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold">{s.appareil} – {s.lieu}</p>
                    <p className="text-xs text-muted">{s.date}</p>
                  </div>
                  {s.actuelle ? <Badge tone="green">Session actuelle</Badge> : <IconBtn label="Déconnecter" onClick={() => toast.success('Session fermée')}><MoreHorizontal /></IconBtn>}
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
      <Section title="Activité de sécurité récente" icon={<ShieldCheck />}>
        <div className="divide-y divide-line">
          {activiteSecurite.map((a) => (
            <div key={a.date} className="flex items-center gap-3 py-3 text-sm">
              {a.ok ? <CheckCircle2 className="size-5 text-emerald-500" /> : <XCircle className="size-5 text-rose-500" />}
              <span className="flex-1 font-semibold">{a.evenement}</span>
              <span className="text-muted">{a.lieu}</span>
              <span className="w-40 text-right text-muted">{a.date}</span>
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

function Notifications() {
  const [tab, setTab] = useState('toutes')
  const [items, setItems] = useState(notificationsPro)
  const list = items.filter((n) => tab === 'toutes' || (tab === 'non-lues' ? !n.lu : n.lu))
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <Section
        title="Notifications"
        icon={<Bell />}
        action={<Button variant="ghost" size="sm" onClick={() => { setItems(items.map((n) => ({ ...n, lu: true }))); toast.success('Tout est marqué comme lu') }}>Tout marquer comme lu</Button>}
      >
        <Tabs
          variant="underline"
          value={tab}
          onChange={setTab}
          items={[
            { value: 'toutes', label: 'Toutes', count: items.length },
            { value: 'non-lues', label: 'Non lues', count: items.filter((n) => !n.lu).length },
            { value: 'lues', label: 'Lues' },
          ]}
        />
        <div className="mt-3 divide-y divide-line">
          {list.map((n) => {
            const s = notifIcon[n.type]
            return (
              <button key={n.titre} type="button" onClick={() => setItems(items.map((x) => (x === n ? { ...x, lu: true } : x)))} className="flex w-full items-start gap-3 py-3 text-left">
                <IconTile icon={s.icon} tone={s.tone} size="sm" />
                <div className="flex-1 text-sm">
                  <p className="font-bold text-navy-900">{n.titre}</p>
                  <p className="text-muted">{n.texte}</p>
                </div>
                <span className="text-xs whitespace-nowrap text-muted">{n.date}</span>
                {!n.lu && <span className="mt-1.5 size-2.5 rounded-full bg-brand-600" aria-label="Non lue" />}
              </button>
            )
          })}
        </div>
      </Section>
      <div className="space-y-5">
        <Section title="Paramètres de notifications">
          <div className="space-y-3">
            <Switch label="Candidatures / Préinscriptions" defaultChecked />
            <Switch label="Téléchargements de documents" defaultChecked />
            <Switch label="Avis et commentaires" defaultChecked />
            <Switch label="Rappels et échéances" defaultChecked />
            <Switch label="Actualités YIBOLO" />
          </div>
        </Section>
        <Tip title="Conseil" icon={<Lightbulb />} tone="amber">Répondez aux candidatures sous 48 h : c’est le premier critère de satisfaction des candidats.</Tip>
      </div>
    </div>
  )
}

function Preferences() {
  const [theme, setTheme] = useState('clair')
  return (
    <div className="space-y-5">
      <Section title="Publication des contenus">
        <div className="space-y-3">
          <Radio name="pub" label="Publication automatique" description="Vos contenus sont publiés dès leur validation" defaultChecked />
          <Radio name="pub" label="Publication manuelle" description="Vous choisissez le moment de la mise en ligne" />
        </div>
      </Section>
      <Section title="Visibilité de l’établissement">
        <div className="space-y-3">
          <Switch label="Afficher les contacts" defaultChecked />
          <Switch label="Afficher l’adresse" defaultChecked />
          <Switch label="Afficher les avis" defaultChecked />
          <Switch label="Masquer les frais de formation" />
        </div>
      </Section>
      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Langue de l’interface">
          <Select options={['Français', 'English']} />
        </Section>
        <Section title="Thème d’affichage">
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 'clair', label: 'Clair', icon: <Sun className="size-5 text-amber-500" /> },
              { v: 'sombre', label: 'Sombre', icon: <Moon className="size-5 text-navy-800" /> },
              { v: 'systeme', label: 'Système', icon: <Laptop className="size-5 text-brand-600" /> },
            ].map((t) => (
              <ChoiceCard key={t.v} selected={theme === t.v} onClick={() => { setTheme(t.v); if (t.v !== 'clair') toast('Le thème sombre arrive dans une prochaine version.') }} icon={t.icon} title={t.label} className="items-center p-3" />
            ))}
          </div>
        </Section>
      </div>
      {saveFooter}
    </div>
  )
}

function Utilisateurs() {
  const [q, setQ] = useState('')
  const list = utilisateurs.filter((u) => u.nom.toLowerCase().includes(q.toLowerCase()))
  const roleTone: Record<string, 'blue' | 'violet' | 'orange' | 'green' | 'gray'> = { Administrateur: 'blue', 'Responsable pédagogique': 'violet', Communication: 'orange', Secrétariat: 'green', Consultation: 'gray' }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <KpiGrid cols={3}>
          <Kpi icon={<Users />} label="Utilisateurs" value={utilisateurs.length} tone="blue" />
          <Kpi icon={<CheckCircle2 />} label="Comptes actifs" value={utilisateurs.filter((u) => u.statut === 'Actif').length} tone="green" />
          <Kpi icon={<UserCog />} label="Compte inactif" value={utilisateurs.filter((u) => u.statut !== 'Actif').length} tone="orange" />
        </KpiGrid>
        <Button to="/pro/ecole/parametres/utilisateurs/inviter" size="lg"><Plus /> Inviter un utilisateur</Button>
      </div>
      <Card className="overflow-x-auto p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <Input icon={<Search />} placeholder="Rechercher un utilisateur…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select aria-label="Rôle" options={['Tous les rôles', ...roles.map((r) => r.nom)]} />
          <Select aria-label="Statut" options={['Tous les statuts', 'Actif', 'Inactif']} />
        </div>
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted uppercase">
              <th className="py-3">Utilisateur</th>
              <th>Rôle</th>
              <th>Contact</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
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
                    {u.vous && <Badge tone="blue">Vous</Badge>}
                  </span>
                </td>
                <td><Badge tone={roleTone[u.role]}>{u.role}</Badge></td>
                <td className="text-xs"><p>{u.telephone}</p><p className="text-muted">{u.email}</p></td>
                <td><StatusBadge status={u.statut} /></td>
                <td className="text-muted">{u.connexion}</td>
                <td className="text-right"><IconBtn label="Actions" onClick={() => toast('Modifier le rôle · Désactiver · Renvoyer l’invitation (démo)')}><MoreHorizontal /></IconBtn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function APropos() {
  return (
    <div className="space-y-5">
      <Card className="bg-navy-gradient p-6 text-white">
        <p className="text-xl font-bold">La plateforme qui connecte la formation, l’expertise, l’emploi et le financement en Afrique centrale.</p>
        <p className="mt-2 text-white/80">Formez-vous · Consultez des experts · Recrutez · Trouvez un financement</p>
      </Card>
      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Notre mission" icon={<BookOpen />}>
          <p className="text-sm text-ink/80">Rendre visible chaque établissement de qualité et aider chaque apprenant à trouver la formation qui lui ouvrira un métier.</p>
        </Section>
        <Section title="Nos valeurs" icon={<Star />}>
          <div className="flex flex-wrap gap-2">{['Professionnalisme', 'Fiabilité', 'Inclusion', 'Innovation'].map((v) => <Badge key={v} tone="blue">{v}</Badge>)}</div>
        </Section>
        <Section title="Assistance" icon={<Headphones />}>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => toast('Le support vous recontacte sous 24 h (démo)')}><Headphones /> Contacter le support</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast('Centre d’aide (démo)')}><Info /> Centre d’aide (FAQ)</Button>
          </div>
        </Section>
        <Section title="Documents utiles" icon={<FileText />}>
          <ul className="space-y-2 text-sm">
            {['Conditions générales d’utilisation', 'Conditions générales de vente', 'Politique de confidentialité'].map((d) => (
              <li key={d}><button type="button" onClick={() => toast(`${d} (démo)`)} className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-brand-50">{d}<ChevronRight className="size-4" /></button></li>
            ))}
          </ul>
        </Section>
      </div>
      <Card className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm">
        <span>Version <b>2.4.0</b> <Badge tone="green">À jour</Badge></span>
        <span className="text-muted">Dernière mise à jour : 05 nov. 2026</span>
      </Card>
    </div>
  )
}
