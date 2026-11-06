import { Doto, Martian_Mono, Michroma, Mona_Sans } from 'next/font/google'
import { personJsonLd } from './seo'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/cv.css'
import '@/styles/shell.css'
import '@/styles/machine.css'

const mona = Mona_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-mona' })
const martian = Martian_Mono({ subsets: ['latin'], axes: ['wdth'], variable: '--font-martian' })
const doto = Doto({ subsets: ['latin'], weight: '900', variable: '--font-doto' })
const michroma = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-michroma' })

export { metadata } from './seo'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mona.variable} ${martian.variable} ${doto.variable} ${michroma.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  )
}
