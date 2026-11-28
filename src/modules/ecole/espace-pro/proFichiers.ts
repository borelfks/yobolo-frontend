import { toast } from 'sonner'
import { data } from '@/data'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'

/** Remplace la bannière (couverture) ou le logo de l'établissement ; la fiche publique suit. */
export async function changerVisuel(id: string, cible: 'banniere' | 'logo', fichier: File, messages: { ok: string; tropLourd: string }) {
  if (fichier.size > TAILLE_MAX_PHOTO) return void toast.error(messages.tropLourd)
  const image = await lireImage(fichier)
  await data.update('etablissements', id, cible === 'logo' ? { logo: image, vignette: image } : { couverture: image, bandeau: image, photoFiche: image })
  toast.success(messages.ok)
}
