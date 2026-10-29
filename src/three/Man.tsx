import React from 'react';
import * as THREE from 'three';
import {Part} from './toon';

// The Same Man in 3D: a glossy glass-bubble head with a dark hair swoosh, simple black eyes, purple tee, thin black glossy limbs,
// white gloves and domed white shoes. Facing +z, origin at the hips, metres. Torso frame = hips rotated by `lean` (negative leans back).
// Arms are solved with 2-bone IK so the gloves really hold the prop.
export const HEAD = '#f3f0fb', HEAD_GLOW = '#1b1730', TEE = '#9a7be4', TEE_DK = '#8467cf', LIMB = '#1c1a22', GLOVE = '#fbfafd', SHOE = '#f6f5fa', INK = '#16131c';

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const DOWN = V(0, -1, 0);
export const HEAD_C = V(0, 1.06, 0);          // head centre in torso frame
const SHOULDER = (s: number) => V(s * 0.27, 0.56, 0);

export type Hold = {pos: THREE.Vector3; normal: THREE.Vector3; pitch: number};
export type P3 = [number, number, number];
// where a prop sits in torso frame, how the head must pitch to look at it, and the prop's normal (toward the face)
export const holdProp = (pos: P3): Hold => {
  const p = V(...pos), d = p.clone().sub(HEAD_C);
  return {pos: p, normal: d.clone().multiplyScalar(-1).normalize(), pitch: Math.atan2(-d.y, d.z)};
};
// prop travelling from the lap (k = 0) to the reading position (k = 1)
export const holdLerp = (lap: P3, read: P3, k: number) => holdProp(V(...lap).lerp(V(...read), k).toArray() as P3);
export const faceQuat = (n: THREE.Vector3) => new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), n);

const Arm: React.FC<{s: number; target: THREE.Vector3; tee: string; a?: number; b?: number}> = ({s, target, tee, a = 0.36, b = 0.34}) => {
  const S = SHOULDER(s);
  const d = target.clone().sub(S);
  const maxL = a + b - 0.005;
  if (d.length() > maxL) d.setLength(maxL);
  const L = Math.max(d.length(), 0.14), dn = d.clone().normalize();
  const A = Math.acos(THREE.MathUtils.clamp((a * a + L * L - b * b) / (2 * a * L), -1, 1));
  const pole = V(s * 0.5, -1, -0.35);
  const perp = pole.sub(dn.clone().multiplyScalar(pole.dot(dn))).normalize();
  const u = dn.clone().multiplyScalar(Math.cos(A)).add(perp.multiplyScalar(Math.sin(A))).normalize();
  const f = S.clone().add(d).sub(S.clone().add(u.clone().multiplyScalar(a))).normalize();
  const qU = new THREE.Quaternion().setFromUnitVectors(DOWN, u);
  const qF = new THREE.Quaternion().setFromUnitVectors(DOWN, f.applyQuaternion(qU.clone().invert()));
  return (
    <group position={S} quaternion={qU}>
      <Part shape={{k: 's', r: 0.1}} color={tee} gloss rough={0.35} />
      {/* short sleeve, then a thin black tube arm */}
      <Part shape={{k: 'c', r: 0.095, l: 0.04}} color={tee} gloss rough={0.35} pos={[0, -0.09, 0]} />
      <Part shape={{k: 'c', r: 0.045, l: a - 0.22}} color={LIMB} gloss pos={[0, -a / 2 - 0.06, 0]} />
      <group position={[0, -a, 0]} quaternion={qF}>
        <Part shape={{k: 's', r: 0.055}} color={LIMB} gloss />
        <Part shape={{k: 'c', r: 0.042, l: b - 0.17}} color={LIMB} gloss pos={[0, -b / 2 + 0.01, 0]} />
        {/* white glove */}
        <Part shape={{k: 's', r: 0.085}} color={GLOVE} gloss rim={0.008} pos={[0, -b - 0.025, 0]} scale={[1.05, 1.0, 0.85]}>
          <Part shape={{k: 's', r: 0.036}} color={GLOVE} gloss pos={[s * -0.075, 0.03, 0.045]} />
        </Part>
      </group>
    </group>
  );
};

