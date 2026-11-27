import { WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEnLigne } from '@/shared/hooks/useEnLigne'

/** Bandeau fixe en bas de l'écran quand la connexion internet est coupée ; disparaît dès qu'elle revient. */
export function BandeauHorsLigne() {
  const { t } = useTranslation()
  const enLigne = useEnLigne()
  if (enLigne) return null
  return (
    <div role="status" className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 bg-foreground px-4 py-2.5 text-sm font-semibold text-white">
      <WifiOff className="size-4 shrink-0" aria-hidden />
      {t('errors.offlineBanner')}
    </div>
  )
}
