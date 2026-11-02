import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, Sequence} from 'remotion';
import {Sfx3, Cue3} from '../same2d/sound';
import {Bubble, ramp, Dust} from '../same2d/fx';
import {TypeLayer, TW} from '../fathers/type';
import {GRAIN} from '../fathers/fx';
import {LEVELS} from '../same7/data/levels';
import {FPS, T, TE, VOICE_FILE, FIRST_END} from './timeline';
import {Room, TwoMen, Pill, DayCard, PromiseCards, MarchCal, Cards, PhoneTrend, Others, Quiet, TrainShot, SleepShot, FoodShot, ReadShot, Counter90, SpringDoor, Frame, RoomArt, SAM} from './scenes';

// ============================================================================================
// WINTER ARC, the first minute and a half (0 to 68 s, "December 1st" to "The alarm rings."). The shots sit on the narration with T('phrase').
// There is no voice-over file yet: set VOICE_FILE in timeline.ts when it is uploaded.
// ============================================================================================
export const WINTER_FRAMES = Math.round(FIRST_END * FPS);
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

const SHOTS: Shot[] = [
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
  {at: T('both of them'), cam: [960, 760, 1.28], node: (t) => <Room t={t} sam="open" jake="open" mood="determined" />},
  {at: T('the alarm'), cam: [960, 760, 1.3], node: (t) => <Room t={t} sam="open" jake="open" ring={1} mood="shock" jolt={Math.max(0, Math.sin((t - T('the alarm')) * 26)) * 0.7} />},
];

const POPS: TW[] = [
  {at: T('same cold'), dur: 1.5, text: 'SAME COLD ROOM.', accent: 1, mode: 'pop'},
  {at: T('same alarm'), dur: 1.3, text: 'SAME ALARM.', accent: 1, mode: 'pop'},
  {at: T('this time'), dur: 2.4, text: "This time, I'll change.", mode: 'whisper'},
  {at: T('winter arc'), dur: 1.7, text: 'THE WINTER ARC', accent: 1, mode: 'title'},
  {at: T('go quiet'), dur: 1.3, text: 'GO QUIET.', accent: 1, mode: 'pop'},
  {at: T('you train') + 0.05, dur: 0.85, text: 'TRAIN.', accent: 0, mode: 'pop'},
  {at: T('sleep early'), dur: 1.0, text: 'SLEEP EARLY.', accent: 1, mode: 'pop'},
  {at: T('fix your food'), dur: 1.1, text: 'FIX YOUR FOOD.', accent: 2, mode: 'pop'},
  {at: T('you read') + 0.2, dur: 1.0, text: 'READ.', accent: 0, mode: 'pop'},
  {at: T('walk out'), dur: 1.9, text: 'WALK OUT DIFFERENT.', accent: 2, mode: 'pop'},
];
const BUBBLES = [
  {from: T('im doing'), to: T('im doing') + 1.7, text: "I'M DOING THIS.", x: 470, y: 520},
  {from: T('im doing') + 0.12, to: T('im doing') + 1.8, text: "I'M DOING THIS.", x: 1130, y: 520},
];

