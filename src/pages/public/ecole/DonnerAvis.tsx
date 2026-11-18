import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Building2, CalendarDays, CircleCheck, GraduationCap, Handshake, Info, PencilLine, Send, ShieldCheck, Star, UserRound, Car, Users, Briefcase } from 'lucide-react'
import { AEHeader } from '@/components/domain/autoecole'
import { Hero } from '@/components/domain/ecole'
import { Img } from '@/components/ui/Feedback'
import { etablissementById, slugOfType, isTypeSlug, typeConfig } from '@/mocks/ecoles'
import { autoEcoleById } from '@/mocks/autoecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const labels = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent']

const criteresAE: { nom: string; icon: ReactNode; defaut: number }[] = [
  { nom: 'Qualité de la formation', icon: <GraduationCap />, defaut: 5 },
  { nom: 'Compétence des moniteurs', icon: <UserRound />, defaut: 4 },
  { nom: 'Organisation & planning', icon: <CalendarDays />, defaut: 4 },
  { nom: 'Infrastructures & véhicules', icon: <Car />, defaut: 4 },
  { nom: 'Accueil & accompagnement', icon: <Handshake />, defaut: 5 },
]

const criteresEcole: { nom: string; icon: ReactNode; defaut: number }[] = [
  { nom: 'Qualité des enseignements', icon: <GraduationCap />, defaut: 5 },
  { nom: 'Compétence des enseignants', icon: <Users />, defaut: 4 },
  { nom: 'Organisation & administration', icon: <CalendarDays />, defaut: 4 },
  { nom: 'Infrastructures & équipements', icon: <Building2 />, defaut: 4 },
  { nom: 'Insertion professionnelle', icon: <Briefcase />, defaut: 5 },
]

function StarRow({ value, onChange, size }: { value: number; onChange: (v: number) => void; size: string }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" aria-label={`${i} étoile${i > 1 ? 's' : ''}`} onClick={() => onChange(i)}>
          <Star className={cn(size, i <= value ? 'fill-amber-400 text-amber-400' : 'fill-[#c9d4ea] text-[#c9d4ea]')} />
        </button>
      ))}
    </span>
  )
}

