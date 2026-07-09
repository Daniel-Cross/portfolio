---
phase: 01-portfolio-shell-live
plan: 05
subsystem: deploy
tags: [vercel, github, dns, https, tls, porkbun, walking-skeleton]

requires:
  - phase: 01-portfolio-shell-live (plan 04)
    provides: Complete single-page shell (Hero -> Projects -> About -> Skills -> Social proof -> Contact -> Footer)
provides:
  - Public GitHub repo github.com/Daniel-Cross/portfolio with main pushed
  - Vercel project connected via Git integration (production deploy on every push to main)
  - Live site at https://danielcross.dev (apex 308 -> https://www.danielcross.dev, HTTP 200) with automatic Let's Encrypt TLS + HSTS
  - README.md documenting local run, build, test, and the deploy model
affects:
  - "All later phases: push to main auto-deploys to production — no manual deploy step ever needed"
  - "Phase 2+: canonical serving URL is https://www.danielcross.dev (apex redirects); use it for OG/canonical tags"

tech-stack:
  added: []
  patterns:
    - "Deploy pipeline: GitHub main -> Vercel Git integration -> production; no Vercel CLI in the repo or workflow"
    - "Apex A record @ -> 216.198.79.1 (Vercel), www CNAME -> vercel-dns; www is the Vercel primary domain, apex 308-redirects"

key-files:
  created: []
  modified:
    - README.md

key-decisions:
  - "www.danielcross.dev is the Vercel primary domain; apex danielcross.dev 308-redirects to www with HSTS (max-age 63072000)"
  - "Repo created public at github.com/Daniel-Cross/portfolio under the Daniel-Cross gh account (matches git identity and existing Keggy repos), created by the user after the permission classifier blocked agent-side gh repo create"
  - "Registrar (Porkbun) apex A record points at Vercel's current IP 216.198.79.1 rather than the plan's suggested 76.76.21.21 — both are valid Vercel anycast IPs; Vercel shows the domain as Valid"

patterns-established: []

requirements-completed: [SITE-01]

coverage:
  - id: D1
    description: "Production build passes and the repo is pushed to GitHub"
    verification:
      - kind: integration
        ref: "npm run build (exit 0, Turbopack, static / and /_not-found)"
        status: pass
      - kind: manual
        ref: "git ls-remote --heads origin main -> 6bb333c; origin/main up to date at 96ca9e6"
        status: pass
    human_judgment: false
  - id: D2
    description: "SITE-01 / D-04: site live at danielcross.dev over automatic HTTPS on Vercel"
    requirement: "SITE-01"
    verification:
      - kind: integration
        ref: "curl -sI --resolve danielcross.dev:443:216.198.79.1 https://danielcross.dev -> HTTP/2 308 -> https://www.danielcross.dev/ (server: Vercel, HSTS); curl -sI https://www.danielcross.dev -> HTTP/2 200 text/html; TLS cert CN=danielcross.dev issued by Let's Encrypt, verify ok"
        status: pass
      - kind: manual
        ref: "dig +short @1.1.1.1 danielcross.dev A -> 216.198.79.1; www CNAME -> 1a06415fbe084c57.vercel-dns-017.com"
        status: pass
    human_judgment: false
  - id: D3
    description: "Complete single-page shell renders on the live domain (desktop + mobile)"
    verification:
      - kind: integration
        ref: "Live HTML over HTTPS contains id=about/skills/social-proof/contact, 'Daniel Cross', 'MetaMask', 'footballAlpha'"
        status: pass
      - kind: manual
        ref: "Human browser verification (checkpoint Task 3 resume signal 'live'/verified via coordinator): dark-mode shell, hero above fold, section order, links work"
        status: pass
    human_judgment: true
    rationale: "Visual rendering, fold position, and mobile layout are browser-judgment checks; confirmed by the developer at the checkpoint."
  - id: D4
    description: "README documents local run + deploy and contains the live URL"
    verification:
      - kind: manual
        ref: "README.md contains danielcross.dev (3 occurrences), npm run dev, npm run build, Vercel Git-integration deploy model"
        status: pass
    human_judgment: false

duration: ~6min (agent task execution; excludes human Vercel/DNS setup and propagation wait)
completed: 2026-07-09
status: complete
---

# Phase 01 Plan 05: Ship the Shell Live Summary

**Site is live: GitHub repo pushed, Vercel Git integration connected, danielcross.dev apex + www configured at Porkbun, automatic Let's Encrypt TLS issued — https://danielcross.dev serves the complete single-page shell (apex 308 → www, HTTP 200).**

## Performance

- **Duration:** ~6 min agent execution (excludes human dashboard/DNS steps and propagation wait)
- **Started:** 2026-07-09T14:12:41Z
- **Completed:** 2026-07-09T16:33Z (wall clock spans two human checkpoints)
- **Tasks:** 3 (1 auto + 2 checkpoints)
- **Files modified:** 2 (README.md, .planning/STATE.md blocker cleanup)

## Accomplishments

