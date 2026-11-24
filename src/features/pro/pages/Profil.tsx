import { useState, type ReactNode } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
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
import { ProCard, ProFooter, ProHeader, ProLabel } from '@/features/pro/components/ProBlocks'
import { proInput } from '@/features/pro/proStyles'
import { patchEtablissement, prefixer, sousCles, type Valeurs } from '@/features/pro/proData'
import { Img } from '@/shared/components/ui/Img'
import { LinkTabs } from '@/shared/components/ui/Tabs'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { data } from '@/data'
import { useParametres } from '@/data/hooks'
import { quartiers, regions, villes } from '@/mocks/schools'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

const typeOptions = [
  { value: 'IPES', labelKey: 'ipes' },
  { value: 'CFP', labelKey: 'cfp' },
  { value: 'Autre', labelKey: 'other' },
] as const

function SelectBox({ value, onChange, options, icon }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; icon?: ReactNode }) {
  return (
    <label className="relative flex h-10 items-center gap-2.5 rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[15px] text-navy-900">
      {icon && <span className="text-navy-800 [&_svg]:size-5">{icon}</span>}
      <span className="flex-1 truncate">{options.find((o) => o.value === value)?.label ?? value}</span>
      <ChevronDown className="size-5" />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

function IconInput({ icon, value, onChange, placeholder }: { icon: ReactNode; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-navy-800 [&_svg]:size-5">{icon}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(proInput, 'pl-11')} />
    </span>
  )
}

const opts = (xs: string[]) => xs.map((x) => ({ value: x, label: x }))

/**
 * Le formulaire du profil, partagé par les onglets : la valeur saisie (pas
 * encore enregistrée), sinon la valeur enregistrée (réglages `profil.*`),
 * sinon celle de la fiche ou de la maquette.
 */
type ProfilForm = {
  texte: (cle: string, defaut: string) => string
  oui: (cle: string, defaut: boolean) => boolean
  changer: (cle: string, v: string | boolean) => void
  /** Valeur enregistrée seulement (aperçu de la page publique). */
  enregistre: (cle: string, defaut: string) => string
}

export function Profil() {
  const { t } = useTranslation('pro')
  const { tab = '' } = useParams()
  const { ecole } = useMonEcole()
  const reglages = useParametres(ecole.id)
  const enregistres = sousCles('profil', reglages)
  const [saisie, setSaisie] = useState<Valeurs>({})
  const lire = (cle: string) => saisie[cle] ?? enregistres[cle]
  const form: ProfilForm = {
    texte: (cle, defaut) => {
      const v = lire(cle)
      return typeof v === 'string' ? v : defaut
    },
    oui: (cle, defaut) => {
      const v = lire(cle)
      return typeof v === 'boolean' ? v : defaut
    },
    changer: (cle, v) => setSaisie((s) => ({ ...s, [cle]: v })),
    enregistre: (cle, defaut) => {
      const v = enregistres[cle]
      return typeof v === 'string' ? v : defaut
    },
  }
  // Brouillon : gardé dans les réglages. Publication : la fiche publique change aussi (champs du type Etablissement).
  const enregistrer = async (publier: boolean) => {
    const valeurs = { ...enregistres, ...saisie }
    await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, ...prefixer('profil', valeurs) } })
    const patch = patchEtablissement(valeurs)
    if (publier && Object.keys(patch).length > 0) await data.update('etablissements', ecole.id, patch)
    setSaisie({})
  }
  const tabs = [
    { value: '', label: t('profil.tabs.general'), icon: <FileText /> },
    { value: 'coordonnees', label: t('profil.tabs.contact'), icon: <MapPin /> },
    { value: 'agrement', label: t('profil.tabs.accreditation'), icon: <ShieldCheck /> },
    { value: 'medias', label: t('profil.tabs.media'), icon: <ImageIcon /> },
  ]
  const pages: Record<string, { icon: ReactNode; title: string; subtitle: string; crumb?: string }> = {
    '': { icon: <Building2 />, title: t('profil.pages.general.title'), subtitle: t('profil.pages.general.subtitle') },
    coordonnees: { icon: <MapPin />, title: t('profil.pages.contact.title'), subtitle: t('profil.pages.contact.subtitle') },
    agrement: { icon: <ShieldCheck />, title: t('profil.pages.accreditation.title'), subtitle: t('profil.pages.accreditation.subtitle') },
    medias: { icon: <ImageIcon />, title: t('profil.pages.media.title'), subtitle: t('profil.pages.media.subtitle') },
  }
  const page = pages[tab] ?? pages['']
  return (
    <div className="space-y-3.5">
      <ProHeader crumbs={[{ label: t('profil.crumb'), to: ROUTES.pro.profile() }, ...(tab ? [{ label: page.title }] : [])]} icon={page.icon} title={page.title} subtitle={page.subtitle} />
      {tab === '' && <Banniere />}
      <LinkTabs items={tabs} base={ROUTES.pro.profile()} variant="block" className="[&>a]:h-11 [&>a]:rounded-full [&>a]:text-[15px]" />
      {tab === '' && <Infos form={form} />}
      {tab === 'coordonnees' && <Coordonnees form={form} />}
      {tab === 'agrement' && <Agrement form={form} />}
      {tab === 'medias' && <Medias />}
      <ProFooter onCancel={() => setSaisie({})} onSave={enregistrer} />
    </div>
  )
}

