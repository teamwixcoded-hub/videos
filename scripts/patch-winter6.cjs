const fs = require('fs');
let s = fs.readFileSync('src/winter/Hero.tsx', 'utf8');
const rep = (x, y) => { if (!s.includes(x)) throw new Error('missing: ' + String(x).slice(0, 70)); s = s.replace(x, y); };
rep("import React from 'react';", "import React from 'react';\nimport {BubbleHead} from './Bubble';");
rep("export const INK = '#16121c';", "export const INK = '#1b1a3a';");
rep('id?: string; turn?: number};', "id?: string; turn?: number; kind?: 'bubble' | 'adult'};");
rep("const SK = '#fbe3a6', SK_D = '#e8c77d';", "const SK = '#e8eafb', SK_D = '#b9bfe0';   // default skin = the glossy pale bubble white; the adult head passes its own warm skin");
rep("export const Head: React.FC<HeadProps> = ({mood = 'neutral', skin = SK,", "const AdultHead: React.FC<HeadProps> = ({mood = 'neutral', skin = '#fbe3a6',");
// dispatcher, placed before the BODY section
const marker = '// ---------------------------------------------------------------------------------------------\n// BODY v2';
if (!s.includes(marker)) throw new Error('no body marker');
s = s.replace(marker, `export const chinOf = (kind?: 'bubble' | 'adult') => (kind === 'adult' ? 236 : 200);
export const defaultHeadScale = (kind?: 'bubble' | 'adult') => (kind === 'adult' ? 0.46 : 0.6);
export const Head: React.FC<HeadProps> = ({kind = 'bubble', ...p}) => (kind === 'adult' ? <AdultHead {...p} /> : <BubbleHead {...p} />);

` + marker);
rep('headScale = 0.46, slump = 0, mood, skin, hair, look, blink, id, turn, ...b}) =>', 'headScale, slump = 0, mood, skin, hair, look, blink, id, turn, kind, ...b}) =>');
rep('${NECK_Y - 18 - 236 * headScale + slump * 22}) scale(${headScale})', '${NECK_Y - 14 - chinOf(kind) * (headScale ?? defaultHeadScale(kind)) + slump * 22}) scale(${headScale ?? defaultHeadScale(kind)})');
rep('look={look} blink={blink} id={id} turn={turn} /></g>', 'look={look} blink={blink} id={id} turn={turn} kind={kind} /></g>');
fs.writeFileSync('src/winter/Hero.tsx', s);

let t = fs.readFileSync('src/winter/SideHero.tsx', 'utf8');
const r2 = (x, y) => { if (!t.includes(x)) throw new Error('missing2: ' + String(x).slice(0, 70)); t = t.replace(x, y); };
r2("import {Head, HeadProps, Hand, Seg, ik, shade, INK, V, HandKind} from './Hero';", "import {Head, HeadProps, Hand, Seg, ik, shade, INK, V, HandKind, chinOf, defaultHeadScale} from './Hero';");
r2("skin = '#fbe3a6', shorts,", "skin = '#e8eafb', shorts,");
r2('headScale = 0.46, mood', 'headScale: hs, kind, mood');
r2('const headC = at(318 + 236 * headScale, 10);', 'const headScale = hs ?? defaultHeadScale(kind), headC = at(314 + chinOf(kind) * headScale, 10);');
r2('id={id} turn={turn ?? P.turn ?? 0.9} />', 'id={id} turn={turn ?? P.turn ?? 0.9} kind={kind} />');
fs.writeFileSync('src/winter/SideHero.tsx', t);

// sheets: bubble heads, sad without the blue-skin override, a purple hoodie like the reference
let h = fs.readFileSync('src/winter/Sheet.tsx', 'utf8');
h = h.replace("skin={m === 'sad' ? '#9db8f0' : undefined} hair={m === 'sad' ? '#2d3d6e' : undefined} ", '').replace('scale(0.62)', 'scale(0.7)');
h = h.replace('topColor="#59607a" slump={0.7}', 'topColor="#6b4fc4" slump={0.7}');
fs.writeFileSync('src/winter/Sheet.tsx', h);
let q = fs.readFileSync('src/winter/SideSheet.tsx', 'utf8');
q = q.split('topColor="#59607a"').join('topColor="#6b4fc4"');
fs.writeFileSync('src/winter/SideSheet.tsx', q);
