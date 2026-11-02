import React from 'react';
import {Hero, INK} from './Hero';
import {SideHero, SIDE, SidePose} from './SideHero';
import {InsertBG} from '../same2d/inserts';
import {ramp} from '../same2d/fx';
import {MONT, DIGI} from '../same2d/theme';
import {T} from './timeline';
import {Frame, RoomArt, Txt, Pill, SAM, JAKE} from './scenes';
import {GymBG} from './scenes2';

// ============================================================================================
// WINTER ARC scenes, third part (Jake's great week, week three and the party, midnight, January 2nd). `t` is the ABSOLUTE video time.
// ============================================================================================
type Who = 'sam' | 'jake' | 'friend' | 'colleague' | 'mom' | 'coworker';
export const LOOK: Record<Who, {topColor: string; cast?: any}> = {sam: {topColor: SAM.topColor}, jake: {topColor: JAKE.topColor, cast: 'colleague'}, friend: {topColor: '#3b8d6b', cast: 'friend'}, colleague: {topColor: '#3b6fd8', cast: 'manager'}, mom: {topColor: '#d84f8a', cast: 'mom'}, coworker: {topColor: '#3b8d6b', cast: 'manager'}};

// ---------------- party background: string lights, balloons, a table ----------------
export const PartyBG: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#1d1638" /><rect y={820} width={1920} height={260} fill="#150f2b" />
    <rect y={806} width={1920} height={14} fill="#3b2a66" stroke={INK} strokeWidth={4} />
    <path d="M 0,120 Q 480,260 960,120 Q 1440,260 1920,120" fill="none" stroke="#0b0820" strokeWidth={6} />
    {Array.from({length: 22}, (_, i) => { const x = i * 90 + 20, y = 120 + Math.sin((x / 1920) * Math.PI * 4) * 70 + 70 * Math.sin((x / 1920) * Math.PI * 2) * 0 + (x < 960 ? (x / 960) * 70 : ((1920 - x) / 960) * 70), c = ['#ffd23f', '#ff7ad8', '#6fd0ff', '#3ddc84'][i % 4], tw = 0.6 + 0.4 * Math.sin(t * 5 + i); return <g key={i}><circle cx={x} cy={y + 14} r={30} fill={c} opacity={0.18 * tw} /><circle cx={x} cy={y + 14} r={10} fill={c} stroke={INK} strokeWidth={3} opacity={0.5 + 0.5 * tw} /></g>; })}
    {[[260, 400, '#ff5a6e'], [380, 330, '#ffd23f'], [1560, 380, '#6fd0ff'], [1700, 450, '#ff7ad8']].map(([x, y, c], i) => <g key={i} transform={`translate(${x} ${(y as number) + Math.sin(t * 1.4 + i) * 10})`}><ellipse rx={50} ry={64} fill={c as string} stroke={INK} strokeWidth={6} /><path d="M 0,64 Q 10,150 -6,230" stroke={INK} strokeWidth={4} fill="none" /><ellipse cx={-16} cy={-22} rx={10} ry={16} fill="#fff" opacity={0.4} /></g>)}
    <g transform="translate(1530 760)"><rect x={-240} y={0} width={480} height={40} rx={8} fill="#6b4fc4" stroke={INK} strokeWidth={7} /><rect x={-220} y={40} width={26} height={150} fill="#2a2146" /><rect x={194} y={40} width={26} height={150} fill="#2a2146" />
      <ellipse cx={-130} cy={-10} rx={80} ry={22} fill="#f4f4ff" stroke={INK} strokeWidth={6} /><ellipse cx={-130} cy={-26} rx={52} ry={26} fill="#e0503a" stroke={INK} strokeWidth={5} />{[40, 90, 140].map((x, i) => <g key={i}><path d={`M ${x - 22},-4 L ${x - 16},-60 L ${x + 16},-60 L ${x + 22},-4 Z`} fill={['#ff5a6e', '#6fd0ff', '#ffd23f'][i]} stroke={INK} strokeWidth={5} /></g>)}<ellipse cx={200} cy={-20} rx={46} ry={20} fill="#f2c27a" stroke={INK} strokeWidth={5} /></g>
  </g>
);

