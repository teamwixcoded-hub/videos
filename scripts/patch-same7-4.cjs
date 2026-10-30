const fs = require('fs');
let s = fs.readFileSync('src/same2d/SideChar.tsx', 'utf8');
const a = s.indexOf('export const BookSide');
const b = s.indexOf('// a phone held toward the face');
if (a < 0 || b < 0) throw new Error('markers');
const code = `export const BookSide: React.FC<{x: number; y: number; deg?: number; shut?: boolean; flip?: number}> = ({x, y, deg = -20, shut, flip = 0}) => {
  const COV = '#2b6b5a', COV_D = '#1d4a3f', COV_L = '#357a67', PG = '#f4ecd6', PG2 = '#f9f2de', EDGE = '#cfc4a2', GOLD = '#e8c26a';
  const fl = flip > 0 && flip < 1 ? flip : 0, ca = Math.cos(fl * Math.PI), sa = Math.sin(fl * Math.PI);
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
          {/* an OPEN hardcover held up in front of the reader, seen from beside and behind: two cover panels meeting at the spine, the page block showing along the top, the reader's thumb and fingers wrap the edges */}
          {/* the pages seen over the top edge */}
          <path d="M -112,-56 C -80,-84 -36,-92 0,-86 C 36,-92 80,-84 112,-56 L 112,-30 C 80,-56 36,-62 0,-58 C -36,-62 -80,-56 -112,-30 Z" fill={PG} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {[-72, -48, -24, 0, 24, 48, 72].map((px, i) => <path key={i} d={\`M \${px},\${-72 + Math.abs(px) * 0.12} L \${px},\${-48 + Math.abs(px) * 0.1}\`} stroke={EDGE} strokeWidth={2.5} />)}
          {fl > 0 && <path d={\`M 0,-62 Q \${70 * ca},\${-62 - 70 * sa} \${112 * ca},\${-52 - 46 * sa} L \${112 * ca},\${-30 - 30 * sa} Q \${70 * ca},\${-34 - 44 * sa} 0,-40 Z\`} fill={PG2} stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
          {/* the two cover panels: a shallow V that points at us, the spine ridge down the middle */}
          <path d="M 0,-58 L -122,-32 L -122,126 L 0,146 Z" fill={COV_D} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          <path d="M 0,-58 L 122,-32 L 122,126 L 0,146 Z" fill={COV} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          <path d="M 0,-58 L 0,146" stroke={INK} strokeWidth={6} />
          <path d="M 4,-54 L 4,142" stroke={COV_L} strokeWidth={5} opacity={0.9} />
          {/* gold frame and a compass emblem on the near panel, the title lines */}
          <path d="M 16,-32 L 106,-14 L 106,106 L 16,120 Z" fill="none" stroke={GOLD} strokeWidth={3.5} strokeLinejoin="round" />
          <g transform="translate(62 30)" fill="none" stroke={GOLD} strokeWidth={3.5} strokeLinecap="round"><circle r={20} /><path d="M 0,-20 L 5,0 L 0,20 L -5,0 Z" fill={GOLD} stroke="none" /></g>
          <path d="M 36,74 L 90,82 M 40,90 L 86,97" stroke={GOLD} strokeWidth={4.5} strokeLinecap="round" />
          <path d="M -118,-28 L -118,120" stroke="#000" strokeWidth={3} opacity={0.18} />
          <path d="M 70,-26 L 108,-16 L 108,30 L 90,22 Z" fill="#fff" opacity={0.1} />
          {/* the bottom edge: the page stack under the covers */}
          <path d="M -122,126 L 0,146 L 122,126 L 122,134 L 0,154 L -122,134 Z" fill={PG} stroke={INK} strokeWidth={4} strokeLinejoin="round" /><path d="M -110,134 L 0,152 M 0,152 L 110,134" stroke={EDGE} strokeWidth={2.4} />
        </g>
      )}
    </g>
  );
};
`;
s = s.slice(0, a) + code + s.slice(b);
fs.writeFileSync('src/same2d/SideChar.tsx', s);
