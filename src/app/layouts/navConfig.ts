import type { ComponentType } from 'react'
import type { ParseKeys } from 'i18next'
import { BarChart3, Briefcase, Building2, GraduationCap, Home, Layers, Settings, UserRound } from 'lucide-react'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Les listes de liens des cadres (en-tête public, menu de l'espace pro). Elles gardent des clés de traduction (namespace « common ») :
 * le texte est résolu par `t` dans le cadre, au moment de l'affichage.
 */
type LabelKey = ParseKeys<'layout'>
type Icon = ComponentType<{ className?: string }>

export type PublicNavItem = { to: string; labelKey: LabelKey; icon: Icon; end?: boolean }

export const publicNav: PublicNavItem[] = [
  { to: ROUTES.home, labelKey: 'nav.home', icon: Home, end: true },
  { to: ROUTES.schools, labelKey: 'nav.school', icon: GraduationCap },
  { to: ROUTES.consultation, labelKey: 'nav.consultation', icon: UserRound },
  { to: ROUTES.emploi, labelKey: 'nav.employment', icon: Briefcase },
]

export type ProNavItem = {
  labelKey: LabelKey
  to: string
  icon: Icon
  end?: boolean
  children?: { labelKey: LabelKey; to: string }[]
}

export const proNav: ProNavItem[] = [
  { labelKey: 'pro.nav.dashboard', to: ROUTES.pro.root, icon: Home, end: true },
  { labelKey: 'pro.nav.profile', to: ROUTES.pro.profile(), icon: Building2 },
  {
    labelKey: 'pro.nav.trainings',
    to: ROUTES.pro.trainings,
    icon: GraduationCap,
    children: [
      { labelKey: 'pro.nav.manageTrainings', to: ROUTES.pro.trainings },
      { labelKey: 'pro.nav.newTraining', to: ROUTES.pro.newTraining },
    ],
  },
  {
    labelKey: 'pro.nav.contents',
    to: ROUTES.pro.contents(),
    icon: Layers,
    children: [
      { labelKey: 'pro.nav.news', to: ROUTES.pro.contents() },
      { labelKey: 'pro.nav.documents', to: ROUTES.pro.contents('documents') },
      { labelKey: 'pro.nav.faq', to: ROUTES.pro.contents('faq') },
    ],
  },
  { labelKey: 'pro.nav.statistics', to: ROUTES.pro.statistics, icon: BarChart3 },
  { labelKey: 'pro.nav.settings', to: ROUTES.pro.settings(), icon: Settings },
]
