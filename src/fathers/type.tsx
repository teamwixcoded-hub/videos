import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DIGI} from '../same2d/theme';
import {SERIF_I, UI, GOLD} from './theme';

// ============================================================================================
// Two Fathers typography. Motion-design reveals, readable over any picture:
//  pop     = the line sits in the lower third; every word rises out of an invisible mask (spring), tracking tightens, blur clears, the gold word gets an underline that draws itself
//  slam    = a hard truth: the line lands from a big scale with a colour-split that settles, a light streak crosses it
//  title   = centred, framed by two hairlines that open from the middle, words rise one by one, a soft light sweeps through
//  whisper = a spoken line: italic serif in the lower third, word by word with a gold quotation mark
//  Stamp   = a lower-left caption (kicker + label) on a bar that draws up, for places, people and facts
// ============================================================================================
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eo3 = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const eoExpo = (x: number) => (clamp(x) >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)));
const eoBack = (x: number) => { const k = clamp(x), c1 = 1.55, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (a: number, b: number, t: number) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };

export type TW = {at: number; dur: number; text: string; accent?: number; mode: 'pop' | 'slam' | 'title' | 'whisper'};
const GOLD2 = '#ffcf4a';
const STROKE = (size: number) => `${Math.max(2.5, size * 0.035)}px rgba(5,8,22,.92)`;

// one word inside its mask
const MaskWord: React.FC<{text: string; k: number; size: number; gold: boolean; track: [number, number]; underline: number; italic?: boolean; font: string; weight?: number}> = ({text, k, size, gold, track, underline, italic, font, weight = 700}) => {
  const rise = eoBack(k), tr = lerp(track[0], track[1], eo3(k));
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span style={{display: 'inline-block', overflow: 'hidden', padding: `${size * 0.14}px ${size * 0.05}px ${size * 0.2}px`, margin: `${-size * 0.14}px ${-size * 0.05}px ${-size * 0.2}px`, verticalAlign: 'bottom'}}>
        <span style={{
          display: 'inline-block', transform: `translateY(${(1 - rise) * 108}%)`, opacity: clamp(k * 3), filter: k < 1 ? `blur(${(1 - eo3(k)) * 9}px)` : undefined,
          fontFamily: font, fontWeight: weight, fontStyle: italic ? 'italic' : undefined, fontSize: size, letterSpacing: `${tr}em`, lineHeight: 1.05, color: gold ? GOLD2 : '#fff',
          WebkitTextStroke: italic ? undefined : STROKE(size), paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px ${size * 0.18}px rgba(0,0,0,.7)${gold ? `, 0 0 ${size * 0.4}px rgba(255,190,70,.45)` : ''}`,
        } as React.CSSProperties}>{text}</span>
      </span>
      {underline > 0 && <i style={{position: 'absolute', left: '2%', right: '2%', bottom: -size * 0.02, height: Math.max(5, size * 0.055), borderRadius: 4, background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})`, transformOrigin: 'left', transform: `scaleX(${eo3(underline)})`, boxShadow: '0 0 16px rgba(255,190,70,.7)'}} />}
    </span>
  );
};

