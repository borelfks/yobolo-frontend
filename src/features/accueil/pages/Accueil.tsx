import { Bookmark, CheckCircle2, Megaphone, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router'
import { CLASSES_GRILLE_DU_FIL, CLASSES_PANNEAU } from '@/features/accueil/accueilFil'
import { BandeauAccueil } from '@/features/accueil/components/BandeauAccueil'
import { BarreDuFil } from '@/features/accueil/components/BarreDuFil'
import { DomainesExpertise } from '@/features/accueil/components/DomainesExpertise'
import { EtatVide } from '@/features/accueil/components/EtatVide'
import { PublicationDuFil } from '@/features/accueil/components/PublicationDuFil'
import { Raccourcis } from '@/features/accueil/components/Raccourcis'
import { useChargementAuDefilement } from '@/features/accueil/hooks/useChargementAuDefilement'
import { useFilDAccueil } from '@/features/accueil/hooks/useFilDAccueil'
import { useFiltresDuFil } from '@/features/accueil/hooks/useFiltresDuFil'
import { useSession } from '@/features/auth/hooks/useSession'
import { Button } from '@/shared/components/ui/Button'
import { ROUTES } from '@/shared/utils/routes'

/**
 * L'accueil d'un compte connecté : copie de l'AccueilPage de yibolo-client,
 * aux couleurs de l'application (bleu, bleu nuit, Plus Jakarta). Trois
 * panneaux sur grand écran : les domaines à gauche, le fil au centre en grille
 * de cartes, les raccourcis à droite. Toutes les données viennent
 * de la base. Le fil ne montre que des publications ; chacune s'ouvre sur sa page.
 *
 * Comme dans l'original : en dessous de `2xl`, la colonne des domaines
 * disparaît (le menu du fil la reprend) ; en dessous de `xl`, les raccourcis
 * remontent dans le fil. Rien de l'emploi ni de la Consultation (décision
 * du 2026-11-25). Les mesures sont celles
 * de yibolo-client (pas d'espacement de 0,3 rem, posé sur la page).
 */
export function Accueil() {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const { filtres, changer, nombreDansLeBouton, filtre, toutVoir } = useFiltresDuFil()
  const { enregistres, sujet, recherche, domaines } = filtres
  const { entrees, publications, resteAVoir, voirPlus } = useFilDAccueil(filtres)
  const sentinelle = useChargementAuDefilement<HTMLDivElement>({ actif: resteAVoir, charger: voirPlus })

  // L'accueil connecté est réservé aux comptes : un visiteur va se connecter.
  if (!account) return <Navigate to={ROUTES.signIn} replace />

  const seulementLesEnregistres = enregistres && !recherche && !sujet && domaines.length === 0

  const titreDuFil = t('fil.titre')

  return (
    <div className="px-5 pt-8 pb-12 [--spacing:0.3rem]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[minmax(0,1fr)] items-start gap-5 xl:grid-cols-[minmax(0,1fr)_21rem] 2xl:grid-cols-[11rem_minmax(0,1fr)_21rem]">
        <aside className="hidden 2xl:sticky 2xl:top-[84px] 2xl:block">
          <DomainesExpertise choisis={domaines} onChange={(choisies) => changer({ domaines: choisies })} />
        </aside>

        <div className={`flex min-w-0 flex-col gap-4 ${CLASSES_PANNEAU}`}>
          <h1 className="sr-only">{t('titre')}</h1>

          <BarreDuFil filtres={filtres} changer={changer} nombreDansLeBouton={nombreDansLeBouton} publications={publications} filtre={filtre} toutVoir={toutVoir} />

          <BandeauAccueil />

          {/* Sous `xl`, la colonne de droite n'existe pas : les raccourcis
              remontent ici, sinon ils attendraient la fin du fil. */}
          <div className="hidden md:block xl:hidden">
            <Raccourcis favoris={enregistres} basculerFavoris={() => changer({ enregistres: !enregistres })} />
          </div>

          <h2 className="text-base font-bold text-navy-900">{titreDuFil}</h2>

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
                {entrees.map((publication) => (
                  <PublicationDuFil key={publication.id} publication={publication} />
                ))}
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
          <Raccourcis favoris={enregistres} basculerFavoris={() => changer({ enregistres: !enregistres })} />
        </aside>

      </div>
    </div>
  )
}
