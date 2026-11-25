/** « Windows · Chrome », « Android · Firefox »… : l'appareil réel de la visite, lu dans le navigateur. */
export function decrireAppareil(agent: string = typeof navigator === 'undefined' ? '' : navigator.userAgent) {
  const systeme = /Android/i.test(agent)
    ? 'Android'
    : /iPhone|iPad|iPod/i.test(agent)
      ? 'iOS'
      : /Windows/i.test(agent)
        ? 'Windows'
        : /Mac OS X|Macintosh/i.test(agent)
          ? 'macOS'
          : /Linux/i.test(agent)
            ? 'Linux'
            : '—'
  const navigateur = /Edg\//.test(agent)
    ? 'Edge'
    : /OPR\/|Opera/.test(agent)
      ? 'Opera'
      : /Firefox\//.test(agent)
        ? 'Firefox'
        : /Chrome\//.test(agent)
          ? 'Chrome'
          : /Safari\//.test(agent)
            ? 'Safari'
            : '—'
  return `${systeme} · ${navigateur}`
}
