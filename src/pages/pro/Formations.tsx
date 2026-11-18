import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { ArrowUpDown, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Clock, FileText, GraduationCap, Layers, MoreHorizontal, Pencil, Plus, Search, Tag } from 'lucide-react'
import { ProHeader } from '@/components/domain/pro'
import { useMonEcole } from '@/hooks/useSession'
import { formationsPro } from '@/mocks/pro'
import { cn } from '@/lib/utils'

const chip: Record<string, string> = {
  blue: 'bg-[#e3ecff] text-brand-700',
  violet: 'bg-[#efe6ff] text-violet-700',
  sky: 'bg-[#e3f0ff] text-brand-700',
  green: 'bg-[#e1f6e8] text-emerald-700',
  pink: 'bg-pink-50 text-pink-700',
  orange: 'bg-orange-50 text-orange-700',
}

function Statut({ s }: { s: string }) {
  if (s === 'Publiée') return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />Publiée</span>
  if (s === 'En attente') return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[13px] font-semibold text-amber-700"><Clock className="size-4" />En attente</span>
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[13px] font-semibold text-slate-700"><FileText className="size-4" />Brouillon</span>
}

function FilterSelect({ icon, label, options, value, onChange }: { icon: React.ReactNode; label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative flex h-11 flex-1 items-center gap-2.5 rounded-full border border-[#c9d4ea] bg-white px-4 text-[14.5px] text-navy-900">
      <span className="text-navy-800 [&_svg]:size-5">{icon}</span>
      <span className="flex-1 truncate">{label} : {value || (label === 'Statut' ? 'Tous' : 'Toutes')}</span>
      <ChevronDown className="size-5" />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">{label === 'Statut' ? 'Tous' : 'Toutes'}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}

export default function Formations() {
  const { ecole, formations } = useMonEcole()
  const base =
    ecole.id === 'ipc'
      ? [...formationsPro]
      : formations.map((f) => ({ id: f.id, nom: f.nom, code: f.code, filiere: f.filiere, ton: 'blue', diplome: f.diplome, duree: `${f.dureeMois} mois`, rentree: f.rentree, statut: f.statut }))
  const [q, setQ] = useState('')
  const [filiere, setFiliere] = useState('')
  const [statut, setStatut] = useState('')
  const [page, setPage] = useState(1)
  const [checked, setChecked] = useState<string[]>([])
  const filtered = base.filter((f) => f.nom.toLowerCase().includes(q.toLowerCase()) && (!filiere || f.filiere === filiere) && (!statut || f.statut === statut))
  const pages = Math.max(1, Math.ceil(filtered.length / 5))
  const list = filtered.slice((page - 1) * 5, page * 5)
  const count = (s: string) => base.filter((f) => f.statut === s).length
  const kpis = [
    { n: base.length, l: 'Formations', icon: <GraduationCap />, c: 'bg-[#e8f0ff]', ic: 'bg-[#d6e3ff] text-brand-600' },
    { n: count('Publiée'), l: 'Publiées', icon: <CircleCheck />, c: 'bg-[#e5f7ea]', ic: 'bg-[#cdeed8] text-emerald-600', t: 'text-emerald-700' },
    { n: count('En attente'), l: 'En attente', icon: <Clock />, c: 'bg-[#fff4dd]', ic: 'bg-[#ffe7b8] text-amber-600', t: 'text-amber-700' },
    { n: count('Brouillon'), l: 'Brouillon', icon: <FileText />, c: 'bg-[#f1ebff]', ic: 'bg-[#e1d4ff] text-violet-600' },
  ]
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: 'Formations', to: '/pro/ecole/formations' }, { label: 'Gérer les formations' }]}
        icon={<GraduationCap />}
        title="Gérer les formations"
        subtitle="Consultez, modifiez et suivez toutes les formations de votre établissement."
        actions={
          <Link to="/pro/ecole/formations/nouvelle" className="inline-flex h-12 items-center gap-2.5 rounded-full bg-brand-600 px-8 text-[18px] font-semibold text-white hover:bg-brand-700">
            <Plus className="size-6" />
            Créer une formation
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className={cn('flex items-center gap-4 rounded-2xl px-5 py-4 shadow-sm', k.c)}>
            <span className={cn('grid size-14 place-items-center rounded-full [&_svg]:size-8', k.ic)}>{k.icon}</span>
            <p className="leading-tight">
              <b className="block text-[30px] text-navy-900">{k.n}</b>
              <span className={cn('text-[17px] text-navy-900', k.t)}>{k.l}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-[1.25fr_0.9fr_1fr_0.95fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Rechercher une formation..." className="h-11 w-full rounded-full border border-[#c9d4ea] bg-white pr-4 pl-11 text-[14.5px] outline-none focus:ring-3 focus:ring-brand-100" />
        </label>
        <FilterSelect icon={<Layers />} label="Filière" options={[...new Set(base.map((f) => f.filiere))]} value={filiere} onChange={(v) => { setFiliere(v); setPage(1) }} />
        <FilterSelect icon={<Tag />} label="Statut" options={['Publiée', 'En attente', 'Brouillon']} value={statut} onChange={(v) => { setStatut(v); setPage(1) }} />
        <label className="relative flex h-11 items-center gap-2.5 rounded-full border border-[#c9d4ea] bg-white px-4 text-[14.5px] text-navy-900">
          <ArrowUpDown className="size-5" />
          <span className="flex-1 truncate whitespace-nowrap text-[14px]">Trier par : Plus récente</span>
          <ChevronDown className="size-5" />
        </label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[14.5px] text-navy-900">
            <thead>
              <tr className="bg-[#eef3fc] text-left text-[15px] font-bold">
                <th className="w-14 py-3 pl-5"><input type="checkbox" aria-label="Tout sélectionner" className="size-[18px] accent-brand-600" checked={list.length > 0 && list.every((f) => checked.includes(f.id))} onChange={(e) => setChecked(e.target.checked ? list.map((f) => f.id) : [])} /></th>
                <th>Formation</th>
                <th>Filière</th>
                <th className="text-center">Diplôme</th>
                <th>Durée</th>
                <th>Prochaine rentrée</th>
                <th>Statut</th>
                <th className="pr-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id} className="border-t border-line">
                  <td className="py-2.5 pl-5"><input type="checkbox" aria-label={`Sélectionner ${f.nom}`} className="size-[18px] accent-brand-600" checked={checked.includes(f.id)} onChange={(e) => setChecked(e.target.checked ? [...checked, f.id] : checked.filter((x) => x !== f.id))} /></td>
                  <td>
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-[#eef3fc] text-brand-600"><GraduationCap className="size-6" /></span>
                      <span className="leading-tight">
                        <Link to={`/pro/ecole/formations/${f.id}/modifier`} className="block font-bold text-navy-800 hover:text-brand-600">{f.nom}</Link>
                        <span className="text-[13px]">Code : {f.code}</span>
                      </span>
                    </span>
                  </td>
                  <td><span className={cn('rounded-full px-3.5 py-1 text-[13.5px]', chip[f.ton] ?? chip.blue)}>{f.filiere}</span></td>
                  <td className="text-center">{f.diplome}</td>
                  <td>{f.duree}</td>
                  <td>{f.rentree === '—' ? <span className="pl-2">—</span> : <span className="inline-flex items-center gap-2"><CalendarDays className="size-5 text-brand-600" />{f.rentree}</span>}</td>
                  <td><Statut s={f.statut} /></td>
                  <td className="pr-5">
                    <div className="flex justify-center gap-2">
                      <Link to={`/pro/ecole/formations/${f.id}/modifier`} aria-label="Modifier" className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800 hover:bg-brand-100"><Pencil className="size-4" /></Link>
                      <button type="button" aria-label="Plus d'actions" onClick={() => toast('Dupliquer · Archiver · Voir la page publique (démo)')} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800 hover:bg-brand-100"><MoreHorizontal className="size-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[15px] text-navy-900">{list.length} sur {filtered.length} formations</span>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Page précédente" onClick={() => setPage(Math.max(1, page - 1))} className="grid size-10 place-items-center rounded-lg border border-line bg-white"><ChevronLeft className="size-5" /></button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)} className={cn('grid size-10 place-items-center rounded-lg text-[15px] font-semibold', p === page ? 'bg-brand-600 text-white' : 'border border-line bg-white text-navy-900')}>{p}</button>
          ))}
          <button type="button" aria-label="Page suivante" onClick={() => setPage(Math.min(pages, page + 1))} className="grid size-10 place-items-center rounded-lg border border-line bg-white"><ChevronRight className="size-5" /></button>
        </div>
      </div>
    </div>
  )
}
