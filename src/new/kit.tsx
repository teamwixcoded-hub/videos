import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EMO, POSES, figureEx} from '../lab/character';
import {propSvg} from '../lab/props';
import {furnSvg, FURN} from './furn';
import {S, easeInOut} from '../easing';

// ============================================================================================
// New-style toolkit. Everything is vector, written in SCRIPT SECONDS (S() scales to frames, exactly like the
// original scenes), so the new video keeps the old timing, captions and music.
//   <Actor>   the glass character: keyframed pose + face, breathing, blinking, held props
//   <Cam>     camera: keyframed pan / zoom over a world bigger than the screen
//   <Plate>   baked cinematic background
//   <Furn>    furniture, <Obj> a prop placed in the world
// ============================================================================================

type PoseDef = {lean: number; tilt: number; armL: number[]; armR: number[]; legL: number[]; legR: number[]};
// angles: 0 = straight down, 90 = to the right, -90 = left, 180 = up. Sitting poses face right (flip for left).
export const POSE: Record<string, PoseDef> = {
  idle: POSES.idle, slumped: POSES.slumped, triumphant: POSES.triumphant, pointing: POSES.pointing,
  stand: {lean: 0, tilt: 0, armL: [-8, -4], armR: [8, 4], legL: [-4, -2], legR: [4, 2]},
  tiredStand: {lean: 8, tilt: 16, armL: [-4, 0], armR: [6, 8], legL: [-3, 0], legR: [5, 3]},
  sitSlump: {lean: 14, tilt: 22, armL: [-6, -2], armR: [14, 8], legL: [82, 4], legR: [88, 8]},
  sitRead: {lean: -2, tilt: 20, armL: [-26, -232], armR: [26, 232], legL: [84, 2], legR: [90, 6]},
  sitReadLean: {lean: 4, tilt: 26, armL: [-24, -236], armR: [24, 236], legL: [84, 2], legR: [90, 6]},
  sitUp: {lean: -4, tilt: -6, armL: [-10, -6], armR: [12, 8], legL: [84, 2], legR: [90, 6]},
  bedPhone: {lean: 8, tilt: 24, armL: [-26, -230], armR: [26, 230], legL: [90, 88], legR: [92, 90]},
  bedSlump: {lean: 16, tilt: 26, armL: [-8, -4], armR: [12, 8], legL: [90, 88], legR: [92, 90]},
  bedSit: {lean: 2, tilt: 8, armL: [-10, -6], armR: [14, 10], legL: [90, 88], legR: [92, 90]},
  reachPhone: {lean: 10, tilt: 14, armL: [-6, -2], armR: [74, 110], legL: [90, 88], legR: [92, 90]},
  walk: {lean: 6, tilt: 2, armL: [-18, -10], armR: [14, 8], legL: [-16, -8], legR: [18, 10]},
  point: POSES.pointing,
  handsUp: POSES.triumphant,
  shrug: {lean: 0, tilt: 6, armL: [-40, -120], armR: [40, 120], legL: [-4, -2], legR: [4, 2]},
};
export type Hold = {name: string; hand?: 'L' | 'R' | 'both'; size?: number; dx?: number; dy?: number; rot?: number} | null;
export type Key = {t: number; pose: string; emo: string; hold?: Hold};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixArr = (a: number[], b: number[], t: number) => a.map((v, i) => mix(v, b[i], t));
const mixPose = (a: PoseDef, b: PoseDef, t: number): PoseDef => ({
  lean: mix(a.lean, b.lean, t), tilt: mix(a.tilt, b.tilt, t), armL: mixArr(a.armL, b.armL, t), armR: mixArr(a.armR, b.armR, t),
  legL: mixArr(a.legL, b.legL, t), legR: mixArr(a.legR, b.legR, t),
});
const mixFace = (a: any, b: any, t: number) => {
  const e: any = {bl: mixArr(a.bl, b.bl, t), br: mixArr(a.br, b.br, t), lid: mixArr(a.lid, b.lid, t), pupil: mixArr(a.pupil, b.pupil, t)};
  const s = t > 0.5 ? b : a;
  e.mouth = s.mouth; e.arch = s.arch; e.bags = s.bags; e.tears = s.tears; e.big = s.big;
  return e;
};
const hash = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 997; return h; };

