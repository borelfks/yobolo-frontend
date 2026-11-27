import { useState } from 'react'
import { cn } from '@/shared/utils/cn'

/** Image de démonstration, avec un dégradé si elle ne charge pas. */
export function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  // Sans adresse (photo pas encore choisie) ou en erreur : le même dégradé, sans requête inutile.
  if (failed || !src) {
    return <div role="img" aria-label={alt} className={cn('bg-gradient-to-br from-brand-200 via-brand-100 to-sky-100', className)} />
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn('object-cover', className)} />
}
