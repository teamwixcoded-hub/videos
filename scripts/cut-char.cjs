// Makes the white background of the user's character frames transparent (flood fill from the border, so white inside the
// character - the head, the shoes - is kept). Canvas size is kept, so every frame lines up exactly with the others.
const sharp = require('sharp'), fs = require('fs');
const FRAMES = {f21: 21, f22: 22, f24: 24, f25: 25, f26: 26};
(async () => {
  for (const [name, n] of Object.entries(FRAMES)) {
    const {data, info} = await sharp(`character-lab/style-refs/ref${n}.png`).removeAlpha().raw().toBuffer({resolveWithObject: true});
    const W = info.width, H = info.height, N = W * H, mn = (i) => Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
    const ext = new Uint8Array(N), q = new Int32Array(N); let h = 0, t = 0;
    const push = (i) => { if (!ext[i] && mn(i) >= 238) { ext[i] = 1; q[t++] = i; } };
    for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); } for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
    while (h < t) { const i = q[h++], x = i % W, y = (i - x) / W; if (x > 0) push(i - 1); if (x < W - 1) push(i + 1); if (y > 0) push(i - W); if (y < H - 1) push(i + W); }
    const out = Buffer.alloc(N * 4);
    for (let i = 0; i < N; i++) {
      let a = 255;
      if (ext[i]) a = 0;
      else {
        const x = i % W, y = (i - x) / W; let near = false;
        for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && xx < W && yy >= 0 && yy < H && ext[yy * W + xx]) { near = true; break; } }
        if (near) a = Math.max(0, Math.min(255, Math.round((250 - mn(i)) / 50 * 255)));
      }
      out[i * 4] = data[i * 3]; out[i * 4 + 1] = data[i * 3 + 1]; out[i * 4 + 2] = data[i * 3 + 2]; out[i * 4 + 3] = a;
    }
    await sharp(out, {raw: {width: W, height: H, channels: 4}}).png().toFile(`public/char/${name}.png`);
    console.log(name, W + 'x' + H);
  }
})();
