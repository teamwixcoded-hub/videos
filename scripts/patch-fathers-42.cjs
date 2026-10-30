const fs=require('fs');
let s=fs.readFileSync('src/fathers/sets.tsx','utf8');
const r=(a,b,t)=>{if(!s.includes(a)){console.log('MISSING',t||a.slice(0,50));return;}s=s.replace(a,b)};
r("const ROW_Y = [600, 740, 880]","const ROW_Y = [760, 890, 1020]");
// stage apron: wooden front, footlights and a dark pit so the stage clearly sits above and behind the audience
r("        <rect x={700} y={430} width={1800} height={110} fill=\"#5c432b\" stroke={INK} strokeWidth={3} />","        <rect x={700} y={430} width={1800} height={110} fill=\"#5c432b\" stroke={INK} strokeWidth={3} />\n        <rect x={700} y={540} width={1800} height={86} fill=\"#3a2a1c\" stroke={INK} strokeWidth={3.4} />{Array.from({length: 18}, (_, i) => <g key={i}><rect x={700 + i * 100 + 4} y={552} width={92} height={60} rx={4} fill=\"#4a3523\" stroke={INK} strokeWidth={2} /><circle cx={750 + i * 100} cy={548} r={7} fill=\"#ffd27a\" /><circle cx={750 + i * 100} cy={548} r={22} fill=\"#ffd27a\" opacity={0.22} /></g>)}\n        <rect x={600} y={626} width={2000} height={400} fill=\"#090a12\" />",'apron');
fs.writeFileSync('src/fathers/sets.tsx',s);
let h=fs.readFileSync('src/fathers/shots.tsx','utf8');
h=h.split("Z(2160, 720, 1.5), Z(2160, 700, 1.8)").join("Z(2160, 870, 1.5), Z(2160, 850, 1.8)").split("Z(2160, 720, 1.7), Z(2160, 700, 2.0)").join("Z(2160, 870, 1.7), Z(2160, 850, 2.0)");
h=h.split(", 1018)").join(", 1158)");
fs.writeFileSync('src/fathers/shots.tsx',h);
console.log((h.match(/1158/g)||[]).length);
// lively gestures scale with idle (photos/background figures stay still)
let p=fs.readFileSync('src/fathers/People.tsx','utf8');
p=p.split("lively(t, sd, pose, e)").join("lively(t, sd, pose, e * idle)");
fs.writeFileSync('src/fathers/People.tsx',p);
