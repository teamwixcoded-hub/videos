// Cuts a sprite sheet on a white background into transparent PNGs.
// Usage: node scripts/cut-sheet.mjs <SHEET> <outDir> <mode: items|heads> <cols> <rows> name1,name2,...
//  - finds each item as a connected group of non-white pixels
//  - drops frames (a group that contains other groups) and text labels (short, wide groups)
//  - makes the outer white background transparent by flood fill from the edges
// Mode "heads" crops every item to the same square, so all heads share one scale.
import sharp from 'sharp';
import fs from 'node:fs';

const [sheet, outDir, mode, colsArg, rowsArg, namesArg] = process.argv.slice(2);
const rows = Number(rowsArg);
const names = namesArg.split(',');
const src = `public/images/${sheet}.png`;
const {data, info} = await sharp(src).removeAlpha().raw().toBuffer({resolveWithObject: true});
const {width: W, height: H} = info;
const whiteness = (i) => (data[i * 3] + data[i * 3 + 1] + data[i * 3 + 2]) / 3;
const isInk = (i) => whiteness(i) < 225;

// connected groups on a coarse grid, dilated so thin gaps inside an item don't split it
const CELL = 4;
const gw = Math.ceil(W / CELL), gh = Math.ceil(H / CELL);
const cell = new Uint8Array(gw * gh);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isInk(y * W + x)) cell[Math.floor(y / CELL) * gw + Math.floor(x / CELL)] = 1;
const DIL = Number(process.env.DIL ?? 3);
const dil = new Uint8Array(gw * gh);
for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) if (cell[y * gw + x])
  for (let dy = -DIL; dy <= DIL; dy++) for (let dx = -DIL; dx <= DIL; dx++) {
    const yy = y + dy, xx = x + dx;
    if (yy >= 0 && yy < gh && xx >= 0 && xx < gw) dil[yy * gw + xx] = 1;
  }
const label = new Int32Array(gw * gh).fill(-1);
let n = 0;
for (let s = 0; s < gw * gh; s++) {
  if (!dil[s] || label[s] >= 0) continue;
  const stack = [s];
  label[s] = n;
  while (stack.length) {
    const c = stack.pop();
    const cx = c % gw, cy = Math.floor(c / gw);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = cx + dx, yy = cy + dy;
      if (xx < 0 || yy < 0 || xx >= gw || yy >= gh) continue;
      const k = yy * gw + xx;
      if (dil[k] && label[k] < 0) { label[k] = n; stack.push(k); }
    }
  }
  n++;
}
// bbox of real ink per group
const boxes = Array.from({length: n}, () => ({x0: W, y0: H, x1: 0, y1: 0, ink: 0}));
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!isInk(y * W + x)) continue;
  const l = label[Math.floor(y / CELL) * gw + Math.floor(x / CELL)];
  if (l < 0) continue;
  const b = boxes[l];
  b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x); b.y0 = Math.min(b.y0, y); b.y1 = Math.max(b.y1, y); b.ink++;
}
let items = boxes.filter((b) => b.ink > 0).map((b) => ({...b, w: b.x1 - b.x0 + 1, h: b.y1 - b.y0 + 1}));
items = items.filter((b) => b.w > 40 && b.h > 40 && !(b.h < 60 && b.w > b.h * 1.8)); // drop specks and text lines
const contains = (a, b) => a !== b && a.x0 <= b.x0 && a.y0 <= b.y0 && a.x1 >= b.x1 && a.y1 >= b.y1;
items = items.filter((a) => !items.some((b) => contains(a, b)));
// reading order: cluster into rows, then left to right
items.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
const per = Math.ceil(items.length / rows);
const ordered = [];
for (let r = 0; r < rows; r++) ordered.push(...items.slice(r * per, (r + 1) * per).sort((a, b) => a.x0 - b.x0));
if (ordered.length !== names.length) console.warn(`WARNING: found ${ordered.length} items but ${names.length} names`);

fs.mkdirSync(`public/images/${outDir}`, {recursive: true});
const R = mode === 'heads' ? Math.round([...ordered].map((b) => Math.min(b.w, b.h)).sort((a, b) => a - b)[Math.floor(ordered.length / 2)] / 2) : 0;
const PAD = 8;
const report = {};
for (let i = 0; i < Math.min(ordered.length, names.length); i++) {
  const b = ordered[i];
  let left, top, w, h;
  if (mode === 'heads') {
    // the circle's left and bottom edges are never affected by add-ons (sweat drops)
    const cx = b.x0 + R, cy = b.y1 - R;
    left = cx - R - PAD; top = cy - R - PAD; w = h = 2 * R + 2 * PAD;
  } else {
    left = b.x0 - PAD; top = b.y0 - PAD; w = b.w + 2 * PAD; h = b.h + 2 * PAD;
  }
  left = Math.max(0, left); top = Math.max(0, top); w = Math.min(W - left, w); h = Math.min(H - top, h);
  const {data: px} = await sharp(src).extract({left, top, width: w, height: h}).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  // flood the white background from the crop edges
  const bg = new Uint8Array(w * h);
  const q = [];
  const push = (x, y) => {
    const k = y * w + x;
    if (!bg[k] && (px[k * 4] + px[k * 4 + 1] + px[k * 4 + 2]) / 3 > 215) { bg[k] = 1; q.push(k); }
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (q.length) {
    const k = q.pop();
    const x = k % w, y = Math.floor(k / w);
    if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1);
  }
  for (let k = 0; k < w * h; k++) if (bg[k]) px[k * 4 + 3] = 0;
  // soften the fringe: near-white pixels touching the background become transparent too
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const k = y * w + x;
    if (bg[k]) continue;
    const near = bg[k - 1] || bg[k + 1] || bg[k - w] || bg[k + w];
    if (near && (px[k * 4] + px[k * 4 + 1] + px[k * 4 + 2]) / 3 > 190) px[k * 4 + 3] = 90;
  }
  let img = sharp(px, {raw: {width: w, height: h, channels: 4}});
  if (mode === 'heads') img = img.resize(400, 400);
  await img.png().toFile(`public/images/${outDir}/${names[i]}.png`);
  report[names[i]] = {w: mode === 'heads' ? 400 : w, h: mode === 'heads' ? 400 : h};
}
fs.writeFileSync(`public/images/${outDir}/_sizes.json`, JSON.stringify(report, null, 1));
console.log(sheet, '->', outDir, ordered.length, 'items');
