import type { ComponentType } from 'react'
import {
  BarChart3,
  Briefcase,
  Calculator,
  Cog,
  ConciergeBell,
  Ellipsis,
  GraduationCap,
  HardHat,
  Laptop,
  Languages,
  Palette,
  Scale,
  Sprout,
  Stethoscope,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'

/** Icône d'un domaine de formation, déduite de son nom. */
export function domaineIcon(nom: string): ComponentType<{ className?: string }> {
  const n = nom.toLowerCase()
  if (n.startsWith('toutes')) return Stethoscope
  if (n.includes('compta') || n.includes('finance') && !n.includes('banque')) return Calculator
  if (n.includes('banque')) return BarChart3
  if (n.includes('ressources humaines')) return Users
  if (n.includes('génie')) return Cog
  if (n.includes('gestion') || n.includes('management')) return Briefcase
  if (n.includes('ressources humaines')) return Users
  if (n.includes('informatique') || n.includes('numérique') || n.includes('réseaux')) return Laptop
  if (n.includes('santé')) return Stethoscope
  if (n.includes('btp') || n.includes('bâtiment')) return HardHat
  if (n.includes('génie') || n.includes('technique')) return Cog
  if (n.includes('électricité') || n.includes('énergie')) return Zap
  if (n.includes('mécanique')) return Wrench
  if (n.includes('hôtel') || n.includes('restauration')) return ConciergeBell
  if (n.includes('agri')) return Sprout
  if (n.includes('droit')) return Scale
  if (n.includes('langue')) return Languages
  if (n.includes('art') || n.includes('mode') || n.includes('beauté') || n.includes('musique')) return Palette
  if (n.startsWith('autre')) return Ellipsis
  return GraduationCap
}

export const tilePalette = [
  'bg-[#e3edff] text-brand-600',
  'bg-[#efe6ff] text-violet-600',
  'bg-[#dcf6f1] text-teal-600',
  'bg-[#fff0dc] text-orange-500',
  'bg-[#dcf5e4] text-emerald-600',
  'bg-[#ece7ff] text-indigo-600',
  'bg-[#e3edff] text-brand-600',
  'bg-[#e1f5e6] text-emerald-600',
  'bg-[#e3edff] text-brand-600',
]
