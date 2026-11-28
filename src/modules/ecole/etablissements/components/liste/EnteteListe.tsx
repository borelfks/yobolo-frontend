import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toggleVariants } from '@/shared/shadcn/variants'
import { Lien } from '@/shared/ui/Lien'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import type { GenreEcole } from '@/modules/ecole/etablissements/schoolListing'

const GENRES: { genre: GenreEcole; to: string }[] = [
  { genre: 'ipes', to: ROUTES.schoolType('ipes') },
  { genre: 'cfp', to: ROUTES.schoolType('cfp') },
  { genre: 'autres', to: ROUTES.schoolType('autres') },
  { genre: 'auto', to: ROUTES.drivingSchools },
]

/** Une rangée de pilules du canevas : défile de côté sur téléphone, passe à la ligne sur ordinateur. */
export function RangeePilules({ children, label, className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <div role={label ? 'group' : undefined} aria-label={label} className={cn('flex items-center gap-2 px-4 max-sm:overflow-x-auto max-sm:[scrollbar-width:none] sm:flex-wrap', className)}>
      {children}
    </div>
  )
}

/**
 * L'en-tête des listes (IPES, CFP, Autres, Auto-écoles) : titre, phrase
 * d'introduction, pilules des types (la courante en vert), puis, sous un
 * filet, la rangée des filtres.
 */
export function EnteteListe({ titre, intro, genre, nombres, filtres }: { titre: string; intro: string; genre: GenreEcole; nombres: Record<GenreEcole, number>; filtres: ReactNode }) {
  const { t } = useTranslation('schools')
  return (
    <section className="flex flex-col gap-3 border-b border-border bg-card pt-4 pb-3 sm:rounded-lg sm:border">
      <div className="flex flex-col gap-1 px-4">
        <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-foreground sm:text-titre">{titre}</h1>
        <p className="text-sm text-muted-foreground">{intro}</p>
      </div>
      <nav aria-label={t('liste.typesAria')}>
        <RangeePilules>
          {GENRES.map((g) => {
            const courant = g.genre === genre
            return (
              <Lien
                key={g.genre}
                to={g.to}
                aria-current={courant ? 'page' : undefined}
                data-state={courant ? 'on' : 'off'}
                className={cn(toggleVariants({ variant: 'outline' }), 'flex-none border-input px-3 text-sm no-underline hover:border-foreground-soft data-[state=on]:hover:bg-success')}
              >
                {t(`liste.genres.${g.genre}`, { n: nombres[g.genre] })}
              </Lien>
            )
          })}
        </RangeePilules>
      </nav>
      <div className="h-px bg-border" />
      {filtres}
    </section>
  )
}
