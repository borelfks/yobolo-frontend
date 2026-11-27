import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

export type ElementVisionneuse = { src: string; alt: string; /** Une vidéo : `src` est le fichier, `poster` l'image d'attente. */ video?: boolean; poster?: string }

/**
 * Visionneuse plein écran des galeries : photo ou vidéo agrandie, précédente /
 * suivante (flèches, clavier ← →), fermeture (croix, Échap, clic à côté).
 * `index` null : fermée.
 */
export function Visionneuse({ elements, index, onClose }: { elements: ElementVisionneuse[]; index: number | null; onClose: () => void }) {
  const { t } = useTranslation()
  const [courant, setCourant] = useState(index ?? 0)
  const [ouvertSur, setOuvertSur] = useState(index)
  // Réouverte sur une autre photo : on repart de celle-ci.
  if (index !== ouvertSur) {
    setOuvertSur(index)
    if (index !== null) setCourant(index)
  }
  const n = elements.length
  const aller = (pas: number) => setCourant((c) => (c + pas + n) % n)

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCourant((c) => (c + 1) % n)
      if (e.key === 'ArrowLeft') setCourant((c) => (c - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, n, onClose])

  if (index === null || n === 0) return null
  const el = elements[courant]!
  const bouton = 'grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25'
  return (
    <div role="dialog" aria-modal="true" aria-label={el.alt} className="fixed inset-0 z-50 flex flex-col bg-navy-950/90 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex items-center justify-between text-sm text-white/80" onClick={(e) => e.stopPropagation()}>
        <span>
          {courant + 1} / {n}
        </span>
        <button type="button" aria-label={t('modal.close')} onClick={onClose} className={bouton}>
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center gap-3 py-3">
        {n > 1 && (
          <button type="button" aria-label={t('visionneuse.previous')} onClick={(e) => (e.stopPropagation(), aller(-1))} className={cn(bouton, 'shrink-0')}>
            <ChevronLeft className="size-6" />
          </button>
        )}
        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {el.video ? (
            <video key={el.src} src={el.src} poster={el.poster} controls autoPlay className="max-h-full max-w-full rounded-xl bg-black">
              {el.alt}
            </video>
          ) : (
            <img src={el.src} alt={el.alt} className="max-h-full max-w-full rounded-xl object-contain" />
          )}
        </div>
        {n > 1 && (
          <button type="button" aria-label={t('visionneuse.next')} onClick={(e) => (e.stopPropagation(), aller(1))} className={cn(bouton, 'shrink-0')}>
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>
      <p className="text-center text-sm text-white/80" onClick={(e) => e.stopPropagation()}>
        {el.alt}
      </p>
    </div>
  )
}
