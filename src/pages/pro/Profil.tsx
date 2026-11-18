import { useState, type ReactNode } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import {
  Award,
  Building2,
  Calendar,
  Camera,
  ChevronDown,
  CircleCheck,
  CloudUpload,
  Contact,
  Eye,
  FileText,
  GraduationCap,
  Globe,
  ImageIcon,
  Info,
  Layers,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  Video,
} from 'lucide-react'
import { ProCard, ProFooter, ProHeader, ProLabel, proInput } from '@/components/domain/pro'
import { Img } from '@/components/ui/Feedback'
import { LinkTabs } from '@/components/ui/Tabs'
import { useMonEcole } from '@/hooks/useSession'
import { quartiers, regions, villes } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const typeOptions = [
  { value: 'IPES', label: 'IPES (Institut Privé d’Enseignement Supérieur)' },
  { value: 'CFP', label: 'CFP (Centre de Formation Professionnelle)' },
  { value: 'Autre', label: 'Autre établissement de formation' },
]

function SelectBox({ value, options, icon }: { value: string; options: { value: string; label: string }[]; icon?: ReactNode }) {
  const [v, setV] = useState(value)
  return (
    <label className="relative flex h-10 items-center gap-2.5 rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[15px] text-navy-900">
      {icon && <span className="text-navy-800 [&_svg]:size-5">{icon}</span>}
      <span className="flex-1 truncate">{options.find((o) => o.value === v)?.label ?? v}</span>
      <ChevronDown className="size-5" />
      <select value={v} onChange={(e) => setV(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

function IconInput({ icon, defaultValue, placeholder }: { icon: ReactNode; defaultValue?: string; placeholder?: string }) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-navy-800 [&_svg]:size-5">{icon}</span>
      <input defaultValue={defaultValue} placeholder={placeholder} className={cn(proInput, 'pl-11')} />
    </span>
  )
}

const opts = (xs: string[]) => xs.map((x) => ({ value: x, label: x }))

export default function Profil() {
  const { tab = '' } = useParams()
  const tabs = [
    { value: '', label: 'Informations générales', icon: <FileText /> },
    { value: 'coordonnees', label: 'Coordonnées', icon: <MapPin /> },
    { value: 'agrement', label: 'Agrément & documents', icon: <ShieldCheck /> },
    { value: 'medias', label: 'Médias (logo, photos)', icon: <ImageIcon /> },
  ]
  const pages: Record<string, { icon: ReactNode; title: string; subtitle: string; crumb?: string }> = {
    '': { icon: <Building2 />, title: 'Profil de l’établissement', subtitle: 'Renseignez et mettez à jour les informations principales de votre établissement.' },
    coordonnees: { icon: <MapPin />, title: 'Coordonnées', subtitle: 'Renseignez les informations de contact et de localisation de votre établissement.' },
    agrement: { icon: <ShieldCheck />, title: 'Agrément & documents', subtitle: 'Renseignez les informations d’agrément et téléchargez vos documents officiels.' },
    medias: { icon: <ImageIcon />, title: 'Médias (logo, photos, vidéos)', subtitle: 'Ajoutez et gérez les visuels de votre établissement.' },
  }
  const page = pages[tab] ?? pages['']
  return (
    <div className="space-y-3.5">
      <ProHeader crumbs={[{ label: 'Profil de l’établissement', to: '/pro/ecole/profil' }, ...(tab ? [{ label: page.title }] : [])]} icon={page.icon} title={page.title} subtitle={page.subtitle} />
      {tab === '' && <Banniere />}
      <LinkTabs items={tabs} base="/pro/ecole/profil" variant="block" className="[&>a]:h-11 [&>a]:rounded-full [&>a]:text-[15px]" />
      {tab === '' && <Infos />}
      {tab === 'coordonnees' && <Coordonnees />}
      {tab === 'agrement' && <Agrement />}
      {tab === 'medias' && <Medias />}
      <ProFooter />
    </div>
  )
}

function Banniere() {
  const { ecole } = useMonEcole()
  return (
    <section className="relative flex h-[126px] overflow-hidden rounded-2xl bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_70%,#1a47c4_100%)] text-white">
      <Img src={ecole.id === 'ipc' ? '/maquette/pro-banniere-batiment.jpg' : ecole.image} alt="" className="hidden h-[126px] w-[258px] shrink-0 md:block" />
      <div className="min-w-0 flex-1 px-7 py-4">
        <p className="truncate text-[22px] font-bold">{ecole.nom}</p>
        <p className="text-[16px] text-white/90">Formations professionnelles et diplômes reconnus</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-6 text-[16px]">
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-5 fill-white text-navy-800" />{ecole.ville} – {ecole.quartier}</span>
          <span className="inline-flex items-center gap-1.5"><Star className="size-5 fill-amber-400 text-amber-400" />{ecole.note.toLocaleString('fr-FR')}/5 ({ecole.avis} avis)</span>
        </p>
      </div>
      <div className="relative hidden w-[277px] shrink-0 md:block">
        <Img src="/maquette/pro-banniere-droite.jpg" alt="" className="h-full w-full" />
        <button type="button" onClick={() => toast('Choisissez une nouvelle bannière (démo)')} className="absolute right-2.5 bottom-2.5 inline-flex h-10 w-[172px] items-center justify-center gap-2 rounded-lg border border-white/60 bg-[#1b2537] px-3 text-[13.5px] font-semibold text-white hover:bg-[#111a2a]">
          <Camera className="size-5" />
          Changer la bannière
        </button>
      </div>
    </section>
  )
}

function Infos() {
  const { ecole, formations } = useMonEcole()
  const [publie, setPublie] = useState(true)
  const [texte, setTexte] = useState(ecole.description.replace(/^L'Institut Professionnel du Centre \(IPC\) est un établissement/, 'Établissement'))
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <ProCard title="Informations générales" icon={<Info />}>
        <div className="grid gap-x-6 gap-y-3 md:grid-cols-[1.55fr_1fr]">
          <label><ProLabel required>Nom de l’établissement</ProLabel><input className={proInput} defaultValue={ecole.nom.replace(/ \([^)]*\)$/, '')} /></label>
          <label><ProLabel required>Sigle</ProLabel><input className={proInput} defaultValue={ecole.sigle} /></label>
          <label><ProLabel required>Type d’établissement</ProLabel><SelectBox value={ecole.type} options={typeOptions} /></label>
          <label><ProLabel>Année de création</ProLabel><IconInput icon={<Calendar />} defaultValue="2018" /></label>
          <label className="md:col-span-2">
            <ProLabel required>Présentation (courte)</ProLabel>
            <span className="relative block">
              <textarea rows={3} maxLength={300} value={texte} onChange={(e) => setTexte(e.target.value)} className="w-full resize-none rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-brand-500" />
              <span className="absolute right-3 bottom-2 text-[12px] text-ink/70">{texte.length} / 300</span>
            </span>
          </label>
        </div>
      </ProCard>
      <div className="space-y-4">
        <ProCard title="Statut et visibilité" icon={<Award />}>
          <p className="flex items-center gap-2.5 rounded-xl bg-[#e5f7ea] px-4 py-2.5 text-[17px] font-semibold text-emerald-700">
            <CircleCheck className="size-6 fill-emerald-600 text-white" />
            Établissement vérifié
          </p>
          <div className="mt-3 flex items-center gap-2.5 text-[15px] text-navy-900">
            <Globe className="size-5 text-navy-800" />
            <span className="flex-1">Publier sur YIBOLO</span>
            <button type="button" role="switch" aria-checked={publie} onClick={() => setPublie(!publie)} className={cn('relative h-7 w-12 rounded-full transition-colors', publie ? 'bg-brand-600' : 'bg-slate-300')}>
              <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', publie ? 'left-[22px]' : 'left-0.5')} />
            </button>
          </div>
        </ProCard>
        <ProCard title="Chiffres clés (optionnel)" icon={<Layers />}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-[#e8f0ff] px-3 py-3">
              <GraduationCap className="size-9 text-brand-600" />
              <p className="leading-tight"><b className="block text-[26px] text-navy-900">{Math.max(ecole.formations, formations.length)}</b><span className="text-[15px] text-navy-900">Formations</span></p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-[#e5f7ea] px-3 py-3">
              <Layers className="size-9 text-emerald-600" />
              <p className="leading-tight"><b className="block text-[26px] text-navy-900">{(ecole.principales ?? ecole.filieres).length}</b><span className="text-[15px] text-navy-900">Filières</span></p>
            </div>
          </div>
        </ProCard>
      </div>
    </div>
  )
}

function Coordonnees() {
  const { ecole } = useMonEcole()
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_405px]">
      <ProCard title="Informations de contact" icon={<Contact />}>
        <div className="grid gap-x-5 gap-y-3 md:grid-cols-2">
          <label><ProLabel required>Région</ProLabel><SelectBox value={ecole.region} options={opts(regions.map((r) => r.nom))} /></label>
          <label><ProLabel required>Ville</ProLabel><SelectBox value={ecole.ville} options={opts(villes.map((v) => v.nom))} /></label>
          <label><ProLabel required>Quartier</ProLabel><SelectBox value={ecole.quartier} options={opts([...new Set([ecole.quartier, ...quartiers])])} /></label>
          <label><ProLabel>Lieu-dit</ProLabel><input className={proInput} defaultValue="Avenue Germaine" /></label>
          <label className="md:col-span-2"><ProLabel required>Adresse complète</ProLabel><IconInput icon={<MapPin />} defaultValue="Avenue Germaine, immeuble Vision Confort, 3e étage" /></label>
          <label><ProLabel required>Téléphone principal</ProLabel><IconInput icon={<Phone />} defaultValue={ecole.telephone} /></label>
          <label><ProLabel>Téléphone secondaire <span className="font-normal">(optionnel)</span></ProLabel><IconInput icon={<Phone />} defaultValue="+237 6 75 43 21 09" /></label>
          <label><ProLabel required>E-mail</ProLabel><IconInput icon={<Mail />} defaultValue={ecole.email} /></label>
          <label><ProLabel>Site web <span className="font-normal">(optionnel)</span></ProLabel><IconInput icon={<Globe />} defaultValue={`www.${ecole.sigle.toLowerCase().replace(/\s+/g, '')}.cm`} /></label>
        </div>
      </ProCard>
      <ProCard title="Aperçu des coordonnées (page publique)" icon={<Eye />} className="[&_h2]:text-[17px]">
        <ul className="space-y-2 text-[15px] text-navy-900 [&_svg]:size-5 [&_svg]:text-brand-600">
          <li className="flex items-center gap-3"><MapPin className="fill-brand-600 !text-white" />Avenue Germaine, {ecole.quartier} – {ecole.ville} ({ecole.region})</li>
          <li className="flex items-center gap-3"><Phone />{ecole.telephone}</li>
          <li className="flex items-center gap-3"><Mail />{ecole.email}</li>
          <li className="flex items-center gap-3"><Globe />www.{ecole.sigle.toLowerCase().replace(/\s+/g, '')}.cm</li>
        </ul>
        <Img src="/maquette/pro-carte.jpg" alt="Plan d’accès" className="mt-3 h-[188px] w-full rounded-xl" />
      </ProCard>
    </div>
  )
}

function Agrement() {
  const docs = [
    { nom: 'Autorisation d’ouverture', taille: '2,4 Mo' },
    { nom: 'Statuts de l’établissement', taille: '1,8 Mo' },
    { nom: 'Certificat du NIU', taille: '1,2 Mo' },
  ]
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_430px]">
      <ProCard title="Informations d’agrément" icon={<Award />}>
        <div className="grid gap-x-6 gap-y-3 md:grid-cols-[1.45fr_1fr]">
          <label><ProLabel required>Autorisation d’ouverture / Agrément</ProLabel><input className={proInput} defaultValue="N° 184/MINEFOP du 08 septembre 2015" /></label>
          <label><ProLabel required>Date de délivrance</ProLabel><IconInput icon={<Calendar />} defaultValue="08/09/2015" /></label>
          <label><ProLabel required>Autorité de délivrance</ProLabel><SelectBox value="MINEFOP" options={opts(['MINEFOP', 'MINESUP', 'MINTRANSPORTS', 'Autre'])} /></label>
          <label><ProLabel>Date d’expiration <span className="font-normal">(si applicable)</span></ProLabel><IconInput icon={<Calendar />} defaultValue="—" /></label>
          <label><ProLabel required>Numéro de contribuable (NIU)</ProLabel><input className={proInput} defaultValue="M123456789012" /></label>
          <label><ProLabel required>RCCM</ProLabel><input className={proInput} defaultValue="RC/YAO/2018/B/1234" /></label>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#e5f7ea] px-4 py-3">
          <CircleCheck className="size-8 fill-emerald-600 text-white" />
          <div className="flex-1">
            <p className="text-[17px] font-bold text-emerald-700">Établissement vérifié</p>
            <p className="text-[14px] text-navy-900">Vos documents ont été contrôlés et validés par YIBOLO.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-600 bg-white px-4 py-1 text-[15px] font-semibold text-emerald-700">✓ Conforme</span>
        </div>
      </ProCard>
      <ProCard title="Documents officiels" icon={<Upload />}>
        <div className="space-y-2">
          {docs.map((d) => (
            <div key={d.nom} className="flex items-center gap-3 rounded-xl bg-[#f3f6fc] px-3 py-2">
              <span className="grid h-10 w-9 place-items-center rounded-md bg-rose-600 text-[10px] font-extrabold text-white">PDF</span>
              <span className="flex-1 leading-tight">
                <b className="block text-[15px] text-navy-900">{d.nom}</b>
                <span className="text-[13px] text-navy-900">PDF • {d.taille}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />Validé</span>
              <button type="button" aria-label="Voir" onClick={() => toast('Aperçu du document (démo)')} className="text-brand-600"><Eye className="size-5" /></button>
              <button type="button" aria-label="Supprimer" onClick={() => toast('Document supprimé (démo)')} className="text-rose-600"><Trash2 className="size-5" /></button>
            </div>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-[#9fb4e3] py-4 text-center">
          <CloudUpload className="size-8 text-brand-600" />
          <b className="text-[16px] text-navy-900">Ajouter un document</b>
          <span className="text-[13px] text-navy-900">PDF, JPG ou PNG (Max. 10 Mo)</span>
          <span className="mt-1 inline-flex h-10 items-center gap-2 rounded-full border-2 border-brand-600/60 px-8 text-[15px] font-semibold text-navy-800"><Plus className="size-5" />Choisir un fichier</span>
          <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && toast.success(`${e.target.files[0].name} envoyé pour vérification`)} />
        </label>
      </ProCard>
    </div>
  )
}

function Medias() {
  const { ecole } = useMonEcole()
  const [f, setF] = useState('toutes')
  const items = [
    { src: '/maquette/media-1.jpg', video: false },
    { src: '/maquette/media-2.jpg', video: false },
    { src: '/maquette/media-3.jpg', video: false },
    { src: '/maquette/media-4.jpg', video: true },
    { src: '/maquette/media-5.jpg', video: false },
    { src: '/maquette/media-6.jpg', video: false },
  ]
  const shown = items.filter((x) => f === 'toutes' || (f === 'videos' ? x.video : !x.video))
  return (
    <div className="grid gap-4 xl:grid-cols-[370px_1fr]">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><ImageIcon className="size-6 text-brand-600" />Bannière de couverture</h2>
        <div className="relative mt-3 overflow-hidden rounded-xl">
          <Img src="/maquette/pro-banniere.jpg" alt="Bannière" className="h-[130px] w-full" />
          <button type="button" aria-label="Modifier la bannière" onClick={() => toast('Choisir une image (démo)')} className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-white text-brand-600 shadow"><Pencil className="size-4" /></button>
        </div>
        <h2 className="mt-4 flex items-center gap-2.5 border-t border-line pt-4 text-[19px] font-bold text-navy-900"><ImageIcon className="size-6 text-brand-600" />Logo de l’établissement</h2>
        <div className="mt-3 flex gap-4">
          <div className="relative">
            <Img src={ecole.id === 'ipc' ? '/maquette/pro-logo-ipc.jpg' : ecole.image} alt="Logo" className="size-[130px] rounded-xl border border-line" />
            <button type="button" aria-label="Modifier le logo" onClick={() => toast('Choisir un logo (démo)')} className="absolute -top-1 -right-1 grid size-8 place-items-center rounded-full bg-white text-brand-600 shadow"><Pencil className="size-4" /></button>
          </div>
          <div className="space-y-2 text-[13.5px] text-navy-900">
            <button type="button" onClick={() => toast('Choisir un logo (démo)')} className="inline-flex h-9 items-center gap-2 rounded-full border-2 border-brand-600/60 px-4 text-[14px] font-semibold text-navy-800"><Upload className="size-4" />Changer le logo</button>
            <p>Format : PNG ou JPG<br />Taille recommandée : 500 × 500 px</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><Layers className="size-6 text-brand-600" />Galerie médias</h2>
          <div className="flex gap-2">
            {[['toutes', 'Toutes (12)'], ['photos', 'Photos (10)'], ['videos', 'Vidéos (2)']].map(([k, l]) => (
              <button key={k} type="button" onClick={() => setF(k)} className={cn('h-8 rounded-full px-4 text-[13.5px] font-semibold', f === k ? 'bg-brand-600 text-white' : 'border border-line bg-white text-navy-900')}>{l}</button>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {shown.map((m) => (
            <button key={m.src} type="button" onClick={() => toast(m.video ? 'Lecture de la vidéo (démo)' : 'Options du média (démo)')} className="overflow-hidden rounded-xl">
              <Img src={m.src} alt={m.video ? 'Vidéo' : 'Photo'} className="h-[112px] w-full" />
            </button>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer flex-wrap items-center gap-4 rounded-xl border-2 border-dashed border-[#9fb4e3] px-5 py-3">
          <CloudUpload className="size-10 text-brand-600" />
          <span className="flex-1">
            <b className="block text-[15px] text-brand-700">Ajouter des photos ou vidéos</b>
            <span className="text-[13px] text-navy-900">Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</span>
          </span>
          <span className="space-y-1 border-l border-line pl-4 text-[13px] text-navy-900">
            <span className="flex items-center gap-2"><ImageIcon className="size-4" />Images : JPG, PNG (Max. 10 Mo)</span>
            <span className="flex items-center gap-2"><Video className="size-4" />Vidéos : MP4 (Max. 100 Mo)</span>
          </span>
          <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && toast.success(`${e.target.files[0].name} ajouté`)} />
        </label>
      </div>
    </div>
  )
}
