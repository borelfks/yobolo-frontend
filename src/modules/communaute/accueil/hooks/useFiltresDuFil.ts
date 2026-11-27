import { useSearchParams } from 'react-router'
import { TRIS_DU_FIL, type TriDuFil } from '@/modules/communaute/accueil/accueilFil'

export interface FiltresDuFil {
  tri: TriDuFil
  /** La collection de ce qu'on a mis de côté, à la place du fil. */
  enregistres: boolean
  domaines: string[]
  sujet?: string
  recherche: string
}

/**
 * Ce que montre le fil, tenu dans l'adresse (comme dans yibolo-client) : il se
 * partage, et le retour arrière le défait. La recherche, les domaines, un sujet,
 * « Mes enregistrés » et l'ordre (« Les plus récentes » / « Les plus lues ») ;
 * pas de filtre « Ville » (décision du 2026-11-25). « Mes enregistrés » est une
 * collection : l'ordre ne s'y applique pas.
 */
export function useFiltresDuFil() {
  const [parametres, setParametres] = useSearchParams()

  const vue = parametres.get('vue')
  const enregistres = vue === 'enregistres'
  const filtres: FiltresDuFil = {
    tri: (!enregistres && TRIS_DU_FIL.find((un) => un === parametres.get('tri'))) || 'recentes',
    enregistres,
    domaines: parametres.getAll('domaine'),
    sujet: parametres.get('sujet') || undefined,
    recherche: (parametres.get('q') ?? '').trim(),
  }

  const changer = (suite: Partial<FiltresDuFil>) => {
    const voulus = { ...filtres, ...suite }
    const prochain = new URLSearchParams()
    if (voulus.enregistres) prochain.set('vue', 'enregistres')
    else if (voulus.tri !== 'recentes') prochain.set('tri', voulus.tri)
    voulus.domaines.forEach((domaine) => prochain.append('domaine', domaine))
    if (voulus.sujet) prochain.set('sujet', voulus.sujet)
    if (voulus.recherche.trim()) prochain.set('q', voulus.recherche.trim())
    setParametres(prochain, { replace: true })
  }

  return {
    filtres,
    changer,
    /** Ce que le bouton « Plus de filtres » porte : la vue et l'ordre. */
    nombreDansLeBouton: (filtres.enregistres ? 1 : 0) + (filtres.tri !== 'recentes' ? 1 : 0),
    filtre:
      filtres.enregistres ||
      filtres.tri !== 'recentes' ||
      filtres.domaines.length > 0 ||
      filtres.sujet !== undefined ||
      filtres.recherche !== '',
    toutVoir: () => setParametres({}, { replace: true }),
  }
}
