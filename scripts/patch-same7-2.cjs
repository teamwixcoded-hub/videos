const fs = require('fs');
let s = fs.readFileSync('src/same2d/SideChar.tsx', 'utf8');
const a = s.indexOf('export const BookSide');
const b = s.indexOf('// a phone held toward the face');
if (a < 0 || b < 0) throw new Error('markers');
const code = `export const BookSide: React.FC<{x: number; y: number; deg?: number; shut?: boolean; flip?: number}> = ({x, y, deg = -20, shut, flip = 0}) => {
  const COV = '#2b6b5a', COV_D = '#1d4a3f', PG = '#f4ecd6', PG2 = '#f9f2de', EDGE = '#d9cfae', GOLD = '#e8c26a';
  // text lines that follow the curve of the page toward the gutter
  const lines = (sx: number, n: number) => Array.from({length: n}, (_, i) => {
    const y = -36 + i * 17 + (i > 3 ? 8 : 0), len = [86, 78, 86, 52, 86, 80, 86, 70, 40][i % 9] * (sx < 0 ? 1 : 0.96), x0 = sx * 104, x1 = sx * (104 - len);
    return <path key={i} d={\`M \${x0},\${y + 6} Q \${(x0 + x1) / 2},\${y - 2} \${x1},\${y - 4}\`} stroke="#8f866c" strokeWidth={5.2} strokeLinecap="round" fill="none" opacity={0.62} />;
  });
  return (
    <g transform={\`translate(\${x} \${y}) rotate(\${deg})\`}>
      {shut ? (
        <g>
          <rect x={-66} y={-22} width={132} height={44} rx={8} fill={COV} stroke={INK} strokeWidth={7} />
          <rect x={-66} y={-22} width={20} height={44} rx={8} fill={COV_D} stroke={INK} strokeWidth={7} />
          <rect x={-36} y={-13} width={92} height={26} rx={4} fill="none" stroke={GOLD} strokeWidth={3} />
          <path d="M -62,22 L 62,22 L 58,32 L -58,32 Z" fill={PG} stroke={INK} strokeWidth={4} strokeLinejoin="round" /><path d="M -50,27 L 50,27" stroke={EDGE} strokeWidth={2.5} />
          <path d="M -60,-20 L 20,-20 L -30,10 L -60,10 Z" fill="#fff" opacity={0.08} />
        </g>
      ) : (
        <g transform="scale(0.85)">
          {/* an OPEN hardcover: cover around the pages, a stack of page edges at the bottom, two curved pages with text, a gutter shadow and a ribbon */}
          <path d="M -128,-54 C -92,-84 -42,-90 0,-80 C 42,-90 92,-84 128,-54 L 128,130 C 92,154 42,154 0,132 C -42,154 -92,154 -128,130 Z" fill={COV} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          {[10, 6, 2].map((o, i) => <g key={i}><path d={\`M -118,\${112 + o} C -80,\${130 + o} -36,\${128 + o} 0,\${110 + o} L 0,\${118 + o} C -36,\${136 + o} -80,\${138 + o} -118,\${120 + o} Z\`} fill={i % 2 ? EDGE : PG} stroke={INK} strokeWidth={2} /><path d={\`M 118,\${112 + o} C 80,\${130 + o} 36,\${128 + o} 0,\${110 + o} L 0,\${118 + o} C 36,\${136 + o} 80,\${138 + o} 118,\${120 + o} Z\`} fill={i % 2 ? EDGE : PG} stroke={INK} strokeWidth={2} /></g>)}
          <path d="M 0,-72 C -36,-88 -86,-84 -118,-52 L -118,112 C -86,86 -36,88 0,108 Z" fill={PG} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M 0,-72 C 36,-88 86,-84 118,-52 L 118,112 C 86,86 36,88 0,108 Z" fill={PG2} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M -34,-76 C -16,-74 -6,-73 0,-72 C 6,-73 16,-74 34,-76 L 34,104 C 16,102 6,100 0,108 C -6,100 -16,102 -34,104 Z" fill="#000" opacity={0.11} />
          {lines(-1, 9)}{lines(1, 9)}
          <rect x={-104} y={-48} width={20} height={20} rx={3} fill={COV} opacity={0.55} />
          <path d="M 0,-72 L 0,108" stroke={INK} strokeWidth={4} opacity={0.7} />
          <path d="M 60,-68 C 90,-76 106,-62 118,-52 L 118,-20 C 100,-34 80,-46 60,-48 Z" fill="#fff" opacity={0.12} />
          <path d="M -3,112 Q -5,140 -14,158 L 1,150 L 14,160 Q 9,140 8,112 Z" fill="#d94a4a" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
          {flip > 0 && flip < 1 && <path d={\`M 4,-72 Q \${4 + 108 * Math.cos(flip * Math.PI) * 0.5},\${-100 - 46 * Math.sin(flip * Math.PI)} \${112 * Math.cos(flip * Math.PI)},\${-52 - 30 * Math.sin(flip * Math.PI)} L \${112 * Math.cos(flip * Math.PI)},\${108 - 26 * Math.sin(flip * Math.PI)} Q 4,\${100} 4,\${100} Z\`} fill={PG2} stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
        </g>
      )}
    </g>
  );
};
`;
s = s.slice(0, a) + code + s.slice(b);
// the phone seen from the side: a body with a gradient, a camera bump, a side button, a lit screen edge
const p0 = s.indexOf('export const PhoneSide');
const p1 = s.indexOf('\n);', p0) + 3;
if (p0 < 0 || p1 < 3) throw new Error('phone');
const phone = `export const PhoneSide: React.FC<{x: number; y: number; deg?: number; glow?: number}> = ({x, y, deg = 24, glow = 1}) => (
  <g transform={\`translate(\${x} \${y}) rotate(\${deg})\`}>
    <path d="M 0,-20 L -190,-80 L -190,70 Z" fill="#6bb8ff" opacity={0.16 * glow} style={{mixBlendMode: 'screen'}} />
    <defs><linearGradient id="phs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a3f5c" /><stop offset="0.5" stopColor="#20233a" /><stop offset="1" stopColor="#12142a" /></linearGradient></defs>
    <rect x={-17} y={-62} width={34} height={124} rx={13} fill="url(#phs)" stroke={INK} strokeWidth={6.5} />
    <rect x={-14} y={-54} width={6} height={108} rx={3} fill="#4aa8ff" opacity={0.9 * glow} />
    <rect x={-5} y={-56} width={14} height={20} rx={6} fill="#0e1020" stroke="#8a90b8" strokeWidth={1.8} /><circle cx={2} cy={-50} r={3.6} fill="#1c2a55" stroke="#9db6ff" strokeWidth={1.2} /><circle cx={2} cy={-41} r={3.2} fill="#1c2a55" stroke="#9db6ff" strokeWidth={1.2} />
    <path d="M 8,-52 L 8,40" stroke="#fff" strokeWidth={2.5} opacity={0.12} /><rect x={15} y={-22} width={5} height={30} rx={2.5} fill="#15161f" stroke={INK} strokeWidth={2.5} />
  </g>
);`;
s = s.slice(0, p0) + phone + s.slice(p1);
fs.writeFileSync('src/same2d/SideChar.tsx', s);

