import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EMO} from '../lab/character';
import {propSvg} from '../lab/props';
import {Rig2} from './rig2';
import {Held} from './held';
import {S} from '../easing';

// ============================================================================================
// Actor2: the believable rig. Keyframes (script seconds) set a pose by TARGETS, not angles:
//   hip / lean / chest / headTilt, arms {reach:[x,y]} or {ang}, legs {foot:[x,y]} or {ang}, look:[x,y] (eyes + head follow it),
//   emo (face), hold (a prop under the fingers). Fields not given carry forward from the previous key.
// Positions are in FIGURE space (300 x 430, feet near y = 405). Use toLocal() to convert a world point.
// ============================================================================================
type Pt = [number, number];
export type Arm = {reach?: Pt; ang?: Pt; hand?: string; bend?: number};
export type Leg = {foot?: Pt; ang?: Pt; bend?: number};
export type HoldSpec = {name: string; at?: 'L' | 'R' | 'mid'; size?: number; dx?: number; dy?: number; rot?: number} | null;
export type K2 = {t: number; turn?: number; emo?: string; hip?: Pt; lean?: number; chest?: number; headTilt?: number; look?: Pt | null; armL?: Arm; armR?: Arm; legL?: Leg; legR?: Leg; hold?: HoldSpec; ease?: 'snap' | 'soft' | 'slow'};

const DEF: any = {turn: 0, emo: 'neutral', hip: [150, 250], lean: 0, chest: 0, headTilt: 0, look: null, armL: {ang: [-8, -4]}, armR: {ang: [8, 4]}, legL: {}, legR: {}, hold: null};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixP = (a: Pt, b: Pt, t: number): Pt => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
const mixArm = (a: Arm, b: Arm, t: number): Arm => {
  if (a.reach && b.reach) return {...b, reach: mixP(a.reach, b.reach, t)};
  if (a.ang && b.ang) return {...b, ang: mixP(a.ang, b.ang, t)};
  return t > 0.5 ? b : a;
};
const mixLeg = (a: Leg, b: Leg, t: number): Leg => {
  if (a.foot && b.foot) return {...b, foot: mixP(a.foot, b.foot, t)};
  if (a.ang && b.ang) return {...b, ang: mixP(a.ang, b.ang, t)};
  return t > 0.5 ? b : a;
};
const mixFace = (a: any, b: any, t: number) => {
  const m = (x: number[], y: number[]) => x.map((v, i) => mix(v, y[i], t));
  const s = t > 0.5 ? b : a;
  return {bl: m(a.bl, b.bl), br: m(a.br, b.br), lid: m(a.lid, b.lid), pupil: m(a.pupil, b.pupil), mouth: s.mouth, arch: s.arch, bags: s.bags, tears: s.tears, big: s.big};
};
const hash = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 997; return h; };
const SPR: Record<string, any> = {snap: {damping: 16, stiffness: 150, mass: 0.8}, soft: {damping: 14, stiffness: 90, mass: 0.9}, slow: {damping: 26, stiffness: 36, mass: 1}};

