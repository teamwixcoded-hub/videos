import React from 'react';
import {INK, LIMB, TEE, GLOVE, SHOE, shade, Face, V, Head, Look} from './Char';

// ============================================================================================
// The Same Man in three-quarter SIDE view. Facing +x (use flip to face left). Origin = the hip joint, +y down, all targets are in "hip space".
// The torso rotates about the hip (+ leans forward, - leans back). Arms and legs are 2-bone IK to hand and foot targets, so a book held out
// at arm's length, a phone held at chest height, or feet flat on the floor are just numbers. Near limbs are drawn in front, far limbs behind
// and a little darker. The head is the same glass bubble in three-quarter turn.
// ============================================================================================
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const rot = (p: V, deg: number): V => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
const mix = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

// two-bone IK: returns the joint (elbow / knee); `pick` chooses between the two mirror solutions
export const ik2 = (S: V, T: V, a: number, b: number, pick: (c: [V, V]) => V): {J: V; H: V} => {
  let dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy);
  const maxd = a + b - 1;
  if (d > maxd) { dx *= maxd / d; dy *= maxd / d; d = maxd; }
  d = Math.max(d, 40);
  const base = Math.atan2(dy, dx), A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  const c: [V, V] = [[S[0] + Math.cos(base + A) * a, S[1] + Math.sin(base + A) * a], [S[0] + Math.cos(base - A) * a, S[1] + Math.sin(base - A) * a]];
  return {J: pick(c), H: [S[0] + dx, S[1] + dy]};
};
const lowerElbow = (c: [V, V]) => (c[0][1] > c[1][1] ? c[0] : c[1]);
const forwardKnee = (c: [V, V]) => (c[0][0] > c[1][0] ? c[0] : c[1]);

export type SideProps = {
  x: number; y: number; scale?: number; flip?: boolean;
  torso: number;                 // degrees about the hip: + leans forward, - leans back
  headPitch?: number;            // degrees on top of the torso: + looks down
  turn?: number;                 // 0.6 .. 1 three-quarter turn of the head
  face?: Face;
  handN: V; handF: V;            // near / far hand targets
  footN: V; footF: V;            // near / far ankle targets
  legUp?: boolean;               // lying down: knees bend upward
  look?: Look; tie?: boolean;    // who it is: hair, glasses, a tie
  tee?: string; t: number; seed?: number; dim?: number; idle?: number; slump?: number;
  children?: React.ReactNode;    // props in hip space, drawn above the body and below the near arm
};

