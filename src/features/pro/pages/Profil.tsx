import { useRef, useState, type ReactNode } from 'react'
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
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  Video,
} from 'lucide-react'
import { ProCard, ProFooter, ProHeader, ProLabel } from '@/features/pro/components/ProBlocks'
import { proInput } from '@/features/pro/proStyles'
import { type Valeurs, patchEtablissement, prefixer, sousCles } from '@/features/pro/proData'
import { Img } from '@/shared/components/ui/Img'
import { LinkTabs } from '@/shared/components/ui/Tabs'
import { useMonEcole, useSession } from '@/features/auth/hooks/useSession'
import { numeroPropre } from '@/features/auth/authOtp'
import { ModaleSiteWeb } from '@/features/pro/components/ModaleSiteWeb'
import { AgrementEtDocuments, type ControleAccords } from '@/features/pro/components/AgrementEtDocuments'
import { data, useCollection } from '@/data'
import { useDecoupage, useMedias, useParametres } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { MenuActions } from '@/shared/components/ui/MenuActions'
import { Visionneuse } from '@/shared/components/ui/Visionneuse'
import { lireFichier, lireImage, TAILLE_MAX_DOCUMENT, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import type { Lieu } from '@/shared/types'
import { SelectionGeographique } from '@/shared/components/forms/SelectionGeographique'
import { villeDuLieu } from '@/shared/utils/geographie'
import { PasEncoreDAvis } from '@/shared/components/ui/StarRating'

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

function IconInput({ icon, value, onChange, onBlur, placeholder, type }: { icon: ReactNode; value: string; onChange: (v: string) => void; onBlur?: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-navy-800 [&_svg]:size-5">{icon}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur && ((e) => onBlur(e.target.value))} placeholder={placeholder} className={cn(proInput, 'pl-11')} />
    </span>
  )
}

const opts = (xs: string[]) => xs.map((x) => ({ value: x, label: x }))

/** Les années proposées pour la création de l'établissement : de cette année à 1950. */
const ANNEES = Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => String(new Date().getFullYear() - i))

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
  // Fenêtre « Pas encore de site web ? », proposée une fois par visite, après un enregistrement sans site web.
  const { account } = useSession()
  const demandes = useCollection('demandesAssistance')
  const [proposerSite, setProposerSite] = useState(false)
  const [sitePropose, setSitePropose] = useState(false)
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
  // L'onglet Agrément : ses accords d'ouverture s'enregistrent avec le reste (rien si une erreur reste à corriger).
  const accordsRef = useRef<ControleAccords>(null)
  const enregistrer = async (publier: boolean) => {
    if (accordsRef.current && !(await accordsRef.current.enregistrer())) return false
    const valeurs = { ...enregistres, ...saisie }
    await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, ...prefixer('profil', valeurs) } })
    const patch = patchEtablissement(valeurs)
    if (publier && Object.keys(patch).length > 0) {
      // L'annuaire le compte au bon endroit de lui-même (chiffres calculés).
      await data.update('etablissements', ecole.id, patch)
    }
    setSaisie({})
    const site = typeof valeurs.siteWeb === 'string' ? valeurs.siteWeb : (ecole.siteWeb ?? '')
    const dejaDemande = !!account && demandes.some((d) => d.compteId === account.id && d.sujet === t('profil.contact.noWebsite.subject', { lng: 'fr' }))
    if (!site.trim() && !dejaDemande && !sitePropose) {
      setProposerSite(true)
      setSitePropose(true)
    }
    return true
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
      {tab === 'agrement' && <AgrementEtDocuments ref={accordsRef} niu={form.texte('niu', ecole.niu ?? '')} changerNiu={(v) => form.changer('niu', v)} />}
      {tab === 'medias' && <Medias />}
      <ProFooter onCancel={() => { setSaisie({}); accordsRef.current?.annuler() }} onSave={enregistrer} />
      <ModaleSiteWeb open={proposerSite} onClose={() => setProposerSite(false)} />
    </div>
  )
}

