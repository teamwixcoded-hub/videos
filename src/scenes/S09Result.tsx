import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Shot} from './Shot';
import {TypoS09} from '../typography';
import {Glow} from './common';
import {Grain, Vignette} from '../vfx/Atmosphere';
import {focus} from '../vfx/Motion';
import {ChecklistCard} from '../components/Explain';
import {Stamp} from '../components/Type';
import {CaptionLine, NarrationCaptions, TimeStamp} from '../components/Props4';
import {Beats} from '../components/Cinema';
import {SfxTrack, Cue} from '../components/Sfx';
import {frameCues, camCues} from '../components/autoSfx';
import {DepthBlur, SlowMo, Warp, warpCues} from '../components/Drama';

import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// S09 · THE RESULT (month eleven). His manager calls him in. A new role. Nobody saw the ten
// pages a night, they only see the result. A warm light blooms on his quiet smile.
// ============================================================================================

const FRAMES = [
  {src: 'FL_MG1', at: 0},
  {src: 'FL_MG2', at: S(7.6), fade: 12},
  {src: 'FL_MG3', at: S(12.0), fade: 12},
  {src: 'FL_MG4', at: S(15.6), fade: 8},
  {src: 'FL_MG5', at: S(22.2), fade: 20},
];

const CAM = [
  focus(0, 1000, 560, 1.05),
  focus(S(3.0), 1620, 540, 1.45), // the manager gestures him in
  focus(S(7.0), 1250, 600, 1.4), // he walks in, surprised
  focus(S(11.5), 1000, 590, 1.5),
  focus(S(15.4), 1000, 585, 1.55), // the handshake begins: a slow, steady push-in
  focus(S(21.2), 1000, 570, 2.1),
  focus(S(22.8), 1040, 540, 2.05), // his quiet smile
  focus(S(30), 1040, 540, 2.35),
];

const CAPTIONS: CaptionLine[] = [
  {text: 'Month eleven.', from: 0.8, to: 2.8},
  {text: 'His manager calls him in.', from: 3.4, to: 6.2},
  {text: 'A new role has opened, one that needs someone who thinks clearly, writes well and stays calm under pressure.', from: 7.0, to: 15.0},
  {text: 'Nobody saw the ten pages a night. They only see the result.', from: 16.0, to: 22.0},
  {text: 'But he knows where it came from.', from: 23.0, to: 27.4},
];

export const SFX: Cue[] = [
  {file: 'boom', at: 15.9, real: true, vol: 0.35, dur: 1.2, fadeOut: 0.5},
  {file: 'room_tone', at: 0, dur: 19, vol: 0.12, fadeIn: 1.5, fadeOut: 2},
  {file: 'swell', at: 0.6, dur: 5, vol: 0.2, fadeIn: 1.2, fadeOut: 1.8},
  {file: 'door', at: 3.2, dur: 2.0, vol: 0.2, fadeOut: 0.4},
  {file: 'cloth_b', at: 7.7, vol: 0.18},
  {file: 'cloth_a', at: 12.2, vol: 0.2},
  {file: 'pop_a', at: 15.7, vol: 0.28, rate: 1.1}, // the handshake
  {file: 'sparkle', at: 22.4, dur: 1.4, vol: 0.28},
  {file: 'swell', at: 22.0, dur: 5, vol: 0.28, fadeIn: 1.2, fadeOut: 2},
];

export const S09_FRAMES = S(30);

// slow motion on the handshake: the picture runs at 50% for 2.8 s, then catches up before his smile
const WARP: Warp = {a: 15.6, b: 18.4, speed: 0.5, ramp: 0.5, catchUp: 3.0};

const Bloom: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [S(22), S(26)], [0, 0.75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Glow x={1040} y={440} r={620} color="rgba(255,214,140,0.7)" opacity={o} />;
};

export const S09Result: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <SlowMo warp={WARP}>
      <Shot grade="day" frames={FRAMES} cam={CAM}>
        <Bloom />
      </Shot>
    </SlowMo>
    <DepthBlur from={15.6} to={21.4} amount={7} y={50} />
    <ChecklistCard title="WHY HIM?" sub="what ten pages a night built" color="#7ee2a0" x={500} y={90} w={640} rowSize={40} from={9.0} to={15.4} rows={[{text: "THINKS CLEARLY", at: 9.8}, {text: "WRITES WELL", at: 11.4}, {text: "STAYS CALM", at: 13.0}]} />
    <Stamp text="PROMOTED" from={15.9} to={21.4} x={1440} y={120} size={110} color="#2fa866" rotate={-6} />
    <Beats scene="S09Result" />
    <SfxTrack cues={warpCues([...SFX, ...frameCues(FRAMES, 0)], WARP)} />
    <TypoS09 />
    <Vignette strength={0.28} />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);
