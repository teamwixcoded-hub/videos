import React from 'react';
import {AbsoluteFill} from 'remotion';
import {INK, UI, SERIF, SERIF_I, HAND, PAPER, GOLD} from './theme';
import {PhotoArt, PhotoKind, PhotoWall, Cup} from './props';
import {Clock} from './sets';
import {ramp, ease} from './fx';
import {shade} from './People';

// ============================================================================================
// Full-frame inserts (1920 x 1080): documents, clocks and phone screens. Time `t` is seconds into the shot.
// ============================================================================================
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

export const InsertBG: React.FC<{tone?: 'cold' | 'warm' | 'dark' | 'paper'; children: React.ReactNode}> = ({tone = 'warm', children}) => {
  const glow = {cold: '#4aa8ff', warm: '#ffb25a', dark: '#4aa8ff', paper: '#ffb25a'}[tone];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1b2150 0%, #0a0d20 75%)', overflow: 'hidden'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 16}, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={(i * 191) % 1080} r={30 + (i % 4) * 22} fill={glow} opacity={0.06 + (i % 3) * 0.03} style={{filter: 'blur(14px)'}} />)}
        {children}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- phone shell
export const Phone: React.FC<{x?: number; y?: number; s?: number; rot?: number; screen?: string; children?: React.ReactNode; shake?: number; id?: string}> = ({x = 960, y = 540, s = 1, rot = 0, screen = '#f6f3ec', children, shake = 0, id = 'p'}) => (
  <g transform={`translate(${x + Math.sin(shake * 70) * shake * 14} ${y + Math.cos(shake * 61) * shake * 8}) rotate(${rot + Math.sin(shake * 55) * shake * 2}) scale(${s})`}>
    <defs><clipPath id={'sc' + id}><rect x={-228} y={-478} width={456} height={956} rx={46} /></clipPath></defs>
    <rect x={-252} y={-502} width={504} height={1004} rx={66} fill="#17171d" stroke={INK} strokeWidth={8} style={{filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.5))'}} />
    <rect x={-228} y={-478} width={456} height={956} rx={46} fill={screen} />
    <g clipPath={`url(#sc${id})`}>{children}</g>
    <rect x={-60} y={-478} width={120} height={32} rx={16} fill="#17171d" />
  </g>
);
const Thumb: React.FC<{x: number; y: number; press?: number}> = ({x, y, press = 0}) => (
  <g transform={`translate(${x} ${y + press * 10}) rotate(-24)`} style={{filter: 'drop-shadow(0 10px 12px rgba(0,0,0,.4))'}}>
    <path d="M -34,160 L -30,10 Q -30,-36 0,-38 Q 30,-36 30,10 L 38,160 Z" fill="#ffffff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><ellipse cx={0} cy={-8} rx={20} ry={14} fill="#e8e4f6" opacity={0.7} />
  </g>
);

// ---------------------------------------------------------------- the silent phone, face up on the table (and the Transfer received light-up)
export const PhoneDark: React.FC<{t: number; light?: number; text?: string; sub?: string; zoom?: number}> = ({t, light = 0, text = 'Transfer received', sub = 'Leo  ·  $2,500'}) => (
  <InsertBG tone="cold">
    <ellipse cx={960} cy={900} rx={700} ry={90} fill="#000" opacity={0.18} />
    <g transform={`translate(960 560) scale(${1 + t * 0.018})`}>
      <rect x={-300} y={-170} width={600} height={340} rx={36} fill="#1b1b22" stroke={INK} strokeWidth={8} style={{filter: 'drop-shadow(0 26px 30px rgba(0,0,0,.45))'}} />
      <rect x={-282} y={-152} width={564} height={304} rx={22} fill={light > 0 ? '#dfe9f5' : '#0b0b10'} />
      {light > 0 && <g opacity={light}><rect x={-250} y={-100} width={500} height={110} rx={20} fill="#fff" /><circle cx={-206} cy={-45} r={26} fill="#3f78c4" /><text x={-160} y={-58} fontFamily={UI} fontWeight={700} fontSize={30} fill="#222">{text}</text><text x={-160} y={-18} fontFamily={UI} fontWeight={500} fontSize={26} fill="#666">{sub}</text></g>}
      <path d="M -270,-140 L -150,-140 L -250,150 L -282,150 Z" fill="#fff" opacity={0.05} />
    </g>
    {light > 0 && <ellipse cx={960} cy={560} rx={520} ry={260} fill="#bfe0ff" opacity={0.18 * light} />}
  </InsertBG>
);

// ---------------------------------------------------------------- 6:00 PM clock, big
export const ClockInsert: React.FC<{t: number; min: number; hourOffset?: number; label?: string; tone?: 'cold' | 'warm'; tick?: boolean}> = ({t, min, label, tone = 'warm', tick = true}) => (
  <InsertBG tone={tone}>
    <g transform={`translate(960 520) scale(${3.2 + t * 0.03})`}><Clock x={0} y={0} r={110} min={min + (tick ? Math.floor(t * 2) % 2 * 0 : 0)} sec={tick ? t * 6 : 0} /></g>
    {label && <text x={960} y={960} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={64} letterSpacing={18} fill="#fff6e6" stroke={INK} strokeWidth={1.4} style={{filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.6))'}}>{label}</text>}
  </InsertBG>
);

// ---------------------------------------------------------------- laptops on the evening desk: Sam's lid closes at `closeAt`, Adam's stays open
export const LaptopHand: React.FC<{t: number; who: 'adam' | 'sam'; closeAt?: number}> = ({t, who, closeAt = 1.6}) => {
  const warm = who === 'sam', k = who === 'sam' ? 1 - Math.pow(ramp(t, closeAt, closeAt + 0.5), 2.2) : 1, lid = 220 * k;
  const phi = (100 * k * Math.PI) / 180, topY = -330 * Math.sin(phi) + 62 * Math.cos(phi), topW = 340 + 90 * Math.max(0, Math.cos(phi) + 0.17), showScreen = phi > 1.15, handsUp = ramp(t, closeAt - 0.1, closeAt + 0.25);
  const skin = '#ffffff', sleeve = warm ? '#b4592f' : '#26324f';
  const type = Math.sin(t * 14) * 4;
  return (
    <InsertBG tone={warm ? 'warm' : 'cold'}>
      <rect x={0} y={800} width={1920} height={280} fill={warm ? '#8a5a38' : '#4a4658'} stroke={INK} strokeWidth={5} />
      <ellipse cx={960} cy={812} rx={760} ry={32} fill="#000" opacity={0.18} />
      <g transform="translate(960 800)">
        <path d="M -380,0 L 380,0 L 430,60 L -430,60 Z" fill="#c2c6cc" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        {Array.from({length: 5}, (_, r) => Array.from({length: 11}, (_, c) => <rect key={r + '-' + c} x={-330 + c * 60 + r * 4} y={8 + r * 9} width={48} height={7} rx={2} fill="#9aa0a8" opacity={0.6} />))}
        <path d={`M -380,0 L 380,0 L ${topW},${topY} L ${-topW},${topY} Z`} fill={showScreen ? '#2a2a32' : '#9aa0aa'} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        {showScreen && lid > 40 && <path d={`M -318,-14 L 318,-14 L ${298},${topY + 22} L -298,${topY + 22} Z`} fill={warm ? '#fdf4de' : '#e3ecf7'} />}
        {showScreen && lid > 90 && <g opacity={0.9}>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-250} y={-lid * 1.5 + 70 + i * 38 * (lid / 220)} width={300 - i * 24} height={12} rx={5} fill="#aab9cf" />)}<rect x={80} y={-lid * 1.5 + 150 * (lid / 220)} width={150} height={60 * (lid / 220)} rx={8} fill="#7fa0cf" /></g>}
        {/* hands on the keys */}
        {!showScreen && k < 0.55 && <ellipse cx={0} cy={topY * 0.5 + 20} rx={300} ry={26} fill="#000" opacity={0.18} />}
        <g transform={`translate(0 ${type * (1 - handsUp) - handsUp * 160})`} opacity={1 - handsUp * 0.85}>{[-1, 1].map((s) => <g key={s}><path d={`M ${s * 180},120 L ${s * 150},-4 Q ${s * 120},-30 ${s * 90},-8 L ${s * 110},130 Z`} fill={skin} stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d={`M ${s * 250},260 L ${s * 180},120 L ${s * 110},130 L ${s * 150},300 Z`} fill={sleeve} stroke={INK} strokeWidth={5} strokeLinejoin="round" /></g>)}</g>
      </g>
      {warm && k < 0.2 && <text x={960} y={300} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={84} fill="#fff6e6" opacity={ramp(t, closeAt + 0.3, closeAt + 0.7)}>click.</text>}
    </InsertBG>
  );
};

