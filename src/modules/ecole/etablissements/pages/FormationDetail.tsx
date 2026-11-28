import { Navigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useEtablissement, useFormation, useFormations, useProgramme } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { tabTriggerClasses } from '@/shared/shadcn/tabs'
import { useMesureALaVue } from '@/shared/hooks/useMesureALaVue'
import { Lien } from '@/shared/ui/Lien'
import { LienActif } from '@/shared/ui/LienActif'
import { demoDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { Ariane, BoutonFavori, Carte } from '@/modules/ecole/etablissements/components/Bases'
import { GrilleFiche, SqueletteFiche } from '@/modules/ecole/etablissements/components/fiche/Fiche'
import { AdmissionFormation, AsideFormation, DebouchesFormation, DetailsFormation, EtablissementDeFormation, FaitsFormation, ProgrammeFormation } from '@/modules/ecole/etablissements/components/formation/Formation'
import { modeKey } from '@/modules/ecole/etablissements/schoolLinks'
import { slugOfType } from '@/modules/ecole/etablissements/schoolTypes'

const ONGLETS = ['', 'programme', 'admission', 'debouches'] as const
type Onglet = (typeof ONGLETS)[number]
const NOMS: Record<Onglet, 'details' | 'programme' | 'admission' | 'debouches'> = { '': 'details', programme: 'programme', admission: 'admission', debouches: 'debouches' }

/**
 * Détail d'une formation (planches « BTS Comptabilité & Gestion »,
 * « Électricité Bâtiment », « Anglais Général ») : un seul gabarit. En-tête
 * (photo, établissement, nom, badges, faits, Contacter, favori), 4 onglets
 * dans l'adresse (Détails, Programme, Conditions d’admission, Débouchés),
 * colonne de droite (rentrée, établissement, autres formations).
 */
export function FormationDetail() {
  const { id = '', tab = '' } = useParams({ strict: false })
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-2 pb-4 sm:gap-3 sm:px-4 sm:pt-4 sm:pb-10">
      <ChargementDonnees fallback={<SqueletteFiche />}>
        <DetailFormation id={id} tab={tab} />
      </ChargementDonnees>
    </div>
  )
}

function DetailFormation({ id, tab }: { id: string; tab: string }) {
  const { t } = useTranslation('schools')
  const f = useFormation(id)
  const e = useEtablissement(f.etablissementId)
  const semestres = useProgramme(f.id)
  const autres = useFormations().filter((x) => x.etablissementId === e.id && x.id !== f.id && x.statut === 'Publiée')
  const { account } = useSession()
  // Une vue de la formation, pour les statistiques de l'établissement.
  useMesureALaVue(account?.ecoleId === e.id ? null : { type: 'vueFormation', etablissementId: e.id, formationId: f.id }, `formation-${f.id}`)
  const base = ROUTES.training(f.id)
  if (!(ONGLETS as readonly string[]).includes(tab)) return <Navigate to={base} replace />
  const onglet = tab as Onglet
  const slug = slugOfType(e.type)
  const fiche = slug === 'auto-ecoles' ? ROUTES.drivingSchool(e.id) : ROUTES.school(slug, e.id)
  const contact = slug === 'auto-ecoles' ? fiche : `${ROUTES.school(slug, e.id, 'informations')}#info-contact`
  const typeNom = slug === 'auto-ecoles' ? '' : t(`ui.genresCourts.${slug}`)
  const infos = `${typeNom} · ${e.ville}, ${e.quartier}`
  const cours = t(`modes.${modeKey[f.mode]}`)
  // Objectifs et débouchés : publiés avec le programme détaillé de la formation.
  const detaille = semestres.length > 0
  return (
    <>
      <Ariane items={[{ label: t('ui.ariane.ecole'), to: ROUTES.schools }, ...(slug === 'auto-ecoles' ? [] : [{ label: typeNom, to: ROUTES.schoolType(slug) }]), { label: e.sigle || e.nom, to: fiche }, { label: f.nom }]} />
      <GrilleFiche aside={<AsideFormation f={f} e={e} infos={infos} autres={autres} contact={contact} fiche={fiche} />}>
        <section className="flex flex-col overflow-hidden border-y border-border bg-card sm:rounded-lg sm:border">
          <img src={f.photoEntete ?? f.image} alt="" className="h-[170px] w-full bg-border object-cover sm:h-[240px]" />
          <div className="flex flex-col gap-3 px-5 pt-[18px] pb-5">
            <Lien to={fiche} className="text-foreground no-underline hover:[&_b]:text-primary hover:[&_b]:underline">
              <EtablissementDeFormation e={e} infos={infos} />
            </Lien>
            <h1 className="text-2xl leading-[1.2] font-extrabold tracking-[-0.01em] text-foreground sm:text-[28px]">{f.nom}</h1>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="blue">{f.diplome}</Badge>
              <Badge variant="gray">{cours}</Badge>
              <Badge variant="green">{t('vignette.rentreeLe', { date: demoDate(f.rentree) })}</Badge>
            </div>
            <FaitsFormation f={f} />
            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild>
                <Lien to={contact}>{t('formationDetail.aside.contact')}</Lien>
              </Button>
              <BoutonFavori id={f.id} kind="formation" />
            </div>
          </div>
        </section>
        <Carte className="gap-0 overflow-hidden p-0">
          <nav aria-label={t('formation.ongletsAria')} className="flex gap-[22px] overflow-x-auto border-b border-border px-5 [scrollbar-width:none] sm:flex-wrap">
            {ONGLETS.map((o) => (
              <LienActif key={o} to={o ? ROUTES.training(f.id, o) : base} end={o === ''} className={tabTriggerClasses}>
                {t(`formationDetail.tabs.${NOMS[o]}`)}
              </LienActif>
            ))}
          </nav>
          <div className="flex flex-col gap-3.5 p-5">
            {onglet === '' && <DetailsFormation f={f} cours={cours} detaille={detaille} />}
            {onglet === 'programme' && <ProgrammeFormation f={f} cours={cours} semestres={semestres} />}
            {onglet === 'admission' && <AdmissionFormation f={f} />}
            {onglet === 'debouches' && <DebouchesFormation f={f} detaille={detaille} />}
          </div>
        </Carte>
      </GrilleFiche>
    </>
  )
}
