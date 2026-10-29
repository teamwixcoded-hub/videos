import React, {useId} from 'react';

// ============================================================================================
// The Same Man, flat 2D with soft shading. Glass-bubble head with a hair lens and a dark swoosh, black oval eyes, purple tee, thin black limbs,
// white gloves, white domed shoes. Drawn waist-up in "hip space": origin at the hips, +y is down, ~700 px tall. Arms are 2-bone IK so the
// gloves land on the hand targets. A built-in idle layer keeps him alive: breathing that lifts the shoulders, weight sway with the head
// counter-rotating, eye saccades, irregular blinks with the odd double blink, tiny hand drift.
// ============================================================================================
export const INK = '#1d1a2e', LIMB = '#1b1922', TEE = '#9a7be4', TEE_DK = '#7d60ca', HEADC = '#f1eefb', GLOVE = '#ffffff', SHOE = '#f6f5fb', HAIR = '#2b2634';
export type V = [number, number];
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const mix = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const sstep = (x: number) => { const k = clamp(x, 0, 1); return k * k * (3 - 2 * k); };
export const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16), f = (v: number) => Math.round(clamp(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt), 0, 255));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
};

export type Face = {
  gaze?: V;            // -1..1, pupils slide inside the eye
  lids?: number;       // 0 open .. 1 shut (tired)
  smile?: number;      // 0 flat .. 1 big smile
  open?: number;       // 0..1 mouth open (yawn, laugh, talking)
  brow?: number;       // raise
  browTilt?: number;   // degrees, + = worried / soft, - = angry
  squint?: number;     // lower lids push up (a real smile reaches the eyes); defaults from the smile
  skew?: number;       // -1..1 smirk: one mouth corner higher than the other
  wide?: number;       // 0..1 eyes widen (surprise, alert)
  asym?: number;       // one brow higher than the other
};
export type CharProps = {
  x: number; y: number; scale?: number; flip?: boolean;
  lean?: number;                         // degrees, upper body rotates about the hips
  head?: {tilt?: number; dx?: number; dy?: number; turn?: number};
  face?: Face;
  handL?: V; handR?: V;                  // glove targets in hip space (screen-left / screen-right arm)
  slump?: number;                        // 0..1 shoulders and head sink
  legs?: 'none' | 'sit';
  thumbL?: boolean; thumbR?: boolean;   // false when the thumb is hidden behind a held phone or book
  elbowL?: 'low' | 'out'; elbowR?: 'low' | 'out';
  tee?: string; t: number; seed?: number; dim?: number; idle?: number;
  children?: React.ReactNode;            // props in hip space (phone, book, mug), drawn behind the gloves
};