function Banniere() {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  return (
    <section className="relative flex overflow-hidden md:h-[126px] rounded-2xl bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_70%,#1a47c4_100%)] text-white">
      <Img src={ecole.id === 'ipc' ? '/images/maquette/pro-banniere-batiment.jpg' : ecole.image} alt="" className="hidden h-[126px] w-[258px] shrink-0 md:block" />
      <div className="min-w-0 flex-1 px-5 py-4 md:px-7">
        <p className="text-[22px] font-bold md:truncate">{ecole.nom}</p>
        <p className="text-[16px] text-white/90">{t('profil.banner.tagline')}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-6 text-[16px]">
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-5 fill-white text-navy-800" />{ecole.ville} – {ecole.quartier}</span>
          <span className="inline-flex items-center gap-1.5"><Star className="size-5 fill-amber-400 text-amber-400" />{t('profil.banner.rating', { note: num(ecole.note), count: ecole.avis })}</span>
        </p>
      </div>
      <div className="relative hidden w-[277px] shrink-0 md:block">
        <Img src="/images/maquette/pro-banniere-droite.jpg" alt="" className="h-full w-full" />
        <button type="button" onClick={() => toast(t('profil.banner.changeToast'))} className="absolute right-2.5 bottom-2.5 inline-flex h-10 w-[172px] items-center justify-center gap-2 rounded-lg border border-white/60 bg-[#1b2537] px-3 text-[13.5px] font-semibold text-white hover:bg-[#111a2a]">
          <Camera className="size-5" />
          {t('profil.banner.change')}
        </button>
      </div>
    </section>
  )
}

