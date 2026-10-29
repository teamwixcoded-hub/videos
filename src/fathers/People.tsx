import React, {useId} from 'react';
import {INK} from './theme';

// ============================================================================================
// The cast of Two Fathers: Adam (navy suit, tie), Sam (rust cardigan), their sons Leo (blue) and Max (green). Flat warm illustration, brown outline, real skin and
// hair. Drawn in "hip space": origin at the hips, +y down, an adult is ~900 tall (head top -420, feet +440). Arms are 2-bone IK so hands land on targets.
// `age` is the person's own age: fathers grey and stoop between 35 and 65, sons grow from a swaddled baby to 30 (smaller body, bigger head when young).
// `turn` (-1..1) turns head and body together: the face slides, the near ear appears, the body narrows.
// ============================================================================================
export type V = [number, number];
export type Who = 'adam' | 'sam' | 'leo' | 'max' | 'aunt';
export type FaceP = {gaze?: V; lids?: number; smile?: number; open?: number; brow?: number; tilt?: number; wide?: number; cry?: number};
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mix = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const hex = (h: string): [number, number, number] => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, '0')).join(''); };
export const shade = (h: string, amt: number) => mixc(h, amt >= 0 ? '#ffffff' : '#000000', Math.abs(amt));

type Look = {skin: string; hair: string; top: string; shirt: string; pants: string; shoe: string; tie?: string};
export const LOOKS: Record<Who, Look> = {
  adam: {skin: '#e3ad84', hair: '#2e211c', top: '#26324f', shirt: '#f3efe6', pants: '#1d2540', shoe: '#2a1d18', tie: '#9b2f3a'},
  sam: {skin: '#d79a70', hair: '#3b261c', top: '#b4592f', shirt: '#efe3cf', pants: '#6a5646', shoe: '#3a2a20'},
  leo: {skin: '#e3ad84', hair: '#241a18', top: '#3f78c4', shirt: '#e8eef8', pants: '#2e3a55', shoe: '#e9e6df'},
  max: {skin: '#d79a70', hair: '#4a2d1d', top: '#4c9a63', shirt: '#e7f0e4', pants: '#4a4a3a', shoe: '#e9e6df'},
  aunt: {skin: '#c98f66', hair: '#2a1f26', top: '#2f8f8a', shirt: '#f0ece4', pants: '#4a3a58', shoe: '#3a2a20'},
};
const isSon = (w: Who) => w === 'leo' || w === 'max';
// body scale and head size by age (sons grow; fathers stay adult)
export const bodyK = (w: Who, age: number) => (isSon(w) ? clamp(lerp(0.46, 1, (age - 4) / 18), 0.46, 1) : 1);
const headK = (w: Who, age: number) => (isSon(w) ? clamp(lerp(1.3, 1, (age - 4) / 16), 1, 1.3) : 1);

export type PersonProps = {
  who: Who; age?: number; x: number; y: number; scale?: number; flip?: boolean; t: number; seed?: number; dim?: number; idle?: number;
  turn?: number; lean?: number; tilt?: number; slump?: number; face?: FaceP;
  handL?: V; handR?: V;                 // hand targets in hip space (screen-left / screen-right arm)
  legs?: 'stand' | 'sit' | 'none'; sitDrop?: number; walk?: number;
  pose?: keyof typeof POSES; outfit?: 'suit' | 'shirt' | 'jacketOff'; top?: string; hold?: boolean;
  children?: React.ReactNode;           // props in hip space, drawn above the body and under the hands
  front?: React.ReactNode;              // drawn above the hands (a laptop screen in front of the typing hands)
};

