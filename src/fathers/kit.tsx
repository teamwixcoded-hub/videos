import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Cam, camAt} from '../same2d/Stage';
import {Person, PersonProps, Who, bodyK, FaceP, CHAR_K} from './People';
import {SetOut, FL, livingRoom, street, hospital, party, auditorium, office, leoDoor, leoRoom, stairs, teaStall, park, kitchen, leoFlat} from './sets';
import {ease} from './fx';
import {factory, drive} from './sets3';
import {merge, livingDetail, teaDetail, streetDetail, kitchenDetail, officeDetail, parkDetail, roomDetail, stairsDetail, doorDetail, hospitalDetail} from './details';

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

type Pos = {who: Who; age: number; x: number; y: number; scale: number; chair?: boolean} & Partial<Omit<PersonProps, 'who' | 't' | 'x' | 'y' | 'scale' | 'age'>>;
const FRONTP = ['clap', 'film', 'desk', 'type'];
export const stand = (who: Who, age: number, x: number, sc = 0.7, o: Partial<PersonProps> = {}): Pos => ({who, age, x, y: FLOOR - 425 * sc * bodyK(who, age) * CHAR_K, scale: sc, ...o});
// side-view sitters have their hips 218 above the floor, front-view sitters (desk, clapping, filming) 300
export const sit = (who: Who, age: number, x: number, sc = 0.7, o: Partial<PersonProps> = {}, floor = FLOOR): Pos => {
  const front = o.view === 'front' || (!!o.pose && FRONTP.includes(o.pose));
  return {who, age, x, y: floor - (front ? 300 : 218) * sc * bodyK(who, age) * CHAR_K, scale: sc, legs: 'sit', ...o};
};
// every person stands on a soft contact shadow and eases into the shot's pose over the first half second
const ShadowE: React.FC<{x: number; rx: number; floor?: number}> = ({x, rx, floor = FLOOR}) => (
  <g><defs><radialGradient id="pshadow"><stop offset="0" stopColor="#05060f" stopOpacity="0.5" /><stop offset="0.6" stopColor="#05060f" stopOpacity="0.24" /><stop offset="1" stopColor="#05060f" stopOpacity="0" /></radialGradient></defs><ellipse cx={x} cy={floor + 6} rx={rx} ry={rx * 0.13} fill="url(#pshadow)" /></g>
);
// a plain wooden chair under a sitter (side view: seat, back post, legs; front view: seat and legs) so nobody sits in the air
const ChairUnder: React.FC<{p: Pos; k: number; front: boolean}> = ({p, k, front}) => {
  const dir = (p.turn ?? 0.2) < 0 ? -1 : 1, seatY = p.y + (front ? 96 : 80) * k, floor = p.y + (front ? 300 : 218) * k, wood = '#7a5232', woodD = '#5a3a22';
  if (front) return (
    <g>
      <rect x={p.x - 120 * k} y={seatY - 260 * k} width={22 * k} height={260 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} /><rect x={p.x + 98 * k} y={seatY - 260 * k} width={22 * k} height={260 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} />
      <rect x={p.x - 120 * k} y={seatY - 250 * k} width={240 * k} height={36 * k} rx={6} fill={wood} stroke="#1d1a2e" strokeWidth={3} />
      <rect x={p.x - 126 * k} y={seatY} width={252 * k} height={26 * k} rx={8} fill={wood} stroke="#1d1a2e" strokeWidth={3.4} />
      {[-100, 80].map((dx) => <rect key={dx} x={p.x + dx * k} y={seatY + 26 * k} width={20 * k} height={floor - seatY - 26 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} />)}
    </g>
  );
  const bx = p.x - dir * 96 * k, fx = p.x + dir * 200 * k;
  return (
    <g>
      <rect x={Math.min(bx, bx + dir * 0) - 10 * k} y={seatY - 340 * k} width={22 * k} height={340 * k + 20 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} />
      <rect x={bx - 14 * k} y={seatY - 330 * k} width={30 * k} height={120 * k} rx={6} fill={wood} stroke="#1d1a2e" strokeWidth={3} />
      <rect x={Math.min(bx, fx) - 4} y={seatY} width={Math.abs(fx - bx) + 8} height={24 * k} rx={8} fill={wood} stroke="#1d1a2e" strokeWidth={3.4} />
      {[bx + dir * 10 * k, fx - dir * 20 * k].map((lx, i) => <rect key={i} x={lx - 10 * k} y={seatY + 24 * k} width={20 * k} height={floor - seatY - 24 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} />)}
    </g>
  );
};
export const Pe = (c: Ctx, p: Pos, key?: string | number) => {
  const {chair, ...rest} = p, front = rest.view === 'front' || (!!rest.pose && FRONTP.includes(rest.pose)), k = p.scale * bodyK(p.who, p.age) * CHAR_K;
  return (
    <g key={key}>{chair && <ChairUnder p={p} k={k} front={front} />}<ShadowE x={p.x} floor={(p as {floor?: number}).floor} rx={190 * p.scale * bodyK(p.who, p.age) * CHAR_K} /><Person t={c.t} enter={c.l / 0.55} {...rest} /></g>
  );
};
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

