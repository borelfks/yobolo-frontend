import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Trans, useTranslation } from 'react-i18next'
import { Calendar, Check, ChartNoAxesColumnIncreasing, ChevronDown, CircleCheck, Eye, GraduationCap, Lightbulb, Save, X } from 'lucide-react'
import { ProHeader, ProLabel } from '@/features/pro/components/ProBlocks'
import { Img } from '@/shared/components/ui/Img'
import { Modal } from '@/shared/components/ui/Modal'
import { proCard, proInput } from '@/features/pro/proStyles'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { IMAGE_FORMATION, NIVEAUX, PREFIXE_FORMATION_CREEE, codeFormation, modeCours, montant, oui, prefixer, sousCles, texte } from '@/features/pro/proData'
import { data, newId } from '@/data'
import { useDiplomes, useFormations, useFormationsPro, useParametres } from '@/data/hooks'
import { isTypeSlug, slugOfType } from '@/features/schools/schoolTypes'
import type { Formation, FormationPro, StatutPublication } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { num } from '@/shared/utils/format'
import { ROUTES } from '@/shared/utils/routes'

/** Valeurs fixes des listes : enregistrées telles quelles, affichées via une clé de traduction. */
const LEVELS = ['none', 'probatoire', 'bac', 'btsHnd', 'licence'] as const
const PAYMENTS = ['several', 'once', 'twoInstalments', 'monthly'] as const
const DURATIONS = ['3', '6', '9', '12', '18', '24', '36']
const MODES = ['Jour', 'Soir', 'Alternance'] as const
const MODE_KEYS = { Jour: 'day', Soir: 'evening', Alternance: 'workStudy' } as const
const CHECKS = ['general', 'organisation', 'fees', 'description'] as const

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

