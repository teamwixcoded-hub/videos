// Usage: node scripts/stills.mjs <CompId> <outPrefix> <sec1> <sec2> ...   (real seconds)  -> out/<prefix>-<sec>.png + a grid
import path from 'node:path';
import sharp from 'sharp';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const [id, prefix, ...secs] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id});
const comps = [];
for (let i = 0; i < secs.length; i++) {
  const out = `out/${prefix}-${secs[i]}.png`;
  await renderStill({composition, serveUrl, output: out, frame: Math.min(composition.durationInFrames - 1, Math.round(+secs[i] * 30))});
  comps.push({input: await sharp(out).resize(640, 360).toBuffer(), left: (i % 3) * 640, top: Math.floor(i / 3) * 360});
}
await sharp({create: {width: 1920, height: Math.ceil(secs.length / 3) * 360, channels: 3, background: '#000'}}).composite(comps).png().toFile(`out/${prefix}-grid.png`);
console.log('ok');
