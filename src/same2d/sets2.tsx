import React from 'react';
import {INK} from './Char';
import {Glow} from './Stage';

// The remaining sets, in stage coordinates (3200 x 1080, floor at y = 830). People sit with their hips at y = 690 (seated) or y = 425 (standing).
const O = {stroke: INK, strokeWidth: 6, strokeLinejoin: 'round' as const};
const SKY = ({id, a, b}: {id: string; a: string; b: string}) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>;
const Skyline: React.FC<{x: number; y: number; w: number; dark: string; mid: string; lit?: boolean; seed?: number}> = ({x, y, w, dark, mid, lit, seed = 1}) => (
  <g>
    {Array.from({length: Math.floor(w / 70)}, (_, i) => {
      const h = 90 + ((i * 67 + seed * 31) % 210), bx = x + i * 70;
      return (
        <g key={i}>
          <rect x={bx} y={y - h} width={64} height={h} fill={i % 2 ? dark : mid} />
          {lit && Array.from({length: Math.floor(h / 40)}, (_, k) => <rect key={k} x={bx + 10 + (k % 2) * 26} y={y - h + 12 + k * 36} width={14} height={18} fill={(i + k) % 3 ? '#ffd27a' : '#3a4468'} opacity={0.9} />)}
        </g>
      );
    })}
  </g>
);

// ================================ OFFICE (day) ================================
export const office = () => {
  const far = (
    <g>
      <defs><SKY id="osky" a="#9fd0ff" b="#eaf4ff" /></defs>
      <rect x={-400} y={-700} width={4000} height={1530} fill="#dfe4ef" />
      <rect x={-400} y={830} width={4000} height={800} fill="#8c93a6" />
      <rect x={-400} y={812} width={4000} height={20} fill="#b9bfd0" />
      <rect x={260} y={110} width={1340} height={580} rx={8} fill="#aab6cc" {...O} />
      <rect x={282} y={132} width={1296} height={536} fill="url(#osky)" />
      <circle cx={1400} cy={240} r={52} fill="#fff6d6" style={{filter: 'drop-shadow(0 0 30px #ffe9a0)'}} />
      <Skyline x={282} y={668} w={1296} dark="#8fa3c2" mid="#a8b9d4" seed={3} />
      {[620, 960, 1300].map((x, i) => <rect key={i} x={x} y={132} width={10} height={536} fill="#aab6cc" />)}
      <rect x={2200} y={150} width={640} height={380} rx={8} fill="#fff" {...O} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={2240} y={200 + i * 70} width={260 + ((i * 97) % 220)} height={12} rx={6} fill={['#4a8abf', '#e0524f', '#42a86b', '#caa13a'][i]} opacity={0.75} />)}
      <circle cx={1760} cy={190} r={44} fill="#fff" {...O} /><path d="M 1760 190 L 1760 160 M 1760 190 L 1782 200" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
  const mid = (
    <g>
      {/* desks with monitors in the background */}
      {[80, 2760].map((x, i) => (
        <g key={i}>
          <rect x={x} y={660} width={360} height={26} rx={6} fill="#bda684" {...O} /><rect x={x + 20} y={686} width={30} height={144} fill="#8f7c5c" /><rect x={x + 310} y={686} width={30} height={144} fill="#8f7c5c" />
          <rect x={x + 130} y={520} width={150} height={110} rx={8} fill="#2a3150" {...O} /><rect x={x + 142} y={532} width={126} height={86} fill="#7fb2ff" /><rect x={x + 195} y={630} width={20} height={30} fill="#2a3150" />
        </g>
      ))}
      <path d="M 560 830 L 580 740 L 660 740 L 680 830 Z" fill="#b0603a" {...O} />
      {[-50, -15, 20, 55].map((a, i) => <path key={i} d={`M 620 745 Q ${620 + a * 1.4} ${650 - (i % 2) * 36} ${620 + a * 2.2} ${610 + (i % 2) * 28}`} fill="none" stroke="#3f9a55" strokeWidth={18} strokeLinecap="round" />)}
      {/* chairs, in profile, behind the people */}
      {[1130, 2230, 2790].map((x, i) => (
        <g key={i}><path d={`M ${x} 700 L ${x + 14} 480 Q ${x + 22} 456 ${x + 50} 458 Q ${x + 76} 462 ${x + 70} 490 L ${x + 64} 700 Z`} fill="#3a4666" {...O} /><rect x={x - 4} y={690} width={300} height={54} rx={16} fill="#46567a" {...O} /><rect x={x + 120} y={744} width={30} height={86} fill="#1d2440" /></g>
      ))}
      <Glow x={900} y={330} r={900} color="#fff3d0" o={0.5} />
    </g>
  );
  const front = (
    <g>
      <rect x={900} y={648} width={1700} height={38} rx={12} fill="#cdb893" {...O} />
      <rect x={920} y={686} width={1660} height={110} rx={6} fill="#a8977c" {...O} />
      <rect x={1500} y={590} width={150} height={58} rx={6} fill="#3a4666" {...O} /><rect x={1640} y={600} width={14} height={44} rx={4} fill="#3a4666" />
      <rect x={1840} y={634} width={70} height={14} rx={6} fill="#fff" {...O} /><rect x={1400} y={630} width={64} height={18} rx={4} fill="#e8e2d4" {...O} /><rect x={2080} y={610} width={52} height={38} rx={8} fill="#e8e2d4" {...O} />
    </g>
  );
  return {far, mid, front, fg: <g />};
};

