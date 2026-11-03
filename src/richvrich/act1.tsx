import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {InsertBG} from '../same2d/inserts';
import {T, TE} from './timeline';
import {Beats, Beat} from '../winter/scenes2';
import type {Shot4} from '../winter/act4';
import {OSolo, OPair, Fig, CardRow, Chip, Pill, Txt, Frame, DinnerBG, OfficeBG} from '../overthinking/scenes';
import {Car, Truck, BankCard, PhoneBank, Bills, Coins, Jar, Terminal, INK} from './props';

// ============================================================================================
// LOOK RICH vs RICH, act 1 (0 to 102 s): the declined card, the same paycheck, payday on both phones, "pay yourself first".
// ============================================================================================
const B_NOBODY: Beat[] = [
  {text: "HERE'S WHAT NOBODY AT THAT TABLE KNOWS.", at: T('heres what nobody at that table'), s: 70, y: 450, c: '#ffd23f'},
];
const B_FREE: Beat[] = [
  {text: 'ONE OF THEM ENDED UP FREE.', at: T('how did one of them end up free'), s: 84, y: 360, c: '#3ddc84'},
  {text: 'THE OTHER ENDED UP HERE.', at: T('and the other one end up here'), s: 84, y: 580, c: '#ff6a6a'},
];
const B_MOMENT: Beat[] = [
  {text: "IT DIDN'T HAPPEN IN ONE BIG MOMENT.", at: T('it didnt happen in one big moment'), s: 72, y: 330},
  {text: 'AN ORDINARY FRIDAY. PAYDAY.', at: T('ordinary friday'), s: 96, y: 560, c: '#ffd23f'},
];
const B_AUTO: Beat[] = [
  {text: 'SET UP ONCE. NEVER TOUCHED AGAIN.', at: T('he set it up once'), s: 70, y: 380, c: '#3ddc84'},
];
const B_FIRST: Beat[] = [
  {text: 'IF YOU SAVE WHAT’S LEFT AT THE END OF THE MONTH,', at: T('if you wait to save'), s: 56, y: 300, c: '#8c96c8', strike: TE('at the end of the month')},
  {text: 'THERE’S NEVER ANYTHING LEFT.', at: T('theres never anything left'), s: 84, y: 480, c: '#ff6a6a'},
  {text: 'PAYING HIMSELF FIRST.', at: T('paying himself first'), s: 110, y: 720, c: '#3ddc84'},
];
const B_NEVERMISS: Beat[] = [{text: 'THE MONEY SAM NEVER SEES, HE NEVER MISSES.', at: T('the money sam never sees'), s: 64, y: 540, c: '#ffd23f'}];
const B_FUN: Beat[] = [{text: "AND THAT'S BEFORE HE DOES ANYTHING FUN.", at: T('before he does anything fun'), s: 68, y: 560, c: '#ff9a6a'}];
const BEATS1 = [B_NOBODY, B_FREE, B_MOMENT, B_AUTO, B_FIRST, B_NEVERMISS, B_FUN];

