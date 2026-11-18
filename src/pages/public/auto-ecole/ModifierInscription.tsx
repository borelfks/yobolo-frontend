import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
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
import { AEHeader } from '@/components/domain/autoecole'
import { piecesAE, useInscriptionDraft } from '@/lib/autoecole-helpers'
import { autoEcoleById, autoEcoles, permisCatalogue, sessions, type PermisCode } from '@/mocks/autoecoles'
import { quartiers, villes } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const field = 'h-11 w-full rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[15px] text-ink outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100'
const pieceIcon: Record<string, ReactNode> = { cni: <IdCard />, photos: <Camera />, medical: <BriefcaseMedical /> }

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

export default function ModifierInscription() {
  const { id, code = 'B', section = 'infos' } = useParams()
  const a = autoEcoleById(id)
  const p = permisCatalogue[code as PermisCode] ?? permisCatalogue.B
  const [d, update] = useInscriptionDraft(a.id, p.code)
  const navigate = useNavigate()
  const base = `/ecoles/auto-ecoles/${a.id}/permis/${p.code}/inscription`
  const [form, setForm] = useState(d)
  const [newAe, setNewAe] = useState(a.id)
  const [newPermis, setNewPermis] = useState<PermisCode>(p.code)
  const [session, setSession] = useState(d.session)
  const target = permisCatalogue[newPermis]
  const titles: Record<string, [string, string, string]> = {
    infos: ['Modifier mes informations', 'Mettez à jour vos informations personnelles avant l’envoi définitif.', 'Modifier les informations'],
    formation: ['Modifier la formation choisie', 'Changez d’auto-école, de permis ou de session.', 'Modifier la formation'],
    pieces: ['Modifier les pièces fournies', 'Remplacez ou complétez vos documents.', 'Modifier les pièces'],
  }
  const [title, subtitle, crumb] = titles[section] ?? titles.infos
  const menu = [
    { key: 'infos', label: ['Informations', 'personnelles'], icon: UserRound },
    { key: 'formation', label: ['Formation choisie'], icon: GraduationCap },
    { key: 'pieces', label: ['Pièces fournies'], icon: FileText },
  ]

  const save = () => {
    if (section === 'infos') update(form)
    if (section === 'formation') {
      update({ session })
      toast.success('Formation mise à jour')
      return navigate(`/ecoles/auto-ecoles/${newAe}/permis/${newPermis}/inscription`)
    }
    toast.success('Modifications enregistrées')
    navigate(base)
  }

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <AEHeader
        id={a.id}
        crumbs={[
          { label: 'École', to: '/ecoles' },
          { label: 'Auto-Écoles', to: '/ecoles/auto-ecoles' },
          { label: a.nom, to: `/ecoles/auto-ecoles/${a.id}` },
          { label: `Permis ${p.code}`, to: `/ecoles/auto-ecoles/${a.id}/permis/${p.code}` },
          { label: 'Inscription', to: base },
          { label: crumb },
        ]}
        title={title}
        subtitle={subtitle}
        image="/maquette/ae-hero-formations.jpg"
      />
      <div className="grid gap-4 lg:grid-cols-[214px_1fr_382px]">
        <nav className="space-y-3">
          {menu.map((m) => (
            <NavLink
              key={m.key}
              to={`${base}/modifier/${m.key}`}
              className={({ isActive }) => cn('flex min-h-[64px] items-center gap-3 rounded-xl px-4 text-[15.5px] leading-tight font-semibold shadow-sm', isActive ? 'bg-brand-600 text-white' : 'bg-[#eaf0fb] text-navy-900 hover:bg-brand-100')}
            >
              <m.icon className="size-7 shrink-0" />
              <span>
                {m.label.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-4">
          <div className={cn(card, 'p-5')}>
            {section === 'formation' && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3"><Heading icon={<GraduationCap />}>Nouvelle formation</Heading></div>
                <label className="block">
                  <Label required>Auto-école</Label>
                  <IconSelect
                    icon={<Building2 />}
                    value={newAe}
                    options={autoEcoles.map((x) => ({ value: x.id, label: x.nom }))}
                    onChange={(v) => {
                      setNewAe(v)
                      const next = autoEcoleById(v)
                      if (!next.permis.includes(newPermis)) setNewPermis(next.permis[0])
                    }}
                  />
                </label>
                <label className="block">
                  <Label required>Permis (catégorie)</Label>
                  <IconSelect icon={<Car />} value={newPermis} options={autoEcoleById(newAe).permis.map((c) => ({ value: c, label: `Permis ${c} – ${permisCatalogue[c].nom}` }))} onChange={(v) => setNewPermis(v as PermisCode)} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <Label required>Lieu de formation</Label>
                    <IconSelect icon={<MapPin />} value="lieu" options={[{ value: 'lieu', label: `${autoEcoleById(newAe).ville} – ${autoEcoleById(newAe).quartier}` }]} />
                  </label>
                  <label className="block">
                    <Label required>Session souhaitée</Label>
                    <IconSelect
                      icon={<CalendarDays />}
                      value={session}
                      options={[{ value: '15 novembre 2026', label: '15 novembre 2026' }, ...sessions.filter((s) => s.permis === newPermis).map((s) => ({ value: s.debut, label: s.debut })), { value: '01 décembre 2026', label: '01 décembre 2026' }].filter((o, i, arr) => arr.findIndex((x) => x.value === o.value) === i)}
                      onChange={setSession}
                    />
                  </label>
                  <div>
                    <Label>Durée estimée</Label>
                    <p className="flex h-11 items-center gap-3 rounded-lg bg-[#eef3fc] px-4 text-[16px] text-navy-900"><Clock className="size-5 text-brand-600" />{target.duree}</p>
                  </div>
                  <div>
                    <Label>Tarif de la formation</Label>
                    <p className="flex h-11 items-center gap-3 rounded-lg bg-[#dfe8fb] px-4 text-[21px] font-extrabold text-brand-700"><Coins className="size-6 text-brand-600" />{target.prix.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                </div>
                <p className="flex items-start gap-3 rounded-xl bg-[#eef3fc] px-4 py-3 text-[14.5px] text-navy-900">
                  <Info className="mt-0.5 size-6 shrink-0 text-brand-600" />
                  La modification de la formation peut entraîner une mise à jour des pièces à fournir selon les exigences de la nouvelle formation.
                </p>
              </div>
            )}

            {section === 'infos' && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3"><Heading icon={<UserRound />}>Informations personnelles</Heading></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><Label required>Nom</Label><input className={field} placeholder="Votre nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></label>
                  <label><Label required>Prénom(s)</Label><input className={field} placeholder="Vos prénom(s)" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></label>
                  <label>
                    <Label required>Date de naissance</Label>
                    <span className="relative block">
                      <input className={field} placeholder="jj / mm / aaaa" value={form.naissance} onChange={(e) => setForm({ ...form, naissance: e.target.value })} />
                      <Calendar className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" />
                    </span>
                  </label>
                  <label><Label required>Sexe</Label><IconSelect icon={<UserRound />} value={form.sexe || 'Féminin'} options={['Féminin', 'Masculin'].map((x) => ({ value: x, label: x }))} onChange={(v) => setForm({ ...form, sexe: v })} /></label>
                  <label><Label required>Téléphone</Label><input className={field} placeholder="6 70 12 34 56" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></label>
                  <label><Label>Email</Label><input className={field} placeholder="votre@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                  <label><Label required>Ville</Label><IconSelect icon={<Building2 />} value={form.ville || 'Yaoundé'} options={villes.map((x) => ({ value: x.nom, label: x.nom }))} onChange={(v) => setForm({ ...form, ville: v })} /></label>
                  <label><Label required>Quartier</Label><IconSelect icon={<MapPin />} value={form.quartier || 'Bastos'} options={quartiers.map((x) => ({ value: x, label: x }))} onChange={(v) => setForm({ ...form, quartier: v })} /></label>
                </div>
              </div>
            )}

            {section === 'pieces' && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3"><Heading icon={<FileText />}>Mes documents</Heading></div>
                {piecesAE.map((pc) => (
                  <div key={pc.key} className="flex flex-wrap items-center gap-4 border-b border-line pb-3">
                    <span className="grid h-11 w-14 place-items-center rounded-lg bg-[#eef3fc] text-brand-600 [&_svg]:size-7">{pieceIcon[pc.key]}</span>
                    <div className="min-w-[200px] flex-1">
                      <p className="text-[15px] font-bold text-navy-900">{pc.label} <span className="text-rose-500">*</span></p>
                      <p className="text-[12.5px] text-navy-900">{pc.hint}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{pc.etat}</span>
                    <button type="button" aria-label="Voir" onClick={() => toast('Aperçu du document (démo)')} className="grid size-9 place-items-center rounded-lg text-navy-800 hover:bg-slate-100"><Eye className="size-5" /></button>
                    <button type="button" onClick={() => { update({ pieces: { ...d.pieces, [pc.key]: true } }); toast.success('Fichier remplacé') }} className="inline-flex h-9 items-center gap-2 rounded-lg border-2 border-[#9fb4e3] px-3 text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                      <RefreshCw className="size-4" />
                      Remplacer
                    </button>
                  </div>
                ))}
                {(p.code === 'C' || p.code === 'D' || p.code === 'E') && (
                  <div className="flex flex-wrap items-center gap-4 border-b border-line pb-3">
                    <span className="grid h-11 w-14 place-items-center rounded-lg bg-[#eef3fc] text-brand-600"><Car className="size-7" /></span>
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-navy-900">Permis préalable (si requis pour cette catégorie)</p>
                      <p className="text-[12.5px] text-navy-900">Copie du Permis B</p>
                    </div>
                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-[13px] font-semibold text-slate-600">Non fourni</span>
                    <button type="button" onClick={() => toast.success('Permis B ajouté')} className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-600 px-3 text-[14px] font-semibold text-white"><Plus className="size-4" />Ajouter</button>
                  </div>
                )}
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#9fb4e3] bg-[#f3f7fe] py-5 text-center">
                  <CloudUpload className="size-8 text-brand-600" />
                  <span className="text-[15px] font-bold text-navy-900">Ajouter un autre document (facultatif)</span>
                  <span className="text-[13px] text-navy-900">PDF, JPG ou PNG — 5 Mo max</span>
                  <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && toast.success(`${e.target.files[0].name} ajouté`)} />
                </label>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => navigate(base)} className="inline-flex h-12 w-40 items-center justify-center gap-2.5 rounded-xl border-2 border-[#c9d4ea] bg-white text-[17px] font-semibold text-navy-900 hover:bg-slate-50">
              <ArrowLeft className="size-5" />
              Annuler
            </button>
            <button type="button" onClick={save} className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 px-10 text-[17px] font-semibold text-white hover:bg-brand-700">
              <Check className="size-6" strokeWidth={3} />
              Enregistrer les modifications
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className={cn(card, 'p-4')}>
            <Heading icon={section === 'infos' ? <FileText /> : <RefreshCw />}>{section === 'formation' ? 'Formation actuelle' : section === 'infos' ? 'Mon inscription' : 'Rappel de ma formation'}</Heading>
            <dl className="mt-2 divide-y divide-line text-[15px] text-navy-900">
              {[
                { icon: <Building2 />, k: 'Auto-école :', v: a.nom },
                { icon: <Car />, k: 'Permis :', v: `Permis ${p.code} – ${p.nom}` },
                { icon: <CalendarDays />, k: 'Session :', v: d.session },
                { icon: <Coins />, k: 'Tarif :', v: <b className="text-[20px] text-brand-700">{p.prix.toLocaleString('fr-FR')} FCFA</b> },
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
            <div className="bg-[#eef3fc] px-4 py-3"><Heading icon={<BadgeCheck />}>{section === 'formation' ? 'Vos avantages' : section === 'infos' ? 'À noter' : 'Bon à savoir'}</Heading></div>
            <div className="px-4 pb-4">
              <Checks
                items={
                  section === 'formation'
                    ? ['Modifier votre formation en quelques clics.', 'Conserver vos informations et pièces déjà transmises.', 'Recevoir une confirmation de mise à jour dans votre espace YIBOLO.']
                    : section === 'infos'
                      ? ['Vos informations restent modifiables jusqu’à l’envoi définitif.', 'L’auto-école reçoit toujours la dernière version.', 'Vous êtes prévenu de chaque mise à jour.']
                      : ['Documents lisibles et en cours de validité.', 'Formats acceptés : PDF, JPG, PNG.', 'Taille maximale : 5 Mo par fichier.']
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
