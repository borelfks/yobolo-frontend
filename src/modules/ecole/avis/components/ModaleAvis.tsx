import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ShieldCheck, Star } from 'lucide-react'
import { data } from '@/data'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { CaseACocher, Champ, Encadre } from '@/shared/blocs/Formulaire'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/shadcn/dialog'
import { Textarea } from '@/shared/shadcn/textarea'
import { cn } from '@/shared/utils/cn'

/** Libellé de chaque note, de 1 à 5 étoiles. */
const LIBELLES = ['decevant', 'moyen', 'bien', 'tresBien', 'excellent'] as const

type CleCritere =
  | 'qualiteFormation'
  | 'competenceMoniteurs'
  | 'organisationPlanning'
  | 'infrastructuresVehicules'
  | 'accueilAccompagnement'
  | 'qualiteEnseignements'
  | 'competenceEnseignants'
  | 'organisationAdministration'
  | 'infrastructuresEquipements'
  | 'insertionPro'

/** Les critères de chaque genre d'école, dans l'ordre de la table `criteresAvis`. */
const CRITERES: Record<'etablissement' | 'auto-ecole', CleCritere[]> = {
  'auto-ecole': ['qualiteFormation', 'competenceMoniteurs', 'organisationPlanning', 'infrastructuresVehicules', 'accueilAccompagnement'],
  etablissement: ['qualiteEnseignements', 'competenceEnseignants', 'organisationAdministration', 'infrastructuresEquipements', 'insertionPro'],
}

/** Valeurs préremplies de la maquette : 4/5, critères notés (5, 4, 4, 4, 5), case cochée. */
const NOTE_DEPART = 4
const NOTES_DEPART = [5, 4, 4, 4, 5]
const notesDepart = (criteres: CleCritere[]) => Object.fromEntries(criteres.map((c, i) => [c, NOTES_DEPART[i]])) as Partial<Record<CleCritere, number>>

/** Cinq étoiles à cliquer (note de 1 à 5). */
function SaisieEtoiles({ valeur, onChange, grande, libelle }: { valeur: number; onChange: (v: number) => void; grande?: boolean; libelle: string }) {
  const { t } = useTranslation('reviews')
  return (
    <span role="group" aria-label={libelle} className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Button key={i} type="button" variant="ghost" size={grande ? 'icon' : 'icon-sm'} aria-label={t('donnerAvis.etoiles', { count: i })} aria-pressed={i <= valeur} onClick={() => onChange(i)} className="hover:bg-transparent">
          <Star className={cn(grande ? 'size-7' : 'size-[18px]', i <= valeur ? 'fill-warning-bright text-warning-bright' : 'fill-track text-track')} aria-hidden />
        </Button>
      ))}
    </span>
  )
}

/**
 * « Donner mon avis », dans une fenêtre, sur la fiche d'un établissement ou
 * d'une auto-école : note globale (obligatoire), notes par critère
 * (facultatives), commentaire de 10 caractères au moins, confirmation d'avoir
 * suivi une formation. L'avis est enregistré : la note et le nombre d'avis,
 * calculés, suivent ; l'établissement est prévenu.
 */
