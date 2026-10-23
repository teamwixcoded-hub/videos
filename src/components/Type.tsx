import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CINE_FONT, HAND_FONT, HEAD_FONT, SERIF_FONT, TYPE_FONT} from '../fonts';
import {S, clamp01, easeInOut, easeOut} from '../easing';

// ============================================================================================
// Title-design kit. Every component takes times in SCRIPT seconds (S() applies the speed setting)
// and lives in screen space. Each one expresses an idea in motion instead of just showing words.
// ============================================================================================

const INK = '#2a1713';
const co = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const glow = (c: string) => `0 0 28px ${c}88, 0 0 60px ${c}44`;

// A soft dark band behind text so it reads on light walls and busy art without a hard box.
const Backing: React.FC<{y: number; h?: number; o?: number}> = ({y, h = 260, o = 0.5}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y - h / 2, height: h, background: `radial-gradient(ellipse 62% 50% at 50% 50%, rgba(8,6,12,${o}) 0%, rgba(8,6,12,${o * 0.6}) 45%, transparent 100%)`, pointerEvents: 'none'}} />
);

// One sound that belongs to a piece of text. `at` is an absolute frame, `frames` its length.
export const Snd: React.FC<{file: string; at: number; vol?: number; rate?: number; frames?: number}> = ({file, at, vol = 0.25, rate = 1, frames = 45}) => (
  <Sequence from={at} durationInFrames={frames}>
    <Audio src={staticFile(`sfx/${file.includes('.') ? file : file + '.mp3'}`)} playbackRate={rate} volume={(f) => vol * Math.min(1, f / 2) * Math.min(1, (frames - f) / 8)} />
  </Sequence>
);

const useWindow = (from: number, to: number, fadeIn = 8, fadeOut = 10) => {
  const frame = useCurrentFrame();
  const a = S(from), b = S(to);
  const live = frame >= a && frame <= b + fadeOut;
  const o = interpolate(frame, [a, a + fadeIn, b, b + fadeOut], [0, 1, 1, 0], co);
  return {frame, a, b, live, o, t: frame - a};
};

// ---- Letterbox: cinematic bars that slide in for the big moments ----
export const Letterbox: React.FC<{from: number; to: number; size?: number}> = ({from, to, size = 120}) => {
  const {live, o, a} = useWindow(from, to, 14, 14);
  if (!live) return null;
  const h = size * easeOut(o);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <Snd file="whoosh" at={a} vol={0.16} frames={24} rate={0.7} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h, background: '#000'}} />
    </AbsoluteFill>
  );
};

