import type { ReactNode } from 'react'
import { ChoixLangue } from './ChoixLangue'

/**
 * Le cadre de l'écran de connexion du canevas : à gauche, sur le fond des
 * pages, la barre (logo, lien de retour, langue) et le formulaire centré
 * (400 px) ; à droite (ordinateur), la photo sur toute la hauteur avec la
 * phrase de la marque et ses points cochés. Sur téléphone, seule la colonne
 * du formulaire reste. Partagé par le front et l'admin.
 */
export function CadreConnexion({
  logo,
  retour,
  photo,
  titre,
  points,
  children,
}: {
  logo: ReactNode
  /** Le lien de retour (« Retour à l'accueil », « Retour au site YIBOLO »). */
  retour: ReactNode
  /** Photo de droite (décorative). */
  photo: string
  titre: string
  points: string[]
  children: ReactNode
}) {
  return (
    <div className="app-cadre grid min-h-dvh grid-cols-[minmax(0,1fr)] bg-background text-foreground lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]">
      <main className="flex min-w-0 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-1.5 px-4 lg:px-12">
          <div className="mr-auto flex">{logo}</div>
          {retour}
          <ChoixLangue auth />
        </div>
        <div className="flex flex-1 flex-col justify-start px-5 pt-6 pb-12 lg:justify-center lg:px-12 lg:pt-8 lg:pb-14">
          <div className="mx-auto flex w-full max-w-[400px] flex-col">{children}</div>
        </div>
      </main>

      <aside className="hidden p-3 lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <div className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-lg p-12 text-white">
          <img src={photo} alt="" className="absolute inset-0 size-full object-cover object-[center_25%]" />
          <div className="absolute inset-0 bg-linear-to-t from-foreground/92 via-foreground/35 via-55% to-transparent" />
          <div className="relative flex max-w-[540px] flex-col gap-5">
            <h2 className="text-[34px] leading-[1.15] font-extrabold tracking-[-0.02em]">{titre}</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-ui text-white/92">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" aria-hidden className="mt-px size-5 shrink-0">
                    <circle cx="12" cy="12" r="10" className="fill-success-bright" />
                    <path d="m8 12 3 3 5-6" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="stroke-white" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}
