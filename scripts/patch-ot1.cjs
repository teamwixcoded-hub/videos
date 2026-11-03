const fs = require('fs');
let s = fs.readFileSync('src/overthinking/scenes.tsx', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 70)); s = s.split(a).join(b); };
// email: bigger text
rep("<Txt x={-600} y={-80 + i * 78} s={44} anchor=\"start\" c={l.c ?? '#1b1a3a'}>", "<Txt x={-600} y={-70 + i * 84} s={52} anchor=\"start\" c={l.c ?? '#1b1a3a'}>");
rep("<rect x={-612} y={-122 + i * 78} width={l.text.length * 22 + 20} height={58} rx={10}", "<rect x={-612} y={-118 + i * 84} width={l.text.length * 26 + 20} height={66} rx={10}");
rep('<Txt x={-600} y={-250} s={34} anchor="start" c="#4a4f7a">{to}</Txt><Txt x={-600} y={-196} s={34} anchor="start" c="#4a4f7a">{subject}</Txt>', '<Txt x={-600} y={-250} s={38} anchor="start" c="#4a4f7a">{to}</Txt><Txt x={-600} y={-196} s={38} anchor="start" c="#4a4f7a">{subject}</Txt>');
// thought cloud: wrap long text onto two lines
rep(`      const s = it.s ?? 44, w = it.text.length * s * 0.58 + 70, wob = Math.sin(t * 5 + i * 2) * 5;`, `      const s = it.s ?? 44, words = it.text.split(' '), mid = Math.ceil(words.length / 2), lines = it.text.length > 22 ? [words.slice(0, mid).join(' '), words.slice(mid).join(' ')] : [it.text], longest = Math.max(...lines.map((l) => l.length)), w = longest * s * 0.6 + 70, h = s * 1.9 + (lines.length - 1) * s * 1.05, wob = Math.sin(t * 5 + i * 2) * 5;`);
rep(`<rect x={-w / 2} y={-s * 0.95} width={w} height={s * 1.9} rx={s * 0.95} fill={c} stroke="#8a7fd8" strokeWidth={6} /><Txt x={0} y={s * 0.32} s={s} c="#e8e4ff">{it.text}</Txt>`, `<rect x={-w / 2} y={-s * 0.95} width={w} height={h} rx={Math.min(s * 0.95, h / 2)} fill={c} stroke="#8a7fd8" strokeWidth={6} />{lines.map((ln, j) => <Txt key={j} x={0} y={s * 0.32 + j * s * 1.05} s={s} c="#e8e4ff">{ln}</Txt>)}`);
fs.writeFileSync('src/overthinking/scenes.tsx', s);
let a = fs.readFileSync('src/overthinking/act1.tsx', 'utf8');
const r2 = (x, y) => { if (!a.includes(x)) throw new Error('missing2: ' + x.slice(0, 70)); a = a.split(x).join(y); };
r2('<Chip x={620} y={970} text="MORE FORMAL" c="#3b6fd8"', '<Chip x={470} y={985} s={38} text="MORE FORMAL" c="#3b6fd8"');
r2('<Chip x={960} y={970} text="LESS FORMAL" c="#8a4fd8"', '<Chip x={960} y={985} s={38} text="LESS FORMAL" c="#8a4fd8"');
r2('<Chip x={1330} y={970} text="MORE CONFIDENT" c="#3ddc84"', '<Chip x={1450} y={985} s={38} text="MORE CONFIDENT" c="#3ddc84"');
r2("x: 560, y: 250, s: 54}", "x: 520, y: 230, s: 50}");
r2("x: 1360, y: 300, s: 54}", "x: 1400, y: 300, s: 50}");
r2("x: 640, y: 440, s: 54}", "x: 520, y: 440, s: 50}");
for (const [o, n] of [["x: 560, y: 260, s: 46", "x: 480, y: 200, s: 40"], ["x: 1360, y: 300, s: 44", "x: 1440, y: 280, s: 40"], ["x: 600, y: 440, s: 40", "x: 480, y: 500, s: 38"], ["x: 1320, y: 460, s: 42", "x: 1440, y: 520, s: 38"]]) r2(o, n);
fs.writeFileSync('src/overthinking/act1.tsx', a);
