import { between, type Fx } from './types'

type Light = { x: number; y: number; r: number; drift: number; rgb: string }
type Drop = { x: number; y: number; length: number; speed: number }

const COLOURS = ['242,166,90', '217,119,127', '60,110,113']

/** Rain falling at a slant over soft, out-of-focus city lights. */
const e10: Fx = (g, { w, h, dt, mem }) => {
  const lights = (mem.lights ??= Array.from(
    { length: 16 },
    (): Light => ({ x: Math.random(), y: Math.random(), r: between(30, 110), drift: between(-1, 1), rgb: COLOURS[Math.floor(Math.random() * 3)] }),
  )) as Light[]
  const rain = (mem.rain ??= Array.from(
    { length: 150 },
    (): Drop => ({ x: Math.random() * 1.2, y: Math.random(), length: between(10, 26), speed: between(0.5, 1) }),
  )) as Drop[]

  for (const light of lights) {
    light.x += light.drift * dt * 0.000006
    if (light.x < -0.1) light.x = 1.1
    if (light.x > 1.1) light.x = -0.1
    const x = light.x * w
    const y = light.y * h
    const glow = g.createRadialGradient(x, y, 0, x, y, light.r)
    glow.addColorStop(0, `rgba(${light.rgb},.13)`)
    glow.addColorStop(1, `rgba(${light.rgb},0)`)
    g.fillStyle = glow
    g.fillRect(x - light.r, y - light.r, 2 * light.r, 2 * light.r)
  }

  g.strokeStyle = 'rgba(235,220,195,.2)'
  g.lineWidth = 1
  g.beginPath()
  for (const drop of rain) {
    drop.y += dt * 0.0011 * drop.speed
    drop.x -= dt * 0.00012 * drop.speed
    if (drop.y > 1.05) {
      drop.y = -0.05
      drop.x = Math.random() * 1.2
    }
    const x = drop.x * w
    const y = drop.y * h
    g.moveTo(x, y)
    g.lineTo(x - drop.length * 0.22, y + drop.length)
  }
  g.stroke()
}

export default e10