// ---------------------------------------------------------------- payslip documents (MC between the two men: same salary)
export const Payslip: React.FC<{t: number; who: 'adam' | 'sam'}> = ({t, who}) => (
  <InsertBG tone={who === 'adam' ? 'cold' : 'warm'}>
    <g transform={`translate(960 560) rotate(${who === 'adam' ? -3 : 3}) scale(${1 + t * 0.02})`} style={{filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.4))'}}>
      <rect x={-330} y={-420} width={660} height={840} fill="#fbf7ee" stroke={INK} strokeWidth={6} />
      <text x={-280} y={-340} fontFamily={UI} fontWeight={700} fontSize={36} letterSpacing={10} fill="#3a2a26">PAYSLIP</text><line x1={-280} y1={-316} x2={280} y2={-316} stroke={INK} strokeWidth={3} />
      <text x={-280} y={-260} fontFamily={UI} fontWeight={500} fontSize={30} fill="#5a4a44">Employee</text><text x={280} y={-260} textAnchor="end" fontFamily={UI} fontWeight={700} fontSize={34} fill="#3a2a26">{who === 'adam' ? 'ADAM' : 'SAM'}</text>
      {[['Basic', '3,800'], ['Overtime', '400'], ['Tax', '- 620']].map(([a, b], i) => <g key={i}><text x={-280} y={-170 + i * 64} fontFamily={UI} fontWeight={500} fontSize={30} fill="#5a4a44">{a}</text><text x={280} y={-170 + i * 64} textAnchor="end" fontFamily={UI} fontWeight={500} fontSize={30} fill="#3a2a26">{b}</text></g>)}
      <line x1={-280} y1={50} x2={280} y2={50} stroke={INK} strokeWidth={3} />
      <text x={-280} y={150} fontFamily={UI} fontWeight={700} fontSize={36} fill="#3a2a26">NET PAY</text><text x={280} y={150} textAnchor="end" fontFamily={SERIF} fontWeight={800} fontSize={86} fill={who === 'adam' ? '#26324f' : '#b4592f'}>$3,580</text>
      <rect x={-280} y={230} width={560} height={14} fill="#e6dcc6" /><rect x={-280} y={270} width={420} height={14} fill="#e6dcc6" />
      <g transform="translate(150 330) rotate(-10)" opacity={ramp(t, 0.6, 0.9)}><rect x={-120} y={-40} width={240} height={80} rx={10} fill="none" stroke="#b4592f" strokeWidth={6} /><text x={0} y={14} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={36} letterSpacing={8} fill="#b4592f">PAID</text></g>
    </g>
  </InsertBG>
);

