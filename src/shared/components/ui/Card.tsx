import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-2xl border border-line bg-white shadow-[0_1px_3px_rgba(15,29,61,0.05)]', className)}
      {...props}
    />
  )
}

export function CardHeader({
  title,
  icon,
  action,
  subtitle,
  className,
}: {
  title: ReactNode
  icon?: ReactNode
  action?: ReactNode
  subtitle?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h3 className="flex items-center gap-2 text-base font-bold text-navy-900 [&_svg]:size-5 [&_svg]:text-brand-600">
          {icon}
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/** Carte avec titre : la brique la plus fréquente de la maquette. */
export function Section({
  title,
  icon,
  action,
  subtitle,
  children,
  className,
  bodyClassName,
}: {
  title: ReactNode
  icon?: ReactNode
  action?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <Card className={cn('p-5', className)}>
      <CardHeader title={title} icon={icon} action={action} subtitle={subtitle} />
      <div className={cn('mt-4', bodyClassName)}>{children}</div>
    </Card>
  )
}

/** Bloc numéroté « 1 Informations générales » des formulaires longs. */
export function NumberedBlock({
  n,
  title,
  children,
  className,
}: {
  n: number
  title: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-2xl border border-line bg-white p-5', className)}>
      <h3 className="mb-4 flex items-center gap-2.5 text-base font-bold text-navy-900">
        <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-sm text-white">{n}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}
