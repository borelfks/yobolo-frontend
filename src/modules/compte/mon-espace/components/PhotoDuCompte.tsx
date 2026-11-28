import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Camera, LoaderCircle } from 'lucide-react'
import { data } from '@/data'
import { Avatar } from '@/shared/ui/Avatar'
import type { Compte } from '@/shared/types'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import { Avatar as ShadAvatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/avatar'
import { Button as ShadButton } from '@/shared/shadcn/button'
import { cn } from '@/shared/utils/cn'

/**
 * La photo du compte, changée ou retirée sur-le-champ (enregistrée dans
 * `comptes`) : elle suit aussitôt partout (barre du haut, en-tête de Mon
 * espace, commentaires). `entete` : un bouton appareil photo posé sur la
 * photo ; `profil` : la photo de 88 px du canevas avec « Changer la photo » et « Retirer la photo ».
 */
export function PhotoDuCompte({ compte, size, variante }: { compte: Compte; size: number; variante: 'entete' | 'profil' }) {
  const { t } = useTranslation('espace')
  const champ = useRef<HTMLInputElement>(null)
  const [enCours, setEnCours] = useState(false)
  const initiales = compte.name
    .split(/\s+/)
    .map((m) => m[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const enregistrer = async (avatar: string, message: string) => {
    setEnCours(true)
    try {
      await data.update('comptes', compte.id, { avatar })
      toast.success(message)
    } catch {
      toast.error(t('profil.erreurs.enregistrement'))
    } finally {
      setEnCours(false)
    }
  }

  const changer = async (fichier?: File) => {
    if (!fichier) return
    if (!fichier.type.startsWith('image/')) return void toast.error(t('profil.erreurs.photoType'))
    if (fichier.size > TAILLE_MAX_PHOTO) return void toast.error(t('profil.erreurs.photoTaille'))
    let image: string
    try {
      image = await lireImage(fichier)
    } catch {
      return void toast.error(t('profil.erreurs.photoLecture'))
    }
    await enregistrer(image, t('profil.photoMiseAJour'))
  }

  const entree = (
    <input
      ref={champ}
      type="file"
      accept="image/*"
      className="sr-only"
      tabIndex={-1}
      aria-hidden="true"
      onChange={(ev) => {
        void changer(ev.target.files?.[0])
        ev.target.value = ''
      }}
    />
  )

  if (variante === 'entete')
    return (
      <div className="relative shrink-0 self-start">
        <Avatar src={compte.avatar || undefined} name={compte.name} size={size} className="ring-4 ring-white/25" />
        <button
          type="button"
          disabled={enCours}
          onClick={() => champ.current?.click()}
          aria-label={t('profil.changerPhoto')}
          title={t('profil.changerPhoto')}
          className="absolute -right-1 -bottom-1 grid size-9 place-items-center rounded-full bg-white text-brand-600 shadow-md ring-2 ring-navy-900/10 hover:bg-brand-50 disabled:opacity-70"
        >
          {enCours ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
        </button>
        {entree}
      </div>
    )

  // Mon profil (canevas) : la photo de 88 px (ou les initiales), « Changer la photo », « Retirer la photo ».
  return (
    <div className="flex flex-wrap items-center gap-4 border-y border-border py-3.5">
      <ShadAvatar className={cn('size-[88px]', enCours && 'opacity-60')}>
        {compte.avatar && <AvatarImage src={compte.avatar} alt={t('profil.photoDe', { nom: compte.name })} className="object-cover" />}
        <AvatarFallback className="text-titre font-extrabold" aria-label={t('profil.sansPhoto')}>
          {initiales}
        </AvatarFallback>
      </ShadAvatar>
      <div className="flex flex-col gap-2">
        <span className="flex flex-wrap gap-2">
          <ShadButton variant="secondary" size="md" loading={enCours} onClick={() => champ.current?.click()}>
            {t('profil.changerPhoto')}
          </ShadButton>
          {compte.avatar && (
            <ShadButton variant="outline" size="md" disabled={enCours} onClick={() => void enregistrer('', t('profil.photoRetiree'))}>
              {t('profil.retirerPhoto')}
            </ShadButton>
          )}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{t('profil.photoAide')}</span>
      </div>
      {entree}
    </div>
  )
}
