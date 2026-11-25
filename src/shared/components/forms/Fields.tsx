import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  Bold,
  Check,
  ChevronDown,
  CloudUpload,
  Italic,
  Link2,
  List,
  ListOrdered,
  Plus,
  Underline,
  X,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const control =
  'w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:ring-3 focus:ring-brand-100 focus:outline-none disabled:bg-slate-50 disabled:text-muted'

export function Label({ children, required, htmlFor }: { children: ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-navy-900">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </label>
  )
}

export function Field({
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  label?: ReactNode
  required?: boolean
  hint?: ReactNode
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-muted">{hint}</p>
      )}
    </div>
  )
}

export function Input({
  className,
  icon,
  suffix,
  ...props
}: ComponentProps<'input'> & { icon?: ReactNode; suffix?: ReactNode }) {
  if (!icon && !suffix) return <input className={cn(control, 'h-11', className)} {...props} />
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400 [&_svg]:size-4">
          {icon}
        </span>
      )}
      <input className={cn(control, 'h-11', icon && 'pl-10', suffix && 'pr-16', className)} {...props} />
      {suffix && (
        <span className="absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-muted">{suffix}</span>
      )}
    </div>
  )
}

export function Select({
  options,
  className,
  placeholder,
  icon,
  ...props
}: ComponentProps<'select'> & { options: (string | { value: string; label: string })[]; placeholder?: string; icon?: ReactNode }) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400 [&_svg]:size-4">
          {icon}
        </span>
      )}
      <select className={cn(control, 'h-11 appearance-none pr-9', icon && 'pl-10', className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

export function Textarea({
  className,
  max,
  defaultValue,
  ...props
}: Omit<ComponentProps<'textarea'>, 'max'> & { max?: number }) {
  const [len, setLen] = useState(String(defaultValue ?? '').length)
  return (
    <div className="relative">
      <textarea
        className={cn(control, 'min-h-24 py-2.5', max && 'pb-6', className)}
        maxLength={max}
        defaultValue={defaultValue}
        onChange={(e) => setLen(e.target.value.length)}
        {...props}
      />
      {max && (
        <span className="pointer-events-none absolute right-3 bottom-2 text-xs text-slate-400">
          {len}/{max}
        </span>
      )}
    </div>
  )
}

/** Éditeur riche simulé : barre d'outils + zone de texte. */
export function RichText({ defaultValue, max = 500, rows = 6 }: { defaultValue?: string; max?: number; rows?: number }) {
  const tools = [Bold, Italic, Underline, List, ListOrdered, Link2]
  return (
    <div className="overflow-hidden rounded-xl border border-line focus-within:border-brand-500 focus-within:ring-3 focus-within:ring-brand-100">
      <div className="flex items-center gap-1 border-b border-line bg-slate-50 px-2 py-1.5">
        {tools.map((Icon, i) => (
          <button key={i} type="button" className="grid size-7 place-items-center rounded-md text-slate-600 hover:bg-white">
            <Icon className="size-4" />
          </button>
        ))}
      </div>
      <Textarea
        defaultValue={defaultValue}
        max={max}
        rows={rows}
        className="rounded-none border-0 focus:ring-0"
      />
    </div>
  )
}

export function Checkbox({
  label,
  description,
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type'> & { label: ReactNode; description?: ReactNode }) {
  const id = useId()
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-start gap-2.5 text-sm', className)}>
      <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
        <input id={id} type="checkbox" className="peer size-5 appearance-none rounded-md border border-slate-300 bg-white checked:border-brand-600 checked:bg-brand-600" {...props} />
        <Check className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span>
        <span className="text-ink">{label}</span>
        {description && <span className="block text-xs text-muted">{description}</span>}
      </span>
    </label>
  )
}

export function Radio({
  label,
  description,
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type'> & { label: ReactNode; description?: ReactNode }) {
  const id = useId()
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-start gap-2.5 text-sm', className)}>
      <input
        id={id}
        type="radio"
        className="mt-0.5 size-5 shrink-0 appearance-none rounded-full border border-slate-300 bg-white checked:border-[6px] checked:border-brand-600"
        {...props}
      />
      <span>
        <span className="font-medium text-ink">{label}</span>
        {description && <span className="block text-xs text-muted">{description}</span>}
      </span>
    </label>
  )
}

export function Switch({
  defaultChecked,
  checked,
  onChange,
  label,
  description,
  className,
  ariaLabel,
  disabled,
}: {
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (v: boolean) => void
  label?: ReactNode
  description?: ReactNode
  className?: string
  /** Le nom lu par les lecteurs d'écran quand l'interrupteur n'a pas de libellé visible. */
  ariaLabel?: string
  disabled?: boolean
}) {
  const [inner, setInner] = useState(defaultChecked ?? false)
  const on = checked ?? inner
  const toggle = () => {
    setInner(!on)
    onChange?.(!on)
  }
  const sw = (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={toggle}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50', on ? 'bg-brand-600' : 'bg-slate-300')}
    >
      <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
  if (!label) return sw
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div className="text-sm">
        <p className="font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-muted">{description}</p>}
      </div>
      {sw}
    </div>
  )
}

/** Choix exclusif en segments : « Horaire / Forfait / Par projet ». */
export function Segmented({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: ReactNode; icon?: ReactNode }[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'inline-flex h-10 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold transition-colors [&_svg]:size-4',
            value === o.value
              ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
              : 'border-line bg-white text-ink hover:bg-slate-50',
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Carte sélectionnable (profil, niveau, visibilité…). */
export function ChoiceCard({
  selected,
  onClick,
  icon,
  title,
  description,
  className,
}: {
  selected: boolean
  onClick: () => void
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-start gap-2 rounded-2xl border bg-white p-4 text-left transition-all',
        selected ? 'border-brand-600 ring-2 ring-brand-600/30' : 'border-line hover:border-brand-200',
        className,
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-brand-600 text-white">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}
      {icon}
      <span className="font-bold text-navy-900">{title}</span>
      {description && <span className="text-xs text-muted">{description}</span>}
    </button>
  )
}

export function Dropzone({
  title,
  hint,
  compact,
  onFile,
}: {
  title?: string
  hint?: string
  compact?: boolean
  onFile?: (name: string) => void
}) {
  const { t } = useTranslation()
  const id = useId()
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 text-center transition-colors hover:bg-brand-50',
        compact ? 'p-4' : 'p-7',
      )}
    >
      <span className="grid size-11 place-items-center rounded-full bg-brand-100 text-brand-600">
        <CloudUpload className="size-5" />
      </span>
      <span className="text-sm font-semibold text-navy-900">
        <Trans t={t} i18nKey="fields.dropzone.action" values={{ title: title ?? t('fields.dropzone.title') }} components={{ browse: <span className="text-brand-600 underline" /> }} />
      </span>
      <span className="text-xs text-muted">{hint ?? t('fields.dropzone.hint')}</span>
      <input
        id={id}
        type="file"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile?.(f.name)
        }}
      />
    </label>
  )
}

