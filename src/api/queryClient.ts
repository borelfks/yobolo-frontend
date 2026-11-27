import { QueryClient } from '@tanstack/react-query'

/** Le client TanStack Query de l'application (fourni dans main.tsx) : fausses données de src/data aujourd'hui, hooks générés par Orval demain. */
export const queryClient = new QueryClient({
  defaultOptions: {
    // Les fausses données ne changent que par nos écritures : pas de rechargement automatique.
    queries: { staleTime: Infinity, gcTime: Infinity, refetchOnWindowFocus: false, retry: false },
  },
})
