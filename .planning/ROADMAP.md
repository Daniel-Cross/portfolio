# Roadmap: danielcross.dev — Developer Portfolio

## Overview

A dark, restrained portfolio at danielcross.dev that convinces a crypto hiring manager, within a minute, that Daniel has shipped serious Web3 products — proven through live, touchable demos. Built as vertical MVP slices: Phase 1 ships a credible, live site fast (identity, showcase, contact, design system), then each subsequent slice deepens the proof — decision-driven case studies, a live Solana devnet wallet demo, interactive mobile demos — closing with a launch-hardening pass that verifies performance and links across every route and adds a subtle crypto-native signature.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Portfolio Shell, Live** - Credible dark-themed site live at danielcross.dev with identity, showcase, and contact
- [ ] **Phase 2: Decision-Driven Case Studies** - Deep, NDA-safe case studies proving engineering judgment
- [ ] **Phase 3: Live Solana Wallet Demo** - Real devnet interaction with bulletproof feedback and recorded fallback
- [ ] **Phase 4: Mobile Work, Made Tangible** - Device-frame and live react-native-web demos of mobile work
- [ ] **Phase 5: Launch Hardening & Crypto Signature** - Verified fast/unbroken across all routes with a subtle crypto identity touch

## Phase Details

### Phase 1: Portfolio Shell, Live

**Goal**: A hiring manager can land on danielcross.dev and, within a minute, grasp who Daniel is, what he has shipped, and how to reach him — on a dark, restrained, fast design.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: IDENT-01, IDENT-02, IDENT-03, IDENT-04, SHOW-01, CONV-01, SITE-01, SITE-02
**Success Criteria** (what must be TRUE):

  1. Visitor sees name, senior React Native/Web3 role, and ex-MetaMask hook above the fold at danielcross.dev over HTTPS
  2. Visitor can read an about/experience section naming real employers (MetaMask, The App Forge, Hackberry, Yomento, BookingGo) and scan a grouped skills list, with GitHub reachable from the header or hero
  3. Visitor can browse 3-4 flagship projects (footballAlpha, MetaMask, Keggy) each with live and/or source links, and see a compact social proof row (ex-MetaMask, Evo Nordics podcast, Football Ramble / App Store)
  4. Visitor can contact Daniel directly and see availability for both contract and full-time engagements
  5. Site renders dark-mode-first with a restrained palette (≤3 accent colors) and is responsive across mobile and desktop

**Plans**: 1/5 plans executed
**Wave 1**

- [x] 01-01-PLAN.md — Scaffold, Vitest harness & dark design-token system

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02-PLAN.md — Identity slice: sticky header + above-the-fold hero

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-03-PLAN.md — Proof slice: featured-stack project showcase

**Wave 4** *(blocked on Wave 3 completion)*

- [ ] 01-04-PLAN.md — Narrative + conversion: about, skills, social proof, contact, footer

**Wave 5** *(blocked on Wave 4 completion)*

- [ ] 01-05-PLAN.md — Go live: Vercel deploy, custom domain, HTTPS

**UI hint**: yes

### Phase 2: Decision-Driven Case Studies

**Goal**: A hiring manager can read decision-first case studies that prove engineering judgment across footballAlpha, MetaMask, and mobile work.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: SHOW-02, SHOW-03, SHOW-04
**Success Criteria** (what must be TRUE):

  1. Visitor can read a footballAlpha case study structured around architecture decisions and tradeoffs
  2. Visitor can read a MetaMask case study framed from public knowledge (NDA-safe)
  3. Visitor can read a mobile app case study (Keggy or equivalent)
  4. Each case study reads decision-first (constraint → options → choice → rationale) and skims cleanly on mobile

**Plans**: TBD
**UI hint**: yes

### Phase 3: Live Solana Wallet Demo

**Goal**: A hiring manager can connect a Solana wallet and complete a real devnet interaction — or watch a recorded walkthrough — with bulletproof, clearly-labeled feedback.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: DEMO-01, DEMO-02, DEMO-03
**Success Criteria** (what must be TRUE):

  1. Visitor can connect a Solana wallet and complete a devnet interaction end-to-end (view balance → send memo transaction → see explorer link)
  2. Visitor always sees explicit demo states — connecting, awaiting-approval, wrong-network, error — with "devnet only, no real funds" labeling next to the connect button
  3. Visitor can watch a recorded demo walkthrough without connecting a wallet

**Plans**: TBD
**UI hint**: yes

### Phase 4: Mobile Work, Made Tangible

**Goal**: A visitor can experience Daniel's React Native work interactively on the web through device-frame demos and at least one live compiled component.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: DEMO-04, DEMO-05
**Success Criteria** (what must be TRUE):

  1. Visitor can view mobile work presented in device-frame components (hand-rolled CSS/SVG frames with screenshots/video)
  2. Visitor can interact with at least one real React Native component compiled to web via react-native-web
  3. Device-frame and react-native-web demos render crisply and remain interactive on mobile viewports

**Plans**: TBD
**UI hint**: yes

### Phase 5: Launch Hardening & Crypto Signature

**Goal**: The site is verified fast and unbroken across every route and carries a subtle crypto-native identity touch — ready to send to hiring managers.
**Mode:** mvp
**Depends on**: Phases 1-4
**Requirements**: CONV-02, SITE-03, SITE-04
**Success Criteria** (what must be TRUE):

  1. Every route, including the wallet demo route, scores Lighthouse ≥90 on mobile
  2. All internal and external links resolve with zero broken links at launch
  3. Site carries a subtle crypto-native identity touch (ENS mention or easter egg) without degen aesthetics

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Portfolio Shell, Live | 1/5 | In Progress|  |
| 2. Decision-Driven Case Studies | 0/TBD | Not started | - |
| 3. Live Solana Wallet Demo | 0/TBD | Not started | - |
| 4. Mobile Work, Made Tangible | 0/TBD | Not started | - |
| 5. Launch Hardening & Crypto Signature | 0/TBD | Not started | - |
