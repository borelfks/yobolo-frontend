import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/shared/shadcn/dropdown-menu'
import { Pagination, PaginationButton, PaginationContent, PaginationEllipsis, PaginationItem } from '@/shared/shadcn/pagination'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'

/**
 * « Trier par : Pertinence ▾ » : le tri choisi s'ouvre en menu. `libelle`
 * remplace « Trier par : » (« Trier : » sur la fiche d'une auto-école).
 */
export function MenuTri<V extends string>({ valeur, options, onChange, libelle }: { valeur: V; options: { valeur: V; libelle: string }[]; onChange: (v: V) => void; libelle?: string }) {
  const { t } = useTranslation('schools')
  const courant = options.find((o) => o.valeur === valeur) ?? options[0]!
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link-muted" className="text-meta font-semibold hover:no-underline">
          {libelle ?? t('ui.trier')}{' '}
          <b className="text-foreground">
            {courant.libelle} <span aria-hidden>▾</span>
          </b>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={valeur} onValueChange={(v) => onChange(v as V)}>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.valeur} value={o.valeur}>
              {o.libelle}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** La ligne au-dessus des résultats : leur nombre en gras, le tri à droite. */
export function BarreResultats<V extends string>({ texte, tri }: { texte: string; tri: Parameters<typeof MenuTri<V>>[0] }) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-1 sm:px-0.5">
      <h2 className="text-sm font-bold text-foreground">{texte}</h2>
      <MenuTri {...tri} />
    </div>
  )
}

/** Les numéros affichés : tous jusqu'à 7 pages (5 sur téléphone), sinon la première, les voisines, la dernière. */
function numeros(page: number, pages: number) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  return [...new Set([1, page - 1, page, page + 1, pages].filter((x) => x >= 1 && x <= pages))].sort((a, b) => a - b)
}

/**
 * La pagination des listes : « 1 – 10 sur 24 établissements » à gauche,
 * Précédent, numéros (avec « … »), Suivant à droite (seulement s'il y a
 * plusieurs pages).
 */
export function PaginationListe({ page, pages, total, parPage, unite, onPage, className }: { page: number; pages: number; total: number; parPage: number; unite: string; onPage: (p: number) => void; className?: string }) {
  const { t } = useTranslation('schools')
  const debut = total ? (page - 1) * parPage + 1 : 0
  const fin = Math.min(page * parPage, total)
  const liste = numeros(page, pages)
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-2.5 px-4 pt-1 pb-2 sm:px-0.5', className)}>
      <span className="text-sm text-muted-foreground">{t('ui.plage', { debut: num(debut), fin: num(fin), total: num(total), unite })}</span>
      {pages > 1 && (
        <Pagination className="w-auto">
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationButton aria-label={t('ui.precedentAria')} aria-disabled={page === 1 || undefined} disabled={page === 1} onClick={() => onPage(page - 1)} className="flex items-center gap-1 px-2.5">
                <ChevronLeft aria-hidden />
                <span className="max-sm:sr-only">{t('ui.precedent')}</span>
              </PaginationButton>
            </PaginationItem>
            {liste.map((n, i) => (
              <PaginationItem key={n} className="flex items-center">
                {i > 0 && n - liste[i - 1]! > 1 && <PaginationEllipsis />}
                <PaginationButton isActive={n === page} aria-label={t('ui.pageAria', { n })} onClick={() => onPage(n)}>
                  {n}
                </PaginationButton>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationButton aria-label={t('ui.suivantAria')} aria-disabled={page === pages || undefined} disabled={page === pages} onClick={() => onPage(page + 1)} className="flex items-center gap-1 px-2.5">
                <span className="max-sm:sr-only">{t('ui.suivant')}</span>
                <ChevronRight aria-hidden />
              </PaginationButton>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
