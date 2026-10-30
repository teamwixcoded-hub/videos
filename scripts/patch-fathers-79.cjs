const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const i=h.indexOf("const Mitten: React.FC");const j=h.indexOf("// a human hand:");
if(i<0||j<0)throw new Error('mitten');
h=h.slice(0,i)+`// a hand that fits the gesture. curl: <= -0.5 open spread (wave), 0..0.8 relaxed to curled, 0.85..1 fist, >= 1.5 pointing finger. Wrist at the origin, fingers along +y, thumb on +x.
const Mitten: React.FC<{curl?: number; s?: number}> = ({curl = 0.35, s = 1}) => {
  const open = curl <= -0.5, point = curl >= 1.5, fist = !point && !open && curl >= 0.85, c = open ? 0 : point ? 1 : Math.min(curl, 1);
  const X = [-13.5, -4.5, 4.5, 13], L = [24, 29, 27, 21], B = 36;
  const fingers = X.map((x, k) => {
    if (open) { const a = ((k - 1.5) * 14 * Math.PI) / 180, l = L[k] * 1.12; return \`M \${x},\${B} L \${x + Math.sin(a) * l},\${B + Math.cos(a) * l}\`; }
    if (point && k === 1) return \`M \${x},\${B} L \${x + 1},\${B + 40}\`;
    if (fist || point) return \`M \${x},\${B} Q \${x + 1},\${B + 11} \${x - 1},\${B + 15}\`;
    return \`M \${x},\${B} Q \${x + 1},\${B + L[k] * 0.8} \${x + c * 4},\${B + L[k] * (1 - 0.42 * c)}\`;
  });
  const thumb = open ? 'M 18,12 Q 30,18 38,34' : (fist || point) ? 'M 18,12 Q 26,24 17,38' : \`M 18,12 Q \${26 + 2 * c},\${22} \${28 - 5 * c},\${34 - 3 * c}\`;
  const palm = 'M -17,-2 L -19,20 Q -21,36 -19,40 Q 0,47 19,40 Q 21,36 19,20 L 17,-2';
  return (
    <g transform={\`scale(\${s})\`} strokeLinecap="round" strokeLinejoin="round">
      <path d={palm} fill={SKIN} stroke={INK} strokeWidth={4} />
      <g fill="none" stroke={INK} strokeWidth={13.6}>{fingers.map((d, k) => <path key={k} d={d} />)}<path d={thumb} strokeWidth={14.4} /></g>
      <g fill="none" stroke={SKIN} strokeWidth={9.4}>{fingers.map((d, k) => <path key={k} d={d} />)}<path d={thumb} strokeWidth={10} /></g>
      <path d={palm + ' Z'} fill={SKIN} stroke="none" />
      <path d="M -9,24 Q 0,30 11,22" fill="none" stroke={SKIN_D} strokeWidth={2.4} />
    </g>
  );
};

`+h.slice(j);
// the forearm ends exactly as wide as the wrist so arm and hand read as one limb
h=h.split("w={50} w2={37} fill={o.top}").join("w={50} w2={42} fill={o.top}");
fs.writeFileSync('src/fathers/Human.tsx',h);
let p=fs.readFileSync('src/fathers/People.tsx','utf8');
p=p.replace("clap: 0.1, knock: 0.9, wave: 0.05,","clap: 0.1, knock: 0.9, wave: -1,").replace("fold: 0.45, point: 0.2,","fold: 0.45, point: 2,");
fs.writeFileSync('src/fathers/People.tsx',p);
