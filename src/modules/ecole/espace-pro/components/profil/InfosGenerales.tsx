import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/shadcn/badge'
import { Input } from '@/shared/shadcn/input'
import { Switch } from '@/shared/shadcn/switch'
import { Textarea } from '@/shared/shadcn/textarea'
import { Champ, ListeDeroulante } from '@/shared/blocs/Formulaire'
import { num } from '@/shared/utils/format'
import type { Etablissement } from '@/shared/types'
import { CartePro, LigneReglage } from '@/modules/ecole/espace-pro/components/BlocsPro'
import type { ProfilForm } from '@/modules/ecole/espace-pro/proData'

const TYPES = [
  { value: 'IPES', cle: 'ipes' },
  { value: 'CFP', cle: 'cfp' },
  { value: 'Autre', cle: 'autre' },
] as const

/** Les années proposées pour la création de l'établissement : de cette année à 1950. */
const ANNEES = Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => String(new Date().getFullYear() - i))

/** Profil › Informations générales : nom, sigle, type, année, présentation ; statut et visibilité ; chiffres clés (calculés). */
export function InfosGenerales({ form, ecole, nbFormations }: { form: ProfilForm; ecole: Etablissement; nbFormations: number }) {
  const { t } = useTranslation('pro', { keyPrefix: 'profil.general' })
  const id = useId()
  const description = form.texte('description', ecole.description)
  const publie = form.oui('publie', true)
  const filieres = (ecole.principales ?? ecole.filieres).length
  return (
    <>
      <CartePro titre={t('titre')}>
        <div className="grid gap-3.5 lg:grid-cols-2">
          <Champ id={`${id}-nom`} label={t('nom')} requis erreur={form.erreur('nom')}>
            <Input id={`${id}-nom`} value={form.texte('nom', ecole.nom)} onChange={(e) => form.changer('nom', e.target.value)} aria-invalid={!!form.erreur('nom') || undefined} />
          </Champ>
          <Champ id={`${id}-sigle`} label={t('sigle')}>
            <Input id={`${id}-sigle`} value={form.texte('sigle', ecole.sigle)} onChange={(e) => form.changer('sigle', e.target.value)} />
          </Champ>
          <Champ id={`${id}-type`} label={t('type')} requis>
            <ListeDeroulante id={`${id}-type`} valeur={form.texte('type', ecole.type)} onChange={(v) => form.changer('type', v)} options={TYPES.map((x) => ({ value: x.value, label: t(`types.${x.cle}`) }))} />
          </Champ>
          <Champ id={`${id}-annee`} label={t('annee')}>
            <ListeDeroulante id={`${id}-annee`} valeur={form.texte('anneeCreation', ecole.anneeCreation ?? '')} onChange={(v) => form.changer('anneeCreation', v)} placeholder={t('choisirAnnee')} options={ANNEES.map((a) => ({ value: a, label: a }))} />
          </Champ>
        </div>
        <Champ id={`${id}-desc`} label={t('presentation')} erreur={form.erreur('description')}>
          <Textarea id={`${id}-desc`} rows={4} maxLength={300} value={description} onChange={(e) => form.changer('description', e.target.value)} />
          <span className="text-right text-xs font-medium text-muted-foreground">{t('caracteres', { n: description.length, max: 300 })}</span>
        </Champ>
      </CartePro>
      <CartePro titre={t('statut.titre')}>
        <div>
          <LigneReglage titre={t('statut.verifie')} aide={t('statut.verifieAide')}>
            <Badge variant="green">{t('statut.conforme')}</Badge>
          </LigneReglage>
          <LigneReglage id={`${id}-publier`} titre={t('statut.publier')} aide={t('statut.publierAide')}>
            <Switch checked={publie} onCheckedChange={(v) => form.changer('publie', v)} aria-labelledby={`${id}-publier`} />
          </LigneReglage>
        </div>
      </CartePro>
      <CartePro titre={t('chiffres.titre')}>
        <div className="grid gap-3.5 lg:grid-cols-2">
          {[
            [t('chiffres.formations'), nbFormations],
            [t('chiffres.filieres'), filieres],
          ].map(([nom, n]) => (
            <div key={nom} className="flex flex-col gap-0.5 rounded-md bg-muted px-3.5 py-3">
              <span className="text-xs font-medium text-muted-foreground">{nom}</span>
              <b className="text-2xl font-extrabold text-foreground">{num(Number(n))}</b>
            </div>
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground">{t('chiffres.aide')}</span>
      </CartePro>
    </>
  )
}
