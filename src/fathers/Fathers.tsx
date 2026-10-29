import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Entry, Ctx} from './kit';
import {LIST1, KW1} from './shots1';
import {LIST2, KW2, sundayCount} from './shots2';
import {KW, ramp, bell, GRAIN, AgeTag, Counter, RewindCard} from './fx';
import {KineticWord, IconTag, Cinema, Shafts, SpeedLines, Bridge, Dust, kwCues, KW as KWS, TextMode} from '../same2d/fx';
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
const HAVE_SFX4 = true;
// key words: the quiet ones whisper (typing), the hard truths slam, titles get the HUD
const MODE: Record<string, TextMode> = {
  'TWO FATHERS': 'title', 'SAME STREET': 'pop', 'SAME SALARY': 'pop', 'SAME LOVE.': 'slam', 'MONEY.': 'slam', 'TIME.': 'slam', 'ONLY ONE RINGS.': 'slam', 'EXTRA SHIFTS \u00B7 WEEKENDS': 'pop', 'NEXT TIME.': 'slam',
  'IT\u2019S RARELY THE GIFTS.': 'pop', 'IT\u2019S THE TIME.': 'slam', 'SAY SOMETHING.': 'whisper', 'FIGHTS END.': 'pop', 'WALKS CONTINUE.': 'slam', 'THE ONE WHO WAS THERE.': 'title',
  'HE ISN\u2019T IN ANY OF THEM.': 'slam', '25 YEARS OF FRIDAYS': 'title', 'NOT TO SEND MONEY.': 'slam', 'THEY\u2019LL REMEMBER WHO SHOWED UP.': 'title',
};
const WORDS: KWS[] = KWORDS.filter((w) => w.style === 'big' || w.style === 'quote').map((w) => { const mode = w.style === 'quote' ? 'whisper' : MODE[w.text] ?? 'pop'; return {at: w.at, dur: w.dur, text: w.text, accent: w.accent, mode, big: mode === 'slam' || mode === 'title'}; });
const TAGS = KWORDS.filter((w) => w.style === 'tag'), TIMES = KWORDS.filter((w) => w.style === 'time');
const pillsOf = (text: string): ('adam' | 'sam' | 'leo' | 'max')[] => (text === 'AGE 65' ? ['adam', 'sam'] : text === 'AGE 5' || text === 'AGE 15' ? ['leo'] : ['leo', 'max']);
const kwCue = (w: KW): Cue3 | null => null;
const WORD_CUES: Cue3[] = WORDS.flatMap((w) => kwCues(w));
const TAG_CUES: Cue3[] = [...TAGS.map((w): Cue3 => ({file: 'tag_whoosh', at: w.at, vol: 0.25})), ...TIMES.map((w): Cue3 => ({file: 'tag_whoosh', at: w.at, vol: 0.2}))];
const CUES: Cue3[] = [
  // cold open: room tone, the clock
  {file: 'room_tone', old: true, at: 0, vol: 0.2, dur: 31, loop: true, fadeOut: 1.2}, {file: 'clock_tick', at: 0.3, vol: 0.3, dur: 5.4, loop: true}, {file: 'tick', old: true, at: 3.3, vol: 0.35},
  // the rewind
  {file: 'tape_rewind', at: 30.9, vol: 0.5}, {file: 'paper_scatter', at: 32.0, vol: 0.4},
  // the choice
  {file: 'receipt_print', at: 87.5, vol: 0.2},
  {file: 'typing_keys', at: 59.0, vol: 0.16, dur: 14, loop: true}, {file: 'amb_office', at: 59, vol: 0.12, dur: 20, loop: true}, {file: 'amb_kitchen', at: 215, vol: 0.14, dur: 6, loop: true},
  // the pile and the toy car
  {file: 'thud', old: true, at: 101.7, vol: 0.4}, {file: 'thud', old: true, at: 107.2, vol: 0.35},
  // door, knocks, phone buzz
  {file: 'phone_buzz', at: 211.0, vol: 0.5},
  {file: 'amb_night_room', at: 192, vol: 0.12, dur: 20, loop: true}, {file: 'amb_night_room', at: 265, vol: 0.12, dur: 24, loop: true},
  // the tea stall
  {file: 'tea_pour', at: 223.6, vol: 0.3}, {file: 'tea_pour', at: 381.2, vol: 0.3}, {file: 'glass_clink', at: 458.6, vol: 0.3},
  // Leo sends money, Adam's phone chimes
  {file: 'phone_tap', at: 295.8, vol: 0.3},
  // M3: a page flip for every Sunday, a heartbeat at the end
  ...SHOTS.filter((s) => s.from >= 386 && s.from < 414).map((s): Cue3 => ({file: 'page_turn', at: s.from, vol: 0.2})),
  {file: 'heartbeat', at: 410.0, vol: 0.5, dur: 4.2, loop: true},
  // the call: digits typed, deleted, the press
  ...[0, 1, 2, 3].map((k): Cue3 => ({file: 'phone_tap', at: 416.6 + k * 0.3, vol: 0.25})), ...[0, 1, 2, 3].map((k): Cue3 => ({file: 'phone_tap', at: 419.6 + k * 0.45, vol: 0.2})),
  {file: 'phone_tap', at: 423.0, vol: 0.4}, {file: 'phone_buzz', at: 423.05, vol: 0.45},
  // "I'll come on Friday, Dad."
  {file: 'impact_bloom', at: 441.7, vol: 0.35}, {file: 'door_open', at: 452.0, vol: 0.3}, {file: 'amb_morning', at: 450, vol: 0.12, dur: 40, loop: true},
  // the photo
  {file: 'shimmer', at: 466.0, vol: 0.3},
  ...SHOTS.filter((s) => s.fx).map((s): Cue3 => (s.fx === 'w' ? {file: 'whip', at: s.from - 0.05, vol: 0.32} : s.fx === 'f' ? {file: 'shimmer', at: s.from - 0.02, vol: 0.3} : {file: 'whoosh_soft', at: s.from - 0.1, vol: 0.3})),
  ...WORD_CUES, ...TAG_CUES,
];
const n4 = (file: string, at: number, vol: number, extra: Partial<Cue3> = {}): Cue3 => ({file, at, vol, dir: 'sfx4', ...extra});
const CUES4: Cue3[] = !HAVE_SFX4 ? [] : [
  n4('phone_ring_far', 26.3, 0.5), n4('hospital_amb', 35, 0.2, {dur: 18, loop: true}), n4('baby_coo', 48.0, 0.35), n4('laptop_lid', 56.95, 0.6), n4('laptop_lid', 82.75, 0.6),
  n4('party_noise', 95, 0.18, {dur: 10, loop: true}), n4('kite_wind', 109, 0.2, {dur: 39, loop: true}), n4('kite_tear', 140.9, 0.5),
  n4('applause_hall', 168.0, 0.45), n4('applause_hall', 172.2, 0.45), n4('door_knock', 198.3, 0.7), n4('door_knock', 204.8, 0.4), n4('chair_slam', 217.8, 0.55),
  n4('footsteps_walk', 220.6, 0.2, {dur: 2.9, loop: true}), n4('crowd_cafe_street', 223.5, 0.16, {dur: 8, loop: true}), n4('footsteps_walk', 362, 0.2, {dur: 5.3, loop: true}), n4('crowd_cafe_street', 367.3, 0.16, {dur: 5, loop: true}),
  n4('transfer_chime', 297.3, 0.55), n4('phone_ring_close', 299.7, 0.5, {dur: 2.7}), n4('phone_ring_far', 302.0, 0.3, {dur: 0.6}),
  ...SHOTS.filter((s) => s.from >= 386 && s.from < 414).map((s, i): Cue3 => n4(i % 2 ? 'transfer_chime' : 'phone_ring_close', s.from, 0.3, {dur: 0.5})),
  n4('footsteps_walk', 454, 0.18, {dur: 4, loop: true}), n4('crowd_cafe_street', 458, 0.16, {dur: 8, loop: true}), n4('shutter_click', 466.0, 0.7),
];
const MUSIC: {from: number; to: number; track: string; vol: number; startAt?: number}[] = [
  {from: 0, to: 32, track: 'tf_cold', vol: 0.14}, {from: 35, to: 109, track: 'tf_guitar', vol: 0.15}, {from: 109, to: 185, track: 'tf_guitar', vol: 0.13, startAt: 0},
  {from: 185, to: 262, track: 'tf_thin', vol: 0.13}, {from: 262, to: 277, track: 'tf_thin', vol: 0.09, startAt: 50}, {from: 282, to: 312, track: 'tf_guitar', vol: 0.12, startAt: 40},
  {from: 312, to: 362, track: 'tf_return', vol: 0.14}, {from: 362, to: 416, track: 'tf_guitar', vol: 0.15, startAt: 0}, {from: 416, to: 437, track: 'tf_build', vol: 0.15},
  {from: 440, to: 490, track: 'tf_end', vol: 0.2},
];

