import React from 'react';
import {INK, UI, HAND} from './theme';
import {FL, SetOut, streetPoint} from './sets';

// ============================================================================================
// Set dressing: the details that make a room look lived in (shelves with books, lamps with light pools, rugs, curtain rods, hanging bulbs at the tea stall, a bicycle,
// a stove and a fridge in the kitchen, waiting chairs in the hospital...). Each function returns extra layers that kit.tsx merges into the base set.
// ============================================================================================
export type Detail = {far?: React.ReactNode; mid?: React.ReactNode; front?: React.ReactNode};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const BOOK = ['#c0392b', '#2c7ab8', '#e8a93b', '#3f9a52', '#7b4aa5', '#d9d3c0', '#b8503a', '#2a8f8a'];

const Books: React.FC<{x: number; y: number; n: number; seed?: number}> = ({x, y, n, seed = 0}) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({length: n}, (_, i) => {
      const w = 22 + rnd(i + seed, 1) * 16, h = 70 + rnd(i + seed, 2) * 44; let cx = 0; for (let k = 0; k < i; k++) cx += 22 + rnd(k + seed, 1) * 16 + 2;
      return <g key={i}><rect x={cx} y={-h} width={w} height={h} rx={2} fill={BOOK[(i + seed) % 8]} stroke={INK} strokeWidth={2.2} /><rect x={cx + 3} y={-h + 10} width={w - 6} height={5} fill="#fff" opacity={0.35} /></g>;
    })}
  </g>
);
const Plant: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#3f8f52'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -34,0 L 34,0 L 26,-64 L -26,-64 Z" fill="#a8583a" stroke={INK} strokeWidth={3} strokeLinejoin="round" /><rect x={-36} y={-72} width={72} height={12} rx={4} fill="#c06a44" stroke={INK} strokeWidth={3} />
    {[-70, -40, -12, 14, 42, 70].map((a, i) => <path key={i} d={`M 0,-72 Q ${a * 1.2},-${130 + (i % 2) * 40} ${a * 2},-${100 + i * 6} Q ${a},-${96 + (i % 2) * 20} 0,-72 Z`} fill={i % 2 ? c : '#2f7545'} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />)}
  </g>
);

