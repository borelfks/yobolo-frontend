import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'

export function Stars({ value, size = 'sm', showValue, count }: { value: number; size?: 'xs' | 'sm' | 'md' | 'lg'; showValue?: boolean; count?: number }) {
  const { t } = useTranslation()
  const s = { xs: 'size-3', sm: 'size-4', md: 'size-5', lg: 'size-7' }[size]
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={cn(s, i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} />
        ))}
      </span>
      {showValue && <span className="text-sm font-bold text-navy-900">{num(value)}</span>}
      {count !== undefined && <span className="text-sm text-muted">{t('rating.reviews', { count, n: num(count) })}</span>}
    </span>
  )
}

/** Note compacte « ★ 4,7 (286 avis) ». */
export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  const { t } = useTranslation()
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', className)}>
      <Star className="size-4 fill-amber-400 text-amber-400" />
      <span className="font-bold">{num(value)}</span>
      {count !== undefined && <span className="text-muted">{t('rating.reviews', { count, n: num(count) })}</span>}
    </span>
  )
}

/** Notation cliquable. */
export function StarInput({ value, onChange, size = 'lg' }: { value: number; onChange: (v: number) => void; size?: 'md' | 'lg' }) {
  const { t } = useTranslation()
  const s = size === 'lg' ? 'size-8' : 'size-6'
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" aria-label={t('rating.stars', { count: i })} onClick={() => onChange(i)}>
          <Star className={cn(s, 'transition-colors', i <= value ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 hover:fill-amber-200 hover:text-amber-200')} />
        </button>
      ))}
    </span>
  )
}
