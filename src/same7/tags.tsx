import React from 'react';
import {FPS, DIGI} from '../same2d/theme';
import {AnimText} from '../same2d/fx';

// "IN BED" / "IN THE CHAIR" pills (the two versions of the same man) with an optional day tag above them. A tag appears ONLY while that day (or choice) is spoken.
const ease = (x: number) => x * x * (3 - 2 * x);
const ramp = (t: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
const eoBack = (x: number) => { const k = Math.min(1, Math.max(0, x)), c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const WHO = {
  bed: {label: 'IN BED', c1: '#ff5a6e', c2: '#c0243a', glow: 'rgba(255,90,110,.65)'},
  chair: {label: 'IN THE CHAIR', c1: '#3ddc84', c2: '#1f9a58', glow: 'rgba(61,220,132,.65)'},
};
const Icon: React.FC<{who: 'bed' | 'chair'}> = ({who}) => (
  <svg width="38" height="38" viewBox="0 0 48 48">
    {who === 'bed'
      ? <g fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"><path d="M4 36V14M4 28h40v8M44 28v-6a6 6 0 0 0-6-6H20v12" /><circle cx="11" cy="22" r="4" /></g>
      : <g fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"><path d="M12 8h22l-2 18H14z" /><path d="M10 26h28v8H10zM14 34v8M34 34v8" /></g>}
  </svg>
);
export const SidePill: React.FC<{who: 'bed' | 'chair'; f: number; out?: number; size?: number}> = ({who, f, out = 0, size = 34}) => {
  const w = WHO[who], e = eoBack(Math.min(1, Math.max(0, f / 10)));
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 28px 10px 18px', borderRadius: 999, background: `linear-gradient(180deg, ${w.c1}, ${w.c2})`, border: '4px solid #fff', boxShadow: `0 0 34px ${w.glow}, 0 8px 22px rgba(0,0,0,.5)`, transform: `translateX(${(who === 'bed' ? -1 : 1) * (1 - e) * 220}px) scale(${1 - out * 0.1})`, opacity: Math.min(1, Math.max(0, f / 3)) * (1 - out), fontFamily: DIGI, fontWeight: 700, fontSize: size, letterSpacing: size * 0.12, color: '#fff', textShadow: '0 3px 8px rgba(0,0,0,.5)'}}>
      <Icon who={who} />{w.label}
    </div>
  );
};
export const SideTag: React.FC<{t: number; from: number; to: number; who: 'bed' | 'chair' | 'both'; text?: string; color?: string; top?: number}> = ({t, from, to, who, text, color = '#fff', top = 54}) => {
  const o = Math.min(ramp(t, from, from + 0.25), 1 - ramp(t, to - 0.3, to));
  if (o <= 0) return null;
  const f = (t - from) * FPS, out = 1 - Math.min(1, o * 1.4);
  return (
    <div style={{position: 'absolute', top: top - (1 - o) * 14, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, o * 1.4)}}>
      {text && <AnimText text={text} f={f} size={82} mode="pop" tint={color} />}
      <div style={{display: 'flex', gap: 22}}>
        {(who === 'bed' || who === 'both') && <SidePill who="bed" f={f - 6} out={out} />}
        {(who === 'chair' || who === 'both') && <SidePill who="chair" f={f - 9} out={out} />}
      </div>
    </div>
  );
};
