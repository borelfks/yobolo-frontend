import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Briefcase, ChevronDown, GraduationCap, MessageCircle, PencilLine, Star, ThumbsUp, Users } from 'lucide-react'
import { Img } from '@/shared/components/ui/Img'
import { Stars } from '@/shared/components/ui/StarRating'
import { Select } from '@/shared/components/forms/Fields'
import { card } from '@/features/schools/components/profile/profileShared'
import { repartitionNotes, slugOfType } from '@/mocks/schools'
import { useAvisEtablissement, useEtablissement } from '@/data/hooks'
import type { AvisEtablissement } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Rôle d'un auteur d'avis (valeur fixe des données) → fin de sa clé de traduction. */
const roleKeys = {
  Étudiant: 'etudiant',
  Étudiante: 'etudiante',
  'Ancien étudiant': 'ancienEtudiant',
  'Ancienne étudiante': 'ancienneEtudiante',
  Entreprise: 'entreprise',
} as const

const isKnownRole = (role: string): role is keyof typeof roleKeys => role in roleKeys

function Laurel({ flip }: { flip?: boolean }) {
  const pt = (t: number) => {
    const x = (1 - t) * (1 - t) * 24 + 2 * (1 - t) * t * 2 + t * t * 24
    const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * 34 + t * t * 64
    return [x, y]
  }
  const leaves = [0.12, 0.26, 0.4, 0.54, 0.68, 0.82]
  return (
    <svg viewBox="0 0 34 70" className={cn('h-[70px] w-9 text-amber-400', flip && '-scale-x-100')} aria-hidden>
      <path d="M24 4 Q 2 34 24 64" stroke="currentColor" strokeWidth="2" fill="none" />
      {leaves.map((t) => {
        const [x, y] = pt(t)
        return (
          <g key={t} fill="currentColor">
            <ellipse cx={x - 4} cy={y} rx="2.6" ry="5.2" transform={`rotate(-35 ${x - 4} ${y})`} />
            <ellipse cx={x + 3.5} cy={y - 1} rx="2.6" ry="5.2" transform={`rotate(35 ${x + 3.5} ${y - 1})`} />
          </g>
        )
      })}
    </svg>
  )
}

