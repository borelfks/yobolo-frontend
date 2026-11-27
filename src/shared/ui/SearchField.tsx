import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

/**
 * Champ de recherche à double libellé (« Localisation / Région, ville, quartier »),
 * comme sur la maquette. La valeur choisie remplace l'aide sous le libellé ;
 * `name` la transmet au formulaire qui l'entoure.
 */
export function SearchField({
  icon,
  label,
  hint,
  options,
  name,
  defaut = '',
  className,
}: {
  icon: ReactNode
  label: string
  hint: string
  options: string[]
  name?: string
  /** Valeur choisie au départ (par exemple venue de l'adresse). */
  defaut?: string
  className?: string
}) {
  const [valeur, setValeur] = useState(defaut)
  return (
    <label className={cn('relative flex h-[50px] min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-white px-3.5 text-left', className)}>
      <span className="shrink-0 text-navy-800 [&_svg]:size-5">{icon}</span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[13px] font-bold text-navy-900">{label}</span>
        <span className={cn('block truncate text-xs', valeur ? 'font-semibold text-brand-700' : 'text-muted')}>{valeur || hint}</span>
      </span>
      <ChevronDown className="size-5 shrink-0 text-navy-900" />
      <select name={name} aria-label={label} value={valeur} onChange={(e) => setValeur(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">{hint}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
