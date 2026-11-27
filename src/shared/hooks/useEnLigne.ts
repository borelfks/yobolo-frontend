import { useSyncExternalStore } from 'react'

function abonner(rappel: () => void) {
  window.addEventListener('online', rappel)
  window.addEventListener('offline', rappel)
  return () => {
    window.removeEventListener('online', rappel)
    window.removeEventListener('offline', rappel)
  }
}

/** Vrai quand le navigateur a une connexion internet ; se met à jour tout seul. */
export function useEnLigne() {
  return useSyncExternalStore(abonner, () => navigator.onLine, () => true)
}
