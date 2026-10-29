// rewrites the "VIDEO 2" section of CLAUDE.md after the pivot to the Same Man look (one-off)
const fs = require('fs');
let s = fs.readFileSync('CLAUDE.md', 'utf8');
const a = s.indexOf('# VIDEO 2:'), b = s.indexOf('# (Older) Project');
const sec = [
  '# VIDEO 2: "Two Fathers. Same Salary. 20 Years Later." (comp TwoFathers, src/fathers/)',
  '8:10 (14,700 frames), from the user\'s plan PDF ("Competitor-Format Plan"): cold open Sunday 8:00 at 65 (only Sam\'s phone rings), rewind "30 YEARS EARLIER", the 6:00 PM laptops (MONEY vs TIME), gift pile vs photo wall,',
  'ages 5/10/15/16-20/25/65, split screen ONLY for the worst night and Friday morning, Adam is in no photo until the final freeze. Narration public/audio/two-fathers.mp3 (3:36) placed UNCHANGED in 20 pieces',
  '(src/fathers/timeline.ts, P = the plan\'s voiceover timeline); data/narration.srt + captions.json (node scripts/srt-fathers.cjs). The dialogue lines are recorded, so no speech bubbles.',
  '**LOOK = EXACTLY THE SAME AS SAME MAN. The user rejected a first attempt in a warm flat-illustration/serif style ("not even close") and asked for proper animations and the same character theme, same style, different story.**',
  'So Two Fathers uses the Same Man engine: glass bubble-head characters (src/same2d/Char.tsx front rig, SideChar.tsx three-quarter side rig with real legs and walk cycle), extended additively with the looks',
  'adam (navy tee + red tie, greys by the grey prop), sam (rust tee + beard), leo (blue, spiky), max (green, curls), aunt (teal, bun); the digital text system (src/same2d/fx.tsx: AnimText pop/slam/whisper(typing)/title(HUD), IconTag, pills;',
  'AgeTag and Counter in src/fathers/fx.tsx copy the Same Man day-tag look), Cinema light, Shafts, Dust, Bridge, SpeedLines, whips, flashes, shake, film grain, the dark cinematic Stage (Stage.tsx, depth blur, rim light) and the Sfx3 sound system with ducking.',
  'Inserts use the dark bokeh InsertBG with white-gloved hands.',
  'Files: People.tsx = adapter (who/age/pose -> Char or SideChar; pose tables SIDE and FRONT; CHAR_K = 0.85 size factor; Baby), sets.tsx + props.tsx (re-skinned to the Same palette by scripts/restyle-fathers.cjs: darker, cool low-saturation colours -> blue-violet, thin navy outlines),',
  'inserts.tsx (phones, banking, gallery, payslip, SundayFlip, Polaroid, EndCard), kit.tsx (shot vocabulary: Z camera, stand/sit/Pe, SC.* scene wrappers, Split), shots1.tsx (0-215 s) and shots2.tsx (215-490 s) = the shot lists [startSec, fx, renderer], Fathers.tsx (main comp, sound, music).',
  'Sound: public/sfx4/ (15 new ElevenLabs effects, scripts/el-sfx4.mjs) + the existing sfx3/sfx; music beds tf_* in public/music (scripts/el-music-fathers.mjs). Both were generated with the user\'s OK ("choose whatever suits best").',
  'Check the look without Studio: node scripts/still-fathers.cjs 1.2 41.5 ... (half-size stills in out/stills/). Do NOT run it, tsc or Studio while a long render is going (it crashed a chunk once).',
  'Status: all 15 beats built on the Same Man rig; 54 stills across the whole timeline render without errors; type-check clean. The user has NOT yet reviewed it in Studio.',
  'To polish: more per-shot action and camera work, hospital/party/street palettes, auditorium framing, faces, visible greying of the glass hair.',
  '',
  '---',
  '',
].join('\n');
fs.writeFileSync('CLAUDE.md', s.slice(0, a) + sec + s.slice(b));
console.log('CLAUDE.md updated');
