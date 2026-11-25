import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Building2, Car, ChevronDown, ChevronUp, CircleCheck, Funnel, LayoutGrid, List, MapPin, RefreshCw, Search, Star, Users } from 'lucide-react'
import { FavoriteModal } from '@/features/driving-schools/components/AutoEcoleBlocks'
import { FavoriteButton } from '@/shared/components/ui/FavoriteButton'
import { Hero } from '@/shared/components/ui/Hero'
import { Img } from '@/shared/components/ui/Img'
import { Pagination } from '@/shared/components/ui/Pagination'
import { permisIcon } from '@/features/driving-schools/autoEcoleRules'
import { useAutoEcoles, usePermisCatalogue, usePermisListe, useQuartiers, useRegions, useVilles } from '@/data/hooks'
import { pageDe } from '@/shared/utils/pages'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Auto-écoles par page. */
const PAR_PAGE = 9

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'

function PillSelect({ icon, label, options, value, onChange }: { icon: ReactNode; label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="relative flex h-11 flex-1 items-center gap-2.5 rounded-full border border-[#c9d4ea] bg-white px-4 text-[15px] text-navy-900">
      <span className="text-navy-800 [&_svg]:size-5">{icon}</span>
      <span className={cn('flex-1 truncate', value && 'font-semibold text-brand-700')}>{value || label}</span>
      <ChevronDown className="size-5" />
      <select aria-label={label} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

function SmallSelect({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="relative flex h-9 flex-1 items-center rounded-full border border-[#c9d4ea] bg-white px-3 text-[13px] text-navy-900">
      <span className="flex-1 truncate">{value || label}</span>
      <ChevronDown className="size-4" />
      <select aria-label={label} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

export function AutoEcoles() {
  const permisList = usePermisListe()
  const regions = useRegions()
  const villes = useVilles()
  const quartiers = useQuartiers().map((q) => q.nom)
  const { t } = useTranslation('driving-schools')
  const [permis, setPermis] = useState<PermisCode[]>([])
  const [region, setRegion] = useState('')
  const [ville, setVille] = useState('')
  const [quartier, setQuartier] = useState('')
  const [tri, setTri] = useState<'bestRated' | 'cheapest' | 'nearest'>('bestRated')
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const permisCatalogue = usePermisCatalogue()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [fav, setFav] = useState<string | null>(null)
  const [openPermis, setOpenPermis] = useState(true)
  const [openLoc, setOpenLoc] = useState(true)
  const autoEcoles = useAutoEcoles()
  const trouvees = autoEcoles.filter(
    (a) =>
      (permis.length === 0 || permis.some((p) => a.permis.includes(p))) &&
      (!region || a.region === region) &&
      (!ville || a.ville === ville) &&
      (!quartier || a.quartier === quartier) &&
      [a.nom, a.ville, a.quartier].join(' ').toLowerCase().includes(q.trim().toLowerCase()),
  )
  // Tri : mieux notées ; moins chères (permis le moins cher proposé) ; plus proches (la ville choisie, puis la région).
  const prixMin = (a: (typeof autoEcoles)[number]) => Math.min(...a.permis.map((c) => permisCatalogue[c]?.prix ?? Number.POSITIVE_INFINITY))
  const proximite = (a: (typeof autoEcoles)[number]) => (ville && a.ville === ville ? 0 : region && a.region === region ? 1 : 2)
  const list = [...trouvees].sort((a, b) => (tri === 'cheapest' ? prixMin(a) - prixMin(b) : tri === 'nearest' ? proximite(a) - proximite(b) || b.note - a.note : b.note - a.note || b.avis - a.avis))
  const { pages, page: courante, elements } = pageDe(list, page, PAR_PAGE)
  const filtrer = <T,>(f: (v: T) => void) => (v: T) => (f(v), setPage(1))
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Hero
        crumbs={[{ label: t('common.crumbs.school'), to: ROUTES.schools }, { label: t('common.crumbs.drivingSchools') }]}
        icon={<Car className="fill-navy-800" />}
        image="/images/maquette/ae-hero.jpg"
        title={t('list.title')}
        subtitle={t('list.subtitle')}
        className="[&_h1]:text-[28px] [&_img]:w-[59%]"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setQ(String(new FormData(e.currentTarget).get('q') ?? ''))
        }}
        className={cn(card, 'grid gap-3 p-3 sm:grid-cols-2 lg:flex lg:items-center')}
      >
        <label className="relative flex-[1.4]">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
          <input name="q" placeholder={t('list.search.placeholder')} className="h-11 w-full rounded-full border border-[#c9d4ea] bg-white pr-4 pl-11 text-[15px] outline-none placeholder:text-ink/70 focus:ring-3 focus:ring-brand-100" />
        </label>
        <PillSelect icon={<Car />} label={t('list.search.allLicences')} options={permisList.map((p) => t('common.licence', { code: p.code }))} value={permis.length === 1 ? t('common.licence', { code: permis[0] }) : ''} onChange={filtrer((v: string) => setPermis(v ? [v.slice(-1) as PermisCode] : []))} />
        <PillSelect icon={<MapPin />} label={t('list.search.region')} options={regions.map((r) => r.nom)} value={region} onChange={filtrer(setRegion)} />
        <PillSelect icon={<Building2 />} label={t('list.search.city')} options={villes.map((v) => v.nom)} value={ville} onChange={filtrer(setVille)} />
        <PillSelect icon={<MapPin />} label={t('list.search.district')} options={quartiers} value={quartier} onChange={filtrer(setQuartier)} />
        <button type="submit" className="inline-flex h-11 shrink-0 items-center justify-center gap-2.5 rounded-full bg-brand-600 px-8 text-[17px] font-semibold text-white hover:bg-brand-700">
          <Search className="size-5" strokeWidth={2.6} />
          {t('list.search.submit')}
        </button>
      </form>
      <div className="grid gap-5 lg:grid-cols-[268px_1fr]">
        <aside className={cn(card, 'h-fit p-4')}>
          <p className="flex items-center gap-2.5 border-b border-line pb-3 text-[19px] font-bold text-navy-900">
            <Funnel className="size-6" /> {t('list.filters.title')}
          </p>
          <button type="button" onClick={() => setOpenPermis(!openPermis)} className="mt-3 flex w-full items-center gap-2.5 text-[16px] font-bold text-navy-900">
            <Car className="size-5" />
            <span className="flex-1 text-left">{t('list.filters.licenceType')}</span>
            {openPermis ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
          {openPermis && (
            <div className="mt-2 space-y-1.5">
              <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-navy-900">
                <input type="checkbox" checked={permis.length === 0} onChange={() => setPermis([])} className="size-[18px] accent-brand-600" />
                {t('list.filters.allLicences')}
              </label>
              {permisList.map((p) => {
                const Icon = permisIcon[p.code]
                return (
                  <label key={p.code} className="flex cursor-pointer items-center gap-2.5 text-[13px] whitespace-nowrap text-navy-900">
                    <input
                      type="checkbox"
                      checked={permis.includes(p.code)}
                      onChange={(e) => setPermis(e.target.checked ? [...permis, p.code] : permis.filter((x) => x !== p.code))}
                      className="size-[18px] accent-brand-600"
                    />
                    <Icon className="size-5 shrink-0 text-navy-800" />
                    {t('common.licenceTitle', { code: p.code, name: t(`permis.${p.code}.name`) })}
                  </label>
                )
              })}
            </div>
          )}
          <button type="button" onClick={() => setOpenLoc(!openLoc)} className="mt-4 flex w-full items-center gap-2.5 border-t border-line pt-3 text-[16px] font-bold text-navy-900">
            <MapPin className="size-5 fill-brand-600 text-white" />
            <span className="flex-1 text-left">{t('list.filters.location')}</span>
            {openLoc ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
          {openLoc && (
            <div className="mt-2 space-y-2.5 text-[14px] text-navy-900">
              <div className="flex items-center gap-3"><span className="w-16">{t('list.filters.region')}</span><SmallSelect label={t('list.filters.allRegions')} options={regions.map((r) => r.nom)} value={region} onChange={filtrer(setRegion)} /></div>
              <div className="flex items-center gap-3"><span className="w-16">{t('list.filters.city')}</span><SmallSelect label={t('list.filters.allCities')} options={villes.map((v) => v.nom)} value={ville} onChange={filtrer(setVille)} /></div>
              <div className="flex items-center gap-3"><span className="w-16">{t('list.filters.district')}</span><SmallSelect label={t('list.filters.allDistricts')} options={quartiers} value={quartier} onChange={filtrer(setQuartier)} /></div>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setPermis([])
              setRegion('')
              setVille('')
              setQuartier('')
              setQ('')
              setPage(1)
            }}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2.5 rounded-full bg-[#eaf0fb] text-[15px] font-semibold text-navy-900 hover:bg-brand-100"
          >
            <RefreshCw className="size-5" />
            {t('list.filters.reset')}
          </button>
        </aside>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[22px] font-bold text-navy-900">{t('list.found', { count: list.length })}</h2>
            <div className="flex items-center gap-3 text-[14px] text-navy-900">
              {t('list.sortBy')}
              <label className="relative flex h-9 items-center rounded-full border border-[#c9d4ea] bg-white px-3 text-[13px] text-navy-900">
                <span className="flex-1 truncate pr-5">{t(`list.sort.${tri}`)}</span>
                <ChevronDown className="pointer-events-none absolute right-2.5 size-4" />
                <select aria-label={t('list.sortBy')} value={tri} onChange={(e) => (setTri(e.target.value as typeof tri), setPage(1))} className="absolute inset-0 cursor-pointer opacity-0">
                  {(['bestRated', 'cheapest', 'nearest'] as const).map((x) => (
                    <option key={x} value={x}>{t(`list.sort.${x}`)}</option>
                  ))}
                </select>
              </label>
              <div className="flex overflow-hidden rounded-xl border border-line bg-white">
                {(['grid', 'list'] as const).map((v) => (
                  <button key={v} type="button" aria-label={v === 'grid' ? t('list.gridView') : t('list.listView')} onClick={() => setView(v)} className={cn('grid h-9 w-12 place-items-center', view === v ? 'bg-brand-600 text-white' : 'text-navy-900')}>
                    {v === 'grid' ? <LayoutGrid className="size-5" /> : <List className="size-5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={cn('grid gap-4', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : '')}>
            {elements.map((a) => (
              <div key={a.id} className={cn(card, 'flex overflow-hidden transition-shadow hover:shadow-lg', view === 'grid' ? 'flex-col' : 'flex-col sm:flex-row')}>
                <div className={cn('relative', view === 'list' && 'sm:w-80')}>
                  <Img src={a.image} alt={a.nom} className="h-[140px] w-full" />
                  <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[13px] font-semibold text-white">
                    <CircleCheck className="size-4 fill-white text-emerald-600" />
                    {t('common.approved')}
                  </span>
                  <FavoriteButton id={a.id} kind="auto-ecole" className="absolute top-2.5 right-2.5 size-10" />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-4">
                  <Link to={ROUTES.drivingSchool(a.id)} className="text-[18px] font-bold text-navy-900 hover:text-brand-600">{a.nom}</Link>
                  <p className="flex items-center gap-1.5 text-[14px] text-navy-900"><MapPin className="size-4" />{a.ville} – {a.quartier}</p>
                  <p className="flex items-center gap-3 border-b border-line pb-2.5 text-[14px] text-navy-900">
                    <span className="inline-flex items-center gap-1.5"><Star className="size-5 fill-amber-400 text-amber-400" /><b>{num(a.note)}</b> {t('common.reviews', { count: a.avis })}</span>
                    <span className="h-5 w-px bg-line" />
                    <span className="inline-flex items-center gap-1.5"><Users className="size-5 text-brand-600" />{t('list.card.trained', { value: num(a.formes) })}</span>
                  </p>
                  <p className="pt-1 text-[13px] font-bold text-navy-900">{t('list.card.licences')}</p>
                  <div className="flex flex-wrap gap-2">
                    {a.permis.slice(0, 3).map((p) => {
                      const Icon = permisIcon[p]
                      return (
                        <span key={p} className="inline-flex h-9 items-center gap-2 rounded-full bg-[#eef3fc] px-4 text-[16px] font-bold text-navy-900">
                          <Icon className="size-5 text-brand-600" />
                          {p}
                        </span>
                      )
                    })}
                  </div>
                  <div className="mt-auto flex gap-2.5 pt-3">
                    <Link to={ROUTES.drivingSchool(a.id)} className="inline-flex h-10 flex-1 items-center justify-center rounded-full border-2 border-brand-600/60 text-[15px] font-semibold text-navy-800 hover:bg-brand-50">
                      {t('list.card.viewProfile')}
                    </Link>
                    {/* Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) :
                    <Link
                      to={ROUTES.enrollment(a.id, a.permis.includes('B') ? 'B' : a.permis[0])}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 text-[15px] font-semibold text-white hover:bg-brand-700"
                    >
                      <Send className="size-4" />
                      {t('common.enrol')}
                    </Link>
                    */}
                  </div>
                  <button type="button" onClick={() => setFav(a.id)} className="pt-1 text-left text-[12px] font-semibold text-brand-600 hover:underline">
                    {t('list.card.saveToFolder')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {list.length === 0 && <div className={cn(card, 'p-8 text-center text-sm text-muted')}>{t('list.empty')}</div>}
          <Pagination label={t('list.pagination', { count: elements.length, total: list.length })} pages={pages} page={courante} onChange={setPage} />
        </div>
      </div>
      {fav && <FavoriteModal open onClose={() => setFav(null)} aeId={fav} />}
    </div>
  )
}
