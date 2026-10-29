// Two Fathers v2: grades by act, rain windows, cues and music in word-time, new main composition
const fs = require('fs');
const rd = (f) => fs.readFileSync(f, 'utf8'), wr = (f, s) => fs.writeFileSync(f, s);

// ---- grades keyed to the narration ----
let th = rd('src/fathers/theme.ts');
const a = th.indexOf('export const GRADES'), b = th.indexOf('export const gradeAt');
th = th.slice(0, a) + `export const GRADES: GradeKey[] = (() => {
  const k = (t: number, c: [number, number, number], a: number, sat: number, br: number): GradeKey => ({t, c, a, sat, br});
  const end = T('thirty years ago') - 0.5, hosp = T('these two men'), father = T('to understand adam'), six = T('and every evening at six'), sam = T('sam worked too'), fifteen = T('at 15'), night = T('one night');
  const city = T('leo grew up successful'), spring = T('then last spring'), back = T('which brings us back'), sunset = T('across the street', 1), call = T('that sunday adam picks up'), friday = T('that friday');
  return [
    k(0, COLD, 0.30, 0.8, 0.97), k(end, COLD, 0.30, 0.8, 0.97), k(hosp, SOFT, 0.18, 0.92, 1.03), k(father - 0.3, SOFT, 0.18, 0.92, 1.03),
    k(father + 0.5, [255, 200, 140], 0.26, 0.85, 0.97), k(six - 0.3, [255, 200, 140], 0.26, 0.85, 0.97),
    k(six + 0.5, AMBER, 0.26, 1.05, 1.0), k(sam - 0.3, AMBER, 0.26, 1.05, 1.0), k(sam + 1.5, DAY, 0.2, 1.08, 1.02), k(fifteen - 1, DAY, 0.2, 1.08, 1.02),
    k(fifteen + 0.5, [210, 140, 110], 0.26, 0.98, 0.94), k(night, [210, 140, 110], 0.26, 0.98, 0.94), k(night + 2, NAVYG, 0.34, 0.9, 0.86), k(city - 1, NAVYG, 0.34, 0.9, 0.86),
    k(city + 0.5, CITY, 0.12, 1.0, 1.02), k(spring + 3, CITY, 0.12, 1.0, 1.02), k(back - 1, COLD, 0.30, 0.8, 0.97), k(sunset - 1, COLD, 0.30, 0.8, 0.97),
    k(sunset + 0.5, GOLDG, 0.30, 1.12, 1.0), k(call - 1, GOLDG, 0.30, 1.12, 1.0), k(call + 0.5, GREY, 0.30, 0.74, 0.95), k(383, GREY, 0.30, 0.74, 0.95),
    k(385, [255, 175, 80], 0.30, 1.12, 1.03), k(friday + 0.5, MORN, 0.18, 1.08, 1.04), k(430, MORN, 0.18, 1.08, 1.04),
  ];
})();
` + th.slice(b);
th = th.replace("import {loadFont as loadUI} from '@remotion/google-fonts/Montserrat';", "import {loadFont as loadUI} from '@remotion/google-fonts/Montserrat';\nimport {T} from './timeline';");
wr('src/fathers/theme.ts', th);

