import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumb, type Crumb } from '@/shared/ui/Breadcrumb'
import { Img } from '@/shared/ui/Img'
import { useAutoEcole } from '@/data/hooks'
import { num } from '@/shared/utils/format'
import { Car, CircleCheck, MapPin, Star } from 'lucide-react'
import { PasEncoreDAvis } from '@/shared/ui/StarRating'

/** En-tête bleu nuit d'une auto-école (logo carré, nom, note, apprenants formés). */
export function AEHeader({
  id,
  crumbs,
  title,
  subtitle,
  image = '/images/maquette/ae-profil-hero.jpg',
}: {
  id: string
  crumbs: Crumb[]
  title?: ReactNode
  subtitle?: ReactNode
  image?: string
}) {
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(id)
  return (
    <>
      <Breadcrumb items={crumbs} className="-mt-1" />
      <section className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#08173f_0%,#0c2160_55%,#123088_100%)] text-white">
        <Img src={image} alt="" className="absolute inset-y-0 right-0 hidden h-full w-[47%] object-left md:block" />
        <div className="relative flex flex-col gap-6 p-4 md:flex-row md:items-center md:px-7 md:py-3.5">
          {a.logo ? (
            <Img src={a.logo} alt={t('header.logoAlt', { name: a.nom })} className="h-[110px] w-[124px] shrink-0 rounded-xl" />
          ) : (
            <span className="grid h-[110px] w-[124px] shrink-0 place-items-center rounded-xl bg-white text-navy-800">
              <Car className="size-12 fill-navy-800" />
            </span>
          )}
          <span className="hidden h-24 w-px bg-white/30 md:block" />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[26px] font-bold md:text-[30px]">{title ?? a.nom}</h1>
              {!title && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[15px] font-semibold">
                  <CircleCheck className="size-5 fill-white text-emerald-600" />
                  {t('common.approved')}
                </span>
              )}
            </div>
            {subtitle ? (
              <p className="max-w-[460px] text-[17px] leading-snug text-white/90">{subtitle}</p>
            ) : (
              <>
                <p className="flex items-center gap-2 text-[16px] text-white/90">
                  <MapPin className="size-5 fill-brand-500 text-navy-900" />
                  {a.ville} – {a.quartier}
                </p>
                <p className="flex flex-wrap items-center gap-x-6 text-[16px]">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="size-6 fill-amber-400 text-amber-400" />
                    {a.avis > 0 ? (
                      <>
                        <b>{num(a.note)}/5</b> {t('common.reviews', { count: a.avis })}
                      </>
                    ) : (
                      <PasEncoreDAvis />
                    )}
                  </span>
                  {/* Nombre de « formés » masqué : la base ne le connaît pas (vrais chiffres, 2026-11-25) :
                  <span className="h-6 w-px bg-white/30" />
                  <span className="inline-flex items-center gap-2 text-white/90">
                    <Users className="size-6 text-brand-200" />
                    {t('header.trained', { value: num(a.formes) })}
                  </span>
                  */}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
