import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DualRoom} from './DualRoom';
import {focus} from '../vfx/Motion';
import {Grain, Vignette} from '../vfx/Atmosphere';
import {CaptionLine, NarrationCaptions, TimeStamp} from '../components/Props4';
import {CalendarFlip} from '../components/Props5';
import {Beats} from '../components/Cinema';
import {SfxTrack, Cue} from '../components/Sfx';
import {frameCues, camCues} from '../components/autoSfx';

import {PropPop} from '../components/PropPop';
import {TypoS07} from '../typography';
import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// S07 · DAY 90. The crossing point: Red's days are copies of each other (the calendar flips,
// nothing changes); Green's days look the same too, but he doesn't: books stacked, notes on the wall.
// ============================================================================================

const RED = [
  {src: 'FL_R6', at: 0},
  {src: 'FL_R10', at: S(6.0), fade: 14},
  {src: 'FL_R6', at: S(9.0), fade: 14},
  {src: 'FL_R5', at: S(14.0), fade: 14},
  {src: 'FL_R10', at: S(20.0), fade: 14},
  {src: 'FL_R6', at: S(24.0), fade: 14},
  {src: 'FL_R7', at: S(30.0), fade: 12},
  {src: 'FL_R6', at: S(33.0), fade: 16},
];
const GREEN = [
  {src: 'FL_G1', at: 0},
  {src: 'FL_G12', at: S(17.5), fade: 44}, // the stack and the notes appear
  {src: 'FL_G13', at: S(22.0), fade: 14},
  {src: 'FL_G14', at: S(26.5), fade: 14},
  {src: 'FL_G13', at: S(30.0), fade: 14},
  {src: 'FL_G15', at: S(32.6), fade: 14},
];
const FLIPS = Array.from({length: 12}, (_, i) => S(5.8 + i * 0.75));

const CAM = [
  focus(0, 960, 560, 1.0),
  focus(S(4), 960, 560, 1.05),
  focus(S(6), 1450, 585, 1.55), // Red: the days are copies of each other
  focus(S(11), 1450, 585, 1.72),
  focus(S(15), 1450, 585, 1.78),
  focus(S(19.5), 480, 570, 1.5), // Green: a stack of finished books, notes, a calmer face
  focus(S(27), 480, 570, 1.74),
  focus(S(30), 960, 560, 1.08), // both: now it is the other way around
  focus(S(36), 960, 560, 1.12),
];

const CAPTIONS: CaptionLine[] = [
  {text: 'Day ninety. Look at them now.', from: 0.8, to: 4.4},
  {text: 'His days are copies of each other.', from: 5.0, to: 8.2},
  {text: 'Same bed. Same glow. Same feeling. Same results.', from: 8.8, to: 13.8},
  {text: "The reader's days look the same too… but he doesn't.", from: 14.6, to: 19.2},
  {text: 'A stack of finished books. Notes on the wall. A calmer face.', from: 20.0, to: 26.4},
  {text: 'Ninety days ago, the phone felt easy and the book felt hard.', from: 27.0, to: 31.6},
  {text: "Now it's the other way around.", from: 32.2, to: 35.6},
];

const SFX: Cue[] = [
  {file: 'room_tone', at: 0, dur: 22, vol: 0.2, fadeIn: 2, fadeOut: 2},
  {file: 'swell', at: 0.6, dur: 5, vol: 0.22, fadeIn: 1.2, fadeOut: 1.8},
  ...FLIPS.map((_, i): Cue => ({file: 'page', at: 5.8 + i * 0.75, vol: 0.26, rate: 1.1 + (i % 3) * 0.06, dur: 0.9})),
  {file: 'whoosh', at: 5.2, vol: 0.2},
  {file: 'whoosh', at: 18.6, vol: 0.2},
  {file: 'sparkle', at: 22.4, dur: 1.4, vol: 0.2},
  {file: 'swell', at: 30.0, dur: 5, vol: 0.2, fadeIn: 1.5, fadeOut: 2},
];

export const S07_FRAMES = S(36);

export const S07Day90: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <DualRoom green={GREEN} red={RED} cam={CAM} redBlink={{twins: {FL_R6: 'FL_R6b'}, seed: 's7r'}} greenBlink={{twins: {FL_G1: 'FL_G1b'}, seed: 's7g'}} glowAt={[1450, 700]}>
      <PropPop src="props/phone-lit" x={1290} y={215} w={64} from={5.4} to={9.0} />
      <PropPop src="props/phone-lit" x={1420} y={215} w={64} from={5.9} to={9.0} />
      <PropPop src="props/phone-lit" x={1550} y={215} w={64} from={6.4} to={9.0} />
      <PropPop src="props/phone-lit" x={1680} y={215} w={64} from={6.9} to={9.0} />
      <PropPop src="fx/sparkle" x={365} y={400} w={90} from={24.8} to={27.0} />
    </DualRoom>
    <CalendarFlip from={S(5.2)} hide={S(15.6)} flips={FLIPS} x={250} y={420} w={250} />
    <Beats scene="S07Day90" />
    <SfxTrack cues={[...SFX, ...frameCues(RED, 0), ...frameCues(GREEN, 1)]} />
    <TypoS07 />
    <Vignette strength={0.3} />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);
