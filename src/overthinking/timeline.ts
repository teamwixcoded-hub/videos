import {WORDS_W} from './data/words';

// Overthinking timing. Every shot and every on-screen word is placed with T('a phrase of the narration') (start of the phrase, nth occurrence) or TE() (end of its last word),
// so a new recording only means a new word list. Video time = recording time.
export const FPS = 30;
export const VOICE_FILE: string | null = 'audio/overthinking.mp3';   // the voice-over (10:51)
export const END = 536.5;                         // built so far: up to "...fighting ghosts all night." (the voice-over is 651.4 s)
const WORDS = WORDS_W.map(([w, a, b]) => ({w, a, b}));
const norm = (p: string) => p.toLowerCase().split(/\s+/).map((x) => x.replace(/[^a-z0-9]/g, '')).filter(Boolean);
const find = (phrase: string, nth: number): number => {
  const q = norm(phrase); let hit = 0;
  for (let i = 0; i + q.length <= WORDS.length; i++) {
    if (q.every((w, k) => WORDS[i + k].w === w)) { if (hit === nth) return i; hit++; }
  }
  throw new Error('phrase not in the narration: "' + phrase + '" #' + nth);
};
export const T = (phrase: string, nth = 0): number => WORDS[find(phrase, nth)].a;
export const TE = (phrase: string, nth = 0): number => { const i = find(phrase, nth); return WORDS[i + norm(phrase).length - 1].b; };

// A character's own spoken line: the mouth opens and closes with each word between from and to (0 = closed). The narrator's words are not lip-synced, only what the men say.
export const speakOpen = (t: number, from: number, to: number): number => {
  for (const w of WORDS) {
    if (w.a < from - 0.02 || w.b > to + 0.05) continue;
    if (t >= w.a - 0.03 && t <= w.b + 0.04) { const k = (t - w.a + 0.03) / (w.b - w.a + 0.07); return 0.22 + 0.5 * Math.abs(Math.sin(k * Math.PI * (1 + Math.min(2, (w.b - w.a) * 2.5)))); }
  }
  return 0;
};
