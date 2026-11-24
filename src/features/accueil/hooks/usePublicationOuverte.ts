import { useSearchParams } from 'react-router'
import { data } from '@/data'
import type { Publication } from '@/shared/types'

/**
 * La publication ouverte en lecture, tenue dans l'adresse (`?publication=…`,
 * et `&commenter=1` pour aller droit au champ de commentaire) : le lien se
 * partage et le retour arrière referme la fenêtre. Les autres paramètres
 * (filtres du fil) sont gardés.
 */
export function usePublicationOuverte() {
  const [parametres, setParametres] = useSearchParams()

  /** L'adresse de la page actuelle, avec cette publication ouverte. */
  const versLaLecture = (id: string, commenter = false) => {
    const suite = new URLSearchParams(parametres)
    suite.delete('offre')
    suite.set('publication', id)
    if (commenter) suite.set('commenter', '1')
    else suite.delete('commenter')
    return `?${suite.toString()}`
  }

  return {
    ouverte: parametres.get('publication') ?? undefined,
    commenter: parametres.get('commenter') === '1',
    versLaLecture,
    /** Une ouverture depuis le fil compte une lecture de plus (« Les plus lues »). */
    compterUneLecture: (publication: Publication) => void data.update('publications', publication.id, { lectures: publication.lectures + 1 }),
    fermer: () => {
      const suite = new URLSearchParams(parametres)
      suite.delete('publication')
      suite.delete('commenter')
      setParametres(suite, { replace: true })
    },
  }
}
