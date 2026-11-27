import { useTranslation } from 'react-i18next'
import { MapPin } from 'lucide-react'
import { useDecoupage } from '@/data/hooks'
import { Field, Input, Select } from '@/shared/forms/Fields'
import type { Lieu } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { listesDuLieu, parNom, villeDuLieu } from '@/shared/utils/geographie'

/**
 * La sélection géographique de yibolo-client : région → département →
 * arrondissement (chaque liste ne propose que ce qui appartient au choix
 * précédent, la ville s'en déduit), puis le quartier, en texte libre.
 * Changer la région vide le département et l'arrondissement ; changer le
 * département vide l'arrondissement.
 */
export function SelectionGeographique({
  valeur,
  onChange,
  erreurs,
  requis = true,
  quartier = true,
  className,
}: {
  valeur: Lieu
  onChange: (lieu: Lieu) => void
  erreurs?: Partial<Record<keyof Lieu, string>>
  requis?: boolean
  /** Afficher le champ « Quartier » (oui par défaut). */
  quartier?: boolean
  className?: string
}) {
  const { t } = useTranslation()
  const decoupage = useDecoupage()
  const { departements, arrondissements } = listesDuLieu(valeur, decoupage.departements, decoupage.arrondissements)
  const regions = [...decoupage.regions].sort(parNom)
  const ville = villeDuLieu(valeur, decoupage.arrondissements)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={t('geographie.region')} required={requis} error={erreurs?.region}>
          <Select
            aria-label={t('geographie.region')}
            value={valeur.region}
            placeholder={t('geographie.choisirRegion')}
            options={regions.map((r) => r.nom)}
            onChange={(e) => onChange({ ...valeur, region: e.target.value, departement: '', arrondissement: '' })}
          />
        </Field>
        <Field label={t('geographie.departement')} required={requis} error={erreurs?.departement}>
          <Select
            aria-label={t('geographie.departement')}
            value={valeur.departement}
            disabled={!valeur.region || departements.length === 0}
            placeholder={valeur.region ? t('geographie.choisirDepartement') : t('geographie.dAbordRegion')}
            options={departements.map((d) => ({ value: d.id, label: d.nom }))}
            onChange={(e) => onChange({ ...valeur, departement: e.target.value, arrondissement: '' })}
          />
        </Field>
        <Field label={t('geographie.arrondissement')} required={requis} error={erreurs?.arrondissement}>
          <Select
            aria-label={t('geographie.arrondissement')}
            value={valeur.arrondissement}
            disabled={!valeur.departement || arrondissements.length === 0}
            placeholder={valeur.departement ? t('geographie.choisirArrondissement') : t('geographie.dAbordDepartement')}
            options={arrondissements.map((a) => ({ value: a.id, label: a.nom }))}
            onChange={(e) => onChange({ ...valeur, arrondissement: e.target.value })}
          />
        </Field>
      </div>
      {ville && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {t('geographie.villeDeduite', { ville })}
        </p>
      )}
      {quartier && (
        <Field label={t('geographie.quartier')} required={requis} error={erreurs?.quartier}>
          <Input aria-label={t('geographie.quartier')} value={valeur.quartier} placeholder={t('geographie.exempleQuartier')} onChange={(e) => onChange({ ...valeur, quartier: e.target.value })} />
        </Field>
      )}
    </div>
  )
}
