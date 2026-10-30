import React from 'react';
import {INK} from '../same2d/Char';
import {InsertBG} from '../same2d/inserts';
import {MONT} from '../same2d/theme';

// ============================================================================================
// THE BOOK. A proper hardcover. Closed: cover with a title and gold border, spine, page block, ribbon bookmark and an optional gift tag.
// Open: curved pages, page stack, gutter shadow, text lines, page numbers, ribbon. Coordinates are local (origin at the centre of the book).
// ============================================================================================
const ease = (x: number) => x * x * (3 - 2 * x);
const sm = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
const COVER = '#2b6b5a', COVER_D = '#1d4a3f', PAPER = '#f4ecd6', PAPER_D = '#d9cfae', GOLD = '#e8c26a';
const textLines = (x: number, y: number, w: number, n: number, gap: number, seed: number, op = 0.5) => Array.from({length: n}, (_, i) => <rect key={i} x={x} y={y + i * gap} width={w * (0.62 + 0.38 * Math.abs(Math.sin(i * 12.9 + seed * 3.1)))} height={Math.max(7, gap * 0.28)} rx={4} fill="#8a8068" opacity={op} />);

export const BookClosed: React.FC<{ribbon?: boolean; tag?: string}> = ({ribbon = true, tag}) => (
  <g>
    <ellipse cx={14} cy={366} rx={290} ry={26} fill="rgba(0,0,0,.38)" />
    <path d="M 226,-318 L 268,-300 L 268,336 L 226,352 Z" fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M ${230 + i * 4},${-312 + i * 2} L ${230 + i * 4},${346 - i * 2}`} stroke={PAPER_D} strokeWidth={2.5} />)}
    <path d="M -222,352 L 226,352 L 268,336 L -180,336 Z" fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {ribbon && <path d="M 90,346 Q 96,400 70,430 L 100,420 L 128,438 Q 118,396 124,342 Z" fill="#d94a4a" stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
    <rect x={-232} y={-330} width={462} height={668} rx={16} fill={COVER} stroke={INK} strokeWidth={8} />
    <rect x={-232} y={-330} width={52} height={668} rx={16} fill={COVER_D} stroke={INK} strokeWidth={8} /><rect x={-188} y={-320} width={6} height={648} fill="#000" opacity={0.25} />
    <rect x={-150} y={-286} width={344} height={580} rx={10} fill="none" stroke={GOLD} strokeWidth={5} /><rect x={-138} y={-274} width={320} height={556} rx={6} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.7} />
    <g transform="translate(22 -120)" fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round"><circle r={64} /><path d="M 0,-64 L 12,0 L 0,64 L -12,0 Z" fill={GOLD} stroke="none" /><path d="M -64,0 L 0,-10 L 64,0" /></g>
    <text x={22} y={80} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={46} letterSpacing={6} fill={GOLD}>THE SLOW</text>
    <text x={22} y={140} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={46} letterSpacing={6} fill={GOLD}>ROAD</text>
    <path d="M -60,190 L 104,190" stroke={GOLD} strokeWidth={4} /><text x={22} y={240} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={24} letterSpacing={8} fill="#d8c48a">A NOVEL</text>
    <path d="M -226,-322 L -40,-322 L -226,-60 Z" fill="#fff" opacity={0.07} />
    {tag && <g transform="translate(236 -250) rotate(14)"><path d="M -4,-40 Q 40,-120 70,-90" fill="none" stroke="#8a6a3a" strokeWidth={4} /><path d="M 50,-100 L 150,-100 L 170,-70 L 170,10 L 50,10 Z" fill="#f7efd6" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={66} cy={-82} r={7} fill="#2a2a38" /><text x={112} y={-36} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={22} fill="#6a4a2a">FOR</text><text x={112} y={-6} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={22} fill="#6a4a2a">{tag}</text></g>}
  </g>
);

export const BookSpread: React.FC<{left?: string; right?: string; ribbon?: boolean}> = ({left = '1', right = '2', ribbon = true}) => (
  <g>
    <ellipse cx={0} cy={470} rx={760} ry={34} fill="rgba(0,0,0,.4)" />
    <path d="M -700,-380 C -560,-470 -250,-470 0,-420 C 250,-470 560,-470 700,-380 L 700,430 C 560,520 250,520 0,470 C -250,520 -560,520 -700,430 Z" fill={COVER} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    {[14, 10, 6, 2].map((o, i) => <g key={i}><path d={`M 0,${390 + o * 1.2} C -250,${430 + o} -560,${420 + o} -660,${380 + o} L -660,${392 + o} C -560,${432 + o} -250,${442 + o} 0,${402 + o * 1.2} Z`} fill={i % 2 ? PAPER_D : PAPER} stroke={INK} strokeWidth={2.5} /><path d={`M 0,${390 + o * 1.2} C 250,${430 + o} 560,${420 + o} 660,${380 + o} L 660,${392 + o} C 560,${432 + o} 250,${442 + o} 0,${402 + o * 1.2} Z`} fill={i % 2 ? PAPER_D : PAPER} stroke={INK} strokeWidth={2.5} /></g>)}
    <path d="M 0,-400 C -250,-448 -540,-440 -650,-384 L -650,380 C -540,424 -250,432 0,392 Z" fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 0,-400 C 250,-448 540,-440 650,-384 L 650,380 C 540,424 250,432 0,392 Z" fill="#f8f1dc" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -90,-410 C -50,-405 -20,-402 0,-400 C 20,-402 50,-405 90,-410 L 90,386 C 50,392 20,394 0,392 C -20,394 -50,392 -90,386 Z" fill="#000" opacity={0.1} />
    <path d="M 0,-400 L 0,392" stroke={INK} strokeWidth={4} opacity={0.6} />
    {textLines(-580, -320, 480, 11, 60, 1)}{textLines(110, -320, 480, 11, 60, 2)}
    <text x={-330} y={340} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={30} fill="#8a8068">{left}</text><text x={330} y={340} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={30} fill="#8a8068">{right}</text>
    <text x={-330} y={-350} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={26} letterSpacing={6} fill="#a59c82">THE SLOW ROAD</text>
    {ribbon && <path d="M -12,-408 L -12,470 Q -12,520 -24,540 L 6,528 L 32,548 Q 20,500 20,462 L 20,-404 Z" fill="#d94a4a" stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={0.95} />}
  </g>
);

// the bedside table: warm lamp light on wood, the phone and the book, a glove that hovers between them
export const TableScene: React.FC<{t: number; hover: number; tag?: string}> = ({t, hover, tag}) => {
  const bob = Math.sin(t * 3) * 10, hx = 960 + Math.sin(t * 1.3) * 90 * hover, hy = 250 + (1 - hover) * -260 + bob, pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
  return (
    <InsertBG glow="#9b7be4">
      <defs><radialGradient id="tbl" cx="50%" cy="0%" r="90%"><stop offset="0" stopColor="#ffc97a" stopOpacity="0.55" /><stop offset="1" stopColor="#ffc97a" stopOpacity="0" /></radialGradient></defs>
      <rect x={0} y={740} width={1920} height={400} fill="#5a3f2c" /><rect x={0} y={740} width={1920} height={26} fill="#7a5638" stroke={INK} strokeWidth={6} />
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M 0,${790 + i * 38} Q 960,${780 + i * 38 + (i % 2) * 8} 1920,${792 + i * 38}`} stroke="#3e2a1c" strokeWidth={3} opacity={0.45} fill="none" />)}
      <rect x={0} y={740} width={1920} height={340} fill="url(#tbl)" />
      <g transform="translate(520 700) rotate(-8)"><ellipse cx={20} cy={14} rx={150} ry={20} fill="rgba(0,0,0,.4)" />
        <rect x={-120} y={-250} width={240} height={470} rx={38} fill="#15161f" stroke={INK} strokeWidth={8} /><rect x={-100} y={-230} width={200} height={430} rx={26} fill="#0b1a33" />
        <circle cx={0} cy={-40} r={110} fill="#4aa8ff" opacity={0.12 + 0.1 * pulse} /><text x={0} y={-100} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={64} fill="#fff" opacity={0.85}>11:04</text>
        <rect x={-76} y={-40} width={152} height={44} rx={14} fill="#16305c" /><rect x={-76} y={18} width={152} height={44} rx={14} fill="#16305c" opacity={0.7} /><circle cx={-54} cy={-18} r={10} fill="#ff5a6e" opacity={0.5 + 0.5 * pulse} /></g>
      <g transform="translate(1330 640) rotate(7) scale(0.62)"><BookClosed tag={tag} /></g>
      <g transform={`translate(${hx} ${hy})`}><ellipse cx={0} cy={0} rx={96} ry={80} fill="#fff" stroke={INK} strokeWidth={8} /><ellipse cx={-60} cy={-34} rx={30} ry={44} fill="#fff" stroke={INK} strokeWidth={8} transform="rotate(-30 -60 -34)" /><rect x={-26} y={70} width={52} height={400} fill="#1b1922" stroke={INK} strokeWidth={8} /></g>
    </InsertBG>
  );
};

