// animation polish: contact shadows, hands that ease into each pose with a little overshoot, walking bob; shaded props replace the flat ones
const fs = require('fs');
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) { console.log('MISSING in', file, ':', String(a).slice(0, 90)); continue; } s = s.replace(a, b); }
  fs.writeFileSync(file, s);
};
edit('src/fathers/props.tsx', [
  ['export const giftTop =', 'const giftTopOld ='], ['export const GiftPile:', 'const GiftPileOld:'], ['export const Kite:', 'const KiteOld:'], ['export const Cup:', 'const CupOld:'], ['export const Laptop:', 'const LaptopOld:'],
]);
fs.appendFileSync('src/fathers/props.tsx', "\nexport {GiftPile, giftTop, Laptop, Cup, Kite, Shadow} from './props2';\n");
edit('src/fathers/People.tsx', [
  ["  pose?: PoseName; outfit?: string; top?: string; raise?: number; view?: 'front' | 'side'; handL?: V; handR?: V;", "  pose?: PoseName; outfit?: string; top?: string; raise?: number; view?: 'front' | 'side'; handL?: V; handR?: V; enter?: number;"],
  ["const FRONTY = new Set<PoseName>(['clap', 'film', 'desk', 'type']);", "const FRONTY = new Set<PoseName>(['clap', 'film', 'desk', 'type']);\n// ease into a pose with a little overshoot (anticipation and settle), so every cut starts with a move and not a freeze\nconst settle = (k: number) => { const q = clamp(k, 0, 1) - 1; return 1 + 2.4 * q * q * q + 1.4 * q * q; };\nconst mixV = (a: V, b: V, e: number): V => [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];"],
  ["  const raise = p.raise ?? 1,", "  const e = p.enter === undefined ? 1 : settle(p.enter);\n  const raise = p.raise ?? 1,"],
  ["    const L: V = p.handL ? [p.handL[0], p.handL[1] - 92] : q.L, R: V = p.handR ? [p.handR[0], p.handR[1] - 92] : q.R;", "    const s0 = FRONT.stand(t, 1), L: V = mixV(s0.L, p.handL ? [p.handL[0], p.handL[1] - 92] : q.L, e), R: V = mixV(s0.R, p.handR ? [p.handR[0], p.handR[1] - 92] : q.R, e);"],
  ["  const handN: V = [q.N[0] + arms, q.N[1]], handF: V = [q.F[0] - arms, q.F[1]];", "  const s1 = SIDE.stand(t, 1), handN: V = mixV(s1.N, [q.N[0] + arms, q.N[1]], e), handF: V = mixV(s1.F, [q.F[0] - arms, q.F[1]], e);\n  const bob = walking ? Math.abs(Math.sin(walk * Math.PI * 2)) * 9 * sc : 0;"],
  ["<SideChar x={x} y={y} scale={sc} flip={flip} torso={(p.lean ?? 0) + (q.torso ?? 0) + (sitting ? -6 : 0) + stoop}", "<SideChar x={x} y={y - bob} scale={sc} flip={flip} torso={(p.lean ?? 0) + (q.torso ?? 0) * e + (sitting ? -6 : 0) + stoop + (walking ? 3 : 0)}"],
]);
edit('src/fathers/kit.tsx', [
  ["export const Pe = (c: Ctx, p: Pos, key?: string | number) => <Person key={key} t={c.t} {...p} />;", `// every person stands on a soft contact shadow and eases into the shot's pose over the first half second
const ShadowE: React.FC<{x: number; rx: number}> = ({x, rx}) => (
  <g><defs><radialGradient id="pshadow"><stop offset="0" stopColor="#05060f" stopOpacity="0.5" /><stop offset="0.6" stopColor="#05060f" stopOpacity="0.24" /><stop offset="1" stopColor="#05060f" stopOpacity="0" /></radialGradient></defs><ellipse cx={x} cy={FLOOR + 6} rx={rx} ry={rx * 0.13} fill="url(#pshadow)" /></g>
);
export const Pe = (c: Ctx, p: Pos, key?: string | number) => (
  <g key={key}><ShadowE x={p.x} rx={190 * p.scale * bodyK(p.who, p.age) * CHAR_K} /><Person t={c.t} enter={c.l / 0.55} {...p} /></g>
);`],
]);
console.log('patched 8');
