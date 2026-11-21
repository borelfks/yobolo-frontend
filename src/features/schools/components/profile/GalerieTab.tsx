import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BookOpen, Building2, FlaskConical, Image as ImageIcon, LayoutGrid, Monitor, Users } from 'lucide-react'
import { Img } from '@/shared/components/ui/Img'
import { card } from '@/features/schools/components/profile/profileShared'
import { albums } from '@/mocks/schools'
import { cn } from '@/shared/utils/cn'

const albumIcons = { 'Campus & bâtiments': Building2, 'Salles de cours': Monitor, Laboratoires: FlaskConical, Bibliothèque: BookOpen, 'Vie étudiante': Users } as const

/** Identifiant du filtre « Toutes les photos » (les albums gardent leur nom). */
const ALL = '__all__'

/** Onglet « Galerie » de la fiche établissement. */
export function GalerieTab({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const [cat, setCat] = useState(ALL)
  const total = albums.reduce((s, a) => s + a.count, 0)
  const shown = cat === ALL ? albums : albums.filter((a) => a.nom === cat)
  const allLabel = t('ecoleProfil.galerie.all')
  return (
    <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
      <div className={cn(card, 'h-fit p-4')}>
        <h2 className="flex items-start gap-3 text-[21px] leading-tight font-bold text-navy-900">
          <ImageIcon className="size-11 shrink-0 text-brand-600" strokeWidth={1.6} />
          {t('ecoleProfil.galerie.title')}
        </h2>
        <p className="mt-3 text-[14.5px] text-ink">{t('ecoleProfil.galerie.intro')}</p>
        <div className="mt-4 space-y-2">
          {[{ nom: ALL, count: total }, ...albums].map((a) => {
            const Icon = a.nom === ALL ? LayoutGrid : albumIcons[a.nom as keyof typeof albumIcons]
            return (
              <button
                key={a.nom}
                type="button"
                onClick={() => setCat(a.nom)}
                className={cn('flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] font-semibold', cat === a.nom ? 'bg-brand-600 text-white' : 'bg-[#f0f4fc] text-navy-900 hover:bg-brand-50')}
              >
                <Icon className="size-5" />
                <span className="flex-1">{a.nom === ALL ? allLabel : a.nom}</span>
                <span className="font-medium">({a.count})</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="flex items-center gap-2.5 text-[22px] font-bold text-navy-900">
          <ImageIcon className="size-7" /> {cat === ALL ? allLabel : cat} ({cat === ALL ? total : albums.find((a) => a.nom === cat)?.count})
        </h2>
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
          {shown.map((a) => (
            <button key={a.nom} type="button" onClick={() => toast(t('ecoleProfil.galerie.albumToast', { name: a.nom }))} className="overflow-hidden rounded-xl transition-transform hover:scale-[1.01]">
              <Img src={a.image} alt={a.nom} className="h-[162px] w-full" />
            </button>
          ))}
          {cat === ALL && (
            <button type="button" onClick={() => toast(t('ecoleProfil.galerie.videoToast', { id: id.toUpperCase() }))} className="overflow-hidden rounded-xl transition-transform hover:scale-[1.01]">
              <Img src="/images/maquette/album-video.jpg" alt={t('ecoleProfil.galerie.videoAlt')} className="h-[162px] w-full" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
