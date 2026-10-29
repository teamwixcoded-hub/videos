import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MONT, DIGI, MONO, FPS} from './theme';

const ease = (x: number) => x * x * (3 - 2 * x);
export const ramp = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export const bell = (d: number, w: number) => Math.max(0, 1 - Math.abs(d) / w);

// ---- digital cinematic type (built to be READ first) ------------------------------------------------------------------------------------
// Four voices in a technical display face. Letters are solid and bright with a dark outline, and every line sits on a soft dark plate, so it
// stays readable over any picture:
//  pop = every letter pops in with a quick flash, one after another
//  slam = GLITCH: lands huge with an RGB split and a few frames of jitter, a trailer impact
//  whisper = TYPING: a terminal types it out letter by letter with a blinking block cursor
//  title = HUD: corner brackets draw in, a scan line sweeps the word, big decoded letters
// One word per line can be gold.
export type TextMode = 'pop' | 'slam' | 'whisper' | 'title';
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutBack = (x: number) => { const k = clamp01(x), c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const GLYPHS = '01#$%&*+<>/|=?!XYZ';
const rh = (i: number, f: number) => { const x = Math.sin(i * 12.9898 + f * 78.233) * 43758.5453; return x - Math.floor(x); };

export const AnimText: React.FC<{text: string; f: number; size: number; accent?: number[]; mode?: TextMode; out?: number; tint?: string}> = ({text, f, size, accent = [], mode = 'pop', out = 0, tint = '#ffffff'}) => {
  const typing = mode === 'whisper';
  const lock = mode === 'slam' ? 5 : mode === 'title' ? 13 : 9;
  const gap = mode === 'slam' ? 1.0 : 1.7;
  const total = text.replace(/ /g, '').length;
  const glitch = mode === 'slam' ? Math.max(0, 1 - f / 16) : 0;
  const flick = out > 0 && rh(7, Math.floor(f)) > 0.55 ? 0.35 : 1;
  const stroke = `${Math.max(3, size * 0.05)}px rgba(4,8,24,.92)`;
  let li = 0;
  const filt = glitch > 0 ? `drop-shadow(${-6 * glitch}px 0 0 rgba(255,40,90,.9)) drop-shadow(${6 * glitch}px 0 0 rgba(40,220,255,.9))` : undefined;
  const body = (
    <div style={{position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: size * 0.3, filter: filt, fontFamily: typing ? MONO : DIGI, fontWeight: 700, fontSize: size, letterSpacing: typing ? size * 0.02 : size * 0.05, lineHeight: 1.1, opacity: (1 - out) * flick, transform: `translateX(${glitch ? (rh(3, Math.floor(f)) - 0.5) * 22 * glitch : 0}px) scale(${1 + out * 0.08})`}}>
      {text.split(' ').map((w, wi) => {
        const isAcc = accent.includes(wi);
        return (
          <span key={wi} style={{display: 'inline-flex'}}>
            {w.split('').map((ch, ci) => {
              const i = li++;
              const fl = f - (typing ? i * 2 : i * gap);
              if (fl < 0) return <span key={ci} style={{display: 'inline-block', opacity: 0}}>{ch}</span>;
              const scr = false;   // no symbol scrambling: letters just appear, clean
              const shown = scr ? GLYPHS[Math.floor(rh(i, Math.floor(f)) * GLYPHS.length)] : ch;
              const flash = typing ? 0 : Math.sin(Math.PI * clamp01((fl - 2) / 10)) * 0.7;
              const pulse = typing ? 1 : fl < 8 ? 1 + (1 - fl / 8) * 0.22 : 1;
              const col = scr ? '#7fe9ff' : isAcc ? '#ffd24a' : tint;
              return (
                <span key={ci} style={{
                  display: 'inline-block', color: col, opacity: typing ? 1 : clamp01(fl / 4), transform: `scale(${pulse})`, filter: flash > 0 ? `brightness(${1 + flash})` : undefined,
                  WebkitTextStroke: stroke, paintOrder: 'stroke fill',
                  textShadow: `0 ${size * 0.05}px ${size * 0.1}px rgba(0,0,0,.75), 0 0 ${size * 0.28}px ${isAcc ? 'rgba(255,201,77,.6)' : 'rgba(110,220,255,.55)'}`,
                } as React.CSSProperties}>{shown}</span>
              );
            })}
          </span>
        );
      })}
      {typing && <span style={{display: 'inline-block', width: size * 0.5, height: size * 0.82, marginLeft: size * 0.04, background: '#7fe9ff', border: '3px solid rgba(4,8,24,.9)', opacity: f / 2 < total || Math.floor(f / 7) % 2 === 0 ? 0.95 : 0, boxShadow: '0 0 18px #7fe9ff'}} />}
    </div>
  );
  // the plate: a soft dark glow behind the line so the letters never fight the picture
  const plate = <div style={{position: 'absolute', left: -size * 0.8, right: -size * 0.8, top: -size * 0.45, bottom: -size * 0.45, background: 'radial-gradient(ellipse at center, rgba(3,8,24,.78) 0%, rgba(3,8,24,.55) 45%, rgba(3,8,24,0) 74%)', filter: 'blur(8px)', opacity: clamp01(f / 6) * (1 - out)}} />;
  if (mode !== 'title') return <div style={{position: 'relative'}}>{plate}{body}</div>;
  const pb = clamp01(f / 12), br = (k: number) => ({position: 'absolute' as const, width: 56 * pb, height: 56 * pb, borderColor: '#7fe9ff', borderStyle: 'solid', borderWidth: 0, filter: 'drop-shadow(0 0 10px #7fe9ff)', ...(k === 0 ? {left: 0, top: 0, borderLeftWidth: 6, borderTopWidth: 6} : k === 1 ? {right: 0, top: 0, borderRightWidth: 6, borderTopWidth: 6} : k === 2 ? {left: 0, bottom: 0, borderLeftWidth: 6, borderBottomWidth: 6} : {right: 0, bottom: 0, borderRightWidth: 6, borderBottomWidth: 6})});
  return (
    <div style={{position: 'relative', padding: `${size * 0.32}px ${size * 0.55}px`, opacity: 1 - out}}>
      {plate}
      {[0, 1, 2, 3].map((k) => <div key={k} style={br(k)} />)}
      {body}
      <div style={{position: 'absolute', top: 0, bottom: 0, left: `${lerp(-4, 104, clamp01((f - 6) / 34))}%`, width: 10, background: 'linear-gradient(90deg, rgba(160,240,255,0), rgba(160,240,255,.9), rgba(160,240,255,0))', filter: 'blur(2px)', opacity: f > 6 && f < 42 ? 1 : 0}} />
    </div>
  );
};

export type KW = {at: number; dur: number; text: string; accent?: number; big?: boolean; mode?: TextMode};
// the voice of each key word: the hard truths slam, the quiet ones whisper
const MODE_BY_TEXT: Record<string, TextMode> = {
  'ONE HABIT.': 'title', 'TONIGHT?': 'title', 'ONE NIGHT AT A TIME.': 'title',
  'ONE SMALL CHOICE.': 'slam', 'TWO LIVES.': 'slam', 'THE BILL COMES LATER.': 'slam', 'THE FINAL BILL.': 'slam', 'CHANGED NOTHING.': 'slam', 'FACE DOWN.': 'slam', 'INSTANTLY.': 'slam', 'TEN PAGES.': 'slam', 'WHICH ONE?': 'slam', 'OKAY. TEN PAGES.': 'slam',
  'SAME MAN.': 'whisper', 'SAME ROOM.': 'whisper', 'A PATTERN.': 'whisper', 'BLUR.': 'whisper', 'A CALMER FACE.': 'whisper', 'SOMETHING FEELS OFF.': 'whisper',
};
export const KineticWord: React.FC<{t: number; words: KW[]}> = ({t, words}) => {
  const w = words.find((x) => t >= x.at && t < x.at + x.dur);
  if (!w) return null;
  const f = (t - w.at) * FPS, mode = w.mode ?? MODE_BY_TEXT[w.text] ?? 'pop';
  const out = ramp(t, w.at + w.dur - 0.22, w.at + w.dur);
  const centre = !!w.big || mode === 'title';
  const flare = mode === 'slam' || mode === 'title' ? Math.max(0, 1 - f / 14) : 0;
  const size = w.big ? 156 : mode === 'title' ? 136 : 112;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: centre ? 'center' : 'flex-start', paddingTop: centre ? 0 : 84, pointerEvents: 'none'}}>
      {flare > 0 && <div style={{position: 'absolute', top: centre ? '50%' : 150, left: '8%', right: '8%', height: 6, marginTop: -3, background: 'linear-gradient(90deg, transparent, rgba(150,200,255,.95), #fff, rgba(150,200,255,.95), transparent)', filter: 'blur(5px)', opacity: flare, transform: `scaleX(${0.4 + 0.8 * (1 - flare)})`}} />}
      <div style={{maxWidth: 1700}}><AnimText text={w.text} f={f} size={size} accent={w.accent !== undefined ? [w.accent] : []} mode={mode} out={out} /></div>
    </AbsoluteFill>
  );
};

