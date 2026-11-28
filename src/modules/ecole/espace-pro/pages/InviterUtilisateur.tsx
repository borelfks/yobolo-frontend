import { useId, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { numeroPropre, numeroValide } from '@/modules/compte/auth/authOtp'
import { data } from '@/data'
import { useRoles } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Champ } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { RadioGroup, RadioGroupCard } from '@/shared/shadcn/radio-group'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'
import { ChampIndicatif, CartePro, Conseil, EntetePro, PiedFormulaire, SquelettePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { cleRole } from '@/modules/ecole/espace-pro/proRoles'

/** 7.6 Inviter un utilisateur : la personne (nom, téléphone, e-mail facultatif) et son rôle ; l'invitation est enregistrée « En attente ». */
export function InviterUtilisateur() {
  const { t } = useTranslation('pro', { keyPrefix: 'inviter' })
  return (
    <div className="flex flex-col gap-2">
      <EntetePro
        miettes={[
          { label: t('miettes.parametres'), to: ROUTES.pro.settings() },
          { label: t('miettes.utilisateurs'), to: ROUTES.pro.settings('utilisateurs') },
          { label: t('titre') },
        ]}
        titre={t('titre')}
        sousTitre={t('sousTitre')}
      />
      <ChargementDonnees fallback={<SquelettePro cartes={2} entete={false} />}>
        <FormulaireInvitation />
      </ChargementDonnees>
    </div>
  )
}

function FormulaireInvitation() {
  const { t } = useTranslation('pro', { keyPrefix: 'inviter' })
  const { t: tp } = useTranslation('pro')
  const id = useId()
  const navigate = useNavigate()
  const { ecole } = useMonEcole()
  const roles = useRoles()
  const [role, setRole] = useState('Responsable pédagogique')
  const schema = useMemo(
    () =>
      z.object({
        nom: z.string().trim().min(2, t('erreurs.nom')),
        telephone: z.string().refine(numeroValide, t('erreurs.telephone')),
        email: z.union([z.literal(''), z.string().trim().email(t('erreurs.email'))]),
      }),
    [t],
  )
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema), defaultValues: { nom: '', telephone: '', email: '' } })
  const { errors, isSubmitting } = formState
  const nomRole = (nom: string, defaut: string, champ: 'nom' | 'aide') => {
    const cle = cleRole(nom)
    return cle ? tp(`roles.${cle}.${champ}`) : defaut
  }
  const envoyer = handleSubmit(async (v) => {
    // Invitation pas encore acceptée : « En attente », pas encore de connexion.
    await data.create('utilisateurs', { etablissementId: ecole.id, nom: v.nom.trim(), role, telephone: numeroPropre(v.telephone), email: v.email.trim(), statut: 'En attente', connexion: '—', avatar: '' }, 'utilisateur')
    toast.success(t('envoyee', { nom: v.nom.trim(), role: nomRole(role, role, 'nom') }))
    void navigate({ href: ROUTES.pro.settings('utilisateurs') })
  })
  return (
    <form onSubmit={(e) => void envoyer(e)} noValidate className="flex flex-col gap-2">
      <CartePro titre={t('personne')}>
        <div className="grid gap-3.5 lg:grid-cols-2">
          <Champ id={`${id}-nom`} label={t('nom')} requis erreur={errors.nom?.message}>
            <Input id={`${id}-nom`} placeholder={t('nomExemple')} aria-invalid={!!errors.nom || undefined} {...register('nom')} />
          </Champ>
          <Champ id={`${id}-tel`} label={t('telephone')} requis erreur={errors.telephone?.message}>
            <ChampIndicatif id={`${id}-tel`} placeholder={t('telephoneExemple')} aria-invalid={!!errors.telephone || undefined} {...register('telephone')} />
          </Champ>
          <Champ id={`${id}-email`} label={t('email')} facultatif erreur={errors.email?.message}>
            <Input id={`${id}-email`} type="email" placeholder={t('emailExemple')} aria-invalid={!!errors.email || undefined} {...register('email')} />
          </Champ>
        </div>
      </CartePro>
      <CartePro titre={t('role')}>
        <RadioGroup value={role} onValueChange={setRole} aria-label={t('role')} className="gap-2">
          {roles.map((r) => (
            <RadioGroupCard key={r.id} value={r.nom} className="gap-3 px-3.5 py-3">
              <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-input group-data-[state=checked]:border-[6px] group-data-[state=checked]:border-primary" aria-hidden />
              <span className="flex flex-col gap-0.5">
                <b className="text-ui">{nomRole(r.nom, r.nom, 'nom')}</b>
                <span className="text-xs font-medium text-muted-foreground">{nomRole(r.nom, r.description, 'aide')}</span>
              </span>
            </RadioGroupCard>
          ))}
        </RadioGroup>
        <Conseil titre={t('bonASavoir')}>{t('bonASavoirTexte')}</Conseil>
      </CartePro>
      <PiedFormulaire>
        <Button asChild variant="outline">
          <Lien to={ROUTES.pro.settings('utilisateurs')}>{tp('commun.annuler')}</Lien>
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {t('envoyer')}
        </Button>
      </PiedFormulaire>
    </form>
  )
}
