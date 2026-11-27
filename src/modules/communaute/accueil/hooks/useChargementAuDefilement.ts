import { useEffect, useRef } from 'react'

/**
 * Montrer la suite du fil quand une sentinelle approche du champ de vision
 * (repris de yibolo-client). `charger` est gardé dans une référence : il
 * change à chaque affichage, et le mettre en dépendance referait l'observateur.
 */
export function useChargementAuDefilement<T extends HTMLElement>({ actif, charger }: { actif: boolean; charger: () => void }) {
  const sentinelle = useRef<T>(null)
  const dernierCharger = useRef(charger)

  useEffect(() => {
    dernierCharger.current = charger
  })

  useEffect(() => {
    const element = sentinelle.current
    if (!element || !actif) return
    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((une) => une.isIntersecting)) dernierCharger.current()
      },
      // Avant que la sentinelle n'entre : la suite arrive pendant qu'on lit encore.
      { rootMargin: '400px' },
    )
    observateur.observe(element)
    return () => observateur.disconnect()
  }, [actif])

  return sentinelle
}
