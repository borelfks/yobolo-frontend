import * as React from 'react'
import { cn } from '@/shared/utils/cn'

/** Classes du champ du canevas (44 px, bordure gris-bleu, contour bleu au focus) : partagées par Input, Textarea et SelectTrigger. */
export const champ =
  'w-full min-w-0 rounded-sm border border-input bg-card px-3 text-ui font-medium text-foreground transition-colors outline-none placeholder:font-normal placeholder:text-subtle-foreground focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return <input type={type} data-slot="input" className={cn(champ, 'h-11', className)} {...props} />
}

export { Input }
