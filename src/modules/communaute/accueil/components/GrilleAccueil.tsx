import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CarteExperts, SujetsDuMoment } from '@/modules/communaute/accueil/components/ColonneDroite'
import { CarteMoi, MesDomaines } from '@/modules/communaute/accueil/components/ColonneGauche'
import { Skeleton } from '@/shared/shadcn/skeleton'
import { SkeletonZone } from '@/shared/blocs/Squelettes'

const GRILLE = 'flex flex-col pb-2 lg:mx-auto lg:grid lg:w-full lg:max-w-page lg:grid-cols-[225px_minmax(0,1fr)_300px] lg:items-start lg:gap-6 lg:px-4 lg:pt-6 lg:pb-12'

/**
 * Les trois colonnes de l'accueil (canevas) : le compte et « Mes domaines » à
 * gauche, le fil (ou la publication ouverte) au centre, les experts et les
 * sujets du moment à droite. Sur téléphone, seule la colonne du centre reste.
 */
export function GrilleAccueil({ children, enTeteDroite }: { children: ReactNode; /** En tête de la colonne de droite (l'auteur d'une publication ouverte). */ enTeteDroite?: ReactNode }) {
  const { t } = useTranslation('accueil')
  return (
    <div className={GRILLE}>
      <aside aria-label={t('grille.gauche')} className="hidden flex-col gap-2 lg:flex">
        <CarteMoi />
        <MesDomaines />
      </aside>
      <div className="flex min-w-0 flex-col gap-2">{children}</div>
      <aside aria-label={t('grille.droite')} className="hidden flex-col gap-2 lg:flex">
        {enTeteDroite}
        <CarteExperts />
        <SujetsDuMoment />
      </aside>
    </div>
  )
}

/** Le squelette de l'accueil : les mêmes colonnes, une barre et deux publications. */
export function SqueletteAccueil() {
  const carte = 'border-y border-border bg-card lg:rounded-lg lg:border'
  return (
    <SkeletonZone className={GRILLE}>
      <div className="hidden flex-col gap-2 lg:flex">
        <Skeleton className="h-56 rounded-lg" />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <Skeleton className="h-24 rounded-none lg:rounded-lg" />
        {[0, 1].map((k) => (
          <div key={k} className={`${carte} flex flex-col gap-3 p-4`}>
            <div className="flex gap-2">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
      <div className="hidden flex-col gap-2 lg:flex">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-56 rounded-lg" />
      </div>
    </SkeletonZone>
  )
}
