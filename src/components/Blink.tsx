import {random, useCurrentFrame, useVideoConfig} from 'remotion';

// True while the eyes should be closed. A blink every 3-5 s, seeded so renders are stable.
export const useBlink = (seed: string): boolean => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let t = 0;
  let n = 0;
  while (t <= frame) {
    t += Math.round(fps * (3 + random(`${seed}-${n}`) * 2));
    if (frame >= t && frame < t + 4) return true;
    n++;
  }
  return false;
};
