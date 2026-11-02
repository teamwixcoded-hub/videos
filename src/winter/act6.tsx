import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {DIGI} from '../same2d/theme';
import {T, TE, speakOpen} from './timeline';
import {Frame, RoomArt, Txt, Pill, DayCard, Room, BedMan, Clock, SAM, JAKE} from './scenes';
import {Beats, Beat, BedSolo} from './scenes2';
import {Thermo} from './scenes2';
import {Solo, GymCurl} from './scenes3';
import {MirrorShot} from './scenes4';
import {Pair, SpringWin, Meeting, PhoneDelivery, CoinG, MindCompare, GapShot, ArcRecap, PhotoShot} from './scenes5';
import {BeatsG} from './act5';
import type {Shot4} from './act4';

// ============================================================================================
// WINTER ARC, act 6 (398 s to the end): February, the day-90 comparison, Jake's confession, the rules, "which one are you going to be?".
// ============================================================================================
const J = {who: 'jake' as const}, S = {who: 'sam' as const};
const SAM90 = {...S, muscle: 0.8, fat: 0.1, mood: 'happy' as const}, JAKE90 = {...J, fat: 0.78, muscle: 0, mood: 'tired' as const};
const DAY1 = {fat: 0.5, muscle: 0, mood: 'neutral' as const};