export const IconTag: React.FC<{t: number; from: number; to: number; text: string; icon: 'moon' | 'sun' | 'clock' | 'bus' | 'cup'; color?: string; top?: number}> = ({t, from, to, text, icon, color = '#fff', top = 64}) => {
  const o = Math.min(ramp(t, from, from + 0.3), 1 - ramp(t, to - 0.3, to));
  if (o <= 0) return null;
  const ic = {
    moon: <path d="M30 6a16 16 0 1 0 12 26A13 13 0 0 1 30 6z" fill={color} />,
    sun: <g fill={color}><circle cx="24" cy="24" r="10" />{Array.from({length: 8}, (_, i) => <rect key={i} x="22.5" y="2" width="3" height="8" rx="1.5" transform={`rotate(${i * 45} 24 24)`} />)}</g>,
    clock: <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"><circle cx="24" cy="24" r="17" /><path d="M24 14v10l7 4" /></g>,
    bus: <g fill={color}><rect x="6" y="8" width="36" height="28" rx="6" /><rect x="11" y="13" width="26" height="10" rx="2" fill="#0b0e22" /><circle cx="15" cy="40" r="4" /><circle cx="33" cy="40" r="4" /></g>,
    cup: <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"><path d="M10 16h24v14a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10z" /><path d="M34 20h4a5 5 0 0 1 0 10h-4" /></g>,
  }[icon];
  return (
    <div style={{position: 'absolute', top: top - (1 - o) * 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: Math.min(1, o * 1.4)}}>
      <svg width="54" height="54" viewBox="0 0 48 48" style={{filter: `drop-shadow(0 0 14px ${color})`, transform: `scale(${0.6 + 0.4 * o}) rotate(${(1 - o) * -40}deg)`}}>{ic}</svg>
      <AnimText text={text} f={(t - from) * FPS} size={64} mode="pop" tint={color} />
    </div>
  );
};

