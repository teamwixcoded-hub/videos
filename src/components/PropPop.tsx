import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT} from '../fonts';
import {S} from '../easing';
import {useKeepInFrame} from '../vfx/Motion';
import {Snd} from './Type';

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A prop (images/props/<name>.png or images/fx/<name>.png) that pops in, bobs gently, then shrinks away.
// Times are script seconds. Place inside <Camera> to anchor it to the room, or outside for screen space.
export type PropSrc = `props/${string}` | `fx/${string}`;

export const PropPop: React.FC<{
  src: PropSrc;
  x: number;
  y: number;
  w?: number;
  from: number;
  to: number;
  rotate?: number;
  label?: string; // short text drawn on the prop (e.g. in a speech bubble)
  labelColor?: string;
  float?: boolean; // drift upward while visible
}> = ({src, x, y, w = 160, from, to, rotate = 0, label, labelColor = '#2a1713', float}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = S(from), b = S(to);
  const rise0 = float ? 110 : 0; // floating props drift upward: leave room above
  // image height / width of each prop, so the clamp knows how tall it really is
  const ratio = src.includes('book-tower') ? 2.6 : src.includes('phone') ? 2.3 : src.includes('calendar') ? 1.5 : src.includes('bubble') ? 0.75 : src.includes('pillow') || src.includes('hoodie') || src.includes('alarm') || src.includes('lamp') ? 1.1 : label ? 0.72 : 1.05;
  const ph = w * ratio + rise0;
  const [kx, ky] = useKeepInFrame(x, y, w, ph, 28, 0.5 + rise0 / (2 * ph));
  if (frame < a || frame > b + 14) return null;
  const pop = spring({frame: frame - a, fps, config: {damping: 9, stiffness: 160, mass: 0.7}});
  const out = interpolate(frame, [b, b + 14], [1, 0], clampOpts);
  const bob = Math.sin((frame - a) / 9) * 6;
  const rise = float ? -(frame - a) * 0.8 : 0;
  return (
    <div style={{position: 'absolute', left: kx, top: ky + bob + rise, width: w, transform: `translate(-50%, -50%) scale(${pop * out}) rotate(${rotate}deg)`, filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.35))', pointerEvents: 'none'}}>
      <Snd file={src.startsWith('fx/') ? 'pop_c' : 'pop_a'} at={a} vol={0.16} rate={src.includes('zzz') ? 0.8 : 1} frames={12} />
      <Img src={staticFile(`images/${src}.png`)} style={{width: '100%', height: 'auto', display: 'block'}} />
      {label && (
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8% 14%', paddingBottom: '18%', fontFamily: BODY_FONT, fontWeight: 800, fontSize: w * 0.15, lineHeight: 1.05, color: labelColor}}>{label}</div>
      )}
    </div>
  );
};
