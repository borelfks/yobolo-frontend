import { useLocation, useNavigate } from '@tanstack/react-router'

type Suite = URLSearchParams | ((actuels: URLSearchParams) => URLSearchParams)

/**
 * La recherche de l'adresse (« ?ville=Douala&page=2 ») lue et écrite comme des
 * URLSearchParams : `const [params, setParams] = useParametresRecherche()`.
 * Écrire change l'adresse (le retour arrière défait le changement).
 */
export function useParametresRecherche() {
  const { pathname, searchStr } = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(searchStr)
  const setParams = (suite: Suite, options?: { replace?: boolean }) => {
    const prochains = typeof suite === 'function' ? suite(new URLSearchParams(searchStr)) : suite
    const texte = prochains.toString()
    void navigate({ href: `${pathname}${texte ? `?${texte}` : ''}`, replace: options?.replace })
  }
  return [params, setParams] as const
}
