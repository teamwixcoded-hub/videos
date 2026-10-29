import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {Man, holdLerp, P3} from './Man';
import {Phone, Book, ClockFace, Pops} from './props';
import {Part} from './toon';
import {Planter, BookPile} from './harvest';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {AUDIO_FILE, AUDIO_ITEMS, FPS, srcToVideo} from '../same/lib/timeline';
import {SAME_SFX} from '../same/data/sfx';
import {SfxTrack} from '../components/Sfx';
import {Music} from '../components/Music';

// ============================================================================================
// SAME MAN, 3D: S01 Hook, S02 The choice, S03 Night one, S04 Day 5 (0 - 115.3 s = the first two minutes of narration). One bedroom, one camera that moves through it.
// Reader = left (warm lamp, armchair, green accent). Scroller = right (cold phone light, bed, red accent).
// Every beat is pinned to a recording time with S(src) so moving a cut in timeline.json moves the beat.
// ============================================================================================
export const SAME3D_END = 115.3;
export const SAME3D_FRAMES = Math.round(SAME3D_END * FPS);
const S = (src: number) => srcToVideo(src) ?? 0;
const ramp = (t: number, a: number, b: number) => THREE.MathUtils.smoothstep(t, a, b);
const lerp = THREE.MathUtils.lerp;
const pulse = (t: number, at: number, len: number) => (t < at || t > at + len ? 0 : Math.sin(((t - at) / len) * Math.PI));

// ---- anchors (video seconds) ----
const A = {
  phone: S(14.8), bookStart: S(16.4), thump: S(17.3), lookUp: S(19.0),
  feedEnd: S(36.3), clock: S(41.4), yawn: S(42.6), sigh: 51.1,
  spin: S(49.5), shut: S(52.9), seed: S(67.6), bus: S(72.6),
  pops: [27.1, 28.0, 28.9, 31.2, 34.4].map(S),
};
// COLD OPEN (0 - 27.7 s) shows Day 365; the rewind card (27.7 - 28.7) resets time to night one.
export const COLD_END = 27.7, REWIND_END = 28.7;
const MONT = loadMontserrat('normal', {weights: ['800']}).fontFamily;
// the harvest: what the two lives have grown by this moment. Day 365 in the cold open, then it starts from nothing.
const harvest = (t: number) => {
  if (t < COLD_END) return {bloom: 1, thorn: 1};
  return {
    bloom: t < A.shut + 0.5 ? 0 : 0.02 + ramp(t, A.shut + 1, A.shut + 1.6) * 0.04 + ramp(t, 88.9, 112) * 0.1,
    thorn: t < A.seed ? 0 : ramp(t, A.seed + 0.7, A.seed + 1.4) * 0.05 + ramp(t, 88.9, 115) * 0.2,
  };
};

