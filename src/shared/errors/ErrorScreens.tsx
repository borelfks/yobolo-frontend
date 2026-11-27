import { RefreshCw, TriangleAlert, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ROUTES } from '@/shared/utils/routes'

/** Écran « Une erreur est survenue » : recharger ou revenir à l'accueil. */
export function ErrorScreen() {
  const { t } = useTranslation()
  return (
    <Card className="w-full max-w-lg p-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-50 text-rose-600">
        <TriangleAlert className="size-8" />
      </span>
      <h1 className="mt-5 text-2xl text-navy-900">{t('errors.generic.title')}</h1>
      <p className="mt-2 text-muted">{t('errors.generic.text')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => window.location.reload()}>
          <RefreshCw />
          {t('errors.reload')}
        </Button>
        <Button variant="neutral" onClick={() => window.location.assign(ROUTES.home)}>
          {t('errors.backHome')}
        </Button>
      </div>
    </Card>
  )
}

/** Écran « Pas de connexion internet » : une page n'a pas pu se télécharger. */
export function OfflineScreen() {
  const { t } = useTranslation()
  return (
    <Card className="w-full max-w-lg p-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-100 text-brand-600">
        <WifiOff className="size-8" />
      </span>
      <h1 className="mt-5 text-2xl text-navy-900">{t('errors.offline.title')}</h1>
      <p className="mt-2 text-muted">{t('errors.offline.text')}</p>
      <Button className="mt-6" onClick={() => window.location.reload()}>
        <RefreshCw />
        {t('errors.retry')}
      </Button>
    </Card>
  )
}
