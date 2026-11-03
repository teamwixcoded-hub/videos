import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {T, TE} from './timeline';
import {Beats, Beat} from '../winter/scenes2';
import type {Shot4} from '../winter/act4';
import {Frame, Fig, Txt, Chip, Pill, InsertBG, Backyard, BarsG, Car, Truck, Coins, BankCard, Jar, PhoneBank} from './scenes';
import {INK} from './props';

// ============================================================================================
// LOOK RICH vs RICH, act 4 (313 to 416 s): the same 5% raise, lifestyle creep, Sam's retirement match, the barbecue, the card at $9,000, Jake works for the bank.
// ============================================================================================
const B_CREEP: Beat[] = [
  {text: 'LIFESTYLE CREEP.', at: T('lifestyle creep'), s: 130, y: 330, c: '#ff6a6a'},
  {text: 'EVERY TIME INCOME GOES UP,', at: T('every time your income goes up'), s: 70, y: 520},
  {text: 'SPENDING GOES UP A LITTLE FASTER.', at: T('spending goes up a little faster'), s: 72, y: 640, c: '#ff9a6a'},
  {text: 'YOU EARN MORE. SOMEHOW YOU FEEL MORE BROKE.', at: T('you earn more and somehow'), s: 58, y: 800, c: '#cfe2ff'},
];
const B_SAM: Beat[] = [
  {text: 'SAM DOES SOMETHING ALMOST NOBODY DOES.', at: T('sam does something almost nobody'), s: 62, y: 340},
  {text: 'HE KEEPS LIVING THE EXACT SAME LIFE.', at: T('he keeps living the exact same life'), s: 72, y: 540, c: '#3ddc84'},
];
const B_FREE: Beat[] = [
  {text: 'THE COMPANY MATCHES UP TO 4% OF HIS SALARY.', at: T('the company matches whatever'), s: 58, y: 330},
  {text: 'THAT IS FREE MONEY.', at: T('that is free money'), s: 130, y: 600, c: '#ffd23f'},
];
const B_LATER: Beat[] = [
  {text: '"I’LL DO IT WHEN I’M EARNING MORE."', at: T('jake keeps saying hell do it'), s: 66, y: 330, c: '#8c96c8'},
  {text: "HE'S EARNING MORE NOW.", at: T('hes earning more now'), s: 96, y: 540},
  {text: 'HE STILL HASN’T DONE IT.', at: T('he still hasnt done it'), s: 96, y: 700, c: '#ff6a6a'},
];
const B_BANK: Beat[] = [
  {text: 'SAME MONEY.', at: T('jake and sam earn the exact same money'), s: 110, y: 380},
  {text: 'JAKE WORKS FOR THE BANK NOW.', at: T('jake works for the bank now'), s: 90, y: 600, c: '#ff6a6a'},
  {text: 'HE JUST DOESN’T KNOW IT.', at: T('he just doesnt know it'), s: 76, y: 760, c: '#8c96c8'},
];
const BEATS4 = [B_CREEP, B_SAM, B_FREE, B_LATER, B_BANK];

