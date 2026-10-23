// Renders the frame that is on screen 0.5 s after each caption appears, so caption timing can be checked against the picture.
// Usage: node scripts/caption-audit.cjs   -> out/audit/<scene>.png  (one labelled grid per scene)
const {execSync} = require('child_process');
const fs = require('fs');
const sharp = require('sharp');
const src = fs.readFileSync('src/keyphrases.ts', 'utf8');
const TS = 0.6, FPS = 30;
const map = {KP_ACT1: 'Act1', KP_S04: 'S04Day5', KP_S05: 'S05Day21', KP_S06: 'S06Spreads', KP_S07: 'S07Day90', KP_S08: 'S08Low', KP_S09: 'S09Result', KP_S10: 'S10Day365', KP_S11: 'S11Turn', KP_S12: 'S12End'};
fs.mkdirSync('out/audit', {recursive: true});
const only = process.argv.slice(2);
(async () => {
  for (const [name, comp] of Object.entries(map)) {
    if (only.length && !only.includes(comp)) continue;
    const block = src.split(`export const ${name}: KP[] = [`)[1].split('\n];')[0];
    const lines = [...block.matchAll(/\{t: '?"?([^}]*?)'?"?, from: ([\d.]+), to: ([\d.]+)/g)].map((m) => ({t: m[1].replace(/^['"]|['"]$/g, ''), from: +m[2], to: +m[3]}));
    const comps = [];
    let i = 0;
    for (const l of lines) {
      const frame = Math.round((l.from + 0.5) * FPS * TS);
      const out = `out/audit/${comp}-${i}.png`;
      try { execSync(`npx remotion still src/index.ts ${comp} ${out} --frame=${frame} --log=error`, {stdio: 'pipe'}); } catch (e) { console.log('fail', comp, l.t); }
      const label = Buffer.from(`<svg width="640" height="44"><rect width="640" height="44" fill="#000"/><text x="8" y="30" font-size="22" font-family="Arial" fill="#ffd23f">${l.from}s  ${l.t.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`);
      comps.push({input: await sharp(out).resize(640, 360).composite([{input: label, top: 316, left: 0}]).png().toBuffer(), left: (i % 3) * 640, top: Math.floor(i / 3) * 360});
      i++;
    }
    await sharp({create: {width: 1920, height: Math.ceil(lines.length / 3) * 360, channels: 3, background: '#000'}}).composite(comps).png().toFile(`out/audit/${comp}.png`);
    console.log(comp, lines.length);
  }
})();
