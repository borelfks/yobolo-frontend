import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { buttonVariants } from './variants'
import { Slot } from 'radix-ui'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Rend l'enfant (un lien, par exemple) avec l'apparence du bouton. */
    asChild?: boolean
    /** Affiche un indicateur de chargement et bloque le bouton. */
    loading?: boolean
  }

function Button({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && !asChild ? (
        <>
          <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button }
