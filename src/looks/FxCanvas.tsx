'use client'

import { useEffect, useRef, type MutableRefObject } from 'react'
import e00 from './fx/e00'
import e10 from './fx/e10'
import e80 from './fx/e80'
import e90 from './fx/e90'
import type { Fx } from './fx/types'
import type { Look } from './looks'

const FX: Partial<Record<Look, Fx>> = { e80, e90, e00, e10 }

/** The animated background for a decade look. It sits behind the pages and pulses on the kick drum. */
export function FxCanvas({ look, beatRef }: { look: Look; beatRef: MutableRefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const g = canvas?.getContext('2d')
    const draw = FX[look]
    if (!canvas || !g) return

    let mem: Record<string, unknown> = {}
    const fit = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      mem = {}
    }
    fit()
    g.clearRect(0, 0, canvas.width, canvas.height)
    if (!draw) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let last = 0
    const paint = (t: number) => {
      const dt = Math.min(50, last ? t - last : 16)
      last = t
      g.clearRect(0, 0, canvas.width, canvas.height)
      draw(g, { w: canvas.width, h: canvas.height, t, dt, beat: beatRef.current, mem })
      beatRef.current *= 0.9
      if (!still) frame = requestAnimationFrame(paint)
    }
    if (still) paint(0)
    else frame = requestAnimationFrame(paint)

    window.addEventListener('resize', fit)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', fit)
    }
  }, [look, beatRef])

  return <canvas ref={canvasRef} className="fx" aria-hidden="true" />
}

export default FxCanvas
