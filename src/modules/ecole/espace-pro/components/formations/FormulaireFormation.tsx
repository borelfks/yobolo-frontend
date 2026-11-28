import { useTranslation } from 'react-i18next'
import { Progress } from '@/shared/shadcn/progress'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shared/shadcn/select'
import { cn } from '@/shared/utils/cn'
import { CartePro } from '@/modules/ecole/espace-pro/components/BlocsPro'

export type Choix = { value: string; label: string }
export type GroupeChoix = { titre?: string; choix: Choix[] }

/**
 * Une liste de la nomenclature (diplôme, secteur, domaine, spécialité, option,
 * niveau) : le texte choisi s'affiche en entier (deux lignes au plus) ; les
 * spécialités sont regroupées par filière. Sans choix possible : grisée.
 */
export function ChoixNomenclature({ id, valeur, onChange, groupes, vide, invalide }: { id: string; valeur: string; onChange: (v: string) => void; groupes: GroupeChoix[]; vide: string; invalide?: boolean }) {
  const aucun = groupes.every((g) => g.choix.length === 0)
  return (
    <Select value={valeur || undefined} onValueChange={onChange} disabled={aucun}>
      <SelectTrigger id={id} aria-invalid={invalide || undefined} aria-describedby={invalide ? `${id}-erreur` : undefined} className="h-auto min-h-11 py-2 text-left leading-snug whitespace-normal *:data-[slot=select-value]:line-clamp-2 *:data-[slot=select-value]:block">
        <SelectValue placeholder={vide} />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-[300px]">
        {groupes.map((g, k) =>
          g.titre ? (
            <SelectGroup key={g.titre}>
              <SelectLabel className="pt-2 text-xs font-extrabold tracking-[0.02em] uppercase">{g.titre}</SelectLabel>
              {g.choix.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : (
            g.choix.map((c) => (
              <SelectItem key={`${k}-${c.value}`} value={c.value}>
                {c.label}
              </SelectItem>
            ))
          ),
        )}
      </SelectContent>
    </Select>
  )
}

export type EtapeCreation = { nom: string; faite: boolean }

/** « Progression de création » : pourcentage, barre et les trois blocs du formulaire. */
export function ProgressionCreation({ etapes }: { etapes: EtapeCreation[] }) {
  const { t } = useTranslation('pro', { keyPrefix: 'creer.progression' })
  const pct = Math.round((etapes.filter((e) => e.faite).length / etapes.length) * 100)
  return (
    <CartePro titre={t('titre')} serree action={<b className="text-success">{t('pourcent', { pct })}</b>}>
      <Progress value={pct} aria-label={t('titre')} className="bg-success-soft" />
      <ol className="flex flex-col gap-2.5">
        {etapes.map((e, i) => (
          <li key={e.nom} className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
            <span className={cn('grid size-6 shrink-0 place-items-center rounded-full text-xs font-extrabold', e.faite ? 'bg-success text-white' : 'border-2 border-border-strong text-muted-foreground')} aria-hidden>
              {e.faite ? '✓' : i + 1}
            </span>
            {e.nom}
            <span className="sr-only">{e.faite ? t('faite') : t('aFaire')}</span>
          </li>
        ))}
      </ol>
    </CartePro>
  )
}

/** L'aperçu de la fiche formation (colonne de droite et fenêtre « Aperçu »). */
export function ApercuFiche({ nom, etablissement, lignes, className }: { nom: string; etablissement: string; lignes: [string, string][]; className?: string }) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-lg border border-border', className)}>
      <div className="h-[90px] bg-[linear-gradient(135deg,var(--color-primary-tint),var(--color-background))]" />
      <div className="flex flex-col gap-1.5 px-3.5 py-3">
        <b className="text-ui text-foreground">{nom}</b>
        <span className="text-xs font-medium text-muted-foreground">{etablissement}</span>
        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-meta">
          {lignes.map(([dt, dd]) => (
            <div key={dt} className="contents">
              <dt className="text-muted-foreground">{dt}</dt>
              <dd className="font-semibold text-foreground">{dd}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

/** Le numéro d'un bloc du formulaire (rond bleu de 26 px) devant son titre. */
export function TitreNumerote({ n, children }: { n: number; children: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-primary text-meta font-extrabold text-primary-foreground" aria-hidden>
        {n}
      </span>
      {children}
    </span>
  )
}
