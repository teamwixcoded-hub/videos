// prints the loudness (RMS and peak, dBFS) of sound files, to see which effects are quiet:  node scripts/sfx-levels.cjs sfx3 text_pop kw_pop ...
const {execFileSync} = require('child_process');
const path = require('path');
const fs = require('fs');
process.chdir(path.resolve(__dirname, '..'));
const dir = process.argv[2], names = process.argv.slice(3);
const ff = path.resolve('node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
for (const n of names) {
  try {
    const tmp = path.join(require('os').tmpdir(), 'sfxlv.wav'); execFileSync(ff, ['-v', 'error', '-y', '-i', 'public/' + dir + '/' + n + '.mp3', '-ac', '1', '-ar', '22050', '-c:a', 'pcm_s16le', tmp]);
    const buf = fs.readFileSync(tmp).subarray(44), a = new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length - (buf.length % 2)));
    let sum = 0, pk = 0, act = 0, actN = 0;
    for (let i = 0; i < a.length; i++) { const v = a[i] / 32768; sum += v * v; if (Math.abs(v) > pk) pk = Math.abs(v); if (Math.abs(v) > 0.01) { act += v * v; actN++; } }
    const db = (x) => (20 * Math.log10(Math.max(x, 1e-9))).toFixed(1);
    console.log(n.padEnd(16), 'rms', db(Math.sqrt(sum / a.length)).padStart(7), ' active-rms', db(Math.sqrt(act / Math.max(1, actN))).padStart(7), ' peak', db(pk).padStart(7), ' sec', (a.length / 22050).toFixed(2));
  } catch (e) { console.log(n.padEnd(16), 'ERR', String(e.message).slice(0, 80)); }
}
