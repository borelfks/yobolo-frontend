import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Bold,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Copy,
  EyeOff,
  FileText,
  Folder,
  Italic,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Underline,
} from 'lucide-react'
import { ProCard, ProFooter, ProHeader, ProLabel } from '@/modules/ecole/espace-pro/components/ProBlocks'
import { ActuModal } from '@/modules/ecole/espace-pro/components/ActuModal'
import { DocumentsATelecharger } from '@/modules/ecole/espace-pro/components/DocumentsATelecharger'
import { proCard, proInput } from '@/modules/ecole/espace-pro/proStyles'
import { texte } from '@/modules/ecole/espace-pro/proData'
import { Img } from '@/shared/ui/Img'
import { Modal } from '@/shared/ui/Modal'
import { Select } from '@/shared/forms/Fields'
import { LinkTabs } from '@/shared/ui/Tabs'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useActualites, useDocuments, useFaq, useParametres } from '@/data/hooks'
import type { QuestionFaq } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { MenuActions } from '@/shared/ui/MenuActions'

/** Statuts des données de démo → clé de traduction. */
const STATUS_KEYS: Record<string, 'publishedF' | 'published' | 'draft' | undefined> = { Publiée: 'publishedF', Publié: 'published', Brouillon: 'draft' }
/** Catégories de la FAQ (données de démo) → clé de traduction. */
const FAQ_CATEGORY_KEYS: Record<string, 'admission' | 'training' | 'diplomas' | undefined> = { Admission: 'admission', Formation: 'training', Diplômes: 'diplomas' }

function StatutPill({ s }: { s: string }) {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const key = STATUS_KEYS[s]
  const label = key ? t(`status.${key}`) : s
  return s.startsWith('Publi') ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{label}</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e3ecff] px-2.5 py-0.5 text-[12.5px] font-semibold text-brand-700"><CircleCheck className="size-4 fill-brand-600 text-white" />{label}</span>
  )
}

export function Contenus() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { tab = '' } = useParams()
  const tabs = [
    { value: '', label: t('contents.tabs.presentation'), icon: <FileText /> },
    { value: 'actualites', label: t('contents.tabs.news'), icon: <Megaphone /> },
    { value: 'documents', label: t('contents.tabs.documents'), icon: <Folder /> },
    { value: 'faq', label: t('contents.tabs.faq'), icon: <CircleHelp /> },
  ]
  const current = tabs.find((x) => x.value === tab) ?? tabs[0]
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('contents.title'), to: ROUTES.pro.contents() }, ...(tab ? [{ label: current.label }] : [])]}
        icon={<FileText />}
        title={t('contents.title')}
        subtitle={t('contents.subtitle')}
      />
      <LinkTabs items={tabs} base={ROUTES.pro.contents()} variant="block" className="[&>a]:h-12 [&>a]:text-[17px]" />
      {tab === '' && <Presentation />}
      {tab === 'actualites' && <Actualites />}
      {tab === 'documents' && <DocumentsATelecharger />}
      {tab === 'faq' && <Faq />}
    </div>
  )
}

