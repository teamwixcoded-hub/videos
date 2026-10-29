// Same Man: turns the narration SRT into caption chunks (recording time, seconds).
// SRT cues that continue the same sentence (gap <= 0.15 s, previous cue has no sentence end) are merged.
const fs = require('fs');
const src = fs.readFileSync('src/same/data/narration.srt', 'utf8').replace(/\r/g, '').trim().split(/\n\n+/);
const t = (s) => { const m = s.match(/(\d+):(\d+):(\d+),(\d+)/); return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000; };
const cues = src.map((b) => { const l = b.split('\n'); const [a, z] = l[0].split(' --> '); return {from: t(a), to: t(z), text: l.slice(1).join(' ').trim()}; });
const out = [];
const MERGE = false;
for (const c of cues) {
  if (!MERGE) { out.push({...c}); continue; }
  const p = out[out.length - 1];
  if (p && c.from - p.to <= 0.15 && !/[.!?]["”]?$/.test(p.text) && !/,$/.test(p.text)) { p.to = c.to; p.text += ' ' + c.text; }
  else if (p && c.from - p.to <= 0.15 && /,$/.test(p.text) && p.text.split(' ').length < 4) { p.to = c.to; p.text += ' ' + c.text; }
  else out.push({...c});
}
// five cut points sit in the middle of an SRT cue; split those cues at the real pause in the recording (found with silencedetect)
const SPLITS = [  // [text starts with, words in the first half, first half ends, second half starts]
  ['Ten pages feel like a hundred', 6, 45.45, 46.31], ['Small things annoy him', 4, 110.97, 111.52], ['at work. He thinks', 7, 144.60, 145.11],
  ['pressure. Nobody saw', 1, 234.47, 235.01], ['down. He opens a book', 1, 275.42, 276.06],
];
for (const [start, n, a, b] of SPLITS) {
  const i = out.findIndex((c) => c.text.startsWith(start)); if (i < 0) { console.log('split not found', start); continue; }
  const c = out[i], w = c.text.split(' ');
  out.splice(i, 1, {from: c.from, to: a, text: w.slice(0, n).join(' ')}, {from: b, to: c.to, text: w.slice(n).join(' ')});
}
fs.writeFileSync('src/same/data/captions.json', JSON.stringify(out.map((c) => ({from: +c.from.toFixed(3), to: +c.to.toFixed(3), text: c.text})), null, 1));
console.log(cues.length, 'cues ->', out.length, 'chunks');
