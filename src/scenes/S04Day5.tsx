import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {FrameSeq, SeqFrame} from '../components/FrameSeq';
import {Camera, CamKey, focus} from '../vfx/Motion';
import {Dust, Grain, Steam, Vignette} from '../vfx/Atmosphere';
import {GradeDay, GradeNight, GradeWarm} from '../components/Lighting';
import {NarrationCaptions, TimeStamp, CaptionLine} from '../components/Props4';
import {SfxTrack, Cue} from '../components/Sfx';
import {TypoS04} from '../typography';
import {Glow} from './common';
import {pop, whip} from '../transitions';
import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// S04 · DAY 5. A montage in three rooms (bed, kitchen, bathroom) where the phone is in every
// moment, then Green in the same chair with the same tea. Times are script seconds (S() scales them).
// ============================================================================================

type Grade = 'day' | 'night' | 'warm';

const Graded: React.FC<{grade: Grade; children: React.ReactNode; warm?: number}> = ({grade, children, warm = 1}) =>
  grade === 'night' ? <GradeNight>{children}</GradeNight> : grade === 'warm' ? <GradeWarm lampX={440} lampY={470} warm={warm}>{children}</GradeWarm> : <GradeDay>{children}</GradeDay>;

// One camera shot over a frame sequence, with the lighting for its room and optional overlays in the camera's space.
const Shot: React.FC<{frames: SeqFrame[]; grade: Grade; cam: CamKey[]; blink?: {twins: Record<string, string>; seed: string}; glow?: [number, number, number]; children?: React.ReactNode}> = ({frames, grade, cam, blink, glow, children}) => {
  const frame = useCurrentFrame();
  const flick = 0.75 + random(`sh-${Math.floor(frame / 2)}`) * 0.25;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={cam} handheld={0.45}>
        <Graded grade={grade}>
          <FrameSeq frames={frames} fade={7} blink={blink} />
        </Graded>
        {glow && <Glow x={glow[0]} y={glow[1]} r={glow[2]} color="rgba(110,175,255,0.8)" opacity={0.8 * flick} />}
        {children}
      </Camera>
    </AbsoluteFill>
  );
};

// ---- the shots ----
const T_WHIP = 14, T_POP = 8;

const BedMorning: React.FC = () => (
  <Shot
    grade="day"
    frames={[{src: 'FL_N3', at: 0}, {src: 'FL_N1', at: S(2.0), fade: 14}]}
    cam={[focus(0, 1500, 650, 1.45), focus(S(6.6), 1500, 650, 1.62)]}
    glow={[1580, 700, 280]}
  />
);
const BedNight: React.FC = () => (
  <Shot
    grade="night"
    frames={[{src: 'FL_N1', at: 0}, {src: 'FL_N2', at: S(2.0), fade: 12}]}
    cam={[focus(0, 1500, 650, 1.5), focus(S(3.6), 1500, 650, 1.66)]}
    glow={[1580, 700, 420]}
  />
);
const Kitchen: React.FC = () => (
  <Shot
    grade="day"
    frames={[{src: 'FL_K1', at: 0}, {src: 'FL_K2', at: S(1.7), fade: 10}, {src: 'FL_K1', at: S(2.9), fade: 10}]}
    cam={[focus(0, 880, 560, 1.5), focus(S(4.0), 880, 550, 1.7)]}
  />
);
const Bathroom: React.FC = () => (
  <Shot
    grade="day"
    frames={[{src: 'FL_B1', at: 0}, {src: 'FL_B2', at: S(1.6), fade: 10}, {src: 'FL_B1', at: S(2.7), fade: 10}]}
    cam={[focus(0, 1230, 520, 1.6), focus(S(4.0), 1230, 520, 1.82)]}
  />
);
const BedNight2: React.FC = () => (
  <Shot
    grade="night"
    frames={[{src: 'FL_N2', at: 0}, {src: 'FL_N3', at: S(1.9), fade: 14}]}
    cam={[focus(0, 1500, 650, 1.4), focus(S(3.8), 1500, 650, 1.58)]}
    glow={[1580, 700, 420]}
  />
);

// "The days start to blur": fast cuts of the same moments, each a little closer than the last
const BLUR: {src: string; grade: Grade; fx: number; fy: number}[] = [
  {src: 'FL_K1', grade: 'day', fx: 880, fy: 560},
  {src: 'FL_B1', grade: 'day', fx: 1230, fy: 520},
  {src: 'FL_N1', grade: 'night', fx: 1500, fy: 650},
  {src: 'FL_N2', grade: 'night', fx: 1500, fy: 650},
];
const Blur: React.FC = () => {
  const d = 22; // 4 cuts x 22 frames (the last holds 2 more) keeps the old 90-frame length
  return (
    <TransitionSeries>
      {BLUR.flatMap((b, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={i < BLUR.length - 1 ? d + 6 : d + 2}>
            <Shot grade={b.grade} frames={[{src: b.src, at: 0}]} cam={[focus(0, b.fx, b.fy, 1.5 + i * 0.05), focus(d, b.fx, b.fy, 1.6 + i * 0.05)]} />
          </TransitionSeries.Sequence>
        );
        return i < BLUR.length - 1 ? [seq, <TransitionSeries.Transition key={`t${i}`} presentation={pop()} timing={linearTiming({durationInFrames: 6})} />] : [seq];
      })}
    </TransitionSeries>
  );
};

