import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp01, easeOut, rnd, ramp} from './lib/anim';

// ============================================================================================
// VFX: the cinematic layer. Everything is a full-frame SVG overlay (1920 x 1080) that sits above the scene:
// volumetric light, floating dust, bokeh, film grain, colour grade, letterbox, lens streaks, shockwaves, impact flashes.
// All motion is a pure function of time, so a frame always renders the same.
// ============================================================================================
const Layer: React.FC<{children: React.ReactNode; blend?: string; opacity?: number}> = ({children, blend, opacity = 1}) => (
  <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: (blend as any) ?? 'normal', opacity}}>{children}</svg>
);

// slow handheld sway + impact shake, returned as a CSS transform for the camera wrapper
export const camShake = (t: number, hits: {at: number; amp: number; dur?: number}[] = [], sway = 1): string => {
  let dx = (Math.sin(t * 0.7) * 3.2 + Math.sin(t * 1.9 + 1) * 1.4) * sway, dy = (Math.cos(t * 0.55) * 2.4 + Math.sin(t * 2.3) * 1.0) * sway, rot = Math.sin(t * 0.43) * 0.12 * sway;
  for (const h of hits) { const u = (t - h.at) / (h.dur ?? 0.5); if (u > 0 && u < 1) { const k = (1 - u) * (1 - u) * h.amp; dx += Math.sin(t * 90) * k; dy += Math.cos(t * 77) * k; rot += Math.sin(t * 60) * k * 0.01; } }
  return `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`;
};

// god rays from a window / lamp: soft beams that slowly breathe and sweep
export const GodRays: React.FC<{t: number; x?: number; y?: number; color?: string; strength?: number; angle?: number}> = ({t, x = 1450, y = -60, color = '#cfe0ff', strength = 1, angle = 18}) => (
  <Layer blend="screen">
    <defs>
      <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.55" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient>
      <filter id="rayblur"><feGaussianBlur stdDeviation="14" /></filter>
    </defs>
    <g filter="url(#rayblur)" transform={`rotate(${angle + Math.sin(t * 0.35) * 2.2} ${x} ${y})`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const w = 70 + i * 34, off = (i - 2) * 150 + Math.sin(t * 0.5 + i) * 18, a = (0.1 + 0.07 * Math.sin(t * 0.8 + i * 1.7)) * strength;
        return <polygon key={i} points={`${x + off - w * 0.15},${y} ${x + off + w * 0.15},${y} ${x + off + w * 1.4},1300 ${x + off - w * 1.4},1300`} fill="url(#ray)" opacity={a} />;
      })}
    </g>
  </Layer>
);

export const Dust: React.FC<{t: number; count?: number; color?: string; seed?: number; speed?: number}> = ({t, count = 70, color = '#fff3d6', seed = 0, speed = 1}) => (
  <Layer blend="screen">
    <defs><filter id="dustblur"><feGaussianBlur stdDeviation="0.8" /></filter></defs>
    <g filter="url(#dustblur)">
      {Array.from({length: count}).map((_, i) => {
        const r1 = rnd(i + seed * 100), r2 = rnd(i * 3.1 + seed * 100), r3 = rnd(i * 7.7 + seed * 100), r4 = rnd(i * 1.3 + 5);
        const x = ((r1 * 1920 + t * (6 + r3 * 14) * speed + Math.sin(t * 0.6 + i) * 22) % 1960 + 1960) % 1960 - 20;
        const y = (((r2 * 1080 - t * (4 + r4 * 12) * speed) % 1100) + 1100) % 1100 - 10;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + r3) + i * 2.3));
        return <circle key={i} cx={x} cy={y} r={1.2 + r4 * 3.6} fill={color} opacity={(0.1 + r3 * 0.5) * tw} />;
      })}
    </g>
  </Layer>
);

export const Bokeh: React.FC<{t: number; color?: string; count?: number; seed?: number}> = ({t, color = '#9ec8ff', count = 9, seed = 0}) => (
  <Layer blend="screen">
    <defs><filter id="bokehblur"><feGaussianBlur stdDeviation="9" /></filter></defs>
    <g filter="url(#bokehblur)">
      {Array.from({length: count}).map((_, i) => {
        const r1 = rnd(i * 2.3 + seed), r2 = rnd(i * 5.9 + seed), r3 = rnd(i * 9.1 + seed);
        const x = (((r1 * 2100 + t * (4 + r3 * 9)) % 2100) + 2100) % 2100 - 90, y = r2 * 1080 + Math.sin(t * 0.4 + i) * 26;
        return <circle key={i} cx={x} cy={y} r={34 + r3 * 90} fill={color} opacity={0.05 + r2 * 0.09} />;
      })}
    </g>
  </Layer>
);

