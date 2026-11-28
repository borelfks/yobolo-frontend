import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { data } from '@/data'
import { LANGUES, langueActive } from '@/i18n'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { CarteCompte } from '@/shared/blocs/CadreCompte'
import { Champ, ChampMotDePasse } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Switch } from '@/shared/shadcn/switch'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import type { SujetNotification } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { protegerMotDePasse, verifierMotDePasse } from '@/shared/utils/motDePasse'
import { CANAUX_NOTIFICATION, preferenceDe, SUJETS_NOTIFICATION } from '@/shared/utils/notifications'
import { ROUTES } from '@/shared/utils/routes'

/** Les règles d'un nouveau mot de passe (les mêmes que dans l'espace pro). */
const REGLES = [
  { cle: 'longueur', ok: (m: string) => m.length >= 8 },
  { cle: 'majuscule', ok: (m: string) => /[A-Z]/.test(m) },
  { cle: 'chiffre', ok: (m: string) => /[0-9]/.test(m) },
  { cle: 'special', ok: (m: string) => /[^A-Za-z0-9]/.test(m) },
] as const

const COLONNES = 'grid grid-cols-[minmax(0,1fr)_repeat(3,56px)] items-center gap-x-1 sm:grid-cols-[minmax(0,1fr)_repeat(3,72px)]'

/**
 * Notifications (canevas) : pour chaque sujet, l'application, le SMS, l'e-mail.
 * Chaque bascule s'enregistre aussitôt dans `comptes`.
 */
