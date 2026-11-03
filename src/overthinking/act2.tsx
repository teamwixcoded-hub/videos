import React from 'react';
import {Cue3} from '../same2d/sound';
import {ramp} from '../same2d/fx';
import {TW} from '../fathers/type';
import {DIGI} from '../same2d/theme';
import {InsertBG} from '../same2d/inserts';
import {Hero, INK} from '../winter/Hero';
import {T, TE} from './timeline';
import {Beats, Beat, RingG, BedSolo} from '../winter/scenes2';
import {BeatsG} from '../winter/act5';
import {DayCard} from '../winter/scenes';
import type {Shot4} from '../winter/act4';
import {OSolo, OPair, Fig, ManP, CardRow, ThoughtCloud, Ceiling, Chip, Pill, Txt, Frame, OfficeBG, DinnerBG, CafeBG} from './scenes';

// ============================================================================================
// OVERTHINKING, act 2 (134 to 286 s): Sam's interview and promotion, Jake watching, the second chance (Sarah at the birthday dinner), three days later, "ready comes from doing".
// ============================================================================================
const SAMV = (x: number, id = 's'): ManP => ({who: 'sam', x, id: id + x});
const Trio: React.FC<{t: number; bg?: 'dinner' | 'cafe'; sam: ManP; sarah: ManP; jake?: ManP; children?: React.ReactNode}> = ({t, bg = 'dinner', sam, sarah, jake, children}) => (
  <Frame>
    {bg === 'dinner' ? <DinnerBG t={t} /> : <CafeBG t={t} />}
    {jake && <Fig t={t} m={{scale: 0.95, ...jake, who: 'jake', id: 'tj'}} x={1600} />}
    <Fig t={t} m={{scale: 0.98, ...sarah, who: 'sarah', id: 'ts'}} x={960} /><Fig t={t} m={{scale: 0.98, ...sam, who: 'sam', id: 'tm'}} x={360} />
    {children}
  </Frame>
);
const RedCheeks: React.FC<{o: number; x?: number; y?: number}> = ({o, x = 960, y = 270}) => <g opacity={o}><ellipse cx={x - 74} cy={y + 14} rx={46} ry={26} fill="#ff4a4a" opacity={0.55} /><ellipse cx={x + 74} cy={y + 14} rx={46} ry={26} fill="#ff4a4a" opacity={0.55} /></g>;

const B_HIRED: Beat[] = [
  {text: 'NOT BECAUSE HE WAS PERFECT.', at: T('not because he was perfect'), s: 84, y: 300, strike: TE('was perfect')},
  {text: 'ONLY THREE PEOPLE APPLIED.', at: T('because only three people applied'), s: 90, y: 520, c: '#ffd23f'},
  {text: 'HE WAS THE ONLY ONE WHO SOUNDED HUNGRY.', at: T('the only one who sounded hungry'), s: 64, y: 740, c: '#3ddc84'},
];
const B_ANGRY: Beat[] = [
  {text: "HE WASN'T ANGRY AT SAM.", at: T('he wasnt angry at sam'), s: 100, y: 400},
  {text: "HE WAS ANGRY AT THE VOICE IN HIS OWN HEAD", at: T('he was angry at the voice'), s: 64, y: 600, c: '#ff9a6a'},
  {text: "HE COULDN'T SHUT OFF.", at: T('he couldnt shut off'), s: 100, y: 760, c: '#ff6a6a'},
];
const B_BRAVE: Beat[] = [
  {text: 'REPLAYS EVERY VERSION WHERE HE WAS BRAVE.', at: T('replays every version'), s: 66, y: 150, c: '#cfe2ff'},
  {text: 'THE PERFECT LINE.', at: T('the perfect line'), s: 92, y: 270},
  {text: 'THE PERFECT TIMING.', at: T('the perfect timing'), s: 92, y: 380},
  {text: "A VERSION OF HIM THAT ONLY EXISTS AFTER IT'S TOO LATE.", at: T('the perfect version'), s: 52, y: 480, c: '#ff9a6a'},
];
const B_PREP: Beat[] = [
  {text: 'NEVER MORE PREPARED', at: T('never been more prepared'), s: 110, y: 460, c: '#ffd23f'},
  {text: "FOR A MOMENT THAT'S ALREADY OVER.", at: T('for a moment thats already'), s: 84, y: 640},
];
const B_READY: Beat[] = [
  {text: 'MORE THINKING WILL MAKE YOU FEEL READY?', at: T('your brain tells you'), to: T('it wont'), s: 70, y: 380, c: '#8c96c8'},
  {text: 'IT WON’T.', at: T('it wont'), s: 140, y: 560, c: '#ff6a6a'},
  {text: 'READY DOESN’T COME FROM THINKING.', at: T('ready doesnt come'), s: 72, y: 700},
  {text: 'IT COMES FROM DOING.', at: T('it comes from doing'), s: 110, y: 850, c: '#3ddc84'},
];
const BEATS2 = [B_HIRED, B_ANGRY, B_BRAVE, B_PREP, B_READY];

