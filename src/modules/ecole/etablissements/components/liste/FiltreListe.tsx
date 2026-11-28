import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import { Checkbox } from '@/shared/shadcn/checkbox'
import { Input } from '@/shared/shadcn/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/shadcn/popover'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/shared/shadcn/sheet'
import { Toggle } from '@/shared/shadcn/toggle'
import { toggleVariants } from '@/shared/shadcn/variants'
import { cn } from '@/shared/utils/cn'
import { useEstTelephone } from '@/modules/ecole/etablissements/hooks/useEstTelephone'

export type OptionFiltre = { valeur: string; libelle: string; nombre: number }

type Props = {
  /** Le nom du filtre (« Ville », « Diplôme »…). */
  titre: string
  options: OptionFiltre[]
  coches: string[]
  onChange: (coches: string[]) => void
  /** Texte d'aide du champ de recherche dans les options ; absent : pas de recherche. */
  recherche?: string
  /** « 4 établissements » : le bouton « Afficher … » du bas. */
  resultats: string
}

/** Classes de la pilule d'un filtre (bordée, verte quand elle a des valeurs cochées ou qu'elle est ouverte). */
const pilule = 'flex-none border-input px-3 font-semibold text-foreground-soft hover:border-foreground-soft hover:bg-accent hover:text-foreground-soft'
const piluleActive = 'border-success bg-success text-white hover:border-success hover:bg-success hover:text-white'

/**
 * Un filtre des listes : une pilule « Ville ▾ » (« Ville · 2 » quand des
 * valeurs sont cochées) qui ouvre ses options à cocher, avec leur nombre de
 * résultats. Sur ordinateur, une bulle sous la pilule ; sur téléphone, un
 * panneau plein écran (planches « filtre ouvert »). Les choix s'appliquent
 * tout de suite ; « Afficher … » ferme.
 */
export function FiltreListe({ titre, options, coches, onChange, recherche, resultats }: Props) {
  const { t } = useTranslation('schools')
  const telephone = useEstTelephone()
  const [ouvert, setOuvert] = useState(false)
  const [q, setQ] = useState('')
  const ouvrir = (o: boolean) => {
    setOuvert(o)
    if (!o) setQ('')
  }
  const visibles = options.filter((o) => !q.trim() || o.libelle.toLowerCase().includes(q.trim().toLowerCase()))
  const declencheur = (
    <Button variant="outline" size="sm" className={cn(pilule, (coches.length > 0 || ouvert) && piluleActive)}>
      {coches.length ? t('ui.filtre.nombre', { titre, n: coches.length }) : titre}
      <ChevronDown aria-hidden />
    </Button>
  )
  const champ = recherche && <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label={recherche} placeholder={recherche} className="h-9 text-sm" />
  const liste = (
    <ListeOptions options={visibles} coches={coches} onChange={onChange} grand={telephone}>
      {visibles.length === 0 && <p className="px-2 py-3 text-sm text-muted-foreground">{t('ui.filtre.aucuneOption', { q })}</p>}
    </ListeOptions>
  )

  if (telephone)
    return (
      <Sheet open={ouvert} onOpenChange={ouvrir}>
        <SheetTrigger asChild>{declencheur}</SheetTrigger>
        <SheetContent side="bottom" showCloseButton={false} aria-describedby={undefined} className="inset-0 h-dvh gap-0">
          <div className="flex h-[52px] items-center gap-2 border-b border-border px-2">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label={t('ui.filtre.fermer')} className="text-foreground">
                <X className="size-6" aria-hidden />
              </Button>
            </SheetClose>
            <SheetTitle className="flex-1 text-base font-bold">{titre}</SheetTitle>
            <Button variant="link" className="px-2.5" onClick={() => onChange([])}>
              {t('ui.filtre.effacer')}
            </Button>
          </div>
          {champ && <div className="px-4 py-3 [&_input]:h-10">{champ}</div>}
          <div className="flex-1 overflow-y-auto px-2 py-1">{liste}</div>
          <div className="sticky bottom-0 border-t border-border bg-card px-4 py-3">
            <SheetClose asChild>
              <Button size="lg" className="w-full text-base">
                {t('ui.filtre.afficher', { resultats })}
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    )

  return (
    <Popover open={ouvert} onOpenChange={ouvrir}>
      <PopoverTrigger asChild>{declencheur}</PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="flex w-[360px] max-w-[calc(100vw-2rem)] flex-col p-0 shadow-dialog">
        <div className="flex flex-col gap-2.5 border-b border-border px-4 pt-3.5 pb-2.5">
          <b className="text-base text-foreground">{titre}</b>
          {champ}
        </div>
        <div className="max-h-80 overflow-y-auto px-2 py-1.5">{liste}</div>
        <div className="flex justify-end gap-2 border-t border-border px-4 py-2.5">
          <Button variant="link-muted" className="px-2.5" onClick={() => onChange([])}>
            {t('ui.filtre.effacer')}
          </Button>
          <Button size="sm" onClick={() => ouvrir(false)}>
            {t('ui.filtre.afficher', { resultats })}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** Les options à cocher d'un filtre ; une option sans résultat est grisée. */
function ListeOptions({ options, coches, onChange, grand, children }: { options: OptionFiltre[]; coches: string[]; onChange: (c: string[]) => void; grand: boolean; children?: ReactNode }) {
  return (
    <div className="flex flex-col">
      {options.map((o) => {
        const coche = coches.includes(o.valeur)
        return (
          <label key={o.valeur} className={cn('flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 hover:bg-accent', grand ? 'min-h-12 text-ui' : 'min-h-10 text-sm', o.nombre ? 'text-foreground' : 'text-input')}>
            <Checkbox
              checked={coche}
              onCheckedChange={() => onChange(coche ? coches.filter((v) => v !== o.valeur) : [...coches, o.valeur])}
              className="size-5 border-2 border-subtle-foreground data-[state=checked]:border-success data-[state=checked]:bg-success"
            />
            <span className="flex-1">{o.libelle}</span>
            <span className={cn('text-subtle-foreground', grand ? 'text-meta' : 'text-xs')}>{o.nombre}</span>
          </label>
        )
      })}
      {children}
    </div>
  )
}

/** Un filtre oui / non (« Établissement vérifié ») : une pilule qui se coche. */
export function FiltreBascule({ libelle, actif, onChange }: { libelle: string; actif: boolean; onChange: (actif: boolean) => void }) {
  return (
    <Toggle variant="outline" pressed={actif} onPressedChange={onChange} className={cn(toggleVariants({ variant: 'outline' }), 'flex-none border-input px-3 text-sm hover:border-foreground-soft data-[state=on]:hover:bg-success')}>
      {libelle}
    </Toggle>
  )
}
