import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

/**
 * Pagination d'une liste : la page est tenue par l'écran (`page`, `onChange`),
 * qui affiche la tranche correspondante (voir `pageDe`). Une seule page : seul
 * le libellé s'affiche.
 */
export function Pagination({ label, pages, page, onChange }: { label: ReactNode; pages: number; page: number; onChange: (page: number) => void }) {
  const { t } = useTranslation()
  const aller = (p: number) => {
    onChange(Math.min(pages, Math.max(1, p)))
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm text-muted-foreground">
      <span>{label}</span>
      {pages > 1 && (
        <div className="flex items-center gap-1">
          <button type="button" aria-label={t('pagination.previous')} disabled={page <= 1} onClick={() => aller(page - 1)} className="grid size-8 place-items-center rounded-lg ring-1 ring-line hover:bg-slate-50 disabled:opacity-40">
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => aller(p)}
              className={cn('grid size-8 place-items-center rounded-lg font-semibold', p === page ? 'bg-brand-600 text-white' : 'text-ink ring-1 ring-line hover:bg-slate-50')}
            >
              {p}
            </button>
          ))}
          <button type="button" aria-label={t('pagination.next')} disabled={page >= pages} onClick={() => aller(page + 1)} className="grid size-8 place-items-center rounded-lg ring-1 ring-line hover:bg-slate-50 disabled:opacity-40">
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
