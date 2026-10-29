import React from 'react';
import {INK} from './Char';
import {Glow} from './Stage';

// Sets, drawn in stage coordinates (3200 x 1080, floor at y = 830). Each set returns layers for <Stage>.
const O = {stroke: INK, strokeWidth: 6, strokeLinejoin: 'round' as const};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// ---------- the window-box planter: left half = the reader's nights, right half = the scroller's ----------
export const Planter: React.FC<{x: number; y: number; s?: number; bloom: number; thorn: number; t: number; drop?: {at: number; side: 'L' | 'R'}[]}> = ({x, y, s = 1, bloom, thorn, t, drop = []}) => {
  const weed = clamp01(thorn * 2.2), vine = clamp01((thorn - 0.12) / 0.88), g = clamp01((bloom - 0.08) / 0.92);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-190} y={0} width={380} height={64} rx={10} fill="#7a5233" {...O} />
      <rect x={-176} y={-10} width={352} height={20} rx={8} fill="#2b1d17" />
      {/* reader's half: gold seed, shoot, plant, glowing fruit */}
      {bloom > 0.001 && bloom < 0.12 && <circle cx={-90} cy={-10} r={7} fill="#ffd34e" />}
      {[0, 1, 2].map((i) => {
        const h = g * (170 + i * 50);
        if (h < 6) return null;
        const bx = -140 + i * 52, lean = (i - 1) * 26;
        return (
          <g key={i}>
            <path d={`M ${bx},-6 Q ${bx + lean * 0.4},${-h * 0.5} ${bx + lean},${-h}`} fill="none" stroke="#3f9a55" strokeWidth={9} strokeLinecap="round" />
            {[0.3, 0.55, 0.8].map((k, j) => (h > 60 ? <ellipse key={j} cx={bx + lean * k + (j % 2 ? 22 : -22)} cy={-h * k} rx={24} ry={10} fill="#63c279" stroke="#2f7a41" strokeWidth={3} transform={`rotate(${j % 2 ? -25 : 25} ${bx + lean * k} ${-h * k})`} /> : null))}
            {g > 0.55 && <circle cx={bx + lean} cy={-h - 6} r={14} fill="#ffcf5a" style={{filter: 'drop-shadow(0 0 12px #ffb300)'}} />}
          </g>
        );
      })}
      {/* scroller's half: grey seed, pale weeds, then dry vines */}
      {thorn > 0.001 && thorn < 0.08 && <circle cx={90} cy={-10} r={7} fill="#8d8f98" />}
      {weed > 0.05 && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${40 + i * 34},-6 Q ${44 + i * 34},${-50 * weed} ${34 + i * 34 + (i - 2) * 10},${-(70 + i * 8) * weed}`} fill="none" stroke="#c7cbb2" strokeWidth={4} strokeLinecap="round" />)}
      {drop.map((d, i) => {
        const p = (t - d.at) / 0.7;
        if (p < 0 || p > 1) return null;
        return <circle key={i} cx={d.side === 'L' ? -90 : 90} cy={-12 - (1 - p * p) * 220} r={8} fill={d.side === 'L' ? '#ffd34e' : '#9a9ca6'} style={d.side === 'L' ? {filter: 'drop-shadow(0 0 8px #ffc400)'} : undefined} />;
      })}
    </g>
  );
};
// the vines leave the planter and creep over the wall and bed (stage coords, drawn separately)
export const Vines: React.FC<{vine: number}> = ({vine}) => {
  const v = clamp01(vine);
  if (v <= 0.001) return null;
  const P = [
    'M 1700 640 C 1770 560, 1830 650, 1900 520 S 2110 390, 2230 290',
    'M 1720 650 C 1800 730, 1870 700, 1960 770 S 2200 800, 2400 770',
    'M 1690 630 C 1660 500, 1750 420, 1700 280 S 1770 130, 1880 80',
    'M 1830 640 C 1830 560, 1900 600, 1950 540',
  ];
  return (
    <g fill="none" strokeLinecap="round">
      {P.map((d, i) => {
        const gi = clamp01((v - i * 0.12) / (1 - i * 0.12));
        return (
          <g key={i}>
            <path d={d} pathLength={1} stroke={INK} strokeWidth={18} strokeDasharray={`${gi} 1`} />
            <path d={d} pathLength={1} stroke="#4a3f5c" strokeWidth={9} strokeDasharray={`${gi} 1`} />
            <path d={d} pathLength={1} stroke="#2b2335" strokeWidth={26} strokeDasharray={`0.004 0.032`} strokeDashoffset={0} strokeLinecap="butt" opacity={gi > 0.05 ? 1 : 0} style={{clipPath: 'none'}} />
          </g>
        );
      })}
    </g>
  );
};

const Books: React.FC<{x: number; y: number; w: number; n: number}> = ({x, y, w, n}) => {
  const C = ['#a33a3a', '#3a6aa3', '#c9a13a', '#4a8a5a', '#7a4a9a', '#d06a3a'];
  return <g>{Array.from({length: n}, (_, i) => <rect key={i} x={x + i * (w / n)} y={y - 70 - (i % 3) * 10} width={w / n - 4} height={70 + (i % 3) * 10} rx={3} fill={C[i % C.length]} {...O} strokeWidth={4} />)}</g>;
};


const Season: React.FC<{season: number; t: number; day?: boolean}> = ({season, t, day}) => (
  <g>
    <defs><clipPath id="winclip"><rect x={1410} y={216} width={360} height={390} /></clipPath></defs>
    <g clipPath="url(#winclip)">
      {season === 1 && <g><rect x={1410} y={216} width={360} height={390} fill={day ? '#8da0b8' : '#18213f'} opacity={0.85} />{Array.from({length: 46}, (_, i) => { const x = 1410 + ((i * 47 + t * 40) % 360), y = 216 + ((i * 91 + t * 700) % 390); return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 28} stroke="#cfe3ff" strokeWidth={2.5} opacity={0.75} />; })}</g>}
      {season === 2 && <g><rect x={1410} y={216} width={360} height={390} fill={day ? '#ffd9a0' : '#3a2a3a'} opacity={0.55} />{Array.from({length: 22}, (_, i) => { const x = 1410 + ((i * 53 + t * 50) % 380), y = 216 + ((i * 71 + t * 90) % 410); return <ellipse key={i} cx={x} cy={y} rx={10} ry={6} fill={['#e0762a', '#c9462a', '#e8a63a'][i % 3]} transform={`rotate(${(t * 90 + i * 40) % 360} ${x} ${y})`} />; })}</g>}
      {season === 3 && <g><rect x={1410} y={216} width={360} height={390} fill={day ? '#dfe9f5' : '#2a3558'} opacity={0.7} />{Array.from({length: 38}, (_, i) => { const x = 1410 + ((i * 41 + Math.sin(t + i) * 14 + 360) % 360), y = 216 + ((i * 67 + t * 80) % 400); return <circle key={i} cx={x} cy={y} r={3 + (i % 3)} fill="#fff" opacity={0.9} />; })}</g>}
      {season === 4 && <g><rect x={1410} y={216} width={360} height={390} fill={day ? '#c8f0d0' : '#2a4a46'} opacity={0.5} />{Array.from({length: 20}, (_, i) => { const x = 1410 + ((i * 59 + t * 40) % 380), y = 216 + ((i * 83 + t * 70) % 410); return <circle key={i} cx={x} cy={y} r={6} fill="#ffb8d0" />; })}</g>}
    </g>
  </g>
);


// THE BILL, in the room: a receipt strip runs from the nightstand over the floor, longer with every night
export const BillPile: React.FC<{n: number}> = ({n}) => {
  const v = Math.min(1, Math.max(0, n));
  if (v <= 0.02) return null;
  const d = 'M 1815 700 L 1815 800 Q 1815 826 1850 826 L 1950 820 Q 2000 816 2020 828 L 2120 826 Q 2160 826 2170 812 L 2250 804';
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <clipPath id="billclip"><rect x={1780} y={640} width={Math.max(60, 480 * v)} height={230} /></clipPath>
      <g clipPath="url(#billclip)">
        <path d={d} stroke={INK} strokeWidth={36} /><path d={d} stroke="#f4f0e6" strokeWidth={24} /><path d={d} stroke="#c0392b" strokeWidth={4} strokeDasharray="12 16" />
      </g>
      {v > 0.9 && <g><rect x={2240} y={786} width={60} height={40} rx={6} fill="#c0392b" stroke={INK} strokeWidth={5} /><rect x={2250} y={800} width={40} height={6} rx={3} fill="#fff" opacity={0.8} /></g>}
    </g>
  );
};
// THE REWARD, in the room: gold stars on the reader's wall, and a trophy once it is earned
export const RewardWall: React.FC<{n: number}> = ({n}) => {
  const k = Math.round(Math.min(1, Math.max(0, n)) * 5);
  if (k <= 0) return null;
  return (
    <g>
      {Array.from({length: k}, (_, i) => <path key={i} transform={`translate(${590 + i * 74} 86)`} d="M 0,-26 L 8,-8 L 28,-6 L 13,8 L 18,28 L 0,18 L -18,28 L -13,8 L -28,-6 L -8,-8 Z" fill="#ffcf5a" stroke={INK} strokeWidth={4} strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 10px #ffb300)'}} />)}
      {n > 0.85 && <g transform="translate(150 246)"><path d="M -26,-44 L 26,-44 L 22,0 Q 0,16 -22,0 Z" fill="#ffcf5a" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={-6} y={4} width={12} height={22} fill="#caa13a" /><rect x={-26} y={24} width={52} height={12} rx={4} fill="#caa13a" stroke={INK} strokeWidth={4} /></g>}
    </g>
  );
};

// ================================ BEDROOM ================================
export type BedOpts = {day?: boolean; t: number; bloom: number; thorn: number; reader?: boolean; bookOnArm?: boolean; drop?: {at: number; side: 'L' | 'R'}[]; vines?: number; glowS?: number; glowR?: number; season?: number; books?: number; notes?: number; clutter?: number};
export const bedroom = (o: BedOpts) => {
  const {day, t, bloom, thorn, glowS = 1, glowR = 1, drop} = o;
  const far = (
    <g>
      <defs>
        <linearGradient id="wN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3262" /><stop offset="1" stopColor="#171c3b" /></linearGradient>
        <linearGradient id="wD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6dcb6" /><stop offset="1" stopColor="#e5c093" /></linearGradient>
        <linearGradient id="skyN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0e1642" /><stop offset="1" stopColor="#35457f" /></linearGradient>
        <linearGradient id="skyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fd0ff" /><stop offset="1" stopColor="#ffe8c4" /></linearGradient>
        <linearGradient id="flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={day ? '#9a6f4c' : '#4d392f'} /><stop offset="1" stopColor={day ? '#6f4d34' : '#2b211d'} /></linearGradient>
      </defs>
      <rect x={-400} y={-700} width={4000} height={1530} fill={day ? "url(#wD)" : "url(#wN)"} />
      <rect x={-400} y={830} width={4000} height={800} fill="url(#flr)" />
      <rect x={-400} y={812} width={4000} height={22} fill={day ? '#d9b78c' : '#20253f'} />
      {/* window */}
      <rect x={1390} y={196} width={400} height={430} rx={10} fill={day ? '#c9a574' : '#1b2142'} {...O} />
      <rect x={1410} y={216} width={360} height={390} fill={day ? 'url(#skyD)' : 'url(#skyN)'} />
      {o.season ? <Season season={o.season} t={t} day={day} /> : null}
      {!day && !o.season && <circle cx={1660} cy={310} r={38} fill="#eef2ff" style={{filter: 'drop-shadow(0 0 24px #cdd7ff)'}} />}
      {day && <circle cx={1650} cy={320} r={46} fill="#fff6d6" style={{filter: 'drop-shadow(0 0 30px #ffe9a0)'}} />}
      <path d="M 1410 560 L 1410 500 L 1450 500 L 1450 470 L 1500 470 L 1500 520 L 1550 520 L 1550 440 L 1600 440 L 1600 510 L 1660 510 L 1660 480 L 1710 480 L 1710 540 L 1770 540 L 1770 606 L 1410 606 Z" fill={day ? '#9fb0c8' : '#0d1233'} />
      <rect x={1586} y={216} width={8} height={390} fill={day ? '#c9a574' : '#1b2142'} />
      <rect x={1410} y={400} width={360} height={8} fill={day ? '#c9a574' : '#1b2142'} />
      <rect x={1330} y={180} width={100} height={470} rx={12} fill={day ? '#d9a0a0' : '#5b3f7a'} {...O} />
      <rect x={1750} y={180} width={100} height={470} rx={12} fill={day ? '#d9a0a0' : '#5b3f7a'} {...O} />
      <rect x={2860} y={260} width={200} height={260} rx={6} fill={day ? '#f4e6cc' : '#2e3558'} {...O} />
      <circle cx={2960} cy={380} r={52} fill={day ? '#e9a96a' : '#4a5690'} />
      <path d="M 2890 480 L 2960 410 L 3030 480 Z" fill={day ? '#c27b4d' : '#38426e'} />
      <ellipse cx={1600} cy={980} rx={950} ry={74} fill={day ? '#d98f8f' : '#5b4670'} opacity={0.8} />
      {/* string lights along the wall */}
      <path d="M 120 130 Q 700 220 1300 120 T 2500 150 T 3100 120" fill="none" stroke={day ? '#b99a72' : '#0f1330'} strokeWidth={4} />
      {Array.from({length: 22}, (_, i) => { const x = 140 + i * 140, y = 150 + Math.sin(i * 0.9) * 40; return <circle key={i} cx={x} cy={y} r={9} fill={day ? '#fff3c4' : '#ffd27a'} opacity={day ? 0.6 : 0.95} style={{filter: 'drop-shadow(0 0 14px #ffc46b)'}} />; })}
    </g>
  );
  // furniture in PROFILE, like a cutaway: the armchair on the left faces right, the bed on the right has its headboard at the far end
  const mid = (
    <g>
      <rect x={20} y={250} width={260} height={580} rx={8} fill="#654630" {...O} />
      {[330, 500, 670, 800].map((y, i) => <Books key={i} x={36} y={y} w={228} n={5 + (i % 2)} />)}
      {/* finished books: two stacks by the shelf, growing with the days */}
      {(o.books ?? 0) > 0 && Array.from({length: Math.min(20, o.books ?? 0)}, (_, i) => { const st = i % 2, lv = Math.floor(i / 2); return <rect key={'bk' + i} x={st ? 176 + (lv % 2) * 6 : 56 + (lv % 2) * -4} y={830 - 26 * (lv + 1)} width={116 - (lv % 3) * 8} height={24} rx={4} fill={['#a33a3a', '#3a6aa3', '#c9a13a', '#4a8a5a', '#7a4a9a', '#d06a3a'][i % 6]} {...O} strokeWidth={4} />; })}
      {(o.notes ?? 0) > 0 && Array.from({length: Math.min(14, o.notes ?? 0)}, (_, i) => <g key={'nt' + i} transform={`rotate(${((i * 37) % 9) - 4} ${580 + (i % 5) * 72} ${160 + Math.floor(i / 5) * 70})`}><rect x={560 + (i % 5) * 72} y={140 + Math.floor(i / 5) * 70} width={58} height={58} rx={4} fill={['#ffe36b', '#ff9fb5', '#9fe3ff', '#b5f08a'][i % 4]} {...O} strokeWidth={3} /><rect x={570 + (i % 5) * 72} y={158 + Math.floor(i / 5) * 70} width={36} height={6} rx={3} fill="#6b6350" opacity={0.6} /><rect x={570 + (i % 5) * 72} y={172 + Math.floor(i / 5) * 70} width={28} height={6} rx={3} fill="#6b6350" opacity={0.6} /></g>)}
      {(o.clutter ?? 0) > 0.1 && <g>
        <path d="M 1790 832 L 1800 800 L 1850 800 L 1860 832 Z" fill="#e8e2d4" {...O} strokeWidth={4} />
        {(o.clutter ?? 0) > 0.3 && <circle cx={1960} cy={816} r={16} fill="#d9d2c4" {...O} strokeWidth={4} />}
        {(o.clutter ?? 0) > 0.5 && <path d="M 1660 832 L 1672 790 L 1760 786 L 1752 832 Z" fill="#d94a4a" {...O} strokeWidth={4} />}
        {(o.clutter ?? 0) > 0.7 && <rect x={1880} y={806} width={110} height={26} rx={4} fill="#caa13a" {...O} strokeWidth={4} />}
      </g>}
      {/* potted plant */}
      <path d="M 1220 830 L 1240 740 L 1330 740 L 1350 830 Z" fill="#b0603a" {...O} />
      {[-60, -20, 20, 60].map((a, i) => <path key={i} d={`M 1285 745 Q ${1285 + a * 1.6} ${640 - (i % 2) * 40} ${1285 + a * 2.4} ${600 + (i % 2) * 30}`} fill="none" stroke={day ? '#4f9a5a' : '#2c6a46'} strokeWidth={20} strokeLinecap="round" />)}
      {/* floor lamp */}
      <rect x={1065} y={420} width={30} height={410} fill="#2e2e34" {...O} />
      <path d="M 1000 420 L 1160 420 L 1130 330 L 1030 330 Z" fill="#ffc46b" {...O} />
      <ellipse cx={1080} cy={832} rx={80} ry={16} fill="#2e2e34" />
      {/* armchair */}
      <rect x={436} y={750} width={34} height={82} rx={8} fill="#4d2d19" {...O} />
      <rect x={806} y={750} width={34} height={82} rx={8} fill="#4d2d19" {...O} />
      <path d="M 414 700 L 438 360 Q 446 322 492 320 Q 540 322 534 366 L 526 700 Z" fill="#8a5535" {...O} />
      <path d="M 452 640 L 466 380 Q 474 352 500 352 Q 516 356 512 384 L 506 640 Z" fill="#9b6340" />
      <rect x={424} y={684} width={430} height={80} rx={20} fill="#744429" {...O} />
      <rect x={430} y={628} width={430} height={74} rx={30} fill="#b87444" {...O} />
      <path d="M 460 640 Q 640 622 840 640" fill="none" stroke="#d29265" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      {o.bookOnArm && <g transform="translate(640 504) rotate(-8)"><rect x={-64} y={-26} width={128} height={30} rx={6} fill="#2f6f5e" {...O} strokeWidth={5} /><rect x={-52} y={-18} width={104} height={8} rx={3} fill="#f1e8d0" /></g>}
      {/* bed */}
      <rect x={1990} y={756} width={34} height={76} rx={8} fill="#3d2d24" {...O} />
      <rect x={2890} y={756} width={34} height={76} rx={8} fill="#3d2d24" {...O} />
      <rect x={1960} y={696} width={1000} height={70} rx={14} fill="#5a4436" {...O} />
      <rect x={2896} y={300} width={96} height={532} rx={18} fill="#5a4436" {...O} />
      <rect x={1972} y={630} width={930} height={74} rx={32} fill="#e2dfd8" {...O} />
      <rect x={2660} y={540} width={230} height={104} rx={46} fill="#f6f4ee" {...O} />
      <rect x={2700} y={470} width={190} height={96} rx={42} fill="#ece9e1" {...O} />
      {/* nightstand + clock */}
      <rect x={1730} y={640} width={170} height={190} rx={8} fill="#5a4436" {...O} />
      <rect x={1750} y={600} width={130} height={50} rx={10} fill="#202028" {...O} />
      <text x={1815} y={638} fontFamily="monospace" fontWeight={700} fontSize={34} fill="#ff3b30" textAnchor="middle" style={{filter: 'drop-shadow(0 0 8px #ff3b30)'}}>11:40</text>
      <RewardWall n={bloom} />
      <BillPile n={Math.max(o.vines ?? 0, thorn)} />
      {!day && <Glow x={1080} y={430} r={640} color="#ffb25a" o={0.7 * glowR} />}
      {!day && <Glow x={2500} y={400} r={560} color="#4aa8ff" o={0.75 * glowS} />}
      {day && <Glow x={1600} y={420} r={900} color="#ffe2a8" o={0.55} />}
    </g>
  );
  const front = (
    <g>
      {/* the chair's near armrest and the scroller's blanket come in front of the bodies */}
      <rect x={520} y={582} width={160} height={118} rx={14} fill="#744429" {...O} />
      <rect x={496} y={520} width={256} height={74} rx={30} fill="#8a5535" {...O} />
      <path d="M 1990 706 Q 2060 566 2210 560 Q 2380 548 2500 616 Q 2570 650 2580 706 Z" fill="#46669a" {...O} />
      <path d="M 2090 640 Q 2110 680 2090 706 M 2250 584 Q 2280 640 2250 706 M 2400 596 Q 2440 650 2420 706" fill="none" stroke="#35507d" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
  const fg = (
    <g>
      <path d="M -60 1080 Q 40 780 220 700 Q 120 860 150 1080 Z" fill="#1a2a2a" />
      <path d="M 3260 1080 Q 3160 800 2990 740 Q 3090 880 3040 1080 Z" fill="#1a2a2a" />
    </g>
  );
  return {far, mid, front, fg};
};

// ================================ BUS (night) ================================
export const bus = (t: number) => {
  const col = ['#ffd36b', '#fff3c2', '#ff6b5e', '#9fd0ff'];
  const far = (
    <g>
      <rect x={-400} y={-200} width={4000} height={1500} fill="#0b1026" />
      <rect x={160} y={190} width={2880} height={400} rx={30} fill="#0d1535" />
      {[0, 1, 2].map((layer) => Array.from({length: 26}, (_, i) => {
        const sp = 90 + layer * 160, x = (((i * 190 + 40 * layer) - t * sp) % 3100 + 3100) % 3100 + 120;
        const h = 60 + ((i * 53 + layer * 31) % 140);
        return <rect key={layer + '-' + i} x={x} y={590 - h - layer * 14} width={50 + (i % 3) * 20} height={h} fill={layer === 0 ? '#121a3f' : layer === 1 ? '#18224e' : '#1f2b60'} />;
      }))}
      {Array.from({length: 40}, (_, i) => {
        const sp = 420 + (i % 4) * 90, x = (((i * 131) - t * sp) % 3100 + 3100) % 3100 + 120;
        return <circle key={i} cx={x} cy={300 + ((i * 47) % 260)} r={5 + (i % 3) * 3} fill={col[i % 4]} style={{filter: `drop-shadow(0 0 10px ${col[i % 4]})`}} />;
      })}
    </g>
  );
  const mid = (
    <g>
      <rect x={-400} y={590} width={4000} height={300} fill="#1a2145" />
      <rect x={160} y={160} width={2880} height={36} fill="#2a335f" />
      {[300, 1000, 1700, 2400, 3000].map((x, i) => <rect key={i} x={x} y={160} width={30} height={460} fill="#1d2548" />)}
      <rect x={160} y={188} width={2880} height={14} fill="#9aa7d8" opacity={0.7} />
      {[620, 1420, 2220].map((x, i) => <g key={i}><rect x={x} y={202} width={6} height={90} fill="#9aa7d8" /><rect x={x - 14} y={286} width={34} height={14} rx={7} fill="#c8d0f0" /></g>)}
      {/* seats in profile: the reader's row, the row in front of him, and two rows of passengers further back */}
      {[1060, 1990, 2590].map((x, i) => (
        <g key={i}>
          <path d={`M ${x} 760 L ${x + 14} 450 Q ${x + 22} 424 ${x + 56} 424 Q ${x + 92} 428 ${x + 84} 462 L ${x + 80} 760 Z`} fill="#2c3768" stroke={INK} strokeWidth={6} />
          <rect x={x + 6} y={702} width={400} height={64} rx={20} fill="#3a4682" stroke={INK} strokeWidth={6} />
          <rect x={x + 60} y={766} width={34} height={92} fill="#1d2548" />
        </g>
      ))}
      <g><path d="M 1620 760 L 1634 450 Q 1642 424 1676 424 Q 1712 428 1704 462 L 1700 760 Z" fill="#2c3768" stroke={INK} strokeWidth={6} /></g>
      <Glow x={2300} y={560} r={420} color="#4aa8ff" o={0.5} />
      <Glow x={2900} y={560} r={420} color="#4aa8ff" o={0.4} />
      <Glow x={1300} y={500} r={560} color="#ffd9a0" o={0.5} />
    </g>
  );
  const front = <g><rect x={-100} y={850} width={3600} height={300} fill="#232c58" stroke={INK} strokeWidth={6} /></g>;
  const fg = <g><rect x={-80} y={930} width={3400} height={400} fill="#0d1230" /></g>;
  return {far, mid, front, fg};
};

// ================================ KITCHEN / BATHROOM (day) ================================
export const kitchen = () => {
  const far = (
    <g>
      <rect x={-400} y={-200} width={4000} height={1100} fill="#f2e2c0" />
      <rect x={1250} y={180} width={500} height={420} rx={10} fill="#c9a574" {...O} />
      <rect x={1270} y={200} width={460} height={380} fill="#bfe0ff" />
      <circle cx={1650} cy={300} r={44} fill="#fff6d6" />
      <rect x={300} y={90} width={760} height={300} rx={12} fill="#c98a5a" {...O} />
      <rect x={2050} y={90} width={760} height={300} rx={12} fill="#c98a5a" {...O} />
      {[0, 1, 2].map((i) => <rect key={i} x={320 + i * 250} y={110} width={230} height={260} rx={8} fill="#d9a070" stroke="#a96d3d" strokeWidth={4} />)}
      {[0, 1, 2].map((i) => <rect key={i} x={2070 + i * 250} y={110} width={230} height={260} rx={8} fill="#d9a070" stroke="#a96d3d" strokeWidth={4} />)}
      <rect x={-400} y={830} width={4000} height={300} fill="#a67c52" />
    </g>
  );
  const mid = (
    <g>
      <rect x={200} y={560} width={2800} height={280} rx={10} fill="#e7d6b4" {...O} />
      <rect x={200} y={540} width={2800} height={40} fill="#8b6f4a" {...O} />
      <rect x={2500} y={280} width={260} height={560} rx={16} fill="#dfe6ee" {...O} />
      <Glow x={1600} y={420} r={900} color="#ffe2a8" o={0.5} />
    </g>
  );
  const front = (
    <g>
      <rect x={900} y={800} width={1500} height={60} rx={14} fill="#b98a58" {...O} />
      <rect x={960} y={860} width={50} height={230} fill="#8b6f4a" {...O} />
      <rect x={2290} y={860} width={50} height={230} fill="#8b6f4a" {...O} />
    </g>
  );
  return {far, mid, front, fg: <g />};
};
export const bathroom = () => {
  const far = (
    <g>
      <rect x={-400} y={-200} width={4000} height={1100} fill="#bfd9e0" />
      {Array.from({length: 24}, (_, i) => <line key={i} x1={i * 150} y1={-200} x2={i * 150} y2={830} stroke="#a3c4cd" strokeWidth={4} />)}
      {Array.from({length: 8}, (_, i) => <line key={i} x1={-400} y1={i * 130} x2={3600} y2={i * 130} stroke="#a3c4cd" strokeWidth={4} />)}
      <rect x={-400} y={830} width={4000} height={300} fill="#8fb0b9" />
    </g>
  );
  const mid = (
    <g>
      <rect x={1300} y={150} width={460} height={520} rx={20} fill="#e8f4f8" {...O} />
      <rect x={1320} y={170} width={420} height={480} rx={14} fill="#cfe7ee" />
      <path d="M 1360 260 L 1460 190 M 1400 400 L 1560 250" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.7} />
      <Glow x={1530} y={360} r={800} color="#e8fbff" o={0.45} />
    </g>
  );
  const front = (
    <g>
      <rect x={1050} y={790} width={960} height={70} rx={16} fill="#f4f1ea" {...O} />
      <rect x={1100} y={860} width={860} height={230} rx={12} fill="#d9d2c4" {...O} />
    </g>
  );
  return {far, mid, front, fg: <g />};
};
