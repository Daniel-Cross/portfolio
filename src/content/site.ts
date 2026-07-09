export type Site = {
  name: string
  role: string
  heroHook: string
  heroSubhead: string
  github: string
  linkedin: string
  email: string
}

// TODO: verify these profile URLs before launch. GitHub is inferred from the
// git config username (Daniel-Cross); LinkedIn uses the canonical profile-URL
// shape pending confirmation of the real handle.
export const site: Site = {
  name: "Daniel Cross",
  role: "Senior React Native / Web3 Engineer",
  heroHook: "ex-MetaMask, now building on Solana",
  heroSubhead:
    "Shipped features to a 30M+ user wallet at MetaMask; now lead engineer on a Solana prediction market.",
  github: "https://github.com/Daniel-Cross",
  linkedin: "https://www.linkedin.com/in/danielcross",
  email: "hello@danielcross.dev",
}
