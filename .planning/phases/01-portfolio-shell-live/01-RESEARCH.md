# Phase 1: Portfolio Shell, Live - Research

**Researched:** 2026-07-09
**Domain:** Next.js 16 App Router scaffolding, Tailwind v4 + shadcn/ui setup, static content architecture, Vercel custom-domain deployment — for a single-page marketing/portfolio shell (no wallet demo, no MDX case studies yet)
**Confidence:** HIGH (stack/setup mechanics verified against npm registry and official docs/source); MEDIUM (deployment/DNS specifics, cross-checked web sources)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Page architecture**
- **D-01:** Single-page scroll — one landing page with anchor navigation. Case studies and the wallet demo become their own routes in later phases.
- **D-02:** Sticky minimal header — name/logo left; anchor links (About, Projects, Contact) plus GitHub icon right. Satisfies IDENT-04's "GitHub reachable from header".
- **D-03:** Section order: Hero → Projects → About/Experience → Skills → Social proof → Contact. Projects lead because the site's core value is "proof within a minute".
- **D-04:** Deploy on Vercel — hobby tier, custom domain danielcross.dev, automatic HTTPS.

**Above-the-fold hero**
- **D-05:** Headline leads with role + MetaMask hook — name, then framing like "Senior React Native / Web3 Engineer — ex-MetaMask, now building on Solana". Exact copy at planner/executor discretion.
- **D-06:** Text-only hero — typography-led, no headshot. (A photo may appear in About, but is not required.)
- **D-07:** Subhead carries concrete numbers — e.g. "Shipped features to a 30M+ user wallet at MetaMask; now lead engineer on a Solana prediction market". Numbers do the convincing.
- **D-08:** Two CTAs: primary "View work" (scrolls to Projects), secondary "Get in touch" (anchors to Contact). GitHub stays in the header, not a hero CTA.

**Project showcase cards**
- **D-09:** Featured stack layout — full-width horizontal cards stacked vertically (not a uniform grid). Reads as "3 deep projects", per research finding that depth beats grids.
- **D-10:** Each card contains: app screenshot/still, 2–3 sentence outcome-focused blurb, small tech-tag row, and links. Phase 2 will add "Read case study" links to these cards.
- **D-11:** Links are best-available per project, no forced uniformity:
  - footballAlpha → live app / App Store link (**confirm live URL/status before finalizing content** — flagged in STATE.md Blockers)
  - MetaMask → "my role" framing + link to the public app/store listing (no private repo links; NDA-safe)
  - Keggy → App Store link + open-source game-data repo

**Contact & availability**
- **D-12:** Direct links only — no contact form, no backend, no Resend. Prominent mailto (hello@danielcross.dev) + LinkedIn + GitHub.
- **D-13:** Dual-path availability blurb, one line per path: "Contract — via The App Forge AB (outside IR35, UK/EU remote)" and "Full-time — open to senior/staff crypto roles."
- **D-14:** Contact is a full closing section — short pitch, dual-path blurb, big email/LinkedIn links; the page's conversion endpoint. Footer below carries only small repeat links.
- **D-15:** Email shown as visible text with click-to-copy affordance plus mailto link. Spam-scraping risk accepted; zero friction wins.

### Claude's Discretion
- Project count (3 vs 4): planner decides based on available content/assets. Baseline three are footballAlpha, MetaMask, Keggy; a fourth only if strong content exists.
- Exact hero/headline copywriting, within the D-05/D-07 framing.
- Visual design specifics (accent palette, typography, motion treatment) were deliberately not discussed — the roadmap flags `UI hint: yes` for this phase; run `/gsd-ui-phase 1` for a design contract, constrained by SITE-02 (dark-mode-first, ≤3 accent colors, professional foundation with subtle web3 flavor).

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| IDENT-01 | Visitor sees name, senior React Native/Web3 role, and ex-MetaMask credibility hook above the fold without scrolling | Hero section pattern (text-only, `preload` on any hero art), semantic `<h1>`/`<p>` structure in App Router root page — see Architecture Patterns, Common Pitfalls (hero image LCP) |
| IDENT-02 | Visitor can read an about/experience section naming real employers | Content-as-typed-data pattern (Standard Stack → Content Architecture) — no MDX needed at this phase's content volume |
| IDENT-03 | Visitor sees a compact social proof row | Same typed-data content pattern; simple presentational component, no new dependency |
| IDENT-04 | Visitor can scan a plain grouped skills list and reach GitHub from header or hero | Sticky header pattern (Architecture), shadcn `button`/icon pattern with `lucide-react` |
| SHOW-01 | Visitor can browse 3-4 flagship projects each with live and/or source links | Featured-stack card layout (Architecture Pattern 2), `next/image` for screenshots (Code Examples) |
| CONV-01 | Visitor can contact Daniel directly and see availability for both engagement types | Direct-links contact pattern (no form, no Resend) — confirms D-12 needs zero new dependencies |
| SITE-01 | Site is live at danielcross.dev over HTTPS | Vercel custom apex-domain + automatic HTTPS setup (Deployment section) |
| SITE-02 | Site uses a dark-mode-first, restrained design system (≤3 accent colors) | Tailwind v4 `@theme` + shadcn/ui OKLCH tokens, `next-themes` explicitly skipped (dark-only per project stack decision) |

