import { Navigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { useAutoEcoles } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { MessagePage } from '@/shared/blocs/Etats'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'
import { Ariane, BoutonFavori, NoteCourte } from '@/modules/ecole/etablissements/components/Bases'
import { BoutonPartager, EnteteFiche, GrilleFiche, SqueletteFiche } from '@/modules/ecole/etablissements/components/fiche/Fiche'
import { ContactAutoEcole, PourquoiNousChoisir } from '@/modules/ecole/auto-ecoles/components/fiche/AsideAutoEcole'
import { AvisAutoEcole } from '@/modules/ecole/auto-ecoles/components/fiche/AvisAutoEcole'
import { ApercuAutoEcole, FormationsAutoEcole, GalerieAutoEcole, PlanningAutoEcole, TarifsAutoEcole } from '@/modules/ecole/auto-ecoles/components/fiche/OngletsAutoEcole'
import { ONGLETS_AUTO_ECOLE, type OngletAutoEcole } from '@/modules/ecole/auto-ecoles/autoEcoleFiche'

/**
 * Fiche d'une auto-école (planches « Fiche auto-école ») : le gabarit des
 * fiches (couverture, logo, nom, Agréée, note, Contacter, favori, partager),
 * 6 onglets dans l'adresse (Aperçu, Formations & Permis, Tarifs, Planning,
 * Galerie, Avis), « Contact & accès » et « Pourquoi nous choisir ? » à droite.
 */
export function AutoEcoleProfil() {
  const { id = '', tab = '' } = useParams({ strict: false })
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-2 pb-4 sm:gap-3 sm:px-4 sm:pt-4 sm:pb-10">
      <ChargementDonnees fallback={<SqueletteFiche />}>
        <FicheAutoEcole id={id} tab={tab} />
      </ChargementDonnees>
    </div>
  )
}

function FicheAutoEcole({ id, tab }: { id: string; tab: string }) {
  const { t } = useTranslation('driving-schools')
  const a = useAutoEcoles().find((x) => x.id === id)
  if (!a) return <MessagePage type="404" />
  const base = ROUTES.drivingSchool(a.id)
  if (!(ONGLETS_AUTO_ECOLE as readonly string[]).includes(tab)) return <Navigate to={base} replace />
  const onglet = tab as OngletAutoEcole
  const lien = (o: OngletAutoEcole) => (o ? ROUTES.drivingSchool(a.id, o) : base)
  return (
    <>
      <Ariane items={[{ label: t('common.crumbs.school'), to: ROUTES.schools }, { label: t('common.crumbs.drivingSchools'), to: ROUTES.drivingSchools }, { label: a.nom }]} />
      <EnteteFiche
        couverture={a.image}
        logo={a.logo}
        logoAlt={t('profile.fiche.logoAlt', { nom: a.nom })}
        nom={a.nom}
        sousTitre={t('profile.fiche.sousTitre', { lieu: `${a.ville}, ${a.quartier} (${a.region})` })}
        meta={
          <>
            <Badge variant="green">
              <Check aria-hidden />
              {t('common.approved')}
            </Badge>
            <NoteCourte note={a.note} nbAvis={a.avis} />
            <span className="text-muted-foreground">{t('profile.fiche.depuis', { annee: a.creation })}</span>
          </>
        }
        actions={
          <>
            <Button asChild>
              <Lien to={`${lien(onglet)}#contact`}>{t('profile.fiche.contacter')}</Lien>
            </Button>
            <BoutonFavori id={a.id} kind="auto-ecole" />
            <BoutonPartager titre={a.nom} />
          </>
        }
        onglets={[
          { to: base, label: t('profile.tabs.overview'), fin: true },
          { to: lien('formations'), label: t('profile.tabs.trainings') },
          { to: lien('tarifs'), label: t('profile.tabs.prices') },
          { to: lien('planning'), label: t('profile.tabs.schedule') },
          { to: lien('galerie'), label: t('profile.tabs.gallery') },
          { to: lien('avis'), label: t('profile.tabs.reviews', { count: a.avis }) },
        ]}
      />
      <GrilleFiche
        aside={
          <>
            <ContactAutoEcole a={a} />
            <PourquoiNousChoisir />
          </>
        }
      >
        {onglet === '' && <ApercuAutoEcole a={a} />}
        {onglet === 'formations' && <FormationsAutoEcole a={a} />}
        {onglet === 'tarifs' && <TarifsAutoEcole a={a} />}
        {onglet === 'planning' && <PlanningAutoEcole a={a} />}
        {onglet === 'galerie' && <GalerieAutoEcole a={a} />}
        {onglet === 'avis' && <AvisAutoEcole a={a} />}
      </GrilleFiche>
    </>
  )
}
