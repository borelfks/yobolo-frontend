import { Bookmark, CheckCircle2, Megaphone, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router'
import { useOffresEmploi, usePublications } from '@/data/hooks'
import { CLASSES_GRILLE_DU_FIL, CLASSES_PANNEAU, GENRES_DE_PUBLICATIONS, type GenreDuFil } from '@/features/accueil/accueilFil'
import { AFaire } from '@/features/accueil/components/AFaire'
import { BandeauAccueil } from '@/features/accueil/components/BandeauAccueil'
import { BandeBasAccueil, DeviseAccueil } from '@/features/accueil/components/BandeBasAccueil'
import { BarreDuFil } from '@/features/accueil/components/BarreDuFil'
import { ActualiteDuFil } from '@/features/accueil/components/ActualiteDuFil'
import { CarteExpert } from '@/features/accueil/components/CarteExpert'
import { DomainesExpertise } from '@/features/accueil/components/DomainesExpertise'
import { EtatVide } from '@/features/accueil/components/EtatVide'
import { FicheOffre } from '@/features/accueil/components/FicheOffre'
import { FormationDuFil } from '@/features/accueil/components/FormationDuFil'
import { LecturePublication } from '@/features/accueil/components/LecturePublication'
import { OffreDuFil } from '@/features/accueil/components/OffreDuFil'
import { OffresPopulaires } from '@/features/accueil/components/OffresPopulaires'
import { OngletsDuFil } from '@/features/accueil/components/OngletsDuFil'
import { PublicationDuFil } from '@/features/accueil/components/PublicationDuFil'
import { Raccourcis } from '@/features/accueil/components/Raccourcis'
import { ZonePublier } from '@/features/accueil/components/ZonePublier'
import { useChargementAuDefilement } from '@/features/accueil/hooks/useChargementAuDefilement'
import { useFilDAccueil } from '@/features/accueil/hooks/useFilDAccueil'
import { useFiltresDuFil } from '@/features/accueil/hooks/useFiltresDuFil'
import { useOffreOuverte } from '@/features/accueil/hooks/useOffreOuverte'
import { usePublicationOuverte } from '@/features/accueil/hooks/usePublicationOuverte'
import { useSession } from '@/features/auth/hooks/useSession'
import { Button } from '@/shared/components/ui/Button'
import { ROUTES } from '@/shared/utils/routes'

/**
 * L'accueil d'un compte connecté : copie de l'AccueilPage de yibolo-client,
 * aux couleurs de l'application (bleu, bleu nuit, Plus Jakarta). Trois
 * panneaux sur grand écran : les domaines à gauche, le fil au centre en grille
 * de cartes, les raccourcis et les offres à droite. Toutes les données viennent
 * de la base (publications, offres, formations, domaines, enregistrements…).
 *
 * Comme dans l'original : en dessous de `2xl`, la colonne des domaines
 * disparaît (le menu du fil la reprend) ; en dessous de `xl`, les raccourcis
 * remontent dans le fil et les offres passent dessous. Les mesures sont celles
 * de yibolo-client (pas d'espacement de 0,3 rem, posé sur la page).
 */
export function Accueil() {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const { filtres, changer, nombreDansLeBouton, filtre, toutVoir } = useFiltresDuFil()
  const { genre, tri, enregistres, sujet, recherche, domaines } = filtres
  const { entrees, publications, resteAVoir, voirPlus } = useFilDAccueil(filtres)
  const toutes = usePublications()
  const { ouverte, commenter, fermer } = usePublicationOuverte()
  const offreOuverte = useOffreOuverte()
  const offres = useOffresEmploi()
  const sentinelle = useChargementAuDefilement<HTMLDivElement>({ actif: resteAVoir, charger: voirPlus })

  // L'accueil connecté est réservé aux comptes : un visiteur va se connecter.
  if (!account) return <Navigate to={ROUTES.signIn} replace />

  const lue = ouverte ? toutes.find((p) => p.id === ouverte) : undefined
  const offre = offreOuverte.ouverte ? offres.find((o) => o.id === offreOuverte.ouverte) : undefined
  const seulementLesEnregistres = enregistres && !recherche && !sujet && domaines.length === 0

  // Changer de type efface ce qui ne s'y applique pas : « les plus lues » ne
  // range que des publications, et les offres n'ont ni domaine ni sujet.
  const changerDeGenre = (nouveau: GenreDuFil) => changer({ genre: nouveau, tri: GENRES_DE_PUBLICATIONS.includes(nouveau) ? tri : 'recentes' })

  const titreDuFil = genre === 'offre' ? t('genres.offre') : genre === 'formation' ? t('genres.formation') : t('fil.titre')

  return (
    <div className="px-4 pt-8 [--spacing:0.3rem] lg:px-6">
      <div className="mx-auto grid w-full max-w-[92rem] grid-cols-[minmax(0,1fr)] items-start gap-3 xl:grid-cols-[minmax(0,1fr)_21rem] 2xl:grid-cols-[11rem_minmax(0,1fr)_21rem]">
        <aside className="hidden 2xl:sticky 2xl:top-[84px] 2xl:block">
          <DomainesExpertise choisis={domaines} onChange={(choisies) => changer({ domaines: choisies })} />
        </aside>

        <div className={`flex min-w-0 flex-col gap-4 ${CLASSES_PANNEAU}`}>
          <h1 className="sr-only">{t('titre')}</h1>

          <BarreDuFil filtres={filtres} changer={changer} changerDeGenre={changerDeGenre} nombreDansLeBouton={nombreDansLeBouton} publications={publications} filtre={filtre} toutVoir={toutVoir} />

          <BandeauAccueil />

          {/* Sous `xl`, la colonne de droite n'existe pas : les raccourcis
              remontent ici, sinon ils attendraient la fin du fil. */}
          <div className="xl:hidden">
            <Raccourcis />
          </div>

          <AFaire compteId={account.id} />

          <ZonePublier />

          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-navy-900">{titreDuFil}</h2>
            <OngletsDuFil genre={genre} onChange={changerDeGenre} />
          </div>

          {recherche && entrees.length > 0 && <p className="-mt-1 text-sm text-muted">{t('rubriques.pour', { recherche })}</p>}

          {entrees.length === 0 ? (
            <EtatVide
              icone={
                seulementLesEnregistres ? (
                  <Bookmark className="size-6" aria-hidden="true" />
                ) : filtre ? (
                  <SearchX className="size-6" aria-hidden="true" />
                ) : (
                  <Megaphone className="size-6" aria-hidden="true" />
                )
              }
              titre={recherche ? t('vide.rechercheTitre', { recherche }) : seulementLesEnregistres ? t('vide.enregistresTitre') : t('vide.titre')}
              description={seulementLesEnregistres ? t('vide.enregistresDetail') : filtre ? t('vide.filtre') : t('vide.detail')}
              action={
                filtre ? (
                  <Button variant="neutral" size="sm" className="rounded-lg" onClick={toutVoir}>
                    {t('vide.toutVoir')}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <section aria-label={titreDuFil} className="@container flex flex-col gap-3">
              <div className={CLASSES_GRILLE_DU_FIL}>
                {entrees.map((entree) =>
                  entree.genre === 'publication' ? (
                    <PublicationDuFil key={entree.cle} publication={entree.publication} />
                  ) : entree.genre === 'offre' ? (
                    <OffreDuFil key={entree.cle} offre={entree.offre} />
                  ) : entree.genre === 'actualite' ? (
                    <ActualiteDuFil key={entree.cle} actualite={entree.actualite} etablissement={entree.etablissement} date={entree.date} />
                  ) : (
                    <FormationDuFil key={entree.cle} formation={entree.formation} />
                  ),
                )}
              </div>

              {resteAVoir ? (
                <div ref={sentinelle} className="flex justify-center pt-2">
                  <Button variant="neutral" size="sm" className="rounded-md" onClick={voirPlus}>
                    {t('voirPlus')}
                  </Button>
                </div>
              ) : (
                <p className="flex items-center gap-3 pt-3 text-sm text-muted">
                  <span className="h-px flex-1 bg-line" aria-hidden="true" />
                  <CheckCircle2 className="size-4 text-brand-700" aria-hidden="true" />
                  {t('fin')}
                  <span className="h-px flex-1 bg-line" aria-hidden="true" />
                </p>
              )}
            </section>
          )}
        </div>

        {/* Sur grand écran, la colonne de droite ne défile pas avec le fil. */}
        <aside className={`hidden flex-col gap-5 xl:sticky xl:top-[84px] xl:flex ${CLASSES_PANNEAU}`}>
          <Raccourcis />
          <OffresPopulaires />
          <CarteExpert />
        </aside>

        <div className={`flex flex-col gap-5 xl:hidden ${CLASSES_PANNEAU}`}>
          <OffresPopulaires />
          <CarteExpert />
        </div>

        <div className="grid items-center gap-x-3 gap-y-5 pt-1 xl:col-span-2 xl:grid-cols-[minmax(0,1fr)_21rem] 2xl:col-span-3 2xl:grid-cols-[minmax(0,1fr)_21rem]">
          <BandeBasAccueil />
          <DeviseAccueil />
        </div>
      </div>

      {lue && (
        <LecturePublication
          publication={lue}
          onFermer={fermer}
          commenter={commenter}
          onSujet={(leSujet) => changer({ sujet: leSujet, genre: GENRES_DE_PUBLICATIONS.includes(genre) ? genre : 'tout', enregistres: false })}
        />
      )}

      {offre && <FicheOffre offre={offre} onFermer={offreOuverte.fermer} />}
    </div>
  )
}
