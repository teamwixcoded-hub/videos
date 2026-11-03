import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {InsertBG} from '../same2d/inserts';
import {INK} from '../winter/Hero';
import {T, TE} from './timeline';
import {Beats, Beat, RingG} from '../winter/scenes2';
import type {Shot4} from '../winter/act4';
import {OSolo, OPair, CardRow, ThoughtCloud, Ceiling, Chip, Pill, Txt, Frame, Fig, CafeBG, OfficeBG} from './scenes';

// ============================================================================================
// OVERTHINKING, act 3 (286 to 435 s): the scoreboard, Jake's "almost" list and notebook, the third chance (Sam builds an ugly site, Jake plans a beautiful one).
// ============================================================================================
const B_FAILEND: Beat[] = [
  {text: 'A FAILURE ENDS.', at: T('a failure ends'), s: 130, y: 330, c: '#3ddc84'},
  {text: 'YOU FEEL IT. YOU LEARN. YOU MOVE ON.', at: T('you feel it'), s: 66, y: 480},
  {text: 'AND ALMOST NEVER ENDS.', at: T('and almost never ends'), s: 130, y: 720, c: '#ff6a6a'},
];
const B_NOMIST: Beat[] = [
  {text: 'ALMOST NO MISTAKES THIS YEAR.', at: T('jake made almost no mistakes'), s: 84, y: 360},
  {text: 'ALMOST NOTHING ELSE.', at: T('and hes got almost nothing'), s: 100, y: 580, c: '#ff6a6a'},
];
const B_THIRD: Beat[] = [
  {text: 'THIRD CHANCE.', at: T('third chance'), s: 170, y: 400, c: '#ffd23f'},
  {text: 'THE ONE THAT SPLITS THEM FOR GOOD.', at: T('the one that splits'), s: 72, y: 600},
];
const B_PLAN: Beat[] = [
  {text: 'ZERO CUSTOMERS.', at: T('zero customers'), s: 110, y: 300, c: '#ff4a5e'},
  {text: 'ZERO MESSAGES SENT.', at: T('zero messages sent'), s: 110, y: 480, c: '#ff4a5e'},
  {text: 'ZERO SITES LIVE.', at: T('zero sites live'), s: 110, y: 660, c: '#ff4a5e'},
];
const B_START: Beat[] = [
  {text: 'EVERY TIME HE’S ABOUT TO START,', at: T('every time hes about to start'), s: 74, y: 300},
  {text: 'ONE MORE THING TO FIGURE OUT FIRST.', at: T('one more thing to figure'), s: 74, y: 420, c: '#ffd23f'},
  {text: 'ONE MORE COURSE. ONE MORE TOOL. ONE MORE WHAT IF.', at: T('one more course'), s: 54, y: 580, c: '#8c96c8'},
  {text: 'BECAUSE IF HE STARTS, IT CAN FAIL.', at: T('because if he starts'), s: 84, y: 760, c: '#ff6a6a'},
  {text: 'AS LONG AS HE’S PLANNING, IT’S STILL PERFECT. STILL SAFE.', at: T('as long as hes planning'), s: 56, y: 900, c: '#3ddc84'},
];
const BEATS3 = [B_FAILEND, B_NOMIST, B_THIRD, B_PLAN, B_START];

