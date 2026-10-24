import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cam, Furn, Light, Obj} from './kit';
import {Actor2, K2, toLocal} from './kit2';
import {ARMCHAIR_SIDE} from './seats';
import {Room, ROOM} from './set';
import {KeyPhrases} from '../components/KeyPhrases';
import {KP_ACT1} from '../keyphrases';
import {SfxTrack} from '../components/Sfx';
import {ACT1_SFX} from '../scenes/act1Sfx';
import {Music} from '../components/Music';
import {S} from '../easing';

// ============================================================================================
// ACT 1, first minute, rebuilt as ONE continuous room with a moving camera (like the original):
//   wide two-shot -> push to Red ("ONE SMALL CHOICE") -> calendar insert ("ONE YEAR LATER") -> Green reads
//   -> wide -> Red reaches, grabs the phone ("INSTANTLY") -> close-up, dopamine.
// Both men are turned 3/4 toward each other (head AND body), seated on real seats, holding things with wrapped fingers.
// All times are SCRIPT SECONDS so the captions (src/keyphrases.ts) and the music line up with the original.
// ============================================================================================
export const A1_FRAMES = S(58);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const H = 640, K = H / 430;
const GREEN = {x: 752, y: ROOM.FLOOR, h: H, flip: false};          // faces right, in the side-view armchair
const RED = {x: 1960, y: ROOM.FLOOR, h: H, flip: true};            // faces left, on the bed edge
const PHONE_ON_BED: [number, number] = [2004, 868];
const GREEN_HEAD: [number, number] = [800, 612], RED_HEAD: [number, number] = [1925, 610];
const rl = (p: [number, number]) => toLocal(p, RED);

const greenKeys: K2[] = [
  // reading: the book is held at the chest, tilted toward his face; he sees the pages, the camera sees the back cover and the page edge
  {t: 0, turn: 0.62, emo: 'neutral', hip: [150, 322], lean: -2, chest: 5, headTilt: 14, legL: {foot: [226, 405]}, legR: {foot: [248, 405]},
   armL: {reach: [204, 262], hand: 'hold'}, armR: {reach: [222, 268], hand: 'hold'}, look: [218, 232], hold: {name: 'book-back', at: 'mid'}},
  {t: 20, emo: 'determined'},
  {t: 26, headTilt: 11, emo: 'neutral'},
  {t: 31, emo: 'happy', headTilt: 14},
  {t: 33, armR: {reach: [236, 252], hand: 'hold'}, ease: 'snap'},          // turns a page
  {t: 34, armR: {reach: [222, 268], hand: 'hold'}, emo: 'determined'},
];
const redKeys: K2[] = [
  {t: 0, turn: 0.62, emo: 'tired', hip: [150, 311], lean: 12, chest: 10, headTilt: 20, legL: {foot: [214, 405]}, legR: {foot: [236, 405]},
   armL: {reach: [214, 322], hand: 'relaxed'}, armR: {reach: [232, 326], hand: 'relaxed'}, look: rl([1880, 960])},
  {t: 7.5, emo: 'worried', look: rl(GREEN_HEAD), headTilt: 8, ease: 'soft'},                          // notices Green
  {t: 12.6, emo: 'worried', look: rl(PHONE_ON_BED), chest: 6},                                          // ONE SMALL CHOICE: eyes to the phone
  {t: 16, emo: 'smug', look: rl(GREEN_HEAD)},
  {t: 19, emo: 'tired', look: rl(PHONE_ON_BED), lean: 12},
  {t: 24, emo: 'worried', look: rl(GREEN_HEAD)},
  {t: 31.5, emo: 'determined', look: rl(PHONE_ON_BED), lean: 18, chest: 12},
  {t: 35, hip: [138, 312], lean: 26, chest: 10, armL: {reach: rl([PHONE_ON_BED[0] - 4, PHONE_ON_BED[1] - 10]), hand: 'grip'}, emo: 'smug', ease: 'soft'},   // leans back and reaches for it
  {t: 36.4, armL: {reach: rl([PHONE_ON_BED[0] - 4, PHONE_ON_BED[1] - 10]), hand: 'grip'}, ease: 'snap'},                                                  // INSTANTLY: closes the hand
  // one hand holds the phone low with the elbow tucked in, the thumb swipes; the other hand rests on his knee; head bowed to the screen
  {t: 37.8, hip: [150, 311], lean: 8, chest: 8, headTilt: 26, emo: 'surprised', armL: {reach: [200, 252], hand: 'hold'}, armR: {reach: [222, 326], hand: 'relaxed'},
   look: [214, 246], hold: {name: 'phone-back', at: 'L'}, ease: 'snap'},
  {t: 40, emo: 'happy'},
  {t: 47, emo: 'laughing', chest: 2},
  {t: 55, emo: 'smug'},
];
const cam = [
  {t: 0, x: 1440, y: 560, z: 0.9}, {t: 8, x: 1440, y: 560, z: 0.96}, {t: 12, x: 1930, y: 650, z: 1.5}, {t: 16.5, x: 1960, y: 610, z: 2.0},
  {t: 22.5, x: 1960, y: 610, z: 2.1}, {t: 25, x: 650, y: 300, z: 3.0}, {t: 29.5, x: 650, y: 296, z: 3.1}, {t: 31.5, x: 800, y: 700, z: 1.55},
  {t: 34, x: 810, y: 700, z: 1.55}, {t: 35.2, x: 1440, y: 580, z: 0.92}, {t: 36.8, x: 1960, y: 680, z: 1.5}, {t: 40, x: 1960, y: 660, z: 2.1},
  {t: 52, x: 1950, y: 660, z: 2.15}, {t: 58, x: 1930, y: 660, z: 1.9},
];

