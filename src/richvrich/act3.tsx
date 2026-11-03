import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {T, TE} from './timeline';
import {Beats, Beat} from '../winter/scenes2';
import type {Shot4} from '../winter/act4';
import {Frame, Fig, Txt, Chip, Pill, InsertBG, Dusk, Kitchen, Garage, BarsG, Car, Truck, Coins, BankCard, Jar, PhoneBank} from './scenes';
import {INK} from './props';

// ============================================================================================
// LOOK RICH vs RICH, act 3 (213 to 313 s): Sam cooks, day 30, the grinding noise, the $1,200 repair, the credit card that grows.
// ============================================================================================
const B_COOK: Beat[] = [
  {text: 'NOT BECAUSE HE LOVES COOKING.', at: T('not because he loves cooking'), s: 74, y: 380, strike: TE('loves cooking')},
  {text: 'BECAUSE HE DID THE MATH ONCE.', at: T('because he did the math'), s: 84, y: 580, c: '#3ddc84'},
];
const B_BORING: Beat[] = [
  {text: "IT'S BORING.", at: T('its boring'), s: 120, y: 360, c: '#8c96c8'},
  {text: 'ALSO THE MOST PROFITABLE HOUR OF HIS WEEK.', at: T('most profitable hour'), s: 66, y: 560, c: '#ffd23f'},
];
const B_CHOICE: Beat[] = [
  {text: 'ONCE A WEEK INSTEAD OF FOUR.', at: T('once a week instead of four'), s: 76, y: 380},
  {text: "NOT A HABIT ANYMORE. A CHOICE.", at: T('its a choice'), s: 90, y: 600, c: '#3ddc84'},
];
const B_DIFF: Beat[] = [
  {text: 'SAME PAYCHECK. SAME 30 DAYS.', at: T('same paycheck same 30 days'), s: 74, y: 320},
  {text: 'ALREADY A $1,500 DIFFERENCE.', at: T('1500 dollar difference'), s: 96, y: 560, c: '#ffd23f'},
];
const B_TRAP: Beat[] = [
  {text: "A CREDIT CARD AT THE MINIMUM PAYMENT ISN'T A LOAN.", at: T('isnt a loan'), s: 56, y: 420},
  {text: 'IT’S A TRAP WITH A FRIENDLY LOGO.', at: T('trap with a friendly logo'), s: 80, y: 640, c: '#ff6a6a'},
];
const BEATS3 = [B_COOK, B_BORING, B_CHOICE, B_DIFF, B_TRAP];

