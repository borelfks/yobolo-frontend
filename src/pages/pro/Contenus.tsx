import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import {
  Bold,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  CloudUpload,
  Eye,
  FileText,
  Folder,
  Italic,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  Megaphone,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Underline,
} from 'lucide-react'
import { ProCard, ProFooter, ProHeader, ProLabel, proCard, proInput } from '@/components/domain/pro'
import { Img, Modal } from '@/components/ui/Feedback'
import { Select } from '@/components/ui/Form'
import { LinkTabs } from '@/components/ui/Tabs'
import { useMonEcole } from '@/hooks/useSession'
import { actualites, documentsPro, faq } from '@/mocks/pro'
import { cn } from '@/lib/utils'

const catTone: Record<string, string> = {
  Brochure: 'bg-[#e3ecff] text-brand-700',
  Admission: 'bg-[#e1f6e8] text-emerald-700',
  Règlement: 'bg-[#efe6ff] text-violet-700',
  Calendrier: 'bg-orange-50 text-orange-700',
}

function StatutPill({ s }: { s: string }) {
  return s.startsWith('Publi') ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{s}</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e3ecff] px-2.5 py-0.5 text-[12.5px] font-semibold text-brand-700"><CircleCheck className="size-4 fill-brand-600 text-white" />{s}</span>
  )
}

export default function Contenus() {
  const { tab = '' } = useParams()
  const tabs = [
    { value: '', label: 'Présentation', icon: <FileText /> },
    { value: 'actualites', label: 'Actualités', icon: <Megaphone /> },
    { value: 'documents', label: 'Documents', icon: <Folder /> },
    { value: 'faq', label: 'FAQ', icon: <CircleHelp /> },
  ]
  const current = tabs.find((t) => t.value === tab) ?? tabs[0]
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: 'Contenus et informations', to: '/pro/ecole/contenus' }, ...(tab ? [{ label: current.label }] : [])]}
        icon={<FileText />}
        title="Contenus et informations"
        subtitle="Gérez la présentation, les actualités et les documents de votre établissement."
      />
      <LinkTabs items={tabs} base="/pro/ecole/contenus" variant="block" className="[&>a]:h-12 [&>a]:text-[17px]" />
      {tab === '' && <Presentation />}
      {tab === 'actualites' && <Actualites />}
      {tab === 'documents' && <Documents />}
      {tab === 'faq' && <Faq />}
    </div>
  )
}

function ActuList() {
  return (
    <div className="divide-y divide-line">
      {actualites.map((a) => (
        <div key={a.id} className="flex items-center gap-3 py-2">
          <Img src={a.image} alt="" className="h-12 w-[92px] rounded-lg" />
          <div className="min-w-0 flex-1">
            <Link to={`/pro/ecole/contenus/actualites/${a.id}`} className="block truncate text-[14.5px] font-bold text-navy-900 hover:text-brand-600">{a.titre}</Link>
            <p className="mt-1 flex items-center gap-3 text-[13.5px] text-navy-900">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" />{a.date}</span>
              <StatutPill s={a.statut} />
            </p>
          </div>
          <Link to={`/pro/ecole/contenus/actualites/${a.id}`} aria-label="Modifier" className="grid size-9 place-items-center rounded-lg border border-line bg-white text-navy-800 hover:bg-brand-50"><Pencil className="size-4" /></Link>
          <button type="button" aria-label="Plus d'actions" onClick={() => toast('Dupliquer · Dépublier · Supprimer (démo)')} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800"><MoreHorizontal className="size-5" /></button>
        </div>
      ))}
    </div>
  )
}

function Editor({ value, onChange, max }: { value: string; onChange: (v: string) => void; max: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#c9d4ea]">
      <div className="flex items-center gap-4 border-b border-[#c9d4ea] px-4 py-2 text-navy-900">
        {[Bold, Italic, Underline].map((I, i) => <I key={i} className="size-5" />)}
        <span className="h-5 w-px bg-line" />
        {[List, ListOrdered].map((I, i) => <I key={i} className="size-5" />)}
        <span className="h-5 w-px bg-line" />
        <Link2 className="size-5" />
      </div>
      <textarea rows={4} maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} className="block w-full resize-none px-4 py-3 text-[15px] text-ink outline-none" />
      <p className="px-4 pb-2 text-right text-[13px] text-ink/70">{value.length} / {max}</p>
    </div>
  )
}

