import { Audiowide, Caveat, Doto, Martian_Mono, Michroma, Mona_Sans, Pixelify_Sans, VT323, Zen_Maru_Gothic } from 'next/font/google'
import { personJsonLd } from './seo'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/cv.css'
import '@/styles/shell.css'
import '@/styles/machine.css'
import '@/styles/looks/shared.css'
import '@/styles/looks/e80.css'
import '@/styles/looks/e90.css'
import '@/styles/looks/e00.css'
import '@/styles/looks/e10.css'
import '@/styles/looks/c64.css'

const mona = Mona_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-mona' })
const martian = Martian_Mono({ subsets: ['latin'], axes: ['wdth'], variable: '--font-martian' })
const doto = Doto({ subsets: ['latin'], weight: '900', variable: '--font-doto' })
const michroma = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-michroma' })

// fonts that only the decade looks use: declared here, fetched by the browser only when a look shows them
const audiowide = Audiowide({ subsets: ['latin'], weight: '400', variable: '--font-audiowide', preload: false })
const pixelify = Pixelify_Sans({ subsets: ['latin'], weight: '700', variable: '--font-pixelify', preload: false })
const zen = Zen_Maru_Gothic({ weight: ['500', '700', '900'], variable: '--font-zen', preload: false })
const caveat = Caveat({ subsets: ['latin'], weight: '700', variable: '--font-caveat', preload: false })
const vt323 = VT323({ subsets: ['latin'], weight: '400', variable: '--font-vt323', preload: false })
const fonts = [mona, martian, doto, michroma, audiowide, pixelify, zen, caveat, vt323].map((f) => f.variable).join(' ')

export { metadata } from './seo'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fonts}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  )
}
