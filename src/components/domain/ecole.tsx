import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { ArrowRight, BadgeCheck, Building2, CalendarDays, Heart, MapPin, Search, Star } from 'lucide-react'
import { SearchField } from '@/components/domain/SearchField'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Breadcrumb, Img, type Crumb } from '@/components/ui/Feedback'
import { Select } from '@/components/ui/Form'
import { useFavorites, type FavoriteKind } from '@/hooks/useFavorites'
import { etablissementById, typeTone, type Etablissement, type Formation } from '@/mocks/ecoles'
import { ecoleUrl, formationUrl, modeStyle } from '@/lib/ecole-links'
import { cn } from '@/lib/utils'

export function FavoriteButton({ id, kind, className, size = 'md' }: { id: string; kind: FavoriteKind; className?: string; size?: 'sm' | 'md' }) {
  const { isFavorite, toggle } = useFavorites()
  const on = isFavorite(id)
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      onClick={(e) => {
        e.preventDefault()
        toggle(id, kind, kind === 'etablissement' || kind === 'auto-ecole' ? 'Mes établissements' : 'Mes formations')
      }}
      className={cn('grid shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-line transition-colors hover:bg-rose-50', size === 'md' ? 'size-9' : 'size-8', className)}
    >
      <Heart className={cn('size-[18px]', on ? 'fill-rose-500 text-rose-500' : 'text-slate-500')} />
    </button>
  )
}

export function VerifiedBadge({ label = 'Établissement vérifié', light }: { label?: string; light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', light ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700')}>
      <BadgeCheck className="size-3.5" />
      {label}
    </span>
  )
}

