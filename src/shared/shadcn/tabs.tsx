import * as React from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'
import { cn } from '@/shared/utils/cn'

/**
 * Les onglets du canevas : 48 px de haut, texte 15 px en gras, soulignés de
 * 3 px en bleu quand ils sont actifs. Pour des onglets qui changent l'adresse,
 * utiliser `tabTriggerClasses` sur un lien (voir LinkTabs).
 */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col', className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn('scrollbar-thin flex items-end gap-6 overflow-x-auto border-b border-border', className)}
      {...props}
    />
  )
}

/** Classes d'un onglet ; l'état actif se lit sur `data-state=active` ou `aria-current=page`. */
export const tabTriggerClasses =
  'inline-flex h-12 flex-none cursor-pointer items-center gap-1.5 border-b-[3px] border-transparent px-1 text-ui font-bold whitespace-nowrap text-muted-foreground no-underline transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-primary aria-[current=page]:border-primary aria-[current=page]:text-primary [&_svg]:size-4'

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn(tabTriggerClasses, className)} {...props} />
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('pt-4 outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
