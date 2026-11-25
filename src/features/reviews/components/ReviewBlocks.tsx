import { useState } from 'react'
import { BadgeCheck, PencilLine, ThumbsUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Stars } from '@/shared/components/ui/StarRating'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'

/** Profils d’auteur connus (valeur des données de démo → clé de traduction) ; les autres s’affichent tels quels. */
const roleKeys = {
  Étudiant: 'etudiant',
  Étudiante: 'etudiante',
  'Ancien étudiant': 'ancienEtudiant',
  'Ancienne étudiante': 'ancienneEtudiante',
  Entreprise: 'entreprise',
} as const
const isKnownRole = (role: string): role is keyof typeof roleKeys => role in roleKeys

/** Note globale + répartition 5 → 1 étoiles. */
export function RatingSummary({
  note,
  total,
  repartition,
  avisHref,
  colored,
  children,
}: {
  note: number
  total: number
  repartition: { etoiles: number; pct: number }[]
  avisHref?: string
  colored?: boolean
  children?: React.ReactNode
}) {
  const { t } = useTranslation('reviews')
  const colors = ['bg-emerald-500', 'bg-lime-500', 'bg-amber-400', 'bg-orange-500', 'bg-rose-500']
  return (
    <Card className="h-fit space-y-4 p-5">
      <p className="font-bold text-navy-900">{t('blocks.noteGlobale')}</p>
      <div className="text-center">
        <p className="text-5xl font-extrabold text-navy-900">
          {num(note)}
          <span className="text-xl text-muted">/5</span>
        </p>
        <Stars value={note} size="md" />
        <p className="mt-1 text-sm text-muted">{t('blocks.basee', { count: total, total: num(total) })}</p>
      </div>
      <ul className="space-y-2">
        {repartition.map((r, i) => (
          <li key={r.etoiles} className="flex items-center gap-2 text-sm">
            <span className="w-6 text-muted">{r.etoiles}★</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <span className={cn('block h-full rounded-full', colored ? colors[i] : 'bg-amber-400')} style={{ width: `${r.pct}%` }} />
            </span>
            <span className="w-9 text-right font-semibold">{t('blocks.pourcentage', { value: r.pct })}</span>
          </li>
        ))}
      </ul>
      {children}
      {avisHref && (
        <Button to={avisHref} variant="outline" className="w-full">
          <PencilLine />
          {t('blocks.donnerAvis')}
        </Button>
      )}
    </Card>
  )
}

export type Review = { id: string; nom: string; role?: string; note: number; date: string; texte: string; utile?: number; avatar?: string; verifie?: boolean }

export function ReviewItem({ r }: { r: Review }) {
  const { t } = useTranslation('reviews')
  const [liked, setLiked] = useState(false)
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <Avatar src={r.avatar || undefined} name={r.nom} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-navy-900">{r.nom}</p>
            {r.verifie && <BadgeCheck className="size-4 text-brand-600" aria-label={t('blocks.avisVerifie')} />}
            {r.role && <Badge tone={r.role === 'Entreprise' ? 'violet' : r.role.startsWith('Ancien') ? 'green' : 'blue'}>{isKnownRole(r.role) ? t(`blocks.roles.${roleKeys[r.role]}`) : r.role}</Badge>}
            <span className="text-xs text-muted">{r.date}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Stars value={r.note} />
            <span className="text-sm font-semibold">{r.note}/5</span>
          </div>
          <p className="mt-2 text-sm text-ink/85">{r.texte}</p>
          {r.utile !== undefined && (
            <button
              type="button"
              onClick={() => {
                setLiked(!liked)
                if (!liked) toast(t('blocks.toasts.merciRetour'))
              }}
              className={cn('mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1', liked ? 'bg-brand-50 text-brand-700 ring-brand-200' : 'text-muted ring-line hover:bg-slate-50')}
            >
              <ThumbsUp className="size-3.5" />
              {r.utile + (liked ? 1 : 0)}
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
