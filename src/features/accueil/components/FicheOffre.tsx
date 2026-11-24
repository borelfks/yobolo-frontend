import { zodResolver } from '@hookform/resolvers/zod'
import { BriefcaseBusiness, CalendarClock, CheckCircle2, MapPin, Share2, Wallet } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { data } from '@/data'
import { useCandidatures, useEtablissements } from '@/data/hooks'
import { dateRelativeDuFil, jourEtMois } from '@/features/accueil/accueilDates'
import { usePartage } from '@/features/accueil/hooks/usePartage'
import { useRemuneration } from '@/features/accueil/hooks/useRemuneration'
import { useSession } from '@/features/auth/hooks/useSession'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import { Field, Textarea } from '@/shared/components/forms/Fields'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import type { OffreEmploi } from '@/shared/types'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()
/** Vrai si la date est déjà passée. */
const estPassee = (iso: string) => new Date(iso).getTime() < Date.now()

const LONGUEUR_MAX_MESSAGE = 1000

function Ligne({ icone, children }: { icone: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm text-ink [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-brand-600">
      {icone}
      {children}
    </li>
  )
}

/**
 * La fiche d'une offre d'emploi, ouverte sur l'accueil (`?offre=…`) : le
 * poste, le recruteur, le contrat, la rémunération, la clôture, puis
 * « Postuler » (un message facultatif) qui enregistre une candidature dans la
 * table `candidatures`. Une candidature envoyée s'affiche et peut être retirée.
 */
export function FicheOffre({ offre, onFermer }: { offre: OffreEmploi; onFermer: () => void }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const { partager } = usePartage()
  const remuneration = useRemuneration(offre.remuneration)
  const ecole = useEtablissements().find((e) => e.id === offre.etablissementId)
  const candidature = useCandidatures(account?.id).find((c) => c.offreId === offre.id)
  const cloturee = estPassee(offre.clotureeLe)

  const schema = useMemo(
    () => z.object({ message: z.string().trim().max(LONGUEUR_MAX_MESSAGE, t('offre.erreurs.messageTropLong', { max: LONGUEUR_MAX_MESSAGE })) }),
    [t],
  )
  const { register, handleSubmit, formState, reset } = useForm({ resolver: zodResolver(schema), defaultValues: { message: '' } })
  const champ = register('message')

  const postuler = handleSubmit(async ({ message }) => {
    if (!account) return
    try {
      await data.create('candidatures', { compteId: account.id, offreId: offre.id, message, le: maintenant() }, 'candidature')
      reset()
      toast.success(t('offre.candidatureEnvoyee'))
    } catch {
      toast.error(t('offre.erreurs.envoi'))
    }
  })

  const retirer = async () => {
    if (!candidature) return
    try {
      await data.remove('candidatures', candidature.id)
      toast.success(t('offre.candidatureRetiree'))
    } catch {
      toast.error(t('offre.erreurs.envoi'))
    }
  }

  return createPortal(
    <Modal
      open
      onClose={onFermer}
      size="lg"
      title={offre.titre}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="neutral" onClick={() => void partager(ROUTES.accueilOffre(offre.id), offre.titre)}>
            <Share2 aria-hidden="true" />
            {t('actions.partager')}
          </Button>
          {!candidature && !cloturee && (
            <Button disabled={formState.isSubmitting} onClick={() => void postuler()}>
              {t('offre.postuler')}
            </Button>
          )}
        </div>
      }
    >
      <div className="flex max-h-[60dvh] flex-col gap-4 overflow-y-auto pr-1">
        <p className="text-sm text-muted">
          {ecole ? (
            <Link to={ecoleUrl(ecole)} className="font-semibold text-brand-600 hover:underline">
              {offre.publieurNom}
            </Link>
          ) : (
            <span className="font-semibold text-navy-900">{offre.publieurNom}</span>
          )}
          {' · '}
          {t(`badge.${offre.publieurType}`)}
          {' · '}
          <time dateTime={offre.publieeLe}>{dateRelativeDuFil(offre.publieeLe)}</time>
        </p>

        <ul className="grid gap-2 sm:grid-cols-2">
          <Ligne icone={<MapPin />}>{offre.lieu}</Ligne>
          <Ligne icone={<BriefcaseBusiness />}>
            {t(`contrats.${offre.typeDeContrat}`)} · {t(`modes.${offre.modeDeTravail}`)}
          </Ligne>
          {remuneration && <Ligne icone={<Wallet />}>{remuneration}</Ligne>}
          <Ligne icone={<CalendarClock />}>{t('offre.clotureLe', { date: jourEtMois(offre.clotureeLe) })}</Ligne>
        </ul>

        {offre.description && (
          <section className="flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-navy-900">{t('offre.poste')}</h3>
            <p className="text-sm leading-relaxed text-ink">{offre.description}</p>
          </section>
        )}

        {candidature ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-emerald-50 p-3">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <Badge tone="green">{t('offre.candidatureEnvoyeeBadge')}</Badge>
              <p className="mt-1 text-xs text-muted">{t('offre.envoyeeLe', { date: shortDate(candidature.le) })}</p>
              {candidature.message && <p className="mt-1 text-sm whitespace-pre-line text-ink">{candidature.message}</p>}
            </div>
            <Button variant="danger-outline" size="sm" onClick={() => void retirer()}>
              {t('offre.retirerCandidature')}
            </Button>
          </div>
        ) : cloturee ? (
          <p className="rounded-xl bg-page p-3 text-sm text-muted">{t('offre.cloturee')}</p>
        ) : (
          <form onSubmit={(evenement) => void postuler(evenement)}>
            <Field label={t('offre.message')} hint={t('offre.messageAide')} error={formState.errors.message?.message}>
              <Textarea
                rows={3}
                maxLength={LONGUEUR_MAX_MESSAGE}
                placeholder={t('offre.messagePlaceholder')}
                {...champ}
                max={undefined}
              />
            </Field>
          </form>
        )}
      </div>
    </Modal>,
    document.body,
  )
}
