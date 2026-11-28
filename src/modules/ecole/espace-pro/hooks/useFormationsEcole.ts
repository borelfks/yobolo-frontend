import { useMonEcole } from '@/modules/compte/auth/hooks/useSession'
import { useFormations, useFormationsPro } from '@/data/hooks'
import type { FormationPro } from '@/shared/types'

/**
 * Les formations de l'établissement connecté, telles que « Gérer les
 * formations » les montre : les lignes du tableau (table `formationsPro`),
 * puis ses fiches (table `formations`) qui n'ont pas encore de ligne.
 * `fiche(id)` : la fiche publique d'une ligne, s'il y en a une.
 */
export function useFormationsEcole() {
  const { ecole, formations } = useMonEcole()
  const lignesTable = useFormationsPro(ecole.id)
  const toutes = useFormations()
  const propres = lignesTable.filter((f) => f.etablissementId === ecole.id)
  const lignes: FormationPro[] = [
    ...propres,
    ...formations
      .filter((f) => !propres.some((p) => p.id === f.id))
      .map((f) => ({ id: f.id, etablissementId: ecole.id, nom: f.nom, code: f.code, filiere: f.filiere, ton: 'blue', diplome: f.diplome, duree: `${f.dureeMois} mois`, rentree: f.rentree, dateLimite: f.dateLimite, statut: f.statut })),
  ]
  return {
    lignes,
    /** La ligne existe dans la table `formationsPro`. */
    enTable: (id: string) => lignesTable.some((l) => l.id === id),
    fiche: (id: string) => toutes.find((x) => x.id === id),
    toutes,
  }
}
