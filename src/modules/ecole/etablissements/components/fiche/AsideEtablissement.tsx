import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/shadcn/button'
import { Lien } from '@/shared/ui/Lien'
import type { Etablissement, TypeSlug } from '@/shared/types'
import { lienTelephone, lienWhatsApp } from '@/shared/utils/liens'
import { ROUTES } from '@/shared/utils/routes'
import { Carte, TitreCarte } from '@/modules/ecole/etablissements/components/Bases'
import type { EcoleResumee } from '@/modules/ecole/etablissements/schoolListing'

/** La carte « Contacter l’établissement » : téléphone, e-mail, Appeler, WhatsApp. */
export function ContactEtablissement({ e }: { e: Etablissement }) {
  const { t } = useTranslation('schools')
  return (
    <Carte className="gap-2.5 p-4">
      <TitreCarte className="text-base">{t('fiche.aside.contacter')}</TitreCarte>
      <p className="text-sm text-foreground-soft">{e.telephone}</p>
      <p className="text-sm text-foreground-soft">{e.email}</p>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild className="px-3">
          <a href={lienTelephone(e.telephone)}>{t('fiche.aside.appeler')}</a>
        </Button>
        <Button asChild variant="secondary" className="px-3">
          <a href={lienWhatsApp(e.telephone)} target="_blank" rel="noreferrer">
            {t('fiche.aside.whatsapp')}
          </a>
        </Button>
      </div>
    </Carte>
  )
}

/** « Autres IPES » : trois autres établissements du même type, puis « Voir les 4 IPES → ». */
export function AutresEtablissements({ type, autres, total }: { type: TypeSlug; autres: EcoleResumee[]; total: number }) {
  const { t } = useTranslation('schools')
  return (
    <Carte className="gap-2.5 p-4">
      <TitreCarte className="text-base">{t(`fiche.aside.autres.${type}`)}</TitreCarte>
      {autres.map((x) => (
        <Lien key={x.id} to={x.href} className="group flex gap-2.5 pt-2.5 pb-0.5 text-foreground no-underline">
          <img src={x.image} alt="" className="size-12 flex-none rounded-md object-cover" />
          <span className="flex min-w-0 flex-col gap-0.5">
            <b className="text-sm leading-[1.3] group-hover:text-primary group-hover:underline">{x.nom}</b>
            <span className="text-xs text-muted-foreground">
              {x.ville}, {x.quartier} · {t('vignette.formations', { count: x.formations.length })}
            </span>
          </span>
        </Lien>
      ))}
      <Lien to={ROUTES.schoolType(type)} className="pt-1.5 text-sm font-bold text-primary no-underline hover:underline">
        {t(`fiche.aside.voirListe.${type}`, { count: total })}
      </Lien>
    </Carte>
  )
}
