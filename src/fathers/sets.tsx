import React from 'react';
import {INK, UI, HAND, SERIF} from './theme';
import {shade, mixc} from './People';
import {GiftPile, PhotoWall, Frame, Cup, Kite} from './props';

// ============================================================================================
// Sets of Two Fathers, drawn in stage coordinates (3200 x 1080, floor at y = 830). Every set returns depth layers for Stage: far (blurred, slow),
// mid (furniture), front (over the hips: desks, benches), fg (dark blurred foreground). Time is in seconds, for the things that move.
// ============================================================================================
export const FL = 830;
export type SetOut = {far: React.ReactNode; mid: React.ReactNode; front?: React.ReactNode; fg?: React.ReactNode; rim?: string};
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const Wall: React.FC<{c1: string; c2: string; y0?: number; y1?: number}> = ({c1, c2, y0 = -200, y1 = FL}) => (
  <g><defs><linearGradient id={'w' + c1.slice(1) + c2.slice(1)} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs><rect x={-400} y={y0} width={4000} height={y1 - y0} fill={`url(#w${c1.slice(1)}${c2.slice(1)})`} /></g>
);
const Floor: React.FC<{c1: string; c2: string; planks?: boolean}> = ({c1, c2, planks = true}) => (
  <g><defs><linearGradient id={'f' + c1.slice(1) + c2.slice(1)} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
    <rect x={-400} y={FL} width={4000} height={400} fill={`url(#f${c1.slice(1)}${c2.slice(1)})`} /><rect x={-400} y={FL - 4} width={4000} height={8} fill={shade(c1, -0.3)} opacity={0.6} />
    {planks && Array.from({length: 9}, (_, i) => <line key={i} x1={-400 + i * 520} y1={FL} x2={-400 + i * 520 - 200 + (i - 4) * 90} y2={1100} stroke={shade(c1, -0.25)} strokeWidth={3} opacity={0.35} />)}
  </g>
);
const Window: React.FC<{x: number; y: number; w: number; h: number; sky?: [string, string]; children?: React.ReactNode; frame?: string; curtains?: string; id: string}> = ({x, y, w, h, sky = ['#cfdbe8', '#eef2f6'], children, frame = '#f1ece2', curtains, id}) => (
  <g>
    <defs><linearGradient id={'sk' + id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient><clipPath id={'wc' + id}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
    <rect x={x - 18} y={y - 18} width={w + 36} height={h + 36} fill={frame} stroke={INK} strokeWidth={5} />
    <g clipPath={`url(#wc${id})`}><rect x={x} y={y} width={w} height={h} fill={`url(#sk${id})`} />{children}</g>
    <path d={`M ${x + w / 2},${y} L ${x + w / 2},${y + h} M ${x},${y + h * 0.55} L ${x + w},${y + h * 0.55}`} stroke={frame} strokeWidth={12} /><path d={`M ${x + w / 2},${y} L ${x + w / 2},${y + h} M ${x},${y + h * 0.55} L ${x + w},${y + h * 0.55}`} stroke={INK} strokeWidth={3} opacity={0.5} />
    <rect x={x - 18} y={y + h + 14} width={w + 36} height={18} fill={frame} stroke={INK} strokeWidth={4} />
    {curtains && <g><path d={`M ${x - 80},${y - 40} L ${x + 80},${y - 40} Q ${x + 40},${y + h * 0.5} ${x + 90},${y + h + 30} L ${x - 90},${y + h + 30} Z`} fill={curtains} stroke={INK} strokeWidth={4} opacity={0.96} /><path d={`M ${x + w + 80},${y - 40} L ${x + w - 80},${y - 40} Q ${x + w - 40},${y + h * 0.5} ${x + w - 90},${y + h + 30} L ${x + w + 90},${y + h + 30} Z`} fill={curtains} stroke={INK} strokeWidth={4} opacity={0.96} /></g>}
  </g>
);
export const Clock: React.FC<{x: number; y: number; r: number; min: number; sec?: number}> = ({x, y, r, min, sec = 0}) => {
  const a = (min % 60) * 6 + sec * 0.1, h = ((7 + min / 60) % 12) * 30;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 8} fill="#7a5a3e" stroke={INK} strokeWidth={4.4} /><circle r={r} fill="#fbf5e8" stroke={INK} strokeWidth={3} />
      {Array.from({length: 12}, (_, i) => <line key={i} x1={0} y1={-r + 6} x2={0} y2={-r + (i % 3 === 0 ? 20 : 13)} stroke={INK} strokeWidth={i % 3 === 0 ? 4 : 2.4} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={6} x2={0} y2={-r * 0.52} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${h})`} /><line x1={0} y1={8} x2={0} y2={-r * 0.8} stroke={INK} strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} /><circle r={5} fill={INK} />
    </g>
  );
};
const Plant: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#4f8a4b'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -34,0 L 34,0 L 26,-70 L -26,-70 Z" fill="#b4592f" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    {[-50, -24, 0, 26, 52].map((a, i) => <path key={i} d={`M 0,-70 Q ${a * 1.6},-${150 + (i % 2) * 40} ${a * 2.4},-${110 + i * 8} Q ${a},-${110 + (i % 2) * 30} 0,-70 Z`} fill={i % 2 ? c : shade(c, -0.15)} stroke={INK} strokeWidth={3.6} strokeLinejoin="round" />)}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------------------------------------
// the living room: Adam's (cold, quiet, a gift pile in the corner) or Sam's (warm, a photo wall)
export type LivingOpts = {t: number; warm?: boolean; giftN?: number; dust?: number; clockMin?: number; phoneLit?: number; samAnswer?: number; photoN?: number; season?: number; night?: boolean; tilt?: number};
export const LR = {chairX: 1860, sofaX: 900, tableX: 1500};
export const livingRoom = (o: LivingOpts): SetOut => {
  const w = !!o.warm, wall1 = w ? '#ecd3a9' : '#aebdcc', wall2 = w ? '#dcb88a' : '#97a8ba', sofa = w ? '#a8643d' : '#5d6779', lit = (o.samAnswer ?? 0) > 0 ? 1 : 0;
  const seasonSky: [string, string] = o.night ? ['#1a2344', '#2d3a63'] : w ? ['#fbd9a5', '#fff0d2'] : ['#c4d2e1', '#e8eef4'];
  return {
    far: (
      <g>
        <Wall c1={wall1} c2={wall2} />
        <rect x={-400} y={-200} width={4000} height={256} fill={shade(wall2, -0.14)} /><rect x={-400} y={52} width={4000} height={10} fill={shade(wall2, 0.2)} stroke={INK} strokeWidth={2} />
        <rect x={-400} y={560} width={4000} height={FL - 560} fill={shade(wall2, -0.06)} /><rect x={-400} y={556} width={4000} height={10} fill={shade(wall2, 0.18)} stroke={INK} strokeWidth={2} />
        <Window id={w ? 'lw' : 'lc'} x={2150} y={150} w={560} h={470} sky={seasonSky} curtains={w ? '#c47a45' : '#8794ab'}>
          {/* the street outside: a road, and across it Sam's house with its warm window */}
          <rect x={2150} y={520} width={560} height={110} fill={o.night ? '#262c44' : '#9ea6b2'} />
          <rect x={2150} y={512} width={560} height={14} fill="#b9bec6" />
          {!w && <g>
            <rect x={2290} y={270} width={330} height={250} fill="#c8b9a3" stroke={INK} strokeWidth={3} />
            <path d="M 2270,274 L 2455,200 L 2640,274 Z" fill="#8a5a46" stroke={INK} strokeWidth={3} />
            <rect x={2340} y={330} width={100} height={110} fill={lit ? '#ffcf7a' : '#e0b46a'} stroke={INK} strokeWidth={3} />
            {lit > 0 && <ellipse cx={2390} cy={385} rx={150} ry={130} fill="#ffcf7a" opacity={0.25} />}
            <rect x={2490} y={330} width={90} height={110} fill="#c9d6e3" stroke={INK} strokeWidth={3} /><rect x={2430} y={420} width={50} height={100} fill="#b4592f" stroke={INK} strokeWidth={3} />
            {/* tiny Sam in the lit window, phone to his ear once it rings */}
            <g transform="translate(2390 440)" opacity={lit}><rect x={-20} y={-40} width={40} height={42} rx={14} fill="#b4592f" stroke={INK} strokeWidth={2.4} /><circle cx={0} cy={-58} r={17} fill="#d79a70" stroke={INK} strokeWidth={2.4} /><rect x={12} y={-74} width={10} height={20} rx={3} fill="#2a2a32" /><path d="M -6,-54 q 6,5 12,0" fill="none" stroke={INK} strokeWidth={2.4} /></g>
          </g>}
          {w && <g><rect x={2290} y={300} width={330} height={230} fill="#c8b9a3" stroke={INK} strokeWidth={3} /><rect x={2340} y={340} width={100} height={110} fill="#c9d6e3" stroke={INK} strokeWidth={3} /></g>}
        </Window>
        <PhotoWall x={1000} y={330} n={w ? o.photoN ?? 12 : 0} kite s={0.72} glow={w ? 1 : 0} />
        {!w && <g><Frame x={640} y={310} w={130} h={170} kind="baby" /><Frame x={1330} y={300} w={150} h={120} kind="party" /></g>}
        <Clock x={w ? 1650 : 1010} y={w ? 250 : 240} r={74} min={o.clockMin ?? 0} />
      </g>
    ),
    mid: (
      <g>
        <Floor c1={w ? '#a87a52' : '#7b6a5c'} c2={w ? '#8a6040' : '#5e5047'} />
        <ellipse cx={1500} cy={940} rx={820} ry={86} fill={w ? '#c78b57' : '#6a7384'} stroke={INK} strokeWidth={4} opacity={0.9} />
        {/* sofa */}
        <g transform="translate(900 0)">
          <rect x={-340} y={470} width={680} height={250} rx={46} fill={shade(sofa, -0.12)} stroke={INK} strokeWidth={5} />
          <rect x={-380} y={600} width={90} height={230} rx={34} fill={sofa} stroke={INK} strokeWidth={5} /><rect x={290} y={600} width={90} height={230} rx={34} fill={sofa} stroke={INK} strokeWidth={5} />
          <rect x={-300} y={640} width={600} height={150} rx={30} fill={sofa} stroke={INK} strokeWidth={5} />
          <line x1={0} y1={650} x2={0} y2={790} stroke={INK} strokeWidth={3} opacity={0.5} /><rect x={-250} y={520} width={150} height={110} rx={26} fill={w ? '#e8c27a' : '#8f9db3'} stroke={INK} strokeWidth={4} transform="rotate(-6 -175 575)" />
        </g>
        {/* side table with the phone */}
        <g transform="translate(1500 0)">
          <rect x={-100} y={640} width={200} height={20} rx={6} fill="#8a6446" stroke={INK} strokeWidth={4.4} /><rect x={-80} y={660} width={14} height={170} fill="#8a6446" stroke={INK} strokeWidth={3.6} /><rect x={66} y={660} width={14} height={170} fill="#8a6446" stroke={INK} strokeWidth={3.6} />
          <path d="M 36,640 L 40,590 L 76,590 L 80,640 Z" fill="#f6efe2" stroke={INK} strokeWidth={3.4} />
          <rect x={-70} y={626} width={86} height={14} rx={4} fill={(o.phoneLit ?? 0) > 0 ? '#bfe0ff' : '#1d1d24'} stroke={INK} strokeWidth={3} />
          {(o.phoneLit ?? 0) > 0 && <ellipse cx={-27} cy={620} rx={90} ry={34} fill="#bfe0ff" opacity={0.3 * (o.phoneLit ?? 0)} />}
        </g>
        {/* the armchair by the window */}
        <g transform={`translate(${LR.chairX} 0)`}>
          <rect x={-170} y={480} width={340} height={290} rx={52} fill={shade(sofa, -0.18)} stroke={INK} strokeWidth={5} /><rect x={-210} y={620} width={74} height={210} rx={30} fill={sofa} stroke={INK} strokeWidth={5} /><rect x={136} y={620} width={74} height={210} rx={30} fill={sofa} stroke={INK} strokeWidth={5} />
        </g>
        {!w && <GiftPile x={330} y={FL + 6} n={o.giftN ?? 0} dust={o.dust ?? 0} s={0.8} />}
        {w && <g><Plant x={430} y={FL} s={1.2} /><Plant x={2780} y={FL} s={1.0} c="#5a9a52" /></g>}
        {!w && <Plant x={2860} y={FL} s={1.1} c="#6a8a62" />}
      </g>
    ),
    front: (<g>
      <rect x={LR.chairX - 178} y={654} width={356} height={74} rx={28} fill={shade(sofa, -0.02)} stroke={INK} strokeWidth={5} /><path d={`M ${LR.chairX - 150},686 Q ${LR.chairX},706 ${LR.chairX + 150},686`} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
      <rect x={LR.sofaX - 300} y={664} width={600} height={64} rx={26} fill={shade(sofa, -0.02)} stroke={INK} strokeWidth={5} />
    </g>),
    fg: <g><Plant x={150} y={1100} s={2.2} c={w ? '#4f8a4b' : '#52695a'} /></g>,
    rim: w ? 'rgba(255,200,120,.9)' : 'rgba(170,200,235,.8)',
  };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------
// the street: one-point perspective. Adam's house on the left (cold, grey door), Sam's on the right (warm brick, rust door), a tea stall at the corner
type Q = [number, number][];
const bil = (c: Q, u: number, v: number): [number, number] => {
  const a = [lerp(c[0][0], c[1][0], u), lerp(c[0][1], c[1][1], u)], b = [lerp(c[3][0], c[2][0], u), lerp(c[3][1], c[2][1], u)];
  return [lerp(a[0], b[0], v), lerp(a[1], b[1], v)];
};
const quad = (c: Q, u0: number, v0: number, u1: number, v1: number, fill: string, sw = 4, extra?: object) => {
  const pts = [bil(c, u0, v0), bil(c, u1, v0), bil(c, u1, v1), bil(c, u0, v1)];
  return <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" {...extra} />;
};
export type StreetOpts = {t: number; stall?: boolean; night?: boolean; sunset?: number; season?: number; adamLit?: number; samLit?: number};
const LEFT: Q = [[160, 40], [1180, 330], [1180, 650], [160, 960]];
const RIGHT: Q = [[3040, 40], [2020, 330], [2020, 650], [3040, 960]];
export const streetPoint = (side: 'adam' | 'sam', u: number, v: number): [number, number] => bil(side === 'adam' ? LEFT : RIGHT, u, v);
export const street = (o: StreetOpts): SetOut => {
  const sun = o.sunset ?? 0, sky: [string, string] = o.night ? ['#1b2748', '#3a4a78'] : sun > 0.2 ? ['#f2a95e', '#ffe2b0'] : ['#c4d2e1', '#eef2f6'];
  const leaf = [['#e9a6b6', '#c97c93'], ['#5a9a52', '#3f7a3c'], ['#d98a3a', '#b5651f'], ['#cfd6dc', '#aab4bc']][(o.season ?? 1) % 4];
  const win = (side: Q, u: number, lit: number, warm: boolean) => quad(side, u, 0.18, u + 0.17, 0.4, lit > 0 ? (warm ? '#ffd27a' : '#e9d9a8') : warm ? '#e8c68a' : '#b9c7d6', 4);
  const door = (side: Q, col: string) => (<g>{quad(side, 0.66, 0.42, 0.82, 1, col, 5)}{quad(side, 0.69, 0.5, 0.79, 0.68, shade(col, 0.2), 3)}</g>);
  return {
    far: (
      <g>
        <defs><linearGradient id="strsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
        <rect x={-400} y={-200} width={4000} height={900} fill="url(#strsky)" />
        {/* distant skyline at the end of the street */}
        {Array.from({length: 10}, (_, i) => <rect key={i} x={1180 + i * 84} y={300 + rnd(i, 1) * 70} width={80} height={200} fill={o.night ? '#2a355a' : sun > 0.2 ? '#d99a6a' : '#b3bfcc'} stroke={INK} strokeWidth={2} opacity={0.8} />)}
        {o.stall && <g transform="translate(1600 520)">
          <rect x={-70} y={-6} width={140} height={80} fill="#8a5a3a" stroke={INK} strokeWidth={3} /><path d="M -86,-6 L 0,-50 L 86,-6 Z" fill="#c0392b" stroke={INK} strokeWidth={3} strokeLinejoin="round" /><rect x={-50} y={14} width={100} height={26} fill="#f2d16b" opacity={0.9} />
          <rect x={92} y={44} width={64} height={12} fill="#8a6446" stroke={INK} strokeWidth={2.4} />
        </g>}
        {/* the road and the pavements */}
        <polygon points="1180,650 2020,650 3200,1100 0,1100" fill={o.night ? '#2b3047' : sun > 0.2 ? '#a07f66' : '#8c929c'} stroke={INK} strokeWidth={4} />
        <polygon points="1180,650 1210,650 700,1100 -60,1100" fill={shade('#9aa0aa', -0.1)} opacity={0.0} />
        {Array.from({length: 6}, (_, i) => { const v = (i + 1) / 7, y = lerp(650, 1090, v * v), w = lerp(8, 70, v * v); return <polygon key={i} points={`${1600 - w / 2},${y} ${1600 + w / 2},${y} ${1600 + w},${y + 38} ${1600 - w},${y + 38}`} fill="#f4ecdc" stroke={INK} strokeWidth={2.4} opacity={0.85} />; })}
        <polygon points="160,960 1180,650 1180,690 160,1100" fill="#b8b1a4" stroke={INK} strokeWidth={4} /><polygon points="3040,960 2020,650 2020,690 3040,1100" fill="#b8b1a4" stroke={INK} strokeWidth={4} />
      </g>
    ),
    mid: (
      <g>
        {/* Adam's house: modern, grey */}
        <polygon points={LEFT.map((p) => p.join(',')).join(' ')} fill={mixc('#a3adba', '#6a7384', o.night ? 0.55 : 0)} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {quad(LEFT, 0, 0, 1, 0.1, '#6e7787', 4)}
        {win(LEFT, 0.1, o.adamLit ?? 0, false)}{win(LEFT, 0.36, o.adamLit ?? 0, false)}{door(LEFT, '#38425a')}
        {quad(LEFT, 0.1, 0.52, 0.5, 0.8, '#bcc6d2', 4)}{quad(LEFT, 0.13, 0.55, 0.47, 0.77, o.adamLit ? '#e9d9a8' : '#8fa0b4', 3)}
        {/* Sam's house: warm brick */}
        <polygon points={RIGHT.map((p) => p.join(',')).join(' ')} fill={mixc('#c98a62', '#7a5040', o.night ? 0.5 : 0)} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {quad(RIGHT, 0, 0, 1, 0.1, '#8c4f35', 4)}
        {win(RIGHT, 0.1, o.samLit ?? 1, true)}{win(RIGHT, 0.36, o.samLit ?? 1, true)}{door(RIGHT, '#b4592f')}
        {quad(RIGHT, 0.1, 0.52, 0.5, 0.8, '#e8c68a', 4)}{quad(RIGHT, 0.13, 0.55, 0.47, 0.77, (o.samLit ?? 1) > 0 ? '#ffd27a' : '#c9a66a', 3)}
        {/* a tree on Sam's side, a lamp post on Adam's */}
        <g transform="translate(2480 760)"><rect x={-16} y={-250} width={32} height={260} fill="#6b4a36" stroke={INK} strokeWidth={4} /><circle cx={0} cy={-300} r={150} fill={leaf[0]} stroke={INK} strokeWidth={5} /><circle cx={-60} cy={-260} r={90} fill={leaf[1]} stroke={INK} strokeWidth={4} opacity={0.8} /></g>
        <g transform="translate(560 770)"><rect x={-7} y={-300} width={14} height={310} fill="#3a4050" stroke={INK} strokeWidth={3.4} /><circle cx={0} cy={-310} r={22} fill={o.night || sun > 0.2 ? '#ffe9a8' : '#f4f1e6'} stroke={INK} strokeWidth={3.4} /></g>
      </g>
    ),
    fg: <g><rect x={-100} y={1020} width={3400} height={140} fill="#2a2420" opacity={0.0} /></g>,
    rim: sun > 0.2 ? 'rgba(255,190,110,.9)' : 'rgba(180,205,235,.8)',
  };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------
// the hospital corridor: one-point perspective, cold light on the left, warm on the right. track = 0..1 pushes down the corridor
export const hospital = (o: {t: number; track?: number}): SetOut => {
  const T = o.track ?? 0;
  const door = (side: 'l' | 'r', i: number) => {
    const d = (i + 0.5 - T * 2.2) / 5; if (d < 0.02 || d > 1.05) return null;
    const k = 1 - d, x0 = side === 'l' ? lerp(1450, 40, k) : lerp(1750, 3160, k), w = (side === 'l' ? -1 : 1) * lerp(20, 150, k), y0 = lerp(450, 160, k), y1 = lerp(560, 960, k);
    return <g key={side + i}><polygon points={`${x0},${y0 + 40} ${x0 + w},${y0 + 14} ${x0 + w},${y1 - 20} ${x0},${y1}`} fill={side === 'l' ? '#a8c0d4' : '#d9b98a'} stroke={INK} strokeWidth={4} strokeLinejoin="round" /></g>;
  };
  return {
    far: (
      <g>
        <rect x={-400} y={-200} width={4000} height={1500} fill="#e9edf0" />
        <polygon points="-400,-200 1450,430 1450,570 -400,1180" fill="#cdd8e2" stroke={INK} strokeWidth={5} />
        <polygon points="3600,-200 1750,430 1750,570 3600,1180" fill="#ecd8b8" stroke={INK} strokeWidth={5} />
        <polygon points="-400,-200 3600,-200 1750,430 1450,430" fill="#f6f4ee" stroke={INK} strokeWidth={5} />
        <polygon points="-400,1180 1450,570 1750,570 3600,1180" fill="#bfc4c2" stroke={INK} strokeWidth={5} />
        <rect x={1450} y={430} width={300} height={140} fill="#f7fbff" stroke={INK} strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => { const d = (i + 0.5 - T * 2.2) / 4; if (d < 0.02 || d > 1.05) return null; const k = 1 - d, y = lerp(430, -40, k * k), w = lerp(40, 320, k * k); return <rect key={i} x={1600 - w / 2} y={y} width={w} height={lerp(10, 40, k * k)} fill="#fffdf2" stroke={INK} strokeWidth={3} />; })}
        {[0, 1, 2, 3, 4].map((i) => door('l', i))}{[0, 1, 2, 3, 4].map((i) => door('r', i))}
        <g transform="translate(1600 480)"><text textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={26} letterSpacing={6} fill="#6a7f94">MATERNITY</text></g>
      </g>
    ),
    mid: (
      <g>
        <g transform="translate(560 0)"><rect x={-130} y={770} width={260} height={24} fill="#9aa6b2" stroke={INK} strokeWidth={4} /><rect x={-110} y={794} width={12} height={40} fill="#6a7584" /><rect x={98} y={794} width={12} height={40} fill="#6a7584" /></g>
        <g transform="translate(2640 0)"><rect x={-130} y={770} width={260} height={24} fill="#b58a5e" stroke={INK} strokeWidth={4} /><rect x={-110} y={794} width={12} height={40} fill="#7a5a3e" /><rect x={98} y={794} width={12} height={40} fill="#7a5a3e" /></g>
      </g>
    ),
    rim: 'rgba(255,230,190,.8)',
  };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------
// Leo's fifth birthday party: bunting, balloons, a cake, a row of chairs with one empty one
export const party = (o: {t: number; adamHere?: boolean}): SetOut => ({
  far: (
    <g>
      <Wall c1="#f6dca8" c2="#eec68a" />
      <path d="M 300,150 Q 1600,330 2900,150" fill="none" stroke={INK} strokeWidth={4} />
      {Array.from({length: 17}, (_, i) => { const k = i / 16, x = lerp(300, 2900, k), y = 150 + 180 * Math.sin(k * Math.PI) * 0.97; return <polygon key={i} points={`${x - 28},${y} ${x + 28},${y} ${x},${y + 66}`} fill={['#e8553b', '#3f78c4', '#f2d16b', '#4c9a63'][i % 4]} stroke={INK} strokeWidth={3} />; })}
      <text x={1600} y={500} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={120} fill="#7a3a2a" opacity={0.85}>Happy Birthday Leo!</text>
      <Floor c1="#b8864f" c2="#8f6439" />
    </g>
  ),
  mid: (
    <g>
      {[[620, '#e8553b'], [760, '#3f78c4'], [2550, '#f2d16b'], [2720, '#4c9a63'], [2430, '#b83b6e']].map(([x, c], i) => <g key={i}><path d={`M ${x},${420 + Math.sin(o.t * 1.2 + i) * 8} L ${x},780`} stroke={INK} strokeWidth={2.4} /><ellipse cx={x as number} cy={380 + Math.sin(o.t * 1.2 + i) * 8} rx={58} ry={72} fill={c as string} stroke={INK} strokeWidth={4.4} /><ellipse cx={(x as number) - 18} cy={350 + Math.sin(o.t * 1.2 + i) * 8} rx={12} ry={20} fill="#fff" opacity={0.5} /></g>)}
      <g transform="translate(1500 0)"><rect x={-300} y={640} width={600} height={26} rx={8} fill="#f6efe2" stroke={INK} strokeWidth={5} /><rect x={-270} y={666} width={20} height={170} fill="#8a6446" stroke={INK} strokeWidth={3} /><rect x={250} y={666} width={20} height={170} fill="#8a6446" stroke={INK} strokeWidth={3} />
        <rect x={-110} y={560} width={220} height={80} rx={12} fill="#fbf5e8" stroke={INK} strokeWidth={5} /><rect x={-110} y={560} width={220} height={26} rx={12} fill="#e98aa1" stroke={INK} strokeWidth={4} />
        {[-70, -35, 0, 35, 70].map((x, i) => <g key={i}><rect x={x - 4} y={518} width={8} height={42} fill={['#e8553b', '#3f78c4', '#f2d16b', '#4c9a63', '#b83b6e'][i]} stroke={INK} strokeWidth={2} /><ellipse cx={x} cy={510 - Math.sin(o.t * 9 + i) * 2} rx={7} ry={11} fill="#ffcf5a" /></g>)}</g>
      {/* chairs: the one at the right is empty, waiting for Adam */}
      {[[2000, 0], [2200, 0], [2400, 1]].map(([x, e], i) => <g key={i} transform={`translate(${x} 0)`}><rect x={-60} y={640} width={120} height={20} rx={6} fill={e ? '#d9c8a6' : '#8a6446'} stroke={INK} strokeWidth={4} /><rect x={-60} y={540} width={16} height={290} fill={e ? '#d9c8a6' : '#8a6446'} stroke={INK} strokeWidth={3.6} /><rect x={44} y={660} width={14} height={170} fill={e ? '#d9c8a6' : '#8a6446'} stroke={INK} strokeWidth={3.6} />{e ? <text x={0} y={520} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={42} fill="#7a3a2a">reserved</text> : null}</g>)}
    </g>
  ),
  rim: 'rgba(255,215,150,.9)',
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// the school auditorium: stage and curtains up top, rows of seat backs in the dark below. The seat at (seatX, 880) is Adam's, empty, with a costume tag
export const AUD = {seatX: 1180, samX: 2180};
export const auditorium = (o: {t: number; curtain?: number; spot?: number; leoOn?: boolean; tag?: string}): SetOut => {
  const c = o.curtain ?? 1;
  return {
    far: (
      <g>
        <rect x={-400} y={-200} width={4000} height={1500} fill="#241a22" />
        <rect x={700} y={80} width={1800} height={460} fill="#6a4a3a" stroke={INK} strokeWidth={6} />
        <rect x={700} y={430} width={1800} height={110} fill="#9a7048" stroke={INK} strokeWidth={5} />
        <rect x={780} y={110} width={1640} height={320} fill="#4a3a63" />
        <path d="M 1600,80 L 1250,440 L 1950,440 Z" fill="#fff1c4" opacity={0.28 * (o.spot ?? 1)} />
        <path d={`M 700,60 L ${700 + 880 * (1 - c)},60 Q ${700 + 840 * (1 - c)},300 ${700 + 800 * (1 - c)},560 L 700,560 Z`} fill="#a8322f" stroke={INK} strokeWidth={5} />
        <path d={`M 2500,60 L ${2500 - 880 * (1 - c)},60 Q ${2500 - 840 * (1 - c)},300 ${2500 - 800 * (1 - c)},560 L 2500,560 Z`} fill="#a8322f" stroke={INK} strokeWidth={5} />
        <rect x={700} y={50} width={1800} height={46} fill="#7e2220" stroke={INK} strokeWidth={5} />
      </g>
    ),
    mid: (
      <g>
        {[0, 1, 2].map((r) => <g key={r} transform={`translate(0 ${r * 150})`} opacity={1 - r * 0.0}>
          {Array.from({length: 9}, (_, i) => { const x = 360 + i * 300, sc = 1 + r * 0.18; return <g key={i}><rect x={x - 110 * sc} y={620 + r * 20} width={220 * sc} height={150 * sc} rx={22} fill={['#6e2f3a', '#5c2630', '#7a3640'][r]} stroke={INK} strokeWidth={4.4} />{r === 0 && i !== 4 && i !== 7 && <circle cx={x + (rnd(i, 2) - 0.5) * 40} cy={590} r={42} fill="#2a1d1a" stroke={INK} strokeWidth={3} />}</g>; })}
        </g>)}
      </g>
    ),
    front: (
      <g>
        {/* Adam's empty seat, folded up, with the costume tag taped on */}
        <g transform={`translate(${AUD.seatX} 0)`}>
          <rect x={-120} y={760} width={240} height={190} rx={24} fill="#8a3440" stroke={INK} strokeWidth={5} /><rect x={-100} y={830} width={200} height={20} rx={10} fill="#a8454f" opacity={0.6} />
          <path d="M -20,780 L -20,740" stroke={INK} strokeWidth={3} /><g transform="translate(-20 810) rotate(-6)"><rect x={-110} y={0} width={220} height={74} rx={8} fill="#f4ecdc" stroke={INK} strokeWidth={4} /><circle cx={-90} cy={12} r={6} fill="#cfc4aa" stroke={INK} strokeWidth={2} /><text x={0} y={46} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={34} fill="#7a3a2a">{o.tag ?? 'BEST COSTUME'}</text></g>
        </g>
        <g transform={`translate(${AUD.samX} 0)`}><rect x={-120} y={760} width={240} height={190} rx={24} fill="#8a3440" stroke={INK} strokeWidth={5} /></g>
      </g>
    ),
    rim: 'rgba(255,230,170,.75)',
  };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------
// Adam's night office: a city window, a desk, a lamp, papers
export const office = (o: {t: number; weekend?: boolean; clockMin?: number}): SetOut => ({
  far: (
    <g>
      <Wall c1="#1e2740" c2="#2b3658" />
      <Window id="of" x={1900} y={150} w={780} h={460} sky={['#10162b', '#26325a']} frame="#3a4560">
        {Array.from({length: 16}, (_, i) => <rect key={i} x={1900 + i * 52} y={330 + rnd(i, 1) * 160} width={46} height={300} fill="#161d38" stroke="#0e1428" strokeWidth={2} />)}
        {Array.from({length: 90}, (_, i) => <rect key={i} x={1910 + (i % 15) * 52 + 8} y={350 + Math.floor(i / 15) * 44 + rnd(i, 3) * 10} width={12} height={16} fill={rnd(i, 4) > 0.55 ? '#ffd27a' : '#2a3350'} />)}
      </Window>
      <Clock x={1000} y={250} r={70} min={o.clockMin ?? 0} />
      <Frame x={600} y={330} w={150} h={190} kind="baby" down />
    </g>
  ),
  mid: (
    <g>
      <Floor c1="#4a4048" c2="#352d35" planks={false} />
      <rect x={-400} y={800} width={4000} height={40} fill="#2a2330" opacity={0.0} />
      <g transform="translate(560 0)"><rect x={-90} y={560} width={180} height={270} fill="#3a4560" stroke={INK} strokeWidth={4} />{[0, 1, 2].map((i) => <line key={i} x1={-90} y1={620 + i * 70} x2={90} y2={620 + i * 70} stroke={INK} strokeWidth={3} />)}</g>
    </g>
  ),
  front: (
    <g>
      <rect x={1120} y={690} width={1150} height={30} rx={8} fill="#9a6e48" stroke={INK} strokeWidth={5} /><rect x={1150} y={720} width={1090} height={120} fill="#7e5638" stroke={INK} strokeWidth={5} />
      <rect x={1190} y={730} width={470} height={90} fill="#6a4a30" stroke={INK} strokeWidth={4} /><circle cx={1425} cy={775} r={10} fill="#d9b25a" />
      <g transform="translate(2040 690)"><path d="M -40,0 L 40,0 L 20,-110 L -20,-110 Z" fill="#2a3350" stroke={INK} strokeWidth={4} /><path d="M 0,-110 L 70,-190" stroke={INK} strokeWidth={6} /><path d="M 40,-210 L 110,-190 L 90,-150 L 30,-170 Z" fill="#ffd27a" stroke={INK} strokeWidth={4} /><ellipse cx={80} cy={-100} rx={160} ry={60} fill="#ffd27a" opacity={0.12} /></g>
      <g transform="translate(1380 690)">{[0, 1, 2, 3].map((i) => <rect key={i} x={-70 + (i % 2) * 8} y={-18 - i * 16} width={150} height={16} fill={i % 2 ? '#f4ecdc' : '#e0d6c0'} stroke={INK} strokeWidth={3} transform={`rotate(${(i - 1.5) * 2})`} />)}</g>
    </g>
  ),
  rim: 'rgba(130,170,255,.7)',
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// the hallway outside Leo's bedroom door: gadget boxes stacked beside it, a seam of blue phone light under the door
export const leoDoor = (o: {t: number; boxes?: number; glow?: number; open?: number; label?: string; warm?: boolean}): SetOut => ({
  far: (
    <g>
      <Wall c1="#6b6a82" c2="#585670" />
      <rect x={-400} y={620} width={4000} height={210} fill="#4c4a62" /><rect x={-400} y={612} width={4000} height={10} fill="#7a7894" stroke={INK} strokeWidth={2} />
      <g transform="translate(1700 0)">
        <rect x={-190} y={190} width={380} height={640} fill="#d8cdb8" stroke={INK} strokeWidth={6} /><rect x={-160} y={220} width={320} height={610} fill="#8a6446" stroke={INK} strokeWidth={5} />
        <rect x={-120} y={270} width={110} height={200} fill="#7a5a3e" stroke={INK} strokeWidth={3.4} /><rect x={10} y={270} width={110} height={200} fill="#7a5a3e" stroke={INK} strokeWidth={3.4} /><rect x={-120} y={500} width={240} height={250} fill="#7a5a3e" stroke={INK} strokeWidth={3.4} />
        <circle cx={118} cy={560} r={14} fill="#d9b25a" stroke={INK} strokeWidth={3} />
        <g transform="translate(0 150) rotate(-4)"><rect x={-110} y={-70} width={220} height={60} rx={6} fill="#f4ecdc" stroke={INK} strokeWidth={4} /><text x={0} y={-28} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={32} letterSpacing={5} fill="#7a3a2a">{o.label ?? 'LEO · KNOCK'}</text></g>
        <rect x={-160} y={818} width={320} height={14} fill="#bfe0ff" opacity={0.85 * (o.glow ?? 1)} /><polygon points="-160,832 160,832 300,1000 -300,1000" fill="#bfe0ff" opacity={0.28 * (o.glow ?? 1)} />
      </g>
      <g transform="translate(700 0)"><rect x={-18} y={300} width={36} height={80} fill="#f2d16b" stroke={INK} strokeWidth={3.4} /><ellipse cx={0} cy={300} rx={90} ry={50} fill="#ffe6a0" opacity={0.15} /></g>
      <Floor c1="#5a5470" c2="#443e58" planks={false} />
    </g>
  ),
  mid: (
    <g>
      <rect x={1180} y={836} width={1040} height={110} rx={10} fill="#6c5a52" stroke={INK} strokeWidth={4} opacity={0.0} />
      {/* new boxes pile up beside the door: a phone box, shoe boxes, a gadget box */}
      <GiftPile x={1180} y={FL + 6} n={o.boxes ?? 3} s={0.55} dust={0} />
    </g>
  ),
  rim: 'rgba(180,200,255,.7)',
});

// Leo's room at night, phone glow on his face
export const leoRoom = (o: {t: number}): SetOut => ({
  far: (<g><Wall c1="#232a4a" c2="#1a2040" /><rect x={500} y={200} width={420} height={300} fill="#101636" stroke={INK} strokeWidth={5} /><Floor c1="#2c2c46" c2="#222238" planks={false} /><rect x={1900} y={560} width={760} height={30} fill="#5a4a60" stroke={INK} strokeWidth={5} /><rect x={1930} y={590} width={20} height={240} fill="#5a4a60" /><rect x={2610} y={590} width={20} height={240} fill="#5a4a60" /></g>),
  mid: (<g><rect x={1100} y={600} width={520} height={230} rx={30} fill="#34406e" stroke={INK} strokeWidth={5} /><rect x={1100} y={560} width={520} height={90} rx={30} fill="#3f4d86" stroke={INK} strokeWidth={5} /></g>),
  front: (<g><rect x={1080} y={668} width={560} height={74} rx={28} fill="#3a4878" stroke={INK} strokeWidth={5} /></g>),
  rim: 'rgba(150,190,255,.85)',
});

// the stairs of Sam's house, a warm lamp
export const stairs = (o: {t: number}): SetOut => ({
  far: (<g><Wall c1="#ecd3a9" c2="#d9b283" />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1100 + i * 220} y={300 + i * 110} width={2200} height={110} fill={i % 2 ? '#a8794f' : '#b8864f'} stroke={INK} strokeWidth={4} />)}<g transform="translate(700 340)"><rect x={-14} y={0} width={28} height={110} fill="#7a5a3e" stroke={INK} strokeWidth={3} /><path d="M -60,0 L 60,0 L 36,-80 L -36,-80 Z" fill="#ffe6a0" stroke={INK} strokeWidth={4} /><ellipse cx={0} cy={-30} rx={190} ry={150} fill="#ffe6a0" opacity={0.2} /></g></g>),
  mid: (<g><Floor c1="#a8794f" c2="#8a5c3a" /><rect x={1240} y={720} width={1500} height={110} fill="#a8794f" stroke={INK} strokeWidth={5} /><rect x={1460} y={610} width={1400} height={110} fill="#b8864f" stroke={INK} strokeWidth={5} /></g>),
  rim: 'rgba(255,205,130,.9)',
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// the tea stall at the corner, with its bench, in four seasons. sunset = 0..1 golden light
export const teaStall = (o: {t: number; season?: number; sunset?: number; cups?: number; snow?: boolean}): SetOut => {
  const s = o.season ?? 1, sun = o.sunset ?? 0, leaf = [['#e9a6b6', '#c97c93'], ['#5a9a52', '#3f7a3c'], ['#d98a3a', '#b5651f'], ['#cfd6dc', '#aab4bc']][s % 4];
  const sky: [string, string] = sun > 0.2 ? ['#f2a95e', '#ffe2b0'] : s === 3 ? ['#c9d3dd', '#eef1f4'] : ['#a9d3ea', '#eaf5fb'];
  return {
    far: (
      <g>
        <defs><linearGradient id="tsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
        <rect x={-400} y={-200} width={4000} height={1100} fill="url(#tsk)" />
        {sun > 0.2 && <circle cx={620} cy={500} r={150} fill="#fff1c4" opacity={0.85} />}
        {Array.from({length: 12}, (_, i) => <rect key={i} x={i * 280 - 100} y={300 + rnd(i, 1) * 160} width={250} height={600} fill={sun > 0.2 ? '#d49a6a' : s === 3 ? '#b7c0ca' : '#b9c9d6'} stroke={INK} strokeWidth={3} opacity={0.75} />)}
        <g transform="translate(2750 800)"><rect x={-24} y={-380} width={48} height={400} fill="#6b4a36" stroke={INK} strokeWidth={5} />
          {s === 3 ? <g stroke={INK} strokeWidth={5} fill="none"><path d="M 0,-380 L -160,-520 M 0,-380 L 150,-540 M 0,-300 L -120,-380 M 0,-300 L 130,-400" /><path d="M -160,-520 q -4,-26 24,-46 M 150,-540 q 14,-28 40,-36" stroke="#e8eef2" strokeWidth={8} /></g>
            : <g><circle cx={0} cy={-460} r={200} fill={leaf[0]} stroke={INK} strokeWidth={5} /><circle cx={-110} cy={-400} r={120} fill={leaf[1]} stroke={INK} strokeWidth={4} opacity={0.85} /><circle cx={120} cy={-410} r={110} fill={leaf[1]} stroke={INK} strokeWidth={4} opacity={0.7} /></g>}
        </g>
      </g>
    ),
    mid: (
      <g>
        <Floor c1={s === 3 ? '#cdd4da' : sun > 0.2 ? '#b98b60' : '#a8967c'} c2={s === 3 ? '#aab3ba' : '#8e7458'} planks={false} />
        <rect x={-400} y={FL - 10} width={4000} height={20} fill="#c9c2b0" stroke={INK} strokeWidth={3} />
        {/* the stall */}
        <g transform="translate(560 0)">
          <rect x={-250} y={420} width={500} height={410} fill="#9a6e48" stroke={INK} strokeWidth={6} /><rect x={-210} y={600} width={420} height={50} fill="#7e5638" stroke={INK} strokeWidth={4} />
          <path d="M -300,430 L 300,430 L 260,320 L -260,320 Z" fill="#c0392b" stroke={INK} strokeWidth={6} strokeLinejoin="round" />{[-200, -100, 0, 100, 200].map((x, i) => <path key={i} d={`M ${x - 50},430 L ${x - 40},320 L ${x + 10},320 L ${x + 0},430 Z`} fill={i % 2 ? '#fbf5e8' : '#c0392b'} stroke={INK} strokeWidth={3.4} opacity={0.95} />)}
          <rect x={-60} y={560} width={110} height={46} rx={12} fill="#c9ccd2" stroke={INK} strokeWidth={4} /><path d="M 50,572 q 40,-4 30,20" fill="none" stroke={INK} strokeWidth={5} />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${-170 + i * 34},${600} l 5,-40 l 22,0 l 5,40 z`} fill="#f6efe2" stroke={INK} strokeWidth={3} />)}
          {[-30, 0, 30].map((dx, i) => <path key={i} d={`M ${-6 + dx},548 q 10,-18 0,-34 q -10,-16 4,-34`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.4 + 0.2 * Math.sin(o.t * 3 + i)} />)}
          <text x={0} y={490} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={44} letterSpacing={6} fill="#fbf5e8" stroke={INK} strokeWidth={1.2}>CHAI</text>
        </g>
        <g>
          <rect x={1260} y={640} width={1000} height={34} rx={8} fill="#8a6446" stroke={INK} strokeWidth={5} />
          <rect x={1300} y={674} width={22} height={160} fill="#7a5a3e" stroke={INK} strokeWidth={4} /><rect x={2200} y={674} width={22} height={160} fill="#7a5a3e" stroke={INK} strokeWidth={4} />
        </g>
        {s === 3 && Array.from({length: 40}, (_, i) => <circle key={i} cx={(rnd(i, 1) * 3400 + o.t * 30) % 3400 - 100} cy={((rnd(i, 2) * 1100 + o.t * 90 * (0.5 + rnd(i, 3))) % 1100)} r={3 + rnd(i, 4) * 4} fill="#fff" opacity={0.85} />)}
      </g>
    ),
    front: (
      <g>
        {Array.from({length: o.cups ?? 2}, (_, i) => <Cup key={i} x={1600 + (i - ((o.cups ?? 2) - 1) / 2) * 190 + 20} y={640} s={0.8} t={o.t} steam={1} />)}
      </g>
    ),
    rim: sun > 0.2 ? 'rgba(255,190,110,.95)' : 'rgba(255,230,170,.8)',
  };
};

