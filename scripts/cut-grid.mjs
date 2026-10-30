// Cuts an expression sheet on a white background into transparent PNGs, one per portrait, every frame on the SAME canvas with the head centred horizontally,
// so the head never jumps between expressions. Portraits are split at the emptiest column near each grid line (heads are wider than equal cells).
// Usage: node scripts/cut-grid.mjs <sheetName> <outDir> <cols> <rows> name1,name2,...
// The chin row of each row is supplied by eye in scripts/chins.json (key "<set>/<prefix>", cell-relative); the head's centre and width are recorded in src/fathers/data/headmeta.json.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const [sheet, outDir, colsA, rowsA, namesA] = process.argv.slice(2);
const cols = +colsA, rows = +rowsA, names = namesA.split(',');
const {data, info} = await sharp(`public/images/${sheet}.png`).removeAlpha().raw().toBuffer({resolveWithObject: true});
const W = info.width, H = info.height, rh = Math.floor(H / rows), CW = 560;
fs.mkdirSync(outDir, {recursive: true});
const metaPath = 'src/fathers/data/headmeta.json';
const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : {};
const chins = JSON.parse(fs.readFileSync('scripts/chins.json', 'utf8'));
const who = path.basename(outDir);
const white = (x, y) => { const i = (y * W + x) * 3; return data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 232; };
// the sheet's white background, flood-filled from the borders so white shirts and teeth stay opaque
const bgAll = new Uint8Array(W * H);
{ const q = []; const push = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const k = y * W + x; if (bgAll[k] || !white(x, y)) return; bgAll[k] = 1; q.push(k); };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); } for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (q.length) { const k = q.pop(); const x = k % W, y = (k / W) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); } }
for (let r = 0; r < rows; r++) {
  const ry0 = r * rh, ry1 = ry0 + rh;
  // column ink profile for this row band, then the emptiest column near each grid line
  const ink = new Int32Array(W); for (let x = 0; x < W; x++) for (let y = ry0; y < ry1; y++) if (!bgAll[y * W + x]) ink[x]++;
  const bounds = [0]; for (let c = 1; c < cols; c++) { const g = Math.round((c * W) / cols); let best = g, bv = 1e9; for (let x = g - 90; x <= g + 90; x++) { if (ink[x] < bv) { bv = ink[x]; best = x; } } bounds.push(best); } bounds.push(W);
  let cyRef = 0, wRef = 0;
  for (let c = 0; c < cols; c++) {
    const name = names[r * cols + c]; if (!name) continue;
    const bx0 = bounds[c], bx1 = bounds[c + 1], pw = bx1 - bx0;
    // largest connected figure inside this piece
    const lab = new Int32Array(pw * rh), sizes = [0]; let n = 0;
    const isInk = (x, y) => !bgAll[(ry0 + y) * W + bx0 + x];
    for (let k0 = 0; k0 < pw * rh; k0++) { const sx = k0 % pw, sy = (k0 / pw) | 0; if (!isInk(sx, sy) || lab[k0]) continue; n++; sizes[n] = 0; const st = [k0]; lab[k0] = n;
      while (st.length) { const k = st.pop(); sizes[n]++; const x = k % pw, y = (k / pw) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= pw || ny >= rh) continue; const kk = ny * pw + nx; if (isInk(nx, ny) && !lab[kk]) { lab[kk] = n; st.push(kk); } } } }
    let big = 1; for (let i = 1; i <= n; i++) if (sizes[i] > sizes[big]) big = i;
    let x0 = pw, x1 = 0, y0 = rh, y1 = 0;
    for (let k = 0; k < pw * rh; k++) if (lab[k] === big) { const x = k % pw, y = (k / pw) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const key = `${who}/${name.replace(/(neutral|smile|laugh|sad|worried|surprised|tired|ah|closed|proud|regret|oh)$/, '')}`, chin = chins[key] ?? y0 + Math.round((y1 - y0) * 0.6);
    let hx0 = pw, hx1 = 0; for (let k = 0; k < pw * rh; k++) if (lab[k] === big) { const x = k % pw, y = (k / pw) | 0; if (y <= chin) { if (x < hx0) hx0 = x; if (x > hx1) hx1 = x; } }
    const cx = (hx0 + hx1) / 2, off = Math.round(CW / 2 - cx);
    const out = Buffer.alloc(CW * rh * 4);
    for (let y = 0; y < rh; y++) for (let x = 0; x < pw; x++) {
      const k = y * pw + x; if (lab[k] !== big) continue; const dx = x + off; if (dx < 0 || dx >= CW) continue;
      let near = 0; for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + ax, ny = y + ay; if (nx < 0 || ny < 0 || nx >= pw || ny >= rh || lab[ny * pw + nx] !== big) near++; }
      const i = ((ry0 + y) * W + bx0 + x) * 3, o = (y * CW + dx) * 4; out[o] = data[i]; out[o + 1] = data[i + 1]; out[o + 2] = data[i + 2]; out[o + 3] = near ? 215 : 255;
    }
    await sharp(out, {raw: {width: CW, height: rh, channels: 4}}).png().toFile(`${outDir}/${name}.png`);
    if (name.endsWith('neutral')) { cyRef = Math.round((y0 + chin) / 2); wRef = hx1 - hx0; meta[key] = {cx: CW / 2, cy: cyRef, w: wRef, chin, cw: CW, ch: rh}; }
  }
}
fs.mkdirSync(path.dirname(metaPath), {recursive: true});
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 1));
console.log('cut', names.length, 'frames');
