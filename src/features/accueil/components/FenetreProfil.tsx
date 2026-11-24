import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Trash2, UserRound } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'
import { data } from '@/data'
import { useComptes } from '@/data/hooks'
import { useSession } from '@/features/auth/hooks/useSession'
import { Field, Input } from '@/shared/components/forms/Fields'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'

/**
 * « Mon profil » : le nom, le téléphone, l'e-mail de connexion et la photo du
 * compte, enregistrés dans la table `comptes`. La photo est gardée dans la
 * base (data URL, 2 Mo au plus). L'e-mail reste unique entre les comptes.
 */
export function FenetreProfil({ onFermer }: { onFermer: () => void }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const comptes = useComptes()
  const compte = comptes.find((c) => c.id === account?.id)
  const [photo, setPhoto] = useState(compte?.avatar ?? '')
  const choisir = useRef<HTMLInputElement>(null)

  const schema = useMemo(
    () =>
      z.object({
        nom: z.string().trim().min(2, t('profil.erreurs.nom')),
        telephone: z.string().trim().min(9, t('profil.erreurs.telephone')),
        email: z.string().trim().email(t('profil.erreurs.email')),
      }),
    [t],
  )
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nom: compte?.name ?? '', telephone: compte?.telephone ?? '', email: compte?.identifiant ?? '' },
  })

  if (!compte) return null

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

  const enregistrer = handleSubmit(async ({ nom, telephone, email }) => {
    const pris = comptes.some((c) => c.id !== compte.id && c.identifiant.trim().toLocaleLowerCase() === email.toLocaleLowerCase())
    if (pris) {
      setError('email', { message: t('profil.erreurs.emailPris') })
      return
    }
    try {
      await data.update('comptes', compte.id, { name: nom, telephone, identifiant: email, avatar: photo })
      toast.success(t('profil.enregistre'))
      onFermer()
    } catch {
      toast.error(t('profil.erreurs.enregistrement'))
    }
  })

  return createPortal(
    <Modal
      open
      onClose={onFermer}
      icon={<UserRound className="mt-1 size-5 text-brand-600" aria-hidden="true" />}
      title={t('profil.titre')}
      footer={
        <>
          <Button variant="neutral" onClick={onFermer}>
            {t('profil.annuler')}
          </Button>
          <Button disabled={formState.isSubmitting} onClick={() => void enregistrer()}>
            {t('profil.enregistrer')}
          </Button>
        </>
      }
    >
      <form onSubmit={(evenement) => void enregistrer(evenement)} className="flex max-h-[60dvh] flex-col gap-4 overflow-y-auto pr-1">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar src={photo || undefined} name={compte.name} size={72} />
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
          <input
            ref={choisir}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label={t('profil.changerPhoto')}
            onChange={(evenement) => {
              void changerDePhoto(evenement.target.files?.[0])
              evenement.target.value = ''
            }}
          />
          <p className="w-full text-xs text-muted">{t('profil.photoAide')}</p>
        </div>

        <Field label={t('profil.nom')} required error={formState.errors.nom?.message}>
          <Input autoComplete="name" {...register('nom')} />
        </Field>
        <Field label={t('profil.telephone')} required error={formState.errors.telephone?.message}>
          <Input type="tel" autoComplete="tel" {...register('telephone')} />
        </Field>
        <Field label={t('profil.email')} required hint={t('profil.emailAide')} error={formState.errors.email?.message}>
          <Input type="email" autoComplete="email" {...register('email')} />
        </Field>
        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>,
    document.body,
  )
}