</phase_requirements>

## Summary

Phase 1 is a walking-skeleton scaffold: a brand-new Next.js 16 repo, Tailwind v4 + shadcn/ui wired up, one single-page route rendering six static sections (Hero → Projects → About → Skills → Social proof → Contact), and a production deploy to danielcross.dev on Vercel with HTTPS. Nothing in this phase needs MDX, a database, a form backend, or any Solana/wallet code — those are explicitly Phase 2+ concerns. The entire phase is content-as-typed-data (TypeScript objects/arrays for projects, employers, skills, social-proof items) rendered by plain server components, which keeps the bundle at effectively zero client JS except for whatever the UI-SPEC phase decides for the header's mobile menu and any motion micro-interactions.

The riskiest technical unknown flagged in prior project research — whether TypeScript's npm "latest" tag (7.0.2, the new Go-native compiler) would get installed — is resolved: `create-next-app`'s own template-generation source code (verified directly from the `vercel/next.js` GitHub repo) hardcodes `"typescript": "^5"` in `devDependencies` regardless of what `npm view typescript version` reports as latest. Running `create-next-app` will install the latest 5.x line (currently 5.9.3), not TypeScript 7. No workaround is needed; this is a non-issue, not a blocking one.

Next.js 16 introduced several breaking changes since 15 that are easy to trip on for a first-time scaffold: Turbopack is now the default (no `--turbopack` flag needed, and a custom webpack config will make `next build` fail), `params`/`searchParams` are fully async now, `next lint` has been removed in favor of running ESLint directly, and — most relevant to this phase's hero image — the `Image` component's `priority` prop is deprecated in favor of a new `preload` prop. The planner should write hero/above-the-fold image code using `preload={true}`, not `priority`.

