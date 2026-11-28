import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BookOpen, CalendarDays, CircleCheck, ClipboardList, Download, ListChecks, Plus, Scale, Upload, type LucideIcon } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useDocuments, useFichiers } from '@/data/hooks'
import { Champ } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/shared/shadcn/dialog'
import { Input } from '@/shared/shadcn/input'
import { Progress } from '@/shared/shadcn/progress'
import { cn } from '@/shared/utils/cn'
import { lireFichier, tailleFichier, telecharger, TAILLE_MAX_DOCUMENT } from '@/shared/utils/fichiers'
import type { DocumentPro } from '@/shared/types'
import { CartePro, MenuPlus, Pastille, VignetteFichier, type TonPastille } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { dateDuJour, decoupeFichier } from '@/modules/ecole/espace-pro/proData'

type CleType = 'brochure' | 'admission' | 'pieces' | 'rules' | 'calendar'

/** Les documents attendus, dans l'ordre. `categorie` : la valeur enregistrée (données, en français). Une autre catégorie est un « autre document ». */
const ATTENDUS: { cle: CleType; categorie: string; icone: LucideIcon; ton: TonPastille }[] = [
  { cle: 'brochure', categorie: 'Brochure', icone: BookOpen, ton: 'bleu' },
  { cle: 'admission', categorie: 'Admission', icone: ClipboardList, ton: 'vert' },
  { cle: 'pieces', categorie: 'Pièces à fournir', icone: ListChecks, ton: 'ambre' },
  { cle: 'rules', categorie: 'Règlement', icone: Scale, ton: 'violet' },
  { cle: 'calendar', categorie: 'Calendrier', icone: CalendarDays, ton: 'orange' },
]
const AUTRE = 'Autre'
const FORMATS = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png'

/** Un bouton qui ouvre le choix d'un fichier (champ caché). */
function BoutonImporter({ label, principal, pointille, onFichier }: { label: string; principal?: boolean; pointille?: boolean; onFichier: (f: File) => void }) {
  return (
    <Button asChild variant={principal ? 'default' : 'secondary'} size={principal ? 'md' : 'sm'} className={cn('cursor-pointer focus-within:outline-2 focus-within:outline-ring', !principal && 'h-[34px] text-meta', pointille && 'h-[38px] self-start border-dashed text-sm')}>
      <label>
        {pointille ? <Plus aria-hidden /> : <Upload aria-hidden />}
        {label}
        <input type="file" accept={FORMATS} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFichier(f) }} />
      </label>
    </Button>
  )
}

/**
 * Contenus › Documents à télécharger : une ligne par document attendu (déjà là
 * ou à importer), la progression, puis les autres documents. Un document
 * importé est publié tout de suite ; importer à nouveau le remplace.
 */
