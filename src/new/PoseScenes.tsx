import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import sizes from '../../public/poses/_sizes.json';

// Studio-only: each approved pose on a real background, PNG version (left) next to the SVG trace (right). One scene per frame.
const SZ = sizes as unknown as Record<string, {w: number; h: number}>;
const VB: Record<string, [number, number]> = {};   // svg viewBox sizes are read from the files at build time via these fallbacks
const SCENES: {bg: string; pose: string; k: number; y: number; dim?: number}[] = [
  {bg: 'bg2/cold-bedroom.jpg', pose: 'phoneHeld', k: 2.2, y: 980},
  {bg: 'bg2/warm-study.jpg', pose: 'sitRelaxed', k: 2.2, y: 960},
  {bg: 'bg2/bathroom.jpg', pose: 'brushTeeth', k: 2.0, y: 980},
  {bg: 'bg2/kitchen.jpg', pose: 'mother', k: 2.0, y: 980},
  {bg: 'bg2/office.jpg', pose: 'officeWork', k: 2.2, y: 980},
  {bg: 'bg2/manager.jpg', pose: 'manager', k: 2.0, y: 980},
];
export const POSE_SCENES = SCENES.length;
export const PoseScenes: React.FC = () => {
  const s = SCENES[Math.min(SCENES.length - 1, useCurrentFrame())];
  const z = SZ[s.pose];
  const img = (src: string, cx: number) => <Img src={staticFile(src)} style={{position: 'absolute', left: cx - z.w * s.k / 2, top: s.y - z.h * s.k, width: z.w * s.k, height: z.h * s.k}} />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile(s.bg)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      {img(`poses/${s.pose}.png`, 520)}
      {img(`poses-svg/${s.pose}.svg`, 1400)}
      <div style={{position: 'absolute', left: 40, top: 30, color: '#fff', font: '800 34px sans-serif', textShadow: '0 2px 6px #000'}}>LEFT: PNG pose  |  RIGHT: SVG trace   ({s.pose})</div>
    </AbsoluteFill>
  );
};
