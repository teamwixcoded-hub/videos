import React from 'react';
import {AbsoluteFill, Freeze, interpolate, useCurrentFrame} from 'remotion';
import type {Cue} from './Sfx';
import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// Slow motion and depth of field.
//  - Warp      : a speed profile for the PICTURE only. Inside [a, b] time runs at `speed`; right after, a short catch-up
//                (faster than normal) makes up the lost time so everything downstream lines up again. Overlays, music and
//                text keep running in real time, so only the filmed layer slows down.
//  - <SlowMo>  : applies a Warp to its children (camera + frames + props that live in the room).
//  - warpCues  : moves sound cues that belong to the picture (rustles, thuds) so they land when the action happens.
//  - <DepthBlur>: blurs everything away from a focus point, like a long lens racking onto the subject.
// All times here are script seconds (S() converts), like the rest of the project.
// ============================================================================================

export type Warp = {a: number; b: number; speed: number; ramp?: number; catchUp?: number};

const cache = new Map<string, number[]>();

// content frame for each real frame (cumulative sum of the speed profile)
const table = (w: Warp): number[] => {
  const key = JSON.stringify(w);
  const hit = cache.get(key);
  if (hit) return hit;
  const a = S(w.a), b = S(w.b), ramp = S(w.ramp ?? 0.5), c = S(w.catchUp ?? 3);
  const end = b + ramp + c + 2;
  const slow = (f: number) => {
    // 1 = fully slow, smooth ramps in and out
    const up = interpolate(f, [a - ramp, a], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const down = interpolate(f, [b, b + ramp], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const s = Math.min(up, down);
    return s * s * (3 - 2 * s);
  };
  const bump = (f: number) => {
    const t = (f - (b + ramp)) / c;
    return t > 0 && t < 1 ? Math.sin(Math.PI * t) ** 2 : 0;
  };
  let lost = 0, I = 0;
  for (let f = 0; f < end; f++) { lost += (1 - w.speed) * slow(f); I += bump(f); }
  const k = I > 0 ? lost / I : 0;
  const out = [0];
  for (let f = 0; f < end; f++) out.push(out[f] + 1 - (1 - w.speed) * slow(f) + k * bump(f));
  cache.set(key, out);
  return out;
};

// real frame -> content frame (fractional)
export const warpFrame = (w: Warp, f: number): number => {
  const t = table(w);
  if (f <= 0) return f;
  if (f >= t.length - 1) return f; // after the catch-up the two timelines agree again
  const i = Math.floor(f);
  return t[i] + (t[i + 1] - t[i]) * (f - i);
};

// content frame -> real frame
export const unwarpFrame = (w: Warp, c: number): number => {
  const t = table(w);
  if (c <= 0 || c >= t[t.length - 1]) return c;
  let lo = 0, hi = t.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (t[m] <= c) lo = m; else hi = m; }
  return lo + (c - t[lo]) / Math.max(1e-6, t[hi] - t[lo]);
};

export const SlowMo: React.FC<{warp: Warp; children: React.ReactNode}> = ({warp, children}) => {
  const frame = useCurrentFrame();
  return <Freeze frame={warpFrame(warp, frame)}>{children}</Freeze>;
};

// Cue times are script seconds of CONTENT; return them in real script seconds, and add a slow heartbeat under the slow-mo.
export const warpCues = (cues: Cue[], warp: Warp, heartbeat = true): Cue[] => {
  const mapped = cues.map((c) => {
    if (c.real) return c;
    const real = unwarpFrame(warp, S(c.at));
    return {...c, at: real / (30 * TIME_SCALE)};
  });
  if (!heartbeat) return mapped;
  return [
    ...mapped,
    {file: 'heartbeat', at: warp.a - 0.1, vol: 0.28, rate: 0.85, dur: 2.0, fadeOut: 0.4},
    {file: 'heartbeat', at: warp.a + 1.6, vol: 0.26, rate: 0.8, dur: 2.0, fadeOut: 0.5},
  ];
};

// Blur everything outside a clear centre; `amount` is the peak blur in px, animated over [from, to] script seconds.
export const DepthBlur: React.FC<{from: number; to: number; amount?: number; x?: number; y?: number; clear?: number}> = ({from, to, amount = 7, x = 50, y = 52, clear = 24}) => {
  const frame = useCurrentFrame();
  const a = S(from), b = S(to), r = S(0.8);
  const k = interpolate(frame, [a, a + r, b - r, b], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (k <= 0) return null;
  const mask = `radial-gradient(ellipse 62% 70% at ${x}% ${y}%, transparent ${clear}%, #000 78%)`;
  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${amount * k}px)`,
        WebkitBackdropFilter: `blur(${amount * k}px)`,
        maskImage: mask,
        WebkitMaskImage: mask,
        pointerEvents: 'none',
      }}
    />
  );
};
