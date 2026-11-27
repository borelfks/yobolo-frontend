import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data, useCollection } from '@/data'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { Field, Radio, Textarea } from '@/shared/forms/Fields'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import type { MotifDeSignalement } from '@/shared/types'

const MOTIFS: MotifDeSignalement[] = ['spam', 'proposHaineux', 'contenuTrompeur', 'horsSujet']
const LONGUEUR_MAX_PRECISION = 1000

/**
 * Signaler une publication ou un commentaire (ModaleSignalement de
 * yibolo-client) : un motif dans une liste fermée et une précision facultative,
 * enregistrés dans la table `signalements`. Un compte ne signale qu'une fois
 * le même contenu.
 */
export function ModaleSignalement({ ouverte, publicationId, commentaireId, onFermer }: { ouverte: boolean; publicationId: string; /** Un commentaire de la publication (sinon : la publication). */ commentaireId?: string; onFermer: () => void }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const signalements = useCollection('signalements')
  const [motif, setMotif] = useState<MotifDeSignalement>('spam')
  const [precision, setPrecision] = useState('')
  const [enCours, setEnCours] = useState(false)

  const envoyer = async () => {
    if (!account) return
    if (signalements.some((s) => s.compteId === account.id && s.publicationId === publicationId && s.commentaireId === commentaireId)) {
      toast(t('signalement.dejaSignale'))
      onFermer()
      return
    }
    setEnCours(true)
    try {
      await data.create('signalements', { compteId: account.id, publicationId, commentaireId, motif, precision: precision.trim(), le: new Date().toISOString() }, 'signalement')
      toast.success(t('signalement.envoye'))
      setPrecision('')
      onFermer()
    } catch {
      toast.error(t('signalement.erreur'))
    } finally {
      setEnCours(false)
    }
  }

  // Posée sur la page : une colonne collante (xl:sticky) retiendrait la fenêtre sous la barre du haut.
  return createPortal(
    <Modal
      open={ouverte}
      onClose={onFermer}
      title={commentaireId ? t('signalement.titreCommentaire') : t('signalement.titre')}
      footer={
        <>
          <Button variant="neutral" onClick={onFermer}>
            {t('signalement.annuler')}
          </Button>
          <Button variant="danger" disabled={enCours} onClick={() => void envoyer()}>
            {t('actions.signaler')}
          </Button>
        </>
      }
    >
      <p className="-mt-2 text-sm text-muted-foreground">{t('signalement.description')}</p>
      <fieldset className="mt-4 flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-semibold text-navy-900">{t('signalement.motif')}</legend>
        {MOTIFS.map((un) => (
          <Radio key={un} name="motif-signalement" label={t(`signalement.motifs.${un}`)} checked={motif === un} onChange={() => setMotif(un)} />
        ))}
      </fieldset>
      <Field
        className="mt-4"
        label={
          <span className="flex items-baseline justify-between gap-2">
            {t('signalement.precision')}
            <span className="text-xs font-normal text-muted-foreground tabular-nums">
              {precision.length} / {LONGUEUR_MAX_PRECISION}
            </span>
          </span>
        }
        hint={t('signalement.precisionAide')}
      >
        <Textarea rows={3} maxLength={LONGUEUR_MAX_PRECISION} value={precision} onChange={(evenement) => setPrecision(evenement.target.value)} />
      </Field>
    </Modal>,
    document.body,
  )
}
