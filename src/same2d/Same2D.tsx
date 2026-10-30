import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {INK, V, Face} from './Char';
import {SideChar, BookSide, PhoneSide} from './SideChar';
import {Stage, Cam, camAt} from './Stage';
import {bedroom, bus, kitchen, bathroom} from './sets';
import {BookOpenInsert, PhoneFeed, LockScreen, ClockInsert, PageInsert, PhoneBook, BookShut, CalendarBlur, Crowd, Dopamine, Scoreboard, CheckCalendar, TeaPour} from './inserts';
import {KineticWord, KW, IconTag, RewindCard, SpeedLines, Bridge, Dust, Shafts, BigCounter, Bubble, Cinema, WhoTag, kwCues, ramp, bell} from './fx';
import {FPS} from './theme';
import {AUDIO_FILE, AUDIO_ITEMS, CAPTIONS, srcToVideo} from '../same/lib/timeline';
import {Sfx3, Cue3} from './sound';
import {BillInsert, RewardInsert, CoinReward, YearFlip} from './inserts2';
import {buildPart2, Api, KWORDS2, overlays2, CUES2, MUSIC2} from './part2';
import {makeHook, HOOK_END} from './hook';
import {Music} from '../components/Music';

// ============================================================================================
// SAME MAN, 2D: the first two minutes (0 - 115.3 s). Every shot is one beat of src/same2d/storyboard.ts. Cutting rules:
//  - a new shot starts on every phrase of the narration, and every pause between phrases is filled with a cutaway (a detail of the set,
//    an insert, an infographic), so there is never a still moment
//  - no split screen: the two lives get their own full screen when they are spoken about
//  - the camera always drifts; whips, flashes and particle bridges carry the big cuts
// ============================================================================================
export const SAME2D_END = 482.8;
export const SAME2D_FRAMES = Math.round(SAME2D_END * FPS);
export const SAME2D_TOTAL = SAME2D_FRAMES + Math.round(HOOK_END * FPS);   // the hook comes first
const S = (src: number) => srcToVideo(src) ?? 0;
// sound effects and music dip whenever the narrator is speaking, so every word stays clear
// gentle (about -3 dB) and smooth, so the effects never vanish and never jump
const speechDuck = (t: number) => {
  let amt = 0;
  for (const c of CAPTIONS) { const a = c.from / 30 - 0.05, b = c.to / 30 + 0.1; if (t < a - 0.15 || t > b + 0.15) continue; amt = Math.max(amt, Math.min(1, (t - (a - 0.15)) / 0.15, ((b + 0.15) - t) / 0.15)); }
  return 1 - 0.3 * Math.max(0, amt);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpV = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const pulse = (t: number, at: number, len: number) => (t < at || t > at + len ? 0 : Math.sin(((t - at) / len) * Math.PI));
// ease with a little overshoot: reaches, grabs and lifts feel human instead of mechanical
const back = (x: number) => { const k = Math.min(1, Math.max(0, x)), c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const COLD_END = 27.7, REWIND_END = 28.7;
const SHUT = S(52.9), SEED = S(67.6);
const POPS = [27.1, 28.0, 28.9, 31.2, 34.4].map(S);

export type Ctx = {t: number; l: number; d: number; p: number; from: number};
export type C3 = [number, number, number];
export const camOf = (c: Ctx, a: C3, b: C3): Cam => {
  const k = camAt({cx: a[0], cy: a[1], z: a[2]}, {cx: b[0], cy: b[1], z: b[2]}, c.p);
  return {cx: k.cx + Math.sin(c.t * 0.9) * 5, cy: k.cy + Math.sin(c.t * 1.3 + 1) * 4, z: k.z};
};

// ---------------- the two men, in three-quarter side view (see SideChar.tsx) ----------------
// Reading and scrolling are shown from the side: the book or phone is held OUT in front of the chest at arm's length with the elbows bent a
// little, the head tipped down toward it. Near hand and far hand are separate targets; everything is hip-space numbers.
export type SP = {mode?: 'rest' | 'phone' | 'rub'; raise?: number; swipe?: boolean; bounce?: number; lids?: number; smile?: number; open?: number; slump?: number; glow?: number; gaze?: V; tee?: string; brow?: number; browTilt?: number; lean?: number; turn?: number; x?: number; y?: number};
export const Scroller: React.FC<{p: SP; t: number}> = ({p, t}) => {
  const mode = p.mode ?? 'phone';
  const rk = back(p.raise ?? 1);
  const fr = (t / 0.95) % 1, flick = mode === 'phone' && (p.swipe ?? true) ? Math.sin(Math.min(1, fr * 2.2) * Math.PI) : 0;
  const pop = POPS.map((a) => (t - a) / 0.9).find((q) => q >= 0 && q <= 1) ?? 0;
  // propped on the pillows, facing left: one hand holds the phone up in front of his chest, the other rests on his belly
  const handN: V = mode === 'phone' ? lerpV([-40, -70], [50, -255 - flick * 9], rk) : mode === 'rub' ? [-16, -318] : [-40, -70];
  const handF: V = mode === 'phone' ? lerpV([-95, -55], [-34, -118], rk) : [-95, -55];
  const smile = (p.smile ?? 0.05) + (pop > 0 ? 0.4 * Math.sin(pop * Math.PI) : 0);
  const face: Face = {gaze: p.gaze ?? (mode === 'phone' ? [0.2, 0.8] : [0.3, 0.1]), lids: p.lids ?? 0.2, smile, open: p.open ?? 0, brow: p.brow ?? -0.1, browTilt: p.browTilt ?? 4};
  const bounce = Math.sin(t * 18) * 1.6 * (p.bounce ?? 0), slump = p.slump ?? 0;
  return (
    <SideChar x={p.x ?? 2560} y={p.y ?? 630} flip torso={-38 + ((p.lean ?? -4) + 4) * 0.7 + bounce - slump * 3} headPitch={(mode === 'phone' ? 52 : 36) + slump * 6 + flick * 2} turn={0.85 + (p.turn ?? 0) * 0.15} face={face}
      handN={handN} handF={handF} footN={[380, -30]} footF={[392, -40]} legUp slump={slump} tee={p.tee} t={t} seed={0.3}>
      {mode === 'phone' && (p.raise ?? 1) > 0.04 && <PhoneSide x={lerp(-60, 46, rk)} y={lerp(-80, -302, rk)} deg={-24} glow={(p.glow ?? 1) * (0.92 + Math.sin(t * 13) * 0.05)} />}
      {pop > 0 && pop < 1 && Array.from({length: 8}, (_, i) => <circle key={i} cx={70 + Math.cos(i * 0.8) * (50 + pop * 200)} cy={-340 + Math.sin(i * 0.8) * (50 + pop * 200)} r={13 * (1 - pop)} fill={['#ffd23f', '#ff4f6d', '#3fd0ff', '#42e08c'][i % 4]} />)}
    </SideChar>
  );
};

export type RP = {mode?: 'rest' | 'book' | 'shut' | 'toss' | 'chin'; raise?: number; lids?: number; smile?: number; open?: number; brow?: number; browTilt?: number; turn?: number; gaze?: V; flip?: number; lean?: number; l?: number; x?: number; y?: number; tilt?: number; bookArm?: boolean};
export const Reader: React.FC<{p: RP; t: number}> = ({p, t}) => {
  const mode = p.mode ?? 'book';
  const rk = back(p.raise ?? 1);
  const fl = p.flip ?? 0, turnF = Math.sin(Math.min(1, Math.max(0, fl)) * Math.PI);
  const tossK = ramp(p.l ?? 0, 0.2, 0.8);
  const restN: V = [112, -62], restF: V = [152, -44];
  // the book is held out in front of the chest at arm's length, elbows bent a little, near hand under the book, far hand turns the page
  const handN: V = mode === 'book' ? lerpV(restN, [226, -150], rk) : mode === 'shut' ? [160, -66] : mode === 'toss' ? lerpV([160, -66], [40, -96], tossK) : mode === 'chin' ? [44, -334] : restN;
  const handF: V = mode === 'book' ? lerpV(restF, [276 - turnF * 30, -172 - turnF * 100], rk) : mode === 'shut' ? [186, -78] : mode === 'toss' ? lerpV([186, -78], [70, -80], tossK) : restF;
  const sweep = ((t * 0.6) % 1) * 1.6 - 0.8;
  const face: Face = {gaze: p.gaze ?? (mode === 'book' ? [sweep * 0.4 + 0.45, 0.85] : [0.2, 0.2]), lids: p.lids ?? 0.12, smile: p.smile ?? 0.25, open: p.open ?? 0, brow: p.brow ?? 0.1, browTilt: p.browTilt ?? 6};
  const headPitch = 6 + (p.tilt ?? (mode === 'book' ? 14 : 0)) + (mode === 'book' ? 6 : 0) - (p.turn ?? 0) * 10;
  return (
    <SideChar x={p.x ?? 640} y={p.y ?? 612} torso={-6 + ((p.lean ?? -3) + 3) * 0.7} headPitch={headPitch} turn={0.85 + (p.turn ?? 0) * 0.15} face={face}
      handN={handN} handF={handF} footN={[230, 170]} footF={[300, 172]} t={t} seed={0.7}>
      {mode === 'book' && (p.raise ?? 1) > 0.04 && <BookSide x={lerp(150, 252, rk)} y={lerp(-70, -214, rk)} deg={lerp(-4, -36, rk)} flip={fl} />}
      {mode === 'toss' && <BookSide shut x={lerp(176, 40, tossK)} y={lerp(-92, -112, tossK)} deg={lerp(-8, -4, tossK)} />}
      {mode === 'shut' && <BookSide shut x={176} y={-92} deg={-8} />}
      {p.bookArm && mode === 'rest' && <BookSide shut x={40} y={-112} deg={-4} />}
    </SideChar>
  );
};

// ---------------- the bedroom scene ----------------
export type Bed = {cam: [C3, C3]; s?: SP | null; r?: RP | null; day?: boolean; bloom?: number; thorn?: number; drop?: {at: number; side: 'L' | 'R'}[]; vines?: number; glowS?: number; glowR?: number; dim?: number; sat?: number; pull?: boolean; season?: number; books?: number; notes?: number; clutter?: number};
export const bedScene = (c: Ctx, o: Bed) => {
  const set = bedroom({day: o.day, t: c.t, bloom: o.bloom ?? 0, thorn: o.thorn ?? 0, bookOnArm: !o.r, drop: o.drop, vines: o.vines, glowS: o.glowS, glowR: o.glowR, season: o.season, books: o.books, notes: o.notes, clutter: o.clutter});
  const chars = <g>{o.r && <Reader p={o.r} t={c.t} />}{o.s && <Scroller p={o.s} t={c.t} />}</g>;
  const blurK = 1 + (o.pull ? 1.4 * (1 - ramp(c.l, 0, 0.45)) : 0);   // focus pull on the quick cutaways
  return (
    <div style={{position: 'absolute', inset: 0, filter: `${o.dim ? `brightness(${1 - o.dim}) ` : ''}saturate(${o.sat ?? 1})`}}>
      <Stage cam={camOf(c, o.cam[0], o.cam[1])} far={set.far} mid={set.mid} chars={chars} front={set.front} fg={set.fg} rim={o.day ? 'rgba(255,220,150,.9)' : 'rgba(255,190,120,.85)'} blurK={blurK} />
    </div>
  );
};

export type R = (c: Ctx) => React.ReactNode;
export const sP = (o: SP = {}): SP => ({mode: 'phone', glow: 1, ...o});
export const rB = (o: RP = {}): RP => ({mode: 'book', ...o});
export const B = (a: C3, b: C3, f: (c: Ctx) => Omit<Bed, 'cam'> = () => ({s: sP(), r: rB()}), pull = false): R => (c) => bedScene(c, {...f(c), cam: [a, b], pull});
export const WIDE: [C3, C3] = [[1600, 500, 0.6], [1600, 510, 0.66]];
// medium shots show the whole man with his book or phone; the zoom values are scaled down so most shots are not just a face
export const camS = (z0: number, z1: number, _cy = 0): [C3, C3] => [[2480, 400, z0 * 0.72], [2480, 392, z1 * 0.72]];
export const camR = (z0: number, z1: number, _cy = 0): [C3, C3] => [[760, 400, z0 * 0.72], [760, 392, z1 * 0.72]];
export const sFace = (z0: number, z1: number): [C3, C3] => [[2690, 265, z0], [2690, 260, z1]];
export const rFace = (z0: number, z1: number): [C3, C3] => [[660, 172, z0], [660, 168, z1]];
// detail cams: parts of the set and the hands, held a beat as cutaways
export const K: Record<string, [C3, C3]> = {
  MOON: [[1600, 380, 2.2], [1640, 376, 2.5]], CLOCKN: [[1815, 615, 3.2], [1830, 612, 3.5]], LAMP: [[1080, 440, 2.6], [1090, 436, 2.9]],
  EYES_S: [[2640, 262, 4.6], [2640, 258, 5.0]], EYES_R: [[705, 165, 4.4], [705, 161, 4.8]], HANDS_S: [[2515, 380, 2.6], [2515, 372, 2.9]], HANDS_R: [[880, 430, 2.4], [885, 424, 2.7]],
  BEDGLOW: [[2500, 420, 1.9], [2500, 412, 2.1]], ARM_R: [[740, 540, 2.6], [745, 536, 2.9]], PLANT: [[1590, 560, 2.4], [1590, 556, 2.7]],
};

// one man, doubled: "splits his life in two" without a split screen
export const DoubleVision: React.FC<{c: Ctx}> = ({c}) => {
  const k = ramp(c.l, 0.2, 1.0);
  return (
    <AbsoluteFill style={{background: '#0b0d1a'}}>
      {[-1, 1].map((s) => <AbsoluteFill key={s} style={{transform: `translateX(${s * k * 46}px)`, opacity: s < 0 ? 1 : 0.55, mixBlendMode: s < 0 ? 'normal' : 'screen'}}>{bedScene(c, {cam: sFace(2.6, 2.9), s: sP({mode: 'rest', lids: 0.2, glow: 0.3, brow: -0.3, browTilt: -6}), r: null})}</AbsoluteFill>)}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(255,246,214,.45), rgba(0,0,0,0) 55%)', opacity: k, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

// ---------------- the shots ----------------
export const D365 = {bloom: 1, thorn: 1, vines: 1};
export const gaunt: SP = {mode: 'phone', tee: '#7d6f99', lids: 0.62, smile: 0, brow: -0.4, browTilt: 14, glow: 1.2};
const sidePax = (x: number, seed: number, tee: string, t: number) => (
  <SideChar x={x} y={690} scale={0.82} dim={0.4} torso={-4} headPitch={22} turn={0.85} face={{gaze: [0.3, 0.9], lids: 0.4}} handN={[210, -170]} handF={[232, -182]} footN={[230, 170]} footF={[300, 172]} tee={tee} t={t} seed={seed}>
    <PhoneSide x={238} y={-214} deg={-18} glow={1} />
  </SideChar>
);
export const kit = (): R => (c) => {
  const set = kitchen(), bite = 0.5 - 0.5 * Math.cos(c.t * 3.4);
  return <Stage cam={camOf(c, [1800, 480, 1.0], [1830, 480, 1.1])} far={set.far} mid={set.mid} rim="rgba(255,230,170,.9)"
    front={<g>
      <rect x={1330} y={700} width={330} height={44} rx={16} fill="#8b6f4a" stroke={INK} strokeWidth={6} /><rect x={1330} y={430} width={70} height={300} rx={22} fill="#8b6f4a" stroke={INK} strokeWidth={6} />
      <rect x={1560} y={640} width={1100} height={30} rx={10} fill="#b98a58" stroke={INK} strokeWidth={6} /><rect x={2560} y={670} width={40} height={170} fill="#8b6f4a" stroke={INK} strokeWidth={6} /><rect x={1600} y={670} width={40} height={170} fill="#8b6f4a" stroke={INK} strokeWidth={6} />
      <ellipse cx={1880} cy={634} rx={100} ry={22} fill="#fff" stroke={INK} strokeWidth={6} /><ellipse cx={1880} cy={630} rx={80} ry={12} fill="#e8c98a" />
      <rect x={2250} y={470} width={120} height={170} rx={10} fill="#d9524a" stroke={INK} strokeWidth={6} />
      <g transform="translate(2200 560) rotate(-14)"><rect x={-26} y={-60} width={52} height={104} rx={12} fill="#15161f" stroke={INK} strokeWidth={6} /><rect x={-16} y={-50} width={32} height={84} rx={6} fill="#4aa8ff" /></g>
    </g>} fg={<g />}
    chars={<SideChar x={1500} y={690} torso={2} headPitch={20} turn={0.85} face={{gaze: [0.7, 0.5], lids: 0.35, smile: 0, open: 0.12 * bite}}
      handN={[lerp(330, 150, bite), lerp(-92, -362, bite)]} handF={[250, -50]} footN={[230, 170]} footF={[300, 172]} t={c.t} seed={3}>
      <g transform={`translate(${lerp(330, 150, bite)} ${lerp(-92, -362, bite)}) rotate(40)`}><rect x={-5} y={-8} width={11} height={70} rx={5} fill="#c7cdd6" stroke={INK} strokeWidth={4} /></g>
    </SideChar>} />;
};
export const bath = (): R => (c) => {
  const set = bathroom(), br = Math.sin(c.t * 14) * 14;
  return <Stage cam={camOf(c, [1700, 480, 1.0], [1730, 480, 1.1])} far={set.far} mid={set.mid} rim="rgba(230,250,255,.9)"
    front={<g>
      <rect x={1620} y={700} width={800} height={60} rx={16} fill="#f4f1ea" stroke={INK} strokeWidth={6} /><rect x={1660} y={760} width={720} height={200} rx={12} fill="#d9d2c4" stroke={INK} strokeWidth={6} />
      <g transform="translate(2200 640) rotate(-16)"><rect x={-26} y={-62} width={52} height={104} rx={12} fill="#15161f" stroke={INK} strokeWidth={6} /><rect x={-16} y={-52} width={32} height={84} rx={6} fill="#4aa8ff" /></g>
    </g>} fg={<g />}
    chars={<SideChar x={1450} y={425} torso={-2} headPitch={16} turn={0.85} face={{gaze: [0.8, 0.4], lids: 0.4, smile: 0, open: 0.1}}
      handN={[140 + br, -392]} handF={[300, 262]} footN={[40, 385]} footF={[110, 385]} t={c.t} seed={4}>
      <g transform={`translate(${140 + br} -392) rotate(-8)`}><rect x={-6} y={-10} width={96} height={16} rx={8} fill="#fff" stroke={INK} strokeWidth={4} /><rect x={50} y={-14} width={34} height={10} fill="#4aa8ff" /></g>
    </SideChar>} />;
};
const busShot = (a: C3, b: C3, smile = 0.3): R => (c) => {
  const set = bus(c.t);
  return <Stage cam={camOf(c, a, b)} far={set.far} mid={set.mid} front={set.front} fg={set.fg} rim="rgba(255,210,140,.9)" chars={<g>
    {sidePax(2150, 1.1, '#7a6aa8', c.t)}{sidePax(2750, 2.2, '#6f7fa8', c.t)}
    <Reader p={{mode: 'book', x: 1250, y: 690, smile, flip: ramp(c.l, 1.1, 1.9)}} t={c.t} />
  </g>} />;
};

// [start second, transition into it, renderer]  w = whip, f = flash + speed lines, b = particle bridge
const LIST1: [number, ('w' | 'f' | 'b')?, R?][] = [
  // ===== COLD OPEN: setup, then a glimpse of where it ends =====
  [0.0, , B(K.MOON[0], K.MOON[1], () => ({s: sP({mode: 'rest', lids: 0.45, glow: 0.2}), r: null, glowS: 0.25}), true)],
  [0.9, , B(K.CLOCKN[0], K.CLOCKN[1], () => ({s: sP({mode: 'rest'}), r: null, glowS: 0.25}), true)],
  [1.8, , B(...camS(1.2, 1.34), () => ({s: sP({mode: 'rest', lids: 0.45, smile: 0, gaze: [0, 0.2]}), r: null, glowS: 0.3}))],
  [2.7, , B(...sFace(2.8, 3.0), () => ({s: sP({mode: 'rest', lids: 0.4, smile: 0}), r: null, glowS: 0.3}))],
  [3.4, 'w', B(K.EYES_S[0], K.EYES_S[1], () => ({s: sP({mode: 'rest', lids: 0.5}), r: null, glowS: 0.3}))],
  [4.1, , B(...WIDE, () => ({s: sP({mode: 'rest', lids: 0.4}), r: null, glowS: 0.3}))],
  [4.7, 'w', B(K.LAMP[0], K.LAMP[1], () => ({s: null, r: null}), true)],
  [5.6, , B([2640, 262, 4.2], [2640, 258, 4.8], (c) => ({s: sP({mode: 'rest', lids: 0.5 + pulse(c.l, 0.6, 0.5) * 0.5}), r: null, glowS: 0.3}))],
  [6.6, , B(...camS(1.3, 1.42), (c) => ({s: sP({mode: 'rest', lids: 0.4, slump: ramp(c.l, 0.1, 0.8), smile: 0}), r: null, glowS: 0.3}))],
  [7.5, , B([2650, 300, 2.0], [2650, 296, 2.2], () => ({s: sP({mode: 'rub', lids: 0.7}), r: null, glowS: 0.3}))],
  [8.4, , () => <ClockInsert text="11:40" />],
  [9.3, , (c) => <PhoneBook t={c.l} hover={ramp(c.l, 0.5, 1.2) * 0.4} />],
  [10.6, , (c) => <PhoneBook t={c.l + 1.3} hover={0.4 + ramp(c.l, 0, 1.0) * 0.6} />],
  [11.9, , B(...sFace(3.2, 3.5), () => ({s: sP({mode: 'rest', lids: 0.15, brow: -0.3, browTilt: -6, smile: 0}), r: null, glowS: 0.3}))],
  [12.6, 'w', (c) => <DoubleVision c={c} />],
  [13.6, , B(...camR(1.5, 1.7, 420), () => ({r: rB({smile: 0.2}), s: null, glowR: 1.1}))],
  [14.4, 'w', B(...camS(1.5, 1.7, 420), () => ({s: sP({lids: 0.3, glow: 1}), r: null}))],
  [15.1, , B(K.BEDGLOW[0], K.BEDGLOW[1], () => ({s: sP(), r: null}), true)],
  [15.9, 'w', B(...camS(1.5, 1.7, 420), (c) => ({s: sP({raise: ramp(c.l, 0.1, 0.9), lids: 0.25, smile: 0.1, glow: ramp(c.l, 0.3, 1)}), r: null}))],
  [16.9, , (c) => <PhoneFeed t={c.l} />],
  [18.0, , B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP(), r: null}), true)],
  [18.6, 'w', B(...camR(1.5, 1.7, 420), (c) => ({r: rB({raise: ramp(c.l, 0.1, 0.9), flip: ramp(c.l, 1.5, 2.1), smile: 0.2}), s: null, glowR: 1.1}))],
  [19.6, , (c) => <BookOpenInsert t={c.l} openAt={0.05} flips={[0.85]} />],
  [20.6, , B(K.LAMP[0], K.LAMP[1], () => ({s: null, r: null}), true)],
  [21.5, 'b', (c) => <YearFlip t={c.l} dur={1.55} />],
  [23.1, , B(...sFace(2.0, 2.2), () => ({s: gaunt, r: null, ...D365, books: 20, notes: 14, clutter: 1, sat: 0.7}))],
  [24.0, , B(...rFace(2.0, 2.2), () => ({r: rB({smile: 0.7, lids: 0.08}), s: null, ...D365, books: 20, notes: 14, clutter: 1, glowR: 1.2}))],
  [24.5, , B([2640, 262, 3.4], [2640, 258, 3.8], () => ({s: gaunt, r: null, ...D365, books: 20, notes: 14, clutter: 1, sat: 0.7}))],
  [25.0, 'f', B([1600, 500, 0.6], [1600, 510, 0.7], () => ({s: sP(), r: rB(), dim: 0.6}))],
  [26.4, , B([1600, 520, 0.7], [1600, 530, 0.8], () => ({s: sP(), r: rB(), dim: 0.6}))],
  [27.7, , B(...WIDE)],
  // ===== S02 THE CHOICE =====
  [28.7, , B(...WIDE)],
  [29.4, , B(...camS(1.5, 1.7, 420), (c) => ({s: sP({glow: ramp(c.l, 0, 0.5), smile: 0.35}), r: null}))],
  [30.7, 'w', B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP({smile: 0.3}), r: null}), true)],
  [31.4, , B(...camS(1.8, 2.0, 400), () => ({s: sP({smile: 0.8, open: 0.2, glow: 1.2}), r: null}))],
  [31.9, , B(K.BEDGLOW[0], K.BEDGLOW[1], () => ({s: sP({glow: 1.3}), r: null}), true)],
  [32.6, , (c) => <PhoneFeed t={c.l} />],
  [33.8, , B(...camS(1.9, 2.1, 400), () => ({s: sP({smile: 0.8, open: 0.45, bounce: 1, glow: 1.2}), r: null}))],
  [34.5, , (c) => <PhoneFeed t={c.l + 1.2} speed={1.3} />],
  [35.2, 'w', B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP({glow: 1.2}), r: null}), true)],
  [35.8, , B(...camS(1.25, 1.35), (c) => ({s: sP({slump: ramp(c.l, 0.2, 1.0), smile: 0.4, lids: 0.3, lean: -4 - ramp(c.l, 0.2, 1.0) * 6}), r: null}))],
  [36.8, , B(K.EYES_S[0], K.EYES_S[1], () => ({s: sP({lids: 0.4, smile: 0.4}), r: null}))],
  [37.8, , B(...sFace(2.2, 2.4), () => ({s: sP({lids: 0.5, smile: 0.5, glow: 1.2}), r: null}))],
  [38.9, , (c) => <PhoneFeed t={c.l} speed={1.7} />],
  [39.9, 'w', B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP({glow: 1.3}), r: null}), true)],
  [40.9, , B(K.LAMP[0], K.LAMP[1], () => ({s: sP(), r: rB()}), true)],
  [41.8, 'w', B(...camR(1.7, 1.9, 410), () => ({r: rB({brow: -0.4, browTilt: -10, smile: 0, lids: 0.18}), s: null}))],
  [42.8, , B(K.HANDS_R[0], K.HANDS_R[1], () => ({r: rB({smile: 0}), s: null}), true)],
  [43.6, , (c) => <PageInsert t={c.l} loops={3} per={0.6} />],
  [45.4, , B(K.EYES_R[0], K.EYES_R[1], () => ({r: rB({brow: -0.4, browTilt: -10, smile: 0}), s: null}))],
  [46.2, , B(K.CLOCKN[0], K.CLOCKN[1], () => ({s: sP(), r: rB()}), true)],
  [46.9, 'w', B(...camR(1.9, 2.1, 400), (c) => ({r: rB({turn: ramp(c.l, 0.2, 0.7) * 0.8, gaze: [lerp(-0.2, 1, ramp(c.l, 0.1, 0.5)), 0.2], smile: 0, lids: 0.2}), s: null}))],
  [47.7, , () => <ClockInsert text="11:50" />],
  [48.4, , B(...rFace(1.7, 1.9), (c) => ({r: rB({lids: 0.2 + c.l * 0.4, open: c.l * 0.7, smile: 0.1, brow: 0.5}), s: null}))],
  [49.1, , B([820, 420, 1.7], [825, 414, 1.9], () => ({r: rB({smile: 0}), s: null}))],
  [50.0, , B(...rFace(1.8, 2.0), (c) => ({r: rB({lids: 0.4 + pulse(c.l, 0, 1.0) * 0.5, open: pulse(c.l, 0, 1.0), smile: 0.1, brow: 0.5}), s: null}))],
  [51.0, , B([690, 200, 2.2], [690, 196, 2.4], (c) => ({r: rB({smile: 0.2 * ramp(c.l, 0.2, 0.8), lids: 0.3, tilt: 9}), s: null}))],
  [52.2, , (c) => <BookOpenInsert t={c.l + 2} openAt={0} flips={[2.15]} />],
  [53.1, , B(K.MOON[0], K.MOON[1], () => ({s: sP(), r: rB()}), true)],
  [53.9, 'w', B(K.LAMP[0], K.LAMP[1], () => ({s: sP(), r: rB()}), true)],
  [54.7, 'w', B(K.BEDGLOW[0], K.BEDGLOW[1], () => ({s: sP(), r: rB()}), true)],
  [55.5, , B(...sFace(2.0, 2.2), () => ({s: sP({lids: 0.4, glow: 1.2}), r: null}))],
  // ===== S03 NIGHT ONE =====
  [56.3, , B(...camS(1.8, 2.0, 400), (c) => ({s: sP({open: 0.5 * (Math.sin(c.l * 14) > 0 ? 1 : 0.1), lids: 0.4, smile: 0.1, gaze: [0, 0.9]}), r: null}))],
  [57.5, , B(...camS(1.2, 1.3), () => ({s: sP({lids: 0.4}), r: null}))],
  [58.7, 'w', B(K.CLOCKN[0], K.CLOCKN[1], () => ({s: sP(), r: rB()}), true)],
  [59.5, 'f', (c) => <LockScreen t={c.l} from="11:40" to="2:00" spinAt={0.1} spinLen={0.9} battery={8} />],
  [60.6, , () => <ClockInsert text="2:00" />],
  [61.3, , B(K.HANDS_R[0], K.HANDS_R[1], () => ({r: rB({lids: 0.3}), s: null}), true)],
  [62.2, , (c) => <BookShut t={c.l} at={SHUT - 62.2} />],
  [63.9, , B(...rFace(1.9, 2.1), () => ({r: {mode: 'shut', lids: 0.35, smile: 0, brow: -0.3, browTilt: -6}, s: null}))],
  [64.5, , B(...camR(1.6, 1.7, 430), (c) => ({r: {mode: 'toss', l: c.l, smile: 0, brow: -0.3, browTilt: -12, lids: 0.2}, s: null}))],
  [65.1, 'w', (c) => <RewardInsert t={c.l} from={0} to={1} printAt={0.1} />],
  [65.8, , B(...camS(1.8, 2.0, 400), () => ({s: sP({smile: 0.9, open: 0.25, glow: 1.2}), r: null}))],
  [66.8, , B(...camS(1.2, 1.3), () => ({s: sP({smile: 0.7, glow: 1.2}), r: null}))],
  [68.0, , B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP({glow: 1.3}), r: null}), true)],
  [68.9, 'w', B(...sFace(2.2, 2.4), () => ({s: sP({smile: 1, open: 0.4, glow: 1.3}), r: null}))],
  [69.3, , B(K.BEDGLOW[0], K.BEDGLOW[1], () => ({s: sP({glow: 1.5}), r: null}), true)],
  [69.9, , B(...camS(1.6, 1.7, 430), () => ({s: sP({slump: 0.9, smile: 0.5, lids: 0.45, lean: -9}), r: null}))],
  [71.1, , B(...camR(1.6, 1.7, 430), () => ({r: {mode: 'chin', lids: 0.5, smile: 0, brow: -0.3, browTilt: -4}, s: null}))],
  [72.6, , B(K.MOON[0], K.MOON[1], () => ({s: sP(), r: rB()}), true)],
  [73.3, , (c) => <Crowd t={c.l} />],
  [75.2, 'b', (c) => <CoinReward t={c.l} />],
  [76.4, , (c) => <BillInsert t={c.l} from={0} to={1} printAt={SEED - 76.4} />],

  [79.6, , B(...camR(1.5, 1.6, 430), (c) => ({r: {mode: 'shut', turn: ramp(c.l, 0.5, 1.1) * 0.8, gaze: [lerp(0, 1, ramp(c.l, 0.3, 0.8)), 0.2], smile: 0, lids: 0.25}, s: null}))],
  [80.8, , B(K.HANDS_R[0], K.HANDS_R[1], () => ({r: {mode: 'shut', smile: 0}, s: null}), true)],
  [82.0, 'w', B(K.BEDGLOW[0], K.BEDGLOW[1], () => ({s: sP({glow: 1.4}), r: null}), true)],
  [82.7, 'w', busShot([1300, 520, 1.3], [1450, 520, 1.4])],
  [84.0, , busShot([2000, 400, 2.4], [2200, 400, 2.6])],
  [84.9, , busShot([1300, 330, 2.5], [1290, 326, 2.7], 0.6)],
  [86.4, , busShot([2600, 380, 2.2], [2800, 380, 2.4])],
  // ===== S04 DAY 5 =====
  [86.9, 'f', B(K.CLOCKN[0], K.CLOCKN[1], (c) => ({day: true, s: sP({lids: 0.9, glow: 0.2}), r: null, ...(c.l > 99 ? {} : {})}), true)],
  [87.9, , B(K.MOON[0], K.MOON[1], () => ({day: true, s: sP({lids: 0.9, glow: 0.2}), r: null}), true)],
  [88.7, 'w', B(...camS(1.3, 1.4), (c) => ({day: true, s: sP({lids: 0.85, glow: 0.2, smile: 0, lean: -4 + Math.sin(c.l * 40) * (c.l < 0.5 ? 2 : 0)}), r: null}))],
  [89.4, , B(...sFace(2.2, 2.4), () => ({day: true, s: sP({lids: 0.95, glow: 0.3, smile: 0}), r: null}))],
  [90.1, , B(K.HANDS_S[0], K.HANDS_S[1], () => ({day: true, s: sP({lids: 0.9, glow: 0.3}), r: null}), true)],
  [90.7, , (c) => <LockScreen t={c.l} from="6:30" to="6:30" battery={62} />],
  [91.9, , B(...sFace(2.2, 2.4), (c) => ({day: true, s: sP({lids: 0.95 - ramp(c.l, 0.2, 0.8) * 0.6, glow: 0.3, smile: 0}), r: null}))],
  [92.8, , B(...sFace(2.2, 2.4), () => ({s: sP({lids: 0.6, glow: 1.3, smile: 0}), r: null}))],
  [94.0, , B(K.EYES_S[0], K.EYES_S[1], () => ({s: sP({lids: 0.55, glow: 1.3}), r: null}))],
  [95.2, 'w', B(K.BEDGLOW[0], K.BEDGLOW[1], () => ({s: sP({glow: 1.4}), r: null}), true)],
  [95.8, 'w', kit()],
  [97.1, 'w', bath()],
  [98.5, 'w', B(...camS(1.3, 1.4), () => ({s: sP({lids: 0.5, glow: 1.3, smile: 0}), r: null}))],
  [99.9, 'w', (c) => <CalendarBlur t={c.l} d={2.4} />],
  [101.8, 'w', kit()],
  [102.2, 'w', bath()],
  [102.55, 'w', B(...camS(1.3, 1.4), () => ({s: sP({lids: 0.5, glow: 1.3}), r: null}))],
  [102.9, , (c) => <TeaPour t={c.l} />],
  [104.1, , B(...camR(1.6, 1.7, 430), () => ({r: rB({smile: 0.3}), s: null, bloom: 0.1}))],
  [105.2, , B(K.ARM_R[0], K.ARM_R[1], () => ({r: {mode: 'rest', smile: 0.2}, s: null, bloom: 0.1}), true)],
  [106.1, , B(K.CLOCKN[0], K.CLOCKN[1], () => ({s: sP(), r: rB()}), true)],
  [106.6, , (c) => <PageInsert t={c.l} loops={1} per={1.2} mark />],
  [108.0, , B(...rFace(1.8, 2.0), () => ({r: rB({lids: 0.35, smile: 0, brow: -0.2, browTilt: 6}), s: null}))],
  [109.2, , B(K.HANDS_R[0], K.HANDS_R[1], () => ({r: rB({lids: 0.3}), s: null}), true)],
  [110.0, , B(...rFace(2.0, 2.3), () => ({r: rB({lids: 0.05, smile: 0, brow: -0.5, browTilt: -10}), s: null}))],
  [111.2, , (c) => <BookOpenInsert t={c.l + 2} openAt={0} flips={[2.1]} />],
  [111.9, , B([700, 230, 1.8], [740, 226, 1.6], () => ({r: rB({smile: 0.45, lids: 0.15}), s: null, bloom: 0.12}))],
  [113.2, , B(...camR(1.5, 1.4, 440), () => ({r: rB({smile: 0.45}), s: null, bloom: 0.12}))],
  [114.3, , B(...rFace(1.9, 1.7), () => ({r: rB({smile: 0.5, lids: 0.12}), s: null, bloom: 0.12}))],
];
// part 2 (1:55 to the end) lives in part2.tsx and gets the same building blocks
const API: Api = {B, bedScene, sP, rB, WIDE, camS, camR, sFace, rFace, K, camOf, kit, bath};
const HookC = makeHook(API);
const LIST: [number, ('w' | 'f' | 'b')?, R?][] = [...LIST1, ...buildPart2(API)];
type Shot = {from: number; to: number; fx?: 'w' | 'f' | 'b'; C: R};
const SHOTS: Shot[] = LIST.map(([from, fx, C], i) => ({from, to: LIST[i + 1]?.[0] ?? SAME2D_END, fx, C: C ?? B(...WIDE)}));

