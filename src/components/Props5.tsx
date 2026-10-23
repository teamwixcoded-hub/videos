import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_FONT, HEAD_FONT} from '../fonts';
import {clamp01, easeInOut} from '../easing';
import {Snd} from './Type';

const INK = '#2a1713';
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---- S08: the phone he searches on. The search box types a query, then results scroll. ----
const THUMBS: [string, string][] = [['#ff8a5c', '#ffd23f'], ['#6ee7ff', '#7a6bff'], ['#7bf5b0', '#2bb3a3'], ['#c08cff', '#ff7ac8'], ['#ffb86b', '#ff6b6b']];
const TITLES = [150, 120, 170, 135, 160, 110];

export const PhoneSearch: React.FC<{query: string; from: number; to: number; typeStart?: number; x?: number; y?: number; w?: number}> = ({query, from, to, typeStart = 24, x = 1480, y = 540, w = 330}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to + 14) return null;
  const f = frame - from;
  const enter = spring({frame: f, fps, config: {damping: 16, stiffness: 70}});
  const leave = interpolate(frame, [to, to + 14], [1, 0], clampOpts);
  const chars = Math.max(0, Math.min(query.length, Math.floor(((f - typeStart) / fps) * 11)));
  const caret = Math.floor(f / 14) % 2 === 0 ? '|' : '';
  const scroll = interpolate(f, [typeStart + query.length * 3 + 24, typeStart + query.length * 3 + 24 + 240], [0, 520], clampOpts);
  const showResults = chars >= query.length;
  const h = w * 2;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: enter * leave, transform: `translateY(${(1 - enter) * 70}px) rotate(2deg)`}}>
      <div style={{position: 'absolute', inset: -24, borderRadius: 70, background: 'radial-gradient(circle, rgba(110,170,255,0.45), transparent 70%)', filter: 'blur(14px)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 52, background: '#1a1c28', border: `8px solid ${INK}`, boxShadow: '0 24px 50px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 14, right: 14, top: 14, bottom: 14, borderRadius: 38, overflow: 'hidden', background: '#f4f1ea'}}>
          <div style={{margin: 16, padding: '12px 16px', borderRadius: 30, background: '#fff', border: '3px solid #d8d2c6', fontFamily: BODY_FONT, fontWeight: 700, fontSize: 22, color: '#2a2530', minHeight: 30, whiteSpace: 'nowrap', overflow: 'hidden'}}>
            {query.slice(0, chars)}
            <span style={{color: '#7a6bff'}}>{caret}</span>
          </div>
          {showResults && (
            <div style={{transform: `translateY(${-scroll}px)`}}>
              {Array.from({length: 7}).map((_, i) => (
                <div key={i} style={{margin: '0 16px 18px'}}>
                  <div style={{height: 150, borderRadius: 16, background: `linear-gradient(150deg, ${THUMBS[i % 5][0]}, ${THUMBS[i % 5][1]})`, position: 'relative'}}>
                    <div style={{position: 'absolute', left: '50%', top: '50%', width: 52, height: 52, marginLeft: -26, marginTop: -26, borderRadius: 26, background: 'rgba(255,255,255,0.92)'}}>
                      <div style={{position: 'absolute', left: 21, top: 14, width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '19px solid #2a2530'}} />
                    </div>
                  </div>
                  <div style={{height: 14, width: TITLES[i % 6], borderRadius: 7, background: '#3b3544', marginTop: 10}} />
                  <div style={{height: 10, width: 80, borderRadius: 5, background: '#b9b2a5', marginTop: 8}} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- S07: a wall-calendar page that flips through the days, one per flip ----
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const CalendarFlip: React.FC<{from: number; flips: number[]; startDay?: number; x?: number; y?: number; w?: number; hide?: number}> = ({from, flips, startDay = 1, x = 220, y = 300, w = 240, hide}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || (hide !== undefined && frame > hide + 14)) return null;
  const enter = spring({frame: frame - from, fps, config: {damping: 16, stiffness: 80}});
  const leave = hide === undefined ? 1 : interpolate(frame, [hide, hide + 14], [1, 0], clampOpts);
  const done = flips.filter((f) => frame >= f).length;
  const last = flips[done - 1];
  const t = last === undefined ? 1 : clamp01((frame - last) / 10);
  const h = w * 1.15;
  const page = (n: number, rot: number, z: number) => (
    <div style={{position: 'absolute', inset: 0, borderRadius: 12, background: '#fbf8f1', border: `5px solid ${INK}`, transformOrigin: '50% 0%', transform: `rotateX(${rot}deg)`, backfaceVisibility: 'hidden', zIndex: z, textAlign: 'center', overflow: 'hidden'}}>
      <div style={{background: '#d9453b', height: 64, borderBottom: `5px solid ${INK}`, fontFamily: BODY_FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: '#fff', lineHeight: '64px'}}>{MONTHS[Math.floor((startDay + n) / 30) % 12]}</div>
      <div style={{fontFamily: HEAD_FONT, fontSize: w * 0.5, color: INK, lineHeight: 1.15, marginTop: 12}}>{((startDay + n) % 30) + 1}</div>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: enter * leave, perspective: 900, transform: `translateY(${(1 - enter) * -60}px) rotate(-3deg)`, filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.4))'}}>
      {page(done + 1, 0, 1)}
      {page(done, -easeInOut(t) * 165, 2)}
    </div>
  );
};

// ---- S10: big counters that tick up ("20+ BOOKS", "1,000+ HOURS") ----
export const BigCounter: React.FC<{from: number; hide?: number; label: string; to: number; suffix?: string; x: number; y: number; color?: string; duration?: number; size?: number}> = ({from, hide, label, to, suffix = '+', x, y, color = '#fff7e6', duration = 70, size = 150}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || (hide !== undefined && frame > hide + 14)) return null;
  const gone = hide === undefined ? 1 : interpolate(frame, [hide, hide + 14], [1, 0], clampOpts);
  const f = frame - from;
  const pop = spring({frame: f, fps, config: {damping: 14, stiffness: 100}});
  const v = Math.round(interpolate(f, [8, 8 + duration], [0, to], {...clampOpts, easing: (t) => 1 - Math.pow(1 - t, 3)}));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * pop})`, opacity: Math.min(1, pop * 1.5) * gone, textAlign: 'center'}}>
      <Snd file="pop_a" at={from} vol={0.24} frames={12} />
      <Snd file="riser" at={from + 4} vol={0.14} frames={Math.min(duration + 6, 60)} rate={1.3} />
      <Snd file="meter" at={from + 8 + duration} vol={0.26} frames={16} />
      <div style={{fontFamily: HEAD_FONT, fontSize: size, color, lineHeight: 1, textShadow: `0 8px 0 ${INK}, 0 0 28px rgba(0,0,0,0.5)`}}>
        {v.toLocaleString('en-US')}
        {v >= to ? suffix : ''}
      </div>
      <div style={{fontFamily: BODY_FONT, fontWeight: 800, fontSize: size * 0.3, letterSpacing: 8, color, marginTop: 8, textShadow: '0 3px 12px rgba(0,0,0,0.7)'}}>{label}</div>
    </div>
  );
};

// ---- A framed photo that slides in (S11: the post he sees on his phone) ----
export const PhotoCard: React.FC<{src: string; from: number; to: number; x?: number; y?: number; w?: number}> = ({src, from, to, x = 960, y = 540, w = 460}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to + 14) return null;
  const enter = spring({frame: frame - from, fps, config: {damping: 15, stiffness: 80}});
  const leave = interpolate(frame, [to, to + 14], [1, 0], clampOpts);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, opacity: enter * leave, transform: `scale(${0.85 + 0.15 * enter}) rotate(${-4 + 3 * enter}deg)`, filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.5))'}}>
      <Snd file="whoosh" at={from} vol={0.2} frames={24} />
      <Snd file="pop_b" at={from + 12} vol={0.24} frames={14} />
      <div style={{position: 'absolute', inset: 0, background: '#fff', border: `7px solid ${INK}`, borderRadius: 18, padding: 16, paddingBottom: 56}}>
        <Img src={staticFile(`images/${src}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8}} />
      </div>
    </div>
  );
};
