import type { ReactNode } from 'react'
import { Breadcrumb, type Crumb } from '@/shared/ui/Breadcrumb'
import { Img } from '@/shared/ui/Img'
import { cn } from '@/shared/utils/cn'

/** Bandeau bleu des pages publiques : icône, titres, photo et arc jaune à droite (img3, img25). */
export function Hero({
  title,
  title2,
  subtitle,
  icon,
  iconBox = true,
  image,
  crumbs,
  children,
  className,
}: {
  title: ReactNode
  title2?: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  iconBox?: boolean
  image?: string
  crumbs?: Crumb[]
  children?: ReactNode
  className?: string
}) {
  return (
    <>
      {crumbs && <Breadcrumb items={crumbs} className="-mt-1" />}
      <section className={cn('relative overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_60%,#1a47c4_100%)] text-white', className)}>
        {image && <Img src={image} alt="" className="absolute inset-y-0 right-0 hidden h-full w-[46%] object-left md:block" />}
        <div className="relative flex items-center gap-6 px-7 py-5 md:w-[55%] md:px-8">
          {icon &&
            (iconBox ? (
              <span className="grid size-[86px] shrink-0 place-items-center rounded-2xl bg-white text-navy-800 shadow-lg [&_svg]:size-12 [&_svg]:stroke-[1.6]">{icon}</span>
            ) : (
              <span className="grid shrink-0 place-items-center text-white [&_svg]:size-[84px] [&_svg]:stroke-[1.5]">{icon}</span>
            ))}
          <div className="min-w-0">
            <h1 className="text-[26px] leading-tight font-extrabold md:text-[32px]">{title}</h1>
            {title2 && <p className="text-[19px] leading-tight font-bold md:text-[23px]">{title2}</p>}
            {subtitle && <p className="mt-1.5 max-w-xl text-[15px] leading-snug text-white/90 md:text-[17px]">{subtitle}</p>}
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
      </section>
    </>
  )
}

/** Arguments du bandeau séparés par des traits (« Établissements vérifiés | … »). */
export function HeroFeatures({ items }: { items: { icon: ReactNode; label: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-y-2 text-[13px] font-medium whitespace-nowrap">
      {items.map((it, i) => (
        <li key={it.label} className={cn('flex items-center gap-2 [&_svg]:size-5', i > 0 && 'border-l border-white/30 pl-4', i < items.length - 1 && 'pr-4')}>
          {it.icon}
          {it.label}
        </li>
      ))}
    </ul>
  )
}
