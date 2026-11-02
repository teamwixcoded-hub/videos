const fs = require('fs');
const edit = (file, fn) => { let s = fs.readFileSync(file, 'utf8'); s = fn(s); fs.writeFileSync(file, s); };
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 80)); return s.replace(a, b); };

edit('src/winter/timeline.ts', (s) => rep(s, /export const END = [\d.]+;[^\n]*/.exec(s)[0], 'export const END = 272.0;                         // how much of the video is built so far (the cut ends just before "The fitness app Strava...")'));
edit('src/winter/act4.tsx', (s) => rep(s, "  ...SHOTS4.map((s): Cue3 => ({file: 'whoosh_soft', at: s.at - 0.03, vol: 0.16})),\n", ''));
edit('src/winter/Winter.tsx', (s) => {
  s = rep(s, "import {SideHero, SIDE} from './SideHero';", "import {SideHero, SIDE} from './SideHero';\nimport {SHOTS4, POPS4, BUBBLES4, CUES4} from './act4';");
  s = rep(s, 'const SHOTS: Shot[] = [', 'const SHOTS1: Shot[] = [');
  s = rep(s, '];\n\nconst POPS: TW[] = [', '];\nconst SHOTS: Shot[] = [...SHOTS1, ...SHOTS4];\n\nconst POPS1: TW[] = [');
  s = rep(s, '];\nconst BUBBLES = [', '];\nconst POPS: TW[] = [...POPS1, ...POPS4];\nconst BUBBLES1 = [');
  s = rep(s, '];\n\nconst CUES: Cue3[] = [\n', '];\nconst BUBBLES = [...BUBBLES1, ...BUBBLES4];\n\nconst CUES: Cue3[] = [\n  ...CUES4,\n');
  s = rep(s, 'Built so far: 0 to 165 s', 'Built so far: 0 to 272 s');
  return s;
});
