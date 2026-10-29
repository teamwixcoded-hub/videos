import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stick, STICK_POSES, Face} from './Stick';

// Studio-only: the two stick-figure men and every pose, on paper. Not part of the video.
const GREEN = '#6bbf59', RED = '#e0574c';
const ROW1 = ['stand', 'standTired', 'bedEdgeSlump', 'bedEdgePhone', 'armchairBook', 'armchairBookClosed'];
export const StickSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#efe8d8'}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {ROW1.map((n, i) => (
        <g key={n}>
          <Stick id={'a' + n} pose={STICK_POSES[n]} accent={i % 2 ? RED : GREEN} x={170 + i * 315} y={440} scale={0.62} />
          <text x={170 + i * 315} y={480} textAnchor="middle" fontSize="22" fontFamily="sans-serif" fill="#3a352c">{n}</text>
        </g>
      ))}
      <Stick id="ly1" pose={STICK_POSES.lyingPhone} accent={RED} x={330} y={780} scale={0.62} />
      <text x={330} y={830} textAnchor="middle" fontSize="22" fontFamily="sans-serif" fill="#3a352c">lyingPhone</text>
      <Stick id="ly2" pose={STICK_POSES.lyingAsleep} accent={GREEN} x={800} y={780} scale={0.62} />
      <text x={800} y={830} textAnchor="middle" fontSize="22" fontFamily="sans-serif" fill="#3a352c">lyingAsleep</text>
      <Stick id="yw" pose={STICK_POSES.armchairYawn} accent={GREEN} x={1090} y={800} scale={0.62} />
      <text x={1090} y={835} textAnchor="middle" fontSize="22" fontFamily="sans-serif" fill="#3a352c">armchairYawn</text>
      <Stick id="wk" pose={STICK_POSES.walk} accent={RED} x={1380} y={800} scale={0.62} />
      <text x={1380} y={835} textAnchor="middle" fontSize="22" fontFamily="sans-serif" fill="#3a352c">walk</text>
      {(['neutral', 'happy', 'tired', 'sad', 'surprised', 'asleep'] as Face[]).map((f, i) => (
        <g key={f}>
          <Stick id={'f' + f} pose={{...STICK_POSES.stand, face: f}} accent={GREEN} x={1640 + (i % 3) * 100} y={720 + Math.floor(i / 3) * 190} scale={0.26} />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
