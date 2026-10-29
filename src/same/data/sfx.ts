import type {Cue} from '../../components/Sfx';
import {srcToVideo} from '../lib/timeline';

// Sound cues for the finished scenes. Times are VIDEO seconds (real: true); `s(x)` converts a recording second.
const s = (src: number) => srcToVideo(src) ?? 0;
export const SAME_SFX: Cue[] = [
  // ---- S01 hook ----
  {file: 'room_tone', at: 0, real: true, dur: 90, vol: 0.2, fadeIn: 2, fadeOut: 2},
  {file: 'notification', at: 9.4, real: true, vol: 0.22}, {file: 'notification', at: 10.9, real: true, vol: 0.22},
  {file: 'sigh', at: 5.9, real: true, vol: 0.2},
  {file: 'whoosh', at: s(11.5), real: true, vol: 0.3}, {file: 'boom', at: s(11.5), real: true, vol: 0.25},
  {file: 'pickup', at: s(14.8), real: true, vol: 0.35},
  {file: 'thump', at: s(17.3), real: true, vol: 0.35},
  {file: 'titlehit', at: 25.7, real: true, vol: 0.45},
  // ---- S02 the choice: a reward pop per swipe, clock, yawn, sigh ----
  {file: 'pop_a', at: s(27.1), real: true, vol: 0.28}, {file: 'pop_c', at: s(28.0), real: true, vol: 0.28}, {file: 'pop_a', at: s(28.9), real: true, vol: 0.28},
  {file: 'swipe', at: s(30.4), real: true, vol: 0.2}, {file: 'pop_b', at: s(31.2), real: true, vol: 0.22}, {file: 'swipe', at: s(33.6), real: true, vol: 0.2}, {file: 'pop_c', at: s(34.4), real: true, vol: 0.22},
  {file: 'tick', at: s(41.4), real: true, dur: 1.4, vol: 0.3}, {file: 'yawn', at: s(42.6), real: true, vol: 0.28},
  {file: 'sigh', at: 51.2, real: true, vol: 0.3},
  // ---- S03 night one ----
  {file: 'clock', at: s(49.5), real: true, dur: 3, vol: 0.5, fadeIn: 0.2, fadeOut: 0.5},
  {file: 'thud', at: s(52.9), real: true, vol: 0.34}, {file: 'cloth_b', at: s(52.9), real: true, vol: 0.2},
  {file: 'exhale', at: s(53.6), real: true, dur: 2, vol: 0.2, fadeOut: 0.4},
  {file: 'scribble', at: s(67.6), real: true, dur: 2.5, vol: 0.28},
  {file: 'cloth_a', at: s(69.8), real: true, vol: 0.2},
  {file: 'whoosh', at: s(72.6), real: true, vol: 0.2},
];