// ---------------------------------------------------------------- the promotion letter Sam folds into a drawer (it cost him the promotion)
export const PromotionLetter: React.FC<{t: number}> = ({t}) => {
  const fold = ramp(t, 1.0, 1.8), slide = ramp(t, 1.8, 2.4);
  return (
    <InsertBG tone="warm">
      <rect x={300} y={760} width={1320} height={320} fill="#8a5a38" stroke={INK} strokeWidth={6} /><rect x={560} y={820} width={800} height={110} rx={10} fill="#7a4c2e" stroke={INK} strokeWidth={5} /><rect x={880} y={866} width={160} height={22} rx={10} fill="#d9b25a" stroke={INK} strokeWidth={3} />
      <g transform={`translate(${960} ${lerp(520, 800, slide)}) scale(${1 - slide * 0.5} ${1 - slide * 0.5})`} style={{filter: 'drop-shadow(0 24px 30px rgba(0,0,0,.4))'}}>
        <rect x={-320} y={-380} width={640} height={760 * (1 - fold * 0.45)} fill="#fbf7ee" stroke={INK} strokeWidth={6} />
        <text x={-270} y={-300} fontFamily={UI} fontWeight={700} fontSize={30} letterSpacing={8} fill="#3a2a26">OFFER LETTER</text>
        <text x={-270} y={-210} fontFamily={SERIF} fontWeight={800} fontSize={58} fill="#b4592f">Senior Manager</text>
        <text x={-270} y={-140} fontFamily={UI} fontWeight={500} fontSize={30} fill="#5a4a44">Congratulations, Sam.</text>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-270} y={-80 + i * 44} width={520 - i * 40} height={12} rx={5} fill="#e6dcc6" />)}
        <path d={`M -320,${60 * (1 - fold)} L 320,${60 * (1 - fold)}`} stroke={INK} strokeWidth={3} opacity={fold > 0.05 ? 0.6 : 0} />
      </g>
    </InsertBG>
  );
};

