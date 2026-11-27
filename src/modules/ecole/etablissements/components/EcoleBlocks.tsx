import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, Building2, CalendarDays, MapPin, Search, Star } from 'lucide-react'
import { SearchField } from '@/shared/ui/SearchField'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Img } from '@/shared/ui/Img'
import { FavoriteButton } from '@/shared/ui/FavoriteButton'
import { Select } from '@/shared/forms/Fields'
import type { Etablissement, Formation } from '@/shared/types'
import { typeTone } from '@/modules/ecole/etablissements/schoolTypes'
import { useEtablissement } from '@/data/hooks'
import { ecoleUrl, formationUrl, modeStyle, schoolTypeKey, useModeLabel } from '@/modules/ecole/etablissements/schoolLinks'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { lienCarte, ouvrir } from '@/shared/utils/liens'
import { PasEncoreDAvis } from '@/shared/ui/StarRating'

export function VerifiedBadge({ label, light }: { label?: string; light?: boolean }) {
  const { t } = useTranslation('schools')
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', light ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700')}>
      <BadgeCheck className="size-3.5" />
      {label ?? t('blocks.verified')}
    </span>
  )
}

export function TypeBadge({ type, className }: { type: Etablissement['type']; className?: string }) {
  const { t } = useTranslation('schools')
  return (
    <Badge tone={typeTone[type]} className={className}>
      {t(`schoolTypes.${schoolTypeKey[type]}`)}
    </Badge>
  )
}

/** Pastille de type pleine, comme sur les cartes de la maquette. */
const typeFill: Record<Etablissement['type'], string> = {
  IPES: 'bg-brand-600',
  CFP: 'bg-violet-600',
  'Auto-école': 'bg-orange-500',
  Autre: 'bg-teal-500',
}

/** Carte d'établissement de l'annuaire (img3, img25). */
export function EcoleCard({ e }: { e: Etablissement }) {
  const { t } = useTranslation('schools')
  const extra = e.filieres.length - 3
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.07)] transition-shadow hover:shadow-lg">
      <div className="relative">
        <Img src={e.image} alt={e.nom} className="h-[106px] w-full" />
        <span className={cn('absolute top-2.5 left-2.5 rounded-full px-3.5 py-1 text-[13px] font-bold text-white shadow', typeFill[e.type])}>{t(`schoolTypes.${schoolTypeKey[e.type]}`)}</span>
        <span className="absolute top-2.5 right-11 inline-flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-sm">
          <BadgeCheck className="size-3.5 fill-emerald-500 text-white" />
          {t('blocks.verified')}
        </span>
        <FavoriteButton id={e.id} kind="etablissement" size="sm" className="absolute top-2 right-2" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pt-3 pb-3.5">
        <Link to={ecoleUrl(e)} className="text-[14.5px] leading-snug font-bold text-navy-950 hover:text-brand-600">
          {e.nom}
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 text-[13px] text-ink/80">
          <span className="inline-flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {e.avis > 0 ? (
              <>
                <b className="text-navy-950">{num(e.note)}</b> {t('blocks.card.reviews', { count: e.avis })}
              </>
            ) : (
              <PasEncoreDAvis />
            )}
          </span>
          <span className="text-line">|</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-4 fill-brand-600 text-white" />
            {e.ville} – {e.quartier}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {e.filieres.slice(0, 3).map((f) => (
            <span key={f} className="rounded-full bg-[#eef2fb] px-2.5 py-1 text-[12px] font-medium text-navy-800">
              {f}
            </span>
          ))}
          {extra > 0 && <span className="rounded-full bg-[#eef2fb] px-2.5 py-1 text-[12px] font-semibold text-navy-800">+{extra}</span>}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link to={ecoleUrl(e, 'formations')} className="inline-flex h-9 flex-auto items-center justify-center rounded-full border border-navy-800 px-3 text-[13px] font-semibold whitespace-nowrap text-navy-900 hover:bg-brand-50">
            {t('blocks.card.seeTrainings')}
          </Link>
          <Link to={ecoleUrl(e)} className="inline-flex h-9 flex-auto items-center justify-center gap-1.5 rounded-full bg-brand-600 px-3 text-[13px] font-semibold whitespace-nowrap text-white hover:bg-brand-700">
            {t('blocks.card.seeProfile')}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Ligne de formation (img31) : photo, titre, établissement, pastilles, détails, favori. */
