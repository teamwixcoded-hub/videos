import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Entry, Ctx} from './kit';
import {LIST, KWORDS} from './shots';
import {ramp, bell, GRAIN, AgeTag, Counter, RewindCard, Rain} from './fx';
import {KineticWord, IconTag, Cinema, Shafts, SpeedLines, Bridge, Dust, kwCues, KW as KWS, TextMode} from '../same2d/fx';
import {gradeAt} from './theme';
import {PIECES, AUDIO_FILE, TOTAL, FPS, speechDuck} from './timeline';
import {Sfx3, Cue3} from '../same2d/sound';
import {Music} from '../components/Music';

// ============================================================================================
// TWO FATHERS. Same Salary. 20 Years Later.  Exactly as long as the recording (3:36.5) plus 3 s for the closing question. Every shot sits on a phrase of
// the narration (shots.tsx). The look is Same Man's: glass-head cast, digital text, Cinema light, shafts, dust, whips, flashes, bridges, film grain.
// ============================================================================================
export const FATHERS_FRAMES = Math.round(TOTAL * FPS);
type Shot = {from: number; to: number; fx?: 'w' | 'f' | 'b'; C: Entry[2]};
const SHOTS: Shot[] = LIST.map(([from, fx, C], i) => ({from, to: LIST[i + 1]?.[0] ?? TOTAL, fx, C}));
const WHIP_AT = SHOTS.filter((s) => s.fx === 'w').map((s) => s.from), FLASH_AT = SHOTS.filter((s) => s.fx === 'f').map((s) => s.from), BRIDGE_AT = SHOTS.filter((s) => s.fx === 'b').map((s) => s.from);
const ctxOf = (s: Shot, t: number): Ctx => ({t, l: t - s.from, d: s.to - s.from, p: Math.min(1, Math.max(0, (t - s.from) / (s.to - s.from))), from: s.from});
const REWIND: [number, number] = [18.5, 19.8], FRIDAY_N: [number, number] = [71.6, 75.0];

// key words: the quiet ones whisper (typing), the hard truths slam, titles get the HUD
const MODE: Record<string, TextMode> = {
  'TWO FATHERS': 'title', 'SAME STREET': 'pop', 'SAME SALARY': 'pop', 'SAME LOVE.': 'slam', 'MONEY.': 'slam', 'TIME.': 'slam', 'ONLY ONE RINGS.': 'slam', 'EXTRA SHIFTS · WEEKENDS': 'pop', 'NEXT TIME.': 'slam',
  'IT’S RARELY THE GIFTS.': 'pop', 'IT’S THE TIME.': 'slam', 'SAY SOMETHING.': 'whisper', 'FIGHTS END.': 'pop', 'WALKS CONTINUE.': 'slam', 'THE ONE WHO WAS THERE.': 'title',
  'HE ISN’T IN ANY OF THEM.': 'slam', '25 YEARS OF FRIDAYS': 'title', 'NOT TO SEND MONEY.': 'slam', 'THEY’LL REMEMBER WHO SHOWED UP.': 'title',
};
const WORDS: KWS[] = KWORDS.filter((w) => w.style === 'big' || w.style === 'quote').map((w) => { const mode: TextMode = w.style === 'quote' ? 'whisper' : MODE[w.text] ?? 'pop'; return {at: w.at, dur: w.dur, text: w.text, accent: w.accent, mode, big: mode === 'slam' || mode === 'title'}; });
const TAGS = KWORDS.filter((w) => w.style === 'tag'), TIMES = KWORDS.filter((w) => w.style === 'time');
const pillsOf = (text: string): ('adam' | 'sam' | 'leo' | 'max')[] => (text === 'AGE 65' ? ['adam', 'sam'] : text === 'AGE 5' || text === 'AGE 15' ? ['leo'] : ['leo', 'max']);

