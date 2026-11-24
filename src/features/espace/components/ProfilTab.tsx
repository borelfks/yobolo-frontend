import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Camera, Save, Trash2, UserRound } from 'lucide-react'
import { data } from '@/data'
import { useComptes, useQuartiers, useRegions, useVilles } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { Field, Input, Select } from '@/shared/components/forms/Fields'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Button } from '@/shared/components/ui/Button'
import { Section } from '@/shared/components/ui/Card'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import { normaliserIdentifiant } from '@/shared/utils/motDePasse'

const CIVILITES = ['Monsieur', 'Madame'] as const

/**
 * « Mon profil » : civilité, nom, date de naissance, téléphone, e-mail de
 * connexion, résidence et photo, enregistrés dans la table `comptes`. Ces
 * informations préremplissent les préinscriptions et les inscriptions.
 */
export function ProfilTab() {
  const { t } = useTranslation('espace')
  const { account } = useSession()
  const comptes = useComptes()
  const regions = useRegions()
  const villes = useVilles()
  const quartiers = useQuartiers()
  const [photo, setPhoto] = useState(account?.avatar ?? '')
  const choisir = useRef<HTMLInputElement>(null)

  const schema = useMemo(
    () =>
      z.object({
        civilite: z.enum(['', ...CIVILITES]),
        nom: z.string().trim().min(2, t('profil.erreurs.nom')),
        naissance: z.string(),
        telephone: z.string().trim().min(9, t('profil.erreurs.telephone')),
        email: z.email(t('profil.erreurs.email')),
        region: z.string(),
        ville: z.string(),
        quartier: z.string(),
      }),
    [t],
  )
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      civilite: (account?.civilite ?? '') as '' | (typeof CIVILITES)[number],
      nom: account?.name ?? '',
      naissance: account?.naissance ?? '',
      telephone: account?.telephone ?? '',
      email: account?.identifiant ?? '',
      region: account?.region ?? '',
      ville: account?.ville ?? '',
      quartier: account?.quartier ?? '',
    },
  })
  if (!account) return null

  const changerDePhoto = async (fichier?: File) => {
    if (!fichier) return
    if (!fichier.type.startsWith('image/')) return void toast.error(t('profil.erreurs.photoType'))
    if (fichier.size > TAILLE_MAX_PHOTO) return void toast.error(t('profil.erreurs.photoTaille'))
    try {
      setPhoto(await lireImage(fichier))
    } catch {
      toast.error(t('profil.erreurs.photoLecture'))
    }
  }

  const enregistrer = handleSubmit(async (v) => {
    // L'e-mail est aussi l'identifiant de connexion : il reste unique.
    if (comptes.some((c) => c.id !== account.id && normaliserIdentifiant(c.identifiant) === normaliserIdentifiant(v.email))) {
      return setError('email', { message: t('profil.erreurs.emailPris') })
    }
    try {
      await data.update('comptes', account.id, {
        civilite: v.civilite || undefined,
        name: v.nom.trim(),
        naissance: v.naissance || undefined,
        telephone: v.telephone.trim(),
        identifiant: v.email.trim(),
        region: v.region || undefined,
        ville: v.ville || undefined,
        quartier: v.quartier || undefined,
        avatar: photo,
      })
      toast.success(t('profil.enregistre'))
    } catch {
      toast.error(t('profil.erreurs.enregistrement'))
    }
  })

  const e = formState.errors
  return (
    <Section title={t('profil.titre')} subtitle={t('profil.texte')} icon={<UserRound />}>
      <form noValidate onSubmit={(ev) => void enregistrer(ev)} className="space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar src={photo || undefined} name={account.name} size={84} />
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => choisir.current?.click()}>
                <Camera aria-hidden="true" />
                {t('profil.changerPhoto')}
              </Button>
              {photo && (
                <Button variant="danger-outline" size="sm" onClick={() => setPhoto('')}>
                  <Trash2 aria-hidden="true" />
                  {t('profil.retirerPhoto')}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted">{t('profil.photoAide')}</p>
          </div>
          <input
            ref={choisir}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label={t('profil.changerPhoto')}
            onChange={(ev) => {
              void changerDePhoto(ev.target.files?.[0])
              ev.target.value = ''
            }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-[180px_1fr_200px]">
          <Field label={t('profil.civilite')}>
            <Select options={CIVILITES.map((c) => ({ value: c, label: t(`profil.civilites.${c}`) }))} placeholder={t('profil.choisir')} {...register('civilite')} />
          </Field>
          <Field label={t('profil.nom')} required error={e.nom?.message}>
            <Input autoComplete="name" {...register('nom')} />
          </Field>
          <Field label={t('profil.naissance')}>
            <Input type="date" {...register('naissance')} />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t('profil.telephone')} required error={e.telephone?.message}>
            <Input type="tel" autoComplete="tel" {...register('telephone')} />
          </Field>
          <Field label={t('profil.email')} required hint={t('profil.emailAide')} error={e.email?.message}>
            <Input type="email" autoComplete="email" {...register('email')} />
          </Field>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-bold text-navy-900">{t('profil.residence')}</legend>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={t('profil.region')}>
              <Select options={regions.map((r) => r.nom)} placeholder={t('profil.choisir')} {...register('region')} />
            </Field>
            <Field label={t('profil.ville')}>
              <Select options={villes.map((v) => v.nom)} placeholder={t('profil.choisir')} {...register('ville')} />
            </Field>
            <Field label={t('profil.quartier')}>
              <Select options={quartiers.map((q) => q.nom)} placeholder={t('profil.choisir')} {...register('quartier')} />
            </Field>
          </div>
        </fieldset>
        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>
            <Save aria-hidden="true" />
            {t('profil.enregistrer')}
          </Button>
        </div>
      </form>
    </Section>
  )
}