// ---- camera ----
// Pacing measured from the reference cut list: ~2.2 s per shot in the first two minutes, never longer than ~4 s, the camera keeps moving through every cut.
type V3 = [number, number, number];
type Tpl = {p0: V3; p1: V3; t0: V3; t1: V3; f: number; wide?: boolean};
const TPL: Record<string, Tpl> = {
  WIDE_A: {p0: [0, 1.95, 6.2], p1: [0, 1.85, 5.2], t0: [0, 1, -1.5], t1: [0, 1, -1.5], f: 40, wide: true},
  WIDE_B: {p0: [-0.6, 1.7, 4.4], p1: [0.6, 1.8, 5.0], t0: [0, 1, -1.5], t1: [0, 1, -1.5], f: 40, wide: true},
  WIDE_L: {p0: [-1.6, 1.7, 4.5], p1: [-1.9, 1.65, 3.8], t0: [-2.1, 1.1, -1.4], t1: [-2.1, 1.15, -1.4], f: 36},
  WIDE_R: {p0: [1.7, 1.7, 4.2], p1: [2.0, 1.65, 3.5], t0: [2.0, 1.1, -1.8], t1: [2.0, 1.15, -1.8], f: 36},
  SC_CLOSE: {p0: [1.1, 1.55, 0.7], p1: [1.5, 1.5, 0.2], t0: [2.0, 1.35, -2.1], t1: [2.0, 1.35, -2.1], f: 32},
  SC_TIGHT: {p0: [1.5, 1.5, -0.2], p1: [1.75, 1.48, -0.6], t0: [2.0, 1.4, -2.3], t1: [2.0, 1.4, -2.3], f: 24},
  SC_SCREEN: {p0: [1.5, 1.95, -2.6], p1: [1.7, 1.85, -2.5], t0: [2.0, 1.38, -1.85], t1: [2.0, 1.38, -1.85], f: 27},
  SC_SIDE: {p0: [3.4, 1.4, -1.9], p1: [3.2, 1.4, -1.4], t0: [2.0, 1.35, -2.1], t1: [2.0, 1.35, -2.1], f: 30},
  RD_CLOSE: {p0: [-1.0, 1.6, 0.8], p1: [-1.3, 1.6, 0.3], t0: [-2.2, 1.45, -1.4], t1: [-2.2, 1.45, -1.4], f: 32},
  RD_TIGHT: {p0: [-1.5, 1.7, 0], p1: [-1.7, 1.7, -0.4], t0: [-2.3, 1.7, -1.5], t1: [-2.3, 1.7, -1.5], f: 24},
  RD_BOOK: {p0: [-1.2, 1.35, -0.2], p1: [-1.35, 1.3, -0.5], t0: [-2.05, 1.2, -1.0], t1: [-2.05, 1.2, -1.0], f: 26},
  RD_SIDE: {p0: [-3.4, 1.6, -0.6], p1: [-3.3, 1.6, -0.9], t0: [-2.2, 1.5, -1.4], t1: [-2.2, 1.5, -1.4], f: 30},
  CLOCK: {p0: [0.55, 1.0, -2.0], p1: [0.65, 0.95, -2.2], t0: [0.85, 0.85, -3.1], t1: [0.85, 0.85, -3.1], f: 28},
  // harvest shots: the planter on the sill, vines, the tilt from the book up to his face
  VINES: {p0: [1.4, 1.9, -0.4], p1: [0.1, 1.7, -1.9], t0: [-0.4, 1.6, -3.2], t1: [-0.5, 1.45, -3.2], f: 34},
  PLANTER_R: {p0: [0.55, 1.5, -2.2], p1: [0.3, 1.4, -2.6], t0: [-0.2, 1.25, -3.2], t1: [-0.2, 1.25, -3.2], f: 24},
  PLANTER_L: {p0: [-0.95, 1.5, -2.2], p1: [-0.8, 1.4, -2.6], t0: [-0.8, 1.25, -3.2], t1: [-0.8, 1.25, -3.2], f: 24},
  RD_TILT: {p0: [-1.2, 1.2, -0.1], p1: [-1.35, 1.45, -0.3], t0: [-2.05, 1.15, -1.0], t1: [-2.3, 1.75, -1.5], f: 28},
  SC_GAUNT: {p0: [1.0, 1.45, 0.4], p1: [1.45, 1.42, -0.2], t0: [2.0, 1.3, -2.2], t1: [2.0, 1.4, -2.3], f: 28},
};
// [start second, template, flags]  flags: r = reverse the move, p = punch-in (about 1.35x closer), w = whip pan, f = white flash + speed lines, b = particle bridge
type Fx = 'w' | 'f' | 'b';
const SEQ: [number, string, string?][] = [
  // C0 cold open (Day 365, soft moves only, no hard cuts): dust in black, whip onto the phone glow, push past the vines to the planter in shadow,
  // particle bridge to the gaunt man in bed on "phone", match cut to the warm armchair on "book", tilt up to his face, flash + speed lines
  [0, 'SC_GAUNT'], [4.4, 'VINES', 'w'], [9.3, 'WIDE_A', 'w'], [13.2, 'PLANTER_R', 'w'], [17.2, 'SC_GAUNT', 'br'], [18.8, 'RD_CLOSE'], [21.5, 'RD_TILT', 'w'], [25.7, 'WIDE_B', 'f'],
  // S02 the choice
  [28.7, 'SC_CLOSE', 'w'], [30.4, 'SC_SCREEN'], [31.6, 'RD_CLOSE', 'w'], [33.2, 'SC_SIDE'], [34.4, 'SC_TIGHT', 'b'], [35.8, 'RD_TIGHT', 'w'], [37.6, 'SC_SCREEN', 'r'], [38.8, 'RD_BOOK', 'w'],
  [40.6, 'WIDE_R'], [41.8, 'RD_SIDE', 'w'], [43.6, 'RD_CLOSE', 'r'], [45.2, 'SC_CLOSE', 'b'], [46.9, 'CLOCK', 'w'], [48.1, 'RD_TIGHT', 'pr'], [49.6, 'RD_CLOSE'], [51.1, 'WIDE_L', 'w'],
  // S03 night one
  [53.6, 'WIDE_A'], [55.6, 'RD_SIDE', 'w'], [57.4, 'SC_SIDE', 'w'], [59.5, 'CLOCK', 'f'], [61.0, 'CLOCK', 'r'], [62.5, 'RD_BOOK', 'w'], [64.2, 'RD_TIGHT'], [65.8, 'SC_TIGHT', 'w'], [67.4, 'SC_SCREEN'],
  [69.2, 'WIDE_A', 'b'], [71.0, 'RD_CLOSE', 'w'], [73.0, 'SC_CLOSE', 'w'], [75.0, 'WIDE_A', 'r'], [77.6, 'WIDE_R'], [79.4, 'WIDE_A', 'w'], [82.6, 'WIDE_L', 'b'], [84.4, 'WIDE_B'],
  // S04 day 5: the days start to blur, cuts get faster
  [86.9, 'WIDE_A', 'f'], [88.9, 'SC_SIDE', 'w'], [90.4, 'RD_CLOSE', 'w'], [91.8, 'SC_SCREEN'], [93.2, 'RD_BOOK', 'w'], [94.6, 'SC_TIGHT'], [95.8, 'WIDE_A', 'w'], [97.4, 'SC_CLOSE'], [98.8, 'RD_SIDE', 'w'],
  [100.4, 'SC_SIDE', 'w'], [101.6, 'SC_SCREEN', 'w'], [102.8, 'SC_TIGHT', 'w'], [103.9, 'RD_CLOSE', 'b'], [105.4, 'SC_CLOSE', 'w'], [106.6, 'RD_TIGHT', 'w'], [107.8, 'SC_SIDE', 'w'],
  [109.0, 'RD_BOOK'], [110.6, 'WIDE_L', 'w'], [112.0, 'RD_CLOSE', 'r'], [113.4, 'WIDE_A'],
];
type Shot = {from: number; to: number; p0: V3; p1: V3; t0: V3; t1: V3; f0: number; wide?: boolean; fx: string};
const SHOTS: Shot[] = SEQ.map(([from, name, fl = ''], i) => {
  const T = TPL[name], r = fl.includes('r');
  return {from, to: SEQ[i + 1]?.[0] ?? SAME3D_END, p0: r ? T.p1 : T.p0, p1: r ? T.p0 : T.p1, t0: r ? T.t1 : T.t0, t1: r ? T.t0 : T.t1, f0: T.f * (fl.includes('p') ? 0.74 : 1), wide: T.wide, fx: fl.replace(/[rp]/g, '')};
});
const FX_AT = (k: Fx) => SHOTS.filter((s) => s.fx.includes(k)).map((s) => s.from);