// ---- CineTitle: wide-tracked trailer title. Letters drift apart while thin rules draw in. ----
export const CineTitle: React.FC<{
  text: string; from: number; to: number; y?: number; size?: number; color?: string; accent?: string; accentWords?: string[];
  sub?: string; subColor?: string; track?: number;
}> = ({text, from, to, y = 540, size = 150, color = '#fff7e6', accent = '#ffd23f', accentWords = [], sub, subColor = '#e8dcc4', track = 0.34}) => {
  const {live, o, t, a} = useWindow(from, to, 16, 16);
  if (!live) return null;
  const spread = interpolate(t, [0, S(to - from) + 10], [track * 0.45, track], co);
  // keep the whole line inside the frame: estimate its width at full tracking and shrink the type if needed
  const estW = text.replace(/ /g, '').length * (0.42 + track) * size + (text.split(' ').length - 1) * 0.5 * size;
  const fit = Math.min(1, 1740 / estW);
  const fsz = size * fit;
  const rule = easeOut(clamp01(t / 22));
  const words = text.split(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o, pointerEvents: 'none'}}>
      <Snd file="titlehit" at={a} vol={0.26} frames={40} />
      <Backing y={y} h={size * 2.4} o={0.55} />
      <div style={{position: 'absolute', left: 0, right: 0, top: y, transform: 'translateY(-50%)', textAlign: 'center'}}>
        <div style={{margin: '0 auto 22px', height: 3, width: `${rule * 46}%`, background: `linear-gradient(90deg, transparent, ${color}, transparent)`}} />
        <div style={{fontFamily: CINE_FONT, fontSize: fsz, letterSpacing: `${spread}em`, paddingLeft: `${spread}em`, color, lineHeight: 1, textShadow: `0 10px 40px rgba(0,0,0,0.7)`}}>
          {words.map((w, i) => (
            <span key={i} style={{color: accentWords.includes(w.toLowerCase().replace(/[^a-z0-9]/g, '')) ? accent : color, textShadow: accentWords.includes(w.toLowerCase().replace(/[^a-z0-9]/g, '')) ? glow(accent) : undefined, marginRight: '0.5em'}}>{w}</span>
          ))}
        </div>
        <div style={{margin: '22px auto 0', height: 3, width: `${rule * 46}%`, background: `linear-gradient(90deg, transparent, ${color}, transparent)`}} />
        {sub && <div style={{marginTop: 26, fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: size * 0.3, letterSpacing: '0.04em', color: subColor, opacity: clamp01((t - 14) / 16), textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---- ChapterCard: "DAY 21" with a serif tagline underneath ----
export const ChapterCard: React.FC<{label: string; sub?: string; from: number; to: number; y?: number; size?: number}> = ({label, sub, from, to, y = 330, size = 190}) => {
  const {live, o, t, a} = useWindow(from, to, 10, 14);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const s = spring({frame: t, fps, config: {damping: 14, stiffness: 120, mass: 0.9}});
  const line = easeOut(clamp01((t - 4) / 20));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
      <Snd file="chapter" at={a} vol={0.3} frames={44} />
      <AbsoluteFill style={{background: 'rgba(6,5,10,0.42)'}} />
      <Backing y={y + size * 0.6} h={size * 2.6} o={0.5} />
      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${0.85 + 0.15 * s})`}}>
        <div style={{fontFamily: CINE_FONT, fontSize: size, letterSpacing: '0.12em', paddingLeft: '0.12em', color: '#fff7e6', lineHeight: 0.95, textShadow: `0 8px 0 ${INK}, 0 0 40px rgba(0,0,0,0.6)`}}>{label}</div>
        <div style={{margin: '10px auto 0', height: 4, width: `${line * 360}px`, background: '#ffd23f', boxShadow: glow('#ffd23f')}} />
        {sub && <div style={{marginTop: 16, fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 44, color: '#f1e6cf', opacity: clamp01((t - 12) / 14), textShadow: '0 3px 16px rgba(0,0,0,0.85)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---- Typewriter: types, can pause, strike a word and retype ----
export const Typewriter: React.FC<{text: string; from: number; to: number; x?: number; y?: number; size?: number; color?: string; cps?: number; strike?: string; align?: 'left' | 'center'}> = ({text, from, to, x = 960, y = 940, size = 64, color = '#fff', cps = 16, strike, align = 'center'}) => {
  const {live, o, t, frame, a} = useWindow(from, to, 4, 10);
  if (!live) return null;
  const n = Math.min(text.length, Math.floor((t / 30) * cps));
  const done = n >= text.length;
  const caret = Math.floor(frame / 9) % 2 === 0 || !done;
  const shown = text.slice(0, n);
  let body: React.ReactNode = shown;
  if (strike && shown.includes(strike)) {
    const i = shown.indexOf(strike);
    const sp = done ? easeOut(clamp01((t - (text.length / cps) * 30 - 6) / 10)) : 0;
    body = <>{shown.slice(0, i)}<span style={{position: 'relative'}}>{strike}<span style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${sp * 100}%`, background: '#ff4d4d', transform: 'rotate(-2deg)'}} /></span>{shown.slice(i + strike.length)}</>;
  }
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Backing y={y} h={size * 3} o={0.5} />
      {text.split('').map((ch, i) => <Snd key={i} file={ch === ' ' ? 'kspace.wav' : `k${(i * 5) % 3 + 1}.wav`} at={a + Math.round((i / cps) * 30)} vol={ch === ' ' ? 0.34 : 0.3 + (i % 4) * 0.03} rate={0.94 + ((i * 7) % 5) * 0.03} frames={6} />)}
      <Snd file="kding.wav" at={a + Math.round((text.length / cps) * 30) + 2} vol={0.22} frames={26} />
      <div style={{position: 'absolute', left: x, top: y, transform: align === 'center' ? 'translate(-50%, -50%)' : 'translate(0, -50%)', fontFamily: TYPE_FONT, fontSize: size, color, whiteSpace: 'pre', textShadow: '0 4px 18px rgba(0,0,0,0.9), 0 0 4px #000'}}>
        {body}
        <span style={{opacity: caret ? 1 : 0, color: '#ffd23f'}}>▌</span>
      </div>
    </AbsoluteFill>
  );
};

