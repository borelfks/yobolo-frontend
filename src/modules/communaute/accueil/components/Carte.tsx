import type { ComponentProps, ReactNode } from 'react'
import { initiales } from '@/modules/communaute/accueil/accueilFil'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/avatar'
import { cn } from '@/shared/utils/cn'

/**
 * Une carte de l'accueil (canevas) : blanche, bordée, arrondie de 10 px sur
 * ordinateur ; sur téléphone, sur toute la largeur, bordée en haut et en bas.
 */
export function Carte({ element: Element = 'div', className, children, ...props }: { element?: 'div' | 'article' | 'section'; className?: string; children: ReactNode } & Omit<ComponentProps<'div'>, 'className' | 'children'>) {
  return (
    <Element className={cn('border-y border-border bg-card lg:rounded-lg lg:border', className)} {...props}>
      {children}
    </Element>
  )
}

/** Une photo ronde (auteur, expert, compte) ; sans photo, les initiales du nom. `className` donne la taille (`size-12`). */
export function PhotoRonde({ src, nom, className }: { src?: string; nom: string; className?: string }) {
  return (
    <Avatar className={cn('size-12', className)}>
      {src && <AvatarImage src={src} alt="" className="object-cover" />}
      <AvatarFallback>{initiales(nom)}</AvatarFallback>
    </Avatar>
  )
}