function Presentation() {
  const { ecole } = useMonEcole()
  const [titre, setTitre] = useState(`À propos de l’${ecole.sigle}`)
  const [texte, setTexte] = useState('Établissement de formation supérieure qui forme des professionnels opérationnels et compétitifs, adaptés aux besoins des entreprises.')
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.12fr]">
        <ProCard title="Présentation de l’établissement" icon={<FileText />} subtitle="Décrivez votre établissement, sa mission, sa vision et ses atouts.">
          <div className="space-y-3">
            <label className="block"><ProLabel required>Titre de la présentation</ProLabel><input className={proInput} value={titre} onChange={(e) => setTitre(e.target.value)} /></label>
            <div><ProLabel required>Contenu de la présentation</ProLabel><Editor value={texte} onChange={setTexte} max={500} /></div>
            <div className="flex gap-3 rounded-xl bg-[#f3f6fc] px-4 py-3">
              <Lightbulb className="size-7 shrink-0 fill-amber-300 text-amber-500" />
              <div className="text-[13.5px] text-navy-900">
                <p className="font-bold">Conseil</p>
                Rédigez un texte clair et concis (300 à 500 caractères) mettant en avant votre mission, vos formations et vos atouts.
              </div>
            </div>
          </div>
        </ProCard>
        <div className="space-y-4">
          <ProCard
            title={<>Dernières actualités <span className="text-rose-600">({actualites.length})</span></>}
            icon={<Megaphone />}
            action={<Link to="/pro/ecole/contenus/actualites" className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-brand-600/60 px-4 text-[15px] font-semibold text-navy-800 hover:bg-brand-50"><Plus className="size-5" />Nouvelle actualité</Link>}
          >
            <ActuList />
          </ProCard>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/pro/ecole/contenus/documents" className={cn(proCard, 'p-3')}>
              <p className="flex items-center gap-2.5 text-[17px] font-bold text-navy-900"><Folder className="size-7 text-emerald-600" />Documents à télécharger</p>
              <div className="mt-2 flex items-center rounded-xl bg-[#e5f7ea] px-4 py-3">
                <span className="flex-1 leading-tight"><b className="block text-[30px] text-navy-900">{documentsPro.filter((d) => d.statut === 'Publié').length}</b><span className="text-[15px] text-navy-900">Documents publiés</span></span>
                <ChevronRight className="size-6 text-emerald-700" />
              </div>
            </Link>
            <Link to="/pro/ecole/contenus/faq" className={cn(proCard, 'p-3')}>
              <p className="flex items-center gap-2.5 text-[17px] font-bold text-navy-900"><CircleHelp className="size-7 text-violet-600" />FAQ</p>
              <div className="mt-2 flex items-center rounded-xl bg-[#efe8ff] px-4 py-3">
                <span className="flex-1 leading-tight"><b className="block text-[30px] text-navy-900">{faq.length}</b><span className="text-[15px] text-navy-900">Questions / réponses</span></span>
                <ChevronRight className="size-6 text-violet-700" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <ProFooter />
    </>
  )
}

function Actualites() {
  const [open, setOpen] = useState(false)
  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <ProCard
        title={<>Actualités <span className="text-rose-600">({actualites.length})</span></>}
        icon={<Megaphone />}
        action={<button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-[15px] font-semibold text-white"><Plus className="size-5" />Nouvelle actualité</button>}
      >
        <ActuList />
      </ProCard>
      <div className="flex h-fit gap-3 rounded-2xl bg-[#fff6e3] p-4">
        <Lightbulb className="size-7 shrink-0 fill-amber-300 text-amber-500" />
        <p className="text-[14.5px] text-navy-900"><b className="block">Conseil</b>Publiez au moins une actualité par mois : les pages actives remontent dans les recherches YIBOLO.</p>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title="Nouvelle actualité"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">Annuler</button>
            <button type="button" onClick={() => { toast.success('Brouillon enregistré'); setOpen(false) }} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">Brouillon</button>
            <button type="button" onClick={() => { toast.success('Actualité publiée'); setOpen(false) }} className="h-11 rounded-full bg-brand-600 px-6 font-semibold text-white">Publier</button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><ProLabel required>Titre</ProLabel><input className={proInput} placeholder="Ex. Journée portes ouvertes" /></label>
          <label><ProLabel required>Catégorie</ProLabel><Select options={['Rentrée / Admission', 'Événement', 'Formation', 'Résultats']} className="h-10" /></label>
          <label><ProLabel>Date limite (optionnel)</ProLabel><input type="date" className={proInput} /></label>
          <label className="sm:col-span-2"><ProLabel required>Texte</ProLabel><textarea rows={4} className="w-full rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] outline-none" /></label>
        </div>
      </Modal>
    </div>
  )
}

