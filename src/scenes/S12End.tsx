import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DualRoom} from './DualRoom';
import {GREEN_FINAL, RED_FINAL} from './S10Day365';
import {focus} from '../vfx/Motion';
import {Grain, Vignette} from '../vfx/Atmosphere';
import {CaptionLine, NarrationCaptions} from '../components/Props4';
import {Beats} from '../components/Cinema';
import {SfxTrack, Cue} from '../components/Sfx';
import {frameCues, camCues} from '../components/autoSfx';

import {PropPop} from '../components/PropPop';
import {TypoS12} from '../typography';
import {HEAD_FONT, BODY_FONT} from '../fonts';
import {S, TIME_SCALE} from '../easing';

// ============================================================================================
// S12 · END. The phone gives you a good night. The book gives you a good life. Tonight… which one
// will you pick up?  Back to the wide two-man shot, then the end card.
// ============================================================================================

const INK = '#2a1713';
// a slow push toward the empty space between the two men, easing into a slight tilt as the question lands
const CAM = [{...focus(0, 960, 570, 1.0), rotate: 0}, {...focus(S(8.4), 960, 565, 1.28), rotate: -0.8}, {...focus(S(14), 960, 560, 1.42), rotate: -1.2}];

const CAPTIONS: CaptionLine[] = [
  {text: 'The phone gives you a good night.', from: 0.8, to: 3.8},
  {text: 'The book gives you a good life.', from: 4.4, to: 7.4},
  {text: 'Tonight… which one will you pick up?', from: 8.4, to: 12.4},
];

const SFX: Cue[] = [
  {file: 'room_tone', at: 0, dur: 9, vol: 0.2, fadeIn: 1.5, fadeOut: 2},
  {file: 'swell', at: 0.4, dur: 5, vol: 0.24, fadeIn: 1.2, fadeOut: 2},
  {file: 'notification', at: 3.6, vol: 0.18},
  {file: 'page', at: 6.8, vol: 0.28},
  {file: 'swell', at: 10.2, dur: 5, vol: 0.28, fadeIn: 1.0, fadeOut: 2.2},
];

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = S(13);
  const o = interpolate(frame, [start, start + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pop = spring({frame: frame - start - 10, fps, config: {damping: 12, stiffness: 100}});
  if (frame < start) return null;
  return (
    <AbsoluteFill style={{background: `rgba(14,12,18,${0.92 * o})`, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity: o, textAlign: 'center'}}>
        <div style={{fontFamily: HEAD_FONT, fontSize: 104, color: '#fff7e6', textShadow: `0 7px 0 ${INK}`, letterSpacing: 3}}>WHICH ONE WILL YOU PICK UP?</div>
        <div style={{display: 'flex', gap: 60, justifyContent: 'center', alignItems: 'center', marginTop: 70, transform: `scale(${0.8 + 0.2 * pop})`}}>
          <div style={{background: '#d9453b', border: `7px solid ${INK}`, borderRadius: 22, padding: '22px 58px', fontFamily: HEAD_FONT, fontSize: 64, color: '#fff', textShadow: `0 4px 0 ${INK}`}}>SUBSCRIBE</div>
          <div style={{width: 560, height: 315, borderRadius: 20, border: `7px solid ${INK}`, background: 'rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: BODY_FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: 'rgba(255,255,255,0.7)'}}>NEXT VIDEO</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const S12_FRAMES = S(15);

export const S12End: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <DualRoom green={GREEN_FINAL} red={RED_FINAL} cam={CAM} glowAt={[1290, 640]}>
      <PropPop src="props/phone-lit" x={1470} y={330} w={150} from={3.6} to={8.0} />
      <PropPop src="props/book-open" x={380} y={330} w={170} from={6.6} to={10.5} />
    </DualRoom>
    <EndCard />
    <Beats scene="S12End" />
    <SfxTrack cues={[...SFX]} />
    <TypoS12 />
    <Vignette strength={0.3} />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);
