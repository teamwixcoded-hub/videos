import React from 'react';
import {INK} from '../same2d/Char';

// ============================================================================================
// THE BIGGEST TOY CAR IN THE SHOP: a chunky ride-on racer, ground line at y = 0, facing right, about 420 wide and 190 tall (a bit taller than a five-year-old's waist).
// part: 'back' = the cockpit behind the driver, 'front' = the body that hides the driver's legs, 'all' = a closed car. wrap = ribbons, a big bow and cellophane.
// ============================================================================================
const WHEEL_X = [-122, 126];
const Wheel: React.FC<{x: number; spin: number}> = ({x, spin}) => (
  <g transform={`translate(${x} -42)`}>
    <circle r={44} fill="#22222c" stroke={INK} strokeWidth={5} />
    {Array.from({length: 10}, (_, i) => <rect key={i} x={-3} y={-44} width={6} height={8} fill="#3a3a48" transform={`rotate(${i * 36 + spin})`} />)}
    <circle r={25} fill="#d9dcea" stroke={INK} strokeWidth={4} />
    <g transform={`rotate(${spin})`}>{[0, 72, 144, 216, 288].map((a) => <path key={a} d="M 0,0 L 0,-19" stroke="#8a90b8" strokeWidth={5} strokeLinecap="round" transform={`rotate(${a})`} />)}</g>
    <circle r={6} fill="#f5c542" stroke={INK} strokeWidth={2.5} />
  </g>
);

export const Bow: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -6,6 Q -30,52 -54,60 L -30,38 Z M 6,6 Q 30,52 56,60 L 32,38 Z" fill="#e0a82e" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <g transform="rotate(-24)"><ellipse cx={-42} cy={-8} rx={46} ry={26} fill="#f5c542" stroke={INK} strokeWidth={4.6} /><ellipse cx={-40} cy={-8} rx={26} ry={12} fill="#e0a82e" /></g>
    <g transform="rotate(24)"><ellipse cx={42} cy={-8} rx={46} ry={26} fill="#f5c542" stroke={INK} strokeWidth={4.6} /><ellipse cx={40} cy={-8} rx={26} ry={12} fill="#e0a82e" /></g>
    <circle cx={0} cy={0} r={16} fill="#ffd45a" stroke={INK} strokeWidth={4.6} /><path d="M -8,-6 Q 0,-12 8,-6" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
  </g>
);

