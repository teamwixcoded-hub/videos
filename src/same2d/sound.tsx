import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS} from './theme';

// Sound design for the 2D cut: ElevenLabs recordings in public/sfx3/ (see scripts/el-sfx3.mjs). `old: true` plays a real recorded voice from
// public/sfx/ (yawn, sigh, chuckle) because human sounds stay the real ones. Times are VIDEO seconds.
export type Cue3 = {file: string; at: number; vol?: number; dur?: number; loop?: boolean; rate?: number; fadeIn?: number; fadeOut?: number; old?: boolean};

export const Sfx3: React.FC<{cues: Cue3[]; gain?: number; duck?: (t: number) => number; minVol?: number}> = ({cues, gain = 1, duck, minVol = 0}) => (
  <>
    {cues.map((c, i) => {
      const from = Math.max(0, Math.round(c.at * FPS)), dur = c.dur ? Math.max(1, Math.round(c.dur * FPS)) : undefined;
      const fi = Math.max(1, Math.round((c.fadeIn ?? 0.02) * FPS)), fo = Math.max(1, Math.round((c.fadeOut ?? 0.12) * FPS));
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <Audio
            src={staticFile(`${c.old ? 'sfx' : 'sfx3'}/${c.file}.mp3`)}
            loop={c.loop}
            playbackRate={c.rate ?? 1}
            volume={(f) => (c.loop ? (c.vol ?? 0.5) : Math.max(c.vol ?? 0.5, minVol)) * gain * (duck ? duck(c.at + f / FPS) : 1) * Math.min(1, f / fi) * (dur ? Math.min(1, Math.max(0, (dur - f) / fo)) : 1)}
          />
        </Sequence>
      );
    })}
  </>
);
