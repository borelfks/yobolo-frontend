import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Briefcase, ChevronDown, GraduationCap, MessageCircle, PencilLine, Star, ThumbsUp, Users } from 'lucide-react'
import { Img } from '@/shared/ui/Img'
import { Stars, PasEncoreDAvis } from '@/shared/ui/StarRating'
import { Select } from '@/shared/forms/Fields'
import { card } from '@/modules/ecole/etablissements/components/profile/profileShared'
import { useAvisEtablissement, useEtablissement, useRepartitionEtablissement } from '@/data/hooks'
import { data } from '@/data'
import { load, save } from '@/shared/utils/storage'
import type { AvisEtablissement } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num, shortDate } from '@/shared/utils/format'
import { notifier } from '@/shared/utils/notifications'
import { ModaleAvis } from '@/modules/ecole/etablissements/components/ModaleAvis'
import { toast } from 'sonner'
import { useSession } from '@/modules/compte/auth/hooks/useSession'

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
type Filtre = 'tous' | 'etudiants' | 'anciens' | 'entreprises'
type Tri = 'recents' | 'mieuxNotes' | 'utiles'
const TRIS: Tri[] = ['recents', 'mieuxNotes', 'utiles']
/** Nombre d'avis affichés, puis ajoutés à chaque « Voir plus ». */
const PAR_PAGE = 3

