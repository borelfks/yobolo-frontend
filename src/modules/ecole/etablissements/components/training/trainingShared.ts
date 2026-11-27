import type { ModeCours } from '@/shared/types'

export const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
export const soft = 'rounded-xl bg-[#f0f4fc]'

/** Mode de cours (valeur fixe des données) → fin de sa clé de traduction (`shared.modes.*`, `shared.modePills.*`). */
export const modeKey = { Jour: 'jour', Soir: 'soir', 'Jour & Soir': 'jourEtSoir' } as const satisfies Record<ModeCours, string>
