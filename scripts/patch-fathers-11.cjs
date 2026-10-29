// Two Fathers v2: watch on Adam's wrist, outfit variants (father at work, Adam as a boy), new photo kinds, banking balance, milk glass
const fs = require('fs');
const rd = (f) => fs.readFileSync(f, 'utf8'), wr = (f, s) => fs.writeFileSync(f, s);
const sub = (s, a, b, tag) => { if (!s.includes(a)) { console.log('MISSING', tag || String(a).slice(0, 80)); return s; } return s.replace(a, b); };

let h = rd('src/fathers/Human.tsx');
h = sub(h, "sleeve: 'long' | 'short'; sole?: string};", "sleeve: 'long' | 'short'; sole?: string; watch?: boolean};", 'outfit type');
h = sub(h, "      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -${6})`}><HumanHand curl={curl} s={s * 1.3} dim={dim} /></g></g>\n    </g>\n  );\n};\n\nconst HumanLeg",
  "      {o.watch && (() => { const w = mix(E, H, 0.8); return <g transform={`translate(${w[0]} ${w[1]}) rotate(${fa})`}><rect x={-9} y={-20} width={18} height={40} rx={5} fill=\"#5a3a24\" stroke={INK} strokeWidth={2.6} /><circle cx={0} cy={0} r={15} fill=\"#f2c14e\" stroke={INK} strokeWidth={3} /><circle cx={0} cy={0} r={10.5} fill=\"#fbf1d2\" stroke={INK} strokeWidth={1.6} /><path d=\"M 0,-8 L 0,0 L 6,3\" fill=\"none\" stroke={INK} strokeWidth={2} strokeLinecap=\"round\" /></g>; })()}\n      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -${6})`}><HumanHand curl={curl} s={s * 1.3} dim={dim} /></g></g>\n    </g>\n  );\n};\n\nconst HumanLeg", 'watch');
wr('src/fathers/Human.tsx', h);

let p = rd('src/fathers/People.tsx');
p = sub(p, "  adam: {style: 'suit', top: '#34498f', shirt: '#f3efe6', pants: '#232d52', shoe: '#1b1b22', sleeve: 'long', sole: '#2a2a33'},", "  adam: {style: 'suit', top: '#34498f', shirt: '#f3efe6', pants: '#232d52', shoe: '#1b1b22', sleeve: 'long', sole: '#2a2a33', watch: true},", 'adam watch');
p = sub(p, "// how far the fingers curl", "const VARIANTS: Record<string, Outfit> = {\n  work: {style: 'tee', top: '#6f7d93', shirt: '#c9ced8', pants: '#3f4a5a', shoe: '#2a2a33', sleeve: 'long', sole: '#1d1d24'},\n  kid: {style: 'tee', top: '#e0a63c', shirt: '#fff', pants: '#34456e', shoe: '#f2f0f8', sleeve: 'short'},\n  pjs: {style: 'tee', top: '#7a8fd0', shirt: '#fff', pants: '#5a6ab0', shoe: '#f2f0f8', sleeve: 'long'},\n};\n// how far the fingers curl", 'variants');
p = sub(p, "const outfit: Outfit = {...OUTFITS[who], top: p.top ?? OUTFITS[who].top}", "const outfit: Outfit = {...(VARIANTS[p.outfit ?? ''] ?? OUTFITS[who]), top: p.top ?? (VARIANTS[p.outfit ?? '']?.top ?? OUTFITS[who].top)}", 'outfit');
p = p.split("tie={who === 'adam'}").join("tie={who === 'adam' && !p.outfit}");
wr('src/fathers/People.tsx', p);

let pr = rd('src/fathers/props.tsx');
pr = sub(pr, "export type PhotoKind = 'four' |", "export type PhotoKind = 'father' | 'boy' | 'four' |", 'photokind');
pr = sub(pr, "      {kind === 'grad' &&", "      {kind === 'father' && <g><rect y={104} width={200} height={46} fill=\"#5b6070\" />{person(70, 126, 1.05, '#6f7d93')}{person(124, 128, 0.72, '#e0a63c')}</g>}\n      {kind === 'boy' && <g>{person(100, 128, 0.9, '#e0a63c')}</g>}\n      {kind === 'grad' &&", 'photo art');
wr('src/fathers/props.tsx', pr);

let ins = rd('src/fathers/inserts.tsx');
ins = sub(ins, "export const Banking: React.FC<{t: number; to?: string; digits?: string; typeFrom?: number; delFrom?: number; press?: number; send?: boolean}> = ({t, to = 'Leo', digits = '2500', typeFrom = 0.4, delFrom = 3.4, press = 7.2, send = false}) => {", "export const Banking: React.FC<{t: number; to?: string; digits?: string; typeFrom?: number; delFrom?: number; press?: number; send?: boolean; balance?: string}> = ({t, to = 'Leo', digits = '2500', typeFrom = 0.4, delFrom = 3.4, press = 7.2, send = false, balance = '$48,310'}) => {", 'banking sig');
ins = sub(ins, 'sub="Savings  ·  $48,310"', 'sub={`Savings  ·  ${balance}`}', 'banking sub');
wr('src/fathers/inserts.tsx', ins);

let st = rd('src/fathers/sets.tsx');
st = sub(st, "export const teaStall = (o: {t: number; season?: number; sunset?: number; cups?: number; snow?: boolean}): SetOut => {", "export const teaStall = (o: {t: number; season?: number; sunset?: number; cups?: number; snow?: boolean; milk?: boolean}): SetOut => {", 'tea sig');
st = sub(st, "        {Array.from({length: o.cups ?? 2}, (_, i) => <Cup", "        {o.milk && <g transform=\"translate(1760 640)\"><path d=\"M -16,-62 L 16,-62 L 13,0 L -13,0 Z\" fill=\"#f4f6ff\" stroke={INK} strokeWidth={2.4} opacity={0.95} /><path d=\"M -14,-44 L 14,-44 L 13,0 L -13,0 Z\" fill=\"#fff\" /><ellipse cx={0} cy={-62} rx={16} ry={4} fill=\"#e6e8f6\" stroke={INK} strokeWidth={2} /></g>}\n        {Array.from({length: o.cups ?? 2}, (_, i) => <Cup", 'milk');
wr('src/fathers/sets.tsx', st);

let tl = rd('src/fathers/timeline.ts');
tl = tl.replace("const norm = (p: string) => p.toLowerCase().replace(/[^a-z0-9' ]/g, ' ').split(/\\s+/).filter(Boolean);", "const norm = (p: string) => p.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9' ]/g, ' ').split(/\\s+/).filter(Boolean);");
tl = tl.replace("w: x.text.toLowerCase().replace(/[^a-z0-9']/g, '')", "w: x.text.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9']/g, '')");
wr('src/fathers/timeline.ts', tl);
console.log('patched 11');
