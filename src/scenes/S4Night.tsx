import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {Grade} from '../components/Grade';
import {SplitScreen} from '../components/SplitScreen';
import {Clock} from '../components/Clock';
import {KText, SlamLabel} from '../components/KText';
import {Camera, Shake, Sticker, focus} from '../vfx/Motion';
import {Dust, Flash, Grain, Vignette} from '../vfx/Atmosphere';
import {Dim, Glow, PropImg, Room, BED} from './common';
import {GreenMan, RedMan} from './Characters';

const Left: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.85 + random(`l4-${Math.floor(frame / 3)}`) * 0.15;
  return (
    <Camera keys={[focus(0, 520, 580, 1.35), focus(150, 540, 560, 1.5)]}>
      <Grade from="green">
        <Room name="BEDROOM" />
        <Glow x={BED.lamp[0]} y={BED.lamp[1]} r={640} color="rgba(255,196,110,0.65)" opacity={flicker} />
        <Dim color="40,25,5" opacity={0.2} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <GreenMan
            poses={[{at: 0, pose: 'slumpReadBook'}, {at: 70, pose: 'sittingChair', damping: 10}]}
            exprs={[[0, 'tired'], [50, 'frustrated'], [105, 'sad']]}
          />
        </svg>
        <Sticker name="anger" x={470} y={330} size={90} at={56} mode="pop" rotate={-10} />
        <Dust count={24} area={{x: 0, y: 100, w: 960, h: 800}} seed="l4" />
      </Grade>
    </Camera>
  );
};

const Right: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.8 + random(`r4-${frame}`) * 0.2;
  const scroll = Math.sin(frame / 6) * 4;
  return (
    <Camera keys={[focus(0, 1520, 600, 1.35), focus(150, 1500, 600, 1.5)]}>
      <Grade from="red">
        <Room name="BEDROOM" />
        <Dim opacity={0.55} />
        <PropImg name="pillow" x={1745} y={625} w={190} rotate={-4} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <RedMan
            lying
            x={1425}
            y={652 + scroll * 0.2}
            poses={[{at: 0, pose: 'lyingSide'}]}
            exprs={[[0, 'relieved'], [60, 'smile'], [105, 'tired'], [135, 'bloodshot']]}
          />
        </svg>
        <Glow x={1640} y={600} r={380} color="rgba(120,175,255,0.8)" opacity={flicker} />
        <Sticker name="zzz" x={1830} y={470} size={90} at={999} mode="float" />
      </Grade>
    </Camera>
  );
};

// Clock minutes since 12:00: 11:40 PM -> 2:00 AM
const START = 11 * 60 + 40;
const END = 14 * 60;

// ~6 s. Split: Green closes the book, Red scrolls. The clock spins from 11:40 to 2:00 and slams "2 AM".
export const S4Night: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = interpolate(frame, [20, 100], [START, END], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const clockIn = interpolate(frame, [8, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Shake at={102} amount={14} duration={14}>
        <SplitScreen left={<Left />} right={<Right />} />
      </Shake>
      <div style={{position: 'absolute', left: 960 - 130, top: 60, opacity: clockIn, transform: `scale(${0.6 + clockIn * 0.4})`}}>
        <Clock minutes={spin} size={260} />
      </div>
      <Flash at={102} color="#fff" peak={0.6} duration={8} />
      <SlamLabel text="2 AM" at={102} y={420} size={150} />
      <KText text="ON NIGHT ONE," at={120} until={175} y={880} size={84} />
      <KText text="THE PHONE WINS." at={134} until={178} y={1000} size={96} highlight={['wins.']} accent="#7fc2ff" />
      <Vignette strength={0.55} />
      <Grain />
    </AbsoluteFill>
  );
};
