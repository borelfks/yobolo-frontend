import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Building2, FlaskConical, Image as ImageIcon, LayoutGrid, Monitor, Users } from 'lucide-react'
import { Img } from '@/shared/components/ui/Img'
import { card } from '@/features/schools/components/profile/profileShared'
import { cn } from '@/shared/utils/cn'
import { useAlbums, useEtablissement, useMedias, useVideos } from '@/data/hooks'
import { Visionneuse } from '@/shared/components/ui/Visionneuse'

const albumIcons = { 'Campus & bâtiments': Building2, 'Salles de cours': Monitor, Laboratoires: FlaskConical, Bibliothèque: BookOpen, 'Vie étudiante': Users } as const

/** Identifiant du filtre « Toutes les photos » (les albums gardent leur nom). */
const ALL = '__all__'

/** Onglet « Galerie » de la fiche établissement. */
export function GalerieTab({ id }: { id: string }) {
  const albums = useAlbums()
  const videoGalerie = useVideos('etablissement', id, 'galerie')[0]
  const [video, setVideo] = useState<number | null>(null)
  // Les médias de l'établissement (ajoutés depuis son espace pro, Profil › Médias).
  const e = useEtablissement(id)
  const medias = useMedias(id)
  const [media, setMedia] = useState<number | null>(null)
  const [vue, setVue] = useState<number | null>(null)
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
          {shown.map((a, i) => (
            <button key={a.nom} type="button" onClick={() => setVue(i)} className="overflow-hidden rounded-xl transition-transform hover:scale-[1.01]">
              <Img src={a.image} alt={a.nom} className="h-[162px] w-full" />
            </button>
          ))}
          {cat === ALL && videoGalerie && (
            <button type="button" onClick={() => setVideo(0)} className="overflow-hidden rounded-xl transition-transform hover:scale-[1.01]">
              <Img src={videoGalerie.poster} alt={t('ecoleProfil.galerie.videoAlt')} className="h-[162px] w-full" />
            </button>
          )}
        </div>
      </div>
      {medias.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2.5 text-[22px] font-bold text-navy-900">
            <ImageIcon className="size-7" /> {t('ecoleProfil.galerie.medias', { count: medias.length })}
          </h2>
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
            {medias.map((m, i) => (
              <button key={m.id} type="button" onClick={() => setMedia(i)} className="overflow-hidden rounded-xl transition-transform hover:scale-[1.01]">
                {m.video && m.src.startsWith('data:video') ? <video src={m.src} muted className="h-[130px] w-full object-cover" /> : <Img src={m.src} alt="" className="h-[130px] w-full" />}
              </button>
            ))}
          </div>
        </div>
      )}
      <Visionneuse elements={medias.map((m) => ({ src: m.src, alt: e.nom, video: m.video && (m.src.startsWith('data:video') || m.src.endsWith('.webm')) }))} index={media} onClose={() => setMedia(null)} />
      {videoGalerie && <Visionneuse elements={[{ src: videoGalerie.src, poster: videoGalerie.poster, video: true, alt: videoGalerie.titre }]} index={video} onClose={() => setVideo(null)} />}
      <Visionneuse elements={shown.map((a) => ({ src: a.image, alt: a.nom }))} index={vue} onClose={() => setVue(null)} />
    </div>
  )
}
