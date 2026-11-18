import { createContext, use, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { load, save } from '@/lib/storage'

/** Un favori : une formation, un établissement, une auto-école ou un permis. */
export type FavoriteKind = 'formation' | 'etablissement' | 'auto-ecole' | 'permis'
export type Favorite = { id: string; kind: FavoriteKind; folder: string }

type FavoritesValue = {
  favorites: Favorite[]
  folders: string[]
  isFavorite: (id: string) => boolean
  toggle: (id: string, kind: FavoriteKind, folder?: string) => void
  add: (id: string, kind: FavoriteKind, folder?: string) => void
  remove: (id: string) => void
  clear: () => void
}

const initial: Favorite[] = [
  { id: 'f-cg-ipc', kind: 'formation', folder: 'Mes formations' },
  { id: 'f-info-ipc', kind: 'formation', folder: 'Mes formations' },
  { id: 'ipc', kind: 'etablissement', folder: 'Mes établissements' },
]

const FavoritesContext = createContext<FavoritesValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>(() => load('favorites', initial))
  const update = (next: Favorite[]) => {
    setFavorites(next)
    save('favorites', next)
  }
  const isFavorite = (id: string) => favorites.some((f) => f.id === id)
  const add = (id: string, kind: FavoriteKind, folder = 'Mes formations') => {
    if (isFavorite(id)) return
    update([...favorites, { id, kind, folder }])
    toast.success('Ajouté à vos favoris', { description: `Dossier : ${folder}` })
  }
  const remove = (id: string) => {
    update(favorites.filter((f) => f.id !== id))
    toast('Retiré de vos favoris')
  }
  const value: FavoritesValue = {
    favorites,
    folders: ['Mes formations', 'Mes établissements', 'À comparer'],
    isFavorite,
    add,
    remove,
    toggle: (id, kind, folder) => (isFavorite(id) ? remove(id) : add(id, kind, folder)),
    clear: () => {
      update([])
      toast('Tous vos favoris ont été supprimés')
    },
  }
  return <FavoritesContext value={value}>{children}</FavoritesContext>
}

export function useFavorites() {
  const ctx = use(FavoritesContext)
  if (!ctx) throw new Error('useFavorites hors de FavoritesProvider')
  return ctx
}