const Leg: React.FC<{s: number; thigh: number; knee: number}> = ({s, thigh, knee}) => (
  <group position={[s * 0.13, 0, 0]} rotation={[thigh, 0, 0]}>
    <Part shape={{k: 'c', r: 0.07, l: 0.3}} color={LIMB} gloss pos={[0, -0.225, 0]} />
    <group position={[0, -0.45, 0]} rotation={[knee, 0, 0]}>
      <Part shape={{k: 's', r: 0.08}} color={LIMB} gloss />
      <Part shape={{k: 'c', r: 0.065, l: 0.34}} color={LIMB} gloss pos={[0, -0.27, 0]} />
      {/* white domed shoe with a dark rim */}
      <Part shape={{k: 's', r: 0.13}} color={SHOE} gloss rim={0.012} pos={[0, -0.545, 0.06]} scale={[0.95, 0.5, 1.55]} />
    </group>
  </group>
);

export type ManProps = {
  lean: number; thigh: number; knee: number;
  hold: Hold; hands: 'book' | 'phone' | 'rest';
  grip?: number;          // 0 hands rest in the lap .. 1 hands on the prop
  lap?: P3;               // where resting hands go (torso frame)
  t: number;              // seconds, drives breathing / blinks
  pitch?: number;         // head pitch override
  yaw?: number;           // head turn
  gaze?: [number, number]; // pupils, -1..1
  lids?: number;          // 0 open .. 1 closed (tired / asleep)
  smile?: number;         // 0 flat .. 1 big smile
  open?: number;          // mouth open 0..1 (yawn / laugh)
  brow?: number;          // raise
  browTilt?: number;      // + worried / soft, - angry
  seed?: number;
  tee?: string;           // shirt colour (the scroller's fades over the year)
  children?: React.ReactNode; // the prop, placed in torso frame
};

