import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';
import {Head, Expression, HeadSet} from './Head';

// Limbs: angle 0 = straight down, + swings towards +x (right, the way he faces unless flipped).
// Torso/neck: 0 = upright, + leans right. `rotate` turns the whole body (lying down).
export type Pose = {
  torso: number; neck: number;
  shoulderL: number; elbowL: number; shoulderR: number; elbowR: number;
  hipL: number; kneeL: number; hipR: number; kneeR: number;
  rotate?: number;
};

export const POSES = {
  standingTall: {torso: 0, neck: 0, shoulderL: 8, elbowL: 6, shoulderR: -8, elbowR: -6, hipL: 4, kneeL: 2, hipR: -4, kneeR: -2},
  slumped: {torso: 22, neck: 18, shoulderL: 14, elbowL: 4, shoulderR: 10, elbowR: 0, hipL: 80, kneeL: 5, hipR: 85, kneeR: 8},
  sittingChair: {torso: -6, neck: -4, shoulderL: 20, elbowL: 100, shoulderR: 30, elbowR: 110, hipL: 85, kneeL: 5, hipR: 90, kneeR: 8},
  readBook: {torso: 4, neck: 8, shoulderL: 28, elbowL: 112, shoulderR: 34, elbowR: 118, hipL: 85, kneeL: 5, hipR: 90, kneeR: 8},
  slumpReadBook: {torso: 14, neck: 22, shoulderL: 28, elbowL: 112, shoulderR: 34, elbowR: 118, hipL: 85, kneeL: 5, hipR: 90, kneeR: 8},
  // facing right: the right arm swings back (-x); flipped, that points toward the viewer's right
  reachBack: {torso: -4, neck: 6, shoulderL: 12, elbowL: 6, shoulderR: -80, elbowR: -100, hipL: 85, kneeL: 5, hipR: 90, kneeR: 8},
  phoneHold: {torso: 14, neck: 16, shoulderL: 14, elbowL: 6, shoulderR: 62, elbowR: 118, hipL: 85, kneeL: 5, hipR: 90, kneeR: 8},
  eatPhone: {torso: 10, neck: 14, shoulderL: 55, elbowL: 125, shoulderR: 38, elbowR: 100, hipL: 85, kneeL: 5, hipR: 90, kneeR: 8},
  brushPhone: {torso: 4, neck: 8, shoulderL: 40, elbowL: 110, shoulderR: 60, elbowR: 160, hipL: 5, kneeL: 2, hipR: -3, kneeR: -2},
  lyingSide: {torso: 0, neck: 8, shoulderL: 40, elbowL: 150, shoulderR: 30, elbowR: 140, hipL: 8, kneeL: -28, hipR: 16, kneeR: -18, rotate: 90},
  lyingBack: {torso: 0, neck: 0, shoulderL: 20, elbowL: 160, shoulderR: 25, elbowR: 150, hipL: 5, kneeL: 0, hipR: -5, kneeR: 0, rotate: 90},
  cheer: {torso: -4, neck: -6, shoulderL: -150, elbowL: -170, shoulderR: 150, elbowR: 170, hipL: 6, kneeL: 3, hipR: -6, kneeR: -3},
  shrugHurt: {torso: 6, neck: 10, shoulderL: 20, elbowL: 60, shoulderR: 20, elbowR: 60, hipL: 3, kneeL: 2, hipR: -3, kneeR: -2},
  handOut: {torso: 0, neck: 0, shoulderL: 8, elbowL: 6, shoulderR: 70, elbowR: 80, hipL: 4, kneeL: 2, hipR: -4, kneeR: -2},
} satisfies Record<string, Pose>;

export type PoseName = keyof typeof POSES;
export type PoseKey = {at: number; pose: PoseName; damping?: number; stiffness?: number};
export type ExprKey = [frame: number, expr: Expression];

const LEN = {torso: 170, neck: -4, upperArm: 85, foreArm: 80, thigh: 100, shin: 100, head: 200};
const W = {torso: 92, collar: 44, upperArm: 27, foreArm: 24, thigh: 36, shin: 31, outline: 7};
const rad = (d: number) => (d * Math.PI) / 180;
const polar = (x: number, y: number, deg: number, len: number): [number, number] => [x + Math.sin(rad(deg)) * len, y + Math.cos(rad(deg)) * len];
const mix = (a: Pose, b: Pose, t: number): Pose => {
  const out: Record<string, number> = {};
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => (out[k] = (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * t));
  return out as unknown as Pose;
};
type P2 = [number, number];

