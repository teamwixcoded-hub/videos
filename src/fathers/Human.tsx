import React, {useId} from 'react';
import {Head, Face, V, Look, shade, INK} from '../same2d/Char';
import {ik2} from '../same2d/SideChar';

// ============================================================================================
// The Two Fathers body: the same glossy glass head as Same Man on a more HUMAN body. Tapered limbs that bend at real elbows and knees, a chest / waist / hip
// silhouette, clothes with collars, lapels and cuffs, shoes with soles, and hands with fingers and a thumb that curl around what they hold.
// HumanSide = three-quarter side view (facing +x, flip to face left): standing, walking, sitting. HumanFront = front view (desks, clapping, filming).
// Hip space like SideChar/Char: origin at the hips, +y down.
// ============================================================================================
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const rot = (p: V, deg: number): V => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
const mix = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const SKIN = '#f3f0fb', SKIN_D = '#d9d3ec';

export type Outfit = {style: 'suit' | 'cardigan' | 'tee' | 'hoodie'; top: string; shirt: string; pants: string; shoe: string; sleeve: 'long' | 'short'; sole?: string; watch?: boolean; simple?: boolean};

// a limb segment: thick at A, thinner at B, round at both ends
const Taper: React.FC<{A: V; B: V; r1: number; r2: number; fill: string; stroke?: string; sw?: number}> = ({A, B, r1, r2, fill, stroke = INK, sw = 4}) => {
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const p = (P: V, r: number, s: number) => `${(P[0] + nx * r * s).toFixed(1)},${(P[1] + ny * r * s).toFixed(1)}`;
  return <path d={`M ${p(A, r1, 1)} L ${p(B, r2, 1)} A ${r2} ${r2} 0 0 0 ${p(B, r2, -1)} L ${p(A, r1, -1)} A ${r1} ${r1} 0 0 0 ${p(A, r1, 1)} Z`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
};

// SIMPLE style: a limb is one smooth thick curve through the joint (no visible elbow/knee), the hand a rounded mitten with a thumb
const Noodle: React.FC<{A: V; J: V; B: V; w: number; w2?: number; fill: string}> = ({A, J, B, w, w2, fill}) => {
  const e = w2 ?? w, c: V = [2 * J[0] - (A[0] + B[0]) / 2, 2 * J[1] - (A[1] + B[1]) / 2], N = 16;
  const pts: V[] = [], nor: V[] = [], ws: number[] = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N, u = 1 - t, x = u * u * A[0] + 2 * u * t * c[0] + t * t * B[0], y = u * u * A[1] + 2 * u * t * c[1] + t * t * B[1];
    const dx = 2 * u * (c[0] - A[0]) + 2 * t * (B[0] - c[0]), dy = 2 * u * (c[1] - A[1]) + 2 * t * (B[1] - c[1]), L = Math.hypot(dx, dy) || 1;
    // the muscle bulge: a little fuller a third of the way down
    pts.push([x, y]); nor.push([-dy / L, dx / L]); ws.push((w + (e - w) * t + Math.sin(t * Math.PI) * w * 0.06) / 2);
  }
  const side = (s: number) => pts.map((p, k) => [p[0] + nor[k][0] * ws[k] * s, p[1] + nor[k][1] * ws[k] * s] as V);
  const L1 = side(1), R1 = side(-1).reverse(), d = 'M ' + [...L1, ...R1].map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L ') + ' Z';
  return (
    <g>
      <g stroke={INK} strokeWidth={4.6} strokeLinejoin="round" fill={INK}><path d={d} /><circle cx={A[0]} cy={A[1]} r={ws[0]} /><circle cx={B[0]} cy={B[1]} r={ws[N]} /></g>
      <g fill={fill}><path d={d} /><circle cx={A[0]} cy={A[1]} r={ws[0] - 0.4} /><circle cx={B[0]} cy={B[1]} r={ws[N] - 0.4} /></g>
    </g>
  );
};
const Mitten: React.FC<{curl?: number; s?: number}> = ({curl = 0.35, s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d={`M -18,-4 Q -24,26 -16,44 Q 0,${54 - curl * 14} 16,44 Q 24,26 18,-4 Z`} fill={SKIN} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d={`M 14,6 Q 34,12 32,${34 - curl * 6} Q 26,40 18,30`} fill={SKIN} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -6,38 Q 0,42 8,38" fill="none" stroke={SKIN_D} strokeWidth={3} strokeLinecap="round" />
    {[0, 1, 2].map((i) => <path key={i} d={`M -14,${10 + i * 11} Q 0,${13 + i * 11} 14,${10 + i * 11}`} fill="none" stroke={SKIN_D} strokeWidth={2.4} strokeLinecap="round" />)}
  </g>
);

// a human hand: palm, four fingers and a thumb. Drawn with the wrist at the origin and the fingers pointing along +y (the caller rotates it onto the forearm)
export const HumanHand: React.FC<{curl?: number; s?: number; dim?: boolean}> = ({curl = 0.35, s = 1, dim}) => {
  const fingers = [{x: -14, l: 30}, {x: -4.5, l: 36}, {x: 5, l: 34}, {x: 14, l: 27}];
  const bend = curl * 34;
  return (
    <g transform={`scale(${s})`} style={dim ? {filter: 'brightness(0.85)'} : undefined}>
      <g transform={`translate(19 14) rotate(${-18 - curl * 24})`}><Taper A={[0, 0]} B={[8, 30]} r1={11} r2={8.6} fill={SKIN} sw={2.8} /></g>
      <path d="M -19,-2 Q -22,18 -20,36 Q -14,46 0,46 Q 14,46 20,36 Q 22,16 19,-2 Z" fill={SKIN} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
      <path d="M -10,22 Q 0,30 12,20" fill="none" stroke={SKIN_D} strokeWidth={2.4} strokeLinecap="round" />
      <ellipse cx={-8} cy={12} rx={9} ry={5} fill="#fff" opacity={0.7} />
      {fingers.map((f, i) => (
        <g key={i} transform={`translate(${f.x} 38) rotate(${(i - 1.5) * 5 - bend * (0.5 + i * 0.12)})`}><Taper A={[0, 0]} B={[0, f.l * (1 - curl * 0.28)]} r1={8.4} r2={7} fill={SKIN} sw={2.8} /></g>
      ))}
      <path d="M -18,38 Q 0,46 18,38" fill={SKIN} stroke="none" />
      <rect x={-17} y={-12} width={34} height={14} rx={5} fill={SKIN_D} stroke={INK} strokeWidth={3} />
    </g>
  );
};

const HumanArm: React.FC<{S: V; T: V; o: Outfit; dim?: boolean; curl?: number; s: number; held?: React.ReactNode; upright?: boolean; noHand?: boolean}> = ({S, T, o, dim, curl = 0.35, s, held, upright, noHand}) => {
  // a relaxed hanging arm is almost straight with the elbow a touch BEHIND the line, so the forearm points slightly forward; every other arm keeps its elbow low
  const hang = T[1] > S[1] + 300;
  let Tg = T;
  if (hang) { const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy) || 1, want = 0.965 * 355; Tg = [S[0] + (dx / d) * want, S[1] + (dy / d) * want]; }
  const {J: E, H} = ik2(S, Tg, 185, 170, hang ? (c) => (c[0][0] < c[1][0] ? c[0] : c[1]) : (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));
  const fa = (Math.atan2(H[1] - E[1], H[0] - E[0]) * 180) / Math.PI, wr = mix(E, H, 0.9);
  const slv = o.sleeve === 'long' ? o.top : SKIN, cuff = o.style === 'suit' ? o.shirt : null;
  return (
    o.simple ? (
      <g style={dim ? {filter: 'brightness(0.9)'} : undefined}>
        <Noodle A={S} J={E} B={wr} w={50} w2={37} fill={o.top} />
        {o.watch && <g transform={`translate(${mix(E, H, 0.82)[0]} ${mix(E, H, 0.82)[1]}) rotate(${fa})`}><rect x={-9} y={-20} width={18} height={40} rx={5} fill="#5a3a24" stroke={INK} strokeWidth={2.6} /><circle r={14} fill="#f2c14e" stroke={INK} strokeWidth={3} /><circle r={9.5} fill="#fbf1d2" /></g>}
        {held && (upright ? <g transform={`translate(${H[0]} ${H[1]})`}>{held}</g> : <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)">{held}</g></g>)}
        {!(held && upright) && !noHand && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)"><Mitten curl={curl} s={s * 1.25} /></g></g>}
      </g>
    ) : (
    <g style={dim ? {filter: 'brightness(0.9)'} : undefined}>
      <Taper A={S} B={E} r1={31} r2={24} fill={o.top} />
      <Taper A={E} B={wr} r1={23} r2={16} fill={slv} />
      {o.sleeve === 'short' && <circle cx={E[0]} cy={E[1]} r={24} fill={o.top} stroke="none" />}
      {cuff && (() => { const c0 = mix(E, wr, 0.78); return <Taper A={c0} B={wr} r1={19} r2={17} fill={cuff} sw={3} />; })()}
      <path d={`M ${S[0] - 8},${S[1] - 6} L ${E[0] - 8},${E[1] - 5}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.2} />
      <circle cx={E[0]} cy={E[1]} r={9} fill={shade(o.top, -0.12)} opacity={0.4} />
      {o.watch && (() => { const w = mix(E, H, 0.8); return <g transform={`translate(${w[0]} ${w[1]}) rotate(${fa})`}><rect x={-9} y={-20} width={18} height={40} rx={5} fill="#5a3a24" stroke={INK} strokeWidth={2.6} /><circle cx={0} cy={0} r={15} fill="#f2c14e" stroke={INK} strokeWidth={3} /><circle cx={0} cy={0} r={10.5} fill="#fbf1d2" stroke={INK} strokeWidth={1.6} /><path d="M 0,-8 L 0,0 L 6,3" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" /></g>; })()}
      {held && (upright ? <g transform={`translate(${H[0]} ${H[1]})`}>{held}</g> : <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)">{held}</g></g>)}
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -${6})`}><HumanHand curl={curl} s={s * 1.3} dim={dim} /></g></g>
    </g>
    )
  );
};

const HumanLeg: React.FC<{HJ: V; T: V; o: Outfit; dim?: boolean; up?: boolean; lift?: number}> = ({HJ, T, o, dim, up, lift = 0}) => {
  const a = 200, b = 190;
  const {J: K, H: A} = ik2(HJ, T, a, b, up ? (c) => (c[0][1] < c[1][1] ? c[0] : c[1]) : (c) => (c[0][0] > c[1][0] ? c[0] : c[1]));
  const ang = A[1] > 300 ? clamp((393 - A[1]) * 0.8, 0, 38) : 0;
  if (o.simple) return (
    <g style={dim ? {filter: 'brightness(0.8)'} : undefined}>
      <Noodle A={HJ} J={K} B={A} w={76} w2={48} fill={o.pants} />
      <g transform={`translate(${A[0]} ${A[1]}) rotate(${ang})`}><path d="M -26,-16 Q -30,26 -22,30 L 70,30 Q 96,26 94,6 Q 90,-8 66,-12 Q 40,-16 24,-26 Z" fill={o.shoe} stroke={INK} strokeWidth={4.4} strokeLinejoin="round" /><path d="M 40,-6 q 16,8 34,2" fill="none" stroke="#fff" strokeWidth={3} opacity={0.3} strokeLinecap="round" /></g>
    </g>
  );
  return (
    <g style={dim ? {filter: 'brightness(0.8)'} : undefined}>
      <Taper A={HJ} B={K} r1={44} r2={31} fill={o.pants} />
      <Taper A={K} B={A} r1={30} r2={21} fill={o.pants} />
      <path d={`M ${HJ[0] + 6},${HJ[1] + 6} L ${K[0] + 5},${K[1] + 2}`} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.14} />
      <g transform={`translate(${A[0]} ${A[1]}) rotate(${ang + lift})`}>
        <path d="M -24,-14 Q -30,12 -26,30 L 74,30 Q 100,28 102,8 Q 100,-8 76,-12 Q 46,-14 22,-26 Z" fill={o.shoe} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M -26,26 L 100,26" stroke={o.sole ?? '#e9e6f4'} strokeWidth={8} strokeLinecap="round" />
        <path d="M -26,26 L 100,26" stroke={INK} strokeWidth={1.6} opacity={0.6} transform="translate(0 4)" />
        <path d="M 30,-8 q 12,8 24,2 M 42,-14 q 10,8 20,2" fill="none" stroke="#fff" strokeWidth={2.6} opacity={0.5} strokeLinecap="round" />
        <path d="M 60,0 Q 80,2 88,14" fill="none" stroke="#fff" strokeWidth={4} opacity={0.3} strokeLinecap="round" />
      </g>
    </g>
  );
};

