import React from 'react';
import {Hero, INK} from '../winter/Hero';
import {InsertBG} from '../same2d/inserts';
import {ramp} from '../same2d/fx';
import {MONT, DIGI} from '../same2d/theme';
import {Frame, RoomArt, Txt, Pill} from '../winter/scenes';

// ============================================================================================
// OVERTHINKING scenes: the new pieces (email window, thought clouds, card rows, week strip, ceiling). The two men, the room, text cards and pills come from src/winter.
// `t` is always the ABSOLUTE video time, so every beat sits on T('a phrase').
// ============================================================================================
export const OLOOK = {
  sam: {topColor: '#e9962c', cast: undefined as any},
  jake: {topColor: '#6b4fc4', cast: 'colleague' as any},
  friend: {topColor: '#3b8d6b', cast: 'friend' as any},
  sarah: {topColor: '#d84f8a', cast: 'mom' as any},
  boss: {topColor: '#3b6fd8', cast: 'manager' as any},
  cousin: {topColor: '#3b8d6b', cast: 'aunt' as any},
};
export type Who = keyof typeof OLOOK;
export type ManP = {who?: Who; mood?: any; open?: number; pose?: any; fat?: number; muscle?: number; top?: 'tee' | 'hoodie' | 'tank'; x?: number; y?: number; scale?: number; look?: [number, number]; id?: string};
export const Fig: React.FC<{t: number; m: ManP; x: number}> = ({t, m, x}) => {
  const w = m.who ?? 'sam';
  return <Hero x={m.x ?? x} y={m.y ?? 1050} scale={m.scale ?? 1.05} t={t} id={m.id ?? 'o' + w + Math.round(x)} mood={m.mood ?? 'neutral'} open={m.open} look={m.look} fat={m.fat ?? (w === 'sam' || w === 'jake' ? 0.35 : 0.2)} muscle={m.muscle ?? 0} top={m.top ?? 'tee'} topColor={OLOOK[w].topColor} cast={OLOOK[w].cast} pose={m.pose ?? 'idle'} />;
};
export const OSolo: React.FC<{t: number; m: ManP; bg?: 'room' | 'office' | 'dinner' | 'cafe' | 'none'; dawn?: number; children?: React.ReactNode}> = ({t, m, bg = 'room', dawn = 0, children}) => (
  <Frame>{bg === 'room' && <RoomArt t={t} dawn={dawn} />}{bg === 'office' && <OfficeBG />}{bg === 'dinner' && <DinnerBG t={t} />}{bg === 'cafe' && <CafeBG t={t} />}<Fig t={t} m={m} x={960} />{children}</Frame>
);
export const OPair: React.FC<{t: number; left: ManP; right: ManP; bg?: 'room' | 'office' | 'cafe' | 'dinner' | 'none'; dawn?: number; children?: React.ReactNode}> = ({t, left, right, bg = 'room', dawn = 0, children}) => (
  <Frame>
    {bg === 'room' && <RoomArt t={t} dawn={dawn} />}{bg === 'office' && <OfficeBG />}{bg === 'cafe' && <CafeBG t={t} />}{bg === 'dinner' && <DinnerBG t={t} />}
    <Fig t={t} m={left} x={560} /><Fig t={t} m={right} x={1360} />{children}
  </Frame>
);

