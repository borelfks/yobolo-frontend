import { useState } from 'react'
import { Link } from 'react-router'
import { Car, GraduationCap, LayoutGrid, MapPin, School, ShieldCheck, Star, Users } from 'lucide-react'
import { EcoleCard, Hero, HeroFeatures, ResultsHeader, SearchPanel } from '@/components/domain/ecole'
import { Pagination } from '@/components/ui/Feedback'
import { etablissementById, etablissements, regions, typesEcole } from '@/mocks/ecoles'
import { cn } from '@/lib/utils'

const tiles: Record<string, { icon: typeof GraduationCap; circle: string }> = {
  toutes: { icon: School, circle: '' },
  IPES: { icon: GraduationCap, circle: 'bg-[#e3ecff] text-brand-600' },
  CFP: { icon: Users, circle: 'bg-[#eee6ff] text-violet-600' },
  'Auto-école': { icon: Car, circle: 'bg-orange-500 text-white' },
  Autre: { icon: LayoutGrid, circle: 'bg-[#f1e6ff] text-violet-600' },
}

/** Les 4 cartes de la maquette en premier, puis le reste de l'annuaire. */
const vedettes = ['ipc', 'cfp-btp', 'langues']

export default function EcolesHub() {
  const [q, setQ] = useState('')
  const ordered = [...vedettes.map((id) => etablissementById(id)), ...etablissements.filter((e) => !vedettes.includes(e.id))]
  const list = ordered.filter((e) => e.nom.toLowerCase().includes(q.toLowerCase()))
  const autoEcole = {
    ...etablissementById('ipc'),
    id: 'conduite-sure',
    nom: 'Auto-École La Conduite Sûre',
    type: 'Auto-école' as const,
    note: 4.8,
    avis: 96,
    quartier: 'Centre',
    image: '/maquette/ecole-ae-conduite-sure.jpg',
    filieres: ['Permis A', 'Permis B', 'Permis C'],
  }
  const cards = q ? list : [list[0], list[1], autoEcole, list[2], ...list.slice(3)]
  return (
    <div className="mx-auto max-w-[1320px] space-y-5 px-5 py-4">
      <Hero
        icon={<GraduationCap />}
        iconBox={false}
        image="/maquette/ecoles-hero.jpg"
        title="Écoles & Centres de formation"
        subtitle="Trouvez l’établissement adapté à votre projet de formation et de carrière."
      >
        <HeroFeatures
          items={[
            { icon: <ShieldCheck className="fill-white text-navy-800" />, label: 'Établissements vérifiés' },
            { icon: <Star className="fill-white" />, label: 'Formations certifiantes' },
            { icon: <MapPin className="fill-white text-navy-800" />, label: 'Partout au Cameroun' },
          ]}
        />
      </Hero>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {typesEcole.map((t, i) => {
          const s = tiles[t.key]
          return (
            <Link
              key={t.key}
              to={t.to}
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
                <span className={cn('block text-[17px] font-bold whitespace-nowrap', i === 0 ? 'text-white' : 'text-navy-950')}>{t.label}</span>
                <span className={cn('text-[16px]', i === 0 ? 'text-white/90' : 'text-ink/80')}>({t.count.toLocaleString('fr-FR')})</span>
              </span>
            </Link>
          )
        })}
      </section>

      <SearchPanel
        title="Rechercher une école"
        fields={[
          { placeholder: 'Localisation', hint: 'Région, ville, quartier', options: regions.map((r) => r.nom), icon: <MapPin /> },
          { placeholder: 'Type d’école', hint: 'IPES, CFP, Auto-école, Autre', options: ['IPES', 'CFP', 'Auto-école', 'Autre'], icon: <GraduationCap /> },
        ]}
        onSearch={setQ}
      />

      <section className="space-y-4">
        <ResultsHeader title={`${q ? list.length : '1 248'} établissements trouvés`} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((e) => (
            <EcoleCard key={e.id} e={e} />
          ))}
        </div>
        <Pagination label="Affichage de 1 à 12 sur 1 248 établissements" pages={5} />
      </section>
    </div>
  )
}
