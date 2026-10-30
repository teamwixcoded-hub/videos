import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Entry, Ctx} from './kit';
import {LIST, KWORDS, REWIND, FRIDAY_N, HITS_AT} from './shots';
import {ramp, bell, GRAIN, AgeTag, Counter, RewindCard, Rain} from './fx';
import {IconTag, SpeedLines, Bridge, Dust, KW as KWS, TextMode} from '../same2d/fx';
import {TypeLayer, Stamp, StampT, TW} from './type';
import {gradeAt} from './theme';
import {PIECES, AUDIO_FILE, TOTAL, FPS, speechDuck, T} from './timeline';
import {Sfx3, Cue3} from '../same2d/sound';
import {Music} from '../components/Music';

// ============================================================================================
// TWO FATHERS. Version 2: exactly as long as the new recording (6:56.4) plus 3 s for the closing question. Every shot sits on its words (shots.tsx, T('phrase')).
// The look is Same Man's: glass-head cast, digital text, Cinema light, shafts, dust, whips, flashes, bridges, film grain.
// ============================================================================================
export const FATHERS_FRAMES = Math.round(TOTAL * FPS);
type Shot = {from: number; to: number; fx?: 'w' | 'f' | 'b'; C: Entry[2]};
const SHOTS: Shot[] = LIST.map(([from, fx, C], i) => ({from, to: LIST[i + 1]?.[0] ?? TOTAL, fx, C}));
const WHIP_AT = SHOTS.filter((s) => s.fx === 'w').map((s) => s.from), FLASH_AT = SHOTS.filter((s) => s.fx === 'f').map((s) => s.from), BRIDGE_AT = SHOTS.filter((s) => s.fx === 'b').map((s) => s.from);
const ctxOf = (s: Shot, t: number): Ctx => ({t, l: t - s.from, d: s.to - s.from, p: Math.min(1, Math.max(0, (t - s.from) / (s.to - s.from))), from: s.from});

