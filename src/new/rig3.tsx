import React from 'react';
import {useCurrentFrame} from 'remotion';
import {RIG3_BASE, RIG3_CLIPS} from './rig3data';

// ============================================================================================
// Rig3: the hand-authored layered SVG rig (_reference/all_pose_rigs). A pose is a set of joint ANGLES
// (body, torso, head, ls/rs shoulders, le/re elbows, lw/rw wrists, lh/rh hips, lk/rk knees, la/ra ankles) plus
// discrete choices (face, expression, hand shapes, prop). Angles are blended frame by frame, so every in-between is real.
// ============================================================================================
export type Pose = Record<string, any>;
export const clipPose = (clip: string, frame = 0): Pose => ({...RIG3_CLIPS[clip].frames[frame].pose});
const num = (p: Pose, k: string) => Number(p[k] || 0);
const NUM_KEYS = ['body', 'y', 'torso', 'head', 'neck', 'ls', 'rs', 'le', 're', 'lw', 'rw', 'lh', 'rh', 'lk', 'rk', 'la', 'ra'];
export const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const o: Pose = {};
  for (const k in b) o[k] = NUM_KEYS.includes(k) ? num(a, k) + (num(b, k) - num(a, k)) * t : (t < 0.5 ? a[k] ?? b[k] : b[k]);
  return o;
};

const HOODIE: Record<string, string> = {
  // main (grey-blue) -> green hoodie for Green; Red keeps the grey
  '#647d85': '#6f9457', '#506c76': '#5c7c46', '#576c75': '#628249', '#667f86': '#759a5c', '#637b82': '#6b9054', '#536d79': '#5f8049', '#58727b': '#66884e',
  '#4a7c9d': '#3f6a96',
};
const MOTHER: Record<string, string> = {'#647d85': '#318c8b', '#4a7c9d': '#267d7c', '#506c76': '#2a7a79', '#576c75': '#2d8180', '#667f86': '#389493', '#637b82': '#348d8c', '#536d79': '#2b7f7e', '#58727b': '#2f8584'};
const MANAGER: Record<string, string> = {'#647d85': '#91b8d1', '#4a7c9d': '#3c4250', '#506c76': '#7fa6c0', '#576c75': '#86adc7', '#667f86': '#9bc0d9', '#637b82': '#94b9d2', '#536d79': '#80a7c1', '#58727b': '#88aec8'};
const HAIR: Record<string, string> = {
  manager: '<g><path d="M-44,-14 Q-47,-49 -17,-49 Q6,-57 29,-43 Q44,-33 43,-13 Q31,-38 11,-37 Q-11,-28 -32,-31 Z" fill="#3e302b" stroke="#321f1b" stroke-width="2.5"/></g>',
  mother: '<g><circle cx="-34" cy="-30" r="17" fill="#392723" stroke="#321f1b" stroke-width="2.5"/><path d="M-44,-15 Q-50,-58 -13,-52 Q22,-56 41,-29 Q15,-40 -8,-32 Q-23,-20 -44,-15 Z" fill="#392723" stroke="#321f1b" stroke-width="2"/></g>',
};

export type Who = 'red' | 'green' | 'mother' | 'manager';
// the torso is a gradient: each character gets its own gradient id (ids are global in the page) and its own stops
const STOPS: Record<Who, [string, string, string] | null> = {red: null, green: ['#a4cf7c', '#6f9d4f', '#4b7233'], mother: ['#62c1bf', '#318c8b', '#1f6665'], manager: ['#cfe3f0', '#94bad3', '#6c92ad']};
const baseFor = (who: Who) => {
  let s = RIG3_BASE.main.split('cloth-gloss').join('cloth-gloss-' + who);
  const st = STOPS[who];
  if (st) s = s.replace('#89b8ca', st[0]).replace('#5b7d91', st[1]).replace('#3f596b', st[2]);
  const map = who === 'green' ? HOODIE : who === 'mother' ? MOTHER : who === 'manager' ? MANAGER : null;
  if (map) for (const [a, b] of Object.entries(map)) s = s.split(a).join(b);
  if (who === 'mother' || who === 'manager') s = s.replace('<g id="face-angle">', HAIR[who] + '<g id="face-angle">');
  return s;
};
const BASES: Partial<Record<Who, string>> = {};

