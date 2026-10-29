import React from 'react';
import {Stick, StickPose, BrushDefs} from './Stick';
import {PKey, poseAt, clamp01, ramp, easeOut, easeBack, rnd} from './lib/anim';

// ============================================================================================
// WORLD: the two rooms (warm reader room, cold scroller room), furniture, the actor wrapper that gives a stick pose life
// (breathing, blinks, eyes sweeping a line, thumb swipes) and small UI pieces. Everything is plain SVG on a 1920 x 1080 stage.
// ============================================================================================
export const INK = '#1a1820';
export const GREEN = '#6bbf59', RED = '#e0574c';
export const FLOOR = 880;

// ---- furniture, in the actor's local (flipped) space: the person faces right, hip near (0, -135) ----
export const Bed: React.FC = () => (
  <g>
    <rect x={-500} y={-270} width={34} height={190} rx={8} fill="#5b4a43" stroke={INK} strokeWidth={8} />
    <rect x={-480} y={-96} width={540} height={46} rx={10} fill="#c9c2b8" stroke={INK} strokeWidth={8} />
    <rect x={-480} y={-140} width={540} height={52} rx={22} fill="#e6e0d4" stroke={INK} strokeWidth={8} />
    <ellipse cx={-410} cy={-166} rx={62} ry={26} fill="#f3eee3" stroke={INK} strokeWidth={8} />
    <path d="M-330,-140 q40,-34 90,-6 q40,-24 100,2 v40 h-190 z" fill="#8b9bb5" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-470} y={-50} width={20} height={52} fill="#5b4a43" stroke={INK} strokeWidth={6} />
    <rect x={20} y={-50} width={20} height={52} fill="#5b4a43" stroke={INK} strokeWidth={6} />
  </g>
);
export const Armchair: React.FC = () => (
  <g>
    <rect x={-150} y={-380} width={92} height={290} rx={40} fill="#a5532f" stroke={INK} strokeWidth={8} />
    <rect x={-150} y={-122} width={240} height={50} rx={18} fill="#d29c45" stroke={INK} strokeWidth={8} />
    <rect x={-132} y={-216} width={176} height={44} rx={20} fill="#8e4526" stroke={INK} strokeWidth={8} />
    <rect x={-140} y={-72} width={26} height={74} fill="#5b3a28" stroke={INK} strokeWidth={6} />
    <rect x={44} y={-72} width={26} height={74} fill="#5b3a28" stroke={INK} strokeWidth={6} />
  </g>
);

