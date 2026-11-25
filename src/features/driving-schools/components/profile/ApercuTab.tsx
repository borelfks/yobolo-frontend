import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowRight, BadgeCheck, CalendarDays, Car, ChevronLeft, ChevronRight, Clock, Globe, Images, Info, Mail, MapPin, Medal, Phone, UserRound } from 'lucide-react'
import { GreenCheck, Heading, SideActions } from '@/features/driving-schools/components/profile/ProfileParts'
import { card, soft, whyKeys } from '@/features/driving-schools/components/profile/profileUtils'
import { permisIcon } from '@/features/driving-schools/autoEcoleRules'
import { Img } from '@/shared/components/ui/Img'
import { useAutoEcole, usePhotosAutoEcole } from '@/data/hooks'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { lienCarte, ouvrir } from '@/shared/utils/liens'

/** Onglet « Aperçu » de la fiche d'une auto-école. */
export function ApercuTab({ id }: { id: string }) {
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(id)
  const [slide, setSlide] = useState(0)
  const photos = usePhotosAutoEcole(a.id, 'apercu').map((p) => p.image)
  const visible = [0, 1, 2, 3].map((i) => photos[(slide + i) % photos.length])
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[334px_1fr]">
          <div className="space-y-4">
            <div className={cn(card, 'p-4')}>
              <Heading icon={<Info />}>{t('profile.overview.presentationTitle')}</Heading>
              <p className="mt-2 text-[15px] leading-snug text-navy-900">
                {t('profile.overview.presentation', { name: a.nom, licences: a.permis.slice().sort().join(', ') })}
              </p>
            </div>
            <dl className={cn(card, 'divide-y divide-line px-4 py-1 text-[13.5px]')}>
              {[
                { icon: <CalendarDays />, k: t('profile.overview.facts.founded'), v: a.creation },
                { icon: <MapPin />, k: t('profile.overview.facts.location'), v: `${a.ville} – ${a.quartier}` },
                { icon: <Clock />, k: t('profile.overview.facts.hours'), v: t('profile.overview.facts.hoursValue') },
                { icon: <BadgeCheck />, k: t('profile.overview.facts.status'), v: <span className="rounded-full bg-emerald-600 px-3.5 py-0.5 font-semibold text-white">{t('common.approved')}</span> },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-[22px_1fr_auto] items-center gap-3 py-2 [&_svg]:size-5 [&_svg]:text-navy-800">
                  {r.icon}
                  <dt className="font-semibold text-navy-900">{r.k}</dt>
                  <dd className="text-navy-900">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-4">
            <div className={cn(card, 'p-4')}>
              <Heading icon={<Car />}>{t('profile.overview.licences')}</Heading>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {(['A', 'B', 'C', 'D'] as PermisCode[])
                  .filter((c) => a.permis.includes(c))
                  .map((code) => {
                    const Icon = permisIcon[code]
                    return (
                      <Link key={code} to={ROUTES.license(a.id, code)} className={cn(soft, 'flex flex-col items-center gap-1.5 px-2 py-3 text-center transition-shadow hover:shadow-md')}>
                        <Icon className="size-9 text-brand-600" />
                        <span className="text-[16px] font-bold text-navy-900">{t('common.licence', { code })}</span>
                        <span className="text-[13px] leading-tight text-navy-900">{t(`permis.${code}.name`)}</span>
                      </Link>
                    )
                  })}
              </div>
            </div>
            <div className={cn(card, 'p-4')}>
              <Heading icon={<Medal />}>{t('profile.why.title')}</Heading>
              <ul className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                {[whyKeys[0], whyKeys[3], whyKeys[1], whyKeys[4], whyKeys[2], whyKeys[5]].map((k) => (
                  <GreenCheck key={k}>{t(`profile.why.items.${k}`)}</GreenCheck>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={cn(card, 'p-4')}>
          <div className="flex items-center justify-between">
            <Heading icon={<Images />}>{t('profile.overview.gallery', { count: photos.length })}</Heading>
            <Link to={ROUTES.drivingSchool(a.id, 'galerie')} className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-600 underline underline-offset-4">
              {t('profile.overview.seeGallery')} <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="relative mt-3">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.25fr_1fr_1fr_1.05fr]">
              {visible.map((src, i) => (
                <Img key={src + i} src={src} alt="" className="h-[125px] w-full rounded-xl" />
              ))}
            </div>
            <button type="button" aria-label={t('profile.overview.previous')} onClick={() => setSlide((slide + photos.length - 1) % photos.length)} className="absolute top-1/2 left-1 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow ring-1 ring-line">
              <ChevronLeft className="size-5 text-brand-600" />
            </button>
            <button type="button" aria-label={t('profile.overview.next')} onClick={() => setSlide((slide + 1) % photos.length)} className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow ring-1 ring-line">
              <ChevronRight className="size-5 text-brand-600" />
            </button>
          </div>
        </div>
      </div>
      <aside className="space-y-4">
        <SideActions id={id} />
        <div className={cn(card, 'p-4')}>
          <Heading icon={<UserRound />}>{t('profile.overview.contactTitle')}</Heading>
          <ul className="mt-3 space-y-2.5 text-[15px] text-navy-900 [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:fill-brand-600 [&_svg]:text-white">
            <li className="flex items-center gap-3"><Phone className="!fill-none !text-brand-600" />{a.telephone}</li>
            <li className="flex items-center gap-3"><Mail className="!fill-none !text-brand-600" />{a.email}</li>
            <li className="flex items-center gap-3"><Globe className="!fill-none !text-brand-600" />{a.site}</li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5" />
              <span>
                {a.ville} – {a.quartier}
                {a.adresse && <span className="block text-[12px]">({a.adresse})</span>}
              </span>
            </li>
          </ul>
          <div className="relative mt-3 overflow-hidden rounded-xl">
            <Img src="/images/maquette/ae-carte.jpg" alt={t('profile.overview.mapAlt')} className="h-[190px] w-full" />
            <button type="button" onClick={() => ouvrir(lienCarte(a.adresse, a.quartier, a.ville))} className="absolute inset-x-0 bottom-0 h-14" aria-label={t('profile.overview.seeOnMap')} />
          </div>
        </div>
      </aside>
    </div>
  )
}