// ---------------- overlays ----------------
const KWORDS: KW[] = [
  {at: 2.8, dur: 1.2, text: 'SAME MAN.', accent: 1}, {at: 4.2, dur: 1.2, text: 'SAME ROOM.', accent: 1}, {at: 9.5, dur: 1.4, text: 'ONE SMALL CHOICE.', accent: 2},
  {at: 12.8, dur: 1.5, text: 'TWO LIVES.', accent: 1},
  {at: 21.6, dur: 1.4, text: 'ONE YEAR LATER', accent: 2}, {at: 25.8, dur: 1.9, text: 'ONE HABIT.', accent: 1, big: true},
  {at: 31.5, dur: 1.0, text: 'INSTANTLY.'}, {at: 44.0, dur: 1.2, text: 'SAME LINE. ×3', accent: 2}, {at: 49.2, dur: 1.2, text: 'TEN PAGES.', accent: 1},
  {at: 77.0, dur: 2.0, text: 'THE BILL COMES LATER.', accent: 1}, {at: 100.6, dur: 1.0, text: 'BLUR.'}, {at: 112.2, dur: 1.3, text: 'A PATTERN.', accent: 1},
];
const FLASH_AT = SHOTS.filter((s) => s.fx === 'f').map((s) => s.from), WHIP_AT = SHOTS.filter((s) => s.fx === 'w').map((s) => s.from), BRIDGE_AT = SHOTS.filter((s) => s.fx === 'b').map((s) => s.from);
// ---------------- sound design (see sound.tsx, recordings generated by scripts/el-sfx3.mjs) ----------------
const every = (from: number, to: number, step: number, make: (t: number) => Cue3): Cue3[] => { const out: Cue3[] = []; for (let t = from; t < to; t += step) out.push(make(t)); return out; };
// stretches where the scroller's thumb is flicking: one swipe sound per swipe
const FEED_RANGES: [number, number][] = [[16.9, 18.0], [29.4, 32.6], [32.6, 35.2], [38.9, 41.8], [56.3, 59.5], [65.8, 69.9], [92.8, 95.8], [98.5, 99.9]];
const CUES3: Cue3[] = [
  // places: a bed under each location
  {file: 'amb_night_room', at: 0, dur: 82.7, loop: true, vol: 0.2, fadeIn: 1.5, fadeOut: 0.8},
  {file: 'amb_bus', at: 82.4, dur: 4.7, loop: true, vol: 0.32, fadeIn: 0.4, fadeOut: 0.4},
  {file: 'amb_morning', at: 86.9, dur: 8.9, loop: true, vol: 0.22, fadeIn: 0.6, fadeOut: 0.6},
  {file: 'amb_kitchen', at: 95.5, dur: 1.8, loop: true, vol: 0.3, fadeIn: 0.1, fadeOut: 0.2},
  {file: 'amb_night_room', at: 98.5, dur: 16.8, loop: true, vol: 0.2, fadeIn: 0.3, fadeOut: 1.2},
  // transitions
  ...WHIP_AT.map((at) => ({file: 'whip', at: at - 0.08, vol: 0.17})),
  ...FLASH_AT.filter((at) => at !== 25.0).map((at) => ({file: 'flash_boom', at, vol: 0.28})),
  ...BRIDGE_AT.map((at) => ({file: 'shimmer', at: at - 0.2, vol: 0.25})),
  // cold open
  {file: 'shimmer', at: 12.7, vol: 0.3},
  {file: 'phone_pickup', at: 16.0, vol: 0.35}, {file: 'book_open', at: 18.75, vol: 0.3}, {file: 'page_turn', at: 20.05, vol: 0.3},
  {file: 'riser', at: 22.7, dur: 3.0, vol: 0.4, fadeOut: 0.05}, {file: 'title_hit', at: 25.7, vol: 0.55},
  {file: 'tape_rewind', at: 27.35, vol: 0.4}, {file: 'paper_scatter', at: 27.7, vol: 0.3},
  // kinetic words land with a soft pop
  ...[...KWORDS, ...KWORDS2].flatMap((k) => kwCues(k)),
  ...[65.8, 79.7, 82.9, 89.4, 103.0, 162.8, 186.3, 223.8, 253.4, 355.8, 380.8].flatMap((at) => [{file: 'tag_whoosh', at, vol: 0.2}, {file: 'pill_pop', at: at + 0.3, vol: 0.28}]),
  // clocks tick whenever a clock is on screen
  {file: 'clock_tick', at: 0.9, dur: 0.9, vol: 0.3, loop: true}, {file: 'clock_tick', at: 8.4, dur: 0.9, vol: 0.3, loop: true}, {file: 'clock_tick', at: 46.2, dur: 1.5, vol: 0.3, loop: true},
  {file: 'clock_tick', at: 58.7, dur: 0.8, vol: 0.3, loop: true}, {file: 'clock_tick', at: 60.6, dur: 0.7, vol: 0.3, loop: true}, {file: 'clock_tick', at: 106.1, dur: 0.5, vol: 0.3, loop: true},
  {file: 'clock_spin', at: 59.5, vol: 0.4},
  // the phone: swipes on every flick, a reward pop on every pop, a tick on the dopamine bar
  ...FEED_RANGES.flatMap(([a, b]) => every(a, b, 0.95, (t) => ({file: 'phone_swipe', at: t + 0.1, vol: 0.14}))),
  ...POPS.map((at) => ({file: 'reward_pop', at, vol: 0.3})),
  ...[36.2, 37.6, 39.2, 40.4].map((at) => ({file: 'dopamine_tick', at, vol: 0.25})),
  {file: 'reward_pop', at: 68.9, vol: 0.4},
  ...every(73.8, 75.2, 0.18, (t) => ({file: 'phone_tap', at: t, vol: 0.12})),
  {file: 'phone_unlock', at: 90.9, vol: 0.3},
  // the book
  {file: 'page_flutter', at: 43.6, vol: 0.2}, {file: 'page_turn', at: 52.4, vol: 0.3}, {file: 'page_turn', at: 111.5, vol: 0.3},
  {file: 'book_close', at: SHUT, vol: 0.5}, {file: 'book_toss', at: 65.0, vol: 0.5},
  // the body: cloth when he shifts, the real recorded voices for yawn, sigh and chuckle
  {file: 'cloth_shift', at: 6.7, vol: 0.22}, {file: 'cloth_shift', at: 35.9, vol: 0.22}, {file: 'cloth_shift', at: 69.9, vol: 0.22},
  {file: 'yawn', at: 48.9, vol: 0.28, old: true}, {file: 'sigh', at: 51.1, vol: 0.28, old: true}, {file: 'chuckle', at: 33.9, vol: 0.2, old: true},
  // the planter
  {file: 'coin_ping', at: 75.3, vol: 0.35}, {file: 'page_flutter', at: 21.6, dur: 1.5, vol: 0.3}, {file: 'counter_whir', at: 21.6, dur: 1.4, vol: 0.28}, {file: 'receipt_print', at: SEED, dur: 1.4, vol: 0.4, fadeOut: 0.2}, {file: 'stamp_hit', at: 65.15, vol: 0.3},
  // the bus, the morning, the kitchen, the bathroom, the tea
  {file: 'bus_bell', at: 85.9, vol: 0.3},
  {file: 'alarm_beep', at: 86.9, dur: 2.0, vol: 0.33, fadeOut: 0.1}, {file: 'phone_buzz', at: 88.7, vol: 0.25},
  {file: 'spoon_bowl', at: 95.9, vol: 0.3}, {file: 'brush_teeth', at: 97.1, dur: 1.4, vol: 0.3}, {file: 'tea_pour', at: 103.1, vol: 0.35},
  {file: 'page_flutter', at: 99.9, vol: 0.22}, {file: 'page_flutter', at: 100.5, vol: 0.18},
  // the page counter ticks up
  ...every(S(97.0), S(102.5) + 0.2, 0.35, (t) => ({file: 'counter_tick', at: t, vol: 0.12})),
];

