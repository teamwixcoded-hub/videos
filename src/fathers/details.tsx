import React from 'react';
import {INK, UI, HAND} from './theme';
import {FL, SetOut} from './sets';

// ============================================================================================
// Set dressing: the details that make a room look lived in (shelves with books, lamps with light pools, rugs, curtain rods, hanging bulbs at the tea stall, a bicycle,
// a stove and a fridge in the kitchen, waiting chairs in the hospital...). Each function returns extra layers that kit.tsx merges into the base set.
// ============================================================================================
export type Detail = {far?: React.ReactNode; mid?: React.ReactNode; front?: React.ReactNode};
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

export const streetDetail = (o: {t: number; night?: boolean}): Detail => ({
  far: (
    <g>
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${380 + i * 780 + Math.sin(o.t * 0.05 + i) * 6} ${160 + (i % 2) * 40})`} opacity={0.85}><ellipse cx={0} cy={0} rx={120} ry={34} fill={o.night ? '#34406e' : '#fff'} opacity={0.8} /><ellipse cx={60} cy={10} rx={90} ry={28} fill={o.night ? '#34406e' : '#fff'} opacity={0.8} /></g>)}
    </g>
  ),
  mid: (
    <g>
      {/* shrubs and a mailbox in front of each house, a fence along the pavement */}
      {[[330, 912], [640, 818], [2560, 818], [2880, 912]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><ellipse cx={0} cy={0} rx={74} ry={46} fill="#2f7545" stroke={INK} strokeWidth={3} /><ellipse cx={-26} cy={-10} rx={34} ry={22} fill="#3f9a52" opacity={0.8} /></g>)}
      {[0, 1, 2, 3, 4, 5].map((i) => { const k = i / 5; return <g key={i}><rect x={170 + k * 920} y={640 + k * -170 + 190 * (1 - k)} width={8} height={70 - k * 30} fill="#d9d3c0" stroke={INK} strokeWidth={2} /></g>; })}
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
    <g>
      <g transform="translate(2560 830)"><rect x={-130} y={-190} width={260} height={190} rx={10} fill="#3a3f5e" stroke={INK} strokeWidth={4} /><rect x={-130} y={-190} width={260} height={30} rx={8} fill="#5a6090" stroke={INK} strokeWidth={3} />
        {[-60, 60].map((x) => <circle key={x} cx={x} cy={-174} r={12} fill="#1d1d24" stroke={INK} strokeWidth={2.4} />)}
        <rect x={-96} y={-150} width={192} height={120} rx={8} fill="#1c2036" stroke={INK} strokeWidth={3} /><circle cx={-4} cy={-212} r={0} />
        <g transform="translate(-60 -190)"><path d="M -34,0 L 34,0 L 30,-66 L -30,-66 Z" fill="#c9ccd8" stroke={INK} strokeWidth={3.2} /><rect x={-38} y={-72} width={76} height={10} rx={4} fill="#8a90b8" stroke={INK} strokeWidth={2.6} />
          {[-12, 8].map((dx, i) => <path key={i} d={`M ${dx},-80 q ${8 + 3 * Math.sin(o.t * 3 + i)},-18 0,-34 q -8,-16 3,-30`} fill="none" stroke="#fff" strokeWidth={4.4} strokeLinecap="round" opacity={0.4} />)}</g></g>
      <g transform="translate(300 830)"><rect x={-110} y={-520} width={220} height={520} rx={14} fill="#c9d4ee" stroke={INK} strokeWidth={4} /><line x1={-110} y1={-300} x2={110} y2={-300} stroke={INK} strokeWidth={4} /><rect x={80} y={-440} width={10} height={90} rx={5} fill="#8a90b8" stroke={INK} strokeWidth={2.6} /><rect x={80} y={-270} width={10} height={90} rx={5} fill="#8a90b8" stroke={INK} strokeWidth={2.6} />
        <rect x={-60} y={-470} width={46} height={60} rx={3} fill="#fbf1d2" stroke={INK} strokeWidth={2} /><rect x={-50} y={-486} width={26} height={20} rx={3} fill="#f5c542" /></g>
    </g>
  ),
  front: (
    <g transform="translate(1600 706)"><ellipse cx={0} cy={0} rx={66} ry={14} fill="#c9954a" stroke={INK} strokeWidth={3} />{[[-20, -16, '#e0455a'], [14, -18, '#f5c542'], [-2, -28, '#3f9a52']].map(([x, y, c], i) => <circle key={i} cx={x as number} cy={y as number} r={15} fill={c as string} stroke={INK} strokeWidth={2.4} />)}</g>
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

export const hospitalDetail = (): Detail => ({
  far: (
    <g>
      {[[560, '#e9ecf8'], [2640, '#f4e6d0']].map(([x, c], i) => <g key={i} transform={`translate(${x} 260)`}><rect x={-80} y={0} width={160} height={200} rx={6} fill={c as string} stroke={INK} strokeWidth={3} /><rect x={-60} y={22} width={120} height={14} fill="#8a96c8" />{[0, 1, 2, 3].map((k) => <rect key={k} x={-60} y={56 + k * 28} width={80 + (k % 2) * 20} height={8} rx={3} fill="#9a9482" opacity={0.6} />)}</g>)}
      <g transform="translate(1600 170)"><rect x={-90} y={0} width={180} height={110} rx={10} fill="#bfe0ff" stroke={INK} strokeWidth={3.4} /><path d="M -90,55 L 90,55 M 0,0 L 0,110" stroke={INK} strokeWidth={4} /></g>
    </g>
  ),
  mid: (
    <g>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${360 + i * 130} 790)`}><rect x={-50} y={-70} width={100} height={70} rx={10} fill="#4a5a8a" stroke={INK} strokeWidth={3.4} /><rect x={-50} y={-20} width={100} height={22} rx={6} fill="#5a6aa8" stroke={INK} strokeWidth={3} /><rect x={-44} y={2} width={8} height={36} fill="#2a2a38" /><rect x={36} y={2} width={8} height={36} fill="#2a2a38" /></g>)}
      <g transform="translate(2700 830)"><rect x={-90} y={-130} width={180} height={14} rx={6} fill="#c9ccd8" stroke={INK} strokeWidth={3} /><rect x={-86} y={-116} width={8} height={100} fill="#8a90b8" /><rect x={78} y={-116} width={8} height={100} fill="#8a90b8" />{[-60, 60].map((x) => <circle key={x} cx={x} cy={-6} r={14} fill="#1d1d24" stroke={INK} strokeWidth={3} />)}<rect x={-70} y={-160} width={140} height={30} rx={8} fill="#e9ecf8" stroke={INK} strokeWidth={3} /></g>
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
