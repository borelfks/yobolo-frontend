import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleCheck } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import type { AutoEcole } from '@/shared/types'
import { lienCarte, lienTelephone } from '@/shared/utils/liens'
import { Carte, TitreCarte } from '@/modules/ecole/etablissements/components/Bases'
import { whyKeys } from '@/modules/ecole/auto-ecoles/autoEcoleFiche'

/** Une liste à coches vertes (« Pourquoi nous choisir ? », « Ce que comprend le tarif »). */
export function ListeCoches({ elements, className }: { elements: ReactNode[]; className?: string }) {
  return (
    <ul className={className ?? 'flex flex-col gap-2.5'}>
      {elements.map((e, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground-soft">
          <CircleCheck className="mt-px size-[18px] shrink-0 fill-success text-white" aria-hidden />
          {e}
        </li>
      ))}
    </ul>
  )
}

/** « Contact & accès » : adresse, téléphone, e-mail, site, puis Appeler et Voir sur la carte. */
export function ContactAutoEcole({ a }: { a: AutoEcole }) {
  const { t } = useTranslation('driving-schools')
  const adresse = [a.adresse, a.quartier, a.ville].filter(Boolean).join(', ')
  return (
    <Carte id="contact" className="scroll-mt-24 gap-2.5 p-4">
      <TitreCarte className="text-base">{t('profile.overview.contactTitle')}</TitreCarte>
      <p className="text-sm text-foreground-soft">{adresse}</p>
      <p className="text-sm text-foreground-soft">{a.telephone}</p>
      <p className="text-sm text-foreground-soft">{a.email}</p>
      {a.site && <p className="text-sm text-foreground-soft">{a.site}</p>}
      <div className="grid grid-cols-2 gap-2">
        <Button asChild className="px-3">
          <a href={lienTelephone(a.telephone)}>{t('profile.fiche.appeler')}</a>
        </Button>
        <Button asChild variant="secondary" className="px-3">
          <a href={lienCarte(a.adresse, a.quartier, a.ville)} target="_blank" rel="noreferrer">
            {t('profile.overview.seeOnMap')}
          </a>
        </Button>
      </div>
    </Carte>
  )
}

/** « Pourquoi nous choisir ? » : les atouts de l'auto-école, cochés en vert. */
export function PourquoiNousChoisir() {
  const { t } = useTranslation('driving-schools')
  return (
    <Carte className="gap-3 p-4">
      <TitreCarte className="text-base">{t('profile.why.title')}</TitreCarte>
      <ListeCoches elements={whyKeys.map((k) => t(`profile.why.items.${k}`))} />
    </Carte>
  )
}
