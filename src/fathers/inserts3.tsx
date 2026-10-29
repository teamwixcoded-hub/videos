import React from 'react';
import {AbsoluteFill} from 'remotion';
import {INK, UI, SERIF, HAND} from './theme';
import {InsertBG} from './inserts';
import {ramp, rnd} from './fx';
import {shade} from './People';

// ============================================================================================
// Inserts for the second version of the story: the watch, the newspaper gift, the fork in the road, seats and money, a block tower.
// ============================================================================================
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// the watch: leather strap, a gold case, a cream face, a second hand that ticks. unwrapAt: seconds until the newspaper comes off (-1 = no paper)
export const WatchInsert: React.FC<{t: number; unwrapAt?: number; zoom?: number}> = ({t, unwrapAt = -1, zoom = 1}) => {
  const paper = unwrapAt >= 0 ? 1 - ramp(t, unwrapAt, unwrapAt + 0.7) : 0, sec = Math.floor(t * 2) * 3, min = 10 * 6 + t * 0.2, hr = 10 * 30 + 8 + t * 0.02;
  return (
    <InsertBG tone="warm">
      <g transform={`translate(960 540) scale(${zoom * (1 + t * 0.012)})`}>
        <defs>
          <radialGradient id="wcase" cx="0.35" cy="0.3"><stop offset="0" stopColor="#ffe9a0" /><stop offset="0.6" stopColor="#f2c14e" /><stop offset="1" stopColor="#b8862a" /></radialGradient>
          <linearGradient id="wstrap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2f1c" /><stop offset="0.5" stopColor="#7a4e2c" /><stop offset="1" stopColor="#4a2f1c" /></linearGradient>
        </defs>
        <g opacity={1 - paper}>
          <rect x={-120} y={-470} width={240} height={420} rx={26} fill="url(#wstrap)" stroke={INK} strokeWidth={6} /><rect x={-120} y={50} width={240} height={420} rx={26} fill="url(#wstrap)" stroke={INK} strokeWidth={6} />
          {[-390, -320, 330, 400].map((y) => <circle key={y} cx={0} cy={y} r={8} fill="#2a1a10" />)}
          <circle r={250} fill="url(#wcase)" stroke={INK} strokeWidth={8} /><circle r={206} fill="#fbf1d2" stroke={INK} strokeWidth={5} />
          {Array.from({length: 12}, (_, i) => <line key={i} x1={0} y1={-190} x2={0} y2={i % 3 === 0 ? -150 : -168} stroke={INK} strokeWidth={i % 3 === 0 ? 10 : 5} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={10} x2={0} y2={-100} stroke={INK} strokeWidth={14} strokeLinecap="round" transform={`rotate(${hr})`} />
          <line x1={0} y1={14} x2={0} y2={-160} stroke={INK} strokeWidth={9} strokeLinecap="round" transform={`rotate(${min})`} />
          <line x1={0} y1={30} x2={0} y2={-180} stroke="#c0392b" strokeWidth={4} strokeLinecap="round" transform={`rotate(${sec})`} /><circle r={12} fill={INK} />
          <path d="M -150,-120 Q -60,-210 60,-196" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.4} />
        </g>
        {paper > 0 && <g opacity={paper} transform={`rotate(${(1 - paper) * 14}) scale(${1 + (1 - paper) * 0.2})`}>
          <rect x={-360} y={-300} width={720} height={600} rx={14} fill="#e4dfd0" stroke={INK} strokeWidth={6} />
          {Array.from({length: 22}, (_, i) => <rect key={i} x={-330 + (i % 2) * 8} y={-270 + i * 26} width={640 - (i % 4) * 60} height={9} rx={3} fill="#9a9482" opacity={0.7} />)}
          <rect x={-360} y={-44} width={720} height={36} fill="#c9b8a0" opacity={0.5} /><path d="M -360,-26 L 360,-26" stroke="#8a6e4a" strokeWidth={6} /><path d="M 0,-300 L 0,300" stroke="#8a6e4a" strokeWidth={6} />
          <text x={0} y={-200} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={74} fill="#5a5448" opacity={0.7}>THE DAILY NEWS</text>
        </g>}
      </g>
    </InsertBG>
  );
};

// the same promise, two ways: a road that forks, MONEY one way, TIME the other
export const Fork: React.FC<{t: number}> = ({t}) => {
  const k = ramp(t, 0.3, 2.4), a = ramp(t, 1.6, 4.4);
  const L = 'M 960,1060 L 960,700 C 960,560 700,520 520,260', R = 'M 960,1060 L 960,700 C 960,560 1220,520 1400,260';
  const pt = (side: -1 | 1, p: number): [number, number] => { const y = lerp(1000, 300, p); const bend = Math.pow(Math.max(0, (p - 0.35) / 0.65), 1.6); return [960 + side * bend * (side < 0 ? 440 : 440), y]; };
  return (
    <InsertBG tone="dark">
      <g strokeLinecap="round" fill="none">
        <path d={L} stroke="#2b3156" strokeWidth={120} strokeDasharray="1400" strokeDashoffset={1400 * (1 - k)} /><path d={R} stroke="#2b3156" strokeWidth={120} strokeDasharray="1400" strokeDashoffset={1400 * (1 - k)} />
        <path d={L} stroke="#e8b84a" strokeWidth={6} strokeDasharray="26 30" strokeDashoffset={1400 * (1 - k)} opacity={k} /><path d={R} stroke="#e8b84a" strokeWidth={6} strokeDasharray="26 30" strokeDashoffset={1400 * (1 - k)} opacity={k} />
      </g>
      {[[-1, '#6a97ff', 'ADAM'], [1, '#ffa24f', 'SAM']].map(([side, col, name], i) => {
        const p = lerp(0, 0.95, a), [x, y] = pt(side as -1 | 1, p);
        return <g key={i} transform={`translate(${x} ${y})`}><circle r={34} fill="#f4f2fb" stroke={INK} strokeWidth={5} /><circle cx={-10} cy={-3} r={4.4} fill={INK} /><circle cx={10} cy={-3} r={4.4} fill={INK} /><path d="M -9,10 q 9,7 18,0" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" /><rect x={-28} y={34} width={56} height={26} rx={12} fill={col as string} stroke={INK} strokeWidth={4} /></g>;
      })}
      <g opacity={ramp(t, 3.0, 3.8)}>
        <g transform="translate(520 200)"><circle r={74} fill="#f5c542" stroke={INK} strokeWidth={6} /><text y={26} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={84} fill="#a87a10">$</text><text y={130} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={44} letterSpacing={8} fill="#fff6e6">MONEY</text></g>
        <g transform="translate(1400 200)"><circle r={74} fill="#fbf1d2" stroke={INK} strokeWidth={6} /><path d="M 0,-44 L 0,0 L 30,20" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /><text y={130} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={44} letterSpacing={8} fill="#fff6e6">TIME</text></g>
      </g>
    </InsertBG>
  );
};

// they don't count the money you spend, they count the seats you fill
export const SeatsCount: React.FC<{t: number}> = ({t}) => {
  const money = ramp(t, 0.1, 1.6), dim = ramp(t, 1.9, 2.4), seats = Math.floor(ramp(t, 2.2, 5.4) * 8.99);
  return (
    <InsertBG tone="dark">
      <g opacity={1 - dim * 0.75} transform={`translate(0 ${dim * 40})`}>
        {Array.from({length: 18}, (_, i) => { const x = 330 + (i % 6) * 70 + (i % 2) * 14, y = 640 - Math.floor(i / 6) * 58 - rnd(i, 1) * 8, on = i / 18 < money; return on ? <g key={i} transform={`translate(${x} ${y})`}><ellipse rx={36} ry={12} cy={8} fill="#b88a1f" stroke={INK} strokeWidth={3} /><ellipse rx={36} ry={12} fill="#f5c542" stroke={INK} strokeWidth={3} /></g> : null; })}
        <text x={560} y={780} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={40} letterSpacing={8} fill="#fff6e6">MONEY SPENT</text>
      </g>
      <g transform="translate(1000 0)">
        {Array.from({length: 8}, (_, i) => { const x = 140 + (i % 4) * 190, y = 380 + Math.floor(i / 4) * 230, on = i < seats; return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect x={-70} y={-30} width={140} height={150} rx={22} fill={on ? '#8a3a4a' : '#3a2a3a'} stroke={INK} strokeWidth={4} />
            {on && <g transform={`translate(0 ${-(1 - ramp(t, 2.2 + i * 0.4, 2.6 + i * 0.4)) * 40})`} opacity={ramp(t, 2.2 + i * 0.4, 2.6 + i * 0.4)}><circle cx={0} cy={-6} r={36} fill="#f4f2fb" stroke={INK} strokeWidth={4} /><circle cx={-12} cy={-8} r={4.6} fill={INK} /><circle cx={12} cy={-8} r={4.6} fill={INK} /><path d="M -10,8 q 10,8 20,0" fill="none" stroke={INK} strokeWidth={3.6} strokeLinecap="round" /></g>}
          </g>); })}
        <text x={380} y={780} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={40} letterSpacing={8} fill="#ffd77a" opacity={ramp(t, 2.4, 3.0)}>SEATS FILLED</text>
      </g>
    </InsertBG>
  );
};

