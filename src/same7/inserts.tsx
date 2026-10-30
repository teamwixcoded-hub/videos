import React from 'react';
import {INK} from '../same2d/Char';
import {InsertBG} from '../same2d/inserts';
import {MONT, DIGI} from '../same2d/theme';

// New full-frame inserts for SAME MAN v2 (first minute). Same flat, bold language as src/same2d/inserts.tsx. All times are LOCAL seconds into the shot.
const ease = (x: number) => x * x * (3 - 2 * x);
const sm = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
const eoBack = (x: number) => { const k = Math.min(1, Math.max(0, x)), c1 = 1.8, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const O = {stroke: INK, strokeWidth: 8, strokeLinejoin: 'round' as const};

// the search box: a phone close up, a search field typing, a cursor, suggestions appearing under it
export const TypeSearch: React.FC<{t: number; text: string; from: number; to: number}> = ({t, text, from, to}) => {
  const n = Math.round(Math.min(1, Math.max(0, (t - from) / (to - from))) * text.length), shown = text.slice(0, n), blink = Math.floor(t * 2.6) % 2 === 0 || n < text.length;
  const sug = ['how to fix your life', 'how to fix your life at 30', 'how to fix your sleep schedule', 'how to fix your life in 30 days'];
  return (
    <InsertBG glow="#4aa8ff">
      <g transform="translate(960 560) rotate(-3)">
        <rect x={-330} y={-470} width={660} height={940} rx={80} fill="#0d0f1c" {...O} />
        <rect x={-300} y={-440} width={600} height={880} rx={56} fill="#111528" />
        <rect x={-300} y={-440} width={600} height={880} rx={56} fill="#4aa8ff" opacity={0.07 + 0.03 * Math.sin(t * 5)} />
        <text x={-250} y={-370} fontFamily={MONT} fontWeight={800} fontSize={40} fill="#7f8bb5">2:03</text>
        <rect x={-260} y={-300} width={520} height={92} rx={46} fill="#1f2547" stroke="#4aa8ff" strokeWidth={4} />
        <circle cx={-214} cy={-254} r={16} fill="none" stroke="#9db6ff" strokeWidth={6} /><path d="M -202,-242 L -186,-226" stroke="#9db6ff" strokeWidth={6} strokeLinecap="round" />
        <text x={-176} y={-238} fontFamily={DIGI} fontWeight={700} fontSize={36} fill="#fff">{shown}{blink ? '|' : ' '}</text>
        {sug.map((s, i) => { const k = sm(t, to + 0.1 + i * 0.12, to + 0.45 + i * 0.12); return (
          <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 18})`}>
            <rect x={-260} y={-170 + i * 96} width={520} height={74} rx={18} fill="#171c38" />
            <text x={-230} y={-122 + i * 96} fontFamily={DIGI} fontWeight={600} fontSize={30} fill="#cfd8ff">{s}</text>
          </g>); })}
      </g>
    </InsertBG>
  );
};

// SAME JOB / SAME SALARY / SAME 24 HOURS: three cards slam in on the words
export const TripleIcons: React.FC<{t: number; at: [number, number, number]}> = ({t, at}) => {
  const cards = [
    {label: 'SAME JOB', c: '#4aa8ff', icon: <g><rect x={-70} y={-40} width={140} height={100} rx={14} fill="#c9954a" {...O} /><path d="M -30,-40 v-22 h60 v22" fill="none" {...O} /><rect x={-14} y={0} width={28} height={22} rx={4} fill="#f5c542" stroke={INK} strokeWidth={5} /></g>},
    {label: 'SAME SALARY', c: '#3fd08a', icon: <g><circle r={80} fill="#f5c542" {...O} /><text y={34} textAnchor="middle" fontFamily={MONT} fontWeight={800} fontSize={104} fill="#7a5a10">$</text></g>},
    {label: 'SAME 24 HOURS', c: '#ff8a5a', icon: <g><circle r={80} fill="#fff" {...O} />{Array.from({length: 12}, (_, i) => <rect key={i} x={-3} y={-72} width={6} height={i % 3 === 0 ? 16 : 9} rx={3} fill={INK} transform={`rotate(${i * 30})`} />)}<path d="M 0,0 L 0,-52 M 0,0 L 34,16" stroke={INK} strokeWidth={9} strokeLinecap="round" /></g>},
  ];
  return (
    <InsertBG glow="#6a8bff">
      {cards.map((cd, i) => { const k = eoBack((t - at[i]) / 0.45), vis = t >= at[i]; return (
        <g key={i} transform={`translate(${380 + i * 580} 540) scale(${vis ? 0.4 + 0.6 * k : 0})`} opacity={vis ? Math.min(1, (t - at[i]) / 0.12) : 0}>
          <rect x={-250} y={-300} width={500} height={600} rx={50} fill="#151a3a" stroke={cd.c} strokeWidth={8} />
          <g transform="translate(0 -50) scale(1.7)">{cd.icon}</g>
          <text y={220} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={52} letterSpacing={4} fill="#fff" stroke="rgba(5,8,22,.9)" strokeWidth={4} paintOrder="stroke">{cd.label}</text>
        </g>); })}
    </InsertBG>
  );
};

// the next 10 seconds: a ring that drains while the digits count 10 -> 0
export const TenRing: React.FC<{t: number; from: number; to: number}> = ({t, from, to}) => {
  const k = Math.min(1, Math.max(0, (t - from) / (to - from))), n = Math.max(0, Math.ceil(10 * (1 - k))), a = 1 - sm(t, to + 0.05, to + 0.4);
  const R = 300, C = 2 * Math.PI * R, pulse = 1 + 0.03 * Math.sin(t * 9);
  return (
    <InsertBG glow="#ff5a6e">
      <g transform={`translate(960 540) scale(${pulse})`} opacity={sm(t, from - 0.3, from) * a}>
        <circle r={R} fill="none" stroke="#1f2547" strokeWidth={34} />
        <circle r={R} fill="none" stroke="#ff5a6e" strokeWidth={34} strokeLinecap="round" strokeDasharray={`${C * (1 - k)} ${C}`} transform="rotate(-90)" style={{filter: 'drop-shadow(0 0 24px #ff5a6e)'}} />
        <text y={92} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={290} fill="#fff" stroke="rgba(5,8,22,.9)" strokeWidth={10} paintOrder="stroke">{n}</text>
        <text y={170} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={44} letterSpacing={14} fill="#ffb3bd">SECONDS</text>
      </g>
    </InsertBG>
  );
};

// a dark phone screen that turns into a mirror: you, the viewer
export const MirrorPhone: React.FC<{t: number; at: number}> = ({t, at}) => {
  const k = sm(t, at, at + 1.2), br = 1 + 0.02 * Math.sin(t * 2);
  return (
    <InsertBG glow="#9db6ff">
      <g transform={`translate(960 560) scale(${br})`}>
        <rect x={-300} y={-440} width={600} height={880} rx={76} fill="#07080f" {...O} />
        <rect x={-272} y={-412} width={544} height={824} rx={54} fill="#0c0f20" />
        <g opacity={k}>
          <circle cx={0} cy={-90} r={118} fill="#1b2146" /><path d="M -210,300 Q -200,70 0,60 Q 200,70 210,300 Z" fill="#1b2146" />
          <circle cx={0} cy={-90} r={118} fill="none" stroke="#9db6ff" strokeWidth={4} opacity={0.5} /><path d="M -210,300 Q -200,70 0,60 Q 200,70 210,300" fill="none" stroke="#9db6ff" strokeWidth={4} opacity={0.5} />
          <text y={-60} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={64} letterSpacing={10} fill="#9db6ff" opacity={0.9}>YOU</text>
        </g>
        <path d="M -250,-412 L -60,-412 L -250,100 Z" fill="#fff" opacity={0.06 + 0.04 * k} />
      </g>
    </InsertBG>
  );
};
