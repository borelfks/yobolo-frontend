import { useTranslation } from 'react-i18next'
import { useComptes, useEtablissements, useExperts } from '@/data/hooks'
import type { TypeDePastille } from '@/features/accueil/accueilFil'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import type { Publication } from '@/shared/types'

/**
 * L'auteur d'une publication, lu dans la base : un expert (table `experts`),
 * ou un compte qui a publié depuis l'accueil (table `comptes`). Un compte
 * école mène à la fiche publique de son établissement.
 */
export function useAuteur(publication: Pick<Publication, 'auteurType' | 'auteurId'>): {
  nom: string
  photo?: string
  pastille: TypeDePastille
  vers?: string
} {
  const { t } = useTranslation('accueil')
  const experts = useExperts()
  const comptes = useComptes()
  const etablissements = useEtablissements()

  if (publication.auteurType === 'expert') {
    const expert = experts.find((e) => e.id === publication.auteurId)
    return { nom: expert?.nom ?? t('auteur.inconnu'), photo: expert?.photo, pastille: 'consultant' }
  }
  const compte = comptes.find((c) => c.id === publication.auteurId)
  if (!compte) return { nom: t('auteur.inconnu'), pastille: 'membre' }
  const ecole = compte.ecoleId ? etablissements.find((e) => e.id === compte.ecoleId) : undefined
  return {
    nom: compte.name,
    photo: compte.avatar,
    pastille: compte.role === 'utilisateur' ? 'membre' : 'ecole',
    vers: ecole ? ecoleUrl(ecole) : undefined,
  }
}