const setT = (s: string, id: string, t: string) => s.replace(new RegExp(`(<g id="${id}"[^>]*?transform=")[^"]*(")`), `$1${t}$2`);
export const rig3Inner = (p: Pose, who: Who): string => {
  let s = (BASES[who] ??= baseFor(who));
  const f1 = (x: number) => x.toFixed(2);
  const body = num(p, 'body');
  s = setT(s, 'pelvis', `translate(0 ${f1(265 + num(p, 'y'))}) rotate(${f1(body)})`);
  s = setT(s, 'torso', `rotate(${f1(num(p, 'torso'))})`);
  s = setT(s, 'neck', `translate(0 -130) rotate(${f1(num(p, 'neck'))})`);
  s = setT(s, 'head', `translate(0 -44) rotate(${f1(num(p, 'head'))})`);
  s = setT(s, 'left-upper-arm', `rotate(${f1(num(p, 'ls'))})`);
  s = setT(s, 'right-upper-arm', `rotate(${f1(num(p, 'rs'))})`);
  s = setT(s, 'left-forearm', `translate(-4 54) rotate(${f1(num(p, 'le'))})`);
  s = setT(s, 'right-forearm', `translate(3 54) rotate(${f1(num(p, 're'))})`);
  s = setT(s, 'left-wrist', `translate(0 51) rotate(${f1(num(p, 'lw'))})`);
  s = setT(s, 'right-wrist', `translate(0 51) rotate(${f1(num(p, 'rw'))})`);
  s = setT(s, 'left-thigh', `rotate(${f1(num(p, 'lh'))})`);
  s = setT(s, 'right-thigh', `rotate(${f1(num(p, 'rh'))})`);
  s = setT(s, 'left-shin', `translate(0 67) rotate(${f1(num(p, 'lk'))})`);
  s = setT(s, 'right-shin', `translate(0 67) rotate(${f1(num(p, 'rk'))})`);
  s = setT(s, 'left-foot', `translate(0 59) rotate(${f1(-(num(p, 'lh') + num(p, 'lk') + body) + num(p, 'la'))})`);
  s = setT(s, 'right-foot', `translate(0 59) rotate(${f1(-(num(p, 'rh') + num(p, 'rk') + body) + num(p, 'ra'))})`);
  const hasExp = p.expression && p.expression !== 'neutral' && p.expression !== 'expression-neutral' && p.face !== 'face-sleep';
  s = s.replace('<use id="current-face" href="#face-front"/>', `<use id="current-face" href="#${p.face}${hasExp ? '-nm' : ''}"/>`);
  s = s.replace('<g id="face-expression"/>', `<g id="face-expression">${p.expression && p.expression !== 'neutral' ? `<use href="#${p.expression}"/>` : ''}</g>`);
  s = s.replace('<use id="left-hand-shape" href="#hand-open"/>', `<use id="left-hand-shape" href="#${p.leftHand}"/>`);
  s = s.replace('<use id="right-hand-shape" href="#hand-open"/>', `<use id="right-hand-shape" href="#${p.rightHand}"/>`);
  const prop = p.prop || 'none';
  const propHref = prop === 'phone' ? 'phone-object' : prop === 'book' ? 'book-object' : 'toothbrush-object';
  const propT = prop === 'book' ? 'translate(16 -2) rotate(-6)' : prop === 'toothbrush' ? 'translate(5 -8) rotate(12)' : 'translate(12 0) rotate(3)';
  s = s.replace('<g id="right-hand-prop" style="display:none"><use id="held-prop" href="#phone-object" transform="translate(12 1) rotate(5)"/></g>',
    `<g id="right-hand-prop" style="display:${prop === 'none' ? 'none' : 'inline'}"><use id="held-prop" href="#${propHref}" transform="${propT}"/></g>`);
  return s;
};

// stage pieces (from the rig demo) in rig space, drawn behind the character
export const STAGE: Record<string, string> = {
  bed: '<rect x="48" y="320" width="380" height="47" rx="7" fill="#eee9de" stroke="#46392e" stroke-width="3"/><rect x="73" y="368" width="12" height="27" fill="#a47c53"/><rect x="392" y="368" width="12" height="27" fill="#a47c53"/>',
  chair: '<rect x="153" y="263" width="68" height="76" rx="12" fill="#a85e35" stroke="#43271d" stroke-width="3"/><rect x="168" y="339" width="74" height="17" rx="5" fill="#d7a753" stroke="#43271d" stroke-width="3"/><rect x="179" y="355" width="10" height="47" fill="#61442e"/>',
  none: '',
};

// ---- timeline actor ------------------------------------------------------------------------
export type RKey = {t: number; pose: Pose; dur?: number};     // t in REAL seconds; dur = seconds to blend INTO this pose (default 0.5)
const ease = (u: number) => (u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u));
export const Rig3Actor: React.FC<{who: Who; keys: RKey[]; x: number; y: number; k?: number; flip?: boolean; stage?: string; frontStage?: boolean; seed?: number; opacity?: number; fps?: number}> = ({who, keys, x, y, k = 1.5, flip = false, stage = 'none', seed = 0, opacity = 1, fps = 30}) => {
  const f = useCurrentFrame(), sec = f / fps;
  let i = 0;
  keys.forEach((kk, j) => { if (sec >= kk.t) i = j; });
  const to = keys[i], from = keys[Math.max(0, i - 1)];
  const u = i === 0 ? 1 : ease((sec - to.t) / (to.dur ?? 0.5));
  const p = mixPose(from.pose, to.pose, u);
  // life: breathing and a slow head drift, never a freeze
  const br = Math.sin((f + seed * 19) / 22), dr = Math.sin((f + seed * 41) / 53);
  p.torso = num(p, 'torso') + br * 0.7; p.head = num(p, 'head') + dr * 1.4; p.y = num(p, 'y') + br * 0.5;
  // blink: a quick squash of the eyes is not available in the rig, so blinks are done by the face swap below
  const blinkPhase = (f + seed * 23) % 120;
  if (blinkPhase < 4 && p.face !== 'face-sleep') p.face = 'face-sleep';
  const inner = rig3Inner(p, who);
  return (
    <div style={{position: 'absolute', left: x - 240 * k, top: y - 412 * k, width: 480 * k, height: 480 * k, opacity, transform: flip ? 'scaleX(-1)' : undefined, pointerEvents: 'none'}}>
      <svg viewBox="0 0 480 480" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}
        dangerouslySetInnerHTML={{__html: `<g>${STAGE[stage] ?? ''}</g>` + inner}} />
    </div>
  );
};