/** Saisie de mots-clés en pastilles. */
export function ChipsInput({
  defaultValue = [],
  placeholder,
  value,
  onChange,
}: {
  defaultValue?: string[]
  placeholder?: string
  /** Facultatif : liste tenue par le formulaire (avec `onChange`), sinon le champ garde la sienne. */
  value?: string[]
  onChange?: (chips: string[]) => void
}) {
  const { t } = useTranslation()
  const [interne, setInterne] = useState(defaultValue)
  const chips = value ?? interne
  const setChips = (suite: string[]) => {
    setInterne(suite)
    onChange?.(suite)
  }
  const [draft, setDraft] = useState('')
  const add = () => {
    const v = draft.trim()
    if (v && !chips.includes(v)) setChips([...chips, v])
    setDraft('')
  }
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-2">
      {chips.map((c) => (
        <span key={c} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
          {c}
          <button type="button" aria-label={t('fields.chips.remove', { label: c })} onClick={() => setChips(chips.filter((x) => x !== c))}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <span className="inline-flex flex-1 items-center gap-1">
        <Plus className="size-3.5 text-brand-600" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          onBlur={add}
          placeholder={(placeholder ?? t('fields.chips.placeholder')).replace(/^\+\s*/, '')}
          className="min-w-32 flex-1 bg-transparent text-sm outline-none placeholder:text-brand-600"
        />
      </span>
    </div>
  )
}

/** Indicatif +237 + numéro. */
export function PhoneInput({ defaultValue, ...props }: ComponentProps<'input'>) {
  return (
    <div className="flex">
      <span className="inline-flex h-11 items-center gap-1.5 rounded-l-xl border border-r-0 border-line bg-slate-50 px-3 text-sm font-semibold">
        <span aria-hidden className="flex h-3.5 w-5 overflow-hidden rounded-[2px]">
          <span className="w-1/3 bg-emerald-600" />
          <span className="relative w-1/3 bg-rose-600">
            <span className="absolute inset-0 grid place-items-center text-[7px] leading-none text-sun-400">★</span>
          </span>
          <span className="w-1/3 bg-sun-400" />
        </span>
        +237
        <ChevronDown className="size-3.5 text-slate-400" />
      </span>
      <input type="tel" defaultValue={defaultValue} placeholder="6 XX XX XX XX" className={cn(control, 'h-11 rounded-l-none')} {...props} />
    </div>
  )
}
