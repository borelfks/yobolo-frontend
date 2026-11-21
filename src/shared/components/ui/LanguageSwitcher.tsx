import { useEffect, useRef, useState } from 'react'
import { Check, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUES, langueActive } from '@/i18n'
import { cn } from '@/shared/utils/cn'

/**
 * Choix de la langue, comme dans yibolo-client : un globe et le code de la
 * langue active (« FR »), qui ouvre un menu Français / English avec une coche.
 * Le choix est gardé dans le navigateur (src/i18n, clé « yibolo:langue »).
 */
export function LanguageSwitcher({ light, className }: { light?: boolean; className?: string }) {
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
    <div ref={ref} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        aria-label={t('languageSwitcher.changerDeLangue')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-full px-3 transition-colors',
          light ? 'text-white hover:bg-white/15' : 'text-navy-800 hover:bg-brand-50',
          open && (light ? 'bg-white/15' : 'bg-brand-50'),
        )}
      >
        <Globe className="size-4 shrink-0" aria-hidden />
        {/* Sous « sm », l'en-tête n'a plus la place du code : c'est la coche du menu qui dit la langue active. */}
        <span className="hidden text-xs font-semibold tracking-wide uppercase sm:inline">{active}</span>
      </button>
      {open && (
        <div role="menu" className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-xl">
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
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-brand-50',
                index > 0 && 'border-t border-line',
              )}
            >
              <span className="flex w-6 shrink-0 justify-center">{active === code && <Check className="size-4 text-brand-600" aria-hidden />}</span>
              {t(libelleCle)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
