import { useTranslation } from 'react-i18next'
import { GraduationCap, Inbox } from 'lucide-react'
import { ProHeader } from '@/features/pro/components/ProBlocks'
import { ListeDossiers } from '@/features/pro/components/ListeDossiers'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { useDossiersPreinscription, useFormations } from '@/data/hooks'
import { ROUTES } from '@/shared/utils/routes'

/** Les préinscriptions reçues par l'établissement : à étudier, compléter, accepter ou refuser. */
export function Preinscriptions() {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  const dossiers = useDossiersPreinscription(ecole.id)
  const formations = useFormations()
  const lignes = dossiers.map((p) => ({
    id: p.id,
    candidat: `${(p.donnees.nom ?? '').toUpperCase()} ${p.donnees.prenom ?? ''}`.trim() || t('dossiers.anonyme'),
    telephone: p.donnees.telephone,
    objet: formations.find((f) => f.id === p.formationId)?.nom ?? '—',
    envoyeeLe: p.envoyeeLe,
    statut: p.statut,
    vers: ROUTES.pro.preRegistration(p.id),
  }))
  return (
    <div className="space-y-3.5">
      <ProHeader crumbs={[{ label: t('dossiers.preinscriptions.crumb') }]} icon={<Inbox />} title={t('dossiers.preinscriptions.title')} subtitle={t('dossiers.preinscriptions.subtitle')} />
      <ListeDossiers lignes={lignes} objetLabel={t('dossiers.preinscriptions.objet')} objetIcone={<GraduationCap />} />
    </div>
  )
}
