import { MoreHorizontal } from 'lucide-react'
import type { MouseEventHandler, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { dateHeureDuFil, dateRelativeDuFil } from '@/modules/communaute/accueil/accueilDates'
import { CLASSES_GESTE, type NatureDuFil, type TypeDePastille } from '@/modules/communaute/accueil/accueilFil'
import { Deroulant } from '@/modules/communaute/accueil/components/Deroulant'
import { Avatar } from '@/shared/ui/Avatar'
import { cn } from '@/shared/utils/cn'

/**
 * Les morceaux d'une carte du fil (repris d'ElementsDuFil de yibolo-client) :
 * la même tête, le même titre, le même pied pour une publication, une offre
 * ou une formation.
 */

const TEINTE_DE_PASTILLE: Record<TypeDePastille, string> = {
  consultant: 'bg-brand-50 text-brand-700',
  ecole: 'bg-brand-50 text-brand-600',
  entreprise: 'bg-teinte-violet text-violet',
  membre: 'bg-page text-navy-800',
}

/** Un élément du fil, en carte verticale : la grille du fil en pose deux ou trois côte à côte. */
export function ArticleDuFil({ children }: { children: ReactNode }) {
  return (
    <article className="group relative flex h-full flex-col gap-2.5 rounded-xl border border-line bg-white p-2.5 transition-shadow hover:shadow-md">
      {children}
    </article>
  )
}

interface EnTeteDuFilProps {
  nom: string
  photo?: string
  /** La page de l'auteur : sa photo et son nom y mènent. */
  vers?: string
  pastille: TypeDePastille
  nature: NatureDuFil
  /** Date ISO ; absente, la ligne ne montre que la nature. */
  date?: string
  menu?: ReactNode
}

/** Qui, quand et quoi : la même tête pour chaque élément du fil. */
export function EnTeteDuFil({ nom, photo, vers, pastille, nature, date, menu }: EnTeteDuFilProps) {
  const { t } = useTranslation('accueil')
  const avatar = <Avatar src={photo} name={nom} size={38} />

  return (
    <div className="relative z-10 flex items-start gap-2">
      {vers ? (
        <Link to={vers} tabIndex={-1} aria-hidden="true" className="shrink-0 rounded-full transition-opacity hover:opacity-85">
          {avatar}
        </Link>
      ) : (
        avatar
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-tight">
        <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
          {vers ? (
            <Link
              to={vers}
              title={nom}
              className="max-w-full min-w-0 truncate rounded text-xs font-bold text-navy-900 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
            >
              {nom}
            </Link>
          ) : (
            <span className="max-w-full min-w-0 truncate text-xs font-bold text-navy-900">{nom}</span>
          )}
          <span className={cn('shrink-0 rounded-sm px-1.5 py-px text-[0.625rem] font-semibold', TEINTE_DE_PASTILLE[pastille])}>
            {t(`badge.${pastille}`)}
          </span>
        </span>
        {/* Le fil ne contient que des publications : la date seule, sans « · Publication ». */}
        {date ? (
          <time dateTime={date} title={dateHeureDuFil(date)} className="truncate text-xs text-muted">
            {dateRelativeDuFil(date)}
          </time>
        ) : (
          <span className="truncate text-xs text-muted">{t(`nature.${nature}`)}</span>
        )}
      </div>

      {menu}
    </div>
  )
}

/** Le titre d'un élément : son lien couvre tout l'élément. */
export function TitreDuFil({ vers, onClick, children }: { vers: string; onClick?: MouseEventHandler<HTMLAnchorElement>; children: string }) {
  return (
    <h3 className="line-clamp-2 text-sm leading-snug font-bold text-navy-900">
      <Link to={vers} onClick={onClick} className="outline-none after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:underline">
        {children}
      </Link>
    </h3>
  )
}

export function ExtraitDuFil({ children }: { children: ReactNode }) {
  return <p className="line-clamp-2 text-xs leading-relaxed text-muted">{children}</p>
}

/** Le visuel en grand : il mène où mène le titre, sans second arrêt au clavier. */
export function VisuelDuFil({ vers, onClick, children }: { vers: string; onClick?: MouseEventHandler<HTMLAnchorElement>; children: ReactNode }) {
  return (
    <Link to={vers} onClick={onClick} tabIndex={-1} aria-hidden="true" className="relative z-10 block overflow-hidden rounded-lg bg-page transition-opacity hover:opacity-95">
      {children}
    </Link>
  )
}

/** Le bas de la carte, calé en pied : dans une rangée de la grille, les gestes s'alignent d'une carte à l'autre. */
export function PiedDuFil({ children }: { children: ReactNode }) {
  return <div className="mt-auto flex flex-col gap-1.5">{children}</div>
}

/** La ligne des chiffres, au-dessus du filet : ce que la carte a déjà suscité. */
export function ChiffresDuFil({ children }: { children: ReactNode }) {
  return <div className="relative z-10 flex min-h-[1.5rem] items-center gap-3 text-xs text-muted tabular-nums">{children}</div>
}

/** Les gestes sous le filet, répartis sur toute la largeur de la carte. */
export function GestesDuFil({ children }: { children: ReactNode }) {
  return <div className="relative z-10 -mx-0.5 -mb-1 flex items-center justify-between gap-0.5 border-t border-line pt-1">{children}</div>
}

interface GesteDuFilProps {
  icone: ReactNode
  libelle: string
  actif?: boolean
  couleurActive?: string
  onClick: () => void
  disabled?: boolean
  etiquette?: string
}

export function GesteDuFil({ icone, libelle, actif = false, couleurActive = 'text-brand-700', onClick, disabled, etiquette }: GesteDuFilProps) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      aria-label={etiquette}
      title={etiquette ?? libelle}
      disabled={disabled}
      onClick={onClick}
      className={cn(CLASSES_GESTE, 'disabled:opacity-60', actif ? couleurActive : 'text-muted hover:text-ink')}
    >
      {icone}
      <span className="truncate">{libelle}</span>
    </button>
  )
}

/** Un lien de pied d'élément : « Voir plus », « Voir l'offre », « Voir la formation ». */
export function LienDuPied({ vers, onClick, children }: { vers: string; onClick?: MouseEventHandler<HTMLAnchorElement>; children: ReactNode }) {
  return (
    <Link
      to={vers}
      onClick={onClick}
      className="relative z-10 ml-auto inline-flex min-h-9 shrink-0 items-center gap-1 rounded text-xs font-semibold text-brand-600 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
    >
      {children}
    </Link>
  )
}

/** Le menu « ⋯ » d'un élément, toujours visible. */
export function MenuDuFil({ children }: { children: (fermer: () => void) => ReactNode }) {
  const { t } = useTranslation('accueil')
  return (
    <Deroulant
      etiquette={t('actions.menu')}
      titre={t('actions.menu')}
      align="end"
      bouton={<MoreHorizontal className="size-4" aria-hidden="true" />}
      classesBouton="-mt-1.5 -mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-page hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none data-[state=open]:bg-page"
      classesPanneau="min-w-[12rem] p-1"
    >
      {children}
    </Deroulant>
  )
}

/** Une ligne du menu « ⋯ ». */
export function ChoixDuMenu({ onClick, danger, children }: { onClick: () => void; danger?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-page focus-visible:bg-page focus-visible:outline-none [&_svg]:size-4',
        danger ? 'text-rose-600' : 'text-ink',
      )}
    >
      {children}
    </button>
  )
}

/** Le filet entre deux groupes de lignes du menu « ⋯ ». */
export function SeparateurDuMenu() {
  return <span aria-hidden="true" className="my-1 h-px bg-line" />
}