// a tower of blocks that Sam and Max build on the floor (stage coordinates; n = how many blocks)
export const Blocks: React.FC<{x: number; y: number; n: number; s?: number}> = ({x, y, n, s = 1}) => {
  const cols = ['#e0455a', '#4a8bd8', '#f5c542', '#47b57a', '#8a56b8', '#e8963a'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={150} ry={14} fill="rgba(5,6,15,.4)" style={{filter: 'blur(6px)'}} />
      {Array.from({length: Math.max(0, Math.floor(n))}, (_, i) => {
        const row = Math.floor(Math.sqrt(2 * i + 0.25) - 0.5), idx = i - (row * (row + 1)) / 2, w = 80, cx = (idx - row / 2) * (w + 6), cy = -(row + 1) * 76 + 4;
        return <g key={i} transform={`translate(${cx} ${cy})`}><rect x={-w / 2} y={-34} width={w} height={70} rx={8} fill={cols[i % 6]} stroke={INK} strokeWidth={3.4} /><rect x={-w / 2 + 6} y={-28} width={w - 12} height={10} rx={4} fill="#fff" opacity={0.28} /><text y={14} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={32} fill="#fff" opacity={0.8}>{'ABCDEF'[i % 6]}</text></g>;
      })}
    </g>
  );
};