const Digits: React.FC<{t: number}> = ({t}) => {
  const a = T('seven digits'), n = Math.round(7 * ramp(t, a, a + 0.9)), num = '555 0142'.replace(' ', '').slice(0, n);
  return (
    <InsertBG glow="#4aa8ff">
      <g transform="translate(960 540) rotate(-3)">
        <rect x={-260} y={-480} width={520} height={960} rx={70} fill="#12151f" stroke={INK} strokeWidth={12} /><rect x={-228} y={-440} width={456} height={880} rx={44} fill="#1c2750" />
        <path d="M 120,-440 L 70,-300 L 130,-210 L 60,-90 L 100,10 M 70,-300 L -10,-280 M 130,-210 L 200,-230" stroke="#c9ced8" strokeWidth={5} fill="none" opacity={0.7} />
        <Txt x={0} y={-300} s={54} c="#8c96c8">NEW CONTACT</Txt><Txt x={0} y={-190} s={70}>SARAH</Txt>
        <rect x={-190} y={-120} width={380} height={120} rx={20} fill="#0e1430" stroke="#4a5090" strokeWidth={6} /><Txt x={0} y={-36} s={74} c="#ffd23f" font={DIGI} ls={6}>{num}</Txt>
        <Txt x={0} y={140} s={50} c="#3ddc84" o={ramp(t, a + 1.0, a + 1.3)}>SAVED ✓</Txt>
      </g>
      <g transform={`translate(1560 360)`}><Txt x={0} y={0} s={60} c="#ffb0d0" o={ramp(t, T('hands wont stop'), T('hands wont stop') + 0.3)}>HANDS WON'T STOP SHAKING</Txt></g>
    </InsertBG>
  );
};
const Fear: React.FC<{t: number}> = ({t}) => {
  const a = T('every time sam moves'), b = T('every time jake waits'), sk = 1 - 0.7 * ramp(t, a, a + 2.2), jk = 0.35 + 0.6 * ramp(t, b, b + 2.2);
  return (
    <InsertBG glow="#ff6a6a">
      {[['SAM', 560, sk, '#3ddc84', 'MOVES WHILE SCARED'], ['JAKE', 1360, jk, '#ff6a6a', 'WAITS']].map(([who, x, k, c, sub]) => (
        <g key={who as string} transform={`translate(${x} 600)`} opacity={ramp(t, who === 'SAM' ? a : b, (who === 'SAM' ? a : b) + 0.3)}>
          <circle r={240 * (k as number)} fill={c as string} opacity={0.22} /><circle r={150 * (k as number)} fill={c as string} opacity={0.5} stroke={INK} strokeWidth={8} />
          <Txt x={0} y={20} s={64}>FEAR</Txt><Txt x={0} y={-340} s={80}>{who as string}</Txt><Txt x={0} y={400} s={48} c={c as string}>{sub as string}</Txt>
        </g>
      ))}
      <Txt x={960} y={600} s={110} c="#fff" o={0}> </Txt>
    </InsertBG>
  );
};
const Report: React.FC<{t: number}> = ({t}) => {
  const a = T('first month'), face = ramp(t, T('face burns red'), T('face burns red') + 0.4);
  const faces: [number, any][] = [[340, 'boss'], [700, 'friend'], [1240, 'sarah'], [1580, 'cousin']];
  return (
    <Frame>
      <OfficeBG />
      <rect x={140} y={770} width={1640} height={64} rx={14} fill="#6a4a3a" stroke={INK} strokeWidth={9} />
      {faces.map(([x, w], i) => <Fig key={i} t={t + i} x={x} m={{who: w, scale: 0.78, y: 1010, mood: face > 0.5 ? 'shock' : 'neutral', look: [0.5 * Math.sign(960 - x), 0], id: 'rp' + i}} />)}
      <Fig t={t} x={960} m={{who: 'sam', scale: 1.0, y: 1040, mood: face > 0.4 ? 'sad' : 'neutral', id: 'rps', pose: face > 0.4 ? {arm: [30, 140], hand: 'open'} : 'idle'}} />
      <RedCheeks o={face} y={300} />
      <g transform={`translate(1500 230) rotate(6)`} opacity={ramp(t, a, a + 0.4)}><rect x={-170} y={-120} width={340} height={240} rx={12} fill="#f6f7ff" stroke={INK} strokeWidth={8} /><path d="M -130,-70 L 130,-70 M -130,-30 L 90,-30 M -130,10 L 130,10" stroke="#9aa0c0" strokeWidth={9} strokeLinecap="round" /><path d="M -80,50 L 130,50" stroke="#ff4a5e" strokeWidth={12} strokeLinecap="round" /><Txt x={0} y={100} s={44} c="#ff4a5e">REPORT</Txt></g>
    </Frame>
  );
};
const NightFix: React.FC<{t: number}> = ({t}) => {
  const a = T('fixes it that night');
  return (
    <InsertBG glow="#3ddc84">
      <g transform="translate(560 540)"><rect x={-300} y={-230} width={600} height={400} rx={30} fill="#2a2f55" stroke={INK} strokeWidth={10} /><rect x={-270} y={-200} width={540} height={340} rx={14} fill="#f6f7ff" /><path d="M -220,-130 L 220,-130 M -220,-80 L 160,-80 M -220,-30 L 220,-30" stroke="#9aa0c0" strokeWidth={10} strokeLinecap="round" /><path d="M -220,30 L 180,30" stroke={ramp(t, a, a + 0.8) > 0.5 ? '#3ddc84' : '#ff4a5e'} strokeWidth={14} strokeLinecap="round" /><Txt x={0} y={80} s={52} c={ramp(t, a, a + 0.8) > 0.5 ? '#3ddc84' : '#ff4a5e'}>{ramp(t, a, a + 0.8) > 0.5 ? 'FIXED ✓' : 'WRONG'}</Txt></g>
      <g transform="translate(1380 540)"><circle r={200} fill="#e9efff" stroke={INK} strokeWidth={10} /><circle cx={80} cy={-40} r={170} fill="#1d2248" /><Txt x={0} y={320} s={80} c="#ffd23f" font={DIGI}>THAT NIGHT</Txt></g>
    </InsertBG>
  );
};

