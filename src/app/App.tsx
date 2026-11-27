import { Suspense } from 'react'
import { RouterProvider } from 'react-router'
import { ErrorBoundary } from '@/shared/errors/ErrorBoundary'
import { BandeauHorsLigne } from '@/shared/blocs/BandeauHorsLigne'
import { PageSpinner } from '@/shared/blocs/Chargement'
import { Toaster } from '@/shared/shadcn/sonner'
import { TooltipProvider } from '@/shared/shadcn/tooltip'
import { router } from './routes'

/**
 * Coquille de l'application : les routes, l'écran de secours si tout plante,
 * les messages éphémères et le bandeau « hors connexion ».
 */
export function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <ErrorBoundary>
        {/* Un cadre qui lit la base (ex. l'espace pro) attend ici qu'elle soit prête. */}
        <Suspense fallback={<PageSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
      <Toaster mobileOffset={12} />
      <BandeauHorsLigne />
    </TooltipProvider>
  )
}
