import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {GradeNight, GradeWarm} from '../components/Lighting';
import {KText} from '../components/KText';
import {BigCounter} from '../components/Props5';
import {Dim, Glow} from './common';
import {DualRoom} from './DualRoom';
import {focus, Shake} from '../vfx/Motion';
import {Flash, Grain, Vignette} from '../vfx/Atmosphere';
import {SfxTrack, Cue} from '../components/Sfx';
import {HEAD_FONT, BODY_FONT} from '../fonts';
import {R, easeInOut, clamp01} from '../easing';
import {NameTag} from '../components/Explain';

// ============================================================================================
// THE HOOK (8.4 s, real time). Show the ending first, then rewind.
//   0.0  hard cut: Day 365, split screen. Two identical men, two opposite lives. "SAME MAN."
//   1.7  the numbers: 20+ books  vs  1,000+ hours on a screen
//   2.9  "WHAT HAPPENED?"  (dark dip + shake)
//   3.7  rewind: DAY 365 -> DAY 1 on a VHS counter while the picture melts back to the first night
//   6.0  title slam: ONE SCROLLED. ONE READ.      -> flows straight into the story
// All times below are real seconds (R()), not the story's speed-scaled seconds.
// ============================================================================================

const INK = '#2a1713';
const f = (s: number) => R(s);

// one half of the split: a keyframe cropped around its character, slowly pushing in
const Panel: React.FC<{side: 'left' | 'right'; src: string; cx: number; cy: number; z0: number; z1: number; children?: React.ReactNode}> = ({side, src, cx, cy, z0, z1, children}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, f(4.4)], [z0, z1], {extrapolateRight: 'clamp'});
  const W = 960;
  const inner = (
    <>
      <Img src={staticFile(`images/${src}.png`)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080}} />
      {children}
    </>
  );
  return (
    <div style={{position: 'absolute', left: side === 'left' ? 0 : W, top: 0, width: W, height: 1080, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${W / 2 - cx * z}px, ${540 - cy * z}px) scale(${z})`}}>
        {side === 'left' ? <GradeWarm lampX={440} lampY={470}>{inner}</GradeWarm> : <GradeNight>{inner}</GradeNight>}
      </div>
    </div>
  );
};

const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const glowL = 0.7 + 0.2 * Math.sin(frame / 9);
  const flick = 0.75 + random(`hk-${Math.floor(frame / 2)}`) * 0.25;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Panel side="left" src="FL_G15" cx={470} cy={600} z0={1.55} z1={1.8} />
      <Panel side="right" src="FL_R8" cx={1500} cy={640} z0={1.55} z1={1.8} />
      <Glow x={470} y={380} r={520} color="rgba(255,200,120,0.4)" opacity={glowL} />
      <Glow x={1470} y={700} r={440} color="rgba(110,175,255,0.8)" opacity={flick * 0.7} />
      <div style={{position: 'absolute', left: 957, top: 0, width: 6, height: 1080, background: '#fff', boxShadow: '0 0 24px #fff'}} />
    </AbsoluteFill>
  );
};

// VHS rewind: a counter racing from DAY 365 down to DAY 1 over a scanlined, jittering frame
const Rewind: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to + 18) return null;
  const t = clamp01((frame - from) / (to - from));
  const day = Math.max(1, Math.round(365 - 364 * easeInOut(t)));
  const out = interpolate(frame, [to + 6, to + 18], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const jx = (random(`jx-${frame}`) - 0.5) * 10 * (1 - t * 0.5);
  const jy = (random(`jy-${frame}`) - 0.5) * 6;
  return (
    <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 5px)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, transparent ${(frame * 7) % 130 - 20}%, rgba(255,255,255,0.12) ${(frame * 7) % 130 - 10}%, transparent ${(frame * 7) % 130}%)`}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `translate(${jx}px, ${jy}px)`}}>
        <div style={{fontFamily: BODY_FONT, fontWeight: 800, fontSize: 54, letterSpacing: 12, color: '#fff', textShadow: '-3px 0 #ff2d55, 3px 0 #2dd4ff'}}>◀◀ REWIND</div>
        <div style={{fontFamily: HEAD_FONT, fontSize: 300, color: '#fff7e6', lineHeight: 1, textShadow: `-9px 0 #ff2d55, 9px 0 #2dd4ff, 0 9px 0 ${INK}`}}>DAY {day}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CUES: Cue[] = [
  {file: 'boom', at: 0.05, real: true, vol: 0.55, dur: 1.6, fadeOut: 0.6},
  {file: 'pop_b', at: 0.25, real: true, vol: 0.3, rate: 0.7},
  {file: 'riser', at: 1.7, real: true, vol: 0.38, dur: 1.4, fadeOut: 0.15},
  {file: 'boom', at: 2.9, real: true, vol: 0.5, dur: 1.2, fadeOut: 0.5, rate: 0.9},
  {file: 'glitch', at: 3.55, real: true, vol: 0.35},
  {file: 'rewind', at: 3.7, real: true, vol: 0.45, dur: 2.0, fadeOut: 0.3},
  {file: 'clock', at: 3.9, real: true, vol: 0.3, dur: 1.8, rate: 2.0, fadeOut: 0.3},
  {file: 'boom', at: 6.0, real: true, vol: 0.5, dur: 1.3, fadeOut: 0.5},
  {file: 'swell', at: 6.0, real: true, vol: 0.25, dur: 2.4, fadeIn: 0.6, fadeOut: 0.8},
];

