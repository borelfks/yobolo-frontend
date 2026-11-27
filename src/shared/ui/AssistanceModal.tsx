import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Headphones } from 'lucide-react'
import { data } from '@/data'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Label, Select, Textarea } from '@/shared/forms/Fields'

const SUJETS = ['compte', 'profil', 'formations', 'validation', 'autre'] as const

/** L'heure d'envoi (ISO). */
const maintenant = () => new Date().toISOString()

/**
 * « Assistance YIBOLO » : une demande au support (sujet + message),
 * enregistrée dans la base (table `demandesAssistance`).
 */
export function AssistanceModal({ open, onClose, compteId }: { open: boolean; onClose: () => void; compteId: string }) {
  const { t } = useTranslation('common', { keyPrefix: 'assistance' })
  const schema = useMemo(
    () => z.object({ sujet: z.enum(SUJETS), message: z.string().trim().min(10, t('errors.message')) }),
    [t],
  )
  const { register, handleSubmit, formState, reset } = useForm({ resolver: zodResolver(schema), defaultValues: { sujet: 'compte' as const, message: '' } })
  const fermer = () => {
    reset()
    onClose()
  }
  const envoyer = async (v: { sujet: (typeof SUJETS)[number]; message: string }) => {
    await data.create('demandesAssistance', { compteId, sujet: t(`subjects.${v.sujet}`), message: v.message.trim(), envoyeeLe: maintenant(), statut: 'Envoyée' }, 'demande')
    toast.success(t('sent'))
    fermer()
  }
  return (
    <Modal open={open} onClose={fermer} title={t('title')} icon={<Headphones className="mt-0.5 size-5 text-brand-600" />}>
      <form noValidate onSubmit={handleSubmit(envoyer)} className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('hours')}</p>
        <div>
          <Label htmlFor="assistance-sujet">{t('subject')}</Label>
          <Select id="assistance-sujet" options={SUJETS.map((s) => ({ value: s, label: t(`subjects.${s}`) }))} {...register('sujet')} />
        </div>
        <div>
          <Label htmlFor="assistance-message">{t('message')}</Label>
          <Textarea id="assistance-message" rows={4} placeholder={t('placeholder')} {...register('message')} max={undefined} />
          {formState.errors.message && <p className="mt-1 text-xs font-medium text-rose-600">{formState.errors.message.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
          {t('send')}
        </Button>
      </form>
    </Modal>
  )
}