**Primary recommendation:** Scaffold with `create-next-app@latest` (TypeScript + Tailwind + App Router + `src/` dir defaults), initialize shadcn/ui immediately after, build the six sections as server components fed by a small `src/content/` directory of typed data (no MDX), and deploy to Vercel via GitHub integration (not the Vercel CLI, which isn't installed locally) — pointing danielcross.dev's registrar at Vercel via an A record or Vercel nameservers for automatic HTTPS.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Hero/identity rendering | Frontend Server (SSR/SSG) | — | Static content, no interactivity required; render as a React Server Component for zero client JS and fastest LCP |
| Sticky header + anchor nav | Browser / Client | Frontend Server | Scroll-spy/active-link state (if any) needs client JS; the header markup itself is server-rendered, hydrated for interactivity |
| Project showcase cards | Frontend Server (SSR/SSG) | CDN / Static (images) | Card content is static data; screenshots served through `next/image` static optimization pulling from `public/` or a CDN-hosted asset |
| About/Skills/Social-proof sections | Frontend Server (SSR/SSG) | — | Pure static content, no runtime data source |
| Contact section (mailto/LinkedIn/GitHub links) | Frontend Server (SSR/SSG) | Browser / Client (click-to-copy) | Links themselves are static markup; the "click to copy email" affordance (D-15) needs a small client-side clipboard interaction |
| Content data (projects, employers, skills, social proof) | Frontend Server (build-time) | — | Typed TS modules in `src/content/`, imported at build time — no CMS, no database, no runtime fetch (explicitly out of scope) |
| Hosting/HTTPS/domain | CDN / Static | — | Vercel's edge network serves the static/SSG output; TLS terminates at Vercel's edge, not in application code |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.10 | React meta-framework, App Router, build/deploy target | [VERIFIED: npm registry] Matches locked project stack (`.claude/CLAUDE.md`). Confirmed current via `npm view next version`. |
| `react` / `react-dom` | 19.2.7 | UI runtime | [VERIFIED: npm registry] Required peer of Next.js 16; confirmed current. |
| `typescript` | `^5` (resolves to 5.9.3 at time of research) | Type safety | [VERIFIED: vercel/next.js source] `create-next-app`'s template generator (`packages/create-next-app/templates/index.ts` on the `canary` branch) hardcodes `typescript: "^5"` in devDependencies — it does **not** pick up npm's `latest` dist-tag (7.0.2, the new Go-native compiler, stable since Jan 2026). Running the standard scaffold command is safe; no manual pin override needed. This resolves the flag raised in prior project STACK.md research. |
| `tailwindcss` + `@tailwindcss/postcss` | 4.3.2 | Styling, CSS-first `@theme` config | [VERIFIED: npm registry + vercel/next.js source] `create-next-app` installs `tailwindcss: "^4"` and `@tailwindcss/postcss: "^4"` by default when the Tailwind option is selected. |
| `eslint` + `eslint-config-next` | `^9` (ESLint) / current `eslint-config-next` | Linting | [VERIFIED: vercel/next.js source] Confirmed via the actual template generator: `eslint: "^9"`, `eslint-config-next` resolved to its current published version at scaffold time. Next.js 16 removed the `next lint` command — lint via the ESLint CLI directly (`eslint .` / editor integration), matching CLAUDE.md's existing guidance. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `shadcn` (CLI) | 4.13.0 | Copy-in-repo UI primitives (button, card, badge, etc.) | [VERIFIED: npm registry] Run immediately after scaffold: `npx shadcn@latest init`, then `npx shadcn@latest add button card badge` for this phase's actual needs (header CTA buttons, project cards, tech-tag badges). Package name is `shadcn`, not the old `shadcn-ui`. |
| `lucide-react` | 1.23.0 | Icon set (GitHub icon in header, copy-icon for email) | [VERIFIED: npm registry] Default icon set shadcn/ui is built around. |
| `class-variance-authority` | 0.7.1 | Variant styling for shadcn components | [VERIFIED: npm registry] Auto-added by `shadcn add`; do not install manually unless a shadcn component's generated code references it and it's missing. |
| `clsx` | 2.1.1 | Conditional className joining | [VERIFIED: npm registry] Tiny utility, standard shadcn companion. |
| `motion` | 12.42.2 | Optional restrained scroll-reveal/hover micro-interactions | [VERIFIED: npm registry] Only pull in if the UI-SPEC (run `/gsd-ui-phase 1` per Claude's Discretion note) calls for motion beyond CSS transitions. Import path is `motion/react`, not the old `framer-motion` package name. |
| `@vercel/analytics` | 2.0.1 | Pageview analytics on Vercel hosting | [VERIFIED: npm registry] Zero-config, one `<Analytics />` component in root layout. Low-cost, matches project research's P1 recommendation — include if the planner wants launch-day visibility into whether recruiters reach the Projects section; safe to defer to a later phase without any rework cost. |

### Explicitly NOT needed this phase

| Library | Why not now | When it becomes relevant |
|---------|-------------|---------------------------|
| `next-mdx-remote`, `remark-gfm`, `rehype-pretty-code` | Phase 1 has no prose case studies — project cards need only structured data (title, blurb, links, tags, screenshot path), not MDX rendering. Introducing the MDX pipeline now is unused complexity until Phase 2. | Phase 2 (case studies) |
| `@solana/wallet-adapter-*`, `@solana/web3.js` | No wallet demo in this phase (D-11 explicitly defers "Read case study"/demo links) | Phase 3 |
| `react-native-web`, `nativewind` | No mobile device-frame demo in this phase | Phase 4 |
| `next-themes` | Project decision: dark-mode-only, no toggle (D-14/SITE-02 imply a fixed dark palette; CLAUDE.md explicitly says skip this) | Only if a future decision reverses dark-only |
| `zod`, `resend` | D-12 locks contact to direct links only — no form, no backend, no server-side validation needed | Only if a contact-form decision is reversed |

**Installation (this phase only):**
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --import-alias "@/*"
npx shadcn@latest init
npx shadcn@latest add button card badge
npm install lucide-react
npm install motion              # only if UI-SPEC calls for JS-driven motion beyond CSS
npm install @vercel/analytics   # optional, low-cost, can defer
```

**Version verification performed:** All Core/Supporting versions above were checked live via `npm view <pkg> version` on 2026-07-09 and cross-referenced against the `vercel/next.js` repository's actual `create-next-app` template-generation source (`packages/create-next-app/templates/index.ts`, `canary` branch) to confirm exactly what the scaffold command installs — not just what `npm view` reports as "latest".

## Package Legitimacy Audit

All packages recommended for this phase exist on the npm registry, have official-org GitHub repos, and carry no suspicious postinstall scripts. Several are flagged `SUS` by the automated legitimacy check purely because their **latest version** was published very recently (`too-new` signal) — this is expected and benign for high-velocity, high-download packages (Next.js, TypeScript, Tailwind, lucide-react, motion, shadcn all ship frequent releases and have tens to hundreds of millions of weekly downloads from their official maintainer orgs). Per protocol these are kept and flagged, not removed, but the actual risk is assessed as negligible given the download/repo signals below.

| Package | Registry | Weekly Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-------------------|--------------|---------|-------------|
| `next` | npm | 41.8M | github.com/vercel/next.js | SUS (`too-new` — recency of latest publish only) | Approved — planner should add a lightweight `checkpoint:human-verify` before first install per protocol, but risk is negligible (official Vercel org, 41M+ weekly downloads) |
| `react` / `react-dom` | npm | 146M / 138M | github.com/facebook/react | OK | Approved |
| `typescript` | npm | 211M | github.com/microsoft/TypeScript | SUS (`too-new`) | Approved — see Standard Stack note; scaffold pins `^5`, does not pull the flagged-latest `7.0.2` |
| `tailwindcss` / `@tailwindcss/postcss` | npm | 123.9M / 23.8M | github.com/tailwindlabs/tailwindcss | SUS (`too-new`) | Approved |
| `lucide-react` | npm | 84.3M | github.com/lucide-icons/lucide | SUS (`too-new`) | Approved |
| `class-variance-authority` | npm | 57.2M | github.com/joe-bell/cva | OK | Approved |
| `clsx` | npm | 106.4M | github.com/lukeed/clsx | OK | Approved |
| `motion` | npm | 14.6M | github.com/motiondivision/motion | SUS (`too-new`) | Approved (only install if UI-SPEC requires it) |
| `@vercel/analytics` | npm | 4.2M | github.com/vercel/analytics | OK | Approved |
| `shadcn` (CLI) | npm | 5.9M | github.com/shadcn-ui/ui | SUS (`too-new`) | Approved — CLI tool, not a runtime dependency; components are copied into the repo as source, not installed as a package |

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** `next`, `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `lucide-react`, `motion`, `shadcn` — all flagged solely on the `too-new` (latest-publish-recency) heuristic, not on download count, missing repo, or postinstall-script signals. The planner should add one `checkpoint:human-verify` task before the initial `npm install` step covering this whole batch (not one per package) since they're all installed together in the scaffold step and share the same benign explanation.

## Architecture Patterns

### System Architecture Diagram

```
[Visitor] --HTTPS--> [Vercel Edge / CDN]
                            |
                            v
              +---------------------------+
              |  Next.js 16 App Router    |
              |  app/page.tsx (RSC)       |
              |  - renders on request/    |
              |    build via SSG          |
              +-------------+-------------+
                            |
        reads at build time |
                            v
              +---------------------------+
              |  src/content/*.ts         |
              |  (typed data: projects,   |
              |   employers, skills,      |
              |   social-proof entries)   |
              +---------------------------+
                            |
        composes into      |
                            v
   Header (sticky, anchor nav + GitHub icon)
        |
        v
   Hero -> Projects -> About/Experience -> Skills -> Social Proof -> Contact
        |                    |                              |
        v                    v                              v
  next/image (screenshots, preload=true for hero art if any)
                                                        mailto: / https:// links
                                                        (LinkedIn, GitHub — no backend call)
                            |
                            v
              +---------------------------+
              | Static HTML + minimal JS  |
              | bundle served from Vercel |
              | edge, TLS terminated at   |
              | edge (danielcross.dev)    |
              +---------------------------+
```

A visitor's request never touches a database or API route in this phase — everything resolves from build-time-imported TypeScript content modules into static (or near-static) HTML, with the only client-side JS being whatever interactivity the header/mobile-nav and click-to-copy-email affordance need.

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx        # root layout: fonts, <html> dark class, metadata, analytics
│   ├── page.tsx           # the single scroll page — composes all sections in order
│   └── globals.css        # Tailwind v4 @theme tokens, dark palette, ≤3 accent colors
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # sticky header, anchor nav, GitHub icon (D-02)
│   │   └── Footer.tsx      # small repeat links only (D-14)
│   ├── sections/
│   │   ├── Hero.tsx         # D-05..D-08
│   │   ├── Projects.tsx     # D-09..D-11, maps content/projects.ts
│   │   ├── About.tsx        # IDENT-02
│   │   ├── Skills.tsx       # IDENT-04 skill list (grouped, no bars)
│   │   ├── SocialProof.tsx  # IDENT-03
│   │   └── Contact.tsx      # D-12..D-15
│   └── ui/                  # shadcn-generated primitives (button, card, badge)
├── content/
│   ├── projects.ts          # typed array: title, blurb, links, tags, screenshot path
│   ├── employers.ts         # MetaMask, The App Forge, Hackberry, Yomento, BookingGo
│   ├── skills.ts             # grouped skill lists
│   └── social-proof.ts       # ex-MetaMask, Evo Nordics podcast, Football Ramble/App Store
├── lib/
│   └── utils.ts              # cn() helper (clsx + tailwind-merge, shadcn default)
└── public/
    └── screenshots/           # project screenshots served via next/image
```

### Pattern 1: Server-Components-by-Default, No Client Boundary Unless Needed

**What:** Every section component (Hero, Projects, About, Skills, SocialProof, Contact) is a plain React Server Component with zero `'use client'` directives. Only the header's mobile-menu toggle (if any) and the email click-to-copy button need a client boundary.
**When to use:** Always for this phase — there is no wallet code, no MDX runtime, no form state to justify client-side JS for the bulk of the page.
**Example:**
```typescript
// app/page.tsx — Server Component (default, no 'use client')
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { SocialProof } from '@/components/sections/SocialProof'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <About />
      <Skills />
      <SocialProof />
      <Contact />
    </main>
  )
}
```

### Pattern 2: Featured-Stack Project Cards from Typed Content

**What:** Project cards (D-09) are rendered by mapping over a typed array in `src/content/projects.ts`, not MDX or a CMS query.
**Example:**
```typescript
// src/content/projects.ts
export type Project = {
  slug: string
  name: string
  blurb: string           // 2-3 sentence outcome-focused copy (D-10)
  tags: string[]           // small tech-tag row
  screenshot: string       // path under public/screenshots/
  links: { label: string; href: string }[]  // best-available per project (D-11)
}

