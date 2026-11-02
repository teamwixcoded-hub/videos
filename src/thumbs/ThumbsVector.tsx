import React from 'react';
import {AbsoluteFill} from 'remotion';
import {B, sFace, rFace, sP, rB, gaunt, D365, Ctx} from '../same2d/Same2D';
import {INK} from '../same2d/Char';
import {BookSpread} from '../same7/book';

// ============================================================================================
// SAME MAN thumbnail ART, all vector, rendered from the video's own scene code (no AI images, no text; titles are added on top).
// 1920x1080.   Render:  node scripts/thumbs.cjs ThumbVecA ThumbVecB ThumbVecC   ->  out/thumbs/*.png
// ============================================================================================
const ctx = (t = 4): Ctx => ({t, l: t, d: 6, p: 0.5, from: 0});
const Vig: React.FC<{c?: string}> = ({c = 'rgba(0,0,0,.6)'}) => <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 48%, ${c} 100%)`}} />;

// A: the scroller in bed, face lit blue by the phone, heavy lids
const sceneA = B(...sFace(2.0, 2.0), () => ({s: {...gaunt, lids: 0.7, glow: 1.6, raise: 1}, r: null, glowS: 1.6, dim: 0.2}));
export const ThumbVecA: React.FC = () => (
  <AbsoluteFill style={{background: '#05060b'}}>
    {sceneA(ctx())}
    <AbsoluteFill style={{background: 'rgba(60,110,200,.22)', mixBlendMode: 'soft-light'}} />
    <Vig c="rgba(0,0,0,.7)" />
  </AbsoluteFill>
);

// B: the same man twice, reader (warm, books, smile) | scroller (cold, grey, empty)
const sceneR = B(...rFace(1.5, 1.5), () => ({r: rB({smile: 0.8, lids: 0.05}), s: null, ...D365, books: 20, notes: 14, clutter: 1, glowR: 1.3}));
const sceneS = B(...sFace(1.55, 1.55), () => ({s: {...gaunt, lids: 0.65, glow: 1.4}, r: null, glowS: 1.2, sat: 0.55}));
export const ThumbVecB: React.FC = () => (
  <AbsoluteFill style={{background: '#05060b'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden'}}><div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}>{sceneR(ctx())}</div><AbsoluteFill style={{background: 'rgba(255,165,70,.16)', mixBlendMode: 'soft-light'}} /></div>
    <div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}><div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}>{sceneS(ctx())}</div><AbsoluteFill style={{background: 'rgba(70,115,185,.28)', mixBlendMode: 'soft-light'}} /></div>
    <div style={{position: 'absolute', left: 954, top: 0, width: 12, height: 1080, background: '#fff', boxShadow: '0 0 30px rgba(255,255,255,.85)'}} />
    <Vig />
  </AbsoluteFill>
);

// C: the bedside table from above, phone face down, book open in the lamp light, a hand reaching for the book
const Hand: React.FC = () => (
  <g>
    <path d="M 420,40 L 420,-60 L 700,-60 L 700,40 Z" fill="#7d6fcf" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M 420,-30 Q 330,-70 250,-60 Q 190,-50 170,-10 Q 160,30 200,50 Q 300,66 420,40 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {[[-70, 0], [-34, -14], [4, -10], [40, 10]].map(([dy, dx], i) => <g key={i}><path d={`M 214,${-10 + dy * 0.5 + 20} Q ${150 + dx},${-20 + dy * 0.7 + 20} ${112 + dx},${-6 + dy * 0.6 + 24}`} stroke={INK} strokeWidth={34} strokeLinecap="round" fill="none" /><path d={`M 214,${-10 + dy * 0.5 + 20} Q ${150 + dx},${-20 + dy * 0.7 + 20} ${112 + dx},${-6 + dy * 0.6 + 24}`} stroke="#fff" strokeWidth={20} strokeLinecap="round" fill="none" /></g>)}
  </g>
);
export const ThumbVecC: React.FC = () => (
  <AbsoluteFill style={{background: '#0b0d1a'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <defs>
        <radialGradient id="lampPool" cx="62%" cy="48%" r="55%"><stop offset="0" stopColor="#ffc97a" stopOpacity="0.9" /><stop offset="0.55" stopColor="#ff9d3f" stopOpacity="0.28" /><stop offset="1" stopColor="#ff9d3f" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="#10142b" />
      <rect x={-20} y={-20} width={1960} height={1120} fill="#5a3f2c" />
      {Array.from({length: 11}, (_, i) => <path key={i} d={`M -10,${60 + i * 80} Q 960,${48 + i * 80 + (i % 2) * 14} 1930,${62 + i * 80}`} stroke="#3e2a1c" strokeWidth={4} opacity={0.5} fill="none" />)}
      <rect x={-20} y={-20} width={1960} height={1120} fill="url(#lampPool)" />
      {/* lamp base seen from above, top right */}
      <g transform="translate(1560 230)"><ellipse cx={0} cy={0} rx={150} ry={150} fill="#ffe2a8" stroke={INK} strokeWidth={8} /><ellipse cx={0} cy={0} rx={96} ry={96} fill="#fff6d8" /><circle cx={0} cy={0} r={36} fill="#fffdf0" /></g>
      {/* phone, face down: dark back, camera lens, a little shadow */}
      <g transform="translate(330 640) rotate(-14)"><rect x={-130} y={-250} width={280} height={510} rx={44} fill="rgba(0,0,0,.45)" /><rect x={-140} y={-260} width={280} height={510} rx={44} fill="#262a3d" stroke={INK} strokeWidth={9} />
        <rect x={-120} y={-240} width={240} height={470} rx={32} fill="none" stroke="#3a4060" strokeWidth={4} />
        <rect x={-110} y={-228} width={118} height={118} rx={30} fill="#171a28" stroke={INK} strokeWidth={6} /><circle cx={-70} cy={-188} r={28} fill="#0a0b12" stroke="#4b5278" strokeWidth={5} /><circle cx={-30} cy={-150} r={20} fill="#0a0b12" stroke="#4b5278" strokeWidth={5} /><circle cx={-62} cy={-190} r={7} fill="#7fa8ff" opacity={0.8} />
        <circle cx={0} cy={60} r={42} fill="none" stroke="#3a4060" strokeWidth={6} opacity={0.6} /></g>
      {/* the open book */}
      <g transform="translate(1010 600) rotate(6) scale(0.6)"><ellipse cx={20} cy={440} rx={640} ry={40} fill="rgba(0,0,0,.4)" /><BookSpread left="1" right="2" ribbon /></g>
      {/* the hand reaching in from the right */}
      <g transform="translate(1290 660) rotate(-10) scale(1.25)"><Hand /></g>
    </svg>
    <AbsoluteFill style={{background: 'rgba(255,165,70,.1)', mixBlendMode: 'soft-light'}} />
    <Vig />
  </AbsoluteFill>
);
