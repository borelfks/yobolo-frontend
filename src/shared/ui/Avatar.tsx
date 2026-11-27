import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { initials } from '@/shared/utils/format'

export function Avatar({ src, name, size = 40, className }: { src?: string; name: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  const style = { width: size, height: size }
  if (!src || failed) {
    return (
      <span style={{ ...style, fontSize: size / 2.6 }} className={cn('grid shrink-0 place-items-center rounded-full bg-brand-100 font-bold text-brand-700', className)}>
        {initials(name)}
      </span>
    )
  }
  return <img src={src} alt={name} style={style} onError={() => setFailed(true)} className={cn('shrink-0 rounded-full object-cover', className)} />
}
