import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {DIGI} from '../same2d/theme';
import {T, TE, speakOpen} from './timeline';
import {Frame, Txt, DayCard} from './scenes';
import {Beats, Beat, BedSolo, GymBG, RingG} from './scenes2';
import {SideHero, SIDE} from './SideHero';
import {CouchJake, JakeStuff, EventCards, PlateNight, LeavesParty, Delivery, Growing, FireG, GymBoth, GymCurl, GymCrowd, Solo, PartyBG} from './scenes3';

// ============================================================================================
// WINTER ARC, act 4 (165 to 272 s): Jake's great week, week three and the party, "fewer zero days", midnight, January 2nd in the same gym.
// ============================================================================================
export type Shot4 = {at: number; cam?: [number, number, number]; node: (t: number) => React.ReactNode};

const B_FEEL: Beat[] = [
  {text: 'FEELING LIKE IT', at: T('feeling like it'), c: '#ffd23f', s: 140, y: 400},
  {text: 'IS ENOUGH TO STOP YOU', at: T('is enough to stop'), s: 100, y: 600},
  {text: 'FROM ACTUALLY DOING IT.', at: T('from actually'), c: '#ff6a6a', s: 100, y: 780},
];
const B_W3: Beat[] = [
  {text: 'WEEK 3', at: T('week three'), s: 280, y: 470},
  {text: 'WINTER FIGHTS BACK.', at: T('winter fights'), s: 120, y: 730, c: '#6fd0ff'},
];
const B_SECRET: Beat[] = [
  {text: 'THE WHOLE SECRET', at: T('thats the whole secret'), s: 130, y: 360, c: '#ffd23f'},
  {text: "YOU DON'T NEED PERFECT DAYS.", at: T('you dont need perfect'), s: 84, y: 580, strike: TE('perfect days')},
  {text: 'YOU NEED FEWER ZERO DAYS.', at: T('you need fewer'), s: 100, y: 780, c: '#3ddc84'},
];
const B_NY: Beat[] = [
  {text: 'MIDNIGHT.', at: T('midnight'), s: 130, y: 840, c: '#ffd23f'},
  {text: 'A NEW PERSON FOR ABOUT 6 HOURS.', at: T('everyones a new person'), s: 66, y: 980},
];
const B_BIG1: Beat[] = [
  {text: 'JAKE GOES BIG.', at: T('jake goes big'), s: 150, y: 250, c: '#ffd23f'},
  {text: 'ANNUAL GYM MEMBERSHIP, PAID IN FULL.', at: T('annual gym'), s: 64, y: 480},
  {text: 'NO SUGAR. NO BREAD. NO RICE.', at: T('no sugar'), s: 90, y: 690, c: '#ff9a6a'},
];
const B_BIG2: Beat[] = [
  {text: 'WAKE UP AT 5:00.', at: T('wake up at 500'), s: 120, y: 240},
  {text: 'COLD SHOWERS.', at: T('cold showers'), s: 100, y: 410, c: '#6fd0ff'},
  {text: 'A JOURNAL.', at: T('a journal'), s: 100, y: 560, c: '#ffd23f'},
  {text: 'A NEW APP TO TRACK EVERYTHING.', at: T('a new app'), s: 76, y: 720},
  {text: 'ALL OF DECEMBER IN ONE WEEK.', at: T('make up for all'), s: 88, y: 900, c: '#ff6a6a'},
];
const BEATS4 = [B_FEEL, B_W3, B_SECRET, B_NY, B_BIG1, B_BIG2];

const Snow: React.FC<{t: number}> = ({t}) => <g fill="#cfdcff">{Array.from({length: 60}, (_, i) => <circle key={i} cx={(i * 131 + Math.sin(t * 2 + i) * 30) % 1920} cy={((i * 97 + t * (160 + (i % 5) * 50)) % 1180) - 50} r={3 + (i % 4)} opacity={0.5 + (i % 3) * 0.15} />)}</g>;
const TiredRep: React.FC<{t: number}> = ({t}) => (
  <Frame><GymBG t={t} />
    <SideHero x={900} y={1010} scale={0.98} t={t} id="tr4" mood="tired" fat={0.45} pose={{...SIDE.curl, handN: [90, -440 + Math.sin(t * 1.7) * 28]}} top="tank" topColor="#e9962c" shorts />
    <g opacity={ramp(t, T('a shorter'), T('a shorter') + 0.3)}><RingG t={t} a={T('a shorter')} b={T('a shorter') + 1.2} total={12} unit="MINUTES" x={1560} y={420} r={130} /></g>
  </Frame>
);

