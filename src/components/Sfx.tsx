import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {S, R} from '../easing';

// One sound cue. `at` is in seconds, so cues read like the shot list. `dur` trims long files,
// with a short fade so nothing clicks. `vol` is kept low on purpose: narration goes on top later.
export type Cue = {file: string; at: number; real?: boolean; vol?: number; rate?: number; dur?: number; fadeIn?: number; fadeOut?: number};

// beds that must run longer than their file are looped
const LOOPED = new Set(['room_tone', 'clock']);

export const SfxTrack: React.FC<{cues: Cue[]}> = ({cues}) => (
  <>
    {cues.map((c, i) => {
      const dur = c.dur ? R(c.dur) : undefined; // sound files keep their real length
      const fi = R(c.fadeIn ?? 0.02), fo = R(c.fadeOut ?? 0.08);
      return (
        <Sequence key={i} from={c.real ? R(c.at) : S(c.at)} durationInFrames={dur}>
          <Audio
            src={staticFile(`sfx/${c.file}.mp3`)}
            loop={LOOPED.has(c.file)}
            playbackRate={c.rate ?? 1}
            volume={(f) => {
              const v = c.vol ?? 0.5;
              const a = Math.min(1, f / Math.max(1, fi));
              const b = dur ? Math.min(1, (dur - f) / Math.max(1, fo)) : 1;
              return v * Math.max(0, Math.min(a, b));
            }}
          />
        </Sequence>
      );
    })}
  </>
);
