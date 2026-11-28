import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { CadreCompte } from '@/shared/blocs/CadreCompte'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Le cadre « Mon compte » des pages Notifications, Mon profil et Paramètres
 * (canevas) : le bloc `CadreCompte`, rempli avec le compte connecté, son menu
 * (le nombre de notifications non lues sur « Notifications ») et « Se déconnecter ».
 */
export function CadreMonCompte({ page, children }: { page: 'profil' | 'notifications' | 'parametres'; children: ReactNode }) {
  const { t } = useTranslation('espace')
  const { account, signOut } = useSession()
  const navigate = useNavigate()
  const nonLues = useNotificationsCompte(account?.id).filter((n) => !n.lu).length
  if (!account) return null
  return (
    <CadreCompte
      compte={{ nom: account.name, photo: account.avatar || undefined, role: account.ville ? `${t('compte.role')} · ${account.ville}` : t('compte.role') }}
      titreMenu={t('compte.menu')}
      liens={[
        { cle: 'profil', vers: ROUTES.profil, libelle: t('compte.profil'), actif: page === 'profil' },
        { cle: 'favoris', vers: ROUTES.favorites, libelle: t('compte.favoris'), actif: false },
        { cle: 'notifications', vers: ROUTES.notifications, libelle: t('compte.notifications'), actif: page === 'notifications', badge: nonLues },
        { cle: 'parametres', vers: ROUTES.parametres(), libelle: t('compte.parametres'), actif: page === 'parametres' },
      ]}
      sortie={{
        libelle: t('compte.deconnexion'),
        onClick: () => {
          signOut()
          void navigate({ href: ROUTES.signIn })
        },
      }}
    >
      {children}
    </CadreCompte>
  )
}