export const SHOTS4: Shot4[] = [
  {at: T('jake meanwhile'), cam: [880, 650, 1.12], node: (t) => <CouchJake t={t} />},
  {at: T('he watched three'), cam: [960, 540, 1.08], node: (t) => <JakeStuff t={t} kind="videos" at={T('he watched three')} />},
  {at: T('he bought a new'), cam: [960, 540, 1.1], node: (t) => <JakeStuff t={t} kind="bottle" at={T('he bought a new')} />},
  {at: T('he made a playlist'), cam: [960, 540, 1.08], node: (t) => <JakeStuff t={t} kind="playlist" at={T('he made a playlist')} />},
  {at: T('he feels like a man'), cam: [960, 760, 1.12], node: (t) => <Solo t={t} who="jake" mood="happy" pose="hips" dawn={0.25} />},
  {at: T('and feeling like it'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_FEEL} glow="#ff7ad8" />},
  {at: T('week three'), cam: [960, 540, 1.06], node: (t) => <Beats t={t} beats={B_W3} glow="#6fd0ff"><Snow t={t} /></Beats>},
  {at: T('the office party'), cam: [960, 520, 1.06], node: (t) => <EventCards t={t} />},
  {at: T('come on'), cam: [960, 900, 1.06], node: (t) => <Solo t={t} who="friend" bg="party" mood="happy" pose="hips" scale={0.98} open={speakOpen(t, T('come on'), TE('its december', 1))} />},
  {at: T('every plate'), cam: [960, 540, 1.06], node: (t) => <PlateNight t={t} />},
  {at: T('sam goes to the party'), cam: [960, 760, 1.12], node: (t) => <Solo t={t} who="sam" bg="party" mood="happy" pose={t > T('he eats') ? 'hips' : 'idle'} open={t > T('he eats') ? Math.max(0, Math.sin(t * 14)) * 0.5 : 0} />},
  {at: T('but he leaves'), cam: [960, 760, 1.08], node: (t) => <LeavesParty t={t} />},
  {at: T('the next morning', 1), cam: [900, 700, 1.1], node: (t) => <TiredRep t={t} />},
  {at: T('thats the whole secret'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_SECRET} glow="#3ddc84" />},
  {at: T('jake stays'), cam: [960, 760, 1.12], node: (t) => (
    <Solo t={t} who="jake" bg="party" mood="happy" pose="belly" open={Math.max(0, Math.sin(t * 12)) * 0.45}>
      <g transform="translate(300 220)"><rect x={-230} y={-80} width={460} height={160} rx={20} fill="#12080c" stroke="#1b1a3a" strokeWidth={9} /><text x={0} y={36} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={100} fill="#ff4a4a" style={{filter: 'drop-shadow(0 0 8px #ff2a2a)'}}>2:00 AM</text></g>
    </Solo>)},
  {at: T('wakes up at'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="jake" eyes="closed" mood="tired" z><Txt x={1560} y={300} s={130} c="#ffd23f" font={DIGI}>11:00 AM</Txt></BedSolo>},
  {at: T('orders breakfast'), cam: [960, 760, 1.1], node: (t) => <Delivery t={t} />},
  {at: T('its fine'), cam: [960, 760, 1.2], node: (t) => <Solo t={t} who="jake" mood="tired" dawn={0.5} open={Math.max(speakOpen(t, T('its fine'), TE('its fine')), speakOpen(t, T('january is when'), TE('counts')))} />},
  {at: T('every day he waits'), cam: [960, 560, 1.06], node: (t) => <Growing t={t} />},
  {at: T('midnight'), cam: [960, 520, 1.06], node: (t) => <Beats t={t} beats={B_NY} glow="#ff7ad8"><FireG t={t} /></Beats>},
  {at: T('jake goes big'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_BIG1} glow="#ffd23f" />},
  {at: T('wake up at 500'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_BIG2} glow="#ff6a6a" />},
  {at: T('january 2nd'), cam: [700, 500, 1.08], node: (t) => <DayCard t={t - T('january 2nd')} month="JANUARY" day="2" clock={false} />},
  {at: T('for the first time'), cam: [960, 760, 1.1], node: (t) => <GymBoth t={t} />},
  {at: T('jake is lifting'), cam: [900, 700, 1.12], node: (t) => <GymCurl t={t} who="jake" label="SOMETHING TO PROVE" at={T('something to prove')} />},
  {at: T('sam is on day'), cam: [900, 700, 1.1], node: (t) => <GymCurl t={t} who="sam" label="DAY 33" at={T('day 33')} />},
  {at: T('the place is packed'), cam: [960, 760, 1.08], node: (t) => <GymCrowd t={t} />},
  {at: T('sam knows something'), cam: [960, 760, 1.16], node: (t) => <Solo t={t} who="sam" bg="gym" mood="determined" look={[0.8, 0]} muscle={0.15} top="tank" scale={1.15} />},
  {at: T('in three weeks'), cam: [960, 760, 1.08], node: (t) => <GymCrowd t={t} />},
];

export const POPS4: TW[] = [
  {at: T('about to change'), dur: 2.6, text: 'ABOUT TO CHANGE HIS LIFE.', accent: 2, mode: 'pop'},
  {at: T('not a monk'), dur: 1.3, text: "HE'S NOT A MONK.", accent: 2, mode: 'pop'},
  {at: T('a bad workout'), dur: 1.3, text: 'A BAD WORKOUT.', accent: 1, mode: 'pop'},
  {at: T('but a workout'), dur: 1.6, text: 'BUT A WORKOUT.', accent: 2, mode: 'pop'},
  {at: T('packed'), dur: 1.4, text: 'PACKED.', accent: 0, mode: 'pop'},
  {at: T('empty again'), dur: 1.6, text: 'EMPTY AGAIN.', accent: 1, mode: 'pop'},
];
export const BUBBLES4 = [
  {from: T('come on'), to: TE('its december', 1) + 0.4, text: "Come on, it's December.", x: 1130, y: 260},
  {from: T('its fine'), to: TE('its fine') + 0.5, text: "It's fine.", x: 1130, y: 260},
  {from: T('january is when'), to: TE('counts') + 0.5, text: 'January is when it counts.', x: 1030, y: 260},
];
export const CUES4: Cue3[] = [
  ...POPS4.map((w): Cue3 => ({file: 'text_pop', at: w.at, vol: 0.14})),
  ...[T('he watched three'), T('he bought a new'), T('he made a playlist')].map((at): Cue3 => ({file: 'kw_pop', at: at + 0.1, vol: 0.18})),
  ...[T('the office party'), T('cousins'), T('friends')].map((at): Cue3 => ({file: 'pill_pop', at, vol: 0.14})),
  ...[0, 1, 2, 3, 4, 5, 6].map((k): Cue3 => ({file: 'flash_boom', at: T('midnight') + k * 0.55, vol: 0.1})),
  {file: 'glass_clink', at: T('sam goes to the party') + 0.6, vol: 0.14}, {file: 'door_open', at: T('orders breakfast') + 0.2, vol: 0.18}, {file: 'counter_whir', at: T('a shorter'), dur: 1.0, vol: 0.14},
  {file: 'page_turn', at: T('january 2nd'), vol: 0.16}, {file: 'pill_pop', at: T('sam and jake'), vol: 0.14}, {file: 'pill_pop', at: T('sam and jake') + 0.3, vol: 0.14}, {file: 'shimmer', at: T('in three weeks'), vol: 0.14},
  ...BEATS4.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS4.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
