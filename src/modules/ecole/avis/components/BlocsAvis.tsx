import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/avatar'
import { Button } from '@/shared/shadcn/button'
import { cn } from '@/shared/utils/cn'
import { initials, num } from '@/shared/utils/format'

/*
 * Les blocs d'avis du canevas, communs aux fiches d'établissement et
 * d'auto-école : résumé des notes, un avis, la réponse de l'école, l'état
 * « Pas encore d'avis ». Les chiffres viennent des avis enregistrés.
 */

/** Des étoiles pleines puis vides (« ★★★★☆ »), en ambre ; lues « 4 sur 5 ». */
export function Etoiles({ note, className }: { note: number; className?: string }) {
  const { t } = useTranslation('reviews')
  const pleines = Math.round(note)
  return (
    <span role="img" aria-label={t('blocs.surCinq', { note: num(note) })} className={cn('tracking-[1px] text-warning', className)}>
      {'★'.repeat(pleines)}
      {'☆'.repeat(5 - pleines)}
    </span>
  )
}

/**
 * Le résumé des notes : « Note globale », la moyenne en grand, les étoiles, le
 * nombre d'avis ; la répartition 5 → 1 étoiles en barres ; « Donner mon avis ».
 */
export function ResumeAvis({ note, nombre, repartition, onDonner }: { note: number; nombre: string; repartition: { etoiles: number; pct: number }[]; onDonner: () => void }) {
  const { t } = useTranslation('reviews')
  return (
    <div className="flex flex-wrap items-center gap-6 py-2">
      <div className="flex min-w-[110px] flex-col items-center gap-1">
        <span className="text-xs font-bold text-muted-foreground">{t('blocs.noteGlobale')}</span>
        <b className="text-[44px] leading-none font-bold text-foreground">{num(note)}</b>
        <Etoiles note={note} className="text-lg tracking-[2px]" />
        <span className="text-meta text-muted-foreground">{nombre}</span>
      </div>
      <ul className="flex flex-[1_1_220px] flex-col gap-2 text-meta text-muted-foreground">
        {repartition.map((r) => (
          <li key={r.etoiles} className="flex items-center gap-2.5">
            <span className="w-7 shrink-0">{r.etoiles} ★</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <span className="block h-full rounded-full bg-warning-bright" style={{ width: `${r.pct}%` }} />
            </span>
            <span className="w-11 shrink-0 text-right">{t('blocs.pourcentage', { value: r.pct })}</span>
          </li>
        ))}
      </ul>
      <Button onClick={onDonner} className="max-sm:w-full">
        {t('blocs.donnerAvis')}
      </Button>
    </div>
  )
}

/** En-tête de la liste des avis : « Avis des apprenants (3) » et le tri. */
export function EnteteListeAvis({ titre, tri }: { titre: string; tri: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
      <h2 className="text-base font-bold text-foreground">{titre}</h2>
      {tri}
    </div>
  )
}

/** Un avis : photo, nom, rôle et date, étoiles, texte, actions (Utile, Partager…), puis la réponse éventuelle. */
export function ArticleAvis({ avatar, nom, meta, note, texte, actions, children }: { avatar: string; nom: string; meta: string; note: number; texte: string; actions?: ReactNode; children?: ReactNode }) {
  return (
    <article className="flex gap-3 border-t border-border pt-3.5">
      <Avatar className="size-11 shrink-0">
        <AvatarImage src={avatar} alt="" className="object-cover" />
        <AvatarFallback>{initials(nom)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <b className="text-ui text-foreground">{nom}</b>
          <span className="text-meta text-muted-foreground">{meta}</span>
        </div>
        <Etoiles note={note} />
        <p className="text-sm leading-relaxed text-foreground-soft">{texte}</p>
        {actions && <div className="flex flex-wrap items-center gap-4">{actions}</div>}
        {children}
      </div>
    </article>
  )
}

/** Une action d'un avis (« Avis utile », « Partager », « Signaler ») : petit lien gris, bleu ou rouge une fois fait. */
export function ActionAvis({ children, actif, ton = 'primary', ...props }: { children: ReactNode; actif?: boolean; ton?: 'primary' | 'destructive'; onClick: () => void; 'aria-pressed'?: boolean; 'aria-label'?: string }) {
  return (
    <Button variant="link-muted" className={cn('text-meta font-bold', actif && (ton === 'primary' ? 'text-primary' : 'text-destructive'))} {...props}>
      {children}
    </Button>
  )
}

/** La réponse de l'école sous un avis : filet bleu à gauche. */
export function ReponseAvis({ titre, date, texte }: { titre: string; date?: string; texte: string }) {
  return (
    <div className="mt-1 rounded-sm border-l-[3px] border-primary bg-primary-wash px-3.5 py-2.5 text-sm text-foreground">
      <p className="font-bold text-primary-strong">
        {titre}
        {date && <span className="font-normal text-muted-foreground"> · {date}</span>}
      </p>
      <p className="mt-0.5 text-foreground-soft">{texte}</p>
    </div>
  )
}

/** Aucun avis encore : étoiles vides, « Pas encore d’avis », une invitation et « Donner mon avis ». */
export function AucunAvis({ texte, onDonner }: { texte: string; onDonner: () => void }) {
  const { t } = useTranslation('reviews')
  return (
    <div className="flex flex-col items-center gap-2.5 px-2 py-6 text-center">
      <span aria-hidden className="text-[28px] tracking-[4px] text-warning">
        ☆☆☆☆☆
      </span>
      <b className="text-[17px] text-foreground">{t('blocs.aucun')}</b>
      <p className="text-sm text-muted-foreground">{texte}</p>
      <Button onClick={onDonner}>{t('blocs.donnerAvis')}</Button>
    </div>
  )
}
