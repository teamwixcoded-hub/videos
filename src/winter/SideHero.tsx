import React from 'react';
import {Limb, limbAt} from './limb';
import {Head, HeadProps, Hand, ik, shade, INK, V, HandKind, chinOf, defaultHeadScale} from './Hero';

// ============================================================================================
// WINTER ARC side view: the same man facing +x (flip for -x). Origin = the floor under the start of the pose, y up is negative.
// A pose is: hip position, torso angle (0 = upright, + = leaning toward the facing side), two hand targets, two foot targets, head pitch.
// Torso depth (belly, chest, back) comes from fat / muscle, so Jake's soft belly and Sam's chest read in profile too.
// ============================================================================================
export type Prop = 'dumbbell' | 'phone' | 'plate' | 'book';
export type SidePose = {hip: V; torso: number; head?: number; handN: V; handF: V; footN: V; footF: V; handKindN?: HandKind; handKindF?: HandKind; heldN?: Prop; heldF?: Prop; elbowN?: 1 | -1; elbowF?: 1 | -1; kneeDir?: 1 | -1; turn?: number};
export const SIDE: Record<string, SidePose> = {
  stand: {hip: [0, -270], torso: 0, handN: [20, -292], handF: [-8, -292], footN: [16, -28], footF: [-14, -28]},
  squat: {hip: [-78, -128], torso: 30, head: -12, handN: [34, -392], handF: [18, -396], footN: [44, -28], footF: [20, -28], handKindN: 'fist', handKindF: 'fist', heldN: 'plate'},
  curl: {hip: [0, -270], torso: -3, head: 4, handN: [96, -462], handF: [-4, -292], handKindN: 'fist', handKindF: 'fist', heldN: 'dumbbell', heldF: 'dumbbell', footN: [24, -28], footF: [-22, -28]},
  pushup: {hip: [-78, -135], torso: 65, head: -42, handN: [156, -12], handF: [138, -12], footN: [-303, -30], footF: [-322, -30], handKindN: 'open', handKindF: 'open', elbowN: -1},
  run: {hip: [0, -256], torso: 16, head: -8, handN: [-56, -420], handF: [128, -462], footN: [120, -128], footF: [-136, -62], handKindN: 'fist', handKindF: 'fist'},
  sit: {hip: [-10, -96], torso: 12, head: 18, handN: [168, -318], handF: [152, -310], footN: [150, -28], footF: [118, -28], handKindN: 'relaxed', handKindF: 'relaxed', heldN: 'phone'},
  lie: {hip: [-150, -60], torso: 88, head: 0, handN: [40, -52], handF: [30, -52], footN: [-400, -34], footF: [-410, -40], handKindN: 'relaxed', handKindF: 'relaxed'},
};
export type SideProps = HeadProps & {fat?: number; muscle?: number; top?: 'tee' | 'hoodie' | 'tank' | 'bare'; topColor?: string; pants?: string; shoe?: string; skin?: string; shorts?: boolean; pose?: SidePose | keyof typeof SIDE; x?: number; y?: number; scale?: number; flip?: boolean; headScale?: number};

const smooth = (pts: V[]): string => {
  const n = pts.length; let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d + ' Z';
};
const PropArt: React.FC<{k: Prop; p: V; ang: number}> = ({k, p, ang}) => {
  if (k === 'dumbbell') return <g transform={`translate(${p[0]} ${p[1]})`}><circle r={34} fill="#3b3f4d" stroke={INK} strokeWidth={8} /><circle r={16} fill="#6c7288" stroke={INK} strokeWidth={5} /><circle cx={-8} cy={-10} r={6} fill="#fff" opacity={0.35} /></g>;
  if (k === 'plate') return <g transform={`translate(${p[0] - 10} ${p[1] - 10})`}><circle r={74} fill="#2e3242" stroke={INK} strokeWidth={9} /><circle r={52} fill="none" stroke="#4a5068" strokeWidth={8} /><circle r={16} fill="#8a90a8" stroke={INK} strokeWidth={5} /><path d="M -50,-34 A 62 62 0 0 1 -6,-60" stroke="#fff" strokeWidth={7} fill="none" opacity={0.3} strokeLinecap="round" /></g>;
  if (k === 'book') return <g transform={`translate(${p[0]} ${p[1]}) rotate(${ang - 90})`}><rect x={-34} y={-6} width={68} height={92} rx={6} fill="#2f7d5b" stroke={INK} strokeWidth={7} /></g>;
  return <g transform={`translate(${p[0]} ${p[1]}) rotate(${ang - 90 + 20})`}><rect x={-26} y={-8} width={52} height={92} rx={10} fill="#12151f" stroke={INK} strokeWidth={7} /><rect x={-20} y={0} width={40} height={74} rx={6} fill="#4aa8ff" opacity={0.85} /></g>;
};

