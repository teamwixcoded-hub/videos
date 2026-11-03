import React from 'react';
import {InsertBG} from '../same2d/inserts';
import {ramp} from '../same2d/fx';
import {DIGI, MONT} from '../same2d/theme';
import {Frame, Fig, ManP, Txt, Chip, Pill, OfficeBG, DinnerBG} from '../overthinking/scenes';
import {INK, Car, Truck, Wheel, Coins, BankCard, Jar, PhoneBank, shadeC} from './props';
export {Frame, Fig, Txt, Chip, Pill, OfficeBG, DinnerBG, InsertBG};
export type {ManP};

// ============================================================================================
// LOOK RICH vs RICH: scenery and small props for the rest of the film. Every background is drawn in 1920 x 1080; vehicles stand on y = ground.
// ============================================================================================
export const Dusk: React.FC<{t?: number; kind?: 'road' | 'lot' | 'street'; speed?: number}> = ({t = 0, kind = 'road', speed = 0}) => (
  <g>
    <defs><linearGradient id="dsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141a40" /><stop offset="0.55" stopColor="#4a3f7a" /><stop offset="1" stopColor="#f0a86a" /></linearGradient></defs>
    <rect width={1920} height={720} fill="url(#dsk)" />
    {Array.from({length: 40}, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 300} r={1 + (i % 3)} fill="#fff" opacity={0.5} />)}
    {kind !== 'lot' && Array.from({length: 14}, (_, i) => { const h = 120 + ((i * 53) % 220), x = i * 150 - 40; return <g key={i}><rect x={x} y={720 - h} width={120} height={h} fill="#1b1f3c" /><g fill="#ffe9a0" opacity={0.6}>{Array.from({length: 6}, (_, j) => <rect key={j} x={x + 16 + (j % 2) * 52} y={720 - h + 18 + Math.floor(j / 2) * 40} width={30} height={20} />)}</g></g>; })}
    {kind === 'lot' && <g><rect x={0} y={180} width={1920} height={540} fill="#2b3566" /><rect y={640} width={1920} height={80} fill="#1b2146" />{Array.from({length: 4}, (_, r) => Array.from({length: 9}, (_, c) => <rect key={r + '-' + c} x={60 + c * 210} y={230 + r * 100} width={150} height={66} rx={6} fill="#ffe9a0" opacity={0.55} />))}</g>}
    <rect y={720} width={1920} height={360} fill="#23263a" /><rect y={716} width={1920} height={12} fill="#3a3f66" />
    {kind === 'road' && Array.from({length: 9}, (_, i) => <rect key={i} x={((i * 260 - t * speed) % 2340 + 2340) % 2340 - 200} y={906} width={150} height={12} rx={4} fill="#e8eaf8" opacity={0.8} />)}
    {kind === 'lot' && Array.from({length: 9}, (_, i) => <path key={i} d={`M ${i * 230 + 40},760 L ${i * 230 - 10},1040`} stroke="#e8eaf8" strokeWidth={6} opacity={0.5} />)}
  </g>
);
export const Showroom: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs><linearGradient id="shw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#10142e" /><stop offset="1" stopColor="#1d2552" /></linearGradient><linearGradient id="shf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b3166" /><stop offset="1" stopColor="#0c1030" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#shw)" /><rect y={760} width={1920} height={320} fill="url(#shf)" /><rect y={752} width={1920} height={12} fill="#4a5090" />
    {[0, 1, 2].map((i) => <rect key={i} x={120 + i * 620} y={130} width={460} height={500} rx={10} fill="#27346a" stroke={INK} strokeWidth={8} opacity={0.7} />)}
    {[420, 960, 1500].map((x, i) => <polygon key={i} points={`${x - 40},0 ${x + 40},0 ${x + 240},780 ${x - 240},780`} fill="#fff6d0" opacity={0.07 + 0.02 * Math.sin(t * 2 + i)} />)}
    <rect x={1380} y={30} width={440} height={70} rx={14} fill="#12152a" stroke="#ffd23f" strokeWidth={6} /><Txt x={1600} y={82} s={44} c="#ffd23f" ls={6}>AUTO SALES</Txt>
  </g>
);
export const Kitchen: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#24305c" />{Array.from({length: 16}, (_, i) => <path key={i} d={`M ${i * 128},0 L ${i * 128},640`} stroke="#1c2750" strokeWidth={4} />)}{Array.from({length: 6}, (_, i) => <path key={i} d={`M 0,${i * 110} L 1920,${i * 110}`} stroke="#1c2750" strokeWidth={4} />)}
    <rect y={640} width={1920} height={440} fill="#171c3a" /><rect y={630} width={1920} height={26} fill="#6a4a3a" stroke={INK} strokeWidth={6} />
    <rect x={1380} y={250} width={360} height={380} rx={14} fill="#3a406a" stroke={INK} strokeWidth={8} /><rect x={1410} y={290} width={300} height={200} rx={8} fill="#1b2146" /><g opacity={0.9}>{[0, 1].map((i) => <ellipse key={i} cx={1480 + i * 160} cy={600} rx={56} ry={14} fill="#12152a" stroke={INK} strokeWidth={5} />)}</g>
    {[0, 1, 2].map((i) => <path key={i} d={`M ${1470 + i * 70},560 q -14,-34 0,-68`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.25 + 0.2 * Math.sin(t * 3 + i)} />)}
  </g>
);
export const Backyard: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="url(#dsk)" /><rect width={1920} height={760} fill="#2a2f66" />
    {Array.from({length: 24}, (_, i) => <rect key={i} x={i * 84} y={380} width={70} height={380} fill="#6a4a3a" stroke={INK} strokeWidth={5} />)}
    <rect y={760} width={1920} height={320} fill="#2a4a3a" />
    {Array.from({length: 20}, (_, i) => { const x = i * 100 + 20, y = 130 + Math.sin(i * 0.8) * 34; return <g key={i}><circle cx={x} cy={y} r={30} fill="#ffd23f" opacity={0.14 + 0.06 * Math.sin(t * 4 + i)} /><circle cx={x} cy={y} r={9} fill="#ffe9a0" stroke={INK} strokeWidth={3} /></g>; })}
    <g transform="translate(1600 700)"><rect x={-90} y={-70} width={180} height={90} rx={14} fill="#2b2e44" stroke={INK} strokeWidth={8} /><rect x={-80} y={20} width={14} height={110} fill="#1b1d30" /><rect x={66} y={20} width={14} height={110} fill="#1b1d30" />{[0, 1, 2].map((i) => <path key={i} d={`M ${-30 + i * 30},-80 q -16,-40 0,-80`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.3 + 0.2 * Math.sin(t * 3 + i)} />)}</g>
  </g>
);
export const Garage: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#2a2d44" /><rect y={780} width={1920} height={300} fill="#1a1c2e" />{Array.from({length: 8}, (_, i) => <path key={i} d={`M ${i * 260},0 L ${i * 260},780`} stroke="#242742" strokeWidth={6} />)}
    <rect x={160} y={210} width={420} height={260} rx={10} fill="#3a3f66" stroke={INK} strokeWidth={8} />{Array.from({length: 7}, (_, i) => <rect key={i} x={190 + i * 52} y={250} width={22} height={90 + (i % 3) * 20} rx={6} fill={['#ffd23f', '#ff6a6a', '#6fa0ff'][i % 3]} stroke={INK} strokeWidth={3} />)}
    <rect x={1540} y={160} width={260} height={150} rx={12} fill="#12152a" stroke="#ff9a3a" strokeWidth={6} /><Txt x={1670} y={252} s={56} c="#ff9a3a" ls={4}>GARAGE</Txt>
  </g>
);

