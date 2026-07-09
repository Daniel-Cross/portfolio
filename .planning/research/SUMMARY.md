# Project Research Summary

**Project:** danielcross.dev — Web3/Crypto Developer Portfolio Site
**Domain:** Senior/staff hiring portfolio with live on-chain demos
**Researched:** 2026-07-09
**Confidence:** MEDIUM

## Executive Summary

This is a portfolio site designed to convert hiring managers' first-minute impression into a concrete hiring signal. The recommended approach combines a fast, static content shell (case studies, about, blog) with carefully-isolated interactive "islands" (a live Solana devnet demo and optional React Native component showcases). The centerpiece differentiator—an embedded wallet-connect demo directly on the site—requires bulletproof reliability (dedicated RPC provider, fallback video, explicit error handling) to avoid becoming a liability.

Research strongly supports a foundation-first, then differentiators structure: launch with table-stakes features (identity, project showcase, case studies that explain *why* decisions were made, social proof row) on a dark, professional visual system. The live wallet demo should come in a dedicated second phase after the core credibility story is solid. Pitfalls research identifies two categories of risk: technical (demo reliability, mobile performance) and content (case studies that list features instead of decisions, over-engineered crypto aesthetic). Both can be prevented through explicit phase constraints.

The stack is low-risk and well-established: Next.js 16, React 19, Tailwind v4, and the battle-tested `@solana/wallet-adapter-react`. No novel dependencies—this reduces failure risk when a recruiter clicks the demo.

---

## Key Findings

### Recommended Stack

**Core technologies:**
- **Next.js 16 (App Router)** — Static rendering by default for case studies/blog (zero client JS), with client-side "islands" only where interactivity needed
- **React 19 + TypeScript 5.x** — Owner's primary language; full type safety
- **Tailwind CSS v4** — OKLCH colors, cascade layers; no friction with shadcn/ui
- **@solana/wallet-adapter-react 0.15.39** — Mature, Wallet Standard auto-detection, most battle-tested choice in ecosystem
- **@solana/web3.js v1** — Legacy but stable; used by wallet-adapter
- **react-native-web 0.21.2** — Actively maintained; embed actual RN component code in browser
- **next-mdx-remote + remark-gfm + rehype-pretty-code** — Case studies/blog with syntax highlighting
- **Motion (v12+, formerly Framer Motion)** — Use `import from "motion/react"`
- **shadcn/ui (CLI)** — Copy-in components, full styling control

**Version flags:** Verify TypeScript 7.0.2 compatibility with Next.js 16 at implementation time (may need to pin to latest stable 5.x if 7.x is beta).

### Expected Features

