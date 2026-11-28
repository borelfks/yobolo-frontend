import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data, useCollection } from '@/data'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { Champ } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/shadcn/dialog'
import { RadioGroup, RadioGroupOption } from '@/shared/shadcn/radio-group'
import { Textarea } from '@/shared/shadcn/textarea'
import type { MotifDeSignalement } from '@/shared/types'

const MOTIFS: MotifDeSignalement[] = ['spam', 'proposHaineux', 'contenuTrompeur', 'horsSujet']
const LONGUEUR_MAX_PRECISION = 1000

/**
 * Signaler une publication ou un commentaire : un motif dans une liste fermée
 * et une précision facultative, enregistrés dans la table `signalements` (lus
 * par la modération). Un compte ne signale qu'une fois le même contenu.
 */
export function ModaleSignalement({ ouverte, publicationId, commentaireId, onFermer }: { ouverte: boolean; publicationId: string; /** Un commentaire de la publication (sinon : la publication). */ commentaireId?: string; onFermer: () => void }) {
  const { t } = useTranslation('accueil')
  const id = useId()
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

  return (
    <Dialog open={ouverte} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold">{commentaireId ? t('signalement.titreCommentaire') : t('signalement.titre')}</DialogTitle>
          <DialogDescription>{t('signalement.description')}</DialogDescription>
        </DialogHeader>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-bold text-foreground">{t('signalement.motif')}</legend>
          <RadioGroup value={motif} onValueChange={(v) => setMotif(MOTIFS.find((m) => m === v) ?? 'spam')} className="grid gap-2 sm:grid-cols-2">
            {MOTIFS.map((un) => (
              <RadioGroupOption key={un} value={un} className="h-11 text-sm">
                {t(`signalement.motifs.${un}`)}
              </RadioGroupOption>
            ))}
          </RadioGroup>
        </fieldset>
        <Champ id={`${id}-precision`} label={t('signalement.precision')} facultatif aide={`${t('signalement.precisionAide')} (${precision.length} / ${LONGUEUR_MAX_PRECISION})`}>
          <Textarea id={`${id}-precision`} rows={3} className="min-h-24" maxLength={LONGUEUR_MAX_PRECISION} value={precision} onChange={(e) => setPrecision(e.target.value)} />
        </Champ>
        <DialogFooter>
          <Button variant="outline" onClick={onFermer}>
            {t('signalement.annuler')}
          </Button>
          <Button variant="destructive-solid" loading={enCours} onClick={() => void envoyer()}>
            {t('signalement.envoyer')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
