// Renders a few half-size stills of a composition (default TwoFathers) to check the look without opening Studio.
//   node scripts/still-fathers.cjs 1 9 24 41.5        (times in video seconds)  ->  out/stills/<comp>-<t>.png
// Bundles once with a small public folder (sounds + the narration) so it stays light on a 16 GB laptop.
process.chdir(require('path').resolve(__dirname, '..'));
const path = require('path'), fs = require('fs');
const {bundle} = require(path.resolve('node_modules/@remotion/bundler'));
const {renderStill, selectComposition} = require(path.resolve('node_modules/@remotion/renderer'));
const comp = process.env.COMP || 'TwoFathers';
const times = process.argv.slice(2).map(Number);
(async () => {
  const pub = path.resolve('out/pub-fathers'); fs.mkdirSync(pub, {recursive: true});
  for (const d of ['sfx3', 'sfx', 'sfx4', 'music']) { fs.mkdirSync(path.join(pub, d), {recursive: true}); for (const f of fs.readdirSync(path.resolve('public', d), {withFileTypes: true})) if (f.isFile() && !fs.existsSync(path.join(pub, d, f.name))) fs.copyFileSync(path.resolve('public', d, f.name), path.join(pub, d, f.name)); }
  fs.mkdirSync(path.join(pub, 'audio'), {recursive: true}); fs.copyFileSync(path.resolve('public/audio/two-fathers.mp3'), path.join(pub, 'audio/two-fathers.mp3'));
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: pub});
  const composition = await selectComposition({serveUrl, id: comp, logLevel: 'error'});
  fs.mkdirSync('out/stills', {recursive: true});
  for (const t of times) {
    const frame = Math.round(t * 30), out = `out/stills/${comp}-${String(t).replace('.', '_')}.png`;
    await renderStill({composition, serveUrl, frame, output: out, scale: 0.5, imageFormat: 'png', timeoutInMilliseconds: 120000, logLevel: 'error'});
    console.log('ok', out);
  }
})().catch((e) => { console.error('ERR', String(e && e.message || e).slice(0, 600)); process.exit(1); });
