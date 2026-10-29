import React from 'react';
import {Char, INK, V} from './Char';
import {Planter, Vines} from './sets';
import {MONT} from './theme';

// Full-frame inserts and infographics, 1920 x 1080. They are held still and flat on purpose: the moving character shots around them feel alive.
const ease = (x: number) => x * x * (3 - 2 * x);
const sm = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
const O = {stroke: INK, strokeWidth: 8, strokeLinejoin: 'round' as const};

export const InsertBG: React.FC<{glow?: string; children: React.ReactNode; z?: number}> = ({glow = '#4aa8ff', children}) => (
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, #1b2150 0%, #0a0d20 75%)', overflow: 'hidden'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 16}, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={(i * 191) % 1080} r={30 + (i % 4) * 22} fill={glow} opacity={0.06 + (i % 3) * 0.03} style={{filter: 'blur(14px)'}} />)}
      {children}
    </svg>
  </div>
);

const feedColors = [['#ff5f7e', '#ffb36b'], ['#5f8bff', '#7be0ff'], ['#9b6bff', '#ff8ad8'], ['#2fd08a', '#b8f26b'], ['#ffb347', '#ff6b5e']];
const Laugh: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#ffd23f" stroke={INK} strokeWidth={5} />
    <path d={`M ${x - r * 0.5},${y - r * 0.2} q ${r * 0.15},${-r * 0.2} ${r * 0.3},0 M ${x + r * 0.2},${y - r * 0.2} q ${r * 0.15},${-r * 0.2} ${r * 0.3},0`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <path d={`M ${x - r * 0.55},${y + r * 0.1} Q ${x},${y + r * 0.9} ${x + r * 0.55},${y + r * 0.1} Z`} fill="#7a1f2c" stroke={INK} strokeWidth={4} />
  </g>
);

