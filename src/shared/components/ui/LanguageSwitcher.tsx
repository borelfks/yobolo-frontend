import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Check, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUES, langueActive } from '@/i18n'

/** Mêmes classes que le LanguageSwitcher de yibolo-client (emplacement « navbar »). */
const DECLENCHEUR =
  'inline-flex h-10 items-center gap-2 rounded-full px-3 text-muted-foreground ring-offset-background transition-colors hover:bg-survol hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none data-[state=open]:bg-survol data-[state=open]:text-foreground'
// Posé sur la photo sombre du héro : texte blanc.
const DECLENCHEUR_SUR_PHOTO =
  'inline-flex h-10 items-center gap-2 rounded-full px-3 text-white ring-offset-background transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none data-[state=open]:bg-white/15'
const MENU =
  'absolute top-full right-0 z-50 mt-2 w-[16rem] max-w-[calc(100vw-1.5rem)] origin-top-right overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-[0_5px_15px_rgb(0_0_0/0.08),0_15px_35px_-5px_rgb(25_28_33/0.2)] ring-1 ring-foreground/10 animate-menu-entree'
/** Sur téléphone : posé sous l'en-tête, avec une marge de chaque côté. */
const MENU_SOUS_ENTETE = 'max-sm:fixed max-sm:inset-x-3 max-sm:top-[72px] max-sm:right-3 max-sm:mt-0 max-sm:w-auto max-sm:max-w-none'
const LIGNE =
  'flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-sm font-medium text-muted-foreground outline-none select-none transition-colors hover:bg-survol hover:text-foreground focus-visible:bg-survol focus-visible:text-foreground'

/**
 * Choix de la langue, comme dans yibolo-client : un globe et le code de la
 * langue active (« FR »), qui ouvre un menu Français / English avec une coche.
 * Le choix est gardé dans le navigateur (src/i18n, clé « yibolo:langue »).
 * `light` : posé sur une photo sombre, le déclencheur passe en blanc.
 */
export function LanguageSwitcher({ light, className, menuSousEntete = false }: { light?: boolean; className?: string; /** Sur téléphone, le menu s'ouvre sous l'en-tête, sur toute la largeur (il ne sort plus de l'écran). */ menuSousEntete?: boolean }) {
  const { t, i18n } = useTranslation('common')
  const active = langueActive(i18n.language)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={clsx('relative shrink-0', className)}>
      <button
        type="button"
        aria-label={t('languageSwitcher.changerDeLangue')}
        aria-haspopup="menu"
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        onClick={() => setOpen(!open)}
        className={light ? DECLENCHEUR_SUR_PHOTO : DECLENCHEUR}
      >
        <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
        {/* Sous « sm », l'en-tête n'a plus la place du code : c'est la coche du menu qui dit la langue active. */}
        <span className="hidden text-xs font-semibold tracking-wide uppercase sm:inline">{active}</span>
      </button>
      {open && (
        <div role="menu" className={clsx(MENU, menuSousEntete && MENU_SOUS_ENTETE)}>
          {LANGUES.map(({ code, libelleCle }, index) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={active === code}
              lang={code}
              onClick={() => {
                void i18n.changeLanguage(code)
                setOpen(false)
              }}
              className={clsx(LIGNE, index > 0 && 'border-t border-border', active === code && 'text-foreground')}
            >
              <span className="flex w-[2.4rem] shrink-0 justify-center">{active === code && <Check className="size-[1rem]" aria-hidden="true" />}</span>
              {t(libelleCle)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
