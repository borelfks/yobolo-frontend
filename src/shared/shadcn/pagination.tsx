import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

/**
 * La pagination du canevas : numéros de 32 px, page courante en bleu nuit,
 * flèches « Page précédente / suivante ». Composants de présentation : le
 * calcul des pages est dans `Pagination` (shared/ui) qui les assemble.
 */
function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  const { t } = useTranslation()
  return <nav aria-label={t('pagination.label')} data-slot="pagination" className={cn('flex w-full justify-center', className)} {...props} />
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex flex-row items-center gap-1', className)} {...props} />
}

function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

const page =
  'grid h-8 min-w-8 cursor-pointer place-items-center rounded-xs border-0 bg-transparent px-2 text-sm font-semibold text-muted-foreground no-underline outline-none hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:size-4'

type PaginationButtonProps = React.ComponentProps<'button'> & { isActive?: boolean }

/** Un numéro de page (bouton). `isActive` : page courante. */
function PaginationButton({ className, isActive, ...props }: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      className={cn(page, isActive && 'bg-foreground text-white hover:bg-foreground', className)}
      {...props}
    />
  )
}

function PaginationPrevious({ disabled, ...props }: React.ComponentProps<'button'>) {
  const { t } = useTranslation()
  return (
    <PaginationButton aria-label={t('pagination.previous')} aria-disabled={disabled || undefined} disabled={disabled} {...props}>
      <ChevronLeft aria-hidden />
    </PaginationButton>
  )
}

function PaginationNext({ disabled, ...props }: React.ComponentProps<'button'>) {
  const { t } = useTranslation()
  return (
    <PaginationButton aria-label={t('pagination.next')} aria-disabled={disabled || undefined} disabled={disabled} {...props}>
      <ChevronRight aria-hidden />
    </PaginationButton>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn('grid h-8 min-w-8 place-items-center text-sm text-subtle-foreground', className)} {...props}>
      …
    </span>
  )
}

export { Pagination, PaginationContent, PaginationItem, PaginationButton, PaginationPrevious, PaginationNext, PaginationEllipsis }
