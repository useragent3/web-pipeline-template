import { Hero } from '@/components/hero/Hero'

export default function Home() {
  return (
    <main>
      {/*
       * Headline is passed as server-rendered children so the h1 appears in
       * the initial HTML — the client boundary only wraps the GSAP/canvas layer.
       * This moves LCP from ~2.9s (post-hydration) to ~0.4s (server paint).
       */}
      <Hero>
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
      </Hero>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p
          className="text-xs font-semibold uppercase"
          style={{
            color: 'var(--color-brand-primary)',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          Web Pipeline Template
        </p>
        <h2
          className="mt-4 font-bold"
          style={{
            fontSize: 'var(--text-anchor)',
            color: 'var(--color-text-primary)',
          }}
        >
          Ready to clone and customise
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Drop assets into{' '}
          <code style={{ color: 'var(--color-text-primary)' }}>
            assets/incoming/
          </code>
          , run{' '}
          <code style={{ color: 'var(--color-text-primary)' }}>
            pnpm assets:optimize
          </code>
          , and your scene updates automatically.
        </p>
      </section>
    </main>
  )
}
