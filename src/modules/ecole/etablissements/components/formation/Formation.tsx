import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, CircleCheck, Clock, GraduationCap, Layers } from 'lucide-react'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import type { Etablissement, Formation, SemestreProgramme } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { demoDate, num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { Carte, TitreCarte } from '@/modules/ecole/etablissements/components/Bases'
import { LogoEcole } from '@/modules/ecole/etablissements/components/Vignette'
import { LigneInfo } from '@/modules/ecole/etablissements/components/fiche/OngletsEtablissement'

/** Une tuile « fait » : petit libellé gris, valeur en gras ; une icône facultative dans un carré blanc. */
export function Fait({ libelle, valeur, icone, className }: { libelle?: string; valeur: ReactNode; icone?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5 rounded-md bg-muted p-3', className)}>
      {icone && <span className="grid size-9 flex-none place-items-center rounded-md bg-card text-primary [&_svg]:size-[18px]">{icone}</span>}
      <span className="flex flex-col gap-0.5 text-xs font-semibold text-muted-foreground">
        {libelle}
        <b className="text-sm text-foreground">{valeur}</b>
      </span>
    </div>
  )
}

/** L'établissement d'une formation : logo, nom, type et lieu. */
export function EtablissementDeFormation({ e, infos, taille = 'sm' }: { e: Etablissement; infos: string; taille?: 'sm' | 'md' }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoEcole src={e.logo ?? e.vignette} nom={e.nom} className={cn('flex-none rounded-md border border-border text-xs', taille === 'sm' ? 'size-10' : 'size-12')} />
      <span className="flex flex-col gap-0.5">
        <b className="text-sm leading-[1.3] text-foreground">{e.nom}</b>
        <span className={cn('text-muted-foreground', taille === 'sm' ? 'text-meta' : 'text-xs')}>{infos}</span>
      </span>
    </span>
  )
}

/** Le contenu détaillé que l'établissement publie pour une formation (objectifs, débouchés) n'existe que pour celles dont il a publié le programme. */
const OBJECTIFS = ['o1', 'o2', 'o3', 'o4', 'o5'] as const
const METIERS = ['comptable', 'assistantGestion', 'gestionnaireTresorerie', 'assistantControle', 'collaborateurCabinet'] as const
const SECTEURS = [
  ['entreprises1', 'entreprises2'],
  ['banques1', 'banques2'],
  ['cabinets1', 'cabinets2'],
  ['commerce1', 'commerce2'],
] as const
const ETAPES = [['comptable'], ['chef1', 'chef2'], ['controleur1', 'controleur2'], ['raf1', 'raf2', 'raf3']] as const

/** Onglet « Détails » : diplôme, durée, cours ; présentation ; objectifs et débouchés quand ils sont publiés. */
export function DetailsFormation({ f, cours, detaille }: { f: Formation; cours: string; detaille: boolean }) {
  const { t } = useTranslation('schools')
  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Fait libelle={t('formationDetail.details.diplome')} valeur={f.diplome} />
        <Fait libelle={t('formationDetail.details.duree')} valeur={t('shared.months', { count: f.dureeMois })} />
        <Fait libelle={t('formationDetail.details.cours')} valeur={cours} />
      </div>
      <TitreCarte>{t('formationDetail.details.presentationTitle')}</TitreCarte>
      <p className="text-ui leading-[1.7] text-foreground-soft">{detaille ? t('formationDetail.details.presentationText', { name: f.nom }) : f.description}</p>
      {detaille && (
        <>
          <TitreCarte niveau={3}>{t('formationDetail.details.objectives')}</TitreCarte>
          <ul className="flex flex-col gap-2">
            {OBJECTIFS.map((o) => (
              <li key={o} className="flex gap-2.5 text-sm text-foreground-soft">
                <CircleCheck className="mt-0.5 size-[18px] shrink-0 fill-success text-card" aria-hidden />
                {t(`formationDetail.details.objectivesList.${o}`)}
              </li>
            ))}
          </ul>
          <TitreCarte niveau={3}>{t('formationDetail.details.outcomes')}</TitreCarte>
          <div className="flex flex-wrap gap-2">
            {METIERS.map((m) => (
              <Badge key={m} variant="gray" className="h-[30px] rounded-sm px-3 text-meta">
                {t(`formationDetail.jobs.${m}`)}
              </Badge>
            ))}
          </div>
        </>
      )}
    </>
  )
}

