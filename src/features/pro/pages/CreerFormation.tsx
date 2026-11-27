import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Trans, useTranslation } from 'react-i18next'
import { Calendar, Check, ChartNoAxesColumnIncreasing, ChevronDown, CircleCheck, Eye, GraduationCap, Lightbulb, Save, Sparkles, X } from 'lucide-react'
import { ProHeader, ProLabel } from '@/features/pro/components/ProBlocks'
import { Img } from '@/shared/components/ui/Img'
import { Modal } from '@/shared/components/ui/Modal'
import { proCard, proInput } from '@/features/pro/proStyles'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { IMAGE_FORMATION, NIVEAUX, PREFIXE_FORMATION_CREEE, codeFormation, modeCours, nomFormation, prefixer, sousCles, texte } from '@/features/pro/proData'
import { data, newId } from '@/data'
import { useDiplomes, useFormations, useFormationsPro, useNomenclature, useParametres } from '@/data/hooks'
import { isTypeSlug, slugOfType } from '@/features/schools/schoolTypes'
import type { ElementNomenclature, Formation, FormationPro, StatutPublication } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { shortDate } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Valeurs fixes des listes : enregistrées telles quelles, affichées via une clé de traduction. */
const LEVELS = ['none', 'probatoire', 'bac', 'btsHnd', 'licence'] as const
const DURATIONS = ['3', '6', '9', '12', '18', '24', '36']
const MODES = ['Jour', 'Soir'] as const
const MODE_KEYS = { Jour: 'day', Soir: 'evening' } as const
const CHECKS = ['general', 'organisation', 'description'] as const
const DATE_LONGUE = { day: '2-digit', month: 'long', year: 'numeric' } as const

type Choix = { value: string; label: string }

/** L'heure d'enregistrement (ISO). */
const maintenant = () => new Date().toISOString()

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="border-b border-line px-5 py-4 last:border-0">
      <h2 className="mb-3 flex items-center gap-3 text-[20px] font-bold text-navy-900">
        <span className="grid size-8 place-items-center rounded-full bg-brand-600 text-[16px] text-white">{n}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}

/**
 * Une liste déroulante : la valeur choisie s'affiche dans le champ (en entier sur deux lignes au plus),
 * la vraie liste du navigateur s'ouvre au clic. `groupes` : options regroupées (spécialités par filière).
 */