// a fine film grain, a different offset every frame
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>\")";

const Same2DMain: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const shot = SHOTS.find((s) => t >= s.from && t < s.to) ?? SHOTS[SHOTS.length - 1];
  const c: Ctx = {t, l: t - shot.from, d: shot.to - shot.from, p: Math.min(1, Math.max(0, (t - shot.from) / (shot.to - shot.from))), from: shot.from};
  const old = t < COLD_END;
  let whip = 0, whipDir = 0;
  for (const b of WHIP_AT) { const w = bell(t - b, 0.14); if (w > whip) { whip = w; whipDir = Math.sign(t - b) || 1; } }
  const HITS = [...FLASH_AT, 25.7, 453.6];
  const shk = 9 * HITS.reduce((m, h) => (t >= h && t < h + 0.45 ? Math.max(m, Math.exp(-(t - h) * 9)) : m), 0);
  const flashAt = FLASH_AT.find((b) => t >= b - 0.04 && t < b + 0.4);
  const fl = flashAt === undefined ? 0 : Math.max(0, 1 - (t - flashAt) / 0.4);
  const fadeIn = 1 - ramp(t, 0.5, 1.2);
  const counterO = Math.min(ramp(t, S(97.0) - 0.3, S(97.0)), 1 - ramp(t, S(102.5) + 1.2, S(102.5) + 1.6));
  const pages = Math.round(10 + 40 * ramp(t, S(97.0), S(102.5)));
  const grade = old ? 'rgba(70,115,185,.22)' : 'rgba(255,165,70,.14)';
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `translate(${whipDir * whip * whip * 90 + Math.sin(t * 83) * shk}px, ${Math.cos(t * 67) * shk}px) scale(${1 + whip * 0.04 + shk * 0.002})`, filter: `contrast(1.06) saturate(1.08)${whip > 0.02 ? ` blur(${whip * 16}px)` : ''}`}}>
        {shot.C(c)}
      </AbsoluteFill>

      <AbsoluteFill style={{background: grade, mixBlendMode: 'soft-light'}} />
      <Shafts t={t} warm={!old} />
      <Cinema t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${(frame * 37) % 220}px ${(frame * 91) % 220}px`, mixBlendMode: 'overlay', opacity: 0.12, pointerEvents: 'none'}} />
      {BRIDGE_AT.map((b) => <Bridge key={b} t={t} at={b} />)}
      {fl > 0 && <><AbsoluteFill style={{background: '#fff', opacity: fl * 0.9}} /><SpeedLines o={Math.min(1, fl * 1.6)} /></>}
      <AbsoluteFill style={{background: '#000', opacity: fadeIn}} />
      <Dust t={t} dense={old} />

      {/* infographics on top of the live shots */}
      {t >= 35.8 && t < 41.8 && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><Dopamine t={t - 35.8} steps={[0.4, 1.8, 3.4, 4.6]} /></svg>}
      {t >= 65.8 && t < 71 && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: ramp(t, 65.8, 66.2) * (1 - ramp(t, 70.4, 71))}}><Scoreboard t={t} popAt={68.9} /></svg>}
      {t >= 111.9 && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: ramp(t, 111.9, 112.4)}}><CheckCalendar t={t - 111.9} /></svg>}
      <Bubble t={t} from={56.4} to={59.3} text={'"Just five more minutes."'} x={430} y={170} />

      <KineticWord t={t} words={[...KWORDS, ...KWORDS2]} />
      <WhoTag t={t} from={65.8} to={68.6} text="NIGHT 1" who="both" icon="moon" />
      <IconTag t={t} from={61.3} to={63.8} text="2:00 AM" icon="clock" color="#ff8a7a" />
      <WhoTag t={t} from={79.7} to={82.5} text="NIGHT 2" who="reader" icon="moon" />
      <WhoTag t={t} from={82.9} to={86.2} text="NIGHT 3" who="reader" icon="bus" />
      <WhoTag t={t} from={89.4} to={92.0} text="DAY 5" who="scroller" icon="sun" color="#ffd9a0" />
      <IconTag t={t} from={95.9} to={97.0} text="BREAKFAST" icon="cup" color="#fff" top={90} />
      <IconTag t={t} from={97.2} to={98.4} text="BATHROOM" icon="sun" color="#fff" top={90} />
      <IconTag t={t} from={98.6} to={99.8} text="BED" icon="moon" color="#fff" top={90} />
      <WhoTag t={t} from={103.0} to={105.3} text="DAY 5" who="reader" icon="cup" color="#ffd9a0" />
      <BigCounter n={pages} o={counterO} label="PAGES" />
      {overlays2(t)}
      {t >= COLD_END && t < REWIND_END && <RewindCard p={(t - COLD_END) / (REWIND_END - COLD_END)} f={(t - COLD_END) * FPS} />}

      {AUDIO_ITEMS.filter((a) => a.outEnd <= SAME2D_END + 0.1).map((a) => (
        <Sequence key={'a' + a.index} from={a.from} durationInFrames={a.dur}>
          <Audio src={staticFile(AUDIO_FILE)} startFrom={Math.round(a.srcStart! * FPS)} endAt={Math.round(a.srcEnd! * FPS)} />
        </Sequence>
      ))}
      <Sfx3 cues={[...CUES3, ...CUES2]} gain={1} minVol={0.3} duck={speechDuck} />
      <Sequence from={0} durationInFrames={Math.round(118 * FPS)}><Music track="low" frames={Math.round(118 * FPS)} vol={0.11} fadeIn={60} fadeOut={90} /></Sequence>
      {MUSIC2.map((m, i) => <Sequence key={'m' + i} from={Math.round(m.from * FPS)} durationInFrames={Math.round((m.to - m.from) * FPS)}><Music track={m.track} frames={Math.round((m.to - m.from) * FPS)} vol={m.vol * 0.7} fadeIn={60} fadeOut={75} /></Sequence>)}
    </AbsoluteFill>
  );
};

// the hook plays first, then the story
export const Same2D: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Sequence from={0} durationInFrames={Math.round(HOOK_END * FPS)}><HookC /></Sequence>
    <Sequence from={Math.round(HOOK_END * FPS)} durationInFrames={SAME2D_FRAMES}><Same2DMain /></Sequence>
  </AbsoluteFill>
);
