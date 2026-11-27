import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { PageSpinner } from '@/shared/blocs/Chargement'

/**
 * La landing ne s'ouvre qu'aux visiteurs (comme dans yibolo-client) : un compte
 * connecté qui ouvre « / » est mené à sa page d'arrivée (`account.home` :
 * l'accueil connecté pour l'utilisateur, l'espace pro pour une école).
 *
 * Un visiteur voit la landing tout de suite. Si un compte est gardé dans le
 * navigateur, on attend que la base soit lue pour savoir où l'envoyer (un
 * compte disparu après « Réinitialiser » revient à la landing).
 */
export function GardeAccueil({ children }: { children: ReactNode }) {
  const { account, pret, compteId } = useSession()
  if (account) return <Navigate to={account.home} replace />
  if (compteId && !pret) return <PageSpinner />
  return children
}
