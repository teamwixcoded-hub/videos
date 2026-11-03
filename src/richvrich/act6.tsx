import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {T, TE} from './timeline';
import {Beats, Beat, BedSolo} from '../winter/scenes2';
import type {Shot4} from '../winter/act4';
import {Frame, Fig, Txt, Chip, Pill, InsertBG, Dusk, DinnerBG, Gauge, Car, Truck, Coins, BankCard, Jar, PhoneBank} from './scenes';
import {INK} from './props';

// ============================================================================================
// LOOK RICH vs RICH, act 6 (528 s to the end): year five, Sam's options, Jake's midnight scroll, his four small fixes, the truth, "which one are you going to be?".
// ============================================================================================
const B_OPT: Beat[] = [
  {text: "HE'S NOT RICH. NO LAMBORGHINI.", at: T('hes not rich'), s: 70, y: 300, c: '#8c96c8'},
  {text: 'HE HAS SOMETHING BETTER: OPTIONS.', at: T('something better options'), s: 76, y: 480, c: '#3ddc84'},
  {text: 'IF A BOSS YELLS, HE CAN WALK.', at: T('if a boss yells'), s: 66, y: 650},
  {text: 'IF THE CAR DIES, IT’S AN ANNOYING DAY. NOT A CRISIS.', at: T('if the car dies'), s: 52, y: 780, c: '#ffd23f'},
  {text: 'HE SLEEPS AT NIGHT.', at: T('he sleeps at night'), s: 90, y: 920, c: '#6fa0ff'},
];
const B_NEED: Beat[] = [
  {text: "HE DIDN'T NEED A BIGGER PAYCHECK.", at: T('he didnt need a bigger paycheck'), s: 70, y: 420},
  {text: 'HE NEEDED A PLAN FOR THE ONE HE HAD.', at: T('he needed a plan'), s: 70, y: 620, c: '#ffd23f'},
];
const B_BORING: Beat[] = [
  {text: "IT'S NOT A DRAMATIC COMEBACK.", at: T('its not a dramatic comeback'), s: 74, y: 380, c: '#8c96c8'},
  {text: "IT'S A BORING MONDAY.", at: T('its a boring monday'), s: 100, y: 570},
  {text: 'EXACTLY HOW EVERY REAL COMEBACK STARTS.', at: T('exactly how every real comeback starts'), s: 60, y: 760, c: '#3ddc84'},
];
const B_TRUTH: Beat[] = [
  {text: 'THE TRUTH NOBODY TEACHES YOU IN SCHOOL:', at: T('heres the truth nobody teaches'), s: 58, y: 330, c: '#8c96c8'},
  {text: 'LOOKING RICH ≠ BEING RICH.', at: T('looking rich and being rich'), s: 100, y: 540, c: '#ffd23f'},
  {text: 'MOST OF THE TIME YOU CAN ONLY AFFORD ONE.', at: T('you can only afford one'), s: 62, y: 740},
];
const B_RULES: Beat[] = [
  {text: 'PAY YOURSELF FIRST.', at: T('pay yourself first'), s: 100, y: 260, c: '#3ddc84'},
  {text: 'ASK THE PRICE. NOT THE MONTHLY PAYMENT.', at: T('ask the price'), s: 66, y: 440, c: '#ffd23f'},
  {text: 'WAIT 24 HOURS BEFORE YOU BUY.', at: T('wait 24 hours before you buy'), s: 66, y: 620},
  {text: 'BUILD THE EMERGENCY FUND BEFORE LIFE TESTS YOU.', at: T('build that emergency fund'), s: 58, y: 800, c: '#6fa0ff'},
  {text: 'BECAUSE IT WILL.', at: T('because it will'), s: 90, y: 940, c: '#ff6a6a'},
];
const B_END: Beat[] = [
  {text: 'ONE SPENT FIVE YEARS LOOKING RICH.', at: T('one spent five years looking rich'), s: 64, y: 380, c: '#ff9a6a'},
  {text: 'THE OTHER SPENT FIVE YEARS GETTING FREE.', at: T('the other spent five years getting free'), s: 64, y: 580, c: '#3ddc84'},
];
const BEATS6 = [B_OPT, B_NEED, B_BORING, B_TRUTH, B_RULES, B_END];

