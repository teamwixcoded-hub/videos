// Lip-sync analyzer: voice audio -> per-frame mouth codes + energy, as JSON for Remotion.
// Usage: node scripts/lipsync.mjs <audio-file> <out.json> [fps=30]
// Codes: c closed, s small, m medium, w wide, o round, e sibilant (s/f/sh: teeth together, wide and flat)
import fs from 'fs';
import path from 'path';
import cp from 'child_process';

const [, , input, out, fpsArg] = process.argv;
if (!input || !out) { console.error('usage: node scripts/lipsync.mjs <audio> <out.json> [fps]'); process.exit(1); }
const FPS = +(fpsArg || 30), LEAD_FRAMES = 1;

function toWav(file) {
  if (file.toLowerCase().endsWith('.wav')) return file;
  const ff = fs.readdirSync('node_modules/@remotion', {withFileTypes: true}).filter((d) => d.name.startsWith('compositor-'))
    .map((d) => path.join('node_modules/@remotion', d.name, 'ffmpeg.exe')).find((p) => fs.existsSync(p));
  const tmp = path.join(path.dirname(out), '_tmp-lipsync.wav');
  const r = cp.spawnSync(ff, ['-v', 'error', '-y', '-i', file, '-ac', '1', '-ar', '22050', '-c:a', 'pcm_s16le', tmp]);
  if (r.status !== 0) throw new Error('could not decode ' + file + ': ' + r.stderr);
  return tmp;
}
function readWav(file) {
  const b = fs.readFileSync(file); let p = 12, fmt = null, data = null;
  while (p < b.length - 8) {
    const id = b.toString('ascii', p, p + 4), size = b.readUInt32LE(p + 4);
    if (id === 'fmt ') fmt = {ch: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22)};
    if (id === 'data') { data = b.subarray(p + 8, p + 8 + Math.min(size, b.length - p - 8)); break; }
    p += 8 + size + (size & 1);
  }
  if (!fmt || !data || fmt.bits !== 16) throw new Error('need 16-bit PCM wav');
  const n = Math.floor(data.length / 2 / fmt.ch), x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = data.readInt16LE(i * 2 * fmt.ch) / 32768;
  return {x, sr: fmt.sr};
}
const pct = (arr, q) => { const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))] || 0; };

const {x, sr} = readWav(toWav(input));
const total = Math.ceil((x.length / sr) * FPS), pad = Math.round(sr * 0.012);
const rms = [], zcr = [], hf = [];
for (let f = 0; f < total; f++) {
  const a = Math.max(1, Math.round((f / FPS) * sr) - pad), b = Math.min(x.length, Math.round(((f + 1) / FPS) * sr) + pad);
  let e = 0, d = 0, z = 0;
  for (let i = a; i < b; i++) { e += x[i] * x[i]; const df = x[i] - x[i - 1]; d += df * df; if ((x[i] >= 0) !== (x[i - 1] >= 0)) z++; }
  const len = Math.max(1, b - a); rms.push(Math.sqrt(e / len)); zcr.push(z / len); hf.push(Math.sqrt(d / len) / (Math.sqrt(e / len) + 1e-6));
}
const top = pct(rms, 0.95) || 1, L = rms.map((v) => Math.min(1, v / top));
const voiced = L.map((v, i) => i).filter((i) => L[i] > 0.08);
const zHi = pct(voiced.map((i) => zcr[i]), 0.72), hfMed = pct(voiced.map((i) => hf[i]), 0.5);

let codes = L.map((l, i) => {
  if (l < 0.08) return 'c';
  if (zcr[i] > zHi && l < 0.62) return 'e';
  if (l < 0.25) return 's';
  if (l < 0.5) return 'm';
  return hf[i] < hfMed ? 'o' : 'w';
});
for (let i = 1; i < codes.length - 1; i++) if (codes[i] !== codes[i - 1] && codes[i - 1] === codes[i + 1]) codes[i] = codes[i - 1];   // drop one-frame flicker
codes = [...codes.slice(LEAD_FRAMES), ...Array(LEAD_FRAMES).fill('c')];                                                               // lips lead the sound
const energy = L.map((v, i) => +((L[i - 1] ?? v) * 0.25 + v * 0.5 + (L[i + 1] ?? v) * 0.25).toFixed(2));
const eLead = [...energy.slice(LEAD_FRAMES), ...Array(LEAD_FRAMES).fill(0)];

fs.mkdirSync(path.dirname(out), {recursive: true});
fs.writeFileSync(out, JSON.stringify({fps: FPS, seconds: +(x.length / sr).toFixed(2), frames: codes.join(''), energy: eLead}));
const dist = {}; codes.forEach((c) => (dist[c] = (dist[c] || 0) + 1));
console.log(path.basename(input), '->', out, '|', total, 'frames |', codes.join(''), '|', JSON.stringify(dist));
