import { Lien } from '@/shared/ui/Lien'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Le symbole du logo de l'accueil (repris de yibolo-client) : le « Y » dont les
 * branches forment une coche, dans un carré bleu.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn('size-[1.5rem] shrink-0', className)}>
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
  )
}

/**
 * Le logo de l'accueil, utilisé partout : symbole + « Yibolo », et la devise
 * dessous à partir de `sm`. `light` : sur fond sombre, le texte passe en blanc.
 */
export function Logo({ light, className, to = ROUTES.home }: { light?: boolean; className?: string; to?: string }) {
  const { t } = useTranslation()
  return (
    <Lien to={to} aria-label={t('logo.home')} className={cn('flex shrink-0 flex-col font-client', className)}>
      <span className="flex items-center gap-2">
        {/* Sur fond bleu, un fin contour blanc garde le carré visible. */}
        <LogoMark className={cn(light && 'rounded-[22%] ring-1 ring-white/60')} />
        <span className={cn('text-base font-bold', light ? 'text-white' : 'text-foreground')}>Yibolo</span>
      </span>
      <span className={cn('mt-0.5 hidden text-[0.6875rem] leading-[1.3] font-medium whitespace-nowrap sm:block', light ? 'text-white/85' : 'text-muted-foreground')}>
        {t('logo.tagline')}
      </span>
    </Lien>
  )
}
