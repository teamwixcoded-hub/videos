import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Shot} from './Shot';
import {TypoS08} from '../typography';
import {Grain, Vignette} from '../vfx/Atmosphere';
import {focus} from '../vfx/Motion';
import {CaptionLine, NarrationCaptions} from '../components/Props4';
import {BigCounter, PhoneSearch} from '../components/Props5';
import {Beats} from '../components/Cinema';
import {SfxTrack, Cue} from '../components/Sfx';
import {frameCues, camCues} from '../components/autoSfx';

import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// S08 · THE LOW POINT. He knows something is wrong, so he searches "how to fix your life". Three
// videos on discipline, productivity, waking at 5 AM. Forty minutes later he is still in bed.
// ============================================================================================

const FRAMES = [
  {src: 'FL_BL1', at: 0},
  {src: 'FL_BL4', at: S(5.0), fade: 12},
  {src: 'FL_BL1', at: S(8.6), fade: 12},
  {src: 'FL_BL5', at: S(12.0), fade: 14},
  {src: 'FL_BL4', at: S(15.4), fade: 12},
  {src: 'FL_BL1', at: S(18.4), fade: 12},
  {src: 'FL_BL6', at: S(20.2), fade: 14},
  {src: 'FL_BL2', at: S(22.5), fade: 22},
  {src: 'FL_BL3', at: S(29.5), fade: 26},
];

const CAPTIONS: CaptionLine[] = [
  {text: 'He knows something is wrong.', from: 0.8, to: 3.6},
  {text: 'So he searches: "how to fix your life."', from: 4.2, to: 8.0},
  {text: 'A video about discipline.', from: 8.8, to: 11.0},
  {text: 'Then one about productivity.', from: 11.8, to: 14.4},
  {text: 'Then one about waking up at 5 AM.', from: 15.2, to: 18.6},
  {text: "Forty minutes later… he's still in bed. Still scrolling.", from: 20.0, to: 26.4},
  {text: 'He learned everything. He changed nothing.', from: 28.0, to: 32.8},
];

const SFX: Cue[] = [
  {file: 'room_tone', at: 0, dur: 22, vol: 0.18, fadeIn: 2, fadeOut: 2},
  {file: 'notification', at: 3.8, vol: 0.2},
  {file: 'swipe', at: 8.6, vol: 0.22},
  {file: 'swipe', at: 11.6, vol: 0.22, rate: 1.08},
  {file: 'swipe', at: 15.0, vol: 0.22, rate: 0.94},
  {file: 'clock', at: 20.2, dur: 3.2, vol: 0.4, fadeIn: 0.4, fadeOut: 0.8},
  {file: 'exhale', at: 29.4, dur: 2.4, vol: 0.2, rate: 0.85, fadeOut: 0.5},
  {file: 'swell', at: 28.0, dur: 5, vol: 0.2, fadeIn: 1.5, fadeOut: 2},
];

export const S08_FRAMES = S(36);

export const S08Low: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Shot
      grade="night"
      frames={FRAMES}
      cam={[focus(0, 1480, 620, 1.3), focus(S(12), 1520, 600, 1.6), focus(S(33), 1560, 585, 2.0), focus(S(36), 1560, 585, 2.05)]}
      glow={{x: 1560, y: 520, r: 380, opacity: 0.6}}
    />
    <PhoneSearch query="how to fix your life" from={S(3.8)} to={S(20)} x={420} y={540} />
    <BigCounter from={S(20.2)} hide={S(27)} label="MINUTES LATER" to={40} suffix="" x={420} y={700} size={170} />
    <Beats scene="S08Low" />
    <SfxTrack cues={[...SFX, ...frameCues(FRAMES, 0)]} />
    <TypoS08 />
    <Vignette strength={0.45} />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);
