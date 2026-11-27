import { MessagePage } from '@/shared/blocs/Etats'

/** Écran affiché par le routeur si une route plante en dehors d'un cadre. */
export function ErrorPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <MessagePage type="erreur" />
    </div>
  )
}
