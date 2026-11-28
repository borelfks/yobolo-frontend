import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import { PaginationButton, PaginationEllipsis } from '@/shared/shadcn/pagination'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import type { FormationPro } from '@/shared/types'
import { MenuPlus, StatutBadge, type ActionMenu } from '@/modules/ecole/espace-pro/components/BlocsPro'

/** Teinte de la pastille du diplôme (valeur `ton` des données). */
const TONS: Record<string, string> = {
  blue: 'bg-primary-tint text-primary-strong',
  violet: 'bg-tone-violet-soft text-tone-violet',
  sky: 'bg-tone-teal-soft text-tone-teal',
  green: 'bg-success-soft text-success',
  pink: 'bg-tone-pink-soft text-tone-pink',
  orange: 'bg-tone-orange-soft text-tone-orange',
}

const COLONNES = 'lg:grid lg:grid-cols-[minmax(0,2.4fr)_1.3fr_0.7fr_0.7fr_1fr_0.9fr_84px] lg:items-center lg:gap-3'

/** Une cellule : sur téléphone, son libellé à gauche. */
function Cellule({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="flex gap-1.5 text-sm text-foreground lg:block lg:text-foreground-soft">
      <span className="min-w-[120px] shrink-0 font-semibold text-muted-foreground lg:hidden">{label}</span>
      {children}
    </span>
  )
}

/** Le tableau de « Gérer les formations » : en-tête (ordinateur), une ligne par formation, actions. */
export function ListeFormations({ lignes, duree, rentree, actions }: { lignes: FormationPro[]; duree: (d: string) => string; rentree: (f: FormationPro) => string; actions: (f: FormationPro) => ActionMenu[] }) {
  const { t } = useTranslation('pro', { keyPrefix: 'formations.tableau' })
  return (
    <div role="table" aria-label={t('aria')}>
      <div role="row" className={cn('hidden pb-2.5 text-xs font-bold tracking-[0.02em] text-muted-foreground uppercase', COLONNES)}>
        {(['formation', 'filiere', 'diplome', 'duree', 'rentree', 'statut'] as const).map((c) => (
          <span key={c} role="columnheader">
            {t(c)}
          </span>
        ))}
        <span role="columnheader" className="text-right">
          {t('actions')}
        </span>
      </div>
      {lignes.map((f) => (
        <div key={f.id} role="row" className={cn('flex flex-col gap-1.5 border-t border-border py-3.5 lg:py-3', COLONNES)}>
          <span role="cell" className="flex min-w-0 items-center gap-2.5">
            <span className={cn('grid size-11 shrink-0 place-items-center rounded-md text-legende font-extrabold', TONS[f.ton] ?? TONS.blue)}>{f.diplome}</span>
            <span className="flex min-w-0 flex-col">
              <Lien to={ROUTES.pro.editTraining(f.id)} className="text-ui font-bold text-foreground no-underline hover:text-primary">
                {f.nom}
              </Lien>
              <span className="text-xs font-medium text-muted-foreground">{t('code', { code: f.code })}</span>
            </span>
          </span>
          <span role="cell">
            <Cellule label={t('filiere')}>{f.filiere}</Cellule>
          </span>
          <span role="cell">
            <Cellule label={t('diplome')}>{f.diplome}</Cellule>
          </span>
          <span role="cell">
            <Cellule label={t('duree')}>{duree(f.duree)}</Cellule>
          </span>
          <span role="cell">
            <Cellule label={t('rentreeCourt')}>{rentree(f)}</Cellule>
          </span>
          <span role="cell">
            <StatutBadge statut={f.statut} />
          </span>
          <span role="cell" className="flex justify-end gap-1 max-lg:-mt-1">
            <Button asChild variant="ghost" size="icon" className="bg-primary-soft text-primary-strong hover:bg-primary-tint">
              <Lien to={ROUTES.pro.editTraining(f.id)} aria-label={t('modifier', { name: f.nom })}>
                <Pencil className="size-4" aria-hidden />
              </Lien>
            </Button>
            <MenuPlus label={t('plus', { name: f.nom })} actions={actions(f)} />
          </span>
        </div>
      ))}
    </div>
  )
}

/** « 1 – 10 sur 12 formations », puis Précédent · numéros · Suivant (s'il y a plusieurs pages). */
export function PaginationFormations({ total, parPage, page, onPage }: { total: number; parPage: number; page: number; onPage: (p: number) => void }) {
  const { t } = useTranslation('pro', { keyPrefix: 'formations.pagination' })
  const pages = Math.max(1, Math.ceil(total / parPage))
  const debut = total ? (page - 1) * parPage + 1 : 0
  const fin = Math.min(page * parPage, total)
  const voisins = [...new Set([1, page - 1, page, page + 1, pages].filter((x) => x >= 1 && x <= pages))].sort((a, b) => a - b)
  const nums = pages <= 7 ? Array.from({ length: pages }, (_, i) => i + 1) : voisins
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border pt-3">
      <span className="text-sm text-muted-foreground">{total ? t('texte', { debut: num(debut), fin: num(fin), total: num(total), count: total }) : t('aucun')}</span>
      {pages > 1 && (
        <nav aria-label={t('aria')} className="flex flex-wrap items-center gap-1">
          <PaginationButton aria-label={t('precedenteAria')} aria-disabled={page === 1 || undefined} onClick={() => page > 1 && onPage(page - 1)} className="flex gap-1 px-2.5">
            <ChevronLeft aria-hidden />
            <span className="max-sm:sr-only">{t('precedent')}</span>
          </PaginationButton>
          {nums.map((n, i) => (
            <span key={n} className="flex items-center gap-1">
              {i > 0 && n - nums[i - 1]! > 1 && <PaginationEllipsis />}
              <PaginationButton isActive={n === page} aria-label={t('page', { n })} onClick={() => onPage(n)}>
                {n}
              </PaginationButton>
            </span>
          ))}
          <PaginationButton aria-label={t('suivanteAria')} aria-disabled={page === pages || undefined} onClick={() => page < pages && onPage(page + 1)} className="flex gap-1 px-2.5">
            <span className="max-sm:sr-only">{t('suivant')}</span>
            <ChevronRight aria-hidden />
          </PaginationButton>
        </nav>
      )}
    </div>
  )
}