export function TypeBadge({ type, className }: { type: Etablissement['type']; className?: string }) {
  return (
    <Badge tone={typeTone[type]} className={className}>
      {type}
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
  const extra = e.filieres.length - 3
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.07)] transition-shadow hover:shadow-lg">
      <div className="relative">
        <Img src={e.image} alt={e.nom} className="h-[106px] w-full" />
        <span className={cn('absolute top-2.5 left-2.5 rounded-full px-3.5 py-1 text-[13px] font-bold text-white shadow', typeFill[e.type])}>{e.type}</span>
        <span className="absolute top-2.5 right-11 inline-flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-sm">
          <BadgeCheck className="size-3.5 fill-emerald-500 text-white" />
          Établissement vérifié
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
            <b className="text-navy-950">{e.note.toLocaleString('fr-FR')}</b> ({e.avis} avis)
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
        <div className="mt-auto flex gap-2 pt-2">
          <Link to={`${ecoleUrl(e)}/formations`} className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-navy-800 px-3 text-[13px] font-semibold text-navy-900 hover:bg-brand-50">
            Voir les formations
          </Link>
          <Link to={ecoleUrl(e)} className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-600 px-3 text-[13px] font-semibold text-white hover:bg-brand-700">
            Voir le profil
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Ligne de formation (img30, img31) : photo, titre, établissement, pastilles, frais, détails, favori. */
export function FormationRow({ f, showEcole = true, chips = 'frais' }: { f: Formation; showEcole?: boolean; chips?: 'frais' | 'cours' }) {
  const e = etablissementById(f.etablissementId)
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
          {chips === 'frais' ? (
            <>
              <span className="rounded-lg bg-[#e8efff] px-3 py-1 font-medium text-navy-800">{f.diplome}</span>
              <span className="rounded-lg bg-[#efe8ff] px-3 py-1 font-medium text-navy-800">{f.mode}</span>
            </>
          ) : (
            <span className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium [&_svg]:size-4', modePill)}>
              {m.icon}
              {m.label === 'Jour & Soir' ? 'Jour & soir' : m.label}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-1 text-navy-900">
            <CalendarDays className="size-4 text-navy-800" />
            {f.dureeMois} mois
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 border-line sm:min-w-[310px] sm:self-stretch sm:border-l sm:pl-5">
        <div>
          <p className="text-[13px] text-navy-900">Frais de formation</p>
          <p className="mt-1 rounded-full bg-[#e8efff] px-4 py-1.5 text-[17px] font-extrabold text-navy-800">
            {f.fraisAn.toLocaleString('fr-FR')} FCFA <span className="text-[15px] font-bold">/ an</span>
          </p>
        </div>
        <Link to={formationUrl(f)} className="mt-5 ml-auto inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-600 px-5 text-[13px] font-semibold text-white hover:bg-brand-700">
          Voir les détails
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <FavoriteButton id={f.id} kind="formation" size="sm" className="absolute top-2.5 right-3 bg-transparent shadow-none ring-0" />
    </div>
  )
}

/** Bandeau bleu des pages publiques : icône, titres, photo et arc jaune à droite (img3, img25). */
export function Hero({
  title,
  title2,
  subtitle,
  icon,
  iconBox = true,
  image,
  crumbs,
  children,
  className,
}: {
  title: ReactNode
  title2?: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  iconBox?: boolean
  image?: string
  crumbs?: Crumb[]
  children?: ReactNode
  className?: string
}) {
  return (
    <>
      {crumbs && <Breadcrumb items={crumbs} className="-mt-1" />}
      <section className={cn('relative overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_60%,#1a47c4_100%)] text-white', className)}>
        {image && <Img src={image} alt="" className="absolute inset-y-0 right-0 hidden h-full w-[46%] object-left md:block" />}
        <div className="relative flex items-center gap-6 px-7 py-5 md:w-[55%] md:px-8">
          {icon &&
            (iconBox ? (
              <span className="grid size-[86px] shrink-0 place-items-center rounded-2xl bg-white text-navy-800 shadow-lg [&_svg]:size-12 [&_svg]:stroke-[1.6]">{icon}</span>
            ) : (
              <span className="grid shrink-0 place-items-center text-white [&_svg]:size-[84px] [&_svg]:stroke-[1.5]">{icon}</span>
            ))}
          <div className="min-w-0">
            <h1 className="text-[26px] leading-tight font-extrabold md:text-[32px]">{title}</h1>
            {title2 && <p className="text-[19px] leading-tight font-bold md:text-[23px]">{title2}</p>}
            {subtitle && <p className="mt-1.5 max-w-xl text-[15px] leading-snug text-white/90 md:text-[17px]">{subtitle}</p>}
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
      </section>
    </>
  )
}

/** Arguments du bandeau séparés par des traits (« Établissements vérifiés | … »). */
export function HeroFeatures({ items }: { items: { icon: ReactNode; label: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-y-2 text-[13px] font-medium whitespace-nowrap">
      {items.map((it, i) => (
        <li key={it.label} className={cn('flex items-center gap-2 [&_svg]:size-5', i > 0 && 'border-l border-white/30 pl-4', i < items.length - 1 && 'pr-4')}>
          {it.icon}
          {it.label}
        </li>
      ))}
    </ul>
  )
}

/** Barre de recherche bleu nuit (Rechercher en jaune), champs à double libellé. */
export function SearchPanel({
  fields,
  placeholder,
  title,
  onSearch,
  tone = 'navy',
}: {
  fields: { placeholder: string; hint?: string; options: string[]; icon?: ReactNode }[]
  placeholder?: string
  title?: string
  onSearch?: (q: string) => void
  tone?: 'navy' | 'light'
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const q = new FormData(e.currentTarget).get('q')
        onSearch?.(String(q ?? ''))
      }}
      className={cn(
        'grid gap-3 rounded-2xl p-3 md:flex md:items-center',
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
        <label className="relative flex-[1.7] md:min-w-[300px]">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
          <input name="q" placeholder={placeholder} className="h-[46px] w-full rounded-full border border-line bg-white pr-4 pl-11 text-[15px] text-ink outline-none placeholder:text-ink/70 focus:ring-3 focus:ring-brand-200" />
        </label>
      )}
      {fields.map((f) =>
        tone === 'navy' ? (
          <SearchField key={f.placeholder} icon={f.icon ?? <Search />} label={f.placeholder} hint={f.hint ?? 'Toutes'} options={f.options} className="h-[46px]" />
        ) : (
          <div key={f.placeholder} className="flex-1">
            <Select aria-label={f.placeholder} options={f.options} placeholder={f.placeholder} icon={f.icon} />
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
        Rechercher
      </button>
    </form>
  )
}

/** En-tête de liste : « 532 IPES trouvés » + tri. */
export function ResultsHeader({ title, sort = ['Pertinence', 'Mieux notés', 'Frais croissants', 'Plus récents'], children }: { title: ReactNode; sort?: string[]; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-[19px] font-bold text-navy-950">{title}</h2>
      <div className="flex items-center gap-2 text-sm text-ink">
        {children}
        <span>Trier par :</span>
        <div className="w-48">
          <Select aria-label="Trier par" options={sort} className="h-10" />
        </div>
      </div>
    </div>
  )
}

/** Colonne de filtres à gauche. */
export function FilterPanel({ title, children, onReset }: { title: ReactNode; children: ReactNode; onReset?: () => void }) {
  return (
    <Card className="h-fit space-y-4 p-4">
      <p className="font-bold text-navy-900">{title}</p>
      {children}
      {onReset && (
        <Button variant="neutral" size="sm" className="w-full" onClick={onReset}>
          Réinitialiser les filtres
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

export function MapBox({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-40 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#dbeafe_25%,#e0f2fe_25%,#e0f2fe_50%,#dbeafe_50%,#dbeafe_75%,#e0f2fe_75%)] bg-[length:28px_28px]', className)}>
      <svg viewBox="0 0 300 160" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M0 110 C80 90 120 130 300 70" stroke="#fff" strokeWidth="10" fill="none" />
        <path d="M120 0 L160 160" stroke="#fff" strokeWidth="7" fill="none" />
      </svg>
      <MapPin className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-full fill-rose-500 text-white drop-shadow" />
      <button type="button" onClick={() => toast('Ouverture de la carte (démo)')} className="absolute right-2 bottom-2 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-brand-600 shadow">
        Voir sur la carte →
      </button>
    </div>
  )
}
