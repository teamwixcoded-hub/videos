import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {FrameSeq, SeqFrame} from '../components/FrameSeq';
import {Camera, Shake, focus} from '../vfx/Motion';
import {Dust, Grain, Vignette} from '../vfx/Atmosphere';
import {GradeDay, GradeWarm} from '../components/Lighting';
import {NarrationCaptions, TimeStamp, CaptionLine} from '../components/Props4';
import {Beats} from '../components/Cinema';
import {SfxTrack, Cue} from '../components/Sfx';
import {frameCues, camCues} from '../components/autoSfx';

import {TypoS05} from '../typography';
import {Glow} from './common';
import {whip} from '../transitions';
import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// S05 · DAY 21. Red: tired, small things annoy him, he snaps at his mother over nothing, then
// reaches for the phone again. Colour drains out of his world as the scene goes on.
// Green: the book stops fighting him. The light warms.   (times are script seconds, S() scales them)
// ============================================================================================

const RED_SEQ: SeqFrame[] = [
  {src: 'FL_L0', at: 0},
  {src: 'FL_L0b', at: S(4.0), fade: 10}, // irritated glance
  {src: 'FL_L0', at: S(7.0), fade: 10},
  {src: 'FL_L1c', at: S(9.6), fade: 10}, // his mother appears, he ignores her
  {src: 'FL_L1', at: S(11.8), fade: 8},
  {src: 'FL_L2', at: S(13.6), fade: 5}, // the snap
  {src: 'FL_L3', at: S(17.4), fade: 16}, // she is gone, he is alone
];

