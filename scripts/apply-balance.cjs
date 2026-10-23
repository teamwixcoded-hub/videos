const fs = require('fs');
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log('MISSING', file, String(a).slice(0, 80)); continue; }
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(file, s);
};

// ---- BUSY ----
// Hook: stagger the first four seconds (tags, then the claim, then the numbers) instead of stacking them
edit('src/scenes/Hook.tsx', [
  ['<NameTag text="THE READER" x={480} y={1010} from={0.6} to={4.7} color="#ffd23f" />', '<NameTag text="THE READER" x={480} y={1010} from={0.4} to={1.9} color="#ffd23f" />'],
  ['<NameTag text="THE SCROLLER" x={1440} y={1010} from={0.8} to={4.7} color="#7fc2ff" />', '<NameTag text="THE SCROLLER" x={1440} y={1010} from={0.55} to={1.9} color="#7fc2ff" />'],
  ['<KText text="365 DAYS APART." at={f(1.0)} until={f(2.8)}', '<KText text="365 DAYS APART." at={f(1.0)} until={f(1.9)}'],
  ['<BigCounter from={f(1.7)} hide={f(2.8)} label="BOOKS"', '<BigCounter from={f(1.95)} hide={f(2.8)} label="BOOKS"'],
  ['<BigCounter from={f(1.85)} hide={f(2.8)} label="HOURS ON A SCREEN"', '<BigCounter from={f(2.05)} hide={f(2.8)} label="HOURS ON A SCREEN"'],
]);
// Act1: the "5 MORE MINUTES" bubble no longer lands on top of the 10 -> 100 PAGES morph
edit('src/scenes/Act1.tsx', [
  ['<PropPop src="props/bubble-speech" x={1700} y={500} w={300} from={76.0} to={78.6} label="5 MORE MINUTES" />', '<PropPop src="props/bubble-speech" x={1700} y={500} w={300} from={78.2} to={80.6} label="5 MORE MINUTES" />'],
]);
// S04: "the days blur" is four cuts, not six; the total length is unchanged (90 frames)
edit('src/scenes/S04Day5.tsx', [
  ["  {src: 'FL_K2', grade: 'day', fx: 880, fy: 560},\n  {src: 'FL_B2', grade: 'day', fx: 1230, fy: 520},\n  {src: 'FL_N2', grade: 'night', fx: 1500, fy: 650},\n];", "  {src: 'FL_N2', grade: 'night', fx: 1500, fy: 650},\n];"],
  ["  const d = S(0.85);\n  return (\n    <TransitionSeries>\n      {BLUR.flatMap((b, i) => {\n        const seq = (\n          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d + (i < BLUR.length - 1 ? 6 : 0)}>",
   "  const d = 22; // 4 cuts x 22 frames (the last holds 2 more) keeps the old 90-frame length\n  return (\n    <TransitionSeries>\n      {BLUR.flatMap((b, i) => {\n        const seq = (\n          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={i < BLUR.length - 1 ? d + 6 : d + 2}>"],
  ["{src: 'FL_G1', at: S(19.6), fade: 20}, {src: 'FL_G1c', at: S(22.0), fade: 14}", "{src: 'FL_G1', at: S(19.6), fade: 20}, {src: 'FL_G1l', at: S(20.4), fade: 10}, {src: 'FL_G1c', at: S(22.0), fade: 14}"],
]);
// S06: drop the progress bars; the benefit card already says what changed
edit('src/scenes/S06Spreads.tsx', [
  ['    <ProgressBar label={bar} from={1.4} to={9.4} fillTo={barTo} x={1560} y={760} />\n', ''],
]);

// ---- STILL ----
edit('src/scenes/Act1.tsx', [
  ["  {src: 'FL_R6', at: S(46.0), fade: 26},\n  {src: 'FL_R5', at: S(50.0), fade: 16},", "  {src: 'FL_R6', at: S(46.0), fade: 26},\n  {src: 'FL_R5', at: S(47.5), fade: 14},\n  {src: 'FL_R6', at: S(48.9), fade: 14},\n  {src: 'FL_R5', at: S(50.0), fade: 16},"],
]);
edit('src/scenes/S05Day21.tsx', [
  ["  {src: 'FL_G10', at: S(5.6), fade: 8},\n  {src: 'FL_G11', at: S(9.0), fade: 8},\n  {src: 'FL_G10', at: S(10.0), fade: 8},\n  {src: 'FL_G5', at: S(15.0), fade: 22}, // sleepy, content",
   "  {src: 'FL_G10', at: S(5.6), fade: 8},\n  {src: 'FL_G1l', at: S(6.7), fade: 10}, // looks up, thinking\n  {src: 'FL_G10', at: S(8.2), fade: 10},\n  {src: 'FL_G11', at: S(9.0), fade: 8},\n  {src: 'FL_G10', at: S(10.0), fade: 8},\n  {src: 'FL_G1s', at: S(12.0), fade: 12}, // a sip of tea\n  {src: 'FL_G10', at: S(14.0), fade: 12},\n  {src: 'FL_G5', at: S(15.0), fade: 22}, // sleepy, content"],
]);
edit('src/scenes/S07Day90.tsx', [
  ["  focus(S(15), 1450, 585, 1.6),\n  focus(S(19.5), 480, 570, 1.5), // Green: a stack of finished books, notes, a calmer face\n  focus(S(27), 480, 570, 1.58),",
   "  focus(S(11), 1450, 585, 1.72),\n  focus(S(15), 1450, 585, 1.78),\n  focus(S(19.5), 480, 570, 1.5), // Green: a stack of finished books, notes, a calmer face\n  focus(S(27), 480, 570, 1.74),"],
]);
