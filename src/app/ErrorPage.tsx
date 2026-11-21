import { ErrorScreen } from '@/shared/components/errors/ErrorScreens'

/** Écran affiché par le routeur si une route plante en dehors d'un cadre. */
export function ErrorPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-4 py-16">
      <ErrorScreen />
    </div>
  )
}
