const fs=require('fs');let d=fs.readFileSync('src/fathers/details.tsx','utf8');
const a=d.indexOf("export const streetDetail");const b=d.indexOf("export const kitchenDetail");
if(a<0||b<0)throw new Error('markers');
const code=`const lp = (side: 'adam' | 'sam', u: number, v: number) => streetPoint(side, u, v);
const poly = (pts: [number, number][], fill: string, sw = 2.4, extra: object = {}) => <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" {...extra} />;
const qd = (side: 'adam' | 'sam', u0: number, v0: number, u1: number, v1: number, fill: string, sw = 2.4) => poly([lp(side, u0, v0), lp(side, u1, v0), lp(side, u1, v1), lp(side, u0, v1)], fill, sw);
// a street lamp, scaled by its distance down the street
const Lamp: React.FC<{x: number; y: number; s: number; on: boolean; dir: number}> = ({x, y, s, on, dir}) => (
  <g transform={\`translate(\${x} \${y}) scale(\${s * dir} \${s})\`}>
    <ellipse cx={0} cy={4} rx={40} ry={8} fill="rgba(5,6,15,.3)" />
    <rect x={-6} y={-330} width={12} height={334} fill="#232842" stroke={INK} strokeWidth={3} /><rect x={-14} y={-30} width={28} height={30} rx={4} fill="#2c3252" stroke={INK} strokeWidth={3} />
    <path d="M 0,-326 Q 36,-346 64,-318" fill="none" stroke="#232842" strokeWidth={9} strokeLinecap="round" />
    <path d="M 46,-318 L 86,-318 L 76,-300 L 56,-300 Z" fill={on ? '#ffe9a0' : '#cfd6ea'} stroke={INK} strokeWidth={3} />{on && <ellipse cx={66} cy={-290} rx={70} ry={50} fill="#ffe08a" opacity={0.2} />}
  </g>
);
const Tree: React.FC<{x: number; y: number; s: number; a: string; b: string}> = ({x, y, s, a, b}) => (
  <g transform={\`translate(\${x} \${y}) scale(\${s})\`}>
    <ellipse cx={0} cy={6} rx={90} ry={14} fill="rgba(5,6,15,.28)" />
    <path d="M -16,0 L -10,-170 L 10,-170 L 16,0 Z" fill="#4a3426" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><path d="M 0,-110 L -44,-170 M 0,-130 L 42,-186" stroke="#4a3426" strokeWidth={9} strokeLinecap="round" />
    <circle cx={0} cy={-250} r={104} fill={a} stroke={INK} strokeWidth={4} /><circle cx={-70} cy={-206} r={64} fill={a} stroke={INK} strokeWidth={4} /><circle cx={72} cy={-214} r={66} fill={a} stroke={INK} strokeWidth={4} />
    <circle cx={-26} cy={-282} r={56} fill={b} opacity={0.85} /><circle cx={46} cy={-232} r={40} fill={b} opacity={0.7} /><circle cx={-76} cy={-222} r={30} fill={b} opacity={0.7} />
  </g>
);
export const streetDetail = (o: {t: number; night?: boolean; sunset?: number; season?: number}): Detail => {
  const sun = (o.sunset ?? 0) > 0.2, night = !!o.night, lit = night || sun;
  const leafA = ['#c4486a', '#3c8a52', '#c9802b', '#cfd6ee'][(o.season ?? 1) % 4], leafB = ['#e07a94', '#5eb572', '#e6a24a', '#f2f5fc'][(o.season ?? 1) % 4];
  const bk1 = night ? '#18203c' : sun ? '#8a4f2c' : '#4a5688', bk2 = night ? '#10162c' : sun ? '#6d3a20' : '#394675';
  const lampPts = [0.1, 0.38, 0.62, 0.82];
  return {
    far: (
      <g>
        <path d="M 900,560 Q 1200,470 1500,520 T 2300,500 L 2300,660 L 900,660 Z" fill={night ? '#121a30' : sun ? '#7a4a2e' : '#6a7eb0'} opacity={0.7} />
        {Array.from({length: 12}, (_, i) => <rect key={'b' + i} x={1060 + i * 82} y={330 + ((i * 53) % 90)} width={78} height={330 - ((i * 53) % 90)} fill={bk1} stroke={INK} strokeWidth={1.8} />)}
        {Array.from({length: 10}, (_, i) => <g key={'c' + i}><rect x={1100 + i * 96} y={410 + ((i * 71) % 80)} width={90} height={260 - ((i * 71) % 80)} fill={bk2} stroke={INK} strokeWidth={1.8} />{Array.from({length: 9}, (_, k) => <rect key={k} x={1112 + i * 96 + (k % 3) * 26} y={426 + ((i * 71) % 80) + Math.floor(k / 3) * 44} width={14} height={18} fill={lit && (i + k) % 3 === 0 ? '#ffd27a' : night ? '#1e2848' : sun ? '#a86a3a' : '#6a7aae'} opacity={0.9} />)}</g>)}
        <g transform="translate(1900 350)"><rect x={-3} y={-60} width={6} height={60} fill="#232842" /><circle cy={-62} r={6} fill={lit ? '#ff6a6a' : '#7a86b0'} /></g>
        {sun && <circle cx={1500} cy={470} r={110} fill="#ffd27a" opacity={0.55} />}
        {[0, 1, 2].map((i) => <path key={i} d={\`M \${1000 + i * 380 + Math.sin(o.t * 0.4 + i) * 40},\${190 + i * 26} q 16,-18 32,0 q 16,-18 32,0\`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" opacity={0.6} />)}
        <path d="M 160,150 Q 1600,280 3040,150" fill="none" stroke={INK} strokeWidth={3} opacity={0.55} /><path d="M 160,176 Q 1600,306 3040,176" fill="none" stroke={INK} strokeWidth={3} opacity={0.45} />
        <ellipse cx={1600} cy={860} rx={90} ry={18} fill="#2c3354" stroke={INK} strokeWidth={3} /><ellipse cx={1600} cy={860} rx={64} ry={11} fill="none" stroke="#1d2238" strokeWidth={3} />
      </g>
    ),
    mid: (
      <g>
        {[0.1, 0.36].map((u) => <g key={'aw' + u}>{qd('adam', u - 0.012, 0.16, u + 0.182, 0.42, 'rgba(0,0,0,0)', 5)}{poly([lp('adam', u + 0.085, 0.18), lp('adam', u + 0.095, 0.18), lp('adam', u + 0.095, 0.4), lp('adam', u + 0.085, 0.4)], '#2c3354', 1.5)}{qd('adam', u - 0.02, 0.4, u + 0.19, 0.43, '#59639a', 3)}</g>)}
        {[0.1, 0.36].map((u) => <g key={'sw' + u}>{qd('sam', u - 0.012, 0.16, u + 0.182, 0.42, 'rgba(0,0,0,0)', 5)}{poly([lp('sam', u + 0.085, 0.18), lp('sam', u + 0.095, 0.18), lp('sam', u + 0.095, 0.4), lp('sam', u + 0.085, 0.4)], '#5a3a1c', 1.5)}{qd('sam', u - 0.05, 0.16, u - 0.012, 0.42, '#6a4a2a', 3)}{qd('sam', u + 0.182, 0.16, u + 0.22, 0.42, '#6a4a2a', 3)}{qd('sam', u - 0.02, 0.4, u + 0.19, 0.43, '#c9a064', 3)}</g>)}
        {[0.12, 0.2, 0.28, 0.36, 0.44, 0.52, 0.6, 0.68, 0.76, 0.84, 0.92].map((v) => <polyline key={'br' + v} points={[lp('sam', 0, v).join(','), lp('sam', 1, v).join(',')].join(' ')} stroke="rgba(30,18,10,.28)" strokeWidth={1.6} />)}
        {[0.18, 0.3, 0.42, 0.54, 0.66, 0.78, 0.9].map((v) => <polyline key={'sd' + v} points={[lp('adam', 0, v).join(','), lp('adam', 1, v).join(',')].join(' ')} stroke="rgba(12,16,40,.3)" strokeWidth={2} />)}
        {qd('adam', 0.64, 0.98, 0.84, 1.03, '#6a74a8', 3)}{qd('sam', 0.64, 0.98, 0.84, 1.03, '#9a8468', 3)}
        {qd('sam', 0.62, 0.36, 0.84, 0.43, '#b2412a', 3)}
        <g transform={\`translate(\${lp('adam', 0.735, 0.4)[0]} \${lp('adam', 0.735, 0.4)[1]})\`}><circle r={7} fill={lit ? '#ffe08a' : '#b0b8d4'} stroke={INK} strokeWidth={2} />{lit && <circle r={26} fill="#ffe08a" opacity={0.22} />}</g>
        <g transform={\`translate(\${lp('sam', 0.9, 0.62)[0]} \${lp('sam', 0.9, 0.62)[1]}) scale(0.8)\`}><rect x={-18} y={-14} width={36} height={24} rx={3} fill="#f0ead8" stroke={INK} strokeWidth={2} /><text x={0} y={5} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={18} fill="#2a2a38">12</text></g>
        {[0.05, 0.2, 0.34, 0.5, 0.88].map((u, i) => { const p = lp('adam', u, 1.02), q = lp('adam', u + 0.1, 1.02); return <path key={'ha' + i} d={\`M \${p[0]},\${p[1]} q \${(q[0] - p[0]) * 0.25},\${-90 * (1 - u * 0.5)} \${(q[0] - p[0]) * 0.5},\${-40} q \${(q[0] - p[0]) * 0.25},\${-50} \${(q[0] - p[0]) * 0.5},\${(q[1] - p[1]) + 40} Z\`} fill="#2f6a46" stroke={INK} strokeWidth={3} />; })}
        {[0.05, 0.2, 0.34, 0.5, 0.88].map((u, i) => { const p = lp('sam', u, 1.02), q = lp('sam', u + 0.1, 1.02); return <path key={'hs' + i} d={\`M \${p[0]},\${p[1]} q \${(q[0] - p[0]) * 0.25},\${-90 * (1 - u * 0.5)} \${(q[0] - p[0]) * 0.5},\${-40} q \${(q[0] - p[0]) * 0.25},\${-50} \${(q[0] - p[0]) * 0.5},\${(q[1] - p[1]) + 40} Z\`} fill="#3a7a4c" stroke={INK} strokeWidth={3} />; })}
        {[[0.12, '#ff7a9a'], [0.26, '#ffd24a'], [0.42, '#fff'], [0.58, '#ff9a4a']].map(([u, c], i) => { const p = lp('sam', u as number, 1.04); return <g key={'fl' + i}><circle cx={p[0]} cy={p[1] - 14} r={9} fill={c as string} stroke={INK} strokeWidth={1.8} /><circle cx={p[0] + 22} cy={p[1] - 8} r={7} fill={c as string} stroke={INK} strokeWidth={1.8} /></g>; })}
        <Tree x={lp('sam', 0.34, 1.0)[0] + 90} y={lp('sam', 0.34, 1.0)[1] + 10} s={0.46} a={leafA} b={leafB} /><Tree x={lp('sam', 0.7, 1.0)[0] + 90} y={lp('sam', 0.7, 1.0)[1] + 10} s={0.8} a={leafA} b={leafB} />
        <Tree x={lp('adam', 0.5, 1.0)[0] - 80} y={lp('adam', 0.5, 1.0)[1] + 10} s={0.55} a={leafA} b={leafB} />
        {lampPts.map((u, i) => <Lamp key={'l' + i} x={lp('adam', u, 1.0)[0] + 28} y={lp('adam', u, 1.0)[1] + 46} s={lerp(0.62, 0.3, 1 - u + 0.1) * (u < 0.2 ? 1.5 : 1)} on={lit} dir={1} />)}
        {[0.28, 0.58].map((u, i) => <Lamp key={'r' + i} x={lp('sam', u, 1.0)[0] - 28} y={lp('sam', u, 1.0)[1] + 46} s={lerp(0.62, 0.3, 1 - u + 0.1)} on={lit} dir={-1} />)}
        <g transform="translate(2360 836) scale(0.55)"><ellipse cx={0} cy={6} rx={170} ry={18} fill="rgba(5,6,15,.3)" /><path d="M -150,-20 L -150,-60 Q -140,-86 -100,-92 L -56,-130 Q -44,-142 -24,-142 L 70,-142 Q 90,-142 102,-126 L 128,-92 Q 150,-84 150,-60 L 150,-20 Z" fill="#b0453a" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M -44,-128 L 70,-128 L 100,-96 L -80,-96 Z" fill="#cfe0f2" stroke={INK} strokeWidth={4} /><path d="M 12,-128 L 12,-96" stroke={INK} strokeWidth={4} />{[-92, 96].map((x) => <g key={x} transform={\`translate(\${x} -10)\`}><circle r={30} fill="#1d1d24" stroke={INK} strokeWidth={4} /><circle r={14} fill="#8a90b8" /></g>)}<rect x={134} y={-52} width={14} height={16} rx={3} fill="#ffe08a" /></g>
        {[['adam', 0.58], ['sam', 0.58]].map(([sd, u], i) => { const p = lp(sd as 'adam' | 'sam', u as number, 1.0); return <g key={'mb' + i} transform={\`translate(\${p[0]} \${p[1] + 26})\`}><rect x={-3} y={-60} width={6} height={60} fill="#3a3f5e" stroke={INK} strokeWidth={2} /><rect x={-22} y={-86} width={44} height={28} rx={9} fill="#c0392b" stroke={INK} strokeWidth={3} /></g>; })}
      </g>
    ),
  };
};

`;
d=d.slice(0,a)+code+d.slice(b);
d=d.replace("import {FL, SetOut} from './sets';","import {FL, SetOut, streetPoint} from './sets';");
if(!d.includes('const lerp = '))d=d.replace("const rnd = (i: number, k: number)","const lerp = (a: number, b: number, k: number) => a + (b - a) * k;\nconst rnd = (i: number, k: number)");
fs.writeFileSync('src/fathers/details.tsx',d);
let k=fs.readFileSync('src/fathers/kit.tsx','utf8');
k=k.replace("streetDetail({t: c.t, night: o.night})","streetDetail({t: c.t, night: o.night, sunset: o.sunset, season: o.season})");
fs.writeFileSync('src/fathers/kit.tsx',k);
