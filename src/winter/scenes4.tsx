import React from 'react';
import {Hero, INK} from './Hero';
import {SideHero, SIDE} from './SideHero';
import {InsertBG} from '../same2d/inserts';
import {ramp} from '../same2d/fx';
import {MONT, DIGI} from '../same2d/theme';
import {T, TE} from './timeline';
import {Frame, RoomArt, Txt, SAM, JAKE} from './scenes';
import {RingG} from './scenes2';

// ============================================================================================
// WINTER ARC scenes, fourth part (Quitter's Day, Jake's nine days, Sam's worst-day plan, the mirror, progress, the membership). `t` is the ABSOLUTE video time.
// ============================================================================================

// ---------------- the app chart that finds the day most people give up ----------------
export const StravaChart: React.FC<{t: number}> = ({t}) => {
  const a = T('strava'), mark = T('the day most people'), st = T('quitters day');
  return (
    <InsertBG glow="#ff7a3a">
      <g transform="translate(960 540)">
        <rect x={-640} y={-360} width={1280} height={700} rx={40} fill="#14172e" stroke={INK} strokeWidth={10} />
        <Txt x={-600} y={-290} s={44} anchor="start" c="#ff8a4a" font={DIGI} ls={2}>MILLIONS OF WORKOUTS · JANUARY</Txt>
        {Array.from({length: 28}, (_, i) => {
          const h = (300 * (1 - 0.72 * Math.min(1, i / 12)) + (i > 12 ? 20 * Math.sin(i * 1.7) : 0)) * ramp(t, a + i * 0.05, a + i * 0.05 + 0.35), hit = i === 11 && t > mark;
          return <rect key={i} x={-590 + i * 42} y={290 - h} width={30} height={h} rx={8} fill={hit ? '#ff4a5e' : '#4a78d8'} stroke={INK} strokeWidth={4} />;
        })}
        <path d="M -600,292 L 600,292" stroke="#3a4070" strokeWidth={6} />
      </g>
      {t > st && <g transform={`translate(1060 360) rotate(-8) scale(${0.8 + 0.2 * ramp(t, st, st + 0.2)})`} opacity={ramp(t, st, st + 0.15)}><rect x={-300} y={-70} width={600} height={140} rx={16} fill="none" stroke="#ff4a5e" strokeWidth={14} /><Txt x={0} y={30} s={92} c="#ff4a5e" ls={4}>QUITTER'S DAY</Txt></g>}
    </InsertBG>
  );
};
export const MonthGrid: React.FC<{t: number}> = ({t}) => {
  const hi = ramp(t, T('second week'), T('second week') + 0.4);
  return (
    <InsertBG glow="#ff4a5e">
      <g transform="translate(960 540)">
        <rect x={-460} y={-340} width={920} height={680} rx={36} fill="#f4f6ff" stroke={INK} strokeWidth={10} /><rect x={-460} y={-340} width={920} height={120} rx={36} fill="#3b6fd8" stroke={INK} strokeWidth={10} /><Txt x={0} y={-250} s={80} ls={8}>JANUARY</Txt>
        {Array.from({length: 35}, (_, i) => { const r = Math.floor(i / 7), c = i % 7, on = r === 1; return <circle key={i} cx={-360 + c * 120} cy={-150 + r * 118} r={34} fill={on ? `rgba(255,74,94,${0.2 + 0.8 * hi})` : '#dfe3f7'} stroke={INK} strokeWidth={5} />; })}
        <rect x={-430} y={-150 + 118 - 56} width={860} height={112} rx={56} fill="none" stroke="#ff4a5e" strokeWidth={10} opacity={hi} />
      </g>
      <g opacity={hi}><Txt x={1500} y={620} s={70} c="#ff4a5e">2ND WEEK</Txt></g>
    </InsertBG>
  );
};
export const NineG: React.FC<{t: number; a: number}> = ({t, a}) => (
  <g>{Array.from({length: 9}, (_, i) => { const k = ramp(t, a + i * 0.12, a + i * 0.12 + 0.25); return <g key={i} transform={`translate(${520 + i * 110} 860)`} opacity={k}><circle r={44} fill="#3ddc84" stroke={INK} strokeWidth={6} /><path d="M -18,2 L -4,16 L 20,-12" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>; })}</g>
);
export const XsG: React.FC<{t: number; a: number}> = ({t, a}) => (
  <g>{Array.from({length: 4}, (_, i) => { const k = ramp(t, a + i * 0.45, a + i * 0.45 + 0.2); return <g key={i} transform={`translate(${690 + i * 180} 800) scale(${0.6 + 0.4 * k})`} opacity={k}><circle r={60} fill="#2a1f52" stroke={INK} strokeWidth={7} /><path d="M -28,-28 L 28,28 M 28,-28 L -28,28" stroke="#ff4a5e" strokeWidth={14} strokeLinecap="round" /></g>; })}</g>
);
export const PainG: React.FC<{t: number; pts: [number, number][]}> = ({t, pts}) => <g>{pts.map(([x, y], i) => <text key={i} x={x} y={y + Math.sin(t * 9 + i) * 5} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={90} fill="#ff6a6a" stroke={INK} strokeWidth={9} paintOrder="stroke" transform={`rotate(${i ? 12 : -12} ${x} ${y})`}>!</text>)}</g>;
export const RainG: React.FC<{t: number}> = ({t}) => <g stroke="#9fc4ff" strokeWidth={3} opacity={0.55} strokeLinecap="round">{Array.from({length: 90}, (_, i) => { const x = (i * 97) % 1980 - 30, y = ((i * 61 + t * 1100 * (0.8 + (i % 4) * 0.12)) % 1200) - 60; return <path key={i} d={`M ${x},${y} L ${x - 14},${y + 46}`} />; })}</g>;

export const PizzaKitchen: React.FC<{t: number}> = ({t}) => {
  const bite = ramp(t, T('day six'), T('kitchen')), chew = Math.max(0, Math.sin(t * 12)) * 0.5;
  return (
    <Frame>
      <rect width={1920} height={1080} fill="#2a3358" />{Array.from({length: 14}, (_, i) => <path key={i} d={`M ${i * 140},0 L ${i * 140},800`} stroke="#222a4c" strokeWidth={4} />)}
      <rect x={1380} y={160} width={300} height={700} rx={22} fill="#c9ced8" stroke={INK} strokeWidth={9} /><path d="M 1380,420 L 1680,420" stroke={INK} strokeWidth={7} /><rect x={1630} y={260} width={14} height={90} rx={7} fill="#7a809a" /><rect x={1630} y={500} width={14} height={160} rx={7} fill="#7a809a" />
      <rect y={860} width={1920} height={220} fill="#1b1f3c" /><rect x={0} y={800} width={1380} height={70} fill="#6a4a3a" stroke={INK} strokeWidth={8} />
      <g transform="translate(1000 760)"><rect x={-260} y={-30} width={520} height={50} rx={10} fill="#d9a05a" stroke={INK} strokeWidth={8} />
        <ellipse cx={0} cy={-50} rx={230} ry={70} fill="#f2c27a" stroke={INK} strokeWidth={8} /><ellipse cx={0} cy={-56} rx={190} ry={48} fill="#e0503a" opacity={0.85} />{[[-90, -60], [20, -40], [90, -70], [-20, -76], [140, -50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={20} fill="#b8312a" stroke={INK} strokeWidth={4} />)}
        <path d={`M 0,-50 L ${230 * Math.cos(bite * 1.2)},${-50 - 70 * Math.sin(bite * 1.2)} L ${230 * Math.cos(bite * 1.2 + 0.9)},${-50 - 70 * Math.sin(bite * 1.2 + 0.9)} Z`} fill="#2a3358" opacity={bite > 0.05 ? 1 : 0} /></g>
      <Hero x={620} y={1060} scale={1.1} t={t} id="pk" mood="happy" open={chew} fat={0.55} cast="colleague" top="hoodie" topColor={JAKE.topColor} pose="belly" />
      <g transform="translate(960 150)"><rect x={-110} y={-36} width={220} height={72} rx={36} fill="#d84f8a" stroke={INK} strokeWidth={7} /><Txt x={0} y={16} s={44} ls={3}>DAY 6</Txt></g>
    </Frame>
  );
};

// ---------------- the mirror: the same man looks back ----------------
export const MirrorShot: React.FC<{t: number; count?: boolean; leave?: number; mood?: any; open?: number; label?: string; man?: {fat: number; muscle: number; topColor: string; cast?: any}}> = ({t, count, leave = 0, mood = 'neutral', open, label, man = {fat: 0.4, muscle: 0.12, topColor: SAM.topColor}}) => {
  const n = count ? Math.round(45 * ramp(t, T('45 mornings') - 0.2, T('45 mornings') + 1.0)) : 45, sx = 560 + leave * 1100, fade = 1 - leave;
  return (
    <Frame>
      <rect width={1920} height={1080} fill="#17223f" />{Array.from({length: 12}, (_, i) => <path key={i} d={`M ${i * 160},0 L ${i * 160},1080`} stroke="#101a33" strokeWidth={4} />)}
      <defs><clipPath id="mir"><rect x={1060} y={150} width={640} height={720} rx={30} /></clipPath></defs>
      <rect x={1040} y={130} width={680} height={760} rx={40} fill="#3a2b54" stroke={INK} strokeWidth={10} /><rect x={1060} y={150} width={640} height={720} rx={30} fill="#5d7fb8" />
      <g clipPath="url(#mir)"><rect x={1060} y={150} width={640} height={720} fill="#a9c4ee" opacity={0.25} /><g opacity={0.85 * fade}><Hero x={1380} y={1000} scale={0.95} flip t={t} id="mr" mood={mood} fat={man.fat} muscle={man.muscle} cast={man.cast} top="tee" topColor={man.topColor} pose="idle" /></g><path d="M 1060,300 L 1400,150 L 1520,150 L 1060,420 Z" fill="#fff" opacity={0.1} /></g>
      <Hero x={sx} y={1060} scale={1.1} t={t} id="ms" mood={mood} open={open} fat={man.fat} muscle={man.muscle} cast={man.cast} top="tee" topColor={man.topColor} pose="idle" />
      <g transform="translate(560 130)"><rect x={-190} y={-44} width={380} height={88} rx={44} fill="#3ddc84" stroke={INK} strokeWidth={7} /><Txt x={0} y={20} s={52} ls={2}>{label ?? 'MORNING ' + n}</Txt></g>
    </Frame>
  );
};

// ---------------- progress that shows up everywhere else ----------------
export const WeightBars: React.FC<{t: number}> = ({t}) => {
  const a = T('the weight on the bar');
  return (
    <InsertBG glow="#3ddc84">
      <g transform="translate(960 560)">
        {Array.from({length: 7}, (_, i) => { const h = (70 + i * 48) * ramp(t, a + 0.3 + i * 0.4, a + 0.3 + i * 0.4 + 0.4); return <g key={i}><rect x={-540 + i * 160} y={260 - h} width={110} height={h} rx={12} fill="#3ddc84" stroke={INK} strokeWidth={6} /><Txt x={-485 + i * 160} y={320} s={34}>W{i + 1}</Txt></g>; })}
        <Txt x={0} y={-310} s={90} c="#ffd23f" o={ramp(t, a, a + 0.3)}>THE BAR GOES UP</Txt>
      </g>
    </InsertBG>
  );
};
export const Stairs: React.FC<{t: number}> = ({t}) => {
  const a = T('the stairs at work'), k = ramp(t, a, a + 2.0);
  return (
    <InsertBG glow="#6fa0ff">
      <g>{Array.from({length: 7}, (_, i) => <rect key={i} x={300 + i * 150} y={900 - i * 62} width={150} height={62 * (i + 1) + 300} fill={i % 2 ? '#3a3f78' : '#2f3466'} stroke={INK} strokeWidth={6} />)}</g>
      <SideHero x={420 + k * 780} y={900 - k * 372} scale={0.62} t={t} id="st5" mood="happy" fat={0.35} muscle={0.2} pose={{...SIDE.stand, footN: [18 + Math.sin(t * 9) * 30, -28 - Math.max(0, Math.cos(t * 9)) * 20], footF: [-14 - Math.sin(t * 9) * 30, -28 - Math.max(0, -Math.cos(t * 9)) * 20]}} top="tee" topColor={SAM.topColor} />
      <Txt x={1500} y={300} s={90} c="#3ddc84" o={ramp(t, T('dont leave'), T('dont leave') + 0.3)}>NO HUFFING.</Txt>
    </InsertBG>
  );
};
export const TenVsHour: React.FC<{t: number}> = ({t}) => {
  const a = T('he falls asleep'), s = ramp(t, T('an hour') - 0.2, T('an hour') + 0.3);
  return (
    <InsertBG glow="#6fa0ff">
      <g opacity={0.9 - 0.5 * s}><RingG t={t} a={a} b={a + 1.2} total={60} unit="MIN" x={560} y={500} r={210} c="#ff6a6a" /></g>
      {s > 0 && <path d="M 380,320 L 740,680" stroke="#ff4a5e" strokeWidth={22} strokeLinecap="round" opacity={s} />}
      <RingG t={t} a={T('10 minutes instead')} b={T('10 minutes instead') + 1.0} total={10} unit="MIN" x={1360} y={500} r={210} c="#3ddc84" />
      <Txt x={560} y={850} s={70} c="#ff9a6a">BEFORE: AN HOUR</Txt><Txt x={1360} y={850} s={70} c="#3ddc84" o={ramp(t, T('10 minutes instead'), T('10 minutes instead') + 0.3)}>NOW: 10 MINUTES</Txt>
    </InsertBG>
  );
};
export const BookStack: React.FC<{t: number}> = ({t}) => {
  const a = T('read four'), cols = ['#2f7d5b', '#c9602e', '#3b6fd8', '#8a4fd8'];
  return (
    <InsertBG glow="#ffb25a">
      <g transform="translate(960 880)">{cols.map((c, i) => { const k = ramp(t, a + i * 0.35, a + i * 0.35 + 0.25); return <g key={i} opacity={k} transform={`translate(${(i % 2 ? 14 : -10)} ${-i * 120 - (1 - k) * 60})`}><rect x={-300} y={-110} width={600} height={110} rx={12} fill={c} stroke={INK} strokeWidth={8} /><rect x={-290} y={-70} width={580} height={22} fill="#f8f1dc" opacity={0.9} /><Txt x={0} y={-24} s={40} ls={4}>BOOK {i + 1}</Txt></g>; })}</g>
      <Txt x={960} y={220} s={150} c="#ffd23f" o={ramp(t, a + 1.2, a + 1.5)}>4 BOOKS</Txt>
    </InsertBG>
  );
};
export const WeekStrip: React.FC<{t: number; a: number; y: number}> = ({t, a, y}) => (
  <g transform={`translate(0 ${y})`}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => { const on = i === 1 || i === 4, k = ramp(t, a + (on ? (i === 1 ? 0 : 0.3) : 0), a + 0.3); return <g key={i} transform={`translate(${460 + i * 170} 0)`} opacity={ramp(t, a - 0.1, a + 0.2)}><rect x={-62} y={-62} width={124} height={124} rx={20} fill={on ? `rgba(61,220,132,${k})` : '#1d2248'} stroke={INK} strokeWidth={7} /><Txt x={0} y={14} s={50}>{d}</Txt></g>; })}</g>
);
export const MinimumCards: React.FC<{t: number}> = ({t}) => {
  const items = [['20 MIN', T('20 minutes', 2)], ['10 PAGES', T('10 pages', 1)], ['BED BY 11', T('in bed by')]] as const;
  return (
    <InsertBG glow="#3ddc84">
      {items.map(([label, at], i) => {
        const k = ramp(t, at - 0.05, at + 0.3), x = 360 + i * 600;
        return (
          <g key={label} transform={`translate(${x} ${520 + (1 - k) * 60})`} opacity={k}>
            <rect x={-250} y={-280} width={500} height={540} rx={40} fill="#1d2248" stroke={INK} strokeWidth={9} />
            {i === 0 && <g><circle r={120} fill="#e8eafb" stroke={INK} strokeWidth={8} /><path d="M 0,0 L 0,-80 M 0,0 L 56,30" stroke={INK} strokeWidth={12} strokeLinecap="round" /></g>}
            {i === 1 && <g><rect x={-130} y={-110} width={120} height={180} rx={8} fill="#f8f1dc" stroke={INK} strokeWidth={8} /><rect x={10} y={-110} width={120} height={180} rx={8} fill="#f8f1dc" stroke={INK} strokeWidth={8} /><path d="M -100,-70 L -30,-70 M -100,-30 L -30,-30 M 40,-70 L 100,-70 M 40,-30 L 100,-30" stroke="#b8ae92" strokeWidth={9} strokeLinecap="round" /></g>}
            {i === 2 && <g><circle r={110} fill="#e9efff" stroke={INK} strokeWidth={8} /><circle cx={44} cy={-20} r={96} fill="#1d2248" /></g>}
            <Txt x={0} y={200} s={66} ls={2}>{label}</Txt>
          </g>
        );
      })}
    </InsertBG>
  );
};
export const DayBars: React.FC<{t: number}> = ({t}) => {
  const cols = [['GOOD DAY', 1.0, '#3ddc84', T('on a good day')], ['BAD DAY', 0.35, '#ffd23f', T('on a bad day')], ['ZERO', 0, '#ff4a5e', T('never does zero')]] as const;
  return (
    <InsertBG glow="#3ddc84">
      {cols.map(([label, h, c, at], i) => {
        const k = ramp(t, at, at + 0.4), x = 460 + i * 500;
        return (
          <g key={label} transform={`translate(${x} 0)`} opacity={ramp(t, at - 0.05, at + 0.2)}>
            <rect x={-110} y={800 - 520 * (h as number) * k - 4} width={220} height={520 * (h as number) * k + 4} rx={16} fill={c} stroke={INK} strokeWidth={8} />
            {h === 0 && <g><path d="M -110,796 L 110,796" stroke={INK} strokeWidth={12} /><path d="M -90,560 L 90,740 M 90,560 L -90,740" stroke="#ff4a5e" strokeWidth={26} strokeLinecap="round" opacity={k} /></g>}
            <Txt x={0} y={900} s={60} ls={2}>{label}</Txt>
          </g>
        );
      })}
    </InsertBG>
  );
};
export const CardCharge: React.FC<{t: number}> = ({t}) => {
  const a = T('charges'), b = T('he hasnt used it');
  return (
    <InsertBG glow="#ff6a6a">
      <g transform={`translate(560 540) rotate(-6)`}><rect x={-300} y={-190} width={600} height={380} rx={34} fill="#2f3a7a" stroke={INK} strokeWidth={10} /><rect x={-300} y={-110} width={600} height={70} fill="#12151f" /><rect x={-250} y={20} width={110} height={80} rx={14} fill="#ffd23f" stroke={INK} strokeWidth={6} /><Txt x={-250} y={150} s={44} anchor="start" font={DIGI} ls={3}>•••• •••• 4821</Txt></g>
      <g transform={`translate(1330 ${360 + (1 - ramp(t, a, a + 0.35)) * -60})`} opacity={ramp(t, a, a + 0.3)}><rect x={-330} y={-70} width={660} height={140} rx={30} fill="#f4f6ff" stroke={INK} strokeWidth={8} /><Txt x={-290} y={-6} s={40} anchor="start" c="#1b1a3a">GYM MEMBERSHIP</Txt><Txt x={-290} y={44} s={34} anchor="start" c="#7a809a">charged on schedule</Txt><Txt x={290} y={22} s={64} anchor="end" c="#ff4a5e">-$49</Txt></g>
      <g transform="translate(1330 700)" opacity={ramp(t, b, b + 0.3)}><rect x={-330} y={-170} width={660} height={340} rx={30} fill="#1d2248" stroke={INK} strokeWidth={8} />{Array.from({length: 28}, (_, i) => <circle key={i} cx={-270 + (i % 7) * 90} cy={-100 + Math.floor(i / 7) * 80} r={26} fill="#2a2f6a" stroke={INK} strokeWidth={4} />)}<Txt x={0} y={150} s={48} c="#ff9a6a">VISITS THIS MONTH: 0</Txt></g>
    </InsertBG>
  );
};
