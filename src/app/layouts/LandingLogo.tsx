import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

interface LandingLogoProps {
  /** Posé sur une photo sombre : le nom passe en blanc. */
  surPhoto?: boolean
  /** « Apprendre · Évoluer · Réussir » sous le nom, à partir de `sm`. */
  avecDevise?: boolean
  className?: string
}

/**
 * Le logo de yibolo-client (landing) : le « Y » dont les branches forment une
 * coche, dans un carré bleu, puis « Yibolo ».
 */
export function LandingLogo({ surPhoto = false, avecDevise = false, className }: LandingLogoProps) {
  const { t } = useTranslation('layout')

  if (avecDevise) {
    return (
      <span className={clsx('flex flex-col', className)}>
        <LandingLogo surPhoto={surPhoto} />
        <span
          className={clsx(
            'mt-0.5 hidden text-caption3 font-medium whitespace-nowrap transition-colors sm:block',
            surPhoto ? 'text-white/85' : 'text-muted-foreground',
          )}
        >
          {t('accueil.entete.devise')}
        </span>
      </span>
    )
  }

  return (
    <span className={clsx('flex items-center gap-2', className)}>
      <svg aria-hidden="true" viewBox="0 0 64 64" className="size-[1.5rem] shrink-0">
        <rect width="64" height="64" rx="14" className="fill-primary" />
        <path
          d="M16.5 20.5 30.5 32.5 47.5 16.5M30.5 32.5v15"
          fill="none"
          strokeWidth="10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-primary-foreground"
        />
      </svg>
      <span className={clsx('text-base font-bold transition-colors', surPhoto ? 'text-white' : 'text-foreground')}>Yibolo</span>
    </span>
  )
}
