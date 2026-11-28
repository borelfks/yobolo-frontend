import { useLocation, useNavigate } from '@tanstack/react-router'
import { TRIS_DU_FIL, type TriDuFil } from '@/modules/communaute/accueil/accueilFil'
import { ROUTES } from '@/shared/utils/routes'

export interface FiltresDuFil {
  tri: TriDuFil
  /** Seulement les publications enregistrées par le compte (pilule « Enregistrées »). */
  enregistrees: boolean
  domaines: string[]
  sujets: string[]
  experts: string[]
  recherche: string
}

/**
 * Ce que montre le fil, tenu dans l'adresse de l'accueil : il se partage, et le
 * retour arrière le défait. `?domaine=…&sujet=…&expert=…` (plusieurs de chaque),
 * `?vue=enregistres`, `?tri=commentees`, `?q=…` (la recherche de la barre du
 * haut mène à `/accueil?q=…`). Sur la page d'une publication, choisir un filtre
 * (un sujet, un expert, un domaine) ramène au fil filtré.
 */
export function useFiltresDuFil() {
  const { pathname, searchStr } = useLocation()
  const navigate = useNavigate()
  const surLeFil = pathname === ROUTES.accueil
  const parametres = new URLSearchParams(surLeFil ? searchStr : '')

  const filtres: FiltresDuFil = {
    tri: TRIS_DU_FIL.find((un) => un === parametres.get('tri')) ?? 'recentes',
    enregistrees: parametres.get('vue') === 'enregistres',
    domaines: parametres.getAll('domaine'),
    sujets: parametres.getAll('sujet'),
    experts: parametres.getAll('expert'),
    recherche: parametres.get('q') ?? '',
  }

  const changer = (suite: Partial<FiltresDuFil>) => {
    const voulus = { ...filtres, ...suite }
    const prochain = new URLSearchParams()
    if (voulus.enregistrees) prochain.set('vue', 'enregistres')
    if (voulus.tri !== 'recentes') prochain.set('tri', voulus.tri)
    voulus.domaines.forEach((d) => prochain.append('domaine', d))
    voulus.sujets.forEach((s) => prochain.append('sujet', s))
    voulus.experts.forEach((e) => prochain.append('expert', e))
    if (voulus.recherche) prochain.set('q', voulus.recherche)
    const texte = prochain.toString()
    // Sur le fil, l'adresse est remplacée (pas une entrée d'historique par case cochée).
    void navigate({ href: `${ROUTES.accueil}${texte ? `?${texte}` : ''}`, replace: surLeFil })
  }

  const actifs = filtres.domaines.length + filtres.sujets.length + filtres.experts.length > 0 || filtres.enregistrees || filtres.recherche.trim() !== ''

  return {
    filtres,
    changer,
    actifs,
    /** « Tout effacer » : le fil entier, dans son ordre. */
    toutEffacer: () => changer({ enregistrees: false, domaines: [], sujets: [], experts: [], recherche: '' }),
    /** Un seul filtre, à la place des autres (un sujet du moment, un expert, un mot-dièse). */
    seulement: (suite: Partial<Pick<FiltresDuFil, 'domaines' | 'sujets' | 'experts'>>) =>
      changer({ enregistrees: false, domaines: [], sujets: [], experts: [], recherche: '', ...suite }),
  }
}
