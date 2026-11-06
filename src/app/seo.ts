import type { Metadata } from 'next'
import { site } from '@/content'

const title = 'Daniel Cross | Lead Mobile Engineer, React Native and Crypto'
const description =
  'Lead mobile engineer in Stockholm. React Native apps taken from first commit to the App Store, Solana, and MetaMask Mobile.'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'profile', url: site.url, siteName: site.name, title, description },
  twitter: { card: 'summary_large_image', title, description },
}

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressLocality: site.location, addressCountry: 'SE' },
  knowsAbout: ['React Native', 'TypeScript', 'Expo', 'Solana', 'Mobile engineering'],
  sameAs: [site.github, site.linkedin],
}
