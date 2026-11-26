import { Link } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, CalendarDays, CalendarPlus, Car, Coins, ExternalLink, Eye, ImagePlus, Inbox, MapPin, Megaphone, MessageSquareText, PencilLine, Zap } from 'lucide-react'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { useAvisAutoEcole, useInscriptionsRecues, useSessionsDe } from '@/data/hooks'
import { Button } from '@/shared/components/ui/Button'
import { Card, Section } from '@/shared/components/ui/Card'
import { Img } from '@/shared/components/ui/Img'
import { Rating } from '@/shared/components/ui/StarRating'
import { Kpi, KpiGrid, PageTitle, QuickAction } from '@/shared/components/ui/Blocks'
import { BadgeDossier } from '@/shared/components/ui/BadgeDossier'
import { dossierATraiter } from '@/shared/utils/dossiers'
import { dateDeDemo, demoDate, shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const DATE = { day: '2-digit', month: 'short', year: 'numeric' } as const
/** Minuit aujourd'hui (appelé hors du rendu). */
const aujourdhui = () => new Date(new Date().setHours(0, 0, 0, 0)).getTime()

/**
 * Tableau de bord de l'auto-école : même cadre que celui de l'espace pro
 * (img6), avec ce qui compte pour elle : inscriptions à traiter, prochaines
 * sessions, avis, aperçu de sa fiche publique.
 */
export function DashboardAutoEcole() {
  const { t } = useTranslation('pro')
  const { t: tae } = useTranslation('driving-schools')
  const { autoEcole, ecole } = useMonEcole()
  const inscriptions = [...useInscriptionsRecues(ecole.id)].sort((a, b) => b.envoyeeLe.localeCompare(a.envoyeeLe))
  const sessions = useSessionsDe(ecole.id)
  const sansReponse = useAvisAutoEcole(ecole.id).filter((x) => !x.reponse).length
  if (!autoEcole) return null
  const aTraiter = inscriptions.filter((i) => dossierATraiter(i.statut)).length
  const debut = aujourdhui()
  const prochaines = sessions.filter((s) => (dateDeDemo(s.debut)?.getTime() ?? 0) >= debut)
  const fiche = ROUTES.drivingSchool(autoEcole.id)
  return (
    <div className="space-y-6">
      <PageTitle
        title={t('dashboard.title')}
        subtitle={t('autoEcole.dashboard.subtitle')}
        actions={
          <Button to={fiche} variant="outline" size="lg">
            <Eye />
            {t('dashboard.viewPublicPage')}
            <ExternalLink />
          </Button>
        }
      />
      <KpiGrid>
        <Kpi icon={<Inbox />} label={t('autoEcole.dashboard.kpis.aTraiter')} value={aTraiter} tone="orange" />
        <Kpi icon={<CalendarDays />} label={t('autoEcole.dashboard.kpis.sessions')} value={prochaines.length} tone="blue" />
        <Kpi icon={<Car />} label={t('autoEcole.dashboard.kpis.permis')} value={autoEcole.permis.length} tone="green" />
        <Kpi icon={<MessageSquareText />} label={t('dashboard.kpis.reviews')} value={autoEcole.avis} tone="amber" extra={autoEcole.avis > 0 ? <Rating value={autoEcole.note} className="text-sm" /> : undefined} />
      </KpiGrid>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-navy-900">
                <Inbox className="size-5 text-brand-600" />
                {t('autoEcole.dashboard.inscriptions', { count: inscriptions.length })}
              </h2>
              {inscriptions.length > 0 && (
                <Button to={ROUTES.pro.enrollments} variant="outline" size="sm">
                  {t('dashboard.applications.manage')} <ArrowRight />
                </Button>
              )}
            </div>
            {inscriptions.length === 0 ? (
              <p className="mt-3 rounded-xl bg-[#f3f6fc] px-4 py-3 text-sm text-muted">{t('autoEcole.dashboard.aucuneInscription')}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {inscriptions.slice(0, 5).map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
                    <Link to={ROUTES.pro.enrollment(i.id)} className="font-bold text-navy-900 hover:text-brand-600">
                      {[i.donnees.prenom, i.donnees.nom].filter(Boolean).join(' ') || t('dossiers.anonyme')}
                    </Link>
                    <span className="min-w-0 flex-1 text-muted">{tae('common.licence', { code: i.permis })}</span>
                    <span className="shrink-0 text-xs text-muted">{shortDate(i.envoyeeLe, DATE)}</span>
                    <BadgeDossier statut={i.statut} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-navy-900">
                <CalendarDays className="size-5 text-brand-600" />
                {t('autoEcole.dashboard.prochaines')}
              </h2>
              <Button to={ROUTES.pro.planning} variant="outline" size="sm">
                {t('autoEcole.dashboard.voirPlanning')} <ArrowRight />
              </Button>
            </div>
            {prochaines.length === 0 ? (
              <p className="mt-3 rounded-xl bg-[#f3f6fc] px-4 py-3 text-sm text-muted">{t('autoEcole.planning.aucune')}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {prochaines.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 text-sm">
                    <b className="text-navy-900">{tae('common.licence', { code: s.permis })}</b>
                    <span>{demoDate(s.debut)}</span>
                    <span className="text-muted">{s.horaires.join(' · ')}</span>
                    <span className="ml-auto font-semibold text-navy-900">{t('autoEcole.dashboard.places', { count: s.places })}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-brand-50 px-5 py-3">
              <p className="flex items-center gap-2 font-bold text-navy-900"><Eye className="size-5 text-brand-600" /> {t('dashboard.preview.title')}</p>
              <Link to={fiche} aria-label={t('dashboard.preview.open')}><ExternalLink className="size-4 text-brand-600" /></Link>
            </div>
            <div className="flex gap-4 p-5">
              <Img src={autoEcole.logo ?? autoEcole.image} alt={autoEcole.nom} className="size-24 rounded-xl" />
              <div className="space-y-1.5">
                <p className="font-bold text-navy-900">{autoEcole.nom}</p>
                <Rating value={autoEcole.note} count={autoEcole.avis} />
                <p className="flex items-center gap-1 text-xs text-muted"><MapPin className="size-3.5" />{autoEcole.ville} – {autoEcole.quartier}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white"><BadgeCheck className="size-3.5" />{t('autoEcole.profil.agreee')}</span>
              </div>
            </div>
          </Card>
          <Section title={t('dashboard.quick.title')} icon={<Zap />}>
            <div className="space-y-2.5">
              <QuickAction tone="primary" icon={<CalendarPlus />} label={t('autoEcole.planning.ajouter')} to={ROUTES.pro.planning} />
              <QuickAction icon={<Coins />} label={t('autoEcole.dashboard.tarifs')} to={ROUTES.pro.licences} />
              <QuickAction icon={<ImagePlus />} label={t('dashboard.quick.addMedia')} to={ROUTES.pro.profile('medias')} />
              <QuickAction icon={<Megaphone />} label={<Trans t={t} i18nKey="dashboard.quick.replyReviews" values={{ count: sansReponse }} components={{ red: <span className="text-rose-500" /> }} />} to={ROUTES.drivingSchool(autoEcole.id, 'avis')} />
              <QuickAction icon={<PencilLine />} label={t('dashboard.quick.updateInfo')} to={ROUTES.pro.profile()} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
