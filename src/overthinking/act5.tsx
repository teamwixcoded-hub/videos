import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {InsertBG} from '../same2d/inserts';
import {INK} from '../winter/Hero';
import {T, TE} from './timeline';
import {Beats, Beat} from '../winter/scenes2';
import {BeatsG} from '../winter/act5';
import type {Shot4} from '../winter/act4';
import {OSolo, OPair, Fig, Ceiling, CardRow, EmailUI, Chip, Pill, Txt, Frame, OfficeBG, RoomArt} from './scenes';

// ============================================================================================
// OVERTHINKING, act 5 (536 to the end): one year later, Sam's one rule, Jake's bakery email, "ready comes after you start", which one are you?
// ============================================================================================
const B_YEAR: Beat[] = [
  {text: 'ONE YEAR LATER.', at: T('one year later'), s: 130, y: 420, c: '#ffd23f'},
  {text: 'SAME BUILDING. DIFFERENT LIVES.', at: T('same building different lives'), s: 84, y: 620},
];
const B_RULE: Beat[] = [
  {text: 'ONE RULE.', at: T('one rule now'), s: 110, y: 200, c: '#ffd23f'},
  {text: 'IF IT CAN BE UNDONE: DECIDE FAST.', at: T('if it can be undone decide fast'), s: 80, y: 400, c: '#3ddc84'},
  {text: "IF IT CAN'T: TAKE ONE DAY. NEVER MORE.", at: T('if it cant take one day'), s: 74, y: 580, c: '#6fa0ff'},
  {text: 'AND ALMOST EVERYTHING CAN BE UNDONE.', at: T('and almost everything can be undone'), s: 66, y: 780, c: '#ffd23f'},
];
const B_SENT: Beat[] = [
  {text: 'SAME THOUGHTS. NEW SENTENCE.', at: T('same thoughts new sentence'), s: 84, y: 250},
  {text: 'NOT: "WHAT IF I FAIL?"', at: T('what if i fail'), to: T('what if i had tried'), s: 84, y: 450, strike: TE('what if i fail') + 0.4},
  {text: 'WORSE: "WHAT IF I HAD TRIED?"', at: T('what if i had tried'), s: 90, y: 640, c: '#ff6a6a'},
  {text: 'THAT QUESTION HURTS MORE THAN ANY FAILURE.', at: T('that question hurts more'), s: 56, y: 840, c: '#ff9a6a'},
];
const B_NOTPERF: Beat[] = [{text: "NOT PERFECT. DOESN'T NEED TO BE.", at: T('not perfect doesnt need to be'), s: 70, y: 540, c: '#ffd23f'}];
const B_READY: Beat[] = [
  {text: "YOU'LL NEVER THINK YOUR WAY INTO FEELING READY.", at: T('youll never think your way'), s: 50, y: 330, c: '#ff9a6a'},
  {text: 'READY COMES AFTER YOU START. NOT BEFORE.', at: T('ready comes after you start'), s: 56, y: 540, c: '#3ddc84'},
  {text: 'IT ALWAYS HAS.', at: T('it always has'), s: 120, y: 760},
];
const B_YES: Beat[] = [
  {text: 'IF YES: DECIDE TODAY.', at: T('if yes decide today'), s: 96, y: 330, c: '#3ddc84'},
  {text: 'DECIDE FAST.', at: T('decide fast decide ugly'), to: T('decide ugly'), s: 130, y: 540},
  {text: 'DECIDE UGLY.', at: T('decide ugly'), s: 150, y: 740, c: '#ffd23f'},
];
const BEATS5 = [B_YEAR, B_RULE, B_SENT, B_NOTPERF, B_READY, B_YES];