export type HumanSideProps = {
  x: number; y: number; scale?: number; flip?: boolean; torso: number; headPitch?: number; turn?: number; face?: Face; handN: V; handF: V; footN: V; footF: V; legUp?: boolean;
  look?: Look; grey?: number; outfit: Outfit; tie?: boolean; t: number; seed?: number; dim?: number; idle?: number; slump?: number; curlN?: number; curlF?: number; heldN?: React.ReactNode; heldUp?: boolean; children?: React.ReactNode;
};

export const HumanSide: React.FC<HumanSideProps> = ({x, y, scale = 1, flip, torso, headPitch = 8, turn = 0.85, face = {}, handN, handF, footN, footF, legUp, look = 'man', grey = 0, outfit, tie, t, seed = 0, dim = 0, idle = 1, slump = 0, curlN = 0.35, curlF = 0.35, heldN, heldUp, children}) => {
  const id = useId().replace(/:/g, '');
  const inh = Math.sin(t * 1.9 + seed);
  // weight shift: the pelvis drifts one way, the chest answers, the head lags a beat behind and settles
  const shiftX = Math.sin(t * 0.5 + seed * 2) * 5 * idle, sway = Math.sin(t * 0.55 + seed * 2) * 1.0 * idle;
  const th = torso + sway;
  const lag = Math.sin(t * 0.9 + seed * 1.7 - 0.5) * 1.6 * idle;
  // shoulders roll forward when the hands work in front of the body, so the upper arm points forward and the elbow does not trail behind
  const pro = (hx: number) => clamp((hx - 110) / 160, 0, 1) * 46;
  const SH = rot([6 + pro(handN[0]), -276 + slump * 18 - inh * 2.4 * idle], th), SHF = rot([-12 + pro(handF[0]), -278 + slump * 18 - inh * 2.4 * idle], th);
  const NECK = rot([2, -312 + slump * 12], th);
  const jit = (a: number, b: number): V => [Math.sin(t * 1.3 + seed + a) * 2.2 * idle, Math.cos(t * 1.1 + seed * 2 + b) * 2.2 * idle];
  const hN: V = [handN[0] + jit(0, 1)[0], handN[1] + jit(0, 1)[1]], hF: V = [handF[0] + jit(2, 3)[0], handF[1] + jit(2, 3)[1]];
  const HJ: V = [shiftX * 0.4, 14];
  const headRot = th + headPitch + lag;
  const o = outfit, topG = shade(o.top, 0.16), topD = shade(o.top, -0.22);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} style={dim ? {filter: `brightness(${1 - dim})`} : undefined}>
      <defs>
        <linearGradient id={'tg' + id} x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stopColor={topD} /><stop offset="0.5" stopColor={o.top} /><stop offset="1" stopColor={topG} /></linearGradient>
      </defs>
      <HumanLeg HJ={HJ} T={footF} o={o} dim up={legUp} />
      <HumanArm S={SHF} T={hF} o={o} dim curl={curlF} s={0.96} />
      {/* hips and trousers, then the torso: back curve, chest, waist, hip */}
      <ellipse cx={shiftX * 0.4} cy={22} rx={76} ry={58} fill={o.pants} stroke={INK} strokeWidth={4} />
      <g transform={`translate(${shiftX * 0.4} 0) rotate(${th})`}>
        <path d="M -64,16 C -88,-90 -82,-220 -56,-304 Q 12,-342 70,-300 C 98,-230 94,-150 68,-70 C 64,-40 78,-10 72,18 Z" fill={`url(#tg${id})`} stroke={INK} strokeWidth={4.4} strokeLinejoin="round" transform={`scale(1 ${1 + inh * 0.012 * idle})`} />
        {o.style === 'suit' && <g>
          <path d="M 40,-306 L 78,-224 L 52,-150 L 70,-30 L 66,-8" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" opacity={0.7} />
          <path d="M 42,-304 L 74,-232 L 58,-210 Z" fill={topD} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
          <path d="M 44,-300 L 62,-250 L 74,-232 L 54,-186 L 70,-96 L 80,-230 Q 74,-290 58,-304 Z" fill={o.shirt} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" opacity={0.96} />
          {tie && <path d="M 56,-282 L 72,-282 L 78,-190 L 66,-150 L 58,-190 Z" fill="#e0455a" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />}
          <circle cx={64} cy={-80} r={4} fill={INK} /><circle cx={66} cy={-40} r={4} fill={INK} />
        </g>}
        {o.style === 'cardigan' && <g>
          <path d="M 44,-306 Q 66,-250 70,-200 L 74,-20" fill="none" stroke={INK} strokeWidth={3} opacity={0.75} />
          <path d="M 46,-304 Q 70,-240 74,-196 L 90,-232 Q 84,-292 62,-304 Z" fill={o.shirt} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
          {[-190, -140, -90, -40].map((yy) => <circle key={yy} cx={70} cy={yy} r={5} fill="#e9d6b4" stroke={INK} strokeWidth={2} />)}
          <rect x={20} y={-110} width={46} height={44} rx={8} fill="none" stroke={topD} strokeWidth={4} />
        </g>}
        {(o.style === 'tee' || o.style === 'hoodie') && <g>
          <path d="M 40,-306 Q 62,-278 78,-292" fill="none" stroke={topD} strokeWidth={10} strokeLinecap="round" />
          {o.style === 'hoodie' && <path d="M 60,-276 L 64,-206 M 74,-272 L 76,-202" stroke="#eef0fa" strokeWidth={4} strokeLinecap="round" />}
        </g>}
        <path d="M -60,-290 C -78,-200 -76,-100 -60,-10" fill="none" stroke={shade(o.top, -0.45)} strokeWidth={10} strokeLinecap="round" opacity={0.28} />
        <path d="M 74,-250 C 92,-190 92,-110 76,-50" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.2} />
        {(o.style === 'suit' || o.style === 'cardigan') && <rect x={-62} y={-14} width={134} height={14} rx={5} fill={topD} stroke={INK} strokeWidth={2.4} opacity={0.9} />}
        <path d="M 2,-340 L 2,-300" stroke="none" />
      </g>
      <g transform={`translate(${NECK[0] + shiftX * 0.4} ${NECK[1]}) rotate(${headRot}) translate(24 -128)`}>
        <rect x={-30} y={116} width={60} height={86} rx={22} fill={SKIN} stroke={INK} strokeWidth={5} />
        <Head face={face} turn={turn} t={t} seed={seed} idle={idle} look={look} grey={grey} />
      </g>
      <HumanLeg HJ={HJ} T={footN} o={o} up={legUp} />
      {children}
      <HumanArm S={SH} T={hN} o={o} curl={curlN} s={1} held={heldN} upright={heldUp} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------------------------------------
