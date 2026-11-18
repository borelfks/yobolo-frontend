import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const tones = {
  blue: 'bg-brand-50 text-brand-700 ring-brand-100',
  navy: 'bg-navy-800 text-white ring-navy-800',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  orange: 'bg-orange-50 text-orange-700 ring-orange-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  red: 'bg-rose-50 text-rose-700 ring-rose-100',
  gray: 'bg-slate-100 text-slate-600 ring-slate-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  pink: 'bg-pink-50 text-pink-700 ring-pink-100',
  teal: 'bg-teal-50 text-teal-700 ring-teal-100',
  white: 'bg-white/95 text-navy-900 ring-white',
  solidGreen: 'bg-emerald-600 text-white ring-emerald-600',
  solidSun: 'bg-sun-400 text-navy-950 ring-sun-400',
} as const

export type Tone = keyof typeof tones

export function Badge({
  tone = 'blue',
  icon,
  children,
  className,
}: {
  tone?: Tone
  icon?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset [&_svg]:size-3.5',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

/** Petit libellé de statut récurrent : Publiée, En attente, Brouillon… */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Tone> = {
    Publiée: 'green',
    Publié: 'green',
    Actif: 'green',
    Active: 'green',
    Validé: 'green',
    Vérifiée: 'green',
    Vérifié: 'green',
    Confirmé: 'green',
    Payé: 'green',
    Disponible: 'green',
    'Client actif': 'green',
    Terminée: 'green',
    Réalisé: 'green',
    'En attente': 'orange',
    'En validation': 'orange',
    'En analyse': 'orange',
    'À évaluer': 'orange',
    'En cours': 'blue',
    'Prestation en cours': 'blue',
    'À venir': 'violet',
    'Prospect converti': 'violet',
    'À valider': 'amber',
    Brouillon: 'gray',
    Inactif: 'gray',
    'Non démarrée': 'gray',
    'À faire': 'gray',
    Annulé: 'red',
    'À compléter': 'red',
  }
  return <Badge tone={map[status] ?? 'gray'}>{status}</Badge>
}
