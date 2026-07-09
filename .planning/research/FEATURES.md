# Feature Research

**Domain:** Web3/crypto developer portfolio site (senior/staff hiring — contract + full-time)
**Researched:** 2026-07-09
**Confidence:** MEDIUM (web search only, no MCP doc/scrape providers configured for this run; findings cross-checked across multiple independent sources — see Sources)

## Feature Landscape

### Table Stakes (Users Expect These)

Features a crypto hiring manager or recruiter assumes exist. Missing these reads as "not a real senior engineer" or "not finished."

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear identity + role statement above the fold | Hiring managers skim in seconds; must instantly parse "who is this, what do they do, are they senior." Pattern confirmed across gakonst.com, Austin Griffith, and generic dev-portfolio best-practice sources. | LOW | Name, current focus (senior React Native/Web3 engineer), 1-line credibility hook (ex-MetaMask). No jargon-only header. |
| Project showcase with live demo link + source link per project | "In Web3, your GitHub is your resume" — every credible source (hashtagweb3, ispolink, ekolance) insists each project needs a working link, not just a screenshot. Freelance-evaluation sources go further: "ask for actual dApp links you can visit and use." | LOW–MED | Applies to footballAlpha, Keggy, MetaMask (link to public wallet, not internal code). |
| GitHub link prominently placed | "Web3 hiring is GitHub-first for engineering" — repeated across multiple sources as the #1 credibility signal for engineers. | LOW | Header/nav or hero, not buried in footer. |
| About/experience section with real employers named | Standard resume-equivalent content; crypto orgs (MetaMask) function as strong social proof and are expected to be named explicitly, not vague ("a leading wallet company"). | LOW | Matches PROJECT.md's ex-MetaMask credibility strategy. |
| Contact / hire-me affordance | Every portfolio reviewed (gakonst.com, dev-portfolio galleries) includes a direct contact path — email, contact page, or social DM. Table stakes for both contract and FTE audiences. | LOW | PROJECT.md already scopes this as "minimal contact/availability affordance." |
| Mobile-responsive, fast-loading site | Universal best-practice finding — "optimize for mobile, ensure fast load, no broken links" appears in every portfolio-mistakes source found. Penalized heavily if missing (site feels unfinished/unprofessional). | LOW–MED | Non-negotiable technical baseline, not a differentiator. |
| Working, tested links (no dead demo links, no placeholder projects) | "Poor-quality or broken links" is called out repeatedly as the fastest way to lose credibility with a hiring manager reviewing many candidates quickly. | LOW | QA pass before ship; especially critical for wallet-connect demos which can silently break (RPC/devnet outages). |
| Skills/stack list | Expected inventory (React Native, TypeScript, Solana, Rust, etc. per PROJECT.md). Sources explicitly warn against a specific bad pattern (see Anti-Features: skill percentage bars). | LOW | Simple tag list or grouped list — not gamified. |
| Dark-mode-first visual design for a dev/crypto audience | 2026 trend research: dark mode is now "default, not toggle" for tech-facing sites; devs and crypto-native visitors expect it and associate it with professionalism/cutting-edge tech. Matches PROJECT.md's design constraint directly. | LOW–MED | Use navy/dark-gray (~#0f172a), not pure black; off-white text, not pure white — best-practice contrast guidance from research. |

### Differentiators (Competitive Advantage)