function Liste({ id, value, onChange, choix, groupes, vide, disabled }: { id?: string; value: string; onChange: (v: string) => void; choix?: Choix[]; groupes?: { titre: string; choix: Choix[] }[]; vide: string; disabled?: boolean }) {
  const tous = choix ?? groupes?.flatMap((g) => g.choix) ?? []
  const libelle = tous.find((c) => c.value === value)?.label
  return (
    <span className={cn('relative flex min-h-10 items-center gap-2.5 rounded-lg border border-[#c9d4ea] bg-white px-3.5 py-1.5 text-[15px] focus-within:border-brand-500 focus-within:ring-3 focus-within:ring-brand-100', disabled && 'bg-slate-50')}>
      <span className={cn('line-clamp-2 flex-1 leading-snug', libelle ? 'text-navy-900' : 'text-ink/60')}>{libelle ?? vide}</span>
      <ChevronDown className="size-5 shrink-0" aria-hidden />
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed">
        <option value="">{vide}</option>
        {choix?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        {groupes?.map((g) => (
          <optgroup key={g.titre} label={g.titre}>
            {g.choix.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </optgroup>
        ))}
      </select>
    </span>
  )
}

export function CreerFormation() {
  const { t } = useTranslation('pro')
  const { id } = useParams()
  const navigate = useNavigate()
  const { ecole } = useMonEcole()
  const toutes = useFormations()
  const lignes = useFormationsPro(ecole.id)
  const reglages = useParametres(ecole.id)
  const nomenclature = useNomenclature()
  const element = (eid?: string) => nomenclature.find((x) => x.id === eid)
  const enfants = (parentId: string | undefined, niveau: ElementNomenclature['niveau']) => nomenclature.filter((x) => x.niveau === niveau && (!parentId || x.parentId === parentId))
  // En édition : la formation enregistrée, sinon la ligne du tableau « Gérer les formations » (img11).
  const formation = id ? toutes.find((f) => f.id === id) : undefined
  const ligne = id ? lignes.find((f) => f.id === id) : undefined
  // Une ligne sans fiche ne connaît pas le mode : ce champ reste à remplir.
  const edit = formation ?? (ligne ? { ...ligne, dureeMois: Number.parseInt(ligne.duree, 10) || 0, mode: 'Jour & Soir' as const, specialiteId: undefined, optionId: undefined, dateLimite: undefined } : null)
  // Champs que la fiche ne garde pas (ou pas au format du formulaire) : réglages `formation.<id>.*`, sinon vides.
  const saisis = id ? sousCles(`formation.${id}`, reglages) : {}
  // Les diplômes proposés : ceux du type de l'établissement, dans la base.
  const slug = slugOfType(ecole.type)
  const diplomes = useDiplomes(isTypeSlug(slug) ? slug : 'autres').map((d) => d.nom)
  // La nomenclature : en édition, on remonte de la spécialité au secteur.
  const specDepart = element(edit?.specialiteId)
  const filiereDepart = element(specDepart?.parentId)
  const domaineDepart = element(filiereDepart?.parentId)
  const [diplome, setDiplome] = useState(edit?.diplome ?? diplomes[0] ?? '')
  const [secteur, setSecteur] = useState(domaineDepart?.parentId ?? '')
  const [domaine, setDomaine] = useState(domaineDepart?.id ?? '')
  const [specialite, setSpecialite] = useState(specDepart?.id ?? '')
  const [option, setOption] = useState(edit?.optionId ?? '')
  const [niveau, setNiveau] = useState<(typeof LEVELS)[number]>(() => LEVELS.find((l) => l === saisis.niveau) ?? 'bac')
  const [duree, setDuree] = useState(edit?.dureeMois ? String(edit.dureeMois) : '')
  const [modes, setModes] = useState<string[]>(() => {
    const m = saisis.modes
    if (typeof m === 'string') return m ? m.split(',').filter((x) => x === 'Jour' || x === 'Soir') : []
    return edit ? (edit.mode === 'Jour & Soir' ? ['Jour', 'Soir'] : [edit.mode]) : ['Jour', 'Soir']
  })
  // En édition, les champs reprennent la formation enregistrée (sinon, enregistrer sans les retaper les viderait).
  const [dateLimite, setDateLimite] = useState(() => texte(saisis, 'dateLimite', edit?.dateLimite ?? ''))
  const [description, setDescription] = useState(() => texte(saisis, 'description', formation?.description ?? ''))
  const [apercu, setApercu] = useState(false)

  // Les listes, en cascade : secteur › domaine › spécialité (regroupées par filière) › option.
  const choix = (xs: ElementNomenclature[]) => xs.map((x) => ({ value: x.id, label: x.nom }))
  const secteurs = choix(enfants(undefined, 'secteur'))
  const domaines = secteur ? choix(enfants(secteur, 'domaine')) : []
  const groupesSpecialites = domaine ? enfants(domaine, 'filiere').map((f) => ({ titre: t('creer.fields.fieldGroup', { name: f.nom }), choix: choix(enfants(f.id, 'specialite')) })) : []
  const options = specialite ? choix(enfants(specialite, 'option')) : []
  const spec = element(specialite)
  const filiere = element(spec?.parentId)
  const opt = element(option)
  // Le nom de la formation : composé à partir du diplôme, de la spécialité et de l'option.
  const nom = spec ? nomFormation(diplome, spec.nom, opt?.nom) : (edit?.nom ?? '')
  const chemin = [element(secteur)?.nom, element(domaine)?.nom, filiere?.nom].filter(Boolean).join(' › ')

  /**
   * Enregistre la formation (fiche) et sa ligne du tableau « Gérer les formations ».
   * « Publiée » tout de suite (pas de validation par YIBOLO) ; sinon « Brouillon ».
   */
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
    const champs = { nom, code, filiere: nomFiliere, diplome, duree: `${duree} mois`, dateLimite: dateLimite || undefined, statut }
    if (ligne) await data.update('formationsPro', fid, champs)
    else await data.create('formationsPro', { id: fid, etablissementId: ecole.id, ton: 'blue', rentree: '—', ...champs } satisfies FormationPro)
    await data.put('parametres', {
      id: ecole.id,
      valeurs: { ...reglages, ...prefixer(`formation.${fid}`, { niveau, modes: modes.join(','), dateLimite, description }) },
    })
  }
  const done: Record<(typeof CHECKS)[number], boolean> = {
    general: !!diplome && !!spec,
    organisation: !!duree && modes.length > 0 && dateLimite !== '',
    description: description.trim().length >= 10,
  }
  const checks = CHECKS.map((c) => ({ id: c, ok: done[c] }))
  const pct = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
  const toggleMode = (m: string) => setModes(modes.includes(m) ? modes.filter((x) => x !== m) : [...modes, m])
  // Publier demande tout le formulaire ; un brouillon demande au moins la spécialité (le nom).
  const publier = async () => {
    if (checks.some((c) => !c.ok)) return void toast.error(t('creer.errors.incomplete'))
    await enregistrer('Publiée')
    toast.success(t('creer.actions.published'))
    navigate(ROUTES.pro.trainings)
  }
  const brouillon = async () => {
    if (!nom) return void toast.error(t('creer.errors.noSpeciality'))
    await enregistrer('Brouillon')
    toast.success(t('creer.actions.draftSaved'))
    navigate(ROUTES.pro.trainings)
  }
  const side = 'flex h-11 w-full items-center justify-center gap-2.5 rounded-full text-[16px] font-semibold'
  return (
    <div className="space-y-3.5">
      <ProHeader
        crumbs={[{ label: t('creer.crumb'), to: ROUTES.pro.trainings }, { label: edit ? t('creer.editTitle') : t('creer.createTitle') }]}
        icon={<GraduationCap />}
        title={edit ? t('creer.editTitle') : t('creer.createTitle')}
        subtitle={edit ? t('creer.editSubtitle') : t('creer.createSubtitle')}
        actions={<span />}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_336px]">
        <div className={proCard}>
          {/* Le nom affiché, composé à partir des choix */}
          <div className="border-b border-line px-5 py-4" aria-live="polite">
            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-brand-700"><Sparkles className="size-4" aria-hidden />{t('creer.name.label')}</p>
            {nom ? (
              <>
                <p className="mt-1 text-[20px] leading-snug font-bold text-navy-900">{nom}</p>
                {chemin && <p className="mt-0.5 text-[13.5px] text-muted">{chemin}</p>}
              </>
            ) : (
              <p className="mt-1 text-[15px] text-muted">{t('creer.name.empty')}</p>
            )}
          </div>
          <Block n={1} title={t('creer.blocks.general')}>
            <div className="grid gap-x-5 gap-y-3 md:grid-cols-2">
              <label><ProLabel required>{t('creer.fields.diploma')}</ProLabel><Liste value={diplome} onChange={setDiplome} choix={diplomes.map((d) => ({ value: d, label: d }))} vide={t('creer.fields.choose')} /></label>
              <label><ProLabel required>{t('creer.fields.sector')}</ProLabel><Liste value={secteur} onChange={(v) => (setSecteur(v), setDomaine(''), setSpecialite(''), setOption(''))} choix={secteurs} vide={t('creer.fields.choose')} /></label>
              <label><ProLabel required>{t('creer.fields.domain')}</ProLabel><Liste value={domaine} onChange={(v) => (setDomaine(v), setSpecialite(''), setOption(''))} choix={domaines} disabled={!secteur} vide={secteur ? t('creer.fields.choose') : t('creer.fields.sectorFirst')} /></label>
              <label><ProLabel required>{t('creer.fields.speciality')}</ProLabel><Liste value={specialite} onChange={(v) => (setSpecialite(v), setOption(''))} groupes={groupesSpecialites} disabled={!domaine} vide={domaine ? t('creer.fields.choose') : t('creer.fields.domainFirst')} /></label>
              <label><ProLabel>{t('creer.fields.option')}</ProLabel><Liste value={option} onChange={setOption} choix={options} disabled={options.length === 0} vide={specialite && options.length === 0 ? t('creer.fields.noOption') : t('creer.fields.optional')} /></label>
              <label><ProLabel required>{t('creer.fields.level')}</ProLabel><Liste value={niveau} onChange={(v) => setNiveau(LEVELS.find((l) => l === v) ?? 'bac')} choix={LEVELS.map((l) => ({ value: l, label: t(`creer.levels.${l}`) }))} vide={t('creer.fields.choose')} /></label>
            </div>
          </Block>
          <Block n={2} title={t('creer.blocks.organisation')}>
            <div className="grid gap-x-5 gap-y-3 md:grid-cols-[0.8fr_1fr_1.1fr]">
              <label><ProLabel required>{t('creer.fields.duration')}</ProLabel><Liste value={duree} onChange={setDuree} choix={DURATIONS.map((d) => ({ value: d, label: t('duration', { count: Number(d) }) }))} vide={t('creer.fields.choose')} /></label>
              <div>
                <ProLabel required>{t('creer.fields.mode')}</ProLabel>
                <div className="flex h-10 items-center gap-5 text-[15px] text-navy-900">
                  {MODES.map((m) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={modes.includes(m)} onChange={() => toggleMode(m)} className="size-5 accent-brand-600" />
                      {t(`creer.modes.${MODE_KEYS[m]}`)}
                    </label>
                  ))}
                </div>
              </div>
              <label>
                <ProLabel required>{t('creer.fields.deadline')}</ProLabel>
                <span className="relative block">
                  <Calendar className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" aria-hidden />
                  <input type="date" className={cn(proInput, 'pl-10')} value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} />
                </span>
              </label>
            </div>
          </Block>
          <Block n={3} title={t('creer.blocks.description')}>
            <label>
              <ProLabel required>{t('creer.fields.presentation')}</ProLabel>
              <span className="relative block">
                <textarea rows={3} maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-none rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-brand-500" />
              </span>
              <span className="mt-1 block text-right text-[13px] text-ink/70">{description.length} / 300</span>
            </label>
          </Block>
        </div>
        <aside className="space-y-4">
          <div className={cn(proCard, 'p-4')}>
            <h2 className="flex items-center gap-2.5 text-[20px] font-bold text-navy-900"><ChartNoAxesColumnIncreasing className="size-7 text-brand-600" />{t('creer.progress.title')}</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-[#e6ecf7]"><span className="block h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} /></span>
              <b className="text-[15px] text-navy-900">{t('creer.progress.percent', { pct })}</b>
            </div>
            <ul className="mt-3 space-y-2">
              {checks.map((c) => (
                <li key={c.id} className="flex items-center gap-3 text-[15px] text-navy-900">
                  {c.ok ? <CircleCheck className="size-5 fill-emerald-600 text-white" aria-label={t('creer.progress.done')} /> : <span className="size-5 rounded-full border-2 border-brand-600" aria-label={t('creer.progress.todo')} />}
                  {t(`creer.progress.${c.id}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-[#fff6e3] p-4">
            <h2 className="flex items-center gap-2.5 text-[20px] font-bold text-navy-900"><Lightbulb className="size-7 fill-amber-300 text-amber-500" />{t('creer.tips.title')}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-9 text-[14.5px] text-navy-900 marker:text-amber-500">
              <li><Trans t={t} i18nKey="creer.tips.required" components={{ red: <span className="text-rose-500" /> }} /></li>
              <li>{t('creer.tips.accurate')}</li>
              <li>{t('creer.tips.published')}</li>
            </ul>
          </div>
          <div className={cn(proCard, 'space-y-2.5 p-3')}>
            <button type="button" onClick={() => void publier()} className={cn(side, 'bg-brand-600 text-white hover:bg-brand-700')}><Check className="size-5" strokeWidth={3} />{t('creer.actions.saveContinue')}</button>
            <button type="button" onClick={() => void brouillon()} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><Save className="size-5" />{t('creer.actions.saveDraft')}</button>
            <button type="button" onClick={() => setApercu(true)} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><Eye className="size-5" />{t('creer.actions.preview')}</button>
            <button type="button" onClick={() => navigate(ROUTES.pro.trainings)} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><X className="size-5" />{t('creer.actions.cancel')}</button>
          </div>
        </aside>
      </div>
      <Modal open={apercu} onClose={() => setApercu(false)} title={t('creer.preview.title')} size="lg" icon={<Eye className="mt-0.5 size-5 text-brand-600" />}>
        <div className="space-y-3">
          <Img src={formation?.image ?? IMAGE_FORMATION} alt="" className="h-40 w-full rounded-xl" />
          <p className="text-xl font-bold text-navy-900">{nom || t('creer.preview.untitled')}</p>
          <p className="text-sm text-muted">{ecole.nom} · {ecole.ville} – {ecole.quartier}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14.5px] text-navy-900">
            <dt className="font-semibold">{t('creer.preview.diploma')}</dt><dd>{diplome || '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.field')}</dt><dd>{chemin || '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.duration')}</dt><dd>{duree ? t('creer.preview.months', { count: Number(duree) }) : '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.mode')}</dt><dd>{modes.length ? modes.join(' & ') : '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.deadline')}</dt><dd>{dateLimite ? shortDate(dateLimite, DATE_LONGUE) : '—'}</dd>
          </dl>
          {description && <p className="text-sm leading-relaxed text-ink/85">{description}</p>}
        </div>
      </Modal>
    </div>
  )
}