export const livingDetail = (o: {warm?: boolean; t: number}): Detail => {
  const w = !!o.warm, wood = w ? '#7a4a2a' : '#3a3f5e', lamp = w ? '#ffcf7a' : '#bcd2ff';
  return {
    far: (
      <g>
        {/* wallpaper stripes, crown moulding, wainscot panels under a picture rail, skirting and floorboards in perspective */}
        {Array.from({length: 40}, (_, i) => <rect key={'wp' + i} x={-200 + i * 100} y={40} width={44} height={540} fill={w ? '#fff2cf' : '#aab6f0'} opacity={0.05} />)}
        <rect x={-400} y={0} width={4000} height={46} fill={w ? '#8a5a38' : '#3a4270'} stroke={INK} strokeWidth={3} /><rect x={-400} y={40} width={4000} height={12} fill={w ? '#b07a4c' : '#4c5690'} opacity={0.8} />
        <rect x={-400} y={560} width={4000} height={14} fill={w ? '#c9a064' : '#6a76b0'} stroke={INK} strokeWidth={3} />
        <rect x={-400} y={574} width={4000} height={222} fill={w ? '#8a5a38' : '#3a4474'} stroke={INK} strokeWidth={2.4} />
        {Array.from({length: 22}, (_, i) => <g key={'wc' + i}><rect x={-100 + i * 170} y={600} width={134} height={170} rx={4} fill="none" stroke={INK} strokeWidth={2.4} opacity={0.7} /><rect x={-92 + i * 170} y={608} width={118} height={154} rx={3} fill={w ? '#a06c42' : '#46508a'} opacity={0.6} /></g>)}
        <rect x={-400} y={780} width={4000} height={18} fill={w ? '#d9b27a' : '#7a86bc'} stroke={INK} strokeWidth={3} />
        {Array.from({length: 24}, (_, i) => <line key={'fb' + i} x1={-400 + i * 240} y1={832} x2={1600 + (-400 + i * 240 - 1600) * 1.9} y2={1080} stroke={w ? 'rgba(40,20,8,.3)' : 'rgba(10,14,40,.4)'} strokeWidth={2.4} />)}
        {[0.06, 0.16, 0.3, 0.5, 0.78].map((k, i) => <line key={'fh' + i} x1={-400} y1={832 + 248 * k} x2={3600} y2={832 + 248 * k} stroke={w ? 'rgba(40,20,8,.25)' : 'rgba(10,14,40,.35)'} strokeWidth={2.4} />)}
        <rect x={-400} y={796} width={4000} height={36} fill={w ? '#6a432a' : '#2a3150'} stroke={INK} strokeWidth={2.6} /><rect x={-400} y={796} width={4000} height={6} fill="#fff" opacity={0.12} />
        {/* wall shelves with books and a plant */}
        <g transform="translate(1500 120)">
          <rect x={0} y={118} width={470} height={14} rx={3} fill={wood} stroke={INK} strokeWidth={3} /><rect x={0} y={248} width={470} height={14} rx={3} fill={wood} stroke={INK} strokeWidth={3} />
          <Books x={14} y={118} n={9} seed={1} /><Books x={270} y={118} n={6} seed={7} />
          <Books x={14} y={248} n={5} seed={3} /><Plant x={400} y={248} s={0.55} />
          <rect x={170} y={186} width={70} height={62} rx={6} fill="#e8dcc0" stroke={INK} strokeWidth={2.6} /><circle cx={205} cy={217} r={18} fill="#c9954a" stroke={INK} strokeWidth={2.2} />
        </g>
        {/* the lamp's pool of light on the wall */}
        <ellipse cx={2250} cy={470} rx={300} ry={400} fill={lamp} opacity={w ? 0.2 : 0.1} />
        {/* curtain rod */}
        <rect x={2060} y={96} width={700} height={10} rx={5} fill="#5a4a3a" stroke={INK} strokeWidth={2.4} /><circle cx={2058} cy={101} r={10} fill="#8a6a3a" stroke={INK} strokeWidth={2.4} /><circle cx={2762} cy={101} r={10} fill="#8a6a3a" stroke={INK} strokeWidth={2.4} />
        {/* ceiling lamp */}
        <g transform="translate(1100 60)"><path d="M 0,-60 L 0,20" stroke={INK} strokeWidth={4} /><path d="M -60,70 Q 0,-10 60,70 Z" fill={w ? '#e8c27a' : '#c9d4ee'} stroke={INK} strokeWidth={3.4} /><ellipse cx={0} cy={72} rx={52} ry={8} fill={lamp} opacity={0.9} /></g>
      </g>
    ),
    mid: (
      <g>
        {/* standing lamp between the sofa and the table */}
        <g transform="translate(2250 0)">
          <ellipse cx={0} cy={838} rx={50} ry={9} fill="rgba(5,6,15,.4)" style={{filter: 'blur(5px)'}} />
          <rect x={-5} y={470} width={10} height={360} fill="#2a2a38" stroke={INK} strokeWidth={2.6} /><ellipse cx={0} cy={832} rx={40} ry={8} fill="#2a2a38" stroke={INK} strokeWidth={2.6} />
          <path d="M -58,470 L 58,470 L 38,380 L -38,380 Z" fill={w ? '#ffe6a8' : '#dbe6ff'} stroke={INK} strokeWidth={3.2} strokeLinejoin="round" /><path d="M -58,470 Q 0,492 58,470" fill="none" stroke={INK} strokeWidth={3} />
          <ellipse cx={0} cy={476} rx={70} ry={26} fill={lamp} opacity={0.35} />
        </g>
        {/* a patterned rug */}
        <ellipse cx={1500} cy={946} rx={760} ry={74} fill="none" stroke={w ? '#e8c27a' : '#8fa0d8'} strokeWidth={6} opacity={0.5} /><ellipse cx={1500} cy={946} rx={640} ry={58} fill="none" stroke={w ? '#a8583a' : '#5a6aa8'} strokeWidth={4} opacity={0.5} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${900 + i * 100},${900} l 24,40 l -24,26`} fill="none" stroke={w ? '#e8c27a' : '#8fa0d8'} strokeWidth={3} opacity={0.35} />)}
      </g>
    ),
  };
};

export const teaDetail = (o: {t: number; sunset?: number}): Detail => {
  const sun = (o.sunset ?? 0) > 0.2;
  return {
    far: (
      <g>
        {/* string of bulbs */}
        <path d="M 120,250 Q 1300,380 2480,250" fill="none" stroke={INK} strokeWidth={4} />
        {Array.from({length: 12}, (_, i) => { const k = (i + 0.5) / 12, x = 120 + k * 2360, y = 250 + 4 * 130 * k * (1 - k) * 0.97 + 8; return <g key={i}><line x1={x} y1={y - 10} x2={x} y2={y + 2} stroke={INK} strokeWidth={3} /><circle cx={x} cy={y + 16} r={13} fill="#ffe08a" stroke={INK} strokeWidth={2.4} /><circle cx={x} cy={y + 16} r={40} fill="#ffd27a" opacity={sun ? 0.24 : 0.18} /></g>; })}
        {/* birds */}
        {[0, 1, 2].map((i) => <path key={i} d={`M ${900 + i * 120 + Math.sin(o.t * 0.6) * 30},${160 + i * 30} q 14,-16 28,0 q 14,-16 28,0`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" opacity={0.7} />)}
      </g>
    ),
    mid: (
      <g>
        {/* the kettle, glasses and jars on the stall counter */}
        <g transform="translate(560 0)">
          <g transform="translate(-140 560)"><rect x={-44} y={-6} width={88} height={14} rx={4} fill="#3a3f5e" stroke={INK} strokeWidth={2.6} />
            <path d="M -40,-10 Q -48,-70 -10,-78 Q 34,-84 44,-10 Z" fill="#c9ccd8" stroke={INK} strokeWidth={3.2} /><path d="M 44,-40 q 36,-22 46,-60" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" /><path d="M -40,-52 q -34,6 -30,36" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
            {[-16, 0, 16].map((dx, i) => <path key={i} d={`M ${90 + dx * 0.4},-104 q ${10 + 4 * Math.sin(o.t * 3 + i)},-20 0,-40 q -10,-18 4,-34`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.45} />)}
            <path d="M -18,8 q -4,-22 6,-30 q 2,12 12,-6 q 10,14 0,36 Z" fill="#ff8a3a" opacity={0.9} /></g>
          {[0, 1, 2].map((i) => <g key={i} transform={`translate(${60 + i * 56} 596)`}><path d="M -18,0 L 18,0 L 14,-66 L -14,-66 Z" fill="#cfe6f4" stroke={INK} strokeWidth={2.6} opacity={0.9} /><rect x={-16} y={-70} width={32} height={8} fill="#8a96c8" stroke={INK} strokeWidth={2} /></g>)}
          <g transform="translate(150 596)"><rect x={-26} y={-60} width={52} height={60} rx={6} fill="#b8743c" stroke={INK} strokeWidth={2.8} /><rect x={-30} y={-72} width={60} height={14} rx={4} fill="#e8c27a" stroke={INK} strokeWidth={2.6} /></g>
        </g>
        {/* a bicycle against the wall */}
        <g transform="translate(2420 830)">
          <ellipse cx={0} cy={6} rx={150} ry={12} fill="rgba(5,6,15,.35)" style={{filter: 'blur(6px)'}} />
          {[-92, 92].map((x) => <g key={x} transform={`translate(${x} -52)`}><circle r={52} fill="none" stroke="#1d1d24" strokeWidth={9} /><circle r={52} fill="none" stroke={INK} strokeWidth={2} /><circle r={5} fill="#8a90b8" />{[0, 60, 120].map((a) => <line key={a} x1={0} y1={-48} x2={0} y2={48} stroke="#8a90b8" strokeWidth={2} transform={`rotate(${a + o.t * 0})`} />)}</g>)}
          <path d="M -92,-52 L -20,-112 L 64,-112 L 92,-52 M -20,-112 L 20,-52 L -92,-52 M 64,-112 L 56,-140 M 56,-140 L 84,-146 M -30,-112 L -34,-132 L -6,-134" fill="none" stroke="#c0392b" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M -50,-136 q 20,-12 40,0" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" /><rect x={70} y={-150} width={44} height={30} rx={6} fill="#c9954a" stroke={INK} strokeWidth={3} />
        </g>
        {/* a street lamp */}
        <g transform="translate(180 830)"><rect x={-6} y={-420} width={12} height={420} fill="#2a2a38" stroke={INK} strokeWidth={2.6} /><path d="M -30,-420 Q 0,-470 30,-420 Z" fill="#2a2a38" stroke={INK} strokeWidth={2.6} /><circle cx={0} cy={-414} r={16} fill="#ffe08a" opacity={0.95} /><circle cx={0} cy={-414} r={70} fill="#ffd27a" opacity={0.16} /></g>
      </g>
    ),
  };
};

const lp = (side: 'adam' | 'sam', u: number, v: number) => streetPoint(side, u, v);
const poly = (pts: [number, number][], fill: string, sw = 2.4, extra: object = {}) => <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" {...extra} />;
const qd = (side: 'adam' | 'sam', u0: number, v0: number, u1: number, v1: number, fill: string, sw = 2.4) => poly([lp(side, u0, v0), lp(side, u1, v0), lp(side, u1, v1), lp(side, u0, v1)], fill, sw);
// a street lamp, scaled by its distance down the street
const Lamp: React.FC<{x: number; y: number; s: number; on: boolean; dir: number}> = ({x, y, s, on, dir}) => (
  <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
    <ellipse cx={0} cy={4} rx={40} ry={8} fill="rgba(5,6,15,.3)" />
    <rect x={-6} y={-330} width={12} height={334} fill="#232842" stroke={INK} strokeWidth={3} /><rect x={-14} y={-30} width={28} height={30} rx={4} fill="#2c3252" stroke={INK} strokeWidth={3} />
    <path d="M 0,-326 Q 36,-346 64,-318" fill="none" stroke="#232842" strokeWidth={9} strokeLinecap="round" />
    <path d="M 46,-318 L 86,-318 L 76,-300 L 56,-300 Z" fill={on ? '#ffe9a0' : '#cfd6ea'} stroke={INK} strokeWidth={3} />{on && <ellipse cx={66} cy={-290} rx={70} ry={50} fill="#ffe08a" opacity={0.2} />}
  </g>
);
const Tree: React.FC<{x: number; y: number; s: number; a: string; b: string}> = ({x, y, s, a, b}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={90} ry={14} fill="rgba(5,6,15,.28)" />
    <path d="M -16,0 L -10,-170 L 10,-170 L 16,0 Z" fill="#4a3426" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><path d="M 0,-110 L -44,-170 M 0,-130 L 42,-186" stroke="#4a3426" strokeWidth={9} strokeLinecap="round" />
    <circle cx={0} cy={-250} r={104} fill={a} stroke={INK} strokeWidth={4} /><circle cx={-70} cy={-206} r={64} fill={a} stroke={INK} strokeWidth={4} /><circle cx={72} cy={-214} r={66} fill={a} stroke={INK} strokeWidth={4} />
    <circle cx={-26} cy={-282} r={56} fill={b} opacity={0.85} /><circle cx={46} cy={-232} r={40} fill={b} opacity={0.7} /><circle cx={-76} cy={-222} r={30} fill={b} opacity={0.7} />
  </g>
);
export const streetDetail = (o: {t: number; night?: boolean; sunset?: number; season?: number}): Detail => {
  const sun = (o.sunset ?? 0) > 0.2, night = !!o.night, lit = night || sun;
  const leafA = ['#c4486a', '#3c8a52', '#c9802b', '#cfd6ee'][(o.season ?? 1) % 4], leafB = ['#e07a94', '#5eb572', '#e6a24a', '#f2f5fc'][(o.season ?? 1) % 4];
  const bk1 = night ? '#18203c' : sun ? '#8a4f2c' : '#4a5688', bk2 = night ? '#10162c' : sun ? '#6d3a20' : '#394675';
  const lampPts = [0.1, 0.38, 0.62, 0.82];
  return {
    far: (
      <g>
        <path d="M 900,560 Q 1200,470 1500,520 T 2300,500 L 2300,660 L 900,660 Z" fill={night ? '#121a30' : sun ? '#7a4a2e' : '#6a7eb0'} opacity={0.7} />
        {Array.from({length: 12}, (_, i) => <rect key={'b' + i} x={1060 + i * 82} y={330 + ((i * 53) % 90)} width={78} height={330 - ((i * 53) % 90)} fill={bk1} stroke={INK} strokeWidth={1.8} />)}
        {Array.from({length: 10}, (_, i) => <g key={'c' + i}><rect x={1100 + i * 96} y={410 + ((i * 71) % 80)} width={90} height={260 - ((i * 71) % 80)} fill={bk2} stroke={INK} strokeWidth={1.8} />{Array.from({length: 9}, (_, k) => <rect key={k} x={1112 + i * 96 + (k % 3) * 26} y={426 + ((i * 71) % 80) + Math.floor(k / 3) * 44} width={14} height={18} fill={lit && (i + k) % 3 === 0 ? '#ffd27a' : night ? '#1e2848' : sun ? '#a86a3a' : '#6a7aae'} opacity={0.9} />)}</g>)}
        <g transform="translate(1900 350)"><rect x={-3} y={-60} width={6} height={60} fill="#232842" /><circle cy={-62} r={6} fill={lit ? '#ff6a6a' : '#7a86b0'} /></g>
        {sun && <circle cx={1500} cy={470} r={110} fill="#ffd27a" opacity={0.55} />}
        {[0, 1, 2].map((i) => <path key={i} d={`M ${1000 + i * 380 + Math.sin(o.t * 0.4 + i) * 40},${190 + i * 26} q 16,-18 32,0 q 16,-18 32,0`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" opacity={0.6} />)}
        <path d="M 160,150 Q 1600,280 3040,150" fill="none" stroke={INK} strokeWidth={3} opacity={0.55} /><path d="M 160,176 Q 1600,306 3040,176" fill="none" stroke={INK} strokeWidth={3} opacity={0.45} />
        <ellipse cx={1600} cy={860} rx={90} ry={18} fill="#2c3354" stroke={INK} strokeWidth={3} /><ellipse cx={1600} cy={860} rx={64} ry={11} fill="none" stroke="#1d2238" strokeWidth={3} />
      </g>
    ),
    mid: (
      <g>
        {[0.1, 0.36].map((u) => <g key={'aw' + u}>{qd('adam', u - 0.012, 0.16, u + 0.182, 0.42, 'rgba(0,0,0,0)', 5)}{poly([lp('adam', u + 0.085, 0.18), lp('adam', u + 0.095, 0.18), lp('adam', u + 0.095, 0.4), lp('adam', u + 0.085, 0.4)], '#2c3354', 1.5)}{qd('adam', u - 0.02, 0.4, u + 0.19, 0.43, '#59639a', 3)}</g>)}
        {[0.1, 0.36].map((u) => <g key={'sw' + u}>{qd('sam', u - 0.012, 0.16, u + 0.182, 0.42, 'rgba(0,0,0,0)', 5)}{poly([lp('sam', u + 0.085, 0.18), lp('sam', u + 0.095, 0.18), lp('sam', u + 0.095, 0.4), lp('sam', u + 0.085, 0.4)], '#5a3a1c', 1.5)}{qd('sam', u - 0.05, 0.16, u - 0.012, 0.42, '#6a4a2a', 3)}{qd('sam', u + 0.182, 0.16, u + 0.22, 0.42, '#6a4a2a', 3)}{qd('sam', u - 0.02, 0.4, u + 0.19, 0.43, '#c9a064', 3)}</g>)}
        {[0.12, 0.2, 0.28, 0.36, 0.44, 0.52, 0.6, 0.68, 0.76, 0.84, 0.92].map((v) => <polyline key={'br' + v} points={[lp('sam', 0, v).join(','), lp('sam', 1, v).join(',')].join(' ')} stroke="rgba(30,18,10,.28)" strokeWidth={1.6} />)}
        {[0.18, 0.3, 0.42, 0.54, 0.66, 0.78, 0.9].map((v) => <polyline key={'sd' + v} points={[lp('adam', 0, v).join(','), lp('adam', 1, v).join(',')].join(' ')} stroke="rgba(12,16,40,.3)" strokeWidth={2} />)}
        {qd('adam', 0.64, 0.98, 0.84, 1.03, '#6a74a8', 3)}{qd('sam', 0.64, 0.98, 0.84, 1.03, '#9a8468', 3)}
        {qd('sam', 0.62, 0.36, 0.84, 0.43, '#b2412a', 3)}
        <g transform={`translate(${lp('adam', 0.735, 0.4)[0]} ${lp('adam', 0.735, 0.4)[1]})`}><circle r={7} fill={lit ? '#ffe08a' : '#b0b8d4'} stroke={INK} strokeWidth={2} />{lit && <circle r={26} fill="#ffe08a" opacity={0.22} />}</g>
        <g transform={`translate(${lp('sam', 0.9, 0.62)[0]} ${lp('sam', 0.9, 0.62)[1]}) scale(0.8)`}><rect x={-18} y={-14} width={36} height={24} rx={3} fill="#f0ead8" stroke={INK} strokeWidth={2} /><text x={0} y={5} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={18} fill="#2a2a38">12</text></g>
        {(['adam', 'sam'] as const).map((sd) => [0.04, 0.16, 0.3, 0.46, 0.84].map((u, i) => { const p = lp(sd, u, 1.03), k = lerp(1.0, 0.45, u); return <g key={sd + i} transform={`translate(${p[0]} ${p[1] + 4}) scale(${k})`}><ellipse cx={0} cy={4} rx={86} ry={12} fill="rgba(5,6,15,.25)" /><circle cx={-46} cy={-30} r={40} fill={sd === 'adam' ? '#2f6a46' : '#3a7a4c'} stroke={INK} strokeWidth={4} /><circle cx={4} cy={-46} r={50} fill={sd === 'adam' ? '#2f6a46' : '#3a7a4c'} stroke={INK} strokeWidth={4} /><circle cx={54} cy={-28} r={38} fill={sd === 'adam' ? '#2f6a46' : '#3a7a4c'} stroke={INK} strokeWidth={4} /><circle cx={-10} cy={-60} r={22} fill={sd === 'adam' ? '#4a8a5e' : '#5a9a6a'} opacity={0.8} /></g>; }))}
        {[[0.12, '#ff7a9a'], [0.26, '#ffd24a'], [0.42, '#fff'], [0.58, '#ff9a4a']].map(([u, c], i) => { const p = lp('sam', u as number, 1.04); return <g key={'fl' + i}><circle cx={p[0]} cy={p[1] - 14} r={9} fill={c as string} stroke={INK} strokeWidth={1.8} /><circle cx={p[0] + 22} cy={p[1] - 8} r={7} fill={c as string} stroke={INK} strokeWidth={1.8} /></g>; })}
        <Tree x={lp('sam', 0.34, 1.0)[0] + 90} y={lp('sam', 0.34, 1.0)[1] + 10} s={0.46} a={leafA} b={leafB} /><Tree x={lp('sam', 0.7, 1.0)[0] + 90} y={lp('sam', 0.7, 1.0)[1] + 10} s={0.8} a={leafA} b={leafB} />
        <Tree x={lp('adam', 0.5, 1.0)[0] - 80} y={lp('adam', 0.5, 1.0)[1] + 10} s={0.55} a={leafA} b={leafB} />
        {lampPts.map((u, i) => <Lamp key={'l' + i} x={lp('adam', u, 1.0)[0] + 28} y={lp('adam', u, 1.0)[1] + 46} s={lerp(1.1, 0.5, 1 - u + 0.1) * (u < 0.2 ? 1.5 : 1)} on={lit} dir={1} />)}
        {[0.28, 0.58].map((u, i) => <Lamp key={'r' + i} x={lp('sam', u, 1.0)[0] - 28} y={lp('sam', u, 1.0)[1] + 46} s={lerp(1.1, 0.5, 1 - u + 0.1)} on={lit} dir={-1} />)}
        <g transform="translate(2360 836) scale(0.55)"><ellipse cx={0} cy={6} rx={170} ry={18} fill="rgba(5,6,15,.3)" /><path d="M -150,-20 L -150,-60 Q -140,-86 -100,-92 L -56,-130 Q -44,-142 -24,-142 L 70,-142 Q 90,-142 102,-126 L 128,-92 Q 150,-84 150,-60 L 150,-20 Z" fill="#b0453a" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M -44,-128 L 70,-128 L 100,-96 L -80,-96 Z" fill="#cfe0f2" stroke={INK} strokeWidth={4} /><path d="M 12,-128 L 12,-96" stroke={INK} strokeWidth={4} />{[-92, 96].map((x) => <g key={x} transform={`translate(${x} -10)`}><circle r={30} fill="#1d1d24" stroke={INK} strokeWidth={4} /><circle r={14} fill="#8a90b8" /></g>)}<rect x={134} y={-52} width={14} height={16} rx={3} fill="#ffe08a" /></g>
        {[['adam', 0.58], ['sam', 0.58]].map(([sd, u], i) => { const p = lp(sd as 'adam' | 'sam', u as number, 1.0); return <g key={'mb' + i} transform={`translate(${p[0]} ${p[1] + 26})`}><rect x={-3} y={-60} width={6} height={60} fill="#3a3f5e" stroke={INK} strokeWidth={2} /><rect x={-22} y={-86} width={44} height={28} rx={9} fill="#c0392b" stroke={INK} strokeWidth={3} /></g>; })}
      </g>
    ),
  };
};


// ---------------------------------------------------------------- factory floor: crane rail, hanging lamps, pipes, machines with dials, shelves of boxes, safety signs, lockers
export const factoryDetail = (o: {t: number}): Detail => ({
  far: (
    <g>
      <rect x={-400} y={20} width={4000} height={26} fill="#2a3150" stroke={INK} strokeWidth={3} />
      <path d="M -400,70 L 3600,70" stroke="#4a5470" strokeWidth={16} /><path d="M -400,70 L 3600,70" stroke={INK} strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <g key={'p' + i} transform={`translate(${200 + i * 480} 0)`}><rect x={-6} y={46} width={12} height={34} fill="#3a4260" /><path d="M -50,120 L 50,120 L 36,92 L -36,92 Z" fill="#c9ccd8" stroke={INK} strokeWidth={3} /><path d="M -50,120 L 100,330 L -150,330 Z" fill="#ffe08a" opacity={0.08} /><ellipse cx={0} cy={124} rx={34} ry={7} fill="#fff6c8" /></g>)}
      <g transform={`translate(${1100 + Math.sin(o.t * 0.4) * 300} 80)`}><rect x={-60} y={-14} width={120} height={22} rx={5} fill="#c9954a" stroke={INK} strokeWidth={3} /><path d="M 0,8 L 0,90" stroke={INK} strokeWidth={4} /><path d="M -14,90 Q 0,126 14,90" fill="none" stroke="#8a90b8" strokeWidth={8} strokeLinecap="round" /></g>
      {[[220, 250], [2920, 250]].map(([x, y], i) => <g key={'m' + i} transform={`translate(${x} ${y})`}><rect x={-160} y={0} width={320} height={300} rx={14} fill="#4a5470" stroke={INK} strokeWidth={4} /><rect x={-130} y={26} width={260} height={110} rx={8} fill="#2a3150" stroke={INK} strokeWidth={3} />{[-80, 0, 80].map((dx, k) => <g key={k} transform={`translate(${dx} 82)`}><circle r={34} fill="#e8ecf8" stroke={INK} strokeWidth={3} /><path d={`M 0,0 L ${22 * Math.cos(o.t * 0.8 + k)},${-22 * Math.abs(Math.sin(o.t * 0.8 + k))}`} stroke="#c0392b" strokeWidth={4} strokeLinecap="round" /></g>)}{[-90, -30, 30, 90].map((dx, k) => <circle key={k} cx={dx} cy={190} r={16} fill={['#e0455a', '#f5c542', '#3f9a52', '#4aa8ff'][k]} stroke={INK} strokeWidth={3} opacity={0.5 + 0.5 * Math.abs(Math.sin(o.t * 2 + k))} />)}<rect x={-120} y={240} width={240} height={26} fill="#2a3150" stroke={INK} strokeWidth={3} /></g>)}
      <g transform="translate(1000 330)"><rect x={-70} y={0} width={140} height={90} fill="#f5c542" stroke={INK} strokeWidth={4} /><path d="M -70,0 L -20,0 L -70,40 Z M -10,0 L 40,0 L -10,90 L -70,90 L -70,60 Z M 50,0 L 70,0 L 70,40 L 20,90 L 0,90 Z" fill="#1d1a2e" opacity={0.85} /><text x={0} y={-12} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={26} fill="#fff6e6" stroke={INK} strokeWidth={0.8}>SAFETY FIRST</text></g>
      <g transform="translate(2300 300)"><rect x={-160} y={0} width={320} height={96} rx={6} fill="#1d2236" stroke={INK} strokeWidth={4} /><text x={0} y={60} textAnchor="middle" fontFamily="Share Tech Mono, monospace" fontWeight={700} fontSize={48} fill="#ffb25a">LINE 3 · 14:30</text></g>
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={'wi' + i} x={1740 + i * 70} y={300} width={50} height={70 - (i % 2) * 20} fill={['#c0392b', '#2c7ab8', '#3f9a52'][i % 3]} opacity={0.0} />)}
    </g>
  ),
  mid: (
    <g>
      <g transform="translate(560 830)"><rect x={-130} y={-400} width={260} height={400} rx={6} fill="#4a5470" stroke={INK} strokeWidth={4} />{[0, 1, 2, 3].map((r) => <rect key={r} x={-120} y={-388 + r * 98} width={240} height={86} fill="#2a3150" stroke={INK} strokeWidth={2.4} />)}{[0, 1, 2, 3].map((r) => <g key={'b' + r}><rect x={-100} y={-370 + r * 98} width={80} height={56} fill="#c9954a" stroke={INK} strokeWidth={2.4} /><rect x={-4} y={-362 + r * 98} width={70} height={46} fill="#e0b068" stroke={INK} strokeWidth={2.4} /></g>)}</g>
      <g transform="translate(2640 830)">{[0, 1, 2].map((i) => <g key={i} transform={`translate(${-i * 12} ${-i * 96})`}><rect x={-80} y={-92} width={160} height={92} rx={5} fill="#c9954a" stroke={INK} strokeWidth={4} /><rect x={-80} y={-92} width={160} height={24} fill="#e0b068" stroke={INK} strokeWidth={3} /><rect x={-12} y={-92} width={24} height={92} fill="#d9c9a0" opacity={0.6} /></g>)}</g>
      <g transform="translate(2400 830)"><rect x={-26} y={-250} width={52} height={250} fill="#c0392b" stroke={INK} strokeWidth={4} /><rect x={-60} y={-20} width={120} height={20} rx={4} fill="#2a2a38" stroke={INK} strokeWidth={3} /></g>
    </g>
  ),
});

// ---------------------------------------------------------------- the school stage: a painted forest backdrop with a moon, spotlights, a banner and a valance
export const stageDetail = (o: {t: number}): Detail => ({
  far: (
    <g>
      <rect x={780} y={110} width={1640} height={320} fill="#1d2a52" />
      <circle cx={2100} cy={220} r={70} fill="#fff3b0" opacity={0.9} /><circle cx={2100} cy={220} r={110} fill="#fff3b0" opacity={0.15} />
      {[[860, 0.9], [1010, 1.2], [1180, 0.8], [1330, 1.1], [1500, 0.9], [1660, 1.3], [1830, 0.85], [1980, 1.0], [2260, 1.15]].map(([x, s], i) => <g key={i} transform={`translate(${x} 430) scale(${s})`}><rect x={-10} y={-70} width={20} height={70} fill="#4a3426" stroke={INK} strokeWidth={3} /><path d="M -70,-60 L 0,-230 L 70,-60 Z" fill={i % 2 ? '#2f7a4a' : '#3a8a56'} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" /><path d="M -56,-120 L 0,-250 L 56,-120 Z" fill={i % 2 ? '#3a8a56' : '#4a9a66'} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" /></g>)}
      <path d="M 780,420 Q 1100,370 1500,410 T 2420,400 L 2420,430 L 780,430 Z" fill="#2a6a40" />
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={'sp' + i} transform={`translate(${900 + i * 280} 50)`}><rect x={-22} y={-6} width={44} height={30} rx={6} fill="#2a2a38" stroke={INK} strokeWidth={3} /><path d="M -20,24 L 20,24 L 80,420 L -80,420 Z" fill="#fff3b0" opacity={0.07} /></g>)}
      <rect x={700} y={96} width={1800} height={40} fill="#4c1413" stroke={INK} strokeWidth={3} />{Array.from({length: 36}, (_, i) => <path key={i} d={`M ${712 + i * 50},136 q 12,24 24,0`} fill="#651e1c" stroke={INK} strokeWidth={2.4} />)}
      <g transform="translate(1600 70)"><rect x={-300} y={-26} width={600} height={50} rx={6} fill="#f5e8c8" stroke={INK} strokeWidth={4} /><text x={0} y={12} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={34} letterSpacing={6} fill="#4a2a1a">THE ENCHANTED FOREST</text></g>
    </g>
  ),
});


// ---------------------------------------------------------------- more dressing: tea stall, office, kitchen, stairs
export const teaMore = (): Detail => ({
  far: (
    <g>
      <g transform="translate(820 330)"><path d="M -4,-60 L -4,0 M 196,-60 L 196,0" stroke={INK} strokeWidth={4} /><rect x={-20} y={0} width={236} height={76} rx={8} fill="#f5e8c8" stroke={INK} strokeWidth={4} /><text x={98} y={34} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={30} fill="#7a2a1a">TEA · CHAI</text><text x={98} y={62} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={20} fill="#4a3a2a">SNACKS · BISCUITS</text></g>
      <g transform="translate(1900 420)"><rect x={-90} y={0} width={180} height={230} rx={6} fill="#2a3a2a" stroke="#c9a064" strokeWidth={8} /><text x={0} y={44} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={26} fill="#fff">MENU</text>{[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={-70} y={70 + i * 32} width={80 + (i % 2) * 20} height={7} rx={3} fill="#e8e8d0" opacity={0.85} /><rect x={40} y={70 + i * 32} width={32} height={7} rx={3} fill="#ffd27a" /></g>)}</g>
    </g>
  ),
  mid: (
    <g>
      {[0, 1].map((i) => <g key={i} transform={`translate(${1000 + i * 1100} 830)`}><rect x={-34} y={-86} width={68} height={14} rx={6} fill="#8a5a34" stroke={INK} strokeWidth={3} /><rect x={-28} y={-72} width={8} height={72} fill="#3a2f26" /><rect x={20} y={-72} width={8} height={72} fill="#3a2f26" /></g>)}
      <g transform="translate(2150 830)"><ellipse cx={0} cy={6} rx={110} ry={14} fill="rgba(5,6,15,.3)" /><path d="M -90,-20 L -70,-90 Q -50,-130 -10,-130 L 40,-130 L 60,-92 L 100,-86 L 100,-20 Z" fill="#3a8a96" stroke={INK} strokeWidth={4.4} strokeLinejoin="round" />{[-60, 70].map((x) => <g key={x} transform={`translate(${x} -4)`}><circle r={26} fill="#1d1d24" stroke={INK} strokeWidth={4} /><circle r={11} fill="#8a90b8" /></g>)}<rect x={-30} y={-134} width={60} height={14} rx={6} fill="#2a2a38" stroke={INK} strokeWidth={3} /><circle cx={92} cy={-70} r={10} fill="#ffe08a" stroke={INK} strokeWidth={2.4} /></g>
    </g>
  ),
});
export const officeMore = (): Detail => ({
  far: (
    <g>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1100 + i * 150} 200)`}><rect x={0} y={0} width={116} height={150} fill="#7a5a3a" stroke={INK} strokeWidth={4} /><rect x={10} y={10} width={96} height={130} fill="#f4ecd8" /><rect x={22} y={30} width={72} height={8} rx={3} fill="#9a9482" /><rect x={32} y={50} width={52} height={6} rx={3} fill="#bfb9a6" /><circle cx={58} cy={104} r={16} fill="#c0392b" /></g>)}
      <g transform="translate(2200 140)"><rect x={0} y={0} width={440} height={330} fill="#10182c" stroke={INK} strokeWidth={5} />{Array.from({length: 9}, (_, i) => <rect key={i} x={6} y={8 + i * 34} width={428} height={20} fill="#2a3150" opacity={0.7} />)}</g>
    </g>
  ),
  mid: (
    <g>
      <g transform="translate(300 830)"><rect x={-100} y={-300} width={200} height={300} rx={6} fill="#4a5470" stroke={INK} strokeWidth={4} />{[0, 1, 2].map((r) => <g key={r}><rect x={-88} y={-288 + r * 96} width={176} height={86} rx={4} fill="#59639a" stroke={INK} strokeWidth={2.4} /><rect x={-26} y={-250 + r * 96} width={52} height={10} rx={4} fill="#c9ccd8" /></g>)}</g>
      <g transform="translate(2900 830)"><rect x={-34} y={-250} width={68} height={250} rx={8} fill="#cfe2f4" stroke={INK} strokeWidth={4} /><rect x={-26} y={-330} width={52} height={86} rx={12} fill="#9ad0ff" opacity={0.7} stroke={INK} strokeWidth={3} /><circle cx={0} cy={-200} r={8} fill="#c0392b" /></g>
    </g>
  ),
});
export const kitchenMore = (): Detail => ({
  far: (
    <g>
      {Array.from({length: 22}, (_, r) => Array.from({length: 4}, (_, c) => <rect key={r + '-' + c} x={140 + r * 120} y={560 + c * 60} width={116} height={56} fill={(r + c) % 2 ? '#8a5a44' : '#7a4c38'} stroke="rgba(20,10,8,.4)" strokeWidth={1.6} />))}
      <g transform="translate(700 560)"><rect x={0} y={-340} width={420} height={320} rx={6} fill="#a8713f" stroke={INK} strokeWidth={4} /><path d="M 210,-340 L 210,-20" stroke={INK} strokeWidth={4} /><rect x={170} y={-200} width={14} height={54} rx={6} fill="#e9d6b4" stroke={INK} strokeWidth={2.4} /><rect x={236} y={-200} width={14} height={54} rx={6} fill="#e9d6b4" stroke={INK} strokeWidth={2.4} /></g>
      <rect x={640} y={540} width={1520} height={24} rx={4} fill="#c9a064" stroke={INK} strokeWidth={4} /><rect x={640} y={564} width={1520} height={236} fill="#8a5636" stroke={INK} strokeWidth={4} />{[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><rect x={660 + i * 250} y={584} width={226} height={196} rx={4} fill="#a06c42" stroke={INK} strokeWidth={3} /><rect x={760 + i * 250} y={600} width={26} height={8} rx={4} fill="#e9d6b4" /></g>)}
      {[[760, '#e8ecf8'], [900, '#c0392b'], [1040, '#f5c542']].map(([x, c], i) => <g key={i} transform={`translate(${x} 540)`}><rect x={-26} y={-60} width={52} height={60} rx={8} fill={c as string} stroke={INK} strokeWidth={3} /><rect x={-20} y={-72} width={40} height={14} rx={4} fill="#8a5a34" stroke={INK} strokeWidth={2.4} /></g>)}
      <g transform="translate(1500 540)"><path d="M -60,0 L -50,-70 Q 0,-96 50,-70 L 60,0 Z" fill="#c9ccd8" stroke={INK} strokeWidth={4} /><path d="M 50,-60 q 34,-12 40,-44" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" /></g>
    </g>
  ),
});
export const stairsMore = (): Detail => ({
  mid: (
    <g>
      <g transform="translate(2650 830)"><rect x={-60} y={-460} width={120} height={460} fill="#6a4a30" stroke={INK} strokeWidth={4} /><rect x={-44} y={-440} width={88} height={190} fill="#4a3220" stroke={INK} strokeWidth={3} /><rect x={-44} y={-232} width={88} height={190} fill="#4a3220" stroke={INK} strokeWidth={3} /><circle cx={34} cy={-220} r={7} fill="#e8c27a" /></g>
      <g transform="translate(1000 830)"><rect x={-70} y={-10} width={140} height={10} rx={3} fill="#8a3a4a" stroke={INK} strokeWidth={3} /><ellipse cx={0} cy={-10} rx={90} ry={12} fill="#8a3a4a" opacity={0.0} /></g>
    </g>
  ),
});