const Arm: React.FC<{S: V; T: V; s: number; tee: string; thumb?: boolean; pref?: 'low' | 'out'}> = ({S, T, s, tee, thumb = true, pref = 'low'}) => {
  const a = 198, b = 182;
  let dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy);
  const maxd = a + b - 2;
  if (d > maxd) { dx *= maxd / d; dy *= maxd / d; d = maxd; }
  d = Math.max(d, 70);
  const base = Math.atan2(dy, dx), A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  const cand = [base + A, base - A].map((g): V => [S[0] + Math.cos(g) * a, S[1] + Math.sin(g) * a]);
  // the lower elbow (and the more outward one on ties) looks natural
  // 'out' flares the elbow away from the body (a held book or phone at a distance); 'low' tucks it down (resting, hands near the face)
  const E = pref === 'out' ? (s * cand[0][0] > s * cand[1][0] ? cand[0] : cand[1])
    : cand[0][1] > cand[1][1] + 1 ? cand[0] : cand[1][1] > cand[0][1] + 1 ? cand[1] : (Math.abs(cand[0][0]) > Math.abs(cand[1][0]) ? cand[0] : cand[1]);
  const H: V = [S[0] + dx, S[1] + dy];
  const sl = mix(S, E, 78 / a);
  const fa = Math.atan2(H[1] - E[1], H[0] - E[0]) * 180 / Math.PI;
  return (
    <g>
      <g stroke={INK} strokeLinecap="round" fill="none">
        <line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={36} />
        <line x1={E[0]} y1={E[1]} x2={H[0]} y2={H[1]} strokeWidth={34} />
        <line x1={S[0]} y1={S[1]} x2={sl[0]} y2={sl[1]} strokeWidth={68} />
      </g>
      <g stroke={LIMB} strokeLinecap="round" fill="none">
        <line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={24} />
        <line x1={E[0]} y1={E[1]} x2={H[0]} y2={H[1]} strokeWidth={22} />
      </g>
      {/* gloss line along the limb */}
      <g stroke="#fff" strokeLinecap="round" opacity={0.22} fill="none">
        <line x1={S[0] - 5} y1={S[1] + 4} x2={E[0] - 5} y2={E[1] - 3} strokeWidth={4} />
        <line x1={E[0] - 5} y1={E[1] - 3} x2={H[0] - 4} y2={H[1] - 3} strokeWidth={4} />
      </g>
      <circle cx={E[0]} cy={E[1]} r={15} fill={LIMB} />
      <line x1={S[0]} y1={S[1]} x2={sl[0]} y2={sl[1]} stroke={tee} strokeWidth={56} strokeLinecap="round" />
      <line x1={S[0]} y1={S[1]} x2={sl[0]} y2={sl[1]} stroke={shade(tee, 0.3)} strokeWidth={14} strokeLinecap="round" opacity={0.55} transform="translate(-9 -9)" />
      <line x1={sl[0] + (E[0] - S[0]) * 0.04} y1={sl[1] + (E[1] - S[1]) * 0.04} x2={sl[0] + (E[0] - S[0]) * 0.04} y2={sl[1] + (E[1] - S[1]) * 0.04} stroke={shade(tee, -0.3)} strokeWidth={50} strokeLinecap="round" opacity={0.0} />
      <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}>
        {thumb && <ellipse cx={s * -36} cy={4} rx={15} ry={23} fill={GLOVE} stroke={INK} strokeWidth={5} transform={`rotate(${s * -28} ${s * -36} 4)`} />}
        <ellipse cx={0} cy={10} rx={40} ry={37} fill={GLOVE} stroke={INK} strokeWidth={6} />
        <path d="M -14,26 Q -12,10 -14,0 M 6,30 Q 8,12 6,0 M 24,24 Q 24,10 22,2" fill="none" stroke="#c9c3de" strokeWidth={3.5} strokeLinecap="round" />
        <ellipse cx={-8} cy={-2} rx={17} ry={8} fill="#e8e4f6" opacity={0.85} />
        <rect x={-18} y={-30} width={36} height={14} rx={7} fill={LIMB} stroke={INK} strokeWidth={4} />
      </g>
    </g>
  );
};

