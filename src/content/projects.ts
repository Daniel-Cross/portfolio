export type Project = {
  slug: string;
  name: string;
  blurb: string;
  tags: string[];
  screenshot: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "football-alpha",
    name: "Football Alpha",
    blurb:
      "Founder and creator of Football Alpha, a revenue-backed football player exchange on Solana where fans buy shares in real footballers, earn cash dividends when they perform, and sell as their value rises. Building the platform end-to-end: Anchor (Rust) programs with an SPL mint per player and USDC settlement, a Next.js web app, NestJS services, and Privy-embedded wallets that keep the chain invisible to users.",
    tags: ["Solana", "Rust", "Anchor", "Next.js", "NestJS"],
    screenshot: "/screenshots/football-alpha.png",
    links: [{ label: "Open full app", href: "https://www.footballalpha.org" }],
  },
  {
    slug: "metamask",
    name: "MetaMask",
    blurb:
      "Shipped features to MetaMask's mobile wallet, the self-custody wallet trusted by 30M+ users to move billions of dollars in crypto. Worked on the React Native app powering everyday wallet interactions: sending, swapping, and connecting to dapps.",
    tags: ["React Native", "Web3", "Wallet"],
    screenshot: "/screenshots/metamask-home.png",
    links: [{ label: "App Store", href: "https://metamask.io" }],
  },
  {
    slug: "ahlsell",
    name: "Ahlsell",
    blurb:
      "Tech lead (via Hackberry) on the React Native app for Ahlsell, the Nordics' leading distributor of plumbing, electrical, and tool supplies. The app is a webshop in your pocket: product search, barcode scanning, order lists, and checkout for tradespeople on site, shipped to the App Store and Google Play across Sweden, Norway, and Finland.",
    tags: ["React Native", "Expo", "TypeScript"],
    screenshot: "/screenshots/ahlsell.png",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/se/app/ahlsell/id1617272826",
      },
    ],
  },
  {
    slug: "safe-haven",
    name: "Safe Haven",
    blurb:
      "A school behaviour management platform: a React/TypeScript dashboard built with Vite, Zustand, and TanStack Query, paired with an Expo mobile app, sharing types through a common package and backed by Supabase auth and database.",
    tags: ["React Native", "Expo", "React", "TypeScript", "Supabase"],
    screenshot: "/screenshots/safe-haven-splash.png",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/haven-software/id6449934429",
      },
      { label: "Website", href: "https://www.safehaven.dev" },
    ],
  },
  {
    slug: "neo",
    name: "Neo",
    blurb:
      "A peer-to-peer payments app on Solana built with React Native and Expo: wallet creation and import, passcode security, send and request flows, and end-to-end encrypted transaction memos.",
    tags: ["Solana", "React Native", "Expo", "TypeScript"],
    screenshot: "/screenshots/neo-splash.png",
    links: [],
  },
];
