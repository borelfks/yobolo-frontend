import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { UserRound } from 'lucide-react'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ProfilTab } from '@/modules/compte/mon-espace/components/ProfilTab'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { ROUTES } from '@/shared/utils/routes'

/** « Mon profil » d'une personne physique : une page à elle, ouverte depuis le menu du compte (décision du 2026-11-25). */
export function MonProfil() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  if (account.role !== 'utilisateur') return <Navigate to={account.home} replace />
  return (
    <div className="mx-auto max-w-[1080px] space-y-4 px-5 py-4">
      <Breadcrumb items={[{ label: t('crumbs.accueil'), to: account.home }, { label: t('pages.profil') }]} className="-mt-1" />
      <h1 className="flex items-center gap-2.5 text-[24px] font-bold text-navy-900">
        <UserRound className="size-6 text-brand-600" aria-hidden="true" />
        {t('pages.profil')}
      </h1>
      <ProfilTab />
    </div>
  )
}
