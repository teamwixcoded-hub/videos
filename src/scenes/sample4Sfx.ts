import type {Cue} from '../components/Sfx';

// Every sound in Sample4, in seconds, each tied to a visual in Sample4.tsx.
// Keep levels low: the narration will sit on top of this.
const meterHits = [49.8, 51.3, 52.8, 54.3, 55.8];
const reactionAt = [49.6, 51.0, 52.4, 53.8, 55.2, 56.2];

export const SAMPLE4_SFX: Cue[] = [
  // ---- bed of the whole scene: windy quiet house at night ----
  {file: 'room_tone', at: 0, dur: 80, vol: 0.2, fadeIn: 2.5, fadeOut: 2},

  // ---- S01: title card, the two glances ----
  {file: 'swell', at: 0.6, dur: 5, vol: 0.3, fadeIn: 1.2, fadeOut: 1.8},
  {file: 'cloth_b', at: 16.4, vol: 0.22}, // Red turns his head toward the phone
  {file: 'swell', at: 19.2, dur: 4.6, vol: 0.12, fadeIn: 1.5, fadeOut: 1.8}, // camera glides to Green

  // ---- S02: Red reaches, grabs, lifts ----
  {file: 'cloth_a', at: 35.6, vol: 0.28}, // arm starts out
  {file: 'cloth_b', at: 36.9, vol: 0.34}, // fingers close on the phone
  {file: 'cloth_a', at: 38.4, vol: 0.26, rate: 1.1}, // lifts it
  {file: 'notification', at: 40.2, vol: 0.26}, // the screen wakes
  {file: 'whoosh', at: 40.4, vol: 0.22, rate: 0.9}, // phone inset slides in
  {file: 'swipe', at: 41.8, vol: 0.34},
  {file: 'swipe', at: 43.6, vol: 0.34, rate: 1.08},
  {file: 'swipe', at: 45.0, vol: 0.34, rate: 0.94},
  {file: 'plink', at: 43.0, vol: 0.22},
  {file: 'whoosh', at: 45.9, vol: 0.18, rate: 1.2}, // inset leaves
  {file: 'cloth_a', at: 46.2, vol: 0.2, rate: 0.9}, // shoulders drop

  // ---- the reward: reactions pop, the meter steps up with a rising pitch ----
  {file: 'whoosh', at: 49.3, vol: 0.18, rate: 0.8},
  ...reactionAt.map((t, i): Cue => ({file: ['pop_a', 'pop_b', 'pop_c'][i % 3], at: t, vol: 0.3, rate: 0.95 + (i % 3) * 0.08})),
  {file: 'sparkle', at: 51.0, vol: 0.22, dur: 1.4},
  {file: 'sparkle', at: 56.2, vol: 0.22, dur: 1.4, rate: 1.1},
  ...meterHits.map((t, i): Cue => ({file: 'meter', at: t, vol: 0.3, rate: 0.9 + i * 0.1})),
  {file: 'plink', at: 52.0, vol: 0.22, rate: 0.95},
  {file: 'swell', at: 57.0, dur: 4.6, vol: 0.12, fadeIn: 1.5, fadeOut: 1.8}, // glide back to Green

  // ---- S02 second half: the book ----
  {file: 'cloth_b', at: 62.0, vol: 0.16},
  {file: 'page', at: 63.8, vol: 0.42}, // back to the line, a page shifts
  {file: 'cloth_a', at: 65.2, vol: 0.14},
  {file: 'plink', at: 66.0, vol: 0.22, rate: 0.9}, // Red, still laughing off in the wide shot
  {file: 'cloth_a', at: 67.0, vol: 0.2}, // eyes lift
  {file: 'whoosh', at: 66.3, vol: 0.14}, // camera drifts to the clock
  {file: 'clock', at: 67.9, dur: 3.6, vol: 0.5, fadeIn: 0.4, fadeOut: 0.8}, // the hands tick
  {file: 'whoosh', at: 70.9, vol: 0.14, rate: 0.9}, // camera back to Green

  // ---- the yawn and the tower ----
  {file: 'pop_a', at: 71.6, vol: 0.3, rate: 0.8}, // thought bubble pops
  {file: 'sleepy', at: 71.9, dur: 4.4, vol: 0.22, fadeOut: 0.5},
  {file: 'pop_b', at: 73.1, vol: 0.24, rate: 0.6}, // each book lands (stand-in: soft low pop)
  {file: 'pop_b', at: 73.6, vol: 0.24, rate: 0.6},
  {file: 'pop_b', at: 74.1, vol: 0.24, rate: 0.6},
  {file: 'pop_b', at: 74.6, vol: 0.24, rate: 0.6},
  {file: 'exhale', at: 77.1, dur: 2.4, vol: 0.2, fadeOut: 0.5},
];
