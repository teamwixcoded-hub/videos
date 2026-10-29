import React, {useId} from 'react';
import {INK, UI} from './theme';
import {shade, mixc} from './People';

// ============================================================================================
// Props with volume: boxes with a lit top, a shaded side and a satin ribbon; a laptop with a metal lid, hinge and keyboard deck; a cup on a saucer;
// a kite with sticks and a swaying tail. Every prop sits on a soft contact shadow. Same Man palette: navy ink, glossy highlights.
// ============================================================================================
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const Shadow: React.FC<{cx?: number; cy?: number; rx: number; ry: number; o?: number}> = ({cx = 0, cy = 0, rx, ry, o = 0.4}) => {
  const id = useId().replace(/:/g, '');
  return (<g><defs><radialGradient id={'sh' + id}><stop offset="0" stopColor="#05060f" stopOpacity={o} /><stop offset="0.6" stopColor="#05060f" stopOpacity={o * 0.5} /><stop offset="1" stopColor="#05060f" stopOpacity="0" /></radialGradient></defs><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#sh${id})`} /></g>);
};
export {Shadow};

// ---------------------------------------------------------------- gift pile (3D boxes)
const BOXES: {w: number; h: number; c: string; r: string; tag?: string}[] = [
  {w: 250, h: 130, c: '#d04a3c', r: '#f6d977', tag: 'CAR'}, {w: 230, h: 120, c: '#3b86c8', r: '#f6e7b4'}, {w: 300, h: 150, c: '#8a56b8', r: '#f6d977', tag: 'COSTUME'}, {w: 240, h: 120, c: '#e8963a', r: '#fff1c4'},
  {w: 270, h: 140, c: '#33a784', r: '#f6d977', tag: 'PHONE'}, {w: 230, h: 120, c: '#c94a7e', r: '#f6e7b4'}, {w: 280, h: 140, c: '#4458a8', r: '#f6d977', tag: 'LAPTOP'}, {w: 220, h: 110, c: '#d6b030', r: '#fff1c4'},
];
export const giftTop = (n: number) => { let t = 0; for (let i = 0; i < Math.min(8, Math.ceil(n)); i++) t += BOXES[i].h - 6; return t; };
const Box: React.FC<{w: number; h: number; c: string; r: string; tag?: string; dust: number; id: string}> = ({w, h, c, r, tag, dust, id}) => {
  const d = w * 0.15, col = mixc(c, '#8a8478', dust * 0.5), rib = mixc(r, '#8a8478', dust * 0.45);
  return (
    <g>
      <defs>
        <linearGradient id={'f' + id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={shade(col, 0.16)} /><stop offset="1" stopColor={shade(col, -0.16)} /></linearGradient>
        <linearGradient id={'s' + id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={shade(col, -0.3)} /><stop offset="1" stopColor={shade(col, -0.45)} /></linearGradient>
      </defs>
      <polygon points={`${w / 2},0 ${w / 2 + d},${-d * 0.7} ${w / 2 + d},${h - d * 0.7} ${w / 2},${h}`} fill={`url(#s${id})`} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <polygon points={`${-w / 2},0 ${w / 2},0 ${w / 2 + d},${-d * 0.7} ${-w / 2 + d},${-d * 0.7}`} fill={shade(col, 0.28)} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <rect x={-w / 2} y={0} width={w} height={h} rx={5} fill={`url(#f${id})`} stroke={INK} strokeWidth={3} />
      <rect x={-w / 2 + 6} y={6} width={w - 12} height={10} rx={5} fill="#fff" opacity={0.12} />
      {/* satin ribbon: front band, the top band running back, the shaded side band */}
      <rect x={-w * 0.07} y={0} width={w * 0.14} height={h} fill={rib} stroke={INK} strokeWidth={2.4} />
      <polygon points={`${-w * 0.07},0 ${w * 0.07},0 ${w * 0.07 + d},${-d * 0.7} ${-w * 0.07 + d},${-d * 0.7}`} fill={shade(rib, 0.22)} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <polygon points={`${w / 2},${h * 0.42} ${w / 2 + d},${h * 0.42 - d * 0.7} ${w / 2 + d},${h * 0.42 - d * 0.7 + 14} ${w / 2},${h * 0.42 + 14}`} fill={shade(rib, -0.3)} />
      <g transform={`translate(${d * 0.5} ${-d * 0.35})`}>
        {[-1, 1].map((s) => <ellipse key={s} cx={s * 26} cy={-14} rx={26} ry={15} fill={shade(rib, 0.08)} stroke={INK} strokeWidth={2.6} transform={`rotate(${s * 26} ${s * 26} -14)`} />)}
        <circle cx={0} cy={-8} r={10} fill={rib} stroke={INK} strokeWidth={2.6} /><ellipse cx={-3} cy={-11} rx={4} ry={2.4} fill="#fff" opacity={0.6} />
      </g>
      {tag && <text x={w / 2 - 20} y={h - 18} textAnchor="end" fontFamily={UI} fontWeight={700} fontSize={22} letterSpacing={3} fill="#fff" opacity={0.78}>{tag}</text>}
      {dust > 0.15 && <polygon points={`${-w / 2},0 ${w / 2},0 ${w / 2 + d},${-d * 0.7} ${-w / 2 + d},${-d * 0.7}`} fill="#d8d3c6" opacity={dust * 0.55} />}
    </g>
  );
};
export const GiftPile: React.FC<{x: number; y: number; n: number; dust?: number; s?: number}> = ({x, y, n, dust = 0, s = 1}) => {
  let top = 0; const id0 = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {n > 0 && <Shadow cx={20} cy={4} rx={230} ry={26} o={0.5} />}
      {BOXES.slice(0, Math.min(8, Math.max(0, Math.ceil(n)))).map((b, i) => {
        const grow = Math.min(1, n - i), off = (rnd(i, 3) - 0.5) * 56, rot = (rnd(i, 4) - 0.5) * 6;
        const yy = -top - b.h; top += b.h - 6;
        return (<g key={i} transform={`translate(${off} ${yy + (1 - grow) * -60}) rotate(${rot})`} opacity={grow}><Box {...b} dust={dust} id={id0 + i} /></g>);
      })}
      {dust > 0.3 && <path d="M -120,-30 q 30,-40 60,0 M 60,-90 q 20,-30 50,-6" fill="none" stroke="#e8e2d4" strokeWidth={2} opacity={dust * 0.6} />}
    </g>
  );
};

// ---------------------------------------------------------------- laptop: open (lid toward us, or screen toward us)
export const Laptop: React.FC<{x: number; y: number; s?: number; open?: number; glow?: number; screenToViewer?: boolean}> = ({x, y, s = 1, open = 1, glow = 1, screenToViewer = false}) => {
  const lid = 150 * open, id = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={'lm' + id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c3cae6" /><stop offset="0.5" stopColor="#8e97bd" /><stop offset="1" stopColor="#6b7499" /></linearGradient>
        <linearGradient id={'bs' + id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#aab2d2" /><stop offset="1" stopColor="#6b7499" /></linearGradient>
      </defs>
      <Shadow cx={0} cy={26} rx={190} ry={20} o={0.5} />
      {/* base: keyboard deck seen at a low angle, then the front lip */}
      <path d="M -126,2 L 126,2 L 156,22 L -156,22 Z" fill="#2a3050" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
      {Array.from({length: 3}, (_, r) => Array.from({length: 11}, (_, k) => <rect key={r + '-' + k} x={-116 + k * 21 + r * 3} y={5 + r * 5} width={16} height={3.4} rx={1} fill="#5b638a" />))}
      <path d="M -156,22 L 156,22 L 152,30 Q 0,36 -152,30 Z" fill={`url(#bs${id})`} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
      {open > 0.02 && (screenToViewer
        ? <g>
            <rect x={-132} y={-lid - 6} width={264} height={lid + 8} rx={12} fill="#1e2238" stroke={INK} strokeWidth={3.4} />
            <rect x={-120} y={-lid + 6} width={240} height={lid - 14} rx={5} fill="#e9f1fb" opacity={glow} />
            <rect x={-100} y={-lid + 24} width={120} height={10} rx={4} fill="#9db6d6" /><rect x={-100} y={-lid + 46} width={190} height={8} rx={4} fill="#c3d2e6" /><rect x={-100} y={-lid + 64} width={150} height={8} rx={4} fill="#c3d2e6" />
            <ellipse cx={0} cy={14} rx={170} ry={14} fill="#bcd8ff" opacity={0.16 * glow} />
          </g>
        : <g>
            <path d={`M -130,2 L 130,2 L 120,${-lid} L -120,${-lid} Z`} fill={`url(#lm${id})`} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
            <path d={`M -118,-6 L -104,-6 L -96,${-lid + 10} L -110,${-lid + 10} Z`} fill="#fff" opacity={0.22} />
            <circle cx={0} cy={-lid / 2} r={11} fill="#e9eeff" opacity={0.65} stroke={INK} strokeWidth={1.6} /><circle cx={0} cy={-lid / 2} r={20} fill="#bcd0ff" opacity={0.14} />
            <rect x={-112} y={-3} width={224} height={7} rx={3} fill="#4b5378" stroke={INK} strokeWidth={2} />
          </g>)}
    </g>
  );
};

// ---------------------------------------------------------------- cup and saucer, steaming
export const Cup: React.FC<{x: number; y: number; s?: number; steam?: number; t?: number}> = ({x, y, s = 1, steam = 1, t = 0}) => {
  const id = useId().replace(/:/g, '');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><linearGradient id={'cp' + id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#e6e3f2" /><stop offset="1" stopColor="#b9b4d4" /></linearGradient></defs>
      <Shadow cx={4} cy={6} rx={44} ry={8} o={0.45} />
      {steam > 0 && [-9, 3, 14].map((dx, i) => <path key={i} d={`M ${dx},-40 q ${9 + 3 * Math.sin(t * 2 + i)},-16 0,-30 q -9,-14 3,-28`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={steam * (0.28 + 0.16 * Math.sin(t * 3 + i * 2))} />)}
      <ellipse cx={0} cy={2} rx={42} ry={9} fill="#d9d5ee" stroke={INK} strokeWidth={2.6} />
      <path d="M -24,-32 L 24,-32 L 19,-2 Q 0,6 -19,-2 Z" fill={`url(#cp${id})`} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 24,-26 q 20,2 15,15 q -4,9 -17,7" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={0} cy={-32} rx={24} ry={6} fill="#b8743c" stroke={INK} strokeWidth={2.4} /><ellipse cx={-6} cy={-33} rx={9} ry={2.2} fill="#e8b078" opacity={0.7} />
      <path d="M -16,-26 q -2,12 2,20" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

// ---------------------------------------------------------------- paper kite: four panels, sticks, a tail with knots that sways with a lag
export const Kite: React.FC<{x: number; y: number; s?: number; rot?: number; torn?: number; tail?: number; t?: number}> = ({x, y, s = 1, rot = 0, torn = 0, tail = 1, t = 0}) => {
  const id = useId().replace(/:/g, '');
  const pts = Array.from({length: 7}, (_, i) => ({x: 6 * Math.sin(t * 3 - i * 0.7) * (1 + i * 0.35), y: 100 + i * 32}));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <linearGradient id={'k1' + id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff7a5c" /><stop offset="1" stopColor="#d23c34" /></linearGradient>
        <linearGradient id={'k2' + id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe48a" /><stop offset="1" stopColor="#f2a93b" /></linearGradient>
      </defs>
      {tail > 0 && <g>
        <path d={'M 0,96 ' + pts.map((p) => `L ${p.x},${p.y}`).join(' ')} fill="none" stroke={INK} strokeWidth={2.6} />
        {pts.slice(1).map((p, i) => <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${Math.sin(t * 3 - i) * 14})`}><path d="M 0,0 l 15,-9 l 0,18 z M 0,0 l -15,-9 l 0,18 z" fill={i % 2 ? '#f2d16b' : '#d23c34'} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" /></g>)}
      </g>}
      <path d="M 0,-96 L 70,0 L 0,0 Z" fill={`url(#k1${id})`} stroke={INK} strokeWidth={3.6} strokeLinejoin="round" />
      <path d="M 0,-96 L -70,0 L 0,0 Z" fill={`url(#k2${id})`} stroke={INK} strokeWidth={3.6} strokeLinejoin="round" />
      <path d="M 0,96 L 70,0 L 0,0 Z" fill={`url(#k2${id})`} stroke={INK} strokeWidth={3.6} strokeLinejoin="round" />
      <path d="M 0,96 L -70,0 L 0,0 Z" fill={`url(#k1${id})`} stroke={INK} strokeWidth={3.6} strokeLinejoin="round" />
      <path d="M 0,-96 L 0,96 M -70,0 L 70,0" stroke="#5a3a24" strokeWidth={3.6} strokeLinecap="round" />
      <path d="M 6,-80 L 54,-4" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.28} />
      <circle cx={0} cy={0} r={5} fill="#2a1d18" />
      {torn > 0 && <path d={`M -70,0 L -${52 * torn},-14 L -${32 * torn},9 L -${12 * torn},-12 L ${10 * torn},7 L ${34 * torn},-8`} fill="#f4ecdc" stroke={INK} strokeWidth={2.8} strokeLinejoin="round" />}
    </g>
  );
};
