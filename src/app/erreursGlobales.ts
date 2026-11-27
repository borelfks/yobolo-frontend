import { toast } from 'sonner'
import i18next from '@/i18n'

/**
 * Dernier filet : une erreur que personne n'a attrapée (un enregistrement qui
 * échoue sans try/catch, une promesse rejetée) s'annonce par un message
 * éphémère au lieu de passer inaperçue. Le détail va dans la console.
 * Les erreurs d'affichage sont attrapées par les ErrorBoundary.
 */
export function ecouterErreursGlobales() {
  window.addEventListener('unhandledrejection', (evenement) => {
    console.error(evenement.reason)
    toast.error(i18next.t('errors.unexpected'))
  })
}
