import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BarChart3, Briefcase, ChevronRight, GraduationCap, LayoutGrid, MapPin, Search, ShieldCheck, Star, UserRound, Users, Wrench } from 'lucide-react'
import { Img } from '@/shared/components/ui/Img'
import { SearchField } from '@/shared/components/ui/SearchField'
import { regions } from '@/mocks/schools'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const univers = [
  { id: 'school', icon: GraduationCap, to: ROUTES.schools, card: 'bg-[#eef3ff] border-[#dbe5fb]', circle: 'bg-[#dbe6ff] text-navy-800', chevron: 'text-brand-600' },
  { id: 'consultant', icon: Users, to: ROUTES.consultation, card: 'bg-[#f5efff] border-[#e9ddfb]', circle: 'bg-[#ebdfff] text-violet-700', chevron: 'text-violet-600' },
  { id: 'trades', icon: Wrench, to: ROUTES.emploi, card: 'bg-[#fff5ec] border-[#fbe6d3]', circle: 'bg-[#ffe6d1] text-orange-600', chevron: 'text-orange-500' },
  { id: 'jobs', icon: Briefcase, to: ROUTES.emploi, card: 'bg-[#effaf3] border-[#d8f1e1]', circle: 'bg-[#d7f3e2] text-emerald-700', chevron: 'text-emerald-600' },
] as const

const tabs = ['ecoles', 'consultants', 'metiers', 'emplois'] as const

const schoolOptions = ['ipes', 'cfp', 'drivingSchools', 'others'] as const
const consultantOptions = ['finance', 'hr', 'legal', 'digital'] as const
const tradeOptions = ['mechanic', 'accountant', 'nurse', 'electrician'] as const
const schoolChips = ['accounting', 'hr', 'it'] as const

