import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, ChevronRight, Home, Star, X } from 'lucide-react'
import { cn, initials } from '@/lib/utils'

export function Progress({ value, tone = 'brand', className }: { value: number; tone?: 'brand' | 'green' | 'violet' | 'orange' | 'sun'; className?: string }) {
  const bar = { brand: 'bg-brand-600', green: 'bg-emerald-500', violet: 'bg-violet-500', orange: 'bg-orange-500', sun: 'bg-sun-400' }[tone]
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div className={cn('h-full rounded-full', bar)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

/** Anneau de progression (complétude, indices…). */
export function Ring({
  value,
  size = 88,
  stroke = 9,
  color = '#16a34a',
  label,
  className,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  label?: ReactNode
  className?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className={cn('relative grid shrink-0 place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e8edf6" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="absolute text-center font-extrabold text-navy-900" style={{ fontSize: size / 4.6 }}>
        {label ?? `${value} %`}
      </span>
    </div>
  )
}

export function Stars({ value, size = 'sm', showValue, count }: { value: number; size?: 'xs' | 'sm' | 'md' | 'lg'; showValue?: boolean; count?: number }) {
  const s = { xs: 'size-3', sm: 'size-4', md: 'size-5', lg: 'size-7' }[size]
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={cn(s, i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} />
        ))}
      </span>
      {showValue && <span className="text-sm font-bold text-navy-900">{value.toLocaleString('fr-FR')}</span>}
      {count !== undefined && <span className="text-sm text-muted">({count.toLocaleString('fr-FR')} avis)</span>}
    </span>
  )
}

/** Note compacte « ★ 4,7 (286 avis) ». */
export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', className)}>
      <Star className="size-4 fill-amber-400 text-amber-400" />
      <span className="font-bold">{value.toLocaleString('fr-FR')}</span>
      {count !== undefined && <span className="text-muted">({count.toLocaleString('fr-FR')} avis)</span>}
    </span>
  )
}

/** Notation cliquable. */
export function StarInput({ value, onChange, size = 'lg' }: { value: number; onChange: (v: number) => void; size?: 'md' | 'lg' }) {
  const s = size === 'lg' ? 'size-8' : 'size-6'
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" aria-label={`${i} étoile${i > 1 ? 's' : ''}`} onClick={() => onChange(i)}>
          <Star className={cn(s, 'transition-colors', i <= value ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 hover:fill-amber-200 hover:text-amber-200')} />
        </button>
      ))}
    </span>
  )
}

/** Image de démonstration, avec un dégradé si elle ne charge pas. */
export function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <div role="img" aria-label={alt} className={cn('bg-gradient-to-br from-brand-200 via-brand-100 to-sky-100', className)} />
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn('object-cover', className)} />
}

export function Avatar({ src, name, size = 40, className }: { src?: string; name: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  const style = { width: size, height: size }
  if (!src || failed) {
    return (
      <span style={{ ...style, fontSize: size / 2.6 }} className={cn('grid shrink-0 place-items-center rounded-full bg-brand-100 font-bold text-brand-700', className)}>
        {initials(name)}
      </span>
    )
  }
  return <img src={src} alt={name} style={style} onError={() => setFailed(true)} className={cn('shrink-0 rounded-full object-cover', className)} />
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  icon,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  icon?: ReactNode
  size?: 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={cn('w-full rounded-3xl bg-white p-6 shadow-2xl', size === 'md' ? 'max-w-md' : 'max-w-2xl')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          {icon}
          <h2 className="flex-1 text-lg text-navy-900">{title}</h2>
          <button type="button" aria-label="Fermer" onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-slate-100">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}

export function Pagination({ label, pages = 3, current = 1 }: { label: ReactNode; pages?: number; current?: number }) {
  const [page, setPage] = useState(current)
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm text-muted">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Page précédente" onClick={() => setPage(Math.max(1, page - 1))} className="grid size-8 place-items-center rounded-lg ring-1 ring-line hover:bg-slate-50">
          <ChevronLeft className="size-4" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            className={cn('grid size-8 place-items-center rounded-lg font-semibold', p === page ? 'bg-brand-600 text-white' : 'text-ink ring-1 ring-line hover:bg-slate-50')}
          >
            {p}
          </button>
        ))}
        <button type="button" aria-label="Page suivante" onClick={() => setPage(Math.min(pages, page + 1))} className="grid size-8 place-items-center rounded-lg ring-1 ring-line hover:bg-slate-50">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

export type Crumb = { label: string; to?: string }

export function Breadcrumb({ items, className, light }: { items: Crumb[]; className?: string; light?: boolean }) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn('flex flex-wrap items-center gap-1.5 text-sm', light ? 'text-white/80' : 'text-muted', className)}>
      <Link to="/" aria-label="Accueil" className="hover:text-brand-600">
        <Home className="size-4" />
      </Link>
      {items.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <ChevronRight className="size-3.5 opacity-60" />
          {c.to && i < items.length - 1 ? (
            <Link to={c.to} className="hover:text-brand-600 hover:underline">
              {c.label}
            </Link>
          ) : (
            <span className={cn('font-semibold', light ? 'text-white' : 'text-navy-900')}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
