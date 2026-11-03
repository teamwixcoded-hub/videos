import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {InsertBG} from '../same2d/inserts';
import {INK} from '../winter/Hero';
import {T, TE} from './timeline';
import {Beats, Beat, BedSolo} from '../winter/scenes2';
import {BeatsG} from '../winter/act5';
import type {Shot4} from '../winter/act4';
import {OSolo, OPair, Ceiling, Chip, Pill, Txt, Frame, Fig, RoomArt} from './scenes';

// ============================================================================================
// OVERTHINKING, act 4 (435 to 536 s): Sam's three moves (paper, worry time, a smaller step), Jake never tried them, what overthinking costs.
// ============================================================================================
const B_SPIN: Beat[] = [
  {text: "SAM ISN'T FEARLESS.", at: T('sam isnt fearless'), s: 120, y: 400},
  {text: 'HIS HEAD SPINS TOO.', at: T('his head spins too'), s: 120, y: 600, c: '#ff9a6a'},
];
const B_FOG: Beat[] = [
  {text: "YOU CAN'T FIGHT FOG.", at: T('you cant fight fog'), to: T('you can fight a sentence'), s: 120, y: 440, c: '#8c96c8'},
  {text: 'YOU CAN FIGHT A SENTENCE.', at: T('you can fight a sentence'), s: 110, y: 560, c: '#3ddc84'},
];
const B_BIG: Beat[] = [
  {text: 'OVERTHINKING LOVES BIG AND VAGUE.', at: T('overthinking loves big'), s: 80, y: 420},
  {text: 'A TINY STEP GIVES IT NOTHING TO GRAB.', at: T('a tiny step'), s: 74, y: 640, c: '#3ddc84'},
];
const B_NEVER: Beat[] = [
  {text: 'JAKE NEVER TRIED ANY OF IT.', at: T('jake never tried any of it'), s: 90, y: 200},
  {text: "NOT BECAUSE IT WOULDN'T WORK.", at: T('not because it wouldnt work'), s: 70, y: 340, strike: TE('wouldnt work')},
  {text: 'TOO BUSY THINKING ABOUT WHETHER IT WOULD.', at: T('because he was too busy'), s: 56, y: 460, c: '#ff9a6a'},
];
const B_STEAL: Beat[] = [
  {text: 'OVERTHINKING DOESN’T JUST STEAL CHANCES.', at: T('doesnt just steal chances'), s: 64, y: 300},
  {text: 'IT STEALS SLEEP.', at: T('steals sleep'), s: 100, y: 450, c: '#8c96c8'},
  {text: 'THEN THE ENERGY FOR THE NEXT CHANCE.', at: T('steals the energy'), s: 64, y: 580, c: '#ff9a6a'},
  {text: 'THEN YOU MISS THAT ONE TOO.', at: T('then you miss that one'), s: 72, y: 700, c: '#ff6a6a'},
  {text: 'THEN YOU CALL YOURSELF LAZY.', at: T('then you call yourself lazy'), s: 72, y: 820},
];
const B_LAZY: Beat[] = [
  {text: "YOU'RE NOT LAZY.", at: T('youre not lazy'), s: 150, y: 400, c: '#3ddc84'},
  {text: "YOU'RE EXHAUSTED FROM FIGHTING GHOSTS ALL NIGHT.", at: T('exhausted from fighting'), s: 48, y: 620},
];
const BEATS4 = [B_SPIN, B_FOG, B_BIG, B_NEVER, B_STEAL, B_LAZY];

