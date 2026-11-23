import { createContext, use, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data, useCollectionWhenReady } from '@/data'
import type { Favorite, FavoriteKind } from '@/shared/types'

type FavoritesValue = {
  favorites: Favorite[]
  folders: string[]
  isFavorite: (id: string) => boolean
  toggle: (id: string, kind: FavoriteKind, folder?: string) => void
  add: (id: string, kind: FavoriteKind, folder?: string) => void
  remove: (id: string) => void
  clear: () => void
}

/**
 * Les noms de dossiers sont des identifiants gardés dans le navigateur : on ne
 * les change pas, seul leur affichage est traduit.
 */
const folderKeys = {
  'Mes formations': 'favorites.folders.trainings',
  'Mes établissements': 'favorites.folders.institutions',
  'À comparer': 'favorites.folders.compare',
} as const

const FavoritesContext = createContext<FavoritesValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const folderLabel = (folder: string) => (folder in folderKeys ? t(folderKeys[folder as keyof typeof folderKeys]) : folder)
  // Les favoris sont dans la base de test (collection « favoris ») ; vide le temps qu'elle s'ouvre.
  const favorites = useCollectionWhenReady('favoris')
  const isFavorite = (id: string) => favorites.some((f) => f.id === id)
  const add = (id: string, kind: FavoriteKind, folder = 'Mes formations') => {
    if (isFavorite(id)) return
    void data.put('favoris', { id, kind, folder })
    toast.success(t('favorites.added'), { description: t('favorites.folder', { folder: folderLabel(folder) }) })
  }
  const remove = (id: string) => {
    void data.remove('favoris', id)
    toast(t('favorites.removed'))
  }
  const value: FavoritesValue = {
    favorites,
    folders: ['Mes formations', 'Mes établissements', 'À comparer'],
    isFavorite,
    add,
    remove,
    toggle: (id, kind, folder) => (isFavorite(id) ? remove(id) : add(id, kind, folder)),
    clear: () => {
      favorites.forEach((f) => void data.remove('favoris', f.id))
      toast(t('favorites.cleared'))
    },
  }
  return <FavoritesContext value={value}>{children}</FavoritesContext>
}

export function useFavorites() {
  const ctx = use(FavoritesContext)
  if (!ctx) throw new Error('useFavorites hors de FavoritesProvider')
  return ctx
}
