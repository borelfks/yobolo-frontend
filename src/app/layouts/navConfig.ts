import type { ComponentType } from 'react'
import type { ParseKeys } from 'i18next'
import { Briefcase, Building2, ChartColumn, FileText, GraduationCap, House, LayoutDashboard, SlidersVertical, Users } from 'lucide-react'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Les listes de liens des cadres (en-tête public, menu de l'espace pro). Elles gardent des clés de traduction (namespace « common ») :
 * le texte est résolu par `t` dans le cadre, au moment de l'affichage.
 */
type LabelKey = ParseKeys<'layout'>
type Icon = ComponentType<{ className?: string }>

/** `bientot` : univers pas encore ouvert (canevas : grisé, « Bientôt », montré seulement aux comptes connectés). */
export type PublicNavItem = { to: string; labelKey: LabelKey; icon: Icon; end?: boolean; bientot?: boolean }

export const publicNav: PublicNavItem[] = [
  { to: ROUTES.home, labelKey: 'nav.home', icon: House, end: true },
  { to: ROUTES.schools, labelKey: 'nav.school', icon: GraduationCap },
  { to: ROUTES.consultation, labelKey: 'nav.consultation', icon: Users, bientot: true },
  { to: ROUTES.emploi, labelKey: 'nav.employment', icon: Briefcase, bientot: true },
]

export type ProNavItem = {
  labelKey: LabelKey
  to: string
  icon: Icon
  end?: boolean
  children?: { labelKey: LabelKey; to: string }[]
}

export const proNav: ProNavItem[] = [
  { labelKey: 'pro.nav.dashboard', to: ROUTES.pro.root, icon: LayoutDashboard, end: true },
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
    icon: FileText,
    children: [
      { labelKey: 'pro.nav.news', to: ROUTES.pro.contents() },
      { labelKey: 'pro.nav.documents', to: ROUTES.pro.contents('documents') },
      { labelKey: 'pro.nav.faq', to: ROUTES.pro.contents('faq') },
    ],
  },
  { labelKey: 'pro.nav.statistics', to: ROUTES.pro.statistics, icon: ChartColumn },
  { labelKey: 'pro.nav.settings', to: ROUTES.pro.settings(), icon: SlidersVertical },
]
