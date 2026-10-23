// Re-draws an AI keyframe as clean vector art: flat colour regions, crisp even edges, then rasterises
// it back to a PNG at full size. Removes soft/smudgy rendering and noisy gradients.
// Usage: node scripts/vectorize.mjs <name> [colors=32]    reads public/images/<name>.png, writes public/images/clean/<name>.png
import sharp from 'sharp';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const ImageTracer = require('imagetracerjs');

const [name, colorsArg = '32'] = process.argv.slice(2);
const src = `public/images/${name}.png`;
const meta = await sharp(src).metadata();
const W = 1920, H = Math.round((1920 * meta.height) / meta.width);

// trace at working size (1920 wide), slightly denoised first so the tracer sees clean regions
const {data, info} = await sharp(src).resize(W, H, {kernel: 'lanczos3'}).median(3).ensureAlpha().raw().toBuffer({resolveWithObject: true});
const svg = ImageTracer.imagedataToSVG({width: info.width, height: info.height, data}, {
  ltres: 0.6, qtres: 0.6, pathomit: 14, colorsampling: 2, numberofcolors: Number(colorsArg), mincolorratio: 0,
  colorquantcycles: 4, blurradius: 0, scale: 1, roundcoords: 1, viewbox: true, desc: false, strokewidth: 0,
});
fs.mkdirSync('public/images/clean', {recursive: true});
fs.writeFileSync(`public/images/clean/${name}.svg`, svg);
// rasterise at 2x then settle to 2752 wide so edges stay crisp when the camera zooms in
await sharp(Buffer.from(svg), {density: 144}).resize(2752, Math.round((2752 * H) / W)).sharpen({sigma: 0.8}).png().toFile(`public/images/clean/${name}.png`);
console.log(name, 'svg', Math.round(svg.length / 1024) + 'KB');
