import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { AuthShell } from '@/app/layouts/AuthLayout'
import { data } from '@/data'
import { useComptes } from '@/data/hooks'
import { VerificationCode } from '@/features/auth/components/VerificationCode'
import { chiffresDuNumero, numeroValide } from '@/features/auth/authOtp'
import { Field, PhoneInput } from '@/shared/components/forms/Fields'
import { Button } from '@/shared/components/ui/Button'
import type { Compte } from '@/shared/types'
import { protegerMotDePasse } from '@/shared/utils/motDePasse'
import { ROUTES } from '@/shared/utils/routes'
import { ChampMotDePasse, JaugeMotDePasse } from '@/shared/components/forms/MotDePasse'

/**
 * « Mot de passe oublié », comme dans yibolo-client : le numéro du compte,
 * puis le code reçu (OTP, affiché à l'écran faute de serveur d'envoi), puis
 * le nouveau mot de passe, enregistré haché dans la base.
 */
export function MotDePasseOublie() {
  const { t } = useTranslation('auth', { keyPrefix: 'oubli' })
  const comptes = useComptes()
  const navigate = useNavigate()
  const [compte, setCompte] = useState<Compte | null>(null)
  const [verifie, setVerifie] = useState(false)

  const schemaNumero = useMemo(() => z.object({ telephone: z.string().refine(numeroValide, t('erreurs.telephone')) }), [t])
  const schemaMotDePasse = useMemo(
    () =>
      z
        .object({ motDePasse: z.string().min(8, t('erreurs.motDePasse')), confirmation: z.string() })
        .refine((v) => v.motDePasse === v.confirmation, { path: ['confirmation'], message: t('erreurs.different') }),
    [t],
  )
  // Déstructurés à l'appel : avec le React Compiler, l'état du formulaire (erreurs) se met ainsi à jour à l'écran.
  const { register: registerNumero, handleSubmit: soumettreNumero, formState: etatNumero, setError: erreurNumero } = useForm({ resolver: zodResolver(schemaNumero), defaultValues: { telephone: '' } })
  const { register: registerMdp, handleSubmit: soumettreMdp, formState: etatMdp, watch: watchMdp } = useForm({ resolver: zodResolver(schemaMotDePasse), defaultValues: { motDePasse: '', confirmation: '' } })

  const envoyer = soumettreNumero(({ telephone }) => {
    const trouve = comptes.find((c) => chiffresDuNumero(c.telephone) === chiffresDuNumero(telephone))
    if (!trouve) return erreurNumero('telephone', { message: t('erreurs.inconnu') })
    setCompte(trouve)
  })

  const changer = soumettreMdp(async ({ motDePasse }) => {
    if (!compte) return
    await data.update('comptes', compte.id, { motDePasse: await protegerMotDePasse(motDePasse) })
    toast.success(t('change'))
    navigate(ROUTES.signIn)
  })

  return (
    <AuthShell>
      <div className="space-y-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-600">
            <KeyRound className="size-4" aria-hidden="true" />
            {t('surtitre')}
          </p>
          <h1 className="mt-1 text-[28px] leading-tight font-extrabold text-navy-900">{t('titre')}</h1>
          <p className="mt-1.5 text-[15px] text-muted">{t('texte')}</p>
        </div>

        {!compte && (
          <form noValidate onSubmit={(e) => void envoyer(e)} className="space-y-4">
            <p className="text-sm text-navy-900">{t('introNumero')}</p>
            <Field label={t('telephone')} required error={etatNumero.errors.telephone?.message}>
              <PhoneInput autoComplete="tel" {...registerNumero('telephone')} />
            </Field>
            <Button type="submit" className="w-full">
              {t('envoyer')}
            </Button>
          </form>
        )}

        {compte && !verifie && <VerificationCode telephone={compte.telephone} onVerifie={() => setVerifie(true)} />}

        {compte && verifie && (
          <form noValidate onSubmit={(e) => void changer(e)} className="space-y-4">
            <Field label={t('nouveau')} required error={etatMdp.errors.motDePasse?.message}>
              <ChampMotDePasse autoComplete="new-password" {...registerMdp('motDePasse')} />
              <JaugeMotDePasse motDePasse={watchMdp('motDePasse')} aide={t('aide')} />
            </Field>
            <Field label={t('confirmation')} required error={etatMdp.errors.confirmation?.message}>
              <ChampMotDePasse autoComplete="new-password" {...registerMdp('confirmation')} />
            </Field>
            <Button type="submit" className="w-full" disabled={etatMdp.isSubmitting}>
              {t('changer')}
            </Button>
          </form>
        )}

        <Link to={ROUTES.signIn} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('retour')}
        </Link>
      </div>
    </AuthShell>
  )
}
