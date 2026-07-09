# Architecture Research

**Domain:** Crypto/web3-focused developer portfolio site with live on-chain demos
**Researched:** 2026-07-09
**Confidence:** MEDIUM (patterns cross-checked against official Solana/Next.js docs and multiple independent sources; portfolio-specific composition is inference, not a documented "standard")

## Standard Architecture

Portfolio sites with live on-chain demos are not a codified genre with one canonical reference architecture — but they consistently decompose into the same shape: a **static content shell** (case studies, blog, about, project index) that ships near-zero JS, with a small number of **client-side "islands"** bolted on for anything that needs a browser, a wallet, or an RPC connection. This is the general "islands architecture" pattern applied specifically to web3: static-by-default, interactive-by-exception.

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CONTENT LAYER (static)                       │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Home /  │  │  Case     │  │  Blog /   │  │  Project  │            │
│  │  About   │  │  Studies  │  │  Writing  │  │  Index    │            │
│  │ (MD/MDX) │  │ (MD/MDX)  │  │ (MD/MDX)  │  │           │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │             │              │                   │
│       └─────────────┴──────┬──────┴──────────────┘                   │
│                             │  built at deploy time, zero runtime JS  │
├─────────────────────────────┴─────────────────────────────────────────┤
│                    INTERACTIVE ISLANDS (client-only)                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────┐   ┌───────────────────┐  ┌─────────────────┐  │
│  │  Wallet Connect +  │   │  Device-Frame /    │  │  Other client   │  │
│  │  Devnet Demo       │   │  RN-Web Mobile     │  │  widgets (e.g.  │  │
│  │  (wallet-adapter,  │   │  Demo (react-      │  │  animations,    │  │
│  │  web3.js, signs/   │   │  native-web or     │  │  interactive    │  │
│  │  sends tx)         │   │  static frame)     │  │  charts)        │  │
│  └─────────┬──────────┘   └───────────────────┘  └─────────────────┘  │
├────────────┴────────────────────────────────────────────────────────┤
│                    PROVIDER / CONTEXT LAYER (client)                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │ ConnectionProvider → WalletProvider → WalletModalProvider    │      │
│  │ (scoped ONLY around the demo island, not the whole app)      │      │
│  └────────────────────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────────────────┤
│                         EXTERNAL SERVICES                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐    │
│  │ Solana devnet │  │ Wallet browser│  │ (optional) Anchor        │    │
│  │ RPC endpoint  │  │ extension     │  │ program deployed to      │    │
│  │ (dedicated,   │  │ (Phantom,     │  │ devnet, if a bespoke     │    │
│  │  not public)  │  │  Solflare...) │  │ on-chain action is built │    │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Content layer | Case studies, blog, about, project index — the persuasion copy | MDX/Markdown files compiled at build time (Astro content collections, or Next.js `@next/mdx`/`next-mdx-remote`); zero client JS unless a component opts in |
| Wallet demo island | Lets a visitor connect a devnet wallet and trigger a real signed transaction (sign message, send memo, or a small custom program call) | `@solana/wallet-adapter-react` + `wallet-adapter-react-ui` + `@solana/web3.js`, mounted client-only |
| Provider/context layer | Owns wallet connection state, RPC endpoint, active network | Scoped `ConnectionProvider` → `WalletProvider` → `WalletModalProvider`, wrapping only the demo section, not the whole site |
| Mobile demo island | Makes React Native work tangible in a browser | Either a static device-frame mockup around screenshots/video (low complexity) or a react-native-web compiled build of a real shared component (higher complexity, higher payoff) |
| RPC endpoint | Executes the actual devnet reads/writes the wallet demo triggers | A dedicated free-tier RPC provider (Helius/QuickNode/Alchemy), not the public `api.devnet.solana.com` cluster |
| Deployment/hosting | Serves the static shell + client bundles to `danielcross.dev` | Vercel or Netlify (static/hybrid hosting with custom domain support) |

## Recommended Project Structure

```
src/
├── content/                 # Case studies, blog posts, project metadata (MDX/MD)
│   ├── case-studies/
│   ├── blog/
│   └── projects/
├── app/ (or pages/)         # Route-level content shell — mostly server/static components
│   ├── page.tsx             # Home
│   ├── work/[slug]/page.tsx # Case study route
│   ├── blog/[slug]/page.tsx # Blog post route
│   └── demo/page.tsx        # Route hosting the on-chain demo island
├── components/
│   ├── content/              # Presentational, static — no 'use client'
│   └── ui/                   # Shared static UI primitives
├── islands/  (or components/demo/)
│   ├── wallet/
│   │   ├── WalletProviders.tsx   # 'use client' — Connection/Wallet/Modal providers
│   │   ├── WalletConnectButton.tsx
│   │   └── OnChainDemo.tsx       # the actual sign/send interaction
│   └── mobile-demo/
│       ├── DeviceFrame.tsx       # visual chrome
│       └── MobileComponentDemo.tsx # react-native-web compiled component, if used
├── lib/
│   ├── solana/
│   │   ├── connection.ts     # RPC endpoint config, network constants
│   │   └── transactions.ts   # transaction-building helpers for the demo
│   └── content/               # MDX loaders/frontmatter schema
└── styles/
```

