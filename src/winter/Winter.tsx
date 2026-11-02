import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, Sequence} from 'remotion';
import {Sfx3, Cue3} from '../same2d/sound';
import {Bubble, ramp, Dust} from '../same2d/fx';
import {TypeLayer, TW} from '../fathers/type';
import {GRAIN} from '../fathers/fx';
import {LEVELS} from '../same7/data/levels';
import {FPS, T, TE, VOICE_FILE, END, speakOpen} from './timeline';
import {Room, TwoMen, Pill, DayCard, PromiseCards, MarchCal, Cards, PhoneTrend, Others, Quiet, TrainShot, SleepShot, FoodShot, ReadShot, Counter90, SpringDoor, Frame, RoomArt, Txt} from './scenes';
import {Beats, Beat, RingG, BedSolo, Thermo, SnoozeShot, GetUp, GymBG, GymWalk, LostShot, StrainShot, Timer20, SoreMorning, PhoneAcross, ReadPages, LightsOut} from './scenes2';
import {SideHero, SIDE} from './SideHero';
import {SHOTS4, POPS4, BUBBLES4, CUES4} from './act4';
import {SHOTS5, BUBBLES5, CUES5} from './act5';
import {DIGI} from '../same2d/theme';

// ============================================================================================
// WINTER ARC, built so far: 0 to 398 s ("December 1st" to "...the wrecked body becomes a habit."). Every shot sits on the narration with T('phrase').
// The narrator's words are not lip-synced; the men's own lines are (speakOpen): "This time, I'll change.", "Five more minutes.", "I'm doing this."
// ============================================================================================
export const WINTER_FRAMES = Math.round(END * FPS);
type Cam = [number, number, number];   // zoom origin x, y and the zoom reached at the end of the shot
type Shot = {at: number; cam?: Cam; node: (t: number) => React.ReactNode};

const LBL = (t: number, a: number, b: number) => Math.min(ramp(t, a, a + 0.25), 1 - ramp(t, b - 0.2, b));
const Labels: React.FC<{t: number; a: number; b: number; text: string; c: string; y?: number}> = ({t, a, b, text, c, y = 200}) => {
  const o = LBL(t, a, b);
  return o > 0 ? <g><Pill x={560} y={y} text={text} c={c} o={o} /><Pill x={1360} y={y} text={text} c={c} o={o} /></g> : null;
};
const BellyRing: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = LBL(t, a, b);
  return o > 0 ? <g opacity={o} fill="none" stroke="#ff7ad8" strokeWidth={9} strokeDasharray="22 14">{[560, 1360].map((x) => <ellipse key={x} cx={x} cy={725} rx={170 + Math.sin(t * 6) * 8} ry={92 + Math.sin(t * 6) * 5} />)}</g> : null;
};
const Fade: React.FC<{t: number; a: number; b?: number; children: React.ReactNode}> = ({t, a, b, children}) => <g opacity={Math.min(ramp(t, a, a + 0.3), b ? 1 - ramp(t, b - 0.2, b) : 1)}>{children}</g>;
const SlowRep: React.FC<{t: number}> = ({t}) => (
  <Frame><GymBG t={t} />
    <SideHero x={900} y={1010} scale={0.98} t={t} id="sr" mood="tired" fat={0.5} pose={{...SIDE.curl, handN: [90, -440 + Math.sin(t * 1.5) * 30]}} top="tank" topColor="#e9962c" shorts />
  </Frame>
);

