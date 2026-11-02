import React from 'react';
import {BubbleHead} from './Bubble';

// ============================================================================================
// WINTER ARC cast (new character, from the happy/sad reference): one round head with a hair cap, big white eyes with a detailed iris,
// thick brows, a wide grin or a flat tired mouth. The BODY is a parameter: fat 0..1 (soft belly, rounder hips), muscle 0..1 (broad shoulders, thick arms).
// <Hero> origin (0,0) = the floor between the feet; everything is drawn upward. Vector only, no images.
// ============================================================================================
export const INK = '#1b1a3a';
export type Mood = 'happy' | 'sad' | 'neutral' | 'tired' | 'determined' | 'shock';
export type HeadProps = {mood?: Mood; skin?: string; hair?: string; look?: [number, number]; blink?: number; id?: string; turn?: number; kind?: 'bubble' | 'adult'};
const SK = '#e8eafb', SK_D = '#b9bfe0';   // default skin = the glossy pale bubble white; the adult head passes its own warm skin
// the head is a face-and-jaw shape, not a ball: about 28 years old (cheekbones, a square chin, small eyes, a nose, ears, a little stubble, a short cut)
const HEAD_D = 'M -176,-56 C -184,-168 -100,-208 0,-208 C 100,-208 184,-168 176,-56 C 174,44 150,150 92,198 Q 0,238 -92,198 C -150,150 -174,44 -176,-56 Z';

const Eye: React.FC<{x: number; mood: Mood; look: [number, number]; blink: number; skin: string; id: string; side: 1 | -1}> = ({x, mood, look, blink, skin, id, side}) => {
  const lid = {happy: 0.0, neutral: 0.1, determined: 0.2, shock: -0.1, tired: 0.5, sad: 0.44}[mood] + blink * 0.5;
  const ry = 38, rx = 46, cy = 0, ix = x + look[0] * 8, iy = cy + look[1] * 8;
  const lidY = cy - ry + ry * 2 * Math.min(0.95, Math.max(0, lid));
  const tiltY = mood === 'sad' ? side * 6 : 0;
  return (
    <g>
      <defs>
        <radialGradient id={`ir${id}${side}`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#2a1608" /><stop offset="0.4" stopColor="#6b4420" /><stop offset="0.82" stopColor="#a67a3e" /><stop offset="1" stopColor="#4a2e12" /></radialGradient>
        <clipPath id={`ec${id}${side}`}><ellipse cx={x} cy={cy} rx={rx} ry={ry} /></clipPath>
      </defs>
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={8} />
      <g clipPath={`url(#ec${id}${side})`}>
        <circle cx={ix} cy={iy} r={25} fill={`url(#ir${id}${side})`} /><circle cx={ix} cy={iy} r={25} fill="none" stroke={INK} strokeWidth={3} />
        <circle cx={ix} cy={iy} r={11} fill="#0a0610" />
        <circle cx={ix - 8} cy={iy - 9} r={6} fill="#fff" opacity={0.95} /><circle cx={ix + 9} cy={iy + 8} r={3} fill="#fff" opacity={0.85} />
        {lid > 0 && <path d={`M ${x - rx - 6},${cy - ry - 8} L ${x + rx + 6},${cy - ry - 8} L ${x + rx + 6},${lidY - tiltY} Q ${x},${lidY + 8} ${x - rx - 6},${lidY + tiltY} Z`} fill={skin} stroke={INK} strokeWidth={5} />}
      </g>
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={8} />
      {(mood === 'tired' || mood === 'sad') && <path d={`M ${x - 40},${cy + ry - 2} Q ${x},${cy + ry + 20} ${x + 40},${cy + ry - 2}`} stroke="#8a6a9c" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.75} />}
    </g>
  );
};

