export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
// ONE speed knob for the whole timeline. 1 = the script's real narration pace, lower = faster.
// Everything in Sample4 is written in script seconds and goes through S(), so changing this re-times it all.
export const TIME_SCALE = 0.6;
// script seconds -> frames at 30 fps (scaled by TIME_SCALE)
export const S = (sec: number) => Math.round(sec * 30 * TIME_SCALE);
// real seconds -> frames, NOT scaled: for the length of a sound file or a fixed-length effect
export const R = (sec: number) => Math.round(sec * 30);