const Glove: React.FC<{H: V; fa: number; dim?: boolean}> = ({H, fa, dim}) => (
  <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`} style={dim ? {filter: 'brightness(0.85)'} : undefined}>
    <ellipse cx={26} cy={2} rx={14} ry={22} fill={GLOVE} stroke={INK} strokeWidth={5} transform="rotate(24 26 2)" />
    <ellipse cx={0} cy={8} rx={36} ry={33} fill={GLOVE} stroke={INK} strokeWidth={6} />
    <path d="M -12,24 Q -10,10 -12,0 M 6,28 Q 8,12 6,0" fill="none" stroke="#c9c3de" strokeWidth={3.5} strokeLinecap="round" />
    <ellipse cx={-8} cy={-2} rx={15} ry={7} fill="#e8e4f6" opacity={0.85} />
    <rect x={-17} y={-28} width={34} height={13} rx={6.5} fill={LIMB} stroke={INK} strokeWidth={4} />
  </g>
);

const SideArm: React.FC<{S: V; T: V; tee: string; dim?: boolean}> = ({S, T, tee, dim}) => {
  const a = 185, b = 170;
  const {J: E, H} = ik2(S, T, a, b, lowerElbow);
  const sl = mix(S, E, 74 / a), fa = (Math.atan2(H[1] - E[1], H[0] - E[0]) * 180) / Math.PI;
  return (
    <g style={dim ? {filter: 'brightness(0.78)'} : undefined}>
      <g stroke={INK} strokeLinecap="round" fill="none">
        <line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={36} /><line x1={E[0]} y1={E[1]} x2={H[0]} y2={H[1]} strokeWidth={34} /><line x1={S[0]} y1={S[1]} x2={sl[0]} y2={sl[1]} strokeWidth={68} />
      </g>
      <g stroke={LIMB} strokeLinecap="round" fill="none"><line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={24} /><line x1={E[0]} y1={E[1]} x2={H[0]} y2={H[1]} strokeWidth={22} /></g>
      <g stroke="#fff" strokeLinecap="round" opacity={0.2} fill="none"><line x1={S[0] - 4} y1={S[1] - 3} x2={E[0] - 4} y2={E[1] - 3} strokeWidth={4} /><line x1={E[0] - 4} y1={E[1] - 3} x2={H[0] - 4} y2={H[1] - 3} strokeWidth={4} /></g>
      <circle cx={E[0]} cy={E[1]} r={15} fill={LIMB} />
      <line x1={S[0]} y1={S[1]} x2={sl[0]} y2={sl[1]} stroke={tee} strokeWidth={56} strokeLinecap="round" />
      <line x1={S[0]} y1={S[1]} x2={sl[0]} y2={sl[1]} stroke={shade(tee, 0.3)} strokeWidth={13} strokeLinecap="round" opacity={0.5} transform="translate(-8 -8)" />
      <Glove H={H} fa={fa} dim={dim} />
    </g>
  );
};

const SideLeg: React.FC<{HJ: V; T: V; dim?: boolean; up?: boolean}> = ({HJ, T, dim, up}) => {
  const a = 200, b = 190;
  const {J: K, H: A} = ik2(HJ, T, a, b, up ? (c) => (c[0][1] < c[1][1] ? c[0] : c[1]) : forwardKnee);
  return (
    <g style={dim ? {filter: 'brightness(0.8)'} : undefined}>
      <g stroke={INK} strokeLinecap="round" fill="none"><line x1={HJ[0]} y1={HJ[1]} x2={K[0]} y2={K[1]} strokeWidth={56} /><line x1={K[0]} y1={K[1]} x2={A[0]} y2={A[1]} strokeWidth={50} /></g>
      <g stroke={LIMB} strokeLinecap="round" fill="none"><line x1={HJ[0]} y1={HJ[1]} x2={K[0]} y2={K[1]} strokeWidth={42} /><line x1={K[0]} y1={K[1]} x2={A[0]} y2={A[1]} strokeWidth={36} /></g>
      <g stroke="#fff" strokeLinecap="round" opacity={0.15} fill="none"><line x1={HJ[0] + 4} y1={HJ[1] - 10} x2={K[0] + 4} y2={K[1] - 10} strokeWidth={5} /></g>
      <circle cx={K[0]} cy={K[1]} r={22} fill={LIMB} />
      {/* white domed shoe, toes forward */}
      <g transform={`translate(${A[0] + 30} ${A[1] + 14})`}>
        <path d="M -48,8 Q -48,-34 4,-36 Q 70,-36 92,-2 Q 100,16 82,22 L -42,22 Q -52,20 -48,8 Z" fill={SHOE} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M -44,15 L 88,15" stroke="#c9c3de" strokeWidth={5} strokeLinecap="round" />
        <ellipse cx={-8} cy={-18} rx={26} ry={8} fill="#fff" opacity={0.9} />
      </g>
    </g>
  );
};

export const SideChar: React.FC<SideProps> = ({x, y, scale = 1, flip, torso, headPitch = 10, turn = 0.85, face = {}, handN, handF, footN, footF, legUp, look = 'man', tie, tee = TEE, t, seed = 0, dim = 0, idle = 1, slump = 0, children}) => {
  const inh = Math.sin(t * 1.9 + seed);
  const sway = Math.sin(t * 0.55 + seed * 2) * 0.8 * idle;
  const th = torso + sway;
  const SH = rot([5, -280 + slump * 18 - inh * 2.2 * idle], th), SHF = rot([-12, -282 + slump * 18 - inh * 2.2 * idle], th);
  const NECK = rot([0, -318 + slump * 12], th);
  const j = (a: number, b: number): V => [Math.sin(t * 1.3 + seed + a) * 2 * idle, Math.cos(t * 1.1 + seed * 2 + b) * 2 * idle];
  const hN: V = [handN[0] + j(0, 1)[0], handN[1] + j(0, 1)[1]], hF: V = [handF[0] + j(2, 3)[0], handF[1] + j(2, 3)[1]];
  const HJ: V = [0, 14];
  const tg = `sg${tee.slice(1)}`;
  const headRot = th + headPitch + Math.sin(t * 0.71 + seed * 1.7) * 1.2 * idle;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} style={dim ? {filter: `brightness(${1 - dim})`} : undefined}>
      <defs>
        <linearGradient id={tg} x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stopColor={shade(tee, -0.18)} /><stop offset="0.45" stopColor={tee} /><stop offset="1" stopColor={shade(tee, 0.2)} /></linearGradient>
      </defs>
      <SideLeg HJ={HJ} T={footF} dim up={legUp} />
      <SideArm S={SHF} T={hF} tee={tee} dim />
      {/* pelvis, then the torso (back on the left, chest on the right) */}
      <ellipse cx={0} cy={26} rx={104} ry={62} fill={LIMB} stroke={INK} strokeWidth={8} />
      <g transform={`rotate(${th})`}>
        <path d="M -80,12 C -102,-120 -92,-250 -60,-318 Q 22,-346 88,-302 C 114,-200 116,-90 96,12 Z" fill={`url(#${tg})`} stroke={INK} strokeWidth={8} strokeLinejoin="round" transform={`scale(1 ${1 + inh * 0.01 * idle})`} />
        <path d="M -62,-290 C -80,-200 -78,-100 -62,-10" fill="none" stroke={shade(tee, -0.45)} strokeWidth={10} strokeLinecap="round" opacity={0.3} />
        <path d="M 70,-280 C 92,-200 94,-100 80,-20" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.28} />
        <path d="M -30,-318 Q 20,-296 62,-316" fill="none" stroke={shade(tee, -0.3)} strokeWidth={13} strokeLinecap="round" />
        <rect x={-23} y={-352} width={46} height={50} rx={12} fill={LIMB} stroke={INK} strokeWidth={6} />
        {tie && <path d="M 54,-300 L 82,-300 L 90,-196 L 68,-168 L 50,-196 Z" fill="#c0392b" stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
      </g>
      <g transform={`translate(${NECK[0]} ${NECK[1]}) rotate(${headRot}) translate(26 -130)`}>
        <Head face={face} turn={turn} t={t} seed={seed} idle={idle} look={look} />
      </g>
      <SideLeg HJ={HJ} T={footN} up={legUp} />
      {children}
      <SideArm S={SH} T={hN} tee={tee} />
    </g>
  );
};

