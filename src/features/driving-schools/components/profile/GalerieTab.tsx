import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Award, Building2, Car, Image as ImageIcon, Images, PlayCircle, Users } from 'lucide-react'
import { Heading } from '@/features/driving-schools/components/profile/ProfileParts'
import { card } from '@/features/driving-schools/components/profile/profileUtils'
import { Img } from '@/shared/components/ui/Img'
import { useAutoEcole, useCategoriesGalerie, usePhotosAutoEcole, useVideos } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { Visionneuse } from '@/shared/components/ui/Visionneuse'

/** Onglet « Galerie » de la fiche d'une auto-école. */
export function GalerieTab({ id }: { id: string }) {
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcole(id)
  const [cat, setCat] = useState('all')
  // Catégories et photos : dans la base ; l'icône de chaque catégorie reste dans le code.
  const icones = { all: null, centre: <Building2 />, vehicles: <Car />, classes: <Users />, exams: <Award /> }
  const cats = useCategoriesGalerie().map((c) => ({ ...c, icon: icones[c.id] }))
  const photos = usePhotosAutoEcole(a.id, 'galerie').map((p) => p.image)
  // Mise en page de la maquette : 3 photos sur la première ligne, le reste sur la seconde.
  const rows = [photos.slice(0, 3), photos.slice(3)]
  const [vue, setVue] = useState<number | null>(null)
  const videos = useVideos('auto-ecole', a.id, 'galerie')
  const [video, setVideo] = useState<number | null>(null)
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_286px]">
      <div className="space-y-3">
        <div className={cn(card, 'flex flex-wrap items-center gap-3 px-4 py-3')}>
          <span className="flex items-center gap-2.5 pr-3 text-[18px] font-bold text-navy-900"><ImageIcon className="size-7 text-brand-600" />{t('profile.gallery.categories')}</span>
          {cats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={cn('inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14.5px] font-semibold [&_svg]:size-5', cat === c.id ? 'bg-brand-600 text-white' : 'bg-[#eef3fc] text-navy-900 hover:bg-brand-100')}
            >
              {c.icon}
              {t(`profile.gallery.cats.${c.id}`)} ({c.count})
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[1.12fr_0.97fr_1fr] gap-3">
          {rows[0].map((src, i) => (
            <button key={src} type="button" onClick={() => setVue(i)} aria-label={t('profile.gallery.photoAlt', { name: a.nom, n: i + 1 })} className="overflow-hidden rounded-xl">
              <Img src={src} alt="" className="h-[220px] w-full transition-transform hover:scale-[1.02]" />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {rows[1].map((src, i) => (
            <button key={src} type="button" onClick={() => setVue(rows[0].length + i)} aria-label={t('profile.gallery.photoAlt', { name: a.nom, n: rows[0].length + i + 1 })} className="overflow-hidden rounded-xl">
              <Img src={src} alt="" className="h-[170px] w-full transition-transform hover:scale-[1.02]" />
            </button>
          ))}
        </div>
      </div>
      <Visionneuse elements={photos.map((src, i) => ({ src, alt: t('profile.gallery.photoAlt', { name: a.nom, n: i + 1 }) }))} index={vue} onClose={() => setVue(null)} />
      <Visionneuse elements={videos.map((v) => ({ src: v.src, poster: v.poster, video: true, alt: v.titre }))} index={video} onClose={() => setVideo(null)} />
      <aside className="space-y-4">
        <div className={cn(card, 'p-4')}>
          <Heading icon={<Images />}>{t('profile.gallery.sideTitle')}</Heading>
          <ul className="mt-3 space-y-3.5 border-t border-line pt-3 text-[15px] text-navy-900 [&_svg]:size-6 [&_svg]:text-brand-600">
            <li className="flex items-center gap-3"><ImageIcon />{t('profile.gallery.photos', { count: cats.find((c) => c.id === 'all')?.count ?? photos.length })}</li>
            <li className="flex items-center gap-3"><PlayCircle />{t('profile.gallery.videos', { count: videos.length })}</li>
            <li className="flex items-center gap-3"><Building2 />{t('profile.gallery.centre')}</li>
            <li className="flex items-center gap-3"><Car />{t('profile.gallery.vehicles')}</li>
            <li className="flex items-center gap-3"><Users />{t('profile.gallery.classes')}</li>
            <li className="flex items-center gap-3"><Award />{t('profile.gallery.exams')}</li>
          </ul>
        </div>
        <button type="button" onClick={() => setVideo(0)} disabled={videos.length === 0} className={cn(card, 'flex w-full items-center justify-center p-4')}>
          <span className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-brand-600 text-[18px] font-semibold text-white">
            <PlayCircle className="size-7" />
            {t('profile.gallery.seeVideos')}
          </span>
        </button>
      </aside>
    </div>
  )
}
