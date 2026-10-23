import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// The camera's current transform, so props pinned to the room can keep themselves inside the frame.
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

export type CamKey = {at: number; x?: number; y?: number; zoom?: number; rotate?: number};

// Smooth camera: interpolates between keyframes (eased), applied around (originX, originY).
// Keep one Camera per scene and let its last keyframe match the next scene's first, so moves feel continuous.
export const Camera: React.FC<{keys: CamKey[]; originX?: number; originY?: number; handheld?: number; sound?: boolean; children: React.ReactNode}> = ({keys, originX = 960, originY = 540, handheld = 1, sound: soundOn = true, children}) => {
  const frame = useCurrentFrame();
  const ats = keys.map((k) => k.at);
  const val = (pick: (k: CamKey) => number | undefined, def: number) => {
    const vals = keys.map((k) => pick(k) ?? def);
    return interpolate(frame, ats, vals, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  };
  const x = val((k) => k.x, 0), y = val((k) => k.y, 0), zoom = val((k) => k.zoom, 1), rot = val((k) => k.rotate, 0);
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
  });
  // a little handheld drift so the shot is never perfectly still
  const hx = (Math.sin(frame / 37) * 4 + Math.sin(frame / 17) * 2) * handheld;
  const hy = (Math.cos(frame / 43) * 3 + Math.sin(frame / 23) * 1.5) * handheld;
  const hr = Math.sin(frame / 61) * 0.22 * handheld;
  return (
    <CamContext.Provider value={{s: zoom * 1.015, tx: x + hx, ty: y + hy}}>
    <AbsoluteFill style={{transform: `translate(${x + hx}px, ${y + hy}px) scale(${zoom * 1.015}) rotate(${rot + hr}deg)`, transformOrigin: `${originX}px ${originY}px`}}>
      {soundOn &&
        moves.map((m, i) => (
          <Sequence key={i} from={m.at} durationInFrames={m.len}>
            <Audio src={staticFile('sfx/whoosh.mp3')} playbackRate={m.rate} volume={(f) => m.vol * Math.min(1, f / 6) * Math.min(1, (m.len - f) / 10)} />
          </Sequence>
        ))}
      {children}
    </AbsoluteFill>
    </CamContext.Provider>
  );
};

// Decaying screen shake starting at `at`.
export const Shake: React.FC<{at: number; duration?: number; amount?: number; children: React.ReactNode}> = ({at, duration = 14, amount = 18, children}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const k = t >= 0 && t < duration ? 1 - t / duration : 0;
  const dx = Math.sin(t * 5.1) * amount * k;
  const dy = Math.cos(t * 6.7) * amount * k;
  const rot = Math.sin(t * 3.3) * 0.8 * k;
  return <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`}}>{children}</AbsoluteFill>;
};

export type StickerName = 'sweat' | 'anger' | 'zzz' | 'sparkle' | 'heart' | 'bolt' | 'speed' | 'question' | 'exclaim' | 'bulb' | 'dust' | 'badge';

// A comic icon from the FX sheet. 'pop' springs in and holds, 'float' rises and fades, 'pulse' keeps throbbing.
export const Sticker: React.FC<{
  name: StickerName;
  x: number;
  y: number;
  size?: number;
  at?: number;
  mode?: 'pop' | 'float' | 'pulse';
  rotate?: number;
  life?: number;
}> = ({name, x, y, size = 130, at = 0, mode = 'pop', rotate = 0, life = 60}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame - at;
  const [kx, ky] = useKeepInFrame(x, y, size, size);
  if (t < 0) return null;
  const pop = spring({frame: t, fps, config: {damping: 8, stiffness: 200, mass: 0.6}});
  let scale = pop;
  let dy = 0;
  let opacity = 1;
  if (mode === 'float') {
    dy = -t * 2.2;
    opacity = interpolate(t, [0, 8, life - 15, life], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
  }
  if (mode === 'pulse') scale = pop * (1 + Math.sin(t / 4) * 0.08);
  return (
    <Img
      src={staticFile(`images/fx/${name}.png`)}
      style={{position: 'absolute', left: kx - size / 2, top: ky - size / 2 + dy, width: size, transform: `scale(${scale}) rotate(${rotate}deg)`, opacity, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.35))'}}
    />
  );
};

// Camera key that centres world point (px, py) at zoom z. Use with <Camera> (origin stays at the frame centre).
export const focus = (at: number, px: number, py: number, zoom: number): CamKey => {
  // keep the view inside the 1920x1080 background so no black edges show
  const cx = Math.min(Math.max(px, 960 / zoom), 1920 - 960 / zoom);
  const cy = Math.min(Math.max(py, 540 / zoom), 1080 - 540 / zoom);
  return {at, zoom, x: -zoom * (cx - 960), y: -zoom * (cy - 540)};
};
