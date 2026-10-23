// Cuts a head sheet that has a fixed grid and (unwanted) text labels under each head.
// Usage: node scripts/cut-headgrid.mjs <SHEET> <outDir> <cols> <rows> name1,name2,...
// Each head's circle is measured from its own outline, then masked, so labels never leak in.
import sharp from 'sharp';
import fs from 'node:fs';

const [sheet, outDir, colsArg, rowsArg, namesArg] = process.argv.slice(2);
const cols = Number(colsArg), rows = Number(rowsArg);
const names = namesArg.split(',');
const src = `public/images/${sheet}.png`;
const {data, info} = await sharp(src).removeAlpha().raw().toBuffer({resolveWithObject: true});
const {width: W, height: H} = info;
const dark = (x, y) => { const i = (y * W + x) * 3; return data[i] + data[i + 1] + data[i + 2] < 330; };
fs.mkdirSync(`public/images/${outDir}`, {recursive: true});
const cellW = W / cols, cellH = H / rows;
for (let i = 0; i < cols * rows; i++) {
  const c = i % cols, r = Math.floor(i / cols);
  // search window: the upper ~80% of the cell (the label lives in the bottom)
  const wx0 = Math.round(c * cellW), wx1 = Math.round((c + 1) * cellW);
  const wy0 = Math.round(r * cellH + cellH * 0.05), wy1 = Math.round(r * cellH + cellH * 0.8);
  let x0 = W, y0 = H;
  for (let y = wy0; y < wy1; y++) for (let x = wx0; x < wx1; x++) if (dark(x, y)) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); }
  // horizontal extent through the circle's middle (label-free) gives the diameter
  let xl = W, xr = 0;
  const yMid = y0 + Math.round(cellH * 0.38);
  for (let x = wx0; x < wx1; x++) if (dark(x, yMid)) { xl = Math.min(xl, x); xr = Math.max(xr, x); }
  const d = xr - xl + 1;
  const R = Math.round(d / 2);
  const cx = xl + R, cy = y0 + R - (r === 2 ? 3 : 0);
  const S = 400;
  const left = Math.max(0, cx - R), top = Math.max(0, cy - R);
  const crop = await sharp(src).extract({left, top, width: Math.min(2 * R, W - left), height: Math.min(2 * R, H - top)}).resize(S, S).png().toBuffer();
  const mask = Buffer.from(`<svg width="${S}" height="${S}"><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2 - 3}" fill="#fff"/></svg>`);
  await sharp(crop).composite([{input: mask, blend: 'dest-in'}]).png().toFile(`public/images/${outDir}/${names[i]}.png`);
  console.log(names[i], {cx, cy, R});
}
