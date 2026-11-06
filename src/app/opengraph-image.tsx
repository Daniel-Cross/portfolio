import { ImageResponse } from 'next/og'
import { site } from '@/content'

export const alt = 'Daniel Cross, lead mobile engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const stripe = ['#d8412f', '#e8842a', '#ebc43d']

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: '#2b2927',
          color: '#ede6d8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 150, fontWeight: 900, lineHeight: 0.9, letterSpacing: -4 }}>
          <span>DANIEL</span>
          <span>CROSS</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: 260, marginTop: 36, gap: 3 }}>
          {stripe.map((color) => (
            <div key={color} style={{ height: 8, background: color }} />
          ))}
        </div>
        <div style={{ marginTop: 40, fontSize: 40, color: '#a39c8e' }}>{site.pitch}</div>
      </div>
    ),
    size,
  )
}
