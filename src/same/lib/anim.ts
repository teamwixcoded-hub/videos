import {StickPose} from '../Stick';

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (u: number) => { u = clamp01(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
export const easeOut = (u: number) => 1 - Math.pow(1 - clamp01(u), 3);
export const easeBack = (u: number) => { u = clamp01(u); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
export const ramp = (x: number, a: number, b: number) => clamp01((x - a) / (b - a || 1));
// deterministic pseudo-random in [0,1)
export const rnd = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

type P = [number, number];
const mixP = (a: P, b: P, t: number): P => [mix(a[0], b[0], t), mix(a[1], b[1], t)];

// blend two stick poses: numbers and points are interpolated, discrete things (face, prop, elbow side) switch half way
export const mixPose = (a: StickPose, b: StickPose, t: number): StickPose => {
  const pt = (k: 'handN' | 'handF' | 'footN' | 'footF' | 'look') => (a[k] && b[k] ? mixP(a[k] as P, b[k] as P, t) : (t < 0.5 ? a[k] : b[k]));
  const hold = t < 0.5 ? a : b;
  return {
    hip: mixP(a.hip, b.hip, t), lean: mix(a.lean, b.lean, t), headTilt: mix(a.headTilt ?? 0, b.headTilt ?? 0, t),
    handN: pt('handN') as P, handF: pt('handF') as P, footN: pt('footN') as P, footF: pt('footF') as P, look: pt('look') as P,
    face: hold.face, prop: hold.prop, propHand: hold.propHand, propRot: mix(a.propRot ?? 0, b.propRot ?? 0, t), glow: mix(a.glow ?? 1, b.glow ?? 1, t),
    elbowN: hold.elbowN, elbowF: hold.elbowF, kneeN: hold.kneeN, kneeF: hold.kneeF,
  };
};

export type PKey = {t: number; pose: StickPose; dur?: number};      // t = seconds on the scene clock; dur = seconds to blend INTO this pose
export const poseAt = (keys: PKey[], t: number): StickPose => {
  let i = 0;
  keys.forEach((k, j) => { if (t >= k.t) i = j; });
  if (i === 0) return keys[0].pose;
  const to = keys[i], from = keys[i - 1];
  return mixPose(from.pose, to.pose, easeInOut((t - to.t) / (to.dur ?? 0.7)));
};