function Infos({ form }: { form: ProfilForm }) {
  const { t } = useTranslation('pro')
  const { ecole, formations } = useMonEcole()
  const publie = form.oui('publie', true)
  const texte = form.texte('description', ecole.description.replace(/^L'Institut Professionnel du Centre \(IPC\) est un établissement/, 'Établissement'))
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <ProCard title={t('profil.general.title')} icon={<Info />}>
        <div className="grid gap-x-6 gap-y-3 md:grid-cols-[1.55fr_1fr]">
          <label><ProLabel required>{t('profil.general.name')}</ProLabel><input className={proInput} value={form.texte('nom', ecole.nom.replace(/ \([^)]*\)$/, ''))} onChange={(e) => form.changer('nom', e.target.value)} /></label>
          <label><ProLabel required>{t('profil.general.acronym')}</ProLabel><input className={proInput} value={form.texte('sigle', ecole.sigle)} onChange={(e) => form.changer('sigle', e.target.value)} /></label>
          <label><ProLabel required>{t('profil.general.type')}</ProLabel><SelectBox value={form.texte('type', ecole.type)} onChange={(v) => form.changer('type', v)} options={typeOptions.map((o) => ({ value: o.value, label: t(`profil.types.${o.labelKey}`) }))} /></label>
          <label><ProLabel>{t('profil.general.founded')}</ProLabel><IconInput icon={<Calendar />} value={form.texte('anneeCreation', '2018')} onChange={(v) => form.changer('anneeCreation', v)} /></label>
          <label className="md:col-span-2">
            <ProLabel required>{t('profil.general.presentation')}</ProLabel>
            <span className="relative block">
              <textarea rows={3} maxLength={300} value={texte} onChange={(e) => form.changer('description', e.target.value)} className="w-full resize-none rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-brand-500" />
              <span className="absolute right-3 bottom-2 text-[12px] text-ink/70">{texte.length} / 300</span>
            </span>
          </label>
        </div>
      </ProCard>
      <div className="space-y-4">
        <ProCard title={t('profil.visibility.title')} icon={<Award />}>
          <p className="flex items-center gap-2.5 rounded-xl bg-[#e5f7ea] px-4 py-2.5 text-[17px] font-semibold text-emerald-700">
            <CircleCheck className="size-6 fill-emerald-600 text-white" />
            {t('profil.visibility.verified')}
          </p>
          <div className="mt-3 flex items-center gap-2.5 text-[15px] text-navy-900">
            <Globe className="size-5 text-navy-800" />
            <span className="flex-1">{t('profil.visibility.publish')}</span>
            <button type="button" role="switch" aria-checked={publie} onClick={() => form.changer('publie', !publie)} className={cn('relative h-7 w-12 rounded-full transition-colors', publie ? 'bg-brand-600' : 'bg-slate-300')}>
              <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', publie ? 'left-[22px]' : 'left-0.5')} />
            </button>
          </div>
        </ProCard>
        <ProCard title={t('profil.figures.title')} icon={<Layers />}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-[#e8f0ff] px-3 py-3">
              <GraduationCap className="size-9 text-brand-600" />
              <p className="leading-tight"><b className="block text-[26px] text-navy-900">{Math.max(ecole.formations, formations.length)}</b><span className="text-[15px] text-navy-900">{t('profil.figures.trainings')}</span></p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-[#e5f7ea] px-3 py-3">
              <Layers className="size-9 text-emerald-600" />
              <p className="leading-tight"><b className="block text-[26px] text-navy-900">{(ecole.principales ?? ecole.filieres).length}</b><span className="text-[15px] text-navy-900">{t('profil.figures.fields')}</span></p>
            </div>
          </div>
        </ProCard>
      </div>
    </div>
  )
}

function Coordonnees({ form }: { form: ProfilForm }) {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  const quartier = form.texte('quartier', ecole.quartier)
  const site = `www.${ecole.sigle.toLowerCase().replace(/\s+/g, '')}.cm`
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_405px]">
      <ProCard title={t('profil.contact.title')} icon={<Contact />}>
        <div className="grid gap-x-5 gap-y-3 md:grid-cols-2">
          <label><ProLabel required>{t('profil.contact.region')}</ProLabel><SelectBox value={form.texte('region', ecole.region)} onChange={(v) => form.changer('region', v)} options={opts(regions.map((r) => r.nom))} /></label>
          <label><ProLabel required>{t('profil.contact.city')}</ProLabel><SelectBox value={form.texte('ville', ecole.ville)} onChange={(v) => form.changer('ville', v)} options={opts(villes.map((v) => v.nom))} /></label>
          <label><ProLabel required>{t('profil.contact.neighbourhood')}</ProLabel><SelectBox value={quartier} onChange={(v) => form.changer('quartier', v)} options={opts([...new Set([quartier, ...quartiers])])} /></label>
          <label><ProLabel>{t('profil.contact.locality')}</ProLabel><input className={proInput} value={form.texte('lieuDit', 'Avenue Germaine')} onChange={(e) => form.changer('lieuDit', e.target.value)} /></label>
          <label className="md:col-span-2"><ProLabel required>{t('profil.contact.address')}</ProLabel><IconInput icon={<MapPin />} value={form.texte('adresse', 'Avenue Germaine, immeuble Vision Confort, 3e étage')} onChange={(v) => form.changer('adresse', v)} /></label>
          <label><ProLabel required>{t('profil.contact.phone')}</ProLabel><IconInput icon={<Phone />} value={form.texte('telephone', ecole.telephone)} onChange={(v) => form.changer('telephone', v)} /></label>
          <label><ProLabel>{t('profil.contact.phone2')} <span className="font-normal">{t('profil.contact.optional')}</span></ProLabel><IconInput icon={<Phone />} value={form.texte('telephone2', '+237 6 75 43 21 09')} onChange={(v) => form.changer('telephone2', v)} /></label>
          <label><ProLabel required>{t('profil.contact.email')}</ProLabel><IconInput icon={<Mail />} value={form.texte('email', ecole.email)} onChange={(v) => form.changer('email', v)} /></label>
          <label><ProLabel>{t('profil.contact.website')} <span className="font-normal">{t('profil.contact.optional')}</span></ProLabel><IconInput icon={<Globe />} value={form.texte('siteWeb', site)} onChange={(v) => form.changer('siteWeb', v)} /></label>
        </div>
      </ProCard>
      <ProCard title={t('profil.contact.preview')} icon={<Eye />} className="[&_h2]:text-[17px]">
        <ul className="space-y-2 text-[15px] text-navy-900 [&_svg]:size-5 [&_svg]:text-brand-600">
          <li className="flex items-center gap-3"><MapPin className="fill-brand-600 !text-white" />{form.enregistre('lieuDit', 'Avenue Germaine')}, {ecole.quartier} – {ecole.ville} ({ecole.region})</li>
          <li className="flex items-center gap-3"><Phone />{ecole.telephone}</li>
          <li className="flex items-center gap-3"><Mail />{ecole.email}</li>
          <li className="flex items-center gap-3"><Globe />{form.enregistre('siteWeb', site)}</li>
        </ul>
        <Img src="/images/maquette/pro-carte.jpg" alt={t('profil.contact.map')} className="mt-3 h-[188px] w-full rounded-xl" />
      </ProCard>
    </div>
  )
}

