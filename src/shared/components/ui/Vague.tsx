import { clsx } from 'clsx'

/**
 * Le bord ondulé de la maquette (repris de yibolo-client), dans la couleur du
 * texte (`text-*`) : posé en bas d'une photo ou en haut d'un bloc, il fait
 * remonter la surface qui suit.
 */
export function Vague({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 80" preserveAspectRatio="none" className={clsx('block w-full', className)}>
      <path fill="currentColor" d="M0 80V46C140 14 300 4 470 22C640 40 760 70 930 62C1050 56 1140 34 1200 18V80Z" />
    </svg>
  )
}

/** Le trait courbe qui souligne un mot fort, dans la couleur du texte. */
export function TraitCourbe({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 24" preserveAspectRatio="none" className={clsx('block', className)}>
      <path d="M4 18C80 6 190 2 296 8" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}
