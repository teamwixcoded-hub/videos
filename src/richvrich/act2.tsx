import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {T, TE} from './timeline';
import {Beats, Beat} from '../winter/scenes2';
import type {Shot4} from '../winter/act4';
import {BeatsG} from '../winter/act5';
import {Frame, Fig, Txt, Chip, Pill, InsertBG, Dusk, Showroom, Contract, Calc, OfficeBG, Car, Truck, Coins, shadeC, MONT} from './scenes';
import {INK} from './props';

// ============================================================================================
// LOOK RICH vs RICH, act 2 (102 to 213 s): the dealership, the monthly payment, the 72-month loan, Sam's math, the parking lot, a hundred small purchases.
// ============================================================================================
const B_PAY: Beat[] = [
  {text: 'NOT: "WHAT\'S THE PRICE?"', at: T('whats the price'), s: 84, y: 300, c: '#8c96c8', strike: TE('whats the price') + 0.3},
  {text: 'NOT: "WHAT\'S THE INTEREST RATE?"', at: T('whats the interest rate'), s: 84, y: 470, c: '#8c96c8', strike: TE('whats the interest rate') + 0.3},
  {text: 'JUST: "WHAT MONTHLY PAYMENT?"', at: T('just what monthly payment'), s: 100, y: 700, c: '#ffd23f'},
];
const B_TRAP: Beat[] = [
  {text: 'NOBODY GOES BROKE FROM ONE BIG PURCHASE.', at: T('nobody goes broke from one'), s: 70, y: 400},
  {text: 'THEY GO BROKE FROM A HUNDRED SMALL ONES', at: T('they go broke from a hundred'), s: 70, y: 600, c: '#ff6a6a'},
  {text: 'THAT EACH FELT TOO SMALL TO MATTER.', at: T('each felt too small'), s: 64, y: 740, c: '#ff9a6a'},
];
const BEATS2 = [B_PAY, B_TRAP];