// ---------------- sound ----------------
const n4 = (file: string, at: number, vol: number, extra: Partial<Cue3> = {}): Cue3 => ({file, at, vol, dir: 'sfx4', ...extra});
const CUES: Cue3[] = [
  // ambience
  {file: 'room_tone', old: true, at: 0, vol: 0.14, dur: 19, loop: true, fadeOut: 1.2}, {file: 'clock_tick', at: 14.4, vol: 0.3, dur: 4.0, loop: true},
  {file: 'tape_rewind', at: 18.0, vol: 0.5}, {file: 'paper_scatter', at: 18.5, vol: 0.4},
  {file: 'typing_keys', at: 32.5, vol: 0.16, dur: 14, loop: true}, {file: 'amb_office', at: 33, vol: 0.12, dur: 13, loop: true}, {file: 'amb_kitchen', at: 122.3, vol: 0.14, dur: 5.5, loop: true},
  {file: 'amb_night_room', at: 107.6, vol: 0.12, dur: 14, loop: true}, {file: 'amb_night_room', at: 133.9, vol: 0.12, dur: 10, loop: true}, {file: 'amb_morning', at: 208.4, vol: 0.12, dur: 11, loop: true},
  // objects and actions
  {file: 'receipt_print', at: 54.9, vol: 0.2}, {file: 'thud', old: true, at: 66.0, vol: 0.4}, {file: 'thud', old: true, at: 69.2, vol: 0.35},
  {file: 'phone_buzz', at: 121.2, vol: 0.45}, {file: 'tea_pour', at: 131.0, vol: 0.3}, {file: 'glass_clink', at: 211.2, vol: 0.3},
  {file: 'phone_tap', at: 154.8, vol: 0.3}, ...[0, 1, 2, 3].map((k): Cue3 => ({file: 'phone_tap', at: 193.1 + k * 0.3, vol: 0.25})), ...[0, 1, 2, 3].map((k): Cue3 => ({file: 'phone_tap', at: 194.3 + k * 0.3, vol: 0.2})), {file: 'phone_tap', at: 196.5, vol: 0.4},
  {file: 'impact_bloom', at: 206.9, vol: 0.35}, {file: 'door_open', at: 209.0, vol: 0.3}, {file: 'shimmer', at: 215.5, vol: 0.3},
  ...SHOTS.filter((s) => s.fx).map((s): Cue3 => (s.fx === 'w' ? {file: 'whip', at: s.from - 0.05, vol: 0.32} : s.fx === 'f' ? {file: 'shimmer', at: s.from - 0.02, vol: 0.3} : {file: 'whoosh_soft', at: s.from - 0.1, vol: 0.3})),
  ...WORDS.flatMap((w) => kwCues(w)),
  ...TAGS.map((w): Cue3 => ({file: 'tag_whoosh', at: w.at, vol: 0.25})), ...TIMES.map((w): Cue3 => ({file: 'tag_whoosh', at: w.at, vol: 0.2})),
];
const CUES4: Cue3[] = [
  n4('phone_ring_close', 16.9, 0.6, {dur: 1.0}), n4('hospital_amb', 19.8, 0.2, {dur: 11.4, loop: true}), n4('baby_coo', 30.4, 0.35), n4('laptop_lid', 50.3, 0.6), n4('laptop_lid', 33.0, 0.4),
  n4('party_noise', 58.9, 0.18, {dur: 10, loop: true}), n4('kite_wind', 69.8, 0.2, {dur: 11, loop: true}), n4('kite_tear', 75.6, 0.5),
  n4('applause_hall', 95.2, 0.45), n4('door_knock', 114.5, 0.7), n4('door_knock', 120.8, 0.4), n4('chair_slam', 125.4, 0.55),
  n4('footsteps_walk', 128.0, 0.2, {dur: 2.8, loop: true}), n4('crowd_cafe_street', 130.8, 0.16, {dur: 3, loop: true}), n4('footsteps_walk', 182.8, 0.2, {dur: 3.1, loop: true}), n4('crowd_cafe_street', 185.9, 0.16, {dur: 7, loop: true}),
  n4('transfer_chime', 156.7, 0.55), n4('phone_ring_far', 158.5, 0.35, {dur: 1.4}), n4('phone_ring_close', 160.0, 0.55, {dur: 1.4}),
  n4('phone_ring_far', 197.0, 0.4, {dur: 0.9}), n4('footsteps_walk', 209.8, 0.18, {dur: 2.5, loop: true}), n4('crowd_cafe_street', 210.6, 0.16, {dur: 5, loop: true}), n4('shutter_click', 215.5, 0.7),
];
const MUSIC: {from: number; to: number; track: string; vol: number; startAt?: number}[] = [
  {from: 0, to: 19, track: 'tf_cold', vol: 0.14}, {from: 19.5, to: 100.5, track: 'tf_guitar', vol: 0.14}, {from: 100.5, to: 133.5, track: 'tf_guitar', vol: 0.1, startAt: 40},
  {from: 107.5, to: 143, track: 'tf_thin', vol: 0.13}, {from: 143.5, to: 165.5, track: 'tf_guitar', vol: 0.12, startAt: 30},
  {from: 165.5, to: 193, track: 'tf_return', vol: 0.14}, {from: 193, to: 204, track: 'tf_build', vol: 0.15}, {from: 205, to: 219.5, track: 'tf_end', vol: 0.2},
];

