import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Green is always left, Red is always right. The divider wipes in over `wipeFrames`.
export const SplitScreen: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  wipeFrames?: number;
  startOpen?: boolean; // true: starts as one frame (S01), then the wipe divides it
}> = ({left, right, wipeFrames = 20, startOpen = false}) => {
  const frame = useCurrentFrame();
  const t = startOpen ? interpolate(frame, [0, wipeFrames], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  // Divider position: 50% once the wipe is done; before that it sits off-screen.
  const mid = startOpen ? interpolate(t, [0, 1], [100, 50]) : 50;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 ${100 - mid}% 0 0)`}}>{left}</AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 0 0 ${mid}%)`}}>{right}</AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${mid}%`,
          width: 6,
          marginLeft: -3,
          background: '#fff',
          opacity: 0.9,
        }}
      />
    </AbsoluteFill>
  );
};
