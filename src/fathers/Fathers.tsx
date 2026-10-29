import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Entry, Ctx} from './kit';
import {LIST1, KW1} from './shots1';
import {LIST2, KW2, sundayCount} from './shots2';
import {KineticWords, KW, ramp, bell, Dust, GRAIN, BigCount, PhotoFlash} from './fx';
import {gradeAt} from './theme';
import {PIECES, AUDIO_FILE, TOTAL, FPS, speechDuck, S} from './timeline';
import {Sfx3, Cue3} from '../same2d/sound';
import {Music} from '../components/Music';

// ============================================================================================
// TWO FATHERS. Same Salary. 20 Years Later.  8:10, 1920 x 1080, 30 fps. The 3:36 recording is placed unchanged (timeline.ts); every shot of the
// plan is in shots1.tsx (0 - 215 s) and shots2.tsx (215 - 490 s). Look: warm film. Grade by act (theme.ts), serif titles (fx.tsx), a fine grain.
// ============================================================================================
export const FATHERS_FRAMES = TOTAL * FPS;
const LIST: Entry[] = [...LIST1, ...LIST2];
type Shot = {from: number; to: number; fx?: 'w' | 'f' | 'b'; C: Entry[2]};
const SHOTS: Shot[] = LIST.map(([from, fx, C], i) => ({from, to: LIST[i + 1]?.[0] ?? TOTAL, fx, C}));
const KWORDS: KW[] = [...KW1, ...KW2];
const WHIP_AT = SHOTS.filter((s) => s.fx === 'w').map((s) => s.from), FLASH_AT = SHOTS.filter((s) => s.fx === 'f').map((s) => s.from), BRIDGE_AT = SHOTS.filter((s) => s.fx === 'b').map((s) => s.from);
const ctxOf = (s: Shot, t: number): Ctx => ({t, l: t - s.from, d: s.to - s.from, p: Math.min(1, Math.max(0, (t - s.from) / (s.to - s.from))), from: s.from});

