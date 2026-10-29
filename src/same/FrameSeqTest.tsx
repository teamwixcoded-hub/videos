import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

// Studio-only test: the user's character frames played as a hand-drawn style sequence on a dark night background.
// Limited animation: each drawing is HELD (like the reference videos), with a tiny settle on every change and slow breathing.
const SEQ = ['f21', 'f22', 'f24', 'f25', 'f26', 'f24', 'f25', 'f22'];
const HOLD = 9;                                          // frames each drawing is held (0.3 s)
export const FrameSeqTest: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.floor(f / HOLD) % SEQ.length, since = f % HOLD;
  const pop = since < 4 ? 1 + 0.02 * Math.sin((since / 4) * Math.PI) : 1;
  const br = Math.sin(f / 22) * 0.006;
  const glow = 0.5 + 0.12 * Math.sin(f / 7);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, #1c2742 0%, #0b0f1c 65%, #05070d 100%)'}}>
      <div style={{position: 'absolute', left: 560, top: 270, width: 800, height: 600, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(120,190,255,${0.18 * glow}) 0%, rgba(120,190,255,0) 65%)`}} />
      <div style={{position: 'absolute', left: 760, top: 930, width: 400, height: 40, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.55), rgba(0,0,0,0) 70%)'}} />
      <Img src={staticFile(`char/${SEQ[i]}.png`)} style={{position: 'absolute', left: 560, top: 60, width: 800, height: 800, transformOrigin: '50% 95%', transform: `scale(${pop + br})`}} />
    </AbsoluteFill>
  );
};
