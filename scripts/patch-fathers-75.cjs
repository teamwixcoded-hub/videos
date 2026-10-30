const fs=require('fs');let d=fs.readFileSync('src/fathers/details.tsx','utf8');
const code=`
// ---------------------------------------------------------------- more dressing: tea stall, office, kitchen, stairs
export const teaMore = (): Detail => ({
  far: (
    <g>
      <g transform="translate(820 330)"><path d="M -4,-60 L -4,0 M 196,-60 L 196,0" stroke={INK} strokeWidth={4} /><rect x={-20} y={0} width={236} height={76} rx={8} fill="#f5e8c8" stroke={INK} strokeWidth={4} /><text x={98} y={34} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={30} fill="#7a2a1a">TEA · CHAI</text><text x={98} y={62} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={20} fill="#4a3a2a">SNACKS · BISCUITS</text></g>
      <g transform="translate(1900 420)"><rect x={-90} y={0} width={180} height={230} rx={6} fill="#2a3a2a" stroke="#c9a064" strokeWidth={8} /><text x={0} y={44} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={26} fill="#fff">MENU</text>{[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={-70} y={70 + i * 32} width={80 + (i % 2) * 20} height={7} rx={3} fill="#e8e8d0" opacity={0.85} /><rect x={40} y={70 + i * 32} width={32} height={7} rx={3} fill="#ffd27a" /></g>)}</g>
    </g>
  ),
  mid: (
    <g>
      {[0, 1].map((i) => <g key={i} transform={\`translate(\${1000 + i * 1100} 830)\`}><rect x={-34} y={-86} width={68} height={14} rx={6} fill="#8a5a34" stroke={INK} strokeWidth={3} /><rect x={-28} y={-72} width={8} height={72} fill="#3a2f26" /><rect x={20} y={-72} width={8} height={72} fill="#3a2f26" /></g>)}
      <g transform="translate(2150 830)"><ellipse cx={0} cy={6} rx={110} ry={14} fill="rgba(5,6,15,.3)" /><path d="M -90,-20 L -70,-90 Q -50,-130 -10,-130 L 40,-130 L 60,-92 L 100,-86 L 100,-20 Z" fill="#3a8a96" stroke={INK} strokeWidth={4.4} strokeLinejoin="round" />{[-60, 70].map((x) => <g key={x} transform={\`translate(\${x} -4)\`}><circle r={26} fill="#1d1d24" stroke={INK} strokeWidth={4} /><circle r={11} fill="#8a90b8" /></g>)}<rect x={-30} y={-134} width={60} height={14} rx={6} fill="#2a2a38" stroke={INK} strokeWidth={3} /><circle cx={92} cy={-70} r={10} fill="#ffe08a" stroke={INK} strokeWidth={2.4} /></g>
    </g>
  ),
});
export const officeMore = (): Detail => ({
  far: (
    <g>
      {[0, 1, 2].map((i) => <g key={i} transform={\`translate(\${1100 + i * 150} 200)\`}><rect x={0} y={0} width={116} height={150} fill="#7a5a3a" stroke={INK} strokeWidth={4} /><rect x={10} y={10} width={96} height={130} fill="#f4ecd8" /><rect x={22} y={30} width={72} height={8} rx={3} fill="#9a9482" /><rect x={32} y={50} width={52} height={6} rx={3} fill="#bfb9a6" /><circle cx={58} cy={104} r={16} fill="#c0392b" /></g>)}
      <g transform="translate(2200 140)"><rect x={0} y={0} width={440} height={330} fill="#10182c" stroke={INK} strokeWidth={5} />{Array.from({length: 9}, (_, i) => <rect key={i} x={6} y={8 + i * 34} width={428} height={20} fill="#2a3150" opacity={0.7} />)}</g>
    </g>
  ),
  mid: (
    <g>
      <g transform="translate(300 830)"><rect x={-100} y={-300} width={200} height={300} rx={6} fill="#4a5470" stroke={INK} strokeWidth={4} />{[0, 1, 2].map((r) => <g key={r}><rect x={-88} y={-288 + r * 96} width={176} height={86} rx={4} fill="#59639a" stroke={INK} strokeWidth={2.4} /><rect x={-26} y={-250 + r * 96} width={52} height={10} rx={4} fill="#c9ccd8" /></g>)}</g>
      <g transform="translate(2900 830)"><rect x={-34} y={-250} width={68} height={250} rx={8} fill="#cfe2f4" stroke={INK} strokeWidth={4} /><rect x={-26} y={-330} width={52} height={86} rx={12} fill="#9ad0ff" opacity={0.7} stroke={INK} strokeWidth={3} /><circle cx={0} cy={-200} r={8} fill="#c0392b" /></g>
    </g>
  ),
});
export const kitchenMore = (): Detail => ({
  far: (
    <g>
      {Array.from({length: 22}, (_, r) => Array.from({length: 4}, (_, c) => <rect key={r + '-' + c} x={140 + r * 120} y={560 + c * 60} width={116} height={56} fill={(r + c) % 2 ? '#8a5a44' : '#7a4c38'} stroke="rgba(20,10,8,.4)" strokeWidth={1.6} />))}
      <g transform="translate(700 560)"><rect x={0} y={-340} width={420} height={320} rx={6} fill="#a8713f" stroke={INK} strokeWidth={4} /><path d="M 210,-340 L 210,-20" stroke={INK} strokeWidth={4} /><rect x={170} y={-200} width={14} height={54} rx={6} fill="#e9d6b4" stroke={INK} strokeWidth={2.4} /><rect x={236} y={-200} width={14} height={54} rx={6} fill="#e9d6b4" stroke={INK} strokeWidth={2.4} /></g>
      <rect x={640} y={540} width={1520} height={24} rx={4} fill="#c9a064" stroke={INK} strokeWidth={4} /><rect x={640} y={564} width={1520} height={236} fill="#8a5636" stroke={INK} strokeWidth={4} />{[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><rect x={660 + i * 250} y={584} width={226} height={196} rx={4} fill="#a06c42" stroke={INK} strokeWidth={3} /><rect x={760 + i * 250} y={600} width={26} height={8} rx={4} fill="#e9d6b4" /></g>)}
      {[[760, '#e8ecf8'], [900, '#c0392b'], [1040, '#f5c542']].map(([x, c], i) => <g key={i} transform={\`translate(\${x} 540)\`}><rect x={-26} y={-60} width={52} height={60} rx={8} fill={c as string} stroke={INK} strokeWidth={3} /><rect x={-20} y={-72} width={40} height={14} rx={4} fill="#8a5a34" stroke={INK} strokeWidth={2.4} /></g>)}
      <g transform="translate(1500 540)"><path d="M -60,0 L -50,-70 Q 0,-96 50,-70 L 60,0 Z" fill="#c9ccd8" stroke={INK} strokeWidth={4} /><path d="M 50,-60 q 34,-12 40,-44" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" /></g>
    </g>
  ),
});
export const stairsMore = (): Detail => ({
  mid: (
    <g>
      <g transform="translate(2650 830)"><rect x={-60} y={-460} width={120} height={460} fill="#6a4a30" stroke={INK} strokeWidth={4} /><rect x={-44} y={-440} width={88} height={190} fill="#4a3220" stroke={INK} strokeWidth={3} /><rect x={-44} y={-232} width={88} height={190} fill="#4a3220" stroke={INK} strokeWidth={3} /><circle cx={34} cy={-220} r={7} fill="#e8c27a" /></g>
      <g transform="translate(1000 830)"><rect x={-70} y={-10} width={140} height={10} rx={3} fill="#8a3a4a" stroke={INK} strokeWidth={3} /><ellipse cx={0} cy={-10} rx={90} ry={12} fill="#8a3a4a" opacity={0.0} /></g>
    </g>
  ),
});
`;
if(!d.includes('export const teaMore'))d=d.replace("export const kitchenDetail",code+"\nexport const kitchenDetail");
fs.writeFileSync('src/fathers/details.tsx',d);
let k=fs.readFileSync('src/fathers/kit.tsx','utf8');
k=k.replace("factoryDetail, stageDetail,","factoryDetail, stageDetail, teaMore, officeMore, kitchenMore, stairsMore,");
k=k.replace("mk(merge(teaStall({t: c.t, ...o}), teaDetail({t: c.t, sunset: o.sunset})),","mk(merge(merge(teaStall({t: c.t, ...o}), teaDetail({t: c.t, sunset: o.sunset})), teaMore()),");
k=k.replace("mk(merge(office({t: c.t, ...o}), officeDetail({t: c.t})),","mk(merge(merge(office({t: c.t, ...o}), officeDetail({t: c.t})), officeMore()),");
k=k.replace("mk(merge(kitchen({t: c.t, ...o}), kitchenDetail({t: c.t})),","mk(merge(merge(kitchen({t: c.t, ...o}), kitchenDetail({t: c.t})), kitchenMore()),");
k=k.replace("mk(merge(stairs({t: c.t}), stairsDetail()),","mk(merge(merge(stairs({t: c.t}), stairsDetail()), stairsMore()),");
fs.writeFileSync('src/fathers/kit.tsx',k);