export const projects: Project[] = [
  {
    slug: 'football-alpha',
    name: 'footballAlpha',
    blurb: '…',
    tags: ['Solana', 'React Native', 'Expo'],
    screenshot: '/screenshots/football-alpha.png',
    links: [{ label: 'Live app', href: 'https://…' }],
  },
  // MetaMask, Keggy, …
]
```
```typescript
// components/sections/Projects.tsx
import Image from 'next/image'
import { projects } from '@/content/projects'

export function Projects() {
  return (
    <section id="projects" className="flex flex-col gap-16">
      {projects.map((p) => (
        <article key={p.slug} className="flex flex-col gap-4 md:flex-row md:items-center">
          <Image
            src={p.screenshot}
            alt={`${p.name} screenshot`}
            width={640}
            height={400}
            className="rounded-lg"
            // preload only if this is the first/above-the-fold card — see Pitfall below
          />
          <div>
            <h3>{p.name}</h3>
            <p>{p.blurb}</p>
            {/* tag row, link row */}
          </div>
        </article>
      ))}
    </section>
  )
}
```

### Pattern 3: Sticky Header with Anchor Navigation (No Router Navigation)

**What:** Since D-01 keeps everything on one route, the header's nav links are plain `<a href="#projects">`-style anchors (or Next's `<Link href="#projects">`, which App Router treats as same-page scroll), not route changes.
**When to use:** For this phase's single-page structure. When Phase 2/3 add real routes (case studies, wallet demo), those become actual `<Link href="/work/[slug]">` navigations — keep the two patterns distinct so the header doesn't need to know which anchors are same-page vs. cross-route until that phase.
**Trade-off:** Next.js 16 stopped auto-overriding CSS `scroll-behavior: smooth` during **route transitions** (see Common Pitfalls) — this doesn't affect same-page anchor scrolling (that's native browser behavior via `scroll-behavior: smooth` in CSS), but is worth knowing if a later phase adds cross-route anchor links.

### Anti-Patterns to Avoid

- **Reaching for MDX in this phase:** the project's own research (`.planning/research/STACK.md`) recommends `next-mdx-remote` for case studies — that's a Phase 2 concern. Installing and configuring an MDX pipeline now to render six sections of structured, non-prose content is unused complexity that has to be maintained without payoff until Phase 2 actually needs it.
- **Wrapping the whole app in a client boundary "to be safe":** a single `'use client'` at a high layout level forces every section below it into the client bundle, working against the fast/static goal SITE-03 (Lighthouse ≥90) will later measure.
- **Using `priority` on `next/image`:** deprecated as of Next.js 16.0.0 in favor of `preload` — see Common Pitfalls.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Accessible button/card/badge primitives | Custom styled `<div>`-based components from scratch | `shadcn/ui` copy-in components (`button`, `card`, `badge`) | Already accounts for focus states, ARIA attributes, and Tailwind v4 token integration — hand-rolling these for a portfolio adds real accessibility risk (keyboard focus, contrast) for zero benefit over the copy-in primitives, which remain fully restylable |
| Click-to-copy email affordance | A custom clipboard-permission dance | `navigator.clipboard.writeText()` in a small client component, feature-detected with a `mailto:` fallback link always present | Native Clipboard API is the standard, zero-dependency way to do this; D-15 already requires the mailto link to exist regardless, so the copy button is a small enhancement, not the only path |
| Responsive image delivery | Manual `<picture>`/srcset generation for project screenshots | `next/image` | Automatic format negotiation (WebP/AVIF), responsive `sizes`, and layout-shift prevention are built in; hand-rolling this for even 3-4 screenshots reproduces a solved problem |
| Dark-mode color tokens | Ad hoc hex values scattered through components | Tailwind v4 `@theme` block in `globals.css` defining OKLCH tokens once | Centralizes the ≤3-accent-color constraint (SITE-02) in one place the UI-SPEC phase can govern, instead of it silently drifting per-component |

**Key insight:** Everything in this phase is either (a) already solved by the locked stack's copy-in component library, or (b) genuinely simple enough (typed content arrays, mailto links) that adding a dependency would be the over-engineering mistake, not the under-engineering one.

## Common Pitfalls

### Pitfall 1: `npm view typescript version` reports 7.0.2 — do not manually pin it

**What goes wrong:** A planner or executor sees `typescript@latest` resolve to `7.0.2` (the new Go-native "tsgo" compiler, stable since January 2026) and either manually pins it or panics about compatibility.
**Why it happens:** TypeScript's npm `latest` dist-tag now points to the 7.x line; this is a real, intentional stable release (not a hijacked package), confirmed via `npm dist-tag ls typescript`.
**How to avoid:** Just run the standard `create-next-app` scaffold — verified directly from its source, it pins `"typescript": "^5"` in `devDependencies`, which resolves to the latest 5.x release (5.9.3 at research time), not 7.x. No override needed.
**Warning signs:** `package.json` showing `"typescript": "^5"` after scaffold is correct and expected — do not "fix" it to match `npm view`'s latest tag.

### Pitfall 2: Using the deprecated `priority` prop on the hero/first project image

**What goes wrong:** Copy-pasting `next/image` examples from pre-16 tutorials that use `<Image priority ... />` for above-the-fold LCP images.
**Why it happens:** `priority` was the standard prop through Next.js 15; it still works but is deprecated as of 16.0.0.
**How to avoid:** Use `preload={true}` instead for whichever single image is the actual LCP element (if the hero is text-only per D-06, this most likely applies to the *first* project card's screenshot, which will be the largest above/near-the-fold image once a visitor scrolls slightly). Do not set `preload` on more than one or two images — it competes for bandwidth exactly like the old `priority` misuse did.
**Warning signs:** ESLint/TS won't necessarily flag deprecated-but-still-functional props — verify manually against the current `next/image` API reference during code review.

### Pitfall 3: Assuming `next lint` still exists

**What goes wrong:** CI scripts or local habit running `next lint`, which was removed in Next.js 16.
**How to avoid:** Use the ESLint CLI directly (`eslint .`) or the `lint` script `create-next-app` now generates, which already wires `eslint-config-next`'s flat config (`eslint.config.mjs`) — confirmed present in the current scaffold template.
**Warning signs:** `next lint` exits with a "command not found"-style error or deprecation notice.

### Pitfall 4: Treating Vercel CLI as required for deployment

**What goes wrong:** Assuming `vercel` CLI must be installed locally to ship to production; it is not installed in this environment (`command -v vercel` returns nothing).
**How to avoid:** Connect the GitHub repo to a new Vercel project via the Vercel dashboard (Vercel's standard Git-integration flow) — this gets automatic preview deployments per push and a production deployment on merge to `main` without any local CLI install. The Vercel CLI (`npx vercel`) remains a fallback for one-off manual deploys, not a hard requirement.
**Warning signs:** A plan step that blocks on "install Vercel CLI globally" when the dashboard Git-integration path needs no local tooling beyond `git push`.

### Pitfall 5: Apex domain (`danielcross.dev`) DNS misconfiguration

**What goes wrong:** Trying to set a `CNAME` record at the domain apex (`@`), which most DNS providers reject per RFC 1034 (a node with a CNAME can't have other records, but an apex needs NS/MX records too).
**How to avoid:** Use an `A` record pointing `@` at Vercel's IP (`76.76.21.21` per current Vercel docs), or use Vercel-assigned nameservers, or an `ALIAS`/`ANAME` record if the registrar supports one. Vercel auto-issues the TLS certificate once DNS verification succeeds (typically within minutes; propagation itself can take up to ~1 hour typically, worst case 48 hours).
**Warning signs:** Domain shows "Invalid Configuration" in the Vercel dashboard, or HTTPS cert provisioning stalls — almost always a DNS record-type mismatch, not a Vercel-side issue.

## Code Examples

### Root layout with dark-only theme, no next-themes

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Daniel Cross — Senior React Native / Web3 Engineer',
  description: 'Ex-MetaMask engineer building on Solana. React Native, Web3, and shipped products.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
```
Source: pattern derived from Next.js official App Router root-layout convention [CITED: nextjs.org/docs/app/api-reference/file-conventions/layout]; `next-themes` intentionally omitted per locked stack decision (dark-mode-only, no toggle).

