const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const a="const {J: E, H} = ik2(S, T, 185, 170, (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));";
if(!h.includes(a))console.log('MISSING');
// a hanging arm bends its elbow slightly forward (+x) like a real relaxed arm; a raised arm keeps the elbow down
h=h.replace(a,"const hang = T[1] > S[1] + 200;\n  const {J: E, H} = ik2(S, T, 185, 170, hang ? (c) => (c[0][0] > c[1][0] ? c[0] : c[1]) : (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));");
fs.writeFileSync('src/fathers/Human.tsx',h);
