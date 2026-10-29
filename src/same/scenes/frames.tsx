import React from 'react';
import {staticFile} from 'remotion';
import {TitleCard} from '../world';
import {Stage, useClock, SceneProps} from './early';
import {clamp01, easeInOut, mix, ramp} from '../lib/anim';
import {Bloom, Bokeh, camShake, Dust, Flash, GodRays, Grade, Grain, LensStreak, Shockwave, Sparks, Vignette} from '../vfx';

// ============================================================================================
// Frame-based scenes: every drawing is an image made in the user's character style (public/char/sm/*.png, transparent background).
// Limited animation like the reference videos: each drawing is HELD, changes land on the beat, a small settle ("pop") on every
// change, slow breathing in between, and the camera / light / split screen do the rest.
// ============================================================================================
export type FKey = {t: number; name: string};
const pick = (seq: FKey[], t: number) => { let i = 0; seq.forEach((k, j) => { if (t >= k.t) i = j; }); return {name: seq[i].name, since: t - seq[i].t, i}; };
const IMG_W = 1935, IMG_H = 1080;

export const Frame: React.FC<{cx: number; seq: FKey[]; t: number; seed?: number; pop?: boolean; dy?: number; flip?: boolean}> = ({cx, seq, t, seed = 0, pop = true, dy = 0, flip = false}) => {
  const {name, since} = pick(seq, t);
  const s = pop && since >= 0 && since < 0.22 ? 1 + 0.018 * Math.sin((since / 0.22) * Math.PI) : 1;
  const br = 1 + Math.sin(t * 1.5 + seed) * 0.004;
  return (
    <g transform={`translate(${cx} ${930 + dy}) scale(${(flip ? -1 : 1) * s * br} ${s * br}) translate(${-cx} ${-930})`}>
      <image href={staticFile(`char/sm/${name}.png`)} x={cx - IMG_W / 2} y={0} width={IMG_W} height={IMG_H} preserveAspectRatio="xMidYMid slice" />
    </g>
  );
};

// the two rooms are paper-light so the thick black outlines stay readable; mood comes from tint, glow and vignette
export const Cell: React.FC<{cx: number; warm: boolean; glow?: number; children: React.ReactNode; id: string}> = ({cx, warm, glow = 0, children, id}) => (
  <g>
    <defs>
      <linearGradient id={'bg' + id} gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="1300">
        <stop offset="0" stopColor={warm ? '#efd9b5' : '#b9c6e0'} /><stop offset="1" stopColor={warm ? '#dcc08f' : '#8fa0c4'} />
      </linearGradient>
      <radialGradient id={'gl' + id} cx="50%" cy="55%" r="55%"><stop offset="0" stopColor={warm ? '#ffd9a0' : '#bfe2ff'} stopOpacity="0.8" /><stop offset="1" stopColor={warm ? '#ffd9a0' : '#bfe2ff'} stopOpacity="0" /></radialGradient>
    </defs>
    <rect x={cx - 4000} y={-3000} width={8000} height={7000} fill={`url(#bg${id})`} />
    <ellipse cx={cx} cy={620} rx={620} ry={520} fill={`url(#gl${id})`} opacity={0.55 + glow * 0.45} />
    {children}
    <rect x={cx - 4000} y={-3000} width={8000} height={7000} fill={warm ? '#3a2208' : '#0b1430'} opacity={warm ? 0.22 : 0.34} style={{mixBlendMode: 'multiply'}} />
  </g>
);