const AdultHead: React.FC<HeadProps> = ({mood = 'neutral', skin = '#fbe3a6', hair = '#4a2a14', look = [0, 0], blink = 0, id = 'h', turn = 0}) => {
  const smile = {happy: 1, neutral: 0.15, determined: 0.05, shock: 0, tired: -0.1, sad: -0.4}[mood];
  const browY = {happy: -62, neutral: -56, determined: -50, shock: -80, tired: -54, sad: -58}[mood];
  const tilt = {happy: -3, neutral: 0, determined: 9, shock: -5, tired: -7, sad: -12}[mood];
  const side = Math.abs(turn) > 0.4, sg = Math.sign(turn) || 1;
  return (
    <g>
      <defs>
        <radialGradient id={`sk${id}`} cx="38%" cy="28%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity="0.34" /><stop offset="0.45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.16" /></radialGradient>
        <clipPath id={`hc${id}`}><path d={HEAD_D} /></clipPath>
      </defs>
      {!side && [-1, 1].map((s) => <g key={s}><ellipse cx={s * 180} cy={14} rx={20} ry={36} fill={skin} stroke={INK} strokeWidth={9} /><path d={`M ${s * 178},-4 Q ${s * 190},14 ${s * 178},32`} stroke={INK} strokeWidth={5} fill="none" opacity={0.5} /></g>)}
      <path d={HEAD_D} fill={skin} stroke={INK} strokeWidth={11} strokeLinejoin="round" /><path d={HEAD_D} fill={`url(#sk${id})`} />
      <g clipPath={`url(#hc${id})`}>
        <path d="M -176,40 Q 0,120 176,40 L 176,250 L -176,250 Z" fill="#3a2a1a" opacity={0.09} />
        <ellipse cx={-118} cy={-40} rx={20} ry={34} fill="#fff" opacity={0.2} transform="rotate(20 -118 -40)" />
      </g>
      {side && <g><ellipse cx={-50 * sg} cy={18} rx={22} ry={38} fill={skin} stroke={INK} strokeWidth={9} /><path d={`M ${-50 * sg},0 Q ${-50 * sg + 10 * sg},20 ${-50 * sg},40`} stroke={INK} strokeWidth={5} fill="none" opacity={0.5} /></g>}
      <path d="M -184,-48 C -198,-150 -112,-214 0,-214 C 112,-214 198,-150 184,-48 C 176,-92 150,-120 94,-132 C 52,-104 -22,-96 -92,-112 C -142,-106 -172,-84 -184,-48 Z" fill={hair} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d="M -180,-46 L -174,32 L -154,6 L -156,-58 Z" fill={hair} stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M 180,-46 L 174,32 L 154,6 L 156,-58 Z" fill={hair} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -140,-150 C -90,-190 -10,-198 60,-186" stroke="#8a5a30" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} />
      <g clipPath={`url(#hc${id})`}><g transform={`translate(${turn * 92} ${Math.abs(turn) * 6}) scale(${1 - 0.3 * Math.abs(turn)} 1)`}>
        <Eye x={-76} mood={mood} look={look} blink={blink} skin={skin} id={id} side={-1} /><Eye x={76} mood={mood} look={look} blink={blink} skin={skin} id={id} side={1} />
        <path d={`M -122,${browY + 6 + tilt} Q -78,${browY - 12} -30,${browY + 3 - tilt}`} stroke={hair} strokeWidth={17} strokeLinecap="round" fill="none" />
        <path d={`M 30,${browY + 3 - tilt} Q 78,${browY - 12} 122,${browY + 6 + tilt}`} stroke={hair} strokeWidth={17} strokeLinecap="round" fill="none" />
        <path d="M 6,18 Q 26,52 6,64 Q -8,68 -22,60" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
        {mood === 'happy' && <><ellipse cx={-112} cy={74} rx={22} ry={12} fill="#f08a6a" opacity={0.3} /><ellipse cx={112} cy={74} rx={22} ry={12} fill="#f08a6a" opacity={0.3} /></>}
        {mood === 'happy'
          ? <g transform="translate(0 30) scale(0.72)"><path d="M -88,96 Q 0,200 88,96 Q 0,118 -88,96 Z" fill="#5a1620" stroke={INK} strokeWidth={10} strokeLinejoin="round" /><path d="M -80,99 Q 0,122 80,99 Q 0,134 -80,99 Z" fill="#fff" /><path d="M -46,152 Q 0,128 46,152 Q 0,184 -46,152 Z" fill="#e9707a" /></g>
          : mood === 'shock'
            ? <ellipse cx={0} cy={124} rx={22} ry={30} fill="#5a1620" stroke={INK} strokeWidth={8} />
            : <path d={`M -40,${124 - smile * 6} Q 0,${124 + smile * 26} 40,${124 - smile * 6}`} stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none" />}
      </g></g>
    </g>
  );
};