export const Grain: React.FC<{amount?: number}> = ({amount = 0.1}) => {
  const f = useCurrentFrame();
  return (
    <Layer blend="overlay" opacity={amount * 6}>
      <filter id="grn" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 11} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0.9 0.9 0.9 0 -0.45" />
      </filter>
      <rect width="1920" height="1080" filter="url(#grn)" />
    </Layer>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.6}) => (
  <Layer>
    <defs><radialGradient id="vg" cx="50%" cy="48%" r="72%"><stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity={strength} /></radialGradient></defs>
    <rect width="1920" height="1080" fill="url(#vg)" />
  </Layer>
);

// teal shadows / warm highlights, split per side: left warm, right cold
export const Grade: React.FC<{split?: number}> = ({split = 960}) => (
  <>
    <Layer blend="soft-light"><rect width={split} height="1080" fill="#ffae5a" opacity={0.35} /><rect x={split} width={1920 - split} height="1080" fill="#3f86ff" opacity={0.32} /></Layer>
    <Layer blend="multiply"><defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2a4a" stopOpacity="0.0" /><stop offset="1" stopColor="#101a33" stopOpacity="0.45" /></linearGradient></defs><rect width="1920" height="1080" fill="url(#gr)" /></Layer>
  </>
);

export const Letterbox: React.FC<{t: number; bar?: number}> = ({t, bar = 64}) => {
  const h = bar * easeOut(t / 1.2);
  return <Layer><rect width="1920" height={h} fill="#000" /><rect y={1080 - h} width="1920" height={h} fill="#000" /></Layer>;
};

// anamorphic lens streak + flare: a thin horizontal blue/white line with a hot core
export const LensStreak: React.FC<{t: number; at: number; x?: number; y?: number; dur?: number; color?: string; power?: number}> = ({t, at, x = 960, y = 540, dur = 1.1, color = '#8cc4ff', power = 1}) => {
  const u = (t - at) / dur; if (u < 0 || u > 1) return null;
  const a = (1 - u) * (1 - u) * power, w = 500 + 1400 * easeOut(u);
  return (
    <Layer blend="screen">
      <defs><radialGradient id="ls"><stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset="0.25" stopColor={color} stopOpacity="0.7" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={x} cy={y} rx={w} ry={8 + 10 * (1 - u)} fill="url(#ls)" opacity={a} />
      <circle cx={x} cy={y} r={60 + 120 * (1 - u)} fill="url(#ls)" opacity={a * 0.8} />
    </Layer>
  );
};

export const Shockwave: React.FC<{t: number; at: number; x?: number; y?: number; dur?: number; color?: string}> = ({t, at, x = 960, y = 540, dur = 0.9, color = '#ffffff'}) => {
  const u = (t - at) / dur; if (u < 0 || u > 1) return null;
  return (
    <Layer blend="screen">
      <circle cx={x} cy={y} r={40 + 1100 * easeOut(u)} fill="none" stroke={color} strokeWidth={26 * (1 - u) + 2} opacity={(1 - u) * 0.8} />
      <circle cx={x} cy={y} r={20 + 760 * easeOut(u)} fill="none" stroke={color} strokeWidth={8 * (1 - u)} opacity={(1 - u) * 0.5} />
    </Layer>
  );
};

export const Flash: React.FC<{t: number; at: number; dur?: number; color?: string; power?: number}> = ({t, at, dur = 0.4, color = '#fff', power = 0.7}) => {
  const u = (t - at) / dur; if (u < 0 || u > 1) return null;
  return <Layer blend="screen"><rect width="1920" height="1080" fill={color} opacity={(1 - u) * (1 - u) * power} /></Layer>;
};

export const Sparks: React.FC<{t: number; at: number; x: number; y: number; n?: number; color?: string; dur?: number; reach?: number}> = ({t, at, x, y, n = 26, color = '#ffd36b', dur = 0.9, reach = 520}) => {
  const u = (t - at) / dur; if (u < 0 || u > 1) return null;
  return (
    <Layer blend="screen">
      {Array.from({length: n}).map((_, i) => {
        const a = rnd(i * 1.7) * Math.PI * 2, d = (0.3 + rnd(i * 4.1) * 0.7) * reach * easeOut(u), l = 12 + rnd(i * 2.2) * 36 * (1 - u);
        return <line key={i} x1={x + Math.cos(a) * d} y1={y + Math.sin(a) * d} x2={x + Math.cos(a) * (d + l)} y2={y + Math.sin(a) * (d + l)} stroke={color} strokeWidth={4 * (1 - u) + 1} strokeLinecap="round" opacity={1 - u} />;
      })}
    </Layer>
  );
};

// a bloom: soft additive glow around a light source (phone screen, lamp)
export const Bloom: React.FC<{x: number; y: number; r?: number; color?: string; power?: number}> = ({x, y, r = 360, color = '#7fc4ff', power = 1}) => (
  <Layer blend="screen">
    <defs><radialGradient id={`bl${Math.round(x)}`}><stop offset="0" stopColor={color} stopOpacity="0.85" /><stop offset="0.45" stopColor={color} stopOpacity="0.25" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#bl${Math.round(x)})`} opacity={clamp01(power)} />
  </Layer>
);
export {ramp};
