import { useTranslation } from 'react-i18next'
import { Image, MessageCircle, Pencil } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { ecoleUrl } from '@/modules/ecole/etablissements/schoolLinks'
import { useAvisEtablissement, useDocuments, useFaq, useMedias } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { BandeauChiffres, CartePro, SquelettePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { ActionsRapides, ApercuPagePublique, CarteAFaire, CarteCompletude, CarteInfos, type Tache } from '@/modules/ecole/espace-pro/components/tableau/BlocsTableau'
import { useFormationsEcole } from '@/modules/ecole/espace-pro/hooks/useFormationsEcole'
import { etatDuProfil, type EtapeProfil, type InfoAGerer } from '@/modules/ecole/espace-pro/proStats'

/** Où compléter chaque étape du profil et chaque information à gérer. */
const VERS_ETAPE: Record<EtapeProfil, string> = {
  profile: ROUTES.pro.profile(),
  trainings: ROUTES.pro.newTraining,
  info: ROUTES.pro.contents('faq'),
  gallery: ROUTES.pro.profile('medias'),
  optimisation: ROUTES.pro.profile('medias'),
}
const VERS_INFO: Record<InfoAGerer, string> = {
  presentation: ROUTES.pro.contents(),
  admission: ROUTES.pro.contents('faq'),
  calendar: ROUTES.pro.contents('documents'),
  careers: ROUTES.pro.trainings,
  contact: ROUTES.pro.profile('coordonnees'),
}

/** Tableau de bord de l'espace pro (canevas « Tableau de bord ») : la colonne principale et, à droite, l'aperçu et les actions rapides. */
export function Dashboard() {
  return (
    <ChargementDonnees fallback={<SquelettePro cartes={4} colonne />}>
      <Tableau />
    </ChargementDonnees>
  )
}

function Tableau() {
  const { t } = useTranslation('pro', { keyPrefix: 'tableau' })
  const { ecole } = useMonEcole()
  const { lignes } = useFormationsEcole()
  const medias = useMedias(ecole.id).length
  const avis = useAvisEtablissement(ecole.id)
  const etat = etatDuProfil({ ecole, medias, documents: useDocuments(ecole.id).length, faq: useFaq(ecole.id).length })
  const sansReponse = avis.filter((a) => !a.reponse)
  const brouillons = lignes.filter((f) => f.statut === 'Brouillon')
  const publiees = lignes.length - brouillons.length
  const filieres = ecole.principales ?? ecole.filieres
  const pagePublique = ecoleUrl(ecole)
  const pageAvis = ecoleUrl(ecole, 'avis')

  // Ce qui attend l'établissement, calculé à partir de la base.
  const taches: Tache[] = []
  if (sansReponse.length > 0) {
    const noms = sansReponse.slice(0, 3).map((a) => a.nom)
    taches.push({ id: 'avis', icone: MessageCircle, ton: 'violet', titre: t('aFaire.avis.titre', { count: sansReponse.length }), texte: t('aFaire.avis.texte', { count: noms.length, noms: noms.join(', ') }), action: t('aFaire.avis.action'), to: pageAvis, principale: true })
  }
  if (brouillons.length > 0) {
    taches.push({ id: 'brouillons', icone: Pencil, ton: 'gris', titre: t('aFaire.brouillons.titre', { count: brouillons.length }), texte: t('aFaire.brouillons.texte', { count: brouillons.length, nom: brouillons[0]!.nom }), action: t('aFaire.brouillons.action'), to: ROUTES.pro.editTraining(brouillons[0]!.id) })
  }
  if (medias === 0) {
    taches.push({ id: 'galerie', icone: Image, ton: 'bleu', titre: t('aFaire.galerie.titre'), texte: t('aFaire.galerie.texte'), action: t('aFaire.galerie.action'), to: ROUTES.pro.profile('medias') })
  }

  return (
    <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
      <div className="flex min-w-0 flex-col gap-2">
        <CartePro>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-1">
              <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-foreground lg:text-2xl">{t('titre')}</h1>
              <p className="text-sm text-muted-foreground">{t('sousTitre')}</p>
            </div>
            <Button asChild className="max-lg:w-full">
              <Lien to={ROUTES.pro.newTraining}>{t('creer')}</Lien>
            </Button>
          </div>
          <BandeauChiffres
            colonnes={4}
            colonnesMobile={2}
            chiffres={[
              { nom: t('chiffres.formations'), valeur: num(lignes.length), detail: `${t('chiffres.publiees', { count: publiees })} · ${t('chiffres.brouillons', { count: brouillons.length })}`, to: ROUTES.pro.trainings },
              { nom: t('chiffres.filieres'), valeur: num(filieres.length), detail: filieres.length ? `${filieres.slice(0, 2).join(', ')}${filieres.length > 2 ? '…' : ''}` : undefined, to: ROUTES.pro.trainings },
              { nom: t('chiffres.medias'), valeur: num(medias), detail: t('chiffres.mediasDetail'), to: ROUTES.pro.profile('medias') },
              { nom: t('chiffres.avis'), valeur: num(avis.length), detail: avis.length ? t('chiffres.avisDetail', { note: num(ecole.note), count: sansReponse.length }) : t('chiffres.sansAvis'), to: pageAvis },
            ]}
          />
        </CartePro>
        <CarteAFaire taches={taches} />
        <CarteCompletude {...etat} versProchaine={etat.prochaine ? VERS_ETAPE[etat.prochaine] : undefined} />
        <CarteInfos infos={etat.infos} liens={VERS_INFO} />
      </div>
      <aside className="flex min-w-0 flex-col gap-2 lg:sticky lg:top-[84px]">
        <ApercuPagePublique ecole={ecole} pagePublique={pagePublique} />
        <ActionsRapides
          sansReponse={sansReponse.length}
          liens={{ creer: ROUTES.pro.newTraining, medias: ROUTES.pro.profile('medias'), avis: pageAvis, infos: ROUTES.pro.profile(), actu: `${ROUTES.pro.contents('actualites')}?nouvelle=1`, stats: ROUTES.pro.statistics }}
        />
      </aside>
    </div>
  )
}
