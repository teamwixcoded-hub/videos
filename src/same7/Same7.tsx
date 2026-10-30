import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {B, K, WIDE, camS, camR, sFace, rFace, sP, rB, D365, gaunt, DoubleVision, R, Ctx} from '../same2d/Same2D';
import {ClockInsert, CalendarBlur} from '../same2d/inserts';
import {YearFlip} from '../same2d/inserts2';
import {IconTag, SpeedLines, Bridge, Dust, Shafts, Cinema, ramp, bell} from '../same2d/fx';
import {Sfx3, Cue3} from '../same2d/sound';
import {Music} from '../components/Music';
import {GRAIN} from '../fathers/fx';
import {TypeLayer, Stamp, StampT, TW} from '../fathers/type';
import {TypeSearch, TripleIcons, TenRing, MirrorPhone} from './inserts';
import {TableScene, BookGift, BookPageOne, BookOpening} from './book';
import {SideTag} from './tags';
import {FPS, AUDIO_FILE, T, speechDuck} from './timeline';

// ============================================================================================
// SAME MAN v2, built around the new voice-over (docs/same-man-v2-plan.md). Only the first minute (Acts 1 to 3, 0 to 64 s) is built so far; BUILT_END grows as acts are added.
// One man, Daniel: IN BED (the scroller rig) and IN THE CHAIR (the reader rig) share one bedroom. Every shot sits on its words with T('phrase').
// ============================================================================================
export const BUILT_END = 64.2;
export const SAME7_FRAMES = Math.round(BUILT_END * FPS);

type Fx = 'w' | 'f' | 'b';
const rest = (o: Partial<Parameters<typeof sP>[0]> = {}) => sP({mode: 'rest', lids: 0.4, smile: 0, ...o});
const night = (c: Ctx, o: Partial<Parameters<typeof sP>[0]> = {}) => ({s: rest(o), r: null, glowS: 0.3});

