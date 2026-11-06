export type Look = 'clean' | 'e80' | 'e90' | 'e00' | 'e10'

/** The look on screen: the song's decade while immersed and playing, otherwise the visitor's pick. */
export function effectiveLook(s: { immersion: boolean; playing: boolean; songLook: Look; picked: Look }): Look {
  return s.immersion && s.playing ? s.songLook : s.picked
}

/** Picking a look by hand only switches immersion off when a song would otherwise override the pick. */
export function pickLook(s: { immersion: boolean; playing: boolean }, look: Look): { picked: Look; immersion: boolean } {
  return { picked: look, immersion: s.playing ? false : s.immersion }
}
