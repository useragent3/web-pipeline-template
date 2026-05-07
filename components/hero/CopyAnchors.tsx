'use client'

import { motion, AnimatePresence } from 'framer-motion'

// Spec §6 — Framer Motion variants for copy panels
const copyVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0, 0.35, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: [0.65, 0, 1, 1] as const },
  },
}

interface AnchorProps {
  eyebrow: string
  headline: string
  body: string
  cta?: string
  ctaHref?: string
  align?: 'left' | 'right'
  visible: boolean
}

function CopyAnchor({
  eyebrow,
  headline,
  body,
  cta,
  ctaHref,
  align = 'left',
  visible,
}: AnchorProps) {
  const sideClass =
    align === 'left'
      ? 'left-[5vw] md:left-[6vw]'
      : 'right-[5vw] md:right-[6vw]'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={headline}
          variants={copyVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 max-w-sm ${sideClass}`}
        >
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-brand-primary)' }}
          >
            {eyebrow}
          </p>
          <h2
            className="mb-3 font-bold leading-tight"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-anchor)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {headline}
          </h2>
          <p
            className="leading-relaxed"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-body)',
              maxWidth: '38ch',
              lineHeight: 'var(--leading-normal)',
            }}
          >
            {body}
          </p>
          {cta && (
            <a
              href={ctaHref ?? '#contact'}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80 pointer-events-auto"
              style={{ color: 'var(--color-brand-primary)' }}
            >
              {cta}
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface CopyAnchorsProps {
  anchor1Visible: boolean
  anchor2Visible: boolean
}

export function CopyAnchors({ anchor1Visible, anchor2Visible }: CopyAnchorsProps) {
  return (
    <>
      {/* Act 1 — right side (35–50% scroll) */}
      <CopyAnchor
        visible={anchor1Visible}
        align="right"
        eyebrow="01 — Build"
        headline="Craft your vision in three dimensions"
        body="Scroll-driven 3D scenes that respond to intent. Every frame earns its render budget."
      />
      {/* Act 2 — left side (65–80% scroll) */}
      <CopyAnchor
        visible={anchor2Visible}
        align="left"
        eyebrow="02 — Ship"
        headline="Deploy with confidence, iterate fast"
        body="Vercel previews on every PR. Lighthouse-gated CI. From idea to live in hours."
        cta="Get in touch →"
        ctaHref="#contact"
      />
    </>
  )
}