// ---------------- one man (or the friend) standing, front view ----------------
export const Solo: React.FC<{t: number; who?: Who; mood?: any; open?: number; look?: [number, number]; top?: 'tee' | 'hoodie' | 'tank'; pose?: any; fat?: number; muscle?: number; x?: number; y?: number; scale?: number; bg?: 'room' | 'party' | 'gym' | 'none'; dawn?: number; children?: React.ReactNode}> = ({t, who = 'sam', mood = 'neutral', open, look, top = 'hoodie', pose = 'idle', fat = 0.5, muscle = 0, x = 960, y = 1040, scale = 1.1, bg = 'room', dawn = 0, children}) => (
  <Frame>
    {bg === 'room' && <RoomArt t={t} dawn={dawn} />}{bg === 'party' && <PartyBG t={t} />}{bg === 'gym' && <GymBG t={t} />}
    <Hero x={x} y={y} scale={scale} t={t} id={'so' + who} mood={mood} open={open} look={look} fat={who === 'sam' || who === 'jake' ? fat : 0.2} muscle={muscle} top={top} topColor={LOOK[who].topColor} cast={LOOK[who].cast} pose={pose} />
    {children}
  </Frame>
);

// ---------------- Jake's great week: on the couch, then three little purchases ----------------
export const CouchJake: React.FC<{t: number}> = ({t}) => (
  <Frame>
    <RoomArt t={t} dawn={0.15} />
    <rect x={520} y={700} width={900} height={170} rx={50} fill="#4b3f88" stroke={INK} strokeWidth={9} /><rect x={500} y={620} width={140} height={250} rx={44} fill="#5a4aa0" stroke={INK} strokeWidth={9} /><rect x={1300} y={620} width={140} height={250} rx={44} fill="#5a4aa0" stroke={INK} strokeWidth={9} />
    <SideHero x={880} y={900} scale={1.1} t={t} id="cj" mood="happy" fat={0.5} pose={{...SIDE.sit, torso: -4, head: 8, heldN: 'phone', handN: [168, -330]}} {...JAKE} />
    {[0, 1, 2, 3].map((i) => <path key={i} d="M 0,-20 L 6,-6 L 20,0 L 6,6 L 0,20 L -6,6 L -20,0 L -6,-6 Z" fill="#ffd23f" transform={`translate(${1100 + i * 90} ${300 + (i % 2) * 90 + Math.sin(t * 4 + i) * 8}) scale(${1 + 0.2 * Math.sin(t * 5 + i)})`} opacity={0.85} />)}
  </Frame>
);
export const JakeStuff: React.FC<{t: number; kind: 'videos' | 'bottle' | 'playlist'; at: number}> = ({t, kind, at}) => {
  const k = ramp(t, at, at + 0.35);
  return (
    <InsertBG glow="#ff7ad8">
      <g opacity={k} transform={`translate(960 ${540 + (1 - k) * 50})`}>
        {kind === 'videos' && [-1, 0, 1].map((i) => <g key={i} transform={`translate(${i * 520} 0) rotate(${i * 3})`}><rect x={-230} y={-150} width={460} height={290} rx={26} fill="#1c2140" stroke={INK} strokeWidth={9} /><rect x={-210} y={-130} width={420} height={250} rx={14} fill={['#3b6fd8', '#8a4fd8', '#d84f8a'][i + 1]} /><circle r={52} fill="#fff" opacity={0.9} /><path d="M -16,-30 L 34,0 L -16,30 Z" fill={INK} /><Txt x={0} y={206} s={52} ls={2}>WORKOUT {i + 2}</Txt></g>)}
        {kind === 'bottle' && <g><rect x={-90} y={-250} width={180} height={470} rx={70} fill="#6fd0ff" stroke={INK} strokeWidth={10} /><rect x={-60} y={-310} width={120} height={80} rx={26} fill="#2e3242" stroke={INK} strokeWidth={9} /><rect x={-90} y={-60} width={180} height={140} fill="#3ddc84" opacity={0.85} /><Txt x={0} y={30} s={46}>NEW</Txt><path d="M -50,-200 L -50,160" stroke="#fff" strokeWidth={14} opacity={0.35} strokeLinecap="round" /><g transform="translate(250 -120) rotate(14)"><rect x={-90} y={-40} width={180} height={80} rx={14} fill="#ffd23f" stroke={INK} strokeWidth={7} /><Txt x={0} y={20} s={56}>$29</Txt></g></g>}
        {kind === 'playlist' && <g><rect x={-400} y={-250} width={800} height={470} rx={40} fill="#1c2140" stroke={INK} strokeWidth={10} /><rect x={-360} y={-210} width={250} height={250} rx={24} fill="#6b4fc4" stroke={INK} strokeWidth={7} /><text x={-235} y={-40} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={170} fill="#fff">♪</text><Txt x={-60} y={-130} s={74} anchor="start">WINTER ARC</Txt><Txt x={-60} y={-60} s={40} c="#8c96c8" anchor="start">PLAYLIST · 42 SONGS</Txt>{Array.from({length: 26}, (_, i) => <rect key={i} x={-340 + i * 26} y={100 - (20 + Math.abs(Math.sin(t * 6 + i * 0.7)) * 70)} width={14} height={20 + Math.abs(Math.sin(t * 6 + i * 0.7)) * 70} rx={5} fill="#ff7ad8" />)}</g>}
      </g>
    </InsertBG>
  );
};