/** Onglet « Programme » : aperçu (durée, cours, volume horaire), puis chaque année et ses semestres. */
export function ProgrammeFormation({ f, cours, semestres }: { f: Formation; cours: string; semestres: SemestreProgramme[] }) {
  const { t } = useTranslation('schools')
  if (semestres.length === 0) return <p className="text-ui text-muted-foreground">{t('formationDetail.programme.aucun')}</p>
  const annees = [...new Set(semestres.map((s) => s.annee))]
  const total = semestres.reduce((n, s) => n + s.heures, 0)
  return (
    <>
      <TitreCarte>{t('formationDetail.programme.overview')}</TitreCarte>
      <p className="text-ui leading-[1.7] text-foreground-soft">{t('formationDetail.programme.overviewText')}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Fait libelle={t('formationDetail.programme.duree')} valeur={t('shared.months', { count: f.dureeMois })} />
        <Fait libelle={t('formationDetail.programme.cours')} valeur={cours} />
        <Fait libelle={t('formationDetail.programme.volume')} valeur={t('formationDetail.programme.hours', { count: total, n: num(total) })} />
      </div>
      <TitreCarte>{t('formationDetail.programme.detailed')}</TitreCarte>
      {annees.map((a) => {
        const siens = semestres.filter((s) => s.annee === a)
        const heures = siens.reduce((n, s) => n + s.heures, 0)
        const ue = siens.reduce((n, s) => n + s.ue.length, 0)
        return (
          <div key={a} className="flex flex-col gap-2">
            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 rounded-md bg-primary-soft px-3 py-2.5">
              <b className="text-sm text-primary-strong">{a}</b>
              <span className="text-meta text-foreground-soft">
                {t('formationDetail.programme.units', { count: ue })} · {t('formationDetail.programme.hours', { count: heures, n: num(heures) })}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {siens.map((s) => (
                <section key={s.id} className="flex flex-col gap-2 rounded-md border border-border p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <b className="text-ui text-foreground">{s.semestre}</b>
                    <span className="text-xs font-bold text-muted-foreground">{t('formation.heuresCourt', { n: s.heures })}</span>
                  </div>
                  <ul className="flex list-disc flex-col gap-1 pl-[18px] text-sm leading-normal text-foreground-soft">
                    {s.ue.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}

const PIECES = ['bac', 'releves', 'cni', 'photo'] as const

/** Onglet « Conditions d’admission » : niveau, sélection, période ; pièces à fournir ; « Bon à savoir ». */
export function AdmissionFormation({ f }: { f: Formation }) {
  const { t } = useTranslation('schools')
  return (
    <>
      <TitreCarte>{t('formationDetail.admission.title')}</TitreCarte>
      <p className="text-sm text-foreground-soft">{t('formationDetail.admission.intro', { name: f.nom })}</p>
      <dl>
        <LigneInfo cle={t('formationDetail.admission.niveau')} valeur={t('formationDetail.admission.niveauValue')} />
        <LigneInfo cle={t('formationDetail.admission.selection')} valeur={t('formationDetail.admission.selectionValue')} />
        <LigneInfo cle={t('formationDetail.admission.periode')} valeur={t('formationDetail.admission.periodeValue')} />
      </dl>
      <TitreCarte niveau={3}>{t('formationDetail.admission.documents')}</TitreCarte>
      <ul>
        {PIECES.map((p) => (
          <li key={p} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border py-3 text-sm">
            <span className="font-semibold text-foreground">{t(`formationDetail.admission.pieces.${p}`)}</span>
            <Badge variant="blue">{t('formationDetail.admission.required')}</Badge>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-x-2.5 gap-y-1 rounded-md bg-warning-soft px-3.5 py-3 text-sm text-warning-deep">
        <b>{t('formationDetail.admission.goodToKnow')}</b>
        <span>{t('formationDetail.admission.incomplete')}</span>
      </div>
    </>
  )
}

/** Onglet « Débouchés » : métiers, secteurs qui recrutent, évolution de carrière, quand ils sont publiés. */
export function DebouchesFormation({ f, detaille }: { f: Formation; detaille: boolean }) {
  const { t } = useTranslation('schools')
  if (!detaille) return <p className="text-ui text-muted-foreground">{t('formation.debouchesVide')}</p>
  return (
    <>
      <TitreCarte>{t('formationDetail.debouches.jobsTitle')}</TitreCarte>
      <p className="text-sm text-foreground-soft">{t('formationDetail.debouches.jobsIntro', { name: f.nom })}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {METIERS.map((m) => (
          <Fait key={m} valeur={t(`formationDetail.jobs.${m}`)} />
        ))}
      </div>
      <TitreCarte niveau={3}>{t('formationDetail.debouches.sectors')}</TitreCarte>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SECTEURS.map(([a, b]) => (
          <span key={a} className="flex items-center justify-center rounded-md bg-muted p-3 text-center text-meta font-bold text-foreground">
            {t(`formationDetail.debouches.sectorTiles.${a}`)} {t(`formationDetail.debouches.sectorTiles.${b}`)}
          </span>
        ))}
      </div>
      <TitreCarte niveau={3}>{t('formationDetail.debouches.career')}</TitreCarte>
      <p className="text-sm text-foreground-soft">{t('formationDetail.debouches.careerIntro')}</p>
      <ol className="flex flex-wrap items-center gap-2">
        {ETAPES.map((cles, i) => (
          <li key={cles[0]} className="flex items-center gap-2">
            <span className={cn('inline-flex min-h-9 items-center rounded-full px-3.5 py-1.5 text-meta font-bold', i === 0 ? 'bg-primary text-primary-foreground' : 'bg-primary-soft text-primary-strong')}>
              {cles.map((c) => t(`formationDetail.debouches.steps.${c}`)).join(' ')}
            </span>
            {i < ETAPES.length - 1 && (
              <span aria-hidden className="font-extrabold text-input">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}

/** La colonne de droite d'une formation : prochaine rentrée, l'établissement, ses autres formations. */
export function AsideFormation({ f, e, infos, autres, contact, fiche }: { f: Formation; e: Etablissement; infos: string; autres: Formation[]; contact: string; fiche: string }) {
  const { t } = useTranslation('schools')
  return (
    <>
      <Carte className="p-4">
        <div className="flex justify-between gap-3 text-sm text-muted-foreground">
          {t('formationDetail.aside.nextIntake')} <b className="text-foreground">{demoDate(f.rentree)}</b>
        </div>
        <Button asChild size="md">
          <Lien to={contact}>{t('formationDetail.aside.contact')}</Lien>
        </Button>
      </Carte>
      <Carte className="p-4">
        <TitreCarte className="text-base">{t('formation.aPropos')}</TitreCarte>
        <EtablissementDeFormation e={e} infos={infos} taille="md" />
        <Button asChild variant="secondary" size="md">
          <Lien to={fiche}>{t('formation.voirFiche')}</Lien>
        </Button>
      </Carte>
      {autres.length > 0 && (
        <Carte className="gap-0 p-4">
          <TitreCarte className="pb-1.5 text-base">{t('formation.autres')}</TitreCarte>
          {autres.map((a) => (
            <Lien key={a.id} to={ROUTES.training(a.id)} className="group flex items-center gap-3 border-t border-border py-2.5 text-foreground no-underline first-of-type:border-t">
              <Badge variant="blue">{a.diplome}</Badge>
              <b className="flex-1 text-sm group-hover:text-primary group-hover:underline">{a.nom}</b>
            </Lien>
          ))}
        </Carte>
      )}
    </>
  )
}

/** Icônes des 4 faits de l'en-tête (Durée, Niveau requis, Rentrée, Domaine). */
export function FaitsFormation({ f }: { f: Formation }) {
  const { t } = useTranslation('schools')
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
      <Fait icone={<Clock />} libelle={t('formationDetail.details.duree')} valeur={t('shared.months', { count: f.dureeMois })} />
      <Fait icone={<GraduationCap />} libelle={t('formationDetail.admission.niveau')} valeur={f.niveau} />
      <Fait icone={<CalendarDays />} libelle={t('ecoleProfil.informations.rentree')} valeur={demoDate(f.rentree)} />
      <Fait icone={<Layers />} libelle={t('formation.domaine')} valeur={f.domaine ?? f.filiere} />
    </div>
  )
}