export const Actor2: React.FC<{
  id: string; keys: K2[]; pal: 'indigo' | 'teal' | 'coral' | 'gold'; x: number; y: number; h?: number; flip?: boolean;
  speech?: {code: string; energy: number} | null; opacity?: number; dim?: number; shadow?: boolean; seat?: {back: string; front: string};
}> = ({id, keys, pal, x, y, h = 620, flip = false, speech = null, opacity = 1, dim = 1, shadow = true, seat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // full spec per key (carry-forward)
  const full: any[] = [];
  keys.forEach((k, i) => { const prev = i ? full[i - 1] : DEF; full.push({...prev, ...Object.fromEntries(Object.entries(k).filter(([, v]) => v !== undefined)), f: S(k.t)}); });
  let i = 0;
  full.forEach((k, j) => { if (frame >= k.f) i = j; });
  const to = full[i], from = full[Math.max(0, i - 1)];
  const p = i === 0 ? 1 : spring({frame: frame - to.f, fps, config: SPR[to.ease || 'soft']});
  const pc = Math.min(1, Math.max(0, p));
  const o = hash(id);
  const breathe = Math.sin((frame + o) / 24);
  const spec: any = {
    pal, u: 'a' + id, facing: 1, style: 'flat', turn: mix(from.turn, to.turn, p),
    hip: mixP(from.hip, to.hip, p), lean: mix(from.lean, to.lean, p) + Math.sin((frame + o) / 29) * 0.7,
    chest: mix(from.chest, to.chest, p) + breathe * 0.9, headTilt: mix(from.headTilt, to.headTilt, p) + Math.sin((frame + o) / 33) * 1.3,
    armL: mixArm(from.armL, to.armL, p), armR: mixArm(from.armR, to.armR, p), legL: mixLeg(from.legL, to.legL, p), legR: mixLeg(from.legR, to.legR, p),
  };
  // eyes: follow the look target, with small natural drifts
  const lk = to.look || from.look;
  if (lk) { const a: Pt = from.look || lk, b: Pt = to.look || lk; spec.look = [mix(a[0], b[0], p) + Math.sin((frame + o) / 17) * 6, mix(a[1], b[1], p) + Math.cos((frame + o) / 23) * 4]; }
  const emo: any = mixFace(EMO[from.emo], EMO[to.emo], pc);
  const bp = (frame + o * 3) % 118, blink = bp < 7 ? Math.sin((bp / 7) * Math.PI) : 0;
  if (!emo.arch && blink > 0) emo.lid = [Math.max(emo.lid[0], blink * 1.1), emo.lid[1], emo.lid[2] * (1 - blink)];
  if (speech) {
    const M: any = {s: 'ts', m: 'tm', w: 'tw', o: 'to', e: 'te'};
    if (speech.code !== 'c') emo.mouth = M[speech.code];
    emo.bl = [emo.bl[0] - speech.energy * 3.5, emo.bl[1]]; emo.br = [emo.br[0] - speech.energy * 3.5, emo.br[1]];
    spec.headTilt += speech.energy * 2.2;
  }
  spec.emo = emo;
  // held prop sits under the fingers
  const hold: HoldSpec = to.hold;
  if (hold) {
    spec.heldFn = (hs: any) => {
      const at = hold.at ?? 'mid';
      const pt = at === 'mid' ? [(hs.L[0] + hs.R[0]) / 2, (hs.L[1] + hs.R[1]) / 2] : hs[at];
      // a book that is READ and a phone that is SCROLLED are drawn as seen from the side (see held.ts)
      if (hold.name === 'book-back') return Held.book(pt[0] + (hold.dx ?? 6), pt[1] + (hold.dy ?? -20), {tilt: hold.rot ?? -16});
      if (hold.name === 'phone-back') return Held.phone(pt[0] + (hold.dx ?? 12), pt[1] + (hold.dy ?? -18), {tilt: hold.rot ?? -20, scroll: frame / 17, skin: spec.u + 'k'});
      const s = hold.size ?? 110;
      return `<g transform="translate(${(pt[0] + (hold.dx ?? 0)).toFixed(1)} ${(pt[1] + (hold.dy ?? 0)).toFixed(1)}) rotate(${hold.rot ?? 0})"><svg x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" viewBox="0 0 200 200" overflow="visible">${propSvg(hold.name, 1, true)}</svg></g>`;
    };
  }
  const fig = Rig2.figure(spec);
  const k = h / 430;
  return (
    <div style={{position: 'absolute', left: x - 150 * k, top: y - 416 * k, width: 300 * k, height: 430 * k, opacity, transform: flip ? 'scaleX(-1)' : undefined, filter: dim !== 1 ? `brightness(${dim})` : undefined, pointerEvents: 'none'}}>
      {shadow && <div style={{position: 'absolute', left: '12%', top: '94%', width: '76%', height: '5%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.45), rgba(0,0,0,0) 70%)'}} />}
      <svg viewBox="0 0 300 430" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}} dangerouslySetInnerHTML={{__html: (seat ? seat.back : '') + fig.svg + (seat ? seat.front : '')}} />
    </div>
  );
};

// world point -> figure space for an actor placed at (x, y) with height h (flip mirrors x)
export const toLocal = (world: Pt, actor: {x: number; y: number; h: number; flip?: boolean}): Pt => {
  const k = actor.h / 430, dx = (world[0] - actor.x) / k;
  return [150 + (actor.flip ? -dx : dx), 416 + (world[1] - actor.y) / k];
};