function SelectBox<T extends string>({ value, options, onChange, icon, format = (v) => v }: { value: T; options: readonly T[]; onChange?: (v: T) => void; icon?: ReactNode; format?: (v: T) => string }) {
  return (
    <label className="relative flex h-10 items-center gap-2.5 rounded-lg border border-[#c9d4ea] bg-white px-3.5 text-[15px] text-navy-900">
      {icon}
      <span className="flex-1 truncate">{format(value)}</span>
      <ChevronDown className="size-5" />
      <select value={value} onChange={(e) => onChange?.(e.target.value as T)} className="absolute inset-0 cursor-pointer opacity-0">
        {options.map((o) => <option key={o} value={o}>{format(o)}</option>)}
      </select>
    </label>
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
  // En édition : la formation enregistrée, sinon la ligne du tableau « Gérer les formations » (img11).
  const formation = id ? toutes.find((f) => f.id === id) : undefined
  const ligne = id ? lignes.find((f) => f.id === id) : undefined
  // Une ligne sans fiche ne connaît ni le mode ni les frais : ces champs restent à remplir.
  const edit = formation ?? (ligne ? { ...ligne, dureeMois: Number.parseInt(ligne.duree, 10) || 0, mode: 'Jour & Soir' as const, fraisAn: 0 } : null)
  // Champs que la fiche ne garde pas (ou pas au format du formulaire) : réglages `formation.<id>.*`, sinon vides.
  const saisis = id ? sousCles(`formation.${id}`, reglages) : {}
  // Les diplômes proposés : ceux du type de l'établissement, dans la base.
  const slug = slugOfType(ecole.type)
  const diplomes = useDiplomes(isTypeSlug(slug) ? slug : 'autres').map((d) => d.nom)
  const [intitule, setIntitule] = useState(edit?.nom ?? '')
  const [diplome, setDiplome] = useState(edit?.diplome ?? diplomes[0] ?? '')
  const [filiere, setFiliere] = useState(edit?.filiere ?? '')
  const [niveau, setNiveau] = useState<(typeof LEVELS)[number]>(() => LEVELS.find((l) => l === saisis.niveau) ?? 'bac')
  const [duree, setDuree] = useState(edit?.dureeMois ? String(edit.dureeMois) : '')
  const [modes, setModes] = useState<string[]>(() => {
    const m = saisis.modes
    if (typeof m === 'string') return m ? m.split(',') : []
    return edit ? (edit.mode === 'Jour & Soir' ? ['Jour', 'Soir'] : [edit.mode]) : ['Jour', 'Soir']
  })
  // En édition, les champs reprennent la formation enregistrée (sinon, enregistrer sans les retaper les viderait).
  const [rentree, setRentree] = useState(() => texte(saisis, 'rentree', edit?.rentree ?? ''))
  const [inscription, setInscription] = useState(() => texte(saisis, 'inscription', formation?.fraisInscription ? num(formation.fraisInscription) : ''))
  const [scolarite, setScolarite] = useState(() => texte(saisis, 'scolarite', edit?.fraisAn ? num(edit.fraisAn) : ''))
  const [paiement, setPaiement] = useState<(typeof PAYMENTS)[number]>(() => PAYMENTS.find((p) => p === saisis.paiement) ?? 'several')
  const [description, setDescription] = useState(() => texte(saisis, 'description', formation?.description ?? ''))
  const [validation, setValidation] = useState(() => oui(saisis, 'validation', false))
  const [apercu, setApercu] = useState(false)
  /**
   * Enregistre la formation (fiche) et sa ligne du tableau « Gérer les formations ».
   * « Publiée » tout de suite (pas de validation par YIBOLO) ; sinon « Brouillon ».
   */
  const enregistrer = async (statut: StatutPublication) => {
    const fid = id ?? newId(PREFIXE_FORMATION_CREEE)
    const code = edit?.code ?? codeFormation(intitule, diplome)
    const fiche: Formation = {
      ...(formation ?? { etablissementId: ecole.id, image: IMAGE_FORMATION }),
      id: fid,
      nom: intitule,
      code,
      filiere,
      // Domaine de l'annuaire (filtre « Filière ») : celui des formations de la même filière.
      domaine: formation?.filiere === filiere && formation.domaine ? formation.domaine : toutes.find((x) => x.filiere === filiere && x.domaine)?.domaine,
      diplome,
      niveau: NIVEAUX[niveau],
      dureeMois: Number(duree),
      mode: modeCours(modes),
      fraisInscription: montant(inscription),
      fraisAn: montant(scolarite),
      rentree,
      statut,
      description,
      // Publiée pour la première fois : elle prend place dans le fil de l'accueil à cette date.
      publieeLe: statut === 'Publiée' ? (formation?.publieeLe ?? new Date().toISOString()) : formation?.publieeLe,
    }
    await data.put('formations', fiche)
    const champs = { nom: intitule, code, filiere, diplome, duree: `${duree} mois`, rentree, statut }
    if (ligne) await data.update('formationsPro', fid, champs)
    else await data.create('formationsPro', { id: fid, etablissementId: ecole.id, ton: 'blue', ...champs } satisfies FormationPro)
    await data.put('parametres', {
      id: ecole.id,
      valeurs: { ...reglages, ...prefixer(`formation.${fid}`, { niveau, modes: modes.join(','), rentree, inscription, scolarite, paiement, description, validation }) },
    })
  }
  const done: Record<(typeof CHECKS)[number], boolean> = {
    general: intitule.length > 2,
    organisation: modes.length > 0 && rentree !== '',
    fees: scolarite !== '',
    description: validation,
  }
  const checks = CHECKS.map((c) => ({ id: c, ok: done[c] }))
  const pct = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
  const filieres = [...new Set([filiere, ...(ecole.principales ?? ecole.filieres)])]
  const toggleMode = (m: string) => setModes(modes.includes(m) ? modes.filter((x) => x !== m) : [...modes, m])
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
          <Block n={1} title={t('creer.blocks.general')}>
            <div className="grid gap-x-5 gap-y-3 md:grid-cols-[1.25fr_1fr]">
              <label><ProLabel required>{t('creer.fields.title')}</ProLabel><input className={proInput} value={intitule} onChange={(e) => setIntitule(e.target.value)} /></label>
              <label><ProLabel required>{t('creer.fields.diploma')}</ProLabel><SelectBox value={diplome} options={diplomes} onChange={setDiplome} /></label>
              <label><ProLabel required>{t('creer.fields.field')}</ProLabel><SelectBox value={filiere} options={filieres} onChange={setFiliere} /></label>
              <label><ProLabel required>{t('creer.fields.level')}</ProLabel><SelectBox value={niveau} options={LEVELS} onChange={setNiveau} format={(v) => t(`creer.levels.${v}`)} /></label>
            </div>
          </Block>
          <Block n={2} title={t('creer.blocks.organisation')}>
            <div className="grid gap-x-5 gap-y-3 md:grid-cols-[0.75fr_1.2fr_0.85fr]">
              <label><ProLabel required>{t('creer.fields.duration')}</ProLabel><SelectBox value={duree} options={DURATIONS} onChange={setDuree} format={(v) => t('duration', { count: Number(v) })} /></label>
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
                <ProLabel required>{t('creer.fields.intake')}</ProLabel>
                <span className="relative block">
                  <Calendar className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-navy-800" />
                  <input className={cn(proInput, 'pl-10')} value={rentree} onChange={(e) => setRentree(e.target.value)} />
                </span>
              </label>
            </div>
          </Block>
          <Block n={3} title={t('creer.blocks.fees')}>
            <div className="grid gap-x-5 gap-y-3 md:grid-cols-3">
              <label><ProLabel required>{t('creer.fields.registrationFee')}</ProLabel><input className={proInput} value={inscription} onChange={(e) => setInscription(e.target.value)} /></label>
              <label><ProLabel required>{t('creer.fields.tuition')}</ProLabel><input className={proInput} value={scolarite} onChange={(e) => setScolarite(e.target.value)} /></label>
              <label><ProLabel>{t('creer.fields.payment')}</ProLabel><SelectBox value={paiement} options={PAYMENTS} onChange={setPaiement} format={(v) => t(`creer.payments.${v}`)} /></label>
            </div>
          </Block>
          <Block n={4} title={t('creer.blocks.description')}>
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
                <li key={c.id}>
                  <button type="button" onClick={() => c.id === 'description' && setValidation(!validation)} className="flex items-center gap-3 text-[15px] text-navy-900">
                    {c.ok ? <CircleCheck className="size-5 fill-emerald-600 text-white" /> : <span className="h-4 w-6 rounded-full border-2 border-brand-600" />}
                    {t(`creer.progress.${c.id}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-[#fff6e3] p-4">
            <h2 className="flex items-center gap-2.5 text-[20px] font-bold text-navy-900"><Lightbulb className="size-7 fill-amber-300 text-amber-500" />{t('creer.tips.title')}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-9 text-[14.5px] text-navy-900 marker:text-amber-500">
              <li><Trans t={t} i18nKey="creer.tips.required" components={{ red: <span className="text-rose-500" /> }} /></li>
              <li>{t('creer.tips.next')}</li>
            </ul>
          </div>
          <div className={cn(proCard, 'space-y-2.5 p-3')}>
            <button type="button" onClick={async () => { await enregistrer('Publiée'); toast.success(t('creer.actions.published')); navigate(ROUTES.pro.trainings) }} className={cn(side, 'bg-brand-600 text-white hover:bg-brand-700')}><Check className="size-5" strokeWidth={3} />{t('creer.actions.saveContinue')}</button>
            <button type="button" onClick={async () => { await enregistrer('Brouillon'); toast.success(t('creer.actions.draftSaved')); navigate(ROUTES.pro.trainings) }} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><Save className="size-5" />{t('creer.actions.saveDraft')}</button>
            <button type="button" onClick={() => setApercu(true)} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><Eye className="size-5" />{t('creer.actions.preview')}</button>
            <button type="button" onClick={() => navigate(ROUTES.pro.trainings)} className={cn(side, 'border-2 border-brand-600/60 text-navy-800 hover:bg-brand-50')}><X className="size-5" />{t('creer.actions.cancel')}</button>
          </div>
        </aside>
      </div>
      <Modal open={apercu} onClose={() => setApercu(false)} title={t('creer.preview.title')} size="lg" icon={<Eye className="mt-0.5 size-5 text-brand-600" />}>
        <div className="space-y-3">
          <Img src={formation?.image ?? IMAGE_FORMATION} alt="" className="h-40 w-full rounded-xl" />
          <p className="text-xl font-bold text-navy-900">{intitule || t('creer.preview.untitled')}</p>
          <p className="text-sm text-muted">{ecole.nom} · {ecole.ville} – {ecole.quartier}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14.5px] text-navy-900">
            <dt className="font-semibold">{t('creer.preview.diploma')}</dt><dd>{diplome || '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.field')}</dt><dd>{filiere || '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.duration')}</dt><dd>{duree ? t('creer.preview.months', { count: Number(duree) }) : '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.mode')}</dt><dd>{modes.length ? modes.join(' & ') : '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.intake')}</dt><dd>{rentree || '—'}</dd>
            <dt className="font-semibold">{t('creer.preview.fees')}</dt><dd>{scolarite ? `${scolarite} FCFA` : '—'}</dd>
          </dl>
          {description && <p className="text-sm leading-relaxed text-ink/85">{description}</p>}
        </div>
      </Modal>
    </div>
  )
}
