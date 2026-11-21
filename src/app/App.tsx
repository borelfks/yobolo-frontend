import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/shared/components/errors/ErrorBoundary'
import { router } from './routes'

/**
 * Coquille de l'application : les routes, l'écran de secours si tout plante
 * et les messages éphémères.
 */
export function App() {
  return (
    <>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}
