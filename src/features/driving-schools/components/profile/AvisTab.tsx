import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { BadgeCheck, Building2, CalendarDays, ChevronRight, CircleGauge, Flag, Handshake, MessageCircle, PencilLine, Share2, Star, Users } from 'lucide-react'
import { Heading } from '@/features/driving-schools/components/profile/ProfileParts'
import { card, criteriaKeys, reviewDate } from '@/features/driving-schools/components/profile/profileUtils'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Img } from '@/shared/components/ui/Img'
import { Stars, PasEncoreDAvis } from '@/shared/components/ui/StarRating'
import { useAutoEcole, useAvisAutoEcole, useCriteresAutoEcole, useRepartitionAutoEcole } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { num, shortDate } from '@/shared/utils/format'
import { notifier } from '@/shared/utils/notifications'
import type { AvisAutoEcole } from '@/shared/types'
import { MenuActions } from '@/shared/components/ui/MenuActions'
import { Modal } from '@/shared/components/ui/Modal'
import { data } from '@/data'
import { partager } from '@/shared/utils/liens'
import { useSession } from '@/features/auth/hooks/useSession'
import { ModaleAvis } from '@/features/schools/components/ModaleAvis'

/** La date du jour, comme celle des réponses de la maquette (appelée hors du rendu). */
const aujourdhui = () => shortDate(new Date(), { day: '2-digit', month: 'short', year: 'numeric' })

const critereIcons = [CircleGauge, Users, CalendarDays, Building2, Handshake]