// ---------- poses: hand targets, lean and face, some of them alive over time ----------
export const POSES: Record<string, (t: number) => Partial<PersonProps>> = {
  stand: () => ({handL: [-122, 110], handR: [122, 110]}),
  rest: () => ({handL: [-60, 20], handR: [60, 20], legs: 'sit'}),
  type: (t) => ({handL: [-58 + Math.sin(t * 9) * 4, -30 + Math.sin(t * 13) * 5], handR: [58 + Math.sin(t * 11) * 4, -30 + Math.cos(t * 10) * 5], lean: 6, legs: 'sit'}),
  desk: (t) => ({handL: [-62 + Math.sin(t * 9) * 3, 52], handR: [62 + Math.sin(t * 11) * 3, 52], lean: 8, legs: 'sit'}),
  phone: (t) => ({handR: [64, -170 + Math.sin(t * 1.5) * 2], handL: [-120, 100], lean: 4}),
  ear: () => ({handR: [92, -360], handL: [-122, 100]}),
  cradle: () => ({handL: [-34, -70], handR: [48, -80], lean: -2}),
  clap: (t) => { const k = (Math.sin(t * 16) + 1) / 2; return {handL: [-22 - 30 * k, -190], handR: [22 + 30 * k, -190]}; },
  knock: (t) => { const k = Math.max(0, Math.sin(t * 14)); return {handR: [138 + 10 * k, -230 - 6 * k], handL: [-120, 100]}; },
  wave: (t) => ({handR: [150, -400 + Math.sin(t * 9) * 26], handL: [-122, 100]}),
  film: (t) => ({handL: [-48, -330], handR: [48, -330 + Math.sin(t * 2) * 3], lean: -3}),
  carry: () => ({handL: [-70, -50], handR: [70, -50]}),
  fold: () => ({handL: [30, -110], handR: [-30, -112]}),
  point: () => ({handR: [170, -250], handL: [-122, 100]}),
  hold: () => ({handL: [-70, -30], handR: [70, -30]}),
};

const Eye: React.FC<{cx: number; cy: number; far: number; cover: number; gaze: V; wide: number; skin: string}> = ({cx, cy, far, cover, gaze, wide, skin}) => {
  const rx = 15 * (1 - 0.3 * far) * (1 + 0.1 * wide), ry = 12 * (1 + 0.35 * wide), id = useId().replace(/:/g, '');
  return (
    <g>
      <defs><clipPath id={'e' + id}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} /></clipPath></defs>
      <ellipse cx={cx} cy={cy} rx={rx + 3} ry={ry + 3} fill={shade(skin, -0.12)} opacity={0.35} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fbf7ef" stroke={INK} strokeWidth={2.4} />
      <circle cx={cx + gaze[0] * 6} cy={cy + gaze[1] * 5} r={8.2 * (1 - 0.15 * far)} fill="#3a251c" />
      <circle cx={cx + gaze[0] * 6 - 2.5} cy={cy + gaze[1] * 5 - 3} r={2.6} fill="#fff" />
      {cover > 0.1 && <g clipPath={`url(#e${id})`}><rect x={cx - rx - 3} y={cy - ry - 3} width={2 * rx + 6} height={2 * ry * cover + 3} fill={skin} /><line x1={cx - rx - 3} x2={cx + rx + 3} y1={cy - ry + 2 * ry * cover} y2={cy - ry + 2 * ry * cover} stroke={INK} strokeWidth={2.6} /></g>}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={2.4} />
    </g>
  );
};