// ---- StrikeSwap: a wrong word is struck out in red and the right one takes its place ----
export const StrikeSwap: React.FC<{before: string; after: string; lead?: string; from: number; swapAt: number; to: number; y?: number; size?: number}> = ({before, after, lead = '', from, swapAt, to, y = 170, size = 130}) => {
  const {live, o, frame, a} = useWindow(from, to, 8, 12);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const sw = S(swapAt);
  const strike = easeOut(clamp01((frame - sw + 6) / 10));
  const pop = spring({frame: frame - sw, fps, config: {damping: 9, stiffness: 160, mass: 0.7}});
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Snd file="titlehit" at={a} vol={0.18} frames={36} />
      <Snd file="strike" at={sw - 6} vol={0.3} frames={22} />
      <Snd file="pop_a" at={sw + 4} vol={0.26} frames={14} rate={0.8} />
      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: CINE_FONT, fontSize: size, letterSpacing: '0.08em', color: '#fff7e6', textShadow: `0 8px 0 ${INK}, 0 0 30px rgba(0,0,0,0.6)`}}>
        {lead && <span style={{marginRight: '0.3em'}}>{lead}</span>}
        <span style={{position: 'relative', display: 'inline-block', opacity: frame >= sw ? 0.55 : 1}}>
          {before}
          <span style={{position: 'absolute', left: -8, top: '54%', height: 10, width: `${strike * 112}%`, background: '#ff4d4d', transform: 'rotate(-3deg)', boxShadow: glow('#ff4d4d')}} />
        </span>
        {frame >= sw && <span style={{display: 'inline-block', marginLeft: '0.3em', color: '#ff6b5e', transform: `scale(${pop}) rotate(${-2 + 2 * pop}deg)`, textShadow: glow('#ff6b5e')}}>{after}</span>}
      </div>
    </AbsoluteFill>
  );
};

// ---- Stamp: a red rubber stamp slams down, double border, slightly crooked ----
export const Stamp: React.FC<{text: string; from: number; to: number; x?: number; y?: number; size?: number; color?: string; rotate?: number}> = ({text, from, to, x = 960, y = 540, size = 150, color = '#e0453b', rotate = -7}) => {
  const {live, o, t, a} = useWindow(from, to, 3, 14);
  if (!live) return null;
  const k = interpolate(t, [0, 7, 11], [3.2, 0.92, 1], co);
  const ink = interpolate(t, [0, 4], [0, 0.95], co);
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Snd file="stamp" at={a + 5} vol={0.42} frames={30} />
      <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${k})`, opacity: ink}}>
        <div style={{border: `${size * 0.07}px solid ${color}`, borderRadius: 14, padding: `${size * 0.05}px ${size * 0.22}px`, boxShadow: `inset 0 0 0 ${size * 0.025}px #0000, 0 0 0 ${size * 0.03}px ${color}55`}}>
          <div style={{fontFamily: CINE_FONT, fontSize: size, letterSpacing: '0.12em', color, lineHeight: 1, filter: 'contrast(1.1)', textShadow: `0 0 2px ${color}`}}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Versus: two words face off; optionally they swap sides ("EASY" <-> "HARD") ----