export function ModaleAvis({ genre, id, nom, open, onClose }: { genre: 'etablissement' | 'auto-ecole'; id: string; nom: string; open: boolean; onClose: () => void }) {
  const { t } = useTranslation('reviews')
  const { account } = useSession()
  const ae = genre === 'auto-ecole'
  const criteres = CRITERES[genre]
  const [note, setNote] = useState(NOTE_DEPART)
  const [notes, setNotes] = useState(() => notesDepart(criteres))
  const [texte, setTexte] = useState('')
  const [confirme, setConfirme] = useState(true)
  const [envoi, setEnvoi] = useState(false)
  const [erreurs, setErreurs] = useState<{ note?: string; texte?: string; confirme?: string }>({})

  const fermer = () => {
    setNote(NOTE_DEPART)
    setNotes(notesDepart(criteres))
    setTexte('')
    setConfirme(true)
    setErreurs({})
    onClose()
  }

  const publier = async () => {
    const suite = {
      note: note === 0 ? t('donnerAvis.toasts.note') : undefined,
      texte: texte.trim().length < 10 ? t('donnerAvis.toasts.tropCourt') : undefined,
      confirme: !confirme ? (ae ? t('donnerAvis.toasts.confirmAutoEcole') : t('donnerAvis.toasts.confirmEcole')) : undefined,
    }
    setErreurs(suite)
    if (suite.note || suite.texte || suite.confirme) return
    setEnvoi(true)
    try {
      // Auteur : le compte connecté, sinon « Visiteur ». La date est un texte, comme les avis de départ.
      const auteur = { compteId: account?.id, nom: account?.name ?? t('donnerAvis.visiteur'), avatar: account?.avatar ?? '', date: t('donnerAvis.aLInstant'), note, texte: texte.trim() }
      if (ae) {
        await data.create('avisAutoEcoles', { ...auteur, autoEcoleId: id, criteres: criteres.map((c) => notes[c] ?? 0) }, 'avis')
      } else {
        await data.create('avisEtablissements', { ...auteur, etablissementId: id, role: 'Étudiant', utile: 0 }, 'avis')
        await data.create('notifications', { etablissementId: id, type: 'avis', titre: t('donnerAvis.notification.titre'), texte: t('donnerAvis.notification.texte', { name: auteur.nom, note }), date: t('donnerAvis.aLInstant'), lu: false }, 'notification')
      }
      toast.success(t('donnerAvis.toasts.merci'))
      fermer()
    } catch {
      toast.error(t('donnerAvis.toasts.echec'))
    } finally {
      setEnvoi(false)
    }
  }

  const libelle = note > 0 ? LIBELLES[note - 1] : undefined
  return (
    <Dialog open={open} onOpenChange={(o) => !o && fermer()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto sm:max-w-[560px]">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-extrabold text-foreground">{t('donnerAvis.title')}</DialogTitle>
          <DialogDescription>{nom}</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-foreground-soft">{t('donnerAvis.intro')}</p>
        <Champ id="avis-note" label={t('donnerAvis.noteGlobale')} requis erreur={erreurs.note}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <SaisieEtoiles
              grande
              libelle={t('donnerAvis.noteGlobale')}
              valeur={note}
              onChange={(v) => {
                setNote(v)
                setErreurs((x) => ({ ...x, note: undefined }))
              }}
            />
            {libelle && (
              <span className="rounded-sm bg-primary-tint px-2.5 py-1 text-sm text-primary-strong">
                <b>{note}/5</b> – {t(`donnerAvis.notes.${libelle}`)}
              </span>
            )}
          </div>
        </Champ>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-foreground">
            {t('donnerAvis.criteresTitre')} <span className="font-normal text-muted-foreground">{t('donnerAvis.facultatif')}</span>
          </p>
          {criteres.map((c) => (
            <div key={c} className="flex items-center gap-3 rounded-md bg-muted py-0.5 pr-1 pl-3 text-sm text-foreground">
              <span className="min-w-0 flex-1 leading-tight">{t(`donnerAvis.criteres.${c}`)}</span>
              <SaisieEtoiles libelle={t(`donnerAvis.criteres.${c}`)} valeur={notes[c] ?? 0} onChange={(v) => setNotes({ ...notes, [c]: v })} />
            </div>
          ))}
        </div>
        <Champ id="avis-commentaire" label={t('donnerAvis.commentaire')} requis erreur={erreurs.texte} aide={t('donnerAvis.compteur', { n: texte.length })}>
          <Textarea
            id="avis-commentaire"
            rows={4}
            maxLength={500}
            value={texte}
            aria-invalid={Boolean(erreurs.texte)}
            onChange={(ev) => {
              setTexte(ev.target.value)
              setErreurs((x) => ({ ...x, texte: undefined }))
            }}
            placeholder={ae ? t('donnerAvis.placeholder.autoEcole') : t('donnerAvis.placeholder.ecole')}
          />
        </Champ>
        <div className="flex flex-col gap-1">
          <CaseACocher
            checked={confirme}
            aria-invalid={Boolean(erreurs.confirme)}
            onCheckedChange={(v) => {
              setConfirme(v === true)
              setErreurs((x) => ({ ...x, confirme: undefined }))
            }}
            label={ae ? t('donnerAvis.confirm.autoEcole') : t('donnerAvis.confirm.ecole')}
            className="items-start font-medium [&>button]:mt-0.5"
          />
          {erreurs.confirme && (
            <p role="alert" className="text-meta font-semibold text-destructive">
              {erreurs.confirme}
            </p>
          )}
        </div>
        <Encadre ton="info" icone={ShieldCheck}>
          {t('donnerAvis.verifie.texte')}
        </Encadre>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={fermer}>
            {t('donnerAvis.annuler')}
          </Button>
          <Button loading={envoi} onClick={() => void publier()}>
            {t('donnerAvis.publier')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
