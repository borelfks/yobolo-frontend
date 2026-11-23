import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Car, GraduationCap, LayoutGrid, MapPin, School, ShieldCheck, Star, Users } from 'lucide-react'
import { EcoleCard, ResultsHeader, SearchPanel } from '@/features/schools/components/EcoleBlocks'
import { Hero, HeroFeatures } from '@/shared/components/ui/Hero'
import { Pagination } from '@/shared/components/ui/Pagination'
import { regions, typesEcole } from '@/mocks/schools'
import { useEtablissements } from '@/data/hooks'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { schoolTypeKey } from '@/features/schools/schoolLinks'

const tiles: Record<string, { icon: typeof GraduationCap; circle: string; labelKey: 'all' | 'ipes' | 'cfp' | 'autoEcoles' | 'autres'; to: string }> = {
  toutes: { icon: School, circle: '', labelKey: 'all', to: ROUTES.schools },
  IPES: { icon: GraduationCap, circle: 'bg-[#e3ecff] text-brand-600', labelKey: 'ipes', to: ROUTES.schoolType('ipes') },
  CFP: { icon: Users, circle: 'bg-[#eee6ff] text-violet-600', labelKey: 'cfp', to: ROUTES.schoolType('cfp') },
  'Auto-école': { icon: Car, circle: 'bg-orange-500 text-white', labelKey: 'autoEcoles', to: ROUTES.drivingSchools },
  Autre: { icon: LayoutGrid, circle: 'bg-[#f1e6ff] text-violet-600', labelKey: 'autres', to: ROUTES.schoolType('autres') },
}

/** Valeurs du filtre « Type d’école » (libellés traduits à l'affichage). */
const typeOptions = ['IPES', 'CFP', 'Auto-école', 'Autre'] as const

/** Les 4 cartes de la maquette en premier, puis le reste de l'annuaire. */
const vedettes = ['ipc', 'cfp-btp', 'langues']

export function EcolesHub() {
  const { t } = useTranslation('schools')
  const [q, setQ] = useState('')
  const etablissements = useEtablissements()
  // Comme avant : un identifiant inconnu renvoie le premier établissement.
  const byId = (id: string) => etablissements.find((e) => e.id === id) ?? etablissements[0]!
  const ordered = [...vedettes.map(byId), ...etablissements.filter((e) => !vedettes.includes(e.id))]
  const list = ordered.filter((e) => e.nom.toLowerCase().includes(q.toLowerCase()))
  const autoEcole = {
    ...byId('ipc'),
    id: 'conduite-sure',
    nom: 'Auto-École La Conduite Sûre',
    type: 'Auto-école' as const,
    note: 4.8,
    avis: 96,
    quartier: 'Centre',
    image: '/images/maquette/ecole-ae-conduite-sure.jpg',
    filieres: ['Permis A', 'Permis B', 'Permis C'],
  }
  const cards = q ? list : [list[0], list[1], autoEcole, list[2], ...list.slice(3)]
  return (
    <div className="mx-auto max-w-[1320px] space-y-5 px-5 py-4">
      <Hero
        icon={<GraduationCap />}
        iconBox={false}
        image="/images/maquette/ecoles-hero.jpg"
        title={t('hub.title')}
        subtitle={t('hub.subtitle')}
      >
        <HeroFeatures
          items={[
            { icon: <ShieldCheck className="fill-white text-navy-800" />, label: t('hub.features.verified') },
            { icon: <Star className="fill-white" />, label: t('hub.features.certified') },
            { icon: <MapPin className="fill-white text-navy-800" />, label: t('hub.features.everywhere') },
          ]}
        />
      </Hero>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {typesEcole.map((tile, i) => {
          const s = tiles[tile.key]
          return (
            <Link
              key={tile.key}
              to={s.to}
              className={cn(
                'flex h-[68px] items-center gap-3.5 rounded-2xl px-4 shadow-[0_2px_10px_rgba(15,29,61,0.07)] transition-all hover:-translate-y-0.5',
                i === 0 ? 'bg-brand-600 text-white' : 'border border-line bg-white',
              )}
            >
              {i === 0 ? (
                <s.icon className="size-8 shrink-0" />
              ) : (
                <span className={cn('grid size-12 shrink-0 place-items-center rounded-full', s.circle)}>
                  <s.icon className="size-6" />
                </span>
              )}
              <span className="leading-tight">
                <span className={cn('block text-[17px] font-bold whitespace-nowrap', i === 0 ? 'text-white' : 'text-navy-950')}>{t(`hub.tiles.${s.labelKey}`)}</span>
                <span className={cn('text-[16px]', i === 0 ? 'text-white/90' : 'text-ink/80')}>({num(tile.count)})</span>
              </span>
            </Link>
          )
        })}
      </section>

      <SearchPanel
        title={t('hub.search.title')}
        fields={[
          { placeholder: t('hub.search.location'), hint: t('hub.search.locationHint'), options: regions.map((r) => r.nom), icon: <MapPin /> },
          { placeholder: t('hub.search.type'), hint: t('hub.search.typeHint'), options: typeOptions.map((o) => t(`schoolTypes.${schoolTypeKey[o]}`)), icon: <GraduationCap /> },
        ]}
        onSearch={setQ}
      />

      <section className="space-y-4">
        <ResultsHeader title={t('hub.found', { n: q ? list.length : t('hub.total') })} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((e) => (
            <EcoleCard key={e.id} e={e} />
          ))}
        </div>
        <Pagination label={t('hub.pagination')} pages={5} />
      </section>
    </div>
  )
}