// the book that a friend gave him: it floats in lamp light, a gift tag swinging from it
export const BookGift: React.FC<{t: number}> = ({t}) => {
  const k = sm(t, 0, 0.6), sway = Math.sin(t * 2.2) * 2.5;
  return (
    <InsertBG glow="#ffb25a">
      <circle cx={960} cy={520} r={460} fill="#ffb25a" opacity={0.1 + 0.03 * Math.sin(t * 3)} style={{filter: 'blur(30px)'}} />
      <g transform={`translate(900 ${540 - (1 - k) * 60 + Math.sin(t * 1.6) * 8}) rotate(${-7 + sway}) scale(${0.52 + 0.06 * k})`}><BookClosed tag="DANIEL" /></g>
    </InsertBG>
  );
};

// the book open at page one, the ribbon bookmark lying in the gutter
export const BookPageOne: React.FC<{t: number}> = ({t}) => {
  const k = sm(t, 0, 0.5);
  return (
    <InsertBG glow="#ffb25a">
      <g transform={`translate(960 ${520 + (1 - k) * 40}) rotate(-2) scale(${0.72 + 0.03 * k})`}><BookSpread left="1" right="2" /></g>
    </InsertBG>
  );
};

// the book opens: the cover swings across the spine and the pages are revealed
export const BookOpening: React.FC<{t: number; at: number}> = ({t, at}) => {
  const k = Math.min(1, Math.max(0, (t - at) / 0.7)), e = ease(k), flap = Math.cos(Math.PI * e);
  return (
    <InsertBG glow="#ffb25a">
      <g transform="translate(960 540) scale(0.62)">
        <g opacity={e > 0.02 ? 1 : 0}><BookSpread left="1" right="2" ribbon={false} /></g>
        {e < 0.98 && <g transform={`scale(${flap} 1)`}>{e < 0.5
          ? <g><path d="M 0,-400 C 250,-448 540,-440 650,-384 L 650,380 C 540,424 250,432 0,392 Z" fill={COVER} stroke={INK} strokeWidth={8} /><rect x={110} y={-300} width={420} height={600} rx={8} fill="none" stroke={GOLD} strokeWidth={5} /><text x={320} y={20} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={54} letterSpacing={6} fill={GOLD}>THE SLOW ROAD</text></g>
          : <path d="M 0,-400 C 250,-448 540,-440 650,-384 L 650,380 C 540,424 250,432 0,392 Z" fill={PAPER} stroke={INK} strokeWidth={6} />}</g>}
      </g>
    </InsertBG>
  );
};
