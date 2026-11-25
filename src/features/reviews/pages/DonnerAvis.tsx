import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Building2, CalendarDays, CircleCheck, GraduationCap, Handshake, Info, PencilLine, Send, ShieldCheck, Star, UserRound, Car, Users, Briefcase } from 'lucide-react'
import { AEHeader } from '@/features/driving-schools/components/AutoEcoleBlocks'
import { Hero } from '@/shared/components/ui/Hero'
import { Img } from '@/shared/components/ui/Img'
import { useSession } from '@/features/auth/hooks/useSession'
import { data } from '@/data'
import { useAutoEcole, useEtablissement } from '@/data/hooks'
import { slugOfType, isTypeSlug } from '@/features/schools/schoolTypes'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { ajusterIndicateurs } from '@/shared/utils/compteurs'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
/** Libellé de chaque note, de 1 à 5 étoiles. */
const labels = ['decevant', 'moyen', 'bien', 'tresBien', 'excellent'] as const

type CritereKey =
  | 'qualiteFormation'
  | 'competenceMoniteurs'
  | 'organisationPlanning'
  | 'infrastructuresVehicules'
  | 'accueilAccompagnement'
  | 'qualiteEnseignements'
  | 'competenceEnseignants'
  | 'organisationAdministration'
  | 'infrastructuresEquipements'
  | 'insertionPro'

const criteresAE: { key: CritereKey; icon: ReactNode; defaut: number }[] = [
  { key: 'qualiteFormation', icon: <GraduationCap />, defaut: 5 },
  { key: 'competenceMoniteurs', icon: <UserRound />, defaut: 4 },
  { key: 'organisationPlanning', icon: <CalendarDays />, defaut: 4 },
  { key: 'infrastructuresVehicules', icon: <Car />, defaut: 4 },
  { key: 'accueilAccompagnement', icon: <Handshake />, defaut: 5 },
]

const criteresEcole: { key: CritereKey; icon: ReactNode; defaut: number }[] = [
  { key: 'qualiteEnseignements', icon: <GraduationCap />, defaut: 5 },
  { key: 'competenceEnseignants', icon: <Users />, defaut: 4 },
  { key: 'organisationAdministration', icon: <CalendarDays />, defaut: 4 },
  { key: 'infrastructuresEquipements', icon: <Building2 />, defaut: 4 },
  { key: 'insertionPro', icon: <Briefcase />, defaut: 5 },
]

const conseils = ['honnete', 'aspects', 'courtois'] as const

function StarRow({ value, onChange, size }: { value: number; onChange: (v: number) => void; size: string }) {
  const { t } = useTranslation('reviews')
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" aria-label={t('donnerAvis.etoiles', { count: i })} onClick={() => onChange(i)} className="grid min-h-10 min-w-10 place-items-center">
          <Star className={cn(size, i <= value ? 'fill-amber-400 text-amber-400' : 'fill-[#c9d4ea] text-[#c9d4ea]')} />
        </button>
      ))}
    </span>
  )
}

