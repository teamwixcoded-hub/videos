import React, {useId} from 'react';
import {DIGI, MONT} from '../same2d/theme';

// ============================================================================================
// LOOK RICH vs RICH: the polished prop library. Every prop is plain SVG with gradients, soft shadows, glass reflections and one outline colour, drawn around its own origin:
//   Car / Truck: side view facing RIGHT, origin = the ground under the middle of the vehicle (y up is negative).  BankCard / PhoneBank / Jar / Bills / Coins: origin = centre.
// Colours are props, so the same truck can be black, repossessed (grey) or sold at auction.
// ============================================================================================
export const INK = '#1b1a3a';
const mix = (c: string, k: number) => { const n = parseInt(c.slice(1), 16), f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k))); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); };
export const shadeC = mix;
const lift = (c: string, k: number) => { const n = parseInt(c.slice(1), 16), f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (255 - v) * k))); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); };

// ---------------- wheel: tyre, alloy rim with spokes, hub; `spin` in degrees ----------------
export const Wheel: React.FC<{x: number; y: number; r: number; spin?: number; rim?: string}> = ({x, y, r, spin = 0, rim = '#d8dcea'}) => {
  const id = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={`tr${id}`} cx="40%" cy="35%" r="75%"><stop offset="0" stopColor="#4a4d66" /><stop offset="1" stopColor="#14152a" /></radialGradient>
        <radialGradient id={`rm${id}`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor={rim} /><stop offset="1" stopColor={mix(rim, 0.6)} /></radialGradient>
      </defs>
      <circle r={r} fill={`url(#tr${id})`} stroke={INK} strokeWidth={6} />
      <circle r={r * 0.86} fill="none" stroke="#000" strokeWidth={2} opacity={0.35} />
      <circle r={r * 0.66} fill={`url(#rm${id})`} stroke={INK} strokeWidth={4} />
      <g transform={`rotate(${spin})`}>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M 0,0 L ${r * 0.12},${-r * 0.58} L ${-r * 0.12},${-r * 0.58} Z`} fill={mix(rim, 0.75)} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" transform={`rotate(${i * 72})`} />)}
        <circle r={r * 0.2} fill={`url(#rm${id})`} stroke={INK} strokeWidth={3} />
      </g>
      <path d={`M ${-r * 0.5},${-r * 0.3} A ${r * 0.58} ${r * 0.58} 0 0 1 ${-r * 0.1},${-r * 0.57}`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

// ---------------- a glass window with a diagonal reflection ----------------
const Glass: React.FC<{d: string; id: string}> = ({d, id}) => (
  <g>
    <path d={d} fill={`url(#gl${id})`} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <clipPath id={`gc${id}`}><path d={d} /></clipPath>
    <g clipPath={`url(#gc${id})`}><path d="M -40,-260 L 10,-260 L -50,0 L -100,0 Z" fill="#fff" opacity={0.28} transform="translate(-10 0)" /><path d="M 40,-260 L 62,-260 L 2,0 L -20,0 Z" fill="#fff" opacity={0.16} transform="translate(30 0)" /></g>
  </g>
);

// ---------------- sedan (a 12-year-old family car by default) ----------------
export const Car: React.FC<{x?: number; y?: number; scale?: number; color?: string; spin?: number; lights?: boolean; dirty?: number; flip?: boolean}> = ({x = 0, y = 0, scale = 1, color = '#c9cfe0', spin = 0, lights = false, dirty = 0, flip}) => {
  const id = useId().replace(/:/g, '');
  const body = 'M -272,-34 C -280,-62 -274,-86 -242,-92 L -180,-98 C -152,-100 -128,-140 -84,-152 L 58,-152 C 98,-150 128,-120 150,-104 L 238,-92 C 268,-88 282,-66 278,-34 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <defs>
        <linearGradient id={`bd${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lift(color, 0.42)} /><stop offset="0.35" stopColor={color} /><stop offset="1" stopColor={mix(color, 0.62)} /></linearGradient>
        <linearGradient id={`gl${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5d7fb8" /><stop offset="1" stopColor="#1d2748" /></linearGradient>
        <radialGradient id={`hl${id}`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fffbe0" /><stop offset="1" stopColor="#ffd86a" /></radialGradient>
        <clipPath id={`cb${id}`}><path d={body} /></clipPath>
      </defs>
      <ellipse cx={0} cy={2} rx={300} ry={16} fill="#000" opacity={0.35} style={{filter: 'blur(6px)'}} />
      <path d={body} fill={`url(#bd${id})`} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <g clipPath={`url(#cb${id})`}>
        <path d="M -280,-82 C -150,-92 60,-96 282,-84 L 282,-72 C 60,-84 -150,-80 -280,-70 Z" fill="#fff" opacity={0.3} />
        <rect x={-290} y={-52} width={580} height={22} fill="#000" opacity={0.2} />
        {dirty > 0 && <g opacity={dirty}><path d="M -280,-34 L 280,-34 L 280,-52 C 100,-46 -100,-58 -280,-48 Z" fill="#6b5a3a" opacity={0.45} /><circle cx={-120} cy={-70} r={14} fill="#8a6a3a" opacity={0.35} /><circle cx={140} cy={-60} r={10} fill="#8a6a3a" opacity={0.35} /></g>}
      </g>
      {[-158, 168].map((cx) => <path key={cx} d={`M ${cx - 52},-30 A 52 52 0 0 1 ${cx + 52},-30 Z`} fill="#0d0e1c" />)}
      <Glass id={id} d="M -118,-138 C -98,-146 -76,-146 -52,-146 L -52,-106 L -156,-106 C -146,-120 -132,-132 -118,-138 Z" />
      <Glass id={id} d="M -34,-146 L 52,-146 C 82,-144 104,-122 124,-106 L -34,-106 Z" />
      <path d="M -52,-148 L -52,-104 M -34,-148 L -34,-104" stroke={INK} strokeWidth={6} />
      <path d="M -40,-100 L -40,-40 M 138,-98 L 138,-40" stroke={INK} strokeWidth={3} opacity={0.55} /><rect x={-26} y={-92} width={34} height={7} rx={3.5} fill={lift(color, 0.5)} stroke={INK} strokeWidth={2.5} /><rect x={150} y={-90} width={30} height={7} rx={3.5} fill={lift(color, 0.5)} stroke={INK} strokeWidth={2.5} />
      <path d="M 120,-108 L 138,-118 L 150,-108 Z" fill={mix(color, 0.7)} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <ellipse cx={262} cy={-70} rx={19} ry={12} fill={`url(#hl${id})`} stroke={INK} strokeWidth={4} /><rect x={-278} y={-76} width={16} height={26} rx={7} fill="#d84f4f" stroke={INK} strokeWidth={4} />
      {lights && <path d="M 276,-76 L 520,-130 L 520,-10 L 276,-62 Z" fill="#ffe9a0" opacity={0.22} />}
      <path d="M 232,-44 L 280,-44 C 282,-36 282,-34 278,-30 L 232,-30 Z" fill="#8a90a8" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><rect x={-282} y={-42} width={52} height={12} rx={5} fill="#8a90a8" stroke={INK} strokeWidth={4} />
      <Wheel x={-158} y={-34} r={42} spin={spin} /><Wheel x={168} y={-34} r={42} spin={spin} />
    </g>
  );
};

// ---------------- pickup truck (black, shiny, big wheels) ----------------
export const Truck: React.FC<{x?: number; y?: number; scale?: number; color?: string; spin?: number; lights?: boolean; flip?: boolean; dust?: number}> = ({x = 0, y = 0, scale = 1, color = '#23253a', spin = 0, lights = false, flip, dust = 0}) => {
  const id = useId().replace(/:/g, '');
  const body = 'M -330,-46 L -330,-128 L -108,-128 L -94,-130 L -70,-196 C -58,-210 -36,-212 -6,-212 L 96,-212 C 128,-210 150,-188 170,-154 L 192,-138 L 304,-130 C 334,-128 346,-106 346,-76 L 346,-46 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <defs>
        <linearGradient id={`bd${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lift(color, 0.5)} /><stop offset="0.22" stopColor={lift(color, 0.12)} /><stop offset="0.6" stopColor={color} /><stop offset="1" stopColor={mix(color, 0.45)} /></linearGradient>
        <linearGradient id={`gl${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6f8fc8" /><stop offset="1" stopColor="#1d2748" /></linearGradient>
        <linearGradient id={`ch${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor="#b8bed4" /><stop offset="1" stopColor="#7a809a" /></linearGradient>
        <radialGradient id={`hl${id}`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#bfe0ff" /></radialGradient>
        <clipPath id={`cb${id}`}><path d={body} /></clipPath>
      </defs>
      <ellipse cx={0} cy={2} rx={350} ry={18} fill="#000" opacity={0.4} style={{filter: 'blur(7px)'}} />
      <path d={body} fill={`url(#bd${id})`} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <g clipPath={`url(#cb${id})`}>
        <path d="M -330,-112 L -110,-112 L 340,-114 L 340,-100 L -110,-98 L -330,-98 Z" fill="#fff" opacity={0.22} />
        <path d="M -60,-190 C -40,-206 20,-204 60,-202" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.35} />
        <rect x={-340} y={-62} width={700} height={24} fill="#000" opacity={0.28} />
        <path d="M -322,-128 L -112,-128 L -112,-62 L -322,-62 Z" fill="#000" opacity={0.28} /><path d="M -322,-128 L -112,-128" stroke={`url(#ch${id})`} strokeWidth={9} />
      </g>
      {[-208, 226].map((cx) => <path key={cx} d={`M ${cx - 62},-44 A 62 62 0 0 1 ${cx + 62},-44 Z`} fill="#0b0c18" />)}
      <path d="M -56,-194 C -48,-204 -34,-204 -6,-204 L 94,-204 C 120,-202 138,-182 154,-154 L -64,-154 Z" fill={`url(#gl${id})`} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <clipPath id={`gc${id}`}><path d="M -56,-194 C -48,-204 -34,-204 -6,-204 L 94,-204 C 120,-202 138,-182 154,-154 L -64,-154 Z" /></clipPath>
      <g clipPath={`url(#gc${id})`}><path d="M -10,-210 L 30,-210 L -30,-150 L -70,-150 Z" fill="#fff" opacity={0.3} /><path d="M 60,-210 L 76,-210 L 16,-150 L 0,-150 Z" fill="#fff" opacity={0.18} /></g>
      <path d="M 40,-206 L 40,-152" stroke={INK} strokeWidth={6} />
      <path d="M 26,-146 L 26,-50 M 150,-136 L 150,-50" stroke="#000" strokeWidth={3} opacity={0.4} /><rect x={36} y={-136} width={36} height={8} rx={4} fill={`url(#ch${id})`} stroke={INK} strokeWidth={2.5} /><rect x={-86} y={-136} width={36} height={8} rx={4} fill={`url(#ch${id})`} stroke={INK} strokeWidth={2.5} />
      <path d="M 174,-152 L 196,-164 L 214,-150 L 196,-142 Z" fill={`url(#bd${id})`} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 312,-120 L 342,-110 L 346,-70 L 316,-70 Z" fill="#0b0c18" stroke={INK} strokeWidth={4} /><path d="M 322,-108 L 322,-74 M 332,-106 L 332,-74 M 342,-104 L 342,-74" stroke={`url(#ch${id})`} strokeWidth={4} />
      <path d="M 262,-112 L 322,-118 L 326,-98 L 266,-92 Z" fill={`url(#hl${id})`} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {lights && <path d="M 326,-110 L 620,-170 L 620,-20 L 326,-84 Z" fill="#e8f4ff" opacity={0.22} />}
      <rect x={-334} y={-104} width={14} height={34} rx={6} fill="#d84f4f" stroke={INK} strokeWidth={4} />
      <path d="M 276,-56 L 346,-56 L 346,-40 L 276,-40 Z" fill={`url(#ch${id})`} stroke={INK} strokeWidth={4} strokeLinejoin="round" /><rect x={-338} y={-52} width={50} height={14} rx={5} fill={`url(#ch${id})`} stroke={INK} strokeWidth={4} />
      {dust > 0 && <g opacity={dust}>{[0, 1, 2].map((i) => <circle key={i} cx={-350 - i * 40} cy={-22 - i * 6} r={22 + i * 10} fill="#cbbf9a" opacity={0.5 - i * 0.12} />)}</g>}
      <Wheel x={-208} y={-44} r={56} spin={spin} rim="#cfd4e8" /><Wheel x={226} y={-44} r={56} spin={spin} rim="#cfd4e8" />
    </g>
  );
};

// ---------------- bank card: gradient, gold chip, contactless waves, mastercard-style circles, optional DECLINED ----------------
export const BankCard: React.FC<{x?: number; y?: number; scale?: number; rot?: number; c1?: string; c2?: string; name?: string; digits?: string; declined?: boolean; credit?: boolean}> = ({x = 0, y = 0, scale = 1, rot = 0, c1 = '#3b6fd8', c2 = '#1b2f7a', name = 'JAKE MILLER', digits = '4821 5530 1294 7712', declined, credit}) => {
  const id = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <defs>
        <linearGradient id={`cd${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient>
        <linearGradient id={`cp${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0b0" /><stop offset="0.5" stopColor="#e8b84a" /><stop offset="1" stopColor="#b8862a" /></linearGradient>
        <linearGradient id={`sh${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.28" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <clipPath id={`cc${id}`}><rect x={-270} y={-170} width={540} height={340} rx={30} /></clipPath>
      </defs>
      <rect x={-262} y={-150} width={540} height={340} rx={30} fill="#000" opacity={0.3} style={{filter: 'blur(10px)'}} />
      <rect x={-270} y={-170} width={540} height={340} rx={30} fill={`url(#cd${id})`} stroke={INK} strokeWidth={7} />
      <g clipPath={`url(#cc${id})`}>
        <circle cx={150} cy={-150} r={250} fill="#fff" opacity={0.07} /><circle cx={-220} cy={170} r={220} fill="#000" opacity={0.1} />
        <path d="M -300,-60 L 300,-190 L 300,-130 L -300,0 Z" fill={`url(#sh${id})`} />
      </g>
      <rect x={-216} y={-82} width={96} height={72} rx={12} fill={`url(#cp${id})`} stroke={INK} strokeWidth={4} /><path d="M -216,-46 L -120,-46 M -184,-82 L -184,-10 M -152,-82 L -152,-10" stroke={INK} strokeWidth={2.5} opacity={0.55} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${-92 + i * 14},-62 A ${16 + i * 14} ${16 + i * 14} 0 0 1 ${-92 + i * 14},-30`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />)}
      <text x={-216} y={62} fontFamily={DIGI} fontWeight={700} fontSize={36} fill="#fff" letterSpacing={3} stroke={INK} strokeWidth={1} opacity={0.95}>{digits}</text>
      <text x={-216} y={128} fontFamily={DIGI} fontWeight={600} fontSize={28} fill="#e8ecff" letterSpacing={3}>{name}</text>
      <circle cx={190} cy={122} r={34} fill="#e84a4a" opacity={0.92} /><circle cx={232} cy={122} r={34} fill="#f5a623" opacity={0.85} />
      <text x={236} y={-120} textAnchor="end" fontFamily={MONT} fontWeight={800} fontSize={30} fill="#fff" opacity={0.85} letterSpacing={3}>{credit ? 'CREDIT' : 'DEBIT'}</text>
      {declined && <g><rect x={-270} y={-170} width={540} height={340} rx={30} fill="#ff2a3a" opacity={0.22} /><g transform="rotate(-12)"><rect x={-220} y={-52} width={440} height={104} rx={14} fill="rgba(30,0,10,.35)" stroke="#ff4a5e" strokeWidth={10} /><text x={0} y={26} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={76} fill="#ff4a5e" letterSpacing={6} stroke={INK} strokeWidth={2} paintOrder="stroke">DECLINED</text></g></g>}
    </g>
  );
};

// ---------------- phone with a banking app ----------------
export type Row = {label: string; amt: string; c?: string};
export const PhoneBank: React.FC<{x?: number; y?: number; scale?: number; rot?: number; balance: string; balC?: string; sub?: string; rows?: Row[]; accent?: string; title?: string; glow?: boolean}> = ({x = 0, y = 0, scale = 1, rot = 0, balance, balC = '#3ddc84', sub, rows = [], accent = '#3b6fd8', title = 'CHECKING', glow}) => {
  const id = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <defs>
        <linearGradient id={`pb${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4a4f6a" /><stop offset="0.5" stopColor="#1d2036" /><stop offset="1" stopColor="#0c0d1a" /></linearGradient>
        <linearGradient id={`ps${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#161c40" /><stop offset="1" stopColor="#0b1030" /></linearGradient>
        <clipPath id={`pc${id}`}><rect x={-186} y={-400} width={372} height={800} rx={38} /></clipPath>
      </defs>
      {glow && <ellipse cx={0} cy={20} rx={320} ry={440} fill={accent} opacity={0.18} style={{filter: 'blur(40px)'}} />}
      <rect x={-196} y={-370} width={400} height={820} rx={56} fill="#000" opacity={0.3} style={{filter: 'blur(12px)'}} />
      <rect x={-206} y={-420} width={412} height={840} rx={58} fill={`url(#pb${id})`} stroke={INK} strokeWidth={8} />
      <rect x={-194} y={-408} width={388} height={816} rx={48} fill="none" stroke="#fff" strokeWidth={2} opacity={0.18} />
      <rect x={-186} y={-400} width={372} height={800} rx={38} fill={`url(#ps${id})`} />
      <g clipPath={`url(#pc${id})`}>
        <rect x={-186} y={-400} width={372} height={196} fill={accent} opacity={0.92} />
        <text x={-150} y={-358} fontFamily={DIGI} fontWeight={700} fontSize={28} fill="#fff" opacity={0.85} letterSpacing={3}>{title}</text>
        <text x={0} y={-286} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={balance.length > 7 ? 62 : 76} fill={balC} stroke={INK} strokeWidth={3} paintOrder="stroke">{balance}</text>
        {sub && <text x={0} y={-236} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={26} fill="#dfe6ff" opacity={0.9}>{sub}</text>}
        {rows.slice(0, 6).map((r, i) => <g key={i} transform={`translate(0 ${-150 + i * 82})`}><rect x={-166} y={-34} width={332} height={66} rx={16} fill="#1f2750" /><circle cx={-130} cy={0} r={15} fill={r.c ?? '#ff6a6a'} /><text x={-102} y={9} fontFamily={MONT} fontWeight={800} fontSize={25} fill="#e8ecff">{r.label}</text><text x={150} y={9} textAnchor="end" fontFamily={DIGI} fontWeight={700} fontSize={27} fill={r.c ?? '#ff6a6a'}>{r.amt}</text></g>)}
        <rect x={-186} y={322} width={372} height={78} fill="#0e1438" /><path d="M -186,322 L 186,322" stroke="#2a3270" strokeWidth={3} />{[-120, -40, 40, 120].map((cx, i) => <g key={i} opacity={i === 0 ? 1 : 0.5}><circle cx={cx} cy={352} r={14} fill={i === 0 ? accent : "#5a64a8"} /><rect x={cx - 18} y={374} width={36} height={6} rx={3} fill="#5a64a8" /></g>)}<path d="M -190,-420 L 40,-420 L -60,400 L -190,400 Z" fill="#fff" opacity={0.05} />
      </g>
      <rect x={-46} y={-408} width={92} height={22} rx={11} fill="#05060e" />
    </g>
  );
};

// ---------------- money: a stack of bills, a stack of coins, a glass savings jar ----------------
export const Bills: React.FC<{x?: number; y?: number; scale?: number; n?: number; rot?: number; label?: string}> = ({x = 0, y = 0, scale = 1, n = 3, rot = 0, label = '$'}) => {
  const id = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <defs><linearGradient id={`bl${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b8f0c4" /><stop offset="1" stopColor="#5fbf7c" /></linearGradient></defs>
      <ellipse cx={0} cy={n * 10 + 70} rx={190} ry={22} fill="#000" opacity={0.3} style={{filter: 'blur(6px)'}} />
      {Array.from({length: n}, (_, i) => { const k = n - 1 - i; return (
        <g key={i} transform={`translate(${(k % 2 ? 6 : -6)} ${-k * 18})`}>
          <rect x={-180} y={-72} width={360} height={150} rx={14} fill={`url(#bl${id})`} stroke={INK} strokeWidth={6} />
          <rect x={-160} y={-54} width={320} height={114} rx={8} fill="none" stroke="#2f7d4f" strokeWidth={3} opacity={0.7} />
          {k === 0 && <g><circle r={44} fill="#e4fbea" stroke="#2f7d4f" strokeWidth={4} /><text x={0} y={17} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={52} fill="#2f7d4f">{label}</text><circle cx={-130} cy={-26} r={14} fill="none" stroke="#2f7d4f" strokeWidth={3} /><circle cx={130} cy={44} r={14} fill="none" stroke="#2f7d4f" strokeWidth={3} /></g>}
        </g>); })}
    </g>
  );
};
export const Coins: React.FC<{x?: number; y?: number; scale?: number; n?: number}> = ({x = 0, y = 0, scale = 1, n = 6}) => {
  const id = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs><linearGradient id={`cn${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c8921f" /><stop offset="0.4" stopColor="#ffe680" /><stop offset="1" stopColor="#b8801a" /></linearGradient></defs>
      <ellipse cx={0} cy={22} rx={150} ry={20} fill="#000" opacity={0.3} style={{filter: 'blur(6px)'}} />
      {Array.from({length: n}, (_, i) => <g key={i} transform={`translate(${(i % 3 - 1) * 6} ${-i * 26})`}><ellipse cx={0} cy={18} rx={130} ry={36} fill="#a8741a" stroke={INK} strokeWidth={5} /><rect x={-130} y={-8} width={260} height={26} fill={`url(#cn${id})`} /><path d="M -130,-8 L -130,18 M 130,-8 L 130,18" stroke={INK} strokeWidth={5} /><ellipse cx={0} cy={-8} rx={130} ry={36} fill="#ffe680" stroke={INK} strokeWidth={5} /><ellipse cx={0} cy={-8} rx={98} ry={26} fill="none" stroke="#c8921f" strokeWidth={4} /><text x={0} y={6} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={40} fill="#b8801a">$</text></g>)}
    </g>
  );
};
export const Jar: React.FC<{x?: number; y?: number; scale?: number; fill?: number; label?: string}> = ({x = 0, y = 0, scale = 1, fill = 0.5, label = 'SAVINGS'}) => {
  const id = useId().replace(/:/g, '');
  const h = 360 * fill;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`jg${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d8ecff" stopOpacity="0.55" /><stop offset="0.5" stopColor="#ffffff" stopOpacity="0.12" /><stop offset="1" stopColor="#d8ecff" stopOpacity="0.4" /></linearGradient>
        <linearGradient id={`jc${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c8921f" /><stop offset="0.4" stopColor="#ffe680" /><stop offset="1" stopColor="#b8801a" /></linearGradient>
        <clipPath id={`jk${id}`}><path d="M -130,-200 L 130,-200 C 160,-170 170,-120 170,-60 L 170,150 C 170,190 140,210 100,210 L -100,210 C -140,210 -170,190 -170,150 L -170,-60 C -170,-120 -160,-170 -130,-200 Z" /></clipPath>
      </defs>
      <ellipse cx={0} cy={226} rx={210} ry={20} fill="#000" opacity={0.35} style={{filter: 'blur(7px)'}} />
      <g clipPath={`url(#jk${id})`}>
        <rect x={-180} y={210 - h} width={360} height={h} fill={`url(#jc${id})`} opacity={0.95} />
        {Array.from({length: Math.round(fill * 10)}, (_, i) => <ellipse key={i} cx={-120 + (i * 53) % 240} cy={190 - i * (h / 11)} rx={44} ry={14} fill="#ffe680" stroke="#b8801a" strokeWidth={4} />)}
      </g>
      <path d="M -130,-200 L 130,-200 C 160,-170 170,-120 170,-60 L 170,150 C 170,190 140,210 100,210 L -100,210 C -140,210 -170,190 -170,150 L -170,-60 C -170,-120 -160,-170 -130,-200 Z" fill={`url(#jg${id})`} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -130,-150 C -142,-110 -144,-40 -144,60" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.6} />
      <rect x={-140} y={-240} width={280} height={52} rx={14} fill="#c9602e" stroke={INK} strokeWidth={7} /><path d="M -140,-214 L 140,-214" stroke="#8a3d18" strokeWidth={4} />
      <rect x={-96} y={-40} width={192} height={74} rx={12} fill="#f6f7ff" stroke={INK} strokeWidth={5} /><text x={0} y={10} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={Math.min(34, 168 / (label.length * 0.72))} fill="#2a2f6a" letterSpacing={1}>{label}</text>
    </g>
  );
};

// ---------------- card reader: screen shows DECLINED / APPROVED, keypad, a card slot ----------------
export const Terminal: React.FC<{x?: number; y?: number; scale?: number; rot?: number; state?: 'idle' | 'declined' | 'approved'}> = ({x = 0, y = 0, scale = 1, rot = 0, state = 'idle'}) => {
  const id = useId().replace(/:/g, '');
  const col = state === 'declined' ? '#ff4a5e' : state === 'approved' ? '#3ddc84' : '#6fa0ff';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <defs><linearGradient id={`tb${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5a607c" /><stop offset="1" stopColor="#1a1d34" /></linearGradient></defs>
      <ellipse cx={0} cy={196} rx={150} ry={16} fill="#000" opacity={0.3} style={{filter: 'blur(6px)'}} />
      <rect x={-120} y={-190} width={240} height={380} rx={34} fill={`url(#tb${id})`} stroke={INK} strokeWidth={8} />
      <rect x={-96} y={-166} width={192} height={120} rx={14} fill="#0a1020" stroke={INK} strokeWidth={5} /><rect x={-96} y={-166} width={192} height={120} rx={14} fill={col} opacity={state === 'idle' ? 0.12 : 0.28} />
      <text x={0} y={-92} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={state === 'idle' ? 22 : 30} fill={col} letterSpacing={2}>{state === 'declined' ? 'DECLINED' : state === 'approved' ? 'APPROVED' : 'TAP / INSERT'}</text>
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={r + '' + c} x={-78 + c * 56} y={-22 + r * 52} width={44} height={38} rx={10} fill="#2c3150" stroke={INK} strokeWidth={4} />))}
      <rect x={-78} y={140} width={156} height={26} rx={10} fill="#0b0d1c" stroke={INK} strokeWidth={4} />
      <path d="M -104,-180 L -40,-180" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.3} />
    </g>
  );
};
