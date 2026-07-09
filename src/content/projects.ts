export type Project = {
  slug: string
  name: string
  blurb: string
  tags: string[]
  screenshot: string
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: "football-alpha",
    name: "footballAlpha",
    blurb:
      "Lead engineer on footballAlpha, a Solana-based subjective opinion prediction market where players stake on live football moments instead of static odds. Built the cross-platform React Native/Expo app end-to-end, including wallet connectivity, stablecoin payments, and on-chain market settlement.",
    tags: ["Solana", "React Native", "Expo"],
    screenshot: "/screenshots/football-alpha.png",
    links: [{ label: "Live app", href: "https://footballalpha.org" }],
  },
  {
    slug: "metamask",
    name: "MetaMask",
    blurb:
      "Shipped features to MetaMask's mobile wallet, the self-custody wallet trusted by 30M+ users to move billions of dollars in crypto. Worked on the React Native app powering everyday wallet interactions — sending, swapping, and connecting to dapps.",
    tags: ["React Native", "Web3", "Wallet"],
    screenshot: "/screenshots/metamask.png",
    links: [{ label: "App Store", href: "https://metamask.io" }],
  },
  {
    slug: "keggy",
    name: "Keggy",
    blurb:
      "Keggy is a daily football-guessing game in the spirit of Wordle, featured on the Football Ramble podcast. Built the iOS app and open-sourced the underlying player and game data so other developers can build on it.",
    tags: ["React Native", "iOS"],
    screenshot: "/screenshots/keggy.png",
    links: [
      {
        label: "View source",
        href: "https://github.com/Daniel-Cross/keggy-data",
      },
    ],
  },
]
