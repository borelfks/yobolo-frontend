import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { PageSpinner } from '@/shared/blocs/Chargement'
import { ErrorBoundary } from '@/shared/errors/ErrorBoundary'

/**
 * Contenu d'un cadre (pages publiques, espace pro) : la page se charge et, si
 * elle plante ou ne peut pas se télécharger, l'écran d'erreur s'affiche dans le
 * cadre, qui reste utilisable (menu, en-tête).
 */
export function RouteOutlet() {
  const { pathname } = useLocation()
  return (
    <ErrorBoundary resetKey={pathname} inline>
      <Suspense fallback={<PageSpinner />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  )
}
