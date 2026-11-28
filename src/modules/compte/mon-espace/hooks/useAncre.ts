import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

/** Va à la rubrique de l'adresse (`/parametres#notifications`) à l'ouverture de la page. */
export function useAncre() {
  const { hash } = useLocation()
  useEffect(() => {
    const id = hash.replace(/^#/, '')
    if (!id) return
    // Après le retour en haut du cadre (ScrollRestoration), qui passe juste après.
    const minuterie = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 120)
    return () => window.clearTimeout(minuterie)
  }, [hash])
}
