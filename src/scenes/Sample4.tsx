import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {FrameSeq, SeqFrame} from '../components/FrameSeq';
import {Camera, Sticker, focus} from '../vfx/Motion';
import {Dust, Grain, Vignette} from '../vfx/Atmosphere';
import {Glow} from './common';
import {DopamineMeter, NarrationCaptions, PhoneInset, ThoughtTower, TitleCard, WallClock, CaptionLine} from '../components/Props4';
import {S, TIME_SCALE} from '../easing';
import {SfxTrack} from '../components/Sfx';
import {SAMPLE4_SFX} from './sample4Sfx';

// ============================================================================================
// One continuous room. Green (left, armchair) and Red (right, bed) live in the SAME shot, each
// playing their own frame sequence; a soft light-falloff blends warm lamp light into cold phone
// light, so there is no hard split and no cut. The camera glides between them.
// Everything below is in SECONDS (S() converts to frames) and follows the script's narration pace.
// ============================================================================================

const GREEN_HEAD = [346, 470] as const;
const RED_HEAD = [1478, 490] as const;
const CLOCK = [958, 292] as const;

// ---- Red: slumped -> glance -> reach -> grab -> lift -> glow -> laugh -> relax ----
const RED: SeqFrame[] = [
  {src: 'SC_R1', at: S(0)},
  {src: 'SC_R2', at: S(16.4), fade: 24},
  {src: 'SC_R2b', at: S(35.6), fade: 18},
  {src: 'SC_R3', at: S(36.9), fade: 16},
  {src: 'SC_R3b', at: S(38.3), fade: 16},
  {src: 'SC_R4', at: S(39.5), fade: 16},
  {src: 'SC_R5', at: S(41.0), fade: 20},
  {src: 'SC_R7', at: S(43.0), fade: 12},
  {src: 'SC_R5', at: S(45.0), fade: 14},
  {src: 'SC_R6', at: S(46.0), fade: 26},
  {src: 'SC_R5', at: S(50.0), fade: 16},
  {src: 'SC_R7', at: S(52.0), fade: 12},
  {src: 'SC_R6', at: S(54.2), fade: 22},
  {src: 'SC_R7', at: S(66.0), fade: 12},
  {src: 'SC_R6', at: S(68.4), fade: 22},
];
// ---- Green: reading -> re-reading -> eyes to the clock -> yawn -> sleepy -> sigh ----
const GREEN: SeqFrame[] = [
  {src: 'SC_G1', at: S(0)},
  {src: 'SC_G2', at: S(62.0), fade: 14},
  {src: 'SC_G1', at: S(63.8), fade: 14},
  {src: 'SC_G2', at: S(65.2), fade: 14},
  {src: 'SC_G3', at: S(67.0), fade: 18},
  {src: 'SC_G4a', at: S(71.2), fade: 14},
  {src: 'SC_G4', at: S(72.1), fade: 12},
  {src: 'SC_G5', at: S(74.6), fade: 20},
  {src: 'SC_G6', at: S(77.0), fade: 24},
];
const RED_BLINK = {twins: {SC_R1: 'SC_R1b', SC_R6: 'SC_R6b'}, seed: 'red'};
const GREEN_BLINK = {twins: {SC_G1: 'SC_G1b'}, seed: 'green'};

// ---- camera: where to look, when. Slow moves, long holds. ----
const CAM = [
  focus(S(0), 960, 560, 1.0),
  focus(S(9), 960, 560, 1.06),
  focus(S(14), 1260, 600, 1.2),
  focus(S(17.5), 1450, 585, 1.5),
  focus(S(19), 1450, 585, 1.52),
  focus(S(24), 400, 600, 1.5),
  focus(S(25), 400, 600, 1.52),
  focus(S(31), 960, 560, 1.05),
  focus(S(35), 960, 560, 1.07),
  focus(S(38.5), 1450, 575, 1.6),
  focus(S(41.5), 1450, 560, 1.75),
  focus(S(49), 1450, 555, 1.8),
  focus(S(57), 1450, 545, 1.95),
  focus(S(58), 1450, 545, 1.95),
  focus(S(61.5), 420, 590, 1.65),
  focus(S(66), 420, 585, 1.7),
  focus(S(68.4), CLOCK[0], CLOCK[1] + 30, 2.9),
  focus(S(70.8), CLOCK[0], CLOCK[1] + 30, 2.95),
  focus(S(72.6), 400, 570, 1.85),
  focus(S(80), 430, 600, 1.6),
];

