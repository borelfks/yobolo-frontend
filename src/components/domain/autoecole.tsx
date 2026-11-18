import { useState, type ReactNode } from 'react'
import { permisIcon } from '@/lib/autoecole-helpers'
import { BadgeCheck, Building2, Car, ChevronDown, CircleCheck, Coins, Folder, Heart, MapPin, Star, Users, X } from 'lucide-react'
import { Breadcrumb, Img, type Crumb } from '@/components/ui/Feedback'
import { useFavorites } from '@/hooks/useFavorites'
import { autoEcoleById, permisCatalogue, type PermisCode } from '@/mocks/autoecoles'
import { cn } from '@/lib/utils'

export function PermisPill({ code, withLabel }: { code: PermisCode; withLabel?: boolean }) {
  const Icon = permisIcon[code]
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
      <Icon className="size-3.5" />
      {code}
      {withLabel && <span className="font-medium"> – {permisCatalogue[code].nom}</span>}
    </span>
  )
}

export function AgreeeBadge({ light }: { light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', light ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700')}>
      <BadgeCheck className="size-3.5" />
      Agréée
    </span>
  )
}

/** En-tête bleu nuit d'une auto-école (logo carré, nom, note, apprenants formés). */
export function AEHeader({
  id,
  crumbs,
  title,
  subtitle,
  image = '/maquette/ae-profil-hero.jpg',
}: {
  id: string
  crumbs: Crumb[]
  title?: ReactNode
  subtitle?: ReactNode
  image?: string
}) {
  const a = autoEcoleById(id)
  return (
    <>
      <Breadcrumb items={crumbs} className="-mt-1" />
      <section className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#08173f_0%,#0c2160_55%,#123088_100%)] text-white">
        <Img src={image} alt="" className="absolute inset-y-0 right-0 hidden h-full w-[47%] object-left md:block" />
        <div className="relative flex flex-col gap-6 p-4 md:flex-row md:items-center md:px-7 md:py-3.5">
          {a.logo ? (
            <Img src={a.logo} alt={`Logo ${a.nom}`} className="h-[110px] w-[124px] shrink-0 rounded-xl" />
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
                  Agréée
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
                    <b>{a.note.toLocaleString('fr-FR')}/5</b> ({a.avis} avis)
                  </span>
                  <span className="h-6 w-px bg-white/30" />
                  <span className="inline-flex items-center gap-2 text-white/90">
                    <Users className="size-6 text-brand-200" />
                    {a.formes.toLocaleString('fr-FR')} apprenants formés
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

/** Modale « Ajouter aux favoris » avec choix du dossier (img72). */
export function FavoriteModal({ open, onClose, aeId, code }: { open: boolean; onClose: () => void; aeId: string; code?: PermisCode }) {
  const { add, folders } = useFavorites()
  const [folder, setFolder] = useState('Mes formations')
  const a = autoEcoleById(aeId)
  const p = code ? permisCatalogue[code] : null
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#c9d3e6]/70 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Ajouter aux favoris" className="w-full max-w-[650px] rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#e3ebfb] text-brand-600">
            <Heart className="size-8" />
          </span>
          <div className="flex-1">
            <h2 className="text-[26px] font-bold text-navy-900">Ajouter aux favoris</h2>
            <p className="text-[15px] text-navy-900">Enregistrez cette {p ? 'formation' : 'auto-école'} pour la retrouver facilement.</p>
          </div>
          <button type="button" aria-label="Fermer" onClick={onClose} className="grid size-9 place-items-center rounded-full text-navy-900 hover:bg-slate-100">
            <X className="size-6" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[#eef3fc] p-3">
          <Img src={p ? `/maquette/permis-pres-${p.code === 'E' ? 'C' : p.code}.jpg` : a.image} alt="" className="h-[112px] w-[200px] rounded-xl" />
          <div className="space-y-1.5 text-[15px] text-navy-900">
            <p className="text-[20px] font-bold">{p ? `Permis ${p.code} – ${p.nom}` : a.nom}</p>
            <p className="flex items-center gap-2"><Building2 className="size-5 text-brand-600" />{a.nom}</p>
            <p className="flex items-center gap-2"><MapPin className="size-5 text-brand-600" />{a.ville} – {a.quartier}</p>
            {p && <p className="flex items-center gap-2 text-[19px] font-extrabold text-brand-700"><Coins className="size-5" />{p.prix.toLocaleString('fr-FR')} FCFA</p>}
          </div>
        </div>
        <p className="mt-5 mb-2 flex items-center gap-2 text-[16px] font-semibold text-navy-900"><Folder className="size-5 text-brand-600" />Choisir un dossier (facultatif)</p>
        <label className="relative flex h-12 items-center gap-3 rounded-xl border border-[#c9d4ea] px-4 text-[16px] text-navy-900">
          <Folder className="size-5 text-brand-600" />
          <span className="flex-1">{folder}</span>
          <ChevronDown className="size-5" />
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
            {folders.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <div className="mt-6 grid grid-cols-2 gap-5">
          <button type="button" onClick={onClose} className="h-12 rounded-full border-2 border-brand-600/60 text-[17px] font-semibold text-navy-800 hover:bg-brand-50">
            Annuler
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
            Ajouter aux favoris
          </button>
        </div>
      </div>
    </div>
  )
}
