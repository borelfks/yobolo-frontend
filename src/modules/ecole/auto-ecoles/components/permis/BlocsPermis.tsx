import { useTranslation } from 'react-i18next'
import { BookOpenText, CarFront, ClipboardCheck, ShieldCheck } from 'lucide-react'
import { usePermisCatalogue, useSessions } from '@/data/hooks'
import { Badge } from '@/shared/shadcn/badge'
import type { PermisCode } from '@/shared/types'
import { demoDate, fcfa } from '@/shared/utils/format'
import { Carte, TitreCarte } from '@/modules/ecole/etablissements/components/Bases'
import { ListeCoches } from '@/modules/ecole/auto-ecoles/components/fiche/AsideAutoEcole'
import { sessionDays, sessionDuration, sessionHours } from '@/modules/ecole/auto-ecoles/autoEcoleFiche'

/*
 * Les rubriques de la page d'un permis (Aperçu, Programme, Conditions,
 * Tarifs, Planning), sur le gabarit des fiches. Les textes du permis sont
 * dans la traduction, sous « licence.content.<code> ».
 */

/** « Présentation » : le texte du permis et la photo du véhicule. */
export function PresentationPermis({ code }: { code: PermisCode }) {
  const { t } = useTranslation('driving-schools')
  const catalogue = usePermisCatalogue()
  return (
    <Carte className="sm:flex-row sm:items-center sm:gap-5">
      <div className="flex flex-1 flex-col gap-2">
        <TitreCarte>{t(`licence.content.${code}.presentationTitle`)}</TitreCarte>
        <p className="text-sm leading-relaxed text-foreground-soft">{t(`licence.content.${code}.presentation`)}</p>
      </div>
      <img src={catalogue[code].image} alt={t(`permis.${code}.vehicle`)} className="h-[140px] w-full rounded-md object-cover sm:w-[260px]" />
    </Carte>
  )
}

const ETAPES = [
  { cle: 'code', icone: BookOpenText },
  { cle: 'driving', icone: CarFront },
  { cle: 'safety', icone: ShieldCheck },
  { cle: 'exam', icone: ClipboardCheck },
] as const

/** « Programme de formation » : les quatre étapes, du code à l'examen. */
export function ProgrammePermis({ code }: { code: PermisCode }) {
  const { t } = useTranslation('driving-schools')
  const textes = t(`licence.content.${code}.programme`, { returnObjects: true })
  return (
    <Carte>
      <TitreCarte>{t('licence.programmeTitle')}</TitreCarte>
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {ETAPES.map(({ cle, icone: Icone }, i) => (
          <li key={cle} className="flex flex-col gap-1.5 rounded-md bg-background p-3.5">
            <span className="flex items-center gap-2">
              <span aria-hidden className="grid size-7 place-items-center rounded-full bg-primary-tint text-meta font-extrabold text-primary-strong">
                {i + 1}
              </span>
              <Icone className="size-5 text-primary" aria-hidden />
            </span>
            <b className="text-sm text-foreground">{t(`licence.steps.${cle}`)}</b>
            <span className="text-meta text-muted-foreground">{textes[i]}</span>
          </li>
        ))}
      </ol>
    </Carte>
  )
}

/** « Conditions d'admission » et « Pièces à fournir », côte à côte sur ordinateur. */
export function ConditionsPermis({ code }: { code: PermisCode }) {
  const { t } = useTranslation('driving-schools')
  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
      <Carte>
        <TitreCarte>{t('licence.admission')}</TitreCarte>
        <ListeCoches elements={t(`licence.content.${code}.conditions`, { returnObjects: true })} />
      </Carte>
      <Carte>
        <TitreCarte>{t('licence.documents')}</TitreCarte>
        <ListeCoches elements={t(`licence.content.${code}.documents`, { returnObjects: true })} />
      </Carte>
    </div>
  )
}

/** « Tarif de la formation » : le prix, la durée, ce qui est compris et le paiement. */
export function TarifPermis({ code }: { code: PermisCode }) {
  const { t } = useTranslation('driving-schools')
  const catalogue = usePermisCatalogue()
  return (
    <Carte>
      <TitreCarte>{t('licence.priceTitle')}</TitreCarte>
      <b className="text-3xl leading-none font-extrabold text-primary">{fcfa(catalogue[code].prix)}</b>
      <p className="text-sm text-muted-foreground">{t('licence.fullTraining', { duration: t(`permis.${code}.duration`) })}</p>
      <ListeCoches elements={t(`licence.content.${code}.included`, { returnObjects: true })} />
      <p className="rounded-md bg-primary-wash px-3.5 py-3 text-sm text-foreground-soft">{t('licence.payment')}</p>
    </Carte>
  )
}

/** « Prochaines sessions » du permis : date, horaires, durée, places. */
export function PlanningPermis({ code }: { code: PermisCode }) {
  const { t } = useTranslation('driving-schools')
  const sessions = useSessions().filter((s) => s.permis === code)
  return (
    <Carte>
      <TitreCarte>{t('licence.nextSessions', { code })}</TitreCarte>
      {sessions.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{t('licence.noSession')}</p>
      ) : (
        <ul className="flex flex-col">
          {sessions.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-border py-3 text-sm first:border-t-0">
              <span className="flex flex-col gap-0.5">
                <b className="text-foreground">{t('licence.startsOn', { date: demoDate(s.debut) })}</b>
                <span className="text-muted-foreground">
                  {sessionDays(t, s.horaires[0] ?? '')} · {sessionHours(t, s.horaires[1] ?? '')} · {sessionDuration(t, s.duree)}
                </span>
              </span>
              <Badge variant="green">{t('common.places', { count: s.places })}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Carte>
  )
}

/** La carte de prix de la colonne de droite : le prix et ce qu'il comprend. */
export function PrixPermis({ code }: { code: PermisCode }) {
  const { t } = useTranslation('driving-schools')
  const catalogue = usePermisCatalogue()
  return (
    <Carte className="gap-2.5 p-4">
      <TitreCarte className="text-base">{t('licence.priceTitle')}</TitreCarte>
      <b className="text-2xl font-extrabold text-primary">{fcfa(catalogue[code].prix)}</b>
      <span className="text-meta text-muted-foreground">{t('licence.fullTraining', { duration: t(`permis.${code}.duration`) })}</span>
      <ListeCoches elements={t(`licence.content.${code}.included`, { returnObjects: true })} />
    </Carte>
  )
}
