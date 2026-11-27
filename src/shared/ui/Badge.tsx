import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'

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

/**
 * Statuts connus : la valeur française (venue des données) donne la couleur
 * et la clé de traduction (common.json, status.<clé>).
 */
const statuses = {
  Publiée: ['green', 'publiee'],
  Publié: ['green', 'publie'],
  Actif: ['green', 'actif'],
  Active: ['green', 'active'],
  Validé: ['green', 'valide'],
  Vérifiée: ['green', 'verifiee'],
  Vérifié: ['green', 'verifie'],
  Confirmé: ['green', 'confirme'],
  Payé: ['green', 'paye'],
  Disponible: ['green', 'disponible'],
  'Client actif': ['green', 'clientActif'],
  Terminée: ['green', 'terminee'],
  Réalisé: ['green', 'realise'],
  'En attente': ['orange', 'enAttente'],
  'En validation': ['orange', 'enValidation'],
  'En analyse': ['orange', 'enAnalyse'],
  'À évaluer': ['orange', 'aEvaluer'],
  'En cours': ['blue', 'enCours'],
  'Prestation en cours': ['blue', 'prestationEnCours'],
  'À venir': ['violet', 'aVenir'],
  'Prospect converti': ['violet', 'prospectConverti'],
  'À valider': ['amber', 'aValider'],
  Brouillon: ['gray', 'brouillon'],
  Inactif: ['gray', 'inactif'],
  'Non démarrée': ['gray', 'nonDemarree'],
  'À faire': ['gray', 'aFaire'],
  Annulé: ['red', 'annule'],
  'À compléter': ['red', 'aCompleter'],
} as const satisfies Record<string, readonly [Tone, string]>

/**
 * Petit libellé de statut récurrent : Publiée, En attente, Brouillon…
 * `status` est la valeur française des données ; le libellé affiché est traduit.
 */
export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  const known = status in statuses ? statuses[status as keyof typeof statuses] : undefined
  return <Badge tone={known?.[0] ?? 'gray'}>{known ? t(`status.${known[1]}`) : status}</Badge>
}
