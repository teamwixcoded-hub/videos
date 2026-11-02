import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {DIGI} from '../same2d/theme';
import {T, TE, speakOpen} from './timeline';
import {Txt, Pill} from './scenes';
import {Beats, Beat, BedSolo} from './scenes2';
import {Solo} from './scenes3';
import {StravaChart, MonthGrid, NineG, XsG, PainG, RainG, PizzaKitchen, MirrorShot, WeightBars, Stairs, TenVsHour, BookStack, WeekStrip, MinimumCards, DayBars, CardCharge} from './scenes4';
import type {Shot4} from './act4';

// ============================================================================================
// WINTER ARC, act 5 (272 to 398 s): Quitter's Day, Jake's nine days and quiet restarts, Sam's worst-day plan ("never zero"), week seven and the mirror, progress that shows up elsewhere, the unused membership.
// ============================================================================================
export const BeatsG: React.FC<{t: number; beats: Beat[]}> = ({t, beats}) => (
  <g>{beats.map((b, i) => {
    const a = ramp(t, b.at, b.at + 0.25), o = a * (b.to ? 1 - ramp(t, b.to - 0.2, b.to) : 1), s = b.s ?? 120, y = b.y ?? 540, w = b.text.length * s * 0.6;
    return <g key={i} opacity={o} transform={`translate(960 ${y + (1 - a) * 24})`}><Txt x={0} y={0} s={s} c={b.c ?? '#eef1ff'}>{b.text}</Txt>{b.strike !== undefined && <path d={`M ${-w / 2},${-s * 0.32} L ${w / 2},${-s * 0.32}`} stroke="#ff4a5e" strokeWidth={s * 0.12} strokeLinecap="round" strokeDasharray={w} strokeDashoffset={w * (1 - ramp(t, b.strike, b.strike + 0.25))} />}</g>;
  })}</g>
);

const B_NINE: Beat[] = [
  {text: 'JAKE MAKES IT 9 DAYS.', at: T('jake makes it'), s: 120, y: 240, c: '#ffd23f'},
  {text: "NOT BECAUSE HE'S WEAK.", at: T('not because hes weak'), s: 76, y: 420, strike: TE('hes weak') + 0.1},
  {text: 'BECAUSE HE CHANGED EVERYTHING AT ONCE.', at: T('because he tried to change'), s: 64, y: 560, c: '#ff9a6a'},
];
const B_NOGO: Beat[] = [
  {text: "HE DOESN'T DECIDE TO QUIT.", at: T('he doesnt decide'), s: 96, y: 430},
  {text: "HE JUST DOESN'T GO.", at: T('he just doesnt go'), s: 130, y: 660, c: '#ff6a6a'},
];
const B_NEXT: Beat[] = [{text: 'AND THEN THE NEXT DAY EITHER.', at: T('and then he doesnt go'), s: 96, y: 520}];
const B_QUIETER: Beat[] = [
  {text: "I'LL RESTART.", at: T('each restart'), s: 130, y: 420, c: '#cfe2ff'},
  {text: "i'll restart.", at: T('a little quieter'), s: 84, y: 570, c: '#8c96c8'},
  {text: "i'll restart.", at: T('until he stops'), s: 52, y: 670, c: '#5c6490'},
  {text: '. . .', at: T('saying it at all'), s: 60, y: 760, c: '#3c4268'},
];
const B_BAD: Beat[] = [
  {text: 'SAM HAS BAD DAYS TOO.', at: T('sam has bad'), s: 100, y: 220},
  {text: '4 HOURS OF SLEEP', at: T('four hours'), s: 100, y: 400, c: '#cfe2ff'},
  {text: 'A WEEK SO HEAVY: ONLY 2 WORKOUTS', at: T('a week so heavy'), s: 66, y: 540, c: '#ff9a6a'},
];
const B_PLAN: Beat[] = [
  {text: 'NO PLAN HE COULDN\'T KEEP', at: T('a plan he couldnt keep'), s: 96, y: 440},
  {text: 'ON HIS WORST DAY.', at: T('on his worst day'), s: 130, y: 640, c: '#ff6a6a'},
];
const B_DESIGN: Beat[] = [
  {text: 'NOT MOTIVATION.', at: T('not motivation'), s: 140, y: 400, c: '#8c96c8', strike: TE('not motivation') + 0.15},
  {text: 'DESIGN.', at: T('design'), s: 260, y: 730, c: '#3ddc84'},
];
const B_W7: Beat[] = [
  {text: 'WEEK 7', at: T('week seven'), s: 220, y: 320},
  {text: 'THE MOST DANGEROUS WEEK', at: T('most dangerous'), s: 84, y: 520, c: '#ff6a6a'},
  {text: "NOT BECAUSE IT'S HARD.", at: T('not because its hard'), s: 76, y: 680, strike: TE('its hard')},
  {text: 'BECAUSE IT FEELS POINTLESS.', at: T('because it feels pointless'), s: 86, y: 830, c: '#ffd23f'},
];
const B_MIRROR: Beat[] = [{text: "WHAT THE MIRROR CAN'T SHOW HIM", at: T('but heres what'), s: 84, y: 540, c: '#cfe2ff'}];
const B_PROG: Beat[] = [
  {text: 'PROGRESS ALMOST NEVER SHOWS UP', at: T('progress almost never'), s: 80, y: 380},
  {text: "WHERE YOU'RE LOOKING.", at: T('where youre looking'), s: 100, y: 540, c: '#ff9a6a'},
  {text: 'IT SHOWS UP EVERYWHERE ELSE FIRST.', at: T('it shows up everywhere'), s: 80, y: 780, c: '#3ddc84'},
];
const B_GUILT: Beat[] = [
  {text: 'EVERY GYM VIDEO: HE FEELS IT.', at: T('except now'), s: 66, y: 190, c: '#cfe2ff'},
  {text: 'NOT MOTIVATION.', at: T('not motivation', 1), s: 90, y: 300, c: '#8c96c8', strike: TE('not motivation', 1) + 0.1},
  {text: 'GUILT.', at: T('guilt'), s: 190, y: 480, c: '#ff6a6a'},
];
const BEATS5 = [B_NINE, B_NOGO, B_NEXT, B_QUIETER, B_BAD, B_PLAN, B_DESIGN, B_W7, B_MIRROR, B_PROG, B_GUILT];