const Monster: React.FC<{x: number; y: number; k: number; blush?: number}> = ({x, y, k, blush = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M -150,60 C -190,-80 -110,-180 0,-180 C 110,-180 190,-80 150,60 C 120,110 60,90 0,120 C -60,90 -120,110 -150,60 Z" fill="#6b4fc4" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <circle cx={-52} cy={-50} r={34} fill="#fff" stroke={INK} strokeWidth={7} /><circle cx={52} cy={-50} r={34} fill="#fff" stroke={INK} strokeWidth={7} /><circle cx={-46} cy={-44} r={14} fill={INK} /><circle cx={58} cy={-44} r={14} fill={INK} />
    <path d="M -80,-110 L -30,-86 M 80,-110 L 30,-86" stroke={INK} strokeWidth={10} strokeLinecap="round" /><path d="M -60,30 Q 0,70 60,30" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />
    <ellipse cx={-98} cy={10} rx={26} ry={14} fill="#ff7a9a" opacity={blush * 0.8} /><ellipse cx={98} cy={10} rx={26} ry={14} fill="#ff7a9a" opacity={blush * 0.8} />
  </g>
);
const Paper: React.FC<{t: number}> = ({t}) => {
  const a = T('when thoughts loop'), q = [T('what if she says no'), T('what if i look stupid'), T('what if they laugh')], mon = T('a monster becomes'), small = T('once its on paper');
  const k = mon > 0 ? ramp(t, small, small + 1.6) : 0;
  return (
    <InsertBG glow="#8a6fb8">
      <g transform={`translate(620 ${540 + (1 - ramp(t, a, a + 0.4)) * 60}) rotate(-2)`} opacity={ramp(t, a, a + 0.4)}>
        <rect x={-380} y={-440} width={760} height={880} rx={20} fill="#f8f1dc" stroke={INK} strokeWidth={10} />{Array.from({length: 10}, (_, i) => <path key={i} d={`M -340,${-340 + i * 80} L 340,${-340 + i * 80}`} stroke="#b8d0f0" strokeWidth={4} />)}
        {['WHAT IF SHE SAYS NO?', 'WHAT IF I LOOK STUPID?', 'WHAT IF THEY LAUGH?'].map((l, i) => <Txt key={l} x={-330} y={-270 + i * 150} s={50} anchor="start" c="#2a2f6a" o={ramp(t, q[i], q[i] + 0.3)}>{l}</Txt>)}
      </g>
      <g opacity={ramp(t, mon, mon + 0.4)}><Monster x={1380} y={470} k={1.8 - 1.3 * k} blush={k} /></g>
      <Txt x={1380} y={900} s={64} c="#ffd23f" o={ramp(t, mon, mon + 0.3)}>{k > 0.5 ? 'ONE SENTENCE.' : 'A MONSTER.'}</Txt>
    </InsertBG>
  );
};
const Moves: React.FC<{t: number}> = ({t}) => {
  const a = T('three moves');
  return (
    <InsertBG glow="#3ddc84">
      {[['1', 'PUT IT ON PAPER', 'phone'], ['2', 'GIVE WORRY A TIME', 'clock'], ['3', 'SHRINK THE STEP', 'steps']].map(([n, l], i) => { const k = ramp(t, a + 0.2 + i * 0.5, a + 0.5 + i * 0.5); return (
        <g key={n} opacity={k} transform={`translate(${360 + i * 600} ${520 + (1 - k) * 50})`}>
          <rect x={-250} y={-290} width={500} height={580} rx={40} fill="#1d2248" stroke={INK} strokeWidth={9} /><circle cy={-150} r={90} fill="#3ddc84" stroke={INK} strokeWidth={8} /><Txt x={0} y={-118} s={110}>{n}</Txt><Txt x={0} y={90} s={46}>{l}</Txt>
        </g>); })}
      <Txt x={960} y={140} s={90} c="#ffd23f" o={ramp(t, a, a + 0.3)}>3 MOVES THAT PULL HIM OUT.</Txt>
    </InsertBG>
  );
};
const WorryTime: React.FC<{t: number}> = ({t}) => {
  const a = T('he gives worry a time'), k = ramp(t, a, a + 0.4);
  return (
    <InsertBG glow="#6fa0ff">
      <g transform={`translate(560 ${540 + (1 - k) * 50})`} opacity={k}><circle r={260} fill="#e9efff" stroke={INK} strokeWidth={12} /><circle r={226} fill="#fff" />{Array.from({length: 12}, (_, i) => <path key={i} d="M 0,-210 L 0,-186" stroke={INK} strokeWidth={i % 3 ? 6 : 12} transform={`rotate(${i * 30})`} />)}<path d="M 0,0 L 0,-130" stroke={INK} strokeWidth={16} strokeLinecap="round" transform="rotate(180)" /><path d="M 0,0 L 0,-170" stroke={INK} strokeWidth={10} strokeLinecap="round" /><circle r={16} fill={INK} /><Txt x={0} y={400} s={90} c="#ffd23f">6:00 PM</Txt></g>
      <g opacity={ramp(t, T('15 minutes'), T('15 minutes') + 0.3)}><RingFifteen t={t} a={T('15 minutes')} /></g>
    </InsertBG>
  );
};
const RingFifteen: React.FC<{t: number; a: number}> = ({t, a}) => { const n = Math.round(15 * ramp(t, a, a + 1.2)), c = 2 * Math.PI * 180; return <g transform="translate(1360 540)"><circle r={180} fill="none" stroke="#2a2f6a" strokeWidth={40} /><circle r={180} fill="none" stroke="#3ddc84" strokeWidth={40} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - n / 15)} transform="rotate(-90)" /><Txt x={0} y={30} s={110} font="Chakra Petch">{n}</Txt><Txt x={0} y={90} s={36} c="#3ddc84">MIN</Txt></g>; };
const Knock: React.FC<{t: number}> = ({t}) => (
  <Frame>
    <RoomArt t={t} dawn={0} />
    <rect x={1440} y={230} width={340} height={620} rx={14} fill="#6a4a3a" stroke={INK} strokeWidth={10} /><circle cx={1500} cy={560} r={16} fill="#ffd23f" stroke={INK} strokeWidth={5} />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${1400 - i * 30},${470 + i * 30} q -24,-30 0,-60`} stroke="#ffd23f" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 9 + i))} />)}
    <Chip x={1610} y={170} text="PANIC" c="#ff4a5e" o={ramp(t, T('if panic knocks'), T('if panic knocks') + 0.2)} />
    <Fig t={t} m={{who: 'sam', mood: 'neutral', x: 700, id: 'kn', open: t > T('not now') && t < TE('see you then') ? 0.25 + 0.45 * Math.abs(Math.sin(t * 13)) : 0, pose: {arm: [-10, 120], hand: 'open'}}} x={700} />
  </Frame>
);
const Meeting0: React.FC<{t: number}> = ({t}) => {
  const a = T('most worries never show up');
  return (
    <InsertBG glow="#8a6fb8">
      <g transform="translate(960 560)">
        <rect x={-560} y={20} width={1120} height={60} rx={14} fill="#6a4a3a" stroke={INK} strokeWidth={9} />
        {[-420, -140, 140, 420].map((x, i) => <g key={i} transform={`translate(${x} 20)`}><rect x={-64} y={-130} width={128} height={140} rx={24} fill="#3a3f78" stroke={INK} strokeWidth={8} opacity={0.9} /><rect x={-70} y={10} width={140} height={34} rx={10} fill="#2a2f66" stroke={INK} strokeWidth={6} /></g>)}
        <Monster x={-420} y={-250} k={0} /><Txt x={0} y={-330} s={80} c="#ffd23f" o={ramp(t, a, a + 0.3)}>6:00 PM · WORRY MEETING</Txt>
        <Txt x={0} y={260} s={110} c="#3ddc84" o={ramp(t, a + 0.6, a + 1.0)}>WORRIES SHOWED UP: 0</Txt>
      </g>
    </InsertBG>
  );
};
const Shrink: React.FC<{t: number}> = ({t}) => {
  const rows: [string, string, number][] = [['START A BUSINESS', 'MESSAGE ONE SHOP', T('not start a business')], ['FIX MY LIFE', 'SEND ONE EMAIL', T('not fix my life')], ['GET IN SHAPE', 'WALK 10 MINUTES', T('not get in shape')]];
  return (
    <InsertBG glow="#3ddc84">
      {rows.map(([big, small, at], i) => { const k = ramp(t, at, at + 0.3), s2 = ramp(t, at + 1.1, at + 1.4); return (
        <g key={big} opacity={k} transform={`translate(0 ${420 + i * 230})`}>
          <Txt x={560} y={0} s={86}>{big}</Txt><path d="M 160,-28 L 960,-28" stroke="#ff4a5e" strokeWidth={14} strokeLinecap="round" strokeDasharray={800} strokeDashoffset={800 * (1 - ramp(t, at + 0.6, at + 1.0))} />
          <g opacity={s2}><Txt x={1000} y={0} s={60} anchor="start">→</Txt><Txt x={1400} y={0} s={66} c="#3ddc84">{small}</Txt></g>
        </g>); })}
    </InsertBG>
  );
};
const Loop: React.FC<{t: number}> = ({t}) => {
  const a = T('thinking about the thinking'), b = T('stuck in a loop');
  return (
    <InsertBG glow="#ff6a6a">
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(960 600) rotate(${(t - a) * (60 - i * 18) * (i % 2 ? -1 : 1)})`} opacity={ramp(t, a + i * 0.4, a + i * 0.4 + 0.3)}><circle r={130 + i * 110} fill="none" stroke={['#ff6a6a', '#ffd23f', '#8a6fb8'][i]} strokeWidth={14} strokeDasharray="70 40" /><path d={`M ${130 + i * 110},0 l -30,-26 l 0,52 Z`} fill={['#ff6a6a', '#ffd23f', '#8a6fb8'][i]} /></g>)}
      <Txt x={960} y={620} s={64} c="#fff" o={ramp(t, a, a + 0.3)}>THINKING ABOUT THE THINKING</Txt><Txt x={960} y={900} s={56} c="#ffd23f" o={ramp(t, b, b + 0.3)}>A LOOP ABOUT THE LOOP.</Txt>
    </InsertBG>
  );
};
const Ghosts: React.FC<{t: number}> = ({t}) => {
  const a = T('arguing with people');
  return (
    <BedSolo t={t} who="jake" eyes="open" mood="sad">
      {[0, 1, 2].map((i) => <g key={i} opacity={ramp(t, a + i * 0.3, a + i * 0.3 + 0.4) * (0.35 + 0.15 * Math.sin(t * 3 + i))} transform={`translate(${1000 + i * 260} ${420 + Math.sin(t * 2 + i) * 20})`}><path d="M -70,70 L -70,-20 A 70 80 0 0 1 70,-20 L 70,70 L 40,40 L 10,70 L -20,40 L -50,70 Z" fill="#cfd6ff" stroke="#8a7fd8" strokeWidth={6} /><circle cx={-24} cy={-14} r={10} fill={INK} /><circle cx={24} cy={-14} r={10} fill={INK} /></g>)}
    </BedSolo>
  );
};
const Cycle: React.FC<{t: number}> = ({t}) => {
  const nodes: [string, number][] = [['SKIPPED CHANCE', T('every chance he skipped')], ['2 AM REPLAY', T('replaying talks')], ['NO SLEEP', T('steals sleep')], ['NO ENERGY', T('steals the energy')]];
  return (
    <InsertBG glow="#ff6a6a">
      <g transform="translate(960 540)">
        {nodes.map(([l, at], i) => { const ang = -Math.PI / 2 + i * (Math.PI / 2), x = Math.cos(ang) * 400, y = Math.sin(ang) * 300, k = ramp(t, at, at + 0.3); return <g key={l} opacity={k} transform={`translate(${x} ${y})`}><rect x={-190} y={-60} width={380} height={120} rx={36} fill="#1d2248" stroke="#ff6a6a" strokeWidth={8} /><Txt x={0} y={14} s={44}>{l}</Txt></g>; })}
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${Math.cos(-Math.PI / 2 + i * Math.PI / 2 + 0.5) * 380},${Math.sin(-Math.PI / 2 + i * Math.PI / 2 + 0.5) * 285} A 400 300 0 0 1 ${Math.cos(-Math.PI / 2 + (i + 1) * Math.PI / 2 - 0.5) * 380},${Math.sin(-Math.PI / 2 + (i + 1) * Math.PI / 2 - 0.5) * 285}`} stroke="#ff6a6a" strokeWidth={9} fill="none" strokeLinecap="round" opacity={ramp(t, nodes[(i + 1) % 4][1], nodes[(i + 1) % 4][1] + 0.3) * 0.8} />)}
        <Txt x={0} y={14} s={60} c="#ff9a6a" o={ramp(t, T('then you miss that one'), T('then you miss that one') + 0.3)}>MISS THE NEXT ONE TOO.</Txt>
      </g>
    </InsertBG>
  );
};

export const SHOTS_4: Shot4[] = [
  {at: T('sam isnt fearless'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_SPIN} glow="#8a6fb8" />},
  {at: T('at 200 am he spirals'), cam: [1100, 500, 1.05], node: (t) => <Ceiling t={t} words={['WHAT IF SHE SAYS NO?', 'WHAT IF I LOOK STUPID?', 'WHAT IF?', 'SPIRAL']} />},
  {at: T('three moves'), cam: [960, 540, 1.04], node: (t) => <Moves t={t} />},
  {at: T('when thoughts loop'), cam: [960, 540, 1.04], node: (t) => <Paper t={t} />},
  {at: T('you cant fight fog'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_FOG} glow="#3ddc84" />},
  {at: T('he gives worry a time'), cam: [960, 540, 1.04], node: (t) => <WorryTime t={t} />},
  {at: T('if panic knocks'), cam: [960, 780, 1.1], node: (t) => <Knock t={t} />},
  {at: T('most worries never show up'), cam: [960, 540, 1.04], node: (t) => <Meeting0 t={t} />},
  {at: T('not start a business'), cam: [960, 540, 1.04], node: (t) => <Shrink t={t} />},
  {at: T('overthinking loves big'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_BIG} glow="#3ddc84" />},
  {at: T('jake never tried any of it'), cam: [960, 780, 1.08], node: (t) => <OSolo t={t} m={{who: 'jake', mood: 'sad', look: [-0.8, 0.2], x: 1580}}><BeatsG t={t} beats={[{...B_NEVER[0], s: 54, y: 380}, {...B_NEVER[1], s: 44, y: 500}, {...B_NEVER[2], s: 40, y: 600}]} /></OSolo>},
  {at: T('thinking about the thinking'), cam: [960, 540, 1.04], node: (t) => <Loop t={t} />},
  {at: T('it cost him nights'), cam: [960, 700, 1.08], node: (t) => <BedSolo t={t} who="jake" eyes="open" mood="sad"><Txt x={960} y={170} s={110} c="#ff9a6a" o={ramp(t, T('it cost him nights'), T('it cost him nights') + 0.3)}>IT COST HIM NIGHTS.</Txt></BedSolo>},
  {at: T('replaying talks'), cam: [960, 540, 1.04], node: (t) => <Cycle t={t} />},
  {at: T('arguing with people'), cam: [960, 700, 1.08], node: (t) => <Ghosts t={t} />},
  {at: T('tired at work'), cam: [960, 780, 1.08], node: (t) => <OSolo t={t} bg="office" m={{who: 'jake', mood: 'tired', pose: 'slump'}}><Chip x={420} y={70} text="TIRED AT WORK" c="#6b4fc4" o={ramp(t, T('tired at work'), T('tired at work') + 0.2)} /><Chip x={1500} y={70} text="TIRED WITH FRIENDS" c="#3b6fd8" o={ramp(t, T('tired with friends'), T('tired with friends') + 0.2)} /><Chip x={960} y={70} text="TIRED OF HIS OWN HEAD" c="#d84f8a" o={ramp(t, T('tired of his own head'), T('tired of his own head') + 0.2)} /></OSolo>},
  {at: T('snapping at his mom'), cam: [960, 780, 1.08], node: (t) => <OPair t={t} left={{who: 'jake', mood: 'shock', open: 0.3 + 0.5 * Math.abs(Math.sin(t * 12)), pose: {arm: [50, 130], hand: 'open'}}} right={{who: 'sarah', mood: 'sad'}}><Pill x={1360} y={60} text="MOM" c="#d84f8a" /><Txt x={960} y={990} s={64} c="#ff6a6a" o={ramp(t, T('hating himself'), T('hating himself') + 0.3)}>THEN HATING HIMSELF.</Txt></OPair>},
  {at: T('doesnt just steal chances'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_STEAL} glow="#ff6a6a" />},
  {at: T('youre not lazy'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_LAZY} glow="#3ddc84" />},
];

export const POPS_4: TW[] = [];
export const BUBBLES_4 = [
  {from: T('not now'), to: TE('see you then') + 0.6, text: "Not now. 6:00 p.m., I'll see you then.", x: 360, y: 90},
];
export const CUES_4: Cue3[] = [
  {file: 'heartbeat', at: T('at 200 am he spirals'), dur: 5, vol: 0.1, loop: true}, {file: 'pill_pop', at: T('three moves') + 0.4, vol: 0.14}, {file: 'pill_pop', at: T('three moves') + 0.9, vol: 0.14}, {file: 'pill_pop', at: T('three moves') + 1.4, vol: 0.14},
  ...[T('what if she says no'), T('what if i look stupid'), T('what if they laugh')].map((at): Cue3 => ({file: 'terminal_type', at, dur: 1.2, vol: 0.1})), {file: 'shimmer', at: T('once its on paper'), vol: 0.16},
  {file: 'clock_tick', at: T('he gives worry a time'), dur: 3, vol: 0.14, loop: true}, {file: 'door_open', at: T('if panic knocks') + 0.1, vol: 0.2}, {file: 'stamp_hit', at: T('most worries never show up') + 0.6, vol: 0.2},
  ...[T('not start a business'), T('not fix my life'), T('not get in shape')].map((at): Cue3 => ({file: 'stamp_hit', at: at + 0.6, vol: 0.16})), {file: 'glitch_hit', at: T('thinking about the thinking'), vol: 0.14},
  ...BEATS4.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS4.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
