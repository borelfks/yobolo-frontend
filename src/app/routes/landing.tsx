import { createRoute } from '@tanstack/react-router'
import { LandingLayout } from '@/app/layouts/LandingLayout'
import { GardeAccueil } from './GardeAccueil'
import { Home } from './pages'
import { racine } from './racine'

/**
 * La landing, copiée de yibolo-client : son propre cadre (en-tête flottant,
 * pied de page). Réservée aux visiteurs : un compte connecté est mené à sa
 * page d'arrivée (GardeAccueil).
 */
const cadre = createRoute({
  getParentRoute: () => racine,
  id: 'landing',
  component: () => (
    <GardeAccueil>
      <LandingLayout />
    </GardeAccueil>
  ),
})

export const routesLanding = cadre.addChildren([createRoute({ getParentRoute: () => cadre, path: '/', component: Home })])