export const Versus: React.FC<{left: string; right: string; leftColor?: string; rightColor?: string; from: number; to: number; swapAt?: number; y?: number; size?: number; leftSub?: string; rightSub?: string; fixedSubs?: boolean}> = ({left, right, leftColor = '#7fc2ff', rightColor = '#ffd23f', from, to, swapAt, y = 160, size = 130, leftSub, rightSub, fixedSubs}) => {
  const {live, o, frame, t, a} = useWindow(from, to, 8, 12);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const sw = swapAt !== undefined ? easeInOut(clamp01((frame - S(swapAt)) / 22)) : 0;
  const s = spring({frame: t, fps, config: {damping: 12, stiffness: 120}});
  const X = 330; // distance of each word from the centre
  const lx = -X + sw * 2 * X, rx = X - sw * 2 * X;
  const arc = Math.sin(sw * Math.PI) * -70;
  const word = (txt: string, color: string, sub: string | undefined, dx: number, dy: number) => (
    <div style={{position: 'absolute', left: 960 + dx, top: y + dy, transform: 'translateX(-50%)', textAlign: 'center'}}>
      <div style={{fontFamily: CINE_FONT, fontSize: size, letterSpacing: '0.1em', color, lineHeight: 1, textShadow: `0 8px 0 ${INK}, ${glow(color)}`}}>{txt}</div>
      {sub && <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 40, color: '#f1e6cf', marginTop: 6, textShadow: '0 3px 14px rgba(0,0,0,0.9)'}}>{sub}</div>}
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none', transform: `scale(${0.9 + 0.1 * s})`, transformOrigin: '50% 20%'}}>
      <Snd file="titlehit" at={a} vol={0.22} frames={36} />
      {swapAt !== undefined && <Snd file="whoosh" at={S(swapAt)} vol={0.26} frames={28} rate={1.1} />}
      {word(left, leftColor, fixedSubs ? undefined : leftSub, lx, arc)}
      {word(right, rightColor, fixedSubs ? undefined : rightSub, rx, -arc)}
      {fixedSubs && [[-X, leftSub], [X, rightSub]].map(([dx, sub], i) => (
        <div key={i} style={{position: 'absolute', left: 960 + (dx as number), top: y + size * 1.02, transform: 'translateX(-50%)', fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 52, color: '#f1e6cf', textShadow: '0 3px 14px rgba(0,0,0,0.9)'}}>{sub as string}</div>
      ))}
      <div style={{position: 'absolute', left: 960, top: y + size * 0.5, transform: 'translate(-50%, -50%)', fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 48, color: '#fff7e6', opacity: 0.85}}>vs</div>
    </AbsoluteFill>
  );
};

