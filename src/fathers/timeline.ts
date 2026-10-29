import captionsRaw from './data/captions.json';

// Two Fathers: the 3:36 recording is placed unchanged in pieces; everything between the pieces is wordless (music, effects, text).
// P = [video start (s), recording start (s), recording end (s)], straight from the plan's voiceover timeline.
export const FPS = 30;
export const AUDIO_FILE = 'audio/two-fathers.mp3';
export const TOTAL = 490;     // 8:10
export const P: [number, number, number][] = [
  [8, 0.12, 6.02], [14, 7.06, 13.74], [21, 14.70, 18.40], [39, 19.82, 29.96], [59, 31.26, 45.98], [80, 47.22, 57.78], [95, 58.96, 68.74], [109, 69.74, 80.32],
  [154, 81.50, 99.78], [177, 100.76, 107.14], [192, 108.18, 121.44], [215, 122.48, 133.00], [265, 134.04, 142.62], [282, 143.74, 148.64], [291, 149.82, 164.96],
  [322, 166.14, 181.40], [362, 182.76, 191.90], [426, 193.02, 203.98], [440, 205.10, 207.36], [458, 208.62, 216.36],
];
export const PIECES = P.map(([at, a, b]) => ({at, a, b, dur: b - a}));
// recording time (s) -> video time (s)
export const S = (src: number): number => { for (const [at, a, b] of P) if (src >= a - 0.001 && src <= b + 0.001) return at + (src - a); throw new Error('recording time not placed: ' + src); };
export const CAPS = (captionsRaw as {from: number; to: number; text: string}[]).map((c) => ({text: c.text, from: S(c.from), to: S(c.to)}));
export const speaking = (t: number) => CAPS.some((c) => t >= c.from - 0.05 && t <= c.to + 0.1);
// the narration ducks sound effects and music a little, smoothly
export const speechDuck = (t: number) => {
  let amt = 0;
  for (const c of CAPS) { const a = c.from - 0.05, b = c.to + 0.1; if (t < a - 0.15 || t > b + 0.15) continue; amt = Math.max(amt, Math.min(1, (t - (a - 0.15)) / 0.15, (b + 0.15 - t) / 0.15)); }
  return 1 - 0.35 * amt;
};
