import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {SplitScreen} from '../components/SplitScreen';
import {Grade} from '../components/Grade';
import {KText} from '../components/KText';
import {Camera, Sticker} from '../vfx/Motion';
import {Dust, Grain, Vignette} from '../vfx/Atmosphere';
import {Dim, Glow, PropImg, Room, BED} from './common';
import {GreenMan, RedMan} from './Characters';

const GreenSide: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.8 + random(`lamp-${Math.floor(frame / 3)}`) * 0.2;
  return (
    <Grade from="green">
      <Room name="BEDROOM" />
      <Glow x={BED.lamp[0]} y={BED.lamp[1]} r={620} color="rgba(255,196,110,0.7)" opacity={flicker} />
      <Dim color="40,25,5" opacity={0.16} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <GreenMan poses={[{at: 0, pose: 'readBook'}]} exprs={[[0, 'read-calm'], [110, 'read-bored']]} reading={[[0, 400]]} tap={[[110, 400]]} />
      </svg>
      <Dust count={34} area={{x: 60, y: 150, w: 760, h: 700}} seed="g" />
    </Grade>
  );
};

const RedSide: React.FC = () => {
  const frame = useCurrentFrame();
  // the nightstand phone buzzes with a notification every 2 s
  const buzz = frame % 60 > 52 ? Math.sin(frame * 3) * 3 : 0;
  const ping = interpolate(frame % 60, [0, 4, 20], [1, 1, 0], {extrapolateRight: 'clamp'}) * (frame > 40 ? 1 : 0);
  return (
    <Grade from="red">
      <Room name="BEDROOM" />
      <Dim opacity={0.5} />
      <Glow x={BED.nightstandPhone[0]} y={BED.nightstandPhone[1]} r={380} color={`rgba(120,170,255,${0.25 + ping * 0.5})`} />
      <PropImg name="phone-lit" x={BED.nightstandPhone[0] + buzz} y={BED.nightstandPhone[1] - 20} w={46} rotate={-4} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <RedMan poses={[{at: 0, pose: 'slumped'}]} exprs={[[0, 'tired'], [150, 'glazed']]} phoneAt={9999} />
      </svg>
      <Sticker name="badge" x={BED.nightstandPhone[0] + 28} y={BED.nightstandPhone[1] - 70} size={42} at={50} mode="pulse" />
    </Grade>
  );
};

// ~7 s. Same room, same night, split. Ends with the camera drifting toward the phone for the zoom-through.
export const S1Hook: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera keys={[{at: 0, zoom: 1}, {at: 210, zoom: 1.1, x: -60}]}>
      <SplitScreen startOpen wipeFrames={40} left={<GreenSide />} right={<RedSide />} />
    </Camera>
    <KText text="ONE NIGHT." at={24} until={190} y={190} size={130} />
    <KText text="TWO CHOICES." at={62} until={190} y={330} size={104} highlight={['choices']} accent="#ffd23f" />
    <Vignette strength={0.5} />
    <Grain />
  </AbsoluteFill>
);
