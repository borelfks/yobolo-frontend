import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { data } from '@/data'
import { useCommentaires } from '@/data/hooks'
import { LigneCommentaire } from '@/features/accueil/components/commentaires/LigneCommentaire'
import { ZoneDeSaisie } from '@/features/accueil/components/commentaires/ZoneDeSaisie'
import { useSession } from '@/features/auth/hooks/useSession'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Button } from '@/shared/components/ui/Button'

/** Nombre de commentaires montrés d'abord, puis à chaque « Voir plus de commentaires ». */
const PAR_TRANCHE = 10

/** L'instant présent, en texte ISO (appelé hors du rendu). */
const maintenant = () => new Date().toISOString()

/**
 * Les commentaires d'une publication, sous l'article (FilDeCommentaires de
 * yibolo-client) : la pilule pour commenter en son nom, puis les commentaires
 * du plus ancien au plus récent, chacun avec ses réponses. Le titre visible
 * est porté par la page.
 */
export function FilDeCommentaires({ publicationId }: { publicationId: string }) {
  const { t } = useTranslation('accueil')
  const { account } = useSession()
  const tous = useCommentaires(publicationId).toSorted((a, b) => a.le.localeCompare(b.le))
  // Un commentaire supprimé sans réponse n'a plus rien à montrer.
  const premiers = tous.filter((c) => !c.parentId && (!c.supprime || tous.some((r) => r.parentId === c.id)))
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
    <div className="flex flex-col gap-4">
      {account && (
        <div className="flex gap-2">
          <Avatar src={account.avatar || undefined} name={account.name} size={32} className="mt-0.5 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <ZoneDeSaisie placeholder={t('commentaires.placeholder')} libelleEnvoi={t('commentaires.envoyer')} onEnvoyer={envoyer} />
            <p className="pl-3 text-[0.6875rem] text-muted">{t('commentaires.enSonNomPropre')}</p>
          </div>
        </div>
      )}

      {premiers.length === 0 ? (
        <p className="text-sm text-muted">{t('commentaires.aucun')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {premiers.slice(0, combien).map((un) => (
            <LigneCommentaire key={un.id} commentaire={un} reponses={tous.filter((r) => r.parentId === un.id)} />
          ))}
        </ul>
      )}

      {premiers.length > combien && (
        <Button variant="ghost" size="sm" className="self-start text-muted" onClick={() => setCombien(combien + PAR_TRANCHE)}>
          {t('commentaires.voirPlus')}
        </Button>
      )}
    </div>
  )
}
