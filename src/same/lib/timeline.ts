import timeline from '../data/timeline.json';
import captionsRaw from '../data/captions.json';

// One source of truth: timeline.json. Every item has a VIDEO time (out*) and, for narration pieces, a RECORDING time (src*).
export const FPS = 30;
export type Item = {
  scene: string; type: 'hold' | 'audio' | 'dialogue' | 'montage' | 'silence' | 'end'; outStart: number; outEnd: number;
  srcStart?: number; srcEnd?: number; label: string; visual: string; sfx: string; music: string; onScreenText: string;
  from: number; dur: number; index: number;
};
export const ITEMS: Item[] = (timeline.items as any[]).map((it, index) => ({...it, index, from: Math.round(it.outStart * FPS), dur: Math.round((it.outEnd - it.outStart) * FPS)}));
export const TOTAL_FRAMES = Math.round(timeline.totalSeconds * FPS);
export const AUDIO_FILE = 'audio/' + timeline.audioFile;
export const AUDIO_ITEMS = ITEMS.filter((i) => i.type === 'audio');

// recording time (s) -> video time (s); null when that moment was cut out of the video
export const srcToVideo = (src: number): number | null => {
  for (const a of AUDIO_ITEMS) if (src >= a.srcStart! && src <= a.srcEnd!) return a.outStart + (src - a.srcStart!);
  return null;
};
export type Caption = {text: string; from: number; to: number};   // video frames
// each caption is clipped to the narration pieces it overlaps, so none shows over montages, silences or dialogue
export const CAPTIONS: Caption[] = (captionsRaw as {from: number; to: number; text: string}[]).flatMap((c) =>
  AUDIO_ITEMS.flatMap((a) => {
    const s = Math.max(c.from, a.srcStart!), e = Math.min(c.to, a.srcEnd!);
    if (e - s < 0.2) return [];
    return [{text: c.text, from: Math.round((a.outStart + s - a.srcStart!) * FPS), to: Math.round((a.outStart + e - a.srcStart!) * FPS)}];
  }));
// the span (scene) each item belongs to
export const SCENES = Array.from(new Set(ITEMS.map((i) => i.scene)));
