import React from 'react';

// ============================================================================================
// STICK: one simple stick-figure man drawn with thick, painted brush strokes. Two of him: the Reader (green) and the Scroller (red).
// Pure vector: every limb is a 2-bone chain solved from hand/foot targets, so poses are just a few numbers and any in-between is exact.
// Figure space: y down, ground at y = 0, standing hip at about y = -270. Face looks right; mirror with `flip`.
// ============================================================================================
type P = [number, number];
export type Face = 'neutral' | 'happy' | 'tired' | 'sad' | 'surprised' | 'asleep' | 'smirk' | 'worried';
export type Prop = 'none' | 'phone' | 'book' | 'bookClosed' | 'mug';
export type StickPose = {
  hip: P; lean: number; headTilt?: number;            // degrees; lean > 0 leans forward (to the right)
  handN: P; handF?: P;                                // near / far hand targets
  footN: P; footF?: P;                                // near / far foot targets
  face?: Face; look?: P;                              // look: eye offset, -1..1
  prop?: Prop; propHand?: 'N' | 'F' | 'both'; propRot?: number; glow?: number;
  elbowN?: 1 | -1; elbowF?: 1 | -1; kneeN?: 1 | -1; kneeF?: 1 | -1;
};
const L = {torso: 150, neck: 26, head: 72, upper: 98, fore: 94, thigh: 128, shin: 126};
const d2r = (d: number) => (d * Math.PI) / 180;
const dir = (deg: number): P => [Math.sin(d2r(deg)), -Math.cos(d2r(deg))];
const add = (a: P, b: P, k = 1): P => [a[0] + b[0] * k, a[1] + b[1] * k];
const ik = (o: P, t: P, a: number, b: number, s: number): {mid: P; end: P} => {
  const dx = t[0] - o[0], dy = t[1] - o[1], d0 = Math.hypot(dx, dy) || 1, d = Math.min(a + b - 0.5, Math.max(Math.abs(a - b) + 0.5, d0));
  const base = Math.atan2(dy, dx), ang = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d))));
  return {mid: [o[0] + a * Math.cos(base + s * ang), o[1] + a * Math.sin(base + s * ang)], end: [o[0] + (dx / d0) * d, o[1] + (dy / d0) * d]};
};
const INK = '#1a1820';

export const BrushDefs: React.FC<{id: string}> = ({id}) => (
  <defs>
    {/* wobbly edge + dry-brush streaks: this is what makes the line look painted instead of vector-clean */}
    <filter id={`brush-${id}`} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="4" result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="11" xChannelSelector="R" yChannelSelector="G" result="wob" />
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves="2" seed="9" result="streak" />
      <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 2.0" result="streakA" />
      <feComposite in="wob" in2="streakA" operator="in" />
    </filter>
  </defs>
);

const Stroke: React.FC<{pts: P[]; w: number; c?: string; o?: number}> = ({pts, w, c = INK, o = 1}) => (
  <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} />
);

