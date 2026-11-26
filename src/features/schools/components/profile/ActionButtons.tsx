import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Heart, PencilLine } from 'lucide-react'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { useEtablissement, useFormationsOf } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/** « Préinscrire maintenant » et « Ajouter aux favoris » de la fiche établissement. */
export function ActionButtons({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(id)
  const first = useFormationsOf(e.id).find((f) => f.statut === 'Publiée')
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(e.id)
  return (
    <div className="space-y-3">
      <Link
        to={first ? ROUTES.preRegistration(first.id) : ROUTES.schools}
        className="flex h-[50px] items-center justify-center gap-3 rounded-xl bg-brand-600 text-[17px] font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700"
      >
        <PencilLine className="size-5" />
        {t('shared.preRegisterNow')}
        <ArrowRight className="size-5" />
      </Link>
      <button
        type="button"
        onClick={() => toggle(e.id, 'etablissement', 'Mes établissements')}
        className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-xl border-2 border-brand-600/70 bg-white text-[16px] font-semibold text-navy-800 hover:bg-brand-50"
      >
        <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
        {fav ? t('shared.inFavorites') : t('shared.addToFavorites')}
      </button>
    </div>
  )
}

/** Bouton favori pleine largeur (colonne de gauche de l'onglet Formations). */
export function FavoriteWide({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(id)
  return (
    <button
      type="button"
      onClick={() => toggle(id, 'etablissement', 'Mes établissements')}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border-2 border-brand-600/70 text-[15px] font-semibold text-navy-800 hover:bg-brand-50"
    >
      <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
      {fav ? t('shared.inFavorites') : t('shared.addToFavorites')}
    </button>
  )
}
