// nested <svg> instead of foreignObject for photos, split-screen framing, lamp post, banking font size, a four-person photo
const fs = require('fs');
const P = (f) => 'src/fathers/' + f;
const edit = (file, pairs) => {
  let s = fs.readFileSync(P(file), 'utf8');
  for (const [a, b, all] of pairs) {
    if (!s.includes(a)) { console.log('MISSING in', file, ':', a.slice(0, 80)); continue; }
    s = all ? s.split(a).join(b) : s.replace(a, b);
  }
  fs.writeFileSync(P(file), s);
};
edit('props.tsx', [
  ["export type PhotoKind = 'kite' |", "export type PhotoKind = 'four' | 'kite' |"],
  ["export const PhotoArt: React.FC<{kind: PhotoKind; w: number; h: number; hideAdam?: boolean}> = ({kind, w, h}) => {", "export const PhotoArt: React.FC<{kind: PhotoKind; w: number; h: number; x?: number; y?: number}> = ({kind, w, h, x, y}) => {"],
  ["const sky = kind === 'sunset' || kind === 'stall' ?", "const sky = kind === 'sunset' || kind === 'stall' || kind === 'four' ?"],
  ['<svg width={w} height={h} viewBox="0 0 200 150" style={{display: \'block\'}}>', '<svg x={x} y={y} width={w} height={h} viewBox="0 0 200 150" style={{display: \'block\'}}>'],
  ["{kind !== 'play' && kind !== 'party' && kind !== 'wedding' && <rect y={104}", "{kind !== 'play' && kind !== 'party' && kind !== 'wedding' && <rect y={104}"],
  ["      {kind === 'grad' &&", "      {kind === 'four' && <g>{person(52, 124, 0.9, '#26324f', '#e3ad84')}{person(88, 126, 0.9, '#b4592f')}{person(124, 126, 0.9, '#3f78c4', '#e3ad84')}{person(160, 126, 0.9, '#4c9a63')}<rect x={10} y={40} width={50} height={64} fill=\"#8a5a3a\" stroke={INK} strokeWidth={3} opacity={0.0} /></g>}\n      {kind === 'grad' &&"],
  ['<foreignObject x={-80} y={-62} width={160} height={112}><PhotoArt kind={kind} w={160} h={112} /></foreignObject>', '<PhotoArt kind={kind} x={-80} y={-62} w={160} h={120} />'],
  ['<foreignObject x={-96} y={-82} width={192} height={134}><PhotoArt kind="kite" w={192} h={134} /></foreignObject>', '<PhotoArt kind="kite" x={-96} y={-82} w={192} h={144} />'],
  ['<foreignObject x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16}><PhotoArt kind={kind} w={w - 16} h={h - 16} /></foreignObject>', '<PhotoArt kind={kind} x={-w / 2 + 8} y={-h / 2 + 8} w={w - 16} h={h - 16} />'],
]);
edit('inserts.tsx', [
  ['<foreignObject x={-212} y={-290} width={424} height={500}><div style={{width: 424, height: 500, overflow: \'hidden\', borderRadius: 14}}><PhotoArt kind={items[i].kind} w={667} h={500} /></div></foreignObject>', '<PhotoArt kind={items[i].kind} x={-212} y={-250} w={424} h={318} />'],
  ['<foreignObject x={-396} y={-306} width={792} height={540}><PhotoArt kind="grad" w={792} h={594} /></foreignObject>', '<PhotoArt kind="grad" x={-396} y={-306} w={792} h={594} />'],
  ['<foreignObject x={-190} y={-150} width={380} height={270}><PhotoArt kind="stall" w={380} h={285} /></foreignObject>', '<PhotoArt kind="four" x={-190} y={-150} w={380} h={285} />'],
  ['fontWeight={700} fontSize={120} fill="#26324f">${amt', 'fontWeight={700} fontSize={96} fill="#26324f">${amt'],
]);
edit('sets.tsx', [['<g transform="translate(900 770)"><rect x={-7} y={-300}', '<g transform="translate(560 770)"><rect x={-7} y={-300}']]);
edit('shots2.tsx', [
  ["const d = side === 'adam' ? streetPoint('adam', 0.74, 0.72) : streetPoint('sam', 0.74, 0.72), step = ramp(c.l, 0.8, 3.4);", "const d = side === 'adam' ? streetPoint('adam', 0.74, 0.72) : streetPoint('sam', 0.74, 0.72), step = ramp(c.l, 0.8, 3.4), px = d[0] + (side === 'adam' ? 40 : -40) * step;"],
  ["return SC.str(c, Z(d[0] + (side === 'adam' ? 60 : -60), 590, 2.3),", "return SC.str(c, Z(px + (side === 'adam' ? 209 : -209), 590, 2.3),"],
  ["const leoNight = (c: Ctx, z = 1.3) => SC.room(c, [Z(1500, 520, z), Z(1450, 500, z + 0.2)],", "const leoNight = (c: Ctx, z = 1.3) => SC.room(c, [Z(1700, 520, z), Z(1660, 500, z + 0.2)],"],
  ["const samDoor = (c: Ctx) => SC.door(c, [Z(1550, 520, 1.3), Z(1560, 520, 1.45)],", "const samDoor = (c: Ctx) => SC.door(c, [Z(930, 520, 1.3), Z(940, 520, 1.45)],"],
  ["const stairsSm = (c: Ctx) => SC.stairs(c, [Z(1950, 520, 1.2), Z(1950, 500, 1.4)],", "const stairsSm = (c: Ctx) => SC.stairs(c, [Z(1700, 520, 1.2), Z(1700, 500, 1.4)],"],
]);
console.log('patched 3');
