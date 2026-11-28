import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { useCommentaires } from '@/data/hooks'
import { CHAMP_COMMENTAIRE } from '@/modules/communaute/accueil/accueilFil'
import { LigneCommentaire } from '@/modules/communaute/accueil/components/commentaires/LigneCommentaire'
import { SaisieCommentaire } from '@/modules/communaute/accueil/components/commentaires/SaisieCommentaire'
import { useSession } from '@/modules/compte/auth/hooks/useSession'
import { Button } from '@/shared/shadcn/button'

/** Nombre de commentaires montrés d'abord, puis à chaque « Voir plus de commentaires ». */
const PAR_TRANCHE = 10

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

/**
 * Les commentaires d'une publication ouverte (canevas) : la saisie au nom du
 * compte, « Les plus récents », puis les commentaires du plus récent au plus
 * ancien, chacun avec ses réponses. Enregistrés dans la table `commentaires`.
 */
export function CommentairesPublication({ publicationId }: { publicationId: string }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const tous = useCommentaires(publicationId)
  // Un commentaire supprimé sans réponse n'a plus rien à montrer.
  const premiers = tous.filter((c) => !c.parentId && (!c.supprime || tous.some((r) => r.parentId === c.id))).toSorted((a, b) => b.le.localeCompare(a.le))
  const [combien, setCombien] = useState(PAR_TRANCHE)

  const envoyer = async (texte: string) => {
    if (!account) return false
    try {
      await data.create('commentaires', { publicationId, compteId: account.id, auteur: account.name, avatar: account.avatar, texte, le: maintenant() }, 'com')
      toast.success(t('commentaires.publie'))
      return true
    } catch {
      toast.error(t('commentaires.erreurs.envoi'))
      return false
    }
  }

  return (
    <section id="commentaires" aria-label={t('commentaires.titre')} className="flex scroll-mt-24 flex-col gap-3 px-4 pt-2 pb-4">
      {account && (
        <SaisieCommentaire
          id={CHAMP_COMMENTAIRE}
          photo={account.avatar || undefined}
          nom={account.name}
          placeholder={t('commentaires.placeholder')}
          libelleEnvoi={t('commentaires.publier')}
          onEnvoyer={envoyer}
        />
      )}
      {premiers.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('commentaires.aucun')}</p>
      ) : (
        <>
          <span className="text-xs font-bold text-muted-foreground">{t('commentaires.plusRecents')}</span>
          <ul className="flex flex-col gap-3">
            {premiers.slice(0, combien).map((c) => (
              <LigneCommentaire key={c.id} commentaire={c} reponses={tous.filter((r) => r.parentId === c.id).toSorted((a, b) => a.le.localeCompare(b.le))} />
            ))}
          </ul>
        </>
      )}
      {premiers.length > combien && (
        <Button variant="link-muted" className="self-start font-bold" onClick={() => setCombien(combien + PAR_TRANCHE)}>
          {t('commentaires.voirPlus')}
        </Button>
      )}
    </section>
  )
}
