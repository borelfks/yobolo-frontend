import { Lien } from '@/shared/ui/Lien'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Award, BarChart3, Building2, Calculator, CircleCheck, GraduationCap, Info, Laptop, Layers, MapPin, Megaphone, Sun, Users } from 'lucide-react'
import { Img } from '@/shared/ui/Img'
import { ActionButtons } from '@/modules/ecole/etablissements/components/profile/ActionButtons'
import { card, principales } from '@/modules/ecole/etablissements/components/profile/profileShared'
import { slugOfType } from '@/modules/ecole/etablissements/schoolTypes'
import { useEtablissement, useFormationsOf, useVideos } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { ROUTES } from '@/shared/utils/routes'
import { Visionneuse } from '@/shared/ui/Visionneuse'

const filiereTiles = [
  { bg: 'bg-[#e8f0ff]', color: 'text-brand-600', icon: Calculator },
  { bg: 'bg-[#efe8ff]', color: 'text-violet-600', icon: Users },
  { bg: 'bg-[#e1f6ee]', color: 'text-emerald-600', icon: Laptop },
  { bg: 'bg-[#fff2df]', color: 'text-orange-500', icon: BarChart3 },
  { bg: 'bg-[#fde9f3]', color: 'text-pink-600', icon: Megaphone },
]

const highlights = ['professional', 'experts', 'internships'] as const

/** Onglet « Aperçu » de la fiche établissement. */
export function ApercuTab({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(id)
  const list = useFormationsOf(id).filter((f) => f.statut === 'Publiée')
  const diplomes = [...new Set(list.map((f) => f.diplome))]
  const fil = principales(e)
  const presentation = useVideos('etablissement', e.id, 'presentation')[0]
  const [vue, setVue] = useState<number | null>(null)
  return (
    <div className="space-y-4">
      <div className="grid items-start gap-4 lg:grid-cols-[1.06fr_0.92fr_0.74fr]">
        {presentation && (
          <button type="button" onClick={() => setVue(0)} aria-label={t('ecoleProfil.apercu.videoAlt', { sigle: e.sigle })} className="overflow-hidden rounded-2xl">
            <Img src={presentation.poster} alt={t('ecoleProfil.apercu.videoAlt', { sigle: e.sigle })} className="h-auto w-full sm:h-[244px]" />
          </button>
        )}
        {presentation && <Visionneuse elements={[{ src: presentation.src, poster: presentation.poster, video: true, alt: t('ecoleProfil.apercu.videoAlt', { sigle: e.sigle }) }]} index={vue} onClose={() => setVue(null)} />}
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <Info className="size-6 text-brand-600" /> {t('ecoleProfil.apercu.presentation')}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink">{e.description}</p>
          <ul className="mt-3 space-y-2.5">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-[14.5px] text-navy-900">
                <CircleCheck className="size-6 fill-emerald-500 text-white" />
                {t(`ecoleProfil.apercu.highlights.${h}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <Building2 className="size-6 text-brand-600" /> {t('ecoleProfil.apercu.keyInfo')}
          </h2>
          <dl className="mt-2 divide-y divide-line text-[14.5px]">
            {[
              { icon: <GraduationCap />, k: t('ecoleProfil.apercu.keys.formations'), v: e.formations },
              { icon: <Layers />, k: t('ecoleProfil.apercu.keys.filieres'), v: fil.length },
              { icon: <Award />, k: t('ecoleProfil.apercu.keys.diplomes'), v: diplomes.join(', ') },
              { icon: <Sun className="fill-amber-400 text-amber-500" />, k: t('ecoleProfil.apercu.keys.cours'), v: t('shared.modes.jourEtSoir') },
              { icon: <MapPin />, k: t('ecoleProfil.apercu.keys.localisation'), v: `${e.ville} – ${e.quartier}` },
            ].map((r) => (
              <div key={r.k} className="flex items-center gap-3 py-2 [&_svg]:size-5 [&_svg]:text-navy-800">
                {r.icon}
                <dt className="font-bold text-navy-900">{r.k} :</dt>
                <dd className="text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.98fr_0.74fr]">
        <div className={cn(card, 'p-4')}>
          <h2 className="flex items-center gap-2.5 text-[21px] font-bold text-navy-900">
            <Layers className="size-6 text-brand-600" /> {t('ecoleProfil.apercu.mainFields')}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {fil.map((f, i) => {
              const tile = filiereTiles[i % filiereTiles.length]
              const [l1, l2] = f.includes(' & ') ? [f.split(' & ')[0], '& ' + f.split(' & ')[1]] : f.split(' ').length > 1 ? [f.split(' ')[0], f.split(' ').slice(1).join(' ')] : [f, '']
              return (
                <Lien key={f} to={ROUTES.school(slugOfType(e.type), e.id, 'formations')} className={cn('flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center text-[14px] leading-tight font-bold text-navy-900 transition-shadow hover:shadow-md', tile.bg)}>
                  <tile.icon className={cn('size-7', tile.color)} />
                  <span>
                    {l1}
                    {l2 && <span className="block">{l2}</span>}
                  </span>
                </Lien>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <ActionButtons id={id} />
        </div>
      </div>
    </div>
  )
}
