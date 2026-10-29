// Same Man frames: makes the white background of public/images/SM_*.png transparent (flood fill from the border, so white inside
// the character is kept) and writes public/char/sm/<name>.png. Canvas size is kept so frames of one scene line up.
// Usage: node scripts/cut-sm.cjs [prefix]    e.g.  node scripts/cut-sm.cjs SM_bed
const sharp = require('sharp'), fs = require('fs');
const only = process.argv[2] || 'SM_';
(async () => {
  fs.mkdirSync('public/char/sm', {recursive: true});
  for (const file of fs.readdirSync('public/images').filter((f) => f.startsWith(only) && f.endsWith('.png'))) {
    const {data, info} = await sharp('public/images/' + file).removeAlpha().raw().toBuffer({resolveWithObject: true});
    const W = info.width, H = info.height, N = W * H, mn = (i) => Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
    const ext = new Uint8Array(N), q = new Int32Array(N); let h = 0, t = 0;
    const push = (i) => { if (!ext[i] && mn(i) >= 236) { ext[i] = 1; q[t++] = i; } };
    for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); } for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
    while (h < t) { const i = q[h++], x = i % W, y = (i - x) / W; if (x > 0) push(i - 1); if (x < W - 1) push(i + 1); if (y > 0) push(i - W); if (y < H - 1) push(i + W); }
    const out = Buffer.alloc(N * 4);
    for (let i = 0; i < N; i++) {
      let a = 255; const x = i % W, y = (i - x) / W;
      if (ext[i]) a = 0;
      else { let near = false; for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && xx < W && yy >= 0 && yy < H && ext[yy * W + xx]) { near = true; break; } } if (near) a = Math.max(0, Math.min(255, Math.round((250 - mn(i)) / 50 * 255))); }
      out[i * 4] = data[i * 3]; out[i * 4 + 1] = data[i * 3 + 1]; out[i * 4 + 2] = data[i * 3 + 2]; out[i * 4 + 3] = a;
    }
    // 2x Lanczos upscale + a light sharpen: the browser would otherwise stretch the 1K frame with a soft bilinear filter
    await sharp(out, {raw: {width: W, height: H, channels: 4}}).resize(2752, 1536, {kernel: 'lanczos3'}).sharpen({sigma: 1.1, m1: 0.8, m2: 1.6}).png().toFile('public/char/sm/' + file);
    console.log(file, W + 'x' + H, '-> 2752x1536');
  }
})();