function Documents() {
  const types = ['Brochure', 'Conditions d’admission', 'Liste des pièces', 'Règlement intérieur', 'Calendrier académique']
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#9fb4e3] bg-white py-6 text-center">
          <CloudUpload className="size-10 text-brand-600" />
          <b className="text-[17px] text-navy-900">Ajouter un document à télécharger</b>
          <span className="text-[13.5px] text-navy-900">Glissez-déposez ou cliquez pour sélectionner — PDF, DOCX, XLSX, PPTX (Max. 20 Mo)</span>
          <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && toast.success(`${e.target.files[0].name} ajouté en brouillon`)} />
        </label>
        <ProCard title="Types suggérés" icon={<Lightbulb />}>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => <span key={t} className="rounded-full bg-[#e3ecff] px-3 py-1 text-[13.5px] font-medium text-brand-700">{t}</span>)}
          </div>
        </ProCard>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <table className="w-full min-w-[760px] text-[14.5px] text-navy-900">
          <thead>
            <tr className="bg-[#eef3fc] text-left font-bold">
              <th className="py-3 pl-5">Document</th>
              <th>Catégorie</th>
              <th>Taille</th>
              <th>Date de publication</th>
              <th>Statut</th>
              <th className="pr-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documentsPro.map((d) => (
              <tr key={d.nom} className="border-t border-line">
                <td className="py-3 pl-5">
                  <span className="flex items-center gap-3">
                    <span className={cn('grid h-10 w-9 place-items-center rounded-md text-[10px] font-extrabold text-white', d.type === 'PDF' ? 'bg-rose-600' : d.type === 'XLSX' ? 'bg-emerald-600' : 'bg-brand-600')}>{d.type}</span>
                    <b>{d.nom}</b>
                  </span>
                </td>
                <td><span className={cn('rounded-full px-3 py-1 text-[13px]', catTone[d.categorie] ?? 'bg-slate-100')}>{d.categorie}</span></td>
                <td>{d.taille}</td>
                <td>{d.date}</td>
                <td><StatutPill s={d.statut} /></td>
                <td className="pr-5">
                  <div className="flex justify-center gap-2">
                    <button type="button" aria-label="Voir" onClick={() => toast('Aperçu (démo)')} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800"><Eye className="size-4" /></button>
                    <button type="button" aria-label="Plus d'actions" onClick={() => toast('Renommer · Remplacer · Supprimer (démo)')} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800"><MoreHorizontal className="size-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[15px] text-navy-900">{documentsPro.length} documents</p>
    </div>
  )
}

function Faq() {
  const [cat, setCat] = useState('Toutes')
  const [open, setOpen] = useState<number | null>(0)
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const cats = ['Admission', 'Formation', 'Frais et paiement', 'Diplômes']
  const list = faq.filter((f) => (cat === 'Toutes' || f.categorie === cat) && f.q.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <ProCard title="Catégories" icon={<Folder />} className="h-fit">
        <div className="space-y-1.5">
          {['Toutes', ...cats].map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={cn('flex h-10 w-full items-center justify-between rounded-xl px-3 text-[15px] font-semibold', cat === c ? 'bg-brand-600 text-white' : 'bg-[#f0f4fc] text-navy-900 hover:bg-brand-50')}>
              {c}
              <span className="font-medium">({c === 'Toutes' ? faq.length : faq.filter((f) => f.categorie === c).length})</span>
            </button>
          ))}
        </div>
      </ProCard>
      <ProCard
        title={`${list.length} questions`}
        icon={<CircleHelp />}
        action={<button type="button" onClick={() => setAdding(true)} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-[15px] font-semibold text-white"><Plus className="size-5" />Ajouter une question</button>}
      >
        <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_220px]">
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une question..." className="h-10 w-full rounded-full border border-[#c9d4ea] pr-4 pl-11 text-[14.5px] outline-none" />
          </label>
          <Select aria-label="Catégorie" options={['Toutes', ...cats]} value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-full" />
        </div>
        <div className="space-y-2.5">
          {list.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-line">
              <div className="flex items-center gap-3 px-4 py-3">
                <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex flex-1 items-center gap-2 text-left text-[15px] font-bold text-navy-900">
                  <ChevronDown className={cn('size-5 shrink-0 transition-transform', open === i && 'rotate-180')} />
                  {f.q}
                </button>
                <span className="rounded-full bg-[#e3ecff] px-3 py-0.5 text-[12.5px] font-medium text-brand-700">{f.categorie}</span>
                <StatutPill s="Publié" />
                <button type="button" aria-label="Modifier" onClick={() => toast('Modification de la question (démo)')} className="grid size-8 place-items-center rounded-lg border border-line"><Pencil className="size-4" /></button>
              </div>
              {open === i && <p className="border-t border-line px-4 py-3 text-[14.5px] text-navy-900">{f.r}</p>}
            </div>
          ))}
        </div>
      </ProCard>
      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Ajouter une question"
        footer={
          <>
            <button type="button" onClick={() => setAdding(false)} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">Annuler</button>
            <button type="button" onClick={() => { toast.success('Question ajoutée'); setAdding(false) }} className="h-11 rounded-full bg-brand-600 px-6 font-semibold text-white">Publier</button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block"><ProLabel required>Question</ProLabel><input className={proInput} /></label>
          <label className="block"><ProLabel required>Catégorie</ProLabel><Select options={cats} className="h-10" /></label>
          <label className="block"><ProLabel required>Réponse</ProLabel><textarea rows={4} className="w-full rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] outline-none" /></label>
        </div>
      </Modal>
    </div>
  )
}

