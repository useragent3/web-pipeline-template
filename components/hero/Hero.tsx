'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { HeroScene } from './HeroScene'
import { CopyAnchors } from './CopyAnchors'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  const [anchor1Visible, setAnchor1Visible] = useState(false)
  const [anchor2Visible, setAnchor2Visible] = useState(false)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      // Sync raw scroll progress for the 3D camera
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })

      // Headline scroll-scrub fade (Act 0 → exits at 20%)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
      tl.to(headlineRef.current, { opacity: 0, y: -30, duration: 0.2 }, 0.05)

      // Anchor 1 visibility: 35–52% scroll progress (spec §6)
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress
          setAnchor1Visible(p >= 0.35 && p <= 0.52)
          setAnchor2Visible(p >= 0.65 && p <= 0.82)
        },
      })
    },
    { scope: containerRef }
  )

  return (
    // 200vh total scroll range (spec §5)
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '200vh' }}
      id="hero-section"
      aria-label="Hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden hero-sticky">
        {/* 3D Canvas */}
        <HeroScene progressRef={progressRef} />

        {/* Screen-reader label for the 3D scene */}
        <span className="sr-only">
          Animated 3D geometric shape illustrating the web pipeline
        </span>

        {/* Act 0 — Hero headline (always visible on load, fades out at 20% scroll) */}
        <div
          ref={headlineRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p
            className="mb-3 text-xs font-semibold uppercase"
            style={{
              color: 'var(--color-brand-primary)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            Web Pipeline Template
          </p>
          <h1
            className="font-bold"
            style={{
              fontSize: 'var(--text-hero)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--color-text-primary)',
            }}
          >
            Build.
            <br />
            Ship.
            <br />
            Repeat.
          </h1>
          <p
            className="mt-6 max-w-md"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            Scroll to explore
          </p>
          <svg
            className="mt-8 animate-bounce"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Copy anchors — controlled by scroll progress state */}
        <CopyAnchors
          anchor1Visible={anchor1Visible}
          anchor2Visible={anchor2Visible}
        />
      </div>
    </section>
  )
}