### Click-to-copy email with mailto fallback (D-15)

```tsx
// components/sections/Contact.tsx (client boundary only for the copy button)
'use client'
import { useState } from 'react'

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(email)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      aria-label="Copy email address"
    >
      {copied ? 'Copied!' : email}
    </button>
  )
}
```
The `<a href={`mailto:${email}`}>` link should render alongside this, not be replaced by it, per D-15 ("visible text with click-to-copy affordance plus mailto link").

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `next lint` | `eslint` CLI directly (or Biome, which `create-next-app` now offers as an alternative default) | Next.js 16.0.0 | CI/lint scripts must call `eslint .`, not `next lint` |
| `<Image priority />` | `<Image preload={true} />` | Next.js 16.0.0 | Rename only; behavior equivalent for the single LCP image use case |
| Manual `--turbopack` flag | Turbopack default for `next dev`/`next build` | Next.js 16.0.0 | Custom webpack configs now fail the build unless `--webpack` is passed explicitly |
| Synchronous `params`/`searchParams` (with temporary back-compat shim) | Fully async, no sync fallback | Next.js 16.0.0 (shim removed; was deprecated since 15) | Not directly exercised by this phase's single static route, but relevant the moment Phase 2 adds `app/work/[slug]/page.tsx` |
| `images.domains` config | `images.remotePatterns` | Deprecated, still Next.js 16 | Only relevant if screenshots are ever loaded from a remote host instead of `public/` |

