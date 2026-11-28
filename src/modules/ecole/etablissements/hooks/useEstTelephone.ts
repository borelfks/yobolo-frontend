import { useSyncExternalStore } from 'react'

/** Largeur sous laquelle l'écran suit les planches « téléphone » du canevas (le point `sm` de Tailwind). */
const REQUETE = '(max-width: 639.98px)'

const abonner = (suite: () => void) => {
  const m = window.matchMedia(REQUETE)
  m.addEventListener('change', suite)
  return () => m.removeEventListener('change', suite)
}

/**
 * Vrai sur un écran de téléphone : certains éléments y changent de forme
 * (un filtre s'ouvre en plein écran au lieu d'une bulle).
 */
export function useEstTelephone() {
  return useSyncExternalStore(abonner, () => window.matchMedia(REQUETE).matches, () => false)
}
