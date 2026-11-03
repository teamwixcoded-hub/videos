import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {T, TE, speakOpen} from './timeline';
import {Beats, Beat, RingG} from '../winter/scenes2';
import {BeatsG} from '../winter/act5';
import type {Shot4} from '../winter/act4';
import {OSolo, OPair, Ceiling, CardRow, EmailUI, ThoughtCloud, DayStrip, Chip, Pill, Txt, MailLine} from './scenes';

// ============================================================================================
// OVERTHINKING, act 1 (0 to 134 s): 2:00 AM, Sam and Jake are the same, three chances, Monday's email, Sam sends it, Jake's week of drafts, "the first lie".
// ============================================================================================
const Y = 990;
const B_ONE: Beat[] = [
  {text: 'ONE WILL TAKE ALL THREE.', at: T('one will take all three'), to: T('one will think'), s: 100, y: 300, c: '#3ddc84'},
  {text: 'ONE WILL THINK ABOUT ALL THREE.', at: T('one will think about'), s: 84, y: 560, c: '#ff9a6a'},
  {text: 'ONE YEAR FROM NOW, THE ONLY DIFFERENCE LEFT.', at: T('one year from now'), s: 58, y: 800, c: '#ffd23f'},
];
const B_FIRST: Beat[] = [
  {text: 'JAKE NEVER SAID NO.', at: T('jake never said no'), s: 120, y: 420},
  {text: 'HE NEVER DECIDED ANYTHING.', at: T('he never decided'), s: 100, y: 560},
  {text: 'THE DECISION MADE ITSELF.', at: T('the decision made itself'), s: 120, y: 760, c: '#ff6a6a'},
];
const B_LIE: Beat[] = [
  {text: 'THE FIRST LIE OVERTHINKING TELLS YOU', at: T('first lie'), s: 66, y: 330, c: '#8c96c8'},
  {text: '"WAITING IS BEING CAREFUL."', at: T('waiting is being careful'), s: 96, y: 520, strike: TE('being careful') + 0.5},
  {text: 'A SLOW WAY OF SAYING NO', at: T('slow way of saying no'), s: 100, y: 720, c: '#ff6a6a'},
  {text: 'WITHOUT ADMITTING YOU SAID NO.', at: T('without having to admit'), s: 66, y: 840},
];
const BEATS1 = [B_ONE, B_FIRST, B_LIE];

const SAMMAIL: MailLine[] = [
  {text: "I'd like to be considered.", at: T('id like to be'), dur: 1.3},
  {text: "Here's what I've done.", at: T('heres what ive done'), dur: 1.1},
  {text: "I'll learn the rest.", at: T('ill learn the rest'), dur: 1.1},
];
const J_LINES = (t: number): MailLine[] => {
  const a = T('writes a paragraph'), d = T('deletes it'), r = T('writes it again');
  return [
    {text: 'Dear Sir, I am writing to express my interest', at: a, dur: 1.4, del: d},
    {text: 'in the position, and I hope you will consider', at: a + 0.2, dur: 1.4, del: d + 0.1},
    {text: 'Hi, I would like to apply for the role', at: r, dur: 1.4},
    {text: 'because I believe I could really grow here.', at: r + 0.3, dur: 1.4},
  ];
};

