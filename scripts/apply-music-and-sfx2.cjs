const fs = require('fs');
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) { console.log('MISSING', file, String(a).slice(0, 70)); continue; } s = s.replace(a, () => b); }
  fs.writeFileSync(file, s);
};

// ---- Music component ----
fs.writeFileSync('src/components/Music.tsx', `import React from 'react';
import {Audio, staticFile, useCurrentFrame} from 'remotion';

// A music bed for one scene. \`startAt\` = seconds into the track (so consecutive scenes continue the same piece).
// Fades in and out over the scene so beds crossfade across scene transitions. Kept quiet: the story speaks first.
export const Music: React.FC<{track: string; startAt?: number; frames: number; vol?: number; fadeIn?: number; fadeOut?: number}> = ({track, startAt = 0, frames, vol = 0.2, fadeIn = 36, fadeOut = 40}) => {
  const frame = useCurrentFrame();
  void frame;
  return (
    <Audio
      src={staticFile(\`music/\${track}.mp3\`)}
      startFrom={Math.round(startAt * 30)}
      volume={(f) => vol * Math.min(1, f / fadeIn) * Math.min(1, Math.max(0, (frames - f) / fadeOut))}
    />
  );
};
`);

// ---- Video01: assign beds ----
edit('src/Video01.tsx', [
  ["import {whip, zoomThrough} from './transitions';", "import {whip, zoomThrough} from './transitions';\nimport {Music} from './components/Music';"],
  ["const scenes: {C: React.FC; frames: number}[] = [", "type Bed = {track: string; startAt?: number; vol?: number};\nconst scenes: {C: React.FC; frames: number; bed?: Bed}[] = ["],
  ["  {C: Act1, frames: ACT1_FRAMES}, // S01 · S02 the choice · S03 night one", "  {C: Act1, frames: ACT1_FRAMES, bed: {track: 'wonder'}}, // S01 · S02 the choice · S03 night one"],
  ["  {C: S04Day5, frames: S04_FRAMES},", "  {C: S04Day5, frames: S04_FRAMES, bed: {track: 'routine'}},"],
  ["  {C: S05Day21, frames: S05_FRAMES},", "  {C: S05Day21, frames: S05_FRAMES, bed: {track: 'routine', startAt: 31}},"],
  ["  {C: S06Spreads, frames: S06_FRAMES},", "  {C: S06Spreads, frames: S06_FRAMES, bed: {track: 'hope'}},"],
  ["  {C: S07Day90, frames: S07_FRAMES},", "  {C: S07Day90, frames: S07_FRAMES, bed: {track: 'hope', startAt: 27}},"],
  ["  {C: S08Low, frames: S08_FRAMES},", "  {C: S08Low, frames: S08_FRAMES, bed: {track: 'low'}},"],
  ["  {C: S09Result, frames: S09_FRAMES},", "  {C: S09Result, frames: S09_FRAMES, bed: {track: 'hope', startAt: 50}},"],
  ["  {C: S10Day365, frames: S10_FRAMES},", "  {C: S10Day365, frames: S10_FRAMES, bed: {track: 'resolve'}},"],
  ["  {C: S11Turn, frames: S11_FRAMES},", "  {C: S11Turn, frames: S11_FRAMES, bed: {track: 'resolve', startAt: 17}},"],
  ["  {C: S12End, frames: S12_FRAMES},", "  {C: S12End, frames: S12_FRAMES, bed: {track: 'resolve', startAt: 34}},"],
  ["{scenes.flatMap(({C, frames}, i) => {", "{scenes.flatMap(({C, frames, bed}, i) => {"],
  ["            <C />\n", "            <C />\n            {bed && <Music track={bed.track} startAt={bed.startAt} frames={frames} vol={bed.vol ?? 0.2} />}\n"],
]);

// ---- Snd exported so every text/graphic component can use it ----
edit('src/components/Type.tsx', [["const Snd: React.FC<", "export const Snd: React.FC<"]]);

// KText: a soft tick per word
edit('src/components/KText.tsx', [
  ["import {HEAD_FONT, BODY_FONT} from '../fonts';", "import {HEAD_FONT, BODY_FONT} from '../fonts';\nimport {Snd} from './Type';"],
  ["  return (\n    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg)`, opacity: out, textAlign: 'center', width: 1700}}>",
   "  return (\n    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg)`, opacity: out, textAlign: 'center', width: 1700}}>\n      {words.map((_, i) => <Snd key={`s${i}`} file=\"pop_a\" at={at + i * stagger} vol={0.2} rate={0.85 + i * 0.07} frames={12} />)}"],
]);
// SlamLabel
edit('src/components/KText.tsx', [
  ["  const scale = interpolate(s, [0, 1], [2.6, 1]);\n  const o = interpolate(t, [0, 4], [0, 1], {extrapolateRight: 'clamp'});\n  return (\n    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${scale})`, opacity: o,",
   "  const scale = interpolate(s, [0, 1], [2.6, 1]);\n  const o = interpolate(t, [0, 4], [0, 1], {extrapolateRight: 'clamp'});\n  return (\n    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${scale})`, opacity: o,"],
]);

