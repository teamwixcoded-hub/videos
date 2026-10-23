// One-off: breaks up still stretches in every scene by adding the extra frames and prop pops.
const fs = require('fs');
const rd = (p) => fs.readFileSync(p, 'utf8');
const sub = (s, re, rep, label) => { if (!re.test(s)) { console.log('NO MATCH', label); return s; } return s.replace(re, () => rep); };
const ins = (s, a, b, label) => { if (!s.includes(a)) { console.log('MISSING', label, a.slice(0, 50)); return s; } return s.replace(a, () => b); };

// ---------------- Act1 ----------------
let a = rd('src/scenes/Act1.tsx');
a = sub(a, /const RED: SeqFrame\[\] = \[[\s\S]*?\n\];/, `const RED: SeqFrame[] = [
  {src: 'FL_R1', at: S(0)},
  {src: 'FL_R1y', at: S(3.6), fade: 10}, // rubs his eyes
  {src: 'FL_R1', at: S(5.9), fade: 10},
  {src: 'FL_R1s', at: S(8.6), fade: 12}, // a long sigh
  {src: 'FL_R1', at: S(11.3), fade: 12},
  {src: 'FL_R1g', at: S(13.0), fade: 10}, // glances toward the phone
  {src: 'FL_R2', at: S(16.4), fade: 24},
  {src: 'FL_R1y', at: S(26.0), fade: 14},
  {src: 'FL_R1g', at: S(29.6), fade: 12},
  {src: 'FL_R2', at: S(33.4), fade: 12},
  {src: 'FL_R2b', at: S(35.6), fade: 18},
  {src: 'FL_R3', at: S(36.9), fade: 16},
  {src: 'FL_R4', at: S(39.5), fade: 16},
  {src: 'FL_R5', at: S(41.0), fade: 20},
  {src: 'FL_R7', at: S(43.0), fade: 12},
  {src: 'FL_R5', at: S(45.0), fade: 14},
  {src: 'FL_R6', at: S(46.0), fade: 26},
  {src: 'FL_R5', at: S(50.0), fade: 16},
  {src: 'FL_R7', at: S(52.0), fade: 12},
  {src: 'FL_R6', at: S(54.2), fade: 22},
  {src: 'FL_R10', at: S(57.8), fade: 16}, // glazed scrolling
  {src: 'FL_R6', at: S(61.0), fade: 18},
  {src: 'FL_R7', at: S(66.0), fade: 12},
  {src: 'FL_R6', at: S(68.4), fade: 22},
  // night one: he settles into bed while the camera is on Green, then the phone keeps him awake
  {src: 'FL_N1', at: S(72.2), fade: 14},
  {src: 'FL_N2', at: S(80.2), fade: 12},
  {src: 'FL_N3', at: S(88.4), fade: 18},
  {src: 'FL_N1', at: S(92.6), fade: 18},
];`, 'act1 RED');
a = sub(a, /const GREEN: SeqFrame\[\] = \[[\s\S]*?\n\];/, `const GREEN: SeqFrame[] = [
  {src: 'FL_G1', at: S(0)},
  {src: 'FL_G1p', at: S(6.0), fade: 10}, // turns a page
  {src: 'FL_G1', at: S(7.6), fade: 10},
  {src: 'FL_G1l', at: S(12.4), fade: 12}, // looks up, thinking
  {src: 'FL_G1', at: S(15.0), fade: 12},
  {src: 'FL_G1s', at: S(21.0), fade: 14}, // a sip of tea
  {src: 'FL_G1', at: S(24.8), fade: 14},
  {src: 'FL_G1c', at: S(30.0), fade: 14}, // crosses his legs
  {src: 'FL_G1p', at: S(36.0), fade: 10},
  {src: 'FL_G1', at: S(37.6), fade: 10},
  {src: 'FL_G1s', at: S(45.0), fade: 14},
  {src: 'FL_G1', at: S(48.6), fade: 14},
  {src: 'FL_G1l', at: S(53.4), fade: 12},
  {src: 'FL_G1', at: S(55.6), fade: 12},
  {src: 'FL_G1p', at: S(58.0), fade: 10},
  {src: 'FL_G2', at: S(62.0), fade: 14},
  {src: 'FL_G1', at: S(63.8), fade: 14},
  {src: 'FL_G2', at: S(65.2), fade: 14},
  {src: 'FL_G3', at: S(67.0), fade: 18},
  {src: 'FL_G4a', at: S(71.2), fade: 14},
  {src: 'FL_G4', at: S(72.1), fade: 12},
  {src: 'FL_G5', at: S(74.6), fade: 20},
  {src: 'FL_G6', at: S(76.0), fade: 22},
  {src: 'FL_G7', at: S(83.0), fade: 18},
  {src: 'FL_G8', at: S(86.2), fade: 18},
  {src: 'FL_G9', at: S(94.6), fade: 16},
];`, 'act1 GREEN');
a = ins(a, "import {S, TIME_SCALE, easeInOut, clamp01} from '../easing';", "import {S, TIME_SCALE, easeInOut, clamp01} from '../easing';\nimport {PropPop} from '../components/PropPop';\nimport {CalendarFlip} from '../components/Props5';", 'act1 import');
a = ins(a, '        <ThoughtTower from={S(71.6)} to={S(75.4)} build={70} x={680} y={440} />', `        <ThoughtTower from={S(71.6)} to={S(75.4)} build={70} x={680} y={440} />
        {/* props that carry the story */}
        <PropPop src="fx/zzz" x={1560} y={350} w={120} from={5.6} to={8.4} float />
        <PropPop src="fx/question" x={1500} y={370} w={96} from={12.8} to={15.0} />
        <PropPop src="fx/question" x={385} y={350} w={96} from={13.2} to={15.2} />
        <PropPop src="fx/badge" x={1800} y={716} w={58} from={16.8} to={19.6} />
        <PropPop src="props/book-closed" x={560} y={330} w={140} from={19.8} to={22.4} rotate={-8} />
        <PropPop src="fx/sweat" x={430} y={410} w={80} from={59.0} to={61.6} />
        <PropPop src="fx/question" x={375} y={350} w={92} from={63.0} to={64.8} />
        <PropPop src="fx/question" x={375} y={350} w={92} from={65.4} to={67.0} />
        <PropPop src="props/bubble-speech" x={1700} y={500} w={300} from={76.0} to={78.6} label="5 MORE MINUTES" />
        <PropPop src="fx/anger" x={335} y={380} w={96} from={85.9} to={87.8} rotate={-8} />`, 'act1 props');
