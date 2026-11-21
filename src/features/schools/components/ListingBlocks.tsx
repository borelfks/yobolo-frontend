import type { ComponentType, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

/** Carte blanche de la colonne de gauche : titre avec icône. */
export function SidePanel({ title, icon, children, className }: { title: ReactNode; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('h-fit rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]', className)}>
      <p className="mb-3 flex items-center gap-2.5 text-[19px] font-bold text-navy-950 [&_svg]:size-6">
        {icon}
        {title}
      </p>
      {children}
    </div>
  )
}

/** Liste à icônes et compteurs ; la ligne active est sur fond bleu clair. */
export function IconCountList({
  items,
  value,
  onChange,
}: {
  items: { label: string; count: number | string; icon?: ComponentType<{ className?: string }> }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <ul className="divide-y divide-line/70">
      {items.map((it) => {
        const Icon = it.icon
        const active = value === it.label
        return (
          <li key={it.label}>
            <button
              type="button"
              onClick={() => onChange(it.label)}
              className={cn('flex w-full items-center gap-2.5 rounded-lg px-2 py-[7px] text-left text-[13.5px] whitespace-nowrap transition-colors', active ? 'bg-[#e6eeff] font-semibold text-brand-700' : 'text-ink hover:bg-brand-50')}
            >
              {Icon && <Icon className={cn('size-[18px] shrink-0', active ? 'text-brand-600' : 'text-navy-800')} />}
              <span className="flex-1">{it.label}</span>
              <span className="text-[13px] text-ink">({it.count})</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/** Champ de recherche arrondi avec le bouton jaune accolé (img26). */
export function InlineSearch({ placeholder, onSearch }: { placeholder: string; onSearch?: (q: string) => void }) {
  const { t } = useTranslation('schools')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch?.(String(new FormData(e.currentTarget).get('q') ?? ''))
      }}
      className="flex h-[46px] items-center rounded-full border-2 border-navy-800 bg-white pl-4"
    >
      <Search className="size-5 text-navy-900" />
      <input name="q" placeholder={placeholder} className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] text-ink outline-none placeholder:text-ink/75" />
      <button type="submit" className="-mr-0.5 inline-flex h-[46px] items-center gap-2 rounded-full bg-sun-400 px-7 text-[15px] font-bold text-navy-950 hover:bg-sun-500">
        <Search className="size-5" strokeWidth={2.6} />
        {t('blocks.search')}
      </button>
    </form>
  )
}

/** Rond bleu plein avec une flèche. */
export function ArrowDot({ className }: { className?: string }) {
  return (
    <span className={cn('grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-transform group-hover:translate-x-0.5', className)}>
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  )
}
