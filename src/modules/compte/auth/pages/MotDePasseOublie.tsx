import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { CadreAuth, CarteAuth } from '@/app/layouts/AuthLayout'
import { data } from '@/data'
import { useComptes } from '@/data/hooks'
import { TitreAuth } from '@/modules/compte/auth/components/TitreAuth'
import { VerificationCode } from '@/modules/compte/auth/components/VerificationCode'
import { chiffresDuNumero, numeroValide } from '@/modules/compte/auth/authOtp'
import { BarreEtapes, Champ, ChampMotDePasse, ChampTelephone, JaugeMotDePasse } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import type { Compte } from '@/shared/types'
import { protegerMotDePasse } from '@/shared/utils/motDePasse'
import { ROUTES } from '@/shared/utils/routes'

/**
 * « Mot de passe oublié » (planches 1. Numéro, 2. Code reçu, 3. Nouveau mot de
 * passe) : le numéro du compte, puis le code reçu (affiché à l'écran faute de
 * serveur d'envoi), puis le nouveau mot de passe, enregistré haché.
 */
export function MotDePasseOublie() {
  const { t } = useTranslation('auth', { keyPrefix: 'oubli' })
  const { t: tl } = useTranslation('layout')
  const comptes = useComptes()
  const navigate = useNavigate()
  const [compte, setCompte] = useState<Compte | null>(null)
  const [verifie, setVerifie] = useState(false)
  const etape = !compte ? 0 : !verifie ? 1 : 2

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
    navigate({ href: ROUTES.signIn })
  })

  return (
    <CadreAuth texte={tl('authLayout.retrouve')} logoVers={ROUTES.signIn}>
      <CarteAuth largeur="etroite" className="mt-2 gap-4 sm:mt-6">
        <Button asChild variant="link-muted" className="self-start">
          <Lien to={ROUTES.signIn}>
            <ArrowLeft aria-hidden />
            {t('retour')}
          </Lien>
        </Button>
        <TitreAuth taille="motDePasse" surtitre={t('surtitre')} titre={t('titre')} texte={t('texte')} />
        <BarreEtapes nombre={3} courante={etape} />

        {etape === 0 && (
          <form noValidate onSubmit={(e) => void envoyer(e)} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{t('introNumero')}</p>
            <Champ id="oubli-telephone" label={t('telephone')} erreur={etatNumero.errors.telephone?.message}>
              <ChampTelephone id="oubli-telephone" autoComplete="tel" aria-invalid={!!etatNumero.errors.telephone || undefined} {...registerNumero('telephone')} />
            </Champ>
            <Button type="submit" size="lg" className="h-[52px] w-full text-base">
              {t('envoyer')}
            </Button>
          </form>
        )}

        {etape === 1 && compte && <VerificationCode telephone={compte.telephone} onVerifie={() => setVerifie(true)} />}

        {etape === 2 && (
          <form noValidate onSubmit={(e) => void changer(e)} className="flex flex-col gap-4">
            <Champ id="oubli-nouveau" label={t('nouveau')} erreur={etatMdp.errors.motDePasse?.message}>
              <ChampMotDePasse id="oubli-nouveau" autoComplete="new-password" aria-invalid={!!etatMdp.errors.motDePasse || undefined} {...registerMdp('motDePasse')} />
              <JaugeMotDePasse motDePasse={watchMdp('motDePasse')} aide={t('aide')} />
            </Champ>
            <Champ id="oubli-confirmation" label={t('confirmation')} erreur={etatMdp.errors.confirmation?.message}>
              <ChampMotDePasse id="oubli-confirmation" autoComplete="new-password" aria-invalid={!!etatMdp.errors.confirmation || undefined} {...registerMdp('confirmation')} />
            </Champ>
            <Button type="submit" size="lg" loading={etatMdp.isSubmitting} className="h-[52px] w-full text-base">
              {t('changer')}
            </Button>
          </form>
        )}
      </CarteAuth>
    </CadreAuth>
  )
}
