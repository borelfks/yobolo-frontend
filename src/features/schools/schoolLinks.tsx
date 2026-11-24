import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Moon, Repeat, Sun } from 'lucide-react'
import { slugOfType } from '@/features/schools/schoolTypes'
import type { Etablissement, Formation, ModeCours, TypeEcole } from '@/shared/types'
import { ROUTES } from '@/shared/utils/routes'

/** Fiche d'un établissement (ou d'une auto-école), avec un onglet facultatif. */
export function ecoleUrl(e: Etablissement, tab?: string) {
  if (e.type === 'Auto-école') return ROUTES.drivingSchool(e.id, tab)
  return ROUTES.school(slugOfType(e.type), e.id, tab)
}

export function formationUrl(f: Formation) {
  return ROUTES.training(f.id)
}

/** Identifiant de traduction d'un type d'école (clé `schoolTypes.<id>` du namespace « schools »). */
export const schoolTypeKey: Record<TypeEcole, 'ipes' | 'cfp' | 'autoEcole' | 'autre'> = {
  IPES: 'ipes',
  CFP: 'cfp',
  'Auto-école': 'autoEcole',
  Autre: 'autre',
}

/** Identifiant de traduction d'un mode de cours (clés `modes.<id>` et `modeLabels.<id>`). */
export const modeKey: Record<ModeCours, 'jour' | 'soir' | 'jourSoir'> = {
  Jour: 'jour',
  Soir: 'soir',
  'Jour & Soir': 'jourSoir',
}

/**
 * Style d'un mode de cours. Le libellé (« Cours du jour »…) est une clé du
 * namespace « schools » (`labelKey`) ; `useModeLabel()` le donne déjà traduit.
 */
export const modeStyle: Record<ModeCours, { tone: 'amber' | 'violet' | 'green'; icon: ReactNode; labelKey: `modeLabels.${(typeof modeKey)[ModeCours]}` }> = {
  Jour: { tone: 'amber', icon: <Sun />, labelKey: 'modeLabels.jour' },
  Soir: { tone: 'violet', icon: <Moon />, labelKey: 'modeLabels.soir' },
  'Jour & Soir': { tone: 'green', icon: <Repeat />, labelKey: 'modeLabels.jourSoir' },
}

/** Libellé traduit d'un mode de cours : « Cours du jour », « Cours du soir », « Jour & Soir ». */
export function useModeLabel() {
  const { t } = useTranslation('schools')
  return (mode: ModeCours) => t(modeStyle[mode].labelKey)
}