const RedLiving: React.FC = () => {
  const frame = useCurrentFrame();
  // colour drains from his world over the scene
  const sat = interpolate(frame, [0, S(26)], [1.0, 0.5], {extrapolateRight: 'clamp'});
  const glow = interpolate(frame, [S(17.4), S(19.5)], [0.35, 0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (0.8 + random(`l-${Math.floor(frame / 2)}`) * 0.2);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shake at={S(13.6)} amount={16} duration={18}>
        <Camera
          keys={[
            focus(0, 960, 560, 1.05),
            focus(S(3.6), 640, 600, 1.35), // push in on him
            focus(S(9.6), 700, 600, 1.38),
            focus(S(11.6), 1080, 590, 1.2), // the door opens: both in view
            focus(S(13.4), 1130, 590, 1.28),
            focus(S(17.0), 580, 600, 1.55), // she has gone: just him
            focus(S(26.5), 570, 590, 1.8),
          ]}
          handheld={0.5}
        >
          <AbsoluteFill style={{filter: `saturate(${sat})`}}>
            <GradeDay dim={0.28}>
              <FrameSeq frames={RED_SEQ} fade={7} />
            </GradeDay>
          </AbsoluteFill>
          <Glow x={590} y={640} r={300} color="rgba(120,180,255,0.7)" opacity={glow} />
        </Camera>
      </Shake>
    </AbsoluteFill>
  );
};

const GREEN_SEQ: SeqFrame[] = [
  {src: 'FL_G10', at: 0},
  {src: 'FL_G11', at: S(4.6), fade: 8},
  {src: 'FL_G10', at: S(5.6), fade: 8},
  {src: 'FL_G1l', at: S(6.7), fade: 10}, // looks up, thinking
  {src: 'FL_G10', at: S(8.2), fade: 10},
  {src: 'FL_G11', at: S(9.0), fade: 8},
  {src: 'FL_G10', at: S(10.0), fade: 8},
  {src: 'FL_G1s', at: S(12.0), fade: 12}, // a sip of tea
  {src: 'FL_G10', at: S(14.0), fade: 12},
  {src: 'FL_G5', at: S(15.0), fade: 22}, // sleepy, content
  {src: 'FL_G10', at: S(19.6), fade: 22},
];

const GreenReads: React.FC = () => {
  const frame = useCurrentFrame();
  const lamp = 0.85 + 0.15 * Math.sin(frame / 29) + random(`gl-${Math.floor(frame / 5)}`) * 0.04;
  const warmUp = interpolate(frame, [S(14), S(22)], [0, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); // the light warms ~10%
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={[focus(0, 400, 600, 1.4), focus(S(10), 405, 590, 1.6), focus(S(22.5), 410, 585, 1.7)]} handheld={0.45}>
        <GradeWarm lampX={440} lampY={470}>
          <FrameSeq frames={GREEN_SEQ} fade={7} />
        </GradeWarm>
        <Glow x={440} y={470} r={540} color="rgba(255,200,120,0.3)" opacity={lamp * (0.6 + warmUp)} />
        <Dust count={26} area={{x: 40, y: 220, w: 760, h: 700}} seed="s5g" />
      </Camera>
    </AbsoluteFill>
  );
};

const CAPTIONS: CaptionLine[] = [
  {text: 'Day twenty-one.', from: 0.8, to: 3.0},
  {text: 'Something feels off.', from: 3.4, to: 5.4},
  {text: "He's tired, even after sleeping.", from: 6.0, to: 9.4},
  {text: 'Small things annoy him.', from: 10.0, to: 12.6},
  {text: 'He snaps at his mother over nothing.', from: 13.0, to: 16.4},
  {text: 'He feels low… and reaches for the one thing that makes him feel better.', from: 17.2, to: 22.4},
  {text: "The phone. The same thing that's making him feel worse.", from: 22.8, to: 26.2},
  {text: 'Day twenty-one. Something changes.', from: 27.6, to: 31.0},
  {text: "He looks up, and he's read twenty pages without noticing.", from: 31.6, to: 36.6},
  {text: "The words don't fight him anymore.", from: 37.2, to: 40.4},
  {text: 'He falls asleep easier.', from: 41.2, to: 43.8},
  {text: 'The hard part is getting easier.', from: 44.6, to: 48.4},
];

const SFX: Cue[] = [
  {file: 'room_tone', at: 0, dur: 29, vol: 0.14, fadeIn: 1.5, fadeOut: 2},
  {file: 'door', at: 8.6, dur: 2.7, vol: 0.3, fadeOut: 0.4}, // his mother opens the door
  {file: 'thump', at: 13.75, vol: 0.3, rate: 0.88, dur: 0.6, fadeIn: 0.04, fadeOut: 0.25}, // the snap
  {file: 'sting', at: 14.4, vol: 0.2, dur: 0.6, fadeOut: 0.25},
  {file: 'door', at: 16.0, dur: 2.0, vol: 0.2, rate: 0.9, fadeOut: 0.4}, // she leaves
  {file: 'notification', at: 18.0, vol: 0.2},
  {file: 'swipe', at: 19.5, vol: 0.18},
  {file: 'swipe', at: 21.5, vol: 0.18, rate: 1.1},
  {file: 'whoosh', at: 26.2, vol: 0.2},
  {file: 'page', at: 31.2, vol: 0.32},
  {file: 'page', at: 35.6, vol: 0.32, rate: 0.96},
  {file: 'tea', at: 28.5, dur: 2.2, vol: 0.18, fadeOut: 0.3},
  {file: 'exhale', at: 41.6, dur: 2.2, vol: 0.2, rate: 1.1, fadeOut: 0.4},
  {file: 'swell', at: 44.5, dur: 5, vol: 0.2, fadeIn: 1.5, fadeOut: 2},
];

const LENS = [26.5, 22.5]; // script seconds per shot
export const S05_FRAMES = S(LENS[0]) + S(LENS[1]);

export const S05Day21: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={S(LENS[0]) + 14}><RedLiving /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip('left')} timing={linearTiming({durationInFrames: 14})} />
      <TransitionSeries.Sequence durationInFrames={S(LENS[1])}><GreenReads /></TransitionSeries.Sequence>
    </TransitionSeries>
    <Beats scene="S05Day21" />
    <SfxTrack cues={[...SFX, ...frameCues(RED_SEQ, 0), ...frameCues(GREEN_SEQ, 1)]} />
    <TypoS05 />
    <Vignette strength={0.3} />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);