// ---------------------------------------------------------------- phone screens
const Bar: React.FC<{title: string; sub?: string; color?: string}> = ({title, sub, color = '#26324f'}) => (
  <g><rect x={-228} y={-478} width={456} height={150} fill={color} /><text x={-190} y={-390} fontFamily={UI} fontWeight={700} fontSize={36} fill="#fff">{title}</text>{sub && <text x={-190} y={-348} fontFamily={UI} fontWeight={500} fontSize={24} fill="#d6dcec">{sub}</text>}</g>
);
// the banking app: Adam types an amount out of habit, deletes it digit by digit, then his thumb goes to the call button and presses it
export const Banking: React.FC<{t: number; to?: string; digits?: string; typeFrom?: number; delFrom?: number; press?: number; send?: boolean; balance?: string}> = ({t, to = 'Leo', digits = '2500', typeFrom = 0.4, delFrom = 3.4, press = 7.2, send = false, balance = '$48,310'}) => {
  const typed = clamp(Math.floor((t - typeFrom) / 0.3) + 1, 0, digits.length), gone = t > delFrom ? clamp(Math.floor((t - delFrom) / 0.3) + 1, 0, digits.length) : 0, n = Math.max(0, typed - gone);
  const amt = digits.slice(0, n), thumbK = ramp(t, delFrom + 0.6, press - 0.3), pr = t > press ? 1 : 0;
  return (
    <InsertBG tone="cold">
      <Phone shake={t > press ? clamp(1 - (t - press) / 0.9, 0, 1) * 0.9 : 0} id="bk">
        <Bar title="Send money" sub={`Savings  ·  ${balance}`} />
        <rect x={-190} y={-290} width={380} height={80} rx={40} fill="#eef2f8" stroke="#cfd8e6" strokeWidth={3} /><circle cx={-148} cy={-250} r={26} fill="#3f78c4" /><text x={-148} y={-240} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={28} fill="#fff">{to[0]}</text><text x={-100} y={-240} fontFamily={UI} fontWeight={700} fontSize={32} fill="#26324f">{to}</text>
        <text x={0} y={-60} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={96} fill="#26324f">${amt ? Number(amt).toLocaleString('en-US') : ''}<tspan fill="#9aa8c0" opacity={Math.sin(t * 7) > 0 ? 1 : 0}>|</tspan></text>
        <text x={0} y={-6} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={24} fill="#8a96ac">Monthly transfer</text>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '<'].map((k, i) => <g key={i}><rect x={-190 + (i % 3) * 130} y={40 + Math.floor(i / 3) * 84} width={120} height={72} rx={18} fill={k ? '#eef2f8' : 'none'} /><text x={-130 + (i % 3) * 130} y={90 + Math.floor(i / 3) * 84} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={38} fill="#26324f">{k}</text></g>)}
        <rect x={-190} y={388} width={290} height={70} rx={35} fill={send ? '#3f9a6a' : '#26324f'} /><text x={-45} y={434} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={30} fill="#fff">SEND</text>
        <circle cx={150} cy={423} r={40} fill={pr ? '#2f9a76' : '#4c9a63'} stroke="#fff" strokeWidth={4} /><path d="M 134,404 q -6,8 4,26 q 14,14 26,6 l -8,-12 l -10,4 q -10,-10 -8,-20 l 6,-8 l -10,-10 Z" fill="#fff" />
      </Phone>
      {thumbK > 0 && <Thumb x={lerp(1250, 1110, thumbK)} y={lerp(1120, 960, thumbK)} press={pr} />}
    </InsertBG>
  );
};

