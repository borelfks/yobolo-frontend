import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { permisIcon } from '@/features/driving-schools/autoEcoleRules'
import { Breadcrumb, type Crumb } from '@/shared/components/ui/Breadcrumb'
import { Img } from '@/shared/components/ui/Img'
import { useFavorites } from '@/shared/hooks/useFavorites'
import { autoEcoleById, permisCatalogue } from '@/mocks/drivingSchools'
import type { PermisCode } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { fcfa, num } from '@/shared/utils/format'
import { BadgeCheck, Building2, Car, ChevronDown, CircleCheck, Coins, Folder, Heart, MapPin, Star, Users, X } from 'lucide-react'

export function PermisPill({ code, withLabel }: { code: PermisCode; withLabel?: boolean }) {
  const { t } = useTranslation('driving-schools')
  const Icon = permisIcon[code]
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
      <Icon className="size-3.5" />
      {code}
      {withLabel && <span className="font-medium"> – {t(`permis.${code}.name`)}</span>}
    </span>
  )
}

export function AgreeeBadge({ light }: { light?: boolean }) {
  const { t } = useTranslation('driving-schools')
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', light ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700')}>
      <BadgeCheck className="size-3.5" />
      {t('common.approved')}
    </span>
  )
}

/** En-tête bleu nuit d'une auto-école (logo carré, nom, note, apprenants formés). */
export function AEHeader({
  id,
  crumbs,
  title,
  subtitle,
  image = '/images/maquette/ae-profil-hero.jpg',
}: {
  id: string
  crumbs: Crumb[]
  title?: ReactNode
  subtitle?: ReactNode
  image?: string
}) {
  const { t } = useTranslation('driving-schools')
  const a = autoEcoleById(id)
  return (
    <>
      <Breadcrumb items={crumbs} className="-mt-1" />
      <section className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#08173f_0%,#0c2160_55%,#123088_100%)] text-white">
        <Img src={image} alt="" className="absolute inset-y-0 right-0 hidden h-full w-[47%] object-left md:block" />
        <div className="relative flex flex-col gap-6 p-4 md:flex-row md:items-center md:px-7 md:py-3.5">
          {a.logo ? (
            <Img src={a.logo} alt={t('header.logoAlt', { name: a.nom })} className="h-[110px] w-[124px] shrink-0 rounded-xl" />
          ) : (
            <span className="grid h-[110px] w-[124px] shrink-0 place-items-center rounded-xl bg-white text-navy-800">
              <Car className="size-12 fill-navy-800" />
            </span>
          )}
          <span className="hidden h-24 w-px bg-white/30 md:block" />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[26px] font-bold md:text-[30px]">{title ?? a.nom}</h1>
              {!title && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[15px] font-semibold">
                  <CircleCheck className="size-5 fill-white text-emerald-600" />
                  {t('common.approved')}
                </span>
              )}
            </div>
            {subtitle ? (
              <p className="max-w-[460px] text-[17px] leading-snug text-white/90">{subtitle}</p>
            ) : (
              <>
                <p className="flex items-center gap-2 text-[16px] text-white/90">
                  <MapPin className="size-5 fill-brand-500 text-navy-900" />
                  {a.ville} – {a.quartier}
                </p>
                <p className="flex flex-wrap items-center gap-x-6 text-[16px]">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="size-6 fill-amber-400 text-amber-400" />
                    <b>{num(a.note)}/5</b> {t('common.reviews', { count: a.avis })}
                  </span>
                  <span className="h-6 w-px bg-white/30" />
                  <span className="inline-flex items-center gap-2 text-white/90">
                    <Users className="size-6 text-brand-200" />
                    {t('header.trained', { value: num(a.formes) })}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

const defaultFolders = { 'Mes formations': 'myTrainings', 'Mes établissements': 'myInstitutions', 'À comparer': 'toCompare' } as const

/** Modale « Ajouter aux favoris » avec choix du dossier (img72). */
export function FavoriteModal({ open, onClose, aeId, code }: { open: boolean; onClose: () => void; aeId: string; code?: PermisCode }) {
  const { t } = useTranslation('driving-schools')
  const { add, folders } = useFavorites()
  const [folder, setFolder] = useState('Mes formations')
  const a = autoEcoleById(aeId)
  const p = code ? permisCatalogue[code] : null
  /** Les dossiers par défaut sont traduits ; ceux créés par l'utilisateur restent tels quels. */
  const folderLabel = (f: string) => {
    const key = defaultFolders[f as keyof typeof defaultFolders]
    return key ? t(`favoriteModal.folders.${key}`) : f
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#c9d3e6]/70 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={t('favoriteModal.title')} className="w-full max-w-[650px] rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#e3ebfb] text-brand-600">
            <Heart className="size-8" />
          </span>
          <div className="flex-1">
            <h2 className="text-[26px] font-bold text-navy-900">{t('favoriteModal.title')}</h2>
            <p className="text-[15px] text-navy-900">{p ? t('favoriteModal.textTraining') : t('favoriteModal.textSchool')}</p>
          </div>
          <button type="button" aria-label={t('favoriteModal.close')} onClick={onClose} className="grid size-9 place-items-center rounded-full text-navy-900 hover:bg-slate-100">
            <X className="size-6" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[#eef3fc] p-3">
          <Img src={p ? `/images/maquette/permis-pres-${p.code === 'E' ? 'C' : p.code}.jpg` : a.image} alt="" className="h-[112px] w-[200px] rounded-xl" />
          <div className="space-y-1.5 text-[15px] text-navy-900">
            <p className="text-[20px] font-bold">{p ? t('common.licenceTitle', { code: p.code, name: t(`permis.${p.code}.name`) }) : a.nom}</p>
            <p className="flex items-center gap-2"><Building2 className="size-5 text-brand-600" />{a.nom}</p>
            <p className="flex items-center gap-2"><MapPin className="size-5 text-brand-600" />{a.ville} – {a.quartier}</p>
            {p && <p className="flex items-center gap-2 text-[19px] font-extrabold text-brand-700"><Coins className="size-5" />{fcfa(p.prix)}</p>}
          </div>
        </div>
        <p className="mt-5 mb-2 flex items-center gap-2 text-[16px] font-semibold text-navy-900"><Folder className="size-5 text-brand-600" />{t('favoriteModal.chooseFolder')}</p>
        <label className="relative flex h-12 items-center gap-3 rounded-xl border border-[#c9d4ea] px-4 text-[16px] text-navy-900">
          <Folder className="size-5 text-brand-600" />
          <span className="flex-1">{folderLabel(folder)}</span>
          <ChevronDown className="size-5" />
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
            {folders.map((f) => (
              <option key={f} value={f}>
                {folderLabel(f)}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-6 grid grid-cols-2 gap-5">
          <button type="button" onClick={onClose} className="h-12 rounded-full border-2 border-brand-600/60 text-[17px] font-semibold text-navy-800 hover:bg-brand-50">
            {t('favoriteModal.cancel')}
          </button>
          <button
            type="button"
            onClick={() => {
              add(p ? `${aeId}:${p.code}` : aeId, p ? 'permis' : 'auto-ecole', folder)
              onClose()
            }}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-brand-600 text-[17px] font-semibold text-white hover:bg-brand-700"
          >
            <Heart className="size-5" />
            {t('favoriteModal.add')}
          </button>
        </div>
      </div>
    </div>
  )
}
