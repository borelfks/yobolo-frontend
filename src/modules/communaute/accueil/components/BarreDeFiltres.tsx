import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Search } from 'lucide-react'
import { FILTRES_DU_FIL, type FiltreDuFil } from '@/modules/communaute/accueil/accueilFil'
import { Carte } from '@/modules/communaute/accueil/components/Carte'
import { ListeDeChoix } from '@/modules/communaute/accueil/components/ListeDeChoix'
import { useEcranLarge } from '@/modules/communaute/accueil/hooks/useEcranLarge'
import { useFiltresDuFil } from '@/modules/communaute/accueil/hooks/useFiltresDuFil'
import { useMoi } from '@/modules/communaute/accueil/hooks/useMoi'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Popover, PopoverAnchor, PopoverContent } from '@/shared/shadcn/popover'
import { Toggle } from '@/shared/shadcn/toggle'

/** La pilule du canevas (32 px, bordure gris-bleu, 14 px) ; verte quand elle est choisie ou ouverte. */
const PILULE = 'h-8 shrink-0 border-input px-3 text-sm'

/**
 * La barre du fil (canevas) : sur ordinateur, la recherche dans les
 * publications ; puis les pilules « Domaines », « Sujets », « Experts » (qui
 * ouvrent leur liste de choix : une bulle sur ordinateur, tout l'écran sur
 * téléphone), « Enregistrées (N) » et « Tout effacer ».
 */
export function BarreDeFiltres({ ouvert, onOuvrir, total }: { ouvert: FiltreDuFil | null; onOuvrir: (filtre: FiltreDuFil | null) => void; total: number }) {
  const { t } = useTranslation('accueil')
  const large = useEcranLarge()
  const moi = useMoi()
  const { filtres, changer, actifs, toutEffacer } = useFiltresDuFil()

  return (
    <Carte className="relative border-t-0 py-2.5 lg:border-t lg:p-3">
      {large && (
        <label className="mb-3 flex h-9 items-center gap-2 rounded-sm bg-surface-search px-3 text-muted-foreground focus-within:outline-2 focus-within:outline-ring">
          <Search className="size-4 shrink-0" strokeWidth={2.2} aria-hidden />
          <Input
            type="search"
            value={filtres.recherche}
            onChange={(e) => changer({ recherche: e.target.value })}
            aria-label={t('recherche.libelle')}
            placeholder={t('recherche.placeholder')}
            className="h-auto border-0 bg-transparent px-0 text-sm focus-visible:outline-none"
          />
        </label>
      )}
      <div className="flex items-center gap-2 overflow-x-auto px-3 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:px-0">
        {FILTRES_DU_FIL.map((f) => {
          const nombre = filtres[f].length
          const pilule = (
            <Toggle
              variant="outline"
              data-pilule={f}
              className={PILULE}
              pressed={nombre > 0 || ouvert === f}
              onPressedChange={() => onOuvrir(ouvert === f ? null : f)}
              aria-expanded={ouvert === f}
              aria-haspopup="dialog"
            >
              {nombre > 0 ? `${t(`filtres.${f}.titre`)} · ${nombre}` : t(`filtres.${f}.titre`)}
              <ChevronDown strokeWidth={2.2} aria-hidden />
            </Toggle>
          )
          if (!large) return <Fragment key={f}>{pilule}</Fragment>
          return (
            <Popover key={f} open={ouvert === f} onOpenChange={(o) => !o && onOuvrir(null)}>
              <PopoverAnchor asChild>{pilule}</PopoverAnchor>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[360px] max-w-[calc(100vw-2rem)] p-0 shadow-dialog"
                // Un clic sur la pilule elle-même la referme (elle bascule seule).
                onInteractOutside={(e) => (e.target as Element | null)?.closest?.(`[data-pilule="${f}"]`) && e.preventDefault()}
              >
                <ListeDeChoix filtre={f} total={total} onFermer={() => onOuvrir(null)} />
              </PopoverContent>
            </Popover>
          )
        })}
        <Toggle variant="outline" className={PILULE} pressed={filtres.enregistrees} onPressedChange={(v) => changer({ enregistrees: v })}>
          {t('filtres.enregistrees', { count: moi?.nbEnregistrees ?? 0 })}
        </Toggle>
        {actifs && (
          <Button variant="link" className="shrink-0 px-1.5" onClick={toutEffacer}>
            {t('filtres.toutEffacer')}
          </Button>
        )}
      </div>
    </Carte>
  )
}
