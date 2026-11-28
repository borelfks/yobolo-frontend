import * as React from "react"
import { cn } from "@/shared/utils/cn"
import { CircleIcon } from "lucide-react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-[18px] shrink-0 cursor-pointer rounded-full border border-input bg-card text-primary data-[state=checked]:border-primary transition-[color,box-shadow] outline-none focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive ",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

/**
 * Un choix en forme de carte (canevas : profil et type d'établissement à
 * l'inscription) : bordure grise, bleue et fond bleu pâle quand il est choisi.
 * Le contenu est libre ; `data-state` permet de styler les enfants (`group-data-[state=checked]:…`).
 */
function RadioGroupCard({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-card"
      className={cn(
        "group relative flex w-full cursor-pointer items-center gap-3.5 rounded-lg border border-border-strong bg-card p-4 text-left text-foreground transition-colors outline-none hover:border-input focus-visible:outline-2 focus-visible:outline-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary-wash disabled:cursor-not-allowed disabled:bg-muted disabled:hover:border-border-strong",
        className
      )}
      {...props}
    />
  )
}

/** Un choix court posé dans une case de 48 px avec son rond (canevas : civilité). */
function RadioGroupOption({ className, children, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-option"
      className={cn(
        "group flex h-12 flex-1 cursor-pointer items-center gap-2.5 rounded-sm border border-input bg-card px-4 text-ui font-semibold whitespace-nowrap text-foreground outline-none focus-visible:outline-2 focus-visible:outline-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary-wash",
        className
      )}
      {...props}
    >
      <span className="grid size-[18px] shrink-0 place-items-center rounded-full border border-input bg-card group-data-[state=checked]:border-primary">
        <span className="size-2.5 rounded-full bg-primary opacity-0 group-data-[state=checked]:opacity-100" />
      </span>
      {children}
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupCard, RadioGroupOption }