export const kitchenDetail = (o: {t: number}): Detail => ({
  far: (
    <g>
      <rect x={2140} y={536} width={780} height={8} rx={4} fill="#8a8a98" stroke={INK} strokeWidth={2.4} />
      {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${2200 + i * 150} 544)`}><line x1={0} y1={0} x2={0} y2={20} stroke={INK} strokeWidth={3} /><ellipse cx={0} cy={50} rx={26} ry={32} fill={['#c9ccd8', '#b8743c', '#8fa0d8', '#c0392b', '#c9ccd8'][i]} stroke={INK} strokeWidth={3} /></g>)}
    </g>
  ),
  mid: (
 <>
    <g>
      <g transform="translate(2560 830)"><rect x={-130} y={-190} width={260} height={190} rx={10} fill="#3a3f5e" stroke={INK} strokeWidth={4} /><rect x={-130} y={-190} width={260} height={30} rx={8} fill="#5a6090" stroke={INK} strokeWidth={3} />
        {[-60, 60].map((x) => <circle key={x} cx={x} cy={-174} r={12} fill="#1d1d24" stroke={INK} strokeWidth={2.4} />)}
        <rect x={-96} y={-150} width={192} height={120} rx={8} fill="#1c2036" stroke={INK} strokeWidth={3} /><circle cx={-4} cy={-212} r={0} />
        <g transform="translate(-60 -190)"><path d="M -34,0 L 34,0 L 30,-66 L -30,-66 Z" fill="#c9ccd8" stroke={INK} strokeWidth={3.2} /><rect x={-38} y={-72} width={76} height={10} rx={4} fill="#8a90b8" stroke={INK} strokeWidth={2.6} />
          {[-12, 8].map((dx, i) => <path key={i} d={`M ${dx},-80 q ${8 + 3 * Math.sin(o.t * 3 + i)},-18 0,-34 q -8,-16 3,-30`} fill="none" stroke="#fff" strokeWidth={4.4} strokeLinecap="round" opacity={0.4} />)}</g></g>
      <g transform="translate(300 830)"><rect x={-110} y={-520} width={220} height={520} rx={14} fill="#c9d4ee" stroke={INK} strokeWidth={4} /><line x1={-110} y1={-300} x2={110} y2={-300} stroke={INK} strokeWidth={4} /><rect x={80} y={-440} width={10} height={90} rx={5} fill="#8a90b8" stroke={INK} strokeWidth={2.6} /><rect x={80} y={-270} width={10} height={90} rx={5} fill="#8a90b8" stroke={INK} strokeWidth={2.6} />
        <rect x={-60} y={-470} width={46} height={60} rx={3} fill="#fbf1d2" stroke={INK} strokeWidth={2} /><rect x={-50} y={-486} width={26} height={20} rx={3} fill="#f5c542" /></g>
    </g>
    <g transform="translate(1600 706)">
      <ellipse cx={0} cy={14} rx={72} ry={12} fill="rgba(5,6,15,.35)" />
      <g><path d="M -30,-24 Q -2,-62 40,-34 Q 6,-50 -26,-10 Z" fill="#f5d23a" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" /><path d="M 40,-34 l 6,-6" stroke="#5a3a1a" strokeWidth={4} strokeLinecap="round" /></g>
      <g transform="translate(-20 -28)"><circle r={19} fill="#d83a3a" stroke={INK} strokeWidth={2.6} /><ellipse cx={-6} cy={-6} rx={5} ry={8} fill="#fff" opacity={0.4} /><path d="M 0,-19 q 2,-8 6,-10" stroke="#5a3a1a" strokeWidth={3} fill="none" strokeLinecap="round" /><path d="M 4,-24 q 12,-8 18,0 q -10,8 -18,0 Z" fill="#3f9a52" stroke={INK} strokeWidth={2} /></g>
      <g transform="translate(24 -26)"><circle r={18} fill="#f5902a" stroke={INK} strokeWidth={2.6} />{[[-6, -4], [4, 3], [-2, 8], [8, -7]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={1.6} fill="#c06a14" />)}<ellipse cx={-6} cy={-7} rx={4} ry={6} fill="#fff" opacity={0.35} /></g>
      <g transform="translate(2 -42)"><circle r={16} fill="#7fc24a" stroke={INK} strokeWidth={2.6} /><ellipse cx={-5} cy={-5} rx={4} ry={6} fill="#fff" opacity={0.4} /><path d="M 0,-16 q 1,-8 5,-10" stroke="#5a3a1a" strokeWidth={3} fill="none" strokeLinecap="round" /></g>
      <path d="M -58,-22 Q -56,18 0,20 Q 56,18 58,-22 Z" fill="#4a7bd0" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" /><ellipse cx={0} cy={-22} rx={58} ry={9} fill="#3a62b0" stroke={INK} strokeWidth={3} /><path d="M -40,-8 Q -30,8 -10,12" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.4} />
    </g>
 </>
  ),
});

export const officeDetail = (o: {t: number}): Detail => ({
  far: (
    <g>
      <g transform="translate(300 150)"><rect x={0} y={150} width={620} height={14} rx={3} fill="#3a4560" stroke={INK} strokeWidth={3} /><rect x={0} y={290} width={620} height={14} rx={3} fill="#3a4560" stroke={INK} strokeWidth={3} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} x={14 + i * 66} y={150 - 110 - (i % 3) * 8} width={52} height={110 + (i % 3) * 8} rx={3} fill={['#5a6aa8', '#c0392b', '#e8a93b', '#3f9a52'][i % 4]} stroke={INK} strokeWidth={2.6} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={20 + i * 96} y={290 - 100} width={78} height={100} rx={3} fill="#d9d3c0" stroke={INK} strokeWidth={2.6} />)}</g>
      <g transform="translate(1480 160)"><rect x={0} y={0} width={210} height={250} rx={6} fill="#f4ecdc" stroke={INK} strokeWidth={3} /><rect x={0} y={0} width={210} height={46} fill="#c0392b" stroke={INK} strokeWidth={3} />{Array.from({length: 24}, (_, i) => <rect key={i} x={14 + (i % 6) * 30} y={64 + Math.floor(i / 6) * 42} width={22} height={28} rx={3} fill={i === 17 ? '#e8a93b' : '#e8dfd0'} stroke={INK} strokeWidth={1.6} />)}</g>
    </g>
  ),
  mid: <g transform="translate(2780 830)"><ellipse cx={0} cy={6} rx={60} ry={9} fill="rgba(5,6,15,.35)" style={{filter: 'blur(5px)'}} /><g transform="scale(1.4)"><path d="M -34,0 L 34,0 L 26,-64 L -26,-64 Z" fill="#a8583a" stroke={INK} strokeWidth={3} />{[-50, -20, 10, 40].map((a, i) => <path key={i} d={`M 0,-64 Q ${a},-${120 + i * 10} ${a * 1.6},-${96 + i * 8} Q ${a * 0.4},-90 0,-64 Z`} fill={i % 2 ? '#3f9a52' : '#2f7545'} stroke={INK} strokeWidth={2.6} />)}</g></g>,
  front: <g transform="translate(2150 690)"><rect x={-22} y={-46} width={44} height={46} rx={6} fill="#e8e0f4" stroke={INK} strokeWidth={3} /><path d="M 22,-34 q 18,2 14,14 q -4,8 -14,6" fill="none" stroke={INK} strokeWidth={3} />{[-6, 8].map((dx, i) => <path key={i} d={`M ${dx},-54 q ${7 + 2 * Math.sin(o.t * 3 + i)},-14 0,-26 q -7,-12 2,-22`} fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" opacity={0.4} />)}</g>,
});

export const parkDetail = (o: {t: number; season?: number}): Detail => {
  const s = o.season ?? 1, leaf = ['#c02f52', '#2f7545', '#c9802b', '#cfd6ee'][s % 4], leaf2 = ['#e0607f', '#3f9a52', '#e0a040', '#e9eefa'][s % 4];
  const tree = (x: number, y: number, k: number, i: number) => <g key={i} transform={`translate(${x} ${y}) scale(${k})`}><ellipse cx={0} cy={4} rx={70} ry={10} fill="rgba(5,6,15,.25)" /><rect x={-12} y={-150} width={24} height={150} fill="#4a3426" stroke={INK} strokeWidth={3} /><circle cx={0} cy={-210} r={96} fill={leaf} stroke={INK} strokeWidth={3.4} /><circle cx={-40} cy={-190} r={56} fill={leaf2} opacity={0.7} /><circle cx={44} cy={-236} r={42} fill={leaf2} opacity={0.5} /></g>;
  return {
    far: (
      <g>
        <path d="M -400,560 Q 500,430 1300,540 T 2600,500 T 3600,540 L 3600,760 L -400,760 Z" fill="#3f7a52" opacity={0.55} stroke={INK} strokeWidth={2} />
        {[200, 520, 900, 1500, 2000, 2400, 2900].map((x, i) => tree(x, 590 + (i % 3) * 16, 0.45 + (i % 2) * 0.1, i))}
        {[1150, 1250, 1360].map((x, i) => <g key={i} transform={`translate(${x} 570)`}><rect x={-40} y={-50} width={80} height={50} fill={['#e8d3a8', '#d98c6c', '#b9c4e0'][i]} stroke={INK} strokeWidth={2.4} /><path d="M -50,-50 L 0,-90 L 50,-50 Z" fill="#a8453a" stroke={INK} strokeWidth={2.4} /><rect x={-10} y={-30} width={20} height={30} fill="#5a3a24" /></g>)}
        <circle cx={2700} cy={180} r={70} fill="#fff3b0" opacity={0.85} /><circle cx={2700} cy={180} r={130} fill="#fff3b0" opacity={0.2} />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${500 + i * 160 + Math.sin(o.t * 0.5) * 40},${190 + i * 24} q 14,-16 28,0 q 14,-16 28,0`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" opacity={0.65} />)}
      </g>
    ),
    mid: (
      <g>
        <path d="M 1900,1100 Q 2040,860 2300,780 T 2900,740" fill="none" stroke="#c9b48a" strokeWidth={90} strokeLinecap="round" opacity={0.7} />
        {[-80, 40, 140, 700, 760, 2480, 2560].map((x, i) => <g key={i} transform={`translate(${x + 600} ${790 + (i % 3) * 18})`}><path d="M 0,0 L 0,-26" stroke="#3f7a3a" strokeWidth={3} /><circle cx={0} cy={-30} r={9} fill={['#ffd24a', '#ff7a9a', '#fff', '#b78cff'][i % 4]} stroke={INK} strokeWidth={1.8} /></g>)}
        <g transform="translate(2300 800)"><rect x={-130} y={-70} width={260} height={14} rx={5} fill="#8a5a34" stroke={INK} strokeWidth={3} /><rect x={-130} y={-120} width={260} height={12} rx={5} fill="#8a5a34" stroke={INK} strokeWidth={3} /><rect x={-118} y={-70} width={12} height={72} fill="#3a3040" /><rect x={106} y={-70} width={12} height={72} fill="#3a3040" /><rect x={-118} y={-130} width={12} height={62} fill="#3a3040" /><rect x={106} y={-130} width={12} height={62} fill="#3a3040" /></g>
        {tree(2820, 800, 0.95, 90)}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <g key={i} transform={`translate(${60 + i * 52} 780)`}><rect x={-5} y={-56} width={10} height={56} fill="#d9c9a0" stroke={INK} strokeWidth={2} /><path d="M -5,-56 L 0,-68 L 5,-56" fill="#d9c9a0" stroke={INK} strokeWidth={2} /></g>)}
        <path d="M 50,-30 L 480,-30 M 50,-8 L 480,-8" transform="translate(0 760)" stroke={INK} strokeWidth={4} />
      </g>
    ),
  };
};