export const Man: React.FC<ManProps> = ({lean, thigh, knee, hold, hands, lap = [0.22, 0, 0.4], grip = 1, t, pitch, yaw = 0, gaze = [0, -0.4], lids = 0.1, smile = 0, open = 0, brow = 0, browTilt = 0, seed = 0, tee = TEE, children}) => {
  const breathe = 1 + Math.sin(t * 1.9 + seed) * 0.012;
  const bp = (t * 0.3 + seed * 0.37) % 1;
  const blink = bp < 0.04 ? Math.sin((bp / 0.04) * Math.PI) : 0;
  const cover = Math.min(1, Math.max(lids, blink));
  const resting = hands === 'rest';
  const restT = (s: number) => V(s * lap[0], lap[1], lap[2]);
  const gripT = (s: number) => hold.pos.clone().add(V(s * (hands === 'book' ? 0.17 : 0.06), hands === 'book' ? -0.02 : -0.05, 0)).sub(hold.normal.clone().multiplyScalar(0.045));
  const handT = (s: number) => (resting ? restT(s) : restT(s).lerp(gripT(s), grip));
  const headPitch = (pitch ?? hold.pitch) + Math.sin(t * 0.8 + seed) * 0.012;
  const mouthY = -0.15;
  return (
    <group>
      {/* pelvis + legs */}
      <Part shape={{k: 'c', r: 0.16, l: 0.12}} color={LIMB} gloss rot={[0, 0, Math.PI / 2]} />
      <Leg s={-1} thigh={thigh} knee={knee} />
      <Leg s={1} thigh={thigh} knee={knee} />
      {/* torso: glossy purple tee */}
      <group rotation={[lean, 0, 0]}>
        <group scale={[1, breathe, 1]}>
          <Part shape={{k: 'c', r: 0.255, l: 0.3}} color={tee} gloss rough={0.35} pos={[0, 0.3, 0]} scale={[1, 1, 0.86]} />
        </group>
        {/* collar and neck */}
        <mesh position={[0, 0.65, 0.0]} rotation={[Math.PI / 2 - 0.1, 0, 0]}><torusGeometry args={[0.1, 0.022, 14, 32]} /><meshStandardMaterial color={TEE_DK} roughness={0.5} /></mesh>
        <Part shape={{k: 'cyl', r: 0.045, h: 0.16}} color={INK} pos={[0, 0.7, 0]} />
        <Arm s={-1} target={handT(-1)} tee={tee} />
        <Arm s={1} target={handT(1)} tee={tee} />
        {/* head: big glass bubble */}
        <group position={[0, 0.72, 0]} rotation={[headPitch, yaw, 0]}>
          <group position={[0, 0.34, 0]}>
            <Part shape={{k: 's', r: 0.38}} color={HEAD} gloss rough={0.1} emissive={HEAD_GLOW} rim={0.014}>
              {/* hair: a glassy lens on top with a dark swoosh across the forehead */}
              <Part shape={{k: 's', r: 0.2}} color={HEAD} gloss rough={0.1} emissive={HEAD_GLOW} rim={0.012} rimColor="#2c2733" pos={[-0.07, 0.4, 0.02]} rot={[0, 0, 0.25]} scale={[1.45, 0.42, 1.05]} />
              <Part shape={{k: 's', r: 0.1}} color={INK} gloss rough={0.2} pos={[-0.05, 0.285, 0.27]} rot={[-0.45, 0, 0.22]} scale={[1.7, 0.13, 0.55]} />
            </Part>
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.16, 0.06, 0.33]} rotation={[-0.05, s * 0.2, 0]}>
                {/* eye: glossy black oval that slides toward the gaze point */}
                <group position={[gaze[0] * 0.025, gaze[1] * 0.03, 0.03]}>
                  <Part shape={{k: 's', r: 0.05}} color={INK} gloss rough={0.1} scale={[0.82, 1.35, 0.4]} castShadow={false}>
                    <mesh position={[0.018, 0.04, 0.03]} scale={[1, 1, 0.6]}><sphereGeometry args={[0.014, 12, 8]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
                  </Part>
                </group>
                {/* eyelid in the head colour, anchored at the top so it closes downward */}
                <Part shape={{k: 's', r: 0.08}} color={HEAD} gloss rough={0.1} emissive={HEAD_GLOW} pos={[0, 0.075 * (1 - cover), 0.036]} scale={[1, 1.25 * cover + 0.001, 0.5]} castShadow={false} />
                {/* arched brow */}
                <mesh position={[0, 0.15 + 0.04 * brow, 0.02]} rotation={[0, 0, Math.PI * 0.125 - s * browTilt]}>
                  <torusGeometry args={[0.065, 0.012, 8, 24, Math.PI * 0.75]} /><meshBasicMaterial color={INK} />
                </mesh>
              </group>
            ))}
            {/* mouth: smile line, opens into a dark mouth with a pink tongue */}
            <mesh position={[0, mouthY + 0.03, 0.352]} rotation={[0, 0, Math.PI * 1.1]} scale={[1, Math.abs(smile) * 0.9 + 0.02, 1]}>
              <torusGeometry args={[0.075, 0.012, 8, 24, Math.PI * 0.8]} /><meshBasicMaterial color={INK} side={THREE.DoubleSide} />
            </mesh>
            {open > 0.03 && (
              <group position={[0, mouthY - 0.02, 0.343]}>
                <mesh scale={[1, open, 0.4]}><sphereGeometry args={[0.07, 20, 14]} /><meshBasicMaterial color={INK} /></mesh>
                <mesh position={[0, -0.03 * open, 0.008]} scale={[0.7, 0.4 * open, 0.3]}><sphereGeometry args={[0.06, 14, 10]} /><meshBasicMaterial color="#e88aa0" /></mesh>
              </group>
            )}
          </group>
        </group>
        {children}
      </group>
    </group>
  );
};