**Deprecated/outdated:** `next/legacy/image` (use `next/image`); `framer-motion` package name (use `motion`, same team/API); `shadcn-ui` package name (renamed to `shadcn`).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|----------------|
| A1 | footballAlpha, MetaMask public listing, and Keggy links are all currently live and stable enough to link at launch | Standard Stack / Project cards | Already flagged as an open blocker in STATE.md ("Confirm footballAlpha's live URL/status before finalizing content") — the planner must resolve this before content is finalized, not assume it's still resolved by research time |
| A2 | A single project screenshot per card is sufficient (no image carousel/gallery per project) | Architecture Patterns, Pattern 2 | Low — D-10 specifies "app screenshot/still" (singular), so this reads as a locked decision rather than a true assumption, but flagging since no CONTEXT.md line explicitly forbids a gallery |
| A3 | `@vercel/analytics` is worth including in Phase 1 rather than deferred | Standard Stack | Low — purely additive/optional; if wrong, it's a zero-cost removal, not a rework |

## Open Questions

1. **Exact DNS provider for danielcross.dev**
   - What we know: Domain is already owned (per project constraints); Vercel supports A-record, ALIAS, or nameserver-delegation paths depending on registrar capability.
   - What's unclear: Which registrar holds danielcross.dev, and whether it supports ALIAS/ANAME records (simpler) or requires the A-record + `www` CNAME combination.
   - Recommendation: Planner should add a task to check the registrar's DNS record-type support before writing the exact DNS-configuration step; default to the A-record approach (works universally) if the registrar is unknown at plan time.

