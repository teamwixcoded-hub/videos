// held objects (phone to the ear, cups), new cup pose, ear pose at the jaw, shots use them
const fs = require('fs');
const rd = (f) => fs.readFileSync(f, 'utf8'), wr = (f, s) => fs.writeFileSync(f, s);
const sub = (s, a, b, tag) => { if (!s.includes(a)) { console.log('MISSING', tag || String(a).slice(0, 80)); return s; } return s.split(a).join(b); };

// ---------------- Human.tsx ----------------
let h = rd('src/fathers/Human.tsx');
h = sub(h, 'const HumanArm: React.FC<{S: V; T: V; o: Outfit; dim?: boolean; curl?: number; s: number}> = ({S, T, o, dim, curl = 0.35, s}) => {', 'const HumanArm: React.FC<{S: V; T: V; o: Outfit; dim?: boolean; curl?: number; s: number; held?: React.ReactNode; upright?: boolean}> = ({S, T, o, dim, curl = 0.35, s, held, upright}) => {', 'arm sig');
h = sub(h, '      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -${6})`}><HumanHand curl={curl} s={s * 1.3} dim={dim} /></g></g>\n    </g>\n  );\n};\n\nconst HumanLeg', '      {held && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -6) ${upright ? `rotate(${-(fa - 90)})` : \'\'}`}>{held}</g></g>}\n      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -${6})`}><HumanHand curl={curl} s={s * 1.3} dim={dim} /></g></g>\n    </g>\n  );\n};\n\nconst HumanLeg', 'arm draw');
h = sub(h, "look?: Look; grey?: number; outfit: Outfit; tie?: boolean; t: number; seed?: number; dim?: number; idle?: number; slump?: number; curlN?: number; curlF?: number; children?: React.ReactNode;\n};", "look?: Look; grey?: number; outfit: Outfit; tie?: boolean; t: number; seed?: number; dim?: number; idle?: number; slump?: number; curlN?: number; curlF?: number; heldN?: React.ReactNode; heldUp?: boolean; children?: React.ReactNode;\n};", 'side props');
h = sub(h, "slump = 0, curlN = 0.35, curlF = 0.35, children}) => {", "slump = 0, curlN = 0.35, curlF = 0.35, heldN, heldUp, children}) => {", 'side destructure');
h = sub(h, '<HumanArm S={SH} T={hN} o={o} curl={curlN} s={1} />', '<HumanArm S={SH} T={hN} o={o} curl={curlN} s={1} held={heldN} upright={heldUp} />', 'side near arm');
// front
h = sub(h, 'const FrontArm: React.FC<{S: V; T: V; o: Outfit; s: number; curl: number}> = ({S, T, o, s, curl}) => {', 'const FrontArm: React.FC<{S: V; T: V; o: Outfit; s: number; curl: number; held?: React.ReactNode; upright?: boolean}> = ({S, T, o, s, curl, held, upright}) => {', 'front arm sig');
h = sub(h, '      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)"><g transform={`scale(${s * 1.3} 1.3)`}><HumanHand curl={curl} /></g></g></g>', '      {held && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -6) ${upright ? `rotate(${-(fa - 90)})` : \'\'}`}>{held}</g></g>}\n      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)"><g transform={`scale(${s * 1.3} 1.3)`}><HumanHand curl={curl} /></g></g></g>', 'front arm draw');
h = sub(h, "idle?: number; curl?: number; children?: React.ReactNode;\n};", "idle?: number; curl?: number; heldR?: React.ReactNode; heldUp?: boolean; children?: React.ReactNode;\n};", 'front props');
h = sub(h, "dim = 0, idle = 1, curl = 0.35, children}) => {", "dim = 0, idle = 1, curl = 0.35, heldR, heldUp, children}) => {", 'front destructure');
h = sub(h, '<FrontArm S={SR} T={hr} o={o} s={1} curl={curl} />', '<FrontArm S={SR} T={hr} o={o} s={1} curl={curl} held={heldR} upright={heldUp} />', 'front right arm');
wr('src/fathers/Human.tsx', h);