export const SHOTS_1: Shot4[] = [
  {at: 0, cam: [1100, 500, 1.05], node: (t) => <Ceiling t={t} />},
  {at: T('sam and jake are'), cam: [960, 840, 1.1], node: (t) => <OPair t={t} left={{who: 'sam', mood: 'tired'}} right={{who: 'jake', mood: 'tired'}}><Pill x={560} y={60} text="SAM · 26" c="#e9962c" o={ramp(t, T('sam and jake are'), T('sam and jake are') + 0.3)} /><Pill x={1360} y={60} text="JAKE · 26" c="#6b4fc4" o={ramp(t, T('jake'), T('jake') + 0.3)} /></OPair>},
  {at: T('same office'), cam: [960, 520, 1.05], node: (t) => <CardRow t={t} cards={[{label: 'OFFICE', at: T('same office'), icon: 'office'}, {label: 'SALARY', at: T('same salary'), icon: 'money'}, {label: 'APARTMENT', at: T('same small apartment'), icon: 'home'}, {label: 'TIRED EYES', at: T('same tired eyes'), icon: 'eyes'}]} />},
  {at: T('this year life hands'), cam: [960, 520, 1.06], node: (t) => <CardRow t={t} glow="#ffd23f" cards={[{label: 'THE EMAIL', at: T('same email'), icon: 'mail', c: '#cfe2ff'}, {label: 'THE GIRL', at: T('same girl'), icon: 'girl', c: '#ffb0d0'}, {label: 'THE IDEA', at: T('same idea'), icon: 'bulb', c: '#ffd23f'}]}><Txt x={960} y={150} s={80} c="#fff" o={ramp(t, T('three chances'), T('three chances') + 0.3)}>3 CHANCES</Txt></CardRow>},
  {at: T('one will take all three'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_ONE} glow="#3ddc84" />},
  {at: T('monday first chance'), cam: [960, 700, 1.1], node: (t) => <OPair t={t} bg="office" left={{who: 'sam', mood: 'neutral', look: [0.8, 0]}} right={{who: 'jake', mood: 'neutral', look: [-0.8, 0]}}><DayStrip t={t} days={[{d: 'MON', at: T('monday first chance')}]} y={150} /><g transform={`translate(960 ${500 + Math.sin(t * 2) * 10})`} opacity={ramp(t, T('email goes round'), T('email goes round') + 0.4)}><rect x={-90} y={-60} width={180} height={120} rx={14} fill="#f4f6ff" stroke="#1b1a3a" strokeWidth={7} /><path d="M -90,-50 L 0,20 L 90,-50" stroke="#1b1a3a" strokeWidth={7} fill="none" strokeLinejoin="round" /><circle cx={80} cy={-56} r={24} fill="#ff4a5e" stroke="#1b1a3a" strokeWidth={5} /></g></OPair>},
  {at: T('new team'), cam: [960, 540, 1.04], node: (t) => <EmailUI t={t} subject="NEW TEAM · SENIOR ROLE · BETTER PAY" to="From: Office" lines={[{text: 'New team. Senior role. Better pay.', at: T('new team'), dur: 1.5}, {text: 'Applications close Friday.', at: T('applications close friday'), dur: 1.2, c: '#d8403b'}]} glow="#3b6fd8" />},
  {at: T('sam reads it twice'), cam: [960, 760, 1.14], node: (t) => <OSolo t={t} bg="office" m={{who: 'sam', mood: t > T('stomach drops') ? 'shock' : 'neutral', pose: t > T('stomach drops') ? 'belly' : 'idle', look: [Math.sin(t * 5) * 0.8, 0]}}><g opacity={ramp(t, T('stomach drops'), T('stomach drops') + 0.2)}><Txt x={960} y={170} s={100} c="#ff6a6a">STOMACH DROPS</Txt></g></OSolo>},
  {at: T('that voice hits'), cam: [960, 780, 1.12], node: (t) => (
    <OSolo t={t} bg="office" m={{who: 'sam', mood: 'sad', open: speakOpen(t, T('im not ready'), TE('theyll laugh')) * 0}}>
      <ThoughtCloud t={t} items={[{text: "I'M NOT READY.", at: T('im not ready'), x: 520, y: 230, s: 50}, {text: "I'M TOO YOUNG.", at: T('im too young'), x: 1400, y: 300, s: 50}, {text: "THEY'LL LAUGH.", at: T('theyll laugh'), x: 520, y: 440, s: 50}]} />
    </OSolo>)},
  {at: T('he feels it all'), cam: [960, 760, 1.18], node: (t) => <OSolo t={t} bg="office" m={{who: 'sam', mood: 'shock', pose: {arm: [40 + Math.sin(t * 40) * 6, 150], hand: 'open'}}}><Txt x={960} y={990} s={80} c="#ffd23f" o={ramp(t, T('hands shaking'), T('hands shaking') + 0.2)}>HANDS SHAKING A LITTLE</Txt></OSolo>},
  {at: T('he opens a reply anyway'), cam: [960, 540, 1.04], node: (t) => <EmailUI t={t} lines={SAMMAIL} sendAt={T('sends it')} hit={T('sends it')} stamp="SENT" glow="#3ddc84"><Txt x={960} y={990} s={64} c="#cfe2ff" o={ramp(t, T('writes four lines'), T('writes four lines') + 0.3)}>4 LINES. ONE READ. SENT.</Txt></EmailUI>},
  {at: T('11 minutes'), cam: [960, 760, 1.1], node: (t) => <OSolo t={t} bg="office" m={{who: 'sam', mood: 'shock', pose: 'belly'}}><RingG t={t} a={T('11 minutes')} b={T('11 minutes') + 1.0} total={11} unit="MINUTES" x={1500} y={330} r={150} /><Txt x={960} y={990} s={70} c="#ffd23f" o={ramp(t, T('heart still pounding'), T('heart still pounding') + 0.3)}>HEART STILL POUNDING</Txt></OSolo>},
  {at: T('jake reads the same'), cam: [960, 780, 1.12], node: (t) => (
    <OSolo t={t} bg="office" m={{who: 'jake', mood: 'tired', look: [0, 0]}}>
      <ThoughtCloud t={t} items={[{text: "WHAT IF I'M NOT GOOD ENOUGH?", at: T('what if im not good'), to: T('what if my manager'), x: 480, y: 200, s: 40}, {text: 'WHAT IF MY MANAGER FEELS BETRAYED?', at: T('what if my manager'), to: T('what if i get it'), x: 1440, y: 280, s: 40}, {text: 'WHAT IF I GET IT AND FAIL IN FRONT OF EVERYONE?', at: T('what if i get it'), to: T('what if everyone finds out'), x: 480, y: 500, s: 38}, {text: "WHAT IF EVERYONE FINDS OUT I'M A FRAUD?", at: T('what if everyone finds out'), x: 1440, y: 520, s: 38}]} />
    </OSolo>)},
  {at: T('writes a paragraph'), cam: [960, 540, 1.04], node: (t) => <EmailUI t={t} lines={J_LINES(t)} version={t > T('writes it again') ? 'DRAFT 2' : 'DRAFT 1'} glow="#8a4fd8" />},
  {at: T('more formal'), cam: [960, 540, 1.04], node: (t) => (
    <EmailUI t={t} lines={[{text: 'Hi, I would like to apply for the role', at: -1, dur: 0.01}, {text: 'because I believe I could really grow here.', at: -1, dur: 0.01}]} version="DRAFT 3" glow="#8a4fd8">
      <Chip x={470} y={985} s={38} text="MORE FORMAL" c="#3b6fd8" o={ramp(t, T('more formal'), T('more formal') + 0.2)} /><Chip x={960} y={985} s={38} text="LESS FORMAL" c="#8a4fd8" o={ramp(t, T('less formal'), T('less formal') + 0.2)} /><Chip x={1450} y={985} s={38} text="MORE CONFIDENT" c="#3ddc84" o={ramp(t, T('more confident'), T('more confident') + 0.2)} />
      <g opacity={ramp(t, T('now it sounds arrogant'), T('now it sounds arrogant') + 0.2)} transform="translate(960 190)"><Chip x={0} y={0} text="NOW IT SOUNDS ARROGANT" c="#ff4a5e" s={52} /></g>
    </EmailUI>)},
  {at: T('sleeps on it'), cam: [960, 540, 1.05], node: (t) => <OSolo t={t} bg="room" m={{who: 'jake', mood: 'tired', pose: 'slump'}}><DayStrip t={t} days={[{d: 'MON', at: 0}, {d: 'TUE', at: T('tuesday')}]} y={150} /><Txt x={960} y={990} s={90} c="#cfe2ff" o={ramp(t, T('sleeps on it'), T('sleeps on it') + 0.3) * (1 - ramp(t, T('tuesday'), T('tuesday') + 0.2))}>SLEEPS ON IT.</Txt></OSolo>},
  {at: T('he rewrites it'), cam: [960, 540, 1.04], node: (t) => <EmailUI t={t} lines={[{text: 'Hello, I would like to be considered for', at: T('he rewrites it'), dur: 1.2, del: T('he rereads') - 0.3}, {text: 'the senior role, if that is acceptable.', at: T('he rewrites it') + 0.3, dur: 1.2, del: T('he rereads') - 0.2}]} version="DRAFT 4" glow="#8a4fd8"><DayStrip t={t} days={[{d: 'MON', at: 0}, {d: 'TUE', at: 0}]} y={130} /></EmailUI>},
  {at: T('he rereads the job post'), cam: [960, 540, 1.05], node: (t) => (
    <EmailUI t={t} subject="JOB POST" to="" lines={[{text: 'Must have: 5 years experience', at: -1, dur: 0.01, c: '#d8403b'}, {text: 'Must have: advanced reporting', at: -1, dur: 0.01, c: '#d8403b'}, {text: 'Must have: team budget skills', at: -1, dur: 0.01, c: '#d8403b'}]} glow="#ff6a6a">
      <RingG t={t} a={T('he rereads the job post')} b={T('five times') + 0.2} total={5} unit="TIMES" x={1560} y={300} r={120} c="#ff9a6a" />
      <Txt x={960} y={990} s={70} c="#ff6a6a" o={ramp(t, T('three skills'), T('three skills') + 0.3)}>3 SKILLS HE DOESN'T HAVE</Txt>
    </EmailUI>)},
  {at: T('wednesday'), cam: [960, 760, 1.08], node: (t) => <OPair t={t} bg="office" left={{who: 'jake', mood: 'tired', open: 0}} right={{who: 'friend', mood: 'happy', open: speakOpen(t, T('just go for it'), TE('just go for it'))}}><DayStrip t={t} days={[{d: 'MON', at: 0}, {d: 'TUE', at: 0}, {d: 'WED', at: T('wednesday')}]} y={130} /></OPair>},
  {at: T('feels better for'), cam: [960, 540, 1.05], node: (t) => {
    const up = ramp(t, T('feels better for'), T('feels better for') + 1.0), down = ramp(t, T('the doubt comes back'), T('the doubt comes back') + 0.8), lvl = Math.max(0.1, up * 0.7 - down * 0.7 + down * 0.9);
    return (
      <Beats t={t} beats={[{text: 'FEELS BETTER FOR 10 MINUTES', at: T('feels better for'), to: T('then the doubt'), s: 84, y: 300, c: '#3ddc84'}, {text: 'THEN THE DOUBT COMES BACK LOUDER.', at: T('then the doubt'), s: 84, y: 300, c: '#ff6a6a'}]} glow={down > 0.3 ? '#ff6a6a' : '#3ddc84'}>
        <g transform="translate(960 800)"><rect x={-500} y={-40} width={1000} height={80} rx={40} fill="#1d2248" stroke="#1b1a3a" strokeWidth={8} /><rect x={-492} y={-32} width={Math.max(8, 984 * lvl)} height={64} rx={32} fill={down > 0.3 ? '#ff4a5e' : '#3ddc84'} /><Txt x={0} y={100} s={50} c={down > 0.3 ? '#ff6a6a' : '#3ddc84'}>{down > 0.3 ? 'DOUBT' : 'RELIEF'}</Txt></g>
      </Beats>
    );
  }},
  {at: T('thursday'), cam: [960, 540, 1.04], node: (t) => {
    const sw = Math.floor((t - T('changes it changes it back')) * 3) % 2 === 0;
    return <EmailUI t={t} lines={[{text: 'Hi, I would like to apply for the role', at: -1, dur: 0.01}, {text: sw ? 'because I believe I could truly grow here.' : 'because I believe I could really grow here.', at: -1, dur: 0.01}]} hilite={{line: 1, at: T('one word'), to: T('friday', 1)}} version="DRAFT 9" glow="#8a4fd8"><DayStrip t={t} days={[{d: 'MON', at: 0}, {d: 'TUE', at: 0}, {d: 'WED', at: 0}, {d: 'THU', at: T('thursday')}]} y={110} /><Txt x={960} y={990} s={66} c="#ffd23f" o={ramp(t, T('one word'), T('one word') + 0.3)}>ONE WORD. JUST ONE.</Txt></EmailUI>;
  }},
  {at: T('friday', 1), cam: [960, 540, 1.05], node: (t) => (
    <EmailUI t={t} subject="(no subject)" lines={[{text: 'Hi, I would like to apply for the role', at: -1, dur: 0.01, c: '#8a8fb0'}, {text: 'because I believe I could really grow here.', at: -1, dur: 0.01, c: '#8a8fb0'}]} version="VERSION 11" glow="#ff6a6a">
      <DayStrip t={t} days={[{d: 'MON', at: 0}, {d: 'TUE', at: 0}, {d: 'WED', at: 0}, {d: 'THU', at: 0}, {d: 'FRI', at: T('friday', 1)}]} y={110} done={T('never sent')} />
      <g transform="translate(1500 330)" opacity={ramp(t, T('500 pm'), T('500 pm') + 0.2)}><rect x={-190} y={-60} width={380} height={120} rx={16} fill="#12080c" stroke="#1b1a3a" strokeWidth={8} /><text x={0} y={30} textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight={700} fontSize={80} fill="#ff4a4a">5:00 PM</text></g>
      <g transform="translate(960 880) rotate(-6)" opacity={ramp(t, T('never sent'), T('never sent') + 0.15)}><rect x={-300} y={-70} width={600} height={140} rx={16} fill="none" stroke="#ff4a5e" strokeWidth={14} /><Txt x={0} y={30} s={96} c="#ff4a5e" ls={4}>NEVER SENT</Txt></g>
    </EmailUI>)},
  {at: T('jake never said no'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_FIRST} glow="#ff6a6a" />},
  {at: T('first lie'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_LIE} glow="#ffd23f" />},
];

