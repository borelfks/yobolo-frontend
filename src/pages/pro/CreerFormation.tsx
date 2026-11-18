import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Calendar, Check, ChartNoAxesColumnIncreasing, ChevronDown, CircleCheck, Eye, GraduationCap, Lightbulb, Save, X } from 'lucide-react'
import { ProHeader, ProLabel, proCard, proInput } from '@/components/domain/pro'
import { useMonEcole } from '@/hooks/useSession'
import { formationById } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="border-b border-line px-5 py-4 last:border-0">
      <h2 className="mb-3 flex items-center gap-3 text-[20px] font-bold text-navy-900">
        <span className="grid size-8 place-items-center rounded-full bg-brand-600 text-[16px] text-white">{n}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}

function SelectBox({ value, options, onChange, icon }: { value: string; options: string[]; onChange?: (v: string) => void; icon?: ReactNode }) {
  return (
    <label className="relative flex h-10 items-center gap-2.5 rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[15px] text-navy-900">
      {icon}
      <span className="flex-1 truncate">{value}</span>
      <ChevronDown className="size-5" />
      <select value={value} onChange={(e) => onChange?.(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}

export default function CreerFormation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ecole } = useMonEcole()
  const edit = id ? formationById(id) : null
  const diplomes = ecole.type === 'IPES' ? ['BTS', 'Licence', 'Master', 'Ingénieur', 'Certificat'] : ecole.type === 'CFP' ? ['CQP', 'DQP', 'Certificat', 'Attestation'] : ['Attestation', 'Certification', 'Certificat']
  const [intitule, setIntitule] = useState(edit?.nom ?? 'BTS Comptabilité & Gestion')
  const [diplome, setDiplome] = useState(edit?.diplome ?? diplomes[0])
  const [filiere, setFiliere] = useState(edit?.filiere ?? 'Comptabilité & Gestion')
  const [niveau, setNiveau] = useState('Bac')
  const [duree, setDuree] = useState(edit ? `${edit.dureeMois} mois` : '24 mois')
  const [modes, setModes] = useState<string[]>(edit ? (edit.mode === 'Jour & Soir' ? ['Jour', 'Soir'] : [edit.mode]) : ['Jour', 'Soir'])
  const [rentree, setRentree] = useState('06 octobre 2026')
  const [inscription, setInscription] = useState('50 000')
  const [scolarite, setScolarite] = useState(edit ? edit.fraisAn.toLocaleString('fr-FR') : '450 000')
  const [paiement, setPaiement] = useState('Plusieurs options')
  const [description, setDescription] = useState('Formation professionnelle qui forme des techniciens supérieurs capables de gérer la comptabilité, la gestion financière et le contrôle de gestion d’une organisation.')
  const [validation, setValidation] = useState(false)
  const checks = [
    { label: 'Informations générales', ok: intitule.length > 2 },
    { label: 'Organisation de la formation', ok: modes.length > 0 && rentree !== '' },
    { label: 'Frais de formation', ok: scolarite !== '' },
    { label: 'Description et validation', ok: validation },
  ]
  const pct = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
  const filieres = [...new Set([filiere, ...(ecole.principales ?? ecole.filieres)])]
  const toggleMode = (m: string) => setModes(modes.includes(m) ? modes.filter((x) => x !== m) : [...modes, m])
  const side = 'flex h-11 w-full items-center justify-center gap-2.5 rounded-full text-[16px] font-semibold'
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: 'Formations', to: '/pro/ecole/formations' }, { label: edit ? 'Modifier une formation' : 'Créer une formation' }]}
        icon={<GraduationCap />}
        title={edit ? 'Modifier une formation' : 'Créer une formation'}
        subtitle={edit ? 'Mettez à jour les informations de votre formation.' : 'Renseignez les informations de votre nouvelle formation.'}
        actions={<span />}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_336px]">
        <div className={proCard}>
          <Block n={1} title="Informations générales">
            <div className="grid gap-x-5 gap-y-3 md:grid-cols-[1.25fr_1fr]">
              <label><ProLabel required>Intitulé de la formation</ProLabel><input className={proInput} value={intitule} onChange={(e) => setIntitule(e.target.value)} /></label>
              <label><ProLabel required>Diplôme préparé</ProLabel><SelectBox value={diplome} options={diplomes} onChange={setDiplome} /></label>
              <label><ProLabel required>Filière</ProLabel><SelectBox value={filiere} options={filieres} onChange={setFiliere} /></label>
              <label><ProLabel required>Niveau</ProLabel><SelectBox value={niveau} options={['Aucun', 'Probatoire', 'Bac', 'BTS / HND', 'Licence']} onChange={setNiveau} /></label>
            </div>
          </Block>
          <Block n={2} title="Organisation de la formation">
            <div className="grid gap-x-5 gap-y-3 md:grid-cols-[0.75fr_1.2fr_0.85fr]">
              <label><ProLabel required>Durée</ProLabel><SelectBox value={duree} options={['3 mois', '6 mois', '9 mois', '12 mois', '18 mois', '24 mois', '36 mois']} onChange={setDuree} /></label>
              <div>
                <ProLabel required>Mode de cours</ProLabel>
                <div className="flex h-10 items-center gap-5 text-[15px] text-navy-900">
                  {['Jour', 'Soir', 'Alternance'].map((m) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={modes.includes(m)} onChange={() => toggleMode(m)} className="size-5 accent-brand-600" />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <label>
                <ProLabel required>Prochaine rentrée</ProLabel>
                <span className="relative block">
                  <Calendar className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" />
                  <input className={cn(proInput, 'pl-10')} value={rentree} onChange={(e) => setRentree(e.target.value)} />
                </span>
              </label>
            </div>
          </Block>
          <Block n={3} title="Frais de formation">
            <div className="grid gap-x-5 gap-y-3 md:grid-cols-3">
              <label><ProLabel required>Frais d’inscription (FCFA)</ProLabel><input className={proInput} value={inscription} onChange={(e) => setInscription(e.target.value)} /></label>
              <label><ProLabel required>Frais de scolarité / an (FCFA)</ProLabel><input className={proInput} value={scolarite} onChange={(e) => setScolarite(e.target.value)} /></label>
              <label><ProLabel>Mode de paiement</ProLabel><SelectBox value={paiement} options={['Plusieurs options', 'En une fois', 'En deux tranches', 'Mensuel']} onChange={setPaiement} /></label>
            </div>
          </Block>
          <Block n={4} title="Description (aperçu)">
            <label>
              <ProLabel required>Présentation courte de la formation</ProLabel>
              <span className="relative block">
                <textarea rows={3} maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-none rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-brand-500" />
              </span>
              <span className="mt-1 block text-right text-[13px] text-ink/70">{description.length} / 300</span>
            </label>
          </Block>
        </div>
        <aside className="space-y-4">
          <div className={cn(proCard, 'p-4')}>
            <h2 className="flex items-center gap-2.5 text-[20px] font-bold text-navy-900"><ChartNoAxesColumnIncreasing className="size-7 text-brand-600" />Progression de création</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-[#e6ecf7]"><span className="block h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} /></span>
              <b className="text-[15px] text-navy-900">{pct} %</b>
            </div>
            <ul className="mt-3 space-y-2">
              {checks.map((c) => (
                <li key={c.label}>
                  <button type="button" onClick={() => c.label.startsWith('Description') && setValidation(!validation)} className="flex items-center gap-3 text-[15px] text-navy-900">
                    {c.ok ? <CircleCheck className="size-5 fill-emerald-600 text-white" /> : <span className="h-4 w-6 rounded-full border-2 border-brand-600" />}
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-[#fff6e3] p-4">
            <h2 className="flex items-center gap-2.5 text-[20px] font-bold text-navy-900"><Lightbulb className="size-7 fill-amber-300 text-amber-500" />Bon à savoir</h2>
            <ul className="mt-2 list-disc space-y-1 pl-9 text-[14.5px] text-navy-900 marker:text-amber-500">
              <li>Les champs marqués d’un <span className="text-rose-500">*</span> sont obligatoires.</li>
              <li>Vous pourrez ensuite compléter le programme, les conditions d’admission et les débouchés.</li>
            </ul>
          </div>
          <div className={cn(proCard, 'space-y-2.5 p-3')}>
            <button type="button" onClick={() => { toast.success('Formation envoyée pour validation par YIBOLO'); navigate('/pro/ecole/formations') }} className={cn(side, 'bg-brand-600 text-white hover:bg-brand-700')}><Check className="size-5" strokeWidth={3} />Enregistrer et continuer</button>
            <button type="button" onClick={() => { toast.success('Brouillon enregistré'); navigate('/pro/ecole/formations') }} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><Save className="size-5" />Enregistrer en brouillon</button>
            <button type="button" onClick={() => toast('Aperçu de la fiche formation (démo)')} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><Eye className="size-5" />Aperçu</button>
            <button type="button" onClick={() => navigate('/pro/ecole/formations')} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><X className="size-5" />Annuler</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
