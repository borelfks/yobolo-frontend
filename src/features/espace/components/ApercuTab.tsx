import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Bell, Car, ChevronRight, FileText, GraduationCap, Heart, History, Search, Star, UserRound, Zap } from 'lucide-react'
import { useAutoEcoles, useEtablissements, useFormations, useMesAvis, useMesInscriptions, useNotificationsCompte } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { completude } from '@/features/espace/espaceActions'
import { StatutDossier } from '@/features/espace/components/Dossiers'
import { Button } from '@/shared/components/ui/Button'
import { Card, Section } from '@/shared/components/ui/Card'
import { Kpi, KpiGrid, QuickAction } from '@/shared/components/ui/Blocks'
import { Progress } from '@/shared/components/ui/Progress'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** « Aperçu » : les chiffres du compte, ses dernières démarches, ses raccourcis. */
export function ApercuTab() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const { preinscriptions, inscriptionsAutoEcole } = useMesInscriptions(account?.id)
  const mesAvis = useMesAvis(account?.id)
  const { favorites } = useFavorites()
  const nonLues = useNotificationsCompte(account?.id).filter((n) => !n.lu).length
  const formations = useFormations()
  const etablissements = useEtablissements()
  const autoEcoles = useAutoEcoles()
  if (!account) return null

  const actives = <T extends { statut: string }>(l: T[]) => l.filter((x) => x.statut !== 'Annulée').length
  const nbAvis = mesAvis.etablissements.length + mesAvis.autoEcoles.length
  // Les cinq dernières démarches : préinscriptions et inscriptions (avec leur statut).
  const demarches = [
    ...preinscriptions.map((p) => ({
      id: p.id,
      le: p.envoyeeLe,
      genre: t('apercu.genres.preinscription'),
      titre: formations.find((f) => f.id === p.formationId)?.nom ?? '—',
      lieu: etablissements.find((e) => e.id === p.etablissementId)?.nom ?? '—',
      statut: p.statut,
      vers: ROUTES.espacePreinscription(p.id),
      icone: <GraduationCap />,
    })),
    ...inscriptionsAutoEcole.map((i) => ({
      id: i.id,
      le: i.envoyeeLe,
      genre: t('apercu.genres.permis', { code: i.permis }),
      titre: t('dossiers.permis', { code: i.permis }),
      lieu: autoEcoles.find((a) => a.id === i.autoEcoleId)?.nom ?? '—',
      statut: i.statut,
      vers: ROUTES.espaceInscription(i.id),
      icone: <Car />,
    })),
  ]
    .sort((a, b) => b.le.localeCompare(a.le))
    .slice(0, 5)
  const pct = completude(account)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[22px] font-bold text-navy-900">{t('apercu.bonjour', { name: account.name.split(' ')[0] })}</h2>
        <p className="text-[15px] text-muted">{t('apercu.texte')}</p>
      </div>
      <KpiGrid>
        <Kpi icon={<FileText />} label={t('apercu.kpis.preinscriptions')} value={actives(preinscriptions)} tone="blue" />
        <Kpi icon={<Car />} label={t('apercu.kpis.permis')} value={actives(inscriptionsAutoEcole)} tone="green" />
        <Kpi icon={<Heart />} label={t('apercu.kpis.favoris')} value={favorites.length} tone="violet" />
        <Kpi icon={<Star />} label={t('apercu.kpis.avis')} value={nbAvis} tone="amber" />
      </KpiGrid>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Section title={t('apercu.activite')} icon={<History />}>
          {demarches.length === 0 ? (
            <div className="space-y-3 rounded-xl bg-page p-4 text-sm text-muted">
              <p>{t('apercu.aucuneActivite')}</p>
              <Button to={ROUTES.schools} size="sm">
                <Search aria-hidden="true" />
                {t('apercu.trouverFormation')}
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {demarches.map((d) => (
                <li key={d.id}>
                  <Link to={d.vers} className="flex items-center gap-3 py-3 hover:bg-page/60">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 [&_svg]:size-5">{d.icone}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-navy-900">{d.titre}</span>
                      <span className="block truncate text-[13px] text-muted">
                        {d.genre} · {d.lieu} · {shortDate(d.le, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </span>
                    <StatutDossier statut={d.statut} />
                    <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
        <div className="space-y-4">
          <Card className="space-y-3 p-5">
            <p className="flex items-center gap-2 font-bold text-navy-900">
              <Bell className="size-5 text-brand-600" aria-hidden="true" />
              {t('apercu.notifications', { count: nonLues })}
            </p>
            <Button to={ROUTES.espace('notifications')} variant="outline" size="sm">
              {t('apercu.voirNotifications')}
            </Button>
            <div className="border-t border-line pt-3">
              <p className="mb-1.5 text-sm font-semibold text-navy-900">{t('apercu.profilComplet', { pct })}</p>
              <Progress value={pct} tone={pct === 100 ? 'green' : 'brand'} />
            </div>
          </Card>
          <Section title={t('apercu.actions')} icon={<Zap />}>
            <div className="space-y-2.5">
              <QuickAction tone="primary" icon={<GraduationCap />} label={t('apercu.trouverFormation')} to={ROUTES.schools} />
              <QuickAction icon={<Car />} label={t('apercu.trouverAutoEcole')} to={ROUTES.drivingSchools} />
              <QuickAction icon={<Heart />} label={t('apercu.voirFavoris')} to={ROUTES.favorites} />
              <QuickAction icon={<UserRound />} label={t('apercu.completerProfil')} to={ROUTES.espace('profil')} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
