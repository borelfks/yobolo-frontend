import { createElement } from 'react'
import { useDomainesExpertise } from '@/data/hooks'
import { iconeDuDomaine, teinteDuDomaine } from '@/modules/communaute/accueil/accueilDomaines'
import { Img } from '@/shared/ui/Img'
import type { Publication } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

/**
 * Le visuel d'une publication (VisuelDePublication de yibolo-client) : sa
 * photo, ou, sans photo, son premier domaine — l'icône dans un rond blanc sur
 * la teinte du domaine, et son nom — jamais un cadre vide. `petit` : l'icône
 * seule (vignettes des publications similaires).
 */
export function VisuelPublication({ publication, className, petit = false }: { publication: Pick<Publication, 'image' | 'domaines'>; className?: string; petit?: boolean }) {
  const domaines = useDomainesExpertise()
  if (publication.image) return <Img src={publication.image} alt="" className={className} />
  const domaine = publication.domaines[0] ?? ''
  const nom = domaines.find((d) => d.id === domaine)?.nom
  return (
    <div aria-hidden="true" className={cn('flex flex-col items-center justify-center gap-2', teinteDuDomaine(domaine), className)}>
      <span className={cn('grid place-items-center rounded-full bg-white/80 shadow-sm', petit ? 'size-9' : 'size-14')}>
        {createElement(iconeDuDomaine(domaine), { className: petit ? 'size-5' : 'size-7', strokeWidth: 1.75 })}
      </span>
      {!petit && nom && <span className="px-3 text-center text-sm font-semibold">{nom}</span>}
    </div>
  )
}
