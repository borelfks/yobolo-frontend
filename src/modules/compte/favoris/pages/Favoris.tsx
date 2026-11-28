import { useTranslation } from 'react-i18next'
import { Navigate } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { CadreFavoris } from '@/modules/compte/favoris/components/CadreFavoris'
import { AstuceFavoris, LigneFavori } from '@/modules/compte/favoris/components/LigneFavori'
import { FILTRES_FAVORIS, useFavorisAffiches, type FiltreFavoris } from '@/modules/compte/favoris/hooks/useFavorisAffiches'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { CarteCompte, EnTeteCompte, PucesCompte } from '@/shared/blocs/CadreCompte'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { EmptyState } from '@/shared/blocs/Etats'
import { SkeletonList, SkeletonZone } from '@/shared/blocs/Squelettes'
import { useParametresRecherche } from '@/shared/hooks/useParametresRecherche'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'

/**
 * « Mes favoris » (canevas : 1. Tous les favoris, 2. Formations,
 * 3. Établissements, 4. Publications) : le filtre est dans l'adresse
 * (`/favoris?type=formations`). Réservé aux personnes physiques.
 */
export function Favoris() {
  const { account } = useSession()
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  // Pas de favoris pour un compte école (décision du 2026-11-25) : il retourne à l'accueil.
  if (account.role !== 'utilisateur') return <Navigate to={ROUTES.accueil} replace />
  return (
    <CadreFavoris>
      <ChargementDonnees
        fallback={
          <SkeletonZone>
            <SkeletonList rows={4} />
          </SkeletonZone>
        }
      >
        <ListeFavoris />
      </ChargementDonnees>
    </CadreFavoris>
  )
}

function ListeFavoris() {
  const { t } = useTranslation('favorites')
  const [parametres] = useParametresRecherche()
  const filtre: FiltreFavoris = FILTRES_FAVORIS.find((f) => f === parametres.get('type')) ?? 'tous'
  const { lignes, nombre, toutSupprimer } = useFavorisAffiches()
  const affiches = lignes.filter((l) => filtre === 'tous' || l.genre === filtre)

  return (
    <CarteCompte>
      <EnTeteCompte
        titre={t('titre')}
        texte={t('texte')}
        action={
          lignes.length > 0 && (
            <Button variant="link" className="text-destructive" onClick={() => void toutSupprimer()}>
              {t('toutSupprimer')}
            </Button>
          )
        }
      />
      <PucesCompte
        titre={t('filtres.titre')}
        puces={FILTRES_FAVORIS.map((f) => ({
          cle: f,
          vers: f === 'tous' ? ROUTES.favorites : `${ROUTES.favorites}?type=${f}`,
          libelle: t(`filtres.${f}`, { count: nombre(f) }),
          actif: f === filtre,
        }))}
      />
      {affiches.length > 0 ? (
        <div>
          {affiches.map((l) => (
            <LigneFavori key={l.cle} favori={l} />
          ))}
        </div>
      ) : (
        <EmptyState
          icone={Heart}
          titre={t('vide.titre')}
          texte={t('vide.texte')}
          action={
            <Button asChild>
              <Lien to={ROUTES.schools}>{t('vide.explorer')}</Lien>
            </Button>
          }
          className="rounded-none border-x-0 border-b-0 bg-transparent px-4 py-8"
        />
      )}
      <AstuceFavoris />
    </CarteCompte>
  )
}
