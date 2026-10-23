import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {FrameSeq, SeqFrame} from '../components/FrameSeq';
import {Camera, CamKey} from '../vfx/Motion';
import {GradeDay, GradeNight, GradeWarm} from '../components/Lighting';
import {Glow} from './common';

export type Grade = 'day' | 'night' | 'warm';

export const Graded: React.FC<{grade: Grade; children: React.ReactNode; warm?: number; lamp?: [number, number]; dim?: number}> = ({grade, children, warm = 1, lamp = [440, 470], dim = 0}) =>
  grade === 'night' ? <GradeNight>{children}</GradeNight> : grade === 'warm' ? <GradeWarm lampX={lamp[0]} lampY={lamp[1]} warm={warm}>{children}</GradeWarm> : <GradeDay dim={dim}>{children}</GradeDay>;

// One camera shot over a frame sequence, with the lighting of its room and optional glows/overlays in the camera's space.
export const Shot: React.FC<{
  frames: SeqFrame[];
  grade: Grade;
  cam: CamKey[];
  blink?: {twins: Record<string, string>; seed: string};
  glow?: {x: number; y: number; r: number; color?: string; opacity?: number};
  warm?: number;
  lamp?: [number, number];
  dim?: number;
  children?: React.ReactNode;
}> = ({frames, grade, cam, blink, glow, warm, lamp, dim, children}) => {
  const frame = useCurrentFrame();
  const flick = 0.75 + random(`sh-${Math.floor(frame / 2)}`) * 0.25;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={cam} handheld={0.45}>
        <Graded grade={grade} warm={warm} lamp={lamp} dim={dim}>
          <FrameSeq frames={frames} fade={7} blink={blink} />
        </Graded>
        {glow && <Glow x={glow.x} y={glow.y} r={glow.r} color={glow.color ?? 'rgba(110,175,255,0.8)'} opacity={(glow.opacity ?? 0.8) * flick} />}
        {children}
      </Camera>
    </AbsoluteFill>
  );
};
