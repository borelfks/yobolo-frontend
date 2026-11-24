import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

/**
 * Partager une page : la feuille de partage du téléphone quand elle existe,
 * sinon le lien copié (comme dans yibolo-client).
 */
export function usePartage() {
  const { t } = useTranslation('accueil')

  const copierLeLien = async (chemin: string) => {
    const url = `${window.location.origin}${chemin}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success(t('actions.lienCopie'))
    } catch {
      toast.error(url)
    }
  }

  const partager = async (chemin: string, titre: string) => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: titre, url: `${window.location.origin}${chemin}` })
      } catch {
        // Partage annulé : rien à dire.
      }
      return
    }
    await copierLeLien(chemin)
  }

  return { partager, copierLeLien }
}