const TwoFathersMain: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const si = SHOTS.findIndex((s, i) => t >= s.from && (t < s.to || i === SHOTS.length - 1)), shot = SHOTS[Math.max(0, si)], c = ctxOf(shot, t);
  const prev = SHOTS[si - 1], dissolve = prev && shot.from < 32 && !shot.fx && t - shot.from < 0.35 ? ramp(t - shot.from, 0, 0.35) : 1;
  let whip = 0, whipDir = 0;
  for (const b of WHIP_AT) { const w = bell(t - b, 0.14); if (w > whip) { whip = w; whipDir = Math.sign(t - b) || 1; } }
  const HITS = [...FLASH_AT, 198.3, 217.8, 441.7, 466.0];
  const shk = 9 * HITS.reduce((m, h) => (t >= h && t < h + 0.45 ? Math.max(m, Math.exp(-(t - h) * 9)) : m), 0);
  const fl = (() => { const f = FLASH_AT.find((b) => t >= b - 0.04 && t < b + 0.4); return f === undefined ? 0 : Math.max(0, 1 - (t - f) / 0.4); })();
  const g = gradeAt(t), paperCard = t >= 32 && t < 35, warm = g.c[0] > 200;
  const burst = bell(t - 441.75, 0.4);
  const fadeIn = 1 - ramp(t, 0.5, 1.4), fadeOut = ramp(t, 488.4, 490);
  const friday = t >= 120 && t < 142, sundays = t >= 386 && t < 416;
  const fridayN = Math.min(12, Math.floor((t - 120) / 1.7) + 1);
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `translate(${whipDir * whip * whip * 90 + Math.sin(t * 83) * shk}px, ${Math.cos(t * 67) * shk}px) scale(${1 + whip * 0.04 + shk * 0.002})`, filter: `contrast(1.06) saturate(${paperCard ? 1 : 1.05 * g.sat})${whip > 0.02 ? ` blur(${whip * 16}px)` : ''}`}}>
        {dissolve < 1 && prev.C(ctxOf(prev, Math.min(t, prev.to - 0.001)))}
        <AbsoluteFill style={{opacity: dissolve}}>{shot.C(c)}</AbsoluteFill>
      </AbsoluteFill>
      {!paperCard && <AbsoluteFill style={{background: `rgb(${g.c[0]},${g.c[1]},${g.c[2]})`, opacity: g.a, mixBlendMode: 'soft-light'}} />}
      {!paperCard && <Shafts t={t} warm={warm} />}
      {!paperCard && <Cinema t={t} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${(frame * 37) % 220}px ${(frame * 91) % 220}px`, mixBlendMode: 'overlay', opacity: 0.12, pointerEvents: 'none'}} />
      {BRIDGE_AT.map((b) => <Bridge key={b} t={t} at={b} />)}
      {fl > 0 && <><AbsoluteFill style={{background: '#fff', opacity: fl * 0.9}} /><SpeedLines o={Math.min(1, fl * 1.6)} /></>}
      {burst > 0.01 && <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, rgba(255,244,210,.98) 0%, rgba(255,214,140,.6) 30%, rgba(255,214,140,0) 62%)', opacity: burst}} />}
      <AbsoluteFill style={{background: '#000', opacity: fadeIn}} />
      {!paperCard && <Dust t={t} dense={!warm} />}
      {paperCard && <RewindCard p={(t - 32) / 3} f={(t - 32) * FPS} />}

      <KineticWord t={t} words={WORDS} />
      {TAGS.map((w) => <AgeTag key={w.at} t={t} from={w.at} to={w.at + w.dur} text={w.text} pills={pillsOf(w.text)} />)}
      {TIMES.map((w) => <IconTag key={w.at} t={t} from={w.at} to={w.at + w.dur} text={w.text} icon={w.text.startsWith('SUNDAY') ? 'sun' : 'clock'} color="#fff" />)}
      {friday && <Counter label="FRIDAY" n={fridayN} o={ramp(t, 120.1, 120.6) * (1 - ramp(t, 141.2, 141.8))} />}
      {sundays && <Counter label="SUNDAYS" n={sundayCount(t)} o={ramp(t, 386.2, 386.8) * (1 - ramp(t, 415, 415.8))} />}
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />

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
