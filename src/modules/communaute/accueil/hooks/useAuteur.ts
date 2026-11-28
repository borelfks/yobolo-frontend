import { useTranslation } from 'react-i18next'
import { useComptes, useDomainesExpertise, useExperts } from '@/data/hooks'

/**
 * Qui a écrit (une publication, un commentaire) : un expert (table `experts`)
 * ou un compte (table `comptes`). `role` : la ligne sous le nom, « Éducation ·
 * Yaoundé » pour un expert, « Personne physique · Yaoundé » pour une personne.
 */
export function useAuteurs() {
  const { t } = useTranslation('accueil')
  const experts = useExperts()
  const domaines = useDomainesExpertise()
  const comptes = useComptes()

  return (id: string, repli?: { nom: string; photo?: string }): { nom: string; photo?: string; role: string } => {
    const expert = experts.find((e) => e.id === id)
    if (expert) {
      const domaine = domaines.find((d) => d.id === expert.domaineId)?.nom
      return { nom: expert.nom, photo: expert.photo, role: [domaine, expert.ville].filter(Boolean).join(' · ') }
    }
    const compte = comptes.find((c) => c.id === id)
    const role = compte?.role === 'utilisateur' ? t('auteur.personne') : t('auteur.ecole')
    return {
      nom: compte?.name ?? repli?.nom ?? t('auteur.inconnu'),
      photo: compte ? compte.avatar || undefined : repli?.photo,
      role: compte?.ville ? `${role} · ${compte.ville}` : role,
    }
  }
}
