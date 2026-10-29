// CLAUDE.md: Two Fathers now runs at recording length (one-off)
const fs = require('fs');
let s = fs.readFileSync('CLAUDE.md', 'utf8');
const a = s.indexOf('# VIDEO 2:'), b = s.indexOf('# (Older) Project');
let sec = s.slice(a, b);
sec = sec.replace(/Narration public\/audio\/two-fathers\.mp3 \(3:36\) placed UNCHANGED in 20 pieces\n\(src\/fathers\/timeline\.ts, P = the plan's voiceover timeline\);/,
  'Narration public/audio/two-fathers.mp3 (3:36.5). **The video is exactly as long as the recording (219.5 s = recording + 3 s for the closing question): video time = recording time, no wordless stretches, no added pauses (the user\'s decision: "make it just voiceover length").**\nThe plan\'s beats are kept but compressed onto the narration (src/fathers/timeline.ts, shots.tsx: every shot starts on a phrase of data/narration.srt);');
sec = sec.replace('shots1.tsx (0-215 s) and shots2.tsx (215-490 s) = the shot lists [startSec, fx, renderer], Fathers.tsx (main comp, sound, music).', 'shots.tsx = the shot list [startSec, fx, renderer] plus the on-screen words, Fathers.tsx (main comp, sound, music), props2.tsx (shaded 3D-ish props: gift boxes, laptop, cup and saucer, kite with swaying tail).');
sec = sec.replace('To polish: more per-shot action and camera work, hospital/party/street palettes, auditorium framing, faces, visible greying of the glass hair.', 'Polish done so far: contact shadows under people and furniture, hands that ease into each pose with overshoot (enter), walking bob, shaded props. Still to polish: faces, visible greying of the glass hair, more per-shot action.');
s = s.slice(0, a) + sec + s.slice(b);
fs.writeFileSync('CLAUDE.md', s);
console.log('doc ok');
