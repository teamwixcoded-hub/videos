const fs = require('fs');
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log('MISSING', file, String(a).slice(0, 80)); continue; }
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(file, s);
};

// ---------------- S11: the phone goes face down ----------------
edit('src/scenes/S11Turn.tsx', [
  ["import {PropPop} from '../components/PropPop';", "import {PropPop} from '../components/PropPop';\nimport {DepthBlur, SlowMo, Warp, warpCues, warpFrame} from '../components/Drama';"],
  ["export const S11_FRAMES = S(27);", "export const S11_FRAMES = S(27);\n\n// slow motion on the phone going face down: the picture slows to 40% for ~2.6 s, then catches up\nconst WARP: Warp = {a: 10.0, b: 12.6, speed: 0.4, ramp: 0.5, catchUp: 3.0};\n\n// camera: a slow, deliberate push onto his hands as the phone turns over, then back out to the book\nconst CAM11 = [\n  focus(0, 1250, 560, 1.4),\n  focus(S(9.4), 1250, 590, 1.5),\n  focus(S(11.8), 1245, 690, 2.4),\n  focus(S(14.6), 1260, 570, 1.7),\n  focus(S(27), 1260, 550, 1.8),\n];"],
  ["  const phone = interpolate(frame, [S(10.2), S(11.4)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (0.8 + random(`t-${Math.floor(frame / 2)}`) * 0.2);",
   "  const wf = warpFrame(WARP, frame); // the phone's glow follows the slowed picture\n  const phone = interpolate(wf, [S(10.2), S(11.4)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (0.8 + random(`t-${Math.floor(frame / 2)}`) * 0.2);"],
  ["      <Camera keys={[focus(0, 1250, 560, 1.4), focus(S(12), 1260, 560, 1.6), focus(S(27), 1260, 550, 1.8)]} handheld={0.45}>", "      <SlowMo warp={WARP}>\n      <Camera keys={CAM11} handheld={0.45}>"],
  ["      </Camera>\n      <PhotoCard", "      </Camera>\n      </SlowMo>\n      <DepthBlur from={10.0} to={14.6} amount={9} y={56} />\n      <PhotoCard"],
  ["<SfxTrack cues={[...SFX, ...frameCues(FRAMES, 0)]} />", "<SfxTrack cues={warpCues([...SFX, ...frameCues(FRAMES, 0)], WARP)} />"],
]);

// ---------------- S09: the handshake ----------------
edit('src/scenes/S09Result.tsx', [
  ["import {frameCues, camCues} from '../components/autoSfx';", "import {frameCues, camCues} from '../components/autoSfx';\nimport {DepthBlur, SlowMo, Warp, warpCues} from '../components/Drama';"],
  [/focus\(S\(16\.0\), 1000, 580, 1\.75\), \/\/ the handshake\n  focus\(S\(22\.0\), 1040, 540, 1\.9\), \/\/ his quiet smile\n  focus\(S\(30\), 1040, 540, 2\.0\),/.source, ''],
]);