function Banniere() {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  return (
    <section className="relative flex overflow-hidden md:h-[126px] rounded-2xl bg-[linear-gradient(100deg,#0a2a86_0%,#1238a8_70%,#1a47c4_100%)] text-white">
      <Img src={ecole.banniere ?? ecole.image} alt="" className="hidden h-[126px] w-[258px] shrink-0 md:block" />
      <div className="min-w-0 flex-1 px-5 py-4 md:px-7">
        <p className="text-[22px] font-bold md:truncate">{ecole.nom}</p>
        <p className="text-[16px] text-white/90">{t('profil.banner.tagline')}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-6 text-[16px]">
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-5 fill-white text-navy-800" />{ecole.ville} – {ecole.quartier}</span>
          <span className="inline-flex items-center gap-1.5"><Star className="size-5 fill-amber-400 text-amber-400" />{ecole.avis > 0 ? t('profil.banner.rating', { note: num(ecole.note), count: ecole.avis }) : <PasEncoreDAvis />}</span>
        </p>
      </div>
      <div className="relative hidden w-[277px] shrink-0 md:block">
        <Img src={ecole.bandeau ?? ecole.image} alt="" className="h-full w-full" />
        <label className="absolute right-2.5 bottom-2.5 inline-flex h-10 w-[172px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/60 bg-[#1b2537] px-3 text-[13.5px] font-semibold text-white hover:bg-[#111a2a]">
          <Camera className="size-5" />
          {t('profil.banner.change')}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void changerImage(ecole.id, 'bandeau', f, t('profil.banner.changed'), t('profil.media.tooBig')) }} />
        </label>
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
          <label><ProLabel>{t('profil.general.founded')}</ProLabel><SelectBox icon={<Calendar />} value={form.texte('anneeCreation', ecole.anneeCreation ?? '')} onChange={(v) => form.changer('anneeCreation', v)} options={[{ value: '', label: t('profil.general.foundedPick') }, ...opts(ANNEES)]} /></label>
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
  const { arrondissements } = useDecoupage()
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  // Le lieu, avec la sélection géographique : région → département → arrondissement (la ville s'en déduit), quartier.
  const lieu: Lieu = {
    region: form.texte('region', ecole.region),
    departement: form.texte('departement', ecole.departement ?? ''),
    arrondissement: form.texte('arrondissement', ecole.arrondissement ?? ''),
    quartier: form.texte('quartier', ecole.quartier),
  }
  const changerLieu = (l: Lieu) => {
    for (const cle of ['region', 'departement', 'arrondissement', 'quartier'] as const) form.changer(cle, l[cle])
    const ville = villeDuLieu(l, arrondissements)
    if (ville) form.changer('ville', ville)
  }
  const site = form.texte('siteWeb', ecole.siteWeb ?? '')
  const siteEnregistre = form.enregistre('siteWeb', ecole.siteWeb ?? '')
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_405px]">
      <ProCard title={t('profil.contact.title')} icon={<Contact />}>
        <div className="grid gap-x-5 gap-y-3 md:grid-cols-2">
          <SelectionGeographique valeur={lieu} onChange={changerLieu} className="md:col-span-2" />
          <label><ProLabel>{t('profil.contact.locality')}</ProLabel><input className={proInput} value={form.texte('lieuDit', ecole.lieuDit ?? '')} onChange={(e) => form.changer('lieuDit', e.target.value)} /></label>
          <label className="md:col-span-2"><ProLabel required>{t('profil.contact.address')}</ProLabel><IconInput icon={<MapPin />} value={form.texte('adresse', ecole.adresse ?? '')} onChange={(v) => form.changer('adresse', v)} /></label>
          {/* Le numéro se remet au format « +237 690 12 34 56 » quand on quitte le champ. */}
          <label><ProLabel required>{t('profil.contact.phone')}</ProLabel><IconInput type="tel" icon={<Phone />} value={form.texte('telephone', ecole.telephone)} onChange={(v) => form.changer('telephone', v)} onBlur={(v) => form.changer('telephone', numeroPropre(v))} placeholder={t('profil.contact.phonePlaceholder')} /></label>
          <label><ProLabel>{t('profil.contact.phone2')} <span className="font-normal">{t('profil.contact.optional')}</span></ProLabel><IconInput type="tel" icon={<Phone />} value={form.texte('telephone2', '')} onChange={(v) => form.changer('telephone2', v)} onBlur={(v) => form.changer('telephone2', numeroPropre(v))} placeholder={t('profil.contact.phonePlaceholder')} /></label>
          <label><ProLabel required>{t('profil.contact.email')}</ProLabel><IconInput icon={<Mail />} value={form.texte('email', ecole.email)} onChange={(v) => form.changer('email', v)} /></label>
          <label><ProLabel>{t('profil.contact.website')} <span className="font-normal">{t('profil.contact.optional')}</span></ProLabel><IconInput icon={<Globe />} value={site} onChange={(v) => form.changer('siteWeb', v)} placeholder={t('profil.contact.websitePlaceholder')} /></label>
        </div>
      </ProCard>
      <ProCard title={t('profil.contact.preview')} icon={<Eye />} className="[&_h2]:text-[17px]">
        <ul className="space-y-2 text-[15px] text-navy-900 [&_svg]:size-5 [&_svg]:text-brand-600">
          <li className="flex items-center gap-3"><MapPin className="fill-brand-600 !text-white" />{form.enregistre('lieuDit', 'Avenue Germaine')}, {ecole.quartier} – {ecole.ville} ({ecole.region})</li>
          <li className="flex items-center gap-3"><Phone />{ecole.telephone}</li>
          <li className="flex items-center gap-3"><Mail />{ecole.email}</li>
          {siteEnregistre && <li className="flex items-center gap-3"><Globe />{siteEnregistre}</li>}
        </ul>
        <Img src="/images/maquette/pro-carte.jpg" alt={t('profil.contact.map')} className="mt-3 h-[188px] w-full rounded-xl" />
      </ProCard>
    </div>
  )
}

