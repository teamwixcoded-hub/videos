const fs = require('fs');
let s = fs.readFileSync('src/components/Type.tsx', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) { console.log('MISSING', a.slice(0, 80)); return; } s = s.replace(a, () => b); };

rep("import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';",
  "import {AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';");
rep('const useWindow =', `// One sound that belongs to a piece of text. \`at\` is an absolute frame, \`frames\` its length.
const Snd: React.FC<{file: string; at: number; vol?: number; rate?: number; frames?: number}> = ({file, at, vol = 0.25, rate = 1, frames = 45}) => (
  <Sequence from={at} durationInFrames={frames}>
    <Audio src={staticFile(\`sfx/\${file}.mp3\`)} playbackRate={rate} volume={(f) => vol * Math.min(1, f / 2) * Math.min(1, (frames - f) / 8)} />
  </Sequence>
);

const useWindow =`);

// ChapterCard
rep("  const {live, o, t} = useWindow(from, to, 10, 14);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 14, stiffness: 120, mass: 0.9}});",
  "  const {live, o, t, a} = useWindow(from, to, 10, 14);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 14, stiffness: 120, mass: 0.9}});");
rep("    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>\n      <AbsoluteFill style={{background: 'rgba(6,5,10,0.42)'}} />",
  "    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>\n      <Snd file=\"chapter\" at={a} vol={0.3} frames={44} />\n      <AbsoluteFill style={{background: 'rgba(6,5,10,0.42)'}} />");

// CineTitle
rep("  const {live, o, t} = useWindow(from, to, 16, 16);\n  if (!live) return null;\n  const spread", "  const {live, o, t, a} = useWindow(from, to, 16, 16);\n  if (!live) return null;\n  const spread");
rep("      <Backing y={y} h={size * 2.4} o={0.55} />", "      <Snd file=\"titlehit\" at={a} vol={0.26} frames={40} />\n      <Backing y={y} h={size * 2.4} o={0.55} />");

// Typewriter: one key tap per letter
rep("  const {live, o, t, frame} = useWindow(from, to, 4, 10);\n  if (!live) return null;\n  const n = Math.min",
  "  const {live, o, t, frame, a} = useWindow(from, to, 4, 10);\n  if (!live) return null;\n  const n = Math.min");
rep("      <Backing y={y} h={size * 3} o={0.5} />\n      <div style={{position: 'absolute', left: x, top: y, transform: align === 'center'",
  "      <Backing y={y} h={size * 3} o={0.5} />\n      {text.split('').map((ch, i) => (ch === ' ' ? null : <Snd key={i} file=\"key\" at={a + Math.round((i / cps) * 30)} vol={0.1 + (i % 3) * 0.02} rate={0.92 + ((i * 7) % 5) * 0.04} frames={4} />))}\n      <div style={{position: 'absolute', left: x, top: y, transform: align === 'center'");

// StrikeSwap
rep("  const {live, o, frame} = useWindow(from, to, 8, 12);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const sw = S(swapAt);",
  "  const {live, o, frame, a} = useWindow(from, to, 8, 12);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const sw = S(swapAt);");
rep("    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: CINE_FONT, fontSize: size, letterSpacing: '0.08em'",
  "    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"titlehit\" at={a} vol={0.18} frames={36} />\n      <Snd file=\"strike\" at={sw - 6} vol={0.3} frames={22} />\n      <Snd file=\"pop_a\" at={sw + 4} vol={0.26} frames={14} rate={0.8} />\n      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: CINE_FONT, fontSize: size, letterSpacing: '0.08em'");

// Stamp
rep("  const {live, o, t} = useWindow(from, to, 3, 14);\n  if (!live) return null;\n  const k = interpolate",
  "  const {live, o, t, a} = useWindow(from, to, 3, 14);\n  if (!live) return null;\n  const k = interpolate");
rep("    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${k})`",
  "    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"stamp\" at={a + 5} vol={0.42} frames={30} />\n      <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${k})`");

// Versus
rep("  const {live, o, frame, t} = useWindow(from, to, 8, 12);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const sw = swapAt",
  "  const {live, o, frame, t, a} = useWindow(from, to, 8, 12);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const sw = swapAt");
rep("    <AbsoluteFill style={{opacity: o, pointerEvents: 'none', transform: `scale(${0.9 + 0.1 * s})`, transformOrigin: '50% 20%'}}>",
  "    <AbsoluteFill style={{opacity: o, pointerEvents: 'none', transform: `scale(${0.9 + 0.1 * s})`, transformOrigin: '50% 20%'}}>\n      <Snd file=\"titlehit\" at={a} vol={0.22} frames={36} />\n      {swapAt !== undefined && <Snd file=\"whoosh\" at={S(swapAt)} vol={0.26} frames={28} rate={1.1} />}");