**Table stakes (users expect; missing reads as "unfinished"):**
- Clear identity + role statement above fold
- Project showcase with live demo + source links (GitHub is #1 credibility signal)
- About/experience naming real employers (MetaMask as social proof)
- Contact/hiring affordance
- 1–2 case studies with architecture/tradeoff detail (not feature lists)
- Social proof row (ex-MetaMask, Evo Nordics podcast, App Store)
- Mobile-responsive, fast-loading, zero broken links
- Dark-mode-first design (navy/dark-gray bg, off-white text)
- Skills/stack list (plain tags, no percentage bars)

**Differentiators (competitive advantage):**
- Embedded live wallet-connect demo (Solana devnet) — research found this genuinely rare
- footballAlpha as linkable, usable live product — research frames this as credibility bar
- Device-frame / React-native-web demos — interactive in browser, not screenshots
- Case studies explaining *why* decisions, not just features — senior portfolios distinguished by depth
- Technical blog / build-in-public writing — differentiator signal of communication ability

**Anti-features (avoid entirely):**
- Skill percentage bars — explicitly flagged as red flag across portfolio research
- Heavy crypto aesthetic (neon, particles, 3D) — undermines senior-engineer credibility
- New standalone crypto demos — footballAlpha stronger; tutorial projects distrusted
- CMS/admin panels — unnecessary at this content volume; files-in-repo simpler
- Chain-agnostic breadth — dilutes specific, credible story (depth wins over breadth)

### Architecture Approach

Follows "islands" pattern: static content shell (MDX-compiled case studies, blog, about) renders to static HTML at build time with zero runtime JS. Small number of client-only "islands" (wallet demo, mobile demo) load dynamically only when needed.

**Component structure:**
1. **Content layer** (static) — Case studies, blog, about, project index; MDX at build time, zero client JS
2. **Interactive islands** (client) — Wallet-connect demo, device-frame mobile demo; `'use client'` boundary, dynamic import `ssr: false`
3. **Provider/context layer** (client) — `ConnectionProvider → WalletProvider → WalletModalProvider`, scoped only around demo island
4. **Solana RPC endpoint** — Dedicated free-tier provider (Helius/QuickNode/Alchemy), never public endpoint
5. **Static hosting** — Vercel or Netlify with custom domain

**Critical patterns:**
- Static-by-default, interactive-by-exception: Never load wallet-adapter code site-wide
- Scoped wallet provider tree: Only scope to demo island (prevents hydration mismatches, bloated global bundles)
- Dynamic import with `ssr: false`: Wallet code cannot server-render
- Dedicated RPC from env var: Never hardcode public endpoint

### Critical Pitfalls

**1. Live demo breaks in front of hiring manager** — Public RPC endpoints rate-limit under concurrent load; wallet-connect hangs with zero user feedback. **Prevention:** Use dedicated RPC provider from day one (not public endpoint); implement explicit UI states (connecting/awaiting approval/wrong network/error); provide recorded-demo video fallback so broken demo never means zero proof.

**2. Over-engineered crypto aesthetic undermines "senior engineer" credibility** — Neon gradients, aggressive glow, particle backgrounds read as speculative/degen rather than mature. **Prevention:** Establish restrained design system upfront (fewer accent colors, purposeful motion, clarity over hype); treat visual design as risk-reduction for "is this all style, no substance" hiring manager concern.

**3. Case studies list what, not why** — Most common reason senior portfolios fail to convert. "MetaMask work" with screenshot demonstrates nothing about judgment. **Prevention:** Structure every case study around decisions/tradeoffs (constraint → options → choice → rationale). Write for skimming (bold subheads, short paragraphs, outcome-first). Use real "what I'd do differently" notes.

**4. Stale portfolio — silent credibility killer** — Broken external links (footballAlpha 404, App Store changes, podcast URL moves) signal lack of engineering discipline. **Prevention:** Treat external links as maintenance surface; periodic manual checks (quarterly at this scale); prefer durable canonical sources; avoid "currently building X" copy without dates.

**5. Heavy visuals tank mobile performance and Core Web Vitals** — Unoptimized hero animations, particles, or global web3 JS bundles create slow LCP/INP on mobile. **Prevention:** Code-split wallet/Solana JS to demo route only; prefer CSS-driven micro-interactions over JS ambient animation; measure Core Web Vitals after every visual addition.

**6. Wallet-connect reads as security risk** — Hiring managers are not crypto-native; some wary of connecting wallets given wallet-drainer scams and malicious dApp patterns. **Prevention:** Explicitly label demo as "devnet-only, no real funds" directly in UI copy near connect button (not footnotes); request only minimal approval scope; pair live demo with recorded walkthrough fallback so proof isn't gated entirely behind wallet connection.

---

## Implications for Roadmap

Research suggests 7-phase structure optimized to de-risk highest-impact features and prevent identified pitfalls.

### Phase 1: Foundation & MVP Shell
**Rationale:** Establish static content foundation first. Delivers core credibility story (identity, case studies, social proof) and sets up static rendering baseline. Gets the "hard part" done without depending on demo reliability.

**Delivers:** Hero (identity, ex-MetaMask hook, role), project showcase (MetaMask/footballAlpha/mobile apps with live links), 1–2 case studies structured around decisions/tradeoffs (not feature lists), about/experience, social proof row, contact affordance, GitHub link, skills list, MDX content pipeline.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, next-mdx-remote, remark-gfm, shadcn/ui basics.

**Avoids:** Pitfall 3 (weak case studies) and Pitfall 4 (stale links) via explicit structure requirements and link validation pass.

**Research flag:** SKIP — well-documented Next.js + MDX pattern.

---

### Phase 2: Visual Design System
**Rationale:** Establish restrained design system early, before interactive features add visual layers. Prevents Pitfall 2 (over-engineered aesthetic) by locking design constraint at component level.

**Delivers:** Tailwind color palette (navy/dark-gray bg, off-white text, ≤3 accent colors), typography system, motion guidelines (CSS-driven micro-interactions only, no ambient animation), component design tokens via shadcn/ui customization, dark-mode-only, responsive baseline (mobile-first, throttled 3G tested).

**Verification:** Design review checklist (≤3 accent colors, animation on ≤2 interactions, professional B2B tone), mobile Lighthouse ≥90, WCAG AA contrast.

**Research flag:** SKIP — Tailwind v4 + shadcn/ui documented pattern.

---

### Phase 3: Live Solana Wallet Demo (Interactive Island)
**Rationale:** Highest-effort, highest-risk differentiator. Comes after MVP solid so (a) core credibility doesn't depend on demo reliability, (b) if broken at launch, site still live and credible. This phase is where most web3 engineering happens.

**Delivers:** Dedicated RPC integration (not public endpoint), wallet-connect UI (sign-in button, modal), one concrete demo flow (connect → show devnet balance → send memo → tx signature + explorer link), explicit error states (connecting/awaiting approval/wrong network/timeout/error), recorded video/GIF fallback (embedded next to demo), keyboard navigation + screen-reader labels, Core Web Vitals verified after wallet bundle added.

**Stack:** @solana/wallet-adapter-react 0.15.39, @solana/wallet-adapter-react-ui 0.9.39, @solana/web3.js v1, dynamic import with `ssr: false` wrapper, Helius/QuickNode/Alchemy free-tier RPC, next.js `/api` route (optional, for hiding RPC key).

**Avoids:** Pitfall 1 (demo breaks—dedicated RPC + error states + fallback video), Pitfall 5 (mobile perf—code-split wallet libs), Pitfall 6 (trust—"devnet-only" copy + recorded fallback).

**Verification:** Simulate RPC timeout → error state appears; test with mainnet wallet → "switch to devnet" prompt; recorded demo plays without wallet; mobile Lighthouse stays ≥90; keyboard-only through full flow works.

**Research flag:** RESEARCH PHASE NEEDED — Web3-specific integration gotchas (wallet-connect state machine, RPC rate-limit handling, recorded-demo UX) benefit from `/gsd-plan-phase --research-phase 3` before implementation.

---

### Phase 4: Mobile Demos & Performance Polish
**Rationale:** Enhances project showcase with interactive device-frame demos. Comes after MVP + wallet demo so priority (identity + cases + proof) solid. "Nice-to-have differentiator," not critical.

**Delivers:** Device-frame component (SVG/CSS iPhone/Android bezel). Option 1 (low effort): static device frame with screenshots/video. Option 2 (higher effort, optional): live react-native-web-compiled flagship component if source available. Core Web Vitals re-measurement and optimization pass (bundle analysis, LCP/CLS targets). Mobile/throttled-connection load testing.

**Stack:** Static SVG/CSS device frame (no dep; hand-rolled), react-native-web 0.21.2 (only if live RN compilation), bundle analyzer.

**Avoids:** Pitfall 5 (mobile performance).

**Verification:** Mobile Lighthouse ≥90 all routes, LCP ≤2.5s on slow-3G, device-frame renders crisp on mobile viewports.

**Research flag:** SKIP for Phase 4a (static device-frame). RESEARCH NEEDED for Phase 4b (live react-native-web) if pursued — niche integration, verify build tooling and platform-conditional code paths.

---

### Phase 5: Blog & Extended Content
**Rationale:** Adds technical writing and deeper social proof. Comes after core site live and stable (blog is P2, not P1). Enhances profile without delaying launch.

**Delivers:** Blog section (MDX rendering, reuses Phase 1 pipeline), 1–2 launch posts (e.g., "Why I chose Solana," "Lessons from X years in Web3"), social proof expansion (podcast, press, app launches, curated list), optional ENS branding touch.

**Stack:** next-mdx-remote (already set up), rehype-pretty-code.

**Research flag:** SKIP — standard MDX blog pattern.

---

### Phase 6: Launch & QA
**Rationale:** Final verification pass before live. Catches stale links, accessibility issues, performance regressions.

**Delivers:** Full link validation (footballAlpha, App Store, podcast, GitHub, contact all resolve), accessibility audit (WCAG AA, keyboard navigation, screen-reader testing), performance final pass (Lighthouse ≥90 all routes, Core Web Vitals locked), analytics setup (@vercel/analytics), RPC endpoint monitoring, deployment to custom domain, periodic link-check reminder setup.

**Stack:** @vercel/analytics, Vercel CLI.

**Avoids:** Pitfall 4 (stale portfolio) and Pitfall 5 (mobile perf) via final verification.

**Research flag:** SKIP — standard launch checklist.

---

### Phase 7: Iterations & Maintenance
**Rationale:** Ongoing content updates, link checks, performance monitoring after launch.

**Delivers:** Quarterly link validation checks, blog post additions, RPC endpoint health monitoring, case study updates as new work ships.

---

### Phase Ordering Rationale

1. **Foundation before interactivity:** If demo breaks at launch, static content (case studies, social proof) remains credible and converts.
2. **Design before interactive features:** Locking in restrained design early prevents later feature phases from adding uncontrolled complexity.
3. **Demo as isolated phase:** High-risk, high-effort differentiator gets own phase boundary so (a) research gotchas deeply, (b) if it slips, core site ships, (c) reliability explicitly owned by this phase.
4. **Mobile demos + blog as enhancements:** Both P2 features; enhance already-credible site rather than being critical for first impression.
5. **QA last:** Catches regressions and validates all links work end-to-end before going live.

---

## Research Flags

**Phases needing deeper research during planning:**
- **Phase 3 (Live Solana Wallet Demo):** Needs `/gsd-plan-phase --research-phase 3` to explore exact error-handling patterns for wallet-connect state machine, RPC rate-limit/retry logic, and recorded-demo implementation approach (video vs. GIF, hosting, embedding). This is the most novel/risky part and benefits from research pass before implementation.
- **Phase 4b (Live react-native-web compilation, if pursued):** If decision is to compile actual RN components into browser rather than static frames, needs research on build tooling integration with Expo/RN source layout, platform-conditional code paths, styling drift prevention. Skip this research if Phase 4 commits to static device frames only.

**Phases with standard patterns (skip research):**
- **Phase 1, 2, 5, 6:** Next.js, Tailwind, MDX, launch checklist are all well-documented patterns.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Versions verified against npm registry (primary source); all packages mature/battle-tested |
| **Features** | MEDIUM | Web-search sourced; cross-checked across multiple independent sources (HashtagWeb3, competitor analysis, portfolio guides); findings converging (MVP vs. differentiators clear), but real-world hiring data unavailable |
| **Architecture** | MEDIUM | Patterns cross-checked against official Solana/Next.js docs and multiple independent sources; composition (static shell + islands) is inference, not documented standard |
| **Pitfalls** | MEDIUM | Web-sourced consensus across portfolio-mistake articles and web3-specific sources; no primary-source post-mortems for this exact project shape. Pitfall #1 (RPC reliability) especially important and will benefit from Phase 3 research. |

**Overall:** MEDIUM

### Gaps to Address

- **Exact RPC rate-limit behavior under spike traffic:** Identified but not exhaustively tested. **Mitigation:** Phase 3 research should include testing failover logic and free-tier limits. Use Helius/QuickNode/Alchemy from day one (launch requirement, not defer).

- **React-native-web production readiness for specific component:** Architecture noted RN-web works but has gotchas. **Mitigation:** If Phase 4b pursues live compilation, Phase 4 research should test specific mobile components planned for demo. Default to static device-frame mockups (lower risk).

- **Wallet-connect UX on low-end mobile / slow networks:** Identified but not exhaustively tested. **Mitigation:** Phase 3 should test timeout behavior on throttled 3G and include explicit "timeout/retry" UI state. Verify on real mid-tier Android device.

- **footballAlpha deployment status and credibility framing:** Features flag footballAlpha as flagship differentiator but exact status (mainnet/devnet, active users, URL stability) out of scope. **Mitigation:** Before Phase 1 content finalized, confirm footballAlpha's URL/status and phrase case-study copy to age gracefully (avoid vague "shipping" language).

---

## Sources

**Primary (HIGH):** npm registry (queried 2026-07-09), Solana official cookbook, Next.js official docs, React Native for Web official project.

**Secondary (MEDIUM):** HashtagWeb3 portfolio guides, Solana RPC cluster docs, gakonst.com/austingriffith.com competitor analysis, Medium articles on island architecture.

**Tertiary (LOWER):** Community Helius/Solana blog posts, portfolio-mistake articles, wallet-connect GitHub issues.

---

**Research completed:** 2026-07-09
**Synthesized by:** GSD Research Synthesizer
**Ready for roadmap creation:** yes

---

## Summary for Roadmapper

**Suggested roadmap phases (in order):**
1. Foundation & MVP Shell (static content, identity, project showcase)
2. Visual Design System (restrained design, dark-mode baseline)
3. Live Solana Wallet Demo (highest-risk differentiator, needs research phase)
4. Mobile Demos & Performance (enhancement, optional phase 4b for live RN-web)
5. Blog & Extended Content (P2 feature, adds depth)
6. Launch & QA (final verification, link checks, monitoring setup)

**Critical decisions locked by research:**
- Use dedicated RPC provider, never public endpoint (Phase 3 hardened requirement)
- Establish restrained design system early (Phase 2 prevents Pitfall 2)
- Structure case studies around decisions, not features (Phase 1 explicit requirement)
- Provide recorded-demo fallback for wallet demo (Phase 3 reliability mitigation)

**Phase needing deep research:** Phase 3 (wallet demo integration gotchas, RPC rate-limiting, recorded-demo UX patterns).
