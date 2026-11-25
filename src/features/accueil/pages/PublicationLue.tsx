import { Navigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Megaphone } from 'lucide-react'
import { usePublications } from '@/data/hooks'
import { titreEtExtrait } from '@/features/accueil/accueilFil'
import { ArticlePublication } from '@/features/accueil/components/article/ArticlePublication'
import { EtatVide } from '@/features/accueil/components/EtatVide'
import { useSession } from '@/features/auth/hooks/useSession'
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Une publication seule (PublicationPage de yibolo-client) : l'adresse qu'on
 * partage, et la seule ouverture qui compte une vue. Elle se lit comme un
 * article de presse. Une publication retirée ou inconnue : « n'est pas
 * accessible », sans distinguer les deux cas.
 */
export function PublicationLue() {
  const { t } = useTranslation('accueil')
  const { id = '' } = useParams()
  const { account } = useSession()
  const publication = usePublications().find((p) => p.id === id && p.statut === 'publiee')

  if (!account) return <Navigate to={ROUTES.signIn} replace />

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-5 pt-6 pb-10">
      <Breadcrumb
        items={[{ label: t('article.fil'), to: ROUTES.accueil }, { label: publication ? titreEtExtrait(publication).titre : t('introuvable.titre') }]}
        className="-mt-1 flex-nowrap [&>span]:whitespace-nowrap [&>span:last-child]:min-w-0 [&>span:last-child>span]:truncate [&>span:not(:last-child)]:shrink-0"
      />
      {publication ? (
        <ArticlePublication publication={publication} />
      ) : (
        <>
          <h1 className="sr-only">{t('article.titrePage')}</h1>
          <Card>
            <EtatVide
              icone={<Megaphone className="size-6" aria-hidden="true" />}
              titre={t('introuvable.titre')}
              description={t('introuvable.detail')}
              action={
              <Button to={ROUTES.accueil} variant="outline" size="sm">
                {t('introuvable.action')}
              </Button>
            }
          />
          </Card>
        </>
      )}
    </div>
  )
}
