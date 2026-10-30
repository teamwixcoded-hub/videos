const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const a="const hang = T[1] > S[1] + 200;\n  const {J: E, H} = ik2(S, T, 185, 170, hang ? (c) => (c[0][0] > c[1][0] ? c[0] : c[1]) : (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));";
if(!h.includes(a))console.log('MISSING');
h=h.replace(a,`// a relaxed hanging arm is almost straight with the elbow a touch BEHIND the line, so the forearm points slightly forward; every other arm keeps its elbow low
  const hang = T[1] > S[1] + 300;
  let Tg = T;
  if (hang) { const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy) || 1, want = 0.965 * 355; Tg = [S[0] + (dx / d) * want, S[1] + (dy / d) * want]; }
  const {J: E, H} = ik2(S, Tg, 185, 170, hang ? (c) => (c[0][0] < c[1][0] ? c[0] : c[1]) : (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));`);
fs.writeFileSync('src/fathers/Human.tsx',h);
