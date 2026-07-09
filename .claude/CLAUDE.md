<!-- GSD:project-start source:PROJECT.md -->

## Project

**danielcross.dev — Developer Portfolio**

A frontend portfolio site at danielcross.dev showcasing Daniel Cross as a senior React Native / Web3 engineer, leaning hard into his crypto credentials — ex-MetaMask (30M+ user wallet, billions in transactions), current lead engineer on footballAlpha (a Solana-based subjective opinion prediction market), and Solana/Rust skills. The site exists to land senior/staff crypto roles, supporting both contract engagements and full-time positions with crypto companies.

**Core Value:** A crypto hiring manager or founder lands on the site and within a minute believes "this person has shipped serious Web3 products" — proven through live, touchable demos rather than claims.

### Constraints

- **Domain**: danielcross.dev — already owned; site ships there
- **Timeline**: No hard deadline — quality over speed, despite active job search
- **Design**: Professional foundation with crypto-native touches — not full degen aesthetic, not sterile corporate
- **Content honesty**: MetaMask work is described from public knowledge/his role; case studies must respect any confidentiality around internal details

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js (App Router) | 16.2.10 | React meta-framework, routing, build | The default choice for a React portfolio in 2026 — file-based routing, built-in image/font optimization, and per-route static rendering (SSG) for the mostly-static content pages while still allowing client-side "islands" (wallet connect, device-frame demo) where interactivity is needed. Owner already knows React deeply; no reason to reach for a different meta-framework. |
| React | 19.2.7 | UI library | Required by Next.js 16. React 19 is what shadcn/ui, Tailwind v4, and the current Solana React packages all target — no version friction. |
| TypeScript | 5.x (repo should pin `5.x`, not `7.0.2`) | Type safety | Owner's primary language. Note: `npm view typescript version` returned `7.0.2` — verify this isn't a naming collision/beta channel before pinning; if TS 7 (the Go-ported compiler) isn't yet stable for Next.js tooling at build time, pin to the latest verified-stable `5.x` line instead. **Flag for verification at implementation time**, not a blocking issue for planning. |
| Tailwind CSS | 4.3.2 | Styling | v4's CSS-first config (`@theme`), OKLCH colors, and native cascade layers are now the default for new projects; shadcn/ui is built for v4. No reason to start a greenfield project on v3. |

### Solana / Web3 Layer

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `@solana/wallet-adapter-react` | 0.15.39 | Wallet connection state (React context/hooks) | Mature, ~1 year stable, by far the most battle-tested wallet-connection layer in the Solana ecosystem. Auto-detects installed wallets via the Wallet Standard (Phantom, Solflare, Backpack, etc.) with zero per-wallet config. For a **portfolio demo that must simply work when a hiring manager clicks it**, this is the lowest-risk choice — huge base of examples/Stack Overflow answers if something breaks. |
| `@solana/wallet-adapter-react-ui` | 0.9.39 | Pre-built connect button/modal | Ships an accessible wallet-select modal so you're not hand-rolling wallet UX; fully restyleable with Tailwind to match the site's design system. |
| `@solana/wallet-adapter-base` | 0.9.27 | Shared types/adapter interfaces | Peer dep of the above two. |
| `@solana/web3.js` | 1.x (legacy line) | `Connection`, `PublicKey`, `Transaction`, devnet RPC calls | Still the SDK wallet-adapter's React bindings are built around; pairing it with the newer `@solana/kit` adds a compatibility-shim layer (`@solana/web3-compat`) that's unnecessary complexity for a single demo flow (e.g., "connect wallet → show devnet balance → sign a memo/small transfer"). Deprecated long-term but not going away soon — the pragmatic choice for a one-person demo, not a production exchange. |

