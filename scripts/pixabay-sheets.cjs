// Contact sheets of the Pixabay candidates (one PNG per clip) so they can be judged by eye.
const fs = require('fs'), sharp = require('sharp');
const cand = JSON.parse(fs.readFileSync('out/pixabay/candidates.json', 'utf8'));
const only = process.argv.slice(2);
(async () => {
  for (const [clip, list] of Object.entries(cand)) {
    if (only.length && !only.some((o) => clip.startsWith(o))) continue;
    const cw = 330, ch = 215, cols = 4, rows = Math.ceil(list.length / cols), comps = [];
    for (let i = 0; i < list.length; i++) {
      const v = list[i], f = `out/pixabay/thumbs/${v.id}.jpg`;
      if (!fs.existsSync(f)) { try { const r = await fetch(v.thumb); if (r.ok) fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); } catch (e) {} }
      if (!fs.existsSync(f)) continue;
      const img = await sharp(f).resize(cw - 6, 166, {fit: 'cover'}).toBuffer();
      const label = Buffer.from(`<svg width="${cw}" height="40"><rect width="100%" height="100%" fill="#111"/><text x="6" y="16" font-size="15" fill="#ffd23f" font-family="Arial">#${i} id ${v.id} · ${v.duration}s · ${v.w}x${v.h}</text><text x="6" y="34" font-size="12" fill="#ccc" font-family="Arial">${v.tags.slice(0, 44).replace(/&/g, '&amp;')}</text></svg>`);
      comps.push({input: img, left: (i % cols) * cw + 3, top: Math.floor(i / cols) * ch}, {input: label, left: (i % cols) * cw, top: Math.floor(i / cols) * ch + 166});
    }
    await sharp({create: {width: cols * cw, height: rows * ch, channels: 3, background: '#111'}}).composite(comps).png().toFile(`out/pixabay/sheet_${clip}.png`);
    console.log('sheet', clip);
  }
})();