const B_FEB: Beat[] = [
  {text: 'SOMEWHERE IN FEBRUARY,', at: T('somewhere in february'), to: T('other people start'), s: 84, y: 990},
  {text: 'OTHER PEOPLE START TO NOTICE.', at: T('other people start'), s: 76, y: 990, c: '#ffd23f'},
];
const B_SIDE: Beat[] = [
  {text: 'THE SIDE EFFECTS NOBODY TALKS ABOUT', at: T('the side effects'), s: 74, y: 400},
  {text: 'HIS MONEY.', at: T('his money'), s: 200, y: 680, c: '#3ddc84'},
];
const B_MONEY2: Beat[] = [
  {text: "SAM DIDN'T TRY TO SAVE MONEY.", at: T('sam didnt try'), s: 80, y: 280},
  {text: 'HE JUST STOPPED WASTING IT.', at: T('he just stopped wasting'), s: 100, y: 420, c: '#ffd23f'},
];
const B_MIND: Beat[] = [
  {text: 'HIS MIND', at: T('his mind'), s: 150, y: 250},
  {text: 'FOUR BOOKS BECAME SEVEN.', at: T('four books became seven'), s: 80, y: 400, c: '#cfe2ff'},
];
const B_TALK: Beat[] = [
  {text: 'HE TALKS SLOWER.', at: T('he talks slower'), to: T('he thinks before'), s: 84, y: 990},
  {text: 'HE THINKS BEFORE HE ANSWERS.', at: T('he thinks before'), s: 70, y: 990, c: '#ffd23f'},
];
const B_MOOD: Beat[] = [
  {text: 'HIS MOOD', at: T('his mood'), to: T('winter used to'), s: 110, y: 990},
  {text: 'WINTER USED TO MAKE HIM HEAVY AND SLOW.', at: T('winter used to'), s: 58, y: 990, c: '#8c96c8'},
];
const B_BEST: Beat[] = [
  {text: 'THE BEST PART OF HIS DAY.', at: T('the best part'), s: 90, y: 990, c: '#ffd23f'},
];
const B_WARM: Beat[] = [
  {text: 'NOT BECAUSE THEY GOT WARMER.', at: T('not because they got warmer'), s: 84, y: 420, strike: TE('got warmer')},
  {text: 'BECAUSE HE DID.', at: T('because he did'), s: 170, y: 660, c: '#3ddc84'},
];
const B_JF: Beat[] = [
  {text: "JAKE'S FEBRUARY IS DIFFERENT.", at: T('jakes february'), to: T('a few kilos'), s: 70, y: 990},
  {text: 'A FEW KILOS HEAVIER', at: T('a few kilos'), to: T('more tired than'), s: 80, y: 990, c: '#ff9a6a'},
  {text: 'MORE TIRED THAN IN DECEMBER', at: T('more tired than'), to: T('even though hes sleeping'), s: 70, y: 990},
  {text: "EVEN THOUGH HE'S SLEEPING MORE.", at: T('even though hes sleeping'), s: 60, y: 990, c: '#cfe2ff'},
];
const B_STAND: Beat[] = [
  {text: 'SHOULDERS BACK. HEAD UP.', at: T('shoulders back'), to: T('not a fitness model'), s: 72, y: 990},
  {text: 'NOT A FITNESS MODEL.', at: T('not a fitness model'), to: T('just a man who stopped'), s: 72, y: 990, c: '#cfe2ff'},
  {text: 'JUST A MAN WHO STOPPED LOSING TO HIS OWN BED.', at: T('just a man who stopped'), s: 50, y: 990, c: '#ffd23f'},
];
const B_JAKEB: Beat[] = [
  {text: 'A LITTLE HEAVIER.', at: T('jake is a little'), to: T('and a lot more tired'), s: 84, y: 990},
  {text: 'A LOT MORE TIRED.', at: T('and a lot more tired'), s: 84, y: 990, c: '#ff9a6a'},
];
const B_MONEY3: Beat[] = [
  {text: 'THE MONEY', at: T('the money'), s: 110, y: 200},
  {text: 'MORE OF IT.', at: T('sam has more of it'), s: 120, y: 330, c: '#3ddc84'},
  {text: 'NOT FROM A RAISE.', at: T('not from a raise'), s: 80, y: 440, strike: TE('not from a raise')},
  {text: 'FROM 90 DAYS OF NOT PAYING FOR HIS OWN BAD HABITS.', at: T('from 90 days'), s: 50, y: 540, c: '#ffd23f'},
];
const B_SCARE: Beat[] = [{text: 'THE PART THAT SHOULD SCARE YOU', at: T('and heres the part'), s: 90, y: 540, c: '#ff6a6a'}];
const B_DIFF: Beat[] = [
  {text: 'NOT 90 DAYS OF HARD WORK.', at: T('the difference is not'), s: 90, y: 280, strike: TE('hard work')},
  {text: 'ONE SMALL THING', at: T('one small thing'), s: 130, y: 470, c: '#ffd23f'},
  {text: 'DONE AGAIN AND AGAIN BY ONE MAN', at: T('done again and again'), s: 66, y: 620, c: '#3ddc84'},
  {text: 'PUT OFF AGAIN AND AGAIN BY THE OTHER.', at: T('put off again'), s: 66, y: 740, c: '#ff6a6a'},
];
const B_NEVER: Beat[] = [{text: 'YOU NEVER FEEL READY.', at: T('and you never feel ready'), s: 140, y: 540, c: '#ff6a6a'}];
const B_SAMD1: Beat[] = [
  {text: "SAM DIDN'T FEEL READY ON DECEMBER 1ST.", at: T('sam didnt feel ready'), to: T('he was cold'), s: 52, y: 990},
  {text: 'COLD.', at: T('he was cold'), to: T('he was soft'), s: 100, y: 990, c: '#6fd0ff'},
  {text: 'SOFT.', at: T('he was soft'), to: T('no idea'), s: 100, y: 990, c: '#ffd23f'},
  {text: 'NO IDEA WHAT HE WAS DOING.', at: T('no idea'), s: 72, y: 990, c: '#cfe2ff'},
];
const B_ONLY: Beat[] = [
  {text: 'THE ONLY THING', at: T('thats the only thing'), s: 110, y: 380},
  {text: "HE DID THAT JAKE DIDN'T:", at: T('he did that jake'), s: 76, y: 520, c: '#cfe2ff'},
  {text: 'START.', at: T('jake didnt'), s: 260, y: 790, c: '#3ddc84'},
];
const B_RULE: Beat[] = [
  {text: 'NO MEAL PLAN.', at: T('no meal plan'), s: 90, y: 260, strike: TE('no meal plan') + 0.05},
  {text: 'NO COLD SHOWERS.', at: T('no cold showers'), s: 90, y: 400, strike: TE('no cold showers') + 0.05},
  {text: 'ONE RULE:', at: T('one rule'), s: 100, y: 570, c: '#ffd23f'},
  {text: '20 MINUTES EVERY DAY. NO MATTER WHAT.', at: T('20 minutes every day'), s: 72, y: 720, c: '#3ddc84'},
];
const B_NY2: Beat[] = [
  {text: 'NO FIREWORKS.', at: T('no fireworks'), s: 110, y: 380, strike: TE('no fireworks') + 0.05},
  {text: 'NO FRESH START.', at: T('no fresh start'), s: 110, y: 600, strike: TE('no fresh start') + 0.05},
];
const B_TRUTH: Beat[] = [
  {text: 'THE TRUTH ABOUT THE WINTER ARC', at: T('heres the truth'), s: 76, y: 440, c: '#ffd23f'},
  {text: 'IT WAS NEVER ABOUT WINTER.', at: T('it was never about winter'), s: 100, y: 650},
];
const B_NEED: Beat[] = [
  {text: "YOU DON'T NEED A NEW YEAR.", at: T('you dont need a new year'), s: 90, y: 230, strike: TE('you dont need a new year')},
  {text: "YOU DON'T NEED MONDAY.", at: T('you dont need monday'), s: 90, y: 380, strike: TE('you dont need monday')},
  {text: 'YOU NEED ONE SMALL THING YOU CAN DO ON YOUR WORST DAY', at: T('you need one small thing'), s: 56, y: 560, c: '#3ddc84'},
  {text: 'AND YOU NEED TO DO IT TONIGHT.', at: T('and you need to do it tonight'), s: 90, y: 770, c: '#ffd23f'},
];
const BEATS6 = [B_FEB, B_SIDE, B_MONEY2, B_MIND, B_TALK, B_MOOD, B_BEST, B_WARM, B_JF, B_STAND, B_JAKEB, B_MONEY3, B_SCARE, B_DIFF, B_NEVER, B_SAMD1, B_ONLY, B_RULE, B_NY2, B_TRUTH, B_NEED];

