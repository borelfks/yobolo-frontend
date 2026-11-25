import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
// Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) : import { Link } from 'react-router'
import { CircleCheck, Funnel, Heart, Medal, RefreshCw } from 'lucide-react'
import { FavoriteModal } from '@/features/driving-schools/components/AutoEcoleBlocks'
import { card, whyKeys } from '@/features/driving-schools/components/profile/profileUtils'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { useAutoEcole } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'

/** Titre de carte avec son icône bleue. */
export function Heading({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('flex items-center gap-2.5 text-[21px] font-bold text-navy-900 [&_svg]:size-7 [&_svg]:text-brand-600', className)}>
      {icon}
      {children}
    </h2>
  )
}

export function GreenCheck({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-[13.5px] text-navy-900 xl:whitespace-nowrap">
      <CircleCheck className="size-5 shrink-0 fill-emerald-600 text-white" />
      {children}
    </li>
  )
}

/** « S’inscrire maintenant » et « Ajouter aux favoris » (colonne de droite de l'aperçu). */
export function SideActions({ id }: { id: string }) {
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(id)
  const { isFavorite, remove } = useFavorites()
  const [open, setOpen] = useState(false)
  const fav = isFavorite(a.id)
  return (
    <div className="space-y-3">
      {/* Inscription en auto-école masquée (demande du porteur du projet, 2026-11-25) :
      <Link to={inscrireHref(a)} className="flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[18px] font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700">
        <Send className="size-6" />
        {t('common.enrolNow')}
      </Link>
      */}
      <button type="button" onClick={() => (fav ? remove(a.id) : setOpen(true))} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
        <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
        {fav ? t('common.inFavorites') : t('common.addToFavorites')}
      </button>
      <FavoriteModal open={open} onClose={() => setOpen(false)} aeId={a.id} />
    </div>
  )
}

/** Carte « Pourquoi nous choisir ? » (liste complète). */
export function WhyCard() {
  const { t } = useTranslation('driving-schools')
  return (
    <div className={cn(card, 'p-4')}>
      <Heading icon={<Medal />}>{t('profile.why.title')}</Heading>
      <ul className="mt-3 space-y-2.5">
        {whyKeys.map((k) => (
          <GreenCheck key={k}>{t(`profile.why.items.${k}`)}</GreenCheck>
        ))}
      </ul>
    </div>
  )
}

/** Colonne de filtres (onglets Formations et Planning). */
export function FilterBox({ title, children, onReset }: { title: string; children: ReactNode; onReset: () => void }) {
  const { t } = useTranslation('driving-schools')
  return (
    <aside className={cn(card, 'flex h-fit flex-col p-4 lg:min-h-[480px]')}>
      <p className="flex items-center gap-2.5 border-b border-line pb-3 text-[18px] font-bold text-navy-900">
        <Funnel className="size-6" /> {title}
      </p>
      <div className="flex-1">{children}</div>
      <button type="button" onClick={onReset} className="mt-5 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-[#c9d4ea] bg-white text-[15px] font-semibold text-navy-900 hover:bg-brand-50">
        <RefreshCw className="size-5" />
        {t('profile.filters.reset')}
      </button>
    </aside>
  )
}

export function CheckLine({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-1 text-[14px] text-navy-900">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-[18px] accent-brand-600" />
      {label}
    </label>
  )
}
