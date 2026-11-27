import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BookOpen, CalendarDays, CircleCheck, ClipboardList, Download, Eye, EyeOff, FileText, ListChecks, Pencil, Plus, Scale, Send, Trash2, Upload } from 'lucide-react'
import { proCard, proInput } from '@/features/pro/proStyles'
import { dateDuJour, decoupeFichier } from '@/features/pro/proData'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { data } from '@/data'
import { useDocuments, useFichiers } from '@/data/hooks'
import { IconTile, type KpiTone } from '@/shared/components/ui/Blocks'
import { MenuActions } from '@/shared/components/ui/MenuActions'
import { Modal } from '@/shared/components/ui/Modal'
import { Progress } from '@/shared/components/ui/Progress'
import { lireFichier, tailleFichier, telecharger, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'
import type { DocumentPro } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

type CleType = 'brochure' | 'admission' | 'pieces' | 'rules' | 'calendar'

/**
 * Les documents attendus, dans l'ordre de la liste. `categorie` : la valeur enregistrée
 * (données, en français). Un document d'une autre catégorie est un « autre document ».
 */
const ATTENDUS: { cle: CleType; categorie: string; icone: ReactNode; ton: KpiTone }[] = [
  { cle: 'brochure', categorie: 'Brochure', icone: <BookOpen />, ton: 'blue' },
  { cle: 'admission', categorie: 'Admission', icone: <ClipboardList />, ton: 'green' },
  { cle: 'pieces', categorie: 'Pièces à fournir', icone: <ListChecks />, ton: 'amber' },
  { cle: 'rules', categorie: 'Règlement', icone: <Scale />, ton: 'violet' },
  { cle: 'calendar', categorie: 'Calendrier', icone: <CalendarDays />, ton: 'orange' },
]
const AUTRE = 'Autre'
const FORMATS = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png'

/** Bouton « Importer / Remplacer » : un champ fichier caché. */
function ChoisirFichier({ libelle, principal, onFichier }: { libelle: string; principal?: boolean; onFichier: (f: File) => void }) {
  return (
    <label className={cn('inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold focus-within:ring-2 focus-within:ring-brand-500', principal ? 'bg-brand-600 text-white hover:bg-brand-700' : 'border border-brand-200 bg-white text-brand-700 hover:bg-brand-50')}>
      <Upload className="size-4" aria-hidden />
      {libelle}
      <input type="file" accept={FORMATS} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFichier(f) }} />
    </label>
  )
}

/**
 * Contenus et informations › Documents à télécharger : la liste des documents attendus
 * (brochure, dossier de candidature, pièces à fournir, règlement, calendrier), chacun
 * sur une ligne, déjà là ou à importer, avec la progression ; puis les autres documents.
 * Un document importé est publié tout de suite ; importer à nouveau le remplace.
 */
