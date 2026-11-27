import { Suspense, lazy } from 'react'

/** Outils de TanStack Router, en développement seulement (absents du build). */
const Outils = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-router-devtools').then((m) => ({ default: () => <m.TanStackRouterDevtools position="bottom-right" /> })))
  : () => null

export function Devtools() {
  return (
    <Suspense>
      <Outils />
    </Suspense>
  )
}
