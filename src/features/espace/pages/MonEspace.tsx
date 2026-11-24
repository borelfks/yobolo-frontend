import { Navigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Bell, Car, FileText, LayoutDashboard, Settings, Star, UserRound } from 'lucide-react'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { LinkTabs } from '@/shared/components/ui/Tabs'
import { useSession } from '@/features/auth/hooks/useSession'
import { useMesAvis, useMesInscriptions, useNotificationsCompte } from '@/data/hooks'
import { ROUTES } from '@/shared/utils/routes'
import { EnteteEspace } from '@/features/espace/components/EnteteEspace'
import { ApercuTab } from '@/features/espace/components/ApercuTab'
import { PreinscriptionsTab } from '@/features/espace/components/PreinscriptionsTab'
import { InscriptionsTab } from '@/features/espace/components/InscriptionsTab'
import { MesAvisTab } from '@/features/espace/components/MesAvisTab'
import { NotificationsTab } from '@/features/espace/components/NotificationsTab'
import { ProfilTab } from '@/features/espace/components/ProfilTab'
import { ParametresTab } from '@/features/espace/components/ParametresTab'

/**
 * « Mon espace » d'une personne physique : ses démarches dans l'univers École
 * (préinscriptions, inscriptions en auto-école, avis), ses notifications, son
 * profil et ses paramètres. Pas de barre latérale : des onglets dans l'adresse,
 * dans le cadre public (décision du porteur du projet, 2026-11-24).
 */
export function MonEspace() {
  const { t } = useTranslation('espace')
  const { tab = '' } = useParams()
  const { account } = useSession()
  const { preinscriptions, inscriptionsAutoEcole } = useMesInscriptions(account?.id)
  const avis = useMesAvis(account?.id)
  const nonLues = useNotificationsCompte(account?.id).filter((n) => !n.lu).length

  // Un visiteur se connecte d'abord ; un compte école a son espace professionnel.
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  if (account.role !== 'utilisateur') return <Navigate to={account.home} replace />

  const tabs = [
    { value: '', label: t('onglets.apercu'), icon: <LayoutDashboard /> },
    { value: 'preinscriptions', label: t('onglets.preinscriptions', { n: preinscriptions.length }), icon: <FileText /> },
    { value: 'auto-ecole', label: t('onglets.autoEcole', { n: inscriptionsAutoEcole.length }), icon: <Car /> },
    { value: 'avis', label: t('onglets.avis', { n: avis.etablissements.length + avis.autoEcoles.length }), icon: <Star /> },
    { value: 'notifications', label: t('onglets.notifications', { n: nonLues }), icon: <Bell /> },
    { value: 'profil', label: t('onglets.profil'), icon: <UserRound /> },
    { value: 'parametres', label: t('onglets.parametres'), icon: <Settings /> },
  ]
  const current = tabs.find((x) => x.value === tab) ?? tabs[0]!
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Breadcrumb
        items={[{ label: t('crumbs.accueil'), to: account.home }, { label: t('crumbs.espace'), to: ROUTES.espace() }, { label: current.label.replace(/ \(\d+\)$/, '') }]}
        className="-mt-1"
      />
      <EnteteEspace compte={account} />
      <LinkTabs items={tabs} base={ROUTES.espace()} variant="block" className="[&>a]:h-10 [&>a]:flex-none [&>a]:text-[15px]" />
      {current.value === '' && <ApercuTab />}
      {current.value === 'preinscriptions' && <PreinscriptionsTab />}
      {current.value === 'auto-ecole' && <InscriptionsTab />}
      {current.value === 'avis' && <MesAvisTab />}
      {current.value === 'notifications' && <NotificationsTab />}
      {current.value === 'profil' && <ProfilTab />}
      {current.value === 'parametres' && <ParametresTab />}
    </div>
  )
}