const LIST: [number, Fx | undefined, R][] = [
  // ===== ACT 1: THE PROMISE (0 to 32) =====
  [0.0, undefined, B(K.MOON[0], K.MOON[1], () => ({s: rest({lids: 0.45, glow: 0.2}), r: null, glowS: 0.25}), true)],
  [T('same man'), undefined, B(K.CLOCKN[0], K.CLOCKN[1], () => ({s: rest(), r: null, glowS: 0.25}), true)],
  [T('same night'), undefined, B(...camS(1.2, 1.34), (c) => night(c, {gaze: [0, 0.2]}))],
  [T('same room'), undefined, B(...WIDE, (c) => night(c, {lids: 0.4}))],
  [T('in one year'), 'b', (c) => <YearFlip t={c.l} dur={1.5} />],
  [T('one of them'), undefined, B(...rFace(2.0, 2.2), () => ({r: rB({smile: 0.7, lids: 0.08}), s: null, ...D365, books: 20, notes: 14, clutter: 1, glowR: 1.2}))],
  [T('the biggest project'), 'w', B(...camR(1.5, 1.7, 420), () => ({r: rB({smile: 0.5}), s: null, ...D365, books: 20, notes: 14, clutter: 1, glowR: 1.2}))],
  [T('the other will be'), 'w', B(...sFace(2.0, 2.2), () => ({s: gaunt, r: null, ...D365, books: 20, notes: 14, clutter: 1, sat: 0.7}))],
  [T('at 200'), undefined, () => <ClockInsert text="2:00" />],
  [T('typing'), undefined, (c) => <TypeSearch t={c.l} text="how to fix your life" from={0.7} to={1.85} />],
  [T('into his phone'), undefined, B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP(), r: null}), true)],
  [T('same job'), 'w', (c) => <TripleIcons t={c.l} at={[0.05, T('same salary') - T('same job'), T('same 24') - T('same job')]} />],
  [T('the only difference'), undefined, (c) => <TableScene t={c.l} hover={0.15 + ramp(c.l, 0.4, 2.0) * 0.4} />],
  [T('what he does'), undefined, (c) => <TableScene t={c.l + 2} hover={0.55 + ramp(c.l, 0, 1.2) * 0.4} />],
  [T('10 seconds') - 0.1, 'f', (c) => <TenRing t={c.l} from={0.2} to={1.45} />],
  [T('and by the end'), undefined, (c) => <MirrorPhone t={c.l} at={0.5} />],
  [T('exact same choice'), undefined, B(...sFace(2.4, 2.6), (c) => ({s: sP({mode: 'rest', lids: 0.2, glow: 0.6, brow: -0.2, browTilt: -4}), r: null, glowS: 0.6}))],
  [T('every single night'), undefined, B(K.CLOCKN[0], K.CLOCKN[1], () => ({s: sP({mode: 'rest'}), r: null, glowS: 0.3}), true)],
  // ===== ACT 2: MEET DANIEL (33 to 55) =====
  [T('his name is'), 'w', B(...sFace(2.4, 2.7), (c) => night(c, {lids: 0.3, smile: 0.1}))],
  [T("he's 28"), undefined, B(...camS(1.3, 1.45), (c) => night(c, {lids: 0.35}))],
  [T("it's 11"), undefined, () => <ClockInsert text="11:00" />],
  [T('on a tuesday'), undefined, B(...camS(1.3, 1.5), (c) => night(c, {lids: 0.45, slump: ramp(c.l, 0.1, 0.8)}))],
  [T('tired'), undefined, B(...sFace(2.8, 3.0), (c) => night(c, {lids: 0.7, brow: -0.3, browTilt: 8}))],
  [T('long boring'), undefined, (c) => <CalendarBlur t={c.l} d={1.3} />],
  [T('can make you tired'), undefined, B([2650, 300, 2.0], [2650, 296, 2.2], () => ({s: sP({mode: 'rub', lids: 0.7}), r: null, glowS: 0.3}))],
  [T('on the bedside table'), 'w', (c) => <TableScene t={c.l} hover={0} />],
  [T('a friend gave'), undefined, (c) => <BookGift t={c.l} />],
  [T('the bookmark'), undefined, (c) => <BookPageOne t={c.l} />],
  [T('and next to it'), 'w', (c) => <TableScene t={c.l + 1} hover={ramp(c.l, 0.3, 1.8) * 0.5} />],
  [T('he picks up the phone'), undefined, B(...camS(1.5, 1.7, 420), (c) => ({s: sP({raise: ramp(c.l, 0.1, 0.9), lids: 0.25, smile: 0.1, glow: ramp(c.l, 0.3, 1)}), r: null}))],
  [T('of course'), undefined, B(...sFace(2.6, 2.8), () => ({s: sP({mode: 'phone', raise: 1, lids: 0.3, smile: 0.35, brow: 0.2}), r: null, glowS: 1}))],
  [T('anyone would'), undefined, B(...WIDE, () => ({s: sP(), r: null}))],
  // ===== ACT 3: THE SPLIT (55 to 64) =====
  [T("but let's split"), 'w', (c) => <DoubleVision c={c} />],
  [T('in one version'), 'w', B(...camS(1.5, 1.7, 420), (c) => ({s: sP({raise: ramp(c.l, 0.3, 1.2), lids: 0.25, smile: 0.1, glow: ramp(c.l, 0.3, 1)}), r: null}))],
  [T('in the other'), 'w', B(...camR(1.5, 1.7, 420), () => ({r: rB({smile: 0.2, raise: 0.4}), s: null, glowR: 1.1}))],
  [T('just this once'), undefined, B(...rFace(2.0, 2.2), () => ({r: rB({smile: 0.3, lids: 0.15}), s: null, glowR: 1.1}))],
  [T('picks up the book'), undefined, B(...camR(1.5, 1.7, 420), (c) => ({r: rB({raise: ramp(c.l, 0.05, 0.9), flip: ramp(c.l, 0.9, 1.1), smile: 0.2}), s: null, glowR: 1.1}))],
  [63.2, undefined, (c) => <BookOpening t={c.l} at={0.05} />],
];

type Shot = {from: number; to: number; fx?: Fx; C: R};
const SHOTS: Shot[] = LIST.map(([from, fx, C], i) => ({from, to: LIST[i + 1]?.[0] ?? BUILT_END, fx, C}));
for (let i = 1; i < SHOTS.length; i++) if (SHOTS[i].from <= SHOTS[i - 1].from) throw new Error('shots out of order at ' + SHOTS[i].from);
const WHIP_AT = SHOTS.filter((s) => s.fx === 'w').map((s) => s.from), FLASH_AT = SHOTS.filter((s) => s.fx === 'f').map((s) => s.from), BRIDGE_AT = SHOTS.filter((s) => s.fx === 'b').map((s) => s.from);