const Slide: React.FC<{t: number; from: number; to: number; x0: number; x1: number; y: number; scale?: number; c1?: string; c2?: string}> = ({t, from, to, x0, x1, y, scale = 0.5, c1, c2}) => {
  const k = ramp(t, from, to);
  return <BankCard x={x0 + (x1 - x0) * k} y={y - Math.sin(k * Math.PI) * 60} scale={scale} rot={-8 + 16 * k} c1={c1 ?? '#1b1f2e'} c2={c2 ?? '#6a5a2a'} name="SAM MILLER" digits="5512 0043 7781 0929" />;
};
const CardInsert: React.FC<{t: number; at: number; second?: number; declined?: boolean}> = ({t, at, second, declined = true}) => {
  const d = t >= at + 0.7, shake = d ? Math.sin((t - at - 0.7) * 50) * 5 * Math.max(0, 1 - (t - at - 0.7) * 3) : 0;
  return (
    <InsertBG glow={d ? '#ff4a5e' : '#6fa0ff'}>
      <Terminal x={1360} y={560} scale={1.5} state={d && declined ? 'declined' : 'idle'} rot={4} />
      <BankCard x={800 + shake} y={560} scale={1.15} rot={-6} c1="#3b6fd8" c2="#1b2f7a" declined={d && declined} />
      {second !== undefined && t >= second && <Txt x={960} y={940} s={80} c="#ff4a5e">TRY AGAIN… DECLINED.</Txt>}
    </InsertBG>
  );
};
const Restaurant: React.FC<{t: number; jake: any; sam?: any; waiter?: any; children?: React.ReactNode}> = ({t, jake, sam, waiter, children}) => (
  <Frame><DinnerBG t={t} />
    <Fig t={t} x={380} m={{who: 'jake', scale: 1.0, ...jake, id: 'rj'}} />{sam && <Fig t={t} x={960} m={{who: 'sam', scale: 1.0, ...sam, id: 'rs'}} />}{waiter && <Fig t={t} x={1540} m={{who: 'boss', scale: 1.0, ...waiter, id: 'rw'}} />}
    {children}
  </Frame>
);
const Count: React.FC<{t: number}> = ({t}) => {
  const a = T('the deposit hits'), n = Math.round(4000 * ramp(t, a, a + 1.4)), k = ramp(t, a - 0.4, a);
  return (
    <InsertBG glow="#3b6fd8">
      <PhoneBank x={560} y={560} scale={1.05} balance={'$' + n.toLocaleString('en-US')} sub="DEPOSIT · PAYDAY" accent="#3b6fd8" rows={[{label: 'Payroll', amt: '+$4,000', c: '#3ddc84'}]} title="JAKE · CHECKING" />
      <PhoneBank x={1360} y={560} scale={1.05} balance={'$' + n.toLocaleString('en-US')} sub="DEPOSIT · PAYDAY" accent="#2f8a5a" rows={[{label: 'Payroll', amt: '+$4,000', c: '#3ddc84'}]} title="SAM · CHECKING" />
      <g opacity={k}><rect x={810} y={80} width={300} height={110} rx={20} fill="#12080c" stroke={INK} strokeWidth={8} /><text x={960} y={160} textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight={700} fontSize={80} fill="#ff4a4a">9:00 AM</text></g>
      <Txt x={960} y={1010} s={64} c="#cfe2ff" o={ramp(t, T('at the same time'), T('at the same time') + 0.3)}>BOTH ACCOUNTS. SAME TIME.</Txt>
    </InsertBG>
  );
};
const Drain: React.FC<{t: number}> = ({t}) => {
  const items: [string, number, number][] = [['Rent', 1600, T('rent')], ['Phone', 80, T('phone streaming')], ['Streaming', 18, T('streaming')], ['Gym', 49, T('a gym he never goes')], ['3 apps', 36, T('three apps he forgot')]];
  const spent = items.reduce((s, [, a, at]) => s + (t >= at ? a * ramp(t, at, at + 0.35) : 0), 0), bal = 4000 - spent;
  return (
    <InsertBG glow="#ff6a6a">
      <PhoneBank x={960} y={560} scale={1.2} balance={'$' + Math.round(bal).toLocaleString('en-US')} balC={bal < 2500 ? '#ff9a6a' : '#3ddc84'} sub="BALANCE" accent={bal < 2500 ? '#a8283a' : '#3b6fd8'} rows={items.filter(([, , at]) => t >= at).map(([l, a]) => ({label: l, amt: '-$' + a.toLocaleString('en-US'), c: l === 'Gym' || l === '3 apps' ? '#ffb04a' : '#ff6a6a'}))} title="JAKE · CHECKING" />
      {[0, 1, 2, 3].map((i) => { const at = items[Math.min(i, 4)][2], k = ramp(t, at, at + 0.9); return t >= at ? <g key={i} opacity={1 - k} transform={`translate(${1260 + i * 20} ${420 + k * 160})`}><Coins scale={0.2} n={1} /></g> : null; })}
    </InsertBG>
  );
};
const Savings: React.FC<{t: number}> = ({t}) => {
  const a = T('500 dollars straight'), k = ramp(t, a, a + 1.4), bal = 4000 - 500 * k;
  return (
    <InsertBG glow="#3ddc84">
      <PhoneBank x={620} y={560} scale={1.1} balance={'$' + Math.round(bal).toLocaleString('en-US')} sub="BALANCE" accent="#2f8a5a" title="SAM · CHECKING" rows={[{label: 'AUTO → SAVINGS', amt: '-$500', c: '#3ddc84'}].slice(0, k > 0.05 ? 1 : 0)} glow />
      <g opacity={k}>{[0, 1, 2, 3].map((i) => { const p = (k * 1.3 + i * 0.22) % 1; return <g key={i} transform={`translate(${860 + p * 380} ${520 - Math.sin(p * Math.PI) * 120})`} opacity={Math.sin(p * Math.PI)}><Coins scale={0.26} n={1} /></g>; })}</g>
      <Jar x={1420} y={560} scale={0.95} fill={0.08 + 0.18 * k} label="SAVINGS" />
      <Txt x={1420} y={950} s={70} c="#3ddc84" o={k}>+$500</Txt>
    </InsertBG>
  );
};