// soft studio reflections so the glossy characters have something to reflect
const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.35;
    return () => { scene.environment = null; tex.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
};

const Rig: React.FC<{shot: Shot; t: number}> = ({shot, t}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const p = interpolate(t, [shot.from, shot.to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const L = (a: V3, b: V3) => new THREE.Vector3(...a).lerp(new THREE.Vector3(...b), p);   // linear: the camera never stops
    const pos = L(shot.p0, shot.p1);
    pos.x += Math.sin(t * 0.9) * 0.012; pos.y += Math.sin(t * 1.3 + 1) * 0.008;
    camera.position.copy(pos);
    camera.lookAt(L(shot.t0, shot.t1));
    const c = camera as THREE.PerspectiveCamera;
    c.fov = shot.f0; c.near = 0.05; c.far = 60;
    c.updateProjectionMatrix();
  });
  return null;
};

// ---- clock text: 11:40 -> 2:00 ----
const clockText = (t: number) => {
  const p = THREE.MathUtils.clamp((t - A.spin) / 3, 0, 1);
  const m = Math.round(23 * 60 + 40 + 140 * Easing.inOut(Easing.quad)(p));
  const h = Math.floor(m / 60) % 24, mm = m % 60;
  return `${h % 12 || 12}:${String(mm).padStart(2, '0')}`;
};

// ---- the two men ----
const PHONE_LAP: P3 = [0, -0.12, 0.3], PHONE_READ: P3 = [0, 0.4, 0.5];
const BOOK_LAP: P3 = [0, 0.0, 0.4], BOOK_READ: P3 = [0, 0.42, 0.52];

// In the cold open (Day 365) the scroller is gaunt and faded, the reader is warm. From the rewind on it is night one: both already hold
// their phone and book ("tired, phone in one hand, a book on the arm of the chair").
const Scroller: React.FC<{t: number}> = ({t}) => {
  const old = t < COLD_END;
  const hold = holdLerp(PHONE_LAP, PHONE_READ, 1);
  const pops = A.pops.reduce((m, a) => Math.max(m, pulse(t, a, 0.9)), 0);
  const night = ramp(t, A.spin, A.spin + 3);
  const bored = ramp(t, 66, 70);
  const lids = old ? 0.58 : 0.2 + night * 0.25 + bored * 0.15;
  return (
    <group position={[2.0, 0.78, -1.75]} rotation={[0, -0.2, 0]}>
      <Man lean={-0.87} thigh={-1.7} knee={0.12} hold={hold} hands="phone" t={t} seed={0.3}
        tee={old ? '#7d6f99' : '#9a7be4'} gaze={[0, -0.85]}
        lids={lids} smile={old ? 0 : 0.06 + pops * 0.45} brow={old ? -0.4 : -0.2} browTilt={old ? 0.35 : 0.05}>
        <Phone hold={hold} t={t} />
        <Pops at={A.pops} t={t} pos={[0, 0.72, 0.5]} />
      </Man>
    </group>
  );
};