const Back: React.FC<{t: number}> = ({t}) => {
  const a = T('the bill sam quietly paid');
  return (
    <Frame><DinnerBG t={t} />
      <Fig t={t} x={420} m={{who: 'jake', scale: 1.0, mood: 'neutral', id: 'bkj'}} /><Fig t={t} x={960} m={{who: 'sam', scale: 1.0, mood: 'happy', id: 'bks', pose: t > a ? {arm: [30, 120], hand: 'open'} : 'idle'}} />
      <g transform={`translate(1450 640)`}><BankCard scale={0.38} rot={-6} c1="#d84f4f" c2="#7a1f2a" declined name="JAKE MILLER" /></g>
      <Pill x={960} y={80} text="YEAR FIVE" c="#3b6fd8" o={ramp(t, T('year five'), T('year five') + 0.3)} />
    </Frame>
  );
};
const Wealth: React.FC<{t: number}> = ({t}) => {
  const a = T('sam now has about 34000'), n = Math.round(34000 * ramp(t, a, a + 1.4));
  return (
    <InsertBG glow="#3ddc84">
      <Jar x={640} y={560} scale={1.35} fill={0.8} label="SAVINGS" />
      <Txt x={1300} y={380} s={150} c="#3ddc84">{'$' + n.toLocaleString('en-US')}</Txt><Txt x={1300} y={470} s={54} c="#cfe2ff">SAVED</Txt>
      <g opacity={ramp(t, T('plus a retirement account'), T('plus a retirement account') + 0.4)} transform="translate(1300 760)"><rect x={-340} y={-120} width={680} height={240} rx={30} fill="#1d2248" stroke="#ffd23f" strokeWidth={8} /><Txt x={0} y={-30} s={50} c="#ffd23f">RETIREMENT ACCOUNT</Txt><Txt x={0} y={50} s={46} c="#3ddc84">GROWING · WITH FREE MONEY INSIDE</Txt></g>
    </InsertBG>
  );
};
const UsedCar: React.FC<{t: number}> = ({t}) => {
  const a = T('jake drives home in a used car'), k = ramp(t, a, a + 2.4), sc = ramp(t, T('his credit score took a hit'), T('his credit score took a hit') + 1.2);
  return (
    <Frame><Dusk t={t} speed={700} />
      <Car x={-300 + 1500 * k} y={940} scale={1.1} spin={t * 700} color="#8a7a6a" dirty={0.8} />
      <g opacity={ramp(t, T('financed at a terrible rate'), T('financed at a terrible rate') + 0.3)} transform="translate(1500 330) scale(0.9)"><Gauge v={0.7 - 0.45 * sc} label="CREDIT SCORE" /></g>
      <Txt x={960} y={160} s={64} c="#ff9a6a" o={ramp(t, T('financed at a terrible rate'), T('financed at a terrible rate') + 0.3)}>USED CAR · TERRIBLE RATE</Txt>
    </Frame>
  );
};
const Scroll: React.FC<{t: number}> = ({t}) => {
  const a = T('he scrolls through every transaction'), items: [string, string, number][] = [['Delivery', '-$31', T('delivery delivery')], ['Delivery', '-$28', T('delivery delivery') + 0.4], ['Venmo', '-$60', T('venmo subscription')], ['Subscription', '-$14', T('subscription coffee')], ['Coffee', '-$7', T('coffee interest')], ['Interest', '-$251', T('interest charge interest')], ['Interest', '-$249', T('interest charge interest') + 0.5]];
  const off = Math.max(0, (t - a) * 60);
  return (
    <InsertBG glow="#6fa0ff">
      <PhoneBank x={640} y={560} scale={1.1} balance="-$1,872" balC="#ff4a5e" sub="ALL TRANSACTIONS" accent="#3b6fd8" title="JAKE · 2 AM" rows={items.filter(([, , at]) => t >= at).slice(-6).map(([l, v]) => ({label: l, amt: v, c: l === 'Interest' ? '#ff4a5e' : '#ff9a6a'}))} glow />
      <g opacity={ramp(t, T('adds up one month'), T('adds up one month') + 0.4)} transform="translate(1380 560)"><Txt x={0} y={-60} s={150} c="#ff6a6a">~$1,000</Txt><Txt x={0} y={30} s={56}>ONE MONTH</Txt><Txt x={0} y={110} s={44} c="#8c96c8">on things he can’t remember</Txt></g>
      <g opacity={0}>{off}</g>
    </InsertBG>
  );
};
const Four: React.FC<{t: number}> = ({t}) => {
  const items: [string, string, number, string][] = [['1', 'AUTO-TRANSFER $100 EVERY PAYDAY', T('one an automatic transfer'), '#3ddc84'], ['2', 'CANCEL 3 FORGOTTEN SUBSCRIPTIONS  (+$42 / MO)', T('two he cancels the three'), '#ff9a6a'], ['3', 'OVER $50? WAIT 24 HOURS.', T('three a new rule'), '#ffd23f'], ['4', 'SIGN UP FOR THE RETIREMENT MATCH', T('four monday morning'), '#6fa0ff']];
  return (
    <InsertBG glow="#3ddc84">
      <Txt x={960} y={120} s={70} c="#cfe2ff" o={ramp(t, T('so jake does four things'), T('so jake does four things') + 0.3)}>JAKE DOES FOUR SMALL THINGS</Txt>
      {items.map(([n, l, at, c], i) => { const k = ramp(t, at, at + 0.3); return <g key={n} opacity={k} transform={`translate(960 ${290 + i * 190 + (1 - k) * 30})`}><rect x={-760} y={-72} width={1520} height={144} rx={40} fill="#1d2248" stroke={c} strokeWidth={8} /><circle cx={-680} cy={0} r={46} fill={c} stroke={INK} strokeWidth={6} /><Txt x={-680} y={20} s={60}>{n}</Txt><Txt x={-610} y={18} s={l.length > 34 ? 46 : 54} anchor="start">{l}</Txt></g>; })}
    </InsertBG>
  );
};
const Wait24: React.FC<{t: number}> = ({t}) => {
  const a = T('anything over 50 dollars'), k = ramp(t, a, a + 1.6), n = Math.round(24 * k);
  return (
    <InsertBG glow="#ffd23f">
      <g transform="translate(560 540)"><circle r={250} fill="#e9efff" stroke={INK} strokeWidth={12} /><circle r={214} fill="#fff" />{Array.from({length: 12}, (_, i) => <path key={i} d="M 0,-200 L 0,-178" stroke={INK} strokeWidth={i % 3 ? 6 : 12} transform={`rotate(${i * 30})`} />)}<path d="M 0,0 L 0,-120" stroke={INK} strokeWidth={14} strokeLinecap="round" transform={`rotate(${k * 360})`} /><circle r={14} fill={INK} /><Txt x={0} y={150} s={70} c="#ffd23f">{n}h</Txt></g>
      <g transform="translate(1360 540)"><rect x={-300} y={-220} width={600} height={440} rx={34} fill="#1d2248" stroke="#ffd23f" strokeWidth={9} /><Txt x={0} y={-90} s={54}>ITEM OVER $50</Txt><Txt x={0} y={40} s={100} c="#ff9a6a">WAIT.</Txt><Txt x={0} y={140} s={32} c="#3ddc84" o={ramp(t, T('by tomorrow he doesnt want it'), T('by tomorrow he doesnt want it') + 0.3)}>TOMORROW: DON'T WANT IT</Txt></g>
    </InsertBG>
  );
};
const Duo: React.FC<{t: number; kind: 'sam' | 'jake' | 'both'}> = ({t, kind}) => (
  <Frame><Dusk kind="lot" />
    {kind !== 'jake' && <><Fig t={t} x={520} m={{who: 'sam', scale: 1.05, mood: 'happy', id: 'dus'}} /><Car x={700} y={1000} scale={0.9} color="#c9cfe0" dirty={0.4} /></>}
    {kind !== 'sam' && <><Fig t={t} x={1400} m={{who: 'jake', scale: 1.05, mood: kind === 'both' ? 'tired' : 'neutral', id: 'duj'}} /></>}
    {kind === 'both' && <Chip x={520} y={80} text="SAM" c="#e9962c" />}{kind === 'both' && <Chip x={1400} y={80} text="JAKE" c="#6b4fc4" />}
  </Frame>
);
const Final: React.FC<{t: number}> = ({t}) => (
  <Frame><Dusk kind="lot" />
    <Fig t={t} x={520} m={{who: 'sam', scale: 1.1, mood: 'happy', id: 'fns'}} /><Car x={760} y={1010} scale={0.95} color="#c9cfe0" />
    <Fig t={t} x={1400} m={{who: 'jake', scale: 1.1, mood: 'tired', id: 'fnj'}} /><Truck x={1700} y={1010} scale={0.8} color="#23253a" />
    <Chip x={520} y={80} text="SAM" c="#e9962c" /><Chip x={1400} y={80} text="JAKE" c="#6b4fc4" />
  </Frame>
);

