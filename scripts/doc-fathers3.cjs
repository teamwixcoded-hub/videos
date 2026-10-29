// CLAUDE.md: Two Fathers version 2 (new 7-minute narration with word timestamps) (one-off)
const fs = require('fs');
let s = fs.readFileSync('CLAUDE.md', 'utf8');
const a = s.indexOf('# VIDEO 2:'), b = s.indexOf('# (Older) Project');
const sec = [
  '# VIDEO 2: "Two Fathers. Same Salary. 20 Years Later." (comp TwoFathers, src/fathers/)',
  'Version 2 (current): narration = public/audio/two-fathers-2.mp3 (6:56.4, user\'s ElevenLabs voice) with word timestamps in src/fathers/data/words2.json. The video is exactly as long as the recording (+3 s for the closing question, 419.4 s):',
  'video time = recording time, no stretching, no wordless filler (the user\'s decision). Every shot and on-screen word is placed with T(\'a phrase of the narration\') from src/fathers/timeline.ts (TE() = end of the phrase, speaking() drives mouths),',
  'so edits never need hand-typed seconds. src/fathers/shots.tsx = the whole shot list + KWORDS; Fathers.tsx = grade, cues (sfx3 + sfx4), music beds (tf_*), counters, text. (The first version used the 3:36 recording and the plan PDF; the plan\'s beats are all still there.)',
  'Story now: hook (paid-off house, silent phone, neighbour\'s phone rings 25 years) -> "which one are you?" -> 30 years earlier -> hospital, the promise, the fork (Fork insert) -> Adam\'s father (factory, double shifts, the watch wrapped in newspaper at his 12th birthday, the watch on Adam\'s wrist)',
  '-> 6 PM choice -> Sam\'s hour (blocks on the floor), promotion, small house, old car -> Leo 5 / toy car -> Max\'s newspaper kite -> school play (Leo is a TREE; audience full, Adam\'s seat the only empty one) -> "they count the seats you fill" -> age 15 door -> arguments / tea stall -> worst night (split screen) ->',
  'Leo grows up, has a son and repeats it (toy car) -> Adam at 65 scrolling photos, his wrist watch, "the time he never had" -> Sam at 65 -> the call (banking app, Adam:/Leo: spoken lines on camera) -> Friday: five cups and a glass of milk, grandson, kite -> closing words, polaroid, end card.',
  '**LOOK = EXACTLY THE SAME AS SAME MAN** (the user rejected a warm flat-illustration attempt: "not even close"): glass bubble-head cast on the Same Man engine (src/same2d Char/SideChar Head, Stage, fx text modes, Cinema, Sfx3).',
  'The BODY is new and more human (src/fathers/Human.tsx: tapered limbs, elbows/knees, chest-waist-hip silhouette, suits/cardigan/hoodie, shoes with soles, hands with fingers, a watch on Adam\'s wrist); People.tsx adapts shots to it (poses, outfit variants work/kid/pjs, CHAR_K).',
  'Other files: sets.tsx + sets3.tsx (factory, car), props.tsx + props2.tsx (shaded boxes/laptop/cup/kite), inserts.tsx + inserts3.tsx (phone UIs, WatchInsert, Fork, SeatsCount, Blocks, OldCar, Newspaper), kit.tsx (Z camera, stand/sit/Pe, SC.* scenes, Split), fx.tsx (AgeTag, Counter, Rain, RewindCard).',
  'Rules the user set for this video: speakers are on camera while they speak; both ends of every phone call are shown (ringing phone + the person answering); the seat that is empty is only meaningful when the rest of the audience is full;',
  'objects must be clear (big, sharp, shaded), wall photos readable; motion human-like (eased poses with overshoot, weight shift, walking bob); text digital like Same Man.',
  'Check without Studio: node scripts/still-fathers.cjs 12 80 200 ... in batches of <= 8 (more can crash on 16 GB). Do NOT run it or Studio during the long Same Man render. Validate phrases: every T() must exist in words2.json (a missing one throws at import).',
  'Status: full build, type-checks, 48 frames across the timeline render without errors; user has NOT yet reviewed version 2 in Studio. Known to polish: more per-shot action, hospital/street palettes, faces.',
  '',
  '---',
  '',
].join('\n');
fs.writeFileSync('CLAUDE.md', s.slice(0, a) + sec + s.slice(b));
console.log('doc ok');
