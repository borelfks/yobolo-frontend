import { Link } from 'react-router'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowUp, CalendarDays, ChartNoAxesColumn, ChevronDown, Clock, Download, FileText, GraduationCap, Layers, Star, TrendingUp, UserRound, Users } from 'lucide-react'
import { ProHeader } from '@/features/pro/components/ProBlocks'
import { proCard } from '@/features/pro/proStyles'
import { AreaTrend, Donut } from '@/shared/components/ui/Charts'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { sourcesVisites, visitesSerie } from '@/mocks/pro'
import { POUR_TOUS } from '@/data'
import { useFormationsPro } from '@/data/hooks'
import { PREFIXE_FORMATION_CREEE } from '@/features/pro/proData'
import { num, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Sources des visites (noms fixes des données) → clé de traduction. */
const SOURCE_KEYS = { 'Recherche YIBOLO': 'search', 'Lien direct': 'direct', 'Réseaux sociaux': 'social', Autres: 'others' } as const
const isSource = (name: string): name is keyof typeof SOURCE_KEYS => name in SOURCE_KEYS

/** Mois abrégés des libellés du graphique (« 10 oct. ») : la date est réécrite dans la langue choisie. */
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
function chartLabel(label: string) {
  const [day, month] = label.split(' ')
  const i = MONTHS.indexOf(month ?? '')
  return i < 0 ? label : shortDate(new Date(2026, i, Number(day)), { day: '2-digit', month: 'short' })
}

export function Statistiques() {
  const { t } = useTranslation('pro')
  const { ecole, formations } = useMonEcole()
  // Classement de la maquette : les formations de départ (une formation créée n'a pas encore de vues).
  const lignesMaquette = useFormationsPro(ecole.id).filter((f) => f.etablissementId === POUR_TOUS)
  const formationsMaquette = formations.filter((f) => !f.id.startsWith(`${PREFIXE_FORMATION_CREEE}-`))
  const top = ecole.id === 'ipc' ? lignesMaquette.slice(0, 3).map((f) => f.nom) : formationsMaquette.slice(0, 3).map((f) => f.nom)
  const kpis = [
    { v: num(4286), l: t('stats.kpis.views'), t: t('stats.kpis.trend', { value: 18 }), icon: <Users />, c: 'bg-[#e8f0ff]', ic: 'bg-[#d6e3ff] text-brand-600' },
    { v: num(356), l: t('stats.kpis.applications'), t: t('stats.kpis.trend', { value: 24 }), icon: <GraduationCap />, c: 'bg-[#e5f7ea]', ic: 'bg-[#cdeed8] text-emerald-600' },
    { v: num(76), l: t('stats.kpis.downloads'), t: t('stats.kpis.trend', { value: 12 }), icon: <FileText />, c: 'bg-[#fff4dd]', ic: 'bg-[#ffe7b8] text-amber-600' },
    { v: t('stats.kpis.outOf5', { note: num(ecole.note) }), l: t('stats.kpis.rating', { count: ecole.avis }), icon: <Star />, c: 'bg-[#f1ebff]', ic: 'bg-[#e1d4ff] text-violet-600' },
  ]
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('stats.crumb'), to: ROUTES.pro.profile() }, { label: t('stats.title') }]}
        icon={<ChartNoAxesColumn />}
        title={t('stats.title')}
        subtitle={t('stats.subtitle')}
        actions={
          <div className="flex gap-3">
            <label className="relative flex h-11 w-56 items-center gap-2.5 rounded-full border-2 border-brand-600/50 bg-white px-4 text-[15px] text-navy-900">
              <CalendarDays className="size-5 text-brand-600" />
              <span className="flex-1">{t('stats.period.last30')}</span>
              <ChevronDown className="size-5" />
              <select aria-label={t('stats.period.label')} className="absolute inset-0 cursor-pointer opacity-0">
                <option>{t('stats.period.last30')}</option>
                <option>{t('stats.period.last7')}</option>
                <option>{t('stats.period.last6m')}</option>
              </select>
            </label>
            <button type="button" onClick={() => toast.success(t('stats.exportToast'))} className="inline-flex h-11 items-center gap-2.5 rounded-full border-2 border-brand-600/70 bg-white px-6 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
              <Download className="size-5" />
              {t('stats.export')}
            </button>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className={cn('flex items-center gap-4 rounded-2xl px-4 py-3.5 shadow-sm', k.c)}>
            <span className={cn('grid size-14 shrink-0 place-items-center rounded-full [&_svg]:size-8', k.ic)}>{k.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between gap-2">
                <b className="text-[28px] leading-none text-navy-900">{k.v}</b>
                {k.t && <span className="inline-flex items-center gap-0.5 rounded-full bg-[#d4f2de] px-2 py-0.5 text-[12.5px] font-bold text-emerald-700"><ArrowUp className="size-3.5" />{k.t}</span>}
              </p>
              <p className="mt-1 truncate text-[14.5px] text-navy-900">{k.l}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><TrendingUp className="size-6 text-brand-600" />{t('stats.visits')}</h2>
          <AreaTrend data={visitesSerie.map((p) => ({ ...p, label: chartLabel(p.label) }))} height={200} dots />
        </div>
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><Layers className="size-6 text-brand-600" />{t('stats.sources.title')}</h2>
          <div className="mt-3">
            <Donut data={sourcesVisites.map((d) => ({ ...d, name: isSource(d.name) ? t(`stats.sources.${SOURCE_KEYS[d.name]}`) : d.name }))} center={t('stats.sources.center', { total: num(4286) })} size={170} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><GraduationCap className="size-6 text-brand-600" />{t('stats.top.title')}</h2>
          <ol className="mt-3 divide-y divide-line">
            {top.map((nom, i) => (
              <li key={nom} className="flex items-center gap-4 py-2.5 text-[15px] text-navy-900">
                <span className="grid size-7 place-items-center rounded-full bg-navy-800 text-[13px] font-bold text-white">{i + 1}</span>
                <span className="flex-1 font-semibold">{nom}</span>
                <span>{t('stats.top.views', { count: [1028, 842, 618][i], views: num([1028, 842, 618][i] ?? 0) })}</span>
              </li>
            ))}
          </ol>
          <Link to={ROUTES.pro.trainings} className="mt-2 flex items-center justify-center gap-2 text-[15px] font-semibold text-brand-600">
            {t('stats.top.all')} <ArrowRight className="size-5" />
          </Link>
        </div>
        <div className={cn(proCard, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><Clock className="size-6 text-brand-600" />{t('stats.activity.title')}</h2>
          <ul className="mt-3 divide-y divide-line">
            {[
              { icon: <UserRound className="text-emerald-600" />, bg: 'bg-[#e5f7ea]', t: t('stats.activity.applications'), d: t('stats.activity.today', { time: '10:24' }) },
              { icon: <Download className="text-violet-600" />, bg: 'bg-[#f1ebff]', t: t('stats.activity.downloads'), d: t('stats.activity.today', { time: '09:17' }) },
              { icon: <Star className="text-brand-600" />, bg: 'bg-[#e8f0ff]', t: t('stats.activity.reviews', { note: num(ecole.note) }), d: t('stats.activity.yesterday', { time: '16:45' }) },
            ].map((a) => (
              <li key={a.t} className="flex items-center gap-3 py-2.5 text-[15px] text-navy-900">
                <span className={cn('grid size-10 place-items-center rounded-full [&_svg]:size-5', a.bg)}>{a.icon}</span>
                <span className="flex-1 font-semibold">{a.t}</span>
                <span className="text-[13.5px]">{a.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