const Score: React.FC<{t: number}> = ({t}) => {
  const rows: [string, string, string, number][] = [
    ['ROLE', 'SENIOR', 'SAME DESK', T('sam got the senior role')],
    ['GIRL', 'SARAH', '—', T('hes dating sarah')],
    ['FAILURES', 'MORE THAN EVER', 'ALMOST NONE', T('hes also failed more')],
  ];
  const k0 = ramp(t, T('six months later'), T('six months later') + 0.4);
  return (
    <InsertBG glow="#ffd23f">
      <g transform={`translate(960 ${520 + (1 - k0) * 40})`} opacity={k0}>
        <rect x={-760} y={-380} width={1520} height={760} rx={30} fill="#10142e" stroke={INK} strokeWidth={12} />
        <rect x={-760} y={-380} width={1520} height={120} rx={30} fill="#3b6fd8" stroke={INK} strokeWidth={12} /><Txt x={0} y={-296} s={88} ls={10}>SCOREBOARD</Txt>
        <Txt x={-130} y={-190} s={60} c="#e9962c">SAM</Txt><Txt x={420} y={-190} s={60} c="#8a6fe0">JAKE</Txt>
        {rows.map(([lab, a, b, at], i) => { const k = ramp(t, at, at + 0.3); return <g key={lab} opacity={k} transform={`translate(0 ${-60 + i * 170})`}><Txt x={-720} y={20} s={40} anchor="start" c="#8c96c8">{lab}</Txt><Txt x={-130} y={20} s={i === 2 ? 40 : 56} c="#3ddc84">{a}</Txt><Txt x={420} y={20} s={i === 2 ? 44 : 56} c="#ff9a6a">{b}</Txt></g>; })}
      </g>
      <g opacity={ramp(t, T('because only three people applied', 1), T('because only three people applied', 1) + 0.3)}><Chip x={960} y={980} s={44} text="ONLY 3 PEOPLE APPLIED" c="#8a4fd8" /></g>
    </InsertBG>
  );
};
const Almost: React.FC<{t: number}> = ({t}) => {
  const items: [string, number][] = [['APPLIED', T('almost applied')], ['SAID HI', T('almost said hi')], ['JOINED THE GYM', T('almost joined the gym')], ['CALLED HIS DAD BACK', T('almost called his dad')], ['STARTED THE BUSINESS', T('almost started the business')]];
  return (
    <InsertBG glow="#ff9a6a">
      {items.map(([lab, at], i) => { const k = ramp(t, at - 0.05, at + 0.25); return <g key={lab} opacity={k} transform={`translate(800 ${250 + i * 150 + (1 - k) * 24})`}><Txt x={-20} y={0} s={76} c="#ffd23f" anchor="end">ALMOST</Txt><Txt x={10} y={0} s={76} anchor="start">{lab}</Txt></g>; })}
    </InsertBG>
  );
};
const Notebook: React.FC<{t: number}> = ({t}) => {
  const a = T('open that notebook'), k = ramp(t, a, a + 0.5);
  const tags: [string, number][] = [['NO DATES', T('no dates')], ['NO CUSTOMERS', T('no customers')], ['NO CALLS', T('no calls')], ['JUST ALMOST.', T('just almost')]];
  return (
    <InsertBG glow="#ffb25a">
      <g transform={`translate(700 ${540 + (1 - k) * 60}) rotate(-3)`} opacity={k}>
        <rect x={-380} y={-440} width={760} height={880} rx={24} fill="#f8f1dc" stroke={INK} strokeWidth={10} /><path d="M -330,-440 L -330,440" stroke="#d9534f" strokeWidth={6} opacity={0.6} />
        {Array.from({length: 11}, (_, i) => <path key={i} d={`M -310,${-340 + i * 78} L 340,${-340 + i * 78}`} stroke="#b8d0f0" strokeWidth={4} />)}
        {['BUSINESS IDEAS', 'NAMES', 'LOGOS', 'STEPS 1–50', 'THE PERFECT PLAN'].map((l, i) => <Txt key={l} x={-290} y={-300 + i * 156} s={46} anchor="start" c="#3a3f78" o={ramp(t, T('page after page') + i * 0.35, T('page after page') + i * 0.35 + 0.3)}>{l}</Txt>)}
      </g>
      {tags.map(([l, at], i) => { const kk = ramp(t, at, at + 0.25); return <g key={l} opacity={kk} transform={`translate(1420 ${290 + i * 160}) scale(${0.85 + 0.15 * kk})`}><Txt x={0} y={0} s={i === 3 ? 100 : 74} c={i === 3 ? '#ff4a5e' : '#ffd23f'}>{l}</Txt></g>; })}
    </InsertBG>
  );
};
const Shops: React.FC<{t: number}> = ({t}) => (
  <InsertBG glow="#ffd23f">
    {[0, 1, 2, 3].map((i) => { const k = ramp(t, T('small shops') + i * 0.3, T('small shops') + i * 0.3 + 0.3); return (
      <g key={i} opacity={k} transform={`translate(${340 + i * 410} ${480 + (1 - k) * 50})`}>
        <rect x={-150} y={-30} width={300} height={190} fill="#f0d6a0" stroke={INK} strokeWidth={9} /><path d="M -170,-30 L -130,-120 L 130,-120 L 170,-30 Z" fill={['#d9534f', '#3b8d6b', '#3b6fd8', '#d84f8a'][i]} stroke={INK} strokeWidth={9} strokeLinejoin="round" /><rect x={-40} y={40} width={80} height={120} fill="#6a4a3a" stroke={INK} strokeWidth={7} />
        <rect x={-130} y={190} width={260} height={64} rx={16} fill="#1d2248" stroke="#ff4a5e" strokeWidth={6} /><Txt x={0} y={236} s={36} c="#ff6a6a">NO WEBSITE</Txt>
      </g>); })}
    <g opacity={ramp(t, T('build them on weekends'), T('build them on weekends') + 0.3)}><Chip x={560} y={880} text="ON WEEKENDS" c="#3b6fd8" /></g><g opacity={ramp(t, T('charge a fair price'), T('charge a fair price') + 0.3)}><Chip x={1360} y={880} text="A FAIR PRICE" c="#3ddc84" /></g>
  </InsertBG>
);
const Site: React.FC<{t: number; ugly?: number; a: number; live?: number; label?: string}> = ({t, ugly = 1, a, live, label}) => {
  const k = ramp(t, a, a + 0.4), colors = ugly > 0.5 ? ['#ff2bd6', '#2bff5a', '#ffe600'] : ['#ff9a8a', '#ffe0a0', '#d8e8ff'];
  return (
    <InsertBG glow="#4aa8ff">
      <g transform={`translate(960 ${520 + (1 - k) * 50})`} opacity={k}>
        <rect x={-640} y={-400} width={1280} height={800} rx={26} fill="#f6f7ff" stroke={INK} strokeWidth={10} /><rect x={-640} y={-400} width={1280} height={80} rx={26} fill="#3b5fd8" stroke={INK} strokeWidth={10} /><rect x={-560} y={-380} width={760} height={40} rx={20} fill="#fff" opacity={0.85} /><Txt x={-540} y={-349} s={28} anchor="start" c="#4a4f7a">cousins-shop.com</Txt>
        <rect x={-620} y={-310} width={1240} height={140} fill={colors[0]} /><Txt x={0} y={-212} s={74} c={colors[2]}>COUSIN'S SHOP</Txt>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${-400 + i * 400} -10) rotate(${ugly > 0.5 ? (i - 1) * 9 : 0})`} opacity={ramp(t, T('crooked photos') - 0.3 + i * 0.15, T('crooked photos') + i * 0.15)}><rect x={-150} y={-110} width={300} height={220} rx={10} fill={colors[(i + 1) % 3]} stroke={INK} strokeWidth={7} /><circle cx={0} cy={-10} r={50} fill="#fff" opacity={0.6} /></g>)}
        <rect x={-600} y={230} width={1200} height={34} rx={17} fill="#d8dcf0" /><rect x={-600} y={230} width={Math.max(10, 1200 * (0.15 + 0.2 * ramp(t, a + 0.5, a + 5)))} height={34} rx={17} fill="#3b5fd8" /><Txt x={-600} y={310} s={34} anchor="start" c="#8c96c8" o={ugly > 0.5 ? 1 : 0}>loading… still loading…</Txt>
        {live !== undefined && t >= live && <g transform="translate(330 300) rotate(-6)"><rect x={-170} y={-60} width={340} height={120} rx={16} fill="#3ddc84" stroke={INK} strokeWidth={9} /><Txt x={0} y={26} s={80} ls={4}>LIVE</Txt></g>}
      </g>
      {label && <Txt x={960} y={990} s={70} c="#ffd23f" o={ramp(t, a + 0.3, a + 0.6)}>{label}</Txt>}
    </InsertBG>
  );
};
const Bill: React.FC<{t: number}> = ({t}) => {
  const a = T('friend pays him'), k = ramp(t, a, a + 0.4);
  return (
    <InsertBG glow="#3ddc84">
      <g transform={`translate(960 ${520 + (1 - k) * 60}) rotate(-6)`} opacity={k}>
        <path d="M -330,-150 L 330,-170 L 340,160 L -320,150 Z" fill="#8fd6a0" stroke={INK} strokeWidth={10} strokeLinejoin="round" /><path d="M -200,-60 Q 0,-100 200,-40 M -240,40 Q 0,10 240,60" stroke="#5fa878" strokeWidth={7} fill="none" /><circle cx={0} cy={0} r={78} fill="#b8f2cc" stroke={INK} strokeWidth={8} /><Txt x={0} y={26} s={80} c="#1b4a30">20</Txt><Txt x={-270} y={-96} s={50} c="#1b4a30">20</Txt><Txt x={270} y={118} s={50} c="#1b4a30">20</Txt>
      </g>
      <Txt x={960} y={900} s={64} c="#cfe2ff" o={ramp(t, T('smallest money'), T('smallest money') + 0.3)}>SMALLEST MONEY HE'S EVER BEEN PROUD OF.</Txt>
    </InsertBG>
  );
};
const Msgs: React.FC<{t: number}> = ({t}) => {
  const a = T('then he messages five'), b = T('four ignore him');
  return (
    <InsertBG glow="#4aa8ff">
      {[0, 1, 2, 3, 4].map((i) => { const k = ramp(t, a + i * 0.2, a + i * 0.2 + 0.3), res = ramp(t, b + (i < 4 ? i * 0.35 : 1.6), b + (i < 4 ? i * 0.35 : 1.6) + 0.3); return (
        <g key={i} opacity={k} transform={`translate(${300 + i * 330} 520)`}>
          <rect x={-120} y={-150} width={240} height={300} rx={26} fill="#f6f7ff" stroke={INK} strokeWidth={8} /><path d="M -120,-140 L 0,-30 L 120,-140" stroke={INK} strokeWidth={7} fill="none" strokeLinejoin="round" />
          {i < 4 ? <g opacity={res}><circle cy={70} r={46} fill="#8c96c8" /><path d="M -22,48 L 22,92 M 22,48 L -22,92" stroke="#fff" strokeWidth={12} strokeLinecap="round" /></g> : <g opacity={res}><circle cy={70} r={46} fill="#3ddc84" /><path d="M -22,72 L -6,90 L 26,54" stroke="#fff" strokeWidth={12} strokeLinecap="round" fill="none" /></g>}
        </g>); })}
      <Txt x={960} y={900} s={80} c="#ffd23f" o={ramp(t, b + 1.6, b + 1.9)}>FOUR IGNORE HIM. ONE SAYS YES.</Txt>
    </InsertBG>
  );
};
const Months: React.FC<{t: number}> = ({t}) => {
  const cards: [string, string, number][] = [['MONTH 1', 'PICK A NAME', T('month one')], ['MONTH 2', 'DESIGN A LOGO', T('month two')], ['MONTH 3', 'STUDY EVERY COMPETITOR', T('month three')]];
  const logo = Math.min(14, Math.round(14 * ramp(t, T('change it 14 times') - 0.2, T('change it 14 times') + 1.4))), hrs = Math.round(80 * ramp(t, T('80 hours'), T('80 hours') + 1.0));
  return (
    <InsertBG glow="#8a6fb8">
      {cards.map(([m, l, at], i) => { const k = ramp(t, at, at + 0.3); return (
        <g key={m} opacity={k} transform={`translate(${360 + i * 600} ${500 + (1 - k) * 50})`}>
          <rect x={-270} y={-300} width={540} height={600} rx={36} fill="#1d2248" stroke={INK} strokeWidth={9} /><Txt x={0} y={-220} s={56} c="#8c96c8">{m}</Txt><Txt x={0} y={-90} s={l.length > 16 ? 44 : 60}>{l}</Txt>
          {i === 0 && <Txt x={0} y={90} s={36} c="#ffd23f" o={ramp(t, T("is it catchy"), T("is it catchy") + 0.3)}>IS IT CATCHY ENOUGH?</Txt>}
          {i === 1 && <Txt x={0} y={130} s={120} c="#ffd23f">{logo}×</Txt>}
          {i === 2 && <g><Txt x={0} y={90} s={110} c="#ffd23f">{hrs}h</Txt><Txt x={0} y={170} s={40} c="#cfe2ff">50-STEP PLAN</Txt><Txt x={0} y={225} s={40} c="#cfe2ff">COLOR-CODED SHEET</Txt></g>}
        </g>); })}
    </InsertBG>
  );
};

