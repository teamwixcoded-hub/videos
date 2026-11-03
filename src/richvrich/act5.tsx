import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {T, TE} from './timeline';
import {Beats, Beat} from '../winter/scenes2';
import type {Shot4} from '../winter/act4';
import {Frame, Fig, Txt, Chip, Pill, InsertBG, Dusk, OfficeBG, Box, Flatbed, Calc, BarsG, Car, Truck, Coins, PhoneBank, Jar} from './scenes';
import {INK} from './props';

// ============================================================================================
// LOOK RICH vs RICH, act 5 (416 to 528 s): the layoff, Sam's nine months of freedom, Jake's panic, the repossession, "savings is the power to say no".
// ============================================================================================
const B_SAME: Beat[] = [
  {text: 'SAME COMPANY.', at: T('same company same layoff'), s: 100, y: 320},
  {text: 'SAME LAYOFF.', at: T('same layoff same day'), s: 100, y: 470},
  {text: 'SAME DAY.', at: T('same day'), s: 100, y: 620},
  {text: 'THE MOMENT THE LAST FOUR YEARS WERE SECRETLY PREPARING THEM FOR.', at: T('this is the moment the last four years'), s: 50, y: 800, c: '#ffd23f'},
];
const B_SCARED: Beat[] = [
  {text: "HE'S SCARED, BUT NOT DESPERATE.", at: T('hes scared but hes not desperate'), s: 76, y: 380},
  {text: "SO HE DOESN'T GRAB THE FIRST JOB.", at: T('so he doesnt grab the first job'), s: 76, y: 560, c: '#3ddc84'},
];
const B_PANIC: Beat[] = [
  {text: 'NOTHING SAVED.', at: T('he has nothing saved'), s: 110, y: 380, c: '#ff6a6a'},
  {text: 'PANIC MAKES DECISIONS FOR HIM.', at: T('panic makes decisions for him'), s: 76, y: 620, c: '#ff9a6a'},
];
const B_DIFF: Beat[] = [
  {text: 'SAME LAYOFF.', at: T('same layoff one man'), s: 100, y: 330},
  {text: 'ONE MAN GOT A RAISE OUT OF IT.', at: T('one man got a raise'), s: 76, y: 520, c: '#3ddc84'},
  {text: 'THE OTHER GOT BURIED.', at: T('the other got buried'), s: 76, y: 680, c: '#ff4a5e'},
];
const B_SAVE: Beat[] = [
  {text: "THAT'S WHAT SAVINGS REALLY IS.", at: T('thats what savings really is'), s: 70, y: 380},
  {text: "NOT MONEY.", at: T('its not money'), s: 130, y: 570, c: '#8c96c8', strike: TE('its not money') + 0.1},
  {text: 'THE POWER TO SAY NO.', at: T('the power to say no'), s: 120, y: 780, c: '#3ddc84'},
];
const BEATS5 = [B_SAME, B_SCARED, B_PANIC, B_DIFF, B_SAVE];