// ---- the two rooms (cell space: width 960 centred on cx) ------------------------------------
const WallBase: React.FC<{cx: number; w: number; top: string; bottom: string; floor: string; id: string}> = ({cx, w, top, bottom, floor, id}) => (
  <g>
    <defs><linearGradient id={'wall' + id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient></defs>
    <rect x={cx - w / 2 - 400} y={0} width={w + 800} height={FLOOR} fill={`url(#wall${id})`} />
    <rect x={cx - w / 2 - 400} y={FLOOR} width={w + 800} height={1080 - FLOOR} fill={floor} />
    <rect x={cx - w / 2 - 400} y={FLOOR - 6} width={w + 800} height={6} fill="#000" opacity={0.35} />
  </g>
);

export const ScrollerRoom: React.FC<{cx: number; w?: number; clock?: string; fatigue?: number; glow?: number; id: string; showBill?: number}> = ({cx, w = 960, clock = '11:40', fatigue = 0, glow = 1, id, showBill = 0}) => (
  <g>
    <BrushDefs id={'sr' + id} />
    <WallBase cx={cx} w={w} top="#1b2236" bottom="#0e1220" floor="#0a0c16" id={'s' + id} />
    <g filter={`url(#brush-sr${id})`}>
      {/* window with a moon */}
      <rect x={cx + 150} y={150} width={230} height={310} rx={8} fill="#0b1630" stroke={INK} strokeWidth={9} />
      <circle cx={cx + 230} cy={250} r={34} fill="#dfe6f5" opacity={0.9} />
      <path d={`M${cx + 265},150 V460 M${cx + 150},305 H${cx + 380}`} stroke={INK} strokeWidth={9} />
      {/* nightstand + clock */}
      <rect x={cx - 440} y={FLOOR - 190} width={150} height={190} rx={10} fill="#3a3f5a" stroke={INK} strokeWidth={8} />
      <rect x={cx - 420} y={FLOOR - 250} width={110} height={56} rx={8} fill="#0b0d14" stroke={INK} strokeWidth={7} />
    </g>
    <text x={cx - 365} y={FLOOR - 208} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight="700" fontSize="34" fill="#ff5a4d">{clock}</text>
    {showBill > 0 && <Receipt x={cx - 140} y={150} k={showBill} />}
    <ellipse cx={cx} cy={FLOOR - 250} rx={430} ry={380} fill="#6fb6ff" opacity={0.035 * glow} />
  </g>
);

export const ReaderRoom: React.FC<{cx: number; w?: number; id: string; lampOn?: number; clockHand?: number}> = ({cx, w = 960, id, lampOn = 1, clockHand = 0}) => (
  <g>
    <BrushDefs id={'rr' + id} />
    <WallBase cx={cx} w={w} top="#33261b" bottom="#1d1510" floor="#140e0a" id={'r' + id} />
    <g filter={`url(#brush-rr${id})`}>
      {/* bookshelf */}
      <rect x={cx - 440} y={200} width={220} height={FLOOR - 200} rx={6} fill="#4a3426" stroke={INK} strokeWidth={9} />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x={cx - 428} y={300 + r * 140} width={196} height={8} fill={INK} />
          {[0, 1, 2, 3, 4, 5].map((b) => <rect key={b} x={cx - 424 + b * 31} y={236 + r * 140 + ((b * 7 + r * 3) % 4) * 6} width={24} height={64 - ((b * 7 + r * 3) % 4) * 6} rx={3} fill={['#b5473a', '#d9a94a', '#5d8a56', '#4b6aa3', '#8c5a8c', '#c8b99a'][(b + r * 2) % 6]} stroke={INK} strokeWidth={4} />)}
        </g>
      ))}
      {/* wall clock */}
      <circle cx={cx + 250} cy={230} r={64} fill="#efe6d2" stroke={INK} strokeWidth={9} />
      <path d={`M${cx + 250},230 L${cx + 250 + 28 * Math.sin(clockHand)},${230 - 28 * Math.cos(clockHand)} M${cx + 250},230 L${cx + 250 + 44 * Math.sin(clockHand * 12)},${230 - 44 * Math.cos(clockHand * 12)}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      {/* floor lamp */}
      <path d={`M${cx + 360},${FLOOR} V430`} stroke={INK} strokeWidth={10} />
      <path d={`M${cx + 300},430 L${cx + 330},340 H${cx + 390} L${cx + 420},430 Z`} fill="#f0c36a" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    </g>
    <path d={`M${cx + 300},430 L${cx - 100},${FLOOR} H${cx + 600} Z`} fill="#ffd27a" opacity={0.16 * lampOn} />
    <ellipse cx={cx} cy={FLOOR - 250} rx={400} ry={360} fill="#ffb347" opacity={0.05 * lampOn} />
  </g>
);

// the Bill: a paper receipt on the wall that prints one line per milestone
export const Receipt: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => {
  const lines = ['NIGHT 1   -  2 h', 'NIGHT 2   -  2 h', 'NIGHT 3   -  3 h', '...', 'TOTAL  1,095 h'];
  const n = Math.min(lines.length, Math.floor(k * 1.0));
  return (
    <g transform={`translate(${x} ${y}) rotate(-2)`}>
      <rect width={190} height={44 + n * 30} fill="#f4efe2" stroke={INK} strokeWidth={5} />
      <text x={95} y={30} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight="700" fontSize="20" fill={INK}>THE BILL</text>
      {lines.slice(0, n).map((l, i) => <text key={i} x={14} y={62 + i * 30} fontFamily="'Courier New', monospace" fontSize="18" fill="#5a2a22">{l}</text>)}
    </g>
  );
};

// ---- an actor: a stick pose with breathing, blinks, reading eyes and thumb swipes ---------------
export const Actor: React.FC<{
  id: string; accent: string; keys: PKey[]; t: number; x: number; y?: number; scale?: number; flip?: boolean; behind?: React.ReactNode; front?: React.ReactNode;
  seed?: number; readSweep?: boolean; scroll?: boolean; opacity?: number;
}> = ({id, accent, keys, t, x, y = FLOOR, scale = 1.05, flip = false, behind, front, seed = 0, readSweep = false, scroll = false, opacity = 1}) => {
  const base = poseAt(keys, t);
  const br = Math.sin(t * 1.7 + seed), dr = Math.sin(t * 0.8 + seed * 2);
  const pose: StickPose = {...base, lean: base.lean + br * 0.9, headTilt: (base.headTilt ?? 0) + dr * 1.3, hip: [base.hip[0], base.hip[1] + br * 1.4]};
  if (readSweep && base.look) { const cyc = 1.9, ph = ((t + seed) % cyc) / cyc, row = Math.floor((t + seed) / cyc) % 4; pose.look = [ph < 0.82 ? -0.35 + (ph / 0.82) * 1.25 : 0.9 - ((ph - 0.82) / 0.18) * 1.25, 0.75 + row * 0.08]; }
  if (scroll) { const cyc = 0.95, ph = (t % cyc) / cyc, sw = ph < 0.3 ? easeOut(ph / 0.3) : 1 - clamp01((ph - 0.3) / 0.7) * 0; pose.handN = [pose.handN[0], pose.handN[1] + (ph < 0.3 ? -26 * easeOut(ph / 0.3) : -26 + 26 * ramp(ph, 0.3, 0.95))]; void sw; }
  // blink: eyes shut for a moment, at irregular times
  const bt = (t + seed * 1.7) % 3.4, blinkN = Math.floor((t + seed * 1.7) / 3.4);
  const blinkAt = 2.2 + rnd(blinkN + seed) * 1.0;
  if (bt > blinkAt && bt < blinkAt + 0.13 && pose.face !== 'asleep' && pose.face !== 'tired') pose.face = 'asleep';
  return <Stick id={id} pose={pose} accent={accent} x={x} y={y} scale={scale} flip={flip} behind={behind} front={front} opacity={opacity} />;
};

// small star burst for the phone's reward pop
export const Pops: React.FC<{times: number[]; t: number; at: [number, number]}> = ({times, t, at}) => (
  <g>
    {times.map((tt, i) => {
      const u = (t - tt) / 0.55; if (u < 0 || u > 1) return null;
      const r = 20 + easeOut(u) * 70;
      return <g key={i} opacity={1 - u} transform={`translate(${at[0]} ${at[1]})`}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = (k / 8) * Math.PI * 2; return <line key={k} x1={Math.cos(a) * r * 0.55} y1={Math.sin(a) * r * 0.55} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke="#ffd23f" strokeWidth={7} strokeLinecap="round" />; })}
      </g>;
    })}
  </g>
);

// ---- UI --------------------------------------------------------------------------------------
const TITLE = "'Bebas Neue', Impact, sans-serif", SANS = "Inter, 'Segoe UI', Arial, sans-serif";
export const Label: React.FC<{text: string; x: number; y: number; t: number; at: number; until?: number; size?: number; color?: string}> = ({text, x, y, t, at, until = 99, size = 120, color = '#f6efe0'}) => {
  const u = easeBack((t - at) / 0.45), out = 1 - ramp(t, until - 0.3, until);
  if (t < at || out <= 0) return null;
  return <text x={x} y={y} textAnchor="middle" fontFamily={TITLE} fontSize={size} letterSpacing={4} fill={color} stroke="#000" strokeWidth={size * 0.06} paintOrder="stroke" opacity={out} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * u}) translate(${-x} ${-y})`}>{text}</text>;
};
export const DayTag: React.FC<{text: string; t: number; at: number; until?: number}> = ({text, t, at, until = 99}) => {
  const out = 1 - ramp(t, until - 0.3, until), u = easeOut((t - at) / 0.4);
  if (t < at || out <= 0) return null;
  return <text x={960} y={120} textAnchor="middle" fontFamily={TITLE} fontSize={78} letterSpacing={8} fill="#f6efe0" opacity={out * u} stroke="#000" strokeWidth={5} paintOrder="stroke">{text}</text>;
};
export const TitleCard: React.FC<{words: string[]; t: number; color?: string}> = ({words, t, color = '#f6efe0'}) => (
  <g>
    <rect width={1920} height={1080} fill="#0b0b10" />
    {words.map((w, i) => { const u = easeBack((t - i * 0.28) / 0.5); if (t < i * 0.28) return null; const y = words.length > 1 ? 470 + i * 230 : 600; return <text key={i} x={960} y={y} textAnchor="middle" fontFamily={TITLE} fontSize={230} letterSpacing={8} fill={color} transform={`translate(960 ${y}) scale(${0.5 + 0.5 * u}) translate(-960 ${-y})`} opacity={clamp01(u)}>{w}</text>; })}
    <path d="M640,730 q320,26 640,-4" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" opacity={clamp01((t - 0.9) / 0.4)} />
  </g>
);
export const SANS_FONT = SANS;
