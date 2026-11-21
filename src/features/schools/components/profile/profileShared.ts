import { etablissementById } from '@/mocks/schools'

export const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'

/** Filières mises en avant sur la fiche d'un établissement. */
export function principales(id: string) {
  const e = etablissementById(id)
  return e.principales ?? e.filieres.slice(0, 5)
}
