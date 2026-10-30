import React from 'react';
import {Face, V, shade as shade0} from '../same2d/Char';
import {HumanFront, HumanSide, Outfit} from './Human';
import {PhoneBack, CupHeld} from './held';

// ============================================================================================
// The cast of Two Fathers, drawn with the SAME rig as Same Man (glass bubble head, black oval eyes, thin black limbs, white gloves, white shoes):
// Adam (navy tee + red tie, greys with age), Sam (rust tee + beard), Leo (blue, spiky hair), Max (green, curls), an aunt (teal, bun).
// This file is the adapter: shots say WHO, AGE, WHERE and which POSE; it picks the front rig (Char: sitting at a desk, clapping, filming) or the
// three-quarter side rig (SideChar: standing, walking, sitting in a chair, carrying, knocking) and drives hands, legs and face.
// Hip-space numbers below are the rigs' own (see Char.tsx / SideChar.tsx).
// ============================================================================================
export type Who = 'adam' | 'sam' | 'leo' | 'max' | 'aunt';
export type FaceP = {gaze?: V; lids?: number; smile?: number; open?: number; brow?: number; tilt?: number; wide?: number; cry?: number};
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const shade = shade0;
const hex = (h: string): [number, number, number] => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, '0')).join(''); };

const TEES: Record<Who, string> = {adam: '#34498f', sam: '#d2733c', leo: '#4a8bd8', max: '#47b57a', aunt: '#2fa39a'};
const OUTFITS: Record<Who, Outfit> = {
  adam: {style: 'suit', top: '#34498f', shirt: '#f3efe6', pants: '#232d52', shoe: '#1b1b22', sleeve: 'long', sole: '#2a2a33', watch: true, simple: true},
  sam: {style: 'cardigan', top: '#c8693a', shirt: '#efe3cf', pants: '#6b4b34', shoe: '#3a2a20', sleeve: 'long', sole: '#2a2018'},
  leo: {style: 'hoodie', top: '#4a8bd8', shirt: '#e8eef8', pants: '#34456e', shoe: '#f2f0f8', sleeve: 'long'},
  max: {style: 'tee', top: '#47b57a', shirt: '#e7f0e4', pants: '#5b6b3f', shoe: '#f2f0f8', sleeve: 'short'},
  aunt: {style: 'tee', top: '#2fa39a', shirt: '#f0ece4', pants: '#5a4a78', shoe: '#3a2a20', sleeve: 'long', sole: '#2a2018'},
};
const VARIANTS: Record<string, Outfit> = {
  work: {style: 'tee', top: '#6f7d93', shirt: '#c9ced8', pants: '#3f4a5a', shoe: '#2a2a33', sleeve: 'long', sole: '#1d1d24'},
  kid: {style: 'tee', top: '#e0a63c', shirt: '#fff', pants: '#34456e', shoe: '#f2f0f8', sleeve: 'short'},
  pjs: {style: 'tee', top: '#7a8fd0', shirt: '#fff', pants: '#5a6ab0', shoe: '#f2f0f8', sleeve: 'long'},
};
// how far the fingers curl for each pose (0 open .. 1 fist)
const CURL: Partial<Record<PoseName, number>> = {cup: 0.75, stand: 0.3, rest: 0.4, desk: 0.35, type: 0.35, phone: 0.8, ear: 0.8, cradle: 0.5, clap: 0.1, knock: 0.9, wave: 0.05, film: 0.5, carry: 0.6, fold: 0.45, point: 0.2, hold: 0.5, raise: 0.8};
const isSon = (w: Who) => w === 'leo' || w === 'max';
// body scale by age (sons grow; fathers stay adult)
export const bodyK = (_w: Who, age: number) => clamp(lerp(0.5, 1, (age - 4) / 18), 0.5, 1);

