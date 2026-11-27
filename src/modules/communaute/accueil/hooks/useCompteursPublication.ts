import { data } from '@/data'
import { useCommentaires, useLectures } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import type { Publication } from '@/shared/types'

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

/**
 * Les vues d'une publication : le chiffre de départ (maquette) plus une vue
 * par compte qui l'a ouverte (table `lectures`). Ouvrir plusieurs fois la même
 * publication ne compte qu'une vue.
 */
export function useVues(publication: Publication) {
  const { account } = useSession()
  const lignes = useLectures().filter((l) => l.publicationId === publication.id)
  const dejaVue = lignes.some((l) => l.compteId === account?.id)
  return {
    nombre: publication.lectures + lignes.length,
    /** À l'ouverture de la page : une vue de plus, si ce compte ne l'a pas encore vue. */
    compter: () => {
      if (!account || dejaVue) return
      // Identifiant fixe : une deuxième écriture remplace la première au lieu d'ajouter une vue.
      void data.put('lectures', { id: `lecture-${account.id}-${publication.id}`, compteId: account.id, publicationId: publication.id, le: maintenant() })
    },
  }
}

/** Le nombre de commentaires : celui de départ plus ceux de la table (réponses comprises, pas les supprimés). */
export function useNombreDeCommentaires(publication: Publication) {
  return publication.commentaires + useCommentaires(publication.id).filter((c) => !c.supprime).length
}
