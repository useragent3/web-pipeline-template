'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { HeroScene } from './HeroScene'
import { CopyAnchors } from './CopyAnchors'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const anchor1Ref = useRef<HTMLDivElement>(null)
  const anchor2Ref = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      // Sync scroll progress into the Three.js scene
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })

      // Main scroll-driven timeline
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // Initial headline: visible until 15% scroll
      tl.to(headlineRef.current, { opacity: 0, y: -30, duration: 0.15 }, 0.1)

      // Anchor 1: fade in at 25%, out at 52%
      tl.from(anchor1Ref.current, { opacity: 0, y: 24, duration: 0.12 }, 0.25)
        .to(anchor1Ref.current, { opacity: 0, y: -24, duration: 0.12 }, 0.52)

      // Anchor 2: fade in at 62%, out at 88%
      tl.from(anchor2Ref.current, { opacity: 0, y: 24, duration: 0.12 }, 0.62)
        .to(anchor2Ref.current, { opacity: 0, y: -24, duration: 0.12 }, 0.86)
    },
    { scope: containerRef }
  )

  return (
    // 300vh gives enough scroll space for the camera journey
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '300vh' }}
      aria-label="Hero"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden bg-[#050508]"
      >
        {/* 3D Canvas */}
        <HeroScene progressRef={progressRef} />

        {/* Screen-reader accessible label for the 3D scene */}
        <span className="sr-only">
          Animated 3D geometric shape illustrating the web pipeline
        </span>

        {/* Initial centre headline */}
        <div
          ref={headlineRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--hero-accent)]">
            Web Pipeline Template
          </p>
          <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
            Build.
            <br />
            Ship.
            <br />
            Repeat.
          </h1>
          <p className="mt-6 max-w-md text-base text-white/50 md:text-lg">
            Scroll to explore
          </p>
          {/* Accessible scroll cue arrow */}
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

        {/* Copy anchors */}
        <CopyAnchors anchor1Ref={anchor1Ref} anchor2Ref={anchor2Ref} />
      </div>
    </section>
  )
}