export const SHOTS_3: Shot4[] = [
  {at: T('six months later'), cam: [960, 540, 1.05], node: (t) => <Score t={t} />},
  {at: T('botched presentation'), cam: [960, 520, 1.05], node: (t) => <CardRow t={t} glow="#ff6a6a" cards={[{label: 'BOTCHED PRESENTATION', at: T('botched presentation'), icon: 'laptop', c: '#ff9a9a'}, {label: 'CANCELED PROJECT', at: T('canceled project'), icon: 'office', c: '#ff9a9a'}, {label: 'FIRST FIGHT WITH SARAH', at: T('awkward first fight'), icon: 'girl', c: '#ff9a9a'}]}><Txt x={960} y={130} s={70} c="#ff6a6a" o={ramp(t, T('hes also failed more'), T('hes also failed more') + 0.3)}>SAM FAILED MORE THAN EVER.</Txt></CardRow>},
  {at: T('had to apologize'), cam: [960, 780, 1.08], node: (t) => <OPair t={t} bg="room" dawn={0.2} left={{who: 'sam', mood: 'sad', open: Math.max(0, Math.sin(t * 10)) * 0.4, pose: {arm: [40, 150], hand: 'open'}}} right={{who: 'sarah', mood: 'neutral'}}><Txt x={960} y={990} s={64} c="#ffd23f" o={ramp(t, T('had to apologize'), T('had to apologize') + 0.3)}>APOLOGIZED LIKE A GROWN MAN.</Txt></OPair>},
  {at: T('jake made almost no mistakes'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_NOMIST} glow="#ff6a6a" />},
  {at: T('almost applied'), cam: [960, 540, 1.05], node: (t) => <Almost t={t} />},
  {at: T('open that notebook'), cam: [960, 540, 1.05], node: (t) => <Notebook t={t} />},
  {at: T('a failure ends'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_FAILEND} glow="#3ddc84" />},
  {at: T('it just sits there'), cam: [1100, 500, 1.05], node: (t) => <Ceiling t={t} words={['WHAT IF YOU HAD SENT IT?', 'WHAT IF YOU HAD WALKED OVER?', 'WHAT IF YOU HAD STARTED?', 'WHAT IF?']} />},
  {at: T('third chance'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_THIRD} glow="#ffd23f" />},
  {at: T('small shops'), cam: [960, 540, 1.05], node: (t) => <Shops t={t} />},
  {at: T('sam builds ugly'), cam: [960, 540, 1.04], node: (t) => <Site t={t} a={T('sam builds ugly')} live={T('but its live')} label="ONE WEEKEND. FREE. FOR HIS COUSIN." />},
  {at: T('shop gets three'), cam: [960, 540, 1.05], node: (t) => <CardRow t={t} glow="#3ddc84" cards={[{label: '3 NEW CUSTOMERS', at: T('shop gets three'), icon: 'shop', c: '#3ddc84'}, {label: 'COUSIN TELLS A FRIEND', at: T('cousin tells a friend'), icon: 'girl', c: '#cfe2ff'}]} />},
  {at: T('friend pays him'), cam: [960, 540, 1.04], node: (t) => <Bill t={t} />},
  {at: T('he takes sarah'), cam: [960, 780, 1.08], node: (t) => <OPair t={t} bg="cafe" left={{who: 'sam', mood: 'happy', open: Math.max(0, Math.sin(t * 9)) * 0.4}} right={{who: 'sarah', mood: 'happy', open: Math.max(0, Math.sin(t * 11)) * 0.5}}><Pill x={960} y={70} text="ICE CREAM" c="#ff7ad8" o={ramp(t, T('he takes sarah'), T('he takes sarah') + 0.3)} /></OPair>},
  {at: T('then he messages five'), cam: [960, 540, 1.05], node: (t) => <Msgs t={t} />},
  {at: T('he builds again'), cam: [960, 540, 1.04], node: (t) => <Site t={t} ugly={0} a={T('he builds again')} live={T('he builds again') + 0.8} label="STILL UGLY. A LITTLE LESS UGLY." />},
  {at: T('jake builds beautiful'), cam: [960, 780, 1.1], node: (t) => <OSolo t={t} bg="room" m={{who: 'jake', mood: 'neutral', look: [0.8, -0.6]}}><ThoughtCloud t={t} c="#1c3a5a" items={[{text: 'THE PERFECT WEBSITE.', at: T('jake builds beautiful'), x: 520, y: 240, s: 56}, {text: 'IN HIS HEAD.', at: T('in his head'), x: 1400, y: 310, s: 56}]} /></OSolo>},
  {at: T('month one'), cam: [960, 540, 1.05], node: (t) => <Months t={t} />},
  {at: T('zero customers'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_PLAN} glow="#ff4a5e" />},
  {at: T('every time hes about to start'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_START} glow="#8a6fb8" />},
];

