// Renders the first N frames of Same2D (default 1800 = the first minute) in small pieces, with the audio on its own, then stitches them.
// Built for a 16 GB laptop that runs out of memory on a single long render. Safe to stop and re-run: finished pieces are skipped.
//   node scripts/render-same2d.cjs            -> first minute  -> out/same2d-first-minute.mp4
//   node scripts/render-same2d.cjs 3600 2     -> first two minutes, concurrency 2
// It bundles ONCE with a small public folder that holds only the sounds and music this cut uses (not the 600 MB of images).
process.chdir(require('path').resolve(__dirname, '..'));
const path = require('path'), fs = require('fs'), cp = require('child_process');
const {bundle} = require(path.resolve('node_modules/@remotion/bundler'));
const {renderMedia, selectComposition} = require(path.resolve('node_modules/@remotion/renderer'));

const TOTAL = Number(process.argv[2] || 1800), CONC = Number(process.argv[3] || 2), CHUNK = 150;
const name = TOTAL === 1800 ? 'first-minute' : `first-${TOTAL}`;
const dir = `out/chunks-${name}`; fs.mkdirSync(dir, {recursive: true});
const log = (m) => { const l = new Date().toTimeString().slice(0, 8) + ' ' + m; console.log(l); fs.appendFileSync(`${dir}/render.log`, l + '\n'); };

(async () => {
  // a public folder with only what this cut plays
  const pub = path.resolve('out/pub-same2d'); fs.rmSync(pub, {recursive: true, force: true}); fs.mkdirSync(pub, {recursive: true});
  for (const d of ['sfx3', 'sfx', 'music']) {
    fs.mkdirSync(path.join(pub, d), {recursive: true});
    for (const f of fs.readdirSync(path.resolve('public', d), {withFileTypes: true})) if (f.isFile()) fs.copyFileSync(path.resolve('public', d, f.name), path.join(pub, d, f.name));
  }
  fs.mkdirSync(path.join(pub, 'audio'), {recursive: true}); fs.copyFileSync(path.resolve('public/audio/Same Man.mp3'), path.join(pub, 'audio/Same Man.mp3'));
  log('bundling (small public folder)');
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: pub});
  const composition = await selectComposition({serveUrl, id: 'Same2D', logLevel: 'error'});
  const total = Math.min(TOTAL, composition.durationInFrames);
  log(`composition ${composition.durationInFrames} frames, rendering 0-${total - 1}`);

  for (let a = 0; a < total; a += CHUNK) {
    const b = Math.min(a + CHUNK - 1, total - 1), out = `${dir}/f${a}.mp4`;
    if (fs.existsSync(out)) continue;
    let ok = false;
    for (let t = 1; t <= 4 && !ok; t++) {
      const conc = t <= 2 ? CONC : 1;
      try {
        log(`frames ${a}-${b} try ${t} (concurrency ${conc})`);
        await renderMedia({composition, serveUrl, codec: 'h264', outputLocation: `${dir}/tmp${a}.mp4`, frameRange: [a, b], muted: true, concurrency: conc, imageFormat: 'jpeg', jpegQuality: 92, crf: 18, timeoutInMilliseconds: 240000, logLevel: 'error'});
        fs.renameSync(`${dir}/tmp${a}.mp4`, out); ok = true;
      } catch (e) { log('failed: ' + String(e.message || e).replace(/\s+/g, ' ').slice(0, 300)); await new Promise((r) => setTimeout(r, 8000)); }
    }
    if (!ok) { log(`GAVE UP at frame ${a}`); process.exit(1); }
  }
  if (!fs.existsSync(`${dir}/audio.aac`)) {
    log('rendering audio');
    await renderMedia({composition, serveUrl, codec: 'aac', outputLocation: `${dir}/audio.aac`, frameRange: [0, total - 1], concurrency: 1, timeoutInMilliseconds: 240000, logLevel: 'error'});
  }
  const list = fs.readdirSync(dir).filter((f) => /^f\d+\.mp4$/.test(f)).sort((x, y) => Number(x.slice(1, -4)) - Number(y.slice(1, -4))).map((f) => `file '${f}'`);
  fs.writeFileSync(`${dir}/list.txt`, list.join('\n'));
  log('stitching');
  const outFile = `out/same2d-${name}.mp4`;
  cp.execSync(`npx remotion ffmpeg -y -f concat -safe 0 -i ${dir}/list.txt -i ${dir}/audio.aac -c:v copy -c:a aac -b:a 192k -shortest ${outFile}`, {stdio: 'ignore'});
  log(`ALL DONE -> ${outFile}`);
})().catch((e) => { log('SCRIPT ERROR ' + String(e && e.message || e).slice(0, 400)); process.exit(1); });
