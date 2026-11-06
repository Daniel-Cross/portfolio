export type Skill = { name: string; claim: string; tools: string }

export const skills: Skill[] = [
  {
    name: 'Mobile',
    claim: 'Apps taken from an empty repo to the App Store and Google Play, and old ones made fast and maintainable again.',
    tools: 'React Native, Expo, TypeScript, iOS, Android',
  },
  {
    name: 'Crypto',
    claim: 'Wallets, trading screens, live charts and deposits. Snaps and Solana work in MetaMask, and my own programs on Solana.',
    tools: 'Solana, MetaMask Snaps, Rust, Anchor, embedded wallets',
  },
  {
    name: 'Shipping',
    claim: 'Release pipelines for test and production on both stores, and performance checks that run on every pull request.',
    tools: 'CI/CD, GitHub Actions, EAS, store releases, hotfixes',
  },
  {
    name: 'Leading',
    claim: 'Tech lead, lead engineer and head of engineering. I set the architecture and design system, break the work down and keep delivery moving.',
    tools: 'Architecture, design systems, planning, team leadership',
  },
]
