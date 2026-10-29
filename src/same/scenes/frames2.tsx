import React from 'react';
import {DayTag, Label, Pops, Receipt} from '../world';
import {Stage, useClock, SceneProps} from './early';
import {Cell, FKey, Frame} from './frames';
import {clamp01, easeInOut, mix, ramp} from '../lib/anim';
import {Bloom, Bokeh, camShake, Dust, GodRays, Grade, Grain, Vignette} from '../vfx';

// ============================================================================================
// S02 The choice and S03 Night one, built from image frames (public/char/sm/GL2_*.png) + code: the glass wall clock, the bus window,
// the speech bubble, the reward pops, the Bill and the clock insert. The split screen is already open from here on (p = 1).
// ============================================================================================
const Shell: React.FC<{t: number; hits: {at: number; amp: number; dur?: number}[]; stage: React.ReactNode; glow: number; overlay?: React.ReactNode; warmRays?: boolean}> = ({t, hits, stage, glow, overlay, warmRays}) => (
  <div style={{position: 'absolute', inset: 0, background: '#05060b', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: -30, transform: camShake(t, hits), transformOrigin: '50% 50%'}}><div style={{position: 'absolute', inset: 30}}>{stage}</div></div>
    <GodRays t={t} x={warmRays ? 240 : 1700} y={-80} color={warmRays ? '#ffe2b0' : '#bcd4ff'} strength={0.8} angle={warmRays ? -16 : 16} />
    <Dust t={t} count={70} color="#eef4ff" seed={2} />
    <Bokeh t={t} color="#9ec8ff" count={7} seed={3} />
    {glow > 0.02 && <Bloom x={1330} y={640} r={420} color="#8fd0ff" power={glow} />}
    <Grade split={960} />
    {overlay}
    <Vignette strength={0.5} />
    <Grain amount={0.1} />
  </div>
);

// a glass wall clock, drawn in code (the reader glances at it)
const WallClock: React.FC<{x: number; y: number; t: number; speed?: number; glow?: number; op?: number}> = ({x, y, t, speed = 0.4, glow = 0, op = 1}) => {
  const m = t * speed;
  if (op <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y})`} opacity={op}>
      <circle r={92} fill="#ffe9b8" opacity={0.18 + glow * 0.3} />
      <circle r={66} fill="#f7f1ff" stroke="#1a1820" strokeWidth={8} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={-52} x2={0} y2={-44} stroke="#1a1820" strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 90})`} />)}
      <line x1={0} y1={0} x2={0} y2={-30} stroke="#1a1820" strokeWidth={8} strokeLinecap="round" transform={`rotate(${m * 30})`} />
      <line x1={0} y1={0} x2={0} y2={-46} stroke="#1a1820" strokeWidth={5} strokeLinecap="round" transform={`rotate(${m * 360})`} />
      <ellipse cx={-18} cy={-24} rx={16} ry={34} fill="#fff" opacity={0.45} transform="rotate(25)" />
    </g>
  );
};

// the bus window: city lights sliding past (code); the seat and the man are the image frame
const BusWindow: React.FC<{cx: number; t: number}> = ({cx, t}) => (
  <g>
    <rect x={cx - 380} y={140} width={760} height={340} rx={26} fill="#10213f" stroke="#1a1820" strokeWidth={9} />
    <clipPath id="bwin"><rect x={cx - 374} y={146} width={748} height={328} rx={22} /></clipPath>
    <g clipPath="url(#bwin)">
      <rect x={cx - 380} y={140} width={760} height={340} fill="#1c3566" />
      {Array.from({length: 11}).map((_, i) => {
        const w = 70 + ((i * 41) % 70), h = 90 + ((i * 67) % 150), x = cx - 380 + ((((i * 120 - t * 190) % 1320) + 1320) % 1320) - 100;
        return <g key={i}><rect x={x} y={474 - h} width={w} height={h} fill="#0e1c3a" /><rect x={x + 12} y={474 - h + 16} width={12} height={12} fill="#ffd36b" opacity={0.8} /><rect x={x + 36} y={474 - h + 44} width={12} height={12} fill="#ffd36b" opacity={0.6} /></g>;
      })}
      {Array.from({length: 5}).map((_, i) => <circle key={i} cx={cx - 380 + ((((i * 260 - t * 360) % 1300) + 1300) % 1300)} cy={190 + (i % 3) * 60} r={8} fill="#ffe9b0" opacity={0.7} />)}
    </g>
  </g>
);

