import { useState } from 'react'
import { Lien } from '@/shared/ui/Lien'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays, ChartNoAxesColumn, ChevronDown, Clock, Download, FileText, GraduationCap, Layers, Star, TrendingUp, Users } from 'lucide-react'
import { ProHeader } from '@/modules/ecole/espace-pro/components/ProBlocks'
import { proCard } from '@/modules/ecole/espace-pro/proStyles'
import { AreaTrend, Donut } from '@/shared/ui/Charts'
import { PasEncoreDAvis } from '@/shared/ui/StarRating'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { useStatistiques } from '@/data/hooks'
import type { ProvenanceVisite } from '@/shared/types'
import { num, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Les périodes proposées (en jours). */
const PERIODES = [
  { jours: 30, cle: 'last30' },
  { jours: 7, cle: 'last7' },
  { jours: 180, cle: 'last6m' },
] as const

/** Couleur de chaque provenance dans l'anneau (jetons du thème et palette de sens). */
const COULEURS: Record<ProvenanceVisite, string> = {
  annuaire: 'var(--color-brand-600)',
  recherche: 'var(--color-emerald-500)',
  favoris: 'var(--color-rose-500)',
  accueil: 'var(--color-violet-500)',
  direct: 'var(--color-amber-400)',
}

/** Apparence de chaque type d'activité. */
const ACTIVITE_ICONES = { downloads: <Download className="text-violet-600" />, reviews: <Star className="text-brand-600" /> }
const ACTIVITE_FONDS = { downloads: 'bg-[#f1ebff]', reviews: 'bg-[#e8f0ff]' }

/**
 * « Statistiques » : tout est mesuré sur les pages publiques de
 * l'établissement (décision du 2026-11-25 : pas de fausses stats) — vues de
 * sa fiche et leur provenance, vues de ses formations, téléchargements de ses
 * documents, avis reçus. La période choisie s'applique à tout.
 */
export function Statistiques() {
  const { t } = useTranslation('pro')
  const { ecole, formations } = useMonEcole()
  const [jours, setJours] = useState<number>(30)
  // L'instant de référence, fixé à l'ouverture de la page.
  const [maintenant] = useState(() => Date.now())
  const stats = useStatistiques(ecole.id, jours, maintenant)
  const periode = PERIODES.find((p) => p.jours === jours) ?? PERIODES[0]
  const totalSources = stats.sources.reduce((s, x) => s + x.value, 0)
  const top = formations
    .map((f) => ({ id: f.id, nom: f.nom, vues: stats.vuesFormations[f.id] ?? 0 }))
    .filter((f) => f.vues > 0)
    .sort((a, b) => b.vues - a.vues)
    .slice(0, 3)
  const tendance = (x: number | null) => (x === null ? undefined : x)

  const kpis = [
    { v: num(stats.vues.valeur), l: t('stats.kpis.views'), tendance: tendance(stats.vues.tendance), icon: <Users />, c: 'bg-[#e8f0ff]', ic: 'bg-[#d6e3ff] text-brand-600' },
    { v: num(stats.telechargements.valeur), l: t('stats.kpis.downloads'), tendance: tendance(stats.telechargements.tendance), icon: <FileText />, c: 'bg-[#fff4dd]', ic: 'bg-[#ffe7b8] text-amber-600' },
    {
      v: ecole.avis > 0 ? t('stats.kpis.outOf5', { note: num(ecole.note) }) : <PasEncoreDAvis className="text-[17px]" />,
      l: t('stats.kpis.rating', { count: ecole.avis }),
      tendance: undefined,
      icon: <Star />,
      c: 'bg-[#f1ebff]',
      ic: 'bg-[#e1d4ff] text-violet-600',
    },
  ]
  const vide = (texte: string) => <p className="mt-3 rounded-xl bg-page px-4 py-3 text-[14.5px] text-muted-foreground">{texte}</p>

  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('stats.crumb'), to: ROUTES.pro.profile() }, { label: t('stats.title') }]}
        icon={<ChartNoAxesColumn />}
        title={t('stats.title')}
        subtitle={t('stats.subtitle')}
        actions={
          <div className="flex flex-wrap gap-3">
            <label className="relative flex h-11 w-56 items-center gap-2.5 rounded-full border-2 border-brand-600/50 bg-white px-4 text-[15px] text-navy-900">
              <CalendarDays className="size-5 text-brand-600" />
              <span className="flex-1">{t(`stats.period.${periode.cle}`)}</span>
              <ChevronDown className="size-5" />
              <select aria-label={t('stats.period.label')} value={jours} onChange={(e) => setJours(Number(e.target.value))} className="absolute inset-0 cursor-pointer opacity-0">
                {PERIODES.map((p) => (
                  <option key={p.jours} value={p.jours}>
                    {t(`stats.period.${p.cle}`)}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2.5 rounded-full border-2 border-brand-600/70 bg-white px-6 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
              <Download className="size-5" />
              {t('stats.export')}
            </button>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.l} className={cn('flex items-center gap-4 rounded-2xl px-4 py-3.5 shadow-sm', k.c)}>
            <span className={cn('grid size-14 shrink-0 place-items-center rounded-full [&_svg]:size-8', k.ic)}>{k.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between gap-2">
                <b className="text-[28px] leading-none text-navy-900">{k.v}</b>
                {k.tendance !== undefined && (
                  <span className={cn('inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12.5px] font-bold', k.tendance >= 0 ? 'bg-[#d4f2de] text-emerald-700' : 'bg-rose-100 text-rose-700')}>
                    {k.tendance >= 0 ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
                    {t('stats.kpis.trend', { value: Math.abs(k.tendance) })}
                  </span>
                )}
              </p>
              <p className="mt-1 truncate text-[14.5px] text-navy-900">{k.l}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><TrendingUp className="size-6 text-brand-600" />{t('stats.visits')}</h2>
          {stats.vues.valeur === 0 ? (
            vide(t('stats.empty.visits'))
          ) : (
            <AreaTrend data={stats.serie.map((p) => ({ label: shortDate(new Date(p.le), { day: '2-digit', month: 'short' }), value: p.value }))} height={200} dots={jours <= 31} />
          )}
        </div>
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><Layers className="size-6 text-brand-600" />{t('stats.sources.title')}</h2>
          {totalSources === 0 ? (
            vide(t('stats.empty.sources'))
          ) : (
            <div className="mt-3">
              <Donut
                data={stats.sources.map((s) => ({ name: t(`stats.sources.${s.id}`), value: Math.round((s.value / totalSources) * 100), color: COULEURS[s.id] }))}
                center={t('stats.sources.center', { total: num(totalSources) })}
                size={170}
              />
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><GraduationCap className="size-6 text-brand-600" />{t('stats.top.title')}</h2>
          {top.length === 0 ? (
            vide(t('stats.empty.top'))
          ) : (
            <ol className="mt-3 divide-y divide-line">
              {top.map((f, i) => (
                <li key={f.id} className="flex items-center gap-4 py-2.5 text-[15px] text-navy-900">
                  <span className="grid size-7 place-items-center rounded-full bg-navy-800 text-[13px] font-bold text-white">{i + 1}</span>
                  <span className="flex-1 font-semibold">{f.nom}</span>
                  <span>{t('stats.top.views', { count: f.vues, views: num(f.vues) })}</span>
                </li>
              ))}
            </ol>
          )}
          <Lien to={ROUTES.pro.trainings} className="mt-2 flex items-center justify-center gap-2 text-[15px] font-semibold text-brand-600">
            {t('stats.top.all')} <ArrowRight className="size-5" />
          </Lien>
        </div>
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><Clock className="size-6 text-brand-600" />{t('stats.activity.title')}</h2>
          {stats.activites.length === 0 ? (
            vide(t('stats.empty.activity'))
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {stats.activites.map((a) => (
                <li key={`${a.id}-${a.jour}`} className="flex items-center gap-3 py-2.5 text-[15px] text-navy-900">
                  <span className={cn('grid size-10 place-items-center rounded-full [&_svg]:size-5', ACTIVITE_FONDS[a.id])}>{ACTIVITE_ICONES[a.id]}</span>
                  <span className="flex-1 font-semibold">{t(`stats.activity.${a.id}`, { count: a.count, note: num(ecole.note) })}</span>
                  <span className="text-[13.5px]">{t(`stats.activity.${a.jour}`, { time: a.heure })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
