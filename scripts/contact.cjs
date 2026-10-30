// contact sheet of stills: node scripts/contact.cjs out.png file1.png file2.png ... (3 columns)
const sharp = require('sharp');
(async () => {
  const [out, ...files] = process.argv.slice(2), cols = 3, W = 640, H = 360, rows = Math.ceil(files.length / cols);
  const comps = await Promise.all(files.map(async (f, i) => ({input: await sharp(f).resize(W, H).toBuffer(), left: (i % cols) * W, top: Math.floor(i / cols) * H})));
  await sharp({create: {width: cols * W, height: rows * H, channels: 3, background: '#000'}}).composite(comps).png().toFile(out);
})();