const Tag: React.FC<{text: string; sub: string; x: number; y: number; at: number; color: string}> = ({text, sub, x, y, at, color}) => {
  const f = useCurrentFrame(), {fps} = useVideoConfig();
  const s = spring({frame: f - S(at), fps, config: {damping: 11, stiffness: 140}});
  const o = interpolate(f, [S(at + 3), S(at + 4.2)], [1, 0], clamp);
  if (f < S(at) || o <= 0) return null;
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
  if (f < a) return null;
  return (
    <div style={{position: 'absolute', right: 150, top: 220, width: 76, height: 520, transform: `scale(${s})`, transformOrigin: 'bottom center'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 38, background: 'rgba(15,12,30,.7)', border: '4px solid #f4efe6'}} />
      <div style={{position: 'absolute', left: 8, right: 8, bottom: 8, height: `${fill * 100 - 3}%`, borderRadius: 30, background: 'linear-gradient(0deg,#ff8a2a,#ffd23f)', boxShadow: '0 0 40px #ffb02a'}} />
      <div style={{position: 'absolute', left: -50, right: -50, top: -58, textAlign: 'center', font: "900 32px/1 'Segoe UI Black', Arial Black, sans-serif", color: '#ffd23f', letterSpacing: 3, textShadow: '0 4px 16px #000'}}>DOPAMINE</div>
    </div>
  );
};

export const Act1New: React.FC = () => {
  const f = useCurrentFrame();
  const phoneGone = f >= S(36.4);
  const calFlip = f >= S(26.4);
  const glow = interpolate(f, [S(37.8), S(41)], [0, 1], clamp);
  const clockMin = 23 * 60 + 20 + Math.floor(f / 30 / 2.2);
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <Cam w={ROOM.W} h={ROOM.H} keys={cam}>
        <Room minutes={clockMin} calPage={calFlip ? 7 : null} />
        {/* Green: side-view armchair, the reader */}
        <Actor2 id="green" pal="teal" {...GREEN} keys={greenKeys} seat={ARMCHAIR_SIDE} />
        {/* Red: the bed edge, the scroller */}
        <Furn name="bed" x={ROOM.BED_X} y={ROOM.FLOOR} w={560} flip flat />
        {!phoneGone && <Obj name="phone" x={PHONE_ON_BED[0]} y={PHONE_ON_BED[1] - 4} size={100} rot={-78} float={0} flat />}
        <Actor2 id="red" pal="coral" {...RED} keys={redKeys} />
        <Light x={RED.x - 70} y={740} r={290} color="rgba(120,215,255,.45)" opacity={glow * 0.85} />
        <Obj name="bolt" x={RED.x + 140} y={470} size={170} at={50} until={55} rot={10} flat />
        <Tag text="THE READER" sub="reads at night" x={GREEN.x + 60} y={440} at={7} color="#ffd23f" />
        <Tag text="THE SCROLLER" sub="scrolls at night" x={RED.x - 90} y={440} at={7.6} color="#7fc2ff" />
      </Cam>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none'}} />
      <Meter at={50} />
      <KeyPhrases lines={KP_ACT1} />
      <SfxTrack cues={ACT1_SFX.filter((c) => c.at < 58)} />
      <Music track="wonder" frames={A1_FRAMES} vol={0.2} />
    </AbsoluteFill>
  );
};
