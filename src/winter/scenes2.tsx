import React from 'react';
import {Hero, Hand, INK} from './Hero';
import {SideHero, SIDE, SidePose} from './SideHero';
import {InsertBG} from '../same2d/inserts';
import {ramp} from '../same2d/fx';
import {MONT, DIGI} from '../same2d/theme';
import {T, TE} from './timeline';
import {Frame, RoomArt, BedMan, Txt, SAM, JAKE, lieHead} from './scenes';

// ============================================================================================
// WINTER ARC scenes, second part (the first morning, Sam's first week, the night routine). `t` is the ABSOLUTE video time.
// ============================================================================================

// ---------------- generic text cards: each beat fades in at `at`, out at `to`, and can be struck out at `strike` ----------------
export type Beat = {text: string; at: number; to?: number; c?: string; s?: number; y?: number; strike?: number};
export const Beats: React.FC<{t: number; beats: Beat[]; glow?: string; children?: React.ReactNode}> = ({t, beats, glow = '#6fa0ff', children}) => (
  <InsertBG glow={glow}>
    {children}
    {beats.map((b, i) => {
      const a = ramp(t, b.at, b.at + 0.25), o = a * (b.to ? 1 - ramp(t, b.to - 0.2, b.to) : 1), s = b.s ?? 120, y = b.y ?? 540, w = b.text.length * s * 0.6;
      return (
        <g key={i} opacity={o} transform={`translate(960 ${y + (1 - a) * 24})`}>
          <Txt x={0} y={0} s={s} c={b.c ?? '#eef1ff'}>{b.text}</Txt>
          {b.strike !== undefined && <path d={`M ${-w / 2},${-s * 0.32} L ${w / 2},${-s * 0.32}`} stroke="#ff4a5e" strokeWidth={s * 0.12} strokeLinecap="round" strokeDasharray={w} strokeDashoffset={w * (1 - ramp(t, b.strike, b.strike + 0.25))} />}
        </g>
      );
    })}
  </InsertBG>
);

// ---------------- a ring that fills while a number counts up ----------------
export const RingG: React.FC<{t: number; a: number; b: number; total: number; unit: string; x: number; y: number; r?: number; c?: string}> = ({t, a, b, total, unit, x, y, r = 220, c = '#ffd23f'}) => {
  const n = Math.round(total * ramp(t, a, b)), cir = 2 * Math.PI * r;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="rgba(8,10,28,.55)" stroke="#2a2f6a" strokeWidth={40} /><circle r={r} fill="none" stroke={c} strokeWidth={40} strokeLinecap="round" strokeDasharray={cir} strokeDashoffset={cir * (1 - n / total)} transform="rotate(-90)" />
      <Txt x={0} y={r * 0.28} s={r * 0.9} font={DIGI}>{n}</Txt><Txt x={0} y={r * 0.74} s={r * 0.2} c={c} font={DIGI} ls={4}>{unit}</Txt>
    </g>
  );
};

// ---------------- one man in his bed, big (the left bed, or mirrored for Jake) ----------------
export const BedSolo: React.FC<{t: number; who?: 'sam' | 'jake'; eyes?: 'open' | 'closed'; phone?: boolean; mood?: any; open?: number; z?: boolean; lamp?: boolean; dark?: number; dawn?: number; children?: React.ReactNode}> = ({t, who = 'sam', eyes = 'open', phone, mood = 'tired', open, z, lamp, dark = 0, dawn = 0, children}) => (
  <Frame>
    <RoomArt t={t} dawn={dawn} />
    {lamp && <g><ellipse cx={1600} cy={560} rx={380} ry={300} fill="#ffb25a" opacity={0.22} style={{filter: 'blur(30px)'}} /><path d="M 1560,470 L 1640,470 L 1670,540 L 1530,540 Z" fill="#ffd9a0" stroke={INK} strokeWidth={7} /><rect x={1590} y={540} width={20} height={90} fill="#3a2b54" stroke={INK} strokeWidth={6} /><rect x={1540} y={628} width={120} height={20} rx={8} fill="#3a2b54" stroke={INK} strokeWidth={6} /></g>}
    <g transform={who === 'sam' ? 'translate(300 -500) scale(1.5)' : 'translate(1620 -500) scale(-1.5 1.5)'}><BedMan t={t} who={who} eyes={eyes} phone={phone} id={'bs' + who} mood={mood} open={open} z={z} /></g>
    <rect width={1920} height={1080} fill="#02030a" opacity={dark} />
    {children}
  </Frame>
);

