import { Navigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { CadreMonCompte } from '@/modules/compte/mon-espace/components/CadreMonCompte'
import { ChangerMotDePasse, ChoixLangueCompte, ReglagesNotifications, SuppressionCompte } from '@/modules/compte/mon-espace/components/ParametresCompte'
import { RUBRIQUES_PARAMETRES } from '@/modules/compte/mon-espace/espaceParametres'
import { useAncre } from '@/modules/compte/mon-espace/hooks/useAncre'
import { CarteCompte, EnTeteCompte, PucesCompte } from '@/shared/blocs/CadreCompte'
import { ROUTES } from '@/shared/utils/routes'

/**
 * « Paramètres » d'une personne physique (canevas : 1. Toutes les rubriques,
 * 2. Confirmer la suppression du compte) : notifications, mot de passe,
 * langue, suppression du compte, sur une seule page avec ses ancres.
 */
export function MesParametres() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  useAncre()
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  if (account.role !== 'utilisateur') return <Navigate to={account.home} replace />
  return (
    <CadreMonCompte page="parametres">
      <CarteCompte>
        <EnTeteCompte titre={t('parametres.titre')} />
        <PucesCompte
          titre={t('parametres.ancres.titre')}
          puces={RUBRIQUES_PARAMETRES.map((r) => ({ cle: r.cle, vers: ROUTES.parametres(r.ancre), libelle: t(`parametres.ancres.${r.cle}`) }))}
        />
      </CarteCompte>
      <ReglagesNotifications />
      <ChangerMotDePasse />
      <ChoixLangueCompte />
      <SuppressionCompte />
    </CadreMonCompte>
  )
}