const CAPTIONS: CaptionLine[] = [
  {text: 'Same room.', from: 0.8, to: 2.6},
  {text: 'Same night.', from: 3.0, to: 4.8},
  {text: 'Same tired eyes after a long day.', from: 5.2, to: 8.6},
  {text: 'Two versions of the same man… and one small choice.', from: 9.6, to: 15.4},
  {text: 'One picks up his phone.', from: 16.0, to: 19.0},
  {text: 'The other picks up a book.', from: 19.6, to: 23.0},
  {text: "One year from now, they won't recognize each other.", from: 24.2, to: 30.5},
  {text: 'The phone feels good. Instantly.', from: 35.2, to: 39.2},
  {text: 'A video. A laugh. Another one.', from: 40.2, to: 44.8},
  {text: 'His shoulders drop.', from: 46.0, to: 48.4},
  {text: 'His brain gets a small reward, a little hit of dopamine, and it asks for one more.', from: 49.4, to: 57.4},
  {text: "The book doesn't feel good.", from: 58.2, to: 61.4},
  {text: 'He reads the same line three times.', from: 62.0, to: 66.0},
  {text: 'His eyes drift to the clock.', from: 67.0, to: 70.5},
  {text: 'Ten pages feel like a hundred.', from: 71.2, to: 75.2},
];

export const SAMPLE4_FRAMES = S(80);

// dissolves speed up with the timeline too
const quick = (frames: SeqFrame[]): SeqFrame[] => frames.map((f) => (f.fade ? {...f, fade: Math.max(6, Math.round(f.fade * 0.7))} : f));

const REACTIONS: {at: number; x: number; y: number; name: 'heart' | 'sparkle' | 'bolt'; size: number}[] = [
  {at: 49.6, x: 1360, y: 400, name: 'heart', size: 74},
  {at: 51.0, x: 1590, y: 360, name: 'sparkle', size: 64},
  {at: 52.4, x: 1330, y: 330, name: 'heart', size: 80},
  {at: 53.8, x: 1620, y: 430, name: 'bolt', size: 60},
  {at: 55.2, x: 1400, y: 300, name: 'heart', size: 70},
  {at: 56.2, x: 1560, y: 330, name: 'sparkle', size: 66},
];

export const Sample4: React.FC = () => {
  const frame = useCurrentFrame();
  const lamp = 0.8 + 0.2 * Math.sin(frame / 31) + random(`lamp-${Math.floor(frame / 5)}`) * 0.05;
  const phoneLit = interpolate(frame, [S(39.5), S(41.5)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flick = phoneLit * (0.8 + random(`ph-${Math.floor(frame / 2)}`) * 0.2);
  // clock time: stands still until the camera arrives, then minutes visibly pass
  const clockMin = 11 * 60 + 40 + interpolate(frame, [S(68.2), S(71)], [0, 4.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [S(78.5), S(80)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={CAM} handheld={0.45}>
        {/* Green path: the whole room image, warm */}
        <FrameSeq frames={quick(GREEN)} fade={7} blink={GREEN_BLINK} />
        {/* Red path: the same room in cold light, blended in through a soft falloff */}
        <AbsoluteFill style={{WebkitMaskImage: 'linear-gradient(to right, transparent 40%, #000 60%)', maskImage: 'linear-gradient(to right, transparent 40%, #000 60%)'}}>
          <FrameSeq frames={quick(RED)} fade={7} blink={RED_BLINK} />
        </AbsoluteFill>

        <WallClock minutes={clockMin} x={CLOCK[0]} y={CLOCK[1]} />

        {/* living light on top of the keyframes */}
        <Glow x={440} y={470} r={520} color="rgba(255,190,100,0.22)" opacity={lamp * 0.6} />
        <Glow x={RED_HEAD[0]} y={RED_HEAD[1] + 140} r={420} color="rgba(120,180,255,0.4)" opacity={flick * 0.55} />
        <Dust count={22} area={{x: 40, y: 220, w: 760, h: 700}} seed="lamp" />

        {/* the reward lands: reactions drift up from his phone */}
        {REACTIONS.map((r, i) => (
          <Sticker key={i} name={r.name} x={r.x} y={r.y} size={r.size} at={S(r.at)} mode="float" life={110} />
        ))}
        <ThoughtTower from={S(71.6)} build={70} x={680} y={440} />
      </Camera>

      <PhoneInset from={S(40.4)} to={S(46)} x={250} y={520} swipes={[S(41.8), S(43.6), S(45.0)]} />
      <DopamineMeter from={S(49.4)} hits={[S(49.8), S(51.3), S(52.8), S(54.3), S(55.8)]} x={110} y={300} />
      <SfxTrack cues={SAMPLE4_SFX} />
      <TitleCard from={S(0.6)} to={S(8.5)} />
      <NarrationCaptions lines={CAPTIONS.map((l) => ({...l, from: l.from * TIME_SCALE, to: l.to * TIME_SCALE}))} />
      <Vignette strength={0.3} />
      <Grain opacity={0.1} />
      <AbsoluteFill style={{background: '#000', opacity: fadeOut, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
