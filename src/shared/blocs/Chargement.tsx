import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

const TAILLES = { sm: 'size-4', md: 'size-6', lg: 'size-9' } as const

/** Indicateur de chargement (rond qui tourne), annoncé aux lecteurs d'écran. */
export function Spinner({ size = 'md', label, className }: { size?: keyof typeof TAILLES; label?: string; className?: string }) {
  const { t } = useTranslation()
  return (
    <span role="status" className={cn('inline-flex text-primary', className)}>
      <Loader2 className={cn('animate-spin motion-reduce:animate-none', TAILLES[size])} aria-hidden />
      <span className="sr-only">{label ?? t('loading')}</span>
    </span>
  )
}

/**
 * Voile sur un bloc pendant une action (enregistrement, envoi) : le contenu
 * reste visible mais n'est plus cliquable. Le parent doit être `relative`.
 */
export function SpinnerOverlay({ visible, label }: { visible: boolean; label?: string }) {
  if (!visible) return null
  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-[inherit] bg-card/70">
      <Spinner size="lg" label={label} />
    </div>
  )
}

/** Chargement d'une page entière (pendant le téléchargement d'une page). Préférer les squelettes quand la forme de la page est connue. */
export function PageSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('grid min-h-[40vh] place-items-center', className)}>
      <Spinner size="lg" />
    </div>
  )
}