// ---------------- backgrounds ----------------
export const OfficeBG: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#26305a" /><rect y={800} width={1920} height={280} fill="#171c3a" /><rect y={786} width={1920} height={16} fill="#34406e" stroke={INK} strokeWidth={4} />
    {[0, 1, 2].map((i) => <g key={i}><rect x={180 + i * 640} y={130} width={360} height={380} rx={14} fill="#a9c8f0" stroke={INK} strokeWidth={8} opacity={0.85} />{Array.from({length: 7}, (_, j) => <path key={j} d={`M ${180 + i * 640},${170 + j * 52} L ${540 + i * 640},${170 + j * 52}`} stroke="#6e8fc0" strokeWidth={8} />)}</g>)}
    <g transform="translate(1700 700)"><rect x={-40} y={-30} width={80} height={100} rx={12} fill="#6a4a3a" stroke={INK} strokeWidth={6} /><path d="M 0,-30 Q -70,-110 -20,-170 Q 10,-100 0,-30 M 0,-30 Q 70,-120 40,-180 Q -10,-100 0,-30" fill="#4fbf4a" stroke={INK} strokeWidth={6} /></g>
  </g>
);
export const CafeBG: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#3a2a3e" /><rect y={800} width={1920} height={280} fill="#2a1f2e" /><rect y={786} width={1920} height={16} fill="#5a3f4a" stroke={INK} strokeWidth={4} />
    <rect x={90} y={40} width={380} height={140} rx={14} fill="#f0d6a0" stroke={INK} strokeWidth={8} opacity={0.9} /><Txt x={280} y={134} s={74} c="#6a3a2a">COFFEE</Txt>
    {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${760 + i * 190} ${210 + (i % 2) * 40})`}><path d="M -40,-50 L 40,-50 L 28,40 L -28,40 Z" fill="#f4f4ff" stroke={INK} strokeWidth={6} /><path d={`M -10,-70 q -12,-24 0,-48 M 14,-70 q 12,-24 0,-48`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5 + 0.3 * Math.sin(t * 3 + i)} /></g>)}
    <rect x={720} y={760} width={480} height={50} rx={10} fill="#6a4a3a" stroke={INK} strokeWidth={8} /><rect x={950} y={810} width={24} height={150} fill="#3a2b24" />
  </g>
);
export const DinnerBG: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#2b1f2e" /><rect y={800} width={1920} height={280} fill="#1d1522" />
    {Array.from({length: 18}, (_, i) => { const x = i * 112 + 30, y = 110 + Math.sin(i * 0.9) * 28; return <g key={i}><circle cx={x} cy={y + 12} r={26} fill="#ffd23f" opacity={0.12 + 0.08 * Math.sin(t * 4 + i)} /><circle cx={x} cy={y + 12} r={9} fill="#ffd9a0" stroke={INK} strokeWidth={3} /></g>; })}
    <rect x={120} y={720} width={1680} height={60} rx={12} fill="#6a4a3a" stroke={INK} strokeWidth={9} />
    {[[360, '#e0503a'], [700, '#f2c27a'], [1230, '#e0503a'], [1560, '#f2c27a']].map(([x, c], i) => <g key={i} transform={`translate(${x} 706)`}><ellipse rx={90} ry={22} fill="#f4f4ff" stroke={INK} strokeWidth={6} /><ellipse cy={-8} rx={64} ry={14} fill={c as string} stroke={INK} strokeWidth={4} /></g>)}
  </g>
);

// ---------------- the ceiling at 2:00 AM, thoughts spinning ----------------
export const Ceiling: React.FC<{t: number; clock?: string; words?: string[]; calm?: boolean}> = ({t, clock = '2:00 AM', words = ['WHAT IF?', 'WHY DID I', 'SHOULD I', 'WHAT IF I DON\'T', 'IF ONLY'], calm}) => (
  <Frame bg="#05060f">
    <defs><radialGradient id="cl" cx="50%" cy="30%" r="80%"><stop offset="0" stopColor="#1a2250" /><stop offset="1" stopColor="#05060f" /></radialGradient></defs>
    <rect width={1920} height={1080} fill="url(#cl)" />
    <path d="M 640,0 L 700,120 L 650,210 L 760,330 L 720,430 L 840,560 M 700,120 L 800,170 M 760,330 L 880,300" stroke="#0a0c1c" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M 640,0 L 700,120 L 650,210 L 760,330 L 720,430 L 840,560" stroke="#3a4278" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
    {!calm && words.map((w, i) => { const a = t * (0.6 + i * 0.13) + i * 1.7, r = 300 + 60 * Math.sin(t * 0.8 + i), x = 1000 + Math.cos(a) * r * 1.0, y = 480 + Math.sin(a) * r * 0.55; return <g key={i} opacity={0.35 + 0.3 * Math.sin(t + i)} transform={`translate(${x} ${y}) rotate(${Math.sin(a) * 10})`}><Txt x={0} y={0} s={w.length > 14 ? 38 : 54 + (i % 3) * 12} c="#9aa6e0" o={0.9}>{w}</Txt></g>; })}
    <g transform="translate(1560 190) scale(0.8)"><rect x={-230} y={-80} width={460} height={160} rx={20} fill="#12080c" stroke={INK} strokeWidth={9} /><text x={0} y={36} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={104} fill="#ff4a4a" style={{filter: 'drop-shadow(0 0 8px #ff2a2a)'}}>{clock}</text></g>
  </Frame>
);

// ---------------- cards in a row, each one pops in on its word ----------------
export type Card = {label: string; at: number; icon: 'office' | 'money' | 'home' | 'eyes' | 'mail' | 'girl' | 'bulb' | 'phone' | 'book' | 'shop' | 'laptop'; c?: string};
export const Icon: React.FC<{k: Card['icon']; t: number}> = ({k, t}) => {
  switch (k) {
    case 'office': return <g><rect x={-110} y={-110} width={220} height={220} rx={10} fill="#6f93c8" stroke={INK} strokeWidth={8} />{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={r + '' + c} x={-84 + c * 62} y={-84 + r * 62} width={40} height={40} rx={6} fill="#ffe9a0" stroke={INK} strokeWidth={4} />))}</g>;
    case 'money': return <g><rect x={-130} y={-70} width={260} height={140} rx={12} fill="#3ddc84" stroke={INK} strokeWidth={8} /><circle r={42} fill="#b8f2cc" stroke={INK} strokeWidth={6} /><Txt x={0} y={22} s={64} c="#1b4a30">$</Txt></g>;
    case 'home': return <g><path d="M -130,20 L 0,-110 L 130,20 L 100,20 L 100,110 L -100,110 L -100,20 Z" fill="#e0a05a" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><rect x={-26} y={30} width={52} height={80} fill="#6a4a3a" stroke={INK} strokeWidth={6} /></g>;
    case 'eyes': return <g>{[-62, 62].map((x) => <g key={x}><ellipse cx={x} cy={0} rx={52} ry={36} fill="#f6f7ff" stroke={INK} strokeWidth={7} /><circle cx={x} cy={8} r={22} fill="#2a2a5a" /><path d={`M ${x - 52},-6 Q ${x},-40 ${x + 52},-6`} stroke="#8f86c4" strokeWidth={10} fill="none" /></g>)}</g>;
    case 'mail': return <g><rect x={-130} y={-80} width={260} height={170} rx={14} fill="#f4f6ff" stroke={INK} strokeWidth={8} /><path d="M -130,-70 L 0,30 L 130,-70" stroke={INK} strokeWidth={8} fill="none" strokeLinejoin="round" /><circle cx={100} cy={-76} r={26} fill="#ff4a5e" stroke={INK} strokeWidth={5} /></g>;
    case 'girl': return <g><circle r={92} fill="#ffe0c0" stroke={INK} strokeWidth={8} /><path d="M -92,-10 A 92 92 0 0 1 92,-10 Q 40,-70 -92,-10 Z" fill="#6b3f2a" stroke={INK} strokeWidth={7} /><path d="M -34,26 Q 0,64 34,26" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" /><circle cx={-32} cy={-6} r={8} fill={INK} /><circle cx={32} cy={-6} r={8} fill={INK} /></g>;
    case 'bulb': return <g><circle cy={-20} r={84} fill="#ffd23f" stroke={INK} strokeWidth={8} /><rect x={-34} y={56} width={68} height={52} rx={10} fill="#c9ced8" stroke={INK} strokeWidth={7} />{[0, 1, 2, 3, 4].map((i) => <path key={i} d="M 0,-130 L 0,-160" stroke="#ffd23f" strokeWidth={10} strokeLinecap="round" transform={`rotate(${-80 + i * 40} 0 -20)`} />)}</g>;
    case 'phone': return <g><rect x={-60} y={-110} width={120} height={220} rx={22} fill="#12151f" stroke={INK} strokeWidth={8} /><rect x={-48} y={-90} width={96} height={170} rx={10} fill="#4aa8ff" opacity={0.85} /></g>;
    case 'book': return <g><rect x={-120} y={-90} width={110} height={180} rx={8} fill="#f8f1dc" stroke={INK} strokeWidth={8} /><rect x={10} y={-90} width={110} height={180} rx={8} fill="#f8f1dc" stroke={INK} strokeWidth={8} /><path d="M -96,-50 L -30,-50 M -96,-10 L -30,-10 M 36,-50 L 96,-50 M 36,-10 L 96,-10" stroke="#b8ae92" strokeWidth={9} strokeLinecap="round" /></g>;
    case 'shop': return <g><rect x={-130} y={-30} width={260} height={140} fill="#f0d6a0" stroke={INK} strokeWidth={8} /><path d="M -146,-30 L -110,-100 L 110,-100 L 146,-30 Z" fill="#d9534f" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><rect x={-30} y={20} width={60} height={90} fill="#6a4a3a" stroke={INK} strokeWidth={6} /></g>;
    default: return <g><rect x={-140} y={-90} width={280} height={180} rx={14} fill="#2a2f55" stroke={INK} strokeWidth={9} /><rect x={-120} y={-72} width={240} height={140} rx={6} fill="#4aa8ff" opacity={0.7} /><rect x={-170} y={96} width={340} height={22} rx={8} fill="#c9ced8" stroke={INK} strokeWidth={7} /></g>;
  }
};
export const CardRow: React.FC<{t: number; cards: Card[]; glow?: string; y?: number; children?: React.ReactNode}> = ({t, cards, glow = '#6fa0ff', y = 500, children}) => {
  const n = cards.length, gap = n <= 3 ? 560 : 470, sc = n <= 3 ? 1 : 0.9, x0 = 960 - ((n - 1) * gap) / 2;
  return (
    <InsertBG glow={glow}>
      {cards.map((c, i) => {
        const k = ramp(t, c.at - 0.05, c.at + 0.3), x = x0 + i * gap;
        return (
          <g key={c.label + i} transform={`translate(${x} ${y + (1 - k) * 60}) scale(${sc})`} opacity={k}>
            <rect x={-230} y={-270} width={460} height={540} rx={40} fill="#1d2248" stroke={INK} strokeWidth={9} />
            <g transform="translate(0 -40)"><Icon k={c.icon} t={t} /></g>
            {(() => { const w = c.label.split(' '), two = c.label.length > 12 && w.length > 1, m = Math.ceil(w.length / 2), ls2 = two ? [w.slice(0, m).join(' '), w.slice(m).join(' ')] : [c.label]; return ls2.map((ln, j) => <Txt key={j} x={0} y={(two ? 168 : 200) + j * 52} s={two ? 44 : 56} c={c.c ?? '#fff'} ls={2}>{ln}</Txt>); })()}
          </g>
        );
      })}
      {children}
    </InsertBG>
  );
};

// ---------------- the email window: lines type in, can be deleted, a Send button, a sent stamp ----------------
export type MailLine = {text: string; at: number; dur?: number; del?: number; c?: string};
export const EmailUI: React.FC<{t: number; lines: MailLine[]; subject?: string; to?: string; version?: string; sendAt?: number; hit?: number; hilite?: {line: number; at: number; to: number}; stamp?: string; glow?: string; children?: React.ReactNode}> = ({t, lines, subject = 'Application: Senior Role', to = 'To: Manager', version, sendAt, hit, hilite, stamp, glow = '#4aa8ff', children}) => {
  const sent = sendAt !== undefined && t >= sendAt, pulse = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <InsertBG glow={glow}>
      <g transform="translate(960 540)">
        <rect x={-640} y={-400} width={1280} height={800} rx={36} fill="#f6f7ff" stroke={INK} strokeWidth={10} /><rect x={-640} y={-400} width={1280} height={86} rx={36} fill="#3b5fd8" stroke={INK} strokeWidth={10} />
        <Txt x={-600} y={-342} s={40} anchor="start" ls={2}>NEW MESSAGE</Txt>{[0, 1, 2].map((i) => <circle key={i} cx={560 + i * 30} cy={-358} r={9} fill="#fff" opacity={0.7} />)}
        <Txt x={-600} y={-250} s={38} anchor="start" c="#4a4f7a">{to}</Txt><Txt x={-600} y={-196} s={38} anchor="start" c="#4a4f7a">{subject}</Txt><path d="M -610,-166 L 610,-166" stroke="#c9d0ee" strokeWidth={5} />
        {lines.map((l, i) => {
          const d = l.dur ?? 0.9, n = Math.round(l.text.length * ramp(t, l.at, l.at + d)), k = l.del !== undefined ? Math.round(n * (1 - ramp(t, l.del, l.del + 0.45))) : n, hl = hilite && hilite.line === i && t >= hilite.at && t < hilite.to;
          return <g key={i}>{hl && <rect x={-612} y={-118 + i * 84} width={l.text.length * 26 + 20} height={66} rx={10} fill="#ffd23f" opacity={0.85} />}<Txt x={-600} y={-70 + i * 84} s={Math.min(52, 1190 / (l.text.length * 0.58))} anchor="start" c={l.c ?? '#1b1a3a'}>{l.text.slice(0, Math.max(0, k))}</Txt></g>;
        })}
        {version && <g transform="translate(470 330)"><rect x={-130} y={-34} width={260} height={68} rx={14} fill="#ffe9a0" stroke={INK} strokeWidth={6} /><Txt x={0} y={14} s={36} c="#6a4a00">{version}</Txt></g>}
        <g transform={`translate(-480 330) scale(${hit !== undefined && Math.abs(t - hit) < 0.15 ? 0.94 : 1})`}><rect x={-120} y={-44} width={240} height={88} rx={22} fill={sent ? '#3ddc84' : '#3b5fd8'} stroke={INK} strokeWidth={8} opacity={sendAt === undefined ? 0.5 : 1} /><Txt x={0} y={14} s={44} ls={3}>{sent ? 'SENT' : 'SEND'}</Txt>{sendAt !== undefined && !sent && <rect x={-132} y={-56} width={264} height={112} rx={30} fill="none" stroke="#ffd23f" strokeWidth={8} opacity={pulse} />}</g>
        {sent && <g transform={`translate(260 90) rotate(-8) scale(${0.8 + 0.2 * ramp(t, sendAt!, sendAt! + 0.15)})`} opacity={ramp(t, sendAt!, sendAt! + 0.12)}><rect x={-230} y={-72} width={460} height={144} rx={18} fill="none" stroke="#3ddc84" strokeWidth={14} /><Txt x={0} y={32} s={100} c="#3ddc84" ls={4}>{stamp ?? 'SENT'}</Txt></g>}
      </g>
      {children}
    </InsertBG>
  );
};

// ---------------- a cloud of loud thoughts around one head ----------------
export type Thought = {text: string; at: number; to?: number; x: number; y: number; s?: number};
export const ThoughtCloud: React.FC<{t: number; items: Thought[]; c?: string}> = ({t, items, c = '#2a2150'}) => (
  <g>
    {items.map((it, i) => {
      const a = ramp(t, it.at, it.at + 0.2), o = a * (it.to ? 1 - ramp(t, it.to - 0.2, it.to) : 1);
      if (o <= 0) return null;
      const s = it.s ?? 44, words = it.text.split(' '), mid = Math.ceil(words.length / 2), lines = it.text.length > 22 ? [words.slice(0, mid).join(' '), words.slice(mid).join(' ')] : [it.text], longest = Math.max(...lines.map((l) => l.length)), w = longest * s * 0.6 + 70, h = s * 1.9 + (lines.length - 1) * s * 1.05, wob = Math.sin(t * 5 + i * 2) * 5;
      return (
        <g key={i} opacity={o} transform={`translate(${it.x} ${it.y + wob}) scale(${0.85 + 0.15 * a}) rotate(${Math.sin(t * 3 + i) * 2})`}>
          <rect x={-w / 2} y={-s * 0.95} width={w} height={h} rx={Math.min(s * 0.95, h / 2)} fill={c} stroke="#8a7fd8" strokeWidth={6} />{lines.map((ln, j) => <Txt key={j} x={0} y={s * 0.32 + j * s * 1.05} s={s} c="#e8e4ff">{ln}</Txt>)}
          <circle cx={-w / 2 + 40} cy={s * 1.3} r={10} fill={c} stroke="#8a7fd8" strokeWidth={4} /><circle cx={-w / 2 + 14} cy={s * 1.62} r={6} fill={c} stroke="#8a7fd8" strokeWidth={3} />
        </g>
      );
    })}
  </g>
);

// ---------------- days of the week; the current one lights up ----------------
export const DayStrip: React.FC<{t: number; days: {d: string; at: number}[]; y?: number; done?: number}> = ({t, days, y = 150, done}) => (
  <g>{days.map((x, i) => { const on = t >= x.at - 0.02, k = ramp(t, x.at, x.at + 0.25), cur = on && (i === days.length - 1 || t < days[i + 1].at - 0.02); return <g key={x.d} transform={`translate(${960 + (i - (days.length - 1) / 2) * 190} ${y})`}><rect x={-80} y={-44} width={160} height={88} rx={22} fill={cur ? '#3b6fd8' : '#1d2248'} stroke={INK} strokeWidth={7} opacity={0.4 + 0.6 * (on ? 1 : 0.4)} transform={`scale(${cur ? 0.94 + 0.06 * k : 1})`} /><Txt x={0} y={14} s={40} c={cur ? '#fff' : '#8c96c8'} ls={2}>{x.d}</Txt>{done !== undefined && i === days.length - 1 && t > done && <path d="M -90,-50 L 90,50 M 90,-50 L -90,50" stroke="#ff4a5e" strokeWidth={12} strokeLinecap="round" />}</g>; })}</g>
);

export const Chip: React.FC<{x: number; y: number; text: string; c?: string; o?: number; s?: number}> = ({x, y, text, c = '#3b6fd8', o = 1, s = 44}) => {
  const w = text.length * s * 0.6 + 60;
  return <g opacity={o} transform={`translate(${x} ${y - 10 * (1 - o)})`}><rect x={-w / 2} y={-s} width={w} height={s * 1.9} rx={s * 0.95} fill={c} stroke={INK} strokeWidth={7} /><Txt x={0} y={s * 0.4} s={s} ls={2}>{text}</Txt></g>;
};
export {Pill, Frame, RoomArt, Txt};
