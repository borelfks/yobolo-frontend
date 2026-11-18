import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Étapes numérotées reliées par un trait (inscription, préinscription…).
 * `current` part de 0 ; les étapes passées sont cochées.
 */
export function Stepper({
  steps,
  current,
  tone = 'brand',
  onStepClick,
  className,
}: {
  steps: string[]
  current: number
  tone?: 'brand' | 'green'
  onStepClick?: (i: number) => void
  className?: string
}) {
  const done = tone === 'green' ? 'bg-emerald-500 text-white' : 'bg-brand-600 text-white'
  const line = tone === 'green' ? 'bg-emerald-500' : 'bg-brand-600'
  return (
    <ol className={cn('flex items-start', className)}>
      {steps.map((s, i) => (
        <Fragment key={s}>
          <li className="flex min-w-0 flex-col items-center gap-1.5 text-center">
            <button
              type="button"
              disabled={!onStepClick || i > current}
              onClick={() => onStepClick?.(i)}
              className={cn(
                'grid size-9 place-items-center rounded-full text-sm font-bold ring-4 transition-colors',
                i < current && cn(done, 'ring-transparent'),
                i === current && cn(done, tone === 'green' ? 'ring-emerald-100' : 'ring-brand-100'),
                i > current && 'bg-white text-slate-400 ring-slate-100 border border-slate-200',
              )}
            >
              {i < current ? <Check className="size-4" strokeWidth={3} /> : i + 1}
            </button>
            <span className={cn('max-w-28 text-xs font-semibold', i <= current ? 'text-navy-900' : 'text-slate-400')}>{s}</span>
          </li>
          {i < steps.length - 1 && (
            <li aria-hidden className={cn('mx-2 mt-[18px] h-0.5 flex-1 rounded', i < current ? line : 'bg-slate-200')} />
          )}
        </Fragment>
      ))}
    </ol>
  )
}

/** Variante « flèches » : Détails → Compétences → Justificatifs → Validation. */
export function ArrowSteps({ steps, current, className }: { steps: string[]; current: number; className?: string }) {
  return (
    <ol className={cn('grid gap-1 sm:flex', className)}>
      {steps.map((s, i) => (
        <li
          key={s}
          className={cn(
            'flex flex-1 items-center gap-2 px-4 py-2.5 text-sm font-semibold sm:[clip-path:polygon(0_0,calc(100%-14px)_0,100%_50%,calc(100%-14px)_100%,0_100%,14px_50%)] sm:first:[clip-path:polygon(0_0,calc(100%-14px)_0,100%_50%,calc(100%-14px)_100%,0_100%)] rounded-lg sm:rounded-none sm:pl-6',
            i < current && 'bg-emerald-50 text-emerald-700',
            i === current && 'bg-brand-600 text-white',
            i > current && 'bg-slate-100 text-slate-500',
          )}
        >
          <span
            className={cn(
              'grid size-6 shrink-0 place-items-center rounded-full text-xs',
              i < current ? 'bg-emerald-500 text-white' : i === current ? 'bg-white text-brand-700' : 'bg-white text-slate-400',
            )}
          >
            {i < current ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
          </span>
          <span className="truncate">{s}</span>
        </li>
      ))}
    </ol>
  )
}
