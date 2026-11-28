import { useId, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Trans, useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { isTypeSlug, slugOfType } from '@/modules/ecole/etablissements/schoolTypes'
import { data, newId } from '@/data'
import { useDiplomes, useNomenclature, useParametres } from '@/data/hooks'
import { ChargementDonnees } from '@/shared/blocs/ChargementDonnees'
import { Champ, ListeDeroulante } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/shared/shadcn/dialog'
import { Input } from '@/shared/shadcn/input'
import { Textarea } from '@/shared/shadcn/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'
import type { ElementNomenclature, Formation, StatutPublication } from '@/shared/types'
import { CartePro, EntetePro, PiedFormulaire, SquelettePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { ApercuFiche, ChoixNomenclature, ProgressionCreation, TitreNumerote, type Choix } from '@/modules/ecole/espace-pro/components/formations/FormulaireFormation'
import { useFormationsEcole } from '@/modules/ecole/espace-pro/hooks/useFormationsEcole'
import { IMAGE_FORMATION, NIVEAUX, PREFIXE_FORMATION_CREEE, codeFormation, modeCours, nomFormation, prefixer, sousCles, texte } from '@/modules/ecole/espace-pro/proData'
import { formaterDate } from '@/shared/utils/dates'

/** Valeurs fixes des listes : enregistrées telles quelles, affichées via une clé de traduction. */
const NIVEAUX_CLES = ['none', 'probatoire', 'bac', 'btsHnd', 'licence'] as const
type Niveau = (typeof NIVEAUX_CLES)[number]
const DUREES = ['3', '6', '9', '12', '18', '24', '36']
const MODES = ['Jour', 'Soir'] as const
const CLES_MODES = { Jour: 'jour', Soir: 'soir' } as const
const SANS_OPTION = 'aucune'
const DATE_LONGUE = 'longueSimple' as const

/** L'heure d'enregistrement (ISO). */
const maintenant = () => new Date().toISOString()

/** 4.2 Créer (ou modifier) une formation : nomenclature en cascade, nom composé, organisation, description. */
export function CreerFormation() {
  const { t } = useTranslation('pro', { keyPrefix: 'creer' })
  const { id } = useParams({ strict: false })
  const titre = id ? t('titreModifier') : t('titre')
  return (
    <div className="flex flex-col gap-2">
      <EntetePro miettes={[{ label: t('miette'), to: ROUTES.pro.trainings }, { label: titre }]} titre={titre} sousTitre={id ? t('sousTitreModifier') : t('sousTitre')} />
      <ChargementDonnees fallback={<SquelettePro cartes={3} colonne entete={false} />}>
        <FormulaireFormation key={id ?? 'nouvelle'} id={id} />
      </ChargementDonnees>
    </div>
  )
}

function FormulaireFormation({ id }: { id?: string }) {
  const { t } = useTranslation('pro', { keyPrefix: 'creer' })
  const { t: tp } = useTranslation('pro')
  const uid = useId()
  const navigate = useNavigate()
  const { ecole } = useMonEcole()
  const { lignes, toutes } = useFormationsEcole()
  const reglages = useParametres(ecole.id)
  const nomenclature = useNomenclature()
  const element = (eid?: string) => nomenclature.find((x) => x.id === eid)
  const enfants = (parentId: string | undefined, niveau: ElementNomenclature['niveau']) => nomenclature.filter((x) => x.niveau === niveau && (!parentId || x.parentId === parentId))

  // En édition : la fiche enregistrée, sinon la ligne du tableau « Gérer les formations ».
  const formation = id ? toutes.find((f) => f.id === id) : undefined
  const ligne = id ? lignes.find((f) => f.id === id) : undefined
  const edit = formation ?? (ligne ? { ...ligne, dureeMois: Number.parseInt(ligne.duree, 10) || 0, mode: 'Jour & Soir' as const, specialiteId: undefined, optionId: undefined } : null)
  // Champs que la fiche ne garde pas au format du formulaire : réglages `formation.<id>.*`.
  const saisis = id ? sousCles(`formation.${id}`, reglages) : {}
  // Les diplômes proposés : ceux du type de l'établissement.
  const slug = slugOfType(ecole.type)
  const diplomes = useDiplomes(isTypeSlug(slug) ? slug : 'autres').map((d) => d.nom)
  const specDepart = element(edit?.specialiteId)
  const filiereDepart = element(specDepart?.parentId)
  const domaineDepart = element(filiereDepart?.parentId)

  const [diplome, setDiplome] = useState(edit?.diplome ?? diplomes[0] ?? '')
  const [secteur, setSecteur] = useState(domaineDepart?.parentId ?? '')
  const [domaine, setDomaine] = useState(domaineDepart?.id ?? '')
  const [specialite, setSpecialite] = useState(specDepart?.id ?? '')
  const [option, setOption] = useState(edit?.optionId ?? '')
  const [niveau, setNiveau] = useState<Niveau>(() => NIVEAUX_CLES.find((l) => l === saisis.niveau) ?? 'bac')
  const [duree, setDuree] = useState(edit?.dureeMois ? String(edit.dureeMois) : '')
  const [modes, setModes] = useState<string[]>(() => {
    const m = saisis.modes
    if (typeof m === 'string') return m.split(',').filter((x) => x === 'Jour' || x === 'Soir')
    return edit ? (edit.mode === 'Jour & Soir' ? ['Jour', 'Soir'] : [edit.mode]) : ['Jour', 'Soir']
  })
  const [dateLimite, setDateLimite] = useState(() => texte(saisis, 'dateLimite', edit?.dateLimite ?? ''))
  const [description, setDescription] = useState(() => texte(saisis, 'description', formation?.description ?? ''))
  const [erreurs, setErreurs] = useState<Record<string, string>>({})
  const [apercu, setApercu] = useState(false)
  const [enCours, setEnCours] = useState<StatutPublication | null>(null)

  const choix = (xs: ElementNomenclature[]): Choix[] => xs.map((x) => ({ value: x.id, label: x.nom }))
  const options = specialite ? choix(enfants(specialite, 'option')) : []
  const spec = element(specialite)
  const filiere = element(spec?.parentId)
  const opt = element(option)
  // Le nom de la formation : composé à partir du diplôme, de la spécialité et de l'option.
  const nom = spec ? nomFormation(diplome, spec.nom, opt?.nom) : (edit?.nom ?? '')
  const chemin = [element(secteur)?.nom, element(domaine)?.nom, filiere?.nom].filter(Boolean).join(' › ')
  const faits = { general: !!diplome && !!spec, organisation: !!duree && modes.length > 0 && !!dateLimite, description: description.trim().length >= 10 }
  const libelleDuree = (d: string) => tp('commun.duree', { count: Number(d) })
  const apercuLignes: [string, string][] = [
    [t('apercu.diplome'), diplome || '—'],
    [t('apercu.filiere'), filiere?.nom ?? edit?.filiere ?? '—'],
    [t('apercu.duree'), duree ? libelleDuree(duree) : '—'],
    [t('apercu.cours'), modes.length ? MODES.filter((m) => modes.includes(m)).map((m) => t(`modes.${CLES_MODES[m]}`)).join(' & ') : '—'],
    [t('apercu.dateLimite'), dateLimite ? formaterDate(dateLimite, DATE_LONGUE) : '—'],
  ]

  /** Enregistre la fiche et sa ligne du tableau. « Publiée » tout de suite (pas de validation par YIBOLO) ; sinon « Brouillon ». */
  const enregistrer = async (statut: StatutPublication) => {
    const fid = id ?? newId(PREFIXE_FORMATION_CREEE)
    const code = edit?.code ?? codeFormation(nom, diplome)
    const nomFiliere = filiere?.nom ?? edit?.filiere ?? ''
    const fiche: Formation = {
      ...(formation ?? { etablissementId: ecole.id, image: IMAGE_FORMATION, rentree: '' }),
      id: fid,
      nom,
      code,
      filiere: nomFiliere,
      specialiteId: spec?.id,
      optionId: opt?.id,
      // Domaine de l'annuaire (filtre « Filière ») : celui des formations de la même filière.
      domaine: formation?.filiere === nomFiliere && formation.domaine ? formation.domaine : toutes.find((x) => x.filiere === nomFiliere && x.domaine)?.domaine,
      diplome,
      niveau: NIVEAUX[niveau],
      dureeMois: Number(duree),
      mode: modeCours(modes),
      dateLimite: dateLimite || undefined,
      statut,
      description,
      // Publiée pour la première fois : elle prend place dans le fil de l'accueil à cette date.
      publieeLe: statut === 'Publiée' ? (formation?.publieeLe ?? maintenant()) : formation?.publieeLe,
    }
    await data.put('formations', fiche)
    const champs = { nom, code, filiere: nomFiliere, diplome, duree: duree ? `${duree} mois` : '', dateLimite: dateLimite || undefined, statut }
    if (ligne) await data.update('formationsPro', fid, champs)
    else await data.create('formationsPro', { id: fid, etablissementId: ecole.id, ton: 'blue', rentree: '—', ...champs })
    await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, ...prefixer(`formation.${fid}`, { niveau, modes: modes.join(','), dateLimite, description }) } })
  }

  // Publier demande tout le formulaire ; un brouillon demande au moins la spécialité (le nom).
  const envoyer = async (statut: StatutPublication) => {
    const e: Record<string, string> = {}
    if (!spec && !nom) e.specialite = t('erreurs.specialite')
    if (statut === 'Publiée') {
      if (!diplome) e.diplome = t('erreurs.diplome')
      if (!spec) e.specialite = t('erreurs.specialite')
      if (!duree) e.duree = t('erreurs.duree')
      if (!dateLimite) e.dateLimite = t('erreurs.dateLimite')
      if (modes.length === 0) e.modes = t('erreurs.modes')
      if (description.trim().length < 10) e.description = t('erreurs.description')
    }
    setErreurs(e)
    if (Object.keys(e).length > 0) return void toast.error(t('erreurs.corriger'))
    setEnCours(statut)
    try {
      await enregistrer(statut)
      toast.success(t(statut === 'Publiée' ? 'publiee' : 'brouillon'))
      void navigate({ href: ROUTES.pro.trainings })
    } finally {
      setEnCours(null)
    }
  }

  const liste = (cle: string, label: string, requis: boolean, valeur: string, onChange: (v: string) => void, groupes: { titre?: string; choix: Choix[] }[], vide: string) => (
    <Champ id={`${uid}-${cle}`} label={label} requis={requis} erreur={erreurs[cle]}>
      <ChoixNomenclature id={`${uid}-${cle}`} valeur={valeur} onChange={onChange} groupes={groupes} vide={vide} invalide={!!erreurs[cle]} />
    </Champ>
  )

  return (
    <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-4">
      <div className="flex min-w-0 flex-col gap-2">
        <section aria-live="polite" className="flex flex-col gap-1.5 border-y border-border bg-card p-5 lg:rounded-lg lg:border">
          <span className="flex items-center gap-1.5 text-meta font-bold text-primary">
            <Sparkles className="size-4" aria-hidden />
            {t('nom.label')}
          </span>
          {spec || nom ? (
            <>
              <b className="text-xl leading-snug text-foreground">{nom}</b>
              {chemin && <span className="text-meta text-muted-foreground">{chemin}</span>}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">{t('nom.vide')}</span>
          )}
        </section>
        <CartePro titre={<TitreNumerote n={1}>{t('blocs.general')}</TitreNumerote>}>
          <div className="grid gap-3.5 lg:grid-cols-2">
            {liste('diplome', t('champs.diplome'), true, diplome, setDiplome, [{ choix: diplomes.map((d) => ({ value: d, label: d })) }], t('champs.choisir'))}
            {liste('secteur', t('champs.secteur'), true, secteur, (v) => (setSecteur(v), setDomaine(''), setSpecialite(''), setOption('')), [{ choix: choix(enfants(undefined, 'secteur')) }], t('champs.choisir'))}
            {liste('domaine', t('champs.domaine'), true, domaine, (v) => (setDomaine(v), setSpecialite(''), setOption('')), [{ choix: secteur ? choix(enfants(secteur, 'domaine')) : [] }], secteur ? t('champs.choisir') : t('champs.secteurDabord'))}
            {liste('specialite', t('champs.specialite'), true, specialite, (v) => (setSpecialite(v), setOption('')), domaine ? enfants(domaine, 'filiere').map((f) => ({ titre: t('champs.groupeFiliere', { nom: f.nom }), choix: choix(enfants(f.id, 'specialite')) })) : [], domaine ? t('champs.choisir') : t('champs.domaineDabord'))}
            {liste('option', t('champs.option'), false, option, (v) => setOption(v === SANS_OPTION ? '' : v), [{ choix: options.length ? [{ value: SANS_OPTION, label: t('champs.sansOption') }, ...options] : [] }], specialite && options.length === 0 ? t('champs.aucuneOption') : t('champs.facultatif'))}
            {liste('niveau', t('champs.niveau'), true, niveau, (v) => setNiveau(NIVEAUX_CLES.find((l) => l === v) ?? 'bac'), [{ choix: NIVEAUX_CLES.map((l) => ({ value: l, label: t(`niveaux.${l}`) })) }], t('champs.choisir'))}
          </div>
        </CartePro>
        <CartePro titre={<TitreNumerote n={2}>{t('blocs.organisation')}</TitreNumerote>}>
          <div className="grid gap-3.5 lg:grid-cols-2">
            <Champ id={`${uid}-duree`} label={t('champs.duree')} requis erreur={erreurs.duree}>
              <ListeDeroulante id={`${uid}-duree`} valeur={duree} onChange={setDuree} placeholder={t('champs.choisir')} invalide={!!erreurs.duree} options={DUREES.map((d) => ({ value: d, label: libelleDuree(d) }))} />
            </Champ>
            <Champ id={`${uid}-date`} label={t('champs.dateLimite')} requis erreur={erreurs.dateLimite}>
              <Input id={`${uid}-date`} type="date" value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} aria-invalid={!!erreurs.dateLimite || undefined} />
            </Champ>
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-bold text-foreground">
              {t('champs.typeCours')} <span className="text-destructive">*</span>
            </legend>
            <ToggleGroup type="multiple" variant="outline" size="lg" value={modes} onValueChange={setModes} className="flex-wrap">
              {MODES.map((m) => (
                <ToggleGroupItem key={m} value={m}>
                  {t(`modes.${CLES_MODES[m]}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {erreurs.modes && <p className="text-xs font-semibold text-destructive">{erreurs.modes}</p>}
          </fieldset>
        </CartePro>
        <CartePro titre={<TitreNumerote n={3}>{t('blocs.description')}</TitreNumerote>}>
          <Champ id={`${uid}-desc`} label={t('champs.presentation')} requis erreur={erreurs.description}>
            <Textarea id={`${uid}-desc`} rows={4} maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!erreurs.description || undefined} />
            <span className="text-right text-xs font-medium text-muted-foreground">{tp('profil.general.caracteres', { n: description.length, max: 300 })}</span>
          </Champ>
        </CartePro>
        <PiedFormulaire>
          <Button asChild variant="outline">
            <Lien to={ROUTES.pro.trainings}>{tp('commun.annuler')}</Lien>
          </Button>
          <Button variant="outline" onClick={() => setApercu(true)}>
            {t('actions.apercu')}
          </Button>
          <Button variant="secondary" loading={enCours === 'Brouillon'} onClick={() => void envoyer('Brouillon')}>
            {t('actions.brouillon')}
          </Button>
          <Button loading={enCours === 'Publiée'} onClick={() => void envoyer('Publiée')}>
            {t('actions.continuer')}
          </Button>
        </PiedFormulaire>
      </div>
      <aside className="flex min-w-0 flex-col gap-2 lg:sticky lg:top-[84px]">
        <ProgressionCreation
          etapes={[
            { nom: t('blocs.general'), faite: faits.general },
            { nom: t('blocs.organisation'), faite: faits.organisation },
            { nom: t('blocs.description'), faite: faits.description },
          ]}
        />
        <CartePro titre={t('bonASavoir.titre')} serree>
          <p className="text-sm text-foreground-soft">
            <Trans t={t} i18nKey="bonASavoir.requis" components={{ req: <span className="text-destructive" /> }} />
          </p>
          <p className="text-sm text-foreground-soft">{t('bonASavoir.exact')}</p>
          <p className="text-sm text-foreground-soft">{t('bonASavoir.publiee')}</p>
        </CartePro>
        <CartePro titre={t('apercu.titre')} serree>
          <ApercuFiche nom={nom || t('apercu.sansNom')} etablissement={ecole.nom} lignes={apercuLignes} />
        </CartePro>
      </aside>
      <Dialog open={apercu} onOpenChange={setApercu}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{t('apercu.titre')}</DialogTitle>
          <ApercuFiche nom={nom || t('apercu.sansNom')} etablissement={ecole.nom} lignes={apercuLignes} />
          {description && <p className="text-sm leading-relaxed text-foreground-soft">{description}</p>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