const BooksG: React.FC<{t: number}> = ({t}) => {
  const cols = ['#2f7d5b', '#c9602e', '#3b6fd8', '#8a4fd8', '#d84f8a', '#e9962c', '#3b8d6b'], a = T('four books became seven'), b = T('became seven');
  return <g transform="translate(960 960)">{cols.map((c, i) => { const k = ramp(t, i < 4 ? a + i * 0.2 : b + (i - 4) * 0.25, (i < 4 ? a + i * 0.2 : b + (i - 4) * 0.25) + 0.25); return <g key={i} opacity={k} transform={`translate(${i % 2 ? 14 : -10} ${-i * 70 - (1 - k) * 40})`}><rect x={-230} y={-66} width={460} height={66} rx={10} fill={c} stroke="#1b1a3a" strokeWidth={7} /><rect x={-220} y={-40} width={440} height={12} fill="#f8f1dc" opacity={0.85} /></g>; })}</g>;
};
const SpringRoom: React.FC<{t: number}> = ({t}) => (
  <Frame>
    <RoomArt t={t} dawn={0.9} /><SpringWin />
    <BedMan t={t} who="sam" eyes="open" mood="happy" id="srs" />
    <g transform="translate(1920 0) scale(-1 1)"><BedMan t={t} who="jake" eyes="open" mood="tired" id="srj" /></g>
    <Pill x={960} y={110} text="DAY 90" c="#3ddc84" o={ramp(t, T('ninety days'), T('ninety days') + 0.3)} />
  </Frame>
);
const Dots: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => <g>{[0, 1, 2].map((i) => <circle key={i} cx={x + i * 46} cy={y - i * 16} r={12 + i * 6} fill="#fff" stroke="#1b1a3a" strokeWidth={5} opacity={0.5 + 0.5 * Math.sin(t * 4 + i)} />)}</g>;

