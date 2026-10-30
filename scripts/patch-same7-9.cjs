const fs = require('fs');
let s = fs.readFileSync('src/same2d/SideChar.tsx', 'utf8');
const a = s.indexOf('export const BookSide');
const b = s.indexOf('// a phone held toward the face');
if (a < 0 || b < 0) throw new Error('markers');
const code = `export const BookSide: React.FC<{x: number; y: number; deg?: number; shut?: boolean; flip?: number}> = ({x, y, deg = -20, shut, flip = 0}) => {
  const COV = '#2b6b5a', COV_D = '#1d4a3f', PG = '#f4ecd6', PG2 = '#f9f2de', EDGE = '#d9cfae', GOLD = '#e8c26a';
  const fl = flip > 0 && flip < 1 ? flip : 0, ca = Math.cos(fl * Math.PI), sa = Math.sin(fl * Math.PI);
  // text lines that follow the curve of the page toward the gutter
  const lines = (sx: number, n: number) => Array.from({length: n}, (_, i) => {
    const yy = -36 + i * 17 + (i > 3 ? 8 : 0), len = [86, 78, 86, 52, 86, 80, 86, 70, 40][i % 9], x0 = sx * 104, x1 = sx * (104 - len);
    return <path key={i} d={\`M \${x0},\${yy + 6} Q \${(x0 + x1) / 2},\${yy - 2} \${x1},\${yy - 4}\`} stroke="#8f866c" strokeWidth={5.2} strokeLinecap="round" fill="none" opacity={0.62} />;
  });
  return (
    <g transform={\`translate(\${x} \${y}) rotate(\${deg})\`}>
      {shut ? (
        <g>
          <rect x={-66} y={-22} width={132} height={44} rx={8} fill={COV} stroke={INK} strokeWidth={7} />
          <rect x={-66} y={-22} width={20} height={44} rx={8} fill={COV_D} stroke={INK} strokeWidth={7} />
          <rect x={-36} y={-13} width={92} height={26} rx={4} fill="none" stroke={GOLD} strokeWidth={3} />
          <path d="M -62,22 L 62,22 L 58,32 L -58,32 Z" fill={PG} stroke={INK} strokeWidth={4} strokeLinejoin="round" /><path d="M -50,27 L 50,27" stroke={EDGE} strokeWidth={2.5} />
        </g>
      ) : (
        <g transform="scale(0.85)">
          {/* an OPEN book held in front of the reader, its PAGES turned to his face: seen from beside, the spread is foreshortened (narrow and slanted) and the far cover shows as a dark edge on the side away from him */}
          <path d="M 36,-82 L 54,-70 L 54,116 L 36,132 Z" fill={COV_D} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <g transform="translate(-10 0) skewY(-9) scale(0.6 1)">
            <path d="M -128,-54 C -92,-84 -42,-90 0,-80 C 42,-90 92,-84 128,-54 L 128,130 C 92,154 42,154 0,132 C -42,154 -92,154 -128,130 Z" fill={COV} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
            {[10, 6, 2].map((o, i) => <g key={i}><path d={\`M -118,\${112 + o} C -80,\${130 + o} -36,\${128 + o} 0,\${110 + o} L 0,\${118 + o} C -36,\${136 + o} -80,\${138 + o} -118,\${120 + o} Z\`} fill={i % 2 ? EDGE : PG} stroke={INK} strokeWidth={3} /><path d={\`M 118,\${112 + o} C 80,\${130 + o} 36,\${128 + o} 0,\${110 + o} L 0,\${118 + o} C 36,\${136 + o} 80,\${138 + o} 118,\${120 + o} Z\`} fill={i % 2 ? EDGE : PG} stroke={INK} strokeWidth={3} /></g>)}
            <path d="M 0,-72 C -36,-88 -86,-84 -118,-52 L -118,112 C -86,86 -36,88 0,108 Z" fill={PG} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <path d="M 0,-72 C 36,-88 86,-84 118,-52 L 118,112 C 86,86 36,88 0,108 Z" fill={PG2} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <path d="M -34,-76 C -16,-74 -6,-73 0,-72 C 6,-73 16,-74 34,-76 L 34,104 C 16,102 6,100 0,108 C -6,100 -16,102 -34,104 Z" fill="#000" opacity={0.12} />
            {lines(-1, 9)}{lines(1, 9)}
            <rect x={-104} y={-48} width={20} height={20} rx={3} fill={COV} opacity={0.55} />
            <path d="M 0,-72 L 0,108" stroke={INK} strokeWidth={5} opacity={0.7} />
            <path d="M -3,112 Q -5,140 -14,158 L 1,150 L 14,160 Q 9,140 8,112 Z" fill="#d94a4a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            {fl > 0 && <path d={\`M 4,-72 Q \${4 + 108 * ca * 0.5},\${-100 - 46 * sa} \${112 * ca},\${-52 - 30 * sa} L \${112 * ca},\${108 - 26 * sa} Q 4,100 4,100 Z\`} fill={PG2} stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
          </g>
        </g>
      )}
    </g>
  );
};
`;
s = s.slice(0, a) + code + s.slice(b);
fs.writeFileSync('src/same2d/SideChar.tsx', s);
