import { Navigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useEtablissement, useEtablissements } from '@/data/hooks'
import { MessagePage } from '@/shared/blocs/Etats'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { useMesureALaVue } from '@/shared/hooks/useMesureALaVue'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'
import { ShieldCheck } from 'lucide-react'
import { Ariane, BoutonFavori, NoteCourte } from '@/modules/ecole/etablissements/components/Bases'
import { AutresEtablissements, ContactEtablissement } from '@/modules/ecole/etablissements/components/fiche/AsideEtablissement'
import { AvisEtablissement } from '@/modules/ecole/etablissements/components/fiche/AvisEtablissement'
import { BoutonPartager, EnteteFiche, GrilleFiche, SqueletteFiche } from '@/modules/ecole/etablissements/components/fiche/Fiche'
import { ApercuEtablissement, FormationsEtablissement, GalerieEtablissement, InformationsEtablissement } from '@/modules/ecole/etablissements/components/fiche/OngletsEtablissement'
import { useEcolesResumees } from '@/modules/ecole/etablissements/hooks/useEcolesResumees'
import { slugOfType } from '@/modules/ecole/etablissements/schoolTypes'

const ONGLETS = ['', 'formations', 'informations', 'avis', 'galerie'] as const
type Onglet = (typeof ONGLETS)[number]

/**
 * Fiche d'un établissement (planches « Fiche IPC / CFP de Nkoabang / Centre
 * de Langues Global ») : un seul gabarit. En-tête (couverture, logo, nom,
 * badges, Contacter, favori, partager), 5 onglets dans l'adresse (Aperçu,
 * Formations, Informations, Avis, Galerie), colonne de contact à droite.
 */
export function EcoleProfil() {
  const { id = '', tab = '' } = useParams({ strict: false })
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-2 pb-4 sm:gap-3 sm:px-4 sm:pt-4 sm:pb-10">
      <ChargementDonnees fallback={<SqueletteFiche />}>
        <FicheOuIntrouvable id={id} tab={tab} />
      </ChargementDonnees>
    </div>
  )
}

/** Un identifiant inconnu : la page « introuvable », pas un autre établissement. */
function FicheOuIntrouvable({ id, tab }: { id: string; tab: string }) {
  const existe = useEtablissements().some((e) => e.id === id)
  return existe ? <FicheEtablissement id={id} tab={tab} /> : <MessagePage type="404" />
}

function FicheEtablissement({ id, tab }: { id: string; tab: string }) {
  const { t } = useTranslation('schools')
  const e = useEtablissement(id)
  const ecoles = useEcolesResumees()
  const { account } = useSession()
  // Une vue de la fiche, pour les statistiques de l'établissement (pas celle de l'établissement lui-même).
  useMesureALaVue(account?.ecoleId === e.id ? null : { type: 'vue', etablissementId: e.id }, `vue-${e.id}`)
  const slug = slugOfType(e.type)
  if (slug === 'auto-ecoles') return <Navigate to={ROUTES.drivingSchool(e.id)} replace />
  const base = ROUTES.school(slug, e.id)
  if (!(ONGLETS as readonly string[]).includes(tab)) return <Navigate to={base} replace />
  const onglet = tab as Onglet
  const resume = ecoles.find((x) => x.id === e.id)
  const formations = resume?.formations ?? []
  const memeType = ecoles.filter((x) => x.genre === slug)
  const typeNom = t(`ui.genresCourts.${slug}`)
  const lien = (o: Onglet) => ROUTES.school(slug, e.id, o || undefined)
  return (
    <>
      <Ariane items={[{ label: t('ui.ariane.ecole'), to: ROUTES.schools }, { label: typeNom, to: ROUTES.schoolType(slug) }, { label: e.sigle || e.nom }]} />
      <EnteteFiche
        couverture={e.couverture ?? e.photoFiche ?? e.image}
        logo={e.logo ?? e.vignette}
        logoAlt={t('fiche.logoAlt', { nom: e.sigle || e.nom })}
        nom={e.nom}
        sousTitre={`${typeNom} · ${e.ville}, ${e.quartier}`}
        meta={
          <>
            {resume?.verifie && (
              <Badge variant="green">
                <ShieldCheck aria-hidden />
                {t('ui.verifie')}
              </Badge>
            )}
            <NoteCourte note={e.note} nbAvis={e.avis} />
            <span className="text-muted-foreground">{t('vignette.formations', { count: formations.length })}</span>
          </>
        }
        actions={
          <>
            <Button asChild>
              <Lien to={`${lien('informations')}#info-contact`}>{t('fiche.contacter')}</Lien>
            </Button>
            <BoutonFavori id={e.id} kind="etablissement" />
            <BoutonPartager titre={e.nom} />
          </>
        }
        onglets={[
          { to: base, label: t('fiche.onglets.apercu'), fin: true },
          { to: lien('formations'), label: t('fiche.onglets.formations', { n: formations.length }) },
          { to: lien('informations'), label: t('fiche.onglets.informations') },
          { to: lien('avis'), label: t('fiche.onglets.avis', { n: e.avis }) },
          { to: lien('galerie'), label: t('fiche.onglets.galerie') },
        ]}
      />
      <GrilleFiche
        aside={
          <>
            <ContactEtablissement e={e} />
            {memeType.length > 1 && <AutresEtablissements type={slug} autres={memeType.filter((x) => x.id !== e.id).slice(0, 3)} total={memeType.length} />}
          </>
        }
      >
        {onglet === '' && <ApercuEtablissement e={e} formations={formations} ongletFormations={lien('formations')} />}
        {onglet === 'formations' && <FormationsEtablissement formations={formations} />}
        {onglet === 'informations' && <InformationsEtablissement e={e} formations={formations} />}
        {onglet === 'avis' && <AvisEtablissement e={e} />}
        {onglet === 'galerie' && <GalerieEtablissement e={e} />}
      </GrilleFiche>
    </>
  )
}
