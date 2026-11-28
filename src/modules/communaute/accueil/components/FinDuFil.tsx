import { useTranslation } from 'react-i18next'
import { TRIS_DU_FIL } from '@/modules/communaute/accueil/accueilFil'
import { useFiltresDuFil } from '@/modules/communaute/accueil/hooks/useFiltresDuFil'
import { Button } from '@/shared/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/shared/shadcn/dropdown-menu'

/** « Trier par : Plus récentes ▾ » sous la barre du fil, après un filet (canevas). */
export function LigneDeTri() {
  const { t } = useTranslation('accueil')
  const { filtres, changer } = useFiltresDuFil()
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-muted-foreground lg:px-0.5 lg:py-0">
      <span className="h-px flex-1 bg-border-strong" aria-hidden />
      <span>{t('tri.libelle')}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="text-xs text-foreground">
            {t(`tri.${filtres.tri}`)} ▾
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup value={filtres.tri} onValueChange={(v) => changer({ tri: TRIS_DU_FIL.find((x) => x === v) ?? 'recentes' })}>
            {TRIS_DU_FIL.map((tri) => (
              <DropdownMenuRadioItem key={tri} value={tri}>
                {t(`tri.${tri}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/** « 5 sur 15 publications » et « Afficher plus de publications », sous le fil. */
export function SuiteDuFil({ affichees, total, onPlus }: { affichees: number; total: number; onPlus: () => void }) {
  const { t } = useTranslation('accueil')
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <span className="text-xs text-muted-foreground">{t('fil.affichees', { affichees, count: total })}</span>
      <Button variant="secondary" size="sm" onClick={onPlus}>
        {t('fil.plus')}
      </Button>
    </div>
  )
}
