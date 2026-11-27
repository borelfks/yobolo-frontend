import { Outlet, createRootRoute } from '@tanstack/react-router'
// Chargée d'emblée : elle sert d'écran de secours si une route plante.
import { ErrorPage } from '@/app/ErrorPage'
import { Devtools } from './Devtools'

/** La racine : chaque cadre (landing, pages publiques, espace pro, connexion) est une route enfant. */
export const racine = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Devtools />
    </>
  ),
  errorComponent: ErrorPage,
})
