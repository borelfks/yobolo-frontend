import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LANGUES, langueActive } from '@/i18n'
import { Button } from '@/shared/shadcn/button'
import { RadioGroup, RadioGroupCard } from '@/shared/shadcn/radio-group'
import { Switch } from '@/shared/shadcn/switch'
import { ToggleGroup, ToggleGroupItem } from '@/shared/shadcn/toggle-group'
import { CartePro, LigneReglage, PiedFormulaire } from '@/modules/ecole/espace-pro/components/BlocsPro'
import { useReglages } from '@/modules/ecole/espace-pro/hooks/useReglages'

const MODES = ['automatique', 'manuelle'] as const
const VISIBILITE = ['contacts', 'adresse', 'avis'] as const

/** 7.4 Préférences : publication des contenus, visibilité de la fiche (Enregistrer), langue (tout de suite). */
export function Preferences() {
  const { t, i18n } = useTranslation('pro', { keyPrefix: 'parametres.preferences' })
  const { t: tp } = useTranslation('pro')
  const { t: tc } = useTranslation('common')
  const id = useId()
  const r = useReglages('preferences')
  const mode = r.texte('publication', 'automatique')
  return (
    <>
      <CartePro titre={t('publication')}>
        <RadioGroup value={mode} onValueChange={(v) => r.changer('publication', v)} aria-label={t('publication')} className="gap-3.5 lg:grid-cols-2">
          {MODES.map((m) => (
            <RadioGroupCard key={m} value={m} className="flex-col items-start gap-1 p-3.5">
              <b className="text-ui">{t(`modes.${m}.titre`)}</b>
              <span className="text-xs font-medium text-muted-foreground">{t(`modes.${m}.aide`)}</span>
            </RadioGroupCard>
          ))}
        </RadioGroup>
      </CartePro>
      <CartePro titre={t('visibilite')}>
        <div>
          {VISIBILITE.map((v) => (
            <LigneReglage key={v} id={`${id}-${v}`} titre={t(`visibilites.${v}.titre`)} aide={t(`visibilites.${v}.aide`)}>
              <Switch checked={r.oui(`visibilite.${v}`, true)} onCheckedChange={(x) => r.changer(`visibilite.${v}`, x)} aria-labelledby={`${id}-${v}`} />
            </LigneReglage>
          ))}
        </div>
      </CartePro>
      <CartePro titre={t('langue')}>
        <ToggleGroup type="single" variant="outline" size="lg" value={langueActive(i18n.language)} onValueChange={(v) => v && void i18n.changeLanguage(v)} aria-label={t('langue')} className="flex-wrap">
          {LANGUES.map((l) => (
            <ToggleGroupItem key={l.code} value={l.code}>
              {tc(l.libelleCle)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CartePro>
      <PiedFormulaire>
        <Button variant="outline" onClick={() => (r.annuler(), toast(tp('commun.annule')))}>
          {tp('commun.annuler')}
        </Button>
        <Button onClick={async () => { await r.enregistrer(); toast.success(tp('commun.enregistre')) }}>{tp('commun.enregistrerModifications')}</Button>
      </PiedFormulaire>
    </>
  )
}