// Leo's bank-transfer UI (age 25): he sends money home
export const LeoTransfer: React.FC<{t: number}> = ({t}) => {
  const done = t > 2.4;
  return (
    <InsertBG tone="cold">
      <Phone id="lt" shake={done ? clamp(1 - (t - 2.4) / 0.5, 0, 1) * 0.3 : 0}>
        <Bar title="Send money" sub="Current account" color="#3f78c4" />
        <rect x={-190} y={-290} width={380} height={80} rx={40} fill="#eef2f8" stroke="#cfd8e6" strokeWidth={3} /><circle cx={-148} cy={-250} r={26} fill="#26324f" /><text x={-148} y={-240} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={28} fill="#fff">D</text><text x={-100} y={-240} fontFamily={UI} fontWeight={700} fontSize={32} fill="#26324f">Dad</text>
        <text x={0} y={-60} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={120} fill="#26324f">$2,500</text><text x={0} y={-6} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={24} fill="#8a96ac">Every month</text>
        <rect x={-190} y={330} width={380} height={86} rx={43} fill={done ? '#3f9a6a' : '#3f78c4'} /><text x={0} y={386} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={34} fill="#fff">{done ? 'SENT' : 'SEND'}</text>
        {done && <g transform="translate(0 150)"><circle r={90} fill="#3f9a6a" opacity={0.15 + 0.1 * Math.sin(t * 8)} /><path d="M -40,0 l 28,28 l 56,-60" fill="none" stroke="#3f9a6a" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" /></g>}
      </Phone>
      {t > 1.6 && t < 2.4 && <Thumb x={lerp(1200, 1000, ramp(t, 1.6, 2.2))} y={lerp(1160, 880, ramp(t, 1.6, 2.2))} press={t > 2.2 ? 1 : 0} />}
    </InsertBG>
  );
};

// the call screen: calling / connected
export const CallScreen: React.FC<{t: number; name: string; initial: string; color?: string; mode: 'ringing' | 'incoming' | 'connected'; shake?: number}> = ({t, name, initial, color = '#4c9a63', mode, shake = 0}) => (
  <InsertBG tone={mode === 'incoming' ? 'warm' : 'cold'}>
    <Phone id="cs" screen="#1d2438" shake={shake}>
      <rect x={-228} y={-478} width={456} height={956} fill="#1d2438" />
      {[0, 1, 2].map((i) => <circle key={i} cx={0} cy={-140} r={110 + ((t * 80 + i * 60) % 180)} fill="none" stroke={color} strokeWidth={4} opacity={mode === 'connected' ? 0 : 0.5 * (1 - ((t * 80 + i * 60) % 180) / 180)} />)}
      <circle cx={0} cy={-140} r={104} fill={color} stroke="#fff" strokeWidth={5} /><text x={0} y={-104} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={104} fill="#fff">{initial}</text>
      <text x={0} y={60} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={60} fill="#fff">{name}</text>
      <text x={0} y={112} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={30} fill="#aeb8d0">{mode === 'incoming' ? 'incoming call' : mode === 'ringing' ? 'calling…' : '00:' + String(Math.floor(t) % 60).padStart(2, '0')}</text>
      {mode === 'incoming' ? <g><circle cx={-110} cy={340} r={56} fill="#d9534f" /><circle cx={110} cy={340} r={56} fill="#4c9a63" /></g> : <circle cx={0} cy={340} r={56} fill="#d9534f" />}
    </Phone>
  </InsertBG>
);

// a message thread. lines: me/them bubbles at times
export type ChatLine = {side: 'me' | 'them'; text: string; at: number};
export const Chat: React.FC<{t: number; title: string; lines: ChatLine[]; tone?: 'cold' | 'warm' | 'dark'; color?: string}> = ({t, title, lines, tone = 'cold', color = '#3f78c4'}) => (
  <InsertBG tone={tone}>
    <Phone id="ch">
      <Bar title={title} sub="online" color={color} />
      {lines.map((l, i) => {
        const k = ramp(t, l.at, l.at + 0.3); if (k <= 0) return null;
        const w = Math.min(380, 24 + l.text.length * 17), x = l.side === 'me' ? 200 - w : -200, y = -250 + lines.slice(0, i).reduce((a) => a + 112, 0);
        return <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 20})`}><rect x={x} y={y} width={w} height={88} rx={30} fill={l.side === 'me' ? color : '#e7ebf3'} /><text x={x + 20} y={y + 54} fontFamily={UI} fontWeight={500} fontSize={30} fill={l.side === 'me' ? '#fff' : '#26324f'}>{l.text}</text></g>;
      })}
    </Phone>
  </InsertBG>
);

// phone gallery: swipes through photos. `hunt` draws a searching frame over the picture
export const Gallery: React.FC<{t: number; items: {kind: PhotoKind; label: string}[]; marks?: number[]; hunt?: boolean; shadow?: boolean}> = ({t, items, marks, hunt = true, shadow = false}) => {
  const st = marks ?? items.map((_, k) => k * 2.4);
  let i = 0; for (let k = 0; k < items.length; k++) if (t >= st[k]) i = k;
  const l = t - st[i], sw = i > 0 ? 1 - ramp(l, 0, 0.35) : 0;
  return (
    <InsertBG tone="dark">
      <Phone id="ga" screen="#101216">
        <rect x={-228} y={-478} width={456} height={110} fill="#1b1d24" /><text x={-190} y={-410} fontFamily={UI} fontWeight={700} fontSize={32} fill="#fff">Photos</text><text x={190} y={-410} textAnchor="end" fontFamily={UI} fontWeight={500} fontSize={26} fill="#8a90a0">{items[i].label}</text>
        <g transform={`translate(${sw * 456} -10)`}>
          <PhotoArt kind={items[i].kind} x={-212} y={-250} w={424} h={318} />
          {shadow && i === items.length - 1 && <path d="M -212,210 L -60,210 L 80,70 L -20,60 L -212,170 Z" fill="#000" opacity={0.0} />}
        </g>
        {hunt && l > 0.5 && <g opacity={0.9}><rect x={-120 + Math.sin(l * 3) * 90} y={-190 + Math.cos(l * 2.4) * 60} width={170} height={210} rx={12} fill="none" stroke="#ffd24a" strokeWidth={6} strokeDasharray="22 12" /><text x={0} y={270} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={30} fill="#ffd24a" opacity={0.85}>looking for Adam…</text></g>}
        {items.map((_, k) => <circle key={k} cx={(k - (items.length - 1) / 2) * 30} cy={410} r={7} fill={k === i ? '#fff' : '#4a4f5e'} />)}
      </Phone>
    </InsertBG>
  );
};
// the graduation photo, full frame; only a long shadow at the edge: the photographer's
export const PhotoShadow: React.FC<{t: number}> = ({t}) => (
  <InsertBG tone="dark">
    <g transform={`translate(960 540) scale(${1.4 + t * 0.03})`} style={{filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.6))'}}>
      <rect x={-420} y={-330} width={840} height={660} fill="#fbf5e8" stroke={INK} strokeWidth={6} />
      <PhotoArt kind="grad" x={-396} y={-306} w={792} h={594} />
      <g opacity={ramp(t, 0.8, 1.6)}><path d="M -396,230 L -250,230 L -120,70 L -176,62 L -396,150 Z" fill="#000" opacity={0.62} /><ellipse cx={-176} cy={66} rx={46} ry={20} fill="#000" opacity={0.62} /></g>
    </g>
    <text x={960} y={1000} textAnchor="middle" fontFamily={SERIF_I} fontWeight={500} fontStyle="italic" fontSize={46} fill="#fff6e6" opacity={ramp(t, 1.6, 2.2)}>only a shadow at the edge.</text>
  </InsertBG>
);

// the phone camera: grid, focus box, REC dot, shutter. `children` is what the camera sees
export const Viewfinder: React.FC<{t: number; rec?: boolean; shutter?: number; children: React.ReactNode}> = ({t, rec, shutter = 0, children}) => (
  <AbsoluteFill>
    {children}
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <rect x={30} y={30} width={1860} height={1020} fill="none" stroke="#fff" strokeWidth={3} opacity={0.55} />
      {[640, 1280].map((x) => <line key={x} x1={x} y1={30} x2={x} y2={1050} stroke="#fff" strokeWidth={1.5} opacity={0.3} />)}{[360, 720].map((y) => <line key={y} x1={30} y1={y} x2={1890} y2={y} stroke="#fff" strokeWidth={1.5} opacity={0.3} />)}
      {[[30, 30, 1, 1], [1890, 30, -1, 1], [30, 1050, 1, -1], [1890, 1050, -1, -1]].map(([x, y, a, b], i) => <path key={i} d={`M ${x},${(y as number) + 70 * (b as number)} L ${x},${y} L ${(x as number) + 70 * (a as number)},${y}`} fill="none" stroke="#fff" strokeWidth={6} />)}
      <rect x={880 + Math.sin(t * 2) * 6} y={430} width={160} height={160} fill="none" stroke="#ffd24a" strokeWidth={4} />
      {rec && <g><circle cx={110} cy={100} r={16} fill="#e53935" opacity={Math.sin(t * 5) > -0.2 ? 1 : 0.2} /><text x={142} y={112} fontFamily={UI} fontWeight={700} fontSize={36} letterSpacing={4} fill="#fff">REC  00:{String(Math.floor(12 + t) % 60).padStart(2, '0')}</text></g>}
      <circle cx={960} cy={985} r={34} fill="none" stroke="#fff" strokeWidth={6} /><circle cx={960} cy={985} r={24} fill="#fff" opacity={rec ? 0 : 0.95} />
    </svg>
    {shutter > 0 && <AbsoluteFill style={{background: '#fff', opacity: shutter}} />}
  </AbsoluteFill>
);

// ---------------------------------------------------------------- IT'S RARELY THE GIFTS. IT'S THE TIME.: gift icons fade to grey while clocks glow and rise
export const GiftsToClocks: React.FC<{t: number}> = ({t}) => {
  const k = ramp(t, 0.6, 2.6);
  return (
    <InsertBG tone="dark">
      <g transform="translate(960 520) scale(1.22) translate(-960 -520)">
      {Array.from({length: 24}, (_, i) => {
        const col = i % 8, row = Math.floor(i / 8), x = 330 + col * 180, y0 = 330 + row * 230, gift = i % 2 === 0;
        const y = gift ? y0 + k * 60 : y0 - k * 70 * (0.6 + rnd(i, 1) * 0.6);
        return (
          <g key={i} transform={`translate(${x} ${y})`} opacity={gift ? lerp(1, 0.28, k) : lerp(0.25, 1, k)}>
            {gift
              ? <g filter={k > 0.2 ? 'grayscale(1)' : undefined}><rect x={-46} y={-34} width={92} height={80} rx={8} fill={['#c0392b', '#2c7ab8', '#7b4aa5', '#2f9a76'][i % 4]} stroke={INK} strokeWidth={4} /><rect x={-9} y={-34} width={18} height={80} fill="#f2d16b" stroke={INK} strokeWidth={3} /><path d="M 0,-34 q -30,-34 -38,-4 q 12,10 38,4 q 26,6 38,-4 q -8,-30 -38,4 Z" fill="#f2d16b" stroke={INK} strokeWidth={3} /></g>
              : <g><circle r={52} fill="#fbf5e8" stroke={INK} strokeWidth={4} style={{filter: `drop-shadow(0 0 ${14 * k}px #e9a93b)`}} /><line x1={0} y1={0} x2={0} y2={-32} stroke={INK} strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 30 + i * 40})`} /><line x1={0} y1={0} x2={22} y2={6} stroke={INK} strokeWidth={5} strokeLinecap="round" /></g>}
          </g>
        );
      })}
      </g>
      <text x={960} y={990} textAnchor="middle" fontFamily={UI} fontWeight={800} fontSize={84} letterSpacing={14} fill={k < 0.5 ? '#ffffff' : '#ffd77a'} stroke={INK} strokeWidth={6} paintOrder="stroke">{k < 0.5 ? 'GIFTS' : 'TIME'}</text>
    </InsertBG>
  );
};

