import { lazy } from 'react'
import { createRoute } from '@tanstack/react-router'
import { ROUTES } from '@/shared/utils/routes'
import { racine } from './racine'

/** Le design system : en développement seulement (le build ne contient pas son fichier). */
export const routesDeveloppement = import.meta.env.DEV
  ? [
      createRoute({
        getParentRoute: () => racine,
        path: ROUTES.designSystem,
        component: lazy(() => import('@/modules/design-system/pages/DesignSystem').then((m) => ({ default: m.DesignSystem }))),
      }),
    ]
  : []
