import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {FrameSeq, SeqFrame} from '../components/FrameSeq';
import {SplitScreen} from '../components/SplitScreen';
import {Clock} from '../components/Clock';
import {KText, SlamLabel} from '../components/KText';
import {Camera, Shake, Sticker, focus} from '../vfx/Motion';
import {Dust, Flash, Grain, Vignette} from '../vfx/Atmosphere';
import {Glow, PropImg} from './common';
import {whip, zoomThrough, pop} from '../transitions';
import {HEAD_FONT} from '../fonts';

// ---- where things are in the 1920x1080 frame (measured from the generated keyframes) ----
const GREEN = {body: [400, 620] as const, head: [346, 470] as const, lamp: [440, 470] as const};
const RED = {body: [1450, 640] as const, head: [1478, 490] as const, alarm: [1768, 758] as const};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], clamp);

// ---- SHOT 1: the hook, split screen ----
const GreenHook: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.75 + 0.25 * Math.sin(frame / 14) + random(`lh-${Math.floor(frame / 4)}`) * 0.08;
  return (
    <AbsoluteFill>
      <FrameSeq frames={[{src: 'SC_G1', at: 0}]} />
      <Glow x={GREEN.lamp[0]} y={GREEN.lamp[1]} r={560} color="rgba(255,190,100,0.45)" opacity={pulse} />
      <Dust count={36} area={{x: 60, y: 200, w: 760, h: 700}} seed="hook" />
    </AbsoluteFill>
  );
};

const RedHook: React.FC = () => {
  const frame = useCurrentFrame();
  const alarm = 0.35 + 0.35 * Math.max(0, Math.sin(frame / 9));
  return (
    <AbsoluteFill>
      <FrameSeq frames={[{src: 'SC_R1', at: 0}]} />
      <Glow x={RED.alarm[0]} y={RED.alarm[1]} r={260} color="rgba(255,60,50,0.8)" opacity={alarm} />
    </AbsoluteFill>
  );
};

export const Shot1Hook: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera keys={[{at: 0, zoom: 1}, {at: 210, zoom: 1.12, x: -70}]}>
      <SplitScreen startOpen wipeFrames={40} left={<GreenHook />} right={<RedHook />} />
    </Camera>
    <KText text="ONE NIGHT." at={24} until={190} y={190} size={130} />
    <KText text="TWO CHOICES." at={62} until={190} y={330} size={104} highlight={['choices']} />
    <Vignette strength={0.5} />
    <Grain />
  </AbsoluteFill>
);

// ---- SHOT 2: Red reaches for the phone (frames are the timing; edit `at` to re-time the action) ----
const RED_SEQ: SeqFrame[] = [
  {src: 'SC_R1', at: 0},
  {src: 'SC_R2', at: 34},
  {src: 'SC_R3', at: 58},
  {src: 'SC_R4', at: 92},
  {src: 'SC_R5', at: 114},
  {src: 'SC_R6', at: 142},
  {src: 'SC_R7', at: 176},
  {src: 'SC_R6', at: 218},
];
const PHONE_UP = 92;

const Meter: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [PHONE_UP + 10, PHONE_UP + 30, PHONE_UP + 70, PHONE_UP + 90, PHONE_UP + 120, PHONE_UP + 135], [0, 0.4, 0.4, 0.75, 0.75, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 80, top: 230, opacity: ramp(frame, PHONE_UP + 6, PHONE_UP + 20)}}>
      <div style={{fontFamily: HEAD_FONT, fontSize: 44, color: '#fff', marginBottom: 10, textShadow: '0 3px 0 #000'}}>DOPAMINE</div>
      <div style={{width: 120, height: 420, border: '8px solid #1a1210', borderRadius: 28, background: 'rgba(0,0,0,0.45)', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: 'linear-gradient(0deg,#ff8a3d,#ffd23f)'}} />
      </div>
    </div>
  );
};

export const Shot2Choice: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = ramp(frame, PHONE_UP, PHONE_UP + 20) * (0.75 + random(`rg-${frame}`) * 0.25);
  const laugh = frame >= 176 && frame < 218;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={[focus(0, 1450, 640, 1.45), focus(PHONE_UP, 1450, 570, 1.65), focus(176, 1445, 540, 1.9), focus(240, 1445, 560, 1.75)]}>
        <Shake at={176} amount={laugh ? 5 : 0} duration={42}>
          <FrameSeq frames={RED_SEQ} />
        </Shake>
        <Glow x={RED.head[0]} y={RED.head[1] + 150} r={420} color="rgba(120,180,255,0.55)" opacity={glow} />
        <Sticker name="sparkle" x={1330} y={400} size={80} at={150} mode="pop" />
        <Sticker name="heart" x={1620} y={390} size={96} at={162} mode="float" life={70} />
        <Sticker name="heart" x={1360} y={340} size={84} at={196} mode="float" life={70} />
        <Sticker name="sparkle" x={1640} y={520} size={70} at={188} mode="pop" />
      </Camera>
      <Flash at={PHONE_UP} color="#9cc4ff" peak={0.35} duration={10} />
      <Meter />
      <KText text="IT FEELS GOOD." at={PHONE_UP + 22} until={205} y={900} size={110} highlight={['good']} accent="#7fc2ff" />
      <KText text="INSTANTLY." at={PHONE_UP + 66} until={225} y={1015} size={80} color="#cfe3ff" />
      <Vignette strength={0.55} />
      <Grain />
    </AbsoluteFill>
  );
};

