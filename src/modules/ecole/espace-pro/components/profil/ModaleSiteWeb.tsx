import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Globe } from 'lucide-react'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/shadcn/dialog'

/**
 * « Vous n’avez pas encore de site web ? » : ouverte après un enregistrement du
 * profil sans site web. « Être contacté » enregistre une demande à
 * l'assistance (table `demandesAssistance`).
 */
export function ModaleSiteWeb({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation('pro', { keyPrefix: 'profil.siteWeb' })
  const { account } = useSession()
  const demander = async () => {
    if (account) {
      // Sujet et message gardés en français (les données ne se traduisent pas), pour retrouver la demande dans les deux langues.
      await data.create('demandesAssistance', { compteId: account.id, sujet: t('sujet', { lng: 'fr' }), message: t('message', { lng: 'fr' }), envoyeeLe: new Date().toISOString(), statut: 'Envoyée' }, 'demande')
    }
    toast.success(t('envoyee'))
    onClose()
  }
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="gap-3.5 rounded-2xl p-5 sm:max-w-[440px]">
        <DialogHeader className="flex-row items-start gap-2.5 pr-8 text-left">
          <Globe className="mt-0.5 size-[22px] shrink-0 text-primary" aria-hidden />
          <DialogTitle className="text-lg leading-snug font-bold">{t('titre')}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-ui text-foreground">{t('texte')}</DialogDescription>
        <DialogFooter className="flex-row flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t('plusTard')}
          </Button>
          <Button onClick={() => void demander()}>{t('action')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
