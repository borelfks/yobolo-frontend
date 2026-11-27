import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, FileText, Upload } from 'lucide-react'
import { Input, Label, Select } from '@/shared/components/forms/Fields'
import { AUTORITES, type AccordSaisi, type ErreursAccord } from '@/shared/utils/accords'
import { tailleFichier } from '@/shared/utils/fichiers'
import { cn } from '@/shared/utils/cn'

/**
 * Les champs d'un accord d'ouverture : autorité (ou « Autre » + son nom), numéro,
 * date de délivrance, date d'expiration (facultative) et le document de l'accord.
 * Création du compte école et Profil › Agrément & documents.
 */
export function ChampsAccord({
  valeur,
  onChange,
  erreurs = {},
  onVoir,
}: {
  valeur: AccordSaisi
  onChange: (v: AccordSaisi) => void
  erreurs?: ErreursAccord
  /** Ouvrir le document déjà joint (accord enregistré). */
  onVoir?: () => void
}) {
  const documentActuel = valeur.documentActuel
  const { t } = useTranslation('common', { keyPrefix: 'accords' })
  const id = useId()
  const maj = (champs: Partial<AccordSaisi>) => onChange({ ...valeur, ...champs })
  const erreur = (cle: keyof AccordSaisi) => erreurs[cle] && <p className="mt-1 text-xs font-medium text-rose-600">{erreurs[cle]}</p>
  const fichier = valeur.fichier
  return (
    <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
      <div>
        <Label htmlFor={`${id}-autorite`} required>{t('champs.autorite')}</Label>
        <Select id={`${id}-autorite`} value={valeur.autorite} onChange={(e) => maj({ autorite: e.target.value })} options={AUTORITES.map((a) => ({ value: a, label: t(`autorites.${a}`) }))} />
        {erreur('autorite')}
      </div>
      <div>
        <Label htmlFor={`${id}-numero`} required>{t('champs.numero')}</Label>
        <Input id={`${id}-numero`} value={valeur.numero} onChange={(e) => maj({ numero: e.target.value })} placeholder={t('champs.numeroExemple')} aria-invalid={!!erreurs.numero} />
        {erreur('numero')}
      </div>
      {valeur.autorite === 'Autre' && (
        <div className="sm:col-span-2">
          <Label htmlFor={`${id}-autre`} required>{t('champs.autre')}</Label>
          <Input id={`${id}-autre`} value={valeur.autre} onChange={(e) => maj({ autre: e.target.value })} placeholder={t('champs.autreExemple')} aria-invalid={!!erreurs.autre} />
          {erreur('autre')}
        </div>
      )}
      <div>
        <Label htmlFor={`${id}-delivre`} required>{t('champs.delivreLe')}</Label>
        <Input id={`${id}-delivre`} type="date" value={valeur.delivreLe} onChange={(e) => maj({ delivreLe: e.target.value })} aria-invalid={!!erreurs.delivreLe} />
        {erreur('delivreLe')}
      </div>
      <div>
        <Label htmlFor={`${id}-expire`}>{t('champs.expireLe')} <span className="font-normal text-muted">{t('champs.facultatif')}</span></Label>
        <Input id={`${id}-expire`} type="date" value={valeur.expireLe} onChange={(e) => maj({ expireLe: e.target.value })} aria-invalid={!!erreurs.expireLe} />
        {erreurs.expireLe ? erreur('expireLe') : <p className="mt-1 text-xs text-muted">{t('champs.expireAide')}</p>}
      </div>
      <div className="sm:col-span-2">
        <div className={cn('flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2.5', erreurs.fichier ? 'border-rose-300 bg-rose-50/40' : 'border-line bg-slate-50')}>
          <FileText className="size-6 shrink-0 text-brand-600" aria-hidden />
          <span className="min-w-[150px] flex-1">
            <b className="block text-sm text-navy-900">{t('champs.document')} <span className="text-rose-500">*</span></b>
            <span className="block truncate text-xs text-muted">{fichier ? `${fichier.name} · ${tailleFichier(fichier.size)}` : documentActuel ?? t('champs.formats')}</span>
          </span>
          {onVoir && documentActuel && !fichier && (
            <button type="button" onClick={onVoir} aria-label={t('champs.voir')} className="grid size-9 place-items-center rounded-full text-brand-600 hover:bg-white"><Eye className="size-5" /></button>
          )}
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-brand-200 bg-white px-4 text-sm font-semibold text-brand-700 hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-500">
            <Upload className="size-4" aria-hidden />
            {fichier || documentActuel ? t('champs.remplacer') : t('champs.importer')}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => { const f = e.target.files?.[0] ?? null; e.target.value = ''; if (f) maj({ fichier: f }) }} />
          </label>
        </div>
        {erreur('fichier')}
      </div>
    </div>
  )
}
