import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'
import { useSession } from '@/features/auth/hooks/useSession'
import { ParametresTab } from '@/features/espace/components/ParametresTab'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { ROUTES } from '@/shared/utils/routes'

/** « Paramètres » d'une personne physique (notifications, mot de passe, langue, compte) : une page ouverte depuis le menu du compte. */
export function MesParametres() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  if (account.role !== 'utilisateur') return <Navigate to={account.home} replace />
  return (
    <div className="mx-auto max-w-[1080px] space-y-4 px-5 py-4">
      <Breadcrumb items={[{ label: t('crumbs.accueil'), to: account.home }, { label: t('pages.parametres') }]} className="-mt-1" />
      <h1 className="flex items-center gap-2.5 text-[24px] font-bold text-navy-900">
        <Settings className="size-6 text-brand-600" aria-hidden="true" />
        {t('pages.parametres')}
      </h1>
      <ParametresTab />
    </div>
  )
}
