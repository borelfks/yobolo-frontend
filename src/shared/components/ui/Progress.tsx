import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

export function Progress({ value, tone = 'brand', className }: { value: number; tone?: 'brand' | 'green' | 'violet' | 'orange' | 'sun'; className?: string }) {
  const bar = { brand: 'bg-brand-600', green: 'bg-emerald-500', violet: 'bg-violet-500', orange: 'bg-orange-500', sun: 'bg-sun-400' }[tone]
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div className={cn('h-full rounded-full', bar)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

/** Anneau de progression (complétude, indices…). */
export function Ring({
  value,
  size = 88,
  stroke = 9,
  color = '#16a34a',
  label,
  className,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  label?: ReactNode
  className?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className={cn('relative grid shrink-0 place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e8edf6" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="absolute text-center font-extrabold text-navy-900" style={{ fontSize: size / 4.6 }}>
        {label ?? `${value} %`}
      </span>
    </div>
  )
}
