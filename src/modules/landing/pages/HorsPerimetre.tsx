import { useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BookOpen, Briefcase, FileText, GraduationCap, LifeBuoy, MonitorPlay, UserRound, type LucideIcon } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ROUTES } from '@/shared/utils/routes'

type Espace = 'consultation' | 'emploi' | 'formations' | 'bibliotheque' | 'aide' | 'conditions'

/** Chaque page pas encore réalisée, avec son icône. */
const ESPACES: { espace: Espace; adresse: string; icone: LucideIcon }[] = [
  { espace: 'emploi', adresse: ROUTES.emploi, icone: Briefcase },
  { espace: 'formations', adresse: ROUTES.courses, icone: MonitorPlay },
  { espace: 'bibliotheque', adresse: ROUTES.library, icone: BookOpen },
  { espace: 'aide', adresse: ROUTES.help, icone: LifeBuoy },
  { espace: 'conditions', adresse: ROUTES.terms, icone: FileText },
  { espace: 'consultation', adresse: ROUTES.consultation, icone: UserRound },
]

/**
 * Consultation, Emploi, Formations, Bibliothèque, Aide, Conditions : présents
 * dans la navigation ou sur la landing, pas encore réalisés dans cette démo.
 */
export function HorsPerimetre() {
  const { t } = useTranslation('landing')
  const { pathname } = useLocation()
  const { espace, icone: Icon } = ESPACES.find((e) => pathname.startsWith(e.adresse)) ?? ESPACES[ESPACES.length - 1]!
  const space = t(`comingSoon.spaces.${espace}`)
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Card className="p-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-100 text-brand-600">
          <Icon className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl text-navy-900">{t('comingSoon.title', { space })}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('comingSoon.text', { space })}
        </p>
        <Button to={ROUTES.schools} className="mt-6">
          <GraduationCap />
          {t('comingSoon.explore')}
        </Button>
      </Card>
    </div>
  )
}
