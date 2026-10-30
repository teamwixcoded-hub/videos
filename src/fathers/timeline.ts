import {WORDS2} from './data/words2';

// Two Fathers, version 2: the video is exactly as long as the new recording (6:56.4); video time = recording time. Every word has a timestamp (words2.json, from
// ElevenLabs), so shots and on-screen words are placed with T('phrase'): the start time of that phrase in the narration. Three seconds after the last word hold the closing question.
export const FPS = 30;
export const AUDIO_FILE = 'audio/two-fathers-2.mp3';
export const VOICE_END = 416.37;
export const TOTAL = 419.4;
export const PIECES = [{at: 0, a: 0, b: VOICE_END, dur: VOICE_END}];
export const WORDS: {w: string; a: number; b: number}[] = WORDS2.map(([w, a, b]) => ({w, a, b}));
const norm = (p: string) => p.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
const find = (phrase: string, nth: number): number => {
  const q = norm(phrase); let hit = 0;
  for (let i = 0; i + q.length <= WORDS.length; i++) {
    if (q.every((w, k) => WORDS[i + k].w === w)) { if (hit === nth) return i; hit++; }
  }
  throw new Error('phrase not in the narration: "' + phrase + '" #' + nth);
};
// start time of the phrase (nth occurrence), and the time its last word ends
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
// is someone talking right now? (mouths move only while the narrator speaks a line that character says)
export const speaking = (t: number, from: number, to: number) => t >= from && t <= to && WORDS.some((w) => t >= w.a - 0.02 && t <= w.b + 0.05);
export const S = (src: number): number => src;
