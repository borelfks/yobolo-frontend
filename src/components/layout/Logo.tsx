import { Link } from 'react-router'
import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn('size-10', className)}>
      <circle cx="32" cy="13" r="8" fill="#1f55e6" />
      <path d="M6 18c9 1 18 10 24 27C19 41 10 32 6 18z" fill="#16a34a" />
      <path d="M58 18c-9 1-18 10-24 27 11-4 20-13 24-27z" fill="#2f6bff" />
      <rect x="29.5" y="44" width="5" height="15" rx="2.5" fill="#0f2c7a" />
    </svg>
  )
}

export function Logo({ light, className, to = '/' }: { light?: boolean; className?: string; to?: string }) {
  return (
    <Link to={to} aria-label="YIBOLO — Accueil" className={cn('flex items-center gap-2', className)}>
      <LogoMark />
      <span className="leading-none">
        <span className={cn('block text-2xl font-extrabold tracking-tight', light ? 'text-white' : 'text-navy-800')}>YIBOLO</span>
        <span className={cn('block text-[9px] font-semibold tracking-wide', light ? 'text-white/70' : 'text-brand-600')}>
          Apprendre · Former · Consulter · Travailler
        </span>
      </span>
    </Link>
  )
}