const Reader: React.FC<{t: number}> = ({t}) => {
  const old = t < COLD_END;
  const away = ramp(t, A.shut + 0.4, A.shut + 1.7);
  const k = 1 - 0.85 * away;
  const hold = holdLerp(BOOK_LAP, BOOK_READ, k);
  const shut = t >= A.shut;
  const sweep = ((t * 0.55) % 1) * 1.1 - 0.55;           // eyes travel along one line, snap back, repeat
  const glance = old ? 0 : pulse(t, A.clock - 0.1, A.yawn - A.clock + 0.5);
  const yawn = old ? 0 : pulse(t, A.yawn, 1.8);
  const relaxed = ramp(t, A.shut, A.shut + 1);
  const reading = !shut;
  const pitch = lerp(0.45, hold.pitch, k) - glance * 0.25 - yawn * 0.35;
  return (
    <group position={[-2.2, 0, -1.3]} rotation={[0, 0.45, 0]}>
      <Part shape={{k: 'b', w: 1.1, h: 0.22, d: 1.0}} color="#8a5535" pos={[0, 0.39, 0.05]} />
      <Part shape={{k: 'b', w: 1.1, h: 1.0, d: 0.2}} color="#8a5535" pos={[0, 0.95, -0.42]} rot={[-0.12, 0, 0]} />
      <Part shape={{k: 'b', w: 0.16, h: 0.3, d: 0.95}} color="#744429" pos={[-0.6, 0.62, 0.05]} />
      <Part shape={{k: 'b', w: 0.16, h: 0.3, d: 0.95}} color="#744429" pos={[0.6, 0.62, 0.05]} />
      <Part shape={{k: 'b', w: 1.0, h: 0.28, d: 0.9, round: 0.1}} color="#b87444" pos={[0, 0.54, 0.08]} />
      <group position={[0.6, 0.84, 0.15]}>
        <Part shape={{k: 'cyl', r: 0.05, h: 0.1}} color="#e8e2d4" />
        {t > S(91.9) && [0, 1, 2].map((i) => {
          const p = (t * 0.7 + i / 3) % 1;
          return <mesh key={i} position={[Math.sin(p * 6 + i) * 0.015, 0.07 + p * 0.22, 0]} scale={0.5 + p}><sphereGeometry args={[0.02, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * (1 - p)} /></mesh>;
        })}
      </group>
      <group position={[0, 0.66, -0.08]}>
        <Man lean={-0.2} thigh={-Math.PI / 2} knee={Math.PI / 2} hold={hold} hands="book" t={t} seed={0.7}
          pitch={pitch} yaw={glance * 0.85} gaze={[reading ? sweep : glance * 0.9, reading ? -0.75 : -0.3 + yawn * 0.5]}
          lids={0.1 + yawn * 0.8 + relaxed * 0.18} open={yawn} smile={old ? 0.55 : 0.25 + relaxed * 0.25 + ramp(t, A.sigh, A.sigh + 0.5) * 0.15} brow={0.1 + yawn * 0.5} browTilt={0.12}>
          <Book hold={hold} flipAt={[A.bookStart + 3.5, A.bookStart + 8.2, S(30.1), S(37.5), S(40.0)]} t={t} shut={shut} />
        </Man>
      </group>
    </group>
  );
};

const Room: React.FC<{t: number; day: number}> = ({t, day}) => {
  const hv = harvest(t);
  return (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 12]} /><meshStandardMaterial color="#4a362b" roughness={0.7} /></mesh>
    <mesh position={[0, 1.6, -3.5]} receiveShadow><planeGeometry args={[14, 3.2]} /><meshStandardMaterial color="#3a4468" roughness={0.95} /></mesh>
    <mesh position={[-5.2, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[14, 3.2]} /><meshStandardMaterial color="#343d5e" roughness={0.95} /></mesh>
    <mesh position={[5.2, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[14, 3.2]} /><meshStandardMaterial color="#3a4468" roughness={0.95} /></mesh>
    <Part shape={{k: 'b', w: 14, h: 0.14, d: 0.05, round: 0.02}} color="#262d48" pos={[0, 0.07, -3.48]} castShadow={false} />
    {/* window + moon */}
    <Part shape={{k: 'b', w: 1.5, h: 1.3, d: 0.1}} color="#232944" pos={[-0.5, 1.8, -3.46]} castShadow={false} />
    <mesh position={[-0.5, 1.8, -3.4]}><planeGeometry args={[1.3, 1.1]} /><meshBasicMaterial color={new THREE.Color('#1a2c63').lerp(new THREE.Color('#ffd9a0'), day)} toneMapped={false} /></mesh>
    <mesh position={[-0.85, 2.05, -3.39]} scale={1 - day}><circleGeometry args={[0.14, 40]} /><meshBasicMaterial color="#eef2ff" toneMapped={false} /></mesh>
    <Part shape={{k: 'b', w: 0.05, h: 1.1, d: 0.05, round: 0.01}} color="#232944" pos={[-0.5, 1.8, -3.38]} castShadow={false} />
    <Part shape={{k: 'b', w: 1.3, h: 0.05, d: 0.05, round: 0.01}} color="#232944" pos={[-0.5, 1.8, -3.38]} castShadow={false} />
    <mesh position={[0, 0.012, -0.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[2.3, 64]} /><meshStandardMaterial color="#5b4670" roughness={1} /></mesh>

    {/* ---- scroller's side (right): bed, nightstand, alarm clock ---- */}
    <Part shape={{k: 'b', w: 1.6, h: 0.3, d: 3.2}} color="#5a4436" pos={[2.0, 0.2, -1.8]} />
    <Part shape={{k: 'b', w: 1.5, h: 0.24, d: 3.1, round: 0.1}} color="#e2dfd8" pos={[2.0, 0.45, -1.8]} />
    <Part shape={{k: 'b', w: 1.7, h: 1.5, d: 0.12}} color="#5a4436" pos={[2.0, 0.9, -3.38]} />
    <Part shape={{k: 's', r: 0.5}} color="#f1efe9" pos={[2.0, 1.0, -3.0]} scale={[1.3, 0.55, 0.45]} />
    <Part shape={{k: 'b', w: 1.5, h: 0.4, d: 1.1, round: 0.16}} color="#46669a" pos={[2.0, 0.78, -0.55]} />
    <Part shape={{k: 'b', w: 0.6, h: 0.55, d: 0.5}} color="#5a4436" pos={[0.85, 0.28, -3.2]} />
    <group position={[0.85, 0.82, -3.2]}>
      <Part shape={{k: 'b', w: 0.26, h: 0.14, d: 0.12, round: 0.03}} color="#202028" rough={0.4}><ClockFace text={clockText(t)} /></Part>
    </group>

    {/* ---- reader's side (left): lamp, shelf ---- */}
    <group position={[-3.5, 0, -2.5]}>
      <Part shape={{k: 'cyl', r: 0.22, h: 0.05}} color="#2e2e34" pos={[0, 0.03, 0]} />
      <Part shape={{k: 'cyl', r: 0.03, h: 1.6}} color="#2e2e34" pos={[0, 0.8, 0]} />
      <mesh position={[0, 1.78, 0]}><cylinderGeometry args={[0.16, 0.3, 0.38, 32, 1, true]} /><meshBasicMaterial color="#ffc46b" toneMapped={false} side={THREE.DoubleSide} /></mesh>
    </group>
    <Part shape={{k: 'b', w: 1.6, h: 2.2, d: 0.4}} color="#654630" pos={[-3.7, 1.1, -3.25]} />
    {[0.5, 1.0, 1.5, 1.95].map((y, i) => (
      <group key={i}>
        {[0, 1, 2, 3, 4].map((j) => <Part key={j} shape={{k: 'b', w: 0.12, h: 0.34, d: 0.26, round: 0.02}} color={['#a33a3a', '#3a6aa3', '#c9a13a', '#4a8a5a', '#7a4a9a'][(i + j) % 5]} pos={[-3.2 - j * 0.2, y - 0.05, -3.02]} />)}
      </group>
    ))}

    <Planter bloom={hv.bloom} thorn={hv.thorn} t={t} seedR={A.shut + 0.6} seedS={A.seed} />
    <BookPile count={t < COLD_END ? 20 : t < 86.9 ? 0 : 3} />
    <Scroller t={t} />
    <Reader t={t} />
  </group>
  );
};

const TITLE = "'Bebas Neue', Impact, sans-serif";

// ---- in-scene kinetic words (Montserrat 800, soft glow, spring in with a quick blur-in, one gold accent word) ----
type KW = {at: number; dur: number; text: string; accent?: number; big?: boolean};
const KWORDS: KW[] = [
  {at: S(0.22), dur: 0.9, text: 'SAME MAN.', accent: 1}, {at: S(1.58), dur: 0.9, text: 'SAME ROOM.', accent: 1}, {at: S(7.1), dur: 1.2, text: 'ONE SMALL CHOICE.', accent: 2},
  {at: 25.8, dur: 1.9, text: 'ONE HABIT.', accent: 1, big: true},
  {at: S(25.9), dur: 0.9, text: 'INSTANTLY.'}, {at: S(39.1), dur: 1.0, text: 'SAME LINE. ×3', accent: 2}, {at: S(43.6), dur: 1.0, text: 'TEN PAGES.', accent: 1},
  {at: A.seed, dur: 1.7, text: 'WHAT YOU SOW', accent: 2},
  {at: S(88.5), dur: 0.9, text: 'BLUR.'}, {at: S(102.0), dur: 1.1, text: 'A PATTERN.', accent: 1},
];
const KineticWord: React.FC<{t: number}> = ({t}) => {
  const w = KWORDS.find((x) => t >= x.at && t < x.at + x.dur);
  if (!w) return null;
  const f = (t - w.at) * FPS;
  const sc = 0.85 + 0.15 * Math.min(1, 1 - Math.pow(1 - Math.min(1, f / 9), 3)) + (f < 9 ? Math.sin((f / 9) * Math.PI) * 0.04 : 0);
  const out = 1 - ramp(t, w.at + w.dur - 0.15, w.at + w.dur);
  const words = w.text.split(' ');
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: w.big ? 'center' : 'flex-start', paddingTop: w.big ? 0 : 96, pointerEvents: 'none'}}>
      <div style={{display: 'flex', gap: w.big ? 34 : 24, transform: `scale(${sc * (w.big ? 1.5 : 1)})`, opacity: Math.min(1, f / 4) * out, filter: f < 6 ? `blur(${(6 - f) * 1.6}px)` : undefined, fontFamily: MONT, fontWeight: 800, fontSize: w.big ? 120 : 92, letterSpacing: 3, textShadow: '0 0 26px rgba(255,255,255,.35), 0 6px 18px rgba(0,0,0,.55)'}}>
        {words.map((x, i) => <span key={i} style={{color: i === w.accent ? '#ffc94d' : '#fff'}}>{x}</span>)}
      </div>
    </AbsoluteFill>
  );
};

