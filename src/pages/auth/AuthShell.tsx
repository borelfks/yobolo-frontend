import type { ReactNode } from 'react'
import { CircleCheck } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { Img } from '@/components/ui/Feedback'

const points = ['Écoles et formations certifiées', 'Consultants et experts qualifiés', 'Offres d’emploi, stages et apprentissage', 'Évaluation et valorisation des compétences']

/** Écran de connexion (img1, écran 1) : panneau bleu avec photo, carte blanche à droite. */
export function AuthShell({ children, below }: { children: ReactNode; below?: ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-page p-4">
      <div className="relative w-full max-w-[1060px] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#1f55e6_0%,#1238a8_45%,#0a2a86_100%)] shadow-2xl shadow-navy-900/30">
        <Img src="/maquette/auth-photo.jpg" alt="" className="absolute bottom-0 left-0 hidden h-[58%] w-[56%] object-top md:block" />
        <div className="relative grid gap-8 p-6 md:grid-cols-[1fr_440px] md:p-10">
          <div className="text-white md:min-h-[620px]">
            <Logo light />
            <h1 className="mt-8 max-w-md text-[30px] leading-tight font-extrabold md:text-[36px]">
              La plateforme de formation, d’expertise et d’emploi en Afrique centrale
            </h1>
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[16px]">
                  <CircleCheck className="size-5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="self-center">
            {children}
            {below}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Carte centrée des écrans d'inscription (img1, écrans 2 à 6). */
export function AuthCard({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_top,#eef3ff,#f4f7fc_60%)] p-4">
      <div className="w-full max-w-[720px] rounded-[26px] border border-line bg-white p-6 shadow-xl shadow-navy-900/10 md:p-8">
        <div className="flex items-center justify-between">
          <Logo />
          {title && <p className="text-[22px] font-bold text-navy-900">{title}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