const Invite: React.FC<{t: number}> = ({t}) => {
  const a = T('both phones buzz'), buzz = Math.sin(t * 60) * 5 * Math.max(0, 1 - (t - a) * 0.9);
  const card = (x: number, who: string) => <g transform={`translate(${x + buzz} 560)`}><PhoneBank scale={1.0} balance="NEW INVITE" balC="#ffd23f" sub="CALENDAR" accent="#3b6fd8" title={who} rows={[{label: 'ALL HANDS', amt: '10:00', c: '#6fa0ff'}, {label: 'MANDATORY', amt: '!', c: '#ff6a6a'}]} /></g>;
  return (
    <InsertBG glow="#6fa0ff">
      {card(560, 'JAKE')}{card(1360, 'SAM')}
      <Txt x={960} y={170} s={64} c="#ffd23f" o={ramp(t, T('all hands meeting'), T('all hands meeting') + 0.3)}>ALL HANDS MEETING · MANDATORY</Txt>
      <g opacity={ramp(t, T('cutting 20 of the staff'), T('cutting 20 of the staff') + 0.4)} transform="translate(960 940)"><rect x={-540} y={-60} width={1080} height={120} rx={30} fill="#1d2248" stroke="#ff4a5e" strokeWidth={8} /><Txt x={0} y={20} s={56} c="#ff4a5e">THE COMPANY IS CUTTING 20% OF STAFF</Txt></g>
    </InsertBG>
  );
};
const Boxes: React.FC<{t: number}> = ({t}) => {
  const a = T('by lunch'), k = ramp(t, a, a + 2.4), x0 = 460 + k * 400;
  return (
    <Frame><OfficeBG />
      <Fig t={t} x={x0} m={{who: 'sam', scale: 1.05, y: 1050, mood: 'neutral', pose: {arm: [-70, 170], hand: 'open'}, id: 'bxs'}} /><Box x={x0 + 20} y={760} s={1.0} />
      <Fig t={t} x={x0 + 780} m={{who: 'jake', scale: 1.05, y: 1050, mood: 'sad', pose: {arm: [-70, 170], hand: 'open'}, id: 'bxj'}} /><Box x={x0 + 800} y={760} s={1.0} />
    </Frame>
  );
};
const InCar: React.FC<{t: number; who: 'sam' | 'jake'; truck?: boolean; children?: React.ReactNode; mood?: any}> = ({t, who, truck, children, mood = 'neutral'}) => (
  <Frame><Dusk kind="lot" />
    <Fig t={t} x={960} m={{who, scale: truck ? 0.5 : 0.46, y: truck ? 830 : 840, mood, id: 'ic' + who}} />
    {truck ? <Truck x={960} y={900} scale={1.7} color="#23253a" /> : <Car x={960} y={900} scale={1.9} color="#c9cfe0" dirty={0.5} />}
    {children}
  </Frame>
);
const NineMonths: React.FC<{t: number}> = ({t}) => {
  const a = T('he has about 28000 dollars saved'), b = T('his life costs him under 3000'), c = T('nine months of freedom');
  return (
    <InsertBG glow="#3ddc84">
      <g transform="translate(560 540)"><Calc lines={t > a ? ['28,000 ÷ 3,000'] : []} result={t > c - 0.5 ? '9.3' : undefined} /></g>
      <Txt x={1300} y={250} s={90} c="#3ddc84" o={ramp(t, a, a + 0.3)}>$28,000 SAVED</Txt><Txt x={1300} y={360} s={60} c="#ff9a6a" o={ramp(t, b, b + 0.3)}>LIFE COSTS UNDER $3,000 / MO</Txt>
      {Array.from({length: 9}, (_, i) => { const k = ramp(t, c + i * 0.12, c + i * 0.12 + 0.25); return <g key={i} opacity={k} transform={`translate(${900 + i * 105} 640)`}><rect x={-44} y={-60} width={88} height={120} rx={14} fill="#3ddc84" stroke={INK} strokeWidth={6} /><Txt x={0} y={16} s={40}>{i + 1}</Txt></g>; })}
      <Txt x={1300} y={820} s={92} c="#ffd23f" o={ramp(t, c, c + 0.3)}>9 MONTHS OF FREEDOM</Txt>
    </InsertBG>
  );
};
const Offers: React.FC<{t: number}> = ({t}) => {
  const a = T('he turns down two offers'), land = T('three months later');
  return (
    <InsertBG glow="#3ddc84">
      {[0, 1].map((i) => { const k = ramp(t, a + i * 0.5, a + i * 0.5 + 0.3), x = ramp(t, a + 0.9 + i * 0.5, a + 1.2 + i * 0.5); return <g key={i} opacity={k} transform={`translate(${460 + i * 440} 380)`}><rect x={-190} y={-130} width={380} height={260} rx={26} fill="#1d2248" stroke={INK} strokeWidth={8} /><Txt x={0} y={-30} s={52}>OFFER {i + 1}</Txt><Txt x={0} y={50} s={40} c="#8c96c8">FEELS WRONG</Txt><path d="M -150,-100 L 150,100" stroke="#ff4a5e" strokeWidth={16} strokeLinecap="round" opacity={x} /></g>; })}
      <g opacity={ramp(t, land, land + 0.4)} transform="translate(1400 480)"><rect x={-300} y={-220} width={600} height={440} rx={34} fill="#1d2248" stroke="#3ddc84" strokeWidth={10} /><Txt x={0} y={-90} s={46} c="#cfe2ff">A BETTER ROLE</Txt><Txt x={0} y={30} s={110} c="#3ddc84">$78,000</Txt><Txt x={0} y={130} s={62} c="#ffd23f">+20% RAISE</Txt></g>
      <Txt x={960} y={940} s={64} c="#cfe2ff" o={ramp(t, T('because he could afford to wait'), T('because he could afford to wait') + 0.3)}>BECAUSE HE COULD AFFORD TO WAIT.</Txt>
    </InsertBG>
  );
};
const Due: React.FC<{t: number}> = ({t}) => {
  const a = T('rent is due in 11 days'), b = T('the truck payment in 14');
  const card = (x: number, l: string, d: string, at: number, c: string) => <g opacity={ramp(t, at, at + 0.3)} transform={`translate(${x} 560)`}><rect x={-240} y={-250} width={480} height={500} rx={36} fill="#f4f6ff" stroke={INK} strokeWidth={9} /><rect x={-240} y={-250} width={480} height={120} rx={36} fill={c} stroke={INK} strokeWidth={9} /><Txt x={0} y={-168} s={54}>{l}</Txt><Txt x={0} y={60} s={190} c="#1b1a3a">{d}</Txt><Txt x={0} y={170} s={60} c="#8a8fb0">DAYS</Txt></g>;
  return <InsertBG glow="#ff6a6a">{card(560, 'RENT DUE', '11', a, '#d8403b')}{card(1360, 'TRUCK PAYMENT', '14', b, '#c9602e')}</InsertBG>;
};
const CardCharges: React.FC<{t: number}> = ({t}) => {
  const items: [string, number][] = [['RENT', T('rent goes on the credit card')], ['GROCERIES', T('groceries on the card')], ['GAS', T('gas on the card')]];
  return (
    <InsertBG glow="#ff4a5e">
      <PhoneBank x={560} y={560} scale={1.0} balance="$0" balC="#ff4a5e" sub="BETWEEN JOBS" accent="#a8283a" title="JAKE · CHECKING" rows={[]} />
      {items.map(([l, at], i) => { const k = ramp(t, at, at + 0.4); return <g key={l} opacity={k} transform={`translate(${1260 + (1 - k) * -200} ${300 + i * 200})`}><rect x={-290} y={-70} width={580} height={140} rx={26} fill="#1d2248" stroke="#ff4a5e" strokeWidth={8} /><Txt x={-250} y={18} s={52} anchor="start">{l}</Txt><Txt x={250} y={18} s={52} anchor="end" c="#ff9a6a">→ CARD</Txt></g>; })}
    </InsertBG>
  );
};
const Repo: React.FC<{t: number}> = ({t}) => {
  const a = T('one morning its gone'), k = ramp(t, a, a + 2.6), x = 700 + k * 1500;
  return (
    <Frame><Dusk kind="lot" />
      {k < 0.05 && <Truck x={900} y={960} scale={1.3} />}
      <Flatbed x={x} y={980} scale={1.1} spin={t * 400} load={k > 0.05} blink={Math.sin(t * 10)} />
      <g opacity={ramp(t, a, a + 0.4)}><Txt x={960} y={150} s={90} c="#ff4a5e">REPOSSESSED</Txt></g>
      <g opacity={1 - k}><Txt x={900} y={760} s={46} c="#8c96c8">(empty spot)</Txt></g>
    </Frame>
  );
};
const Auction: React.FC<{t: number}> = ({t}) => {
  const a = T('the bank sells it at auction'), b = T('the bill for the difference');
  return (
    <InsertBG glow="#ffd23f">
      <Truck x={560} y={760} scale={1.0} color="#23253a" />
      <g opacity={ramp(t, a, a + 0.4)} transform="translate(1340 400)"><rect x={-260} y={-110} width={520} height={220} rx={26} fill="#f4f6ff" stroke={INK} strokeWidth={9} /><Txt x={0} y={-24} s={54} c="#2a2f6a">AUCTION</Txt><Txt x={0} y={64} s={44} c="#d8403b">FRACTION OF ITS VALUE</Txt></g>
      <g opacity={ramp(t, b, b + 0.4)} transform="translate(1340 760)"><rect x={-300} y={-150} width={600} height={300} rx={20} fill="#f8f4e8" stroke={INK} strokeWidth={9} /><Txt x={0} y={-70} s={48} c="#2a2f6a">BANK NOTICE</Txt><Txt x={0} y={50} s={110} c="#d8403b">$4,000</Txt><Txt x={0} y={116} s={36} c="#8a8fb0">for a truck he no longer has</Txt></g>
    </InsertBG>
  );
};
const Debt14: React.FC<{t: number}> = ({t}) => {
  const a = T('the credit card is now over 14000'), n = Math.round(9000 + 5000 * ramp(t, a, a + 1.2));
  return (
    <InsertBG glow="#ff4a5e">
      <Txt x={960} y={420} s={220} c="#ff4a5e">{'$' + n.toLocaleString('en-US')}</Txt><Txt x={960} y={540} s={70}>ON THE CARD</Txt>
      <g opacity={ramp(t, T('250 dollars a month'), T('250 dollars a month') + 0.3)} transform="translate(960 800)"><rect x={-480} y={-70} width={960} height={140} rx={30} fill="#1d2248" stroke="#ff4a5e" strokeWidth={8} /><Txt x={0} y={20} s={62} c="#ff9a6a">$250+ A MONTH · JUST INTEREST</Txt></g>
    </InsertBG>
  );
};