Features that separate a standout senior/staff crypto portfolio from a generic dev portfolio. These map directly to PROJECT.md's Core Value ("prove it, don't claim it").

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Embedded live wallet-connect demo (Solana devnet) directly on the site | Research found this is genuinely rare — most portfolios *link out* to a separate dApp rather than embedding an interactive demo in the portfolio itself. An in-page "connect Phantom, do X on devnet" widget is a real differentiator, not table stakes, and directly matches PROJECT.md's centerpiece requirement. | HIGH | Needs `@solana/wallet-adapter-react` + devnet RPC; must be bulletproof (dead/broken demos are worse than no demo — see Anti-Features/Table-Stakes on broken links). |
| footballAlpha as a linkable, usable live/near-live product | Freelance-evaluation research explicitly frames this as the credibility bar: "very few [agencies/devs] can point to live, working products... ask for actual dApp links you can visit and use." Having one is a strong differentiator vs. portfolios full of toy/tutorial projects. | MED (mostly dependent on footballAlpha's own readiness, not portfolio-site work) | Portfolio should treat this as the flagship case study, not one tile among many. |
| Device-frame / react-native-web demos for mobile work | No competitor evidence of crypto engineers doing this well for React Native specifically — most portfolios show static screenshots. Making mobile UI *interactive in the browser* (device frame + react-native-web or embedded video) is unusual and directly proves the primary skill (RN) to a web visitor. | MED | Libraries exist (`react-device-mockup`, `react-device-frameset`) — implementation is low-risk, the idea itself is the differentiator. |
| Written case studies with real architecture decisions and named tradeoffs | Multiple sources distinguish senior from junior portfolios by depth: "case studies that describe real technical challenges and measurable outcomes, not polished summaries without specifics." A junior portfolio lists projects; a senior one explains *why* a decision was made. | MED | 2-3 deep case studies (MetaMask-safe framing, footballAlpha, one mobile app) beat 10 shallow project blurbs — confirmed by "3 high-quality projects > 10 incomplete ones" guidance. |
| Named org social proof (ex-MetaMask, podcast, press) presented as credibility markers, not just resume bullets | gakonst.com pattern: credibility conveyed through terse association with recognized names (Paradigm, Reth/Foundry) rather than lengthy self-description. Daniel's assets (MetaMask, Evo Nordics podcast, Football Ramble/Keggy App Store presence) map directly onto this pattern. | LOW | Small, tasteful "as seen on / worked at" row rather than a big testimonials wall (which would feel try-hard for an engineer, not a founder/creator). |
| Technical blog / build-in-public writing | Sources repeatedly flag public writing (blog posts, Twitter threads) as a differentiator that signals communication ability and genuine understanding vs. resume-only candidates: "include a blog post or video explaining your thought process... employers love seeing what you built and why." | MED (ongoing content, not one-time build) | PROJECT.md already scopes a blog section — research confirms this is correctly placed as a differentiator, not core-MVP-critical on day one (can launch with 1-2 posts + case studies covering the gap). |
| ENS / .eth-flavored subtle branding touch | Repeated (if lower-confidence) recommendation across sources: an ENS name or crypto-native identity touch signals native fluency in the ecosystem, not just professional interest. | LOW | Very optional / cosmetic — e.g. footer mention or subtle Easter egg, not a domain migration (danielcross.dev is already owned per PROJECT.md constraints). |
| Security/audit-style credibility signals for on-chain work | Aave and similar protocols use displayed audit/security credentials as trust anchors; for an individual, the equivalent is being explicit about what's actually deployed/live vs. what's a prototype — radical honesty about on-chain status builds more trust than vague claims. | LOW | Content/copy decision more than a build decision — label footballAlpha's actual status precisely (devnet/mainnet, live users or not). |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Skill percentage bars / proficiency meters ("React Native 90%, Solidity 70%") | Feels like it adds credibility/quantification | Explicitly and repeatedly called out across portfolio-mistake sources as a red flag — arbitrary self-scored numbers read as unprofessional and are impossible to verify | Simple grouped skill/tag list; let shipped projects demonstrate depth instead |
| Heavy animation / "full degen" crypto aesthetic (3D scenes, mascots, meme culture) | Web3 protocol sites (Aave, BAYC, Star Atlas) use this to build brand personality and stand out in a crowded consumer market | PROJECT.md explicitly rejects "full degen aesthetic" — for a senior engineering hire, over-designed animation reads as distracting rather than credible, and risks looking like a token/NFT project site instead of an engineer's CV; also directly contradicts the "subtle animations, keep it professional" guidance from portfolio-mistake research | Dark theme with restrained, purposeful motion (subtle hover states, one signature interaction max) — "subtle web3 flavor" per PROJECT.md |
| New standalone crypto demo apps built solely for the portfolio | Tempting to build a flashy new toy demo (NFT mint, token swap) to "prove" web3 skill | PROJECT.md already scopes this out pending research; research confirms it's unnecessary — footballAlpha is a stronger, more credible signal than a tutorial-tier demo, since evaluators explicitly distrust generic/tutorial projects ("adding tutorial projects that are not uniquely your own" is a named mistake) | Lead with footballAlpha + MetaMask context; only consider a tiny embedded wallet-connect widget (the differentiator above) if it adds proof beyond what footballAlpha already shows |
| CMS/admin panel for managing case studies and blog posts | Feels future-proof, "so I can update content easily later" | PROJECT.md already scopes this out — content volume is small (a handful of case studies, a few blog posts); a CMS adds build/maintenance overhead disproportionate to actual content velocity | Markdown/MDX files in the repo, edited via git — standard for small technical portfolios |
| Recruiting-platform-style features (job-board profile, applied-to tracker, testimonials carousel with star ratings) | Seen on freelance-marketplace profiles (Toptal, Upwork) and could feel like "more proof" | PROJECT.md scopes this out; research confirms it doesn't fit — this is a portfolio for direct outreach/interview conversion, not a marketplace listing, and star-rating UI undercuts the senior-engineer positioning | A short, curated "worked at / featured on" credibility row instead of a review system |
| Chain-agnostic "we support everything" breadth (multiple wallets, multiple chains, exhaustive protocol coverage) | Feels like it broadens appeal to more hiring managers | Dilutes the specific, credible story (Solana + React Native + ex-MetaMask); research on hiring red flags explicitly calls out "vague passion for crypto with no shipped work" and lists without a specific stack as red flags — breadth without depth reads worse than depth in one lane | Go deep on the actual stack (Solana wallet-adapter, React Native/Expo, TypeScript) rather than demonstrating shallow multi-chain coverage |
| Long-form "20 projects" grid | Instinct to show maximum output/volume | Sources are explicit: "three high-quality, well-documented projects are preferable to ten incomplete ones" — a long grid dilutes attention and invites scrutiny of weaker filler projects | 3-4 flagship items (footballAlpha, MetaMask, 1-2 mobile apps/Keggy) each given real depth |

## Feature Dependencies

```
Live wallet-connect demo (Solana devnet)
    └──requires──> Solana wallet-adapter integration (build effort)
                       └──requires──> footballAlpha context/case study (for narrative framing)

Device-frame mobile demos
    └──enhances──> Project showcase (MetaMask/mobile apps section)

Written case studies
    └──requires──> Project showcase (case studies expand on showcased projects, not standalone)

Blog / technical writing section
    └──enhances──> Social proof (podcast/press mentions gain more weight next to original writing)

Social proof row (ex-MetaMask, podcast, App Store)
    └──enhances──> Hero/identity section (credibility hook needs this content to exist first)

"Full degen aesthetic" (rejected) ──conflicts──> Case studies / senior-hire credibility framing
Skill percentage bars (rejected) ──conflicts──> Project-showcase-as-proof philosophy
```

### Dependency Notes

- **Live wallet-connect demo requires wallet-adapter integration:** the interactive differentiator can't ship without the underlying Solana wallet connection plumbing being built and hardened (devnet reliability, error states for users without Phantom installed, etc.) — this is real engineering work, not a content task, and should be scoped/estimated as its own phase.
- **Device-frame demos enhance, don't require, the project showcase:** the showcase can ship without them (screenshots as fallback); device frames are an enhancement layer that can be added once the core showcase content exists.
- **Case studies require the project showcase to exist first:** case studies are deep-dives on the same projects listed in the showcase — sequencing showcase before case-study depth avoids writing detailed prose about projects that might still be re-scoped.
- **Blog enhances social proof, not vice versa:** the podcast/press mentions are stronger anchors alongside original technical writing that proves the same expertise directly, but the blog is not a hard prerequisite for the social-proof row to ship.
- **Full degen aesthetic conflicts with case-study credibility framing:** heavy animation and meme-driven visual language undermines the tone needed for a hiring manager reading a technical case study — this is why PROJECT.md's "subtle web3 flavor" constraint is correct, and research reinforces it should stay a hard constraint, not a stylistic option to revisit later.

## MVP Definition

### Launch With (v1)

Minimum viable product — enough to convert a hiring manager's first-minute impression per PROJECT.md's Core Value.

- [ ] Hero/identity section (name, role, ex-MetaMask hook) — sets the "senior web3 engineer" frame instantly
- [ ] Project showcase: MetaMask, footballAlpha, Keggy/other mobile apps — each with live link where possible + source/description
- [ ] At least 1-2 written case studies (footballAlpha + MetaMask) with real architecture/tradeoff detail, not summaries
- [ ] Social proof row (ex-MetaMask, Evo Nordics podcast, Football Ramble/App Store mentions)
- [ ] GitHub, contact, and availability (contract + full-time) clearly placed
- [ ] Dark theme, mobile-responsive, fast-loading, zero broken links
- [ ] Skills/stack list (plain, no percentage gimmicks)

### Add After Validation (v1.x)

Features to add once the core site is live and the primary conversion loop (visit → contact) is confirmed to work.

- [ ] Embedded live wallet-connect demo (Solana devnet) — the highest-effort differentiator; validate site fundamentals first, then invest in this centerpiece
- [ ] Device-frame / react-native-web interactive demos for mobile work
- [ ] Blog / technical writing section — start with 1-2 posts, grow over time

### Future Consideration (v2+)

- [ ] Additional case studies as more work ships (e.g. future contract engagements)
- [ ] ENS/crypto-native identity touch — cosmetic, low priority, easy to add anytime
- [ ] Expanded on-chain proof section if footballAlpha usage/metrics grow (e.g. live transaction counters) — defer until there's real data worth showing

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero/identity + credibility hook | HIGH | LOW | P1 |
| Project showcase (MetaMask/footballAlpha/mobile apps) | HIGH | MEDIUM | P1 |
| Written case studies (2 min) | HIGH | MEDIUM | P1 |
| Social proof row | HIGH | LOW | P1 |
| Contact/availability affordance | HIGH | LOW | P1 |
| Dark theme + performance/responsiveness baseline | HIGH | MEDIUM | P1 |
| GitHub/skills list | MEDIUM | LOW | P1 |
| Live wallet-connect demo (Solana devnet) | HIGH | HIGH | P2 |
| Device-frame mobile demos | MEDIUM | MEDIUM | P2 |
| Blog / technical writing | MEDIUM | MEDIUM (ongoing) | P2 |
| ENS/crypto-native cosmetic touch | LOW | LOW | P3 |
| Expanded on-chain metrics/live counters | LOW (until footballAlpha has traction) | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | gakonst.com (Georgios Konstantopoulos, Paradigm CTO) | austingriffith.com (Austin Griffith, BuidlGuidl) | Our Approach |
|---------|--------------------------------------------------------|----------------------------------------------------|--------------|
| Visual style | Minimalist, text-first, no gradients/animation | Project-index style, links out to each live tool | Dark theme with restrained "subtle web3 flavor" — closer to gakonst's restraint than protocol-site maximalism |
| Proof of work | OSS projects (Reth, Foundry, Alloy) listed by name, linked to GitHub | Each project is a live, usable tool (scaffold-eth, punkwallet.io, eth.build) | Combine both: named real projects (MetaMask, footballAlpha) AND make what's live actually usable, not just described |
| Credibility signal | Org association (Paradigm, Ithaca) stated tersely, no self-promotion | Founder framing (BuidlGuidl) + adoption signals implied by tool usage | Ex-MetaMask + podcast/press mentions as a compact credibility row, not a testimonials wall |
| Personality/human touch | Dedicated DJ section — humanizes without diluting credibility | Less personal; mostly project-driven | Light personal touch is fine but keep majority weight on shipped work, matching both examples' restraint |
| Live demo depth | None embedded — links to About/Contact only, no interactive demo on-site | Links out to each tool; demos live on their own dedicated sites, not embedded inline | Differentiator opportunity: embed the wallet-connect demo directly on danielcross.dev rather than only linking out — neither reference site does this |
| Blog/writing | Not evident as a primary feature | Not evident as a primary feature | Blog is a genuine differentiator opportunity relative to both these peer examples |

## Sources

- [Build a Web3 Portfolio in 2026 That Lands $120K+ Jobs — Hashtag Web3](https://hashtagweb3.com/building-web3-portfolio)
- [Building a Killer Web3 Developer Portfolio — Hashtag Web3](https://hashtagweb3.com/web3-developer-portfolio)
- [55 Portfolio Project Ideas for Web3 Frontend Developers — Hashtag Web3](https://hashtagweb3.com/portfolio-project-ideas-for-web3-frontend-developer)
- [Web3 Web Design: 30 Best Examples — Webstacks](https://www.webstacks.com/blog/web-3-design)
- [emmabostian/developer-portfolios (GitHub)](https://github.com/emmabostian/developer-portfolios)
- [Georgios Konstantopoulos — gakonst.com](https://gakonst.com/)
- [Austin Griffith — austingriffith.com/portfolio/work](https://austingriffith.com/portfolio/work/)
- [How To Build A Rich Portfolio As A Web3 Developer — Ekolance](https://www.ekolance.io/post/how-to-build-a-rich-portfolio-as-a-web3-developer-a-step-by-step-guide)
- [Building a Web3 Developer Portfolio — Ispolink](https://www.ispolink.com/for-developers/building-a-web3-developer-portfolio-showcasing-your-skills-and-projects)
- [How can you showcase your blockchain experience in your portfolio? — LinkedIn Advice](https://www.linkedin.com/advice/3/how-can-you-showcase-your-blockchain-experience-oxrdc)
- [Crypto Jobs in 2026: The Complete Field Guide — web3.career](https://web3.career/learn-web3/crypto-jobs-2026)
- [The 2026 Web3 Workforce Report — CryptoJobsList](https://cryptojobslist.com/research/web3-workforce-report)
- [Dark Mode Websites: 10 Stunning Examples That Actually Work — Lovable](https://lovable.dev/guides/dark-mode-website-examples-guide)
- [Portfolio design trends for 2026 — Envato Elements](https://elements.envato.com/learn/portfolio-trends)
- [5 Mistakes Developers Make in Their Portfolio Websites](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites)
- [8 Software Developer Portfolio Website Mistakes — Coach Full Stack](https://coachfullstack.com/posts/8-software-developer-portfolio-website-mistakes/)
- [7 Deadly Sins of Developer Portfolios — Pesto](https://pesto.tech/resources/7-deadly-sins-of-developer-portfolios-and-how-to-avoid-them)
- [Solana Wallet Adapter / Connect Wallet with React — Solana Cookbook](https://solana.com/developers/cookbook/wallets/connect-wallet-react)
- [ronanyeah/solana-connect (GitHub)](https://github.com/ronanyeah/solana-connect)
- [react-device-mockup (GitHub)](https://github.com/jung-youngmin/react-device-mockup)

---
*Feature research for: Web3/crypto developer portfolio site*
*Researched: 2026-07-09*
