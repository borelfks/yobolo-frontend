import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import {
  BookOpenText,
  Bus,
  CalendarDays,
  Car,
  CircleCheck,
  ClipboardList,
  Coins,
  FileText,
  GraduationCap,
  Heart,
  Info,
  Layers,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Target,
  Timer,
  Truck,
  Users,
  Bike,
  ArrowRight,
} from 'lucide-react'
import { AEHeader, FavoriteModal } from '@/components/domain/autoecole'
import { Img } from '@/components/ui/Feedback'
import { useFavorites } from '@/hooks/useFavorites'
import { autoEcoleById, permisCatalogue, sessions, type PermisCode } from '@/mocks/autoecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const soft = 'rounded-xl bg-[#f0f4fc]'

type Contenu = {
  sousTitre: string
  presTitre: string
  presentation: string
  programme: string[]
  conditions: string[]
  pieces: string[]
  inclus: string[]
  /** Prix affiché sur la page de détail (la maquette diffère parfois des listes). */
  prix: number
  contactRapide?: boolean
}

const piecesLourd = ['Copie de la CNI (ou pièce d’identité admise)', 'Copie du Permis B', '02 photos d’identité récentes', 'Certificat médical d’aptitude à la conduite']

/** Textes repris des pages Permis A, B, C et D de la maquette (img61 à img64). */
const contenus: Record<PermisCode, Contenu> = {
  A: {
    sousTitre: 'Formation complète pour conduire une motocyclette en toute sécurité.',
    presTitre: 'Présentation de la formation',
    presentation: 'Le Permis A vous habilite à conduire une motocyclette (deux-roues) en toute sécurité, conformément à la réglementation en vigueur au Cameroun.',
    programme: ['Règles, signalisation et sécurité', 'Maîtrise du deux-roues et circulation', 'Prévention des risques et bons réflexes', 'Tests blancs et mises en situation réelles'],
    conditions: ['Être âgé(e) d’au moins 18 ans', 'Savoir lire et écrire le français', 'Être apte médicalement à la conduite'],
    pieces: ['CNI (copie) ou acte de naissance', '02 photos d’identité récentes', 'Certificat médical d’aptitude à la conduite'],
    inclus: ['Cours de code', 'Leçons de conduite', 'Accompagnement à l’examen'],
    prix: 150000,
    contactRapide: true,
  },
  B: {
    sousTitre: 'Formation complète pour conduire une voiture en toute sécurité et obtenir votre permis.',
    presTitre: 'Présentation',
    presentation: 'Le Permis B vous permet de conduire un véhicule léger (voiture) et de circuler en toute sécurité, conformément à la réglementation en vigueur au Cameroun.',
    programme: ['Règles, signalisation et législation', 'Maîtrise du véhicule et mise en circulation', 'Prévention des risques et éco-conduite', 'Tests blancs et mise en situation réelle'],
    conditions: ['Être âgé(e) d’au moins 18 ans', 'Savoir lire et écrire le français', 'Être apte médicalement à la conduite'],
    pieces: ['Copie de la CNI (ou pièce d’identité admise)', '02 photos d’identité récentes', 'Certificat médical d’aptitude à la conduite'],
    inclus: ['Cours de code (théorie)', 'Conduite pratique', 'Accompagnement à l’examen'],
    prix: 300000,
  },
  C: {
    sousTitre: 'Formation complète pour conduire un camion et exercer dans le transport de marchandises.',
    presTitre: 'Présentation',
    presentation: 'Le Permis C vous autorise à conduire un véhicule de transport de marchandises (camion, porteur) d’un poids total autorisé supérieur à 3,5 tonnes, conformément à la réglementation en vigueur au Cameroun.',
    programme: ['Règles, signalisation et réglementation', 'Maîtrise du poids lourd et manœuvres', 'Prévention des risques spécifiques au transport', 'Mises en situation et tests officiels'],
    conditions: ['Être âgé(e) d’au moins 21 ans', 'Être titulaire du Permis B', 'Être apte médicalement à la conduite'],
    pieces: piecesLourd,
    inclus: ['Cours de code (théorie)', 'Conduite pratique sur poids lourd', 'Accompagnement à l’examen'],
    prix: 500000,
  },
  D: {
    sousTitre: 'Formation complète pour conduire un véhicule de transport de personnes (bus, car, minibus).',
    presTitre: 'Présentation',
    presentation: 'Le Permis D vous autorise à conduire un véhicule de transport en commun de personnes (autobus, autocar, minibus), conformément à la réglementation en vigueur au Cameroun.',
    programme: ['Règles, signalisation et réglementation', 'Maîtrise du bus et transport en sécurité', 'Gestion des risques et responsabilité', 'Tests et mises en situation réelles'],
    conditions: ['Être âgé(e) d’au moins 21 ans', 'Être titulaire du Permis B', 'Aptitude médicale à la conduite'],
    pieces: piecesLourd,
    inclus: ['Cours de code (théorie)', 'Conduite pratique sur bus', 'Accompagnement à l’examen'],
    prix: 550000,
  },
  E: {
    sousTitre: 'Formation complète pour conduire avec une remorque lourde.',
    presTitre: 'Présentation',
    presentation: 'Le Permis E vous autorise à atteler une remorque lourde à un véhicule des catégories B, C ou D, conformément à la réglementation en vigueur au Cameroun.',
    programme: ['Règles, signalisation et réglementation', 'Attelage et manœuvres', 'Prévention des risques', 'Tests et mises en situation réelles'],
    conditions: ['Être âgé(e) d’au moins 21 ans', 'Être titulaire du Permis B ou C', 'Être apte médicalement à la conduite'],
    pieces: piecesLourd,
    inclus: ['Cours de code (théorie)', 'Conduite pratique avec remorque', 'Accompagnement à l’examen'],
    prix: 200000,
  },
}

const vehicleIcon: Record<PermisCode, typeof Car> = { A: Bike, B: Car, C: Truck, D: Bus, E: Truck }

function Heading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900 [&_svg]:size-7 [&_svg]:text-brand-600">{icon}{children}</h2>
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="mt-2.5 space-y-2">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-2.5 text-[15px] text-navy-900">
          <CircleCheck className="size-5 shrink-0 fill-emerald-600 text-white" />
          {t}
        </li>
      ))}
    </ul>
  )
}

