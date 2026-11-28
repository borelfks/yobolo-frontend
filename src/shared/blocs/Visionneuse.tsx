import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/shared/shadcn/dialog'

/** Une photo ou une vidéo de la visionneuse. `video` : `src` est le fichier, `poster` l'image d'attente. */
export type MediaVisionneuse = { src: string; alt: string; video?: boolean; poster?: string }

/**
 * La visionneuse des galeries (fiches d'établissement et d'auto-école) : la
 * photo ou la vidéo agrandie dans une fenêtre, précédente / suivante (boutons,
 * flèches du clavier), fermeture (croix, Échap, clic à côté). `index` null :
 * fermée. Bâtie sur la fenêtre shadcn (Dialog) : le focus reste dedans.
 */
export function VisionneuseMedias({ medias, index, onClose }: { medias: MediaVisionneuse[]; index: number | null; onClose: () => void }) {
  const { t } = useTranslation()
  const [courant, setCourant] = useState(index ?? 0)
  const [ouvertSur, setOuvertSur] = useState(index)
  // Rouverte sur un autre média : on repart de celui-ci.
  if (index !== ouvertSur) {
    setOuvertSur(index)
    if (index !== null) setCourant(index)
  }
  const n = medias.length
  const media = medias[Math.min(courant, n - 1)]
  const aller = (pas: number) => setCourant((c) => (c + pas + n) % n)
  return (
    <Dialog open={index !== null && n > 0} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-[calc(100%-1rem)] gap-3 bg-foreground p-3 sm:max-w-4xl sm:p-4 [&>[data-slot=dialog-close]]:bg-card"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') aller(1)
          if (e.key === 'ArrowLeft') aller(-1)
        }}
      >
        <DialogTitle className="sr-only">{media?.alt}</DialogTitle>
        {media &&
          (media.video ? (
            <video key={media.src} src={media.src} poster={media.poster} controls autoPlay className="max-h-[75dvh] w-full rounded-md bg-foreground" aria-label={media.alt} />
          ) : (
            <img src={media.src} alt={media.alt} className="max-h-[75dvh] w-full rounded-md object-contain" />
          ))}
        {n > 1 && (
          <div className="flex items-center justify-between gap-3 text-meta text-white">
            <Button variant="outline" size="icon-sm" onClick={() => aller(-1)} aria-label={t('visionneuse.previous')}>
              <ChevronLeft aria-hidden />
            </Button>
            <span aria-live="polite">
              {courant + 1} / {n}
            </span>
            <Button variant="outline" size="icon-sm" onClick={() => aller(1)} aria-label={t('visionneuse.next')}>
              <ChevronRight aria-hidden />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
