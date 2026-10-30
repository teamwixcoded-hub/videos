const fs=require('fs');let a=fs.readFileSync('src/fathers/inserts3.tsx','utf8');
const i=a.indexOf("        {paper > 0 && <g opacity={paper}");
const j=a.indexOf("</g>}",i)+5;
if(i<0)throw new Error('no paper block');
a=a.slice(0,i)+"        {paper > 0 && <g opacity={Math.min(1, paper * 2.2)} transform={`translate(${(1 - paper) * 120} ${(1 - paper) * 200}) rotate(${-4 + (1 - paper) * 26}) scale(${1 + (1 - paper) * 0.15})`}><Parcel p={paper} /></g>}"+a.slice(j);
a=a.replace("export const WatchInsert",`// a gift wrapped in old newspaper: folded sheets with columns of print, a headline, a photo, creases, twine and a knot. p = 1 wrapped, toward 0 it is coming off
export const Parcel: React.FC<{p?: number}> = ({p = 1}) => (
  <g style={{filter: 'drop-shadow(0 26px 30px rgba(0,0,0,.45))'}}>
    <defs><linearGradient id="np" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#efe8d6" /><stop offset="1" stopColor="#d6ccb3" /></linearGradient></defs>
    <rect x={-300} y={-210} width={600} height={420} rx={10} fill="url(#np)" stroke={INK} strokeWidth={6} />
    {[0, 1, 2].map((c) => <g key={c}>{Array.from({length: 13}, (_, r) => <rect key={r} x={-270 + c * 190} y={-60 + r * 20} width={150 - ((r * 37 + c * 23) % 5) * 14} height={6} rx={2} fill="#6a6252" opacity={0.55} />)}</g>)}
    <rect x={-270} y={-190} width={330} height={46} fill="#2a2a2a" opacity={0.85} /><text x={-258} y={-154} fontFamily={SERIF} fontWeight={800} fontSize={40} fill="#efe8d6">DAILY NEWS</text>
    <rect x={90} y={-190} width={180} height={116} fill="#8a8575" opacity={0.7} stroke={INK} strokeWidth={3} />{Array.from({length: 9}, (_, r) => <circle key={r} cx={110 + (r % 3) * 62} cy={-166 + Math.floor(r / 3) * 36} r={12} fill="#4a463c" opacity={0.5} />)}
    {/* folds: the wrapping paper overlaps along a seam and tucks at the ends */}
    <path d="M -300,-210 L -150,0 L -300,210 Z" fill="#bfb497" opacity={0.55} stroke={INK} strokeWidth={3} /><path d="M 300,-210 L 150,0 L 300,210 Z" fill="#bfb497" opacity={0.45} stroke={INK} strokeWidth={3} />
    <path d="M -300,-6 L 300,-6" stroke="#8a7c5a" strokeWidth={5} opacity={0.8} /><rect x={-300} y={-6} width={600} height={30} fill="#000" opacity={0.08} />
    {/* twine */}
    <g transform={\`translate(0 \${(1 - p) * 40})\`}><path d="M -300,60 L 300,60 M 0,-210 L 0,210" stroke="#8a5a2c" strokeWidth={9} strokeLinecap="round" /><path d="M -300,60 L 300,60 M 0,-210 L 0,210" stroke="#d9a86a" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <circle cx={0} cy={60} r={16} fill="#8a5a2c" stroke={INK} strokeWidth={3} /><path d="M 0,60 q -60,-70 -80,-20 q 30,40 80,20 Z M 0,60 q 60,-70 80,-20 q -30,40 -80,20 Z" fill="#a8703a" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" /></g>
  </g>
);

export const WatchInsert`);
fs.writeFileSync('src/fathers/inserts3.tsx',a);
