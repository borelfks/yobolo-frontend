import type { ComponentProps, ReactNode } from 'react'
import { useLocation } from '@tanstack/react-router'
import { cible } from '@/shared/utils/cible'
import { Lien } from './Lien'

type Etat = { isActive: boolean }
type Props = Omit<ComponentProps<typeof Lien>, 'to' | 'className' | 'children'> & {
  /** Adresse de ROUTES (peut contenir une recherche ou une ancre). */
  to: string
  /** Actif seulement sur cette adresse exacte (pas sur ses sous-pages). */
  end?: boolean
  className?: string | ((etat: Etat) => string)
  children?: ReactNode | ((etat: Etat) => ReactNode)
}

/**
 * Un lien de menu ou d'onglet qui sait s'il est actif : actif sur son adresse
 * et ses sous-pages (ou sur son adresse exacte avec `end`). Pose
 * `aria-current="page"` quand il l'est.
 */
export function LienActif({ to, end = false, className, children, ...props }: Props) {
  const { pathname } = useLocation()
  const chemin = cible(to).to
  const isActive = end ? pathname === chemin : pathname === chemin || pathname.startsWith(`${chemin.replace(/\/$/, '')}/`)
  const etat = { isActive }
  return (
    <Lien
      {...props}
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={typeof className === 'function' ? className(etat) : className}
    >
      {typeof children === 'function' ? children(etat) : children}
    </Lien>
  )
}
