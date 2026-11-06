/** A new audio context, or null where the browser has none. Call it inside a tap so the browser allows sound. */
export function createAudioContext(): AudioContext | null {
  const g = globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
  const Ctor = g.AudioContext ?? g.webkitAudioContext
  return Ctor ? new Ctor() : null
}