// ---------------- words on screen ----------------
// TEXT RULES (one voice for the whole film): one short idea per text, at most 2 lines of about 18 characters each, never two texts at the same time in the lower third.
//  - key phrases (pop) sit centred in the lower third; stamps (kicker + label) sit lower-left; day / time tags and the IN BED / IN THE CHAIR pills sit at the top.
//  - titles are not centred over faces any more: everything is lower third, except words that sit on a plain insert.
const pop = (phrase: string, dur: number, text: string, accent?: number, off = 0): TW => ({at: T(phrase) + off, dur, text, accent, mode: 'pop'});
const TYPE_RAW: TW[] = [
  pop('same man', 1.2, 'SAME MAN.', 0), pop('same night', 1.2, 'SAME NIGHT.', 0), pop('same room', 1.3, 'SAME ROOM.', 0),
  pop('in one year', 1.5, 'IN ONE YEAR', 2),
  pop('the other will be', 2.0, 'AWAKE AT 2:00 AM.', 2),
  pop('the only difference', 2.2, 'THE ONLY DIFFERENCE', 3),
  pop('you make this exact', 2.4, 'YOU MAKE THIS CHOICE', 3), pop('every single night', 1.6, 'EVERY NIGHT.', 0),
  pop('anyone would', 1.3, 'ANYONE WOULD.', 0),
  pop('split this night', 2.4, 'ONE NIGHT. TWO WAYS.', 2),
];
const st = (phrase: string, dur: number, kicker: string, label: string, off = 0): StampT => ({at: T(phrase) + off, dur, kicker, label});
const STAMPS_RAW: StampT[] = [
  st('the biggest project', 2.2, 'THE PROMOTION', 'BIGGEST PROJECT'), st('his name is', 2.9, 'HIS NAME IS', 'DANIEL · 28'), st('a friend gave', 2.6, 'A GIFT FROM A FRIEND', '3 MONTHS AGO'),
  st('the bookmark', 2.3, 'THE BOOKMARK', 'STILL ON PAGE ONE'),
];
// the lower third is one lane: pops and stamps are sorted by start time and each one ends before the next begins
const LANE = [...TYPE_RAW.map((w) => ({k: 'p' as const, at: w.at, i: TYPE_RAW.indexOf(w)})), ...STAMPS_RAW.map((s, i) => ({k: 's' as const, at: s.at, i}))].sort((a, b) => a.at - b.at);
const TYPEW: TW[] = TYPE_RAW.map((w) => ({...w})), STAMPS: StampT[] = STAMPS_RAW.map((s) => ({...s}));
LANE.forEach((it, n) => { const nx = LANE[n + 1]; if (!nx) return; const item = it.k === 'p' ? TYPEW[it.i] : STAMPS[it.i]; item.dur = Math.max(0.8, Math.min(item.dur, nx.at - it.at - 0.12)); });

// ---------------- sound: soft, under the voice ----------------
const typing = (from: number, to: number, step: number): Cue3[] => { const out: Cue3[] = []; for (let t = from; t < to; t += step) out.push({file: 'phone_tap', at: t, vol: 0.08}); return out; };
const textCue = (w: TW): Cue3[] => (w.mode === 'slam' ? [{file: 'tag_whoosh', at: w.at - 0.08, vol: 0.1}, {file: 'text_slam', at: w.at, vol: 0.26}] : w.mode === 'title' ? [{file: 'tag_whoosh', at: w.at - 0.12, vol: 0.1}, {file: 'text_title', at: w.at, vol: 0.24}] : w.mode === 'whisper' ? [{file: 'text_whisper', at: w.at, vol: 0.14}] : [{file: 'text_pop', at: w.at, vol: 0.14}]);
const CUES: Cue3[] = [
  {file: 'amb_night_room', at: 0, dur: BUILT_END, loop: true, vol: 0.13, fadeIn: 1.5, fadeOut: 1.2},
  ...WHIP_AT.map((at): Cue3 => ({file: 'whip', at: at - 0.08, vol: 0.12})), ...FLASH_AT.map((at): Cue3 => ({file: 'flash_boom', at, vol: 0.16})), ...BRIDGE_AT.map((at): Cue3 => ({file: 'shimmer', at: at - 0.2, vol: 0.16})),
  {file: 'clock_tick', at: T('same man'), dur: 0.9, vol: 0.14, loop: true}, {file: 'clock_tick', at: T('at 200'), dur: 1.4, vol: 0.14, loop: true}, {file: 'clock_tick', at: T("it's 11"), dur: 0.9, vol: 0.14, loop: true},
  ...typing(T('typing') + 0.7, T('typing') + 1.85, 0.075),
  {file: 'phone_pickup', at: T('he picks up the phone') + 0.1, vol: 0.16}, {file: 'riser', at: T('the only difference'), dur: 3.4, vol: 0.12, fadeOut: 0.05}, {file: 'heartbeat', at: T('and by the end') + 0.3, dur: 5.5, vol: 0.1, loop: true},
  {file: 'title_hit', at: T('10 seconds') + 0.8, vol: 0.2}, {file: 'page_flutter', at: T('the bookmark') + 0.1, vol: 0.12}, {file: 'shimmer', at: T("but let's split"), vol: 0.16}, {file: 'book_open', at: T('picks up the book') + 0.3, vol: 0.14},
  ...TYPEW.flatMap(textCue), ...STAMPS.flatMap((s): Cue3[] => [{file: 'tag_whoosh', at: s.at, vol: 0.12}, {file: 'kw_pop', at: s.at + 0.3, vol: 0.1}]),
  {file: 'tag_whoosh', at: T('in one version'), vol: 0.12}, {file: 'pill_pop', at: T('in one version') + 0.3, vol: 0.12}, {file: 'tag_whoosh', at: T('in the other'), vol: 0.12}, {file: 'pill_pop', at: T('in the other') + 0.3, vol: 0.12},
];

