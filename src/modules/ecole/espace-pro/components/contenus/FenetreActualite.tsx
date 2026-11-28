import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ImagePlus } from 'lucide-react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useParametres } from '@/data/hooks'
import { Champ, ListeDeroulante } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/shared/shadcn/dialog'
import { Input } from '@/shared/shadcn/input'
import { Textarea } from '@/shared/shadcn/textarea'
import { lireImage, TAILLE_MAX_PHOTO } from '@/shared/utils/fichiers'
import type { Actualite } from '@/shared/types'
import { CATEGORIES_ACTUALITE, IMAGES_ACTUALITE, dateDuJour, prefixer, sousCles, texte } from '@/modules/ecole/espace-pro/proData'

type Categorie = keyof typeof CATEGORIES_ACTUALITE
const CATEGORIES = Object.keys(CATEGORIES_ACTUALITE) as Categorie[]

/**
 * La fenêtre « Nouvelle actualité » (Contenus › Actualités). Avec `actu`, elle
 * modifie l'actualité. « Brouillon » et « Publier » l'enregistrent avec ce
 * statut ; le texte et la date limite vont dans les réglages `actualite.<id>.*`.
 */
export function FenetreActualite({ open, onClose, actu }: { open: boolean; onClose: () => void; actu?: Actualite }) {
  const { t } = useTranslation('pro', { keyPrefix: 'contenus.fenetre' })
  const { t: tp } = useTranslation('pro')
  const id = useId()
  const { ecole } = useMonEcole()
  const reglages = useParametres(ecole.id)
  const saisis = actu ? sousCles(`actualite.${actu.id}`, reglages) : {}
  const [titre, setTitre] = useState(actu?.titre ?? '')
  const [categorie, setCategorie] = useState<Categorie>(CATEGORIES.find((c) => CATEGORIES_ACTUALITE[c] === actu?.categorie) ?? 'admission')
  const [limite, setLimite] = useState(texte(saisis, 'limite', ''))
  const [corps, setCorps] = useState(texte(saisis, 'texte', ''))
  const [image, setImage] = useState<{ nom: string; src: string } | null>(null)
  const [erreur, setErreur] = useState('')
  const [enCours, setEnCours] = useState(false)

  const choisirImage = async (f: File) => {
    if (f.size > TAILLE_MAX_PHOTO) return void toast.error(t('imageTropLourde'))
    setImage({ nom: f.name, src: await lireImage(f) })
  }
  const enregistrer = async (statut: Actualite['statut']) => {
    if (!titre.trim()) return void setErreur(t('titreRequis'))
    setEnCours(true)
    try {
      const champs = { titre: titre.trim(), categorie: CATEGORIES_ACTUALITE[categorie], statut, ...(image ? { image: image.src } : {}) }
      const aid = actu
        ? (await data.update('actualites', actu.id, champs))?.id
        : (await data.create('actualites', { image: IMAGES_ACTUALITE[categorie], ...champs, etablissementId: ecole.id, date: dateDuJour() }, 'actualite')).id
      if (aid && (limite || corps || saisis.texte !== undefined || saisis.limite !== undefined)) {
        await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, ...prefixer(`actualite.${aid}`, { limite, texte: corps }) } })
      }
      toast.success(t(statut === 'Publiée' ? 'publiee' : 'brouillonEnregistre'))
      if (!actu) {
        setTitre('')
        setLimite('')
        setCorps('')
      }
      setImage(null)
      setErreur('')
      onClose()
    } finally {
      setEnCours(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-3.5 overflow-y-auto rounded-xl p-5 sm:max-w-[560px]">
        <DialogTitle className="text-xl font-extrabold">{actu ? t('titreModifier') : t('titreNouvelle')}</DialogTitle>
        <Champ id={`${id}-titre`} label={t('titre')} requis erreur={erreur}>
          <Input id={`${id}-titre`} value={titre} onChange={(e) => (setTitre(e.target.value), setErreur(''))} placeholder={t('titreExemple')} aria-invalid={!!erreur || undefined} />
        </Champ>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Champ id={`${id}-cat`} label={t('categorie')}>
            <ListeDeroulante id={`${id}-cat`} valeur={categorie} onChange={(v) => setCategorie(CATEGORIES.find((c) => c === v) ?? 'admission')} options={CATEGORIES.map((c) => ({ value: c, label: tp(`contenus.categories.${c}`) }))} />
          </Champ>
          <Champ id={`${id}-limite`} label={t('dateLimite')} facultatif>
            <Input id={`${id}-limite`} type="date" value={limite} onChange={(e) => setLimite(e.target.value)} />
          </Champ>
        </div>
        <Champ id={`${id}-texte`} label={t('texte')}>
          <Textarea id={`${id}-texte`} rows={5} value={corps} onChange={(e) => setCorps(e.target.value)} />
        </Champ>
        <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed border-border-strong bg-surface-faint p-3.5 text-center focus-within:outline-2 focus-within:outline-ring hover:bg-row-hover">
          {image ? <img src={image.src} alt="" className="h-24 rounded-md object-cover" /> : <ImagePlus className="size-6 text-primary" aria-hidden />}
          <b className="text-sm text-foreground">{image ? image.nom : t('image')}</b>
          <span className="text-xs font-medium text-muted-foreground">{t('imageFormats')}</span>
          <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void choisirImage(f) }} />
        </label>
        <DialogFooter className="flex-row flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {tp('commun.annuler')}
          </Button>
          <Button variant="secondary" disabled={enCours} onClick={() => void enregistrer('Brouillon')}>
            {tp('commun.brouillon')}
          </Button>
          <Button loading={enCours} onClick={() => void enregistrer('Publiée')}>
            {tp('commun.publier')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