export const Head: React.FC<{who: Who; age: number; face: FaceP; turn: number; t: number; seed: number; idle: number}> = ({who, age, face, turn, t, seed, idle}) => {
  const L = LOOKS[who], son = isSon(who);
  const {gaze = [0, 0], lids = 0.05, smile = 0, open = 0, brow = 0, tilt = 0, wide = 0, cry = 0} = face;
  const id = useId().replace(/:/g, '');
  const P = 3.6 + 0.8 * Math.sin(seed * 7.3), ph = (t + seed * 2.1) % P;
  const blink = ph < 0.15 ? Math.sin((ph / 0.15) * Math.PI) : 0;
  const cover = Math.max(lids, blink);
  const g = son ? 0 : clamp((age - 38) / 27, 0, 1);                    // greying
  const hair = mixc(L.hair, '#cfcdca', g * 0.92), skinD = shade(L.skin, -0.14);
  const fx = turn * 36, sx = 1 - 0.14 * Math.abs(turn), sm = clamp(smile, 0, 1);
  const rec = g * 12;                                                   // receding hairline
  const my = 46, mw = 26 + sm * 8;
  const mouth = open > 0.04
    ? `M ${-mw},${my - sm * 2} Q 0,${my + 10 + 62 * open + 14 * sm} ${mw},${my - sm * 2} Q 0,${my - 4} ${-mw},${my - sm * 2} Z`
    : `M ${-mw},${my - sm * 5} Q 0,${my + 4 + sm * 24 - (lids > 0.35 ? 4 : 0)} ${mw},${my - sm * 5}`;
  const nearEar = Math.abs(turn) > 0.3 ? (turn > 0 ? -1 : 1) : 0;
  const ear = (s: number) => <g key={s}><ellipse cx={s * 74 + turn * 36 * (s * turn > 0 ? 1.1 : 0.55)} cy={6} rx={12} ry={19} fill={L.skin} stroke={INK} strokeWidth={3.4} /><ellipse cx={s * 74 + turn * 36 * (s * turn > 0 ? 1.1 : 0.55)} cy={8} rx={5} ry={10} fill={skinD} opacity={0.5} /></g>;
  return (
    <g>
      <defs><clipPath id={'m' + id}><path d={mouth} /></clipPath></defs>
      {nearEar === 0 && [-1, 1].map(ear)}
      {/* a little neck shadow lives in the torso; the head itself */}
      <ellipse cx={0} cy={0} rx={77} ry={86} fill={L.skin} stroke={INK} strokeWidth={4.4} />
      <path d="M -62,40 Q 0,112 62,40" fill="none" stroke={skinD} strokeWidth={9} strokeLinecap="round" opacity={0.28} />
      {/* hair */}
      <g transform={`translate(${turn * 18} 0)`}>
        {who === 'adam' && <path d={`M -80,-14 C -88,-96 -34,-104 14,-100 C 66,-98 90,-62 80,-14 C 72,${-46 - rec} 44,${-62 - rec} 6,${-60 - rec} C -34,${-58 - rec} -66,-44 -80,-14 Z`} fill={hair} stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
        {who === 'sam' && <g><path d={`M -82,-8 C -96,-98 -30,-112 16,-106 C 74,-104 98,-60 82,-8 C 74,${-42 - rec * 0.6} 40,${-58 - rec * 0.6} 4,${-58 - rec * 0.6} C -36,${-56 - rec * 0.6} -68,-42 -82,-8 Z`} fill={hair} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M -70,34 Q -66,96 0,100 Q 66,96 70,34 Q 50,70 0,72 Q -50,70 -70,34 Z`} fill={mixc('#3b261c', '#cfcdca', g * 0.85)} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" opacity={0.92} />
          <path d="M -26,38 Q 0,28 26,38 Q 0,48 -26,38 Z" fill={mixc('#3b261c', '#cfcdca', g * 0.85)} stroke={INK} strokeWidth={3} /></g>}
        {who === 'leo' && <path d="M -80,-10 C -90,-92 -40,-108 6,-102 C 62,-102 92,-66 80,-10 C 66,-44 36,-58 -4,-54 C -42,-52 -68,-40 -80,-10 Z" fill={hair} stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
        {who === 'aunt' && <g><circle cx={0} cy={-102} r={34} fill={hair} stroke={INK} strokeWidth={4} /><path d="M -82,-6 C -96,-100 -30,-112 6,-108 C 66,-108 98,-60 82,-6 C 70,-44 36,-60 -4,-58 C -44,-56 -70,-40 -82,-6 Z" fill={hair} stroke={INK} strokeWidth={4} strokeLinejoin="round" /></g>}
        {who === 'max' && <g fill={hair} stroke={INK} strokeWidth={3.6}>{[[-60, -64, 28], [-30, -86, 30], [8, -94, 32], [46, -82, 30], [70, -52, 26], [-72, -30, 22], [78, -22, 20], [-6, -64, 34]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>}
      </g>
      {nearEar !== 0 && ear(nearEar)}
      <g transform={`translate(${fx} 0) scale(${sx} 1)`}>
        <ellipse cx={-52} cy={30} rx={20} ry={11} fill="#e98a7a" opacity={0.16 + sm * 0.22} />
        <ellipse cx={52} cy={30} rx={20} ry={11} fill="#e98a7a" opacity={0.16 + sm * 0.22} />
        {[-1, 1].map((s) => {
          const far = s * turn > 0 ? Math.abs(turn) : 0, cx = s * 29 - s * 5 * far, by = -34 - brow * 9 - (s > 0 ? 0 : 0);
          return (
            <g key={s}>
              <Eye cx={cx} cy={-4} far={far} cover={cover + sm * 0.06} gaze={gaze} wide={wide} skin={L.skin} />
              <path d={`M ${cx - 19},${by + 7} Q ${cx},${by - 8} ${cx + 19},${by + 7}`} fill="none" stroke={hair} strokeWidth={7.5} strokeLinecap="round" transform={`rotate(${s * tilt} ${cx} ${by})`} />
              {cry > 0 && <ellipse cx={cx + s * 6} cy={22 + cry * 40} rx={4} ry={8} fill="#a9d4f5" opacity={0.85 * cry} />}
            </g>
          );
        })}
        <path d={`M ${turn * 14 - 4},0 Q ${turn * 14 + 12 + Math.abs(turn) * 6},26 ${turn * 14 - 7},30`} fill="none" stroke={skinD} strokeWidth={4.4} strokeLinecap="round" />
        {open > 0.04
          ? <g><path d={mouth} fill="#5a2230" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><g clipPath={`url(#m${id})`}>{open > 0.2 && sm > 0.2 && <rect x={-mw} y={my - 6} width={mw * 2} height={12 + 8 * open} fill="#fbf7ef" />}<ellipse cx={0} cy={my + 8 + 52 * open} rx={16} ry={9 + 8 * open} fill="#d9707e" /></g><path d={mouth} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" /></g>
          : <path d={mouth} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
        {sm > 0.4 && <g fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.4}><path d={`M ${-mw - 7},${my - 10} q -6,8 0,16`} /><path d={`M ${mw + 7},${my - 10} q 6,8 0,16`} /></g>}
        {g > 0.3 && <g fill="none" stroke={skinD} strokeWidth={3} strokeLinecap="round" opacity={g * 0.7}><path d="M -42,-58 q 42,-12 84,0" /><path d="M -34,-48 q 34,-8 68,0" /><path d={`M ${-mw - 14},${my - 14} q -8,12 0,28`} /><path d={`M ${mw + 14},${my - 14} q 8,12 0,28`} /></g>}
      </g>
    </g>
  );
};

const Hand: React.FC<{H: V; ang: number; skin: string; s: number}> = ({H, ang, skin, s}) => (
  <g transform={`translate(${H[0]} ${H[1]}) rotate(${ang - 90})`}>
    <ellipse cx={s * 24} cy={4} rx={11} ry={19} fill={skin} stroke={INK} strokeWidth={3.6} transform={`rotate(${s * 26} ${s * 24} 4)`} />
    <ellipse cx={0} cy={8} rx={27} ry={30} fill={skin} stroke={INK} strokeWidth={4.4} />
    <path d="M -9,26 Q -8,12 -9,2 M 6,28 Q 7,13 6,2" fill="none" stroke={shade(skin, -0.2)} strokeWidth={2.6} strokeLinecap="round" opacity={0.6} />
  </g>
);

const A1 = 172, A2 = 160;
const Arm: React.FC<{S: V; T: V; sleeve: string; cuff?: string; skin: string; s: number}> = ({S, T, sleeve, cuff, skin, s}) => {
  let dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy);
  const maxd = A1 + A2 - 3; if (d > maxd) { dx *= maxd / d; dy *= maxd / d; d = maxd; }
  d = Math.max(d, 60);
  const base = Math.atan2(dy, dx), A = Math.acos(clamp((A1 * A1 + d * d - A2 * A2) / (2 * A1 * d), -1, 1));
  const c: V[] = [base + A, base - A].map((g): V => [S[0] + Math.cos(g) * A1, S[1] + Math.sin(g) * A1]);
  const E = c[0][1] > c[1][1] ? c[0] : c[1], H: V = [S[0] + dx, S[1] + dy];
  const fa = (Math.atan2(H[1] - E[1], H[0] - E[0]) * 180) / Math.PI, wr = mix(E, H, 0.86);
  return (
    <g>
      <g stroke={INK} strokeLinecap="round" fill="none"><line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={62} /><line x1={E[0]} y1={E[1]} x2={wr[0]} y2={wr[1]} strokeWidth={54} /></g>
      <g stroke={sleeve} strokeLinecap="round" fill="none"><line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={53} /><line x1={E[0]} y1={E[1]} x2={wr[0]} y2={wr[1]} strokeWidth={45} /></g>
      <g stroke={shade(sleeve, 0.22)} strokeLinecap="round" fill="none" opacity={0.5}><line x1={S[0] - 7} y1={S[1] - 4} x2={E[0] - 7} y2={E[1] - 3} strokeWidth={7} /></g>
      {cuff && <line x1={mix(E, H, 0.74)[0]} y1={mix(E, H, 0.74)[1]} x2={wr[0]} y2={wr[1]} stroke={cuff} strokeWidth={47} strokeLinecap="butt" opacity={0.95} />}
      <Hand H={H} ang={fa} skin={skin} s={s} />
    </g>
  );
};

const Legs: React.FC<{look: Look; mode: 'stand' | 'sit' | 'none'; drop: number; walk: number; turn: number}> = ({look, mode, drop, walk, turn}) => {
  if (mode === 'none') return null;
  const shoe = (x: number, y: number, k: number) => <g transform={`translate(${x} ${y})`}><path d={`M -34,-10 Q -34,-34 0,-34 Q 46,-32 ${50 + k * 10},-6 Q ${58 + k * 10},12 40,16 L -34,16 Q -42,14 -34,-10 Z`} fill={look.shoe} stroke={INK} strokeWidth={4.4} strokeLinejoin="round" /><path d="M -34,10 L 44,10" stroke={INK} strokeWidth={3} opacity={0.5} /></g>;
  if (mode === 'sit') {
    return (
      <g>
        {[-1, 1].map((s) => (
          <g key={s}>
            <line x1={s * 52} y1={12} x2={s * 70} y2={104} stroke={INK} strokeWidth={90} strokeLinecap="round" />
            <line x1={s * 52} y1={12} x2={s * 70} y2={104} stroke={look.pants} strokeWidth={81} strokeLinecap="round" />
            <line x1={s * 70} y1={104} x2={s * 66} y2={drop} stroke={INK} strokeWidth={70} strokeLinecap="round" />
            <line x1={s * 70} y1={104} x2={s * 66} y2={drop} stroke={look.pants} strokeWidth={61} strokeLinecap="round" />
            {shoe(s * 70 + s * 6, drop + 18, 0)}
          </g>
        ))}
      </g>
    );
  }
  const sw = Math.sin(walk * Math.PI * 2), side = Math.abs(turn) > 0.5, LEG = 330;
  return (
    <g>
      {[-1, 1].map((s) => {
        const ph = s * sw, fx = side ? ph * 78 : s * 60, fy = LEG - (side ? Math.max(0, -Math.cos(walk * Math.PI * 2 * 1) * s) * 26 : 0);
        return (
          <g key={s}>
            <line x1={s * 50} y1={12} x2={fx} y2={fy - 14} stroke={INK} strokeWidth={86} strokeLinecap="round" />
            <line x1={s * 50} y1={12} x2={fx} y2={fy - 14} stroke={look.pants} strokeWidth={77} strokeLinecap="round" />
            {shoe(fx + (side ? 14 * Math.sign(turn) : 0), fy + 4, side ? 1 : 0)}
          </g>
        );
      })}
    </g>
  );
};

export const Person: React.FC<PersonProps> = (p) => {
  const {who, age = isSon(who) ? 30 : 40, x, y, scale = 1, flip, t, seed = 0, dim = 0, idle = 1, turn = 0, slump = 0, legs = 'stand', sitDrop = 250, walk = 0, outfit = 'suit', children, front} = p;
  const base = p.pose ? POSES[p.pose](t) : {};
  const L = LOOKS[who];
  const handL = p.handL ?? base.handL ?? [-122, 110], handR = p.handR ?? base.handR ?? [122, 110];
  const legMode = p.legs ?? base.legs ?? legs;
  const stoop = who === 'adam' || who === 'sam' ? clamp((age - 50) / 15, 0, 1) * 9 : 0;
  const lean = (p.lean ?? base.lean ?? 0) + stoop;
  const face = {...(base.face ?? {}), ...(p.face ?? {})};
  const k = bodyK(who, age), hk = headK(who, age);
  const inh = Math.sin(t * 1.9 + seed), sway = Math.sin(t * 0.55 + seed * 2) * 0.8 * idle;
  const sy = slump * 26 - inh * 2.2 * idle;
  const j = (a: number, b: number): V => [Math.sin(t * 1.3 + seed + a) * 2 * idle, Math.cos(t * 1.1 + seed * 2 + b) * 2 * idle];
  const turnW = 1 - 0.2 * Math.abs(turn);
  const hl: V = [handL[0] + j(0, 1)[0], handL[1] + j(0, 1)[1]], hr: V = [handR[0] + j(2, 3)[0], handR[1] + j(2, 3)[1]];
  const SL: V = [-112 * turnW + turn * 12, -226 + sy], SR: V = [112 * turnW + turn * 12, -226 + sy];
  const top = p.top ?? L.top, topD = shade(top, -0.2), gid = useId().replace(/:/g, '');
  const suit = who === 'adam' && outfit === 'suit', shirtOnly = who === 'adam' && outfit === 'shirt';
  const torsoFill = shirtOnly ? L.shirt : top;
  const cuff = suit ? L.shirt : undefined;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -scale : scale) * k} ${scale * k})`} style={dim ? {filter: `brightness(${1 - dim})`} : undefined}>
      <defs><linearGradient id={'t' + gid} x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stopColor={shade(torsoFill, 0.12)} /><stop offset="0.6" stopColor={torsoFill} /><stop offset="1" stopColor={shade(torsoFill, -0.2)} /></linearGradient></defs>
      <Legs look={L} mode={legMode} drop={sitDrop} walk={walk} turn={turn} />
      <g transform={`rotate(${lean + sway})`}>
        <g transform={`translate(${turn * 10} 0) scale(${turnW} 1)`}>
          <path d={`M -124,${-208 + sy} Q -128,${-262 + sy} -70,${-274 + sy} L 70,${-274 + sy} Q 128,${-262 + sy} 124,${-208 + sy} L 108,8 Q 0,26 -108,8 Z`} fill={`url(#t${gid})`} stroke={INK} strokeWidth={5} strokeLinejoin="round" transform={`scale(1 ${1 + inh * 0.008 * idle})`} />
          {/* collar area and clothes details */}
          {suit && <g>
            <path d={`M -34,${-272 + sy} L 0,-150 L 34,${-272 + sy} Z`} fill={L.shirt} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
            <path d={`M -9,${-264 + sy} L 9,${-264 + sy} L 14,-196 L 0,-152 L -14,-196 Z`} fill={L.tie} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <path d={`M -34,${-272 + sy} L -2,-120 L -60,-150 Z`} fill={topD} stroke={INK} strokeWidth={3} strokeLinejoin="round" opacity={0.9} />
            <path d={`M 34,${-272 + sy} L 2,-120 L 60,-150 Z`} fill={topD} stroke={INK} strokeWidth={3} strokeLinejoin="round" opacity={0.9} />
            <path d="M 0,-120 L 0,6" stroke={INK} strokeWidth={3} opacity={0.5} /><circle cx={-6} cy={-70} r={4} fill={INK} />
          </g>}
          {shirtOnly && <g><path d={`M -30,${-272 + sy} L 0,-190 L 30,${-272 + sy}`} fill="none" stroke={INK} strokeWidth={3.2} /><path d="M 0,-190 L 0,6" stroke={INK} strokeWidth={2.6} opacity={0.4} /></g>}
          {who === 'sam' && <g>
            <path d={`M -34,${-272 + sy} Q 0,-236 34,${-272 + sy} L 0,-140 Z`} fill={L.shirt} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
            <path d="M 0,-140 L 0,6" stroke={INK} strokeWidth={4} /><path d={`M -34,${-272 + sy} L 0,-140 M 34,${-272 + sy} L 0,-140`} stroke={topD} strokeWidth={9} strokeLinecap="round" />
            {[-100, -56, -12].map((yy) => <circle key={yy} cx={-9} cy={yy} r={5.5} fill="#e8d3b0" stroke={INK} strokeWidth={2.6} />)}
            <rect x={-76} y={-70} width={44} height={46} rx={6} fill="none" stroke={topD} strokeWidth={4} /><rect x={32} y={-70} width={44} height={46} rx={6} fill="none" stroke={topD} strokeWidth={4} />
          </g>}
          {isSon(who) && <g><path d={`M -34,${-272 + sy} Q 0,-244 34,${-272 + sy}`} fill="none" stroke={topD} strokeWidth={11} strokeLinecap="round" />{who === 'leo' && age >= 14 && <path d="M -14,-250 L -10,-196 M 14,-250 L 10,-196" stroke="#e8eef8" strokeWidth={4} strokeLinecap="round" />}</g>}
          <path d={`M -88,${-240 + sy} Q -98,-120 -84,-10`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.16} />
        </g>
        <rect x={-30} y={-318 + sy} width={60} height={56} rx={16} fill={shade(L.skin, -0.08)} stroke={INK} strokeWidth={4.4} />
        <g transform={`translate(${turn * 10} ${-352 + sy}) rotate(${(p.tilt ?? 0) + Math.sin(t * 0.71 + seed * 1.7) * 1.1 * idle - sway * 0.5}) translate(0 ${-40 - (hk - 1) * 90}) scale(${hk * 1.16})`}>
          <Head who={who} age={age} face={face} turn={turn} t={t} seed={seed} idle={idle} />
        </g>
        {children}
        <Arm S={SL} T={hl} sleeve={suit ? top : shirtOnly ? L.shirt : top} cuff={cuff} skin={L.skin} s={-1} />
        <Arm S={SR} T={hr} sleeve={suit ? top : shirtOnly ? L.shirt : top} cuff={cuff} skin={L.skin} s={1} />
        {front}
      </g>
    </g>
  );
};