/** Onglet « Avis » de la fiche établissement. */
export function AvisTab({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(id)
  const avis = useAvisEtablissement(e.id)
  const [f, setF] = useState('tous')
  const list = f === 'tous' ? avis : avis.filter((a) => (f === 'etudiants' ? a.role.startsWith('Étudiant') : f === 'anciens' ? a.role.startsWith('Ancien') : a.role === 'Entreprise'))
  const filtres = [
    { value: 'tous', label: t('ecoleProfil.avis.filters.tous', { n: e.avis }), icon: null },
    { value: 'etudiants', label: t('ecoleProfil.avis.filters.etudiants', { n: Math.round(e.avis * 0.734) }), icon: <GraduationCap /> },
    { value: 'anciens', label: t('ecoleProfil.avis.filters.anciens', { n: Math.round(e.avis * 0.196) }), icon: <Briefcase /> },
    { value: 'entreprises', label: t('ecoleProfil.avis.filters.entreprises', { n: Math.round(e.avis * 0.07) }), icon: <Users /> },
  ]
  return (
    <div className="grid gap-5 lg:grid-cols-[324px_1fr]">
      <div className={cn(card, 'h-fit p-5')}>
        <p className="text-center text-[20px] font-bold text-navy-900">{t('ecoleProfil.avis.globalRating')}</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <Laurel />
          <div className="text-center">
            <p className="flex items-baseline gap-1 text-[44px] leading-none font-extrabold text-navy-900">
              <Star className="mr-1 size-9 self-center fill-amber-400 text-amber-400" />
              {num(e.note)}
              <span className="text-[24px] font-semibold">/5</span>
            </p>
            <p className="mt-1 text-[14px] text-ink">{t('shared.ratingCount', { count: e.avis })}</p>
          </div>
          <Laurel flip />
        </div>
        <ul className="mt-5 space-y-2.5 border-b border-line pb-5">
          {repartitionNotes.map((r) => (
            <li key={r.etoiles} className="flex items-center gap-2.5 text-[15px] text-navy-900">
              <span className="w-3">{r.etoiles}</span>
              <Star className="size-[18px] fill-amber-400 text-amber-400" />
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#e6ecf7]">
                <span className="block h-full rounded-full bg-brand-600" style={{ width: `${r.pct}%` }} />
              </span>
              <span className="w-10 text-right">{t('ecoleProfil.avis.percent', { n: r.pct })}</span>
            </li>
          ))}
        </ul>
        <Link to={ROUTES.schoolReview(slugOfType(e.type), e.id)} className="mt-5 flex h-12 items-center justify-center gap-2.5 rounded-full border-2 border-brand-600/70 text-[17px] font-semibold text-navy-800 hover:bg-brand-50">
          <PencilLine className="size-5" />
          {t('ecoleProfil.avis.giveReview')}
        </Link>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 text-[22px] font-bold text-navy-900">
            <MessageCircle className="size-7 fill-brand-600 text-white" /> {t('ecoleProfil.avis.learnersReviews', { n: e.avis })}
          </h2>
          <span className="flex items-center gap-2 text-sm">
            {t('shared.sortBy')}
            <span className="w-44"><Select aria-label={t('shared.sortByAria')} options={[t('ecoleProfil.avis.sort.recents'), t('ecoleProfil.avis.sort.mieuxNotes'), t('ecoleProfil.avis.sort.utiles')]} className="h-10" /></span>
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {filtres.map((x) => (
            <button
              key={x.value}
              type="button"
              onClick={() => setF(x.value)}
              className={cn('inline-flex h-10 items-center gap-2 rounded-full px-5 text-[15px] font-semibold [&_svg]:size-5', f === x.value ? 'bg-brand-600 text-white' : 'border border-line bg-white text-navy-900 hover:bg-brand-50')}
            >
              {x.icon}
              {x.label}
            </button>
          ))}
        </div>
        {list.map((r) => (
          <AvisLine key={r.id} r={r} />
        ))}
        <div className="flex justify-center pt-1">
          <button type="button" onClick={() => toast(t('ecoleProfil.avis.loadMoreToast'))} className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-brand-600/60 bg-white px-11 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
            {t('ecoleProfil.avis.seeMore', { n: e.avis - 3 })}
            <ChevronDown className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AvisLine({ r }: { r: AvisEtablissement }) {
  const { t } = useTranslation('schools')
  const [liked, setLiked] = useState(false)
  return (
    <div className={cn(card, 'flex flex-col gap-3 p-3 sm:flex-row sm:items-center')}>
      <div className="flex items-center gap-3 sm:w-[310px]">
        <Img src={r.avatar} alt={r.nom} className="size-14 rounded-full" />
        <div>
          <p className="flex items-center gap-2 text-[16px] font-bold text-navy-900">
            {r.nom}
            <span className="rounded-md bg-[#e6eeff] px-2 py-0.5 text-[13px] font-medium text-navy-800">{isKnownRole(r.role) ? t(`ecoleProfil.avis.roles.${roleKeys[r.role]}`) : r.role}</span>
          </p>
          <p className="mt-1 flex items-center gap-2 text-[14px] text-ink">
            <Stars value={r.note} size="sm" />· {r.date}
          </p>
        </div>
      </div>
      <p className="flex-1 border-line text-[14px] leading-snug text-navy-900 sm:border-l sm:pl-5">{r.texte}</p>
      <button type="button" onClick={() => setLiked(!liked)} className={cn('inline-flex items-center gap-2 px-3 text-[15px] font-semibold', liked ? 'text-brand-600' : 'text-navy-900')}>
        <ThumbsUp className={cn('size-5 text-brand-600', liked && 'fill-brand-600')} />
        {r.utile + (liked ? 1 : 0)}
      </button>
    </div>
  )
}