// key words: the quiet ones whisper (typing), the hard truths slam, titles get the HUD
const MODE: Record<string, TextMode> = {
  'SAME STREET': 'pop', 'SAME SALARY': 'pop', 'SAME LOVE.': 'slam', 'MONEY.': 'slam', 'TIME.': 'slam', 'THE SAME PROMISE.': 'title', 'WHICH ONE ARE YOU?': 'title', 'TWO WAYS.': 'slam',
  'PAID OFF.': 'pop', 'FULL BANK ACCOUNT.': 'pop', 'A SON WHO LOVES HIM.': 'pop', 'IT DOESN\u2019T RING.': 'slam', '25 YEARS.': 'pop', '3 DAYS APART': 'pop', 'DOUBLE SHIFTS \u00B7 30 YEARS': 'pop', 'A WATCH IN NEWSPAPER.': 'pop',
  'EXTRA SHIFTS \u00B7 WEEKENDS': 'pop', 'IT COST HIM.': 'slam', 'PERFECT.': 'pop', 'NEXT TIME.': 'slam', 'THEY COUNT THE SEATS.': 'title', 'IT\u2019S RARELY THE GIFTS.': 'pop', 'IT\u2019S THE TIME.': 'slam',
  'SAY SOMETHING.': 'whisper', 'FIGHTS END.': 'pop', 'WALKS CONTINUE.': 'slam', 'THE ONE WHO WAS THERE.': 'title', 'HE ISN\u2019T IN ANY OF THEM.': 'slam', 'NEVER THE WATCH.': 'slam', 'THE TIME HE NEVER HAD.': 'title',
  '25 YEARS OF FRIDAYS': 'title', 'NOT BECAUSE HE HAS TO.': 'title', 'THEY\u2019LL REMEMBER WHO SHOWED UP.': 'title', 'IT\u2019S NEVER TOO LATE.': 'title',
};
// words an insert already shows (bank, payslip, clock, gifts-to-clocks) are not repeated on top of it
const SHOWN = new Set(['FULL BANK ACCOUNT.', 'SAME SALARY', 'EXTRA SHIFTS · WEEKENDS', '6:00 PM', 'IT’S RARELY THE GIFTS.', 'IT’S THE TIME.']);
const WORDS: (KWS & {mode: TextMode})[] = KWORDS.filter((w) => !SHOWN.has(w.text)).filter((w) => w.style === 'big' || w.style === 'quote').map((w) => { const mode: TextMode = w.style === 'quote' ? 'whisper' : MODE[w.text] ?? 'pop'; return {at: w.at, dur: w.dur, text: w.text, accent: w.accent, mode, big: mode === 'slam' || mode === 'title'}; });
const st = (phrase: string, dur: number, kicker: string, label: string, off = 0, nth = 0): StampT => ({at: T(phrase, nth) + off, dur, kicker, label});
const STAMPS: StampT[] = [
  st('adam and sam stood', 3.4, 'THE HOSPITAL', 'ADAM & SAM · NEW FATHERS'), st('to understand adam', 3.2, 'FLASHBACK', 'ADAM’S FATHER · THE FACTORY'), st('he still wears it', 3.2, 'THE ONLY GIFT', 'A WATCH. STILL ON HIS WRIST.'),
  st('no phone no emails', 3.2, 'EVERY EVENING', 'NO PHONE. NO EMAILS.'), st('his house stayed small', 3.6, 'WHAT IT COST SAM', 'A SMALL HOUSE · AN OLD CAR'), st('a client meeting', 2.8, 'ADAM', 'MISSED THE PARTY'),
  st('max is 30', 3.4, 'MAX · 30 YEARS OLD', 'STILL REMEMBERS THE KITE'), st('he practiced his one line', 3.2, 'LEO · THE SCHOOL PLAY', 'ONE LINE · THREE WEEKS'), st("adam's seat stayed empty", 2.6, 'THE BEST COSTUME', 'AN EMPTY SEAT'),
  st('last month leo missed', 3.4, 'LEO · LAST MONTH', 'A CLIENT MEETING. A TOY CAR.'), st("sam's knees are weaker", 3.2, 'SAM · 65', 'MAX WALKS SLOWER'), st('the biggest toy car', 2.2, 'LEO · AGE 5', 'THE BIGGEST TOY CAR IN THE SHOP'), st('for two days', 1.5, 'THE BIGGEST TOY CAR', 'PLAYED WITH · 2 DAYS'), st('had five cups', 3.6, 'THAT FRIDAY', '5 CUPS · 1 SMALL GLASS OF MILK'),
  st('an old man wearing', 3.4, 'ON THE HILL', 'THE WATCH. THE KITE.'),
];
const QUOTES: TW[] = [
  {at: T("your children won't remember"), dur: 3.2, text: 'Your children won’t remember most of what you bought them.', mode: 'whisper'}, {at: T('so whatever'), dur: 3.8, text: 'So whatever you’re giving them, make sure it’s what you want passed on.', mode: 'whisper'},
];
const TYPEW: TW[] = [...WORDS.map((w): TW => ({at: w.at, dur: Math.max(w.dur, 1.5), text: w.text, accent: w.accent, mode: w.mode === 'whisper' ? 'whisper' : w.mode === 'slam' ? 'slam' : w.mode === 'title' ? 'title' : 'pop'})), ...QUOTES];
const TAGS = KWORDS.filter((w) => w.style === 'tag'), TIMES = KWORDS.filter((w) => w.style === 'time' && !SHOWN.has(w.text));
const pillsOf = (text: string): ('adam' | 'sam' | 'leo' | 'max')[] => (text === 'AGE 65' ? ['adam', 'sam'] : text === 'AGE 12' ? ['adam'] : text === 'AGE 5' || text === 'AGE 15' ? ['leo'] : ['leo', 'max']);

