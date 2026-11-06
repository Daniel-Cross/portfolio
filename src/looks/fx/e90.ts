import { between, type Fx } from './types'

type Point = { x: number; y: number; vx: number; vy: number }
type Shape = { hue: number; trail: [number, number][][]; points: Point[] }

const speed = () => between(0.08, 0.2) * (Math.random() < 0.5 ? -1 : 1)

/** Two polygons bouncing around the screen and leaving trails, like the Mystify screensaver. */
const e90: Fx = (g, { w, h, dt, beat, mem }) => {
  const shapes = (mem.shapes ??= [0, 1].map(
    (i): Shape => ({
      hue: i * 140,
      trail: [],
      points: Array.from({ length: 4 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: speed(), vy: speed() })),
    }),
  )) as Shape[]

  for (const shape of shapes) {
    for (const p of shape.points) {
      p.x += p.vx * dt * (1 + beat)
      p.y += p.vy * dt * (1 + beat)
      if (p.x < 0 || p.x > w) p.vx *= -1
      if (p.y < 0 || p.y > h) p.vy *= -1
    }
    shape.hue = (shape.hue + dt * 0.02) % 360
    shape.trail.push(shape.points.map((p): [number, number] => [p.x, p.y]))
    if (shape.trail.length > 9) shape.trail.shift()

    shape.trail.forEach((outline, age) => {
      g.strokeStyle = `hsla(${shape.hue}, 100%, 70%, ${((age + 1) / shape.trail.length) * 0.7})`
      g.lineWidth = 1.5
      g.beginPath()
      outline.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
      g.closePath()
      g.stroke()
    })
  }
}

export default e90