2. **Whether the hero needs any image at all, given D-06 (text-only hero)**
   - What we know: D-06 explicitly says text-only, no headshot required.
   - What's unclear: Whether the "preload the LCP image" pitfall (Pitfall 2) even applies to the Hero section, or whether the actual LCP element ends up being the first Projects card screenshot once a visitor's viewport includes it during initial paint on smaller screens.
   - Recommendation: Verify actual LCP element via Lighthouse/Chrome DevTools once the page is built, and apply `preload={true}` to whichever single image measures as LCP — don't guess at plan time.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|--------------|-----------|---------|----------|
| Node.js | Next.js 16 (requires 20.9+) | ✓ | v24.13.0 | — |
| npm | Package installation | ✓ | 11.8.0 | — |
| git | Version control, Vercel Git integration | ✓ | 2.50.1 | — |
| gh (GitHub CLI) | Repo creation/push for Vercel Git integration | ✓ | 2.87.3 | — |
| Vercel CLI | Manual/local deploys (optional) | ✗ | — | Use Vercel dashboard's Git integration instead (push to GitHub, connect repo in Vercel UI) — no local CLI required for the standard deploy flow |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** Vercel CLI — dashboard Git integration fully replaces it for this phase's deployment needs (see Common Pitfalls, Pitfall 4).

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.10 + `@testing-library/react` 16.3.2 (not yet installed — greenfield repo) |
| Config file | none — see Wave 0 |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --coverage` |

Given this phase is a mostly-static, no-backend, no-form marketing shell, the majority of its success criteria (visual hierarchy, above-the-fold content, dark theme, responsiveness) are more effectively verified through Lighthouse and manual UAT than unit tests. Recommend a small Vitest + React Testing Library suite scoped to the few things that *can* silently regress in code: presence of required text/links in each section, not visual layout.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|---------------------|--------------|
| IDENT-01 | Hero renders name, role, and MetaMask hook text | unit (RTL render + text query) | `npx vitest run src/components/sections/Hero.test.tsx` | ❌ Wave 0 |
| IDENT-02 | About section lists all five named employers | unit | `npx vitest run src/components/sections/About.test.tsx` | ❌ Wave 0 |
| IDENT-04 | Header contains a GitHub link with the correct href | unit | `npx vitest run src/components/layout/Header.test.tsx` | ❌ Wave 0 |
| SHOW-01 | Projects section renders 3-4 project cards, each with at least one link | unit | `npx vitest run src/components/sections/Projects.test.tsx` | ❌ Wave 0 |
| CONV-01 | Contact section renders mailto link and both availability lines (contract + full-time) | unit | `npx vitest run src/components/sections/Contact.test.tsx` | ❌ Wave 0 |
| SITE-01 | Site resolves over HTTPS at danielcross.dev | manual-only (post-deploy check, not unit-testable pre-deploy) | `curl -I https://danielcross.dev` (post-deploy verification step) | n/a |
| SITE-02 | Dark theme applied, ≤3 accent colors | manual-only (visual/design-token audit, not meaningfully unit-testable) | Manual review against `@theme` token list in `globals.css` | n/a |

### Sampling Rate
- **Per task commit:** `npx vitest run` (fast, scoped to changed section)
- **Per wave merge:** `npx vitest run --coverage`
- **Phase gate:** Full suite green before `/gsd-verify-work`, plus a Lighthouse mobile run and the post-deploy HTTPS/link check called out above