// a rusty old car, side view (stage coordinates)
export const OldCar: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={230} ry={18} fill="rgba(5,6,15,.45)" style={{filter: 'blur(8px)'}} />
    <path d="M -210,-10 L -210,-90 Q -190,-110 -130,-112 L -90,-170 Q -70,-190 -30,-190 L 80,-190 Q 120,-188 140,-160 L 176,-112 Q 214,-108 214,-70 L 214,-10 Z" fill="#8a5a3a" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -70,-112 L -44,-166 L 70,-166 L 108,-112 Z" fill="#9db8d6" stroke={INK} strokeWidth={4} /><path d="M 20,-166 L 20,-112" stroke={INK} strokeWidth={4} />
    <path d="M -160,-70 l 40,-14 M 60,-60 l 46,-10" stroke="#b9733a" strokeWidth={8} strokeLinecap="round" opacity={0.7} /><circle cx={-110} cy={-44} r={14} fill="#6a3f26" opacity={0.6} /><path d="M -210,-60 L -226,-56 L -226,-34 L -210,-30 Z" fill="#cfc7b8" stroke={INK} strokeWidth={3} />
    {[-120, 120].map((wx) => <g key={wx} transform={`translate(${wx} -6)`}><circle r={46} fill="#1d1d24" stroke={INK} strokeWidth={4} /><circle r={24} fill="#a8a8b4" stroke={INK} strokeWidth={3} /></g>)}
  </g>
);

// a day of newsprint for the kite: Sam folds and cuts it at the kitchen table
export const Newspaper: React.FC<{x: number; y: number; s?: number; fold?: number}> = ({x, y, s = 1, fold = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={fold < 0.5 ? 'M -120,-18 L 120,-18 L 140,14 L -140,14 Z' : 'M -80,-26 L 80,-26 L 130,14 L -130,14 Z'} fill="#e8e2d2" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
    {Array.from({length: 4}, (_, i) => <path key={i} d={`M ${-100 + i * 8},${-8 + i * 5} L ${100 - i * 10},${-8 + i * 5}`} stroke="#9a9482" strokeWidth={3} opacity={0.7} />)}
    <rect x={-150} y={20} width={300} height={8} rx={4} fill="#7a4e2c" stroke={INK} strokeWidth={2.6} transform="rotate(-6)" /><rect x={-130} y={34} width={260} height={8} rx={4} fill="#8a5a34" stroke={INK} strokeWidth={2.6} transform="rotate(8)" />
  </g>
);
export {AbsoluteFill, HAND, shade};
