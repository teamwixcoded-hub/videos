import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, HEAD_FONT} from '../fonts';
import {easeInOut, clamp01} from '../easing';
import {useKeepInFrame} from '../vfx/Motion';

const INK = '#2a1713';
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---- The real wall clock in the room: repainted in place so its hands can tick ----
// (the keyframe images all show the clock at (958, 292), radius ~67 in 1920x1080 space)
export const WallClock: React.FC<{minutes: number; x?: number; y?: number; r?: number}> = ({minutes, x = 958, y = 292, r = 68}) => {
  const m = (minutes % 60) * 6;
  const h = ((minutes / 60) % 12) * 30;
  const hand = (deg: number, len: number, w: number) => (
    <line x1={0} y1={0} x2={Math.sin((deg * Math.PI) / 180) * len} y2={-Math.cos((deg * Math.PI) / 180) * len} stroke={INK} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <g transform={`translate(${x} ${y})`}>
        <circle r={r + 4} fill="#7a746d" stroke={INK} strokeWidth={5} />
        <circle r={r - 7} fill="#f4efe6" stroke={INK} strokeWidth={3} />
        {[0, 90, 180, 270].map((a) => (
          <line key={a} x1={Math.sin((a * Math.PI) / 180) * (r - 14)} y1={-Math.cos((a * Math.PI) / 180) * (r - 14)} x2={Math.sin((a * Math.PI) / 180) * (r - 22)} y2={-Math.cos((a * Math.PI) / 180) * (r - 22)} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        ))}
        {hand(h, r * 0.45, 6)}
        {hand(m, r * 0.7, 4)}
        <circle r={4.5} fill={INK} />
      </g>
    </svg>
  );
};

// ---- "What he sees": a phone inset whose short videos swipe up one at a time ----
const CARD_COLORS: [string, string][] = [['#ff8a5c', '#ffd23f'], ['#6ee7ff', '#7a6bff'], ['#ff6b9d', '#ffb86b'], ['#7bf5b0', '#2bb3a3'], ['#c08cff', '#ff7ac8']];
const CARD_ICONS = ['laugh', 'sparkle', 'heart', 'bolt', 'bulb'] as const;

