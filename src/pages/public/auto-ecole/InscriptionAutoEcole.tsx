import { Fragment, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CalendarDays,
  Camera,
  Car,
  Check,
  CircleArrowDown,
  CircleCheck,
  CloudUpload,
  Coins,
  FileText,
  GraduationCap,
  IdCard,
  Info,
  Mail,
  MapPin,
  PencilLine,
  Send,
  ShieldCheck,
  ThumbsUp,
  Timer,
  BriefcaseMedical,
  UserRound,
  Upload,
} from 'lucide-react'
import { AEHeader } from '@/components/domain/autoecole'
import { Select } from '@/components/ui/Form'
import { piecesAE, useInscriptionDraft } from '@/lib/autoecole-helpers'
import { autoEcoleById, permisCatalogue, type PermisCode } from '@/mocks/autoecoles'
import { quartiers, villes } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const field = 'h-10 w-full rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[14px] text-ink outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100'
const pieceIcon: Record<string, ReactNode> = { cni: <IdCard />, photos: <Camera />, medical: <BriefcaseMedical /> }

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1 block text-[14px] font-bold text-navy-900">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </span>
  )
}

function Heading({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return <h2 className={cn('flex items-center gap-2.5 text-[20px] font-bold text-navy-900 [&_svg]:size-7 [&_svg]:text-brand-600', className)}>{icon}{children}</h2>
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[14.5px] text-navy-900">
          <CircleCheck className="mt-0.5 size-5 shrink-0 fill-emerald-600 text-white" />
          {t}
        </li>
      ))}
    </ul>
  )
}

function Steps({ step }: { step: number }) {
  const labels = ['Mes informations', 'Pièces à fournir', 'Validation']
  const allGreen = step === 2
  return (
    <ol className="flex items-start border-b border-line px-6 pb-3">
      {labels.map((l, i) => (
        <Fragment key={l}>
          <li className="flex min-w-[150px] flex-col items-center gap-1.5">
            <span
              className={cn(
                'grid size-9 place-items-center rounded-full border-2 text-[17px] font-bold',
                allGreen && i < 2 ? 'border-emerald-600 bg-emerald-600 text-white' : i === step ? 'border-brand-600 bg-brand-600 text-white' : 'border-navy-800 bg-white text-navy-900',
              )}
            >
              {allGreen && i < 2 ? <Check className="size-5" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('flex items-center gap-1.5 text-[14.5px] text-navy-900', i === step && 'font-bold')}>
              {l}
              {!allGreen && i < step && <CircleCheck className="size-4 fill-emerald-600 text-white" />}
            </span>
          </li>
          {i < labels.length - 1 && <li aria-hidden className={cn('mt-[18px] h-0.5 flex-1', allGreen ? (i === 0 ? 'bg-emerald-600' : 'bg-brand-600') : i < step ? 'bg-brand-600' : i === step ? 'bg-[linear-gradient(90deg,#1f55e6_50%,#c9d4ea_50%)]' : 'bg-[#c9d4ea]')} />}
        </Fragment>
      ))}
    </ol>
  )
}