const Clients: React.FC<{t: number}> = ({t}) => {
  const a = T('11 paying clients'), n = Math.round(11 * ramp(t, a, a + 1.6));
  return (
    <InsertBG glow="#3ddc84">
      {Array.from({length: 11}, (_, i) => { const k = ramp(t, a + i * 0.14, a + i * 0.14 + 0.25), x = 330 + (i % 4) * 420, y = 330 + Math.floor(i / 4) * 230; return (
        <g key={i} opacity={k} transform={`translate(${x} ${y + (1 - k) * 30}) scale(0.62)`}><rect x={-130} y={-30} width={260} height={140} fill="#f0d6a0" stroke={INK} strokeWidth={10} /><path d="M -150,-30 L -110,-110 L 110,-110 L 150,-30 Z" fill={['#d9534f', '#3b8d6b', '#3b6fd8', '#d84f8a'][i % 4]} stroke={INK} strokeWidth={10} strokeLinejoin="round" /><rect x={-30} y={20} width={60} height={90} fill="#6a4a3a" stroke={INK} strokeWidth={7} /><circle cx={104} cy={-92} r={30} fill="#3ddc84" stroke={INK} strokeWidth={7} /></g>); })}
      <Txt x={960} y={150} s={100} c="#3ddc84">{n} PAYING CLIENTS</Txt><Txt x={960} y={990} s={64} c="#cfe2ff" o={ramp(t, T('on weekends', 1), T('on weekends', 1) + 0.3)}>ON WEEKENDS.</Txt>
    </InsertBG>
  );
};
const Bakery: React.FC<{t: number}> = ({t}) => {
  const a = T('he opens a new message');
  return (
    <EmailUI t={t} to="To: Bakery" subject="Simple websites" version="NEW MESSAGE" sendAt={T('he hits send', 1)} hit={T('he hits send', 1)} stamp="SENT" glow="#3ddc84"
      lines={[{text: 'Hi, I build simple websites.', at: T('hi i build simple'), dur: 1.4}, {text: "I'd love to build yours.", at: T('id love to build yours'), dur: 1.2}, {text: "First one's free.", at: T('first ones free'), dur: 1.0}]}>
      <Chip x={470} y={985} s={38} text="WAIT TILL TOMORROW" c="#6b4fc4" o={ramp(t, T('wait till tomorrow'), T('wait till tomorrow') + 0.2) * (1 - ramp(t, T('he hits send', 1), T('he hits send', 1) + 0.2))} />
      <Chip x={960} y={985} s={38} text="TILL HE'S READY" c="#3b6fd8" o={ramp(t, T('till hes ready'), T('till hes ready') + 0.2) * (1 - ramp(t, T('he hits send', 1), T('he hits send', 1) + 0.2))} />
      <Chip x={1450} y={985} s={38} text="TILL IT'S PERFECT" c="#d84f8a" o={ramp(t, T('till its perfect'), T('till its perfect') + 0.2) * (1 - ramp(t, T('he hits send', 1), T('he hits send', 1) + 0.2))} />
      <g opacity={ramp(t, a, a + 0.3)} transform="translate(960 110)"><Txt x={0} y={0} s={52} c="#ffd23f">A BAKERY NEAR HIS APARTMENT</Txt></g>
    </EmailUI>
  );
};
const Question: React.FC<{t: number}> = ({t}) => {
  const a = T('can this be undone'), k = ramp(t, a, a + 0.4), pulse = 1 + 0.03 * Math.sin(t * 5);
  return (
    <InsertBG glow="#ffd23f">
      <Txt x={960} y={250} s={64} c="#8c96c8" o={ramp(t, T('so next time your head'), T('so next time your head') + 0.3)}>NEXT TIME YOUR HEAD SPINS, ASK ONE THING:</Txt>
      <g transform={`translate(960 600) scale(${(0.8 + 0.2 * k) * pulse})`} opacity={k}><Txt x={0} y={-40} s={190} c="#ffd23f">CAN THIS</Txt><Txt x={0} y={150} s={190} c="#ffd23f">BE UNDONE?</Txt></g>
    </InsertBG>
  );
};
const Actions: React.FC<{t: number}> = ({t}) => {
  const items: [string, number, string][] = [['SEND THE EMAIL', T('send the email say hi'), '#3b6fd8'], ['SAY HI', T('say hi'), '#d84f8a'], ['BUILD THE UGLY FIRST VERSION', T('build the ugly first version'), '#ffd23f'], ['MESSAGE THE ONE SHOP', T('message the one shop'), '#3ddc84'], ['TAKE THE 10-MINUTE WALK', T('take the 10minute walk'), '#6fd0ff']];
  return (
    <InsertBG glow="#3ddc84">
      {items.map(([l, at, c], i) => { const k = ramp(t, at, at + 0.25); return <g key={l} opacity={k} transform={`translate(960 ${220 + i * 160 + (1 - k) * 24})`}><rect x={-560} y={-62} width={1120} height={124} rx={62} fill="#1d2248" stroke={c} strokeWidth={8} /><circle cx={-480} cy={0} r={34} fill={c} stroke={INK} strokeWidth={6} /><path d="M -496,2 L -484,16 L -460,-14" stroke="#fff" strokeWidth={10} strokeLinecap="round" fill="none" /><Txt x={-410} y={20} s={46} anchor="start">{l}</Txt></g>; })}
    </InsertBG>
  );
};