const SpeechBubble: React.FC<{x: number; y: number; lines: string[]; k: number}> = ({x, y, lines, k}) => (
  <g opacity={clamp01(k)} transform={`translate(${x} ${y}) scale(${0.85 + 0.15 * clamp01(k)})`}>
    <path d="M0,0 h360 a28,28 0 0 1 28,28 v76 a28,28 0 0 1 -28,28 h-230 l-38,42 l4,-42 h-96 a28,28 0 0 1 -28,-28 v-76 a28,28 0 0 1 28,-28 z" fill="#f8f2ff" stroke="#1a1820" strokeWidth={6} />
    {lines.map((l, i) => <text key={i} x={194} y={72 + i * 38} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={800} fontSize={32} fill="#1a1820">{l}</text>)}
  </g>
);

// ============================================================================================ S02 THE CHOICE
export const S02Frames: React.FC<SceneProps> = ({startSec}) => {
  const {t, A} = useClock(startSec);
  const dlg = 51.1 - startSec, tClock = A(41.4), tYawn = A(42.6), tRelax = A(30.3);
  const sc: FKey[] = [{t: 0, name: 'GL2_bed_phone'}];
  const pops: number[] = [];
  for (let tt = A(27.1); tt < dlg; tt += tt < tRelax ? 0.9 : 1.6) {
    sc.push({t: tt, name: 'GL2_bed_swipe'}, {t: tt + 0.4, name: tt > tRelax ? 'GL2_bed_relaxed' : 'GL2_bed_phone'});
    pops.push(tt);
  }
  sc.push({t: A(28.0), name: 'GL2_bed_laugh'}, {t: A(28.0) + 0.7, name: 'GL2_bed_phone'}, {t: tRelax, name: 'GL2_bed_relaxed'});
  sc.sort((a, b) => a.t - b.t);
  const rd: FKey[] = [{t: 0, name: 'GL2_arm_bookopen'}, {t: tClock, name: 'GL2_arm_clock'}, {t: tYawn, name: 'GL2_arm_yawn'}, {t: tYawn + 1.7, name: 'GL2_arm_bookopen'}, {t: dlg, name: 'GL2_arm_sigh'}];
  const glow = Math.max(0, ...pops.map((pt) => { const u = (t - pt) / 0.6; return u > 0 && u < 1 ? 1 - u : 0; })) * 0.8 + 0.25;
  const hits = pops.map((pt) => ({at: pt, amp: 2.5, dur: 0.25}));
  const glance = clamp01(1 - Math.abs(t - (tClock + 0.5)) / 0.8);
  return (
    <Shell t={t} hits={hits} glow={glow}
      stage={
        <Stage p={1} zr={0.64} zl={0.64} focusR={[1440, 520]} focusL={[480, 520]}
          right={(cx) => (
            <Cell cx={cx} warm={false} glow={glow} id="s2">
              <Frame cx={cx} seq={sc} t={t} seed={1} flip />
              <g transform={`translate(${cx - 150} 470)`}><Pops times={pops} t={t} at={[0, 0]} /></g>
            </Cell>
          )}
          left={(cx) => (
            <Cell cx={cx} warm glow={0.4} id="r2">
              <WallClock x={cx + 300} y={230} t={t} glow={glance} speed={0.15} op={clamp01(ramp(t, tClock - 0.8, tClock - 0.2)) * (1 - ramp(t, tClock + 1.2, tClock + 1.9))} />
              <Frame cx={cx} seq={rd} t={t} seed={2} />
            </Cell>
          )} />
      }
      overlay={t > dlg ? <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}><SpeechBubble x={170} y={190} lines={['Who even reads', 'anymore…']} k={ramp(t, dlg + 0.2, dlg + 0.6)} /></svg> : null} />
  );
};