// ---- Annotation: a hand-drawn circle and arrow with handwriting, like a documentary callout ----
export const Annotation: React.FC<{text: string; from: number; to: number; target: [number, number]; r?: number; label?: [number, number]; color?: string; size?: number}> = ({text, from, to, target, r = 80, label, color = '#ffd23f', size = 64}) => {
  const {live, o, t, a} = useWindow(from, to, 4, 12);
  if (!live) return null;
  const circ = easeOut(clamp01(t / 16));
  const arrow = easeOut(clamp01((t - 10) / 14));
  const lab = label ?? [target[0] - 330, target[1] - 190];
  const circLen = 2 * Math.PI * r;
  const tx = lab[0] + 150, ty = lab[1] + 40;
  const len = Math.hypot(target[0] - tx, target[1] - ty);
  const chars = Math.floor(clamp01((t - 18) / 18) * text.length);
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Snd file="scribble" at={a} vol={0.3} frames={30} />
      <Snd file="scribble" at={a + 22} vol={0.22} frames={26} rate={1.15} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))'}}>
        <ellipse cx={target[0]} cy={target[1]} rx={r} ry={r * 0.86} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" transform={`rotate(-8 ${target[0]} ${target[1]})`} strokeDasharray={circLen} strokeDashoffset={circLen * (1 - circ)} />
        <path d={`M ${tx} ${ty} Q ${(tx + target[0]) / 2} ${ty - 70} ${target[0] - r * 0.9} ${target[1] - r * 0.55}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray={len * 1.3} strokeDashoffset={len * 1.3 * (1 - arrow)} />
      </svg>
      <div style={{position: 'absolute', left: lab[0], top: lab[1], fontFamily: HAND_FONT, fontWeight: 700, fontSize: size, color, whiteSpace: 'nowrap', transform: 'rotate(-5deg)', textShadow: '0 3px 12px rgba(0,0,0,0.85)'}}>{text.slice(0, chars)}</div>
    </AbsoluteFill>
  );
};

// ---- NumberMorph: "10 PAGES" becomes "100 PAGES" ----
export const NumberMorph: React.FC<{from: number; to: number; morphAt: number; a: string; b: string; suffix: string; y?: number; x?: number; size?: number; color?: string}> = ({from, to, morphAt, a, b, suffix, y = 170, x = 960, size = 200, color = '#ff6b5e'}) => {
  const {live, o, frame, a: a0} = useWindow(from, to, 8, 12);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const m = S(morphAt);
  const k = clamp01((frame - m) / 14);
  const pop = spring({frame: frame - m, fps, config: {damping: 7, stiffness: 140, mass: 0.8}});
  const num = frame < m ? a : b;
  const scale = frame < m ? 1 : 1 + 0.35 * pop;
  const shake = frame >= m && frame < m + 14 ? (random(`nm-${frame}`) - 0.5) * 14 : 0;
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Snd file="tick" at={a0} vol={0.24} frames={14} />
      <Snd file="riser" at={m - 24} vol={0.2} frames={26} />
      <Snd file="boom" at={m} vol={0.3} frames={30} rate={1.1} />
      <Backing y={y + size * 0.5} h={size * 2.2} o={0.5} />
      <div style={{position: 'absolute', left: x - 960, right: 960 - x, top: y, textAlign: 'center', transform: `translateX(${shake}px)`}}>
        <span style={{display: 'inline-block', fontFamily: CINE_FONT, fontSize: size, color: k > 0 ? color : '#fff7e6', lineHeight: 1, transform: `scale(${scale})`, textShadow: k > 0 ? `0 9px 0 ${INK}, ${glow(color)}` : `0 9px 0 ${INK}`}}>{num}</span>
        <span style={{fontFamily: CINE_FONT, fontSize: size * 0.62, letterSpacing: '0.1em', color: '#fff7e6', marginLeft: 26, textShadow: `0 7px 0 ${INK}`}}>{suffix}</span>
      </div>
    </AbsoluteFill>
  );
};

// ---- Echo: text with trailing ghost copies ("the days blur") ----
export const Echo: React.FC<{text: string; from: number; to: number; y?: number; size?: number; color?: string; copies?: number}> = ({text, from, to, y = 170, size = 150, color = '#fff7e6', copies = 5}) => {
  const {live, o, t, a} = useWindow(from, to, 8, 12);
  if (!live) return null;
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Snd file="whoosh" at={a} vol={0.2} frames={30} rate={0.8} />
      {Array.from({length: copies}).map((_, i) => {
        const k = copies - 1 - i;
        const drift = Math.sin(t / 7) * 14 * k;
        return (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y + k * 6, textAlign: 'center', fontFamily: CINE_FONT, fontSize: size, letterSpacing: `${0.08 + k * 0.05}em`, color, opacity: k === 0 ? 1 : 0.22 - k * 0.03, transform: `translateX(${drift}px)`, filter: `blur(${k * 1.4}px)`, textShadow: k === 0 ? `0 8px 0 ${INK}` : undefined}}>{text}</div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---- Glitch: text that stutters and splits into red/cyan for a beat ("something feels off") ----
export const GlitchText: React.FC<{text: string; from: number; to: number; y?: number; size?: number}> = ({text, from, to, y = 170, size = 130}) => {
  const {live, o, frame, t, a} = useWindow(from, to, 4, 10);
  if (!live) return null;
  const hit = (t % 36) < 5;
  const jx = hit ? (random(`g1-${frame}`) - 0.5) * 22 : 0;
  const split = hit ? 10 : 3;
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Snd file="glitch" at={a} vol={0.24} frames={14} />
      <Snd file="glitch" at={a + 36} vol={0.2} frames={14} rate={0.9} />
      <Snd file="glitch" at={a + 72} vol={0.2} frames={14} rate={1.1} />
      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `translateX(${jx}px)`, fontFamily: CINE_FONT, fontSize: size, letterSpacing: '0.1em', color: '#fff7e6', textShadow: `-${split}px 0 #ff2d55, ${split}px 0 #2dd4ff, 0 8px 0 ${INK}`, clipPath: hit ? `inset(${Math.floor(random(`g2-${frame}`) * 40)}% 0 ${Math.floor(random(`g3-${frame}`) * 30)}% 0)` : undefined}}>{text}</div>
    </AbsoluteFill>
  );
};