export const SHOTS_5: Shot4[] = [
  {at: T('one year later'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_YEAR} glow="#ffd23f" />},
  {at: T('sam leads a small team'), cam: [960, 800, 1.1], node: (t) => (
    <Frame><OfficeBG />
      <Fig t={t} x={520} m={{who: 'friend', scale: 0.86, y: 1040, mood: 'happy', id: 'tl1'}} /><Fig t={t} x={1400} m={{who: 'cousin', scale: 0.86, y: 1040, mood: 'happy', id: 'tl2'}} /><Fig t={t} x={1700} m={{who: 'sarah', scale: 0.86, y: 1040, mood: 'happy', id: 'tl3'}} /><Fig t={t} x={960} m={{who: 'sam', scale: 1.05, y: 1050, mood: 'happy', muscle: 0.1, id: 'tls'}} />
      <Pill x={960} y={95} text="TEAM LEAD" c="#3ddc84" o={ramp(t, T('sam leads a small team'), T('sam leads a small team') + 0.3)} /><Pill x={1700} y={150} text="SARAH" c="#d84f8a" o={ramp(t, T('still with sarah'), T('still with sarah') + 0.3)} />
    </Frame>)},
  {at: T('11 paying clients'), cam: [960, 540, 1.04], node: (t) => <Clients t={t} />},
  {at: T('still nervous before'), cam: [960, 780, 1.1], node: (t) => <OSolo t={t} bg="office" m={{who: 'sam', mood: 'shock', muscle: 0.1, pose: {arm: [40 + Math.sin(t * 34) * 5, 150], hand: 'open'}}}><Chip x={560} y={90} text="HANDS STILL COLD" c="#3b6fd8" o={ramp(t, T('hands still cold'), T('hands still cold') + 0.2)} /><Chip x={1360} y={90} text="STOMACH STILL DROPS" c="#ff6a6a" o={ramp(t, T('stomach still drops'), T('stomach still drops') + 0.2)} /></OSolo>},
  {at: T('one rule now'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_RULE} glow="#ffd23f" />},
  {at: T('an email can be rewritten'), cam: [960, 520, 1.05], node: (t) => <CardRow t={t} glow="#3ddc84" cards={[{label: 'EMAIL: REWRITE IT', at: T('an email can be rewritten'), icon: 'mail', c: '#cfe2ff'}, {label: 'HELLO: AWKWARD IS FINE', at: T('a hello can be awkward'), icon: 'girl', c: '#ffb0d0'}, {label: 'WEBSITE: FIX IT', at: T('a website can be fixed'), icon: 'laptop', c: '#3ddc84'}]} />},
  {at: T('jake is still at'), cam: [960, 780, 1.08], node: (t) => <OSolo t={t} bg="office" m={{who: 'jake', mood: 'sad', look: [0.7, 0.2]}}><Chip x={960} y={70} text="THE OLD DESK" c="#6b4fc4" o={ramp(t, T('jake is still at'), T('jake is still at') + 0.3)} /></OSolo>},
  {at: T('same thoughts new sentence'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_SENT} glow="#ff6a6a" />},
  {at: T('that night 200 am again'), cam: [1100, 500, 1.05], node: (t) => <Ceiling t={t} words={['WHAT IF I HAD TRIED?', 'WHAT IF?', 'A YEAR OLD']} />},
  {at: T('he opens drafts'), cam: [960, 540, 1.04], node: (t) => <EmailUI t={t} subject="(no subject)" version="VERSION 11 · A YEAR OLD" glow="#ff6a6a" lines={[{text: 'Hi, I would like to apply for the role', at: -1, dur: 0.01, c: '#8a8fb0', del: T('just deletes it')}, {text: 'because I believe I could really grow here.', at: -1, dur: 0.01, c: '#8a8fb0', del: T('just deletes it') + 0.15}]}><Txt x={960} y={990} s={64} c="#cfe2ff" o={ramp(t, T('he doesnt read it'), T('he doesnt read it') + 0.3)}>DOESN'T READ IT. DOESN'T EDIT IT.</Txt></EmailUI>},
  {at: T('he opens a new message'), cam: [960, 540, 1.04], node: (t) => <Bakery t={t} />},
  {at: T('not perfect doesnt need to be'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_NOTPERF} glow="#ffd23f" />},
  {at: T('youll never think your way'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_READY} glow="#3ddc84" />},
  {at: T('so next time your head'), cam: [960, 540, 1.05], node: (t) => <Question t={t} />},
  {at: T('if yes decide today'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_YES} glow="#3ddc84" />},
  {at: T('send the email say hi'), cam: [960, 540, 1.04], node: (t) => <Actions t={t} />},
  {at: T('one year from now', 1), cam: [960, 840, 1.08], node: (t) => <OPair t={t} left={{who: 'sam', mood: 'happy', muscle: 0.1}} right={{who: 'jake', mood: 'sad', fat: 0.5}}><Pill x={560} y={60} text="SAM" c="#e9962c" /><Pill x={1360} y={60} text="JAKE" c="#6b4fc4" /></OPair>},
  {at: T('both were scared'), cam: [960, 520, 1.05], node: (t) => <CardRow t={t} glow="#ffd23f" cards={[{label: 'THE EMAIL', at: T('both got the same three'), icon: 'mail', c: '#cfe2ff'}, {label: 'THE GIRL', at: T('both got the same three') + 0.3, icon: 'girl', c: '#ffb0d0'}, {label: 'THE IDEA', at: T('both got the same three') + 0.6, icon: 'bulb', c: '#ffd23f'}]}><Txt x={960} y={130} s={80} c="#fff" o={ramp(t, T('both were scared'), T('both were scared') + 0.3)}>BOTH WERE SCARED.</Txt></CardRow>},
  {at: T('both lay awake'), cam: [1100, 500, 1.05], node: (t) => <Ceiling t={t} />},
  {at: T('only one stopped thinking'), cam: [960, 840, 1.08], node: (t) => <OPair t={t} left={{who: 'sam', mood: 'happy', muscle: 0.1}} right={{who: 'jake', mood: 'sad'}}><Chip x={560} y={80} s={40} text="TOOK THEM" c="#3ddc84" o={ramp(t, T('only one stopped thinking'), T('only one stopped thinking') + 0.3)} /><Chip x={1360} y={80} s={40} text="THOUGHT ABOUT THEM" c="#ff9a6a" o={ramp(t, TE('long enough'), TE('long enough') + 0.3)} /></OPair>},
  {at: T('tonight when it starts'), cam: [1100, 500, 1.06], node: (t) => <Ceiling t={t} words={['WHAT IF?', 'SHOULD I?', 'WHAT IF I DON’T?', 'IF ONLY']} />},
  {at: T('which one are you'), cam: [960, 840, 1.06], node: (t) => <OPair t={t} dawn={0.1} left={{who: 'sam', mood: 'determined', muscle: 0.1}} right={{who: 'jake', mood: 'tired'}}><Pill x={560} y={60} text="SAM" c="#e9962c" /><Pill x={1360} y={60} text="JAKE" c="#6b4fc4" /></OPair>},
];

