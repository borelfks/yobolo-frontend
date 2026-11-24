import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { BadgeCheck, Building2, CalendarDays, ChevronRight, CircleGauge, Handshake, MessageCircle, MoreHorizontal, PencilLine, Star, Users } from 'lucide-react'
import { Heading } from '@/features/driving-schools/components/profile/ProfileParts'
import { card, criteriaKeys, reviewDate } from '@/features/driving-schools/components/profile/profileUtils'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Img } from '@/shared/components/ui/Img'
import { Stars } from '@/shared/components/ui/StarRating'
import { useAutoEcole, useAvisAutoEcole } from '@/data/hooks'
import { criteresAvis, repartitionAutoEcole } from '@/mocks/drivingSchools'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const critereIcons = [CircleGauge, Users, CalendarDays, Building2, Handshake]

/** Onglet « Avis » de la fiche d'une auto-école. */
export function AvisTab({ id }: { id: string }) {
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(id)
  const avis = useAvisAutoEcole(a.id)
  const colors = ['bg-emerald-600', 'bg-emerald-400', 'bg-amber-300', 'bg-orange-400', 'bg-rose-500']
  const starColors = ['fill-emerald-600 text-emerald-600', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400']
  return (
    <div className="grid gap-4 lg:grid-cols-[350px_1fr]">
      <div className={cn(card, 'h-fit p-4')}>
        <Heading icon={<Star className="!fill-none" />}>{t('profile.reviews.overall')}</Heading>
        <div className="text-center">
          <p className="text-[44px] leading-tight font-extrabold text-navy-900">
            {num(a.note)}
            <span className="text-[28px] font-semibold">/5</span>
          </p>
          <Stars value={a.note} size="lg" />
          <p className="mt-1 text-[15px] text-brand-700">{t('profile.reviews.basedOn', { count: a.avis })}</p>
        </div>
        <ul className="mt-3 space-y-1 border-b border-line pb-3">
          {repartitionAutoEcole.map((r, i) => (
            <li key={r.etoiles} className="flex items-center gap-2 text-[14px] font-semibold text-navy-900">
              <span className="w-3">{r.etoiles}</span>
              <Star className={cn('size-4', starColors[i])} />
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#e6ecf7]">
                <span className={cn('block h-full rounded-full', colors[i])} style={{ width: `${r.pct}%` }} />
              </span>
              <span className="w-10 text-right font-normal">{t('profile.reviews.percent', { value: r.pct })}</span>
            </li>
          ))}
        </ul>
        <ul className="divide-y divide-line">
          {criteresAvis.map((c, i) => {
            const Icon = critereIcons[i]
            const key = criteriaKeys[i]
            return (
              <li key={c.nom} className="flex items-center gap-3 py-1.5 text-[14px] text-navy-900">
                <Icon className="size-5 text-brand-600" />
                <span className="flex-1">{key ? t(`profile.reviews.criteria.${key}`) : c.nom}</span>
                <b>{num(c.note)}</b>
              </li>
            )
          })}
        </ul>
        <Link to={ROUTES.drivingSchoolReview(a.id)} className="mt-4 flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[19px] font-semibold text-white hover:bg-brand-700">
          <PencilLine className="size-6" />
          {t('profile.reviews.give')}
        </Link>
      </div>
      <div className={cn(card, 'space-y-3 p-4')}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Heading icon={<MessageCircle />} className="text-[25px] [&_svg]:size-9">{t('profile.reviews.title', { count: a.avis })}</Heading>
          <label className="relative">
            <select aria-label={t('profile.reviews.sort')} className="h-10 appearance-none rounded-xl border border-[#c9d4ea] bg-white pr-9 pl-3 text-[14px] text-navy-900">
              <option>{t('profile.reviews.mostRecent')}</option>
              <option>{t('profile.reviews.bestRated')}</option>
            </select>
            <ChevronRight className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 rotate-90" />
          </label>
        </div>
        {avis.map((r) => (
          <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-line p-3 sm:flex-row">
            <div className="flex items-center gap-3 sm:w-[270px]">
              {/* Un avis de visiteur n’a pas de photo : initiales. */}
              {r.avatar ? <Img src={r.avatar} alt={r.nom} className="size-[62px] rounded-full" /> : <Avatar name={r.nom} size={62} />}
              <div>
                <p className="flex items-center gap-1.5 text-[16px] font-bold text-navy-900">
                  {r.nom}
                  <BadgeCheck className="size-5 fill-brand-600 text-white" />
                </p>
                <p className="text-[14.5px] text-navy-800">{reviewDate(t, r.date)}</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="flex items-center gap-2 text-[15px] font-semibold text-navy-900">
                <Stars value={r.note} size="md" />
                {r.note}/5
              </p>
              <p className="mt-1 text-[14px] text-navy-900">{r.texte}</p>
            </div>
            <button type="button" aria-label={t('profile.reviews.more')} onClick={() => toast(t('profile.reviews.moreToast'))} className="self-start p-1 text-navy-800">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
