export type SocialProofItem = {
  label: string
  href?: string
}

// TODO: confirm the Evo Nordics episode URL before launch — not yet sourced
// in this execution environment (no web-fetch tool available). Keggy's App
// Store link mirrors the placeholder already flagged in src/content/projects.ts.
export const socialProof: SocialProofItem[] = [
  { label: "Ex-MetaMask — 30M+ user wallet" },
  { label: "Evo Nordics podcast — React Native episode" },
  {
    label: "Football Ramble mention — Keggy on the App Store",
    href: "https://apps.apple.com/app/keggy",
  },
]
