import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DualRoom} from './DualRoom';
import {focus} from '../vfx/Motion';
import {Grain, Vignette} from '../vfx/Atmosphere';
import {CaptionLine, NarrationCaptions, TimeStamp} from '../components/Props4';
import {BigCounter} from '../components/Props5';
import {Beats} from '../components/Cinema';
import {SfxTrack, Cue} from '../components/Sfx';
import {frameCues, camCues} from '../components/autoSfx';

import {PropPop} from '../components/PropPop';
import {ChecklistCard} from '../components/Explain';
import {TypoS10} from '../typography';
import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// S10 · DAY 365. Same framing as the very first shot: same room, same night, same man. Two
// counters tick up: 20+ books, 1,000+ hours on a screen. They changed one night at a time.
// ============================================================================================

const G10 = [
  {src: 'FL_G12', at: 0},
  {src: 'FL_G13', at: S(8.0), fade: 14},
  {src: 'FL_G15', at: S(12.0), fade: 14},
  {src: 'FL_G13', at: S(16.0), fade: 14},
  {src: 'FL_G12', at: S(22.0), fade: 14},
];
const R10 = [
  {src: 'FL_R8', at: 0},
  {src: 'FL_R11', at: S(6.0), fade: 14},
  {src: 'FL_R8', at: S(11.0), fade: 14},
  {src: 'FL_R11', at: S(16.0), fade: 14},
  {src: 'FL_R8', at: S(22.0), fade: 14},
];
export const GREEN_FINAL = [{src: 'FL_G12', at: 0}];
export const RED_FINAL = [{src: 'FL_R8', at: 0}];

const CAM = [
  focus(0, 960, 560, 1.0),
  focus(S(8), 960, 540, 1.0), // stay fully wide: the two scorecards sit above the men
  focus(S(22), 960, 540, 1.0),
  focus(S(30), 960, 560, 1.12),
];

const CAPTIONS: CaptionLine[] = [
  {text: 'Day three hundred sixty-five.', from: 0.8, to: 4.0},
  {text: 'Same room. Same night. Same man.', from: 4.6, to: 8.4},
  {text: 'A year of pages became more than twenty books.', from: 9.0, to: 13.4},
  {text: 'A year of "five more minutes" became more than a thousand hours on a screen.', from: 14.2, to: 20.6},
  {text: 'Neither of them changed in one day.', from: 21.6, to: 25.0},
  {text: 'They changed one night at a time.', from: 25.6, to: 29.0},
];

const SFX: Cue[] = [
  {file: 'room_tone', at: 0, dur: 19, vol: 0.2, fadeIn: 2, fadeOut: 2},
  {file: 'swell', at: 0.6, dur: 5, vol: 0.22, fadeIn: 1.2, fadeOut: 1.8},
  {file: 'whoosh', at: 11.4, vol: 0.2},
  {file: 'meter', at: 10.8, vol: 0.28, rate: 1.0},
  {file: 'sparkle', at: 13.0, dur: 1.4, vol: 0.2},
  {file: 'whoosh', at: 16.4, vol: 0.2, rate: 1.1},
  {file: 'meter', at: 15.6, vol: 0.28, rate: 0.85},
  {file: 'whoosh', at: 22.4, vol: 0.2, rate: 0.9},
  {file: 'swell', at: 24.0, dur: 5, vol: 0.22, fadeIn: 1.5, fadeOut: 2},
];

export const S10_FRAMES = S(30);

export const S10Day365: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <DualRoom green={G10} red={R10} cam={CAM} glowAt={[1290, 640]}>
    </DualRoom>

    <ChecklistCard title="THE READER" sub="after one year" color="#ffd23f" x={480} y={6} w={640} rowSize={38} from={9.0} to={21.0} rows={[{text: '20+ BOOKS READ', at: 9.6}, {text: 'PROMOTED AT WORK', at: 11.8}, {text: 'SLEEPS WELL', at: 14.0}]} />
    <ChecklistCard title="THE SCROLLER" sub="after one year" color="#7fc2ff" x={1440} y={6} w={640} rowSize={38} from={10.0} to={21.0} rows={[{text: '1,000+ HOURS SCROLLED', at: 10.6, ok: false}, {text: 'ALWAYS TIRED', at: 12.8, ok: false}, {text: 'SHORT TEMPER', at: 15.0, ok: false}]} />
    <Beats scene="S10Day365" />
    <SfxTrack cues={[...SFX, ...frameCues(G10, 0), ...frameCues(R10, 1)]} />
    <TypoS10 />
    <Vignette strength={0.3} />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);
