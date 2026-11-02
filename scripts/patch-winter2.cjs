const fs = require('fs');
let s = fs.readFileSync('src/winter/Hero.tsx', 'utf8');
const i = s.indexOf('export type BodyProps');
if (i < 0) throw new Error('no BodyProps');
s = s.slice(0, i) + fs.readFileSync('src/winter/body_tail.txt', 'utf8');
const a = '<circle cx={0} cy={0} r={200} fill={skin} stroke={INK} strokeWidth={11} />';
if (!s.includes(a)) throw new Error('no head circle');
s = s.replace(a, `<defs><radialGradient id={\`sk\${id}\`} cx="38%" cy="30%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity="0.38" /><stop offset="0.45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.16" /></radialGradient></defs>
      <circle cx={0} cy={0} r={200} fill={skin} stroke={INK} strokeWidth={11} /><circle cx={0} cy={0} r={200} fill={\`url(#sk\${id})\`} />
      <ellipse cx={-120} cy={-40} rx={22} ry={36} fill="#fff" opacity={0.2} transform="rotate(20 -120 -40)" />`);
fs.writeFileSync('src/winter/Hero.tsx', s);
fs.unlinkSync('src/winter/body_tail.txt');
