import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Car, GraduationCap, LayoutGrid, MapPin, School, ShieldCheck, Star, Users } from 'lucide-react'
import { EcoleCard, ResultsHeader, SearchPanel } from '@/modules/ecole/etablissements/components/EcoleBlocks'
import { Hero, HeroFeatures } from '@/shared/ui/Hero'
import { Pagination } from '@/shared/ui/Pagination'
import { useAutoEcoles, useEtablissements, useFormations, useRegions, useTuilesAnnuaire } from '@/data/hooks'
import { filtrerEtablissements, TRIS, trierEtablissements, type Criteres, type Tri } from '@/modules/ecole/etablissements/schoolSearch'
import { Card } from '@/shared/ui/Card'
import { pageDe } from '@/shared/utils/pages'
import type { Etablissement } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { schoolTypeKey } from '@/modules/ecole/etablissements/schoolLinks'

const tiles: Record<string, { icon: typeof GraduationCap; circle: string; labelKey: 'all' | 'ipes' | 'cfp' | 'autoEcoles' | 'autres'; to: string }> = {
  toutes: { icon: School, circle: '', labelKey: 'all', to: ROUTES.schools },
  IPES: { icon: GraduationCap, circle: 'bg-[#e3ecff] text-brand-600', labelKey: 'ipes', to: ROUTES.schoolType('ipes') },
  CFP: { icon: Users, circle: 'bg-[#eee6ff] text-violet-600', labelKey: 'cfp', to: ROUTES.schoolType('cfp') },
  'Auto-école': { icon: Car, circle: 'bg-orange-500 text-white', labelKey: 'autoEcoles', to: ROUTES.drivingSchools },
  Autre: { icon: LayoutGrid, circle: 'bg-[#f1e6ff] text-violet-600', labelKey: 'autres', to: ROUTES.schoolType('autres') },
}

/** Valeurs du filtre « Type d’école » (libellés traduits à l'affichage). */
const typeOptions = ['IPES', 'CFP', 'Auto-école', 'Autre'] as const
/** Cartes par page. */
const PAR_PAGE = 12

export function EcolesHub() {
  const { t } = useTranslation('schools')
  const [q, setQ] = useState('')
  const etablissements = useEtablissements()
  const autoEcoles = useAutoEcoles()
  const tuiles = useTuilesAnnuaire()
  const regions = useRegions()
  const formations = useFormations()
  const [criteres, setCriteres] = useState<Criteres>({})
  const [tri, setTri] = useState<Tri>('pertinence')
  const [page, setPage] = useState(1)
  const recherche = Boolean(q || Object.values(criteres).some(Boolean))
  const list = trierEtablissements(filtrerEtablissements(etablissements, q, criteres, formations), tri)
  // Les cartes mises en avant (champ « vedette » de la base), établissements et
  // auto-écoles mêlés, dans leur ordre ; puis le reste de l'annuaire.
  const autoEcolesVedettes: Etablissement[] = autoEcoles
    .filter((a) => a.vedette !== undefined)
    .map((a) => ({
      id: a.id,
      nom: a.nom,
      sigle: '',
      type: 'Auto-école',
      region: a.region,
      ville: a.ville,
      quartier: a.quartier,
      note: a.note,
      avis: a.avis,
      image: a.image,
      filieres: a.permis.map((c) => `Permis ${c}`),
      formations: a.permis.length,
      description: '',
      telephone: a.telephone,
      email: a.email,
      rentree: '',
      vedette: a.vedette,
    }))
  const vedettes = [...etablissements.filter((e) => e.vedette !== undefined), ...autoEcolesVedettes].sort((a, b) => a.vedette! - b.vedette!)
  // Sans recherche ni tri : les cartes mises en avant d'abord ; sinon, les résultats (les auto-écoles mises en avant suivent le critère « type »).
  const cards =
    !recherche && tri === 'pertinence'
      ? [...vedettes, ...etablissements.filter((e) => e.vedette === undefined)]
      : criteres.type === 'Auto-école'
        ? autoEcolesVedettes.filter((a) => (!criteres.region || a.region === criteres.region) && (!q || a.nom.toLowerCase().includes(q.toLowerCase())))
        : list
  const { pages, page: courante, elements } = pageDe(cards, page, PAR_PAGE)
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

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {tuiles.map((tile, i) => {
          const s = tiles[tile.id]!
          return (
            <Link
              key={tile.id}
              to={s.to}
              className={cn(
                'flex min-h-[68px] items-center gap-3.5 rounded-2xl px-4 py-2 shadow-[0_2px_10px_rgba(15,29,61,0.07)] transition-all hover:-translate-y-0.5',
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
              <span className="min-w-0 leading-tight">
                <span className={cn('block text-[17px] font-bold', i === 0 ? 'text-white' : 'text-navy-950')}>{t(`hub.tiles.${s.labelKey}`)}</span>
                <span className={cn('text-[16px]', i === 0 ? 'text-white/90' : 'text-ink/80')}>({num(tile.count)})</span>
              </span>
            </Link>
          )
        })}
      </section>

      <SearchPanel
        title={t('hub.search.title')}
        fields={[
          { name: 'region', placeholder: t('hub.search.location'), hint: t('hub.search.locationHint'), options: regions.map((r) => r.nom), icon: <MapPin /> },
          { name: 'type', placeholder: t('hub.search.type'), hint: t('hub.search.typeHint'), options: typeOptions.map((o) => t(`schoolTypes.${schoolTypeKey[o]}`)), icon: <GraduationCap /> },
        ]}
        onSearch={(texte, c) => {
          // Le type est choisi par son libellé traduit : on retrouve sa valeur.
          const type = typeOptions.find((o) => t(`schoolTypes.${schoolTypeKey[o]}`) === c.type) ?? ''
          setQ(texte)
          setCriteres({ region: c.region, type })
          setPage(1)
        }}
      />

      <section className="space-y-4">
        <ResultsHeader title={t('hub.found', { n: num(recherche ? cards.length : (tuiles.find((x) => x.id === 'toutes')?.count ?? cards.length)) })} tri={TRIS.indexOf(tri)} onTri={(i) => (setTri(TRIS[i]!), setPage(1))} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {elements.map((e) => (
            <EcoleCard key={e.id} e={e} />
          ))}
        </div>
        {cards.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground">{t('hub.empty')}</Card>}
        <Pagination label={t('hub.paginationDynamic', { from: cards.length ? (courante - 1) * PAR_PAGE + 1 : 0, to: (courante - 1) * PAR_PAGE + elements.length, total: cards.length })} pages={pages} page={courante} onChange={setPage} />
      </section>
    </div>
  )
}
