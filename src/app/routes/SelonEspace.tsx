import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useSession } from '@/features/auth/hooks/useSession'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Une même adresse de l'espace pro sert l'école (IPES, CFP, Autres) ou
 * l'auto-école : chacune voit sa page. Une page qui n'existe que pour l'une
 * (formations, contenus pour l'école ; permis, planning, inscriptions pour
 * l'auto-école) renvoie l'autre au tableau de bord.
 */
export function SelonEspace({ ecole, autoEcole }: { ecole?: ReactNode; autoEcole?: ReactNode }) {
  const { account } = useSession()
  const page = account?.role === 'auto-ecole' ? autoEcole : ecole
  return page ?? <Navigate to={ROUTES.pro.root} replace />
}
