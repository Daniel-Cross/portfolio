# Pitfalls Research

**Domain:** Developer portfolio site with live web3/Solana on-chain demos (danielcross.dev)
**Researched:** 2026-07-09
**Confidence:** MEDIUM (web-sourced consensus across multiple independent articles/discussions; no primary-source post-mortems specific to this exact project shape)

## Critical Pitfalls

### Pitfall 1: Live demo breaks in front of a hiring manager

**What goes wrong:**
The centerpiece feature — "connect a wallet and interact with something real on Solana devnet" — is also the single highest-risk element of the whole site. Public devnet RPC endpoints rate-limit or go down under load, wallet-connect flows can hang with zero user feedback (button appears to do nothing), and a wallet defaulted to mainnet instead of devnet silently fails. A hiring manager who clicks "Connect Wallet" and gets a spinner-of-death forms an instant negative impression — the opposite of the intended "this person ships serious Web3 products" reaction.

**Why it happens:**
Public/free-tier RPC endpoints are shared infrastructure with hard per-10-second rate caps and ~100MB/30s data-transfer caps that can be hit by normal traffic, not just abuse. Portfolio demos are often built once and never load-tested under bursty, low-volume-but-random traffic (recruiter visits are unpredictable, not sustained). Wallet-connect UI libraries fail silently in several documented cases (dApp/wallet handshake hangs with no error state).

**How to avoid:**
- Use a dedicated/private RPC provider (e.g. Helius, QuickNode) with a free tier, not the public Solana devnet RPC, for anything user-facing.
- Maintain a fallback list of 2+ RPC endpoints and fail over automatically on timeout/429.
- Implement exponential backoff honoring `Retry-After` on 429 responses.
- Design explicit UI states for every step of wallet connect (connecting / awaiting approval / wrong network / timeout / error) — never a bare spinner with no escape hatch.
- Detect wrong-network wallets (mainnet vs devnet) and show a clear "switch network" prompt rather than a silent failure.
- Have a recorded video/GIF fallback embedded next to the live demo so a broken demo never means zero proof — "watch it work" is the safety net for "try it yourself."

**Warning signs:**
Demo works in local dev but not after idle periods (RPC session/rate-limit expiry); no loading/error states in the wallet-connect code; single hardcoded RPC URL; testing only happened with your own wallet already primed with devnet SOL.

**Phase to address:**
Phase implementing the live on-chain demo (dedicated demo/interactive phase) — reliability and fallback-video safety net must ship together with the demo, not as a follow-up.

---

### Pitfall 2: Over-engineered crypto aesthetic undermines "senior engineer" credibility

**What goes wrong:**
Neon gradients, aggressive glow/motion, particle backgrounds, and "dark-mode-everything" read as speculative/degen rather than as evidence of engineering maturity. This is a known failure mode across web3 marketing sites, and it directly conflicts with this project's stated goal (Key Decision: "dark theme with subtle web3 flavor... not full degen aesthetic").

