/**
 * sfx-web — a zero-asset sound effects kit for the browser.
 * Everything is synthesized with the Web Audio API: no files, no loading,
 * no dependencies. The AudioContext lazily unlocks on the first user
 * gesture, satisfying autoplay policies.
 *
 * Usage:
 *   import { sfx } from "./sfx.js"
 *   button.onclick = () => sfx.coin()
 *   sfx.muted = true  // persisted in localStorage
 */

let ctx = null
let mutedFlag = null
const MUTE_KEY = "sfx-web:muted"

function ensure() {
  if (!ctx) {
    try {
      ctx = new AudioContext()
    } catch {
      ctx = null
    }
  }
  ctx?.resume().catch(() => {})
  return ctx
}

function loadMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1"
  } catch {
    return false
  }
}

/**
 * A single oscillator note with an exponential decay envelope.
 * @param {number} freq  Hz
 * @param {number} dur   seconds
 * @param {OscillatorType} type  sine | square | sawtooth | triangle
 * @param {number} vol   0–1
 * @param {number} delay seconds from now
 */
export function tone(freq, dur = 0.12, type = "sine", vol = 0.06, delay = 0) {
  if (sfx.muted) return
  const a = ensure()
  if (!a) return
  const t0 = a.currentTime + delay
  const osc = a.createOscillator()
  const gain = a.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(gain)
  gain.connect(a.destination)
  osc.start(t0)
  osc.stop(t0 + dur)
}

/** A frequency glide — good for whooshes, trickles, slides. */
export function sweep(from, to, dur = 0.16, type = "sine", vol = 0.05) {
  if (sfx.muted) return
  const a = ensure()
  if (!a) return
  const t0 = a.currentTime
  const osc = a.createOscillator()
  const gain = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t0)
  osc.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(gain)
  gain.connect(a.destination)
  osc.start(t0)
  osc.stop(t0 + dur)
}

/** Compose your own: sfx.custom([[440, .1, "triangle"], [660, .1, "triangle", .06, .08]]) */
export function custom(notes) {
  for (const [f, d, t, v, dl] of notes) tone(f, d, t, v, dl)
}

export const sfx = {
  // ---- one-shots ----
  /** Soft confirmation blip — buttons, pickups */
  blip: () => tone(620, 0.07, "square", 0.05),
  /** Rising two-note confirm */
  confirm: () => {
    tone(440, 0.09, "triangle", 0.06)
    tone(554, 0.12, "triangle", 0.06, 0.07)
  },
  /** Short bright coin/collect chime */
  coin: () => {
    tone(880, 0.06, "square", 0.05)
    tone(1320, 0.1, "square", 0.04, 0.05)
  },
  /** Gentle three-note success */
  success: () => {
    tone(523, 0.09, "triangle", 0.07)
    tone(659, 0.09, "triangle", 0.07, 0.08)
    tone(784, 0.14, "triangle", 0.07, 0.16)
  },
  /** Falling two-note fail */
  error: () => {
    tone(330, 0.12, "sawtooth", 0.05)
    tone(220, 0.18, "sawtooth", 0.05, 0.1)
  },
  /** Low impact thud — collisions, thumps */
  thud: () => tone(110, 0.14, "sawtooth", 0.07),
  /** Downward whoosh — movement, swipes, water */
  whoosh: () => sweep(900, 240, 0.18, "sine", 0.05),
  /** Upward whoosh — jumps, launches */
  launch: () => sweep(240, 900, 0.18, "triangle", 0.05),
  /** Tiny UI tick */
  tick: () => tone(1000, 0.03, "square", 0.03),
  /** Descending game-over phrase */
  over: () => {
    tone(392, 0.18, "triangle", 0.06)
    tone(330, 0.18, "triangle", 0.06, 0.18)
    tone(262, 0.3, "triangle", 0.06, 0.36)
  },
  /** Ascending start phrase */
  start: () => {
    tone(262, 0.12, "triangle", 0.05)
    tone(392, 0.16, "triangle", 0.05, 0.12)
  },

  // ---- compose your own ----
  custom,
  tone,
  sweep,

  // ---- mute ----
  get muted() {
    return mutedFlag ?? loadMuted()
  },
  set muted(m) {
    mutedFlag = m
    try {
      window.localStorage.setItem(MUTE_KEY, m ? "1" : "0")
    } catch {
      // private mode — the in-memory flag still holds for this session
    }
  },
}