// the rigs are ~1060 tall at scale 1; the shot list was written for ~900, so every person is scaled by this
export const CHAR_K = 0.85;
export type PoseName = 'cup' | 'stand' | 'rest' | 'desk' | 'phone' | 'ear' | 'cradle' | 'clap' | 'knock' | 'wave' | 'film' | 'carry' | 'fold' | 'point' | 'hold' | 'raise' | 'type';
export type PersonProps = {
  who: Who; age?: number; x: number; y: number; scale?: number; flip?: boolean; t: number; seed?: number; dim?: number; idle?: number;
  turn?: number; lean?: number; tilt?: number; slump?: number; face?: FaceP; legs?: 'stand' | 'sit' | 'none'; sitDrop?: number; walk?: number;
  pose?: PoseName; outfit?: string; top?: string; raise?: number; view?: 'front' | 'side'; handL?: V; handR?: V; enter?: number;
  hN?: V; hF?: V; children?: React.ReactNode;
};

// ---- side view (facing +x): near hand / far hand in the rig's hip space; torso lean and head pitch ----
type H = {N: V; F: V; torso?: number; pitch?: number};
// a sip every few seconds: 0 at rest, 1 with the cup at the lips
const sip = (t: number) => { const p = (t * 0.2) % 1; return p < 0.3 ? Math.sin((p / 0.3) * Math.PI) : 0; };
const SIDE: Record<PoseName, (t: number, r: number) => H> = {
  stand: () => ({N: [22, 92], F: [8, 98]}),
  rest: () => ({N: [150, -40], F: [172, -30]}),
  desk: (t) => ({N: [250 + Math.sin(t * 9) * 14, -125 + Math.max(0, Math.sin(t * 13)) * -16], F: [214 + Math.sin(t * 11) * 14, -112 + Math.max(0, Math.sin(t * 12 + 1)) * -14], torso: 6 + Math.sin(t * 1.3) * 1.5, pitch: 16 + Math.sin(t * 0.8) * 4}),
  type: (t) => ({N: [250 + Math.sin(t * 9) * 14, -125 + Math.max(0, Math.sin(t * 13)) * -16], F: [214 + Math.sin(t * 11) * 14, -112 + Math.max(0, Math.sin(t * 12 + 1)) * -14], torso: 6 + Math.sin(t * 1.3) * 1.5, pitch: 16 + Math.sin(t * 0.8) * 4}),
  phone: (t) => ({N: [150 + Math.sin(t * 2.2) * 4, -250 + Math.max(0, Math.sin(t * 4.4)) * -8], F: [96, -122], pitch: 28 + Math.sin(t * 0.7) * 2}),
  ear: () => ({N: [-92, -452], F: [26, 66], pitch: 2}),
  cup: (t) => { const k = sip(t); return {N: [196 + (176 - 196) * k + Math.sin(t * 0.7) * 4, -168 + (-396 + 168) * k + Math.sin(t * 0.9) * 3], F: [84, -92], pitch: 12 - 10 * k, torso: -2 * k}; },
  cradle: () => ({N: [160, -112], F: [118, -100], torso: -4, pitch: 24}),
  clap: (t) => { const k = (Math.sin(t * 16) + 1) / 2; return {N: [212 - 30 * k, -235], F: [176 + 30 * k, -228]}; },
  knock: (t) => ({N: [300 + Math.max(0, Math.sin(t * 14)) * 26, -250], F: [20, 66]}),
  wave: (t) => ({N: [172, -430 + Math.sin(t * 9) * 30], F: [20, 66]}),
  film: (t) => ({N: [244, -332], F: [208, -342 + Math.sin(t * 2) * 3], pitch: 8}),
  carry: (t) => ({N: [205, -84 + Math.sin(t * 5) * 4], F: [155, -72 + Math.sin(t * 5) * 4], torso: -6}),
  fold: () => ({N: [124, -134], F: [104, -122]}),
  point: (t) => ({N: [330 + Math.max(0, Math.sin(t * 3)) * 26, -272 + Math.sin(t * 3) * 8], F: [20, 66]}),
  hold: (t) => ({N: [200 + Math.sin(t * 0.8) * 4, -100 + Math.sin(t * 1.1) * 4], F: [168, -92 + Math.sin(t * 1.1 + 1) * 3]}),
  raise: (t, r) => ({N: [lerp(26, 300, r) + Math.sin(t * 31) * 2 * r, lerp(66, -250, r) + Math.sin(t * 27) * 2 * r], F: [-26, 76]}),
};
// ---- front view (Char): screen-left / screen-right hands ----
const FRONT: Record<PoseName, (t: number, r: number) => {L: V; R: V; lean?: number}> = {
  stand: () => ({L: [-100, -80], R: [100, -80]}),
  rest: () => ({L: [-70, -30], R: [70, -30]}),
  desk: (t) => ({L: [-76 + Math.sin(t * 9) * 4, -76 + Math.sin(t * 13) * 5], R: [76 + Math.sin(t * 11) * 4, -76 + Math.cos(t * 10) * 5], lean: 4}),
  type: (t) => ({L: [-76 + Math.sin(t * 9) * 4, -76 + Math.sin(t * 13) * 5], R: [76 + Math.sin(t * 11) * 4, -76 + Math.cos(t * 10) * 5], lean: 4}),
  phone: () => ({L: [-100, -80], R: [70, -270], lean: 3}),
  ear: () => ({L: [-100, -80], R: [142, -408]}),
  cup: (t) => { const k = sip(t); return {L: [-96, -70], R: [112 - 78 * k, -150 - 290 * k]}; },
  cradle: () => ({L: [-50, -130], R: [60, -140]}),
  clap: (t) => { const k = (Math.sin(t * 16) + 1) / 2; return {L: [-98 + 34 * k, -240], R: [98 - 34 * k, -240]}; },
  knock: (t) => ({L: [-100, -80], R: [160 + Math.max(0, Math.sin(t * 14)) * 12, -300]}),
  wave: (t) => ({L: [-100, -80], R: [172, -480 + Math.sin(t * 9) * 30]}),
  film: (t) => ({L: [-56, -420], R: [56, -420 + Math.sin(t * 2) * 3]}),
  carry: () => ({L: [-80, -120], R: [80, -120]}),
  fold: () => ({L: [-20, -160], R: [20, -164]}),
  point: () => ({L: [-100, -80], R: [200, -320]}),
  hold: () => ({L: [-80, -100], R: [80, -100]}),
  raise: (t, r) => ({L: [-100, -80], R: [lerp(100, 160, r), lerp(-80, -300, r) + Math.sin(t * 31) * 2 * r]}),
};
// where a held prop (drawn by the shot in the old hip space) must sit for each pose
const SHIFT: Record<'side' | 'front', Partial<Record<PoseName, V>>> = {
  side: {cradle: [150, -40], ear: [-92, -60], carry: [190, -20], film: [150, -10]},
  front: {cradle: [5, -72], ear: [54, -128], carry: [0, -40]},
};
const FRONTY = new Set<PoseName>(['clap', 'film', 'desk', 'type']);
// what a pose puts in the hand (the near / right hand)
const HELD: Partial<Record<PoseName, 'phone' | 'cup'>> = {ear: 'phone', phone: 'phone', cup: 'cup'};
// ease into a pose with a little overshoot (anticipation and settle), so every cut starts with a move and not a freeze
const settle = (k: number) => { const q = clamp(k, 0, 1) - 1; return 1 + 2.4 * q * q * q + 1.4 * q * q; };
const mixV = (a: V, b: V, e: number): V => [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];