// Explain components
let e = fs.readFileSync('src/components/Explain.tsx', 'utf8');
const rep = (a, b) => { if (!e.includes(a)) { console.log('MISSING Explain', a.slice(0, 70)); return; } e = e.replace(a, () => b); };
rep("import {S, clamp01, easeOut} from '../easing';", "import {S, clamp01, easeOut} from '../easing';\nimport {Snd} from './Type';");
// NameTag
rep("  const {live, o, t} = useWin(from, to, 6, 10);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 10, stiffness: 160, mass: 0.7}});\n  return (\n    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${s})`",
    "  const {live, o, t, a} = useWin(from, to, 6, 10);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 10, stiffness: 160, mass: 0.7}});\n  return (\n    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${s})`");
rep("      <div style={{display: 'inline-block', background: color, color: '#1a1210', border: `5px solid ${INK}`, borderRadius: 16, padding: '6px 26px'", "      <Snd file=\"pop_c\" at={a} vol={0.26} frames={14} />\n      <div style={{display: 'inline-block', background: color, color: '#1a1210', border: `5px solid ${INK}`, borderRadius: 16, padding: '6px 26px'");
// ChecklistCard: tick per row
rep("  const {live, o, t, frame} = useWin(from, to, 10, 14);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 13, stiffness: 110}});\n  return (\n    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translateX(-50%) scale(${0.92 + 0.08 * s})`, opacity: o, pointerEvents: 'none'}}>",
    "  const {live, o, t, frame, a} = useWin(from, to, 10, 14);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 13, stiffness: 110}});\n  return (\n    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translateX(-50%) scale(${0.92 + 0.08 * s})`, opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"whoosh\" at={a} vol={0.16} frames={22} />\n      {rows.map((r, i) => <Snd key={i} file={r.ok === false ? 'thump' : 'meter'} at={S(r.at)} vol={r.ok === false ? 0.22 : 0.26} rate={r.ok === false ? 1 : 0.92 + i * 0.12} frames={18} />)}");
// SectionBadge
rep("  const {live, o, t} = useWin(from, to, 8, 12);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 12, stiffness: 140}});\n  return (\n    <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `translateX(${(1 - s) * -80}px)`",
    "  const {live, o, t, a} = useWin(from, to, 8, 12);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 12, stiffness: 140}});\n  return (\n    <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `translateX(${(1 - s) * -80}px)`");
rep("      <div style={{width: 84, height: 84, borderRadius: '50%', background: '#7ee2a0'", "      <Snd file=\"pop_a\" at={a} vol={0.26} frames={14} />\n      <div style={{width: 84, height: 84, borderRadius: '50%', background: '#7ee2a0'");
// RewardChart
rep("  const {live, o, t} = useWin(from, to, 10, 14);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 14, stiffness: 100}});\n  const pw = w - 150", "  const {live, o, t, a} = useWin(from, to, 10, 14);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 14, stiffness: 100}});\n  const pw = w - 150");
rep("      <div style={{position: 'absolute', inset: 0, background: 'rgba(10,8,14,0.86)', border: `5px solid ${INK}`, borderRadius: 26, boxShadow: `0 10px 0 ${INK}`}} />\n      <div style={{position: 'absolute', left: 0, right: 0, top: 10, textAlign: 'center', fontFamily: CINE_FONT, fontSize: 56",
    "      <Snd file=\"whoosh\" at={a} vol={0.2} frames={24} />\n      <Snd file=\"scribble\" at={a + 12} vol={0.18} frames={30} rate={0.8} />\n      <Snd file=\"meter\" at={a + 62} vol={0.22} frames={18} />\n      <div style={{position: 'absolute', inset: 0, background: 'rgba(10,8,14,0.86)', border: `5px solid ${INK}`, borderRadius: 26, boxShadow: `0 10px 0 ${INK}`}} />\n      <div style={{position: 'absolute', left: 0, right: 0, top: 10, textAlign: 'center', fontFamily: CINE_FONT, fontSize: 56");
