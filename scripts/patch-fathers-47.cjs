const fs=require('fs');let d=fs.readFileSync('src/fathers/details.tsx','utf8');
const lines=d.split('\n');const i=lines.findIndex(l=>l.includes('translate(1600 706)'));
if(i<0)throw new Error('nf');
lines[i]=`    <g transform="translate(1600 706)">
      <ellipse cx={0} cy={14} rx={72} ry={12} fill="rgba(5,6,15,.35)" />
      <g><path d="M -30,-24 Q -2,-62 40,-34 Q 6,-50 -26,-10 Z" fill="#f5d23a" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" /><path d="M 40,-34 l 6,-6" stroke="#5a3a1a" strokeWidth={4} strokeLinecap="round" /></g>
      <g transform="translate(-20 -28)"><circle r={19} fill="#d83a3a" stroke={INK} strokeWidth={2.6} /><ellipse cx={-6} cy={-6} rx={5} ry={8} fill="#fff" opacity={0.4} /><path d="M 0,-19 q 2,-8 6,-10" stroke="#5a3a1a" strokeWidth={3} fill="none" strokeLinecap="round" /><path d="M 4,-24 q 12,-8 18,0 q -10,8 -18,0 Z" fill="#3f9a52" stroke={INK} strokeWidth={2} /></g>
      <g transform="translate(24 -26)"><circle r={18} fill="#f5902a" stroke={INK} strokeWidth={2.6} />{[[-6, -4], [4, 3], [-2, 8], [8, -7]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={1.6} fill="#c06a14" />)}<ellipse cx={-6} cy={-7} rx={4} ry={6} fill="#fff" opacity={0.35} /></g>
      <g transform="translate(2 -42)"><circle r={16} fill="#7fc24a" stroke={INK} strokeWidth={2.6} /><ellipse cx={-5} cy={-5} rx={4} ry={6} fill="#fff" opacity={0.4} /><path d="M 0,-16 q 1,-8 5,-10" stroke="#5a3a1a" strokeWidth={3} fill="none" strokeLinecap="round" /></g>
      <path d="M -58,-22 Q -56,18 0,20 Q 56,18 58,-22 Z" fill="#4a7bd0" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" /><ellipse cx={0} cy={-22} rx={58} ry={9} fill="#3a62b0" stroke={INK} strokeWidth={3} /><path d="M -40,-8 Q -30,8 -10,12" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.4} />
    </g>`;
fs.writeFileSync('src/fathers/details.tsx',lines.join('\n'));