/** Onglet « Avis » de la fiche d'une auto-école. */
export function AvisTab({ id }: { id: string }) {
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(id)
  // « Donner un avis » depuis Mon espace arrive ici avec ?donner=1 : la fenêtre s'ouvre d'emblée.
  const [donnerAvis, setDonnerAvis] = useState(useSearchParams()[0].get('donner') === '1')
  // Répartition et critères tirés des avis de cette auto-école.
  const repartitionAutoEcole = useRepartitionAutoEcole(a.id)
  const criteresAvis = useCriteresAutoEcole(a.id)
  const [tri, setTri] = useState<'recents' | 'mieuxNotes'>('recents')
  const [signale, setSignale] = useState<string | null>(null)
  const [motif, setMotif] = useState<'inappropriate' | 'false' | 'spam' | 'other'>('inappropriate')
  const { account } = useSession()
  const avis = [...useAvisAutoEcole(a.id)].sort((x, y) => (tri === 'mieuxNotes' ? y.note - x.note : 0))
  const colors = ['bg-emerald-600', 'bg-emerald-400', 'bg-amber-300', 'bg-orange-400', 'bg-rose-500']
  const starColors = ['fill-emerald-600 text-emerald-600', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400', 'fill-amber-400 text-amber-400']
  return (
    <div className="grid gap-4 lg:grid-cols-[350px_1fr]">
      <div className={cn(card, 'h-fit p-4')}>
        <Heading icon={<Star className="!fill-none" />}>{t('profile.reviews.overall')}</Heading>
        <div className="text-center">
          {a.avis > 0 ? (
            <>
              <p className="text-[44px] leading-tight font-extrabold text-navy-900">
                {num(a.note)}
                <span className="text-[28px] font-semibold">/5</span>
              </p>
              <Stars value={a.note} size="lg" />
              <p className="mt-1 text-[15px] text-brand-700">{t('profile.reviews.basedOn', { count: a.avis })}</p>
            </>
          ) : (
            <p className="py-4 text-[17px] text-navy-900">
              <PasEncoreDAvis />
            </p>
          )}
        </div>
        <ul className="mt-3 space-y-1 border-b border-line pb-3">
          {repartitionAutoEcole.map((r, i) => (
            <li key={r.etoiles} className="flex items-center gap-2 text-[14px] font-semibold text-navy-900">
              <span className="w-3">{r.etoiles}</span>
              <Star className={cn('size-4', starColors[i])} />
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#e6ecf7]">
                <span className={cn('block h-full rounded-full', colors[i])} style={{ width: `${r.pct}%` }} />
              </span>
              <span className="w-10 text-right font-normal">{t('profile.reviews.percent', { value: r.pct })}</span>
            </li>
          ))}
        </ul>
        <ul className="divide-y divide-line">
          {criteresAvis.map((c, i) => {
            const Icon = critereIcons[i]
            const key = criteriaKeys[i]
            return (
              <li key={c.nom} className="flex items-center gap-3 py-1.5 text-[14px] text-navy-900">
                <Icon className="size-5 text-brand-600" />
                <span className="flex-1">{key ? t(`profile.reviews.criteria.${key}`) : c.nom}</span>
                <b>{num(c.note)}</b>
              </li>
            )
          })}
        </ul>
        <button type="button" onClick={() => setDonnerAvis(true)} className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-brand-600 text-[19px] font-semibold text-white hover:bg-brand-700">
          <PencilLine className="size-6" />
          {t('profile.reviews.give')}
        </button>
        <ModaleAvis genre="auto-ecole" id={a.id} open={donnerAvis} onClose={() => setDonnerAvis(false)} />
      </div>
      <div className={cn(card, 'space-y-3 p-4')}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Heading icon={<MessageCircle />} className="text-[25px] [&_svg]:size-9">{t('profile.reviews.title', { count: a.avis })}</Heading>
          <label className="relative">
            <select aria-label={t('profile.reviews.sort')} value={tri} onChange={(e) => setTri(e.target.value as 'recents' | 'mieuxNotes')} className="h-10 appearance-none rounded-xl border border-[#c9d4ea] bg-white pr-9 pl-3 text-[14px] text-navy-900">
              <option value="recents">{t('profile.reviews.mostRecent')}</option>
              <option value="mieuxNotes">{t('profile.reviews.bestRated')}</option>
            </select>
            <ChevronRight className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 rotate-90" />
          </label>
        </div>
        {avis.map((r) => (
          <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-line p-3 sm:flex-row">
            <div className="flex items-center gap-3 sm:w-[270px]">
              {/* Un avis de visiteur n’a pas de photo : initiales. */}
              {r.avatar ? <Img src={r.avatar} alt={r.nom} className="size-[62px] rounded-full" /> : <Avatar name={r.nom} size={62} />}
              <div>
                <p className="flex items-center gap-1.5 text-[16px] font-bold text-navy-900">
                  {r.nom}
                  <BadgeCheck className="size-5 fill-brand-600 text-white" />
                </p>
                <p className="text-[14.5px] text-navy-800">{reviewDate(t, r.date)}</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="flex items-center gap-2 text-[15px] font-semibold text-navy-900">
                <Stars value={r.note} size="md" />
                {r.note}/5
              </p>
              <p className="mt-1 text-[14px] text-navy-900">{r.texte}</p>
              <ReponseAvis r={r} nomAutoEcole={a.nom} peutRepondre={account?.role === 'auto-ecole' && account.ecoleId === a.id} />
            </div>
            <MenuActions
              label={t('profile.reviews.more')}
              className="self-start bg-transparent"
              actions={[
                { label: t('profile.reviews.share'), icon: <Share2 />, onClick: async () => { const r2 = await partager(a.nom, window.location.href); toast.success(t(r2 === 'copie' ? 'profile.reviews.linkCopied' : 'profile.reviews.shared')) } },
                { label: t('profile.reviews.report'), icon: <Flag />, onClick: () => setSignale(r.id) },
              ]}
            />
          </div>
        ))}
      </div>
      <Modal
        open={signale !== null}
        onClose={() => setSignale(null)}
        title={t('profile.reviews.reportTitle')}
        icon={<Flag className="mt-0.5 size-5 text-rose-600" />}
        footer={
          <>
            <button type="button" onClick={() => setSignale(null)} className="h-10 rounded-full border border-line px-5 font-semibold text-navy-800">{t('profile.reviews.cancel')}</button>
            <button
              type="button"
              onClick={async () => {
                if (!signale) return
                await data.create('signalementsAvis', { avisId: signale, cible: 'auto-ecole', compteId: account?.id, motif, le: new Date().toISOString() }, 'signalement')
                setSignale(null)
                toast.success(t('profile.reviews.reported'))
              }}
              className="h-10 rounded-full bg-rose-600 px-5 font-semibold text-white hover:bg-rose-700"
            >
              {t('profile.reviews.send')}
            </button>
          </>
        }
      >
        <p className="text-sm text-muted">{t('profile.reviews.reportIntro')}</p>
        <div className="mt-3 space-y-2">
          {(['inappropriate', 'false', 'spam', 'other'] as const).map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2.5 text-[14.5px] text-navy-900">
              <input type="radio" name="motif" checked={motif === m} onChange={() => setMotif(m)} className="size-4 accent-brand-600" />
              {t(`profile.reviews.motifs.${m}`)}
            </label>
          ))}
        </div>
      </Modal>
    </div>
  )
}