export const POPS_1: TW[] = [
  {at: T('same ceiling'), dur: 1.8, text: 'SAME CEILING. SAME CRACK.', accent: 1, mode: 'pop'},
  {at: T('sam reads it twice') + 0.3, dur: 1.2, text: 'READS IT TWICE.', accent: 1, mode: 'pop'},
  {at: T('sends it'), dur: 1.2, text: 'SENDS IT.', accent: 0, mode: 'slam'},
];
export const BUBBLES_1 = [
  {from: T('just go for it'), to: TE('just go for it') + 0.5, text: 'Just go for it.', x: 880, y: 300},
];
export const CUES_1: Cue3[] = [
  {file: 'clock_tick', at: 0.2, dur: 6, vol: 0.14, loop: true}, {file: 'heartbeat', at: T('that voice hits'), dur: 12, vol: 0.1, loop: true},
  {file: 'phone_notif', at: T('email goes round'), vol: 0.2}, {file: 'phone_tap', at: T('he opens a reply anyway'), dur: 2, vol: 0.1, loop: true}, {file: 'phone_unlock', at: T('sends it'), vol: 0.2},
  ...[T('what if im not good'), T('what if my manager'), T('what if i get it'), T('what if everyone finds out')].map((at): Cue3 => ({file: 'glitch_hit', at, vol: 0.12})),
  ...[T('same office'), T('same salary'), T('same small apartment'), T('same tired eyes'), T('same email'), T('same girl'), T('same idea')].map((at): Cue3 => ({file: 'kw_pop', at: at + 0.05, vol: 0.14})),
  {file: 'stamp_hit', at: T('never sent'), vol: 0.24}, {file: 'terminal_type', at: T('writes a paragraph'), dur: 1.4, vol: 0.1},
  ...BEATS1.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS1.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
export const B1 = BEATS1;
void BeatsG;
