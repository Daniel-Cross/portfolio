/** The wide, side-by-side machine needs room both ways; a phone held sideways is wide but far too short. */
export const usesWideLayout = (width: number, height: number) => width >= 900 && height >= 620

/** How much to scale the wide machine so it fills the window and leaves room below for the tray. */
export function machineZoom(width: number, height: number): number {
  if (!usesWideLayout(width, height)) return 1
  return Math.min(1.8, (height - 200) / 640, (width - 110) / 860)
}