// front view: sitting at a desk, clapping, filming, on a bench. Shoulders and waist, jacket or tee, two arms with elbows, trousers and shoes.
export type HumanFrontProps = {
  x: number; y: number; scale?: number; flip?: boolean; lean?: number; head?: {turn?: number; tilt?: number}; face?: Face; handL: V; handR: V; slump?: number; legs?: 'none' | 'sit';
  look?: Look; grey?: number; outfit: Outfit; tie?: boolean; t: number; seed?: number; dim?: number; idle?: number; curl?: number; heldR?: React.ReactNode; heldUp?: boolean; noHands?: boolean; children?: React.ReactNode;
};
const FrontArm: React.FC<{S: V; T: V; o: Outfit; s: number; curl: number; held?: React.ReactNode; upright?: boolean; noHand?: boolean}> = ({S, T, o, s, curl, held, upright, noHand}) => {
  // a hanging arm is nearly straight down along the body, not a wing
  let Tg = T;
  if (T[1] > S[1] + 250) { const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy) || 1, want = 0.975 * 340; Tg = [S[0] + (dx / d) * want, S[1] + (dy / d) * want]; }
  const hangF = T[1] > S[1] + 250, sg = S[0] < 0 ? -1 : 1, {J: E, H} = ik2(S, Tg, 176, 164, hangF ? (c) => ((c[0][0] - c[1][0]) * (S[0] < 0 ? -1 : 1) > 0 ? c[0] : c[1]) : (c) => ((c[0][1] + (c[0][0] - S[0]) * sg * 0.25) > (c[1][1] + (c[1][0] - S[0]) * sg * 0.25) ? c[0] : c[1]));
  const fa = (Math.atan2(H[1] - E[1], H[0] - E[0]) * 180) / Math.PI, wr = mix(E, H, 0.9), slv = o.sleeve === 'long' ? o.top : SKIN;
  if (o.simple) return (
    <g>
      <Noodle A={S} J={E} B={wr} w={50} w2={37} fill={o.top} />
      {held && (upright ? <g transform={`translate(${H[0]} ${H[1]})`}>{held}</g> : <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)">{held}</g></g>)}
      {!(held && upright) && !noHand && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)"><Mitten curl={curl} s={s * 1.25} /></g></g>}
    </g>
  );
  return (
    <g>
      <Taper A={S} B={E} r1={31} r2={24} fill={o.top} />
      <Taper A={E} B={wr} r1={23} r2={16} fill={slv} />
      {o.style === 'suit' && (() => { const c0 = mix(E, wr, 0.78); return <Taper A={c0} B={wr} r1={19} r2={17} fill={o.shirt} sw={3} />; })()}
      <path d={`M ${S[0] - 6},${S[1] - 4} L ${E[0] - 6},${E[1] - 4}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.2} />
      {held && (upright ? <g transform={`translate(${H[0]} ${H[1]})`}>{held}</g> : <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)">{held}</g></g>)}
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform="translate(0 -6)"><g transform={`scale(${s * 1.3} 1.3)`}><HumanHand curl={curl} /></g></g></g>
    </g>
  );
};
export const HumanFront: React.FC<HumanFrontProps> = ({x, y, scale = 1, flip, lean = 0, head = {}, face = {}, handL, handR, slump = 0, legs = 'none', look = 'man', grey = 0, outfit, tie, t, seed = 0, dim = 0, idle = 1, curl = 0.35, heldR, heldUp, noHands, children}) => {
  const id = useId().replace(/:/g, '');
  const inh = Math.sin(t * 1.9 + seed), sway = Math.sin(t * 0.55 + seed * 2) * 1.0 * idle, sy = slump * 30 - inh * 2.6 * idle, o = outfit;
  const j = (a: number, b: number): V => [Math.sin(t * 1.3 + seed + a) * 2.2 * idle, Math.cos(t * 1.1 + seed * 2 + b) * 2.2 * idle];
  const hl: V = [handL[0] + j(0, 1)[0], handL[1] + j(0, 1)[1]], hr: V = [handR[0] + j(2, 3)[0], handR[1] + j(2, 3)[1]];
  const SL: V = [-118, -318 + sy], SR: V = [118, -318 + sy], topD = shade(o.top, -0.22), topG = shade(o.top, 0.16);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} style={dim ? {filter: `brightness(${1 - dim})`} : undefined}>
      <defs><linearGradient id={'fg' + id} x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stopColor={topG} /><stop offset="0.55" stopColor={o.top} /><stop offset="1" stopColor={topD} /></linearGradient></defs>
      {legs === 'sit' && [-1, 1].map((s) => o.simple ? (
        <g key={s}>
          <Noodle A={[s * 52, 34]} J={[s * 92, 86]} B={[s * 80, 268]} w={80} w2={50} fill={o.pants} />
          <g transform={`translate(${s * 78} 276)`}><path d="M -40,-14 Q -46,8 -38,24 L 44,24 Q 62,18 60,0 Q 56,-14 34,-18 Z" fill={o.shoe} stroke={INK} strokeWidth={4.4} strokeLinejoin="round" /></g>
        </g>
      ) : (
        <g key={s}>
          <Taper A={[s * 56, 40]} B={[s * 82, 160]} r1={52} r2={40} fill={o.pants} />
          <Taper A={[s * 82, 160]} B={[s * 76, 268]} r1={36} r2={25} fill={o.pants} />
          <g transform={`translate(${s * 78} 276)`}>
            <path d="M -40,-14 Q -46,8 -38,24 L 44,24 Q 62,18 60,0 Q 56,-14 34,-18 Z" fill={o.shoe} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <path d="M -40,20 L 56,20" stroke={o.sole ?? '#e9e6f4'} strokeWidth={8} strokeLinecap="round" />
          </g>
        </g>
      ))}
      <g transform={`rotate(${lean + sway})`}>
        {/* torso: shoulders, a waist and hips */}
        <path d={`M -124,${-286 + sy} Q -140,-170 -108,8 L 108,8 Q 140,-170 124,${-286 + sy} Q 0,${-352 + sy} -124,${-286 + sy} Z`} fill={`url(#fg${id})`} stroke={INK} strokeWidth={4.4} strokeLinejoin="round" transform={`scale(1 ${1 + inh * 0.012 * idle})`} />
        <path d={`M -96,${-270 + sy} Q -116,-150 -92,-20`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.2} />
        {o.style === 'suit' && <g>
          <path d={`M -40,${-334 + sy} L 0,-190 L 40,${-334 + sy} Z`} fill={o.shirt} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          {tie && <path d={`M -11,${-326 + sy} L 11,${-326 + sy} L 17,-210 L 0,-160 L -17,-210 Z`} fill="#e0455a" stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
          <path d={`M -40,${-334 + sy} L -4,-150 L -74,-190 Z`} fill={topD} stroke={INK} strokeWidth={3} strokeLinejoin="round" /><path d={`M 40,${-334 + sy} L 4,-150 L 74,-190 Z`} fill={topD} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d="M 0,-150 L 0,8" stroke={INK} strokeWidth={3} opacity={0.6} /><circle cx={-7} cy={-80} r={4.4} fill={INK} /><rect x={-108} y={-14} width={216} height={14} rx={5} fill={topD} stroke={INK} strokeWidth={2.4} opacity={0.8} />
        </g>}
        {o.style === 'cardigan' && <g>
          <path d={`M -42,${-334 + sy} Q 0,-290 42,${-334 + sy} L 0,-150 Z`} fill={o.shirt} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d="M 0,-150 L 0,8" stroke={INK} strokeWidth={4} /><path d={`M -42,${-334 + sy} L 0,-150 M 42,${-334 + sy} L 0,-150`} stroke={topD} strokeWidth={9} strokeLinecap="round" />
          {[-110, -66, -22].map((yy) => <circle key={yy} cx={-9} cy={yy} r={5.5} fill="#e9d6b4" stroke={INK} strokeWidth={2} />)}
          <rect x={-84} y={-80} width={46} height={48} rx={7} fill="none" stroke={topD} strokeWidth={4} /><rect x={38} y={-80} width={46} height={48} rx={7} fill="none" stroke={topD} strokeWidth={4} />
        </g>}
        {(o.style === 'tee' || o.style === 'hoodie') && <g>
          <path d={`M -44,${-334 + sy} Q 0,-292 44,${-334 + sy}`} fill="none" stroke={topD} strokeWidth={13} strokeLinecap="round" />
          {o.style === 'hoodie' && <path d="M -16,-300 L -12,-216 M 16,-300 L 12,-216" stroke="#eef0fa" strokeWidth={4.4} strokeLinecap="round" />}
        </g>}
        <rect x={-27} y={-376 + sy} width={54} height={58} rx={18} fill={SKIN} stroke={INK} strokeWidth={5} />
        <g transform={`translate(0 ${-352 + sy}) rotate(${(head.tilt ?? 0) + Math.sin(t * 0.71 + seed * 1.7 - 0.5) * 1.4 * idle - sway * 0.6}) translate(${(Math.sin(t * 0.43 + seed) * 4 * idle)} ${-172 + inh * 1.2 * idle})`}>
          <Head face={face} turn={head.turn ?? 0} t={t} seed={seed} idle={idle} look={look} grey={grey} />
        </g>
        {children}
        <FrontArm S={SL} T={hl} o={o} s={-1} curl={curl} noHand={noHands} />
        <FrontArm S={SR} T={hr} o={o} s={1} curl={curl} held={heldR} upright={heldUp} noHand={noHands} />
      </g>
    </g>
  );
};