const Cooking: React.FC<{t: number}> = ({t}) => {
  const a = T('every sunday he cooks big');
  return (
    <Frame><Kitchen t={t} />
      <Fig t={t} x={620} m={{who: 'sam', mood: 'happy', scale: 1.1, pose: {arm: [60, 120], hand: 'open'}}} />
      {[0, 1, 2, 3, 4].map((i) => { const k = ramp(t, T('five lunches in containers') + i * 0.25 - 0.4, T('five lunches in containers') + i * 0.25 - 0.1); return <g key={i} opacity={k} transform={`translate(${1000 + i * 150} 590)`}><rect x={-60} y={-44} width={120} height={70} rx={12} fill="#d8ecff" opacity={0.85} stroke={INK} strokeWidth={6} /><rect x={-60} y={-60} width={120} height={20} rx={8} fill="#3b6fd8" stroke={INK} strokeWidth={5} /><circle cx={-24} cy={-8} r={16} fill="#e8a05a" /><circle cx={16} cy={-6} r={14} fill="#f4f4ff" /><circle cx={34} cy={4} r={10} fill="#4fbf4a" /></g>; })}
      <Pill x={960} y={80} text="SUNDAY" c="#3b6fd8" o={ramp(t, a, a + 0.3)} />
      <g opacity={ramp(t, T('chicken rice vegetables'), T('chicken rice vegetables') + 0.3)}><Txt x={960} y={990} s={60} c="#cfe2ff">CHICKEN · RICE · VEGETABLES</Txt></g>
    </Frame>
  );
};
const DeliveryMath: React.FC<{t: number}> = ({t}) => {
  const a = T('delivery four nights a week'), m = ramp(t, T('almost 500 dollars a month'), T('almost 500 dollars a month') + 0.4), y = ramp(t, T('6000 dollars a year'), T('6000 dollars a year') + 0.4);
  return (
    <InsertBG glow="#ff9a6a">
      {[0, 1, 2, 3].map((i) => <g key={i} opacity={ramp(t, a + i * 0.25, a + i * 0.25 + 0.3)} transform={`translate(${380 + i * 200} 380)`}><rect x={-76} y={-80} width={152} height={160} rx={22} fill="#1d2248" stroke="#ff9a6a" strokeWidth={7} /><circle cy={-22} r={44} fill="#ff9a6a" stroke={INK} strokeWidth={6} /><Txt x={0} y={62} s={30}>NIGHT {i + 1}</Txt></g>)}
      <g opacity={m}><Txt x={960} y={650} s={120} c="#ffd23f">≈ $500 / MONTH</Txt></g>
      <g opacity={y}><Txt x={960} y={820} s={150} c="#ff6a6a">$6,000 / YEAR</Txt></g>
      <Txt x={960} y={990} s={56} c="#8c96c8" o={ramp(t, T('food that showed up cold'), T('food that showed up cold') + 0.3)}>…for food that showed up cold.</Txt>
    </InsertBG>
  );
};
const Day30: React.FC<{t: number}> = ({t}) => {
  const a = T('day 30'), fee = ramp(t, T('overdraft fee'), T('overdraft fee') + 0.5), sam = ramp(t, T('sam checks his'), T('sam checks his') + 0.4), jb = -240 - 35 * fee;
  return (
    <InsertBG glow="#ff6a6a">
      <PhoneBank x={560} y={560} scale={1.05} balance={(jb < 0 ? '-$' : '$') + Math.abs(Math.round(jb))} balC="#ff4a5e" sub={fee > 0.5 ? 'OVERDRAFT FEE -$35' : 'OVERDRAWN'} accent="#a8283a" title="JAKE · DAY 30" rows={[{label: 'Delivery', amt: '-$28'}, {label: 'Venmo', amt: '-$60'}, ...(fee > 0.3 ? [{label: 'Overdraft fee', amt: '-$35', c: '#ff4a5e'}] : [])]} />
      <g opacity={sam}><PhoneBank x={1360} y={560} scale={1.05} balance="$800" balC="#3ddc84" sub="+ $500 IN SAVINGS" accent="#2f8a5a" title="SAM · DAY 30" rows={[{label: 'Groceries', amt: '-$86', c: '#8c96c8'}, {label: 'Savings', amt: '$500', c: '#3ddc84'}]} glow /></g>
      <Pill x={960} y={90} text="DAY 30" c="#d84f8a" o={ramp(t, a, a + 0.3)} />
    </InsertBG>
  );
};
const Gap: React.FC<{t: number}> = ({t}) => {
  const a = T('1500 dollar difference');
  return (
    <InsertBG glow="#ffd23f">
      <g transform="translate(960 600)"><BarsG t={t} w={900} h={380} max={1400} bars={[{label: 'SAM +$1,300', v: 1300, c: '#3ddc84', at: a - 3}, {label: 'JAKE -$275', v: -275, c: '#ff4a5e', at: a - 3}]} /></g>
      <Txt x={960} y={150} s={110} c="#ffd23f" o={ramp(t, a - 0.5, a)}>{'$' + Math.round(1500 * ramp(t, a - 0.5, a + 0.8)).toLocaleString('en-US') + ' APART'}</Txt>
    </InsertBG>
  );
};
const Highway: React.FC<{t: number}> = ({t}) => {
  const a = T('both men hear the same grinding'), shake = Math.sin(t * 60) * 3 * ramp(t, a, a + 0.5);
  return (
    <Frame><Dusk t={t} speed={700} />
      <Car x={560 + shake} y={940} scale={1.1} spin={t * 700} dirty={0.5} /><Truck x={1360 + shake} y={940} scale={1.0} spin={t * 700} lights />
      <g opacity={ramp(t, a, a + 0.3)}>{[560, 1360].map((x, i) => <g key={i} transform={`translate(${x} 560)`}><circle r={74} fill="#ff4a5e" stroke={INK} strokeWidth={7} /><path d="M -20,-34 L 20,-34 L 28,-8 L 46,-4 L 46,14 L 28,18 L 20,44 L -20,44 L -28,18 L -46,14 L -46,-4 L -28,-8 Z" fill="#fff" /></g>)}<Txt x={960} y={200} s={80} c="#ff6a6a">GRRRRRIND…</Txt></g>
    </Frame>
  );
};
const Mechanic: React.FC<{t: number}> = ({t}) => {
  const a = T('both mechanics say the same thing'), k = ramp(t, T('1200 dollars'), T('1200 dollars') + 0.4);
  return (
    <Frame><Garage t={t} />
      <Fig t={t} x={560} m={{who: 'friend', mood: 'neutral', scale: 1.0, y: 1040, id: 'm1'}} /><Fig t={t} x={1360} m={{who: 'cousin', mood: 'neutral', scale: 1.0, y: 1040, id: 'm2'}} />
      <g transform={`translate(960 ${520 + (1 - k) * 40}) rotate(-3)`} opacity={k}><rect x={-230} y={-170} width={460} height={340} rx={16} fill="#f8f4e8" stroke={INK} strokeWidth={9} /><Txt x={0} y={-100} s={40} c="#2a2f6a">REPAIR ESTIMATE</Txt><Txt x={0} y={30} s={120} c="#d8403b">$1,200</Txt><Txt x={0} y={110} s={28} c="#8a8fb0">BOTH CARS. SAME NUMBER.</Txt></g>
      <Txt x={960} y={90} s={54} c="#cfe2ff" o={ramp(t, a, a + 0.3)}>BOTH MECHANICS SAY THE SAME THING.</Txt>
    </Frame>
  );
};
const EmergencyFund: React.FC<{t: number}> = ({t}) => {
  const a = T('then he pays it from his emergency fund'), k = ramp(t, a, a + 1.4);
  return (
    <InsertBG glow="#3ddc84">
      <Jar x={620} y={560} scale={1.35} fill={0.7 - 0.28 * k} label="EMERGENCY" />
      {[0, 1, 2, 3].map((i) => { const p = (k * 1.4 + i * 0.2) % 1; return <g key={i} opacity={Math.sin(p * Math.PI) * k} transform={`translate(${900 + p * 560} ${470 - Math.sin(p * Math.PI) * 100})`}><Coins scale={0.24} n={1} /></g>; })}
      <g transform="translate(1500 560)"><rect x={-170} y={-130} width={340} height={260} rx={24} fill="#f8f4e8" stroke={INK} strokeWidth={8} /><Txt x={0} y={-50} s={44} c="#2a2f6a">MECHANIC</Txt><Txt x={0} y={52} s={86} c="#3ddc84">PAID ✓</Txt></g>
      <Txt x={960} y={170} s={70} c="#cfe2ff" o={ramp(t, T('the money he built 500 dollars at a time'), T('the money he built 500 dollars at a time') + 0.3)}>BUILT $500 AT A TIME.</Txt>
      <Txt x={960} y={990} s={74} c="#ffd23f" o={ramp(t, T('over in one day'), T('over in one day') + 0.3)}>HURTS. BUT IT'S OVER IN ONE DAY.</Txt>
    </InsertBG>
  );
};
const CreditCard: React.FC<{t: number}> = ({t}) => {
  const a = T('so it goes on the credit card');
  return (
    <InsertBG glow="#ff6a6a">
      <BankCard x={700} y={540} scale={1.2} rot={-6} c1="#2a2f55" c2="#0a0d20" credit digits="5301 8842 0017 6620" />
      <g opacity={ramp(t, T('over 20 interest'), T('over 20 interest') + 0.3)} transform="translate(1380 420)"><rect x={-230} y={-110} width={460} height={220} rx={26} fill="#1d2248" stroke="#ff4a5e" strokeWidth={8} /><Txt x={0} y={-10} s={110} c="#ff4a5e">20%+</Txt><Txt x={0} y={62} s={44}>INTEREST</Txt></g>
      <g opacity={ramp(t, T('only pays the minimum'), T('only pays the minimum') + 0.3)} transform="translate(1380 720)"><rect x={-230} y={-64} width={460} height={128} rx={26} fill="#1d2248" stroke="#ffd23f" strokeWidth={8} /><Txt x={0} y={14} s={54} c="#ffd23f">MINIMUM ONLY</Txt></g>
      <Txt x={960} y={140} s={70} c="#cfe2ff" o={ramp(t, a, a + 0.3)}>$1,200 → ON THE CARD</Txt>
    </InsertBG>
  );
};
const Growth: React.FC<{t: number}> = ({t}) => {
  const a = T('it grows every month'), n = 12;
  return (
    <InsertBG glow="#ff6a6a">
      <g transform="translate(960 800)"><path d="M -760,0 L 760,0" stroke="#3a4070" strokeWidth={6} />
        {Array.from({length: n}, (_, i) => { const k = ramp(t, T('doesnt stay 1200 dollars') + i * 0.3, T('doesnt stay 1200 dollars') + i * 0.3 + 0.3), h = (200 + i * 16) * k; return <g key={i}><rect x={-740 + i * 124} y={-h} width={92} height={h} rx={10} fill={i < 3 ? '#ffb04a' : '#ff4a5e'} stroke={INK} strokeWidth={6} /></g>; })}</g>
      <Txt x={960} y={170} s={100} c="#ff6a6a">{'$' + Math.round(1200 + 28 * 12 * ramp(t, T('doesnt stay 1200 dollars'), a + 3)).toLocaleString('en-US')}</Txt>
      {t > a && [0, 1, 2].map((i) => <text key={i} x={1560 + i * 70} y={420 - i * 60 - ((t * 30) % 20)} fontFamily={MONT_FONT} fontWeight={800} fontSize={60 + i * 18} fill="#cfd8ff" opacity={0.8}>z</text>)}
      <Txt x={960} y={990} s={56} c="#8c96c8" o={ramp(t, a, a + 0.3)}>…even while he sleeps.</Txt>
    </InsertBG>
  );
};
const MONT_FONT = 'Montserrat, sans-serif';

