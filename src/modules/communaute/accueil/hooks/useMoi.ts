import { useTranslation } from 'react-i18next'
import { useEnregistrements, useEtablissements, useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Le compte connecté, tel que la colonne de gauche de l'accueil le montre :
 * photo, nom, ligne de rôle (« Personne physique · Yaoundé », « École – IPES ·
 * Yaoundé »), page du profil, et les chiffres des raccourcis (enregistrées,
 * favoris, notifications non lues), tous lus dans la base.
 */
export function useMoi() {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const etablissements = useEtablissements()
  const enregistrees = useEnregistrements(account?.id)
  const notifications = useNotificationsCompte(account?.id)
  const { favorites } = useFavorites()
  if (!account) return null

  const ecole = account.ecoleId ? etablissements.find((e) => e.id === account.ecoleId) : undefined
  const estEcole = account.role !== 'utilisateur'
  const role = estEcole ? t('auteur.roleEcole', { type: ecole?.type ?? 'IPES' }) : t('auteur.personne')
  const ville = ecole?.ville ?? account.ville
  return {
    id: account.id,
    estEcole,
    nom: account.name,
    photo: account.avatar || ecole?.vignette || ecole?.image || undefined,
    role: ville ? `${role} · ${ville}` : role,
    profil: estEcole ? ROUTES.pro.profile() : ROUTES.profil,
    nbEnregistrees: enregistrees.length,
    nbFavoris: favorites.length,
    nbNonLues: notifications.filter((n) => !n.lu).length,
  }
}
