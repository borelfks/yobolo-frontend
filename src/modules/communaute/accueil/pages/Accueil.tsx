import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from '@tanstack/react-router'
import { Megaphone, Search } from 'lucide-react'
import type { FiltreDuFil } from '@/modules/communaute/accueil/accueilFil'
import { BarreDeFiltres } from '@/modules/communaute/accueil/components/BarreDeFiltres'
import { LigneDeTri, SuiteDuFil } from '@/modules/communaute/accueil/components/FinDuFil'
import { GrilleAccueil, SqueletteAccueil } from '@/modules/communaute/accueil/components/GrilleAccueil'
import { ListeDeChoix } from '@/modules/communaute/accueil/components/ListeDeChoix'
import { PublicationDuFil } from '@/modules/communaute/accueil/components/PublicationDuFil'
import { useAuteurs } from '@/modules/communaute/accueil/hooks/useAuteur'
import { useEcranLarge } from '@/modules/communaute/accueil/hooks/useEcranLarge'
import { useFilDAccueil } from '@/modules/communaute/accueil/hooks/useFilDAccueil'
import { useFiltresDuFil } from '@/modules/communaute/accueil/hooks/useFiltresDuFil'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { EmptyState } from '@/shared/blocs/Etats'
import { Button } from '@/shared/shadcn/button'
import { ROUTES } from '@/shared/utils/routes'

/**
 * L'accueil d'un compte connecté (canevas : planches « Accueil » et « Accueil :
 * filtre Domaines ouvert ») : le compte à gauche, le fil de publications au
 * centre, les experts et les sujets du moment à droite. Les filtres sont dans
 * l'adresse ; tout vient de la base.
 */
export function Accueil() {
  const { account } = useSession()
  // L'accueil connecté est réservé aux comptes : un visiteur va se connecter.
  if (!account) return <Navigate to={ROUTES.signIn} replace />
  return (
    <ChargementDonnees fallback={<SqueletteAccueil />}>
      <FilAccueil />
    </ChargementDonnees>
  )
}

function FilAccueil() {
  const { t } = useTranslation('accueil')
  const { filtres, actifs, toutEffacer } = useFiltresDuFil()
  const fil = useFilDAccueil(filtres)
  const auteurDe = useAuteurs()
  const large = useEcranLarge()
  const [ouvert, setOuvert] = useState<FiltreDuFil | null>(null)
  const seulementEnregistrees = filtres.enregistrees && filtres.domaines.length + filtres.sujets.length + filtres.experts.length === 0 && !filtres.recherche.trim()

  return (
    <GrilleAccueil>
      <h1 className="sr-only">{t('titre')}</h1>
      {/* Sur téléphone, une liste de choix ouverte prend la place du fil. */}
      {!large && ouvert ? (
        <ListeDeChoix filtre={ouvert} total={fil.total} pleinEcran onFermer={() => setOuvert(null)} />
      ) : (
        <>
          <BarreDeFiltres ouvert={ouvert} onOuvrir={setOuvert} total={fil.total} />
          <LigneDeTri />
          {fil.total === 0 ? (
            <EmptyState
              icone={actifs ? Search : Megaphone}
              titre={!actifs ? t('vide.aucune') : seulementEnregistrees ? t('vide.enregistrees') : t('vide.filtres')}
              texte={actifs ? t('vide.texte') : undefined}
              action={
                actifs && (
                  <Button variant="secondary" size="sm" onClick={toutEffacer}>
                    {t('filtres.toutEffacer')}
                  </Button>
                )
              }
              className="rounded-none border-x-0 lg:rounded-lg lg:border-x"
            />
          ) : (
            fil.entrees.map((p) => <PublicationDuFil key={p.id} publication={p} auteur={auteurDe(p.auteurId)} />)
          )}
          {fil.resteAVoir && <SuiteDuFil affichees={fil.affichees} total={fil.total} onPlus={fil.voirPlus} />}
        </>
      )}
    </GrilleAccueil>
  )
}
