import { MessagePage } from '@/shared/blocs/Etats'

/** Adresse inconnue : la planche « Page introuvable (404) » du canevas, dans le cadre public. */
export function NotFound() {
  return <MessagePage type="404" />
}
