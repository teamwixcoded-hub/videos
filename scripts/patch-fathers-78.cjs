const fs=require('fs');
let p=fs.readFileSync('src/fathers/People.tsx','utf8');
p=p.replace("const [lvN, lvF, lvT] = lively(t, sd, pose, e * idle);","const [lvN, lvF, lvT] = lively(t, sd, sitting ? 'hold' : pose, e * idle);");
fs.writeFileSync('src/fathers/People.tsx',p);
let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const old="(c) => ((c[0][0] - c[1][0]) * (S[0] < 0 ? -1 : 1) > 0 ? c[0] : c[1]));";
if(!h.includes(old))throw new Error('rule');
// elbow: hanging arms bend outward; every raised arm keeps the elbow low and a little outward, never akimbo
h=h.replace("const {J: E, H} = ik2(S, Tg, 176, 164, "+old,"const hangF = T[1] > S[1] + 250, sg = S[0] < 0 ? -1 : 1, {J: E, H} = ik2(S, Tg, 176, 164, hangF ? "+old.slice(0,-2)+" : (c) => ((c[0][1] - (c[0][0] - S[0]) * sg * 0.25) > (c[1][1] - (c[1][0] - S[0]) * sg * 0.25) ? c[0] : c[1]));");
fs.writeFileSync('src/fathers/Human.tsx',h);