// Leo's room: posters, a shelf with a game console, a desk with a lamp, a night window, a bed edge and a rug
export const roomDetail = (o: {t: number}): Detail => ({
  far: (
    <g>
      <g transform="translate(900 150)"><rect x={0} y={0} width={190} height={260} fill="#2a3a66" stroke={INK} strokeWidth={4} /><circle cx={95} cy={90} r={54} fill="#f5c542" stroke={INK} strokeWidth={3} /><path d="M 20,230 L 70,150 L 110,200 L 150,130 L 175,230 Z" fill="#3f9a52" stroke={INK} strokeWidth={3} /></g>
      <g transform="translate(1160 190)"><rect x={0} y={0} width={230} height={170} fill="#5a2a4a" stroke={INK} strokeWidth={4} />{[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 50} y={24} width={36} height={120 - i * 14} fill={['#c0392b', '#e8a93b', '#2c7ab8', '#3f9a52'][i]} stroke={INK} strokeWidth={2.4} />)}</g>
      <g transform="translate(1500 130)"><rect x={0} y={0} width={420} height={14} rx={3} fill="#6a4a30" stroke={INK} strokeWidth={3} />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={18 + i * 40} y={-84 + (i % 3) * 10} width={32} height={84 - (i % 3) * 10} fill={['#7b4aa5', '#2a8f8a', '#c9a64a', '#b8503a'][i % 4]} stroke={INK} strokeWidth={2.4} />)}<g transform="translate(300 0)"><rect x={0} y={-34} width={90} height={34} rx={6} fill="#e9ecf8" stroke={INK} strokeWidth={3} /><circle cx={26} cy={-17} r={9} fill="#2c7ab8" /><rect x={50} y={-24} width={26} height={8} rx={4} fill="#c0392b" /></g></g>
      <g transform="translate(2200 160)"><rect x={0} y={0} width={300} height={380} fill="#0f1730" stroke={INK} strokeWidth={5} /><path d="M 150,0 L 150,380 M 0,190 L 300,190" stroke={INK} strokeWidth={4} />{[[40, 40], [210, 80], [90, 270], [230, 250]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 + (i % 2)} fill="#fff7c8" opacity={0.8} />)}<circle cx={240} cy={60} r={26} fill="#fff3b0" opacity={0.9} /></g>
    </g>
  ),
  mid: (
    <g>
      <g transform="translate(2020 830)"><rect x={-170} y={-130} width={340} height={14} rx={4} fill="#6a4a30" stroke={INK} strokeWidth={3.4} /><rect x={-160} y={-116} width={12} height={116} fill="#4a3220" /><rect x={148} y={-116} width={12} height={116} fill="#4a3220" /><rect x={-60} y={-116} width={110} height={80} rx={4} fill="#5a3f2a" stroke={INK} strokeWidth={2.4} />
        <g transform="translate(90 -130)"><path d="M 0,0 L 40,-60 L 70,-60" fill="none" stroke="#2a2a38" strokeWidth={7} strokeLinecap="round" /><path d="M 56,-70 L 100,-70 L 86,-40 L 70,-40 Z" fill="#ffe08a" stroke={INK} strokeWidth={3} /></g>
        <g transform="translate(-100 -130)"><rect x={-40} y={-56} width={80} height={56} rx={4} fill="#1c2036" stroke={INK} strokeWidth={3} /><rect x={-34} y={-50} width={68} height={42} fill="#2c7ab8" opacity={0.85} /></g></g>
      <g transform="translate(640 830)"><rect x={-260} y={-110} width={440} height={110} rx={12} fill="#34456e" stroke={INK} strokeWidth={4} /><rect x={-260} y={-130} width={440} height={34} rx={14} fill="#4a5a8a" stroke={INK} strokeWidth={3.6} /><rect x={-250} y={-190} width={120} height={70} rx={20} fill="#e9ecf8" stroke={INK} strokeWidth={3.4} /></g>
      <ellipse cx={1250} cy={940} rx={560} ry={50} fill="#2c3a6a" opacity={0.55} stroke={INK} strokeWidth={3} />
    </g>
  ),
});

