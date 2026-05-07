'use client'

import { forwardRef } from 'react'

interface AnchorProps {
  eyebrow: string
  headline: string
  body: string
  align?: 'left' | 'right'
}

const CopyAnchor = forwardRef<HTMLDivElement, AnchorProps>(
  ({ eyebrow, headline, body, align = 'left' }, ref) => (
    <div
      ref={ref}
      className={`pointer-events-none absolute bottom-[20%] max-w-sm opacity-0 ${
        align === 'left' ? 'left-8 md:left-16' : 'right-8 md:right-16'
      }`}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--hero-accent)]">
        {eyebrow}
      </p>
      <h2 className="mb-3 text-3xl font-bold leading-tight text-white md:text-4xl">
        {headline}
      </h2>
      <p className="text-sm leading-relaxed text-white/60 md:text-base">
        {body}
      </p>
    </div>
  )
)
CopyAnchor.displayName = 'CopyAnchor'

export interface CopyAnchorsHandles {
  anchor1: HTMLDivElement | null
  anchor2: HTMLDivElement | null
}

interface CopyAnchorsProps {
  anchor1Ref: React.RefObject<HTMLDivElement | null>
  anchor2Ref: React.RefObject<HTMLDivElement | null>
}

export function CopyAnchors({ anchor1Ref, anchor2Ref }: CopyAnchorsProps) {
  return (
    <>
      <CopyAnchor
        ref={anchor1Ref}
        align="left"
        eyebrow="01 — Build"
        headline="Craft your vision in three dimensions"
        body="Scroll-driven 3D scenes that respond to intent. Every frame earns its render budget."
      />
      <CopyAnchor
        ref={anchor2Ref}
        align="right"
        eyebrow="02 — Ship"
        headline="Deploy with confidence, iterate fast"
        body="Vercel previews on every PR. Lighthouse-gated CI. From idea to live in hours, not weeks."
      />
    </>
  )
}
