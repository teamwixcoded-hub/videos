import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Grade} from '../components/Grade';
import {KText} from '../components/KText';
import {Camera, Sticker, focus} from '../vfx/Motion';
import {Dust, Grain, Vignette} from '../vfx/Atmosphere';
import {Dim, Glow, PropImg, Room, BED} from './common';
import {GreenMan} from './Characters';

// ~7 s. Green: the book doesn't feel good. He re-reads, eyes drift to the clock, ten pages feel like a hundred.
export const S3Struggle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flicker = 0.85 + random(`l-${Math.floor(frame / 3)}`) * 0.15;
  // thought bubble with a tower of books that balloons
  const pop = spring({frame: frame - 60, fps, config: {damping: 8, stiffness: 120}});
  const grow = spring({frame: frame - 110, fps, config: {damping: 7, stiffness: 90}});
  const wobble = Math.sin(frame / 3) * 2.5 * (frame > 110 ? 1 : 0);
  // the wall clock ticks harder when he looks at it
  const clockShake = frame > 85 && frame < 125 ? Math.sin(frame * 2.5) * 3 : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={[focus(0, 520, 560, 1.55), focus(80, 600, 520, 1.45), focus(210, 560, 540, 1.6)]}>
        <Grade from="green">
          <Room name="BEDROOM" />
          <Glow x={BED.lamp[0]} y={BED.lamp[1]} r={700} color="rgba(255,196,110,0.75)" opacity={flicker} />
          <Dim color="40,25,5" opacity={0.14} />
          <div style={{position: 'absolute', left: BED.clock[0] - 70, top: BED.clock[1] - 70, width: 140, height: 140, transform: `rotate(${clockShake}deg)`}} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <GreenMan
              poses={[{at: 0, pose: 'readBook'}, {at: 125, pose: 'slumpReadBook', damping: 18}]}
              exprs={[[0, 'read-calm'], [40, 'read-puzzled'], [80, 'look-up-right'], [125, 'yawn'], [165, 'tired']]}
              reading={[[0, 78]]}
              tap={[[45, 210]]}
            />
          </svg>
          {/* thought bubble: ten pages become a hundred */}
          <div style={{position: 'absolute', left: 470, top: 150, transform: `scale(${pop})`, transformOrigin: '0% 100%'}}>
            <PropImg name="bubble-thought" x={160} y={110} w={300} />
            <PropImg name="book-tower" x={160} y={118} w={64} rotate={wobble} scale={0.55 + grow * 0.6} shadow={false} />
          </div>
          <Sticker name="sweat" x={455} y={365} size={60} at={92} mode="pop" />
          <Sticker name="zzz" x={560} y={330} size={110} at={135} mode="float" life={60} />
          <Sticker name="question" x={470} y={300} size={80} at={42} mode="float" life={50} />
          <Dust count={30} area={{x: 0, y: 100, w: 900, h: 800}} seed="s3" />
        </Grade>
      </Camera>
      <KText text="THE BOOK DOESN'T." at={14} until={95} y={170} size={96} />
      <KText text="TEN PAGES FEEL" at={96} until={206} y={880} size={92} />
      <KText text="LIKE A HUNDRED." at={110} until={206} y={1000} size={92} highlight={['hundred.']} accent="#ffd98a" />
      <Vignette strength={0.5} />
      <Grain />
    </AbsoluteFill>
  );
};