// ---------------------------------------------------------------------------------------------
export const Actor: React.FC<{
  id: string; keys: Key[]; pal: 'indigo' | 'teal' | 'coral' | 'gold'; x: number; y: number; h?: number;
  flip?: boolean; drop?: number; opacity?: number; speech?: {code: string; energy: number} | null;
}> = ({id, keys, pal, x, y, h = 760, flip = false, drop = 0, opacity = 1, speech = null}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ks = keys.map((k) => ({...k, f: S(k.t)}));
  let i = 0;
  ks.forEach((k, j) => { if (frame >= k.f) i = j; });
  const to = ks[i], from = ks[Math.max(0, i - 1)];
  const p = i === 0 ? 1 : spring({frame: frame - to.f, fps, config: {damping: 13, stiffness: 95, mass: 0.9}});
  const base = mixPose(POSE[from.pose], POSE[to.pose], p);
  const o = hash(id);
  const pose: any = {
    ...base,
    lean: base.lean + Math.sin((frame + o) / 22) * 0.9,
    tilt: base.tilt + Math.sin((frame + o) / 31) * 1.4,
    armL: [base.armL[0] + Math.sin((frame + o) / 26) * 1.6, base.armL[1] + Math.sin((frame + o) / 26 + 1) * 2],
    armR: [base.armR[0] - Math.sin((frame + o) / 26) * 1.6, base.armR[1] - Math.sin((frame + o) / 26 + 1) * 2],
  };
  const emo = mixFace(EMO[from.emo], EMO[to.emo], i === 0 ? 1 : Math.min(1, Math.max(0, p)));
  const bp = (frame + o * 3) % 112, blink = bp < 8 ? Math.sin((bp / 8) * Math.PI) : 0;
  if (!emo.arch && blink > 0) emo.lid = [Math.max(emo.lid[0], blink * 1.1), emo.lid[1], emo.lid[2] * (1 - blink)];
  if (speech) { // lip-sync (see scripts/lipsync.mjs)
    const M: any = {s: 'ts', m: 'tm', w: 'tw', o: 'to', e: 'te'};
    if (speech.code !== 'c') emo.mouth = M[speech.code];
    emo.bl = [emo.bl[0] - speech.energy * 3.5, emo.bl[1]]; emo.br = [emo.br[0] - speech.energy * 3.5, emo.br[1]];
    pose.tilt += speech.energy * 2.2;
  }
  // held prop: carries forward from the latest key that mentions `hold`
  let hold: Hold = null;
  ks.forEach((k, j) => { if (j <= i && k.hold !== undefined) hold = k.hold; });
  const fig = figureEx(pose, emo, pal, 'a' + id, true);
  let heldSvg = '';
  if (hold) {
    const hd = hold as NonNullable<Hold>, hs: any = fig.hands, side = hd.hand ?? 'both';
    const pt = side === 'both' ? [(hs.L[0] + hs.R[0]) / 2, (hs.L[1] + hs.R[1]) / 2] : hs[side];
    const s = hd.size ?? 110;
    heldSvg = `<g transform="translate(${pt[0] + (hd.dx ?? 0)} ${pt[1] + (hd.dy ?? 0)}) rotate(${hd.rot ?? 0})"><svg x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" viewBox="0 0 200 200" overflow="visible">${propSvg(hd.name)}</svg></g>`;
  }
  const k = h / 430;
  return (
    <div style={{position: 'absolute', left: x - 150 * k, top: y - (416 - drop) * k, width: 300 * k, height: 430 * k, opacity, transform: flip ? 'scaleX(-1)' : undefined, pointerEvents: 'none'}}>
      <svg viewBox="0 0 300 430" style={{width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 0 22px rgba(150,170,255,.45))'}} dangerouslySetInnerHTML={{__html: fig.svg + heldSvg}} />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
export type CamKey = {t: number; x: number; y: number; z: number};
// Camera over a world of any size. Keys are script seconds. The world's top-left is (0,0).
export const Cam: React.FC<{keys: CamKey[]; children: React.ReactNode; w?: number; h?: number; vw?: number; vh?: number}> = ({keys, children, w = 1920, h = 1080, vw = 1920, vh = 1080}) => {
  const frame = useCurrentFrame();
  const ks = keys.map((k) => ({...k, f: S(k.t)}));
  let c = {x: ks[0].x, y: ks[0].y, z: ks[0].z};
  for (let i = 1; i < ks.length; i++) {
    if (frame >= ks[i - 1].f && frame <= ks[i].f) {
      const u = easeInOut((frame - ks[i - 1].f) / Math.max(1, ks[i].f - ks[i - 1].f));
      c = {x: mix(ks[i - 1].x, ks[i].x, u), y: mix(ks[i - 1].y, ks[i].y, u), z: mix(ks[i - 1].z, ks[i].z, u)};
    } else if (frame > ks[i].f) c = {x: ks[i].x, y: ks[i].y, z: ks[i].z};
  }
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: `translate(${vw / 2 - c.x * c.z}px, ${vh / 2 - c.y * c.z}px) scale(${c.z})`}}>{children}</div>
    </AbsoluteFill>
  );
};

