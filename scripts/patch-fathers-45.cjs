const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const a="const {J: E, H} = ik2(S, T, 176, 164, (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));";
if(!h.includes(a))console.log('MISSING');
// front view: the elbow always bends OUTWARD (away from the body's centre line), so forearms never cross in front of the chest
h=h.replace(a,"const {J: E, H} = ik2(S, T, 176, 164, (c) => ((c[0][0] - c[1][0]) * (S[0] < 0 ? -1 : 1) > 0 ? c[0] : c[1]));");
fs.writeFileSync('src/fathers/Human.tsx',h);
