const sharp = require('sharp'), fs = require('fs');
const SHEETS = [
  ['character-lab/pose-refs/sheet-sit-stand.png', ['sitRelaxed', 'sitTired', 'sitTalk', 'getUp1', 'getUp2', 'getUp3', 'standRelaxed', 'standTired']],
  ['character-lab/pose-refs/sheet-phone.png', ['phoneOnBedSit', 'phoneReach', 'phoneGrab', 'phoneLift', 'phoneHeld', 'phoneLowRelaxed', 'phoneGlanceUp', 'phoneStand']],
  ['character-lab/pose-refs/sheet-daily.png', ['brushTeeth', 'brushTeethFace', 'talkListen', 'talkSpeak', 'talkExplain', 'talkWorried', 'stretch']],
  ['character-lab/pose-refs/sheet-story.png', ['lyingPhone', 'sleeping', 'tear', 'officeWork', 'manager', 'mother', 'walking']],
];
(async () => {
  const sizes = {};
  for (const f of fs.readdirSync('public/poses')) fs.unlinkSync('public/poses/' + f);
  for (const [file, names] of SHEETS) {
    const {data, info} = await sharp(file).removeAlpha().raw().toBuffer({resolveWithObject: true});
    const W = info.width, H = info.height, bg = [...data.slice(0, 3)];
    const dist = (p) => Math.abs(data[p * 3] - bg[0]) + Math.abs(data[p * 3 + 1] - bg[1]) + Math.abs(data[p * 3 + 2] - bg[2]);
    // coarse mask (cells of 4 px), dilated by R cells
    const C = 4, w = Math.ceil(W / C), h = Math.ceil(H / C), m = new Uint8Array(w * h);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (dist(y * W + x) > 60) m[Math.floor(y / C) * w + Math.floor(x / C)] = 1;
    const R = 2, d = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (m[y * w + x]) for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < h && xx >= 0 && xx < w) d[yy * w + xx] = 1; }
    const lab = new Int32Array(w * h), comps = [];
    for (let s = 0; s < w * h; s++) if (d[s] && !lab[s]) {
      const id = comps.length + 1, st = [s]; lab[s] = id; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, n = 0;
      while (st.length) { const p = st.pop(), px = p % w, py = (p - px) / w; n++; x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
        for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = px + ox, yy = py + oy; if (xx >= 0 && xx < w && yy >= 0 && yy < h && d[yy * w + xx] && !lab[yy * w + xx]) { lab[yy * w + xx] = id; st.push(yy * w + xx); } } }
      comps.push({id, x0, y0, x1, y1, n});
    }
    const figs = comps.filter((c) => (c.y1 - c.y0) * C > 110).sort((a, b) => a.y0 - b.y0);
    // reading order: two rows by vertical centre
    const mid = (H) / 2;
    const row = (c) => ((c.y0 + c.y1) / 2 * C < mid ? 0 : 1);
    figs.sort((a, b) => row(a) - row(b) || a.x0 - b.x0);
    console.log(file, 'figures', figs.length, 'expected', names.length);
    for (let n = 0; n < Math.min(figs.length, names.length); n++) {
      const c = figs[n], X0 = Math.max(0, c.x0 * C - 8), Y0 = Math.max(0, c.y0 * C - 8), X1 = Math.min(W - 1, c.x1 * C + C + 8), Y1 = Math.min(H - 1, c.y1 * C + C + 8);
      const cw = X1 - X0 + 1, chh = Y1 - Y0 + 1, out = Buffer.alloc(cw * chh * 4);
      for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
        const p = y * W + x, o = ((y - Y0) * cw + (x - X0)) * 4, dd = dist(p);
        const inComp = lab[Math.floor(y / C) * w + Math.floor(x / C)] === c.id;
        const a = !inComp ? 0 : dd < 36 ? 0 : dd < 70 ? Math.round((dd - 36) / 34 * 255) : 255;
        out[o] = data[p * 3]; out[o + 1] = data[p * 3 + 1]; out[o + 2] = data[p * 3 + 2]; out[o + 3] = a;
      }
      // drop the caption under the feet: a thin last band of pixels separated from the figure by a gap
      const rc = []; for (let y = 0; y < chh; y++) { let c = 0; for (let x = 0; x < cw; x++) if (out[(y * cw + x) * 4 + 3] > 40) c++; rc.push(c); }
      let last = chh - 1; while (last > 0 && rc[last] === 0) last--;
      let top = last; while (top > 0 && rc[top] > 0) top--;                      // top = gap row above the last band
      let gapTop = top; while (gapTop > 0 && rc[gapTop] === 0) gapTop--;
      if (last - top < 34 && top - gapTop >= 3 && gapTop > 0) for (let y = top; y < chh; y++) for (let x = 0; x < cw; x++) out[(y * cw + x) * 4 + 3] = 0;
      { // same for a caption/title band above the head
        let first = 0; while (first < chh - 1 && rc[first] === 0) first++;
        let bot = first; while (bot < chh - 1 && rc[bot] > 0) bot++;
        let nxt = bot; while (nxt < chh - 1 && rc[nxt] === 0) nxt++;
        if (bot - first < 34 && nxt - bot >= 3 && nxt < chh - 1) for (let y = 0; y < nxt; y++) for (let x = 0; x < cw; x++) out[(y * cw + x) * 4 + 3] = 0;
      }
      const tr = await sharp(out, {raw: {width: cw, height: chh, channels: 4}}).trim().png().toBuffer({resolveWithObject: true});
      const buf = tr.data, mt = {width: tr.info.width, height: tr.info.height};
      // furniture anchor: the cream bed/mattress. Its top row and left edge are measured so sequences can pin the bed in place.
      let bedTop = -1, bedLeft = -1;
      { const rb = await sharp(buf).raw().toBuffer({resolveWithObject: true}); const bw = rb.info.width, bh = rb.info.height, bc = rb.info.channels;
        const isCream = (i) => rb.data[i + 3] > 200 && rb.data[i] > 205 && rb.data[i + 1] > 198 && rb.data[i + 2] > 180 && rb.data[i] - rb.data[i + 2] < 45 && rb.data[i] - rb.data[i + 2] > 6;
        for (let y = 0; y < bh && bedTop < 0; y++) { let c = 0, minx = 1e9; for (let x = 0; x < bw; x++) if (isCream((y * bw + x) * bc)) { c++; minx = Math.min(minx, x); } if (c > bw * 0.45) { bedTop = y; bedLeft = minx; } } }
      const left = X0 - tr.info.trimOffsetLeft, bottom = Y0 - tr.info.trimOffsetTop + mt.height;
      fs.writeFileSync(`public/poses/${names[n]}.png`, buf); sizes[names[n]] = {w: mt.width, h: mt.height, left, bottom, sheet: file, row: n < 4 ? 0 : 1, sw: W, bedTop, bedLeft};
    }
  }
  fs.writeFileSync('public/poses/_sizes.json', JSON.stringify(sizes, null, 1)); console.log(Object.keys(sizes).length);
})();
