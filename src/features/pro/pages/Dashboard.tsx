import { Link } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, BookOpen, Briefcase, Building2, CalendarDays, ExternalLink, Eye, GraduationCap, ImagePlus, Images, Layers, MapPin, Megaphone, MessageSquareText, PencilLine, Phone, Plus, Rocket, ShieldCheck, Wallet, Zap } from 'lucide-react'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import { Button } from '@/shared/components/ui/Button'
import { Card, Section } from '@/shared/components/ui/Card'
import { Img } from '@/shared/components/ui/Img'
import { Rating } from '@/shared/components/ui/StarRating'
import { Ring } from '@/shared/components/ui/Progress'
import { Stepper } from '@/shared/components/ui/Stepper'
import { IconTile, Kpi, KpiGrid, PageTitle, QuickAction } from '@/shared/components/ui/Blocks'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { ROUTES } from '@/shared/utils/routes'
import { CheckCircle2, Circle } from 'lucide-react'
import { useAvisEtablissement, useDocuments, useFaq, useMedias } from '@/data/hooks'
import { etatDuProfil, ETAPES_PROFIL, INFOS_A_GERER, type EtapeProfil } from '@/features/pro/proStats'
// Préinscription masquée (demande du porteur du projet, 2026-11-25) : import { Badge } from '@/shared/components/ui/Badge'

