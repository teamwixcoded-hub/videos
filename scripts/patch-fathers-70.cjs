const fs=require('fs');let d=fs.readFileSync('src/fathers/details.tsx','utf8');
const a=d.indexOf("export const hospitalDetail");const b=d.indexOf("export const doorDetail");
if(a<0||b<0)throw new Error('markers');
const code=`// hospital corridor: tiles in perspective, a wainscot and hand rail on both walls, posters and a notice board, ceiling light panels, sconces, a sanitiser, waiting chairs and a trolley
const HW: Record<'l' | 'r', [number, number][]> = {l: [[-400, -200], [1450, 430], [1450, 570], [-400, 1180]], r: [[3600, -200], [1750, 430], [1750, 570], [3600, 1180]]};
const hp = (s: 'l' | 'r', u: number, v: number): [number, number] => { const [A, B, C, D] = HW[s]; const t = [lerp(A[0], B[0], u), lerp(A[1], B[1], u)], bt = [lerp(D[0], C[0], u), lerp(D[1], C[1], u)]; return [lerp(t[0], bt[0], v), lerp(t[1], bt[1], v)]; };
const hq = (s: 'l' | 'r', u0: number, v0: number, u1: number, v1: number, fill: string, sw = 2.4) => poly([hp(s, u0, v0), hp(s, u1, v0), hp(s, u1, v1), hp(s, u0, v1)], fill, sw);
export const hospitalDetail = (): Detail => ({
  far: (
    <g>
      {/* floor: tile joints converging on the end of the corridor */}
      {Array.from({length: 17}, (_, i) => { const x = -400 + i * 250; return <line key={'fl' + i} x1={1600 + (x - 1600) * 0.07} y1={572} x2={x} y2={1180} stroke="rgba(20,26,60,.35)" strokeWidth={2.4} />; })}
      {[0.04, 0.1, 0.19, 0.31, 0.47, 0.67, 0.92].map((k, i) => { const y = lerp(572, 1180, k), x0 = lerp(1450, -400, k), x1 = lerp(1750, 3600, k); return <line key={'fh' + i} x1={x0} y1={y} x2={x1} y2={y} stroke="rgba(20,26,60,.35)" strokeWidth={2.4} />; })}
      <polygon points="1450,570 1750,570 2300,1180 900,1180" fill="#fff" opacity={0.08} />
      {/* walls: wainscot panel, hand rail, skirting */}
      {(['l', 'r'] as const).map((s) => <g key={s}>
        {hq(s, 0, 0.66, 1, 1, s === 'l' ? '#4a5890' : '#6a3e30', 2.4)}
        {[0.06, 0.2, 0.36, 0.56, 0.78].map((u, i) => hq(s, u, 0.7, u + 0.1 * (1 - u * 0.5), 0.94, 'rgba(0,0,0,0.12)', 1.6))}
        {hq(s, 0, 0.62, 1, 0.655, '#e6e9f6', 2.6)}{hq(s, 0, 0.97, 1, 1.0, '#2c3354', 2)}
      </g>)}
      {/* posters and a notice board on the walls */}
      {hq('l', 0.22, 0.18, 0.32, 0.46, '#f4ecd8', 3)}{hq('l', 0.235, 0.22, 0.305, 0.3, '#e0455a', 1.6)}{hq('l', 0.235, 0.33, 0.305, 0.34, '#9a9482', 1)}{hq('l', 0.235, 0.37, 0.29, 0.38, '#9a9482', 1)}
      {hq('l', 0.5, 0.2, 0.66, 0.44, '#a98c5a', 3)}{[0, 1, 2].map((i) => hq('l', 0.52 + i * 0.045, 0.25, 0.555 + i * 0.045, 0.34 + (i % 2) * 0.03, ['#fff', '#cfe2f4', '#ffe9a0'][i], 1.4))}
      {hq('r', 0.2, 0.2, 0.3, 0.44, '#cfe6f4', 3)}{hq('r', 0.215, 0.24, 0.285, 0.32, '#3a7ac0', 1.6)}{hq('r', 0.215, 0.36, 0.285, 0.375, '#9a9482', 1)}
      {hq('r', 0.52, 0.28, 0.58, 0.46, '#e9ecf8', 2.6)}{hq('r', 0.535, 0.33, 0.565, 0.4, '#e0455a', 1.4)}
      {/* ceiling light panels in perspective, and a glow on the floor under each */}
      {[0.12, 0.3, 0.5, 0.72].map((k, i) => { const y = lerp(430, 40, 1 - (1 - k) * 1) * 1, w = lerp(60, 300, 1 - k); const yy = lerp(432, -40, 1 - k); return <g key={'cl' + i}><rect x={1600 - w / 2} y={yy} width={w} height={lerp(8, 26, 1 - k)} rx={4} fill="#fffbe0" stroke={INK} strokeWidth={2.4} /></g>; })}
      {/* sconces on the walls */}
      {[0.14, 0.4, 0.62].map((u, i) => { const p = hp('l', u, 0.3), q = hp('r', u, 0.3); const sc = lerp(1, 0.4, u); return <g key={'sc' + i}>{[p, q].map((pp, j) => <g key={j} transform={\`translate(\${pp[0]} \${pp[1]}) scale(\${sc})\`}><rect x={-14} y={-10} width={28} height={34} rx={8} fill="#fff6c8" stroke={INK} strokeWidth={3} /><ellipse cx={0} cy={0} rx={50} ry={40} fill="#fff6c8" opacity={0.22} /></g>)}</g>; })}
    </g>
  ),
  mid: (
    <g>
      {[0, 1, 2].map((i) => <g key={i} transform={\`translate(\${360 + i * 130} 790)\`}><rect x={-50} y={-70} width={100} height={70} rx={10} fill="#4a5a8a" stroke={INK} strokeWidth={3.4} /><rect x={-50} y={-20} width={100} height={22} rx={6} fill="#5a6aa8" stroke={INK} strokeWidth={3} /><rect x={-44} y={2} width={8} height={36} fill="#2a2a38" /><rect x={36} y={2} width={8} height={36} fill="#2a2a38" /></g>)}
      <g transform="translate(2700 830)"><rect x={-90} y={-130} width={180} height={14} rx={6} fill="#c9ccd8" stroke={INK} strokeWidth={3} /><rect x={-86} y={-116} width={8} height={100} fill="#8a90b8" /><rect x={78} y={-116} width={8} height={100} fill="#8a90b8" />{[-60, 60].map((x) => <circle key={x} cx={x} cy={-6} r={14} fill="#1d1d24" stroke={INK} strokeWidth={3} />)}<rect x={-70} y={-160} width={140} height={30} rx={8} fill="#e9ecf8" stroke={INK} strokeWidth={3} /><rect x={-60} y={-196} width={50} height={40} rx={4} fill="#fff" stroke={INK} strokeWidth={2.4} /><rect x={20} y={-188} width={40} height={32} rx={4} fill="#cfe2f4" stroke={INK} strokeWidth={2.4} /></g>
      <g transform="translate(980 830)"><rect x={-26} y={-300} width={52} height={300} rx={6} fill="#dfe6f4" stroke={INK} strokeWidth={3.4} /><rect x={-16} y={-280} width={32} height={60} rx={4} fill="#4aa8ff" opacity={0.6} /><rect x={-10} y={-190} width={20} height={36} rx={4} fill="#fff" stroke={INK} strokeWidth={2.4} /><path d="M -26,-300 L 0,-330 L 26,-300 Z" fill="#c0392b" stroke={INK} strokeWidth={2.6} /></g>
    </g>
  ),
});

`;
d=d.slice(0,a)+code+d.slice(b);
fs.writeFileSync('src/fathers/details.tsx',d);
