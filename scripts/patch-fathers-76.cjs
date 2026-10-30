const fs=require('fs');
let s=fs.readFileSync('src/fathers/sets.tsx','utf8');
const a=s.indexOf('export const stairs = (o: {t: number}): SetOut => ({');
const b=s.indexOf('// -----',a);
if(a<0||b<0)throw new Error('stairs');
const code=`export const stairs = (o: {t: number}): SetOut => ({
  far: (<g><Wall c1="#6a4634" c2="#533527" /><g transform="translate(900 340)"><rect x={-14} y={0} width={28} height={110} fill="#493625" stroke={INK} strokeWidth={1.8} /><path d="M -60,0 L 60,0 L 36,-80 L -36,-80 Z" fill="#f9b700" stroke={INK} strokeWidth={2.4} /><ellipse cx={0} cy={-30} rx={190} ry={150} fill="#f9b700" opacity={0.2} /></g>
    {/* the wall under the flight is darker; the stringer follows the steps */}
    <path d="M 1700,830 L 1700,720 L 2000,720 L 2000,610 L 2300,610 L 2300,500 L 2600,500 L 2600,390 L 2900,390 L 2900,280 L 3400,280 L 3400,830 Z" fill="#3b261b" opacity={0.55} /></g>),
  mid: (<g><Floor c1="#65492f" c2="#533723" />{[0, 1, 2, 3, 4].map((n) => { const x = 1700 + n * 300, y = 830 - 110 * (n + 1); return (
    <g key={n}><rect x={x} y={y} width={3400 - x} height={110 * (n + 1)} fill="#4a3220" stroke={INK} strokeWidth={3} />
      <rect x={x} y={y + 14} width={14} height={96} fill="#2e1d12" opacity={0.55} />
      <rect x={x - 14} y={y} width={3400 - x + 14} height={16} rx={4} fill="#a67a47" stroke={INK} strokeWidth={3} />
      <rect x={x - 14} y={y + 16} width={3400 - x + 14} height={7} fill="#2e1d12" opacity={0.5} /></g>); })}
    <rect x={1700} y={826} width={1700} height={8} fill="#1d130d" opacity={0.5} /></g>),
  rim: 'rgba(255,205,130,.9)',
});

`;
s=s.slice(0,a)+code+s.slice(b);
fs.writeFileSync('src/fathers/sets.tsx',s);

let d=fs.readFileSync('src/fathers/details.tsx','utf8');
// photos climb the wall at the same slope as the steps
d=d.replace("translate(${380 + i * 210} ${380 - i * 52}) rotate(${-2 + i})","translate(${1450 + i * 250} ${300 - i * 92})");
// banister along the nose line, balusters standing on the treads, newel post
const m=/<path d="M 300,760 L 2350,160"[^\n]*\n[^\n]*Array\.from\(\{length: 14\}[^\n]*\n/;
if(!m.test(d))throw new Error('banister');
d=d.replace(m,`<path d="M 1500,690 L 3000,140" fill="none" stroke="#3a2a20" strokeWidth={18} strokeLinecap="round" /><path d="M 1500,708 L 3000,158" fill="none" stroke={INK} strokeWidth={4} />
      {Array.from({length: 11}, (_, i) => { const x = 1560 + i * 140, top = 690 - (x - 1500) * 0.367, tread = x < 1700 ? 830 : x < 2000 ? 720 : x < 2300 ? 610 : x < 2600 ? 500 : x < 2900 ? 390 : 280; return <line key={i} x1={x} y1={top} x2={x} y2={tread - 12} stroke="#3a2a20" strokeWidth={8} />; })}
      <rect x={1488} y={660} width={26} height={170} rx={6} fill="#3a2a20" stroke={INK} strokeWidth={3} />
`);
fs.writeFileSync('src/fathers/details.tsx',d);
// door and rug away from the flight
d=fs.readFileSync('src/fathers/details.tsx','utf8');
d=d.replace('<g transform="translate(2650 830)"><rect x={-60} y={-460}','<g transform="translate(900 830)"><rect x={-60} y={-460}');
d=d.replace('<g transform="translate(1000 830)"><rect x={-70} y={-10} width={140}','<g transform="translate(1300 830)"><rect x={-70} y={-10} width={140}');
fs.writeFileSync('src/fathers/details.tsx',d);

let h=fs.readFileSync('src/fathers/shots.tsx','utf8');
h=h.split("sit('sam', 50, 1800, 0.62, {turn: -0.3, face: F.soft}, 840)").join("sit('sam', 50, 1860, 0.62, {turn: -0.8, face: F.soft}, 830)");
h=h.split("sit('max', 16, 2060, 0.62, {turn: -0.3, face: F.sad}, 840)").join("sit('max', 16, 2160, 0.62, {turn: -0.8, face: F.sad, floor: 720} as any, 720)");
h=h.split("sit('max', 16, 2060, 0.62, {turn: -0.3, face: {...F.sad, lids: 0.45}}, 840)").join("sit('max', 16, 2160, 0.62, {turn: -0.8, face: {...F.sad, lids: 0.45}, floor: 720} as any, 720)");
h=h.split("Z(1700, 520, ").join("Z(1950, 500, ").split("Z(1700, 500, ").join("Z(1950, 500, ");
fs.writeFileSync('src/fathers/shots.tsx',h);
