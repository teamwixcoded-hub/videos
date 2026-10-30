const fs = require('fs');
// Mark every full-frame insert and every scene change in the shot lists, so that each of them can get its own sound (docs: "any visual that appears gets a sound effect").
const markFile = (file) => {
  let s = fs.readFileSync(file, 'utf8'); let n1 = 0, n2 = 0;
  s = s.split('\n').map((line) => {
    let m = /^(\s*)\[(.+?), (undefined|'[wfb]'), ((?:\(c(?:: Ctx)?\)|\(\)) => <(\w+)[ />].*)\],\s*$/.exec(line);
    if (m && !line.includes("ins('")) { n1++; return `${m[1]}[${m[2]}, ${m[3]}, ins('${m[5]}', ${m[4]})],`; }
    m = /^(\s*)\[(.+?), (undefined|'[wfb]'), ((kitE|meet|dine|mgr)\(.*\)|bath\(\)|kit\(\)|mgDesk)\],\s*$/.exec(line);
    if (m && !line.includes("ins('")) { n2++; const kind = m[5] ? 'scene:' + m[5] : m[4] === 'mgDesk' ? 'scene:office' : 'scene:' + m[4].replace('()', ''); return `${m[1]}[${m[2]}, ${m[3]}, ins('${kind}', ${m[4]})],`; }
    return line;
  }).join('\n');
  fs.writeFileSync(file, s);
  console.log(file, 'inserts', n1, 'scenes', n2);
};
let a = fs.readFileSync('src/same7/acts.tsx', 'utf8');
if (!a.includes('export const ins')) {
  a = a.replace('export type Entry = [number, Fx | undefined, R];', "export type Entry = [number, Fx | undefined, R];\n// tags a shot renderer with what it shows (an insert or a scene) so the mix can give it a sound\nexport const ins = (kind: string, r: R): R => { (r as any).kind = kind; return r; };\nexport const kindOf = (r: R): string => (r as any).kind ?? 'room';");
  fs.writeFileSync('src/same7/acts.tsx', a);
}
markFile('src/same7/acts.tsx');
markFile('src/same7/Same7.tsx');
let s = fs.readFileSync('src/same7/Same7.tsx', 'utf8');
const r = (x, y) => { if (!s.includes(x)) throw new Error('MISSING ' + x.slice(0, 60)); s = s.replace(x, y); };
r("import {buildActs, ACT_POPS,", "import {ins, kindOf, buildActs, ACT_POPS,");
// the sounds for inserts, scene changes, tags and bubbles
r('const CUES: Cue3[] = [', `// every full-frame insert, every change of place, every tag and every speech bubble announces itself with a sound
const INSERT_SOUND: Record<string, [string, number, number][]> = {   // [file, offset s, volume]
  ClockInsert: [['kw_pop', 0.05, 0.2]], PhoneFeed: [['phone_swipe', 0.3, 0.16]], CoinReward: [['coin_ping', 0.2, 0.18]], BookPageOne: [['page_turn', 0.1, 0.18]], BookRead: [['page_flutter', 0.1, 0.16]],
  PlanterInsert: [['shimmer', 0.1, 0.16]], TableScene: [['kw_pop', 0.1, 0.16]], ChatPhone: [['phone_notif', 0.2, 0.2]], FeedPhoto: [['reward_pop', 0.3, 0.18]], TypeSearch: [['kw_pop', 0.1, 0.14]],
  NestedPhones: [['kw_pop', 0.1, 0.16]], TenRing: [['kw_pop', 0.1, 0.2]], CountCard: [['kw_pop', 0.1, 0.18]], IconGrid: [['counter_tick', 0.3, 0.16], ['counter_tick', 0.6, 0.16], ['counter_tick', 0.9, 0.16]],
  NodeNetwork: [['shimmer', 0.1, 0.18]], PhoneFaceDown: [['kw_pop', 0.1, 0.14]], YearFlip: [['counter_whir', 0.1, 0.16]], Choice: [['kw_pop', 0.2, 0.2], ['kw_pop', 0.5, 0.2]], CommentCard: [['kw_pop', 0.1, 0.16]],
  EndCard: [['shimmer', 0.1, 0.2]], TeaPour: [['kw_pop', 0.05, 0.14]], BookOpening: [['kw_pop', 0.05, 0.14]], PullGauge: [['kw_pop', 0.2, 0.16]], BillInsert: [['receipt_print', 0.05, 0.16]], DoubleVision: [['shimmer', 0.1, 0.16]],
};
const SCENE_SOUND: Record<string, string> = {'scene:kitE': 'spoon_bowl', 'scene:meet': 'page_flutter', 'scene:dine': 'glass_clink', 'scene:mgr': 'door_open', 'scene:office': 'page_flutter', 'scene:kit': 'spoon_bowl', 'scene:bath': 'brush_teeth'};
const SHOT_CUES: Cue3[] = SHOTS.flatMap((s, i): Cue3[] => {
  const k = kindOf(s.C), prev = i > 0 ? kindOf(SHOTS[i - 1].C) : 'room', out: Cue3[] = [];
  const isScene = k.startsWith('scene:'), isInsert = !isScene && k !== 'room', wasAway = prev !== 'room';
  if (isInsert) { if (!s.fx) out.push({file: 'whoosh_soft', at: s.from - 0.02, vol: 0.18}); for (const [f, o, v] of INSERT_SOUND[k] ?? [['kw_pop', 0.1, 0.16]]) out.push({file: f, at: s.from + o, vol: v}); }
  else if (isScene) { if (prev !== k) { if (!s.fx) out.push({file: 'whoosh_soft', at: s.from - 0.02, vol: 0.16}); out.push({file: SCENE_SOUND[k] ?? 'cloth_shift', at: s.from + 0.1, vol: 0.16}); } }
  else if (wasAway && !s.fx) out.push({file: 'cloth_shift', at: s.from + 0.05, vol: 0.18});
  return out;
});
const TAG_BUBBLE_CUES: Cue3[] = [...ACT_TAGS.flatMap((g): Cue3[] => [{file: 'tag_whoosh', at: g.from, vol: 0.14}, {file: 'pill_pop', at: g.from + 0.3, vol: 0.14}]), ...ACT_BUBBLES.flatMap((b): Cue3[] => [{file: 'pill_pop', at: b.from + 0.05, vol: 0.2}])];
const CUES: Cue3[] = [
  ...SHOT_CUES, ...TAG_BUBBLE_CUES,`);
fs.writeFileSync('src/same7/Same7.tsx', s);
