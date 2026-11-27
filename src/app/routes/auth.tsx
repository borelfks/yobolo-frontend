import { createRoute } from '@tanstack/react-router'
import { ROUTES } from '@/shared/utils/routes'
import { Connexion, Inscription, MotDePasseOublie } from './pages'
import { racine } from './racine'

/** Connexion, inscription, mot de passe oublié : sans cadre (chaque page porte le sien). */
export const routesAuth = [
  createRoute({ getParentRoute: () => racine, path: ROUTES.signIn, component: Connexion }),
  createRoute({ getParentRoute: () => racine, path: ROUTES.signUp, component: Inscription }),
  createRoute({ getParentRoute: () => racine, path: ROUTES.forgotPassword, component: MotDePasseOublie }),
]
