import { createAudioContext } from './audio'
import type { Song } from './songs'
import { chordTones, freq, type Chord } from './theory'

export type Trigger = { song: Song; chord: Chord; step: number; bar: number; note?: number }

export type Engine = {
  resume(): Promise<void>
  /** false until the browser has allowed sound, which needs a tap */
  running(): boolean
  now(): number
  setVolume(v: number): void
  setTone(v: number): void
  setEcho(v: number): void
  setReverb(v: number): void
  setTempo(bpm: number): void
  setCrackle(on: boolean): void
  /** pad: 0 Kick, 1 Snare, 2 Hat, 3 Bass, 4 Keys, 5 Lead */
  trigger(pad: number, time: number, t: Trigger): void
}

/** The bass plays the chord root in the octave from E1 to Eb2. */
const bassMidi = (root: number) => 28 + ((((root - 28) % 12) + 12) % 12)

/** Everything is synthesised: no audio files. Returns null where the browser has no Web Audio. */
export function createEngine(existing?: AudioContext | null): Engine | null {
  const context = existing ?? createAudioContext()
  if (!context) return null
  const ac: AudioContext = context

  // voices -> tone filter -> limiter -> volume -> speakers, with echo and reverb sends off the filter
  const volume = ac.createGain()
  volume.connect(ac.destination)
  const limiter = ac.createDynamicsCompressor()
  limiter.threshold.value = -16
  limiter.knee.value = 10
  limiter.ratio.value = 10
  limiter.attack.value = 0.003
  limiter.release.value = 0.2
  limiter.connect(volume)
  const tone = ac.createBiquadFilter()
  tone.type = 'lowpass'
  tone.connect(limiter)
  const out = ac.createGain()
  out.gain.value = 0.6
  out.connect(tone)

  const echoSend = ac.createGain()
  const delay = ac.createDelay(1)
  const feedback = ac.createGain()
  feedback.gain.value = 0.35
  tone.connect(echoSend)
  echoSend.connect(delay)
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(limiter)

  const reverbSend = ac.createGain()
  const reverb = ac.createConvolver()
  const tail = ac.createBuffer(2, ac.sampleRate * 2.4, ac.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = tail.getChannelData(ch)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3
  }
  reverb.buffer = tail
  tone.connect(reverbSend)
  reverbSend.connect(reverb)
  reverb.connect(limiter)

  const noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate)
  const noiseData = noise.getChannelData(0)
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1

  let crackle: AudioBufferSourceNode | null = null

  function env(time: number, peak: number, decay: number, to: AudioNode = out, attack = 0.004) {
    const gain = ac.createGain()
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.linearRampToValueAtTime(peak, time + attack)
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay)
    gain.connect(to)
    return gain
  }

  function osc(wave: OscillatorType, hz: number, time: number, length: number, to: AudioNode, detune = 0) {
    const o = ac.createOscillator()
    o.type = wave
    o.frequency.setValueAtTime(hz, time)
    o.detune.value = detune
    o.connect(to)
    o.start(time)
    o.stop(time + length + 0.03)
    return o
  }

  function lowpass(hz: number, to: AudioNode) {
    const f = ac.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = hz
    f.connect(to)
    return f
  }

  function burst(time: number, length: number, type: BiquadFilterType, hz: number, to: AudioNode, q?: number) {
    const src = ac.createBufferSource()
    src.buffer = noise
    const f = ac.createBiquadFilter()
    f.type = type
    f.frequency.value = hz
    if (q !== undefined) f.Q.value = q
    src.connect(f)
    f.connect(to)
    src.start(time, Math.random() * 0.5)
    src.stop(time + length + 0.03)
  }

  function snare(kind: Song['kit']['snare'], time: number) {
    if (kind === 'clap') {
      for (const offset of [0, 0.012, 0.025]) burst(time + offset, 0.13, 'bandpass', 1500, env(time + offset, 0.45, 0.13))
    } else if (kind === 'soft') {
      burst(time, 0.14, 'bandpass', 1100, env(time, 0.4, 0.14))
      osc('triangle', 200, time, 0.06, env(time, 0.2, 0.06))
    } else {
      // gated: holds, then cuts off quickly
      const gate = ac.createGain()
      gate.gain.setValueAtTime(0.2, time)
      gate.gain.exponentialRampToValueAtTime(0.06, time + 0.1)
      gate.gain.linearRampToValueAtTime(0, time + 0.13)
      gate.connect(out)
      burst(time, 0.14, 'bandpass', 1000, gate, 0.9)
      osc('triangle', 190, time, 0.1, env(time, 0.28, 0.1))
    }
  }

  function keys(kind: Song['kit']['keys'], hz: number, index: number, time: number, t: Trigger) {
    if (kind === 'ep') {
      const at = time + index * 0.02
      const body = lowpass(850, env(at, 0.05, 1.6, out, 0.03))
      osc('sine', hz, at, 1.8, body, (Math.random() - 0.5) * 10)
      osc('sine', hz * 2, at, 1.8, env(at, 0.004, 0.5, body, 0.02))
    } else if (kind === 'saw') {
      const body = lowpass(3600, env(time, 0.05, 0.2))
      for (const detune of [-14, 0, 14]) osc('sawtooth', hz, time, 0.22, body, detune)
    } else if (kind === 'arp') {
      return
    } else if (kind === 'filt') {
      // the filter opens and closes once over the four bars
      const cutoff = 450 + 2800 * (0.5 - 0.5 * Math.cos((Math.PI * 2 * (t.bar * 16 + t.step)) / 64))
      const body = lowpass(cutoff, env(time, 0.065, 0.22))
      for (const detune of [-12, 0, 12]) osc('sawtooth', hz, time, 0.24, body, detune)
    } else {
      const body = lowpass(1500, env(time, 0.045, 0.5, out, 0.015))
      osc('sawtooth', hz, time, 0.55, body, -7)
      osc('sawtooth', hz, time, 0.55, body, 7)
    }
  }

  /** One beat of the chord played as eight quick single notes, climbing into the next octave. */
  function arpeggio(t: Trigger, time: number) {
    const tones = chordTones(t.chord)
    const each = 60 / t.song.bpm / 8
    for (let n = 0; n < 8; n++) {
      const midi = bassMidi(t.chord.root) + 36 + tones[n % tones.length] + (n >= tones.length ? 12 : 0)
      osc('square', freq(midi), time + n * each, each * 0.9, env(time + n * each, 0.03, each * 0.9))
    }
  }

  return {
    resume: () => ac.resume(),
    running: () => ac.state === 'running',
    now: () => ac.currentTime,
    setVolume: (v) => void (volume.gain.value = v),
    setTone: (v) => void (tone.frequency.value = 300 * 40 ** v),
    setEcho: (v) => void (echoSend.gain.value = v),
    setReverb: (v) => void (reverbSend.gain.value = v * 0.9),
    setTempo: (bpm) => void (delay.delayTime.value = Math.min(0.95, (60 / bpm) * 0.75)),
    setCrackle(on) {
      crackle?.stop()
      crackle = null
      if (!on) return
      const buffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() < 0.0009 ? Math.random() * 2 - 1 : 0) + (Math.random() * 2 - 1) * 0.012
      }
      crackle = ac.createBufferSource()
      crackle.buffer = buffer
      crackle.loop = true
      const level = ac.createGain()
      level.gain.value = 0.22
      crackle.connect(level)
      level.connect(tone)
      crackle.start()
    },
    trigger(pad, time, t) {
      const kit = t.song.kit
      if (pad === 0) {
        const o = osc('sine', kit.kick.from, time, kit.kick.decay, env(time, kit.kick.gain, kit.kick.decay))
        o.frequency.exponentialRampToValueAtTime(kit.kick.to, time + 0.1)
      } else if (pad === 1) {
        snare(kit.snare, time)
      } else if (pad === 2) {
        burst(time, kit.hat.decay, 'highpass', kit.hat.highpass, env(time, kit.hat.gain, kit.hat.decay))
      } else if (pad === 3) {
        const midi = bassMidi(t.chord.root) + (t.song.bassOffsets[t.step] ?? 0)
        osc(kit.bass.wave, freq(midi), time, kit.bass.decay, lowpass(kit.bass.cutoff, env(time, kit.bass.gain, kit.bass.decay)))
      } else if (pad === 4) {
        if (kit.keys === 'arp') arpeggio(t, time)
        else chordTones(t.chord).forEach((tone, i) => keys(kit.keys, freq(bassMidi(t.chord.root) + 24 + tone), i, time, t))
      } else if (pad === 5 && t.note) {
        osc(kit.lead.wave, freq(t.note), time, kit.lead.decay, lowpass(3000, env(time, kit.lead.gain, kit.lead.decay)))
      }
    },
  }
}
