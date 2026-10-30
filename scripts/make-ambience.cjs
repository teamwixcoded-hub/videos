// Synthesises four seamless room-tone beds (the recorded amb_* files for night room, kitchen, office and restaurant are almost silent after the first second):
//   node scripts/make-ambience.cjs   ->  public/sfx7/amb_night_room.mp3, amb_kitchen.mp3, amb_office.mp3, amb_restaurant.mp3  (20 s loops, rms about -22 dBFS at volume 1)
const {execFileSync} = require('child_process');
const path = require('path'), fs = require('fs'), os = require('os');
process.chdir(path.resolve(__dirname, '..'));
const ff = path.resolve('node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const SR = 22050, SEC = 20, PAD = 1.0, N = Math.round((SEC + PAD) * SR);
let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const noise = () => rnd() * 2 - 1;
const lp = (x, fc) => { const a = Math.exp(-2 * Math.PI * fc / SR); let y = 0; return x.map((v) => (y = (1 - a) * v + a * y)); };
const hp = (x, fc) => { const l = lp(x, fc); return x.map((v, i) => v - l[i]); };
const mixIn = (dst, src, g) => { for (let i = 0; i < dst.length; i++) dst[i] += src[i] * g; };
const rmsOf = (x) => Math.sqrt(x.reduce((s, v) => s + v * v, 0) / x.length);
const slowMod = (f, depth) => { const ph = rnd() * 6.28; return (i) => 1 + depth * Math.sin(2 * Math.PI * f * i / SR + ph); };
const burst = (out, at, len, g, fc) => { const n = Math.round(len * SR); const b = lp(Array.from({length: n}, noise), fc); for (let i = 0; i < n && at + i < out.length; i++) out[at + i] += b[i] * g * Math.exp(-i / (n * 0.25)); };
const white = () => Array.from({length: N}, noise);
const make = (name, build) => {
  seed = 12345 + name.length * 77;
  let x = build();
  // seamless loop: the last PAD seconds fade into the first PAD seconds
  const P = Math.round(PAD * SR), L = N - P, out = new Float32Array(L);
  for (let i = 0; i < L; i++) out[i] = x[i];
  for (let i = 0; i < P; i++) { const k = i / P; out[i] = out[i] * k + x[L + i] * (1 - k); }
  let r = rmsOf(out); const g = Math.pow(10, -22 / 20) / r;
  const pcm = Buffer.alloc(L * 2); let pk = 0; for (let i = 0; i < L; i++) pk = Math.max(pk, Math.abs(out[i] * g));
  const lim = pk > 0.92 ? 0.92 / pk : 1;
  for (let i = 0; i < L; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, out[i] * g * lim)) * 32767), i * 2);
  const wav = Buffer.alloc(44 + pcm.length); wav.write('RIFF', 0); wav.writeUInt32LE(36 + pcm.length, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(pcm.length, 40); pcm.copy(wav, 44);
  const tmp = path.join(os.tmpdir(), 'amb.wav'); fs.writeFileSync(tmp, wav);
  fs.mkdirSync('public/sfx7', {recursive: true});
  execFileSync(ff, ['-v', 'error', '-y', '-i', tmp, '-b:a', '128k', `public/sfx7/${name}.mp3`]);
  console.log('wrote', name);
};
// a quiet bedroom at night: soft air, a faint low hum, a distant car now and then
make('amb_night_room', () => { const a = lp(white(), 380), m = slowMod(0.07, 0.25), o = a.map((v, i) => v * m(i)); const hum = Array.from({length: N}, (_, i) => Math.sin(2 * Math.PI * 55 * i / SR) * 0.05); mixIn(o, hum, 1); const car = new Array(N).fill(0); for (let k = 0; k < 3; k++) { const at = Math.round((3 + k * 6.3 + rnd() * 2) * SR), len = 2 * SR; const w = lp(white(), 500); for (let i = 0; i < len && at + i < N; i++) car[at + i] += w[i] * Math.sin(Math.PI * i / len) * 0.12; } mixIn(o, car, 1); return o; });
// the kitchen in the evening: a fridge hum, a little air, a drip or a clink
make('amb_kitchen', () => { const a = lp(white(), 700), o = a.map((v) => v * 0.6); const hum = Array.from({length: N}, (_, i) => (Math.sin(2 * Math.PI * 100 * i / SR) * 0.1 + Math.sin(2 * Math.PI * 200 * i / SR) * 0.04) * (1 + 0.15 * Math.sin(2 * Math.PI * 0.3 * i / SR))); mixIn(o, hum, 1); for (let k = 0; k < 4; k++) burst(o, Math.round((2 + k * 4.5 + rnd() * 2) * SR), 0.12, 0.35, 3500); return o; });
// an office: air conditioning, distant keys, a page, a phone far away
make('amb_office', () => { const a = lp(white(), 1400), m = slowMod(0.11, 0.15), o = a.map((v, i) => v * m(i) * 0.7); const hum = Array.from({length: N}, (_, i) => Math.sin(2 * Math.PI * 120 * i / SR) * 0.04); mixIn(o, hum, 1); let t = 0.5; while (t < SEC) { burst(o, Math.round(t * SR), 0.03, 0.4, 5000); t += 0.12 + rnd() * (rnd() < 0.2 ? 1.6 : 0.35); } return o; });
// a restaurant: a murmur of voices (band-limited noise that swells like speech), glasses, cutlery
make('amb_restaurant', () => { const b = hp(lp(white(), 2600), 280), o = new Array(N).fill(0); const env = lp(Array.from({length: N}, () => Math.abs(noise())), 6); for (let i = 0; i < N; i++) o[i] = b[i] * (0.4 + 3 * env[i]); const b2 = hp(lp(white(), 2000), 200), env2 = lp(Array.from({length: N}, () => Math.abs(noise())), 4); for (let i = 0; i < N; i++) o[i] += b2[i] * (0.3 + 2.4 * env2[i]); for (let k = 0; k < 7; k++) burst(o, Math.round((1 + k * 2.7 + rnd() * 1.5) * SR), 0.18, 0.5, 6500); return o; });