const Same7Main: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const shot = SHOTS.find((s) => t >= s.from && t < s.to) ?? SHOTS[SHOTS.length - 1];
  const c: Ctx = {t, l: t - shot.from, d: shot.to - shot.from, p: Math.min(1, Math.max(0, (t - shot.from) / (shot.to - shot.from))), from: shot.from};
  let whip = 0, whipDir = 0;
  for (const b of WHIP_AT) { const w = bell(t - b, 0.14); if (w > whip) { whip = w; whipDir = Math.sign(t - b) || 1; } }
  const HITS = [...FLASH_AT, T('10 seconds') + 0.8];
  const shk = 9 * HITS.reduce((m, h) => (t >= h && t < h + 0.45 ? Math.max(m, Math.exp(-(t - h) * 9)) : m), 0);
  const flashAt = FLASH_AT.find((b) => t >= b - 0.04 && t < b + 0.4), fl = flashAt === undefined ? 0 : Math.max(0, 1 - (t - flashAt) / 0.4);
  const warm = t >= T('in the other'), grade = warm ? 'rgba(255,165,70,.14)' : 'rgba(70,115,185,.22)';
  const fadeIn = 1 - ramp(t, 0.4, 1.1);
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `translate(${whipDir * whip * whip * 90 + Math.sin(t * 83) * shk}px, ${Math.cos(t * 67) * shk}px) scale(${1 + whip * 0.04 + shk * 0.002})`, filter: `contrast(1.06) saturate(1.08)${whip > 0.02 ? ` blur(${whip * 16}px)` : ''}`}}>
        {shot.C(c)}
      </AbsoluteFill>
      <AbsoluteFill style={{background: grade, mixBlendMode: 'soft-light'}} />
      <Shafts t={t} warm={warm} />
      <Cinema t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${(frame * 37) % 220}px ${(frame * 91) % 220}px`, mixBlendMode: 'overlay', opacity: 0.12, pointerEvents: 'none'}} />
      {BRIDGE_AT.map((b) => <Bridge key={b} t={t} at={b} />)}
      {fl > 0 && <><AbsoluteFill style={{background: '#fff', opacity: fl * 0.9}} /><SpeedLines o={Math.min(1, fl * 1.6)} /></>}
      <AbsoluteFill style={{background: '#000', opacity: fadeIn}} />
      <Dust t={t} dense={!warm} />

      <IconTag t={t} from={T("it's 11")} to={T("it's 11") + 2.6} text="TUESDAY · 11 PM" icon="clock" color="#ffd9a0" />
      <TypeLayer t={t} words={TYPEW} />
      {STAMPS.map((s) => <Stamp key={s.at} t={t} s={s} />)}
      <SideTag t={t} from={T('in one version')} to={T('in one version') + 2.3} who="bed" />
      <SideTag t={t} from={T('in the other')} to={T('in the other') + 3.9} who="chair" />

      <Sequence from={0} durationInFrames={SAME7_FRAMES}><Audio src={staticFile(AUDIO_FILE)} startFrom={0} endAt={SAME7_FRAMES} /></Sequence>
      <Sfx3 cues={CUES} gain={0.8} minVol={0.08} duck={speechDuck} />
      <Sequence from={0} durationInFrames={Math.round(56 * FPS)}><Music track="low" frames={Math.round(56 * FPS)} vol={0.1} fadeIn={60} fadeOut={90} /></Sequence>
      <Sequence from={Math.round(55.5 * FPS)} durationInFrames={Math.round(9 * FPS)}><Music track="wonder" frames={Math.round(9 * FPS)} vol={0.08} fadeIn={45} fadeOut={60} /></Sequence>
    </AbsoluteFill>
  );
};
export const Same7: React.FC = () => <Same7Main />;