// ---------------- sound ----------------
// Effects that exist today (public/sfx3, public/sfx). New ones for this story (ring, knock, applause, kite wind...) are in scripts/el-sfx4.mjs -> public/sfx4/ and
// switched on with HAVE_SFX4 once they have been generated.
const HAVE_SFX4 = false;
const kwCue = (w: KW): Cue3 | null => (w.style === 'tag' ? {file: 'stamp_hit', at: w.at, vol: 0.28} : w.style === 'time' ? {file: 'phone_tap', at: w.at, vol: 0.22} : w.style === 'quote' ? {file: 'text_whisper', at: w.at, vol: 0.3} : {file: 'text_title', at: w.at, vol: 0.3});
const CUES: Cue3[] = [
  // cold open: room tone, the clock
  {file: 'room_tone', old: true, at: 0, vol: 0.2, dur: 31, loop: true, fadeOut: 1.2}, {file: 'clock_tick', at: 0.3, vol: 0.3, dur: 5.4, loop: true}, {file: 'tick', old: true, at: 3.3, vol: 0.35},
  // the rewind
  {file: 'tape_rewind', at: 30.9, vol: 0.5}, {file: 'paper_scatter', at: 32.0, vol: 0.4},
  // the choice
  {file: 'lamp_click', at: 56.95, vol: 0.5}, {file: 'lamp_click', at: 82.75, vol: 0.5}, {file: 'receipt_print', at: 87.5, vol: 0.2},
  {file: 'typing_keys', at: 59.0, vol: 0.16, dur: 14, loop: true}, {file: 'amb_office', at: 59, vol: 0.12, dur: 20, loop: true}, {file: 'amb_kitchen', at: 215, vol: 0.14, dur: 6, loop: true},
  // the pile and the toy car
  {file: 'thud', old: true, at: 101.7, vol: 0.4}, {file: 'thud', old: true, at: 107.2, vol: 0.35},
  // door, knocks, phone buzz
  {file: 'thud', old: true, at: 198.5, vol: 0.55}, {file: 'thud', old: true, at: 198.95, vol: 0.55}, {file: 'phone_buzz', at: 211.0, vol: 0.5}, {file: 'thud', old: true, at: 217.9, vol: 0.5},
  {file: 'amb_night_room', at: 192, vol: 0.12, dur: 20, loop: true}, {file: 'amb_night_room', at: 265, vol: 0.12, dur: 24, loop: true},
  // the tea stall
  {file: 'tea_pour', at: 223.6, vol: 0.3}, {file: 'tea_pour', at: 381.2, vol: 0.3}, {file: 'glass_clink', at: 458.6, vol: 0.3},
  // Leo sends money, Adam's phone chimes
  {file: 'phone_tap', at: 295.8, vol: 0.3}, {file: 'phone_notif', at: 297.3, vol: 0.5},
  // M3: a page flip for every Sunday, a heartbeat at the end
  ...SHOTS.filter((s) => s.from >= 386 && s.from < 414).map((s): Cue3 => ({file: 'page_turn', at: s.from, vol: 0.2})),
  {file: 'heartbeat', at: 410.0, vol: 0.5, dur: 4.2, loop: true},
  // the call: digits typed, deleted, the press
  ...[0, 1, 2, 3].map((k): Cue3 => ({file: 'phone_tap', at: 416.6 + k * 0.3, vol: 0.25})), ...[0, 1, 2, 3].map((k): Cue3 => ({file: 'phone_tap', at: 419.6 + k * 0.45, vol: 0.2})),
  {file: 'phone_tap', at: 423.0, vol: 0.4}, {file: 'phone_buzz', at: 423.05, vol: 0.45},
  // "I'll come on Friday, Dad."
  {file: 'impact_bloom', at: 441.7, vol: 0.35}, {file: 'door_open', at: 452.0, vol: 0.3}, {file: 'amb_morning', at: 450, vol: 0.12, dur: 40, loop: true},
  // the photo
  {file: 'lamp_click', at: 466.0, vol: 0.6}, {file: 'shimmer', at: 466.0, vol: 0.3},
  ...SHOTS.filter((s) => s.fx).map((s): Cue3 => (s.fx === 'w' ? {file: 'whip', at: s.from - 0.05, vol: 0.32} : s.fx === 'f' ? {file: 'shimmer', at: s.from - 0.02, vol: 0.3} : {file: 'whoosh_soft', at: s.from - 0.1, vol: 0.3})),
  ...KWORDS.map(kwCue).filter((c): c is Cue3 => !!c),
];
const CUES4: Cue3[] = HAVE_SFX4 ? [] : [];
const MUSIC: {from: number; to: number; track: string; vol: number; startAt?: number}[] = [
  {from: 0, to: 32, track: 'low', vol: 0.1}, {from: 35, to: 110, track: 'hope', vol: 0.14}, {from: 110, to: 192, track: 'routine', vol: 0.12}, {from: 192, to: 215, track: 'low', vol: 0.11},
  {from: 215, to: 265, track: 'routine', vol: 0.11, startAt: 12}, {from: 265, to: 277, track: 'low', vol: 0.08}, {from: 282, to: 312, track: 'hope', vol: 0.12, startAt: 20},
  {from: 312, to: 338, track: 'low', vol: 0.12}, {from: 338, to: 362, track: 'wonder', vol: 0.1}, {from: 362, to: 416, track: 'hope', vol: 0.15}, {from: 416, to: 437, track: 'wonder', vol: 0.12, startAt: 6},
  {from: 440, to: 490, track: 'resolve', vol: 0.2},
];

