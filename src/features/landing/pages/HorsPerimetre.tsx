import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Briefcase, GraduationCap, UserRound } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { ROUTES } from '@/shared/utils/routes'

/** Consultation et Emploi : présents dans la navigation, pas encore réalisés dans cette démo. */
export function HorsPerimetre() {
  const { t } = useTranslation('landing')
  const { pathname } = useLocation()
  const emploi = pathname.startsWith(ROUTES.emploi)
  const space = t(emploi ? 'comingSoon.spaces.emploi' : 'comingSoon.spaces.consultation')
  const Icon = emploi ? Briefcase : UserRound
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Card className="p-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-100 text-brand-600">
          <Icon className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl text-navy-900">{t('comingSoon.title', { space })}</h1>
        <p className="mt-2 text-muted">
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