const TwoFathersMain: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const si = SHOTS.findIndex((s, i) => t >= s.from && (t < s.to || i === SHOTS.length - 1)), shot = SHOTS[Math.max(0, si)], c = ctxOf(shot, t);
  let whip = 0, whipDir = 0;
  for (const b of WHIP_AT) { const w = bell(t - b, 0.14); if (w > whip) { whip = w; whipDir = Math.sign(t - b) || 1; } }
  const HITS = [...FLASH_AT, 114.5, 125.4, 206.9, 215.5];
  const shk = 9 * HITS.reduce((m, h) => (t >= h && t < h + 0.45 ? Math.max(m, Math.exp(-(t - h) * 9)) : m), 0);
  const fl = (() => { const f = FLASH_AT.find((b) => t >= b - 0.04 && t < b + 0.4); return f === undefined ? 0 : Math.max(0, 1 - (t - f) / 0.4); })();
  const g = gradeAt(t), paperCard = t >= REWIND[0] && t < REWIND[1], warm = g.c[0] > 200;
  const burst = bell(t - 206.9, 0.4);
  const fadeIn = 1 - ramp(t, 0.0, 0.5), fadeOut = ramp(t, 218.6, 219.5);
  const friday = t >= FRIDAY_N[0] && t < FRIDAY_N[1] + 0.8;
  const fridayN = Math.min(12, Math.floor((t - FRIDAY_N[0]) / 0.28) + 1);
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `translate(${whipDir * whip * whip * 90 + Math.sin(t * 83) * shk}px, ${Math.cos(t * 67) * shk}px) scale(${1 + whip * 0.04 + shk * 0.002})`, filter: `contrast(1.06) saturate(${paperCard ? 1 : 1.05 * g.sat})${whip > 0.02 ? ` blur(${whip * 16}px)` : ''}`}}>
        {shot.C(c)}
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
      {paperCard && <RewindCard p={(t - REWIND[0]) / (REWIND[1] - REWIND[0])} f={(t - REWIND[0]) * FPS} />}

      <Rain t={t} from={7.9} to={9.8} kind="money" /><Rain t={t} from={12.7} to={14.5} kind="time" /><Rain t={t} from={37.6} to={39.3} kind="money" /><Rain t={t} from={51.5} to={53.4} kind="time" />
      <KineticWord t={t} words={WORDS} />
      {TAGS.map((w) => <AgeTag key={w.at} t={t} from={w.at} to={w.at + w.dur} text={w.text} pills={pillsOf(w.text)} />)}
      {TIMES.map((w) => <IconTag key={w.at} t={t} from={w.at} to={w.at + w.dur} text={w.text} icon={w.text.startsWith('SUNDAY') ? 'sun' : 'clock'} color="#fff" />)}
      {friday && <Counter label="FRIDAY" n={fridayN} o={ramp(t, FRIDAY_N[0], FRIDAY_N[0] + 0.3) * (1 - ramp(t, FRIDAY_N[1], FRIDAY_N[1] + 0.8))} />}
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />

      {PIECES.map((p, i) => (
        <Sequence key={i} from={Math.round(p.at * FPS)} durationInFrames={Math.round(p.dur * FPS)}>
          <Audio src={staticFile(AUDIO_FILE)} startFrom={Math.round(p.a * FPS)} endAt={Math.round(p.b * FPS)} />
        </Sequence>
      ))}
      <Sfx3 cues={[...CUES, ...CUES4]} gain={1} minVol={0.3} duck={speechDuck} />
      {MUSIC.map((m, i) => <Sequence key={'m' + i} from={Math.round(m.from * FPS)} durationInFrames={Math.round((m.to - m.from) * FPS)}><Music track={m.track} startAt={m.startAt ?? 0} frames={Math.round((m.to - m.from) * FPS)} vol={m.vol} fadeIn={45} fadeOut={60} /></Sequence>)}
    </AbsoluteFill>
  );
};
export const TwoFathers: React.FC = () => <TwoFathersMain />;
