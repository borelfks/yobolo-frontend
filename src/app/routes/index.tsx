import { createRouter } from '@tanstack/react-router'
import { PageSpinner } from '@/shared/blocs/Chargement'
import { ecrireRecherche, lireRecherche } from '@/shared/utils/cible'
import { routesAuth } from './auth'
import { routesDeveloppement } from './developpement'
import { routesLanding } from './landing'
import { routesPro } from './pro'
import { routesPubliques } from './public'
import { racine } from './racine'

/**
 * La table des routes (TanStack Router), un fichier par cadre :
 * racine.tsx · auth.tsx (connexion, inscription) · landing.tsx · public.tsx
 * (pages publiques) · pro.tsx (espace pro) · developpement.tsx (design system).
 * Les pages sont dans pages.ts ; les adresses viennent de ROUTES / ROUTE_PATTERNS
 * (src/shared/utils/routes.ts).
 *
 * Le routeur n'est pas « enregistré » (pas de `declare module … Register`) :
 * les liens utilisent les adresses calculées par ROUTES (« /ecoles/ipes/… »),
 * qui ne sont pas typées route par route.
 */
const arbre = racine.addChildren([...routesDeveloppement, ...routesAuth, routesLanding, routesPubliques, routesPro])

export const router = createRouter({
  routeTree: arbre,
  // Le défilement revient en haut à chaque page (et retrouve sa place au retour arrière).
  scrollRestoration: true,
  defaultPendingComponent: PageSpinner,
  // La recherche reste du texte simple (« ?domaine=a&domaine=b »), lue et écrite sans conversion.
  parseSearch: (texte) => lireRecherche(texte.replace(/^\?/, '')),
  stringifySearch: ecrireRecherche,
})

/** L'état transmis à une navigation : l'inscription reprise à l'étape des pièces (Connexion → Inscription). */
declare module '@tanstack/history' {
  interface HistoryState {
    reprise?: string
  }
}