// ---------------- sound ----------------
const n4 = (file: string, at: number, vol: number, extra: Partial<Cue3> = {}): Cue3 => ({file, at, vol, dir: 'sfx4', ...extra});
const tp = (at: number, vol = 0.25): Cue3 => ({file: 'phone_tap', at, vol});
const CUES: Cue3[] = [
  {file: 'room_tone', old: true, at: 0, vol: 0.14, dur: 20, loop: true, fadeOut: 1.2}, {file: 'clock_tick', at: T('and every sunday at eight'), vol: 0.3, dur: 2.2, loop: true},
  {file: 'tape_rewind', at: REWIND[0] - 0.2, vol: 0.12, rate: 0.9, fadeIn: 0.35, fadeOut: 0.6}, {file: 'paper_scatter', at: REWIND[0] + 0.1, vol: 0.1, fadeIn: 0.1, fadeOut: 0.4}, {file: 'text_whisper', at: REWIND[0] + 0.9, vol: 0.12},
  {file: 'typing_keys', at: T('adam kept working'), vol: 0.16, dur: 5, loop: true}, {file: 'typing_keys', at: T('sam worked too'), vol: 0.16, dur: 2.5, loop: true},
  {file: 'amb_office', at: T('and every evening at six'), vol: 0.12, dur: 14, loop: true}, {file: 'amb_kitchen', at: T('max and his father argued'), vol: 0.14, dur: 5.5, loop: true},
  {file: 'amb_night_room', at: T('at 15'), vol: 0.12, dur: 12, loop: true}, {file: 'amb_night_room', at: T('one night'), vol: 0.12, dur: 24, loop: true}, {file: 'amb_morning', at: T('that friday'), vol: 0.12, dur: 31, loop: true},
  {file: 'receipt_print', at: T('it cost him a promotion') + 0.3, vol: 0.2}, {file: 'thud', old: true, at: T('leo played with it') + 0.5, vol: 0.4}, {file: 'thud', old: true, at: T('for two days') + 0.2, vol: 0.35},
  {file: 'phone_buzz', at: T('a client meeting') + 0.2, vol: 0.45}, {file: 'tea_pour', at: T('they still walked to the tea stall') + 0.3, vol: 0.3}, {file: 'glass_clink', at: T('five cups on the table') + 0.4, vol: 0.3},
  {file: 'phone_notif', at: T("that's what his father taught him") + 0.1, vol: 0.3},
  tp(T('his thumb goes') + 3.5), tp(T('his thumb goes') + 3.8), tp(T('his thumb goes') + 4.1), tp(T('his thumb goes') + 4.4), tp(T('his thumb goes') + 5.0, 0.2), tp(T('his thumb goes') + 5.3, 0.2), tp(T('his thumb goes') + 5.6, 0.2), tp(T('his thumb goes') + 5.9, 0.2), tp(T('his thumb goes') + 6.6, 0.4),
  {file: 'phone_buzz', at: T('his thumb goes') + 6.65, vol: 0.45}, {file: 'impact_bloom', at: HITS_AT[1], vol: 0.35}, {file: 'shimmer', at: T("it's never too late"), vol: 0.3},
  ...SHOTS.filter((s) => s.fx).map((s): Cue3 => (s.fx === 'w' ? {file: 'whip', at: s.from - 0.05, vol: 0.32} : s.fx === 'f' ? {file: 'shimmer', at: s.from - 0.02, vol: 0.3} : {file: 'whoosh_soft', at: s.from - 0.1, vol: 0.3})),
  ...TYPEW.flatMap((w): Cue3[] => (w.mode === 'slam' ? [{file: 'tag_whoosh', at: w.at - 0.08, vol: 0.1}, {file: 'text_slam', at: w.at, vol: 0.26}] : w.mode === 'title' ? [{file: 'tag_whoosh', at: w.at - 0.12, vol: 0.1}, {file: 'text_title', at: w.at, vol: 0.24}] : w.mode === 'whisper' ? [{file: 'text_whisper', at: w.at, vol: 0.14}] : [{file: 'text_pop', at: w.at, vol: 0.14}])),
  ...STAMPS.flatMap((s): Cue3[] => [{file: 'tag_whoosh', at: s.at, vol: 0.12}, {file: 'kw_pop', at: s.at + 0.3, vol: 0.1}]),
  ...TYPEW.filter((w) => w.accent !== undefined && w.mode !== 'whisper').map((w): Cue3 => ({file: 'shimmer', at: w.at + 0.55, vol: 0.07})),
  ...Array.from({length: 12}, (_, i): Cue3 => ({file: 'counter_tick', at: FRIDAY_N[0] + i * 0.28 + 0.1, vol: 0.09})),
  {file: 'phone_notif', at: T('next time') + 0.1, vol: 0.14}, {file: 'phone_notif', at: T('next time') + 0.7, vol: 0.12},
  ...TAGS.flatMap((w): Cue3[] => [{file: 'tag_whoosh', at: w.at, vol: 0.14}, {file: 'reward_pop', at: w.at + 0.3, vol: 0.1}]), ...TIMES.flatMap((w): Cue3[] => [{file: 'tag_whoosh', at: w.at, vol: 0.12}, {file: 'counter_tick', at: w.at + 0.25, vol: 0.1}]),
];
const CUES4: Cue3[] = [
  n4('phone_ring_close', T("his neighbor's phone rings"), 0.55, {dur: 1.9}), n4('hospital_amb', T('both boys were born'), 0.2, {dur: 22, loop: true}), n4('baby_coo', T('each holding'), 0.35), n4('laptop_lid', T('he closed the laptop') + 0.15, 0.6),
  n4('party_noise', T('when leo turned five'), 0.18, {dur: 8, loop: true}), n4('kite_wind', T('max got a small paper kite'), 0.2, {dur: 17, loop: true}), n4('kite_tear', T('it tore in august') + 0.3, 0.5),
  n4('applause_hall', T('and clapping too loud') - 0.3, 0.45), n4('applause_hall', T('max pretended to be embarrassed'), 0.4), n4('door_knock', T('adam knocked once') + 0.2, 0.7), n4('chair_slam', T('curfews') + 0.5, 0.55),
  n4('footsteps_walk', T('across the street', 1), 0.2, {dur: 6, loop: true}), n4('footsteps_walk', T('but every friday'), 0.2, {dur: 3.6, loop: true}), n4('footsteps_walk', T('the walks'), 0.2, {dur: 1.2, loop: true}),
  n4('crowd_cafe_street', T('they still go to the same tea stall'), 0.16, {dur: 8, loop: true}), n4('crowd_cafe_street', T('that friday'), 0.16, {dur: 14, loop: true}),
  n4('transfer_chime', T("that's what his father taught him") + 0.1, 0.5), n4('phone_ring_far', T('max grew up busy too') + 0.6, 0.35, {dur: 1.2}), n4('phone_ring_close', T('every sunday at eight', 1), 0.5, {dur: 2.6}),
  n4('phone_ring_far', T('and presses call') + 0.5, 0.4, {dur: 1.0}), n4('shutter_click', T("it's never too late") + 0.2, 0.7), n4('phone_ring_close', T('but he has the one thing') - 0.2, 0.4, {dur: 1.2}),
];
const MUSIC: {from: number; to: number; track: string; vol: number; startAt?: number}[] = [
  {from: 0, to: T('thirty years ago') - 0.5, track: 'tf_cold', vol: 0.14}, {from: T('thirty years ago') + 0.8, to: T('and every evening at six') - 0.5, track: 'tf_guitar', vol: 0.14}, {from: T('and every evening at six') - 0.5, to: T('sam worked too'), track: 'tf_build', vol: 0.13},
  {from: T('sam worked too'), to: T('ask any grown-up'), track: 'tf_guitar', vol: 0.14}, {from: T('ask any grown-up'), to: T('at 15') - 0.3, track: 'tf_return', vol: 0.12},
  {from: T('at 15'), to: T('one night'), track: 'tf_thin', vol: 0.13}, {from: T('one night'), to: T('leo grew up successful') - 0.5, track: 'tf_thin', vol: 0.09, startAt: 40},
  {from: T('leo grew up successful'), to: T('what his father was really trying'), track: 'tf_return', vol: 0.14}, {from: T('what his father was really trying'), to: T('that sunday adam picks up') - 0.3, track: 'tf_build', vol: 0.14},
  {from: T('that friday') - 0.5, to: TOTAL, track: 'tf_end', vol: 0.2},
];