export function ReglagesNotifications() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  if (!account) return null
  const aUnEmail = account.identifiant.includes('@')
  const changer = async (sujet: SujetNotification, canal: (typeof CANAUX_NOTIFICATION)[number], valeur: boolean) => {
    const suite = { ...account.preferencesNotifications, [sujet]: { ...preferenceDe(account, sujet), [canal]: valeur } }
    try {
      await data.update('comptes', account.id, { preferencesNotifications: suite })
      toast.success(t('parametres.notifications.enregistrees'), { id: 'preferences-notifications' })
    } catch {
      toast.error(t('parametres.notifications.echec'))
    }
  }
  return (
    <CarteCompte id="notifications" aria-labelledby="titre-notifications">
      <h2 id="titre-notifications" className="text-lg font-bold">
        {t('parametres.notifications.titre')}
      </h2>
      <p className="text-sm text-muted-foreground">{t('parametres.notifications.texte')}</p>
      <div role="table" aria-labelledby="titre-notifications">
        <div role="row" className={cn(COLONNES, 'pb-1 text-xs font-bold text-muted-foreground')}>
          <span role="columnheader">{t('parametres.notifications.sujet')}</span>
          {CANAUX_NOTIFICATION.map((c) => (
            <span key={c} role="columnheader" className="text-center">
              {t(`parametres.notifications.canaux.${c}`)}
            </span>
          ))}
        </div>
        {SUJETS_NOTIFICATION.map((sujet) => {
          const pref = preferenceDe(account, sujet)
          const titre = t(`parametres.notifications.sujets.${sujet}.titre`)
          return (
            <div key={sujet} role="row" className={cn(COLONNES, 'border-t border-border py-3')}>
              <span role="rowheader" className="flex min-w-0 flex-col gap-0.5">
                <b className="text-sm">{titre}</b>
                <span className="text-xs text-muted-foreground">{t(`parametres.notifications.sujets.${sujet}.texte`)}</span>
              </span>
              {CANAUX_NOTIFICATION.map((canal) => {
                const indisponible = canal === 'email' && !aUnEmail
                return (
                  <span key={canal} role="cell" className="grid place-items-center">
                    <Switch
                      checked={pref[canal] && !indisponible}
                      disabled={indisponible}
                      aria-label={`${titre} : ${t(`parametres.notifications.canaux.${canal}`)}`}
                      onCheckedChange={(v) => void changer(sujet, canal, v)}
                    />
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-1 border-t border-border pt-2 text-meta text-muted-foreground">
        <span>{t('parametres.notifications.smsA', { numero: account.telephone })}</span>
        <span>{aUnEmail ? t('parametres.notifications.emailA', { email: account.identifiant }) : t('parametres.notifications.sansEmail')}</span>
      </div>
    </CarteCompte>
  )
}

/** « Changer mon mot de passe » : l'actuel est vérifié, le nouveau suit les quatre règles affichées dessous. */
export function ChangerMotDePasse() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const schema = useMemo(
    () =>
      z
        .object({
          actuel: z.string().min(1, t('parametres.motDePasse.erreurs.actuel')),
          nouveau: z.string().refine((m) => REGLES.every((r) => r.ok(m)), t('parametres.motDePasse.erreurs.regles')),
          confirmation: z.string(),
        })
        .refine((v) => v.nouveau === v.confirmation, { path: ['confirmation'], message: t('parametres.motDePasse.erreurs.different') }),
    [t],
  )
  const { register, handleSubmit, formState, setError, reset, watch } = useForm({ resolver: zodResolver(schema), defaultValues: { actuel: '', nouveau: '', confirmation: '' } })
  const nouveau = watch('nouveau')
  const changer = handleSubmit(async ({ actuel, nouveau }) => {
    if (!account) return
    if (!(await verifierMotDePasse(account.motDePasse, actuel))) return setError('actuel', { message: t('parametres.motDePasse.erreurs.faux') })
    try {
      await data.update('comptes', account.id, { motDePasse: await protegerMotDePasse(nouveau) })
      reset()
      toast.success(t('parametres.motDePasse.change'))
    } catch {
      toast.error(t('parametres.notifications.echec'))
    }
  })
  const e = formState.errors
  return (
    <CarteCompte id="mot-de-passe" aria-labelledby="titre-mot-de-passe">
      <h2 id="titre-mot-de-passe" className="text-lg font-bold">
        {t('parametres.motDePasse.titre')}
      </h2>
      <form noValidate onSubmit={(ev) => void changer(ev)} className="flex flex-col gap-3.5">
        <div className="grid gap-3 lg:grid-cols-3">
          <Champ id="mdp-actuel" label={t('parametres.motDePasse.actuel')} erreur={e.actuel?.message}>
            <ChampMotDePasse id="mdp-actuel" autoComplete="current-password" aria-invalid={!!e.actuel || undefined} {...register('actuel')} />
          </Champ>
          <Champ id="mdp-nouveau" label={t('parametres.motDePasse.nouveau')} erreur={e.nouveau?.message}>
            <ChampMotDePasse id="mdp-nouveau" autoComplete="new-password" aria-invalid={!!e.nouveau || undefined} {...register('nouveau')} />
          </Champ>
          <Champ id="mdp-confirmation" label={t('parametres.motDePasse.confirmation')} erreur={e.confirmation?.message}>
            <ChampMotDePasse id="mdp-confirmation" autoComplete="new-password" aria-invalid={!!e.confirmation || undefined} {...register('confirmation')} />
          </Champ>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-live="polite">
          {REGLES.map((r) => {
            const ok = r.ok(nouveau)
            return (
              <li key={r.cle} className={cn('flex items-center gap-2 text-meta', ok ? 'font-bold text-success' : 'text-muted-foreground')}>
                <span aria-hidden>{ok ? '✓' : '○'}</span>
                {t(`parametres.motDePasse.regles.${r.cle}`)}
              </li>
            )
          })}
        </ul>
        <Button type="submit" className="self-start" loading={formState.isSubmitting}>
          {t('parametres.motDePasse.enregistrer')}
        </Button>
      </form>
    </CarteCompte>
  )
}

/** « Langue » : Français ou English, gardée dans ce navigateur. */
export function ChoixLangueCompte() {
  const { t, i18n } = useTranslation('espace')
  return (
    <CarteCompte id="langue" aria-labelledby="titre-langue">
      <h2 id="titre-langue" className="text-lg font-bold">
        {t('parametres.langue.titre')}
      </h2>
      <p className="text-sm text-muted-foreground">{t('parametres.langue.texte')}</p>
      <ToggleGroup
        type="single"
        variant="outline"
        aria-labelledby="titre-langue"
        value={langueActive(i18n.language)}
        onValueChange={(v) => {
          if (!v) return
          void i18n.changeLanguage(v)
        }}
      >
        {LANGUES.map((l) => (
          <ToggleGroupItem key={l.code} value={l.code}>
            {t(`parametres.langue.choix.${l.code}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </CarteCompte>
  )
}

/**
 * « Supprimer mon compte » (canevas : planche « Confirmer la suppression ») : le
 * bouton ouvre, dans la carte, la confirmation par mot de passe. Le compte et
 * ses notifications partent ; les dossiers envoyés restent chez les établissements.
 */
export function SuppressionCompte() {
  const { t } = useTranslation('espace')
  const { account, signOut } = useSession()
  const navigate = useNavigate()
  const [confirmation, setConfirmation] = useState(false)
  const schema = useMemo(() => z.object({ motDePasse: z.string().min(1, t('parametres.suppression.erreurs.vide')) }), [t])
  const { register, handleSubmit, formState, setError, reset } = useForm({ resolver: zodResolver(schema), defaultValues: { motDePasse: '' } })
  const supprimer = handleSubmit(async ({ motDePasse }) => {
    if (!account) return
    if (!(await verifierMotDePasse(account.motDePasse, motDePasse))) return setError('motDePasse', { message: t('parametres.suppression.faux') })
    try {
      for (const n of await data.list('notificationsCompte')) if (n.compteId === account.id) await data.remove('notificationsCompte', n.id)
      signOut()
      await data.remove('comptes', account.id)
      toast.success(t('parametres.suppression.faite'))
      void navigate({ href: ROUTES.signIn })
    } catch {
      toast.error(t('parametres.notifications.echec'))
    }
  })
  return (
    <CarteCompte id="suppression" danger aria-labelledby="titre-suppression">
      <h2 id="titre-suppression" className="text-lg font-bold text-destructive-hover">
        {t('parametres.suppression.titre')}
      </h2>
      <p className="text-sm leading-relaxed text-foreground-soft">{t('parametres.suppression.texte')}</p>
      {confirmation ? (
        <form
          noValidate
          role="dialog"
          aria-labelledby="titre-confirmation"
          onSubmit={(ev) => void supprimer(ev)}
          className="flex flex-col gap-2.5 rounded-md border border-destructive-line bg-destructive-wash p-4"
        >
          <b id="titre-confirmation" className="text-base">
            {t('parametres.suppression.confirmerTitre')}
          </b>
          <p className="text-sm text-foreground-soft">{t('parametres.suppression.confirmerTexte')}</p>
          <Champ id="suppression-mdp" label={t('parametres.suppression.motDePasse')} erreur={formState.errors.motDePasse?.message}>
            <ChampMotDePasse id="suppression-mdp" autoComplete="current-password" autoFocus aria-invalid={!!formState.errors.motDePasse || undefined} {...register('motDePasse')} />
          </Champ>
          <span className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setConfirmation(false)
              }}
            >
              {t('parametres.suppression.annuler')}
            </Button>
            <Button type="submit" variant="destructive-solid" loading={formState.isSubmitting}>
              {t('parametres.suppression.confirmer')}
            </Button>
          </span>
        </form>
      ) : (
        <Button variant="destructive" className="self-start" onClick={() => setConfirmation(true)}>
          {t('parametres.suppression.bouton')}
        </Button>
      )}
    </CarteCompte>
  )
}
