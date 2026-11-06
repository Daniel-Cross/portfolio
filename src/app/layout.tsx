import type { Metadata } from 'next'
import { Doto, Martian_Mono, Michroma, Mona_Sans } from 'next/font/google'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/cv.css'

const mona = Mona_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-mona' })
const martian = Martian_Mono({ subsets: ['latin'], axes: ['wdth'], variable: '--font-martian' })
const doto = Doto({ subsets: ['latin'], weight: '900', variable: '--font-doto' })
const michroma = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-michroma' })

export const metadata: Metadata = {
  title: 'Daniel Cross | Lead Mobile Engineer',
  description:
    'Lead mobile engineer in Stockholm. React Native and crypto: apps taken from first commit to the App Store, Solana, and MetaMask Mobile.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mona.variable} ${martian.variable} ${doto.variable} ${michroma.variable}`}>
      <body>{children}</body>
    </html>
  )
}
