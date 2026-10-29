import React from 'react';
import {INK, UI} from './theme';
import {shade} from './People';
import {SetOut, FL, Clock} from './sets';

// ============================================================================================
// Two more places for the second version: the factory where Adam's father worked double shifts, and the car (rides with Dad).
// ============================================================================================
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

export const factory = (o: {t: number}): SetOut => {
  const belt = (o.t * 90) % 140;
  const Gear: React.FC<{x: number; y: number; r: number; dir: number}> = ({x, y, r, dir}) => (
    <g transform={`translate(${x} ${y}) rotate(${o.t * 24 * dir})`}>
      {Array.from({length: 12}, (_, i) => <rect key={i} x={-r * 0.14} y={-r - r * 0.16} width={r * 0.28} height={r * 0.34} rx={4} fill="#4a5470" stroke={INK} strokeWidth={3} transform={`rotate(${i * 30})`} />)}
      <circle r={r} fill="#55607e" stroke={INK} strokeWidth={4} /><circle r={r * 0.55} fill="#2c3350" stroke={INK} strokeWidth={3} /><circle r={r * 0.16} fill="#8a94b4" />
    </g>
  );
  return {
    far: (
      <g>
        <rect x={-400} y={-200} width={4000} height={1500} fill="#1c2236" />
        {[0, 1, 2].map((i) => <g key={i}><rect x={420 + i * 900} y={90} width={560} height={420} fill="#e08a3a" stroke={INK} strokeWidth={4} opacity={0.9} /><path d={`M ${700 + i * 900},90 L ${700 + i * 900},510 M ${420 + i * 900},300 L ${980 + i * 900},300`} stroke={INK} strokeWidth={6} /></g>)}
        <rect x={-400} y={540} width={4000} height={60} fill="#2a3048" /><path d="M -400,560 L 3600,560" stroke="#f2c14e" strokeWidth={8} strokeDasharray="40 30" />
        <g transform="translate(1640 220)"><Clock x={0} y={0} r={84} min={700} /></g>
        <Gear x={300} y={330} r={130} dir={1} /><Gear x={520} y={380} r={80} dir={-1} /><Gear x={2900} y={330} r={120} dir={-1} />
        <path d="M 0,40 L 3200,40" stroke="#3a4260" strokeWidth={30} /><path d="M 0,40 L 3200,40" stroke={INK} strokeWidth={4} />
      </g>
    ),
    mid: (
      <g>
        <rect x={-400} y={FL - 10} width={4000} height={400} fill="#262c42" /><rect x={-400} y={FL - 14} width={4000} height={8} fill="#f2c14e" opacity={0.8} />
        {/* conveyor belt with boxes riding on it */}
        <rect x={700} y={690} width={1800} height={50} rx={10} fill="#3a4260" stroke={INK} strokeWidth={4} />
        {Array.from({length: 14}, (_, i) => <line key={i} x1={700 + i * 140 + belt} y1={694} x2={700 + i * 140 + belt} y2={736} stroke="#2a3048" strokeWidth={6} opacity={i * 140 + belt < 1800 ? 1 : 0} />)}
        {[0, 1, 2].map((i) => { const x = 760 + ((i * 600 + belt * 3.5) % 1700); return <g key={i} transform={`translate(${x} 690)`}><rect x={-70} y={-110} width={140} height={110} rx={6} fill="#c9954a" stroke={INK} strokeWidth={4} /><rect x={-70} y={-110} width={140} height={22} fill="#e0b068" stroke={INK} strokeWidth={3} /><path d="M -30,-70 L 30,-70" stroke="#8a5a2a" strokeWidth={6} /></g>; })}
        <rect x={720} y={740} width={14} height={90} fill="#3a4260" /><rect x={2470} y={740} width={14} height={90} fill="#3a4260" />
        {Array.from({length: 18}, (_, i) => <rect key={i} x={-400 + i * 200} y={FL - 10} width={90} height={10} fill={i % 2 ? '#f2c14e' : '#1d1a2e'} />)}
        <ellipse cx={1600} cy={846} rx={900} ry={20} fill="rgba(5,6,15,.4)" style={{filter: 'blur(9px)'}} />
      </g>
    ),
    rim: 'rgba(255,170,90,.9)',
  };
};

// riding in the car: the road slides by behind the windows, the car's body covers the passengers' laps
export const drive = (o: {t: number}): SetOut => {
  const sc = (o.t * 420) % 360;
  return {
    far: (
      <g>
        <defs><linearGradient id="drsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0a25a" /><stop offset="1" stopColor="#ffe2b0" /></linearGradient></defs>
        <rect x={-400} y={-200} width={4000} height={1100} fill="url(#drsky)" />
        <circle cx={2300} cy={420} r={120} fill="#fff1c4" opacity={0.9} />
        {Array.from({length: 14}, (_, i) => <rect key={i} x={((i * 300 - o.t * 60) % 4200 + 4200) % 4200 - 400} y={300 + rnd(i, 1) * 160} width={220} height={620} fill="#c9783a" stroke={INK} strokeWidth={3} opacity={0.6} />)}
      </g>
    ),
    mid: (
      <g>
        <rect x={-400} y={700} width={4000} height={400} fill="#4a4258" /><rect x={-400} y={692} width={4000} height={14} fill="#c9c2b0" />
        {Array.from({length: 16}, (_, i) => <rect key={i} x={i * 360 - sc - 360} y={900} width={190} height={14} rx={6} fill="#f4ecdc" />)}
      </g>
    ),
    front: (
      <g>
        {/* the car body in front of the passengers: door, window frame, side mirror */}
        <path d="M 700,560 L 760,470 L 2380,470 L 2440,560 L 2440,760 L 700,760 Z" fill="#3a5a8a" stroke={INK} strokeWidth={5} strokeLinejoin="round" transform="translate(0 250)" />
        <rect x={700} y={740} width={1740} height={60} fill="#2c456e" stroke={INK} strokeWidth={4} />
        <path d="M 1560,740 L 1560,1000" stroke={INK} strokeWidth={4} /><rect x={1640} y={820} width={120} height={20} rx={8} fill="#1d2c4a" stroke={INK} strokeWidth={3} />
        {[900, 2240].map((x) => <g key={x} transform={`translate(${x} 1000)`}><circle r={74} fill="#1d1d24" stroke={INK} strokeWidth={5} /><circle r={38} fill="#a8a8b4" stroke={INK} strokeWidth={4} transform={`rotate(${o.t * 300})`} /></g>)}
      </g>
    ),
    rim: 'rgba(255,200,120,.9)',
  };
};
export {UI, shade};
