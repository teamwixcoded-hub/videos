// crate in the father's hands, Leo's tree crown on his head, a lower car body so the passengers show
const fs = require('fs');
const rd = (f) => fs.readFileSync(f, 'utf8'), wr = (f, s) => fs.writeFileSync(f, s);
const sub = (s, a, b, tag) => { if (!s.includes(a)) { console.log('MISSING', tag || String(a).slice(0, 70)); return s; } return s.split(a).join(b); };
let sh = rd('src/fathers/shots.tsx');
sh = sub(sh, '<g transform="translate(0 -20)"><rect x={150} y={-90} width={110} height={80} rx={8} fill="#c9954a" stroke="#1d1a2e" strokeWidth={4} /><rect x={150} y={-90} width={110} height={20} fill="#e0b068" stroke="#1d1a2e" strokeWidth={3} /></g>', '<g><rect x={-55} y={-60} width={110} height={80} rx={8} fill="#c9954a" stroke="#1d1a2e" strokeWidth={4} /><rect x={-55} y={-60} width={110} height={20} fill="#e0b068" stroke="#1d1a2e" strokeWidth={3} /></g>', 'crate');
sh = sub(sh, "const p = at('leo', 10, x, 540, sc, {turn: 0.15, top: '#7a5230', ...extra}), k = sc * 0.5 * 0.85, hx = p.x + 20 * k, hy = p.y - 440 * k;", "const p = at('leo', 10, x, 540, sc, {turn: 0.15, top: '#7a5230', ...extra}), k = sc * bodyK('leo', 10) * 0.85, hx = p.x + 26 * k, hy = p.y - 450 * k;", 'tree k');
sh = sub(sh, '<g transform={`translate(${hx} ${hy - 170 * k})`}>', '<g transform={`translate(${hx} ${hy - 215 * k})`}>', 'tree crown');
sh = sub(sh, "{Pe(c, sit('max', 8, 1350, 0.62, {turn: 0.7, face: F.grin}, 905))}", "{Pe(c, sit('max', 12, 1330, 0.66, {turn: 0.7, face: F.grin}, 905))}", 'drive max');
wr('src/fathers/shots.tsx', sh);
let s3 = rd('src/fathers/sets3.tsx');
s3 = sub(s3, '<path d="M 700,560 L 760,470 L 2380,470 L 2440,560 L 2440,760 L 700,760 Z" fill="#3a5a8a" stroke={INK} strokeWidth={5} strokeLinejoin="round" transform="translate(0 150)" />', '<path d="M 700,560 L 760,470 L 2380,470 L 2440,560 L 2440,760 L 700,760 Z" fill="#3a5a8a" stroke={INK} strokeWidth={5} strokeLinejoin="round" transform="translate(0 250)" />', 'car body');
s3 = sub(s3, '<rect x={700} y={640} width={1740} height={60} fill="#2c456e" stroke={INK} strokeWidth={4} />', '<rect x={700} y={740} width={1740} height={60} fill="#2c456e" stroke={INK} strokeWidth={4} />', 'car stripe');
s3 = sub(s3, '<path d="M 1560,640 L 1560,900" stroke={INK} strokeWidth={4} /><rect x={1640} y={720} width={120} height={20} rx={8} fill="#1d2c4a" stroke={INK} strokeWidth={3} />', '<path d="M 1560,740 L 1560,1000" stroke={INK} strokeWidth={4} /><rect x={1640} y={820} width={120} height={20} rx={8} fill="#1d2c4a" stroke={INK} strokeWidth={3} />', 'car door');
s3 = sub(s3, '<g key={x} transform={`translate(${x} 905)`}>', '<g key={x} transform={`translate(${x} 1000)`}>', 'wheels');
wr('src/fathers/sets3.tsx', s3);
console.log('patched 13');
