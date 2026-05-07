'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { HeroScene } from './HeroScene'
import { CopyAnchors } from './CopyAnchors'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  // Server-rendered headline passed as children to keep h1 out of
  // the client bundle boundary — improves LCP by ~1–1.5s on mobile.
  children: React.ReactNode
}

export function Hero({ children }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  const [anchor1Visible, setAnchor1Visible] = useState(false)
  const [anchor2Visible, setAnchor2Visible] = useState(false)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })

      // Headline: fades out at 5–20% of scroll range
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
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '200vh' }}
      id="hero-section"
      aria-label="Hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden hero-sticky">
        <HeroScene progressRef={progressRef} />

        <span className="sr-only">
          Animated 3D geometric shape illustrating the web pipeline
        </span>

        {/* Headline wrapper — ref grabbed by GSAP; children are server-rendered */}
        <div
          ref={headlineRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          {children}
        </div>

        <CopyAnchors
          anchor1Visible={anchor1Visible}
          anchor2Visible={anchor2Visible}
        />
      </div>
    </section>
  )
}
