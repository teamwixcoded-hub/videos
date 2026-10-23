// Cuts public/images/HEADS.png (4x3 grid) into public/images/heads/<expression>.png.
// Each head's circle is found from its dark outline, then masked exactly, so the white
// background and the text labels the model adds under each head are dropped.
import sharp from 'sharp';
import fs from 'node:fs';

const names = ['neutral', 'bored', 'tired', 'frustrated', 'sad', 'crying', 'angry', 'focused', 'smile', 'proud', 'surprised', 'relieved'];
const src = 'public/images/HEADS.png';
const {data, info} = await sharp(src).removeAlpha().raw().toBuffer({resolveWithObject: true});
const {width: W, height: H} = info;
const guessX = [162, 455, 745, 1038].map((v) => (v * W) / 1200);
const guessY = [146, 445, 740].map((v) => (v * H) / 896);
const dark = (x, y) => {
  const i = (y * W + x) * 3;
  return data[i] + data[i + 1] + data[i + 2] < 330;
};
fs.mkdirSync('public/images/heads', {recursive: true});
for (let i = 0; i < 12; i++) {
  const gx = guessX[i % 4];
  const gy = guessY[Math.floor(i / 4)];
  // search window: above the label line, left/right within the cell
  let x0 = W, x1 = 0, y0 = H, y1 = 0;
  for (let y = Math.max(0, Math.round(gy - 135)); y < Math.min(H, Math.round(gy + 124)); y++) {
    for (let x = Math.round(gx - 135); x < Math.round(gx + 135); x++) {
      if (dark(x, y)) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x);
        y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
    }
  }
  const cx = (x0 + x1) / 2;
  const R0 = i >= 8 ? 121 : 119; // all heads are the same size; label text can inflate the box, so anchor on the top edge
  const cy = y0 + R0 + (i >= 8 ? -4 : 0);
  const r = R0;
  const left = Math.round(cx - r), top = Math.round(cy - r);
  const S = 400;
  const mask = Buffer.from(`<svg width="${S}" height="${S}"><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2 - 5}" fill="#fff"/></svg>`);
  const crop = await sharp(src).extract({left, top, width: 2 * r, height: 2 * r}).resize(S, S).png().toBuffer();
  await sharp(crop).composite([{input: mask, blend: 'dest-in'}]).png().toFile(`public/images/heads/${names[i]}.png`);
  console.log(names[i], {cx: Math.round(cx), cy: Math.round(cy), r});
}
