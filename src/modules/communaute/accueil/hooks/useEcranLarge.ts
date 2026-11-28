import { useSyncExternalStore } from 'react'

/** La largeur où l'accueil passe en trois colonnes (celle de la barre du haut : `lg`). */
const REQUETE = '(min-width: 64rem)'

const abonner = (rappel: () => void) => {
  const media = window.matchMedia(REQUETE)
  media.addEventListener('change', rappel)
  return () => media.removeEventListener('change', rappel)
}

/**
 * Vrai sur ordinateur (canevas : planches « ordinateur »). Sur téléphone, une
 * liste de choix s'ouvre en plein écran à la place du fil au lieu d'une bulle.
 */
export function useEcranLarge() {
  return useSyncExternalStore(abonner, () => window.matchMedia(REQUETE).matches)
}
