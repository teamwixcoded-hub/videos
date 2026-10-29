import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Cam, camAt} from '../same2d/Stage';
import {Person, PersonProps, Who, bodyK, FaceP, CHAR_K} from './People';
import {SetOut, FL, livingRoom, street, hospital, party, auditorium, office, leoDoor, leoRoom, stairs, teaStall, park, kitchen, leoFlat} from './sets';
import {ease} from './fx';

// Shot-list vocabulary. A shot is [startSec, fx?, renderer]; the renderer gets the clock of the shot (Ctx).
export type Ctx = {t: number; l: number; d: number; p: number; from: number};
export type R = (c: Ctx) => React.ReactNode;
export type Fx = 'w' | 'f' | 'b';       // whip blur, photo flash, particle bridge
export type Entry = [number, Fx | undefined, R];
export const FLOOR = FL;

export const Z = (cx: number, cy: number, z = 1): Cam => ({cx, cy, z});
export const mixCam = (a: Cam, b: Cam, p: number): Cam => camAt(a, b, ease(Math.min(1, Math.max(0, p))));
export const path = (t: number, keys: [number, Cam][]): Cam => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return mixCam(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
  return keys[keys.length - 1][1];
};

type Pos = {who: Who; age: number; x: number; y: number; scale: number} & Partial<Omit<PersonProps, 'who' | 't' | 'x' | 'y' | 'scale' | 'age'>>;
const FRONTP = ['clap', 'film', 'desk', 'type'];
export const stand = (who: Who, age: number, x: number, sc = 0.7, o: Partial<PersonProps> = {}): Pos => ({who, age, x, y: FLOOR - 425 * sc * bodyK(who, age) * CHAR_K, scale: sc, ...o});
// side-view sitters have their hips 218 above the floor, front-view sitters (desk, clapping, filming) 300
export const sit = (who: Who, age: number, x: number, sc = 0.7, o: Partial<PersonProps> = {}, floor = FLOOR): Pos => {
  const front = o.view === 'front' || (!!o.pose && FRONTP.includes(o.pose));
  return {who, age, x, y: floor - (front ? 300 : 218) * sc * bodyK(who, age) * CHAR_K, scale: sc, legs: 'sit', ...o};
};
export const Pe = (c: Ctx, p: Pos, key?: string | number) => <Person key={key} t={c.t} {...p} />;
// camera aimed at a person's face / upper body
const headH = (p: Pos) => ((p.view === 'front' || (!!p.pose && FRONTP.includes(p.pose))) ? 500 : 440);
export const faceCam = (p: Pos, z = 2.4, dy = 0): Cam => Z(p.x, p.y - headH(p) * p.scale * bodyK(p.who, p.age) * CHAR_K + dy, z);
export const bodyCam = (p: Pos, z = 1.5): Cam => Z(p.x, p.y - 250 * p.scale * bodyK(p.who, p.age) * CHAR_K, z);

// faces
export const F = {
  calm: {smile: 0.1} as FaceP, smile: {smile: 0.8, brow: 0.2} as FaceP, grin: {smile: 1, open: 0.5, brow: 0.3} as FaceP, tired: {lids: 0.4, smile: 0, tilt: 6, brow: -0.1} as FaceP,
  sad: {lids: 0.3, smile: 0, tilt: 10, brow: -0.25} as FaceP, soft: {smile: 0.35, tilt: 5, brow: 0.1} as FaceP, angry: {smile: 0, tilt: -14, brow: -0.35, open: 0.2} as FaceP,
  talk: (t: number): FaceP => ({smile: 0.1, open: 0.25 + 0.25 * Math.abs(Math.sin(t * 9))}), worried: {tilt: 12, brow: 0.35, smile: 0} as FaceP,
};

const mk = (set: SetOut, cam: Cam, chars: React.ReactNode, blurK = 1, extra?: React.ReactNode) => (
  <Stage cam={cam} far={set.far} mid={set.mid} chars={<>{chars}{extra}</>} front={set.front} fg={set.fg} rim={set.rim} blurK={blurK} />
);
type CamArg = Cam | [Cam, Cam];
const camOf = (c: Ctx, a: CamArg) => { const k = Array.isArray(a) ? mixCam(a[0], a[1], c.p) : a; return {cx: k.cx + Math.sin(c.t * 0.9) * 5, cy: k.cy + Math.sin(c.t * 1.3 + 1) * 4, z: k.z}; };
export const SC = {
  liv: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof livingRoom>[0], 't'>, chars: React.ReactNode, blurK = 1) => mk(livingRoom({t: c.t, ...o}), camOf(c, cam), chars, blurK),
  str: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof street>[0], 't'>, chars: React.ReactNode = null) => mk(street({t: c.t, ...o}), camOf(c, cam), chars),
  hos: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof hospital>[0], 't'>, chars: React.ReactNode = null) => mk(hospital({t: c.t, ...o}), camOf(c, cam), chars),
  pty: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof party>[0], 't'>, chars: React.ReactNode = null) => mk(party({t: c.t, ...o}), camOf(c, cam), chars),
  aud: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof auditorium>[0], 't'>, chars: React.ReactNode = null) => mk(auditorium({t: c.t, ...o}), camOf(c, cam), chars),
  off: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof office>[0], 't'>, chars: React.ReactNode = null) => mk(office({t: c.t, ...o}), camOf(c, cam), chars),
  door: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof leoDoor>[0], 't'>, chars: React.ReactNode = null) => mk(leoDoor({t: c.t, ...o}), camOf(c, cam), chars),
  room: (c: Ctx, cam: CamArg, chars: React.ReactNode = null) => mk(leoRoom({t: c.t}), camOf(c, cam), chars),
  stairs: (c: Ctx, cam: CamArg, chars: React.ReactNode = null) => mk(stairs({t: c.t}), camOf(c, cam), chars),
  tea: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof teaStall>[0], 't'>, chars: React.ReactNode = null) => mk(teaStall({t: c.t, ...o}), camOf(c, cam), chars),
  park: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof park>[0], 't'>, chars: React.ReactNode = null, extra?: React.ReactNode) => mk(park({t: c.t, ...o}), camOf(c, cam), chars, 1, extra),
  kit: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof kitchen>[0], 't'>, chars: React.ReactNode = null) => mk(kitchen({t: c.t, ...o}), camOf(c, cam), chars),
  flat: (c: Ctx, cam: CamArg, chars: React.ReactNode = null) => mk(leoFlat({t: c.t}), camOf(c, cam), chars),
};

// two scenes in one frame with a divider that wipes in from the right (used only for the worst night and for Friday morning)
export const Split: React.FC<{left: React.ReactNode; right: React.ReactNode; wipe: number; divider?: number}> = ({left, right, wipe, divider = 1}) => {
  const x = 1920 - 960 * Math.min(2, Math.max(0, wipe));
  return (
    <AbsoluteFill>
      <AbsoluteFill>{left}</AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 0 0 ${x}px)`}}>{right}</AbsoluteFill>
      <div style={{position: 'absolute', left: x - 4, top: 0, width: 8, height: 1080, background: '#fff6e6', opacity: divider * 0.95, boxShadow: '0 0 24px rgba(0,0,0,.5)'}} />
    </AbsoluteFill>
  );
};
