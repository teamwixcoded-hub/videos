import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';
import {loadFont as loadUI} from '@remotion/google-fonts/Montserrat';
import {T} from './timeline';

// Two Fathers is a warm human story: serif titles, handwriting for notes, a clean UI face for phones and documents. No HUD, no glitch.
export const SERIF = loadPlayfair('normal', {weights: ['600', '800']}).fontFamily;
export const SERIF_I = loadPlayfair('italic', {weights: ['500']}).fontFamily;
export const HAND = loadCaveat('normal', {weights: ['600']}).fontFamily;
export const UI = loadUI('normal', {weights: ['500', '700']}).fontFamily;
export const W = 1920, H = 1080;

export const INK = '#1d1a2e';          // the Same Man ink: dark navy outlines
export const PAPER = '#f4ecdc', CREAM = '#fbf5e8', GOLD = '#e9a93b', RUST = '#b4592f', NAVY = '#26324f';

// ---- grades by act (video seconds). Each key: tint colour + strength (soft-light overlay), saturation, brightness ----
export type GradeKey = {t: number; c: [number, number, number]; a: number; sat: number; br: number};
const COLD: [number, number, number] = [120, 150, 190], SOFT: [number, number, number] = [255, 250, 240], AMBER: [number, number, number] = [255, 160, 70];
const DAY: [number, number, number] = [255, 190, 110], NAVYG: [number, number, number] = [40, 60, 120], CITY: [number, number, number] = [235, 235, 235];
const GOLDG: [number, number, number] = [255, 170, 70], GREY: [number, number, number] = [130, 150, 175], MORN: [number, number, number] = [255, 215, 150];
export const GRADES: GradeKey[] = (() => {
  const k = (t: number, c: [number, number, number], a: number, sat: number, br: number): GradeKey => ({t, c, a, sat, br});
  const end = T('thirty years ago') - 0.5, hosp = T('these two men'), father = T('to understand adam'), six = T('and every evening at six'), sam = T('sam worked too'), fifteen = T('at 15'), night = T('one night');
  const city = T('leo grew up successful'), spring = T('then last spring'), back = T('which brings us back'), sunset = T('across the street', 1), call = T('that sunday adam picks up'), friday = T('that friday');
  return [
    k(0, COLD, 0.30, 0.8, 0.97), k(end, COLD, 0.30, 0.8, 0.97), k(hosp, SOFT, 0.18, 0.92, 1.03), k(father - 0.3, SOFT, 0.18, 0.92, 1.03),
    k(father + 0.5, [255, 200, 140], 0.26, 0.85, 0.97), k(six - 0.3, [255, 200, 140], 0.26, 0.85, 0.97),
    k(six + 0.5, AMBER, 0.26, 1.05, 1.0), k(sam - 0.3, AMBER, 0.26, 1.05, 1.0), k(sam + 1.5, DAY, 0.2, 1.08, 1.02), k(fifteen - 1, DAY, 0.2, 1.08, 1.02),
    k(fifteen + 0.5, [210, 140, 110], 0.26, 0.98, 0.94), k(night, [210, 140, 110], 0.26, 0.98, 0.94), k(night + 2, NAVYG, 0.34, 0.9, 0.86), k(city - 1, NAVYG, 0.34, 0.9, 0.86),
    k(city + 0.5, CITY, 0.12, 1.0, 1.02), k(spring + 3, CITY, 0.12, 1.0, 1.02), k(back - 1, COLD, 0.30, 0.8, 0.97), k(sunset - 1, COLD, 0.30, 0.8, 0.97),
    k(sunset + 0.5, GOLDG, 0.30, 1.12, 1.0), k(call - 1, GOLDG, 0.30, 1.12, 1.0), k(call + 0.5, GREY, 0.30, 0.74, 0.95), k(383, GREY, 0.30, 0.74, 0.95),
    k(385, [255, 175, 80], 0.30, 1.12, 1.03), k(friday + 0.5, MORN, 0.18, 1.08, 1.04), k(430, MORN, 0.18, 1.08, 1.04),
  ];
})();
export const gradeAt = (t: number): GradeKey => {
  let i = 0; while (i < GRADES.length - 1 && GRADES[i + 1].t <= t) i++;
  const a = GRADES[i], b = GRADES[Math.min(i + 1, GRADES.length - 1)], k = b.t === a.t ? 0 : Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  const m = (x: number, y: number) => x + (y - x) * k;
  return {t, c: [m(a.c[0], b.c[0]), m(a.c[1], b.c[1]), m(a.c[2], b.c[2])], a: m(a.a, b.a), sat: m(a.sat, b.sat), br: m(a.br, b.br)};
};