### Mobile-Demo / React Native-on-Web Layer

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `react-native-web` | 0.21.2 | Render React Native primitives/components in the browser | Actively maintained (published as recently as June 2026). Standard, only real option for embedding actual React Native component code (not a screenshot/video) into a Next.js page — lets a visitor interact with a genuinely-shared component, not a mockup. Must be isolated behind `"use client"` boundaries; RNW does not support React Server Components. |
| `nativewind` | 4.2.6 | Tailwind styling for React Native components | Only needed if the mobile components being demoed are already styled with NativeWind in the source app (keeps styling identical between native and web renders). Skip if the demoed components use vanilla `StyleSheet` — don't add a styling dependency you don't need. |

### Content / MDX Layer

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `next-mdx-remote` | 6.0.0 | Load and render MDX files (case studies, blog posts) | For a handful of case studies + blog posts (not a docs site), this is the minimum-complexity way to get MDX with embedded React components (e.g., an inline device-frame demo inside a case study). No schema-validation layer needed at this content volume. |
| `remark-gfm` | 4.0.1 | GitHub-flavored markdown (tables, strikethrough, task lists) | Standard remark plugin almost every MDX setup includes. |
| `rehype-pretty-code` | 0.14.4 | Syntax-highlighted code blocks in MDX | For code snippets in case studies (e.g., showing a Solana program excerpt) — renders via Shiki, matches VS Code themes. |

### Animation

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `motion` (formerly `framer-motion`) | 12.42.2 | Page transitions, scroll-linked reveals, gesture/hover micro-interactions | Framer Motion was renamed **Motion** in 2025 and is now published under the `motion` package name (`import from "motion/react"`). It's still the same team/API — do not install the old `framer-motion` name for a new project. ~30kB gzipped, hybrid engine (Web Animations API + ScrollTimeline) for 120fps performance; the standard choice for polished React animation in 2026. |

