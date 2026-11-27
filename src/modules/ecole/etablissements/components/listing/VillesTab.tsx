import { useState } from 'react'
import { Lien } from '@/shared/ui/Lien'
import { Trans, useTranslation } from 'react-i18next'
import { ChevronRight, GraduationCap, Heart, MapPin } from 'lucide-react'
import { ResultsHeader } from '@/modules/ecole/etablissements/components/EcoleBlocks'
import { SidePanel } from '@/modules/ecole/etablissements/components/ListingBlocks'
import { ListSearch } from '@/modules/ecole/etablissements/components/listing/ListSearch'
import { useTypeLabels } from '@/modules/ecole/etablissements/components/listing/useTypeLabels'
import { Img } from '@/shared/ui/Img'
import type { TypeSlug } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { useEtablissementsParLieu, useEtablissements, useVilles } from '@/data/hooks'

/** Onglet Villes : arbre régions → villes à gauche, tuiles de villes à droite. */
export function VillesTab({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const { court } = useTypeLabels(type)
  const { total, parRegion, parVille } = useEtablissementsParLieu(type)
  const photos = useVilles()
  const etablissements = useEtablissements()
  // Les villes où le type a au moins un établissement, avec leur région et leur vrai nombre.
  const villes = Object.entries(parVille).map(([nom, ipes]) => {
    const photo = photos.find((v) => v.nom === nom)
    return { id: nom, nom, ipes, region: photo?.region ?? etablissements.find((e) => e.ville === nom)?.region ?? '', image: photo?.image ?? '' }
  })
  const villesParRegion: Record<string, { nom: string; ipes: number }[]> = {}
  for (const v of villes) (villesParRegion[v.region] ??= []).push(v)
  const n = num
  const [openRegion, setOpenRegion] = useState(Object.keys(parRegion)[0] ?? '')
  const [checked, setChecked] = useState<string[]>([])
  const [tri, setTri] = useState(0)
  // Les villes cochées dans l'arbre filtrent les tuiles ; tri par nombre ou par nom.
  const cochees = checked.length ? villes.filter((v) => checked.includes(v.nom)) : villes
  const villesAffichees = tri === 1 ? [...cochees].sort((a, b) => a.nom.localeCompare(b.nom)) : [...cochees].sort((a, b) => b.ipes - a.ipes)
  const arbre = Object.entries(parRegion)
    .map(([nom, count]) => ({ nom, count }))
    .sort((a, b) => b.count - a.count)
  return (
    <div className="space-y-4">
      <ListSearch type={type} />
      <div className="grid gap-5 lg:grid-cols-[246px_1fr]">
        <SidePanel title={t('listing.villes.panel')} icon={<MapPin />}>
          <ul className="space-y-0.5">
            {arbre.map((r) => {
              const open = openRegion === r.nom
              const vs = villesParRegion[r.nom]
              return (
                <li key={r.nom} className="border-b border-line/70 last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpenRegion(open ? '' : r.nom)}
                    className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[15px] font-bold', open ? 'bg-[#e6eeff] text-brand-700' : 'text-navy-900 hover:bg-brand-50')}
                  >
                    <ChevronRight className={cn('size-4 transition-transform', open && 'rotate-90')} />
                    <span className="flex-1">{r.nom}</span>
                    <span className="text-[13px] font-normal text-ink">({n(r.count)})</span>
                  </button>
                  {open && vs && (
                    <ul className="space-y-0.5 py-1.5 pl-6">
                      {vs.map((v) => (
                        <li key={v.nom}>
                          <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-[13px]">
                            <input
                              type="checkbox"
                              checked={checked.includes(v.nom)}
                              onChange={(e) => setChecked(e.target.checked ? [...checked, v.nom] : checked.filter((x) => x !== v.nom))}
                              className="size-4 accent-brand-600"
                            />
                            <span className="flex-1">{v.nom}</span>
                            <span>({n(v.ipes)})</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </SidePanel>
        <div className="space-y-3">
          <ResultsHeader title={t('listing.villes.title', { court, n: total })} sort={[t('listing.villes.sort.count', { court }), t('listing.villes.sort.name')]} tri={tri} onTri={setTri} />
          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {villesAffichees.map((v) => (
              <Lien key={v.nom} to={`${ROUTES.schoolType(type)}?${new URLSearchParams({ ville: v.nom })}`} className="group overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_8px_rgba(15,29,61,0.06)] transition-shadow hover:shadow-lg">
                <div className="relative">
                  <Img src={v.image} alt={v.nom} className="h-[86px] w-full" />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-navy-800 px-2.5 py-0.5 text-[12px] font-semibold text-white">
                    <MapPin className="size-3.5" />
                    {v.region}
                  </span>
                  <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white shadow">
                    <Heart className="size-4 text-navy-900" />
                  </span>
                </div>
                <div className="px-3 pt-2 pb-2.5">
                  <p className="text-[18px] font-bold text-navy-950">{v.nom}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-[15px] text-navy-900">
                    <GraduationCap className="size-4" />
                    <span className="flex-1">
                      <Trans t={t} i18nKey="listing.villes.tileCount" values={{ n: n(v.ipes), court }} components={{ b: <b /> }} />
                    </span>
                    <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <ChevronRight className="size-4" />
                    </span>
                  </p>
                </div>
              </Lien>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