export const SHOTS_5: Shot4[] = [
  {at: T('year four'), cam: [960, 540, 1.04], node: (t) => <Invite t={t} />},
  {at: T('by lunch'), cam: [960, 780, 1.06], node: (t) => <Boxes t={t} />},
  {at: T('same company same layoff'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_SAME} glow="#ffd23f" />},
  {at: T('sam sits in his old sedan'), cam: [960, 780, 1.08], node: (t) => <InCar t={t} who="sam" mood="determined" />},
  {at: T('he has about 28000 dollars saved'), cam: [960, 540, 1.04], node: (t) => <NineMonths t={t} />},
  {at: T('hes scared but hes not desperate'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_SCARED} glow="#3ddc84" />},
  {at: T('he takes his time'), cam: [960, 540, 1.04], node: (t) => <Offers t={t} />},
  {at: T('jake sits in his truck'), cam: [960, 780, 1.08], node: (t) => <InCar t={t} who="jake" truck mood="sad" />},
  {at: T('he has nothing saved'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_PANIC.slice(0, 1)} glow="#ff6a6a" />},
  {at: T('rent is due in 11 days'), cam: [960, 540, 1.04], node: (t) => <Due t={t} />},
  {at: T('panic makes decisions for him'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_PANIC.slice(1)} glow="#ff6a6a" />},
  {at: T('he takes the very first offer'), cam: [960, 540, 1.04], node: (t) => <BarsOffer t={t} />},
  {at: T('between jobs rent goes on'), cam: [960, 540, 1.04], node: (t) => <CardCharges t={t} />},
  {at: T('then the letter'), cam: [960, 780, 1.06], node: (t) => <Letter t={t} />},
  {at: T('one morning its gone'), cam: [960, 640, 1.06], node: (t) => <Repo t={t} />},
  {at: T('the bank sells it at auction'), cam: [960, 540, 1.04], node: (t) => <Auction t={t} />},
  {at: T('the credit card is now over 14000'), cam: [960, 540, 1.04], node: (t) => <Debt14 t={t} />},
  {at: T('same layoff one man'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_DIFF} glow="#8a6fb8" />},
  {at: T('thats what savings really is'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_SAVE} glow="#3ddc84" />},
];
const BarsOffer: React.FC<{t: number}> = ({t}) => {
  const a = T('he takes the very first offer');
  return (
    <InsertBG glow="#ff9a6a">
      <g transform="translate(960 640)"><BarsG t={t} w={900} h={400} max={70000} bars={[{label: 'BEFORE $65K', v: 65000, c: '#6fa0ff', at: a}, {label: 'NOW $58K', v: 58000, c: '#ff9a6a', at: a + 0.8}]} /></g>
      <Txt x={960} y={150} s={80} c="#ff9a6a" o={ramp(t, a, a + 0.3)}>FIRST OFFER: $58,000</Txt><Txt x={960} y={250} s={50} c="#8c96c8" o={ramp(t, T('less than he made before'), T('less than he made before') + 0.3)}>less than he made before</Txt>
    </InsertBG>
  );
};
const Letter: React.FC<{t: number}> = ({t}) => {
  const a = T('then the letter'), k = ramp(t, a, a + 0.5);
  return (
    <Frame><Dusk kind="lot" /><Fig t={t} x={620} m={{who: 'jake', scale: 1.1, mood: 'sad', id: 'lt', look: [0.8, 0.4]}} />
      <g transform={`translate(1300 ${560 + (1 - k) * 60}) rotate(-4)`} opacity={k}><rect x={-280} y={-200} width={560} height={400} rx={16} fill="#f8f4e8" stroke={INK} strokeWidth={9} /><Txt x={0} y={-110} s={56} c="#d8403b">FINAL NOTICE</Txt><Txt x={0} y={-20} s={44} c="#2a2f6a">YOU ARE BEHIND ON YOUR</Txt><Txt x={0} y={40} s={74} c="#2a2f6a">TRUCK PAYMENTS</Txt>
        <g opacity={ramp(t, T('hes behind on the truck'), T('hes behind on the truck') + 0.3)}><path d="M -220,130 L 220,130" stroke="#d8403b" strokeWidth={12} /></g></g>
    </Frame>
  );
};

export const POPS_5: TW[] = [];
export const BUBBLES_5: {from: number; to: number; text: string; x: number; y: number}[] = [];
export const CUES_5: Cue3[] = [
  {file: 'phone_notif', at: T('both phones buzz'), vol: 0.22}, {file: 'stamp_hit', at: T('one morning its gone') + 0.3, vol: 0.24}, {file: 'glitch_hit', at: T('panic makes decisions for him'), vol: 0.14}, {file: 'heartbeat', at: T('jake sits in his truck'), dur: 10, vol: 0.1, loop: true},
  {file: 'coin_ping', at: T('three months later'), vol: 0.16}, {file: 'counter_whir', at: T('he has about 28000 dollars saved'), dur: 1.2, vol: 0.14}, {file: 'door_open', at: T('by lunch') + 0.3, vol: 0.14},
  ...BEATS5.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS5.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
void [Chip, Pill, Coins, Jar];
