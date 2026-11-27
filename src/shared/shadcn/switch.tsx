import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { cn } from '@/shared/utils/cn'

/** L'interrupteur du canevas : 40 × 22 px, vert quand il est activé, gris clair sinon. */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-success data-[state=unchecked]:bg-border-strong',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-transform motion-reduce:transition-none data-[state=checked]:translate-x-[21px] data-[state=unchecked]:translate-x-[3px]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
