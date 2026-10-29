import captionsRaw from './data/captions.json';

// Two Fathers is exactly as long as the recording: video time = recording time (no wordless stretches, no added pauses). The recording is 3:36.5;
// three more seconds after the last word hold the end question.
export const FPS = 30;
export const AUDIO_FILE = 'audio/two-fathers.mp3';
export const VOICE_END = 216.53;
export const TOTAL = 219.5;
export const PIECES = [{at: 0, a: 0, b: VOICE_END, dur: VOICE_END}];
export const S = (src: number): number => src;
export const CAPS = (captionsRaw as {from: number; to: number; text: string}[]).map((c) => ({text: c.text, from: c.from, to: c.to}));
// the narration ducks sound effects and music a little, smoothly
export const speechDuck = (t: number) => {
  let amt = 0;
  for (const c of CAPS) { const a = c.from - 0.05, b = c.to + 0.1; if (t < a - 0.15 || t > b + 0.15) continue; amt = Math.max(amt, Math.min(1, (t - (a - 0.15)) / 0.15, (b + 0.15 - t) / 0.15)); }
  return 1 - 0.35 * amt;
};
