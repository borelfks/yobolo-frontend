import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Lien } from '@/shared/ui/Lien'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { ArrowUpDown, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Copy, ExternalLink, EyeOff, FileText, GraduationCap, Layers, Pencil, Plus, Search, Send, Tag, Trash2 } from 'lucide-react'
import { ProHeader } from '@/modules/ecole/espace-pro/components/ProBlocks'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { useFormations, useFormationsPro } from '@/data/hooks'
import { data, newId } from '@/data'
import { formationUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { shortDate } from '@/shared/utils/format'
import { PREFIXE_FORMATION_CREEE } from '@/modules/ecole/espace-pro/proData'
import type { StatutPublication } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'
import { MenuActions } from '@/shared/ui/MenuActions'

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

const chip: Record<string, string> = {
  blue: 'bg-[#e3ecff] text-brand-700',
  violet: 'bg-[#efe6ff] text-violet-700',
  sky: 'bg-[#e3f0ff] text-brand-700',
  green: 'bg-[#e1f6e8] text-emerald-700',
  pink: 'bg-pink-50 text-pink-700',
  orange: 'bg-orange-50 text-orange-700',
}

/** Statut d'une formation (valeur des données) → clé de traduction. */
const statusKey = (s: string) => (s === 'Publiée' ? 'published' : 'draft')

/** « 24 mois » (valeur des données) → durée traduite ; toute autre valeur reste telle quelle. */
function useDuration() {
  const { t } = useTranslation('pro')
  return (d: string) => {
    const m = /^(\d+) mois$/.exec(d)
    return m ? t('duration', { count: Number(m[1]) }) : d
  }
}

function Statut({ s }: { s: string }) {
  const { t } = useTranslation('pro')
  const label = t(`status.${statusKey(s)}`)
  if (s === 'Publiée') return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{label}</span>
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[13px] font-semibold text-slate-700"><FileText className="size-4" />{label}</span>
}

function FilterSelect({ icon, label, allLabel, options, value, onChange }: { icon: React.ReactNode; label: string; allLabel: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation('pro')
  return (
    <label className="relative flex h-11 flex-1 items-center gap-2.5 rounded-full border border-[#c9d4ea] bg-white px-4 text-[14.5px] text-navy-900">
      <span className="text-navy-800 [&_svg]:size-5">{icon}</span>
      <span className="flex-1 truncate">{t('formations.filters.value', { label, value: options.find((o) => o.value === value)?.label ?? (value || allLabel) })}</span>
      <ChevronDown className="size-5" />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">{allLabel}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

export function Formations() {
  const { t } = useTranslation('pro')
  const duration = useDuration()
  const { ecole, formations } = useMonEcole()
  const lignes = useFormationsPro(ecole.id)
  // Les lignes du tableau de l'établissement (formationsPro), puis ses fiches de formation qui n'ont pas encore de ligne.
  const propres = lignes.filter((f) => f.etablissementId === ecole.id)
  const base = [
    ...propres,
    ...formations
      .filter((f) => !propres.some((p) => p.id === f.id))
      .map((f) => ({ id: f.id, nom: f.nom, code: f.code, filiere: f.filiere, ton: 'blue', diplome: f.diplome, duree: `${f.dureeMois} mois`, rentree: f.rentree, dateLimite: f.dateLimite, statut: f.statut })),
  ]
  const navigate = useNavigate()
  const toutes = useFormations()
  type Ligne = (typeof base)[number]
  // Une ligne vient du tableau (formationsPro), d'une fiche (formations), ou des deux : on met à jour ce qui existe.
  const enregistree = (id: string) => lignes.some((l) => l.id === id)
  const fiche = (id: string) => toutes.find((x) => x.id === id)
  const changerStatut = async (f: Ligne, statut: StatutPublication) => {
    if (enregistree(f.id)) await data.update('formationsPro', f.id, { statut })
    const source = fiche(f.id)
    // Publiée pour la première fois : elle prend place dans le fil de l'accueil à cette date.
    if (source) await data.update('formations', f.id, statut === 'Publiée' && !source.publieeLe ? { statut, publieeLe: maintenant() } : { statut })
    toast.success(t(statut === 'Brouillon' ? 'formations.menu.unpublished' : 'formations.menu.published', { name: f.nom }))
  }
  const dupliquer = async (f: Ligne) => {
    const id = newId(PREFIXE_FORMATION_CREEE)
    const nom = `${f.nom}${t('formations.menu.copySuffix')}`
    const source = fiche(f.id)
    if (source) await data.create('formations', { ...source, id, nom, etablissementId: ecole.id, statut: 'Brouillon', publieeLe: undefined })
    await data.create('formationsPro', { id, etablissementId: ecole.id, nom, code: f.code, filiere: f.filiere, ton: f.ton, diplome: f.diplome, duree: f.duree, rentree: f.rentree, statut: 'Brouillon' })
    toast.success(t('formations.menu.duplicated', { name: nom }))
  }
  const supprimer = async (f: Ligne) => {
    if (enregistree(f.id)) await data.remove('formationsPro', f.id)
    if (fiche(f.id)) await data.remove('formations', f.id)
    // Elle quitte aussi les favoris.
    if ((await data.list('favoris')).some((x) => x.id === f.id)) await data.remove('favoris', f.id)
    toast.success(t('formations.menu.deleted', { name: f.nom }))
  }
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
    { n: base.length, l: t('formations.kpis.total'), icon: <GraduationCap />, c: 'bg-[#e8f0ff]', ic: 'bg-[#d6e3ff] text-brand-600' },
    { n: count('Publiée'), l: t('formations.kpis.published'), icon: <CircleCheck />, c: 'bg-[#e5f7ea]', ic: 'bg-[#cdeed8] text-emerald-600', t: 'text-emerald-700' },
    { n: count('Brouillon'), l: t('formations.kpis.draft'), icon: <FileText />, c: 'bg-[#f1ebff]', ic: 'bg-[#e1d4ff] text-violet-600' },
  ]
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('formations.crumb'), to: ROUTES.pro.trainings }, { label: t('formations.title') }]}
        icon={<GraduationCap />}
        title={t('formations.title')}
        subtitle={t('formations.subtitle')}
        actions={
          <Lien to={ROUTES.pro.newTraining} className="inline-flex h-12 items-center gap-2.5 rounded-full bg-brand-600 px-8 text-[18px] font-semibold text-white hover:bg-brand-700">
            <Plus className="size-6" />
            {t('formations.create')}
          </Lien>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
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
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder={t('formations.search')} className="h-11 w-full rounded-full border border-[#c9d4ea] bg-white pr-4 pl-11 text-[14.5px] outline-none focus:ring-3 focus:ring-brand-100" />
        </label>
        <FilterSelect icon={<Layers />} label={t('formations.filters.field')} allLabel={t('formations.filters.allFem')} options={[...new Set(base.map((f) => f.filiere))].map((o) => ({ value: o, label: o }))} value={filiere} onChange={(v) => { setFiliere(v); setPage(1) }} />
        <FilterSelect icon={<Tag />} label={t('formations.filters.status')} allLabel={t('formations.filters.allMasc')} options={['Publiée', 'Brouillon'].map((o) => ({ value: o, label: t(`status.${statusKey(o)}`) }))} value={statut} onChange={(v) => { setStatut(v); setPage(1) }} />
        <label className="relative flex h-11 items-center gap-2.5 rounded-full border border-[#c9d4ea] bg-white px-4 text-[14.5px] text-navy-900">
          <ArrowUpDown className="size-5" />
          <span className="flex-1 truncate whitespace-nowrap text-[14px]">{t('formations.filters.sort')}</span>
          <ChevronDown className="size-5" />
        </label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-[14.5px] text-navy-900">
            <thead>
              <tr className="bg-[#eef3fc] text-left text-[15px] font-bold">
                <th className="w-14 py-3 pl-5"><input type="checkbox" aria-label={t('formations.table.selectAll')} className="size-[18px] accent-brand-600" checked={list.length > 0 && list.every((f) => checked.includes(f.id))} onChange={(e) => setChecked(e.target.checked ? list.map((f) => f.id) : [])} /></th>
                <th>{t('formations.table.training')}</th>
                <th>{t('formations.table.field')}</th>
                <th className="text-center">{t('formations.table.diploma')}</th>
                <th>{t('formations.table.duration')}</th>
                <th>{t('formations.table.nextIntake')}</th>
                <th>{t('formations.table.status')}</th>
                <th className="pr-5 text-center">{t('formations.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id} className="border-t border-line">
                  <td className="py-2.5 pl-5"><input type="checkbox" aria-label={t('formations.table.select', { name: f.nom })} className="size-[18px] accent-brand-600" checked={checked.includes(f.id)} onChange={(e) => setChecked(e.target.checked ? [...checked, f.id] : checked.filter((x) => x !== f.id))} /></td>
                  <td>
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-[#eef3fc] text-brand-600"><GraduationCap className="size-6" /></span>
                      <span className="leading-tight">
                        <Lien to={ROUTES.pro.editTraining(f.id)} className="block font-bold text-navy-800 hover:text-brand-600">{f.nom}</Lien>
                        <span className="text-[13px]">{t('formations.table.code', { code: f.code })}</span>
                      </span>
                    </span>
                  </td>
                  <td><span className={cn('rounded-full px-3.5 py-1 text-[13.5px] whitespace-nowrap', chip[f.ton] ?? chip.blue)}>{f.filiere}</span></td>
                  <td className="text-center">{f.diplome}</td>
                  <td>{duration(f.duree)}</td>
                  <td>{f.dateLimite ? <span className="inline-flex items-center gap-2 whitespace-nowrap"><CalendarDays className="size-5 text-brand-600" />{shortDate(f.dateLimite, { day: '2-digit', month: 'short', year: 'numeric' })}</span> : f.rentree === '—' ? <span className="pl-2">—</span> : <span className="inline-flex items-center gap-2"><CalendarDays className="size-5 text-brand-600" />{f.rentree}</span>}</td>
                  <td><Statut s={f.statut} /></td>
                  <td className="pr-5">
                    <div className="flex justify-center gap-2">
                      <Lien to={ROUTES.pro.editTraining(f.id)} aria-label={t('formations.table.edit')} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800 hover:bg-brand-100"><Pencil className="size-4" /></Lien>
                      <MenuActions
                        label={t('formations.table.more')}
                        actions={[
                          { label: t('formations.menu.view'), icon: <ExternalLink />, hidden: !formations.some((x) => x.id === f.id), onClick: () => navigate({ href: formationUrl(formations.find((x) => x.id === f.id)!) }) },
                          { label: t('formations.menu.duplicate'), icon: <Copy />, onClick: () => dupliquer(f) },
                          f.statut === 'Brouillon'
                            ? { label: t('formations.menu.publish'), icon: <Send />, onClick: () => changerStatut(f, 'Publiée') }
                            : { label: t('formations.menu.unpublish'), icon: <EyeOff />, onClick: () => changerStatut(f, 'Brouillon') },
                          { label: t('formations.menu.delete'), icon: <Trash2 />, danger: true, onClick: () => supprimer(f) },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[15px] text-navy-900">{t('formations.count', { shown: list.length, total: filtered.length })}</span>
        <div className="flex items-center gap-2">
          <button type="button" aria-label={t('formations.prev')} onClick={() => setPage(Math.max(1, page - 1))} className="grid size-10 place-items-center rounded-lg border border-line bg-white"><ChevronLeft className="size-5" /></button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)} className={cn('grid size-10 place-items-center rounded-lg text-[15px] font-semibold', p === page ? 'bg-brand-600 text-white' : 'border border-line bg-white text-navy-900')}>{p}</button>
          ))}
          <button type="button" aria-label={t('formations.next')} onClick={() => setPage(Math.min(pages, page + 1))} className="grid size-10 place-items-center rounded-lg border border-line bg-white"><ChevronRight className="size-5" /></button>
        </div>
      </div>
    </div>
  )
}