// living hands: a slow sway, and, for relaxed poses, a talking gesture that lifts a hand now and then (never a frozen hanging arm)
const FREE = new Set<PoseName>(['stand', 'rest']);
const lively = (t: number, sd: number, pose: PoseName, e: number): [V, V, number] => {
  const a = FREE.has(pose) ? 1 : 0.3, g = Math.pow(Math.max(0, Math.sin(t * 0.85 + sd * 7)), 3) * (FREE.has(pose) ? 1 : 0), g2 = Math.pow(Math.max(0, Math.sin(t * 0.6 + sd * 3 + 2)), 4) * (FREE.has(pose) ? 1 : 0);
  const dN: V = [(Math.sin(t * 1.3 + sd) * 9 + g * 70) * a * e, (Math.sin(t * 1.9 + sd * 2) * 7 - g * 150) * a * e];
  const dF: V = [(Math.sin(t * 1.1 + sd * 3) * 8 + g2 * 40) * a * e, (Math.sin(t * 1.7 + sd) * 6 - g2 * 90) * a * e];
  return [dN, dF, Math.sin(t * 0.55 + sd * 2) * 1.6 + g * 1.5];
};
export const Person: React.FC<PersonProps> = (p) => {
  const {who, age = isSon(who) ? 30 : 40, x, y, scale = 1, t, seed, dim = 0, idle = 1, turn = 0, slump = 0, walk = 0} = p;
  const pose: PoseName = p.pose ?? 'stand';
  const legs = p.legs ?? 'stand', sitting = legs === 'sit';
  const view = p.view ?? (sitting && FRONTY.has(pose) ? 'front' : 'side');
  const k = bodyK(who, age), sc = scale * k * CHAR_K;
  const grey = isSon(who) ? 0 : clamp((age - 38) / 27, 0, 1);
  const outfit: Outfit = {...(VARIANTS[p.outfit ?? ''] ?? OUTFITS[who]), top: p.top ?? (VARIANTS[p.outfit ?? '']?.top ?? OUTFITS[who].top), simple: true}, tee = p.top ?? TEES[who], sd = seed ?? (who === 'adam' ? 0.3 : who === 'sam' ? 0.7 : who === 'leo' ? 1.1 : who === 'max' ? 1.6 : 2.0);
  const f = p.face ?? {};
  const face: Face = {gaze: f.gaze, lids: f.lids, smile: f.smile, open: f.open, brow: f.brow, browTilt: f.tilt, wide: f.wide};
  const e = p.enter === undefined ? 1 : settle(p.enter);
  const raise = p.raise ?? 1, stoop = (who === 'adam' || who === 'sam') ? clamp((age - 50) / 15, 0, 1) * 5 : 0;
  const shift = SHIFT[view][pose] ?? [0, 0];
  const holds = HELD[pose], heldNode = holds === 'phone' ? <PhoneBack lit={pose === 'ear' ? 1 : 0.5} /> : holds === 'cup' ? <CupHeld t={t} /> : undefined;
  const kids = p.children && pose !== 'ear' ? <g transform={`translate(${shift[0]} ${shift[1]})`}>{p.children}</g> : null;
  if (view === 'front') {
    const q = FRONT[pose](t, raise);
    const [lvN, lvF, lvT] = lively(t, sd, pose, e);
    const s0 = FRONT.stand(t, 1), L0: V = mixV(s0.L, p.handL ? [p.handL[0], p.handL[1] - 92] : q.L, e), R0: V = mixV(s0.R, p.handR ? [p.handR[0], p.handR[1] - 92] : q.R, e);
    const L: V = [L0[0] + lvF[0], L0[1] + lvF[1]], R: V = [R0[0] + lvN[0], R0[1] + lvN[1]];
    return (
      <HumanFront x={x} y={y} scale={sc} flip={p.flip} lean={(p.lean ?? q.lean ?? 0) + stoop + lvT} head={{turn: clamp(turn, -1, 1), tilt: p.tilt}} face={face} handL={L} handR={R}
        slump={slump} legs={sitting ? 'sit' : 'none'} heldR={heldNode} heldUp={holds === 'cup'} outfit={outfit} t={t} seed={sd} dim={dim} idle={idle} look={who} grey={grey} tie={who === 'adam' && !p.outfit} curl={CURL[pose] ?? 0.35}>{kids}</HumanFront>
    );
  }
  const q = SIDE[pose](t, raise), flip = p.flip ?? turn < 0;
  const sw = Math.sin(walk * Math.PI * 2), cw = Math.cos(walk * Math.PI * 2);
  const walking = !sitting && walk !== 0;
  const rest = Math.sin(t * 0.3 + sd * 4) * 9;
  const footN: V = sitting ? [230, 170] : walking ? [sw * 112, 392 - Math.max(0, -cw) * 52] : [60 + rest, 390];
  const footF: V = sitting ? [300, 172] : walking ? [-sw * 112, 392 - Math.max(0, cw) * 52] : [-54 - rest * 0.5, 395];
  const arms = walking && pose === 'stand' ? -sw * 64 : 0;
  const s1 = SIDE.stand(t, 1), handN0: V = p.hN ?? mixV(s1.N, [q.N[0] + arms, q.N[1]], e), handF0: V = p.hF ?? mixV(s1.F, [q.F[0] - arms, q.F[1]], e);
  const [lvN, lvF, lvT] = walking ? [[0, 0], [0, 0], 0] as [V, V, number] : lively(t, sd, pose, e);
  const handN: V = [handN0[0] + lvN[0], handN0[1] + lvN[1]], handF: V = [handF0[0] + lvF[0], handF0[1] + lvF[1]];
  const bob = walking ? Math.abs(Math.sin(walk * Math.PI * 2)) * 12 * sc : 0;
  return (
    <HumanSide x={x} y={y - bob} scale={sc} flip={flip} torso={(p.lean ?? 0) + lvT + (q.torso ?? 0) * e + (sitting ? -6 : 0) + stoop + (walking ? 2 + Math.abs(cw) * 1.5 : 0)} headPitch={(q.pitch ?? 8) + slump * 6 + Math.sin(t * 0.7 + sd) * 2} turn={clamp(0.85 + Math.abs(turn) * 0.15, 0.6, 1)} face={face}
      handN={handN} handF={handF} footN={footN} footF={footF} look={who} tie={who === 'adam' && !p.outfit} grey={grey} outfit={outfit} t={t} seed={sd} dim={dim} idle={idle} slump={slump} curlN={CURL[pose] ?? 0.35} curlF={0.3} heldN={heldNode} heldUp={holds === 'cup'}>{kids}</HumanSide>
  );
};

