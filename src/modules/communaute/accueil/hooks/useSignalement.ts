import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data, useCollection } from '@/data'
import { useSession } from '@/modules/compte/auth/hooks/useSession'

/**
 * Le signalement d'une publication par le compte connecté (table
 * `signalements`) : `signalee` tant qu'il existe ; `annuler` le retire
 * (« Annuler le signalement »). Le signalement lui-même s'envoie par la
 * fenêtre `ModaleSignalement` (motif et précision).
 */
export function useSignalement(publicationId: string) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const ligne = useCollection('signalements').find((s) => s.compteId === account?.id && s.publicationId === publicationId && !s.commentaireId)

  const annuler = async () => {
    if (!ligne) return
    try {
      await data.remove('signalements', ligne.id)
      toast.success(t('signalement.annule'))
    } catch {
      toast.error(t('signalement.erreur'))
    }
  }

  return { signalee: ligne !== undefined, annuler }
}
