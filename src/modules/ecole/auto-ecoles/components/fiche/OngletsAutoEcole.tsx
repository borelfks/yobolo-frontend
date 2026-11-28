import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { usePermisCatalogue, usePhotosAutoEcole, useSessions, useVideos } from '@/data/hooks'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadcn/table'
import { VisionneuseMedias, type MediaVisionneuse } from '@/shared/blocs/Visionneuse'
import { Lien } from '@/shared/ui/Lien'
import type { AutoEcole, PermisCode } from '@/shared/types'
import { fcfa } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'
import { Carte, RangeePuces, TitreCarte } from '@/modules/ecole/etablissements/components/Bases'
import { TuilePhoto, TuileVideo } from '@/modules/ecole/etablissements/components/fiche/Fiche'
import { ListeCoches } from '@/modules/ecole/auto-ecoles/components/fiche/AsideAutoEcole'
import { includedKeys, permisDe, sessionDays, sessionDuration, sessionHours, tipKeys, TYPES_FORMATION, type TypeFormation } from '@/modules/ecole/auto-ecoles/autoEcoleFiche'
import { demoDate } from '@/shared/utils/dates'

/** Une puce « Catégorie de permis » : toutes, ou un permis. */
type ChoixPermis = 'tous' | PermisCode

/** Le code d'un permis dans une pastille bleu pâle (« A »). */
function CodePermis({ code, rond }: { code: PermisCode; rond?: boolean }) {
  return (
    <span aria-hidden className={rond ? 'grid size-6 flex-none place-items-center rounded-full bg-card text-meta font-extrabold text-primary-strong' : 'grid size-[30px] flex-none place-items-center rounded-md bg-primary-tint text-meta font-extrabold text-primary-strong'}>
      {code}
    </span>
  )
}

/** Les puces « Catégorie de permis » : Toutes, Permis A, Permis B… */
function PucesPermis({ codes, valeur, onChange }: { codes: PermisCode[]; valeur: ChoixPermis; onChange: (v: ChoixPermis) => void }) {
  const { t } = useTranslation('driving-schools')
  return (
    <RangeePuces<ChoixPermis>
      libelle={t('profile.filters.category')}
      valeur={valeur}
      onChange={onChange}
      options={[{ valeur: 'tous', libelle: t('profile.fiche.toutes') }, ...codes.map((c) => ({ valeur: c, libelle: t('common.licence', { code: c }) }))]}
    />
  )
}

/* --- 1. Aperçu -------------------------------------------------------------- */

/** Onglet « Aperçu » : présentation, quatre repères, permis proposés, puis la galerie en six photos. */
export function ApercuAutoEcole({ a }: { a: AutoEcole }) {
  const { t } = useTranslation('driving-schools')
  const codes = permisDe(a)
  const photos = usePhotosAutoEcole(a.id, 'apercu')
  const [vue, setVue] = useState<number | null>(null)
  const faits = [
    { k: t('profile.overview.facts.founded'), v: String(a.creation) },
    { k: t('profile.overview.facts.location'), v: `${a.ville} – ${a.quartier}` },
    { k: t('profile.overview.facts.hours'), v: t('profile.overview.facts.hoursValue') },
    { k: t('profile.overview.facts.status'), v: t('common.approved') },
  ]
  return (
    <>
      <Carte>
        <TitreCarte>{t('profile.overview.presentationTitle')}</TitreCarte>
        <p className="text-sm leading-relaxed text-foreground-soft">{t('profile.overview.presentation', { name: a.nom, licences: codes.join(', ') })}</p>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {faits.map((f) => (
            <div key={f.k} className="flex flex-col gap-0.5 rounded-md bg-background px-3 py-2.5">
              <dt className="text-xs text-muted-foreground">{f.k}</dt>
              <dd className="text-sm font-bold text-foreground">{f.v}</dd>
            </div>
          ))}
        </dl>
        <TitreCarte niveau={3} className="mt-1">
          {t('profile.overview.licences')}
        </TitreCarte>
        <ul className="flex flex-wrap gap-2">
          {codes.map((c) => (
            <li key={c}>
              <Lien to={ROUTES.license(a.id, c)} aria-label={t('profile.fiche.permisAria', { code: c })} className="flex h-9 items-center gap-2 rounded-full bg-background py-1 pr-3.5 pl-1.5 text-meta font-bold text-foreground no-underline hover:bg-primary-wash">
                <CodePermis code={c} rond />
                {t(`permis.${c}.name`)}
              </Lien>
            </li>
          ))}
        </ul>
      </Carte>
      {photos.length > 0 && (
        <Carte>
          <div className="flex items-center justify-between gap-2">
            <TitreCarte>{t('profile.overview.gallery', { count: photos.length })}</TitreCarte>
            <Lien to={ROUTES.drivingSchool(a.id, 'galerie')} className="text-sm font-bold text-primary no-underline hover:underline">
              {t('profile.overview.seeGallery')}
            </Lien>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((p, i) => (
              <TuilePhoto key={p.id} src={p.image} libelle={t('profile.gallery.photoAlt', { name: a.nom, n: i + 1 })} onClick={() => setVue(i)} className="h-[110px] sm:h-[120px]" />
            ))}
          </div>
          <VisionneuseMedias medias={photos.map((p, i) => ({ src: p.image, alt: t('profile.gallery.photoAlt', { name: a.nom, n: i + 1 }) }))} index={vue} onClose={() => setVue(null)} />
        </Carte>
      )}
    </>
  )
}

