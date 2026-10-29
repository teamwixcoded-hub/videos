// Two Fathers on the Same Man rig: positioning helpers, shot edits that used old hand coordinates, chair heights, camera drift
const fs = require('fs');
const P = (f) => 'src/fathers/' + f;
const edit = (file, pairs) => {
  let s = fs.readFileSync(P(file), 'utf8');
  for (const [a, b, all] of pairs) {
    if (!s.includes(a)) { console.log('MISSING in', file, ':', String(a).slice(0, 90)); continue; }
    s = all ? s.split(a).join(b) : s.replace(a, b);
  }
  fs.writeFileSync(P(file), s);
};
edit('People.tsx', [
  ["const k = bodyK(who, age), sc = scale * k;", "const k = bodyK(who, age), sc = scale * k * CHAR_K;"],
  ["export type PoseName =", "// the rigs are ~1060 tall at scale 1; the shot list was written for ~900, so every person is scaled by this\nexport const CHAR_K = 0.85;\nexport type PoseName ="],
]);
edit('kit.tsx', [
  ["import {Person, PersonProps, Who, bodyK, FaceP} from './People';", "import {Person, PersonProps, Who, bodyK, FaceP, CHAR_K} from './People';"],
  [`export const stand = (who: Who, age: number, x: number, sc = 0.7, o: Partial<PersonProps> = {}): Pos => ({who, age, x, y: FLOOR - 350 * sc * bodyK(who, age), scale: sc, ...o});
export const sit = (who: Who, age: number, x: number, sc = 0.7, o: Partial<PersonProps> = {}, floor = FLOOR): Pos => ({who, age, x, y: floor - 284 * sc * bodyK(who, age), scale: sc, legs: 'sit', sitDrop: 250, ...o});`,
   `const FRONTP = ['clap', 'film', 'desk', 'type'];
export const stand = (who: Who, age: number, x: number, sc = 0.7, o: Partial<PersonProps> = {}): Pos => ({who, age, x, y: FLOOR - 425 * sc * bodyK(who, age) * CHAR_K, scale: sc, ...o});
// side-view sitters have their hips 218 above the floor, front-view sitters (desk, clapping, filming) 300
export const sit = (who: Who, age: number, x: number, sc = 0.7, o: Partial<PersonProps> = {}, floor = FLOOR): Pos => {
  const front = o.view === 'front' || (!!o.pose && FRONTP.includes(o.pose));
  return {who, age, x, y: floor - (front ? 300 : 218) * sc * bodyK(who, age) * CHAR_K, scale: sc, legs: 'sit', ...o};
};`],
  [`export const faceCam = (p: Pos, z = 2.4, dy = 0): Cam => Z(p.x, p.y - 390 * p.scale * bodyK(p.who, p.age) + dy, z);
export const bodyCam = (p: Pos, z = 1.5): Cam => Z(p.x, p.y - 230 * p.scale * bodyK(p.who, p.age), z);`,
   `const headH = (p: Pos) => ((p.view === 'front' || (!!p.pose && FRONTP.includes(p.pose))) ? 500 : 440);
export const faceCam = (p: Pos, z = 2.4, dy = 0): Cam => Z(p.x, p.y - headH(p) * p.scale * bodyK(p.who, p.age) * CHAR_K + dy, z);
export const bodyCam = (p: Pos, z = 1.5): Cam => Z(p.x, p.y - 250 * p.scale * bodyK(p.who, p.age) * CHAR_K, z);`],
  ["const camOf = (c: Ctx, a: CamArg) => (Array.isArray(a) ? mixCam(a[0], a[1], c.p) : a);", "const camOf = (c: Ctx, a: CamArg) => { const k = Array.isArray(a) ? mixCam(a[0], a[1], c.p) : a; return {cx: k.cx + Math.sin(c.t * 0.9) * 5, cy: k.cy + Math.sin(c.t * 1.3 + 1) * 4, z: k.z}; };"],
]);
// desks sit lower, benches use the front rig
for (const f of ['shots1.tsx', 'shots2.tsx']) edit(f, [['FL + 20', 'FL + 76', true]]);
edit('shots1.tsx', [
  ["pose: 'point', face: F.grin, handR: [150, -330]}))}{Pe(c, stand('max', 5 + n * 0.05, sx + 220, 0.62, {turn: 0.7, face: F.grin, handR: [150, -280], handL: [-60, -10]}))}", "pose: 'point', face: F.grin}))}{Pe(c, stand('max', 5 + n * 0.05, sx + 220, 0.62, {turn: 0.7, face: F.grin, pose: 'wave'}))}"],
  ["{pose: 'desk', turn: 0.5, face: F.calm, handL: [120, 50], handR: [230, 56]}", "{pose: 'desk', turn: 0.5, face: F.calm}"],
  ["handR: [140 + (c.l > 6 ? -ramp(c.l, 6, 6.4) * 30 : 0), -240 + (c.l > 6 ? ramp(c.l, 6, 6.4) * 330 : 0)], handL: [-122, 110]}", "pose: 'raise', raise: c.l > 6 ? 1 - ramp(c.l, 6, 6.4) : 1}"],
  ["{face: F.sad, pose: 'rest', handR: [90, 40], handL: [-70, 40]}", "{face: F.sad, pose: 'rest'}"],
  ["Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.8, face: {...F.sad, gaze: [0.8, 0]}, pose: 'raise'", "Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.8, face: {...F.sad, gaze: [0.8, 0]}, pose: 'raise'"],
]);
edit('shots2.tsx', [
  ["    {Pe(c, stand(sam ? 'sam' : 'adam', ages[0], x0 + c.l * sp, sc, {turn: 0.85, walk: c.l * 0.7, face: F.smile, handL: [-96 + Math.sin(c.l * 4.4) * 34, 70], handR: [96 - Math.sin(c.l * 4.4) * 34, 70]}))}", "    {Pe(c, stand(sam ? 'sam' : 'adam', ages[0], x0 + c.l * sp, sc, {turn: 0.85, walk: c.l * 0.7, face: F.smile}))}"],
  ["{Pe(c, stand('max', ages[1], x0 + 260 + c.l * sp, sc, {turn: 0.85, walk: c.l * 0.7 + 0.25, face: F.grin, handL: [-96 + Math.sin(c.l * 4.4) * 34, 70], handR: [96 - Math.sin(c.l * 4.4) * 34, 70]}))}</>", "{Pe(c, stand('max', ages[1], x0 + 260 + c.l * sp, sc, {turn: 0.85, walk: c.l * 0.7 + 0.25, face: F.grin}))}</>"],
  ["{turn: 0.5, face: F.angry, handR: [150, -220]}", "{turn: 0.5, face: F.angry, pose: 'point'}"],
  ["handR: [40, -330]}))}{Pe(c, stand('sam', ageS, 1900", "pose: 'wave'}))}{Pe(c, stand('sam', ageS, 1900"],
  ["face: F.smile, handR: [70, -330], handL: [-70, -330]}))}", "face: F.smile, pose: 'wave'}))}"],
  ["const benchPair = (c: Ctx, ages: [number, number], face = F.smile, flip = false) => (\n  <>{Pe(c, sit('sam', ages[0], 1620, 0.62, {turn: 0.25, face}))}{Pe(c, sit('max', ages[1], 1900, 0.62, {turn: -0.25, face: F.smile}))}</>", "const benchPair = (c: Ctx, ages: [number, number], face = F.smile, flip = false) => (\n  <>{Pe(c, sit('sam', ages[0], 1620, 0.62, {turn: 0.25, face, view: 'front'}))}{Pe(c, sit('max', ages[1], 1900, 0.62, {turn: -0.25, face: F.smile, view: 'front'}))}</>"],
  ["{Pe(c, sit('adam', 65, 1440, 0.6, {turn: 0.2, face: F.soft}))}{Pe(c, sit('sam', 65, 1660, 0.6, {turn: 0.1, face: F.smile}))}{Pe(c, sit('leo', 30, 1880, 0.6, {turn: -0.1, face: F.smile}))}{Pe(c, sit('max', 30, 2100, 0.6, {turn: -0.2, face: F.grin}))}", "{Pe(c, sit('adam', 65, 1440, 0.6, {turn: 0.2, face: F.soft, view: 'front'}))}{Pe(c, sit('sam', 65, 1660, 0.6, {turn: 0.1, face: F.smile, view: 'front'}))}{Pe(c, sit('leo', 30, 1880, 0.6, {turn: -0.1, face: F.smile, view: 'front'}))}{Pe(c, sit('max', 30, 2100, 0.6, {turn: -0.2, face: F.grin, view: 'front'}))}"],
]);
// chairs: seat cushions in front at the new hip height
edit('sets.tsx', [
  ["<rect x={LR.chairX - 178} y={654} width={356} height={74} rx={28}", "<rect x={LR.chairX - 178} y={706} width={356} height={74} rx={28}"],
  ["<path d={`M ${LR.chairX - 150},686 Q ${LR.chairX},706 ${LR.chairX + 150},686`}", "<path d={`M ${LR.chairX - 150},738 Q ${LR.chairX},758 ${LR.chairX + 150},738`}"],
  ["<rect x={LR.sofaX - 300} y={664} width={600} height={64} rx={26}", "<rect x={LR.sofaX - 300} y={712} width={600} height={64} rx={26}"],
]);
console.log('patched 5');
