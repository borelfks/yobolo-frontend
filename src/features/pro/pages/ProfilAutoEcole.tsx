import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { BadgeCheck, Building2, Calendar, Camera, Car, Check, FileText, Globe, ImageIcon, ImagePlus, Info, Mail, MapPin, Phone, ShieldCheck, Trash2 } from 'lucide-react'
import { ProCard, ProHeader, ProLabel } from '@/features/pro/components/ProBlocks'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { useDecoupage, usePhotosAutoEcole } from '@/data/hooks'
import { data } from '@/data'
import { ANNEE_CREATION_MIN, anneeCreationMax, anneeCreationValide } from '@/features/pro/proData'
import { Button } from '@/shared/components/ui/Button'
import { Img } from '@/shared/components/ui/Img'
import { LinkTabs } from '@/shared/components/ui/Tabs'
import { SelectionGeographique } from '@/shared/components/forms/SelectionGeographique'
import { proInput } from '@/features/pro/proStyles'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import { villeDuLieu } from '@/shared/utils/geographie'
import { numeroValide } from '@/features/auth/authOtp'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import type { AutoEcole, Lieu } from '@/shared/types'

const AUTORITES = ['MINTRANSPORTS', 'Autre'] as const

/**
 * « Profil de l'auto-école » : les 4 onglets du profil de l'espace pro
 * (img7 à img10), avec ce que montre la fiche publique d'une auto-école
 * (img55 à img60). Enregistré, la fiche publique change.
 */
export function ProfilAutoEcole() {
  const { t } = useTranslation('pro')
  const { tab = '' } = useParams()
  const { autoEcole } = useMonEcole()
  if (!autoEcole) return null
  const tabs = [
    { value: '', label: t('profil.tabs.general'), icon: <FileText /> },
    { value: 'coordonnees', label: t('profil.tabs.contact'), icon: <MapPin /> },
    { value: 'agrement', label: t('profil.tabs.accreditation'), icon: <ShieldCheck /> },
    { value: 'medias', label: t('profil.tabs.media'), icon: <ImageIcon /> },
  ]
  return (
    <div className="space-y-3.5">
      <ProHeader crumbs={[{ label: t('autoEcole.profil.crumb'), to: ROUTES.pro.profile() }, ...(tab ? [{ label: tabs.find((x) => x.value === tab)?.label ?? '' }] : [])]} icon={<Building2 />} title={t('autoEcole.profil.title')} subtitle={t('autoEcole.profil.subtitle')} />
      <LinkTabs items={tabs} base={ROUTES.pro.profile()} variant="block" className="[&>a]:h-11 [&>a]:rounded-full [&>a]:text-[15px]" />
      {tab === 'medias' ? <Medias a={autoEcole} /> : <Formulaire a={autoEcole} onglet={tab} />}
    </div>
  )
}

