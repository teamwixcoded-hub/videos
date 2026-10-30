const fs=require('fs');let d=fs.readFileSync('src/fathers/details.tsx','utf8');
const r=(a,b,t)=>{if(!d.includes(a)){console.log('MISSING',t);return;}d=d.replace(a,b)};
// replace the two blade-like hedge rows with round bushes sized by depth
let i1=d.indexOf("        {[0.05, 0.2, 0.34, 0.5, 0.88].map((u, i) => { const p = lp('adam'");
let i2=d.indexOf("        {[[0.12, '#ff7a9a']");
if(i1<0||i2<0)console.log('MISSING hedges');
else d=d.slice(0,i1)+"        {(['adam', 'sam'] as const).map((sd) => [0.04, 0.16, 0.3, 0.46, 0.84].map((u, i) => { const p = lp(sd, u, 1.03), k = lerp(1.0, 0.45, u); return <g key={sd + i} transform={`translate(${p[0]} ${p[1] + 4}) scale(${k})`}><ellipse cx={0} cy={4} rx={86} ry={12} fill=\"rgba(5,6,15,.25)\" /><circle cx={-46} cy={-30} r={40} fill={sd === 'adam' ? '#2f6a46' : '#3a7a4c'} stroke={INK} strokeWidth={4} /><circle cx={4} cy={-46} r={50} fill={sd === 'adam' ? '#2f6a46' : '#3a7a4c'} stroke={INK} strokeWidth={4} /><circle cx={54} cy={-28} r={38} fill={sd === 'adam' ? '#2f6a46' : '#3a7a4c'} stroke={INK} strokeWidth={4} /><circle cx={-10} cy={-60} r={22} fill={sd === 'adam' ? '#4a8a5e' : '#5a9a6a'} opacity={0.8} /></g>; }))}\n"+d.slice(i2);
d=d.split("s={lerp(0.62, 0.3, 1 - u + 0.1) * (u < 0.2 ? 1.5 : 1)}").join("s={lerp(1.1, 0.5, 1 - u + 0.1) * (u < 0.2 ? 1.5 : 1)}");
d=d.split("s={lerp(0.62, 0.3, 1 - u + 0.1)} on={lit} dir={-1}").join("s={lerp(1.1, 0.5, 1 - u + 0.1)} on={lit} dir={-1}");
fs.writeFileSync('src/fathers/details.tsx',d);