/**
 * La réponse de l'auto-école à un avis : affichée à tous ; l'auto-école
 * connectée peut répondre, modifier ou retirer sa réponse. L'auteur est prévenu.
 */
function ReponseAvis({ r, nomAutoEcole, peutRepondre }: { r: AvisAutoEcole; nomAutoEcole: string; peutRepondre: boolean }) {
  const { t } = useTranslation('driving-schools')
  const [edition, setEdition] = useState(false)
  const [texte, setTexte] = useState(r.reponse?.texte ?? '')
  const publier = async () => {
    if (texte.trim().length < 2) return void toast.error(t('profile.reviews.reply.tooShort'))
    await data.update('avisAutoEcoles', r.id, { reponse: { texte: texte.trim(), le: aujourdhui() } })
    if (r.compteId && !r.reponse)
      await notifier(r.compteId, { type: 'review', titre: t('profile.reviews.reply.notificationTitre'), texte: t('profile.reviews.reply.notificationTexte', { school: nomAutoEcole }), quand: t('profile.reviews.reply.quand'), vers: window.location.pathname })
    setEdition(false)
    toast.success(t('profile.reviews.reply.published'))
  }
  const retirer = async () => {
    await data.update('avisAutoEcoles', r.id, { reponse: undefined })
    setTexte('')
    toast.success(t('profile.reviews.reply.removed'))
  }
  return (
    <>
      {r.reponse && !edition && (
        <div className="mt-2 rounded-xl border-l-4 border-brand-600 bg-[#f3f6fc] px-3 py-2 text-[13.5px] text-navy-900">
          <p className="font-semibold text-brand-700">{t('profile.reviews.replyFrom')} · <span className="font-normal text-muted">{r.reponse.le}</span></p>
          <p>{r.reponse.texte}</p>
        </div>
      )}
      {peutRepondre && !edition && (
        <div className="mt-2 flex gap-3">
          <button type="button" onClick={() => setEdition(true)} className="text-[14px] font-semibold text-brand-600 hover:underline">{r.reponse ? t('profile.reviews.reply.edit') : t('profile.reviews.reply.reply')}</button>
          {r.reponse && <button type="button" onClick={() => void retirer()} className="text-[14px] font-semibold text-rose-600 hover:underline">{t('profile.reviews.reply.remove')}</button>}
        </div>
      )}
      {edition && (
        <div className="mt-2 space-y-2">
          <textarea value={texte} onChange={(ev) => setTexte(ev.target.value)} rows={3} aria-label={t('profile.reviews.reply.label')} placeholder={t('profile.reviews.reply.placeholder')} className="w-full rounded-xl border border-line p-3 text-[14px] focus:border-brand-500 focus:ring-3 focus:ring-brand-100" />
          <div className="flex gap-2">
            <button type="button" onClick={() => void publier()} className="h-9 rounded-full bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700">{t('profile.reviews.reply.publish')}</button>
            <button type="button" onClick={() => (setEdition(false), setTexte(r.reponse?.texte ?? ''))} className="h-9 rounded-full border border-line px-5 text-[14px] font-semibold text-navy-800">{t('profile.reviews.cancel')}</button>
          </div>
        </div>
      )}
    </>
  )
}
