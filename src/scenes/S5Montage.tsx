import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {Grade} from '../components/Grade';
import {SlamLabel} from '../components/KText';
import {StickRig} from '../components/StickRig';
import {Camera, Sticker, focus} from '../vfx/Motion';
import {Dust, Grain, Steam, Vignette} from '../vfx/Atmosphere';
import {Dim, Glow, Held, PhoneHeld, PropImg, Room, BED} from './common';
import {GreenMan} from './Characters';
import {pop} from '../transitions';

const Kitchen: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.8 + random(`k-${frame}`) * 0.2;
  return (
    <Camera keys={[focus(0, 1250, 640, 1.5), focus(60, 1280, 620, 1.65)]}>
      <Grade from="red">
        <Room name="KITCHEN" />
        <Dim opacity={0.45} />
        <PropImg name="cereal" x={1385} y={640} w={150} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <StickRig
            poses={[{at: 0, pose: 'eatPhone'}]}
            exprs={[[0, 'phone-stare']]}
            x={1175}
            y={745}
            scale={0.95}
            seed={2}
            renderHeldL={(hand) => <PhoneHeld hand={hand} frame={frame} />}
          />
        </svg>
        <Glow x={1250} y={470} r={340} color="rgba(120,175,255,0.8)" opacity={flicker} />
      </Grade>
    </Camera>
  );
};

const Bathroom: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.8 + random(`b-${frame}`) * 0.2;
  const brush = Math.sin(frame * 1.4) * 5;
  return (
    <Camera keys={[focus(0, 860, 560, 1.5), focus(60, 880, 560, 1.7)]}>
      <Grade from="red">
        <Room name="BATHROOM" />
        <Dim opacity={0.45} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <StickRig
            poses={[{at: 0, pose: 'brushPhone'}]}
            exprs={[[0, 'phone-stare']]}
            x={760}
            y={760}
            scale={0.95}
            seed={1}
            renderHeld={(hand) => <Held name="toothbrush" hand={hand} w={90} h={90} dx={brush} dy={-20} rotate={-30} />}
            renderHeldL={(hand) => <PhoneHeld hand={hand} frame={frame} speed={2} />}
          />
        </svg>
        <Glow x={830} y={470} r={320} color="rgba(120,175,255,0.8)" opacity={flicker} />
      </Grade>
    </Camera>
  );
};

const GreenChair: React.FC<{cupX: number}> = ({cupX}) => {
  const frame = useCurrentFrame();
  const flicker = 0.85 + random(`gc-${Math.floor(frame / 3)}`) * 0.15;
  return (
    <Camera keys={[focus(0, 520, 600, 1.5), focus(60, 540, 590, 1.6)]}>
      <Grade from="green">
        <Room name="BEDROOM" />
        <Glow x={BED.lamp[0]} y={BED.lamp[1]} r={640} color="rgba(255,196,110,0.7)" opacity={flicker} />
        <Dim color="40,25,5" opacity={0.14} />
        <PropImg name="teacup" x={cupX} y={845} w={120} />
        <Steam x={cupX} y={810} seed={`s${cupX}`} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <GreenMan poses={[{at: 0, pose: 'readBook'}]} exprs={[[0, 'read-calm']]} reading={[[0, 400]]} />
        </svg>
        <Dust count={26} area={{x: 0, y: 100, w: 900, h: 800}} seed="gc" />
      </Grade>
    </Camera>
  );
};

// ~6 s. "Day 5": Red's phone is in every moment (kitchen, bathroom); Green is in the same chair with the same tea, day after day.
export const S5Montage: React.FC = () => {
  const T = linearTiming({durationInFrames: 6});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={44}><Kitchen /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pop()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={44}><Bathroom /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pop()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={44}><GreenChair cupX={600} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pop()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={44}><GreenChair cupX={640} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pop()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={48}><GreenChair cupX={580} /></TransitionSeries.Sequence>
      </TransitionSeries>
      <SlamLabel text="DAY 5" at={4} y={150} size={190} />
      <Vignette strength={0.5} />
      <Grain />
    </AbsoluteFill>
  );
};
