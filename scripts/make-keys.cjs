// Synthesises keyboard sounds (no AI, deterministic): 3 key clicks, a space-bar thock, and a small "line done" ding.
// Writes public/sfx/k1.wav k2.wav k3.wav kspace.wav kding.wav (44.1 kHz, 16-bit mono).
const fs = require('fs');
const SR = 44100;
let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 - 0.5; };

const write = (name, samples) => {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  let peak = 0; for (const v of samples) peak = Math.max(peak, Math.abs(v));
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round((samples[i] / (peak || 1)) * 0.9 * 32767), 44 + i * 2);
  fs.writeFileSync(`public/sfx/${name}.wav`, buf);
};

// a key: sharp noise "tick" + short plastic body tone + faint low thump
const key = (len, tickHz, bodyHz, thump, clack) => {
  const n = Math.floor(SR * len);
  const out = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    lp += (rnd() * 2 - lp) * 0.55; // lightly filtered noise
    const tick = lp * Math.exp(-t / 0.0022) * 1.0;
    const click2 = Math.sin(2 * Math.PI * tickHz * t) * Math.exp(-t / 0.0016) * 0.55;
    const body = Math.sin(2 * Math.PI * bodyHz * t) * Math.exp(-t / 0.012) * 0.5;
    const th = Math.sin(2 * Math.PI * thump * t) * Math.exp(-t / 0.03) * 0.6;
    const bottom = t > clack ? (rnd() * 2) * Math.exp(-(t - clack) / 0.003) * 0.45 : 0; // key bottoming out
    out[i] = tick + click2 + body + th + bottom;
  }
  return out;
};
write('k1', key(0.09, 3100, 900, 160, 0.011));
write('k2', key(0.09, 2700, 780, 140, 0.013));
write('k3', key(0.09, 3500, 1050, 175, 0.010));
write('kspace', key(0.13, 1800, 520, 110, 0.016));

// "line done" ding
{
  const n = Math.floor(SR * 0.9), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = (Math.sin(2 * Math.PI * 1760 * t) * 0.6 + Math.sin(2 * Math.PI * 3520 * t) * 0.25 + Math.sin(2 * Math.PI * 2637 * t) * 0.2) * Math.exp(-t / 0.22) * Math.min(1, t / 0.002);
  }
  write('kding', out);
}
console.log('keys written');
