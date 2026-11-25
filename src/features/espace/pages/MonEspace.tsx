import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Car, FileText, LayoutDashboard, Star } from 'lucide-react'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { LinkTabs } from '@/shared/components/ui/Tabs'
import { useSession } from '@/features/auth/hooks/useSession'
import { useMesAvis, useMesInscriptions } from '@/data/hooks'
import { ROUTES } from '@/shared/utils/routes'
import { EnteteEspace } from '@/features/espace/components/EnteteEspace'
import { ApercuTab } from '@/features/espace/components/ApercuTab'
import { PreinscriptionsTab } from '@/features/espace/components/PreinscriptionsTab'
import { InscriptionsTab } from '@/features/espace/components/InscriptionsTab'
import { MesAvisTab } from '@/features/espace/components/MesAvisTab'

/**
 * « Mon espace » d'une personne physique : ses démarches dans l'univers École
 * (préinscriptions, inscriptions en auto-école, avis). Le profil, les
 * paramètres et les notifications ont leur page, ouverte depuis le menu du
 * compte (`/profil`, `/parametres`, `/notifications`). Pas de barre latérale : des onglets dans l'adresse,
 * dans le cadre public (décision du porteur du projet, 2026-11-24).
 */
export function MonEspace() {
  const { t } = useTranslation('espace')
  const { tab = '' } = useParams()
  const { account } = useSession()
  const { preinscriptions, inscriptionsAutoEcole } = useMesInscriptions(account?.id)
  const avis = useMesAvis(account?.id)
  // Sur téléphone, la rangée d'onglets défile : l'onglet ouvert reste en vue.
  useEffect(() => {
    document.querySelector('nav a[aria-current="page"][href^="/mon-espace"]')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [tab])

  // Un visiteur se connecte d'abord ; un compte école a son espace professionnel.
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  if (account.role !== 'utilisateur') return <Navigate to={account.home} replace />
  // Les notifications ont leur page à elles (ancienne adresse de l'onglet).
  if (tab === 'notifications') return <Navigate to={ROUTES.notifications} replace />
  if (tab === 'profil') return <Navigate to={ROUTES.profil} replace />
  if (tab === 'parametres') return <Navigate to={ROUTES.parametres()} replace />

  const tabs = [
    { value: '', label: t('onglets.apercu'), icon: <LayoutDashboard /> },
    { value: 'preinscriptions', label: t('onglets.preinscriptions', { n: preinscriptions.length }), icon: <FileText /> },
    { value: 'auto-ecole', label: t('onglets.autoEcole', { n: inscriptionsAutoEcole.length }), icon: <Car /> },
    { value: 'avis', label: t('onglets.avis', { n: avis.etablissements.length + avis.autoEcoles.length }), icon: <Star /> },
  ]
  const current = tabs.find((x) => x.value === tab) ?? tabs[0]!
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Breadcrumb
        items={[{ label: t('crumbs.accueil'), to: account.home }, { label: t('crumbs.espace'), to: ROUTES.espace() }, { label: current.label.replace(/ \(\d+\)$/, '') }]}
        className="-mt-1"
      />
      <EnteteEspace compte={account} />
      <LinkTabs items={tabs} base={ROUTES.espace()} variant="block" className="-mx-5 px-5 max-lg:[mask-image:linear-gradient(to_right,black_88%,transparent)] lg:mx-0 lg:flex-wrap lg:px-0 [&>a]:h-10 [&>a]:flex-none [&>a]:text-[15px]" />
      {current.value === '' && <ApercuTab />}
      {current.value === 'preinscriptions' && <PreinscriptionsTab />}
      {current.value === 'auto-ecole' && <InscriptionsTab />}
      {current.value === 'avis' && <MesAvisTab />}
    </div>
  )
}
