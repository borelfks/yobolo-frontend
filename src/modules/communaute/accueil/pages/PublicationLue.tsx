import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from '@tanstack/react-router'
import { Megaphone } from 'lucide-react'
import { CarteAuteur } from '@/modules/communaute/accueil/components/ColonneDroite'
import { AutresPublications, DetailPublication, RetourAuFil } from '@/modules/communaute/accueil/components/DetailPublication'
import { GrilleAccueil, SqueletteAccueil } from '@/modules/communaute/accueil/components/GrilleAccueil'
import { useAuteurs } from '@/modules/communaute/accueil/hooks/useAuteur'
import { usePublicationsDuFil } from '@/modules/communaute/accueil/hooks/useFilDAccueil'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { EmptyState } from '@/shared/blocs/Etats'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'

/**
 * Une publication ouverte (canevas : « Détail d'une publication »), à son
 * adresse (`/accueil/publications/:id`, celle qu'on partage) : les colonnes de
 * l'accueil, l'auteur en tête de celle de droite. Une publication retirée ou
 * inconnue : « n'est pas accessible ».
 */
export function PublicationLue() {
  const { account } = useSession()
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  return (
    <ChargementDonnees fallback={<SqueletteAccueil />}>
      <PublicationOuverte />
    </ChargementDonnees>
  )
}

function PublicationOuverte() {
  const { t } = useTranslation('accueil')
  const { id = '' } = useParams({ strict: false })
  const publication = usePublicationsDuFil().publications.find((p) => p.id === id)
  const auteurDe = useAuteurs()
  const auteur = publication ? auteurDe(publication.auteurId) : undefined

  return (
    <GrilleAccueil enTeteDroite={publication && auteur && <CarteAuteur id={publication.auteurId} {...auteur} />}>
      <h1 className="sr-only">{t('detail.titrePage')}</h1>
      <RetourAuFil />
      {publication && auteur ? (
        <>
          <DetailPublication publication={publication} auteur={auteur} />
          <AutresPublications publication={publication} nom={auteur.nom} />
        </>
      ) : (
        <EmptyState
          icone={Megaphone}
          titre={t('introuvable.titre')}
          texte={t('introuvable.detail')}
          action={
            <Button asChild variant="secondary" size="sm">
              <Lien to={ROUTES.accueil}>{t('introuvable.action')}</Lien>
            </Button>
          }
          className="rounded-none border-x-0 lg:rounded-lg lg:border-x"
        />
      )}
    </GrilleAccueil>
  )
}
