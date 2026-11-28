import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { useDecoupage } from '@/data/hooks'
import { Input } from '@/shared/shadcn/input'
import { Champ, CaseACocher } from '@/shared/blocs/Formulaire'
import { ChampsLieu } from '@/shared/forms/ChampsLieu'
import { villeDuLieu } from '@/shared/utils/geographie'
import { lienCarte } from '@/shared/utils/liens'
import type { Etablissement, Lieu } from '@/shared/types'
import { ChampIndicatif, CartePro } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { sansIndicatif, type ProfilForm } from '@/modules/ecole/espace-pro/proData'

/** Profil › Coordonnées : le lieu, les contacts, puis l'aperçu de ce que voit le public (valeurs enregistrées). */
export function Coordonnees({ form, ecole }: { form: ProfilForm; ecole: Etablissement }) {
  const { t } = useTranslation('pro', { keyPrefix: 'profil.coordonnees' })
  const { arrondissements } = useDecoupage()
  const id = useId()
  const lieu: Lieu = {
    region: form.texte('region', ecole.region),
    departement: form.texte('departement', ecole.departement ?? ''),
    arrondissement: form.texte('arrondissement', ecole.arrondissement ?? ''),
    quartier: form.texte('quartier', ecole.quartier),
  }
  const changerLieu = (l: Lieu) => {
    for (const cle of ['region', 'departement', 'arrondissement', 'quartier'] as const) form.changer(cle, l[cle])
    const ville = villeDuLieu(l, arrondissements)
    if (ville) form.changer('ville', ville)
  }
  // L'aperçu montre ce qui est enregistré (la fiche publique), pas la saisie en cours.
  const enr = (cle: string, defaut = '') => form.enregistre(cle, defaut)
  const adresse = [enr('adresse', ecole.adresse ?? ''), [enr('quartier', ecole.quartier), enr('ville', ecole.ville)].filter(Boolean).join(', ')].filter(Boolean).join(' — ')
  const apercu: { icone: LucideIcon; nom: string; valeur: string }[] = [
    { icone: MapPin, nom: t('apercu.adresse'), valeur: adresse },
    { icone: Phone, nom: t(form.oui('whatsapp', true) ? 'apercu.telephoneWhatsapp' : 'apercu.telephone'), valeur: enr('telephone', ecole.telephone) },
    { icone: Mail, nom: t('apercu.email'), valeur: enr('email', ecole.email) },
    { icone: Globe, nom: t('apercu.site'), valeur: enr('siteWeb', ecole.siteWeb ?? '') },
  ].filter((x) => x.valeur.trim())
  const champ = (cle: string, defaut: string) => ({ value: form.texte(cle, defaut), onChange: (e: { target: { value: string } }) => form.changer(cle, e.target.value) })
  return (
    <>
      <CartePro titre={t('titre')}>
        <ChampsLieu titre={t('lieu')} aide={t('lieuAide')} valeur={lieu} onChange={changerLieu} erreurs={{ quartier: form.erreur('quartier') }} />
        <div className="grid gap-3.5 lg:grid-cols-2">
          <Champ id={`${id}-lieudit`} label={t('lieuDit')} facultatif>
            <Input id={`${id}-lieudit`} {...champ('lieuDit', ecole.lieuDit ?? '')} />
          </Champ>
          <Champ id={`${id}-adresse`} label={t('adresse')}>
            <Input id={`${id}-adresse`} {...champ('adresse', ecole.adresse ?? '')} />
          </Champ>
          <Champ id={`${id}-tel`} label={t('telephone')} requis erreur={form.erreur('telephone')}>
            <ChampIndicatif id={`${id}-tel`} value={sansIndicatif(form.texte('telephone', ecole.telephone))} onChange={(e) => form.changer('telephone', e.target.value)} aria-invalid={!!form.erreur('telephone') || undefined} />
            <CaseACocher label={t('whatsapp')} checked={form.oui('whatsapp', true)} onCheckedChange={(v) => form.changer('whatsapp', v === true)} className="text-meta" />
          </Champ>
          <Champ id={`${id}-tel2`} label={t('telephone2')} facultatif>
            <ChampIndicatif id={`${id}-tel2`} placeholder={t('telephoneExemple')} value={sansIndicatif(form.texte('telephone2', ''))} onChange={(e) => form.changer('telephone2', e.target.value)} />
          </Champ>
          <Champ id={`${id}-email`} label={t('email')} requis erreur={form.erreur('email')}>
            <Input id={`${id}-email`} type="email" {...champ('email', ecole.email)} aria-invalid={!!form.erreur('email') || undefined} />
          </Champ>
          <Champ id={`${id}-site`} label={t('site')} facultatif>
            <Input id={`${id}-site`} placeholder={t('siteExemple')} {...champ('siteWeb', ecole.siteWeb ?? '')} />
          </Champ>
        </div>
      </CartePro>
      <CartePro titre={t('apercu.titre')}>
        <div className="grid gap-3.5 lg:grid-cols-2">
          <ul className="flex flex-col gap-3 text-sm">
            {apercu.map(({ icone: Icone, nom, valeur }) => (
              <li key={nom} className="flex gap-2.5">
                <Icone className="mt-px size-[18px] shrink-0 text-primary" aria-hidden />
                <span className="flex min-w-0 flex-col gap-px">
                  <span className="text-xs font-medium text-muted-foreground">{nom}</span>
                  <b className="font-semibold break-words text-foreground">{valeur}</b>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <b className="text-sm text-foreground">{t('apercu.plan')}</b>
            <div role="img" aria-label={t('apercu.planAria', { lieu: `${ecole.quartier}, ${ecole.ville}` })} className="relative h-[180px] overflow-hidden rounded-md border border-border bg-success-wash bg-[linear-gradient(90deg,var(--color-card)_6px,transparent_6px),linear-gradient(0deg,var(--color-card)_6px,transparent_6px)] bg-[length:70px_54px]">
              <MapPin className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-full fill-destructive text-card" aria-hidden />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-card px-2.5 py-1 text-xs font-bold text-foreground shadow-raised">
                {ecole.sigle || ecole.nom} · {ecole.quartier}, {ecole.ville}
              </span>
            </div>
            <a className="text-sm font-bold text-primary no-underline hover:underline" href={lienCarte(ecole.adresse, ecole.quartier, ecole.ville)} target="_blank" rel="noreferrer">
              {t('apercu.googleMaps')}
            </a>
          </div>
        </div>
      </CartePro>
    </>
  )
}
