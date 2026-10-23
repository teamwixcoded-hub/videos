import React from 'react';
import {AbsoluteFill} from 'remotion';

// Lighting for the flat (unlit) keyframes. The art is plain daylight colours; the mood is applied here,
// so it can be re-timed, re-coloured and animated without regenerating a single image.

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',');

// Warm evening lamp: a bright pool around the lamp falling off to a cosy room.
// `warm` 1 = lamp on, 0 = lamp off (the same room in night colours), so switching the lamp off is just an animation.
export const GradeWarm: React.FC<{lampX?: number; lampY?: number; warm?: number; children: React.ReactNode}> = ({lampX = 440, lampY = 470, warm = 1, children}) => (
  <AbsoluteFill style={{filter: `saturate(${0.84 + 0.2 * warm})`}}>
    {children}
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 1100px 820px at ${lampX}px ${lampY}px, rgb(${mix([150, 158, 204], [255, 246, 226], warm)}) 0%, rgb(${mix([118, 130, 186], [240, 214, 176], warm)}) 45%, rgb(${mix([84, 96, 152], [176, 146, 124], warm)}) 100%)`,
        mixBlendMode: 'multiply',
      }}
    />
  </AbsoluteFill>
);

// Night: desaturated, dark, blue. The right side stays a touch brighter where the window and phone are.
export const GradeNight: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{filter: 'saturate(0.82)'}}>
    {children}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 1500px 1000px at 76% 52%, rgb(226,224,240) 0%, rgb(146,156,208) 55%, rgb(84,96,152) 100%)', mixBlendMode: 'multiply'}} />
  </AbsoluteFill>
);

// Morning daylight: bright, neutral, a touch cool. For the daytime rooms (kitchen, bathroom, bedroom by day).
export const GradeDay: React.FC<{children: React.ReactNode; dim?: number}> = ({children, dim = 0}) => (
  <AbsoluteFill style={{filter: 'saturate(1.04)'}}>
    {children}
    <AbsoluteFill style={{background: `rgb(${255 - dim * 90},${252 - dim * 85},${246 - dim * 60})`, mixBlendMode: 'multiply'}} />
  </AbsoluteFill>
);
