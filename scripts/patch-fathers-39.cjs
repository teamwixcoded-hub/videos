const fs=require('fs');let a=fs.readFileSync('src/fathers/inserts.tsx','utf8');
const s="const S: [number, number] = [2200, 330];\n  const {J: E, H: W} = ik2(S, T, 700, 640, (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));";
if(!a.includes(s))console.log('MISSING');
a=a.replace(s,"const S: [number, number] = [2100, 470], dist = Math.max(640, Math.hypot(T[0] - S[0], T[1] - S[1])), seg = dist * 0.52;\n  const {J: E, H: W} = ik2(S, T, seg, seg, (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));");
fs.writeFileSync('src/fathers/inserts.tsx',a);
