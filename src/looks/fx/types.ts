export type Frame = {
  w: number
  h: number
  /** milliseconds since the page loaded */
  t: number
  /** milliseconds since the last frame */
  dt: number
  /** 1 on a kick drum, fading towards 0 */
  beat: number
  /** scratch space that lasts while the look is on screen */
  mem: Record<string, unknown>
}

export type Fx = (g: CanvasRenderingContext2D, f: Frame) => void

export const between = (lo: number, hi: number) => lo + Math.random() * (hi - lo)
