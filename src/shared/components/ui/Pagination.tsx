import { useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

export function Pagination({ label, pages = 3, current = 1 }: { label: ReactNode; pages?: number; current?: number }) {
  const { t } = useTranslation()
  const [page, setPage] = useState(current)
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm text-muted">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <button type="button" aria-label={t('pagination.previous')} onClick={() => setPage(Math.max(1, page - 1))} className="grid size-8 place-items-center rounded-lg ring-1 ring-line hover:bg-slate-50">
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
        <button type="button" aria-label={t('pagination.next')} onClick={() => setPage(Math.min(pages, page + 1))} className="grid size-8 place-items-center rounded-lg ring-1 ring-line hover:bg-slate-50">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
