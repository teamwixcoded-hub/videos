import React from 'react';
import {INK, UI, HAND, SERIF} from './theme';
import {shade, mixc} from './People';

// ---------------- props for the stage (stage coordinates unless noted) ----------------
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// Adam's gift pile: a corner where boxes stack up, each one bigger and shinier. n = 0..8, dust = 0..1. Base sits on the floor at (x, y).
const BOXES: {w: number; h: number; c: string; r: string; tag?: string}[] = [
  {w: 250, h: 130, c: '#c0392b', r: '#f2d16b', tag: 'CAR'}, {w: 230, h: 120, c: '#2c7ab8', r: '#f6e7b4'}, {w: 300, h: 150, c: '#7b4aa5', r: '#f2d16b', tag: 'COSTUME'}, {w: 240, h: 120, c: '#e08a2d', r: '#fff1c4'},
  {w: 270, h: 140, c: '#2f9a76', r: '#f2d16b', tag: 'PHONE'}, {w: 230, h: 120, c: '#b83b6e', r: '#f6e7b4'}, {w: 280, h: 140, c: '#3b4a8c', r: '#f2d16b', tag: 'LAPTOP'}, {w: 220, h: 110, c: '#c9a227', r: '#fff1c4'},
];
export const GiftPile: React.FC<{x: number; y: number; n: number; dust?: number; s?: number}> = ({x, y, n, dust = 0, s = 1}) => {
  let top = 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {BOXES.slice(0, Math.min(8, Math.max(0, Math.ceil(n)))).map((b, i) => {
        const grow = Math.min(1, n - i), off = (rnd(i, 3) - 0.5) * 60, rot = (rnd(i, 4) - 0.5) * 7;
        const yy = -top - b.h; top += b.h - 6;
        const col = mixc(b.c, '#8a8478', dust * 0.55);
        return (
          <g key={i} transform={`translate(${off} ${yy + (1 - grow) * -60}) rotate(${rot})`} opacity={grow}>
            <rect x={-b.w / 2} y={0} width={b.w} height={b.h} rx={8} fill={col} stroke={INK} strokeWidth={5} />
            <rect x={-b.w / 2} y={0} width={b.w} height={b.h * 0.22} rx={8} fill={shade(col, 0.16)} opacity={0.7} />
            <rect x={-14} y={0} width={28} height={b.h} fill={mixc(b.r, '#8a8478', dust * 0.5)} stroke={INK} strokeWidth={3.4} />
            <path d={`M 0,0 q -44,-52 -56,-8 q 20,14 56,8 q 36,6 56,-8 q -12,-44 -56,8 Z`} fill={mixc(b.r, '#8a8478', dust * 0.5)} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
            {b.tag && <text x={b.w / 2 - 24} y={b.h - 20} textAnchor="end" fontFamily={UI} fontWeight={700} fontSize={22} letterSpacing={3} fill="#fff" opacity={0.75}>{b.tag}</text>}
            {dust > 0.15 && <rect x={-b.w / 2} y={0} width={b.w} height={b.h} rx={8} fill="#cfc9bc" opacity={dust * 0.35} />}
          </g>
        );
      })}
      {dust > 0.3 && <path d="M -120,-30 q 30,-40 60,0 M 60,-90 q 20,-30 50,-6" fill="none" stroke="#e8e2d4" strokeWidth={2} opacity={dust * 0.6} />}
    </g>
  );
};
export const giftTop = (n: number) => { let t = 0; for (let i = 0; i < Math.min(8, Math.ceil(n)); i++) t += BOXES[i].h - 6; return t; };