// ---- Scoreboard: "NIGHT 1 · PHONE 1 — BOOK 0" ----
export const Scoreboard: React.FC<{title: string; left: string; right: string; leftScore: number; rightScore: number; from: number; to: number; y?: number; leftColor?: string; rightColor?: string}> = ({title, left, right, leftScore, rightScore, from, to, y = 130, leftColor = '#ffd23f', rightColor = '#7fc2ff'}) => {
  const {live, o, t, a} = useWindow(from, to, 8, 14);
  const {fps} = useVideoConfig();
  if (!live) return null;
  const s = spring({frame: t, fps, config: {damping: 13, stiffness: 110}});
  const bump = spring({frame: t - 18, fps, config: {damping: 7, stiffness: 160, mass: 0.7}});
  const cell = (label: string, score: number, color: string, hot: boolean) => (
    <div style={{textAlign: 'center', minWidth: 330}}>
      <div style={{fontFamily: CINE_FONT, fontSize: 52, letterSpacing: '0.2em', color: '#f1e6cf'}}>{label}</div>
      <div style={{fontFamily: CINE_FONT, fontSize: 200, lineHeight: 0.9, color, textShadow: `0 8px 0 ${INK}, ${hot ? glow(color) : ''}`, transform: `scale(${hot ? 1 + 0.4 * (1 - Math.min(1, bump)) : 1})`}}>{score}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Snd file="whoosh" at={a} vol={0.22} frames={26} />
      <Snd file="meter" at={a + 18} vol={0.3} frames={20} rate={1.2} />
      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${0.9 + 0.1 * s})`}}>
        <div style={{fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: 48, color: '#f1e6cf', marginBottom: 6, textShadow: '0 3px 14px rgba(0,0,0,0.9)'}}>{title}</div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, background: 'rgba(8,8,14,0.55)', borderRadius: 26, padding: '14px 60px', width: 'fit-content', margin: '0 auto', border: '3px solid rgba(255,255,255,0.18)'}}>
          {cell(left, leftScore, leftColor, leftScore > rightScore)}
          <div style={{fontFamily: CINE_FONT, fontSize: 120, color: '#fff7e6', opacity: 0.6}}>—</div>
          {cell(right, rightScore, rightColor, rightScore > leftScore)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Whisper: a quiet serif line for emotional beats, slow fade, nothing flashy ----
export const Whisper: React.FC<{text: string; from: number; to: number; y?: number; size?: number; color?: string}> = ({text, from, to, y = 930, size = 66, color = '#f6ecd6'}) => {
  const {live, o, t, a} = useWindow(from, to, 20, 22);
  if (!live) return null;
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <Snd file="exhale" at={a} vol={0.1} frames={50} rate={1.2} />
      <Backing y={y + size * 0.5} h={size * 3.2} o={0.5} />
      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: SERIF_FONT, fontStyle: 'italic', fontSize: size, letterSpacing: `${interpolate(t, [0, 60], [0.0, 0.04], co)}em`, color, textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 0 6px #000'}}>{text}</div>
    </AbsoluteFill>
  );
};
