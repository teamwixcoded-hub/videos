const fs = require('fs');
const rd = (p) => fs.readFileSync(p, 'utf8');
const edit = (file, pairs) => {
  let s = rd(file);
  for (const [a, b] of pairs) { if (!s.includes(a)) { console.log('MISSING', file, a.slice(0, 60)); continue; } s = s.replace(a, () => b); }
  fs.writeFileSync(file, s);
};
const IMP = "import {frameCues, camCues} from '../components/autoSfx';\n";
const withImp = (s) => s.replace("import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\n" + IMP);

// Act1: two characters + camera
edit('src/scenes/Act1.tsx', [
  ["import {SfxTrack} from '../components/Sfx';", "import {SfxTrack} from '../components/Sfx';\n" + IMP],
  ['<SfxTrack cues={ACT1_SFX} />', '<SfxTrack cues={[...ACT1_SFX, ...frameCues(RED, 0), ...frameCues(GREEN, 1), ...camCues(CAM, ACT1_SFX)]} />'],
]);
// S07
edit('src/scenes/S07Day90.tsx', [
  ["import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\n" + IMP],
  ['<SfxTrack cues={SFX} />', '<SfxTrack cues={[...SFX, ...frameCues(RED, 0), ...frameCues(GREEN, 1), ...camCues(CAM, SFX)]} />'],
]);
// S09
edit('src/scenes/S09Result.tsx', [
  ["import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\n" + IMP],
  ['<SfxTrack cues={SFX} />', '<SfxTrack cues={[...SFX, ...frameCues(FRAMES, 0), ...camCues(CAM, SFX)]} />'],
]);
// S10
edit('src/scenes/S10Day365.tsx', [
  ["import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\n" + IMP],
  ['<SfxTrack cues={SFX} />', '<SfxTrack cues={[...SFX, ...frameCues(G10, 0), ...frameCues(R10, 1), ...camCues(CAM, SFX)]} />'],
]);
// S11
edit('src/scenes/S11Turn.tsx', [
  ["import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\n" + IMP],
  ['<SfxTrack cues={SFX} />', '<SfxTrack cues={[...SFX, ...frameCues(FRAMES, 0)]} />'],
]);
// S12
edit('src/scenes/S12End.tsx', [
  ["import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\n" + IMP],
  ['<SfxTrack cues={SFX} />', '<SfxTrack cues={[...SFX, ...camCues(CAM, SFX)]} />'],
]);
// S08
edit('src/scenes/S08Low.tsx', [
  ["import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\n" + IMP],
  ['<SfxTrack cues={SFX} />', '<SfxTrack cues={[...SFX, ...frameCues(FRAMES, 0)]} />'],
]);
// S05: both sequences
edit('src/scenes/S05Day21.tsx', [
  ["import {SfxTrack, Cue} from '../components/Sfx';", "import {SfxTrack, Cue} from '../components/Sfx';\n" + IMP],
  ['<SfxTrack cues={SFX} />', '<SfxTrack cues={[...SFX, ...frameCues(RED_SEQ, 0), ...frameCues(GREEN_SEQ, 1)]} />'],
]);
console.log('done');
