import { useEffect, useRef } from 'react'
import type { Evenement } from '@/shared/types'
import { mesurer, provenance } from '@/shared/utils/mesures'

type AMesurer = { type: 'vue' | 'vueFormation'; etablissementId: string; formationId?: string }

/**
 * Mesure une vue quand la page s'ouvre (une fois par `cle` : changer d'onglet
 * ne compte pas une seconde vue). `null` : rien à mesurer (par exemple, quand
 * l'établissement regarde sa propre fiche).
 */
export function useMesureALaVue(evenement: AMesurer | null, cle: string) {
  const mesuree = useRef<string | null>(null)
  const aMesurer = evenement !== null
  const type: Evenement['type'] = evenement?.type ?? 'vue'
  const etablissementId = evenement?.etablissementId ?? ''
  const formationId = evenement?.formationId
  useEffect(() => {
    // La double exécution du mode strict, ou un nouveau rendu, ne compte pas deux fois.
    if (!aMesurer || mesuree.current === cle) return
    mesuree.current = cle
    void mesurer({ type, etablissementId, formationId, provenance: type === 'vue' ? provenance(window.location.pathname + window.location.search) : undefined })
  }, [aMesurer, cle, type, etablissementId, formationId])
}