// the stairs: a banister, framed family photos climbing the wall, shoes at the bottom and a window
export const stairsDetail = (): Detail => ({
  far: (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${380 + i * 210} ${380 - i * 52}) rotate(${-2 + i})`}><rect x={-62} y={-48} width={124} height={96} fill="#6a4a30" stroke={INK} strokeWidth={4} /><rect x={-50} y={-36} width={100} height={72} fill={['#c9b99a', '#b9c8d8', '#d8c0b0', '#c9d8b9', '#d8d0a0'][i]} /><circle cx={-12} cy={-6} r={12} fill="#f4f2fb" stroke={INK} strokeWidth={2} /><circle cx={16} cy={2} r={9} fill="#f4f2fb" stroke={INK} strokeWidth={2} /></g>)}
      <g transform="translate(2500 160)"><rect x={0} y={0} width={240} height={320} fill="#10183a" stroke={INK} strokeWidth={5} /><path d="M 120,0 L 120,320 M 0,160 L 240,160" stroke="#6a5a4a" strokeWidth={6} /><circle cx={180} cy={60} r={20} fill="#fff3b0" /></g>
    </g>
  ),
  mid: (
    <g>
      <path d="M 300,760 L 2350,160" fill="none" stroke="#3a2a20" strokeWidth={16} strokeLinecap="round" /><path d="M 300,820 L 2350,220" fill="none" stroke={INK} strokeWidth={5} />
      {Array.from({length: 14}, (_, i) => <line key={i} x1={300 + i * 158} y1={760 - i * 46} x2={300 + i * 158} y2={850 - i * 46} stroke="#3a2a20" strokeWidth={8} />)}
      <g transform="translate(260 830)"><path d="M -60,0 q 0,-26 40,-26 l 50,0 l 0,26 Z" fill="#2a2a38" stroke={INK} strokeWidth={3} /><path d="M 50,0 q 0,-20 40,-20 l 40,0 l 0,20 Z" fill="#3a2f26" stroke={INK} strokeWidth={3} /></g>
    </g>
  ),
});

// hospital corridor: tiles in perspective, a wainscot and hand rail on both walls, posters and a notice board, ceiling light panels, sconces, a sanitiser, waiting chairs and a trolley
const HW: Record<'l' | 'r', [number, number][]> = {l: [[-400, -200], [1450, 430], [1450, 570], [-400, 1180]], r: [[3600, -200], [1750, 430], [1750, 570], [3600, 1180]]};
const hp = (s: 'l' | 'r', u: number, v: number): [number, number] => { const [A, B, C, D] = HW[s]; const t = [lerp(A[0], B[0], u), lerp(A[1], B[1], u)], bt = [lerp(D[0], C[0], u), lerp(D[1], C[1], u)]; return [lerp(t[0], bt[0], v), lerp(t[1], bt[1], v)]; };
const hq = (s: 'l' | 'r', u0: number, v0: number, u1: number, v1: number, fill: string, sw = 2.4) => poly([hp(s, u0, v0), hp(s, u1, v0), hp(s, u1, v1), hp(s, u0, v1)], fill, sw);
export const hospitalDetail = (): Detail => ({
  far: (
    <g>
      {/* floor: tile joints converging on the end of the corridor */}
      {Array.from({length: 17}, (_, i) => { const x = -400 + i * 250; return <line key={'fl' + i} x1={1600 + (x - 1600) * 0.07} y1={572} x2={x} y2={1180} stroke="rgba(20,26,60,.35)" strokeWidth={2.4} />; })}
      {[0.04, 0.1, 0.19, 0.31, 0.47, 0.67, 0.92].map((k, i) => { const y = lerp(572, 1180, k), x0 = lerp(1450, -400, k), x1 = lerp(1750, 3600, k); return <line key={'fh' + i} x1={x0} y1={y} x2={x1} y2={y} stroke="rgba(20,26,60,.35)" strokeWidth={2.4} />; })}
      <polygon points="1450,570 1750,570 2300,1180 900,1180" fill="#fff" opacity={0.08} />
      {/* walls: wainscot panel, hand rail, skirting */}
      {(['l', 'r'] as const).map((s) => <g key={s}>
        {hq(s, 0, 0.66, 1, 1, s === 'l' ? '#4a5890' : '#6a3e30', 2.4)}
        {[0.06, 0.2, 0.36, 0.56, 0.78].map((u, i) => hq(s, u, 0.7, u + 0.1 * (1 - u * 0.5), 0.94, 'rgba(0,0,0,0.12)', 1.6))}
        {hq(s, 0, 0.62, 1, 0.655, '#e6e9f6', 2.6)}{hq(s, 0, 0.97, 1, 1.0, '#2c3354', 2)}
      </g>)}
      {/* posters and a notice board on the walls */}
      {hq('l', 0.22, 0.18, 0.32, 0.46, '#f4ecd8', 3)}{hq('l', 0.235, 0.22, 0.305, 0.3, '#e0455a', 1.6)}{hq('l', 0.235, 0.33, 0.305, 0.34, '#9a9482', 1)}{hq('l', 0.235, 0.37, 0.29, 0.38, '#9a9482', 1)}
      {hq('l', 0.5, 0.2, 0.66, 0.44, '#a98c5a', 3)}{[0, 1, 2].map((i) => hq('l', 0.52 + i * 0.045, 0.25, 0.555 + i * 0.045, 0.34 + (i % 2) * 0.03, ['#fff', '#cfe2f4', '#ffe9a0'][i], 1.4))}
      {hq('r', 0.2, 0.2, 0.3, 0.44, '#cfe6f4', 3)}{hq('r', 0.215, 0.24, 0.285, 0.32, '#3a7ac0', 1.6)}{hq('r', 0.215, 0.36, 0.285, 0.375, '#9a9482', 1)}
      {hq('r', 0.52, 0.28, 0.58, 0.46, '#e9ecf8', 2.6)}{hq('r', 0.535, 0.33, 0.565, 0.4, '#e0455a', 1.4)}
      {/* sconces on the walls */}
      {[0.14, 0.4, 0.62].map((u, i) => { const p = hp('l', u, 0.3), q = hp('r', u, 0.3); const sc = lerp(1, 0.4, u); return <g key={'sc' + i}>{[p, q].map((pp, j) => <g key={j} transform={`translate(${pp[0]} ${pp[1]}) scale(${sc})`}><rect x={-14} y={-10} width={28} height={34} rx={8} fill="#fff6c8" stroke={INK} strokeWidth={3} /><ellipse cx={0} cy={0} rx={50} ry={40} fill="#fff6c8" opacity={0.22} /></g>)}</g>; })}
    </g>
  ),
  mid: (
    <g>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${360 + i * 130} 790)`}><rect x={-50} y={-70} width={100} height={70} rx={10} fill="#4a5a8a" stroke={INK} strokeWidth={3.4} /><rect x={-50} y={-20} width={100} height={22} rx={6} fill="#5a6aa8" stroke={INK} strokeWidth={3} /><rect x={-44} y={2} width={8} height={36} fill="#2a2a38" /><rect x={36} y={2} width={8} height={36} fill="#2a2a38" /></g>)}
      <g transform="translate(2700 830)"><rect x={-90} y={-130} width={180} height={14} rx={6} fill="#c9ccd8" stroke={INK} strokeWidth={3} /><rect x={-86} y={-116} width={8} height={100} fill="#8a90b8" /><rect x={78} y={-116} width={8} height={100} fill="#8a90b8" />{[-60, 60].map((x) => <circle key={x} cx={x} cy={-6} r={14} fill="#1d1d24" stroke={INK} strokeWidth={3} />)}<rect x={-70} y={-160} width={140} height={30} rx={8} fill="#e9ecf8" stroke={INK} strokeWidth={3} /><rect x={-60} y={-196} width={50} height={40} rx={4} fill="#fff" stroke={INK} strokeWidth={2.4} /><rect x={20} y={-188} width={40} height={32} rx={4} fill="#cfe2f4" stroke={INK} strokeWidth={2.4} /></g>
    </g>
  ),
});

