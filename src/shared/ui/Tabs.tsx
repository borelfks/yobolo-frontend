import type { ReactNode } from 'react'
import { NavLink } from 'react-router'
import { cn } from '@/shared/utils/cn'

export type TabItem = { value: string; label: ReactNode; icon?: ReactNode; count?: number | string }

const pill = (active: boolean) =>
  cn(
    'inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors [&_svg]:size-4',
    active ? 'bg-navy-800 text-white shadow-sm' : 'bg-white text-navy-900 ring-1 ring-line hover:bg-brand-50',
  )

/** Onglets en blocs de même largeur (pages IPES, img25). */
const block = (active: boolean) =>
  cn(
    'inline-flex h-11 min-w-max flex-1 items-center justify-center gap-2.5 rounded-xl px-4 text-[16px] font-semibold transition-colors [&_svg]:size-6',
    active ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-[#eaf0fb] text-navy-900 hover:bg-brand-100',
  )

const underline = (active: boolean) =>
  cn(
    'inline-flex h-11 shrink-0 items-center gap-2 border-b-2 px-1 text-sm font-semibold transition-colors [&_svg]:size-4',
    active ? 'border-brand-600 text-brand-700' : 'border-transparent text-muted hover:text-navy-900',
  )

function Count({ n, active }: { n: number | string; active: boolean }) {
  return (
    <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-white/20' : 'bg-slate-100 text-muted')}>{n}</span>
  )
}

/** Onglets à état local. */
export function Tabs({
  items,
  value,
  onChange,
  variant = 'pill',
  className,
}: {
  items: TabItem[]
  value: string
  onChange: (v: string) => void
  variant?: 'pill' | 'underline'
  className?: string
}) {
  const style = variant === 'pill' ? pill : underline
  return (
    <div
      role="tablist"
      className={cn(
        'scrollbar-thin flex gap-2 overflow-x-auto',
        variant === 'underline' && 'gap-6 border-b border-line',
        className,
      )}
    >
      {items.map((t) => (
        <button key={t.value} role="tab" aria-selected={value === t.value} type="button" onClick={() => onChange(t.value)} className={style(value === t.value)}>
          {t.icon}
          {t.label}
          {t.count !== undefined && <Count n={t.count} active={value === t.value && variant === 'pill'} />}
        </button>
      ))}
    </div>
  )
}

/** Onglets portés par l'adresse : chaque onglet a son URL. */
export function LinkTabs({
  items,
  base,
  variant = 'pill',
  className,
}: {
  items: TabItem[]
  base: string
  variant?: 'pill' | 'underline' | 'block'
  className?: string
}) {
  const style = variant === 'pill' ? pill : variant === 'block' ? block : underline
  return (
    <nav
      className={cn(
        'scrollbar-thin flex gap-2 overflow-x-auto',
        variant === 'underline' && 'gap-6 border-b border-line',
        variant === 'block' && 'gap-3',
        className,
      )}
    >
      {items.map((t, i) => (
        <NavLink key={t.value} to={i === 0 && t.value === '' ? base : `${base}/${t.value}`} end className={({ isActive }) => style(isActive)}>
          {({ isActive }) => (
            <>
              {t.icon}
              {t.label}
              {t.count !== undefined && <Count n={t.count} active={isActive && variant === 'pill'} />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/** Petites pastilles de filtre « Tous (5) · Consultations (3) ». */
export function FilterPills({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors [&_svg]:size-3.5',
            value === t.value ? 'bg-brand-600 text-white' : 'bg-white text-ink ring-1 ring-line hover:bg-brand-50',
          )}
        >
          {t.icon}
          {t.label}
          {t.count !== undefined && <span className="opacity-75">({t.count})</span>}
        </button>
      ))}
    </div>
  )
}