export const S01Frames: React.FC<SceneProps> = ({startSec}) => {
  const {t, A} = useClock(startSec);
  const tSplit = A(11.5), tTitle = 23.2;
  const p = easeInOut((t - tSplit) / 1.0);
  const push = easeInOut(ramp(t, 0, tSplit));
  const zoom = mix(mix(1.0, 1.05, push), 0.64, p);
  const fade = clamp01(t / 1.2);
  const PING = [9.4, 10.9];
  // opening: he is alive before anything happens: blinks, a heavy sigh, then the phone buzzes and he glances at it
  const sc: FKey[] = [
    {t: 0, name: 'GL2_bed_slump'}, {t: 1.4, name: 'GL2_bed_blink'}, {t: 1.54, name: 'GL2_bed_slump'}, {t: 4.0, name: 'GL2_bed_blink'}, {t: 4.14, name: 'GL2_bed_slump'},
    {t: 5.7, name: 'GL2_bed_sigh'}, {t: 7.9, name: 'GL2_bed_slump'}, {t: 9.3, name: 'GL2_bed_choice'}, {t: 12.3, name: 'GL2_bed_slump'}, {t: 13.0, name: 'GL2_bed_blink'}, {t: 13.14, name: 'GL2_bed_slump'},
    {t: A(13.0), name: 'GL2_bed_reach1'}, {t: A(13.9), name: 'GL2_bed_reach2'}, {t: A(14.8), name: 'GL2_bed_phone'}, {t: A(19.0), name: 'GL2_bed_lookup'},
  ];
  const rd: FKey[] = [{t: 0, name: 'GL2_arm_slump'}, {t: A(15.9), name: 'GL2_arm_reach'}, {t: A(16.6), name: 'GL2_arm_bookclosed'}, {t: A(17.5), name: 'GL2_arm_bookopen'}, {t: A(19.0), name: 'GL2_arm_lookup'}];
  const pingGlow = Math.max(0, ...PING.map((pt) => { const u = (t - pt) / 0.9; return u > 0 && u < 1 ? (1 - u) * (0.6 + 0.4 * Math.abs(Math.sin(u * 14))) : 0; }));
  const phoneGlow = Math.max(pingGlow, ramp(t, A(14.8), A(15.6)) * (1 - ramp(t, A(19.0), A(19.6))) * 0.9);
  const titleT = t - tTitle;
  const hits = [{at: tSplit, amp: 18}, {at: tTitle, amp: 26, dur: 0.7}, {at: PING[0], amp: 5, dur: 0.35}, {at: PING[1], amp: 5, dur: 0.35}, {at: A(14.8), amp: 4, dur: 0.3}, {at: A(17.5), amp: 3, dur: 0.3}];
  const cxR = 960 + 480 * p;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#05060b', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: -30, opacity: fade, transform: camShake(t, hits), transformOrigin: '50% 50%'}}>
        <div style={{position: 'absolute', inset: 30}}>
          <Stage p={p} zr={zoom} zl={0.64 + 0.36 * (1 - p)} focusR={[cxR, 520]} focusL={[480 * p, 520]}
            right={(cx) => <Cell cx={cx} warm={false} glow={phoneGlow} id="s"><Frame cx={cx} seq={sc} t={t} seed={1} flip /></Cell>}
            left={(cx) => <Cell cx={cx} warm glow={0.4} id="r"><Frame cx={cx} seq={rd} t={t} seed={2} /></Cell>} />
        </div>
      </div>
      {/* the cinematic layer */}
      <GodRays t={t} x={cxR + 360} y={-80} color={p > 0.5 ? '#ffe2b0' : '#bcd4ff'} strength={0.9} />
      <Dust t={t} count={80} color="#eef4ff" seed={1} />
      <Bokeh t={t} color={p > 0.5 ? '#ffc98a' : '#9ec8ff'} count={9} />
      {phoneGlow > 0.02 && <Bloom x={cxR - 80} y={640} r={420} color="#8fd0ff" power={phoneGlow} />}
      <Grade split={960 * p} />
      <Shockwave t={t} at={tSplit} x={960 * p + 2} />
      <LensStreak t={t} at={tSplit} x={960 * p} y={540} power={1} />
      <Flash t={t} at={tSplit} power={0.55} />
      <Flash t={t} at={PING[0]} dur={0.3} color="#bfe0ff" power={0.22} /><Flash t={t} at={PING[1]} dur={0.3} color="#bfe0ff" power={0.22} />
      {titleT > 0 && (
        <div style={{position: 'absolute', inset: 0, transform: camShake(t, [{at: tTitle, amp: 26, dur: 0.7}], 0)}}>
          <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}><TitleCard words={['ONE', 'HABIT.']} t={titleT} /></svg>
          <Flash t={t} at={tTitle} dur={0.5} power={0.8} /><Shockwave t={t} at={tTitle} x={960} y={600} dur={1.0} /><Sparks t={t} at={tTitle + 0.28} x={960} y={700} />
          <LensStreak t={t} at={tTitle + 0.28} x={960} y={620} color="#ffb18c" dur={1.3} />
        </div>
      )}
      <Vignette strength={0.55} />
      <Grain amount={0.1} />
    </div>
  );
};