// ================================ RESTAURANT (night) ================================
export const restaurant = (t: number) => {
  const far = (
    <g>
      <rect x={-400} y={-700} width={4000} height={1530} fill="#27161f" />
      <rect x={-400} y={830} width={4000} height={800} fill="#3b2418" />
      <rect x={300} y={140} width={1000} height={520} rx={10} fill="#171c3a" {...O} /><Skyline x={316} y={640} w={970} dark="#0f1330" mid="#151a42" lit seed={5} />
      <rect x={1900} y={140} width={1000} height={520} rx={10} fill="#171c3a" {...O} /><Skyline x={1916} y={640} w={970} dark="#0f1330" mid="#151a42" lit seed={9} />
      {Array.from({length: 26}, (_, i) => <circle key={i} cx={120 + i * 120 + Math.sin(t * 0.6 + i) * 6} cy={90 + ((i * 53) % 80)} r={10 + (i % 3) * 3} fill="#ffcf7a" opacity={0.85} style={{filter: 'drop-shadow(0 0 16px #ffb25a)'}} />)}
    </g>
  );
  const mid = (
    <g>
      {/* other diners, dim, in the background */}
      {[260, 520, 2480, 2800].map((x, i) => (
        <g key={i} opacity={0.5}>
          <rect x={x - 60} y={650} width={200} height={20} rx={6} fill="#5a3a2a" /><rect x={x - 20} y={670} width={18} height={160} fill="#3b2418" />
          <circle cx={x + 10} cy={560} r={46} fill="#c8bde0" /><path d={`M ${x - 40} 650 Q ${x - 44} 590 ${x + 10} 590 Q ${x + 64} 590 ${x + 60} 650 Z`} fill={['#7a6aa8', '#a86a6a', '#6aa89a', '#a8946a'][i]} />
        </g>
      ))}
      {[1330, 1940].map((x, i) => <g key={i}><line x1={x} y1={-200} x2={x} y2={250} stroke="#2e2e34" strokeWidth={6} /><path d={`M ${x - 70} 330 L ${x + 70} 330 L ${x + 40} 250 L ${x - 40} 250 Z`} fill="#ffc46b" {...O} /></g>)}
      {[1130, 2170].map((x, i) => (
        <g key={i}><path d={`M ${x} 700 L ${x + 12} 500 Q ${x + 20} 478 ${x + 46} 480 Q ${x + 70} 484 ${x + 64} 510 L ${x + 58} 700 Z`} fill="#6b2f3a" {...O} /><rect x={x - 4} y={690} width={290} height={50} rx={14} fill="#8a3a48" {...O} /></g>
      ))}
      <Glow x={1330} y={330} r={620} color="#ffb25a" o={0.7} /><Glow x={1940} y={330} r={620} color="#ffb25a" o={0.7} /><Glow x={1720} y={600} r={380} color="#ffd27a" o={0.6} />
    </g>
  );
  const front = (
    <g>
      <rect x={1260} y={640} width={920} height={30} rx={10} fill="#efe6d4" {...O} /><rect x={1260} y={670} width={920} height={100} fill="#e0d4bb" {...O} />
      <rect x={1708} y={770} width={44} height={70} fill="#5a3a2a" />
      {[1500, 1930].map((x, i) => <g key={i}><ellipse cx={x} cy={636} rx={74} ry={16} fill="#fff" {...O} /><ellipse cx={x} cy={632} rx={50} ry={9} fill="#d8b25a" /></g>)}
      <g><rect x={1700} y={590} width={36} height={48} rx={6} fill="#f4efe6" {...O} /><path d="M 1718 588 Q 1710 566 1718 556 Q 1726 566 1718 588 Z" fill="#ffcf5a" style={{filter: 'drop-shadow(0 0 10px #ffb300)'}} /></g>
      {[1620, 1810].map((x, i) => <g key={i}><path d={`M ${x - 20} 570 L ${x + 20} 570 Q ${x + 18} 616 ${x} 620 Q ${x - 18} 616 ${x - 20} 570 Z`} fill="rgba(255,255,255,.35)" {...O} strokeWidth={4} /><rect x={x - 2} y={620} width={4} height={18} fill="#cfd6e6" /><path d={`M ${x - 16} 590 L ${x + 16} 590 Q ${x + 14} 612 ${x} 616 Q ${x - 14} 612 ${x - 16} 590 Z`} fill="#8a2a3a" opacity={0.8} /></g>)}
    </g>
  );
  return {far, mid, front, fg: <g><rect x={-80} y={960} width={3400} height={300} fill="#150d12" /></g>};
};