// ---------------- the room is freezing / the bed is warm ----------------
export const Thermo: React.FC<{t: number; from: number; warm: boolean}> = ({t, from, warm}) => {
  const k = ramp(t, from, from + 0.6), shiver = warm ? 0 : Math.sin(t * 50) * 3 * k, level = warm ? 0.88 : 0.1 + 0.08 * (1 - k), col = warm ? '#ff7a3a' : '#6fd0ff';
  return (
    <InsertBG glow={col}>
      <g transform={`translate(${760 + shiver} 520)`}>
        <rect x={-60} y={-320} width={120} height={560} rx={60} fill="#e8eafb" stroke={INK} strokeWidth={10} /><circle cx={0} cy={250} r={96} fill="#e8eafb" stroke={INK} strokeWidth={10} />
        <circle cx={0} cy={250} r={72} fill={col} /><rect x={-26} y={240 - 520 * level} width={52} height={520 * level + 10} rx={26} fill={col} />
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M 60,${-280 + i * 62} L ${i % 2 ? 92 : 112},${-280 + i * 62}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}
      </g>
      <Txt x={1380} y={470} s={150} c={col}>{warm ? 'WARM' : 'FREEZING'}</Txt>
      {!warm && Array.from({length: 14}, (_, i) => <g key={i} stroke="#cfe9ff" strokeWidth={6} strokeLinecap="round" opacity={0.7 * k} transform={`translate(${1000 + ((i * 131) % 700)} ${220 + ((i * 97 + t * 40) % 640)}) rotate(${i * 20})`}><path d="M 0,-16 L 0,16 M -14,-8 L 14,8 M -14,8 L 14,-8" /></g>)}
      {warm && <g opacity={k}><path d="M 1000,760 C 1000,640 1100,610 1200,626 C 1330,600 1480,620 1560,660 C 1640,700 1620,780 1560,800 L 1000,800 Z" fill="#c9602e" stroke={INK} strokeWidth={9} strokeLinejoin="round" /><path d="M 1060,690 C 1200,670 1380,676 1520,700" stroke="#ffd9a0" strokeWidth={10} opacity={0.5} fill="none" strokeLinecap="round" /></g>}
    </InsertBG>
  );
};

// ---------------- Jake hits snooze ----------------
export const SnoozeShot: React.FC<{t: number}> = ({t}) => {
  const hit = T('snooze'), fall = ramp(t, hit - 0.25, hit), hy = -120 + fall * 520, ring = t < hit ? 1 : 0, after = ramp(t, hit + 0.1, hit + 0.4);
  return (
    <Frame bg="#0b0e22">
      <RoomArt t={t} />
      <g transform="translate(960 540) scale(2.2) translate(-960 -702)"><ClockBig t={t} ring={ring} /></g>
      <path d={`M 1180,-100 L 1180,${hy}`} stroke={INK} strokeWidth={168} strokeLinecap="round" /><path d={`M 1180,-100 L 1180,${hy}`} stroke="#6b4fc4" strokeWidth={150} strokeLinecap="round" />
      <Hand p={[1180, hy + 20]} ang={90} kind="open" r={74} skin="#f1eefb" />
      <g opacity={after} transform={`translate(960 ${200 - 10 * (1 - after)})`}><rect x={-170} y={-46} width={340} height={92} rx={46} fill="#6b4fc4" stroke={INK} strokeWidth={8} /><Txt x={0} y={20} s={58} ls={4}>SNOOZE</Txt></g>
      {after > 0 && [0, 1, 2].map((i) => <text key={i} x={1240 + i * 40} y={380 - i * 60 - ((t * 30) % 16)} fontFamily={MONT} fontWeight={800} fontSize={50 + i * 16} fill="#cfd8ff" opacity={after}>z</text>)}
    </Frame>
  );
};
import {Clock} from './scenes';
const ClockBig: React.FC<{t: number; ring: number}> = ({t, ring}) => <Clock t={t} ring={ring} label="6:00" />;