const mk = (set: SetOut, cam: Cam, chars: React.ReactNode, blurK = 0.5, extra?: React.ReactNode) => (
  <Stage cam={cam} far={set.far} mid={set.mid} chars={<>{chars}{extra}</>} front={set.front} fg={set.fg} rim={set.rim} blurK={0} />
);
type CamArg = Cam | [Cam, Cam];
const camOf = (c: Ctx, a: CamArg) => { const k = Array.isArray(a) ? mixCam(a[0], a[1], c.p) : a; const push = Array.isArray(a) ? 1 : 1 + 0.07 * ease(Math.min(1, c.p)); return {cx: k.cx + Math.sin(c.t * 0.9) * 9 + (Array.isArray(a) ? 0 : (c.p - 0.5) * 40), cy: k.cy + Math.sin(c.t * 1.3 + 1) * 6, z: k.z * push}; };
export const SC = {
  liv: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof livingRoom>[0], 't'>, chars: React.ReactNode, blurK = 0.5) => mk(merge(livingRoom({t: c.t, ...o}), livingDetail({t: c.t, warm: o.warm})), camOf(c, cam), chars, blurK),
  str: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof street>[0], 't'>, chars: React.ReactNode = null) => mk(merge(street({t: c.t, ...o}), streetDetail({t: c.t, night: o.night, sunset: o.sunset, season: o.season})), camOf(c, cam), chars),
  hos: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof hospital>[0], 't'>, chars: React.ReactNode = null) => mk(merge(hospital({t: c.t, ...o}), hospitalDetail()), camOf(c, cam), chars),
  pty: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof party>[0], 't'>, chars: React.ReactNode = null) => mk(party({t: c.t, ...o}), camOf(c, cam), chars),
  aud: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof auditorium>[0], 't'>, chars: React.ReactNode = null) => mk(auditorium({t: c.t, ...o}), camOf(c, cam), chars),
  off: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof office>[0], 't'>, chars: React.ReactNode = null) => mk(merge(office({t: c.t, ...o}), officeDetail({t: c.t})), camOf(c, cam), chars),
  door: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof leoDoor>[0], 't'>, chars: React.ReactNode = null) => mk(merge(leoDoor({t: c.t, ...o}), doorDetail()), camOf(c, cam), chars),
  room: (c: Ctx, cam: CamArg, chars: React.ReactNode = null) => mk(merge(leoRoom({t: c.t}), roomDetail({t: c.t})), camOf(c, cam), chars),
  stairs: (c: Ctx, cam: CamArg, chars: React.ReactNode = null) => mk(merge(stairs({t: c.t}), stairsDetail()), camOf(c, cam), chars),
  tea: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof teaStall>[0], 't'>, chars: React.ReactNode = null) => mk(merge(teaStall({t: c.t, ...o}), teaDetail({t: c.t, sunset: o.sunset})), camOf(c, cam), chars),
  park: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof park>[0], 't'>, chars: React.ReactNode = null, extra?: React.ReactNode) => mk(merge(park({t: c.t, ...o}), parkDetail({t: c.t, season: o.season})), camOf(c, cam), chars, 1, extra),
  kit: (c: Ctx, cam: CamArg, o: Omit<Parameters<typeof kitchen>[0], 't'>, chars: React.ReactNode = null) => mk(merge(kitchen({t: c.t, ...o}), kitchenDetail({t: c.t})), camOf(c, cam), chars),
  flat: (c: Ctx, cam: CamArg, chars: React.ReactNode = null) => mk(leoFlat({t: c.t}), camOf(c, cam), chars),
  fac: (c: Ctx, cam: CamArg, chars: React.ReactNode = null) => mk(factory({t: c.t}), camOf(c, cam), chars),
  drv: (c: Ctx, cam: CamArg, chars: React.ReactNode = null) => mk(drive({t: c.t}), camOf(c, cam), chars),
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
