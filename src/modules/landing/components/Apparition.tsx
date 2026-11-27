import type { CSSProperties, ReactNode } from 'react'
import { useVisible } from '@/modules/landing/hooks/useVisible'
import { clsx } from 'clsx'

interface ApparitionProps {
  children: ReactNode
  delai?: number
  className?: string
}

/** Monte en fondu quand il entre à l'écran ; `delai` décale les éléments d'une même rangée. */
export function Apparition({ children, delai = 0, className }: ApparitionProps) {
  const { ref, visible } = useVisible<HTMLDivElement>()

  return (
    <div
      ref={ref}
      data-visible={visible ? '' : undefined}
      style={{ '--delai': `${delai}ms` } as CSSProperties}
      className={clsx('apparition', className)}
    >
      {children}
    </div>
  )
}
