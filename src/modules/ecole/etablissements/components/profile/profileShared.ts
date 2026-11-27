import type { Etablissement } from '@/shared/types'

export const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'

/** Filières mises en avant sur la fiche d'un établissement (lu dans la base par l'écran). */
export function principales(e: Etablissement) {
  return e.principales ?? e.filieres.slice(0, 5)
}
