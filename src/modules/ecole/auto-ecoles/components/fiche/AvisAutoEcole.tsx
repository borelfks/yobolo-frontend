import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ThumbsUp } from 'lucide-react'
import { data } from '@/data'
import { useAvisAutoEcole, useRepartitionAutoEcole } from '@/data/hooks'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { ActionAvis, ArticleAvis, AucunAvis, EnteteListeAvis, ReponseAvis, ResumeAvis } from '@/modules/ecole/avis/components/BlocsAvis'
import { ModaleAvis } from '@/modules/ecole/avis/components/ModaleAvis'
import { Button } from '@/shared/shadcn/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/shadcn/dialog'
import { Label } from '@/shared/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/shared/shadcn/radio-group'
import type { AutoEcole, AvisAutoEcole as Avis } from '@/shared/types'
import { partager } from '@/shared/utils/liens'
import { load, save } from '@/shared/utils/storage'
import { Carte } from '@/modules/ecole/etablissements/components/Bases'
import { MenuTri } from '@/modules/ecole/etablissements/components/liste/Resultats'
import { reviewDate } from '@/modules/ecole/auto-ecoles/autoEcoleFiche'

type Tri = 'recents' | 'mieuxNotes'
const MOTIFS = ['inappropriate', 'false', 'spam', 'other'] as const
type Motif = (typeof MOTIFS)[number]

/**
 * Onglet « Avis » de la fiche d'une auto-école : résumé des notes et
 * « Donner mon avis », puis les avis des apprenants, triés. Chaque avis :
 * Utile (compté dans la base), Partager (lien copié), Signaler (motif,
 * enregistré dans `signalementsAvis`).
 */
export function AvisAutoEcole({ a }: { a: AutoEcole }) {
  const { t } = useTranslation('driving-schools')
  const avis = useAvisAutoEcole(a.id)
  const repartition = useRepartitionAutoEcole(a.id)
  const [tri, setTri] = useState<Tri>('recents')
  const [donner, setDonner] = useState(false)
  const [signaler, setSignaler] = useState<string | null>(null)
  const [signales, setSignales] = useState<string[]>([])
  const liste = tri === 'mieuxNotes' ? [...avis].sort((x, y) => y.note - x.note) : avis
  return (
    <Carte>
      {avis.length === 0 ? (
        <AucunAvis texte={t('profile.reviews.invitation')} onDonner={() => setDonner(true)} />
      ) : (
        <>
          <ResumeAvis note={a.note} nombre={t('profile.reviews.basedOn', { count: avis.length })} repartition={repartition} onDonner={() => setDonner(true)} />
          <EnteteListeAvis
            titre={t('profile.reviews.title', { count: avis.length })}
            tri={
              <MenuTri<Tri>
                libelle={t('profile.reviews.trier')}
                valeur={tri}
                onChange={setTri}
                options={[
                  { valeur: 'recents', libelle: t('profile.reviews.mostRecent') },
                  { valeur: 'mieuxNotes', libelle: t('profile.reviews.bestRated') },
                ]}
              />
            }
          />
          {liste.map((r) => (
            <LigneAvis key={r.id} r={r} nom={a.nom} signale={signales.includes(r.id)} onSignaler={() => setSignaler(r.id)} />
          ))}
        </>
      )}
      <ModaleAvis genre="auto-ecole" id={a.id} nom={a.nom} open={donner} onClose={() => setDonner(false)} />
      <FenetreSignalement
        avisId={signaler}
        onClose={() => setSignaler(null)}
        onSignale={(id) => setSignales((s) => [...s, id])}
      />
    </Carte>
  )
}

/** Un avis d'auto-école : Utile, Partager, Signaler ; puis la réponse de l'auto-école, s'il y en a une. */
function LigneAvis({ r, nom, signale, onSignaler }: { r: Avis; nom: string; signale: boolean; onSignaler: () => void }) {
  const { t } = useTranslation('driving-schools')
  // « Utile » : le nombre est dans la base ; ce navigateur retient qu'il a déjà voté.
  const [utile, setUtile] = useState(() => load<string[]>('avis-utiles', []).includes(r.id))
  const [copie, setCopie] = useState(false)
  const nombre = r.utile ?? 0
  const voter = async () => {
    const votes = load<string[]>('avis-utiles', [])
    const suivant = !utile
    setUtile(suivant)
    save('avis-utiles', suivant ? [...votes, r.id] : votes.filter((x) => x !== r.id))
    await data.update('avisAutoEcoles', r.id, { utile: Math.max(0, nombre + (suivant ? 1 : -1)) })
  }
  const partagerAvis = async () => {
    try {
      if ((await partager(nom, window.location.href)) === 'copie') {
        setCopie(true)
        toast.success(t('profile.reviews.linkCopied'))
      }
    } catch {
      toast.error(t('profile.reviews.partageImpossible'))
    }
  }
  return (
    <ArticleAvis
      avatar={r.avatar}
      nom={r.nom}
      meta={reviewDate(t, r.date)}
      note={r.note}
      texte={r.texte}
      actions={
        <>
          <ActionAvis actif={utile} aria-pressed={utile} onClick={() => void voter()}>
            <ThumbsUp className="size-4" fill={utile ? 'currentColor' : 'none'} aria-hidden />
            {t('profile.reviews.utile')}
            {nombre > 0 && ` (${nombre})`}
          </ActionAvis>
          <ActionAvis actif={copie} onClick={() => void partagerAvis()}>
            {copie ? t('profile.reviews.linkCopied') : t('profile.reviews.share')}
          </ActionAvis>
          <ActionAvis actif={signale} ton="destructive" onClick={signale ? () => undefined : onSignaler}>
            {signale ? t('profile.reviews.signale') : t('profile.reviews.report')}
          </ActionAvis>
        </>
      }
    >
      {r.reponse && <ReponseAvis titre={t('profile.reviews.replyFrom')} date={r.reponse.le} texte={r.reponse.texte} />}
    </ArticleAvis>
  )
}

/** « Signaler cet avis » : le motif, puis le signalement est enregistré pour YIBOLO. */
function FenetreSignalement({ avisId, onClose, onSignale }: { avisId: string | null; onClose: () => void; onSignale: (id: string) => void }) {
  const { t } = useTranslation('driving-schools')
  const { account } = useSession()
  const [motif, setMotif] = useState<Motif>('inappropriate')
  const [envoi, setEnvoi] = useState(false)
  const envoyer = async () => {
    if (!avisId) return
    setEnvoi(true)
    try {
      await data.create('signalementsAvis', { avisId, cible: 'auto-ecole', compteId: account?.id, motif, le: new Date().toISOString() }, 'signalement')
      onSignale(avisId)
      onClose()
      toast.success(t('profile.reviews.reported'))
    } finally {
      setEnvoi(false)
    }
  }
  return (
    <Dialog open={avisId !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{t('profile.reviews.reportTitle')}</DialogTitle>
          <DialogDescription>{t('profile.reviews.reportIntro')}</DialogDescription>
        </DialogHeader>
        <RadioGroup value={motif} onValueChange={(v) => setMotif(v as Motif)} className="gap-3">
          {MOTIFS.map((m) => (
            <div key={m} className="flex items-center gap-2.5">
              <RadioGroupItem id={`motif-${m}`} value={m} />
              <Label htmlFor={`motif-${m}`} className="font-normal">
                {t(`profile.reviews.motifs.${m}`)}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('profile.reviews.cancel')}
          </Button>
          <Button variant="destructive-solid" loading={envoi} onClick={() => void envoyer()}>
            {t('profile.reviews.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
