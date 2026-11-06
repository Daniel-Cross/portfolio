import { between, type Fx } from './types'

type Cloud = { x: number; y: number; size: number; speed: number }

/** each cloud is five soft blobs: [dx, dy, scale] */
const PUFFS = [
  [0, 0, 1],
  [-0.9, 0.25, 0.7],
  [0.9, 0.2, 0.75],
  [-0.4, -0.35, 0.7],
  [0.45, -0.3, 0.65],
]

/** Clouds drifting across the sky. */
const e00: Fx = (g, { w, h, dt, mem }) => {
  const clouds = (mem.clouds ??= Array.from(
    { length: 7 },
    (): Cloud => ({ x: Math.random(), y: between(0.02, 0.42), size: between(60, 150), speed: between(0.000004, 0.000012) }),
  )) as Cloud[]

  for (const cloud of clouds) {
    cloud.x += cloud.speed * dt
    if (cloud.x > 1.2) cloud.x = -0.2
    for (const [dx, dy, scale] of PUFFS) {
      const x = cloud.x * w + dx * cloud.size
      const y = cloud.y * h + dy * cloud.size
      const r = cloud.size * scale
      const puff = g.createRadialGradient(x, y, 0, x, y, r)
      puff.addColorStop(0, 'rgba(255,255,255,.55)')
      puff.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = puff
      g.fillRect(x - r, y - r, 2 * r, 2 * r)
    }
  }
}

export default e00
