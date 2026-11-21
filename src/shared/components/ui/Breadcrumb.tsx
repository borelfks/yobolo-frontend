import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

export type Crumb = { label: string; to?: string }

export function Breadcrumb({ items, className, light }: { items: Crumb[]; className?: string; light?: boolean }) {
  const { t } = useTranslation()
  return (
    <nav aria-label={t('breadcrumb.label')} className={cn('flex flex-wrap items-center gap-1.5 text-sm', light ? 'text-white/80' : 'text-muted', className)}>
      <Link to={ROUTES.home} aria-label={t('breadcrumb.home')} className="hover:text-brand-600">
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