export const EventCards: React.FC<{t: number}> = ({t}) => {
  const items = [["OFFICE PARTY", T('the office party')], ["COUSIN'S WEDDING", T('cousins')], ['FRIENDS', T('friends')]] as const;
  return (
    <InsertBG glow="#ffb25a">
      {items.map(([label, at], i) => {
        const k = ramp(t, at - 0.05, at + 0.3), x = 360 + i * 600;
        return (
          <g key={label} transform={`translate(${x} ${500 + (1 - k) * 60})`} opacity={k}>
            <rect x={-250} y={-280} width={500} height={540} rx={40} fill="#2a1f52" stroke={INK} strokeWidth={9} />
            {i === 0 && <g><path d="M -90,100 L 0,-120 L 90,100 Z" fill="#ff5a6e" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><circle cy={-130} r={26} fill="#ffd23f" stroke={INK} strokeWidth={6} />{[[-120, -60], [130, -20], [-150, 60], [150, 80]].map(([x2, y2], j) => <circle key={j} cx={x2} cy={y2} r={12} fill={['#6fd0ff', '#3ddc84', '#ffd23f', '#ff7ad8'][j]} />)}</g>}
            {i === 1 && <g><circle cx={-50} cy={20} r={80} fill="none" stroke="#ffd23f" strokeWidth={22} /><circle cx={60} cy={20} r={80} fill="none" stroke="#e8eafb" strokeWidth={22} /><path d="M -60,-130 L -40,-100 L -20,-130" stroke="#6fd0ff" strokeWidth={10} fill="none" /></g>}
            {i === 2 && <g><circle cx={-70} cy={0} r={74} fill="#e8eafb" stroke={INK} strokeWidth={7} /><circle cx={70} cy={20} r={74} fill="#d9534f" stroke={INK} strokeWidth={7} /><path d="M -30,120 Q 0,60 40,120" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" /></g>}
            <Txt x={0} y={210} s={i === 1 ? 40 : 48} ls={2}>{label}</Txt>
          </g>
        );
      })}
    </InsertBG>
  );
};
export const PlateNight: React.FC<{t: number}> = ({t}) => {
  const a = T('every plate'), b = T('every night'), ka = ramp(t, a, a + 0.35), kb = ramp(t, b, b + 0.35);
  return (
    <InsertBG glow="#ff9a6a">
      <g opacity={ka} transform={`translate(560 ${480 + (1 - ka) * 50 + Math.sin(t * 3) * 4})`}>
        <ellipse cx={0} cy={110} rx={310} ry={90} fill="#e8eafb" stroke={INK} strokeWidth={9} />
        {[[-120, 30], [0, 0], [120, 30], [-60, -60], [60, -60], [0, -120]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y + 30} rx={90} ry={50} fill={['#f2c27a', '#e0503a', '#d9953c', '#7bd45b', '#f2c27a', '#e0503a'][i]} stroke={INK} strokeWidth={7} />)}
        <path d="M -200,260 L 200,260" stroke={INK} strokeWidth={0} /><Txt x={0} y={290} s={74} c="#ff9a6a">HEAVY</Txt>
      </g>
      <g opacity={kb} transform={`translate(1360 ${480 + (1 - kb) * 50})`}>
        <circle r={190} fill="#e8eafb" stroke={INK} strokeWidth={10} /><circle r={160} fill="#fff" />
        {Array.from({length: 12}, (_, i) => <path key={i} d="M 0,-150 L 0,-132" stroke={INK} strokeWidth={i % 3 ? 5 : 9} transform={`rotate(${i * 30})`} />)}<path d="M 0,0 L 0,-90" stroke={INK} strokeWidth={12} strokeLinecap="round" transform="rotate(60)" /><path d="M 0,0 L 0,-120" stroke="#ff4a4a" strokeWidth={8} strokeLinecap="round" transform="rotate(10)" /><circle r={12} fill={INK} />
        <Txt x={0} y={320} s={74} c="#ff9a6a">LATE</Txt>
      </g>
    </InsertBG>
  );
};
export const LeavesParty: React.FC<{t: number}> = ({t}) => {
  const a = T('but he leaves'), k = ramp(t, a + 0.2, a + 2.2), x = 760 + k * 760;
  return (
    <Frame>
      <PartyBG t={t} />
      <g transform="translate(300 220)"><rect x={-230} y={-80} width={460} height={160} rx={20} fill="#12080c" stroke={INK} strokeWidth={9} /><text x={0} y={36} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={110} fill="#ff4a4a" style={{filter: 'drop-shadow(0 0 8px #ff2a2a)'}}>10:00</text></g>
      <Hero x={x} y={1040 - Math.abs(Math.sin(t * 8)) * 10 * (k < 1 ? 1 : 0)} scale={1.1} t={t} id="lp" mood="happy" fat={0.5} top="hoodie" topColor={SAM.topColor} pose={k < 1 && Math.sin(t * 8) > 0 ? 'pump' : 'idle'} />
    </Frame>
  );
};
export const Delivery: React.FC<{t: number}> = ({t}) => {
  const k = ramp(t, T('orders breakfast'), T('orders breakfast') + 0.5);
  return (
    <Frame>
      <RoomArt t={t} dawn={0.8} />
      <rect x={1280} y={260} width={340} height={600} rx={12} fill="#6a4a3a" stroke={INK} strokeWidth={10} /><circle cx={1330} cy={560} r={14} fill="#ffd23f" stroke={INK} strokeWidth={5} />
      <g transform={`translate(${1560 - k * 260} ${760})`} opacity={k}><path d="M -80,-120 L 80,-120 L 100,60 L -100,60 Z" fill="#c9a06a" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><path d="M -80,-120 Q 0,-170 80,-120" fill="#b88a52" stroke={INK} strokeWidth={8} />{[0, 1].map((i) => <path key={i} d={`M ${-20 + i * 40},-170 q -14,-30 0,-60`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.6} />)}</g>
      <Hero x={780} y={1040} scale={1.1} t={t} id="dv" mood="tired" fat={0.55} cast="colleague" top="hoodie" topColor={JAKE.topColor} pose="idle" />
      <g opacity={k} transform="translate(960 160)"><rect x={-260} y={-50} width={520} height={100} rx={50} fill="#3ddc84" stroke={INK} strokeWidth={8} /><Txt x={0} y={20} s={52} ls={2}>BREAKFAST ARRIVED</Txt></g>
    </Frame>
  );
};
export const Growing: React.FC<{t: number}> = ({t}) => {
  const k = ramp(t, T('every day he waits'), T('weaker') + 0.2);
  return (
    <InsertBG glow="#ffd23f">
      <g transform={`translate(1280 ${540}) scale(${0.7 + k * 1.4})`}>
        <rect x={-190} y={-210} width={380} height={420} rx={26} fill="#f4f6ff" stroke={INK} strokeWidth={8} /><rect x={-190} y={-210} width={380} height={110} rx={26} fill="#3b6fd8" stroke={INK} strokeWidth={8} /><Txt x={0} y={-130} s={58} ls={4}>JANUARY</Txt>
        <text x={0} y={110} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={260} fill="#1b1a3a">1</text>
      </g>
      <Hero x={460} y={1050} scale={1.05 - k * 0.4} t={t} id="gr" mood={k > 0.4 ? 'sad' : 'tired'} fat={0.5 + 0.2 * k} cast="colleague" top="hoodie" topColor={JAKE.topColor} pose="slump" slump={k * 0.6} />
    </InsertBG>
  );
};
export const FireG: React.FC<{t: number}> = ({t}) => {
  const t0 = T('midnight'), cols = ['#ffd23f', '#ff7ad8', '#6fd0ff', '#3ddc84', '#ff5a6e', '#ffffff'];
  return (
    <g>
      {Array.from({length: 7}, (_, k) => {
        const s = t0 + k * 0.55, r = 300 * ramp(t, s, s + 1.3), o = Math.max(0, 1 - (t - s) / 1.9), cx = 320 + ((k * 337) % 1280), cy = 260 + ((k * 151) % 260);
        return t >= s ? <g key={k} opacity={o}>{Array.from({length: 22}, (_, i) => { const a = (i / 22) * Math.PI * 2; return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r + r * r * 0.0006} r={7 * (1 - r / 420)} fill={cols[k % 6]} />; })}<circle cx={cx} cy={cy} r={r * 0.15} fill={cols[k % 6]} opacity={0.35} /></g> : null;
      })}
      <rect x={0} y={900} width={1920} height={180} fill="#0b0820" />{Array.from({length: 16}, (_, i) => <g key={i} transform={`translate(${60 + i * 118} ${930 - Math.abs(Math.sin(t * 5 + i)) * 12})`}><circle r={26} fill="#1d1638" stroke="#3b2a66" strokeWidth={5} /><rect x={-24} y={26} width={48} height={90} rx={18} fill="#1d1638" stroke="#3b2a66" strokeWidth={5} /></g>)}
    </g>
  );
};
export const GymBoth: React.FC<{t: number}> = ({t}) => (
  <Frame>
    <GymBG t={t} clock="6:30 AM" />
    <Hero x={600} y={1050} scale={0.98} t={t} id="gbs" mood="determined" fat={0.45} muscle={0.12} top="tank" topColor="#e9962c" pose="idle" />
    <Hero x={1320} y={1050} scale={0.98} t={t} id="gbj" mood="determined" fat={0.55} cast="colleague" top="tank" topColor="#6b4fc4" pose={{arm: [60, 140], hand: 'fist'}} />
    <Pill x={600} y={150} text="SAM" c="#e9962c" o={ramp(t, T('sam and jake'), T('sam and jake') + 0.3)} /><Pill x={1320} y={150} text="JAKE" c="#6b4fc4" o={ramp(t, T('sam and jake') + 0.3, T('sam and jake') + 0.6)} />
  </Frame>
);
export const GymCurl: React.FC<{t: number; who: 'sam' | 'jake'; label?: string; at?: number}> = ({t, who, label, at = 0}) => {
  const jake = who === 'jake', bob = Math.sin(t * (jake ? 4.2 : 2.2)) * (jake ? 46 : 30), pose: SidePose = {...SIDE.curl, handN: [96, -462 + bob * 1.2]};
  return (
    <Frame>
      <GymBG t={t} />
      <SideHero x={900} y={1010} scale={0.98} t={t} id={'gc' + who} cast={jake ? 'colleague' : undefined} mood={jake ? 'determined' : 'neutral'} fat={jake ? 0.55 : 0.4} muscle={jake ? 0 : 0.2} pose={pose} top="tank" topColor={jake ? '#6b4fc4' : '#e9962c'} shorts />
      {jake && [0, 1, 2].map((i) => <ellipse key={i} cx={950 + i * 24} cy={250 + ((t * 120 + i * 40) % 120)} rx={9} ry={14} fill="#9fd6ff" opacity={0.7} />)}
      {label && <g opacity={ramp(t, at, at + 0.3)}><Txt x={1400} y={300} s={80} c={jake ? '#ff6a6a' : '#3ddc84'}>{label}</Txt></g>}
    </Frame>
  );
};
export const GymCrowd: React.FC<{t: number}> = ({t}) => {
  const casts = ['man', 'colleague', 'manager', 'friend', 'mom'] as const, cols = ['#d9534f', '#3b8d6b', '#3b6fd8', '#8a4fd8', '#d8803b', '#d84f8a'], gone = T('in three weeks') + 0.2;
  return (
    <Frame>
      <GymBG t={t} />
      {Array.from({length: 20}, (_, i) => { const row = i % 3, x = 130 + ((i * 197) % 1700), y = [880, 930, 985][row], sc = [0.3, 0.34, 0.38][row]; return t < gone + i * 0.09 ? <Hero key={i} x={x} y={y} scale={sc} t={t + i} id={'cr' + i} mood="neutral" fat={(i % 4) * 0.2} muscle={(i % 5) * 0.12} cast={casts[i % 5]} top={i % 3 === 0 ? 'tank' : 'tee'} topColor={cols[i % 6]} pose={i % 4 === 0 ? 'hips' : 'idle'} /> : null; })}
      <Hero x={960} y={1060} scale={1.0} t={t} id="crs" mood="determined" look={[0.7, 0]} fat={0.4} muscle={0.2} top="tank" topColor="#e9962c" pose="idle" />
    </Frame>
  );
};
