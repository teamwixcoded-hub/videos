import React from 'react';
import {Img, random, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut} from '../easing';

export type SeqFrame = {src: string; at: number; fade?: number}; // src = file name in public/images without extension

// Plays full-scene keyframes at exact times. A new frame dissolves in over `fade` frames (eased), so
// poses melt into each other instead of snapping. `blink` swaps in an eyes-closed twin of the current
// frame at natural, irregular intervals, which keeps held poses alive.
export const FrameSeq: React.FC<{
  frames: SeqFrame[];
  fade?: number;
  blink?: {twins: Record<string, string>; seed: string; min?: number; max?: number; len?: number};
  boil?: number; // px of redraw wobble on threes (hand-drawn feel); 0 = off
}> = ({frames, fade = 9, blink, boil = 0.6}) => {
  const frame = useCurrentFrame();
  let idx = 0;
  frames.forEach((f, i) => { if (frame >= f.at) idx = i; });
  const cur = frames[idx];
  const prev = frames[Math.max(0, idx - 1)];
  const dur = cur.fade ?? fade;
  const k = idx === 0 ? 1 : easeInOut(Math.min(1, (frame - cur.at + 1) / dur));

  // blink only once the dissolve has finished and only if this frame has a twin
  let curSrc = cur.src;
  if (blink && k >= 1 && blink.twins[cur.src]) {
    const min = blink.min ?? 70, max = blink.max ?? 160, len = blink.len ?? 5;
    let t = cur.at + 30;
    for (let n = 0; t <= frame && n < 200; n++) {
      if (frame < t + len) { curSrc = blink.twins[cur.src]; break; }
      t += Math.round(min + random(`${blink.seed}-${n}`) * (max - min));
    }
  }
  // "boil": cycle through three tiny offsets every 3 frames, like lines re-drawn on each new drawing
  const step = Math.floor(frame / 3) % 3;
  const dx = [0, 1, -0.8][step] * boil, dy = [0, -0.7, 0.9][step] * boil, dr = [0, 0.05, -0.05][step] * boil;
  const style: React.CSSProperties = {position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', transform: `translate(${dx}px, ${dy}px) rotate(${dr}deg) scale(1.005)`};
  return (
    <>
      {k < 1 && <Img src={staticFile(`images/${prev.src}.png`)} style={style} />}
      <Img src={staticFile(`images/${curSrc}.png`)} style={{...style, opacity: k}} />
    </>
  );
};
