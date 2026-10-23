const fs = require('fs');
const rd = (p) => fs.readFileSync(p, 'utf8');
const edit = (file, pairs) => {
  let s = rd(file);
  for (const [a, b] of pairs) {
    if (typeof a === 'string' ? !s.includes(a) : !a.test(s)) { console.log('MISSING', file, String(a).slice(0, 60)); continue; }
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(file, s);
};

// ---- 1. story order in Act1 -----------------------------------------------------------------
edit('src/scenes/Act1.tsx', [
  // "One picks up his phone": he only GLANCES at it here; the reach starts later, right before the grab
  ["  {src: 'FL_R2', at: S(16.4), fade: 24},", "  {src: 'FL_R1g', at: S(16.4), fade: 24},"],
  // night one: awake and relaxed first, drowsy only at the very end
  ["  {src: 'FL_N3', at: S(88.4), fade: 18},\n  {src: 'FL_N1', at: S(92.6), fade: 18},", "  {src: 'FL_N1', at: S(88.4), fade: 18},\n  {src: 'FL_N3', at: S(96.4), fade: 26},"],
  // Green: frustrated with the closed book, THEN reaches for the lamp, lamp goes out, THEN he is asleep in the dark
  ["  {src: 'FL_G8', at: S(86.2), fade: 18},\n  {src: 'FL_G9', at: S(94.6), fade: 16},", "  {src: 'FL_G9', at: S(95.2), fade: 16},\n  {src: 'FL_G8', at: S(99.8), fade: 20},"],
]);

// ---- 2. smarter captions: a bigger flag for the one line that matters most ------------------
edit('src/components/KeyPhrases.tsx', [
  ["export type KP = {t: string; from: number; to: number; hi?: string[]; accent?: string; pos?: 'bottom' | 'top'; color?: string};", "export type KP = {t: string; from: number; to: number; hi?: string[]; accent?: string; pos?: 'bottom' | 'top'; color?: string; big?: boolean};"],
  ["const size = n > 26 ? 76 : n > 18 ? 88 : n > 12 ? 100 : 112;", "const base = n > 26 ? 76 : n > 18 ? 88 : n > 12 ? 100 : 112;\n      const size = l.big ? Math.round(base * 1.3) : base;"],
]);

// ---- 3. camera moves make sound (zoom, push, pan) -------------------------------------------
edit('src/vfx/Motion.tsx', [
  ["import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';", "import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';"],
  ["  const x = val((k) => k.x, 0), y = val((k) => k.y, 0), zoom = val((k) => k.zoom, 1), rot = val((k) => k.rotate, 0);", `  const x = val((k) => k.x, 0), y = val((k) => k.y, 0), zoom = val((k) => k.zoom, 1), rot = val((k) => k.rotate, 0);
  // Every real camera move (a zoom, a push-in, a pan to the other character) gets its own soft air sound,
  // stretched to the length of the move: slow moves sound low and long, quick ones short and bright.
  const moves = keys.slice(1).flatMap((b, i) => {
    const a = keys[i];
    const span = b.at - a.at;
    const dx = Math.abs((b.x ?? 0) - (a.x ?? 0)), dy = Math.abs((b.y ?? 0) - (a.y ?? 0));
    const dz = Math.abs((b.zoom ?? 1) - (a.zoom ?? 1));
    const size = Math.max(dx / 1400, dy / 800, dz / 0.9);
    if (span < 8 || size < 0.18) return [];
    const zoomIn = (b.zoom ?? 1) > (a.zoom ?? 1) + 0.12;
    return [{at: a.at, len: Math.min(60, span), vol: Math.min(0.2, 0.06 + size * 0.14), rate: Math.max(0.55, Math.min(1.25, 30 / span)) * (zoomIn ? 0.92 : 1)}];
  });`],
  ["      {children}\n    </AbsoluteFill>\n  );\n};\n\n// Decaying screen shake", `      {soundOn &&
        moves.map((m, i) => (
          <Sequence key={i} from={m.at} durationInFrames={m.len}>
            <Audio src={staticFile('sfx/whoosh.mp3')} playbackRate={m.rate} volume={(f) => m.vol * Math.min(1, f / 6) * Math.min(1, (m.len - f) / 10)} />
          </Sequence>
        ))}
      {children}
    </AbsoluteFill>
  );
};

// Decaying screen shake`],
  ["handheld?: number; children: React.ReactNode}> = ({keys, originX = 960, originY = 540, handheld = 1, children}) => {", "handheld?: number; sound?: boolean; children: React.ReactNode}> = ({keys, originX = 960, originY = 540, handheld = 1, sound: soundOn = true, children}) => {"],
]);

// the new automatic camera sound replaces the camera-whoosh helper in scenes
for (const f of ['Act1', 'S07Day90', 'S09Result', 'S10Day365', 'S12End']) {
  let s = rd(`src/scenes/${f}.tsx`);
  s = s.replace(/, \.\.\.camCues\(CAM, (ACT1_SFX|SFX)\)/, '');
  s = s.replace('[...SFX, ...camCues(CAM, SFX)]', 'SFX');
  fs.writeFileSync(`src/scenes/${f}.tsx`, s);
}
console.log('done');
