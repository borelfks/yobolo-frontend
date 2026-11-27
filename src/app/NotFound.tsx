import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ROUTES } from '@/shared/utils/routes'

export function NotFound() {
  const { t } = useTranslation('layout')
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Card className="p-10 text-center">
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-3 text-2xl text-navy-900">{t('notFound.title')}</h1>
        <p className="mt-2 text-muted">{t('notFound.text')}</p>
        <Button to={ROUTES.home} className="mt-6">
          {t('errors.backHome')}
        </Button>
      </Card>
    </div>
  )
}