export const SHOTS_1: Shot4[] = [
  {at: 0, cam: [960, 540, 1.06], node: (t) => <CardInsert t={t} at={T('just got declined')} />},
  {at: T('in front of everyone'), cam: [960, 760, 1.06], node: (t) => <Restaurant t={t} jake={{mood: 'shock', pose: {arm: [40, 130], hand: 'open'}}} waiter={{mood: 'neutral'}} sam={{mood: 'neutral'}}><Terminal x={1160} y={640} scale={0.5} state="declined" /></Restaurant>},
  {at: T('tries it again'), cam: [960, 540, 1.06], node: (t) => <CardInsert t={t} at={T('tries it again') + 0.3} second={T('declined', 1) - 0.2} />},
  {at: T('sam reaches across'), cam: [960, 760, 1.06], node: (t) => <Restaurant t={t} jake={{mood: 'sad'}} sam={{mood: 'neutral', pose: {armR: [20, 40], hand: 'open'} as any}} waiter={{mood: 'neutral'}}><Slide t={t} from={T('hands over his card')} to={T('hands over his card') + 1.3} x0={900} x1={1420} y={620} /><Terminal x={1180} y={640} scale={0.5} state={t > T('hands over his card') + 1.3 ? 'approved' : 'declined'} /></Restaurant>},
  {at: T('jake laughs it off'), cam: [380, 760, 1.14], node: (t) => <Restaurant t={t} jake={{mood: 'happy', open: Math.max(0, Math.sin(t * 12)) * 0.5}} sam={{mood: 'neutral'}} waiter={{mood: 'neutral'}}>{t > T('face is burning') && <g opacity={ramp(t, T('face is burning'), T('face is burning') + 0.4)}><ellipse cx={300} cy={345} rx={46} ry={26} fill="#ff4a4a" opacity={0.55} /><ellipse cx={460} cy={345} rx={46} ry={26} fill="#ff4a4a" opacity={0.55} /></g>}</Restaurant>},
  {at: T('heres what nobody at that table'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_NOBODY} glow="#ffd23f" />},
  {at: T('five years ago'), cam: [960, 520, 1.05], node: (t) => <CardRow t={t} glow="#3b6fd8" cards={[{label: 'SAME JOB', at: T('the exact same job'), icon: 'office'}, {label: 'SAME SALARY', at: T('exact same salary'), icon: 'money'}, {label: '$4,000 A MONTH', at: T('4000 dollars a month'), icon: 'money', c: '#3ddc84'}]}><Txt x={960} y={130} s={80} c="#ffd23f" o={ramp(t, T('five years ago'), T('five years ago') + 0.3)}>FIVE YEARS AGO</Txt></CardRow>},
  {at: T('how did one of them end up free'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_FREE} glow="#8a6fb8" />},
  {at: T('it didnt happen in one big moment'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_MOMENT} glow="#ffd23f" />},
  {at: T('sam and jake are 28'), cam: [960, 520, 1.05], node: (t) => <CardRow t={t} glow="#3ddc84" cards={[{label: 'AGE 28 · SAME COMPANY', at: T('sam and jake are 28'), icon: 'office'}, {label: '$65,000 A YEAR', at: T('65000 dollars a year'), icon: 'money', c: '#ffd23f'}, {label: '≈ $4,000 / MONTH AFTER TAX', at: T('about 4000 dollars a month'), icon: 'money', c: '#3ddc84'}]} />},
  {at: T('900 am'), cam: [960, 540, 1.04], node: (t) => <Count t={t} />},
  {at: T('jake opens his banking app'), cam: [960, 780, 1.1], node: (t) => <OSolo t={t} bg="room" dawn={0.4} m={{who: 'jake', mood: t > T('and smiles') ? 'happy' : 'neutral'}}><PhoneBank x={1360} y={520} scale={0.5} rot={6} balance="$4,000" sub="PAYDAY" accent="#3b6fd8" title="JAKE · CHECKING" glow /><Txt x={960} y={990} s={70} c="#3ddc84" o={ramp(t, T('smiles 4000'), T('smiles 4000') + 0.3)}>$4,000</Txt></OSolo>},
  {at: T('he feels rich'), cam: [960, 540, 1.04], node: (t) => <Drain t={t} />},
  {at: T('before he does anything fun'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_FUN} glow="#ff9a6a" />},
  {at: T('sam opens the same app'), cam: [960, 540, 1.04], node: (t) => <Savings t={t} />},
  {at: T('he set it up once'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_AUTO} glow="#3ddc84" />},
  {at: T('he calls it paying'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_FIRST} glow="#3ddc84" />},
  {at: T('the money sam never sees'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_NEVERMISS} glow="#ffd23f"><Jar x={1500} y={520} scale={0.7} fill={0.4} /></Beats>},
];