// ---------------- Sam sits up on the edge of the bed, then stands ----------------
export const GetUp: React.FC<{t: number; standAt: number}> = ({t, standAt}) => {
  const stand = t >= standAt, k = ramp(t, standAt, standAt + 0.3);
  return (
    <Frame>
      <RoomArt t={t} />
      <rect x={110} y={900} width={760} height={70} rx={20} fill="#3d4180" stroke={INK} strokeWidth={8} /><rect x={120} y={966} width={740} height={34} fill="#2a2146" stroke={INK} strokeWidth={7} />
      <ellipse cx={230} cy={880} rx={90} ry={32} fill="#e2e6ff" stroke={INK} strokeWidth={7} />
      <path d="M 110,900 C 140,820 260,804 340,830 C 520,800 640,830 660,900 Z" fill="#2f7a96" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <SideHero x={stand ? 880 + k * 40 : 700} y={1000} scale={1.1} t={t} id="gu" mood={stand ? 'determined' : 'tired'} fat={0.5} pose={stand ? 'stand' : {...SIDE.sit, torso: 6, head: 6, heldN: undefined, handN: [150, -300], handF: [130, -296]}} {...SAM} />
    </Frame>
  );
};

// ---------------- the gym ----------------
export const GymBG: React.FC<{t: number; clock?: string}> = ({t, clock = '6:30 AM'}) => (
  <g>
    <defs><linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#15213f" /><stop offset="1" stopColor="#0c1226" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#gw)" /><rect y={820} width={1920} height={260} fill="#14172c" />
    {Array.from({length: 6}, (_, i) => <path key={i} d={`M 0,${850 + i * 48} L 1920,${850 + i * 48}`} stroke="#0b0d1e" strokeWidth={4} />)}
    <rect y={806} width={1920} height={14} fill="#2a2f5a" stroke={INK} strokeWidth={4} />
    {[0, 1, 2].map((i) => <rect key={i} x={160 + i * 640} y={110} width={360} height={300} rx={14} fill="#1c3866" stroke={INK} strokeWidth={8} opacity={0.8} />)}
    <g transform="translate(1500 120)"><rect x={-150} y={-50} width={300} height={100} rx={14} fill="#12080c" stroke={INK} strokeWidth={8} /><text x={0} y={26} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={64} fill="#ff4a4a" style={{filter: 'drop-shadow(0 0 8px #ff2a2a)'}}>{clock}</text></g>
    <g transform="translate(260 560)"><rect x={-170} y={0} width={340} height={250} rx={10} fill="#232848" stroke={INK} strokeWidth={8} />{[0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => <circle key={r + '' + c} cx={-120 + c * 60} cy={50 + r * 76} r={24} fill="#4a5078" stroke={INK} strokeWidth={5} />))}</g>
    <g transform="translate(1540 540)"><rect x={-130} y={-60} width={14} height={330} fill="#3a3f6a" stroke={INK} strokeWidth={6} /><rect x={116} y={-60} width={14} height={330} fill="#3a3f6a" stroke={INK} strokeWidth={6} /><rect x={-180} y={-20} width={360} height={14} rx={6} fill="#9aa0c0" stroke={INK} strokeWidth={5} />{[-190, 190].map((x) => <rect key={x} x={x - 14} y={-60} width={28} height={90} rx={8} fill="#2e3242" stroke={INK} strokeWidth={5} />)}</g>
    <rect x={760} y={760} width={400} height={50} rx={14} fill="#3b2f66" stroke={INK} strokeWidth={7} /><rect x={820} y={810} width={20} height={60} fill="#232848" /><rect x={1080} y={810} width={20} height={60} fill="#232848" />
  </g>
);
export const GymWalk: React.FC<{t: number}> = ({t}) => {
  const a = T('sam walks into'), b = T('630') + 0.5, k = ramp(t, a, b), w = t * 9;
  const pose: SidePose = {...SIDE.stand, footN: [18 + Math.sin(w) * 46, -28 - Math.max(0, Math.cos(w)) * 16], footF: [-14 - Math.sin(w) * 46, -28 - Math.max(0, -Math.cos(w)) * 16], handN: [20 - Math.sin(w) * 40, -292], handF: [-8 + Math.sin(w) * 40, -292]};
  return <Frame><GymBG t={t} /><SideHero x={160 + k * 700} y={1010} scale={1.0} t={t} id="gw" mood="neutral" fat={0.5} pose={pose} {...SAM} top="hoodie" /></Frame>;
};
export const LostShot: React.FC<{t: number}> = ({t}) => {
  const a = T('he doesnt know where');
  return (
    <Frame>
      <GymBG t={t} />
      {[0, 1, 2].map((i) => { const k = ramp(t, a + i * 0.7, a + i * 0.7 + 0.25); return <text key={i} x={720 + i * 240} y={250 + (i % 2) * 60 - (1 - k) * 20} fontFamily={MONT} fontWeight={800} fontSize={150} fill="#ffd23f" stroke={INK} strokeWidth={14} paintOrder="stroke" opacity={k} transform={`rotate(${(i - 1) * 12} ${720 + i * 240} 250)`}>?</text>; })}
      <Hero x={960} y={1050} scale={1.08} t={t} id="ls" mood="neutral" look={[Math.sin(t * 2.4) * 0.9, 0.1]} fat={0.5} top="hoodie" topColor={SAM.topColor} pose={{arm: [40, 150 + Math.sin(t * 3) * 10], hand: 'open'}} />
    </Frame>
  );
};
export const StrainShot: React.FC<{t: number}> = ({t}) => {
  const light = T('doesnt feel light'), s = ramp(t, light - 0.3, light + 0.3), bob = Math.sin(t * (3 + s * 1.5)) * (34 - s * 8);
  const pose: SidePose = {...SIDE.curl, handN: [96 - s * 30, -462 + bob * 1.2]};
  return (
    <Frame>
      <GymBG t={t} />
      <SideHero x={900} y={1010} scale={0.98} t={t} id="st" mood={s > 0.5 ? 'sad' : 'determined'} fat={0.5} pose={pose} {...SAM} top="tank" shorts />
      {s > 0.3 && [0, 1, 2].map((i) => <ellipse key={i} cx={940 + i * 24} cy={250 + ((t * 120 + i * 40) % 120)} rx={9} ry={14} fill="#9fd6ff" opacity={0.8 * (1 - ((t * 120 + i * 40) % 120) / 130)} />)}
      <g opacity={1 - s}><Txt x={1380} y={300} s={96} c="#3ddc84">FEELS LIGHT</Txt></g>
      <g opacity={s}><Txt x={1380} y={300} s={96} c="#ff6a6a">NOT ANYMORE</Txt></g>
    </Frame>
  );
};
export const Timer20: React.FC<{t: number}> = ({t}) => (
  <InsertBG glow="#ffd23f">
    <RingG t={t} a={T('he does 20')} b={T('he does 20') + 1.0} total={20} unit="MINUTES" x={960} y={470} r={250} />
    <Txt x={960} y={930} s={150} c="#eef1ff" o={ramp(t, T('thats it'), T('thats it') + 0.25)}>THAT'S IT.</Txt>
  </InsertBG>
);
export const SoreMorning: React.FC<{t: number}> = ({t}) => {
  const a = T('cant lift'), up = Math.abs(Math.sin((t - a) * 2.0)), tremor = Math.sin(t * 22) * 5;
  return (
    <Frame>
      <rect width={1920} height={1080} fill="#17223f" />{Array.from({length: 12}, (_, i) => <path key={i} d={`M ${i * 160},0 L ${i * 160},1080`} stroke="#101a33" strokeWidth={4} />)}{Array.from({length: 9}, (_, i) => <path key={'h' + i} d={`M 0,${i * 130} L 1920,${i * 130}`} stroke="#101a33" strokeWidth={4} />)}
      <rect x={1150} y={150} width={420} height={470} rx={26} fill="#3b5a8c" stroke={INK} strokeWidth={10} opacity={0.85} /><rect x={1170} y={170} width={380} height={430} rx={16} fill="#6f93c8" opacity={0.5} />
      <rect x={1100} y={780} width={540} height={60} rx={14} fill="#c9ced8" stroke={INK} strokeWidth={8} /><rect x={1330} y={640} width={26} height={150} fill="#9aa0c0" stroke={INK} strokeWidth={6} /><rect x={1500} y={720} width={60} height={70} rx={14} fill="#3ddc84" stroke={INK} strokeWidth={6} />
      <Hero x={620} y={1060} scale={1.08} t={t} id="sm" mood="sad" fat={0.5} top="tee" topColor={SAM.topColor} pose={{arm: [34 + tremor, 120 - 190 * up * 0.55], hand: 'open'}} />
      {up > 0.35 && [0, 1].map((i) => <text key={i} x={500 + i * 240} y={300} fontFamily={MONT} fontWeight={800} fontSize={90} fill="#ff6a6a" stroke={INK} strokeWidth={9} paintOrder="stroke" transform={`rotate(${i ? 12 : -12} ${500 + i * 240} 300)`}>!</text>)}
    </Frame>
  );
};
export const PhoneAcross: React.FC<{t: number}> = ({t}) => {
  const put = T('other side') + 0.1, reach = ramp(t, T('puts his') - 0.1, put), done = t > put;
  const pose: SidePose = {...SIDE.stand, handN: [20 + reach * 360, -292 - reach * 130], handF: [-8, -292], heldN: done ? undefined : 'phone', handKindN: 'relaxed'};
  return (
    <Frame>
      <RoomArt t={t} />
      <rect x={1420} y={640} width={330} height={170} rx={14} fill="#3a2b54" stroke={INK} strokeWidth={8} /><rect x={1440} y={810} width={22} height={150} fill="#2a2146" /><rect x={1710} y={810} width={22} height={150} fill="#2a2146" />
      {done && <g><rect x={1520} y={612} width={110} height={34} rx={8} fill="#12151f" stroke={INK} strokeWidth={6} /><ellipse cx={1575} cy={618} rx={70} ry={20} fill="#4aa8ff" opacity={0.35} /></g>}
      <path d="M 1000,520 C 1160,430 1300,430 1500,560" stroke="#ffd23f" strokeWidth={8} strokeDasharray="22 16" fill="none" strokeLinecap="round" opacity={ramp(t, put - 0.8, put)} />
      <SideHero x={760} y={1020} scale={1.1} t={t} id="pa" mood="determined" fat={0.5} pose={pose} {...SAM} top="hoodie" />
      <Txt x={1400} y={430} s={64} c="#ffd23f" o={ramp(t, put - 0.8, put)}>OTHER SIDE OF THE ROOM</Txt>
    </Frame>
  );
};
export const ReadPages: React.FC<{t: number}> = ({t}) => {
  return (
    <InsertBG glow="#ffb25a">
      <circle cx={1500} cy={380} r={190} fill="#ffb25a" opacity={0.2} style={{filter: 'blur(24px)'}} />
      <rect x={260} y={810} width={1000} height={90} rx={20} fill="#3d4180" stroke={INK} strokeWidth={8} />
      <SideHero x={760} y={960} scale={0.95} t={t} id="rp" mood="neutral" fat={0.5} pose={{...SIDE.sit, heldN: 'book', torso: 8, head: 20}} {...SAM} top="hoodie" />
      <RingG t={t} a={T('reads')} b={T('pages') + 0.3} total={10} unit="PAGES" x={1500} y={320} r={150} />
    </InsertBG>
  );
};
export const LightsOut: React.FC<{t: number}> = ({t}) => {
  const off = T('turns off') + 0.2, k = ramp(t, off, off + 0.35);
  return <BedSolo t={t} who="sam" eyes={k > 0.5 ? 'closed' : 'open'} mood="neutral" lamp={k < 0.5} dark={0.62 * k} z={k > 0.9} />;
};