export const chinOf = (kind?: 'bubble' | 'adult') => (kind === 'adult' ? 236 : 200);
export const defaultHeadScale = (kind?: 'bubble' | 'adult') => (kind === 'adult' ? 0.46 : 0.6);
export const Head: React.FC<HeadProps> = ({kind = 'bubble', ...p}) => (kind === 'adult' ? <AdultHead {...p} /> : <BubbleHead {...p} />);

// ---------------------------------------------------------------------------------------------
// BODY v2: two-bone IK arms and legs (so any pose is a pair of targets), tapered limbs, a bicep bulge that grows with `muscle`, hands with fingers (open / relaxed / fist), shaded clothes.
// Pose coordinates are OUTWARD-POSITIVE: a target [dx, dy] is relative to the shoulder (or hip) and is mirrored for the left side, so [60, 200] means "a bit outward, far down" on both sides.
// ---------------------------------------------------------------------------------------------
export type HandKind = 'open' | 'relaxed' | 'fist' | 'point';
export type Pose = {arm?: [number, number]; armL?: [number, number]; armR?: [number, number]; hand?: HandKind; handL?: HandKind; handR?: HandKind; foot?: [number, number]; footL?: [number, number]; footR?: [number, number]; lean?: number; elbowIn?: boolean};
export const POSES: Record<string, Pose> = {
  idle: {},
  flex: {arm: [125, -118], hand: 'fist'},
  hips: {arm: [28, 196], hand: 'relaxed'},
  belly: {armL: [-84, 168], armR: [-84, 168], hand: 'relaxed'},
  up: {arm: [60, -250], hand: 'open'},
  pump: {armR: [70, -170], armL: [30, 215], handR: 'fist', handL: 'relaxed'},
  slump: {arm: [6, 230], hand: 'relaxed', lean: 5},
  wide: {arm: [120, 150], hand: 'open', foot: [74, 0]},
};
export type V = [number, number];
export const ik = (a: V, t: V, l1: number, l2: number, outward: 1 | -1): {el: V; wr: V} => {
  const dx = t[0] - a[0], dy = t[1] - a[1];
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 2), l1 + l2 - 0.5), base = Math.atan2(dy, dx);
  const ang = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const cand = [1, -1].map((s) => { const th = base + s * ang; return [a[0] + l1 * Math.cos(th), a[1] + l1 * Math.sin(th)] as V; });
  const el = (cand[0][0] * outward > cand[1][0] * outward) ? cand[0] : cand[1];
  return {el, wr: [a[0] + Math.cos(base) * d, a[1] + Math.sin(base) * d]};
};
export const Hand: React.FC<{p: V; ang: number; kind: HandKind; r: number; skin: string}> = ({p, ang, kind, r, skin}) => {
  const fingers = kind === 'fist' ? [] : kind === 'open' ? [-24, -8, 8, 24].map((x, i) => ({x, a: x * 1.1, l: 34 + (i === 1 || i === 2 ? 6 : 0)})) : [-22, -7, 8, 23].map((x, i) => ({x, a: x * 0.25, l: 26 + (i === 1 || i === 2 ? 4 : 0)}));
  const fw = 15;
  return (
    <g transform={`translate(${p[0]} ${p[1]}) rotate(${ang - 90}) scale(${r / 26})`}>
      {kind === 'fist'
        ? <g><rect x={-27} y={-4} width={54} height={50} rx={22} fill={skin} stroke={INK} strokeWidth={8} /><path d="M -14,14 L -14,40 M 0,14 L 0,42 M 14,14 L 14,40" stroke={INK} strokeWidth={4} opacity={0.5} strokeLinecap="round" /><path d="M -26,6 Q -40,22 -26,34" stroke={INK} strokeWidth={13} fill="none" strokeLinecap="round" /><path d="M -26,6 Q -38,22 -26,34" stroke={skin} strokeWidth={6} fill="none" strokeLinecap="round" /></g>
        : <g>
          {fingers.map((f, i) => <path key={'o' + i} d={`M ${f.x},22 L ${f.x + f.a * 0.4},${22 + f.l}`} stroke={INK} strokeWidth={fw + 7} strokeLinecap="round" />)}
          <path d="M -30,6 Q -52,22 -42,40" stroke={INK} strokeWidth={fw + 8} strokeLinecap="round" fill="none" />
          {fingers.map((f, i) => <path key={'f' + i} d={`M ${f.x},22 L ${f.x + f.a * 0.4},${22 + f.l}`} stroke={skin} strokeWidth={fw} strokeLinecap="round" />)}
          <path d="M -30,6 Q -52,22 -42,40" stroke={skin} strokeWidth={fw + 1} strokeLinecap="round" fill="none" />
          <rect x={-30} y={-6} width={60} height={46} rx={20} fill={skin} stroke={INK} strokeWidth={8} />
          <rect x={-26} y={-2} width={52} height={20} rx={10} fill={skin} />
        </g>}
    </g>
  );
};
export const Seg: React.FC<{a: V; b: V; w1: number; w2: number; fill: string; ink?: boolean}> = ({a, b, w1, w2, fill, ink}) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, pad = ink ? 6 : 0;
  const p = [[a[0] + nx * (w1 / 2 + pad), a[1] + ny * (w1 / 2 + pad)], [b[0] + nx * (w2 / 2 + pad), b[1] + ny * (w2 / 2 + pad)], [b[0] - nx * (w2 / 2 + pad), b[1] - ny * (w2 / 2 + pad)], [a[0] - nx * (w1 / 2 + pad), a[1] - ny * (w1 / 2 + pad)]];
  return <g><path d={`M ${p.map((q) => q.join(',')).join(' L ')} Z`} fill={ink ? INK : fill} /><circle cx={a[0]} cy={a[1]} r={w1 / 2 + pad} fill={ink ? INK : fill} /><circle cx={b[0]} cy={b[1]} r={w2 / 2 + pad} fill={ink ? INK : fill} /></g>;
};