export function Documents() {
  const { t } = useTranslation('pro', { keyPrefix: 'contenus.documents' })
  const { t: tp } = useTranslation('pro')
  const id = useId()
  const { ecole } = useMonEcole()
  const documents = useDocuments(ecole.id)
  const fichiers = useFichiers()
  const [apercu, setApercu] = useState<DocumentPro | null>(null)
  const [renomme, setRenomme] = useState<DocumentPro | null>(null)
  const [nouveauNom, setNouveauNom] = useState('')
  const docDe = (categorie: string) => documents.find((d) => d.categorie === categorie)
  const autres = documents.filter((d) => !ATTENDUS.some((a) => a.categorie === d.categorie))
  const faits = ATTENDUS.filter((a) => docDe(a.categorie)).length

  const importer = async (categorie: string, fichier: File, remplace?: DocumentPro) => {
    if (fichier.size > TAILLE_MAX_DOCUMENT) return void toast.error(t('tropLourd'))
    const { nom, type } = decoupeFichier(fichier.name)
    const f = await data.create('fichiers', { nom: fichier.name, type: fichier.type, taille: fichier.size, dataUrl: await lireFichier(fichier) }, 'fichier')
    const champs = { nom, type, taille: tailleFichier(fichier.size), date: dateDuJour(), fichierId: f.id }
    if (remplace) {
      await data.update('documents', remplace.id, champs)
      if (remplace.fichierId) await data.remove('fichiers', remplace.fichierId)
      toast.success(t('remplace', { name: nom }))
    } else {
      await data.create('documents', { etablissementId: ecole.id, categorie, statut: 'Publié', ...champs }, 'document')
      toast.success(t('ajoute', { name: nom }))
    }
  }
  const supprimer = async (d: DocumentPro) => {
    await data.remove('documents', d.id)
    if (d.fichierId) await data.remove('fichiers', d.fichierId)
    toast.success(t('supprime', { name: d.nom }))
  }
  const changerStatut = async (d: DocumentPro, statut: 'Publié' | 'Brouillon') => {
    await data.update('documents', d.id, { statut })
    toast.success(t(statut === 'Publié' ? 'publie' : 'depublie', { name: d.nom }))
  }
  const renommer = async () => {
    if (!renomme || !nouveauNom.trim()) return
    await data.update('documents', renomme.id, { nom: nouveauNom.trim() })
    toast.success(t('renomme', { name: nouveauNom.trim() }))
    setRenomme(null)
  }

  // Le fichier joint (format, nom, taille, date, statut), « Voir » et le menu d'actions.
  const fichierJoint = (d: DocumentPro, remplacer?: () => React.ReactNode) => (
    <span className="flex flex-[1_1_320px] flex-wrap items-center justify-end gap-2">
      <span className="flex min-w-0 flex-[1_1_200px] items-center gap-2.5">
        <VignetteFichier format={d.type} />
        <span className="flex min-w-0 flex-col gap-0.5">
          <b className="truncate text-sm text-foreground">{d.nom}</b>
          <span className="text-xs font-medium text-muted-foreground">
            {d.taille} · {d.date} · <b className={d.statut === 'Publié' ? 'text-success' : 'text-muted-foreground'}>{tp(`commun.statuts.${d.statut === 'Publié' ? 'publie' : 'brouillon'}`)}</b>
          </span>
        </span>
      </span>
      {remplacer?.()}
      <Button variant="link" className="px-1.5" onClick={() => setApercu(d)} aria-label={t('voirAria', { name: d.nom })}>
        {tp('commun.voir')}
      </Button>
      <MenuPlus
        label={t('actionsAria', { name: d.nom })}
        actions={[
          d.statut === 'Publié' ? { label: t('depublier'), onSelect: () => void changerStatut(d, 'Brouillon') } : { label: tp('commun.publier'), onSelect: () => void changerStatut(d, 'Publié') },
          { label: t('renommer'), onSelect: () => (setRenomme(d), setNouveauNom(d.nom)) },
          { label: tp('commun.supprimer'), danger: true, onSelect: () => void supprimer(d) },
        ]}
      />
    </span>
  )
  const fichierApercu = apercu ? fichiers.find((x) => x.id === apercu.fichierId) : undefined

  return (
    <CartePro>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-0.5">
          <h2 className="text-lg font-extrabold text-foreground">{t('titre')}</h2>
          <p className="text-sm text-muted-foreground">{t('intro')}</p>
        </div>
        <div className="flex flex-[0_1_240px] flex-col gap-1.5">
          <b className="text-right text-meta text-foreground">{t('progression', { faits, total: ATTENDUS.length })}</b>
          <Progress value={(faits / ATTENDUS.length) * 100} aria-label={t('progression', { faits, total: ATTENDUS.length })} className="**:data-[slot=progress-indicator]:bg-primary" />
        </div>
      </div>
      <ul className="rounded-xl border border-border">
        {ATTENDUS.map((a, i) => {
          const d = docDe(a.categorie)
          return (
            <li key={a.cle} className={cn('flex flex-wrap items-center gap-x-4 gap-y-2.5 px-4 py-3.5', i > 0 && 'border-t border-border')}>
              <span className="flex min-w-0 flex-[1_1_240px] items-center gap-3">
                <Pastille icone={a.icone} ton={a.ton} carree />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <b className="flex items-center gap-1.5 text-ui text-foreground">
                    {t(`types.${a.cle}.titre`)}
                    {d && <CircleCheck className="size-4 shrink-0 fill-success text-card" aria-label={t('present')} />}
                  </b>
                  <span className="text-xs font-medium text-muted-foreground">{t(`types.${a.cle}.texte`)}</span>
                </span>
              </span>
              {d ? (
                fichierJoint(d, () => <BoutonImporter label={tp('commun.remplacer')} onFichier={(f) => void importer(a.categorie, f, d)} />)
              ) : (
                <span className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-muted-foreground">{t('manquant')}</span>
                  <BoutonImporter principal label={tp('commun.importer')} onFichier={(f) => void importer(a.categorie, f)} />
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-0.5">
          <b className="text-base text-foreground">{t('autres.titre')}</b>
          <span className="text-xs font-medium text-muted-foreground">{t('autres.texte')}</span>
        </div>
        {autres.length > 0 && (
          <ul className="rounded-xl border border-border">
            {autres.map((d, i) => (
              <li key={d.id} className={cn('flex flex-wrap items-center gap-2.5 px-4 py-3.5', i > 0 && 'border-t border-border')}>
                {fichierJoint(d)}
              </li>
            ))}
          </ul>
        )}
        <BoutonImporter pointille label={t('autres.ajouter')} onFichier={(f) => void importer(AUTRE, f)} />
        <span className="text-xs font-medium text-muted-foreground">{t('formats')}</span>
      </div>

      <Dialog open={apercu !== null} onOpenChange={(o) => !o && setApercu(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="pr-8">{apercu?.nom}</DialogTitle>
          {apercu && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm text-foreground">
              <dt className="text-muted-foreground">{t('apercu.type')}</dt>
              <dd className="font-semibold">{(() => { const a = ATTENDUS.find((x) => x.categorie === apercu.categorie); return a ? t(`types.${a.cle}.titre`) : t('autres.un') })()}</dd>
              <dt className="text-muted-foreground">{t('apercu.format')}</dt>
              <dd className="font-semibold">{apercu.type}</dd>
              <dt className="text-muted-foreground">{t('apercu.taille')}</dt>
              <dd className="font-semibold">{apercu.taille}</dd>
              <dt className="text-muted-foreground">{t('apercu.date')}</dt>
              <dd className="font-semibold">{apercu.date}</dd>
            </dl>
          )}
          {fichierApercu ? (
            <>
              {fichierApercu.type.startsWith('image/') && <img src={fichierApercu.dataUrl} alt={apercu?.nom ?? ''} className="max-h-72 w-full rounded-md object-contain" />}
              {fichierApercu.type === 'application/pdf' && <iframe src={fichierApercu.dataUrl} title={apercu?.nom} className="h-72 w-full rounded-md border border-border" />}
              <Button className="self-start" onClick={() => telecharger(fichierApercu.dataUrl, fichierApercu.nom)}>
                <Download aria-hidden />
                {t('apercu.telecharger')}
              </Button>
            </>
          ) : (
            <p className="rounded-md bg-muted px-3 py-2.5 text-meta text-muted-foreground">{t('apercu.sansFichier')}</p>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={renomme !== null} onOpenChange={(o) => !o && setRenomme(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{t('renommer')}</DialogTitle>
          <Champ id={`${id}-nom`} label={t('nouveauNom')}>
            <Input id={`${id}-nom`} value={nouveauNom} onChange={(e) => setNouveauNom(e.target.value)} />
          </Champ>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setRenomme(null)}>
              {tp('commun.annuler')}
            </Button>
            <Button disabled={!nouveauNom.trim()} onClick={() => void renommer()}>
              {tp('commun.enregistrer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CartePro>
  )
}