const FaceMarks: React.FC<{c: P; face: Face; look: P}> = ({c, face, look}) => {
  const ex = 20, ey = -6, lx = look[0] * 8, ly = look[1] * 6;
  const eye = (x: number) => {
    if (face === 'asleep') return <path d={`M${c[0] + x - 9},${c[1] + ey} q9,9 18,0`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />;
    if (face === 'tired') return <g><ellipse cx={c[0] + x + lx} cy={c[1] + ey + 3 + ly} rx="8" ry="4.5" fill={INK} /><path d={`M${c[0] + x - 12},${c[1] + ey - 3} l24,3`} stroke={INK} strokeWidth="5" strokeLinecap="round" /></g>;
    const r = face === 'surprised' ? 9.5 : 7.5;
    return <circle cx={c[0] + x + lx} cy={c[1] + ey + ly} r={r} fill={INK} />;
  };
  const brow = (x: number, s: number) => {
    const y = c[1] + ey - 20;
    if (face === 'sad' || face === 'worried') return <path d={`M${c[0] + x - 12 * s},${y + 5} L${c[0] + x + 12 * s},${y - 5}`} stroke={INK} strokeWidth="5" strokeLinecap="round" />;
    if (face === 'surprised') return <path d={`M${c[0] + x - 11},${y - 4} q11,-9 22,0`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />;
    if (face === 'smirk') return <path d={`M${c[0] + x - 11},${y + (s > 0 ? -4 : 2)} l22,${s > 0 ? -3 : 2}`} stroke={INK} strokeWidth="5" strokeLinecap="round" />;
    return null;
  };
  const my = c[1] + 28;
  const mouth =
    face === 'happy' ? <path d={`M${c[0] - 4},${my - 4} q20,22 40,0`} stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" /> :
    face === 'sad' || face === 'worried' ? <path d={`M${c[0] - 2},${my + 8} q18,-16 36,0`} stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" /> :
    face === 'surprised' ? <ellipse cx={c[0] + 18} cy={my + 2} rx="8" ry="11" fill={INK} /> :
    face === 'smirk' ? <path d={`M${c[0] - 2},${my} q20,6 38,-8`} stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" /> :
    face === 'tired' || face === 'asleep' ? <path d={`M${c[0] + 4},${my + 2} l26,2`} stroke={INK} strokeWidth="6" strokeLinecap="round" /> :
    <path d={`M${c[0] + 2},${my} q16,6 34,0`} stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />;
  return <g>{eye(-ex + 22)}{eye(ex + 22)}{brow(-ex + 22, -1)}{brow(ex + 22, 1)}{mouth}</g>;
};

export const Stick: React.FC<{pose: StickPose; accent: string; id: string; flip?: boolean; scale?: number; x?: number; y?: number; opacity?: number; behind?: React.ReactNode; front?: React.ReactNode}> = ({pose, accent, id, flip = false, scale = 1, x = 0, y = 0, opacity = 1, behind = null, front = null}) => {
  const p = pose, lean = p.lean, tilt = p.headTilt ?? 0;
  const hip = p.hip, sh = add(hip, dir(lean), L.torso), neck = add(sh, dir(lean + tilt * 0.4), L.neck), hc = add(neck, dir(lean + tilt), L.head);
  const aN = ik(sh, p.handN, L.upper, L.fore, p.elbowN ?? 1), aF = ik(sh, p.handF ?? [p.handN[0] - 12, p.handN[1] + 10], L.upper, L.fore, p.elbowF ?? 1);
  const lN = ik(hip, p.footN, L.thigh, L.shin, p.kneeN ?? 1), lF = ik(hip, p.footF ?? [p.footN[0] - 40, p.footN[1]], L.thigh, L.shin, p.kneeF ?? 1);
  const face = p.face ?? 'neutral', look = p.look ?? [0.4, 0];
  const prop = p.prop ?? 'none', rot = p.propRot ?? -15;
  const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const pp = p.propHand === 'F' ? aF.end : p.propHand === 'both' ? mid(aN.end, aF.end) : aN.end;
  const propEl =
    prop === 'phone' ? (
      <g transform={`translate(${pp[0]} ${pp[1]}) rotate(${rot})`}>
        <ellipse cx="0" cy="-8" rx={60} ry={80} fill="#7fd4ff" opacity={0.18 * (p.glow ?? 1)} />
        <rect x="-17" y="-48" width="34" height="66" rx="7" fill="#26323f" stroke={INK} strokeWidth="6" />
        <rect x="-11" y="-42" width="22" height="48" rx="3" fill="#8fdcff" opacity="0.95" />
      </g>) :
    prop === 'book' ? (
      <g transform={`translate(${pp[0]} ${pp[1]}) rotate(${rot})`}>
        <path d="M0,-34 Q-30,-46 -62,-36 L-62,26 Q-30,16 0,32 Q30,16 62,26 L62,-36 Q30,-46 0,-34 Z" fill="#f4e4bd" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <path d="M0,-34 L0,32" stroke={INK} strokeWidth="5" />
        <path d="M-50,-20 q22,-6 40,0 M-50,-6 q22,-6 40,0 M-50,8 q22,-6 40,0 M12,-20 q22,-6 40,0 M12,-6 q22,-6 40,0 M12,8 q22,-6 40,0" stroke="#8a7a58" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>) :
    prop === 'bookClosed' ? (
      <g transform={`translate(${pp[0]} ${pp[1]}) rotate(${rot})`}><rect x="-34" y="-46" width="68" height="92" rx="5" fill="#b5473a" stroke={INK} strokeWidth="6" /><rect x="-20" y="-24" width="40" height="8" rx="3" fill="#f2c36a" /></g>) :
    prop === 'mug' ? (
      <g transform={`translate(${pp[0]} ${pp[1]})`}><rect x="-22" y="-30" width="44" height="46" rx="8" fill="#e8dcc4" stroke={INK} strokeWidth="6" /><path d="M22,-18 q22,2 0,26" stroke={INK} strokeWidth="6" fill="none" /></g>) : null;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} opacity={opacity}>
      <BrushDefs id={id} />
      {behind && <g filter={`url(#brush-${id})`}>{behind}</g>}
      <g filter={`url(#brush-${id})`}>
        <Stroke pts={[sh, aF.mid, aF.end]} w={24} o={0.62} />
        <Stroke pts={[hip, lF.mid, lF.end]} w={26} o={0.62} />
        <Stroke pts={[hip, lN.mid, lN.end]} w={28} />
        <Stroke pts={[hip, sh]} w={62} c={accent} />                       {/* painted shirt */}
        <Stroke pts={[hip, sh]} w={10} />
        <Stroke pts={[sh, aN.mid, aN.end]} w={26} />
        <Stroke pts={[sh, neck]} w={18} />
        <circle cx={hc[0]} cy={hc[1]} r={L.head} fill="#f6efe0" stroke={INK} strokeWidth="15" />
        <FaceMarks c={hc} face={face} look={look} />
        {/* shoes */}
        <Stroke pts={[lN.end, add(lN.end, [34, 0])]} w={20} />
        <Stroke pts={[lF.end, add(lF.end, [34, 0])]} w={18} o={0.62} />
      </g>
      {propEl}
      {front && <g filter={`url(#brush-${id})`}>{front}</g>}
    </g>
  );
};