export const PhoneInset: React.FC<{from: number; to: number; x?: number; y?: number; swipes?: number[]}> = ({from, to, x = 250, y = 540, swipes = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to + 14) return null;
  const enter = spring({frame: frame - from, fps, config: {damping: 16, stiffness: 70, mass: 1}});
  const leave = interpolate(frame, [to, to + 14], [1, 0], clampOpts);
  // index of the video currently on screen, with a smooth swipe between them
  let pos = 0;
  swipes.forEach((s) => { pos += easeInOut(clamp01((frame - s) / 16)); });
  const W = 300, H = 600;
  const tilt = interpolate(enter, [0, 1], [-10, -3]);
  const sx = interpolate(enter, [0, 1], [-340, 0]);
  const cards = [0, 1, 2, 3].map((i) => i + Math.floor(pos));
  return (
    <div style={{position: 'absolute', left: x - W / 2, top: y - H / 2, width: W, height: H, transform: `translateX(${sx}px) rotate(${tilt}deg) scale(${0.96 + 0.04 * enter})`, opacity: enter * leave}}>
      <div style={{position: 'absolute', inset: -26, borderRadius: 70, background: 'radial-gradient(circle, rgba(110,170,255,0.55), transparent 70%)', filter: 'blur(14px)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 54, background: '#1a1c28', border: `8px solid ${INK}`, boxShadow: '0 24px 50px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 14, right: 14, top: 14, bottom: 14, borderRadius: 40, overflow: 'hidden', background: '#000'}}>
          {cards.map((c) => {
            const [a, b] = CARD_COLORS[c % CARD_COLORS.length];
            const rel = c - pos;
            if (rel < -1 || rel > 1.2) return null;
            return (
              <div key={c} style={{position: 'absolute', left: 0, right: 0, top: 0, height: '100%', transform: `translateY(${rel * 100}%)`, background: `linear-gradient(160deg, ${a}, ${b})`}}>
                <Img src={staticFile(`images/fx/${CARD_ICONS[c % CARD_ICONS.length] === 'laugh' ? 'sparkle' : CARD_ICONS[c % CARD_ICONS.length]}.png`)} style={{position: 'absolute', left: '50%', top: '38%', width: 150, transform: `translate(-50%, -50%) scale(${1 + 0.05 * Math.sin(frame / 8 + c)})`, filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))'}} />
                <div style={{position: 'absolute', left: 18, bottom: 54, width: 120, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.9)'}} />
                <div style={{position: 'absolute', left: 18, bottom: 34, width: 80, height: 9, borderRadius: 5, background: 'rgba(255,255,255,0.6)'}} />
                <div style={{position: 'absolute', right: 14, bottom: 100, width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.9)'}} />
                <div style={{position: 'absolute', right: 14, bottom: 150, width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.75)'}} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---- Dopamine meter: slim glass gauge that jumps with each "hit" ----
export const DopamineMeter: React.FC<{from: number; to?: number; hits: number[]; x?: number; y?: number}> = ({from, to, hits, x = 90, y = 330}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || (to !== undefined && frame > to + 24)) return null;
  const leave = to === undefined ? 1 : interpolate(frame, [to, to + 24], [1, 0], clampOpts);
  const enter = spring({frame: frame - from, fps, config: {damping: 18, stiffness: 80}}) * leave;
  let fill = 0, pulse = 0;
  hits.forEach((h, i) => {
    const t = clamp01((frame - h) / 14);
    fill = Math.max(fill, ((i + easeInOut(t)) / hits.length) * (frame >= h ? 1 : 0));
    if (frame >= h && frame < h + 16) pulse = 1 - (frame - h) / 16;
  });
  const H = 380;
  return (
    <div style={{position: 'absolute', left: x - 40 + (1 - enter) * -120, top: y, opacity: enter, width: 80, textAlign: 'center'}}>
      <div style={{fontFamily: BODY_FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.7)', marginBottom: 12}}>DOPAMINE</div>
      <div style={{position: 'relative', width: 54, height: H, margin: '0 auto', borderRadius: 27, border: `5px solid ${INK}`, background: 'rgba(255,255,255,0.14)', overflow: 'hidden', boxShadow: `0 0 ${14 + pulse * 30}px rgba(255,200,80,${0.25 + pulse * 0.5})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: 'linear-gradient(0deg,#ff8a3d,#ffd23f)'}} />
        <div style={{position: 'absolute', left: 6, top: 10, bottom: 10, width: 6, borderRadius: 3, background: 'rgba(255,255,255,0.35)'}} />
      </div>
    </div>
  );
};

// ---- Thought bubble where a stack of books builds into a tower ----
export const ThoughtTower: React.FC<{from: number; to?: number; build?: number; x?: number; y?: number}> = ({from, to, build = 60, x = 700, y = 420}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [kx, ky] = useKeepInFrame(x, y, 470, 400);
  if (frame < from || (to !== undefined && frame > to + 12)) return null;
  const leave = to === undefined ? 1 : interpolate(frame, [to, to + 12], [1, 0], clampOpts);
  const pop = spring({frame: frame - from, fps, config: {damping: 14, stiffness: 90}}) * leave;
  const p = easeInOut(clamp01((frame - from - 14) / build));
  const bob = Math.sin(frame / 22) * 5;
  return (
    <div style={{position: 'absolute', left: kx, top: ky + bob, transform: `translate(-50%, -50%) scale(${pop})`, transformOrigin: '10% 100%', width: 470}}>
      <Img src={staticFile('images/props/bubble-thought.png')} style={{width: 470, filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.28))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('images/props/book-tower.png')} style={{height: 235, clipPath: `inset(${(1 - p) * 100}% 0 0 0)`}} />
      </div>
    </div>
  );
};

// ---- Calm narration captions: one line at a time, soft fade, no shouting ----
export type CaptionLine = {text: string; from: number; to: number}; // seconds

export const NarrationCaptions: React.FC<{lines: CaptionLine[]; bottom?: number}> = ({lines, bottom = 84}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const line = lines.find((l) => t >= l.from - 0.25 && t <= l.to + 0.45);
  if (!line) return null;
  const o = interpolate(t, [line.from - 0.25, line.from + 0.25, line.to, line.to + 0.45], [0, 1, 1, 0], clampOpts);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: bottom, pointerEvents: 'none'}}>
      <div style={{opacity: o, transform: `translateY(${(1 - o) * 10}px)`, maxWidth: 1500, textAlign: 'center', fontFamily: BODY_FONT, fontWeight: 700, fontSize: 54, lineHeight: 1.25, color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)', padding: '10px 28px', borderRadius: 18, background: 'rgba(10,8,14,0.28)'}}>
        {line.text}
      </div>
    </AbsoluteFill>
  );
};

// ---- Title card ----
export const TitleCard: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [from, from + 36, to - 36, to], [0, 1, 1, 0], clampOpts);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 44, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, pointerEvents: 'none'}}>
      <div style={{fontFamily: HEAD_FONT, fontSize: 92, color: '#fff7e6', textShadow: `0 6px 0 ${INK}, 0 0 24px rgba(0,0,0,0.5)`, letterSpacing: 3}}>ONE SCROLLED, ONE READ.</div>
      <div style={{fontFamily: BODY_FONT, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#fff', marginTop: 8, textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>365 DAYS LATER</div>
    </AbsoluteFill>
  );
};

// ---- A calm timestamp that eases in, holds, and eases out: "2 AM", "DAY 5", "DAY 21" ----
export const TimeStamp: React.FC<{text: string; from: number; to: number; x?: number; y?: number; size?: number; color?: string}> = ({text, from, to, x = 960, y = 170, size = 150, color = '#fff7e6'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to + 14) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 12, stiffness: 110, mass: 0.9}});
  const o = interpolate(frame, [to, to + 14], [1, 0], clampOpts);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 1.4) * o, fontFamily: HEAD_FONT, fontSize: size, color, letterSpacing: 4, textShadow: `0 7px 0 ${INK}, 0 0 28px rgba(0,0,0,0.5)`, pointerEvents: 'none'}}>
      {text}
    </div>
  );
};