// Green: the same chair, the same tea, the same ten pages (day after day)
const GreenChair: React.FC = () => {
  const frame = useCurrentFrame();
  const lamp = 0.85 + 0.15 * Math.sin(frame / 29);
  // two quick dips to black = days passing
  const dip = (at: number) => interpolate(frame, [S(at) - 4, S(at), S(at) + 5], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const black = Math.max(dip(8.2), dip(15.4));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={[focus(0, 400, 600, 1.45), focus(S(27.8), 410, 590, 1.65)]} handheld={0.45}>
        <GradeWarm lampX={440} lampY={470}>
          <FrameSeq
            frames={[{src: 'FL_G1', at: 0}, {src: 'FL_G1p', at: S(3.8), fade: 10}, {src: 'FL_G1', at: S(5.4), fade: 10}, {src: 'FL_G1s', at: S(8.6), fade: 14}, {src: 'FL_G1', at: S(12.4), fade: 14}, {src: 'FL_G1p', at: S(14.4), fade: 10}, {src: 'FL_G5', at: S(16.5), fade: 20}, {src: 'FL_G1', at: S(19.6), fade: 20}, {src: 'FL_G1l', at: S(20.4), fade: 10}, {src: 'FL_G1c', at: S(22.0), fade: 14}, {src: 'FL_G1p', at: S(25.0), fade: 10}]}
            fade={7}
            blink={{twins: {FL_G1: 'FL_G1b'}, seed: 'chair'}}
          />
        </GradeWarm>
        <Glow x={440} y={470} r={520} color="rgba(255,200,120,0.3)" opacity={lamp * 0.6} />
        <Steam x={202} y={858} count={6} seed="tea" />
        <Dust count={22} area={{x: 40, y: 220, w: 760, h: 700}} seed="chair" />
      </Camera>
      <AbsoluteFill style={{background: '#000', opacity: black, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

const CAPTIONS: CaptionLine[] = [
  {text: 'Day five.', from: 0.8, to: 2.4},
  {text: 'The phone is the first thing he touches in the morning', from: 2.8, to: 6.6},
  {text: 'and the last thing he sees at night.', from: 6.9, to: 9.9},
  {text: 'Breakfast with a screen.', from: 10.4, to: 13.6},
  {text: 'Bathroom with a screen.', from: 14.4, to: 17.4},
  {text: 'Bed with a screen.', from: 18.2, to: 21.0},
  {text: 'The days start to blur.', from: 22.0, to: 25.0},
  {text: 'Day five. Same chair. Same cup of tea. Same ten pages.', from: 27.6, to: 34.0},
  {text: 'Not because he wants to. Because he decided to.', from: 36.0, to: 41.5},
  {text: "It still isn't fun.", from: 43.0, to: 45.6},
  {text: "But it's becoming a pattern.", from: 46.6, to: 50.6},
];

export const SFX: Cue[] = [
  {file: 'room_tone', at: 0, dur: 34, vol: 0.14, fadeIn: 1.5, fadeOut: 2},
  {file: 'notification', at: 0.9, vol: 0.28},
  {file: 'pickup', at: 1.6, vol: 0.3},
  {file: 'whoosh', at: 9.9, vol: 0.2},
  {file: 'cloth_b', at: 11.2, vol: 0.16},
  {file: 'whoosh', at: 13.9, vol: 0.2, rate: 1.1},
  {file: 'brush', at: 14.5, dur: 4.2, vol: 0.32, fadeOut: 0.4},
  {file: 'whoosh', at: 21.7, vol: 0.2},
  {file: 'swipe', at: 22.4, vol: 0.2},
  {file: 'swipe', at: 23.3, vol: 0.2, rate: 1.1},
  {file: 'swipe', at: 24.2, vol: 0.2, rate: 1.2},
  {file: 'whoosh', at: 26.8, vol: 0.2},
  {file: 'tea', at: 27.5, dur: 2.3, vol: 0.28, fadeOut: 0.3},
  {file: 'page', at: 30.5, vol: 0.3},
  {file: 'page', at: 38.0, vol: 0.3},
  {file: 'exhale', at: 43.4, dur: 2.2, vol: 0.2, fadeOut: 0.4},
  {file: 'swell', at: 47.0, dur: 5, vol: 0.18, fadeIn: 1.5, fadeOut: 2},
];

const LENS = [6.6, 3.6, 4.0, 4.0, 3.8, 5.1, 27.8]; // script seconds per shot
export const S04_FRAMES = LENS.reduce((a, l) => a + S(l), 0);

export const S04Day5: React.FC = () => {
  const dur = (i: number, tNext: number) => S(LENS[i]) + tNext;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={dur(0, T_POP)}><BedMorning /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pop()} timing={linearTiming({durationInFrames: T_POP})} />
        <TransitionSeries.Sequence durationInFrames={dur(1, T_WHIP)}><BedNight /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip('left')} timing={linearTiming({durationInFrames: T_WHIP})} />
        <TransitionSeries.Sequence durationInFrames={dur(2, T_WHIP)}><Kitchen /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip('right')} timing={linearTiming({durationInFrames: T_WHIP})} />
        <TransitionSeries.Sequence durationInFrames={dur(3, T_POP)}><Bathroom /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pop()} timing={linearTiming({durationInFrames: T_POP})} />
        <TransitionSeries.Sequence durationInFrames={dur(4, T_POP)}><BedNight2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pop()} timing={linearTiming({durationInFrames: T_POP})} />
        <TransitionSeries.Sequence durationInFrames={dur(5, T_WHIP)}><Blur /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip('left')} timing={linearTiming({durationInFrames: T_WHIP})} />
        <TransitionSeries.Sequence durationInFrames={S(LENS[6])}><GreenChair /></TransitionSeries.Sequence>
      </TransitionSeries>
      <SfxTrack cues={SFX} />
      <TypoS04 />
      <Vignette strength={0.3} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};