export function Dashboard() {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  // Ce que l'établissement a réellement publié : ses photos, ses documents, sa FAQ.
  const medias = useMedias(ecole.id).length
  const etat = etatDuProfil({ ecole, medias, documents: useDocuments(ecole.id).length, faq: useFaq(ecole.id).length })
  // Les avis de sa fiche qui attendent encore une réponse.
  const sansReponse = useAvisEtablissement(ecole.id).filter((a) => !a.reponse).length
  // Les préinscriptions envoyées par les candidats (les plus récentes d'abord).
  // Préinscription masquée (demande du porteur du projet, 2026-11-25) :
  // const recues = [...usePreinscriptionsRecues(ecole.id)].sort((a, b) => b.envoyeeLe.localeCompare(a.envoyeeLe))
  // Préinscription masquée (demande du porteur du projet, 2026-11-25) : const toutes = useFormations()
  const apparence = {
    presentation: { icon: <Building2 />, tone: 'blue' as const, to: ROUTES.pro.contents() },
    admission: { icon: <ShieldCheck />, tone: 'violet' as const, to: ROUTES.pro.contents('faq') },
    fees: { icon: <Wallet />, tone: 'amber' as const, to: ROUTES.pro.trainings },
    calendar: { icon: <CalendarDays />, tone: 'sky' as const, to: ROUTES.pro.contents('documents') },
    careers: { icon: <Briefcase />, tone: 'violet' as const, to: ROUTES.pro.trainings },
    contact: { icon: <Phone />, tone: 'blue' as const, to: ROUTES.pro.profile('coordonnees') },
  }
  const infos = INFOS_A_GERER.map((id) => ({ id, fait: etat.infos[id], ...apparence[id] }))
  // Où compléter chaque étape du profil.
  const versEtape: Record<EtapeProfil, string> = {
    profile: ROUTES.pro.profile(),
    trainings: ROUTES.pro.newTraining,
    info: ROUTES.pro.contents('faq'),
    gallery: ROUTES.pro.profile('medias'),
    optimisation: ROUTES.pro.profile('medias'),
  }
  return (
    <div className="space-y-6">
      <PageTitle
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <Button to={ecoleUrl(ecole)} variant="outline" size="lg">
            <Eye />
            {t('dashboard.viewPublicPage')}
            <ExternalLink />
          </Button>
        }
      />
      <KpiGrid>
        <Kpi icon={<GraduationCap />} label={t('dashboard.kpis.trainings')} value={ecole.formations} tone="blue" />
        <Kpi icon={<Layers />} label={t('dashboard.kpis.fields')} value={(ecole.principales ?? ecole.filieres).length} tone="green" />
        <Kpi icon={<Images />} label={t('dashboard.kpis.media')} value={medias} tone="violet" />
        <Kpi icon={<MessageSquareText />} label={t('dashboard.kpis.reviews')} value={ecole.avis} tone="amber" extra={ecole.avis > 0 ? <Rating value={ecole.note} className="text-sm" /> : undefined} />
      </KpiGrid>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <Ring value={etat.completude} size={104} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-navy-900">{t('dashboard.completion.title')}</h2>
                <p className="text-sm text-muted">{t(etat.restantes === 0 ? 'dashboard.completion.textComplete' : 'dashboard.completion.text')}</p>
                <Stepper
                  steps={ETAPES_PROFIL.map((e) => t(`dashboard.completion.steps.${e}`))}
                  current={etat.prochaine ? ETAPES_PROFIL.indexOf(etat.prochaine) : ETAPES_PROFIL.length}
                  tone="green"
                  className="mt-4"
                />
              </div>
            </div>
            {etat.prochaine && (
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-sm">
                <Rocket className="size-5 text-emerald-600" />
                <span className="flex-1">
                  <Trans t={t} i18nKey="dashboard.completion.remaining" values={{ count: etat.restantes, etape: t(`dashboard.completion.steps.${etat.prochaine}`) }} components={{ b: <b /> }} />
                </span>
                <Button to={versEtape[etat.prochaine]} variant="outline" size="sm">{t('dashboard.completion.finish')} <ArrowRight /></Button>
              </div>
            )}
          </Card>
          {/* Préinscription masquée (demande du porteur du projet, 2026-11-25) :
          <Card className="p-5">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-navy-900">
              <GraduationCap className="size-5 text-brand-600" />
              {t('dashboard.applications.title', { count: recues.length })}
            </h2>
            {recues.length === 0 ? (
              <p className="mt-3 rounded-xl bg-[#f3f6fc] px-4 py-3 text-sm text-muted">{t('dashboard.applications.none')}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {recues.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
                    <b className="text-navy-900">{[p.donnees.prenom, p.donnees.nom].filter(Boolean).join(' ') || t('dashboard.applications.anonymous')}</b>
                    <span className="min-w-0 basis-full break-words text-muted sm:basis-auto sm:flex-1">{toutes.find((f) => f.id === p.formationId)?.nom ?? '—'}</span>
                    <span className="shrink-0 text-xs text-muted">{shortDate(new Date(p.envoyeeLe), { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <Badge tone="green">{t('dashboard.applications.received')}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          */}
          <Section title={t('dashboard.infos.title')} icon={<Layers />}>
            <div className="grid gap-3 md:grid-cols-2">
              {infos.map((i) => (
                <Link key={i.id} to={i.to} className="flex items-center gap-3 rounded-2xl border border-line p-3 transition-colors hover:bg-brand-50">
                  <IconTile icon={i.icon} tone={i.tone} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-navy-900">{t(`dashboard.infos.${i.id}.label`)}</p>
                    <p className="truncate text-xs text-muted">{t(`dashboard.infos.${i.id}.text`)}</p>
                  </div>
                  {i.fait ? (
                    <CheckCircle2 className="size-5 text-emerald-500" aria-label={t('dashboard.infos.done')} />
                  ) : (
                    <Circle className="size-5 text-slate-300" aria-label={t('dashboard.infos.todo')} />
                  )}
                  <ArrowRight className="size-4 text-muted" />
                </Link>
              ))}
            </div>
          </Section>
        </div>
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-brand-50 px-5 py-3">
              <p className="flex items-center gap-2 font-bold text-navy-900"><Eye className="size-5 text-brand-600" /> {t('dashboard.preview.title')}</p>
              <Link to={ecoleUrl(ecole)} aria-label={t('dashboard.preview.open')}><ExternalLink className="size-4 text-brand-600" /></Link>
            </div>
            <div className="flex gap-4 p-5">
              <Img src={ecole.image} alt={ecole.nom} className="size-24 rounded-xl" />
              <div className="space-y-1.5">
                <p className="font-bold text-navy-900">{ecole.nom}</p>
                <Rating value={ecole.note} count={ecole.avis} />
                <p className="flex items-center gap-1 text-xs text-muted"><MapPin className="size-3.5" />{ecole.ville} – {ecole.quartier}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white"><BadgeCheck className="size-3.5" />{t('dashboard.preview.verified')}</span>
              </div>
            </div>
          </Card>
          <Section title={t('dashboard.quick.title')} icon={<Zap />}>
            <div className="space-y-2.5">
              <QuickAction tone="primary" icon={<Plus />} label={t('dashboard.quick.newTraining')} to={ROUTES.pro.newTraining} />
              <QuickAction icon={<ImagePlus />} label={t('dashboard.quick.addMedia')} to={ROUTES.pro.profile('medias')} />
              <QuickAction icon={<Megaphone />} label={<Trans t={t} i18nKey="dashboard.quick.replyReviews" values={{ count: sansReponse }} components={{ red: <span className="text-rose-500" /> }} />} to={`${ecoleUrl(ecole)}/avis`} />
              <QuickAction icon={<PencilLine />} label={t('dashboard.quick.updateInfo')} to={ROUTES.pro.profile()} />
              <QuickAction icon={<BookOpen />} label={t('dashboard.quick.publishNews')} to={ROUTES.pro.contents('actualites')} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
