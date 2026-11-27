import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CheckCircle2, Info, Lightbulb, TrendingUp } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Card } from '@/shared/ui/Card'

const kpiTones = {
  blue: 'from-brand-50 to-white text-brand-600 bg-brand-100',
  green: 'from-emerald-50 to-white text-emerald-600 bg-emerald-100',
  violet: 'from-violet-50 to-white text-violet-600 bg-violet-100',
  orange: 'from-orange-50 to-white text-orange-600 bg-orange-100',
  amber: 'from-amber-50 to-white text-amber-600 bg-amber-100',
  sky: 'from-sky-50 to-white text-sky-600 bg-sky-100',
  red: 'from-rose-50 to-white text-rose-600 bg-rose-100',
  teal: 'from-teal-50 to-white text-teal-600 bg-teal-100',
} as const

export type KpiTone = keyof typeof kpiTones

/** Carte chiffrée pastel : icône, libellé, valeur, tendance. */
export function Kpi({
  icon,
  label,
  value,
  tone = 'blue',
  trend,
  extra,
  className,
}: {
  icon: ReactNode
  label: ReactNode
  value: ReactNode
  tone?: KpiTone
  trend?: string
  extra?: ReactNode
  className?: string
}) {
  const [from, to, text, bg] = kpiTones[tone].split(' ')
  return (
    <div className={cn('flex items-center gap-3.5 rounded-2xl border border-line bg-gradient-to-br p-4', from, to, className)}>
      <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl [&_svg]:size-6', bg, text)}>{icon}</span>
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm leading-tight font-medium text-muted-foreground">{label}</p>
        <p className="flex flex-wrap items-baseline gap-x-2 text-2xl font-extrabold text-navy-900">
          {value}
          {extra && <span className="text-sm font-semibold text-muted-foreground">{extra}</span>}
        </p>
        {trend && (
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="size-3.5" />
            {trend}
          </p>
        )}
      </div>
    </div>
  )
}

export function KpiGrid({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 | 5 | 6 }) {
  const c = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' }[cols]
  return <div className={cn('grid gap-4 sm:grid-cols-2', c)}>{children}</div>
}

/** En-tête de page : titre, sous-titre, actions. */
export function PageTitle({
  title,
  subtitle,
  icon,
  actions,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-4', className)}>
      <div className="flex items-start gap-3">
        {icon && <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-600 [&_svg]:size-6">{icon}</span>}
        <div>
          <h1 className="text-2xl text-navy-900 md:text-[1.7rem]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
      <ArrowLeft className="size-4" />
      {children}
    </Link>
  )
}

/** Encadré « Bon à savoir », « Conseil »… */
export function Tip({
  title,
  children,
  tone = 'blue',
  icon,
  className,
}: {
  title?: ReactNode
  children: ReactNode
  tone?: 'blue' | 'green' | 'amber' | 'violet'
  icon?: ReactNode
  className?: string
}) {
  const { t } = useTranslation()
  const heading = title === undefined ? t('blocks.tip') : title
  const toneClass = {
    blue: 'border-brand-100 bg-brand-50/70 text-brand-700',
    green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    violet: 'border-violet-100 bg-violet-50 text-violet-700',
  }[tone]
  return (
    <div className={cn('flex gap-3 rounded-2xl border p-4', toneClass, className)}>
      <span className="mt-0.5 shrink-0 [&_svg]:size-5">{icon ?? (tone === 'amber' ? <Lightbulb /> : <Info />)}</span>
      <div className="text-sm">
        {heading && <p className="font-bold">{heading}</p>}
        <div className="mt-0.5 text-ink/80">{children}</div>
      </div>
    </div>
  )
}

/** Liste à coches vertes. */
export function Checklist({ items, className, tone = 'green' }: { items: ReactNode[]; className?: string; tone?: 'green' | 'blue' }) {
  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <CheckCircle2 className={cn('mt-0.5 size-4 shrink-0', tone === 'green' ? 'text-emerald-500' : 'text-brand-600')} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

/** Ligne libellé / valeur. */
export function InfoRow({ icon, label, value, className }: { icon?: ReactNode; label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start gap-3 py-2 text-sm', className)}>
      {icon && <span className="mt-0.5 text-brand-600 [&_svg]:size-4">{icon}</span>}
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto text-right font-semibold text-navy-900">{value}</span>
    </div>
  )
}

export function IconBtn({ label, children, onClick, className }: { label: string; children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={cn('grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-navy-900 [&_svg]:size-4', className)}>
      {children}
    </button>
  )
}

/** Tuile d'action rapide (icône + libellé + chevron). */
export function QuickAction({ icon, label, to, onClick, tone = 'neutral' }: { icon: ReactNode; label: ReactNode; to?: string; onClick?: () => void; tone?: 'neutral' | 'primary' }) {
  const cls = cn(
    'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors [&_svg]:size-5',
    tone === 'primary' ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-white text-navy-900 ring-1 ring-line hover:bg-brand-50',
  )
  if (to)
    return (
      <Link to={to} className={cls}>
        {icon}
        {label}
      </Link>
    )
  return (
    <button type="button" onClick={onClick} className={cls}>
      {icon}
      {label}
    </button>
  )
}

/** Pied de formulaire : Annuler / Brouillon / Valider. */
export function FormFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5', className)}>{children}</div>
}

/** Pastille icône colorée carrée. */
export function IconTile({ icon, tone = 'blue', size = 'md' }: { icon: ReactNode; tone?: KpiTone; size?: 'sm' | 'md' | 'lg' }) {
  const [, , text, bg] = kpiTones[tone].split(' ')
  const s = { sm: 'size-9 [&_svg]:size-4 rounded-xl', md: 'size-11 [&_svg]:size-5 rounded-xl', lg: 'size-14 [&_svg]:size-7 rounded-2xl' }[size]
  return <span className={cn('grid shrink-0 place-items-center', s, bg, text)}>{icon}</span>
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <Card className="p-8 text-center text-sm text-muted-foreground">{children}</Card>
}