export const ToyCar: React.FC<{x: number; y: number; s?: number; wrap?: boolean; spin?: number; part?: 'back' | 'front' | 'all'; flip?: boolean; open?: boolean; shadow?: boolean}> = ({x, y, s = 1, wrap = false, spin = 0, part = 'all', flip = false, open = false, shadow = true}) => {
  const body = 'M -204,-42 Q -210,-100 -154,-106 L 146,-106 Q 210,-98 208,-42 Q 208,-14 178,-14 L -178,-14 Q -206,-14 -204,-42 Z';
  const closedCabin = 'M -92,-106 Q -84,-184 -10,-186 L 62,-186 Q 108,-182 128,-106 Z';
  const back = part !== 'front', front = part !== 'back';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {shadow && part !== 'front' && <ellipse cx={0} cy={4} rx={250} ry={17} fill="rgba(5,6,15,.38)" />}
      {back && <g>
        {/* the seat and the far side of the cockpit when it is open, a roof and windows when it is closed */}
        {open ? <g><rect x={-130} y={-148} width={86} height={50} rx={14} fill="#7a1c1c" stroke={INK} strokeWidth={4} /><path d="M 78,-106 L 58,-176 L 92,-176 L 128,-106 Z" fill="#bfe6ff" stroke={INK} strokeWidth={4.4} strokeLinejoin="round" /><path d="M 70,-112 L 62,-164" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.6} /></g>
          : <g><path d={closedCabin} fill="#d63a3a" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M -64,-110 Q -58,-170 -6,-172 L 18,-172 L 18,-110 Z" fill="#bfe6ff" stroke={INK} strokeWidth={4} /><path d="M 32,-110 L 32,-172 L 58,-172 Q 92,-168 108,-110 Z" fill="#bfe6ff" stroke={INK} strokeWidth={4} /><path d="M -52,-120 L -34,-164" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.55} /></g>}
      </g>}
      {front && <g>
        {WHEEL_X.map((wx) => <circle key={'a' + wx} cx={wx} cy={-42} r={52} fill="#14141c" stroke={INK} strokeWidth={4} />)}
        {WHEEL_X.map((wx) => <Wheel key={wx} x={wx} spin={spin} />)}
        <path d={body} fill="#e0393c" stroke={INK} strokeWidth={5.4} strokeLinejoin="round" />
        {/* arches again over the body so the wheels sit inside it */}
        {WHEEL_X.map((wx) => <path key={'c' + wx} d={`M ${wx - 54},-14 Q ${wx - 54},-96 ${wx},-96 Q ${wx + 54},-96 ${wx + 54},-14`} fill="none" stroke={INK} strokeWidth={5} />)}
        <path d="M -196,-72 L 200,-72" stroke="#fff" strokeWidth={13} opacity={0.9} /><path d="M -196,-72 L 200,-72" stroke={INK} strokeWidth={2} opacity={0.35} />
        <path d="M -170,-100 Q 0,-112 170,-100" fill="none" stroke="#ff8a8c" strokeWidth={7} strokeLinecap="round" opacity={0.7} />
        <rect x={-72} y={-98} width={104} height={64} rx={10} fill="none" stroke={INK} strokeWidth={3} opacity={0.6} /><rect x={22} y={-82} width={22} height={7} rx={3.5} fill="#f6d36a" stroke={INK} strokeWidth={2} />
        <circle cx={-20} cy={-62} r={22} fill="#fff" stroke={INK} strokeWidth={3.4} /><text x={-20} y={-53} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={30} fill="#c0272b">1</text>
        <circle cx={190} cy={-70} r={15} fill="#ffe08a" stroke={INK} strokeWidth={4} /><circle cx={190} cy={-70} r={26} fill="#ffe08a" opacity={0.25} />
        <rect x={-206} y={-80} width={10} height={26} rx={4} fill="#c0272b" stroke={INK} strokeWidth={3} />
        <rect x={-216} y={-30} width={30} height={14} rx={7} fill="#c9ccd8" stroke={INK} strokeWidth={4} /><rect x={188} y={-30} width={32} height={14} rx={7} fill="#c9ccd8" stroke={INK} strokeWidth={4} />
        {open && <g><circle cx={64} cy={-128} r={22} fill="none" stroke="#2a2a38" strokeWidth={7} /><path d="M 64,-128 L 40,-100" stroke="#2a2a38" strokeWidth={7} strokeLinecap="round" /></g>}
        {wrap && <g>
          {[-70, 96].map((bx) => <g key={bx}><rect x={bx} y={-108} width={28} height={96} fill="#f5c542" stroke={INK} strokeWidth={3.4} opacity={0.97} /><rect x={bx + 5} y={-102} width={5} height={84} fill="#fff" opacity={0.35} /></g>)}
          <path d="M -70,-108 L -50,-184 L -20,-186 L -42,-108 Z" fill="#f5c542" stroke={INK} strokeWidth={3.4} /><path d="M 96,-108 L 100,-186 L 128,-170 L 124,-108 Z" fill="#f5c542" stroke={INK} strokeWidth={3.4} />
          <g transform="translate(18 -188)"><Bow s={1.5} /></g>
          <rect x={-218} y={-190} width={440} height={186} rx={34} fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.55)" strokeWidth={3.4} />
          <path d="M -150,-180 L -100,-180 L -190,-20 L -226,-20 Z M -60,-180 L -44,-180 L -134,-20 L -150,-20 Z" fill="#fff" opacity={0.2} />
        </g>}
      </g>}
    </g>
  );
};

export const Sparkles: React.FC<{t: number; x: number; y: number; w?: number; h?: number; n?: number}> = ({t, x, y, w = 500, h = 260, n = 9}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, r2 = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1, ph = (t * 1.4 + r1 * 3) % 1, a = Math.sin(ph * Math.PI), sz = 10 + r2 * 16;
      return <path key={i} d={`M 0,${-sz} Q 2,-2 ${sz},0 Q 2,2 0,${sz} Q -2,2 ${-sz},0 Q -2,-2 0,${-sz} Z`} fill="#fff6c8" opacity={a} transform={`translate(${x + (r1 - 0.5) * w} ${y + (r2 - 0.5) * h}) scale(${0.4 + a * 0.8}) rotate(${ph * 60})`} />;
    })}
  </g>
);

// a big gift box with a ribbon and a bow, for carrying in
export const BigGift: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-120} y={-150} width={240} height={160} rx={10} fill="#d63a3a" stroke={INK} strokeWidth={4.6} />
    <rect x={-132} y={-168} width={264} height={36} rx={8} fill="#e8554f" stroke={INK} strokeWidth={4.6} />
    <rect x={-18} y={-168} width={36} height={178} fill="#f5c542" stroke={INK} strokeWidth={3.6} /><rect x={-120} y={-86} width={240} height={30} fill="#f5c542" stroke={INK} strokeWidth={3.6} opacity={0.0} />
    <g transform="translate(0 -170)"><Bow s={1.05} /></g>
  </g>
);
