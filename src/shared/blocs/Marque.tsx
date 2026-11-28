import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

/*
 * Le logo YIBOLO, exactement celui de la landing (`LandingLogo`, copie de
 * yibolo-client) : mêmes couleurs (jetons `marque`), même police (Geist),
 * mêmes tailles et espacements (la landing compte ses espacements en
 * 0,3 rem : écrits ici en rem pour tomber juste partout).
 */

/** Le symbole : carré bleu arrondi de 24 px, « Y » blanc dont les branches forment une coche. */
export function SymboleYibolo({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={cn('size-[1.5rem] shrink-0', className)}>
      <rect width="64" height="64" rx="14" className="fill-marque" />
      <path d="M16.5 20.5 30.5 32.5 47.5 16.5M30.5 32.5v15" fill="none" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white" />
    </svg>
  )
}

/**
 * Le logo (barre du haut, pied de page, connexion) : le symbole, « Yibolo »,
 * puis la `devise` dessous à partir de `sm`. `surFonce` : sur un fond sombre
 * (nom en blanc, devise en blanc à 85 %), comme la landing sur sa photo.
 * `suffixe` : ce qui suit le nom (le badge « Admin » de l'administration).
 */
export function MarqueYibolo({ surFonce = false, devise, suffixe, className }: { surFonce?: boolean; devise?: string; suffixe?: ReactNode; className?: string }) {
  return (
    <span className={cn('flex flex-col font-client', className)}>
      <span className="flex items-center gap-[0.6rem]">
        <SymboleYibolo />
        <span className={cn('text-base font-bold', surFonce ? 'text-white' : 'text-marque-texte')}>Yibolo</span>
        {suffixe}
      </span>
      {devise && <span className={cn('mt-[0.15rem] hidden text-caption3 font-medium whitespace-nowrap sm:block', surFonce ? 'text-white/85' : 'text-marque-devise')}>{devise}</span>}
    </span>
  )
}
