import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';

// Ticks from `from` to `to` over `duration` frames, starting at `delay`.
export const Counter: React.FC<{
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  size?: number;
}> = ({to, from = 0, delay = 0, duration = 60, prefix = '', suffix = '', color = '#fff', size = 96}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{fontFamily: 'Inter, Arial, sans-serif', fontWeight: 800, fontSize: size, color, letterSpacing: 2}}>
      {prefix}
      {Math.round(v).toLocaleString('en-US')}
      {suffix}
    </div>
  );
};
