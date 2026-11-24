import { useSearchParams } from 'react-router'
import { GENRES_DE_PUBLICATIONS, GENRES_DU_FIL, TRIS_DU_FIL, type GenreDuFil, type TriDuFil } from '@/features/accueil/accueilFil'

export interface FiltresDuFil {
  genre: GenreDuFil
  tri: TriDuFil
  /** La collection de ce qu'on a mis de côté, à la place du fil. */
  enregistres: boolean
  /** Les publications du compte connecté, à la place du fil. */
  miennes: boolean
  domaines: string[]
  sujet?: string
  /** Identifiant d'une ville (table `villes`). */
  ville?: string
  recherche: string
}

/**
 * Ce que montre le fil, tenu dans l'adresse (comme dans yibolo-client) : il se
 * partage, et le retour arrière le défait.
 * - « Les plus lues » ne range que des publications : choisir les offres, les
 *   formations ou les actualités revient au plus récent ;
 * - les offres, les formations et les actualités n'ont ni domaine ni sujet :
 *   les choisir efface ces critères ;
 * - « Mes enregistrés » et « Mes publications » sont des collections : ni type
 *   ni tri ne s'y appliquent ;
 * - la ville s'applique à tout ce qui a une ville.
 */
export function useFiltresDuFil() {
  const [parametres, setParametres] = useSearchParams()

  const vue = parametres.get('vue')
  const enregistres = vue === 'enregistres'
  const miennes = vue === 'miennes'
  const collection = enregistres || miennes
  const genreLu = GENRES_DU_FIL.find((un) => un === parametres.get('genre')) ?? 'tout'
  const genre = collection ? 'tout' : genreLu
  const publications = GENRES_DE_PUBLICATIONS.includes(genre)
  const filtres: FiltresDuFil = {
    genre,
    tri: (!collection && publications && TRIS_DU_FIL.find((un) => un === parametres.get('tri'))) || 'recentes',
    enregistres,
    miennes,
    domaines: publications ? parametres.getAll('domaine') : [],
    sujet: (publications && parametres.get('sujet')) || undefined,
    ville: parametres.get('ville') || undefined,
    recherche: (parametres.get('q') ?? '').trim(),
  }

  const changer = (suite: Partial<FiltresDuFil>) => {
    const voulus = { ...filtres, ...suite }
    // Les deux collections s'excluent : choisir l'une quitte l'autre.
    if (suite.enregistres) voulus.miennes = false
    if (suite.miennes) voulus.enregistres = false
    const prochain = new URLSearchParams()
    if (voulus.enregistres) prochain.set('vue', 'enregistres')
    else if (voulus.miennes) prochain.set('vue', 'miennes')
    else {
      if (voulus.genre !== 'tout') prochain.set('genre', voulus.genre)
      if (voulus.tri !== 'recentes' && GENRES_DE_PUBLICATIONS.includes(voulus.genre)) prochain.set('tri', voulus.tri)
    }
    if (voulus.enregistres || voulus.miennes || GENRES_DE_PUBLICATIONS.includes(voulus.genre)) {
      voulus.domaines.forEach((domaine) => prochain.append('domaine', domaine))
      if (voulus.sujet) prochain.set('sujet', voulus.sujet)
    }
    if (voulus.ville) prochain.set('ville', voulus.ville)
    if (voulus.recherche.trim()) prochain.set('q', voulus.recherche.trim())
    setParametres(prochain, { replace: true })
  }

  return {
    filtres,
    changer,
    /** Ce que le bouton « Plus de filtres » porte : la vue et l'ordre. */
    nombreDansLeBouton: (filtres.enregistres || filtres.miennes ? 1 : 0) + (filtres.tri !== 'recentes' ? 1 : 0),
    filtre:
      filtres.enregistres ||
      filtres.miennes ||
      filtres.genre !== 'tout' ||
      filtres.tri !== 'recentes' ||
      filtres.domaines.length > 0 ||
      filtres.sujet !== undefined ||
      filtres.ville !== undefined ||
      filtres.recherche !== '',
    toutVoir: () => setParametres({}, { replace: true }),
  }
}
