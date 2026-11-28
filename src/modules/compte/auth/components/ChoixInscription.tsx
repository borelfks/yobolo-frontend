import { useTranslation } from 'react-i18next'
import { ArrowRight, Briefcase, Building2, GraduationCap, UserRound, type LucideIcon } from 'lucide-react'
import { PROFILS, profilOuvert, TYPES_ETABLISSEMENT, type Profil, type TypeEtablissement } from '@/modules/compte/auth/authInscription'
import { Button } from '@/shared/shadcn/button'
import { RadioGroup, RadioGroupCard } from '@/shared/shadcn/radio-group'
import { Lien } from '@/shared/ui/Lien'
import { ROUTES } from '@/shared/utils/routes'

const ICONES: Record<Profil, LucideIcon> = { personne: UserRound, ecole: GraduationCap, consultant: Briefcase, entreprise: Building2 }

/** Étape « Profil » : une carte par profil ; Consultant et Entreprise sont fermés (« Bientôt disponible »). */
export function ChoixProfil({ valeur, onChange }: { valeur: Profil; onChange: (p: Profil) => void }) {
  const { t } = useTranslation('auth', { keyPrefix: 'inscription' })
  return (
    <RadioGroup value={valeur} onValueChange={(v) => onChange(v as Profil)} aria-label={t('steps.profil')} className="grid gap-3 sm:grid-cols-2">
      {PROFILS.map((p) => {
        const Icone = ICONES[p]
        const ferme = !profilOuvert(p)
        return (
          <RadioGroupCard key={p} value={p} disabled={ferme}>
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground group-data-[state=checked]:bg-primary group-data-[state=checked]:text-primary-foreground">
              <Icone className="size-[22px]" aria-hidden />
            </span>
            <span className="flex flex-1 flex-col gap-[3px]">
              <b className="text-base">{t(`profiles.${p}.title`)}</b>
              <span className="text-meta text-muted-foreground">{t(`profiles.${p}.desc`)}</span>
              {ferme && <span className="mt-1 self-start rounded-full bg-secondary px-2 py-[3px] text-[11px] font-extrabold text-muted-foreground">{t('comingSoon')}</span>}
            </span>
          </RadioGroupCard>
        )
      })}
    </RadioGroup>
  )
}

/** Étape « Infos » : le type d'établissement (IPES, CFP, Autre établissement, Auto-école). */
export function ChoixTypeEtablissement({ valeur, onChange }: { valeur: TypeEtablissement; onChange: (t: TypeEtablissement) => void }) {
  const { t } = useTranslation('auth', { keyPrefix: 'inscription.types' })
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-bold text-foreground">
        {t('legende')} <span className="text-destructive">*</span>
      </legend>
      <RadioGroup value={valeur} onValueChange={(v) => onChange(v as TypeEtablissement)} aria-label={t('legende')} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TYPES_ETABLISSEMENT.map((k) => (
          <RadioGroupCard key={k} value={k} className="items-start data-[state=checked]:ring-1 data-[state=checked]:ring-primary data-[state=checked]:ring-inset">
            <span className="flex flex-col gap-0.5">
              <b className="text-ui">{t(`${k}.nom`)}</b>
              <span className="text-xs text-muted-foreground">{t(`${k}.desc`)}</span>
            </span>
          </RadioGroupCard>
        ))}
      </RadioGroup>
    </fieldset>
  )
}

/**
 * Les boutons du bas d'une étape : « Retour » (à la première étape, vers la
 * connexion) et « Continuer » / « Recevoir le code » (flèche) ou « Créer mon compte ».
 */
export function NavigationEtapes({ onRetour, suivant, fleche = true, envoi = false, onSuivant }: { onRetour?: () => void; suivant: string; fleche?: boolean; envoi?: boolean; onSuivant?: () => void }) {
  const { t } = useTranslation('auth', { keyPrefix: 'inscription' })
  return (
    <div className="flex flex-wrap justify-between gap-2.5 pt-1">
      {onRetour ? (
        <Button type="button" variant="outline" size="lg" className="h-12 px-6 text-base" onClick={onRetour}>
          {t('back')}
        </Button>
      ) : (
        <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
          <Lien to={ROUTES.signIn}>{t('back')}</Lien>
        </Button>
      )}
      <Button type={onSuivant ? 'button' : 'submit'} size="lg" loading={envoi} onClick={onSuivant} className="h-12 px-6 text-base">
        {suivant}
        {fleche && <ArrowRight className="size-[18px]" aria-hidden />}
      </Button>
    </div>
  )
}