// ---------------------------------------------------------------- Sundays at 8:00: a calendar page that flips, and one phone ringing (Sam's) or staying dark (Adam's)
export const SundayFlip: React.FC<{t: number; who: 'sam' | 'adam'; week: number; notify?: boolean}> = ({t, who, week, notify = false}) => {
  const ring = who === 'sam' ? Math.sin(t * 40) * 6 * (t < 0.9 ? 1 : 0) : 0, flip = ramp(t, 0, 0.18);
  return (
    <InsertBG tone={who === 'sam' ? 'warm' : 'cold'}>
      <g transform="translate(560 540)">
        <rect x={-230} y={-290} width={460} height={560} rx={18} fill="#fbf7ee" stroke={INK} strokeWidth={6} style={{filter: 'drop-shadow(0 24px 30px rgba(0,0,0,.4))'}} />
        <rect x={-230} y={-290} width={460} height={110} rx={18} fill={who === 'sam' ? '#b4592f' : '#26324f'} stroke={INK} strokeWidth={6} />
        <text x={0} y={-212} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={42} letterSpacing={10} fill="#fff">SUNDAY</text>
        <text x={0} y={30} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={230} fill="#3a2a26">{((week * 7 + 3) % 28) + 1}</text>
        <text x={0} y={140} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={64} letterSpacing={8} fill="#3a2a26">8:00 AM</text>
        <path d={`M -230,-290 L 230,-290 L 230,${-290 + 560 * (1 - flip)} L -230,${-290 + 560 * (1 - flip)} Z`} fill="#fbf7ee" opacity={0.0} />
        {flip < 0.99 && <rect x={-230} y={-290} width={460} height={560 * (1 - flip)} rx={18} fill="#fbf7ee" stroke={INK} strokeWidth={6} transform={`translate(0 ${560 * flip * 0})`} opacity={1 - flip} />}
      </g>
      <g transform={`translate(1360 540) rotate(${ring})`}>
        <rect x={-190} y={-380} width={380} height={760} rx={52} fill="#17171d" stroke={INK} strokeWidth={7} style={{filter: 'drop-shadow(0 24px 30px rgba(0,0,0,.45))'}} />
        <rect x={-172} y={-362} width={344} height={724} rx={38} fill={who === 'sam' ? '#1d2438' : '#0b0b10'} />
        {who === 'sam' && <g><circle cx={0} cy={-110} r={74} fill="#4c9a63" stroke="#fff" strokeWidth={4} /><text x={0} y={-80} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={80} fill="#fff">M</text><text x={0} y={40} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={50} fill="#fff">Max</text><text x={0} y={86} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={26} fill="#aeb8d0">incoming call</text><circle cx={-80} cy={250} r={44} fill="#d9534f" /><circle cx={80} cy={250} r={44} fill="#4c9a63" /></g>}
        {who === 'adam' && notify && <g><rect x={-150} y={-150} width={300} height={96} rx={18} fill="#fff" /><text x={-130} y={-108} fontFamily={UI} fontWeight={700} fontSize={26} fill="#222">Transfer received</text><text x={-130} y={-76} fontFamily={UI} fontWeight={500} fontSize={22} fill="#666">Leo · $2,500</text></g>}
      </g>
      {who === 'sam' && t < 0.9 && [0, 1].map((i) => <circle key={i} cx={1360} cy={540} r={430 + ((t * 300 + i * 90) % 180)} fill="none" stroke="#ffcf7a" strokeWidth={4} opacity={0.45 * (1 - ((t * 300 + i * 90) % 180) / 180)} />)}
    </InsertBG>
  );
};