export const PhoneFeed: React.FC<{t: number; speed?: number; tilt?: number; thumb?: boolean}> = ({t, speed = 1, tilt = -5, thumb = true}) => {
  const per = 0.95 / speed, k = Math.floor(t / per), fr = (t / per) % 1;
  const off = (k + ease(Math.min(1, fr * 2.2))) * 330;
  const popT = (t / per) % 1;
  return (
    <InsertBG>
      <g transform={`translate(960 540) rotate(${tilt})`}>
        <rect x={-270} y={-500} width={540} height={1000} rx={64} fill="#15161f" {...O} />
        <clipPath id="scr"><rect x={-240} y={-470} width={480} height={940} rx={40} /></clipPath>
        <g clipPath="url(#scr)">
          <rect x={-240} y={-470} width={480} height={940} fill="#0b1a33" />
          {Array.from({length: 6}, (_, i) => {
            const idx = i, y = ((((idx * 330 - off) % 1980) + 1980) % 1980) - 520;
            const c = feedColors[(idx + Math.floor((off + idx * 330) / 1980) * 6) % 5 < 0 ? 0 : (idx + k) % 5];
            return (
              <g key={i} transform={`translate(0 ${y})`}>
                <rect x={-220} y={0} width={440} height={300} rx={26} fill={`url(#fg${idx % 5})`} />
                <defs><linearGradient id={`fg${idx % 5}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={feedColors[idx % 5][0]} /><stop offset="1" stopColor={feedColors[idx % 5][1]} /></linearGradient></defs>
                <Laugh x={-40} y={150} r={62 + (idx % 3) * 8} />
                <circle cx={170} cy={235} r={26} fill="#fff" opacity={0.9} />
                <path d="M 160,232 q 10,-18 20,0 q 10,-18 20,0 q -10,22 -20,34 q -10,-12 -20,-34 z" transform="translate(-10 -4) scale(.9)" fill="#ff4f6d" />
                <rect x={-200} y={248} width={190} height={14} rx={7} fill="#fff" opacity={0.7} />
                <rect x={-200} y={272} width={120} height={12} rx={6} fill="#fff" opacity={0.45} />
                {void c}
              </g>
            );
          })}
        </g>
        <rect x={-60} y={-486} width={120} height={20} rx={10} fill="#0a0a10" />
        {popT < 0.6 && <g opacity={1 - popT / 0.6}>{Array.from({length: 7}, (_, i) => <circle key={i} cx={Math.cos(i * 0.9) * (120 + popT * 220)} cy={-80 + Math.sin(i * 0.9) * (120 + popT * 220)} r={12 * (1 - popT)} fill={['#ffd23f', '#ff4f6d', '#3fd0ff', '#42e08c'][i % 4]} />)}</g>}
      </g>
      {thumb && <g transform={`translate(${1130 + Math.sin(fr * 3) * 6} ${900 - ease(Math.min(1, fr * 2.2)) * 200}) rotate(-12)`}>
        <ellipse cx={0} cy={0} rx={70} ry={56} fill="#fff" {...O} /><ellipse cx={-52} cy={-30} rx={26} ry={38} fill="#fff" {...O} transform="rotate(-30 -52 -30)" />
      </g>}
    </InsertBG>
  );
};

export const LockScreen: React.FC<{t: number; from: string; to: string; spinAt?: number; spinLen?: number; battery?: number; clockLabel?: string}> = ({t, from, to, spinAt = 0.2, spinLen = 1.0, battery = 8}) => {
  const p = sm(t, spinAt, spinAt + spinLen);
  const parse = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  let m = Math.round(parse(from) + (parse(to) - parse(from) + (parse(to) < parse(from) ? 1440 : 0)) * p) % 1440;
  const hh = Math.floor(m / 60), mm = m % 60;
  const txt = `${hh % 12 || 12}:${String(mm).padStart(2, '0')}`;
  return (
    <InsertBG glow="#ff6b5e">
      <g transform="translate(960 540) rotate(4)">
        <rect x={-270} y={-500} width={540} height={1000} rx={64} fill="#15161f" {...O} />
        <rect x={-240} y={-470} width={480} height={940} rx={40} fill="#101a38" />
        <rect x={-240} y={-470} width={480} height={940} rx={40} fill="url(#lsg)" opacity={0.5} />
        <defs><linearGradient id="lsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5b6bff" /><stop offset="1" stopColor="#101a38" /></linearGradient></defs>
        <text x={0} y={-230} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={150} fill="#fff">{txt}</text>
        <text x={0} y={-170} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={30} fill="#cdd5ff" opacity={0.8}>{mm === 0 && hh === 2 ? 'Tuesday' : 'Monday'}</text>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(0 ${-60 + i * 110})`} opacity={0.9}><rect x={-210} y={0} width={420} height={90} rx={22} fill="#ffffff22" /><circle cx={-165} cy={45} r={24} fill={['#ff4f6d', '#3fd0ff', '#ffd23f'][i]} /><rect x={-120} y={26} width={240} height={14} rx={7} fill="#fff" opacity={0.8} /><rect x={-120} y={52} width={160} height={12} rx={6} fill="#fff" opacity={0.5} /></g>)}
        <g transform="translate(150 -440)"><rect x={0} y={0} width={64} height={30} rx={8} fill="none" stroke="#fff" strokeWidth={4} /><rect x={4} y={4} width={Math.max(4, 56 * battery / 100)} height={22} rx={4} fill="#ff4f6d" /><text x={-12} y={24} textAnchor="end" fontFamily={MONT} fontWeight={800} fontSize={26} fill="#ff4f6d">{battery}%</text></g>
      </g>
    </InsertBG>
  );
};

export const ClockInsert: React.FC<{text: string}> = ({text}) => (
  <InsertBG glow="#ff3b30">
    <g transform="translate(960 560)">
      <rect x={-520} y={-250} width={1040} height={500} rx={70} fill="#16161d" {...O} />
      <rect x={-470} y={-200} width={940} height={400} rx={40} fill="#07110b" />
      <text x={0} y={80} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={300} fill="#ff3b30" style={{filter: 'drop-shadow(0 0 30px #ff3b30)'}}>{text}</text>
      <circle cx={-420} cy={-220} r={10} fill="#ff3b30" />
    </g>
  </InsertBG>
);

// one line of text, highlighted; a dot of attention crawls along it, snaps back, and tries again. Three times.
export const PageInsert: React.FC<{t: number; loops?: number; per?: number; mark?: boolean}> = ({t, loops = 3, per = 0.85, mark = false}) => {
  const n = Math.min(loops, Math.floor(t / per)), fr = Math.min(1, (t - Math.min(loops - 1, n) * per) / (per * 0.75));
  const x = -520 + 1040 * ease(Math.min(1, Math.max(0, fr)));
  return (
    <InsertBG glow="#ffb25a">
      <g transform="translate(960 560) rotate(-2)">
        <rect x={-700} y={-420} width={1400} height={840} rx={26} fill="#f4ecd6" {...O} />
        <line x1={0} y1={-410} x2={0} y2={410} stroke="#d9cfae" strokeWidth={6} />
        {Array.from({length: 11}, (_, i) => <rect key={i} x={-620} y={-340 + i * 62} width={[480, 560, 520, 430, 560, 500, 540, 380, 560, 470, 520][i]} height={18} rx={9} fill="#9b927a" opacity={0.55} />)}
        <rect x={-640} y={-34} width={620} height={52} rx={12} fill="#ffd23f" opacity={0.55} />
        <rect x={-620} y={-17} width={570} height={18} rx={9} fill="#6b6350" />
        {Array.from({length: 11}, (_, i) => <rect key={'r' + i} x={80} y={-340 + i * 62} width={[500, 540, 470, 560, 520, 450, 560, 400, 540, 500, 460][i]} height={18} rx={9} fill="#9b927a" opacity={0.55} />)}
        <circle cx={-620 + (x + 520) * 0.55} cy={-8} r={20} fill="#ff4f6d" style={{filter: 'drop-shadow(0 0 12px #ff4f6d)'}} />
        <text x={-640} y={-72} fontFamily={MONT} fontWeight={800} fontSize={44} fill="#ff4f6d">{`×${Math.min(loops, n + 1)}`}</text>
        {mark && <g><rect x={640} y={-440} width={44} height={260} rx={6} fill="#d94a4a" {...O} /><text x={662} y={-300} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={34} fill="#fff" transform="rotate(90 662 -300)">10</text></g>}
      </g>
    </InsertBG>
  );
};

// phone and book side by side; a glove hovers between them
export const PhoneBook: React.FC<{t: number; hover: number}> = ({t, hover}) => {
  const bob = Math.sin(t * 3) * 10, hx = 960 + Math.sin(t * 1.3) * 90 * hover, hy = 250 + (1 - hover) * -260 + bob;
  return (
    <InsertBG glow="#9b7be4">
      <rect x={0} y={760} width={1920} height={400} fill="#46669a" opacity={0.9} />
      <g transform="translate(560 640) rotate(-8)"><rect x={-110} y={-210} width={220} height={420} rx={34} fill="#15161f" {...O} /><rect x={-92} y={-192} width={184} height={384} rx={22} fill="#0b1a33" /><circle cx={0} cy={-20} r={90} fill="#4aa8ff" opacity={0.18} /><rect x={-50} y={-120} width={100} height={14} rx={7} fill="#fff" opacity={0.5} /></g>
      <g transform="translate(1360 650) rotate(6)"><rect x={-190} y={-150} width={380} height={300} rx={10} fill="#2f6f5e" {...O} /><rect x={-170} y={-130} width={170} height={260} fill="#f1e8d0" /><rect x={10} y={-130} width={160} height={260} fill="#f7f0dc" /></g>
      <g transform={`translate(${hx} ${hy})`}><ellipse cx={0} cy={0} rx={96} ry={80} fill="#fff" {...O} /><ellipse cx={-60} cy={-34} rx={30} ry={44} fill="#fff" {...O} transform="rotate(-30 -60 -34)" /><rect x={-26} y={70} width={52} height={400} fill="#1b1922" stroke={INK} strokeWidth={8} /></g>
    </InsertBG>
  );
};

export const BookShut: React.FC<{t: number; at: number}> = ({t, at}) => {
  const p = sm(t, at, at + 0.35);
  return (
    <InsertBG glow="#ffb25a">
      <g transform="translate(960 600)">
        <g transform={`scale(${1 - p * 0.45} 1) translate(${-p * 20} 0)`}><rect x={-420} y={-290} width={420} height={580} rx={14} fill="#f4ecd6" {...O} /><rect x={-390} y={-250} width={340} height={14} rx={7} fill="#9b927a" opacity={0.5} /><rect x={-390} y={-210} width={300} height={14} rx={7} fill="#9b927a" opacity={0.5} /></g>
        <g transform={`scale(${1 - p * 0.45} 1) translate(${p * 20} 0)`}><rect x={0} y={-290} width={420} height={580} rx={14} fill="#f7f0dc" {...O} /><rect x={50} y={-250} width={340} height={14} rx={7} fill="#9b927a" opacity={0.5} /></g>
        {p > 0.5 && <rect x={-120} y={-300} width={240} height={600} rx={16} fill="#2f6f5e" {...O} opacity={ease((p - 0.5) * 2)} />}
        <text x={0} y={-340} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={70} fill="#fff" opacity={0.9}>{p > 0.5 ? 'PAGE 10' : ''}</text>
      </g>
    </InsertBG>
  );
};

export const PlanterInsert: React.FC<{t: number; bloom: number; thorn: number; drop: {at: number; side: 'L' | 'R'}[]; vines?: number}> = ({t, bloom, thorn, drop, vines}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0c1235 0%, #1d2858 100%)', overflow: 'hidden'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <circle cx={1500} cy={260} r={80} fill="#eef2ff" style={{filter: 'drop-shadow(0 0 50px #cdd7ff) blur(2px)'}} />
      <rect x={0} y={780} width={1920} height={300} fill="#3b2a22" />
      <g transform="translate(960 700) scale(2.3) translate(-1590 -626)"><Planter x={1590} y={626} bloom={bloom} thorn={thorn} t={t} drop={drop} /><Vines vine={vines ?? Math.max(0, (thorn - 0.12) / 0.88)} /></g>
    </svg>
  </div>
);

export const CalendarBlur: React.FC<{t: number; d: number}> = ({t, d}) => {
  const day = 5 + Math.floor((t / d) * 16);
  return (
    <InsertBG glow="#ffd23f">
      {Array.from({length: 4}, (_, i) => (
        <g key={i} transform={`translate(${960 + (i - 1.5) * 150 + (t * 120) % 80} ${520 - i * 8}) rotate(${(i - 1.5) * 3})`} opacity={0.35 + i * 0.2} style={{filter: `blur(${(3 - i) * 5}px)`}}>
          <rect x={-190} y={-250} width={380} height={500} rx={26} fill="#f4f1fa" {...O} /><rect x={-190} y={-250} width={380} height={110} rx={26} fill="#e0524f" {...O} />
          <text x={0} y={90} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={220} fill="#2a2a35">{day + i}</text>
        </g>
      ))}
    </InsertBG>
  );
};

export const Crowd: React.FC<{t: number}> = ({t}) => (
  <InsertBG glow="#4aa8ff">
    {Array.from({length: 10}, (_, i) => {
      const x = 330 + i * 140, turn = sm(t, 0.3 + i * 0.18, 0.6 + i * 0.18), phone = i < 8;
      return (
        <g key={i} transform={`translate(${x} 600)`}>
          <circle cx={0} cy={-90} r={46} fill="#f1eefb" {...O} strokeWidth={6} />
          <path d="M -50,40 Q -56,-30 0,-34 Q 56,-30 50,40 Z" fill={phone && turn > 0.5 ? '#4aa8ff' : '#9a7be4'} {...O} strokeWidth={6} />
          {phone && turn > 0.5 && <g><rect x={-18} y={-22} width={36} height={58} rx={8} fill="#15161f" {...O} strokeWidth={5} /><circle cx={0} cy={-120} r={110} fill="#4aa8ff" opacity={0.06 * turn} /></g>}
          {!phone && turn > 0.5 && <g><rect x={-26} y={-18} width={52} height={40} rx={4} fill="#2f6f5e" {...O} strokeWidth={5} /></g>}
        </g>
      );
    })}
    <text x={960} y={330} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={150} fill="#fff" opacity={sm(t, 1.2, 1.6)} style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,.4))'}}>8 <tspan fill="#ffc94d">OF 10</tspan></text>
  </InsertBG>
);

