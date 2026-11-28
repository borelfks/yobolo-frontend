import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CircleCheck, Download, Layers, Search } from 'lucide-react'
import { useActualites, useAlbums, useDocuments, useFaq, useFichiers, useMedias, useVideos } from '@/data/hooks'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/shadcn/accordion'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { VisionneuseMedias, type MediaVisionneuse } from '@/shared/blocs/Visionneuse'
import { Lien } from '@/shared/ui/Lien'
import type { Etablissement, Formation } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { telecharger } from '@/shared/utils/fichiers'
import { lienCarte } from '@/shared/utils/liens'
import { mesurer } from '@/shared/utils/mesures'
import { ROUTES } from '@/shared/utils/routes'
import { Carte, RangeePuces, TitreCarte } from '@/modules/ecole/etablissements/components/Bases'
import { MenuTri } from '@/modules/ecole/etablissements/components/liste/Resultats'
import { TuilePhoto, TuileVideo } from '@/modules/ecole/etablissements/components/fiche/Fiche'
import { modeKey } from '@/modules/ecole/etablissements/schoolLinks'
import { useCoursDe } from '@/modules/ecole/etablissements/hooks/useCoursDe'
import { demoDate } from '@/shared/utils/dates'

/** Une ligne « clé : valeur » d'une carte (Informations clés). */
function LigneCle({ cle, valeur }: { cle: string; valeur: string | number }) {
  return (
    <div className="flex items-center gap-2.5 border-t border-border py-2.5 text-sm first:border-t-0">
      <dt className="font-bold whitespace-nowrap text-foreground">{cle} :</dt>
      <dd className="text-foreground-soft">{valeur}</dd>
    </div>
  )
}

/** Une ligne « libellé … valeur » des rubriques (gris à gauche, en gras à droite). */
export function LigneInfo({ cle, valeur }: { cle: string; valeur: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border py-3 text-sm">
      <dt className="text-muted-foreground">{cle}</dt>
      <dd className="text-right font-bold text-foreground">{valeur}</dd>
    </div>
  )
}

/** La dernière actualité publiée : photo, catégorie et date, titre. */
function Actualite({ id, petite }: { id: string; petite?: boolean }) {
  const actualite = useActualites(id).find((a) => a.statut === 'Publiée')
  if (!actualite) return null
  return (
    <div className="flex flex-wrap items-center gap-4">
      <img src={actualite.image} alt="" className={cn('max-w-full flex-[1_1_180px] rounded-md object-cover', petite ? 'h-[110px]' : 'h-[130px]')} />
      <div className="flex flex-[999_1_240px] flex-col gap-1.5">
        <span className="text-xs font-bold text-primary-strong">
          {actualite.categorie} · {demoDate(actualite.date)}
        </span>
        <b className={cn('leading-snug text-foreground', petite ? 'text-ui' : 'text-base')}>{actualite.titre}</b>
      </div>
    </div>
  )
}

/* --- 1. Aperçu -------------------------------------------------------------- */

const ATOUTS = ['professional', 'experts', 'internships'] as const

