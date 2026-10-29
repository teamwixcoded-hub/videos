import React from 'react';
import {INK} from './Char';
import {InsertBG} from './inserts';
import {MONT} from './theme';
import {ramp} from './fx';

const O = {stroke: INK, strokeWidth: 8, strokeLinejoin: 'round' as const};
const PhoneFrame: React.FC<{rot?: number; children: React.ReactNode; clip?: string}> = ({rot = 0, children, clip = 'pf'}) => (
  <g transform={`translate(960 540) rotate(${rot})`}>
    <rect x={-270} y={-500} width={540} height={1000} rx={64} fill="#15161f" {...O} />
    <clipPath id={clip}><rect x={-240} y={-470} width={480} height={940} rx={40} /></clipPath>
    <g clipPath={`url(#${clip})`}><rect x={-240} y={-470} width={480} height={940} fill="#0f1730" />{children}</g>
    <rect x={-60} y={-486} width={120} height={20} rx={10} fill="#0a0a10" />
  </g>
);
const Thumb: React.FC<{x: number; y: number; i: number}> = ({x, y, i}) => {
  const C = [['#ff8a5f', '#ffd36b'], ['#5f8bff', '#7be0ff'], ['#9b6bff', '#ff8ad8'], ['#2fd08a', '#b8f26b']][i % 4];
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs><linearGradient id={`th${i % 4}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C[0]} /><stop offset="1" stopColor={C[1]} /></linearGradient></defs>
      <rect x={-200} y={0} width={400} height={190} rx={18} fill={`url(#th${i % 4})`} />
      <circle cx={0} cy={95} r={34} fill="#fff" opacity={0.9} /><path d="M -10,78 L 22,95 L -10,112 Z" fill="#222" />
      <rect x={-200} y={198} width={300} height={16} rx={8} fill="#fff" opacity={0.7} /><rect x={-200} y={224} width={190} height={12} rx={6} fill="#fff" opacity={0.4} />
    </g>
  );
};

// the search for a fix: the query types itself, then videos about discipline, productivity and waking up at 5 scroll past
export const SearchPhone: React.FC<{t: number; q?: string}> = ({t, q = 'how to fix your life'}) => {
  const n = Math.min(q.length, Math.max(0, Math.floor((t - 0.2) / 0.09))), typed = q.slice(0, n), showRes = t > 0.2 + q.length * 0.09 + 0.3;
  const sc = showRes ? (t - (0.2 + q.length * 0.09 + 0.3)) * 150 : 0;
  return (
    <InsertBG glow="#4aa8ff">
      <PhoneFrame rot={-3}>
        <rect x={-210} y={-420} width={420} height={70} rx={35} fill="#fff" />
        <circle cx={-170} cy={-385} r={14} fill="none" stroke="#777" strokeWidth={5} /><line x1={-160} y1={-375} x2={-148} y2={-363} stroke="#777" strokeWidth={5} strokeLinecap="round" />
        <text x={-130} y={-372} fontFamily={MONT} fontWeight={800} fontSize={32} fill="#1d1a2e">{typed}{Math.floor(t * 2.4) % 2 === 0 && !showRes ? '|' : ''}</text>
        {showRes && [0, 1, 2, 3, 4].map((i) => <Thumb key={i} x={0} y={-320 + i * 250 - sc} i={i} />)}
      </PhoneFrame>
    </InsertBG>
  );
};

export const ChatPhone: React.FC<{t: number; mode: 'invite' | 'cancel'}> = ({t, mode}) => {
  const bub = (y: number, w: number, text: string, mine: boolean, at: number) => {
    const o = ramp(t, at, at + 0.25);
    return o <= 0 ? null : (
      <g key={y} opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
        <rect x={mine ? 210 - w : -210} y={y} width={w} height={74} rx={34} fill={mine ? '#4aa8ff' : '#e8e6f2'} />
        <text x={mine ? 210 - w / 2 : -210 + w / 2} y={y + 48} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={28} fill={mine ? '#fff' : '#1d1a2e'}>{text}</text>
      </g>
    );
  };
  return (
    <InsertBG glow="#ffc94d">
      <PhoneFrame rot={mode === 'invite' ? 3 : -3} clip="chp">
        <rect x={-240} y={-470} width={480} height={90} fill="#1b2350" />
        <circle cx={-190} cy={-425} r={26} fill="#e6b34a" /><text x={-150} y={-415} fontFamily={MONT} fontWeight={800} fontSize={28} fill="#fff">OLD FRIEND</text>
        {mode === 'invite' ? (<>
          {bub(-340, 400, 'DINNER SATURDAY?', false, 0.2)}
          {bub(-240, 330, 'Both of you!', false, 0.9)}
          {bub(-130, 160, 'YES!', true, 1.5)}
        </>) : (<>
          {bub(-340, 400, 'DINNER SATURDAY?', false, 0)}
          {bub(-240, 160, 'YES!', true, 0)}
          {bub(-130, 440, 'See you at 8!', false, 0.2)}
          {bub(-20, 460, "SORRY, CAN'T MAKE IT", true, 1.0)}
        </>)}
      </PhoneFrame>
    </InsertBG>
  );
};

// the feed: the dinner photo appears, he double-taps, a heart pops, and he keeps scrolling
export const FeedPhoto: React.FC<{t: number}> = ({t}) => {
  const pop = t > 1.0 && t < 1.8 ? (t - 1.0) / 0.8 : 0, away = ramp(t, 1.9, 2.6);
  return (
    <InsertBG glow="#ff6b8a">
      <PhoneFrame rot={-4} clip="fph">
        <g transform={`translate(0 ${-away * 700})`}>
          <rect x={-210} y={-400} width={420} height={470} rx={22} fill="#2b1a22" />
          <rect x={-210} y={-400} width={420} height={470} rx={22} fill="#ffb86b" opacity={0.2} />
          <rect x={-170} y={-100} width={340} height={22} rx={8} fill="#efe6d4" /><circle cx={-70} cy={-170} r={42} fill="#c8bde0" stroke={INK} strokeWidth={5} /><circle cx={70} cy={-170} r={42} fill="#f0c9a0" stroke={INK} strokeWidth={5} />
          <path d="M -120,-100 Q -126,-150 -70,-150 Q -14,-150 -20,-100 Z" fill="#9a7be4" /><path d="M 20,-100 Q 14,-150 70,-150 Q 126,-150 120,-100 Z" fill="#e6b34a" />
          <rect x={-12} y={-146} width={24} height={46} rx={6} fill="rgba(255,255,255,.5)" />
          <text x={-190} y={-348} fontFamily={MONT} fontWeight={800} fontSize={28} fill="#fff">dinner with the old crew</text>
          {pop > 0 && <g transform={`translate(0 -200) scale(${0.6 + Math.sin(pop * Math.PI) * 1.4})`} opacity={1 - pop * 0.4}><path d="M 0,40 C -90,-30 -50,-90 0,-40 C 50,-90 90,-30 0,40 Z" fill="#ff4f6d" stroke="#fff" strokeWidth={6} /></g>}
        </g>
        {[0, 1].map((i) => <Thumb key={i} x={0} y={110 + i * 250 - away * 600 + 700 * (1 - away) * 0} i={i + 1} />)}
      </PhoneFrame>
    </InsertBG>
  );
};

// the phone goes face down: it flips over the long edge, the screen glow dies
export const PhoneFaceDown: React.FC<{t: number; at: number}> = ({t, at}) => {
  const k = ramp(t, at, at + 0.55), sc = Math.cos(k * Math.PI), face = k < 0.5;
  return (
    <InsertBG glow={face ? '#4aa8ff' : '#ffb25a'}>
      <rect x={0} y={760} width={1920} height={400} fill="#5a4436" />
      <ellipse cx={960} cy={800} rx={300} ry={40} fill="#000" opacity={0.3} />
      {face && <circle cx={960} cy={560} r={520 * (1 - k)} fill="#4aa8ff" opacity={0.18} style={{mixBlendMode: 'screen'}} />}
      <g transform={`translate(960 620) scale(1 ${Math.abs(sc) < 0.02 ? 0.02 : sc})`}>
        <rect x={-300} y={-170} width={600} height={340} rx={50} fill={face ? '#0b1a33' : '#15161f'} {...O} />
        {face ? <g><text x={0} y={30} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={130} fill="#fff">2:07</text></g> : <g><circle cx={-220} cy={-110} r={22} fill="#2a2d3d" /><rect x={-260} y={-150} width={180} height={150} rx={20} fill="none" stroke="#2a2d3d" strokeWidth={6} /></g>}
      </g>
    </InsertBG>
  );
};

// one habit spreads: reading links to sleep, talk, work, mood
export const NodeNetwork: React.FC<{t: number}> = ({t}) => {
  const N: {x: number; y: number; label: string; c: string}[] = [{x: 560, y: 330, label: 'SLEEP', c: '#7be0ff'}, {x: 1360, y: 330, label: 'TALK', c: '#ff8ad8'}, {x: 560, y: 760, label: 'WORK', c: '#b8f26b'}, {x: 1360, y: 760, label: 'MOOD', c: '#ffd36b'}];
  return (
    <InsertBG glow="#ffc94d">
      <text x={960} y={140} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={80} fill="#fff">ONE HABIT <tspan fill="#ffc94d">SPREADS</tspan></text>
      {N.map((n, i) => {
        const o = ramp(t, 0.5 + i * 0.5, 1.0 + i * 0.5), x = 960 + (n.x - 960) * o, y = 560 + (n.y - 560) * o;
        return (
          <g key={i}>
            <line x1={960} y1={560} x2={x} y2={y} stroke={n.c} strokeWidth={10} strokeLinecap="round" opacity={0.8} style={{filter: `drop-shadow(0 0 12px ${n.c})`}} />
            <g transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * o})`} opacity={o}><circle r={92} fill="#14182f" stroke={n.c} strokeWidth={10} /><text y={14} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={34} fill={n.c}>{n.label}</text></g>
          </g>
        );
      })}
      <g transform="translate(960 560)"><circle r={118} fill="#14182f" stroke="#ffc94d" strokeWidth={12} style={{filter: 'drop-shadow(0 0 26px #ffc94d)'}} /><path d="M -50,-44 c 24,-12 50,-12 50,4 c 0,-16 26,-16 50,-4 v 80 c -24,-12 -50,-12 -50,4 c 0,-16 -26,-16 -50,-4 z" fill="none" stroke="#ffc94d" strokeWidth={8} strokeLinejoin="round" /></g>
    </InsertBG>
  );
};

// the dinners and nights he gave up, as Polaroids hanging on a string; the friend is the last one
export const PhotoStrip: React.FC<{t: number}> = ({t}) => {
  const P = [{c: '#ffb86b', l: 'DINNER'}, {c: '#7be0ff', l: 'BIRTHDAY'}, {c: '#b8f26b', l: 'HIKE'}, {c: '#ff8ad8', l: 'CONCERT'}, {c: '#e6b34a', l: 'OLD FRIEND'}];
  return (
    <InsertBG glow="#ffb25a">
      <path d="M 100 260 Q 960 380 1820 260" fill="none" stroke="#caa13a" strokeWidth={8} />
      {P.map((p, i) => {
        const o = ramp(t, 0.3 + i * 0.55, 0.7 + i * 0.55), x = 280 + i * 340, y = 300 + Math.sin(i * 1.3) * 20 + (i === 0 || i === 4 ? 40 : 0);
        return (
          <g key={i} transform={`translate(${x} ${y - (1 - o) * 120}) rotate(${(i - 2) * 4})`} opacity={o}>
            <rect x={-130} y={-20} width={260} height={330} rx={10} fill="#f8f5ee" {...O} strokeWidth={6} /><rect x={-108} y={4} width={216} height={216} rx={6} fill={p.c} />
            <circle cx={-34} cy={110} r={32} fill="#f1eefb" stroke={INK} strokeWidth={5} /><circle cx={44} cy={118} r={30} fill="#f0c9a0" stroke={INK} strokeWidth={5} />
            <text x={0} y={272} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={30} fill="#1d1a2e">{p.l}</text>
            <path d="M -60,260 L 60,300 M 60,260 L -60,300" stroke="#e0524f" strokeWidth={9} strokeLinecap="round" opacity={ramp(t, 0.9 + i * 0.55, 1.2 + i * 0.55)} />
            <rect x={-8} y={-30} width={16} height={30} rx={4} fill="#caa13a" />
          </g>
        );
      })}
      <text x={960} y={820} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={86} fill="#fff" opacity={ramp(t, 3.0, 3.5)}>WHAT HE <tspan fill="#ffc94d">GAVE UP</tspan></text>
    </InsertBG>
  );
};

// a wall of 20 book covers lighting up one by one
export const IconGrid: React.FC<{t: number; n?: number}> = ({t, n = 20}) => {
  const C = ['#a33a3a', '#3a6aa3', '#c9a13a', '#4a8a5a', '#7a4a9a', '#d06a3a', '#3aa0a0'];
  const lit = Math.min(n, Math.floor(Math.max(0, t - 0.3) / 0.32) + (t > 0.3 ? 1 : 0));
  return (
    <InsertBG glow="#ffc94d">
      {Array.from({length: n}, (_, i) => {
        const x = 330 + (i % 10) * 140, y = 330 + Math.floor(i / 10) * 220, on = i < lit;
        return <g key={i} transform={`translate(${x} ${y})`} opacity={on ? 1 : 0.18} style={on ? {filter: 'drop-shadow(0 0 14px rgba(255,201,77,.6))'} : undefined}><rect x={-48} y={-80} width={96} height={160} rx={8} fill={C[i % 7]} {...O} strokeWidth={6} /><rect x={-48} y={-80} width={16} height={160} rx={6} fill="#000" opacity={0.25} /><rect x={-20} y={-44} width={54} height={12} rx={6} fill="#fff" opacity={0.6} /></g>;
      })}
      <text x={960} y={190} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={120} fill="#ffc94d" style={{filter: 'drop-shadow(0 0 24px rgba(255,201,77,.5))'}}>{lit}{lit >= n ? '+' : ''} <tspan fill="#fff" fontSize={72}>BOOKS</tspan></text>
    </InsertBG>
  );
};

export const EndCard: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #3a2a4a 0%, #e7a46a 60%, #ffd9a0 100%)', overflow: 'hidden'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <circle cx={1500} cy={620} r={170} fill="#fff3c4" opacity={0.6} style={{filter: 'blur(8px)'}} />
      <rect x={0} y={800} width={1920} height={280} fill="#2a1d27" />
      <g transform="translate(1500 760)" style={{filter: 'drop-shadow(0 0 26px #ffcf5a)'}}><path d="M 0,-110 L 30,-36 L 108,-30 L 48,22 L 68,100 L 0,58 L -68,100 L -48,22 L -108,-30 L -30,-36 Z" fill="#ffcf5a" stroke="#1d1a2e" strokeWidth={8} strokeLinejoin="round" /></g>
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontSize: 100, lineHeight: 1.15, color: '#fff', opacity: ramp(t, 0.3, 0.9), transform: `translateY(${(1 - ramp(t, 0.3, 0.9)) * 30}px)`, textShadow: '0 6px 24px rgba(0,0,0,.4)', padding: '0 120px'}}>What's the last book<br />you <span style={{color: '#ffe08a'}}>finished?</span></div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontSize: 52, color: '#fff', opacity: ramp(t, 1.4, 2.0) * 0.9, letterSpacing: 4, textShadow: '0 4px 16px rgba(0,0,0,.4)'}}>Tell us in the comments.</div>
  </div>
);

// =============================================================================================================================
// THE BILL and THE REWARD. The phone pays you first and sends the bill later: the bill is the aftereffects the story names, line by line
// (tired, snapping at Mom, the cancelled dinner, nothing changed, 1,095 hours). The book's reward is what that same time earned on the other side.
// =============================================================================================================================
export const BILL_ITEMS: [string, string, string][] = [
  ['NIGHT 1', '2 h scrolled, 1 h 20 of sleep gone', '−1 h 20'],
  ['DAY 21', 'tired, even after sleeping', 'ENERGY −1'],
  ['DAY 21', 'snapped at Mom over nothing', 'PATIENCE −1'],
  ['DAY 21', 'feels low, reaches for the phone', 'MOOD −1'],
  ['DAY 90', 'every day a copy of the last', 'SAME ×90'],
  ['MONTH 6', 'cancelled dinner with an old friend', 'FRIEND −1'],
  ['MONTH 10', 'learned everything, changed nothing', 'PROGRESS 0'],
  ['MONTH 11', 'the new role went to someone else', 'CAREER −1'],
];
export const REWARD_ITEMS: [string, string, string][] = [
  ['NIGHT 1', '10 pages read', '+10 PAGES'],
  ['DAY 21', '20 pages without noticing', 'FOCUS +1'],
  ['DAY 21', 'falls asleep easier', 'SLEEP +1'],
  ['DAY 40', 'thinks before he reacts', 'CALM +1'],
  ['DAY 40', 'chooses his words at work', 'WORK +1'],
  ['DAY 60', 'wakes up to read on', 'ENERGY +1'],
  ['DAY 90', 'a stack of finished books', '6 BOOKS'],
  ['MONTH 6', 'listens, laughs, stays two hours', 'FRIEND +1'],
  ['MONTH 11', 'the new role', 'PROMOTION'],
  ['DAY 365', 'a year of pages', '20+ BOOKS'],
];
const fmt = (n: number) => (n >= 1000 ? Math.floor(n / 1000) + ',' + String(n % 1000).padStart(3, '0') : String(n));
const BROW = 96;

// the receipt prints upward out of a slot: rows < from are already printed, rows from..to-1 print one by one, then the total, then it can tear
export const BillInsert: React.FC<{t: number; from?: number; to?: number; printAt?: number; per?: number; total?: boolean; totalAt?: number; tearAt?: number; mystery?: boolean}> = ({t, from = 0, to = 1, printAt = 0.2, per = 0.5, total, totalAt = 1.2, tearAt, mystery}) => {
  const rows = BILL_ITEMS.slice(0, to);
  const prog = (k: number) => (k < from ? 1 : ramp(t, printAt + (k - from) * per, printAt + (k - from) * per + 0.32));
  const totP = total ? ramp(t, totalAt, totalAt + 0.45) : 0;
  const printed = rows.reduce((a, _, k) => a + prog(k), 0);
  const slot = 930, H0 = 200, TOT = 190;
  const paperH = H0 + (printed + 0.0) * BROW + totP * TOT + 26, top = slot - paperH;
  const printing = rows.some((_, k) => k >= from && prog(k) > 0 && prog(k) < 1) || (totP > 0 && totP < 1);
  const k2 = tearAt === undefined ? 0 : ramp(t, tearAt, tearAt + 0.5);
  const split = top + paperH * 0.42;
  const newest = rows.reduce((m, _, k) => (k >= from && prog(k) > 0 && t - (printAt + (k - from) * per) < 0.9 ? k : m), -1);
  const paper = (
    <g>
      <path d={`M -350,0 ${Array.from({length: 18}, (_, i) => `L ${-350 + (i + 0.5) * (700 / 18)},${i % 2 ? 0 : 12} L ${-350 + (i + 1) * (700 / 18)},0`).join(' ')} L 350,${paperH + 40} L -350,${paperH + 40} Z`} fill="#f4f0e6" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <text x={0} y={92} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={82} fill="#c0392b" letterSpacing={6}>THE BILL</text>
      <text x={0} y={132} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={21} fill="#6b6350" letterSpacing={3}>PAID LATER: IN SLEEP, MOOD AND PEOPLE</text>
      <line x1={-300} y1={160} x2={300} y2={160} stroke="#9b927a" strokeWidth={4} strokeDasharray="14 10" />
      {rows.map((r, k) => (
        <g key={k} transform={`translate(0 ${H0 + k * BROW})`}>
          {k === newest && <rect x={-330} y={-24} width={660} height={BROW - 14} rx={8} fill="#c0392b" opacity={0.14} />}
          <text x={-310} y={14} fontFamily={MONT} fontWeight={800} fontSize={22} fill="#8a8068" letterSpacing={2}>{r[0]}</text>
          <text x={-310} y={50} fontFamily={MONT} fontWeight={800} fontSize={27} fill="#2a2a35">{r[1]}</text>
          <text x={310} y={50} textAnchor="end" fontFamily={MONT} fontWeight={800} fontSize={34} fill="#c0392b">{r[2]}</text>
          <line x1={-310} y1={BROW - 22} x2={310} y2={BROW - 22} stroke="#cfc7b0" strokeWidth={3} strokeDasharray="6 8" />
        </g>
      ))}
      {total && (
        <g transform={`translate(0 ${H0 + rows.length * BROW + 10})`} opacity={totP}>
          <text x={-310} y={36} fontFamily={MONT} fontWeight={800} fontSize={34} fill="#2a2a35" letterSpacing={4}>TOTAL</text>
          <text x={310} y={44} textAnchor="end" fontFamily={MONT} fontWeight={800} fontSize={mystery ? 70 : 78} fill="#c0392b" style={mystery ? {filter: 'blur(3px)'} : undefined}>{mystery ? '??? h' : fmt(Math.round(1095 * totP)) + ' h'}</text>
          <text x={310} y={84} textAnchor="end" fontFamily={MONT} fontWeight={800} fontSize={22} fill="#8a8068" letterSpacing={3}>ON A SCREEN</text>
          <rect x={-310} y={104} width={620} height={8} rx={4} fill="#c0392b" />
        </g>
      )}
    </g>
  );
  const jx = printing ? Math.sin(t * 70) * 2.2 : 0;
  return (
    <InsertBG glow="#ff4f6d">
      <clipPath id="slotclip"><rect x={0} y={0} width={1920} height={slot} /></clipPath>
      <g clipPath="url(#slotclip)">
        {k2 <= 0 ? <g transform={`translate(${960 + jx} ${top})`}>{paper}</g> : (
          <g>
            <clipPath id="tclip"><rect x={0} y={0} width={1920} height={split} /></clipPath><clipPath id="bclip"><rect x={0} y={split} width={1920} height={1000} /></clipPath>
            <g clipPath="url(#tclip)"><g transform={`translate(${960 - k2 * 70} ${top - k2 * 40}) rotate(${-k2 * 7} 0 ${paperH * 0.42})`}>{paper}</g></g>
            <g clipPath="url(#bclip)"><g transform={`translate(${960 + k2 * 60} ${top + k2 * 70}) rotate(${k2 * 9} 0 ${paperH * 0.42})`}>{paper}</g></g>
          </g>
        )}
      </g>
      <rect x={520} y={slot} width={880} height={64} rx={24} fill="#15161f" {...O} />
      <circle cx={600} cy={slot + 32} r={9} fill={printing ? '#ff4f6d' : '#3a3d52'} style={printing ? {filter: 'drop-shadow(0 0 10px #ff4f6d)'} : undefined} />
    </InsertBG>
  );
};

// the reward ticket: each thing the book earns him is stamped on, with a gold star and a spark
export const RewardInsert: React.FC<{t: number; from?: number; to?: number; printAt?: number; per?: number}> = ({t, from = 0, to = 1, printAt = 0.2, per = 0.6}) => {
  const rows = REWARD_ITEMS.slice(0, to);
  const prog = (k: number) => (k < from ? 1 : ramp(t, printAt + (k - from) * per, printAt + (k - from) * per + 0.3));
  const shown = rows.filter((_, k) => prog(k) > 0).length, start = Math.max(0, shown - 5);
  const Star: React.FC<{s?: number}> = ({s = 1}) => <path transform={`scale(${s})`} d="M 0,-24 L 7,-8 L 26,-6 L 12,7 L 17,26 L 0,16 L -17,26 L -12,7 L -26,-6 L -7,-8 Z" fill="#ffcf5a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />;
  return (
    <InsertBG glow="#ffc94d">
      <g transform="translate(960 540)">
        <rect x={-380} y={-440} width={760} height={880} rx={30} fill="#ffe08a" {...O} />
        <rect x={-380} y={-440} width={760} height={880} rx={30} fill="url(#rwg)" />
        <defs><linearGradient id="rwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" /><stop offset="1" stopColor="#ffb23f" stopOpacity="0.4" /></linearGradient></defs>
        {[-300, -150, 0, 150, 300].map((y, i) => <circle key={i} cx={i % 2 ? 380 : -380} cy={y} r={22} fill="#15162e" />)}
        <text x={0} y={-340} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={78} fill="#2a1d08" letterSpacing={6}>THE REWARD</text>
        <text x={0} y={-296} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={21} fill="#7a4a00" letterSpacing={3}>EARNED, ONE NIGHT AT A TIME</text>
        <line x1={-320} y1={-268} x2={320} y2={-268} stroke="#7a4a00" strokeWidth={4} strokeDasharray="14 10" />
        {rows.map((r, k) => {
          const p = prog(k), e = p < 1 ? 1 + (1 - p) * 0.5 : 1;
          if (p <= 0 || k < start) return null;
          const y = -226 + (k - start) * 130, fresh = t - (printAt + (k - from) * per) < 0.8 && k >= from;
          return (
            <g key={k} transform={`translate(${(1 - p) * 90} ${y})`} opacity={p}>
              {fresh && <rect x={-340} y={-8} width={680} height={110} rx={14} fill="#fff" opacity={0.4} />}
              <g transform="translate(-290 44)"><Star s={e} /></g>
              <text x={-240} y={18} fontFamily={MONT} fontWeight={800} fontSize={22} fill="#7a4a00" letterSpacing={2}>{r[0]}</text>
              <text x={-240} y={58} fontFamily={MONT} fontWeight={800} fontSize={28} fill="#2a1d08">{r[1]}</text>
              <text x={340} y={98} textAnchor="end" fontFamily={MONT} fontWeight={800} fontSize={40} fill="#8a4b00">{r[2]}</text>
              {fresh && Array.from({length: 7}, (_, i) => <circle key={i} cx={-290 + Math.cos(i * 0.9) * (30 + (t - (printAt + (k - from) * per)) * 120)} cy={44 + Math.sin(i * 0.9) * (30 + (t - (printAt + (k - from) * per)) * 120)} r={5} fill="#fff" opacity={0.9} />)}
            </g>
          );
        })}
      </g>
    </InsertBG>
  );
};

// the phone pays first: a coin pops out of it, instantly
export const CoinReward: React.FC<{t: number}> = ({t}) => {
  const p = ramp(t, 0.05, 0.45), settle = t > 0.45 ? 1 + Math.max(0, 0.35 - (t - 0.45)) * 0.9 : 1;
  return (
    <InsertBG glow="#ffd23f">
      <rect x={810} y={760} width={300} height={500} rx={46} fill="#15161f" {...O} /><rect x={830} y={780} width={260} height={460} rx={30} fill="#0b1a33" />
      <circle cx={960} cy={900} r={120 * p} fill="#4aa8ff" opacity={0.2} style={{mixBlendMode: 'screen'}} />
      <g transform={`translate(960 ${700 - p * 230}) scale(${settle * (0.3 + 0.7 * p)})`}>
        <circle r={110} fill="#ffcf5a" {...O} /><circle r={84} fill="none" stroke="#e0a82a" strokeWidth={8} />
        <text y={34} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={92} fill="#8a4b00">+1</text>
      </g>
      {Array.from({length: 10}, (_, i) => { const q = ramp(t, 0.35, 0.9); return <circle key={i} cx={960 + Math.cos(i * 0.63) * (150 + q * 200)} cy={470 + Math.sin(i * 0.63) * (150 + q * 160)} r={9 * (1 - q * 0.6)} fill={['#ffd23f', '#ff4f6d', '#3fd0ff', '#42e08c'][i % 4]} opacity={q > 0 ? 1 - q * 0.5 : 0} />; })}
      <text x={960} y={250} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={74} fill="#fff" opacity={ramp(t, 0.5, 0.9)}>INSTANT <tspan fill="#ffc94d">REWARD</tspan></text>
    </InsertBG>
  );
};

// "One year from now": a wall calendar tearing off twelve months, JANUARY to DECEMBER, speeding up, with the season's colour and weather drifting by
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const SEASON_C = ['#7fa8ff', '#7fa8ff', '#ff9fc8', '#ff9fc8', '#9be07a', '#ffd23f', '#ffb23f', '#ffb23f', '#e0762a', '#e0762a', '#9fb4d9', '#7fa8ff'];
export const YearFlip: React.FC<{t: number; dur?: number}> = ({t, dur = 1.6}) => {
  const u = Math.min(0.999, Math.max(0, t / dur)), e = u * 0.45 + u * u * (3 - 2 * u) * 0.55;
  const m = Math.min(11, Math.floor(e * 12)), fr = e * 12 - m, k = fr < 0.4 ? fr / 0.4 : 1;
  const page = (mi: number) => (
    <g>
      <rect x={-330} y={-380} width={660} height={780} rx={26} fill="#f8f5ee" {...O} />
      <rect x={-330} y={-380} width={660} height={150} rx={26} fill="#e0524f" {...O} />
      <text x={0} y={-272} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={mi === 8 ? 60 : 70} fill="#fff" letterSpacing={6}>{MONTHS[mi]}</text>
      {[-220, 0, 220].map((x, i) => <circle key={i} cx={x} cy={-380} r={14} fill="#1d1a2e" />)}
      {Array.from({length: 35}, (_, i) => <text key={i} x={-270 + (i % 7) * 90} y={-150 + Math.floor(i / 7) * 120} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={38} fill={i % 7 === 0 || i % 7 === 6 ? '#e0524f' : '#2a2a35'} opacity={i < 30 ? 1 : 0}>{i + 1}</text>)}
    </g>
  );
  return (
    <InsertBG glow={SEASON_C[m]}>
      {Array.from({length: 18}, (_, i) => <circle key={i} cx={(i * 211 + t * 160) % 1920} cy={((i * 137 + t * 420) % 1200) - 60} r={6 + (i % 4) * 3} fill={SEASON_C[m]} opacity={0.5} />)}
      <g transform="translate(960 560)">
        {page(m)}
        {m > 0 && fr < 0.4 && <g transform={`translate(${-k * 90} ${-k * 420}) rotate(${-k * 22})`} opacity={1 - k}>{page(m - 1)}</g>}
      </g>
    </InsertBG>
  );
};