export const Dopamine: React.FC<{t: number; steps: number[]}> = ({t, steps}) => {
  const lvl = steps.reduce((m, s, i) => m + sm(t, s, s + 0.25) * 0.18, 0.1);
  return (
    <g transform="translate(1540 360)">
      <rect x={-34} y={0} width={68} height={420} rx={34} fill="#14182f" {...O} />
      <rect x={-24} y={410 - 400 * Math.min(1, lvl)} width={48} height={400 * Math.min(1, lvl)} rx={24} fill="#ff4f6d" style={{filter: 'drop-shadow(0 0 14px #ff4f6d)'}} />
      <text x={0} y={-20} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={34} fill="#ffc94d">DOPAMINE</text>
      {steps.map((s, i) => t > s && t < s + 0.8 ? <text key={i} x={70} y={380 - 400 * (0.1 + 0.18 * (i + 1)) + 40 - (t - s) * 60} fontFamily={MONT} fontWeight={800} fontSize={44} fill="#fff" opacity={1 - (t - s) / 0.8}>+1</text> : null)}
    </g>
  );
};

export const Scoreboard: React.FC<{t: number; popAt: number}> = ({t, popAt}) => {
  const pop = t >= popAt ? 1 + Math.max(0, 0.5 - (t - popAt)) * 0.9 : 1;
  return (
    <g transform="translate(960 930)">
      <rect x={-330} y={-70} width={660} height={140} rx={30} fill="#0d1130" stroke="#ffffff55" strokeWidth={4} />
      <text x={-210} y={22} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={52} fill="#7be0a0">BOOK</text>
      <text x={-70} y={28} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={78} fill="#fff">0</text>
      <text x={0} y={24} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={60} fill="#ffffff88">:</text>
      <g transform={`translate(70 0) scale(${pop})`}><text x={0} y={28} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={78} fill="#fff">{t >= popAt ? 1 : 0}</text></g>
      <text x={210} y={22} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={52} fill="#ff6b7a">PHONE</text>
    </g>
  );
};

