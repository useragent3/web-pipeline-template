# Web Pipeline Template

Next.js 15 starter with a scroll-driven 3D hero. Clone → rebrand → ship.

## Stack

| Layer | Lib |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript strict |
| Styling | Tailwind CSS v4, CSS variables |
| 3D | React Three Fiber, drei, Three.js |
| Scroll / animation | GSAP + ScrollTrigger, Lenis, Framer Motion |
| Forms | Resend + Server Actions (add as needed) |
| Hosting | Vercel |

## Getting started

```bash
pnpm install
pnpm dev
```

## Asset pipeline

Drop `.glb`, `.mp4`, or image files into `assets/incoming/` then run:

```bash
pnpm assets:optimize
```

Optimised files land in `public/assets/optimized/` with a content-hash manifest.
`assets/incoming/` is gitignored — never committed to the repo.

## Cloning for a client

See `docs/cloning-for-a-client.md` (Phase 2 deliverable).