export const SideHero: React.FC<SideProps> = ({fat = 0, muscle = 0, top = 'tee', topColor = '#e9962c', pants = '#2b3350', shoe = '#f2f2f2', skin = '#e8eafb', shorts, pose = 'stand', x = 0, y = 0, scale = 1, flip, headScale: hs, kind, mood = 'neutral', hair, look, blink, id = 'sd', turn}) => {
  const P: SidePose = typeof pose === 'string' ? SIDE[pose] : pose;
  const a = P.torso * Math.PI / 180, u: V = [Math.sin(a), -Math.cos(a)], n: V = [Math.cos(a), Math.sin(a)], hip = P.hip;
  const at = (t: number, f: number): V => [hip[0] + u[0] * t + n[0] * f, hip[1] + u[1] * t + n[1] * f];
  const fabric = top === 'bare' ? skin : topColor, longSleeve = top === 'hoodie';
  const armW = 42 + muscle * 18 + fat * 8, foreW = armW * 0.8, legW = 70 + fat * 24 + muscle * 8, calfW = legW * 0.72;
  const front = [[0, 82 + fat * 14], [60, 86 + fat * 46], [120, 88 + fat * 84], [180, 88 + muscle * 12 + fat * 50], [240, 92 + muscle * 24 + fat * 16], [284, 46]];
  const back = [[284, -48], [230, -86 - muscle * 8], [160, -86 - fat * 8], [90, -82 - fat * 14], [0, -82 - fat * 14]];
  const torso = smooth([...front, ...back].map(([t, f]) => at(t, f)));
  const sh = at(250, -4), neck = at(300, 0);
  const arm = (hand: V, kind: HandKind, held: Prop | undefined, dir: 1 | -1, far: boolean) => {
    const k = far ? 0.8 : 1, sk = shade(skin, k), fb = shade(fabric, k);
    const {el, wr} = ik(sh, hand, 122, 116, dir);
    const ang = Math.atan2(wr[1] - el[1], wr[0] - el[0]) * 180 / Math.PI;
    const bare = top === 'bare' || top === 'tank';
    const geom = {pts: [sh, el, wr] as [V, V, V], w: [armW * 1.06, armW * 0.9, foreW * 0.84] as [number, number, number], bump: [{t: 0.26, amt: armW * (0.08 + muscle * 0.5 + fat * 0.14), sigma: 0.14}, {t: 0.72, amt: armW * (0.04 + muscle * 0.16), sigma: 0.16}]};
    const bi = limbAt(geom.pts, 0.26);
    return (
      <g>
        <Limb {...geom} fill={sk} />
        {top === 'tee' && <Limb {...geom} t1={0.4} extra={8} flat fill={fb} stroke={8} />}
        {longSleeve && <g><Limb {...geom} t1={0.92} extra={5} flat fill={fb} stroke={8} /><Limb {...geom} t0={0.84} t1={0.92} extra={8} flat fill={shade(fabric, 0.8 * k)} stroke={7} /></g>}
        {muscle > 0.2 && bare && <ellipse cx={bi[0] + 2} cy={bi[1] - 8} rx={armW * 0.26} ry={armW * 0.17} fill="#fff" opacity={0.3} />}
        <circle cx={sh[0]} cy={sh[1]} r={armW * 0.52 + 2} fill={bare ? sk : fb} />
        <Hand p={wr} ang={ang} kind={kind} r={armW * 0.66 + 4} skin={sk} />
        {held && <PropArt k={held} p={wr} ang={ang} />}
      </g>
    );
  };
  const leg = (foot: V, far: boolean) => {
    const k = far ? 0.8 : 1, pc = shade(pants, k);
    const {el: kn} = ik(hip, foot, 124, 124, P.kneeDir ?? 1);
    const geom = {pts: [hip, kn, foot] as [V, V, V], w: [legW * 1.04, calfW * 1.02, calfW * 0.6] as [number, number, number], bump: [{t: 0.3, amt: legW * (0.04 + muscle * 0.18 + fat * 0.1), sigma: 0.16}, {t: 0.72, amt: calfW * (0.08 + muscle * 0.28), sigma: 0.14}]};
    return (
      <g>
        <Limb {...geom} fill={pc} />
        {shorts && <Limb {...geom} t1={0.5} extra={6} flat fill={shade(pants, 1.18 * k)} stroke={8} />}
        <g transform={`translate(${foot[0]} ${foot[1]})`}>
          <path d="M -36,30 Q -44,-8 -8,-16 L 20,-14 Q 58,-8 68,20 Q 72,38 54,38 L -30,38 Q -38,38 -36,30 Z" fill={shade(shoe, k)} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d="M -34,28 L 62,28" stroke="#c9ced8" strokeWidth={10} strokeLinecap="round" opacity={k} /><path d="M 4,-8 Q 22,-4 32,10" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} strokeLinecap="round" />
          <path d="M -34,38 L 62,38" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        </g>
      </g>
    );
  };
  const headScale = hs ?? defaultHeadScale(kind), headC = at(314 + chinOf(kind) * headScale, 10);
  const rot = P.torso * 0.75 + (P.head ?? 0);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {leg(P.footF, true)}
      {arm(P.handF, P.handKindF ?? 'relaxed', P.heldF, P.elbowF ?? -1, true)}
      <rect x={neck[0] - 28} y={neck[1] - 30} width={56} height={60} rx={22} fill={skin} stroke={INK} strokeWidth={9} transform={`rotate(${P.torso} ${neck[0]} ${neck[1]})`} />
      <path d={torso} fill={fabric} stroke={INK} strokeWidth={11} strokeLinejoin="round" />
      <clipPath id={`sc${id}`}><path d={torso} /></clipPath>
      <g clipPath={`url(#sc${id})`}>
        <path d={smooth([[0, -100], [300, -100], [300, -26], [0, -26]].map(([t, f]) => at(t, f)))} fill="#000" opacity={0.15} />
        <path d={smooth([[30, 50], [250, 54], [250, 40], [30, 36]].map(([t, f]) => at(t, f)))} fill="#fff" opacity={0.1} />
        {fat > 0.3 && <ellipse cx={at(105, 36)[0]} cy={at(105, 36)[1]} rx={60 + fat * 20} ry={30} fill="#000" opacity={0.1} transform={`rotate(${P.torso} ${at(105, 36)[0]} ${at(105, 36)[1]})`} />}
      </g>
      {top === 'bare' && muscle > 0.3 && <g stroke={INK} strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round"><path d={`M ${at(205, 70)[0]},${at(205, 70)[1]} Q ${at(190, 30)[0]},${at(190, 30)[1]} ${at(215, -6)[0]},${at(215, -6)[1]}`} />{[70, 110, 150].map((t) => <path key={t} d={`M ${at(t, 66)[0]},${at(t, 66)[1]} L ${at(t, 28)[0]},${at(t, 28)[1]}`} />)}</g>}
      {longSleeve && <path d={smooth([[262, -46], [286, -40], [300, -10], [286, 30], [262, 22], [240, -20]].map(([t, f]) => at(t, f)))} fill={shade(fabric, 0.78)} stroke={INK} strokeWidth={8} strokeLinejoin="round" />}
      {longSleeve && <path d={smooth([[60, 62], [60, 14], [118, 8], [118, 66 + fat * 80]].map(([t, f]) => at(t, f)))} fill="rgba(0,0,0,.14)" stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
      {leg(P.footN, false)}
      <g transform={`translate(${headC[0]} ${headC[1]}) rotate(${rot}) scale(${headScale})`}><Head mood={mood} skin={skin} hair={hair} look={look} blink={blink} id={id} turn={turn ?? P.turn ?? 0.9} kind={kind} /></g>
      {arm(P.handN, P.handKindN ?? 'relaxed', P.heldN, P.elbowN ?? -1, false)}
    </g>
  );
};
