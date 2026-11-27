import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import i18next from '@/i18n'

/**
 * Le client TanStack Query de l'application (fourni dans main.tsx) : fausses
 * données de src/data aujourd'hui, hooks générés par Orval demain.
 *
 * Erreurs : un premier chargement qui échoue est affiché à la place du bloc
 * (ChargementDonnees, « Réessayer ») ; une mise à jour qui échoue alors que
 * des données sont déjà à l'écran, et tout enregistrement qui échoue,
 * s'annoncent par un message éphémère.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (erreur, requete) => {
      console.error(erreur)
      if (requete.state.data !== undefined) toast.error(i18next.t('errors.load.background'))
    },
  }),
  mutationCache: new MutationCache({
    onError: (erreur, _variables, _contexte, mutation) => {
      console.error(erreur)
      // Une mutation qui a son propre message d'erreur le donne elle-même.
      if (!mutation.options.onError) toast.error(i18next.t('errors.save'))
    },
  }),
  defaultOptions: {
    // Les fausses données ne changent que par nos écritures : pas de rechargement automatique.
    queries: { staleTime: Infinity, gcTime: Infinity, refetchOnWindowFocus: false, retry: false },
  },
})
