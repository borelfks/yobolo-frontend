import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ProLabel } from '@/features/pro/components/ProBlocks'
import { proInput } from '@/features/pro/proStyles'
import { CATEGORIES_ACTUALITE, IMAGES_ACTUALITE, dateDuJour, prefixer, sousCles, texte } from '@/features/pro/proData'
import { Modal } from '@/shared/components/ui/Modal'
import { Select } from '@/shared/components/forms/Fields'
import { useMonEcole } from '@/features/auth/hooks/useSession'
import { data } from '@/data'
import { useParametres } from '@/data/hooks'
import type { Actualite } from '@/shared/types'

type Categorie = keyof typeof CATEGORIES_ACTUALITE
const CATEGORIES = Object.keys(CATEGORIES_ACTUALITE) as Categorie[]

/**
 * Fenêtre « Nouvelle actualité » (Contenus › Actualités). Avec `actu`, elle
 * modifie l'actualité (Voir ma publication › Modifier). « Brouillon » et
 * « Publier » enregistrent l'actualité avec ce statut.
 */
export function ActuModal({ open, onClose, actu }: { open: boolean; onClose: () => void; actu?: Actualite }) {
  const { t } = useTranslation('pro', { keyPrefix: 'content' })
  const { ecole } = useMonEcole()
  const reglages = useParametres(ecole.id)
  // Le texte et la date limite ne font pas partie de l'actualité enregistrée : réglages `actualite.<id>.*`.
  const saisis = actu ? sousCles(`actualite.${actu.id}`, reglages) : {}
  const [titre, setTitre] = useState(actu?.titre ?? '')
  const [categorie, setCategorie] = useState<Categorie>(CATEGORIES.find((c) => CATEGORIES_ACTUALITE[c] === actu?.categorie) ?? 'admission')
  const [limite, setLimite] = useState(texte(saisis, 'limite', ''))
  const [corps, setCorps] = useState(texte(saisis, 'texte', ''))

  const enregistrer = async (statut: Actualite['statut']) => {
    if (!titre.trim()) return void toast.error(t('contents.news.titleRequired'))
    const champs = { titre: titre.trim(), categorie: CATEGORIES_ACTUALITE[categorie], statut }
    const id = actu
      ? (await data.update('actualites', actu.id, champs))?.id
      : (await data.create('actualites', { ...champs, etablissementId: ecole.id, date: dateDuJour(), vues: 0, partages: 0, image: IMAGES_ACTUALITE[categorie] }, 'actualite')).id
    if (id && (limite || corps || saisis.texte !== undefined || saisis.limite !== undefined)) {
      await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, ...prefixer(`actualite.${id}`, { limite, texte: corps }) } })
    }
    toast.success(t(statut === 'Publiée' ? 'contents.news.published' : 'contents.news.draftSaved'))
    if (!actu) {
      setTitre('')
      setLimite('')
      setCorps('')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={actu ? t('publication.quickActions.edit') : t('contents.news.newNews')}
      footer={
        <>
          <button type="button" onClick={onClose} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">{t('contents.actions.cancel')}</button>
          <button type="button" onClick={() => void enregistrer('Brouillon')} className="h-11 rounded-full border-2 border-brand-600/60 px-6 font-semibold text-navy-800">{t('contents.actions.draft')}</button>
          <button type="button" onClick={() => void enregistrer('Publiée')} className="h-11 rounded-full bg-brand-600 px-6 font-semibold text-white">{t('contents.actions.publish')}</button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2"><ProLabel required>{t('contents.news.form.title')}</ProLabel><input className={proInput} placeholder={t('contents.news.form.titlePlaceholder')} value={titre} onChange={(e) => setTitre(e.target.value)} /></label>
        <label><ProLabel required>{t('contents.news.form.category')}</ProLabel><Select options={CATEGORIES.map((c) => ({ value: c, label: t(`contents.news.categories.${c}`) }))} value={categorie} onChange={(e) => setCategorie(CATEGORIES.find((c) => c === e.target.value) ?? 'admission')} className="h-10" /></label>
        <label><ProLabel>{t('contents.news.form.deadline')}</ProLabel><input type="date" className={proInput} value={limite} onChange={(e) => setLimite(e.target.value)} /></label>
        <label className="sm:col-span-2"><ProLabel required>{t('contents.news.form.text')}</ProLabel><textarea rows={4} value={corps} onChange={(e) => setCorps(e.target.value)} className="w-full rounded-lg border border-[#c9d4ea] px-3.5 py-2.5 text-[15px] outline-none" /></label>
      </div>
    </Modal>
  )
}