export default function PermisDetail() {
  const { id, code = 'B', tab = '' } = useParams()
  const a = autoEcoleById(id)
  const c = (code.toUpperCase() as PermisCode) in permisCatalogue ? (code.toUpperCase() as PermisCode) : 'B'
  const p = permisCatalogue[c]
  const t = contenus[c]
  const base = `/ecoles/auto-ecoles/${a.id}/permis/${c}`
  const Vehicle = vehicleIcon[c]
  const tabs = [
    { value: '', label: 'Aperçu', icon: c === 'A' ? <HomeIcon /> : <Car /> },
    { value: 'programme', label: 'Programme', icon: <Layers /> },
    { value: 'conditions', label: 'Conditions', icon: <ClipboardList /> },
    { value: 'tarifs', label: 'Tarifs', icon: <Coins /> },
    { value: 'planning', label: 'Planning', icon: <CalendarDays /> },
  ]
  const steps = [
    { titre: 'Code de la route', icon: <BookOpenText /> },
    { titre: 'Conduite pratique', icon: <Vehicle /> },
    { titre: 'Sécurité routière', icon: <ShieldCheck /> },
    { titre: 'Préparation à l’examen', icon: c === 'A' ? <ClipboardList /> : <Target /> },
  ]
  const list = sessions.filter((s) => s.permis === c)
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <AEHeader
        id={a.id}
        crumbs={[{ label: 'École', to: '/ecoles' }, { label: 'Auto-Écoles', to: '/ecoles/auto-ecoles' }, { label: a.nom, to: `/ecoles/auto-ecoles/${a.id}` }, { label: `Permis ${c}` }]}
        title={`Permis ${c} – ${p.nom}`}
        subtitle={t.sousTitre}
        image={`/maquette/permis-hero-${c === 'E' ? 'C' : c}.jpg`}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_322px]">
        <div className="min-w-0 space-y-4">
          <nav className="flex flex-wrap gap-2.5">
            {tabs.map((x, i) => (
              <Link
                key={x.value}
                to={i === 0 ? base : `${base}/${x.value}`}
                className={cn(
                  'inline-flex h-11 flex-1 items-center justify-center gap-2.5 rounded-xl px-5 text-[15.5px] font-semibold whitespace-nowrap shadow-sm [&_svg]:size-6',
                  tab === x.value ? 'bg-brand-600 text-white shadow-brand-600/30' : 'bg-[#eaf0fb] text-navy-900 hover:bg-brand-100',
                )}
              >
                {x.icon}
                {x.label}
              </Link>
            ))}
          </nav>

          {(tab === '' || tab === 'programme') && (
            <>
              {tab === '' && (
                <div className={cn(card, 'flex flex-col gap-4 overflow-hidden p-4 md:flex-row md:items-center')}>
                  <div className="md:w-[46%]">
                    <Heading icon={<Info />}>{t.presTitre}</Heading>
                    <p className="mt-2 text-[16px] leading-snug text-navy-900">{t.presentation}</p>
                  </div>
                  <Img src={`/maquette/permis-pres-${c === 'E' ? 'C' : c}.jpg`} alt={p.vehicule} className="h-[138px] flex-1 rounded-xl" />
                </div>
              )}
              <div className={cn(card, 'p-4')}>
                <Heading icon={<GraduationCap />}>Programme de formation</Heading>
                <ol className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
                  {steps.map((s, i) => (
                    <li key={s.titre} className="flex flex-1 items-center gap-2">
                      <div className={cn(soft, 'flex min-h-[118px] flex-1 flex-col items-center justify-center gap-1.5 px-2 py-3 text-center [&_svg]:size-9 [&_svg]:text-brand-600')}>
                        {s.icon}
                        <p className="text-[16px] font-bold text-navy-900">{s.titre}</p>
                        <p className="text-[13.5px] leading-tight text-navy-900">{t.programme[i]}</p>
                      </div>
                      {i < steps.length - 1 && <ArrowRight className="hidden size-5 shrink-0 text-brand-600 md:block" />}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {(tab === '' || tab === 'conditions') && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className={cn(card, 'p-4')}>
                <Heading icon={<Users />}>Conditions d’admission</Heading>
                <Checks items={t.conditions} />
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<FileText />}>Pièces à fournir</Heading>
                <Checks items={t.pieces} />
              </div>
            </div>
          )}

          {tab === 'tarifs' && (
            <div className={cn(card, 'p-5')}>
              <Heading icon={<Coins />}>Tarif de la formation</Heading>
              <p className="mt-2 text-[36px] font-extrabold text-navy-900">{t.prix.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-[15px] text-navy-900">Formation complète · {p.duree}</p>
              <Checks items={t.inclus} />
              <p className="mt-4 rounded-xl bg-[#eef3fc] px-4 py-3 text-[14.5px] text-navy-900">Paiement en une seule fois (–5 %) ou en plusieurs échéances (conditions à l’inscription).</p>
            </div>
          )}

          {tab === 'planning' && (
            <div className={cn(card, 'p-4')}>
              <Heading icon={<CalendarDays />}>Prochaines sessions – Permis {c}</Heading>
              {list.length === 0 ? (
                <p className="mt-3 text-[15px] text-navy-900">Aucune session programmée pour le moment. Inscrivez-vous : l’auto-école vous proposera la prochaine date.</p>
              ) : (
                <div className="mt-3 space-y-2.5">
                  {list.map((s) => (
                    <div key={s.debut} className={cn(soft, 'flex flex-wrap items-center gap-4 px-4 py-3 text-[15px] text-navy-900')}>
                      <CalendarDays className="size-6 text-brand-600" />
                      <span className="flex-1"><b>Début le {s.debut}</b> · {s.horaires.join(' · ')} · {s.duree}</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{s.places} places</span>
                      <Link to={`${base}/inscription`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[14px] font-semibold text-white">S’inscrire <ArrowRight className="size-4" /></Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <Aside aeId={a.id} code={c} contenu={t} />
      </div>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path fill="#fff" d="M16.7 13.9c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3c.2-.6.2-1 .1-1.1l-.3-.3Z" />
    </svg>
  )
}

function Aside({ aeId, code, contenu }: { aeId: string; code: PermisCode; contenu: Contenu }) {
  const a = autoEcoleById(aeId)
  const p = permisCatalogue[code]
  const { isFavorite, remove } = useFavorites()
  const [open, setOpen] = useState(false)
  const fav = isFavorite(`${aeId}:${code}`)
  const whatsapp = '+237 6 90 45 67 89'
  return (
    <aside className="space-y-4">
      <div className={cn(card, 'p-4')}>
        <Heading icon={<Coins />}>Tarif de la formation</Heading>
        <p className="mt-1 text-center text-[32px] font-extrabold text-navy-900">{contenu.prix.toLocaleString('fr-FR')} FCFA</p>
        <Checks items={contenu.inclus} />
      </div>
      <Link to={`/ecoles/auto-ecoles/${a.id}/permis/${code}/inscription`} className="flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[18px] font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700">
        <Send className="size-6" />
        S’inscrire maintenant
      </Link>
      <button type="button" onClick={() => (fav ? remove(`${aeId}:${code}`) : setOpen(true))} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
        <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
        {fav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
      </button>
      {contenu.contactRapide ? (
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Phone />}>Contact rapide</Heading>
          <ul className="mt-3 space-y-2.5 text-[15px] text-navy-900">
            <li className="flex items-center gap-3"><WhatsAppIcon />{a.telephone}</li>
            <li className="flex items-center gap-3"><Phone className="size-6 text-brand-600" />{whatsapp}</li>
            <li className="flex items-center gap-3"><Mail className="size-6 text-brand-600" />{a.email}</li>
            <li className="flex items-start gap-3">
              <MapPin className="size-6 shrink-0 fill-brand-600 text-white" />
              <span>
                {a.ville} – {a.quartier}
                {a.adresse && <span className="block text-[12px]">({a.adresse})</span>}
              </span>
            </li>
          </ul>
        </div>
      ) : (
        <div className={cn(card, 'p-4')}>
          <Heading icon={<CalendarDays />}>Informations pratiques</Heading>
          <dl className="mt-2 divide-y divide-line text-[13.5px] text-navy-900">
            {[
              { icon: <Timer />, k: 'Durée moyenne', v: p.duree },
              { icon: <CalendarDays />, k: 'Cours', v: 'Jour / Soir / Week-end' },
              { icon: <MapPin className="fill-brand-600 text-white" />, k: 'Lieu de formation', v: `${a.ville} – ${a.quartier}` },
              { icon: <Phone />, k: 'Contact', v: a.telephone },
              { icon: <WhatsAppIcon />, k: 'WhatsApp', v: whatsapp },
            ].map((r) => (
              <div key={r.k} className="grid grid-cols-[26px_1fr_auto] items-center gap-2 py-2 [&>svg]:size-5 [&>svg]:text-brand-600">
                {r.icon}
                <dt className="font-semibold">{r.k}</dt>
                <dd className="text-[14px]">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <FavoriteModal open={open} onClose={() => setOpen(false)} aeId={aeId} code={code} />
    </aside>
  )
}