// day / time tags: a small icon plus a word in the same style
const IconTag: React.FC<{t: number; from: number; to: number; text: string; icon: 'moon' | 'sun' | 'clock' | 'seed'; color?: string}> = ({t, from, to, text, icon, color = '#fff'}) => {
  const o = Math.min(ramp(t, from, from + 0.3), 1 - ramp(t, to - 0.3, to));
  if (o <= 0) return null;
  const ic = {
    moon: <path d="M30 6a16 16 0 1 0 12 26A13 13 0 0 1 30 6z" fill={color} />,
    sun: <g fill={color}><circle cx="24" cy="24" r="10" />{Array.from({length: 8}, (_, i) => <rect key={i} x="22.5" y="2" width="3" height="8" rx="1.5" transform={`rotate(${i * 45} 24 24)`} />)}</g>,
    clock: <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"><circle cx="24" cy="24" r="17" /><path d="M24 14v10l7 4" /></g>,
    seed: <g fill={color}><ellipse cx="24" cy="30" rx="8" ry="11" /><path d="M24 20c-2-8 4-12 10-12 0 7-4 12-10 12z" /></g>,
  }[icon];
  return (
    <div style={{position: 'absolute', top: 64 - (1 - o) * 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: o, fontFamily: MONT, fontWeight: 800, fontSize: 64, letterSpacing: 4, color, textShadow: '0 0 22px rgba(255,255,255,.3), 0 4px 14px rgba(0,0,0,.55)'}}>
      <svg width="54" height="54" viewBox="0 0 48 48">{ic}</svg>{text}
    </div>
  );
};