### Wave 0 Gaps
- [ ] Install Vitest + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react`
- [ ] `vitest.config.ts` — jsdom environment, React plugin
- [ ] `src/components/**/*.test.tsx` — one smoke test per section component, per the map above
- [ ] No shared fixtures needed yet — content is static typed data, not mocked API responses

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|----------------|---------|--------------------|
| V2 Authentication | No | No auth in this phase (wallet auth is Phase 3) |
| V3 Session Management | No | No sessions/cookies created by this phase |
| V4 Access Control | No | No protected resources; entire site is public marketing content |
| V5 Input Validation | Minimal | No user-submitted input in this phase (D-12: no contact form). The only "input" is the visitor's own clipboard action (copy email) — no validation surface |
| V6 Cryptography | No | No crypto operations in this phase (Solana wallet crypto is Phase 3) |
| V14 Configuration | Yes | HTTPS enforced end-to-end by Vercel's automatic TLS (SITE-01); recommend setting standard security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`) via `next.config.ts` `headers()` — low-cost, standard hardening for a public site with no auth surface to otherwise secure |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|------------------------|
| Email harvesting/scraping of the visible `hello@danielcross.dev` text | Information Disclosure | Explicitly accepted risk per D-15 ("Spam-scraping risk accepted; zero friction wins") — no mitigation needed, this is a locked decision, not an open threat |
| Dependency supply-chain risk (malicious/typosquatted npm package) | Tampering | Covered by the Package Legitimacy Audit above; no packages in this phase carry a postinstall script or unverified-repo signal |
| Clickjacking of the whole marketing site | Tampering / Spoofing | Low real-world impact for a portfolio with no auth/transactions, but a `frame-ancestors 'none'` (or `'self'`) CSP / `X-Frame-Options: DENY` header is a one-line, zero-cost addition worth including in the same `next.config.ts` `headers()` pass as the V14 items above |

## Sources

### Primary (HIGH confidence)
- npm registry, `npm view <pkg> version` / `npm dist-tag ls typescript` — queried directly 2026-07-09 for `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `shadcn`, `lucide-react`, `class-variance-authority`, `clsx`, `motion`, `@vercel/analytics`, `next-themes`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `jsdom`, `playwright`.
- `vercel/next.js` GitHub repository, `canary` branch — direct source read of `packages/create-next-app/templates/index.ts` (confirms hardcoded `typescript: "^5"`, `tailwindcss: "^4"`, `eslint: "^9"` in generated `package.json`) and `packages/create-next-app/templates/app-tw/ts/{biome.json,eslint.config.mjs,tsconfig.json}` (confirms current template contents including Biome as an alternate lint/format option).
- `gsd-tools query package-legitimacy check` — ran against all Phase 1 npm dependencies 2026-07-09.

### Secondary (MEDIUM confidence)
- [nextjs.org: Upgrading to Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16) — official docs, fetched directly, confirms Turbopack default, async params, `next lint` removal, `middleware`→`proxy` rename, `next/image` changes.
- [nextjs.org: Image Component reference](https://nextjs.org/docs/app/api-reference/components/image) — official docs, confirms `priority` deprecated in favor of `preload` as of v16.0.0.
- [ui.shadcn.com: Next.js installation guide](https://ui.shadcn.com/docs/installation/next) — official shadcn docs, confirms `create-next-app` → `shadcn@latest init` → `shadcn@latest add` sequence.
- [vercel.com/docs/domains](https://vercel.com/docs/domains/set-up-custom-domain) and related Vercel domain docs (via WebSearch aggregation) — apex-domain A-record/ALIAS/nameserver options, automatic HTTPS provisioning timing.
- `.planning/research/{STACK.md, ARCHITECTURE.md, PITFALLS.md, FEATURES.md, SUMMARY.md}` — prior project-level research (2026-07-09), reused directly per instructions rather than re-derived; this phase's research narrows that project-wide research to Phase 1's specific walking-skeleton scope.

### Tertiary (LOWER confidence)
- General WebSearch aggregation on TypeScript 7.0 stable-release timeline (Project Corsa / Go-native compiler) — used only to confirm TS 7.0.2 is a legitimate, intentional release and not a registry anomaly; the actionable finding (create-next-app pins `^5`) is independently confirmed at HIGH confidence via direct source read, so this tertiary source doesn't carry planning risk.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version number confirmed live against the npm registry; the TypeScript-pinning question (the one open flag from prior project research) is resolved via direct source inspection, not inference.
- Architecture: HIGH — this phase's architecture is a direct, low-risk application of Next.js App Router defaults (server components, typed content, no client boundaries beyond two small interactive widgets); no novel patterns.
- Deployment (Vercel/DNS): MEDIUM — mechanics are standard and cross-checked across Vercel's own docs and independent guides, but the exact DNS record type needed depends on danielcross.dev's registrar, which wasn't verified in this session (see Open Questions).
- Pitfalls: HIGH for the Next.js 16-specific ones (sourced directly from official upgrade docs); MEDIUM for the DNS/Vercel-specific ones (web-aggregated but internally consistent).

**Research date:** 2026-07-09
**Valid until:** 2026-08-08 (30 days — stable framework/library versions, but Next.js and Tailwind both ship frequently; re-verify exact patch versions if planning is delayed more than a few weeks)

---
*Phase 1 research for: Portfolio Shell, Live*
*Researched: 2026-07-09*