// a swaddled newborn, drawn in hip space for cradling (children of a Person with pose 'cradle')
export const Baby: React.FC<{x?: number; y?: number; rot?: number; skin?: string; grip?: number}> = ({x = 0, y = -118, rot = -14, skin = '#e8b793', grip = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={0} cy={0} rx={92} ry={46} fill="#f6efe2" stroke={INK} strokeWidth={4.6} />
    <path d="M -60,-20 Q 0,-44 60,-20" fill="none" stroke="#e2d5bd" strokeWidth={6} strokeLinecap="round" />
    <path d="M -30,12 Q 20,30 70,10" fill="none" stroke="#e2d5bd" strokeWidth={5} strokeLinecap="round" />
    <circle cx={-66} cy={-14} r={34} fill={skin} stroke={INK} strokeWidth={4.4} />
    <path d="M -86,-28 Q -70,-52 -46,-36" fill="#3a251c" stroke={INK} strokeWidth={3} />
    <path d="M -84,-12 q 5,5 11,0 M -64,-12 q 5,5 11,0" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    <path d="M -72,2 q 8,5 15,0" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    <ellipse cx={-76} cy={-2} rx={8} ry={5} fill="#e98a7a" opacity={0.35} />
    <ellipse cx={-48 + grip * 46} cy={14 - grip * 8} rx={11} ry={9} fill={skin} stroke={INK} strokeWidth={3.4} />
  </g>
);