// the film look: teal in the shadows, orange in the highlights, a slow warm light leak
export const Cinema: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,60,95,.22) 0%, rgba(0,0,0,0) 45%, rgba(255,120,40,.14) 100%)', mixBlendMode: 'soft-light'}} />
    <div style={{position: 'absolute', left: -260 + Math.sin(t * 0.3) * 70, top: -120, width: 720, height: 1300, background: 'linear-gradient(90deg, rgba(255,150,60,0), rgba(255,140,60,.2), rgba(255,60,90,0))', mixBlendMode: 'screen', filter: 'blur(44px)', transform: 'rotate(12deg)', opacity: 0.55 + Math.sin(t * 0.7) * 0.2}} />
    <div style={{position: 'absolute', right: -300 + Math.cos(t * 0.25) * 60, top: -140, width: 600, height: 1300, background: 'linear-gradient(90deg, rgba(80,160,255,0), rgba(90,150,255,.14), rgba(80,160,255,0))', mixBlendMode: 'screen', filter: 'blur(50px)', transform: 'rotate(-14deg)', opacity: 0.5}} />
  </AbsoluteFill>
);

// ---- the rewind card: paper scatters to off-white ----
export const RewindCard: React.FC<{p: number; f: number}> = ({p, f}) => {
  const burst = 1 - Math.pow(1 - Math.min(1, p / 0.4), 3);
  return (
    <AbsoluteFill style={{background: '#f3efe4', overflow: 'hidden'}}>
      {Array.from({length: 46}, (_, i) => {
        const ang = rnd(i, 1) * Math.PI * 2, d = (0.15 + rnd(i, 2) * 0.55) * burst;
        return <div key={i} style={{position: 'absolute', left: 50 + Math.cos(ang) * d * 95 + '%', top: 50 + Math.sin(ang) * d * 95 + '%', width: 20 + rnd(i, 3) * 38, height: 12 + rnd(i, 4) * 24, background: i % 4 === 0 ? '#cdbf9f' : '#a8a8b3', opacity: 0.7, transform: `rotate(${rnd(i, 5) * 360 + p * (80 + rnd(i, 6) * 160)}deg)`}} />;
      })}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: MONT, fontWeight: 800, fontSize: 112, letterSpacing: 4, color: '#2a2a35', transform: `scale(${0.85 + 0.15 * Math.min(1, f / 7)})`, opacity: Math.min(1, f / 4)}}>ONE YEAR <span style={{color: '#d98f1f'}}>EARLIER</span></div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SpeedLines: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill style={{opacity: o, background: 'repeating-conic-gradient(from 0deg at 50% 50%, #15151c 0deg 1.2deg, transparent 1.2deg 7deg)', WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 14%, #000 60%)', maskImage: 'radial-gradient(circle at 50% 50%, transparent 14%, #000 60%)'}} />
);

// streaks of light fly across the cut and carry one shot into the next
export const Bridge: React.FC<{t: number; at: number}> = ({t, at}) => {
  if (t < at - 0.25 || t > at + 0.45) return null;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {Array.from({length: 22}, (_, i) => {
        const p = (t - (at - 0.25) - rnd(i, 1) * 0.15) / 0.5;
        if (p < 0 || p > 1) return null;
        return <div key={i} style={{position: 'absolute', left: -5 + p * 112 + '%', top: 8 + rnd(i, 2) * 84 + '%', width: 10 + rnd(i, 3) * 46, height: 4 + rnd(i, 4) * 7, borderRadius: 4, background: rnd(i, 5) > 0.5 ? '#f2d9a8' : '#bcd6ff', opacity: 0.85 * Math.sin(p * Math.PI), boxShadow: '0 0 14px rgba(255,255,255,.7)'}} />;
      })}
    </AbsoluteFill>
  );
};

