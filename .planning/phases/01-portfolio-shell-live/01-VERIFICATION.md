---
phase: 01-portfolio-shell-live
verified: 2026-07-09T16:45:00Z
status: gaps_found
score: 5/7 must-haves verified
behavior_unverified: 0
overrides_applied: 0
gaps:
  - truth: "Each project card shows a screenshot/still (01-03-PLAN must-have; supports SC3)"
    status: failed
    reason: "All three project screenshots referenced by src/content/projects.ts are missing from the deployed site. public/screenshots/ contains only .gitkeep — no PNGs were ever added, and next/image does not fail the build on a missing static source, so the defect shipped silently to production."
    artifacts:
      - path: "public/screenshots/"
        issue: "Directory contains only .gitkeep — football-alpha.png, metamask.png, keggy.png do not exist"
      - path: "src/content/projects.ts"
        issue: "screenshot field references paths (/screenshots/football-alpha.png, /screenshots/metamask.png, /screenshots/keggy.png) that resolve to 404 on the live site"
      - path: "src/components/sections/Projects.tsx"
        issue: "Renders next/image against the missing paths with no fallback; also has a latent aspect-ratio bug (width overridden by CSS, height is not — WR-03) that will distort images once added"
    missing:
      - "Add the three real screenshot PNGs to public/screenshots/ (or a safe fallback/placeholder image) and redeploy"
      - "Add h-auto to the Projects.tsx Image className so width/height don't fight once real images land (WR-03)"
      - "Add a test asserting each project.screenshot path resolves to an existing file under public/ (REVIEW.md CR-01 suggested fix), since next/image build success does not catch this class of defect"
  - truth: "Visitor can browse 3-4 flagship projects each with live and/or source links (SC3 / SHOW-01)"
    status: failed
    reason: "Two of the three flagship projects' links do not resolve on the live internet, and the automated link-validation test cannot catch this class of defect because its regex has a precedence bug."
    artifacts:
      - path: "src/content/projects.ts"
        issue: "footballAlpha's only link (https://footballalpha.app, label \"Live app\") fails TLS handshake (curl: LibreSSL error, ST_CONNECT tlsv1 alert internal error) — footballAlpha, the project the whole site is built around, currently has zero working links. Keggy's App Store link (https://apps.apple.com/app/keggy) returns a live HTTP 404 from Apple — real App Store URLs require an /id<number> segment."
      - path: "src/content/social-proof.ts"
        issue: "Duplicates the same broken Keggy App Store URL (https://apps.apple.com/app/keggy) as the Football Ramble social-proof link — also 404s"
      - path: "src/content/projects.test.ts:24"
        issue: "expect(link.href).toMatch(/^https:\\/\\/|apps\\.apple\\.com/) — the ^ anchor binds only to the first alternative, so any string containing \"apps.apple.com\" anywhere passes regardless of URL validity (WR-04). This is why the broken Keggy link shipped without the test suite catching it."
    missing:
      - "Confirm/fix footballAlpha's live URL or App Store listing before it is presented as a working link (site's own STATE.md blocker, never resolved)"
      - "Fix the Keggy App Store URL to the full https://apps.apple.com/app/<slug>/id<number> form (or another working link) in both projects.ts and social-proof.ts"
      - "Fix the link-validation regex to expect(link.href).toMatch(/^https:\\/\\//) so future placeholder/malformed URLs fail the test suite (WR-04 fix)"
deferred: []
behavior_unverified_items: []
human_verification:
  - test: "Confirm https://www.linkedin.com/in/danielcross is Daniel Cross's actual LinkedIn profile"
    expected: "The LinkedIn CTA in Contact/Footer opens the real Daniel Cross profile, not a guessed handle belonging to someone else"
    why_human: "src/content/site.ts's own comment flags this URL as an unverified inferred/placeholder handle (WR-01); LinkedIn blocks unauthenticated scraping (HTTP 999) so this cannot be confirmed by an automated fetch"
  - test: "Open the mobile menu on a narrow viewport, verify it opens/closes correctly, and try tapping a nav link"
    expected: "Menu toggles open/closed, anchor links close the menu, and (per IN-01) note Escape/outside-click are not currently implemented so the menu only closes via the toggle or a link tap"
    why_human: "MobileNav's open/close interaction runs only in a real browser viewport, not exercised by the RTL test suite"
  - test: "Click the CopyEmailButton in Contact and confirm the label swaps to \"Copied!\" for ~2s, then reverts, and that the clipboard actually contains the email"
    expected: "navigator.clipboard.writeText succeeds and the visible/announced state changes accordingly"
    why_human: "jsdom does not implement the Clipboard API; this behavior is untested by the automated suite (SUMMARY's own D5 flags this as human_judgment: true)"
  - test: "Click a header/hero anchor nav link (About, Projects, Contact) on a real mobile viewport and confirm the section heading is not clipped under the sticky header"
    expected: "Section content is fully visible below the header after the smooth-scroll completes"
    why_human: "WR-02: there is no scroll-padding-top set; the offset currently only works because every section's top padding (py-16/64px) happens to equal the header height (h-16/64px) with zero tolerance — a visual check is needed to confirm no clipping in practice"