function Medias() {
  const { t } = useTranslation('pro')
  const { ecole } = useMonEcole()
  const [f, setF] = useState('toutes')
  const items = useMedias(ecole.id)
  const shown = items.filter((x) => f === 'toutes' || (f === 'videos' ? x.video : !x.video))
  const [vue, setVue] = useState<number | null>(null)
  // Un seul champ de fichier caché pour la couverture et le logo.
  const champ = useRef<HTMLInputElement>(null)
  const [cible, setCible] = useState<'couverture' | 'logo'>('logo')
  const choisir = (c: 'couverture' | 'logo') => {
    setCible(c)
    champ.current?.click()
  }
  const ajouter = async (fichier: File) => {
    const video = fichier.type.startsWith('video/')
    if (fichier.size > (video ? TAILLE_MAX_DOCUMENT : TAILLE_MAX_PHOTO)) return void toast.error(t('profil.media.tooBig'))
    await data.create('medias', { etablissementId: ecole.id, src: await lireFichier(fichier), video }, 'media')
    toast.success(t('profil.media.added', { name: fichier.name }))
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[370px_1fr]">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,29,61,0.06)]">
        <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-navy-900"><ImageIcon className="size-6 text-brand-600" />{t('profil.media.cover')}</h2>
        <div className="relative mt-3 overflow-hidden rounded-xl">
          <Img src={ecole.couverture ?? ecole.image} alt={t('profil.media.coverAlt')} className="h-[130px] w-full" />
          <button type="button" aria-label={t('profil.media.editCover')} onClick={() => choisir('couverture')} className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-white text-brand-600 shadow"><Pencil className="size-4" /></button>
        </div>
        <h2 className="mt-4 flex items-center gap-2.5 border-t border-line pt-4 text-[19px] font-bold text-navy-900"><ImageIcon className="size-6 text-brand-600" />{t('profil.media.logo')}</h2>
        <div className="mt-3 flex gap-4">
          <div className="relative">
            <Img src={ecole.logo ?? ecole.image} alt={t('profil.media.logoAlt')} className="size-[130px] rounded-xl border border-line" />
            <button type="button" aria-label={t('profil.media.editLogo')} onClick={() => choisir('logo')} className="absolute -top-1 -right-1 grid size-8 place-items-center rounded-full bg-white text-brand-600 shadow"><Pencil className="size-4" /></button>
          </div>
          <div className="space-y-2 text-[13.5px] text-navy-900">
            <button type="button" onClick={() => choisir('logo')} className="inline-flex h-9 items-center gap-2 rounded-full border-2 border-brand-600/60 px-4 text-[14px] font-semibold text-navy-800"><Upload className="size-4" />{t('profil.media.changeLogo')}</button>
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
          {shown.map((m, i) => (
            <div key={m.id} className="relative overflow-hidden rounded-xl">
              <button type="button" onClick={() => setVue(i)} className="block w-full" aria-label={m.video ? t('profil.media.video') : t('profil.media.photo')}>
                {m.video && m.src.startsWith('data:video') ? <video src={m.src} className="h-[112px] w-full object-cover" muted /> : <Img src={m.src} alt={m.video ? t('profil.media.video') : t('profil.media.photo')} className="h-[112px] w-full" />}
              </button>
              <MenuActions
                label={t('profil.media.optionsLabel')}
                className="absolute top-1.5 right-1.5 size-8 bg-white/90"
                actions={[
                  { label: t('profil.media.view'), icon: <Eye />, onClick: () => setVue(i) },
                  { label: t('profil.media.delete'), icon: <Trash2 />, danger: true, onClick: async () => { await data.remove('medias', m.id); toast.success(t('profil.media.deleted')) } },
                ]}
              />
            </div>
          ))}
          {shown.length === 0 && <p className="col-span-full rounded-xl bg-[#f3f6fc] px-3 py-3 text-[14px] text-muted">{t('profil.media.none')}</p>}
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
          <input type="file" accept="image/*,video/*" className="sr-only" onChange={(e) => { const fichier = e.target.files?.[0]; e.target.value = ''; if (fichier) void ajouter(fichier) }} />
        </label>
      </div>
      <input ref={champ} type="file" accept="image/*" className="sr-only" onChange={(e) => { const fichier = e.target.files?.[0]; e.target.value = ''; if (fichier) void changerImage(ecole.id, cible, fichier, t(cible === 'logo' ? 'profil.media.logoChanged' : 'profil.media.coverChanged'), t('profil.media.tooBig')) }} />
      <Visionneuse
        elements={shown.map((m) => ({ src: m.src, alt: m.video ? t('profil.media.video') : t('profil.media.photo'), video: m.video && (m.src.startsWith('data:video') || m.src.endsWith('.webm')) }))}
        index={vue}
        onClose={() => setVue(null)}
      />
    </div>
  )
}

/** Remplace une image de l'établissement (bannière, couverture, logo) par le fichier choisi, enregistré dans la base. */
async function changerImage(id: string, champ: 'bandeau' | 'couverture' | 'logo', fichier: File, message: string, tropLourd: string) {
  if (fichier.size > TAILLE_MAX_PHOTO) return void toast.error(tropLourd)
  const image = await lireImage(fichier)
  // La fiche publique suit : la couverture remplace sa photo, le logo sa vignette.
  const suite = champ === 'couverture' ? { photoFiche: image } : champ === 'logo' ? { vignette: image } : {}
  await data.update('etablissements', id, { [champ]: image, ...suite })
  toast.success(message)
}
