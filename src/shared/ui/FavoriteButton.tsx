import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '@/shared/hooks/useFavorites'
import type { FavoriteKind } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

export function FavoriteButton({ id, kind, className, size = 'md' }: { id: string; kind: FavoriteKind; className?: string; size?: 'sm' | 'md' }) {
  const { t } = useTranslation()
  const { isFavorite, toggle } = useFavorites()
  const on = isFavorite(id)
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? t('favorites.remove') : t('favorites.add')}
      onClick={(e) => {
        e.preventDefault()
        toggle(id, kind, kind === 'etablissement' || kind === 'auto-ecole' ? 'Mes établissements' : 'Mes formations')
      }}
      className={cn('grid shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-line transition-colors hover:bg-rose-50', size === 'md' ? 'size-9' : 'size-8', className)}
    >
      <Heart className={cn('size-[18px]', on ? 'fill-rose-500 text-rose-500' : 'text-slate-500')} />
    </button>
  )
}