### Structure Rationale

- **`content/` is separated from `app/`:** case studies and blog posts are data, not code — this lets a future writer or CMS-lite workflow add content without touching components, and keeps the render layer generic.
- **`islands/` is an explicit boundary, not just a naming convention:** everything under it is `'use client'` and excluded from SSR. This makes the static/interactive line visible in the file tree, not just implicit in component internals — important since the whole architecture's value proposition is "static by default."
- **`lib/solana/` isolates chain logic from UI:** RPC endpoint, network selection, and transaction construction live in one place so a demo component stays thin (UI + hook calls), and swapping RPC providers or adding a second demo doesn't touch multiple files.
- **Wallet providers scoped to the demo route, not the root layout:** avoids loading wallet-adapter's client bundle (and its provider tree) on every page — case studies and blog posts shouldn't pay for wallet code they never use.

## Architectural Patterns

### Pattern 1: Static Shell + Client Islands

**What:** The default rendering mode for every route is static/server; only specific leaf components opt into client-side JS and interactivity.
**When to use:** Always, for this project — content (case studies, blog, project descriptions) is the majority of the site and has zero need for a browser runtime; only the wallet demo and possibly the mobile demo need one.
**Trade-offs:** Requires discipline to not let `'use client'` creep upward through the component tree (a single client directive at a high-level layout component forces everything below it into the client bundle). Payoff is fast initial load and good SEO for the content that actually needs to be found by hiring managers googling the owner's name.

**Example:**
```typescript
// app/demo/page.tsx — server component (default)
import { OnChainDemoIsland } from '@/islands/wallet/OnChainDemoIsland'; // itself 'use client' + dynamic

export default function DemoPage() {
  return (
    <main>
      <h1>Live Solana Demo</h1>
      <p>Static copy explaining the demo — server-rendered.</p>
      <OnChainDemoIsland />
    </main>
  );
}
```

### Pattern 2: Scoped Wallet Provider Tree with Client-Only Mounting

**What:** `ConnectionProvider` → `WalletProvider` → `WalletModalProvider` wrap only the demo island, and the whole island is dynamically imported with `ssr: false` (via a Client Component wrapper, since Next.js App Router forbids `ssr:false` directly inside a Server Component).
**When to use:** Any time wallet state or `window`/browser wallet extension APIs are touched — the server has no wallet, so SSR-ing this tree produces a guaranteed hydration mismatch.
**Trade-offs:** Adds one extra wrapper component per dynamic-import boundary; in exchange it eliminates a well-documented class of hydration bugs specific to wallet integrations.

**Example:**
```typescript
// islands/wallet/DemoLoader.tsx — 'use client'
'use client';
import dynamic from 'next/dynamic';

const OnChainDemo = dynamic(() => import('./OnChainDemo'), { ssr: false });

export function DemoLoader() {
  return <OnChainDemo />;
}
```
```typescript
// islands/wallet/OnChainDemo.tsx — 'use client'
'use client';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function OnChainDemo() {
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl('devnet'), []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          {/* actual sign/send interaction component */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

### Pattern 3: Device-Frame Wrapper for Mobile Component Demos

**What:** A presentational "phone chrome" component (status bar, notch, rounded frame) wraps either a static screenshot/video, or a live react-native-web-compiled version of a real shared component from the mobile codebase.
**When to use:** Showcasing React Native work in a browser without shipping a full RN runtime. Start with the static/video variant (near-zero engineering cost, fully controllable, no fidelity risk); upgrade to a live react-native-web-compiled component only for one flagship interaction if it demonstrably strengthens the pitch.
**Trade-offs:** Static frame is fast to build but is a screenshot, not a demo — weaker proof. Live react-native-web compilation is more convincing ("this actually runs") but pulls in RN-web tooling, platform-conditional code paths, and a second build target purely for a marketing page — real complexity for a small number of components.

## Data Flow

### Content Flow (static)

```
MDX/Markdown files (content/)
    ↓ (build time)
Content loader / frontmatter parser → typed content objects
    ↓
Static route components → pre-rendered HTML
    ↓