/** Général, Coordonnées et Agrément : un seul formulaire, vérifié en entier à l'enregistrement. */
function Formulaire({ a, onglet }: { a: AutoEcole; onglet: string }) {
  const { t } = useTranslation('pro')
  const { t: tae } = useTranslation('driving-schools')
  const { arrondissements } = useDecoupage()
  const schema = useMemo(
    () =>
      z.object({
        nom: z.string().trim().min(2, t('autoEcole.profil.erreurs.nom')),
        creation: z.string().refine((v) => anneeCreationValide(v), t('profil.general.foundedInvalid', { min: ANNEE_CREATION_MIN, max: anneeCreationMax() })),
        description: z.string().max(300),
        region: z.string().min(1, t('autoEcole.profil.erreurs.lieu')),
        departement: z.string().min(1, t('autoEcole.profil.erreurs.lieu')),
        arrondissement: z.string().min(1, t('autoEcole.profil.erreurs.lieu')),
        quartier: z.string().trim().min(1, t('autoEcole.profil.erreurs.lieu')),
        adresse: z.string(),
        telephone: z.string().refine((v) => numeroValide(v.replace(/\D/g, '').slice(-9)), t('autoEcole.profil.erreurs.telephone')),
        email: z.email(t('autoEcole.profil.erreurs.email')),
        site: z.string(),
        agrementNumero: z.string(),
        agrementDate: z.string(),
        agrementAutorite: z.string(),
        agrementExpiration: z.string(),
        niu: z.string(),
        rccm: z.string(),
      }),
    [t],
  )
  const valeurs = useMemo(
    () => ({
      nom: a.nom,
      creation: a.creation ? String(a.creation) : '',
      description: a.description ?? '',
      region: a.region,
      departement: a.departement ?? '',
      arrondissement: a.arrondissement ?? '',
      quartier: a.quartier,
      adresse: a.adresse ?? '',
      telephone: a.telephone,
      email: a.email,
      site: a.site === '—' ? '' : a.site,
      agrementNumero: a.agrement?.numero ?? '',
      agrementDate: a.agrement?.date ?? '',
      agrementAutorite: a.agrement?.autorite ?? 'MINTRANSPORTS',
      agrementExpiration: a.agrement?.expiration ?? '',
      niu: a.agrement?.niu ?? '',
      rccm: a.agrement?.rccm ?? '',
    }),
    [a],
  )
  const { register, handleSubmit, reset, watch, setValue, formState } = useForm({ resolver: zodResolver(schema), values: valeurs })
  const e = formState.errors
  const lieu: Lieu = { region: watch('region'), departement: watch('departement'), arrondissement: watch('arrondissement'), quartier: watch('quartier') }
  const changerLieu = (l: Lieu) => {
    for (const cle of ['region', 'departement', 'arrondissement', 'quartier'] as const) setValue(cle, l[cle], { shouldValidate: formState.isSubmitted })
  }
  const enregistrer = handleSubmit(
    async (v) => {
      await data.update('autoEcoles', a.id, {
        nom: v.nom.trim(),
        creation: v.creation ? Number(v.creation) : a.creation,
        description: v.description.trim() || undefined,
        region: v.region,
        departement: v.departement,
        arrondissement: v.arrondissement,
        ville: villeDuLieu(v, arrondissements) || a.ville,
        quartier: v.quartier.trim(),
        adresse: v.adresse.trim(),
        telephone: v.telephone.trim(),
        email: v.email.trim(),
        site: v.site.trim() || '—',
        agrement: { numero: v.agrementNumero.trim(), date: v.agrementDate.trim(), autorite: v.agrementAutorite, expiration: v.agrementExpiration.trim(), niu: v.niu.trim(), rccm: v.rccm.trim() },
      })
      toast.success(t('autoEcole.profil.enregistre'))
    },
    // Une erreur peut être sur un autre onglet : on le dit.
    () => toast.error(t('autoEcole.profil.erreurs.formulaire')),
  )
  const champ = (cle: 'nom' | 'adresse' | 'telephone' | 'email' | 'site' | 'agrementNumero' | 'agrementDate' | 'agrementExpiration' | 'niu' | 'rccm', label: string, opts: { requis?: boolean; icone?: React.ReactNode; aide?: string; large?: boolean } = {}) => (
    <label className={cn(opts.large && 'md:col-span-2')}>
      <ProLabel required={opts.requis}>{label}</ProLabel>
      <span className="relative block">
        {opts.icone && <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-navy-800 [&_svg]:size-5">{opts.icone}</span>}
        <input className={cn(proInput, opts.icone && 'pl-11', e[cle] && 'border-rose-500')} placeholder={opts.aide} {...register(cle)} />
      </span>
      {e[cle]?.message && <span className="mt-1 block text-xs font-medium text-rose-600">{e[cle].message}</span>}
    </label>
  )
  return (
    <form noValidate onSubmit={(ev) => void enregistrer(ev)} className="space-y-4">
      {onglet === '' && (
        <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
          <ProCard title={t('profil.general.title')} icon={<Info />}>
            <div className="mt-3 grid gap-x-6 gap-y-3 md:grid-cols-[1.55fr_1fr]">
              {champ('nom', t('autoEcole.profil.nom'), { requis: true })}
              <label>
                <ProLabel>{t('profil.general.founded')}</ProLabel>
                <span className="relative block">
                  <Calendar className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" aria-hidden="true" />
                  <input inputMode="numeric" maxLength={4} placeholder={t('profil.general.foundedPlaceholder')} className={cn(proInput, 'pl-11', e.creation && 'border-rose-500')} {...register('creation', { onChange: (ev: React.ChangeEvent<HTMLInputElement>) => setValue('creation', ev.target.value.replace(/\D/g, '').slice(0, 4)) })} />
                </span>
                {e.creation?.message && <span className="mt-1 block text-xs font-medium text-rose-600">{e.creation.message}</span>}
              </label>
              <label className="md:col-span-2">
                <ProLabel>{t('profil.general.presentation')}</ProLabel>
                <textarea rows={3} maxLength={300} placeholder={tae('profile.overview.presentation', { name: a.nom, licences: a.permis.slice().sort().join(', ') })} className="w-full resize-none rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] text-ink focus:border-brand-500" {...register('description')} />
                <span className="text-xs text-muted">{t('autoEcole.profil.presentationAide')}</span>
              </label>
            </div>
          </ProCard>
          <div className="space-y-4">
            <ProCard title={t('profil.visibility.title')} icon={<BadgeCheck />}>
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 font-semibold text-emerald-700">
                <BadgeCheck className="size-5" aria-hidden="true" />
                {t('autoEcole.profil.agreee')}
              </p>
            </ProCard>
            <ProCard title={t('autoEcole.profil.permis')} icon={<Car />}>
              <p className="mt-2 text-sm text-navy-900">{a.permis.slice().sort().map((c) => tae('common.licence', { code: c })).join(' · ')}</p>
              <Button to={ROUTES.pro.licences} variant="outline" size="sm" className="mt-3">
                {t('autoEcole.profil.gererPermis')}
              </Button>
            </ProCard>
          </div>
        </div>
      )}
      {onglet === 'coordonnees' && (
        <ProCard title={t('profil.contact.title')} icon={<MapPin />}>
          <div className="mt-3 space-y-3">
            <SelectionGeographique valeur={lieu} onChange={changerLieu} erreurs={{ region: e.region?.message, departement: e.departement?.message, arrondissement: e.arrondissement?.message, quartier: e.quartier?.message }} />
            <div className="grid gap-x-6 gap-y-3 md:grid-cols-2">
              {champ('adresse', t('profil.contact.address'), { icone: <MapPin />, large: true, aide: t('autoEcole.profil.adresseExemple') })}
              {champ('telephone', t('profil.contact.phone'), { requis: true, icone: <Phone /> })}
              {champ('email', t('profil.contact.email'), { requis: true, icone: <Mail /> })}
              {champ('site', `${t('profil.contact.website')} ${t('profil.contact.optional')}`, { icone: <Globe /> })}
            </div>
          </div>
        </ProCard>
      )}
      {onglet === 'agrement' && (
        <ProCard title={t('profil.accreditation.title')} icon={<ShieldCheck />}>
          <div className="mt-3 grid gap-x-6 gap-y-3 md:grid-cols-2">
            {champ('agrementNumero', t('profil.accreditation.authorisation'))}
            {champ('agrementDate', t('profil.accreditation.issueDate'), { icone: <Calendar /> })}
            <label>
              <ProLabel>{t('profil.accreditation.authority')}</ProLabel>
              <select className={proInput} {...register('agrementAutorite')}>
                {AUTORITES.map((x) => (
                  <option key={x} value={x}>
                    {x === 'Autre' ? t('profil.accreditation.otherAuthority') : x}
                  </option>
                ))}
              </select>
            </label>
            {champ('agrementExpiration', `${t('profil.accreditation.expiry')} ${t('profil.accreditation.ifApplicable')}`, { icone: <Calendar /> })}
            {champ('niu', t('profil.accreditation.taxNumber'))}
            {champ('rccm', t('profil.accreditation.rccm'))}
          </div>
        </ProCard>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={() => reset(valeurs)}>
          {t('footer.cancel')}
        </Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          <Check strokeWidth={3} />
          {t('autoEcole.profil.enregistrer')}
        </Button>
      </div>
    </form>
  )
}

/** Médias : logo, photo de couverture et photos de la galerie (fiche publique : en-tête, Aperçu, Galerie). */
function Medias({ a }: { a: AutoEcole }) {
  const { t } = useTranslation('pro')
  const galerie = usePhotosAutoEcole(a.id, 'galerie')
  const [envoi, setEnvoi] = useState(false)
  const lire = async (fichier: File | undefined, faire: (dataUrl: string) => Promise<unknown>) => {
    if (!fichier) return
    if (fichier.size > TAILLE_MAX_PHOTO) return void toast.error(t('profil.media.tooBig'))
    setEnvoi(true)
    try {
      await faire(await lireImage(fichier))
      toast.success(t('autoEcole.profil.media.ajoute'))
    } finally {
      setEnvoi(false)
    }
  }
  const choix = (onFile: (f: File | undefined) => void) => (
    <input type="file" accept="image/*" className="sr-only" disabled={envoi} onChange={(ev) => { const f = ev.target.files?.[0]; ev.target.value = ''; onFile(f) }} />
  )
  const bouton = 'inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border-2 border-brand-600/60 bg-white px-4 text-[14px] font-semibold text-navy-800 hover:bg-brand-50'
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ProCard title={t('autoEcole.profil.media.logo')} icon={<ImageIcon />}>
          <div className="mt-3 flex items-center gap-4">
            <Img src={a.logo ?? a.image} alt={t('autoEcole.profil.media.logo')} className="size-24 rounded-xl border border-line" />
            <label className={bouton}>
              <Camera className="size-4" aria-hidden="true" />
              {t('autoEcole.profil.media.changer')}
              {choix((f) => void lire(f, (logo) => data.update('autoEcoles', a.id, { logo })))}
            </label>
          </div>
        </ProCard>
        <ProCard title={t('autoEcole.profil.media.couverture')} icon={<ImageIcon />}>
          <div className="mt-3 flex items-center gap-4">
            <Img src={a.image} alt={t('autoEcole.profil.media.couverture')} className="h-24 w-40 rounded-xl border border-line" />
            <label className={bouton}>
              <Camera className="size-4" aria-hidden="true" />
              {t('autoEcole.profil.media.changer')}
              {choix((f) => void lire(f, (image) => data.update('autoEcoles', a.id, { image })))}
            </label>
          </div>
        </ProCard>
      </div>
      <ProCard
        title={t('autoEcole.profil.media.galerie', { count: galerie.length })}
        icon={<ImagePlus />}
        action={
          <label className={bouton}>
            <ImagePlus className="size-4" aria-hidden="true" />
            {t('autoEcole.profil.media.ajouter')}
            {choix((f) => void lire(f, (image) => data.create('photosAutoEcole', { autoEcoleId: a.id, usage: 'galerie', image }, 'photo')))}
          </label>
        }
      >
        {galerie.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t('autoEcole.profil.media.vide')}</p>
        ) : (
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {galerie.map((p) => (
              <li key={p.id} className="group relative">
                <Img src={p.image} alt="" className="aspect-[4/3] w-full rounded-xl" />
                {p.autoEcoleId === a.id && (
                  <button
                    type="button"
                    aria-label={t('autoEcole.profil.media.retirer')}
                    onClick={() => void data.remove('photosAutoEcole', p.id).then(() => toast.success(t('autoEcole.profil.media.retiree')))}
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/95 text-rose-600 shadow"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </ProCard>
    </div>
  )
}
