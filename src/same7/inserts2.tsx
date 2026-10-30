import React from 'react';
import {INK} from '../same2d/Char';
import {InsertBG} from '../same2d/inserts';
import {MONT, DIGI} from '../same2d/theme';
import {BookSpread} from './book';

// More full-frame inserts for SAME MAN v2 (Acts 4 to 16). Local seconds into the shot.
const ease = (x: number) => x * x * (3 - 2 * x);
const sm = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
const eoBack = (x: number) => { const k = Math.min(1, Math.max(0, x)), c1 = 1.8, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const O = {stroke: INK, strokeWidth: 8, strokeLinejoin: 'round' as const};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// he reads the same line: a yellow marker under one line and a dot that crawls along it, passes times
export const BookRead: React.FC<{t: number; passes?: number; per?: number; left?: string; right?: string}> = ({t, passes = 1, per = 1.1, left = '1', right = '2'}) => {
  const n = Math.min(passes - 1, Math.floor(t / per)), f = Math.min(1, (t - n * per) / (per * 0.8)), x = -590 + 480 * ease(Math.max(0, f));
  return (
    <InsertBG glow="#ffb25a">
      <g transform="translate(960 520) scale(0.74)">
        <BookSpread left={left} right={right} />
        <rect x={-592} y={-150} width={500} height={38} rx={10} fill="#ffd23f" opacity={0.5} />
        <circle cx={x} cy={-131} r={16} fill="#ff4f6d" style={{filter: 'drop-shadow(0 0 12px #ff4f6d)'}} />
        <text x={-592} y={-176} fontFamily={MONT} fontWeight={800} fontSize={40} fill="#ff4f6d">{'×' + (n + 1)}</text>
      </g>
    </InsertBG>
  );
};

// ALWAYS EASIER / CLOSER / THERE: the phone is an arm's length away, the book is across the room
export const PullGauge: React.FC<{t: number; at: [number, number, number]}> = ({t, at}) => {
  const words = ['ALWAYS EASIER', 'ALWAYS CLOSER', 'ALWAYS THERE'];
  const bar = (y: number, len: number, col: string, label: string, k: number, dist: string) => (
    <g transform={`translate(0 ${y})`}>
      <rect x={260} y={-26} width={1400} height={52} rx={26} fill="#1f2547" />
      <rect x={260} y={-26} width={1400 * len * k} height={52} rx={26} fill={col} style={{filter: `drop-shadow(0 0 16px ${col})`}} />
      <text x={260} y={-52} fontFamily={DIGI} fontWeight={700} fontSize={44} letterSpacing={6} fill="#fff">{label}</text>
      <text x={1660} y={-52} textAnchor="end" fontFamily={DIGI} fontWeight={700} fontSize={44} fill={col}>{dist}</text>
    </g>
  );
  return (
    <InsertBG glow="#ff5a6e">
      {bar(380, 0.07, '#4aa8ff', 'THE PHONE', sm(t, 0.1, 0.8), '10 CM')}
      {bar(560, 1, '#3ddc84', 'THE BOOK', sm(t, 0.5, 1.6), 'ACROSS THE ROOM')}
      {words.map((w, i) => { const k = eoBack((t - at[i]) / 0.4); return t >= at[i] ? <text key={i} x={960} y={780 + i * 100} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={84} letterSpacing={6} fill="#fff" stroke="rgba(5,8,22,.9)" strokeWidth={8} paintOrder="stroke" opacity={Math.min(1, k)} transform={`translate(0 ${(1 - Math.min(1, k)) * 20})`}>{w}</text> : null; })}
    </InsertBG>
  );
};

// a video about a video about a video: phones inside phones, the camera sinking deeper
export const NestedPhones: React.FC<{t: number; at: [number, number, number]}> = ({t, at}) => {
  const titles = ['MORNING ROUTINES', 'DISCIPLINE', 'WHY YOU CAN’T STOP WATCHING VIDEOS'], cols = ['#4aa8ff', '#9b6bff', '#ff5a6e'];
  const depth = sm(t, at[0], at[1]) + sm(t, at[1], at[2]);
  const Phone = (lvl: number): React.ReactNode => {
    const vis = sm(t, at[lvl] - 0.25, at[lvl] + 0.15);
    return (
      <g opacity={vis}>
        <rect x={-250} y={-420} width={500} height={840} rx={64} fill="#0d0f1c" {...O} /><rect x={-226} y={-396} width={452} height={792} rx={44} fill="#111528" />
        <rect x={-210} y={-380} width={420} height={236} rx={20} fill={cols[lvl]} opacity={0.35} /><path d="M -28,-292 L 40,-262 L -28,-232 Z" fill="#fff" opacity={0.9} />
        <text x={0} y={-100} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={lvl === 2 ? 30 : 36} fill="#fff">{titles[lvl]}</text>
        {lvl < 2 && <g transform="translate(0 130) scale(0.62)">{Phone(lvl + 1)}</g>}
      </g>
    );
  };
  const sc = lerp(1, 2.6, depth * 0.5) * (1 + 0.5 * depth);
  return (
    <InsertBG glow="#9b6bff">
      <g transform={`translate(960 ${560 + depth * 360}) scale(${sc})`}>{Phone(0)}</g>
    </InsertBG>
  );
};

// numbers that add up on screen: rows land one by one, then the total
export const CountCard: React.FC<{t: number; head: string; rows: {text: string; at: number}[]; total: {text: string; at: number}; color: string; sub?: string}> = ({t, head, rows, total, color, sub}) => {
  const tk = eoBack((t - total.at) / 0.5);
  return (
    <InsertBG glow={color}>
      <text x={960} y={190} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={50} letterSpacing={14} fill={color}>{head}</text>
      {rows.map((r, i) => { const k = eoBack((t - r.at) / 0.4); return t >= r.at ? <text key={i} x={960} y={400 + i * 150} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={118} fill="#fff" stroke="rgba(5,8,22,.9)" strokeWidth={9} paintOrder="stroke" opacity={Math.min(1, k)} transform={`translate(0 ${(1 - Math.min(1, k)) * 26})`}>{r.text}</text> : null; })}
      {t >= total.at && <g transform={`translate(960 ${420 + rows.length * 150}) scale(${0.5 + 0.5 * Math.min(1.1, tk)})`} opacity={Math.min(1, tk)}>
        <rect x={-560} y={-110} width={1120} height={190} rx={40} fill="#151a3a" stroke={color} strokeWidth={8} />
        <text y={36} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={130} fill={color} stroke="rgba(5,8,22,.9)" strokeWidth={8} paintOrder="stroke">{total.text}</text>
        {sub && <text y={150} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={44} letterSpacing={8} fill="#cfd8ff">{sub}</text>}
      </g>}
    </InsertBG>
  );
};

// PHONE or BOOK: two big buttons
export const Choice: React.FC<{t: number}> = ({t}) => {
  const k = eoBack(t / 0.5), p1 = 1 + 0.03 * Math.sin(t * 6), p2 = 1 + 0.03 * Math.sin(t * 6 + 3);
  return (
    <InsertBG glow="#9b7be4">
      <g transform={`translate(520 560) scale(${Math.min(1, k) * p1})`}><rect x={-330} y={-250} width={660} height={500} rx={60} fill="#151a3a" stroke="#4aa8ff" strokeWidth={10} /><rect x={-70} y={-170} width={140} height={250} rx={28} fill="#15161f" {...O} /><rect x={-54} y={-150} width={108} height={200} rx={14} fill="#4aa8ff" opacity={0.6} /><text y={190} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={110} letterSpacing={8} fill="#fff" stroke="rgba(5,8,22,.9)" strokeWidth={8} paintOrder="stroke">PHONE</text></g>
      <text x={960} y={590} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={70} fill="#9b7be4" opacity={Math.min(1, k)}>OR</text>
      <g transform={`translate(1400 560) scale(${Math.min(1, k) * p2})`}><rect x={-330} y={-250} width={660} height={500} rx={60} fill="#151a3a" stroke="#3ddc84" strokeWidth={10} /><path d="M -150,-130 L -10,-100 L -10,70 L -150,40 Z M 150,-130 L 10,-100 L 10,70 L 150,40 Z" fill="#f4ecd6" {...O} /><text y={190} textAnchor="middle" fontFamily={DIGI} fontWeight={700} fontSize={110} letterSpacing={8} fill="#fff" stroke="rgba(5,8,22,.9)" strokeWidth={8} paintOrder="stroke">BOOK</text></g>
    </InsertBG>
  );
};

// the question for the viewer: a comment box that types
export const CommentCard: React.FC<{t: number; from: number; to: number; text: string}> = ({t, from, to, text}) => {
  const n = Math.round(Math.min(1, Math.max(0, (t - from) / (to - from))) * text.length), k = eoBack(t / 0.5), blink = Math.floor(t * 2.4) % 2 === 0;
  return (
    <InsertBG glow="#ffb25a">
      <g transform={`translate(960 540) scale(${Math.min(1, k)})`}>
        <rect x={-700} y={-230} width={1400} height={460} rx={50} fill="#151a3a" stroke="#ffb25a" strokeWidth={8} />
        <text x={-640} y={-150} fontFamily={DIGI} fontWeight={700} fontSize={46} letterSpacing={6} fill="#ffb25a">COMMENTS</text>
        <circle cx={-610} cy={-40} r={44} fill="#9b7be4" stroke={INK} strokeWidth={6} /><circle cx={-610} cy={-52} r={16} fill="#fff" /><path d="M -640,-6 Q -610,-34 -580,-6" fill="#fff" />
        <rect x={-540} y={-90} width={1180} height={110} rx={28} fill="#0d1030" stroke="#3a4380" strokeWidth={4} />
        <text x={-510} y={-20} fontFamily={DIGI} fontWeight={600} fontSize={52} fill="#fff">{text.slice(0, n)}{blink || n < text.length ? '|' : ' '}</text>
        <text x={-640} y={150} fontFamily={DIGI} fontWeight={600} fontSize={40} fill="#9aa5d8">What’s the last book you finished?</text>
      </g>
    </InsertBG>
  );
};