function Agrement({ form }: { form: ProfilForm }) {
  const { t } = useTranslation('pro')
  const docs = [
    { id: 'authorisation', taille: 2.4 },
    { id: 'statutes', taille: 1.8 },
    { id: 'niu', taille: 1.2 },
  ] as const
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_430px]">
      <ProCard title={t('profil.accreditation.title')} icon={<Award />}>
        <div className="grid gap-x-6 gap-y-3 md:grid-cols-[1.45fr_1fr]">
          <label><ProLabel required>{t('profil.accreditation.authorisation')}</ProLabel><input className={proInput} value={form.texte('agrement', 'N° 184/MINEFOP du 08 septembre 2015')} onChange={(e) => form.changer('agrement', e.target.value)} /></label>
          <label><ProLabel required>{t('profil.accreditation.issueDate')}</ProLabel><IconInput icon={<Calendar />} value={form.texte('agrementDate', '08/09/2015')} onChange={(v) => form.changer('agrementDate', v)} /></label>
          <label><ProLabel required>{t('profil.accreditation.authority')}</ProLabel><SelectBox value={form.texte('agrementAutorite', 'MINEFOP')} onChange={(v) => form.changer('agrementAutorite', v)} options={[...opts(['MINEFOP', 'MINESUP', 'MINTRANSPORTS']), { value: 'Autre', label: t('profil.accreditation.otherAuthority') }]} /></label>
          <label><ProLabel>{t('profil.accreditation.expiry')} <span className="font-normal">{t('profil.accreditation.ifApplicable')}</span></ProLabel><IconInput icon={<Calendar />} value={form.texte('agrementExpiration', '—')} onChange={(v) => form.changer('agrementExpiration', v)} /></label>
          <label><ProLabel required>{t('profil.accreditation.taxNumber')}</ProLabel><input className={proInput} value={form.texte('niu', 'M123456789012')} onChange={(e) => form.changer('niu', e.target.value)} /></label>
          <label><ProLabel required>{t('profil.accreditation.rccm')}</ProLabel><input className={proInput} value={form.texte('rccm', 'RC/YAO/2018/B/1234')} onChange={(e) => form.changer('rccm', e.target.value)} /></label>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#e5f7ea] px-4 py-3">
          <CircleCheck className="size-8 fill-emerald-600 text-white" />
          <div className="flex-1">
            <p className="text-[17px] font-bold text-emerald-700">{t('profil.accreditation.verified')}</p>
            <p className="text-[14px] text-navy-900">{t('profil.accreditation.verifiedText')}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-600 bg-white px-4 py-1 text-[15px] font-semibold text-emerald-700">{t('profil.accreditation.compliant')}</span>
        </div>
      </ProCard>
      <ProCard title={t('profil.documents.title')} icon={<Upload />}>
        <div className="space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-xl bg-[#f3f6fc] px-3 py-2">
              <span className="grid h-10 w-9 place-items-center rounded-md bg-rose-600 text-[10px] font-extrabold text-white">PDF</span>
              <span className="flex-1 leading-tight">
                <b className="block text-[15px] text-navy-900">{t(`profil.documents.items.${d.id}`)}</b>
                <span className="text-[13px] text-navy-900">{t('profil.documents.file', { size: num(d.taille) })}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[13px] font-semibold text-emerald-700"><CircleCheck className="size-4 fill-emerald-600 text-white" />{t('profil.documents.validated')}</span>
              <button type="button" aria-label={t('profil.documents.view')} onClick={() => toast(t('profil.documents.viewToast'))} className="text-brand-600"><Eye className="size-5" /></button>
              <button type="button" aria-label={t('profil.documents.delete')} onClick={() => toast(t('profil.documents.deleteToast'))} className="text-rose-600"><Trash2 className="size-5" /></button>
            </div>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-[#9fb4e3] py-4 text-center">
          <CloudUpload className="size-8 text-brand-600" />
          <b className="text-[16px] text-navy-900">{t('profil.documents.add')}</b>
          <span className="text-[13px] text-navy-900">{t('profil.documents.formats')}</span>
          <span className="mt-1 inline-flex h-10 items-center gap-2 rounded-full border-2 border-brand-600/60 px-8 text-[15px] font-semibold text-navy-800"><Plus className="size-5" />{t('profil.documents.choose')}</span>
          <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && toast.success(t('profil.documents.sent', { name: e.target.files[0].name }))} />
        </label>
      </ProCard>
    </div>
  )
}