// Which expression to flash for a blink, so the mouth stays close to the open-eyed face.
const BLINK_FACE: Partial<Record<Expression, Expression>> = {
  smile: 'relieved', content: 'relieved', 'read-smile': 'relieved', proud: 'relieved',
  tired: 'closed-tired', bored: 'closed-tired', 'read-bored': 'closed-tired', glazed: 'closed-tired', 'phone-stare': 'closed-tired', 'phone-slack': 'closed-tired', sad: 'closed-tired',
  neutral: 'closed', 'read-calm': 'closed', 'read-puzzled': 'closed', 'read-absorbed': 'closed', focused: 'closed', 'look-up-right': 'closed', 'look-left': 'closed', surprised: 'closed',
};

const FADE = 5; // frames for an expression crossfade

export const StickRig: React.FC<{
  poses: PoseKey[]; // springs from key to key, so movement never snaps
  exprs?: ExprKey[]; // expression timeline, crossfaded
  expression?: Expression;
  set?: HeadSet;
  talking?: [number, number][]; // frame ranges where the mouth flaps
  x?: number; y?: number; scale?: number; flip?: boolean;
  idle?: number; // breathing amount, 1 = default, 0 = frozen
  seed?: number; // offsets idle + blink so two characters don't move in sync
  reading?: [number, number][]; // frame ranges where the head scans along the lines
  tap?: [number, number][]; // frame ranges where the foot taps
  shake?: [number, number][]; // frame ranges where the body shakes (laughing)
  blink?: boolean;
  shadow?: boolean;
  renderHeld?: (hand: P2, t: number) => React.ReactNode;
  renderHeldL?: (hand: P2, t: number) => React.ReactNode;
}> = ({poses, exprs, expression = 'neutral', set = 'hero', talking = [], x = 960, y = 640, scale = 1, flip, idle = 1, seed = 0, reading = [], tap = [], shake = [], blink = true, shadow = true, renderHeld, renderHeldL}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // the pose at any frame is a pure function of time, so we can also sample the past (for follow-through)
  const poseAt = (f: number): Pose => {
    let idx = 0;
    poses.forEach((k, i) => { if (f >= k.at) idx = i; });
    const cur = poses[idx];
    const prev = poses[Math.max(0, idx - 1)];
    const t = idx === 0 ? 1 : spring({frame: f - cur.at, fps, config: {damping: cur.damping ?? 14, stiffness: cur.stiffness ?? 90}});
    return mix(POSES[prev.pose] as Pose, POSES[cur.pose] as Pose, t);
  };
  const base = poseAt(frame);
  const past = poseAt(Math.max(0, frame - 4));
  const idx0 = poses.reduce((a, k, i) => (frame >= k.at ? i : a), 0);
  const t = idx0 === 0 ? 1 : spring({frame: frame - poses[idx0].at, fps, config: {damping: poses[idx0].damping ?? 14, stiffness: poses[idx0].stiffness ?? 90}});

  // secondary motion: breathing, head follow-through, line scanning, foot tap
  const ph = (frame / fps) * Math.PI * 2;
  const breath = Math.sin(ph / 3.2 + seed) * idle;
  const inRange = (rs: [number, number][]) => rs.some(([a, b]) => frame >= a && frame < b);
  let scanOffset = 0;
  if (inRange(reading)) {
    const x01 = (frame % 54) / 54;
    scanOffset = (x01 < 0.85 ? x01 / 0.85 : 1 - (x01 - 0.85) / 0.15) * 5 - 2.5;
  }
  const tapOffset = inRange(tap) ? Math.max(0, Math.sin(frame / 2.6)) * 9 : 0;
  const shaking = inRange(shake) ? Math.sin(frame * 2.3) : 0;
  const follow = Math.max(-14, Math.min(14, (past.torso - base.torso) * 1.1));
  const p: Pose = {
    ...base,
    torso: base.torso + breath * 1.2 + shaking * 1.6,
    neck: base.neck + Math.sin(ph / 4.7 + seed * 2) * 1.6 * idle + follow + scanOffset + shaking * 3,
    shoulderL: base.shoulderL + breath * 1.5 + shaking * 4,
    shoulderR: base.shoulderR - breath * 1.5 - shaking * 4,
    kneeR: base.kneeR - tapOffset,
  };
  const bob = breath * 1.5 + Math.abs(shaking) * 3;

  // joints
  const hip: P2 = [0, bob];
  const torsoDir = 180 - p.torso;
  const neckBase = polar(hip[0], hip[1], torsoDir, LEN.torso);
  const shoulder = polar(hip[0], hip[1], torsoDir, LEN.torso * 0.9);
  const headCenter = polar(neckBase[0], neckBase[1], 180 - p.neck, LEN.neck + LEN.head / 2);
  const limb = (o: P2, a1: number, l1: number, a2: number, l2: number) => {
    const mid = polar(o[0], o[1], a1, l1);
    return {mid, end: polar(mid[0], mid[1], a2, l2)};
  };
  const armL = limb(shoulder, p.shoulderL, LEN.upperArm, p.elbowL, LEN.foreArm);
  const armR = limb(shoulder, p.shoulderR, LEN.upperArm, p.elbowR, LEN.foreArm);
  const legL = limb(hip, p.hipL, LEN.thigh, p.kneeL, LEN.shin);
  const legR = limb(hip, p.hipR, LEN.thigh, p.kneeR, LEN.shin);

  // expression: current + previous, crossfaded; blink overrides briefly; squash when it changes
  const track: ExprKey[] = exprs ?? [[0, expression]];
  let ei = 0;
  track.forEach(([f], i) => { if (frame >= f) ei = i; });
  const [ef, eNow] = track[ei];
  const ePrev = track[Math.max(0, ei - 1)][1];
  const fade = ei === 0 ? 1 : interpolate(frame - ef, [0, FADE], [0, 1], {extrapolateRight: 'clamp'});
  const isTalking = inRange(talking);
  const talkFrame = (['talk-o', 'talk-wide', 'talk-o', 'neutral'] as Expression[])[Math.floor(frame / 4) % 4];
  let shownNow: Expression = isTalking && set === 'hero' ? talkFrame : eNow;
  if (blink && set === 'hero' && !isTalking) {
    let bt = Math.round(fps * (1.2 + random(`b0-${seed}`) * 2));
    for (let n = 1; bt <= frame && n < 400; n++) {
      if (frame < bt + 4 && fade >= 1) { shownNow = BLINK_FACE[eNow] ?? eNow; break; }
      bt += Math.round(fps * (2.8 + random(`b${n}-${seed}`) * 2.4));
    }
  }
  const since = frame - ef;
  const squash = ei === 0 || since < 0 ? 0 : Math.exp(-since / 6) * Math.sin(since * 0.9) * 0.09;

  // ---- drawing helpers: outlined tubes so limbs read as solid shapes, not lines ----
  const OUT = COLORS.ink;
  const path = (pts: P2[]) => pts.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  const tube = (pts: P2[], width: number, fill: string) => (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={path(pts)} stroke={OUT} strokeWidth={width + W.outline * 2} />
      <path d={path(pts)} stroke={fill} strokeWidth={width} />
    </g>
  );
  const hand = (wrist: P2, dir: number) => {
    const thumb = polar(wrist[0], wrist[1], dir + 70, 17);
    return (
      <g>
        <circle cx={thumb[0]} cy={thumb[1]} r={8} fill={COLORS.skin} stroke={OUT} strokeWidth={5} />
        <circle cx={wrist[0]} cy={wrist[1]} r={16} fill={COLORS.skin} stroke={OUT} strokeWidth={6} />
      </g>
    );
  };
  const shoe = (ankle: P2, kneeAngle: number) => {
    const foot = polar(ankle[0], ankle[1], 90 + kneeAngle * 0.15, 20);
    return (
      <g>
        <ellipse cx={foot[0]} cy={ankle[1] + 12} rx={34} ry={17} fill={COLORS.shoe} stroke={OUT} strokeWidth={6} />
        <path d={`M${foot[0] - 22} ${ankle[1] + 22} L${foot[0] + 24} ${ankle[1] + 22}`} stroke={COLORS.sole} strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  };

  // torso: a rounded hoodie shape along the spine
  const nx = Math.cos(rad(torsoDir)), ny = -Math.sin(rad(torsoDir)); // perpendicular to the spine
  const side = (c: P2, w: number, s: number): P2 => [c[0] + nx * w * s, c[1] + ny * w * s];
  const hipL2 = side(hip, W.torso * 0.5, -1), hipR2 = side(hip, W.torso * 0.5, 1);
  const shL2 = side(shoulder, W.torso * 0.56, -1), shR2 = side(shoulder, W.torso * 0.56, 1);
  const collarC = polar(hip[0], hip[1], torsoDir, LEN.torso * 0.97);
  const torsoPath = `M${hipL2[0]} ${hipL2[1]} L${shL2[0]} ${shL2[1]} Q${neckBase[0] + nx * -W.collar} ${neckBase[1] + ny * -W.collar} ${neckBase[0]} ${neckBase[1]} Q${neckBase[0] + nx * W.collar} ${neckBase[1] + ny * W.collar} ${shR2[0]} ${shR2[1]} L${hipR2[0]} ${hipR2[1]} Q${hip[0]} ${hip[1] + 18} ${hipL2[0]} ${hipL2[1]} Z`;
  const pocketA = polar(hip[0], hip[1], torsoDir, LEN.torso * 0.18), pocketB = polar(hip[0], hip[1], torsoDir, LEN.torso * 0.42);
  const pocket = `M${pocketA[0] + nx * -30} ${pocketA[1] + ny * -30} L${pocketB[0] + nx * -24} ${pocketB[1] + ny * -24} L${pocketB[0] + nx * 24} ${pocketB[1] + ny * 24} L${pocketA[0] + nx * 30} ${pocketA[1] + ny * 30}`;

  const lowest = Math.max(legL.end[1], legR.end[1]) + 26;

  return (
    <g transform={`translate(${x} ${y}) rotate(${p.rotate ?? 0}) scale(${flip ? -scale : scale} ${scale})`}>
      {shadow && !p.rotate && <ellipse cx={hip[0] + 20} cy={lowest} rx={150} ry={20} fill="rgba(0,0,0,0.22)" />}
      {/* far leg + far arm (L) */}
      {tube([hip, legL.mid, legL.end], W.thigh, COLORS.pants)}
      {shoe(legL.end, p.kneeL)}
      {tube([shoulder, armL.mid, armL.end], W.upperArm, COLORS.hoodieDark)}
      {hand(armL.end, p.elbowL)}
      {renderHeldL?.(armL.end, t)}
      {/* near leg (R) */}
      {tube([hip, legR.mid, legR.end], W.thigh, COLORS.pants)}
      {shoe(legR.end, p.kneeR)}
      {/* torso / hoodie */}
      <path d={torsoPath} fill={COLORS.hoodie} stroke={OUT} strokeWidth={W.outline} strokeLinejoin="round" />
      <path d={pocket} fill="none" stroke={OUT} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <ellipse cx={collarC[0]} cy={collarC[1]} rx={W.collar + 8} ry={17} transform={`rotate(${-p.torso + (flip ? 0 : 0)} ${collarC[0]} ${collarC[1]})`} fill={COLORS.hoodieDark} stroke={OUT} strokeWidth={6} />
      {/* near arm (R) */}
      {tube([shoulder, armR.mid, armR.end], W.upperArm, COLORS.hoodie)}
      {hand(armR.end, p.elbowR)}
      {renderHeld?.(armR.end, t)}
      {/* head */}
      <g transform={`translate(${headCenter[0] - LEN.head / 2} ${headCenter[1] - LEN.head / 2}) rotate(${p.neck} ${LEN.head / 2} ${LEN.head / 2 + 60}) translate(${LEN.head / 2} ${LEN.head / 2 + 60}) scale(${1 - squash} ${1 + squash}) translate(${-LEN.head / 2} ${-LEN.head / 2 - 60})`}>
        <foreignObject width={LEN.head} height={LEN.head} style={{overflow: 'visible'}}>
          <div style={{position: 'relative', width: LEN.head, height: LEN.head}}>
            {fade < 1 && <div style={{position: 'absolute', inset: 0}}><Head expression={ePrev} set={set} size={LEN.head} /></div>}
            <div style={{position: 'absolute', inset: 0, opacity: fade}}><Head expression={shownNow} set={set} size={LEN.head} /></div>
          </div>
        </foreignObject>
      </g>
    </g>
  );
};