// ---------------- People.tsx (adapter) ----------------
let p = rd('src/fathers/People.tsx');
p = sub(p, "import {HumanFront, HumanSide, Outfit} from './Human';", "import {HumanFront, HumanSide, Outfit} from './Human';\nimport {PhoneBack, CupHeld} from './held';", 'import');
p = sub(p, "export type PoseName = 'stand' |", "export type PoseName = 'cup' | 'stand' |", 'pose type');
p = sub(p, "  ear: () => ({N: [4, -434], F: [-20, 64]}),", "  ear: () => ({N: [-14, -392], F: [26, 66]}),", 'noop1');
p = sub(p, "  ear: () => ({N: [26, 66], F: [-6, -436]}),", "  ear: () => ({N: [-14, -392], F: [26, 66], pitch: 2}),\n  cup: (t) => ({N: [196 + Math.sin(t * 0.7) * 4, -168 + Math.sin(t * 0.9) * 3], F: [84, -92], pitch: 12}),", 'side ear');
p = sub(p, "  ear: () => ({L: [-100, -80], R: [150, -505]}),", "  ear: () => ({L: [-100, -80], R: [142, -408]}),\n  cup: () => ({L: [-70, -80], R: [100, -150]}),", 'front ear');
p = sub(p, "const FRONTY = new Set<PoseName>(['clap', 'film', 'desk', 'type']);", "const FRONTY = new Set<PoseName>(['clap', 'film', 'desk', 'type']);\n// what a pose puts in the hand (the near / right hand)\nconst HELD: Partial<Record<PoseName, 'phone' | 'cup'>> = {ear: 'phone', phone: 'phone', cup: 'cup'};", 'held table');
p = sub(p, "  const shift = SHIFT[view][pose] ?? [0, 0];\n  const kids = p.children ? <g transform={`translate(${shift[0]} ${shift[1]})`}>{p.children}</g> : null;", "  const shift = SHIFT[view][pose] ?? [0, 0];\n  const holds = HELD[pose], heldNode = holds === 'phone' ? <PhoneBack lit={pose === 'ear' ? 1 : 0.5} /> : holds === 'cup' ? <CupHeld t={t} /> : undefined;\n  const kids = p.children && pose !== 'ear' ? <g transform={`translate(${shift[0]} ${shift[1]})`}>{p.children}</g> : null;", 'kids');
p = sub(p, "slump={slump} legs={sitting ? 'sit' : 'none'}", "slump={slump} legs={sitting ? 'sit' : 'none'} heldR={heldNode} heldUp={holds === 'cup'}", 'front pass');
p = sub(p, "slump={slump} curlN={CURL[pose] ?? 0.35} curlF={0.3}>", "slump={slump} curlN={CURL[pose] ?? 0.35} curlF={0.3} heldN={heldNode} heldUp={holds === 'cup'}>", 'side pass');
p = sub(p, "const CURL: Partial<Record<PoseName, number>> = {stand: 0.3,", "const CURL: Partial<Record<PoseName, number>> = {cup: 0.75, stand: 0.3,", 'curl');
p = sub(p, "ear: 0.55, cradle: 0.5,", "ear: 0.8, cradle: 0.5,", 'curl ear');
p = sub(p, "phone: 0.55,", "phone: 0.8,", 'curl phone');
wr('src/fathers/People.tsx', p);

// ---------------- shots: remove the old Handset children, give the bench cups to the people ----------------
let sh = rd('src/fathers/shots.tsx');
sh = sh.replace(/, children: <Handset[^>]*\/>/g, '');
sh = sh.replace(/ children=\{<Handset[^>]*\/>\}/g, '');
sh = sub(sh, "const benchPair = (c: Ctx, ages: [number, number], face = F.smile) => (\n  <>{Pe(c, sit('sam', ages[0], 1620, 0.62, {turn: 0.25, face, view: 'front', pose: 'fold'}))}{Pe(c, sit('max', ages[1], 1900, 0.62, {turn: -0.25, face: F.smile, view: 'front', pose: 'fold'}))}</>\n);", "const benchPair = (c: Ctx, ages: [number, number], face = F.smile) => (\n  <>{Pe(c, sit('sam', ages[0], 1620, 0.62, {turn: 0.25, face, view: 'front', pose: 'cup'}))}{Pe(c, sit('max', ages[1], 1900, 0.62, {turn: -0.25, face: F.smile, view: 'front', pose: 'cup'}))}</>\n);", 'bench pair');
sh = sh.split("view: 'front', pose: 'fold'}))}{Pe(c, sit('sam', 65, 1660").join("view: 'front', pose: 'cup'}))}{Pe(c, sit('sam', 65, 1660");
sh = sh.replace(/(sit\('(?:adam|sam|leo|max)', (?:65|30), (?:1440|1660|1880|2100), 0\.6, \{[^}]*?view: 'front', pose: )'fold'/g, "$1'cup'");
wr('src/fathers/shots.tsx', sh);
console.log('patched 14', sh.includes('Handset'));
