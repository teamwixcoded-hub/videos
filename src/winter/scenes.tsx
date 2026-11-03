import React from 'react';
import {Hero, INK} from './Hero';
import {SideHero, SIDE, SidePose} from './SideHero';
import {InsertBG} from '../same2d/inserts';
import {ramp} from '../same2d/fx';
import {MONT, DIGI} from '../same2d/theme';
import {T, TE} from './timeline';

// ============================================================================================
// WINTER ARC scenes (first minute). All are plain SVG, drawn from the Hero / SideHero rigs. `t` is always the ABSOLUTE video time, so every beat can sit on T('a phrase').
// ============================================================================================
export const ROOM = {snow: true};   // the Overthinking video sets this to false: no snow outside the window
export const SAM = {top: 'tee' as const, topColor: '#e9962c'};
export const JAKE = {top: 'hoodie' as const, topColor: '#6b4fc4', cast: 'colleague' as const};
const hex = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a: string, b: string, k: number) => { const x = hex(a), y = hex(b); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',')})`; };

export const Frame: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = '#0b0e22'}) => (
  <div style={{position: 'absolute', inset: 0, background: bg, overflow: 'hidden'}}><svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>{children}</svg></div>
);
export const Txt: React.FC<{x: number; y: number; s: number; c?: string; o?: number; w?: number; anchor?: 'middle' | 'start' | 'end'; font?: string; children: React.ReactNode; ls?: number}> = ({x, y, s, c = '#fff', o = 1, anchor = 'middle', font = MONT, children, ls = 0}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={font} fontWeight={800} fontSize={s} fill={c} opacity={o} letterSpacing={ls} stroke={INK} strokeWidth={s * 0.1} paintOrder="stroke" strokeLinejoin="round">{children}</text>
);

// ---------------- the cold bedroom: wall, window with snow, floor ----------------
export const RoomArt: React.FC<{t: number; dawn?: number}> = ({t, dawn = 0}) => (
  <g>
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix('#161d3f', '#3b4f80', dawn)} /><stop offset="1" stopColor={mix('#0d1125', '#26325a', dawn)} /></linearGradient>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix('#070b22', '#7aa8dc', dawn)} /><stop offset="1" stopColor={mix('#1a2652', '#d6e6f7', dawn)} /></linearGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9cc4ff" stopOpacity={0.16 + dawn * 0.2} /><stop offset="1" stopColor="#9cc4ff" stopOpacity="0" /></linearGradient>
      <clipPath id="win"><rect x={776} y={146} width={368} height={404} /></clipPath>
    </defs>
    <rect width={1920} height={1080} fill="url(#wall)" />
    <rect x={0} y={800} width={1920} height={280} fill="#171428" />
    {Array.from({length: 7}, (_, i) => <path key={i} d={`M 0,${830 + i * 42} L 1920,${830 + i * 42}`} stroke="#0f0c1d" strokeWidth={4} opacity={0.7} />)}
    <rect x={0} y={786} width={1920} height={16} fill="#2a2346" stroke={INK} strokeWidth={4} />
    <polygon points="776,550 1144,550 1500,1000 420,1000" fill="url(#beam)" />
    <rect x={776} y={146} width={368} height={404} fill="url(#sky)" />
    <g clipPath="url(#win)">
      <circle cx={1060} cy={236} r={36} fill="#e9efff" opacity={0.85 - dawn * 0.6} /><circle cx={1046} cy={226} r={30} fill="#aab6dc" opacity={0.25} />
      <g fill="#cfdcff" opacity={ROOM.snow ? 1 : 0}>
        {Array.from({length: 46}, (_, i) => { const sp = 34 + (i % 5) * 16, y = 146 + ((i * 59 + t * sp) % 404), x = 776 + ((i * 83) % 368) + Math.sin(t * 1.3 + i) * 8; return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} opacity={0.5 + (i % 4) * 0.12} />; })}
      </g>
      <path d="M 776,550 L 776,470 Q 840,500 900,550 Z M 1144,146 L 1144,224 Q 1080,190 1030,146 Z" fill="#fff" opacity={0.25} />
    </g>
    <rect x={776} y={146} width={368} height={404} fill="none" stroke={INK} strokeWidth={12} /><path d="M 960,146 L 960,550 M 776,348 L 1144,348" stroke={INK} strokeWidth={10} />
    <rect x={758} y={550} width={404} height={24} rx={6} fill="#3a3f78" stroke={INK} strokeWidth={6} />
  </g>
);

// ---------------- a bed with a man in it (drawn on the left; the right one is mirrored) ----------------
export const lieHead = (extra: Partial<SidePose> = {}): SidePose => ({...SIDE.lie, head: -66, turn: 0.15, ...extra});
export const BedMan: React.FC<{t: number; who: 'sam' | 'jake'; eyes: 'closed' | 'open'; phone?: boolean; jolt?: number; id: string; mood?: any; z?: boolean; open?: number}> = ({t, who, eyes, phone, jolt = 0, id, mood = 'tired', z, open}) => {
  const cfg = who === 'sam' ? SAM : JAKE, blanket = who === 'sam' ? '#2f7a96' : '#5a3fb0';
  const pose = lieHead(phone ? {handN: [70, -196], handF: [52, -186], heldN: 'phone', handKindN: 'relaxed'} : {});
  const up = jolt * 10;
  return (
    <g>
      <rect x={96} y={826} width={676} height={58} rx={10} fill="#2a2146" stroke={INK} strokeWidth={7} /><rect x={112} y={880} width={26} height={74} fill="#1a1530" stroke={INK} strokeWidth={6} /><rect x={730} y={880} width={26} height={74} fill="#1a1530" stroke={INK} strokeWidth={6} />
      <rect x={742} y={610} width={40} height={274} rx={12} fill="#3a2b54" stroke={INK} strokeWidth={7} />
      <rect x={100} y={778} width={660} height={52} rx={20} fill="#3d4180" stroke={INK} strokeWidth={7} />
      <ellipse cx={690} cy={752} rx={84} ry={34} fill="#e2e6ff" stroke={INK} strokeWidth={7} />
      <g transform={`translate(0 ${-up})`}>
        <SideHero x={486} y={742} scale={0.78} t={t} open={open} cast={who === 'jake' ? 'colleague' : undefined} id={id} mood={eyes === 'open' ? mood : 'tired'} blink={eyes === 'closed' ? 1 : 0} fat={0.5} pose={pose} {...cfg} />
      </g>
      <path d={`M 118,788 C 118,716 160,702 220,708 C 320,690 420,700 520,712 C 560,716 566,760 560,792 L 118,792 Z`} fill={blanket} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 140,730 C 220,722 320,716 440,726" stroke="#fff" strokeWidth={10} opacity={0.16} fill="none" strokeLinecap="round" />
      <path d="M 520,712 C 556,722 560,760 556,790" stroke={INK} strokeWidth={6} fill="none" opacity={0.4} />
      {z && [0, 1, 2].map((i) => { const k = ((t * 0.5 + i / 3) % 1); return <text key={i} x={700 + i * 26 + k * 20} y={640 - k * 90 - i * 20} fontFamily={MONT} fontWeight={800} fontSize={34 + i * 12} fill="#cfd8ff" opacity={Math.sin(k * Math.PI) * 0.8}>z</text>; })}
      {phone && <ellipse cx={640} cy={650} rx={220} ry={130} fill="#4aa8ff" opacity={0.12 + 0.05 * Math.sin(t * 5)} style={{filter: 'blur(18px)'}} />}
    </g>
  );
};
export const Clock: React.FC<{t: number; ring: number; label?: string}> = ({t, ring, label = '6:00'}) => {
  const sh = ring * Math.sin(t * 70) * 4;
  return (
    <g transform={`translate(${960 + sh} 702) rotate(${ring * Math.sin(t * 60) * 3})`}>
      <rect x={-80} y={-56} width={160} height={110} rx={18} fill="#1a1224" stroke={INK} strokeWidth={8} /><rect x={-64} y={-42} width={128} height={78} rx={10} fill="#12080c" />
      <text x={0} y={22} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={64} fill="#ff4a4a" style={{filter: 'drop-shadow(0 0 8px #ff2a2a)'}}>{label}</text>
      <circle cx={-56} cy={-66} r={16} fill="#c9ced8" stroke={INK} strokeWidth={5} /><circle cx={56} cy={-66} r={16} fill="#c9ced8" stroke={INK} strokeWidth={5} />
      {ring > 0 && [0, 1, 2].map((i) => <path key={i} d={`M ${110 + i * 22},${-40 - i * 12} Q ${130 + i * 22},-10 ${110 + i * 22},${20 + i * 12}`} stroke="#ffd23f" strokeWidth={7} fill="none" strokeLinecap="round" opacity={ring * (0.5 + 0.5 * Math.sin(t * 20 + i))} />)}
      {ring > 0 && [0, 1, 2].map((i) => <path key={'l' + i} d={`M ${-110 - i * 22},${-40 - i * 12} Q ${-130 - i * 22},-10 ${-110 - i * 22},${20 + i * 12}`} stroke="#ffd23f" strokeWidth={7} fill="none" strokeLinecap="round" opacity={ring * (0.5 + 0.5 * Math.sin(t * 20 + i))} />)}
      <rect x={-70} y={54} width={140} height={90} rx={8} fill="#3a2b54" stroke={INK} strokeWidth={6} />
    </g>
  );
};
export const Room: React.FC<{t: number; dawn?: number; sam?: 'closed' | 'open'; jake?: 'closed' | 'open'; ring?: number; phones?: boolean; jolt?: number; zzz?: boolean; mood?: any; samOpen?: number; jakeOpen?: number}> = ({t, dawn = 0, sam = 'closed', jake = 'closed', ring = 0, phones, jolt = 0, zzz, mood, samOpen, jakeOpen}) => (
  <Frame>
    <RoomArt t={t} dawn={dawn} />
    <Clock t={t} ring={ring} />
    <BedMan t={t} who="sam" eyes={sam} phone={phones} jolt={jolt} id="bs" mood={mood} z={zzz} open={samOpen} />
    <g transform="translate(1920 0) scale(-1 1)"><BedMan t={t} who="jake" eyes={jake} phone={phones} jolt={jolt} id="bj" mood={mood} z={zzz} open={jakeOpen} /></g>
  </Frame>
);

// ---------------- the two men standing, front view ----------------
export type Man = {fat?: number; muscle?: number; top?: 'tee' | 'hoodie' | 'tank' | 'bare'; mood?: any; pose?: any; y?: number; x?: number; scale?: number; open?: number};
export const Pill: React.FC<{x: number; y: number; text: string; c: string; o?: number}> = ({x, y, text, c, o = 1}) => (
  <g opacity={o} transform={`translate(${x} ${y - 8 * (1 - o)})`}><rect x={-96} y={-34} width={192} height={66} rx={33} fill={c} stroke={INK} strokeWidth={7} /><Txt x={0} y={14} s={38} ls={3}>{text}</Txt></g>
);
export const TwoMen: React.FC<{t: number; sam?: Man; jake?: Man; dawn?: number; children?: React.ReactNode; bg?: boolean}> = ({t, sam = {}, jake = {}, dawn = 0, children, bg = true}) => (
  <Frame>
    {bg && <RoomArt t={t} dawn={dawn} />}
    <Hero t={t} open={sam.open} x={sam.x ?? 560} y={sam.y ?? 1040} scale={sam.scale ?? 1.02} id="fs" mood={sam.mood ?? 'tired'} fat={sam.fat ?? 0.5} muscle={sam.muscle ?? 0} top={sam.top ?? 'hoodie'} topColor={SAM.topColor} pose={sam.pose ?? 'idle'} />
    <Hero t={t} cast="colleague" open={jake.open} x={jake.x ?? 1360} y={jake.y ?? 1040} scale={jake.scale ?? 1.02} id="fj" mood={jake.mood ?? 'tired'} fat={jake.fat ?? 0.5} muscle={jake.muscle ?? 0} top={jake.top ?? 'hoodie'} topColor={JAKE.topColor} pose={jake.pose ?? 'idle'} />
    {children}
  </Frame>
);

// ---------------- inserts ----------------
export const DayCard: React.FC<{t: number; month?: string; day?: string; clock?: boolean}> = ({t, month = 'DECEMBER', day = '1', clock = true}) => {
  const k = ramp(t, 0.1, 0.8);
  return (
    <InsertBG glow="#6fa0ff">
      <g transform={`translate(700 ${540 + (1 - k) * 80}) rotate(${-3 + (1 - k) * 8})`} opacity={k}>
        <rect x={-300} y={-330} width={600} height={660} rx={34} fill="#f4f6ff" stroke={INK} strokeWidth={10} /><path d="M -300,-330 L 300,-330 L 300,-190 L -300,-190 Z" fill="#3b6fd8" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <Txt x={0} y={-228} s={78} ls={8}>{month}</Txt><text x={0} y={150} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={420} fill="#1b1a3a">{day}</text>
        {[-200, 200].map((x) => <rect key={x} x={x - 12} y={-366} width={24} height={64} rx={10} fill="#c9ced8" stroke={INK} strokeWidth={6} />)}
      </g>
      <g transform="translate(1340 560)" opacity={clock ? ramp(t, 0.8, 1.4) : 0}><g transform={`rotate(${Math.sin(t * 40) * (t > 2 ? 3 : 0)})`}>
        <circle r={190} fill="#e8eafb" stroke={INK} strokeWidth={10} /><circle r={160} fill="#fff" stroke="#c9ced8" strokeWidth={5} />
        {Array.from({length: 12}, (_, i) => <path key={i} d={`M 0,-150 L 0,-132`} stroke={INK} strokeWidth={i % 3 ? 5 : 9} transform={`rotate(${i * 30})`} />)}
        <path d="M 0,0 L 0,-100" stroke={INK} strokeWidth={12} strokeLinecap="round" transform="rotate(180)" /><path d="M 0,0 L 0,-120" stroke="#ff4a4a" strokeWidth={8} strokeLinecap="round" />
        <circle r={12} fill={INK} />
      </g><Txt x={0} y={300} s={92} c="#ffd23f" font={DIGI}>6:00 AM</Txt></g>
    </InsertBG>
  );
};
export const PromiseCards: React.FC<{t: number}> = ({t}) => {
  const t0 = T('every'), step = 0.36;
  return (
    <InsertBG glow="#9b7be4">
      {Array.from({length: 5}, (_, i) => {
        const k = ramp(t, t0 + i * step, t0 + i * step + 0.3), x = 250 + i * 355;
        return (
          <g key={i} transform={`translate(${x} ${470 + (1 - k) * 70}) rotate(${(i - 2) * 3})`} opacity={k}>
            <rect x={-150} y={-190} width={300} height={380} rx={26} fill="#eef1ff" stroke={INK} strokeWidth={8} /><rect x={-150} y={-190} width={300} height={90} rx={26} fill="#5a79d6" stroke={INK} strokeWidth={8} />
            <Txt x={0} y={-124} s={46} ls={3}>WINTER {i + 1}</Txt>
            <g stroke="#7aa8ff" strokeWidth={7} strokeLinecap="round">{[0, 60, 120].map((a) => <path key={a} d="M 0,-60 L 0,60" transform={`translate(0 20) rotate(${a})`} />)}</g>
            <Txt x={0} y={150} s={30} c="#1b1a3a" o={0.9}>I'LL CHANGE</Txt>
          </g>
        );
      })}
    </InsertBG>
  );
};
export const MarchCal: React.FC<{t: number}> = ({t}) => {
  const months: [string, number][] = [['DEC', T('90')], ['JAN', T('from')], ['FEB', T('now')], ['MARCH', T('march')]];
  const cur = months.reduce((n, m, i) => (t >= m[1] - 0.05 ? i : n), 0), k = ramp(t, months[cur][1] - 0.05, months[cur][1] + 0.2), isM = cur === 3;
  const days = Math.round(90 * ramp(t, T('90'), T('march')));
  return (
    <InsertBG glow={isM ? '#ffd23f' : '#6fa0ff'}>
      <g transform={`translate(960 ${520 + (1 - k) * 40}) scale(${0.9 + 0.1 * k})`}>
        <rect x={-330} y={-300} width={660} height={560} rx={34} fill="#f4f6ff" stroke={INK} strokeWidth={10} /><rect x={-330} y={-300} width={660} height={160} rx={34} fill={isM ? '#3ddc84' : '#3b6fd8'} stroke={INK} strokeWidth={10} />
        <Txt x={0} y={-186} s={110} ls={8}>{months[cur][0]}</Txt>
        {Array.from({length: 21}, (_, i) => <circle key={i} cx={-240 + (i % 7) * 80} cy={-70 + Math.floor(i / 7) * 80} r={24} fill={isM && i === 13 ? '#3ddc84' : '#dfe3f7'} stroke={INK} strokeWidth={4} />)}
      </g>
      <Txt x={960} y={940} s={130} c="#ffd23f" font={DIGI} ls={4}>{days} DAYS</Txt>
    </InsertBG>
  );
};
export const Cards: React.FC<{t: number}> = ({t}) => {
  const t1 = T('talent'), t2 = T('money'), t3 = T('decision', 0), t4 = T('one cold'), t5 = T('today');
  const A = (a: number, d = 0.3) => ramp(t, a, a + d), gone = ramp(t, t3 - 0.15, t3 + 0.2);
  const row = (y: number, text: string, bad: number) => (
    <g opacity={A(bad - 0.9) * (1 - gone)} transform={`translate(0 ${y})`}>
      <Txt x={960} y={0} s={190} c="#eef1ff">{text}</Txt>
      <path d="M 520,-60 L 1400,-60" stroke="#ff4a5e" strokeWidth={20} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - ramp(t, bad, bad + 0.25))} />
    </g>
  );
  return (
    <InsertBG glow="#6fa0ff">
      {row(430, 'TALENT', t1 + 0.45)}{row(690, 'MONEY', t2 + 0.3)}
      <g opacity={A(t3 - 0.4) * (1 - ramp(t, t5 - 0.1, t5 + 0.2))} transform={`translate(0 ${270 + 20 * (1 - A(t3 - 0.4))})`}><Txt x={960} y={0} s={190} c="#3ddc84">ONE DECISION</Txt></g>
      <g opacity={A(t4) * (1 - ramp(t, t5 - 0.1, t5 + 0.2))} transform={`translate(0 ${560 + 20 * (1 - A(t4))})`}><Txt x={960} y={0} s={120} c="#cfe2ff">ON ONE COLD MORNING</Txt></g>
      <g opacity={A(t5, 0.15)} transform={`translate(960 ${620}) scale(${0.8 + 0.3 * A(t5, 0.25)})`}><Txt x={0} y={0} s={340} c="#ffd23f" ls={6}>TODAY.</Txt></g>
    </InsertBG>
  );
};
export const PhoneTrend: React.FC<{t: number}> = ({t}) => {
  const t0 = T('people');
  return (
    <InsertBG glow="#ff7ad8">
      <g transform={`translate(1240 ${540 + (1 - ramp(t, t0, t0 + 0.4)) * 90}) rotate(-4)`}>
        <rect x={-210} y={-420} width={420} height={840} rx={56} fill="#12151f" stroke={INK} strokeWidth={10} /><rect x={-186} y={-390} width={372} height={780} rx={36} fill="#1c2140" />
        <Txt x={0} y={-310} s={52} c="#ffd23f" font={DIGI}>TRENDING</Txt><Txt x={0} y={-230} s={64} c="#fff">#WINTERARC</Txt>
        {[0, 1, 2].map((i) => { const k = ramp(t, t0 + 0.5 + i * 0.35, t0 + 0.85 + i * 0.35); return <g key={i} opacity={k} transform={`translate(0 ${-120 + i * 190 + (1 - k) * 40})`}><rect x={-160} y={-80} width={320} height={160} rx={22} fill={['#3b6fd8', '#8a4fd8', '#d84f8a'][i]} stroke={INK} strokeWidth={5} /><circle cx={-110} cy={-20} r={30} fill="#e8eafb" stroke={INK} strokeWidth={4} /><path d="M -60,-30 L 120,-30 M -60,10 L 80,10" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.7} /><path d="M 90,50 c -14,-18 -40,0 -22,22 c 8,8 22,14 22,14 c 0,0 14,-6 22,-14 c 18,-22 -8,-40 -22,-22 Z" fill="#ff5a7e" /></g>; })}
      </g>
    </InsertBG>
  );
};
export const Others: React.FC<{t: number}> = ({t}) => {
  const items = [['HIBERNATES', T('hibernates')], ['EATS', T('eats')], ['WAITS FOR NEW YEAR', T('waits')]] as const;
  return (
    <InsertBG glow="#8a6fb8">
      {items.map(([label, at], i) => {
        const k = ramp(t, at - 0.05, at + 0.3), x = 360 + i * 600;
        return (
          <g key={label} transform={`translate(${x} ${470 + (1 - k) * 60})`} opacity={k}>
            <rect x={-250} y={-260} width={500} height={520} rx={40} fill="#1d2248" stroke={INK} strokeWidth={9} />
            {i === 0 && <g><rect x={-170} y={20} width={340} height={70} rx={20} fill="#3d4180" stroke={INK} strokeWidth={7} /><ellipse cx={-90} cy={0} rx={70} ry={36} fill="#e2e6ff" stroke={INK} strokeWidth={6} /><path d="M -170,34 C -120,-60 80,-60 170,40 L 170,90 L -170,90 Z" fill="#5a3fb0" stroke={INK} strokeWidth={7} />{[0, 1, 2].map((z) => <text key={z} x={120 + z * 30} y={-60 - z * 50 - ((t * 30) % 20)} fontFamily={MONT} fontWeight={800} fontSize={44 + z * 14} fill="#cfd8ff">z</text>)}</g>}
            {i === 1 && <g><ellipse cx={0} cy={50} rx={190} ry={60} fill="#e8eafb" stroke={INK} strokeWidth={7} /><ellipse cx={0} cy={30} rx={140} ry={38} fill="#f2c27a" stroke={INK} strokeWidth={6} /><circle cx={-50} cy={20} r={26} fill="#e0503a" stroke={INK} strokeWidth={5} /><circle cx={40} cy={26} r={22} fill="#7bd45b" stroke={INK} strokeWidth={5} /><rect x={-110} y={-70} width={220} height={60} rx={30} fill="#d9953c" stroke={INK} strokeWidth={7} /></g>}
            {i === 2 && <g><rect x={-130} y={-120} width={260} height={230} rx={22} fill="#f4f6ff" stroke={INK} strokeWidth={7} /><rect x={-130} y={-120} width={260} height={70} rx={22} fill="#e0503a" stroke={INK} strokeWidth={7} /><Txt x={0} y={-68} s={40}>JAN 1</Txt><path d="M -60,20 L -60,-4 M 0,20 L 0,-20 M 60,20 L 60,10" stroke="#c9ced8" strokeWidth={0} /><Txt x={0} y={80} s={90} c="#1b1a3a">NEW</Txt></g>}
            <Txt x={0} y={215} s={44} ls={2}>{label}</Txt>
          </g>
        );
      })}
    </InsertBG>
  );
};
export const Quiet: React.FC<{t: number}> = ({t}) => (
  <Frame bg="#070a1c">
    <RoomArt t={t} dawn={0} />
    <rect width={1920} height={1080} fill="#050818" opacity={0.45} />
    <SideHero x={760} y={1040} scale={1.0} id="q" mood="determined" fat={0.5} muscle={0} pose="stand" {...SAM} top="hoodie" />
    <path d="M 902,500 L 902,520" stroke="#fff" strokeWidth={0} />
  </Frame>
);
export const TrainShot: React.FC<{t: number}> = ({t}) => {
  const bob = Math.sin(t * 5) * 14, curl: SidePose = {...SIDE.curl, handN: [96, -462 + bob * 1.2]};
  return (
    <InsertBG glow="#3ddc84">
      <rect x={0} y={880} width={1920} height={200} fill="#171428" /><path d="M 0,884 L 1920,884" stroke="#2a2346" strokeWidth={8} />
      <rect x={240} y={560} width={150} height={320} rx={10} fill="#3a2b54" stroke={INK} strokeWidth={7} /><rect x={1540} y={600} width={150} height={280} rx={10} fill="#3a2b54" stroke={INK} strokeWidth={7} />
      <SideHero x={880} y={900} scale={0.88} id="tr" mood="determined" fat={0.45} muscle={0.25} pose={curl} {...SAM} top="tank" shorts />
    </InsertBG>
  );
};
export const SleepShot: React.FC<{t: number}> = ({t}) => (
  <InsertBG glow="#6fa0ff">
    <circle cx={1500} cy={230} r={120} fill="#e9efff" opacity={0.9} /><circle cx={1460} cy={200} r={100} fill="#aab6dc" opacity={0.25} />
    <Txt x={1500} y={470} s={100} c="#ffd23f" font={DIGI}>10:00 PM</Txt>
    <rect x={200} y={820} width={1100} height={80} rx={20} fill="#3d4180" stroke={INK} strokeWidth={8} /><rect x={1200} y={540} width={50} height={360} rx={14} fill="#3a2b54" stroke={INK} strokeWidth={8} />
    <ellipse cx={1120} cy={796} rx={110} ry={44} fill="#e2e6ff" stroke={INK} strokeWidth={8} />
    <SideHero x={760} y={800} scale={1.05} id="sl" mood="tired" blink={1} fat={0.45} muscle={0.2} pose={lieHead()} {...SAM} />
    <path d="M 280,830 C 280,730 340,704 420,712 C 600,690 800,704 960,722 C 1040,730 1048,790 1040,834 L 280,834 Z" fill="#2f7a96" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => { const k = ((t * 0.5 + i / 3) % 1); return <text key={i} x={1140 + i * 30 + k * 20} y={690 - k * 100 - i * 20} fontFamily={MONT} fontWeight={800} fontSize={44 + i * 14} fill="#cfd8ff" opacity={Math.sin(k * Math.PI) * 0.85}>z</text>; })}
  </InsertBG>
);
export const FoodShot: React.FC<{t: number}> = ({t}) => {
  const k = ramp(t, T('fix'), T('fix') + 0.4);
  return (
    <InsertBG glow="#7bd45b">
      <g transform={`translate(960 ${560 + (1 - k) * 60}) scale(${0.9 + 0.1 * k})`} opacity={k}>
        <ellipse cx={0} cy={40} rx={400} ry={190} fill="#eef1ff" stroke={INK} strokeWidth={10} /><ellipse cx={0} cy={30} rx={320} ry={140} fill="#fff" stroke="#c9ced8" strokeWidth={5} />
        <ellipse cx={-150} cy={10} rx={130} ry={70} fill="#e8a05a" stroke={INK} strokeWidth={8} /><path d="M -240,0 L -60,20" stroke="#b86c32" strokeWidth={8} opacity={0.6} />
        {[[40, -20], [100, -50], [160, 0], [90, 30], [20, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={42} fill="#4fbf4a" stroke={INK} strokeWidth={7} />)}
        <circle cx={-30} cy={80} r={44} fill="#fff" stroke={INK} strokeWidth={7} /><circle cx={-30} cy={80} r={20} fill="#ffc83a" />
        {[[200, 60], [235, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={26} fill="#e0503a" stroke={INK} strokeWidth={6} />)}
      </g>
    </InsertBG>
  );
};
export const ReadShot: React.FC<{t: number}> = () => (
  <InsertBG glow="#ffb25a">
    <circle cx={1500} cy={380} r={190} fill="#ffb25a" opacity={0.2} style={{filter: 'blur(24px)'}} />
    <rect x={260} y={810} width={1000} height={90} rx={20} fill="#3d4180" stroke={INK} strokeWidth={8} />
    <SideHero x={760} y={960} scale={0.95} id="rd" mood="neutral" fat={0.45} muscle={0.2} pose={{...SIDE.sit, heldN: 'book', torso: 8, head: 20}} {...SAM} top="hoodie" />
  </InsertBG>
);
export const Counter90: React.FC<{t: number}> = ({t}) => {
  const n = Math.round(90 * ramp(t, T('90', 1), T('days', 1) + 0.1)), r = 250, c = 2 * Math.PI * r;
  return (
    <InsertBG glow="#ffd23f">
      <circle cx={960} cy={500} r={r} fill="none" stroke="#2a2f6a" strokeWidth={46} /><circle cx={960} cy={500} r={r} fill="none" stroke="#ffd23f" strokeWidth={46} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - n / 90)} transform="rotate(-90 960 500)" />
      <Txt x={960} y={560} s={260} c="#fff" font={DIGI}>{n}</Txt><Txt x={960} y={900} s={110} c="#ffd23f" font={DIGI} ls={8}>DAYS</Txt>
    </InsertBG>
  );
};
export const SpringDoor: React.FC<{t: number}> = ({t}) => {
  const dEnd = TE('walk out different'), walk = ramp(t, T('walk'), dEnd), open = ramp(t, T('spring'), T('comes') + 0.3);
  const sx = 520 + walk * 800, sc = 1.05 - walk * 0.3;
  return (
    <Frame bg="#cfe9ff">
      <defs><linearGradient id="spr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0ff" /><stop offset="1" stopColor="#c9f0a8" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="#2b3f6e" />
      <rect x={1180} y={140} width={560} height={860} fill="url(#spr)" stroke={INK} strokeWidth={12} />
      <circle cx={1560} cy={300} r={80} fill="#fff7c2" /><path d="M 1180,860 Q 1460,780 1740,860 L 1740,1000 L 1180,1000 Z" fill="#78c850" />
      {[[1300, 700], [1640, 720]].map(([x, y], i) => <g key={i}><rect x={x - 12} y={y} width={24} height={110} fill="#8a5a30" stroke={INK} strokeWidth={5} /><circle cx={x} cy={y - 10} r={70} fill="#4fbf4a" stroke={INK} strokeWidth={6} /></g>)}
      <polygon points={`1180,140 ${1180 + (1 - open) * 560},140 ${1180 + (1 - open) * 560},1000 1180,1000`} fill="#6a4a3a" stroke={INK} strokeWidth={10} opacity={1 - open * 0.0} />
      <rect x={0} y={900} width={1920} height={180} fill="#1b1a3a" opacity={0.5} />
      <rect width={1920} height={1080} fill="#fff7d0" opacity={ramp(t, dEnd - 0.7, dEnd + 0.4) * 0.6} />
      <Hero x={sx} y={1040} scale={sc} id="sp" mood="happy" fat={0.1} muscle={0.8} top="tee" topColor={SAM.topColor} pose={walk < 1 ? (Math.sin(t * 8) > 0 ? 'pump' : 'idle') : 'idle'} />
    </Frame>
  );
};