// ============================================================================================ S03 NIGHT ONE
export const S03Frames: React.FC<SceneProps> = ({startSec}) => {
  const {t, A} = useClock(startSec);
  const tClock = A(49.5), tShut = A(52.9), tBored = A(59.94), tBill = A(67.6), tNight2 = A(69.56), tNight3 = A(72.6);
  const sc: FKey[] = [{t: 0, name: 'GL2_bed_slump'}, {t: 1.4, name: 'GL2_bed_phone'}];
  for (let tt = 3.4; tt < tNight3 + 4; tt += 1.7) sc.push({t: tt, name: 'GL2_bed_swipe'}, {t: tt + 0.4, name: tt > tBored && tt < tNight2 ? 'GL2_bed_relaxed' : 'GL2_bed_phone'});
  sc.push({t: tBored, name: 'GL2_bed_relaxed'});
  sc.sort((a, b) => a.t - b.t);
  const rd: FKey[] = [{t: 0, name: 'GL2_arm_slump'}, {t: 1.6, name: 'GL2_arm_bookopen'}, {t: tShut, name: 'GL2_arm_shut'}, {t: tShut + 1.5, name: 'GL2_arm_bookclosed'}, {t: tBored, name: 'GL2_arm_bored'}, {t: tNight2, name: 'GL2_arm_bookclosed'}, {t: tNight3, name: 'GL2_bus_read'}];
  const onBus = t >= tNight3;
  const label = t >= tNight3 ? 'NIGHT 3' : t >= tNight2 ? 'NIGHT 2' : 'NIGHT 1';
  const mins = Math.round(mix(23 * 60 + 40, 26 * 60, easeInOut((t - tClock) / 2.6))), hh = Math.floor(mins / 60) % 24, mm = mins % 60;
  const clockTxt = `${hh === 0 ? 12 : hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, '0')}`;
  const bigClock = t > tClock && t < tClock + 5.2;
  const hits = [{at: tShut, amp: 12, dur: 0.5}, {at: tNight3, amp: 6, dur: 0.4}];
  return (
    <Shell t={t} hits={hits} glow={0.5} warmRays={onBus}
      stage={
        <Stage p={1} zr={0.64} zl={0.64} focusR={[1440, 520]} focusL={[480, 520]}
          right={(cx) => (
            <Cell cx={cx} warm={false} glow={0.5} id="s3">
              {t > tBill && <g transform={`translate(${cx - 430} 110)`}><Receipt x={0} y={0} k={1 + ramp(t, tBill, tBill + 3) * 2} /></g>}
              <Frame cx={cx} seq={sc} t={t} seed={1} flip />
            </Cell>
          )}
          left={(cx) => onBus ? (
            <Cell cx={cx} warm={false} glow={0.3} id="b3"><BusWindow cx={cx} t={t} /><Frame cx={cx} seq={rd} t={t} seed={2} /></Cell>
          ) : (
            <Cell cx={cx} warm glow={0.4} id="r3">
              <WallClock x={cx + 300} y={230} t={t} speed={3} glow={1} op={clamp01(ramp(t, tClock - 0.4, tClock + 0.1)) * (1 - ramp(t, tClock + 3.0, tClock + 3.6))} />
              <Frame cx={cx} seq={rd} t={t} seed={2} />
            </Cell>
          )} />
      }
      overlay={
        <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          <DayTag text={label} t={t} at={0.2} />
          {bigClock && <Label text={t > tClock + 2.6 ? '2:00 AM' : clockTxt} x={960} y={520} t={t} at={tClock} until={tClock + 5} size={170} color="#ffd23f" />}
        </svg>
      } />
  );
};
