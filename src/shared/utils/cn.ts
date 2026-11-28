import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge doit connaître les tailles de texte ajoutées dans theme.css :
 * sinon il prend `text-ui` pour une couleur et retire la couleur du texte
 * (`text-primary-foreground`) posée à côté.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: { text: ['meta', 'ui', 'caption3', 'micro', 'legende', 'intro', 'titre-sm', 'titre-md', 'titre', 'titre-lg', 'titre-xl', 'titre-2xl', 'chiffre', 'chiffre-xl'] },
    classGroups: { shadow: [{ shadow: ['raised', 'thumb', 'card-hover', 'floating', 'dialog', 'bar', 'account', 'drawer'] }] },
  },
})

/** Assemble des classes Tailwind en résolvant les conflits. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
