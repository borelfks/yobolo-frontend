import { Navigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAutoEcoles, usePermisCatalogue } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { MessagePage } from '@/shared/blocs/Etats'
import { Badge } from '@/shared/shadcn/badge'
import type { PermisCode } from '@/shared/types'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { Ariane, BoutonFavori } from '@/modules/ecole/etablissements/components/Bases'
import { BoutonPartager, EnteteFiche, GrilleFiche, SqueletteFiche } from '@/modules/ecole/etablissements/components/fiche/Fiche'
import { ContactAutoEcole } from '@/modules/ecole/auto-ecoles/components/fiche/AsideAutoEcole'
import { ConditionsPermis, PlanningPermis, PresentationPermis, PrixPermis, ProgrammePermis, TarifPermis } from '@/modules/ecole/auto-ecoles/components/permis/BlocsPermis'
import { ONGLETS_PERMIS, type OngletPermis } from '@/modules/ecole/auto-ecoles/autoEcoleFiche'

/**
 * Le détail d'un permis dans une auto-école (pas de planche du canevas : le
 * gabarit des fiches) : en-tête, 5 onglets dans l'adresse (Aperçu,
 * Programme, Conditions, Tarifs, Planning), prix et contact à droite.
 */
export function PermisDetail() {
  const { id = '', code = '', tab = '' } = useParams({ strict: false })
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-2 pb-4 sm:gap-3 sm:px-4 sm:pt-4 sm:pb-10">
      <ChargementDonnees fallback={<SqueletteFiche />}>
        <FichePermis id={id} code={code.toUpperCase()} tab={tab} />
      </ChargementDonnees>
    </div>
  )
}

function FichePermis({ id, code, tab }: { id: string; code: string; tab: string }) {
  const { t } = useTranslation('driving-schools')
  const catalogue = usePermisCatalogue()
  const a = useAutoEcoles().find((x) => x.id === id)
  if (!a) return <MessagePage type="404" />
  // Un permis que l'auto-école ne propose pas : retour à sa fiche.
  if (!a.permis.includes(code as PermisCode)) return <Navigate to={ROUTES.drivingSchool(a.id, 'formations')} replace />
  const c = code as PermisCode
  if (!(ONGLETS_PERMIS as readonly string[]).includes(tab)) return <Navigate to={ROUTES.license(a.id, c)} replace />
  const onglet = tab as OngletPermis
  const lien = (o: OngletPermis) => ROUTES.license(a.id, c, o || undefined)
  const nom = t('common.licenceTitle', { code: c, name: t(`permis.${c}.name`) })
  return (
    <>
      <Ariane
        items={[
          { label: t('common.crumbs.school'), to: ROUTES.schools },
          { label: t('common.crumbs.drivingSchools'), to: ROUTES.drivingSchools },
          { label: a.nom, to: ROUTES.drivingSchool(a.id) },
          { label: t('common.licence', { code: c }) },
        ]}
      />
      <EnteteFiche
        couverture={a.image}
        logo={a.logo}
        logoAlt={t('profile.fiche.logoAlt', { nom: a.nom })}
        nom={nom}
        sousTitre={`${a.nom} · ${t(`licence.content.${c}.subtitle`)}`}
        meta={
          <>
            <Badge variant="blue">{t(`permis.${c}.duration`)}</Badge>
            <span className="text-muted-foreground">{t('licence.ageMin', { age: catalogue[c].ageMin })}</span>
            <b className="text-primary">{fcfa(catalogue[c].prix)}</b>
          </>
        }
        actions={
          <>
            <BoutonFavori id={`${a.id}:${c}`} kind="permis" />
            <BoutonPartager titre={`${nom} · ${a.nom}`} />
          </>
        }
        onglets={[
          { to: lien(''), label: t('licence.tabs.overview'), fin: true },
          { to: lien('programme'), label: t('licence.tabs.programme') },
          { to: lien('conditions'), label: t('licence.tabs.conditions') },
          { to: lien('tarifs'), label: t('licence.tabs.prices') },
          { to: lien('planning'), label: t('licence.tabs.schedule') },
        ]}
      />
      <GrilleFiche
        aside={
          <>
            <PrixPermis code={c} />
            <ContactAutoEcole a={a} />
          </>
        }
      >
        {onglet === '' && (
          <>
            <PresentationPermis code={c} />
            <ProgrammePermis code={c} />
            <ConditionsPermis code={c} />
          </>
        )}
        {onglet === 'programme' && <ProgrammePermis code={c} />}
        {onglet === 'conditions' && <ConditionsPermis code={c} />}
        {onglet === 'tarifs' && <TarifPermis code={c} />}
        {onglet === 'planning' && <PlanningPermis code={c} />}
      </GrilleFiche>
    </>
  )
}