// Miniature photographs for Sam's wall and the gallery
export type PhotoKind = 'four' | 'kite' | 'play' | 'stall' | 'grad' | 'wedding' | 'party' | 'walk' | 'shave' | 'cup' | 'sunset' | 'stairs' | 'baby';
export const PhotoArt: React.FC<{kind: PhotoKind; w: number; h: number; x?: number; y?: number}> = ({kind, w, h, x, y}) => {
  const sky = kind === 'sunset' || kind === 'stall' || kind === 'four' ? '#f0b266' : kind === 'play' ? '#4a3a63' : kind === 'party' ? '#f3c98b' : kind === 'wedding' ? '#f0e6d2' : '#9fd0e6';
  const person = (cx: number, by: number, sc: number, col: string, skin = '#d79a70') => (
    <g transform={`translate(${cx} ${by}) scale(${sc})`}><rect x={-14} y={-46} width={28} height={46} rx={10} fill={col} stroke={INK} strokeWidth={3} /><circle cx={0} cy={-62} r={15} fill={skin} stroke={INK} strokeWidth={3} /></g>
  );
  return (
    <svg x={x} y={y} width={w} height={h} viewBox="0 0 200 150" style={{display: 'block'}}>
      <rect width={200} height={150} fill={sky} />
      {kind !== 'play' && kind !== 'party' && kind !== 'wedding' && <rect y={104} width={200} height={46} fill={kind === 'stall' || kind === 'sunset' ? '#9a6b4a' : '#7bb56a'} />}
      {kind === 'kite' && <g><path d="M 140,14 L 166,40 L 140,70 L 114,40 Z" fill="#e8553b" stroke={INK} strokeWidth={3} /><path d="M 140,14 L 140,70 M 114,40 L 166,40" stroke={INK} strokeWidth={2} /><path d="M 140,70 Q 100,100 70,98" fill="none" stroke={INK} strokeWidth={2} />{person(62, 120, 0.9, '#b4592f')}{person(96, 124, 0.62, '#4c9a63')}</g>}
      {kind === 'play' && <g><rect y={0} width={200} height={150} fill="#3a2f55" /><rect x={20} y={14} width={160} height={90} fill="#c9a25a" opacity={0.5} />{person(100, 112, 0.7, '#4c9a63')}<ellipse cx={100} cy={118} rx={70} ry={10} fill="#fff6c9" opacity={0.4} /></g>}
      {kind === 'party' && <g><rect y={104} width={200} height={46} fill="#b8864f" /><circle cx={40} cy={36} r={16} fill="#e8553b" stroke={INK} strokeWidth={3} /><circle cx={80} cy={26} r={16} fill="#3f78c4" stroke={INK} strokeWidth={3} /><circle cx={160} cy={34} r={16} fill="#f2d16b" stroke={INK} strokeWidth={3} />{person(100, 118, 0.9, '#3f78c4', '#e3ad84')}<rect x={130} y={92} width={44} height={28} rx={4} fill="#f6e7b4" stroke={INK} strokeWidth={3} /></g>}
      {kind === 'stall' && <g><rect x={16} y={40} width={64} height={64} fill="#8a5a3a" stroke={INK} strokeWidth={3} /><path d="M 8,40 L 48,16 L 88,40 Z" fill="#c0392b" stroke={INK} strokeWidth={3} />{person(130, 120, 0.85, '#b4592f')}{person(160, 122, 0.8, '#4c9a63')}</g>}
      {kind === 'four' && <g>{person(52, 124, 0.9, '#26324f', '#e3ad84')}{person(88, 126, 0.9, '#b4592f')}{person(124, 126, 0.9, '#3f78c4', '#e3ad84')}{person(160, 126, 0.9, '#4c9a63')}<rect x={10} y={40} width={50} height={64} fill="#8a5a3a" stroke={INK} strokeWidth={3} opacity={0.0} /></g>}
      {kind === 'grad' && <g>{person(100, 124, 1, '#26324f', '#e3ad84')}<rect x={74} y={44} width={52} height={8} fill="#222" stroke={INK} strokeWidth={2} /><path d="M 70,48 L 100,36 L 130,48 L 100,58 Z" fill="#222" stroke={INK} strokeWidth={2} /><path d="M 168,128 q 8,-14 20,-6" fill="none" stroke="#2a1d18" strokeWidth={6} opacity={0.55} /></g>}
      {kind === 'wedding' && <g><rect y={110} width={200} height={40} fill="#d8c8a6" />{person(70, 124, 0.95, '#f4f4f0', '#d79a70')}{person(100, 124, 1.0, '#b4592f')}{person(132, 124, 0.95, '#3a3a44', '#e3ad84')}</g>}
      {kind === 'walk' && <g>{person(80, 124, 0.9, '#b4592f')}{person(118, 124, 0.9, '#4c9a63')}</g>}
      {kind === 'shave' && <g>{person(100, 130, 1.1, '#4c9a63')}</g>}
      {kind === 'sunset' && <g><circle cx={150} cy={80} r={30} fill="#fff1c4" opacity={0.9} />{person(70, 124, 0.9, '#b4592f')}{person(100, 126, 0.85, '#4c9a63')}</g>}
      {kind === 'stairs' && <g>{person(80, 126, 0.9, '#b4592f')}{person(118, 126, 0.9, '#4c9a63')}</g>}
      {kind === 'cup' && <g><rect x={74} y={60} width={52} height={50} rx={8} fill="#f6efe2" stroke={INK} strokeWidth={3} /></g>}
      {kind === 'baby' && <g><ellipse cx={100} cy={96} rx={56} ry={30} fill="#f6efe2" stroke={INK} strokeWidth={3} /><circle cx={76} cy={86} r={20} fill="#e8b793" stroke={INK} strokeWidth={3} /></g>}
    </svg>
  );
};

