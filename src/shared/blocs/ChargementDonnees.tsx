import { Component, Suspense, type ReactNode } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorState } from './Etats'

type Props = {
  /** Ce qui s'affiche pendant le chargement : un squelette de la même forme que le contenu. */
  fallback: ReactNode
  children: ReactNode
}

/**
 * Attend les données d'un bloc (Suspense) et attrape leurs erreurs : à la
 * place du bloc, « Impossible de charger ces informations » et « Réessayer »,
 * qui relance la lecture. Le reste de la page reste utilisable.
 */
export function ChargementDonnees({ fallback, children }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <BlocErreur onReset={reset}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </BlocErreur>
      )}
    </QueryErrorResetBoundary>
  )
}

type EtatBloc = { erreur: boolean }

class BlocErreur extends Component<{ onReset: () => void; children: ReactNode }, EtatBloc> {
  state: EtatBloc = { erreur: false }

  static getDerivedStateFromError(): EtatBloc {
    return { erreur: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  private reessayer = () => {
    this.props.onReset()
    this.setState({ erreur: false })
  }

  render() {
    return this.state.erreur ? <ErrorState onRetry={this.reessayer} /> : this.props.children
  }
}