export const doorDetail = (): Detail => ({
  far: (
    <g>
      <Frame2 x={620} y={330} w={160} h={210} /><Frame2 x={2300} y={330} w={190} h={140} /><Frame2 x={2560} y={360} w={130} h={170} />
      <g transform="translate(2420 830)"><rect x={-90} y={-100} width={180} height={100} rx={6} fill="#5a4a3a" stroke={INK} strokeWidth={3} />{[-50, 0, 50].map((x) => <g key={x}><path d={`M ${x - 22},-70 q 22,-30 44,0 l 6,18 l -56,0 Z`} fill={x === 0 ? '#f2f0f8' : '#2a3a66'} stroke={INK} strokeWidth={2.4} /></g>)}</g>
    </g>
  ),
  mid: (
    <g>
      <rect x={900} y={880} width={1600} height={90} rx={10} fill="#5a3a5a" stroke={INK} strokeWidth={3} opacity={0.75} /><rect x={930} y={896} width={1540} height={58} rx={6} fill="none" stroke="#e8c27a" strokeWidth={4} opacity={0.5} />
      <Plant x={440} y={830} s={1.1} />
    </g>
  ),
});
const Frame2: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
  <g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#6a4a30" stroke={INK} strokeWidth={4} /><rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} fill="#c9b99a" />
    <path d={`M ${-w / 2 + 10},${h / 2 - 10} L ${-w / 6},${-h / 6} L ${w / 10},${h / 8} L ${w / 4},${-h / 8} L ${w / 2 - 10},${h / 2 - 10} Z`} fill="#6a8f6a" stroke={INK} strokeWidth={2.4} /><circle cx={w / 5} cy={-h / 4} r={h / 9} fill="#f5c542" stroke={INK} strokeWidth={2.4} /></g>
);
export const merge = (set: SetOut, d: Detail): SetOut => ({...set, far: <>{set.far}{d.far}</>, mid: <>{set.mid}{d.mid}</>, front: set.front || d.front ? <>{set.front}{d.front}</> : undefined});
export {FL, UI, HAND};
