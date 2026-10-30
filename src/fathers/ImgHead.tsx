import React from 'react';
import {staticFile} from 'remotion';
import {Head, Face, Look} from '../same2d/Char';
import META from './data/headmeta.json';

// Illustrated heads: generated art (public/images/ft/<set>/<frame>.png, cut from expression sheets) driven by the rig. The face props pick the frame.
// Each frame is a 3/4 view facing +x; headmeta.json says where the head sits on its canvas so every frame lands on the rig's head centre at the same size.
type Meta = {cx: number; cy: number; w: number; chin: number; cw: number; ch: number};
const M = META as unknown as Record<string, Meta>;
const pick = (look: string, age: number): {dir: string; pre: string; ext: boolean} | null => {
  if (look === 'adam') return age >= 58 ? {dir: 'adam', pre: '', ext: true} : age >= 45 ? {dir: 'adam2', pre: 'm_', ext: false} : age >= 20 ? {dir: 'adam2', pre: 'y_', ext: false} : null;
  if (look === 'sam') return age >= 55 ? {dir: 'sam', pre: 'o_', ext: false} : age >= 20 ? {dir: 'sam', pre: 'y_', ext: false} : null;
  if (look === 'leo') return age < 12 ? {dir: 'kids', pre: 'l_', ext: false} : age < 22 ? {dir: 'leo', pre: 't_', ext: false} : {dir: 'leo', pre: 'a_', ext: false};
  if (look === 'max') return age < 12 ? {dir: 'kids', pre: 'x_', ext: false} : age < 22 ? {dir: 'max', pre: 't_', ext: false} : {dir: 'max', pre: 'a_', ext: false};
  return null;
};
const BASIC = new Set(['neutral', 'smile', 'laugh', 'sad', 'worried', 'ah', 'closed']);
const FALL: Record<string, string> = {surprised: 'worried', tired: 'sad', proud: 'smile', oh: 'ah', regret: 'sad'};

const frameOf = (face: Face, t: number, seed: number): string => {
  const P = 3.5 + 0.9 * Math.sin(seed * 7.3), ph = (t + seed * 2.1) % P, blink = ph < 0.13;
  const {lids = 0.05, smile = 0, open = 0, brow = 0, browTilt = 0, wide = 0} = face;
  if (blink && open < 0.2) return 'closed';
  if (open > 0.1) { const m = Math.sin(t * 11 + seed * 3); return smile > 0.7 && open > 0.4 ? 'laugh' : m > 0.35 ? 'ah' : m > -0.3 ? 'oh' : 'neutral'; }
  if (wide > 0.45) return 'surprised';
  if (lids > 0.3) return smile < 0.2 ? 'tired' : 'closed';
  if (smile > 0.7) return 'proud';
  if (smile > 0.3) return 'smile';
  if (browTilt > 8 || brow > 0.3) return 'worried';
  if (smile < 0.1 && (brow < -0.05 || browTilt > 3)) return 'sad';
  return 'neutral';
};

export const HeadFor: React.FC<{face: Face; turn: number; t: number; seed: number; idle: number; look?: Look; grey?: number; age?: number}> = ({age = 40, ...p}) => {
  const set = pick(p.look ?? '', age), m = set ? M[`${set.dir}/${set.pre}`] : undefined;
  if (!set || !m) return <Head face={p.face} turn={p.turn} t={p.t} seed={p.seed} idle={p.idle} look={p.look} grey={p.grey} />;
  let f = frameOf(p.face, p.t, p.seed); if (!set.ext && !BASIC.has(f)) f = FALL[f] ?? 'neutral';
  const S = 300 / m.w, id = `ih${set.dir}${set.pre}`;
  // the picture's head centre lands on the rig's head centre; below the chin (+ a little neck) the rig's own neck and collar take over
  const bottom = (m.chin - m.cy + 0.09 * m.w) * S;
  return (
    <g>
      <defs><clipPath id={id}><rect x={-400} y={-400} width={800} height={400 + bottom} /></clipPath></defs>
      <g clipPath={`url(#${id})`}><g transform={`scale(${S}) translate(${-m.cx} ${-m.cy})`}><image href={staticFile(`images/ft/${set.dir}/${set.pre}${f}.png`)} x={0} y={0} width={m.cw} height={m.ch} /></g></g>
    </g>
  );
};