export const SHOTS_2: Shot4[] = [
  {at: T('two weeks later'), cam: [700, 500, 1.06], node: (t) => <DayCard t={t - T('two weeks later')} month="2 WEEKS" day="LATER" clock={false} />},
  {at: T('sam gets called in'), cam: [960, 780, 1.1], node: (t) => <OPair t={t} bg="office" left={{who: 'sam', mood: 'sad', pose: 'belly'}} right={{who: 'boss', mood: 'neutral'}}><Pill x={560} y={60} text="THE INTERVIEW" c="#3b6fd8" o={ramp(t, T('sam gets called in'), T('sam gets called in') + 0.3)} /></OPair>},
  {at: T('he bombs half'), cam: [960, 780, 1.12], node: (t) => <OSolo t={t} bg="office" m={{who: 'sam', mood: 'shock', pose: {arm: [40 + Math.sin(t * 30) * 5, 150], hand: 'open'}}}><Chip x={560} y={330} s={40} text="VOICE CRACKS" c="#ff6a6a" o={ramp(t, T('voice cracks'), T('voice cracks') + 0.2)} /><Chip x={1360} y={330} s={40} text="FORGETS A NUMBER" c="#ff9a6a" o={ramp(t, T('forgets a number'), T('forgets a number') + 0.2)} /></OSolo>},
  {at: T('i dont know that yet'), cam: [960, 780, 1.16], node: (t) => <OPair t={t} bg="office" left={{who: 'sam', mood: 'determined', open: (t > T('i dont know that yet') && t < TE('learn it fast')) ? 0.25 + 0.45 * Math.abs(Math.sin(t * 13)) : 0}} right={{who: 'boss', mood: 'neutral'}} />},
  {at: T('he walks out sure'), cam: [960, 780, 1.1], node: (t) => <OSolo t={t} bg="office" m={{who: 'sam', mood: 'sad', pose: 'slump', slump: 0} as any}><Txt x={960} y={990} s={80} c="#cfe2ff" o={ramp(t, T('he walks out sure'), T('he walks out sure') + 0.3)}>SURE HE FAILED.</Txt></OSolo>},
  {at: T('he gets it'), cam: [960, 540, 1.05], node: (t) => <Beats t={t} beats={B_HIRED} glow="#3ddc84" />},
  {at: T('same desk'), cam: [960, 780, 1.1], node: (t) => <OSolo t={t} bg="office" m={{who: 'sam', mood: 'happy', muscle: 0.1}}><Chip x={520} y={150} text="SENIOR" c="#3ddc84" o={ramp(t, T('new title'), T('new title') + 0.2)} /><Chip x={1400} y={150} text="MORE MONEY" c="#ffd23f" o={ramp(t, T('more money'), T('more money') + 0.2)} /><Chip x={960} y={60} text="MORE PRESSURE" c="#ff6a6a" o={ramp(t, T('more pressure'), T('more pressure') + 0.2)} /></OSolo>},
  {at: T('first month'), cam: [960, 780, 1.06], node: (t) => <Report t={t} />},
  {at: T('fixes it that night'), cam: [960, 540, 1.04], node: (t) => <NightFix t={t} />},
  {at: T('jake watches from'), cam: [960, 780, 1.1], node: (t) => <OSolo t={t} bg="office" m={{who: 'jake', mood: 'tired', look: [0.8, 0]}}><ThoughtCloud t={t} items={[{text: 'SAM GOT LUCKY.', at: T('sam got lucky'), to: T('next time ill be ready'), x: 560, y: 260, s: 50}, {text: "NEXT TIME, I'LL BE READY.", at: T('next time ill be ready'), x: 1400, y: 300, s: 46}]} /></OSolo>},
  {at: T('he wasnt angry at sam'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_ANGRY} glow="#ff6a6a" />},
  // ----- the second chance -----
  {at: T('second chance'), cam: [960, 780, 1.08], node: (t) => <OPair t={t} bg="dinner" left={{who: 'friend', mood: 'happy'}} right={{who: 'cousin', mood: 'happy'}}><Pill x={960} y={70} text="SECOND CHANCE" c="#d84f8a" o={ramp(t, T('second chance'), T('second chance') + 0.3)} /><Txt x={960} y={990} s={64} c="#cfe2ff" o={ramp(t, T('loud table'), T('loud table') + 0.3)}>LOUD TABLE. CHEAP PIZZA.</Txt></OPair>},
  {at: T('her name is sarah'), cam: [960, 780, 1.14], node: (t) => <OSolo t={t} bg="dinner" m={{who: 'sarah', mood: 'happy', y: 1040}}><Pill x={960} y={60} text="SARAH" c="#d84f8a" /></OSolo>},
  {at: T('same terrible jokes'), cam: [960, 780, 1.1], node: (t) => <Trio t={t} sam={{mood: 'neutral', look: [0.9, 0]}} sarah={{mood: 'happy', open: Math.max(0, Math.sin(t * 12)) * 0.5}} jake={{mood: 'neutral', look: [-0.9, 0]}}><Txt x={960} y={990} s={64} c="#ffd23f" o={ramp(t, T('both notice'), T('both notice') + 0.3)}>BOTH NOTICE HER LAUGH.</Txt></Trio>},
  {at: T('sams hands are cold'), cam: [960, 780, 1.1], node: (t) => <OSolo t={t} bg="dinner" m={{who: 'sam', mood: 'shock', pose: {arm: [40 + Math.sin(t * 34) * 5, 150], hand: 'open'}}}><ThoughtCloud t={t} items={[{text: "DON'T DO IT.", at: T('dont do it'), to: T('youll sound stupid'), x: 520, y: 240, s: 56}, {text: "YOU'LL SOUND STUPID.", at: T('youll sound stupid'), x: 1400, y: 300, s: 56}]} /><Txt x={960} y={990} s={64} c="#ff9a6a" o={ramp(t, T('heart hammering'), T('heart hammering') + 0.3)}>COLD HANDS. HEART HAMMERING.</Txt></OSolo>},
  {at: T('he walks over anyway'), cam: [960, 780, 1.1], node: (t) => {
    const k = ramp(t, T('he walks over anyway'), T('he walks over anyway') + 1.5), talk = t > T('hi im sam') && t < TE('at this table') ? 0.25 + 0.45 * Math.abs(Math.sin(t * 13)) : 0;
    return <Trio t={t} sam={{mood: 'determined', x: 300 + k * 330, open: talk}} sarah={{mood: 'happy'}} jake={{mood: 'neutral', look: [-0.9, 0]}} />;
  }},
  {at: T('not smooth'), cam: [960, 780, 1.1], node: (t) => <Trio t={t} sam={{mood: 'happy', x: 640}} sarah={{mood: 'happy', open: Math.max(0, Math.sin(t * 12)) * 0.5}}><Txt x={960} y={990} s={80} c="#ffd23f" o={ramp(t, T('not smooth'), T('not smooth') + 0.3)}>NOT SMOOTH. DOESN'T NEED TO BE.</Txt></Trio>},
  {at: T('she laughs'), cam: [960, 520, 1.05], node: (t) => <CardRow t={t} glow="#ff7ad8" cards={[{label: 'WORK', at: T('about work'), icon: 'office'}, {label: 'MUSIC', at: T('about music'), icon: 'phone'}, {label: 'HATING SMALL TALK', at: T('about hating small talk'), icon: 'eyes'}]}><Txt x={960} y={140} s={90} c="#ffb0d0" o={ramp(t, T('for an hour'), T('for an hour') + 0.3)}>AN HOUR.</Txt></CardRow>},
  {at: T('he gets her number'), cam: [960, 540, 1.04], node: (t) => <Digits t={t} />},
  {at: T('jake sees her too'), cam: [1360, 780, 1.12], node: (t) => (
    <OSolo t={t} bg="dinner" m={{who: 'jake', mood: 'tired', look: [-0.9, 0]}}>
      <ThoughtCloud t={t} items={[
        {text: 'WHAT DO I SAY FIRST?', at: T('what do i say first'), to: T('what if shes with someone'), x: 520, y: 220, s: 44},
        {text: "WHAT IF SHE'S WITH SOMEONE?", at: T('what if shes with someone'), to: T('what if i sound stupid'), x: 1420, y: 260, s: 44},
        {text: 'WHAT IF I SOUND STUPID?', at: T('what if i sound stupid'), to: T('wait till shes alone'), x: 520, y: 330, s: 44},
        {text: "WAIT TILL SHE'S ALONE.", at: T('wait till shes alone'), to: T('wait till i think'), x: 1420, y: 400, s: 44},
        {text: 'WAIT TILL I THINK OF SOMETHING BETTER.', at: T('wait till i think'), to: T('dont go now'), x: 520, y: 450, s: 40},
        {text: "DON'T GO NOW. IT'S TOO OBVIOUS.", at: T('dont go now'), x: 1420, y: 500, s: 44},
      ]} /></OSolo>)},
  {at: T('he rehearses'), cam: [960, 780, 1.1], node: (t) => <OSolo t={t} bg="dinner" m={{who: 'jake', mood: 'tired', look: [Math.sin(t * 3) * 0.9, 0]}}><RingG t={t} a={T('he rehearses')} b={T('he rehearses') + 1.4} total={12} unit="OPENERS" x={1560} y={330} r={140} /><Chip x={480} y={250} s={40} text="FUNNY ONE" c="#ffd23f" o={ramp(t, T('funny one'), T('funny one') + 0.2)} /><Chip x={480} y={340} s={40} text="DEEP ONE" c="#8a4fd8" o={ramp(t, T('deep one'), T('deep one') + 0.2)} /><Chip x={480} y={430} s={40} text="CASUAL ONE" c="#3b6fd8" o={ramp(t, T('casual one'), T('casual one') + 0.2)} /></OSolo>},
  {at: T('says zero of them'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={[{text: 'OPENERS REHEARSED: 12', at: T('says zero of them') - 0.3, to: T('says zero of them'), s: 90, y: 420}, {text: 'OPENERS SAID: 0', at: T('says zero of them'), s: 150, y: 620, c: '#ff4a5e'}]} glow="#ff4a5e" />},
  {at: T('picks up his phone'), cam: [960, 780, 1.1], node: (t) => <Trio t={t} sam={{mood: 'happy', open: Math.max(0, Math.sin(t * 9)) * 0.4}} sarah={{mood: 'happy', open: Math.max(0, Math.sin(t * 11)) * 0.5}} jake={{mood: 'sad', look: [Math.sin(t * 2.4) * 0.9, 0.2], pose: {arm: [50, 40], hand: 'relaxed'}}}><Txt x={1600} y={990} s={54} c="#cfe2ff" o={ramp(t, T('picks up his phone'), T('picks up his phone') + 0.3)}>LOOKS BUSY.</Txt></Trio>},
  {at: T('shes laughing with sam'), cam: [960, 780, 1.1], node: (t) => {
    const k = ramp(t, T('she leaves'), T('she leaves') + 1.2);
    return <Trio t={t} sam={{mood: 'happy', open: Math.max(0, Math.sin(t * 9)) * 0.4}} sarah={{mood: 'happy', x: 960 - k * 1200, open: k < 0.5 ? Math.max(0, Math.sin(t * 11)) * 0.5 : 0}} jake={{mood: 'sad', look: [-0.9, 0.2]}} />;
  }},
  {at: T('he goes home'), cam: [960, 700, 1.08], node: (t) => <BedSolo t={t} who="jake" eyes="open" mood="sad"><BeatsG t={t} beats={B_BRAVE} /></BedSolo>},
  {at: T('never been more prepared'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_PREP} glow="#ffd23f" />},
  {at: T('three days later'), cam: [960, 780, 1.1], node: (t) => <Trio t={t} bg="cafe" sam={{mood: 'happy', open: Math.max(0, Math.sin(t * 9)) * 0.4}} sarah={{mood: 'happy', open: Math.max(0, Math.sin(t * 11)) * 0.5}} jake={{mood: 'sad', look: [-0.9, 0.2], scale: 0.8}}><Pill x={960} y={70} text="3 DAYS LATER" c="#d84f8a" o={ramp(t, T('three days later'), T('three days later') + 0.3)} /></Trio>},
  {at: T('she wasnt that interesting'), cam: [960, 700, 1.08], node: (t) => <OSolo t={t} bg="cafe" m={{who: 'jake', mood: 'sad', look: [0.9, 0.2]}}><ThoughtCloud t={t} items={[{text: "SHE WASN'T THAT INTERESTING ANYWAY.", at: T('she wasnt that interesting'), x: 1000, y: 260, s: 46}]} /></OSolo>},
  {at: T('that night at 200'), cam: [1100, 500, 1.05], node: (t) => <Ceiling t={t} words={["SHE WASN'T…", 'LIAR.', 'WHAT IF I HAD…', 'WHY DIDN’T I', 'IF ONLY']} />},
  {at: T('your brain tells you'), cam: [960, 540, 1.04], node: (t) => <Beats t={t} beats={B_READY} glow="#3ddc84" />},
  {at: T('every time sam moves'), cam: [960, 540, 1.05], node: (t) => <Fear t={t} />},
];

export const POPS_2: TW[] = [
  {at: T('walks over anyway'), dur: 1.4, text: 'WALKS OVER ANYWAY.', accent: 2, mode: 'pop'},
  {at: T('she laughs'), dur: 1.1, text: 'SHE LAUGHS.', accent: 0, mode: 'pop'},
];
export const BUBBLES_2 = [
  {from: T('i dont know that yet'), to: TE('learn it fast') + 0.5, text: "I don't know that yet, but I can learn it fast.", x: 200, y: 160},
  {from: T('hi im sam'), to: TE('at this table') + 0.6, text: "Hi, I'm Sam. You have the best laugh at this table.", x: 180, y: 120},
];
export const CUES_2: Cue3[] = [
  {file: 'heartbeat', at: T('sams hands are cold'), dur: 8, vol: 0.1, loop: true}, {file: 'phone_tap', at: T('he gets her number') + 0.5, dur: 1.2, vol: 0.1}, {file: 'phone_notif', at: T('he gets her number') + 1.9, vol: 0.14},
  {file: 'stamp_hit', at: T('says zero of them'), vol: 0.22}, {file: 'pill_pop', at: T('second chance'), vol: 0.14}, {file: 'pill_pop', at: T('her name is sarah'), vol: 0.14},
  ...[T('voice cracks'), T('forgets a number'), T('new title'), T('more money'), T('more pressure')].map((at): Cue3 => ({file: 'kw_pop', at, vol: 0.14})),
  ...[T('what do i say first'), T('what if shes with someone'), T('what if i sound stupid'), T('wait till shes alone'), T('wait till i think'), T('dont go now')].map((at): Cue3 => ({file: 'glitch_hit', at, vol: 0.1})),
  {file: 'glass_clink', at: T('loud table'), vol: 0.14}, {file: 'shimmer', at: T('it comes from doing'), vol: 0.16},
  ...BEATS2.flat().map((b): Cue3 => ({file: 'text_pop', at: b.at, vol: 0.12})),
  ...BEATS2.flat().filter((b) => b.strike !== undefined).map((b): Cue3 => ({file: 'stamp_hit', at: b.strike as number, vol: 0.16})),
];
void [Hero, SAMV];
