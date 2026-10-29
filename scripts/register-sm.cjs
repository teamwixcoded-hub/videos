// Aligns every frame of one set to a reference frame, using the furniture + shadow at the bottom of the picture (it does not move
// when the character does). Reads public/char/sm/<name>.png (transparent) and rewrites them shifted. Usage: node scripts/register-sm.cjs GL_bed_ GL_bed_slump
const sharp = require('sharp'), fs = require('fs');
const [prefix, refName] = process.argv.slice(2);
const metrics = async (file) => {
  const {data, info} = await sharp(file).raw().toBuffer({resolveWithObject: true});
  const W = info.width, H = info.height; let yb = 0;
  for (let y = H - 1; y >= 0 && !yb; y--) for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 60) { yb = y; break; }
  let x0 = W, x1 = 0;
  for (let y = Math.max(0, yb - 90); y <= yb; y++) for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 60) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
  return {W, H, xc: x0, yb};   // left edge of the furniture base: stable even when a side table or a hand extends the right side
};
(async () => {
  const dir = 'public/char/sm/', ref = await metrics(dir + refName + '.png');
  for (const f of fs.readdirSync(dir).filter((n) => n.startsWith(prefix) && n.endsWith('.png'))) {
    const m = await metrics(dir + f), dx = Math.round(ref.xc - m.xc), dy = Math.round(ref.yb - m.yb);
    if (dx === 0 && dy === 0) { console.log(f, 'ok'); continue; }
    const ext = await sharp(dir + f).extend({top: Math.max(0, dy), bottom: Math.max(0, -dy), left: Math.max(0, dx), right: Math.max(0, -dx), background: {r: 0, g: 0, b: 0, alpha: 0}}).png().toBuffer();   // sharp runs extract() before extend() in one chain, so crop in a second step
    const buf = await sharp(ext).extract({left: Math.max(0, -dx), top: Math.max(0, -dy), width: m.W, height: m.H}).png().toBuffer();
    fs.writeFileSync(dir + f, buf);
    console.log(f, 'shift', dx, dy);
  }
})();