export const SHOTS6: Shot4[] = [
  {at: T('somewhere in february'), cam: [960, 760, 1.08], node: (t) => <Pair t={t} bg="office" left={{who: 'coworker', mood: 'neutral', look: [0.9, 0]}} right={{...S, muscle: 0.45, fat: 0.25, mood: 'happy'}}><BeatsG t={t} beats={B_FEB} /></Pair>},
  {at: T('a colleague asks'), cam: [560, 700, 1.15], node: (t) => <Pair t={t} bg="office" left={{who: 'colleague', mood: 'neutral', open: speakOpen(t, T('did you lose weight'), TE('did you lose weight'))}} right={{...S, muscle: 0.45, fat: 0.25, mood: 'neutral'}} />},
  {at: T('sam says'), cam: [1360, 700, 1.15], node: (t) => <Pair t={t} bg="office" left={{who: 'colleague', mood: 'neutral'}} right={{...S, muscle: 0.45, fat: 0.25, mood: 'happy', open: speakOpen(t, T('says a little') + 0.5, TE('says a little'))}} />},
  {at: T('his shirts fit'), cam: [960, 700, 1.16], node: (t) => <Solo t={t} who="sam" muscle={0.5} fat={0.22} top="tee" mood="happy" dawn={0.5} scale={1.15}><ellipse cx={960} cy={520} rx={290} ry={96} fill="none" stroke="#ffd23f" strokeWidth={9} strokeDasharray="22 14" opacity={ramp(t, T('across the shoulders'), T('across the shoulders') + 0.3)} /><BeatsG t={t} beats={[{text: 'ACROSS THE SHOULDERS', at: T('across the shoulders'), s: 80, y: 990, c: '#ffd23f'}]} /></Solo>},
  {at: T('his mother tells'), cam: [960, 760, 1.08], node: (t) => <Pair t={t} bg="room" dawn={0.6} left={{who: 'mom', mood: 'happy'}} right={{...S, muscle: 0.5, fat: 0.2, mood: 'happy'}}><BeatsG t={t} beats={[{text: 'HE LOOKS RESTED.', at: T('he looks rested'), s: 100, y: 990, c: '#3ddc84'}]} /><Pill x={560} y={150} text="MOM" c="#d84f8a" /></Pair>},
  {at: T('and then the side effects'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_SIDE} glow="#3ddc84" />},
  {at: T('when you sleep'), cam: [960, 540, 1.06], node: (t) => <PhoneDelivery t={t} />},
  {at: T('sam didnt try'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_MONEY2} glow="#ffd23f"><CoinG t={t} a={T('he just stopped wasting')} /></Beats>},
  {at: T('his mind'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_MIND} glow="#8a6fb8"><BooksG t={t} /></Beats>},
  {at: T('he talks slower'), cam: [960, 760, 1.1], node: (t) => <Solo t={t} who="sam" muscle={0.5} fat={0.2} top="tee" mood="neutral" dawn={0.5}><BeatsG t={t} beats={B_TALK} /><g opacity={ramp(t, T('he thinks before'), T('he thinks before') + 0.3)}><Dots t={t} x={1150} y={460} /></g></Solo>},
  {at: T('in a meeting'), cam: [960, 760, 1.08], node: (t) => <Meeting t={t} />},
  {at: T('his mood'), cam: [960, 760, 1.08], node: (t) => <Solo t={t} who="sam" fat={0.5} top="hoodie" mood="sad" pose="slump"><BeatsG t={t} beats={B_MOOD} /></Solo>},
  {at: T('this year the cold'), cam: [960, 760, 1.1], node: (t) => <Solo t={t} who="sam" muscle={0.5} fat={0.2} top="tee" mood="happy" dawn={0.95}><circle cx={960} cy={420} r={380} fill="#ffb25a" opacity={0.18} style={{filter: 'blur(30px)'}} /><BeatsG t={t} beats={B_BEST} /></Solo>},
  {at: T('not because they got warmer'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_WARM} glow="#3ddc84" />},
  {at: T('jakes february'), cam: [960, 760, 1.08], node: (t) => <Solo t={t} who="jake" fat={0.78} top="hoodie" mood="sad" dawn={0.1}><BeatsG t={t} beats={B_JF} /></Solo>},
  {at: T('when someone at work'), cam: [960, 700, 1.1], node: (t) => <Pair t={t} bg="office" left={{who: 'coworker', mood: 'neutral', open: speakOpen(t, T('you look tired man'), TE('you look tired man'))}} right={{...J, fat: 0.78, mood: 'tired', open: t > T('he laughs') && t < TE('laughs it off') ? Math.max(0, Math.sin(t * 14)) * 0.5 : 0}} />},
  {at: T('but he goes home'), cam: [900, 700, 1.1], node: (t) => <MirrorShot t={t} mood="sad" label="A LONG TIME" man={{fat: 0.78, muscle: 0, topColor: JAKE.topColor, cast: 'colleague'}} />},
  {at: T('ninety days'), cam: [960, 760, 1.1], node: (t) => <SpringRoom t={t} />},
  {at: T('stand them side by side'), cam: [960, 840, 1.08], node: (t) => <Pair t={t} bg="spring" dawn={0.9} left={SAM90} right={JAKE90}><Pill x={560} y={170} text="SAM" c="#e9962c" /><Pill x={1360} y={170} text="JAKE" c="#6b4fc4" /></Pair>},
  {at: T('the body'), cam: [960, 840, 1.1], node: (t) => <Pair t={t} bg="spring" dawn={0.9} left={SAM90} right={JAKE90}><Pill x={960} y={110} text="THE BODY" c="#3b6fd8" /></Pair>},
  {at: T('you notice how he stands'), cam: [960, 760, 1.14], node: (t) => <Solo t={t} who="sam" muscle={0.8} fat={0.1} top="tee" mood="happy" dawn={0.9} scale={1.15}><BeatsG t={t} beats={B_STAND} /></Solo>},
  {at: T('jake is a little heavier'), cam: [960, 760, 1.1], node: (t) => <Solo t={t} who="jake" fat={0.78} top="tee" mood="tired" dawn={0.9}><BeatsG t={t} beats={B_JAKEB} /></Solo>},
  {at: T('the energy'), cam: [960, 840, 1.08], node: (t) => (
    <Pair t={t} bg="spring" dawn={0.9} left={{...SAM90, mood: 'happy'}} right={JAKE90}>
      <Pill x={560} y={120} text="UP EARLY" c="#3ddc84" o={ramp(t, T('sam wakes up'), T('sam wakes up') + 0.3)} />
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1180 + i * 180} ${230 - i * 6}) scale(0.5)`} opacity={ramp(t, T('jake still needs') + i * 0.25, T('jake still needs') + i * 0.25 + 0.2)}><g transform="translate(-960 -702)"><Clock t={t + i} ring={1} label="6:00" /></g></g>)}
    </Pair>)},
  {at: T('the money'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_MONEY3} glow="#ffd23f"><CoinG t={t} a={T('sam has more of it')} /></Beats>},
  {at: T('the mind'), cam: [960, 540, 1.05], node: (t) => <MindCompare t={t} />},
  {at: T('and heres the part'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_SCARE} glow="#ff6a6a" />},
  {at: T('ninety days ago'), cam: [960, 840, 1.08], node: (t) => <Pair t={t} bg="room" dawn={0.2} left={{...S, top: 'hoodie', ...DAY1}} right={{...J, top: 'hoodie', ...DAY1}}><Pill x={960} y={110} text="DAY 1" c="#6fa0ff" /><BeatsG t={t} beats={[{text: 'THE SAME MAN.', at: T('they were the same man'), s: 120, y: 990, c: '#ffd23f'}]} /></Pair>},
  {at: T('the difference is not'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_DIFF} glow="#3ddc84" />},
  {at: T('that night jake'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="jake" eyes="open" mood="sad"><BeatsG t={t} beats={[{text: "CAN'T SLEEP.", at: T('jake cant sleep'), s: 130, y: 230, c: '#cfe2ff'}]} /></BedSolo>},
  {at: T('he opens his phone'), cam: [960, 700, 1.1], node: (t) => <BedSolo t={t} who="jake" phone eyes="open" mood="sad"><BeatsG t={t} beats={[{text: 'NOT SCROLLING.', at: T('doesnt scroll'), s: 120, y: 230, c: '#3ddc84'}]} /></BedSolo>},
  {at: T('he looks at a photo'), cam: [960, 560, 1.06], node: (t) => <PhotoShot t={t} />},
  {at: T('and he finally says'), cam: [960, 760, 1.16], node: (t) => <Solo t={t} who="jake" fat={0.7} top="hoodie" mood="sad" dawn={0} open={Math.max(speakOpen(t, T('i wasnt waiting'), TE('waiting for january')), speakOpen(t, T('i was waiting'), TE('feel ready')))} />},
  {at: T('and you never feel ready'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_NEVER} glow="#ff6a6a" />},
  {at: T('sam didnt feel ready'), cam: [960, 760, 1.1], node: (t) => <Solo t={t} who="sam" fat={0.5} top="hoodie" mood="tired" dawn={0}><BeatsG t={t} beats={B_SAMD1} /></Solo>},
  {at: T('he started anyway'), cam: [960, 760, 1.08], node: (t) => {
    const k = ramp(t, T('he started anyway'), T('he started anyway') + 1.4);
    return <Solo t={t} who="sam" fat={0.45} top="hoodie" mood="determined" dawn={0.2} x={420 + k * 1100} y={1040 - Math.abs(Math.sin(t * 8)) * 10} pose={k < 1 && Math.sin(t * 8) > 0 ? 'pump' : 'idle'} />;
  }},
  {at: T('thats the only thing'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_ONLY} glow="#3ddc84" />},
  {at: T('so jake sets one alarm'), cam: [960, 700, 1.1], node: (t) => (
    <BedSolo t={t} who="jake" phone eyes="open" mood="neutral" dawn={0.2}>
      <g><Txt x={1560} y={260} s={90} c="#8c96c8" font={DIGI}>5:00 AM</Txt><path d="M 1380,230 L 1740,230" stroke="#ff4a5e" strokeWidth={12} strokeLinecap="round" strokeDasharray={360} strokeDashoffset={360 * (1 - ramp(t, T('not 500'), T('not 500') + 0.3))} /></g>
      <g opacity={ramp(t, T('700'), T('700') + 0.3)}><Txt x={1560} y={400} s={140} c="#3ddc84" font={DIGI}>7:00 AM</Txt></g>
    </BedSolo>)},
  {at: T('no meal plan'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_RULE} glow="#3ddc84" />},
  {at: T('its march'), cam: [700, 500, 1.08], node: (t) => <DayCard t={t - T('its march')} month="MARCH" day="2" clock={false} />},
  {at: T('no fireworks'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_NY2} glow="#6fa0ff" />},
  {at: T('which is exactly'), cam: [900, 700, 1.1], node: (t) => <GymCurl t={t} who="jake" label="20 MINUTES" at={T('which is exactly')} />},
  {at: T('heres the truth'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_TRUTH} glow="#ffd23f" />},
  {at: T('its about the gap'), cam: [960, 540, 1.05], node: (t) => <GapShot t={t} />},
  {at: T('you dont need a new year'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_NEED} glow="#3ddc84" />},
  {at: T('twenty minutes of movement'), cam: [960, 520, 1.06], node: (t) => <ArcRecap t={t} />},
  {at: T('ninety days from now'), cam: [960, 840, 1.08], node: (t) => <Pair t={t} bg="spring" dawn={0.9} left={SAM90} right={JAKE90}><Pill x={560} y={170} text="SAM" c="#e9962c" /><Pill x={1360} y={170} text="JAKE" c="#6b4fc4" /></Pair>},
  {at: T('both of them started'), cam: [960, 840, 1.08], node: (t) => (
    <Pair t={t} bg="room" dawn={0.2} left={{...S, top: 'hoodie', ...DAY1}} right={{...J, top: 'hoodie', ...DAY1}}>
      <Pill x={560} y={170} text="SAME BODY" c="#6fa0ff" o={ramp(t, T('same body'), T('same body') + 0.25)} /><Pill x={960} y={170} text="SAME EXCUSES" c="#ff9a6a" o={ramp(t, T('same excuses'), T('same excuses') + 0.25)} /><Pill x={1360} y={170} text="SAME ALARM" c="#ffd23f" o={ramp(t, T('same alarm', 1), T('same alarm', 1) + 0.25)} />
    </Pair>)},
  {at: T('only one of them'), cam: [960, 840, 1.08], node: (t) => <Pair t={t} bg="spring" dawn={0.9} left={SAM90} right={{...JAKE90, pose: 'slump'}} />},
  {at: T('so tomorrow morning'), cam: [960, 760, 1.28], node: (t) => <Room t={t} sam="open" jake="open" ring={1} mood="tired" />},
  {at: T('the room is cold'), cam: [760, 520, 1.06], node: (t) => <Thermo t={t} from={T('the room is cold')} warm={false} />},
  {at: T('and the bed is warm'), cam: [1100, 540, 1.06], node: (t) => <Thermo t={t} from={T('and the bed is warm')} warm />},
  {at: T('which one are you'), cam: [960, 840, 1.06], node: (t) => <Pair t={t} bg="spring" dawn={0.9} left={SAM90} right={{...JAKE90, mood: 'sad'}}><Pill x={560} y={170} text="SAM" c="#e9962c" /><Pill x={1360} y={170} text="JAKE" c="#6b4fc4" /></Pair>},
];

export const POPS6: TW[] = [
  {at: T('he started anyway'), dur: 1.7, text: 'HE STARTED ANYWAY.', accent: 2, mode: 'pop'},
  {at: T('why it works'), dur: 1.5, text: "THAT'S WHY IT WORKS.", accent: 2, mode: 'pop'},
  {at: T('one of these two men'), dur: 2.0, text: 'ONE OF THESE TWO MEN.', accent: 2, mode: 'pop'},
  {at: T('only one of them'), dur: 1.7, text: 'ONLY ONE GOT UP.', accent: 2, mode: 'pop'},
  {at: T('which one are you'), dur: 3.8, text: 'WHICH ONE ARE YOU?', accent: 1, mode: 'slam'},
];
export const BUBBLES6 = [
  {from: T('did you lose weight'), to: TE('did you lose weight') + 0.5, text: 'Did you lose weight?', x: 360, y: 150},
  {from: T('says a little') + 0.6, to: TE('says a little') + 0.5, text: 'A little.', x: 1180, y: 150},
  {from: T('you look tired man'), to: TE('you look tired man') + 0.5, text: 'You look tired, man.', x: 360, y: 150},
  {from: T('i wasnt waiting'), to: TE('waiting for january') + 0.3, text: "I wasn't waiting for January.", x: 1080, y: 230},
  {from: T('i was waiting'), to: TE('feel ready') + 0.5, text: 'I was waiting to feel ready.', x: 1080, y: 230},
];
export const CUES6: Cue3[] = [
  ...POPS6.map((w): Cue3 => (w.mode === 'slam' ? {file: 'text_slam', at: w.at, vol: 0.26} : {file: 'text_pop', at: w.at, vol: 0.14})),
  ...BEATS6.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS6.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
  {file: 'phone_notif', at: T('when you sleep') + 0.2, vol: 0.18}, {file: 'stamp_hit', at: T('dont order') + 0.1, vol: 0.2},
  ...Array.from({length: 14}, (_, i): Cue3 => ({file: 'coin_ping', at: T('he just stopped wasting') + i * 0.16, vol: 0.08})),
  ...[T('sam finished seven'), T('jake finished seven')].map((at): Cue3 => ({file: 'kw_pop', at, vol: 0.16})),
  {file: 'shimmer', at: T('ninety days'), vol: 0.14}, {file: 'phone_unlock', at: T('he opens his phone') + 0.3, vol: 0.14}, {file: 'phone_swipe', at: T('he looks at a photo'), vol: 0.14},
  {file: 'alarm_beep', at: T('so tomorrow morning') + 0.3, dur: 1.6, vol: 0.2}, {file: 'page_turn', at: T('its march'), vol: 0.16}, {file: 'shimmer', at: T('which one are you'), vol: 0.2},
  ...[T('same body'), T('same excuses'), T('same alarm', 1), T('stand them side by side')].map((at): Cue3 => ({file: 'pill_pop', at, vol: 0.14})),
  ...[T('twenty minutes of movement'), T('10 pages', 2), T('phone across the room'), T('bed before midnight')].map((at): Cue3 => ({file: 'kw_pop', at: at + 0.1, vol: 0.16})),
  {file: 'heartbeat', at: T('and heres the part'), dur: 4, vol: 0.1, loop: true},
];
