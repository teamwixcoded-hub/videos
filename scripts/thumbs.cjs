// Renders the thumbnail compositions to out/thumbs/*.png (1280x720):   node scripts/thumbs.cjs [ThumbSame7A ThumbSame7B ThumbFathersA ThumbFathersB]
process.chdir(require('path').resolve(__dirname, '..'));
const path = require('path'), fs = require('fs');
const {bundle} = require(path.resolve('node_modules/@remotion/bundler'));
const {renderStill, selectComposition} = require(path.resolve('node_modules/@remotion/renderer'));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['ThumbSame7A', 'ThumbFathersA'];
(async () => {
  const pub = path.resolve('out/pub-fathers'); fs.mkdirSync(pub, {recursive: true});
  fs.mkdirSync(path.join(pub, 'images'), {recursive: true}); for (const f of fs.readdirSync('public/images')) if (/^thumb_.*.png$/.test(f)) fs.copyFileSync(path.join('public/images', f), path.join(pub, 'images', f));
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: pub});
  fs.mkdirSync('out/thumbs', {recursive: true});
  for (const id of ids) {
    const composition = await selectComposition({serveUrl, id, logLevel: 'error'});
    await renderStill({composition, serveUrl, frame: 0, output: `out/thumbs/${id}.png`, imageFormat: 'png', timeoutInMilliseconds: 120000, logLevel: 'error'});
    console.log('ok', id);
  }
})().catch((e) => { console.error('ERR', String(e && e.message || e).slice(0, 600)); process.exit(1); });
