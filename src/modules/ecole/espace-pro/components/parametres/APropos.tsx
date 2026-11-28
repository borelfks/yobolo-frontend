import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'
import { CartePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { formaterDate } from '@/shared/utils/dates'

const VALEURS = ['professionnalisme', 'fiabilite', 'inclusion', 'innovation'] as const
const DOCUMENTS = ['cgu', 'cgv', 'confidentialite'] as const
/** La version de l'application et sa date (configuration, pas une donnée). */
const VERSION = { numero: '2.4.0', date: new Date(2026, 10, 5) } as const

/** 7.7 À propos : YIBOLO, sa mission et ses valeurs, l'assistance, les documents utiles, la version. */
export function APropos() {
  const { t } = useTranslation('pro', { keyPrefix: 'parametres.aPropos' })
  return (
    <>
      <CartePro>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-titre-md font-extrabold tracking-[0.02em] text-primary">YIBOLO</h2>
          <p className="text-ui text-foreground-soft">{t('accroche')}</p>
          <p className="text-meta font-bold text-muted-foreground">{t('piliers')}</p>
        </div>
        <div className="grid gap-3.5 lg:grid-cols-2">
          <div className="flex flex-col gap-1.5 rounded-md bg-muted p-3.5">
            <b className="text-ui text-foreground">{t('mission')}</b>
            <p className="text-sm text-foreground-soft">{t('missionTexte')}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-md bg-muted p-3.5">
            <b className="text-ui text-foreground">{t('valeurs')}</b>
            <span className="flex flex-wrap gap-1.5">
              {VALEURS.map((v) => (
                <Badge key={v} variant="blue">
                  {t(`listeValeurs.${v}`)}
                </Badge>
              ))}
            </span>
          </div>
        </div>
      </CartePro>
      <div className="grid gap-2 lg:grid-cols-2">
        <CartePro titre={t('assistance')}>
          <Button asChild>
            <Lien to={ROUTES.help}>{t('contacter')}</Lien>
          </Button>
          <Button asChild variant="secondary">
            <Lien to={ROUTES.help}>{t('centreAide')}</Lien>
          </Button>
        </CartePro>
        <CartePro titre={t('documents')}>
          {DOCUMENTS.map((d) => (
            <Lien key={d} to={ROUTES.terms} className="text-sm font-bold text-primary no-underline hover:underline">
              {t(`listeDocuments.${d}`)}
            </Lien>
          ))}
        </CartePro>
      </div>
      <section className="flex flex-wrap items-center justify-between gap-2 border-y border-border bg-card px-5 py-4 lg:rounded-lg lg:border">
        <span className="flex items-center gap-2 text-sm text-foreground">
          {t('version')} <b>{VERSION.numero}</b> <Badge variant="green">{t('aJour')}</Badge>
        </span>
        <span className="text-xs font-medium text-muted-foreground">{t('miseAJour', { date: formaterDate(VERSION.date, 'abregee') })}</span>
      </section>
    </>
  )
}
