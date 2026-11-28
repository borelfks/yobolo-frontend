/**
 * Pièces à fournir pour une inscription en auto-école. Seule la clé est gardée ici :
 * les textes (libellé, nom court, état, consigne, bouton) sont résolus dans les écrans
 * avec t(`pieces.${key}.label`), t(`pieces.${key}.short`)… (namespace « enrollment »).
 */
export const piecesAE = [{ key: 'cni' }, { key: 'photos' }, { key: 'medical' }] as const

export type PieceKey = (typeof piecesAE)[number]['key']

