const fs = require('fs');
const edit = (file, pairs) => { let s = fs.readFileSync(file, 'utf8'); for (const [a, b] of pairs) { if (!s.includes(a)) throw new Error(file + ' MISSING ' + a.slice(0, 70)); s = s.split(a).join(b); } fs.writeFileSync(file, s); };

// 1) the narration decides when a character talks: the mouth opens on every spoken word (one flutter per syllable) and the hands gesture while the phrase lasts
let t = fs.readFileSync('src/same7/timeline.ts', 'utf8');
if (!t.includes('export const mouth')) {
  t += `
// lip sync: how far a mouth is open at time t (0 closed .. 1 wide). Every spoken word opens and closes once per syllable; between words the mouth rests closed.
export const mouth = (t: number): number => {
  for (const w of WORDS) {
    if (t < w.a) break;
    if (t <= w.b + 0.04) { const u = (t - w.a) / Math.max(0.08, w.b - w.a), syl = Math.max(1, Math.round((w.b - w.a) / 0.17)); return Math.abs(Math.sin(u * Math.PI * syl)) * (0.45 + 0.55 * Math.sin(Math.min(1, u) * Math.PI)); }
  }
  return 0;
};
// 0..1 while a phrase is being spoken (smooth edges), used to move the hands and head
export const talkEnv = (t: number): number => {
  for (const c of CAPS) { if (t < c.from - 0.12) break; if (t <= c.to + 0.18) return Math.min(1, (t - (c.from - 0.12)) / 0.12, (c.to + 0.18 - t) / 0.12); }
  return 0;
};
`;
  fs.writeFileSync('src/same7/timeline.ts', t);
}

// 2) part2's Person: mouth and gestures come from a hook that the new cut sets (the old cut keeps its constant flutter)
edit('src/same2d/part2.tsx', [
  ['export let SC2: any = null;', "export let SC2: any = null;\n// how the speaking characters move: the new cut replaces these with narration-driven lip sync (src/same7); the old cut keeps a constant flutter\nexport const TALK = {mouth: (t: number, sd: number) => Math.abs(Math.sin(t * 13 + sd)) * 0.32, env: (_t: number) => 1};"],
  ['const g = Math.sin(p.t * 3.1 + sd) * 30 * talk, g2 = Math.sin(p.t * 2.3 + 1) * 24 * talk;', 'const env = talk > 0 ? TALK.env(p.t) : 0, g = Math.sin(p.t * 3.1 + sd) * 30 * talk * env, g2 = Math.sin(p.t * 2.3 + 1) * 24 * talk * env;'],
  ['open: (p.face?.open ?? 0) + talk * 0.32 * Math.abs(Math.sin(p.t * 13 + sd))', 'open: (p.face?.open ?? 0) + (talk > 0 ? talk * TALK.mouth(p.t, sd) : 0)'],
]);

edit('src/same2d/part2.tsx', [
  ['baseN[1] - 120 * talk + g2]', 'baseN[1] - 120 * talk * env + g2]'],
  ['headPitch={p.pitch ?? 6}', 'headPitch={(p.pitch ?? 6) + (talk > 0 ? TALK.env(p.t) * Math.sin(p.t * 6 + sd) * 3 : 0)}'],
]);
// 3) the reader turns a page now and then while reading
edit('src/same2d/Same2D.tsx', [
  ['const fl = p.flip ?? 0, turnF', "const fl = p.flip ?? (mode === 'book' ? (() => { const f = ((t + 0.7) % 4.6) / 0.9; return f < 1 ? f : 0; })() : 0), turnF"],
]);
// 4) a bigger, clearer open book facing the reader
edit('src/same2d/SideChar.tsx', [
  ['<g transform="scale(0.85)">\n          {/* an OPEN book held in front', '<g transform="scale(1.12)">\n          {/* an OPEN book held in front'],
  ['skewY(-9) scale(0.74 1)', 'skewY(-7) scale(0.84 1)'],
]);
// 5) Same7 wiring
edit('src/same7/Same7.tsx', [
  ["import {buildPart2} from '../same2d/part2';", "import {buildPart2, TALK} from '../same2d/part2';"],
  ["import {FPS, AUDIO_FILE, T, TA, FULL_TOTAL, speechDuck} from './timeline';", "import {FPS, AUDIO_FILE, T, TA, FULL_TOTAL, speechDuck, mouth, talkEnv} from './timeline';\n// the characters speak with the narrator: mouths follow the spoken words, hands move while a phrase lasts\nTALK.mouth = (t) => mouth(t) * 0.75;\nTALK.env = talkEnv;"],
]);
let a = fs.readFileSync('src/same7/acts.tsx', 'utf8');
a = a.replace("import {T, TA, FULL_TOTAL} from './timeline';", "import {T, TA, FULL_TOTAL, mouth} from './timeline';");
// Daniel's own spoken lines move his mouth with the words
const okay = a.indexOf("[TA('okay', T('the glow dies'))");
const ten = a.indexOf("[TA('ten pages', T('the glow dies'))");
for (const at of [okay, ten]) { if (at < 0) throw new Error('lines'); }
a = a.replace("() => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.2, brow: 0.2}), r: null, glowS: 0.6}))", "(c: Ctx) => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.2, brow: 0.2, open: mouth(c.t) * 0.8}), r: null, glowS: 0.6}))");
a = a.replace("() => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.35}), r: null, glowS: 0.6}))", "(c: Ctx) => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.35, open: mouth(c.t) * 0.8}), r: null, glowS: 0.6}))");
fs.writeFileSync('src/same7/acts.tsx', a);
