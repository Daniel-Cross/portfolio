import type { Fx } from './types'

/** A striped sun on the horizon and a grid rushing towards the viewer. */
const e80: Fx = (g, { w, h, t, beat }) => {
  const horizon = h * 0.56
  const cx = w / 2
  const r = Math.min(w, h) * 0.2

  const sun = g.createLinearGradient(0, horizon - 2 * r, 0, horizon)
  sun.addColorStop(0, '#FFD23F')
  sun.addColorStop(1, '#FF2E93')
  g.fillStyle = sun
  g.globalAlpha = 0.55 + beat * 0.2
  g.beginPath()
  g.arc(cx, horizon - r * 0.25, r, 0, Math.PI * 2)
  g.fill()

  // cut the stripes and everything below the horizon out of the sun
  g.globalCompositeOperation = 'destination-out'
  g.globalAlpha = 1
  for (let i = 0; i < 6; i++) g.fillRect(cx - r, horizon - r * 0.25 + r * (0.1 + i * 0.16), 2 * r, 3 + i * 1.6)
  g.fillRect(0, horizon, w, h)
  g.globalCompositeOperation = 'source-over'

  g.strokeStyle = '#FF2E93'
  g.lineWidth = 1.5
  g.globalAlpha = 0.45 + beat * 0.35
  g.beginPath()
  for (let i = -14; i <= 14; i++) {
    g.moveTo(cx + i * 18, horizon)
    g.lineTo(cx + i * w * 0.16, h)
  }
  const travel = (t * 0.00035) % 1
  for (let k = 0; k < 14; k++) {
    const y = horizon + (h - horizon) * ((k + travel) / 14) ** 2.3
    g.moveTo(0, y)
    g.lineTo(w, y)
  }
  g.stroke()

  g.strokeStyle = '#21E6F0'
  g.globalAlpha = 0.7
  g.beginPath()
  g.moveTo(0, horizon)
  g.lineTo(w, horizon)
  g.stroke()
  g.globalAlpha = 1
}

export default e80
