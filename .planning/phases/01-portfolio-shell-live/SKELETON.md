# Walking Skeleton — danielcross.dev Developer Portfolio

**Phase:** 1
**Generated:** 2026-07-09

## Capability Proven End-to-End

> One sentence: the smallest user-visible capability that exercises the full stack.

A visitor can open `https://danielcross.dev` and see Daniel's name, senior React Native / Web3 role, and ex-MetaMask hook — rendered by the deployed Next.js 16 app from typed TypeScript content, served over Vercel's automatic HTTPS.

For Phase 1 the "smallest capability" is expanded to the complete single-page shell (Hero → Projects → About → Skills → Social Proof → Contact) because the roadmap defines Phase 1 as "the credible live site," not a throwaway probe. The stack is still proven the walking-skeleton way: one framework, one content source, one render path, one deploy target — established once here and reused unchanged by every later slice.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.2.10 (App Router, React 19.2.7) | Locked stack (`.claude/CLAUDE.md`); RSC + per-route SSG give zero-client-JS static pages and fastest LCP for mostly-static content. Turbopack is the default in 16 (no `--turbopack` flag; a custom webpack config would break `next build`). |
| Language / typing | TypeScript `^5` (resolves to 5.9.x) | `create-next-app` pins `^5` in devDependencies regardless of npm's `latest` (7.0.2 tsgo). Do NOT manually pin TS 7. |
| Data layer | Typed TS content modules under `src/content/*.ts` | No DB, no CMS, no runtime fetch. Content volume is a handful of static records; imported at build time into server components. |
| Styling / design system | Tailwind CSS v4 `@theme` (OKLCH tokens) + shadcn/ui copy-in primitives (`button`, `card`, `badge`) | Dark-mode-only (no `next-themes`). ≤3 accent colors centralized in `globals.css` per SITE-02 / UI-SPEC. `lucide-react` for icons. |
| Fonts | Geist Sans (headings/body) + Geist Mono (labels/tech-tags) via `next/font` | Default scaffold pairing, zero added dependency; Geist Mono is the phase's restrained "web3 flavor" cue (UI-SPEC). |
| Motion | CSS-only (Tailwind transitions + `IntersectionObserver` fade-up, `prefers-reduced-motion` respected) | Do NOT install `motion` this phase — adds client JS with no payoff and works against future Lighthouse targets. |
| Auth | None | Entire site is public marketing content; no sessions, no cookies, no protected resources this phase. |
| Testing | Vitest 4.x + `@testing-library/react` + jsdom | Scoped to content/link/text presence that can silently regress; visual/responsive checks handled by manual UAT + Lighthouse (later phase). |
| Deployment target | Vercel (GitHub Git integration), custom apex domain `danielcross.dev`, automatic HTTPS | No local Vercel CLI required; production deploy on push to `main`. Apex domain via A record (`76.76.21.21`) or Vercel nameservers — never a CNAME at apex. |
| Security headers | `next.config.ts` `headers()` — `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` | One-line, zero-cost hardening for a public no-auth site (RESEARCH V14 Configuration). |
| Directory layout | `src/app` (routes), `src/components/{layout,sections,ui}`, `src/content`, `src/lib` | Matches RESEARCH "Recommended Project Structure"; sections are RSC by default, client boundaries only for the mobile-menu toggle and the copy-email button. |

## Stack Touched in Phase 1

- [x] Project scaffold (Next.js + Tailwind v4 + shadcn/ui + ESLint + Vitest test runner) — Plan 01
- [x] Routing — one real route (`src/app/page.tsx`, the single scroll page) — Plans 01–04
- [ ] Database — N/A (no DB this project; the "data layer" is typed TS content modules, exercised via real build-time reads in `src/content/*.ts`) — Plans 02–04
- [x] UI — interactive elements wired without a backend: sticky header mobile-menu toggle + click-to-copy-email button — Plans 02, 04
- [x] Deployment — live on Vercel at `danielcross.dev` over HTTPS — Plan 05

## Out of Scope (Deferred to Later Slices)

> Explicit list so later phases never re-litigate Phase 1's minimalism.

- MDX case-study pipeline (`next-mdx-remote`, `remark-gfm`, `rehype-pretty-code`) — Phase 2
- Solana wallet demo (`@solana/wallet-adapter-*`, `@solana/web3.js`) and its own route — Phase 3
- `react-native-web` / `nativewind` mobile device-frame demos — Phase 4
- Lighthouse hardening pass, zero-broken-link audit, ENS/easter-egg crypto signature — Phase 5
- Contact form / backend / `resend` / `zod` — explicitly excluded (D-12: direct links only)
- Light mode / `next-themes` — excluded (dark-mode-only)
- `@vercel/analytics` — deferred (optional, zero rework cost to add later)
- Multiple screenshots / carousel per project — one still per card (D-10)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: Decision-driven case studies at their own routes (`src/app/work/[slug]`), linked from the project cards this phase builds.
- Phase 3: Live Solana devnet wallet demo on its own route, with recorded-fallback.
- Phase 4: Device-frame + `react-native-web` live mobile component demos.
- Phase 5: Launch hardening (Lighthouse ≥90 all routes, zero broken links) + subtle crypto-native identity touch.
