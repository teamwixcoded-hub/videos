import React from 'react';
import {Hero, INK} from './Hero';
import {InsertBG} from '../same2d/inserts';
import {ramp} from '../same2d/fx';
import {MONT, DIGI} from '../same2d/theme';
import {T} from './timeline';
import {Frame, RoomArt, Txt, Pill} from './scenes';
import {LOOK} from './scenes3';

// ============================================================================================
// WINTER ARC scenes, fifth part (February, the day-90 comparison, Jake's confession, the rules, the closing question). `t` is the ABSOLUTE video time.
// ============================================================================================
export type Man5 = {who?: keyof typeof LOOK; mood?: any; open?: number; pose?: any; fat?: number; muscle?: number; top?: 'tee' | 'hoodie' | 'tank'; x?: number; scale?: number; look?: [number, number]};
const Fig: React.FC<{t: number; m: Man5; x: number; y?: number; id: string}> = ({t, m, x, y = 1050, id}) => (
  <Hero x={m.x ?? x} y={y} scale={m.scale ?? 1.05} t={t} id={id} mood={m.mood ?? 'neutral'} open={m.open} look={m.look} fat={(m.who ?? 'sam') === 'sam' || (m.who ?? 'sam') === 'jake' ? m.fat ?? 0.5 : m.fat ?? 0.25} muscle={m.muscle ?? 0} top={m.top ?? 'tee'} topColor={LOOK[m.who ?? 'sam'].topColor} cast={LOOK[m.who ?? 'sam'].cast} pose={m.pose ?? 'idle'} />
);

// ---------------- the spring window: the snow is gone (drawn over the night window) ----------------
export const SpringWin: React.FC = () => (
  <g>
    <defs><linearGradient id="spw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#86c8ff" /><stop offset="1" stopColor="#d6f0ff" /></linearGradient><clipPath id="spc"><rect x={776} y={146} width={368} height={404} /></clipPath></defs>
    <g clipPath="url(#spc)"><rect x={776} y={146} width={368} height={404} fill="url(#spw)" /><circle cx={1050} cy={250} r={44} fill="#fff7c2" /><path d="M 776,470 Q 960,400 1144,470 L 1144,550 L 776,550 Z" fill="#78c850" /><circle cx={850} cy={440} r={40} fill="#4fbf4a" stroke={INK} strokeWidth={5} /><rect x={846} y={470} width={10} height={60} fill="#8a5a30" /></g>
    <rect x={776} y={146} width={368} height={404} fill="none" stroke={INK} strokeWidth={12} /><path d="M 960,146 L 960,550 M 776,348 L 1144,348" stroke={INK} strokeWidth={10} />
  </g>
);

