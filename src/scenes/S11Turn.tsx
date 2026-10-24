import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {FrameSeq} from '../components/FrameSeq';
import {Camera, focus} from '../vfx/Motion';
import {Grain, Vignette} from '../vfx/Atmosphere';
import {GradeNight, GradeWarm} from '../components/Lighting';
import {Glow} from './common';
import {CaptionLine, NarrationCaptions, TimeStamp} from '../components/Props4';
import {PhotoCard} from '../components/Props5';
import {Beats} from '../components/Cinema';
import {SfxTrack, Cue} from '../components/Sfx';
import {frameCues, camCues} from '../components/autoSfx';

import {PropPop} from '../components/PropPop';
import {DepthBlur, SlowMo, Warp, warpCues, warpFrame} from '../components/Drama';
import {TypoS11} from '../typography';
import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// S11 · THE TURN. That night he sees the photo: the new job, the smile. For the first time he turns
// the phone face down and opens a book. He reads the same line three times, exactly like the
// other one did on night one. The light slowly warms from cold blue to gold.
// ============================================================================================

const FRAMES = [
  {src: 'FL_RS1', at: 0},
  {src: 'FL_RS2', at: S(3.2), fade: 12},
  {src: 'FL_RS2b', at: S(7.2), fade: 14},
  {src: 'FL_RS3', at: S(10.8), fade: 12},
  {src: 'FL_RS4', at: S(13.4), fade: 14},
  {src: 'FL_RS5', at: S(16.4), fade: 12},
  {src: 'FL_RS6', at: S(18.4), fade: 10}, // turns a page
  {src: 'FL_RS5', at: S(19.6), fade: 10},
  {src: 'FL_RS7', at: S(22.4), fade: 14}, // looks up, thoughtful
  {src: 'FL_RS5', at: S(25.0), fade: 14},
];

const CAPTIONS: CaptionLine[] = [
  {text: 'That night, he sees the photo.', from: 0.8, to: 3.8},
  {text: 'The new job. The smile.', from: 4.4, to: 7.0},
  {text: 'He looks at his phone… and for the first time, he turns it face down.', from: 7.8, to: 13.0},
  {text: 'He opens a book.', from: 13.6, to: 15.6},
  {text: 'He reads the same line three times.', from: 16.2, to: 19.6},
  {text: 'Exactly like the other one did… on night one.', from: 20.4, to: 25.4},
];

export const SFX: Cue[] = [
  {file: 'room_tone', at: 0, dur: 17, vol: 0.2, fadeIn: 2, fadeOut: 2},
  {file: 'notification', at: 1.0, vol: 0.24},
  {file: 'whoosh', at: 0.9, vol: 0.18},
  {file: 'cloth_a', at: 10.9, vol: 0.2},
  {file: 'thud', at: 11.3, vol: 0.34}, // the phone lands face down
  {file: 'page', at: 14.2, vol: 0.34},
  {file: 'page', at: 18.0, vol: 0.3, rate: 1.05},
  {file: 'sparkle', at: 14.0, dur: 1.4, vol: 0.2},
  {file: 'swell', at: 18.0, dur: 5, vol: 0.26, fadeIn: 1.5, fadeOut: 2},
];

export const S11_FRAMES = S(27);

// slow motion on the phone going face down: the picture slows to 40% for ~2.6 s, then catches up
const WARP: Warp = {a: 10.0, b: 12.6, speed: 0.4, ramp: 0.5, catchUp: 3.0};

// camera: a slow, deliberate push onto his hands as the phone turns over, then back out to the book
const CAM11 = [
  focus(0, 1250, 560, 1.4),
  focus(S(9.4), 1250, 590, 1.5),
  focus(S(11.8), 1245, 585, 1.8),
  focus(S(14.6), 1260, 570, 1.7),
  focus(S(27), 1260, 550, 1.8),
];

export const S11Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const warmMix = interpolate(frame, [S(14), S(22)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wf = warpFrame(WARP, frame); // the phone's glow follows the slowed picture
  const phone = interpolate(wf, [S(10.2), S(11.4)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (0.8 + random(`t-${Math.floor(frame / 2)}`) * 0.2);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SlowMo warp={WARP}>
      <Camera keys={CAM11} handheld={0.45}>
        <AbsoluteFill style={{opacity: 1 - warmMix}}>
          <GradeNight>
            <FrameSeq frames={FRAMES} fade={7} />
          </GradeNight>
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: warmMix}}>
          <GradeWarm lampX={1300} lampY={560}>
            <FrameSeq frames={FRAMES} fade={7} />
          </GradeWarm>
        </AbsoluteFill>
        <Glow x={1250} y={640} r={380} color="rgba(110,175,255,0.8)" opacity={phone * 0.85} />
        <PropPop src="fx/bulb" x={1480} y={400} w={120} from={14.0} to={16.6} />
        <Glow x={1300} y={560} r={600} color="rgba(255,205,130,0.55)" opacity={warmMix * 0.7} />
      </Camera>
      </SlowMo>
      <DepthBlur from={10.0} to={14.6} amount={9} y={56} />
      <PhotoCard src="FL_PH" from={S(1.2)} to={S(8.4)} x={560} y={520} w={520} />
      <Beats scene="S11Turn" />
    <SfxTrack cues={warpCues([...SFX, ...frameCues(FRAMES, 0)], WARP)} />
      <TypoS11 />
      <Vignette strength={0.35} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};