export const POPS_3: TW[] = [
  {at: T('but its live'), dur: 1.5, text: "NOT PERFECT. BUT IT'S LIVE.", accent: 2, mode: 'pop'},
];
export const BUBBLES_3: {from: number; to: number; text: string; x: number; y: number}[] = [];
export const CUES_3: Cue3[] = [
  {file: 'stamp_hit', at: T('but its live'), vol: 0.22}, {file: 'coin_ping', at: T('friend pays him') + 0.5, vol: 0.18}, {file: 'phone_notif', at: T('then he messages five'), vol: 0.16}, {file: 'shimmer', at: T('he builds again') + 0.8, vol: 0.14},
  ...[T('almost applied'), T('almost said hi'), T('almost joined the gym'), T('almost called his dad'), T('almost started the business')].map((at): Cue3 => ({file: 'kw_pop', at: at + 0.05, vol: 0.14})),
  ...[T('no dates'), T('no customers'), T('no calls'), T('just almost')].map((at): Cue3 => ({file: 'stamp_hit', at, vol: 0.14})),
  ...[T('botched presentation'), T('canceled project'), T('awkward first fight')].map((at): Cue3 => ({file: 'kw_pop', at: at + 0.05, vol: 0.14})),
  {file: 'heartbeat', at: T('it just sits there'), dur: 8, vol: 0.1, loop: true},
  ...BEATS3.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
];
void [RingG, Frame, Fig, CafeBG, OfficeBG, TE];
