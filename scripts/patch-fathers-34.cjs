const fs=require('fs');
// ---- laptop: a real hinge. phi = lid angle from the keys (0 shut .. 100 open); the top edge swings toward the viewer and the screen turns into the lid's back
let a=fs.readFileSync('src/fathers/inserts.tsx','utf8');
const i=a.indexOf("export const LaptopHand");const j=a.indexOf("// ----",i);
let blk=a.slice(i,j);
blk=blk.replace("const warm = who === 'sam', k = who === 'sam' ? 1 - ramp(t, closeAt, closeAt + 0.22) : 1, lid = 220 * k;",
"const warm = who === 'sam', k = who === 'sam' ? 1 - Math.pow(ramp(t, closeAt, closeAt + 0.5), 2.2) : 1, lid = 220 * k;\n  const phi = (100 * k * Math.PI) / 180, topY = -330 * Math.sin(phi) + 62 * Math.cos(phi), topW = 340 + 90 * Math.max(0, Math.cos(phi) + 0.17), showScreen = phi > 1.15, handsUp = ramp(t, closeAt - 0.1, closeAt + 0.25);");
blk=blk.replace(/<path d=\{`M -380,0 L 380,0 L \$\{340\},\$\{-lid \* 1\.5\} L -340,\$\{-lid \* 1\.5\} Z`\} fill="#2a2a32" stroke=\{INK\} strokeWidth=\{7\} strokeLinejoin="round" \/>/,
"<path d={`M -380,0 L 380,0 L ${topW},${topY} L ${-topW},${topY} Z`} fill={showScreen ? '#2a2a32' : '#9aa0aa'} stroke={INK} strokeWidth={7} strokeLinejoin=\"round\" />");
blk=blk.replace("{lid > 40 && <path d={`M -318,-14 L 318,-14 L ${298},${-lid * 1.5 + 22} L -298,${-lid * 1.5 + 22} Z`}","{showScreen && lid > 40 && <path d={`M -318,-14 L 318,-14 L ${298},${topY + 22} L -298,${topY + 22} Z`}");
blk=blk.replace("{lid > 90 && <g opacity={0.9}>","{showScreen && lid > 90 && <g opacity={0.9}>");
blk=blk.replace("<g transform={`translate(0 ${type})`}>{[-1, 1]","{!showScreen && k < 0.55 && <ellipse cx={0} cy={topY * 0.5 + 20} rx={300} ry={26} fill=\"#000\" opacity={0.18} />}\n        <g transform={`translate(0 ${type * (1 - handsUp) - handsUp * 160})`} opacity={1 - handsUp * 0.85}>{[-1, 1]");
a=a.slice(0,i)+blk+a.slice(j);
fs.writeFileSync('src/fathers/inserts.tsx',a);
// ---- rain overlays stop at the next scene change
let f=fs.readFileSync('src/fathers/Fathers.tsx','utf8');
const m=f.match(/<Rain t=\{t\} from=\{T\('the way his son actually needed'\)\} to=\{T\('the way his son actually needed'\) \+ 3\.2\}/);
if(!m)console.log('MISSING rain');
f=f.replace("to={T('the way his son actually needed') + 3.2}","to={T('by the end of this video') - 0.15}");
f=f.replace("to={T('the way he thought love was supposed to look') + 3}","to={T('the other kept it') - 0.1}");
fs.writeFileSync('src/fathers/Fathers.tsx',f);
