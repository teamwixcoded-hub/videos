import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GRADES, Path} from '../theme';

// `mix` 0 -> `from`, 1 -> `to`. Use for the S11 blue->gold interpolation.
export const Grade: React.FC<{
  from: Path;
  to?: Path;
  mix?: number;
  children: React.ReactNode;
}> = ({from, to = from, mix = 0, children}) => {
  const a = GRADES[from];
  const b = GRADES[to];
  const l = (x: number, y: number) => x + (y - x) * mix;
  const filter = `saturate(${l(a.saturate, b.saturate)}) brightness(${l(a.brightness, b.brightness)}) sepia(${l(a.sepia, b.sepia)})`;
  return <AbsoluteFill style={{filter}}>{children}</AbsoluteFill>;
};