export const SHOTS_6: Shot4[] = [
  {at: T('year five'), cam: [960, 780, 1.06], node: (t) => <Back t={t} />},
  {at: T('sam now has about 34000'), cam: [960, 540, 1.04], node: (t) => <Wealth t={t} />},
  {at: T('hes not rich'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_OPT} glow="#3ddc84" />},
  {at: T('jake drives home in a used car'), cam: [960, 640, 1.06], node: (t) => <UsedCar t={t} />},
  {at: T('that night he cant sleep'), cam: [960, 700, 1.08], node: (t) => <BedSolo t={t} who="jake" eyes="open" phone mood="sad"><Txt x={960} y={170} s={90} c="#cfe2ff">CAN'T SLEEP.</Txt></BedSolo>},
  {at: T('he scrolls through every transaction'), cam: [960, 540, 1.04], node: (t) => <Scroll t={t} />},
  {at: T('he didnt need a bigger paycheck'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_NEED} glow="#ffd23f" />},
  {at: T('so jake does four things'), cam: [960, 540, 1.04], node: (t) => <Four t={t} />},
  {at: T('anything over 50 dollars'), cam: [960, 540, 1.04], node: (t) => <Wait24 t={t} />},
  {at: T('four monday morning'), cam: [960, 540, 1.04], node: (t) => <Four t={t} />},
  {at: T('its not a dramatic comeback'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_BORING} glow="#3ddc84" />},
  {at: T('heres the truth nobody teaches'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_TRUTH} glow="#ffd23f" />},
  {at: T('pay yourself first'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_RULES} glow="#3ddc84" />},
  {at: T('five years from now'), cam: [960, 780, 1.06], node: (t) => <Duo t={t} kind="both" />},
  {at: T('one spent five years looking rich'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_END} glow="#8a6fb8" />},
  {at: T('so this friday'), cam: [960, 780, 1.06], node: (t) => <Final t={t} />},
];

export const POPS_6: TW[] = [
  {at: T('which one are you going to be'), dur: 3.8, text: 'WHICH ONE ARE YOU?', accent: 1, mode: 'slam'},
];
export const BUBBLES_6: {from: number; to: number; text: string; x: number; y: number}[] = [];
export const CUES_6: Cue3[] = [
  {file: 'text_slam', at: T('which one are you going to be'), vol: 0.26}, {file: 'phone_unlock', at: T('he opens his banking app') , vol: 0.14}, {file: 'phone_swipe', at: T('he scrolls through every transaction'), dur: 1.5, vol: 0.12}, {file: 'shimmer', at: T('four monday morning'), vol: 0.16},
  {file: 'coin_ping', at: T('sam now has about 34000'), vol: 0.14}, {file: 'heartbeat', at: T('that night he cant sleep'), dur: 8, vol: 0.1, loop: true}, {file: 'clock_tick', at: T('anything over 50 dollars'), dur: 4, vol: 0.14, loop: true},
  ...[T('one an automatic transfer'), T('two he cancels the three'), T('three a new rule'), T('four monday morning')].map((at): Cue3 => ({file: 'pill_pop', at, vol: 0.14})),
  ...BEATS6.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
];
void [Coins, Pill, DinnerBG];
