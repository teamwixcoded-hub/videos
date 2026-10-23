import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CINE_FONT, SERIF_FONT} from '../fonts';
import {S, clamp01, easeOut} from '../easing';
import {Snd} from './Type';
import {useKeepInFrame} from '../vfx/Motion';

// Explanatory graphics: they answer "who is this?" and "what exactly is changing?" so the story is easy to follow.
// Times are script seconds (S() applies the speed setting). Screen space unless noted.
const INK = '#2a1713';
const co = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const glow = (c: string) => `0 0 24px ${c}99`;

const useWin = (from: number, to: number, fi = 8, fo = 10) => {
  const frame = useCurrentFrame();
  const a = S(from), b = S(to);
  return {frame, a, b, live: frame >= a && frame <= b + fo, o: interpolate(frame, [a, a + fi, b, b + fo], [0, 1, 1, 0], co), t: frame - a};
};

// ---- NameTag: a pill that says who someone is, with a pointer. Place inside <Camera> to anchor to a character. ----
export const NameTag: React.FC<{text: string; x: number; y: number; from: number; to: number; color: string; size?: number; sub?: string}> = ({text, x, y, from, to, color, size = 44, sub}) => {
  const {live, o, t, a} = useWin(from, to, 6, 10);
  const {fps} = useVideoConfig();
  const tw = Math.max(260, text.length * size * 0.62 + 70), th = size * 1.3 + 40 + (sub ? size * 0.9 : 0);
  const [kx, ky] = useKeepInFrame(x, y, tw, th, 28, 1);
  if (!live) return null;
  const s = spring({frame: t, fps, config: {damping: 10, stiffness: 160, mass: 0.7}});
  return (
    <div style={{position: 'absolute', left: kx, top: ky, transform: `translate(-50%, -100%) scale(${s})`, transformOrigin: '50% 100%', opacity: o, pointerEvents: 'none', textAlign: 'center'}}>
      <Snd file="pop_c" at={a} vol={0.26} frames={14} />
      <div style={{display: 'inline-block', background: color, color: '#1a1210', border: `5px solid ${INK}`, borderRadius: 16, padding: '6px 26px', fontFamily: CINE_FONT, fontSize: size, letterSpacing: '0.12em', boxShadow: `0 8px 0 ${INK}`}}>{text}</div>
      {sub && <div style={{marginTop: 8, fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: size * 0.62, color: '#fff7e6', textShadow: '0 3px 12px rgba(0,0,0,0.9)'}}>{sub}</div>}
      <div style={{width: 0, height: 0, margin: '0 auto', borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: `20px solid ${INK}`}} />
    </div>
  );
};

// ---- HabitHub: the reading habit in the centre, ripples spreading out to the areas of life it changes ----
const NODES = [
  {label: 'WORK', icon: 'fx/bulb', angle: -150, sub: 'thinks clearly'},
  {label: 'MORNINGS', icon: 'props/alarm', angle: -90, sub: 'wakes earlier'},
  {label: 'PEOPLE', icon: 'fx/heart', angle: -30, sub: 'more patient'},
];

