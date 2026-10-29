const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const r=(a,b,tag)=>{if(!h.includes(a)){console.log('MISSING',tag||a.slice(0,60));return;}h=h.replace(a,b)};
r("sleeve: 'long' | 'short'; sole?: string; watch?: boolean};","sleeve: 'long' | 'short'; sole?: string; watch?: boolean; simple?: boolean};");
// helpers: a noodle limb (one smooth curve through the joint) and a mitten hand
r("// a human hand: palm,",`// SIMPLE style: a limb is one smooth thick curve through the joint (no visible elbow/knee), the hand a rounded mitten with a thumb
const Noodle: React.FC<{A: V; J: V; B: V; w: number; fill: string}> = ({A, J, B, w, fill}) => {
  const c: V = [2 * J[0] - (A[0] + B[0]) / 2, 2 * J[1] - (A[1] + B[1]) / 2], d = \`M \${A[0]},\${A[1]} Q \${c[0]},\${c[1]} \${B[0]},\${B[1]}\`;
  return <g><path d={d} fill="none" stroke={INK} strokeWidth={w + 9} strokeLinecap="round" /><path d={d} fill="none" stroke={fill} strokeWidth={w} strokeLinecap="round" /><path d={d} fill="none" stroke="#fff" strokeWidth={w * 0.22} strokeLinecap="round" opacity={0.16} transform="translate(-6 -4)" /></g>;
};
const Mitten: React.FC<{curl?: number; s?: number}> = ({curl = 0.35, s = 1}) => (
  <g transform={\`scale(\${s})\`}>
    <path d={\`M -18,-4 Q -24,26 -16,44 Q 0,\${54 - curl * 14} 16,44 Q 24,26 18,-4 Z\`} fill={SKIN} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d={\`M 14,6 Q 34,12 32,\${34 - curl * 6} Q 26,40 18,30\`} fill={SKIN} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -6,38 Q 0,42 8,38" fill="none" stroke={SKIN_D} strokeWidth={3} strokeLinecap="round" />
  </g>
);

// a human hand: palm,`,'helpers');
// arm
r("    <g style={dim ? {filter: 'brightness(0.9)'} : undefined}>\n      <Taper A={S} B={E} r1={31} r2={24} fill={o.top} />",
"    o.simple ? (\n      <g style={dim ? {filter: 'brightness(0.9)'} : undefined}>\n        <Noodle A={S} J={E} B={wr} w={44} fill={o.top} />\n        {o.watch && <g transform={`translate(${mix(E, H, 0.82)[0]} ${mix(E, H, 0.82)[1]}) rotate(${fa})`}><rect x={-9} y={-20} width={18} height={40} rx={5} fill=\"#5a3a24\" stroke={INK} strokeWidth={2.6} /><circle r={14} fill=\"#f2c14e\" stroke={INK} strokeWidth={3} /><circle r={9.5} fill=\"#fbf1d2\" /></g>}\n        {held && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -6) ${upright ? `rotate(${-(fa - 90)})` : ''}`}>{held}</g></g>}\n        <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform=\"translate(0 -6)\"><Mitten curl={curl} s={s * 1.25} /></g></g>\n      </g>\n    ) : (\n    <g style={dim ? {filter: 'brightness(0.9)'} : undefined}>\n      <Taper A={S} B={E} r1={31} r2={24} fill={o.top} />",'arm start');
fs.writeFileSync('src/fathers/Human.tsx',h);
