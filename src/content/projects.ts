export type ProjectCard = {
  slug: string
  name: string
  status?: string
  text: string
  links: { label: string; href: string }[]
  banner?: { src: string; alt: string; fit?: 'top' | 'center' }
}

export const projects: ProjectCard[] = [
  {
    slug: 'football-alpha',
    name: 'Football Alpha',
    status: 'Early access',
    text: 'A football player exchange. Buy positions in real footballers, earn dividends when they play well, sell when the price has risen.',
    links: [{ label: 'Open the app', href: 'https://www.footballalpha.io' }],
    banner: { src: '/work/football-alpha.jpg', alt: 'Football Alpha website: holdings in three players' },
  },
  {
    slug: 'haven',
    name: 'Haven',
    status: 'On the App Store',
    text: 'Behaviour management for schools. Teachers log incidents and praise in an app; staff and guardians see it in a dashboard.',
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/haven-software/id6449934429' },
      { label: 'Website', href: 'https://www.safehaven.dev' },
    ],
    banner: { src: '/work/haven.jpg', alt: 'Haven App Store screenshots' },
  },
  {
    slug: 'neo',
    name: 'Neo',
    text: 'Pay friends, request money and split bills on Solana. Your wallet lives on your phone; Neo never holds your money.',
    links: [],
    banner: { src: '/work/neo.png', alt: 'Neo splash screen', fit: 'center' },
  },
  {
    slug: 'bandwagon',
    name: 'Bandwagon',
    status: 'Coming soon',
    text: 'A place for bands to be seen while they are still getting good, and for fans to get there early. Stockholm first.',
    links: [],
  },
]
