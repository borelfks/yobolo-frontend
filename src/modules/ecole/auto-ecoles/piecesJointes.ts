import { data } from '@/data'
import { lireFichier, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'

/**
 * Pièces jointes d'une inscription en auto-école : le fichier est gardé dans
 * la base (table `fichiers`) ; le brouillon d'inscription retient son
 * identifiant (`fichiers[pièce]`). Renvoie null si le fichier est trop lourd.
 */
export async function joindrePiece(fichier: File): Promise<string | null> {
  if (fichier.size > TAILLE_MAX_DOCUMENT) return null
  const f = await data.create('fichiers', { nom: fichier.name, type: fichier.type, taille: fichier.size, dataUrl: await lireFichier(fichier) }, 'fichier')
  return f.id
}
