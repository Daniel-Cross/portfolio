# Phase 1: Portfolio Shell, Live - Context

**Gathered:** 2026-07-09
**Status:** Ready for planning

<domain>
## Phase Boundary

A complete, credible dark-themed site live at danielcross.dev over HTTPS: hero/identity, about/experience, grouped skills, 3–4 flagship project showcases, compact social proof row, and contact/availability — the foundation Phases 2–5 build on. Case studies (Phase 2), the Solana wallet demo (Phase 3), mobile device-frame demos (Phase 4), and launch hardening (Phase 5) are explicitly out of this phase.

</domain>

<decisions>
## Implementation Decisions

### Page architecture
- **D-01:** Single-page scroll — one landing page with anchor navigation. Case studies and the wallet demo become their own routes in later phases.
- **D-02:** Sticky minimal header — name/logo left; anchor links (About, Projects, Contact) plus GitHub icon right. Satisfies IDENT-04's "GitHub reachable from header".
- **D-03:** Section order: Hero → Projects → About/Experience → Skills → Social proof → Contact. Projects lead because the site's core value is "proof within a minute".
- **D-04:** Deploy on Vercel — hobby tier, custom domain danielcross.dev, automatic HTTPS.

### Above-the-fold hero
- **D-05:** Headline leads with role + MetaMask hook — name, then framing like "Senior React Native / Web3 Engineer — ex-MetaMask, now building on Solana". Exact copy at planner/executor discretion.
- **D-06:** Text-only hero — typography-led, no headshot. (A photo may appear in About, but is not required.)
- **D-07:** Subhead carries concrete numbers — e.g. "Shipped features to a 30M+ user wallet at MetaMask; now lead engineer on a Solana prediction market". Numbers do the convincing.
- **D-08:** Two CTAs: primary "View work" (scrolls to Projects), secondary "Get in touch" (anchors to Contact). GitHub stays in the header, not a hero CTA.

### Project showcase cards
- **D-09:** Featured stack layout — full-width horizontal cards stacked vertically (not a uniform grid). Reads as "3 deep projects", per research finding that depth beats grids.
- **D-10:** Each card contains: app screenshot/still, 2–3 sentence outcome-focused blurb, small tech-tag row, and links. Phase 2 will add "Read case study" links to these cards.
- **D-11:** Links are best-available per project, no forced uniformity:
  - footballAlpha → live app / App Store link (**confirm live URL/status before finalizing content** — flagged in STATE.md Blockers)
  - MetaMask → "my role" framing + link to the public app/store listing (no private repo links; NDA-safe)
  - Keggy → App Store link + open-source game-data repo

### Contact & availability
- **D-12:** Direct links only — no contact form, no backend, no Resend. Prominent mailto (hello@danielcross.dev) + LinkedIn + GitHub.
- **D-13:** Dual-path availability blurb, one line per path: "Contract — via The App Forge AB (outside IR35, UK/EU remote)" and "Full-time — open to senior/staff crypto roles."
- **D-14:** Contact is a full closing section — short pitch, dual-path blurb, big email/LinkedIn links; the page's conversion endpoint. Footer below carries only small repeat links.
- **D-15:** Email shown as visible text with click-to-copy affordance plus mailto link. Spam-scraping risk accepted; zero friction wins.

### Claude's Discretion
- Project count (3 vs 4): planner decides based on available content/assets. Baseline three are footballAlpha, MetaMask, Keggy; a fourth only if strong content exists.
- Exact hero/headline copywriting, within the D-05/D-07 framing.
- Visual design specifics (accent palette, typography, motion treatment) were deliberately not discussed — the roadmap flags `UI hint: yes` for this phase; run `/gsd-ui-phase 1` for a design contract, constrained by SITE-02 (dark-mode-first, ≤3 accent colors, professional foundation with subtle web3 flavor).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/REQUIREMENTS.md` — Phase 1 covers IDENT-01..04, SHOW-01, CONV-01, SITE-01, SITE-02; also defines the Out of Scope table (no skill bars, no CV download, no degen aesthetic)
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria

### Research (informs content & design choices)
- `.planning/research/SUMMARY.md` — executive summary; foundation-first structure, table-stakes features
- `.planning/research/FEATURES.md` — expected portfolio features and anti-features
- `.planning/research/PITFALLS.md` — content/design pitfalls (feature-listing case studies, over-engineered crypto aesthetic)

### Stack (locked)
- `.claude/CLAUDE.md` — full locked tech stack with versions (Next.js 16, React 19, Tailwind v4, shadcn/ui, Motion, etc.), what-not-to-use list, and version-compatibility notes

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield repo, no application code exists yet. Phase 1 scaffolds the project (create-next-app + Tailwind v4 + shadcn/ui per the locked stack).

### Established Patterns
- None in code. Stack conventions come from `.claude/CLAUDE.md` (e.g., `motion` not `framer-motion`; shadcn components copied in, not installed; skip `next-themes` — dark-mode-only).

### Integration Points
- Later phases attach to this shell: Phase 2 case-study routes link from project cards (D-10); Phase 3 wallet demo gets its own route; keep the layout/nav ready to grow from anchors to routes.

</code_context>

<specifics>
## Specific Ideas

- Hero subhead framing: "Shipped features to a 30M+ user wallet at MetaMask; now lead engineer on a Solana prediction market" — user approved this style of concrete-numbers line.
- Availability copy anchors: "The App Forge AB", "outside IR35", "UK/EU remote" for the contract path; "senior/staff crypto roles" for the full-time path.
- Contact email: hello@danielcross.dev.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Portfolio Shell, Live*
*Context gathered: 2026-07-09*
