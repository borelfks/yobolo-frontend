import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useDecoupage } from '@/data/hooks'
import type { Lieu } from '@/shared/types'
import { ChampTexte, ListeDeroulante } from '@/shared/blocs/Formulaire'
import { cn } from '@/shared/utils/cn'
import { listesDuLieu, parNom } from '@/shared/utils/geographie'

/**
 * Le lieu du canevas (inscription) : Région, Département, Arrondissement et
 * Quartier en grille de deux colonnes (une sur téléphone), sous un titre, avec
 * l'aide « la ville en est déduite ». Chaque liste ne propose que ce qui
 * appartient au choix précédent ; changer la région vide le département et
 * l'arrondissement, changer le département vide l'arrondissement.
 */
export function ChampsLieu({
  titre,
  aide,
  valeur,
  onChange,
  erreurs,
  grand = false,
  className,
}: {
  titre: string
  aide?: string
  valeur: Lieu
  onChange: (lieu: Lieu) => void
  erreurs?: Partial<Record<keyof Lieu, string>>
  /** 48 px (écrans d'inscription). */
  grand?: boolean
  className?: string
}) {
  const { t } = useTranslation()
  const id = useId()
  const decoupage = useDecoupage()
  const { departements, arrondissements } = listesDuLieu(valeur, decoupage.departements, decoupage.arrondissements)
  const regions = [...decoupage.regions].sort(parNom)
  const messages = (['region', 'departement', 'arrondissement', 'quartier'] as const).map((k) => erreurs?.[k]).filter(Boolean)
  return (
    <fieldset className={cn('flex min-w-0 flex-col gap-2.5', className)}>
      <legend className="mb-2.5 text-sm font-bold text-foreground">{titre}</legend>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <ListeDeroulante
          id={`${id}-region`}
          ariaLabel={t('geographie.region')}
          valeur={valeur.region}
          placeholder={t('geographie.region')}
          grand={grand}
          invalide={!!erreurs?.region}
          options={regions.map((r) => ({ value: r.nom, label: r.nom }))}
          onChange={(region) => onChange({ ...valeur, region, departement: '', arrondissement: '' })}
        />
        <ListeDeroulante
          id={`${id}-departement`}
          ariaLabel={t('geographie.departement')}
          valeur={valeur.departement}
          placeholder={t('geographie.departement')}
          grand={grand}
          invalide={!!erreurs?.departement}
          disabled={!valeur.region || departements.length === 0}
          options={departements.map((d) => ({ value: d.id, label: d.nom }))}
          onChange={(departement) => onChange({ ...valeur, departement, arrondissement: '' })}
        />
        <ListeDeroulante
          id={`${id}-arrondissement`}
          ariaLabel={t('geographie.arrondissement')}
          valeur={valeur.arrondissement}
          placeholder={t('geographie.arrondissement')}
          grand={grand}
          invalide={!!erreurs?.arrondissement}
          disabled={!valeur.departement || arrondissements.length === 0}
          options={arrondissements.map((a) => ({ value: a.id, label: a.nom }))}
          onChange={(arrondissement) => onChange({ ...valeur, arrondissement })}
        />
        <ChampTexte
          aria-label={t('geographie.quartier')}
          aria-invalid={!!erreurs?.quartier || undefined}
          value={valeur.quartier}
          placeholder={t('geographie.quartierExemple')}
          onChange={(e) => onChange({ ...valeur, quartier: e.target.value })}
          className={grand ? undefined : 'h-11'}
        />
      </div>
      {messages.length > 0 ? (
        <p className="text-xs font-semibold text-destructive">{messages[0]}</p>
      ) : (
        aide && <p className="text-xs font-medium text-muted-foreground">{aide}</p>
      )}
    </fieldset>
  )
}
