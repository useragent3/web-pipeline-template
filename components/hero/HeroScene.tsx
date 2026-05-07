'use client'

import dynamic from 'next/dynamic'
import type { MutableRefObject } from 'react'

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <div className="size-full bg-[#050508]" />,
})

export function HeroScene({
  progressRef,
}: {
  progressRef: MutableRefObject<number>
}) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Scene progressRef={progressRef} />
    </div>
  )
}