// text cards that sit on the narration (the same arrays also drive their sound cues)
const B_VOTE: Beat[] = [
  {text: 'NOT BECAUSE HE FEELS LIKE IT', at: T('not because'), to: T('because he decided') - 0.1, s: 92, y: 420, strike: TE('feels like it')},
  {text: 'HE DECIDED LAST NIGHT', at: T('because he decided'), c: '#3ddc84', s: 124, y: 520},
  {text: 'THIS MORNING IS NOT A VOTE.', at: T('this morning'), c: '#ffd23f', s: 100, y: 720},
];
const B_DEC: Beat[] = [
  {text: "IT'S DECEMBER.", at: T('its december'), s: 170, y: 420, c: '#cfe2ff'},
  {text: 'NOBODY STARTS ANYTHING IN DECEMBER.', at: T('nobody starts'), s: 80, y: 640},
];
const B_WEEK: Beat[] = [
  {text: 'WEEK 1', at: T('nobody tells you'), s: 280, y: 520},
  {text: 'THE WORST WEEK.', at: T('worst week'), s: 140, y: 760, c: '#ff6a6a'},
];
const B_QUIT: Beat[] = [
  {text: 'MOST PEOPLE QUIT HERE.', at: T('and this is the moment'), s: 112, y: 360, c: '#ffd23f'},
  {text: "NOT BECAUSE IT'S TOO HARD", at: T('not because its too hard'), s: 84, y: 560, strike: TE('too hard')},
  {text: "BECAUSE IT'S UNCOMFORTABLE", at: T('because its uncomfortable'), s: 84, y: 700, c: '#ff9a6a'},
  {text: 'AND NOTHING HAS CHANGED YET.', at: T('nothing has changed'), s: 84, y: 840, c: '#cfe2ff'},
];
const B_PROOF: Beat[] = [
  {text: 'ALL PAIN.', at: T('all pain'), s: 210, y: 440, c: '#ff6a6a'},
  {text: 'NO PROOF.', at: T('no proof'), s: 210, y: 720},
];
const B_EASY: Beat[] = [
  {text: 'THE GYM IS THE EASY PART.', at: T('but the gym'), s: 100, y: 440},
  {text: 'THE HARD PART HAPPENS AT NIGHT.', at: T('the hard part'), s: 84, y: 640, c: '#cfe2ff'},
];
const B_NIGHT: Beat[] = [
  {text: 'ASLEEP BY 10:30', at: T('hes not asleep'), s: 110, y: 280, c: '#cfe2ff'},
  {text: "BECAUSE HE'S DISCIPLINED", at: T('because hes disciplined'), s: 84, y: 460, strike: TE('disciplined') + 0.05},
  {text: 'BECAUSE HIS BODY IS WRECKED', at: T('hes asleep'), s: 84, y: 640, c: '#ff9a6a'},
  {text: 'THE WRECKED BODY BECOMES A HABIT.', at: T('slowly'), s: 76, y: 820, c: '#3ddc84'},
];
const BEAT_SETS = [B_VOTE, B_DEC, B_WEEK, B_QUIT, B_PROOF, B_EASY, B_NIGHT];