const Dealer: React.FC<{t: number; children?: React.ReactNode; truck?: boolean; tx?: number}> = ({t, children, truck = true, tx = 1380}) => (
  <Frame><Showroom t={t} />{truck && <Truck x={tx} y={940} scale={1.5} lights />}{children}</Frame>
);
const TruckHero: React.FC<{t: number}> = ({t}) => {
  const a = T('pickup truck'), k = ramp(t, a - 0.3, a + 0.8);
  return (
    <InsertBG glow="#6fa0ff">
      <polygon points="960,0 700,880 1220,880" fill="#fff6d0" opacity={0.12} />
      <ellipse cx={960} cy={880} rx={640} ry={70} fill="#1b2150" stroke="#4a5090" strokeWidth={6} />
      <Truck x={960 + (1 - k) * 300} y={880} scale={1.7} lights spin={t * 40} />
      {[0, 1, 2, 3].map((i) => <path key={i} d="M 0,-24 L 6,-6 L 24,0 L 6,6 L 0,24 L -6,6 L -24,0 L -6,-6 Z" fill="#fff" transform={`translate(${620 + i * 240} ${420 + (i % 2) * 90}) scale(${0.6 + 0.4 * Math.abs(Math.sin(t * 4 + i))})`} opacity={k * 0.9} />)}
      <Chip x={960} y={150} text="BRAND NEW · BLACK" c="#23253a" o={k} s={52} />
    </InsertBG>
  );
};
const Photos: React.FC<{t: number}> = ({t}) => {
  const a = T('see the photos');
  return (
    <Frame><Showroom t={t} />
      <Fig t={t} x={620} m={{who: 'jake', mood: 'happy', scale: 1.1}} />
      {[0, 1, 2].map((i) => { const k = ramp(t, a + i * 0.3, a + i * 0.3 + 0.35); return <g key={i} opacity={k} transform={`translate(${1100 + i * 270} ${400 + (i % 2) * 120}) rotate(${(i - 1) * 7})`}><rect x={-120} y={-100} width={240} height={200} rx={10} fill="#f8f4e8" stroke={INK} strokeWidth={7} /><rect x={-104} y={-84} width={208} height={140} rx={4} fill="#3b4a8a" /><Truck x={0} y={36} scale={0.32} /><Txt x={0} y={86} s={28} c="#8a8fb0">#NEWTRUCK</Txt></g>; })}
    </Frame>
  );
};
const Loan: React.FC<{t: number}> = ({t}) => {
  const a = T('72 months'), k = ramp(t, a - 0.3, a + 0.3);
  return (
    <InsertBG glow="#ffd23f">
      <g transform={`translate(960 ${520 + (1 - k) * 60})`} opacity={k}><Contract t={t} sign={T('jake signs')} lines={['$650 / MONTH', '72 MONTHS', '= 6 YEARS']} /></g>
    </InsertBG>
  );
};
const SamMath: React.FC<{t: number}> = ({t}) => {
  const a = T('multiplied 650 dollars'), done = t > T('46800 dollars') - 0.3, worth = ramp(t, T('worth half that'), T('worth half that') + 0.8);
  return (
    <InsertBG glow="#6fa0ff">
      <g transform="translate(520 560) scale(1.05)"><Calc lines={t > a ? ['650 × 72'] : []} result={done ? '46,800' : undefined} /></g>
      <g opacity={ramp(t, T('46800 dollars'), T('46800 dollars') + 0.4)}>
        <Truck x={1250} y={700} scale={0.95} /><Txt x={1250} y={780} s={60} c="#ff9a6a">PAID: $46,800</Txt>
        <g opacity={worth}><Truck x={1250} y={940} scale={0.6} color="#6a6f88" /><Txt x={1250} y={1010} s={52} c="#ff6a6a">IN 4 YEARS: ~$23,400</Txt></g>
      </g>
    </InsertBG>
  );
};
const Drive: React.FC<{t: number; at: number; end: number}> = ({t, at, end}) => {
  const k = ramp(t, at, end), x = -400 + 2700 * k;
  return (
    <Frame><Dusk t={t} speed={900} /><Car x={x} y={910} scale={1.5} spin={t * 900} color="#c9cfe0" dirty={0.5} /></Frame>
  );
};
const Lot: React.FC<{t: number}> = ({t}) => {
  const a = T('monday morning'), k = ramp(t, a, a + 2.2), x = -500 + 1500 * k, stare = t > T('people stop and stare');
  return (
    <Frame><Dusk kind="lot" />
      {[1500, 1700].map((cx, i) => <Fig key={i} t={t + i} x={cx} m={{who: i ? 'friend' : 'boss', scale: 0.78, y: 1000, mood: stare ? 'happy' : 'neutral', look: [-0.9, 0], open: stare && t < TE('nice truck man') ? Math.max(0, Math.sin(t * 12)) * 0.5 : 0, id: 'lt' + i}} />)}
      <Car x={1780} y={1000} scale={0.7} color="#c9cfe0" dirty={0.5} />
      <Truck x={x} y={960} scale={1.35} spin={t * 500} lights />
      {t > T('nobody says anything about') && <g opacity={ramp(t, T('nobody says anything about'), T('nobody says anything about') + 0.4)}><Txt x={1780} y={760} s={48} c="#8c96c8">…nobody looks.</Txt></g>}
    </Frame>
  );
};
const Purchases: React.FC<{t: number}> = ({t}) => {
  const items: [string, string, number, string][] = [['DINNER DELIVERY', '$28', T('orders dinner'), '#ff9a6a'], ['DRINKS · VENMO', '$60', T('thursday drinks with the guys'), '#8a6fe0'], ['SNEAKERS · 4 × $30', '$120', T('new sneakers split into four'), '#3b6fd8'], ['ANOTHER DELIVERY', '$31', T('then another delivery'), '#ff9a6a'], ['COFFEE · EVERY MORNING', '$7', T('7 dollar coffee'), '#c9602e']];
  const total = items.reduce((s, [, a, at]) => s + (t >= at ? parseInt(a.slice(1)) : 0), 0);
  return (
    <InsertBG glow="#ff9a6a">
      {items.map(([l, a, at, c], i) => { const k = ramp(t, at, at + 0.3); return <g key={l} opacity={k} transform={`translate(${960 + (i % 2 ? 40 : -40)} ${190 + i * 150 + (1 - k) * 30})`}><rect x={-560} y={-56} width={1120} height={112} rx={30} fill="#1d2248" stroke={c} strokeWidth={8} /><circle cx={-490} cy={0} r={30} fill={c} stroke={INK} strokeWidth={6} /><Txt x={-430} y={16} s={44} anchor="start">{l}</Txt><Txt x={520} y={16} s={60} anchor="end" c={c}>{a}</Txt></g>; })}
      <Txt x={960} y={1010} s={70} c="#ffd23f" o={ramp(t, T('orders dinner'), T('orders dinner') + 0.4)}>{'ADDED UP: $' + total}</Txt>
    </InsertBG>
  );
};
const Office2: React.FC<{t: number}> = ({t}) => (
  <Frame><OfficeBG /><Fig t={t} x={960} m={{who: 'jake', mood: 'tired', scale: 1.1}} /></Frame>
);

export const SHOTS_2: Shot4[] = [
  {at: T('that saturday'), cam: [960, 760, 1.08], node: (t) => <Dealer t={t}><Fig t={t} x={420} m={{who: 'jake', mood: 'neutral', scale: 1.1, look: [0.8, 0]}} /><Fig t={t} x={760} m={{who: 'sam', mood: 'neutral', scale: 1.1, look: [0.8, 0]}} /><Pill x={590} y={80} text="JUST TO LOOK" c="#3b6fd8" o={ramp(t, T('just to look'), T('just to look') + 0.3)} /></Dealer>},
  {at: T('pickup truck'), cam: [960, 540, 1.04], node: (t) => <TruckHero t={t} />},
  {at: T('jake sits in the drivers seat'), cam: [960, 780, 1.08], node: (t) => <Photos t={t} />},
  {at: T('the salesman leans in'), cam: [960, 780, 1.08], node: (t) => <Dealer t={t} truck={false}><Fig t={t} x={620} m={{who: 'jake', mood: 'happy', scale: 1.1}} /><Fig t={t} x={1300} m={{who: 'boss', mood: 'happy', scale: 1.1, open: t > T('what monthly payment works') && t < TE('works for you') ? 0.3 + 0.4 * Math.abs(Math.sin(t * 13)) : 0}} /><Chip x={1300} y={70} s={40} text="SALESMAN" c="#3b6fd8" /></Dealer>},
  {at: T('whats the price'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_PAY} glow="#ffd23f" />},
  {at: T('jake thinks about it'), cam: [960, 780, 1.08], node: (t) => <Dealer t={t} truck={false}><Fig t={t} x={620} m={{who: 'jake', mood: 'neutral', scale: 1.1, look: [0, -0.7], open: t > T('maybe 650') ? 0.3 + 0.4 * Math.abs(Math.sin(t * 13)) : 0}} /><Fig t={t} x={1300} m={{who: 'boss', mood: 'happy', scale: 1.1, open: t > T('we can make that work') ? 0.3 + 0.4 * Math.abs(Math.sin(t * 13)) : 0}} /></Dealer>},
  {at: T('72 months'), cam: [960, 540, 1.04], node: (t) => <Loan t={t} />},
  {at: T('sam sat in that same truck'), cam: [960, 780, 1.08], node: (t) => <Dealer t={t}><Fig t={t} x={640} m={{who: 'sam', mood: 'determined', scale: 1.1, look: [0.8, 0]}} /></Dealer>},
  {at: T('he took out his phone'), cam: [960, 540, 1.04], node: (t) => <SamMath t={t} />},
  {at: T('sam walks out and drives'), cam: [960, 640, 1.06], node: (t) => <Drive t={t} at={T('sam walks out and drives')} end={T('it costs him nothing') + 1} />},
  {at: T('it costs him nothing'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={[{text: 'PAID OFF.', at: T('paid off'), s: 150, y: 400, c: '#3ddc84'}, {text: '$0 A MONTH.', at: T('it costs him nothing'), s: 150, y: 640, c: '#ffd23f'}]} glow="#3ddc84"><Car x={1500} y={900} scale={0.9} dirty={0.4} /></Beats>},
  {at: T('monday morning'), cam: [960, 760, 1.06], node: (t) => <Lot t={t} />},
  {at: T('jake feels like a winner'), cam: [960, 780, 1.08], node: (t) => <Frame><Dusk kind="lot" /><Fig t={t} x={620} m={{who: 'jake', mood: 'happy', scale: 1.1, pose: 'hips'}} /><Truck x={1340} y={960} scale={1.2} lights /><Chip x={620} y={70} text="WINNER" c="#ffd23f" /></Frame>},
  {at: T('week two'), cam: [960, 780, 1.06], node: (t) => <Office2 t={t} />},
  {at: T('orders dinner'), cam: [960, 540, 1.04], node: (t) => <Purchases t={t} />},
  {at: T('none of it feels like a big decision'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={[{text: 'NONE OF IT FEELS LIKE A BIG DECISION.', at: T('none of it feels like a big decision'), s: 70, y: 500}]} glow="#8a6fb8" />},
  {at: T('thats the trap'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_TRAP} glow="#ff6a6a" />},
];

export const POPS_2: TW[] = [];
export const BUBBLES_2 = [
  {from: T('what monthly payment works'), to: TE('works for you') + 0.6, text: 'What monthly payment works for you?', x: 760, y: 130},
  {from: T('maybe 650'), to: TE('maybe 650') + 0.6, text: 'Maybe 650?', x: 330, y: 160},
  {from: T('we can make that work'), to: TE('we can make that work') + 0.8, text: 'We can make that work.', x: 1040, y: 160},
  {from: T('nice truck man'), to: TE('nice truck man') + 0.6, text: 'Nice truck, man.', x: 1230, y: 150},
];
export const CUES_2: Cue3[] = [
  {file: 'stamp_hit', at: T('jake signs') + 0.9, vol: 0.24}, {file: 'shimmer', at: T('pickup truck'), vol: 0.18}, {file: 'counter_whir', at: T('46800 dollars') - 0.3, dur: 0.9, vol: 0.14}, {file: 'phone_tap', at: T('multiplied 650 dollars'), dur: 1.2, vol: 0.1},
  {file: 'door_open', at: T('monday morning') + 1.8, vol: 0.14}, {file: 'whoosh_soft', at: T('sam walks out and drives'), vol: 0.18},
  ...[T('orders dinner'), T('thursday drinks with the guys'), T('new sneakers split into four'), T('then another delivery'), T('7 dollar coffee')].map((at): Cue3 => ({file: 'phone_notif', at, vol: 0.14})),
  ...BEATS2.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS2.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
void [BeatsG, Coins, shadeC, MONT, Txt];