Served directly by CDN/hosting — no runtime data flow after build
```

### On-Chain Demo Flow (client-only, runtime)

```
[Visitor clicks "Connect Wallet"]
    ↓
WalletMultiButton → wallet-adapter modal → browser wallet extension (Phantom/Solflare)
    ↓ (wallet approves connection)
useWallet() hook exposes publicKey + signTransaction
    ↓
[Visitor clicks demo action, e.g. "Send devnet memo"]
    ↓
lib/solana/transactions.ts builds a Transaction via useConnection()'s Connection
    ↓
wallet.signTransaction() (signing happens in the extension, not on the page)
    ↓
connection.sendRawTransaction() → dedicated devnet RPC endpoint
    ↓
Poll/confirm → UI shows tx signature + link to Solana Explorer (devnet cluster)
```

### Key Data Flows

1. **Build-time content flow:** all case studies, blog posts, and project metadata are resolved and rendered to static HTML/JS at deploy time — no database, no runtime content API.
2. **Runtime wallet flow:** wallet connection and transaction signing happen entirely client-side, mediated by the browser wallet extension; the portfolio's server (if any) never sees private keys and does not need to proxy the transaction — it only needs to serve the client bundle and, optionally, hide an RPC API key behind an edge/serverless route if the RPC provider requires a secret.

## Scaling Considerations

This is a low-traffic personal portfolio, not a product — "scale" here means occasional traffic spikes (a post going semi-viral on LinkedIn/HN/X during a job search), not sustained load.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Normal traffic (a handful of visitors/day) | Static hosting + public/free-tier RPC is entirely sufficient; no changes needed |
| Spike traffic (front-page-of-HN moment) | Content layer scales trivially (static/CDN). The only real risk is the wallet demo's RPC endpoint hitting rate limits under concurrent devnet requests — mitigate by using a dedicated RPC provider's free tier (Helius/QuickNode/Alchemy all offer one) instead of the shared public devnet endpoint from day one |
| Sustained high demo usage (unlikely for this project) | Not a realistic concern; if it ever became one, the fix is upgrading the RPC provider tier, not re-architecting |

### Scaling Priorities

1. **First (and only realistic) bottleneck:** the devnet RPC endpoint's rate limit during a traffic spike, causing the demo to fail for visitors right when the most people are watching. Fix: use a dedicated free-tier RPC provider from the start, not the public cluster — this is a config choice, not an architecture change, so there's no reason to defer it.
2. **Second bottleneck:** none anticipated at this project's scale. Avoid pre-building anything (caching layers, queueing, server-side transaction relaying) for load this project will not see.

## Anti-Patterns

### Anti-Pattern 1: Wrapping the Entire App in Wallet Providers

**What people do:** Put `ConnectionProvider`/`WalletProvider`/`WalletModalProvider` in the root layout so "the wallet is available everywhere."
**Why it's wrong:** Forces the wallet-adapter client bundle (and its dependency tree) to load on every page — including case studies and blog posts that have nothing to do with wallets — defeating the static-shell performance goal and hurting the exact pages hiring managers will read most.
**Do this instead:** Scope wallet providers to only the route/component tree that hosts the demo (Pattern 2 above).

### Anti-Pattern 2: Using the Public Devnet RPC Endpoint for the Live Demo

**What people do:** Point `clusterApiUrl('devnet')` straight at Solana's public endpoint in production because "it's free and it's just a devnet demo."
**Why it's wrong:** Public endpoints are shared, rate-limited (roughly 100-200 req/s per IP), and offer no SLA — exactly the moment the site gets traffic (e.g., a recruiter shares the link internally) is when a shared endpoint is most likely to throttle, making the flagship proof-of-skill feature look broken.
**Do this instead:** Use a dedicated RPC provider's free tier (Helius, QuickNode, or Alchemy all have one) and put the endpoint behind an environment variable so it can be swapped without a code change.

### Anti-Pattern 3: Building a Full react-native-web Runtime for a Marketing Screenshot's Worth of Value

**What people do:** Stand up a full react-native-web build pipeline to demo every mobile component, treating the mobile-demo requirement as equal in scope to the wallet demo.
**Why it's wrong:** This is real infrastructure (separate build target, platform-conditional code, RN-web compatibility gotchas) for a page whose job is persuasion, not functionality — most of that engineering effort won't move the hiring decision as much as one polished device-frame video would.
**Do this instead:** Default to static/video device-frame demos for most mobile work; reserve a live react-native-web-compiled component for at most one flagship interaction if it's genuinely differentiating (e.g., something visually impressive and quick to interact with).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Solana devnet RPC (Helius/QuickNode/Alchemy free tier) | Client reads endpoint from `NEXT_PUBLIC_*` env var, connects via `@solana/web3.js` `Connection` | Free tiers are sufficient at this project's scale; avoids the public endpoint's shared rate limits (Anti-Pattern 2) |
| Browser wallet extension (Phantom/Solflare, via Wallet Standard) | `@solana/wallet-adapter-react` auto-detects installed wallets implementing the Wallet Standard | No server-side integration needed — all signing happens client-side in the extension |
| (Optional) Anchor program on devnet | If a bespoke on-chain action is built (beyond a simple memo/sign-message demo), a small Anchor program is deployed to devnet and its IDL is imported client-side | Only pursue if a simple memo/sign transaction feels insufficiently "real" — adds meaningful build/deploy complexity (separate Rust/Anchor toolchain, program deployment, IDL versioning) |
| Hosting/CDN (Vercel or Netlify) | Static/hybrid deploy from git, custom domain (`danielcross.dev`) pointed via DNS | Standard for both Next.js and Astro; Vercel has first-party Next.js support, Netlify/Vercel both support Astro well |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Content layer ↔ Route components | Build-time import/query of typed content objects | No runtime coupling — content changes require a rebuild/redeploy, which is fine for this content volume (confirmed out of scope: no CMS) |
| Static shell ↔ Demo islands | One-directional: islands are mounted inside static pages via client component boundaries; islands never render static content, only their own interactive UI | Keeps the "what needs a rebuild vs. what's just a client interaction" line clear |
| Demo island (UI) ↔ `lib/solana/` (chain logic) | Direct function calls / hooks within the client bundle | Isolating transaction-building logic from the button/UI component makes it easier to add a second demo (e.g., sign-message vs. send-memo) without duplicating RPC/network config |

## Sources

- [Next.js Architecture in 2026: Server-First, Client-Islands, and Scalable App Router Patterns](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router) — MEDIUM confidence (single blog source, but consistent with official Next.js Server/Client Component model)
- [Island Architecture: Revolutionizing Front-End Web Development](https://medium.com/@nagendramirajkar/island-architecture-revolutionizing-front-end-web-development-39c467223bcc) — LOW confidence, general pattern background
- [How to Connect a Wallet with React — Solana Cookbook](https://solana.com/developers/cookbook/wallets/connect-wallet-react) — HIGH confidence (official Solana docs)
- [anza-xyz/wallet-adapter (official repo)](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md) — HIGH confidence (canonical implementation)
- [@solana/wallet-adapter-react on npm](https://www.npmjs.com/package/@solana/wallet-adapter-react) — HIGH confidence (package registry, official maintainers)
- [Solana Devnet: Everything You Need to Know](https://dev.to/jumpbit/solana-devnet-everything-you-need-to-know-188f) — LOW confidence, community source, directionally consistent with official docs
- [Top 7 Solana RPC Providers in 2026](https://rpcfast.com/blog/rpc-node-providers-on-solana) — MEDIUM confidence, cross-checked against multiple independent RPC-comparison sources (Alchemy, Chainstack, Dysnix) that agree on public-endpoint rate limits and the recommendation to use a dedicated provider
- [9 Best Solana RPC Providers (2026) — Alchemy](https://www.alchemy.com/overviews/solana-rpc) — MEDIUM confidence
- [Solana Production Readiness](https://solana.com/docs/payments/production-readiness) — HIGH confidence (official docs)
- [Understanding Hydration Errors In NextJS 13 With A Web3 Wallet Connection](https://codingwithmanny.medium.com/understanding-hydration-errors-in-nextjs-13-with-a-web3-wallet-connection-8155c340fbd5) — MEDIUM confidence, matches official Next.js hydration-error guidance
- [Text content does not match server-rendered HTML — Next.js docs](https://nextjs.org/docs/messages/react-hydration-error) — HIGH confidence (official docs)
- [react-device-mockup (GitHub)](https://github.com/jung-youngmin/react-device-mockup) — MEDIUM confidence (widely used community library)
- [React Native for Web (official)](https://necolas.github.io/react-native-web/) — HIGH confidence (official project site)
- [Astro vs Next.js 2026 — Cosmic JS](https://www.cosmicjs.com/blog/astro-vs-nextjs-2026) — MEDIUM confidence, cross-checked against several independent 2026 comparison articles that agree on the content-site-favors-Astro conclusion
- [55 Portfolio Project Ideas for Web3 Frontend Developers](https://hashtagweb3.com/portfolio-project-ideas-for-web3-frontend-developer) — LOW confidence, used only for demo-idea inspiration, not as an architectural authority

---
*Architecture research for: crypto/web3 developer portfolio with live on-chain demos*
*Researched: 2026-07-09*
