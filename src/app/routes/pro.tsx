import { createRoute, type RouteComponent } from '@tanstack/react-router'
import { ProLayout } from '@/app/layouts/ProLayout'
import { ROUTE_PATTERNS as P } from '@/shared/utils/routes'
import { Contenus, CreerFormation, Dashboard, Formations, InviterUtilisateur, Parametres, Profil, Publication, Statistiques } from './pages'
import { racine } from './racine'

/** L'espace professionnel École : barre latérale, barre du haut, garde d'accès (ProLayout). */
const cadre = createRoute({ getParentRoute: () => racine, path: P.pro.root, component: ProLayout })

const page = (path: string, Page: RouteComponent) => createRoute({ getParentRoute: () => cadre, path, component: Page })

export const routesPro = cadre.addChildren([
  page('/', Dashboard),
  page(P.pro.profile, Profil),
  page(P.pro.trainings, Formations),
  page(P.pro.newTraining, CreerFormation),
  page(P.pro.editTraining, CreerFormation),
  page(P.pro.publication, Publication),
  page(P.pro.contents, Contenus),
  page(P.pro.statistics, Statistiques),
  page(P.pro.inviteUser, InviterUtilisateur),
  page(P.pro.settings, Parametres),
])
