import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Globe } from 'lucide-react'
import { useSession } from '@/features/auth/hooks/useSession'
import { data } from '@/data'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'

/**
 * « Pas encore de site web ? » : ouverte après un enregistrement du profil sans site web.
 * « Être contacté » enregistre une demande à l'assistance (table `demandesAssistance`).
 */
export function ModaleSiteWeb({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation('pro', { keyPrefix: 'profil.contact.noWebsite' })
  const { account } = useSession()
  const demander = async () => {
    if (account) {
      // Sujet et message gardés en français (les données ne se traduisent pas), pour retrouver la demande dans les deux langues.
      await data.create('demandesAssistance', { compteId: account.id, sujet: t('subject', { lng: 'fr' }), message: t('message', { lng: 'fr' }), envoyeeLe: new Date().toISOString(), statut: 'Envoyée' }, 'demande')
    }
    toast.success(t('sent'))
    onClose()
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('title')}
      icon={<Globe className="mt-0.5 size-5 text-brand-600" aria-hidden />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{t('later')}</Button>
          <Button onClick={() => void demander()}>{t('cta')}</Button>
        </>
      }
    >
      <p className="text-[15px] leading-relaxed text-navy-900">{t('text')}</p>
    </Modal>
  )
}
