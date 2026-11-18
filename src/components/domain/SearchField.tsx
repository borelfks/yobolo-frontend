import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Champ de recherche à double libellé (« Localisation / Région, ville, quartier »), comme sur la maquette. */
export function SearchField({
  icon,
  label,
  hint,
  options,
  className,
}: {
  icon: ReactNode
  label: string
  hint: string
  options: string[]
  className?: string
}) {
  return (
    <label className={cn('relative flex h-[50px] min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-white px-3.5 text-left', className)}>
      <span className="shrink-0 text-navy-800 [&_svg]:size-5">{icon}</span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[13px] font-bold text-navy-900">{label}</span>
        <span className="block truncate text-xs text-muted">{hint}</span>
      </span>
      <ChevronDown className="size-5 shrink-0 text-navy-900" />
      <select aria-label={label} defaultValue="" className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">{hint}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}
