# Phase 1: Portfolio Shell, Live - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-09
**Phase:** 1-Portfolio Shell, Live
**Areas discussed:** Page architecture, Above-the-fold hero, Project showcase cards, Contact & availability

---

## Page architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Single-page scroll (Recommended) | One landing page with anchor nav; case studies/demo get routes later | ✓ |
| Multi-page now | Separate /about, /projects, /contact routes from day one | |
| Hybrid | Landing page plus stub routes per project | |

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky minimal header (Recommended) | Slim sticky bar: name left; anchor links + GitHub icon right | ✓ |
| No header, hero-only nav | GitHub and section links live in the hero only | |
| Header appears on scroll | Hidden at top, fades in after the hero | |

| Option | Description | Selected |
|--------|-------------|----------|
| Projects first (Recommended) | Hero → Projects → About → Skills → Social proof → Contact | ✓ |
| About first | Traditional narrative order | |
| Social proof high | Credibility badges immediately under the fold | |

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel (Recommended) | Zero-config Next.js, free tier, automatic HTTPS | ✓ |
| Netlify | Framework-agnostic alternative | |
| Self-hosted/other | VPS, Cloudflare Pages, etc. | |

**User's choices:** Single-page scroll; sticky minimal header; projects-first order; Vercel.
**Notes:** All recommended options accepted without modification.

---

## Above-the-fold hero

| Option | Description | Selected |
|--------|-------------|----------|
| Role + MetaMask hook (Recommended) | Role frames search keywords; MetaMask lands credibility in same breath | ✓ |
| MetaMask-first hook | Lead with "the wallet 30M+ people use" | |
| Outcome-first | Lead with shipped outcomes | |

| Option | Description | Selected |
|--------|-------------|----------|
| Text-only (Recommended) | Typography-led hero, no photo | ✓ |
| Photo in hero | Headshot beside the headline | |
| Photo in About only | Hero text-only, headshot in About | |

| Option | Description | Selected |
|--------|-------------|----------|
| View work + Contact (Recommended) | Primary to Projects, secondary to Contact | ✓ |
| Contact only | Single conversion-first button | |
| View work + GitHub | Code-first signal | |

| Option | Description | Selected |
|--------|-------------|----------|
| Concrete numbers (Recommended) | Subhead with hard proof (30M+ users, Solana prediction market) | ✓ |
| Availability signal | Subhead + "open to contract & full-time" badge | |
| Both | Numbers plus availability badge | |

**User's choices:** Role + MetaMask hook; text-only; View work + Contact CTAs; concrete-numbers subhead.
**Notes:** All recommended options accepted.

---

## Project showcase cards

| Option | Description | Selected |
|--------|-------------|----------|
| Featured stack (Recommended) | Full-width horizontal cards stacked vertically | ✓ |
| Uniform card grid | 2-up grid of equal cards | |
| One hero + grid | footballAlpha featured large, others in grid | |

| Option | Description | Selected |
|--------|-------------|----------|
| Visual + blurb + tags + links (Recommended) | Screenshot, outcome blurb, tech tags, links | ✓ |
| Text-first cards | No imagery in Phase 1 | |
| You decide | Planner picks per project | |

| Option | Description | Selected |
|--------|-------------|----------|
| Best-available per project (Recommended) | footballAlpha: live link; MetaMask: role framing + public app; Keggy: App Store + OSS repo | ✓ |
| Require live + source on all | Uniform but strained | |
| Links minimal, save for Phase 2 | Deeper linking waits for case studies | |

| Option | Description | Selected |
|--------|-------------|----------|
| Three, deep (Recommended) | footballAlpha, MetaMask, Keggy only | |
| Four | Add a fourth project for breadth | |
| You decide | Planner picks based on content/assets | ✓ |

**User's choices:** Featured stack; full cards; best-available links; project count at Claude's discretion.
**Notes:** footballAlpha live URL must be confirmed before content is finalized (STATE.md blocker).

---

## Contact & availability

| Option | Description | Selected |
|--------|-------------|----------|
| Direct links only (Recommended) | mailto + LinkedIn + GitHub; zero backend | ✓ |
| Contact form | Resend-backed form; adds API route + spam handling | |
| Links + booking | Adds Calendly-style booking link | |

| Option | Description | Selected |
|--------|-------------|----------|
| Dual-path blurb (Recommended) | One line per path: contract (The App Forge AB) and full-time | ✓ |
| Status badge + sentence | Green-dot "Available" badge + generic sentence | |
| Plain sentence | Single line covering both | |

| Option | Description | Selected |
|--------|-------------|----------|
| Full closing section (Recommended) | Dedicated final section; footer carries small repeat links | ✓ |
| Rich footer only | Footer is the contact block | |
| Section + persistent CTA | Closing section + header CTA button | |

| Option | Description | Selected |
|--------|-------------|----------|
| Visible + copy button (Recommended) | Address as text with click-to-copy + mailto | ✓ |
| Plain mailto link | Address hidden until clicked | |
| Obfuscated | JS-assembled to dodge scrapers | |

**User's choices:** Direct links only; dual-path blurb; full closing section; visible email + copy button.
**Notes:** Spam risk on public email explicitly accepted.

---

## Claude's Discretion

- Project count (3 vs 4) — planner decides based on available content/assets.
- Exact hero/headline copywriting within the agreed framing.
- Visual design specifics (palette, typography, motion) — deferred to `/gsd-ui-phase 1` design contract.

## Deferred Ideas

None — discussion stayed within phase scope.
