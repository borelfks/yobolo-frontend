import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export type ActionMenu = { label: string; icon?: ReactNode; onClick: () => void | Promise<void>; danger?: boolean; hidden?: boolean }

/**
 * Le bouton « … » d'une ligne et son petit menu d'actions (Dupliquer,
 * Dépublier, Supprimer…). Se ferme au clic à côté, avec Échap, ou après un choix.
 */
export function MenuActions({ label, actions, className }: { label: string; actions: ActionMenu[]; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const dehors = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    const echap = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', dehors)
    window.addEventListener('keydown', echap)
    return () => {
      document.removeEventListener('mousedown', dehors)
      window.removeEventListener('keydown', echap)
    }
  }, [open])
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn('grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fc] text-navy-800 hover:bg-brand-100', className)}
      >
        <MoreHorizontal className="size-5" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-1.5 w-56 rounded-xl border border-line bg-white p-1.5 text-left shadow-xl">
          {actions
            .filter((a) => !a.hidden)
            .map((a) => (
              <button
                key={a.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  void a.onClick()
                }}
                className={cn('flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-medium [&_svg]:size-4', a.danger ? 'text-rose-600 hover:bg-rose-50' : 'text-navy-900 hover:bg-brand-50')}
              >
                {a.icon}
                {a.label}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
