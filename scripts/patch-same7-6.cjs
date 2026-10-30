const fs = require('fs');
let s = fs.readFileSync('src/same7/Same7.tsx', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('MISSING ' + a.slice(0, 70)); s = s.replace(a, b); };
r("import {B, K, WIDE, camS, camR, sFace, rFace, sP, rB, D365, gaunt, DoubleVision, R, Ctx} from '../same2d/Same2D';", "import {B, K, WIDE, camS, camR, sFace, rFace, sP, rB, D365, gaunt, DoubleVision, R, Ctx, bedScene, camOf, kit, bath} from '../same2d/Same2D';\nimport {buildPart2} from '../same2d/part2';\nimport {buildActs, ACT_POPS, ACT_STAMPS, ACT_TAGS, ACT_BUBBLES, ACT_CUES, ACT_MUSIC, PAGES} from './acts';");
r("import {IconTag, SpeedLines, Bridge, Dust, Shafts, Cinema, ramp, bell} from '../same2d/fx';", "import {IconTag, SpeedLines, Bridge, Dust, Shafts, Cinema, ramp, bell, Bubble, BigCounter} from '../same2d/fx';");
r("import {FPS, AUDIO_FILE, T, speechDuck} from './timeline';", "import {FPS, AUDIO_FILE, T, TA, FULL_TOTAL, speechDuck} from './timeline';");
r('export const BUILT_END = 64.2;', 'export const BUILT_END = FULL_TOTAL;');
r('const LIST: [number, Fx | undefined, R][] = [', 'const LIST1: [number, Fx | undefined, R][] = [');
r('type Shot = {from: number; to: number; fx?: Fx; C: R};', `// the rest of the film (Acts 4 to 16) lives in acts.tsx and reuses the scene makers published by part2
const API = {B, bedScene, sP, rB, WIDE, camS, camR, sFace, rFace, K, camOf, kit, bath};
buildPart2(API as any);
const LIST: [number, Fx | undefined, R][] = [...LIST1, ...buildActs({B, K, WIDE, camS, camR, sFace, rFace, sP, rB, D365, gaunt, kit, bath, bedScene})];
type Shot = {from: number; to: number; fx?: Fx; C: R};`);
r('const TYPE_RAW: TW[] = [', 'const TYPE_FIRST: TW[] = [');
r('const STAMPS_RAW: StampT[] = [', 'const STAMPS_FIRST: StampT[] = [');
r('// the lower third is one lane', 'const TYPE_RAW: TW[] = [...TYPE_FIRST, ...ACT_POPS], STAMPS_RAW: StampT[] = [...STAMPS_FIRST, ...ACT_STAMPS];\n// the lower third is one lane');
r("{file: 'amb_night_room', at: 0, dur: BUILT_END, loop: true, vol: 0.13, fadeIn: 1.5, fadeOut: 1.2},", "{file: 'amb_night_room', at: 0, dur: 64.2, loop: true, vol: 0.13, fadeIn: 1.5, fadeOut: 1.2},\n  ...ACT_CUES,");
r("const warm = t >= T('in the other'), grade = warm ? 'rgba(255,165,70,.14)' : 'rgba(70,115,185,.22)';", "const cold = t < T('in the other') || (t >= T('day 300') && t < T('day 360')) || (t >= T('and the man in bed') && t < TA('same man', 330)), warm = !cold, grade = warm ? 'rgba(255,165,70,.14)' : 'rgba(70,115,185,.22)';\n  const fadeOut = ramp(t, FULL_TOTAL - 0.9, FULL_TOTAL), pages = Math.round(10 + 40 * ramp(t, PAGES.from, PAGES.to)), pagesO = Math.min(ramp(t, PAGES.from, PAGES.from + 0.3), 1 - ramp(t, PAGES.to + 0.8, PAGES.to + 1.2));");
r('<SideTag t={t} from={T(\'in the other\')} to={T(\'in the other\') + 3.9} who="chair" />', `<SideTag t={t} from={T('in the other')} to={T('in the other') + 3.9} who="chair" />
      {ACT_TAGS.map((g) => <SideTag key={g.from} t={t} from={g.from} to={g.to} who={g.who} text={g.text} />)}
      {ACT_BUBBLES.map((b) => <Bubble key={b.from} t={t} from={b.from} to={b.to} text={b.text} x={b.x} y={b.y} />)}
      <BigCounter n={pages} o={pagesO} label="PAGES" />
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />`);
// the sound: the whole recording, the first two beds and the acts' beds
const m0 = s.indexOf('<Sequence from={0} durationInFrames={SAME7_FRAMES}><Audio');
if (m0 < 0) throw new Error('audio');
s = s.replace(/<Sequence from=\{Math\.round\(55\.5 \* FPS\)\} durationInFrames=\{Math\.round\(9 \* FPS\)\}><Music track="wonder"[^\n]*\n/, "<Sequence from={Math.round(55.5 * FPS)} durationInFrames={Math.round(9 * FPS)}><Music track=\"wonder\" frames={Math.round(9 * FPS)} vol={0.08} fadeIn={45} fadeOut={60} /></Sequence>\n      {ACT_MUSIC.map((m, i) => <Sequence key={'am' + i} from={Math.round(m.from * FPS)} durationInFrames={Math.round((m.to - m.from) * FPS)}><Music track={m.track} frames={Math.round((m.to - m.from) * FPS)} vol={m.vol} fadeIn={60} fadeOut={75} /></Sequence>)}\n");
fs.writeFileSync('src/same7/Same7.tsx', s);