// Sam's photo wall: photos pinned with tape, growing with every age. n = 0..12; the torn kite is pinned in the middle once `kite` is true.
const SPOTS: [number, number, number, PhotoKind][] = [
  [0, 0, -3, 'kite'], [-250, -90, 4, 'baby'], [260, -80, -4, 'play'], [-240, 120, -5, 'stall'], [250, 130, 3, 'walk'], [-470, 20, 3, 'shave'], [470, 30, -2, 'party'],
  [-460, -150, -4, 'sunset'], [480, -150, 5, 'grad'], [-700, 70, 2, 'stairs'], [700, 90, -3, 'wedding'], [-680, -110, -3, 'cup'],
];
export const PhotoWall: React.FC<{x: number; y: number; n: number; kite?: boolean; s?: number; glow?: number}> = ({x, y, n, kite = true, s = 1, glow = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0 && <ellipse cx={0} cy={0} rx={820} ry={380} fill="#ffcf8a" opacity={0.18 * glow} />}
    {SPOTS.slice(1, 1 + Math.max(0, Math.min(11, n - 1))).map(([px, py, rot, kind], i) => (
      <g key={i} transform={`translate(${px} ${py}) rotate(${rot})`}>
        <rect x={-88} y={-70} width={176} height={150} fill="#fbf5e8" stroke={INK} strokeWidth={4} style={{filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.35))'}} />
        <PhotoArt kind={kind} x={-80} y={-62} w={160} h={120} />
        <rect x={-26} y={-82} width={52} height={20} fill="rgba(235,210,140,.85)" transform="rotate(-3)" />
      </g>
    ))}
    {kite && n >= 1 && (
      <g transform={`rotate(${SPOTS[0][2]})`}>
        <rect x={-104} y={-90} width={208} height={178} fill="#fbf5e8" stroke={INK} strokeWidth={4} style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,.4))'}} />
        <PhotoArt kind="kite" x={-96} y={-82} w={192} h={144} />
        <rect x={-30} y={-102} width={60} height={22} fill="rgba(235,210,140,.85)" />
      </g>
    )}
  </g>
);

