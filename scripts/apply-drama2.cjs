const fs = require('fs');
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log('MISSING', file, String(a).slice(0, 80)); continue; }
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(file, s);
};
edit('src/scenes/S09Result.tsx', [
  ["  focus(S(16.0), 1000, 580, 1.75), // the handshake\n  focus(S(22.0), 1040, 540, 1.9), // his quiet smile\n  focus(S(30), 1040, 540, 2.0),",
   "  focus(S(15.4), 1000, 585, 1.55), // the handshake begins: a slow, steady push-in\n  focus(S(21.2), 1000, 570, 2.1),\n  focus(S(22.8), 1040, 540, 2.05), // his quiet smile\n  focus(S(30), 1040, 540, 2.35),"],
  ["export const S09_FRAMES = S(30);", "export const S09_FRAMES = S(30);\n\n// slow motion on the handshake: the picture runs at 50% for 2.8 s, then catches up before his smile\nconst WARP: Warp = {a: 15.6, b: 18.4, speed: 0.5, ramp: 0.5, catchUp: 3.0};"],
  ["    <Shot grade=\"day\" frames={FRAMES} cam={CAM}>\n      <Bloom />\n    </Shot>", "    <SlowMo warp={WARP}>\n      <Shot grade=\"day\" frames={FRAMES} cam={CAM}>\n        <Bloom />\n      </Shot>\n    </SlowMo>\n    <DepthBlur from={15.6} to={21.4} amount={7} y={50} />"],
  ["<SfxTrack cues={[...SFX, ...frameCues(FRAMES, 0)]} />", "<SfxTrack cues={warpCues([...SFX, ...frameCues(FRAMES, 0)], WARP)} />"],
]);
// S12: a slow push toward the gap between the two men, with a slight tilt, building to the question
edit('src/scenes/S12End.tsx', [
  ["const CAM = [focus(0, 960, 560, 1.12), focus(S(9), 960, 560, 1.0), focus(S(14), 960, 560, 0.98)];",
   "// a slow push toward the empty space between the two men, easing into a slight tilt as the question lands\nconst CAM = [{...focus(0, 960, 570, 1.0), rotate: 0}, {...focus(S(8.4), 960, 565, 1.28), rotate: -0.8}, {...focus(S(14), 960, 560, 1.42), rotate: -1.2}];"],
]);
