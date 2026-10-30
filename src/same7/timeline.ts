import {WORDS7} from './data/words';

// SAME MAN v2: the video is built around the new recording (Same Man 7 Minutes, 6:42.3). Video time = recording time. Every word has a timestamp, so shots and on-screen words are placed
// with T('phrase') (start of the phrase, nth occurrence) and TE('phrase') (end of its last word), never with hand-typed seconds.
export const FPS = 30;
export const AUDIO_FILE = 'audio/same-man-7.mp3';
export const VOICE_END = 402.29;
export const FULL_TOTAL = 405.3;
export const WORDS: {w: string; a: number; b: number}[] = WORDS7.map(([w, a, b]) => ({w, a, b}));
const norm = (p: string) => p.toLowerCase().split(/\s+/).map((x) => x.replace(/[^a-z0-9']/g, '')).filter(Boolean);
const find = (phrase: string, nth: number): number => {
  const q = norm(phrase); let hit = 0;
  for (let i = 0; i + q.length <= WORDS.length; i++) {
    if (q.every((w, k) => WORDS[i + k].w === w)) { if (hit === nth) return i; hit++; }
  }
  throw new Error('phrase not in the narration: "' + phrase + '" #' + nth);
};
export const T = (phrase: string, nth = 0): number => WORDS[find(phrase, nth)].a;
export const TE = (phrase: string, nth = 0): number => { const i = find(phrase, nth); return WORDS[i + norm(phrase).length - 1].b; };
// the speech, in runs separated by pauses (used to duck sound effects and music under the voice)
export const CAPS: {from: number; to: number}[] = (() => {
  const out: {from: number; to: number}[] = [];
  for (const w of WORDS) { const l = out[out.length - 1]; if (l && w.a - l.to < 0.35) l.to = w.b; else out.push({from: w.a, to: w.b}); }
  return out;
})();
export const speechDuck = (t: number) => {
  let amt = 0;
  for (const c of CAPS) { const a = c.from - 0.05, b = c.to + 0.1; if (t < a - 0.15 || t > b + 0.15) continue; amt = Math.max(amt, Math.min(1, (t - (a - 0.15)) / 0.15, (b + 0.15 - t) / 0.15)); }
  return 1 - 0.55 * amt;
};