export function FormationRow({ f, showEcole = true }: { f: Formation; showEcole?: boolean }) {
  const { t } = useTranslation('schools')
  const modeLabel = useModeLabel()
  const e = useEtablissement(f.etablissementId)
  const m = modeStyle[f.mode]
  const modePill = {
    Jour: 'bg-[#fff3d6] text-navy-900 [&_svg]:text-amber-500 [&_svg]:fill-amber-400',
    Soir: 'bg-[#ece6ff] text-navy-900 [&_svg]:text-navy-800 [&_svg]:fill-navy-800',
    'Jour & Soir': 'bg-[#dcf5e4] text-navy-900 [&_svg]:text-emerald-700',
  }[f.mode]
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-line bg-white p-2.5 shadow-[0_2px_10px_rgba(15,29,61,0.06)] sm:flex-row sm:items-center">
      <Img src={f.image} alt={f.nom} className="h-32 w-full rounded-xl sm:h-[76px] sm:w-[160px]" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Link to={formationUrl(f)} className="text-[17px] font-bold text-navy-800 hover:text-brand-600">
          {f.nom}
        </Link>
        {showEcole && (
          <p className="flex flex-wrap items-center gap-x-5 text-[12.5px] whitespace-nowrap text-navy-900">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-4 text-navy-800" />
              {e.nom}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-navy-800" />
              {e.ville} – {e.region}
            </span>
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium [&_svg]:size-4', modePill)}>
            {m.icon}
            {f.mode === 'Jour & Soir' ? t('blocks.formationRow.dayAndEvening') : modeLabel(f.mode)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-1 text-navy-900">
            <CalendarDays className="size-4 text-navy-800" />
            {t('blocks.formationRow.months', { count: f.dureeMois })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 border-line sm:self-stretch sm:border-l sm:pl-5 sm:pr-10">
        <Link to={formationUrl(f)} className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-600 px-5 text-[13px] font-semibold text-white hover:bg-brand-700">
          {t('blocks.formationRow.seeDetails')}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <FavoriteButton id={f.id} kind="formation" size="sm" className="absolute top-2.5 right-3 bg-transparent shadow-none ring-0" />
    </div>
  )
}

/** Barre de recherche bleu nuit (Rechercher en jaune), champs à double libellé. */
export function SearchPanel({
  fields,
  placeholder,
  title,
  onSearch,
  defautQ,
  tone = 'navy',
}: {
  /** `name` : la clé du critère transmis à `onSearch` (« region », « ville », « filiere », « niveau », « type »). */
  fields: { name: string; placeholder: string; hint?: string; options: string[]; icon?: ReactNode; defaut?: string }[]
  placeholder?: string
  /** Texte de recherche au départ (par exemple venu de l'adresse). */
  defautQ?: string
  title?: string
  /** Le texte saisi et les critères choisis (vides : tous). */
  onSearch?: (q: string, criteres: Record<string, string>) => void
  tone?: 'navy' | 'light'
}) {
  const { t } = useTranslation('schools')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const criteres = Object.fromEntries(fields.map((f) => [f.name, String(form.get(f.name) ?? '')]))
        onSearch?.(String(form.get('q') ?? ''), criteres)
      }}
      className={cn(
        'grid gap-3 rounded-2xl p-3 xl:flex xl:items-center',
        tone === 'navy' ? 'bg-[linear-gradient(100deg,#0f2c7a,#1238a8)] shadow-lg shadow-navy-900/20' : 'border border-line bg-white',
      )}
    >
      {title && (
        <p className="flex shrink-0 items-center gap-2.5 px-3 text-[21px] font-semibold text-white">
          <Search className="size-6" strokeWidth={2.6} />
          {title}
        </p>
      )}
      {placeholder && (
        <label className="relative flex-[1.7] xl:min-w-[300px]">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
          <input name="q" defaultValue={defautQ} placeholder={placeholder} className="h-[46px] w-full rounded-full border border-line bg-white pr-4 pl-11 text-[15px] text-ink outline-none placeholder:text-ink/70 focus:ring-3 focus:ring-brand-200" />
        </label>
      )}
      {fields.map((f) =>
        tone === 'navy' ? (
          <SearchField key={f.name} name={f.name} defaut={f.defaut} icon={f.icon ?? <Search />} label={f.placeholder} hint={f.hint ?? t('blocks.allHint')} options={f.options} className="h-[46px]" />
        ) : (
          <div key={f.name} className="flex-1">
            <Select name={f.name} defaultValue={f.defaut} aria-label={f.placeholder} options={f.options} placeholder={f.placeholder} icon={f.icon} />
          </div>
        ),
      )}
      <button
        type="submit"
        className={cn(
          'inline-flex h-[46px] shrink-0 items-center justify-center gap-2 rounded-xl px-7 text-[16px] font-bold',
          tone === 'navy' ? 'bg-sun-400 text-navy-950 hover:bg-sun-500' : 'bg-brand-600 text-white hover:bg-brand-700',
        )}
      >
        <Search className="size-5" strokeWidth={2.6} />
        {t('blocks.search')}
      </button>
    </form>
  )
}