export type Look = 'man' | 'mom' | 'manager' | 'colleague' | 'friend';
// other people use the same rig with different hair, glasses and clothes, so the cast stays one family of characters
const Hair: React.FC<{look: Look; turn: number}> = ({look, turn}) => (
  <g transform={`translate(${turn * 30} 0)`}>
    {look === 'mom' && <g><circle cx={0} cy={-176} r={46} fill="#6b3f2a" stroke={INK} strokeWidth={7} /><path d="M -142,-48 A 150 150 0 0 1 142,-48 Q 70,-122 0,-126 Q -70,-122 -142,-48 Z" fill="#6b3f2a" stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M -40,-120 Q -10,-96 30,-118" fill="none" stroke="#8a5738" strokeWidth={8} strokeLinecap="round" /></g>}
    {look === 'manager' && <g><path d="M -144,-40 A 150 150 0 0 1 144,-40 Q 90,-134 0,-136 Q -90,-134 -144,-40 Z" fill="#2f2a33" stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M -30,-134 Q -10,-108 -50,-92" fill="none" stroke="#4a4452" strokeWidth={6} strokeLinecap="round" /></g>}
    {look === 'colleague' && <g><path d="M -146,-30 A 150 150 0 0 1 146,-30 Q 150,-120 40,-132 Q -60,-150 -146,-30 Z" fill="#8a5a36" stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M 20,-134 Q 90,-120 120,-70" fill="none" stroke="#a8723f" strokeWidth={9} strokeLinecap="round" /></g>}
    {look === 'friend' && <g><ellipse cx={0} cy={-112} rx={156} ry={84} fill="#d9534f" stroke={INK} strokeWidth={7} /><rect x={-158} y={-70} width={316} height={34} rx={16} fill="#b8403d" stroke={INK} strokeWidth={7} /><circle cx={0} cy={-206} r={30} fill="#f4d35e" stroke={INK} strokeWidth={6} /></g>}
  </g>
);

export const Head: React.FC<{face: Face; turn: number; t: number; seed: number; idle: number; look?: Look}> = ({face, turn, t, seed, idle, look = 'man'}) => {
  const {gaze = [0, 0], lids = 0.05, smile = 0, open = 0, brow = 0, browTilt = 0, wide = 0} = face;
  const mid = useId().replace(/:/g, '');
  // irregular blink with the odd double blink
  const P = 3.5 + 0.9 * Math.sin(seed * 7.3), ph = (t + seed * 2.1) % P, cyc = Math.floor((t + seed * 2.1) / P);
  const b1 = ph < 0.16 ? Math.sin((ph / 0.16) * Math.PI) : 0, b2 = cyc % 3 === 0 && ph > 0.3 && ph < 0.46 ? Math.sin(((ph - 0.3) / 0.16) * Math.PI) : 0;
  const cover = Math.max(lids, b1, b2);
  // eye saccades: small jumps every ~0.8 s, a quick glide to each new spot
  const k = Math.floor(t / 0.8 + seed * 5), fr = (t / 0.8 + seed * 5) % 1;
  const jx = (rnd(k) - 0.5) * 0.3 * idle, jy = (rnd(k + 91) - 0.5) * 0.2 * idle, px = (rnd(k - 1) - 0.5) * 0.3 * idle, py = (rnd(k + 90) - 0.5) * 0.2 * idle;
  const gz: V = [gaze[0] + px + (jx - px) * sstep(fr / 0.14), gaze[1] + py + (jy - py) * sstep(fr / 0.14)];
  // micro-expressions: the brows twitch up now and then
  const kb = Math.floor(t / 1.7 + seed * 3), fb = (t / 1.7 + seed * 3) % 1;
  const flick = rnd(kb + 7) > 0.72 ? Math.sin(Math.min(1, fb / 0.35) * Math.PI) * 0.35 * idle : 0;
  const sm = clamp(smile, 0, 1);
  const squint = clamp(face.squint ?? sm * 0.6, 0, 1);
  const skew = face.skew ?? (sm > 0.05 ? (rnd(Math.floor(seed * 10) + 3) - 0.5) * 0.5 : 0);
  const asym = face.asym ?? 0.12 * (rnd(Math.floor(seed * 10) + 11) - 0.5);
  const my = 64, mw = 34 + sm * 10 - open * 4;
  const yL = my - skew * 7 - sm * 3, yR = my + skew * 7 - sm * 3;     // mouth corners
  const sag = 6 + sm * 40 - (lids > 0.35 && sm < 0.2 ? 6 : 0);          // tired faces droop at the corners
  const mouthOpen = `M ${-mw},${yL} Q 0,${my + 12 + 78 * open + 16 * sm} ${mw},${yR} Q 0,${my - 6 - 4 * open} ${-mw},${yL} Z`;
  return (
    <g>
      <defs>
        <radialGradient id="hg" cx="0.34" cy="0.28" r="0.9"><stop offset="0" stopColor="#ffffff" /><stop offset="0.65" stopColor="#ece8f8" /><stop offset="1" stopColor="#c9bfe3" /></radialGradient>
        <clipPath id={'mc' + mid}><path d={mouthOpen} /></clipPath>
      </defs>
      <circle r={150} fill="url(#hg)" stroke={INK} strokeWidth={8} />
      <path d="M 96,-40 A 118 118 0 0 1 -30,118" fill="none" stroke="#b7aad8" strokeWidth={16} strokeLinecap="round" opacity={0.35} />
      <ellipse cx={-66} cy={-84} rx={40} ry={16} fill="#fff" opacity={0.95} transform="rotate(-38 -66 -84)" />
      <circle cx={-106} cy={-34} r={7} fill="#fff" opacity={0.8} />
      <circle cx={104} cy={-70} r={5} fill="#fff" opacity={0.5} />
      {/* hair: a glassy lens with a dark swoosh across the forehead */}
      {look !== 'man' && <Hair look={look} turn={turn} />}
      {look === 'man' && <g transform={`translate(${turn * 30} 0)`}>
        <ellipse cx={-22} cy={-144} rx={90} ry={40} transform="rotate(-12 -22 -144)" fill="url(#hg)" stroke={HAIR} strokeWidth={8} />
        <ellipse cx={-52} cy={-156} rx={34} ry={9} transform="rotate(-14 -52 -156)" fill="#fff" opacity={0.85} />
        <path d="M -84,-98 Q -30,-142 62,-110" fill="none" stroke={HAIR} strokeWidth={13} strokeLinecap="round" />
      </g>}
      <g transform={`translate(${turn * 58} 0) scale(${1 - Math.abs(turn) * 0.16} 1)`}>
        <ellipse cx={-96} cy={34} rx={26} ry={15} fill="#f2a6b8" opacity={0.2 + sm * 0.25} />
        <ellipse cx={96} cy={34} rx={26} ry={15} fill="#f2a6b8" opacity={0.2 + sm * 0.25} />
        {[-1, 1].map((s) => {
          const far0 = s * turn < 0 ? Math.min(1, Math.abs(turn)) : 0;
          const cx = s * 58 - s * 12 * far0, cy = -8, ry = 27 * (1 + 0.28 * wide), rx = 17 * (1 + 0.1 * wide) * (1 - 0.35 * far0);
          const by = -68 - (brow + flick) * 12 - (s > 0 ? asym : -asym) * 10;
          const lidH = Math.max(0, 70 * cover), lowH = 30 * squint;
          return (
            <g key={s}>
              <ellipse cx={cx + gz[0] * 8} cy={cy + gz[1] * 7} rx={rx} ry={ry} fill={INK} />
              <circle cx={cx + gz[0] * 8 + 5} cy={cy + gz[1] * 7 - 10} r={5.5} fill="#fff" />
              <circle cx={cx + gz[0] * 8 - 5} cy={cy + gz[1] * 7 + 12} r={2.6} fill="#fff" opacity={0.7} />
              {/* upper lid (tiredness) and lower lid (a smile pushes the cheek up into the eye) */}
              <rect x={cx - 27} y={cy - 40} width={54} height={Math.max(0, lidH + (cover > 0 ? 4 : 0))} rx={8} fill="#f1eefb" />
              {cover > 0.12 && <path d={`M ${cx - 25},${cy - 36 + lidH} Q ${cx},${cy - 36 + lidH + 7} ${cx + 25},${cy - 36 + lidH}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
              {lowH > 1 && <g><ellipse cx={cx} cy={cy + 38} rx={30} ry={lowH} fill="#f1eefb" /><path d={`M ${cx - 22},${cy + 38 - lowH * 0.85} Q ${cx},${cy + 38 - lowH * 1.15} ${cx + 22},${cy + 38 - lowH * 0.85}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.5} /></g>}
              {cover < 0.12 && lowH < 4 && <path d={`M ${cx - 22},${cy - 38} Q ${cx},${cy - 46} ${cx + 22},${cy - 38}`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.32} />}
              <path d={`M ${cx - 27},${by + 9} Q ${cx},${by - 12} ${cx + 27},${by + 9}`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" transform={`rotate(${-s * browTilt} ${cx} ${by})`} />
              {look === 'manager' && <circle cx={cx} cy={cy} r={40} fill="rgba(255,255,255,0.14)" stroke={INK} strokeWidth={6} />}
            </g>
          );
        })}
        {look === 'manager' && <path d="M -20,-10 Q 0,-24 20,-10" fill="none" stroke={INK} strokeWidth={6} />}
        {open > 0.04
          ? <g>
              <path d={mouthOpen} fill="#3a1620" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
              <g clipPath={`url(#mc${mid})`}>
                {open > 0.22 && sm > 0.25 && <rect x={-mw} y={my - 8} width={mw * 2} height={16 + 10 * open} fill="#fff" />}
                <ellipse cx={0} cy={my + 10 + 62 * open} rx={20} ry={10 + 9 * open} fill="#e98aa1" />
              </g>
              <path d={mouthOpen} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            </g>
          : <path d={`M ${-mw},${yL} Q 0,${my + sag} ${mw},${yR}`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
        {sm > 0.35 && <g fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.5}><path d={`M ${-mw - 8},${yL - 8} q -7,9 0,19`} /><path d={`M ${mw + 8},${yR - 8} q 7,9 0,19`} /></g>}
      </g>
    </g>
  );
};

export const Char: React.FC<CharProps> = ({x, y, scale = 1, flip, lean = 0, head = {}, face = {}, handL = [-88, -150], handR = [88, -150], slump = 0, legs = 'none', thumbL = true, thumbR = true, elbowL = 'low', elbowR = 'low', tee = TEE, t, seed = 0, dim = 0, idle = 1, children}) => {
  const inh = Math.sin(t * 1.9 + seed);                     // breathing: chest rises, shoulders lift, head follows a beat late
  const sy = slump * 30 - inh * 2.6 * idle;
  const sway = Math.sin(t * 0.55 + seed * 2) * 0.9 * idle;   // weight shift, the head counter-rotates
  const SL: V = [-112, -318 + sy], SR: V = [112, -318 + sy];
  const j = (a: number, b: number): V => [Math.sin(t * 1.3 + seed + a) * 2 * idle, Math.cos(t * 1.1 + seed * 2 + b) * 2 * idle];
  const hl: V = [handL[0] + j(0, 1)[0], handL[1] + j(0, 1)[1]], hr: V = [handR[0] + j(2, 3)[0], handR[1] + j(2, 3)[1]];
  const tg = `tg${tee.slice(1)}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} style={dim ? {filter: `brightness(${1 - dim})`} : undefined}>
      <defs>
        <linearGradient id={tg} x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stopColor={shade(tee, 0.22)} /><stop offset="0.55" stopColor={tee} /><stop offset="1" stopColor={shade(tee, -0.22)} /></linearGradient>
      </defs>
      {legs === 'sit' && (
        <g>
          {[-1, 1].map((s) => (
            <g key={s}>
              <rect x={s * 80 - 29} y={70} width={58} height={190} rx={29} fill={LIMB} stroke={INK} strokeWidth={7} />
              <ellipse cx={s * 80 + 6} cy={268} rx={64} ry={30} fill={SHOE} stroke={INK} strokeWidth={7} />
              <ellipse cx={s * 80 - 12} cy={262} rx={26} ry={9} fill="#fff" opacity={0.9} />
              <path d={`M ${s * 80 - 56},284 Q ${s * 80 + 6},300 ${s * 80 + 68},284`} fill="none" stroke="#bdb7d3" strokeWidth={5} strokeLinecap="round" />
              <ellipse cx={s * 74} cy={50} rx={74} ry={52} fill={LIMB} stroke={INK} strokeWidth={7} />
              <ellipse cx={s * 74 - 14} cy={36} rx={30} ry={10} fill="#fff" opacity={0.15} />
            </g>
          ))}
        </g>
      )}
      <g transform={`rotate(${lean + sway})`}>
        <path d={`M -122,${-322 + sy} Q -140,-160 -108,6 L 108,6 Q 140,-160 122,${-322 + sy} Q 0,${-352 + sy} -122,${-322 + sy} Z`} fill={`url(#${tg})`} stroke={INK} strokeWidth={8} strokeLinejoin="round" transform={`scale(1 ${1 + inh * 0.012 * idle})`} />
        <path d={`M -86,${-300 + sy} Q -110,-170 -90,-30`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.3} />
        <path d={`M 104,${-280 + sy} Q 126,-150 98,-20`} fill="none" stroke={shade(tee, -0.45)} strokeWidth={10} strokeLinecap="round" opacity={0.35} />
        <path d="M -20,-20 Q 0,-6 22,-22" fill="none" stroke={shade(tee, -0.35)} strokeWidth={5} strokeLinecap="round" opacity={0.35} />
        <path d={`M -52,${-338 + sy} Q 0,${-300 + sy} 52,${-338 + sy}`} fill="none" stroke={TEE_DK} strokeWidth={14} strokeLinecap="round" />
        <rect x={-23} y={-372 + sy} width={46} height={44} rx={12} fill={LIMB} stroke={INK} strokeWidth={6} />
        <ellipse cx={0} cy={-326 + sy} rx={104} ry={34} fill="#000" opacity={0.2} />
        <g transform={`translate(0 ${-352 + sy}) rotate(${(head.tilt ?? 0) + (Math.sin(t * 0.71 + seed * 1.7) * 1.3 - sway * 0.6) * idle}) translate(${(head.dx ?? 0) + Math.sin(t * 0.43 + seed) * 4 * idle} ${-172 + (head.dy ?? 0) + inh * 1.2 * idle})`}>
          <Head face={face} turn={head.turn ?? 0} t={t} seed={seed} idle={idle} />
        </g>
        {children}
        <Arm S={SL} T={hl} s={-1} tee={tee} thumb={thumbL} pref={elbowL} />
        <Arm S={SR} T={hr} s={1} tee={tee} thumb={thumbR} pref={elbowR} />
      </g>
    </g>
  );
};
