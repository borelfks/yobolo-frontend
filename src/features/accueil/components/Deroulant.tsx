import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/utils/cn'

interface DeroulantProps {
  /** Le contenu du bouton qui ouvre. */
  bouton: ReactNode
  classesBouton: string
  etiquette?: string
  titre?: string
  align?: 'start' | 'end'
  classesPanneau?: string
  /** Appelé à chaque ouverture ou fermeture. */
  onChange?: (ouvert: boolean) => void
  children: (fermer: () => void) => ReactNode
}

const MARGE = 8

/**
 * Un menu ou une petite fenêtre qui s'ouvre sous son bouton (le DropdownMenu et
 * le Popover de yibolo-client). Le panneau est posé sur la page (portail) : la
 * rangée des filtres défile en largeur sur téléphone, et la barre collante a un
 * flou d'arrière-plan, qui retiendraient un panneau posé dedans. Se ferme au
 * clic dehors et avec Échap.
 */
export function Deroulant({ bouton, classesBouton, etiquette, titre, align = 'start', classesPanneau, onChange, children }: DeroulantProps) {
  const [ouvert, setOuvert] = useState(false)
  const [position, setPosition] = useState<CSSProperties>({ visibility: 'hidden' })
  const refBouton = useRef<HTMLButtonElement>(null)
  const refPanneau = useRef<HTMLDivElement>(null)

  const changer = (valeur: boolean) => {
    setOuvert(valeur)
    if (!valeur) setPosition({ visibility: 'hidden' })
    onChange?.(valeur)
  }
  const fermer = () => changer(false)

  useLayoutEffect(() => {
    if (!ouvert) return
    const placer = () => {
      const bouton = refBouton.current?.getBoundingClientRect()
      const largeur = refPanneau.current?.offsetWidth ?? 0
      if (!bouton) return
      const voulu = align === 'end' ? bouton.right - largeur : bouton.left
      const gauche = Math.max(MARGE, Math.min(voulu, window.innerWidth - largeur - MARGE))
      setPosition({ top: bouton.bottom + 4, left: gauche })
    }
    placer()
    window.addEventListener('resize', placer)
    window.addEventListener('scroll', placer, true)
    return () => {
      window.removeEventListener('resize', placer)
      window.removeEventListener('scroll', placer, true)
    }
  }, [ouvert, align])

  useEffect(() => {
    if (!ouvert) return
    const dehors = (evenement: MouseEvent) => {
      const cible = evenement.target as Node
      if (refBouton.current?.contains(cible) || refPanneau.current?.contains(cible)) return
      setOuvert(false)
      setPosition({ visibility: 'hidden' })
      onChange?.(false)
    }
    const echap = (evenement: KeyboardEvent) => {
      if (evenement.key !== 'Escape') return
      setOuvert(false)
      setPosition({ visibility: 'hidden' })
      onChange?.(false)
      refBouton.current?.focus()
    }
    document.addEventListener('mousedown', dehors)
    document.addEventListener('keydown', echap)
    return () => {
      document.removeEventListener('mousedown', dehors)
      document.removeEventListener('keydown', echap)
    }
  }, [ouvert, onChange])

  return (
    <>
      <button
        ref={refBouton}
        type="button"
        aria-expanded={ouvert}
        aria-haspopup="true"
        aria-label={etiquette}
        title={titre}
        data-state={ouvert ? 'open' : 'closed'}
        onClick={() => changer(!ouvert)}
        className={classesBouton}
      >
        {bouton}
      </button>
      {ouvert &&
        createPortal(
          <div
            ref={refPanneau}
            style={{ position: 'fixed', ...position }}
            className={cn(
              'z-50 flex max-w-[calc(100vw-1rem)] animate-menu-entree flex-col rounded-xl border border-line bg-white text-ink shadow-lg [--spacing:0.3rem]',
              classesPanneau,
            )}
          >
            {children(fermer)}
          </div>,
          document.body,
        )}
    </>
  )
}
