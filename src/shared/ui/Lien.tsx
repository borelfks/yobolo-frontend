import type { ComponentProps } from 'react'
import { Link } from '@tanstack/react-router'
import { cible } from '@/shared/utils/cible'

type Props = Omit<ComponentProps<typeof Link>, 'to' | 'search' | 'hash'> & {
  /** Adresse de ROUTES ; elle peut contenir une recherche (« ?sujet=… ») ou une ancre (« #securite »). */
  to: string
}

/**
 * Le lien de l'application (à la place du `Link` de TanStack Router) :
 * - accepte les adresses complètes de ROUTES ;
 * - ne se dit « page actuelle » (`aria-current="page"`) que sur son adresse
 *   exacte : un lien vers « /ecoles » ne l'est pas sur « /ecoles/ipes ».
 * Pour un menu ou des onglets actifs aussi sur leurs sous-pages : LienActif.
 */
export function Lien({ to, ...props }: Props) {
  const { to: chemin, search, hash } = cible(to)
  return (
    <Link
      activeOptions={{ exact: true }}
      {...props}
      to={chemin}
      // Recherche en texte simple (le routeur l'écrit telle quelle, voir src/app/routes) : son type n'est pas celui d'une route déclarée.
      search={search as never}
      hash={hash}
    />
  )
}