const CUES: Cue3[] = [
  ...SHOTS.slice(1).map((s): Cue3 => ({file: 'whoosh_soft', at: s.at - 0.03, vol: 0.16})),
  {file: 'clock_tick', at: 0.2, dur: 3, vol: 0.14, loop: true},
  {file: 'alarm_beep', at: T('alarm'), dur: 1.1, vol: 0.2}, {file: 'alarm_beep', at: T('the alarm') + 0.1, dur: 1.5, vol: 0.26},
  ...POPS.map((w): Cue3 => (w.mode === 'title' ? {file: 'text_title', at: w.at, vol: 0.24} : w.mode === 'whisper' ? {file: 'text_whisper', at: w.at, vol: 0.14} : {file: 'text_pop', at: w.at, vol: 0.14})),
  ...[T('age'), T('job'), T('soft'), T('sam'), T('jake')].map((at): Cue3 => ({file: 'pill_pop', at, vol: 0.14})),
  ...['december', 'jan', 'feb', 'march'].map((_, i): Cue3 => ({file: 'page_turn', at: [T('90'), T('from'), T('now'), T('march')][i], vol: 0.16})),
  {file: 'shimmer', at: T('different'), vol: 0.18}, {file: 'stamp_hit', at: T('talent') + 0.45, vol: 0.2}, {file: 'stamp_hit', at: T('money') + 0.3, vol: 0.2}, {file: 'title_hit', at: T('today'), vol: 0.22},
  {file: 'phone_notif', at: T('people') + 0.5, vol: 0.18}, {file: 'kw_pop', at: T('hibernates'), vol: 0.16}, {file: 'kw_pop', at: T('eats'), vol: 0.16}, {file: 'kw_pop', at: T('waits'), vol: 0.16},
  {file: 'counter_whir', at: T('90', 1), dur: 0.9, vol: 0.18}, {file: 'door_open', at: T('spring') + 0.2, vol: 0.2}, {file: 'phone_unlock', at: T('both men') + 0.3, vol: 0.14}, {file: 'phone_tap', at: T('both of them') - 0.2, vol: 0.12},
  ...[0, 1, 2, 3, 4].map((i): Cue3 => ({file: 'kw_pop', at: T('every') + i * 0.5, vol: 0.12})),
];
const mixCue = (c: Cue3): Cue3 => {
  if (c.loop) return {...c, vol: Math.min(1, (c.vol ?? 0.1) * 2.5)};
  const a = LEVELS[c.file]?.act ?? -20, k = Math.min(1.6, Math.max(0.5, (c.vol ?? 0.15) / 0.15));
  return {...c, vol: Math.min(1, 0.8 * k * Math.pow(10, (-20 - a) / 20))};
};

export const Winter: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const i = Math.max(0, SHOTS.reduce((n, s, k) => (t >= s.at ? k : n), 0)), shot = SHOTS[i], to = SHOTS[i + 1]?.at ?? FIRST_END;
  const p = Math.min(1, Math.max(0, (t - shot.at) / (to - shot.at))), cam = shot.cam ?? [960, 540, 1];
  const zoom = 1 + (cam[2] - 1) * p, cold = t < T('90 days from') || t > T('both men') - 0.1;
  const fadeIn = 1 - ramp(t, 0, 0.7), fadeOut = ramp(t, FIRST_END - 0.5, FIRST_END);
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${cam[0]}px ${cam[1]}px`}}>{shot.node(t)}</AbsoluteFill>
      <AbsoluteFill style={{background: cold ? 'rgba(70,115,185,.2)' : 'rgba(255,170,80,.12)', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.5) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${(frame * 37) % 220}px ${(frame * 91) % 220}px`, mixBlendMode: 'overlay', opacity: 0.1, pointerEvents: 'none'}} />
      <Dust t={t} dense={cold} />
      <TypeLayer t={t} words={POPS} />
      {BUBBLES.map((b) => <Bubble key={b.x} t={t} from={b.from} to={b.to} text={b.text} x={b.x} y={b.y} />)}
      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, fadeOut)}} />
      {VOICE_FILE && <Sequence from={0} durationInFrames={WINTER_FRAMES}><Audio src={staticFile(VOICE_FILE)} /></Sequence>}
      <Sfx3 cues={CUES.map(mixCue)} gain={1} minVol={0} />
      <Sequence from={0} durationInFrames={WINTER_FRAMES}><Audio src={staticFile('music/low.mp3')} volume={(f) => Math.min(1, 0.22 * Math.min(1, f / 60) * Math.min(1, Math.max(0, (WINTER_FRAMES - f) / 60)))} /></Sequence>
    </AbsoluteFill>
  );
};
