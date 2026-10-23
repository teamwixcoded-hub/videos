import React from 'react';
import {Audio, staticFile, useCurrentFrame} from 'remotion';
import {duckAt} from './Cinema';

// A music bed for one scene. `startAt` = seconds into the track (so consecutive scenes continue the same piece).
// Fades in and out over the scene so beds crossfade across scene transitions. Kept quiet: the story speaks first.
export const Music: React.FC<{track: string; startAt?: number; frames: number; vol?: number; fadeIn?: number; fadeOut?: number; beats?: number[]}> = ({track, startAt = 0, frames, vol = 0.2, fadeIn = 36, fadeOut = 40, beats = []}) => {
  const frame = useCurrentFrame();
  void frame;
  return (
    <Audio
      src={staticFile(`music/${track}.mp3`)}
      startFrom={Math.round(startAt * 30)}
      volume={(f) => vol * duckAt(f, beats) * Math.min(1, f / fadeIn) * Math.min(1, Math.max(0, (frames - f) / fadeOut))}
    />
  );
};