const Raise: React.FC<{t: number}> = ({t}) => {
  const a = T('year one'), k = ramp(t, T('same raise'), T('same raise') + 0.5);
  return (
    <InsertBG glow="#3ddc84">
      <g transform={`translate(960 ${520 + (1 - ramp(t, a, a + 0.4)) * 60})`}><rect x={-520} y={-340} width={1040} height={680} rx={30} fill="#f8f4e8" stroke={INK} strokeWidth={10} /><Txt x={0} y={-250} s={64} c="#2a2f6a" ls={4}>SALARY REVIEW</Txt><Txt x={0} y={-130} s={54} c="#8a8fb0">SAM & JAKE · SAME RAISE</Txt>
        <g opacity={k}><Txt x={0} y={30} s={190} c="#3ddc84">+5%</Txt><Txt x={0} y={150} s={76} c="#2a2f6a">≈ +$200 / MONTH</Txt></g></g>
    </InsertBG>
  );
};
const Creep: React.FC<{t: number}> = ({t}) => {
  const a = T('jake celebrates'), k = ramp(t, T('200 more coming in'), T('200 more coming in') + 0.5), o = ramp(t, T('300 more going out'), T('300 more going out') + 0.5);
  return (
    <InsertBG glow="#ff9a6a">
      {[['NEW PHONE', 0, '#6fa0ff'], ['NICER APARTMENT', 1, '#d84f8a'], ['ROOFTOP GYM + VIEW', 2, '#ffd23f']].map(([l, i, c]) => { const kk = ramp(t, [T('new phone'), T('a nicer apartment'), T('rooftop gym')][i as number], [T('new phone'), T('a nicer apartment'), T('rooftop gym')][i as number] + 0.3); return <g key={l as string} opacity={kk} transform={`translate(${360 + (i as number) * 600} 300)`}><rect x={-240} y={-130} width={480} height={260} rx={30} fill="#1d2248" stroke={c as string} strokeWidth={8} />{i === 0 && <rect x={-40} y={-90} width={80} height={150} rx={16} fill="#0a0d20" stroke={c as string} strokeWidth={6} />}{i === 1 && <g><rect x={-90} y={-80} width={180} height={150} fill="#e0a05a" stroke={INK} strokeWidth={6} /><rect x={-90} y={-100} width={180} height={26} fill="#8a4a2a" stroke={INK} strokeWidth={6} />{[0, 1, 2].map((q) => <rect key={q} x={-70 + q * 56} y={-50} width={36} height={36} fill="#ffe9a0" />)}</g>}{i === 2 && <g><path d="M -110,70 L -110,-60 L 110,-60 L 110,70 Z" fill="#3a406a" stroke={INK} strokeWidth={6} /><rect x={-60} y={-100} width={120} height={36} rx={8} fill="#c9ced8" stroke={INK} strokeWidth={6} /></g>}<Txt x={0} y={196} s={34} c={c as string}>{l as string}</Txt></g>; })}
      <g transform="translate(560 760)" opacity={k}><rect x={-320} y={-80} width={640} height={160} rx={26} fill="#1d2248" stroke="#3ddc84" strokeWidth={8} /><Txt x={0} y={26} s={70} c="#3ddc84">+$200 COMING IN</Txt></g>
      <g transform="translate(1360 760)" opacity={o}><rect x={-320} y={-80} width={640} height={160} rx={26} fill="#1d2248" stroke="#ff4a5e" strokeWidth={8} /><Txt x={0} y={26} s={70} c="#ff4a5e">-$300 GOING OUT</Txt></g>
      <Pill x={960} y={90} text="JAKE CELEBRATES" c="#6b4fc4" o={ramp(t, a, a + 0.3)} />
    </InsertBG>
  );
};
const Lines: React.FC<{t: number}> = ({t}) => {
  const a = T('every time your income goes up'), k = ramp(t, a, a + 4);
  const pt = (f: number, up: number): [number, number] => [-640 + f * 1280, 220 - up * f * 400 - f * 120];
  return (
    <InsertBG glow="#ff6a6a">
      <g transform="translate(960 560)"><path d="M -680,260 L 680,260 M -680,260 L -680,-260" stroke="#3a4070" strokeWidth={6} />
        <path d={`M ${pt(0, 0.3)[0]},${pt(0, 0.3)[1]} L ${pt(k, 0.3)[0]},${pt(k, 0.3)[1]}`} stroke="#3ddc84" strokeWidth={14} strokeLinecap="round" fill="none" /><path d={`M ${pt(0, 0.45)[0]},${pt(0, 0.45)[1]} L ${pt(k, 0.45)[0]},${pt(k, 0.45)[1]}`} stroke="#ff4a5e" strokeWidth={14} strokeLinecap="round" fill="none" />
        <Txt x={600} y={pt(1, 0.3)[1] - 20} s={44} c="#3ddc84" o={k}>INCOME</Txt><Txt x={560} y={pt(1, 0.45)[1] + 70} s={44} c="#ff4a5e" o={k}>SPENDING</Txt></g>
    </InsertBG>
  );
};
const Retire: React.FC<{t: number}> = ({t}) => {
  const a = T('retirement plan'), m = ramp(t, T('the company matches whatever'), T('the company matches whatever') + 1.4);
  return (
    <InsertBG glow="#3ddc84">
      <g transform="translate(560 560)"><Jar scale={1.1} fill={0.3 + 0.3 * m} label="SAVINGS" /></g>
      <g transform="translate(1260 560)" opacity={ramp(t, a, a + 0.4)}><rect x={-300} y={-300} width={600} height={600} rx={36} fill="#1d2248" stroke="#3ddc84" strokeWidth={8} /><Txt x={0} y={-200} s={50} c="#3ddc84">RETIREMENT PLAN</Txt><g transform="translate(-100 120) scale(0.7)"><Coins n={5} /></g><g transform="translate(130 120) scale(0.7)" opacity={m}><Coins n={4 * m + 1} /></g><Txt x={-100} y={190} s={36}>SAM</Txt><Txt x={130} y={190} s={36} c="#ffd23f">COMPANY</Txt><Txt x={0} y={-90} s={74} c="#ffd23f" o={m}>+ MATCH</Txt></g>
      <Txt x={560} y={940} s={64} c="#3ddc84" o={ramp(t, T('600 a month now'), T('600 a month now') + 0.3)}>$600 / MONTH</Txt>
    </InsertBG>
  );
};
const Barbecue: React.FC<{t: number}> = ({t}) => {
  const a = T('all eyes go to jake'), k = ramp(t, a, a + 0.4);
  const guests: [number, any][] = [[360, 'friend'], [620, 'sarah'], [1500, 'cousin'], [1730, 'boss']];
  return (
    <Frame><Backyard t={t} />
      {guests.map(([x, w], i) => <Fig key={i} t={t + i} x={x} m={{who: w, scale: 0.8, y: 1030, mood: 'happy', look: [k * (x < 960 ? 0.9 : -0.9), 0], id: 'bq' + i}} />)}
      <Fig t={t} x={1040} m={{who: 'jake', scale: 1.05, y: 1040, mood: 'happy', pose: 'hips', id: 'bqj'}} /><Fig t={t} x={170} m={{who: 'sam', scale: 0.72, y: 1030, mood: 'neutral', look: [0.5, 0], id: 'bqs'}} />
      {[['THE TRUCK', T('the truck the watch'), 1100], ['THE WATCH', T('the watch'), 1100], ['THE ROOFTOP APARTMENT', T('the rooftop apartment'), 1100]].map(([l, at, _], i) => <g key={l as string} opacity={ramp(t, at as number, (at as number) + 0.3)}><Chip x={1040 + (i - 1) * 520} y={150 + (i % 2) * 70} text={l as string} s={40} c="#6b4fc4" /></g>)}
      <Chip x={170} y={250} s={34} text="THE GUY WITH THE OLD CAR" c="#3a4070" o={ramp(t, T('hes just the guy with the old car'), T('hes just the guy with the old car') + 0.3)} />
    </Frame>
  );
};
const Debt: React.FC<{t: number}> = ({t}) => {
  const a = T('its over 9000 now'), n = Math.round(1200 + 7800 * ramp(t, T('that credit card that started at 1200 dollars'), a + 1)), items: [string, number][] = [['VACATION HE COULDN’T AFFORD', T('a vacation he couldnt afford')], ['BACHELOR PARTY IN VEGAS', T('bachelor party in vegas')], ['CHRISTMAS', T('christmas')]];
  return (
    <InsertBG glow="#ff4a5e">
      <BankCard x={560} y={520} scale={1.0} rot={-6} c1="#2a2f55" c2="#0a0d20" credit digits="5301 8842 0017 6620" />
      <Txt x={1300} y={360} s={150} c="#ff4a5e">{'$' + n.toLocaleString('en-US')}</Txt>
      {items.map(([l, at], i) => <g key={l} opacity={ramp(t, at, at + 0.3)} transform={`translate(1300 ${520 + i * 100})`}><Txt x={0} y={0} s={44} c="#ff9a6a">{'+ ' + l}</Txt></g>)}
      <g opacity={ramp(t, T('160 dollars in interest'), T('160 dollars in interest') + 0.3)} transform="translate(960 930)"><rect x={-560} y={-60} width={1120} height={120} rx={30} fill="#1d2248" stroke="#ff4a5e" strokeWidth={8} /><Txt x={0} y={20} s={56} c="#ff4a5e">$160+ INTEREST · EVERY MONTH · FOR NOTHING</Txt></g>
    </InsertBG>
  );
};
const Bank: React.FC<{t: number}> = ({t}) => {
  const a = T('jake works for the bank now'), k = ramp(t, a, a + 0.6);
  return (
    <InsertBG glow="#6fa0ff">
      <g transform="translate(1260 620)"><path d="M -300,-60 L 0,-240 L 300,-60 Z" fill="#c9ced8" stroke={INK} strokeWidth={9} strokeLinejoin="round" /><rect x={-280} y={-60} width={560} height={30} fill="#e8eafb" stroke={INK} strokeWidth={7} />{[-200, -80, 40, 160].map((x) => <rect key={x} x={x} y={-30} width={46} height={200} fill="#f4f6ff" stroke={INK} strokeWidth={6} />)}<rect x={-300} y={170} width={600} height={40} fill="#c9ced8" stroke={INK} strokeWidth={8} /><Txt x={0} y={-100} s={48} c="#2a2f6a">BANK</Txt></g>
      <g transform={`translate(${560 + k * 300} 700)`}><Fig t={t} x={0} m={{who: 'jake', scale: 0.8, y: 360, mood: 'tired', id: 'bk'}} /></g>
      {[0, 1, 2].map((i) => { const p = (t * 0.6 + i / 3) % 1; return <g key={i} opacity={Math.sin(p * Math.PI) * k} transform={`translate(${800 + p * 440} ${500 - Math.sin(p * Math.PI) * 90})`}><Coins scale={0.2} n={1} /></g>; })}
    </InsertBG>
  );
};