function ActuList() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { ecole } = useMonEcole()
  const actualites = useActualites(ecole.id)
  return (
    <div className="divide-y divide-line">
      {actualites.map((a) => (
        <div key={a.id} className="flex items-center gap-2 py-2 sm:gap-3">
          <Img src={a.image} alt="" className="h-12 w-16 shrink-0 rounded-lg sm:w-[92px]" />
          <div className="min-w-0 flex-1">
            <Link to={ROUTES.pro.publication(a.id)} className="line-clamp-2 text-[14.5px] font-bold text-navy-900 hover:text-brand-600 sm:block sm:truncate">{a.titre}</Link>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-navy-900">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><CalendarDays className="size-4" />{a.date}</span>
              <StatutPill s={a.statut} />
            </p>
          </div>
          <Link to={ROUTES.pro.publication(a.id)} aria-label={t('contents.actions.edit')} className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-white text-navy-800 hover:bg-brand-50"><Pencil className="size-4" /></Link>
          <MenuActions
            label={t('contents.actions.more')}
            actions={[
              { label: t('contents.newsList.duplicate'), icon: <Copy />, onClick: async () => { await data.create('actualites', { ...a, id: undefined, etablissementId: ecole.id, titre: `${a.titre}${t('contents.newsList.copySuffix')}`, statut: 'Brouillon' }, 'actualite'); toast.success(t('contents.newsList.duplicated')) } },
              a.statut === 'Publiée'
                ? { label: t('contents.newsList.unpublish'), icon: <EyeOff />, onClick: async () => { await data.update('actualites', a.id, { statut: 'Brouillon' }); toast.success(t('contents.newsList.unpublished')) } }
                : { label: t('contents.newsList.publish'), icon: <Send />, onClick: async () => { await data.update('actualites', a.id, { statut: 'Publiée' }); toast.success(t('contents.newsList.published')) } },
              { label: t('contents.newsList.delete'), icon: <Trash2 />, danger: true, onClick: async () => { await data.remove('actualites', a.id); toast.success(t('contents.newsList.deleted')) } },
            ]}
          />
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
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { ecole } = useMonEcole()
  const actualites = useActualites(ecole.id)
  const documents = useDocuments(ecole.id)
  const faq = useFaq(ecole.id)
  const reglages = useParametres(ecole.id)
  // Valeur enregistrée (réglages `presentation.*`), sinon le texte de la maquette.
  const titreEnregistre = () => texte(reglages, 'presentation.titre', t('contents.presentation.defaultTitle', { sigle: ecole.sigle }))
  const texteEnregistre = () => texte(reglages, 'presentation.texte', t('contents.presentation.defaultText'))
  const [titre, setTitre] = useState(titreEnregistre)
  const [contenu, setContenu] = useState(texteEnregistre)
  const enregistrer = () => data.put('parametres', { id: ecole.id, valeurs: { ...reglages, 'presentation.titre': titre, 'presentation.texte': contenu } })
  const annuler = () => {
    setTitre(titreEnregistre())
    setContenu(texteEnregistre())
  }
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.12fr]">
        <ProCard title={t('contents.presentation.cardTitle')} icon={<FileText />} subtitle={t('contents.presentation.cardSubtitle')}>
          <div className="space-y-3">
            <label className="block"><ProLabel required>{t('contents.presentation.titleLabel')}</ProLabel><input className={proInput} value={titre} onChange={(e) => setTitre(e.target.value)} /></label>
            <div><ProLabel required>{t('contents.presentation.contentLabel')}</ProLabel><Editor value={contenu} onChange={setContenu} max={500} /></div>
            <div className="flex gap-3 rounded-xl bg-[#f3f6fc] px-4 py-3">
              <Lightbulb className="size-7 shrink-0 fill-amber-300 text-amber-500" />
              <div className="text-[13.5px] text-navy-900">
                <p className="font-bold">{t('contents.tip')}</p>
                {t('contents.presentation.tipText')}
              </div>
            </div>
          </div>
        </ProCard>
        <div className="space-y-4">
          <ProCard
            title={<>{t('contents.presentation.latestNews')} <span className="text-rose-600">({actualites.length})</span></>}
            icon={<Megaphone />}
            action={<Link to={ROUTES.pro.contents('actualites')} className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-brand-600/60 px-4 text-[15px] font-semibold text-navy-800 hover:bg-brand-50"><Plus className="size-5" />{t('contents.presentation.newNews')}</Link>}
          >
            <ActuList />
          </ProCard>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to={ROUTES.pro.contents('documents')} className={cn(proCard, 'p-3')}>
              <p className="flex items-center gap-2.5 text-[17px] font-bold text-navy-900"><Folder className="size-7 text-emerald-600" />{t('contents.presentation.documentsTitle')}</p>
              <div className="mt-2 flex items-center rounded-xl bg-[#e5f7ea] px-4 py-3">
                <span className="flex-1 leading-tight"><b className="block text-[30px] text-navy-900">{documents.filter((d) => d.statut === 'Publié').length}</b><span className="text-[15px] text-navy-900">{t('contents.presentation.documentsPublished')}</span></span>
                <ChevronRight className="size-6 text-emerald-700" />
              </div>
            </Link>
            <Link to={ROUTES.pro.contents('faq')} className={cn(proCard, 'p-3')}>
              <p className="flex items-center gap-2.5 text-[17px] font-bold text-navy-900"><CircleHelp className="size-7 text-violet-600" />{t('contents.presentation.faqTitle')}</p>
              <div className="mt-2 flex items-center rounded-xl bg-[#efe8ff] px-4 py-3">
                <span className="flex-1 leading-tight"><b className="block text-[30px] text-navy-900">{faq.length}</b><span className="text-[15px] text-navy-900">{t('contents.presentation.faqCount')}</span></span>
                <ChevronRight className="size-6 text-violet-700" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <ProFooter onCancel={annuler} onSave={enregistrer} />
    </>
  )
}

function Actualites() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { ecole } = useMonEcole()
  const actualites = useActualites(ecole.id)
  const [open, setOpen] = useState(false)
  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <ProCard
        title={<>{t('contents.news.title')} <span className="text-rose-600">({actualites.length})</span></>}
        icon={<Megaphone />}
        action={<button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-[15px] font-semibold text-white"><Plus className="size-5" />{t('contents.news.newNews')}</button>}
      >
        <ActuList />
      </ProCard>
      <div className="flex h-fit gap-3 rounded-2xl bg-[#fff6e3] p-4">
        <Lightbulb className="size-7 shrink-0 fill-amber-300 text-amber-500" />
        <p className="text-[14.5px] text-navy-900"><b className="block">{t('contents.tip')}</b>{t('contents.news.tipText')}</p>
      </div>
      <ActuModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

function Faq() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const [cat, setCat] = useState('Toutes')
  const [open, setOpen] = useState<number | null>(0)
  const [q, setQ] = useState('')
  const { ecole } = useMonEcole()
  const faq = useFaq(ecole.id)
  // Fenêtre « Ajouter une question », aussi utilisée pour modifier une question (crayon).
  const [adding, setAdding] = useState(false)
  const [edition, setEdition] = useState<QuestionFaq | null>(null)
  const [question, setQuestion] = useState('')
  const [reponse, setReponse] = useState('')
  const cats = ['Admission', 'Formation', 'Diplômes']
  const [categorie, setCategorie] = useState(cats[0] ?? '')
  const ouvrir = (f: QuestionFaq | null) => {
    setEdition(f)
    setQuestion(f?.q ?? '')
    setReponse(f?.r ?? '')
    setCategorie(f?.categorie ?? cats[0] ?? '')
    setAdding(true)
  }
  const enregistrer = async () => {
    if (!question.trim() || !reponse.trim()) return void toast.error(t('contents.faq.required'))
    const champs = { q: question.trim(), r: reponse.trim(), categorie }
    if (edition) await data.update('faq', edition.id, champs)
    else await data.create('faq', { ...champs, etablissementId: ecole.id }, 'faq')
    toast.success(t(edition ? 'contents.faq.updated' : 'contents.faq.added'))
    setAdding(false)
  }
  const list = faq.filter((f) => (cat === 'Toutes' || f.categorie === cat) && f.q.toLowerCase().includes(q.toLowerCase()))
  const categoryLabel = (c: string) => {
    if (c === 'Toutes') return t('contents.faq.categories.all')
    const key = FAQ_CATEGORY_KEYS[c]
    return key ? t(`contents.faq.categories.${key}`) : c
  }
  const categoryOptions = (values: string[]) => values.map((c) => ({ value: c, label: categoryLabel(c) }))
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <ProCard title={t('contents.faq.categoriesTitle')} icon={<Folder />} className="h-fit">
        <div className="space-y-1.5">
          {['Toutes', ...cats].map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={cn('flex h-10 w-full items-center justify-between rounded-xl px-3 text-[15px] font-semibold', cat === c ? 'bg-brand-600 text-white' : 'bg-[#f0f4fc] text-navy-900 hover:bg-brand-50')}>
              {categoryLabel(c)}
              <span className="font-medium">({c === 'Toutes' ? faq.length : faq.filter((f) => f.categorie === c).length})</span>
            </button>
          ))}
        </div>
      </ProCard>
      <ProCard
        title={t('contents.faq.count', { count: list.length })}
        icon={<CircleHelp />}
        action={<button type="button" onClick={() => ouvrir(null)} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-[15px] font-semibold text-white"><Plus className="size-5" />{t('contents.faq.add')}</button>}
      >
        <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_220px]">
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-900" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('contents.faq.searchPlaceholder')} className="h-10 w-full rounded-full border border-[#c9d4ea] pr-4 pl-11 text-[14.5px] outline-none" />
          </label>
          <Select aria-label={t('contents.faq.categoryAria')} options={categoryOptions(['Toutes', ...cats])} value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-full" />
        </div>
        <div className="space-y-2.5">
          {list.map((f, i) => (
            <div key={f.id} className="rounded-xl border border-line">
              {/* Sur téléphone, la question prend toute la ligne ; catégorie, statut et crayon passent dessous. */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 sm:flex-nowrap sm:px-4">
                <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex min-w-0 flex-1 basis-full items-center gap-2 text-left text-[15px] font-bold text-navy-900 sm:basis-auto">
                  <ChevronDown className={cn('size-5 shrink-0 transition-transform', open === i && 'rotate-180')} />
                  {f.q}
                </button>
                <span className="rounded-full bg-[#e3ecff] px-3 py-0.5 text-[12.5px] font-medium text-brand-700">{categoryLabel(f.categorie)}</span>
                <StatutPill s="Publié" />
                <button type="button" aria-label={t('contents.actions.edit')} onClick={() => ouvrir(f)} className="grid size-8 place-items-center rounded-lg border border-line"><Pencil className="size-4" /></button>
              </div>
              {open === i && <p className="border-t border-line px-4 py-3 text-[14.5px] text-navy-900">{f.r}</p>}
            </div>
          ))}
        </div>
      </ProCard>
      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title={edition ? t('contents.actions.edit') : t('contents.faq.add')}
        footer={
          <>
            <button type="button" onClick={() => setAdding(false)} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">{t('contents.actions.cancel')}</button>
            <button type="button" onClick={() => void enregistrer()} className="h-11 rounded-full bg-brand-600 px-6 font-semibold text-white">{t('contents.actions.publish')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block"><ProLabel required>{t('contents.faq.form.question')}</ProLabel><input className={proInput} value={question} onChange={(e) => setQuestion(e.target.value)} /></label>
          <label className="block"><ProLabel required>{t('contents.faq.form.category')}</ProLabel><Select options={categoryOptions(cats)} value={categorie} onChange={(e) => setCategorie(e.target.value)} className="h-10" /></label>
          <label className="block"><ProLabel required>{t('contents.faq.form.answer')}</ProLabel><textarea rows={4} value={reponse} onChange={(e) => setReponse(e.target.value)} className="w-full rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] outline-none" /></label>
        </div>
      </Modal>
    </div>
  )
}