export default function InscriptionAutoEcole() {
  const { id, code = 'B' } = useParams()
  const a = autoEcoleById(id)
  const p = permisCatalogue[code as PermisCode] ?? permisCatalogue.B
  const [d, update] = useInscriptionDraft(a.id, p.code)
  const [step, setStep] = useState(0)
  const [certif, setCertif] = useState(true)
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()
  const base = `/ecoles/auto-ecoles/${a.id}/permis/${p.code}/inscription`
  const permisNom = `Permis ${p.code} – ${p.nom}`

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className={cn(card, 'p-8 text-center')}>
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CircleCheck className="size-10" /></span>
          <h1 className="mt-5 text-2xl font-bold text-navy-900">Demande envoyée !</h1>
          <p className="mt-2 text-muted">Votre demande d’inscription au {permisNom} a été transmise à {a.nom}. Vous serez informé par SMS, e-mail et notification dès son traitement.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={`/ecoles/auto-ecoles/${a.id}`} className="inline-flex h-11 flex-1 items-center justify-center rounded-full border-2 border-brand-600/60 font-semibold text-navy-800">Retour à l’auto-école</Link>
            <Link to="/ecoles/auto-ecoles" className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-brand-600 font-semibold text-white">Voir d’autres auto-écoles</Link>
          </div>
        </div>
      </div>
    )
  }

  const v = (x: string, fallback: string) => x || fallback
  const naissance = d.naissance ? new Date(d.naissance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '15 mars 2001'

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <AEHeader
        id={a.id}
        crumbs={[{ label: 'École', to: '/ecoles' }, { label: 'Auto-Écoles', to: '/ecoles/auto-ecoles' }, { label: a.nom, to: `/ecoles/auto-ecoles/${a.id}` }, { label: `Permis ${p.code}`, to: `/ecoles/auto-ecoles/${a.id}/permis/${p.code}` }, { label: 'Inscription' }]}
        title={
          step === 2 ? (
            'Inscription – Validation'
          ) : (
            <>
              Inscription à la formation
              <span className="block">{permisNom}</span>
            </>
          )
        }
        subtitle={step === 2 ? 'Vérifiez vos informations avant d’envoyer votre demande.' : undefined}
        image="/maquette/ae-hero-formations.jpg"
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_386px]">
        <div className={cn(card, 'px-5 pt-3 pb-5')}>
          <Steps step={step} />

          {step === 0 && (
            <div className="space-y-4 pt-4">
              <Heading icon={<UserRound />}>Informations du candidat</Heading>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><Label required>Nom</Label><input className={field} placeholder="Votre nom" value={d.nom} onChange={(e) => update({ nom: e.target.value })} /></label>
                <label><Label required>Prénom(s)</Label><input className={field} placeholder="Vos prénom(s)" value={d.prenom} onChange={(e) => update({ prenom: e.target.value })} /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_0.95fr_1.1fr]">
                <label>
                  <Label required>Date de naissance</Label>
                  <span className="relative block">
                    <input className={field} placeholder="jj / mm / aaaa" value={d.naissance} onChange={(e) => update({ naissance: e.target.value })} />
                    <Calendar className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" />
                  </span>
                </label>
                <label><Label required>Sexe</Label><Select options={['Masculin', 'Féminin']} placeholder="Sélectionner" value={d.sexe} onChange={(e) => update({ sexe: e.target.value })} className="h-10 rounded-lg border-[#c9d4ea]" /></label>
                <label>
                  <Label required>Téléphone</Label>
                  <span className="flex h-10 overflow-hidden rounded-lg border border-[#c9d4ea] bg-white">
                    <span className="flex items-center gap-1.5 border-r border-[#c9d4ea] px-2.5 text-[14px] font-semibold text-navy-900">
                      <span aria-hidden className="flex h-3.5 w-5 overflow-hidden rounded-[2px]"><span className="w-1/3 bg-emerald-600" /><span className="w-1/3 bg-rose-600" /><span className="w-1/3 bg-sun-400" /></span>
                      +237 <span className="text-xs">▾</span>
                    </span>
                    <input className="min-w-0 flex-1 px-3 text-[14px] outline-none" placeholder="6 70 12 34 56" value={d.telephone} onChange={(e) => update({ telephone: e.target.value })} />
                  </span>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_0.95fr_1.1fr]">
                <label>
                  <Label>Email (facultatif)</Label>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" />
                    <input type="email" className={cn(field, 'pl-10')} placeholder="votre@email.com" value={d.email} onChange={(e) => update({ email: e.target.value })} />
                  </span>
                </label>
                <label><Label required>Ville</Label><Select options={villes.map((x) => x.nom)} placeholder="Sélectionner la ville" value={d.ville} onChange={(e) => update({ ville: e.target.value })} className="h-10 rounded-lg border-[#c9d4ea]" /></label>
                <label><Label required>Quartier</Label><Select options={quartiers} placeholder="Votre quartier" value={d.quartier} onChange={(e) => update({ quartier: e.target.value })} className="h-10 rounded-lg border-[#c9d4ea]" /></label>
              </div>
              <div className="border-t border-line pt-4">
                <Heading icon={<Car />} className="text-[19px]">Formation choisie</Heading>
                <div className="mt-3 flex items-center gap-4 rounded-xl bg-[#eef3fc] p-3">
                  <span className="grid size-14 place-items-center rounded-xl bg-white text-navy-800"><Car className="size-8 fill-navy-800" /></span>
                  <div className="flex-1">
                    <p className="text-[16px] font-bold text-navy-900">{permisNom}</p>
                    <p className="text-[14px] text-navy-900">{a.nom} – {a.ville}, {a.quartier}</p>
                  </div>
                  <Link to={`${base}/modifier/formation`} className="inline-flex h-9 items-center gap-1.5 rounded-lg border-2 border-brand-600/60 bg-white px-4 text-[14px] font-semibold text-navy-800 hover:bg-brand-50">
                    <PencilLine className="size-4" />
                    Modifier
                  </Link>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 pt-4">
              <div>
                <Heading icon={<FileText />}>Pièces à fournir</Heading>
                <p className="mt-1 text-[14.5px] text-navy-900">Joignez les documents ci-dessous pour finaliser votre demande d’inscription.</p>
              </div>
              <div className="space-y-2.5">
                {piecesAE.map((pc) => {
                  const ok = d.pieces[pc.key]
                  return (
                    <div key={pc.key} className="flex flex-wrap items-center gap-4 border-b border-line pb-2.5 last:border-0">
                      <span className="grid h-11 w-14 place-items-center rounded-lg bg-[#eef3fc] text-brand-600 [&_svg]:size-7">{pieceIcon[pc.key]}</span>
                      <div className="min-w-[220px] flex-1">
                        <p className="text-[15px] font-bold text-navy-900">{pc.label}</p>
                        <p className="text-[12.5px] text-navy-900">{pc.hint}</p>
                      </div>
                      {ok ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{pc.etat}</span>
                      ) : (
                        <span className="rounded-lg bg-rose-100 px-3 py-1 text-[13px] font-semibold text-rose-600">Obligatoire</span>
                      )}
                      <span className="hidden h-10 w-px bg-line sm:block" />
                      <button
                        type="button"
                        onClick={() => {
                          update({ pieces: { ...d.pieces, [pc.key]: true } })
                          toast.success(`${pc.court} : fichier ajouté`)
                        }}
                        className="inline-flex h-10 w-50 items-center justify-center gap-2.5 rounded-lg border-2 border-[#9fb4e3] bg-white text-[14px] font-semibold text-navy-800 hover:bg-brand-50"
                      >
                        <Upload className="size-5" />
                        {ok ? 'Remplacer' : pc.bouton}
                      </button>
                    </div>
                  )
                })}
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#9fb4e3] bg-[#f3f7fe] py-5 text-center">
                <CloudUpload className="size-8 text-brand-600" />
                <span className="text-[15px] font-bold text-navy-900">Glissez-déposez vos fichiers ici</span>
                <span className="text-[13px] text-navy-900">ou cliquez pour sélectionner depuis votre appareil</span>
                <input
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    if (!e.target.files?.[0]) return
                    update({ pieces: { cni: true, photos: true, medical: true } })
                    toast.success(`${e.target.files[0].name} ajouté`)
                  }}
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 pt-4">
              <Heading icon={<FileText />} className="text-[22px]">Récapitulatif de votre inscription</Heading>
              <div className="grid gap-4 md:grid-cols-2">
                <RecapCard icon={<UserRound />} title="Informations personnelles" edit={`${base}/modifier/infos`}>
                  <Row k="Nom et prénoms" v={`${v(d.nom.toUpperCase(), 'MBOG')} ${v(d.prenom, 'Pauline Aline')}`} />
                  <Row k="Date de naissance" v={naissance} />
                  <Row k="Téléphone" v={`+237 ${v(d.telephone, '6 70 12 34 56')}`} />
                  <Row k="Email" v={v(d.email, 'pauline.mbog@gmail.com')} />
                  <Row k="Localisation" v={`${v(d.ville, 'Yaoundé')} – ${v(d.quartier, 'Bastos')}`} />
                </RecapCard>
                <RecapCard icon={<GraduationCap />} title="Formation choisie" edit={`${base}/modifier/formation`}>
                  <Row k="Permis" v={permisNom} />
                  <Row k="Auto-école" v={a.nom} />
                  <Row k="Lieu de formation" v={`${a.ville} – ${a.quartier}`} />
                  <Row k="Tarif" v={`${p.prix.toLocaleString('fr-FR')} FCFA`} />
                  <Row k="Session" v={d.session} />
                  <Row k="Durée estimée" v={p.duree} />
                </RecapCard>
              </div>
              <div className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between">
                  <Heading icon={<FileText />} className="text-[18px] [&_svg]:size-6">Pièces fournies</Heading>
                  <Link to={`${base}/modifier/pieces`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#c9d4ea] px-3 text-[13px] font-semibold text-navy-800"><PencilLine className="size-4" />Modifier</Link>
                </div>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {piecesAE.map((pc) => (
                    <div key={pc.key} className="flex items-center gap-3 rounded-xl bg-[#eef3fc] px-3 py-2">
                      <span className="text-brand-600 [&_svg]:size-7">{pieceIcon[pc.key]}</span>
                      <span className="flex-1 leading-tight">
                        <b className="block text-[15px] text-navy-900">{pc.court}</b>
                        <span className="text-[13px] text-navy-900">{pc.etat}</span>
                      </span>
                      <CircleCheck className="size-6 fill-emerald-600 text-white" />
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 border-t border-line pt-3 text-[14.5px] text-navy-900">
                <input type="checkbox" checked={certif} onChange={(e) => setCertif(e.target.checked)} className="mt-0.5 size-6 accent-brand-600" />
                <span>
                  Je certifie que les informations fournies sont exactes et j’accepte les <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-600 underline">conditions d’inscription</a> de l’auto-école et la{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-600 underline">politique de confidentialité</a> de YIBOLO.
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <button type="button" onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))} className="inline-flex h-11 w-36 items-center justify-center gap-2.5 rounded-xl border-2 border-[#c9d4ea] bg-white text-[16px] font-semibold text-navy-900 hover:bg-slate-50">
              <ArrowLeft className="size-5" />
              {step === 0 ? 'Retour' : 'Précédent'}
            </button>
            {step < 2 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="inline-flex h-11 w-52 items-center justify-center gap-2.5 rounded-xl bg-brand-600 text-[16px] font-semibold text-white hover:bg-brand-700">
                Suivant <ArrowRight className="size-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!certif) return toast.error('Cochez la case de certification pour envoyer votre demande.')
                  toast.success('Demande envoyée à l’auto-école')
                  setSent(true)
                }}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-600 px-12 text-[18px] font-semibold text-white hover:bg-brand-700"
              >
                <Send className="size-6" />
                Envoyer ma demande
              </button>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          {step === 0 && (
            <>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<FileText />}>Récapitulatif de l’inscription</Heading>
                <dl className="mt-2 divide-y divide-line text-[13.5px] text-navy-900">
                  {[
                    { icon: <Building2 />, k: 'Auto-École', v: a.nom },
                    { icon: <GraduationCap />, k: 'Formation', v: permisNom },
                    { icon: <MapPin className="fill-brand-600 text-white" />, k: 'Lieu', v: `${a.ville} – ${a.quartier}` },
                    { icon: <Coins />, k: 'Tarif de la formation', v: <b className="text-[18px] text-brand-700">{p.prix.toLocaleString('fr-FR')} FCFA</b> },
                  ].map((r) => (
                    <div key={r.k} className="grid grid-cols-[24px_1fr_auto] items-center gap-2.5 py-2 [&>svg]:size-5 [&>svg]:text-brand-600">
                      {r.icon}
                      <dt className="font-semibold">{r.k}</dt>
                      <dd>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-2xl border border-line bg-[#eef3fc] p-4">
                <Heading icon={<CalendarDays />}>Prochaines sessions</Heading>
                <ul className="mt-2 space-y-1.5 text-[15px] text-navy-900">
                  <li className="flex items-center gap-2.5"><CalendarDays className="size-5 text-brand-600" /><b>Début :</b> 15 novembre 2026</li>
                  <li className="flex items-center gap-2.5"><Timer className="size-5 text-brand-600" /><b>Durée :</b> {p.duree}</li>
                </ul>
                <span className="mx-auto mt-2 block w-fit rounded-full bg-emerald-600 px-4 py-1 text-[14px] font-semibold text-white">Places disponibles</span>
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<ThumbsUp />}>Vos avantages</Heading>
                <Checks items={['Inscription rapide et sécurisée', 'Suivi de votre dossier en ligne', 'Accompagnement jusqu’à l’examen']} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<GraduationCap />}>Votre formation</Heading>
                <dl className="mt-2 divide-y divide-line text-[14px] text-navy-900">
                  {[
                    { icon: <Car />, k: 'Permis choisi', v: permisNom },
                    { icon: <Building2 />, k: 'Auto-école', v: a.nom },
                    { icon: <MapPin className="fill-brand-600 text-white" />, k: 'Lieu', v: `${a.ville} – ${a.quartier}` },
                  ].map((r) => (
                    <div key={r.k} className="grid grid-cols-[24px_110px_1fr] items-center gap-2.5 py-2.5 [&>svg]:size-5 [&>svg]:text-brand-600">
                      {r.icon}
                      <dt className="font-semibold">{r.k}</dt>
                      <dd>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<Info />}>Conseils pour vos documents</Heading>
                <Checks items={['Documents lisibles et en cours de validité.', 'Formats acceptés : PDF, JPG, PNG.', 'Taille maximale : 5 Mo par fichier.', 'Photos d’identité : fond clair, visage bien visible.']} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-[#e7f7ec] p-4">
                <ShieldCheck className="size-10 shrink-0 fill-emerald-600 text-white" />
                <div>
                  <p className="text-[17px] leading-snug font-bold text-navy-900">Votre demande sera transmise à l’{a.nom.replace(/^Auto-École/, 'Auto-École')}.</p>
                  <p className="mt-1 text-[14px] text-navy-900">Vous recevrez une notification dès le traitement de votre dossier.</p>
                </div>
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<CircleArrowDown />}>Prochaines étapes</Heading>
                <ol className="mt-3 space-y-3">
                  {[
                    ['Réception de votre demande', 'Un accusé de réception vous sera envoyé.'],
                    ['Étude de votre dossier', 'Vérification des informations et des pièces.'],
                    ['Réponse de l’auto-école', 'Admission, demande de complément ou refus.'],
                  ].map(([t, s], i) => (
                    <li key={t} className="flex gap-3 border-b border-line pb-2.5 last:border-0">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-[15px] font-bold text-white">{i + 1}</span>
                      <span>
                        <b className="block text-[15px] text-navy-900">{t}</b>
                        <span className="text-[13.5px] text-navy-900">{s}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={cn(card, 'p-4')}>
                <Heading icon={<Info />}>Bon à savoir</Heading>
                <Checks items={['Votre dossier est traité sous 48 à 72 h.', 'Suivez son évolution dans votre espace YIBOLO.', 'Vous serez informé par SMS, e-mail et notification.']} />
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

function RecapCard({ icon, title, edit, children }: { icon: ReactNode; title: string; edit: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line p-3">
      <div className="flex items-center justify-between">
        <Heading icon={icon} className="text-[17px] [&_svg]:size-6">{title}</Heading>
        <Link to={edit} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#c9d4ea] px-3 text-[13px] font-semibold text-navy-800 hover:bg-brand-50">
          <PencilLine className="size-4" />
          Modifier
        </Link>
      </div>
      <dl className="mt-2 divide-y divide-line">{children}</dl>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-2 py-1.5 text-[14px] text-navy-900">
      <dt className="font-bold">{k} :</dt>
      <dd>{v}</dd>
    </div>
  )
}