export function DonnerAvis() {
  const { t } = useTranslation('reviews')
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isAE = pathname.startsWith(ROUTES.drivingSchools)
  const criteres = isAE ? criteresAE : criteresEcole
  const [note, setNote] = useState(4)
  const [sub, setSub] = useState<Record<string, number>>(Object.fromEntries(criteres.map((c) => [c.key, c.defaut])))
  const [texte, setTexte] = useState('')
  const [confirm, setConfirm] = useState(true)
  const label = labels[note - 1]
  const { account } = useSession()
  // Les deux lectures sont faites à chaque fois (règle des hooks) ; seule celle du bon univers sert.
  const a = useAutoEcole(id)
  const e = useEtablissement(id)

  let back: string
  let header: ReactNode
  if (isAE) {
    back = ROUTES.drivingSchool(a.id, 'avis')
    header = (
      <AEHeader
        id={a.id}
        crumbs={[
          { label: t('donnerAvis.crumbs.ecole'), to: ROUTES.schools },
          { label: t('donnerAvis.crumbs.autoEcoles'), to: ROUTES.drivingSchools },
          { label: a.nom, to: ROUTES.drivingSchool(a.id) },
          { label: t('donnerAvis.crumbs.avis'), to: back },
          { label: t('donnerAvis.crumbs.donnerAvis') },
        ]}
        image="/images/maquette/ae-hero-formations.jpg"
      />
    )
  } else {
    const slug = slugOfType(e.type)
    back = ROUTES.school(slug, e.id, 'avis')
    header = (
      <Hero
        crumbs={[
          { label: t('donnerAvis.crumbs.ecole'), to: ROUTES.schools },
          { label: isTypeSlug(slug) ? t(`donnerAvis.types.${slug}`) : t('donnerAvis.crumbs.ecole'), to: ROUTES.schoolType(slug) },
          { label: e.nom, to: ROUTES.school(slug, e.id) },
          { label: t('donnerAvis.crumbs.avis'), to: back },
          { label: t('donnerAvis.crumbs.donnerAvis') },
        ]}
        icon={<PencilLine />}
        image="/images/maquette/fiche-hero.jpg"
        title={e.nom}
        subtitle={t('donnerAvis.heroSubtitle')}
        className="[&_img]:w-[34%]"
      />
    )
  }

  const publish = async () => {
    if (texte.trim().length < 10) return toast.error(t('donnerAvis.toasts.tropCourt'))
    if (!confirm) return toast.error(isAE ? t('donnerAvis.toasts.confirmAutoEcole') : t('donnerAvis.toasts.confirmEcole'))
    // Auteur : le compte connecté, sinon « Visiteur ». La date est un texte, comme les avis de la maquette.
    const auteur = { compteId: account?.id, nom: account?.name ?? t('donnerAvis.visiteur'), avatar: account?.avatar ?? '', date: t('donnerAvis.aLInstant'), note, texte: texte.trim() }
    // La note moyenne et le nombre d'avis suivent le nouvel avis.
    const moyenne = (n: number, total: number) => Math.round(((n * total + note) / (total + 1)) * 10) / 10
    if (isAE) {
      await data.create('avisAutoEcoles', { ...auteur, autoEcoleId: a.id, criteres: criteres.map((c) => sub[c.key] ?? c.defaut) }, 'avis')
      await data.update('autoEcoles', a.id, { avis: a.avis + 1, note: moyenne(a.note, a.avis) })
    } else {
      await data.create('avisEtablissements', { ...auteur, etablissementId: e.id, role: 'Étudiant', utile: 0 }, 'avis')
      await data.update('etablissements', e.id, { avis: e.avis + 1, note: moyenne(e.note, e.avis) })
      await ajusterIndicateurs(e.id, { activite: 'reviews' })
      await data.create('notifications', { etablissementId: e.id, type: 'avis', titre: t('donnerAvis.notification.titre'), texte: t('donnerAvis.notification.texte', { name: auteur.nom, note }), date: t('donnerAvis.aLInstant'), lu: false }, 'notification')
    }
    toast.success(t('donnerAvis.toasts.merci'))
    navigate(back)
  }

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      {header}
      <div className="grid gap-4 lg:grid-cols-[1fr_376px]">
        <div className={cn(card, 'space-y-4 p-5')}>
          <div className="border-b border-line pb-3">
            <h1 className="flex items-center gap-3 text-[28px] font-bold text-navy-900">
              <PencilLine className="size-8 text-brand-600" /> {t('donnerAvis.title')}
            </h1>
            <p className="ml-11 text-[16px] text-navy-900">{t('donnerAvis.intro')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 border-b border-line pb-4">
            <span className="text-[17px] font-bold text-navy-900">
              {t('donnerAvis.noteGlobale')} <span className="text-rose-500">*</span>
            </span>
            <StarRow value={note} onChange={setNote} size="size-10" />
            <span className="rounded-lg bg-[#e6eeff] px-4 py-1.5 text-[17px] text-navy-900">
              <b>{note}/5</b> – {label && t(`donnerAvis.notes.${label}`)}
            </span>
          </div>
          <div>
            <p className="text-[17px] font-bold text-navy-900">
              {t('donnerAvis.criteresTitre')} <span className="font-normal">{t('donnerAvis.facultatif')}</span>
            </p>
            <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
              {criteres.map((c) => (
                <div key={c.key} className="flex items-center gap-3 rounded-xl bg-[#eef3fc] px-4 py-2 text-[15px] text-navy-900 [&>svg]:size-6 [&>svg]:text-brand-600">
                  {c.icon}
                  <span className="flex-1">{t(`donnerAvis.criteres.${c.key}`)}</span>
                  <StarRow value={sub[c.key] ?? 0} onChange={(v) => setSub({ ...sub, [c.key]: v })} size="size-5" />
                </div>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[17px] font-bold text-navy-900">
              {t('donnerAvis.commentaire')} <span className="text-rose-500">*</span>
            </span>
            <span className="relative block">
              <textarea
                rows={4}
                maxLength={500}
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder={isAE ? t('donnerAvis.placeholder.autoEcole') : t('donnerAvis.placeholder.ecole')}
                className="w-full resize-none rounded-xl border border-[#c9d4ea] px-4 py-3 text-[15px] outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
              />
              <span className="absolute right-3 bottom-3 text-[13px] text-ink/70">{texte.length} / 500</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-[15px] text-navy-900">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="size-6 accent-brand-600" />
            {isAE ? t('donnerAvis.confirm.autoEcole') : t('donnerAvis.confirm.ecole')}
          </label>
          <div className="grid gap-4 pt-1 sm:grid-cols-2">
            <button type="button" onClick={() => navigate(back)} className="h-12 rounded-xl border-2 border-brand-600/60 text-[18px] font-semibold text-navy-800 hover:bg-brand-50">
              {t('donnerAvis.annuler')}
            </button>
            <button type="button" onClick={publish} className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[19px] font-semibold text-white hover:bg-brand-700">
              <Send className="size-6" />
              {t('donnerAvis.publier')}
            </button>
          </div>
        </div>
        <aside className="space-y-4">
          <div className={cn(card, 'p-5')}>
            <h2 className="flex items-center gap-3 border-b border-line pb-3 text-[22px] font-bold text-navy-900">
              <Info className="size-8 text-brand-600" /> {t('donnerAvis.conseils.titre')}
            </h2>
            <ul className="mt-3 space-y-3">
              {conseils.map((k) => (
                <li key={k} className="flex items-center gap-3 text-[15px] text-navy-900">
                  <CircleCheck className="size-6 shrink-0 fill-emerald-600 text-white" />
                  {t(`donnerAvis.conseils.${k}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className={cn(card, 'p-5')}>
            <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900">
              <ShieldCheck className="size-8 text-brand-600" /> {t('donnerAvis.verifie.titre')}
            </h2>
            <p className="mt-2 text-[15.5px] text-navy-900">{t('donnerAvis.verifie.texte')}</p>
          </div>
          <Img src="/images/maquette/avis-illustration.jpg" alt="" className="h-[208px] w-full rounded-2xl" />
        </aside>
      </div>
    </div>
  )
}
