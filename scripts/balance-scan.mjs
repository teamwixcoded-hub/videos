// Scores Video01 for pacing. Input: out/bal/element-NNN.jpeg, one thumbnail every 15 frames (0.5 s at 30 fps).
// For each pair of neighbouring thumbnails it measures how much of the picture changed (motion), and for each thumbnail how
// much bright/colourful clutter sits on top of the art (overlay load: very high-contrast text and badges). It prints one line
// per 4-second window and flags windows that are too still or too busy, then writes a contact sheet of each flagged window.
import sharp from 'sharp';
import fs from 'node:fs';

const dir = 'out/bal';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jpeg')).sort();
const W = 480, H = 270;
const frames = [];
for (const f of files) {
  const {data} = await sharp(`${dir}/${f}`).resize(W, H).removeAlpha().raw().toBuffer({resolveWithObject: true});
  frames.push(data);
}
const motion = frames.map((d, i) => {
  if (!i) return 0;
  const p = frames[i - 1];
  let changed = 0;
  for (let k = 0; k < d.length; k += 3) {
    const diff = Math.abs(d[k] - p[k]) + Math.abs(d[k + 1] - p[k + 1]) + Math.abs(d[k + 2] - p[k + 2]);
    if (diff > 60) changed++;
  }
  return changed / (W * H);
});
// clutter: share of pixels that are near-white or highly saturated (text, badges, cards, icons sit in these colours)
const clutter = frames.map((d) => {
  let c = 0;
  for (let k = 0; k < d.length; k += 3) {
    const r = d[k], g = d[k + 1], b = d[k + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if ((mn > 225) || (mx > 170 && mx - mn > 120)) c++;
  }
  return c / (W * H);
});
const WIN = 8; // 8 thumbnails = 4 s
const rows = [];
for (let i = 0; i < frames.length; i += WIN) {
  const m = motion.slice(i, i + WIN), c = clutter.slice(i, i + WIN);
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  rows.push({t0: i * 0.5, motion: avg(m), clutter: avg(c), idx: i});
}
const mAll = rows.map((r) => r.motion).sort((a, b) => a - b), cAll = rows.map((r) => r.clutter).sort((a, b) => a - b);
const q = (a, p) => a[Math.floor(p * (a.length - 1))];
const lowM = q(mAll, 0.2), highM = q(mAll, 0.85), highC = q(cAll, 0.85);
for (const r of rows) {
  r.flag = r.motion < lowM && r.clutter < q(cAll, 0.5) ? 'STILL' : r.motion > highM || r.clutter > highC ? 'BUSY' : '';
  console.log(`${String(Math.floor(r.t0 / 60)).padStart(1)}:${String(Math.round(r.t0 % 60)).padStart(2, '0')}  motion ${(r.motion * 100).toFixed(1).padStart(5)}%  clutter ${(r.clutter * 100).toFixed(1).padStart(5)}%  ${r.flag}`);
}
fs.writeFileSync('out/balance.json', JSON.stringify({rows, lowM, highM, highC}, null, 1));
// contact sheets
for (const kind of ['STILL', 'BUSY']) {
  const sel = rows.filter((r) => r.flag === kind).slice(0, 12);
  const comp = [];
  for (let n = 0; n < sel.length; n++) {
    const mid = Math.min(files.length - 1, sel[n].idx + 3);
    comp.push({input: await sharp(`${dir}/${files[mid]}`).resize(480, 270).toBuffer(), left: (n % 4) * 480, top: Math.floor(n / 4) * 270});
  }
  if (comp.length) await sharp({create: {width: 1920, height: Math.ceil(sel.length / 4) * 270, channels: 3, background: '#000'}}).composite(comp).png().toFile(`out/balance-${kind}.png`);
  console.log(kind, sel.map((r) => `${Math.floor(r.t0 / 60)}:${String(Math.round(r.t0 % 60)).padStart(2, '0')}`).join(' '));
}