const TwoFathersMain: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const si = SHOTS.findIndex((s, i) => t >= s.from && (t < s.to || i === SHOTS.length - 1)), shot = SHOTS[Math.max(0, si)], c = ctxOf(shot, t);
  const prev = SHOTS[si - 1], dissolve = prev && shot.from < 32 && !shot.fx && t - shot.from < 0.35 ? ramp(t - shot.from, 0, 0.35) : 1;
  let whip = 0, whipDir = 0;
  for (const b of WHIP_AT) { const w = bell(t - b, 0.14); if (w > whip) { whip = w; whipDir = Math.sign(t - b) || 1; } }
  const fl = (() => { const f = FLASH_AT.find((b) => t >= b - 0.04 && t < b + 0.35); return f === undefined ? 0 : Math.max(0, 1 - (t - f) / 0.35); })();
  const bridge = BRIDGE_AT.reduce((m, b) => Math.max(m, bell(t - b, 0.22)), 0);
  const g = gradeAt(t), paperCard = t >= 32 && t < 35;
  const burst = bell(t - 441.75, 0.4);
  const fadeIn = 1 - ramp(t, 0, 1.4), fadeOut = ramp(t, 488.4, 490);
  const friday = t >= 120 && t < 142, sundays = t >= 386 && t < 416;
  const fridayN = Math.min(12, Math.floor((t - 120) / 1.7) + 1);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `translateX(${whipDir * whip * whip * 90}px) scale(${1 + whip * 0.04})`, filter: `saturate(${paperCard ? 1 : g.sat}) brightness(${paperCard ? 1 : g.br}) contrast(1.03)${whip > 0.02 ? ` blur(${whip * 16}px)` : ''}`}}>
        {dissolve < 1 && prev.C(ctxOf(prev, Math.min(t, prev.to - 0.001)))}
        <AbsoluteFill style={{opacity: dissolve}}>{shot.C(c)}</AbsoluteFill>
      </AbsoluteFill>
      {!paperCard && <AbsoluteFill style={{background: `rgb(${g.c[0]},${g.c[1]},${g.c[2]})`, opacity: g.a, mixBlendMode: 'soft-light'}} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(20,10,4,.5) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${(frame * 37) % 220}px ${(frame * 91) % 220}px`, mixBlendMode: 'overlay', opacity: 0.12, pointerEvents: 'none'}} />
      {!paperCard && <Dust t={t} />}
      {bridge > 0.02 && <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, rgba(255,236,190,.9), rgba(255,236,190,0) 70%)', opacity: bridge * 0.7}} />}
      {fl > 0 && <PhotoFlash o={fl * 0.95} />}
      {burst > 0.01 && <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, rgba(255,244,210,.98) 0%, rgba(255,214,140,.6) 30%, rgba(255,214,140,0) 62%)', opacity: burst}} />}
      <KineticWords t={t} words={KWORDS} />
      {friday && <BigCount label="FRIDAY" n={fridayN} o={ramp(t, 120.1, 120.6) * (1 - ramp(t, 141.2, 141.8))} x={1860} y={60} />}
      {sundays && <BigCount label="SUNDAYS" n={sundayCount(t)} o={ramp(t, 386.2, 386.8) * (1 - ramp(t, 415, 415.8))} x={1860} y={60} />}
      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, fadeOut)}} />

      {PIECES.map((p, i) => (
        <Sequence key={i} from={Math.round(p.at * FPS)} durationInFrames={Math.round(p.dur * FPS)}>
          <Audio src={staticFile(AUDIO_FILE)} startFrom={Math.round(p.a * FPS)} endAt={Math.round(p.b * FPS)} />
        </Sequence>
      ))}
      <Sfx3 cues={[...CUES, ...CUES4]} gain={1} minVol={0.3} duck={speechDuck} />
      {MUSIC.map((m, i) => <Sequence key={'m' + i} from={Math.round(m.from * FPS)} durationInFrames={Math.round((m.to - m.from) * FPS)}><Music track={m.track} startAt={m.startAt ?? 0} frames={Math.round((m.to - m.from) * FPS)} vol={m.vol} fadeIn={60} fadeOut={90} /></Sequence>)}
    </AbsoluteFill>
  );
};
export const TwoFathers: React.FC = () => <TwoFathersMain />;
export {S};
