import { Navigate } from '@tanstack/react-router'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { CadreMonCompte } from '@/modules/compte/mon-espace/components/CadreMonCompte'
import { ProfilCompte } from '@/modules/compte/mon-espace/components/ProfilCompte'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { SkeletonCard, SkeletonZone } from '@/shared/blocs/Squelettes'
import { ROUTES } from '@/shared/utils/routes'

/** « Mon profil » d'une personne physique (canevas) : ouvert depuis le menu du compte. */
export function MonProfil() {
  const { account } = useSession()
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  if (account.role !== 'utilisateur') return <Navigate to={account.home} replace />
  return (
    <CadreMonCompte page="profil">
      <ChargementDonnees
        fallback={
          <SkeletonZone>
            <SkeletonCard className="h-[640px]" />
          </SkeletonZone>
        }
      >
        <ProfilCompte />
      </ChargementDonnees>
    </CadreMonCompte>
  )
}