export const POPS_1: TW[] = [];
export const BUBBLES_1 = [
  {from: T('bank glitch'), to: TE('bank glitch') + 0.8, text: 'Bank glitch.', x: 220, y: 200},
];
export const CUES_1: Cue3[] = [
  {file: 'phone_notif', at: T('the deposit hits'), vol: 0.18}, {file: 'counter_whir', at: T('the deposit hits'), dur: 1.4, vol: 0.16}, {file: 'stamp_hit', at: T('just got declined') + 0.7, vol: 0.24}, {file: 'stamp_hit', at: T('tries it again') + 1.0, vol: 0.24},
  {file: 'coin_ping', at: T('500 dollars straight'), vol: 0.18}, {file: 'coin_ping', at: T('500 dollars straight') + 0.5, vol: 0.14}, {file: 'phone_unlock', at: T('jake opens his banking app'), vol: 0.16},
  ...[T('rent'), T('phone streaming'), T('streaming'), T('a gym he never goes'), T('three apps he forgot')].map((at): Cue3 => ({file: 'phone_tap', at, vol: 0.14})),
  {file: 'glass_clink', at: T('hands over his card') + 1.2, vol: 0.16}, {file: 'amb_restaurant', at: 0, dur: 20, vol: 0.06, loop: true},
  ...BEATS1.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS1.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
void [Car, Truck, Bills, Pill, Chip, OPair, OfficeBG];
