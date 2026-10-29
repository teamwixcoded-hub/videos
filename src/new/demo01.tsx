import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cam, Light, Obj} from './kit';
import {Room, ROOM} from './set';
import {Rig3Actor, RKey, Pose, clipPose} from './rig3';
import {RIG3_CLIPS} from './rig3data';
import {KeyPhrases} from '../components/KeyPhrases';
import {KP_ACT1} from '../keyphrases';
import {SfxTrack} from '../components/Sfx';
import {ACT1_SFX} from '../scenes/act1Sfx';
import {Music} from '../components/Music';
import {S} from '../easing';

// ============================================================================================
// DEMO 01: the first minute of Act 1, same beats / captions / sounds / camera as the image video, but REAL animation:
// every frame is a blend of joint angles of the layered SVG rig (rig3). All times are SCRIPT seconds (1 script s = 0.6 real s).
// ============================================================================================
export const DEMO_FRAMES = S(100);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SC = 0.6;                                       // script -> real seconds
const FLOOR = ROOM.FLOOR;
const GREEN_X = 770, RED_X = 1960;

type Raw = {t: number; pose: Pose; dur?: number};     // t, dur in SCRIPT seconds
const toKeys = (raw: Raw[]): RKey[] => raw.slice().sort((a, b) => a.t - b.t).map((r) => ({t: r.t * SC, pose: r.pose, dur: (r.dur ?? 0.8) * SC}));
// a looping clip played between two script times; each segment blends into the next so the motion is continuous
const seg = (clip: string, from: number, to: number, over: Pose = {}, speed = 1): Raw[] => {
  const c = RIG3_CLIPS[clip], period = (c.seconds / SC) / speed, out: Raw[] = [];
  for (let n = 0; from + n * period < to; n++) {
    c.frames.forEach((fr: any, j: number) => {
      const t = from + n * period + fr.at * period;
      if (t < to && !(n > 0 && j === 0 && fr.at === 0 && false)) out.push({t, pose: {...fr.pose, ...over}, dur: (c.frames[Math.min(j + 1, c.frames.length - 1)].at - fr.at || 0.25) * period});
    });
  }
  return out;
};
const one = (clip: string, frame: number, t: number, over: Pose = {}, dur = 0.8): Raw => ({t, pose: {...clipPose(clip, frame), ...over}, dur});

// ---- Green: opens the book, reads, turns pages; frustrated at night one ----
const READ = {face: 'face-three-quarter'};
const greenRaw: Raw[] = [
  one('sitRelaxed', 0, 0, {}, 0.5),
  {t: 1.8, pose: {...clipPose('sitRelaxed', 0), prop: 'book', rightHand: 'hand-book', rs: -25, re: -70, rw: 70, expression: 'neutral'}, dur: 1.2},   // takes the book
  ...seg('readingBook', 3.6, 8.2, READ),
  ...seg('pageTurn', 8.2, 9.8, READ),
  ...seg('readingBook', 9.8, 16.2, READ),
  ...seg('pageTurn', 16.2, 17.8, READ),
  ...seg('readingBook', 17.8, 24.0, {...READ, expression: 'expression-smile'}),
  ...seg('pageTurn', 24.0, 25.6, READ),
  ...seg('readingBook', 25.6, 32.0, READ),
  ...seg('pageTurn', 32.0, 33.6, READ),
  ...seg('readingBook', 33.6, 82.4, READ),
  one('sitTired', 1, 83.0, {}, 0.5),                                                                    // the book closes, frustrated
  ...seg('sitTired', 84.0, 100, {expression: 'expression-worried'}, 0.7),
];
// ---- Red: tired on the bed, grabs the phone, scrolls, lies back ----
const redRaw: Raw[] = [
  ...seg('phoneOnBedSit', 0, 7.5, {expression: 'expression-tired'}, 0.7),
  ...seg('phoneOnBedSit', 7.5, 35.0, {face: 'face-three-quarter', expression: 'expression-worried'}, 0.7),
  one('phoneReach', 1, 35.4, {face: 'face-three-quarter'}, 1.0),
  one('phoneGrab', 1, 36.4, {face: 'face-three-quarter'}, 0.45),
  one('phoneLift', 1, 37.4, {face: 'face-three-quarter'}, 0.9),
  one('phoneHeld', 1, 38.6, {}, 0.9),
  ...seg('scrollingPhone', 39.6, 44.0),
  ...seg('scrollingPhone', 44.0, 50.0, {expression: 'expression-smile'}),
  ...seg('scrollingPhone', 50.0, 72.0, {expression: 'expression-laugh'}),
  ...seg('scrollingPhone', 72.0, 73.0),
  one('lyingPhone', 0, 74.2, {}, 2.0),
  ...seg('lyingPhone', 76.0, 100, {}, 0.7),
];

