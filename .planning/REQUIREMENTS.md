# Requirements: danielcross.dev — Developer Portfolio

**Defined:** 2026-07-09
**Core Value:** A crypto hiring manager or founder lands on the site and within a minute believes "this person has shipped serious Web3 products" — proven through live, touchable demos rather than claims.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Identity & Proof

- [x] **IDENT-01**: Visitor sees name, senior React Native/Web3 role, and ex-MetaMask credibility hook above the fold without scrolling
- [x] **IDENT-02**: Visitor can read an about/experience section naming real employers (MetaMask, The App Forge, Hackberry, Yomento, BookingGo)
- [x] **IDENT-03**: Visitor sees a compact social proof row (ex-MetaMask, Evo Nordics podcast, Football Ramble / App Store mentions)
- [x] **IDENT-04**: Visitor can scan a plain grouped skills list (no percentage bars) and reach GitHub from the header or hero

### Project Showcase

- [x] **SHOW-01**: Visitor can browse 3-4 flagship projects (footballAlpha, MetaMask, Keggy/mobile apps) each with live and/or source links
- [ ] **SHOW-02**: Visitor can read a footballAlpha case study structured around architecture decisions and tradeoffs
- [ ] **SHOW-03**: Visitor can read a MetaMask case study framed from public knowledge (NDA-safe)
- [ ] **SHOW-04**: Visitor can read a mobile app case study (Keggy or equivalent)

### Interactive Demos

- [ ] **DEMO-01**: Visitor can connect a Solana wallet and complete a real devnet interaction on the site (view balance → send memo transaction → see explorer link)
- [ ] **DEMO-02**: Visitor always sees clear demo feedback — explicit connecting/awaiting-approval/wrong-network/error states and "devnet only, no real funds" labeling next to the connect button
- [ ] **DEMO-03**: Visitor can watch a recorded demo walkthrough without connecting a wallet
- [ ] **DEMO-04**: Visitor can view mobile work presented in device-frame components (hand-rolled CSS/SVG frames with screenshots/video)
- [ ] **DEMO-05**: Visitor can interact with at least one real React Native component compiled to web via react-native-web

### Contact & Conversion

- [x] **CONV-01**: Visitor can contact Daniel directly and see availability for both contract and full-time engagements
- [ ] **CONV-02**: Site includes a subtle crypto-native identity touch (e.g. ENS mention or easter egg) without degen aesthetics

### Site Quality

- [x] **SITE-01**: Site is live at danielcross.dev over HTTPS
- [x] **SITE-02**: Site uses a dark-mode-first, restrained design system (professional foundation, subtle web3 flavor, ≤3 accent colors)
- [ ] **SITE-03**: Site is mobile-responsive and fast (Lighthouse ≥90 mobile on all routes, including the wallet demo route)
- [ ] **SITE-04**: All internal and external links resolve at launch (zero broken links)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Blog & Writing

- **BLOG-01**: Visitor can read technical blog posts (MDX pipeline reused from case studies)
- **BLOG-02**: Blog launches with 1-2 seeded posts (e.g. Solana architecture lessons, React Native at wallet scale)

### Extended Proof

- **PROOF-01**: Additional case studies as new contract work ships
- **PROOF-02**: Live on-chain metrics/counters for footballAlpha once real usage data exists

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Skill percentage bars | Flagged across research as a credibility red flag — shipped work proves depth |
| Heavy crypto/degen aesthetic (neon, particles, 3D) | Undermines senior-engineer positioning; conflicts with restrained design decision |
| New standalone crypto demo apps | footballAlpha is a stronger signal than tutorial-tier demos; embedded wallet demo covers live proof |
| CMS / admin panel | Content volume is small; MDX files in repo are simpler |
| CV download | Not selected for v1; LinkedIn covers recruiter needs |
| Recruiting-platform features (testimonial carousels, ratings) | Portfolio for direct conversion, not a marketplace listing |
| Chain-agnostic multi-chain breadth | Dilutes the specific Solana + React Native + ex-MetaMask story |
| Long project grid (10+ projects) | Research: 3 deep projects beat 10 shallow ones |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| IDENT-01 | Phase 1 | Complete |
| IDENT-02 | Phase 1 | Complete |
| IDENT-03 | Phase 1 | Complete |
| IDENT-04 | Phase 1 | Complete |
| SHOW-01 | Phase 1 | Complete |
| CONV-01 | Phase 1 | Complete |
| SITE-01 | Phase 1 | Complete |
| SITE-02 | Phase 1 | Complete |
| SHOW-02 | Phase 2 | Pending |
| SHOW-03 | Phase 2 | Pending |
| SHOW-04 | Phase 2 | Pending |
| DEMO-01 | Phase 3 | Pending |
| DEMO-02 | Phase 3 | Pending |
| DEMO-03 | Phase 3 | Pending |
| DEMO-04 | Phase 4 | Pending |
| DEMO-05 | Phase 4 | Pending |
| CONV-02 | Phase 5 | Pending |
| SITE-03 | Phase 5 | Pending |
| SITE-04 | Phase 5 | Pending |

**Coverage:**

- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-09*
*Last updated: 2026-07-09 after roadmap creation*
