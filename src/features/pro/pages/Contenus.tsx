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
import { ProCard, ProFooter, ProHeader, ProLabel } from '@/features/pro/components/ProBlocks'
import { proCard, proInput } from '@/features/pro/proStyles'
import { Img } from '@/shared/components/ui/Img'
import { Modal } from '@/shared/components/ui/Modal'
import { Select } from '@/shared/components/forms/Fields'
import { LinkTabs } from '@/shared/components/ui/Tabs'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { actualites, documentsPro, faq } from '@/mocks/pro'

const catTone: Record<string, string> = {
  Brochure: 'bg-[#e3ecff] text-brand-700',
  Admission: 'bg-[#e1f6e8] text-emerald-700',
  Règlement: 'bg-[#efe6ff] text-violet-700',
  Calendrier: 'bg-orange-50 text-orange-700',
}

/** Statuts des données de démo → clé de traduction. */
const STATUS_KEYS: Record<string, 'publishedF' | 'published' | 'draft' | undefined> = { Publiée: 'publishedF', Publié: 'published', Brouillon: 'draft' }
/** Catégories des documents (données de démo) → clé de traduction. */
const DOC_CATEGORY_KEYS: Record<string, 'brochure' | 'admission' | 'rules' | 'calendar' | undefined> = { Brochure: 'brochure', Admission: 'admission', Règlement: 'rules', Calendrier: 'calendar' }
/** Catégories de la FAQ (données de démo) → clé de traduction. */
const FAQ_CATEGORY_KEYS: Record<string, 'admission' | 'training' | 'fees' | 'diplomas' | undefined> = { Admission: 'admission', Formation: 'training', 'Frais et paiement': 'fees', Diplômes: 'diplomas' }
const NEWS_CATEGORIES = ['admission', 'event', 'training', 'results'] as const
const DOCUMENT_TYPES = ['brochure', 'admission', 'documentsList', 'rules', 'calendar'] as const

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
      {tab === 'documents' && <Documents />}
      {tab === 'faq' && <Faq />}
    </div>
  )
}

function ActuList() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  return (
    <div className="divide-y divide-line">
      {actualites.map((a) => (
        <div key={a.id} className="flex items-center gap-3 py-2">
          <Img src={a.image} alt="" className="h-12 w-[92px] rounded-lg" />
          <div className="min-w-0 flex-1">
            <Link to={ROUTES.pro.publication(a.id)} className="block truncate text-[14.5px] font-bold text-navy-900 hover:text-brand-600">{a.titre}</Link>
            <p className="mt-1 flex items-center gap-3 text-[13.5px] text-navy-900">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" />{a.date}</span>
              <StatutPill s={a.statut} />
            </p>
          </div>
          <Link to={ROUTES.pro.publication(a.id)} aria-label={t('contents.actions.edit')} className="grid size-9 place-items-center rounded-lg border border-line bg-white text-navy-800 hover:bg-brand-50"><Pencil className="size-4" /></Link>
          <button type="button" aria-label={t('contents.actions.more')} onClick={() => toast(t('contents.newsList.moreToast'))} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800"><MoreHorizontal className="size-5" /></button>
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
  const [titre, setTitre] = useState(() => t('contents.presentation.defaultTitle', { sigle: ecole.sigle }))
  const [texte, setTexte] = useState(() => t('contents.presentation.defaultText'))
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.12fr]">
        <ProCard title={t('contents.presentation.cardTitle')} icon={<FileText />} subtitle={t('contents.presentation.cardSubtitle')}>
          <div className="space-y-3">
            <label className="block"><ProLabel required>{t('contents.presentation.titleLabel')}</ProLabel><input className={proInput} value={titre} onChange={(e) => setTitre(e.target.value)} /></label>
            <div><ProLabel required>{t('contents.presentation.contentLabel')}</ProLabel><Editor value={texte} onChange={setTexte} max={500} /></div>
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
          <div className="grid grid-cols-2 gap-4">
            <Link to={ROUTES.pro.contents('documents')} className={cn(proCard, 'p-3')}>
              <p className="flex items-center gap-2.5 text-[17px] font-bold text-navy-900"><Folder className="size-7 text-emerald-600" />{t('contents.presentation.documentsTitle')}</p>
              <div className="mt-2 flex items-center rounded-xl bg-[#e5f7ea] px-4 py-3">
                <span className="flex-1 leading-tight"><b className="block text-[30px] text-navy-900">{documentsPro.filter((d) => d.statut === 'Publié').length}</b><span className="text-[15px] text-navy-900">{t('contents.presentation.documentsPublished')}</span></span>
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
      <ProFooter />
    </>
  )
}

function Actualites() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t('contents.news.newNews')}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">{t('contents.actions.cancel')}</button>
            <button type="button" onClick={() => { toast.success(t('contents.news.draftSaved')); setOpen(false) }} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">{t('contents.actions.draft')}</button>
            <button type="button" onClick={() => { toast.success(t('contents.news.published')); setOpen(false) }} className="h-11 rounded-full bg-brand-600 px-6 font-semibold text-white">{t('contents.actions.publish')}</button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><ProLabel required>{t('contents.news.form.title')}</ProLabel><input className={proInput} placeholder={t('contents.news.form.titlePlaceholder')} /></label>
          <label><ProLabel required>{t('contents.news.form.category')}</ProLabel><Select options={NEWS_CATEGORIES.map((c) => ({ value: c, label: t(`contents.news.categories.${c}`) }))} className="h-10" /></label>
          <label><ProLabel>{t('contents.news.form.deadline')}</ProLabel><input type="date" className={proInput} /></label>
          <label className="sm:col-span-2"><ProLabel required>{t('contents.news.form.text')}</ProLabel><textarea rows={4} className="w-full rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] outline-none" /></label>
        </div>
      </Modal>
    </div>
  )
}

