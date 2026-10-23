// Usage: node scripts/gen.mjs <name> <prompt-file> [aspect] [refName,refName...]
// Saves public/images/<name>.<ext> and records the hosted URL in scripts/manifest.json,
// so later prompts can reference earlier results by name (image-to-image takes URLs).
import fs from 'node:fs';
import path from 'node:path';

const env = fs.readFileSync('.env', 'utf8');
const KEY = env.match(/NANOBANANA_API_KEY=(\S+)/)[1];
const API = 'https://api.nanobananaapi.ai/api/v1';
const H = {Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json'};

const [name, promptFile, aspect = '16:9', refs = ''] = process.argv.slice(2);
const manifestPath = 'scripts/manifest.json';
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const imageUrls = refs ? refs.split(',').map((r) => manifest[r]).filter(Boolean) : [];
if (refs && imageUrls.length !== refs.split(',').length) throw new Error(`unknown ref in ${refs}`);

const credits = async () => (await (await fetch(`${API}/common/credit`, {headers: H})).json()).data;
const before = await credits();

const res = await (await fetch(`${API}/nanobanana/generate-2`, {
  method: 'POST',
  headers: H,
  body: JSON.stringify({
    prompt: fs.readFileSync(promptFile, 'utf8').trim(),
    imageUrls,
    aspectRatio: aspect,
    resolution: process.env.RES || '1K',
    outputFormat: 'png',
  }),
})).json();
if (res.code !== 200) throw new Error(JSON.stringify(res));
const taskId = res.data.taskId;
console.log('task', taskId);

for (let i = 0; i < 90; i++) {
  await new Promise((r) => setTimeout(r, 4000));
  const j = await (await fetch(`${API}/nanobanana/record-info?taskId=${taskId}`, {headers: H})).json();
  const d = j.data;
  if (!d) continue;
  if (d.successFlag === 0) continue;
  if (d.successFlag !== 1) throw new Error(JSON.stringify(j));
  const url = d.response.resultImageUrl;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const out = path.join('public/images', `${name}.png`);
  fs.mkdirSync('public/images', {recursive: true});
  fs.writeFileSync(out, buf);
  const latest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  latest[name] = url;
  fs.writeFileSync(manifestPath, JSON.stringify(latest, null, 2));
  const after = await credits();
  console.log(`saved ${out} (${buf.length} bytes) | credits ${before} -> ${after}`);
  process.exit(0);
}
throw new Error('timed out');
