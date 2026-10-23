const fs = require('fs');
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) { console.log('MISSING', file, String(a).slice(0, 70)); continue; } s = s.replace(a, () => b); }
  fs.writeFileSync(file, s);
};

// ---- Camera publishes its current transform; world-space props use it to stay on screen ----
edit('src/vfx/Motion.tsx', [
  ["import React from 'react';", "import React, {createContext, useContext} from 'react';"],
  ["export type CamKey =", `// The camera's current transform, so props pinned to the room can keep themselves inside the frame.
export const CamContext = createContext<{s: number; tx: number; ty: number}>({s: 1, tx: 0, ty: 0});

// Returns a world position that, after the camera transform, puts a w x h box fully inside the 1920x1080 frame.
export const useKeepInFrame = (x: number, y: number, w: number, h: number, margin = 28, anchorY = 0.5): [number, number] => {
  const {s, tx, ty} = useContext(CamContext);
  const sx = 960 + s * (x - 960) + tx;
  const sy = 540 + s * (y - 540) + ty;
  const hw = (w * s) / 2, top = h * s * anchorY, bottom = h * s * (1 - anchorY);
  const cx = Math.min(Math.max(sx, margin + hw), 1920 - margin - hw);
  const cy = Math.min(Math.max(sy, margin + top), 1080 - margin - bottom);
  return [960 + (cx - tx - 960) / s, 540 + (cy - ty - 540) / s];
};

export type CamKey =`],
  ["  return (\n    <AbsoluteFill style={{transform: `translate(${x + hx}px, ${y + hy}px) scale(${zoom * 1.015}) rotate(${rot + hr}deg)`, transformOrigin: `${originX}px ${originY}px`}}>",
   "  return (\n    <CamContext.Provider value={{s: zoom * 1.015, tx: x + hx, ty: y + hy}}>\n    <AbsoluteFill style={{transform: `translate(${x + hx}px, ${y + hy}px) scale(${zoom * 1.015}) rotate(${rot + hr}deg)`, transformOrigin: `${originX}px ${originY}px`}}>"],
  ["      {children}\n    </AbsoluteFill>\n  );\n};\n\n// Decaying screen shake", "      {children}\n    </AbsoluteFill>\n    </CamContext.Provider>\n  );\n};\n\n// Decaying screen shake"],
  // Sticker
  ["  const t = frame - at;\n  if (t < 0) return null;\n  const pop = spring({frame: t, fps, config: {damping: 8, stiffness: 200, mass: 0.6}});",
   "  const t = frame - at;\n  const [kx, ky] = useKeepInFrame(x, y, size, size);\n  if (t < 0) return null;\n  const pop = spring({frame: t, fps, config: {damping: 8, stiffness: 200, mass: 0.6}});"],
  ["style={{position: 'absolute', left: x - size / 2, top: y - size / 2 + dy, width: size, transform: `scale(${scale}) rotate(${rotate}deg)`, opacity,", "style={{position: 'absolute', left: kx - size / 2, top: ky - size / 2 + dy, width: size, transform: `scale(${scale}) rotate(${rotate}deg)`, opacity,"],
]);

// ---- PropPop ----
edit('src/components/PropPop.tsx', [
  ["import {S} from '../easing';", "import {S} from '../easing';\nimport {useKeepInFrame} from '../vfx/Motion';"],
  ["  const a = S(from), b = S(to);\n  if (frame < a || frame > b + 14) return null;", "  const a = S(from), b = S(to);\n  const rise0 = float ? 110 : 0; // floating props drift upward: leave room above\n  const [kx, ky] = useKeepInFrame(x, y, w, w * (label ? 0.72 : 1.05) + rise0, 28, 0.5 + rise0 / (2 * (w * 1.05 + rise0)));\n  if (frame < a || frame > b + 14) return null;"],
  ["style={{position: 'absolute', left: x, top: y + bob + rise, width: w,", "style={{position: 'absolute', left: kx, top: ky + bob + rise, width: w,"],
]);

// ---- NameTag + ThoughtTower ----
edit('src/components/Explain.tsx', [
  ["import {Snd} from './Type';", "import {Snd} from './Type';\nimport {useKeepInFrame} from '../vfx/Motion';"],
  ["  const {live, o, t, a} = useWin(from, to, 6, 10);\n  const {fps} = useVideoConfig();\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 10, stiffness: 160, mass: 0.7}});",
   "  const {live, o, t, a} = useWin(from, to, 6, 10);\n  const {fps} = useVideoConfig();\n  const tw = Math.max(260, text.length * size * 0.62 + 70), th = size * 1.3 + 40 + (sub ? size * 0.9 : 0);\n  const [kx, ky] = useKeepInFrame(x, y, tw, th, 28, 1);\n  if (!live) return null;\n  const s = spring({frame: t, fps, config: {damping: 10, stiffness: 160, mass: 0.7}});"],
  ["    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${s})`", "    <div style={{position: 'absolute', left: kx, top: ky, transform: `translate(-50%, -100%) scale(${s})`"],
]);
edit('src/components/Props4.tsx', [
  ["import {easeInOut, clamp01} from '../easing';", "import {easeInOut, clamp01} from '../easing';\nimport {useKeepInFrame} from '../vfx/Motion';"],
  ["  if (frame < from || (to !== undefined && frame > to + 12)) return null;\n  const leave = to === undefined", "  const [kx, ky] = useKeepInFrame(x, y, 470, 400);\n  if (frame < from || (to !== undefined && frame > to + 12)) return null;\n  const leave = to === undefined"],
  ["left: x, top: y + bob, transform: `translate(-50%, -50%) scale(${pop})`, transformOrigin: '10% 100%', width: 470}}>", "left: kx, top: ky + bob, transform: `translate(-50%, -50%) scale(${pop})`, transformOrigin: '10% 100%', width: 470}}>"],
]);

// ---- auto-fit wide titles (screen space) ----
edit('src/components/Type.tsx', [
  ["  const spread = interpolate(t, [0, S(to - from) + 10], [track * 0.45, track], co);",
   "  const spread = interpolate(t, [0, S(to - from) + 10], [track * 0.45, track], co);\n  // keep the whole line inside the frame: estimate its width at full tracking and shrink the type if needed\n  const estW = text.replace(/ /g, '').length * (0.42 + track) * size + (text.split(' ').length - 1) * 0.5 * size;\n  const fit = Math.min(1, 1740 / estW);\n  const fsz = size * fit;"],
  ["<div style={{fontFamily: CINE_FONT, fontSize: size, letterSpacing: `${spread}em`, paddingLeft: `${spread}em`, color, lineHeight: 1, textShadow: `0 10px 40px rgba(0,0,0,0.7)`}}>", "<div style={{fontFamily: CINE_FONT, fontSize: fsz, letterSpacing: `${spread}em`, paddingLeft: `${spread}em`, color, lineHeight: 1, textShadow: `0 10px 40px rgba(0,0,0,0.7)`}}>"],
]);
console.log('done');