export const HabitHub: React.FC<{from: number; to: number; nodeAt?: number[]; cx?: number; cy?: number; radius?: number}> = ({from, to, nodeAt = [2.4, 3.6, 4.8], cx = 960, cy = 690, radius = 400}) => {
  const {live, o, t, frame} = useWin(from, to, 10, 14);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const hub = spring({frame: t, fps, config: {damping: 11, stiffness: 100}});
  return (
    <AbsoluteFill style={{opacity: o, background: 'radial-gradient(ellipse at 50% 55%, #1f4a35 0%, #0d1f17 75%)', pointerEvents: 'none'}}>
      {/* ripples */}
      {[0, 1, 2].map((i) => {
        const k = ((t - 14 - i * 26) % 78) / 78;
        if (t < 14 + i * 26) return null;
        return <div key={i} style={{position: 'absolute', left: cx, top: cy, width: 120 + k * radius * 2.6, height: 120 + k * radius * 2.6, marginLeft: -(120 + k * radius * 2.6) / 2, marginTop: -(120 + k * radius * 2.6) / 2, borderRadius: '50%', border: `5px solid rgba(126,226,160,${0.55 * (1 - k)})`}} />;
      })}
      {/* spokes + nodes */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {NODES.map((n, i) => {
          const at = S(nodeAt[i]);
          const p = easeOut(clamp01((frame - S(from) - at) / 14));
          const rad = (n.angle * Math.PI) / 180;
          const ex = cx + Math.cos(rad) * radius * 1.2, ey = cy + Math.sin(rad) * radius * 1.0;
          return <line key={i} x1={cx} y1={cy} x2={cx + (ex - cx) * p} y2={cy + (ey - cy) * p} stroke="#7ee2a0" strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" />;
        })}
      </svg>
      {NODES.map((n, i) => {
        const at = S(nodeAt[i]);
        const s = spring({frame: frame - S(from) - at, fps, config: {damping: 9, stiffness: 150, mass: 0.8}});
        const rad = (n.angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * radius * 1.2, y = cy + Math.sin(rad) * radius * 1.0;
        return (
          <div key={n.label} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, textAlign: 'center'}}>
            <div style={{width: 190, height: 190, borderRadius: '50%', background: '#143626', border: `7px solid ${INK}`, boxShadow: `0 0 0 6px #7ee2a0, ${glow('#7ee2a0')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
              <Img src={staticFile(`images/${n.icon}.png`)} style={{width: 110, height: 110, objectFit: 'contain'}} />
            </div>
            <div style={{marginTop: 14, fontFamily: CINE_FONT, fontSize: 70, letterSpacing: '0.14em', color: '#fff7e6', textShadow: `0 6px 0 ${INK}`}}>{n.label}</div>
            <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 40, color: '#bff0cf', textShadow: '0 3px 12px rgba(0,0,0,0.9)'}}>{n.sub}</div>
          </div>
        );
      })}
      {/* the habit itself */}
      <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%, -50%) scale(${hub})`, textAlign: 'center'}}>
        <div style={{width: 250, height: 250, borderRadius: '50%', background: '#ffe9b0', border: `9px solid ${INK}`, boxShadow: `0 0 0 8px #ffd23f, ${glow('#ffd23f')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', transform: `scale(${1 + 0.04 * Math.sin(t / 8)})`}}>
          <Img src={staticFile('images/props/book-open.png')} style={{width: 170, height: 170, objectFit: 'contain'}} />
        </div>
        <div style={{marginTop: 14, fontFamily: CINE_FONT, fontSize: 62, letterSpacing: '0.16em', color: '#ffd23f', textShadow: `0 6px 0 ${INK}`}}>10 PAGES A NIGHT</div>
      </div>
    </AbsoluteFill>
  );
};

// ---- ChecklistCard: a titled card whose rows pop in with a tick (good) or a cross (bad) ----
export type Row = {text: string; at: number; ok?: boolean};

const Mark: React.FC<{ok: boolean; p: number}> = ({ok, p}) => (
  <svg width={46} height={46} viewBox="0 0 46 46" style={{flex: 'none'}}>
    <circle cx={23} cy={23} r={20} fill={ok ? '#2fa866' : '#d9453b'} stroke={INK} strokeWidth={4} />
    {ok ? (
      <path d="M12 24 L20 32 L35 14" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - p)} />
    ) : (
      <>
        <path d="M14 14 L32 32" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeDasharray={26} strokeDashoffset={26 * (1 - p)} />
        <path d="M32 14 L14 32" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeDasharray={26} strokeDashoffset={26 * (1 - clamp01(p * 2 - 0.5))} />
      </>
    )}
  </svg>
);

export const ChecklistCard: React.FC<{title: string; sub?: string; color: string; rows: Row[]; from: number; to: number; x: number; y: number; w?: number; rowSize?: number}> = ({title, sub, color, rows, from, to, x, y, w = 620, rowSize = 46}) => {
  const {live, o, t, frame, a} = useWin(from, to, 10, 14);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const s = spring({frame: t, fps, config: {damping: 13, stiffness: 110}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translateX(-50%) scale(${0.92 + 0.08 * s})`, opacity: o, pointerEvents: 'none'}}>
      <Snd file="whoosh" at={a} vol={0.16} frames={22} />
      {rows.map((r, i) => <Snd key={i} file={r.ok === false ? 'thump' : 'meter'} at={S(r.at)} vol={r.ok === false ? 0.22 : 0.26} rate={r.ok === false ? 1 : 0.92 + i * 0.12} frames={18} />)}
      <div style={{background: 'rgba(10,8,14,0.78)', border: `5px solid ${INK}`, borderRadius: 24, boxShadow: `0 10px 0 ${INK}, 0 0 0 5px ${color}`, overflow: 'hidden'}}>
        <div style={{background: color, padding: '8px 26px', borderBottom: `5px solid ${INK}`}}>
          <div style={{fontFamily: CINE_FONT, fontSize: 56, letterSpacing: '0.14em', color: '#1a1210', lineHeight: 1.05}}>{title}</div>
          {sub && <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 30, color: '#1a1210', opacity: 0.8}}>{sub}</div>}
        </div>
        <div style={{padding: '10px 26px 14px'}}>
          {rows.map((r, i) => {
            const p = clamp01((frame - S(r.at)) / 10);
            const pop = spring({frame: frame - S(r.at), fps, config: {damping: 10, stiffness: 170, mass: 0.7}});
            if (frame < S(r.at)) return <div key={i} style={{height: rowSize * 1.45}} />;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, height: rowSize * 1.45, transform: `translateX(${(1 - pop) * -40}px)`, opacity: Math.min(1, pop * 1.6)}}>
                <Mark ok={r.ok !== false} p={p} />
                <div style={{fontFamily: CINE_FONT, fontSize: rowSize, letterSpacing: '0.07em', color: r.ok === false ? '#ffb4aa' : '#e6ffef', lineHeight: 1}}>{r.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---- BenefitChips: a small stack of "✔ benefit" lines that tick on one by one (for the productive vignettes) ----
export const BenefitChips: React.FC<{title: string; rows: Row[]; from: number; to: number; x?: number; y?: number; color?: string; w?: number}> = ({title, rows, from, to, x = 1500, y = 230, color = '#7ee2a0', w = 600}) => (
  <ChecklistCard title={title} color={color} rows={rows} from={from} to={to} x={x} y={y} w={w} rowSize={42} />
);

// ---- ProgressBar: a labelled bar that fills ("FOCUS", "CALM") ----
export const ProgressBar: React.FC<{label: string; from: number; to: number; fillTo: number; x: number; y: number; color?: string; w?: number}> = ({label, from, to, fillTo, x, y, color = '#7ee2a0', w = 520}) => {
  const {live, o, t, a} = useWin(from, to, 8, 12);
  if (!live) return null;
  const k = easeOut(clamp01(t / 50)) * fillTo;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: 'translateX(-50%)', opacity: o, pointerEvents: 'none'}}>
      <Snd file="riser" at={a} vol={0.12} frames={44} rate={1.2} />
      <div style={{fontFamily: CINE_FONT, fontSize: 40, letterSpacing: '0.14em', color: '#fff7e6', textShadow: `0 4px 0 ${INK}`, marginBottom: 6}}>{label}</div>
      <div style={{height: 30, borderRadius: 15, background: 'rgba(0,0,0,0.5)', border: `5px solid ${INK}`, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${k * 100}%`, background: `linear-gradient(90deg, ${color}, #d6ffe6)`}} />
      </div>
    </div>
  );
};

// ---- SectionBadge: "1 · WORK" corner badge that says which part of his life we are looking at ----
export const SectionBadge: React.FC<{n: string; label: string; from: number; to: number; x?: number; y?: number}> = ({n, label, from, to, x = 70, y = 70}) => {
  const {live, o, t, a} = useWin(from, to, 8, 12);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const s = spring({frame: t, fps, config: {damping: 12, stiffness: 140}});
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `translateX(${(1 - s) * -80}px)`, display: 'flex', alignItems: 'center', gap: 16, pointerEvents: 'none'}}>
      <Snd file="pop_a" at={a} vol={0.26} frames={14} />
      <div style={{width: 84, height: 84, borderRadius: '50%', background: '#7ee2a0', border: `6px solid ${INK}`, fontFamily: CINE_FONT, fontSize: 64, color: '#1a1210', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 0 ${INK}`}}>{n}</div>
      <div style={{background: 'rgba(10,8,14,0.82)', border: `5px solid ${INK}`, borderRadius: 16, padding: '4px 28px', fontFamily: CINE_FONT, fontSize: 68, letterSpacing: '0.16em', color: '#fff7e6', boxShadow: `0 6px 0 ${INK}`}}>{label}</div>
    </div>
  );
};

// ---- RewardChart: WHEN the reward arrives. Phone pays instantly then fades; book pays nothing at first, then grows. ----
export const RewardChart: React.FC<{from: number; to: number; x?: number; y?: number; w?: number; h?: number}> = ({from, to, x = 960, y = 70, w = 1100, h = 430}) => {
  const {live, o, t, a} = useWin(from, to, 10, 14);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const s = spring({frame: t, fps, config: {damping: 14, stiffness: 100}});
  const pw = w - 150, ph = h - 190, px = 90, py = 100;
  const phone = (u: number) => 0.92 * Math.exp(-3.2 * u) + 0.12; // instant hit, then it fades
  const book = (u: number) => 0.06 + 0.9 * (1 / (1 + Math.exp(-7 * (u - 0.55)))); // nothing at first, then it grows
  const path = (fn: (u: number) => number) => Array.from({length: 41}, (_, i) => { const u = i / 40; return `${i ? 'L' : 'M'}${px + u * pw} ${py + ph - fn(u) * ph}`; }).join(' ');
  const draw = easeOut(clamp01((t - 12) / 70));
  const L = 1700;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h, opacity: o, transform: `scale(${0.94 + 0.06 * s})`, pointerEvents: 'none'}}>
      <Snd file="whoosh" at={a} vol={0.2} frames={24} />
      <Snd file="scribble" at={a + 12} vol={0.18} frames={30} rate={0.8} />
      <Snd file="meter" at={a + 62} vol={0.22} frames={18} />
      <div style={{position: 'absolute', inset: 0, background: 'rgba(10,8,14,0.86)', border: `5px solid ${INK}`, borderRadius: 26, boxShadow: `0 10px 0 ${INK}`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 10, textAlign: 'center', fontFamily: CINE_FONT, fontSize: 56, letterSpacing: '0.16em', color: '#fff7e6'}}>WHEN DOES THE REWARD ARRIVE?</div>
      <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
        <line x1={px} y1={py + ph} x2={px + pw} y2={py + ph} stroke="#8a8494" strokeWidth={4} />
        <line x1={px} y1={py} x2={px} y2={py + ph} stroke="#8a8494" strokeWidth={4} />
        <path d={path(phone)} fill="none" stroke="#7fc2ff" strokeWidth={10} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
        <path d={path(book)} fill="none" stroke="#ffd23f" strokeWidth={10} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
      </svg>
      {[['TONIGHT', 0], ['1 MONTH', 0.5], ['1 YEAR', 1]].map(([lab, u]) => (
        <div key={lab as string} style={{position: 'absolute', left: px + (u as number) * pw - 90, width: 180, top: py + ph + 10, textAlign: 'center', fontFamily: CINE_FONT, fontSize: 36, letterSpacing: '0.12em', color: '#d8d2c4'}}>{lab}</div>
      ))}
      <div style={{position: 'absolute', left: px + 230, top: py + 10, fontFamily: CINE_FONT, fontSize: 46, letterSpacing: '0.1em', color: '#7fc2ff', opacity: clamp01((t - 20) / 10), textShadow: `0 4px 0 ${INK}`}}>PHONE: REWARD NOW</div>
      <div style={{position: 'absolute', right: 30, top: py + ph * 0.62, fontFamily: CINE_FONT, fontSize: 46, letterSpacing: '0.1em', color: '#ffd23f', opacity: clamp01((t - 60) / 12), textShadow: `0 4px 0 ${INK}`}}>BOOK: REWARD LATER</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 34, color: '#f1e6cf', opacity: clamp01((t - 80) / 14)}}>the phone pays first. the book pays more.</div>
    </div>
  );
};
