import { useTranslation } from 'react-i18next'
import { Toggle } from '@/shared/shadcn/toggle'
import type { PermisCode } from '@/shared/types'
import { Carte, TitreCarte } from '@/modules/ecole/etablissements/components/Bases'

export type TuilePermis = { code: PermisCode; nom: string; duree: string; ageMin: number }

/**
 * « Les permis » (planche « Auto-écoles ») : une tuile par permis proposé
 * (code, nom, durée et âge). Une tuile se coche comme le filtre « Permis » :
 * cochée, elle passe en vert. Cinq colonnes sur ordinateur ; sur téléphone,
 * une rangée qui défile de côté.
 */
export function TuilesPermis({ permis, coches, onBasculer }: { permis: TuilePermis[]; coches: string[]; onBasculer: (code: PermisCode) => void }) {
  const { t } = useTranslation('driving-schools')
  return (
    <Carte className="gap-3 p-4">
      <TitreCarte className="text-lg font-bold">{t('liste.permis')}</TitreCarte>
      <div className="flex gap-2 max-sm:-mx-4 max-sm:overflow-x-auto max-sm:px-4 max-sm:[scrollbar-width:none] sm:grid sm:grid-cols-5">
        {permis.map((p) => (
          <Toggle
            key={p.code}
            pressed={coches.includes(p.code)}
            onPressedChange={() => onBasculer(p.code)}
            className="relative h-auto min-w-[150px] flex-col items-start justify-start gap-1 rounded-md border border-border bg-card p-3.5 text-left whitespace-normal text-foreground hover:border-primary hover:bg-card data-[state=on]:border-success data-[state=on]:bg-success-wash data-[state=on]:text-foreground data-[state=on]:ring-1 data-[state=on]:ring-success data-[state=on]:ring-inset sm:min-w-0"
          >
            <span aria-hidden className="grid size-[30px] place-items-center rounded-md bg-primary-tint text-meta font-extrabold text-primary-strong">
              {p.code}
            </span>
            <b className="mt-1 text-sm">{p.nom}</b>
            <span className="text-xs font-normal text-muted-foreground">
              <span className="sr-only">{t('common.licence', { code: p.code })} · </span>
              {t('liste.dureeAge', { duree: p.duree, age: p.ageMin })}
            </span>
          </Toggle>
        ))}
      </div>
    </Carte>
  )
}