const SHOTS1: Shot[] = [
  {at: 0, cam: [700, 500, 1.1], node: (t) => <DayCard t={t} />},
  {at: T('same cold'), cam: [960, 760, 1.3], node: (t) => <Room t={t} zzz />},
  {at: T('same dark'), node: (t) => <Frame><g transform="translate(-1344 -295) scale(2.4)"><RoomArt t={t} /></g></Frame>},
  {at: T('two men'), cam: [960, 760, 1.28], node: (t) => <Room t={t} zzz={t < T('wake')} sam={t > T('wake') ? 'open' : 'closed'} jake={t > T('wake') + 0.15 ? 'open' : 'closed'} ring={t > T('alarm') - 0.1 ? 1 : 0} jolt={t > T('alarm') ? Math.max(0, Math.sin((t - T('alarm')) * 30)) * 0.5 : 0} />},
  {at: T('same age'), cam: [960, 820, 1.16], node: (t) => <TwoMen t={t} sam={{top: 'tee', mood: 'neutral'}} jake={{top: 'tee', mood: 'neutral'}}><Labels t={t} a={T('age')} b={T('same job')} text="AGE 28" c="#3b6fd8" /></TwoMen>},
  {at: T('same job'), cam: [960, 840, 1.14], node: (t) => <TwoMen t={t} sam={{top: 'tee', mood: 'neutral'}} jake={{top: 'tee', mood: 'neutral'}}><Labels t={t} a={T('job')} b={T('same soft')} text="OFFICE JOB" c="#d8803b" /></TwoMen>},
  {at: T('same soft'), cam: [960, 840, 1.16], node: (t) => {
    const hood = t > T('hiding');
    return <TwoMen t={t} sam={{top: hood ? 'hoodie' : 'tee', pose: 'belly', mood: 'tired'}} jake={{top: hood ? 'hoodie' : 'tee', pose: 'belly', mood: 'tired'}}><BellyRing t={t} a={T('soft')} b={T('hiding')} /><Labels t={t} a={T('soft')} b={T('hiding')} text="SOFT BELLY" c="#d84f8a" y={190} /></TwoMen>;
  }},
  {at: T('same promise'), cam: [960, 480, 1.08], node: (t) => <PromiseCards t={t} />},
  {at: T('this time'), cam: [960, 840, 1.12], node: (t) => {
    const o = speakOpen(t, T('this time'), TE('change'));
    return <TwoMen t={t} sam={{top: 'hoodie', mood: 'determined', open: o}} jake={{top: 'hoodie', mood: 'determined', open: o}} />;
  }},
  {at: T('this is sam'), cam: [960, 840, 1.12], node: (t) => (
    <TwoMen t={t} sam={{top: 'hoodie', mood: 'neutral', scale: 1.02 + 0.04 * LBL(t, T('sam'), T('and'))}} jake={{top: 'hoodie', mood: 'neutral', scale: 1.02 + 0.04 * LBL(t, T('jake'), T('90'))}}>
      <Pill x={560} y={170} text="SAM" c="#e9962c" o={ramp(t, T('sam') - 0.1, T('sam') + 0.2)} /><Pill x={1360} y={170} text="JAKE" c="#6b4fc4" o={ramp(t, T('jake') - 0.1, T('jake') + 0.2)} />
    </TwoMen>)},
  {at: T('90 days from'), cam: [960, 520, 1.06], node: (t) => <MarchCal t={t} />},
  {at: T('one of them'), cam: [960, 840, 1.1], node: (t) => {
    const a = ramp(t, T('different') - 0.5, T('man') + 0.6), b = ramp(t, T('maybe'), T('worse') + 0.2), q = LBL(t, T('one of them'), T('look') + 0.1);
    return (
      <TwoMen t={t} dawn={0.35} sam={{top: 'tee', muscle: 0.85 * a, fat: 0.5 - 0.4 * a, mood: a > 0.6 ? 'happy' : 'neutral'}} jake={{top: 'tee', fat: 0.5 + 0.28 * b, mood: b > 0.5 ? 'sad' : t > T('other') ? 'tired' : 'neutral'}}>
        <circle cx={560} cy={540} r={330 * a} fill="#ffd23f" opacity={0.2 * Math.sin(Math.PI * Math.min(1, a))} style={{filter: 'blur(30px)'}} />
        <Pill x={560} y={170} text="SAM" c="#e9962c" /><Pill x={1360} y={170} text="JAKE" c="#6b4fc4" /><Pill x={960} y={100} text="MARCH" c="#3ddc84" o={ramp(t, T('one of them') - 0.1, T('one of them') + 0.25)} />
        {q > 0 && <text x={960} y={620} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={260} fill="#ffd23f" stroke="#1b1a3a" strokeWidth={22} paintOrder="stroke" opacity={q}>?</text>}
      </TwoMen>
    );
  }},
  {at: T('the difference'), cam: [960, 520, 1.05], node: (t) => <Cards t={t} />},
  {at: T('people online'), cam: [960, 540, 1.08], node: (t) => <PhoneTrend t={t} />},
  {at: T('while everyone'), cam: [960, 500, 1.06], node: (t) => <Others t={t} />},
  {at: T('go quiet'), cam: [800, 560, 1.15], node: (t) => <Quiet t={t} />},
  {at: T('you train'), cam: [900, 600, 1.12], node: (t) => <TrainShot t={t} />},
  {at: T('sleep early') - 0.1, cam: [800, 700, 1.12], node: (t) => <SleepShot t={t} />},
  {at: T('fix your'), cam: [960, 560, 1.12], node: (t) => <FoodShot t={t} />},
  {at: T('you read') - 0.1, cam: [760, 650, 1.12], node: (t) => <ReadShot t={t} />},
  {at: T('90', 1) - 0.1, cam: [960, 500, 1.1], node: (t) => <Counter90 t={t} />},
  {at: T('and when'), cam: [1000, 600, 1.1], node: (t) => <SpringDoor t={t} />},
  {at: T('both men'), cam: [960, 760, 1.28], node: (t) => <Room t={t} phones sam="open" jake="open" mood="tired" />},
  {at: T('both of them'), cam: [960, 760, 1.28], node: (t) => {
    const o = speakOpen(t, T('im doing'), TE('im doing this'));
    return <Room t={t} sam="open" jake="open" mood="determined" samOpen={o} jakeOpen={o} />;
  }},
  {at: T('the alarm'), cam: [960, 760, 1.3], node: (t) => <Room t={t} sam="open" jake="open" ring={1} mood="shock" jolt={Math.max(0, Math.sin((t - T('the alarm')) * 26)) * 0.7} />},
  // ---------- the first morning ----------
  {at: T('sam lies'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="sam" eyes="open" mood="tired"><RingG t={t} a={T('sam lies')} b={T('seconds') + 0.2} total={10} unit="SECONDS" x={1560} y={300} r={150} /></BedSolo>},
  {at: T('the room is freezing'), cam: [760, 520, 1.08], node: (t) => <Thermo t={t} from={T('the room is freezing')} warm={false} />},
  {at: T('the bed is warm'), cam: [1100, 540, 1.08], node: (t) => <Thermo t={t} from={T('the bed is warm')} warm />},
  {at: T('every part'), cam: [500, 780, 1.5], node: (t) => <Room t={t} sam="open" jake="closed" zzz mood="tired" samOpen={speakOpen(t, T('five more minutes'), TE('five more minutes'))} />},
  {at: T('he gets up'), cam: [700, 800, 1.12], node: (t) => <GetUp t={t} standAt={T('anyway')} />},
  {at: T('not because he feels'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_VOTE} glow="#3ddc84" />},
  {at: T('jake hits snooze'), cam: [960, 540, 1.1], node: (t) => <SnoozeShot t={t} />},
  {at: T('then he picks up'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="jake" phone eyes="open" mood="tired" />},
  {at: T('its december'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_DEC} glow="#8a6fb8" />},
  {at: T('the smart thing'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="jake" phone eyes="open" mood="neutral"><Fade t={t} a={T('to start fresh')}><Txt x={960} y={250} s={130} c="#3ddc84">START FRESH.</Txt></Fade></BedSolo>},
  {at: T('january 1st'), cam: [700, 500, 1.08], node: (t) => <DayCard t={t - T('january 1st')} month="JANUARY" day="1" clock={false} />},
  {at: T('it sounds like'), cam: [960, 700, 1.08], node: (t) => <BedSolo t={t} who="jake" phone={false} eyes="closed" mood="neutral" z><Fade t={t} a={T('the most comfortable')}><Txt x={960} y={230} s={100} c="#ffd23f">THE MOST COMFORTABLE LIE</Txt></Fade></BedSolo>},
  {at: T('nobody tells you'), cam: [960, 520, 1.08], node: (t) => <Beats t={t} beats={B_WEEK} glow="#ff6a6a" />},
  // ---------- week one ----------
  {at: T('sam walks into'), cam: [900, 700, 1.1], node: (t) => <GymWalk t={t} />},
  {at: T('he doesnt know where'), cam: [960, 760, 1.12], node: (t) => <LostShot t={t} />},
  {at: T('he picks a weight'), cam: [900, 700, 1.15], node: (t) => <StrainShot t={t} />},
  {at: T('he does 20'), cam: [960, 500, 1.06], node: (t) => <Timer20 t={t} />},
  {at: T('the next morning'), cam: [640, 700, 1.12], node: (t) => <SoreMorning t={t} />},
  {at: T('and this is the moment'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_QUIT} glow="#ffd23f" />},
  {at: T('all pain'), cam: [960, 540, 1.08], node: (t) => <Beats t={t} beats={B_PROOF} glow="#ff6a6a" />},
  {at: T('sam goes back'), cam: [900, 700, 1.1], node: (t) => <SlowRep t={t} />},
  {at: T('but the gym'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_EASY} glow="#6fa0ff" />},
  {at: T('1000 pm'), cam: [960, 520, 1.1], node: (t) => <Beats t={t} beats={[{text: '10:00 PM', at: T('1000 pm'), s: 300, y: 580, c: '#ffd23f'}]} glow="#6fa0ff"><circle cx={1560} cy={230} r={120} fill="#e9efff" opacity={0.9} /></Beats>},
  {at: T('the old sam'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="sam" phone eyes="open" mood="tired"><Fade t={t} a={T('until 100')}><Txt x={1560} y={330} s={130} c="#ff4a4a" font={DIGI}>1:00 AM</Txt></Fade></BedSolo>},
  {at: T('this sam puts'), cam: [1000, 700, 1.08], node: (t) => <PhoneAcross t={t} />},
  {at: T('reads') - 0.1, cam: [760, 650, 1.1], node: (t) => <ReadPages t={t} />},
  {at: T('and turns'), cam: [960, 700, 1.1], node: (t) => <LightsOut t={t} />},
  {at: T('hes not asleep'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_NIGHT} glow="#3ddc84" />},
];
const SHOTS: Shot[] = [...SHOTS1, ...SHOTS4, ...SHOTS5];

const POPS1: TW[] = [
  {at: T('same cold'), dur: 1.5, text: 'SAME COLD ROOM.', accent: 1, mode: 'pop'},
  {at: T('same alarm'), dur: 1.3, text: 'SAME ALARM.', accent: 1, mode: 'pop'},
  {at: T('winter arc'), dur: 1.7, text: 'THE WINTER ARC', accent: 1, mode: 'title'},
  {at: T('go quiet'), dur: 1.3, text: 'GO QUIET.', accent: 1, mode: 'pop'},
  {at: T('you train') + 0.05, dur: 0.85, text: 'TRAIN.', accent: 0, mode: 'pop'},
  {at: T('sleep early'), dur: 1.0, text: 'SLEEP EARLY.', accent: 1, mode: 'pop'},
  {at: T('fix your food'), dur: 1.1, text: 'FIX YOUR FOOD.', accent: 2, mode: 'pop'},
  {at: T('you read') + 0.2, dur: 1.0, text: 'READ.', accent: 0, mode: 'pop'},
  {at: T('walk out'), dur: 1.9, text: 'WALK OUT DIFFERENT.', accent: 2, mode: 'pop'},
  {at: T('new year new me'), dur: 1.9, text: 'NEW YEAR. NEW ME.', accent: 2, mode: 'pop'},
  {at: T('sore'), dur: 1.9, text: 'SORE. SLOW.', accent: 1, mode: 'pop'},
];
const POPS: TW[] = [...POPS1, ...POPS4];
const BUBBLES1 = [
  {from: T('this time'), to: TE('change') + 0.5, text: "This time, I'll change.", x: 560, y: 130},
  {from: T('im doing'), to: T('im doing') + 1.7, text: "I'M DOING THIS.", x: 470, y: 520},
  {from: T('im doing') + 0.12, to: T('im doing') + 1.8, text: "I'M DOING THIS.", x: 1130, y: 520},
  {from: T('five more minutes') - 0.1, to: TE('five more minutes') + 0.6, text: 'Five more minutes.', x: 520, y: 430},
];
const BUBBLES = [...BUBBLES1, ...BUBBLES4, ...BUBBLES5];

const CUES: Cue3[] = [
  ...CUES4,
  ...CUES5,
  ...SHOTS.slice(1).map((s): Cue3 => ({file: 'whoosh_soft', at: s.at - 0.03, vol: 0.16})),
  {file: 'clock_tick', at: 0.2, dur: 3, vol: 0.14, loop: true},
  {file: 'alarm_beep', at: T('alarm'), dur: 1.1, vol: 0.2}, {file: 'alarm_beep', at: T('the alarm') + 0.1, dur: 1.5, vol: 0.26},
  ...POPS.map((w): Cue3 => (w.mode === 'title' ? {file: 'text_title', at: w.at, vol: 0.24} : {file: 'text_pop', at: w.at, vol: 0.14})),
  ...[T('age'), T('job'), T('soft'), T('sam'), T('jake')].map((at): Cue3 => ({file: 'pill_pop', at, vol: 0.14})),
  ...[T('90'), T('from'), T('now'), T('march')].map((at): Cue3 => ({file: 'page_turn', at, vol: 0.16})),
  {file: 'shimmer', at: T('different'), vol: 0.18}, {file: 'stamp_hit', at: T('talent') + 0.45, vol: 0.2}, {file: 'stamp_hit', at: T('money') + 0.3, vol: 0.2}, {file: 'title_hit', at: T('today'), vol: 0.22},
  {file: 'phone_notif', at: T('people') + 0.5, vol: 0.18}, {file: 'kw_pop', at: T('hibernates'), vol: 0.16}, {file: 'kw_pop', at: T('eats'), vol: 0.16}, {file: 'kw_pop', at: T('waits'), vol: 0.16},
  {file: 'counter_whir', at: T('90', 1), dur: 0.9, vol: 0.18}, {file: 'door_open', at: T('spring') + 0.2, vol: 0.2}, {file: 'phone_unlock', at: T('both men') + 0.3, vol: 0.14}, {file: 'phone_tap', at: T('both of them') - 0.2, vol: 0.12},
  ...[0, 1, 2, 3, 4].map((i): Cue3 => ({file: 'kw_pop', at: T('every') + i * 0.36, vol: 0.12})),
  // the first morning and week one
  {file: 'counter_whir', at: T('sam lies'), dur: 1.2, vol: 0.14}, {file: 'cloth_shift', at: T('he gets up') + 0.1, vol: 0.18}, {file: 'stamp_hit', at: T('snooze'), vol: 0.22}, {file: 'phone_pickup', at: T('then he picks up') + 0.2, vol: 0.16},
  {file: 'page_turn', at: T('january 1st'), vol: 0.16}, {file: 'door_open', at: T('sam walks into') + 0.2, vol: 0.18}, {file: 'counter_whir', at: T('he does 20'), dur: 1.0, vol: 0.16}, {file: 'book_open', at: T('reads'), vol: 0.14},
  {file: 'lamp_click', at: T('turns off') + 0.2, vol: 0.2}, {file: 'phone_tap', at: T('other side') + 0.1, vol: 0.14}, {file: 'heartbeat', at: T('and this is the moment'), dur: 4, vol: 0.1, loop: true},
  ...BEAT_SETS.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEAT_SETS.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
const mixCue = (c: Cue3): Cue3 => {
  if (c.loop) return {...c, vol: Math.min(1, (c.vol ?? 0.1) * 2.5)};
  const a = LEVELS[c.file]?.act ?? -20, k = Math.min(1.6, Math.max(0.5, (c.vol ?? 0.15) / 0.15));
  return {...c, vol: Math.min(1, 0.8 * k * Math.pow(10, (-20 - a) / 20))};
};

export const Winter: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const i = Math.max(0, SHOTS.reduce((n, s, k) => (t >= s.at ? k : n), 0)), shot = SHOTS[i], to = SHOTS[i + 1]?.at ?? END;
  const p = Math.min(1, Math.max(0, (t - shot.at) / (to - shot.at))), cam = shot.cam ?? [960, 540, 1];
  const zoom = 1 + (cam[2] - 1) * p, cold = t < T('90 days from') || (t > T('both men') - 0.1 && t < T('sam walks into')) || t > T('sam walks into') + 30;
  const fadeIn = 1 - ramp(t, 0, 0.7), fadeOut = ramp(t, END - 0.4, END);
  const musicEnv = (from: number, to2: number) => (f: number) => Math.min(1, 0.22 * Math.min(1, f / 60) * Math.min(1, Math.max(0, ((to2 - from) * FPS - f) / 75)));
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${cam[0]}px ${cam[1]}px`}}>{shot.node(t)}</AbsoluteFill>
      <AbsoluteFill style={{background: cold ? 'rgba(70,115,185,.2)' : 'rgba(255,170,80,.12)', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.5) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${(frame * 37) % 220}px ${(frame * 91) % 220}px`, mixBlendMode: 'overlay', opacity: 0.1, pointerEvents: 'none'}} />
      <Dust t={t} dense={cold} />
      <TypeLayer t={t} words={POPS} />
      {BUBBLES.map((b) => <Bubble key={b.text + b.x} t={t} from={b.from} to={b.to} text={b.text} x={b.x} y={b.y} />)}
      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, fadeOut)}} />
      {VOICE_FILE && <Sequence from={0} durationInFrames={WINTER_FRAMES}><Audio src={staticFile(VOICE_FILE)} /></Sequence>}
      <Sfx3 cues={CUES.map(mixCue)} gain={1} minVol={0} />
      <Sequence from={0} durationInFrames={Math.round(110 * FPS)}><Audio src={staticFile('music/low.mp3')} volume={musicEnv(0, 110)} /></Sequence>
      <Sequence from={Math.round(106 * FPS)} durationInFrames={WINTER_FRAMES - Math.round(106 * FPS)}><Audio src={staticFile('music/routine.mp3')} volume={musicEnv(106, END)} /></Sequence>
    </AbsoluteFill>
  );
};
