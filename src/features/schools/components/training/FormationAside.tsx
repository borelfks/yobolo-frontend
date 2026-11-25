import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CalendarDays, CircleCheck, Heart, Phone } from 'lucide-react'
import { Img } from '@/shared/components/ui/Img'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { ecoleUrl } from '@/features/schools/schoolLinks'
import { card } from '@/features/schools/components/training/trainingShared'
import { useEtablissement } from '@/data/hooks'
import type { Formation } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
// Préinscription masquée (demande du porteur du projet, 2026-11-25) : import { ROUTES } from '@/shared/utils/routes'

/** Colonne de droite du détail d'une formation : établissement, actions, prochaine rentrée. */
export function FormationAside({ f, showRentree }: { f: Formation; showRentree: boolean }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(f.etablissementId)
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(f.id)
  const btn = 'flex h-[38px] w-full items-center justify-center gap-2.5 rounded-full border-2 border-brand-600/60 bg-white text-[15px] font-semibold text-navy-800 hover:bg-brand-50'
  return (
    <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
      <Link to={ecoleUrl(e)} className={cn(card, 'flex items-center gap-3 p-3')}>
        <Img src={e.vignette ?? e.image} alt={e.nom} className="size-[102px] rounded-xl" />
        <div className="space-y-1.5">
          <p className="text-[17px] leading-tight font-bold text-navy-900">{e.nom}</p>
          <p className="flex items-center gap-1.5 text-[14px] text-navy-900">
            <span className="text-amber-400">★</span>
            {num(e.note)}/5 {t('shared.ratingCount', { count: e.avis })}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[13px] font-semibold text-white">
            <CircleCheck className="size-4 fill-white text-emerald-600" />
            {t('shared.verified')}
          </span>
        </div>
      </Link>
      <div className={cn(card, 'space-y-2.5 p-3')}>
        {/* Préinscription masquée (demande du porteur du projet, 2026-11-25) :
        <Link to={ROUTES.preRegistration(f.id)} className="flex h-10 items-center justify-center gap-2.5 rounded-full bg-sun-400 text-[16px] font-bold text-navy-950 hover:bg-sun-500">
          <PencilLine className="size-5" />
          {t('shared.preRegisterNow')}
        </Link>
        */}
        <button type="button" onClick={() => toggle(f.id, 'formation')} className={btn}>
          <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
          {fav ? t('shared.inFavorites') : t('shared.addToFavorites')}
        </button>
        <button type="button" onClick={() => window.open(`https://wa.me/${e.telephone.replace(/\D/g, '')}`, '_blank', 'noopener')} className={btn}>
          <WhatsAppIcon />
          {t('formationDetail.aside.contact')}
        </button>
        <a href={`tel:${e.telephone.replace(/\s/g, '')}`} className={cn(btn, 'text-[17px] font-bold')}>
          <Phone className="size-5" />
          {e.telephone}
        </a>
      </div>
      {showRentree && (
        <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-line bg-[#eef3fc] p-4">
          <CalendarDays className="size-8 text-brand-600" />
          <div>
            <p className="text-[14px] text-navy-900">{t('formationDetail.aside.nextIntake')}</p>
            <p className="text-[20px] font-bold text-navy-900">{e.rentree}</p>
          </div>
          <CalendarDays className="absolute right-3 size-14 text-brand-200" strokeWidth={1.4} />
        </div>
      )}
    </aside>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path fill="#fff" d="M16.7 13.9c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3c.2-.6.2-1 .1-1.1l-.3-.3Z" />
    </svg>
  )
}
