const fs=require('fs');
let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const o="want = 0.975 * 340; Tg";
if(!h.includes(o))throw new Error('want');
h=h.replace(o,"want = d > 331 ? Math.min(d, 356) : 331; Tg");
fs.writeFileSync('src/fathers/Human.tsx',h);
let p=fs.readFileSync('src/fathers/People.tsx','utf8');
const a="const q = FRONT[pose](t, raise);";
if(!p.includes(a))throw new Error('q');
// seated and relaxed: both hands rest on the thighs, not hanging at the hips
p=p.replace(a,"const q = sitting && (pose === 'stand' || pose === 'rest') ? {L: [-96, 34] as V, R: [96, 34] as V} : FRONT[pose](t, raise);");
fs.writeFileSync('src/fathers/People.tsx',p);
