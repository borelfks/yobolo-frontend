import { useState } from 'react'
import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { data } from '@/data'
import { useParametres } from '@/data/hooks'
import { oui, prefixer, sousCles, texte, type Valeurs } from '@/modules/ecole/espace-pro/proData'

/**
 * Les réglages d'une rubrique des paramètres (`compte`, `securite`,
 * `notifications`, `preferences`) : valeurs saisies, relues depuis la base,
 * et enregistrement (tout de suite avec `immediat`).
 */
export function useReglages(rubrique: string) {
  const { ecole } = useMonEcole()
  const reglages = useParametres(ecole.id)
  const enregistres = sousCles(rubrique, reglages)
  const [saisie, setSaisie] = useState<Valeurs>({})
  const valeurs = { ...enregistres, ...saisie }
  return {
    texte: (cle: string, defaut: string) => texte(valeurs, cle, defaut),
    oui: (cle: string, defaut: boolean) => oui(valeurs, cle, defaut),
    changer: (cle: string, v: string | boolean) => setSaisie((s) => ({ ...s, [cle]: v })),
    annuler: () => setSaisie({}),
    enregistrer: async (immediat: Valeurs = {}) => {
      await data.put('parametres', { id: ecole.id, valeurs: { ...reglages, ...prefixer(rubrique, { ...valeurs, ...immediat }) } })
      setSaisie({})
    },
  }
}
