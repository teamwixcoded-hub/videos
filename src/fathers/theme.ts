import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';
import {loadFont as loadUI} from '@remotion/google-fonts/Montserrat';

// Two Fathers is a warm human story: serif titles, handwriting for notes, a clean UI face for phones and documents. No HUD, no glitch.
export const SERIF = loadPlayfair('normal', {weights: ['600', '800']}).fontFamily;
export const SERIF_I = loadPlayfair('italic', {weights: ['500']}).fontFamily;
export const HAND = loadCaveat('normal', {weights: ['600']}).fontFamily;
export const UI = loadUI('normal', {weights: ['500', '700']}).fontFamily;
export const W = 1920, H = 1080;

export const INK = '#3a2a26';          // every outline is warm dark brown, never black
export const PAPER = '#f4ecdc', CREAM = '#fbf5e8', GOLD = '#e9a93b', RUST = '#b4592f', NAVY = '#26324f';

// ---- grades by act (video seconds). Each key: tint colour + strength (soft-light overlay), saturation, brightness ----
export type GradeKey = {t: number; c: [number, number, number]; a: number; sat: number; br: number};
const COLD: [number, number, number] = [120, 150, 190], SOFT: [number, number, number] = [255, 250, 240], AMBER: [number, number, number] = [255, 160, 70];
const DAY: [number, number, number] = [255, 190, 110], NAVYG: [number, number, number] = [40, 60, 120], CITY: [number, number, number] = [235, 235, 235];
const GOLDG: [number, number, number] = [255, 170, 70], GREY: [number, number, number] = [130, 150, 175], MORN: [number, number, number] = [255, 215, 150];
export const GRADES: GradeKey[] = [
  {t: 0, c: COLD, a: 0.30, sat: 0.78, br: 0.96},      // cold open: pale grey-blue morning
  {t: 31, c: COLD, a: 0.30, sat: 0.78, br: 0.96},
  {t: 35, c: SOFT, a: 0.20, sat: 0.9, br: 1.04},      // hospital: soft white
  {t: 52, c: SOFT, a: 0.20, sat: 0.9, br: 1.04},
  {t: 54, c: AMBER, a: 0.26, sat: 1.05, br: 1.0},     // amber 6:00 PM
  {t: 74, c: DAY, a: 0.20, sat: 1.08, br: 1.02},      // escalation: warm daylight
  {t: 190, c: DAY, a: 0.20, sat: 1.08, br: 1.02},
  {t: 200, c: [210, 140, 110], a: 0.26, sat: 0.98, br: 0.94},   // dusk, age 15
  {t: 250, c: NAVYG, a: 0.34, sat: 0.9, br: 0.86},    // deep navy night
  {t: 286, c: NAVYG, a: 0.34, sat: 0.9, br: 0.86},
  {t: 290, c: CITY, a: 0.12, sat: 1.0, br: 1.02},     // age 25: neutral city daylight
  {t: 311, c: CITY, a: 0.12, sat: 1.0, br: 1.02},
  {t: 314, c: COLD, a: 0.30, sat: 0.78, br: 0.96},    // back to the cold grey-blue Sunday
  {t: 361, c: COLD, a: 0.30, sat: 0.78, br: 0.96},
  {t: 364, c: GOLDG, a: 0.30, sat: 1.12, br: 1.0},    // golden sunset at the stall
  {t: 415, c: GOLDG, a: 0.30, sat: 1.12, br: 1.0},
  {t: 418, c: GREY, a: 0.30, sat: 0.74, br: 0.95},    // S11: cold grey while Adam calls
  {t: 441, c: GREY, a: 0.30, sat: 0.74, br: 0.95},
  {t: 449, c: [255, 175, 80], a: 0.30, sat: 1.12, br: 1.03},    // warms to gold after "Dad"
  {t: 456, c: MORN, a: 0.18, sat: 1.08, br: 1.04},    // Friday in warm morning light
  {t: 490, c: MORN, a: 0.18, sat: 1.08, br: 1.04},
];
export const gradeAt = (t: number): GradeKey => {
  let i = 0; while (i < GRADES.length - 1 && GRADES[i + 1].t <= t) i++;
  const a = GRADES[i], b = GRADES[Math.min(i + 1, GRADES.length - 1)], k = b.t === a.t ? 0 : Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  const m = (x: number, y: number) => x + (y - x) * k;
  return {t, c: [m(a.c[0], b.c[0]), m(a.c[1], b.c[1]), m(a.c[2], b.c[2])], a: m(a.a, b.a), sat: m(a.sat, b.sat), br: m(a.br, b.br)};
};
