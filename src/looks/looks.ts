/** 'c64' is the hidden look that goes with the easter egg; it is never offered in the Look menu. */
export type Look = 'clean' | 'e80' | 'e90' | 'e00' | 'e10' | 'c64'

/** The look on screen: the song's decade while immersed and playing, otherwise the visitor's pick.
 *  A loop the visitor built reports 'clean' as its look, so it never changes the theme. */
export function effectiveLook(s: { immersion: boolean; playing: boolean; songLook: Look; picked: Look }): Look {
  return s.immersion && s.playing && s.songLook !== 'clean' ? s.songLook : s.picked
}

/** Picking a look by hand only switches immersion off when a song would otherwise override the pick. */
export function pickLook(s: { immersion: boolean; playing: boolean }, look: Look): { picked: Look; immersion: boolean } {
  return { picked: look, immersion: s.playing ? false : s.immersion }
}
