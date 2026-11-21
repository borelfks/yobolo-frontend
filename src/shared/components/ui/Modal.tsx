import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  icon,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  icon?: ReactNode
  size?: 'md' | 'lg'
}) {
  const { t } = useTranslation()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={cn('w-full rounded-3xl bg-white p-6 shadow-2xl', size === 'md' ? 'max-w-md' : 'max-w-2xl')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          {icon}
          <h2 className="flex-1 text-lg text-navy-900">{title}</h2>
          <button type="button" aria-label={t('modal.close')} onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-slate-100">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