export function AvisTab({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(id)
  const [donnerAvis, setDonnerAvis] = useState(false)
  const avis = useAvisEtablissement(e.id)
  // Répartition tirée des avis de cet établissement.
  const repartitionNotes = useRepartitionEtablissement(e.id)
  // L'établissement connecté répond à ses avis depuis sa fiche publique.
  const { account } = useSession()
  const [f, setF] = useState<Filtre>('tous')
  const [tri, setTri] = useState<Tri>('recents')
  const [visibles, setVisibles] = useState(PAR_PAGE)
  // Les filtres comptent les avis enregistrés de chaque profil.
  const deProfil = (x: Filtre) => (x === 'tous' ? avis : avis.filter((a) => (x === 'etudiants' ? a.role.startsWith('Étudiant') : x === 'anciens' ? a.role.startsWith('Ancien') : a.role === 'Entreprise')))
  const list = [...deProfil(f)].sort((a, b) => (tri === 'mieuxNotes' ? b.note - a.note : tri === 'utiles' ? b.utile - a.utile : 0))
  const filtres = [
    { value: 'tous' as const, label: t('ecoleProfil.avis.filters.tous', { n: avis.length }), icon: null },
    { value: 'etudiants' as const, label: t('ecoleProfil.avis.filters.etudiants', { n: deProfil('etudiants').length }), icon: <GraduationCap /> },
    { value: 'anciens' as const, label: t('ecoleProfil.avis.filters.anciens', { n: deProfil('anciens').length }), icon: <Briefcase /> },
    { value: 'entreprises' as const, label: t('ecoleProfil.avis.filters.entreprises', { n: deProfil('entreprises').length }), icon: <Users /> },
  ]
  return (
    <div className="grid gap-5 lg:grid-cols-[324px_1fr]">
      <div className={cn(card, 'h-fit p-5')}>
        <p className="text-center text-[20px] font-bold text-navy-900">{t('ecoleProfil.avis.globalRating')}</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <Laurel />
          <div className="text-center">
            {e.avis > 0 ? (
              <>
                <p className="flex items-baseline gap-1 text-[44px] leading-none font-extrabold text-navy-900">
                  <Star className="mr-1 size-9 self-center fill-amber-400 text-amber-400" />
                  {num(e.note)}
                  <span className="text-[24px] font-semibold">/5</span>
                </p>
                <p className="mt-1 text-[14px] text-ink">{t('shared.ratingCount', { count: e.avis })}</p>
              </>
            ) : (
              <p className="py-3 text-[17px] text-navy-900">
                <PasEncoreDAvis />
              </p>
            )}
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
        <button type="button" onClick={() => setDonnerAvis(true)} className="mt-5 flex h-12 w-full items-center justify-center gap-2.5 rounded-full border-2 border-brand-600/70 text-[17px] font-semibold text-navy-800 hover:bg-brand-50">
          <PencilLine className="size-5" />
          {t('ecoleProfil.avis.giveReview')}
        </button>
        <ModaleAvis genre="etablissement" id={e.id} open={donnerAvis} onClose={() => setDonnerAvis(false)} />
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 text-[22px] font-bold text-navy-900">
            <MessageCircle className="size-7 fill-brand-600 text-white" /> {t('ecoleProfil.avis.learnersReviews', { n: e.avis })}
          </h2>
          <span className="flex items-center gap-2 text-sm">
            {t('shared.sortBy')}
            <span className="w-44"><Select aria-label={t('shared.sortByAria')} value={tri} onChange={(ev) => setTri(ev.target.value as Tri)} options={TRIS.map((x) => ({ value: x, label: t(`ecoleProfil.avis.sort.${x}`) }))} className="h-10" /></span>
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {filtres.map((x) => (
            <button
              key={x.value}
              type="button"
              onClick={() => (setF(x.value), setVisibles(PAR_PAGE))}
              className={cn('inline-flex h-10 items-center gap-2 rounded-full px-5 text-[15px] font-semibold [&_svg]:size-5', f === x.value ? 'bg-brand-600 text-white' : 'border border-line bg-white text-navy-900 hover:bg-brand-50')}
            >
              {x.icon}
              {x.label}
            </button>
          ))}
        </div>
        {list.slice(0, visibles).map((r) => (
          <AvisLine key={r.id} r={r} ecole={e.sigle || e.nom} peutRepondre={account?.ecoleId === e.id} />
        ))}
        {list.length === 0 && <p className="rounded-2xl border border-line bg-white p-5 text-center text-[15px] text-muted-foreground">{t('ecoleProfil.avis.none')}</p>}
        {list.length > visibles && (
          <div className="flex justify-center pt-1">
            <button type="button" onClick={() => setVisibles((v) => v + PAR_PAGE)} className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-brand-600/60 bg-white px-11 text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
              {t('ecoleProfil.avis.seeMore', { n: list.length - visibles })}
              <ChevronDown className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AvisLine({ r, ecole, peutRepondre }: { r: AvisEtablissement; ecole: string; peutRepondre: boolean }) {
  const { t } = useTranslation('schools')
  const [repondre, setRepondre] = useState(false)
  const [texte, setTexte] = useState(r.reponse?.texte ?? '')
  const publier = async () => {
    if (texte.trim().length < 2) return void toast.error(t('ecoleProfil.avis.reply.tooShort'))
    await data.update('avisEtablissements', r.id, { reponse: { texte: texte.trim(), le: shortDate(new Date(), { day: '2-digit', month: 'short', year: 'numeric' }) } })
    // L'auteur de l'avis est prévenu, s'il a un compte (une première réponse seulement).
    if (r.compteId && !r.reponse)
      await notifier(r.compteId, {
        type: 'review',
        titre: t('ecoleProfil.avis.reply.notification.titre'),
        texte: t('ecoleProfil.avis.reply.notification.texte', { school: ecole }),
        quand: t('ecoleProfil.avis.reply.notification.quand'),
        // La fiche de l'établissement, onglet Avis, où la réponse est publiée.
        vers: window.location.pathname,
      })
    setRepondre(false)
    toast.success(t('ecoleProfil.avis.reply.published'))
  }
  const retirer = async () => {
    await data.update('avisEtablissements', r.id, { reponse: undefined })
    setTexte('')
    toast.success(t('ecoleProfil.avis.reply.removed'))
  }
  // « Utile » : le nombre est enregistré dans la base ; ce navigateur retient qu'il a déjà voté.
  const [liked, setLiked] = useState(() => load<string[]>('avis-utiles', []).includes(r.id))
  const voter = async () => {
    const votes = load<string[]>('avis-utiles', [])
    const suivant = !liked
    setLiked(suivant)
    save('avis-utiles', suivant ? [...votes, r.id] : votes.filter((x) => x !== r.id))
    await data.update('avisEtablissements', r.id, { utile: Math.max(0, r.utile + (suivant ? 1 : -1)) })
  }
  return (
    <div className={cn(card, 'p-3')}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
      <button type="button" aria-pressed={liked} aria-label={t('ecoleProfil.avis.useful')} onClick={() => void voter()} className={cn('inline-flex items-center gap-2 px-3 text-[15px] font-semibold', liked ? 'text-brand-600' : 'text-navy-900')}>
        <ThumbsUp className={cn('size-5 text-brand-600', liked && 'fill-brand-600')} />
        {r.utile}
      </button>
    </div>
      {r.reponse && !repondre && (
        <div className="mt-3 rounded-xl border-l-4 border-brand-600 bg-[#f3f6fc] px-4 py-2.5 text-[14px] text-navy-900 sm:ml-[310px]">
          <p className="font-semibold text-brand-700">{t('ecoleProfil.avis.reply.from')} · <span className="font-normal text-muted-foreground">{r.reponse.le}</span></p>
          <p className="mt-0.5">{r.reponse.texte}</p>
        </div>
      )}
      {peutRepondre && !repondre && (
        <div className="mt-2 flex gap-3 sm:ml-[310px]">
          <button type="button" onClick={() => setRepondre(true)} className="text-[14px] font-semibold text-brand-600 hover:underline">{r.reponse ? t('ecoleProfil.avis.reply.edit') : t('ecoleProfil.avis.reply.reply')}</button>
          {r.reponse && <button type="button" onClick={() => void retirer()} className="text-[14px] font-semibold text-rose-600 hover:underline">{t('ecoleProfil.avis.reply.remove')}</button>}
        </div>
      )}
      {repondre && (
        <div className="mt-3 space-y-2 sm:ml-[310px]">
          <textarea value={texte} onChange={(ev) => setTexte(ev.target.value)} rows={3} aria-label={t('ecoleProfil.avis.reply.label')} placeholder={t('ecoleProfil.avis.reply.placeholder')} className="w-full rounded-xl border border-line p-3 text-[14px] outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100" />
          <div className="flex gap-2">
            <button type="button" onClick={() => void publier()} className="h-9 rounded-full bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700">{t('ecoleProfil.avis.reply.publish')}</button>
            <button type="button" onClick={() => (setRepondre(false), setTexte(r.reponse?.texte ?? ''))} className="h-9 rounded-full border border-line px-5 text-[14px] font-semibold text-navy-800">{t('ecoleProfil.avis.reply.cancel')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
