import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {S} from '../easing';

// ============================================================================================
// Hollywood pass.
//  - <Cinema>  : colour grade (warm highlights / teal shadows), contrast, heavy vignette, drifting light shafts, grain
//  - <Beats>   : "hit-stops" on the biggest lines: a build-up riser, a half-second blackout, a sub-bass boom and a flash.
//  - BEATS     : the beat times per scene (script seconds). Video01 reads the same list to duck the music at each beat.
// ============================================================================================

export const BEATS: Record<string, number[]> = {
  Act1: [12.6, 36.0, 88.4, 104.6],
  S05Day21: [22.8],
  S07Day90: [32.8],
  S08Low: [30.8],
  S09Result: [15.9],
  S10Day365: [25.8],
  S11Turn: [20.8],
  S12End: [8.6],
};

// Music volume multiplier around a beat: swells down just before, silent through the hit, recovers slowly.
export const duckAt = (frame: number, beatsScriptSec: number[]) => {
  let m = 1;
  for (const b of beatsScriptSec) {
    const at = S(b);
    m = Math.min(m, interpolate(frame, [at - 24, at - 6, at + 14, at + 70], [1, 0.12, 0.12, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  }
  return m;
};

const Hit: React.FC<{file: string; at: number; vol: number; frames: number; rate?: number}> = ({file, at, vol, frames, rate = 1}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={frames}>
    <Audio src={staticFile(`sfx/${file}.mp3`)} playbackRate={rate} volume={(f) => vol * Math.min(1, f / 2) * Math.min(1, (frames - f) / 10)} />
  </Sequence>
);

export const Beats: React.FC<{scene: string}> = ({scene}) => {
  const frame = useCurrentFrame();
  const list = BEATS[scene] ?? [];
  let dark = 0, flash = 0, pulse = 0;
  for (const b of list) {
    const at = S(b);
    // hit-stop: quick fall to near-black on the beat, brief hold, then release
    dark = Math.max(dark, interpolate(frame, [at - 3, at, at + 5, at + 20], [0, 0.78, 0.78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    flash = Math.max(flash, interpolate(frame, [at + 5, at + 7, at + 16], [0, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    pulse = Math.max(pulse, interpolate(frame, [at + 5, at + 12, at + 50], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  }
  return (
    <>
      {list.map((b, i) => (
        <React.Fragment key={i}>
          <Hit file="revswell" at={S(b) - 52} vol={0.2} frames={56} />
          <Hit file="heartbeat" at={S(b) - 44} vol={0.2} frames={50} />
          <Hit file="sub" at={S(b) + 5} vol={0.55} frames={70} />
          <Hit file="boom" at={S(b) + 5} vol={0.28} frames={40} rate={0.85} />
        </React.Fragment>
      ))}
      <AbsoluteFill style={{background: '#000', opacity: dark, pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: '#fff7e6', opacity: flash, mixBlendMode: 'screen', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${0.5 * pulse}) 100%)`, pointerEvents: 'none'}} />
    </>
  );
};

export const Cinema: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 160) * 60;
  const breathe = 0.06 + 0.02 * Math.sin(frame / 55);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: 'contrast(1.1) saturate(1.06) brightness(0.97)'}}>{children}</AbsoluteFill>
      {/* grade: warm in the highlights, cool in the shadows */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,160,80,0.16) 0%, rgba(0,0,0,0) 45%, rgba(20,60,110,0.26) 100%)', mixBlendMode: 'soft-light', pointerEvents: 'none'}} />
      {/* light shafts drifting through the room */}
      <AbsoluteFill style={{opacity: breathe, mixBlendMode: 'screen', pointerEvents: 'none', transform: `translateX(${drift}px)`}}>
        <div style={{position: 'absolute', left: -300, top: -200, width: 2600, height: 1500, background: 'repeating-linear-gradient(112deg, rgba(255,226,170,0) 0px, rgba(255,226,170,0) 170px, rgba(255,226,170,0.55) 215px, rgba(255,226,170,0) 290px)', filter: 'blur(26px)', maskImage: 'linear-gradient(180deg, #000 0%, transparent 78%)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 78%)'}} />
      </AbsoluteFill>
      {/* lens: heavy vignette + a little edge softening */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,0.62) 100%)', pointerEvents: 'none'}} />
      {/* subtle film flicker */}
      <AbsoluteFill style={{background: '#fff', opacity: 0.012 + random(`fl-${Math.floor(frame / 2)}`) * 0.018, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
