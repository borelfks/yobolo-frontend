import { useTranslation } from 'react-i18next'
import { Car, Inbox } from 'lucide-react'
import { ProHeader } from '@/features/pro/components/ProBlocks'
import { ListeDossiers } from '@/features/pro/components/ListeDossiers'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { useInscriptionsRecues } from '@/data/hooks'
import { ROUTES } from '@/shared/utils/routes'

/** Les inscriptions reçues par l'auto-école : à étudier, compléter, accepter ou refuser. */
export function Inscriptions() {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  const lignes = useInscriptionsRecues(ecole.id).map((i) => ({
    id: i.id,
    candidat: `${(i.donnees.nom ?? '').toUpperCase()} ${i.donnees.prenom ?? ''}`.trim() || t('dossiers.anonyme'),
    telephone: i.donnees.telephone,
    objet: t('autoEcole.permis', { code: i.permis }),
    envoyeeLe: i.envoyeeLe,
    statut: i.statut,
    vers: ROUTES.pro.enrollment(i.id),
  }))
  return (
    <div className="space-y-3.5">
      <ProHeader crumbs={[{ label: t('dossiers.inscriptions.crumb') }]} icon={<Inbox />} title={t('dossiers.inscriptions.title')} subtitle={t('dossiers.inscriptions.subtitle')} />
      <ListeDossiers lignes={lignes} objetLabel={t('dossiers.inscriptions.objet')} objetIcone={<Car />} />
    </div>
  )
}