// a paper kite. torn = a rip across it
export const Kite: React.FC<{x: number; y: number; s?: number; rot?: number; torn?: number; tail?: number; t?: number}> = ({x, y, s = 1, rot = 0, torn = 0, tail = 1, t = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {tail > 0 && <path d={`M 0,96 Q ${22 * Math.sin(t * 3)},150 ${-10 + 18 * Math.sin(t * 3 + 1)},200 T ${12 * Math.sin(t * 3 + 2)},300`} fill="none" stroke={INK} strokeWidth={3} />}
    {tail > 0 && [130, 190, 250].map((yy, i) => <path key={i} d={`M ${-14 + 8 * Math.sin(t * 3 + i)},${yy} l 14,-10 l 14,10 l -14,10 z`} fill={i % 2 ? '#f2d16b' : '#c0392b'} stroke={INK} strokeWidth={2.4} />)}
    <path d="M 0,-96 L 70,0 L 0,96 L -70,0 Z" fill="#e8553b" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 0,-96 L 70,0 L 0,0 Z" fill="#f2d16b" opacity={0.9} /><path d="M 0,96 L -70,0 L 0,0 Z" fill="#f2d16b" opacity={0.9} />
    <path d="M 0,-96 L 0,96 M -70,0 L 70,0" stroke={INK} strokeWidth={3.4} />
    {torn > 0 && <path d={`M -70,0 L -${50 * torn},-14 L -${30 * torn},8 L -${10 * torn},-12 L ${10 * torn},6`} fill="#f4ecdc" stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
  </g>
);

// two tea cups / four cups on a bench top at (x, y)
export const Cup: React.FC<{x: number; y: number; s?: number; steam?: number; t?: number}> = ({x, y, s = 1, steam = 1, t = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {steam > 0 && [-8, 6].map((dx, i) => <path key={i} d={`M ${dx},-34 q 8,-14 0,-26 q -8,-12 2,-24`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={steam * (0.35 + 0.2 * Math.sin(t * 3 + i))} />)}
    <path d="M -22,-30 L 22,-30 L 18,0 Q 0,8 -18,0 Z" fill="#f6efe2" stroke={INK} strokeWidth={3.6} strokeLinejoin="round" />
    <path d="M 22,-24 q 18,2 14,14 q -4,8 -16,6" fill="none" stroke={INK} strokeWidth={3.4} />
    <ellipse cx={0} cy={-30} rx={22} ry={5} fill="#a8683a" stroke={INK} strokeWidth={2.4} />
  </g>
);

// open laptop seen from the side/back: lid toward the viewer; angle 0 = shut, 1 = open
export const Laptop: React.FC<{x: number; y: number; s?: number; open?: number; glow?: number; screenToViewer?: boolean}> = ({x, y, s = 1, open = 1, glow = 1, screenToViewer = false}) => {
  const lid = 150 * open;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -130,0 L 130,0 L 150,26 L -150,26 Z" fill="#bfc3c9" stroke={INK} strokeWidth={4.4} strokeLinejoin="round" />
      <path d="M -126,4 L 126,4 L 134,12 L -134,12 Z" fill="#d6d9de" opacity={0.7} />
      {open > 0.02 && (screenToViewer
        ? <g><rect x={-128} y={-lid - 4} width={256} height={lid + 4} rx={10} fill="#2a2a32" stroke={INK} strokeWidth={4.4} /><rect x={-116} y={-lid + 8} width={232} height={lid - 16} rx={4} fill="#e9f1fb" opacity={glow} /><rect x={-100} y={-lid + 26} width={120} height={10} rx={4} fill="#9db6d6" /><rect x={-100} y={-lid + 48} width={190} height={8} rx={4} fill="#c3d2e6" /><rect x={-100} y={-lid + 66} width={150} height={8} rx={4} fill="#c3d2e6" /></g>
        : <g><path d={`M -128,0 L 128,0 L 118,${-lid} L -118,${-lid} Z`} fill="#c9cdd3" stroke={INK} strokeWidth={4.4} strokeLinejoin="round" /><circle cx={0} cy={-lid / 2} r={9} fill="#9aa0a8" opacity={0.7} /></g>)}
    </g>
  );
};

// a framed picture on a wall, with a plain or photo fill
export const Frame: React.FC<{x: number; y: number; w: number; h: number; kind?: PhotoKind; down?: boolean; empty?: boolean}> = ({x, y, w, h, kind, down, empty}) => (
  <g transform={`translate(${x} ${y})${down ? ' rotate(180)' : ''}`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#7a5a3e" stroke={INK} strokeWidth={4.4} />
    {down ? <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} fill="#6b4f37" /> : kind && !empty ? <PhotoArt kind={kind} x={-w / 2 + 8} y={-h / 2 + 8} w={w - 16} h={h - 16} /> : <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} fill="#e8dfd0" />}
  </g>
);

// a phone held to the ear (hip space, drawn under the hand)
export const Handset: React.FC<{x?: number; y?: number; rot?: number; glow?: number}> = ({x = 96, y = -372, rot = -8, glow = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x={-17} y={-42} width={34} height={84} rx={9} fill="#1d1d24" stroke={INK} strokeWidth={4} />{glow > 0 && <rect x={-12} y={-36} width={24} height={72} rx={6} fill="#bfe0ff" opacity={glow} />}</g>
);
export const Handwriting: React.FC<{x: number; y: number; text: string; size?: number; rot?: number; color?: string}> = ({x, y, text, size = 44, rot = -3, color = '#3a2a26'}) => (
  <text x={x} y={y} fontFamily={HAND} fontWeight={600} fontSize={size} fill={color} transform={`rotate(${rot} ${x} ${y})`}>{text}</text>
);
export {SERIF};