export default function DonnerAvis() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isAE = pathname.startsWith('/ecoles/auto-ecoles')
  const criteres = isAE ? criteresAE : criteresEcole
  const [note, setNote] = useState(4)
  const [sub, setSub] = useState<Record<string, number>>(Object.fromEntries(criteres.map((c) => [c.nom, c.defaut])))
  const [texte, setTexte] = useState('')
  const [confirm, setConfirm] = useState(true)

  let back: string
  let header: ReactNode
  if (isAE) {
    const a = autoEcoleById(id)
    back = `/ecoles/auto-ecoles/${a.id}/avis`
    header = (
      <AEHeader
        id={a.id}
        crumbs={[{ label: 'École', to: '/ecoles' }, { label: 'Auto-Écoles', to: '/ecoles/auto-ecoles' }, { label: a.nom, to: `/ecoles/auto-ecoles/${a.id}` }, { label: 'Avis', to: back }, { label: 'Donner mon avis' }]}
        image="/maquette/ae-hero-formations.jpg"
      />
    )
  } else {
    const e = etablissementById(id)
    const slug = slugOfType(e.type)
    back = `/ecoles/${slug}/etablissement/${e.id}/avis`
    header = (
      <Hero
        crumbs={[{ label: 'École', to: '/ecoles' }, { label: isTypeSlug(slug) ? typeConfig[slug].court : 'École', to: `/ecoles/${slug}` }, { label: e.nom, to: back.replace(/\/avis$/, '') }, { label: 'Avis', to: back }, { label: 'Donner mon avis' }]}
        icon={<PencilLine />}
        image="/maquette/fiche-hero.jpg"
        title={e.nom}
        subtitle="Votre avis aide les futurs apprenants à choisir leur établissement."
        className="[&_img]:w-[34%]"
      />
    )
  }

  const publish = () => {
    if (texte.trim().length < 10) return toast.error('Votre commentaire doit compter au moins 10 caractères.')
    if (!confirm) return toast.error(`Confirmez avoir suivi une formation dans cet${isAE ? 'te auto-école' : ' établissement'}.`)
    toast.success('Merci ! Votre avis sera publié après vérification par YIBOLO.')
    navigate(back)
  }

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      {header}
      <div className="grid gap-4 lg:grid-cols-[1fr_376px]">
        <div className={cn(card, 'space-y-4 p-5')}>
          <div className="border-b border-line pb-3">
            <h1 className="flex items-center gap-3 text-[28px] font-bold text-navy-900">
              <PencilLine className="size-8 text-brand-600" /> Donner mon avis
            </h1>
            <p className="ml-11 text-[16px] text-navy-900">Partagez votre expérience de formation pour aider les futurs apprenants.</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 border-b border-line pb-4">
            <span className="text-[17px] font-bold text-navy-900">
              Votre note globale <span className="text-rose-500">*</span>
            </span>
            <StarRow value={note} onChange={setNote} size="size-10" />
            <span className="rounded-lg bg-[#e6eeff] px-4 py-1.5 text-[17px] text-navy-900">
              <b>{note}/5</b> – {labels[note]}
            </span>
          </div>
          <div>
            <p className="text-[17px] font-bold text-navy-900">
              Évaluez les points suivants <span className="font-normal">(facultatif)</span>
            </p>
            <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
              {criteres.map((c) => (
                <div key={c.nom} className="flex items-center gap-3 rounded-xl bg-[#eef3fc] px-4 py-2 text-[15px] text-navy-900 [&>svg]:size-6 [&>svg]:text-brand-600">
                  {c.icon}
                  <span className="flex-1">{c.nom}</span>
                  <StarRow value={sub[c.nom] ?? 0} onChange={(v) => setSub({ ...sub, [c.nom]: v })} size="size-5" />
                </div>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[17px] font-bold text-navy-900">
              Votre commentaire <span className="text-rose-500">*</span>
            </span>
            <span className="relative block">
              <textarea
                rows={4}
                maxLength={500}
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder={`Décrivez brièvement votre expérience (ex. : qualité de la formation, ${isAE ? 'moniteurs, organisation, véhicules' : 'enseignants, organisation, équipements'}, etc.).`}
                className="w-full resize-none rounded-xl border border-[#c9d4ea] px-4 py-3 text-[15px] outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
              />
              <span className="absolute right-3 bottom-3 text-[13px] text-ink/70">{texte.length} / 500</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-[15px] text-navy-900">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="size-6 accent-brand-600" />
            Je confirme avoir suivi une formation dans cet{isAE ? 'te auto-école' : ' établissement'}.
          </label>
          <div className="grid gap-4 pt-1 sm:grid-cols-2">
            <button type="button" onClick={() => navigate(back)} className="h-12 rounded-xl border-2 border-brand-600/60 text-[18px] font-semibold text-navy-800 hover:bg-brand-50">
              Annuler
            </button>
            <button type="button" onClick={publish} className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[19px] font-semibold text-white hover:bg-brand-700">
              <Send className="size-6" />
              Publier mon avis
            </button>
          </div>
        </div>
        <aside className="space-y-4">
          <div className={cn(card, 'p-5')}>
            <h2 className="flex items-center gap-3 border-b border-line pb-3 text-[22px] font-bold text-navy-900">
              <Info className="size-8 text-brand-600" /> Quelques conseils
            </h2>
            <ul className="mt-3 space-y-3">
              {['Soyez honnête et constructif.', 'Évaluez les aspects les plus importants.', 'Restez courtois et respectueux.'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15px] text-navy-900">
                  <CircleCheck className="size-6 shrink-0 fill-emerald-600 text-white" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className={cn(card, 'p-5')}>
            <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900">
              <ShieldCheck className="size-8 text-brand-600" /> Avis vérifié
            </h2>
            <p className="mt-2 text-[15.5px] text-navy-900">Votre avis sera marqué « Vérifié » après validation par YIBOLO (inscription ou formation confirmée).</p>
          </div>
          <Img src="/maquette/avis-illustration.jpg" alt="" className="h-[208px] w-full rounded-2xl" />
        </aside>
      </div>
    </div>
  )
}
