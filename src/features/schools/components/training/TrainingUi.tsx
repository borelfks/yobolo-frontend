import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

/** Ligne de liste avec une coche verte. */
export function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] text-navy-900">
      <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 12.5l5 5L20 6.5" />
      </svg>
      <span>{children}</span>
    </li>
  )
}

/** Titre de bloc avec icône bleue. */
export function Heading({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('flex items-center gap-2.5 text-[21px] font-bold text-navy-900 [&_svg]:size-6 [&_svg]:text-brand-600', className)}>
      {icon}
      {children}
    </h2>
  )
}
