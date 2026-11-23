import { Suspense } from 'react'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/shared/components/errors/ErrorBoundary'
import { PageLoader } from '@/shared/components/ui/PageLoader'
import { router } from './routes'

/**
 * Coquille de l'application : les routes, l'écran de secours si tout plante
 * et les messages éphémères.
 */
export function App() {
  return (
    <>
      <ErrorBoundary>
        {/* Un cadre qui lit la base (ex. l'espace pro) attend ici qu'elle soit prête. */}
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}
