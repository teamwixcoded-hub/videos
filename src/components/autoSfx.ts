import type {Cue} from './Sfx';
import type {SeqFrame} from './FrameSeq';
import type {CamKey} from '../vfx/Motion';
import {TIME_SCALE} from '../easing';

// Sounds derived from the timeline itself, so they always line up with what is on screen:
//  - a very quiet fabric/prop sound at every pose change (frame switch)
//  - a soft whoosh whenever the camera travels a long way (e.g. from one character to the other)
// Inputs are frames (already scaled by S()); cues are in script seconds, like every other cue.
const toSec = (frame: number) => frame / (30 * TIME_SCALE);

export const frameCues = (frames: SeqFrame[], seed = 0): Cue[] => {
  const out: Cue[] = [];
  let last = -9;
  frames.forEach((f, i) => {
    if (i === 0) return;
    const at = toSec(f.at);
    if (at - last < 0.7) return; // never machine-gun
    last = at;
    out.push({file: (i + seed) % 2 ? 'cloth_a' : 'cloth_b', at: Math.max(0, at - 0.05), vol: 0.07, rate: 0.95 + ((i * 7 + seed) % 5) * 0.03, dur: 0.7, fadeOut: 0.15});
  });
  return out;
};

export const camCues = (keys: CamKey[], existing: Cue[] = []): Cue[] => {
  const out: Cue[] = [];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    const dx = Math.abs((b.x ?? 0) - (a.x ?? 0));
    const dz = Math.abs((b.zoom ?? 1) - (a.zoom ?? 1));
    if (dx < 420 && dz < 0.6) continue;
    const at = toSec(a.at) + 0.1;
    if (existing.some((c) => c.file === 'whoosh' && Math.abs(c.at - at) < 1.0)) continue; // already has one
    out.push({file: 'whoosh', at, vol: dx > 900 ? 0.15 : 0.1, rate: dx > 900 ? 0.9 : 1.05, dur: 1.0, fadeOut: 0.3});
  }
  return out;
};