// dust in every shot, soft light shafts, vignette
export const Dust: React.FC<{t: number; dense?: boolean}> = ({t, dense}) => (
  <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
    {Array.from({length: dense ? 54 : 38}, (_, i) => {
      const x = ((rnd(i, 1) * 110 + Math.sin(t * 0.5 + i) * 1.5 + t * (0.4 + rnd(i, 7))) % 110) - 5;
      const y = ((((rnd(i, 2) * 115 - t * (1.2 + rnd(i, 3) * 3)) % 115) + 115) % 115) - 7;
      const r = 2 + rnd(i, 4) * 5;
      return <div key={i} style={{position: 'absolute', left: x + '%', top: y + '%', width: r * 2, height: r * 2, borderRadius: '50%', background: '#fff', opacity: 0.12 + rnd(i, 5) * 0.3, filter: `blur(${rnd(i, 6) > 0.7 ? 3 : 0.6}px)`}} />;
    })}
  </AbsoluteFill>
);
export const Shafts: React.FC<{t: number; warm: boolean}> = ({t, warm}) => (
  <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none', opacity: 0.5}}>
    {[0, 1].map((i) => (
      <div key={i} style={{position: 'absolute', top: '-20%', left: 22 + i * 38 + '%', width: '16%', height: '150%', transform: `rotate(${-24 + Math.sin(t * 0.25 + i) * 2}deg)`, background: `linear-gradient(180deg, ${warm ? 'rgba(255,190,110,.16)' : 'rgba(150,185,255,.14)'}, rgba(0,0,0,0) 80%)`, filter: 'blur(26px)'}} />
    ))}
  </AbsoluteFill>
);