export const Plate: React.FC<{name: string; w?: number; h?: number; opacity?: number}> = ({name, w = 1920, h = 1080, opacity = 1}) => (
  <Img src={staticFile(`bg2/${name}.jpg`)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, objectFit: 'cover', opacity}} />
);

// furniture: (x, y) = bottom-centre on the floor, w = display width
export const Furn: React.FC<{name: keyof typeof FURN | string; x: number; y: number; w: number; flip?: boolean; opacity?: number; flat?: boolean}> = ({name, x, y, w, flip, opacity = 1, flat = false}) => {
  const f = (FURN as any)[name], k = w / f.w;
  return (
    <svg viewBox={`0 0 ${f.w} ${f.h}`} style={{position: 'absolute', left: x - w / 2, top: y - f.h * k, width: w, height: f.h * k, overflow: 'visible', opacity, transform: flip ? 'scaleX(-1)' : undefined, filter: 'drop-shadow(0 14px 18px rgba(0,0,0,.35))'}}
      dangerouslySetInnerHTML={{__html: furnSvg(name as string, flat)}} />
  );
};

// a prop in the world: (x, y) = centre. `at`/`until` in script seconds (pop in with a bounce, shrink away).
export const Obj: React.FC<{name: string; x: number; y: number; size: number; at?: number; until?: number; rot?: number; float?: number; glow?: string; flat?: boolean}> = ({name, x, y, size, at = 0, until, rot = 0, float = 5, glow, flat = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = S(at), u = until === undefined ? undefined : S(until);
  const out = u === undefined ? 1 : interpolate(frame, [u, u + 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < a || out <= 0) return null;
  const s = spring({frame: frame - a, fps, config: {damping: 9, stiffness: 140}}) * out;
  const fy = Math.sin((frame - a) / 14) * float;
  return (
    <svg viewBox="0 0 200 200" style={{position: 'absolute', left: x - size / 2, top: y - size / 2 + fy, width: size, height: size, overflow: 'visible', transform: `scale(${s}) rotate(${rot}deg)`,
      filter: `drop-shadow(0 12px 18px rgba(0,0,0,.35))${glow ? ` drop-shadow(0 0 30px ${glow})` : ''}`}} dangerouslySetInnerHTML={{__html: propSvg(name, 0.96, flat)}} />
  );
};

// soft coloured light on top of the scene
export const Light: React.FC<{x: number; y: number; r: number; color: string; opacity?: number}> = ({x, y, r, color, opacity = 1}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, mixBlendMode: 'screen', pointerEvents: 'none'}} />
);