// ---- transitions ----
const bell = (d: number, w: number) => Math.max(0, 1 - Math.abs(d) / w);
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// paper scatter: the rewind card
const RewindCard: React.FC<{t: number}> = ({t}) => {
  if (t < COLD_END || t >= REWIND_END) return null;
  const p = (t - COLD_END) / (REWIND_END - COLD_END), f = (t - COLD_END) * FPS;
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

const SpeedLines: React.FC<{o: number}> = ({o}) => (
  <AbsoluteFill style={{opacity: o, background: 'repeating-conic-gradient(from 0deg at 50% 50%, #15151c 0deg 1.2deg, transparent 1.2deg 7deg)', WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 14%, #000 60%)', maskImage: 'radial-gradient(circle at 50% 50%, transparent 14%, #000 60%)'}} />
);

// streaks of light fly across the cut and carry one shot into the next
const Bridge: React.FC<{t: number; at: number}> = ({t, at}) => {
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

// dust drifts through every shot; soft diagonal light shafts from the window and the lamp
const Dust: React.FC<{t: number; dense: boolean}> = ({t, dense}) => (
  <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
    {Array.from({length: dense ? 54 : 38}, (_, i) => {
      const x = (rnd(i, 1) * 110 + Math.sin(t * 0.5 + i) * 1.5 + t * (0.4 + rnd(i, 7))) % 110 - 5;
      const y = ((rnd(i, 2) * 115 - t * (1.2 + rnd(i, 3) * 3)) % 115 + 115) % 115 - 7;
      const r = 2 + rnd(i, 4) * 5;
      return <div key={i} style={{position: 'absolute', left: x + '%', top: y + '%', width: r * 2, height: r * 2, borderRadius: '50%', background: '#fff', opacity: 0.12 + rnd(i, 5) * 0.3, filter: `blur(${rnd(i, 6) > 0.7 ? 3 : 0.6}px)`}} />;
    })}
  </AbsoluteFill>
);
const Shafts: React.FC<{t: number; warm: boolean}> = ({t, warm}) => (
  <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none', opacity: 0.55}}>
    {[0, 1].map((i) => (
      <div key={i} style={{position: 'absolute', top: '-20%', left: 22 + i * 38 + '%', width: '16%', height: '150%', transform: `rotate(${-24 + Math.sin(t * 0.25 + i) * 2}deg)`, background: `linear-gradient(180deg, ${warm ? 'rgba(255,190,110,.16)' : 'rgba(150,185,255,.14)'}, rgba(0,0,0,0) 80%)`, filter: 'blur(26px)'}} />
    ))}
  </AbsoluteFill>
);

// a big number with a small icon above it, ticking up inside the scene
const BigCounter: React.FC<{t: number}> = ({t}) => {
  const a = S(97.0), b = S(102.5);
  const o = Math.min(ramp(t, a - 0.3, a), 1 - ramp(t, b + 1.2, b + 1.6));
  if (o <= 0) return null;
  const n = Math.round(10 + 40 * ramp(t, a, b));
  return (
    <div style={{position: 'absolute', right: 170, top: 120, opacity: o, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: MONT, fontWeight: 800, color: '#ffc94d', textShadow: '0 0 28px rgba(255,201,77,.45), 0 6px 18px rgba(0,0,0,.55)'}}>
      <svg width="64" height="64" viewBox="0 0 48 48"><path d="M6 10c6-3 12-3 18 1 6-4 12-4 18-1v28c-6-3-12-3-18 1-6-4-12-4-18-1z" fill="none" stroke="#ffc94d" strokeWidth="3.5" strokeLinejoin="round" /><path d="M24 11v28" stroke="#ffc94d" strokeWidth="3.5" /></svg>
      <div style={{fontSize: 170, lineHeight: 1}}>{n}</div>
      <div style={{fontSize: 44, letterSpacing: 8}}>PAGES</div>
    </div>
  );
};

const WHIPS = FX_AT('w'), FLASHES = FX_AT('f'), BRIDGES = FX_AT('b');
// the first split-screen whoosh and the phone/book pick-up sounds belong to the old opening, so they are dropped
const BASE_SFX = SAME_SFX.filter((c) => !((c.file === 'whoosh' || c.file === 'boom') && Math.abs(c.at - S(11.5)) < 0.2) && c.file !== 'pickup' && c.file !== 'thump');
const FX_SFX = [
  {file: 'sub', at: 0.3, real: true, vol: 0.4},
  ...WHIPS.map((at) => ({file: 'whoosh', at, real: true, vol: 0.16})),
  ...FLASHES.map((at) => ({file: 'boom', at, real: true, vol: 0.2})),
  ...BRIDGES.map((at) => ({file: 'sparkle', at: at - 0.1, real: true, vol: 0.2})),
  {file: 'whoosh', at: 18.7, real: true, vol: 0.2},                        // match cut, bed to armchair
  {file: 'rewind', at: COLD_END - 0.1, real: true, vol: 0.35},              // the rewind card
  {file: 'plink', at: A.shut + 0.6, real: true, vol: 0.3},                  // gold seed drops
  {file: 'plink', at: A.seed + 0.55, real: true, vol: 0.3},                 // first grey seed drops
];
const S04_SFX = [
  {file: 'notification', at: 87.0, real: true, vol: 0.25}, {file: 'notification', at: 87.6, real: true, vol: 0.25}, {file: 'notification', at: 88.2, real: true, vol: 0.25},
  {file: 'tea', at: S(91.9), real: true, vol: 0.3},
  ...[0, 1, 2, 3, 4].map((i) => ({file: 'swipe', at: 90.5 + i * 2.1, real: true, vol: 0.14})),
  ...[109.4, 110.9, 112.4, 113.9].map((at) => ({file: 'old page', at, real: true, vol: 0.22})),
];

export const Same3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = frame / FPS;
  const old = t < COLD_END;
  const shot = SHOTS.find((s) => t >= s.from && t < s.to) ?? SHOTS[SHOTS.length - 1];
  const day = ramp(t, 86.9, 87.7);                              // S04 morning light
  const swipe = (Math.floor(t / 0.95) % 2) * 0.08;
  const flicker = (old ? 1.5 : 1) * (1 + Math.sin(t * 17) * 0.05 + swipe);
  const fadeIn = 1 - ramp(t, 1.0, 1.7);
  // whip pan: blur and slide peak at the cut, so the cut hides inside the motion
  let whip = 0, whipDir = 0;
  for (const b of WHIPS) { const w = bell(t - b, 0.16); if (w > whip) { whip = w; whipDir = Math.sign(t - b) || 1; } }
  const flashAt = FLASHES.find((b) => t >= b - 0.04 && t < b + 0.4);
  const fl = flashAt === undefined ? 0 : Math.max(0, 1 - (t - flashAt) / 0.4);
  const hemi = new THREE.Color('#5566a8').lerp(new THREE.Color('#ffe2b8'), day).getStyle();
  const sun = new THREE.Color('#8aa2ff').lerp(new THREE.Color('#ffc98a'), day).getStyle();
  // one mood colour per act, the whole frame: steel blue for the cold open, warm amber after the rewind
  const grade = old ? 'rgba(70,115,185,.26)' : 'rgba(255,165,70,.17)';
  const sat = old ? 0.72 : 1;
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: `translateX(${whipDir * whip * whip * 90}px) scale(${1 + whip * 0.04})`, filter: `saturate(${sat})${whip > 0.02 ? ` blur(${whip * 16}px)` : ''}`}}>
        <ThreeCanvas width={width} height={height} shadows="soft" camera={{fov: 40, position: [0, 2, 6]}} gl={{antialias: true}}>
          <color attach="background" args={['#05060b']} />
          <fog attach="fog" args={['#070914', 9, 22]} />
          <hemisphereLight args={[hemi, '#241a1f', 0.75 + day * 0.9]} />
          {/* moon at night, sun in the morning */}
          <directionalLight color={sun} intensity={1.1 + day * 1.2} position={[-1, 4, 6]} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={5} shadow-camera-bottom={-3} />
          {/* scroller: cold phone light, flickers with each swipe */}
          <pointLight color="#4aa8ff" intensity={6 * flicker} distance={5} decay={1.3} position={[2.0, 1.5, -1.3]} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0006} />
          {/* reader: warm lamp */}
          <pointLight color="#ffb25a" intensity={13 * (1 - 0.5 * day)} distance={8} decay={1.3} position={[-3.0, 1.9, -1.8]} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0006} />
          <pointLight color="#ffb25a" intensity={2.5} distance={3.2} decay={1.3} position={[-1.7, 1.8, -0.4]} />
          {/* the planter glows: warm fruit on one side, a cold sickly light on the other */}
          <pointLight color="#ffcf5a" intensity={1.2 * harvest(t).bloom} distance={1.6} decay={1.4} position={[-0.9, 1.6, -3.0]} />
          <Env />
          <Rig shot={shot} t={t} />
          <Room t={t} day={day} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* whole-frame grade, light shafts, dust, vignette */}
      <AbsoluteFill style={{background: grade, mixBlendMode: 'soft-light'}} />
      <Shafts t={t} warm={!old} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)'}} />
      {BRIDGES.map((b) => <Bridge key={b} t={t} at={b} />)}
      {fl > 0 && <><AbsoluteFill style={{background: '#fff', opacity: fl * 0.9}} /><SpeedLines o={Math.min(1, fl * 1.6)} /></>}
      <AbsoluteFill style={{background: '#000', opacity: fadeIn}} />
      <Dust t={t} dense={old} />

      <KineticWord t={t} />
      <IconTag t={t} from={55.6} to={58.6} text="NIGHT 1" icon="moon" />
      <IconTag t={t} from={A.spin + 2.6} to={A.spin + 5} text="2:00 AM" icon="clock" color="#ff8a7a" />
      <IconTag t={t} from={A.bus + 3.6} to={86.9} text="NIGHT 2" icon="moon" />
      <IconTag t={t} from={86.9} to={89.6} text="DAY 5" icon="sun" color="#ffd9a0" />
      <BigCounter t={t} />
      <RewindCard t={t} />

      {AUDIO_ITEMS.filter((a) => a.outEnd <= SAME3D_END + 0.1).map((a) => (
        <Sequence key={'a' + a.index} from={a.from} durationInFrames={a.dur}>
          <Audio src={staticFile(AUDIO_FILE)} startFrom={Math.round(a.srcStart! * FPS)} endAt={Math.round(a.srcEnd! * FPS)} />
        </Sequence>
      ))}
      <SfxTrack cues={[...BASE_SFX, ...FX_SFX, ...S04_SFX]} />
      <Sequence from={0} durationInFrames={SAME3D_FRAMES}><Music track="low" frames={SAME3D_FRAMES} vol={0.16} fadeIn={60} fadeOut={90} /></Sequence>
    </AbsoluteFill>
  );
};