function Medias() {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  const [f, setF] = useState('toutes')
  const items = [
    { src: '/images/maquette/media-1.jpg', video: false },
    { src: '/images/maquette/media-2.jpg', video: false },
    { src: '/images/maquette/media-3.jpg', video: false },
    { src: '/images/maquette/media-4.jpg', video: true },
    { src: '/images/maquette/media-5.jpg', video: false },
    { src: '/images/maquette/media-6.jpg', video: false },
  ]
  const shown = items.filter((x) => f === 'toutes' || (f === 'videos' ? x.video : !x.video))
  return (
    <div className="grid gap-4 xl:grid-cols-[370px_1fr]">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><ImageIcon className="size-6 text-brand-600" />{t('profil.media.cover')}</h2>
        <div className="relative mt-3 overflow-hidden rounded-xl">
          <Img src="/images/maquette/pro-banniere.jpg" alt={t('profil.media.coverAlt')} className="h-[130px] w-full" />
          <button type="button" aria-label={t('profil.media.editCover')} onClick={() => toast(t('profil.media.chooseImage'))} className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-white text-brand-600 shadow"><Pencil className="size-4" /></button>
        </div>
        <h2 className="mt-4 flex items-center gap-2.5 border-t border-line pt-4 text-[19px] font-bold text-navy-900"><ImageIcon className="size-6 text-brand-600" />{t('profil.media.logo')}</h2>
        <div className="mt-3 flex gap-4">
          <div className="relative">
            <Img src={ecole.id === 'ipc' ? '/images/maquette/pro-logo-ipc.jpg' : ecole.image} alt={t('profil.media.logoAlt')} className="size-[130px] rounded-xl border border-line" />
            <button type="button" aria-label={t('profil.media.editLogo')} onClick={() => toast(t('profil.media.chooseLogo'))} className="absolute -top-1 -right-1 grid size-8 place-items-center rounded-full bg-white text-brand-600 shadow"><Pencil className="size-4" /></button>
          </div>
          <div className="space-y-2 text-[13.5px] text-navy-900">
            <button type="button" onClick={() => toast(t('profil.media.chooseLogo'))} className="inline-flex h-9 items-center gap-2 rounded-full border-2 border-brand-600/60 px-4 text-[14px] font-semibold text-navy-800"><Upload className="size-4" />{t('profil.media.changeLogo')}</button>
            <p>{t('profil.media.logoFormat')}<br />{t('profil.media.logoSize')}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><Layers className="size-6 text-brand-600" />{t('profil.media.gallery')}</h2>
          <div className="flex gap-2">
            {([['toutes', 'all'], ['photos', 'photos'], ['videos', 'videos']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => setF(k)} className={cn('h-8 rounded-full px-4 text-[13.5px] font-semibold', f === k ? 'bg-brand-600 text-white' : 'border border-line bg-white text-navy-900')}>{t(`profil.media.filters.${l}`)}</button>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {shown.map((m) => (
            <button key={m.src} type="button" onClick={() => toast(m.video ? t('profil.media.playVideo') : t('profil.media.options'))} className="overflow-hidden rounded-xl">
              <Img src={m.src} alt={m.video ? t('profil.media.video') : t('profil.media.photo')} className="h-[112px] w-full" />
            </button>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer flex-wrap items-center gap-4 rounded-xl border-2 border-dashed border-[#9fb4e3] px-5 py-3">
          <CloudUpload className="size-10 text-brand-600" />
          <span className="flex-1">
            <b className="block text-[15px] text-brand-700">{t('profil.media.add')}</b>
            <span className="text-[13px] text-navy-900">{t('profil.media.drop')}</span>
          </span>
          <span className="space-y-1 border-l border-line pl-4 text-[13px] text-navy-900">
            <span className="flex items-center gap-2"><ImageIcon className="size-4" />{t('profil.media.images')}</span>
            <span className="flex items-center gap-2"><Video className="size-4" />{t('profil.media.videos')}</span>
          </span>
          <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && toast.success(t('profil.media.added', { name: e.target.files[0].name }))} />
        </label>
      </div>
    </div>
  )
}