/** Onglet « Aperçu » : vidéo de présentation, présentation, informations clés, principales filières, actualité. */
export function ApercuEtablissement({ e, formations, ongletFormations }: { e: Etablissement; formations: Formation[]; ongletFormations: string }) {
  const { t } = useTranslation('schools')
  const cours = useCoursDe()
  const video = useVideos('etablissement', e.id, 'presentation')[0]
  const aActualite = useActualites(e.id).some((a) => a.statut === 'Publiée')
  const [vue, setVue] = useState<number | null>(null)
  const principales = e.principales ?? e.filieres.slice(0, 5)
  const diplomes = [...new Set(formations.map((f) => f.diplome))]
  const titreVideo = t('fiche.apercu.video', { nom: e.sigle || e.nom })
  return (
    <>
      <div className={cn('flex flex-col gap-2 sm:grid sm:items-stretch', video ? 'sm:grid-cols-[1.1fr_1fr_1fr]' : 'sm:grid-cols-2')}>
        {video && (
          <>
            <TuileVideo grand poster={video.poster} titre={titreVideo} onClick={() => setVue(0)} className="min-h-[220px] rounded-none sm:rounded-lg" />
            <VisionneuseMedias medias={[{ src: video.src, poster: video.poster, video: true, alt: titreVideo }]} index={vue} onClose={() => setVue(null)} />
          </>
        )}
        <Carte>
          <TitreCarte>{t('fiche.apercu.presentation')}</TitreCarte>
          <p className="text-sm leading-relaxed text-foreground-soft">{e.description}</p>
          <ul className="flex flex-col gap-2">
            {ATOUTS.map((a) => (
              <li key={a} className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                <CircleCheck className="size-[18px] shrink-0 fill-success text-card" aria-hidden />
                {t(`fiche.apercu.atouts.${a}`)}
              </li>
            ))}
          </ul>
        </Carte>
        <Carte>
          <TitreCarte>{t('fiche.apercu.infosCles')}</TitreCarte>
          <dl>
            <LigneCle cle={t('fiche.apercu.cles.formations')} valeur={formations.length} />
            <LigneCle cle={t('fiche.apercu.cles.filieres')} valeur={principales.length} />
            <LigneCle cle={t('fiche.apercu.cles.diplomes')} valeur={diplomes.join(', ') || '—'} />
            <LigneCle cle={t('fiche.apercu.cles.cours')} valeur={cours(formations)} />
            <LigneCle cle={t('fiche.apercu.cles.localisation')} valeur={`${e.ville} – ${e.quartier}`} />
          </dl>
        </Carte>
      </div>
      {principales.length > 0 && (
        <Carte>
          <TitreCarte>{t('fiche.apercu.principales')}</TitreCarte>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {principales.map((f) => (
              <Lien key={f} to={ongletFormations} className="flex flex-col items-center justify-center gap-1.5 rounded-md bg-muted px-2 py-3.5 text-center text-meta font-bold text-foreground no-underline hover:bg-accent hover:text-primary">
                <Layers className="size-6 text-primary" aria-hidden />
                {f}
              </Lien>
            ))}
          </div>
        </Carte>
      )}
      {aActualite && (
        <Carte>
          <TitreCarte>{t('fiche.apercu.actualite')}</TitreCarte>
          <Actualite id={e.id} />
        </Carte>
      )}
    </>
  )
}

/* --- 2. Formations ---------------------------------------------------------- */

type Cours = 'tous' | 'Jour' | 'Soir'

/** Onglet « Formations » : recherche, puces Diplôme et Cours, tri, la liste vers le détail de chaque formation. */
export function FormationsEtablissement({ formations }: { formations: Formation[] }) {
  const { t } = useTranslation('schools')
  const [q, setQ] = useState('')
  const [diplome, setDiplome] = useState('tous')
  const [cours, setCours] = useState<Cours>('tous')
  const [tri, setTri] = useState<'pertinence' | 'duree'>('pertinence')
  const diplomes = [...new Set(formations.map((f) => f.diplome))]
  const rq = q.trim().toLowerCase()
  const liste = formations.filter((f) => (!rq || `${f.nom} ${f.domaine ?? ''}`.toLowerCase().includes(rq)) && (diplome === 'tous' || f.diplome === diplome) && (cours === 'tous' || f.mode.includes(cours)))
  const triees = tri === 'duree' ? [...liste].sort((a, b) => a.dureeMois - b.dureeMois) : liste
  return (
    <Carte>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <TitreCarte>{t('fiche.formations.titre', { n: formations.length })}</TitreCarte>
        <MenuTri
          valeur={tri}
          onChange={setTri}
          options={[
            { valeur: 'pertinence', libelle: t('liste.tris.pertinence') },
            { valeur: 'duree', libelle: t('fiche.formations.duree') },
          ]}
        />
      </div>
      <label className="flex h-[38px] items-center gap-2 rounded-sm bg-surface-search px-3 text-muted-foreground focus-within:outline-2 focus-within:outline-ring">
        <Search className="size-4 shrink-0" aria-hidden />
        <Input type="search" value={q} onChange={(ev) => setQ(ev.target.value)} aria-label={t('fiche.formations.chercherAria')} placeholder={t('fiche.formations.chercher')} className="h-auto border-0 bg-transparent px-0 text-sm focus-visible:outline-none" />
      </label>
      <div className="flex flex-col gap-2">
        <RangeePuces libelle={t('fiche.formations.diplome')} largeurLibelle="w-16" valeur={diplome} onChange={setDiplome} options={[{ valeur: 'tous', libelle: t('fiche.formations.tous') }, ...diplomes.map((d) => ({ valeur: d, libelle: d }))]} />
        <RangeePuces<Cours>
          libelle={t('fiche.formations.cours')}
          largeurLibelle="w-16"
          valeur={cours}
          onChange={setCours}
          options={[
            { valeur: 'tous', libelle: t('fiche.formations.tous') },
            { valeur: 'Jour', libelle: t('modes.jour') },
            { valeur: 'Soir', libelle: t('modes.soir') },
          ]}
        />
      </div>
      <ul>
        {triees.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center gap-3 border-t border-border py-3.5">
            <Badge variant="blue">{f.diplome}</Badge>
            <span className="flex min-w-0 flex-[1_1_200px] flex-col gap-0.5">
              <b className="text-ui text-foreground">{f.nom}</b>
              <span className="text-meta text-muted-foreground">{[t('shared.months', { count: f.dureeMois }), t(`modes.${modeKey[f.mode]}`), f.domaine].filter(Boolean).join(' · ')}</span>
            </span>
            <Lien to={ROUTES.training(f.id)} className="text-meta font-bold text-primary no-underline hover:underline">
              {t('fiche.formations.voir')}
            </Lien>
          </li>
        ))}
      </ul>
      {triees.length === 0 && <p className="py-4 text-sm text-muted-foreground">{t('fiche.formations.aucune')}</p>}
    </Carte>
  )
}

