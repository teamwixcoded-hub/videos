import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {S1Hook} from './S1Hook';
import {S2Choice} from './S2Choice';
import {S3Struggle} from './S3Struggle';
import {S4Night} from './S4Night';
import {S5Montage} from './S5Montage';
import {KText} from '../components/KText';
import {whip, zoomThrough, pop} from '../transitions';
import {Grain, Vignette} from '../vfx/Atmosphere';

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const bg = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: `rgba(10,8,12,${bg})`}}>
      <KText text="THE REWARD COMES FIRST…" at={10} y={440} size={96} />
      <KText text="AND THE BILL COMES LATER." at={50} y={600} size={96} highlight={['bill', 'later.']} accent="#ff6b5e" />
      <Vignette strength={0.5} />
      <Grain />
    </AbsoluteFill>
  );
};

export const SAMPLE2_FRAMES = 210 + 240 + 210 + 180 + 200 + 110 - (20 + 18 + 10 + 16 + 14);

// One continuous run: each cut is a camera move (zoom-through, whip, pop), not a hard edit.
export const Sample2: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={210}><S1Hook /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={zoomThrough(1500, 640)} timing={linearTiming({durationInFrames: 20})} />
    <TransitionSeries.Sequence durationInFrames={240}><S2Choice /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={whip('left')} timing={linearTiming({durationInFrames: 18})} />
    <TransitionSeries.Sequence durationInFrames={210}><S3Struggle /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={pop()} timing={linearTiming({durationInFrames: 10})} />
    <TransitionSeries.Sequence durationInFrames={180}><S4Night /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={whip('right')} timing={linearTiming({durationInFrames: 16})} />
    <TransitionSeries.Sequence durationInFrames={200}><S5Montage /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 14})} />
    <TransitionSeries.Sequence durationInFrames={110}><EndCard /></TransitionSeries.Sequence>
  </TransitionSeries>
);
