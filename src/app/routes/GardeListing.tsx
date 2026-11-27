import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Les listes d'écoles et d'auto-écoles sont pour les visiteurs et les
 * personnes physiques : un compte école qui en ouvre une est mené à son
 * espace professionnel (décision du 2026-11-25). Les fiches restent ouvertes
 * (« Voir ma page publique »).
 */
export function GardeListing({ children }: { children: ReactNode }) {
  const { account } = useSession()
  if (account && account.role !== 'utilisateur') return <Navigate to={ROUTES.pro.root} replace />
  return children
}