/* --- 3. Informations -------------------------------------------------------- */

const SECTIONS = ['presentation', 'admission', 'calendrier', 'contact', 'actualites', 'documents', 'faq'] as const
type Section = (typeof SECTIONS)[number]
const TUILES = [
  ['qualite1', 'qualite2'],
  ['enseignants1', 'enseignants2'],
  ['stages1', 'stages2'],
] as const
const ATOUTS_INFOS = ['a1', 'a2', 'a3', 'a4'] as const

/**
 * Onglet « Informations » : les 7 rubriques à la suite ; à gauche (puces sur
 * téléphone), leur sommaire, qui mène à chacune.
 */
export function InformationsEtablissement({ e, formations }: { e: Etablissement; formations: Formation[] }) {
  const { t } = useTranslation('schools')
  const cours = useCoursDe()
  const [section, setSection] = useState<Section>('presentation')
  const r = (k: Parameters<typeof cleLigne>[0]) => t(cleLigne(k))
  const diplomes = [...new Set(formations.map((f) => f.diplome))].join(', ') || '—'
  const titre = (s: Section) => (s === 'presentation' ? t('ecoleProfil.informations.presentationTitle') : t(`ecoleProfil.informations.sections.${s}`))
  const aller = (s: Section) => {
    setSection(s)
    document.getElementById(`info-${s}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }
  const rubrique = (s: Section, contenu: ReactNode) => (
    <div id={`info-${s}`} className="flex scroll-mt-4 flex-col gap-2.5">
      <TitreCarte>{titre(s)}</TitreCarte>
      {contenu}
    </div>
  )
  return (
    <Carte className="gap-0 p-0 sm:flex-row sm:items-stretch">
      <nav aria-label={t('fiche.infos.sommaire')} className="flex gap-2 overflow-x-auto px-4 pt-3.5 pb-1 [scrollbar-width:none] sm:sticky sm:top-0 sm:flex-[0_0_230px] sm:flex-col sm:gap-0 sm:self-start sm:overflow-visible sm:border-r sm:border-border sm:px-0 sm:py-3">
        {SECTIONS.map((s) => (
          <Button
            key={s}
            variant="ghost"
            aria-current={section === s ? 'true' : undefined}
            onClick={() => aller(s)}
            className={cn(
              'flex-none font-semibold',
              // Téléphone : une puce ; ordinateur : une ligne du sommaire, filet bleu quand elle est choisie.
              'h-8 rounded-full border-border-strong px-3.5 text-meta text-foreground-soft aria-[current=true]:border-foreground aria-[current=true]:bg-foreground aria-[current=true]:text-white max-sm:border',
              'sm:h-auto sm:w-full sm:justify-start sm:rounded-none sm:border-0 sm:border-l-[3px] sm:border-transparent sm:px-3 sm:py-2.5 sm:text-left sm:text-sm sm:whitespace-normal sm:hover:bg-muted sm:aria-[current=true]:border-primary sm:aria-[current=true]:bg-primary-soft sm:aria-[current=true]:text-primary-strong',
            )}
          >
            {s === 'presentation' ? t('ecoleProfil.informations.sections.presentation') : t(`ecoleProfil.informations.sections.${s}`)}
          </Button>
        ))}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col gap-7 p-5">
        {rubrique(
          'presentation',
          <>
            <p className="text-sm leading-relaxed text-foreground-soft">{t('ecoleProfil.informations.presentationText', { name: e.nom })}</p>
            <div className="grid grid-cols-3 gap-2">
              {TUILES.map(([a, b]) => (
                <span key={a} className="flex flex-col items-center justify-center rounded-md bg-muted px-2 py-3.5 text-center text-meta font-bold text-foreground">
                  {t(`ecoleProfil.informations.tiles.${a}`)}
                  <br />
                  {t(`ecoleProfil.informations.tiles.${b}`)}
                </span>
              ))}
            </div>
            <TitreCarte niveau={3}>{t('ecoleProfil.informations.mission')}</TitreCarte>
            <p className="text-sm leading-relaxed text-foreground-soft">{t('ecoleProfil.informations.missionText')}</p>
            <TitreCarte niveau={3}>{t('ecoleProfil.informations.assets')}</TitreCarte>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground-soft">
              {ATOUTS_INFOS.map((a) => (
                <li key={a}>{t(`ecoleProfil.informations.assetsList.${a}`)}</li>
              ))}
            </ul>
            <TitreCarte niveau={3}>{t('ecoleProfil.informations.general')}</TitreCarte>
            <dl>
              <LigneInfo cle={t('ecoleProfil.informations.statut')} valeur={t('ecoleProfil.informations.statutValue')} />
              <LigneInfo cle={t('ecoleProfil.informations.diplomes')} valeur={diplomes} />
              <LigneInfo cle={t('ecoleProfil.informations.cours')} valeur={cours(formations)} />
              <LigneInfo cle={t('ecoleProfil.informations.rentree')} valeur={demoDate(e.rentree)} />
            </dl>
          </>,
        )}
        {rubrique(
          'admission',
          <dl>
            <LigneInfo cle={r('niveau')} valeur={r('niveauValue')} />
            <LigneInfo cle={r('selection')} valeur={r('selectionValue')} />
            <LigneInfo cle={r('periode')} valeur={r('periodeValue')} />
            <LigneInfo cle={r('pieces')} valeur={r('piecesValue')} />
          </dl>,
        )}
        {rubrique(
          'calendrier',
          <dl>
            <LigneInfo cle={r('ouverture')} valeur={r('ouvertureValue')} />
            <LigneInfo cle={r('cloture')} valeur={r('clotureValue')} />
            <LigneInfo cle={r('rentree')} valeur={demoDate(e.rentree)} />
            <LigneInfo cle={r('examens')} valeur={r('examensValue')} />
          </dl>,
        )}
        {rubrique(
          'contact',
          <>
            <dl>
              <LigneInfo cle={r('telephone')} valeur={e.telephone} />
              <LigneInfo cle={r('email')} valeur={e.email} />
              <LigneInfo cle={r('adresse')} valeur={e.adresse ?? `${e.quartier}, ${e.ville}`} />
              <LigneInfo cle={r('horaires')} valeur={r('horairesValue')} />
            </dl>
            <Button asChild variant="secondary" className="self-start">
              <a href={lienCarte(e.adresse ?? e.quartier, e.ville)} target="_blank" rel="noreferrer">
                {t('ecoleProfil.informations.seeOnMap')}
              </a>
            </Button>
          </>,
        )}
        {rubrique('actualites', <ActualitesPubliees id={e.id} />)}
        {rubrique('documents', <DocumentsPublies id={e.id} />)}
        {rubrique('faq', <FaqPubliee id={e.id} />)}
      </div>
    </Carte>
  )
}

/** Clé d'une ligne des rubriques (textes de la maquette). */
const cleLigne = (k: keyof (typeof import('@/modules/ecole/etablissements/locales/fr.json'))['ecoleProfil']['informations']['rows']) => `ecoleProfil.informations.rows.${k}` as const

function ActualitesPubliees({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const aucune = !useActualites(id).some((a) => a.statut === 'Publiée')
  return aucune ? <p className="text-sm text-muted-foreground">{t('ecoleProfil.informations.contenus.noNews')}</p> : <Actualite id={id} petite />
}

function DocumentsPublies({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const documents = useDocuments(id).filter((d) => d.statut === 'Publié')
  const fichiers = useFichiers()
  if (documents.length === 0) return <p className="text-sm text-muted-foreground">{t('ecoleProfil.informations.contenus.noDocuments')}</p>
  return (
    <ul>
      {documents.map((d) => {
        const f = fichiers.find((x) => x.id === d.fichierId)
        return (
          <li key={d.id} className="flex items-center gap-3 border-t border-border py-3 first:border-t-0">
            <Badge variant="red">{d.type}</Badge>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-sm text-foreground">{d.nom}</b>
              <span className="text-meta text-muted-foreground">
                {d.taille} · {d.date}
              </span>
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (!f) return void toast(t('ecoleProfil.informations.contenus.noFile'))
                telecharger(f.dataUrl, f.nom)
                void mesurer({ type: 'telechargement', etablissementId: id, documentId: d.id })
              }}
            >
              <Download aria-hidden />
              {t('ecoleProfil.informations.contenus.download')}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

function FaqPubliee({ id }: { id: string }) {
  const { t } = useTranslation('schools')
  const faq = useFaq(id)
  if (faq.length === 0) return <p className="text-sm text-muted-foreground">{t('ecoleProfil.informations.contenus.noFaq')}</p>
  return (
    <Accordion type="single" collapsible>
      {faq.map((q) => (
        <AccordionItem key={q.id} value={q.id}>
          <AccordionTrigger>{q.q}</AccordionTrigger>
          <AccordionContent>{q.r}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

/* --- 5. Galerie ------------------------------------------------------------- */

/** Onglet « Galerie » : vidéo de la visite, albums, puis les photos et vidéos ajoutées par l'établissement. */
export function GalerieEtablissement({ e }: { e: Etablissement }) {
  const { t } = useTranslation('schools')
  const videos = useVideos('etablissement', e.id, 'galerie')
  const albums = useAlbums(e.id)
  const medias = useMedias(e.id)
  const [vue, setVue] = useState<number | null>(null)
  // Une seule visionneuse pour tout : vidéos, albums, médias ajoutés, dans l'ordre affiché.
  const elements: MediaVisionneuse[] = [
    ...videos.map((v) => ({ src: v.src, poster: v.poster, video: true, alt: v.titre })),
    ...albums.map((a) => ({ src: a.image, alt: a.nom })),
    ...medias.map((m) => ({ src: m.src, alt: e.nom, video: m.video })),
  ]
  return (
    <Carte>
      <TitreCarte>{t('fiche.galerie.titre')}</TitreCarte>
      <p className="text-sm text-muted-foreground">{t('fiche.galerie.intro')}</p>
      {elements.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">{t('fiche.galerie.vide')}</p>
      ) : (
        <>
          <b className="text-sm text-foreground">{t('fiche.galerie.nombre', { n: elements.length })}</b>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {videos.map((v, i) => (
              <TuileVideo key={v.id} poster={v.poster} titre={v.titre} onClick={() => setVue(i)} className="h-[150px]" />
            ))}
            {albums.map((a, i) => (
              <TuilePhoto key={a.id} src={a.image} nom={a.nom} onClick={() => setVue(videos.length + i)} className="h-[150px]" />
            ))}
            {medias.map((m, i) =>
              m.video ? (
                <TuileVideo key={m.id} poster="" titre={e.nom} onClick={() => setVue(videos.length + albums.length + i)} className="h-[150px]" />
              ) : (
                <TuilePhoto key={m.id} src={m.src} libelle={e.nom} onClick={() => setVue(videos.length + albums.length + i)} className="h-[150px]" />
              ),
            )}
          </div>
        </>
      )}
      <VisionneuseMedias medias={elements} index={vue} onClose={() => setVue(null)} />
    </Carte>
  )
}