function Documents() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const categoryLabel = (c: string) => {
    const key = DOC_CATEGORY_KEYS[c]
    return key ? t(`contents.documents.categories.${key}`) : c
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#9fb4e3] bg-white py-6 text-center">
          <CloudUpload className="size-10 text-brand-600" />
          <b className="text-[17px] text-navy-900">{t('contents.documents.addTitle')}</b>
          <span className="text-[13.5px] text-navy-900">{t('contents.documents.addHint')}</span>
          <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && toast.success(t('contents.documents.added', { name: e.target.files[0].name }))} />
        </label>
        <ProCard title={t('contents.documents.suggestedTypes')} icon={<Lightbulb />}>
          <div className="flex flex-wrap gap-2">
            {DOCUMENT_TYPES.map((type) => <span key={type} className="rounded-full bg-[#e3ecff] px-3 py-1 text-[13.5px] font-medium text-brand-700">{t(`contents.documents.types.${type}`)}</span>)}
          </div>
        </ProCard>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <table className="w-full min-w-[760px] text-[14.5px] text-navy-900">
          <thead>
            <tr className="bg-[#eef3fc] text-left font-bold">
              <th className="py-3 pl-5">{t('contents.documents.table.document')}</th>
              <th>{t('contents.documents.table.category')}</th>
              <th>{t('contents.documents.table.size')}</th>
              <th>{t('contents.documents.table.publishedAt')}</th>
              <th>{t('contents.documents.table.status')}</th>
              <th className="pr-5 text-center">{t('contents.documents.table.actions')}</th>
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
                <td><span className={cn('rounded-full px-3 py-1 text-[13px]', catTone[d.categorie] ?? 'bg-slate-100')}>{categoryLabel(d.categorie)}</span></td>
                <td>{d.taille}</td>
                <td>{d.date}</td>
                <td><StatutPill s={d.statut} /></td>
                <td className="pr-5">
                  <div className="flex justify-center gap-2">
                    <button type="button" aria-label={t('contents.actions.view')} onClick={() => toast(t('contents.documents.previewToast'))} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800"><Eye className="size-4" /></button>
                    <button type="button" aria-label={t('contents.actions.more')} onClick={() => toast(t('contents.documents.moreToast'))} className="grid size-9 place-items-center rounded-lg bg-[#eef3fc] text-navy-800"><MoreHorizontal className="size-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[15px] text-navy-900">{t('contents.documents.count', { count: documentsPro.length })}</p>
    </div>
  )
}

function Faq() {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const [cat, setCat] = useState('Toutes')
  const [open, setOpen] = useState<number | null>(0)
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const cats = ['Admission', 'Formation', 'Frais et paiement', 'Diplômes']
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
        action={<button type="button" onClick={() => setAdding(true)} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-[15px] font-semibold text-white"><Plus className="size-5" />{t('contents.faq.add')}</button>}
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
            <div key={f.q} className="rounded-xl border border-line">
              <div className="flex items-center gap-3 px-4 py-3">
                <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex flex-1 items-center gap-2 text-left text-[15px] font-bold text-navy-900">
                  <ChevronDown className={cn('size-5 shrink-0 transition-transform', open === i && 'rotate-180')} />
                  {f.q}
                </button>
                <span className="rounded-full bg-[#e3ecff] px-3 py-0.5 text-[12.5px] font-medium text-brand-700">{categoryLabel(f.categorie)}</span>
                <StatutPill s="Publié" />
                <button type="button" aria-label={t('contents.actions.edit')} onClick={() => toast(t('contents.faq.editToast'))} className="grid size-8 place-items-center rounded-lg border border-line"><Pencil className="size-4" /></button>
              </div>
              {open === i && <p className="border-t border-line px-4 py-3 text-[14.5px] text-navy-900">{f.r}</p>}
            </div>
          ))}
        </div>
      </ProCard>
      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title={t('contents.faq.add')}
        footer={
          <>
            <button type="button" onClick={() => setAdding(false)} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">{t('contents.actions.cancel')}</button>
            <button type="button" onClick={() => { toast.success(t('contents.faq.added')); setAdding(false) }} className="h-11 rounded-full bg-brand-600 px-6 font-semibold text-white">{t('contents.actions.publish')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block"><ProLabel required>{t('contents.faq.form.question')}</ProLabel><input className={proInput} /></label>
          <label className="block"><ProLabel required>{t('contents.faq.form.category')}</ProLabel><Select options={categoryOptions(cats)} className="h-10" /></label>
          <label className="block"><ProLabel required>{t('contents.faq.form.answer')}</ProLabel><textarea rows={4} className="w-full rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] outline-none" /></label>
        </div>
      </Modal>
    </div>
  )
}