export const BigCounter: React.FC<{n: number; o: number; label: string}> = ({n, o, label}) => (
  <div style={{position: 'absolute', right: 170, top: 110, opacity: o, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: MONT, fontWeight: 800, color: '#ffc94d', textShadow: '0 0 28px rgba(255,201,77,.45), 0 6px 18px rgba(0,0,0,.6)'}}>
    <svg width="64" height="64" viewBox="0 0 48 48"><path d="M6 10c6-3 12-3 18 1 6-4 12-4 18-1v28c-6-3-12-3-18 1-6-4-12-4-18-1z" fill="none" stroke="#ffc94d" strokeWidth="3.5" strokeLinejoin="round" /><path d="M24 11v28" stroke="#ffc94d" strokeWidth="3.5" /></svg>
    <div style={{fontSize: 170, lineHeight: 1}}>{n}</div>
    <div style={{fontSize: 44, letterSpacing: 8}}>{label}</div>
  </div>
);

export const Bubble: React.FC<{t: number; from: number; to: number; text: string; x: number; y: number}> = ({t, from, to, text, x, y}) => {
  const o = Math.min(ramp(t, from, from + 0.2), 1 - ramp(t, to - 0.2, to));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${0.9 + 0.1 * o})`, background: '#fff', color: '#1d1a2e', fontFamily: MONT, fontWeight: 800, fontSize: 50, padding: '18px 34px', borderRadius: 40, boxShadow: '0 10px 30px rgba(0,0,0,.4)', border: '6px solid #1d1a2e'}}>{text}</div>
  );
};

// ---- whose day is it? the same day number appears for both men, so every tag says which life it belongs to ----
export type Who = 'scroller' | 'reader' | 'both';
const WHO = {
  scroller: {label: 'THE SCROLLER', c1: '#ff5a6e', c2: '#c0243a', glow: 'rgba(255,90,110,.65)'},
  reader: {label: 'THE READER', c1: '#3ddc84', c2: '#1f9a58', glow: 'rgba(61,220,132,.65)'},
};
const PillIcon: React.FC<{who: 'scroller' | 'reader'}> = ({who}) => (
  <svg width="38" height="38" viewBox="0 0 48 48">
    {who === 'scroller'
      ? <g><rect x="14" y="4" width="20" height="40" rx="5" fill="none" stroke="#fff" strokeWidth="4" /><rect x="19" y="36" width="10" height="3" rx="1.5" fill="#fff" /></g>
      : <g fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round"><path d="M6 10c6-3 12-3 18 1 6-4 12-4 18-1v28c-6-3-12-3-18 1-6-4-12-4-18-1z" /><path d="M24 11v28" /></g>}
  </svg>
);
export const WhoPill: React.FC<{who: 'scroller' | 'reader'; f: number; out?: number; size?: number}> = ({who, f, out = 0, size = 34}) => {
  const w = WHO[who], p = clamp01(f / 10), e = easeOutBack(p);
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 28px 10px 18px', borderRadius: 999, background: `linear-gradient(180deg, ${w.c1}, ${w.c2})`, border: '4px solid #fff', boxShadow: `0 0 34px ${w.glow}, 0 8px 22px rgba(0,0,0,.5)`, transform: `translateX(${(who === 'scroller' ? -1 : 1) * (1 - e) * 140}px) scale(${0.6 + 0.4 * e})`, opacity: p * (1 - out), fontFamily: DIGI, fontWeight: 700, fontSize: size, letterSpacing: 3, color: '#fff', whiteSpace: 'nowrap'}}>
      <PillIcon who={who} />{w.label}
    </div>
  );
};
export const WhoTag: React.FC<{t: number; from: number; to: number; text: string; who: Who; icon?: 'moon' | 'sun' | 'clock' | 'bus' | 'cup'; color?: string; top?: number}> = ({t, from, to, text, who, icon = 'moon', color = '#fff', top = 54}) => {
  const o = Math.min(ramp(t, from, from + 0.25), 1 - ramp(t, to - 0.3, to));
  if (o <= 0) return null;
  const f = (t - from) * FPS, out = 1 - Math.min(1, o * 1.4);
  const ic = {
    moon: <path d="M30 6a16 16 0 1 0 12 26A13 13 0 0 1 30 6z" fill={color} />,
    sun: <g fill={color}><circle cx="24" cy="24" r="10" />{Array.from({length: 8}, (_, i) => <rect key={i} x="22.5" y="2" width="3" height="8" rx="1.5" transform={`rotate(${i * 45} 24 24)`} />)}</g>,
    clock: <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"><circle cx="24" cy="24" r="17" /><path d="M24 14v10l7 4" /></g>,
    bus: <g fill={color}><rect x="6" y="8" width="36" height="28" rx="6" /><rect x="11" y="13" width="26" height="10" rx="2" fill="#0b0e22" /><circle cx="15" cy="40" r="4" /><circle cx="33" cy="40" r="4" /></g>,
    cup: <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"><path d="M10 16h24v14a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10z" /><path d="M34 20h4a5 5 0 0 1 0 10h-4" /></g>,
  }[icon];
  return (
    <div style={{position: 'absolute', top: top - (1 - o) * 14, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, o * 1.4)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <svg width="60" height="60" viewBox="0 0 48 48" style={{filter: `drop-shadow(0 0 14px ${color})`, transform: `scale(${0.6 + 0.4 * o}) rotate(${(1 - o) * -40}deg)`}}>{ic}</svg>
        <AnimText text={text} f={f} size={82} mode="pop" tint={color} />
      </div>
      <div style={{display: 'flex', gap: 22}}>
        {(who === 'scroller' || who === 'both') && <WhoPill who="scroller" f={f - 6} out={out} />}
        {(who === 'reader' || who === 'both') && <WhoPill who="reader" f={f - 9} out={out} />}
      </div>
    </div>
  );
};

// which sound each kind of text gets (see scripts/el-sfx3.mjs): slam and title hit hard, pop is crisp, whisper is airy
export const modeOf = (w: KW): TextMode => w.mode ?? MODE_BY_TEXT[w.text] ?? 'pop';
export const kwCues = (w: KW): {file: string; at: number; vol: number; dur?: number}[] => {
  const m = modeOf(w);
  if (m === 'slam') return [{file: 'tag_whoosh', at: w.at - 0.1, vol: 0.18}, {file: 'text_slam', at: w.at, vol: 0.5}, {file: 'glitch_hit', at: w.at + 0.02, vol: 0.25}];
  if (m === 'title') return [{file: 'tag_whoosh', at: w.at - 0.15, vol: 0.2}, {file: 'text_title', at: w.at, vol: 0.55}, {file: 'hud_scan', at: w.at + 0.1, vol: 0.3}];
  if (m === 'whisper') return [{file: 'terminal_type', at: w.at, dur: Math.min(2.2, 0.35 + w.text.length * 0.07), vol: 0.24}];
  return [{file: 'decode_blips', at: w.at, vol: 0.2}];
};