// Annotation
rep("  const {live, o, t} = useWindow(from, to, 4, 12);\n  if (!live) return null;\n  const circ",
  "  const {live, o, t, a} = useWindow(from, to, 4, 12);\n  if (!live) return null;\n  const circ");
rep("    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))'}}>",
  "    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"scribble\" at={a} vol={0.3} frames={30} />\n      <Snd file=\"scribble\" at={a + 22} vol={0.22} frames={26} rate={1.15} />\n      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))'}}>");

// NumberMorph
rep("  const {live, o, frame} = useWindow(from, to, 8, 12);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const m = S(morphAt);",
  "  const {live, o, frame, a} = useWindow(from, to, 8, 12);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const m = S(morphAt);");
rep("    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Backing y={y + size * 0.5} h={size * 2.2} o={0.5} />",
  "    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"tick\" at={a} vol={0.24} frames={14} />\n      <Snd file=\"riser\" at={m - 24} vol={0.2} frames={26} />\n      <Snd file=\"boom\" at={m} vol={0.3} frames={30} rate={1.1} />\n      <Backing y={y + size * 0.5} h={size * 2.2} o={0.5} />");

// Echo
rep("  const {live, o, t} = useWindow(from, to, 8, 12);\n  if (!live) return null;\n  return (\n    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      {Array.from({length: copies})",
  "  const {live, o, t, a} = useWindow(from, to, 8, 12);\n  if (!live) return null;\n  return (\n    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"whoosh\" at={a} vol={0.2} frames={30} rate={0.8} />\n      {Array.from({length: copies})");

// Glitch
rep("  const {live, o, frame, t} = useWindow(from, to, 4, 10);\n  if (!live) return null;\n  const hit",
  "  const {live, o, frame, t, a} = useWindow(from, to, 4, 10);\n  if (!live) return null;\n  const hit");
rep("    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `translateX(${jx}px)`",
  "    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"glitch\" at={a} vol={0.24} frames={14} />\n      <Snd file=\"glitch\" at={a + 36} vol={0.2} frames={14} rate={0.9} />\n      <Snd file=\"glitch\" at={a + 72} vol={0.2} frames={14} rate={1.1} />\n      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `translateX(${jx}px)`");

// Scoreboard
rep("  const {live, o, t} = useWindow(from, to, 8, 14);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 13, stiffness: 110}});\n  const bump",
  "  const {live, o, t, a} = useWindow(from, to, 8, 14);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 13, stiffness: 110}});\n  const bump");
rep("    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${0.9 + 0.1 * s})`}}>\n        <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 48",
  "    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"whoosh\" at={a} vol={0.22} frames={26} />\n      <Snd file=\"meter\" at={a + 18} vol={0.3} frames={20} rate={1.2} />\n      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${0.9 + 0.1 * s})`}}>\n        <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 48");

// Whisper
rep("  const {live, o, t} = useWindow(from, to, 20, 22);\n  if (!live) return null;\n  return (\n    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Backing y={y + size * 0.5}",
  "  const {live, o, t, a} = useWindow(from, to, 20, 22);\n  if (!live) return null;\n  return (\n    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>\n      <Snd file=\"exhale\" at={a} vol={0.1} frames={50} rate={1.2} />\n      <Backing y={y + size * 0.5}");

// Letterbox
rep("  const {live, o} = useWindow(from, to, 14, 14);\n  if (!live) return null;\n  const h = size * easeOut(o);\n  return (\n    <AbsoluteFill style={{pointerEvents: 'none'}}>",
  "  const {live, o, a} = useWindow(from, to, 14, 14);\n  if (!live) return null;\n  const h = size * easeOut(o);\n  return (\n    <AbsoluteFill style={{pointerEvents: 'none'}}>\n      <Snd file=\"whoosh\" at={a} vol={0.16} frames={24} rate={0.7} />");
fs.writeFileSync('src/components/Type.tsx', s);

// human sounds -> non-human replacements, everywhere in src
const map = {yawn: 'sleepy', sigh: 'exhale', chuckle: 'plink', gasp: 'sting', shout: 'thump'};
const vol = {sleepy: 0.22, exhale: 0.2, plink: 0.22, sting: 0.2, thump: 0.3};
const walk = (d) => fs.readdirSync(d, {withFileTypes: true}).flatMap((e) => (e.isDirectory() ? walk(d + '/' + e.name) : [d + '/' + e.name]));
for (const f of walk('src').filter((p) => /\.(tsx?)$/.test(p))) {
  const t = fs.readFileSync(f, 'utf8');
  let c = t;
  for (const [from, to] of Object.entries(map)) {
    c = c.replace(new RegExp(`file: '${from}'([^}]*?)vol: ([\\d.]+)`, 'g'), (m, mid) => `file: '${to}'${mid}vol: ${vol[to]}`);
    c = c.replace(new RegExp(`file: '${from}'`, 'g'), `file: '${to}'`);
  }
  if (c !== t) { fs.writeFileSync(f, c); console.log('updated', f); }
}