### UI Components

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `shadcn/ui` (CLI) | 4.13.0 | Copy-in-repo accessible component primitives (button, dialog, tabs, etc.) | Not an npm dependency — the CLI copies component source into your repo, giving full control to restyle for the "professional foundation + crypto-native touches" aesthetic. Fully updated for Tailwind v4 + React 19 (OKLCH colors, `data-slot` attributes, `tw-animate-css` instead of the deprecated `tailwindcss-animate`). This is the standard choice when you want a highly custom, non-templated visual identity (per the project's design constraint) rather than a themed component-library look. |
| `lucide-react` | 1.23.0 | Icon set | Default icon set shadcn/ui is built around; tree-shakeable, consistent stroke style. |
| `class-variance-authority` | 0.7.1 | Variant-based component styling (used internally by shadcn components) | Pulled in automatically by shadcn/ui generated components. |
| `clsx` | 2.1.1 | Conditional className joining | Tiny utility, standard companion to Tailwind. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | 4.4.3 | Runtime schema validation | If the contact/availability form does server-side validation, or if you validate MDX frontmatter shape without pulling in a full content-collection framework. |
| `resend` | 6.17.2 | Transactional email | If the "minimal contact/availability affordance" sends an email rather than linking out to Calendly/LinkedIn/mailto. Skip entirely if a simple `mailto:` or external booking link suffices — don't add an email-sending dependency for a one-field contact form unless you actually need inbox delivery. |
| `next-themes` | 0.4.6 | Dark/light mode toggle | Only if the "dark theme with subtle web3 flavor" should still offer a light mode. If the site is dark-mode-only by design (a defensible choice for this aesthetic), skip this entirely. |
| `@vercel/analytics` | 2.0.1 | Privacy-respecting pageview analytics | Lightweight, zero-config on Vercel hosting; useful to know if recruiters are actually reaching the demo sections. |
| `@vercel/og` | 0.11.1 | Dynamic OG image generation | Nice-to-have for social-share cards on blog posts/case studies (LinkedIn is a likely share channel for a job search). Not essential for MVP. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint + `eslint-config-next` | Linting | Ships with `create-next-app`; keep default config, add project-specific rules sparingly. |
| Prettier | Formatting | Standard; pair with Tailwind's official Prettier plugin (`prettier-plugin-tailwindcss`) to auto-sort class names. |
| Vercel CLI | Local preview matching production edge/runtime behavior | Useful when testing the wallet-connect flow, since it depends on `https` context for some wallet extensions. |

## Installation

# Core

# Solana / wallet

# Mobile-on-web demo

# (add nativewind only if the source mobile components already use it)

# Content / MDX

# Animation

# UI (component-by-component, not a bulk install)

# Supporting

# Dev dependencies

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| `@solana/wallet-adapter-react` + `web3.js` v1 | `@solana/kit` + `gill` (or `@solana/client` + `@solana/react-hooks`) | If you want the modern, tree-shakeable, actively-developed direction and are comfortable being an early adopter with fewer examples to lean on. Reasonable choice if this demo will be actively extended over the next year rather than shipped once and left alone. |
| Next.js on Vercel | Netlify | If you want a framework-agnostic host with built-in forms/auth/A-B testing, or you're already standardized on Netlify for other projects. Vercel remains the tighter fit specifically because Next.js is built by the same team — fewer edge cases with SSR/ISR/edge functions. |
| `next-mdx-remote` | Velite | If the content set grows substantially (dozens of case studies, multiple content types with cross-references) and you want compile-time schema validation + generated TypeScript types. Overkill at "a handful of case studies and blog posts." |
| Hand-rolled CSS/SVG device frame | `react-device-frame` / `react-device-frameset` | Neither — both packages are stale (last published 2022 and 2023 respectively) with no recent maintenance. Not recommended at any point; listed here only because they're the obvious search result. |
| shadcn/ui (copy-in components) | A full component library (e.g. Chakra, MUI) | If speed-to-ship matters more than a distinctive visual identity. Given the project's explicit design goal of avoiding a "templated defaults" look, shadcn's copy-in-repo model (full styling control) is the better fit here. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| `framer-motion` (old package name) | Renamed to `motion` in 2025; the old package name still resolves but you'd be tracking a deprecated alias instead of the actively maintained package. | `motion` (`import ... from "motion/react"`) |
| `react-device-frameset` / `react-device-frame` | Both unmaintained since 2022-2023 (stale dependencies, unmaintained peer-dep ranges, risk of breaking on new React/Next versions). | Static SVG/PNG device bezel + CSS positioning — a portfolio only needs 1-2 device frames, not a general-purpose library. Full control over the exact bezel styling too. |
| Running your own devnet faucet/airdrop-on-behalf-of-visitor server endpoint | Public Solana devnet faucets are already rate-limited per-wallet specifically to prevent abuse; standing up your own server-side airdrop endpoint on your own RPC key invites abuse/rate-limit exhaustion from random visitors, with no benefit over pointing users at `faucet.solana.com`. (Confidence: LOW — single-source finding, worth re-verifying at implementation time.) | Instruct the visitor to fund their own devnet wallet via the public faucet before connecting, or design the demo around a pre-funded, read-mostly PDA/vault the visitor observes/interacts with rather than one that dispenses funds. |
| Headless CMS (Contentful, Sanity, etc.) | Project explicitly scopes this out (see PROJECT.md: "CMS or admin panel" is Out of Scope) — content volume is small enough that files-in-repo + MDX is simpler and has zero ongoing cost/vendor dependency. | MDX files in the repo, edited directly. |
| `@solana/wallet-adapter-wallets` (bulk wallet-adapter package) | Deprecated pattern from before Wallet Standard auto-detection; bundles adapters for wallets that may not even be installed, bloating the bundle. | Rely on Wallet Standard auto-detection (built into `wallet-adapter-react` 0.15+) — installed wallets register themselves automatically. |

## Stack Patterns by Variant

- Use `@solana/web3.js`'s `Transaction`/`sendAndConfirmTransaction` with the wallet adapter's `signTransaction`.
- Because this is the path with the most existing examples for exactly this flow (connect → build tx → sign via wallet → confirm), minimizing the chance of an obscure bug surfacing in front of a hiring manager.
- Consider skipping `react-native-web` entirely and using a screen-recording/video or a static image inside the device frame instead.
- Because RNW adds real integration complexity (bundler config, "use client" boundaries, possible styling drift from the native app) — only worth it if the interactivity itself is part of the proof ("this is a real, running component, not a screenshot").
- Skip `next-themes` and hardcode the dark palette.
- Because the design brief specifies "dark theme with subtle web3 flavor" as the direction, not a light/dark toggle — don't add theme-switching infrastructure for a mode nobody asked for.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| Next.js 16.2.10 | React 19.2.7 | Next.js 16 requires React 19; do not pin an older React version. |
| Tailwind CSS 4.3.2 | shadcn/ui CLI 4.13.0 | shadcn's current CLI generates v4-native config (`@theme`, OKLCH colors); do not run an older shadcn CLI version against Tailwind v4 or vice versa. |
| `@solana/wallet-adapter-react` 0.15.39 | `@solana/web3.js` v1.x | Wallet adapter's hooks/types are built around web3.js v1's `Connection`/`Transaction` classes; mixing with `@solana/kit`'s newer transaction-message format requires the `@solana/web3-compat` shim — avoid unless you have a specific reason to introduce `@solana/kit` alongside it. |
| `react-native-web` 0.21.2 | Next.js App Router (client components only) | RNW components are not React Server Components-compatible; wrap any page/section using them in a `"use client"` boundary. Verify the specific RNW component set used by the source mobile app doesn't rely on native-only modules with no web shim (e.g., certain native camera/biometric APIs) before committing to a live demo of that component. |
| `motion` 12.42.2 | React 19 | No breaking changes migrating from `framer-motion`'s last version to `motion@^12`; straightforward package-name swap. |

## Sources

- npm registry (`npm view <pkg> version` / `time.modified`), queried directly 2026-07-09 — used for all version numbers and package-maintenance-recency claims. **Confidence: HIGH** (primary source, not a secondhand report).
- [Next.js Static Exports docs](https://nextjs.org/docs/app/guides/static-exports) — rendering-strategy guidance. MEDIUM.
- [Solana: Connect a Wallet with React (cookbook)](https://solana.com/developers/cookbook/wallets/connect-wallet-react) — wallet-adapter integration pattern. MEDIUM.
- [Solana: wallet integration with Next.js and @solana/react-hooks](https://solana.com/docs/frontend/nextjs-solana) — official docs describing the newer `@solana/client`/`@solana/react-hooks`/`@solana/kit` pattern (fetched directly, confirmed package names exist on npm). MEDIUM (official source, but the pattern itself is new/unproven).
- [Anza: Meet Kit — the new Solana JavaScript SDK](https://www.anza.xyz/blog/meet-kit-the-new-solana-javascript-sdk) — `@solana/kit` rationale/performance claims. MEDIUM.
- [GitHub: anza-xyz/kit](https://github.com/anza-xyz/kit) — SDK repository, confirms active maintenance. MEDIUM.
- [Expo: Using Next.js with Expo for Web](https://docs.expo.dev/guides/using-nextjs/) — react-native-web + Next.js integration pattern. MEDIUM.
- [shadcn/ui: Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — component-library compatibility with Tailwind v4/React 19. MEDIUM.
- [motion.dev docs](https://motion.dev/docs/react) and [motion GitHub changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) — Framer Motion → Motion rename, current API. MEDIUM.
- [Northflank: Vercel vs Netlify 2026](https://northflank.com/blog/vercel-vs-netlify-choosing-the-deployment-platform-in-2026) and [Vercel's own comparison](https://vercel.com/kb/guide/vercel-vs-netlify) — hosting comparison. MEDIUM (vendor-adjacent sources cross-checked against each other).
- [Solana Devnet Faucet — faucet.solana.com](https://faucet.solana.com/) and [Helius: Introducing Helius's Solana Devnet Faucet](https://www.helius.dev/blog/solana-faucet) — devnet faucet rate-limiting behavior. LOW (single web-search pass, not independently cross-verified — re-check before building the demo's funding flow).

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
