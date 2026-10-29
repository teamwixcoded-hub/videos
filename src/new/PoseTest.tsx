import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PoseActor, PoseKey} from './PoseActor';
import {S} from '../easing';

// Test of option 1 on the phone story: reach, grab, lift, scroll, glance, back. Review in Studio.
export const POSETEST_FRAMES = S(20);
const red: PoseKey[] = [
  {t: 0, pose: 'phoneOnBedSit'}, {t: 2, pose: 'phoneReach'}, {t: 3.2, pose: 'phoneGrab'}, {t: 4.1, pose: 'phoneLift'}, {t: 5.2, pose: 'phoneHeld'},
  {t: 9, pose: 'phoneLowRelaxed'}, {t: 12, pose: 'phoneGlanceUp'}, {t: 14, pose: 'phoneHeld'}, {t: 17, pose: 'phoneLowRelaxed'},
];
export const PoseTest: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, S(20)], [1, 1.12]);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#25304a, #1a2036)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 990, bottom: 0, background: '#2a2430'}} />
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 80%'}}>
        <PoseActor seq={red} x={620} y={330} k={2.4} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
