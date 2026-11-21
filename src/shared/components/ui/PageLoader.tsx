import { useTranslation } from 'react-i18next'

export function PageLoader() {
  const { t } = useTranslation()
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status" aria-label={t('loading')}>
      <span className="size-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
    </div>
  )
}