---

# Phase 01: Portfolio Shell Live Verification Report

**Phase Goal:** A hiring manager can land on danielcross.dev and, within a minute, grasp who Daniel is, what he has shipped, and how to reach him — on a dark, restrained, fast design.
**Verified:** 2026-07-09T16:45:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor sees name, senior React Native/Web3 role, and ex-MetaMask hook above the fold at danielcross.dev over HTTPS | ✓ VERIFIED | `src/components/sections/Hero.tsx` renders `{site.name} — {site.role}, {site.heroHook}.` from `src/content/site.ts` ("Daniel Cross", "Senior React Native / Web3 Engineer", "ex-MetaMask, now building on Solana"); live HTML fetched via `curl --resolve www.danielcross.dev:443:64.29.17.65 https://www.danielcross.dev` contains "Daniel Cross" and the hero is the first section rendered. `curl -I https://danielcross.dev` returns `HTTP/2 308` → `https://www.danielcross.dev/` which returns `HTTP/2 200` with a valid Let's Encrypt TLS handshake and HSTS header. |
| 2 | Visitor can read an about/experience section naming MetaMask, The App Forge, Hackberry, Yomento, BookingGo, scan a grouped skills list, and reach GitHub from the header/hero | ✓ VERIFIED | `src/content/employers.ts` lists all five: "The App Forge AB", "MetaMask", "Hackberry", "Yomento", "BookingGo"; `About.tsx` maps over `employers` inside `id="about"`. `src/content/skills.ts` has 4 groups (Web3/Solana, React Native/Mobile, Frontend/Web, AI/Tooling), no proficiency/percentage field in the `SkillGroup` type or `Skills.tsx` markup (`grep -c "width:|percent|proficiency"` = 0). `Header.tsx` renders an `aria-label`led GitHub icon link to `site.github`; live `curl -sI https://github.com/Daniel-Cross` returns `200`. Live HTML confirms `id="about"` and `id="skills"` are present. |
| 3 | Visitor can browse 3-4 flagship projects (footballAlpha, MetaMask, Keggy) each with live and/or source links, and see a compact social proof row | ✗ FAILED (links) / ✓ VERIFIED (social-proof row itself renders) | `src/content/projects.ts` has 3 entries (footballAlpha, MetaMask, Keggy) rendered by `Projects.tsx` (`projects.map`, `id="projects"`) — live HTML confirms `id="projects"` and all three names present. **But:** footballAlpha's only link (`https://footballalpha.app`, "Live app") fails TLS handshake when fetched directly (`curl: LibreSSL/3.3.6: error:1404B438 ... tlsv1 alert internal error`) — the flagship project has zero working links. Keggy's "App Store" link (`https://apps.apple.com/app/keggy`) returns a live `HTTP/2 404` from Apple (confirmed via `curl -sI`); the same broken URL is reused in `src/content/social-proof.ts` for the Football Ramble mention. The social-proof row itself (`id="social-proof"`, ex-MetaMask / Evo Nordics / Football Ramble text) does render on the live site. |
| 4 | Each project card shows a screenshot/still, a 2-3 sentence outcome blurb, a tech-tag row, and at least one link (01-03-PLAN must-have) | ✗ FAILED | Blurb, tags, and links render for all three cards (verified in `Projects.tsx` and via `npx vitest run src/components/sections/Projects.test.tsx`). **Screenshots do not.** `public/screenshots/` contains only `.gitkeep` — no PNG files were ever added (`git ls-files public/` confirms). Directly probed the live site: `curl -sI https://www.danielcross.dev/screenshots/football-alpha.png` → `HTTP/2 404`; same for `metamask.png` and `keggy.png`. Every visitor to the site's marquee proof section currently sees three broken images. This matches code review finding CR-01 exactly and was not fixed before this verification. |
| 5 | Visitor can contact Daniel directly and see availability for both contract and full-time engagements | ✓ VERIFIED | `Contact.tsx` (`id="contact"`) renders both verbatim availability lines ("Contract — via The App Forge AB (outside IR35, UK/EU remote)", "Full-time — open to senior/staff crypto roles."), an always-present `mailto:hello@danielcross.dev` icon-link, `CopyEmailButton` (`'use client'`, calls `navigator.clipboard.writeText`), and LinkedIn + GitHub CTA links. `npx vitest run src/components/sections/Contact.test.tsx` passes (3/3). Live HTML confirms `id="contact"` present. |
| 6 | Site renders dark-mode-first with a restrained palette (≤3 accent colors) and is responsive across mobile and desktop | ✓ VERIFIED | `src/app/globals.css` defines tokens on `:root, .dark` identically (no light-flash path), one active accent (`--accent`/`--primary` both Signal Violet `oklch(0.62 0.19 293)`) plus one reserved-but-unused destructive token (`oklch(0.58 0.245 27)`) — 1 active + 1 reserved, within the ≤3-accent budget (SITE-02). `layout.tsx` sets `className="dark"`. All section components use responsive Tailwind classes (`md:`, `px-6`, `max-w-3xl`, `flex-col`/`md:flex-row`). Live response headers confirm `x-content-type-options: nosniff`, `x-frame-options: DENY`. Full responsive/visual QA on a real device is a human-verification item (see below) — the token/class evidence supports the truth but a pixel-level cross-device pass was not performed here. |
| 7 | Production build passes and Vitest smoke test / full suite runs green (01-01 / all-plan must-haves) | ✓ VERIFIED | `npm run build` exits 0 (Turbopack, static prerender of `/` and `/_not-found`). `npx vitest run` — 7 test files, 19/19 tests pass. `npx eslint .` reported clean per 01-REVIEW.md (not re-run here; build/test already confirm the working tree). |

