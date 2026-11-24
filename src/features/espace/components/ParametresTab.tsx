import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Check, Globe, KeyRound, Trash2, X } from 'lucide-react'
import { data } from '@/data'
import { useSession } from '@/features/auth/hooks/useSession'
import { Field, Input, Select } from '@/shared/components/forms/Fields'
import { Button } from '@/shared/components/ui/Button'
import { Section } from '@/shared/components/ui/Card'
import { Modal } from '@/shared/components/ui/Modal'
import { LANGUES, langueActive } from '@/i18n'
import { cn } from '@/shared/utils/cn'
import { protegerMotDePasse, verifierMotDePasse } from '@/shared/utils/motDePasse'
import { ROUTES } from '@/shared/utils/routes'

/** Les règles d'un nouveau mot de passe (les mêmes que dans l'espace pro). */
const REGLES = [
  { cle: 'longueur', ok: (m: string) => m.length >= 8 },
  { cle: 'majuscule', ok: (m: string) => /[A-Z]/.test(m) },
  { cle: 'chiffre', ok: (m: string) => /[0-9]/.test(m) },
  { cle: 'special', ok: (m: string) => /[^A-Za-z0-9]/.test(m) },
] as const

/** « Paramètres » : mot de passe, langue, suppression du compte. */
export function ParametresTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <MotDePasse />
      <div className="space-y-4">
        <Langue />
        <Suppression />
      </div>
    </div>
  )
}

function MotDePasse() {
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
    await data.update('comptes', account.id, { motDePasse: await protegerMotDePasse(nouveau) })
    reset()
    toast.success(t('parametres.motDePasse.change'))
  })
  const e = formState.errors
  return (
    <Section title={t('parametres.motDePasse.titre')} icon={<KeyRound />}>
      <form noValidate onSubmit={(ev) => void changer(ev)} className="space-y-4">
        <Field label={t('parametres.motDePasse.actuel')} required error={e.actuel?.message}>
          <Input type="password" autoComplete="current-password" {...register('actuel')} />
        </Field>
        <Field label={t('parametres.motDePasse.nouveau')} required error={e.nouveau?.message}>
          <Input type="password" autoComplete="new-password" {...register('nouveau')} />
        </Field>
        <ul className="grid grid-cols-2 gap-1.5 text-[13px]">
          {REGLES.map((r) => {
            const ok = r.ok(nouveau)
            return (
              <li key={r.cle} className={cn('flex items-center gap-1.5', ok ? 'text-emerald-700' : 'text-muted')}>
                {ok ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
                {t(`parametres.motDePasse.regles.${r.cle}`)}
              </li>
            )
          })}
        </ul>
        <Field label={t('parametres.motDePasse.confirmation')} required error={e.confirmation?.message}>
          <Input type="password" autoComplete="new-password" {...register('confirmation')} />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>
            {t('parametres.motDePasse.enregistrer')}
          </Button>
        </div>
      </form>
    </Section>
  )
}

function Langue() {
  const { t, i18n } = useTranslation('espace')
  const { t: tc } = useTranslation('common')
  return (
    <Section title={t('parametres.langue.titre')} subtitle={t('parametres.langue.texte')} icon={<Globe />}>
      <Select
        aria-label={t('parametres.langue.titre')}
        options={LANGUES.map((l) => ({ value: l.code, label: tc(l.libelleCle) }))}
        value={langueActive(i18n.language)}
        onChange={(ev) => void i18n.changeLanguage(ev.target.value)}
      />
    </Section>
  )
}

function Suppression() {
  const { t } = useTranslation('espace')
  const { account, signOut } = useSession()
  const navigate = useNavigate()
  const [ouverte, setOuverte] = useState(false)
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const supprimer = async () => {
    if (!account) return
    if (!(await verifierMotDePasse(account.motDePasse, motDePasse))) return setErreur(t('parametres.suppression.faux'))
    // Le compte et ses notifications partent ; les dossiers envoyés restent chez les établissements.
    for (const n of await data.list('notificationsCompte')) if (n.compteId === account.id) await data.remove('notificationsCompte', n.id)
    signOut()
    await data.remove('comptes', account.id)
    toast.success(t('parametres.suppression.faite'))
    navigate(ROUTES.home)
  }
  return (
    <Section title={t('parametres.suppression.titre')} icon={<Trash2 className="text-rose-600" />}>
      <p className="text-sm text-navy-900">{t('parametres.suppression.texte')}</p>
      <Button variant="danger-outline" size="sm" className="mt-3" onClick={() => setOuverte(true)}>
        <Trash2 aria-hidden="true" />
        {t('parametres.suppression.bouton')}
      </Button>
      <Modal
        open={ouverte}
        onClose={() => setOuverte(false)}
        icon={<Trash2 className="mt-1 size-5 text-rose-600" aria-hidden="true" />}
        title={t('parametres.suppression.confirmerTitre')}
        footer={
          <>
            <Button variant="neutral" onClick={() => setOuverte(false)}>
              {t('parametres.suppression.annuler')}
            </Button>
            <Button variant="danger" onClick={() => void supprimer()}>
              {t('parametres.suppression.confirmer')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-navy-900">{t('parametres.suppression.confirmerTexte')}</p>
        <Field label={t('parametres.suppression.motDePasse')} error={erreur} className="mt-3">
          <Input
            type="password"
            autoComplete="current-password"
            value={motDePasse}
            onChange={(ev) => {
              setMotDePasse(ev.target.value)
              setErreur('')
            }}
          />
        </Field>
      </Modal>
    </Section>
  )
}