export const SHOTS_3: Shot4[] = [
  {at: T('sam cooks'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_COOK} glow="#3ddc84" />},
  {at: T('delivery four nights a week'), cam: [960, 540, 1.04], node: (t) => <DeliveryMath t={t} />},
  {at: T('every sunday he cooks big'), cam: [960, 780, 1.06], node: (t) => <Cooking t={t} />},
  {at: T('its boring'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_BORING} glow="#ffd23f" />},
  {at: T('he still goes out once a week'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_CHOICE} glow="#3ddc84" />},
  {at: T('day 30'), cam: [960, 540, 1.04], node: (t) => <Day30 t={t} />},
  {at: T('same paycheck same 30 days'), cam: [960, 540, 1.04], node: (t) => <Gap t={t} />},
  {at: T('month four'), cam: [960, 640, 1.06], node: (t) => <Highway t={t} />},
  {at: T('both mechanics say the same thing'), cam: [960, 780, 1.06], node: (t) => <Mechanic t={t} />},
  {at: T('sam winces'), cam: [960, 540, 1.04], node: (t) => <EmergencyFund t={t} />},
  {at: T('jake doesnt have 1200 dollars'), cam: [960, 540, 1.04], node: (t) => <CreditCard t={t} />},
  {at: T('so the 1200 dollars doesnt stay'), cam: [960, 540, 1.04], node: (t) => <Growth t={t} />},
  {at: T('a credit card at the minimum payment'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_TRAP} glow="#ff6a6a" />},
];

export const POPS_3: TW[] = [];
export const BUBBLES_3: {from: number; to: number; text: string; x: number; y: number}[] = [];
export const CUES_3: Cue3[] = [
  {file: 'coin_ping', at: T('then he pays it from his emergency fund') + 0.4, vol: 0.16}, {file: 'stamp_hit', at: T('1200 dollars') + 0.1, vol: 0.2}, {file: 'glitch_hit', at: T('both men hear the same grinding'), vol: 0.16}, {file: 'counter_whir', at: T('1500 dollar difference') - 0.5, dur: 1.2, vol: 0.14},
  {file: 'phone_notif', at: T('overdraft fee'), vol: 0.18}, {file: 'heartbeat', at: T('jake doesnt have 1200 dollars'), dur: 8, vol: 0.1, loop: true},
  ...BEATS3.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS3.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
void [Chip, Truck];
