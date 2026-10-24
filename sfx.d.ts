export type SfxNote = [
  freq: number,
  dur?: number,
  type?: OscillatorType,
  vol?: number,
  delay?: number,
]

export function tone(
  freq: number,
  dur?: number,
  type?: OscillatorType,
  vol?: number,
  delay?: number
): void

export function sweep(
  from: number,
  to: number,
  dur?: number,
  type?: OscillatorType,
  vol?: number
): void

export function custom(notes: SfxNote[]): void

export const sfx: {
  blip(): void
  confirm(): void
  coin(): void
  success(): void
  error(): void
  thud(): void
  whoosh(): void
  launch(): void
  tick(): void
  over(): void
  start(): void
  custom: typeof custom
  tone: typeof tone
  sweep: typeof sweep
  /** Persisted to localStorage. */
  muted: boolean
}
