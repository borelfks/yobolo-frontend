import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { AuthShell } from '@/app/layouts/AuthLayout'
import { data } from '@/data'
import { useComptes } from '@/data/hooks'
import { VerificationCode } from '@/features/auth/components/VerificationCode'
import { publierFormationsVerifiees, validerCompteEcole } from '@/features/auth/authComptes'
import { useSession } from '@/features/auth/hooks/useSession'
import { Checkbox, Input, Label } from '@/shared/components/forms/Fields'
import { normaliserIdentifiant, verifierMotDePasse } from '@/shared/utils/motDePasse'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import type { Compte } from '@/shared/types'
import { decrireAppareil } from '@/shared/utils/appareil'

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

/** Champs plus hauts et plus arrondis que dans les formulaires de l'application, mêmes couleurs. */
const champ = 'h-12 rounded-xl text-[15px]'

export function Connexion() {
  const { t } = useTranslation('auth')
  const { signIn } = useSession()
  const navigate = useNavigate()
  const comptes = useComptes()
  const [show, setShow] = useState(false)
  const [retenir, setRetenir] = useState(false)
  // Un compte dont le code reçu à l'inscription n'a jamais été saisi : on le redemande.
  const [aConfirmer, setAConfirmer] = useState<Compte | null>(null)
  // Construit dans le composant (comme yibolo-client) : les messages suivent la langue.
  const schema = useMemo(
    () =>
      z.object({
        identifiant: z.string().min(1, t('connexion.errors.identifier')),
        motDePasse: z.string().min(6, t('connexion.errors.password')),
      }),
    [t],
  )
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifiant: '', motDePasse: '' },
  })

  // Le compte est cherché dans la base par e-mail ou par téléphone, puis le mot de passe est vérifié.
  const connect = async ({ identifiant, motDePasse }: { identifiant: string; motDePasse: string }) => {
    const cle = normaliserIdentifiant(identifiant)
    const compte = comptes.find((c) => normaliserIdentifiant(c.identifiant) === cle || normaliserIdentifiant(c.telephone) === cle)
    if (!compte || !(await verifierMotDePasse(compte.motDePasse, motDePasse))) {
      // Une tentative échouée sur un compte existant figure dans son activité de sécurité.
      if (compte) await data.create('activiteSecurite', { compteId: compte.id, evenement: 'echec', le: maintenant(), appareil: decrireAppareil(), ok: false }, 'activite')
      setError('root', { message: t('connexion.errors.invalid') })
      return
    }
    if (compte.telephoneVerifie === false) {
      setAConfirmer(compte)
      return
    }
    await ouvrir(compte)
  }

  /**
   * Numéro confirmé : l'école sans établissement termine son inscription
   * (pièces) ; l'école qui attendait sa vérification la voit faite (« Compte
   * validé ! ») ; les autres entrent.
   */
  const ouvrir = async (compte: Compte) => {
    if (compte.role !== 'utilisateur' && !compte.ecoleId) {
      toast.success(t('connexion.confirmer.reprise'))
      navigate(ROUTES.signUp, { state: { reprise: compte.id } })
      return
    }
    if (compte.statut !== 'Validé') {
      const valide = await validerCompteEcole(compte)
      navigate(ROUTES.signUp, { state: { valide: valide.id } })
      return
    }
    signIn(compte, retenir)
    await data.create('activiteSecurite', { compteId: compte.id, evenement: 'connexion', le: maintenant(), appareil: decrireAppareil(), ok: true }, 'activite')
    toast.success(t('connexion.welcome', { name: compte.name }))
    const publiees = compte.ecoleId ? await publierFormationsVerifiees(compte.ecoleId) : 0
    if (publiees > 0) toast.success(t('connexion.formationsPubliees', { count: publiees }))
    navigate(compte.home)
  }

  const numeroConfirme = async () => {
    if (!aConfirmer) return
    const confirme = await data.update('comptes', aConfirmer.id, { telephoneVerifie: true })
    if (confirme) await ouvrir(confirme)
  }

  if (aConfirmer)
    return (
      <AuthShell>
        <header>
          <h1 className="text-[1.9rem] leading-tight font-extrabold tracking-tight text-navy-900">{t('connexion.confirmer.titre')}</h1>
          <p className="mt-2 leading-relaxed text-muted">{t('connexion.confirmer.texte')}</p>
        </header>
        <div className="mt-8 space-y-4">
          <VerificationCode telephone={aConfirmer.telephone} libelleBouton={t('connexion.confirmer.bouton')} onVerifie={numeroConfirme} />
          <button
            type="button"
            onClick={() => setAConfirmer(null)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-600/60 bg-white text-[15px] font-semibold text-navy-800 transition-colors hover:bg-brand-50"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t('connexion.confirmer.retour')}
          </button>
        </div>
      </AuthShell>
    )

  return (
    <AuthShell>
      <header>
        <h1 className="text-[1.9rem] leading-tight font-extrabold tracking-tight text-navy-900">{t('connexion.title')}</h1>
        <p className="mt-2 leading-relaxed text-muted">{t('connexion.subtitle')}</p>
      </header>

      <form onSubmit={handleSubmit(connect)} noValidate className="mt-8 flex flex-col gap-5">
        <div>
          <Label htmlFor="identifiant">{t('connexion.identifier')}</Label>
          <Input
            id="identifiant"
            icon={<Mail />}
            autoComplete="username"
            placeholder={t('connexion.identifierPlaceholder')}
            aria-invalid={Boolean(formState.errors.identifiant)}
            className={champ}
            {...register('identifiant')}
          />
          {formState.errors.identifiant && <p className="mt-1 text-xs font-medium text-rose-600">{formState.errors.identifiant.message}</p>}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3 [&>label]:mb-1.5">
            <Label htmlFor="mot-de-passe">{t('connexion.password')}</Label>
            <Link to={ROUTES.forgotPassword} className="text-sm font-semibold text-brand-600 hover:underline">
              {t('connexion.forgot.link')}
            </Link>
          </div>
          <Input
            id="mot-de-passe"
            icon={<Lock />}
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={Boolean(formState.errors.motDePasse)}
            className={cn(champ, 'pr-12')}
            suffix={
              <button
                type="button"
                aria-label={show ? t('connexion.hide') : t('connexion.show')}
                onClick={() => setShow(!show)}
                className="-mr-1 grid size-9 place-items-center rounded-lg text-navy-800 hover:bg-brand-50"
              >
                {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            }
            {...register('motDePasse')}
          />
          {formState.errors.motDePasse && <p className="mt-1 text-xs font-medium text-rose-600">{formState.errors.motDePasse.message}</p>}
        </div>

        <Checkbox label={t('connexion.remember')} checked={retenir} onChange={(e) => setRetenir(e.target.checked)} />

        {formState.errors.root && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">
            {formState.errors.root.message}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-[15px] font-semibold text-white shadow-sm shadow-brand-600/30 transition-colors hover:bg-brand-700"
        >
          {t('connexion.submit')}
          <ArrowRight className="size-4" aria-hidden />
        </button>

        <div className="flex items-center gap-3 text-sm text-muted">
          <span aria-hidden className="h-px flex-1 bg-line" />
          {t('connexion.or')}
          <span aria-hidden className="h-px flex-1 bg-line" />
        </div>

        <Link
          to={ROUTES.signUp}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl border-2 border-brand-600/60 bg-white text-[15px] font-semibold text-navy-800 transition-colors hover:bg-brand-50"
        >
          {t('connexion.signUp')}
        </Link>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link to={ROUTES.home} className="font-semibold text-brand-600 underline-offset-4 hover:underline">
          {t('connexion.guest')}
        </Link>
      </p>
    </AuthShell>
  )
}