export const SHOTS_4: Shot4[] = [
  {at: T('year one'), cam: [960, 540, 1.04], node: (t) => <Raise t={t} />},
  {at: T('jake celebrates'), cam: [960, 540, 1.04], node: (t) => <Creep t={t} />},
  {at: T('this has a name'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_CREEP} glow="#ff6a6a" />},
  {at: T('you earn more and somehow'), cam: [960, 540, 1.04], node: (t) => <Lines t={t} />},
  {at: T('sam does something almost nobody'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_SAM} glow="#3ddc84" />},
  {at: T('takes half the raise'), cam: [960, 540, 1.04], node: (t) => <Retire t={t} />},
  {at: T('that is free money'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_FREE} glow="#ffd23f" />},
  {at: T('jake keeps saying hell do it'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_LATER} glow="#ff6a6a" />},
  {at: T('year three'), cam: [960, 780, 1.06], node: (t) => <Barbecue t={t} />},
  {at: T('but heres whats really happening'), cam: [960, 540, 1.04], node: (t) => <Debt t={t} />},
  {at: T('jake and sam earn the exact same money'), cam: [960, 540, 1.04], node: (t) => <Bank t={t} />},
  {at: T('jake works for the bank now'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_BANK} glow="#ff6a6a" />},
];

export const POPS_4: TW[] = [];
export const BUBBLES_4: {from: number; to: number; text: string; x: number; y: number}[] = [];
export const CUES_4: Cue3[] = [
  {file: 'shimmer', at: T('same raise'), vol: 0.16}, {file: 'coin_ping', at: T('free money') - 1, vol: 0.14}, {file: 'phone_notif', at: T('new phone'), vol: 0.16}, {file: 'counter_whir', at: T('that credit card that started at 1200 dollars'), dur: 1.4, vol: 0.14}, {file: 'amb_restaurant', at: T('year three'), dur: 6, vol: 0.06, loop: true},
  ...BEATS4.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
];
void [BarsG, Car, Truck, PhoneBank, Fig, Pill];
