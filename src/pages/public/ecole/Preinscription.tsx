import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CircleCheck,
  ClipboardPen,
  Clock,
  Coins,
  Eye,
  FileText,
  GraduationCap,
  Headphones,
  Info,
  Landmark,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Sun,
  Upload,
  UserRound,
} from 'lucide-react'
import { Hero } from '@/components/domain/ecole'
import { Img } from '@/components/ui/Feedback'
import { Select } from '@/components/ui/Form'
import { ecoleUrl } from '@/lib/ecole-links'
import { etablissementById, formationById } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const card = 'rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]'
const field = 'h-11 w-full rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[14px] text-ink outline-none placeholder:text-ink/60 focus:border-brand-500 focus:ring-3 focus:ring-brand-100'
const steps = [
  ['Informations', 'personnelles'],
  ['Parcours', 'scolaire'],
  ['Pièces', 'à fournir'],
  ['Validation', ''],
]
const pieces = ['CNI ou Acte de naissance', 'Dernier diplôme', 'Relevé de notes', 'Photo d’identité (JPEG/PNG)']

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-[14px] font-bold text-navy-900">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </span>
  )
}

export default function Preinscription() {
  const { id } = useParams()
  const f = formationById(id)
  const e = etablissementById(f.etablissementId)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [files, setFiles] = useState<Record<string, string>>({})
  const [info, setInfo] = useState({ nom: '', prenom: '', sexe: '', naissance: '', nationalite: 'Camerounaise', telephone: '', email: '' })
  const [parcours, setParcours] = useState({ diplome: 'Baccalauréat', serie: '', annee: '', etablissement: '', autre: false })

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className={cn(card, 'p-8 text-center')}>
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <CircleCheck className="size-10" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-navy-900">Préinscription envoyée !</h1>
          <p className="mt-2 text-muted">
            {e.nom} a reçu votre dossier pour la formation <b>{f.nom}</b>. Vous serez informé par SMS, e-mail et notification.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate(ecoleUrl(e))} className="h-11 flex-1 rounded-full border-2 border-brand-600/60 font-semibold text-navy-800">
              Retour à l’établissement
            </button>
            <button type="button" onClick={() => navigate('/ecoles')} className="h-11 flex-1 rounded-full bg-brand-600 font-semibold text-white">
              Continuer à explorer
            </button>
          </div>
        </div>
      </div>
    )
  }

  const nomComplet = `${info.nom.toUpperCase()} ${info.prenom}`.trim() || 'NDJON MBOG Thierry'

  return (
    <div className="mx-auto max-w-[1320px] space-y-4 px-5 py-4">
      <Hero
        crumbs={[
          { label: 'École', to: '/ecoles' },
          { label: 'IPES', to: '/ecoles/ipes' },
          { label: e.nom, to: ecoleUrl(e) },
          ...(step < 3 ? [{ label: f.nom, to: `/ecoles/formations/${f.id}` }] : []),
          { label: 'Préinscription' },
        ]}
        icon={<ClipboardPen />}
        image="/maquette/preinscription-hero.jpg"
        title="Préinscription en ligne"
        subtitle={step === 3 ? 'Vérifiez vos informations avant de valider votre demande.' : 'Réservez votre place à la formation de votre choix en quelques minutes.'}
      />
      <div className="grid gap-5 lg:grid-cols-[328px_1fr]">
        <aside className="space-y-4">
          <div className={cn(card, 'overflow-hidden p-1.5')}>
            <Img src={e.id === 'ipc' ? '/maquette/preinscription-ipc.jpg' : e.image} alt={e.nom} className="h-[112px] w-full rounded-xl" />
            <div className="space-y-1 px-3 pt-3 pb-3">
              <p className="text-[20px] font-bold text-navy-900">{f.nom}</p>
              <p className="flex items-center gap-2 text-[14.5px] text-navy-900"><Landmark className="size-5" />{e.nom}</p>
              <p className="flex items-center gap-2 border-b border-line pb-3 text-[14.5px] text-navy-900"><MapPin className="size-5" />{e.ville} – {e.quartier}</p>
              <ul className="space-y-2 pt-2 text-[15px] text-navy-900 [&_svg]:size-6 [&_svg]:text-navy-800">
                <li className="flex items-center gap-3"><GraduationCap /><b>Diplôme</b> : {f.diplome}</li>
                <li className="flex items-center gap-3"><Clock /><b>Durée</b> : {f.dureeMois} mois</li>
                <li className="flex items-center gap-3"><Sun className="fill-amber-300 !text-amber-500" /><b>Cours</b> : {f.mode}</li>
                <li className="flex items-start gap-3">
                  <Coins />
                  <span>
                    <b>Frais de formation :</b>
                    <span className="block text-[18px] font-bold text-brand-600">{f.fraisAn.toLocaleString('fr-FR')} FCFA / an</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className={cn(card, 'flex items-center gap-3 p-3')}>
            <span className="grid size-12 place-items-center rounded-xl bg-[#eef3fc] text-brand-600"><Headphones className="size-7" /></span>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-navy-900">Une question ?</p>
              <p className="flex items-center gap-1.5 text-[16px] font-bold text-navy-900"><Phone className="size-4" />{e.telephone}</p>
            </div>
            <button type="button" aria-label="WhatsApp" onClick={() => toast('Ouverture de WhatsApp (démo)')} className="grid size-12 place-items-center rounded-xl bg-[#dcf7e5]">
              <svg viewBox="0 0 24 24" className="size-8" aria-hidden>
                <circle cx="12" cy="12" r="11" fill="#25D366" />
                <path fill="#fff" d="M16.7 13.9c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3c.2-.6.2-1 .1-1.1l-.3-.3Z" />
              </svg>
            </button>
          </div>
        </aside>

        <div className="space-y-4">
          <ol className="flex items-center gap-2 rounded-2xl border border-line bg-[#f3f6fc] p-1.5 shadow-sm">
            {steps.map((s, i) => (
              <li key={s[0]} className={cn('flex items-center gap-3', i < steps.length - 1 && 'flex-1')}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => setStep(i)}
                  className={cn('flex items-center gap-3 rounded-full px-3 py-1.5 text-left text-[15px] leading-tight', i <= step && i < 3 && 'bg-[#e3ebfb]', i === step && 'font-semibold text-navy-900')}
                >
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-full text-[18px] font-bold text-white', i < step ? 'bg-brand-600' : i === step ? 'bg-brand-600' : 'bg-[#a7b3c9]')}>
                    {i < step ? <Check className="size-5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={cn('text-navy-900', i === 3 && i === step && 'text-[20px] font-bold')}>
                    {s[0]}
                    {s[1] && <span className="block">{s[1]}</span>}
                  </span>
                </button>
                {i < steps.length - 1 && <span className="h-px flex-1 bg-[#b9c4d8]" />}
              </li>
            ))}
          </ol>

          <div className={cn(card, 'p-5')}>
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900"><UserRound className="size-7 fill-brand-600 text-brand-600" />Étape 1 : Informations personnelles</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><Label required>Nom</Label><input className={field} placeholder="Entrez votre nom" value={info.nom} onChange={(ev) => setInfo({ ...info, nom: ev.target.value })} /></label>
                  <label><Label required>Prénom(s)</Label><input className={field} placeholder="Entrez vos prénoms" value={info.prenom} onChange={(ev) => setInfo({ ...info, prenom: ev.target.value })} /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1.1fr]">
                  <label><Label required>Sexe</Label><Select options={['Masculin', 'Féminin']} placeholder="Sélectionnez" value={info.sexe} onChange={(ev) => setInfo({ ...info, sexe: ev.target.value })} className="rounded-lg border-[#c9d4ea]" /></label>
                  <label>
                    <Label required>Date de naissance</Label>
                    <span className="relative block">
                      <input className={field} placeholder="JJ / MM / AAAA" value={info.naissance} onChange={(ev) => setInfo({ ...info, naissance: ev.target.value })} />
                      <Calendar className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-navy-800" />
                    </span>
                  </label>
                  <label><Label required>Nationalité</Label><Select options={['Camerounaise', 'Tchadienne', 'Gabonaise', 'Centrafricaine', 'Congolaise', 'Autre']} value={info.nationalite} onChange={(ev) => setInfo({ ...info, nationalite: ev.target.value })} className="rounded-lg border-[#c9d4ea]" /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <Label required>Téléphone</Label>
                    <span className="flex h-11 overflow-hidden rounded-lg border border-[#c9d4ea] bg-white">
                      <span className="flex items-center gap-2 border-r border-[#c9d4ea] px-3 text-[15px] font-semibold text-navy-900">
                        <span aria-hidden className="flex h-4 w-6 overflow-hidden rounded-[2px]"><span className="w-1/3 bg-emerald-600" /><span className="w-1/3 bg-rose-600" /><span className="w-1/3 bg-sun-400" /></span>
                        +237 <span className="text-xs">▾</span>
                      </span>
                      <input className="min-w-0 flex-1 px-3.5 text-[14px] outline-none" placeholder="6 XX XX XX XX" value={info.telephone} onChange={(ev) => setInfo({ ...info, telephone: ev.target.value })} />
                    </span>
                  </label>
                  <label>
                    <Label>Email</Label>
                    <span className="relative block">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" />
                      <input type="email" className={cn(field, 'pl-11')} placeholder="votre@email.com" value={info.email} onChange={(ev) => setInfo({ ...info, email: ev.target.value })} />
                    </span>
                  </label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900"><GraduationCap className="size-7 text-brand-600" />Étape 2 : Parcours scolaire</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><Label required>Dernier diplôme obtenu</Label><Select options={['Baccalauréat', 'Probatoire', 'BTS', 'Licence', 'GCE A Level']} value={parcours.diplome} onChange={(ev) => setParcours({ ...parcours, diplome: ev.target.value })} className="rounded-lg border-[#c9d4ea]" /></label>
                  <label><Label required>Série / Spécialité</Label><input className={field} placeholder="Ex. : G2 – Comptabilité et Gestion" value={parcours.serie} onChange={(ev) => setParcours({ ...parcours, serie: ev.target.value })} /></label>
                  <label><Label required>Année d’obtention</Label><Select options={['2026', '2025', '2024', '2023', '2022']} placeholder="Sélectionnez" value={parcours.annee} onChange={(ev) => setParcours({ ...parcours, annee: ev.target.value })} className="rounded-lg border-[#c9d4ea]" /></label>
                  <label><Label required>Établissement d’origine</Label><input className={field} placeholder="Nom de votre établissement" value={parcours.etablissement} onChange={(ev) => setParcours({ ...parcours, etablissement: ev.target.value })} /></label>
                </div>
                <label className="flex items-center gap-2.5 text-[14px] text-navy-900">
                  <input type="checkbox" checked={parcours.autre} onChange={(ev) => setParcours({ ...parcours, autre: ev.target.checked })} className="size-[18px] accent-brand-600" />
                  J’ai un autre diplôme (BTS, Licence, etc.)
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-3 text-[22px] font-bold text-navy-900"><FileText className="size-7 text-brand-600" />Étape 3 : Pièces à fournir</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pieces.map((p) => (
                    <div key={p}>
                      <Label required>{p}</Label>
                      <label className="flex h-14 cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-[#b9c8e6] bg-[#f7f9fe] px-4 text-[14px] text-navy-900 hover:bg-brand-50">
                        <Upload className="size-5 text-brand-600" />
                        <span className="flex-1 truncate">{files[p] ?? 'Choisir un fichier'}</span>
                        {files[p] ? <CircleCheck className="size-5 fill-emerald-500 text-white" /> : <Info className="size-5 text-navy-800" />}
                        <input type="file" className="sr-only" onChange={(ev) => ev.target.files?.[0] && setFiles({ ...files, [p]: ev.target.files[0].name })} />
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-[13.5px] text-muted">Formats acceptés : PDF, JPG, PNG — 5 Mo par fichier.</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-full bg-brand-600 text-white"><Check className="size-8" strokeWidth={3} /></span>
                  <div>
                    <h2 className="text-[22px] font-bold text-navy-900">Récapitulatif de votre préinscription</h2>
                    <p className="text-[13.5px] text-navy-900">Veuillez vérifier les informations ci-dessous avant de valider définitivement votre demande.</p>
                  </div>
                </div>
                <RecapBlock icon={<UserRound className="fill-brand-600" />} title="Vos informations personnelles" onEdit={() => setStep(0)}>
                  <span><b>Nom :</b> {nomComplet}</span>
                  <span><b>Téléphone :</b> +237 {info.telephone || '6 90 12 34 56'}</span>
                  <span><b>Email :</b> {info.email || 'thierry.ndjon@gmail.com'}</span>
                </RecapBlock>
                <RecapBlock icon={<GraduationCap />} title="Votre parcours scolaire" onEdit={() => setStep(1)}>
                  <span><b>Dernier diplôme :</b> {parcours.diplome}</span>
                  <span><b>Série :</b> {parcours.serie || 'G2'}</span>
                  <span><b>Année :</b> {parcours.annee || '2023'}</span>
                  <span><b>Établissement :</b> {parcours.etablissement || 'Lycée Moderne de Yaoundé'}</span>
                </RecapBlock>
                <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[#eef3fc] px-4 py-2.5">
                  <FileText className="size-6 text-navy-800" />
                  <span className="text-[16px] font-bold text-navy-900">Vos pièces jointes</span>
                  <span className="flex flex-1 items-center gap-1.5 text-[13px] text-navy-900">
                    <CircleCheck className="size-5 fill-emerald-600 text-white" />
                    Tous les documents sont téléchargés avec succès.
                  </span>
                  <button type="button" onClick={() => setStep(2)} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#c9d4ea] bg-white px-3 text-[13px] font-semibold text-navy-800">
                    <Eye className="size-4" />
                    Voir les pièces
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#e5f7ea] px-4 py-2.5">
                  <ShieldCheck className="size-7 fill-emerald-600 text-white" />
                  <div className="text-[13px] text-navy-900">
                    <p className="text-[14px] font-bold text-emerald-700">Vos données sont sécurisées</p>
                    Vos informations sont protégées et ne seront utilisées que dans le cadre de votre inscription.
                  </div>
                </div>
              </div>
            )}

            <div className={cn('mt-5 flex items-center gap-4 pt-4', step < 3 ? 'justify-end border-t border-line' : 'justify-between')}>
              <button
                type="button"
                onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}
                className={cn('inline-flex h-11 items-center justify-center gap-2.5 rounded-full text-[16px] font-semibold text-navy-800', step < 3 ? 'w-44 border border-[#c9d4ea] bg-[#eef3fc]' : 'w-50 border-2 border-brand-600/60 bg-white')}
              >
                <ArrowLeft className="size-5" />
                Retour
              </button>
              {step < 3 ? (
                <button type="button" onClick={() => setStep(step + 1)} className="inline-flex h-11 w-48 items-center justify-center gap-2.5 rounded-full bg-brand-600 text-[16px] font-semibold text-white hover:bg-brand-700">
                  Suivant
                  <ArrowRight className="size-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Préinscription validée')
                    setSent(true)
                  }}
                  className="inline-flex h-11 items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-10 text-[16px] font-semibold text-white hover:bg-emerald-700"
                >
                  <Check className="size-5" strokeWidth={3} />
                  Valider ma préinscription
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RecapBlock({ icon, title, onEdit, children }: { icon: ReactNode; title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex items-center gap-3 bg-[#eef3fc] px-4 py-2">
        <span className="text-brand-600 [&_svg]:size-6">{icon}</span>
        <span className="flex-1 text-[16px] font-bold text-navy-900">{title}</span>
        <button type="button" onClick={onEdit} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#c9d4ea] bg-white px-3 text-[13px] font-semibold text-navy-800">
          <PencilLine className="size-4" />
          Modifier
        </button>
      </div>
      <div className="flex flex-wrap gap-y-1 px-3 py-2.5 text-[13.5px] text-navy-900 [&>span]:border-line [&>span]:px-3 [&>span:not(:first-child)]:border-l">{children}</div>
    </div>
  )
}