/* --- 2. Formations & Permis ------------------------------------------------- */

/** Onglet « Formations & Permis » : puces Catégorie et Type, puis une ligne par permis (photo, durée, prix, Voir les détails). */
export function FormationsAutoEcole({ a }: { a: AutoEcole }) {
  const { t } = useTranslation('driving-schools')
  const catalogue = usePermisCatalogue()
  const codes = permisDe(a)
  const [categorie, setCategorie] = useState<ChoixPermis>('tous')
  const [type, setType] = useState<TypeFormation>('tous')
  // Chaque permis est une formation initiale : « Renforcement / Recyclage » n'en montre aucun.
  const liste = codes.filter((c) => (categorie === 'tous' || c === categorie) && type !== 'refresher')
  return (
    <Carte>
      <TitreCarte>{t('profile.headers.trainings.title')}</TitreCarte>
      <p className="text-sm text-muted-foreground">{t('profile.headers.trainings.subtitle')}</p>
      <PucesPermis codes={codes} valeur={categorie} onChange={setCategorie} />
      <RangeePuces<TypeFormation>
        libelle={t('profile.trainings.type')}
        valeur={type}
        onChange={setType}
        options={TYPES_FORMATION.map((v) => ({ valeur: v, libelle: v === 'tous' ? t('profile.fiche.tous') : t(`profile.trainings.types.${v}`) }))}
      />
      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <TitreCarte niveau={3}>{t('profile.trainings.title')}</TitreCarte>
        <span className="text-meta text-muted-foreground">{t('profile.trainings.count', { count: liste.length })}</span>
      </div>
      {liste.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">{t('profile.filters.aucuneFormation')}</p>}
      {liste.map((c) => (
        <article key={c} className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:gap-4">
          <img src={catalogue[c].image} alt="" className="h-[120px] w-full rounded-md object-cover sm:h-[82px] sm:w-[150px]" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h4 className="text-base font-bold text-foreground">{t('common.licenceTitle', { code: c, name: t(`permis.${c}.name`) })}</h4>
            <p className="text-sm text-muted-foreground">{t(`permis.${c}.sub`)}</p>
            <p className="flex flex-wrap gap-x-3.5 text-sm">
              <span className="text-muted-foreground">{t(`permis.${c}.duration`)}</span>
              <b className="text-primary">{fcfa(catalogue[c].prix)}</b>
            </p>
          </div>
          <Button asChild variant="secondary" size="md">
            <Lien to={ROUTES.license(a.id, c)}>{t('profile.trainings.details')}</Lien>
          </Button>
        </article>
      ))}
    </Carte>
  )
}

/* --- 3. Tarifs -------------------------------------------------------------- */

/** Onglet « Tarifs » : une carte par permis (formation complète), ce que comprend le tarif, modalités de paiement. */
export function TarifsAutoEcole({ a }: { a: AutoEcole }) {
  const { t } = useTranslation('driving-schools')
  const catalogue = usePermisCatalogue()
  const codes = permisDe(a)
  return (
    <Carte>
      <TitreCarte>{t('profile.prices.title')}</TitreCarte>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {codes.map((c) => (
          <div key={c} className="flex flex-col gap-1 rounded-md border border-border p-3.5">
            <CodePermis code={c} />
            <b className="mt-1 text-ui leading-snug text-foreground">{t('common.licenceTitle', { code: c, name: t(`permis.${c}.name`) })}</b>
            <span className="text-meta text-muted-foreground">{t('profile.prices.fullTraining')}</span>
            <b className="mt-0.5 text-xl font-extrabold text-primary">{fcfa(catalogue[c].prix)}</b>
          </div>
        ))}
      </div>
      <p className="text-meta text-muted-foreground">
        <Trans t={t} i18nKey="profile.prices.note" components={{ lien: <Lien to={ROUTES.drivingSchool(a.id, 'planning')} className="font-bold text-primary no-underline hover:underline" /> }} />
      </p>
      <TitreCarte niveau={3}>{t('profile.prices.includedTitle')}</TitreCarte>
      <ListeCoches elements={includedKeys.map((k) => t(`profile.prices.included.${k}`))} className="flex flex-col gap-2" />
      <TitreCarte niveau={3}>{t('profile.prices.paymentTitle')}</TitreCarte>
      <dl>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border py-3 text-sm">
          <dt className="font-bold text-foreground">{t('profile.prices.paymentOnce')}</dt>
          <dd className="font-bold text-success">{t('profile.prices.discount')}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border py-3 text-sm">
          <dt className="font-bold text-foreground">{t('profile.prices.paymentInstalments')}</dt>
          <dd className="text-muted-foreground">{t('profile.prices.paymentConditions')}</dd>
        </div>
      </dl>
    </Carte>
  )
}

/* --- 4. Planning ------------------------------------------------------------ */

/** Onglet « Planning » : puces Catégorie, prochaines sessions (tableau ; cartes sur téléphone), prochaine rentrée, bon à savoir. */
export function PlanningAutoEcole({ a }: { a: AutoEcole }) {
  const { t } = useTranslation('driving-schools')
  const codes = permisDe(a)
  const sessions = useSessions().filter((s) => a.permis.includes(s.permis))
  const [categorie, setCategorie] = useState<ChoixPermis>('tous')
  const liste = sessions.filter((s) => categorie === 'tous' || s.permis === categorie)
  const prochaine = sessions[0]
  const nom = (c: PermisCode) => t('common.licenceTitle', { code: c, name: t(`permis.${c}.name`) })
  const horaires = (h: string[]) => `${sessionDays(t, h[0] ?? '')} · ${sessionHours(t, h[1] ?? '')}`
  return (
    <Carte>
      <TitreCarte>{t('profile.headers.schedule.title')}</TitreCarte>
      <p className="text-sm text-muted-foreground">{t('profile.headers.schedule.subtitle')}</p>
      <PucesPermis codes={codes} valeur={categorie} onChange={setCategorie} />
      <TitreCarte niveau={3} className="mt-1">
        {t('profile.schedule.title')}
      </TitreCarte>
      {liste.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">{t('profile.filters.aucuneSession')}</p>
      ) : (
        <>
          <Table className="max-sm:hidden">
            <TableHeader>
              <TableRow>
                <TableHead>{t('profile.schedule.columns.training')}</TableHead>
                <TableHead>{t('profile.schedule.columns.start')}</TableHead>
                <TableHead>{t('profile.schedule.columns.hours')}</TableHead>
                <TableHead>{t('profile.schedule.columns.duration')}</TableHead>
                <TableHead>{t('profile.schedule.columns.places')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liste.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-bold">{nom(s.permis)}</TableCell>
                  <TableCell>{demoDate(s.debut)}</TableCell>
                  <TableCell>{horaires(s.horaires)}</TableCell>
                  <TableCell>{sessionDuration(t, s.duree)}</TableCell>
                  <TableCell>
                    <Badge variant="green">{t('common.places', { count: s.places })}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ul className="flex flex-col sm:hidden">
            {liste.map((s) => (
              <li key={s.id} className="flex flex-col gap-1 border-t border-border py-3 text-sm">
                <b className="text-foreground">{nom(s.permis)}</b>
                <span className="text-muted-foreground">{t('profile.schedule.debut', { date: demoDate(s.debut), duree: sessionDuration(t, s.duree) })}</span>
                <span className="text-muted-foreground">{horaires(s.horaires)}</span>
                <Badge variant="green" className="self-start">
                  {t('common.places', { count: s.places })}
                </Badge>
              </li>
            ))}
          </ul>
        </>
      )}
      {prochaine && (
        <p className="flex items-center justify-between gap-3 rounded-md bg-primary-wash px-3.5 py-3 text-sm text-foreground">
          {t('profile.schedule.nextIntake')}
          <b className="text-primary">{demoDate(prochaine.debut)}</b>
        </p>
      )}
      <div className="flex flex-col gap-1 rounded-md bg-warning-soft px-3.5 py-3 text-sm text-foreground-soft">
        <b className="text-foreground">{t('profile.schedule.goodToKnow')}</b>
        {tipKeys.map((k) => (
          <span key={k}>{t(`profile.schedule.tips.${k}`)}</span>
        ))}
      </div>
    </Carte>
  )
}

/* --- 5. Galerie ------------------------------------------------------------- */

/** Onglet « Galerie » : photos puis vidéos, ouvertes dans la visionneuse. */
export function GalerieAutoEcole({ a }: { a: AutoEcole }) {
  const { t } = useTranslation('driving-schools')
  const photos = usePhotosAutoEcole(a.id, 'galerie')
  const videos = useVideos('auto-ecole', a.id, 'galerie')
  const [vue, setVue] = useState<number | null>(null)
  // Une seule visionneuse : les photos, puis les vidéos, dans l'ordre affiché.
  const medias: MediaVisionneuse[] = [
    ...photos.map((p, i) => ({ src: p.image, alt: t('profile.gallery.photoAlt', { name: a.nom, n: i + 1 }) })),
    ...videos.map((v) => ({ src: v.src, poster: v.poster, video: true, alt: v.titre })),
  ]
  return (
    <Carte>
      <TitreCarte>{t('profile.headers.gallery.title', { name: a.nom })}</TitreCarte>
      <p className="text-sm text-muted-foreground">{t('profile.headers.gallery.subtitle')}</p>
      {medias.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">{t('profile.gallery.vide')}</p>
      ) : (
        <>
          <b className="text-meta text-foreground">
            {t('profile.gallery.photos', { count: photos.length })} · {t('profile.gallery.videos', { count: videos.length })}
          </b>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((p, i) => (
              <TuilePhoto key={p.id} src={p.image} libelle={t('profile.gallery.photoAlt', { name: a.nom, n: i + 1 })} onClick={() => setVue(i)} className="h-[120px] sm:h-[140px]" />
            ))}
          </div>
          {videos.length > 0 && (
            <>
              <TitreCarte niveau={3} className="mt-1">
                {t('profile.gallery.videosTitre')}
              </TitreCarte>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {videos.map((v, i) => (
                  <TuileVideo key={v.id} poster={v.poster} titre={v.titre} onClick={() => setVue(photos.length + i)} className="h-[120px] sm:h-[140px]" />
                ))}
              </div>
            </>
          )}
        </>
      )}
      <VisionneuseMedias medias={medias} index={vue} onClose={() => setVue(null)} />
    </Carte>
  )
}

