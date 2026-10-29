const fs=require('fs');
let s=fs.readFileSync('src/fathers/sets.tsx','utf8');
s=s.replace("export type LivingOpts = {t: number;","export type LivingOpts = {t: number; seats?: boolean;");
s=s.replace("    front: (<g>\n      <rect x={LR.chairX - 178} y={706}","    front: o.seats === false ? undefined : (<g>\n      <rect x={LR.chairX - 178} y={706}");
fs.writeFileSync('src/fathers/sets.tsx',s);
let h=fs.readFileSync('src/fathers/shots.tsx','utf8');
h=h.replace("[T('adam barely saw him'), undefined, (c) => SC.liv(c, [Z(1950, 520, 1.4), Z(1980, 500, 1.6)], {night: true},","[T('adam barely saw him'), undefined, (c) => SC.liv(c, [Z(1950, 520, 1.4), Z(1980, 500, 1.6)], {night: true, seats: false},");
fs.writeFileSync('src/fathers/shots.tsx',h);
let d=fs.readFileSync('src/fathers/details.tsx','utf8');
d=d.replace("export const hospitalDetail",`export const parkDetail = (o: {t: number; season?: number}): Detail => {
  const s = o.season ?? 1, leaf = ['#c02f52', '#2f7545', '#c9802b', '#cfd6ee'][s % 4], leaf2 = ['#e0607f', '#3f9a52', '#e0a040', '#e9eefa'][s % 4];
  const tree = (x: number, y: number, k: number, i: number) => <g key={i} transform={\`translate(\${x} \${y}) scale(\${k})\`}><ellipse cx={0} cy={4} rx={70} ry={10} fill="rgba(5,6,15,.25)" /><rect x={-12} y={-150} width={24} height={150} fill="#4a3426" stroke={INK} strokeWidth={3} /><circle cx={0} cy={-210} r={96} fill={leaf} stroke={INK} strokeWidth={3.4} /><circle cx={-40} cy={-190} r={56} fill={leaf2} opacity={0.7} /><circle cx={44} cy={-236} r={42} fill={leaf2} opacity={0.5} /></g>;
  return {
    far: (
      <g>
        <path d="M -400,560 Q 500,430 1300,540 T 2600,500 T 3600,540 L 3600,760 L -400,760 Z" fill="#3f7a52" opacity={0.55} stroke={INK} strokeWidth={2} />
        {[200, 520, 900, 1500, 2000, 2400, 2900].map((x, i) => tree(x, 590 + (i % 3) * 16, 0.45 + (i % 2) * 0.1, i))}
        {[1150, 1250, 1360].map((x, i) => <g key={i} transform={\`translate(\${x} 570)\`}><rect x={-40} y={-50} width={80} height={50} fill={['#e8d3a8', '#d98c6c', '#b9c4e0'][i]} stroke={INK} strokeWidth={2.4} /><path d="M -50,-50 L 0,-90 L 50,-50 Z" fill="#a8453a" stroke={INK} strokeWidth={2.4} /><rect x={-10} y={-30} width={20} height={30} fill="#5a3a24" /></g>)}
        <circle cx={2700} cy={180} r={70} fill="#fff3b0" opacity={0.85} /><circle cx={2700} cy={180} r={130} fill="#fff3b0" opacity={0.2} />
        {[0, 1, 2].map((i) => <path key={i} d={\`M \${500 + i * 160 + Math.sin(o.t * 0.5) * 40},\${190 + i * 24} q 14,-16 28,0 q 14,-16 28,0\`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" opacity={0.65} />)}
      </g>
    ),
    mid: (
      <g>
        <path d="M 1900,1100 Q 2040,860 2300,780 T 2900,740" fill="none" stroke="#c9b48a" strokeWidth={90} strokeLinecap="round" opacity={0.7} />
        {[-80, 40, 140, 700, 760, 2480, 2560].map((x, i) => <g key={i} transform={\`translate(\${x + 600} \${790 + (i % 3) * 18})\`}><path d="M 0,0 L 0,-26" stroke="#3f7a3a" strokeWidth={3} /><circle cx={0} cy={-30} r={9} fill={['#ffd24a', '#ff7a9a', '#fff', '#b78cff'][i % 4]} stroke={INK} strokeWidth={1.8} /></g>)}
        <g transform="translate(2300 800)"><rect x={-130} y={-70} width={260} height={14} rx={5} fill="#8a5a34" stroke={INK} strokeWidth={3} /><rect x={-130} y={-120} width={260} height={12} rx={5} fill="#8a5a34" stroke={INK} strokeWidth={3} /><rect x={-118} y={-70} width={12} height={72} fill="#3a3040" /><rect x={106} y={-70} width={12} height={72} fill="#3a3040" /><rect x={-118} y={-130} width={12} height={62} fill="#3a3040" /><rect x={106} y={-130} width={12} height={62} fill="#3a3040" /></g>
        {tree(2820, 800, 0.95, 90)}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <g key={i} transform={\`translate(\${60 + i * 52} 780)\`}><rect x={-5} y={-56} width={10} height={56} fill="#d9c9a0" stroke={INK} strokeWidth={2} /><path d="M -5,-56 L 0,-68 L 5,-56" fill="#d9c9a0" stroke={INK} strokeWidth={2} /></g>)}
        <path d="M 50,-30 L 480,-30 M 50,-8 L 480,-8" transform="translate(0 760)" stroke={INK} strokeWidth={4} />
      </g>
    ),
  };
};

export const hospitalDetail`);
fs.writeFileSync('src/fathers/details.tsx',d);
let k=fs.readFileSync('src/fathers/kit.tsx','utf8');
k=k.replace("kitchenDetail, officeDetail,","kitchenDetail, officeDetail, parkDetail,");
k=k.replace("mk(park({t: c.t, ...o}),","mk(merge(park({t: c.t, ...o}), parkDetail({t: c.t, season: o.season})),");
fs.writeFileSync('src/fathers/kit.tsx',k);
