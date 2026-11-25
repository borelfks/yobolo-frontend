import { Check, Link2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { IconeDeReseau, type Reseau } from '@/shared/components/ui/IconeDeReseau'
import { ROUTES } from '@/shared/utils/routes'

const CLASSES_LIGNE =
  'flex h-10 items-center gap-2.5 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink transition-colors hover:border-brand-600/30 hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none'

/**
 * « Partager » à côté d'un article (PartagePublication de yibolo-client) :
 * WhatsApp, Facebook, X, LinkedIn, et le lien à copier.
 */
export function PartagePublication({ titre, publicationId }: { titre: string; publicationId: string }) {
  const { t } = useTranslation('accueil')
  const [copie, setCopie] = useState(false)
  const adresse = `${window.location.origin}${ROUTES.publication(publicationId)}`
  const lien = encodeURIComponent(adresse)
  const texte = encodeURIComponent(titre)

  const reseaux: { nom: Reseau; url: string }[] = [
    { nom: 'WhatsApp', url: `https://wa.me/?text=${texte}%20${lien}` },
    { nom: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${lien}` },
    { nom: 'X', url: `https://x.com/intent/post?text=${texte}&url=${lien}` },
    { nom: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${lien}` },
  ]

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(adresse)
      setCopie(true)
      window.setTimeout(() => setCopie(false), 2000)
    } catch {
      toast.error(t('article.copieEchouee'))
    }
  }

  return (
    <section aria-label={t('article.partager')} className="flex flex-col gap-3">
      <h2 className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">{t('article.partager')}</h2>
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        {reseaux.map(({ nom, url }) => (
          <li key={nom}>
            <a href={url} target="_blank" rel="noopener noreferrer" className={CLASSES_LIGNE}>
              <IconeDeReseau reseau={nom} className="size-[1.125rem] shrink-0" />
              {nom}
            </a>
          </li>
        ))}
        <li className="col-span-2 lg:col-span-1">
          <button type="button" onClick={() => void copier()} className={`${CLASSES_LIGNE} w-full`}>
            {copie ? <Check className="size-4 text-emerald-600" aria-hidden="true" /> : <Link2 className="size-4 text-brand-600" aria-hidden="true" />}
            <span aria-live="polite">{copie ? t('article.lienCopie') : t('article.copierLeLien')}</span>
          </button>
        </li>
      </ul>
    </section>
  )
}