export const HOOK_FRAMES = f(8.4);

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const splitOpacity = interpolate(frame, [f(4.5), f(5.6)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dip = interpolate(frame, [f(2.85), f(2.95), f(3.6)], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blackIn = interpolate(frame, [0, 3], [1, 0], {extrapolateRight: 'clamp'});
  const chroma = frame > f(3.6) && frame < f(4.4) ? 6 : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* the first night, waiting underneath: same wide shot the story opens on */}
      <DualRoom
        green={[{src: 'FL_G1', at: 0}]}
        red={[{src: 'FL_R1', at: 0}]}
        cam={[focus(0, 960, 560, 1.0), focus(f(8.4), 960, 560, 1.04)]}
        greenBlink={{twins: {FL_G1: 'FL_G1b'}, seed: 'hk-g'}}
        redBlink={{twins: {FL_R1: 'FL_R1b'}, seed: 'hk-r'}}
      />
      <Shake at={2} amount={20} duration={16}>
        <Shake at={f(2.9)} amount={22} duration={14}>
          <AbsoluteFill style={{opacity: splitOpacity, filter: chroma ? `blur(0.6px) drop-shadow(${chroma}px 0 0 rgba(255,45,85,0.7)) drop-shadow(-${chroma}px 0 0 rgba(45,212,255,0.7))` : undefined}}>
            <Split />
            <Dim color="0,0,0" opacity={dip} />
          </AbsoluteFill>
        </Shake>
      </Shake>

      {/* text on the split */}
      <NameTag text="THE READER" x={480} y={1010} from={0.4} to={1.9} color="#ffd23f" />
      <NameTag text="THE SCROLLER" x={1440} y={1010} from={0.55} to={1.9} color="#7fc2ff" />
      <KText text="SAME MAN." at={4} until={f(2.8)} y={170} size={170} stagger={3} />
      <KText text="365 DAYS APART." at={f(1.0)} until={f(1.9)} y={365} size={96} highlight={["365"]} accent="#ffd23f" />
      <BigCounter from={f(1.95)} hide={f(2.8)} label="BOOKS" to={20} x={480} y={880} size={110} color="#ffe9b0" duration={22} />
      <BigCounter from={f(2.05)} hide={f(2.8)} label="HOURS ON A SCREEN" to={1000} x={1440} y={880} size={110} color="#bcd8ff" duration={26} />
      <KText text="WHAT HAPPENED?" at={f(2.9)} until={f(3.7)} y={540} size={160} highlight={['happened']} accent="#ff6b5e" />

      <Rewind from={f(3.7)} to={f(5.5)} />

      {/* the title */}
      <KText text="ONE SCROLLED." at={f(6.05)} until={f(8.4)} y={120} size={120} highlight={['scrolled']} accent="#7fc2ff" />
      <KText text="ONE READ." at={f(6.7)} until={f(8.4)} y={250} size={120} highlight={['read']} accent="#ffd23f" />

      <Flash at={0} duration={7} peak={0.95} />
      <Flash at={f(6.0)} duration={8} peak={0.6} color="#fff7e6" />
      <SfxTrack cues={CUES} />
      <Vignette strength={0.4} />
      <Grain opacity={0.12} />
      <AbsoluteFill style={{background: '#000', opacity: blackIn, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
