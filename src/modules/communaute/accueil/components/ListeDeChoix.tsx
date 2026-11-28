import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useDomainesExpertise, useExperts, useSujetsPublication } from '@/data/hooks'
import { basculerDans, type FiltreDuFil } from '@/modules/communaute/accueil/accueilFil'
import { usePublicationsDuFil } from '@/modules/communaute/accueil/hooks/useFilDAccueil'
import { useFiltresDuFil, type FiltresDuFil } from '@/modules/communaute/accueil/hooks/useFiltresDuFil'
import { Button } from '@/shared/shadcn/button'
import { Checkbox } from '@/shared/shadcn/checkbox'
import { Input } from '@/shared/shadcn/input'
import { cn } from '@/shared/utils/cn'

/** La clé des filtres qui garde les choix de chaque liste. */
const CLE: Record<FiltreDuFil, keyof Pick<FiltresDuFil, 'domaines' | 'sujets' | 'experts'>> = { domaines: 'domaines', sujets: 'sujets', experts: 'experts' }

/** Les choix d'une liste (domaines, sujets ou experts), chacun avec son nombre de publications, les plus fournis d'abord. */
function useOptions(filtre: FiltreDuFil, recherche: string) {
  const domaines = useDomainesExpertise()
  const sujets = useSujetsPublication()
  const experts = useExperts()
  const { publications } = usePublicationsDuFil()
  const elements = { domaines, sujets, experts }[filtre]
  const nombre = (id: string) =>
    publications.filter((p) => (filtre === 'experts' ? p.auteurId === id : filtre === 'domaines' ? p.domaines.includes(id) : p.sujets.includes(id))).length
  const q = recherche.trim().toLocaleLowerCase()
  return elements
    .map((e) => ({ id: e.id, nom: e.nom, nb: nombre(e.id) }))
    .filter((o) => !q || o.nom.toLocaleLowerCase().includes(q))
    .sort((a, b) => b.nb - a.nb || a.nom.localeCompare(b.nom))
}

/**
 * Une liste de choix du fil (canevas : « Accueil : filtre Domaines ouvert ») :
 * titre, recherche dans la liste, cases à cocher avec le nombre de publications,
 * « Effacer » et « Afficher N résultats ». `pleinEcran` : la version téléphone,
 * qui prend la place du fil (fermer en haut, bouton collé en bas).
 */
export function ListeDeChoix({ filtre, total, onFermer, pleinEcran = false }: { filtre: FiltreDuFil; total: number; onFermer: () => void; pleinEcran?: boolean }) {
  const { t } = useTranslation('accueil')
  const [recherche, setRecherche] = useState('')
  const { filtres, changer } = useFiltresDuFil()
  const cle = CLE[filtre]
  const choisis = filtres[cle]
  const options = useOptions(filtre, recherche)
  const effacer = () => {
    changer({ [cle]: [] })
    setRecherche('')
  }
  const titre = t(`filtres.${filtre}.titre`)

  const champ = (
    <Input
      type="search"
      value={recherche}
      onChange={(e) => setRecherche(e.target.value)}
      aria-label={t(`filtres.${filtre}.chercher`)}
      placeholder={t(`filtres.${filtre}.chercher`)}
      className={cn('text-sm', pleinEcran ? 'h-10' : 'h-9')}
    />
  )
  const liste = (
    <div className={cn(pleinEcran ? 'flex-1 px-2' : 'max-h-80 overflow-auto px-2 py-1.5')}>
      {options.map((o) => (
        <label
          key={o.id}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm text-foreground hover:bg-accent',
            pleinEcran ? 'min-h-12' : 'min-h-10',
            o.nb === 0 && 'text-input',
          )}
        >
          <Checkbox
            checked={choisis.includes(o.id)}
            onCheckedChange={() => changer({ [cle]: basculerDans(choisis, o.id) })}
            className="size-5 rounded-xs border-2 border-subtle-foreground data-[state=checked]:border-success data-[state=checked]:bg-success"
          />
          <span className={cn('flex-1', pleinEcran && 'text-ui')}>{o.nom}</span>
          <span className={cn('text-subtle-foreground', pleinEcran ? 'text-meta' : 'text-xs')}>{o.nb}</span>
        </label>
      ))}
      {options.length === 0 && <p className="px-2 py-3 text-sm text-muted-foreground">{t('filtres.aucunResultat', { recherche })}</p>}
    </div>
  )
  const afficher = t('filtres.afficher', { count: total })

  if (pleinEcran)
    return (
      <section role="dialog" aria-label={titre} className="flex min-h-[760px] flex-col bg-card">
        <div className="flex h-[52px] items-center gap-2 border-b border-border px-2">
          <Button variant="ghost" size="icon" onClick={onFermer} aria-label={t('filtres.fermer')} className="text-foreground">
            <X className="size-6" aria-hidden />
          </Button>
          <b className="flex-1 text-base">{titre}</b>
          <Button variant="link" className="px-2.5" onClick={effacer}>
            {t('filtres.effacer')}
          </Button>
        </div>
        <div className="px-4 py-3">{champ}</div>
        {liste}
        <div className="sticky bottom-0 border-t border-border bg-card px-4 py-3">
          <Button size="lg" className="w-full text-base" onClick={onFermer}>
            {afficher}
          </Button>
        </div>
      </section>
    )

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2.5 border-b border-border px-4 pt-3.5 pb-2.5">
        <b className="text-base">{titre}</b>
        {champ}
      </div>
      {liste}
      <div className="flex justify-end gap-2 border-t border-border px-4 py-2.5">
        <Button variant="link-muted" className="px-2.5 font-bold" onClick={effacer}>
          {t('filtres.effacer')}
        </Button>
        <Button size="md" onClick={onFermer}>
          {afficher}
        </Button>
      </div>
    </div>
  )
}