export function DocumentsATelecharger() {
  const { t } = useTranslation('pro', { keyPrefix: 'content.contents.documents' })
  const { ecole } = useMonEcole()
  const documents = useDocuments(ecole.id)
  const fichiers = useFichiers()
  const [apercu, setApercu] = useState<DocumentPro | null>(null)
  const [renomme, setRenomme] = useState<DocumentPro | null>(null)
  const [nouveauNom, setNouveauNom] = useState('')
  const docDe = (categorie: string) => documents.find((d) => d.categorie === categorie)
  const autres = documents.filter((d) => !ATTENDUS.some((a) => a.categorie === d.categorie))
  const faits = ATTENDUS.filter((a) => docDe(a.categorie)).length

  // Importer : un nouveau document, ou le remplacement de celui de ce type (il garde son état).
  const importer = async (categorie: string, fichier: File, remplace?: DocumentPro) => {
    if (fichier.size > TAILLE_MAX_DOCUMENT) return void toast.error(t('tooBig'))
    const { nom, type } = decoupeFichier(fichier.name)
    const f = await data.create('fichiers', { nom: fichier.name, type: fichier.type, taille: fichier.size, dataUrl: await lireFichier(fichier) }, 'fichier')
    const champs = { nom, type, taille: tailleFichier(fichier.size), date: dateDuJour(), fichierId: f.id }
    if (remplace) {
      await data.update('documents', remplace.id, champs)
      if (remplace.fichierId) await data.remove('fichiers', remplace.fichierId)
      toast.success(t('replaced', { name: nom }))
    } else {
      await data.create('documents', { etablissementId: ecole.id, categorie, statut: 'Publié', ...champs }, 'document')
      toast.success(t('added', { name: nom }))
    }
  }
  const supprimer = async (d: DocumentPro) => {
    await data.remove('documents', d.id)
    if (d.fichierId) await data.remove('fichiers', d.fichierId)
    toast.success(t('menu.deleted', { name: d.nom }))
  }
  // Ce qu'on peut faire d'un document : voir, publier / dépublier, renommer, supprimer.
  const actions = (d: DocumentPro) => (
    <>
      <button type="button" aria-label={t('view', { name: d.nom })} onClick={() => setApercu(d)} className="grid size-9 shrink-0 place-items-center rounded-full text-brand-600 hover:bg-brand-50"><Eye className="size-5" /></button>
      <MenuActions
        label={t('menu.actions', { name: d.nom })}
        actions={[
          d.statut === 'Publié'
            ? { label: t('menu.unpublish'), icon: <EyeOff />, onClick: async () => { await data.update('documents', d.id, { statut: 'Brouillon' }); toast.success(t('menu.unpublished', { name: d.nom })) } }
            : { label: t('menu.publish'), icon: <Send />, onClick: async () => { await data.update('documents', d.id, { statut: 'Publié' }); toast.success(t('menu.published', { name: d.nom })) } },
          { label: t('menu.rename'), icon: <Pencil />, onClick: () => (setRenomme(d), setNouveauNom(d.nom)) },
          { label: t('menu.delete'), icon: <Trash2 />, danger: true, onClick: () => supprimer(d) },
        ]}
      />
    </>
  )
  // Le fichier joint : format, nom, taille, date et état.
  const fichierJoint = (d: DocumentPro) => (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className={cn('grid h-9 w-8 shrink-0 place-items-center rounded-md text-[9.5px] font-extrabold text-white', d.type === 'PDF' ? 'bg-rose-600' : d.type.startsWith('XLS') ? 'bg-emerald-600' : 'bg-brand-600')}>{d.type.slice(0, 4)}</span>
      <span className="min-w-0 leading-tight">
        <b className="block truncate text-[14px] text-navy-900">{d.nom}</b>
        <span className="text-[12.5px] text-muted">
          {d.taille} · {d.date} · {d.statut === 'Publié' ? <span className="font-semibold text-emerald-700">{t('status.published')}</span> : <span className="font-semibold text-slate-600">{t('status.draft')}</span>}
        </span>
      </span>
    </span>
  )

  return (
    <div className={cn(proCard, 'p-4 sm:p-5')}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[20px] font-bold text-navy-900">{t('title')}</h2>
          <p className="text-[14px] text-muted">{t('intro')}</p>
        </div>
        <div className="w-full sm:w-64">
          <p className="mb-1 text-right text-[13.5px] font-semibold text-navy-900">{t('progress', { done: faits, total: ATTENDUS.length })}</p>
          <Progress value={(faits / ATTENDUS.length) * 100} />
        </div>
      </div>

      <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
        {ATTENDUS.map((a) => {
          const d = docDe(a.categorie)
          return (
            <li key={a.cle} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3.5">
              <span className="flex min-w-[220px] flex-1 items-center gap-3">
                <IconTile icon={a.icone} tone={a.ton} size="sm" />
                <span className="min-w-0 leading-tight">
                  <b className="flex items-center gap-1.5 text-[15px] text-navy-900">
                    {t(`types.${a.cle}.title`)}
                    {d && <CircleCheck className="size-4 shrink-0 fill-emerald-600 text-white" aria-label={t('present')} />}
                  </b>
                  <span className="text-[13px] text-muted">{t(`types.${a.cle}.desc`)}</span>
                </span>
              </span>
              {d ? (
                <span className="flex min-w-0 flex-1 basis-[300px] flex-wrap items-center justify-end gap-2">
                  <span className="min-w-[200px] flex-1">{fichierJoint(d)}</span>
                  <ChoisirFichier libelle={t('replace')} onFichier={(f) => void importer(a.categorie, f, d)} />
                  {actions(d)}
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <span className="text-[13px] text-muted">{t('missing')}</span>
                  <ChoisirFichier principal libelle={t('import')} onFichier={(f) => void importer(a.categorie, f)} />
                </span>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-5">
        <h3 className="text-[16px] font-bold text-navy-900">{t('others.title')}</h3>
        <p className="text-[13.5px] text-muted">{t('others.desc')}</p>
        {autres.length > 0 && (
          <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
            {autres.map((d) => (
              <li key={d.id} className="flex items-center gap-2 px-4 py-3">
                <span className="min-w-0 flex-1">{fichierJoint(d)}</span>
                {actions(d)}
              </li>
            ))}
          </ul>
        )}
        <label className="mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-dashed border-brand-300 px-4 text-[14px] font-semibold text-brand-700 hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-500">
          <Plus className="size-4" aria-hidden />
          {t('others.add')}
          <input type="file" accept={FORMATS} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void importer(AUTRE, f) }} />
        </label>
        <p className="mt-1.5 text-[12.5px] text-muted">{t('formats')}</p>
      </div>

      <Modal open={apercu !== null} onClose={() => setApercu(null)} title={apercu?.nom ?? ''} icon={<FileText className="mt-0.5 size-5 text-brand-600" />}>
        {apercu && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14.5px] text-navy-900">
            <dt className="font-semibold">{t('preview.type')}</dt>
            <dd>{(() => { const a = ATTENDUS.find((x) => x.categorie === apercu.categorie); return a ? t(`types.${a.cle}.title`) : t('others.one') })()}</dd>
            <dt className="font-semibold">{t('preview.format')}</dt><dd>{apercu.type}</dd>
            <dt className="font-semibold">{t('preview.size')}</dt><dd>{apercu.taille}</dd>
            <dt className="font-semibold">{t('preview.date')}</dt><dd>{apercu.date}</dd>
            <dt className="font-semibold">{t('preview.status')}</dt><dd>{apercu.statut === 'Publié' ? t('status.published') : t('status.draft')}</dd>
          </dl>
        )}
        {apercu && (() => {
          const f = fichiers.find((x) => x.id === apercu.fichierId)
          return f ? (
            <div className="mt-4 space-y-3">
              {f.type.startsWith('image/') && <img src={f.dataUrl} alt={apercu.nom} className="max-h-72 w-full rounded-xl object-contain" />}
              {f.type === 'application/pdf' && <iframe src={f.dataUrl} title={apercu.nom} className="h-72 w-full rounded-xl border border-line" />}
              <button type="button" onClick={() => telecharger(f.dataUrl, f.nom)} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 font-semibold text-white"><Download className="size-4" />{t('preview.download')}</button>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-[#f3f6fc] px-3 py-2.5 text-[13.5px] text-muted">{t('preview.noFile')}</p>
          )
        })()}
      </Modal>
      <Modal
        open={renomme !== null}
        onClose={() => setRenomme(null)}
        title={t('menu.rename')}
        footer={
          <>
            <button type="button" onClick={() => setRenomme(null)} className="h-10 rounded-full border-2 border-brand-600/60 px-5 font-semibold text-navy-800">{t('menu.cancel')}</button>
            <button
              type="button"
              disabled={!nouveauNom.trim()}
              onClick={async () => {
                if (!renomme) return
                await data.update('documents', renomme.id, { nom: nouveauNom.trim() })
                toast.success(t('menu.renamed', { name: nouveauNom.trim() }))
                setRenomme(null)
              }}
              className="h-10 rounded-full bg-brand-600 px-5 font-semibold text-white disabled:opacity-50"
            >
              {t('menu.save')}
            </button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1 block text-[14.5px] font-bold text-navy-900">{t('menu.newName')}</span>
          <input value={nouveauNom} onChange={(e) => setNouveauNom(e.target.value)} className={proInput} />
        </label>
      </Modal>
    </div>
  )
}
