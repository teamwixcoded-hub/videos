const fs=require('fs');let d=fs.readFileSync('src/fathers/details.tsx','utf8');
const code=`
// ---------------------------------------------------------------- factory floor: crane rail, hanging lamps, pipes, machines with dials, shelves of boxes, safety signs, lockers
export const factoryDetail = (o: {t: number}): Detail => ({
  far: (
    <g>
      <rect x={-400} y={20} width={4000} height={26} fill="#2a3150" stroke={INK} strokeWidth={3} />
      <path d="M -400,70 L 3600,70" stroke="#4a5470" strokeWidth={16} /><path d="M -400,70 L 3600,70" stroke={INK} strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <g key={'p' + i} transform={\`translate(\${200 + i * 480} 0)\`}><rect x={-6} y={46} width={12} height={34} fill="#3a4260" /><path d="M -50,120 L 50,120 L 36,92 L -36,92 Z" fill="#c9ccd8" stroke={INK} strokeWidth={3} /><path d="M -50,120 L 100,330 L -150,330 Z" fill="#ffe08a" opacity={0.08} /><ellipse cx={0} cy={124} rx={34} ry={7} fill="#fff6c8" /></g>)}
      <g transform={\`translate(\${1100 + Math.sin(o.t * 0.4) * 300} 80)\`}><rect x={-60} y={-14} width={120} height={22} rx={5} fill="#c9954a" stroke={INK} strokeWidth={3} /><path d="M 0,8 L 0,90" stroke={INK} strokeWidth={4} /><path d="M -14,90 Q 0,126 14,90" fill="none" stroke="#8a90b8" strokeWidth={8} strokeLinecap="round" /></g>
      {[[220, 250], [2920, 250]].map(([x, y], i) => <g key={'m' + i} transform={\`translate(\${x} \${y})\`}><rect x={-160} y={0} width={320} height={300} rx={14} fill="#4a5470" stroke={INK} strokeWidth={4} /><rect x={-130} y={26} width={260} height={110} rx={8} fill="#2a3150" stroke={INK} strokeWidth={3} />{[-80, 0, 80].map((dx, k) => <g key={k} transform={\`translate(\${dx} 82)\`}><circle r={34} fill="#e8ecf8" stroke={INK} strokeWidth={3} /><path d={\`M 0,0 L \${22 * Math.cos(o.t * 0.8 + k)},\${-22 * Math.abs(Math.sin(o.t * 0.8 + k))}\`} stroke="#c0392b" strokeWidth={4} strokeLinecap="round" /></g>)}{[-90, -30, 30, 90].map((dx, k) => <circle key={k} cx={dx} cy={190} r={16} fill={['#e0455a', '#f5c542', '#3f9a52', '#4aa8ff'][k]} stroke={INK} strokeWidth={3} opacity={0.5 + 0.5 * Math.abs(Math.sin(o.t * 2 + k))} />)}<rect x={-120} y={240} width={240} height={26} fill="#2a3150" stroke={INK} strokeWidth={3} /></g>)}
      <g transform="translate(1000 330)"><rect x={-70} y={0} width={140} height={90} fill="#f5c542" stroke={INK} strokeWidth={4} /><path d="M -70,0 L -20,0 L -70,40 Z M -10,0 L 40,0 L -10,90 L -70,90 L -70,60 Z M 50,0 L 70,0 L 70,40 L 20,90 L 0,90 Z" fill="#1d1a2e" opacity={0.85} /><text x={0} y={-12} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={26} fill="#fff6e6" stroke={INK} strokeWidth={0.8}>SAFETY FIRST</text></g>
      <g transform="translate(2300 300)"><rect x={-160} y={0} width={320} height={96} rx={6} fill="#1d2236" stroke={INK} strokeWidth={4} /><text x={0} y={60} textAnchor="middle" fontFamily="Share Tech Mono, monospace" fontWeight={700} fontSize={48} fill="#ffb25a">LINE 3 · 14:30</text></g>
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={'wi' + i} x={1740 + i * 70} y={300} width={50} height={70 - (i % 2) * 20} fill={['#c0392b', '#2c7ab8', '#3f9a52'][i % 3]} opacity={0.0} />)}
    </g>
  ),
  mid: (
    <g>
      <g transform="translate(560 830)"><rect x={-130} y={-400} width={260} height={400} rx={6} fill="#4a5470" stroke={INK} strokeWidth={4} />{[0, 1, 2, 3].map((r) => <rect key={r} x={-120} y={-388 + r * 98} width={240} height={86} fill="#2a3150" stroke={INK} strokeWidth={2.4} />)}{[0, 1, 2, 3].map((r) => <g key={'b' + r}><rect x={-100} y={-370 + r * 98} width={80} height={56} fill="#c9954a" stroke={INK} strokeWidth={2.4} /><rect x={-4} y={-362 + r * 98} width={70} height={46} fill="#e0b068" stroke={INK} strokeWidth={2.4} /></g>)}</g>
      <g transform="translate(2640 830)">{[0, 1, 2].map((i) => <g key={i} transform={\`translate(\${-i * 12} \${-i * 96})\`}><rect x={-80} y={-92} width={160} height={92} rx={5} fill="#c9954a" stroke={INK} strokeWidth={4} /><rect x={-80} y={-92} width={160} height={24} fill="#e0b068" stroke={INK} strokeWidth={3} /><rect x={-12} y={-92} width={24} height={92} fill="#d9c9a0" opacity={0.6} /></g>)}</g>
      <g transform="translate(2400 830)"><rect x={-26} y={-250} width={52} height={250} fill="#c0392b" stroke={INK} strokeWidth={4} /><rect x={-60} y={-20} width={120} height={20} rx={4} fill="#2a2a38" stroke={INK} strokeWidth={3} /></g>
    </g>
  ),
});

// ---------------------------------------------------------------- the school stage: a painted forest backdrop with a moon, spotlights, a banner and a valance
export const stageDetail = (o: {t: number}): Detail => ({
  far: (
    <g>
      <rect x={780} y={110} width={1640} height={320} fill="#1d2a52" />
      <circle cx={2100} cy={220} r={70} fill="#fff3b0" opacity={0.9} /><circle cx={2100} cy={220} r={110} fill="#fff3b0" opacity={0.15} />
      {[[860, 0.9], [1010, 1.2], [1180, 0.8], [1330, 1.1], [1500, 0.9], [1660, 1.3], [1830, 0.85], [1980, 1.0], [2260, 1.15]].map(([x, s], i) => <g key={i} transform={\`translate(\${x} 430) scale(\${s})\`}><rect x={-10} y={-70} width={20} height={70} fill="#4a3426" stroke={INK} strokeWidth={3} /><path d="M -70,-60 L 0,-230 L 70,-60 Z" fill={i % 2 ? '#2f7a4a' : '#3a8a56'} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" /><path d="M -56,-120 L 0,-250 L 56,-120 Z" fill={i % 2 ? '#3a8a56' : '#4a9a66'} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" /></g>)}
      <path d="M 780,420 Q 1100,370 1500,410 T 2420,400 L 2420,430 L 780,430 Z" fill="#2a6a40" />
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={'sp' + i} transform={\`translate(\${900 + i * 280} 50)\`}><rect x={-22} y={-6} width={44} height={30} rx={6} fill="#2a2a38" stroke={INK} strokeWidth={3} /><path d="M -20,24 L 20,24 L 80,420 L -80,420 Z" fill="#fff3b0" opacity={0.07} /></g>)}
      <rect x={700} y={96} width={1800} height={40} fill="#4c1413" stroke={INK} strokeWidth={3} />{Array.from({length: 36}, (_, i) => <path key={i} d={\`M \${712 + i * 50},136 q 12,24 24,0\`} fill="#651e1c" stroke={INK} strokeWidth={2.4} />)}
      <g transform="translate(1600 70)"><rect x={-300} y={-26} width={600} height={50} rx={6} fill="#f5e8c8" stroke={INK} strokeWidth={4} /><text x={0} y={12} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={34} letterSpacing={6} fill="#4a2a1a">THE ENCHANTED FOREST</text></g>
    </g>
  ),
});

`;
if(!d.includes('export const factoryDetail'))d=d.replace("export const kitchenDetail",code+"export const kitchenDetail");
fs.writeFileSync('src/fathers/details.tsx',d);
let k=fs.readFileSync('src/fathers/kit.tsx','utf8');
k=k.replace("roomDetail, stairsDetail, doorDetail,","roomDetail, stairsDetail, doorDetail, factoryDetail, stageDetail,");
k=k.replace("mk(factory({t: c.t}),","mk(merge(factory({t: c.t}), factoryDetail({t: c.t})),");
k=k.replace("mk(auditorium({t: c.t, ...o}),","mk(merge(auditorium({t: c.t, ...o}), stageDetail({t: c.t})),");
fs.writeFileSync('src/fathers/kit.tsx',k);