**Score:** 5/7 truths verified (2 failed: project screenshots, and two of the three flagship projects' links)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/globals.css` | Dark OKLCH `@theme` tokens | ✓ VERIFIED | `@theme inline` block + `:root, .dark` token values present, 1 active accent + 1 reserved |
| `src/app/layout.tsx` | Dark root layout, Geist fonts, metadata | ✓ VERIFIED | `className="dark"`, `next/font` Geist Sans/Mono, imports `./globals.css` |
| `next.config.ts` | Security headers | ✓ VERIFIED | `nosniff`, `strict-origin-when-cross-origin`, `DENY` all present; confirmed live via response headers |
| `vitest.config.ts` | jsdom + React plugin | ✓ VERIFIED | `jsdom` present |
| `src/content/site.ts` | Typed identity/links | ✓ VERIFIED | `export const site` with name/role/hook/subhead/github/linkedin/email |
| `src/components/layout/Header.tsx` | Sticky header, anchor nav, GitHub link | ✓ VERIFIED | Wired, live-tested |
| `src/components/sections/Hero.tsx` | Above-the-fold identity | ✓ VERIFIED | Wired, live-tested |
| `src/content/projects.ts` | Typed project data | ⚠️ PARTIAL | Exists, exports `projects` with footballAlpha/MetaMask/Keggy, but 2 of 3 projects' links are dead and the screenshot field references non-existent files |
| `src/components/sections/Projects.tsx` | Featured-stack cards via `next/image` | ⚠️ HOLLOW (image source) | `projects.map` present, `id="projects"` present, `preload` (not `priority`) correctly used — but the images it renders 404 in production, and a latent aspect-ratio bug (WR-03) exists in the className |
| `src/components/sections/Contact.tsx` | Closing contact section | ✓ VERIFIED | Wired, live-tested |
| `src/components/sections/CopyEmailButton.tsx` | Client click-to-copy | ✓ VERIFIED (presence/wiring) | `'use client'` + `navigator.clipboard.writeText` present; runtime clipboard behavior needs human check |
| `README.md` | Deploy instructions + live URL | ✓ VERIFIED | Contains `danielcross.dev`, `npm run dev`, `npm run build` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `src/app/layout.tsx` | `src/app/globals.css` | import | ✓ WIRED | `import './globals.css'` present |
| `src/app/page.tsx` | `Hero`/`Header`/`Projects`/`About`/`Skills`/`SocialProof`/`Contact`/`Footer` | composition | ✓ WIRED | All sections composed in D-03 order; confirmed on live HTML (`id="about"`, `id="projects"`, `id="skills"`, `id="social-proof"`, `id="contact"` all present) |
| `src/components/sections/Hero.tsx` | `src/content/site.ts` | reads `site.*` | ✓ WIRED | |
| `src/components/sections/Projects.tsx` | `src/content/projects.ts` | `projects.map` | ✓ WIRED (data flow) / ✗ BROKEN (data quality) | The map is correctly wired to the data source, but the data source itself contains dead links and nonexistent screenshot paths — this is a content defect downstream of correct wiring, not a wiring defect |
| `src/components/sections/Contact.tsx` | `src/content/site.ts` | reads `site.email/linkedin/github` | ✓ WIRED | |
| GitHub repo `main` | Vercel production | Git integration | ✓ WIRED | Confirmed live: pushing to `main` is the standing deploy path per README and 01-05-SUMMARY; site is live and serving current `main` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|---------------------|--------|
| `Projects.tsx` | `projects` (from `@/content/projects`) | Static typed array, no fetch | Text data: yes. Screenshot asset data: **no** — paths point at files that were never added to `public/` | ⚠️ HOLLOW — the `screenshot` field is a string, and the component renders it unconditionally through `next/image` with no existence check, so the "real data" (an actual image file) never flows through despite correct code wiring |
| `SocialProof.tsx` | `socialProof` | Static typed array | Text: yes. One `href`: dead (Keggy App Store 404) | ⚠️ Partial — label text is real, one link target is not |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Production build succeeds | `npm run build` | Exit 0, static prerender of `/` | ✓ PASS |
| Full test suite passes | `npx vitest run` | 7 files / 19 tests passed | ✓ PASS |
| Live site reachable over HTTPS | `curl -I https://danielcross.dev` (pinned resolve) | `HTTP/2 308` → `https://www.danielcross.dev/`, then `HTTP/2 200`, valid TLS | ✓ PASS |
| Live HTML contains all section landmarks + identity content | `curl` + `grep -oE` on live HTML | `id="about|projects|skills|social-proof|contact"` all present; "Daniel Cross", "MetaMask", "footballAlpha", "Keggy" all present | ✓ PASS |
| Project screenshots resolve on the live site | `curl -sI https://www.danielcross.dev/screenshots/{football-alpha,metamask,keggy}.png` | All three return `HTTP/2 404` | ✗ FAIL |
| footballAlpha live link resolves | `curl -v https://footballalpha.app` | TLS handshake failure (`LibreSSL ... tlsv1 alert internal error`) | ✗ FAIL |
| Keggy App Store link resolves | `curl -sI https://apps.apple.com/app/keggy` | `HTTP/2 404` | ✗ FAIL |
| MetaMask link resolves | `curl -sI https://metamask.io` | `HTTP/2 200` | ✓ PASS (label is misleading — "App Store" text points to the marketing site, not a store listing — WR-01, not re-gated as a separate blocker here) |
| Keggy source-repo link resolves | `curl -sI https://github.com/Daniel-Cross/keggy-data` | `HTTP/2 200` | ✓ PASS |
| Header GitHub link resolves | `curl -sI https://github.com/Daniel-Cross` | `HTTP/2 200` | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|--------------|--------|----------|
| IDENT-01 | 01-02 | Name, role, ex-MetaMask hook above the fold | ✓ SATISFIED | Hero.tsx + live HTML |
| IDENT-02 | 01-04 | About/experience names 5 real employers | ✓ SATISFIED | employers.ts + About.tsx |
| IDENT-03 | 01-04 | Compact social proof row | ✓ SATISFIED (text) | SocialProof.tsx renders all 3 labels; one underlying link (Football Ramble/Keggy) 404s — noted as part of the projects/links gap, not re-blocking this requirement separately |
| IDENT-04 | 01-02/01-04 | Grouped skills list (no bars) + GitHub reachable | ✓ SATISFIED | skills.ts (no proficiency field) + Header GitHub link (live 200) |
| SHOW-01 | 01-03 | 3-4 flagship projects each with live/source links | ✗ BLOCKED | footballAlpha's only link is dead (TLS failure) and Keggy's App Store link 404s — 2 of 3 flagship projects do not currently deliver a working "live and/or source" link on first click; see Gaps |
| CONV-01 | 01-04 | Contact + dual-path availability | ✓ SATISFIED | Contact.tsx + live HTML |
| SITE-01 | 01-05 | Live at danielcross.dev over HTTPS | ✓ SATISFIED | curl-verified 308→200, valid TLS |
| SITE-02 | 01-01 | Dark-mode-first, ≤3 accent colors | ✓ SATISFIED | globals.css tokens |

No orphaned requirements — all 8 IDs declared across the five plans' `requirements` frontmatter match the Phase 1 rows in REQUIREMENTS.md's traceability table exactly.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/content/projects.ts` | 10, 13 | `TODO` (unresolved external-URL confirmation) | ⚠️ Warning | Not a hard debt-marker blocker (TODO is warning-tier, not TBD/FIXME/XXX), but the underlying gap it flags (dead footballAlpha/Keggy links) is a confirmed live defect — see Gaps |
| `src/content/site.ts` | 11 | `TODO` (unverified LinkedIn/GitHub URLs) | ⚠️ Warning | GitHub confirmed working; LinkedIn cannot be automatically confirmed — routed to human verification |
| `src/content/social-proof.ts` | 6 | `TODO` (Evo Nordics episode URL not sourced) | ℹ️ Info | Item renders as plain text with no `href`, which is honest (no broken link), just incomplete |
| `src/content/projects.test.ts` | 24 | Regex precedence bug (`^` binds only to first alternative) | 🛑 Blocker (contributing cause) | The one automated guard against exactly this class of defect (dead/malformed project links) does not actually enforce it — confirmed by reproducing the bug and by the fact that the Keggy 404 link passed CI/tests |
| `src/components/sections/Projects.tsx` | 22 | `w-full ... md:w-64` overrides width but not height on a fixed `width={640} height={400}` `next/image` | ⚠️ Warning | Currently masked because the images are missing; will distort aspect ratio the moment real screenshots are added (WR-03) |
| `src/app/globals.css` | (no `scroll-padding-top`) | Anchor-scroll offset relies on coincidental padding match | ⚠️ Warning | Works today only because every section's `py-16` (64px) exactly equals the header's `h-16` (64px); fragile — routed to human verification |

### Human Verification Required

See `human_verification` in frontmatter — 4 items: LinkedIn profile URL correctness, mobile nav open/close interaction, CopyEmailButton clipboard runtime behavior, and anchor-scroll offset on a real mobile viewport.

### Gaps Summary

The phase's automated build/test suite is green and the site is genuinely live and reachable over HTTPS with the correct identity, about, skills, social-proof, and contact content — most of the phase goal is real and verified, not just claimed. However, the phase's own stated core value — "proven through live, touchable demos rather than claims" — is undermined by two concrete, currently-live defects that SUMMARY.md did not surface as blocking (they were correctly flagged in 01-REVIEW.md as CR-01/WR-01/WR-04, but were never fixed before this verification):

1. **All three project screenshots are broken in production** (404s, confirmed by direct fetch against the live site). The Projects section — the site's single strongest credibility signal per the phase's own plan — currently shows three broken images to every visitor.
2. **Two of the three flagship projects' links do not work.** footballAlpha (the project the entire site's positioning is built around) has exactly one link and it fails TLS handshake. Keggy's App Store link 404s. The automated test meant to catch bad links (`projects.test.ts`) has a regex bug that lets both through.

Both gaps trace back to the same root cause: real-world facts (URLs, image assets) that the execution environment could not verify or supply were shipped to production as unconfirmed placeholders, and the safety net meant to catch that class of defect (the link-validation test) doesn't actually validate. These are fixable without replanning — they require content/asset work (add screenshots, fix two URLs, fix one regex), not a new architecture — but they are real, currently-live defects that block a clean "goal achieved" verdict.

**This looks like fixable content debt, not a design/architecture problem.** No override is suggested here because the gaps are squarely inside what this phase's own must-haves define as required ("each project card shows a screenshot," "each with live and/or source links") — there's no alternative implementation to accept in lieu of the missing assets/working links.

---

_Verified: 2026-07-09T16:45:00Z_
_Verifier: Claude (gsd-verifier)_
