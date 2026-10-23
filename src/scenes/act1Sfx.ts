import type {Cue} from '../components/Sfx';
import {SAMPLE5_SFX} from './sample5Sfx';

// Act 1 = S01 + S02 (Sample5's cues) + S03 (night one). The room tone and sigh are re-timed for the longer act.
export const ACT1_SFX: Cue[] = [
  ...SAMPLE5_SFX.filter((c) => c.file !== 'room_tone' && c.file !== 'sigh'),
  {file: 'pop_a', at: 1.4, vol: 0.26}, {file: 'pop_c', at: 2.0, vol: 0.26},
  {file: 'pop_a', at: 17.0, vol: 0.22}, {file: 'pop_c', at: 22.4, vol: 0.22},
  {file: 'page', at: 6.1, vol: 0.2},
  {file: 'page', at: 36.1, vol: 0.2},
  {file: 'page', at: 58.1, vol: 0.2},
  {file: 'tea', at: 21.1, dur: 2.0, vol: 0.18, fadeOut: 0.3},
  {file: 'tea', at: 45.1, dur: 2.0, vol: 0.18, fadeOut: 0.3},
  {file: 'exhale', at: 8.8, dur: 2.2, vol: 0.2, rate: 1.1, fadeOut: 0.4},
  {file: 'swell', at: 99.8, dur: 3, vol: 0.16, fadeIn: 0.6, fadeOut: 0.8},
  {file: 'room_tone', at: 0, dur: 112, vol: 0.2, fadeIn: 2.5, fadeOut: 2.5},

  // ---- S03: night one ----
  {file: 'cloth_a', at: 72.4, vol: 0.25, rate: 0.85}, // Red settles into bed
  {file: 'exhale', at: 76.1, dur: 2.4, vol: 0.2, fadeOut: 0.5}, // Green, off screen
  {file: 'whoosh', at: 77.0, vol: 0.14}, // camera to Red
  {file: 'notification', at: 77.8, vol: 0.2, rate: 1.1}, // one more ping
  {file: 'clock', at: 78.9, dur: 3.0, vol: 0.5, fadeIn: 0.3, fadeOut: 0.7}, // the hands race to 2 AM
  {file: 'whoosh', at: 83.3, vol: 0.14}, // camera across to Green
  {file: 'cloth_b', at: 83.0, vol: 0.2}, // the book closes
  {file: 'thud', at: 83.1, vol: 0.34}, // stand-in for the soft thud
  {file: 'exhale', at: 86.3, dur: 2.4, vol: 0.2, rate: 0.9, fadeOut: 0.5}, // frustrated
  {file: 'whoosh', at: 89.2, vol: 0.14}, // back to Red
  {file: 'cloth_a', at: 92.8, vol: 0.18, rate: 0.9},
  {file: 'whoosh', at: 94.1, vol: 0.14, rate: 0.9}, // wide
  {file: 'switch', at: 97.7, vol: 0.5}, // the lamp clicks off
  {file: 'swell', at: 100.6, dur: 5, vol: 0.2, fadeIn: 1.5, fadeOut: 2},
];
