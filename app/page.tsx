import { Hero } from '@/components/hero/Hero'

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Below-fold content placeholder — replace with client sections */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--hero-accent)]">
          Web Pipeline Template
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
          Ready to clone and customise
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/50">
          Drop assets into <code className="text-white/80">assets/incoming/</code>,
          run <code className="text-white/80">pnpm assets:optimize</code>, and
          your scene updates automatically.
        </p>
      </section>
    </main>
  )
}