const DayPill: React.FC<{text: string; c?: string}> = ({text, c = '#d84f8a'}) => <Pill x={960} y={150} text={text} c={c} />;

export const SHOTS5: Shot4[] = [
  {at: T('the fitness app'), cam: [960, 540, 1.05], node: (t) => <StravaChart t={t} />},
  {at: T('it lands'), cam: [960, 540, 1.06], node: (t) => <MonthGrid t={t} />},
  {at: T('jake makes it'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_NINE} glow="#3ddc84"><NineG t={t} a={T('jake makes it') + 0.3} /></Beats>},
  {at: T('day four'), cam: [960, 760, 1.12], node: (t) => <Solo t={t} who="jake" mood="sad" pose={{arm: [4, 330], hand: 'relaxed'}}><DayPill text="DAY 4" /><PainG t={t} pts={[[800, 820], [1130, 820]]} /></Solo>},
  {at: T('day six'), cam: [900, 760, 1.1], node: (t) => <PizzaKitchen t={t} />},
  {at: T('day eight'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="jake" eyes="closed" mood="tired" z dawn={0.7}><DayPill text="DAY 8" /><Txt x={1560} y={300} s={120} c="#ffd23f" font={DIGI}>9:47 AM</Txt></BedSolo>},
  {at: T('day nine'), cam: [960, 760, 1.1], node: (t) => <Solo t={t} who="jake" mood="tired" dawn={0.3}><RainG t={t} /><DayPill text="DAY 9" c="#3b6fd8" /></Solo>},
  {at: T('he doesnt decide'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_NOGO} glow="#ff6a6a" />},
  {at: T('and then he doesnt go'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_NEXT} glow="#ff6a6a"><XsG t={t} a={T('next day')} /></Beats>},
  {at: T('ill restart on monday'), cam: [960, 760, 1.18], node: (t) => <Solo t={t} who="jake" mood="tired" dawn={0.4} open={Math.max(speakOpen(t, T('ill restart on monday'), TE('monday')), speakOpen(t, T('ill restart next month'), TE('next month')))} />},
  {at: T('each restart'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_QUIETER} glow="#5c6490" />},
  {at: T('sam has bad'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_BAD} glow="#6fa0ff"><WeekStrip t={t} a={T('only trains twice')} y={800} /></Beats>},
  {at: T('but sam never'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_PLAN} glow="#3ddc84" />},
  {at: T('20 minutes', 2), cam: [960, 520, 1.06], node: (t) => <MinimumCards t={t} />},
  {at: T('on a good day'), cam: [960, 560, 1.06], node: (t) => <DayBars t={t} />},
  {at: T('thats the difference'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_DESIGN} glow="#3ddc84" />},
  {at: T('week seven'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_W7} glow="#ff6a6a" />},
  {at: T('sam stands in front'), cam: [900, 700, 1.1], node: (t) => <MirrorShot t={t} count />},
  {at: T('this is where the doubt'), cam: [700, 700, 1.18], node: (t) => <MirrorShot t={t} mood="sad" open={speakOpen(t, T('is this even working'), TE('is this even working'))} />},
  {at: T('but heres what'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_MIRROR} glow="#6fa0ff" />},
  {at: T('the weight on the bar'), cam: [960, 560, 1.06], node: (t) => <WeightBars t={t} />},
  {at: T('the stairs at work'), cam: [900, 600, 1.08], node: (t) => <Stairs t={t} />},
  {at: T('he falls asleep'), cam: [960, 540, 1.05], node: (t) => <TenVsHour t={t} />},
  {at: T('he wakes up before'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="sam" eyes="open" mood="happy" dawn={0.45}><Txt x={1560} y={300} s={120} c="#ff4a4a" font={DIGI}>5:58 AM</Txt><Txt x={1560} y={400} s={50} c="#cfe2ff">ALARM: 6:00</Txt></BedSolo>},
  {at: T('hes read four'), cam: [960, 700, 1.08], node: (t) => <BookStack t={t} />},
  {at: T('progress almost never'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_PROG} glow="#3ddc84" />},
  {at: T('so sam stops'), cam: [900, 700, 1.1], node: (t) => <MirrorShot t={t} leave={ramp(t, T('he just shows up') - 0.3, T('he just shows up') + 1.6)} mood="determined" />},
  {at: T('jake in week seven'), cam: [960, 700, 1.1], node: (t) => (
    <BedSolo t={t} who="jake" phone eyes="open" mood="tired">
      <Pill x={560} y={170} text="SAME BED" c="#6b4fc4" o={ramp(t, T('same bed'), T('same bed') + 0.25)} /><Pill x={960} y={170} text="SAME PHONE" c="#3b6fd8" o={ramp(t, T('same phone'), T('same phone') + 0.25)} /><Pill x={1360} y={170} text="SAME HOODIE" c="#d84f8a" o={ramp(t, T('same hoodie'), T('same hoodie') + 0.25)} />
    </BedSolo>)},
  {at: T('except now'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="jake" phone eyes="open" mood="sad"><BeatsG t={t} beats={B_GUILT} /></BedSolo>},
  {at: T('the membership charges'), cam: [960, 540, 1.05], node: (t) => <CardCharge t={t} />},
];

export const POPS5 = [] as never[];
export const BUBBLES5 = [
  {from: T('ill restart on monday'), to: TE('monday') + 0.4, text: "I'll restart on Monday.", x: 1080, y: 250},
  {from: T('ill restart next month'), to: TE('next month') + 0.5, text: "I'll restart next month.", x: 1080, y: 250},
  {from: T('is this even working'), to: TE('is this even working') + 0.6, text: 'Is this even working?', x: 360, y: 250},
];
export const CUES5: Cue3[] = [
  ...[T('jake makes it') + 0.3].flatMap((a): Cue3[] => Array.from({length: 9}, (_, i) => ({file: 'counter_tick', at: a + i * 0.12, vol: 0.1}))),
  {file: 'stamp_hit', at: T('quitters day'), vol: 0.22}, {file: 'kw_pop', at: T('second week'), vol: 0.16},
  ...[T('day four'), T('day six'), T('day eight'), T('day nine')].map((at): Cue3 => ({file: 'pill_pop', at, vol: 0.14})),
  {file: 'amb_rain', at: T('day nine'), dur: 1.8, vol: 0.12}, {file: 'heartbeat', at: T('he doesnt decide'), dur: 3, vol: 0.08, loop: true},
  {file: 'counter_whir', at: T('45 mornings') - 0.2, dur: 1.2, vol: 0.14}, {file: 'shimmer', at: T('progress almost never'), vol: 0.14},
  ...[0, 1, 2, 3, 4, 5, 6].map((i): Cue3 => ({file: 'counter_tick', at: T('the weight on the bar') + 0.3 + i * 0.4, vol: 0.1})),
  {file: 'phone_notif', at: T('charges'), vol: 0.2}, {file: 'pill_pop', at: T('same bed'), vol: 0.14}, {file: 'pill_pop', at: T('same phone'), vol: 0.14}, {file: 'pill_pop', at: T('same hoodie'), vol: 0.14},
  ...[0, 1, 2, 3].map((i): Cue3 => ({file: 'page_turn', at: T('read four') + i * 0.35, vol: 0.12})),
  ...BEATS5.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS5.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
