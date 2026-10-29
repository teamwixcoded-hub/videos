const fs=require('fs');
let s=fs.readFileSync('src/fathers/shots.tsx','utf8');
const r=(a,b)=>{if(!s.includes(a)){console.log('MISSING',a.slice(0,60));return;}s=s.replace(a,b)};
r("[0.0, undefined, (c) => SC.str(c, [Z(1600, 560, 0.95), Z(1600, 540, 1.14)], {})],",
"[0.0, undefined, (c) => SC.str(c, [Z(1050, 560, 1.15), Z(1000, 520, 1.5)], {}, Pe(c, stand('adam', 65, 1000 + c.l * 40, 0.95, {turn: 0.4, pose: 'stand', face: F.sad})))],");
r("[T('and a son who loves him'), undefined, (c) => SC.liv(c, [Z(1900, 470, 1.5), Z(1980, 450, 1.8)], {}, adamAt(c, 65, {face: {...F.soft, gaze: [0.8, 0.2]}}), 0.4)],",
"[T('and a son who loves him'), undefined, (c) => SC.flat(c, [Z(1600, 520, 1.3), Z(1600, 500, 1.7)], Pe(c, stand('leo', 25, 1600, 0.9, {view: 'front', pose: 'stand', face: F.grin})))],");
fs.writeFileSync('src/fathers/shots.tsx',s);
let k=fs.readFileSync('src/fathers/kit.tsx','utf8');
const a="const camOf = (c: Ctx, a: CamArg) => { const k = Array.isArray(a) ? mixCam(a[0], a[1], c.p) : a; return {cx: k.cx + Math.sin(c.t * 0.9) * 5, cy: k.cy + Math.sin(c.t * 1.3 + 1) * 4, z: k.z}; };";
if(!k.includes(a))console.log('MISSING cam');
k=k.replace(a,"const camOf = (c: Ctx, a: CamArg) => { const k = Array.isArray(a) ? mixCam(a[0], a[1], c.p) : a; const push = Array.isArray(a) ? 1 : 1 + 0.07 * ease(Math.min(1, c.p)); return {cx: k.cx + Math.sin(c.t * 0.9) * 9 + (Array.isArray(a) ? 0 : (c.p - 0.5) * 40), cy: k.cy + Math.sin(c.t * 1.3 + 1) * 6, z: k.z * push}; };");
fs.writeFileSync('src/fathers/kit.tsx',k);