// a green field for the kite
export const park = (o: {t: number; season?: number}): SetOut => {
  const s = o.season ?? 1, g = ['#9ccf7a', '#78b45a', '#c8a24a', '#e6edf0'][s % 4];
  return {
    far: (<g><defs><linearGradient id="psk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fd0ea" /><stop offset="1" stopColor="#e9f5fb" /></linearGradient></defs><rect x={-400} y={-200} width={4000} height={1100} fill="url(#psk)" />
      {[[400, 150], [1300, 120], [2300, 170], [2900, 100]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y + 120})`} opacity={0.95}><ellipse cx={0} cy={0} rx={130} ry={44} fill="#fff" /><ellipse cx={-70} cy={10} rx={80} ry={32} fill="#fff" /><ellipse cx={80} cy={12} rx={90} ry={34} fill="#fff" /></g>)}
      <path d="M -400,640 Q 600,470 1500,620 T 3600,560 L 3600,1100 L -400,1100 Z" fill={shade(g, -0.12)} stroke={INK} strokeWidth={4} /></g>),
    mid: (<g><path d="M -400,730 Q 800,640 1800,740 T 3600,700 L 3600,1100 L -400,1100 Z" fill={g} stroke={INK} strokeWidth={5} />
      <g transform="translate(300 740)"><rect x={-14} y={-240} width={28} height={250} fill="#6b4a36" stroke={INK} strokeWidth={4} /><circle cx={0} cy={-300} r={150} fill={['#e9a6b6', '#5a9a52', '#d98a3a', '#cfd6dc'][s % 4]} stroke={INK} strokeWidth={5} /></g></g>),
    rim: 'rgba(255,235,180,.85)',
  };
};

// Sam's kitchen: a table, two chairs, a window
export const kitchen = (o: {t: number; night?: boolean}): SetOut => ({
  far: (<g><Wall c1="#efd9b0" c2="#dfc08e" /><Window id="kt" x={1200} y={170} w={420} h={360} sky={o.night ? ['#1a2344', '#2d3a63'] : ['#cfe3ef', '#f4f8fa']} curtains="#c47a45" />
    <rect x={2100} y={180} width={900} height={330} fill="#c98a5a" stroke={INK} strokeWidth={5} />{[0, 1, 2].map((i) => <rect key={i} x={2120 + i * 295} y={200} width={270} height={290} fill="#b8764a" stroke={INK} strokeWidth={4} />)}
    <Clock x={700} y={260} r={64} min={20} /><Floor c1="#b88c62" c2="#94683f" /></g>),
  mid: (<g><g transform="translate(1600 0)"><ellipse cx={0} cy={700} rx={260} ry={42} fill="#c78b57" stroke={INK} strokeWidth={5} /><rect x={-20} y={700} width={40} height={130} fill="#8a6446" stroke={INK} strokeWidth={4} /></g>
    {[1100, 2100].map((x) => <g key={x} transform={`translate(${x} 0)`}><rect x={-70} y={640} width={140} height={24} rx={8} fill="#8a6446" stroke={INK} strokeWidth={4} /><rect x={-66} y={430} width={20} height={400} fill="#8a6446" stroke={INK} strokeWidth={4} /><rect x={46} y={664} width={16} height={166} fill="#8a6446" stroke={INK} strokeWidth={4} /></g>)}</g>),
  rim: 'rgba(255,205,130,.9)',
});

// the dark hallway of Leo's flat (cut to while Adam waits on the call)
export const leoFlat = (o: {t: number}): SetOut => ({
  far: (<g><Wall c1="#4a4c5e" c2="#3a3c4e" /><Floor c1="#4c4a58" c2="#383644" planks={false} /><rect x={1450} y={220} width={300} height={610} fill="#2a2c3a" stroke={INK} strokeWidth={5} /><rect x={1500} y={280} width={200} height={540} fill="#1c1e2a" /><text x={1600} y={190} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={26} letterSpacing={6} fill="#8a90a8">FLAT 4B</text></g>),
  mid: (<g><rect x={760} y={640} width={190} height={190} fill="#6a5a50" stroke={INK} strokeWidth={4} /><rect x={2300} y={560} width={240} height={270} fill="#5a4a46" stroke={INK} strokeWidth={4} /></g>),
  rim: 'rgba(150,170,210,.6)',
});