export function Home() {
  const { t } = useTranslation('landing')
  const [tab, setTab] = useState<(typeof tabs)[number]>('ecoles')
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-[1320px] space-y-5 px-5 py-4">
      {/* Bandeau */}
      <section className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_55%,#1a47c4_100%)] text-white">
        <Img src="/images/maquette/accueil-hero.jpg" alt="" className="absolute inset-y-0 right-0 hidden h-full w-[51.5%] object-left md:block" />
        <div className="relative px-7 py-7 md:w-[54%] md:px-11 md:py-8">
          <h1 className="text-[26px] leading-[1.12] font-extrabold tracking-[-0.01em] md:text-[33px]">
            {t('home.hero.line1')}
            <br />
            {t('home.hero.line2')}{' '}
            <span className="relative whitespace-nowrap text-sun-400">
              {t('home.hero.highlight')}
              <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden className="absolute -bottom-2 left-0 h-2.5 w-[62%]">
                <path d="M2 9 C 60 2, 140 2, 198 7" stroke="#fcd34d" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-4 max-w-[470px] text-[16px] leading-snug text-white/90">
            {t('home.hero.text')}
          </p>
          <ul className="mt-5 flex flex-wrap items-center gap-y-2 text-[13.5px] font-medium">
            <li className="flex items-center gap-2 pr-4"><ShieldCheck className="size-5 fill-white text-navy-800" /> {t('home.hero.features.verified')}</li>
            <li className="flex items-center gap-2 border-l border-white/30 px-4"><Star className="size-5 fill-white text-white" /> {t('home.hero.features.experts')}</li>
            <li className="flex items-center gap-2 border-l border-white/30 pl-4"><Users className="size-5 fill-white text-white" /> {t('home.hero.features.opportunities')}</li>
          </ul>
        </div>
      </section>

      {/* Univers */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {univers.map((u) => (
          <Link key={u.id} to={u.to} className={cn('group flex items-center gap-3 rounded-2xl border px-3.5 py-3 shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg', u.card)}>
            <span className={cn('grid size-[50px] shrink-0 place-items-center rounded-full', u.circle)}>
              <u.icon className="size-7" strokeWidth={2.2} />
            </span>
            <span className="flex-1">
              <span className="block text-[20px] leading-tight font-extrabold text-navy-950">{t(`home.univers.${u.id}.title`)}</span>
              <span className="block text-[13px] leading-snug text-ink/80">{t(`home.univers.${u.id}.text`)}</span>
            </span>
            <ChevronRight className={cn('size-6 transition-transform group-hover:translate-x-1', u.chevron)} strokeWidth={2.5} />
          </Link>
        ))}
      </section>

      {/* Recherche */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          navigate(ROUTES.schools)
        }}
        className="rounded-2xl bg-navy-800 px-5 pt-3 pb-4 shadow-lg shadow-navy-900/20"
      >
        <p className="mb-3 flex items-center gap-2.5 text-lg font-bold text-white">
          <Search className="size-5" strokeWidth={2.6} /> {t('home.search.title')}
        </p>
        <div className="grid gap-3 md:flex">
          <SearchField icon={<MapPin />} label={t('home.search.location.label')} hint={t('home.search.location.hint')} options={regions.map((r) => r.nom)} />
          <SearchField icon={<GraduationCap />} label={t('home.search.school.label')} hint={t('home.search.school.hint')} options={schoolOptions.map((o) => t(`home.search.school.options.${o}`))} />
          <SearchField icon={<UserRound />} label={t('home.search.consultant.label')} hint={t('home.search.consultant.hint')} options={consultantOptions.map((o) => t(`home.search.consultant.options.${o}`))} />
          <SearchField icon={<LayoutGrid />} label={t('home.search.trades.label')} hint={t('home.search.trades.hint')} options={tradeOptions.map((o) => t(`home.search.trades.options.${o}`))} />
          <button type="submit" className="inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-xl bg-sun-400 px-8 text-[17px] font-bold text-navy-950 hover:bg-sun-500">
            <Search className="size-5" strokeWidth={2.6} />
            {t('home.search.submit')}
          </button>
        </div>
      </form>

      {/* Recommandations */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[26px] font-extrabold text-navy-950">{t('home.reco.title')}</h2>
          <div className="flex rounded-full border border-line bg-white p-1 shadow-sm">
            {tabs.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn('h-9 rounded-full px-5 text-[15px] font-semibold transition-colors', tab === id ? 'bg-navy-800 text-white' : 'text-navy-900 hover:bg-brand-50')}
              >
                {t(`home.reco.tabs.${id}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RecoCard to={ROUTES.school('ipes', 'ipc')} image="/images/maquette/reco-ipc.jpg" badge={t('home.reco.school.badge')} badgeColor="text-brand-600" title="Institut Professionnel du Centre (IPC)">
            <p className="flex items-center gap-3 text-[14px] text-ink/80">
              <span className="inline-flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" /><b className="text-navy-950">{num(4.7)}</b> {t('home.reco.reviews', { count: 286, n: num(286) })}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> Yaoundé – Bastos</span>
            </p>
            <div className="flex gap-1.5">
              {schoolChips.map((c) => <Chip key={c}>{t(`home.reco.school.chips.${c}`)}</Chip>)}
            </div>
          </RecoCard>
          <RecoCard to={ROUTES.consultation} image="/images/maquette/reco-consultant.jpg" badge={t('home.reco.consultant.badge')} badgeColor="text-brand-600" title="Me Alain Tchana">
            <p className="flex items-center gap-3 text-[14px] text-ink/80">
              <span className="inline-flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" /><b className="text-navy-950">{num(4.9)}</b> {t('home.reco.reviews', { count: 132, n: num(132) })}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> {t('home.reco.consultant.field')}</span>
            </p>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" /> {t('home.reco.consultant.available')}
            </span>
          </RecoCard>
          <RecoCard to={ROUTES.emploi} image="/images/maquette/reco-metier.jpg" badge={t('home.reco.trade.badge')} badgeColor="text-orange-600" title={t('home.reco.trade.title')}>
            <p className="text-[14px] text-ink/80">{t('home.reco.trade.tasks')}</p>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[13px] font-semibold text-navy-800">
              <BarChart3 className="size-4" /> {t('home.reco.trade.demand')}
            </span>
          </RecoCard>
          <RecoCard to={ROUTES.emploi} image="/images/maquette/reco-emploi.jpg" badge={t('home.reco.job.badge')} badgeColor="text-emerald-600" title={t('home.reco.job.title')}>
            <p className="flex items-center gap-4 text-[14px] text-ink/80">
              <span className="inline-flex items-center gap-1"><Briefcase className="size-4" /> {t('home.reco.job.contract')}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> Yaoundé</span>
            </p>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700">
              <Briefcase className="size-3.5" /> {t('home.reco.job.new')}
            </span>
          </RecoCard>
        </div>
      </section>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[#e8efff] px-3 py-1 text-[13px] font-medium text-navy-800">{children}</span>
}

function RecoCard({ to, image, badge, badgeColor, title, children }: { to: string; image: string; badge: string; badgeColor: string; title: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group flex flex-col rounded-2xl border border-line bg-white p-2 shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
      <div className="relative overflow-hidden rounded-xl">
        <Img src={image} alt={title} className="h-[104px] w-full" />
        <span className={cn('absolute top-2.5 left-2.5 rounded-full bg-white px-3.5 py-1 text-[15px] font-bold shadow-sm', badgeColor)}>{badge}</span>
      </div>
      <div className="relative flex flex-1 flex-col gap-2 px-2 pt-3 pb-2">
        <p className="pr-2 text-[16px] font-bold text-navy-950">{title}</p>
        {children}
        <span className="absolute right-2 bottom-2 grid size-9 place-items-center rounded-full border border-line bg-white text-navy-900 transition-colors group-hover:bg-navy-800 group-hover:text-white">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