const cam = [
  {t: 0, x: 1440, y: 560, z: 0.9}, {t: 8, x: 1440, y: 560, z: 0.96}, {t: 12, x: 1930, y: 650, z: 1.5}, {t: 16.5, x: 1960, y: 610, z: 2.0},
  {t: 22.5, x: 1960, y: 610, z: 2.1}, {t: 25, x: 650, y: 300, z: 3.0}, {t: 29.5, x: 650, y: 296, z: 3.1}, {t: 31.5, x: 800, y: 700, z: 1.55},
  {t: 34, x: 810, y: 700, z: 1.55}, {t: 35.2, x: 1440, y: 580, z: 0.92}, {t: 36.8, x: 1960, y: 680, z: 1.5}, {t: 40, x: 1960, y: 660, z: 2.1},
  {t: 52, x: 1950, y: 660, z: 2.15}, {t: 58, x: 1930, y: 660, z: 1.9},
  {t: 60.4, x: 1930, y: 660, z: 1.9}, {t: 61.6, x: 800, y: 700, z: 1.55}, {t: 71, x: 810, y: 700, z: 1.6},
  {t: 72.8, x: 1440, y: 580, z: 0.92}, {t: 74.2, x: 1960, y: 700, z: 1.5}, {t: 82, x: 1960, y: 700, z: 1.6},
  {t: 83.4, x: 800, y: 700, z: 1.6}, {t: 88, x: 805, y: 700, z: 1.65}, {t: 89.4, x: 1960, y: 700, z: 1.7},
  {t: 94, x: 1440, y: 570, z: 0.9}, {t: 100, x: 1440, y: 560, z: 0.98},
];

const Tag: React.FC<{text: string; sub: string; x: number; y: number; at: number; color: string}> = ({text, sub, x, y, at, color}) => {
  const f = useCurrentFrame(), {fps} = useVideoConfig();
  const s = spring({frame: f - S(at), fps, config: {damping: 11, stiffness: 140}});
  const o = interpolate(f, [S(at + 3), S(at + 4.2)], [1, 0], clamp);
  if (f < S(at)) return null;
  return (
    <div style={{position: 'absolute', left: x - 170, top: y, width: 340, textAlign: 'center', transform: `scale(${s})`, opacity: o}}>
      <div style={{display: 'inline-block', padding: '8px 22px', borderRadius: 10, background: color, border: '3px solid #1d1822', font: "900 40px/1.1 'Segoe UI Black', Arial Black, sans-serif", color: '#1d1822', letterSpacing: 2, boxShadow: '0 8px 24px rgba(0,0,0,.45)'}}>{text}</div>
      <div style={{font: "italic 600 26px/1.3 'Segoe UI', sans-serif", color: '#f4efe6', marginTop: 6, textShadow: '0 3px 12px #000'}}>{sub}</div>
    </div>
  );
};
const Meter: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame(), {fps} = useVideoConfig();
  const a = S(at), s = spring({frame: f - a, fps, config: {damping: 14, stiffness: 110}});
  const fill = interpolate(f, [a + 6, a + 50], [0.08, 0.94], clamp);
  const gone = interpolate(f, [S(55.5), S(57)], [1, 0], clamp);
  if (f < a) return null;
  return (
    <div style={{position: 'absolute', right: 150, top: 220, width: 76, height: 520, transform: `scale(${s})`, transformOrigin: 'bottom center', opacity: gone}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 38, background: 'rgba(15,12,30,.7)', border: '4px solid #f4efe6'}} />
      <div style={{position: 'absolute', left: 8, right: 8, bottom: 8, height: `${fill * 100 - 3}%`, borderRadius: 30, background: 'linear-gradient(0deg,#ff8a2a,#ffd23f)', boxShadow: '0 0 40px #ffb02a'}} />
      <div style={{position: 'absolute', left: -50, right: -50, top: -58, textAlign: 'center', font: "900 32px/1 'Segoe UI Black', Arial Black, sans-serif", color: '#ffd23f', letterSpacing: 3, textShadow: '0 4px 16px #000'}}>DOPAMINE</div>
    </div>
  );
};

export const Demo01: React.FC = () => {
  const f = useCurrentFrame();
  const phoneGone = f >= S(36.4);
  const calFlip = f >= S(26.4);
  const glow = interpolate(f, [S(37.8), S(41)], [0, 1], clamp);
  const lampOff = interpolate(f, [S(97.4), S(99)], [1, 0.12], clamp);
  const dark = interpolate(f, [S(97.4), S(99.5)], [0, 0.45], clamp);
  const clockMin = f >= S(78.9) ? 2 * 60 : 23 * 60 + 20 + Math.floor(f / 30 / 2.2);
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <Cam w={ROOM.W} h={ROOM.H} keys={cam}>
        <Room minutes={clockMin} calPage={calFlip ? 7 : null} warm={lampOff} />
        <Rig3Actor who="green" keys={toKeys(greenRaw)} x={GREEN_X} y={FLOOR} k={1.55} stage="chair" seed={1} />
        {!phoneGone && <Obj name="phone" x={RED_X + 42} y={FLOOR - 140} size={90} rot={-78} float={0} flat />}
        <Rig3Actor who="red" keys={toKeys(redRaw)} x={RED_X} y={FLOOR} k={1.55} flip stage="bed" seed={2} />
        <Light x={RED_X - 70} y={740} r={290} color="rgba(120,215,255,.45)" opacity={glow * 0.85} />
        <Obj name="bolt" x={RED_X + 140} y={470} size={170} at={50} until={55} rot={10} flat />
        <Tag text="THE READER" sub="reads at night" x={GREEN_X + 60} y={430} at={7} color="#ffd23f" />
        <Tag text="THE SCROLLER" sub="scrolls at night" x={RED_X - 90} y={430} at={7.6} color="#7fc2ff" />
      </Cam>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: `rgba(4,5,14,${dark})`, pointerEvents: 'none'}} />
      <Meter at={50} />
      <KeyPhrases lines={KP_ACT1.filter((k) => k.from < 100)} />
      <SfxTrack cues={ACT1_SFX.filter((c) => c.at < 100)} />
      <Music track="wonder" frames={DEMO_FRAMES} vol={0.2} />
    </AbsoluteFill>
  );
};
