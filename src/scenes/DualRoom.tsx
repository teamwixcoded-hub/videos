import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {FrameSeq, SeqFrame} from '../components/FrameSeq';
import {Camera, CamKey} from '../vfx/Motion';
import {Dust} from '../vfx/Atmosphere';
import {GradeNight, GradeWarm} from '../components/Lighting';
import {WallClock} from '../components/Props4';
import {Glow} from './common';
import {quick} from './frameUtil';

// The shared bedroom "two men, one room" setup (used by S07, S10, S12; Act1 has its own copy):
// Green (armchair, left) is lit by the warm lamp, Red (bed, right) by the cold phone; a soft falloff
// blends the two, so it reads as one continuous room. The camera is driven by `cam`.
export const DualRoom: React.FC<{
  green: SeqFrame[];
  red: SeqFrame[];
  cam: CamKey[];
  greenBlink?: {twins: Record<string, string>; seed: string};
  redBlink?: {twins: Record<string, string>; seed: string};
  warm?: number; // 1 = lamp on
  phoneGlow?: number; // 0..1
  glowAt?: [number, number];
  clockMinutes?: number;
  children?: React.ReactNode;
}> = ({green, red, cam, greenBlink, redBlink, warm = 1, phoneGlow = 1, glowAt = [1458, 790], clockMinutes = 11 * 60 + 40, children}) => {
  const frame = useCurrentFrame();
  const lamp = 0.8 + 0.2 * Math.sin(frame / 31) + random(`dl-${Math.floor(frame / 5)}`) * 0.05;
  const flick = phoneGlow * (0.8 + random(`dp-${Math.floor(frame / 2)}`) * 0.2);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={cam} handheld={0.45}>
        <GradeWarm lampX={440} lampY={470} warm={warm}>
          <FrameSeq frames={quick(green)} fade={7} blink={greenBlink} />
        </GradeWarm>
        <AbsoluteFill style={{WebkitMaskImage: 'linear-gradient(to right, transparent 40%, #000 60%)', maskImage: 'linear-gradient(to right, transparent 40%, #000 60%)'}}>
          <GradeNight>
            <FrameSeq frames={quick(red)} fade={7} blink={redBlink} />
          </GradeNight>
        </AbsoluteFill>
        <WallClock minutes={clockMinutes} />
        <Glow x={440} y={470} r={520} color="rgba(255,200,120,0.3)" opacity={lamp * 0.6 * warm} />
        <Glow x={glowAt[0]} y={glowAt[1]} r={400} color="rgba(110,175,255,0.8)" opacity={flick * 0.85} />
        <Dust count={22} area={{x: 40, y: 220, w: 760, h: 700}} seed="dual" />
        {children}
      </Camera>
    </AbsoluteFill>
  );
};
