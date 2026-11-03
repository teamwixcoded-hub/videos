import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, Sequence} from 'remotion';
import {Sfx3, Cue3} from '../same2d/sound';
import {Bubble, ramp, Dust} from '../same2d/fx';
import {TypeLayer, TW} from '../fathers/type';
import {GRAIN} from '../fathers/fx';
import {LEVELS} from '../same7/data/levels';
import {ROOM} from '../winter/scenes';
import type {Shot4} from '../winter/act4';
import {FPS, VOICE_FILE, END} from './timeline';
import {SHOTS_1, POPS_1, BUBBLES_1, CUES_1} from './act1';
import {SHOTS_2, POPS_2, BUBBLES_2, CUES_2} from './act2';
import {SHOTS_3, POPS_3, BUBBLES_3, CUES_3} from './act3';

// ============================================================================================
// OVERTHINKING (Sam and Jake, three chances). The voice-over is Overthinking/Overthinking.mp3 (10:51); every shot sits on the narration with T('phrase').
// Built so far: see END in timeline.ts. The men lip-sync only the lines they say themselves (speakOpen).
// ============================================================================================
export const OVERTHINK_FRAMES = Math.round(END * FPS);

const SHOTS: Shot4[] = [...SHOTS_1, ...SHOTS_2, ...SHOTS_3];
for (let i = 1; i < SHOTS.length; i++) if (SHOTS[i].at <= SHOTS[i - 1].at) throw new Error('shots out of order at ' + SHOTS[i].at.toFixed(1) + ' s (shot ' + i + ')');
const POPS: TW[] = [...POPS_1, ...POPS_2, ...POPS_3];
const BUBBLES = [...BUBBLES_1, ...BUBBLES_2, ...BUBBLES_3];
const CUES: Cue3[] = [...CUES_1, ...CUES_2, ...CUES_3, ...SHOTS.slice(1).map((s): Cue3 => ({file: 'whoosh_soft', at: s.at - 0.03, vol: 0.14})), ...POPS.map((w): Cue3 => (w.mode === 'slam' ? {file: 'text_slam', at: w.at, vol: 0.26} : {file: 'text_pop', at: w.at, vol: 0.14}))];

const mixCue = (c: Cue3): Cue3 => {
  if (c.loop) return {...c, vol: Math.min(1, (c.vol ?? 0.1) * 2.5)};
  const a = LEVELS[c.file]?.act ?? -20, k = Math.min(1.6, Math.max(0.5, (c.vol ?? 0.15) / 0.15));
  return {...c, vol: Math.min(1, 0.8 * k * Math.pow(10, (-20 - a) / 20))};
};

export const Overthink: React.FC = () => {
  ROOM.snow = false;
  const frame = useCurrentFrame(), t = frame / FPS;
  const i = Math.max(0, SHOTS.reduce((n, s, k) => (t >= s.at ? k : n), 0)), shot = SHOTS[i], to = SHOTS[i + 1]?.at ?? END;
  const p = Math.min(1, Math.max(0, (t - shot.at) / (to - shot.at))), cam = shot.cam ?? [960, 540, 1];
  const zoom = 1 + (cam[2] - 1) * p, fadeOut = ramp(t, END - 0.4, END);
  const musicEnv = (from: number, to2: number) => (f: number) => Math.min(1, 0.2 * Math.min(1, f / 60) * Math.min(1, Math.max(0, ((to2 - from) * FPS - f) / 75)));
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${cam[0]}px ${cam[1]}px`}}>{shot.node(t)}</AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(70,115,185,.2)', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.5) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${(frame * 37) % 220}px ${(frame * 91) % 220}px`, mixBlendMode: 'overlay', opacity: 0.1, pointerEvents: 'none'}} />
      <Dust t={t} dense />
      <TypeLayer t={t} words={POPS} />
      {BUBBLES.map((b) => <Bubble key={b.text + b.x} t={t} from={b.from} to={b.to} text={b.text} x={b.x} y={b.y} />)}
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
      {VOICE_FILE && <Sequence from={0} durationInFrames={OVERTHINK_FRAMES}><Audio src={staticFile(VOICE_FILE)} /></Sequence>}
      <Sfx3 cues={CUES.map(mixCue)} gain={1} minVol={0} />
      <Sequence from={0} durationInFrames={Math.min(OVERTHINK_FRAMES, Math.round(330 * FPS))}><Audio src={staticFile('music/low.mp3')} volume={musicEnv(0, Math.min(END, 330))} /></Sequence>
    </AbsoluteFill>
  );
};
