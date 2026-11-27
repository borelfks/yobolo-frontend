import * as React from 'react'
import { cn } from '@/shared/utils/cn'
import { champ } from './input'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(champ, 'min-h-[120px] resize-y py-2.5 leading-normal', className)}
      {...props}
    />
  )
}

export { Textarea }
