import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SERIF, SERIF_I, UI, PAPER, INK, GOLD} from './theme';

export const ease = (x: number) => x * x * (3 - 2 * x);
export const ramp = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
export const bell = (d: number, w: number) => Math.max(0, 1 - Math.abs(d) / w);
export const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------------- on-screen words: a warm serif that fades up like a film title, on a soft dark plate so it reads over any picture ----------------
// big = the key phrase, centred, large capitals | quote = italic, lower third | sub = small capitals strip | tag = paper age tag, top-left | time = clock stamp
export type KW = {at: number; dur: number; text: string; style?: 'big' | 'quote' | 'sub' | 'tag' | 'time'; accent?: number; pos?: 'mid' | 'low' | 'top'};
const plate = 'radial-gradient(ellipse at center, rgba(20,12,8,.55) 0%, rgba(20,12,8,.32) 45%, rgba(20,12,8,0) 72%)';
const Words: React.FC<{w: KW; l: number}> = ({w, l}) => {
  const st = w.style ?? 'big';
  const fi = ramp(l, 0, 0.5), fo = 1 - ramp(l, w.dur - 0.45, w.dur), o = fi * fo;
  if (st === 'tag') {
    const k = ramp(l, 0, 0.4);
    return (
      <div style={{position: 'absolute', left: 86, top: 78, opacity: o, transform: `translateY(${(1 - k) * -24}px) rotate(-2.2deg)`, background: PAPER, padding: '16px 34px 14px', borderRadius: 6, boxShadow: '0 10px 28px rgba(0,0,0,.45)', border: `3px solid ${INK}`}}>
        <div style={{position: 'absolute', left: '50%', top: -16, width: 96, height: 30, marginLeft: -48, background: 'rgba(230,200,120,.8)', transform: 'rotate(2deg)'}} />
        <span style={{fontFamily: SERIF, fontWeight: 800, fontSize: 56, letterSpacing: 5, fontVariantNumeric: 'lining-nums', color: INK}}>{w.text}</span>
      </div>
    );
  }
  if (st === 'time') {
    return (
      <div style={{position: 'absolute', left: 0, right: 0, top: 86, display: 'flex', justifyContent: 'center', opacity: o}}>
        <span style={{fontFamily: UI, fontWeight: 700, fontSize: 40, letterSpacing: 14, color: '#fff6e6', textShadow: '0 3px 14px rgba(0,0,0,.8)', background: 'rgba(20,12,8,.42)', padding: '12px 34px', borderRadius: 4}}>{w.text}</span>
      </div>
    );
  }
  const low = st === 'quote' || st === 'sub' || w.pos === 'low', top = w.pos === 'top';
  const size = st === 'big' ? (w.text.length > 18 ? 104 : 136) : st === 'quote' ? 64 : 40;
  const words = w.text.split(' ');
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: top ? 'flex-start' : low ? 'flex-end' : 'center', paddingBottom: low ? 118 : 0, paddingTop: top ? 130 : 0, opacity: o, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: '50%', top: top ? 130 : low ? '82%' : '50%', width: 1500, height: size * 3, marginLeft: -750, marginTop: -size * 1.5, background: plate}} />
      <div style={{position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.28, transform: `translateY(${(1 - fi) * 22}px)`}}>
        {words.map((wd, i) => {
          const lw = ramp(l, i * 0.08, i * 0.08 + 0.45);
          return (
            <span key={i} style={{
              opacity: lw, transform: `translateY(${(1 - lw) * 18}px)`, color: i === w.accent ? GOLD : '#fff7e8', fontFamily: st === 'quote' ? SERIF_I : st === 'sub' ? UI : SERIF,
              fontVariantNumeric: 'lining-nums', fontWeight: st === 'sub' ? 700 : 800, fontStyle: st === 'quote' ? 'italic' : undefined, fontSize: size, letterSpacing: st === 'big' ? size * 0.04 : st === 'sub' ? 10 : 1,
              textShadow: `0 ${size * 0.04}px ${size * 0.16}px rgba(0,0,0,.85), 0 0 ${size * 0.5}px rgba(0,0,0,.5)`, WebkitTextStroke: st === 'quote' ? undefined : `${Math.max(2, size * 0.025)}px rgba(40,22,14,.8)`, paintOrder: 'stroke fill',
            } as React.CSSProperties}>{wd}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
export const KineticWords: React.FC<{t: number; words: KW[]}> = ({t, words}) => (
  <>{words.filter((w) => t >= w.at && t < w.at + w.dur).map((w, i) => <Words key={i} w={w} l={t - w.at} />)}</>
);

// ---------------- 30 YEARS EARLIER: paper scatters to off-white, the line fades in as ink ----------------
export const RewindCard: React.FC<{p: number; f: number}> = ({p, f}) => {
  const burst = 1 - Math.pow(1 - Math.min(1, p / 0.4), 3);
  return (
    <AbsoluteFill style={{background: '#f3ead6', overflow: 'hidden'}}>
      {Array.from({length: 40}, (_, i) => {
        const ang = rnd(i, 1) * Math.PI * 2, d = (0.12 + rnd(i, 2) * 0.6) * burst;
        return <div key={i} style={{position: 'absolute', left: 50 + Math.cos(ang) * d * 100 + '%', top: 50 + Math.sin(ang) * d * 100 + '%', width: 60 + rnd(i, 3) * 90, height: 40 + rnd(i, 4) * 70, background: i % 3 === 0 ? '#e2d3b0' : '#c9c2b0', opacity: 0.8 * (1 - p * 0.6), transform: `rotate(${rnd(i, 5) * 360 + burst * 80}deg)`, boxShadow: '0 4px 10px rgba(0,0,0,.2)'}} />;
      })}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 118, letterSpacing: 6, fontVariantNumeric: 'lining-nums', color: '#3a2a26', opacity: Math.min(1, f / 8), transform: `scale(${0.94 + 0.06 * Math.min(1, f / 12)})`}}>30 YEARS <span style={{color: '#b4592f'}}>EARLIER</span></div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// a white photo flash, used between ages
export const PhotoFlash: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill style={{opacity: o, background: 'radial-gradient(circle at 50% 50%, #fffdf6 0%, #fff6dc 55%, #ffe9b8 100%)'}} />
);

// dust motes in the light, warm
export const Dust: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
    {Array.from({length: 30}, (_, i) => {
      const x = (rnd(i, 1) * 100 + Math.sin(t * (0.2 + rnd(i, 2) * 0.3) + i) * 3 + 100) % 100, y = (((rnd(i, 3) * 100 - t * (2 + rnd(i, 4) * 3)) % 100) + 100) % 100, s = 2 + rnd(i, 5) * 4;
      return <div key={i} style={{position: 'absolute', left: x + '%', top: y + '%', width: s, height: s, borderRadius: '50%', background: '#fff2d2', opacity: 0.12 + rnd(i, 6) * 0.25, filter: 'blur(0.6px)'}} />;
    })}
  </AbsoluteFill>
);

export const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>\")";

// a big number that ticks (FRIDAY 1..12, SUNDAYS 1,300)
export const BigCount: React.FC<{label: string; n: number; o: number; x?: number; y?: number}> = ({label, n, o, x = 1500, y = 120}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: o, textAlign: 'right', transform: 'translateX(-100%)'}}>
    <div style={{fontFamily: UI, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#fff6e6', textShadow: '0 2px 10px rgba(0,0,0,.8)'}}>{label}</div>
    <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 150, lineHeight: 1, color: '#fff7e8', textShadow: '0 6px 24px rgba(0,0,0,.7)', WebkitTextStroke: '3px rgba(40,22,14,.8)', paintOrder: 'stroke fill'} as React.CSSProperties}>{n.toLocaleString('en-US')}</div>
  </div>
);