// ---- SHOT 3: Green and the book that doesn't feel good ----
const GREEN_SEQ: SeqFrame[] = [
  {src: 'SC_G1', at: 0},
  {src: 'SC_G2', at: 44},
  {src: 'SC_G3', at: 88},
  {src: 'SC_G4', at: 128},
  {src: 'SC_G5', at: 162},
  {src: 'SC_G6', at: 192},
  {src: 'SC_G7', at: 218},
];

export const Shot3Struggle: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.8 + random(`g3-${Math.floor(frame / 3)}`) * 0.2;
  const bubble = ramp(frame, 62, 76);
  const grow = ramp(frame, 100, 126);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={[focus(0, 420, 620, 1.7), focus(128, 440, 580, 1.85), focus(218, 430, 600, 1.65)]}>
        <FrameSeq frames={GREEN_SEQ} />
        <Glow x={GREEN.lamp[0]} y={GREEN.lamp[1]} r={520} color="rgba(255,190,100,0.35)" opacity={flicker} />
        <div style={{opacity: bubble, transform: `scale(${0.6 + bubble * 0.4})`, transformOrigin: '10% 100%'}}>
          <PropImg name="bubble-thought" x={640} y={400} w={330} />
          <PropImg name="book-tower" x={640} y={408} w={72} scale={0.6 + grow * 0.65} rotate={Math.sin(frame / 3) * 2 * grow} shadow={false} />
        </div>
        <Sticker name="question" x={470} y={360} size={80} at={50} mode="float" life={44} />
        <Sticker name="sweat" x={470} y={430} size={58} at={96} mode="pop" />
        <Sticker name="zzz" x={520} y={380} size={110} at={140} mode="float" life={70} />
        <Dust count={26} area={{x: 0, y: 200, w: 900, h: 700}} seed="s3" />
      </Camera>
      <KText text="THE BOOK DOESN'T." at={12} until={92} y={150} size={96} />
      <KText text="TEN PAGES FEEL" at={96} until={228} y={880} size={92} />
      <KText text="LIKE A HUNDRED." at={110} until={228} y={1000} size={92} highlight={['hundred.']} accent="#ffd98a" />
      <Vignette strength={0.5} />
      <Grain />
    </AbsoluteFill>
  );
};

// ---- SHOT 4: night one, split ----
const START = 11 * 60 + 40;
const END = 14 * 60;

export const Shot4Night: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = interpolate(frame, [20, 100], [START, END], clamp);
  const clockIn = ramp(frame, 8, 24);
  const flick = 0.7 + random(`n4-${frame}`) * 0.3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shake at={102} amount={14} duration={14}>
        <SplitScreen
          left={
            <Camera keys={[focus(0, 430, 600, 1.5), focus(180, 430, 590, 1.65)]}>
              <FrameSeq frames={[{src: 'SC_G6', at: 0}, {src: 'SC_G7', at: 70}]} />
            </Camera>
          }
          right={
            <Camera keys={[focus(0, 1450, 590, 1.5), focus(180, 1445, 560, 1.7)]}>
              <FrameSeq frames={[{src: 'SC_R6', at: 0}, {src: 'SC_R7', at: 40}, {src: 'SC_R6', at: 80}, {src: 'SC_R7', at: 104}]} />
              <Glow x={RED.head[0]} y={RED.head[1] + 150} r={420} color="rgba(120,180,255,0.5)" opacity={flick} />
            </Camera>
          }
        />
      </Shake>
      <div style={{position: 'absolute', left: 960 - 130, top: 60, opacity: clockIn, transform: `scale(${0.6 + clockIn * 0.4})`}}>
        <Clock minutes={spin} size={260} />
      </div>
      <Flash at={102} color="#fff" peak={0.6} duration={8} />
      <SlamLabel text="2 AM" at={102} x={1340} y={190} size={140} />
      <KText text="ON NIGHT ONE," at={118} until={190} y={880} size={84} />
      <KText text="THE PHONE WINS." at={132} until={194} y={1000} size={96} highlight={['wins.']} accent="#7fc2ff" />
      <Vignette strength={0.55} />
      <Grain />
    </AbsoluteFill>
  );
};

export const SAMPLE3_FRAMES = 210 + 240 + 240 + 200 - (20 + 18 + 10);

// One continuous run: every cut is a camera move (zoom-through, whip, pop).
export const Sample3: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={210}><Shot1Hook /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={zoomThrough(1480, 560)} timing={linearTiming({durationInFrames: 20})} />
    <TransitionSeries.Sequence durationInFrames={240}><Shot2Choice /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={whip('left')} timing={linearTiming({durationInFrames: 18})} />
    <TransitionSeries.Sequence durationInFrames={240}><Shot3Struggle /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={pop()} timing={linearTiming({durationInFrames: 10})} />
    <TransitionSeries.Sequence durationInFrames={200}><Shot4Night /></TransitionSeries.Sequence>
  </TransitionSeries>
);