// a swaddled newborn for cradling (the adapter moves it to the hands)
export const Baby: React.FC<{x?: number; y?: number; rot?: number; skin?: string; grip?: number}> = ({x = 0, y = -118, rot = -14, grip = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={0} cy={0} rx={96} ry={50} fill="#f4f2fb" stroke="#1d1a2e" strokeWidth={7} />
    <path d="M -60,-20 Q 0,-46 60,-20" fill="none" stroke="#cfc8e6" strokeWidth={7} strokeLinecap="round" />
    <path d="M -30,14 Q 20,32 70,12" fill="none" stroke="#cfc8e6" strokeWidth={6} strokeLinecap="round" />
    <circle cx={-68} cy={-14} r={42} fill="#f1eefb" stroke="#1d1a2e" strokeWidth={7} />
    <ellipse cx={-80} cy={-30} rx={14} ry={7} fill="#fff" opacity={0.9} transform="rotate(-30 -80 -30)" />
    <path d="M -90,-12 q 6,6 13,0 M -62,-12 q 6,6 13,0" fill="none" stroke="#1d1a2e" strokeWidth={4.5} strokeLinecap="round" />
    <path d="M -76,8 q 9,6 17,0" fill="none" stroke="#1d1a2e" strokeWidth={4.5} strokeLinecap="round" />
    <ellipse cx={-92} cy={4} rx={9} ry={6} fill="#f2a6b8" opacity={0.4} />
    <circle cx={-44 + grip * 50} cy={16 - grip * 10} r={14} fill="#fff" stroke="#1d1a2e" strokeWidth={5} />
  </g>
);
