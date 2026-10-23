import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';

// Darkens the corners. `strength` 0..1.
export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.55, color = '0,0,0'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(${color},0) 45%, rgba(${color},${strength}) 100%)`, pointerEvents: 'none'}} />
);

// Animated film grain: a turbulence filter whose seed changes every 2 frames.
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Floating specks of dust (e.g. in lamp light). Deterministic per `seed`.
export const Dust: React.FC<{count?: number; color?: string; area?: {x: number; y: number; w: number; h: number}; seed?: string}> = ({
  count = 40,
  color = 'rgba(255,230,170,0.8)',
  area = {x: 0, y: 0, w: 1920, h: 1080},
  seed = 'dust',
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const size = 3 + r('s') * 6;
        const speed = 0.25 + r('v') * 0.6;
        const x = area.x + ((r('x') * area.w + Math.sin(frame / (40 + r('p') * 40) + i) * 30) % area.w);
        const y = area.y + ((r('y') * area.h - frame * speed + area.h * 10) % area.h);
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame / (20 + r('t') * 30) + i));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: color, opacity: twinkle * 0.7, filter: 'blur(0.6px)'}} />;
      })}
    </AbsoluteFill>
  );
};

// Soft puffs rising from a point (tea steam, breath, smoke).
export const Steam: React.FC<{x: number; y: number; count?: number; color?: string; seed?: string}> = ({x, y, count = 6, color = 'rgba(255,255,255,0.55)', seed = 'steam'}) => {
  const frame = useCurrentFrame();
  const LIFE = 70;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const t = ((frame + (i * LIFE) / count) % LIFE) / LIFE;
        const sway = Math.sin(t * 6 + i * 2) * 18;
        const size = 24 + t * 50;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + sway + (random(`${seed}-${i}`) - 0.5) * 24 - size / 2,
              top: y - t * 150 - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              filter: 'blur(9px)',
              opacity: Math.sin(t * Math.PI) * 0.7,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Flat colour wash that fades in/out. Use for hit-flashes and cold pulses.
export const Flash: React.FC<{at: number; duration?: number; color?: string; peak?: number}> = ({at, duration = 10, color = '#fff', peak = 0.9}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 2, at + duration], [0, peak, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};

// Horizontal-ish speed lines radiating from the centre; fade in/out around `at`.
export const SpeedLines: React.FC<{at: number; duration?: number; color?: string}> = ({at, duration = 14, color = '#fff'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const o = interpolate(frame, [at, at + 3, at + duration], [0, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const lines = Array.from({length: 36}).map((_, i) => {
    const a = (i / 36) * Math.PI * 2 + random(`sl-${i}`) * 0.15;
    const r0 = 380 + random(`sr-${i}`) * 260;
    const r1 = 1300;
    return <line key={i} x1={width / 2 + Math.cos(a) * r0} y1={height / 2 + Math.sin(a) * r0} x2={width / 2 + Math.cos(a) * r1} y2={height / 2 + Math.sin(a) * r1} stroke={color} strokeWidth={2 + random(`sw-${i}`) * 5} strokeLinecap="round" />;
  });
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <svg width={width} height={height}>{lines}</svg>
    </AbsoluteFill>
  );
};
