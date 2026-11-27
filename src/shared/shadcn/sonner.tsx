import * as React from 'react'
import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

/**
 * Les messages éphémères (bibliothèque sonner), aux couleurs du canevas : en
 * haut à droite, avec une croix, une icône et une couleur de sens. Appeler
 * `toast.success(…)`, `toast.error(…)`, `toast.warning(…)`, `toast(…)` ou
 * `toast.promise(…)` depuis n'importe quel écran.
 */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      closeButton
      richColors
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-5" />,
        info: <Info className="size-5" />,
        warning: <TriangleAlert className="size-5" />,
        error: <OctagonX className="size-5" />,
        loading: <Loader2 className="size-5 animate-spin" />,
      }}
      toastOptions={{ classNames: { toast: 'font-sans !rounded-lg !shadow-floating', title: '!text-sm !font-bold', description: '!text-meta' } }}
      style={
        {
          '--normal-bg': 'var(--color-popover)',
          '--normal-text': 'var(--color-popover-foreground)',
          '--normal-border': 'var(--color-border)',
          '--success-bg': 'var(--color-success-soft)',
          '--success-text': 'var(--color-success)',
          '--success-border': 'var(--color-success-line)',
          '--error-bg': 'var(--color-destructive-soft)',
          '--error-text': 'var(--color-destructive-hover)',
          '--error-border': 'var(--color-destructive-line)',
          '--warning-bg': 'var(--color-warning-soft)',
          '--warning-text': 'var(--color-warning-strong)',
          '--warning-border': 'var(--color-warning)',
          '--info-bg': 'var(--color-primary-soft)',
          '--info-text': 'var(--color-primary-strong)',
          '--info-border': 'var(--color-primary-line)',
          '--border-radius': 'var(--radius-lg)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
