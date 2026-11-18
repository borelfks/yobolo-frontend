import type { ReactNode } from 'react'
import { Moon, Repeat, Sun } from 'lucide-react'
import { slugOfType, type Etablissement, type Formation, type ModeCours } from '@/mocks/ecoles'

export function ecoleUrl(e: Etablissement) {
  if (e.type === 'Auto-école') return `/ecoles/auto-ecoles/${e.id}`
  return `/ecoles/${slugOfType(e.type)}/etablissement/${e.id}`
}

export function formationUrl(f: Formation) {
  return `/ecoles/formations/${f.id}`
}

export const modeStyle: Record<ModeCours, { tone: 'amber' | 'violet' | 'green'; icon: ReactNode; label: string }> = {
  Jour: { tone: 'amber', icon: <Sun />, label: 'Cours du jour' },
  Soir: { tone: 'violet', icon: <Moon />, label: 'Cours du soir' },
  'Jour & Soir': { tone: 'green', icon: <Repeat />, label: 'Jour & Soir' },
}
