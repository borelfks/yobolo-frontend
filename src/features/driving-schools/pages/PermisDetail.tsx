import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
import { AEHeader, FavoriteModal } from '@/features/driving-schools/components/AutoEcoleBlocks'
import { Img } from '@/shared/components/ui/Img'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { useAutoEcole, usePermisDe, useSessionsDe } from '@/data/hooks'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { sessionDays, sessionDuration, sessionHours, sessionStart } from '@/features/driving-schools/components/profile/profileUtils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const soft = 'rounded-xl bg-[#f0f4fc]'

/**
 * Réglages par permis repris des pages Permis A, B, C et D de la maquette (img61 à img64).
 * Les textes (présentation, programme, conditions, pièces, inclus) sont dans
 * drivingSchools.json, sous « licence.content.<code> ».
 */
type Contenu = {
  /** Prix affiché sur la page de détail (la maquette diffère parfois des listes). */
  prix: number
  contactRapide?: boolean
}

const vehicleIcon: Record<PermisCode, typeof Car> = { A: Bike, B: Car, C: Truck, D: Bus, E: Truck }

function Heading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900 [&_svg]:size-7 [&_svg]:text-brand-600">{icon}{children}</h2>
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="mt-2.5 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-[15px] text-navy-900">
          <CircleCheck className="size-5 shrink-0 fill-emerald-600 text-white" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function PermisDetail() {
  const { t } = useTranslation('driving-schools')
  const { id, code = 'B', tab = '' } = useParams()
  const permisCatalogue = usePermisDe(id ?? '')
  const a = useAutoEcole(id)
  const sessions = useSessionsDe(id ?? '')
  const c = (code.toUpperCase() as PermisCode) in permisCatalogue ? (code.toUpperCase() as PermisCode) : 'B'
  // Prix de la fiche (enregistré dans la base) ; à défaut, celui de la liste.
  const contenu: Contenu = { prix: permisCatalogue[c].prixFiche ?? permisCatalogue[c].prix, contactRapide: permisCatalogue[c].contactRapide }
  const programme = t(`licence.content.${c}.programme`, { returnObjects: true })
  const base = ROUTES.license(a.id, c)
  const Vehicle = vehicleIcon[c]
  const tabs = [
    { value: '', label: t('licence.tabs.overview'), icon: c === 'A' ? <HomeIcon /> : <Car /> },
    { value: 'programme', label: t('licence.tabs.programme'), icon: <Layers /> },
    { value: 'conditions', label: t('licence.tabs.conditions'), icon: <ClipboardList /> },
    { value: 'tarifs', label: t('licence.tabs.prices'), icon: <Coins /> },
    { value: 'planning', label: t('licence.tabs.schedule'), icon: <CalendarDays /> },
  ]
  const steps = [
    { titre: t('licence.steps.code'), icon: <BookOpenText /> },
    { titre: t('licence.steps.driving'), icon: <Vehicle /> },
    { titre: t('licence.steps.safety'), icon: <ShieldCheck /> },
    { titre: t('licence.steps.exam'), icon: c === 'A' ? <ClipboardList /> : <Target /> },
  ]
  const list = sessions.filter((s) => s.permis === c)
  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <AEHeader
        id={a.id}
        crumbs={[{ label: t('common.crumbs.school'), to: ROUTES.schools }, { label: t('common.crumbs.drivingSchools'), to: ROUTES.drivingSchools }, { label: a.nom, to: ROUTES.drivingSchool(a.id) }, { label: t('common.licence', { code: c }) }]}
        title={t('common.licenceTitle', { code: c, name: t(`permis.${c}.name`) })}
        subtitle={t(`licence.content.${c}.subtitle`)}
        image={`/images/maquette/permis-hero-${c === 'E' ? 'C' : c}.jpg`}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_322px]">
        <div className="min-w-0 space-y-4">
          <nav className="flex flex-wrap gap-2.5">
            {tabs.map((x, i) => (
              <Link
                key={x.value}
                to={i === 0 ? base : ROUTES.license(a.id, c, x.value)}
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
                    <Heading icon={<Info />}>{t(`licence.content.${c}.presentationTitle`)}</Heading>
                    <p className="mt-2 text-[16px] leading-snug text-navy-900">{t(`licence.content.${c}.presentation`)}</p>
                  </div>
                  <Img src={`/images/maquette/permis-pres-${c === 'E' ? 'C' : c}.jpg`} alt={t(`permis.${c}.vehicle`)} className="h-[138px] flex-1 rounded-xl" />
                </div>
              )}
              <div className={cn(card, 'p-4')}>
                <Heading icon={<GraduationCap />}>{t('licence.programmeTitle')}</Heading>
                <ol className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
                  {steps.map((s, i) => (
                    <li key={s.titre} className="flex flex-1 items-center gap-2">
                      <div className={cn(soft, 'flex min-h-[118px] flex-1 flex-col items-center justify-center gap-1.5 px-2 py-3 text-center [&_svg]:size-9 [&_svg]:text-brand-600')}>
                        {s.icon}
                        <p className="text-[16px] font-bold text-navy-900">{s.titre}</p>
                        <p className="text-[13.5px] leading-tight text-navy-900">{programme[i]}</p>
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
                <Heading icon={<Users />}>{t('licence.admission')}</Heading>
                <Checks items={t(`licence.content.${c}.conditions`, { returnObjects: true })} />
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<FileText />}>{t('licence.documents')}</Heading>
                <Checks items={t(`licence.content.${c}.documents`, { returnObjects: true })} />
              </div>
            </div>
          )}

          {tab === 'tarifs' && (
            <div className={cn(card, 'p-5')}>
              <Heading icon={<Coins />}>{t('licence.priceTitle')}</Heading>
              <p className="mt-2 text-[36px] font-extrabold text-navy-900">{fcfa(contenu.prix)}</p>
              <p className="text-[15px] text-navy-900">{t('licence.fullTraining', { duration: t(`permis.${c}.duration`) })}</p>
              <Checks items={t(`licence.content.${c}.included`, { returnObjects: true })} />
              <p className="mt-4 rounded-xl bg-[#eef3fc] px-4 py-3 text-[14.5px] text-navy-900">{t('licence.payment')}</p>
            </div>
          )}

          {tab === 'planning' && (
            <div className={cn(card, 'p-4')}>
              <Heading icon={<CalendarDays />}>{t('licence.nextSessions', { code: c })}</Heading>
              {list.length === 0 ? (
                <p className="mt-3 text-[15px] text-navy-900">{t('licence.noSession')}</p>
              ) : (
                <div className="mt-3 space-y-2.5">
                  {list.map((s) => (
                    <div key={s.id} className={cn(soft, 'flex flex-wrap items-center gap-4 px-4 py-3 text-[15px] text-navy-900')}>
                      <CalendarDays className="size-6 text-brand-600" />
                      <span className="flex-1"><b>{t('licence.startsOn', { date: sessionStart(s.debut) })}</b> · {[sessionDays(t, s.horaires[0]), sessionHours(t, s.horaires[1])].join(' · ')} · {sessionDuration(t, s.duree)}</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{t('common.places', { count: s.places })}</span>
                      <Link to={ROUTES.enrollment(a.id, c)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[14px] font-semibold text-white">{t('common.enrol')} <ArrowRight className="size-4" /></Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <Aside aeId={a.id} code={c} contenu={contenu} />
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
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(aeId)
  const { isFavorite, remove } = useFavorites()
  const [open, setOpen] = useState(false)
  const fav = isFavorite(`${aeId}:${code}`)
  const whatsapp = '+237 6 90 45 67 89'
  return (
    <aside className="space-y-4">
      <div className={cn(card, 'p-4')}>
        <Heading icon={<Coins />}>{t('licence.priceTitle')}</Heading>
        <p className="mt-1 text-center text-[32px] font-extrabold text-navy-900">{fcfa(contenu.prix)}</p>
        <Checks items={t(`licence.content.${code}.included`, { returnObjects: true })} />
      </div>
      <Link to={ROUTES.enrollment(a.id, code)} className="flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 text-[18px] font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700">
        <Send className="size-6" />
        {t('common.enrolNow')}
      </Link>
      <button type="button" onClick={() => (fav ? remove(`${aeId}:${code}`) : setOpen(true))} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border-2 border-brand-600/60 bg-white text-[16px] font-semibold text-navy-800 hover:bg-brand-50">
        <Heart className={cn('size-5', fav && 'fill-rose-500 text-rose-500')} />
        {fav ? t('common.inFavorites') : t('common.addToFavorites')}
      </button>
      {contenu.contactRapide ? (
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Phone />}>{t('licence.quickContact')}</Heading>
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
          <Heading icon={<CalendarDays />}>{t('licence.practicalInfo')}</Heading>
          <dl className="mt-2 divide-y divide-line text-[13.5px] text-navy-900">
            {[
              { icon: <Timer />, k: t('licence.info.avgDuration'), v: t(`permis.${code}.duration`) },
              { icon: <CalendarDays />, k: t('licence.info.classes'), v: t('licence.info.classesValue') },
              { icon: <MapPin className="fill-brand-600 text-white" />, k: t('licence.info.place'), v: `${a.ville} – ${a.quartier}` },
              { icon: <Phone />, k: t('licence.info.contact'), v: a.telephone },
              { icon: <WhatsAppIcon />, k: t('licence.info.whatsapp'), v: whatsapp },
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