export const Headline: React.FC<{w: TW; l: number}> = ({w, l}) => {
  const words = w.text.split(' '), n = words.length, mode = w.mode;
  const out = smooth(w.dur - 0.32, w.dur, l);
  const size = mode === 'slam' ? (w.text.length > 14 ? 150 : 178) : mode === 'title' ? (w.text.length > 20 ? 110 : 132) : (w.text.length > 24 ? 84 : w.text.length > 14 ? 100 : 118);
  const lower = mode === 'pop';
  const stag = mode === 'title' ? 0.11 : 0.085;
  // slam: scale and colour split settle together
  const sk = eoExpo(l / 0.2), split = mode === 'slam' ? Math.max(0, 1 - l / 0.32) : 0;
  const slamStyle: React.CSSProperties = mode === 'slam' ? {transform: `scale(${lerp(1.38, 1, sk)}) translateX(${split > 0 ? (Math.sin(l * 140) * 9 * split) : 0}px)`, opacity: clamp(l / 0.06), filter: split > 0 ? `drop-shadow(${-7 * split}px 0 0 rgba(255,50,90,.85)) drop-shadow(${7 * split}px 0 0 rgba(60,220,255,.85))` : undefined} : {};
  const exitStyle: React.CSSProperties = {opacity: 1 - out, transform: `translateY(${-out * 18}px)`, filter: out > 0 ? `blur(${out * 7}px)` : undefined};
  const sweep = mode === 'title' ? smooth(0.45, 1.5, l) : 0;
  const line = (side: number) => <div style={{position: 'absolute', left: '50%', width: 1100, marginLeft: -550, [side < 0 ? 'top' : 'bottom']: -size * 0.3, height: 3, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)', transform: `scaleX(${eo3((l - 0.05) / 0.6)})`, opacity: 0.9 - out}} />;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: lower ? 'flex-end' : 'center', paddingBottom: lower ? 120 : 0, pointerEvents: 'none'}}>
      {/* a soft dark scrim, a low band for lower-third lines and a pool for centred ones */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: lower ? 0 : undefined, top: lower ? undefined : '50%', height: lower ? 360 : size * 3.4, marginTop: lower ? 0 : -size * 1.7, background: lower ? 'linear-gradient(0deg, rgba(3,6,18,.7), rgba(3,6,18,0))' : 'radial-gradient(ellipse at center, rgba(3,6,18,.62) 0%, rgba(3,6,18,.34) 50%, rgba(3,6,18,0) 76%)', opacity: smooth(0, 0.3, l) * (1 - out)}} />
      <div style={{position: 'relative', maxWidth: 1700, padding: `${size * 0.1}px ${size * 0.4}px`, ...slamStyle, ...exitStyle}}>
        {mode === 'title' && <>{line(-1)}{line(1)}</>}
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.28, rowGap: size * 0.04}}>
          {words.map((wd, i) => {
            const d0 = mode === 'slam' ? 0 : i * stag, k = mode === 'slam' ? 1 : clamp((l - d0) / 0.62);
            const gold = w.accent === i;
            return <MaskWord key={i} text={wd} k={k} size={size} gold={gold} track={mode === 'slam' ? [0.05, 0.05] : [0.22, 0.045]} underline={gold ? (l - d0 - 0.45) / 0.5 : 0} font={DIGI} />;
          })}
        </div>
        {mode === 'title' && sweep > 0 && sweep < 1 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${lerp(-10, 105, sweep)}%`, width: 120, transform: 'skewX(-18deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.28), rgba(255,255,255,0))', mixBlendMode: 'overlay'}} />}
        {mode === 'slam' && <div style={{position: 'absolute', left: '-6%', right: '-6%', top: '50%', height: 5, marginTop: -2, background: 'linear-gradient(90deg, transparent, rgba(150,210,255,.95), #fff, rgba(150,210,255,.95), transparent)', filter: 'blur(4px)', opacity: Math.max(0, 1 - l / 0.45), transform: `scaleX(${lerp(0.3, 1.1, eoExpo(l / 0.4))})`}} />}
      </div>
    </AbsoluteFill>
  );
};

// a spoken line: italic serif, lower third, word by word, with a gold opening quote
export const Quote: React.FC<{w: TW; l: number}> = ({w, l}) => {
  const words = w.text.replace(/[“”"]/g, '').split(' '), out = smooth(w.dur - 0.4, w.dur, l), size = w.text.length > 44 ? 54 : 64;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 340, background: 'linear-gradient(0deg, rgba(3,6,18,.85), rgba(3,6,18,0))', opacity: smooth(0, 0.4, l) * (1 - out)}} />
      <div style={{position: 'relative', maxWidth: 1500, textAlign: 'center', opacity: 1 - out, transform: `translateY(${-out * 12}px)`, filter: out > 0 ? `blur(${out * 6}px)` : undefined}}>
        <div style={{position: 'absolute', left: -size * 1.3, top: -size * 0.9, fontFamily: SERIF_I, fontSize: size * 3.4, lineHeight: 1, color: GOLD2, opacity: 0.85 * eo3(l / 0.5), transform: `scale(${lerp(1.5, 1, eo3(l / 0.5))})`, textShadow: '0 0 30px rgba(255,190,70,.4)'}}>“</div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26}}>
          {words.map((wd, i) => {
            const k = clamp((l - 0.15 - i * 0.075) / 0.5);
            return <span key={i} style={{display: 'inline-block', fontFamily: SERIF_I, fontStyle: 'italic', fontWeight: 500, fontSize: size, lineHeight: 1.2, color: '#fff7e8', opacity: eo3(k), transform: `translateY(${(1 - eo3(k)) * 22}px)`, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined, textShadow: '0 3px 18px rgba(0,0,0,.85)'}}>{wd}</span>;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TypeLayer: React.FC<{t: number; words: TW[]}> = ({t, words}) => {
  const w = words.find((x) => t >= x.at && t < x.at + x.dur);
  if (!w) return null;
  const l = t - w.at;
  return w.mode === 'whisper' ? <Quote w={w} l={l} /> : <Headline w={w} l={l} />;
};

// ---- a lower-left caption: a place, a person, a fact ----
export type StampT = {at: number; dur: number; kicker: string; label: string};
export const Stamp: React.FC<{t: number; s: StampT}> = ({t, s}) => {
  const l = t - s.at;
  if (l < 0 || l > s.dur) return null;
  const out = smooth(s.dur - 0.35, s.dur, l), bar = eo3(l / 0.35), a = eo3((l - 0.12) / 0.55), b = eo3((l - 0.26) / 0.55);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, bottom: 0, width: 1100, height: 330, background: 'linear-gradient(90deg, rgba(3,6,18,.66), rgba(3,6,18,0))', opacity: smooth(0, 0.3, l) * (1 - out)}} />
      <div style={{position: 'absolute', left: 96, bottom: 104, display: 'flex', alignItems: 'stretch', gap: 26, opacity: 1 - out, transform: `translateX(${-out * 40}px)`}}>
        <div style={{width: 8, borderRadius: 4, background: `linear-gradient(180deg, ${GOLD2}, ${GOLD})`, transformOrigin: 'bottom', transform: `scaleY(${bar})`, boxShadow: '0 0 18px rgba(255,190,70,.6)'}} />
        <div>
          <div style={{overflow: 'hidden', padding: '4px 0'}}><div style={{fontFamily: DIGI, fontWeight: 700, fontSize: 30, letterSpacing: '0.3em', color: GOLD2, transform: `translateY(${(1 - a) * 110}%)`, opacity: a, textShadow: '0 2px 10px rgba(0,0,0,.8)'}}>{s.kicker}</div></div>
          <div style={{overflow: 'hidden', padding: '2px 0 8px'}}><div style={{fontFamily: UI, fontWeight: 700, fontSize: 62, letterSpacing: '0.02em', color: '#fff', transform: `translateY(${(1 - b) * 110}%)`, opacity: b, WebkitTextStroke: STROKE(62), paintOrder: 'stroke fill', textShadow: '0 4px 20px rgba(0,0,0,.7)'} as React.CSSProperties}>{s.label}</div></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
