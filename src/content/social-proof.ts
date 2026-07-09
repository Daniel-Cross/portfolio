export type SocialProofItem = {
  label: string
  href?: string
}

// TODO: confirm the Evo Nordics episode URL before launch — not yet sourced
// in this execution environment (no web-fetch tool available).
export const socialProof: SocialProofItem[] = [
  { label: "Ex-MetaMask — 30M+ user wallet" },
  { label: "Evo Nordics podcast — React Native episode" },
  { label: "Football Ramble mention — Keggy" },
]
