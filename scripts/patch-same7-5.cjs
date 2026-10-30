const fs = require('fs');
// Same2D: export the kitchen and bathroom shots too
let a = fs.readFileSync('src/same2d/Same2D.tsx', 'utf8');
a = a.replace(/^const kit = /m, 'export const kit = ').replace(/^const bath = /m, 'export const bath = ');
fs.writeFileSync('src/same2d/Same2D.tsx', a);
// part2: export the cast and publish the scene makers (kitchen, office, restaurant, manager room, montage) that the new cut reuses
let p = fs.readFileSync('src/same2d/part2.tsx', 'utf8');
p = p.replace('const Person: React.FC<PersonP> = (p) => {', 'export const Person: React.FC<PersonP> = (p) => {');
p = p.replace('export const buildPart2 = (api: Api): Item[] => {', "// scene makers shared with the new cut (src/same7); filled the first time buildPart2 runs\nexport let SC2: any = null;\nexport const buildPart2 = (api: Api): Item[] => {");
const m = '  const L: Item[] = [];\n';
const m2 = '  const L: Item[] = [];\r\n';
const at = p.indexOf(m) >= 0 ? p.indexOf(m) : p.indexOf(m2);
if (at < 0) throw new Error('L marker');
p = p.slice(0, at) + '  SC2 = {kitE, kitWide, meet, offW, dine, resW, mgr, mgW, OF, pip, montage};\n' + p.slice(at);
fs.writeFileSync('src/same2d/part2.tsx', p);
// book.tsx: the table scene can move the hand and buzz the phone
let b = fs.readFileSync('src/same7/book.tsx', 'utf8');
const r = (x, y) => { if (!b.includes(x)) throw new Error('MISSING ' + x.slice(0, 50)); b = b.split(x).join(y); };
r("export const TableScene: React.FC<{t: number; hover: number; tag?: string}> = ({t, hover, tag}) => {", "export const TableScene: React.FC<{t: number; hover: number; tag?: string; handX?: number; handY?: number; buzz?: number}> = ({t, hover, tag, handX, handY, buzz = 0}) => {");
r("hx = 960 + Math.sin(t * 1.3) * 90 * hover, hy = 250 + (1 - hover) * -260 + bob, pulse", "hx = handX ?? 960 + Math.sin(t * 1.3) * 90 * hover, hy = handY ?? 250 + (1 - hover) * -260 + bob, pulse");
r('<g transform="translate(520 700) rotate(-8)"><ellipse cx={20}', '<g transform={`translate(${520 + Math.sin(t * 90) * 7 * buzz} 700) rotate(-8)`}><ellipse cx={20}');
fs.writeFileSync('src/same7/book.tsx', b);