a = ins(a, '      <PhoneInset from', '      <CalendarFlip from={S(24.4)} hide={S(30.6)} flips={Array.from({length: 10}, (_, i) => S(25.2 + i * 0.55))} x={1580} y={320} w={230} />\n      <PhoneInset from', 'act1 cal');
fs.writeFileSync('src/scenes/Act1.tsx', a);

let ax = rd('src/scenes/act1Sfx.ts');
ax = ins(ax, "  {file: 'room_tone', at: 0, dur: 112,", "  {file: 'page', at: 6.1, vol: 0.2},\n  {file: 'page', at: 36.1, vol: 0.2},\n  {file: 'page', at: 58.1, vol: 0.2},\n  {file: 'tea', at: 21.1, dur: 2.0, vol: 0.18, fadeOut: 0.3},\n  {file: 'tea', at: 45.1, dur: 2.0, vol: 0.18, fadeOut: 0.3},\n  {file: 'sigh', at: 8.8, dur: 2.2, vol: 0.2, rate: 1.1, fadeOut: 0.4},\n  {file: 'room_tone', at: 0, dur: 112,", 'act1 sfx');
fs.writeFileSync('src/scenes/act1Sfx.ts', ax);

// ---------------- S04 Green's chair ----------------
let s4 = rd('src/scenes/S04Day5.tsx');
s4 = sub(s4, /frames=\{\[\{src: 'FL_G1', at: 0\}, \{src: 'FL_G5'[^\n]*\n/, "frames={[{src: 'FL_G1', at: 0}, {src: 'FL_G1p', at: S(3.8), fade: 10}, {src: 'FL_G1', at: S(5.4), fade: 10}, {src: 'FL_G1s', at: S(8.6), fade: 14}, {src: 'FL_G1', at: S(12.4), fade: 14}, {src: 'FL_G1p', at: S(14.4), fade: 10}, {src: 'FL_G5', at: S(16.5), fade: 20}, {src: 'FL_G1', at: S(19.6), fade: 20}, {src: 'FL_G1c', at: S(22.0), fade: 14}, {src: 'FL_G1p', at: S(25.0), fade: 10}]}\n", 's04 green');
fs.writeFileSync('src/scenes/S04Day5.tsx', s4);

// ---------------- S05 living room ----------------
let s5 = rd('src/scenes/S05Day21.tsx');
s5 = sub(s5, /const RED_SEQ: SeqFrame\[\] = \[[\s\S]*?\n\];/, `const RED_SEQ: SeqFrame[] = [
  {src: 'FL_L0', at: 0},
  {src: 'FL_L0b', at: S(4.0), fade: 10}, // irritated glance
  {src: 'FL_L0', at: S(7.0), fade: 10},
  {src: 'FL_L1c', at: S(9.6), fade: 10}, // his mother appears, he ignores her
  {src: 'FL_L1', at: S(11.8), fade: 8},
  {src: 'FL_L2', at: S(13.6), fade: 5}, // the snap
  {src: 'FL_L3', at: S(17.4), fade: 16}, // she is gone, he is alone
];`, 's05 red');
s5 = ins(s5, "{file: 'door', at: 10.2, dur: 2.7,", "{file: 'door', at: 8.6, dur: 2.7,", 's05 sfx');
fs.writeFileSync('src/scenes/S05Day21.tsx', s5);

// ---------------- S06 ----------------
let s6 = rd('src/scenes/S06Spreads.tsx');
s6 = ins(s6, "frames={[{src: 'FL_OF1', at: 0}, {src: 'FL_OF2', at: S(5.4), fade: 10}]}", "frames={[{src: 'FL_OF1', at: 0}, {src: 'FL_OF3', at: S(2.8), fade: 10}, {src: 'FL_OF2', at: S(5.4), fade: 10}, {src: 'FL_OF1', at: S(8.0), fade: 10}]}", 's06');
fs.writeFileSync('src/scenes/S06Spreads.tsx', s6);

// ---------------- S07 ----------------
let s7 = rd('src/scenes/S07Day90.tsx');
s7 = sub(s7, /const RED = \[\{src: 'FL_R6', at: 0\}\];/, `const RED = [
  {src: 'FL_R6', at: 0},
  {src: 'FL_R10', at: S(6.0), fade: 14},
  {src: 'FL_R6', at: S(9.0), fade: 14},
  {src: 'FL_R5', at: S(14.0), fade: 14},
  {src: 'FL_R10', at: S(20.0), fade: 14},
  {src: 'FL_R6', at: S(24.0), fade: 14},
  {src: 'FL_R7', at: S(30.0), fade: 12},
  {src: 'FL_R6', at: S(33.0), fade: 16},
];`, 's07 red');
s7 = sub(s7, /const GREEN = \[[^\n]*\n/, `const GREEN = [
  {src: 'FL_G1', at: 0},
  {src: 'FL_G12', at: S(17.5), fade: 44}, // the stack and the notes appear
  {src: 'FL_G13', at: S(22.0), fade: 14},
  {src: 'FL_G14', at: S(26.5), fade: 14},
  {src: 'FL_G13', at: S(30.0), fade: 14},
  {src: 'FL_G15', at: S(32.6), fade: 14},
];
`, 's07 green');
s7 = ins(s7, "import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\nimport {PropPop} from '../components/PropPop';", 's07 imp');
s7 = ins(s7, 'glowAt={[1450, 700]} />', `glowAt={[1450, 700]}>
      <PropPop src="props/phone-lit" x={1290} y={340} w={90} from={5.4} to={9.0} />
      <PropPop src="props/phone-lit" x={1430} y={340} w={90} from={5.9} to={9.0} />
      <PropPop src="props/phone-lit" x={1570} y={340} w={90} from={6.4} to={9.0} />
      <PropPop src="props/phone-lit" x={1710} y={340} w={90} from={6.9} to={9.0} />
      <PropPop src="fx/sparkle" x={365} y={400} w={90} from={24.8} to={27.0} />
    </DualRoom>`, 's07 props');
fs.writeFileSync('src/scenes/S07Day90.tsx', s7);

// ---------------- S08 ----------------
let s8 = rd('src/scenes/S08Low.tsx');
s8 = sub(s8, /const FRAMES = \[[\s\S]*?\n\];/, `const FRAMES = [
  {src: 'FL_BL1', at: 0},
  {src: 'FL_BL4', at: S(5.0), fade: 12},
  {src: 'FL_BL1', at: S(8.6), fade: 12},
  {src: 'FL_BL5', at: S(12.0), fade: 14},
  {src: 'FL_BL4', at: S(15.4), fade: 12},
  {src: 'FL_BL1', at: S(18.4), fade: 12},
  {src: 'FL_BL6', at: S(20.2), fade: 14},
  {src: 'FL_BL2', at: S(22.5), fade: 22},
  {src: 'FL_BL3', at: S(29.5), fade: 26},
];`, 's08');
fs.writeFileSync('src/scenes/S08Low.tsx', s8);

// ---------------- S10 ----------------
let s10 = rd('src/scenes/S10Day365.tsx');
s10 = ins(s10, 'export const GREEN_FINAL', `const G10 = [
  {src: 'FL_G12', at: 0},
  {src: 'FL_G13', at: S(8.0), fade: 14},
  {src: 'FL_G15', at: S(12.0), fade: 14},
  {src: 'FL_G13', at: S(16.0), fade: 14},
  {src: 'FL_G12', at: S(22.0), fade: 14},
];
const R10 = [
  {src: 'FL_R8', at: 0},
  {src: 'FL_R11', at: S(6.0), fade: 14},
  {src: 'FL_R8', at: S(11.0), fade: 14},
  {src: 'FL_R11', at: S(16.0), fade: 14},
  {src: 'FL_R8', at: S(22.0), fade: 14},
];
export const GREEN_FINAL`, 's10');
s10 = ins(s10, "<DualRoom green={GREEN_FINAL} red={RED_FINAL} cam={CAM} greenBlink={{twins: {}, seed: 's10g'}} glowAt={[1290, 640]} />", `<DualRoom green={G10} red={R10} cam={CAM} glowAt={[1290, 640]}>
      <PropPop src="props/book-stack" x={560} y={820} w={150} from={10.8} to={14.0} />
      <PropPop src="props/phone-lit" x={1390} y={330} w={110} from={15.6} to={18.6} />
    </DualRoom>`, 's10 use');
s10 = ins(s10, "import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\nimport {PropPop} from '../components/PropPop';", 's10 imp');
fs.writeFileSync('src/scenes/S10Day365.tsx', s10);

// ---------------- S11 ----------------
let s11 = rd('src/scenes/S11Turn.tsx');
s11 = sub(s11, /const FRAMES = \[[\s\S]*?\n\];/, `const FRAMES = [
  {src: 'FL_RS1', at: 0},
  {src: 'FL_RS2', at: S(3.2), fade: 12},
  {src: 'FL_RS2b', at: S(7.2), fade: 14},
  {src: 'FL_RS3', at: S(10.8), fade: 12},
  {src: 'FL_RS4', at: S(13.4), fade: 14},
  {src: 'FL_RS5', at: S(16.4), fade: 12},
];`, 's11');
s11 = ins(s11, "import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\nimport {PropPop} from '../components/PropPop';", 's11 imp');
s11 = ins(s11, '        <Glow x={1300} y={560} r={600}', '        <PropPop src="fx/bulb" x={1480} y={400} w={120} from={14.0} to={16.6} />\n        <Glow x={1300} y={560} r={600}', 's11 props');
fs.writeFileSync('src/scenes/S11Turn.tsx', s11);

// ---------------- S12 ----------------
let s12 = rd('src/scenes/S12End.tsx');
s12 = ins(s12, "import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\nimport {PropPop} from '../components/PropPop';", 's12 imp');
s12 = ins(s12, '<DualRoom green={GREEN_FINAL} red={RED_FINAL} cam={CAM} glowAt={[1290, 640]} />', `<DualRoom green={GREEN_FINAL} red={RED_FINAL} cam={CAM} glowAt={[1290, 640]}>
      <PropPop src="props/phone-lit" x={1470} y={330} w={150} from={3.6} to={8.0} />
      <PropPop src="props/book-open" x={380} y={330} w={170} from={6.6} to={10.5} />
    </DualRoom>`, 's12');
fs.writeFileSync('src/scenes/S12End.tsx', s12);
console.log('done');