// ================================ MANAGER'S GLASS ROOM (day) ================================
export const mgrRoom = () => {
  const far = (
    <g>
      <defs><SKY id="msky" a="#8fc4ff" b="#f1f7ff" /></defs>
      <rect x={-400} y={-700} width={4000} height={1530} fill="url(#msky)" />
      <Skyline x={-100} y={760} w={3400} dark="#92a6c4" mid="#aabbd4" seed={7} />
      <Skyline x={-60} y={820} w={3300} dark="#7f93b4" mid="#97a9c6" seed={2} />
      <circle cx={2700} cy={200} r={60} fill="#fff6d6" style={{filter: 'drop-shadow(0 0 40px #ffe9a0)'}} />
      <rect x={-400} y={830} width={4000} height={800} fill="#6b7186" />
      <rect x={-400} y={830} width={4000} height={26} fill="#a8afc4" />
    </g>
  );
  const mid = (
    <g>
      {/* his desk, in profile, at the right */}
      <rect x={2380} y={650} width={620} height={34} rx={10} fill="#8b6f4a" {...O} /><rect x={2400} y={684} width={560} height={146} rx={6} fill="#6f573a" {...O} />
      <rect x={2560} y={540} width={170} height={110} rx={8} fill="#2a3150" {...O} /><rect x={2572} y={552} width={146} height={86} fill="#7fb2ff" />
      <rect x={2900} y={500} width={150} height={150} rx={10} fill="#f4f1fa" {...O} /><circle cx={2975} cy={575} r={36} fill="#caa13a" />
      <path d="M 360 830 L 380 740 L 460 740 L 480 830 Z" fill="#b0603a" {...O} />{[-50, -15, 20, 55].map((a, i) => <path key={i} d={`M 420 745 Q ${420 + a * 1.4} ${650 - (i % 2) * 36} ${420 + a * 2.2} ${610 + (i % 2) * 28}`} fill="none" stroke="#3f9a55" strokeWidth={18} strokeLinecap="round" />)}
      <Glow x={1600} y={380} r={1100} color="#fff3d0" o={0.5} />
    </g>
  );
  // the glass walls: thin frames and a few reflection streaks over everything behind them
  const front = (
    <g>
      {[760, 1560, 2300].map((x, i) => <rect key={i} x={x} y={-200} width={14} height={1030} fill="#cfd6e6" opacity={0.85} />)}
      <rect x={-400} y={-200} width={4000} height={1030} fill="#ffffff" opacity={0.05} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${300 + i * 900} 100 L ${420 + i * 900} 100 L ${200 + i * 900} 800 L ${80 + i * 900} 800 Z`} fill="#fff" opacity={0.07} />)}
    </g>
  );
  return {far, mid, front, fg: <g />};
};