// ---- the main composition ----
let fa = rd('src/fathers/Fathers.tsx');
const i0 = fa.indexOf('import React'), i1 = fa.indexOf('const TwoFathersMain');
const head = `import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Entry, Ctx} from './kit';
import {LIST, KWORDS, REWIND, FRIDAY_N, HITS_AT} from './shots';
import {ramp, bell, GRAIN, AgeTag, Counter, RewindCard, Rain} from './fx';
import {KineticWord, IconTag, Cinema, Shafts, SpeedLines, Bridge, Dust, kwCues, KW as KWS, TextMode} from '../same2d/fx';
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
  'PAID OFF.': 'pop', 'FULL BANK ACCOUNT.': 'pop', 'A SON WHO LOVES HIM.': 'pop', 'IT DOESN\\u2019T RING.': 'slam', '25 YEARS.': 'pop', '3 DAYS APART': 'pop', 'DOUBLE SHIFTS \\u00B7 30 YEARS': 'pop', 'A WATCH IN NEWSPAPER.': 'pop',
  'EXTRA SHIFTS \\u00B7 WEEKENDS': 'pop', 'IT COST HIM.': 'slam', 'PERFECT.': 'pop', 'NEXT TIME.': 'slam', 'THEY COUNT THE SEATS.': 'title', 'IT\\u2019S RARELY THE GIFTS.': 'pop', 'IT\\u2019S THE TIME.': 'slam',
  'SAY SOMETHING.': 'whisper', 'FIGHTS END.': 'pop', 'WALKS CONTINUE.': 'slam', 'THE ONE WHO WAS THERE.': 'title', 'HE ISN\\u2019T IN ANY OF THEM.': 'slam', 'NEVER THE WATCH.': 'slam', 'THE TIME HE NEVER HAD.': 'title',
  '25 YEARS OF FRIDAYS': 'title', 'NOT BECAUSE HE HAS TO.': 'title', 'THEY\\u2019LL REMEMBER WHO SHOWED UP.': 'title', 'IT\\u2019S NEVER TOO LATE.': 'title',
};
const WORDS: KWS[] = KWORDS.filter((w) => w.style === 'big' || w.style === 'quote').map((w) => { const mode: TextMode = w.style === 'quote' ? 'whisper' : MODE[w.text] ?? 'pop'; return {at: w.at, dur: w.dur, text: w.text, accent: w.accent, mode, big: mode === 'slam' || mode === 'title'}; });
const TAGS = KWORDS.filter((w) => w.style === 'tag'), TIMES = KWORDS.filter((w) => w.style === 'time');
const pillsOf = (text: string): ('adam' | 'sam' | 'leo' | 'max')[] => (text === 'AGE 65' ? ['adam', 'sam'] : text === 'AGE 12' ? ['adam'] : text === 'AGE 5' || text === 'AGE 15' ? ['leo'] : ['leo', 'max']);

// ---------------- sound ----------------
const n4 = (file: string, at: number, vol: number, extra: Partial<Cue3> = {}): Cue3 => ({file, at, vol, dir: 'sfx4', ...extra});
const tp = (at: number, vol = 0.25): Cue3 => ({file: 'phone_tap', at, vol});
const CUES: Cue3[] = [
  {file: 'room_tone', old: true, at: 0, vol: 0.14, dur: 20, loop: true, fadeOut: 1.2}, {file: 'clock_tick', at: T('and every sunday at eight'), vol: 0.3, dur: 2.2, loop: true},
  {file: 'tape_rewind', at: REWIND[0] - 0.4, vol: 0.5}, {file: 'paper_scatter', at: REWIND[0], vol: 0.4},
  {file: 'typing_keys', at: T('adam kept working'), vol: 0.16, dur: 5, loop: true}, {file: 'typing_keys', at: T('sam worked too'), vol: 0.16, dur: 2.5, loop: true},
  {file: 'amb_office', at: T('and every evening at six'), vol: 0.12, dur: 14, loop: true}, {file: 'amb_kitchen', at: T('max and his father argued'), vol: 0.14, dur: 5.5, loop: true},
  {file: 'amb_night_room', at: T('at 15'), vol: 0.12, dur: 12, loop: true}, {file: 'amb_night_room', at: T('one night'), vol: 0.12, dur: 24, loop: true}, {file: 'amb_morning', at: T('that friday'), vol: 0.12, dur: 31, loop: true},
  {file: 'receipt_print', at: T('it cost him a promotion') + 0.3, vol: 0.2}, {file: 'thud', old: true, at: T('leo played with it') + 0.5, vol: 0.4}, {file: 'thud', old: true, at: T('for two days') + 0.2, vol: 0.35},
  {file: 'phone_buzz', at: T('a client meeting') + 0.2, vol: 0.45}, {file: 'tea_pour', at: T('they still walked to the tea stall') + 0.3, vol: 0.3}, {file: 'glass_clink', at: T('five cups on the table') + 0.4, vol: 0.3},
  {file: 'phone_notif', at: T("that's what his father taught him") + 0.1, vol: 0.3},
  tp(T('his thumb goes') + 3.5), tp(T('his thumb goes') + 3.8), tp(T('his thumb goes') + 4.1), tp(T('his thumb goes') + 4.4), tp(T('his thumb goes') + 5.0, 0.2), tp(T('his thumb goes') + 5.3, 0.2), tp(T('his thumb goes') + 5.6, 0.2), tp(T('his thumb goes') + 5.9, 0.2), tp(T('his thumb goes') + 6.6, 0.4),
  {file: 'phone_buzz', at: T('his thumb goes') + 6.65, vol: 0.45}, {file: 'impact_bloom', at: HITS_AT[1], vol: 0.35}, {file: 'shimmer', at: T("it's never too late"), vol: 0.3},
  ...SHOTS.filter((s) => s.fx).map((s): Cue3 => (s.fx === 'w' ? {file: 'whip', at: s.from - 0.05, vol: 0.32} : s.fx === 'f' ? {file: 'shimmer', at: s.from - 0.02, vol: 0.3} : {file: 'whoosh_soft', at: s.from - 0.1, vol: 0.3})),
  ...WORDS.flatMap((w) => kwCues(w)),
  ...TAGS.map((w): Cue3 => ({file: 'tag_whoosh', at: w.at, vol: 0.25})), ...TIMES.map((w): Cue3 => ({file: 'tag_whoosh', at: w.at, vol: 0.2})),
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

`;
fa = head + fa.slice(i1);
fa = fa.replace("const friday = t >= 120 && t < 142, sundays = t >= 386 && t < 416;", "");
fa = fa.replace("const REWIND: [number, number] = [18.5, 19.8], FRIDAY_N: [number, number] = [71.6, 75.0];", "");
fa = fa.replace("const HITS = [...FLASH_AT, 114.5, 125.4, 206.9, 215.5];", "const HITS = [...FLASH_AT, ...HITS_AT];");
fa = fa.replace("const burst = bell(t - 206.9, 0.4);", "const burst = bell(t - HITS_AT[1], 0.4);");
fa = fa.replace("const fadeIn = 1 - ramp(t, 0.0, 0.5), fadeOut = ramp(t, 218.6, 219.5);", "const fadeIn = 1 - ramp(t, 0.0, 0.5), fadeOut = ramp(t, TOTAL - 0.9, TOTAL);");
fa = fa.replace(/      <Rain t=\{t\}[^\n]*\n/, "      <Rain t={t} from={T('the way he thought love was supposed to look')} to={T('the way he thought love was supposed to look') + 3} kind=\"money\" /><Rain t={t} from={T('the way his son actually needed')} to={T('the way his son actually needed') + 3.2} kind=\"time\" /><Rain t={t} from={T('more money')} to={T('more money') + 2} kind=\"money\" /><Rain t={t} from={T('one hour belonged')} to={T('one hour belonged') + 3} kind=\"time\" />\n");
wr('src/fathers/Fathers.tsx', fa);
console.log('patched 12', fa.includes('const friday'), fa.includes('Rain t'));