// ---------------- small props ----------------
export const Box: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><path d="M -110,-50 L 110,-50 L 120,90 L -120,90 Z" fill="#c9a06a" stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M -110,-50 L -80,-90 L 80,-90 L 110,-50 Z" fill="#dcb67e" stroke={INK} strokeWidth={7} strokeLinejoin="round" /><rect x={-26} y={-90} width={52} height={40} fill="#e8d4a8" opacity={0.8} /><path d="M -90,20 L 90,20" stroke="#8a6a3a" strokeWidth={4} opacity={0.5} /></g>
);
export const Flatbed: React.FC<{x?: number; y?: number; scale?: number; spin?: number; load?: boolean; flip?: boolean; blink?: number}> = ({x = 0, y = 0, scale = 1, spin = 0, load = true, flip, blink = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <ellipse cx={0} cy={2} rx={420} ry={18} fill="#000" opacity={0.4} style={{filter: 'blur(7px)'}} />
    <rect x={-400} y={-92} width={520} height={34} rx={8} fill="#8a90a8" stroke={INK} strokeWidth={7} /><rect x={-396} y={-58} width={512} height={14} fill="#4a4f66" />
    {load && <Truck x={-170} y={-92} scale={0.8} color="#23253a" />}
    <path d="M 130,-46 L 130,-170 L 190,-170 L 240,-250 L 340,-250 L 400,-160 L 410,-46 Z" fill="#f08a2a" stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M 196,-176 L 242,-238 L 330,-238 L 372,-176 Z" fill="#4a6aa8" stroke={INK} strokeWidth={5} /><path d="M 130,-130 L 410,-130" stroke="#fff" strokeWidth={8} opacity={0.3} />
    <rect x={226} y={-282} width={100} height={30} rx={8} fill={blink > 0.5 ? '#ffb000' : '#7a5a10'} stroke={INK} strokeWidth={5} />
    <Wheel x={-300} y={-46} r={48} spin={spin} /><Wheel x={-150} y={-46} r={48} spin={spin} /><Wheel x={280} y={-46} r={52} spin={spin} />
  </g>
);
export const Contract: React.FC<{t: number; sign: number; lines: string[]}> = ({t, sign, lines}) => {
  const k = ramp(t, sign, sign + 1.0), len = 330;
  return (
    <g>
      <rect x={-340} y={-420} width={680} height={840} rx={14} fill="#f8f4e8" stroke={INK} strokeWidth={10} />
      <Txt x={0} y={-340} s={54} c="#2a2f6a" ls={4}>LOAN AGREEMENT</Txt>
      {lines.map((l, i) => <Txt key={i} x={-290} y={-240 + i * 90} s={i === lines.length - 1 ? 60 : 46} anchor="start" c={i === lines.length - 1 ? '#d8403b' : '#2a2f6a'}>{l}</Txt>)}
      <path d="M -290,300 L 230,300" stroke="#8a8fb0" strokeWidth={5} /><Txt x={-290} y={350} s={30} anchor="start" c="#8a8fb0">SIGN HERE</Txt>
      <path d="M -270,290 C -230,230 -200,330 -160,260 C -130,210 -110,300 -70,270 C -40,250 -20,300 40,270 C 80,250 120,290 190,262" stroke="#1b3aa8" strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={len * 1.6} strokeDashoffset={len * 1.6 * (1 - k)} />
    </g>
  );
};
export const Calc: React.FC<{lines: string[]; result?: string}> = ({lines, result}) => (
  <g>
    <rect x={-210} y={-330} width={420} height={660} rx={44} fill="#2a2f4a" stroke={INK} strokeWidth={9} />
    <rect x={-176} y={-296} width={352} height={170} rx={16} fill="#0b1226" stroke={INK} strokeWidth={5} />
    {lines.map((l, i) => <text key={i} x={160} y={-244 + i * 44} textAnchor="end" fontFamily={DIGI} fontWeight={600} fontSize={34} fill="#6fa0ff" opacity={0.8}>{l}</text>)}
    {result && <text x={160} y={-150} textAnchor="end" fontFamily={DIGI} fontWeight={700} fontSize={64} fill="#ffd23f" style={{filter: 'drop-shadow(0 0 8px #ffb000)'}}>{result}</text>}
    {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => <rect key={r + '' + c} x={-176 + c * 92} y={-96 + r * 92} width={78} height={76} rx={18} fill={c === 3 ? '#ff9a3a' : '#3a4066'} stroke={INK} strokeWidth={4} />))}
  </g>
);
export const Gauge: React.FC<{v: number; label: string}> = ({v, label}) => {
  const a = -120 + 240 * v;
  return (
    <g>
      <path d="M -200,100 A 240 240 0 1 1 200,100" stroke="#2a2f6a" strokeWidth={46} fill="none" strokeLinecap="round" /><path d="M -200,100 A 240 240 0 1 1 200,100" stroke={v > 0.6 ? '#3ddc84' : v > 0.35 ? '#ffd23f' : '#ff4a5e'} strokeWidth={46} fill="none" strokeLinecap="round" strokeDasharray={`${v * 1130} 2000`} />
      <g transform={`rotate(${a} 0 0)`}><path d="M -10,0 L 0,-190 L 10,0 Z" fill="#fff" stroke={INK} strokeWidth={5} /></g><circle r={26} fill="#e8eafb" stroke={INK} strokeWidth={6} />
      <Txt x={0} y={170} s={52}>{label}</Txt>
    </g>
  );
};
export const BarsG: React.FC<{t: number; bars: {label: string; v: number; c: string; at: number}[]; max: number; w?: number; h?: number}> = ({t, bars, max, w = 1200, h = 500}) => (
  <g transform={`translate(${-w / 2} ${h / 2})`}>
    <path d={`M 0,0 L ${w},0`} stroke="#3a4070" strokeWidth={6} />
    {bars.map((b, i) => { const k = ramp(t, b.at, b.at + 0.6), bh = (Math.abs(b.v) / max) * h * k, bw = Math.min(200, w / bars.length - 40), x = (i + 0.5) * (w / bars.length); return <g key={i}><rect x={x - bw / 2} y={b.v >= 0 ? -bh : 0} width={bw} height={bh} rx={14} fill={b.c} stroke={INK} strokeWidth={7} /><Txt x={x} y={b.v >= 0 ? -bh - 26 : bh + 60} s={46} o={k}>{b.label}</Txt></g>; })}
  </g>
);
export {Car, Truck, Wheel, Coins, BankCard, Jar, PhoneBank, shadeC, MONT};