**Why it happens:**
Web3-adjacent design templates and inspiration sites skew heavily toward crypto-native visual tropes (because that's what sells to degen audiences), and it's easy to over-index on those references when researching "what do web3 sites look like" without applying the filter of "who is the actual audience" (a hiring manager evaluating engineering judgment, not a token holder evaluating hype).

**How to avoid:**
- Default to restraint: fewer, more purposeful motion/gradient moments rather than ambient effects everywhere.
- Treat visual design choices as risk-reduction signals (clarity, structure, transparency) the same way a well-designed dApp reduces a user's perceived financial risk — apply that logic to reducing a hiring manager's perceived "is this person all style, no substance" risk.
- Cross-check every "crypto-native touch" against the question: does this make the work easier to trust, or just louder?

**Warning signs:**
Design review that leans on words like "vibe," "energy," or "hype" rather than "clarity" or "scannability"; more than 3 accent colors; animation on every scroll trigger; a design that would look identical if degen-token-focused (as opposed to substance-focused).

**Phase to address:**
Visual design / UI phase (early, before content is poured in) — establish a restrained design system upfront so later phases don't retrofit restraint onto an already-loud UI.

---

### Pitfall 3: Case studies list what was built but never explain the decisions

**What goes wrong:**
The most common reason senior-level portfolios fail to convert to interviews isn't a missing project — it's a project with no visible reasoning. "MetaMask work" or "footballAlpha: Solana prediction market built with React Native + Expo" as a one-line description, with a screenshot and a link, demonstrates nothing about judgment. Recruiters and hiring managers skim, and if the reasoning isn't structurally obvious (a subhead, not buried in prose), it's assumed absent.

**Why it happens:**
It's much faster to write "what" than "why" — describing a feature is easy, reconstructing and articulating the tradeoffs behind a decision made months ago takes real effort and is often skipped under time pressure, especially when confidentiality concerns (MetaMask internal specifics) make people default to vague, safe summaries.

**How to avoid:**
- Structure every case study around decisions and tradeoffs, not chronology: What was the constraint? What were the options? What was chosen and why? What would you do differently?
- Write for skimming: bold subheads, short paragraphs, one strong opening line that states the outcome/impact before the detail.
- For MetaMask specifically: focus on the shape of engineering problems (scale, mobile wallet UX, performance under 30M+ users) rather than internal specifics — this respects confidentiality while still demonstrating judgment.
- Include a real "what was hard / what I'd do differently" note per case study — generic platitudes ("learned to collaborate") signal a rushed case study.

**Warning signs:**
Case study reads as a changelog/feature list; no sentence in the case study answers "why this way and not another way"; case study could be copy-pasted onto someone else's portfolio without factual changes.

**Phase to address:**
Content/case-study writing phase — should be planned as its own phase with explicit structure/outline requirements, not treated as "just write it up" filler at the end.

---

### Pitfall 4: Stale portfolio — the silent credibility killer

**What goes wrong:**
A portfolio that was clearly built once and abandoned (broken external links, a footballAlpha link that 404s once the project's URL changes, out-of-date "current role," dead social links) signals the same lack of engineering discipline the site is trying to disprove. This is especially damaging for a site whose core pitch is "trust my professional judgment."

**Why it happens:**
Portfolios are shipped under job-search time pressure and then not revisited once the immediate need passes; external dependencies (footballAlpha's own deployment, App Store links, podcast episode URLs) can move or disappear without the portfolio owner noticing.

**How to avoid:**
- Treat external links (footballAlpha, App Store, podcast, Keggy) as a maintenance surface: add a lightweight periodic check (manual quarterly review is enough at this scale — no need for automated link-checking infrastructure).
- Avoid embedding content that requires ongoing sync (e.g., don't hardcode "current role" language that will look stale within months — phrase dates/roles in a way that ages gracefully).
- Prefer linking to durable canonical sources (official App Store listing, not a redirect-prone marketing page).

**Warning signs:**
Any project link that points to a domain/infra the owner doesn't control without a fallback; copy that says "currently building X" without a date, which silently becomes false.

**Phase to address:**
Launch/QA phase — a pre-launch checklist item, and a recurring (non-automated, calendar-reminder-level) maintenance habit afterward.

---

### Pitfall 5: Heavy visuals tank mobile performance and Core Web Vitals

**What goes wrong:**
Given the target audience skims on mobile at least some of the time (recruiters, hiring managers browsing between meetings), unoptimized hero animations, particle/3D backgrounds, or large web3 JS bundles loaded on every page (not just the demo page) create slow first paint and janky scroll — directly contradicting "within a minute believes this person has shipped serious products." Web3 libraries are notably heavy (~400KB minified for base libraries), and loading them site-wide instead of only on the demo route is a common unforced error.

**Why it happens:**
It's tempting to load wallet-adapter/web3 libraries globally for convenience (so "connect wallet" can live in the header), rather than code-splitting them to only the demo route. Animation libraries and intro sequences get added late in a project as "polish" without re-measuring performance afterward.

**How to avoid:**
- Code-split all wallet/Solana JS so it only loads on the page(s) with the actual demo, not globally in the layout/header.
- Budget and measure: check Core Web Vitals (especially LCP and INP) after every visually heavy addition, not just once at the end.
- Prefer CSS-driven micro-interactions over JS-driven ambient animation where possible.
- Test on a throttled mobile profile, not just desktop broadband.

**Warning signs:**
Lighthouse/PageSpeed mobile score drops after adding a demo or hero animation; bundle analyzer shows web3 deps in the main/shared chunk; any page other than the demo page pulls in wallet-adapter code.

**Phase to address:**
Should be a cross-cutting non-functional requirement checked at the end of every phase that touches visuals or the demo, plus a dedicated performance-pass phase before launch.

---

### Pitfall 6: Asking for wallet connection reads as a security risk to a skeptical visitor

**What goes wrong:**
Hiring managers are not crypto-native users primed to connect wallets casually — some may be actively wary of connecting any wallet to an unfamiliar site, given how common wallet-drainer scams and malicious dApp patterns are (unlimited token approval requests, "free NFT" lures, etc. are well-documented attack patterns). If the demo doesn't proactively address "is this safe," some visitors will simply decline to try it, missing the site's centerpiece feature entirely.

**Why it happens:**
Builders of the demo know it's a harmless devnet read/write demo, but visitors don't have that context by default, and general wallet-connect UX doesn't distinguish "this is a low-stakes devnet demo" from "this could drain your mainnet wallet."

**How to avoid:**
- Explicitly label the demo as devnet-only, with no mainnet interaction, directly in the UI copy near the connect button (not buried in a footnote).
- Never request broad/unlimited token approvals — request only the minimum scope needed for the demo interaction, and say so.
- Offer the recorded-demo fallback (see Pitfall 1) as an equally prominent alternative for visitors who won't connect a wallet at all — don't gate the "proof" entirely behind wallet connection.

**Warning signs:**
Demo copy doesn't mention "devnet" anywhere near the connect action; approval request scope is unclear or defaults to unlimited; no non-wallet way to see the demo work.

**Phase to address:**
Same phase as the live demo — this is a copy/UX requirement, not just a technical one.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Use free public Solana devnet RPC instead of a dedicated provider | Zero setup cost, no API key management | Demo breaks under rate limits at the worst possible moment (a recruiter's visit) | Never for the live, publicly-linked demo — acceptable only in early local dev |
| Load wallet-adapter/web3 JS globally instead of code-splitting to the demo route | Simpler header/nav wiring | Slower load on every page, including the case-study/blog pages that should be fastest | Acceptable only for a very early throwaway prototype, never for launch |
| Write case studies as feature lists first, add "why" narrative later | Ships content faster | Content ships and never gets the "why" pass — becomes the permanent, weaker version | Acceptable as a draft-then-revise workflow within one phase, not as a permanent state |
| Skip recorded-demo fallback because "the live demo works fine" | Saves production time | Any RPC/wallet outage removes 100% of the proof for that visitor with no recovery | Never — recording the fallback is cheap relative to the risk it mitigates |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|-------------------|
| Solana devnet RPC | Hardcoding a single public RPC URL (`api.devnet.solana.com`) with no fallback or backoff | Use a dedicated provider (Helius/QuickNode free tier) as primary, list of fallback URLs, exponential backoff honoring `Retry-After` on 429 |
| Wallet adapter (Phantom/Solflare/etc via wallet-adapter-react) | No explicit UI state for "connecting," "awaiting approval," "wrong network," or "timeout" — user just sees a stuck button | Model wallet-connect as an explicit state machine with a visible state and escape hatch (cancel/retry) at every step |
| footballAlpha / App Store / podcast external links | Linking directly to a third-party asset the owner doesn't control, with no monitoring | Prefer canonical/stable URLs, periodically re-check (calendar reminder is enough at this scale) |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Global web3/wallet-adapter bundle in the main layout | Slow LCP/INP on every page, not just the demo | Code-split wallet/Solana deps to the demo route only; lazy-load on interaction | Noticeable on first mobile visit — no scale threshold needed, breaks immediately |
| Ambient hero animation / particle background | High bounce rate, janky scroll on mid-tier mobile devices | Prefer restrained, CSS-driven micro-interactions; measure Core Web Vitals after adding | Breaks on mobile/throttled connections even at low traffic — this is a day-one project, not a scale problem |
| Many small sequential RPC calls to render demo state | Demo feels sluggish even when the chain itself is fast | Batch calls (multicall-style) or minimize the number of round trips needed to render the demo | Noticeable at any traffic level; worsens if public RPC is also under load |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Requesting broad/unlimited token approval scope in the demo | Visitor perceives (rightly) unnecessary risk and abandons the demo; reputational risk if ever misconfigured | Request only the minimum scope needed for the specific devnet interaction; state the scope in the UI |
| No clear devnet-only labeling near the wallet-connect action | Visitor unsure if mainnet funds are at risk, declines to engage | Explicit "Devnet only — no real funds" copy directly adjacent to the connect button |
| Treating the demo's own reliability as a UX-only concern | An always-hanging or erroring connect flow can look identical to a malicious dApp pattern (click connect, nothing happens) to a wary visitor | Explicit error states so a broken demo reads as "temporarily down" rather than "suspicious," per Pitfall 1 |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Demo gated entirely behind wallet connection | Visitors who won't/can't connect a wallet get zero value from the centerpiece feature | Pair the live demo with an always-available recorded walkthrough (video/GIF) shown alongside, not just as a fallback link |
| Case studies that are skimmed-past because they're undifferentiated text blocks | Hiring manager's mental 60-second scan finds nothing to latch onto, moves on | Bold decision-point subheads, short paragraphs, lead with outcome/impact |
| Mobile work only shown as static screenshots | Reviewer can't feel that it's real React Native work, has to take it on faith | Device-frame demos (per PROJECT.md decision) with actual interaction where feasible, not just images |

## "Looks Done But Isn't" Checklist

- [ ] **Live demo:** Often missing explicit error/timeout/wrong-network states — verify by testing with a wallet set to mainnet, and by simulating an RPC timeout
- [ ] **Case studies:** Often missing the "why," not just the "what" — verify each case study has at least one sentence explicitly framed as a decision/tradeoff, not a feature description
- [ ] **External project links (footballAlpha, App Store, podcast):** Often untested after initial setup — verify each link resolves correctly right before any relaunch/update
- [ ] **Mobile performance:** Often only tested on desktop during development — verify with a real mid-tier device or throttled mobile Lighthouse run, especially on any page touching wallet-adapter code
- [ ] **Wallet-connect trust signals:** Often missing explicit "devnet only, no real funds" messaging — verify the copy is visible before the user clicks connect, not after
- [ ] **Accessibility of demo UI:** Often missing keyboard navigation and screen-reader labels on wallet-connect/modal flows specifically (these are commonly custom components, not native ones) — verify with keyboard-only navigation through the full connect flow

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|-----------------|
| Live demo goes down (RPC outage) after launch | LOW | Swap to fallback RPC URL / provider; in the meantime the recorded-demo fallback (built proactively) covers the gap with zero visitor-facing downtime |
| Case study reads as feature-list only, post-launch | MEDIUM | Revisit with a decision/tradeoff structure pass; doesn't require re-architecting the site, just a content rewrite per case study |
| Site found to look "too degen" after early feedback | MEDIUM | Strip back accent colors/motion to the restrained baseline; because this is a content site (not an app with deep visual coupling), a design-token-level pass can fix most of it without a rebuild |
| Broken external link discovered late | LOW | Update or remove the link; low cost if caught via periodic review, embarrassing but recoverable if caught by a visitor first |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Live demo breaks (RPC/wallet-connect reliability) | Live on-chain demo phase | Manually simulate RPC timeout and wrong-network wallet; confirm recorded fallback is live and prominent |
| Over-engineered crypto aesthetic | Visual design / UI system phase | Design review against restraint checklist (accent color count, animation count) before content phase begins |
| Weak case studies (no decisions/tradeoffs) | Case-study content phase | Each case study reviewed for at least one explicit decision/tradeoff statement before publish |
| Stale content / broken links | Launch/QA phase | Full link-check pass immediately pre-launch; calendar reminder set for periodic recheck |
| Mobile performance / heavy bundles | Cross-cutting, verified in demo phase + pre-launch performance phase | Mobile Lighthouse/Core Web Vitals run after any visual or demo addition |
| Wallet-connect trust/security perception | Live on-chain demo phase | Copy review confirms "devnet only" messaging is visible pre-click; approval scope reviewed to be minimal |

## Sources

- [Developer Portfolio Guide 2026 — Hakia](https://hakia.com/skills/building-portfolio/)
- [5 Mistakes Developers Make in Their Portfolio Websites](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites)
- [Don't waste time on a (React) portfolio website — 60+ hiring managers survey](https://profy.dev/article/portfolio-websites-survey)
- [5 Most Common Developer Portfolio Mistakes — David Walsh](https://davidwalsh.name/5-most-common-developer-portfolio-mistakes)
- [What I learned after reviewing over 40 developer portfolios — DEV Community](https://dev.to/kethmars/what-i-learned-after-reviewing-over-40-developer-portfolios-9-tips-for-a-better-portfolio-4me7)
- [Building a Killer Web3 Developer Portfolio — Hashtag Web3](https://hashtagweb3.com/web3-developer-portfolio)
- [Design For Web3: Branding & UX For Crypto Startups](https://tribedesignworks.com/blog/design-for-web3)
- [Using Custom Solana RPCs with Helius and Backpack wallet](https://medium.com/solana-dev-tips/using-custom-solana-rpcs-with-helius-and-backpack-wallet-f762fbc88e32)
- [Public Solana RPC URL: Everything You Need to Know — GetBlock.io](https://getblock.io/blog/public-solana-rpc-url-everything-you-need-to-know/)
- [Unable to Connect to dApp with Wallet — MetaMask/metamask-sdk#260](https://github.com/MetaMask/metamask-sdk/issues/260)
- [Solana docs: Clusters and Public RPC Endpoints](https://solana.com/docs/references/clusters)
- [Solana RPC Overview](https://solana.com/docs/rpc)
- [How to write project case studies for your portfolio — DESK Magazine](https://vanschneider.com/blog/portfolio-tips/write-project-case-studies-portfolio/)
- [7 UX Case Study Mistakes to Avoid](https://blog.uxfol.io/case-study-mistakes/)
- [dApp Frontend Performance Optimization: Proven Methods](https://www.nadcab.com/blog/dapp-frontend-performance-optimization)
- [Web Frontend Risks in DApp Development — Makers' Den](https://makersden.io/blog/top-risks-for-dapp-web-frontends)
- [Why Fast Dapps Win: Speed, Trust, and Growth in Web3 — QuickNode](https://blog.quicknode.com/web3-dapp-speed-performance/)
- [Web3 on Mobile: Bridging the Gap with WalletConnect and In-App Browsers](https://medium.com/@ancilartech/web3-on-mobile-bridging-the-gap-with-walletconnect-and-in-app-browsers-3c86cba2f942)
- [Why My Developer Portfolio Failed to Get Interviews — Medium](https://medium.com/@yash140498/why-my-developer-portfolio-failed-to-get-interviews-until-i-stopped-showing-code-50b88b4063b2)
- [Most Developer Portfolios Are Broken — Daniele Molinari](https://molinari.dev/en/blog/most-developer-portfolios-are-broken)
- [How to Spot Malicious dApps — Trust Wallet](https://trustwallet.com/blog/security/how-to-spot-malicious-dapps)
- [Avoid Deceptive Practices, Secure Your Assets — Trust Wallet Support](https://support.trustwallet.com/support/solutions/articles/67000734972-navigating-safely-in-dapp-avoid-deceptive-practices-secure-your-assets)
- [7 Web Animations That Hurt Conversion Rates — Clutch.co](https://clutch.co/resources/7-web-animations-that-hurt-conversion-rates)
- [How Website Animation Affects Engagement and Bounce Rates](https://phoenixcreativemedia.com/how-website-animation-affects-engagement-and-bounce-rates/)

---
*Pitfalls research for: crypto/web3 developer portfolio site*
*Researched: 2026-07-09*