// ---- ready-made poses (figure space) -------------------------------------------------------
const STAND: StickPose = {hip: [0, -270], lean: 2, handN: [46, -150], handF: [-34, -148], footN: [30, 0], footF: [-30, 0], face: 'neutral', elbowN: -1, elbowF: 1};
export const STICK_POSES: Record<string, StickPose> = {
  stand: STAND,
  standTired: {...STAND, lean: 14, headTilt: 18, handN: [78, -130], handF: [32, -126], face: 'tired', look: [0.2, 0.8]},
  // seated on the edge of a bed (seat height 130)
  bedEdgeSlump: {hip: [0, -135], lean: 22, headTilt: 20, handN: [120, -150], handF: [95, -155], footN: [150, 0], footF: [112, 0], face: 'tired', look: [0.3, 0.9], kneeN: -1, kneeF: -1},
  bedEdgePhone: {hip: [0, -135], lean: 12, headTilt: 22, handN: [130, -268], handF: [110, -232], footN: [150, 0], footF: [112, 0], face: 'happy', look: [0.5, 0.9], prop: 'phone', propHand: 'N', propRot: -22, kneeN: -1, kneeF: -1},
  armchairBook: {hip: [0, -140], lean: 2, headTilt: 18, handN: [120, -262], handF: [112, -252], footN: [150, 0], footF: [114, 0], face: 'neutral', look: [0.3, 1], prop: 'book', propHand: 'both', propRot: -8, kneeN: -1, kneeF: -1},
  armchairBookClosed: {hip: [0, -140], lean: 4, headTilt: 10, handN: [118, -180], handF: [100, -176], footN: [150, 0], footF: [114, 0], face: 'tired', look: [0.2, 0.8], prop: 'bookClosed', propHand: 'both', propRot: -35, kneeN: -1, kneeF: -1},
  armchairSlump: {hip: [0, -140], lean: 14, headTilt: 16, handN: [112, -150], handF: [90, -156], footN: [150, 0], footF: [114, 0], face: 'tired', look: [0.3, 0.9], kneeN: -1, kneeF: -1},
  armchairLookUp: {hip: [0, -140], lean: 2, headTilt: 0, handN: [112, -158], handF: [90, -162], footN: [150, 0], footF: [114, 0], face: 'neutral', look: [0.7, -0.3], kneeN: -1, kneeF: -1},
  bedEdgeLookUp: {hip: [0, -135], lean: 6, headTilt: 0, handN: [120, -150], handF: [95, -155], footN: [150, 0], footF: [112, 0], face: 'tired', look: [0.7, -0.3], kneeN: -1, kneeF: -1},
  bedEdgePhoneBored: {hip: [0, -135], lean: 16, headTilt: 24, handN: [130, -262], handF: [110, -228], footN: [150, 0], footF: [112, 0], face: 'tired', look: [0.5, 0.9], prop: 'phone', propHand: 'N', propRot: -22, kneeN: -1, kneeF: -1},
  armchairRelaxed: {hip: [0, -140], lean: -6, headTilt: 4, handN: [112, -168], handF: [88, -172], footN: [150, 0], footF: [114, 0], face: 'happy', look: [0.4, 0.2], kneeN: -1, kneeF: -1},
  armchairYawn: {hip: [0, -140], lean: -2, headTilt: -8, handN: [120, -262], handF: [112, -252], footN: [150, 0], footF: [114, 0], face: 'surprised', look: [0.4, -0.5], prop: 'book', propHand: 'both', propRot: -8, kneeN: -1, kneeF: -1},
  // lying on the back, head to the left on a pillow (hip at x = 0, torso points left)
  lyingPhone: {hip: [0, -60], lean: -90, headTilt: 0, handN: [-150, -250], handF: [-120, -70], footN: [190, -110], footF: [150, -60], face: 'tired', look: [0, -0.8], prop: 'phone', propHand: 'N', propRot: 170, kneeN: -1, kneeF: -1},
  lyingAsleep: {hip: [0, -60], lean: -90, headTilt: 0, handN: [-110, -60], handF: [-80, -60], footN: [200, -60], footF: [170, -60], face: 'asleep', look: [0, 0], kneeN: -1, kneeF: -1},
  walk: {hip: [0, -270], lean: 6, handN: [60, -170], handF: [-52, -176], footN: [78, -8], footF: [-70, 0], face: 'neutral'},
};
