import { useEffect, useRef, useState } from 'react'

/** Vrai dès que l'élément entre à l'écran — une seule fois, il ne disparaît plus. */
export function useVisible<T extends Element>() {
  const ref = useRef<T>(null)
  // Sans IntersectionObserver (vieux navigateur), l'élément est visible d'emblée.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree?.isIntersecting) {
          setVisible(true)
          observateur.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observateur.observe(element)
    return () => observateur.disconnect()
  }, [visible])

  return { ref, visible }
}