export const POPS_5: TW[] = [
  {at: T('which one are you'), dur: 3.8, text: 'WHICH ONE ARE YOU?', accent: 1, mode: 'slam'},
];
export const BUBBLES_5: {from: number; to: number; text: string; x: number; y: number}[] = [];
export const CUES_5: Cue3[] = [
  {file: 'clock_tick', at: T('that night 200 am again'), dur: 4, vol: 0.14, loop: true}, {file: 'heartbeat', at: T('finger hovers'), dur: 6, vol: 0.12, loop: true}, {file: 'phone_unlock', at: T('he hits send', 1), vol: 0.22}, {file: 'shimmer', at: T('he hits send', 1) + 0.1, vol: 0.18},
  {file: 'terminal_type', at: T('hi i build simple'), dur: 3, vol: 0.1}, {file: 'stamp_hit', at: T('just deletes it'), vol: 0.2},
  ...Array.from({length: 11}, (_, i): Cue3 => ({file: 'counter_tick', at: T('11 paying clients') + i * 0.14, vol: 0.1})),
  ...[T('an email can be rewritten'), T('a hello can be awkward'), T('a website can be fixed')].map((at): Cue3 => ({file: 'kw_pop', at: at + 0.05, vol: 0.14})),
  ...[T('send the email say hi'), T('say hi'), T('build the ugly first version'), T('message the one shop'), T('take the 10minute walk')].map((at): Cue3 => ({file: 'pill_pop', at: at + 0.05, vol: 0.14})),
  {file: 'title_hit', at: T('can this be undone'), vol: 0.22}, {file: 'text_slam', at: T('which one are you'), vol: 0.26},
  ...BEATS5.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS5.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
void [BeatsG, RoomArt];