- Verified the production build clean (`npm run build`, Turbopack, static `/` + `/_not-found`) before shipping
- Replaced the scaffold README with project-specific docs: what the site is, local run (`npm run dev`), build, test (`npm run test` / `npx vitest run`), lint, the Vercel Git-integration deploy model, and the live URL
- Public GitHub repo `Daniel-Cross/portfolio` created with `main` pushed (repo creation performed by the user after a harness permission gate — see Deviations)
- Vercel project imported from the repo (human dashboard step); custom domains `danielcross.dev` + `www.danielcross.dev` added; Porkbun DNS configured (apex A → 216.198.79.1, www CNAME → vercel-dns); TLS auto-issued by Let's Encrypt
- Independently verified live: apex `HTTP/2 308` → `https://www.danielcross.dev/` with valid TLS and HSTS; www `HTTP/2 200 text/html`; live HTML contains all four section anchors and the identity content (Daniel Cross / MetaMask / footballAlpha)
- SITE-01 satisfied and marked complete in REQUIREMENTS.md; the push-to-main → auto-production-deploy pipeline is now the standing deploy path for all later phases

## Task Commits

1. **Task 1: Verify build, write README, create repo, push main** - `6bb333c` (docs: README), `96ca9e6` (docs: clear resolved repo-creation blocker)
2. **Task 2: Connect Vercel + configure DNS** - external (Vercel dashboard + Porkbun DNS; no repo file)
3. **Task 3: Confirm live over HTTPS** - verification only (no repo file)

**Plan metadata:** _pending (this commit)_

## Files Created/Modified

- `README.md` - Project README: local run/build/test/lint, Vercel Git-integration deploy model, live URL
- `.planning/STATE.md` - Cleared the resolved repo-creation blocker (housekeeping)

## Decisions Made

- **www is the primary domain.** Vercel serves `www.danielcross.dev` as primary; the apex 308-redirects to it with `strict-transport-security: max-age=63072000`. Later phases should treat `https://www.danielcross.dev` as the canonical serving URL (canonical/OG tags, sitemap).
- **Repo is public** at `github.com/Daniel-Cross/portfolio`, under the `Daniel-Cross` account (matches `git config` identity and the existing Keggy/terminal repos; `gh` active account was switched from `dan-sevendwarves` accordingly).
- **Apex A record uses 216.198.79.1** (Vercel's current anycast IP) rather than the plan's suggested `76.76.21.21`. The user configured this at Porkbun and Vercel reports the domain Valid — both IPs are legitimate Vercel targets; no action needed.

## Deviations from Plan

### Blocked step resolved by user

**1. [Permission gate] `gh repo create` denied by the Claude Code auto-mode permission classifier**
- **Found during:** Task 1
- **Issue:** Repo creation was classified as requiring explicit user authorization (org/visibility is a human choice); two invocations denied, so the agent stopped rather than retry
- **Resolution:** Returned a checkpoint; the user approved and the orchestrator ran `gh repo create Daniel-Cross/portfolio --public --source=. --remote=origin --push`
- **Files modified:** none (a temporary blocker entry was added to and later removed from STATE.md)
- **Commits:** `96ca9e6` (blocker cleanup)

**2. [Minor] DNS apex IP differs from plan text**
- **Found during:** Task 2/3 verification
- **Issue:** Plan suggested A `@ → 76.76.21.21`; the user's Porkbun record points at `216.198.79.1` (Vercel's newer anycast IP)
- **Resolution:** Verified via 1.1.1.1/8.8.8.8 resolution + successful TLS-verified 308/200 responses from `server: Vercel` — configuration is correct; no change required

No code deviations — no source files changed in this plan.

## Issues Encountered

- **Local DNS resolver had a stale negative cache** for the freshly-created records, so unpinned `dig`/`curl` could transiently fail on this machine. All verification was done with pinned resolution (`--resolve`, `dig @1.1.1.1`) per the orchestrator's note; this is a local-machine artifact, not a deployment issue.

## User Setup Required

Completed during this plan: Vercel project import, custom domain add, Porkbun DNS. Nothing new outstanding.

Carried forward from Plans 02–04 (pre-launch content polish, none blocking the live site): confirm real GitHub/LinkedIn URLs, footballAlpha/Keggy live URLs, Evo Nordics episode URL, and supply screenshot PNGs.

## Known Stubs

None introduced by this plan. Carried forward (unchanged): Evo Nordics podcast item unlinked in `src/content/social-proof.ts`; placeholder project/social URLs flagged TODO in `src/content/projects.ts`.

## Threat Flags

None beyond the plan's threat model. T-01-11 (plaintext/MITM) mitigated and verified: HTTPS enforced with valid Let's Encrypt TLS and HSTS on the custom domain. T-01-12 (apex DNS misconfiguration) mitigated: A-record (not CNAME) at apex, resolution verified against public resolvers, Vercel domain status Valid. T-01-13 (malicious push auto-deploying) remains accepted per plan rationale — note the repo is **public**, but pushing still requires owner write access, so the accepted-risk rationale holds.

## Next Phase Readiness

- Phase 1's walking skeleton is complete end to end: content → Next.js SSG → GitHub → Vercel edge → TLS at danielcross.dev
- Deploy pipeline established for every later phase: push to `main` → automatic production deploy; no CLI or manual step
- Canonical URL for Phase 2+ metadata work: `https://www.danielcross.dev`
- Phase is ready for verification (`status: ready_for_verification` in STATE.md; all 5 plans have summaries)

## Self-Check: PASSED

- README.md — FOUND (contains danielcross.dev, npm run dev, npm run build)
- Commit 6bb333c — FOUND
- Commit 96ca9e6 — FOUND
- origin/main pushed — VERIFIED (git ls-remote shows main at 6bb333c pre-cleanup, 96ca9e6 after push)
- https://danielcross.dev — VERIFIED (HTTP/2 308 → www, TLS verify ok)
- https://www.danielcross.dev — VERIFIED (HTTP/2 200, full shell content)

---
*Phase: 01-portfolio-shell-live*
*Completed: 2026-07-09*
