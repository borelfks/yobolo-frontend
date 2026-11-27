import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/shadcn/skeleton'
import { cn } from '@/shared/utils/cn'

/**
 * Squelettes prêts à l'emploi : ils reprennent la forme des blocs du canevas
 * (mêmes hauteurs, mêmes écarts) pour que la page ne saute pas à l'arrivée
 * des données. Le conteneur annonce le chargement ; les blocs sont muets.
 */
export function SkeletonZone({ children, className }: { children: React.ReactNode; className?: string }) {
  const { t } = useTranslation()
  return (
    <div role="status" aria-label={t('loading')} aria-busy="true" className={cn('flex flex-col gap-4', className)}>
      {children}
    </div>
  )
}

/** Quelques lignes de texte ; la dernière est plus courte. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

/** En-tête de page : fil d'Ariane, titre, description, boutons. */
export function SkeletonPageHeader({ actions = 0, description = true }: { actions?: number; description?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-7 w-72 max-w-full" />
        {description && <Skeleton className="h-4 w-96 max-w-full" />}
      </div>
      {actions > 0 && (
        <div className="flex gap-2">
          {Array.from({ length: actions }, (_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-full" />
          ))}
        </div>
      )}
    </div>
  )
}

/** Une carte : image (facultative), titre, deux lignes. */
export function SkeletonCard({ image = false, className }: { image?: boolean; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      {image && <Skeleton className="h-36 w-full rounded-none" />}
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-4 w-3/4" />
        <SkeletonText lines={2} />
      </div>
    </div>
  )
}

/** Une liste de lignes (avatar ou pastille, deux lignes de texte, action). */
export function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-border bg-card px-5', className)}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={cn('flex items-center gap-3 py-3.5', i > 0 && 'border-t border-border')}>
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

/** Un tableau : en-tête et lignes. */
export function SkeletonTable({ rows = 6, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      <div className="flex gap-6 border-b border-border px-4 py-3">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-6 border-b border-border px-4 py-3.5 last:border-b-0">
          {Array.from({ length: columns }, (_, c) => (
            <Skeleton key={c} className={cn('h-3.5 flex-1', c === 0 && 'flex-[2]')} />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Une rangée de chiffres clés (tuiles). */
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-3.5">
          <Skeleton className="h-3 w-24 bg-border" />
          <Skeleton className="h-6 w-16 bg-border" />
        </div>
      ))}
    </div>
  )
}