export const CheckCalendar: React.FC<{t: number}> = ({t}) => (
  <g transform="translate(1380 250)">
    <rect x={0} y={0} width={420} height={360} rx={24} fill="#f4f1fa" {...O} /><rect x={0} y={0} width={420} height={70} rx={24} fill="#e0524f" {...O} />
    {Array.from({length: 14}, (_, i) => {
      const x = 30 + (i % 5) * 76, y = 100 + Math.floor(i / 5) * 78, on = t > 0.3 + i * 0.16;
      return <g key={i}><rect x={x} y={y} width={58} height={58} rx={10} fill="#e8e3f3" />{on && <path d={`M ${x + 10},${y + 30} l 14,14 l 26,-30`} fill="none" stroke="#2fa866" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}</g>;
    })}
  </g>
);

// the tea pour: kettle tilts, a stream fills the mug, steam rises
export const TeaPour: React.FC<{t: number}> = ({t}) => {
  const p = sm(t, 0.2, 1.0);
  return (
    <InsertBG glow="#ffb25a">
      <g transform="translate(960 800)">
        <path d="M -150,-260 L 150,-260 L 120,0 L -120,0 Z" fill="#e8e2d4" {...O} />
        <rect x={-150} y={-260} width={300} height={30} fill="#7a4a2a" opacity={0.9} clipPath="none" />
        <path d={`M -140,${-250 + (1 - p) * 230} L 140,${-250 + (1 - p) * 230} L 118,-6 L -118,-6 Z`} fill="#b86a2c" />
        <path d="M 150,-200 q 90,0 90,90 q 0,90 -90,90" fill="none" stroke={INK} strokeWidth={22} />
        <g transform={`translate(-300 ${-560 - (1 - p) * 40}) rotate(${-38 * Math.min(1, p * 2)})`}><rect x={-120} y={0} width={240} height={190} rx={40} fill="#c7cdd6" {...O} /><path d="M 120,40 L 200,0 L 200,30 L 120,90 Z" fill="#c7cdd6" {...O} /></g>
        {t > 0.3 && t < 1.2 && <path d={`M -90,${-370} Q -60,${-250} -30,${-250 + (1 - p) * 230}`} fill="none" stroke="#b86a2c" strokeWidth={10} strokeLinecap="round" />}
        {t > 0.9 && [0, 1, 2].map((i) => { const q = ((t * 0.7 + i / 3) % 1); return <path key={i} d={`M ${-60 + i * 60},${-270 - q * 120} q 20,-40 0,-80`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.45 * (1 - q)} />; })}
      </g>
    </InsertBG>
  );
};
export type {V};
export {Char};