/** En-tête de liste : « 532 IPES trouvés » + tri. */
/** `tri` : l'index de l'option choisie dans `sort` (ou dans les tris par défaut) ; `onTri` la change. */
export function ResultsHeader({ title, sort, tri = 0, onTri, children }: { title: ReactNode; sort?: string[]; tri?: number; onTri?: (index: number) => void; children?: ReactNode }) {
  const { t } = useTranslation('schools')
  const options = sort ?? [t('blocks.results.sort.pertinence'), t('blocks.results.sort.bestRated'), t('blocks.results.sort.newest')]
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-[19px] font-bold text-navy-950">{title}</h2>
      <div className="flex items-center gap-2 text-sm text-ink">
        {children}
        <span>{t('blocks.results.sortBy')}</span>
        <div className="w-48">
          <Select aria-label={t('blocks.results.sortByLabel')} value={String(tri)} onChange={(e) => onTri?.(Number(e.target.value))} options={options.map((label, i) => ({ value: String(i), label }))} className="h-10" />
        </div>
      </div>
    </div>
  )
}

/** Colonne de filtres à gauche. */
export function FilterPanel({ title, children, onReset }: { title: ReactNode; children: ReactNode; onReset?: () => void }) {
  const { t } = useTranslation('schools')
  return (
    <Card className="h-fit space-y-4 p-4">
      <p className="font-bold text-navy-900">{title}</p>
      {children}
      {onReset && (
        <Button variant="neutral" size="sm" className="w-full" onClick={onReset}>
          {t('blocks.resetFilters')}
        </Button>
      )}
    </Card>
  )
}

/** Liste de choix à compteurs, cliquable (domaines, régions…). */
export function CountList({ items, value, onChange }: { items: { label: string; count: number | string; icon?: ReactNode }[]; value: string; onChange: (v: string) => void }) {
  return (
    <ul className="space-y-1">
      {items.map((it) => (
        <li key={it.label}>
          <button
            type="button"
            onClick={() => onChange(it.label)}
            className={cn('flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors [&_svg]:size-4', value === it.label ? 'bg-brand-600 font-semibold text-white' : 'text-ink hover:bg-brand-50')}
          >
            {it.icon}
            <span className="flex-1">{it.label}</span>
            <span className={cn('text-xs', value === it.label ? 'text-white/80' : 'text-muted')}>({it.count})</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/** Petite carte ; « Voir » ouvre le plan de l'adresse. */
export function MapBox({ adresse, className }: { adresse: string; className?: string }) {
  const { t } = useTranslation('schools')
  return (
    <div className={cn('relative h-40 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#dbeafe_25%,#e0f2fe_25%,#e0f2fe_50%,#dbeafe_50%,#dbeafe_75%,#e0f2fe_75%)] bg-[length:28px_28px]', className)}>
      <svg viewBox="0 0 300 160" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M0 110 C80 90 120 130 300 70" stroke="#fff" strokeWidth="10" fill="none" />
        <path d="M120 0 L160 160" stroke="#fff" strokeWidth="7" fill="none" />
      </svg>
      <MapPin className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-full fill-rose-500 text-white drop-shadow" />
      <button type="button" onClick={() => ouvrir(lienCarte(adresse))} className="absolute right-2 bottom-2 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-brand-600 shadow">
        {t('blocks.map.see')}
      </button>
    </div>
  )
}
