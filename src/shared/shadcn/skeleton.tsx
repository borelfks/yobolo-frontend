import * as React from 'react'
import { cn } from '@/shared/utils/cn'

/** Un bloc gris qui pulse, à la place d'un contenu qui se charge. Toujours `aria-hidden` : le chargement est annoncé ailleurs. */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-secondary motion-reduce:animate-none', className)}
      {...props}
    />
  )
}

export { Skeleton }
