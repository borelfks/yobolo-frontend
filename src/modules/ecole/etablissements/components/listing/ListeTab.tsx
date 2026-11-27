import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Building2, GraduationCap, Layers, MapPin } from 'lucide-react'
import { EcoleCard, ResultsHeader, SearchPanel } from '@/modules/ecole/etablissements/components/EcoleBlocks'
import { useTypeLabels } from '@/modules/ecole/etablissements/components/listing/useTypeLabels'
import { filtrerEtablissements, TRIS, trierEtablissements, type Criteres, type Tri } from '@/modules/ecole/etablissements/schoolSearch'
import { Card } from '@/shared/ui/Card'
import { Pagination } from '@/shared/ui/Pagination'
import { useDiplomes, useDomaines, useEtablissements, useFormations, useRegions, useTypeEcole, useVilles } from '@/data/hooks'
import type { TypeSlug } from '@/shared/types'
import { pageDe } from '@/shared/utils/pages'

/** Établissements par page. */
const PAR_PAGE = 12

/**
 * Onglet principal : la liste des établissements du type. La recherche, le tri
 * et la page sont dans l'adresse (`?q=…&region=…&ville=…&filiere=…&niveau=…&tri=…&page=…`) :
 * les onglets Régions et Villes y renvoient avec leur critère.
 */
export function ListeTab({ type }: { type: TypeSlug }) {
  const { t } = useTranslation('schools')
  const labels = useTypeLabels(type)
  const cfg = useTypeEcole(type)
  const domaines = useDomaines(type)
  const diplomes = useDiplomes(type)
  const villes = useVilles()
  const regions = useRegions()
  const formations = useFormations()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const criteres: Criteres = { region: params.get('region') ?? '', ville: params.get('ville') ?? '', filiere: params.get('filiere') ?? '', niveau: params.get('niveau') ?? '' }
  const tri = (TRIS as readonly string[]).includes(params.get('tri') ?? '') ? (params.get('tri') as Tri) : 'pertinence'
  const recherche = Boolean(q || Object.values(criteres).some(Boolean))
  const tous = useEtablissements().filter((e) => e.type === cfg.type)
  const list = trierEtablissements(filtrerEtablissements(tous, q, criteres, formations), tri)
  const { pages, page, elements } = pageDe(list, Number(params.get('page') ?? 1), PAR_PAGE)
  const changer = (valeurs: Record<string, string>) =>
    setParams((p) => {
      const suivant = new URLSearchParams(p)
      for (const [k, v] of Object.entries(valeurs)) {
        if (v) suivant.set(k, v)
        else suivant.delete(k)
      }
      if (!('page' in valeurs)) suivant.delete('page')
      return suivant
    })
  return (
    <div className="space-y-5">
      <SearchPanel
        placeholder={t('listing.search.placeholderListe', { item: labels.searchItem })}
        fields={[
          { name: 'region', defaut: criteres.region, placeholder: t('listing.search.region'), options: regions.map((r) => r.nom), icon: <MapPin /> },
          { name: 'ville', defaut: criteres.ville, placeholder: t('listing.search.city'), options: villes.map((v) => v.nom), icon: <Building2 /> },
          { name: 'filiere', defaut: criteres.filiere, placeholder: t('listing.search.field'), options: domaines.map((d) => d.nom), icon: <GraduationCap /> },
          { name: 'niveau', defaut: criteres.niveau, placeholder: t('listing.search.level'), hint: t('listing.search.levelHint'), options: diplomes.map((d) => d.nom), icon: <Layers /> },
        ]}
        defautQ={q}
        onSearch={(texte, c) => changer({ q: texte, ...c })}
      />
      <ResultsHeader
        title={t('listing.found', { n: recherche ? list.length : cfg.count, pluriel: labels.pluriel })}
        tri={TRIS.indexOf(tri)}
        onTri={(i) => changer({ tri: TRIS[i] === 'pertinence' ? '' : TRIS[i]! })}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {elements.map((e) => (
          <EcoleCard key={e.id} e={e} />
        ))}
      </div>
      {list.length === 0 && <Card className="p-8 text-center text-sm text-muted">{t('listing.liste.empty', { q: q || Object.values(criteres).filter(Boolean).join(', ') })}</Card>}
      <Pagination
        label={t('listing.liste.pagination', { shown: elements.length, total: list.length })}
        pages={pages}
        page={page}
        onChange={(p) => changer({ page: p > 1 ? String(p) : '' })}
      />
    </div>
  )
}