// ProgressBar
rep("  const {live, o, t} = useWin(from, to, 8, 12);\n  if (!live) return null;\n  const k = easeOut(clamp01(t / 50)) * fillTo;\n  return (\n    <div style={{position: 'absolute', left: x, top: y, width: w, transform: 'translateX(-50%)', opacity: o, pointerEvents: 'none'}}>",
    "  const {live, o, t, a} = useWin(from, to, 8, 12);\n  if (!live) return null;\n  const k = easeOut(clamp01(t / 50)) * fillTo;\n  return (\n    <div style={{position: 'absolute', left: x, top: y, width: w, transform: 'translateX(-50%)', opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"riser\" at={a} vol={0.12} frames={44} rate={1.2} />");
fs.writeFileSync('src/components/Explain.tsx', e);

// scenes had their own manual meter cues for these cards: remove to avoid doubling
edit('src/scenes/S06Spreads.tsx', [["  // each benefit ticks on with a rising chime\n  ...[...WORK.map((r) => START[1] + 1.0 + r.at), ...MORN.map((r) => START[2] + 1.0 + r.at), ...PEOP.map((r) => START[3] + 1.0 + r.at)].map((at, i): Cue => ({file: 'meter', at, vol: 0.26, rate: 0.9 + (i % 3) * 0.12})),\n", ""]]);
edit('src/scenes/S09Result.tsx', [["  {file: 'meter', at: 9.8, vol: 0.24}, {file: 'meter', at: 11.4, vol: 0.24, rate: 1.1}, {file: 'meter', at: 13.0, vol: 0.24, rate: 1.2},\n", ""]]);
edit('src/scenes/S10Day365.tsx', [["  ...[9.6, 10.6, 11.8, 12.8, 14.0, 15.0].map((at, i): Cue => ({file: 'meter', at, vol: 0.26, rate: 0.9 + (i % 3) * 0.12})),\n", ""]]);

// Props: PropPop and PhotoCard, BigCounter
let p = fs.readFileSync('src/components/PropPop.tsx', 'utf8');
p = p.replace("import {S} from '../easing';", "import {S} from '../easing';\nimport {Snd} from './Type';");
p = p.replace("    <div style={{position: 'absolute', left: x, top: y + bob + rise, width: w,", "    <div style={{position: 'absolute', left: x, top: y + bob + rise, width: w,");
p = p.replace("      <Img src={staticFile(`images/${src}.png`)} style={{width: '100%', height: 'auto', display: 'block'}} />", "      <Snd file={src.startsWith('fx/') ? 'pop_c' : 'pop_a'} at={a} vol={0.16} rate={src.includes('zzz') ? 0.8 : 1} frames={12} />\n      <Img src={staticFile(`images/${src}.png`)} style={{width: '100%', height: 'auto', display: 'block'}} />");
fs.writeFileSync('src/components/PropPop.tsx', p);
let p5 = fs.readFileSync('src/components/Props5.tsx', 'utf8');
p5 = p5.replace("import {clamp01, easeInOut} from '../easing';", "import {clamp01, easeInOut} from '../easing';\nimport {Snd} from './Type';");
p5 = p5.replace("  const f = frame - from;\n  const pop = spring({frame: f, fps, config: {damping: 14, stiffness: 100}});", "  const f = frame - from;\n  const pop = spring({frame: f, fps, config: {damping: 14, stiffness: 100}});");
p5 = p5.replace("  return (\n    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * pop})`, opacity: Math.min(1, pop * 1.5) * gone, textAlign: 'center'}}>", "  return (\n    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * pop})`, opacity: Math.min(1, pop * 1.5) * gone, textAlign: 'center'}}>\n      <Snd file=\"pop_a\" at={from} vol={0.24} frames={12} />\n      <Snd file=\"riser\" at={from + 4} vol={0.14} frames={Math.min(duration + 6, 60)} rate={1.3} />\n      <Snd file=\"meter\" at={from + 8 + duration} vol={0.26} frames={16} />");
p5 = p5.replace("  return (\n    <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, opacity: enter * leave, transform: `scale(${0.85 + 0.15 * enter}) rotate(${-4 + 3 * enter}deg)`", "  return (\n    <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, opacity: enter * leave, transform: `scale(${0.85 + 0.15 * enter}) rotate(${-4 + 3 * enter}deg)`");
p5 = p5.replace("      <div style={{position: 'absolute', inset: 0, background: '#fff', border: `7px solid ${INK}`, borderRadius: 18, padding: 16, paddingBottom: 56}}>", "      <Snd file=\"whoosh\" at={from} vol={0.2} frames={24} />\n      <Snd file=\"pop_b\" at={from + 12} vol={0.24} frames={14} />\n      <div style={{position: 'absolute', inset: 0, background: '#fff', border: `7px solid ${INK}`, borderRadius: 18, padding: 16, paddingBottom: 56}}>");
fs.writeFileSync('src/components/Props5.tsx', p5);
console.log('done');
