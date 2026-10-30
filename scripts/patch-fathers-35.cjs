const fs=require('fs');
let d=fs.readFileSync('src/fathers/details.tsx','utf8');
d=d.replace("export const hospitalDetail",`// Leo's room: posters, a shelf with a game console, a desk with a lamp, a night window, a bed edge and a rug
export const roomDetail = (o: {t: number}): Detail => ({
  far: (
    <g>
      <g transform="translate(900 150)"><rect x={0} y={0} width={190} height={260} fill="#2a3a66" stroke={INK} strokeWidth={4} /><circle cx={95} cy={90} r={54} fill="#f5c542" stroke={INK} strokeWidth={3} /><path d="M 20,230 L 70,150 L 110,200 L 150,130 L 175,230 Z" fill="#3f9a52" stroke={INK} strokeWidth={3} /></g>
      <g transform="translate(1160 190)"><rect x={0} y={0} width={230} height={170} fill="#5a2a4a" stroke={INK} strokeWidth={4} />{[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 50} y={24} width={36} height={120 - i * 14} fill={['#c0392b', '#e8a93b', '#2c7ab8', '#3f9a52'][i]} stroke={INK} strokeWidth={2.4} />)}</g>
      <g transform="translate(1500 130)"><rect x={0} y={0} width={420} height={14} rx={3} fill="#6a4a30" stroke={INK} strokeWidth={3} />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={18 + i * 40} y={-84 + (i % 3) * 10} width={32} height={84 - (i % 3) * 10} fill={['#7b4aa5', '#2a8f8a', '#c9a64a', '#b8503a'][i % 4]} stroke={INK} strokeWidth={2.4} />)}<g transform="translate(300 0)"><rect x={0} y={-34} width={90} height={34} rx={6} fill="#e9ecf8" stroke={INK} strokeWidth={3} /><circle cx={26} cy={-17} r={9} fill="#2c7ab8" /><rect x={50} y={-24} width={26} height={8} rx={4} fill="#c0392b" /></g></g>
      <g transform="translate(2200 160)"><rect x={0} y={0} width={300} height={380} fill="#0f1730" stroke={INK} strokeWidth={5} /><path d="M 150,0 L 150,380 M 0,190 L 300,190" stroke={INK} strokeWidth={4} />{[[40, 40], [210, 80], [90, 270], [230, 250]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 + (i % 2)} fill="#fff7c8" opacity={0.8} />)}<circle cx={240} cy={60} r={26} fill="#fff3b0" opacity={0.9} /></g>
    </g>
  ),
  mid: (
    <g>
      <g transform="translate(2020 830)"><rect x={-170} y={-130} width={340} height={14} rx={4} fill="#6a4a30" stroke={INK} strokeWidth={3.4} /><rect x={-160} y={-116} width={12} height={116} fill="#4a3220" /><rect x={148} y={-116} width={12} height={116} fill="#4a3220" /><rect x={-60} y={-116} width={110} height={80} rx={4} fill="#5a3f2a" stroke={INK} strokeWidth={2.4} />
        <g transform="translate(90 -130)"><path d="M 0,0 L 40,-60 L 70,-60" fill="none" stroke="#2a2a38" strokeWidth={7} strokeLinecap="round" /><path d="M 56,-70 L 100,-70 L 86,-40 L 70,-40 Z" fill="#ffe08a" stroke={INK} strokeWidth={3} /></g>
        <g transform="translate(-100 -130)"><rect x={-40} y={-56} width={80} height={56} rx={4} fill="#1c2036" stroke={INK} strokeWidth={3} /><rect x={-34} y={-50} width={68} height={42} fill="#2c7ab8" opacity={0.85} /></g></g>
      <g transform="translate(640 830)"><rect x={-260} y={-110} width={440} height={110} rx={12} fill="#34456e" stroke={INK} strokeWidth={4} /><rect x={-260} y={-130} width={440} height={34} rx={14} fill="#4a5a8a" stroke={INK} strokeWidth={3.6} /><rect x={-250} y={-190} width={120} height={70} rx={20} fill="#e9ecf8" stroke={INK} strokeWidth={3.4} /></g>
      <ellipse cx={1250} cy={940} rx={560} ry={50} fill="#2c3a6a" opacity={0.55} stroke={INK} strokeWidth={3} />
    </g>
  ),
});

// the stairs: a banister, framed family photos climbing the wall, shoes at the bottom and a window
export const stairsDetail = (): Detail => ({
  far: (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={\`translate(\${380 + i * 210} \${380 - i * 52}) rotate(\${-2 + i})\`}><rect x={-62} y={-48} width={124} height={96} fill="#6a4a30" stroke={INK} strokeWidth={4} /><rect x={-50} y={-36} width={100} height={72} fill={['#c9b99a', '#b9c8d8', '#d8c0b0', '#c9d8b9', '#d8d0a0'][i]} /><circle cx={-12} cy={-6} r={12} fill="#f4f2fb" stroke={INK} strokeWidth={2} /><circle cx={16} cy={2} r={9} fill="#f4f2fb" stroke={INK} strokeWidth={2} /></g>)}
      <g transform="translate(2500 160)"><rect x={0} y={0} width={240} height={320} fill="#10183a" stroke={INK} strokeWidth={5} /><path d="M 120,0 L 120,320 M 0,160 L 240,160" stroke="#6a5a4a" strokeWidth={6} /><circle cx={180} cy={60} r={20} fill="#fff3b0" /></g>
    </g>
  ),
  mid: (
    <g>
      <path d="M 300,760 L 2350,160" fill="none" stroke="#3a2a20" strokeWidth={16} strokeLinecap="round" /><path d="M 300,820 L 2350,220" fill="none" stroke={INK} strokeWidth={5} />
      {Array.from({length: 14}, (_, i) => <line key={i} x1={300 + i * 158} y1={760 - i * 46} x2={300 + i * 158} y2={850 - i * 46} stroke="#3a2a20" strokeWidth={8} />)}
      <g transform="translate(260 830)"><path d="M -60,0 q 0,-26 40,-26 l 50,0 l 0,26 Z" fill="#2a2a38" stroke={INK} strokeWidth={3} /><path d="M 50,0 q 0,-20 40,-20 l 40,0 l 0,20 Z" fill="#3a2f26" stroke={INK} strokeWidth={3} /></g>
    </g>
  ),
});

export const hospitalDetail`);
fs.writeFileSync('src/fathers/details.tsx',d);
let k=fs.readFileSync('src/fathers/kit.tsx','utf8');
k=k.replace("kitchenDetail, officeDetail, parkDetail,","kitchenDetail, officeDetail, parkDetail, roomDetail, stairsDetail, doorDetail,");
k=k.replace("mk(leoDoor({t: c.t, ...o}),","mk(merge(leoDoor({t: c.t, ...o}), doorDetail()),");
k=k.replace("mk(leoRoom({t: c.t}),","mk(merge(leoRoom({t: c.t}), roomDetail({t: c.t})),");
k=k.replace("mk(stairs({t: c.t}),","mk(merge(stairs({t: c.t}), stairsDetail()),");
fs.writeFileSync('src/fathers/kit.tsx',k);
