import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Plays an image sequence at `fps` (default 8). `holds` maps image index -> extra frames to hold.
export const PoseSwap: React.FC<{
  images: string[]; // file names under public/images
  fps?: number;
  holds?: Record<number, number>;
  loop?: boolean;
}> = ({images, fps = 8, holds = {}, loop = false}) => {
  const frame = useCurrentFrame();
  const {fps: videoFps} = useVideoConfig();
  const per = videoFps / fps;
  let acc = 0;
  const starts = images.map((_, i) => {
    const s = acc;
    acc += per + (holds[i] ?? 0);
    return s;
  });
  const f = loop ? frame % acc : frame;
  let idx = 0;
  for (let i = 0; i < starts.length; i++) if (f >= starts[i]) idx = i;
  return <Img src={staticFile(`images/${images[idx]}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
};