const TwoFathersMain: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const si = SHOTS.findIndex((s, i) => t >= s.from && (t < s.to || i === SHOTS.length - 1)), shot = SHOTS[Math.max(0, si)], c = ctxOf(shot, t);
  let whip = 0, whipDir = 0;
  for (const b of WHIP_AT) { const w = bell(t - b, 0.14); if (w > whip) { whip = w; whipDir = Math.sign(t - b) || 1; } }
  const HITS = [...FLASH_AT, ...HITS_AT];
  const shk = 9 * HITS.reduce((m, h) => (t >= h && t < h + 0.45 ? Math.max(m, Math.exp(-(t - h) * 9)) : m), 0);
  const fl = (() => { const f = FLASH_AT.find((b) => t >= b - 0.04 && t < b + 0.4); return f === undefined ? 0 : Math.max(0, 1 - (t - f) / 0.4); })();
  const g = gradeAt(t), paperCard = t >= REWIND[0] && t < REWIND[1], warm = g.c[0] > 200;
  const burst = bell(t - HITS_AT[1], 0.4);
  const fadeIn = 1 - ramp(t, 0.0, 0.5), fadeOut = ramp(t, TOTAL - 0.9, TOTAL);
  const friday = t >= FRIDAY_N[0] && t < FRIDAY_N[1] + 0.8;
  const fridayN = Math.min(12, Math.floor((t - FRIDAY_N[0]) / 0.28) + 1);
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `translate(${whipDir * whip * whip * 90 + Math.sin(t * 83) * shk}px, ${Math.cos(t * 67) * shk}px) scale(${1 + whip * 0.04 + shk * 0.002})`, filter: `contrast(1.06) saturate(${paperCard ? 1 : 1.05 * g.sat})${whip > 0.02 ? ` blur(${whip * 16}px)` : ''}`}}>
        {shot.C(c)}
      </AbsoluteFill>
      {!paperCard && <AbsoluteFill style={{background: `rgb(${g.c[0]},${g.c[1]},${g.c[2]})`, opacity: g.a, mixBlendMode: 'soft-light'}} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,.34) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${(frame * 37) % 220}px ${(frame * 91) % 220}px`, mixBlendMode: 'overlay', opacity: 0.12, pointerEvents: 'none'}} />
      {BRIDGE_AT.map((b) => <Bridge key={b} t={t} at={b} />)}
      {fl > 0 && <><AbsoluteFill style={{background: '#fff', opacity: fl * 0.9}} /><SpeedLines o={Math.min(1, fl * 1.6)} /><div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 8 + fl * 26, transform: 'translateY(-50%)', background: 'linear-gradient(90deg, transparent, rgba(150,200,255,.95) 30%, #fff 50%, rgba(150,200,255,.95) 70%, transparent)', opacity: Math.min(1, fl * 1.4), filter: 'blur(7px)'}} /></>}
      {burst > 0.01 && <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, rgba(255,244,210,.98) 0%, rgba(255,214,140,.6) 30%, rgba(255,214,140,0) 62%)', opacity: burst}} />}
      <AbsoluteFill style={{background: '#000', opacity: fadeIn}} />
      {!paperCard && <Dust t={t} dense={!warm} />}
      {paperCard && <RewindCard p={(t - REWIND[0]) / (REWIND[1] - REWIND[0])} f={(t - REWIND[0]) * FPS} />}

      <Rain t={t} from={T('the way he thought love was supposed to look')} to={T('the other kept it') - 0.1} kind="money" /><Rain t={t} from={T('the way his son actually needed')} to={T('by the end of this video') - 0.15} kind="time" /><Rain t={t} from={T('more money')} to={T('more money') + 2} kind="money" /><Rain t={t} from={T('one hour belonged')} to={T('one hour belonged') + 3} kind="time" />
      <TypeLayer t={t} words={TYPEW} />{STAMPS.map((s) => <Stamp key={s.at} t={t} s={s} />)}
      {TAGS.map((w) => <AgeTag key={w.at} t={t} from={w.at} to={w.at + w.dur} text={w.text} pills={pillsOf(w.text)} />)}
      {TIMES.map((w) => <IconTag key={w.at} t={t} from={w.at} to={w.at + w.dur} text={w.text} icon={w.text.startsWith('SUNDAY') ? 'sun' : 'clock'} color="#fff" />)}
      {friday && <Counter label="FRIDAY" n={fridayN} o={ramp(t, FRIDAY_N[0], FRIDAY_N[0] + 0.3) * (1 - ramp(t, FRIDAY_N[1], FRIDAY_N[1] + 0.8))} />}
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />

      {PIECES.map((p, i) => (
        <Sequence key={i} from={Math.round(p.at * FPS)} durationInFrames={Math.round(p.dur * FPS)}>
          <Audio src={staticFile(AUDIO_FILE)} startFrom={Math.round(p.a * FPS)} endAt={Math.round(p.b * FPS)} />
        </Sequence>
      ))}
      <Sfx3 cues={[...CUES, ...CUES4].map((c) => (c.file.startsWith('phone_ring') ? {...c, vol: (c.vol ?? 0.5) * 0.4, fadeIn: 0.15, fadeOut: 0.45} : c.file === 'phone_buzz' ? {...c, vol: (c.vol ?? 0.5) * 0.5, fadeIn: 0.05, fadeOut: 0.25} : c))} gain={0.8} minVol={0.08} duck={speechDuck} />
      {MUSIC.map((m, i) => <Sequence key={'m' + i} from={Math.round(m.from * FPS)} durationInFrames={Math.round((m.to - m.from) * FPS)}><Music track={m.track} startAt={m.startAt ?? 0} frames={Math.round((m.to - m.from) * FPS)} vol={m.vol} fadeIn={45} fadeOut={60} /></Sequence>)}
    </AbsoluteFill>
  );
};
export const TwoFathers: React.FC = () => <TwoFathersMain />;
