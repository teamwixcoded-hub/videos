// Two Fathers: narration.srt -> captions.json (recording seconds)
const fs = require('fs');
const src = fs.readFileSync('src/fathers/data/narration.srt', 'utf8').replace(/\r/g, '').trim().split(/\n\n+/);
const t = (s) => { const m = s.match(/(\d+):(\d+):(\d+),(\d+)/); return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000; };
const out = src.map((b) => { const l = b.split('\n'); const [a, z] = l[1].split(' --> '); return {from: +t(a).toFixed(3), to: +t(z).toFixed(3), text: l.slice(2).join(' ').trim()}; });
fs.writeFileSync('src/fathers/data/captions.json', JSON.stringify(out, null, 1));
console.log(out.length, 'cues');
