import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import sizes from '../../public/poses/_sizes.json';
import {S} from '../easing';

// Option 1: hold each approved pose (public/poses/*.png) and bring it to life with code:
// breathing, a slow sway, a small settle ("pop") when the pose changes, and a short cross-fade between poses.
// The images keep their sheet-relative position, so poses cut from the same sheet line up (feet / bed / chair stay put).
type Sz = {w: number; h: number; left: number; bottom: number; sw: number; bedTop: number; bedLeft: number};
const SZ = sizes as unknown as Record<string, Sz>;
const baseOf: Record<string, number> = {};
Object.values(SZ).forEach((z) => { const key = z.sw + ':' + Math.round(z.bottom / 60); (baseOf as any)[key] = Math.max((baseOf as any)[key] || 0, z.bottom); });
const place = (n: string) => {
  const z = SZ[n], col = Math.min(3, Math.floor((z.left + z.w / 2) / (z.sw / 4)));
  return {z, ox: z.left + z.w / 2 - (col + 0.5) * (z.sw / 4), oy: z.bottom - (baseOf as any)[z.sw + ':' + Math.round(z.bottom / 60)]};
};

export type PoseKey = {t: number; pose: string};
export const PoseActor: React.FC<{seq: PoseKey[]; x: number; y: number; k?: number; flip?: boolean; seed?: number; fade?: number; opacity?: number}> = ({seq, x, y, k = 1.9, flip = false, seed = 0, fade = 4, opacity = 1}) => {
  const f = useCurrentFrame();
  let i = 0;
  seq.forEach((s, j) => { if (f >= S(s.t)) i = j; });
  const cur = seq[i], prev = i > 0 ? seq[i - 1] : null, since = f - S(cur.t);
  const mix = prev ? Math.min(1, since / fade) : 1;
  const pop = since >= 0 && since < 14 ? 1 + 0.025 * Math.sin((since / 14) * Math.PI) * (1 - since / 14) : 1;
  const breathe = Math.sin((f + seed * 17) / 26), sway = Math.sin((f + seed * 31) / 61);
  const layer = (n: string, o: number) => {
    const {z, ox, oy} = place(n);
    // poses with a bed are pinned by the mattress (top edge and left edge) so the bed never jumps between poses
    const bed = z.bedTop >= 0;
    return <Img key={n} src={staticFile(`poses/${n}.png`)} style={{position: 'absolute', left: bed ? -z.bedLeft * k : ox * k - z.w * k / 2, top: bed ? -z.bedTop * k : oy * k - z.h * k, width: z.w * k, height: z.h * k, opacity: o}} />;
  };
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, opacity, transform: `scaleX(${flip ? -1 : 1})`, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translateY(${(breathe * 1.4).toFixed(2)}px) rotate(${(sway * 0.35).toFixed(3)}deg) scale(${(pop * (1 + breathe * 0.004)).toFixed(4)}, ${(pop * (1 + breathe * 0.008)).toFixed(4)})`}}>
        {prev && mix < 1 && layer(prev.pose, 1 - mix)}
        {layer(cur.pose, prev ? Math.max(mix, 0.001) : 1)}
      </div>
    </div>
  );
};