// ---------------- props, seen from the side, in hip space ----------------
// an open book held up to the reader: the outside of the back cover with the spine toward us, pages fanning over the top
export const BookSide: React.FC<{x: number; y: number; deg?: number; shut?: boolean; flip?: number}> = ({x, y, deg = -20, shut, flip = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${deg})`}>
    {shut ? (
      <g>
        <rect x={-62} y={-17} width={124} height={34} rx={6} fill="#2f6f5e" stroke={INK} strokeWidth={7} />
        <rect x={-50} y={-9} width={104} height={8} rx={3} fill="#f1e8d0" />
        <rect x={-56} y={-22} width={16} height={44} rx={5} fill="#1f4d41" />
      </g>
    ) : (
      <g transform="scale(0.85)">
        {/* an OPEN book: two cream pages with text lines meeting at the spine in a slight V, green covers peeking out around them */}
        <path d="M -122,-58 L 0,-86 L 122,-58 L 122,126 L 0,102 L -122,126 Z" fill="#2f6f5e" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M -108,-52 L -4,-78 L -4,94 L -108,116 Z" fill="#f4ecd6" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 4,-78 L 108,-52 L 108,116 L 4,94 Z" fill="#f8f1de" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        {Array.from({length: 7}, (_, i) => <g key={i} opacity={0.5}><path d={`M -94,${-30 + i * 22} L -18,${-46 + i * 22}`} stroke="#9b927a" strokeWidth={6} strokeLinecap="round" /><path d={`M 18,${-46 + i * 22} L 94,${-30 + i * 22}`} stroke="#9b927a" strokeWidth={6} strokeLinecap="round" /></g>)}
        <path d="M 0,-86 L 0,102" stroke={INK} strokeWidth={5} />
        <path d="M -108,118 L -4,96 M 4,96 L 108,118" stroke="#d9cfae" strokeWidth={7} strokeLinecap="round" />
        {flip > 0 && flip < 1 && <path d={`M 4,-78 Q ${4 + 104 * Math.cos(flip * Math.PI) * 0.5},${-100 - 46 * Math.sin(flip * Math.PI)} ${104 * Math.cos(flip * Math.PI)},${-52 - 30 * Math.sin(flip * Math.PI)} L ${104 * Math.cos(flip * Math.PI)},${116 - 26 * Math.sin(flip * Math.PI)} L 4,94 Z`} fill="#fbf5e6" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />}
      </g>
    )}
  </g>
);
// a phone held toward the face: its back and edge toward us, a cold glow from the screen reaching the face
export const PhoneSide: React.FC<{x: number; y: number; deg?: number; glow?: number}> = ({x, y, deg = 24, glow = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${deg})`}>
    <path d="M 0,-20 L -190,-80 L -190,70 Z" fill="#6bb8ff" opacity={0.16 * glow} style={{mixBlendMode: 'screen'}} />
    <rect x={-17} y={-62} width={34} height={124} rx={12} fill="#15161f" stroke={INK} strokeWidth={6.5} />
    <rect x={-14} y={-54} width={6} height={108} rx={3} fill="#4aa8ff" opacity={0.9 * glow} />
    <circle cx={7} cy={-44} r={6} fill="#2a2d3d" />
  </g>
);
