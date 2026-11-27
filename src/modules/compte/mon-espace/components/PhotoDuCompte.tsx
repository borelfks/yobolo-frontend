import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Camera, LoaderCircle, Trash2 } from 'lucide-react'
import { data } from '@/data'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import type { Compte } from '@/shared/types'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import { cn } from '@/shared/utils/cn'

/**
 * La photo du compte, changée ou retirée sur-le-champ (enregistrée dans
 * `comptes`) : elle suit aussitôt partout (barre du haut, en-tête de Mon
 * espace, commentaires). `entete` : un bouton appareil photo posé sur la
 * photo ; `profil` : la photo avec « Changer la photo » et « Retirer la photo ».
 */
export function PhotoDuCompte({ compte, size, variante }: { compte: Compte; size: number; variante: 'entete' | 'profil' }) {
  const { t } = useTranslation('espace')
  const champ = useRef<HTMLInputElement>(null)
  const [enCours, setEnCours] = useState(false)

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

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className={cn('relative shrink-0', enCours && 'opacity-60')}>
        <Avatar src={compte.avatar || undefined} name={compte.name} size={size} />
      </span>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled={enCours} onClick={() => champ.current?.click()}>
            <Camera aria-hidden="true" />
            {t('profil.changerPhoto')}
          </Button>
          {compte.avatar && (
            <Button variant="danger-outline" size="sm" disabled={enCours} onClick={() => void enregistrer('', t('profil.photoRetiree'))}>
              <Trash2 aria-hidden="true" />
              {t('profil.retirerPhoto')}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t('profil.photoAide')}</p>
      </div>
      {entree}
    </div>
  )
}