export type BodyProps = {fat?: number; muscle?: number; top?: 'tee' | 'hoodie' | 'tank' | 'bare'; topColor?: string; pants?: string; shoe?: string; skin?: string; pose?: Pose | keyof typeof POSES; shorts?: boolean};
const LEG_H = 260, TORSO_H = 300, NECK_Y = -(LEG_H + TORSO_H);
export const shade = (c: string, k: number) => { const n = parseInt(c.slice(1), 16); const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k))); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); };

export const Body: React.FC<BodyProps> = ({fat = 0, muscle = 0, top = 'tee', topColor = '#e9962c', pants = '#2b3350', shoe = '#f2f2f2', skin = SK, pose = 'idle', shorts}) => {
  const P: Pose = typeof pose === 'string' ? POSES[pose] : pose;
  const sw = 112 + muscle * 44 - fat * 8, bw = 92 + fat * 78 - muscle * 8, hw = 96 + fat * 34, belly = fat * 44;
  const armW = 40 + muscle * 18 + fat * 8, foreW = armW * 0.8, legW = 66 + fat * 24 + muscle * 8, calfW = legW * 0.74;
  const fabric = top === 'bare' ? skin : topColor, longSleeve = top === 'hoodie';
  const lean = P.lean ?? 0;
  const side = (s: 1 | -1) => {
    const t = (s === -1 ? P.armL : P.armR) ?? P.arm ?? [5, 233];
    const sh: V = [s * (sw - 8), NECK_Y + 50];
    const tgt: V = [sh[0] + s * t[0], sh[1] + t[1]];
    const L1 = 122, L2 = 116, {el, wr} = ik(sh, tgt, L1, L2, P.elbowIn ? (-s as 1 | -1) : s);
    const kind = (s === -1 ? P.handL : P.handR) ?? P.hand ?? 'relaxed';
    const ang = Math.atan2(wr[1] - el[1], wr[0] - el[0]) * 180 / Math.PI;
    const mid = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    const bi = mid(sh, el, 0.5), bulge = armW * (0.5 + muscle * 0.34 + fat * 0.1);
    const sleeve = top === 'tee' ? mid(sh, el, 0.42) : longSleeve ? wr : top === 'tank' ? sh : sh;
    return (
      <g key={s}>
        <Seg a={el} b={wr} w1={foreW} w2={foreW * 0.78} fill={skin} ink /><Seg a={sh} b={el} w1={armW} w2={armW * 0.86} fill={skin} ink />
        {muscle > 0.2 && <ellipse cx={bi[0]} cy={bi[1]} rx={bulge} ry={bulge * 0.9} fill={INK} />}
        <Seg a={el} b={wr} w1={foreW} w2={foreW * 0.78} fill={longSleeve ? fabric : skin} />
        <Seg a={sh} b={el} w1={armW} w2={armW * 0.86} fill={top === 'bare' || top === 'tank' ? skin : fabric} />
        {muscle > 0.2 && top !== 'tee' && top !== 'hoodie' && <ellipse cx={bi[0]} cy={bi[1]} rx={bulge - 5} ry={bulge * 0.9 - 5} fill={skin} />}
        {muscle > 0.2 && top !== 'tee' && top !== 'hoodie' && <ellipse cx={bi[0] - s * 4} cy={bi[1] - 6} rx={bulge * 0.4} ry={bulge * 0.3} fill="#fff" opacity={0.22} />}
        {top === 'tee' && <g><Seg a={sh} b={sleeve} w1={armW + 12} w2={armW + 8} fill={INK} /><Seg a={sh} b={sleeve} w1={armW + 2} w2={armW} fill={fabric} /><Seg a={sh} b={sleeve} w1={armW} w2={armW - 2} fill={shade(fabric, 1.12)} /></g>}
        {longSleeve && <Seg a={mid(el, wr, 0.78)} b={wr} w1={foreW + 6} w2={foreW * 0.78 + 6} fill={shade(fabric, 0.85)} />}
        <circle cx={sh[0]} cy={sh[1]} r={armW * 0.58} fill={top === 'bare' || top === 'tank' ? skin : fabric} />
        <Hand p={wr} ang={ang} kind={kind} r={armW * 0.66 + 4} skin={skin} />
      </g>
    );
  };
  const torso = `M ${-sw * 0.46},${NECK_Y + 4} Q 0,${NECK_Y - 16} ${sw * 0.46},${NECK_Y + 4} L ${sw},${NECK_Y + 40} C ${sw + 4},${NECK_Y + 110} ${sw * 0.9},${NECK_Y + 170} ${bw + belly},${NECK_Y + 246} C ${bw + belly + 16},${NECK_Y + 292} ${hw},${NECK_Y + 310} ${hw},${NECK_Y + TORSO_H} L ${-hw},${NECK_Y + TORSO_H} C ${-hw},${NECK_Y + 310} ${-bw - belly - 16},${NECK_Y + 292} ${-bw - belly},${NECK_Y + 246} C ${-sw * 0.9},${NECK_Y + 170} ${-sw - 4},${NECK_Y + 110} ${-sw},${NECK_Y + 40} Z`;
  const leg = (s: 1 | -1) => {
    const t = (s === -1 ? P.footL : P.footR) ?? P.foot ?? [10, 0];
    const hip: V = [s * (hw * 0.5), NECK_Y + TORSO_H - 10], ank: V = [s * (hw * 0.5 + 12 + t[0]), -30 + t[1]];
    const {el: kn} = ik(hip, ank, 124, 124, s);
    return (
      <g key={s}>
        <Seg a={kn} b={ank} w1={calfW} w2={calfW * 0.62} fill={pants} ink /><Seg a={hip} b={kn} w1={legW} w2={calfW} fill={pants} ink />
        <Seg a={kn} b={ank} w1={calfW} w2={calfW * 0.62} fill={pants} /><Seg a={hip} b={kn} w1={legW} w2={calfW} fill={pants} />
        {shorts && <Seg a={hip} b={[hip[0] + (kn[0] - hip[0]) * 0.55, hip[1] + (kn[1] - hip[1]) * 0.55]} w1={legW + 6} w2={legW - 2} fill={shade(pants, 1.15)} />}
        <g transform={`translate(${ank[0]} ${ank[1]}) rotate(${s * 8})`}>
          <path d="M -34,28 Q -40,-6 -6,-14 Q 30,-18 44,16 Q 48,32 36,34 L -30,34 Z" fill={shoe} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d="M -34,26 L 40,26" stroke="#c9ced8" strokeWidth={10} strokeLinecap="round" /><path d="M -2,-6 Q 12,-2 20,8" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} strokeLinecap="round" />
          <path d="M -36,36 L 40,36" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        </g>
      </g>
    );
  };
  return (
    <g transform={lean ? `rotate(${lean} 0 0)` : undefined}>
      {leg(-1)}{leg(1)}
      <rect x={-34} y={NECK_Y - 40} width={68} height={80} fill={skin} stroke={INK} strokeWidth={9} /><path d={`M -26,${NECK_Y + 14} Q 0,${NECK_Y + 40} 26,${NECK_Y + 14}`} fill={SK_D} opacity={0.5} />
      {side(-1)}
      <path d={torso} fill={fabric} stroke={INK} strokeWidth={11} strokeLinejoin="round" />
      <clipPath id={`tc${top}${Math.round(fat * 10)}${Math.round(muscle * 10)}`}><path d={torso} /></clipPath>
      <g clipPath={`url(#tc${top}${Math.round(fat * 10)}${Math.round(muscle * 10)})`}>
        <path d={`M ${sw},${NECK_Y} L ${sw + 80},${NECK_Y} L ${bw + belly + 90},${NECK_Y + TORSO_H} L ${bw + belly - 26},${NECK_Y + TORSO_H} Z`} fill="#000" opacity={0.17} />
        <path d={`M ${-sw * 0.72},${NECK_Y + 50} C ${-sw * 0.8},${NECK_Y + 120} ${-bw * 0.8},${NECK_Y + 190} ${-bw * 0.78 - belly * 0.6},${NECK_Y + 240}`} stroke="#fff" strokeWidth={14} opacity={0.14} fill="none" strokeLinecap="round" />
        {fat > 0.3 && <ellipse cx={0} cy={NECK_Y + 250} rx={bw * 0.7 + belly} ry={36 + fat * 18} fill="#000" opacity={0.1} />}
      </g>
      {top === 'bare' && muscle > 0.3 && (
        <g stroke={INK} strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round">
          <path d={`M 0,${NECK_Y + 56} L 0,${NECK_Y + 250}`} />
          <path d={`M ${-sw * 0.78},${NECK_Y + 96} Q ${-sw * 0.36},${NECK_Y + 138} 0,${NECK_Y + 100}`} /><path d={`M ${sw * 0.78},${NECK_Y + 96} Q ${sw * 0.36},${NECK_Y + 138} 0,${NECK_Y + 100}`} />
          {[150, 188, 226].map((y) => <g key={y}><path d={`M ${-sw * 0.3},${NECK_Y + y} Q ${-sw * 0.16},${NECK_Y + y + 8} 0,${NECK_Y + y}`} /><path d={`M ${sw * 0.3},${NECK_Y + y} Q ${sw * 0.16},${NECK_Y + y + 8} 0,${NECK_Y + y}`} /></g>)}
          <path d={`M ${-sw * 0.62},${NECK_Y + 168} Q ${-sw * 0.7},${NECK_Y + 210} ${-bw * 0.9},${NECK_Y + 240}`} opacity={0.5} /><path d={`M ${sw * 0.62},${NECK_Y + 168} Q ${sw * 0.7},${NECK_Y + 210} ${bw * 0.9},${NECK_Y + 240}`} opacity={0.5} />
        </g>
      )}
      {longSleeve && (
        <g>
          <path d={`M ${-sw * 0.6},${NECK_Y + 2} Q 0,${NECK_Y + 74} ${sw * 0.6},${NECK_Y + 2}`} stroke={INK} strokeWidth={8} fill={shade(fabric, 0.8)} />
          <path d={`M -26,${NECK_Y + 60} L -26,${NECK_Y + 136} M 26,${NECK_Y + 60} L 26,${NECK_Y + 136}`} stroke="#f4f4f4" strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${-bw * 0.8},${NECK_Y + 206} Q 0,${NECK_Y + 190} ${bw * 0.8},${NECK_Y + 206} L ${bw * 0.74},${NECK_Y + 262} Q 0,${NECK_Y + 278} ${-bw * 0.74},${NECK_Y + 262} Z`} fill="rgba(0,0,0,.14)" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <path d={`M ${-bw - belly + 6},${NECK_Y + 284} Q 0,${NECK_Y + 300} ${bw + belly - 6},${NECK_Y + 284}`} stroke={INK} strokeWidth={5} fill="none" opacity={0.5} />
        </g>
      )}
      {top === 'tee' && <g><path d={`M ${-sw * 0.4},${NECK_Y + 6} Q 0,${NECK_Y + 56} ${sw * 0.4},${NECK_Y + 6}`} stroke={INK} strokeWidth={8} fill={SK_D} /><path d={`M ${-sw * 0.5},${NECK_Y + 150} q 20,12 40,0 M ${sw * 0.3},${NECK_Y + 210} q 20,10 40,0`} stroke={INK} strokeWidth={4} opacity={0.3} fill="none" strokeLinecap="round" /></g>}
      <path d={`M ${-hw},${NECK_Y + TORSO_H - 14} L ${hw},${NECK_Y + TORSO_H - 14}`} stroke={INK} strokeWidth={6} opacity={0.5} />
      {side(1)}
    </g>
  );
};

export type HeroProps = BodyProps & HeadProps & {x?: number; y?: number; scale?: number; flip?: boolean; headScale?: number; slump?: number};
export const Hero: React.FC<HeroProps> = ({x = 0, y = 0, scale = 1, flip, headScale, slump = 0, mood, skin, hair, look, blink, id, turn, kind, ...b}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <Body skin={skin} {...b} />
    <g transform={`translate(${slump * 8} ${NECK_Y - 14 - chinOf(kind) * (headScale ?? defaultHeadScale(kind)) + slump * 22}) scale(${headScale ?? defaultHeadScale(kind)}) rotate(${slump * 7})`}><Head mood={mood} skin={skin} hair={hair} look={look} blink={blink} id={id} turn={turn} kind={kind} /></g>
  </g>
);
