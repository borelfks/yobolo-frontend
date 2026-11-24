import { useSearchParams } from 'react-router'

/**
 * La fiche d'offre ouverte, tenue dans l'adresse (`?offre=…`), comme les
 * publications : le lien se partage, le retour arrière la referme, les filtres
 * du fil sont gardés.
 */
export function useOffreOuverte() {
  const [parametres, setParametres] = useSearchParams()

  return {
    ouverte: parametres.get('offre') ?? undefined,
    /** L'adresse de la page actuelle, avec cette offre ouverte. */
    versLaFiche: (id: string) => {
      const suite = new URLSearchParams(parametres)
      suite.delete('publication')
      suite.delete('commenter')
      suite.set('offre', id)
      return `?${suite.toString()}`
    },
    fermer: () => {
      const suite = new URLSearchParams(parametres)
      suite.delete('offre')
      setParametres(suite, { replace: true })
    },
  }
}