// ---------------- two people talking: at home, in the office or in the spring room ----------------
export const OfficeArt: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#26305a" /><rect y={800} width={1920} height={280} fill="#171c3a" /><rect y={786} width={1920} height={16} fill="#34406e" stroke={INK} strokeWidth={4} />
    {[0, 1, 2].map((i) => <g key={i}><rect x={180 + i * 640} y={130} width={360} height={380} rx={14} fill="#a9c8f0" stroke={INK} strokeWidth={8} opacity={0.85} />{Array.from({length: 7}, (_, j) => <path key={j} d={`M ${180 + i * 640},${170 + j * 52} L ${540 + i * 640},${170 + j * 52}`} stroke="#6e8fc0" strokeWidth={8} />)}</g>)}
    <g transform="translate(1700 700)"><rect x={-40} y={-30} width={80} height={100} rx={12} fill="#6a4a3a" stroke={INK} strokeWidth={6} /><path d="M 0,-30 Q -70,-110 -20,-170 Q 10,-100 0,-30 M 0,-30 Q 70,-120 40,-180 Q -10,-100 0,-30" fill="#4fbf4a" stroke={INK} strokeWidth={6} /></g>
  </g>
);
export const Pair: React.FC<{t: number; bg?: 'room' | 'office' | 'spring'; dawn?: number; left: Man5; right: Man5; children?: React.ReactNode}> = ({t, bg = 'room', dawn = 0.3, left, right, children}) => (
  <Frame>
    {bg === 'office' ? <OfficeArt /> : <RoomArt t={t} dawn={dawn} />}{bg === 'spring' && <SpringWin />}
    <Fig t={t} m={left} x={560} id="pl" /><Fig t={t} m={right} x={1360} id="pr" />
    {children}
  </Frame>
);
export const Meeting: React.FC<{t: number}> = ({t}) => {
  const panic = ramp(t, T('in a meeting'), T('in a meeting') + 0.6), calm = ramp(t, T('hes the calm'), T('hes the calm') + 0.4);
  const others: [number, 'manager' | 'mom' | 'friend' | 'colleague'][] = [[330, 'manager'], [680, 'friend'], [1250, 'mom'], [1590, 'colleague']];
  return (
    <Frame>
      <OfficeArt />
      <rect x={160} y={770} width={1600} height={70} rx={14} fill="#6a4a3a" stroke={INK} strokeWidth={9} /><rect x={240} y={840} width={26} height={160} fill="#3a2b24" /><rect x={1660} y={840} width={26} height={160} fill="#3a2b24" />
      {others.map(([x, who], i) => <Hero key={i} x={x} y={1020} scale={0.8} t={t + i} id={'mt' + i} mood={panic > 0.5 ? 'shock' : 'neutral'} open={panic > 0.5 ? 0.4 + Math.abs(Math.sin(t * 9 + i)) * 0.3 : 0} fat={0.25} top="tee" topColor={LOOK[who === 'colleague' ? 'colleague' : who === 'mom' ? 'mom' : who === 'friend' ? 'friend' : 'coworker'].topColor} cast={who} pose={panic > 0.5 ? {arm: [30 + Math.sin(t * 8 + i) * 14, -150], hand: 'open'} : 'idle'} />)}
      <Hero x={960} y={1040} scale={1.0} t={t} id="mts" mood="neutral" fat={0.3} muscle={0.4} top="tee" topColor="#e9962c" pose="idle" />
      <Pill x={960} y={170} text="CALM" c="#3ddc84" o={calm} />
    </Frame>
  );
};
export const PhoneDelivery: React.FC<{t: number}> = ({t}) => {
  const a = T('when you sleep'), k = ramp(t, a, a + 0.4), x = ramp(t, T('dont order'), T('dont order') + 0.3);
  return (
    <InsertBG glow="#ff9a6a">
      <g transform={`translate(760 ${540 + (1 - k) * 80})`} opacity={k}>
        <rect x={-210} y={-390} width={420} height={780} rx={56} fill="#12151f" stroke={INK} strokeWidth={10} /><rect x={-186} y={-362} width={372} height={724} rx={36} fill="#1c2140" />
        <circle cy={-130} r={90} fill="#ff9a6a" stroke={INK} strokeWidth={7} /><path d="M -50,-150 Q 0,-210 50,-150 L 40,-90 L -40,-90 Z" fill="#fff" opacity={0.9} /><rect x={-130} y={30} width={260} height={80} rx={40} fill="#3ddc84" stroke={INK} strokeWidth={6} /><Txt x={0} y={86} s={40}>ORDER NOW</Txt>
        <path d="M -150,-300 L 150,300" stroke="#ff4a5e" strokeWidth={26} strokeLinecap="round" opacity={x} /><path d="M 150,-300 L -150,300" stroke="#ff4a5e" strokeWidth={26} strokeLinecap="round" opacity={x} />
      </g>
      <g transform="translate(1380 520)" opacity={k}><rect x={-230} y={-90} width={460} height={180} rx={24} fill="#12080c" stroke={INK} strokeWidth={9} /><text x={0} y={46} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={110} fill="#ff4a4a" style={{filter: 'drop-shadow(0 0 8px #ff2a2a)'}}>1:00 AM</text></g>
    </InsertBG>
  );
};
export const CoinG: React.FC<{t: number; a: number}> = ({t, a}) => (
  <g transform="translate(960 880)">{Array.from({length: 14}, (_, i) => { const k = ramp(t, a + i * 0.16, a + i * 0.16 + 0.2); return <g key={i} opacity={k} transform={`translate(${(i % 3 - 1) * 8} ${-i * 22 - (1 - k) * 60})`}><ellipse rx={130} ry={34} fill="#ffd23f" stroke={INK} strokeWidth={7} /><ellipse cy={-6} rx={104} ry={22} fill="#ffe680" opacity={0.7} /></g>; })}</g>
);
export const MindCompare: React.FC<{t: number}> = ({t}) => {
  const a = T('sam finished seven'), b = T('jake finished seven'), cols = ['#2f7d5b', '#c9602e', '#3b6fd8', '#8a4fd8', '#d84f8a', '#e9962c', '#3b8d6b'];
  return (
    <InsertBG glow="#8a6fb8">
      <g transform="translate(540 900)">{cols.map((c, i) => { const k = ramp(t, a + i * 0.12, a + i * 0.12 + 0.2); return <g key={i} opacity={k} transform={`translate(${i % 2 ? 12 : -8} ${-i * 78 - (1 - k) * 40})`}><rect x={-230} y={-72} width={460} height={72} rx={10} fill={c} stroke={INK} strokeWidth={7} /><rect x={-220} y={-44} width={440} height={14} fill="#f8f1dc" opacity={0.85} /></g>; })}<Txt x={0} y={90} s={60} c="#3ddc84" o={ramp(t, a, a + 0.3)}>SAM: 7 BOOKS</Txt></g>
      <g transform="translate(1380 520)" opacity={ramp(t, b, b + 0.3)}><rect x={-300} y={-220} width={600} height={400} rx={30} fill="#12151f" stroke={INK} strokeWidth={10} /><rect x={-270} y={-190} width={540} height={340} rx={16} fill="#1c2140" />{Array.from({length: 7}, (_, i) => <g key={i} opacity={ramp(t, b + i * 0.14, b + i * 0.14 + 0.2)}><rect x={-250 + (i % 4) * 130} y={-170 + Math.floor(i / 4) * 150} width={118} height={130} rx={12} fill={['#3b6fd8', '#8a4fd8', '#d84f8a', '#e9962c', '#3b8d6b', '#6fd0ff', '#ff5a6e'][i]} stroke={INK} strokeWidth={5} /><Txt x={-191 + (i % 4) * 130} y={-86 + Math.floor(i / 4) * 150} s={44}>S{i + 1}</Txt></g>)}<rect x={-60} y={180} width={120} height={36} fill="#3a3f78" stroke={INK} strokeWidth={6} /><Txt x={0} y={300} s={60} c="#ff9a6a">JAKE: 7 SEASONS</Txt></g>
      <Txt x={960} y={150} s={80} c="#ffd23f" o={ramp(t, T('hes still waiting'), T('hes still waiting') + 0.3)}>STILL WAITING FOR THE RIGHT TIME.</Txt>
    </InsertBG>
  );
};
export const GapShot: React.FC<{t: number}> = ({t}) => {
  const a = T('the gap between'), k = ramp(t, T('that gap'), T('rest of their life') + 0.5), sx = 780 + k * 1000;
  return (
    <InsertBG glow="#ff6a6a">
      <path d="M 460,560 L 1700,560" stroke="#3a4070" strokeWidth={14} strokeLinecap="round" />
      <rect x={460} y={520} width={Math.max(0, sx - 460)} height={80} rx={20} fill="#ff4a5e" opacity={0.28} />
      <g transform="translate(460 560)" opacity={ramp(t, a, a + 0.3)}><circle r={40} fill="#ffd23f" stroke={INK} strokeWidth={8} /><Txt x={0} y={130} s={52}>THE DAY YOU DECIDE</Txt></g>
      <g transform={`translate(${Math.min(sx, 1880)} 560)`} opacity={ramp(t, a + 0.4, a + 0.7)}><circle r={40} fill="#3ddc84" stroke={INK} strokeWidth={8} /><Txt x={0} y={-80} s={52}>THE DAY YOU START</Txt></g>
      <Txt x={960} y={330} s={130} c="#ff6a6a" o={ramp(t, a + 0.2, a + 0.6)}>THE GAP</Txt>
      <Txt x={960} y={900} s={80} c="#cfe2ff" o={ramp(t, T('rest of their life') - 0.4, T('rest of their life'))}>THE REST OF THEIR LIFE</Txt>
    </InsertBG>
  );
};
export const ArcRecap: React.FC<{t: number}> = ({t}) => {
  const items = [['20 MIN MOVEMENT', T('twenty minutes of movement')], ['10 PAGES', T('10 pages', 2)], ['PHONE ACROSS THE ROOM', T('phone across the room')], ['BED BEFORE MIDNIGHT', T('bed before midnight')]] as const;
  return (
    <InsertBG glow="#3ddc84">
      {items.map(([label, at], i) => {
        const k = ramp(t, at - 0.05, at + 0.3), x = 330 + i * 420;
        return (
          <g key={label} transform={`translate(${x} ${470 + (1 - k) * 50})`} opacity={k}>
            <rect x={-190} y={-250} width={380} height={470} rx={34} fill="#1d2248" stroke={INK} strokeWidth={8} />
            {i === 0 && <g><circle r={90} fill="#e8eafb" stroke={INK} strokeWidth={7} /><path d="M 0,0 L 0,-60 M 0,0 L 42,24" stroke={INK} strokeWidth={10} strokeLinecap="round" /></g>}
            {i === 1 && <g><rect x={-100} y={-90} width={90} height={140} rx={8} fill="#f8f1dc" stroke={INK} strokeWidth={7} /><rect x={10} y={-90} width={90} height={140} rx={8} fill="#f8f1dc" stroke={INK} strokeWidth={7} /></g>}
            {i === 2 && <g><rect x={-60} y={-110} width={120} height={200} rx={20} fill="#12151f" stroke={INK} strokeWidth={7} /><rect x={-48} y={-90} width={96} height={150} rx={10} fill="#4aa8ff" opacity={0.8} /><path d="M -150,130 L 150,130" stroke="#ffd23f" strokeWidth={8} strokeDasharray="16 12" /></g>}
            {i === 3 && <g><circle r={90} fill="#e9efff" stroke={INK} strokeWidth={7} /><circle cx={34} cy={-14} r={76} fill="#1d2248" /></g>}
            <Txt x={0} y={170} s={i === 2 ? 34 : 38} ls={1}>{label}</Txt>
          </g>
        );
      })}
      <Txt x={960} y={920} s={120} c="#ffd23f" o={ramp(t, T('thats the whole arc'), T('thats the whole arc') + 0.3)}>THAT'S THE WHOLE ARC.</Txt>
    </InsertBG>
  );
};
export const PhotoShot: React.FC<{t: number}> = ({t}) => {
  const self = t >= T('then he looks'), k = ramp(t, T('he looks at a photo'), T('he looks at a photo') + 0.4);
  return (
    <InsertBG glow="#4aa8ff">
      <defs><clipPath id="ph"><rect x={760} y={170} width={400} height={740} rx={30} /></clipPath></defs>
      <g opacity={k}>
        <rect x={730} y={130} width={460} height={820} rx={60} fill="#12151f" stroke={INK} strokeWidth={10} /><rect x={760} y={170} width={400} height={740} rx={30} fill={self ? '#2a2f55' : '#86a8d8'} />
        <g clipPath="url(#ph)">
          {!self && <g><rect x={760} y={170} width={400} height={740} fill="#a9c8f0" /><Hero x={960} y={900} scale={0.62} t={t} id="ph1" mood="happy" fat={0.5} cast="colleague" top="hoodie" topColor="#6b4fc4" pose="idle" /></g>}
          {self && <Hero x={960} y={1380} scale={1.5} t={t} id="ph2" mood="sad" fat={0.75} cast="colleague" top="tee" topColor="#6b4fc4" pose="idle" />}
        </g>
        <g transform="translate(960 220)"><rect x={-90} y={-30} width={180} height={60} rx={30} fill={self ? '#ff6a6a' : '#ffd23f'} stroke={INK} strokeWidth={6} /><Txt x={0} y={14} s={34}>{self ? 'NOW' : 'DEC 1'}</Txt></g>
      </g>
    </InsertBG>
  );
};
