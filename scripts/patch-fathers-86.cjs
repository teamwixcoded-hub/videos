const fs=require('fs');let p=fs.readFileSync('src/fathers/People.tsx','utf8');
const a="lively(t, sd, sitting ? 'hold' : pose, e * idle);";
const b="const L: V = [L0[0] + lvF[0], L0[1] + lvF[1]], R: V = [R0[0] + lvN[0], R0[1] + lvN[1]];";
if(!p.includes(a)||!p.includes(b))throw new Error('x');
// front view: a talking gesture lifts each hand OUTWARD from its own shoulder (never across the belly) and a bit less than from the side
p=p.replace(a,"lively(t, sd, sitting ? 'hold' : pose, e * idle * 0.6);").replace(b,"const L: V = [L0[0] - lvF[0], L0[1] + lvF[1]], R: V = [R0[0] + lvN[0], R0[1] + lvN[1]];");
fs.writeFileSync('src/fathers/People.tsx',p);