// the hand that hovers over the table: a sleeve and a real hand with fingers, pointing down
let b2 = fs.readFileSync('src/same7/book.tsx', 'utf8');
const g0 = b2.indexOf('<g transform={`translate(${hx} ${hy})`}><ellipse');
const g1 = b2.indexOf('</g>', b2.indexOf('<rect x={-26} y={70}', g0)) + 4;
if (g0 < 0 || g1 < 4) throw new Error('hand');
const hand = `<g transform={\`translate(\${hx} \${hy})\`}>
        <path d="M -52,-520 L 52,-520 L 46,20 L -46,20 Z" fill="#7d6fcf" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><path d="M -34,-500 L -30,10" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.18} />
        <rect x={-50} y={14} width={100} height={26} rx={10} fill="#6a5cc0" stroke={INK} strokeWidth={7} />
        <path d="M -52,40 Q -62,100 -48,130 Q 0,150 48,130 Q 62,100 52,40 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        {[-34, -11, 12, 35].map((fx, i) => <path key={i} d={\`M \${fx},122 Q \${fx + 2},\${158 + (i === 1 || i === 2 ? 14 : 0)} \${fx - 2},\${180 + (i === 1 || i === 2 ? 14 : 0) - i % 2 * 6}\`} stroke={INK} strokeWidth={26} strokeLinecap="round" fill="none" />)}
        {[-34, -11, 12, 35].map((fx, i) => <path key={'f' + i} d={\`M \${fx},122 Q \${fx + 2},\${158 + (i === 1 || i === 2 ? 14 : 0)} \${fx - 2},\${180 + (i === 1 || i === 2 ? 14 : 0) - i % 2 * 6}\`} stroke="#fff" strokeWidth={14} strokeLinecap="round" fill="none" />)}
        <path d="M -48,60 Q -86,86 -70,124" stroke={INK} strokeWidth={26} strokeLinecap="round" fill="none" /><path d="M -48,60 Q -86,86 -70,124" stroke="#fff" strokeWidth={14} strokeLinecap="round" fill="none" />
      </g>`;
b2 = b2.slice(0, g0) + hand + b2.slice(g1);
fs.writeFileSync('src/same7/book.tsx', b2);
