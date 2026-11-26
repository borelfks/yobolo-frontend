import { useMemo, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CircleCheck, CircleX, Hourglass, Mail, MessageCircle, Phone, Send, Undo2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { BadgeDossier } from '@/shared/components/ui/BadgeDossier'
import { Field, Textarea } from '@/shared/components/forms/Fields'
import { ProCard } from '@/features/pro/components/ProBlocks'
import { dossierOuvert, type DecisionDossier as Decision } from '@/shared/utils/dossiers'
import { lienTelephone, lienWhatsApp } from '@/shared/utils/liens'
import type { StatutDossier } from '@/shared/types'

/** Décision → clé de traduction (`dossiers.decision.<clé>`). */
const CLE: Record<Decision, 'etude' | 'complement' | 'accepter' | 'refuser'> = {
  'En étude': 'etude',
  'Complément demandé': 'complement',
  Acceptée: 'accepter',
  Refusée: 'refuser',
}

/** Un message est obligatoire quand on demande un complément ou qu'on refuse (le candidat doit savoir pourquoi). */
const messageObligatoire = (d: Decision) => d === 'Complément demandé' || d === 'Refusée'

/**
 * « Traiter le dossier » : mettre en étude, demander un complément, accepter,
 * refuser. Chaque décision passe par une fenêtre où l'établissement écrit au
 * candidat ; le candidat est prévenu (notification) et le lit dans Mon espace.
 * Un dossier tranché peut être rouvert (remis à l'étude).
 */
export function DecisionDossier({ statut, onDecider }: { statut: StatutDossier; onDecider: (decision: Decision, texte: string) => Promise<void> }) {
  const { t } = useTranslation('pro')
  const [choix, setChoix] = useState<Decision | null>(null)
  const ouvert = dossierOuvert(statut)
  const boutons: { d: Decision; icon: ReactNode; variant: 'soft' | 'outline' | 'success' | 'danger-outline' }[] = [
    { d: 'En étude', icon: <Hourglass />, variant: 'soft' },
    { d: 'Complément demandé', icon: <Send />, variant: 'outline' },
    { d: 'Acceptée', icon: <CircleCheck />, variant: 'success' },
    { d: 'Refusée', icon: <CircleX />, variant: 'danger-outline' },
  ]
  return (
    <ProCard title={t('dossiers.decision.titre')} icon={<CircleCheck />}>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-navy-900">
        {t('dossiers.decision.statut')} <BadgeDossier statut={statut} />
      </p>
      {statut === 'Annulée' ? (
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-muted">{t('dossiers.decision.annule')}</p>
      ) : ouvert ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {boutons
            .filter((b) => b.d !== statut)
            .map((b) => (
              <Button key={b.d} variant={b.variant} onClick={() => setChoix(b.d)} className="justify-center">
                {b.icon}
                {t(`dossiers.decision.${CLE[b.d]}`)}
              </Button>
            ))}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-muted">{t('dossiers.decision.clos')}</p>
          <Button variant="outline" size="sm" onClick={() => setChoix('En étude')}>
            <Undo2 />
            {t('dossiers.decision.rouvrir')}
          </Button>
        </div>
      )}
      {choix && <FenetreDecision decision={choix} onClose={() => setChoix(null)} onDecider={onDecider} />}
    </ProCard>
  )
}

function FenetreDecision({ decision, onClose, onDecider }: { decision: Decision; onClose: () => void; onDecider: (decision: Decision, texte: string) => Promise<void> }) {
  const { t } = useTranslation('pro')
  const cle = CLE[decision]
  const [envoi, setEnvoi] = useState(false)
  const schema = useMemo(() => z.object({ texte: messageObligatoire(decision) ? z.string().trim().min(3, t('dossiers.decision.requis')) : z.string() }), [decision, t])
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema), defaultValues: { texte: '' } })
  const confirmer = handleSubmit(async ({ texte }) => {
    setEnvoi(true)
    try {
      await onDecider(decision, texte)
      toast.success(t('dossiers.decision.faite'))
      onClose()
    } catch {
      toast.error(t('dossiers.decision.echec'))
    } finally {
      setEnvoi(false)
    }
  })
  return (
    <Modal
      open
      onClose={onClose}
      title={t(`dossiers.decision.fenetre.${cle}.titre`)}
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>
            {t('dossiers.decision.annuler')}
          </Button>
          <Button variant={decision === 'Refusée' ? 'danger' : decision === 'Acceptée' ? 'success' : 'primary'} disabled={envoi} onClick={() => void confirmer()}>
            {t('dossiers.decision.confirmer')}
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={(e) => void confirmer(e)} className="space-y-3">
        <p className="text-sm text-navy-900">{t(`dossiers.decision.fenetre.${cle}.texte`)}</p>
        <Field label={t(`dossiers.decision.fenetre.${cle}.label`)} required={messageObligatoire(decision)} error={formState.errors.texte?.message}>
          <Textarea rows={4} placeholder={t(`dossiers.decision.fenetre.${cle}.exemple`)} {...register('texte')} max={undefined} />
        </Field>
      </form>
    </Modal>
  )
}

/** « Contacter le candidat » : appel, WhatsApp, e-mail (de vrais liens). */
export function ContactCandidat({ telephone, email }: { telephone?: string; email?: string }) {
  const { t } = useTranslation('pro')
  if (!telephone && !email) return null
  return (
    <ProCard title={t('dossiers.contact.titre')} icon={<Phone />}>
      <div className="mt-3 flex flex-wrap gap-2">
        {telephone && (
          <>
            <Button to={lienTelephone(telephone)} variant="outline" size="sm">
              <Phone />
              {t('dossiers.contact.appeler')}
            </Button>
            <Button to={lienWhatsApp(telephone)} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
              <MessageCircle />
              {t('dossiers.contact.whatsapp')}
            </Button>
          </>
        )}
        {email && (
          <Button to={`mailto:${email}`} variant="outline" size="sm">
            <Mail />
            {t('dossiers.contact.email')}
          </Button>
        )}
      </div>
    </ProCard>
  )
}
