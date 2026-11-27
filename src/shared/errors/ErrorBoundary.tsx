import { Component, type ReactNode } from 'react'
import { ErrorScreen, OfflineScreen } from '@/shared/errors/ErrorScreens'

/**
 * Une page qui n'a pas pu se télécharger (réseau coupé) lève ce type d'erreur,
 * avec un texte qui dépend du navigateur.
 */
const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk/i

function isConnectionError(error: unknown) {
  if (!navigator.onLine) return true
  return error instanceof Error && CHUNK_ERROR.test(`${error.name} ${error.message}`)
}

type Props = {
  children: ReactNode
  /** Change à chaque page : l'erreur s'efface quand on navigue ailleurs. */
  resetKey?: string
  /** Dans un cadre (en-tête, barre latérale) plutôt qu'en plein écran. */
  inline?: boolean
}

type State = { error: unknown; failed: boolean; key?: string }

/**
 * Affiche un écran d'erreur au lieu d'un écran blanc si une page plante :
 *   - « Pas de connexion internet » si la page n'a pas pu se télécharger ;
 *   - « Une erreur est survenue » sinon.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, failed: false, key: this.props.resetKey }

  static getDerivedStateFromError(error: unknown) {
    return { error, failed: true }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.resetKey !== state.key) return { error: null, failed: false, key: props.resetKey }
    return null
  }

  render() {
    if (!this.state.failed) return this.props.children
    const screen = isConnectionError(this.state.error) ? <OfflineScreen /> : <ErrorScreen />
    return this.props.inline ? (
      <div className="flex flex-1 items-center justify-center px-4 py-16">{screen}</div>
    ) : (
      <div className="flex min-h-dvh items-center justify-center bg-page px-4">{screen}</div>
    )
  }
}
