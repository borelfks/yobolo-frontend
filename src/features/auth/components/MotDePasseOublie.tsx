import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { KeyRound } from 'lucide-react'
import { data } from '@/data'
import { useComptes } from '@/data/hooks'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Input, Label } from '@/shared/components/forms/Fields'
import type { Compte } from '@/shared/types'
import { normaliserIdentifiant, protegerMotDePasse } from '@/shared/utils/motDePasse'

/** Un code à 6 chiffres, au hasard. */
const nouveauCode = () => String(crypto.getRandomValues(new Uint32Array(1))[0]! % 1_000_000).padStart(6, '0')

/** « +237 6 90 12 34 56 » → « +237 6•• •• •• 56 » : le numéro reste reconnaissable sans être affiché en entier. */
const masquer = (telephone: string) => telephone.replace(/\d(?=[\d\s]{3,}$)/g, (c, i: number) => (i < 6 ? c : '•'))

/**
 * « Mot de passe oublié ? » : l'identifiant, puis un code de vérification et
 * le nouveau mot de passe, enregistré (haché) dans la base. Sans serveur, le
 * code ne peut pas partir par SMS : il s'affiche dans la fenêtre.
 */
export function MotDePasseOublie({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation('auth', { keyPrefix: 'connexion.forgot' })
  const comptes = useComptes()
  const [compte, setCompte] = useState<Compte | null>(null)
  const [code, setCode] = useState('')

  const schemaIdentifiant = useMemo(() => z.object({ identifiant: z.string().min(1, t('errors.identifier')) }), [t])
  const schemaNouveau = useMemo(
    () =>
      z
        .object({
          code: z.string().length(6, t('errors.code')),
          motDePasse: z.string().min(8, t('errors.passwordLength')),
          confirmation: z.string(),
        })
        .refine((v) => v.motDePasse === v.confirmation, { path: ['confirmation'], message: t('errors.passwordMatch') }),
    [t],
  )
  const etape1 = useForm({ resolver: zodResolver(schemaIdentifiant), defaultValues: { identifiant: '' } })
  const etape2 = useForm({ resolver: zodResolver(schemaNouveau), defaultValues: { code: '', motDePasse: '', confirmation: '' } })

  const fermer = () => {
    setCompte(null)
    setCode('')
    etape1.reset()
    etape2.reset()
    onClose()
  }

  const envoyerCode = ({ identifiant }: { identifiant: string }) => {
    const cle = normaliserIdentifiant(identifiant)
    const trouve = comptes.find((c) => normaliserIdentifiant(c.identifiant) === cle || normaliserIdentifiant(c.telephone) === cle)
    if (!trouve) {
      etape1.setError('identifiant', { message: t('errors.unknown') })
      return
    }
    setCompte(trouve)
    setCode(nouveauCode())
  }

  const changer = async (v: { code: string; motDePasse: string }) => {
    if (!compte) return
    if (v.code !== code) {
      etape2.setError('code', { message: t('errors.wrongCode') })
      return
    }
    await data.update('comptes', compte.id, { motDePasse: await protegerMotDePasse(v.motDePasse) })
    toast.success(t('done'))
    fermer()
  }

  const erreur = (m?: string) => m && <p className="mt-1 text-xs font-medium text-rose-600">{m}</p>

  return (
    <Modal open={open} onClose={fermer} title={t('title')} icon={<KeyRound className="mt-0.5 size-5 text-brand-600" />}>
      {!compte ? (
        <form noValidate onSubmit={etape1.handleSubmit(envoyerCode)} className="space-y-4">
          <p className="text-sm text-muted">{t('intro')}</p>
          <div>
            <Label htmlFor="oubli-identifiant">{t('identifier')}</Label>
            <Input id="oubli-identifiant" autoComplete="username" {...etape1.register('identifiant')} />
            {erreur(etape1.formState.errors.identifiant?.message)}
          </div>
          <Button type="submit" className="w-full">
            {t('sendCode')}
          </Button>
        </form>
      ) : (
        <form noValidate onSubmit={etape2.handleSubmit(changer)} className="space-y-4">
          <p className="text-sm text-muted">{t('codeSent', { phone: masquer(compte.telephone) })}</p>
          <p role="status" className="rounded-xl border border-dashed border-brand-200 bg-brand-50 px-3.5 py-2.5 text-sm text-navy-900">
            {t('demoCode')} <b className="tracking-[0.2em]">{code}</b>
          </p>
          <div>
            <Label htmlFor="oubli-code">{t('code')}</Label>
            <Input id="oubli-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} {...etape2.register('code')} />
            {erreur(etape2.formState.errors.code?.message)}
          </div>
          <div>
            <Label htmlFor="oubli-mdp">{t('newPassword')}</Label>
            <Input id="oubli-mdp" type="password" autoComplete="new-password" {...etape2.register('motDePasse')} />
            {erreur(etape2.formState.errors.motDePasse?.message)}
          </div>
          <div>
            <Label htmlFor="oubli-confirmation">{t('confirmPassword')}</Label>
            <Input id="oubli-confirmation" type="password" autoComplete="new-password" {...etape2.register('confirmation')} />
            {erreur(etape2.formState.errors.confirmation?.message)}
          </div>
          <Button type="submit" className="w-full" disabled={etape2.formState.isSubmitting}>
            {t('save')}
          </Button>
        </form>
      )}
    </Modal>
  )
}