// ---------------------------------------------------------------- the final photo: freeze to a print with a white border, then pinned on the wall
export const Polaroid: React.FC<{p: number; children: React.ReactNode; caption?: string}> = ({p, children, caption}) => {
  const k = ease(clamp(p, 0, 1)), sc = lerp(1, 0.46, k), rot = lerp(0, -4, k), y = lerp(0, 40, k);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${y}px) rotate(${rot}deg) scale(${sc})`, transformOrigin: '50% 50%', boxShadow: `0 ${30 * k}px ${60 * k}px rgba(0,0,0,.5)`, outline: `${lerp(0, 64, k)}px solid #fbf5e8`, outlineOffset: 0, borderRadius: 4}}>
        {children}
      </div>
      {caption && k > 0.6 && <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', fontFamily: HAND, fontWeight: 600, fontSize: 60, color: '#fff6e6', opacity: ramp(k, 0.6, 1)}}>{caption}</div>}
    </AbsoluteFill>
  );
};

// end card: the new print pinned on Sam's wall; the question fades in
export const EndCard: React.FC<{t: number}> = ({t}) => (
  <InsertBG tone="warm">
    <g transform="translate(960 440) scale(1.25)"><PhotoWall x={0} y={0} n={12} kite glow={1} s={1} /></g>
    <g transform={`translate(960 430) rotate(-3) scale(${lerp(1.6, 1, ramp(t, 0, 1.0))})`} opacity={ramp(t, 0, 0.8)} style={{filter: 'drop-shadow(0 20px 26px rgba(0,0,0,.5))'}}>
      <rect x={-210} y={-170} width={420} height={360} fill="#fbf5e8" stroke={INK} strokeWidth={5} />
      <PhotoArt kind="four" x={-190} y={-150} w={380} h={285} />
      <text x={0} y={162} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={40} fill="#3a2a26">Friday. All four.</text>
    </g>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 130}}>
      <div style={{background: 'radial-gradient(ellipse at center, rgba(20,12,8,.7) 0%, rgba(20,12,8,0) 70%)', padding: '40px 120px', opacity: ramp(t, 0.3, 1.1), transform: `translateY(${(1 - ramp(t, 0.3, 1.1)) * 20}px)`}}>
        <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 76, color: '#fff7e8', textAlign: 'center', lineHeight: 1.15, textShadow: '0 4px 18px rgba(0,0,0,.8)'}}>What do you remember most<br /><span style={{color: GOLD}}>about your father?</span></div>
      </div>
    </AbsoluteFill>
  </InsertBG>
);

// a small handwritten caption card (e.g. "Next time.") used over inserts
export const NoteCard: React.FC<{text: string; o: number}> = ({text, o}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 140, opacity: o, pointerEvents: 'none'}}><div style={{fontFamily: HAND, fontWeight: 600, fontSize: 96, color: '#fff6e6', textShadow: '0 4px 18px rgba(0,0,0,.8)'}}>{text}</div></AbsoluteFill>
);
export {Cup, shade, PAPER};
