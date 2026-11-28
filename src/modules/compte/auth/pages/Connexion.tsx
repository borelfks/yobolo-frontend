import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { AuthShell } from '@/app/layouts/AuthLayout'
import { data } from '@/data'
import { useComptes } from '@/data/hooks'
import { TitreAuth } from '@/modules/compte/auth/components/TitreAuth'
import { VerificationCode } from '@/modules/compte/auth/components/VerificationCode'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { CaseACocher, Champ, ChampMotDePasse, ChampTexte, Encadre } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { normaliserIdentifiant, verifierMotDePasse } from '@/shared/utils/motDePasse'
import { ROUTES } from '@/shared/utils/routes'
import type { Compte } from '@/shared/types'
import { decrireAppareil } from '@/shared/utils/appareil'

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

/** Connexion (planches « Connexion — 1. Normale » et « 2. Identifiant ou mot de passe incorrect »). */
export function Connexion() {
  const { t } = useTranslation('auth')
  const { signIn } = useSession()
  const navigate = useNavigate()
  const comptes = useComptes()
  // Coché par défaut, comme sur le canevas.
  const [retenir, setRetenir] = useState(true)
  // Un compte dont le code reçu à l'inscription n'a jamais été saisi : on le redemande.
  const [aConfirmer, setAConfirmer] = useState<Compte | null>(null)
  // Construit dans le composant : les messages suivent la langue.
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
  const erreurs = formState.errors
  const refuse = !!erreurs.root

  // Le compte est cherché par e-mail ou par téléphone, puis le mot de passe est vérifié.
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

  /** Numéro confirmé : l'école sans établissement termine son inscription (pièces) ; les autres entrent. */
  const ouvrir = async (compte: Compte) => {
    if (compte.role !== 'utilisateur' && !compte.ecoleId) {
      toast.success(t('connexion.confirmer.reprise'))
      navigate({ href: ROUTES.signUp, state: { reprise: compte.id } })
      return
    }
    signIn(compte, retenir)
    await data.create('activiteSecurite', { compteId: compte.id, evenement: 'connexion', le: maintenant(), appareil: decrireAppareil(), ok: true }, 'activite')
    toast.success(t('connexion.welcome', { name: compte.name }))
    navigate({ href: ROUTES.accueil })
  }

  const numeroConfirme = async () => {
    if (!aConfirmer) return
    const confirme = await data.update('comptes', aConfirmer.id, { telephoneVerifie: true })
    if (confirme) await ouvrir(confirme)
  }

  if (aConfirmer)
    return (
      <AuthShell>
        <TitreAuth titre={t('connexion.confirmer.titre')} texte={t('connexion.confirmer.texte')} />
        <div className="mt-7 flex flex-col gap-4">
          <VerificationCode telephone={aConfirmer.telephone} libelleBouton={t('connexion.confirmer.bouton')} onVerifie={numeroConfirme} />
          <Button variant="outline" size="lg" className="h-[50px] w-full text-base" onClick={() => setAConfirmer(null)}>
            <ArrowLeft aria-hidden />
            {t('connexion.confirmer.retour')}
          </Button>
        </div>
      </AuthShell>
    )

  return (
    <AuthShell>
      <TitreAuth titre={t('connexion.title')} texte={t('connexion.subtitle')} />
      <form onSubmit={handleSubmit(connect)} noValidate className="mt-7 flex flex-col gap-[18px]">
        <Champ id="identifiant" label={t('connexion.identifier')} erreur={erreurs.identifiant?.message}>
          <ChampTexte
            id="identifiant"
            autoComplete="username"
            placeholder={t('connexion.identifierPlaceholder')}
            aria-invalid={!!erreurs.identifiant || refuse || undefined}
            {...register('identifiant')}
          />
        </Champ>
        <Champ
          id="mot-de-passe"
          label={t('connexion.password')}
          erreur={erreurs.motDePasse?.message}
          action={
            <Button asChild variant="link">
              <Lien to={ROUTES.forgotPassword}>{t('connexion.forgot.link')}</Lien>
            </Button>
          }
        >
          <ChampMotDePasse id="mot-de-passe" autoComplete="current-password" aria-invalid={!!erreurs.motDePasse || refuse || undefined} {...register('motDePasse')} />
        </Champ>
        <CaseACocher label={t('connexion.remember')} checked={retenir} onCheckedChange={(v) => setRetenir(v === true)} />
        {erreurs.root && <Encadre ton="erreur">{erreurs.root.message}</Encadre>}
        <Button type="submit" size="lg" loading={formState.isSubmitting} className="h-[50px] w-full text-base">
          {t('connexion.submit')}
        </Button>
        <div className="flex items-center gap-3 text-meta text-muted-foreground">
          <span aria-hidden className="h-px flex-1 bg-border-strong" />
          {t('connexion.or')}
          <span aria-hidden className="h-px flex-1 bg-border-strong" />
        </div>
        <Button asChild variant="outline" size="lg" className="h-[50px] w-full text-base">
          <Lien to={ROUTES.signUp}>{t('connexion.signUp')}</Lien>
        </Button>
      </form>
      <Button asChild variant="link" className="mt-[22px] self-center">
        <Lien to={ROUTES.home}>{t('connexion.guest')}</Lien>
      </Button>
    </AuthShell>
  )
}
