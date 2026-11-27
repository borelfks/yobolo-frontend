import { createRoute, type RouteComponent } from '@tanstack/react-router'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { ROUTES, ROUTE_PATTERNS as P } from '@/shared/utils/routes'
import { GardeListing } from './GardeListing'
import {
  Accueil,
  AutoEcoleProfil,
  AutoEcoles,
  EcoleProfil,
  EcolesHub,
  Favoris,
  FormationDetail,
  HorsPerimetre,
  MesNotifications,
  MesParametres,
  MonProfil,
  NotFound,
  PermisDetail,
  PublicationLue,
  TypeListing,
} from './pages'
import { racine } from './racine'

/** Le cadre des pages publiques (barre du haut, pied de page). */
const cadre = createRoute({ getParentRoute: () => racine, id: 'public', component: PublicLayout })

/** Une page du cadre public ; `garde` : une école connectée est renvoyée vers son espace (GardeListing). */
const page = (path: string, Page: RouteComponent, garde = false) =>
  createRoute({
    getParentRoute: () => cadre,
    path,
    component: garde
      ? () => (
          <GardeListing>
            <Page />
          </GardeListing>
        )
      : Page,
  })

export const routesPubliques = cadre.addChildren([
  page(P.accueil, Accueil),
  page(P.publication, PublicationLue),
  page(ROUTES.schools, EcolesHub, true),
  page(ROUTES.favorites, Favoris),
  page(P.notifications, MesNotifications),
  page(P.profil, MonProfil),
  page(P.parametres, MesParametres),
  page(P.training, FormationDetail),
  page(P.drivingSchools, AutoEcoles, true),
  page(P.license, PermisDetail),
  page(P.drivingSchool, AutoEcoleProfil),
  page(P.school, EcoleProfil),
  page(P.schoolType, TypeListing, true),
  page(ROUTES.consultation, HorsPerimetre),
  page(ROUTES.emploi, HorsPerimetre),
  page(ROUTES.courses, HorsPerimetre),
  page(ROUTES.library, HorsPerimetre),
  page(ROUTES.help, HorsPerimetre),
  page(ROUTES.terms, HorsPerimetre),
  // Adresse inconnue : la 404 reste dans le cadre public.
  page('$', NotFound),
])
