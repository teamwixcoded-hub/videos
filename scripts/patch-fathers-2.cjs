// eyes with a clipped lid, walking arms that do not cross, bench behind the sitters, a bed rail in front of Leo
const fs = require('fs');
const P = (f) => 'src/fathers/' + f;
const edit = (file, pairs) => {
  let s = fs.readFileSync(P(file), 'utf8');
  for (const [a, b, all] of pairs) {
    if (!s.includes(a)) { console.log('MISSING in', file, ':', a.slice(0, 80)); continue; }
    s = all ? s.split(a).join(b) : s.replace(a, b);
  }
  fs.writeFileSync(P(file), s);
};
edit('People.tsx', [
  [`  const rx = 15 * (1 - 0.3 * far) * (1 + 0.1 * wide), ry = 12 * (1 + 0.35 * wide);
  return (
    <g>`, `  const rx = 15 * (1 - 0.3 * far) * (1 + 0.1 * wide), ry = 12 * (1 + 0.35 * wide), id = useId().replace(/:/g, '');
  return (
    <g>
      <defs><clipPath id={'e' + id}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} /></clipPath></defs>`],
  [`      {cover > 0.02 && <path d={\`M \${cx - rx - 2},\${cy - ry - 2} L \${cx + rx + 2},\${cy - ry - 2} L \${cx + rx + 2},\${cy - ry + 2 * ry * cover} Q \${cx},\${cy - ry + 2 * ry * cover + 4} \${cx - rx - 2},\${cy - ry + 2 * ry * cover} Z\`} fill={skin} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />}`,
   `      {cover > 0.1 && <g clipPath={\`url(#e\${id})\`}><rect x={cx - rx - 3} y={cy - ry - 3} width={2 * rx + 6} height={2 * ry * cover + 3} fill={skin} /><line x1={cx - rx - 3} x2={cx + rx + 3} y1={cy - ry + 2 * ry * cover} y2={cy - ry + 2 * ry * cover} stroke={INK} strokeWidth={2.6} /></g>}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={2.4} />`],
  ['cover={cover + sm * 0.12}', 'cover={cover + sm * 0.06}'],
]);
edit('shots2.tsx', [
  ['handL: [-60 + Math.sin(c.l * 4.4) * 70, 60], handR: [60 - Math.sin(c.l * 4.4) * 70, 60]}))}\n  {Pe', 'handL: [-96 + Math.sin(c.l * 4.4) * 34, 70], handR: [96 - Math.sin(c.l * 4.4) * 34, 70]}))}\n  {Pe'],
  ['handL: [-60 + Math.sin(c.l * 4.4) * 70, 60], handR: [60 - Math.sin(c.l * 4.4) * 70, 60]}))}</>', 'handL: [-96 + Math.sin(c.l * 4.4) * 34, 70], handR: [96 - Math.sin(c.l * 4.4) * 34, 70]}))}</>'],
]);
edit('sets.tsx', [
  // bench goes behind the sitters (mid), cups stay in front
  [`    front: (
      <g>
        {/* the bench */}
        <rect x={1260} y={640} width={1000} height={34} rx={8} fill="#8a6446" stroke={INK} strokeWidth={5} />
        <rect x={1300} y={674} width={22} height={160} fill="#7a5a3e" stroke={INK} strokeWidth={4} /><rect x={2200} y={674} width={22} height={160} fill="#7a5a3e" stroke={INK} strokeWidth={4} />
        {Array.from`, `    front: (
      <g>
        {Array.from`],
  [`        {s === 3 && Array.from({length: 40}`, `        <g>
          <rect x={1260} y={640} width={1000} height={34} rx={8} fill="#8a6446" stroke={INK} strokeWidth={5} />
          <rect x={1300} y={674} width={22} height={160} fill="#7a5a3e" stroke={INK} strokeWidth={4} /><rect x={2200} y={674} width={22} height={160} fill="#7a5a3e" stroke={INK} strokeWidth={4} />
        </g>
        {s === 3 && Array.from({length: 40}`],
  // Leo's bed rail in front of him
  [`  mid: (<g><rect x={1100} y={600} width={520} height={230} rx={30} fill="#34406e" stroke={INK} strokeWidth={5} /><rect x={1100} y={560} width={520} height={90} rx={30} fill="#3f4d86" stroke={INK} strokeWidth={5} /></g>),
  rim: 'rgba(150,190,255,.85)',`, `  mid: (<g><rect x={1100} y={600} width={520} height={230} rx={30} fill="#34406e" stroke={INK} strokeWidth={5} /><rect x={1100} y={560} width={520} height={90} rx={30} fill="#3f4d86" stroke={INK} strokeWidth={5} /></g>),
  front: (<g><rect x={1080} y={668} width={560} height={74} rx={28} fill="#3a4878" stroke={INK} strokeWidth={5} /></g>),
  rim: 'rgba(150,190,255,.85)',`],
]);
console.log('patched 2');
