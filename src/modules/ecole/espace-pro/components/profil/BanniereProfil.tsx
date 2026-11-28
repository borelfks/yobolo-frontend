import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import type { Etablissement } from '@/shared/types'

/** Le haut de l'en-tête du profil : la bannière (« Changer la bannière »), le logo, le nom, la note et « Établissement vérifié ». */
export function BanniereProfil({ ecole }: { ecole: Etablissement }) {
  const { t } = useTranslation('pro')
  return (
    <>
      <div className="relative">
        <img src={ecole.bandeau ?? ecole.couverture ?? ecole.image} alt={t('profil.banniere.alt')} className="block h-[120px] w-full bg-border object-cover lg:h-40" />
        <Button asChild variant="outline" size="sm" className="absolute top-3 right-3 h-[34px] bg-card/95 px-3 text-meta">
          <Lien to={ROUTES.pro.profile('medias')}>{t('profil.banniere.changer')}</Lien>
        </Button>
      </div>
      <div className="-mt-9 flex flex-wrap items-end gap-3.5 px-5">
        <img src={ecole.logo ?? ecole.vignette ?? ecole.image} alt={t('profil.banniere.logoAlt')} className="size-[88px] shrink-0 rounded-xl border-[3px] border-card bg-card object-cover shadow-thumb" />
        <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-[3px] pb-0.5">
          <b className="text-lg leading-snug text-foreground">{ecole.nom}</b>
          <span className="text-meta text-muted-foreground">{t('profil.banniere.devise')}</span>
          <span className="flex flex-wrap items-center gap-2 text-meta">
            <b>{ecole.avis > 0 ? t('profil.banniere.note', { note: num(ecole.note), count: ecole.avis }) : t('commun.pasDAvis')}</b>
            <Badge variant="green">{t('commun.verifie')}</Badge>
          </span>
        </div>
      </div>
    </>
  )
}