// ---------------------------------------------------------------------------------------------
// The book opening, drawn image by image (like a frame-by-frame sheet): 8 drawings for the cover swinging open around the spine, then
// 6 drawings for every page turn. Stepped on purpose, no smooth tween, so it reads as hand-drawn animation.
// ---------------------------------------------------------------------------------------------
const stepq = (x: number, n: number) => Math.floor(Math.min(0.9999, Math.max(0, x)) * n) / n;
const PageLines: React.FC<{x: number; w: number; seed: number}> = ({x, w, seed}) => (
  <g opacity={0.5}>
    {Array.from({length: 15}, (_, i) => {
      const len = (0.5 + ((Math.sin(i * 12.9 + seed * 7.1) * 43758.5453) % 1 + 1) % 1 * 0.45) * w * 0.82;
      return <rect key={i} x={x + w * 0.09} y={-196 + i * 26 + (i % 5 === 4 ? 10 : 0)} width={len} height={9} rx={4.5} fill="#9b927a" />;
    })}
  </g>
);
export const BookOpenInsert: React.FC<{t: number; openAt?: number; flips?: number[]; cover?: string; glow?: string}> = ({t, openAt = 0.1, flips = [], cover = '#2f6f5e', glow = '#ffb25a'}) => {
  const cw = 380, ch = 520;
  const open = stepq((t - openAt) / 0.7, 8);                 // eight drawings for the cover
  const th = open * Math.PI, c = Math.cos(th), s = Math.sin(th);
  const done = flips.filter((f) => t >= f + 0.5).length;
  const active = flips.find((f) => t >= f && t < f + 0.5);
  const q = active === undefined ? 0 : stepq((t - active) / 0.5, 6);   // six drawings per page turn
  const phi = q * Math.PI, pw = cw * Math.cos(phi), bow = 70 * Math.sin(phi);
  const shiftX = 960 - (cw / 2) * (1 - Math.min(1, open * 1.15));     // the whole book slides to centre as it opens
  return (
    <InsertBG glow={glow}>
      <g transform={`translate(${shiftX} 560)`}>
        {/* thickness / back cover */}
        <rect x={-6} y={-ch / 2 - 10} width={cw + 14} height={ch + 20} rx={14} fill={cover} {...O} />
        {open > 0.5 && <rect x={-cw - 8} y={-ch / 2 - 10} width={cw + 8} height={ch + 20} rx={14} fill={cover} {...O} />}
        {/* right page block, always there */}
        <rect x={0} y={-ch / 2} width={cw} height={ch} rx={6} fill="#f1e8d0" stroke={INK} strokeWidth={6} />
        <PageLines x={0} w={cw} seed={done + 1} />
        <rect x={cw - 14} y={-ch / 2 + 4} width={10} height={ch - 8} fill="#d9cfae" />
        {/* left page (the inside of the cover, then the page that was turned) */}
        {th > Math.PI / 2 && (
          <g>
            <rect x={cw * c} y={-ch / 2} width={-cw * c} height={ch} rx={6} fill="#f4ecd6" stroke={INK} strokeWidth={6} />
            {open >= 0.99 && <PageLines x={-cw} w={cw} seed={done} />}
          </g>
        )}
        {open >= 0.99 && done > 0 && <rect x={-cw} y={-ch / 2} width={cw} height={ch} rx={6} fill="#f4ecd6" stroke={INK} strokeWidth={6} />}
        {open >= 0.99 && done > 0 && <PageLines x={-cw} w={cw} seed={done + 3} />}
        {/* the cover swinging open: it narrows toward the spine, then reappears on the left as the inside */}
        {th <= Math.PI / 2 && open > 0 && (
          <g>
            <rect x={0} y={-ch / 2 - 10 * s} width={Math.max(2, cw * c)} height={ch + 20 * s} rx={10} fill={cover} stroke={INK} strokeWidth={7} />
            <rect x={6} y={-ch / 2 + 20} width={Math.max(0, cw * c * 0.8)} height={16} rx={8} fill="#ffffff" opacity={0.18} />
          </g>
        )}
        {open === 0 && (
          <g>
            <rect x={0} y={-ch / 2 - 4} width={cw} height={ch + 8} rx={12} fill={cover} {...O} />
            <rect x={0} y={-ch / 2 - 4} width={26} height={ch + 8} rx={10} fill="#1f4d41" stroke={INK} strokeWidth={6} />
            <rect x={90} y={-150} width={220} height={26} rx={13} fill="#ffffff" opacity={0.7} /><rect x={120} y={-100} width={160} height={18} rx={9} fill="#ffffff" opacity={0.45} />
            <circle cx={200} cy={80} r={46} fill="none" stroke="#ffffff" strokeWidth={8} opacity={0.5} />
          </g>
        )}
        {/* a page turning: it lifts, curls, and lands on the left */}
        {active !== undefined && q > 0 && (
          <path d={`M 0,${-ch / 2} Q ${pw * 0.5},${-ch / 2 - bow} ${pw},${-ch / 2 + 14 * Math.sin(phi)} L ${pw},${ch / 2 - 14 * Math.sin(phi)} Q ${pw * 0.5},${ch / 2 + bow * 0.35} 0,${ch / 2} Z`} fill={phi < Math.PI / 2 ? '#f7f0dc' : '#efe6cc'} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        )}
      </g>
    </InsertBG>
  );
};
