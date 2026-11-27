import { Suspense } from 'react'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from '@/shared/errors/ErrorBoundary'
import { PageLoader } from '@/shared/ui/PageLoader'
import { router } from './routes'

/**
 * Coquille de l'application : les routes, l'écran de secours si tout plante
 * et les messages éphémères.
 */
export function App() {
  const { t } = useTranslation('layout')
  return (
    <>
      <ErrorBoundary>
        {/* Un cadre qui lit la base (ex. l'espace pro) attend ici qu'elle soit prête. */}
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
      <Toaster position="top-right" richColors closeButton mobileOffset={12} toastOptions={{ closeButtonAriaLabel: t('toast.fermer') }} />
    </>
  )
}
