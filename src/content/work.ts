export type Proof = { label: string; href: string; note: string }
export type Shot = { src: string; alt: string }
export type WorkCard = {
  slug: string
  name: string
  role: string
  text: string
  proof: Proof[]
  tint: string
  shots: Shot[]
  shotLayout: 'pair' | 'phone' | 'web'
}

const pr = (n: number) => `https://github.com/MetaMask/metamask-mobile/pull/${n}`

export const work: WorkCard[] = [
  {
    slug: 'fact-machine',
    name: 'Fact Machine',
    role: 'Lead mobile engineer',
    text: 'I started the iOS and Android app from an empty repo in React Native and Expo and shipped it to the App Store. The company then went mobile-first. I built the trading screens, live charts, deposits and Solana wallet connection, and set up performance checks that run on every pull request.',
    proof: [
      {
        label: 'Fact Machine on the App Store',
        href: 'https://apps.apple.com/us/app/thefactmachine/id6763264892',
        note: 'The app I started and lead',
      },
    ],
    tint: '#FF9A02',
    shots: [
      { src: '/work/fact-machine-1.png', alt: 'Fact Machine App Store screenshot: predict what others think' },
      { src: '/work/fact-machine-3.png', alt: 'Fact Machine App Store screenshot: live market chart' },
    ],
    shotLayout: 'pair',
  },
  {
    slug: 'use-ai',
    name: 'Use AI',
    role: 'Lead React Native engineer',
    text: 'Hired to start the mobile app and run mobile. I set the architecture and design system, led the engineers building it, and built the release pipelines for test and production on iOS and Android.',
    proof: [
      {
        label: 'Use AI on the App Store',
        href: 'https://apps.apple.com/us/app/id6758437352',
        note: 'GPT, Claude, Gemini and Grok in one app',
      },
    ],
    tint: '#7AA2FF',
    shots: [
      { src: '/work/use-ai-1.jpg', alt: 'Use AI App Store screenshot' },
      { src: '/work/use-ai-2.jpg', alt: 'Use AI App Store screenshot: chat with any model' },
    ],
    shotLayout: 'pair',
  },
  {
    slug: 'metamask',
    name: 'MetaMask Mobile',
    role: 'Senior engineer',
    text: 'I brought Snaps dynamic UI to the mobile wallet and shipped Solana send and transaction screens. All of my work there is public.',
    proof: [
      { label: 'Snaps dynamic UI', href: pr(12429), note: 'Pull request 12429, merged Feb 2025' },
      { label: 'Send button on the Solana asset screen', href: pr(15799), note: 'Pull request 15799, merged Jun 2025' },
      { label: 'Solana transactions in the asset overview', href: pr(16073), note: 'Pull request 16073, merged Jun 2025' },
      {
        label: 'All 31 merged pull requests',
        href: 'https://github.com/MetaMask/metamask-mobile/pulls?q=is%3Apr+author%3ADaniel-Cross+is%3Amerged',
        note: 'May 2024 to June 2025, on GitHub',
      },
    ],
    tint: '#8F6BFF',
    shots: [
      { src: '/work/metamask-1.png', alt: 'MetaMask App Store screenshot: wallet home' },
      { src: '/work/metamask-4.png', alt: 'MetaMask App Store screenshot: predictions' },
    ],
    shotLayout: 'pair',
  },
  {
    slug: 'ahlsell',
    name: 'Ahlsell',
    role: 'Tech lead via Hackberry',
    text: "Tech lead on the React Native app for the Nordics' building-supplies distributor: product search, barcode scanning, order lists and checkout for tradespeople on site. Launched in Sweden, Norway and Finland.",
    proof: [
      {
        label: 'Ahlsell on the App Store',
        href: 'https://apps.apple.com/se/app/ahlsell/id1617272826',
        note: 'Live in three countries',
      },
    ],
    tint: '#2F7BFF',
    shots: [{ src: '/work/ahlsell.png', alt: 'Ahlsell app screenshot' }],
    shotLayout: 'phone',
  },
  {
    slug: 'yomento',
    name: 'Yomento',
    role: 'Head of engineering',
    text: 'I ran all frontend development across mobile and web for a habit builder for managers. I designed the build and deployment setup and led the App Store and Google Play releases.',
    proof: [
      {
        label: 'Yomento on the App Store',
        href: 'https://apps.apple.com/us/app/id6471958524',
        note: 'The current version of the app',
      },
    ],
    tint: '#B9A2F0',
    shots: [
      { src: '/work/yomento-1.jpg', alt: 'Yomento App Store screenshot' },
      { src: '/work/yomento-2.jpg', alt: 'Yomento App Store screenshot: weekly reflections' },
    ],
    shotLayout: 'pair',
  },
  {
    slug: 'booking',
    name: 'Booking.com',
    role: 'React developer',
    text: 'Car rental on Booking.com. I helped move the platform from Java and jQuery to React.',
    proof: [{ label: 'Booking.com car rental', href: 'https://www.booking.com/cars/', note: 'The live site' }],
    tint: '#1D5FD6',
    shots: [{ src: '/work/booking.jpg', alt: 'Booking.com car rentals page' }],
    shotLayout: 'web',
  },
  {
    slug: 'skiddle',
    name: 'Skiddle',
    role: 'React developer',
    text: 'Events and tickets across the UK. I was part of the team that rebuilt the promoter portal in React, where promoters create events and gigs and put tickets on sale.',
    proof: [{ label: 'Skiddle', href: 'https://www.skiddle.com/', note: 'The live site' }],
    tint: '#3FC1BF',
    shots: [{ src: '/work/skiddle.jpg', alt: 'Skiddle home page' }],
    shotLayout: 'web',
  },
]
